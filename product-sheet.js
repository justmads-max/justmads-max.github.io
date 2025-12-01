// product-sheet.js
// Widok pojedynczego produktu na stronie product.html

document.addEventListener("DOMContentLoaded", () => {
  const productContainer = document.getElementById("product");

  function getProductIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
  }

  function createEl(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text != null) el.textContent = text;
    return el;
  }

  async function init() {
    const productId = getProductIdFromUrl();
    if (!productId) {
      productContainer.textContent = "Nie znaleziono produktu (brak ID w adresie).";
      return;
    }

    let products = [];
    try {
      products = await loadJMProducts();
    } catch (e) {
      console.error("Błąd ładowania produktów:", e);
      productContainer.textContent = "Nie udało się załadować danych produktu.";
      return;
    }

    const product = products.find((p) => String(p.id) === String(productId));

    if (!product) {
      productContainer.textContent = "Produkt nie został znaleziony.";
      return;
    }

    // ----------- Layout: lewa część (zdjęcia), prawa część (info) -----------
    productContainer.innerHTML = "";

    const layout = createEl("div", "jm-product-layout-inner");

    // GALERIA
    const gallery = createEl("div", "jm-product-gallery");

    const mainImg = createEl("img", "jm-product-main-image");
    mainImg.id = "product-main-image";

    const thumbsWrapper = createEl("div", "jm-product-thumbs");
    thumbsWrapper.id = "product-thumbs";

    if (product.images && product.images.length > 0) {
      // pierwsze zdjęcie jako główne
      mainImg.src = product.images[0];
      mainImg.alt =
        product.name_pl || product.name_en || "Zdjęcie produktu JustMads";

      // przyciski do zmiany zdjęcia
      product.images.forEach((src, idx) => {
        const btn = createEl(
          "button",
          "jm-product-thumb-btn",
          `zdjęcie ${idx + 1}`
        );

        if (idx === 0) {
          btn.classList.add("active");
        }

        btn.addEventListener("click", () => {
          mainImg.src = src;
          const all = thumbsWrapper.querySelectorAll(".jm-product-thumb-btn");
          all.forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
        });

        thumbsWrapper.appendChild(btn);
      });
    } else {
      mainImg.alt = "Brak zdjęcia produktu";
    }

    gallery.appendChild(mainImg);
    gallery.appendChild(thumbsWrapper);

    // INFO O PRODUKCIE
    const info = createEl("div", "jm-product-info");

    const title = createEl("h1", "jm-product-title", product.name_pl || "");
    const price = createEl(
      "div",
      "jm-product-price",
      product.price_pln ? `${product.price_pln} PLN` : ""
    );
    const desc = createEl(
      "p",
      "jm-product-desc",
      product.desc_pl || ""
    );

    info.appendChild(title);
    info.appendChild(price);
    info.appendChild(desc);

    layout.appendChild(gallery);
    layout.appendChild(info);
    productContainer.appendChild(layout);
  }

  init();
});
