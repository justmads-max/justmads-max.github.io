// shop-sheet.js

(function () {
  var grid = document.getElementById("products");
  if (!grid) return;

  var categoryButtons = document.querySelectorAll(".cat-btn");

  // --- skąd bierzemy dane ---

  function getAllProducts() {
    if (typeof window !== "undefined" && Array.isArray(window.JM_PRODUCTS)) {
      return window.JM_PRODUCTS;
    }
    if (typeof JM_PRODUCTS !== "undefined" && Array.isArray(JM_PRODUCTS)) {
      return JM_PRODUCTS;
    }
    return [];
  }

  // --- helpers obrazki ---

  function jmNormalizeImagePath(path) {
    if (!path) return "";
    return String(path).replace(/^\/+/, "");
  }

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

  // --- filtrowanie ---

  function filterProducts(category) {
    var all = getAllProducts();

    var items = all.filter(function (p) {
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

  // --- render kart ---

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

  // --- poczekaj, aż dane się pojawią ---

  var attempts = 0;

  function initialRender() {
    attempts++;
    var all = getAllProducts();

    if (all.length) {
      // ustaw aktywny przycisk "Wszystko" (jeśli jest)
      var defaultCatBtn = document.querySelector(
        '.cat-btn[data-category="all"]'
      );
      if (defaultCatBtn) {
        categoryButtons.forEach(function (b) {
          b.classList.remove("active");
        });
        defaultCatBtn.classList.add("active");
      }
      renderProducts("all");
      return;
    }

    if (attempts < 20) {
      // próbujemy jeszcze przez ~10s (co 500 ms)
      setTimeout(initialRender, 500);
    } else {
      grid.innerHTML =
        "<p>Brak produktów (błąd ładowania danych z arkusza).</p>";
    }
  }

  initialRender();
})();
