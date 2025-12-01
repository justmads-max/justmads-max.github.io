// lang.js
(function () {
  const DEFAULT_LANG = "pl";

  const TRANSLATIONS = {
    pl: {
      // NAV / OGÓLNE
      logo_sub: "vintage & upcycling",
      nav_home: "Strona główna",
      nav_shop: "Sklep",
      nav_about: "O marce",

      // INDEX
      hero_title: "Vintage, który ma już historię.<br>Ty dopisujesz resztę.",
      hero_sub:
        "Wyselekcjonowane second hand, upcycling i unikatowe perełki — wszystko ręcznie wybierane, zero fast fashion.",
      about_title: "O marce",
      about_text:
        "JustMads to butikowy projekt vintage & upcycling — tworzony z sercem i pełną selekcją każdego produktu.",

      // SHOP
      shop_title: "Sklep – JustMads",
      shop_header: "Sklep",
      shop_subheader:
        "Na razie w sklepie jest tylko kilka pierwszych sztuk – kolejne perełki będą wpadały stopniowo.",
      categories_title: "Kategorie",
      cat_all: "Wszystko",
      cat_clothes: "Ubrania",
      cat_coats: "płaszcze & marynarki",
      cat_upcycled: "upcycled",

      // PRODUCT
      product_title: "Produkt – JustMads",
      product_back: "← Powrót do sklepu"
    },

    en: {
      // NAV / GENERAL
      logo_sub: "vintage & upcycling",
      nav_home: "Home",
      nav_shop: "Shop",
      nav_about: "About",

      // INDEX
      hero_title: "Vintage that already has a story.<br>You write the rest.",
      hero_sub:
        "Curated second hand pieces, upcycling and unique gems — all hand-picked, zero fast fashion.",
      about_title: "About",
      about_text:
        "JustMads is a small vintage & upcycling project — created with heart and careful selection of every single item.",

      // SHOP
      shop_title: "Shop – JustMads",
      shop_header: "Shop",
      shop_subheader:
        "For now there are only a few first pieces in the shop – new gems will appear gradually.",
      categories_title: "Categories",
      cat_all: "All products",
      cat_clothes: "Clothing",
      cat_coats: "Coats & blazers",
      cat_upcycled: "Upcycled",

      // PRODUCT
      product_title: "Product – JustMads",
      product_back: "← Back to shop"
    }
  };

  function setLang(lang) {
    const dict = TRANSLATIONS[lang] || TRANSLATIONS[DEFAULT_LANG];
    window.JM_LANG = lang;

    // elementy z data-lang (teksty)
    document.querySelectorAll("[data-lang]").forEach(function (el) {
      const key = el.getAttribute("data-lang");
      const value = dict[key];
      if (!value) return;

      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        el.placeholder = value;
      } else if (el.tagName === "TITLE") {
        el.textContent = value;
      } else {
        el.innerHTML = value; // pozwala na <br> w hero_title
      }
    });

    // aktywny przycisk języka
    document.querySelectorAll("[data-lang-button]").forEach(function (btn) {
      const bLang = btn.getAttribute("data-lang-button");
      if (bLang === lang) {
        btn.classList.add("jm-lang-active");
      } else {
        btn.classList.remove("jm-lang-active");
      }
    });
  }

  function initLang() {
    let stored = null;
    try {
      stored = window.localStorage && localStorage.getItem("jm_lang");
    } catch (e) {
      stored = null;
    }
    const lang = stored || DEFAULT_LANG;
    setLang(lang);

    document.querySelectorAll("[data-lang-button]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const newLang = btn.getAttribute("data-lang-button");
        if (!newLang || !TRANSLATIONS[newLang]) return;
        try {
          window.localStorage && localStorage.setItem("jm_lang", newLang);
        } catch (e) {}
        setLang(newLang);
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLang);
  } else {
    initLang();
  }
})();
