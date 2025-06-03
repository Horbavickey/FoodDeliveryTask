// js/dish.js

const token = auth.getToken();

const toastEl = document.getElementById("toast");
const toastMsg = document.getElementById("toastMessage");
const toast = new bootstrap.Toast(toastEl);

const dishNameEl = document.getElementById("dishName");
const dishImageEl = document.getElementById("dishImage");
const dishDescriptionEl = document.getElementById("dishDescription");
const dishCategoryEl = document.getElementById("dishCategory");
const dishPriceEl = document.getElementById("dishPrice");
const dishVegetarianEl = document.getElementById("dishVegetarian");

const ratingStarsEl = document.getElementById("ratingStars");
const addToCartBtn = document.getElementById("addToCartBtn");

let dishId = null;
let userCanRate = false;
let currentRating = 0;

function showToast(msg, success = false) {
  toastMsg.textContent = msg;
  toastEl.classList.remove("bg-danger", "bg-success");
  toastEl.classList.add(success ? "bg-success" : "bg-danger");
  toast.show();
}

function getDishIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

async function fetchDish() {
  try {
    const res = await fetch(`https://food-delivery.int.kreosoft.space/api/dish/${dishId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    if (!res.ok) throw new Error("Failed to fetch dish details");
    return await res.json();
  } catch (err) {
    showToast(err.message);
    return null;
  }
}

async function canUserRate() {
  if (!token) return false;
  try {
    const res = await fetch(`https://food-delivery.int.kreosoft.space/api/dish/${dishId}/rating/check`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to check rating permission");
    return await res.json();
  } catch (err) {
    showToast(err.message);
    return false;
  }
}

function renderStars(rating, interactive = false) {
  ratingStarsEl.innerHTML = "";
  for (let i = 1; i <= 10; i++) {
    const star = document.createElement("span");
    star.textContent = "★";
    star.className = "star " + (i <= rating ? "" : "inactive");
    if (interactive) {
      star.style.cursor = "pointer";
      star.addEventListener("mouseenter", () => highlightStars(i));
      star.addEventListener("mouseleave", () => highlightStars(currentRating));
      star.addEventListener("click", () => submitRating(i));
    }
    ratingStarsEl.appendChild(star);
  }
}

function highlightStars(rating) {
  Array.from(ratingStarsEl.children).forEach((star, idx) => {
    star.classList.toggle("inactive", idx >= rating);
  });
}

async function submitRating(score) {
  if (!token) {
    showToast("You must be logged in to rate.");
    return;
  }
  try {
    const url = new URL(`https://food-delivery.int.kreosoft.space/api/dish/${dishId}/rating`);
    url.searchParams.set("ratingScore", score);

    const res = await fetch(url.toString(), {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || "Failed to submit rating");
    }
    currentRating = score;
    renderStars(currentRating, true);
    showToast("Rating submitted successfully!", true);
  } catch (err) {
    showToast(err.message);
  }
}

async function addToCart() {
  if (!token) {
    showToast("You must be logged in to add to cart.");
    return;
  }
  try {
    const res = await fetch(`https://food-delivery.int.kreosoft.space/api/basket/dish/${dishId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to add dish to cart");
    showToast("Dish added to cart!", true);
  } catch (err) {
    showToast(err.message);
  }
}

async function init() {
  dishId = getDishIdFromUrl();
  if (!dishId) {
    showToast("Dish ID is missing in URL.");
    return;
  }

  const dish = await fetchDish();
  if (!dish) return;

  dishNameEl.textContent = dish.name;
  dishImageEl.src = dish.image || "images/placeholder.jpg";
  dishDescriptionEl.textContent = dish.description || "";
  dishCategoryEl.textContent = dish.category;
  dishPriceEl.textContent = dish.price.toFixed(2);
  dishVegetarianEl.textContent = dish.vegetarian ? "Yes" : "No";

  userCanRate = await canUserRate();
  currentRating = dish.rating || 0;

  renderStars(currentRating, userCanRate);

  addToCartBtn.addEventListener("click", addToCart);
}

document.addEventListener("DOMContentLoaded", () => {
  init();
});
