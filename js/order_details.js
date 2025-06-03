const token = auth.getToken();
const toastEl = document.getElementById("toast");
const toastMsg = document.getElementById("toastMessage");
const toast = new bootstrap.Toast(toastEl);

const orderDetailsContainer = document.getElementById("orderDetailsContainer");
const confirmDeliveryBtn = document.getElementById("confirmDeliveryBtn");

function showToast(msg, success = false) {
  toastMsg.textContent = msg;
  toastEl.classList.remove("bg-danger", "bg-success");
  toastEl.classList.add(success ? "bg-success" : "bg-danger");
  toast.show();
}

function getOrderIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

async function loadOrderDetails() {
  const orderId = getOrderIdFromUrl();
  if (!orderId) {
    showToast("Order ID not specified.");
    return;
  }

  orderDetailsContainer.innerHTML = `<div class="text-center my-5"><div class="spinner-border text-warning" role="status"><span class="visually-hidden">Loading...</span></div></div>`;

  try {
    const res = await fetch(`https://food-delivery.int.kreosoft.space/api/order/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Failed to load order details");
    const order = await res.json();

    renderOrderDetails(order);
    if (order.status === "InProcess") {
      confirmDeliveryBtn.style.display = "inline-block";
    }
  } catch (err) {
    showToast(err.message);
    orderDetailsContainer.innerHTML = '<p class="text-center text-danger mt-5">Failed to load order details.</p>';
  }
}

function renderOrderDetails(order) {
  const dishesRows = order.dishes.map(dish => `
    <tr>
      <td>${dish.name}</td>
      <td>${dish.amount}</td>
      <td>$${dish.price.toFixed(2)}</td>
      <td>$${dish.totalPrice.toFixed(2)}</td>
    </tr>
  `).join("");

  orderDetailsContainer.innerHTML = `
    <dl class="row mb-4">
      <dt class="col-sm-4">Order ID:</dt>
      <dd class="col-sm-8">${order.id}</dd>

      <dt class="col-sm-4">Status:</dt>
      <dd class="col-sm-8">${order.status}</dd>

      <dt class="col-sm-4">Order Time:</dt>
      <dd class="col-sm-8">${new Date(order.orderTime).toLocaleString()}</dd>

      <dt class="col-sm-4">Delivery Time:</dt>
      <dd class="col-sm-8">${new Date(order.deliveryTime).toLocaleString()}</dd>

      <dt class="col-sm-4">Delivery Address:</dt>
      <dd class="col-sm-8">${order.address}</dd>

      <dt class="col-sm-4">Total Price:</dt>
      <dd class="col-sm-8 fw-bold">$${order.price.toFixed(2)}</dd>
    </dl>

    <h5>Dishes:</h5>
    <table class="table table-striped align-middle">
      <thead class="table-warning">
        <tr>
          <th>Name</th>
          <th>Amount</th>
          <th>Price</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        ${dishesRows}
      </tbody>
    </table>
  `;
}

confirmDeliveryBtn.addEventListener("click", async () => {
  const orderId = getOrderIdFromUrl();
  if (!orderId) return;

  confirmDeliveryBtn.disabled = true;
  confirmDeliveryBtn.textContent = "Confirming...";

  try {
    const res = await fetch(`https://food-delivery.int.kreosoft.space/api/order/${orderId}/status`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Failed to confirm delivery");
    showToast("Order marked as delivered!", true);
    confirmDeliveryBtn.style.display = "none";
    loadOrderDetails();
  } catch (err) {
    showToast(err.message);
  } finally {
    confirmDeliveryBtn.disabled = false;
    confirmDeliveryBtn.textContent = "Confirm Delivery";
  }
});

document.addEventListener("DOMContentLoaded", () => {
  if (!token) window.location.href = "login.html";
  else loadOrderDetails();
});
