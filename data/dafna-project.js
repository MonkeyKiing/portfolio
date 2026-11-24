/* Кейс DAFNA (Сторонние проекты): группы картинок, матрицы баннеров и анимированные баннеры.
   Как добавить картинку: положить файл NN.webp и превью NN-thumb.webp в images/projects/dafna/<группа>/
   и дописать строку в нужную группу. cols — колонок, ratio — пропорции плитки,
   fit: cover — кадрировать, contain — показать целиком. rows — ряды одной высоты, r — пропорции кадра.
   Материалы для проверки лежат в F:\Claude CODE\PORTFOLIO\DAFNA\Project DAFNA. */
window.PROJECT_GROUPS = window.PROJECT_GROUPS || {};
window.PROJECT_GROUPS["dafna"] = {
  // Один блок на двух экранах: компьютер и телефон в ряд одной высоты
  "reliable": { rows: [[0, 1]], shots: [
    { src: "images/projects/dafna/reliable/02", r: 1691 / 1084, size: "Компьютер", alt: "Блок «Надёжные решения» на сайте: горизонтальные карточки в две колонки" },
    { src: "images/projects/dafna/reliable/03-phone", r: 589 / 812, size: "Телефон", alt: "Блок «Надёжные решения» в телефоне: вертикальные карточки" }
  ] },
  "reliablecards": { cols: 4, ratio: "680/882", fit: "cover", shots: [
    { src: "images/projects/dafna/reliablecards/01", alt: "Карточка «Для руководителей»" },
    { src: "images/projects/dafna/reliablecards/02", alt: "Карточка «Для персонала»" },
    { src: "images/projects/dafna/reliablecards/03", alt: "Карточка «Для переговорных»" },
    { src: "images/projects/dafna/reliablecards/04", alt: "Карточка «Мягкая мебель»" },
    { src: "images/projects/dafna/reliablecards/05", alt: "Первая серия: «Для HoReCa»" },
    { src: "images/projects/dafna/reliablecards/06", alt: "Первая серия: «Для дач и садов»" },
    { src: "images/projects/dafna/reliablecards/07", alt: "Первая серия: «Для учебных заведений»" },
    { src: "images/projects/dafna/reliablecards/08", alt: "Первая серия: «Со стандартом BIFMA»" }
  ] },
  "cats": { cols: 5, ratio: "1059/1532", fit: "cover", shots: [
    { src: "images/projects/dafna/cats/01", alt: "Обложка раздела «Для детей»" },
    { src: "images/projects/dafna/cats/02", alt: "Обложка раздела «Повышенная гарантия»" },
    { src: "images/projects/dafna/cats/03", alt: "Обложка раздела «Мировой стандарт BIFMA»" },
    { src: "images/projects/dafna/cats/04", alt: "Обложка раздела «Выгодные предложения»" },
    { src: "images/projects/dafna/cats/05", alt: "Обложка раздела «Гарантия 5 лет»" }
  ] },
  // 2026-11-15: в просмотре окна связи и мокап Uzum на 40% меньше (zoomPc 0.6), комбо вдвое меньше (0.5) — по его просьбе
  "modal": { cols: 4, ratio: "360/780", fit: "cover", shots: [
    { src: "images/projects/dafna/modal/01", alt: "Окно «Ответим быстро в Telegram» с уточкой в кресле", zoomPc: 0.6 },
    { src: "images/projects/dafna/modal/02", alt: "Окно связи, вариант с шоурумом", zoomPc: 0.6 },
    { src: "images/projects/dafna/modal/03", alt: "Окно связи, вариант с креслами по краям", zoomPc: 0.6 },
    { src: "images/projects/dafna/modal/04", alt: "Окно связи, вариант с линейным узором", zoomPc: 0.6 }
  ] },
  "uzum": { cols: 1, ratio: "4960/800", fit: "cover", shots: [
    { src: "images/projects/dafna/uzum/01", alt: "Баннер магазина DAFNA на Uzum Market: 8000+ успешных заказов" }
  ] },
  // Скриншот магазина обрезан после первого ряда товаров и стоит на всю ширину, как баннер над ним
  "uzummock": { cols: 1, ratio: "1454/915", fit: "cover", shots: [
    { src: "images/projects/dafna/uzummock/01", alt: "Баннер в шапке магазина на Uzum Market", zoomPc: 0.6 }
  ] },
  // Розыгрыш LORETTO (2026-11-11, его просьба): воблер на столе, пост в Telegram и сторис в Instagram — ряд одной высоты.
  // full — картинка для просмотра: пост и сторис открываются в интерфейсе приложения (собраны мной, текст поста — рыба)
  "loretto": { lead: 0, rows: [[0, 1, 2]], shots: [
    { src: "images/projects/dafna/loretto/01", alt: "Воблер розыгрыша очистителя воздуха LORETTO на столе в шоуруме", size: "Воблер", r: 1536 / 1024 },
    { src: "images/projects/dafna/loretto/02", full: "images/projects/dafna/loretto/02-tg.webp", alt: "Пост о розыгрыше в Telegram-канале DAFNA", size: "Пост в Telegram", r: 680 / 700 },
    { src: "images/projects/dafna/loretto/03", full: "images/projects/dafna/loretto/03-ig.webp", alt: "Сторис о розыгрыше в Instagram", size: "Сторис в Instagram", r: 1012 / 1800 }
  ] },
  "combo": { cols: 5, ratio: "1080/1350", fit: "cover", shots: [
    { src: "images/projects/dafna/combo/01", alt: "Комбо: стол TINARIO и беговая дорожка AIRHOT", zoomPc: 0.5 },
    { src: "images/projects/dafna/combo/02", alt: "Комбо: стол OBOL и велотренажёр NOVA", zoomPc: 0.5 },
    { src: "images/projects/dafna/combo/03", alt: "Комбо: стол SHADOW и кресло OUTRIDER", zoomPc: 0.5 },
    { src: "images/projects/dafna/combo/04", alt: "Комбо: стол SHADOW и кресло TWYLIGHT", zoomPc: 0.5 },
    { src: "images/projects/dafna/combo/05", alt: "Комбо: стол THEAT и перфопанель", zoomPc: 0.5 }
  ] },
  // Постеры А2 (2026-11-11, его просьба): два постера стопкой и рядом его мокап шоурума (001), постеры вставлены мной.
  // Клик по постеру ставит его на мокап, повторный — просмотр. Сертификат перенесён в группу voucher
  "posters": { shows: [{ items: [0, 1], mockR: 1200 / 1490, stack: true, row: true }], rows: [], shots: [
    { src: "images/projects/dafna/posters/01", alt: "Постер А2 «Super kombo» на узбекском", size: "А2", r: 1273 / 1800, mock: "images/projects/dafna/postermock/01" },
    { src: "images/projects/dafna/posters/02", alt: "Постер А2 «Yangi kombolar: stol + kreslo»", size: "А2", r: 1273 / 1800, mock: "images/projects/dafna/postermock/02" }
  ] },
  // Сертификат, ваучер и коробка-подарок — все три в мокапах (мокап сертификата его, 2026-11-11), ряд одной высоты; на телефоне ваучер сверху (lead)
  "voucher": { lead: 1, rows: [[0, 1, 2]], shots: [
    { src: "images/projects/dafna/certmock/01", alt: "Подарочный сертификат на 1 000 000 сумов в руках, мокап", size: "Сертификат", r: 2304 / 1856 },
    { src: "images/projects/dafna/voucher/01", alt: "Подарочный ваучер DAFNA и «Кухни Модуль» на 500 000 сумов", size: "Ваучер", r: 1536 / 1024 },
    { src: "images/projects/dafna/voucher/02", alt: "Коробка-подарок для встречи с дизайнерами интерьера", size: "Подарок", r: 1800 / 1450 }
  ] },
  "cash": { cols: 3, ratio: "1488/1140", fit: "cover", shots: [
    { src: "images/projects/dafna/cash/01", alt: "Кассовая зона: способы оплаты, рассрочка и Wi-Fi на одном стенде" },
    { src: "images/projects/dafna/cash/02", alt: "Кассовая зона, вариант с отзывами" },
    { src: "images/projects/dafna/cash/03", alt: "Кассовая зона для премиального шоурума, золотой вариант" }
  ] },
  "cashflat": { cols: 3, ratio: "1668/1188", fit: "contain", shots: [
    { src: "images/projects/dafna/cashflat/01", alt: "Стенд кассовой зоны, макет" },
    { src: "images/projects/dafna/cashflat/02", alt: "Стенд кассовой зоны с отзывами, макет" },
    { src: "images/projects/dafna/cashflat/03", alt: "Стенд для премиального шоурума, макет" }
  ] },
  "price": { cols: 5, ratio: "1400/1980", fit: "contain", shots: [
    { src: "images/projects/dafna/price/01", alt: "Стикеры для шоурума: «Серьёзный стол», «Работай как профи»" },
    { src: "images/projects/dafna/price/02", alt: "Стикеры на узбекском" },
    { src: "images/projects/dafna/price/03", alt: "Стикеры на узбекском, вторая часть" },
    { src: "images/projects/dafna/price/04", alt: "Стикеры «Цена упала», «Купите меня»" },
    { src: "images/projects/dafna/price/05", alt: "Стикеры «Не думай, бери»" }
  ] },
  "zone": { cols: 4, ratio: "2304/1856", fit: "cover", shots: [
    { src: "images/projects/dafna/zone/01", alt: "Фотозона Yashil Uyim с бумажными цветами" },
    { src: "images/projects/dafna/zone/02", alt: "Фотозона с детским столом и стульями" },
    { src: "images/projects/dafna/zone/03", alt: "Фотозона «Космос и наука»" },
    { src: "images/projects/dafna/zone/04", alt: "Фотозона «Космос» с детской мебелью" }
  ] },
  "gala": { cols: 1, ratio: "2000/931", fit: "cover", shots: [
    { src: "images/projects/dafna/gala/01", alt: "Пресс-волл 6 × 2,8 м для гала-концерта к 30-летию" }
  ] },
  // Девять концепций оклейки LABO (2026-11-11, его просьба): борт вырезан мной с каждой концепции и выпрямлен (labo/),
  // вставлен на его мокап 002 (labomock/). Мелкие превью колонкой слева, мокап справа во всю высоту колонки — смена видна сразу.
  // Первый клик ставит концепцию на мокап, второй — просмотр (lbW: макет 760 px шириной, не на весь экран)
  "damas": { shows: [{ items: [0, 1, 2, 3, 4, 5, 6, 7, 8], mockR: 1600 / 1289, stack: true, tight: true, lbW: 760 }], rows: [], shots: [
    { src: "images/projects/dafna/labo/01", thumb: "images/projects/dafna/labo/01-thumb.webp", alt: "Концепция оклейки LABO: Доставка", size: "Концепция 1", r: 1000 / 800, mock: "images/projects/dafna/labomock/01" },
    { src: "images/projects/dafna/labo/02", thumb: "images/projects/dafna/labo/02-thumb.webp", alt: "Концепция оклейки LABO: «Bizning mebellar»", size: "Концепция 2", r: 1000 / 800, mock: "images/projects/dafna/labomock/02" },
    { src: "images/projects/dafna/labo/03", thumb: "images/projects/dafna/labo/03-thumb.webp", alt: "Концепция оклейки LABO: Офисные кресла", size: "Концепция 3", r: 1000 / 800, mock: "images/projects/dafna/labomock/03" },
    { src: "images/projects/dafna/labo/04", thumb: "images/projects/dafna/labo/04-thumb.webp", alt: "Концепция оклейки LABO: «Наша мебель не любит ждать»", size: "Концепция 4", r: 1000 / 800, mock: "images/projects/dafna/labomock/04" },
    { src: "images/projects/dafna/labo/05", thumb: "images/projects/dafna/labo/05-thumb.webp", alt: "Концепция оклейки LABO: Крупный логотип", size: "Концепция 5", r: 1000 / 800, mock: "images/projects/dafna/labomock/05" },
    { src: "images/projects/dafna/labo/06", thumb: "images/projects/dafna/labo/06-thumb.webp", alt: "Концепция оклейки LABO: «Ichida qulay kayfiyat bor»", size: "Концепция 6", r: 1000 / 800, mock: "images/projects/dafna/labomock/06" },
    { src: "images/projects/dafna/labo/07", thumb: "images/projects/dafna/labo/07-thumb.webp", alt: "Концепция оклейки LABO: QR-код приложения", size: "Концепция 7", r: 1000 / 800, mock: "images/projects/dafna/labomock/07" },
    { src: "images/projects/dafna/labo/08", thumb: "images/projects/dafna/labo/08-thumb.webp", alt: "Концепция оклейки LABO: «Milliy brend»", size: "Концепция 8", r: 1000 / 800, mock: "images/projects/dafna/labomock/08" },
    { src: "images/projects/dafna/labo/09", thumb: "images/projects/dafna/labo/09-thumb.webp", alt: "Концепция оклейки LABO: «Missiya: qulay ishlash»", size: "Концепция 9", r: 1000 / 800, mock: "images/projects/dafna/labomock/09" }
  ] },
  "tshirt": { cols: 3, ratio: "2304/1856", fit: "cover", shots: [
    { src: "images/projects/dafna/tshirt/01", alt: "Футболка с узором из сюзане и мебели, чёрная" },
    { src: "images/projects/dafna/tshirt/02", alt: "Футболка с узором и мебелью, белая" },
    { src: "images/projects/dafna/tshirt/03", alt: "Футболка с диваном в орнаменте" },
    { src: "images/projects/dafna/tshirt/04", alt: "Футболка с веером орнамента" },
    { src: "images/projects/dafna/tshirt/05", alt: "Футболка с креслом-хумо" },
    { src: "images/projects/dafna/tshirt/06", alt: "Футболка с орнаментом на подоле" }
  ] },
  // Три дизайна по колонкам (его просьба): чёрный, лесные звери, город из мебели — у каждого две картинки друг под другом
  "cups": { cols: 3, ratio: "1536/1024", fit: "cover", shots: [
    { src: "images/projects/dafna/cups/01", alt: "Новогодние стаканчики, чёрно-золотые" },
    { src: "images/projects/dafna/cups/02", alt: "Новогодние стаканчики с лесными зверями" },
    { src: "images/projects/dafna/cups/04", alt: "Стаканчики с городом из мебели" },
    { src: "images/projects/dafna/cups/03", alt: "Чёрно-золотой стаканчик крупно" },
    { src: "images/projects/dafna/cups/06", alt: "Стаканчики с лесными зверями у ёлки" },
    { src: "images/projects/dafna/cups/05", alt: "Стаканчики с городом из мебели, тёмный фон" }
  ] },
  // Развёртки стаканчиков (2026-11-14, его скриншоты 8 и 9): прежняя большая новогодняя снята. У второй убран серый фон — прозрачный PNG
  "cupflat": { rows: [[0, 1]], shots: [
    { src: "images/projects/dafna/cupflat/01", alt: "Развёртка новогоднего стаканчика: DAFNA, Кухни Модуль, MAFF", r: 2000 / 813 },
    { src: "images/projects/dafna/cupflat/02", alt: "Развёртка стаканчика с городом из мебели", r: 2000 / 931, ext: "png" }
  ] },
  // Календарь 2025: над сеткой сцена с настольным календарём (pjBuildDeskCal), листы два ряда по 6. В просмотре на ПК вдвое меньше (2026-11-14)
  "cal25": { cols: 6, ratio: "1800/1286", fit: "cover", shots: [
    { src: "images/projects/dafna/cal25/01", alt: "Календарь 2025: январь", zoomPc: 0.5 },
    { src: "images/projects/dafna/cal25/02", alt: "Февраль", zoomPc: 0.5 },
    { src: "images/projects/dafna/cal25/03", alt: "Март", zoomPc: 0.5 },
    { src: "images/projects/dafna/cal25/04", alt: "Апрель", zoomPc: 0.5 },
    { src: "images/projects/dafna/cal25/05", alt: "Май", zoomPc: 0.5 },
    { src: "images/projects/dafna/cal25/06", alt: "Июнь", zoomPc: 0.5 },
    { src: "images/projects/dafna/cal25/07", alt: "Июль", zoomPc: 0.5 },
    { src: "images/projects/dafna/cal25/08", alt: "Август", zoomPc: 0.5 },
    { src: "images/projects/dafna/cal25/09", alt: "Сентябрь", zoomPc: 0.5 },
    { src: "images/projects/dafna/cal25/10", alt: "Октябрь", zoomPc: 0.5 },
    { src: "images/projects/dafna/cal25/11", alt: "Ноябрь", zoomPc: 0.5 },
    { src: "images/projects/dafna/cal25/12", alt: "Декабрь", zoomPc: 0.5 }
  ] },
  // Настольный календарь 2024: на ПК просмотр вдвое меньше (его просьба 2026-11-11: крупно портится качество)
  "cal24": { cols: 3, ratio: "2111/1577", fit: "cover", shots: [
    { src: "images/projects/dafna/cal24/01", alt: "Настольный календарь 2024, январь", zoomPc: 0.5 },
    { src: "images/projects/dafna/cal24/02", alt: "Настольный календарь, март", zoomPc: 0.5 },
    { src: "images/projects/dafna/cal24/03", alt: "Настольный календарь, июнь", zoomPc: 0.5 }
  ] },
  "cal24wall": { cols: 3, ratio: "2484/3512", fit: "cover", shots: [
    { src: "images/projects/dafna/cal24wall/01", alt: "Настенный календарь 2024: кресло NOAH" },
    { src: "images/projects/dafna/cal24wall/02", alt: "Настенный календарь: журнальный стол VERKA" },
    { src: "images/projects/dafna/cal24wall/03", alt: "Настенный календарь: диван FLORE" }
  ] },
  // 2026-11-19 (его просьба): прежний мокап снят, его новые мокапы book/01–07. Главный 001 крупно,
  // под каждым мокапом — его разворот в плоском виде (столбик «мокап + разворот», высоты по пропорциям)
  "book": { stackExact: true, lead: 0, rows: [[0, [1, 7], [2, 8]], [[3, 9], [4, 10], [5, 11], [6, 12]]], shots: [
    { src: "images/projects/dafna/book/01", alt: "Буклет DAFNA 2026: обложка и разворот", r: 1800 / 1450 },
    { src: "images/projects/dafna/book/02", alt: "Мокап: офис и столы с регулировкой высоты", r: 1800 / 1450 },
    { src: "images/projects/dafna/book/03", alt: "Мокап: HoReCa и дом", r: 1800 / 1450 },
    { src: "images/projects/dafna/book/04", alt: "Мокап: сад и DIY", r: 1800 / 1450 },
    { src: "images/projects/dafna/book/05", alt: "Мокап: реализованные проекты", r: 1800 / 1450 },
    { src: "images/projects/dafna/book/06", alt: "Мокап: шоурумы на карте", r: 1800 / 1450 },
    { src: "images/projects/dafna/book/07", alt: "Мокап: обложка и дилерская сеть", r: 1800 / 1450 },
    { src: "images/projects/dafna/bookpages/01", alt: "Развороты: офис и столы с регулировкой высоты", r: 1800 / 1260 },
    { src: "images/projects/dafna/bookpages/02", alt: "Развороты: HoReCa и дом", r: 1800 / 1260 },
    { src: "images/projects/dafna/bookpages/03", alt: "Развороты: сад и DIY", r: 1800 / 1260 },
    { src: "images/projects/dafna/bookpages/04", alt: "Реализованные проекты", r: 1800 / 1260 },
    { src: "images/projects/dafna/bookpages/05", alt: "Шоурумы на карте", r: 1800 / 1260 },
    { src: "images/projects/dafna/bookpages/06", alt: "Дилерская сеть", r: 1800 / 1260 }
  ] },
  // 2026-11-15: правая картинка (знак EMAN 30 рядом с DAFNA) снята по его просьбе, файл остался в y30logo/02.png
  "y30logo": { cols: 2, ratio: "16/9", fit: "contain", shots: [
    { src: "images/projects/dafna/y30logo/01", alt: "Логотип «30 DAFNA yil birga»", ext: "png" }
  ] },
  "y30cards": { cols: 3, ratio: "1920/1280", fit: "cover", shots: [
    { src: "images/projects/dafna/y30cards/01", alt: "Юбилейная визитка: чёрная лицевая сторона со знаком 30 и оборот с QR-кодом" },
    { src: "images/projects/dafna/y30cards/02", alt: "Юбилейная визитка: белая лицевая сторона и оборот с QR-кодом" },
    { src: "images/projects/dafna/y30cards/03", alt: "Визитка отдела ВЭД на русском и английском с двумя QR-кодами" }
  ] },
  // 2026-11-19 (его просьба): вся юбилейная айдентика и первый вариант знака в просмотре на 30 % меньше
  "y30id": { cols: 3, ratio: "16/9", fit: "cover", shots: [
    { src: "images/projects/dafna/y30id/01", alt: "Логотип на светлом и тёмном фоне", zoomPc: 0.7 },
    { src: "images/projects/dafna/y30id/04", alt: "Пакеты", zoomPc: 0.7 },
    { src: "images/projects/dafna/y30id/05", alt: "Календарь", zoomPc: 0.7 },
    { src: "images/projects/dafna/y30id/06", alt: "Роллапы", zoomPc: 0.7 },
    { src: "images/projects/dafna/y30id/07", alt: "Ручки с паттерном", zoomPc: 0.7 },
    { src: "images/projects/dafna/y30id/08", alt: "Паттерн из линий цифры 30", zoomPc: 0.7 },
    // 2026-11-15: мокапы визиток и бланков (y30id/02, 03) сняты, три визитки y30cards стоят последними (его просьба)
    { src: "images/projects/dafna/y30cards/01", alt: "Юбилейная визитка: чёрная лицевая сторона со знаком 30 и оборот с QR-кодом", zoomPc: 0.7 },
    { src: "images/projects/dafna/y30cards/02", alt: "Юбилейная визитка: белая лицевая сторона и оборот с QR-кодом", zoomPc: 0.7 },
    { src: "images/projects/dafna/y30cards/03", alt: "Визитка отдела ВЭД на русском и английском с двумя QR-кодами", zoomPc: 0.7 }
  ] },
  // Первый вариант знака: цифра 30 в виде ракеты, не утвердили. Иллюстрация снята по его просьбе 2026-11-11
  "y30poster": { rows: [[0, 1]], shots: [
    { src: "images/projects/dafna/y30alt/01", alt: "Первый вариант юбилейного знака", r: 1800 / 1080, zoomPc: 0.7 },
    { src: "images/projects/dafna/y30alt/02", alt: "Первый вариант на кружке", r: 1800 / 1080, zoomPc: 0.7 }
  ] },
  // Стикеры без подложки, как в Home Market (fit clear), мельче: два ряда по 11
  "y30stick": { cols: 11, colsM: 6, ratio: "1/1", fit: "clear", shots: [
    { src: "images/projects/dafna/y30stick/01", alt: "Стикер DAFNA для Telegram", ext: "png", zoomPc: 0.5 },
    { src: "images/projects/dafna/y30stick/02", alt: "Стикер DAFNA для Telegram", ext: "png", zoomPc: 0.5 },
    { src: "images/projects/dafna/y30stick/03", alt: "Стикер DAFNA для Telegram", ext: "png", zoomPc: 0.5 },
    { src: "images/projects/dafna/y30stick/04", alt: "Стикер DAFNA для Telegram", ext: "png", zoomPc: 0.5 },
    { src: "images/projects/dafna/y30stick/05", alt: "Стикер DAFNA для Telegram", ext: "png", zoomPc: 0.5 },
    { src: "images/projects/dafna/y30stick/06", alt: "Стикер DAFNA для Telegram", ext: "png", zoomPc: 0.5 },
    { src: "images/projects/dafna/y30stick/07", alt: "Стикер DAFNA для Telegram", ext: "png", zoomPc: 0.5 },
    { src: "images/projects/dafna/y30stick/08", alt: "Стикер DAFNA для Telegram", ext: "png", zoomPc: 0.5 },
    { src: "images/projects/dafna/y30stick/09", alt: "Стикер DAFNA для Telegram", ext: "png", zoomPc: 0.5 },
    { src: "images/projects/dafna/y30stick/10", alt: "Стикер DAFNA для Telegram", ext: "png", zoomPc: 0.5 },
    { src: "images/projects/dafna/y30stick/11", alt: "Стикер DAFNA для Telegram", ext: "png", zoomPc: 0.5 },
    { src: "images/projects/dafna/y30stick/12", alt: "Стикер DAFNA для Telegram", ext: "png", zoomPc: 0.5 },
    { src: "images/projects/dafna/y30stick/13", alt: "Стикер DAFNA для Telegram", ext: "png", zoomPc: 0.5 },
    { src: "images/projects/dafna/y30stick/14", alt: "Стикер DAFNA для Telegram", ext: "png", zoomPc: 0.5 },
    { src: "images/projects/dafna/y30stick/15", alt: "Стикер DAFNA для Telegram", ext: "png", zoomPc: 0.5 },
    { src: "images/projects/dafna/y30stick/16", alt: "Стикер DAFNA для Telegram", ext: "png", zoomPc: 0.5 },
    { src: "images/projects/dafna/y30stick/17", alt: "Стикер DAFNA для Telegram", ext: "png", zoomPc: 0.5 },
    { src: "images/projects/dafna/y30stick/18", alt: "Стикер DAFNA для Telegram", ext: "png", zoomPc: 0.5 },
    { src: "images/projects/dafna/y30stick/19", alt: "Стикер DAFNA для Telegram", ext: "png", zoomPc: 0.5 },
    { src: "images/projects/dafna/y30stick/20", alt: "Стикер DAFNA для Telegram", ext: "png", zoomPc: 0.5 },
    { src: "images/projects/dafna/y30stick/21", alt: "Стикер DAFNA для Telegram", ext: "png", zoomPc: 0.5 },
    { src: "images/projects/dafna/y30stick/22", alt: "Стикер DAFNA для Telegram", ext: "png", zoomPc: 0.5 }
  ] },
};

/* Матрицы главных баннеров сайта: файлы matrix/<модель>-<размер>-<язык>.webp.
   web26 — размеры сайта с апреля 2026, web25 — прежние размеры */
window.PROJECT_MATRIX = window.PROJECT_MATRIX || {};
window.PROJECT_MATRIX["dafna"] = {
  "web26": {
    path: "images/projects/dafna/matrix", label: "Баннер",
    models: [
      { id: "sport", name: "Игровые кресла" },
      { id: "season", name: "Новинки сезона" },
      { id: "tinario", name: "Стол TINARIO" },
      { id: "nova", name: "NOVA 3" },
      { id: "cabinet", name: "Кабинет" },
      { id: "indep", name: "День независимости" },
      { id: "kento", name: "KENTO" },
      { id: "milton", name: "MILTON" },
      { id: "massage", name: "Массажные накидки" },
    ],
    langs: [{ id: "ru", name: "Рус" }, { id: "uz", name: "Узб" }, { id: "en", name: "Eng" }],
    rows: [["1600x500", "680x700"]],
    // Баннеры показаны прямо на странице сайта: скриншот и место баннера на нём, в пикселях скриншота.
    // dots — точки карусели: ширина, высота, шаг и отступ от низа баннера
    mock: {
      "1600x500": {
        name: "Сайт", src: "images/projects/dafna/site/desktop.webp", w: 1712, h: 1285,
        x: 54, y: 178, bw: 1600, bh: 500, radius: 12, arrow: 48, dots: [26, 7, 34, 24],
      },
      "680x700": {
        name: "Телефон", src: "images/projects/dafna/site/phone.webp", w: 589, h: 1280,
        x: 0, y: 254, bw: 589, bh: 607, radius: 8, dots: [20, 7, 31, 19],
      },
    },
  },
  "web25": {
    path: "images/projects/dafna/matrix", label: "Баннер",
    models: [
      { id: "office", name: "Новинки для офиса" },
      { id: "yummy", name: "Детские кресла" },
      { id: "art", name: "Арт-кресла" },
      { id: "kitchen", name: "Кухня" },
      { id: "combo", name: "Комбо" },
      { id: "ramadan", name: "Рамадан" },
      { id: "flore", name: "Диваны" },
      { id: "split", name: "Яндекс Сплит" },
      { id: "workplace", name: "Рабочее место" },
    ],
    langs: [{ id: "ru", name: "Рус" }, { id: "uz", name: "Узб" }, { id: "en", name: "Eng" }],
    rows: [["2445x878", "668x508"]],
    below: true,
  },
  /* Анимированные баннеры из After Effects, без звука: video/<модель>-<размер>-<язык>.mp4.
     У OSKAR прежние размеры сайта, у остальных — новые */
  "video": {
    path: "images/projects/dafna/video",
    models: [
      { id: "aurum", name: "Стол AURUM", sizes: ["1600x500", "680x700"] },
      { id: "libernova", name: "Кресло LIBERNOVA", sizes: ["1600x500", "680x700"] },
      { id: "oskar", name: "Диван OSKAR", sizes: ["2445x878", "668x508"] },
    ],
    langs: [{ id: "ru", name: "Рус" }, { id: "uz", name: "Узб" }, { id: "en", name: "Eng" }],
  },
};