// js/toast.js

const toastEl = document.getElementById("toast");
const toastMsg = document.getElementById("toastMessage");
const toastInstance = new bootstrap.Toast(toastEl);

function showToast(message, type = "error") {
  toastMsg.textContent = message;

  toastEl.classList.remove("bg-danger", "bg-success", "bg-warning");
  if (type === "error") {
    toastEl.classList.add("bg-danger");
  } else if (type === "success") {
    toastEl.classList.add("bg-success");
  } else if (type === "warning") {
    toastEl.classList.add("bg-warning");
  }

  toastInstance.show();
}

export { showToast };
