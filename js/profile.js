// js/profile.js

const toastEl = document.getElementById("toast");
const toastMsg = document.getElementById("toastMessage");
const toast = new bootstrap.Toast(toastEl);

function showToast(message, success = false) {
  toastMsg.textContent = message;
  toastEl.classList.remove("bg-danger", "bg-success");
  toastEl.classList.add(success ? "bg-success" : "bg-danger");
  toast.show();
}

async function loadProfile() {
  try {
    const user = await auth.fetchProfile();
    if (!user) {
      showToast("Please log in first.");
      window.location.href = "login.html";
      return;
    }

    document.getElementById("fullName").value = user.fullName || "";
    document.getElementById("email").value = user.email || "";
    document.getElementById("gender").value = user.gender || "";
    document.getElementById("birthDate").value = user.birthDate ? user.birthDate.slice(0, 10) : "";
    document.getElementById("phoneNumber").value = user.phoneNumber || "";
    document.getElementById("address").value = user.address || "";

  } catch (err) {
    showToast("Failed to load profile.");
  }
}

document.getElementById("profileForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    fullName: document.getElementById("fullName").value.trim(),
    gender: document.getElementById("gender").value,
    birthDate: document.getElementById("birthDate").value || null,
    phoneNumber: document.getElementById("phoneNumber").value.trim() || null,
    address: document.getElementById("address").value.trim() || null
  };

  if (!data.fullName) {
    showToast("Full name is required.");
    return;
  }

  if (!data.gender) {
    showToast("Please select your gender.");
    return;
  }

  try {
    const res = await fetch("https://food-delivery.int.kreosoft.space/api/account/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.getToken()}`
      },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || "Failed to update profile.");
    }

    showToast("Profile updated successfully!", true);

  } catch (err) {
    showToast(err.message);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  if (!auth.getToken()) window.location.href = "login.html";
  else loadProfile();
});
