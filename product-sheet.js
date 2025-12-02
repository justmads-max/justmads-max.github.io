// product-sheet.js
// Czyta JM_PRODUCTS i wyświetla pojedynczy produkt

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("product");
    if (!container) return;

    let raw = typeof JM_PRODUCTS !== "undefined" ? JM_PRODUCTS : null;

    if (!raw) {
      console.error("JM_PRODUCTS jest undefined – sprawdź sheet-data.js");
      container.textContent = "Błąd ładowania danych produktu.";
      return;
    }

    if (!Array.isArray(raw)) {
      if (Array.isArray(raw.rows)) raw = raw.rows;
      else if (Array.isArray(raw.data)) raw = raw.data;
    }

    if (!Array.isArray(raw) || !raw.length) {
      container.textContent = "Brak danych produktu.";
      return;
    }

    const PRODUCTS = raw.map((p) => (p.fields ? p.fields : p));

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
          out.push(String(p[key]).trim());
        }
      }
      return out;
    }

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
      container.textContent = "Produkt nie znaleziony.";
      return;
    }

    const product =
      PRODUCTS.find((p) => String(p.id) === String(id)) || null;

    if (!product) {
      container.textContent = "Produkt nie znaleziony.";
      return;
    }

    const lang = currentLang();

    const name =
      lang === "en" && product.name_en
        ? product.name_en
        : product.name_pl || product.name_en || "";

    const desc =
      lang === "en" && product.desc_en
        ? product.desc_en
        : product.desc_pl || product.desc_en || "";

    const price = product.price_pln ? `${product.price_pln} PLN` : "";
    const size = product.size || "";
    const brand = product.brand || "";
    const materials = product.materials || "";

    const images = getAllImages(product);
    const mainImg = images.length ? images[0] : "";

    // WAŻNE: w product.html DIV ma już klasę jm-product-layout
    container.innerHTML = `
      <div class="jm-product-gallery">
        <div class="jm-product-main">
          ${mainImg ? `<img src="${mainImg}" alt="${name}">` : ""}
        </div>
        ${
          images.length > 1
            ? `<div class="jm-product-thumbs">
                 ${images
                   .map(
                     (src, idx) => `
                      <img
                        src="${src}"
                        class="jm-product-thumb ${
                          idx === 0 ? "jm-product-thumb-active" : ""
                        }"
                        data-index="${idx}"
                        alt="${name} miniatura ${idx + 1}"
                      >
                     `
                   )
                   .join("")}
               </div>`
            : ""
        }
      </div>

      <div class="jm-product-info-full">
        <h1>${name}</h1>
        ${
          price
            ? `<div class="jm-product-price-main">
                 ${price}
                 ${size ? `<span class="jm-product-size"> ${size}</span>` : ""}
               </div>`
            : ""
        }
        <div class="jm-product-meta-main">
          ${brand ? `<div><strong>Marka:</strong> ${brand}</div>` : ""}
          ${
            materials
              ? `<div><strong>Skład:</strong> ${materials}</div>`
              : ""
          }
        </div>
        ${desc ? `<p>${desc}</p>` : ""}
      </div>
    `;

    const mainImgEl = container.querySelector(".jm-product-main img");
    const thumbs = container.querySelectorAll(".jm-product-thumb");
    thumbs.forEach((thumb) => {
      thumb.addEventListener("click", () => {
        const src = thumb.getAttribute("src");
        if (src && mainImgEl) mainImgEl.src = src;
        thumbs.forEach((t) => t.classList.remove("jm-product-thumb-active"));
        thumb.classList.add("jm-product-thumb-active");
      });
    });
  });
})();
