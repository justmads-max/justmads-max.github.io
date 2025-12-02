// shop-sheet.js

(function () {
  // sprawdź, czy JM_PRODUCTS w ogóle istnieje
  if (typeof JM_PRODUCTS === "undefined" || !Array.isArray(JM_PRODUCTS)) {
    console.warn("JM_PRODUCTS not found");
    return;
  }

  var grid = document.getElementById("products");
  if (!grid) return;

  var categoryButtons = document.querySelectorAll(".cat-btn");

  function jmNormalizeImagePath(path) {
    if (!path) return "";
    // usuń wiodące "/" żeby /images/... stało się images/...
    return String(path).replace(/^\/+/, "");
  }

  function jmGetMainImage(product) {
    var keys = ["img1", "img2", "img3", "img4"];
    for (var i = 0; i < keys.length; i++) {
      var v = product[keys[i]];
      if (v && String(v).trim()) {
        return jmNormalizeImagePath(v);
      }
    }
    return "";
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

  function filterProducts(category) {
    var items = JM_PRODUCTS.filter(function (p) {
      return (p.status || "").toLowerCase() === "available";
    });

    if (!category || category === "all") return items;

    if (category === "upcycled") {
      return items.filter(function (p) {
        var sub = (p.subcategory || "").toLowerCase();
        return sub.includes("upcycled");
      });
    }

    if (category === "coats_jackets") {
      return items.filter(function (p) {
        var sub = (p.subcategory || "").toLowerCase();
        return (
          sub.includes("coat") ||
          sub.includes("płaszcz") ||
          sub.includes("marynarka") ||
          sub.includes("jacket")
        );
      });
    }

    return items;
  }

  function renderProducts(category) {
    var lang = jmCurrentLang();
    var products = filterProducts(category);

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

  // obsługa kliknięć w kategorie
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

  // domyślnie: Wszystko
  var defaultCatBtn = document.querySelector('.cat-btn[data-category="all"]');
  if (defaultCatBtn) {
    defaultCatBtn.classList.add("active");
    renderProducts("all");
  } else {
    renderProducts("all");
  }
})();
