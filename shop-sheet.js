// shop-sheet.js
// Lista produktów + drzewko: kategoria -> podkategorie z filtrowaniem

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
  const categoryMap = new Map(); // category -> Set(subcategory)

  products.forEach((p) => {
    if (p.status && String(p.status).toLowerCase() === "sold") return;

    const name = p.name_pl || p.name_en || `Produkt ${p.id}`;
    const price_pln = p.price_pln ? `${p.price_pln} PLN` : "";
    const size = p.size || "";
    const img = p.images && p.images.length ? p.images[0] : "";

    let category = (p.category || "").toString().trim();
    let subcat = (p.subcategory || "").toString().trim();

    if (!category && subcat) {
      category = "Inne";
    }
    if (!category) {
      category = "Inne";
    }

    // zbieramy kategorie -> podkategorie
    if (!categoryMap.has(category)) {
      categoryMap.set(category, new Set());
    }
    if (subcat) {
      categoryMap.get(category).add(subcat);
    }

    const card = document.createElement("a");
    card.className = "jm-card jm-card--product";
    card.href = `product.html?id=${encodeURIComponent(p.id)}`;
    card.dataset.category = category.toLowerCase();
    card.dataset.subcategory = (subcat || "").toLowerCase();

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

  // === Sidebar: kategorie + podkategorie ===
  if (catContainer) {
    catContainer.innerHTML = "";

    // przycisk "Wszystko"
    const allBtn = document.createElement("button");
    allBtn.type = "button";
    allBtn.className = "jm-filter-pill jm-filter-pill--active";
    allBtn.textContent = "Wszystko";
    allBtn.dataset.filterType = "all";
    catContainer.appendChild(allBtn);

    allBtn.addEventListener("click", () => {
      setActiveFilter(allBtn);
      applyFilter("all", null);
    });

    // sortujemy kategorie po nazwie
    const categories = Array.from(categoryMap.keys()).sort((a, b) =>
      a.localeCompare(b, "pl")
    );

    categories.forEach((catName) => {
      const subSet = categoryMap.get(catName);
      const subcategories = Array.from(subSet).sort((a, b) =>
        a.localeCompare(b, "pl")
      );

      const wrapper = document.createElement("div");
      wrapper.className = "jm-filter-category";

      // nagłówek kategorii (klik = filtr po kategorii + toggle rozwinięcia)
      const headerBtn = document.createElement("button");
      headerBtn.type = "button";
      headerBtn.className = "jm-filter-category-header";
      headerBtn.textContent = catName;
      headerBtn.dataset.filterType = "category";
      headerBtn.dataset.key = catName.toLowerCase();

      const caret = document.createElement("span");
      caret.className = "jm-filter-caret";
      caret.textContent = "▾";
      headerBtn.appendChild(caret);

      wrapper.appendChild(headerBtn);

      // kontener na podkategorie
      const subList = document.createElement("div");
      subList.className = "jm-filter-sublist jm-filter-sublist--collapsed";

      subcategories.forEach((subName) => {
        const subBtn = document.createElement("button");
        subBtn.type = "button";
        subBtn.className = "jm-filter-pill jm-filter-pill--sub";
        subBtn.textContent = subName;
        subBtn.dataset.filterType = "subcategory";
        subBtn.dataset.key = subName.toLowerCase();

        subBtn.addEventListener("click", () => {
          setActiveFilter(subBtn);
          applyFilter("subcategory", subName.toLowerCase());
        });

        subList.appendChild(subBtn);
      });

      wrapper.appendChild(subList);
      catContainer.appendChild(wrapper);

      // klik w nagłówek kategorii
      headerBtn.addEventListener("click", () => {
        // filtruj po kategorii
        setActiveFilter(headerBtn);
        applyFilter("category", catName.toLowerCase());

        // toggle rozwinięcia
        subList.classList.toggle("jm-filter-sublist--collapsed");
        caret.classList.toggle("jm-filter-caret--collapsed");
      });
    });

    function setActiveFilter(activeBtn) {
      // zdejmujemy aktywność ze wszystkiego
      catContainer
        .querySelectorAll(
          ".jm-filter-pill, .jm-filter-category-header"
        )
        .forEach((el) => el.classList.remove("jm-filter-pill--active"));

      activeBtn.classList.add("jm-filter-pill--active");
    }

    function applyFilter(type, key) {
      const normalizedKey = key ? key.toLowerCase() : null;

      cards.forEach((card) => {
        const cat = (card.dataset.category || "").toLowerCase();
        const sub = (card.dataset.subcategory || "").toLowerCase();

        let visible = true;

        if (type === "all") {
          visible = true;
        } else if (type === "category") {
          visible = cat === normalizedKey;
        } else if (type === "subcategory") {
          visible = sub === normalizedKey;
        }

        card.style.display = visible ? "" : "none";
      });
    }
  }
});
