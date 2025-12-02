// shop-sheet.js
// Rysuje listę produktów + filtruje po kategoriach,
// korzystając z loadJMProducts() (sheet-data.js)

(function () {
  const productsContainer = document.getElementById("products");
  if (!productsContainer) return;

  function getLang() {
    return (window.JM_LANG || "pl").toLowerCase();
  }

  function getName(p) {
    const lang = getLang();
    if (lang === "en" && p.name_en) return p.name_en;
    return p.name_pl || p.name_en || "";
  }

  function getPricePLN(p) {
    // jeśli jest cena promocyjna – pokaż ją
    if (p.sale_pln && p.sale_pln !== "") return p.sale_pln;
    return p.price_pln || "";
  }

  function createCard(p) {
    const card = document.createElement("a");
    card.href = `product.html?id=${encodeURIComponent(p.id)}`;
    card.className = "jm-product-card";

    // obrazek
    const imgWrap = document.createElement("div");
    imgWrap.className = "jm-product-image-wrap";

    const img = document.createElement("img");
    const images = p.images || [];
    const mainImg = images.length ? images[0] : "";
    if (mainImg) img.src = mainImg;
    img.alt = getName(p);
    img.loading = "lazy";

    imgWrap.appendChild(img);
    card.appendChild(imgWrap);

    // teksty
    const info = document.createElement("div");
    info.className = "jm-product-info";

    const title = document.createElement("h3");
    title.className = "jm-product-name";
    title.textContent = getName(p);
    info.appendChild(title);

    const meta = document.createElement("div");
    meta.className = "jm-product-meta";

    const priceEl = document.createElement("span");
    priceEl.className = "jm-product-price";
    const price = getPricePLN(p);
    if (price) {
      priceEl.textContent = `${price} PLN`;
    }

    const sizeEl = document.createElement("span");
    sizeEl.className = "jm-product-size";
    if (p.size) {
      sizeEl.textContent = p.size;
    }

    meta.appendChild(priceEl);
    if (p.size) meta.appendChild(sizeEl);
    info.appendChild(meta);

    card.appendChild(info);
    return card;
  }

  function matchesCategory(p, catKey) {
    if (!catKey || catKey === "all") return true;

    const cat = (p.category || "").toLowerCase();
    const sub = (p.subcategory || "").toLowerCase();
    const key = catKey.toLowerCase();

    if (key === "upcycled") {
      return cat.includes("upcycl") || sub.includes("upcycl");
    }

    if (key === "coats_jackets") {
      return (
        sub.includes("coats") ||
        sub.includes("jacket") ||
        sub.includes("marynark") ||
        sub.includes("płaszcz")
      );
    }

    // fallback – dokładne porównanie
    return cat === key || sub === key;
  }

  function renderProducts(allProducts, categoryKey) {
    productsContainer.innerHTML = "";

    const filtered = allProducts.filter((p) =>
      matchesCategory(p, categoryKey)
    );

    if (!filtered.length) {
      const msg = document.createElement("p");
      msg.textContent = "Brak produktów w tej kategorii.";
      productsContainer.appendChild(msg);
      return;
    }

    filtered.forEach((p) => {
      productsContainer.appendChild(createCard(p));
    });
  }

  async function init() {
    if (!window.loadJMProducts) {
      productsContainer.textContent =
        "Brak danych produktów (błąd konfiguracji).";
      return;
    }

    let allProducts = [];
    try {
      allProducts = await loadJMProducts();
    } catch (e) {
      console.error("Błąd ładowania produktów:", e);
      productsContainer.textContent =
        "Brak danych produktów (błąd konfiguracji).";
      return;
    }

    if (!Array.isArray(allProducts) || !allProducts.length) {
      productsContainer.textContent =
        "Na razie brak produktów do wyświetlenia.";
      return;
    }

    let currentCategory = "all";
    renderProducts(allProducts, currentCategory);

    // obsługa przycisków kategorii
    const catButtons = document.querySelectorAll(".cat-btn[data-category]");
    catButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const cat = btn.dataset.category || "all";
        currentCategory = cat;

        catButtons.forEach((b) =>
          b.classList.toggle("active", b === btn)
        );

        renderProducts(allProducts, currentCategory);
      });
    });

    // przełączanie języka – odśwież karty, jeśli lang.js wysyła event
    window.addEventListener("jmLangChange", () => {
      renderProducts(allProducts, currentCategory);
    });
  }

  init();
})();
