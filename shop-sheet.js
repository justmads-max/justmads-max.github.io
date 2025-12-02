// shop-sheet.js

(function () {
  // Bierzemy dane z globalnego JM_PRODUCTS (lub pustą tablicę, jeśli coś nie gra)
  var ALL_PRODUCTS =
    (typeof JM_PRODUCTS !== "undefined" && Array.isArray(JM_PRODUCTS))
      ? JM_PRODUCTS
      : [];

  var grid = document.getElementById("products");
  if (!grid) return;

  var categoryButtons = document.querySelectorAll(".cat-btn");

  // --- Pomocnicze: obrazki ---

  function jmNormalizeImagePath(path) {
    if (!path) return "";
    // usuwamy wiodące "/" żeby "/images/..." => "images/..."
    return String(path).replace(/^\/+/, "");
  }

  // zbierz wszystkie pola zaczynające się na "img"
  function jmGetAllImages(product) {
    var out = [];
    for (var key in product) {
      if (!Object.prototype.hasOwnProperty.call(product, key)) continue;
      if (/^img/i.test(key) && product[key] && String(product[key]).trim()) {
        out.push(jmNormalizeImagePath(product[key]));
      }
    }
    return out;
  }

  function jmGetMainImage(product) {
    var imgs = jmGetAllImages(product);
    return imgs.length ? imgs[0] : "";
  }

  // --- język ---

  function jmCurrentLang() {
    try {
      var stored =
        window.localStorage && window.localStorage.getItem("jm_lang");
      return stored === "en" ? "en" : "pl";
    } catch (e) {
      return "pl";
    }
  }

  // --- filtrowanie po kategoriach ---

  function filterProducts(category) {
    var items = ALL_PRODUCTS.filter(function (p) {
      return (p.status || "").toLowerCase() === "available";
    });

    if (!category || category === "all") return items;

    if (category === "upcycled") {
      return items.filter(function (p) {
        var sub = (p.subcategory || "").toLowerCase();
        return sub.includes("upcycled") || sub.includes("upcykling");
      });
    }

    if (category === "coats_jackets") {
      return items.filter(function (p) {
        var sub = (p.subcategory || "").toLowerCase();
        return (
          sub.includes("coat") ||
          sub.includes("płaszcz") ||
          sub.includes("plaszcz") ||
          sub.includes("marynarka") ||
          sub.includes("jacket")
        );
      });
    }

    return items;
  }

  // --- render kart produktów ---

  function renderProducts(category) {
    var lang = jmCurrentLang();
    var products = filterProducts(category);

    if (!products.length) {
      grid.innerHTML = "<p>Brak produktów w tej kategorii.</p>";
      return;
    }

    grid.innerHTML = products
      .map(function (p) {
        var name =
          lang === "en" && p.name_en
            ? p.name_en
            : p.name_pl || p.name_en || "";

        var img = jmGetMainImage(p);
        var price = p.price_pln ? p.price_pln + " PLN" : "";
        var size = p.size || "";

        return (
          `<a href="product.html?id=${p.id}" class="jm-product-card">` +
          `<div class="jm-product-image-wrap">` +
          (img ? `<img src="${img}" alt="${name}">` : "") +
          `</div>` +
          `<div class="jm-product-info">` +
          `<h3 class="jm-product-name">${name}</h3>` +
          `<div class="jm-product-meta">` +
          (price ? `<span class="jm-product-price">${price}</span>` : "") +
          (size ? `<span class="jm-product-size">${size}</span>` : "") +
          `</div>` +
          `</div>` +
          `</a>`
        );
      })
      .join("");
  }

  // --- obsługa kliknięć w kategorie ---

  categoryButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var cat = btn.getAttribute("data-category") || "all";

      categoryButtons.forEach(function (b) {
        b.classList.remove("active");
      });
      btn.classList.add("active");

      renderProducts(cat);
    });
  });

  // Domyślnie: Wszystko
  var defaultCatBtn = document.querySelector('.cat-btn[data-category="all"]');
  if (defaultCatBtn) {
    defaultCatBtn.classList.add("active");
    renderProducts("all");
  } else {
    renderProducts("all");
  }
})();
