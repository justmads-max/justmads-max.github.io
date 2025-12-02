// shop-sheet.js – WERSJA DEBUG
// Zamiast sklepu wypisuje strukturę JM_PRODUCTS na stronie,
// żebyśmy mogli ją podejrzeć na screenie.

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    const grid = document.getElementById("products");
    if (!grid) return;

    let info = [];
    let sample = null;

    try {
      if (typeof JM_PRODUCTS === "undefined") {
        info.push("JM_PRODUCTS: undefined");
      } else {
        const data = JM_PRODUCTS;
        info.push("typeof JM_PRODUCTS: " + typeof data);
        info.push("Array.isArray(JM_PRODUCTS): " + Array.isArray(data));

        if (data && typeof data === "object") {
          info.push("Główne klucze obiektu: " + Object.keys(data).join(", "));
        }

        // Spróbuj wyciągnąć przykładowy element
        if (Array.isArray(data) && data.length) {
          sample = data[0];
          info.push("Przykład: JM_PRODUCTS[0]");
        } else if (data && Array.isArray(data.rows) && data.rows.length) {
          sample = data.rows[0];
          info.push("Przykład: JM_PRODUCTS.rows[0]");
        } else if (data && Array.isArray(data.data) && data.data.length) {
          sample = data.data[0];
          info.push("Przykład: JM_PRODUCTS.data[0]");
        } else {
          info.push("Nie znaleziono oczywistej tablicy z produktami (ani .rows, ani .data).");
        }
      }
    } catch (e) {
      info.push("Błąd przy odczycie JM_PRODUCTS: " + String(e));
    }

    grid.innerHTML = `
      <h3 style="margin-top:1.5rem;">🔧 Debug – struktura danych z arkusza</h3>
      <p>Proszę, zrób screen tego bloku i wyślij mi go 🙂</p>
      <pre style="
        white-space: pre-wrap;
        font-size: 12px;
        background: #111;
        padding: 1rem;
        border-radius: 10px;
        border: 1px solid rgba(247,245,242,0.2);
        max-height: 480px;
        overflow: auto;
      ">
${info.join("\n")}

-------- JSON.stringify przykładowego elementu --------
${sample ? JSON.stringify(sample, null, 2) : "sample: null (nic nie znaleziono)"}
      </pre>
    `;
  });
})();
