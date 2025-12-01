// Ładowanie produktów z Google Sheeta (GViz JSON)
// Wersja: mapujemy po NAZWACH nagłówków (id, name_pl, image_1 itd.),
// ignorując wielkość liter i spacje w nagłówkach.

async function loadJMProducts() {
  if (window.JM_PRODUCTS_CACHE) return window.JM_PRODUCTS_CACHE;

  const sheetId = JM_SHEET_CONFIG.sheetId;
  const sheetName = JM_SHEET_CONFIG.sheetName || "Arkusz1";

  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?sheet=${encodeURIComponent(
    sheetName
  )}&tqx=out:json`;

  const res = await fetch(url);
  const text = await res.text();

  const jsonStr = text.substring(text.indexOf("{"), text.lastIndexOf("}") + 1);
  const data = JSON.parse(jsonStr);

  const rows = data.table.rows || [];
  const cols = data.table.cols || [];

  // budujemy mapę: znormalizowana_nazwa -> index kolumny
  // normalizacja = trim + toLowerCase
  const colIndex = {};
  cols.forEach((col, idx) => {
    const labelRaw = col.label || "";
    const label = labelRaw.trim().toLowerCase();
    if (label) {
      colIndex[label] = idx;
    }
  });

  function cellByIndex(cells, idx) {
    if (idx == null || idx < 0) return "";
    const cell = cells[idx];
    return cell && cell.v != null ? cell.v : "";
  }

  function cellByLabel(cells, label) {
    if (!label) return "";
    const key = label.trim().toLowerCase();
    const idx = colIndex[key];
    return cellByIndex(cells, idx);
  }

  function normalizeImageLink(link) {
    if (!link) return "";

    // Google Drive: file/d/ID/view -> uc?export=view&id=ID
    if (link.includes("drive.google.com")) {
      const match = link.match(/\/d\/([^/]+)\//);
      if (match) {
        const id = match[1];
        return `https://drive.google.com/uc?export=view&id=${id}`;
      }
      return link;
    }

    // RAW GitHub / github.io – zostawiamy
    if (
      link.includes("raw.githubusercontent.com") ||
      link.includes("github.io")
    ) {
      return link;
    }

    // Ścieżki względne typu /images/product-003/front.jpg – zostawiamy jak są
    return link;
  }

  const mapped = rows
    .map((row) => {
      const cells = row.c || [];

      const id = cellByLabel(cells, "id");
      if (!id) return null;

      const statusRaw = cellByLabel(cells, "status") || "available";
      const status = statusRaw.toString().toLowerCase().trim();

      // Zbieramy zdjęcia po nagłówkach image_1...image_10
      const images = [];
      for (let i = 1; i <= 10; i++) {
        const label = `image_${i}`;
        const v = cellByLabel(cells, label);
        if (v) {
          images.push(normalizeImageLink(v));
        }
      }

      return {
        id: String(id),
        status,
        name_pl: cellByLabel(cells, "name_pl"),
        name_en: cellByLabel(cells, "name_en"),
        category: cellByLabel(cells, "category"),
        subcategory: cellByLabel(cells, "subcategory"),
        price_pln: Number(cellByLabel(cells, "price_pln") || 0),
        price_eur: Number(cellByLabel(cells, "price_eur") || 0),
        sale_pln: cellByLabel(cells, "sale_pln"),
        size: cellByLabel(cells, "size"),
        length_total: cellByLabel(cells, "length_total"),
        width_p2p: cellByLabel(cells, "width_p2p"),
        width_waist: cellByLabel(cells, "width_waist"),
        width_hips: cellByLabel(cells, "width_hips"),
        shoulder_width: cellByLabel(cells, "shoulder_width"),
        sleeve_pit: cellByLabel(cells, "sleeve_pit"),
        length_bottom: cellByLabel(cells, "length_bottom"),
        inseam: cellByLabel(cells, "inseam"),
        materials: cellByLabel(cells, "materials"),
        brand: cellByLabel(cells, "brand"),
        desc_pl: cellByLabel(cells, "desc_pl"),
        desc_en: cellByLabel(cells, "desc_en"),
        storytelling_pl: cellByLabel(cells, "storytelling_pl"),
        storytelling_en: cellByLabel(cells, "storytelling_en"),
        ig_tags: cellByLabel(cells, "ig_tags"),
        depop_tags: cellByLabel(cells, "depop_tags"),
        etsy_tags: cellByLabel(cells, "etsy_tags"),
        seo_keywords: cellByLabel(cells, "seo_keywords"),
        images,
      };
    })
    .filter((p) => p && p.status !== "sold");

  window.JM_PRODUCTS_CACHE = mapped;
  return mapped;
}
