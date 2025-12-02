// shop-sheet.js
// Prosta wersja: zakładamy, że sheet-data.js tworzy globalne JM_PRODUCTS = [...]

(function () {
  const grid = document.getElementById("products");
  if (!grid) return;

  // --- sprawdzamy, czy dane w ogóle istnieją ---
  if (typeof JM_PRODUCTS === "undefined" || !Array.isArray(JM_PRODUCTS)) {
    console.error("JM_PRODUCTS nie jest dostępne – sprawdź sheet-data.js");
    grid.innerHTML = "<p>Brak danych produktów (błąd konfiguracji).</p>";
    return;
  }

  // tylko dostępne
  const ALL_PRODUCTS = JM_PRODUCTS.filter(
    (p) => (p.status || "").toLowerCase() === "available"
  );

  // --- helpers ---

  function currentLang() {
    try {
      const v = window.localStorage.getItem("jm_lang");
      return v === "en" ? "en" : "pl";
    } catch (e) {
      return "pl";
    }
  }

  function getAllImages(p) {
    const out = [];
    for (const key in p) {
      if (!Object.prototype.hasOwnProperty.call(p, key)) continue;
      if (/^img/i.test(key) && p[key] && String(p[key]).trim()) {
        let path = String(p[key]).trim();
        // zostawiamy tak jak jest – u Ciebie to już działało
        out.push(path);
      }
    }
    return out;
  }

  function getMainImage(p) {
    const imgs = getAllImages(p);
    return imgs.length ? imgs[0] : "";
  }

  // --- filtrowanie wg kategorii z lewej ---

  function filterByCategory(cat) {
    if (!cat || cat === "all") return ALL_PRODUCTS;

    if (cat === "upcycled") {
      return ALL_PRODUCTS.filter((p) => {
        const sub = (p.subcategory || "").toLowerCase();
        return sub.includes("upcycled") || sub.includes("upcykling");
      });
    }

    if (cat === "coats_jackets") {
      return ALL_PRODUCTS.filter((p) => {
        const sub = (p.subcategory || "").toLowerCase();
        return (
          sub.includes("coat") ||
          sub.includes("płaszcz") ||
          sub.includes("plaszcz") ||
          sub.includes("marynarka") ||
          sub.includes("jacket")
        );
      });
    }

    return ALL_PRODUCTS;
  }

  // --- render kart ---

  function renderProducts(cat) {
    const lang = currentLang();
    const products = filterByCategory(cat);

    if (!products.length) {
      grid.innerHTML = "<p>Brak produktów w tej kategorii.</p>";
      return;
    }

    const cards = products
      .map((p) => {
        const name =
          lang === "en" && p.name_en
            ? p.name_en
            : p.name_pl || p.name_en || "";

        const img = getMainImage(p);
        const price = p.price_pln ? `${p.price_pln} PLN` : "";
        const size = p.size || "";

        return `
          <a href="product.html?id=${p.id}" class="jm-product-card">
            <div class="jm-product-image-wrap">
              ${
                img
                  ? `<img src="${img}" alt="${name}">`
                  : ""
              }
            </div>
            <div class="jm-product-info">
              <h3 class="jm-product-name">${name}</h3>
              <div class="jm-product-meta">
                ${
                  price
                    ? `<span class="jm-product-price">${price}</span>`
                    : ""
                }
                ${
                  size
                    ? `<span class="jm-product-size">${size}</span>`
                    : ""
                }
              </div>
            </div>
          </a>
        `;
      })
      .join("");

    grid.innerHTML = cards;
  }

  // --- obsługa kliknięć przycisków kategorii ---

  const catButtons = document.querySelectorAll(".cat-btn");
  catButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const cat = btn.getAttribute("data-category") || "all";
      catButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderProducts(cat);
    });
  });

  // domyślnie: Wszystko
  const allBtn = document.querySelector('.cat-btn[data-category="all"]');
  if (allBtn) {
    catButtons.forEach((b) => b.classList.remove("active"));
    allBtn.classList.add("active");
  }

  renderProducts("all");
})();
