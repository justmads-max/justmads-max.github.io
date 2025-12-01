// shop-sheet.js
// Lista produktów w sklepie – miniaturki z ceną i rozmiarem

document.addEventListener("DOMContentLoaded", async () => {
  // znajdź kontener na produkty (próbujemy kilka ID, żeby nie strzelić się w stopę)
  const grid =
    document.getElementById("shop-grid") ||
    document.getElementById("products-grid") ||
    document.getElementById("products") ||
    document.getElementById("jm-products");

  if (!grid) {
    console.error("Nie znaleziono kontenera na produkty (shop-grid / products-grid).");
    return;
  }

  // pobieramy produkty z Google Sheeta
  let products = [];
  try {
    products = await loadJMProducts();
  } catch (e) {
    console.error("Błąd przy ładowaniu produktów:", e);
    grid.innerHTML = "<p>Nie udało się załadować produktów.</p>";
    return;
  }

  if (!products || !products.length) {
    grid.innerHTML = "<p>Brak produktów do wyświetlenia.</p>";
    return;
  }

  // czyścimy
  grid.innerHTML = "";

  products.forEach((p) => {
    // p.status jest już filtrowany w loadJMProducts, ale dla pewności:
    if (p.status && p.status.toLowerCase() === "sold") return;

    const card = document.createElement("a");
    card.className = "jm-product-card";
    card.href = `product.html?id=${encodeURIComponent(p.id)}`;

    // kategoria do ewentualnych filtrów
    if (p.category) {
      card.dataset.category = String(p.category).toLowerCase();
    }

    const name = p.name_pl || p.name_en || `Produkt ${p.id}`;
    const price_pln = p.price_pln || "";
    const size = p.size || "";
    const img = (p.images && p.images[0]) || "";

    card.innerHTML = `
      <div class="jm-product-thumb">
        <div class="jm-product-image-wrap">
          ${
            img
              ? `<img src="${img}" alt="${name}" loading="lazy" />`
              : `<div class="jm-product-placeholder">Brak zdjęcia</div>`
          }
        </div>
        <div class="jm-product-info">
          <h3 class="jm-product-name">${name}</h3>
          <div class="jm-product-meta">
            ${
              price_pln
                ? `<span class="jm-product-price">${price_pln} PLN</span>`
                : `<span class="jm-product-price">—</span>`
            }
            ${
              size
                ? `<span class="jm-product-size">${size}</span>`
                : ""
            }
          </div>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });
});
