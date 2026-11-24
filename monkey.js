/* ==========================================================================
   ОБЕЗЬЯНКА — маленький персонаж, который сопровождает гостя по всему сайту.
   v3 2026-11-16: покадровая анимация из его листов Nano Banana (Обезьянка\004 — 007).
   v4 2026-11-16: ещё 14 листов (Обезьянка\010 — 023): моргание, испуг, злость, усталость, ровный бег,
   поймали за хвост, висит на руках и на хвосте, кунг-фу, посох, сон на подушке и на лиане, банан,
   показывает, машет со спины, выглядывает из-за края.
   Правила — Обезьянка\ПРАВИЛА обезьянки.md (читать перед правками).

   Как устроено:
   — FR — таблица кадров: размер картинки, ax — центр короны по ширине (голова не прыгает при смене
     кадра), ay — линия земли по высоте; у висящих кадров ay — линия, за которую держится.
   — Опоры — только то, что видно глазом: края картинок, кнопок, карточек; верх букв крупных
     заголовков; плоскости на фото в шапке (голова, плечо, рука, нога парня, кроссовок, мышь);
     линии-переходы между секциями (по ним бегает и на них висит, как на лиане).
   — Далеко перемещается — ныряет за картинку и выныривает из-за другой (сначала выглядывает).
   Картинки — images/monkey/v3/ (банан и пыль — images/monkey/). Стили — monkey.css.
   Выключить совсем — CFG.enabled = false.
   ========================================================================== */
(() => {
  "use strict";

  /* ---------- Настройки ---------- */
  const CFG = {
    enabled: true,
    height: 134,              // рост на компьютере, px (было 168 — он попросил на 20% меньше, 2026-11-16)
    heightMobile: 80,         // рост на телефоне (было 100)
    runSpeed: 300,            // скорость бега, px в секунду
    fearRadius: 150,          // курсор ближе — убегает
    tiredAfter: 6,            // столько раз убежала за 25 секунд — устала, можно ловить (на телефоне — 3 касания)
    tiredFor: 4500,           // сколько миллисекунд «устала» и не убегает
    idleTricks: 6000,         // гость ничего не делает столько мс — развлекается сама
    sleepAfter: 32000,        // гость ничего не делает столько мс — засыпает
    hideFrom: 520,            // дальше этого расстояния — прячется за картинку и выныривает из-за другой
    sound: true,              // тихие звуки: бросок банана, удары, писк
    volume: 0.08,
    // Лучшие работы: на них она показывает
    favorites: [
      '[data-category="smm"]', '[data-category="packaging"]', '[data-category="branding"]',
      '[data-open-case="ritos"]', '[data-open-case="taxtaniyoz"]', '[data-open-case="imperio-clinic"]',
      '[data-open-case="taqachi-food"]', '[data-open-case="home-market"]', '[data-open-case="kchm"]',
      '[data-open-case="dafna"]',
    ],
    // Кнопки «в разработке»: прыгает по ним, они не работают — злится и стучит посохом
    stubborn: '.work-card--soon, .case-tile--soon',
    // Карточка Game «в разработке»: сценка с дверью — только на её нижнем крае и больше нигде (он показал, 2026-11-17)
    gameCard: '.work-card--soon[data-category="game"]',
    // Заголовки, по верху букв которых она бегает (крупнее glyphMin px)
    glyphs: "h1, h2",
    glyphMin: 40,
    // Плоскости внутри картинок: [x0, x1, y] в долях картинки (как она лежит в файле).
    // Шапка: парень на огромной мыши (images/about/hero.webp, 2538×1039) — проверено по сетке.
    planes: [
      { sel: ".hero__photo", pts: [
        [0.646, 0.676, 0.110],   // макушка
        [0.668, 0.698, 0.275],   // плечо
        [0.612, 0.650, 0.300],   // рука на колене
        [0.620, 0.665, 0.585],   // бедро
        [0.522, 0.556, 0.565],   // кроссовок на мыши
        [0.560, 0.605, 0.615],   // мышь перед ним
        [0.695, 0.745, 0.615],   // мышь за ним
        [0.475, 0.510, 0.700],   // нос мыши
      ] },
    ],
  };
  if (!CFG.enabled) return;

  /* ---------- Кадры (все смотрят вправо; влево — зеркально) ---------- */
  // 2026-11-17 (он нашёл зазоры над краем): ay у всех стоящих кадров = нижний непрозрачный ряд ступней (замер feet.cs по всем PNG).
  // Кадры бега pr*, run*, joy* раньше были на 3–6 px в воздухе — выровнены. Новые кадры мерить так же, зазор над опорой — 0 px
  const FR = {
    // анфас с морганием (лист 5) и поворот (лист 4): 3/4, профиль, 3/4 со спины, спина
    stand:     { w: 165, h: 294, ax: 0.555, ay: 0.989 },
    blink:     { w: 165, h: 294, ax: 0.555, ay: 0.989 },
    blinkHalf: { w: 165, h: 294, ax: 0.555, ay: 0.989 },
    front34: { w: 182, h: 283, ax: 0.601, ay: 0.991 },
    side:    { w: 155, h: 285, ax: 0.601, ay: 0.991 },
    back34:  { w: 195, h: 276, ax: 0.41, ay: 0.993 },
    back:    { w: 190, h: 279, ax: 0.586, ay: 0.991 },
    // реакции анфас: испуг, злость, устала
    scared: { w: 159, h: 292, ax: 0.544, ay: 0.989 },
    angry:  { w: 160, h: 293, ax: 0.504, ay: 0.989 },
    tired:  { w: 183, h: 255, ax: 0.807, ay: 0.987 },
    // бег боком (лист 7) и радостный бег с закрытыми глазами (лист 6)
    run1: { w: 228, h: 287, ax: 0.659, ay: 0.979 }, run2: { w: 227, h: 292, ax: 0.66, ay: 0.981 },
    run3: { w: 192, h: 279, ax: 0.601, ay: 0.982 }, run4: { w: 222, h: 288, ax: 0.657, ay: 0.979 },
    run5: { w: 208, h: 296, ax: 0.685, ay: 0.982 }, run6: { w: 194, h: 280, ax: 0.609, ay: 0.979 },
    joy1: { w: 201, h: 289, ax: 0.606, ay: 0.979 }, joy2: { w: 209, h: 301, ax: 0.613, ay: 0.982 },
    joy3: { w: 201, h: 295, ax: 0.602, ay: 0.983 }, joy4: { w: 207, h: 310, ax: 0.599, ay: 0.981 },
    joy5: { w: 212, h: 309, ax: 0.609, ay: 0.982 }, joy6: { w: 200, h: 289, ax: 0.598, ay: 0.983 },
    // прыжок (лист 4): присела, толчок, взлёт, верх, падение
    crouch: { w: 244, h: 282, ax: 0.71, ay: 0.987 },
    push:   { w: 232, h: 310, ax: 0.686, ay: 0.989 },
    rise:   { w: 241, h: 310, ax: 0.594, ay: 0.989 },
    apex:   { w: 209, h: 290, ax: 0.529, ay: 0.987 },
    fall:   { w: 244, h: 302, ax: 0.603, ay: 0.99 },
    // настроение (листы 1 и 3): машет, радуется, «ой», готова, подскок, хохочет, «ого», ура
    wave:  { w: 197, h: 307, ax: 0.6, ay: 0.992 },
    cheer: { w: 214, h: 288, ax: 0.642, ay: 0.99 },
    oops:  { w: 205, h: 279, ax: 0.692, ay: 0.99 },
    ready: { w: 192, h: 273, ax: 0.656, ay: 0.991 },
    hop:   { w: 190, h: 283, ax: 0.528, ay: 0.99 },
    laugh: { w: 239, h: 294, ax: 0.576, ay: 0.989 },
    wow:   { w: 189, h: 277, ax: 0.648, ay: 0.99 },
    yay:   { w: 212, h: 304, ax: 0.51, ay: 0.99 },
    // поймали за хвост (якорь — кончик хвоста), висит на руках и на хвосте (якорь — линия), падает
    tail:      { w: 137, h: 312, ax: 0.526, ay: 0.01, s: 1.3 },
    tailL:     { w: 155, h: 311, ax: 0.549, ay: 0.01, s: 1.3 },
    tailR:     { w: 158, h: 295, ax: 0.429, ay: 0.011, s: 1.3 },
    hangSad:   { w: 131, h: 296, ax: 0.492, ay: 0.04, s: 1.3 },
    hangSwing: { w: 170, h: 283, ax: 0.479, ay: 0.049, s: 1.3 },
    hangSide:  { w: 109, h: 306, ax: 0.52, ay: 0.046, s: 1.3 },
    hangJoy:   { w: 148, h: 255, ax: 0.483, ay: 0.047, s: 1.3 },
    lineTail:  { w: 144, h: 322, ax: 0.503, ay: 0.047, s: 1.3 },
    lineTailL: { w: 177, h: 308, ax: 0.565, ay: 0.04, s: 1.3 },
    lineTailR: { w: 173, h: 287, ax: 0.419, ay: 0.04, s: 1.3 },
    fallScared: { w: 181, h: 221, ax: 0.437, ay: 0.5, s: 1.3 },
    fallYell:   { w: 199, h: 200, ax: 0.302, ay: 0.5, s: 1.3 },
    // кунг-фу (лист 11)
    kfBow:   { w: 199, h: 295, ax: 0.754, ay: 0.987 }, kfStance: { w: 172, h: 278, ax: 0.577, ay: 0.986 },
    kfPunch: { w: 187, h: 294, ax: 0.469, ay: 0.987 }, kfKick:   { w: 180, h: 301, ax: 0.341, ay: 0.987 },
    kfSpin:  { w: 163, h: 296, ax: 0.399, ay: 0.987 }, kfSplit:  { w: 193, h: 272, ax: 0.466, ay: 1.261 },
    kfLand:  { w: 176, h: 282, ax: 0.568, ay: 0.986 },
    // посох (лист 14)
    stStand:  { w: 205, h: 287, ax: 0.46, ay: 0.984 },  stSpin:  { w: 260, h: 317, ax: 0.734, ay: 0.984 },
    stStrike: { w: 291, h: 293, ax: 0.442, ay: 0.983 }, stAngry: { w: 184, h: 269, ax: 0.588, ay: 0.981 },
    stLean:   { w: 180, h: 294, ax: 0.533, ay: 0.983 }, stThrow: { w: 219, h: 348, ax: 0.405, ay: 0.986 },
    stBow:    { w: 258, h: 263, ax: 0.501, ay: 0.981 },
    // сон (листы 15–16): зевает, на подушке (2 кадра дыхания), на лиане (якорь — лиана), проснулась
    yawn:    { w: 241, h: 297, ax: 0.603, ay: 0.983 },
    pillow1: { w: 311, h: 206, ax: 0.197, ay: 0.93 },     // ay вручную: подушка мягкая — чуть проседает, не висит над краем
    pillow2: { w: 310, h: 202, ax: 0.195, ay: 0.93 },
    vine1:   { w: 629, h: 231, ax: 0.37, ay: 0.246, rot: -3.25 },   // ay и rot вручную: оба конца лианы ровно на линии опоры
    vine2:   { w: 492, h: 249, ax: 0.212, ay: 0.333 },               // ay вручную: концы лианы на линии опоры
    wake:    { w: 206, h: 241, ax: 0.5, ay: 0.979 },
    // банан, показывает, машет со спины (листы 17–18)
    point:    { w: 196, h: 296, ax: 0.432, ay: 0.986 },
    backWave: { w: 218, h: 298, ax: 0.39, ay: 0.986 },
    banana:   { w: 202, h: 278, ax: 0.556, ay: 0.983 },
    toss:     { w: 224, h: 276, ax: 0.494, ay: 0.983 },
    eat1:     { w: 158, h: 252, ax: 0.474, ay: 0.983 },
    eat2:     { w: 158, h: 252, ax: 0.477, ay: 0.983 },
    // выглядывает из-за края: голова и руки на краю (якорь — край)
    peekSide: { w: 156, h: 173, ax: 0.474, ay: 0.925 },   // 2026-11-17: ay по низу туловища (рука свисает ниже и ложится на край), иначе туловище висело над краем на 5 px
    peekWave: { w: 186, h: 165, ax: 0.413, ay: 0.978 },
    peek:     { w: 211, h: 177, ax: 0.491, ay: 0.98 },
    peek2:    { w: 211, h: 177, ax: 0.485, ay: 0.98 },
    peekSly:  { w: 212, h: 177, ax: 0.5, ay: 0.98 },
    // ---- листы 19–30 (промпт 024), 2026-11-16. Рост выровнен при нарезке (по белку глаза), поле s не нужно ----
    // сальто (лист 19): ss3 — в группировке, крутится целиком вокруг центра (ay 0.5); ss4 (вниз головой анфас) не взят — не стыкуется с ss3
    ss1: { w: 224, h: 295, ax: 0.708, ay: 0.984 }, ss2: { w: 178, h: 345, ax: 0.526, ay: 0.5 },
    ss3: { w: 216, h: 266, ax: 0.5, ay: 0.5 },     ss5: { w: 243, h: 349, ax: 0.584, ay: 0.5 },
    ss6: { w: 212, h: 264, ax: 0.748, ay: 0.982 }, ss7: { w: 222, h: 301, ax: 0.558, ay: 0.984 },
    // бег строго в профиль (лист 29): один глаз, в экран не смотрит; общая земля ряда
    pr1: { w: 190, h: 289, ax: 0.596, ay: 0.986 }, pr2: { w: 150, h: 290, ax: 0.549, ay: 0.983 },
    pr3: { w: 169, h: 280, ax: 0.549, ay: 0.986 }, pr4: { w: 152, h: 305, ax: 0.549, ay: 0.987 },
    pr5: { w: 141, h: 294, ax: 0.487, ay: 0.986 }, pr6: { w: 147, h: 295, ax: 0.552, ay: 0.978 },
    pr7: { w: 160, h: 288, ax: 0.595, ay: 0.986 }, pr8: { w: 177, h: 297, ax: 0.542, ay: 0.987 },
    // голова кружится, держат за хвост (лист 21: нарисован головой вверх и перевёрнут при нарезке). Якорь — кончик хвоста.
    // dzA — тело отнесло вправо, dzB — влево. Кадр 4 листа (с языком) выброшен
    dz1:     { w: 167, h: 403, ax: 0.482, ay: 0.009 }, dzA: { w: 189, h: 396, ax: 0.385, ay: 0.009 },
    dzB:     { w: 189, h: 396, ax: 0.54, ay: 0.009 },  dzSick: { w: 158, h: 403, ax: 0.478, ay: 0.009 },
    dzAngry: { w: 192, h: 403, ax: 0.489, ay: 0.009 },
    // падение после отпускания (лист 22): кувырок (fl1, fl2), машет руками (fl3), бежит по воздуху (fl4, fl5) — якорь центр;
    // приземлилась (fl6, fl7), трясёт головой (fl8), «ничего не было» (fl9)
    fl1: { w: 306, h: 269, ax: 0.5, ay: 0.5 },     fl2: { w: 265, h: 213, ax: 0.5, ay: 0.5 },
    fl3: { w: 245, h: 304, ax: 0.517, ay: 0.5 },   fl4: { w: 211, h: 283, ax: 0.567, ay: 0.5 },
    fl5: { w: 210, h: 287, ax: 0.575, ay: 0.5 },   fl6: { w: 249, h: 288, ax: 0.519, ay: 0.983 },
    fl7: { w: 249, h: 288, ax: 0.531, ay: 0.983 }, fl8: { w: 191, h: 280, ax: 0.57, ay: 0.983 },
    fl9: { w: 208, h: 291, ax: 0.613, ay: 0.984 },
    // ноутбук (лист 24): несёт, открыла, тычет пальцем, чешет голову, печатает, «ой», закрыла. Ноутбук всегда справа от неё
    lp1: { w: 221, h: 301, ax: 0.571, ay: 0.984 }, lp2: { w: 251, h: 284, ax: 0.508, ay: 0.983 },
    lp3: { w: 248, h: 287, ax: 0.454, ay: 0.983 }, lp4: { w: 249, h: 285, ax: 0.521, ay: 0.983 },
    lp5: { w: 248, h: 286, ax: 0.479, ay: 0.983 }, lp6: { w: 261, h: 283, ax: 0.518, ay: 0.983 },
    lp7: { w: 245, h: 286, ax: 0.504, ay: 0.983 },
    // дверь Game (лист 26), дверь справа от неё: стучит, тянет ручку, заглядывает (спиной), «вау», радуется,
    // отлетела от захлопнутой двери, заглядывает ещё, хохочет у двери, обиделась (сидит), прижалась к двери
    dr1: { w: 225, h: 296, ax: 0.495, ay: 0.982 }, dr2: { w: 218, h: 299, ax: 0.489, ay: 0.983 },
    dr3: { w: 223, h: 294, ax: 0.569, ay: 0.982 }, dr4: { w: 187, h: 296, ax: 0.538, ay: 0.982 },
    dr5: { w: 237, h: 290, ax: 0.553, ay: 0.982 }, dr6: { w: 223, h: 288, ax: 0.5, ay: 0.982 },
    dr7: { w: 226, h: 294, ax: 0.488, ay: 0.982 }, dr8: { w: 212, h: 293, ax: 0.442, ay: 0.982 },
    dr9: { w: 218, h: 274, ax: 0.482, ay: 0.981 }, dr10: { w: 236, h: 296, ax: 0.532, ay: 0.982 },
    // ---- листы 31–36 (промпт 037, по 10–12 кадров), 2026-11-19. Рост по белку глаза, ay — ступни (замер FX6.Feet), ax — центр ступней ----
    // ch — ест чипсы «Кибер-Хруст»; ph — фотограф; ps — расклейщик (плакат лежит на краю в ps5–ps8); vw — садится на край и смотрит
    // (vw3–vw12: ay — линия сиденья, ноги свисают с края; ax — середина попы); vc — сидит по-турецки (vc3–vc7 листа не взяты — переходы с краем);
    // hd — держится при прокрутке (hd3–hd6: ay — линия хвата, перекладина стёрта), встряхивается (hd7–hd10), смотрит вдаль (hd11, hd12)
    ch1: { w: 186, h: 291, ax: 0.557, ay: 0.983 }, ch2: { w: 192, h: 292, ax: 0.523, ay: 0.983 }, ch3: { w: 194, h: 291, ax: 0.531, ay: 0.986 },
    ch4: { w: 208, h: 291, ax: 0.494, ay: 0.979 }, ch5: { w: 203, h: 279, ax: 0.493, ay: 0.982 }, ch6: { w: 202, h: 290, ax: 0.504, ay: 0.983 },
    ch7: { w: 186, h: 285, ax: 0.563, ay: 0.982 }, ch8: { w: 188, h: 285, ax: 0.564, ay: 0.982 }, ch9: { w: 235, h: 285, ax: 0.506, ay: 0.982 },
    ch10: { w: 190, h: 283, ax: 0.567, ay: 0.982 }, ch11: { w: 180, h: 285, ax: 0.595, ay: 0.982 }, ch12: { w: 232, h: 287, ax: 0.654, ay: 0.983 },
    ph1: { w: 191, h: 293, ax: 0.597, ay: 0.983 }, ph2: { w: 182, h: 295, ax: 0.617, ay: 0.983 }, ph3: { w: 189, h: 294, ax: 0.611, ay: 0.983 },
    ph4: { w: 190, h: 295, ax: 0.602, ay: 0.983 }, ph5: { w: 204, h: 296, ax: 0.559, ay: 0.983 }, ph6: { w: 204, h: 296, ax: 0.555, ay: 0.983 },
    ph7: { w: 218, h: 282, ax: 0.485, ay: 0.982 }, ph8: { w: 208, h: 282, ax: 0.501, ay: 0.982 }, ph9: { w: 192, h: 288, ax: 0.566, ay: 0.983 },
    ph10: { w: 186, h: 289, ax: 0.581, ay: 0.983 }, ph11: { w: 178, h: 292, ax: 0.615, ay: 0.983 }, ph12: { w: 201, h: 291, ax: 0.5, ay: 0.983 },
    ps1: { w: 255, h: 301, ax: 0.495, ay: 0.98 }, ps2: { w: 254, h: 301, ax: 0.499, ay: 0.98 }, ps3: { w: 258, h: 302, ax: 0.517, ay: 0.983 },
    ps4: { w: 258, h: 282, ax: 0.508, ay: 0.982 }, ps5: { w: 310, h: 302, ax: 0.537, ay: 0.983 }, ps6: { w: 309, h: 298, ax: 0.536, ay: 0.983 },
    ps7: { w: 318, h: 291, ax: 0.568, ay: 0.983 }, ps8: { w: 361, h: 270, ax: 0.596, ay: 0.981 }, ps9: { w: 223, h: 308, ax: 0.563, ay: 0.984 },
    ps10: { w: 224, h: 305, ax: 0.69, ay: 0.984 }, ps11: { w: 235, h: 308, ax: 0.564, ay: 0.984 }, ps12: { w: 236, h: 306, ax: 0.545, ay: 0.98 },
    vw1: { w: 185, h: 288, ax: 0.465, ay: 0.983 }, vw2: { w: 193, h: 274, ax: 0.559, ay: 0.982 }, vw3: { w: 184, h: 290, ax: 0.6, ay: 0.838 },
    vw4: { w: 183, h: 290, ax: 0.6, ay: 0.838 }, vw5: { w: 183, h: 289, ax: 0.6, ay: 0.834 }, vw6: { w: 178, h: 289, ax: 0.6, ay: 0.834 },
    vw7: { w: 194, h: 284, ax: 0.63, ay: 0.827 }, vw8: { w: 185, h: 284, ax: 0.63, ay: 0.827 }, vw9: { w: 184, h: 284, ax: 0.63, ay: 0.827 },
    vw10: { w: 180, h: 284, ax: 0.63, ay: 0.835 }, vw11: { w: 181, h: 284, ax: 0.63, ay: 0.827 }, vw12: { w: 189, h: 283, ax: 0.63, ay: 0.834 },
    vc1: { w: 193, h: 287, ax: 0.554, ay: 0.983 }, vc2: { w: 196, h: 267, ax: 0.544, ay: 0.981 }, vc8: { w: 181, h: 262, ax: 0.658, ay: 0.981 },
    vc9: { w: 180, h: 263, ax: 0.665, ay: 0.981 }, vc10: { w: 180, h: 264, ax: 0.664, ay: 0.981 }, vc11: { w: 176, h: 263, ax: 0.665, ay: 0.981 },
    vc12: { w: 177, h: 264, ax: 0.654, ay: 0.981 }, vc13: { w: 178, h: 264, ax: 0.648, ay: 0.981 }, vc14: { w: 197, h: 264, ax: 0.587, ay: 0.981 },
    hd1: { w: 170, h: 285, ax: 0.498, ay: 0.982 }, hd2: { w: 207, h: 294, ax: 0.409, ay: 0.983 }, hd3: { w: 218, h: 307, ax: 0.502, ay: 0.119 },
    hd4: { w: 224, h: 298, ax: 0.522, ay: 0.112 }, hd5: { w: 214, h: 271, ax: 0.521, ay: 0.113 }, hd6: { w: 209, h: 290, ax: 0.483, ay: 0.098 },
    hd7: { w: 190, h: 268, ax: 0.464, ay: 0.981 }, hd8: { w: 211, h: 255, ax: 0.489, ay: 0.98 }, hd9: { w: 211, h: 255, ax: 0.51, ay: 0.98 },
    hd10: { w: 159, h: 268, ax: 0.499, ay: 0.981 }, hd11: { w: 176, h: 274, ax: 0.601, ay: 0.982 }, hd12: { w: 208, h: 267, ax: 0.371, ay: 0.981 },
    // 2026-11-19, промпт 038 (листы 37–46): промежуточные кадры. tn — поворот по 18°, eb — ест банан, wv — машет, lg — хохочет,
    // jp — прыжок, ku — кунг-фу, sf — посох, sl — сон на подушке, hg — висит на руках (ay — середина кулаков), tb — бросок банана
    tn1: { w: 174, h: 305, ax: 0.51, ay: 0.984 },
    tn2: { w: 194, h: 298, ax: 0.588, ay: 0.983 },
    tn3: { w: 192, h: 301, ax: 0.589, ay: 0.983 },
    tn4: { w: 177, h: 302, ax: 0.633, ay: 0.983 },
    tn5: { w: 175, h: 302, ax: 0.637, ay: 0.983 },
    tn6: { w: 174, h: 303, ax: 0.645, ay: 0.983 },
    tn7: { w: 180, h: 297, ax: 0.668, ay: 0.983 },
    tn8: { w: 179, h: 297, ax: 0.674, ay: 0.983 },
    tn9: { w: 175, h: 296, ax: 0.672, ay: 0.983 },
    tn10: { w: 181, h: 297, ax: 0.639, ay: 0.983 },
    eb1: { w: 220, h: 301, ax: 0.557, ay: 0.983 },
    eb2: { w: 226, h: 306, ax: 0.51, ay: 0.984 },
    eb3: { w: 211, h: 298, ax: 0.523, ay: 0.983 },
    eb4: { w: 211, h: 295, ax: 0.609, ay: 0.983 },
    eb5: { w: 216, h: 296, ax: 0.589, ay: 0.98 },
    eb6: { w: 217, h: 296, ax: 0.589, ay: 0.98 },
    eb7: { w: 213, h: 302, ax: 0.602, ay: 0.983 },
    eb8: { w: 223, h: 303, ax: 0.575, ay: 0.98 },
    eb9: { w: 223, h: 303, ax: 0.575, ay: 0.98 },
    eb10: { w: 223, h: 303, ax: 0.576, ay: 0.98 },
    eb11: { w: 246, h: 304, ax: 0.527, ay: 0.984 },
    eb12: { w: 257, h: 304, ax: 0.508, ay: 0.984 },
    wv1: { w: 176, h: 308, ax: 0.508, ay: 0.981 },
    wv2: { w: 195, h: 307, ax: 0.557, ay: 0.984 },
    wv3: { w: 228, h: 308, ax: 0.487, ay: 0.981 },
    wv4: { w: 227, h: 312, ax: 0.488, ay: 0.984 },
    wv5: { w: 203, h: 305, ax: 0.558, ay: 0.98 },
    wv6: { w: 207, h: 299, ax: 0.545, ay: 0.983 },
    wv7: { w: 202, h: 295, ax: 0.526, ay: 0.983 },
    wv8: { w: 196, h: 304, ax: 0.575, ay: 0.984 },
    wv9: { w: 195, h: 309, ax: 0.596, ay: 0.984 },
    wv10: { w: 214, h: 300, ax: 0.551, ay: 0.983 },
    wv11: { w: 197, h: 308, ax: 0.563, ay: 0.981 },
    wv12: { w: 197, h: 307, ax: 0.564, ay: 0.984 },
    lg1: { w: 173, h: 304, ax: 0.511, ay: 0.984 },
    lg2: { w: 174, h: 304, ax: 0.506, ay: 0.984 },
    lg3: { w: 178, h: 304, ax: 0.509, ay: 0.984 },
    lg4: { w: 177, h: 304, ax: 0.506, ay: 0.984 },
    lg5: { w: 209, h: 305, ax: 0.619, ay: 0.984 },
    lg6: { w: 209, h: 300, ax: 0.629, ay: 0.983 },
    lg7: { w: 219, h: 305, ax: 0.44, ay: 0.984 },
    lg8: { w: 210, h: 306, ax: 0.578, ay: 0.984 },
    lg9: { w: 259, h: 279, ax: 0.539, ay: 0.982 },
    lg10: { w: 260, h: 305, ax: 0.497, ay: 0.984 },
    lg11: { w: 233, h: 309, ax: 0.588, ay: 0.984 },
    lg12: { w: 176, h: 306, ax: 0.508, ay: 0.984 },
    jp1: { w: 177, h: 313, ax: 0.515, ay: 0.981 },
    jp2: { w: 251, h: 297, ax: 0.573, ay: 0.98 },
    jp3: { w: 248, h: 295, ax: 0.58, ay: 0.98 },
    jp4: { w: 241, h: 331, ax: 0.515, ay: 0.982 },
    jp5: { w: 252, h: 333, ax: 0.327, ay: 0.982 },
    jp6: { w: 271, h: 335, ax: 0.267, ay: 0.979 },
    jp7: { w: 239, h: 320, ax: 0.628, ay: 0.981 },
    jp8: { w: 245, h: 318, ax: 0.635, ay: 0.981 },
    jp9: { w: 274, h: 345, ax: 0.436, ay: 0.983 },
    jp10: { w: 255, h: 354, ax: 0.669, ay: 0.983 },
    jp11: { w: 259, h: 333, ax: 0.597, ay: 0.982 },
    jp12: { w: 258, h: 284, ax: 0.586, ay: 0.979 },
    jp13: { w: 267, h: 333, ax: 0.612, ay: 0.979 },
    ku1: { w: 227, h: 331, ax: 0.479, ay: 0.982 },
    ku2: { w: 204, h: 334, ax: 0.48, ay: 0.982 },
    ku3: { w: 204, h: 322, ax: 0.469, ay: 0.981 },
    ku4: { w: 221, h: 323, ax: 0.377, ay: 0.981 },
    ku5: { w: 218, h: 335, ax: 0.367, ay: 0.982 },
    ku6: { w: 188, h: 345, ax: 0.493, ay: 0.983 },
    ku7: { w: 207, h: 344, ax: 0.526, ay: 0.983 },
    ku8: { w: 217, h: 345, ax: 0.539, ay: 0.983 },
    ku9: { w: 209, h: 334, ax: 0.542, ay: 0.982 },
    ku10: { w: 227, h: 323, ax: 0.212, ay: 0.981 },
    ku11: { w: 227, h: 318, ax: 0.152, ay: 0.981 },
    ku12: { w: 208, h: 330, ax: 0.492, ay: 0.982 },
    sf1: { w: 209, h: 292, ax: 0.515, ay: 0.979 },
    sf2: { w: 262, h: 302, ax: 0.395, ay: 0.98 },
    sf3: { w: 262, h: 319, ax: 0.609, ay: 0.981 },
    sf4: { w: 289, h: 303, ax: 0.501, ay: 0.98 },
    sf5: { w: 293, h: 296, ax: 0.358, ay: 0.98 },
    sf6: { w: 198, h: 313, ax: 0.456, ay: 0.981 },
    sf7: { w: 232, h: 348, ax: 0.395, ay: 0.983 },
    sf8: { w: 244, h: 340, ax: 0.395, ay: 0.982 },
    sf9: { w: 192, h: 311, ax: 0.567, ay: 0.981 },
    sf10: { w: 210, h: 295, ax: 0.428, ay: 0.98 },
    sf11: { w: 273, h: 275, ax: 0.498, ay: 0.978 },
    sl1: { w: 171, h: 302, ax: 0.511, ay: 0.983 },
    sl2: { w: 172, h: 302, ax: 0.507, ay: 0.983 },
    sl3: { w: 242, h: 301, ax: 0.497, ay: 0.983 },
    sl4: { w: 195, h: 304, ax: 0.448, ay: 0.984 },
    sl5: { w: 206, h: 302, ax: 0.475, ay: 0.983 },
    sl6: { w: 220, h: 248, ax: 0.544, ay: 0.98 },
    sl7: { w: 289, h: 192, ax: 0.352, ay: 0.974 },
    sl8: { w: 243, h: 207, ax: 0.474, ay: 0.976 },
    sl9: { w: 293, h: 195, ax: 0.351, ay: 0.974 },
    sl10: { w: 201, h: 243, ax: 0.437, ay: 0.979 },
    sl11: { w: 243, h: 253, ax: 0.646, ay: 0.976 },
    sl12: { w: 243, h: 290, ax: 0.504, ay: 0.983 },
    hg1: { w: 138, h: 387, ax: 0.553, ay: 0.067 },
    hg2: { w: 174, h: 361, ax: 0.631, ay: 0.072 },
    hg3: { w: 227, h: 347, ax: 0.532, ay: 0.075 },
    hg4: { w: 247, h: 318, ax: 0.423, ay: 0.082 },
    hg5: { w: 262, h: 330, ax: 0.599, ay: 0.079 },
    hg6: { w: 138, h: 382, ax: 0.55, ay: 0.068 },
    hg7: { w: 173, h: 358, ax: 0.708, ay: 0.073 },
    hg8: { w: 226, h: 353, ax: 0.44, ay: 0.074 },
    hg9: { w: 227, h: 366, ax: 0.425, ay: 0.071 },
    hg10: { w: 223, h: 362, ax: 0.464, ay: 0.072 },
    tb1: { w: 211, h: 290, ax: 0.561, ay: 0.983 },
    tb2: { w: 196, h: 290, ax: 0.601, ay: 0.983 },
    tb3: { w: 207, h: 291, ax: 0.496, ay: 0.983 },
    tb4: { w: 205, h: 290, ax: 0.416, ay: 0.983 },
    tb5: { w: 301, h: 291, ax: 0.389, ay: 0.983 },
    tb6: { w: 234, h: 290, ax: 0.407, ay: 0.983 },
    tb7: { w: 206, h: 289, ax: 0.574, ay: 0.979 },
    tb8: { w: 199, h: 286, ax: 0.588, ay: 0.983 },
    tb9: { w: 241, h: 297, ax: 0.387, ay: 0.983 },
    tb10: { w: 225, h: 280, ax: 0.53, ay: 0.982 },
    tb11: { w: 198, h: 289, ax: 0.602, ay: 0.979 },
  };
  // Сама дверь Game (лист 28) — отдельная картинка на карточке, не кадр обезьянки. ax, ay — середина низа двери
  const DOOR = {
    door1: { w: 250, h: 414, ax: 0.5, ay: 0.988 },    // закрыта
    door2: { w: 251, h: 425, ax: 0.5, ay: 0.961 },    // приоткрыта, внутри свет
    door3: { w: 252, h: 425, ax: 0.5, ay: 0.961 },    // открыта, внутри искры (кадр «настежь» не взят — свет вырезался вместе с фоном)
    door4: { w: 328, h: 451, ax: 0.47, ay: 0.989 },   // захлопнулась, облачка пыли
  };
  // Бег — строго в профиль (лист 29), в экран не смотрит. Старый бег на 3/4 (run1–6) больше не используется
  const RUN = ["pr1", "pr2", "pr3", "pr4", "pr5", "pr6", "pr7", "pr8"];
  const JOY = ["joy1", "joy2", "joy3", "joy4", "joy5", "joy6"];
  const STILL = new Set(["stand", "blink", "blinkHalf", "front34", "side", "back34", "back", "ready", "wow", "scared", "angry"]);   // в них «дышит»
  const HANGS = new Set(["hangSad", "hangSwing", "hangSide", "hangJoy", "lineTail", "lineTailL", "lineTailR", "vine1", "vine2",
    "hg1", "hg2", "hg3", "hg4", "hg5", "hg6", "hg7", "hg8", "hg9", "hg10"]);
  // 2026-11-19 (лист 37): кольцо поворота от анфаса до спины, шаг ≈ 18°. Старые front34 / side / back34 / back стоят на своих местах,
  // между ними — новые кадры. seq() сама проходит все кадры между двумя положениями кольца, поэтому поворот без рывков
  const RING = ["stand", "tn2", "tn3", "front34", "tn5", "side", "tn7", "tn8", "back34", "tn10", "back"];
  const TURN_STEP = 42;       // мс на промежуточный кадр поворота
  const JUMP = ["jp1", "jp2", "jp3", "jp4", "jp5", "jp6", "jp7", "jp8", "jp9", "jp10", "jp11", "jp12", "jp13"];
  // Кадры, нужные сразу; остальные догружаются по одному, пока она гуляет
  const CORE = ["stand", "blink", "blinkHalf", "front34", "side", "back34", "back", "crouch", "push", "rise", "apex", "fall",
    "wave", "yay", "cheer", "oops", "laugh", "wow", "scared", "peek", "peekSide", "peekSly", "peekWave", "tn2", "tn3", "tn5", "tn7", "tn8", "tn10"].concat(RUN, JUMP);
  const STAND = 285;          // рост стоящей в пикселях кадра
  const PROPS = ["banana", "puff-1", "swoosh"];

  const SURF_SEL = "button, a, img, video, canvas, .work-card, .case-tile, .smm-item, .insta, " +
    ".insta__head, .insta__foot, .reel, .hl-card, .pack-pick, .pack-fig, .brand-shot, .brand-hero, .tag, .pill, " +
    ".tool-card, .step, .tg__post, .tg__chat, .case__meta, .modal__window, .lightbox__img";

  const mqTouch = window.matchMedia("(hover: none)");
  const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const modal = document.getElementById("modal");
  const lightbox = document.getElementById("lightbox");
  const wall = document.getElementById("reels-wall");

  let H = 168, K = H / STAND;
  function measure() {
    H = window.innerWidth < 640 ? CFG.heightMobile : CFG.height;
    K = H / STAND;
  }
  measure();
  window.addEventListener("resize", measure);

  const src = (name) => "images/monkey/" + name + ".png";
  const frameSrc = (name) => "images/monkey/v3/" + name + ".webp";
  const sizes = {};           // натуральные размеры картинок-эффектов

  /* ---------- Разметка: все кадры лежат стопкой, виден один ---------- */
  const root = document.createElement("div");
  root.className = "monkey";
  root.hidden = true;
  root.setAttribute("aria-hidden", "true");
  const imgs = {};
  const loading = {};
  for (const name in FR) {
    const im = document.createElement("img");
    im.className = "monkey__sprite";
    im.alt = "";
    im.draggable = false;
    im.style.display = "none";
    root.appendChild(im);
    imgs[name] = im;
  }
  // Загрузить кадры (один раз) и дождаться
  function load(names) {
    return Promise.all(names.map((n) => loading[n] || (loading[n] = new Promise((res) => {
      const im = imgs[n];
      im.onload = () => (im.decode ? im.decode().catch(() => {}) : Promise.resolve()).then(res);
      im.onerror = () => res();
      im.src = frameSrc(n);
    }))));
  }
  const bubble = document.createElement("div");
  bubble.className = "monkey__bubble";
  root.append(bubble);
  const fx = document.createElement("div");
  fx.className = "monkey-fx";
  document.body.append(fx, root);

  /* ---------- Состояние ---------- */
  const m = {
    x: -300, y: 0,            // точка ног (у висящих кадров — точка хвата)
    mode: "air",              // ground — на поверхности, air — в полёте, caught — поймали, hidden — спряталась за картинкой
    surf: null, relX: 0,      // на чём стоит и где по ней
    hanging: false,           // висит под линией (на руках, на хвосте, спит на лиане)
    face: 1,                  // 1 — смотрит вправо, -1 — влево
    pose: "stand",            // текущий кадр
    sx: 1, sy: 1, rot: 0, lift: 0, k: 1,   // растяжение, наклон, подскок, общий масштаб
    clip: 0,                  // сколько спрятано за краем (выныривает из-за картинки)
    swing: 0,                 // качается, когда держат
    layer: document.body,
    walked: 0,                // пройденный путь — по нему меняются кадры бега
    asleep: false,
  };
  let shownImg = null;
  function setPose(name) { m.pose = name; }
  // Моргание: только в анфас, само по себе, не мешая действиям
  let blinkAt = 0;
  function visibleFrame(t) {
    if (m.pose !== "stand" || m.mode !== "ground") return m.pose;
    if (!blinkAt) blinkAt = t + rnd(1500, 4000);
    const d = t - blinkAt;
    if (d < 0) return "stand";
    if (d < 45) return "blinkHalf";
    if (d < 125) return "blink";
    if (d < 170) return "blinkHalf";
    blinkAt = t + (Math.random() < 0.18 ? 140 : rnd(2200, 5200));   // иногда моргает дважды
    return "stand";
  }
  function show(name) {
    const im = imgs[name];
    if (shownImg === im) return;
    if (!im.src) load([name]);
    if (shownImg) shownImg.style.display = "none";
    im.style.display = "";
    shownImg = im;
  }

  let surfaces = [];
  const cursor = { x: window.innerWidth / 2, y: window.innerHeight / 2, t: 0, vx: 0 };
  let lastActive = performance.now();
  const flees = [];
  let tiredUntil = 0;
  let caughtTimes = 0;
  const next = { favorite: 0, bash: 0, throw: 0, tease: 0, hang: 0, trick: 0, chat: 0, door: 0, scene: 0 };
  const recentSpots = new Map();

  const rnd = (a, b) => a + Math.random() * (b - a);
  const pick = (list) => list[Math.floor(Math.random() * list.length)];
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const now = () => performance.now();
  const ease = (p) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);
  const easeOut = (p) => 1 - Math.pow(1 - p, 3);

  /* ---------- Анимации: всё движется в одном цикле requestAnimationFrame ----------
     tween(ms, fn) — вызывать fn(доля 0..1) каждый кадр. Если обезьянку прервали (interrupt),
     действия текущей «мысли» отменяются; эффекты (persist) доигрывают всегда. */
  const CANCEL = { cancel: true };
  let token = 0;
  let pending = null;
  const tasks = new Set();
  function tween(ms, fn, persist) {
    const tok = persist ? -1 : token;
    return new Promise((res, rej) => tasks.add({ t0: now(), ms: Math.max(1, ms), fn, res, rej, tok }));
  }
  const wait = (ms) => tween(ms, null);
  function interrupt(action) {
    if (m.mode === "caught" || m.mode === "hidden") return;
    token++;
    // Спала или висела — сначала проснуться / спрыгнуть, потом делать новое
    if (m.asleep) pending = async () => { await wakeUp(); await action(); };
    else if (m.hanging && action !== flee) pending = async () => { await unhang(); await action(); };
    else pending = action;
  }
  // Показать кадры по очереди: [["front34", 70], ["side", 0]]
  const ringIdx = (p) => (p === "blink" || p === "blinkHalf" ? 0 : RING.indexOf(p));
  async function seq(list) {
    for (const [name, ms] of list) {
      const a = ringIdx(m.pose), b = ringIdx(name);
      if (a >= 0 && b >= 0 && Math.abs(a - b) > 1) {            // 2026-11-19: поворот — через все кадры кольца между ними
        const d = b > a ? 1 : -1;
        for (let i = a + d; i !== b; i += d) { setPose(RING[i]); await wait(TURN_STEP); }
      }
      setPose(name); if (ms) await wait(ms);
    }
  }
  // Присесть/выпрямиться (пружинка)
  const squash = (ms, amount = 0.14) => tween(ms, (p) => { const q = Math.sin(p * Math.PI); m.sy = 1 - amount * q; m.sx = 1 + amount * 0.6 * q; }).then(() => { m.sx = m.sy = 1; });

  /* ---------- Поверхности: только видимые края ---------- */
  function layerNow() {
    if (lightbox && lightbox.classList.contains("is-open")) return lightbox;
    if (wall && wall.classList.contains("is-open")) return wall;
    if (modal && modal.classList.contains("is-open")) return modal.querySelector(".modal__window") || modal;
    return document.body;
  }
  function clipOf(L) {
    const v = { top: 0, left: 0, right: window.innerWidth, bottom: window.innerHeight };
    if (L === document.body || L === lightbox || L === wall) return v;
    const r = L.getBoundingClientRect();
    return { top: Math.max(0, r.top), left: Math.max(0, r.left), right: Math.min(v.right, r.right), bottom: Math.min(v.bottom, r.bottom) };
  }
  // Есть ли у элемента край, который виден глазом: картинка, заметный фон или рамка.
  // Тень, прозрачный фон и фон того же цвета, что вокруг, — не край (иначе стоит «в воздухе»)
  const edgeCache = new WeakMap();
  const rgba = (c) => { const mm = c.match(/rgba?\(([^)]+)\)/); if (!mm) return [0, 0, 0, c === "transparent" ? 0 : 1]; const v = mm[1].split(",").map(parseFloat); return [v[0], v[1], v[2], v[3] === undefined ? 1 : v[3]]; };
  function behindColor(el) {                       // цвет фона, на котором лежит элемент
    for (let p = el.parentElement; p; p = p.parentElement) {
      const c = rgba(getComputedStyle(p).backgroundColor);
      if (c[3] > 0.5) return c;
    }
    return [255, 255, 255, 1];
  }
  const differs = (c, bg) => c[3] > 0.3 && Math.max(Math.abs(c[0] - bg[0]), Math.abs(c[1] - bg[1]), Math.abs(c[2] - bg[2])) * c[3] > 22;
  function edgeKind(el) {
    if (edgeCache.has(el)) return edgeCache.get(el);
    let kind = null;
    const tag = el.tagName;
    const cs = getComputedStyle(el);
    if (cs.visibility === "hidden" || parseFloat(cs.opacity) < 0.3) kind = null;
    else if (tag === "IMG" || tag === "VIDEO" || tag === "CANVAS") kind = el.classList.contains("hero-fx") || el.classList.contains("hero__photo") || el.classList.contains("about-bg__img") ? null : "top";   // фото-фон «Обо мне» — не опора
    else {
      const bg = behindColor(el);
      const ownBg = differs(rgba(cs.backgroundColor), bg) || (cs.backgroundImage !== "none" && el.getBoundingClientRect().height < 200);
      const topLine = parseFloat(cs.borderTopWidth) >= 1 && cs.borderTopStyle !== "none" && differs(rgba(cs.borderTopColor), bg);
      const botLine = parseFloat(cs.borderBottomWidth) >= 1 && cs.borderBottomStyle !== "none" && differs(rgba(cs.borderBottomColor), bg);
      if (ownBg || topLine) kind = "top";
      else if (botLine) kind = "bottom";
    }
    edgeCache.set(el, kind);
    return kind;
  }
  // Элемент ещё не проявился (появляется при прокрутке) или спрятан родителем — на него нельзя
  function shown(el) {
    for (let p = el; p && p !== document.body; p = p.parentElement) {
      const cs = getComputedStyle(p);
      if (cs.visibility === "hidden") return false;
      // 2026-11-23: уже проявляется (.reveal.is-visible) — значит, будет видно; не сбрасываем её с карточки посреди проявления
      if (parseFloat(cs.opacity) < 0.6 && !(p.classList.contains("reveal") && p.classList.contains("is-visible"))) return false;
    }
    return true;
  }
  function edgeY(s, r) { return s.edge === "bottom" ? r.bottom : r.top; }
  /* Видимый прямоугольник элемента. Картинки на обложках сдвинуты параллаксом и обрезаны рамкой
     (overflow: hidden у родителя): их getBoundingClientRect выше рамки — стояла бы «в воздухе».
     Поэтому режем по всем обрезающим родителям. Прокручиваемый родитель (overflow: auto) срезал
     верх — значит, сам край не виден: такой край не опора. */
  const chainCache = new WeakMap();
  function clipChain(el) {
    let c = chainCache.get(el);
    if (c) return c;
    c = [];
    for (let p = el.parentElement; p && p !== document.body && p !== document.documentElement; p = p.parentElement) {
      const cs = getComputedStyle(p);
      if (cs.overflowX !== "visible" || cs.overflowY !== "visible") c.push({ p, scroll: /auto|scroll/.test(cs.overflowX + cs.overflowY) });
    }
    chainCache.set(el, c);
    return c;
  }
  function box(el) {
    const r = el.getBoundingClientRect();
    if (el.virtual) return r;
    let l = r.left, t = r.top, rt = r.right, b = r.bottom;
    for (const { p, scroll } of clipChain(el)) {
      const q = p.getBoundingClientRect();
      if (scroll) { if (q.top > t + 1) t = -1e5; if (q.bottom < b - 1) b = 1e5; }
      else { t = Math.max(t, q.top); b = Math.min(b, q.bottom); }
      l = Math.max(l, q.left); rt = Math.min(rt, q.right);
    }
    return { left: l, top: t, right: rt, bottom: b, width: Math.max(0, rt - l), height: Math.max(0, b - t) };
  }
  // Скругление угла у видимого края: самого элемента или рамки, которая его обрезает.
  // Где начинается скругление — там опора кончается (ноги не ставит на закругление)
  function cornerR(el, r) {
    let rad = 0;
    for (const p of [el].concat(clipChain(el).map((c) => c.p))) {
      const q = p.getBoundingClientRect();
      if (Math.abs(q.top - r.top) > 3 && Math.abs(q.bottom - r.bottom) > 3) continue;
      const cs = getComputedStyle(p);
      rad = Math.max(rad, parseFloat(cs.borderTopLeftRadius) || 0, parseFloat(cs.borderTopRightRadius) || 0,
        parseFloat(cs.borderBottomLeftRadius) || 0, parseFloat(cs.borderBottomRightRadius) || 0);
    }
    return rad;
  }
  const footPad = () => H * 0.2;           // полступни от якоря: столько ещё отступить от скругления
  function topVisible(el, y, x) {
    const hit = document.elementFromPoint(x, y);
    if (!hit) return false;
    if (root.contains(hit)) return true;
    // 2026-11-19: неоновые обложки — стопка картинок в одной рамке (основа + слои свечения). Сверху лежит слой свечения,
    // но край у них общий: если в точке края — что-то из той же рамки, край виден
    const fr = clipChain(el)[0];
    if (fr && !fr.scroll && fr.p.contains(hit) && fr.p !== document.body && !fr.p.matches("main, section")) return true;
    return el === hit || el.contains(hit) || (hit.contains(el) && hit !== document.body && hit.tagName !== "MAIN");
  }
  // Под линией есть место, чтобы повиснуть
  const roomBelow = (y) => y + H * 1.45 < window.innerHeight;   // висящие кадры длиннее стоящей (руки вверх)
  function makeSurface(el, r, clip) {
    if (r.width < 90 || r.height < 6) return null;     // ноги не на скруглённом углу
    const edge = edgeKind(el);
    if (!edge) return null;
    const y = edge === "bottom" ? r.bottom : r.top;
    if (y < Math.max(clip.top, 0) + H * 0.95 || y > Math.min(clip.bottom, window.innerHeight) - 6) return null;
    const pad = Math.min(cornerR(el, r), r.height / 2, r.width / 2) + footPad() + 4;
    const x1 = Math.max(r.left + pad, clip.left + 20, 20);
    const x2 = Math.min(r.right - pad, clip.right - 20, window.innerWidth - 20);
    if (x2 - x1 < 36) return null;
    if (!topVisible(el, edge === "bottom" ? y - 2 : y + 2, (x1 + x2) / 2) || !shown(el)) return null;
    return { el, edge, min: x1 - r.left, max: x2 - r.left, solid: el.tagName === "IMG" || r.height > H * 0.6,
      hang: (edge === "bottom" || r.height <= 8) && roomBelow(y) };
  }

  /* Невидимые глазу элементы, которые всё же опоры: верх букв, плоскости на фото, линии между секциями.
     Для движка это «элемент» с прямоугольником толщиной 2 px: el.getBoundingClientRect() пересчитывается
     от настоящего элемента (host), поэтому опора едет вместе со страницей при прокрутке. */
  function virt(kind, host, rect) {
    return { virtual: true, kind, host, tagName: kind.toUpperCase(), className: "monkey-" + kind,
      getBoundingClientRect: rect, get isConnected() { return host.isConnected; },
      matches: () => false, closest: (sel) => host.closest(sel), contains: () => false, classList: { add() {}, remove() {} } };
  }
  const vrect = (l, r, y) => ({ left: l, right: r, top: y, bottom: y + 2, width: r - l, height: 2 });
  function addVirtual(list, el, pad, hang, clip) {
    const r = el.getBoundingClientRect();
    const y = r.top;
    if (r.width < 36 || y < clip.top + H * 0.95 || y > clip.bottom - 6) return;
    const x1 = Math.max(r.left + pad, 20), x2 = Math.min(r.right - pad, window.innerWidth - 20);
    if (x2 - x1 < 28) return;
    list.push({ el, edge: "top", min: x1 - r.left, max: x2 - r.left, solid: false, virtual: true, hang: hang && roomBelow(y) });
  }
  // Верх букв: по каждой букве — её настоящая высота (measureText), соседние буквы одной высоты — одна опора
  const glyphCache = new WeakMap();
  const gctx = document.createElement("canvas").getContext("2d");
  function glyphSegs(el) {
    const er = el.getBoundingClientRect();
    const key = Math.round(er.width) + "x" + Math.round(er.height);
    const c = glyphCache.get(el);
    if (c && c.key === key) return c.segs;
    const cs = getComputedStyle(el);
    const fs = parseFloat(cs.fontSize);
    gctx.font = cs.fontStyle + " " + cs.fontWeight + " " + cs.fontSize + " " + cs.fontFamily;
    const upper = cs.textTransform === "uppercase";
    const segs = [];
    let cur = null;
    const flush = () => { if (cur && cur.x1 - cur.x0 >= 36) segs.push(cur); cur = null; };
    const range = document.createRange();
    const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    for (let node = walk.nextNode(); node; node = walk.nextNode()) {
      const txt = node.textContent;
      for (let i = 0; i < txt.length; i++) {
        let ch = txt[i];
        if (/\s/.test(ch)) { flush(); continue; }
        range.setStart(node, i); range.setEnd(node, i + 1);
        const rr = range.getClientRects()[0];
        if (!rr || rr.width < 1) { flush(); continue; }
        if (upper) ch = ch.toUpperCase();
        const mt = gctx.measureText(ch);
        const fa = mt.fontBoundingBoxAscent || fs * 0.97, fd = mt.fontBoundingBoxDescent || fs * 0.25;
        const base = rr.top + (rr.height - (fa + fd)) / 2 + fa;
        const top = base - mt.actualBoundingBoxAscent;
        if (cur && (Math.abs(top - cur.y) > Math.max(2, fs * 0.04) || Math.abs(rr.left - cur.x1) > fs * 0.3)) flush();
        if (!cur) cur = { x0: rr.left, x1: rr.right, y: top };
        else { cur.x1 = rr.right; cur.y = Math.max(cur.y, top); }
      }
      flush();
    }
    const rel = segs.map((s) => ({ dx0: s.x0 - er.left + 3, dx1: s.x1 - er.left - 3, dy: s.y - er.top }));
    glyphCache.set(el, { key, segs: rel });
    return rel;
  }
  // Плоскости в картинке (object-fit: cover и object-position учитываются)
  function planeRect(img, p) {
    const r = img.getBoundingClientRect();
    const nw = img.naturalWidth, nh = img.naturalHeight;
    if (!nw || !nh) return vrect(-999, -999, -999);
    const s = Math.max(r.width / nw, r.height / nh);
    const pos = getComputedStyle(img).objectPosition.split(" ").map((v) => parseFloat(v) / 100);
    const ox = (r.width - nw * s) * (isNaN(pos[0]) ? 0.5 : pos[0]);
    const oy = (r.height - nh * s) * (isNaN(pos[1]) ? 0.5 : pos[1]);
    return vrect(r.left + ox + p[0] * nw * s, r.left + ox + p[1] * nw * s, r.top + oy + p[2] * nh * s);
  }
  // Линии-переходы между секциями: верх секции, фон которой заметно отличается от предыдущей
  function sectionLines() {
    const out = [];
    const secs = [...document.querySelectorAll("main > section, body > section, .section")].filter((s, i, a) => a.indexOf(s) === i);
    for (let i = 1; i < secs.length; i++) {
      const a = secs[i - 1], b = secs[i];
      const ca = getComputedStyle(a), cb = getComputedStyle(b);
      const bgA = rgba(ca.backgroundColor), bgB = rgba(cb.backgroundColor);
      const photo = ca.backgroundImage !== "none" || a.querySelector(".hero__photo");
      if (!photo && !differs(bgB, bgA) && !differs(bgA, bgB)) continue;
      out.push({ host: b, pad: (parseFloat(cb.borderTopLeftRadius) || 0) + footPad() + 8 });
    }
    return out;
  }
  function extraSurfaces(list, clip) {
    // верх букв
    for (const el of document.querySelectorAll(CFG.glyphs)) {
      if (el.closest(".modal, .lightbox, .reels-wall") || parseFloat(getComputedStyle(el).fontSize) < CFG.glyphMin || !shown(el)) continue;
      const er = el.getBoundingClientRect();
      if (er.bottom < 0 || er.top > window.innerHeight) continue;
      for (const g of glyphSegs(el)) {
        const v = virt("glyph", el, () => { const r = el.getBoundingClientRect(); return vrect(r.left + g.dx0, r.left + g.dx1, r.top + g.dy); });
        addVirtual(list, v, 0, false, clip);
      }
    }
    // плоскости на фото
    for (const pl of CFG.planes) {
      const img = document.querySelector(pl.sel);
      if (!img || !img.complete || !shown(img)) continue;
      const ir = img.getBoundingClientRect();
      if (ir.bottom < 0 || ir.top > window.innerHeight) continue;
      for (const p of pl.pts) addVirtual(list, virt("plane", img, () => planeRect(img, p)), 0, false, clip);
    }
    // линии между секциями: по ним бегает и на них висит
    for (const ln of sectionLines()) {
      const v = virt("line", ln.host, () => { const r = ln.host.getBoundingClientRect(); return vrect(r.left, r.right, r.top); });
      addVirtual(list, v, ln.pad, true, clip);
    }
  }
  function scan() {
    const L = layerNow();
    const clip = clipOf(L);
    const list = [];
    for (const el of L.querySelectorAll(SURF_SEL)) {
      if (L === document.body && el.closest(".modal, .lightbox, .reels-wall")) continue;
      if (root.contains(el) || fx.contains(el)) continue;            // свои картинки — не опора
      const s = makeSurface(el, box(el), clip);
      // слои одной обложки дают один и тот же край — берём только первый (основу: она не мигает, слои свечения гаснут и вспыхивают)
      if (s && !list.some((o) => !o.virtual && o.el.parentElement === el.parentElement && Math.abs(box(o.el).top - box(el).top) < 2)) list.push(s);
    }
    if (L === document.body) extraSurfaces(list, clip);
    if (L !== document.body && L !== lightbox && L !== wall) {           // верхний край самого окна проекта
      const r = L.getBoundingClientRect();
      if (r.top > H) list.push({ el: L, edge: "top", min: 30, max: r.width - 100, solid: true });
    }
    // своя опора остаётся в списке, пока она на ней (виртуальные создаются заново при каждом осмотре)
    if (m.surf && m.surf.virtual && !list.some((s) => s.el.host === m.surf.el.host && Math.abs(box(s.el).top - box(m.surf.el).top) < 2)) list.push(m.surf);
    surfaces = list;
    return L;
  }
  const FLOOR = { floor: true };
  function spot(s, relX) {
    if (s.floor) return { x: clamp(relX, 30, window.innerWidth - 30), y: window.innerHeight - 4 };
    const r = box(s.el);
    return { x: clamp(r.left + relX, r.left + 6, r.right - 6), y: edgeY(s, r), r };
  }
  function surfaceOk(s) {
    if (!s || s.floor) return true;
    if (!s.el.isConnected) return false;
    const r = box(s.el);
    const y = edgeY(s, r);
    if (r.width < 20 || y > window.innerHeight - 4) return false;
    if (m.hanging ? y < -4 || y + H > window.innerHeight + H * 0.4 : y < H * 0.6) return false;
    const L = layerNow();
    if (s.virtual) return L === document.body && shown(s.el.host);
    if (L !== document.body && !L.contains(s.el)) return false;
    if (L === document.body && s.el.closest(".modal, .lightbox, .reels-wall")) return false;
    if (!shown(s.el)) return false;
    return topVisible(s.el, s.edge === "bottom" ? y - 2 : y + 2, clamp(r.left + m.relX, r.left + 4, r.right - 4));
  }
  // Выбрать, куда идти. near — ближе к точке, away — подальше от точки
  function choose(opts = {}) {
    const cands = surfaces.slice();
    if (!cands.length) return null;
    let best = null, bestScore = -1e9;
    for (let i = 0; i < 60; i++) {
      const s = pick(cands);
      if (opts.only && !opts.only(s)) continue;
      const relX = s.floor ? rnd(40, window.innerWidth - 40) : rnd(s.min, s.max);
      const p = spot(s, relX);
      const d = Math.hypot(p.x - m.x, p.y - m.y);
      if (opts.min && d < opts.min) continue;
      if (opts.max && d > opts.max) continue;
      let score = Math.random() * 120;
      if (s.floor) score -= 300;
      if (s === m.surf) score -= 60;
      if (s.virtual) score += 40;                              // буквы, фото и линии — интереснее
      if (opts.near) score -= Math.abs(Math.hypot(p.x - opts.near.x, p.y - opts.near.y) - (opts.nearDist || 220));
      if (opts.avoid && Math.hypot(p.x - opts.avoid.x, p.y - opts.avoid.y) < 150) continue;   // не туда, откуда пришла
      if (opts.away) {
        const a = Math.hypot(p.x - opts.away.x, p.y - opts.away.y);
        if (a < (opts.awayMin || 280)) continue;
        score += Math.min(a, 700) * 0.5;
      }
      if (score > bestScore) { bestScore = score; best = { s, relX }; }
    }
    return best;
  }

  /* ---------- Повороты: через промежуточные виды, без скачков ---------- */
  function faceTo(x) { if (Math.abs(x - m.x) > 4) m.face = x > m.x ? 1 : -1; }
  // Встать боком в сторону dir
  async function faceSide(dir) {
    if (m.pose === "side" && m.face === dir) return;
    if (m.face !== dir && m.pose !== "stand" && m.pose !== "back") {
      await seq([["front34", 60], ["stand", 60]]);
    }
    if (m.pose === "back") await seq([["back34", 70]]);
    m.face = dir;
    await seq([["front34", 70], ["side", 0]]);
  }
  // Повернуться к гостю (анфас)
  async function faceFront() {
    if (m.pose === "stand") return;
    if (m.pose === "back") await seq([["back34", 80], ["side", 60]]);
    else if (m.pose === "back34") await seq([["side", 60]]);
    await seq([["front34", 70], ["stand", 0]]);
  }
  function standOn(s, relX) { m.surf = s; m.relX = relX; m.mode = "ground"; m.hanging = false; }

  /* ---------- Движения ---------- */
  async function runTo(relX, speed = CFG.runSpeed, cycle = RUN) {
    if (!m.surf) return;
    if (m.hanging) return brachiate(relX);
    const from = m.relX;
    const dist = Math.abs(relX - from);
    if (dist < 4) return;
    const dir = relX > from ? 1 : -1;
    await faceRun(dir);
    // 2026-11-17: подготовка и доводка (правила Disney). Перед длинной пробежкой чуть присела и подалась вперёд,
    // бежит с наклоном вперёд, на остановке проскальзывает на несколько пикселей дальше цели и откачивается назад.
    // Наклон m.rot задаётся × m.face: в draw он ещё раз умножается на face — так «вперёд» в обе стороны
    const long = !calm && dist > H * 1.2;
    const LEAN = 5;
    if (long) {
      await tween(120, (p) => { m.sy = 1 - 0.06 * Math.sin(p * Math.PI); m.sx = 1 + 0.03 * Math.sin(p * Math.PI); m.rot = LEAN * p * m.face; });
      m.sx = m.sy = 1;
    }
    const room = !m.surf.floor ? (dir > 0 ? m.surf.max - relX : relX - m.surf.min) : 0;
    const over = long ? clamp(Math.min(14, dist * 0.04), 0, Math.max(0, room)) : 0;   // проскальзывание — только в пределах опоры
    const goal = relX + dir * over;
    const step = H * 0.15;                                    // столько пути на один кадр бега
    let last = from;
    await tween((Math.abs(goal - from) / speed) * 1000, (p) => {
      m.relX = from + (goal - from) * ease(p);
      m.walked += Math.abs(m.relX - last);
      last = m.relX;
      setPose(cycle[Math.floor(m.walked / step) % cycle.length]);
      if (long) m.rot = LEAN * (1 - p * p) * m.face;            // наклон вперёд, к концу выпрямляется
    });
    if (long) {                                               // остановка: откачнулась назад и встала точно на цель
      setPose("side");
      await tween(200, (p) => { m.relX = goal + (relX - goal) * ease(p); m.rot = -4 * Math.sin(p * Math.PI) * m.face; });
      m.rot = 0;
    }
    await seq([["side", 90]]);                                // остановилась — в профиль, как бежала
  }
  /* Перед бегом: бег строго в профиль (лист 29), поэтому до и после бега — side. Поворот от гостя: stand → front34 → side,
     голова уходит от экрана один раз и больше не дёргается. Разворот в другую сторону — быстрым «переворотом» силуэта
     (сжать по ширине → зеркально → разжать), без анфаса посередине. */
  async function faceRun(dir) {
    if (m.pose === "back" || m.pose === "back34") await faceFront();
    if (m.face !== dir) {
      await tween(70, (p) => { m.sx = 1 - 0.85 * p; });
      m.face = dir;
      await tween(70, (p) => { m.sx = 0.15 + 0.85 * p; });
      m.sx = 1;
    }
    if (m.pose !== "side" && !RUN.includes(m.pose)) await seq([["front34", 60]]);
    setPose("side");
  }

  async function jumpTo(s, relX, opts = {}) {
    if (m.hanging) await unhang(true);
    const end0 = opts.final || spot(s, relX);   // final — где опора будет после наезда раздела (она ещё едет)
    faceTo(end0.x);
    const x0 = m.x, y0 = m.y;
    const dist = Math.hypot(end0.x - x0, end0.y - y0);
    // Дуга прыжка — не выше края экрана (голова всегда видна)
    const arc = clamp(Math.max(70, Math.min(260, dist * 0.35)) + Math.max(0, y0 - end0.y) * 0.25,
      20, Math.max(20, Math.min(y0, end0.y) - H * 1.1));
    // Иногда — сальто в прыжке (лист 19): только в длинном прыжке с высокой дугой, не когда удирает
    const flip = !opts.scared && !calm && dist > 170 && Math.abs(end0.x - x0) > 120 && arc > H * 0.6 && Math.random() < (opts.flip || 0.3);
    if (flip) await load(["ss1", "ss2", "ss3", "ss5", "ss6", "ss7"]);
    // Толчок: присела, оттолкнулась. 2026-11-17: чем дальше и выше прыжок, тем глубже и дольше присед (подготовка)
    const power = calm ? 0.3 : clamp(dist / 520 + Math.max(0, y0 - end0.y) / 380, 0, 1);
    // 2026-11-19 (лист 41): присед в два кадра (глубже — при сильном прыжке), толчок рукой вверх
    if (!opts.air) {                                          // air — уже в воздухе: без приседа и толчка
      if (!opts.scared && !flip) { setPose("jp2"); await wait(60 + power * 60); }
      setPose(opts.scared ? "oops" : flip ? "ss1" : power > 0.35 ? "jp3" : "jp2");
      await squash(opts.scared ? 110 : 120 + power * 130, 0.1 + power * 0.08);
      if (!flip) { setPose(opts.scared ? "push" : "jp4"); await wait(60); }
    }
    const ms = Math.max(opts.minMs || 0, clamp(dist * 0.8 + 380, 480, 1050) * (opts.slow || 1) * (flip ? 1.15 : 1));
    m.mode = "air";
    m.surf = null;
    let last = end0;
    await tween(ms, (p) => {
      const e = opts.final ? opts.final : s.floor || s.el.isConnected ? spot(s, relX) : last;   // цель могла уехать при прокрутке
      last = e;
      m.x = x0 + (e.x - x0) * p;
      m.y = y0 + (e.y - y0) * p - arc * 4 * p * (1 - p);
      if (flip) {
        // взлёт → группировка, крутится вперёд на 360° вокруг центра → раскрылась. Кадры с якорем в центре — поднимаем на полроста
        setPose(p < 0.16 ? "ss2" : p < 0.8 ? "ss3" : "ss5");
        m.rot = 360 * ease(clamp((p - 0.16) / 0.64, 0, 1)) * m.face;   // × face: после зеркала крутится вперёд в обе стороны
        m.lift = -H * 0.5;
      } else {
        // 2026-11-19 (лист 41): по кадру на каждый отрезок дуги — взлёт, верх (кулаки вверх, радуется), спуск, ноги вниз
        if (opts.scared) setPose(p < 0.38 ? "rise" : p < 0.62 ? "oops" : "fall");
        else setPose(p < 0.16 ? "jp5" : p < 0.3 ? "jp6" : p < 0.44 ? "jp7" : p < 0.56 ? (arc > 120 ? "jp8" : "jp7") : p < 0.7 ? "jp9" : p < 0.84 ? "jp10" : "jp11");
        m.rot = (p - 0.5) * 10;
      }
    });
    m.rot = 0;
    m.lift = 0;
    standOn(s, s.floor ? last.x : relX);
    puff(m.x, m.y);
    // Приземление: присела и выпрямилась. 2026-11-17: чем выше падала с верха дуги, тем жёстче: глубже присед,
    // дольше держится внизу, пыль с двух сторон; по инерции чуть проезжает вперёд по опоре
    const hard = calm ? 0 : clamp((arc + (last.y - y0)) / 420, 0, 1);
    if (hard > 0.55) { puff(m.x - H * 0.22, m.y); puff(m.x + H * 0.22, m.y); }
    setPose(flip ? "ss6" : opts.scared ? "crouch" : "jp12");
    const slideDir = Math.sign(last.x - x0) || m.face;
    const r0 = m.relX, r1 = s.floor ? r0 : clamp(r0 + slideDir * (4 + hard * 8), s.min, s.max);
    await tween(160 + hard * 120, (p) => { const q = Math.sin(p * Math.PI), a = 0.13 + hard * 0.11; m.sy = 1 - a * q; m.sx = 1 + a * 0.6 * q; m.relX = r0 + (r1 - r0) * easeOut(p); });
    m.sx = m.sy = 1;
    if (hard > 0.4) await wait(hard * 180);
    if (flip && Math.random() < 0.5) { say(pick(["Та-да!", "Сальто!", "Видал?"]), 1100); await seq([["ss7", 700]]); }
    else if (!flip && !opts.scared) await seq([["jp13", 110 + hard * 120], ["jp1", 70]]);   // выдохнула и выпрямилась
    await seq([["front34", 0]]);
  }

  // Подскок на месте; pose — кадр в воздухе
  async function hop(height = 26, ms = 280, pose) {
    if (pose) setPose(pose);
    await tween(ms, (p) => { m.lift = -height * 4 * p * (1 - p); });
    m.lift = 0;
  }

  // Падение: на поверхность под ней; если под ней ничего — падает за низ экрана и прячется
  async function fall(pose = "fall") {
    m.mode = "air";
    m.surf = null;
    m.hanging = false;
    const below = (s) => { const r = box(s.el); return !s.floor && m.x >= r.left + s.min && m.x <= r.left + s.max && edgeY(s, r) >= m.y + 4; };
    setPose(pose);
    let target = null, best = 1e9;
    for (const s of surfaces) {
      if (!below(s)) continue;
      const y = edgeY(s, box(s.el));
      if (y - m.y < best) { best = y - m.y; target = s; }
    }
    if (!target) {
      const y0 = m.y;
      await tween(700, (p) => { m.y = y0 + (window.innerHeight + H * 1.3 - y0) * p * p; m.rot = Math.sin(p * 20) * 6; });
      m.rot = 0;
      m.mode = "hidden";
      return;
    }
    const s = target;
    const relX = m.x - box(s.el).left;
    const y0 = m.y;
    const e0 = spot(s, relX);
    const ms = clamp(Math.sqrt(Math.max(1, e0.y - y0)) * 38, 240, 900);
    await tween(ms, (p) => {
      m.y = y0 + (spot(s, relX).y - y0) * p * p;
      m.rot = Math.sin(p * 18) * 5;                            // болтается в полёте
      if (p > 0.55 && pose !== "fall") setPose("fall");
    });
    m.rot = 0;
    standOn(s, relX);
    puff(m.x, m.y);
    setPose("crouch");
    await squash(180, 0.2);
    await seq([["front34", 0]]);
  }

  // Падение после того, как отпустили за хвост (лист 22): кувыркается, машет руками, «бежит» по воздуху, приземляется.
  // Кадры полёта с якорем в центре — поднимаем на ~полроста, чтобы ноги приходили на опору
  async function tumbleFall() {
    m.mode = "air";
    m.surf = null;
    m.hanging = false;
    const below = (s) => { const r = box(s.el); return !s.floor && m.x >= r.left + s.min && m.x <= r.left + s.max && edgeY(s, r) >= m.y + 4; };
    let target = null, best = 1e9;
    for (const s of surfaces) {
      if (!below(s)) continue;
      const y = edgeY(s, box(s.el));
      if (y - m.y < best) { best = y - m.y; target = s; }
    }
    const t0 = now();
    let spin = 0;
    const air = (p, long) => {
      const k = Math.floor((now() - t0) / 120);
      if (long && p < 0.45) { setPose(k % 2 ? "fl2" : "fl1"); spin = (now() - t0) * 0.55; m.rot = (spin % 360) * m.face; }   // кувырок
      else { setPose(p < (long ? 0.62 : 0.3) ? "fl3" : k % 2 ? "fl4" : "fl5"); m.rot *= 0.8; }                    // машет руками, «бежит» по воздуху
      m.lift = -H * 0.45;
    };
    if (!target) {                                             // под ней ничего — улетает за низ экрана
      const y0 = m.y;
      await tween(800, (p) => { m.y = y0 + (window.innerHeight + H * 1.5 - y0) * p * p; air(p, true); });
      m.rot = 0; m.lift = 0;
      m.mode = "hidden";
      return;
    }
    const s = target;
    const relX = m.x - box(s.el).left;
    const y0 = m.y;
    const drop = spot(s, relX).y - y0;
    const long = drop > H * 0.8;                               // невысоко — без кувырка, сразу «бежит» по воздуху
    const ms = clamp(Math.sqrt(Math.max(1, drop)) * 46, 360, 1100);
    await tween(ms, (p) => { m.y = y0 + (spot(s, relX).y - y0) * p * p; air(p, long); });
    m.rot = 0; m.lift = 0;
    standOn(s, relX);
    puff(m.x, m.y);
    sound("plop");
    setPose(pick(["fl6", "fl7"]));
    await squash(200, 0.2);
  }

  /* ---------- Висит под линией: на руках, на хвосте; перебирает руками ---------- */
  // Качание маятником вокруг точки хвата
  function swingTween(ms, amp, period = 1100, decay = 2600) {
    const t0 = now();
    return tween(ms, () => { const t = now() - t0; m.rot = amp * Math.sin((t / period) * Math.PI * 2) * Math.exp(-t / decay); });
  }
  // С верха линии — под неё
  async function hangDown(pose = "hangSwing") {
    await load(["hangSad", "hangSwing", "hangSide", "hangJoy", "lineTail", "lineTailL", "lineTailR", "fallScared", "fallYell"]);
    await faceFront();
    setPose("crouch");
    await squash(140, 0.14);
    await hop(16, 200, "apex");
    m.hanging = true;
    setPose(pose);
    sound("tap");
    await swingTween(900, 22, 900, 900);
  }
  // Перебирает руками вдоль линии
  async function brachiate(relX) {
    await load(["hg1", "hg2", "hg7"]);                         // 2026-11-19: боковой вис из листа 45
    const dir = relX > m.relX ? 1 : -1;
    m.face = dir;
    const steps = Math.ceil(Math.abs(relX - m.relX) / (H * 0.32));
    for (let i = 0; i < steps; i++) {
      const from = m.relX, to = i === steps - 1 ? relX : from + dir * H * 0.32;
      setPose(i % 2 ? "hg7" : "hg2");
      await tween(300, (p) => { m.relX = from + (to - from) * ease(p); m.rot = Math.sin(p * Math.PI) * 10 * dir; });
    }
    m.rot = 0;
    setPose("hg1");
  }
  // Слезть: забраться наверх (up) или спрыгнуть вниз
  async function unhang(up) {
    if (!m.hanging) return;
    m.rot = 0;
    if (up || Math.random() < 0.5) {
      setPose("rise");
      m.hanging = false;
      await tween(320, (p) => { m.lift = H * 0.85 * (1 - easeOut(p)) - 30 * Math.sin(p * Math.PI); });
      m.lift = 0;
      puff(m.x, m.y);
      setPose("crouch");
      await squash(150, 0.16);
      await seq([["front34", 0]]);
    } else {
      await fall(Math.random() < 0.5 ? "fallYell" : "fallScared");
    }
  }
  async function hangOnLine() {
    next.hang = now() + rnd(25000, 40000);
    const t = choose({ only: (s) => s.hang, max: 900, near: cursorFresh() ? cursor : null, nearDist: 300 });
    if (!t) return;
    await travel(t);
    if (!m.surf || !m.surf.hang) return;
    const byTail = Math.random() < 0.35;
    if (!byTail) await load(["hg1", "hg2", "hg3", "hg4", "hg5", "hg6", "hg7", "hg8", "hg9", "hg10"]);
    await hangDown(byTail ? "lineTail" : pick(["hg8", "hg10"]));
    if (Math.random() < 0.5) say(pick(["Уи-и!", "Я на лиане!", "Качаюсь!"]), 1200);
    const end = now() + rnd(3500, 6500);
    while (now() < end) {
      if (byTail) {                                            // висит на хвосте и раскачивается
        const t0 = now();
        await tween(1400, () => { const a = Math.sin(((now() - t0) / 700) * Math.PI); m.rot = a * 16; setPose(a > 0.4 ? "lineTailR" : a < -0.4 ? "lineTailL" : "lineTail"); });
      } else if (Math.random() < 0.45 && m.surf.max - m.surf.min > H) {   // перебирает руками
        await brachiate(clamp(m.relX + pick([-1, 1]) * rnd(H * 0.6, H * 1.4), m.surf.min, m.surf.max));
      } else {                                                 // болтает ногами (лист 45): кадр меняется по ходу маятника
        const set = pick([["hg8", "hg10", "hg9"], ["hg3", "hg1", "hg5"], ["hg4", "hg6", "hg7"]]), t0 = now();
        await tween(rnd(1800, 2800), () => {
          const a = Math.sin((now() - t0) / 420);
          m.rot = a * 9;
          setPose(a > 0.35 ? set[0] : a < -0.35 ? set[2] : set[1]);
        });
        m.rot = 0;
      }
    }
    m.rot = 0;
    await unhang();
  }

  /* ---------- Прятки: ныряет за картинку или окно и выныривает из-за другой ---------- */
  // За чем можно спрятаться: картинка, видео или крупная плашка (не тонкая линия)
  function canHide(s) {
    if (!s || s.floor || s.virtual) return false;
    const r = box(s.el);
    return s.edge === "top" && (s.el.tagName === "IMG" || s.el.tagName === "VIDEO" || s.el.tagName === "CANVAS" || r.height >= 60);
  }
  // Нырнуть за край, на котором стоит
  async function dive() {
    setPose("crouch");
    await squash(120, 0.14);
    setPose("rise");
    await tween(420, (p) => {                                              // подпрыгнула и ушла вниз за край
      m.lift = -40 * Math.sin(p * Math.PI) * (1 - p) + H * 1.2 * p * p;
      m.clip = Math.max(0, m.lift);
      if (p > 0.4) setPose("fall");
    });
    m.mode = "hidden";
  }
  // Вынырнуть из-за края s: сначала голова и руки на краю (выглядывает), потом выпрыгивает
  async function emerge(s, relX) {
    standOn(s, relX);
    m.k = 1;
    const ph = FR.peek.h * K;
    m.lift = ph; m.clip = ph;
    m.mode = "ground";
    setPose("peek");
    await tween(380, (p) => { m.lift = ph * (1 - ease(p)); m.clip = m.lift; });   // показалась голова и руки
    m.lift = 0; m.clip = 0;
    m.face = cursor.x > m.x ? 1 : -1;
    await seq([["peekSide", 420]]);
    m.face = -m.face;
    await seq([["peekSide", 380]]);
    if (Math.random() < 0.5) { say(pick(["Ку-ку!", "Бу!", "Тут я!"]), 1000); await seq([["peekWave", 520]]); }
    else await seq([[Math.random() < 0.5 ? "peekSly" : "peek", 480]]);
    // выпрыгивает из-за края
    setPose("rise");
    m.lift = H * 0.55; m.clip = m.lift;
    await tween(300, (p) => { m.lift = H * 0.55 * (1 - ease(p)) - 45 * Math.sin(p * Math.PI); m.clip = Math.max(0, m.lift); if (p > 0.55) setPose("apex"); });
    m.lift = 0; m.clip = 0;
    puff(m.x, m.y);
    setPose("crouch");
    await squash(160, 0.16);
    await seq([["front34", 80], ["stand", 0]]);
  }
  // Спрятаться и вынырнуть в другом месте
  async function hideTo(s, relX) {
    const onScreen = m.y < window.innerHeight - 2 && m.y > H * 0.5 && m.x > 0 && m.x < window.innerWidth;
    if (onScreen && m.mode === "ground") {
      if (!canHide(m.surf)) {                                              // сначала допрыгнуть до картинки рядом
        const h = choose({ only: canHide, max: CFG.hideFrom });
        if (h) await jumpTo(h.s, h.relX);
      }
      if (canHide(m.surf)) await dive();
    }
    m.mode = "hidden";
    await wait(rnd(350, 700));
    // выглядывать можно только из-за настоящего края; на букву, фото и линию — выпрыгивает из-за ближайшей картинки
    if (s.virtual) {
      const h = choose({ only: canHide, near: spot(s, relX), nearDist: 120 });
      if (h) { await emerge(h.s, h.relX); await jumpTo(s, relX); return; }
      standOn(s, relX); m.mode = "ground"; m.lift = -H; await tween(300, (p) => { m.lift = -H * (1 - p); setPose(p < 0.7 ? "fall" : "crouch"); }); m.lift = 0; puff(m.x, m.y); await squash(150, 0.16); setPose("stand");
      return;
    }
    await emerge(s, relX);
  }
  // Вынырнуть после пряток: из-за картинки — выглядывает; на букву, фото, линию — через ближайшую картинку
  async function reappear(t) {
    if (!t) return;
    if (canHide(t.s)) await emerge(t.s, t.relX); else await hideTo(t.s, t.relX);
  }
  // Переместиться: рядом — бегом или прыжком, далеко — спрятаться за картинку и вынырнуть из-за другой
  async function travel(t, opts = {}) {
    if (!t) return;
    const e = spot(t.s, t.relX);
    const d = Math.hypot(e.x - m.x, e.y - m.y);
    const far = d > CFG.hideFrom || opts.magic;
    const lost = m.mode === "hidden" || m.y > window.innerHeight - 2 || m.y < H * 0.5 || m.x < 0 || m.x > window.innerWidth;
    if (lost) await hideTo(t.s, t.relX);                                    // сама за краем экрана — сразу выныривает
    else if (!calm && far && canHide(t.s)) await hideTo(t.s, t.relX);
    else if (t.s === m.surf) await runTo(t.relX);
    else await jumpTo(t.s, t.relX, opts);
  }

  /* ---------- Реплики и эффекты ---------- */
  let sayTimer = 0;
  function say(text, ms = 1700) {
    bubble.textContent = text;
    bubble.classList.toggle("is-shown", !!text);
    clearTimeout(sayTimer);
    sayTimer = setTimeout(() => bubble.classList.remove("is-shown"), ms);
  }
  function fxImg(name, scale = 1) {
    const el = document.createElement("img");
    el.src = src(name);
    el.alt = "";
    el.style.width = ((sizes[name] || { w: 40 }).w * K * scale).toFixed(1) + "px";
    fx.appendChild(el);
    return el;
  }
  function place(el, x, y, rot = 0, scale = 1, op = 1) {
    el.style.transform = "translate(" + x + "px," + y + "px) translate(-50%,-50%) rotate(" + rot + "deg) scale(" + scale + ")";
    el.style.opacity = op;
  }
  function puff(x, y) {
    if (calm) return;
    [-1, 1].forEach((d) => {
      const el = fxImg("puff-1", 1.1);
      tween(450, (p) => place(el, x + d * (14 + 30 * p), y - 8 - 8 * p, 0, 0.6 + 0.6 * p, 1 - p), true).then(() => el.remove());
    });
  }
  function swoosh(x, y, dir) {
    const el = fxImg("swoosh", 1.2);
    tween(320, (p) => place(el, x + dir * 30 * p, y, dir > 0 ? 180 : 0, 1, 1 - p), true).then(() => el.remove());
  }
  function textFx(text, x, y, cls, ms = 750) {
    const el = document.createElement("span");
    el.className = cls;
    el.textContent = text;
    fx.appendChild(el);
    const r = (Math.random() - 0.5) * 10;
    return tween(ms, (p) => place(el, x, y - 34 * p, r, 0.8 + 0.4 * Math.sin(p * Math.PI), p < 0.7 ? 1 : (1 - p) / 0.3), true)
      .then(() => el.remove());
  }

  /* ---------- Звуки (тихие, синтезом; включаются после первого касания страницы) ---------- */
  let ac = null;
  document.addEventListener("pointerdown", () => {
    if (!ac && CFG.sound) { try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { ac = null; } }
  }, { capture: true });
  function sound(type) {
    if (!ac || !CFG.sound) return;
    const t = ac.currentTime;
    const g = ac.createGain();
    g.connect(ac.destination);
    const o = ac.createOscillator();
    o.connect(g);
    const set = (f0, f1, dur, wave = "sine", vol = 1) => {
      o.type = wave;
      o.frequency.setValueAtTime(f0, t);
      o.frequency.exponentialRampToValueAtTime(f1, t + dur);
      g.gain.setValueAtTime(CFG.volume * vol, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.start(t);
      o.stop(t + dur + 0.02);
    };
    if (type === "bonk") set(180, 60, 0.16, "triangle", 1.6);
    else if (type === "squeak") set(900, 1500, 0.14, "square", 0.5);
    else if (type === "throw") set(500, 1200, 0.18, "sine", 0.8);
    else if (type === "plop") set(320, 140, 0.12, "sine", 1.2);
    else if (type === "hit") set(260, 90, 0.08, "square", 0.6);
    else if (type === "whoosh") set(300, 900, 0.12, "triangle", 0.5);
    else set(700, 900, 0.06, "sine", 0.6);
  }

  /* ---------- Поведение ---------- */
  const cursorFresh = () => now() - cursor.t < 5000;
  const idleFor = () => now() - lastActive;
  const roomFor = (w) => m.surf && !m.surf.floor && m.surf.max - m.surf.min > w * K;   // поместится ли кадр шириной w

  /* 2026-11-17: стоит и живёт.
     Взгляд за курсором: курсор перед ней — смотрит на гостя (анфас), сбоку — поворачивает голову (3/4),
     далеко сбоку — смотрит в профиль. Курсор замер неподалёку — с любопытством подходит на пару шагов.
     Между этим — короткие разные паузы (переминается, переступает, вздыхает, оглядывается), каждый раз в своём ритме,
     чтобы не было похоже на программу по кругу. */
  async function idleStand(ms) {
    await faceFront();
    const end = now() + ms;
    let nextFidget = now() + rnd(900, 2200);
    while (now() < end) {
      if (await gaze()) { await wait(rnd(110, 170)); if (now() < nextFidget) continue; }
      if (now() > nextFidget) { await fidget(); nextFidget = now() + rnd(1400, 3400); continue; }
      await wait(rnd(120, 200));
    }
  }
  let approachedAt = 0;                       // на какую остановку курсора уже подходила
  async function gaze() {
    if (!cursorFresh() || m.hanging || m.mode !== "ground" || m.asleep) return false;
    const dx = cursor.x - m.x, dy = cursor.y - (m.y - H * 0.6), d = Math.hypot(dx, dy);
    if (d > 950) return false;
    // курсор замер неподалёку (не ближе страха) и на её высоте — подойти посмотреть, один раз на одну остановку
    if (!calm && now() - cursor.t > 1300 && approachedAt !== cursor.t && m.surf && !m.surf.floor &&
        d > CFG.fearRadius + 100 && d < 560 && Math.abs(dy) < H * 2) {
      approachedAt = cursor.t;
      const dir = dx > 0 ? 1 : -1;
      const step = Math.min(Math.abs(dx) - CFG.fearRadius - 70, H * 1.1);
      const target = clamp(m.relX + dir * step, m.surf.min, m.surf.max);
      if (step > 24 && Math.abs(target - m.relX) > 24) {
        await runTo(target, CFG.runSpeed * 0.7);
        m.face = dir;
        await seq([["front34", 0]]);
        if (Math.random() < 0.4) say(pick(["Что там у тебя?", "М-м?", "Ну-ка, ну-ка…", "Покажи!"]), 1100);
        await seq([["wow", rnd(450, 750)], ["front34", 0]]);
        return true;
      }
    }
    const want = Math.abs(dx) < 70 ? "stand" : Math.abs(dx) > 520 ? "side" : "front34";
    const dir = dx > 0 ? 1 : -1;
    if (want !== "stand" && dir !== m.face && m.pose !== "stand") await seq([["stand", 60]]);   // через анфас, без скачка
    if (want !== "stand") m.face = dir;
    if (m.pose !== want) {
      if ((want === "side" && m.pose === "stand") || (want === "stand" && m.pose === "side")) await seq([["front34", 70]]);
      setPose(want);
    }
    return true;
  }
  // Короткие паузы «живого» персонажа
  async function fidget() {
    const r = Math.random();
    if (r < 0.26) await seq([["ready", rnd(400, 700)], ["stand", 0]]);                       // переминается
    else if (r < 0.48 && m.surf && !m.surf.floor) {                                         // переступила на полшага
      const from = m.relX, to = clamp(from + pick([-1, 1]) * H * 0.08, m.surf.min, m.surf.max);
      await tween(230, (p) => { m.relX = from + (to - from) * ease(p); m.lift = -5 * Math.sin(p * Math.PI); });
      m.lift = 0;
    } else if (r < 0.68) {                                                                  // глянула в сторону
      m.face = pick([-1, 1]);
      await seq([["front34", 70], ["side", rnd(500, 900)], ["front34", 70], ["stand", 0]]);
    } else if (r < 0.76 && cursorFresh() && Math.abs(cursor.x - m.x) > 380) {               // 2026-11-19: всматривается вдаль, ладонь козырьком
      await peerFar();
    } else if (r < 0.84) {                                                                  // вздохнула всем телом
      await tween(760, (p) => { const q = Math.sin(p * Math.PI); m.sy = 1 - 0.028 * q; m.sx = 1 + 0.018 * q; });
      m.sx = m.sy = 1;
    } else {                                                                                // оглянулась на работы за спиной
      await seq([["front34", 70], ["side", 70], ["back34", rnd(500, 850)], ["side", 70], ["front34", 70], ["stand", 0]]);
    }
  }
  const idleStandLong = () => idleStand(rnd(1800, 3000));

  // Обычная прогулка: пробежаться по своей поверхности или перепрыгнуть на соседнюю
  async function wander() {
    if (m.surf && !m.surf.floor && Math.random() < 0.4 && m.surf.max - m.surf.min > 120) {
      const happy = Math.random() < 0.3;                        // иногда бежит вприпрыжку, зажмурившись от радости
      if (happy) await load(JOY);
      await runTo(rnd(m.surf.min, m.surf.max), CFG.runSpeed, happy ? JOY : RUN);
      await idleStand(rnd(600, 1600));
      return;
    }
    const t = choose({ min: 90, max: 640, near: cursorFresh() ? cursor : null, nearDist: 260 });
    if (t) await travel(t);
    await idleStand(calm ? rnd(2500, 5000) : rnd(500, 1400));
  }

  // Гость кликнул — подбежать посмотреть
  function reactClick(x, y) {
    return async () => {
      const t = choose({ near: { x, y }, nearDist: 160, max: 1400 });
      if (t) await travel(t);
      faceTo(x);
      await seq([["front34", 0]]);
      if (Math.random() < 0.3) say(pick(["Что там?", "О!", "Ну-ка, ну-ка…", "Я с тобой!"]), 1100);
      await seq([["wow", rnd(500, 900)], ["front34", 0]]);
    };
  }

  // Открылось окно, просмотр или сторис — выныривает там
  async function followLayer() {
    await wait(280);
    scan();
    const t = choose({ near: cursorFresh() ? cursor : { x: window.innerWidth / 2, y: window.innerHeight / 2 }, nearDist: 280, only: canHide }) ||
      choose({ near: { x: window.innerWidth / 2, y: window.innerHeight / 2 }, nearDist: 280 });
    if (Math.random() < 0.5) say(pick(["Подожди меня!", "Я с тобой!", "Иду-иду!"]), 1200);
    if (t) await travel(t, { magic: true });
    const L = layerNow();
    if (L !== lightbox && L !== document.body && L !== wall && m.mode === "ground" && Math.random() < 0.6) {
      // 2026-11-17: открыли кейс — оглядывается на него вместе с гостем и что-то говорит
      faceTo(window.innerWidth / 2);
      await seq([["front34", 70], ["side", 70], ["back34", rnd(600, 900)]]);
      say(pick(["О, этот кейс я люблю!", "Смотри, какие работы!", "Тут интересно!", "Листай, листай!"]), 1500);
      await seq([["back34", rnd(500, 800)], ["side", 70], ["front34", 0]]);
    }
    if (layerNow() === lightbox) {                         // любуется работой, повернувшись спиной, и машет
      // 2026-11-19 (лист 34): садится на край и смотрит вместе с гостем; иногда, как раньше, стоит спиной и машет
      if (Math.random() < 0.75) await sitWatch(true, rnd(3500, 6000));
      else {
        await load(["backWave"]);
        await seq([["front34", 70], ["side", 70], ["back34", 80], ["back", 900]]);
        if (Math.random() < 0.5) { setPose("backWave"); say(pick(["Красиво…", "Вот это да!", "Ух!"]), 1300); await wait(900); }
        await seq([["back", 900]]);
        await faceFront();
      }
    }
  }

  // Показать лучшую работу: показывает пальцем, машет и подпрыгивает от радости
  function favoriteSurface() {
    const sel = CFG.favorites.join(",");
    const list = surfaces.filter((s) => s.el.matches(sel) && now() - (recentSpots.get(s.el) || -1e9) > 120000);
    return list.length ? pick(list) : null;
  }
  async function pointFavorite() {
    next.favorite = now() + rnd(30000, 45000);
    const s = favoriteSurface();
    if (!s) return;
    await load(["point"]);
    recentSpots.set(s.el, now());
    const target = s.el;
    const relX = rnd(s.min + (s.max - s.min) * 0.25, s.max - (s.max - s.min) * 0.25);
    await travel({ s, relX });
    target.classList.add("monkey-spot");
    setTimeout(() => target.classList.remove("monkey-spot"), 4500);
    say(pick(["Глянь сюда!", "Вот это огонь!", "Смотри, тут круто!", "Лучшая работа!", "Сюда, сюда!"]), 2600);
    m.face = cursor.x > m.x ? -1 : 1;                       // на кадре показывает влево — к гостю зеркалим
    await seq([["point", 900]]);
    for (let i = 0; i < 2; i++) {
      await hop(24, 300, "yay");
      setPose("cheer");
      await squash(120, 0.08);
    }
    await seq([["point", 700], ["wave", 700], ["front34", 0]]);
  }

  // Карточка «в разработке»: опора — её картинка или сама карточка (раньше искалась только карточка, а опорой была картинка внутри — не находилась)
  const stubSurface = () => surfaces.filter((x) => !x.floor && !x.virtual && x.el.closest && x.el.closest(CFG.stubborn) && x.edge === "top").sort((p, q) => (q.max - q.min) - (p.max - p.min))[0] || null;
  // Неработающая кнопка: прыгает по ней, злится и стучит посохом
  async function bashButton() {
    next.bash = now() + rnd(60000, 90000);
    const s = stubSurface();
    if (!s) return;
    await load(["angry", "stAngry", "stStand"]);
    const el = s.el.closest(CFG.stubborn) || s.el;            // нажимается и трясётся вся карточка
    await travel({ s, relX: (s.min + s.max) / 2 });
    say("О, кнопка!", 1000);
    await seq([["wow", 400]]);
    for (let i = 0; i < 3; i++) {                          // прыгает — кнопка нажимается
      setPose("crouch");
      await squash(90, 0.1);
      await hop(30, 300, "apex");
      el.classList.add("monkey-press");
      sound("tap");
      setPose("crouch");
      await wait(90);
      el.classList.remove("monkey-press");
    }
    await seq([["angry", 600]]);
    say(pick(["Не работает?!", "Эй! Работай!", "Сломалась?!"]), 1400);
    root.classList.add("is-angry");
    for (let i = 0; i < 4; i++) {                          // стучит посохом со злости
      await seq([["stStand", 140]]);
      setPose("stAngry");
      el.classList.remove("monkey-shake");
      void el.offsetWidth;
      el.classList.add("monkey-shake");
      sound("bonk");
      textFx(pick(["БАМ!", "БУМ!", "ТУК!"]), m.x + m.face * H * 0.4, m.y - 10, "monkey-fx__bam");
      await squash(140, 0.12);
    }
    setTimeout(() => el.classList.remove("monkey-shake"), 400);
    root.classList.remove("is-angry");
    say("Хм! Ну и ладно.", 1400);
    await seq([["angry", 500], ["front34", 300], ["side", 300]]);
    await travel(choose({ min: 260, max: 900 }));
  }

  // 2026-11-19 (лист 39): помахать — рука поднимается через промежуточные кадры, машет туда-сюда, обе руки, улыбка
  const WAVE = ["wv1", "wv2", "wv3", "wv4", "wv5", "wv6", "wv7", "wv8", "wv9", "wv10", "wv11", "wv12"];
  async function waveHello(times = 2, both = true) {
    await load(WAVE);
    await seq([["stand", 0], ["wv2", 160], ["wv3", 130], ["wv4", 130]]);
    for (let i = 0; i < times; i++) await seq([["wv5", 130], ["wv6", 150], ["wv5", 130], ["wv4", 130]]);
    if (both) await seq([["wv7", 140], ["wv8", 140], ["wv9", 150], ["wv10", 380]]);
    await seq([["wv11", 300], ["wv12", 150], ["stand", 0]]);
  }
  // 2026-11-19 (лист 40): хохот — хихикнула в кулак, расхохоталась, держится за живот, согнулась, тычет пальцем, вытирает слезу
  const LAUGH = ["lg1", "lg2", "lg3", "lg4", "lg5", "lg6", "lg7", "lg8", "lg9", "lg10", "lg11", "lg12"];
  async function laughFit(point) {
    await load(LAUGH);
    await seq([["stand", 0], ["lg2", 220], ["lg3", 180], ["lg4", 200], ["lg5", 160]]);
    for (let i = 0; i < 2; i++) await seq([["lg6", 140], ["lg8", 140], ["lg7", 160], ["lg6", 140]]);
    await seq([["lg9", 420]]);
    if (point) await seq([["lg10", 600]]);
    await seq([["lg11", 650], ["lg12", 300], ["stand", 0]]);
  }
  const TOSS = ["tb1", "tb2", "tb3", "tb4", "tb5", "tb6", "tb7", "tb8", "tb9", "tb10", "tb11"];
  const EAT = ["eb1", "eb2", "eb3", "eb4", "eb5", "eb6", "eb7", "eb8", "eb9", "eb10", "eb11", "eb12"];
  const SLEEP = ["sl2", "sl3", "sl4", "sl5", "sl6", "sl7", "sl8", "sl9", "sl10", "sl11", "sl12"];

  // Бросить банан в курсор: замах, бросок, хохочет
  async function throwBanana() {
    next.throw = now() + rnd(14000, 24000);
    await load(TOSS);
    const tx = cursorFresh() ? cursor.x : rnd(80, window.innerWidth - 80);
    const ty = cursorFresh() ? cursor.y : rnd(120, window.innerHeight - 120);
    await faceSide(tx > m.x ? 1 : -1);
    // 2026-11-19 (лист 46): достала банан, перехватила, хитрый замах за голову, бросок, рука вперёд
    await seq([["tb1", 260], ["tb2", 200], ["tb3", 220], ["tb4", 260], ["tb5", 70]]);
    setPose("tb6");
    sound("throw");
    const x0 = m.x + m.face * H * 0.4, y0 = m.y - H * 0.6;
    const el = fxImg("banana", 1.3);
    const hit = cursorFresh();
    const arc = 110 + Math.abs(tx - x0) * 0.15;
    const dir = m.face;
    tween(650, (p) => place(el, x0 + (tx - x0) * p, y0 + (ty - y0) * p - arc * 4 * p * (1 - p), 720 * p * dir), true)
      .then(() => {
        if (hit) { sound("plop"); textFx("Бац!", tx, ty - 14, "monkey-fx__bam"); }
        let vy = -5, yy = ty, xx = tx;
        return tween(900, (p) => { vy += 0.7; yy += vy; xx += dir * 1.5; place(el, xx, yy, 720 + 300 * p, 1, 1 - p); }, true);
      })
      .then(() => el.remove());
    await wait(300);
    await seq([["tb7", 380]]);                                 // ладонь козырьком — следит, долетит ли
    say(pick(["Хе-хе!", "Лови!", "Попал!", "Бананчик!"]), 1100);
    if (hit) {                                                 // попала: прыжок от радости и хохот
      await seq([["tb8", 220]]);
      await hop(20, 300, "tb9");
      setPose("tb10");
      await tween(700, (p) => { m.lift = -Math.abs(Math.sin(p * 10)) * 4; });
      m.lift = 0;
    } else await seq([["tb8", 500]]);
    await seq([["tb11", 450], ["front34", 0]]);
  }

  // Ест банан: садится, жуёт, довольна
  async function eatBanana() {
    next.trick = now() + rnd(15000, 25000);
    // 2026-11-19 (лист 38): достала банан из-за плеча, чистит, садится по-турецки, кусает, жуёт, довольна
    await load(EAT);
    await faceFront();
    await seq([["eb1", 420], ["eb2", 420], ["eb3", 260]]);
    setPose("eb4");
    await squash(140, 0.06);
    if (Math.random() < 0.5) say(pick(["Ням-ням!", "Перекус!", "Бананчик!"]), 1200);
    for (let i = 0; i < 3; i++) {
      await seq([["eb5", 260], ["eb6", 300], ["eb7", 380], ["eb8", 300]]);
      for (let j = 0; j < 2; j++) await seq([["eb9", rnd(220, 300)], ["eb10", rnd(220, 300)]]);
      if (i === 1) textFx("ням", m.x + H * 0.25, m.y - H * 0.75, "monkey-fx__z", 900);
      if (i < 2) await seq([["eb4", 260]]);
    }
    await seq([["eb11", 600], ["eb12", 700]]);
    await hop(14, 260, "yay");
    await seq([["stand", 0]]);
  }

  // Кунг-фу: поклон, стойка, удар, удар ногой, вертушка, шпагат в прыжке, приземление, поклон
  async function kungFu() {
    next.trick = now() + rnd(15000, 25000);
    // 2026-11-19 (лист 42): поклон, стойка, замах и удар рукой, колено, высокий удар ногой, разворот через спину, подсечка, выпад, стойка
    await load(["kfSplit", "ku1", "ku2", "ku3", "ku4", "ku5", "ku6", "ku7", "ku8", "ku9", "ku10", "ku11", "ku12"]);
    await faceSide(cursor.x > m.x ? 1 : -1);
    await seq([["ku1", 700], ["ku2", 260], ["ku3", 220], ["ku4", 130]]);
    const fist = () => swoosh(m.x + m.face * H * 0.45, m.y - H * 0.6, m.face);
    setPose("ku5"); fist(); sound("whoosh"); textFx(pick(["Кия!", "Ха!"]), m.x + m.face * H * 0.5, m.y - H * 0.95, "monkey-fx__bam", 600);
    await wait(320);
    await seq([["ku4", 110], ["ku6", 170]]);
    setPose("ku7"); fist(); sound("whoosh");
    await wait(360);
    await seq([["ku8", 120]]); sound("whoosh");
    await seq([["ku9", 140], ["ku8", 110], ["ku10", 260]]);                // вертушка через спину и подсечка
    puff(m.x + m.face * H * 0.4, m.y);
    if (Math.random() < 0.5) await hop(H * 0.35, 520, "kfSplit");          // иногда шпагат в прыжке (лист 11)
    await seq([["ku11", 380], ["ku12", 300]]);
    await squash(140, 0.1);
    await seq([["ku1", 800], ["front34", 0]]);
  }

  // Посох: стоит с посохом, крутит над головой, выпад, подбрасывает и ловит, опирается, кланяется
  async function staffShow() {
    next.trick = now() + rnd(15000, 25000);
    // 2026-11-19 (лист 43): с посохом, перехватила наискосок, крутит над головой, выпад, подбросила и поймала, оперлась, поклон
    await load(["sf1", "sf2", "sf3", "sf4", "sf5", "sf6", "sf7", "sf8", "sf9", "sf10", "sf11"]);
    await faceFront();
    await seq([["sf1", 700], ["sf2", 380]]);
    m.face = cursor.x > m.x ? 1 : -1;                          // поворот с посохом — без промежуточных кадров (там нет посоха)
    for (let i = 0; i < 4; i++) { setPose(i % 2 ? "sf4" : "sf3"); sound("whoosh"); await wait(150); }   // крутит посох
    await seq([["sf5", 380]]);
    swoosh(m.x + m.face * H * 0.8, m.y - H * 0.5, m.face);
    textFx("Хоп!", m.x + m.face * H * 0.7, m.y - H * 0.9, "monkey-fx__bam", 600);
    await wait(250);
    await seq([["sf6", 200]]);
    setPose("sf7");                                            // подбросила
    await hop(10, 220);
    await wait(380);
    await seq([["sf8", 300], ["sf6", 200]]);                   // поймала
    if (Math.random() < 0.5) say(pick(["Вжух!", "Мастер посоха!", "Видал?"]), 1200);
    await seq([["sf9", 1100], ["sf10", 500], ["sf11", 800], ["front34", 0]]);
  }

  // Сальто на месте (лист 19): присела, взлетела, крутится в группировке, приземлилась, «та-да»
  async function somersault() {
    next.trick = now() + rnd(15000, 25000);
    if (m.y < H * 2.3) { await wander(); return; }            // над ней мало места — сальто упрётся в край экрана
    await load(["ss1", "ss2", "ss3", "ss5", "ss6", "ss7"]);
    await faceSide(cursor.x > m.x ? 1 : -1);
    setPose("ss1");
    await squash(200, 0.12);
    sound("whoosh");
    await tween(760, (p) => {
      setPose(p < 0.15 ? "ss2" : p < 0.82 ? "ss3" : "ss5");
      m.lift = -H * 0.5 - H * 0.95 * 4 * p * (1 - p);
      m.rot = 360 * ease(clamp((p - 0.15) / 0.67, 0, 1)) * m.face;
    });
    m.rot = 0; m.lift = 0;
    puff(m.x, m.y);
    setPose("ss6");
    await squash(170, 0.15);
    say(pick(["Та-да!", "Сальто!", "Видал? Без страховки!"]), 1200);
    await seq([["ss7", 900], ["front34", 0]]);
  }

  // Ноутбук (лист 24): приходит с ноутбуком, садится «работать»: тычет пальцем, чешет голову, печатает, «ой!», закрывает
  async function laptopWork() {
    next.trick = now() + rnd(15000, 25000);
    if (!roomFor(330)) { await wander(); return; }
    await load(["lp1", "lp2", "lp3", "lp4", "lp5", "lp6", "lp7"]);
    // идёт с ноутбуком под мышкой
    const dir = m.relX < (m.surf.min + m.surf.max) / 2 ? 1 : -1;
    const from = m.relX, to = clamp(from + dir * H * 0.8, m.surf.min + H * 0.6, m.surf.max - H * 0.6);
    m.face = to >= from ? 1 : -1;
    setPose("lp1");
    await tween(Math.max(300, (Math.abs(to - from) / (CFG.runSpeed * 0.35)) * 1000), (p) => {
      m.relX = from + (to - from) * p;
      m.lift = -Math.abs(Math.sin(p * Math.PI * 4)) * 3;
    });
    m.lift = 0;
    setPose("lp2");
    say(pick(["Так, поработаем…", "Дизайнер, подвинься!", "Сейчас всё сверстаю!"]), 1500);
    await wait(900);
    const end = now() + rnd(5000, 8000);
    let oops = false;
    while (now() < end) {
      const r = Math.random();
      if (r < 0.4) {                                           // печатает быстро двумя руками
        setPose("lp5");
        for (let i = 0; i < 8; i++) { sound("tap"); m.lift = -(i % 2) * 1.5; await wait(95); }
        m.lift = 0;
      } else if (r < 0.62) {                                   // тычет одним пальцем, сосредоточенно
        setPose("lp3");
        for (let i = 0; i < 3; i++) { sound("tap"); await squash(120, 0.03); await wait(260); }
      } else if (r < 0.85) {                                   // чешет голову
        setPose("lp4");
        say(pick(["Где тут кнопка «Сделать красиво»?", "Хм… а это куда?", "Слои… слои… сколько слоёв!", "Кернинг… это едят?"]), 1800);
        await wait(1400);
      } else if (!oops) {                                      // что-то пошло не так
        oops = true;
        setPose("lp6");
        sound("squeak");
        say(pick(["Ой! Что я нажала?!", "Всё пропало! …Ctrl+Z!", "Оно само!"]), 1500);
        await hop(10, 220);
        await wait(700);
      }
      setPose("lp2");
      await wait(rnd(250, 500));
    }
    setPose("lp7");
    say(pick(["Готово! Шедевр!", "Сохранила. Наверное.", "Финал_v8.psd!"]), 1600);
    await wait(1300);
    await seq([["stand", 0]]);
  }

  /* ---------- 2026-11-19: сценки из листов 31–36 (промпт 037). В каждой 10–12 кадров — движения без рывков ---------- */
  const CHIPS = ["ch1", "ch2", "ch3", "ch4", "ch5", "ch6", "ch7", "ch8", "ch9", "ch10", "ch11", "ch12"];
  const PHOTO = ["ph1", "ph2", "ph3", "ph4", "ph5", "ph6", "ph7", "ph8", "ph9", "ph10", "ph11", "ph12"];
  const PASTE = ["ps1", "ps2", "ps3", "ps4", "ps5", "ps6", "ps7", "ps8", "ps9", "ps10", "ps11", "ps12"];
  const SIT = ["vw1", "vw2", "vw3", "vw4", "vw5", "vw6", "vw7", "vw8", "vw9", "vw10", "vw11", "vw12"];
  const SITX = ["vc1", "vc2", "vc8", "vc9", "vc10", "vc11", "vc12", "vc13", "vc14"];
  const HOLD = ["hd1", "hd2", "hd3", "hd4", "hd5", "hd6", "hd7", "hd8", "hd9", "hd10", "hd11", "hd12"];
  // Где играть сценку: верхний край элемента из нужного раздела, на котором хватает места
  const SCENE = {
    chips: '[data-category="packaging"], .pack-pick, .pack-fig',
    photo: '[data-category="smm"], .smm-item, .insta, .reel, .hl-card',
    paste: '[data-category="side"]',
  };
  function sceneSurface(sel, w) {
    const list = surfaces.filter((s) => !s.floor && !s.virtual && s.edge === "top" && s.el.closest && s.el.closest(sel) && s.max - s.min > w * K);
    return list.length ? pick(list) : null;
  }
  // Пройти кусок пути шагом по кадрам walk (а не бегом): кадры меняются по пройденному пути
  async function stepTo(relX, walk, speed = CFG.runSpeed * 0.32) {
    const from = m.relX, to = clamp(relX, m.surf.min, m.surf.max);
    if (Math.abs(to - from) < 4) return;
    m.face = to > from ? 1 : -1;
    let walked = 0, last = from;
    await tween((Math.abs(to - from) / speed) * 1000, (p) => {
      m.relX = from + (to - from) * p;
      walked += Math.abs(m.relX - last); last = m.relX;
      setPose(walk[Math.floor(walked / (H * 0.18)) % walk.length]);
      m.lift = -Math.abs(Math.sin((walked / (H * 0.18)) * Math.PI)) * 2.5;
    });
    m.lift = 0;
  }
  // Белая вспышка фотоаппарата (кадр ph8)
  function flash(x, y) {
    const el = document.createElement("span");
    el.className = "monkey-fx__flash";
    fx.appendChild(el);
    tween(260, (p) => place(el, x, y, 0, 0.4 + 1.6 * p, p < 0.25 ? 1 : 1 - (p - 0.25) / 0.75), true).then(() => el.remove());
  }

  // «Кибер-Хруст»: у карточки «Упаковка» достаёт пачку чипсов, ест, вытряхивает крошки, мнёт пачку и бросает через плечо
  async function chipsSnack() {
    next.trick = now() + rnd(15000, 25000);
    next.scene = now() + rnd(40000, 60000);
    await load(CHIPS);
    const s = sceneSurface(SCENE.chips, 260);
    if (s && s !== m.surf) await travel({ s, relX: rnd(s.min + 40, s.max - 40) });
    await faceFront();
    m.face = cursor.x < m.x ? -1 : 1;
    await seq([["front34", 90], ["ch1", 650]]);
    say(pick(["Кибер-Хруст!", "Мои любимые!", "Перекус дизайнера!"]), 1400);
    await seq([["ch2", 260], ["ch3", 300]]);
    sound("hit");
    await seq([["ch4", 380], ["ch5", 300], ["ch6", 260]]);
    for (let i = 0; i < 3; i++) {                             // жуёт с хрустом
      await seq([["ch7", rnd(230, 300)], ["ch8", rnd(230, 300)]]);
      sound("tap");
      if (i === 1) textFx("хрум!", m.x + m.face * H * 0.3, m.y - H * 0.8, "monkey-fx__z", 800);
    }
    await seq([["ch9", 700], ["ch10", 650]]);
    say(pick(["Уже всё?!", "Где ещё?", "Мало…"]), 1200);
    await seq([["ch11", 500]]);
    sound("throw");
    await seq([["ch12", 650], ["front34", 120], ["stand", 0]]);
  }

  // Фотограф: в разделе SMM подходит, наводит камеру, щёлкает со вспышкой, смотрит снимок, гордо кивает
  async function photoShoot() {
    next.trick = now() + rnd(15000, 25000);
    next.scene = now() + rnd(40000, 60000);
    await load(PHOTO);
    const s = sceneSurface(SCENE.photo, 300);
    if (s && s !== m.surf) await travel({ s, relX: rnd(s.min + 40, s.max - 120) });
    if (!m.surf || m.surf.floor) return;
    const dir = m.relX < (m.surf.min + m.surf.max) / 2 ? 1 : -1;
    await faceSide(dir);
    await stepTo(m.relX + dir * H * 0.55, ["ph1", "ph2"]);
    await seq([["ph3", 420]]);
    say(pick(["О, какой кадр!", "Замри!", "Для Инстаграма!"]), 1200);
    await seq([["ph4", 260], ["ph5", 240], ["ph6", 380], ["ph7", 320]]);
    setPose("ph8");
    sound("tap");
    flash(m.x + m.face * H * 0.5, m.y - H * 0.66);
    await wait(380);
    await seq([["ph7", 200], ["ph9", 320], ["ph10", 800]]);
    say(pick(["Шедевр!", "Огонь, а не пост!", "Лайк обеспечен!"]), 1300);
    await seq([["ph11", 600], ["ph12", 1000], ["front34", 100], ["stand", 0]]);
  }

  // Расклейщик: в «Брендах 360°» приносит рулон, раскатывает плакат по краю, проходит валиком, любуется и уносит валик
  async function pasteFlyer() {
    next.trick = now() + rnd(15000, 25000);
    next.scene = now() + rnd(40000, 60000);
    await load(PASTE);
    const s = sceneSurface(SCENE.paste, 520) || (roomFor(520) ? m.surf : null);
    if (!s) return;
    if (s !== m.surf) await travel({ s, relX: s.min + 60 });
    const dir = m.relX < (m.surf.min + m.surf.max) / 2 ? 1 : -1;
    await faceSide(dir);
    await stepTo(m.relX + dir * H * 0.6, ["ps1", "ps2"]);
    say(pick(["Наружка!", "Сейчас наклеим!", "Реклама сама себя не повесит!"]), 1400);
    await seq([["ps3", 300], ["ps4", 360], ["ps5", 380], ["ps6", 380]]);
    for (const [p, ms] of [["ps7", 340], ["ps8", 340], ["ps7", 300], ["ps8", 340]]) {   // катит валик
      setPose(p);
      const from = m.relX;
      await tween(ms, (q) => { m.relX = clamp(from + dir * H * 0.05 * q, m.surf.min, m.surf.max); });
    }
    await seq([["ps9", 700]]);
    say(pick(["Уф! Готово!", "Ровно легло!", "Вот это билборд!"]), 1300);
    await seq([["ps10", 800], ["ps11", 900]]);
    await stepTo(m.relX + dir * H * 0.5, ["ps12", "ps1"], CFG.runSpeed * 0.28);
    await seq([["side", 150], ["front34", 100], ["stand", 0]]);
  }

  // Нижний край картинки, на который можно сесть, свесив ноги (2026-11-23, его замечание: сидела «в воздухе» —
  // на верхе букв, на линиях и на верхнем крае картинки, ноги висели поверх рисунка).
  // В просмотре — нижний край открытой картинки; на странице — ближайшая картинка, под краем которой пусто
  // (ноги свисают на фон, а не на соседнюю картинку). Нет такого края — null
  function bottomSeat() {
    const L = layerNow();
    const legs = H * 0.2;                                       // насколько ноги свисают ниже сиденья
    let list;
    if (L === lightbox) list = [lightbox.querySelector("#lightbox-insta:not([hidden])") || lightbox.querySelector(".lightbox__img")];
    else list = [...L.querySelectorAll("img, video, canvas, .brand-shot")].filter((el) => !root.contains(el) && !fx.contains(el) &&
      !(L === document.body && el.closest(".modal, .lightbox, .reels-wall")));
    const cands = [];
    for (const el of list) {
      if (!el || !shown(el)) continue;
      const r = box(el);
      if (r.width < 120 || r.height < 40) continue;
      const y = r.bottom;
      if (y < H * 1.05 || y + legs > window.innerHeight - 4) continue;
      const pad = Math.min(cornerR(el, r), r.height / 2, r.width / 2) + footPad() + 4;
      const x1 = Math.max(r.left + pad, 20), x2 = Math.min(r.right - pad, window.innerWidth - 20);
      if (x2 - x1 < 40) continue;
      const x = clamp(m.x, x1, x2);
      if (!topVisible(el, y - 3, x)) continue;                  // сам край виден
      if (L !== lightbox) {                                     // под краем пусто: не картинка, не кнопка, не карточка
        const below = document.elementFromPoint(x, y + legs * 0.6);
        if (!below || below.closest("img, video, canvas, button, a, .brand-shot, .work-card, .case-tile, .insta")) continue;
      }
      cands.push({ s: { el, edge: "bottom", min: x1 - r.left, max: x2 - r.left, solid: true, seat: true }, relX: x - r.left, d: Math.hypot(x - m.x, y - m.y) });
    }
    if (!cands.length) return null;
    cands.sort((a, b) => a.d - b.d);
    return cands[0].d < (L === lightbox ? 1e9 : 700) ? cands[0] : null;
  }

  // Сидит и смотрит. edge — на нижнем крае картинки, ноги свисают (vw), иначе по-турецки (vc). Удивляется, хлопает
  async function sitWatch(edge = Math.random() < 0.65, ms = rnd(4500, 7000)) {
    next.trick = now() + rnd(15000, 25000);
    // Свесив ноги — только на нижнем крае картинки. Нет края рядом — садится по-турецки там, где стоит
    if (edge) {
      const t = m.surf && m.surf.seat && surfaceOk(m.surf) ? null : bottomSeat();
      if (t) await travel(t, { magic: layerNow() === lightbox });
      if (!(m.surf && m.surf.seat)) edge = false;
    }
    await load(edge ? SIT : SITX);
    await faceFront();
    if (edge) {
      await seq([["vw1", 160], ["vw2", 220], ["vw3", 500], ["vw4", 600]]);
      const end = now() + ms;
      while (now() < end) {
        await seq([["vw5", 260], ["vw6", rnd(1200, 2000)], ["vw5", 220], ["vw4", rnd(600, 1000)]]);
      }
      await seq([["vw7", 300], ["vw8", 400], ["vw9", 450], ["vw10", 700]]);
      say(pick(["Вот это да!", "Ух ты!", "Красота!"]), 1200);
      for (let i = 0; i < 3; i++) { await seq([["vw11", 150], ["vw12", 150]]); sound("tap"); }
      await seq([["vw7", 300], ["vw2", 220], ["vw1", 160], ["stand", 0]]);
    } else {
      await seq([["vc1", 160], ["vc2", 220], ["vc8", 900]]);
      const end = now() + ms;
      while (now() < end) await seq([["vc9", rnd(700, 1200)], ["vc8", rnd(700, 1200)]]);
      await seq([["vc10", 400], ["vc11", 450], ["vc12", 800]]);
      say(pick(["Вот это да!", "Ух ты!", "Красота!"]), 1200);
      for (let i = 0; i < 3; i++) { await seq([["vc13", 150], ["vc14", 150]]); sound("tap"); }
      await seq([["vc8", 300], ["vc2", 220], ["vc1", 160], ["stand", 0]]);
    }
  }

  // Смотрит вдаль, приложив ладонь ко лбу (в сторону курсора или куда-нибудь)
  async function peerFar(dir = cursorFresh() ? (cursor.x > m.x ? 1 : -1) : pick([-1, 1])) {
    await load(["hd11", "hd12"]);
    await faceSide(dir);
    await seq([["hd11", 300], ["hd12", rnd(900, 1400)], ["hd11", 250], ["side", 100], ["front34", 100], ["stand", 0]]);
  }

  // Дверь Game (листы 26, 28): на карточке «в разработке» появляется дверь. Стучит, открывает, заглядывает — там игра!
  // «Я тоже хочу!» — дверь захлопывается у неё перед носом. Обижается, просится обратно. Дверь — отдельная картинка в слое эффектов
  const door = document.createElement("img");
  door.className = "monkey-fx__door";
  door.alt = "";
  door.style.display = "none";
  fx.appendChild(door);
  let doorAt = null;                                           // { name, s, relX, op } — пока дверь видна; рисуется в draw()
  function drawDoor() {
    if (!doorAt || !doorAt.s.el.isConnected) { door.style.display = "none"; return; }
    const f = DOOR[doorAt.name];
    const w = f.w * K, h = f.h * K, p = spot(doorAt.s, doorAt.relX);
    const url = frameSrc(doorAt.name);
    if (!door.src.endsWith(url)) door.src = url;
    door.style.display = "";
    door.style.width = w.toFixed(1) + "px";
    door.style.height = h.toFixed(1) + "px";
    door.style.transform = "translate(" + (p.x - f.ax * w).toFixed(1) + "px," + (p.y - f.ay * h).toFixed(1) + "px)";
    door.style.opacity = doorAt.op;
  }
  const doorsReady = () => Promise.all(Object.keys(DOOR).map((n) => new Promise((res) => { const im = new Image(); im.onload = im.onerror = res; im.src = frameSrc(n); })));
  // Опора для двери — нижний край карточки Game (внутри карточки, у подписи «В разработке»). В общий список опор не входит:
  // туда она приходит только ради двери. Нужен виден весь край и место над ним под дверь (1,45 роста)
  function gameSpot() {
    const card = document.querySelector(CFG.gameCard);
    if (!card || layerNow() !== document.body || !shown(card)) return null;
    const r = box(card);
    if (r.width < 120 || r.bottom > window.innerHeight - 6 || r.bottom - Math.max(r.top, 0) < H * 1.5 || r.bottom < H * 1.7) return null;
    if (!topVisible(card, r.bottom - 3, r.left + r.width / 2)) return null;
    const pad = Math.min(cornerR(card, r), r.height / 2, r.width / 2) + footPad() + 4;
    return { el: card, edge: "bottom", min: pad, max: r.width - pad, solid: true, game: true };
  }
  async function doorVisit() {
    next.door = now() + rnd(70000, 110000);
    const s = gameSpot();
    if (!s) return;
    // 2026-11-17 (его замечание: стучала и толкала косяк): всё считается от того, чего касается рука.
    // Единица — пиксель кадра (×K). Дверь door1: полотно 14–86% ширины (250), ручка на 79% и 190 над землёй;
    // door2 — ручка на 55%, door3 — на 42%, проём 55–85%. Рука в кадре: dr1 +108 от якоря на высоте 140,
    // dr2 +105 на 117, dr3 (спиной) +90, dr8 +112, dr10 +105 на 145. Она стоит перед дверью (слой двери ниже)
    const F = K, D_HALF = 125;                                 // полширины двери
    const at = (handOnDoor, handOff) => D + handOnDoor * F - handOff * F;   // где стоять, чтобы рука была в точке двери
    const BACK = H * 0.3;                                      // запас слева на отлёт от захлопнувшейся двери
    const need = (D_HALF + 130) * F + BACK, room = s.max + footPad() - s.min;
    if (room < need) return;
    await Promise.all([load(["dr1", "dr2", "dr3", "dr4", "dr5", "dr6", "dr8", "dr9", "dr10"]), doorsReady()]);
    const left = s.min + (room - need) / 2;
    const D = left + BACK + 130 * F;                           // центр двери; правый край двери — D + 125·K
    const doorX = D;
    const meX = at(25, 108);                                   // кулак dr1 на полотне (60% ширины двери)
    const glide = (to, ms, lift) => { const r0 = m.relX, l0 = m.lift; return tween(ms, (p) => { const e = ease(p); m.relX = r0 + (to - r0) * e; m.lift = l0 + ((lift === undefined ? l0 : lift) - l0) * e; }); };
    if (m.surf && m.surf.el === s.el) await runTo(meX);
    else {
      // издалека или из-за края экрана — сначала вынырнуть из-за картинки рядом, потом допрыгнуть до нижнего края карточки
      const e = spot(s, meX);
      const lost = m.mode === "hidden" || m.y > window.innerHeight - 2 || m.y < H * 0.5 || m.x < 0 || m.x > window.innerWidth;
      if (lost || Math.hypot(e.x - m.x, e.y - m.y) > CFG.hideFrom) {
        const h = choose({ only: canHide, near: e, nearDist: 160 });
        if (h) await travel(h, { magic: true });
      }
      await jumpTo(s, meX);
    }
    if (!m.surf || m.surf.el !== s.el) return;                // опоры пересоздаются при каждом осмотре — сравнивать по элементу
    try {
      m.face = 1;
      await seq([["front34", 60], ["side", 0]]);
      doorAt = { name: "door1", s, relX: doorX, op: 0 };      // дверь проявляется за ней
      const dp = spot(s, doorX);
      puff(dp.x, dp.y);
      await tween(350, (p) => { doorAt.op = p; });
      say("О! Дверь!", 1100);
      await wait(700);
      const knock = spot(s, D + 25 * F);
      for (let i = 0; i < 3; i++) {                            // стучит кулаком по полотну
        setPose("dr1");
        sound("tap");
        textFx("тук", knock.x + 6, knock.y - 175 * F, "monkey-fx__bam", 500);
        await squash(110, 0.04);
        await seq([["side", 140]]);
      }
      say("Тук-тук! Можно?", 1300);
      await wait(800);
      await glide(at(72, 105), 220);                           // подходит к ручке
      setPose("dr2");                                          // подпрыгивает и повисает на ручке
      await glide(m.relX, 180, -(190 - 117) * F);
      await wait(450);
      doorAt.name = "door2"; sound("whoosh");                  // дверь подаётся — она едет вместе с ручкой
      await glide(at(12, 105), 260, -(187 - 117) * F);
      await wait(350);
      doorAt.name = "door3";                                   // открылась — там игра
      await glide(at(-20, 105), 200);
      setPose("fall");                                         // отпустила ручку
      await glide(m.relX, 170, 0);
      m.lift = 0;
      await squash(120, 0.1);
      setPose("side");
      await tween(320, (p) => { const r0 = at(-20, 105), r1 = D + 15 * F; m.relX = r0 + (r1 - r0) * ease(p); m.lift = -18 * Math.sin(p * Math.PI); });
      m.lift = 0;
      setPose("dr3");                                          // заглядывает в проём, держась за косяк
      say("Ого… там игра!", 1500);
      await wait(1200);
      setPose("side");
      await glide(at(52, 112), 260);                           // отходит к открытому полотну и показывает в свет
      setPose("dr8");
      await wait(800);
      setPose("dr4");
      say("Ва-а-ау!", 1100);
      await wait(900);
      say("Я тоже хочу!", 1400);
      await hop(26, 320, "dr5");
      await hop(22, 300, "dr5");
      doorAt.name = "door4";                                   // захлопнулась у неё перед носом
      sound("bonk");
      textFx("БАМ!", dp.x, dp.y - H * 1.25, "monkey-fx__bam", 700);
      setPose("dr6");
      const r0 = m.relX;
      const back = Math.min(BACK, r0 - s.min);                 // отлетела, но не за скругление
      await tween(280, (p) => { m.relX = r0 - back * easeOut(p); m.lift = -12 * Math.sin(p * Math.PI); });
      m.lift = 0;
      await wait(250);
      doorAt.name = "door1";
      await wait(300);
      setPose("dr9");                                          // обиделась
      say(pick(["Ну и пожалуйста…", "Не очень-то и хотелось!", "Обидно…"]), 1700);
      await wait(1700);
      setPose("side");
      await glide(at(-25, 105), 300);
      setPose("dr10");                                         // прижалась ладонями к полотну
      say(pick(["Пустите… я тихонько…", "Ну пожа-а-алуйста!", "Я только одним глазком!"]), 1700);
      await wait(1800);
      say("Ладно… игру ещё делают.", 1600);
      await tween(400, (p) => { doorAt.op = 1 - p; });         // дверь исчезает
    } finally {
      doorAt = null;
      door.style.display = "none";
    }
    await faceFront();
  }

  // Дразнится: хохочет и скачет
  async function tease() {
    next.tease = now() + rnd(9000, 16000);
    faceTo(cursor.x);
    say(pick(["Хи-хи!", "Не догонишь!", "Ля-ля-ля!"]), 1300);
    if (Math.random() < 0.5) { await faceFront(); await laughFit(true); return; }   // 2026-11-19: иногда — полный хохот с пальцем на гостя
    for (let i = 0; i < 3; i++) {
      await hop(22, 260, i % 2 ? "yay" : "laugh");
      setPose("laugh");
      await wait(120);
    }
    await seq([["front34", 0]]);
  }

  // Болтает: подкалывает гостя, хвастается, шутит про дизайн. Недавние фразы не повторяет
  const JOKES = {
    tease: [
      "Курсор быстрый, а я быстрее!", "Смотри работы, а не на меня! …Ладно, можно и на меня.",
      "Ctrl+Z на меня не действует!", "Я не баг. Я фича!", "Корона настоящая. Руками не трогать!",
      "Поймаешь — с меня банан. Не поймаешь!", "Ты кликаешь, как дятел. Уважаю!",
      "Мышку держишь крепко. Меня — нет!", "Это не я сдвинула кнопку! Она сама!",
    ],
    brag: [
      "Я тут главный арт-директор. Неофициально.", "Пиксели ровные — я проверяла лично.",
      "Шрифт хороший. Я по нему бегала — знаю.", "Эту обложку я одобрила. Лапкой.",
      "Наймёшь его — мне купят бананов!", "Я его муза. И немножко талисман.",
      "Половину идей придумала я. Ну… четверть.", "Охраняю портфолио. Мимо не пройдёшь!",
    ],
    design: [
      "Клиент сказал «сделайте ярче». Я надела корону!", "Брендинг — это когда банан узнают издалека!",
      "Логотип побольше? Куда уж больше!", "Финал-финал-точно-финал_v7.psd",
      "Отступы ровные. Я по ним мерила хвостом.", "Дизайнер без кофе — как я без банана.",
      "Можно мне тоже фирменный стиль? Жёлтый!", "Тут каждая кнопка нажимается. Я проверила. Все.",
    ],
    idle: [
      "Эй, ты тут? Я скучаю!", "Ау-у! Листай дальше — там вкусное!", "Ты завис? Перезагрузить?",
      "Пока ты думаешь, я считаю пиксели… сбилась.", "Тсс… дизайнер думает, что я работаю.",
      "Скролль вниз — там самое красивое!",
    ],
  };
  const said = [];
  function joke(kind) {
    const list = JOKES[kind].filter((s) => !said.includes(s));
    const s = pick(list.length ? list : JOKES[kind]);
    said.push(s);
    if (said.length > 14) said.shift();
    return s;
  }
  async function chatter() {
    next.chat = now() + rnd(16000, 28000);
    await faceFront();
    const kind = idleFor() > CFG.idleTricks ? "idle" : cursorFresh() && Math.random() < 0.45 ? "tease" : pick(["brag", "design"]);
    say(joke(kind), 3200);
    if (kind === "tease") { faceTo(cursor.x); await laughFit(true); }
    else if (kind === "brag") { await seq([["wave", 600]]); await hop(12, 220, "yay"); }
    else if (kind === "idle") { await waveHello(1, Math.random() < 0.5); }
    else await seq([["front34", 700], ["stand", 0]]);
    await idleStand(rnd(1200, 2000));
  }

  // Оглядывается назад, на работы
  async function lookAround() {
    await seq([["front34", 70], ["side", 70], ["back34", rnd(500, 900)], ["back", rnd(1200, 2000)], ["back34", 80], ["side", 70]]);
    await faceFront();
  }

  // Засыпает, когда гость долго ничего не делает: на подушке или на лиане (на линии)
  async function sleep() {
    // Лиана целиком на линии: оба конца лежат на опоре, а не висят за её краем
    const vine = pick(["vine1", "vine2"]), vface = Math.random() < 0.5 ? 1 : -1;
    const vL = FR[vine].w * K * (vface > 0 ? FR[vine].ax : 1 - FR[vine].ax), vR = FR[vine].w * K - vL;
    const onLine = m.surf && m.surf.hang && m.surf.max - m.surf.min > vL + vR + 8;
    if (!onLine && !roomFor(FR.sl9.w * 0.9)) { await wander(); return; }
    await load(["vine1", "vine2", "wake"].concat(SLEEP));
    if (onLine) await runTo(clamp(m.relX, m.surf.min + vL, m.surf.max - vR));
    await faceFront();
    // 2026-11-19 (лист 44): сонные глаза, зевает с руками вверх, глаза закрываются, трёт глаз
    await seq([["sl2", 600], ["sl3", 1000], ["sl4", 450]]);
    say(pick(["Ох… посплю…", "Зева-а-аю…", "Я на минутку…"]), 1400);
    await seq([["sl5", 600], ["sl4", 300]]);
    m.asleep = true;
    const t0 = now();
    if (onLine) {                                              // лиана: концы на линии, без раскачки (иначе концы отрываются)
      m.hanging = true;
      setPose(vine);
      m.face = vface;
      await tween(1e9, (p) => {
        const t = now() - t0;
        if (Math.floor(t / 2600) !== Math.floor((t - 16) / 2600)) textFx("z", m.x + 20, m.y - H * 0.5, "monkey-fx__z", 1600);
      });
    } else {                                                   // подушка (лист 44): обняла подушку, легла, дышит, иногда сворачивается клубком
      m.pillow = true;
      await seq([["sl6", 700]]);
      setPose("sl7");
      await tween(1e9, () => {
        const t = now() - t0;
        setPose(Math.floor(t / 7000) % 3 === 2 ? "sl8" : "sl7");
        m.sy = 1 + Math.sin(t / 550) * 0.015;
        if (Math.floor(t / 2200) !== Math.floor((t - 16) / 2200)) textFx(pick(["z", "Z"]), m.x + m.face * H * 0.1, m.y - H * 0.55, "monkey-fx__z", 1600);
      });
    }
  }
  // Проснулась: трёт глаз, удивилась
  async function wakeUp() {
    if (!m.asleep) return;
    m.asleep = false;
    m.rot = 0;
    m.sy = 1;
    if (m.hanging) { m.hanging = false; setPose("rise"); await tween(260, (p) => { m.lift = H * 0.4 * (1 - p); }); m.lift = 0; }
    if (m.pillow) {                                            // 2026-11-19 (лист 44): приоткрыла глаз, села, трёт глаза, удивилась, потянулась
      m.pillow = false;
      await seq([["sl9", 450], ["sl10", 550]]);
      say(pick(["А? Что?", "Я не спала!", "Ой, ты тут!"]), 1300);
      await seq([["sl11", 600], ["sl12", 700], ["stand", 300]]);
      return;
    }
    setPose("wake");
    say(pick(["А? Что?", "Я не спала!", "Ой, ты тут!"]), 1300);
    await wait(900);
    await seq([["stand", 300]]);
  }

  // Испугалась курсора — убежать подальше
  let fleeMark = 0;
  function fleeing() { return now() - fleeMark < 900; }
  async function flee() { fleeMark = now(); await fleeCore(); }
  async function fleeCore() {
    if (m.hanging) {                                           // висела — срывается вниз
      say(pick(["А-а-а!", "Ой-ой!"]), 900);
      sound("squeak");
      await fall(pick(["fallYell", "fallScared"]));
      if (m.mode === "hidden") { await wait(rnd(1500, 2500)); scan(); await reappear(choose({ away: cursor, awayMin: 380 }) || choose({})); }
      return;
    }
    flees.push(now());
    while (flees.length && now() - flees[0] > 25000) flees.shift();
    if (flees.length >= (mqTouch.matches ? 3 : CFG.tiredAfter)) {
      // Устала: согнулась, руки на коленях, пыхтит — можно ловить
      await load(["tired"]);
      tiredUntil = now() + CFG.tiredFor;
      flees.length = 0;
      setPose("tired");
      say(pick(["Уф… устала…", "Всё… не могу…", "Пых-пых…"]), 2000);
      await tween(CFG.tiredFor - 400, (p) => { m.sy = 1 + Math.abs(Math.sin(p * 40)) * 0.03; });
      m.sy = 1;
      await faceFront();
      return;
    }
    m.face = cursor.x > m.x ? 1 : -1;
    setPose(Math.random() < 0.6 ? "scared" : "oops");
    if (Math.random() < 0.6) say(pick(["Ой!", "Не поймаешь!", "Ай-ай!", "Мимо!"]), 900);
    sound("squeak");
    await hop(16, 170);
    // Куда отпрыгнуть: подальше от мыши и не туда, откуда только что убежала.
    // Некуда (на экране мало опор) или гонятся уже не первый раз — удирает совсем: за картинку или за край экрана
    const t = choose({ away: cursor, awayMin: 300, max: 800, avoid: lastFlee });
    const chased = flees.length >= 3;
    if (!t || surfaces.length < 4 || (chased && Math.random() < 0.6)) { await escape(); return; }
    lastFlee = { x: m.x, y: m.y };
    if (!calm && Math.random() < 0.25) await travel(t, { magic: true });
    else await jumpTo(t.s, t.relX, { scared: true, slow: 0.8 });
    faceTo(cursor.x);
    await seq([["laugh", 600], ["front34", 0]]);
  }
  let lastFlee = null;
  // Удрать: нырнуть за картинку или убежать за край экрана, переждать и вынырнуть подальше от мыши
  async function escape() {
    lastFlee = null;
    if (m.mode === "ground" && canHide(m.surf) && Math.random() < 0.6) await dive();
    else if (m.mode === "ground" && m.surf) {
      const away = cursor.x < m.x ? 1 : -1;
      await runTo(away > 0 ? m.surf.max : m.surf.min, CFG.runSpeed * 1.6);
      const x0 = m.x, y0 = m.y;
      m.mode = "air"; m.surf = null;
      setPose("rise");
      await tween(650, (p) => {                                   // прыжок вниз за край экрана
        m.x = x0 + away * 320 * p;
        m.y = y0 - 70 * 4 * p * (1 - p) + p * p * (window.innerHeight - y0 + H * 1.5);
        if (p > 0.45) setPose("fall");
      });
    }
    m.mode = "hidden";
    say("", 1);
    await wait(rnd(1800, 3200));
    scan();
    const t = choose({ away: cursor, awayMin: 380, only: canHide }) || choose({ away: cursor, awayMin: 380 }) || choose({});
    await reappear(t);
  }

  // Поймали за хвост: висит вниз головой и раскачивается за мышкой
  let release = null;
  function grab() {
    token++;
    pending = null;
    m.mode = "caught";
    m.surf = null;
    m.hanging = false; m.asleep = false; m.pillow = false; m.sy = 1;
    m.lift = 0; m.clip = 0; m.k = 1; m.swing = 0; m.face = 1; m.rot = 0;
    m.dizzy = 0; m.wasDizzy = false; m.dizzyMsg = 0; m.shakeAt = 0;
    root.classList.add("is-caught");
    load(["tail", "tailL", "tailR", "dz1", "dzA", "dzB", "dzSick", "dzAngry", "fl1", "fl2", "fl3", "fl4", "fl5", "fl6", "fl7", "fl8", "fl9"]);
    setPose("tail");
    sound("squeak");
    say(pick(["Ай! Отпусти!", "Пусти-и-и!", "Ай-ай-ай!"]), 1800);
    caughtTimes++;
    pending = async () => {
      await new Promise((res) => { release = res; if (mqTouch.matches) setTimeout(res, 2500); });
      release = null;
      root.classList.remove("is-caught");
      m.mode = "air";
      tiredUntil = 0;
      flees.length = 0;
      m.rot = 0;
      const dizzy = m.wasDizzy;
      m.y += FR.tail.h * FR.tail.s * K * 0.9;                               // точка — уже не кончик хвоста, а низ тела
      await tumbleFall();                                                     // кувырок, машет руками, «бежит» по воздуху
      if (m.mode === "hidden") { await wait(1500); scan(); await reappear(choose({ away: cursor, awayMin: 320 })); return; }
      await wait(350);
      if (dizzy) {                                                            // мотали — голова ещё кружится
        setPose("fl8");
        say(pick(["Всё кружится…", "Где я? Кто я?", "Мир качается…"]), 1600);
        await tween(1300, (p) => { m.rot = Math.sin(p * 16) * 4 * (1 - p); });
        m.rot = 0;
      }
      if (Math.random() < 0.55) {                                             // «ничего не было»
        setPose("fl9");
        say(caughtTimes === 1 ? "Ладно, ты победил!" : pick(["Ничего не было!", "Я так и задумала.", "Это был трюк!"]), 1700);
        await wait(1300);
      } else {
        say(pick(["Уф…", "Нечестно!", "Ещё раз!"]), 1300);
        await wait(500);
      }
      await travel(choose({ away: cursor, awayMin: 320 }), { magic: true });
    };
  }
  window.addEventListener("pointerup", () => { if (release) release(); });

  root.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    e.stopPropagation();
    lastActive = now();
    cursor.x = e.clientX; cursor.y = e.clientY; cursor.t = now();
    if (m.mode === "caught" || m.mode === "hidden") return;
    if (now() < tiredUntil || m.asleep) grab();
    else interrupt(async () => { say("Не поймаешь!", 900); await flee(); });
  });
  root.addEventListener("click", (e) => e.stopPropagation());

  // Чем заняться дальше
  function decide() {
    if (m.mode !== "ground" || !m.surf) return async () => {
      const t = choose({});
      if (t) await travel(t, { magic: true }); else { m.mode = "hidden"; await wait(800); }
    };
    const idle = idleFor();
    const t = now();
    if (calm) return Math.random() < 0.3 ? wander : lookAround;
    if (idle > CFG.sleepAfter) return sleep;
    if (idle > CFG.idleTricks) {
      const list = [lookAround, wander, tease, idleStandLong, chatter];
      if (t > next.trick) list.push(kungFu, staffShow, eatBanana, somersault, laptopWork, laptopWork, sitWatch, sitWatch, chipsSnack);
      if (t > next.hang && surfaces.some((s) => s.hang)) list.push(hangOnLine, hangOnLine);
      return pick(list);
    }
    if (t > next.favorite && favoriteSurface() && Math.random() < 0.5) return pointFavorite;
    if (t > next.door && gameSpot() && Math.random() < 0.35) return doorVisit;
    // 2026-11-19: сценки у своих разделов — чипсы у «Упаковки», фото в SMM, расклейка в «Брендах 360°»
    if (t > next.scene && Math.random() < 0.3) {
      const sc = [[SCENE.chips, 260, chipsSnack], [SCENE.photo, 300, photoShoot], [SCENE.paste, 520, pasteFlyer]].filter(([sel, w]) => sceneSurface(sel, w));
      if (sc.length) return pick(sc)[2];
    }
    if (t > next.bash && stubSurface() && Math.random() < 0.3) return bashButton;
    if (t > next.throw && cursorFresh() && Math.random() < 0.25) return throwBanana;
    if (t > next.tease && cursorFresh() && Math.random() < 0.15) return tease;
    if (t > next.chat && Math.random() < 0.22) return chatter;
    if (t > next.hang && Math.random() < 0.12 && surfaces.some((s) => s.hang)) return hangOnLine;
    return wander;
  }

  // Для проверки из консоли: monkeyDo("kungFu"), monkeyDo("state") и т. п.
  window.monkeyDo = (name, arg) => {
    if (name === "state") {                       // что она сейчас видит и где стоит
      scan();
      const nm = (s) => s.virtual ? s.el.kind + ":" + Math.round(box(s.el).left + s.min) + "-" + Math.round(box(s.el).left + s.max) + "@" + Math.round(box(s.el).top) + (s.hang ? " hang" : "")
        : s.el.tagName + "." + String(s.el.className).slice(0, 30) + (s.hang ? " hang" : "");
      return { mode: m.mode, pose: m.pose, face: m.face, hanging: m.hanging, asleep: m.asleep, x: Math.round(m.x), y: Math.round(m.y), H,
        surf: m.surf && !m.surf.floor ? nm(m.surf) : null, surfaces: surfaces.map(nm),
        slide: slideCtx ? (slideCtx.dir > 0 ? "down" : "up") + (slideCtx.hit ? " hit" : "") + " nb=" + Math.round(slideCtx.next.getBoundingClientRect().bottom) : "", paging };
    }
    const acts = { chatter, tease, throwBanana, pointFavorite, bashButton, lookAround, wander, flee, kungFu, staffShow, eatBanana, hangOnLine, sleep,
      somersault, laptopWork, doorVisit, ride, greetBack, stand: () => idleStand(9000),
      chipsSnack, photoShoot, pasteFlyer, sitWatch, sitEdge: () => sitWatch(true), sitCross: () => sitWatch(false), peerFar, shakeOff, laughFit: () => laughFit(true), waveHello: () => waveHello(2, true), turn: () => seq([["back", 600], ["stand", 0]]),
      run: () => m.surf && runTo(m.relX < (m.surf.min + m.surf.max) / 2 ? m.surf.max : m.surf.min),
      jump: () => travel(choose({ max: 600 })),
      hide: () => travel(choose({ min: 300, only: canHide }), { magic: true }),
      go: () => { const s = surfaces.find((x) => x.virtual && x.el.kind === arg) || surfaces.find((x) => x.virtual); return s && travel({ s, relX: (s.min + s.max) / 2 }); } };
    if (acts[name]) interrupt(acts[name]);
    return Object.keys(acts);
  };

  async function brain() {
    for (;;) {
      const act = pending || decide();
      pending = null;
      try { await act(); }
      catch (e) {
        if (e !== CANCEL) { console.error(e); await new Promise((r) => setTimeout(r, 500)); }
        m.lift = 0; m.sx = m.sy = 1; m.clip = 0; m.k = 1;
        if (m.mode !== "caught" && !m.hanging) m.rot = 0;
        if (m.mode === "hidden") m.mode = m.surf ? "ground" : "air";
        root.classList.remove("is-angry");
        if (m.mode === "ground" && !m.hanging && !m.asleep) setPose("front34");
      }
    }
  }

  // 2026-11-17: при прокрутке встаём на край сразу, в том же кадре, а не на следующем шаге анимации —
  // иначе, пока крутят окно, между ногами и краем на миг появлялся зазор
  window.addEventListener("scroll", () => {
    if (m.mode !== "ground" || !m.surf || m.surf.floor || !m.surf.el.isConnected) return;
    const p = spot(m.surf, m.relX);
    m.x = p.x; m.y = p.y;
    root.style.transform = "translate(" + m.x.toFixed(1) + "px," + (m.y + m.lift).toFixed(1) + "px)";
  }, { capture: true, passive: true });

  /* ---------- 2026-11-17: реакции на то, что делает гость ---------- */
  // Быстро крутят страницу — хватается и держится, как в поезде; остановились — встряхивается
  let nextRide = 0, rideAt = -1e9, lastScrollAt = 0, lastFastAt = -1e9, nextShake = 0;   // rideAt — когда начала держаться (защита от «зависшего» флага)
  const scrollPos = new WeakMap();
  function onScrollSpeed(e) {
    const el = e.target === document ? document.scrollingElement : e.target;
    if (!el || el.scrollTop === undefined) return;
    const t = now(), prev = scrollPos.get(el);
    scrollPos.set(el, { y: el.scrollTop, t });
    lastScrollAt = t;
    if (paging || t < pagingEnd + 400) return;               // наезд раздела — у неё своя реакция (slideRide)
    if (!prev || t - prev.t > 200) return;
    const v = Math.abs(el.scrollTop - prev.y) / Math.max(8, t - prev.t);   // px в мс
    if (v > 3.2) lastFastAt = t;
    if (v > 3.2 && t - rideAt > 5000 && t > nextRide && !calm && m.mode === "ground" && !m.hanging && !m.asleep && !fleeing()) {
      rideAt = t;
      nextRide = t + rnd(9000, 14000);
      interrupt(ride);
    }
  }
  async function ride() {
    rideAt = now();
    try {
      // 2026-11-19 (лист 36): испугалась, подпрыгнула, повисла на руках на краю и болтает ногами, пока крутят
      await load(HOLD);
      await seq([["hd1", 140]]);
      say(pick(["Ого, полетели!", "Держусь!", "Тормози-и-и!"]), 1200);
      setPose("hd2");
      await tween(160, (p) => { m.lift = -H * 0.18 * Math.sin(p * Math.PI); });
      m.lift = 0;
      setPose("hd3");
      await squash(120, 0.06);
      const t0 = now();
      // висит, пока крутят (но не дольше 4 с): ноги болтает то влево, то вправо
      await tween(4000, () => {
        const t = now() - t0, k = Math.sin(t / 260);
        setPose(t < 300 ? "hd3" : k < -0.55 ? "hd5" : k < 0 ? "hd4" : k > 0.5 ? "hd6" : "hd3");
        m.rot = k * 3 * m.face;
        return now() - lastScrollAt > 320 && t > 600;
      });
      m.rot = 0;
      setPose("hd2");                                           // подтянулась и спрыгнула обратно на край
      await tween(200, (p) => { m.lift = -H * 0.15 * Math.sin(p * Math.PI); });
      m.lift = 0;
      setPose("hd7");
      await squash(160, 0.12);
      await shakeOff(true);
    } finally { rideAt = -1e9; }
  }
  // Встряхнулась после быстрой прокрутки (и когда её опора уехала с экрана, а она вынырнула в другом месте)
  async function shakeOff(dizzy) {
    nextShake = now() + 8000;
    await load(HOLD);
    if (!dizzy) await seq([["hd7", 450]]);                     // голова кругом (лист 36)
    say(pick(["Уф! Ну и скорость!", "Голова кругом…", "Предупреждать надо!"]), 1400);
    for (let i = 0; i < 6; i++) {                              // встряхивается, как мокрая собака
      setPose(i % 2 ? "hd9" : "hd8");
      await tween(95, (p) => { m.rot = (i % 2 ? 4 : -4) * Math.sin(p * Math.PI) * m.face; });
    }
    m.rot = 0;
    await seq([["hd10", 650], ["stand", 0]]);
  }
  window.addEventListener("scroll", onScrollSpeed, { capture: true, passive: true });

  /* ---------- 2026-11-23: наезды разделов (script.js шлёт "section-slide" {dir, cur, next} и "section-slide-end") ----------
     Его правило: реагирует не на колёсико, а когда до неё доезжает край нового раздела.
     Вниз (новый раздел едет снизу): верхний край доехал до её ног — подхватил её, она едет на нём вверх,
       высматривает плоскость нового раздела под собой и прыгает на неё (вбок, иногда с сальто вперёд по ходу).
     Вверх (новый раздел опускается сверху): нижний край доехал до головы — прыгает на плоскость нового раздела;
       если плоскости ещё не видно — хватается за край и едет вниз на руках, пока плоскость не покажется.
     Нет плоскости совсем — падает вниз. После приземления — голова кругом (кадры листа 36).
     Никаких исчезновений: если опору унесло обычной прокруткой — тоже падает/допрыгивает (landSomewhere) */
  let paging = false, pagingEnd = 0, slideCtx = null;
  const AIR = ["fl3", "fl4", "fl5", "fl6", "fl7", "ss1", "ss2", "ss3", "ss5", "ss6", "ss7"];
  window.addEventListener("section-slide", (e) => {
    const d = e.detail || {};
    paging = true;
    pagingEnd = now() + (d.dur || 850);
    slideCtx = d.next ? { dir: d.dir || 1, cur: d.cur, next: d.next, to: d.to, hit: false } : null;
    load(AIR.concat(HOLD, ["hg1", "hg2", "hg3"]));
  });
  window.addEventListener("section-slide-end", () => { paging = false; });

  // Каждый кадр (из frame): не доехал ли край нового раздела до неё
  function slideWatch() {
    const c = slideCtx;
    if (!c || c.hit) return;
    const ok = (m.mode === "ground" && m.surf) || m.mode === "air";      // стоит/спит/висит или в прыжке
    if (!c.next.isConnected || calm || !ok || layerNow() !== document.body) {
      if (!paging) slideCtx = null;                            // наезд кончился, а она была в прыжке — дальше сама
      return;
    }
    const r = c.next.getBoundingClientRect();
    const hitDown = c.dir > 0 && r.top <= m.y + 2;                         // верхний край подъехал к ногам
    const hitUp = c.dir < 0 && r.bottom >= m.y - H * (m.hanging ? 0.1 : 1.0); // нижний край опустился к голове
    if (!hitDown && !hitUp) return;
    c.hit = true;
    if (m.mode === "ground") m.surf = null;                    // сразу отцепить: старый раздел скоро уедет за экран
    token++;
    pending = () => slideJump(c);
  }

  // Плоскость нового раздела там, где она окажется, когда раздел встанет (раздел ещё едет — гнаться за ним нельзя).
  // Лучше вбок (на 120–450 px), чтобы прыжок и сальто шли в сторону, а не на месте
  function finalTarget(c) {
    const vh = window.innerHeight, vw = window.innerWidth;
    const shift = (c.to == null ? window.scrollY : c.to) - window.scrollY;   // сколько ещё проедет страница
    let best = null, bs = 1e9;
    for (const el of c.next.querySelectorAll(SURF_SEL)) {
      if (root.contains(el) || fx.contains(el)) continue;
      // карточки нового раздела ещё не проявились (.reveal появляется при въезде) — это не помеха.
      // Прозрачный сам элемент не трогаем: edgeKind запомнил бы его как «не опора» навсегда
      const own = getComputedStyle(el);
      if (parseFloat(own.opacity) < 0.3 || own.visibility === "hidden") continue;
      let hidden = false, revealDy = 0;
      for (let p = el.parentElement; p && p !== c.next; p = p.parentElement) {
        const cs = getComputedStyle(p);
        // проявление ещё сдвигает карточку вниз (translateY) — в конце сдвига не будет
        if (p.classList.contains("reveal") && cs.transform !== "none") revealDy += new DOMMatrixReadOnly(cs.transform).m42;
        if (cs.visibility === "hidden" || cs.display === "none" || (parseFloat(cs.opacity) < 0.6 && !p.classList.contains("reveal"))) { hidden = true; break; }
      }
      if (hidden) continue;
      const edge = edgeKind(el);
      if (!edge) continue;
      const r = el.getBoundingClientRect();
      if (r.width < 90 || r.height < 6) continue;
      const fy = (edge === "bottom" ? r.bottom : r.top) - shift - revealDy;
      if (fy < H * 1.02 || fy > vh - 8) continue;
      const pad = Math.min(cornerR(el, r), r.height / 2, r.width / 2) + footPad() + 4;
      const x1 = Math.max(r.left + pad, 20), x2 = Math.min(r.right - pad, vw - 20);
      if (x2 - x1 < 36) continue;
      // точка на опоре: сдвиг вбок от неё на 120–450 px, если опора позволяет
      const want = m.x + (Math.random() < 0.5 ? -1 : 1) * rnd(160, 380);
      const fx0 = clamp(want, x1, x2);
      const dx = Math.abs(fx0 - m.x);
      const score = Math.abs(dx - 260) + Math.abs(fy - m.y) * 0.45 + Math.random() * 90;
      if (score < bs) {
        bs = score;
        best = { s: { el, edge, min: x1 - r.left, max: x2 - r.left, solid: el.tagName === "IMG" || r.height > H * 0.6 },
          relX: fx0 - r.left, final: { x: fx0, y: fy } };
      }
    }
    return best;
  }

  async function slideJump(c) {
    const airborne = m.mode === "air";                         // край застал её в прыжке — довернёт полёт без толчка
    if (m.hanging) { m.hanging = false; m.rot = 0; setPose("stand"); }
    m.asleep = false; m.pillow = false; m.sx = m.sy = 1;
    m.surf = null;                                             // старый раздел скоро уедет — держим её там, где стоит
    const t = finalTarget(c);
    if (t) {
      const left = Math.max(0, pagingEnd - now());
      // прыжок одной дугой ровно туда, где опора встанет; в воздухе — не меньше, чем доедет раздел
      await jumpTo(t.s, t.relX, { final: t.final, minMs: left + 140, flip: airborne ? 0 : 0.45, air: airborne });
      await dizzyShake(0.6);
      return;
    }
    // ловить нечего: испугалась, ждёт конца наезда и падает вниз
    setPose("scared");
    await tween(Math.max(60, pagingEnd - now() + 60), () => !paging);
    await landSomewhere(true, c.cur);
  }

  // Голова кругом после жёсткого приезда (лист 36); chance — с какой вероятностью
  async function dizzyShake(chance = 1) {
    if (Math.random() > chance) return;
    await seq([["hd7", 520]]);
    if (Math.random() < 0.7) say(pick(["Голова кругом…", "Уф, приехали!", "Где это я?", "Ого, новый раздел!", "Кто так листает?!"]), 1300);
    for (let i = 0; i < 4; i++) {
      setPose(i % 2 ? "hd9" : "hd8");
      await tween(95, (p) => { m.rot = (i % 2 ? 4 : -4) * Math.sin(p * Math.PI) * m.face; });
    }
    m.rot = 0;
    await seq([["hd10", 420], ["stand", 0]]);
    nextShake = now() + 8000;
  }

  // Долететь до ближайшей плоскости из того места, где она сейчас (опору унесло). Вверх — прыжком по дуге,
  // вниз — падает. Нет плоскости — падает вниз за экран. not — раздел, на который нельзя (его сейчас закроют)
  async function landSomewhere(dizzy, not) {
    scan();
    const vh = window.innerHeight;
    m.mode = "air"; m.surf = null; m.hanging = false;
    let best = null, bs = 1e9;
    for (const s of surfaces) {
      if (s.floor) continue;
      if (not && not.contains(s.virtual ? s.el.host : s.el)) continue;
      const r = box(s.el), ey = edgeY(s, r);
      if (ey < H * 0.75 || ey > vh - 4) continue;
      const relX = clamp(m.x - r.left, s.min, s.max);
      const dx = Math.abs(r.left + relX - m.x), dy = ey - m.y;
      const score = (dy >= 0 ? dy : -dy * 2.2 + 120) + dx * 1.4;   // вниз падать проще, чем запрыгивать вверх
      if (score < bs) { bs = score; best = { s, relX }; }
    }
    const rot0 = m.rot;
    if (!best) {
      const y0 = m.y;
      await tween(700, (p) => { m.y = y0 + (vh + H * 1.5 - y0) * p * p; setPose(Math.floor(p * 8) % 2 ? "fl4" : "fl5"); m.lift = -H * 0.45; m.rot = rot0 * (1 - p); });
      m.rot = 0; m.lift = 0;
      m.mode = "hidden";
      return;
    }
    const { s, relX } = best;
    const e0 = spot(s, relX);
    if (e0.y < m.y - 4) {                                      // плоскость выше — обычный прыжок по дуге
      m.mode = "ground";
      await jumpTo(s, relX);
    } else {                                                   // ниже — падает, машет руками, чуть смещаясь вбок
      const x0 = m.x, y0 = m.y, t0 = now();
      if (Math.abs(e0.x - x0) > 4) m.face = e0.x > x0 ? 1 : -1;
      const ms = clamp(Math.sqrt(Math.max(1, e0.y - y0)) * 40 + Math.abs(e0.x - x0) * 0.4, 280, 1000);
      await tween(ms, (p) => {
        const e = s.el.isConnected ? spot(s, relX) : e0;
        m.x = x0 + (e.x - x0) * easeOut(p);
        m.y = y0 + (e.y - y0) * p * p;
        setPose(Math.floor((now() - t0) / 110) % 2 ? "fl4" : "fl5");
        m.lift = -H * 0.45 * Math.min(1, p * 5);
        m.rot = rot0 * Math.max(0, 1 - p * 3);
      });
      m.rot = 0; m.lift = 0;
      standOn(s, relX);
      puff(m.x, m.y);
      sound("plop");
      setPose(pick(["fl6", "fl7"]));
      await squash(200, 0.2);
      if (!dizzy) await seq([["front34", 0]]);
    }
    if (dizzy) await dizzyShake(1);
  }

  // Гость вернулся после паузы (не спала) — машет: «О, ты вернулся!»
  async function greetBack() {
    faceTo(cursor.x);
    await faceFront();
    say(pick(["О, ты вернулся!", "Я тут, жду!", "Наконец-то!", "Продолжаем смотреть?"]), 1500);
    await waveHello(2, false);
    await hop(18, 260, "yay");
    await seq([["wv11", 300], ["stand", 0]]);
  }

  /* ---------- Слушаем гостя ---------- */
  function active() {
    const away = now() - lastActive;
    lastActive = now();
    if (m.asleep && m.mode === "ground") interrupt(async () => {});
    else if (away > 20000 && !calm && m.mode === "ground" && !m.hanging) interrupt(greetBack);
  }
  document.addEventListener("pointermove", (e) => {
    const t = now();
    cursor.vx = (e.clientX - cursor.x) / Math.max(1, t - cursor.t);
    cursor.x = e.clientX; cursor.y = e.clientY; cursor.t = t;
    active();
    if (mqTouch.matches || m.mode !== "ground" || t < tiredUntil || fleeing()) return;
    const cy = m.hanging ? m.y + H * 0.5 : m.y - H / 2;       // висит — тело под линией
    const d = Math.hypot(e.clientX - m.x, e.clientY - cy);
    if (d < CFG.fearRadius) interrupt(flee);
  }, { passive: true });
  ["scroll", "wheel", "keydown"].forEach((ev) => window.addEventListener(ev, active, { passive: true, capture: true }));
  document.addEventListener("click", (e) => {
    if (root.contains(e.target) || m.mode === "caught") return;
    active();
    // Клик по карточке Game: туда нельзя — а она открывает дверь и заглядывает
    if (e.target.closest && e.target.closest(CFG.gameCard) && !doorAt && gameSpot()) { interrupt(doorVisit); return; }
    if (Math.random() < 0.6) interrupt(reactClick(e.clientX, e.clientY));
  }, true);

  /* ---------- Кадр ---------- */
  let lastScan = 0, lastCheck = 0;
  function draw(t) {
    const name = visibleFrame(t);
    show(name);
    const f = FR[name];
    const w = f.w * K * (f.s || 1), h = f.h * K * (f.s || 1);   // s — поправка роста кадра (листы 8, 9 нарезаны мельче)
    const ax = f.ax * w, ay = f.ay * h;          // зеркалим вокруг этой точки — корона остаётся над ногами
    const im = shownImg;
    if (im) {
      im.style.width = w.toFixed(1) + "px";
      im.style.height = h.toFixed(1) + "px";
      im.style.left = (-ax).toFixed(1) + "px";
      im.style.top = (-ay).toFixed(1) + "px";
      im.style.transformOrigin = ax.toFixed(1) + "px " + ay.toFixed(1) + "px";
      // Стоит — чуть дышит
      const breathe = m.mode === "ground" && !m.hanging && STILL.has(name) ? 1 + Math.sin(t / 420) * 0.012 : 1;
      // f.rot — поправка наклона самого кадра; кадры головокружения уже нарисованы с наклоном — качаем вполсилы
      const rot = (m.mode === "caught" ? m.swing * (name.startsWith("dz") ? 0.35 : 0.7) : m.rot * m.face) + (f.rot || 0);
      im.style.transform = "scale(" + (m.sx * m.face * m.k).toFixed(3) + "," + (m.sy * m.k * breathe).toFixed(4) + ") rotate(" + rot.toFixed(1) + "deg)";
    }
    root.style.transform = "translate(" + m.x.toFixed(1) + "px," + (m.y + m.lift).toFixed(1) + "px)";
    drawDoor();
    root.style.visibility = m.mode === "hidden" ? "hidden" : "";
    // Спрятана за краем: всё, что ниже линии, не видно
    root.style.clipPath = m.clip > 0 ? "inset(-2000px -2000px " + m.clip.toFixed(1) + "px -2000px)" : "";
    // Облачко над головой (когда висит — над точкой хвата), не уезжает за края экрана
    {
      const bw = bubble.offsetWidth, bh = bubble.offsetHeight;
      const top = m.mode === "caught" || HANGS.has(name) ? -bh - 14 : -(ay * m.k) - bh - 12;
      const left = clamp(m.x - bw / 2, 8, window.innerWidth - bw - 8) - m.x;
      bubble.style.transform = "translate(" + left.toFixed(1) + "px," + Math.max(top, -m.y - m.lift + 8).toFixed(1) + "px)";
      bubble.style.setProperty("--tail", clamp(-left, 14, bw - 14) + "px");
    }
  }
  function frame() {
    const t = now();
    for (const task of tasks) {
      if (task.tok !== -1 && task.tok !== token) { tasks.delete(task); task.rej(CANCEL); continue; }
      const p = Math.min(1, (t - task.t0) / task.ms);
      const stop = task.fn ? task.fn(p) === true : false;   // fn вернула true — закончить раньше
      if (p >= 1 || stop) { tasks.delete(task); task.res(); }
    }
    if (t - lastScan > 700) {
      lastScan = t;
      const L = scan();
      if (L !== m.layer && m.mode !== "caught") { m.layer = L; interrupt(followLayer); }
    }
    slideWatch();                                        // 2026-11-23: не доехал ли край нового раздела
    if (m.mode === "ground" && m.surf) {
      if (t - lastCheck > 350) {
        lastCheck = t;
        if (!paging && !surfaceOk(m.surf)) {              // площадка уехала или закрылась (во время наезда ждём края — slideWatch) — вынырнуть в другом месте
          m.surf = null;
          m.mode = "air";
          m.hanging = false; m.asleep = false; m.pillow = false; m.sy = 1; m.rot = 0;
          // 2026-11-23: не исчезает — с того места, где была, падает или допрыгивает до ближайшей плоскости
          m.x = clamp(m.x, 40, window.innerWidth - 40);
          m.y = clamp(m.y, H * 1.3, window.innerHeight - 4);
          interrupt(async () => {
            await load(AIR);
            await landSomewhere(false);
            // 2026-11-17: опору унесло быстрой прокруткой — вынырнула и встряхивается
            if (!calm && m.mode === "ground" && now() - lastFastAt < 3000 && now() > nextShake) { await wait(rnd(150, 400)); await shakeOff(); }
          });
        }
      }
      if (m.surf) {
        const p = spot(m.surf, m.relX);
        m.x = p.x; m.y = p.y;
      }
    } else if (m.mode === "caught") {
      m.x = cursor.x; m.y = cursor.y - 4;
      const target = clamp(-cursor.vx * 30, -40, 40);      // болтается
      m.swing += (target - m.swing) * 0.12;
      // Мотают мышкой — копится головокружение (лист 21): ~1 с тряски — спирали в глазах, дольше — тошнит,
      // перестали трясти — злится. Раз закружилась — до конца висит с кружащейся головой
      cursor.vx = clamp(cursor.vx, -3, 3);                   // один резкий рывок мышью — ещё не тряска
      const sp = Math.abs(cursor.vx);
      m.dizzy = clamp(m.dizzy + sp * 0.004 - 0.0022, 0, 1.2);
      if (sp > 0.6) m.shakeAt = t;
      cursor.vx *= 0.9;
      if (m.dizzy < 0.35 && !m.wasDizzy) setPose(m.swing < -8 ? "tailL" : m.swing > 8 ? "tailR" : "tail");
      else {
        m.wasDizzy = true;
        const still = t - m.shakeAt > 650;
        setPose(m.swing < -8 ? "dzB" : m.swing > 8 ? "dzA" : still ? (m.dizzy > 0.7 ? "dzSick" : "dzAngry") : "dz1");
        if (m.dizzyMsg < 1) { m.dizzyMsg = 1; say(pick(["Голова кружится!", "Ой-ой-ой, всё плывёт!"]), 1500); }
        else if (m.dizzyMsg < 2 && m.dizzy > 0.75) { m.dizzyMsg = 2; say(pick(["Меня сейчас укачает…", "Ой… мне нехорошо…"]), 1600); }
        else if (m.dizzyMsg < 3 && m.pose === "dzAngry") { m.dizzyMsg = 3; say(pick(["Хватит меня трясти!", "Я тебе не погремушка!"]), 1600); }
      }
    }
    draw(t);
    requestAnimationFrame(frame);
  }

  /* ---------- Старт: загрузить нужные кадры и вынырнуть; остальные — по одному в фоне ---------- */
  const propsReady = Promise.all(PROPS.map((f) => new Promise((res) => {
    const im = new Image();
    im.onload = () => { sizes[f] = { w: im.naturalWidth, h: im.naturalHeight }; res(); };
    im.onerror = () => res();
    im.src = src(f);
  })));
  Promise.all([propsReady, load(CORE)]).then(() => {
    setPose("stand");
    m.mode = "hidden";
    root.hidden = false;
    requestAnimationFrame(frame);
    setTimeout(async () => { for (const n of Object.keys(FR)) await load([n]); }, 4000);
    setTimeout(() => {
      scan();
      pending = async () => {
        // Выныривает из-за кнопок в шапке (или где есть место)
        const hero = document.querySelector(".hero__buttons");
        const s = (hero && surfaces.find((x) => !x.virtual && hero.contains(x.el))) || (choose({ only: canHide }) || choose({}) || {}).s;
        if (!s) { m.mode = "air"; m.x = 120; m.y = 0; return; }
        const relX = s.floor ? 200 : (s.min + s.max) / 2;
        const e = spot(s, relX);
        m.x = e.x - 200; m.y = e.y;
        m.face = 1;
        m.mode = "hidden";
        await reappear({ s, relX });
        // 2026-11-17: помнит гостя (в этом браузере): пришёл снова в другой день — «С возвращением!»
        let back = false;
        try {
          const day = new Date().toDateString(), seen = localStorage.getItem("monkeySeen");
          back = !!seen && seen !== day;
          localStorage.setItem("monkeySeen", day);
        } catch (e) { /* хранилище недоступно — просто здороваемся */ }
        say(back ? pick(["С возвращением! Я скучала!", "О, ты снова тут! Привет!"]) : "Привет! Я покажу лучшее!", 2400);
        await waveHello(2, true);
        await hop(20, 280, "yay");
        next.favorite = now() + 12000;
        next.throw = now() + 20000;
        next.bash = now() + 25000;
        next.door = now() + 20000;
        next.tease = now() + 15000;
        next.chat = now() + 10000;
        next.hang = now() + 18000;
        next.trick = now() + 8000;
        next.scene = now() + 30000;
      };
      brain();
    }, 1000);
  });
})();
