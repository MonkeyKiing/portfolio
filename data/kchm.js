/* ==========================================================================
   ДАННЫЕ ГАЛЕРЕИ: KCHM Group (SMM)
   Картинки сжаты для сайта из исходников (папка F:\Claude CODE\PORTFOLIO\KCHM\SMM).
   Поля работы:
     format — вкладка галереи: "1x1" (посты 1:1), "4x5" (посты 4:5), "9x16" (Reels и Stories), "highlights" (Актуальные)
     group  — группа внутри вкладки: "main" или "covers" (обложки актуальных)
     title  — подпись; thumb — превью для сетки; full — большая картинка для просмотра
   ПОРЯДОК В ФАЙЛЕ = ПОРЯДОК НА САЙТЕ. Похожие темы специально перемешаны.
   ========================================================================== */
window.GALLERIES = window.GALLERIES || {};

// Группы внутри вкладок: отсюда просмотр узнаёт пропорции обложек актуальных
window.GALLERY_GROUPS = window.GALLERY_GROUPS || {};
window.GALLERY_GROUPS["kchm"] = {
  covers: { title: "Обложки 9:16", ratio: "9x16" },
};

// Интерфейс Instagram в большом просмотре работы. Всё здесь — рыба, кроме названия и аватара.
// Лайки и номера комментариев считаются в script.js (раздел 13а), у каждой работы они свои и не меняются
window.GALLERY_INSTAGRAM = window.GALLERY_INSTAGRAM || {};
window.GALLERY_INSTAGRAM["kchm"] = {
  account: "kchm.uz",
  avatar: "images/smm/kchm/brand/avatar.svg",
  location: "Узбекистан",
  music: "kchm.uz · Оригинальная аудиодорожка",
  captionText: "Спецтехника и грузовики — в KCHM Group.",
  tags: "#kchmgroup #спецтехника",
  groups: window.GALLERY_GROUPS["kchm"],
  people: ["aziz_t", "sardor.uz", "timur_r", "anvar_07", "bekzod.stroy", "rustam_k", "jasur.logistic", "dilshod_88", "ulugbek.t", "shavkat_a"],
  comments: [
    "Какая мощная техника!",
    "А сколько стоит?",
    "Есть лизинг на этот срок?",
    "Нужен такой на объект",
    "Уже купили, очень довольны",
    "В каком филиале можно посмотреть?",
    "Отличная цена, спасибо!",
    "Рахмат!",
    "Есть в наличии?",
    "Завтра подъеду посмотреть",
    "Подскажите, сервис у вас есть?",
    "Как всегда на высоте 👍",
  ],
};

// Вкладки 9:16 и Актуальные открываются отдельным окном. openable — карточки без интерфейса,
// по клику работа открывается большой. startSpeed — скорость при открытии окна
window.GALLERY_WALL = window.GALLERY_WALL || {};
window.GALLERY_WALL["kchm"] = {
  formats: ["9x16", "highlights"],
  modes: { "highlights": "lens" },   // «Актуальные» — ряды с кружком, 9:16 — колонки
  brand: "KCHM Group",
  account: "kchm.uz",
  avatar: "images/smm/kchm/brand/avatar.svg",
  startSpeed: 0.5,
  openable: true,
  mix: ["9x16"],   // 2026-11-17: Reels и Stories при каждом открытии в новом порядке: свежие вперёд, соседи разные по цвету (mixWall в script.js)
};

window.GALLERIES["kchm"] = [
  // ----- 1x1 -----
  { format: "1x1", group: "main", year: "2023", title: "Афиша футбольного матча · Август 2023", thumb: "images/smm/kchm/1x1/001-thumb.webp", full: "images/smm/kchm/1x1/001.webp" },
  { format: "1x1", group: "main", year: "2022", title: "Гусеничный экскаватор в лизинг · Сентябрь 2022", thumb: "images/smm/kchm/1x1/002-thumb.webp", full: "images/smm/kchm/1x1/002.webp" },
  { format: "1x1", group: "main", year: "2023", title: "Навруз · Март 2023", thumb: "images/smm/kchm/1x1/003-thumb.webp", full: "images/smm/kchm/1x1/003.webp" },
  { format: "1x1", group: "main", year: "2022", title: "Фронтальный погрузчик в лизинг · Декабрь 2022", thumb: "images/smm/kchm/1x1/004-thumb.webp", full: "images/smm/kchm/1x1/004.webp" },
  { format: "1x1", group: "main", year: "2022", title: "Спецтехника в лизинг · Сентябрь 2022", thumb: "images/smm/kchm/1x1/005-thumb.webp", full: "images/smm/kchm/1x1/005.webp" },
  { format: "1x1", group: "main", year: "2023", title: "День независимости · Сентябрь 2023", thumb: "images/smm/kchm/1x1/006-thumb.webp", full: "images/smm/kchm/1x1/006.webp" },
  { format: "1x1", group: "main", year: "2022", title: "Двухвальцовый каток в лизинг · Сентябрь 2022", thumb: "images/smm/kchm/1x1/007-thumb.webp", full: "images/smm/kchm/1x1/007.webp" },
  // 2026-11-22 (его просьба): на месте 008 (автогрейдер, декабрь 2022) — вакансия из кейса «Бренды 360°» KCHM; дата поста неизвестна, год не ставлю
  { format: "1x1", group: "main", year: "", title: "Вакансия: бухгалтер-кассир", thumb: "images/smm/kchm/1x1/031-thumb.webp", full: "images/smm/kchm/1x1/031.webp" },
  { format: "1x1", group: "main", year: "2023", title: "Рамазан · Март 2023", thumb: "images/smm/kchm/1x1/009-thumb.webp", full: "images/smm/kchm/1x1/009.webp" },
  { format: "1x1", group: "main", year: "2022", title: "Спецтехника в лизинг · Сентябрь 2022", thumb: "images/smm/kchm/1x1/010-thumb.webp", full: "images/smm/kchm/1x1/010.webp" },
  { format: "1x1", group: "main", year: "2023", title: "Газовый тягач Howo T7 · Август 2023", thumb: "images/smm/kchm/1x1/011-thumb.webp", full: "images/smm/kchm/1x1/011.webp" },
  { format: "1x1", group: "main", year: "2022", title: "Бульдозер в лизинг · Сентябрь 2022", thumb: "images/smm/kchm/1x1/012-thumb.webp", full: "images/smm/kchm/1x1/012.webp" },
  { format: "1x1", group: "main", year: "2023", title: "Курбан-хайит · Июнь 2023", thumb: "images/smm/kchm/1x1/013-thumb.webp", full: "images/smm/kchm/1x1/013.webp" },
  { format: "1x1", group: "main", year: "2022", title: "Гусеничный экскаватор в лизинг · Декабрь 2022", thumb: "images/smm/kchm/1x1/014-thumb.webp", full: "images/smm/kchm/1x1/014.webp" },
  { format: "1x1", group: "main", year: "2022", title: "Спецтехника в лизинг · Сентябрь 2022", thumb: "images/smm/kchm/1x1/015-thumb.webp", full: "images/smm/kchm/1x1/015.webp" },
  { format: "1x1", group: "main", year: "2023", title: "9 Мая · Май 2023", thumb: "images/smm/kchm/1x1/016-thumb.webp", full: "images/smm/kchm/1x1/016.webp" },
  { format: "1x1", group: "main", year: "2022", title: "Фронтальный погрузчик в лизинг · Сентябрь 2022", thumb: "images/smm/kchm/1x1/017-thumb.webp", full: "images/smm/kchm/1x1/017.webp" },
  { format: "1x1", group: "main", year: "2022", title: "Двухвальцовый каток в лизинг · Декабрь 2022", thumb: "images/smm/kchm/1x1/018-thumb.webp", full: "images/smm/kchm/1x1/018.webp" },
  { format: "1x1", group: "main", year: "2023", title: "День Конституции · Ноябрь 2023", thumb: "images/smm/kchm/1x1/019-thumb.webp", full: "images/smm/kchm/1x1/019.webp" },
  { format: "1x1", group: "main", year: "2022", title: "Спецтехника в лизинг · Сентябрь 2022", thumb: "images/smm/kchm/1x1/020-thumb.webp", full: "images/smm/kchm/1x1/020.webp" },
  { format: "1x1", group: "main", year: "2022", title: "Автогрейдер в лизинг · Сентябрь 2022", thumb: "images/smm/kchm/1x1/021-thumb.webp", full: "images/smm/kchm/1x1/021.webp" },
  { format: "1x1", group: "main", year: "2023", title: "Ийд аль-Фитр · Апрель 2023", thumb: "images/smm/kchm/1x1/022-thumb.webp", full: "images/smm/kchm/1x1/022.webp" },
  { format: "1x1", group: "main", year: "2022", title: "Бульдозер в лизинг · Декабрь 2022", thumb: "images/smm/kchm/1x1/023-thumb.webp", full: "images/smm/kchm/1x1/023.webp" },
  { format: "1x1", group: "main", year: "2022", title: "Гусеничный экскаватор в лизинг · Сентябрь 2022", thumb: "images/smm/kchm/1x1/024-thumb.webp", full: "images/smm/kchm/1x1/024.webp" },
  { format: "1x1", group: "main", year: "2023", title: "Рамазан · Март 2023", thumb: "images/smm/kchm/1x1/025-thumb.webp", full: "images/smm/kchm/1x1/025.webp" },
  { format: "1x1", group: "main", year: "2022", title: "Спецтехника в лизинг · Сентябрь 2022", thumb: "images/smm/kchm/1x1/026-thumb.webp", full: "images/smm/kchm/1x1/026.webp" },
  { format: "1x1", group: "main", year: "2022", title: "Двухвальцовый каток в лизинг · Сентябрь 2022", thumb: "images/smm/kchm/1x1/027-thumb.webp", full: "images/smm/kchm/1x1/027.webp" },
  // 2026-11-22 (его просьба): на месте 028 (бульдозер на узбекском, сентябрь 2022) — вторая вакансия из «Бренды 360°» KCHM
  { format: "1x1", group: "main", year: "", title: "Вакансия: менеджер по продажам", thumb: "images/smm/kchm/1x1/032-thumb.webp", full: "images/smm/kchm/1x1/032.webp" },

  // ----- 4x5 -----
  { format: "4x5", group: "main", year: "2024", title: "Гидромолоты · Июнь 2024", thumb: "images/smm/kchm/4x5/001-thumb.webp", full: "images/smm/kchm/4x5/001.webp" },
  { format: "4x5", group: "main", year: "2024", title: "Рассылка: LiuGong CLG855H · Январь 2024", thumb: "images/smm/kchm/4x5/002-thumb.webp", full: "images/smm/kchm/4x5/002.webp" },
  { format: "4x5", group: "main", year: "2024", title: "Цементовоз · Июнь 2024", thumb: "images/smm/kchm/4x5/003-thumb.webp", full: "images/smm/kchm/4x5/003.webp" },
  { format: "4x5", group: "main", year: "2024", title: "Рассылка: LiuGong CLG922E · Январь 2024", thumb: "images/smm/kchm/4x5/004-thumb.webp", full: "images/smm/kchm/4x5/004.webp" },
  { format: "4x5", group: "main", year: "2024", title: "Привезём тягачи за 10 дней · Май 2024", thumb: "images/smm/kchm/4x5/005-thumb.webp", full: "images/smm/kchm/4x5/005.webp" },
  { format: "4x5", group: "main", year: "2024", title: "Рассылка: LiuGong CLG925E · Январь 2024", thumb: "images/smm/kchm/4x5/006-thumb.webp", full: "images/smm/kchm/4x5/006.webp" },
  { format: "4x5", group: "main", year: "2024", title: "9 Мая · Май 2024", thumb: "images/smm/kchm/4x5/007-thumb.webp", full: "images/smm/kchm/4x5/007.webp" },
  { format: "4x5", group: "main", year: "2024", title: "Рассылка: LiuGong CLG4180D · Январь 2024", thumb: "images/smm/kchm/4x5/008-thumb.webp", full: "images/smm/kchm/4x5/008.webp" },
  { format: "4x5", group: "main", year: "2024", title: "Бесплатная диагностика спецтехники · Май 2024", thumb: "images/smm/kchm/4x5/009-thumb.webp", full: "images/smm/kchm/4x5/009.webp" },
  { format: "4x5", group: "main", year: "2024", title: "Рассылка: LiuGong CLG6208E · Январь 2024", thumb: "images/smm/kchm/4x5/010-thumb.webp", full: "images/smm/kchm/4x5/010.webp" },
  { format: "4x5", group: "main", year: "2024", title: "Подарочный ваучер · Июль 2024", thumb: "images/smm/kchm/4x5/011-thumb.webp", full: "images/smm/kchm/4x5/011.webp" },
  { format: "4x5", group: "main", year: "2024", title: "Рассылка: автокран LiuGong · Январь 2024", thumb: "images/smm/kchm/4x5/012-thumb.webp", full: "images/smm/kchm/4x5/012.webp" },
  { format: "4x5", group: "main", year: "2024", title: "День независимости · Сентябрь 2024", thumb: "images/smm/kchm/4x5/013-thumb.webp", full: "images/smm/kchm/4x5/013.webp" },
  { format: "4x5", group: "main", year: "2024", title: "Рассылка: самосвал Howo · Январь 2024", thumb: "images/smm/kchm/4x5/014-thumb.webp", full: "images/smm/kchm/4x5/014.webp" },
  { format: "4x5", group: "main", year: "2024", title: "Привезём тягачи за 10 дней · Май 2024", thumb: "images/smm/kchm/4x5/015-thumb.webp", full: "images/smm/kchm/4x5/015.webp" },
  { format: "4x5", group: "main", year: "2024", title: "Рассылка: LiuGong CLG856H · Апрель 2024", thumb: "images/smm/kchm/4x5/016-thumb.webp", full: "images/smm/kchm/4x5/016.webp" },
  { format: "4x5", group: "main", year: "2024", title: "Рассылка: LiuGong 835N · Апрель 2024", thumb: "images/smm/kchm/4x5/017-thumb.webp", full: "images/smm/kchm/4x5/017.webp" },
  { format: "4x5", group: "main", year: "2024", title: "Рассылка: LiuGong CLG6114E · Апрель 2024", thumb: "images/smm/kchm/4x5/018-thumb.webp", full: "images/smm/kchm/4x5/018.webp" },
  { format: "4x5", group: "main", year: "2024", title: "Рассылка: LiuGong 840H · Апрель 2024", thumb: "images/smm/kchm/4x5/019-thumb.webp", full: "images/smm/kchm/4x5/019.webp" },
  { format: "4x5", group: "main", year: "2024", title: "Рассылка: LiuGong 855 · Апрель 2024", thumb: "images/smm/kchm/4x5/020-thumb.webp", full: "images/smm/kchm/4x5/020.webp" },

  // ----- 9x16 -----
  { format: "9x16", group: "main", year: "2024", title: "Обзор экскаватора 925 · Август 2024", thumb: "images/smm/kchm/9x16/001-thumb.webp", full: "images/smm/kchm/9x16/001.webp", c: "#7c8986" },
  { format: "9x16", group: "main", year: "2024", title: "Видеоотзыв · Май 2024", thumb: "images/smm/kchm/9x16/002-thumb.webp", full: "images/smm/kchm/9x16/002.webp", c: "#5b7971" },
  { format: "9x16", group: "main", year: "2024", title: "Подарочный ваучер · Июль 2024", thumb: "images/smm/kchm/9x16/003-thumb.webp", full: "images/smm/kchm/9x16/003.webp", c: "#92893b" },
  { format: "9x16", group: "main", year: "2024", title: "Обзор катка · Июнь 2024", thumb: "images/smm/kchm/9x16/004-thumb.webp", full: "images/smm/kchm/9x16/004.webp", c: "#83a1a2" },
  { format: "9x16", group: "main", year: "2024", title: "Ремонт стрелы бетононасоса · Июль 2024", thumb: "images/smm/kchm/9x16/005-thumb.webp", full: "images/smm/kchm/9x16/005.webp", c: "#b0b5b2" },
  { format: "9x16", group: "main", year: "2024", title: "Сравнение гидромолотов · Июнь 2024", thumb: "images/smm/kchm/9x16/006-thumb.webp", full: "images/smm/kchm/9x16/006.webp", c: "#ba8377" },
  { format: "9x16", group: "main", year: "2024", title: "Тягач А7 · Май 2024", thumb: "images/smm/kchm/9x16/007-thumb.webp", full: "images/smm/kchm/9x16/007.webp", c: "#92aeb1" },
  { format: "9x16", group: "main", year: "2024", title: "Ремонт ковша · Сентябрь 2024", thumb: "images/smm/kchm/9x16/008-thumb.webp", full: "images/smm/kchm/9x16/008.webp", c: "#5e5c52" },
  { format: "9x16", group: "main", year: "2024", title: "Обзор фронтального погрузчика · Август 2024", thumb: "images/smm/kchm/9x16/009-thumb.webp", full: "images/smm/kchm/9x16/009.webp", c: "#b0b4b2" },
  { format: "9x16", group: "main", year: "2024", title: "Курбан-хайит · Июнь 2024", thumb: "images/smm/kchm/9x16/010-thumb.webp", full: "images/smm/kchm/9x16/010.webp", c: "#ced2cf" },
  { format: "9x16", group: "main", year: "2024", title: "Корейская техника в наличии · Июль 2024", thumb: "images/smm/kchm/9x16/011-thumb.webp", full: "images/smm/kchm/9x16/011.webp", c: "#8ca0a5" },
  { format: "9x16", group: "main", year: "2024", title: "Отзыв клиента · Сентябрь 2024", thumb: "images/smm/kchm/9x16/012-thumb.webp", full: "images/smm/kchm/9x16/012.webp", c: "#9f9e9d" },
  { format: "9x16", group: "main", year: "2024", title: "Полуприцеп · Август 2024", thumb: "images/smm/kchm/9x16/013-thumb.webp", full: "images/smm/kchm/9x16/013.webp", c: "#4e6f72" },
  { format: "9x16", group: "main", year: "2024", title: "Запчасти · Июнь 2024", thumb: "images/smm/kchm/9x16/014-thumb.webp", full: "images/smm/kchm/9x16/014.webp", c: "#df9e12" },
  { format: "9x16", group: "main", year: "2024", title: "Экскаватор на 42 тонны · Сентябрь 2024", thumb: "images/smm/kchm/9x16/015-thumb.webp", full: "images/smm/kchm/9x16/015.webp", c: "#a39d90" },
  { format: "9x16", group: "main", year: "2024", title: "Сервис · Июль 2024", thumb: "images/smm/kchm/9x16/016-thumb.webp", full: "images/smm/kchm/9x16/016.webp", c: "#78998f" },
  { format: "9x16", group: "main", year: "2024", title: "Сравнение фронтальных погрузчиков · Май 2024", thumb: "images/smm/kchm/9x16/017-thumb.webp", full: "images/smm/kchm/9x16/017.webp", c: "#b9aa8f" },
  { format: "9x16", group: "main", year: "2024", title: "Ремонт гидроцилиндра экскаватора · Август 2024", thumb: "images/smm/kchm/9x16/018-thumb.webp", full: "images/smm/kchm/9x16/018.webp", c: "#c1907c" },
  { format: "9x16", group: "main", year: "2024", title: "Тягач и полуприцеп · Июль 2024", thumb: "images/smm/kchm/9x16/019-thumb.webp", full: "images/smm/kchm/9x16/019.webp", c: "#7b99b3" },
  { format: "9x16", group: "main", year: "2024", title: "Отгрузка фронтального погрузчика · Май 2024", thumb: "images/smm/kchm/9x16/020-thumb.webp", full: "images/smm/kchm/9x16/020.webp", c: "#909fa2" },
  { format: "9x16", group: "main", year: "2024", title: "Переход в Telegram · Июль 2024", thumb: "images/smm/kchm/9x16/021-thumb.webp", full: "images/smm/kchm/9x16/021.webp", c: "#8abdc0" },
  { format: "9x16", group: "main", year: "2024", title: "Обзор 6516E · Сентябрь 2024", thumb: "images/smm/kchm/9x16/022-thumb.webp", full: "images/smm/kchm/9x16/022.webp", c: "#929689" },
  { format: "9x16", group: "main", year: "2024", title: "Сервис: отзыв клиента · Июль 2024", thumb: "images/smm/kchm/9x16/023-thumb.webp", full: "images/smm/kchm/9x16/023.webp", c: "#928579" },
  { format: "9x16", group: "main", year: "2024", title: "Экскаватор-погрузчик · Июнь 2024", thumb: "images/smm/kchm/9x16/024-thumb.webp", full: "images/smm/kchm/9x16/024.webp", c: "#567b89" },
  { format: "9x16", group: "main", year: "2024", title: "Ремонт стрелы бетононасоса · Май 2024", thumb: "images/smm/kchm/9x16/025-thumb.webp", full: "images/smm/kchm/9x16/025.webp", c: "#a79f9d" },
  { format: "9x16", group: "main", year: "2024", title: "Обзор экскаватора · Август 2024", thumb: "images/smm/kchm/9x16/026-thumb.webp", full: "images/smm/kchm/9x16/026.webp", c: "#a2b0ae" },
  { format: "9x16", group: "main", year: "2024", title: "Техника в наличии · Июль 2024", thumb: "images/smm/kchm/9x16/027-thumb.webp", full: "images/smm/kchm/9x16/027.webp", c: "#b4b6a9" },
  { format: "9x16", group: "main", year: "2024", title: "Сравнение экскаваторов-погрузчиков · Сентябрь 2024", thumb: "images/smm/kchm/9x16/028-thumb.webp", full: "images/smm/kchm/9x16/028.webp", c: "#7b706c" },
  { format: "9x16", group: "main", year: "2024", title: "Обзор трала · Май 2024", thumb: "images/smm/kchm/9x16/029-thumb.webp", full: "images/smm/kchm/9x16/029.webp", c: "#c0b2ab" },
  { format: "9x16", group: "main", year: "2024", title: "Ремонт гидромолота · Сентябрь 2024", thumb: "images/smm/kchm/9x16/030-thumb.webp", full: "images/smm/kchm/9x16/030.webp", c: "#979385" },
  { format: "9x16", group: "main", year: "2024", title: "Обзор фронтального погрузчика · Август 2024", thumb: "images/smm/kchm/9x16/031-thumb.webp", full: "images/smm/kchm/9x16/031.webp", c: "#9aaab3" },
  { format: "9x16", group: "main", year: "2024", title: "Видео с сервиса · Июль 2024", thumb: "images/smm/kchm/9x16/032-thumb.webp", full: "images/smm/kchm/9x16/032.webp", c: "#d6c5a3" },
  { format: "9x16", group: "main", year: "2024", title: "Обзор А7 · Июнь 2024", thumb: "images/smm/kchm/9x16/033-thumb.webp", full: "images/smm/kchm/9x16/033.webp", c: "#798e98" },
  { format: "9x16", group: "main", year: "2024", title: "Отзыв клиента · Сентябрь 2024", thumb: "images/smm/kchm/9x16/034-thumb.webp", full: "images/smm/kchm/9x16/034.webp", c: "#857463" },
  { format: "9x16", group: "main", year: "2024", title: "Обзор 922ELL · Сентябрь 2024", thumb: "images/smm/kchm/9x16/035-thumb.webp", full: "images/smm/kchm/9x16/035.webp", c: "#7c867a" },
  { format: "9x16", group: "main", year: "2024", title: "Обзор экскаватора-погрузчика · Сентябрь 2024", thumb: "images/smm/kchm/9x16/036-thumb.webp", full: "images/smm/kchm/9x16/036.webp", c: "#c6c2b9" },
  // ----- Актуальные: синие и оранжевые обложки чередуются -----
  { format: "highlights", group: "covers", year: "2023", title: "Погрузчик · Февраль 2023", thumb: "images/smm/kchm/highlights/001-thumb.webp", full: "images/smm/kchm/highlights/001.webp" },
  { format: "highlights", group: "covers", year: "2023", title: "Фото · Февраль 2023", thumb: "images/smm/kchm/highlights/002-thumb.webp", full: "images/smm/kchm/highlights/002.webp" },
  { format: "highlights", group: "covers", year: "2023", title: "Экскаватор · Февраль 2023", thumb: "images/smm/kchm/highlights/003-thumb.webp", full: "images/smm/kchm/highlights/003.webp" },
  { format: "highlights", group: "covers", year: "2023", title: "Сервис · Февраль 2023", thumb: "images/smm/kchm/highlights/004-thumb.webp", full: "images/smm/kchm/highlights/004.webp" },
  { format: "highlights", group: "covers", year: "2023", title: "Автокран · Февраль 2023", thumb: "images/smm/kchm/highlights/005-thumb.webp", full: "images/smm/kchm/highlights/005.webp" },
  { format: "highlights", group: "covers", year: "2023", title: "Спорт · Февраль 2023", thumb: "images/smm/kchm/highlights/006-thumb.webp", full: "images/smm/kchm/highlights/006.webp" },
  { format: "highlights", group: "covers", year: "2023", title: "Самосвал · Февраль 2023", thumb: "images/smm/kchm/highlights/007-thumb.webp", full: "images/smm/kchm/highlights/007.webp" },
  { format: "highlights", group: "covers", year: "2023", title: "KCHM · Февраль 2023", thumb: "images/smm/kchm/highlights/008-thumb.webp", full: "images/smm/kchm/highlights/008.webp" },
  { format: "highlights", group: "covers", year: "2023", title: "Вилочный погрузчик · Февраль 2023", thumb: "images/smm/kchm/highlights/009-thumb.webp", full: "images/smm/kchm/highlights/009.webp" },
  { format: "highlights", group: "covers", year: "2023", title: "Автогрейдер · Февраль 2023", thumb: "images/smm/kchm/highlights/010-thumb.webp", full: "images/smm/kchm/highlights/010.webp" },
  { format: "highlights", group: "covers", year: "2023", title: "Бетоносмеситель · Февраль 2023", thumb: "images/smm/kchm/highlights/011-thumb.webp", full: "images/smm/kchm/highlights/011.webp" },
  { format: "highlights", group: "covers", year: "2023", title: "Каток · Февраль 2023", thumb: "images/smm/kchm/highlights/012-thumb.webp", full: "images/smm/kchm/highlights/012.webp" },
];
