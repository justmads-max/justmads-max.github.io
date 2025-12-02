// product-sheet.js
// Też zakładamy globalne JM_PRODUCTS z sheet-data.js

(function () {
  const container = document.getElementById("product");
  if (!container) return;

  if (typeof JM_PRODUCTS === "undefined" || !Array.isArray(JM_PRODUCTS)) {
    console.error("JM_PRODUCTS nie jest dostępne – sprawdź sheet-data.js");
    container.textContent = "Błąd ładowania danych produktu.";
    return;
  }

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

  function findProductById(id) {
    return (
      JM_PRODUCTS.find((p) => String(p.id) === String(id)) || null
    );
  }

  function renderProduct() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
      container.textContent = "Produkt nie znaleziony.";
      return;
    }

    const product = findProductById(id);
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

    // UWAGA: kontener MA już klasę jm-product-layout (w product.html)
    // więc wypełniamy go dwoma kolumnami: galeria + info
    container.innerHTML = `
      <div class="jm-product-gallery">
        <div class="jm-product-main">
          ${
            mainImg
              ? `<img src="${mainImg}" alt="${name}">`
              : ""
          }
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

    // miniatury -> zmiana zdjęcia głównego
    const mainImgEl = container.querySelector(".jm-product-main img");
    const thumbs = container.querySelectorAll(".jm-product-thumb");
    thumbs.forEach((thumb) => {
      thumb.addEventListener("click", () => {
        const src = thumb.getAttribute("src");
        if (src && mainImgEl) mainImgEl.src = src;
        thumbs.forEach((t) =>
          t.classList.remove("jm-product-thumb-active")
        );
        thumb.classList.add("jm-product-thumb-active");
      });
    });
  }

  // wszystko odpalamy od razu – dane z sheet-data.js są już wczytane
  renderProduct();
})();
