// product-sheet.js
// Ładuje pojedynczy produkt na podstawie parametru ?id=...

(function () {
  const container = document.getElementById("product");
  if (!container) return;

  function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  }

  function getLang() {
    return (window.JM_LANG || "pl").toLowerCase();
  }

  function getName(p) {
    const lang = getLang();
    if (lang === "en" && p.name_en) return p.name_en;
    return p.name_pl || p.name_en || "";
  }

  function getDesc(p) {
    const lang = getLang();
    if (lang === "en" && p.desc_en) return p.desc_en;
    return p.desc_pl || p.desc_en || "";
  }

  function getPricePLN(p) {
    if (p.sale_pln && p.sale_pln !== "") return p.sale_pln;
    return p.price_pln || "";
  }

  // Budujemy sekcję z wymiarami (ul/li) na podstawie pól z arkusza
  function buildMeasurementsSection(p) {
    const lang = getLang();

    const rows = [];

    if (p.length_total) {
      rows.push({
        label: lang === "en" ? "Total length" : "Długość całkowita",
        value: p.length_total,
      });
    }
    if (p.width_p2p) {
      rows.push({
        label: lang === "en" ? "Pit to pit width" : "Szerokość od pachy do pachy",
        value: p.width_p2p,
      });
    }
    if (p.width_waist) {
      rows.push({
        label: lang === "en" ? "Waist width" : "Szerokość w pasie",
        value: p.width_waist,
      });
    }
    if (p.width_hips) {
      rows.push({
        label: lang === "en" ? "Hips width" : "Szerokość w biodrach",
        value: p.width_hips,
      });
    }
    if (p.shoulder_width) {
      rows.push({
        label: lang === "en" ? "Shoulder width" : "Szerokość ramion",
        value: p.shoulder_width,
      });
    }
    if (p.sleeve_pit) {
      rows.push({
        label: lang === "en" ? "Sleeve length (pit to cuff)" : "Długość rękawa od pachy",
        value: p.sleeve_pit,
      });
    }
    if (p.length_bottom) {
      rows.push({
        label: lang === "en" ? "Bottom length" : "Długość do dołu",
        value: p.length_bottom,
      });
    }
    if (p.inseam) {
      rows.push({
        label: lang === "en" ? "Inseam" : "Długość nogawki od kroku",
        value: p.inseam,
      });
    }

    if (!rows.length) return null;

    const wrapper = document.createElement("div");
    wrapper.className = "jm-product-measurements";

    const heading = document.createElement("h2");
    heading.textContent = lang === "en" ? "Measurements" : "Wymiary";
    wrapper.appendChild(heading);

    const list = document.createElement("ul");

    rows.forEach((row) => {
      const li = document.createElement("li");
      li.textContent = row.label + ": " + row.value;
      list.appendChild(li);
    });

    wrapper.appendChild(list);
    return wrapper;
  }

  function renderProduct(p) {
    window.__JM_CURRENT_PRODUCT = p; // żeby można było przeładować przy zmianie języka

    container.innerHTML = "";

    const layout = document.createElement("div");
    layout.className = "jm-product-layout";

    // --- LEWA STRONA: GALERIA ---
    const gallery = document.createElement("div");
    gallery.className = "jm-product-gallery";

    const mainWrap = document.createElement("div");
    mainWrap.className = "jm-product-main";

    const mainImg = document.createElement("img");
    const images = p.images || [];
    const mainSrc = images.length ? images[0] : "";
    if (mainSrc) mainImg.src = mainSrc;
    mainImg.alt = getName(p);

    mainWrap.appendChild(mainImg);
    gallery.appendChild(mainWrap);

    // miniaturki (jeśli są kolejne zdjęcia)
    if (images.length > 1) {
      const thumbs = document.createElement("div");
      thumbs.className = "jm-product-thumbs";

      images.forEach((src, idx) => {
        const t = document.createElement("img");
        t.src = src;
        t.alt = getName(p) + " " + (idx + 1);
        t.className = "jm-product-thumb";
        if (idx === 0) t.classList.add("jm-product-thumb-active");

        t.addEventListener("click", () => {
          mainImg.src = src;
          document
            .querySelectorAll(".jm-product-thumb")
            .forEach((el) => el.classList.remove("jm-product-thumb-active"));
          t.classList.add("jm-product-thumb-active");
        });

        thumbs.appendChild(t);
      });

      gallery.appendChild(thumbs);
    }

    // --- PRAWA STRONA: INFO ---
    const info = document.createElement("div");
    info.className = "jm-product-info-full";

    const title = document.createElement("h1");
    title.textContent = getName(p);
    info.appendChild(title);

    const priceEl = document.createElement("p");
    priceEl.className = "jm-product-price-main";
    const price = getPricePLN(p);
    if (price) priceEl.textContent = price + " PLN";
    info.appendChild(priceEl);

    const lang = getLang();

    const meta = document.createElement("p");
    meta.className = "jm-product-meta-main";
    const metaParts = [];

    if (p.size) {
      metaParts.push(
        (lang === "en" ? "Size" : "Rozmiar") + ": " + p.size
      );
    }
    if (p.brand) {
      metaParts.push(
        (lang === "en" ? "Brand" : "Marka") + ": " + p.brand
      );
    }
    if (p.materials) {
      metaParts.push(
        (lang === "en" ? "Material" : "Materiał") + ": " + p.materials
      );
    }

    meta.textContent = metaParts.join(" | ");
    if (metaParts.length) info.appendChild(meta);

    const desc = document.createElement("p");
    desc.textContent = getDesc(p);
    info.appendChild(desc);

    // Sekcja z wymiarami (jeśli są jakieś dane)
    const measurementsEl = buildMeasurementsSection(p);
    if (measurementsEl) {
      info.appendChild(measurementsEl);
    }

    layout.appendChild(gallery);
    layout.appendChild(info);
    container.appendChild(layout);
  }

  async function init() {
    const productId = getQueryParam("id");
    if (!productId) {
      container.textContent = "Brak ID produktu w adresie.";
      return;
    }

    if (!window.loadJMProducts) {
      container.textContent = "Błąd konfiguracji danych produktu.";
      return;
    }

    let allProducts = [];
    try {
      allProducts = await loadJMProducts();
    } catch (e) {
      console.error("Błąd ładowania produktów:", e);
      container.textContent = "Nie udało się załadować danych produktu.";
      return;
    }

    const product = allProducts.find(
      (prod) => String(prod.id) === String(productId)
    );

    if (!product) {
      container.textContent = "Nie znaleziono produktu.";
      return;
    }

    renderProduct(product);
  }

  // zmiana języka – przerysuj produkt
  window.addEventListener("jmLangChange", () => {
    if (window.__JM_CURRENT_PRODUCT) {
      renderProduct(window.__JM_CURRENT_PRODUCT);
    }
  });

  init();
})();
