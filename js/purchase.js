// js/purchase.js

const token = auth.getToken();

const purchaseForm = document.getElementById("purchaseForm");
const toastEl = document.getElementById("toast");
const toastMsg = document.getElementById("toastMessage");
const toast = new bootstrap.Toast(toastEl);

function showToast(msg, success = false) {
  toastMsg.textContent = msg;
  toastEl.classList.remove("bg-danger", "bg-success");
  toastEl.classList.add(success ? "bg-success" : "bg-danger");
  toast.show();
}

async function fetchCart() {
  const res = await fetch("https://food-delivery.int.kreosoft.space/api/basket", {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Failed to fetch cart items");
  return await res.json();
}

purchaseForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const address = document.getElementById("address").value.trim();
  const deliveryTime = document.getElementById("deliveryTime").value;

  if (!address) {
    showToast("Delivery address is required.");
    return;
  }
  if (!deliveryTime) {
    showToast("Delivery time is required.");
    return;
  }

  try {
    const cartItems = await fetchCart();
    if (!cartItems.length) {
      showToast("Your cart is empty.");
      return;
    }

    const orderCreateDto = {
      address,
      deliveryTime: new Date(deliveryTime).toISOString()
    };

    const res = await fetch("https://food-delivery.int.kreosoft.space/api/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(orderCreateDto)
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || "Failed to create order");
    }

    showToast("Order placed successfully!", true);
    // Redirect to orders page after 2 seconds
    setTimeout(() => window.location.href = "orders.html", 2000);
  } catch (err) {
    showToast(err.message);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  if (!token) window.location.href = "login.html";
});
