const API_REGISTER = "https://food-delivery.int.kreosoft.space/api/account/register";

const toastEl = document.getElementById("toast");
const toastMsg = document.getElementById("toastMessage");
const toast = new bootstrap.Toast(toastEl);

function showToast(msg, success = false) {
  toastMsg.textContent = msg;
  toastEl.classList.remove("bg-danger", "bg-success");
  toastEl.classList.add(success ? "bg-success" : "bg-danger");
  toast.show();
}

const registerForm = document.getElementById("registerForm");
if (registerForm) {
  const phoneInput = document.getElementById("phoneNumber");

  // Setup phone mask using IMask
  const phoneMask = IMask(phoneInput, {
    mask: '+{7} (000) 000-00-00',
    lazy: false,
  });

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const gender = document.getElementById("gender").value;
    const birthDateRaw = document.getElementById("birthDate").value;
    const addressRaw = document.getElementById("address").value.trim();
    const phoneMasked = phoneMask.unmaskedValue;

    // === Validation ===
    if (!fullName) return showToast("Full name is required.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showToast("Invalid email format.");
    if (!gender || !["Male", "Female"].includes(gender)) return showToast("Please select a valid gender.");
    if (password.length < 6) return showToast("Password must be at least 6 characters.");

    const birthDate = birthDateRaw ? new Date(birthDateRaw).toISOString() : null;
    const address = addressRaw || null;
    const phoneNumber = phoneMasked ? `+7${phoneMasked}` : null;

    const payload = {
      fullName,
      email,
      password,
      gender,
      birthDate,
      address,
      phoneNumber,
    };

    try {
      const res = await fetch(API_REGISTER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Registration failed. Check all required fields.");
      }

      const result = await res.json();
      auth.setToken(result.token);
      showToast("Registration successful!", true);

      // Redirect to menu after short delay
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1500);

    } catch (err) {
      console.error("Registration error:", err);
      showToast(err.message || "Unexpected error occurred.");
    }
  });
}
