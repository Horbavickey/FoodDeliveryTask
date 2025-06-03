const API_ORDERS = "https://food-delivery.int.kreosoft.space/api/order";
const token = auth.getToken();

const ordersContainer = document.getElementById("ordersContainer");

const toastEl = document.getElementById("toast");
const toastMsg = document.getElementById("toastMessage");
const toast = new bootstrap.Toast(toastEl);

function showToast(msg, success = false) {
  toastMsg.textContent = msg;
  toastEl.classList.remove("bg-danger", "bg-success");
  toastEl.classList.add(success ? "bg-success" : "bg-danger");
  toast.show();
}

async function loadOrders() {
  ordersContainer.innerHTML = `<div class="text-center my-5"><div class="spinner-border text-warning" role="status"><span class="visually-hidden">Loading...</span></div></div>`;
  try {
    const res = await fetch(API_ORDERS, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Failed to load orders");
    const orders = await res.json();
    renderOrders(orders);
  } catch (err) {
    showToast(err.message);
    ordersContainer.innerHTML = '<p class="text-center text-danger mt-5">Failed to load orders.</p>';
  }
}

function renderOrders(orders) {
  if (!orders.length) {
    ordersContainer.innerHTML = '<p class="text-center mt-4">No orders found.</p>';
    return;
  }

  const rows = orders.map(order => {
    const deliveryTime = new Date(order.deliveryTime).toLocaleString();
    const orderTime = new Date(order.orderTime).toLocaleString();
    return `
      <tr>
        <td>${order.id}</td>
        <td>${order.status}</td>
        <td>${order.price.toFixed(2)}</td>
        <td>${orderTime}</td>
        <td>${deliveryTime}</td>
        <td>
          <a href="order_details.html?id=${order.id}" class="btn btn-sm btn-warning">Details</a>
        </td>
      </tr>
    `;
  }).join("");

  ordersContainer.innerHTML = `
    <table class="table table-striped align-middle">
      <thead class="table-warning">
        <tr>
          <th>Order ID</th>
          <th>Status</th>
          <th>Total Price</th>
          <th>Order Time</th>
          <th>Delivery Time</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  if (!token) window.location.href = "login.html";
  else loadOrders();
});
