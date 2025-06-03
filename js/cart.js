const API_BASKET = "https://food-delivery.int.kreosoft.space/api/basket";
const token = auth.getToken();

const cartContainer = document.getElementById("cartContainer");
const clearCartBtn = document.getElementById("clearCartBtn");
const checkoutBtn = document.getElementById("checkoutBtn");

const toastEl = document.getElementById("toast");
const toastMsg = document.getElementById("toastMessage");
const toast = new bootstrap.Toast(toastEl);

function showToast(msg, success = false) {
  toastMsg.textContent = msg;
  toastEl.classList.remove("bg-danger", "bg-success");
  toastEl.classList.add(success ? "bg-success" : "bg-danger");
  toast.show();
}

async function loadCart() {
  cartContainer.innerHTML = `<div class="text-center my-5"><div class="spinner-border text-warning" role="status"><span class="visually-hidden">Loading...</span></div></div>`;
  try {
    const res = await fetch(API_BASKET, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Failed to load cart");
    const dishes = await res.json();
    renderCart(dishes);
  } catch (err) {
    showToast(err.message);
    cartContainer.innerHTML = '<p class="text-center text-danger mt-5">Failed to load cart.</p>';
  }
}

function renderCart(dishes) {
  if (!dishes.length) {
    cartContainer.innerHTML = '<p class="text-center mt-4">Your cart is empty.</p>';
    checkoutBtn.disabled = true;
    clearCartBtn.disabled = true;
    return;
  }
  checkoutBtn.disabled = false;
  clearCartBtn.disabled = false;

  let totalPrice = 0;
  const rows = dishes.map(dish => {
    totalPrice += dish.totalPrice;
    return `
      <tr>
        <td>${dish.name}</td>
        <td>
          <button class="btn btn-sm btn-outline-danger decrease-btn" data-id="${dish.id}">-</button>
          <span class="mx-2">${dish.amount}</span>
          <button class="btn btn-sm btn-outline-success increase-btn" data-id="${dish.id}">+</button>
        </td>
        <td>$${dish.price.toFixed(2)}</td>
        <td>$${dish.totalPrice.toFixed(2)}</td>
        <td><button class="btn btn-sm btn-danger remove-btn" data-id="${dish.id}">Remove</button></td>
      </tr>
    `;
  }).join("");

  cartContainer.innerHTML = `
    <table class="table table-striped align-middle">
      <thead class="table-warning">
        <tr>
          <th>Dish</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Total Price</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
      <tfoot>
        <tr>
          <td colspan="3" class="text-end fw-semibold">Total:</td>
          <td colspan="2" class="fw-bold">$${totalPrice.toFixed(2)}</td>
        </tr>
      </tfoot>
    </table>
  `;

  // Add event listeners for buttons
  document.querySelectorAll(".increase-btn").forEach(btn => {
    btn.addEventListener("click", () => changeDishAmount(btn.dataset.id, true));
  });

  document.querySelectorAll(".decrease-btn").forEach(btn => {
    btn.addEventListener("click", () => changeDishAmount(btn.dataset.id, false));
  });

  document.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", () => removeDish(btn.dataset.id));
  });
}

async function changeDishAmount(dishId, increase) {
  try {
    if (increase) {
      // Increase quantity via POST
      const res = await fetch(`${API_BASKET}/dish/${dishId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to increase quantity");
      showToast("Increased quantity", true);
    } else {
      // Decrease quantity via DELETE
      const res = await fetch(`${API_BASKET}/dish/${dishId}?increase=true`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to decrease quantity");
      showToast("Decreased quantity", true);
    }

    loadCart();
  } catch (err) {
    showToast(err.message);
  }
}


async function removeDish(dishId) {
  try {
    const url = new URL(`${API_BASKET}/dish/${dishId}`);
    url.searchParams.set("increase", false);
    const res = await fetch(url, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Failed to remove dish");
    showToast("Dish removed", true);
    loadCart();
  } catch (err) {
    showToast(err.message);
  }
}

clearCartBtn.addEventListener("click", async () => {
  try {
    const res = await fetch(API_BASKET, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Failed to load cart");
    const dishes = await res.json();

    // Remove each dish completely
    for (const dish of dishes) {
      await fetch(`${API_BASKET}/dish/${dish.id}?increase=false`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
    }
    showToast("Cart cleared", true);
    loadCart();
  } catch (err) {
    showToast(err.message);
  }
});

checkoutBtn.addEventListener("click", () => {
  window.location.href = "purchase.html";
});

document.addEventListener("DOMContentLoaded", () => {
  if (!token) window.location.href = "login.html";
  else loadCart();
});
