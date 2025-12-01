// shop-sheet.js
// Lista produktów w sklepie – ładne karty z ceną i rozmiarem

document.addEventListener("DOMContentLoaded", async () => {
  const grid =
    document.getElementById("products") ||
    document.getElementById("shop-grid") ||
    document.getElementById("jm-products");

  if (!grid) {
    console.error("Nie znaleziono kontenera na produkty (products/shop-grid/jm-products).");
    return;
  }

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

  // czyścimy kontener
  grid.innerHTML = "";

  products.forEach((p) => {
    if (p.status && String(p.status).toLowerCase() === "sold") return;

    const name = p.name_pl || p.name_en || `Produkt ${p.id}`;
    const price_pln = p.price_pln ? `${p.price_pln} PLN` : "";
    const size = p.size || "";
    const img = p.images && p.images.length ? p.images[0] : "";

    const card = document.createElement("a");
    card.className = "jm-card jm-card--product";
    card.href = `product.html?id=${encodeURIComponent(p.id)}`;

    card.innerHTML = `
      ${
        img
          ? `<img class="jm-card-image" src="${img}" alt="${name}" loading="lazy" />`
          : `<div class="jm-card-image jm-card-image--placeholder">Brak zdjęcia</div>`
      }
      <div class="jm-card-body">
        <h3>${name}</h3>
        <p class="jm-product-price">
          ${price_pln}
          ${
            size
              ? `<span class="jm-product-size-label">${size}</span>`
              : ""
          }
        </p>
      </div>
    `;

    grid.appendChild(card);
  });
});
