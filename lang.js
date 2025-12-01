// === LANGUAGE DATA ===
// Każdy element z atrybutem data-lang="klucz" zostanie przetłumaczony.

const JM_LANG = {
  pl: {
    // NAV
    logo_sub: "vintage & upcycling",
    nav_home: "Strona główna",
    nav_shop: "Sklep",
    nav_about: "O marce",

    // SHOP PAGE
    shop_title: "Sklep – JustMads",
    shop_header: "Sklep",
    shop_subheader: "Na razie w sklepie jest tylko kilka pierwszych sztuk – kolejne perełki będą wpadały stopniowo.",

    // CATEGORIES
    categories_title: "Kategorie",
    cat_all: "Wszystko",
    cat_clothes: "Ubrania",
    cat_coats: "płaszcze & marynarki",
    cat_upcycled: "upcycled",

    // PRODUCT PAGE
    product_title: "Produkt – JustMads",
    product_price: "Cena",
    product_size: "Rozmiar",
    product_back: "← Powrót do sklepu"
  },

  en: {
    // NAV
    logo_sub: "vintage & upcycling",
    nav_home: "Home",
    nav_shop: "Shop",
    nav_about: "About",

    // SHOP PAGE
    shop_title: "Shop – JustMads",
    shop_header: "Shop",
    shop_subheader: "Only a few first pieces are available for now — more gems will appear gradually.",

    // CATEGORIES
    categories_title: "Categories",
    cat_all: "All products",
    cat_clothes: "Clothing",
    cat_coats: "Coats & jackets",
    cat_upcycled: "Upcycled",

    // PRODUCT PAGE
    product_title: "Product – JustMads",
    product_price: "Price",
    product_size: "Size",
    product_back: "← Back to shop"
  }
};


// === LANGUAGE LOGIC ===

function jmApplyLanguage(lang) {
  document.documentElement.setAttribute("lang", lang);

  // Każdy tag z data-lang="key"
  document.querySelectorAll("[data-lang]").forEach(el => {
    const key = el.getAttribute("data-lang");
    if (JM_LANG[lang][key]) {
      el.textContent = JM_LANG[lang][key];
    }
  });

  // Zapisujemy wybór
  localStorage.setItem("jm_lang", lang);
}

function jmInitLang() {
  const saved = localStorage.getItem("jm_lang") || "pl";
  jmApplyLanguage(saved);

  // Przyciski PL | EN
  document.querySelectorAll("[data-lang-button]").forEach(btn => {
    btn.addEventListener("click", () => {
      const lang = btn.getAttribute("data-lang-button");
      jmApplyLanguage(lang);
      location.reload(); // reload dla shop-sheet i product-sheet tekstów
    });
  });
}

document.addEventListener("DOMContentLoaded", jmInitLang);
