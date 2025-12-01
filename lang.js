// --- 1. LANGUAGE STATE ---
let JM_LANG = localStorage.getItem("jm_lang") || "pl";

// --- 2. TEXT DICTIONARY ---
const JM_TEXT = {
  pl: {
    shop_title: "Sklep",
    shop_sub: "Na razie w sklepie jest tylko kilka pierwszych sztuk – kolejne perełki będą wpadały stopniowo.",
    categories: "Kategorie",
    all_products: "Wszystko",

    // CATEGORIES
    cat_clothes: "Ubrania",
    cat_upcycled: "Upcykling",
    cat_coats_jackets: "Marynarki i kurtki",
    cat_denim: "Jeansy",

    price_pln: "PLN",
  },

  en: {
    shop_title: "Shop",
    shop_sub: "Only a few first pieces are available for now — new gems will drop gradually.",
    categories: "Categories",
    all_products: "All products",

    // CATEGORIES
    cat_clothes: "Clothing",
    cat_upcycled: "Upcycled",
    cat_coats_jackets: "Coats & jackets",
    cat_denim: "Denim",

    price_pln: "PLN",
  }
};

// --- 3. UPDATE LANGUAGE SWITCH ---
function updateLangSwitch() {
  document.querySelectorAll(".jm-lang-switch span").forEach(el => {
    el.classList.remove("active");
    if (el.dataset.lang === JM_LANG) el.classList.add("active");

    el.onclick = () => {
      JM_LANG = el.dataset.lang;
      localStorage.setItem("jm_lang", JM_LANG);
      applyTranslations();
    };
  });
}

// --- 4. APPLY TRANSLATIONS ---
function applyTranslations() {
  const dict = JM_TEXT[JM_LANG];

  // HEADER ELEMENTS
  document.querySelectorAll("[data-i18n]").forEach(el => {
    let key = el.dataset.i18n;
    if (dict[key]) el.textContent = dict[key];
  });

  // PRICE LABELS
  document.querySelectorAll(".jm-product-price-currency").forEach(el => {
    el.textContent = dict.price_pln;
  });

  updateLangSwitch();
}

// --- INIT ---
document.addEventListener("DOMContentLoaded", applyTranslations);
