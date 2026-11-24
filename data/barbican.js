/* ==========================================================================
   ДАННЫЕ ГАЛЕРЕИ: Barbican (SMM)
   Картинки сжаты для сайта 2026-11-16 из F:\MOTO-MOTO\Barbican (002 - OLD, Barbican-nov-17/18, 003 - Попутка: сторис со вкусами, обложки актуальных, аватарка).
   Копии с подписями — в F:\Claude CODE\PORTFOLIO\Barbican\SMM.
   Поля работы: format — вкладка ("1x1", "4x5", "9x16", "highlights"), group — "main" или "covers",
   title — подпись (из названия папки), thumb — превью, full — большая картинка.
   ПОРЯДОК В ФАЙЛЕ = ПОРЯДОК НА САЙТЕ: посты от новых к старым, слайды каруселей разнесены.
   ========================================================================== */
window.GALLERIES = window.GALLERIES || {};

window.GALLERY_GROUPS = window.GALLERY_GROUPS || {};
window.GALLERY_GROUPS["barbican"] = {
  covers: { title: "Обложки 9:16", ratio: "9x16" },
};

// Интерфейс Instagram в большом просмотре работы. Всё здесь — рыба, кроме названия и аватара
window.GALLERY_INSTAGRAM = window.GALLERY_INSTAGRAM || {};
window.GALLERY_INSTAGRAM["barbican"] = {
  account: "barbican.uz",
  avatar: "images/smm/barbican/brand/avatar.webp",
  location: "Ташкент",
  music: "barbican.uz · Оригинальная аудиодорожка",
  captionText: "Barbican — натуральный солодовый напиток из ОАЭ.",
  tags: "#barbican #солодовыйнапиток",
  groups: window.GALLERY_GROUPS["barbican"],
  people: ["aziz_t","malika.uz","timur_r","nilufar_07","bekzod.tash","dilnoza_k","jasur.sport","kamola_88","ulugbek.t","shahzoda_a"],
  comments: [
    "Мой любимый — гранатовый!",
    "Где можно купить?",
    "Очень освежает 👍",
    "А в Korzinka есть?",
    "Взяли на пикник, всем понравилось",
    "Какой вкус посоветуете?",
    "Без сахара есть?",
    "Рахмат!",
    "Лучший напиток летом",
    "Красивые фото!",
    "Персиковый — огонь",
    "Халяль? Отлично",
  ],
};

// Вкладки 9:16 и Актуальные открываются отдельным окном (как у KCHM)
window.GALLERY_WALL = window.GALLERY_WALL || {};
window.GALLERY_WALL["barbican"] = {
  formats: ["9x16","highlights"],
  modes: { "highlights": "lens" },
  lensRows: 1,                 // актуальных мало — одна полоска, а не две
  brand: "Barbican",
  account: "barbican.uz",
  avatar: "images/smm/barbican/brand/avatar.webp",
  startSpeed: 0.5,
  openable: true,
  mix: ["9x16"],   // 2026-11-17: Reels и Stories при каждом открытии в новом порядке: свежие вперёд, соседи разные по цвету (mixWall в script.js)
};

window.GALLERIES["barbican"] = [
  // ----- 1x1 -----
  { format: "1x1", group: "main", year: "2022", title: "Barbican со льдом · Ноябрь 2022", thumb: "images/smm/barbican/1x1/001-thumb.webp", full: "images/smm/barbican/1x1/001.webp" },
  { format: "1x1", group: "main", year: "2022", title: "Фруктовые вкусы Barbican · Ноябрь 2022", thumb: "images/smm/barbican/1x1/002-thumb.webp", full: "images/smm/barbican/1x1/002.webp" },
  { format: "1x1", group: "main", year: "2022", title: "Безалкогольные солодовые напитки Barbican · Октябрь 2022", thumb: "images/smm/barbican/1x1/003-thumb.webp", full: "images/smm/barbican/1x1/003.webp" },
  { format: "1x1", group: "main", year: "2022", title: "8 видов напитка Barbican в Ташкенте · Октябрь 2022", thumb: "images/smm/barbican/1x1/004-thumb.webp", full: "images/smm/barbican/1x1/004.webp" },
  { format: "1x1", group: "main", year: "2022", title: "Напитки Barbican для тех, кто ценит натуральность · Октябрь 2022", thumb: "images/smm/barbican/1x1/005-thumb.webp", full: "images/smm/barbican/1x1/005.webp" },
  { format: "1x1", group: "main", year: "2022", title: "Натуральные безалкогольные напитки Barbican · Октябрь 2022", thumb: "images/smm/barbican/1x1/006-thumb.webp", full: "images/smm/barbican/1x1/006.webp" },
  { format: "1x1", group: "main", year: "2022", title: "Ищите в сети Korzinka.uz · Октябрь 2022", thumb: "images/smm/barbican/1x1/007-thumb.webp", full: "images/smm/barbican/1x1/007.webp" },
  { format: "1x1", group: "main", year: "2022", title: "Barbican – солодовый напиток из ОАЭ · Сентябрь 2022", thumb: "images/smm/barbican/1x1/009-thumb.webp", full: "images/smm/barbican/1x1/009.webp" },
  // ----- 9x16 -----
  { format: "9x16", group: "main", year: "2022", title: "Вкус: Ананас · Ноябрь 2022", thumb: "images/smm/barbican/9x16/001-thumb.webp", full: "images/smm/barbican/9x16/001.webp", c: "#a3bc87" },
  { format: "9x16", group: "main", year: "2022", title: "Вкус: Гранат · Ноябрь 2022", thumb: "images/smm/barbican/9x16/002-thumb.webp", full: "images/smm/barbican/9x16/002.webp", c: "#d6b6ab" },
  { format: "9x16", group: "main", year: "2022", title: "Вкус: Клубника · Ноябрь 2022", thumb: "images/smm/barbican/9x16/003-thumb.webp", full: "images/smm/barbican/9x16/003.webp", c: "#ab9593" },
  { format: "9x16", group: "main", year: "2022", title: "Вкус: Лимон · Ноябрь 2022", thumb: "images/smm/barbican/9x16/004-thumb.webp", full: "images/smm/barbican/9x16/004.webp", c: "#d3bd32" },
  { format: "9x16", group: "main", year: "2022", title: "Вкус: Малина · Ноябрь 2022", thumb: "images/smm/barbican/9x16/005-thumb.webp", full: "images/smm/barbican/9x16/005.webp", c: "#b68575" },
  { format: "9x16", group: "main", year: "2022", title: "Вкус: Персик · Ноябрь 2022", thumb: "images/smm/barbican/9x16/006-thumb.webp", full: "images/smm/barbican/9x16/006.webp", c: "#cb7a4e" },
  { format: "9x16", group: "main", year: "2022", title: "Вкус: Солод · Ноябрь 2022", thumb: "images/smm/barbican/9x16/007-thumb.webp", full: "images/smm/barbican/9x16/007.webp", c: "#9acdb3" },
  { format: "9x16", group: "main", year: "2022", title: "Вкус: Яблоко · Ноябрь 2022", thumb: "images/smm/barbican/9x16/008-thumb.webp", full: "images/smm/barbican/9x16/008.webp", c: "#70a42f" },
  { format: "9x16", group: "main", year: "2022", title: "Натуральные безалкогольные напитки Barbican · сторис · Октябрь 2022", thumb: "images/smm/barbican/9x16/009-thumb.webp", full: "images/smm/barbican/9x16/009.webp", c: "#288397" },
  { format: "9x16", group: "main", year: "2022", title: "Ищите в сети Korzinka.uz · сторис · Октябрь 2022", thumb: "images/smm/barbican/9x16/010-thumb.webp", full: "images/smm/barbican/9x16/010.webp", c: "#cecba8" },
  { format: "9x16", group: "main", year: "2022", title: "Покупайте в Uzum Market! · сторис · слайд 1 · Октябрь 2022", thumb: "images/smm/barbican/9x16/011-thumb.webp", full: "images/smm/barbican/9x16/011.webp", c: "#c7ac88" },
  { format: "9x16", group: "main", year: "2022", title: "Покупайте в Uzum Market! · сторис · слайд 2 · Октябрь 2022", thumb: "images/smm/barbican/9x16/012-thumb.webp", full: "images/smm/barbican/9x16/012.webp", c: "#c7ad88" },
  // ----- highlights -----
  { format: "highlights", group: "covers", year: "2022", title: "Ассортимент · Октябрь 2022", thumb: "images/smm/barbican/highlights/001-thumb.webp", full: "images/smm/barbican/highlights/001.webp" },
  { format: "highlights", group: "covers", year: "2022", title: "Контакты · Октябрь 2022", thumb: "images/smm/barbican/highlights/002-thumb.webp", full: "images/smm/barbican/highlights/002.webp" },
  { format: "highlights", group: "covers", year: "2022", title: "О компании · Октябрь 2022", thumb: "images/smm/barbican/highlights/003-thumb.webp", full: "images/smm/barbican/highlights/003.webp" },
  { format: "highlights", group: "covers", year: "2022", title: "Отзывы · Октябрь 2022", thumb: "images/smm/barbican/highlights/004-thumb.webp", full: "images/smm/barbican/highlights/004.webp" },
  { format: "highlights", group: "covers", year: "2022", title: "Halol · Октябрь 2022", thumb: "images/smm/barbican/highlights/005-thumb.webp", full: "images/smm/barbican/highlights/005.webp" },
];
