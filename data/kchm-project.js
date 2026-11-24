/* Кейс KCHM Group (Сторонние проекты): группы картинок.
   Как добавить картинку: положить файл NN.webp и превью NN-thumb.webp в images/projects/kchm/<группа>/
   и дописать строку в нужную группу. cols — колонок, ratio — пропорции плитки,
   fit: cover — кадрировать, contain — показать целиком, feature — первая плитка крупнее.
   size у картинки — подпись с размером под плиткой. */
window.PROJECT_GROUPS = window.PROJECT_GROUPS || {};
window.PROJECT_GROUPS["kchm"] = {
  // 2026-11-22 (его просьба): «Главное здание и база», «Флагштоки» и «Магазины в Самарканде и Ташкенте» сняты со страницы,
  // вместо них — его новые мокапы одной группой: два крупно, под ними три, подпись под каждой картинкой.
  // Города у магазинов он разрешил поставить на моё усмотрение. Старые группы facade, flags, flagspic, shops оставлены ниже, файлы целы.
  "env": { rows: [[0, 1], [2, 3, 4]], shots: [
    { src: "images/projects/kchm/env/01", alt: "Главная база KCHM Group: здание с вывеской и стелой LiuGong и HOWO", size: "Главная база", r: 1800 / 1450 },
    { src: "images/projects/kchm/env/02", alt: "Въезд на главную базу: стела KCHM Group у ворот", size: "Въезд на главную базу", r: 1800 / 1450 },
    { src: "images/projects/kchm/env/03", alt: "Магазин: крышная вывеска с экскаватором", size: "Магазин в Самарканде", r: 1800 / 1450 },
    { src: "images/projects/kchm/env/04", alt: "Магазин: оклейка витрин первого этажа", size: "Магазин в Ташкенте", r: 1800 / 1450 },
    { src: "images/projects/kchm/env/05", alt: "Филиал: павильон с оклеенными витринами", size: "Филиал в Самарканде", r: 1800 / 1450 },
  ] },
  "facade": { cols: 3, ratio: "3/2", fit: "cover", feature: true, shots: [
    { src: "images/projects/kchm/facade/01", alt: "Фасад главного офиса в цветах KCHM и партнёров" },
    { src: "images/projects/kchm/facade/02", alt: "Вывеска на здании базы, вариант со шкалой услуг" },
    { src: "images/projects/kchm/facade/03", alt: "Вывеска на здании базы, вариант с техникой" },
    { src: "images/projects/kchm/facade/04", alt: "Вывеска базы: экскаватор выходит за край щита" },
    { src: "images/projects/kchm/facade/05", alt: "Вывеска базы с логотипом партнёра" },
    { src: "images/projects/kchm/facade/06", alt: "База издалека: брендинг забора и входной группы" },
  ] },
  "flags": { cols: 6, ratio: "85/195", fit: "contain", shots: [
    { src: "images/projects/kchm/flags/01", alt: "Флаг KCHM Group, фирменный цвет" },
    { src: "images/projects/kchm/flags/02", alt: "Флаг KCHM Group, белый" },
    { src: "images/projects/kchm/flags/03", alt: "Флаг LiuGong, синий" },
    { src: "images/projects/kchm/flags/04", alt: "Флаг LiuGong, белый" },
    { src: "images/projects/kchm/flags/05", alt: "Флаг HOWO, цветной" },
    { src: "images/projects/kchm/flags/06", alt: "Флаг HOWO, белый" },
  ] },
  "flagspic": { cols: 2, ratio: "5/2", fit: "cover", shots: [
    { src: "images/projects/kchm/flagspic/01", alt: "Три флага перед зданием: LiuGong, KCHM, Sinotruk" },
    { src: "images/projects/kchm/flagspic/02", alt: "Главное здание, второй вариант фасада" },
  ] },
  "shops": { cols: 3, ratio: "3/2", fit: "cover", shots: [
    { src: "images/projects/kchm/shops/01", alt: "Магазин в Самарканде: крышная вывеска «Строительная техника»" },
    { src: "images/projects/kchm/shops/02", alt: "Магазин в Самарканде: витрины с техникой и QR-кодами" },
    { src: "images/projects/kchm/shops/03", alt: "Магазин в Самарканде: витрина сбоку" },
    { src: "images/projects/kchm/shops/04", alt: "Магазин в Самарканде: вывеска HOWO и LiuGong" },
    { src: "images/projects/kchm/shops/05", alt: "Магазин в Ташкенте: фасад первого этажа" },
    { src: "images/projects/kchm/shops/06", alt: "Магазин в Ташкенте: развёртка витрин" },
  ] },
  // 2026-11-22 (его просьба): «Офис и постеры HOWO» собран заново из его мокапов 001–007 и макетов-скриншотов 573–581.
  // Каждый мокап стоит парой со своим макетом ({ pair }), по две пары в ряд; в просмотре: мокап → его макет → следующий мокап.
  // Триптих 574–576 склеен в одну картинку p1 (зазор 24 px цвета фона кейса). Старые группы office и offtall сняты со страницы, файлы целы.
  "howo": { rows: [[{ pair: [0, 7] }], [{ pair: [1, 8] }, { pair: [2, 9] }], [{ pair: [3, 10] }, { pair: [4, 11] }], [{ pair: [5, 12] }, { pair: [6, 13] }]], shots: [
    { src: "images/projects/kchm/howo/m1", alt: "Приёмная: триптих HOWO на стене над стойкой", size: "Мокап", r: 1800 / 1450 },
    { src: "images/projects/kchm/howo/m2", alt: "Постер HOWO в раме у рабочего места", size: "Мокап", r: 1800 / 1450 },
    { src: "images/projects/kchm/howo/m3", alt: "Постер HOWO с белым тягачом в кабинете", size: "Мокап", r: 1800 / 1450 },
    { src: "images/projects/kchm/howo/m4", alt: "Постер HOWO с бетоновозом в кабинете", size: "Мокап", r: 1800 / 1450 },
    { src: "images/projects/kchm/howo/m5", alt: "Постер HOWO с чёрным тягачом в кабинете", size: "Мокап", r: 1800 / 1450 },
    { src: "images/projects/kchm/howo/m6", alt: "Постер HOWO с самосвалом у карьера в опенспейсе", size: "Мокап", r: 1800 / 1450 },
    { src: "images/projects/kchm/howo/m7", alt: "Постер HOWO с самосвалом и экскаватором в кабинете логистики", size: "Мокап", r: 1800 / 1450 },
    { src: "images/projects/kchm/howo/p1", alt: "Триптих HOWO и SITRAK: три панели", size: "Макет", r: 2102 / 1179, zoomPc: 0.7 },
    { src: "images/projects/kchm/howo/p2", alt: "Постер HOWO: белый тягач на трассе", size: "Макет", r: 587 / 1179, zoomPc: 0.7 },
    { src: "images/projects/kchm/howo/p3", alt: "Постер HOWO: белый тягач в поле", size: "Макет", r: 784 / 1278, zoomPc: 0.7 },
    { src: "images/projects/kchm/howo/p4", alt: "Постер HOWO: бетоновоз", size: "Макет", r: 786 / 1277, zoomPc: 0.7 },
    { src: "images/projects/kchm/howo/p5", alt: "Постер HOWO: чёрный тягач", size: "Макет", r: 784 / 1273, zoomPc: 0.7 },
    { src: "images/projects/kchm/howo/p6", alt: "Постер HOWO: самосвал у карьера", size: "Макет", r: 1079 / 1277, zoomPc: 0.7 },
    { src: "images/projects/kchm/howo/p7", alt: "Постер HOWO: самосвал и экскаватор", size: "Макет", r: 1474 / 981, zoomPc: 0.7 },
  ] },
  "office": { cols: 3, ratio: "3/2", fit: "cover", shots: [
    { src: "images/projects/kchm/office/01", alt: "Ресепшн: стена с логотипами LiuGong, KCHM и HOWO" },
    { src: "images/projects/kchm/office/02", alt: "Коридор офиса с постерами HOWO" },
    { src: "images/projects/kchm/office/03", alt: "Триптих HOWO, плоский макет" },
  ] },
  "offtall": { cols: 4, ratio: "3/4", fit: "cover", shots: [
    { src: "images/projects/kchm/offtall/01", alt: "Переговорная: триптих на стене" },
    { src: "images/projects/kchm/offtall/02", alt: "Постер HOWO рядом с остеклением" },
    { src: "images/projects/kchm/offtall/03", alt: "Постер HOWO на тёмной стене" },
    { src: "images/projects/kchm/offtall/04", alt: "Постер в кабинете, над рабочим местом" },
  ] },
  "signs": { cols: 4, ratio: "4/3", fit: "cover", shots: [
    { src: "images/projects/kchm/signs/01", alt: "Табличка «Отдел сервиса» на двух языках" },
    { src: "images/projects/kchm/signs/02", alt: "Табличка «Раздевалка»" },
    { src: "images/projects/kchm/signs/03", alt: "Табличка сварочного поста в цеху" },
    { src: "images/projects/kchm/signs/04", alt: "Табличка мастерской электрика" },
  ] },
  // 2026-11-22 (его просьба): две старые картинки машины (cars/01, 02) сняты, вместо них его мокап car/01.
  // Наклейки stickers/01–03: белые поля обрезаны ровно по краю (замер скриптом), стоят рядом одной высотой.
  "auto": { rows: [[0], [1, 2, 3]], shots: [
    { src: "images/projects/kchm/car/01", alt: "Оклейка служебного автомобиля KCHM Group", r: 1800 / 1450 },
    { src: "images/projects/kchm/stickers/01", alt: "Наклейка и трафарет на кабине грузовика", r: 1562 / 1287 },
    { src: "images/projects/kchm/stickers/02", alt: "Макет наклейки «Sotish, servis, ehtiyot qismlari» и она на технике", r: 1451 / 1482 },
    { src: "images/projects/kchm/stickers/03", alt: "Трафарет с логотипом на технике", r: 1497 / 1529 },
  ] },
  "cars": { cols: 2, ratio: "2/1", fit: "cover", shots: [
    { src: "images/projects/kchm/cars/01", alt: "Оклейка служебного автомобиля, вид спереди" },
    { src: "images/projects/kchm/cars/02", alt: "Оклейка служебного автомобиля, вид сбоку" },
  ] },
  "stickers": { cols: 3, ratio: "1/1", fit: "contain", shots: [
    { src: "images/projects/kchm/stickers/01", alt: "Наклейка и трафарет на кабине грузовика" },
    { src: "images/projects/kchm/stickers/02", alt: "Макет наклейки «Sotish, servis, ehtiyot qismlari»" },
    { src: "images/projects/kchm/stickers/03", alt: "Трафарет с логотипом на технике" },
  ] },
  "leasing": { cols: 5, ratio: "3/5", fit: "contain", shots: [
    // 2026-11-22 (его просьба): его оригиналы 240×400 без пережатия; в просмотре не увеличивать — открываются в родном размере (max: 1)
    { src: "images/projects/kchm/leasing/01", alt: "Лизинг: фронтальный погрузчик, 240×400", size: "240 × 400", max: 1 },
    { src: "images/projects/kchm/leasing/02", alt: "Лизинг: экскаватор CLG922E, 240×400", size: "240 × 400", max: 1 },
    { src: "images/projects/kchm/leasing/03", alt: "Лизинг: каток CLG6208E, 240×400", size: "240 × 400", max: 1 },
    { src: "images/projects/kchm/leasing/04", alt: "Лизинг: автогрейдер CLG4180D, 240×400", size: "240 × 400", max: 1 },
    { src: "images/projects/kchm/leasing/05", alt: "Лизинг: бульдозер CLGB160C, 240×400", size: "240 × 400", max: 1 },
  ] },
  "service": { stackExact: true, rows: [[0, 1, 2, [3, 4]]], shots: [
    // 2026-11-22 (его папка «22.12.2022 - Баннера про сервис»): одна серия — один ряд во всю ширину,
    // маленькие 300×250 и 336×280 столбиком справа; в просмотре родной размер (max: 1), не увеличивать
    { src: "images/projects/kchm/service/01", alt: "Сервис: специализированный центр по ремонту спецтехники, 240×400", size: "240 × 400", r: 240 / 400, max: 1 },
    { src: "images/projects/kchm/service/02", alt: "Сервис: обслуживание и ремонт спецтехники в минимальный срок, 300×600", size: "300 × 600", r: 300 / 600, max: 1 },
    { src: "images/projects/kchm/service/03", alt: "Сервис: ремонт спецтехники на Бектемире круглосуточно, 300×600", size: "300 × 600", r: 300 / 600, max: 1 },
    { src: "images/projects/kchm/service/04", alt: "Сервис: ремонт двигателей спецтехники с экономией до 50 %, 300×250", size: "300 × 250", r: 300 / 250, max: 1 },
    { src: "images/projects/kchm/service/05", alt: "Сервис: ремонт навесного оборудования с гарантией, 336×280", size: "336 × 280", r: 336 / 280, max: 1 },
  ] },
  "servicew": { stackExact: true, rows: [[0, 1, 2, [3, 4]]], shots: [
    // 2026-11-22 (его папка «Ремонт Гидроцелиндров»): раскладка как у сервиса, просмотр в родном размере
    { src: "images/projects/kchm/servicew/01", alt: "Ремонт гидроцилиндров: сервисный центр, 240×400", size: "240 × 400", r: 240 / 400, max: 1 },
    { src: "images/projects/kchm/servicew/02", alt: "Ремонт гидроцилиндров: оранжевая версия, 300×600", size: "300 × 600", r: 300 / 600, max: 1 },
    { src: "images/projects/kchm/servicew/03", alt: "Ремонт гидроцилиндров: синяя версия, 300×600", size: "300 × 600", r: 300 / 600, max: 1 },
    { src: "images/projects/kchm/servicew/04", alt: "Ремонт гидроцилиндра с экономией до 50 %, 300×250", size: "300 × 250", r: 300 / 250, max: 1 },
    { src: "images/projects/kchm/servicew/05", alt: "Ремонт гидроцилиндра с гарантией до 6 месяцев, 336×280", size: "336 × 280", r: 336 / 280, max: 1 },
  ] },
  // 2026-11-22 (его просьба): вакансии sq/03, sq/04 — это посты 1:1, перенесены в SMM KCHM (images/smm/kchm/1x1/031, 032).
  // Остались площадка Sergili: два квадрата рядом, длинные баннеры под ними во всю ширину; в просмотре на 30 % меньше
  "sergili": { rows: [[0, 1], [2], [3]], shots: [
    { src: "images/projects/kchm/sq/01", alt: "Sergili: площадка для поиска техники, русский", size: "680 × 565", r: 680 / 565, zoomPc: 0.7 },
    { src: "images/projects/kchm/sq/02", alt: "Sergili: площадка для поиска техники, узбекский", size: "680 × 565", r: 680 / 565, zoomPc: 0.7 },
    { src: "images/projects/kchm/strips/01", alt: "Sergili: длинный баннер, русский", size: "2555 × 403", r: 2555 / 403, zoomPc: 0.7 },
    { src: "images/projects/kchm/strips/02", alt: "Sergili: длинный баннер, узбекский", size: "2555 × 403", r: 2555 / 403, zoomPc: 0.7 },
  ] },
  "sq": { cols: 4, ratio: "6/5", fit: "contain", shots: [
    { src: "images/projects/kchm/sq/01", alt: "Sergili: площадка для поиска техники, русский", size: "680 × 565" },
    { src: "images/projects/kchm/sq/02", alt: "Sergili: площадка для поиска техники, узбекский", size: "680 × 565" },
  ] },
  "strips": { cols: 2, ratio: "63/10", fit: "contain", shots: [
    { src: "images/projects/kchm/strips/01", alt: "Sergili: длинный баннер, русский", size: "2555 × 403", zoomPc: 0.7 },
    { src: "images/projects/kchm/strips/02", alt: "Sergili: длинный баннер, узбекский", size: "2555 × 403", zoomPc: 0.7 },
  ] },
  "sitephoto": { cols: 3, ratio: "3/2", fit: "cover", shots: [
    { src: "images/projects/kchm/sitephoto/01", alt: "Фото для сайта: погрузчик на фирменной подложке", size: "1000 × 667" },
    { src: "images/projects/kchm/sitephoto/02", alt: "Фото для сайта: погрузчик в карьере", size: "1000 × 667" },
    { src: "images/projects/kchm/sitephoto/03", alt: "Фото для сайта: каток на фирменной подложке", size: "1000 × 667" },
  ] },
  "landing": { cols: 1, ratio: "21/9", fit: "top", shots: [
    { src: "images/projects/kchm/landing/01", alt: "Концепт сайта KCHM Group: шаблон страницы техники, вся страница" },
  ] },
  // 2026-11-22 (его новые мокапы): флаер, КП и сервисная книжка — мокап крупно и рядом/под ним сами макеты.
  // Каталог техники снят по его просьбе (картинки в архиве проекта). Книжка для Китая — анимация pjBuildBook
  "flyer": { stackExact: true, rows: [[0, [1, 2]]], shots: [
    { src: "images/projects/kchm/flyer/m", alt: "Мокап: флаер о гидромолотах на столе", r: 1.2414 },
    { src: "images/projects/kchm/flyer/01", alt: "Флаер о гидромолотах: лицевая сторона", r: 1895 / 1337, zoomPc: 0.7 },
    { src: "images/projects/kchm/flyer/02", alt: "Флаер о гидромолотах: внутренняя сторона", r: 1894 / 1338, zoomPc: 0.7 },
  ] },
  "kp": { rows: [[0], [1, 2, 3]], shots: [
    { src: "images/projects/kchm/kp/m", alt: "Мокап: коммерческое предложение на столе", r: 1.2414 },
    { src: "images/projects/kchm/kp/01", alt: "Коммерческое предложение: обложка", r: 888 / 1259, zoomPc: 0.7 },
    { src: "images/projects/kchm/kp/02", alt: "Коммерческое предложение: автобетоносмеситель HOWO", r: 888 / 1257, zoomPc: 0.7 },
    { src: "images/projects/kchm/kp/03", alt: "Финансирование: условия и решения, трейд-ин", r: 889 / 1259, zoomPc: 0.7 },
  ] },
  // Страницы книжки по порядку: p00 — обложка, p12 — последняя (контакты)
  "china": { book: true, shots: [
    { src: "images/projects/kchm/china/p00", alt: "Книжка для партнёров из Китая: обложка" },
    { src: "images/projects/kchm/china/p01", alt: "Книжка для партнёров из Китая: содержание" },
    { src: "images/projects/kchm/china/p02", alt: "Книжка для партнёров из Китая: о компании" },
    { src: "images/projects/kchm/china/p03", alt: "Книжка для партнёров из Китая: команда" },
    { src: "images/projects/kchm/china/p04", alt: "Книжка для партнёров из Китая: миссия компании" },
    { src: "images/projects/kchm/china/p05", alt: "Книжка для партнёров из Китая: корпоративная культура" },
    { src: "images/projects/kchm/china/p06", alt: "Книжка для партнёров из Китая: дни рождения и обучение" },
    { src: "images/projects/kchm/china/p07", alt: "Книжка для партнёров из Китая: ящик предложений True box" },
    { src: "images/projects/kchm/china/p08", alt: "Книжка для партнёров из Китая: история компании" },
    { src: "images/projects/kchm/china/p09", alt: "Книжка для партнёров из Китая: руководители" },
    { src: "images/projects/kchm/china/p10", alt: "Книжка для партнёров из Китая: карьера в KCHM Group" },
    { src: "images/projects/kchm/china/p11", alt: "Книжка для партнёров из Китая: что мы продаём" },
    { src: "images/projects/kchm/china/p12", alt: "Книжка для партнёров из Китая: контакты" },
  ] },
  "servicebook": { stackExact: true, rows: [[0, [1, 2]]], shots: [
    { src: "images/projects/kchm/servicebook/m", alt: "Мокап: график технического обслуживания в сервисе", r: 1.2414 },
    { src: "images/projects/kchm/servicebook/01", alt: "Сервисная книжка: обложка", r: 1791 / 1265, zoomPc: 0.7 },
    { src: "images/projects/kchm/servicebook/02", alt: "Сервисная книжка: содержание и таблица обслуживания", r: 2356 / 833, zoomPc: 0.7 },
  ] },
  // 2026-11-23: две плоские визитки сняты, вместо них его мокап (летящие визитки в офисе)
  "cards": { rows: [[0]], shots: [
    { src: "images/projects/kchm/cards/m", alt: "Мокап: визитки KCHM Group в офисе", r: 2200 / 1228 },
  ] },
  // 2026-11-23: календарь стал «часами» (pjBuildClock в script.js, картинки calmock и calround) — группы calmock/calpages сняты.
  // Доска лучших сотрудников, грамоты и логотип со слоганом удалены по его просьбе (картинки — в архиве проекта)
  // 2026-11-23: его мокап 001 во всю ширину, под ним пять постеров в развёрнутом виде (просмотр на 30 % меньше)
  "posters": { rows: [[0], [2, 3, 4, 5, 1]], shots: [
    { src: "images/projects/kchm/posters/m", alt: "Мокап: мотивационные постеры KCHM Group на стене", r: 2200 / 1228 },
    { src: "images/projects/kchm/posters/01", alt: "Мотивационный постер 1", r: 814 / 1136, zoomPc: 0.7 },
    { src: "images/projects/kchm/posters/02", alt: "Мотивационный постер 2", r: 814 / 1138, zoomPc: 0.7 },
    { src: "images/projects/kchm/posters/03", alt: "Мотивационный постер 3", r: 813 / 1137, zoomPc: 0.7 },
    { src: "images/projects/kchm/posters/04", alt: "Мотивационный постер 4", r: 812 / 1136, zoomPc: 0.7 },
    { src: "images/projects/kchm/posters/05", alt: "Мотивационный постер 5", r: 812 / 1138, zoomPc: 0.7 },
  ] },
  // 2026-11-23: презентации — парящая колонка прямо в index.html (bb-fly), здесь не нужны
  // 2026-11-23: белый край у круглых тортов срезан, все четыре квадратные 1:1 одного размера; просмотр на 30 % меньше; блок — последний в кейсе
  "cake": { rows: [[0, 1, 2, 3]], shots: [
    { src: "images/projects/kchm/cake/01", alt: "Торт ко дню рождения, синий круглый", r: 1, zoomPc: 0.7 },
    { src: "images/projects/kchm/cake/02", alt: "Торт ко дню рождения, жёлтый круглый", r: 1, zoomPc: 0.7 },
    { src: "images/projects/kchm/cake/03", alt: "Торт ко дню рождения, синий квадратный", r: 1, zoomPc: 0.7 },
    { src: "images/projects/kchm/cake/04", alt: "Торт ко дню рождения, жёлтый квадратный", r: 1, zoomPc: 0.7 },
  ] },
};

/* Матрица форматов: файлы matrix/<модель>-<размер>-<язык>.webp */
window.PROJECT_MATRIX = window.PROJECT_MATRIX || {};
window.PROJECT_MATRIX["kchm"] = {
  path: "images/projects/kchm/matrix",
  // 2026-11-22 (его просьба): в просмотре каждый баннер в родном размере, не увеличивать — маленький остаётся маленьким.
  // Большие (1920×1080) только уменьшаются, если не влезают в экран. Раньше было zoomPc: 0.7.
  max: 1,
  // 2026-11-22 (его просьба): два дизайна одной матрицы, переключаются кнопками; файлы серии — в своей папке path
  series: [
    { id: "summer", name: "Летняя реклама", path: "images/projects/kchm/matrix" },
    { id: "winter", name: "Зимняя реклама", path: "images/projects/kchm/matrix/winter" },
  ],
  models: [
    { id: "clg922e", name: "Экскаватор" },
    { id: "clg6208e", name: "Каток" },
    { id: "clg4180d", name: "Автогрейдер" },
    { id: "clgb160c", name: "Бульдозер" },
    { id: "clg830e", name: "Погрузчик" },
  ],
  langs: [{ id: "ru", name: "Рус" }, { id: "uz", name: "Узб" }],
  // 2026-11-22 (его просьба): плоские баннеры уменьшены — все шесть одним рядом прямо под мокапом, чтобы не прокручивать
  rows: [["1920x1080", "1080x1080", "240x400", "300x600", "300x250", "336x280"]],
  // 2026-11-22: его мокап (монитор, планшет, телефон) над плоскими баннерами. Старые баннеры с мокапа стёрты (matrix/mock/base.webp,
  // исходник и скрипт — KCHM\Project KCHM\03 Реклама\Мокап баннеров на сайте…). Окна замерены по мокапу 2304×1856:
  // q — углы TL, TR, BR, BL; clip — планшет частично за телефоном
  scene: {
    src: "images/projects/kchm/matrix/mock/base.webp", w: 2304, h: 1856,
    alt: "Мокап: баннеры на сайте в мониторе, планшете и телефоне",
    slots: [
      { size: "1920x1080", q: [873, 459, 1581, 407, 1581, 828, 873, 835] },   // монитор: главный баннер
      { size: "300x250", q: [582, 489, 848, 485, 848, 707, 582, 711] },       // монитор: слева в колонке
      { size: "300x600", q: [1603, 405, 1903, 395, 1903, 1003, 1603, 1001] }, // монитор: справа
      { size: "1080x1080", q: [1371, 858, 1569, 852, 1569, 1050, 1371, 1056] }, // монитор: под главным
      { size: "336x280", q: [244, 1082, 749, 1082, 749, 1503, 244, 1503],    // планшет
        clip: [244, 1078, 752, 1078, 752, 1186, 728, 1214, 728, 1640, 244, 1640] },
      { size: "240x400", q: [750, 1300, 983, 1300, 983, 1688, 750, 1688] },   // телефон
    ],
  },
};
