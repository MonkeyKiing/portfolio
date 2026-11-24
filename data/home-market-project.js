/* =============================================================
   Данные кейса «Home Market» в разделе «Сторонние проекты».
   Разметка кейса — <template id="case-home-market-project"> в index.html.

   Группа картинок: cols — колонок, ratio — пропорция плитки,
   fit — cover (заполнить), contain (вписать на белом), clear (вписать без подложки).
   rows вместо cols: ряды одной высоты из номеров кадров, вложенный массив — столбик внутри ряда; r — пропорция кадра.
   { wip: true } — заглушка «В разработке», { cycle: [...] } — плитка со сменой картинок.
   В shots: src без расширения, alt, size — подпись под плиткой,
   ext: "png" — для прозрачных картинок, zoom: 0.7 — в просмотре занять только 70% экрана (для слабых по качеству).
   Файлы: NN.webp (полная) и NN-thumb.webp (плитка).
   ============================================================= */
window.PROJECT_GROUPS = window.PROJECT_GROUPS || {};
window.PROJECT_GROUPS["home-market"] = {
  // Фасад (2026-11-11): его новый мокап здания (001), в него вставлены мной три макета; клик по макету ставит его на мокап.
  // Прежний мокап (смена трёх картинок, facade/01, 03, 05) снят по его просьбе
  "facade": { shows: [{ items: [0, 1, 2], mockR: 1470 / 1826, stack: true }], rows: [], shots: [
    { src: "images/projects/home-market/facade/02", alt: "Баннер на фасаде здания Ташсельмаш, 2020", size: "4,81 × 5,78 м", r: 1510 / 1800, mock: "images/projects/home-market/facademock/02" },
    { src: "images/projects/home-market/facade/04", alt: "Баннер на фасаде здания Ташсельмаш, 2021", size: "4,81 × 5,78 м", r: 1510 / 1800, mock: "images/projects/home-market/facademock/04" },
    { src: "images/projects/home-market/facade/06", alt: "Баннер на фасаде здания Ташсельмаш, 2022", size: "4,81 × 5,78 м", r: 1510 / 1800, mock: "images/projects/home-market/facademock/06" }
  ] },
  // Билборды с брендами-партнёрами (2026-11-11): по его скриншоту сняты «Зажигай», «Дорогой» и Makon Mall.
  // Все шесть плиток одной пропорции 1,832: щит 82% ширины, верх щита на одной линии (01 и brands/05, 06 перекадрированы). Сетка: на телефоне по два
  "b5050": { cols: 3, ratio: "1832 / 1000", fit: "clear", shots: [
    { src: "images/projects/home-market/b5050/01", alt: "Билборд с брендом-партнёром", size: "6 × 3 м", ext: "png", r: 1.832 },
    { src: "images/projects/home-market/b5050/04", alt: "Билборд с брендом-партнёром", size: "6 × 3 м", ext: "png", r: 1.832 },
    { src: "images/projects/home-market/b5050/05", alt: "Билборд с брендом-партнёром", size: "6 × 3 м", ext: "png", r: 1.832 },
    { src: "images/projects/home-market/b5050/06", alt: "Билборд с брендом-партнёром", size: "6 × 3 м", ext: "png", r: 1.832 },
    { src: "images/projects/home-market/brands/05", alt: "Билборд с брендом-партнёром", size: "6 × 3 м", ext: "png", r: 1.832 },
    { src: "images/projects/home-market/brands/06", alt: "Билборд с брендом-партнёром", size: "6 × 3 м", ext: "png", r: 1.832 }
  ] },
  // Билборды с объёмными элементами (2026-11-15, его PNG без фона из _ВходящиеHome Market 001–004):
  // к щиту крепили отдельный элемент, и он выходил за рамку. Щиты выровнены: одного размера, верх на одной линии.
  // Оформление («визуал») он придумает позже
  "b3d": { cols: 2, ratio: "1080 / 846", fit: "clear", shots: [
    { src: "images/projects/home-market/b3d/01", alt: "Билборд Beshr: батарейка выходит за рамку щита", size: "6 × 3 м", ext: "png", r: 1080 / 846 },
    { src: "images/projects/home-market/b3d/02", alt: "Билборд «Дари радость»: букет и подарки выходят за рамку щита", size: "6 × 3 м", ext: "png", r: 1080 / 846 },
    { src: "images/projects/home-market/b3d/03", alt: "Билборд «Дари радость»: букет и подарок выходят за рамку щита", size: "6 × 3 м", ext: "png", r: 1080 / 846 },
    { src: "images/projects/home-market/b3d/04", alt: "Билборд «Дари радость»: букет и подарок выходят за рамку щита", size: "6 × 3 м", ext: "png", r: 1080 / 846 }
  ] },
  // Растяжки на мостах (2026-11-11): клик по растяжке ставит её пару на мокап моста ниже (его мокап моста 2022,
  // растяжки вставлены мной: a — 01+02, b — 03+04, c — его оригинал с оранжевой и синей, d — розовая и синяя)
  "bridge": { cols: 2, ratio: "5 / 1", fit: "cover", shots: [
    { src: "images/projects/home-market/bridge/01", alt: "Растяжка на мосту, Школьный базар", size: "10 × 2 м", set: "bra" },
    { src: "images/projects/home-market/bridge/02", alt: "Растяжка на мосту, Maktab bozori", size: "10 × 2 м", set: "bra" },
    { src: "images/projects/home-market/bridge/03", alt: "Растяжка на мосту, новогодняя", size: "10 × 2 м", set: "brb" },
    { src: "images/projects/home-market/bridge/04", alt: "Растяжка на мосту, новогодняя", size: "10 × 2 м", set: "brb" }
  ] },
  // Мокап школьного базара на мосту, под ним три цвета растяжки в ряд (с подписями размеров столбик не помещается)
  // 2026-11-23 (его просьба): розовая растяжка снята — остались синяя и оранжевая (файл bridgeph/04 не удалён)
  "bridgeph": { rows: [[0, 1]], shots: [
    { src: "images/projects/home-market/bridgeph/02", alt: "Растяжка школьного базара, синяя", size: "10 × 2 м", r: 5.082, set: "brc" },
    { src: "images/projects/home-market/bridgeph/03", alt: "Растяжка школьного базара, оранжевая", size: "10 × 2 м", r: 5.102, set: "brc" }
  ] },
  "bridgemock": { cols: 1, ratio: "1600 / 1289", fit: "cover",
    mockset: { bra: ["images/projects/home-market/bridgemock/a"], brb: ["images/projects/home-market/bridgemock/b"], brc: ["images/projects/home-market/bridgemock/c"], brd: ["images/projects/home-market/bridgemock/d"] },
    shots: [{ src: "images/projects/home-market/bridgemock/a", alt: "Растяжки на мосту, мокап", size: "Мокап" }]
  },
  // Зелёная Maktab bozori — не мост, а большой баннер в торговом центре: его мокап стены ТЦ, картинка вставлена мной.
  // Было два почти одинаковых файла (черновик и финал «Отдать»), по его просьбе оставлен один — финал (bridge/06)
  "mallwall": { rows: [[0], [1]], shots: [
    { src: "images/projects/home-market/bridge/06", alt: "Баннер Maktab bozori в торговом центре", size: "10 × 2 м", r: 5.373 },
    { src: "images/projects/home-market/mallmock/w6", alt: "Баннер Maktab bozori в торговом центре, мокап", size: "Мокап", r: 1600 / 893 }
  ] },
  "brands": { cols: 2, ratio: "2 / 1", fit: "cover", shots: [
    // Белые баннеры с полкой и сковородкой: в просмотре меньше на 30% (его просьба)
    { src: "images/projects/home-market/brands/02", alt: "Билборд с брендом-партнёром", size: "6 × 3 м", zoom: 0.7 },
    { src: "images/projects/home-market/brands/03", alt: "Билборд с брендом-партнёром", size: "6 × 3 м", zoom: 0.7 }
  ] },
  "mezh": { cols: 3, ratio: "3 / 2", fit: "cover", shots: [
    { src: "images/projects/home-market/mezh/01", alt: "Лайтбокс над эскалатором", size: "1,18 × 0,83 м", set: "a" },
    { src: "images/projects/home-market/mezh/02", alt: "Лайтбокс над эскалатором", size: "1,18 × 0,83 м", set: "a" },
    { src: "images/projects/home-market/mezh/03", alt: "Лайтбокс над эскалатором", size: "1,18 × 0,83 м", set: "a" },
    { src: "images/projects/home-market/mezh/04", alt: "Лайтбокс над эскалатором", size: "1,18 × 0,83 м", set: "b" },
    { src: "images/projects/home-market/mezh/05", alt: "Лайтбокс над эскалатором", size: "1,18 × 0,83 м", set: "b" },
    { src: "images/projects/home-market/mezh/06", alt: "Лайтбокс над эскалатором", size: "1,18 × 0,83 м", set: "b" }
  ] },
  // Три его мокапа над эскалатором (слева одиночный, в центре двойной, справа одиночный), в них — лайтбоксы с сайта.
  // Клик по лайтбоксу серии (set в mezh, mezh24) ставит на мокапы его серию; в серии из трёх один лайтбокс повторяется
  // (a: 02 | 01+02 | 03, b: 05 | 04+05 | 06, c: mezh24 01 | 02+03 | 04). Собраны мной 2026-11-10, прежние мокапы ШБ — в mezhph/
  "mezhph": { cols: 3, ratio: "1696 / 2528", fit: "cover",
    mockset: {
      a: ["images/projects/home-market/mezhset/a1", "images/projects/home-market/mezhset/a2", "images/projects/home-market/mezhset/a3"],
      b: ["images/projects/home-market/mezhset/b1", "images/projects/home-market/mezhset/b2", "images/projects/home-market/mezhset/b3"],
      c: ["images/projects/home-market/mezhset/c1", "images/projects/home-market/mezhset/c2", "images/projects/home-market/mezhset/c3"]
    },
    shots: [
    { src: "images/projects/home-market/mezhset/a1", alt: "Лайтбокс над эскалатором, мокап" },
    { src: "images/projects/home-market/mezhset/a2", alt: "Два лайтбокса над эскалатором, мокап" },
    { src: "images/projects/home-market/mezhset/a3", alt: "Лайтбокс над эскалатором, мокап" }
  ] },  "mezh24": { cols: 4, ratio: "3 / 2", fit: "cover", shots: [
    { src: "images/projects/home-market/mezh24/01", alt: "Лайтбокс над эскалатором, 2024", size: "1,18 × 0,83 м", set: "c" },
    { src: "images/projects/home-market/mezh24/02", alt: "Лайтбокс над эскалатором, 2024", size: "1,18 × 0,83 м", set: "c" },
    { src: "images/projects/home-market/mezh24/03", alt: "Лайтбокс над эскалатором, 2024", size: "1,18 × 0,83 м", set: "c" },
    { src: "images/projects/home-market/mezh24/04", alt: "Лайтбокс над эскалатором, 2024", size: "1,18 × 0,83 м", set: "c" }
  ] },
  // Вертикальные лайтбоксы у касс (2026-11-11): три макета в ряд и его мокап 001 справа, на нём все три сразу.
  // Лайтбокс «Купи меня» (lb/01) снят по его просьбе
  "lb": { shows: [{ items: [0, 1, 2], mockR: 1600 / 1289, stack: true, row: true }], rows: [], shots: [
    { src: "images/projects/home-market/lb/02", alt: "Лайтбокс у касс: гладильная доска AIKO", size: "1,17 × 1,98 м", r: 0.591, mock: "images/projects/home-market/lbmock/v1" },
    { src: "images/projects/home-market/lb/03", alt: "Лайтбокс у касс: бесплатный Wi-Fi", size: "1,17 × 1,98 м", r: 0.591, mock: "images/projects/home-market/lbmock/v1" },
    { src: "images/projects/home-market/lb/04", alt: "Лайтбокс у касс: подарочная карта", size: "1,17 × 1,98 м", r: 0.591, mock: "images/projects/home-market/lbmock/v1" }
  ] },
  // Горизонтальные лайтбоксы (2026-11-11): витрина со сменой на его мокапе 002 (в нём был Kukmara), каждый вставлен мной (lbmock/k1–k6)
  "lb2": { shows: [{ items: [0, 1, 2, 3, 4, 5], mockR: 1600 / 1289 }], rows: [], shots: [
    { src: "images/projects/home-market/lb2/01", alt: "Лайтбокс в торговом зале", size: "1,98 × 1,17 м", r: 1.692, mock: "images/projects/home-market/lbmock/k1" },
    { src: "images/projects/home-market/lb2/02", alt: "Лайтбокс в торговом зале", size: "1,98 × 1,17 м", r: 1.692, mock: "images/projects/home-market/lbmock/k2" },
    { src: "images/projects/home-market/lb2/03", alt: "Лайтбокс в торговом зале", size: "1,98 × 1,17 м", r: 1.692, mock: "images/projects/home-market/lbmock/k3" },
    { src: "images/projects/home-market/lb2/04", alt: "Лайтбокс в торговом зале", size: "1,98 × 1,17 м", r: 1.692, mock: "images/projects/home-market/lbmock/k4" },
    { src: "images/projects/home-market/lb2/05", alt: "Лайтбокс в торговом зале", size: "1,98 × 1,17 м", r: 1.692, mock: "images/projects/home-market/lbmock/k5" },
    { src: "images/projects/home-market/lb2/06", alt: "Лайтбокс в торговом зале", size: "1,98 × 1,17 м", r: 1.692, mock: "images/projects/home-market/lbmock/k6" }
  ] },
  "glass": { cols: 1, ratio: "5.41 / 1", fit: "cover", shots: [
    { src: "images/projects/home-market/glass/01", alt: "Оклейка стёкол при входе", size: "8,12 × 1,5 м" },
    { src: "images/projects/home-market/glass/02", alt: "Оклейка стёкол при входе: подарочная карта", size: "18 × 3 м" }
  ] },
  "glassph": { cols: 2, ratio: "1214 / 634", fit: "cover", shots: [
    { src: "images/projects/home-market/glassph/01", alt: "Стёкла при входе, мокап" },
    { src: "images/projects/home-market/glassph/02", alt: "Стёкла при входе, мокап" }
  ] },
  // Эскалаторы (2026-11-11): две картинки в ряд и мокап траволатора справа (его мокап из «Десятилетия», картинки вставлены мной),
  // мокап меняется при наведении. Прежние фото esc/01, 03 сняты
  "esc": { shows: [{ items: [0, 1], mockR: 1200 / 2150, stack: true, row: true }], rows: [], shots: [
    { src: "images/projects/home-market/esc/02", alt: "Оформление эскалатора", size: "1,4 × 7,56 м", r: 0.185, mock: "images/projects/home-market/escmock/e2" },
    { src: "images/projects/home-market/esc/04", alt: "Оформление эскалатора «Всегда найдёшь что выбрать»", size: "1,4 × 7,15 м", r: 0.196, mock: "images/projects/home-market/escmock/e4" }
  ] },
  // Указатели над атриумом (2026-11-11): витрина со сменой на его мокапе указателя (из Нового года 2025), все восемь вставлены мной
  "point": { shows: [{ items: [0, 1, 2, 3, 4, 5, 6, 7], mockR: 1600 / 1289 }], rows: [], shots: [
    { src: "images/projects/home-market/point/01", alt: "Указатель над атриумом", size: "1 × 1 м", ext: "png", r: 1, mock: "images/projects/home-market/pointmock/01" },
    { src: "images/projects/home-market/point/02", alt: "Указатель над атриумом", size: "1 × 1 м", ext: "png", r: 1, mock: "images/projects/home-market/pointmock/02" },
    { src: "images/projects/home-market/point/03", alt: "Указатель над атриумом", size: "1 × 1 м", ext: "png", r: 1, mock: "images/projects/home-market/pointmock/03" },
    { src: "images/projects/home-market/point/04", alt: "Указатель над атриумом", size: "1 × 1 м", ext: "png", r: 1, mock: "images/projects/home-market/pointmock/04" },
    { src: "images/projects/home-market/point/05", alt: "Указатель над атриумом", size: "1 × 1 м", ext: "png", r: 1, mock: "images/projects/home-market/pointmock/05" },
    { src: "images/projects/home-market/point/06", alt: "Указатель над атриумом", size: "1 × 1 м", ext: "png", r: 1, mock: "images/projects/home-market/pointmock/06" },
    { src: "images/projects/home-market/point/07", alt: "Указатель над атриумом", size: "1 × 1 м", ext: "png", r: 1, mock: "images/projects/home-market/pointmock/07" },
    { src: "images/projects/home-market/point/08", alt: "Указатель над атриумом", size: "1 × 1 м", ext: "png", r: 1, mock: "images/projects/home-market/pointmock/08" }
  ] },
  // Подвесные таблички (2026-11-11): по три на его мокапе (01–03, 04–06, 07–09, 10–12, вставлены мной).
  // Клик по табличке ставит на мокап её тройку, тройка подсвечивается; повторный клик открывает табличку крупно
  // 2026-11-23 (его просьба): все 12 табличек одним рядом под мокапом
  "tags": { cols: 12, ratio: "857 / 1800", fit: "clear", shots: [
    { src: "images/projects/home-market/tags/01", alt: "Подвесная табличка", ext: "png", size: "0,5 × 1 м", set: "t1" },
    { src: "images/projects/home-market/tags/02", alt: "Подвесная табличка", ext: "png", size: "0,5 × 1 м", set: "t1" },
    { src: "images/projects/home-market/tags/03", alt: "Подвесная табличка", ext: "png", size: "0,5 × 1 м", set: "t1" },
    { src: "images/projects/home-market/tags/04", alt: "Подвесная табличка", ext: "png", size: "0,5 × 1 м", set: "t2" },
    { src: "images/projects/home-market/tags/05", alt: "Подвесная табличка", ext: "png", size: "0,5 × 1 м", set: "t2" },
    { src: "images/projects/home-market/tags/06", alt: "Подвесная табличка", ext: "png", size: "0,5 × 1 м", set: "t2" },
    { src: "images/projects/home-market/tags/07", alt: "Подвесная табличка", ext: "png", size: "0,5 × 1 м", set: "t3" },
    { src: "images/projects/home-market/tags/08", alt: "Подвесная табличка", ext: "png", size: "0,5 × 1 м", set: "t3" },
    { src: "images/projects/home-market/tags/09", alt: "Подвесная табличка", ext: "png", size: "0,5 × 1 м", set: "t3" },
    { src: "images/projects/home-market/tags/10", alt: "Подвесная табличка", ext: "png", size: "0,5 × 1 м", set: "t4" },
    { src: "images/projects/home-market/tags/11", alt: "Подвесная табличка", ext: "png", size: "0,5 × 1 м", set: "t4" },
    { src: "images/projects/home-market/tags/12", alt: "Подвесная табличка", ext: "png", size: "0,5 × 1 м", set: "t4" }
  ] },
  // 2026-11-23 (его просьба): мокап сверху, на странице обрезан ровно сверху и снизу (по 8,75 %), в просмотре — целиком
  "tagsph": { cols: 1, ratio: "2304 / 1531", fit: "cover",
    mockset: { t1: ["images/projects/home-market/tagmock/t1"], t2: ["images/projects/home-market/tagmock/t2"], t3: ["images/projects/home-market/tagmock/t3"], t4: ["images/projects/home-market/tagmock/t4"] },
    shots: [{ src: "images/projects/home-market/tagmock/t1", alt: "Подвесные таблички в торговом зале, мокап", size: "Мокап" }]
  },
  // Две картинки на всю ширину, ряд одной высоты, каждая в своих пропорциях
  "win": { rows: [[0, 1]], shots: [
    { src: "images/projects/home-market/win/01", alt: "Оформление витрин: «Mehr bilan sovg‘a qiling» и «Uy uchun», мокап", size: "Мокап", r: 2304 / 1856 },
    { src: "images/projects/home-market/win/02", alt: "Оформление окон с отделами магазина, мокап", size: "Мокап", r: 2304 / 1856 }
  ] },
  "zones": { rows: [[0, 1], [2, 3]], shots: [
    { src: "images/projects/home-market/zones/01", alt: "Новогодняя фотозона 2025, мокап", size: "Мокап", r: 2304 / 1856 },
    { src: "images/projects/home-market/zones/02", alt: "Фотозона-домик «Подарок каждому ребёнку», мокап", size: "Мокап", r: 1856 / 2304 },
    { src: "images/projects/home-market/zones/03", alt: "Фотозона-смартфон «Подарок каждому ребёнку», мокап", size: "Мокап", r: 1856 / 2304 },
    { src: "images/projects/home-market/zones/04", alt: "Новогодняя фотозона-домик, мокап", size: "Мокап", r: 1856 / 2304 }
  ] },
  // «Газели» (2026-11-11, его просьба): пять дизайнов борта вырезаны мной с его мокапов (исходников нет), дубль «10 лет» снят.
  // Пропорция борта 2,8 : 1 (проверено по круглой иконке Telegram); «10 лет» с другой машины — 2,2 : 1, на мокап поставлен с зеркальными полями.
  // Просмотр дизайнов на компьютере вдвое меньше (zoomPc, его просьба: качество слабое). Клик по дизайну ставит его на мокап ниже (его новый мокап 001.webp, дизайн вставлен мной), повторный клик — просмотр
  "gaz": { cols: 5, ratio: "14 / 5", fit: "cover", shots: [
    { src: "images/projects/home-market/gaz/01", alt: "Оформление «Газели», борт", size: "2020", set: "g1", zoomPc: 0.5 },
    { src: "images/projects/home-market/gaz/02", alt: "Оформление «Газели», борт", size: "2024", set: "g2", zoomPc: 0.5 },
    { src: "images/projects/home-market/gaz/03", alt: "Оформление «Газели», борт", size: "2025", set: "g3", zoomPc: 0.5 },
    { src: "images/projects/home-market/gaz/04", alt: "Оформление «Газели», борт", size: "2025", set: "g4", zoomPc: 0.5 },
    { src: "images/projects/home-market/gaz/05", alt: "Оформление «Газели», борт", size: "2025", set: "g5", zoomPc: 0.5 }
  ] },
  "gazmock": { cols: 1, ratio: "1600 / 1289", fit: "cover",
    mockset: { g1: ["images/projects/home-market/gazmock/01"], g2: ["images/projects/home-market/gazmock/02"], g3: ["images/projects/home-market/gazmock/03"], g4: ["images/projects/home-market/gazmock/04"], g5: ["images/projects/home-market/gazmock/05"] },
    shots: [{ src: "images/projects/home-market/gazmock/01", alt: "«Газель» с дизайном на борту, мокап", size: "Мокап" }]
  },
  // Автобусы Самарканда (2026-11-11, его просьба): сцена — едем за автобусом, на задней части по очереди 9 дизайнов
  // (pjBuildBus). Мокапы с крестиками сняты. Дизайны 03, 05, 08, 09 — исходников нет, вырезаны мной с его мокапов
  "bus": { size: "165 × 93 см", shots: [
    { src: "images/projects/home-market/bus/01", alt: "Гладильная доска и утюг, AIKO", year: "2022" },
    { src: "images/projects/home-market/bus/02", alt: "Национальные сувениры", year: "2024" },
    { src: "images/projects/home-market/bus/03", alt: "Кухонные инструменты Kukmara", year: "2024" },
    { src: "images/projects/home-market/bus/04", alt: "Стул", year: "2024" },
    { src: "images/projects/home-market/bus/05", alt: "Домашние тапочки", year: "2024" },
    { src: "images/projects/home-market/bus/06", alt: "Набор посуды Luminarc", year: "2024" },
    { src: "images/projects/home-market/bus/07", alt: "Плетёная садовая мебель, AIKO", year: "2024" },
    { src: "images/projects/home-market/bus/08", alt: "Садовый диван и кресла, AIKO", year: "2024" },
    { src: "images/projects/home-market/bus/09", alt: "Круглый плетёный лежак, AIKO", year: "2024" }
  ] },
  "y2020": { rows: [[0, 1]], shots: [
    { src: "images/projects/home-market/y2020/02", alt: "Школьный базар, 2020", size: "SMM 1:1", r: 1 },
    { src: "images/projects/home-market/y2020/03", alt: "Школьный базар, 2020", size: "6 × 3 м", r: 1.776 }
  ] },
  // Витрины-стопки (2026-11-10): макеты слева, крупный мокап справа. Билборды — в его мокап 002 (собраны мной, bb21),
  // растяжки — в его мокап моста (bridge21/01: 05 вместо оранжевой, 06 вместо синей). Красный в рамке (повтор 03) снят,
  // фиолетовый вырезан из рамки (01.webp)
  "y2021": { shows: [{ items: [0, 1, 2], mockR: 1600 / 1289, stack: true }, { items: [3, 4], mockR: 1600 / 1289, stack: true }], rows: [], shots: [
    { src: "images/projects/home-market/y2021/03", alt: "Школьный базар, 2021", size: "6 × 3 м", r: 2.036, mock: "images/projects/home-market/bb21/01" },
    { src: "images/projects/home-market/y2021/04", alt: "Школьный базар, 2021", size: "6 × 3 м", r: 2.025, mock: "images/projects/home-market/bb21/02" },
    { src: "images/projects/home-market/y2021/01", alt: "Школьный базар, 2021", size: "6 × 3 м", r: 2.001, mock: "images/projects/home-market/bb21/03" },
    { src: "images/projects/home-market/y2021/05", alt: "Школьный базар, 2021", size: "10 × 2 м", r: 5.099, mock: "images/projects/home-market/bridge21/01" },
    { src: "images/projects/home-market/y2021/06", alt: "Школьный базар, 2021", size: "10 × 2 м", r: 5.099, mock: "images/projects/home-market/bridge21/01" }
  ] },
  // Мокап и растяжки берутся из bridgeph — те же файлы, что в «Растяжках на мостах»
  // Витрины-стопки (2026-11-10): билборд + мокап bb22/01 (собран мной в его 002); растяжки + его мокап моста
  // bridge22/01 (оранжевая и синяя) — один на все три, по его просьбе мокап не меняется
  "y2022": { shows: [{ items: [0], mockR: 1600 / 1289, stack: true }, { items: [1, 2], mockR: 1600 / 1289, stack: true }], rows: [], shots: [
    { src: "images/projects/home-market/y2022/01", alt: "Школьный базар, 2022", size: "6 × 3 м", r: 2.016, mock: "images/projects/home-market/bb22/01" },
    { src: "images/projects/home-market/bridgeph/02", alt: "Растяжка школьного базара, синяя, 2022", size: "10 × 2 м", r: 5.082, mock: "images/projects/home-market/bridge22/01" },
    { src: "images/projects/home-market/bridgeph/03", alt: "Растяжка школьного базара, оранжевая, 2022", size: "10 × 2 м", r: 5.102, mock: "images/projects/home-market/bridge22/01" }
  ] }, // розовая растяжка снята 2026-11-23
  // Витрина «макет + мокап» (2026-11-10). Мокапы mezhph24 собраны мной: макеты 2024 вставлены в его фото-мокапы 2025.
  // Двойной (mezhph24/01): девочка и мальчик на узбекском (01 слева, 03 справа); 02 — девочка ru, 04 — мальчик ru (его раскладка)
  // Билборды 6×3 — вторая витрина: вырезаны без рамки и стойки; bb24/01 — его мокап (мальчик), bb24/02 — собран мной (девочка)
  "y2024": { show: [0, 1, 2, 3], shows: [{ items: [4, 5], mockR: 1600 / 1289, stack: true }, { items: [6], mockR: 1600 / 893, stack: true }], rows: [], shots: [
    { src: "images/projects/home-market/y2024/01", alt: "Школьный базар, 2024", size: "1,18 × 0,83 м", r: 1.416, mock: "images/projects/home-market/mezhph24/01" },
    { src: "images/projects/home-market/y2024/02", alt: "Школьный базар, 2024", size: "1,18 × 0,83 м", r: 1.416, mock: "images/projects/home-market/mezhph24/02" },
    { src: "images/projects/home-market/y2024/03", alt: "Школьный базар, 2024", size: "1,18 × 0,83 м", r: 1.416, mock: "images/projects/home-market/mezhph24/01" },
    { src: "images/projects/home-market/y2024/04", alt: "Школьный базар, 2024", size: "1,18 × 0,83 м", r: 1.416, mock: "images/projects/home-market/mezhph24/03" },
    { src: "images/projects/home-market/y2024/05", alt: "Школьный базар, 2024: билборд, мальчик", size: "6 × 3 м", r: 2.003, mock: "images/projects/home-market/bb24/01" },
    { src: "images/projects/home-market/y2024/06", alt: "Школьный базар, 2024: билборд, девочка", size: "6 × 3 м", r: 2.003, mock: "images/projects/home-market/bb24/02" },
    { src: "images/projects/home-market/y2024/07", alt: "Школьный базар, 2024: растяжка", size: "10 × 2 м", r: 5.335, mock: "images/projects/home-market/y2024/m07" } // m07 — его мокап на стене ТЦ
  ] },
  // show — витрина «макет + мокап» (2026-11-10, его шаблон): сверху крупно макет и рядом его мокап, под ними
  // остальные макеты; клик по нижнему ставит его наверх, прежний уходит вниз на своё место. Просмотр на весь экран не открывается.
  // mock — мокап лайтбокса над эскалатором в ТЦ (mezhph).
  // Двойной мокап (mezhph/02) общий для двух девочек: 03 — справа, 04 — слева
  "y2025": { show: [0, 1, 2, 3, 6], rows: [[4, 5]], shots: [
    { src: "images/projects/home-market/y2025/01", alt: "Школьный базар, 2025", size: "1,18 × 0,83 м", r: 1.416, mock: "images/projects/home-market/mezhph/03" },
    { src: "images/projects/home-market/y2025/02", alt: "Школьный базар, 2025", size: "1,18 × 0,83 м", r: 1.416, mock: "images/projects/home-market/mezhph/01" },
    { src: "images/projects/home-market/y2025/03", alt: "Школьный базар, 2025", size: "1,18 × 0,83 м", r: 1.416, mock: "images/projects/home-market/mezhph/02" },
    { src: "images/projects/home-market/y2025/04", alt: "Школьный базар, 2025", size: "1,18 × 0,83 м", r: 1.416, mock: "images/projects/home-market/mezhph/02" },
    // Слева мокап зоны в ТЦ с баннером 06 (заменил баннер 05, 2026-11-10); оба в просмотре на 30% меньше
    { src: "images/projects/home-market/y2025/m06", alt: "Школьный базар, 2025: баннер зоны в торговом центре", size: "Мокап", r: 1.241 },
    { src: "images/projects/home-market/y2025/06", alt: "Школьный базар, 2025", size: "6,86 × 2,31 м", r: 2.97, zoom: 0.7 },
    { src: "images/projects/home-market/y2025/07", alt: "Школьный базар, 2025", size: "1,18 × 0,83 м", r: 1.416, mock: "images/projects/home-market/mezhph/04" }
  ] },
  // Веб-баннеры живут в разделе «Баннеры для сайтов» (его просьба, 2026-11-08): из годов Школьного базара
  // и Нового года убраны. Родной размер (w — ширина на странице в px), в просмотре не больше 1,3×.
  // Сверху растяжка 1920, слева half-page 600×1200 (показан как 300×600), справа остальные
  "webSb24": { rows: [], web: { title: "Школьный базар, 2024", full: 0, tall: 1, col: [2, 4, 3], shots: [
    { src: "images/projects/home-market/y2024/w1920", alt: "Веб-баннер 1920×120, Школьный базар 2024", ext: "png", size: "1920 × 120 px", r: 16, w: 1920, max: 1.3 },
    { src: "images/projects/home-market/y2024/w600", alt: "Веб-баннер 600×1200, Школьный базар 2024", ext: "png", size: "600 × 1200 px", r: 0.5, w: 300, max: 1.3 },
    { src: "images/projects/home-market/y2024/w768", alt: "Веб-баннер 768×120, Школьный базар 2024", ext: "png", size: "768 × 120 px", r: 6.4, w: 768, max: 1.3 },
    { src: "images/projects/home-market/y2024/w370", alt: "Веб-баннер 370×120, Школьный базар 2024", ext: "png", size: "370 × 120 px", r: 3.083, w: 370, max: 1.3 },
    { src: "images/projects/home-market/y2024/w300", alt: "Веб-баннер 300×250, Школьный базар 2024", ext: "png", size: "300 × 250 px", r: 1.2, w: 300, max: 1.3 }
  ] } },
  "webSb25": { rows: [], web: { title: "Школьный базар, 2025", full: 0, tall: 1, col: [2, 4, 3], shots: [
    { src: "images/projects/home-market/y2025/w1920", alt: "Веб-баннер 1920×120, Школьный базар 2025", ext: "png", size: "1920 × 120 px", r: 16, w: 1920, max: 1.3 },
    { src: "images/projects/home-market/y2025/w600", alt: "Веб-баннер 600×1200, Школьный базар 2025", ext: "png", size: "600 × 1200 px", r: 0.5, w: 300, max: 1.3 },
    { src: "images/projects/home-market/y2025/w768", alt: "Веб-баннер 768×120, Школьный базар 2025", ext: "png", size: "768 × 120 px", r: 6.4, w: 768, max: 1.3 },
    { src: "images/projects/home-market/y2025/w470", alt: "Веб-баннер 470×120, Школьный базар 2025", ext: "png", size: "470 × 120 px", r: 3.917, w: 470, max: 1.3 },
    { src: "images/projects/home-market/y2025/w300", alt: "Веб-баннер 300×250, Школьный базар 2025", ext: "png", size: "300 × 250 px", r: 1.2, w: 300, max: 1.3 }
  ] } },
  "webNy24": { rows: [], web: { title: "Новый год, 2024", full: 0, tall: 1, col: [2, 4, 3], shots: [
    { src: "images/projects/home-market/n2024/w1920", alt: "Веб-баннер 1920×120, Новый год 2024", ext: "png", size: "1920 × 120 px", r: 16, w: 1920, max: 1.3 },
    { src: "images/projects/home-market/n2024/w600", alt: "Веб-баннер 600×1200, Новый год 2024", ext: "png", size: "600 × 1200 px", r: 0.5, w: 300, max: 1.3 },
    { src: "images/projects/home-market/n2024/w768", alt: "Веб-баннер 768×120, Новый год 2024", ext: "png", size: "768 × 120 px", r: 6.4, w: 768, max: 1.3 },
    { src: "images/projects/home-market/n2024/w370", alt: "Веб-баннер 370×120, Новый год 2024", ext: "png", size: "370 × 120 px", r: 3.083, w: 370, max: 1.3 },
    { src: "images/projects/home-market/n2024/w300", alt: "Веб-баннер 300×250, Новый год 2024", ext: "png", size: "300 × 250 px", r: 1.2, w: 300, max: 1.3 }
  ] } },
  // Одна общая картинка персонажей без фона (прежние chars/01–04 сняты с сайта)
  "chars": { rows: [[0]], shots: [
    // anim: та же картинка, разрезанная на слои (chars/anim) и оживлённая в CSS; координаты в пикселях исходника 2179×709
    { src: "images/projects/home-market/chars/05", alt: "Персонажи кампании: мальчик и девочка", ext: "png", r: 3.073,
      anim: { dir: "images/projects/home-market/chars/anim/", w: 2179, h: 709, layers: [
        ["backpack", 9, 126, 172, 185, "fly"],
        ["cloud", 854, 261, 76, 50, "drift"],
        ["balloon", 574, 20, 317, 369, "hover"],
        ["runner", 104, 115, 478, 594, "glide"],
        ["pencil", 557, 454, 143, 114, "spin"],
        ["pencils", 814, 530, 116, 179, "wiggle"],
        ["boy", 956, 11, 764, 698, "breathe"],
        ["compass", 1539, 499, 170, 187, "swing"],
        ["boat", 1713, 102, 446, 607, "rock"]
      ] } }
  ] },
  "bukh": { rows: [[0, 1, 2, 3]], shots: [
    { src: "images/projects/home-market/bukh/01", alt: "Школьный базар для Бухары: стойки", size: "0,8 × 1,8 м", r: 0.444 },
    { src: "images/projects/home-market/bukh/02", alt: "Школьный базар для Бухары: стойки", size: "0,8 × 1,8 м", r: 0.444 },
    { src: "images/projects/home-market/bukh/03", alt: "Школьный базар для Бухары: стойка, мокап", ext: "png", r: 0.714 },
    { src: "images/projects/home-market/bukh/04", alt: "Школьный базар для Бухары: стойка, мокап", ext: "png", r: 0.714 }
  ] },
  // Витрины с мокапами (2026-11-10, как в Школьном базаре): лайтбоксы — смена с мокапом над эскалатором,
  // билборды и растяжки — стопка с крупным мокапом. Мокапы nymock собраны мной в его фото
  "n2018": { show: [0, 1, 2], rows: [[3, 4, 5]], shots: [
    { src: "images/projects/home-market/n2018/03", alt: "Новый год, 2018", size: "1,18 × 0,83 м", r: 1.429, mock: "images/projects/home-market/nymock/18_e1" },
    { src: "images/projects/home-market/n2018/04", alt: "Новый год, 2018", size: "1,18 × 0,83 м", r: 1.429, mock: "images/projects/home-market/nymock/18_e1" },
    { src: "images/projects/home-market/n2018/05", alt: "Новый год, 2018", size: "1,18 × 0,83 м", r: 1.429, mock: "images/projects/home-market/nymock/18_e2" },
    { src: "images/projects/home-market/n2018/01", alt: "Новый год, 2018", size: "6 × 3 м", ext: "png", r: 1.304 },
    { src: "images/projects/home-market/n2018/02", alt: "Новый год, 2018", size: "6 × 3 м", r: 1.402 },
    { src: "images/projects/home-market/n2018/06", alt: "Новый год, 2018", size: "6 × 3 м", r: 1.402 }
  ] },
  // Витрины с мокапами (2026-11-10, как в Школьном базаре): лайтбоксы — смена с мокапом над эскалатором,
  // билборды и растяжки — стопка с крупным мокапом. Мокапы nymock собраны мной в его фото
  "n2020": { show: [2, 3], shows: [{ items: [4, 5], mockR: 1600 / 1289, stack: true }], rows: [[0, 1]], shots: [
    { src: "images/projects/home-market/n2020/01", alt: "Новый год, 2020", size: "6 × 3 м", r: 1.506 },
    { src: "images/projects/home-market/n2020/02", alt: "Новый год, 2020", size: "6 × 3 м", r: 1.504 },
    { src: "images/projects/home-market/n2020/05", alt: "Новый год, 2020", size: "1,18 × 0,83 м", r: 1.429, mock: "images/projects/home-market/nymock/20_e1" },
    { src: "images/projects/home-market/n2020/06", alt: "Новый год, 2020", size: "1,18 × 0,83 м", r: 1.429, mock: "images/projects/home-market/nymock/20_e1" },
    { src: "images/projects/home-market/n2020/03", alt: "Новый год, 2020", size: "10 × 2 м", r: 5.099, mock: "images/projects/home-market/nymock/20_br" },
    { src: "images/projects/home-market/n2020/04", alt: "Новый год, 2020", size: "10 × 2 м", r: 5.099, mock: "images/projects/home-market/nymock/20_br" }
  ] },
  "n2021": { rows: [[0, 1, 2]], shots: [
    { src: "images/projects/home-market/n2021/01", alt: "Новый год, 2021", size: "6 × 3 м", r: 1.25 },
    { src: "images/projects/home-market/n2021/02", alt: "Новый год, 2021", size: "6 × 3 м", r: 1.25 },
    { src: "images/projects/home-market/n2021/03", alt: "Новый год, 2021", size: "6 × 3 м", r: 1.25 }
  ] },
  // Витрины с мокапами (2026-11-10, как в Школьном базаре): лайтбоксы — смена с мокапом над эскалатором,
  // билборды и растяжки — стопка с крупным мокапом. Мокапы nymock собраны мной в его фото
  "n2022": { show: [0, 1, 2], shows: [{ items: [3, 4, 5], mockR: 1600 / 1289, stack: true }, { items: [6, 7], mockR: 1600 / 1289, stack: true }], rows: [], shots: [
    { src: "images/projects/home-market/n2021/04", alt: "Новый год, 2022", size: "1,18 × 0,83 м", r: 1.429, mock: "images/projects/home-market/nymock/22_e1" },
    { src: "images/projects/home-market/n2021/05", alt: "Новый год, 2022", size: "1,18 × 0,83 м", r: 1.429, mock: "images/projects/home-market/nymock/22_e1" },
    { src: "images/projects/home-market/n2021/06", alt: "Новый год, 2022", size: "1,18 × 0,83 м", r: 1.429, mock: "images/projects/home-market/nymock/22_e2" },
    { src: "images/projects/home-market/n2022/01", alt: "Новый год, 2022: билборд", size: "6 × 3 м", r: 1.779, mock: "images/projects/home-market/nymock/22_b1" },
    { src: "images/projects/home-market/n2022/02", alt: "Новый год, 2022: билборд", size: "6 × 3 м", r: 1.779, mock: "images/projects/home-market/nymock/22_b2" },
    { src: "images/projects/home-market/n2022/03", alt: "Новый год, 2022: билборд", size: "6 × 3 м", r: 1.779, mock: "images/projects/home-market/nymock/22_b3" },
    { src: "images/projects/home-market/n2022/04", alt: "Новый год, 2022: растяжка, красная", size: "10 × 2 м", r: 5.108, mock: "images/projects/home-market/nymock/22_br" },
    { src: "images/projects/home-market/n2022/05", alt: "Новый год, 2022: растяжка, синяя", size: "10 × 2 м", r: 5.117, mock: "images/projects/home-market/nymock/22_br" }
  ] },
  // Сверху билборды «Дом чудес» парами, ниже межэтажки
  // Витрины с мокапами (2026-11-10, как в Школьном базаре): лайтбоксы — смена с мокапом над эскалатором,
  // билборды и растяжки — стопка с крупным мокапом. Мокапы nymock собраны мной в его фото
  "n2023": { show: [0, 1, 2, 3], shows: [{ items: [4, 5, 6, 7], mockR: 1600 / 1289, stack: true }, { items: [8, 9], mockR: 1600 / 893, stack: true }], rows: [], shots: [
    { src: "images/projects/home-market/n2023/01", alt: "Новый год, 2023", size: "1,18 × 0,83 м", r: 1.416, mock: "images/projects/home-market/nymock/23_e1" },
    { src: "images/projects/home-market/n2023/02", alt: "Новый год, 2023", size: "1,18 × 0,83 м", r: 1.416, mock: "images/projects/home-market/nymock/23_e1" },
    { src: "images/projects/home-market/n2023/03", alt: "Новый год, 2023", size: "1,18 × 0,83 м", r: 1.416, mock: "images/projects/home-market/nymock/23_e2" },
    { src: "images/projects/home-market/n2023/04", alt: "Новый год, 2023", size: "1,18 × 0,83 м", r: 1.416, mock: "images/projects/home-market/nymock/23_e3" },
    { src: "images/projects/home-market/n2023/05", alt: "Билборд «Дом чудес», Новый год 2023", size: "6 × 3 м", r: 2, mock: "images/projects/home-market/nymock/23_b1" },
    { src: "images/projects/home-market/n2023/06", alt: "Билборд «Дом чудес», Новый год 2023", size: "6 × 3 м", r: 2, mock: "images/projects/home-market/nymock/23_b2" },
    { src: "images/projects/home-market/n2023/07", alt: "Билборд «Дом чудес», Новый год 2023", size: "6 × 3 м", r: 2, mock: "images/projects/home-market/nymock/23_b3" },
    { src: "images/projects/home-market/n2023/08", alt: "Билборд «Дом чудес», Новый год 2023", size: "6 × 3 м", r: 2, mock: "images/projects/home-market/nymock/23_b4" },
    { src: "images/projects/home-market/n2023/09", alt: "Растяжка, Новый год 2023", size: "10 × 2 м", r: 5.362, mock: "images/projects/home-market/nymock/23_w1" },
    { src: "images/projects/home-market/n2023/10", alt: "Растяжка с QR-кодом, Новый год 2023", size: "10 × 2 м", r: 5.36, mock: "images/projects/home-market/nymock/23_w2" }
  ] },
  // Сверху три лайтбокса «-1 qavat», под ними два билборда и длинный билборд (веб-баннеры — в webNy24)
  // Витрины с мокапами (2026-11-10, как в Школьном базаре): лайтбоксы — смена с мокапом над эскалатором,
  // билборды и растяжки — стопка с крупным мокапом. Мокапы nymock собраны мной в его фото
  "n2024": { show: [2, 3, 4], shows: [{ items: [0, 1], mockR: 1600 / 1289, stack: true }, { items: [5], mockR: 1600 / 893, stack: true }], rows: [], shots: [
    { src: "images/projects/home-market/n2024/05", alt: "Новый год, 2024", size: "6 × 3 м", r: 2, mock: "images/projects/home-market/nymock/24_b1" },
    { src: "images/projects/home-market/n2024/06", alt: "Новый год, 2024", size: "6 × 3 м", r: 2, mock: "images/projects/home-market/nymock/24_b2" },
    { src: "images/projects/home-market/n2024/02", alt: "Новый год, 2024", size: "1,18 × 0,83 м", r: 1.416, mock: "images/projects/home-market/nymock/24_e1" },
    { src: "images/projects/home-market/n2024/03", alt: "Новый год, 2024", size: "1,18 × 0,83 м", r: 1.416, mock: "images/projects/home-market/nymock/24_e1" },
    { src: "images/projects/home-market/n2024/09", alt: "Новый год, 2024: лайтбокс", size: "1,18 × 0,83 м", r: 1.413, mock: "images/projects/home-market/nymock/24_e2" },
    { src: "images/projects/home-market/n2024/10", alt: "Новый год, 2024: длинный билборд", size: "10 × 2 м", r: 5.37, mock: "images/projects/home-market/nymock/24_w1" }
  ] },
  // Персонажи Нового года 2024: одна картинка без фона
  "nchars": { rows: [[0]], shots: [
    // anim: слои в n2024/anim, координаты в пикселях исходника 2179×709; glows — пульсирующие огоньки [x, y, диаметр, вид]; snow — сколько снежинок падает
    { src: "images/projects/home-market/n2024/chars", alt: "Персонажи Нового года 2024: мальчик и девочка у ёлки", ext: "png", r: 3.073,
      anim: { dir: "images/projects/home-market/n2024/anim/", w: 2179, h: 709, snow: 46, layers: [
        ["scene", 14, 0, 935, 709, "still"],
        ["flake-big", 17, 330, 188, 193, "twirl"],
        ["flake1", 14, 13, 67, 73, "twirl-fast"],
        ["boy", 949, 0, 499, 709, "breathe-side"],
        ["flake5", 1298, 489, 148, 163, "twirl-back"],
        ["flake3", 1536, 34, 83, 81, "twirl-fast"],
        ["ball1", 1538, 402, 31, 31, "bob"],
        ["girl", 1646, 26, 369, 607, "hover-soft"],
        ["flake2", 2049, 27, 98, 108, "twirl-back"],
        ["flake4", 1937, 470, 135, 127, "twirl"],
        ["ball2", 2088, 630, 43, 44, "bob"]
      ], glows: [
        [734, 100, 300, "star"],
        [249, 105, 210, "horn"], [524, 105, 210, "horn"], [1728, 120, 200, "horn"], [1946, 120, 200, "horn"],
        [749, 345, 46, "light"], [844, 410, 46, "light"], [774, 440, 46, "light"], [654, 485, 46, "light"], [584, 500, 46, "light"],
        [829, 555, 46, "light"], [904, 565, 46, "light"], [669, 635, 46, "light"], [929, 590, 46, "light"], [949, 660, 46, "light"]
      ] } }
  ] },
  // Внизу два указателя над атриумом (без фона, впечатанная шахматка фотошопа убрана)
  // Витрины с мокапами (2026-11-10, как в Школьном базаре): лайтбоксы — смена с мокапом над эскалатором,
  // билборды и растяжки — стопка с крупным мокапом. Мокапы nymock собраны мной в его фото
  // Лайтбоксы 2×1,2 — витрина со сменой (его мокап 002 и три моих), указатели 1×1 — стопка (его 001 синий, мой красный)
  "n2025": { show: [0, 1, 2, 3], shows: [{ items: [4, 5, 6, 7], mockR: 1600 / 1289 }, { items: [8, 9], mockR: 1600 / 1289, stack: true }], rows: [], shots: [
    { src: "images/projects/home-market/n2025/05", alt: "Новый год, 2025", size: "1,18 × 0,83 м", r: 1.408, mock: "images/projects/home-market/nymock/25_e1" },
    { src: "images/projects/home-market/n2025/06", alt: "Новый год, 2025", size: "1,18 × 0,83 м", r: 1.417, mock: "images/projects/home-market/nymock/25_e1" },
    { src: "images/projects/home-market/n2025/07", alt: "Новый год, 2025", size: "1,18 × 0,83 м", r: 1.416, mock: "images/projects/home-market/nymock/25_e2" },
    { src: "images/projects/home-market/n2025/08", alt: "Новый год, 2025", size: "1,18 × 0,83 м", r: 1.418, mock: "images/projects/home-market/nymock/25_e3" },
    { src: "images/projects/home-market/n2025/01", alt: "Новый год, 2025", size: "2 × 1,2 м", r: 1.667, mock: "images/projects/home-market/nymock/25_l1" },
    { src: "images/projects/home-market/n2025/02", alt: "Новый год, 2025", size: "2 × 1,2 м", r: 1.667, mock: "images/projects/home-market/nymock/25_l2" },
    { src: "images/projects/home-market/n2025/03", alt: "Новый год, 2025", size: "2 × 1,2 м", r: 1.667, mock: "images/projects/home-market/nymock/25_l3" },
    { src: "images/projects/home-market/n2025/04", alt: "Новый год, 2025", size: "2 × 1,2 м", r: 1.667, mock: "images/projects/home-market/nymock/25_l4" },
    { src: "images/projects/home-market/n2025/09", alt: "Указатель над атриумом, Новый год 2025", size: "1 × 1 м", ext: "png", r: 1, mock: "images/projects/home-market/nymock/25_p1" },
    { src: "images/projects/home-market/n2025/10", alt: "Указатель над атриумом, Новый год 2025", size: "1 × 1 м", ext: "png", r: 1, mock: "images/projects/home-market/nymock/25_p2" }
  ] },
  "stick": { cols: 5, ratio: "1", fit: "clear", shots: [
    { src: "images/projects/home-market/stick/01", alt: "Новогодний стикер с Дедом Морозом", ext: "png" },
    { src: "images/projects/home-market/stick/02", alt: "Новогодний стикер с Дедом Морозом", ext: "png" },
    { src: "images/projects/home-market/stick/03", alt: "Новогодний стикер с Дедом Морозом", ext: "png" },
    { src: "images/projects/home-market/stick/04", alt: "Новогодний стикер с Дедом Морозом", ext: "png" },
    { src: "images/projects/home-market/stick/05", alt: "Новогодний стикер с Дедом Морозом", ext: "png" },
    { src: "images/projects/home-market/stick/06", alt: "Новогодний стикер с Дедом Морозом", ext: "png" },
    { src: "images/projects/home-market/stick/07", alt: "Новогодний стикер с Дедом Морозом", ext: "png" },
    { src: "images/projects/home-market/stick/08", alt: "Новогодний стикер с Дедом Морозом", ext: "png" },
    { src: "images/projects/home-market/stick/09", alt: "Новогодний стикер с Дедом Морозом", ext: "png" },
    { src: "images/projects/home-market/stick/10", alt: "Новогодний стикер с Дедом Морозом", ext: "png" }
  ] },
  // Десятилетие сети (2024). Материалы — его скриншоты и PNG от 2026-11-05, исходники в «06 Акции и 10 лет\ten»
  // Знак: узбекская версия, логотип с десяткой, плакаты с паттерном
  "ten": { rows: [[0, 1, 2]], shots: [
    { src: "images/projects/home-market/ten/01", alt: "Знак к 10-летию: Bizga o‘n yil", r: 0.705 },
    { src: "images/projects/home-market/ten/02", alt: "Логотип Home Market с десяткой", r: 1.417 },
    { src: "images/projects/home-market/ten/03", alt: "Плакаты «Нам десять лет» с паттерном", r: 1.416 }
  ] },
  // Наружка (2026-11-10, его шаблон «стопка»): билборд 6×3 на нашем мокапе билборда (tenmock/b1, собран мной),
  // авто на его мокапе (tenmock/a1). Прежний мокап ten/05 с Mayeri снят — там другая картинка
  "tenout": { shows: [{ items: [0], mockR: 1600 / 1289, stack: true }, { items: [1], mockR: 1600 / 1289, stack: true }], rows: [], shots: [
    { src: "images/projects/home-market/ten/04", alt: "Билборд «Bizga 10 yil»", size: "6 × 3 м", r: 2, mock: "images/projects/home-market/tenmock/b1" },
    { src: "images/projects/home-market/ten/06", alt: "Оформление авто к 10-летию", size: "Оформление авто, ≈ 5 × 1,8 м", r: 2.778, mock: "images/projects/home-market/tenmock/a1" }
  ] },
  // В торговом центре (2026-11-10): два лайтбокса стопкой рядом с мокапом двух лайтбоксов над эскалатором (tenmock/e1, собран мной),
  // траволатор рядом с его мокапом (tenmock/v1). Обе витрины в одном ряду одной высоты (showsRow), иначе траволатор в ~1400 px ростом
  "tenmall": { showsRow: true, shows: [{ items: [0, 1], mockR: 1200 / 1789, stack: true }, { items: [2], mockR: 1200 / 2150, stack: true }], rows: [], shots: [
    { src: "images/projects/home-market/ten/07", alt: "Лайтбокс над эскалатором «Нам 10 лет»", size: "1,18 × 0,83 м", r: 1.42, mock: "images/projects/home-market/tenmock/e1" },
    { src: "images/projects/home-market/ten/08", alt: "Лайтбокс-тизер с большой золотой десяткой", size: "1,18 × 0,83 м", r: 1.417, mock: "images/projects/home-market/tenmock/e1" },
    { src: "images/projects/home-market/ten/09", alt: "Оформление траволатора к 10-летию", size: "1,4 × 7,56 м", r: 0.183, mock: "images/projects/home-market/tenmock/v1" }
  ] },
  // Носители: футболки, веб-баннер на планшете, вобблер с кешбэком
  "tenmerch": { rows: [[0, 1], [2, 3]], shots: [
    { src: "images/projects/home-market/ten/10", alt: "Футболки и значок «Нам десять лет»", r: 1.415 },
    { src: "images/projects/home-market/ten/13", alt: "Веб-баннеры с десяткой на сайте и в рекламе", r: 1.416 },
    { src: "images/projects/home-market/ten/11", alt: "Вобблер «Bizga 10 yil cashback» на полке", r: 1.239 },
    { src: "images/projects/home-market/ten/12", alt: "Вобблер «Bizga 10 yil cashback»", ext: "png", r: 1 }
  ] },
  // Фестиваль скидок: два паучка рядом, справа его мокап 001 (2026-11-10), на нём паучок меняется (fest/m1, m2, собраны мной).
  // Размер паучков взят по стандарту 0,8 × 1,8 м — пропорция 0,443 совпадает с паучками Бухары
  "fest": { shows: [{ items: [0, 1], mockR: 1600 / 1289, stack: true, row: true }], rows: [], shots: [
    { src: "images/projects/home-market/fest/01", alt: "Фестиваль скидок: паучок, «всё для дома»", size: "0,8 × 1,8 м", r: 0.442, mock: "images/projects/home-market/fest/m1" },
    { src: "images/projects/home-market/fest/02", alt: "Фестиваль скидок: паучок", size: "0,8 × 1,8 м", r: 0.443, mock: "images/projects/home-market/fest/m2" }
  ] },  "qal": { cols: 4, ratio: "3 / 5", fit: "cover", shots: [
    { src: "images/projects/home-market/qal/01", alt: "Лайтбоксы-история с мальчиком и девочкой", size: "1,17 × 1,98 м" },
    { src: "images/projects/home-market/qal/02", alt: "Лайтбоксы-история с мальчиком и девочкой", size: "1,17 × 1,98 м" },
    { src: "images/projects/home-market/qal/03", alt: "Лайтбоксы-история с мальчиком и девочкой", size: "1,17 × 1,98 м" },
    { src: "images/projects/home-market/qal/04", alt: "Лайтбоксы-история с мальчиком и девочкой", size: "1,17 × 1,98 м" }
  ] },
  // Стенд (2026-11-11, его выбор): «пролёт камеры» — кадры сменяют друг друга с медленным наездом (pjBuildFly),
  // порядок: снаружи → сверху → внутрь по зонам; подпись — название зоны
  "stand": { shots: [
    { src: "images/projects/home-market/stand/01", alt: "Общий вид стенда" },
    { src: "images/projects/home-market/stand/12", alt: "Стенд сверху" },
    { src: "images/projects/home-market/stand/04", alt: "Стенд сверху без крыши" },
    { src: "images/projects/home-market/stand/02", alt: "Бэкграунд-билборд 9 × 2 м" },
    { src: "images/projects/home-market/stand/06", alt: "Ресепшн и гостиная" },
    { src: "images/projects/home-market/stand/05", alt: "Ресепшн, зелёный вариант" },
    { src: "images/projects/home-market/stand/09", alt: "Ресепшн, синий вариант" },
    { src: "images/projects/home-market/stand/07", alt: "Гостиная" },
    { src: "images/projects/home-market/stand/08", alt: "Спальня и гостиная" },
    { src: "images/projects/home-market/stand/10", alt: "Переговорная зона" },
    { src: "images/projects/home-market/stand/03", alt: "Столовая и стеллажи" },
    { src: "images/projects/home-market/stand/11", alt: "Столовая" }
  ] },
  // Бэкграунд-билборд 9 × 2 м (его файл Screenshot_522), показан целиком без обрезки
  "standp": { cols: 1, ratio: "2335 / 490", fit: "cover", shots: [
    { src: "images/projects/home-market/standp/01", alt: "Бэкграунд-билборд 9 × 2 м", size: "9 × 2 м" }
  ] },
  // Флаеры 98 × 210 мм и справа мокап в руке; один ряд одной высоты
  "flyer": { rows: [[0, 1, 2]], shots: [
    { src: "images/projects/home-market/flyer/01", alt: "Флаер стенда, лицевая сторона", size: "98 × 210 мм", r: 0.467 },
    { src: "images/projects/home-market/flyer/02", alt: "Флаер стенда, оборот", size: "98 × 210 мм", r: 0.467 },
    { src: "images/projects/home-market/flyer/03", alt: "Мокап флаеров в руке на выставке", r: 1.245 }
  ] },
  // 2026-11-07: все мокапы из G:\2020 Год\Попутка\Журналы (кроме бесплатных шаблонов), черновой набор — он отберёт лишнее
  // 2026-11-07, его разбор: шесть разворотов Arhikultura отдельными плитками (смену страниц он отверг),
  // газеты, TOP business и плоские «Новогодний сюрприз» сняты
  "press": { rows: [[0, 1, 2, 3], [4, 5, 6, 7]], shots: [
    { src: "images/projects/home-market/press/01", alt: "Реклама в журнале Arhikultura, февраль 2019", r: 1.333 },
    { src: "images/projects/home-market/press/02", alt: "Реклама в журнале Arhikultura, февраль 2019", r: 1.333 },
    { src: "images/projects/home-market/press/03", alt: "Реклама в журнале Arhikultura, февраль 2019", r: 1.333 },
    { src: "images/projects/home-market/press/04", alt: "Реклама в журнале Arhikultura, февраль 2019", r: 1.333 },
    { src: "images/projects/home-market/press/05", alt: "Реклама в журнале Arhikultura, январь 2019", r: 1.333 },
    { src: "images/projects/home-market/press/06", alt: "Реклама в журнале Arhikultura, январь 2019", r: 1.333 },
    { src: "images/projects/home-market/press/07", alt: "Реклама в журнале Developer", r: 1.284 },
    { src: "images/projects/home-market/press/15", alt: "Реклама в журнале TheMag", r: 1.333 }
  ] },
  // 2026-11-07: его новые файлы из корня, черновой набор — он отберёт лишнее
  // 2026-11-07, его разбор: три карты парят в 3D (float) над мокапами тех же карт в руках, сертификат в руках по центру
  // между конвертами, баннер «Hadya eting» во всю ширину. Развёртка коробки (бывшая gift/11) снята: та же коробка уже в item/02
  // 2026-11-23 (его просьба): парящие карты в просмотре на 50 % меньше (zoomPc 0.5)
  "gift": { float: [0, 1, 2], rows: [[5, 3, 4], [6, 8, 7], [9]], shots: [
    { src: "images/projects/home-market/gift/01", alt: "Подарочная карта, зелёная", ext: "png", r: 1.579, zoomPc: 0.5 },
    { src: "images/projects/home-market/gift/02", alt: "Подарочная карта с красным бантом", ext: "png", r: 1.579, zoomPc: 0.5 },
    { src: "images/projects/home-market/gift/03", alt: "Подарочная карта, синяя", ext: "png", r: 1.545, zoomPc: 0.5 },
    { src: "images/projects/home-market/gift/04", alt: "Мокап подарочной карты в руках", r: 1.317 },
    { src: "images/projects/home-market/gift/05", alt: "Мокап подарочной карты в руках", r: 1.319 },
    { src: "images/projects/home-market/gift/06", alt: "Мокап подарочной карты в руках", r: 1.304 },
    { src: "images/projects/home-market/gift/07", alt: "Конверт подарочного сертификата, оборот", r: 0.705 },
    { src: "images/projects/home-market/gift/08", alt: "Конверт подарочного сертификата", r: 0.705 },
    { src: "images/projects/home-market/gift/09", alt: "Мокап конверта с сертификатом", r: 0.848 },
    { src: "images/projects/home-market/gift/10", alt: "Баннер «Hadya eting» с подарочной картой", r: 2.616 }
  ] },
  // 2026-11-07: только новогодняя коробка — развёртка (PNG без фона, без белых полей) и его мокап
  "item": { rows: [[0, 1]], shots: [
    { src: "images/projects/home-market/item/01", alt: "Новогодняя подарочная коробка, развёртка", ext: "png", r: 1.4 },
    { src: "images/projects/home-market/item/02", alt: "Новогодняя подарочная коробка, мокап", r: 1.243 }
  ] },
};

// Переключатели годов: текст и группа картинок на каждый год
window.PROJECT_YEARS = window.PROJECT_YEARS || {};
window.PROJECT_YEARS["home-market"] = {
  school: [
    { open: true, year: "2025", group: "y2025", text: "Героев становится больше, и они отправляются в приключения: воздушный шар, лодка из пенала, скейт из карандаша." },
    { year: "2024", group: "y2024", text: "Появляются мальчик и девочка. С этого года кампанию ведут персонажи." },
    { year: "2022", group: "y2022", text: "Яркий карандаш обнимает логотип, а название набрано живыми школьными буквами." },
    { year: "2021", group: "y2021", text: "Школьная доска и надписи мелом. Для каждой конструкции и улицы свой размер." },
    { year: "2020", group: "y2020", text: "Прямолинейная кампания: рюкзак, школьные мелочи и крупная фраза на русском и узбекском." }
  ],
  newyear: [
    { year: "2025", group: "n2025", text: "Уют дома: семья за столом, камин и товары на маленьких сценах." },
    { open: true, year: "2024", group: "n2024", text: "Новогодняя сказка: мальчик и девочка наряжают ёлку. Слоган: «Sehr har bir uyda»." },
    { year: "2023", group: "n2023", text: "Геометрический орнамент из новогодних символов на этажах." },
    { year: "2022", group: "n2022", text: "Дед Мороз, снеговик и Снегурочка, собранные из товаров магазина: лайтбоксы и билборды в трёх цветах." },
    { year: "2021", group: "n2021", text: "Мебель и посуда собираются в большой новогодний шар на красном, синем и зелёном фоне." },
    { year: "2020", group: "n2020", text: "Ёлочный шар, внутри которого целый дом с мебелью и подарками." },
    { year: "2018", group: "n2018", text: "Весёлый Дед Мороз и надпись «Новогодний сюрприз». Из него же выросли стикеры для мессенджеров." }
  ]
};

// Экраны города: размеры из имён файлов. slot — место в раскладке
window.PROJECT_SCREENS = window.PROJECT_SCREENS || {};
window.PROJECT_SCREENS["home-market"] = [
  { slot: "wide", name: "Shota Rustaveli, Bobur Park", w: 4080, h: 720, src: "images/projects/home-market/video/led-03.mp4" },
  { slot: "mid", name: "Yangi Sergeli, мост", w: 1440, h: 600, src: "images/projects/home-market/video/led-06.mp4" },
  { slot: "small", name: "Sh. Rashidova", w: 720, h: 360, src: "images/projects/home-market/video/led-07.mp4" },
  { slot: "tall", name: "C-5, Gentelman Pub", w: 360, h: 600, src: "images/projects/home-market/video/led-11.mp4" }
];
// Плашки Telegram: файл = кампания-язык-номер части
window.PROJECT_STRIPS = window.PROJECT_STRIPS || {};
window.PROJECT_STRIPS["home-market"] = {
  path: "images/projects/home-market/video/tg",
  parts: 8,
  campaigns: [
    { id: "sb", name: "Школьный базар", img: "images/projects/home-market/y2024/03-thumb.webp", langs: [
      { id: "ru", name: "Русский", text: "уже открыт! Рюкзаки, тетради и канцелярия для всего класса.", photo: "Собрали всё к первому звонку" },
      { id: "uz", name: "Узбекский", text: "boshlandi! Ryukzak, daftar va kanselyariya butun sinf uchun.", photo: "Birinchi qo'ng'iroqqa hammasi tayyor" },
      { id: "en", name: "Английский", text: "is open! Backpacks, notebooks and stationery for the whole class.", photo: "Everything for the first bell" }
    ] },
    { id: "ny", name: "Новый год", img: "images/projects/home-market/n2024/05-thumb.webp", langs: [
      { id: "ru", name: "Русский", text: "уже в магазине! Ёлки, игрушки и подарки для всей семьи.", photo: "Чудеса начинаются дома" },
      { id: "uz", name: "Узбекский", text: "do'konda! Archa, o'yinchoq va sovg'alar butun oila uchun.", photo: "Sehr har bir uyda" }
    ] },
    { id: "fs", name: "Фестиваль скидок", img: "images/projects/home-market/sale/05-thumb.webp", langs: [
      { id: "ru", name: "Русский", text: "начался! Мебель, посуда и декор по лучшим ценам.", photo: "Ловите выгоду" },
      { id: "uz", name: "Узбекский", text: "boshlandi! Mebel, idish va dekor eng yaxshi narxlarda.", photo: "Foydali xaridlar" }
    ] }
  ]
};
// Матрицы веб-баннеров: файл = модель-размер-язык.webp
window.PROJECT_MATRIX = window.PROJECT_MATRIX || {};
window.PROJECT_MATRIX["home-market"] = {
  // Матрица web24 (ШБ и НГ 2024) снята 2026-11-08: баннеры растягивались и мылились,
  // теперь они в «Баннерах для сайтов» в родном размере (группы webSb24, webNy24)
  web21: {
    label: "Баннер для сайта",
    path: "images/projects/home-market/web",
    models: [{ id: "ny21", name: "Новый год, 2021" }],
    langs: [{ id: "ru", name: "Русский" }],
    // 2026-11-08: его выгрузки в родном размере. Ряды собраны так, чтобы на странице баннеры почти
    // не увеличивались (самый мелкий 300×60 — примерно в 1,3 раза), а в просмотре — не больше родного размера
    max: 1,
    rows: [["970x250"], ["728x90", "300x60"], ["640x200", "640x100"], ["300x600", "240x400", "300x500", "640x960"], ["960x640", "336x280", "300x250"]]
  }
};
