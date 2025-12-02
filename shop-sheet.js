// shop-sheet.js
// Render sklepu + filtrowanie kategorii

// Pomocniczo: budowanie pełnego URL do obrazka
function jmBuildImageUrl(raw) {
  if (!raw) return "";
  const trimmed = String(raw).trim();
  if (!trimmed) return "";

  // Jeśli już pełny URL (http / https) – zostaw
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  // Jeśli mamy bazę obrazków z sheet-config.js – doklej
  const base =
    typeof JM_IMAGE_BASE !== "undefined" && JM_IMAGE_BASE
      ? JM_IMAGE_BASE.replace(/\/+$/, "")
      : "";

  if (!base) return trimmed;

  return base + "/" + trimmed.replace(/^\/+/, "");
}

async function jmInitShop() {
  const grid = document.getElementById("products");
  if (!grid || typeof loadJMProducts !== "function") return;

  let products = [];

  try {
    products = await loadJMProducts();
  } catch (e) {
    console.error("Nie udało się wczytać produktów", e);
    grid.textContent = "Błąd wczytywania produktów.";
    return;
  }

  let currentCategory = "all";

  function matchesCategory(p, cat) {
    if (!cat || cat === "all") return true;

    const catLower = String(cat).toLowerCase();
    const category = (p.category || "").toLowerCase();
    const subcategory = (p.subcategory || "").toLowerCase();

    // Rodzic "Ubrania / Clothing"
    if (catLower === "clothing") {
      return (
        category === "ubrania" ||
        category === "clothing"
      );
    }

    // Konkretny typ
    return category === catLower || subcategory === catLower;
  }

  function render() {
    const filtered = products.filter(
      (p) => p && p.status !== "hidden" && matchesCategory(p, currentCategory)
    );

    grid.innerHTML = "";

    if (!filtered.length) {
      const empty = document.createElement("p");
      empty.textContent = "Brak produktów w tej kategorii.";
      grid.appendChild(empty);
      return;
    }

    filtered.forEach((p) => {
      const card = document.createElement("a");
      card.href = `product.html?id=${encodeURIComponent(p.id)}`;
      card.className = "jm-product-card";

      const imgSrc = jmBuildImageUrl(
        p.image_1 || p.image1 || p.image || ""
      );

      const name = p.name_pl || p.name_en || "Produkt";
      const priceTxt = p.price_pln ? `${p.price_pln} PLN` : "";
      const sizeTxt = p.size ? String(p.size) : "";

      card.innerHTML = `
        <div class="jm-product-image-wrap">
          ${
            imgSrc
              ? `<img src="${imgSrc}" alt="${name.replace(/"/g, "&quot;")}">`
              : ""
          }
        </div>
        <div class="jm-product-info">
          <h3 class="jm-product-name">${name}</h3>
          <div class="jm-product-meta">
            <span class="jm-product-price">${priceTxt}</span>
            ${
              sizeTxt
                ? `<span class="jm-product-size">${sizeTxt}</span>`
                : ""
            }
          </div>
        </div>
      `;

      grid.appendChild(card);
    });
  }

  // --- Obsługa przycisków kategorii ---

  const catButtons = Array.from(
    document.querySelectorAll("[data-category]")
  );

  catButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const cat = btn.getAttribute("data-category") || "all";
      currentCategory = cat;

      catButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      render();
    });
  });

  // Domyślnie "Wszystko"
  const defaultBtn = catButtons.find(
    (b) => b.getAttribute("data-category") === "all"
  );
  if (defaultBtn) {
    defaultBtn.classList.add("active");
    currentCategory = "all";
  }

  render();
}

// Start po załadowaniu DOM
document.addEventListener("DOMContentLoaded", jmInitShop);
