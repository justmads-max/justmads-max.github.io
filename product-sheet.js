// product-sheet.js
// Strona pojedynczego produktu – zdjęcie po lewej, opis po prawej

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("product");
  if (!container) return;

  // ID produktu z URL (product.html?id=001)
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  let products = [];
  try {
    products = await loadJMProducts();
  } catch (e) {
    console.error("Błąd przy ładowaniu produktów:", e);
    container.innerHTML = "<p>Nie udało się załadować produktu.</p>";
    return;
  }

  const product = products.find((p) => String(p.id) === String(id));
  if (!product) {
    container.innerHTML = "<p>Nie znaleziono produktu.</p>";
    return;
  }

  const {
    name_pl,
    name_en,
    price_pln,
    size,
    brand,
    materials,
    length_total,
    width_p2p,
    width_waist,
    width_hips,
    shoulder_width,
    sleeve_pit,
    length_bottom,
    inseam,
    desc_pl,
  } = product;

  const images = (product.images && product.images.length ? product.images : []);
  const mainImg = images[0] || "";

  // Budujemy HTML: lewa kolumna (galeria), prawa (detale)
  container.innerHTML = `
    <div class="jm-product-gallery">
      ${
        mainImg
          ? `<img id="jm-main-image" src="${mainImg}" alt="${name_pl || name_en || ""}" />`
          : `<div class="jm-product-placeholder">Brak zdjęcia produktu</div>`
      }
      ${
        images.length > 1
          ? `<div class="jm-product-thumbs">
              ${images
                .map(
                  (src, idx) =>
                    `<button class="jm-product-thumb-btn" data-idx="${idx}">
                      zdjęcie ${idx + 1}
                    </button>`
                )
                .join("")}
            </div>`
          : ""
      }
    </div>
    <div class="jm-product-details">
      <h1 class="jm-product-title">
        ${name_pl || name_en || `Produkt ${product.id}`}
      </h1>

      <div class="jm-product-price-line">
        ${
          price_pln
            ? `<span class="jm-product-price">${price_pln} PLN</span>`
            : ""
        }
        ${
          size
            ? `<span class="jm-product-size-tag">${size}</span>`
            : ""
        }
      </div>

      ${
        brand
          ? `<p class="jm-product-brand"><strong>Marka:</strong> ${brand}</p>`
          : ""
      }
      ${
        materials
          ? `<p class="jm-product-materials"><strong>Skład:</strong> ${materials}</p>`
          : ""
      }

      ${
        desc_pl
          ? `<p class="jm-product-desc">
              ${desc_pl}
            </p>`
          : ""
      }

      <div class="jm-product-measurements">
        <h2>Wymiary</h2>
        <ul>
          ${length_total ? `<li>Długość całkowita: ${length_total} cm</li>` : ""}
          ${width_p2p ? `<li>Szerokość pod pachami (p2p): ${width_p2p} cm</li>` : ""}
          ${width_waist ? `<li>Szerokość w talii: ${width_waist} cm</li>` : ""}
          ${width_hips ? `<li>Szerokość w biodrach: ${width_hips} cm</li>` : ""}
          ${shoulder_width ? `<li>Szerokość w ramionach: ${shoulder_width} cm</li>` : ""}
          ${sleeve_pit ? `<li>Długość rękawa od pachy: ${sleeve_pit} cm</li>` : ""}
          ${length_bottom ? `<li>Długość nogawki od kroku: ${length_bottom} cm</li>` : ""}
          ${inseam ? `<li>Długość wewnętrzna nogawki: ${inseam} cm</li>` : ""}
        </ul>
      </div>
    </div>
  `;

  // Obsługa kliknięcia w miniatury – podmiana głównego zdjęcia
  const mainImageEl = document.getElementById("jm-main-image");
  if (mainImageEl && images.length > 1) {
    container.querySelectorAll(".jm-product-thumb-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.dataset.idx || 0);
        mainImageEl.src = images[idx];
      });
    });
  }
});
