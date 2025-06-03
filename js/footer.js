// js/footer.js

document.addEventListener("DOMContentLoaded", () => {
  fetch("/components/footer.html")
    .then(res => {
      if (!res.ok) throw new Error("Failed to load footer");
      return res.text();
    })
    .then(html => {
      document.getElementById("footerContainer").innerHTML = html;
    })
    .catch(() => {
      // If fetch fails, fallback to simple footer content
      document.getElementById("footerContainer").innerHTML = `
        <footer class="bg-warning text-dark py-4 mt-auto">
          <div class="container text-center">
            <p class="mb-1 fw-semibold">© 2025 Horbavickey Foods. All rights reserved.</p>
            <p class="mb-0 fst-italic">"Fresh flavors delivered to your doorstep!"</p>
          </div>
        </footer>
      `;
    });
});
