// product-sheet.js
// Ładuje pojedynczy produkt na podstawie parametru ?id=...

(function () {
  const container = document.getElementById("product");
  if (!container) return;

  function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  }

  function getLang() {
    return (window.JM_LANG || "pl").toLowerCase();
  }

  function getName(p) {
    const lang = getLang();
    if (lang === "en" && p.name_en) return p.name_en;
    return p.name_pl || p.name_en || "";
  }

  function getDesc(p) {
    const lang = getLang();
    if (lang === "en" && p.desc_en) return p.desc_en;
    return p.desc_pl || p.desc_en || "";
  }

  function getPricePLN(p) {
    if (p.sale_pln && p.sale_pln !== "") return p.sale_pln;
    return p.price_pln || "";
  }

  function renderProduct(p) {
    window.__JM_CURRENT_PRODUCT = p; // żeby można było przeładować przy zmianie języka

    container.innerHTML = "";

    const layout = document.createElement("div");
    layout.className = "jm-product-layout";

    // --- LEWA STRONA: GALERIA ---
    const gallery = document.createElement("div");
    gallery.className = "jm-product-gallery";

    const mainWrap = document.createElement("div");
    mainWrap.className = "jm-product-main";

    const mainImg = document.createElement("img");
    const images = p.images || [];
    const mainSrc = images.length ? images[0] : "";
    if (mainSrc) mainImg.src = mainSrc;
    mainImg.alt = getName(p);

    mainWrap.appendChild(mainImg);
    gallery.appendChild(mainWrap);

    // miniaturki (jeśli są kolejne zdjęcia)
    if (images.length > 1) {
      const thumbs = document.createElement("div");
      thumbs.className = "jm-product-thumbs";

      images.forEach((src, idx) => {
        const t = document.createElement("img");
        t.src = src;
        t.alt = getName(p) + " " + (idx + 1);
        t.className = "jm-product-thumb";
        if (idx === 0) t.classList.add("jm-product-thumb-active");

        t.addEventListener("click", () => {
          mainImg.src = src;
          document
            .querySelectorAll(".jm-product-thumb")
            .forEach((el) =>
              el.classList.remove("jm-product-thumb-active")
            );
          t.classList.add("jm-product-thumb-active");
        });

        thumbs.appendChild(t);
      });

      gallery.appendChild(thumbs);
    }

    // --- PRAWA STRONA: INFO ---
    const info = document.createElement("div");
    info.className = "jm-product-info-full";

    const title = document.createElement("h1");
    title.textContent = getName(p);
    info.appendChild(title);

    const priceEl = document.createElement("p");
    priceEl.className = "jm-product-price-main";
    const price = getPricePLN(p);
    if (price) priceEl.textContent = `${price} PLN`;
    info.appendChild(priceEl);

    const meta = document.createElement("p");
    meta.className = "jm-product-meta-main";
    const metaParts = [];
    if (p.size) metaParts.push(`Rozmiar: ${p.size}`);
    if (p.brand) metaParts.push(`Marka: ${p.brand}`);
    meta.textContent = metaParts.join(" | ");
    if (metaParts.length) info.appendChild(meta);

    const desc = document.createElement("p");
    desc.textContent = getDesc(p);
    info.appendChild(desc);

    // tu możesz dodać wymiary itd. gdy będziemy mieć gotowy schemat

    layout.appendChild(gallery);
    layout.appendChild(info);
    container.appendChild(layout);
  }

  async function init() {
    const productId = getQueryParam("id");
    if (!productId) {
      container.textContent = "Brak ID produktu w adresie.";
      return;
    }

    if (!window.loadJMProducts) {
      container.textContent = "Błąd konfiguracji danych produktu.";
      return;
    }

    let allProducts = [];
    try {
      allProducts = await loadJMProducts();
    } catch (e) {
      console.error("Błąd ładowania produktów:", e);
      container.textContent = "Nie udało się załadować danych produktu.";
      return;
    }

    const product = allProducts.find(
      (p) => String(p.id) === String(productId)
    );

    if (!product) {
      container.textContent = "Nie znaleziono produktu.";
      return;
    }

    renderProduct(product);
  }

  // zmiana języka – przerysuj produkt
  window.addEventListener("jmLangChange", () => {
    if (window.__JM_CURRENT_PRODUCT) {
      renderProduct(window.__JM_CURRENT_PRODUCT);
    }
  });

  init();
})();
