// product-sheet.js

(function () {
  function hasProducts() {
    return typeof JM_PRODUCTS !== "undefined" && Array.isArray(JM_PRODUCTS);
  }

  function jmNormalizeImagePath(path) {
    if (!path) return "";
    return String(path).replace(/^\/+/, "");
  }

  function jmGetImages(product) {
    var out = [];
    ["img1", "img2", "img3", "img4"].forEach(function (key) {
      if (product[key] && String(product[key]).trim()) {
        out.push(jmNormalizeImagePath(product[key]));
      }
    });
    return out;
  }

  function jmCurrentLang() {
    try {
      var stored =
        window.localStorage && window.localStorage.getItem("jm_lang");
      return stored === "en" ? "en" : "pl";
    } catch (e) {
      return "pl";
    }
  }

  function jmFindProductById(id) {
    if (!hasProducts()) return null;
    return (
      JM_PRODUCTS.find(function (p) {
        return String(p.id) === String(id);
      }) || null
    );
  }

  function init() {
    if (!hasProducts()) {
      console.warn("JM_PRODUCTS not available on product page");
      return;
    }

    var container = document.getElementById("product");
    if (!container) return;

    var params = new URLSearchParams(window.location.search);
    var id = params.get("id");
    if (!id) {
      container.textContent = "Produkt nie znaleziony.";
      return;
    }

    var product = jmFindProductById(id);
    if (!product) {
      container.textContent = "Produkt nie znaleziony.";
      return;
    }

    var lang = jmCurrentLang();
    var name =
      lang === "en" && product.name_en
        ? product.name_en
        : product.name_pl || product.name_en || "";

    var desc =
      lang === "en" && product.desc_en
        ? product.desc_en
        : product.desc_pl || product.desc_en || "";

    var price = product.price_pln ? product.price_pln + " PLN" : "";
    var size = product.size || "";
    var images = jmGetImages(product);
    var mainImg = images.length ? images[0] : "";

    container.innerHTML =
      `<div class="jm-product-layout">` +
      `<div class="jm-product-gallery">` +
      `<div class="jm-product-main">` +
      (mainImg ? `<img src="${mainImg}" alt="${name}">` : "") +
      `</div>` +
      (images.length > 1
        ? `<div class="jm-product-thumbs">` +
          images
            .map(function (src, idx) {
              return (
                `<img class="jm-product-thumb ` +
                (idx === 0 ? "jm-product-thumb-active" : "") +
                `" src="${src}" data-index="${idx}" alt="${name} miniatura ${idx +
                  1}">`
              );
            })
            .join("") +
          `</div>`
        : "") +
      `</div>` +
      `<div class="jm-product-info-full">` +
      `<h1>${name}</h1>` +
      (price
        ? `<div class="jm-product-price-main">` +
          price +
          (size ? `<span class="jm-product-size"> ${size}</span>` : "") +
          `</div>`
        : "") +
      `<div class="jm-product-meta-main">` +
      (product.brand ? `<div><strong>Marka:</strong> ${product.brand}</div>` : "") +
      (product.materials
        ? `<div><strong>Skład:</strong> ${product.materials}</div>`
        : "") +
      `</div>` +
      (desc ? `<p>${desc}</p>` : "") +
      `</div>` +
      `</div>`;

    // miniaturki
    var mainImgEl = container.querySelector(".jm-product-main img");
    var thumbs = container.querySelectorAll(".jm-product-thumb");
    thumbs.forEach(function (thumb) {
      thumb.addEventListener("click", function () {
        var src = thumb.getAttribute("src");
        if (src && mainImgEl) {
          mainImgEl.src = src;
        }
        thumbs.forEach(function (t) {
          t.classList.remove("jm-product-thumb-active");
        });
        thumb.classList.add("jm-product-thumb-active");
      });
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
