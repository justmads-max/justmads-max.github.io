// lang.js
// Prosty system tłumaczeń PL / EN dla statycznych tekstów na stronach
// index.html, shop.html, product.html

(function () {
  const DEFAULT_LANG = "pl";

  const TRANSLATIONS = {
    pl: {
      // NAV / HEADER
      logo_sub: "vintage & upcycling",
      nav_home: "Strona główna",
      nav_shop: "Sklep",
      nav_about: "O marce",

      // INDEX / HOME
      hero_title: "Vintage, który ma już historię.<br>Ty dopisujesz resztę.",
      hero_sub:
        "Wyselekcjonowane second hand, upcycling i unikatowe perełki — wszystko ręcznie wybierane, zero fast fashion.",
      about_title: "O marce",
      about_text:
        "JustMads to butikowy projekt vintage & upcycling — tworzony z sercem i pełną selekcją każdego produktu.",

      // SHOP PAGE
      shop_title: "Sklep – JustMads",
      shop_header: "Sklep",
      shop_subheader:
        "Na razie w sklepie jest tylko kilka pierwszych sztuk – kolejne perełki będą wpadały stopniowo.",
      categories_title: "Kategorie",
      cat_all: "Wszystko",
      cat_clothes: "Ubrania",
      cat_coats: "płaszcze & marynarki",
      cat_upcycled: "upcycled",

      // PRODUCT PAGE
      product_title: "Produkt – JustMads",
      product_back: "← Powrót do sklepu"
    },

    en: {
      // NAV / HEADER
      logo_sub: "vintage & upcycling",
      nav_home: "Home",
      nav_shop: "Shop",
      nav_about: "About",

      // INDEX / HOME
      hero_title: "Vintage that already has a story.<br>You write the rest.",
      hero_sub:
        "Curated second hand pieces, upcycling and unique gems — all hand-picked, zero fast fashion.",
      about_title: "About",
      about_text:
        "JustMads is a small vintage & upcycling project — created with heart and careful selection of every single item.",

      // SHOP PAGE
      shop_title: "Shop – JustMads",
      shop_header: "Shop",
      shop_subheader:
        "For now there are only a few first pieces in the shop – new gems will appear gradually.",
      categories_title: "Categories",
      cat_all: "All products",
      cat_clothes: "Clothing",
      cat_coats: "Coats & blazers",
      cat_upcycled: "Upcycled",

      // PRODUCT PAGE
      product_title: "Product – JustMads",
      product_back: "← Back to shop"
    }
  };

  function applyLanguage(lang) {
    const dict = TRANSLATIONS[lang] || TRANSLATIONS[DEFAULT_LANG];

    // <html lang="...">
    document.documentElement.lang = lang;

    // elementy z data-lang="klucz"
    document.querySelectorAll("[data-lang]").forEach((el) => {
      const key = el.getAttribute("data-lang");
      const value = dict[key];
      if (value !== undefined) {
        // używamy innerHTML, żeby działały <br> w hero_title itd.
        el.innerHTML = value;
      }
    });

    // aktywny przycisk języka
    document.querySelectorAll("[data-lang-button]").forEach((btn) => {
      const btnLang = btn.getAttribute("data-lang-button");
      if (btnLang === lang) {
        btn.classList.add("jm-lang-active");
      } else {
        btn.classList.remove("jm-lang-active");
      }
    });

    // tytuł strony (jeśli jest osobny klucz)
    const titleEl = document.querySelector("title[data-lang]");
    if (titleEl) {
      const key = titleEl.getAttribute("data-lang");
      if (dict[key]) {
        titleEl.innerHTML = dict[key];
      }
    }

    // zapis + globalna zmienna dla innych skryptów (np. shop/product)
    window.JM_LANG = lang;
    try {
      localStorage.setItem("jm_lang", lang);
    } catch (e) {
      // cicho, jeśli np. tryb prywatny
    }
  }

  function initLang() {
    let lang = DEFAULT_LANG;
    try {
      const stored = localStorage.getItem("jm_lang");
      if (stored && TRANSLATIONS[stored]) {
        lang = stored;
      }
    } catch (e) {}

    // kliknięcia w PL / EN
    document.querySelectorAll("[data-lang-button]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const newLang = btn.getAttribute("data-lang-button");
        applyLanguage(newLang);
      });
    });

    applyLanguage(lang);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLang);
  } else {
    initLang();
  }
})();
