// shop-sheet.js
// Lista produktów + filtrowanie po kategoriach (panel po prawej)

document.addEventListener("DOMContentLoaded", async () => {
  const grid =
    document.getElementById("products") ||
    document.getElementById("shop-grid") ||
    document.getElementById("jm-products");

  const catContainer = document.getElementById("shop-categories");

  if (!grid) {
    console.error("Nie znaleziono kontenera na produkty (products/shop-grid/jm-products).");
    return;
  }

  let products = [];
  try {
    products = await loadJMProducts();
  } catch (e) {
    console.error("Błąd przy ładowaniu produktów:", e);
    grid.innerHTML = "<p>Nie udało się załadować produktów.</p>";
    return;
  }

  if (!products || !products.length) {
    grid.innerHTML = "<p>Brak produktów do wyświetlenia.</p>";
    return;
  }

  // czyścimy
  grid.innerHTML = "";

  const cards = [];
  const categoriesSet = new Set();

  products.forEach((p) => {
    if (p.status && String(p.status).toLowerCase() === "sold") return;

    const name = p.name_pl || p.name_en || `Produkt ${p.id}`;
    const price_pln = p.price_pln ? `${p.price_pln} PLN` : "";
    const size = p.size || "";
    const img = p.images && p.images.length ? p.images[0] : "";
    const category = (p.category || "").toString().trim();

    if (category) {
      categoriesSet.add(category);
    }

    const card = document.createElement("a");
    card.className = "jm-card jm-card--product";
    card.href = `product.html?id=${encodeURIComponent(p.id)}`;
    card.dataset.category = category.toLowerCase();

    card.innerHTML = `
      ${
        img
          ? `<img class="jm-card-image" src="${img}" alt="${name}" loading="lazy" />`
          : `<div class="jm-card-image jm-card-image--placeholder">Brak zdjęcia</div>`
      }
      <div class="jm-card-body">
        <h3>${name}</h3>
        <p class="jm-product-price">
          ${price_pln}
          ${size ? `<span class="jm-product-size-label">${size}</span>` : ""}
        </p>
      </div>
    `;

    grid.appendChild(card);
    cards.push(card);
  });

  // === Kategorie w sidebarze ===
  if (catContainer) {
    const categories = Array.from(categoriesSet).sort((a, b) =>
      a.localeCompare(b, "pl")
    );

    // "Wszystko" na górze
    const allBtn = createCategoryButton("Wszystko", "all");
    allBtn.classList.add("jm-filter-pill--active");
    catContainer.appendChild(allBtn);

    categories.forEach((cat) => {
      const key = cat.toLowerCase();
      const btn = createCategoryButton(cat, key);
      catContainer.appendChild(btn);
    });

    function createCategoryButton(label, key) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "jm-filter-pill";
      btn.textContent = label;
      btn.dataset.key = key;

      btn.addEventListener("click", () => {
        // zaznacz aktywny
        catContainer
          .querySelectorAll(".jm-filter-pill")
          .forEach((b) => b.classList.remove("jm-filter-pill--active"));
        btn.classList.add("jm-filter-pill--active");

        // filtruj karty
        filterProducts(key);
      });

      return btn;
    }

    function filterProducts(key) {
      const normalized = key === "all" ? "all" : key.toLowerCase();

      cards.forEach((card) => {
        const cardCat = (card.dataset.category || "").toLowerCase();
        if (normalized === "all" || cardCat === normalized) {
          card.style.display = "";
        } else {
          card.style.display = "none";
        }
      });
    }
  }
});
