/* =============================================================
   Barbican: реклама в магазинах и на улице (2026-11-16) — блок под галереей SMM-кейса.
   Разметка — <div class="pj" data-project="barbican"> в <template id="case-barbican">.
   Витрины те же, что в Home Market: макеты слева, мокап справа; клик по макету ставит его на мокап.
   Картинки — images/smm/barbican/extra. Исходники и сборки мокапов — F:\Claude CODE\PORTFOLIO\Barbican\Офлайн.
   Мокапы bill-m, lb2-m, spider-m собраны мной (его макеты вставлены в его мокапы). Подписи — черновые.
   ============================================================= */
window.PROJECT_GROUPS = window.PROJECT_GROUPS || {};
(function () {
  const p = "images/smm/barbican/extra/";
  window.PROJECT_GROUPS["barbican"] = {
    // Два лайтбокса в торговом зале, один мокап: клик по макету меняет картинку в лайтбоксе
    "lb": { shows: [{ items: [0, 1], mockR: 1600 / 1289, stack: true }], rows: [], shots: [
      { src: p + "lb1", alt: "Лайтбокс Barbican: бутылки", size: "2,75 × 1,25 м", r: 1600 / 727, mock: p + "lb1-m" },
      { src: p + "lb2", alt: "Лайтбокс Barbican: бутылка из шишек хмеля", size: "2,75 × 1,25 м", r: 1600 / 729, mock: p + "lb2-m" }
    ] },
    // Паучок и воблер в один ряд одной высоты
    "pos": { showsRow: true, shows: [{ items: [0], mockR: 1600 / 1289, stack: true }, { items: [1], mockR: 1600 / 1289, stack: true }], rows: [], shots: [
      { src: p + "spider", alt: "Паучок Barbican в торговом центре", size: "0,8 × 1,8 м", r: 524 / 1182, mock: p + "spider-m" },
      { src: p + "wobbler", alt: "Воблер Barbican", size: "Воблер", ext: "png", r: 1, mock: p + "wobbler-m" }
    ] },
    // Билборд: макет слева, мокап справа
    "bill": { shows: [{ items: [0], mockR: 1600 / 1289, stack: true }], rows: [], shots: [
      { src: p + "bill", alt: "Билборд Barbican «Har bir tomchimdan zavq ol»", size: "6 × 3 м", r: 1600 / 799, mock: p + "bill-m" }
    ] },
    // «Волга»: по его просьбе мокап машины, под ним развёртка (мокап 014 обрезан до 2:1 — сверху небо, снизу асфальт)
    "car": { rows: [[0], [1]], shots: [
      { src: p + "car", alt: "«Волга» в оформлении Barbican", r: 2 },
      { src: p + "volga", alt: "Оформление «Волги», развёртка", size: "Развёртка оформления", ext: "png", r: 1600 / 534 }
    ] },
    // Меню: две страницы рядом и журнальный разворот
    "menu": { shows: [{ items: [0, 1], mockR: 1600 / 1289, stack: true, row: true }], rows: [], shots: [
      { src: p + "menu1", alt: "Меню Barbican: о напитке", size: "О напитке", r: 1000 / 1415, mock: p + "menu-m" },
      { src: p + "menu2", alt: "Меню Barbican: вкусы", size: "Вкусы", r: 1000 / 1415, mock: p + "menu-m" }
    ] }
  };
})();
