// js/menu.js

const API_DISH = "https://food-delivery.int.kreosoft.space/api/dish";
const token = auth.getToken();

if (!token) {
  window.location.href = "login.html";
  throw new Error("Unauthorized access - redirecting to login");
}

const menuList = document.getElementById("menuList");
const pagination = document.getElementById("pagination");

const filters = {
  categories: new Set(),
  vegetarian: false,
  sorting: "",
  page: 1,
};

const categoryCheckboxes = {
  Wok: document.getElementById("filterWok"),
  Pizza: document.getElementById("filterPizza"),
  Soup: document.getElementById("filterSoup"),
  Dessert: document.getElementById("filterDessert"),
  Drink: document.getElementById("filterDrink"),
};

const vegetarianCheckbox = document.getElementById("onlyVegetarian");
const sortSelect = document.getElementById("sortBy");
const applyFiltersBtn = document.getElementById("applyFilters");

const toastEl = document.getElementById("toast");
const toastMsg = document.getElementById("toastMessage");
const toast = new bootstrap.Toast(toastEl);

function showToast(msg, success = false) {
  toastMsg.textContent = msg;
  toastEl.classList.remove("bg-danger", "bg-success");
  toastEl.classList.add(success ? "bg-success" : "bg-danger");
  toast.show();
}

function getSelectedCategories() {
  return Object.entries(categoryCheckboxes)
    .filter(([_, checkbox]) => checkbox.checked)
    .map(([category]) => category);
}

async function loadDishes() {
  menuList.innerHTML = `<div class="text-center my-5"><div class="spinner-border text-warning" role="status"><span class="visually-hidden">Loading...</span></div></div>`;
  try {
    const params = new URLSearchParams();
    params.append("page", filters.page);
    if (filters.sorting) params.append("sorting", filters.sorting);
    if (filters.vegetarian) params.append("vegetarian", filters.vegetarian);
    const cats = getSelectedCategories();
    cats.forEach(cat => params.append("categories", cat));

    const res = await fetch(`${API_DISH}?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error("Failed to load dishes");
    const data = await res.json();

    renderDishes(data.dishes || []);
    renderPagination(data.pagination);
  } catch (err) {
    showToast(err.message);
    menuList.innerHTML = '<p class="text-center text-danger mt-5">Failed to load menu.</p>';
  }
}

function renderDishes(dishes) {
  menuList.innerHTML = "";
  if (!dishes.length) {
    menuList.innerHTML = '<p class="text-center mt-4">No dishes found for selected filters.</p>';
    return;
  }

  dishes.forEach(dish => {
    const col = document.createElement("div");
    col.className = "col";

    col.innerHTML = `
      <div class="card h-100 shadow-sm dish-card">
        <img src="${dish.image || 'images/placeholder.jpg'}" class="card-img-top" alt="${dish.name}" style="cursor:pointer;" data-id="${dish.id}" />
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${dish.name}</h5>
          <p class="card-text text-muted">${dish.description || ''}</p>
          <div class="mt-auto d-flex justify-content-between align-items-center">
            <span class="text-warning fw-bold">$${dish.price.toFixed(2)}</span>
            <div class="star-rating">${renderStars(dish.rating)}</div>
          </div>
          <button class="btn btn-warning mt-3 add-to-cart-btn" data-id="${dish.id}">Add to Cart</button>
        </div>
      </div>
    `;

    menuList.appendChild(col);
  });

  // Image click → dish detail
  document.querySelectorAll(".card-img-top").forEach(img => {
    img.addEventListener("click", e => {
      const id = e.target.dataset.id;
      window.location.href = `dish.html?id=${id}`;
    });
  });

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Generates a string containing star icons to visually represent a rating.
 * 
 * @param {number|null|undefined} rating - The numeric rating value, where a full star 
 * represents a whole number and a half star represents a fractional part of 0.5.
 * If the rating is null or undefined, an empty string is returned.
 * 
 * @returns {string} An HTML string with up to five star icons (full and half),
 * wrapped in a span element with Bootstrap classes for styling.
 */

/*******  78ccd8c2-12b2-40b1-91f0-6cee748f7f27  *******/  // Add to cart
  document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
    btn.addEventListener("click", () => addToCart(btn.dataset.id));
  });
}

function renderStars(rating) {
  if (rating === null || rating === undefined) return "";
  let starsHtml = "";
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;
  for (let i = 0; i < fullStars; i++) starsHtml += "★";
  if (halfStar) starsHtml += "☆";
  while (starsHtml.length < 5) starsHtml += "☆";
  return `<span class="text-warning fs-5">${starsHtml}</span>`;
}

function renderPagination(paginationData) {
  const ul = pagination;
  if (!ul) return;

  const current = paginationData?.current || 1;
  const count = paginationData?.count || 1;

  ul.innerHTML = "";

  ul.innerHTML += `<li class="page-item ${current === 1 ? "disabled" : ""}">
    <a class="page-link" href="#" data-page="${current - 1}">&laquo;</a>
  </li>`;

  let start = Math.max(1, current - 2);
  let end = Math.min(count, start + 4);
  start = Math.max(1, end - 4);

  for (let i = start; i <= end; i++) {
    ul.innerHTML += `<li class="page-item ${current === i ? "active" : ""}">
      <a class="page-link" href="#" data-page="${i}">${i}</a>
    </li>`;
  }

  ul.innerHTML += `<li class="page-item ${current === count ? "disabled" : ""}">
    <a class="page-link" href="#" data-page="${current + 1}">&raquo;</a>
  </li>`;

  ul.querySelectorAll("a.page-link").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const page = parseInt(link.dataset.page);
      if (!isNaN(page) && page >= 1 && page <= count && page !== filters.page) {
        filters.page = page;
        loadDishes();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  });
}

async function addToCart(dishId) {
  try {
    const res = await fetch(`https://food-delivery.int.kreosoft.space/api/basket/dish/${dishId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error("Failed to add dish to cart");
    showToast("Added to cart", true);
  } catch (err) {
    showToast(err.message);
  }
}

applyFiltersBtn.addEventListener("click", () => {
  filters.categories.clear();
  for (const [cat, checkbox] of Object.entries(categoryCheckboxes)) {
    if (checkbox.checked) filters.categories.add(cat);
  }
  filters.vegetarian = vegetarianCheckbox.checked;
  filters.sorting = sortSelect.value;
  filters.page = 1;
  loadDishes();
});

document.addEventListener("DOMContentLoaded", () => {
  for (const checkbox of Object.values(categoryCheckboxes)) checkbox.checked = false;
  vegetarianCheckbox.checked = false;
  sortSelect.value = "";
  filters.categories.clear();
  filters.vegetarian = false;
  filters.sorting = "";
  filters.page = 1;
  loadDishes();
});
