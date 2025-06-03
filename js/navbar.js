// js/navbar.js

async function loadNavbar() {
  try {
    const res = await fetch("components/navbar.html");
    if (!res.ok) throw new Error("Failed to load navbar");
    const html = await res.text();
    document.getElementById("navbarContainer").innerHTML = html;
    updateAuthArea();
  } catch (err) {
    console.error(err);
  }
}

function createNavLink(href, text, clickHandler = null) {
  const li = document.createElement("li");
  li.className = "nav-item";

  const a = document.createElement("a");
  a.className = "nav-link text-dark fw-semibold";
  a.href = href;
  a.textContent = text;

  if (clickHandler) {
    a.addEventListener("click", clickHandler);
  }

  li.appendChild(a);
  return li;
}

// async function updateAuthArea() {
//   const authArea = document.getElementById("authArea");
//   if (!authArea) {
//     console.error("authArea element not found");
//     return;
//   }

//   const token = auth.getToken();
//   authArea.innerHTML = "";

//   if (!token) {
//     authArea.appendChild(createNavLink("login.html", "Login"));
//     authArea.appendChild(createNavLink("register.html", "Register"));
//   } else {
//     try {
//       const profile = await auth.fetchProfile();
//       const welcomeLi = document.createElement("li");
//       welcomeLi.className = "nav-item nav-link text-dark fw-semibold";
//       welcomeLi.textContent = `Welcome, ${profile.fullName}`;

//       authArea.appendChild(welcomeLi);

//       const logoutLi = createNavLink("#", "Logout", async (e) => {
//         e.preventDefault();
//         await auth.logout();
//         updateAuthArea();
//         window.location.href = "index.html";
//       });
//       authArea.appendChild(logoutLi);
//     } catch {
//       auth.clearToken();
//       authArea.appendChild(createNavLink("login.html", "Login"));
//       authArea.appendChild(createNavLink("register.html", "Register"));
//     }
//   }
// }
async function updateAuthArea() {
  const authArea = document.getElementById("authArea");
  if (!authArea) {
    console.error("authArea element not found");
    return;
  }

  const token = auth.getToken();
  authArea.innerHTML = "";

  if (!token) {
    authArea.appendChild(createNavLink("login.html", "Login"));
    authArea.appendChild(createNavLink("register.html", "Register"));
  } else {
    try {
      const profile = await auth.fetchProfile();

      // 👇 Add welcome message
      const welcomeLi = document.createElement("li");
      welcomeLi.className = "nav-item nav-link text-dark fw-semibold";
      welcomeLi.textContent = `Welcome, ${profile.fullName}`;
      authArea.appendChild(welcomeLi);

      // 👇 Add Profile link
      authArea.appendChild(createNavLink("profile.html", "Profile"));

      // 👇 Add Logout link
      const logoutLi = createNavLink("#", "Logout", async (e) => {
        e.preventDefault();
        await auth.logout();
        updateAuthArea();
        window.location.href = "index.html";
      });
      authArea.appendChild(logoutLi);

    } catch {
      // Token expired or invalid
      auth.clearToken();
      authArea.appendChild(createNavLink("login.html", "Login"));
      authArea.appendChild(createNavLink("register.html", "Register"));
    }
  }
}


document.addEventListener("DOMContentLoaded", loadNavbar);
