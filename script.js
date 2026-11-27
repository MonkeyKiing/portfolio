/* ==========================================================================
   ПОРТФОЛИО — СКРИПТЫ
   Что здесь есть:
   2. Мобильное меню (бургер)
   3. Подсветка активного пункта меню
   4. Анимация появления блоков при прокрутке
      (заодно запускает точечные шкалы и круги — через класс is-visible)
   5. Счётчики цифр (0 → 18)
   6. Полосы уровня навыков
   7. Фильтр работ
   8. Окно проекта (модальное)
   9. Текущий год в подвале
   10. Анимация шагов в разделе «Как я работаю»
   11. Звук нажатия (лёгкая нота при клике по ссылкам и кнопкам)
   12. Галерея работ в окне проекта (вкладки по форматам, группы внутри вкладки)
   13. Просмотр картинки на весь экран (лайтбокс)
   14. Окно Reels (бегущие колонки)
   15. Инфографика: веер слайдов и барабан карточек
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- 2. Мобильное меню ---------- */
  const burger = document.getElementById("burger");
  const nav = document.getElementById("nav");

  function setMenu(open) {
    burger.classList.toggle("is-open", open);
    nav.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
  }

  burger.addEventListener("click", () => {
    setMenu(!nav.classList.contains("is-open"));
  });

  // Закрываем меню после нажатия на пункт
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });


  /* ---------- 3. Активный пункт меню ---------- */
  const navLinks = nav.querySelectorAll(".nav__link");
  const sections = document.querySelectorAll("main section[id]");

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === "#" + entry.target.id);
      });
    });
  }, { rootMargin: "-45% 0px -50% 0px" }); // секция считается активной, когда она в середине экрана

  sections.forEach((section) => sectionObserver.observe(section));


  /* ---------- 4–6. Появление блоков, счётчики, полосы навыков ---------- */
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;

      el.classList.add("is-visible");

      // Запускаем счётчики внутри блока
      el.querySelectorAll(".count").forEach(animateCount);

      // Заполняем полосу навыка
      if (el.dataset.level) {
        el.querySelector(".progress__fill").style.width = el.dataset.level + "%";
      }

      observer.unobserve(el); // анимация срабатывает один раз
    });
  }, { threshold: 0.15 });

  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  // Плавный счёт от 0 до числа из data-count
  function animateCount(el) {
    if (el.dataset.done) return;
    el.dataset.done = "true";

    const target = Number(el.dataset.count);
    const duration = 1600; // длительность в миллисекундах
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // плавное замедление в конце
      el.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }


  /* ---------- 7. Фильтр работ ---------- */
  const filterButtons = document.querySelectorAll(".filters .pill");
  const workCards = document.querySelectorAll(".work-card");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      filterButtons.forEach((b) => b.classList.toggle("is-active", b === button));

      workCards.forEach((card) => {
        const show = filter === "all" || card.dataset.category === filter;
        card.classList.toggle("is-hidden", !show);
      });

      // Один проект в фильтре — карточка во всю область сетки, название крупно по центре
      // (его идея, 2026-11-08). Класс снимаем и ставим заново, чтобы появление проигрывалось каждый раз
      const grid = document.querySelector(".works-grid");
      const visible = [...workCards].filter((card) => !card.classList.contains("is-hidden"));
      grid.classList.remove("is-solo");
      if (filter !== "all" && visible.length === 1) {
        void grid.offsetWidth;
        grid.classList.add("is-solo");
      }
    });
  });


  /* ---------- 8. Окно проекта ---------- */
  const modal = document.getElementById("modal");
  const modalWindow = modal.querySelector(".modal__window");
  const modalBody = document.getElementById("modal-body");
  let lastFocused = null; // куда вернуть фокус после закрытия

  // Переменные цвета, которые переносятся из карточки в окно
  const caseColors = ["--case-bg", "--case-text", "--case-accent", "--case-hover", "--case-controls-bg"];

  // История внутри окна: из списка SMM-проектов можно открыть кейс и вернуться назад
  let modalHistory = [];
  let modalCurrent = null;

  // Показать в окне содержимое шаблона. colorSource — элемент, в style которого цвета кейса
  const modalBack = modal.querySelector("[data-modal-back]");

  function fillModal(template, colorSource) {
    modalCurrent = { template, colorSource };
    modalBack.hidden = modalHistory.length === 0; // стрелка «назад» — только если есть куда вернуться
    modalBody.innerHTML = "";
    modalBody.appendChild(template.content.cloneNode(true));
    initGalleries(modalBody); // если в кейсе есть галерея — строим её
    initInfographic(modalBody); // то же для просмотра инфографики
    initProject(modalBody); // и для кейса стороннего проекта
    buildPointTabs(modalBody); // пункты «Продукт / Амбиции / …» — кнопками на телефоне
    buildFactTabs(modalBody); // «Задача / Как делал / Объём» в «Брендах 360°» — кнопками на телефоне
    buildAiTabs(modalBody); // «Герои из нейросети…» — кнопка с иконками нейросетей над героями

    caseColors.forEach((name) => {
      modalWindow.style.setProperty(name, colorSource.style.getPropertyValue(name));
    });
    modalWindow.scrollTop = 0;
  }

  function openModal(card) {
    const template = card.querySelector(".work-card__case");
    if (!template) return;

    modalHistory = [];
    fillModal(template, card);

    lastFocused = document.activeElement;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-locked");
    modalWindow.scrollTop = 0;
    modal.querySelector(".modal__close").focus();
  }

  function closeModal() {
    closeLightbox();
    closeReelsWall();
    modalBody.querySelectorAll("video").forEach((video) => video.pause());
    if (stopProjectSteps) stopProjectSteps();
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-locked");
    if (lastFocused) lastFocused.focus();
  }

  workCards.forEach((card) => {
    if (card.classList.contains("work-card--soon")) return; // заглушка «В разработке» не открывается
    card.querySelector(".work-card__open").addEventListener("click", () => openModal(card));
  });

  // Закрытие: крестик или клик по затемнению
  modal.querySelectorAll("[data-close]").forEach((el) => {
    el.addEventListener("click", closeModal);
  });

  // 2026-11-27 (его просьба, Taqachi «Платформа бренда»): список пунктов .brand-points--cols на телефоне —
  // кнопки по названию пункта (<strong>), текст раскрывается под ними. На компьютере кнопки скрыты, список как был
  function buildPointTabs(root) {
    root.querySelectorAll(".brand-points--cols").forEach((ul, k) => {
      const box = document.createElement("div");
      box.className = "case-tabs case-tabs--3 case-tabs--points";
      box.dataset.caseTabs = "";
      [...ul.children].forEach((li, i) => {
        const key = "bp" + k + "-" + i;
        li.dataset.tabSrc = key;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "case-tabs__btn";
        btn.dataset.tab = key;
        btn.textContent = li.querySelector("strong") ? li.querySelector("strong").textContent : String(i + 1);
        box.appendChild(btn);
      });
      box.insertAdjacentHTML("beforeend", '<div class="case-tabs__panel" hidden></div>');
      ul.before(box);
    });
  }

  // 2026-11-27 (его просьба, «Бренды 360°»): «Задача / Как делал / Объём» (.pj-facts) на телефоне — кнопки,
  // текст пункта раскрывается под ними. На компьютере кнопки скрыты, список как был
  function buildFactTabs(root) {
    root.querySelectorAll(".pj-facts").forEach((ul, k) => {
      const box = document.createElement("div");
      box.className = "case-tabs case-tabs--facts";
      box.dataset.caseTabs = "";
      const lis = [...ul.children];
      if (lis.length === 3) box.classList.add("case-tabs--3");
      lis.forEach((li, i) => {
        const key = "pf" + k + "-" + i;
        li.dataset.tabSrc = key;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "case-tabs__btn";
        btn.dataset.tab = key;
        btn.textContent = li.querySelector("b") ? li.querySelector("b").textContent : String(i + 1);
        box.appendChild(btn);
      });
      box.insertAdjacentHTML("beforeend", '<div class="case-tabs__panel" hidden></div>');
      ul.before(box);
    });
  }

  // 2026-11-27 (его просьба): блок «Герои из нейросети…» на телефоне — одна кнопка во всю ширину:
  // заголовок и иконки нейросетей внутри, тексты раскрываются под ней. Стоит прямо над картинкой с героями
  function buildAiTabs(root) {
    root.querySelectorAll(".hm-ai-row").forEach((row, k) => {
      const key = "ai" + k;
      const title = row.querySelector(".pj-sub");
      row.querySelectorAll(".hm-ai__text").forEach((p) => { p.dataset.tabSrc = key; });
      const box = document.createElement("div");
      box.className = "case-tabs case-tabs--ai";
      box.dataset.caseTabs = "";
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "case-tabs__btn";
      btn.dataset.tab = key;
      const name = document.createElement("span");
      name.className = "case-tabs__name";
      name.textContent = title ? title.textContent : "Нейросети";
      btn.appendChild(name);
      const icons = row.querySelector(".hm-ai");
      if (icons) {
        const copy = icons.cloneNode(true);
        // у Gemini градиент задан по id — у копии свой id, иначе два одинаковых
        copy.querySelectorAll("[id]").forEach((el) => {
          const old = el.id;
          el.id = old + "-b" + k;
          copy.querySelectorAll("[fill]").forEach((f) => {
            if (f.getAttribute("fill") === "url(#" + old + ")") f.setAttribute("fill", "url(#" + el.id + ")");
          });
        });
        btn.appendChild(copy);
      }
      box.appendChild(btn);
      box.insertAdjacentHTML("beforeend", '<div class="case-tabs__panel" hidden></div>');
      row.after(box);
    });
  }

  // Кнопки-раскрывашки описания кейса (2026-11-27, только телефон — на компьютере .case-tabs скрыт):
  // нажал кнопку — под кнопками появляется копия текста с data-tab-src того же имени; нажал ещё раз — закрылось
  modalBody.addEventListener("click", (event) => {
    const btn = event.target.closest(".case-tabs__btn");
    if (!btn) return;
    const box = btn.closest("[data-case-tabs]");
    const panel = box.querySelector(".case-tabs__panel");
    const wasOpen = btn.classList.contains("is-active");
    box.querySelectorAll(".case-tabs__btn").forEach((b) => b.classList.remove("is-active"));
    panel.innerHTML = "";
    panel.hidden = wasOpen;
    if (wasOpen) return;
    btn.classList.add("is-active");
    modalBody.querySelectorAll('[data-tab-src="' + btn.dataset.tab + '"]').forEach((src) => {
      if (src.matches("h4")) return; // заголовок не нужен — его называет сама кнопка
      const copy = src.cloneNode(true);
      copy.removeAttribute("data-tab-src");
      panel.appendChild(copy);
    });
  });

  // Переходы внутри окна:
  //   [data-open-case="home-market"] — открыть кейс из <template id="case-home-market">
  //   [data-case-back]               — вернуться к предыдущему экрану (списку проектов)
  modalBody.addEventListener("click", (event) => {
    const openBtn = event.target.closest("[data-open-case]");
    if (openBtn) {
      const template = document.getElementById("case-" + openBtn.dataset.openCase);
      if (!template) return;
      modalHistory.push(modalCurrent);
      fillModal(template, template);
      return;
    }
    if (event.target.closest("[data-case-back]")) goBack();

    // Плитка направления в кейсе стороннего проекта — плавно к нужному разделу
    const jump = event.target.closest("[data-pj-jump]");
    if (jump) {
      modalBody.querySelector("#" + jump.dataset.pjJump).scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    // Лайтбокс из серии (data-set): первый клик ставит его серию на мокапы над эскалатором,
    // повторный клик по уже показанной серии открывает лайтбокс крупно
    const setTile = event.target.closest(".brand-shot[data-set]");
    if (setTile) {
      const target = [...modalBody.querySelectorAll("[data-pj-mockset]")].find((el) => el._mockset && el._mockset[setTile.dataset.set]);
      if (target && target.dataset.set !== setTile.dataset.set) {
        pjSwitchMockset(target, setTile.dataset.set, modalBody);
        return;
      }
    }

    // Картинка кейса брендинга — на весь экран; листаются все картинки этого кейса
    const shot = event.target.closest(".brand-shot");
    if (shot) {
      // Скрытые годы в переключателе листать незачем
      // 2026-11-16: у картинки с data-lb-group листаются только картинки той же группы, и скрытые вкусы
      // тоже (сосиски Taxtaniyoz: говяжьи → куриные → полтавские → сырные, чипсы — отдельно)
      // 2026-11-23 (его просьба, «Газель»): мокап, который меняется по сериям (mockset), листает в просмотре
      // ВСЕ варианты мокапа, начиная с показанного сейчас
      const msEl = shot.closest("[data-pj-mockset]");
      if (msEl && msEl._mockset) {
        const keys = Object.keys(msEl._mockset);
        const idx = [...msEl.querySelectorAll(".brand-shot")].indexOf(shot);
        const img = shot.querySelector("img");
        const zoom = (window.innerWidth > 960 && Number(shot.dataset.zoomPc)) || Number(shot.dataset.zoom) || 1;
        const list = keys.filter((k) => msEl._mockset[k][idx]).map((k) => ({
          full: msEl._mockset[k][idx] + ".webp", title: img.alt, free: true, zoom, max: Number(shot.dataset.max) || 2,
        }));
        openLightbox(list, Math.max(0, keys.indexOf(msEl.dataset.set)));
        return;
      }
      const group = shot.dataset.lbGroup;
      const shots = group
        ? [...modalBody.querySelectorAll('.brand-shot[data-lb-group="' + group + '"]')]
        // 2026-11-17 (его правило): без группы — только картинки своего раздела, в соседние темы не перескакивать
        // 2026-11-19: в кейсах «Бренды 360°» тема — своя группа картинок (data-pj-group: буклет, айдентика, стикеры…)
        : [...(shot.closest("[data-pj-group]") || shot.closest(".brand-section, .pj-section") || modalBody).querySelectorAll(".brand-shot:not([data-lb-group])")].filter((el) => el.offsetParent !== null);
      const items = shots.map((el) => {
        const img = el.querySelector("img");
        return {
          full: el.dataset.full || img.getAttribute("src"),
          thumb: img.currentSrc || img.getAttribute("src"),   // превью: на телефоне показывается сразу, пока грузится большая
          title: img.alt,
          // Свои пропорции у каждой картинки (иначе рамка 3:4 от инфографики растягивает широкие кадры брендинга)
          free: true,
          scroll: el.classList.contains("pj-shot--top"), // прокручивается только лендинг
          zoom: (window.innerWidth > 960 && Number(el.dataset.zoomPc)) || Number(el.dataset.zoom) || 1, // доля экрана, которую занимает картинка
          max: Number(el.dataset.max) || 2, // во сколько раз можно увеличить относительно родного размера
        };
      });
      openLightbox(items, shots.indexOf(shot));
    }
  });

  // Вернуться на предыдущий экран окна
  function goBack() {
    if (!modalHistory.length) return;
    const prev = modalHistory.pop();
    fillModal(prev.template, prev.colorSource);
  }
  modalBack.addEventListener("click", goBack);

  // Закрытие клавишей Esc (и меню тоже)
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (modal.classList.contains("is-open")) closeModal();
    setMenu(false);
  });


  /* ---------- 9. Год в подвале ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();


  /* ---------- 10. Анимация шагов «Как я работаю» ----------
     По кругу: точка загорается зелёным → зелёная линия бежит к следующей точке →
     та увеличивается и загорается, а пройденный путь становится белым.
     Работает, только пока раздел виден на экране. */
  const STEP_TIME = 900;   // пробег линии между точками, мс (то же, что --step-time в CSS)
  const STEP_PAUSE = 500;  // пауза на каждой точке, мс
  const END_PAUSE = 2200;  // пауза в конце перед новым кругом, мс

  // Запускает анимацию на списке .steps. Возвращает функцию, которая её останавливает
  function runSteps(stepsList) {
    const stepsLine = stepsList.querySelector(".steps__line");
    const stepItems = [...stepsList.querySelectorAll(".step")];

    let stepsTimer = null;
    let stepsRunning = false;

    // Положение центра точки шага на линии (в пикселях от начала линии)
    function stepPoint(step) {
      const vertical = stepItems[1].offsetTop > stepItems[0].offsetTop; // на телефоне шаги идут столбиком
      return vertical ? step.offsetTop + 12.5 : step.offsetLeft + 4.5;
    }

    function setLine(len, done) {
      stepsLine.style.setProperty("--len", len + "px");
      stepsLine.style.setProperty("--done", done + "px");
    }

    // Длина тусклой дорожки — ровно до последней точки
    function setTrack() {
      stepsList.style.setProperty("--track", stepPoint(stepItems[stepItems.length - 1]) + "px");
    }

    function resetSteps() {
      stepsList.classList.add("is-resetting");
      stepItems.forEach((s) => s.classList.remove("is-active", "is-done"));
      setLine(0, 0);
      stepsLine.offsetWidth; // применяем сброс сразу, без анимации
      stepsList.classList.remove("is-resetting");
    }

    // Шаг номер i загорается, затем линия бежит к следующему
    function playStep(i) {
      const current = stepItems[i];
      current.classList.add("is-active");

      const next = stepItems[i + 1];
      if (!next) {
        // Последний шаг: держим паузу и начинаем сначала
        stepsTimer = setTimeout(() => { resetSteps(); playStep(0); }, END_PAUSE);
        return;
      }

      stepsTimer = setTimeout(() => {
        // Линия бежит до следующей точки (белая часть — до текущей)
        setLine(stepPoint(next), stepPoint(current));

        stepsTimer = setTimeout(() => {
          current.classList.remove("is-active");
          current.classList.add("is-done");
          stepsLine.style.setProperty("--done", stepPoint(next) + "px"); // пройденный отрезок белеет
          playStep(i + 1);
        }, STEP_TIME);
      }, STEP_PAUSE);
    }

    function startSteps() {
      if (stepsRunning) return;
      stepsRunning = true;
      resetSteps();
      playStep(0);
    }

    function stopSteps() {
      stepsRunning = false;
      clearTimeout(stepsTimer);
    }

    // При смене размера окна (например, поворот телефона) начинаем заново
    let resizeTimer;
    function onResize() {
      setTrack();
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (!stepsRunning) return;
        stopSteps();
        startSteps();
      }, 200);
    }

    setTrack();
    window.addEventListener("resize", onResize);

    // Если в системе отключены анимации — просто показываем все шаги пройденными
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const last = stepPoint(stepItems[stepItems.length - 1]);
      stepItems.forEach((s) => s.classList.add("is-done"));
      setLine(last, last);
      return () => window.removeEventListener("resize", onResize);
    }

    const watcher = new IntersectionObserver((entries) => {
      entries.forEach((entry) => (entry.isIntersecting ? startSteps() : stopSteps()));
    }, { threshold: 0.3 });
    watcher.observe(stepsList);

    return () => {
      stopSteps();
      watcher.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }

  runSteps(document.getElementById("steps"));


/* ---------- 11. Звуки интерфейса (2026-11-14) ----------
     Звуки не берутся из файлов — их синтезирует браузер (Web Audio).
     Настроение — киберпанк и ИИ: цифровые сигналы, импульсы, «сканирование».
     У каждого действия свой тембр, чтобы на слух было понятно, что произошло:
       category — открыть раздел (карточка на главной): нарастающий «запуск системы»;
       brand    — выбрать бренд или проект внутри раздела: «захват цели», два цифровых сигнала;
       close    — закрыть окно: короткое «выключение» вниз;
       back     — назад к списку: обратный щелчок-чирп;
       filter   — фильтр на главной: пластиковый щелчок с цифровым бипом;
       tab      — вкладки и переключатели в кейсе: тихий импульс;
       nav      — пункт меню: короткое «сканирование» шумом;
       zoom     — открыть картинку крупно: всплеск «фокусировки»;
       tap      — всё остальное: короткий пластиковый щелчок. */
  const SOUND_ON = true;      // false — выключить все звуки
  const SOUND_VOLUME = 1;     // общая громкость (0.5 — тише, 1.5 — громче)

  let audioCtx = null;
  let master = null;          // общий выход: компрессор, чтобы звуки не перегружали друг друга
  let echo = null;            // короткое «цифровое» эхо для больших звуков
  let noiseBuf = null;

  function audioInit() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const comp = audioCtx.createDynamicsCompressor();
    comp.threshold.value = -18;
    comp.ratio.value = 4;
    master = audioCtx.createGain();
    master.gain.value = 2.6 * SOUND_VOLUME; // 2.6 — уровень, при котором щелчки звучат как прежняя нота
    master.connect(comp).connect(audioCtx.destination);

    // Эхо: задержка с затуханием и срезанными верхами
    echo = audioCtx.createDelay(0.5);
    echo.delayTime.value = 0.11;
    const fb = audioCtx.createGain();
    fb.gain.value = 0.32;
    const tone = audioCtx.createBiquadFilter();
    tone.type = "lowpass";
    tone.frequency.value = 2400;
    echo.connect(tone).connect(fb).connect(echo);
    tone.connect(master);

    // Белый шум на полсекунды — из него делаются щелчки и «сканирование»
    noiseBuf = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.5, audioCtx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }

  // Огибающая громкости: быстрая атака, плавное затухание
  function env(node, t, peak, attack, dur) {
    node.gain.setValueAtTime(0.0001, t);
    node.gain.exponentialRampToValueAtTime(peak, t + attack);
    node.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  }

  // Тон: форма волны, частота от f0 к f1, фильтр, по желанию — в эхо
  function tone({ type = "sine", f0, f1 = f0, at = 0, dur = 0.2, vol = 0.05, cut = 6000, q = 0.7, wet = 0 }) {
    const t = audioCtx.currentTime + at;
    const osc = audioCtx.createOscillator();
    const flt = audioCtx.createBiquadFilter();
    const g = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(f0, t);
    if (f1 !== f0) osc.frequency.exponentialRampToValueAtTime(f1, t + dur * 0.85);
    flt.type = "lowpass";
    flt.frequency.value = cut;
    flt.Q.value = q;
    env(g, t, vol, 0.006, dur);
    osc.connect(flt).connect(g).connect(master);
    if (wet) {
      const s = audioCtx.createGain();
      s.gain.value = wet;
      g.connect(s).connect(echo);
    }
    osc.start(t);
    osc.stop(t + dur + 0.05);
  }

  // Шум через полосовой фильтр: щелчок (коротко) или «сканирование» (фильтр едет по частоте)
  function noise({ at = 0, dur = 0.05, vol = 0.05, f0 = 3000, f1 = f0, q = 1.2, kind = "bandpass", wet = 0 }) {
    const t = audioCtx.currentTime + at;
    const src = audioCtx.createBufferSource();
    const flt = audioCtx.createBiquadFilter();
    const g = audioCtx.createGain();
    src.buffer = noiseBuf;
    flt.type = kind;
    flt.Q.value = q;
    flt.frequency.setValueAtTime(f0, t);
    if (f1 !== f0) flt.frequency.exponentialRampToValueAtTime(f1, t + dur);
    env(g, t, vol, 0.002, dur);
    src.connect(flt).connect(g).connect(master);
    if (wet) {
      const s = audioCtx.createGain();
      s.gain.value = wet;
      g.connect(s).connect(echo);
    }
    src.start(t, Math.random() * 0.4);
    src.stop(t + dur + 0.02);
  }

  // Небольшой случайный сдвиг высоты: одинаковые клики не звучат как одна запись
  const jitter = (f) => f * (1 + (Math.random() - 0.5) * 0.04);

  const SOUNDS = {
    // Запуск системы: шум «проезжает» вверх, по нему лесенка из трёх чистых нот и искра наверху.
    // (2026-11-15) Убраны низкий гул и пила снизу — на слух они звучали неприятно
    category() {
      noise({ dur: 0.3, vol: 0.018, f0: 900, f1: 7000, q: 4, wet: 0.3 });
      tone({ type: "triangle", f0: 784, dur: 0.09, vol: 0.035 });
      tone({ type: "triangle", f0: 1175, at: 0.07, dur: 0.09, vol: 0.035 });
      tone({ type: "triangle", f0: 1568, at: 0.14, dur: 0.16, vol: 0.035, wet: 0.5 });
      tone({ type: "sine", f0: 3136, at: 0.2, dur: 0.25, vol: 0.01, wet: 0.6 });
    },
    // Захват цели: щелчок затвора и два цифровых сигнала вверх, как подтверждение ИИ
    brand() {
      noise({ dur: 0.025, vol: 0.035, f0: 4200, q: 2 });
      tone({ type: "triangle", f0: jitter(988), dur: 0.07, vol: 0.05, at: 0.02 });
      tone({ type: "triangle", f0: jitter(1480), dur: 0.16, vol: 0.045, at: 0.1, wet: 0.45 });
      tone({ type: "sine", f0: 2960, f1: 3300, dur: 0.12, vol: 0.012, at: 0.1 });
    },
    // Выключение: тон вниз и мягкий шумовой хвост
    close() {
      tone({ type: "sawtooth", f0: 520, f1: 90, dur: 0.24, vol: 0.03, cut: 1400, q: 4 });
      tone({ type: "sine", f0: 300, f1: 70, dur: 0.22, vol: 0.06 });
      noise({ dur: 0.16, vol: 0.015, f0: 3000, f1: 400, q: 2 });
    },
    // Назад: короткий чирп сверху вниз
    back() {
      noise({ dur: 0.02, vol: 0.04, f0: 3600, q: 2 });
      tone({ type: "triangle", f0: 1400, f1: 700, dur: 0.14, vol: 0.05 });
    },
    // Фильтр: сухой цифровой «тик» и два быстрых высоких сигнала вверх, без низов.
    // (2026-11-15) Раньше тут был низкий «бух» 160→90 Гц — ему не понравилось
    filter() {
      noise({ dur: 0.012, vol: 0.05, f0: 5200, q: 2 });
      tone({ type: "triangle", f0: jitter(1568), dur: 0.05, vol: 0.04 });
      tone({ type: "triangle", f0: jitter(2093), at: 0.045, dur: 0.09, vol: 0.035, wet: 0.3 });
    },
    // Вкладка: тихий цифровой импульс
    tab() {
      noise({ dur: 0.015, vol: 0.045, f0: 3200, q: 2 });
      tone({ type: "triangle", f0: jitter(1175), dur: 0.1, vol: 0.045 });
    },
    // Меню: сканирование — шум проезжает фильтром вверх
    nav() {
      noise({ dur: 0.14, vol: 0.035, f0: 900, f1: 6500, q: 6 });
      tone({ type: "sine", f0: jitter(2093), at: 0.08, dur: 0.07, vol: 0.015 });
    },
    // Крупный просмотр: фокусировка — свип вверх и мягкий «дзынь»
    zoom() {
      tone({ type: "sine", f0: 400, f1: 1600, dur: 0.14, vol: 0.03 });
      tone({ type: "sine", f0: 2349, at: 0.11, dur: 0.22, vol: 0.016, wet: 0.5 });
      noise({ dur: 0.1, vol: 0.012, f0: 2000, f1: 8000, q: 3 });
    },
    // Обычное нажатие: короткий пластиковый щелчок
    tap() {
      noise({ dur: 0.016, vol: 0.06, f0: jitter(2400), q: 1.4 });
      tone({ type: "sine", f0: 180, f1: 110, dur: 0.05, vol: 0.05 });
    },
  };

  function playSound(name) {
    if (!SOUND_ON || !SOUNDS[name]) return;
    try {
      if (!audioCtx) audioInit();
      if (audioCtx.state === "suspended") audioCtx.resume();
      SOUNDS[name]();
    } catch (e) {
      /* браузер без поддержки звука — просто молчим */
    }
  }

  // Один общий обработчик на всю страницу: определяем, по чему кликнули
  document.addEventListener("click", (event) => {
    const target = event.target.closest("a, button, [data-close], .pj-shot, .brand-shot, .pj-show__pic, .df-cal, [data-zoom]");
    if (!target) return;

    if (target.matches(".work-card--soon .work-card__open")) playSound("tap");     // заглушка «В разработке»
    else if (target.matches(".work-card__open")) playSound("category");             // раздел на главной
    else if (target.matches(".smm-item, [data-open-case], .case-tile")) playSound("brand"); // бренд внутри раздела
    else if (target.matches("[data-case-back], [data-modal-back], .case__back")) playSound("back");
    else if (target.matches("[data-close], .modal__close")) playSound("close");
    else if (target.matches(".pill")) playSound("filter");
    else if (target.matches(".smm-tab, .pj-pill, .lightbox__nav, [role='tab']")) playSound("tab");
    else if (target.matches(".nav__link")) playSound("nav");
    else if (target.matches(".pj-shot, .brand-shot, .pj-show__pic, .df-cal, [data-zoom]")) playSound("zoom");
    else playSound("tap");
  });

  /* ---------- 11б. Анимация нажатий (2026-11-14) ----------
     Пластиковые кнопки и плиты «живут» под пальцем:
       • прижал — элемент сразу садится на торец (класс is-pressing);
       • отпустил — пружинит вверх с лёгким перелётом (класс is-released);
       • если после нажатия кнопка стала выбранной (is-active) — короткая вспышка «щелчка».
     Сам вид — в styles.css, блок «НАЖАТИЯ». Работает мышью, пальцем и клавиатурой (Enter, пробел). */
  const PRESS_SEL = [
    ".btn", ".pill", ".pj-pill", ".smm-tab", ".nav__link", ".burger", ".case__back",
    ".modal__back", ".modal__close", ".lightbox__nav",
    ".work-card__open", "button.case-tile", ".pj-dir", ".contact-link", ".smm-item",
    ".pj-shot", ".brand-shot", ".pj-show__pic", "[data-zoom]", ".el-thumb",
  ].join(", ");

  let pressed = null;

  function pressStart(el) {
    if (!el || el.matches(".work-card--soon .work-card__open")) return;
    el.classList.remove("is-released", "is-popped");
    el.classList.add("is-pressing");
    pressed = el;
  }

  function pressEnd(cancel) {
    const el = pressed;
    pressed = null;
    if (!el) return;
    el.classList.remove("is-pressing");
    if (cancel) return;
    // Ждём, пока отработает клик: он может сделать кнопку выбранной
    setTimeout(() => {
      void el.offsetWidth; // перезапуск анимации при быстрых повторных нажатиях
      el.classList.add(el.classList.contains("is-active") ? "is-popped" : "is-released");
    }, 0);
  }

  document.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    pressStart(event.target.closest(PRESS_SEL));
  });
  document.addEventListener("pointerup", () => pressEnd(false));
  document.addEventListener("pointercancel", () => pressEnd(true)); // палец ушёл в прокрутку
  window.addEventListener("blur", () => pressEnd(true));

  document.addEventListener("keydown", (event) => {
    if (event.repeat || (event.key !== "Enter" && event.key !== " ")) return;
    const el = document.activeElement && document.activeElement.closest(PRESS_SEL);
    if (el) pressStart(el);
  });
  document.addEventListener("keyup", (event) => {
    if (event.key === "Enter" || event.key === " ") pressEnd(false);
  });

  // Убираем класс по окончании анимации, чтобы следующая запускалась заново
  document.addEventListener("animationend", (event) => {
    if (/^pl-(release|pop|plate)/.test(event.animationName)) {
      event.target.classList.remove("is-released", "is-popped");
    }
  });

  /* ---------- 11в. Ширина колонки в шапке = ширине меню (2026-11-15) ----------
     Имя, текст и кнопки в шапке стоят ровно под меню и той же ширины.
     Ширину меню отдаём в CSS как --nav-w. */
  const heroNav = document.getElementById("nav");
  if (heroNav) {
    const syncNav = () => {
      const w = heroNav.offsetWidth;
      if (w > 200) document.documentElement.style.setProperty("--nav-w", w + "px");
    };
    syncNav();
    if ("ResizeObserver" in window) new ResizeObserver(syncNav).observe(heroNav);
    if (document.fonts) document.fonts.ready.then(syncNav);

    // Меню на большом экране стоит прямо над колонкой текста в шапке (над «Graphic Designer»),
    // при прокрутке уезжает вверх вместе с ней и дальше держится у верха экрана (2026-11-15)
    const heroGrid = document.querySelector(".hero .hero__grid");
    const WIDE = window.matchMedia("(min-width: 1201px)");
    const NAV_MIN_TOP = 8;
    // 2026-11-16: меню поднято — зазор до «Graphic Designer» вдвое больше прежних 26 px, текст стоит на месте
    const NAV_LIFT = 26;
    const placeNav = () => {
      if (!heroGrid || !WIDE.matches) {
        document.documentElement.style.removeProperty("--nav-top");
        document.documentElement.style.removeProperty("--hero-col-x");
        return;
      }
      document.documentElement.style.setProperty("--nav-h", heroNav.offsetHeight + "px");
      // Колонка текста стоит слева, по краю контейнера (2026-11-15): меню ставим ровно над ней
      const gs = getComputedStyle(heroGrid);
      const colX = heroGrid.getBoundingClientRect().left + parseFloat(gs.paddingLeft || 0);
      document.documentElement.style.setProperty("--hero-col-x", Math.round(colX) + "px");
      // во время наезда шапку держит сдвиг (script.js, «Наезды разделов») — считаем её настоящее место без него
      const heroShift = parseFloat((heroGrid.closest(".hero").style.transform.split(",")[1]) || 0) || 0;
      // 2026-11-23 (его просьба): меню больше не держится у верха на всех разделах — уезжает вместе с шапкой.
      // Вернуть прилипание: снова обернуть в Math.max(NAV_MIN_TOP, …)
      const top = heroGrid.getBoundingClientRect().top - heroShift - NAV_LIFT;
      document.documentElement.style.setProperty("--nav-top", Math.round(top) + "px");
    };
    let navTick = false;
    window.addEventListener("scroll", () => {
      if (navTick) return;
      navTick = true;
      requestAnimationFrame(() => { navTick = false; placeNav(); });
    }, { passive: true });
    window.addEventListener("resize", placeNav);
    placeNav();
    if (document.fonts) document.fonts.ready.then(placeNav);
  }


  /* ---------- 12. Галерея работ в окне проекта ----------
     В кейсе стоит <div class="smm-gallery" data-gallery="home-market">.
     Работы берутся из window.GALLERIES["home-market"] (файл data/home-market.js)
     в том порядке, в каком записаны в файле.
     Сверху — вкладки по форматам. Если во вкладке несколько групп (например,
     Home Market и TECHNO) — у дополнительных групп подзаголовок из window.GALLERY_GROUPS.
     Количество работ нигде не показываем — так решил автор. */
  // label — название вкладки; short — короткое название для телефона (чтобы все вкладки помещались)
  const GALLERY_FORMATS = [
    { key: "1x1",  label: "Посты 1:1",            short: "Посты 1:1" },
    { key: "4x5",  label: "Посты 4:5",            short: "Посты 4:5" },
    { key: "9x16", label: "Reels и Stories 9:16", short: "Reels 9:16" },
    { key: "landing",    label: "Лендинг",    short: "Лендинг" },
    { key: "highlights", label: "Актуальные", short: "Актуальные" },
  ];

  /* ---------- Кейс стороннего проекта: плитки, этапы, матрица форматов ----------
     Данные — в data/kchm-project.js, разметка кейса — <template id="case-kchm-project"> */
  // Группа картинок: плитки с одинаковыми пропорциями, каждая открывается на весь экран
  // Набор мокапов меняется целиком: у каждой плитки группы — свой мокап из набора key.
  // Плитки лайтбоксов этой серии подсвечиваются
  function pjSwitchMockset(el, key, scope) {
    const paths = el._mockset[key];
    el.dataset.set = key;
    el.querySelectorAll(".brand-shot").forEach((tile, i) => {
      if (!paths[i]) return;
      const img = tile.querySelector("img");
      tile.dataset.full = paths[i] + ".webp";
      img.src = paths[i] + "-thumb.webp"; // 2026-11-23: мгновенно, без затухания
    });
    pjMarkMockset(scope, key, el);
    // На телефоне мокап часто ниже экрана: подкручиваем к нему, чтобы смена была видна
    if (window.matchMedia("(max-width: 640px)").matches) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
  function pjMarkMockset(scope, key, el) {
    scope.querySelectorAll(".brand-shot[data-set]").forEach((t) => {
      if (el && !(t.dataset.set in el._mockset)) return; // плитки чужого набора мокапов не трогаем
      t.classList.toggle("is-set", t.dataset.set === key);
    });
  }

  function pjBuildGroup(el, group) {
    // mockset — наборы мокапов по сериям; первый набор совпадает с shots группы
    if (group.mockset) {
      el.dataset.pjMockset = "";
      el._mockset = group.mockset;
      Object.values(group.mockset).forEach((list) => list.forEach((p) => { new Image().src = p + "-thumb.webp"; })); // заранее: смена без мигания
      el.dataset.set = Object.keys(group.mockset)[0];
    }
    // Витрина «макет + мокап» стоит над рядами группы
    if (group.show) el.appendChild(pjBuildShowcase(group, { items: group.show, mockR: 1696 / 2528 }));
    if (group.shows) {
      const boxes = group.shows.map((conf) => pjBuildShowcase(group, conf));
      // showsRow — витрины в один ряд одинаковой высоты (узкий высокий носитель рядом с широким, без пустот)
      if (group.showsRow) el.appendChild(pjShowRow(boxes));
      else boxes.forEach((b) => el.appendChild(b));
    }
    // Ряды одной высоты: каждый кадр показан целиком, без обрезки
    if (group.rows) {
      el.classList.add("pj-rows");
      if (group.float) el.appendChild(pjBuildFloat(group));
      const widen = (shot, node) => {
        node.style.flex = shot.r + " 1 0";
        node.style.setProperty("--r", shot.r); // доля в паре на телефоне
        node.classList.toggle("pj-cell--wide", shot.r >= 3);
        return node;
      };
      group.rows.forEach((row) => {
        const box = document.createElement("div");
        box.className = "pj-row";
        const big = row.length <= 2;
        // Пара из двух картинок и на телефоне остаётся рядом одной высоты (горизонталь с вертикалью без пустот)
        if (row.length === 2 && row.every((cell) => typeof cell === "number")) box.classList.add("pj-row--pair");
        // lead — номер кадра, который на телефоне встаёт сверху во всю ширину, остальные два — парой одной высоты
        if (group.lead !== undefined && row.length === 3) box.classList.add("pj-row--lead");
        row.forEach((cell) => {
          // null — пустое место в ряду, чтобы плитки встали в ту же сетку, что и ряды выше
          if (cell === null) {
            const gap = document.createElement("div");
            gap.style.flex = "1 1 0";
            box.appendChild(gap);
            return;
          }
          // { pair: [мокап, макет] } — пара одной высоты; на телефоне пара не разрывается и встаёт во всю ширину
          // (постеры HOWO KCHM, 2026-11-22). Ширина пары = h·(r1 + r2) + зазор внутри пары
          if (cell && cell.pair) {
            const pair = document.createElement("div");
            pair.className = "pj-duo";
            pair.style.flex = cell.pair.reduce((sum, i) => sum + group.shots[i].r, 0).toFixed(4) + " 1 var(--pj-gap, 16px)";
            cell.pair.forEach((i) => {
              const shot = group.shots[i];
              const node = pjBuildShot(shot, "cover", false);
              (node.querySelector(".pj-shot") || node).style.aspectRatio = shot.r;
              pair.appendChild(widen(shot, node));
            });
            box.appendChild(pair);
            return;
          }
          if (Array.isArray(cell)) {
            const stack = document.createElement("div");
            stack.className = "pj-stack";
            stack.style.flex = 1 / cell.reduce((sum, i) => sum + 1 / group.shots[i].r, 0) + " 1 0";
            // stackExact — кадры столбика в своих пропорциях, без обрезки (буклет DAFNA 2026-11-19):
            // высота столбика = сумма высот кадров + зазор, крупный кадр рядом получает поправку на этот зазор
            if (group.stackExact) {
              stack.classList.add("pj-stack--exact");
              // на телефоне: высокие кадры одним рядом, столбик под ними — строкой.
              // Только для ряда «кадры + один столбик в конце» (сервис KCHM); буклет DAFNA с несколькими столбиками не трогаем
              if (row.filter(Array.isArray).length === 1 && Array.isArray(row[row.length - 1])) box.classList.add("pj-row--exact");
            }
            cell.forEach((i) => {
              const node = stack.appendChild(pjBuildShot(group.shots[i], "cover", false));
              // пропорция — самой картинке, а не фигуре с подписью (иначе подпись сжимает кадр; сервис KCHM 2026-11-22)
              if (group.stackExact) {
                (node.querySelector(".pj-shot") || node).style.aspectRatio = group.shots[i].r;
                node.style.setProperty("--r", group.shots[i].r);
              }
            });
            box.appendChild(stack);
            return;
          }
          const shot = group.shots[cell];
          const node = pjBuildShot(shot, shot.ext === "png" ? "clear" : "cover", big || shot.r >= 3);
          (node.querySelector(".pj-shot") || node).style.aspectRatio = shot.r;
          if (cell === group.lead) node.classList.add("pj-cell--lead");
          box.appendChild(widen(shot, node));
          // Рядом со столбиками stackExact: ширина = r × (X + лишнее столбика), тогда высота совпадает со столбиком.
          // Лишнее = (кадров в столбике − 1) × (зазор 16 px + подпись, если у кадров есть размер под картинкой)
          if (group.stackExact) {
            const k = Math.max(2, ...row.filter(Array.isArray).map((c) => c.length));
            const cap = group.shots.some((s) => s.size) ? " + var(--pj-cap)" : "";
            node.style.flex = `${shot.r} 1 calc(${shot.r} * ${k - 1} * (16px${cap}))`;
          }
        });
        el.appendChild(box);
      });
      if (group.web) el.appendChild(pjBuildWeb(group.web));
      return;
    }

    const cols = group.cols;
    const single = cols === 1 || (cols === 2 && group.fit === "cover");
    const mobileCols = group.colsM || (cols >= 6 ? 3 : cols >= 3 ? 2 : single ? 1 : cols); // colsM — своё число колонок на телефоне
    const count = group.shots.length - (group.feature ? 1 : 0);

    el.style.setProperty("--cols", cols);
    el.style.setProperty("--cols-m", mobileCols);
    el.style.setProperty("--ratio", group.ratio);
    el.classList.toggle("pj-grid--feature", !!group.feature);
    el.classList.toggle("pj-grid--odd", mobileCols === 2 && count % 2 === 1);

    // Крупным плиткам мало превью: сразу полная картинка, иначе длинный баннер плывёт
    group.shots.forEach((shot) => el.appendChild(pjBuildShot(shot, group.fit, cols <= 2)));
  }

  // Витрина «макет + мокап» (его шаблон с 2026-11-10). Подписи под картинками: размер макета или «Мокап».
  // conf: { items: номера кадров, mockR: пропорции мокапов, stack: режим стопки }; у кадра mock — путь к мокапу.
  // Смена (лайтбоксы над эскалатором): сверху крупно макет и рядом мокап, под ними остальные; клик по нижнему
  //   ставит его наверх. Клик по верхним — просмотр в 1,7 раза крупнее витрины.
  // Стопка (билборды, растяжки): макеты стопкой слева, мокап справа во всю высоту стопки. Клик по макету —
  //   просмотр в 2,5 раза крупнее, мокап в просмотре на весь экран; наведение показывает мокап этого макета
  // Ряд витрин одной высоты. Ширину каждой задаёт её пропорция «ширина / высота»: тогда при общей высоте
  // ряд заполняется ровно до края. Пропорция почти не зависит от ширины, поэтому хватает одного-двух пересчётов
  // row — готовый ряд из разметки (data-pj-pair: два раздела с заголовками рядом), иначе создаётся новый
  function pjShowRow(boxes, row) {
    if (!row) {
      row = document.createElement("div");
      boxes.forEach((b) => row.appendChild(b));
    }
    row.classList.add("pj-show-row");
    const PHONE = window.matchMedia("(max-width: 640px)");
    const k = boxes.map(() => 1);
    const balance = () => {
      if (PHONE.matches) { boxes.forEach((b) => (b.style.flex = "")); return; }
      let changed = false;
      boxes.forEach((b, i) => {
        const r = b.getBoundingClientRect();
        if (!r.width || !r.height) return;
        const next = r.width / r.height;
        if (Math.abs(next - k[i]) / k[i] > 0.001) { k[i] = next; changed = true; }
      });
      if (changed) boxes.forEach((b, i) => (b.style.flex = k[i].toFixed(4) + " 1 0"));
    };
    const ro = new ResizeObserver(() => requestAnimationFrame(balance));
    boxes.forEach((b) => ro.observe(b));
    ro.observe(row);
    PHONE.addEventListener("change", balance);
    return row;
  }

  function pjBuildShowcase(group, conf) {
    const items = conf.items.map((i) => group.shots[i]);
    const ext = (shot) => shot.ext || "webp";
    const MOCK_R = conf.mockR;
    const PHONE = window.matchMedia("(max-width: 640px)");
    // Смене нужно минимум три макета под витриной, иначе нижний ряд не заполняется и остаётся пустое место
    // (его правило: пустот не оставлять). Если макетов три или меньше, они идут стопкой, а мокап справа
    conf = Object.assign({}, conf, { stack: conf.stack || items.length <= 3 });
    const box = document.createElement("div");
    box.className = "pj-show" + (conf.stack ? " pj-show--stack" : "");

    // Картинка с подписью под ней; tag — button для кликабельных
    const fig = (cls, r, src, alt, cap) => {
      const f = document.createElement("figure");
      f.className = cls;
      f.innerHTML = `<button class="pj-show__pic${/\.png$/.test(src) ? " pj-show__pic--clear" : ""}" type="button" style="aspect-ratio:${r}"><img src="${src}" alt="${alt}"></button><figcaption>${cap}</figcaption>`;
      return f;
    };
    const mock = fig("pj-show__mock", MOCK_R, items[0].mock + ".webp", "Мокап: " + items[0].alt, "Мокап");
    const mockImg = mock.querySelector("img");
    const setMock = (shot) => {
      if (!shot.mock || mockImg.getAttribute("src") === shot.mock + ".webp") return;
      mockImg.src = shot.mock + ".webp";
      mockImg.alt = "Мокап: " + shot.alt;
    };
    const lbItem = (src, alt, px) => ({ full: src, title: alt, free: true, max: 2, px });

    if (conf.stack) {
      const list = document.createElement("div");
      list.className = "pj-show__list";
      const figs = items.map((shot) => fig("pj-show__item", shot.r, shot.src + "." + ext(shot), shot.alt, shot.size || ""));
      figs.forEach((f) => list.appendChild(f));
      // thumb — лёгкое превью для мелкой плитки; в просмотре всё равно открывается src
      figs.forEach((f, k) => { if (items[k].thumb) f.querySelector("img").src = items[k].thumb; });
      // tight — плотная колонка мелких превью без подписей рядом с крупным мокапом (концепции LABO)
      if (conf.tight) box.classList.add("pj-show--tight");
      mock.style.flex = "none";
      box.append(list, mock);
      // Узкие высокие макеты (траволатор): и на телефоне стоят полоской рядом с мокапом, иначе во всю ширину они в метры ростом
      const tall = items.every((shot) => shot.r < 0.6);
      if (tall) box.classList.add("pj-show--tall");
      if (!tall && !conf.row && items.length === 3 && items.every((shot) => shot.r < 1)) box.classList.add("pj-show--trio");
      if (conf.row) {
        box.classList.add("pj-show--row");
        list.style.gridTemplateColumns = items.map((shot) => `minmax(0, ${shot.r * 100}fr)`).join(" "); // ×100: при сумме долей меньше 1 сетка не заполняет ширину
      }

      // Галерея просмотра. Макеты в 2,5 раза крупнее, чем в стопке, мокапы на весь экран.
      // Если у каждого макета свой мокап — они идут парами: макет, его мокап, следующий макет, его мокап
      // (на телефоне наведения нет, а так связка видна при листании). Если мокап один на всех — сначала все макеты, потом мокап
      const mocks = [...new Set(items.filter((s) => s.mock).map((s) => s.mock))];
      const paired = mocks.length > 1;
      let pos = []; // номер каждого макета в галерее
      let mockPos = {}; // номер каждого мокапа в галерее
      const build = (w) => {
        const gallery = [];
        pos = [];
        mockPos = {};
        items.forEach((shot, k) => {
          pos[k] = gallery.length;
          gallery.push(lbItem(shot.src + "." + ext(shot), shot.alt, w));
          if (paired && shot.mock && !(shot.mock in mockPos)) {
            mockPos[shot.mock] = gallery.length;
            gallery.push(lbItem(shot.mock + ".webp", "Мокап: " + shot.alt, 0));
          }
        });
        if (!paired) mocks.forEach((m) => { mockPos[m] = gallery.length; gallery.push(lbItem(m + ".webp", "Мокап", 0)); });
        return gallery;
      };
      const open = (index) => {
        // lbW — своя ширина макета в просмотре (у мелких превью ×2,5 выходит слишком мало)
        const w = conf.lbW || figs[0].querySelector(".pj-show__pic").getBoundingClientRect().width * 2.5;
        const gallery = build(w);
        openLightbox(gallery, index());
      };
      // У каждого макета свой мокап: первый клик ставит его на мокап и подсвечивает, повторный открывает крупно
      // (как у растяжек на мосту). Мокап один на всех — клик сразу открывает просмотр
      const mark = (k) => figs.forEach((f, i) => f.classList.toggle("is-set", i === k));
      if (paired) mark(0);
      figs.forEach((f, k) => {
        const pic = f.querySelector(".pj-show__pic");
        pic.addEventListener("click", () => {
          if (paired && items[k].mock && mockImg.getAttribute("src") !== items[k].mock + ".webp") {
            setMock(items[k]);
            mark(k);
            return;
          }
          open(() => pos[k]);
        });
      });
      mock.querySelector(".pj-show__pic").addEventListener("click", () =>
        open(() => mockPos[mockImg.getAttribute("src").replace(/\.webp$/, "")] || 0));

      // Высота стопки = высота мокапа (низы картинок на одной линии). Подпись c, зазор в стопке gl:
      // W·S + n·c + (n−1)·gl = M/R + c,  W + g + M = T  →  W = (T − g − R(n−1)(c+gl)) / (1 + R·S)
      const S = items.reduce((sum, shot) => sum + 1 / shot.r, 0);
      const n = items.length;
      let last = 0;
      const fit = () => {
        // 2026-11-27 (его правило для «Брендов 360°»): на телефоне тоже мозаика — макеты столбиком рядом с мокапом,
        // по нажатию всё открывается во весь экран. В один столбец остаются только плотные (tight) и тройки (trio)
        if (PHONE.matches && (conf.tight || box.classList.contains("pj-show--trio"))) { box.style.gridTemplateColumns = ""; last = 0; return; }
        // Один очень длинный макет (растяжка 10×2): рядом с ним мокап выходит крошечным — на телефоне мокап сверху,
        // обрезанный сверху и снизу до 2:1, макет под ним во всю ширину
        const wide = PHONE.matches && n === 1 && items[0].r > 3;
        box.classList.toggle("pj-show--wide", wide);
        if (wide) { box.style.gridTemplateColumns = ""; last = 0; return; }
        const T = box.clientWidth;
        if (!T) return;
        const g = parseFloat(getComputedStyle(box).columnGap) || 16;
        const c = figs[0].offsetHeight - figs[0].querySelector(".pj-show__pic").offsetHeight;
        // В ряд: высота картинок h общая, ширины h·r, мокап h·R; T = h·(Σr + R) + n·g
        const W = conf.row
          ? (() => {
              // dc — насколько подпись под узкими макетами выше подписи мокапа (на телефоне размер переносится на две строки):
              // мокап выше картинок на dc, тогда низы совпадают
              const cm = mock.offsetHeight - mock.querySelector(".pj-show__pic").offsetHeight;
              const cl = Math.max(...figs.map((f) => f.offsetHeight - f.querySelector(".pj-show__pic").offsetHeight));
              const dc = Math.max(0, cl - cm);
              const sumR = items.reduce((a, shot) => a + shot.r, 0);
              const h = (T - n * g - MOCK_R * dc) / (sumR + MOCK_R);
              return h * sumR + (n - 1) * g;
            })()
          : (() => {
              const gl = parseFloat(getComputedStyle(list).rowGap) || g;
              return (T - g - MOCK_R * (n - 1) * (c + gl)) / (1 + MOCK_R * S);
            })();
        if (Math.abs(W - last) < 0.5) return;
        last = W;
        box.style.gridTemplateColumns = `${W.toFixed(2)}px minmax(0, 1fr)`;
      };
      new ResizeObserver(fit).observe(box);
      PHONE.addEventListener("change", fit);
    } else {
      const stage = document.createElement("div");
      stage.className = "pj-show__stage";
      const main = fig("pj-show__main", items[0].r, "", "", "");
      const mainPic = main.querySelector(".pj-show__pic");
      const mainImg = main.querySelector("img");
      const mainCap = main.querySelector("figcaption");
      mock.style.flex = MOCK_R + " 1 0";
      stage.append(main, mock);
      const thumbs = document.createElement("div");
      thumbs.className = "pj-show__thumbs";
      // Колонок внизу столько, сколько макетов под витриной (но не меньше трёх, чтобы один-два не раздувались)
      thumbs.style.setProperty("--n", Math.max(3, items.length - 1));
      box.append(stage, thumbs);

      items.forEach((it) => { new Image().src = it.src + "." + ext(it); if (it.mock) new Image().src = it.mock + ".webp"; });
      const show = (k, animate) => {
        const shot = items[k];
        const put = () => {
          main.style.flex = shot.r + " 1 0";
          mainPic.style.aspectRatio = shot.r;
          mainImg.src = shot.src + "." + ext(shot);
          // Прозрачный PNG (указатель-флажок) — без подложки, иначе под фигурой видны тёмные углы
          mainPic.classList.toggle("pj-show__pic--clear", ext(shot) === "png");
          mainImg.alt = shot.alt;
          mainCap.textContent = shot.size || "";
          mock.hidden = !shot.mock;
          setMock(shot);
          stage.classList.remove("is-out");
        };
        // 2026-11-23 (его просьба): без затухания — макет и мокап меняются мгновенно (картинки подгружены заранее)
        put();

        // Внизу — все, кроме показанного наверху, в исходном порядке
        thumbs.innerHTML = "";
        items.forEach((other, j) => {
          if (j === k) return;
          const f = fig("pj-show__item", other.r, other.src + "-thumb." + ext(other), other.alt, other.size || "");
          const pic = f.querySelector(".pj-show__pic");
          pic.classList.add("pj-show__thumb");
          pic.setAttribute("aria-label", "Показать макет рядом с мокапом");
          pic.querySelector("img").loading = "lazy";
          pic.addEventListener("click", () => show(j, true));
          thumbs.appendChild(f);
        });
      };
      show(0, false);

      // Клик по макету или мокапу — макет в 1,7 раза крупнее, чем в витрине, мокап на весь экран (его правило
      // для всех мокапов); листаются эти двое
      const zoomOpen = (which) => {
        const figs = [main, mock].filter((f) => !f.hidden);
        const list = figs.map((f) => {
          const img = f.querySelector("img");
          const px = f === mock ? 0 : f.querySelector(".pj-show__pic").getBoundingClientRect().width * 1.7;
          return lbItem(img.getAttribute("src"), img.alt, px);
        });
        openLightbox(list, Math.max(0, figs.indexOf(which)));
      };
      mainPic.addEventListener("click", () => zoomOpen(main));
      mock.querySelector(".pj-show__pic").addEventListener("click", () => zoomOpen(mock));
    }

    // Заранее подгружаем крупные картинки и мокапы, чтобы смена была без задержки
    const warm = () => items.forEach((shot) => {
      new Image().src = shot.src + "." + ext(shot);
      if (shot.mock) new Image().src = shot.mock + ".webp";
    });
    if ("requestIdleCallback" in window) requestIdleCallback(warm); else setTimeout(warm, 1500);
    return box;
  }

  // Парящие карты: каждая в своей колонке, ровно над колонкой первого ряда (там мокапы этих же карт).
  // Карта медленно покачивается в 3D, по ней скользит блик; у каждой свой темп, чтобы не двигались строем
  function pjBuildFloat(group) {
    const box = document.createElement("div");
    box.className = "pj-row pj-float";
    group.float.forEach((i, k) => {
      const shot = group.shots[i];
      const full = shot.src + "." + (shot.ext || "webp");
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = "brand-shot pj-float__cell";
      cell.dataset.full = full;
      if (shot.zoomPc) cell.dataset.zoomPc = shot.zoomPc; // просмотр меньше (подарочные карты Home Market — 0.5)
      cell.style.flex = group.shots[group.rows[0][k]].r + " 1 0";
      cell.style.setProperty("--t", [11, 13, 12][k % 3] + "s");
      cell.style.setProperty("--d", -[0, 4.3, 8.1][k % 3] + "s");
      // Толщина пластика: слои по форме карты уходят назад по оси Z, при наклоне видна белая кромка
      const edge = Array.from({ length: 9 }, (_, j) => `<span class="pj-float__edge" style="--z:${-(j + 1) * 0.6}px;--l:${97 - j * 2}%"></span>`).join("");
      cell.innerHTML = `<span class="pj-float__card" style="--m:url('${full}')">${edge}<img src="${full}" alt="${shot.alt}"><span class="pj-float__glare"></span></span>`;
      box.appendChild(cell);
    });
    return box;
  }

  // Лифт к 10-летию: кабина едет с 5 этажа на −1, двери с наклейкой разъезжаются, потом закрываются,
  // лифт уезжает наверх — и всё сначала. Цикл живёт, пока лифт на странице (окно кейса открыто)
  function pjBuildLift(el) {
    const floorEl = el.querySelector(".hm-lift__floor");
    const floors = ["5", "4", "3", "2", "1", "−1"];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const setState = (dir, called) => {
      el.classList.toggle("is-down", dir === "down");
      el.classList.toggle("is-up", dir === "up");
      el.classList.toggle("is-called", called);
    };
    if (reduce) { floorEl.textContent = "−1"; return; }

    (async () => {
      await wait(800); // кейс сначала вставляется в окно, потом лифт трогается
      while (el.isConnected) {
        // Едет вниз: кнопка вызова горит, табло считает этажи
        setState("down", true);
        for (const f of floors) {
          floorEl.textContent = f;
          await wait(f === "−1" ? 350 : 420);
        }
        // Приехал: двери открываются, держатся, закрываются
        setState(null, false);
        el.classList.add("is-open");
        await wait(3400);
        el.classList.remove("is-open");
        await wait(2000);
        // Уезжает наверх
        setState("up", false);
        for (const f of [...floors].reverse().slice(1)) {
          await wait(380);
          floorEl.textContent = f;
        }
        setState(null, false);
        await wait(1200);
      }
    })();
  }

  // Иконки нейросетей рядом с текстом про героев: блок иконок по высоте ровно от заголовка до последней строки,
  // без пустого места сверху (его просьба, 2026-11-08). Высокий текст — иконки столбиком, короткий — квадратом 2×2.
  // Размер иконки подбирается под высоту текста; ширина иконок меняет ширину текста, поэтому считаем в пару проходов
  function pjFitAi(row) {
    const text = row.firstElementChild;
    const icons = row.querySelector(".hm-ai");
    if (!text || !icons) return;
    const gap = 8;
    const fit = () => {
      if (window.matchMedia("(max-width: 640px)").matches) {
        icons.style.removeProperty("--ai");
        icons.style.removeProperty("--ai-cols");
        icons.style.marginTop = "";
        return;
      }
      // Верх иконок — по верху заголовка (у заголовка свой отступ сверху)
      icons.style.marginTop = Math.max(0, text.firstElementChild.getBoundingClientRect().top - text.getBoundingClientRect().top) + "px";
      for (let pass = 0; pass < 3; pass++) {
        const head = text.firstElementChild;
        const last = text.lastElementChild;
        if (!head || !last || !text.offsetHeight) return; // блок скрыт (другой год)
        const h = last.getBoundingClientRect().bottom - head.getBoundingClientRect().top;
        const one = (h - 3 * gap) / 4;
        const cols = one >= 72 ? 1 : 2;
        const size = Math.max(56, Math.min(120, cols === 1 ? one : (h - gap) / 2));
        icons.style.setProperty("--ai-cols", cols);
        icons.style.setProperty("--ai", size.toFixed(1) + "px");
      }
    };
    if ("ResizeObserver" in window) new ResizeObserver(fit).observe(row);
    fit();
  }

  // Веб-баннеры в родном размере: растяжка сверху, высокий баннер слева, остальные столбиком справа.
  // Ширина плитки = w px (но не шире колонки), поэтому мелкие баннеры не растягиваются и не мылятся
  // Веб-баннеры: заголовок, растяжка на всю ширину, ниже слева высокий,
  // справа col[0] на всю ширину столбца и под ним ряд из остальных col одной высоты
  function pjBuildWeb(web) {
    const shotNode = (i) => {
      const shot = web.shots[i];
      const node = pjBuildShot(shot, "clear", true);
      node.classList.add("pj-web__item");
      node.style.setProperty("--r", shot.r);
      (node.querySelector(".pj-shot") || node).style.aspectRatio = shot.r;
      return node;
    };
    const box = document.createElement("div");
    box.className = "pj-web";
    const title = document.createElement("h5");
    title.className = "pj-sub";
    title.textContent = web.title || "Рекламные баннеры для интернета";
    const body = document.createElement("div");
    body.className = "pj-web__body";
    const col = document.createElement("div");
    col.className = "pj-web__col";
    const top = shotNode(web.col[0]);
    const pair = document.createElement("div");
    pair.className = "pj-web__pair";
    web.col.slice(1).forEach((i) => pair.appendChild(shotNode(i)));
    col.append(top, pair);
    const tall = shotNode(web.tall);
    tall.classList.add("pj-web__tall");
    body.append(tall, col);
    box.append(title, shotNode(web.full), body);

    // Ширина высокого баннера t: его высота t/rt равна высоте столбца справа
    // (широкий + подпись + зазор + ряд). Решение линейного уравнения
    const rt = web.shots[web.tall].r;
    const rTop = web.shots[web.col[0]].r;
    const sum = web.col.slice(1).reduce((s, i) => s + web.shots[i].r, 0);
    const fit = () => {
      const C = body.clientWidth;
      if (!C || window.matchMedia("(max-width: 760px)").matches) { tall.style.width = ""; return; }
      const g = parseFloat(getComputedStyle(body).columnGap) || 16;
      const cap = top.offsetHeight - (top.querySelector(".pj-shot") || top).offsetHeight; // подпись под широким
      const t = ((C - g) / rTop + cap + g + (C - 2 * g) / sum) / (1 / rt + 1 / rTop + 1 / sum);
      tall.style.width = t.toFixed(2) + "px";
    };
    if ("ResizeObserver" in window) new ResizeObserver(fit).observe(body);
    requestAnimationFrame(fit);
    return box;
  }

  // Один кадр группы: заглушка, смена картинок или обычная плитка с просмотром
  function pjBuildShot(shot, fit, useFull) {
    if (shot.wip) {
      const wip = document.createElement("div");
      wip.className = "pj-wip";
      wip.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path class="pj-wip__gear" d="M12 8.500a3.500 3.500 0 1 0 0 7 3.500 3.500 0 0 0 0-7zM12 2v3M12 19v3M2 12h3M19 12h3M4.900 4.900l2.100 2.100M17 17l2.100 2.100M4.900 19.100L7 17M17 7l2.100-2.100"/></svg><span>В разработке</span>';
      return wip;
    }

    let tile;
    if (shot.cycle) {
      tile = document.createElement("div");
      tile.className = "pj-cycle";
      tile.innerHTML = shot.cycle.map((src, i) => `<img src="${src}" alt="${i === 0 ? shot.alt : ""}" loading="lazy" style="animation-delay:${i * 3}s">`).join("");
    } else {
      tile = document.createElement("button");
      tile.type = "button";
      tile.className = "brand-shot pj-shot pj-shot--" + fit;
      const ext = shot.ext || "webp"; // прозрачные картинки хранятся в PNG
      tile.dataset.full = shot.src + "." + ext;
      if (shot.zoom) tile.dataset.zoom = shot.zoom; // слабое качество — открываем не на весь экран
      if (shot.zoomPc) tile.dataset.zoomPc = shot.zoomPc; // то же, но только на компьютере: на телефоне во всю ширину
      if (shot.set) tile.dataset.set = shot.set; // лайтбокс серии: клик меняет мокапы этой серии
      if (shot.max) tile.dataset.max = shot.max; // мелкий баннер: в просмотре не больше max от родного размера
      const img = document.createElement("img");
      img.src = useFull ? tile.dataset.full : shot.src + "-thumb." + ext;
      if (shot.full) tile.dataset.full = shot.full; // своя картинка для просмотра (пост в интерфейсе Telegram и т. п.)
      img.alt = shot.alt;
      if (shot.dx) img.style.translate = shot.dx + "% 0"; // сдвиг картинки вбок, чтобы щит встал по сетке
      img.loading = "lazy";
      tile.appendChild(img);
      // Оживлённая картинка: статичный кадр остаётся для просмотра, поверх — слои с анимацией
      if (shot.anim) {
        const a = shot.anim;
        const pct = (v, total) => (v / total) * 100 + "%";
        tile.classList.add("pj-shot--anim");
        const stage = document.createElement("span");
        stage.className = "pj-anim";
        stage.setAttribute("aria-hidden", "true");
        stage.innerHTML = a.layers.map(([name, x, y, w, h, fx]) =>
          `<img class="pj-anim__layer pj-anim--${fx}" src="${a.dir}${name}.png" alt="" style="left:${pct(x, a.w)};top:${pct(y, a.h)};width:${pct(w, a.w)};height:${pct(h, a.h)}">`).join("");
        // Огоньки: мягкое свечение поверх картинки, пульсирует вразнобой
        (a.glows || []).forEach(([x, y, size, kind], i) => {
          const glow = document.createElement("span");
          glow.className = "pj-glow pj-glow--" + kind;
          glow.style.cssText = `left:${pct(x - size / 2, a.w)};top:${pct(y - size / 2, a.h)};width:${pct(size, a.w)};height:${pct(size, a.h)};animation-delay:${-((i * 0.73) % 2.4).toFixed(2)}s`;
          stage.appendChild(glow);
        });
        // Снег: столбики во всю высоту плитки едут сверху вниз, снежинка — точка наверху столбика
        for (let i = 0; i < (a.snow || 0); i++) {
          const rnd = (k) => { const v = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return v - Math.floor(v); };
          const flake = document.createElement("span");
          flake.className = "pj-snow";
          flake.style.cssText = `left:${(rnd(1) * 100).toFixed(2)}%;--s:${(2 + rnd(2) * 4).toFixed(1)}px;--o:${(0.45 + rnd(3) * 0.5).toFixed(2)};animation-duration:${(6 + rnd(4) * 6).toFixed(1)}s,${(2.5 + rnd(5) * 2).toFixed(1)}s;animation-delay:${(-rnd(6) * 12).toFixed(1)}s,${(-rnd(7) * 4).toFixed(1)}s`;
          stage.appendChild(flake);
        }
        tile.appendChild(stage);
      }
    }

    // Если у картинки указан размер — подпись под плиткой
    if (!shot.size) return tile;
    const figure = document.createElement("figure");
    const caption = document.createElement("figcaption");
    caption.textContent = shot.size;
    figure.append(tile, caption);
    return figure;
  }

  // Страница сайта со скриншота: на место баннера встаёт slot, поверх — стрелки и точки карусели.
  // Всё задано в процентах от скриншота, поэтому страница тянется под любую ширину
  function pjPage(mock, slot, count) {
    const left = (v) => (v / mock.w) * 100 + "%";
    const top = (v) => (v / mock.h) * 100 + "%";
    const box = (x, y, w, h) => `left:${left(x)};top:${top(y)};width:${left(w)};height:${top(h)}`;
    const [dotW, dotH, step, bottom] = mock.dots;
    const dotsW = (count - 1) * step + dotW;
    const dots = Array.from({ length: count }, (_, i) =>
      `<i${i === 0 ? ' class="is-active"' : ""} style="left:${(i * step / dotsW) * 100}%;width:${(dotW / dotsW) * 100}%"></i>`).join("");
    const r = mock.radius;
    const chevron = (d) => `<svg viewBox="0 0 24 24"><path d="${d}"/></svg>`;
    const arrow = (x, d) => `<i class="pj-page__arrow" style="${box(x - mock.arrow / 2, mock.y + (mock.bh - mock.arrow) / 2, mock.arrow, mock.arrow)}">${chevron(d)}</i>`;
    return `<div class="pj-page" style="aspect-ratio:${mock.w}/${mock.h}"><img src="${mock.src}" alt="">`
      + `<div class="pj-page__slot" style="${box(mock.x, mock.y, mock.bw, mock.bh)};border-radius:${(r / mock.bw) * 100}% / ${(r / mock.bh) * 100}%">${slot}</div>`
      + (mock.arrow ? arrow(mock.x, "M15 5l-7 7 7 7") + arrow(mock.x + mock.bw, "M9 5l7 7-7 7") : "")
      + `<div class="pj-page__dots" style="${box(mock.x + (mock.bw - dotsW) / 2, mock.y + mock.bh - bottom - dotH, dotsW, dotH)}">${dots}</div></div>`;
  }

  // Гомография прямоугольника w×h → четырёхугольник q (TL, TR, BR, BL) в виде CSS matrix3d (transform-origin 0 0)
  function pjQuadMatrix(w, h, q) {
    const [x0, y0, x1, y1, x2, y2, x3, y3] = q;
    const dx1 = x1 - x2, dx2 = x3 - x2, dy1 = y1 - y2, dy2 = y3 - y2;
    const sx = x0 - x1 + x2 - x3, sy = y0 - y1 + y2 - y3;
    const det = dx1 * dy2 - dx2 * dy1;
    const g = (sx * dy2 - dx2 * sy) / det, k = (dx1 * sy - sx * dy1) / det;
    // квадрат 0..1 → четырёхугольник, затем делим на w и h
    const a = (x1 - x0 + g * x1) / w, b = (x3 - x0 + k * x3) / h, c = x0;
    const d = (y1 - y0 + g * y1) / w, e = (y3 - y0 + k * y3) / h, f = y0;
    const G = g / w, H = k / h;
    return `matrix3d(${[a, d, 0, G, b, e, 0, H, 0, 0, 1, 0, c, f, 0, 1].map((v) => +v.toFixed(8)).join(",")})`;
  }

  // Разметка мокапа: сцена в пикселях исходника, её масштаб под ширину колонки ставит pjFitScene
  function pjSceneHtml(scene, max) {
    const mx = max ? ` data-max="${max}"` : "";
    const slots = scene.slots.map((slot) => {
      const [w, h] = slot.size.split("x").map(Number);
      const btn = `<button class="brand-shot pj-shot pj-scene__slot" type="button" data-size="${slot.size}" data-lb-group="pj-matrix-scene"${mx}`
        + ` style="width:${w}px;height:${h}px;transform:${pjQuadMatrix(w, h, slot.q)}"><img alt=""></button>`;
      // clip — окно частично закрыто другим устройством (планшет за телефоном): режем по многоугольнику
      if (!slot.clip) return btn;
      const pts = [];
      for (let i = 0; i < slot.clip.length; i += 2) pts.push(`${slot.clip[i]}px ${slot.clip[i + 1]}px`);
      return `<div class="pj-scene__clip" style="clip-path:polygon(${pts.join(",")})">${btn}</div>`;
    }).join("");
    return `<div class="pj-scene" style="aspect-ratio:${scene.w}/${scene.h}"><div class="pj-scene__stage" style="width:${scene.w}px;height:${scene.h}px">`
      + `<img class="pj-scene__base" src="${scene.src}" alt="${scene.alt || ""}">${slots}</div></div>`;
  }
  function pjFitScene(box) {
    const stage = box.querySelector(".pj-scene__stage");
    const fit = () => { stage.style.transform = `scale(${box.clientWidth / stage.offsetWidth})`; };
    fit();
    if (window.ResizeObserver) new ResizeObserver(fit).observe(box);
    else window.addEventListener("resize", fit);
  }

  // Матрица форматов: переключаем модель и язык, все размеры меняются разом.
  // С полем mock баннеры стоят прямо на странице сайта, а кнопки — под ней
  function pjBuildMatrix(el, matrix) {
    let model = matrix.models[0].id;
    let lang = matrix.langs[0].id;
    // series — несколько дизайнов одной матрицы (летняя / зимняя реклама KCHM 2026-11-22), у каждого своя папка
    const series = matrix.series || [];
    let path = series.length ? series[0].path : matrix.path;
    const mock = matrix.mock;

    // Один вариант выбирать незачем: кнопки не нужны
    const pills = (items, kind) => items.length < 2 ? "" : items.map((item, i) =>
      `<button class="pj-pill${i === 0 ? " is-active" : ""}" type="button" data-${kind}="${item.id}">${item.name}</button>`).join("");
    const rows = matrix.rows.map((row) => `<div class="pj-matrix__row">${row.map((size) => {
      const [w, h] = size.split("x");
      if (mock) {
        const page = mock[size];
        const shot = `<button class="brand-shot pj-shot" type="button" data-size="${size}"><img alt=""></button>`;
        return `<figure class="pj-mock" style="flex:${page.w / page.h} 1 0">${pjPage(page, shot, matrix.models.length)}<figcaption>${page.name} · ${w} × ${h}</figcaption></figure>`;
      }
      // max — во сколько раз просмотр может увеличить баннер относительно родного размера (по умолчанию 2)
      const max = matrix.max ? ` data-max="${matrix.max}"` : "";
      // zoomPc — просмотр на компьютере меньше (KCHM 2026-11-22); lb — листаются только баннеры матрицы, не соседние группы раздела
      const zp = matrix.zoomPc ? ` data-zoom-pc="${matrix.zoomPc}"` : "";
      return `<figure style="flex:${w / h} 1 0;--r:${w / h}"><button class="brand-shot pj-shot" type="button" data-size="${size}" data-lb-group="pj-matrix"${max}${zp} style="aspect-ratio:${w}/${h}"><img alt=""></button><figcaption>${w} × ${h}</figcaption></figure>`;
    }).join("")}</div>`).join("");

    // scene — его мокап «монитор + планшет + телефон» (KCHM 2026-11-22): баннеры лежат прямо на экранах в перспективе
    // и меняются вместе с кнопками. Основа — мокап со стёртыми старыми баннерами; каждое окно — четырёхугольник
    // q = [TL, TR, BR, BL] в пикселях мокапа, баннер натягивается на него matrix3d (своё разрешение, без растягивания пропорций)
    const scene = matrix.scene ? pjSceneHtml(matrix.scene, matrix.max) : "";

    // Кнопки под картинками — у мокапа всегда, у простой матрицы по флагу below
    const below = Boolean(mock || matrix.below);
    // Дизайн — отдельной строкой над моделями и языками
    const seriesRow = series.length > 1 ? `<div class="pj-matrix__series">${pills(series, "series")}</div>` : "";
    const controls = `${seriesRow}<div class="pj-matrix__controls"><div>${pills(matrix.models, "model")}</div><div>${pills(matrix.langs, "lang")}</div></div>`;
    el.innerHTML = below ? scene + rows + controls : controls + scene + rows;
    el.classList.toggle("pj-matrix--mock", Boolean(mock));
    el.classList.toggle("pj-matrix--below", below);
    el.classList.toggle("pj-matrix--scene", Boolean(scene));
    if (scene) pjFitScene(el.querySelector(".pj-scene"));

    function update() {
      const index = matrix.models.findIndex((item) => item.id === model);
      const name = matrix.models[index].name;
      el.querySelectorAll("[data-size]").forEach((button) => {
        const src = `${path}/${model}-${button.dataset.size}-${lang}.webp`;
        button.dataset.full = src;
        const img = button.querySelector("img");
        img.src = src;
        img.alt = `${matrix.label || "Лизинг"}: ${name}, ${button.dataset.size}`;
      });
      // Точка карусели — номер выбранного баннера
      el.querySelectorAll(".pj-page__dots").forEach((dots) => {
        [...dots.children].forEach((dot, i) => dot.classList.toggle("is-active", i === index));
      });
    }
    el.addEventListener("click", (event) => {
      const pill = event.target.closest(".pj-pill");
      if (!pill) return;
      if (pill.dataset.model) model = pill.dataset.model;
      if (pill.dataset.lang) lang = pill.dataset.lang;
      if (pill.dataset.series) path = series.find((item) => item.id === pill.dataset.series).path;
      pill.parentElement.querySelectorAll(".pj-pill").forEach((item) => item.classList.toggle("is-active", item === pill));
      update();
    });
    update();
  }

  // Плашка из нескольких видео: части идут строго вместе, иначе разъедутся на стыках
  function pjSyncVideos(box) {
    const videos = [...box.querySelectorAll("video")];
    const playAll = () => videos.forEach((video) => {
      video.currentTime = 0;
      video.play().catch(() => {});
    });
    let ready = 0;
    videos.forEach((video) => {
      video.muted = true;
      video.addEventListener("canplay", () => {
        ready += 1;
        if (ready === videos.length) playAll();
      }, { once: true });
    });
    videos[0].addEventListener("ended", playAll);
  }

  // Переключатель годов: кнопка показывает работы своего года. Данные — в PROJECT_YEARS
  function pjBuildYears(el, years) {
    const bar = document.createElement("div");
    bar.className = "pj-matrix__controls";
    const pillBox = document.createElement("div");
    bar.appendChild(pillBox);
    el.appendChild(bar);

    // Блоки раздела, которые относятся только к некоторым годам
    const bound = [...el.closest(".pj-section").querySelectorAll("[data-show-years]")];
    const showBound = (year) => bound.forEach((block) => {
      block.hidden = !block.dataset.showYears.split(",").includes(year);
    });
    // Сразу открыт год с пометкой open (самый сильный), иначе первый
    const start = Math.max(0, years.findIndex((item) => item.open));
    showBound(years[start].year);

    const panels = years.map((item, i) => {
      const pill = document.createElement("button");
      pill.type = "button";
      pill.className = "pj-pill" + (i === start ? " is-active" : "");
      pill.textContent = item.year;
      pillBox.appendChild(pill);

      const panel = document.createElement("div");
      panel.className = "pj-year";
      panel.hidden = i !== start;
      const text = document.createElement("p");
      text.className = "brand-text";
      text.textContent = item.text;
      const grid = document.createElement("div");
      grid.className = "pj-grid";
      pjBuildGroup(grid, item.group);
      panel.append(text, grid);
      el.appendChild(panel);

      pill.addEventListener("click", () => {
        pillBox.querySelectorAll(".pj-pill").forEach((other) => other.classList.toggle("is-active", other === pill));
        el.querySelectorAll(".pj-year").forEach((other) => { other.hidden = other !== panel; });
        showBound(item.year);
      });
      return panel;
    });
    return panels;
  }

  // Видео играет само, как гифка, но только пока его видно: иначе ролики грузят процессор
  function pjPlayInView(el, videos, onChange) {
    const set = (visible) => {
      videos.forEach((video) => { if (visible) video.play().catch(() => {}); else video.pause(); });
      if (onChange) onChange(visible);
    };
    if (!("IntersectionObserver" in window)) { set(true); return; }
    new IntersectionObserver((entries) => set(entries[0].isIntersecting), { rootMargin: "120px" }).observe(el);
  }

  // Экраны города: все форматы играют одновременно, без панели управления
  function pjBuildScreens(el, screens) {
    el.innerHTML = screens.map((screen) => `<figure class="hm-led__screen hm-led__screen--${screen.slot}">`
      + `<video src="${screen.src}" muted loop playsinline preload="metadata"></video>`
      + `<figcaption><i></i>${screen.name} · ${screen.w} × ${screen.h}</figcaption></figure>`).join("");
    const videos = [...el.querySelectorAll("video")];
    videos.forEach((video) => { video.muted = true; });
    pjPlayInView(el, videos);
  }

  // Анимированные баннеры в один ряд, в настоящих пропорциях. Играют сами, пока их видно.
  // Одиночный баннер занимает полстроки, чтобы не раздуваться на всю ширину
  function pjBuildVideos(el, videos) {
    const flex = (video) => (videos.length > 1 ? `${video.w / video.h} 1 0` : "0 1 calc(50% - 8px)");
    el.innerHTML = `<div class="pj-matrix__row">${videos.map((video) => `<figure style="flex:${flex(video)}">`
      + `<div class="pj-shot pj-video" style="aspect-ratio:${video.w}/${video.h}"><video src="${video.src}" muted loop playsinline preload="metadata"></video></div>`
      + `<figcaption>${video.name} · ${video.w} × ${video.h}</figcaption></figure>`).join("")}</div>`;
    const list = [...el.querySelectorAll("video")];
    list.forEach((video) => { video.muted = true; });
    pjPlayInView(el, list);
  }

  // Матрица анимированных баннеров: та же пара переключателей, что у картинок, но в ряду ролики.
  // У каждой модели свои размеры, поэтому ряд пересобирается при каждом переключении
  function pjBuildVideoMatrix(el, matrix) {
    let model = matrix.models[0].id;
    let lang = matrix.langs[0].id;
    let visible = false;
    const pills = (items, kind) => items.map((item, i) =>
      `<button class="pj-pill${i === 0 ? " is-active" : ""}" type="button" data-${kind}="${item.id}">${item.name}</button>`).join("");
    el.innerHTML = `<div class="pj-matrix__row"></div>`
      + `<div class="pj-matrix__controls"><div>${pills(matrix.models, "model")}</div><div>${pills(matrix.langs, "lang")}</div></div>`;
    el.classList.add("pj-matrix--mock");
    const row = el.querySelector(".pj-matrix__row");
    const videos = () => [...row.querySelectorAll("video")];

    function update() {
      const item = matrix.models.find((entry) => entry.id === model);
      row.innerHTML = item.sizes.map((size) => {
        const [w, h] = size.split("x");
        return `<figure style="flex:${w / h} 1 0"><div class="pj-shot pj-video" style="aspect-ratio:${w}/${h}">`
          + `<video src="${matrix.path}/${model}-${size}-${lang}.mp4" muted loop playsinline preload="metadata" aria-label="${item.name}, ${size}"></video></div>`
          + `<figcaption>${w} × ${h}</figcaption></figure>`;
      }).join("");
      videos().forEach((video) => {
        video.muted = true;
        if (visible) video.play().catch(() => {});
      });
    }
    el.addEventListener("click", (event) => {
      const pill = event.target.closest(".pj-pill");
      if (!pill) return;
      if (pill.dataset.model) model = pill.dataset.model;
      if (pill.dataset.lang) lang = pill.dataset.lang;
      pill.parentElement.querySelectorAll(".pj-pill").forEach((other) => other.classList.toggle("is-active", other === pill));
      update();
    });
    update();
    pjPlayInView(el, [], (state) => {
      visible = state;
      videos().forEach((video) => { if (state) video.play().catch(() => {}); else video.pause(); });
    });
  }

  // Детали изометрии. Все размеры в метрах: x вдоль дороги, y к дороге, z вверх.
  // face — одна грань, box — короб из трёх видимых граней
  function pjIsoKit() {
    const parts = [];
    const face = (kind, x, y, z, w, h, cls, inner = "") => parts.push(
      `<div class="hm-iso__f hm-iso__f--${kind} ${cls}" style="--x:${x};--y:${y};--z:${z};--w:${w};--h:${h}">${inner}</div>`);
    const box = (x, y, z, dx, dy, dz, cls) => {
      face("top", x, y, z + dz, dx, dy, cls);
      face("front", x, y + dy, z + dz, dx, dz, cls);
      face("side", x + dx, y + dy, z + dz, dy, dz, cls);
    };
    return { parts, face, box };
  }

  // Наружный экран в изометрии: ролик играет по кругу, без панели управления
  function pjBuildScreen(el) {
    const { parts, face, box } = pjIsoKit();

    // Дорога, бордюр, тротуар, газон
    // 2026-11-23 (его просьба): подложка ровная — тротуар за экраном срезан (был вытянут вверх на 2 единицы),
    // дорога шире, по ней в обе стороны едут машины (грузовик больше не стоит у бордюра)
    box(0, 4.6, -0.6, 13, 2.8, 0.6, "is-road");
    box(0, 1.3, -0.6, 13, 3, 0.78, "is-walk");
    box(0, 4.3, -0.6, 13, 0.3, 0.84, "is-curb");
    box(0, 1.3, 0.18, 13, 0.55, 0.06, "is-grass");
    box(0.4, 1.32, 0.24, 1.1, 0.45, 0.45, "is-bush");
    box(11, 1.32, 0.24, 1.4, 0.45, 0.45, "is-bush");
    face("top", 0, 4.75, 0.01, 10.3, 0.08, "is-edge");
    face("top", 0, 6.15, 0.01, 10.3, 0.12, "is-dash");
    for (let y = 4.85; y < 7.2; y += 0.6) face("top", 10.6, y, 0.01, 2.1, 0.3, "is-zebra");

    // Свет экрана на тротуаре
    face("top", 0.6, 1.6, 0.19, 10.8, 2.7, "is-glow");

    // Опоры и экран 16:9
    box(3.6, 2.05, 0.18, 0.9, 0.7, 0.3, "is-brand");
    box(7.9, 2.05, 0.18, 0.9, 0.7, 0.3, "is-brand");
    box(3.85, 2.2, 0.48, 0.4, 0.4, 1.4, "is-steel");
    box(8.15, 2.2, 0.48, 0.4, 0.4, 1.4, "is-steel");
    box(1.96, 2, 1.8, 8.08, 0.6, 4.6, "is-cap");
    box(1.96, 2, 6.4, 8.08, 0.6, 0.08, "is-brand");
    face("front", 2, 2.61, 6.35, 8, 4.5, "is-led", `<video src="${el.dataset.isoScreen}" muted loop playsinline preload="auto"></video>`);

    // Машины (как у билборда Home Market, keyframes hm-car-*): ближняя полоса — направо, дальняя у бордюра — налево.
    // --road:13 — длина этой дороги. Грузовик едет налево, поэтому кабина у него слева
    const car = (lane, color, kind, delay, dur) => {
      const kit = pjIsoKit();
      const y = lane === "near" ? 6.4 : 5.0;
      let len = 1.9;
      if (kind === "truck") {
        len = 3.3;
        kit.box(0, y, 0.3, 0.85, 0.95, 0.95, "is-brand");
        kit.box(0.88, y, 0.3, 2.42, 0.95, 1.15, "is-cargo");
        kit.face("front", 0.12, y + 0.96, 0.85, 0.6, 0.35, "is-window");
        [0.2, 2.5].forEach((x) => kit.box(x, y + 0.85, 0, 0.5, 0.12, 0.42, "is-wheel"));
      } else {
        kit.box(0, y, 0.12, 1.9, 0.9, 0.5, color);
        kit.box(0.45, y + 0.08, 0.62, 1.0, 0.74, 0.42, color);
        kit.face("front", 0.55, y + 0.83, 1.0, 0.8, 0.3, "is-window");
        kit.face("side", 1.46, y + 0.82, 1.0, 0.6, 0.3, "is-window");
        [0.3, len - 0.75].forEach((x) => kit.box(x, y + 0.86, 0.02, 0.45, 0.08, 0.36, "is-wheel"));
      }
      parts.push(`<div class="hm-car hm-car--${lane}" style="--road:13;--len:${len};--dur:${dur}s;animation-delay:${delay}s">${kit.parts.join("")}</div>`);
    };
    car("far", "", "truck", -2, 10);
    car("far", "is-car-white", "car", -7, 10);
    car("near", "is-car-red", "car", 0, 6.5);
    car("near", "is-car-yellow", "car", -3.3, 6.5);

    el.querySelector("[data-hm-scene]").innerHTML = parts.join("");
    const video = el.querySelector("video");
    video.muted = true;
    pjPlayInView(el, [video]);
  }

  // Билборд 6 × 3 м в изометрии: на щите по очереди восемь билбордов, по дороге едут машины, над сценой плывут облака.
  // Всё зациклено средствами CSS (hm-bb-in, hm-car-*, hm-cloud)
  function pjBuildBillboard(el) {
    const { parts, face, box } = pjIsoKit();
    const N = 8;

    // Газон, тротуар, бордюр, дорога в две полосы, тротуар за дорогой
    box(0, 0, -0.6, 14, 4.2, 0.78, "is-grass");
    box(0, 4.2, -0.6, 14, 1.3, 0.8, "is-walk");
    box(0, 5.5, -0.6, 14, 0.25, 0.84, "is-curb");
    box(0, 5.75, -0.6, 14, 3.1, 0.6, "is-road");
    box(0, 8.85, -0.6, 14, 0.25, 0.84, "is-curb");
    face("top", 0, 7.25, 0.01, 14, 0.1, "is-dash");
    [[0.6, 0.5, 0.9], [1.8, 2.6, 0.7], [11.6, 0.6, 1], [12.6, 2.4, 0.7]].forEach(([x, y, k]) => {
      box(x + 0.32 * k, y + 0.32 * k, 0.18, 0.18 * k, 0.18 * k, 0.9 * k, "is-trunk");
      box(x, y, 0.18 + 0.9 * k, 0.8 * k, 0.8 * k, 1.1 * k, "is-bush");
    });

    // Опора, площадка и щит: рама чуть больше полотна 6 × 3 м
    box(6.5, 2.1, 0.18, 1.4, 1.4, 0.2, "is-curb");
    box(6.9, 2.5, 0.38, 0.6, 0.6, 3.3, "is-steel");
    box(2.6, 2.45, 3.5, 9.2, 0.7, 4.8, "is-frame");
    const slides = Array.from({ length: N }, (_, i) =>
      `<img src="images/projects/home-market/bbanim/0${i + 1}.webp" alt="" style="--n:${i}">`).join("");
    face("front", 2.9, 3.16, 8.0, 8.6, 4.3, "hm-bb__slides", slides);
    box(3.6, 3.18, 8.3, 0.14, 0.6, 0.12, "is-steel");
    box(10.6, 3.18, 8.3, 0.14, 0.6, 0.12, "is-steel");

    // Машины: каждая — своя группа граней, группа едет по полосе (ближняя направо, дальняя налево)
    const car = (lane, color, kind, delay, dur) => {
      const kit = pjIsoKit();
      const y = lane === "near" ? 7.55 : 6.0;
      if (kind === "bus") {
        kit.box(0, y, 0.02, 3.2, 1, 1.5, color);
        kit.face("front", 0.25, y + 1.01, 1.35, 2.7, 0.45, "is-window");
        kit.face("side", 3.21, y + 1, 1.35, 1, 0.45, "is-window");
      } else {
        kit.box(0, y, 0.12, 1.9, 0.9, 0.5, color);
        kit.box(0.45, y + 0.08, 0.62, 1.0, 0.74, 0.42, color);
        kit.face("front", 0.55, y + 0.83, 1.0, 0.8, 0.3, "is-window");
        kit.face("side", 1.46, y + 0.82, 1.0, 0.6, 0.3, "is-window");
      }
      const len = kind === "bus" ? 3.2 : 1.9;
      [0.3, len - 0.75].forEach((x) => kit.box(x, y + 0.86, 0.02, 0.45, 0.08, 0.36, "is-wheel"));
      parts.push(`<div class="hm-car hm-car--${lane}" style="--len:${len};--dur:${dur}s;animation-delay:${delay}s">${kit.parts.join("")}</div>`);
    };
    car("near", "is-car-red", "car", 0, 7);
    car("near", "is-car-white", "car", -3.5, 7);
    car("far", "is-car-yellow", "car", -1, 9);
    car("far", "is-brand", "bus", -5.5, 9);

    el.querySelector("[data-hm-scene]").innerHTML = parts.join("");

    // Три облака над сценой: стоят на месте (слева и справа вверху), покачиваются в своём ритме
    el.querySelector(".hm-bb__sky").innerHTML = [[3, 6, 1, 4.2, 0], [80, 3, 0.85, 3.6, -1.2], [86, 24, 0.7, 4.8, -2.4]]
      .map(([left, top, k, dur, delay]) => `<i class="hm-cloud" style="--left:${left}%;--top:${top}%;--k:${k};--dur:${dur}s;animation-delay:${delay}s"></i>`).join("");
  }

  // Автобус Самарканда: камера едет за автобусом. Дорога — плоскость в 3D, разметка бежит к зрителю, деревья по краям
  // выплывают из дали и уходят за кадр. На задней части автобуса дизайны сменяются каждые 3 с.
  // Превьюшки под сценой: наведение ставит дизайн на автобус, клик открывает плоский дизайн крупно. Вне экрана всё стоит
  function pjBuildBus(el, group) {
    const shots = group.shots;
    const STEP = 3000;
    // Деревья: сторона, отступ от центра дороги (в единицах плоскости), размер, сдвиг по времени
    const trees = [];
    for (let k = 0; k < 7; k++) {
      trees.push({ x: 238 + (k % 2) * 16, s: 0.85 + (k % 3) * 0.15, t: k / 7 });
      trees.push({ x: 110 - (k % 2) * 14, s: 0.9 + ((k + 1) % 3) * 0.15, t: (k + 0.5) / 7 });
    }
    el.innerHTML = `<div class="hm-bus__stage">
      <div class="hm-bus__view"><div class="hm-bus__ground"><div class="hm-bus__road"></div>${trees.map((tr) =>
        `<i class="hm-bus__tree" style="left:${tr.x}cqw;--s:${tr.s};animation-delay:${(-tr.t * 8).toFixed(2)}s"></i>`).join("")}</div></div>
      <i class="hm-bus__shadow"></i>
      <div class="hm-bus__bus">
        <i class="hm-bus__wheel hm-bus__wheel--l"></i><i class="hm-bus__wheel hm-bus__wheel--r"></i>
        <div class="hm-bus__body">
          <i class="hm-bus__marker hm-bus__marker--l"></i><i class="hm-bus__marker hm-bus__marker--r"></i>
          <div class="hm-bus__window"><span class="hm-bus__route">3</span></div>
          <span class="hm-bus__lights hm-bus__lights--l"><i></i><i></i><i></i><i></i></span>
          <span class="hm-bus__lights hm-bus__lights--r"><i></i><i></i><i></i><i></i></span>
          <i class="hm-bus__hazard hm-bus__hazard--l"></i><i class="hm-bus__hazard hm-bus__hazard--r"></i>
          <div class="hm-bus__ad">${shots.map((shot) =>
            `<img src="${shot.src}-thumb.webp" alt="${shot.alt}" decoding="async">`).join("")}</div>
          <i class="hm-bus__handle hm-bus__handle--l"></i><i class="hm-bus__handle hm-bus__handle--c"></i><i class="hm-bus__handle hm-bus__handle--r"></i>
          <div class="hm-bus__bumper"><i class="hm-bus__chev hm-bus__chev--l"></i><span class="hm-bus__plate">30 <b>777 HMA</b></span><i class="hm-bus__chev hm-bus__chev--r"></i></div>
        </div>
      </div>
    </div>
    <div class="hm-bus__thumbs">${shots.map((shot) =>
      `<button type="button" aria-label="${shot.alt}"><img src="${shot.src}-thumb.webp" alt="" loading="lazy"><i></i></button>`).join("")}</div>
    <p class="hm-bus__note">${group.size} · задняя часть автобуса · 2022–2024</p>`;
    const slides = [...el.querySelectorAll(".hm-bus__ad img")];
    const thumbs = [...el.querySelectorAll(".hm-bus__thumbs button")];
    let cur = -1, timer = 0, visible = false, hover = false;
    const show = (k) => {
      cur = (k + shots.length) % shots.length;
      slides.forEach((img, i) => img.classList.toggle("is-on", i === cur));
      thumbs.forEach((b, i) => {
        b.classList.remove("is-on");
        if (i === cur) { void b.offsetWidth; b.classList.add("is-on"); } // полоска времени начинается заново
      });
    };
    const run = () => {
      clearInterval(timer);
      const go = visible && !hover;
      el.classList.toggle("is-paused", !visible);
      el.classList.toggle("is-held", visible && hover);
      if (go) timer = setInterval(() => show(cur + 1), STEP);
    };
    // Все дизайны одного размера 1100 × 620; на компьютере просмотр в половину экрана (его просьба), на телефоне во всю ширину
    const open = (k) => openLightbox(shots.map((shot) => ({ full: shot.src + ".webp", title: `${shot.alt} · ${group.size} · ${shot.year}`, free: true, max: 2, px: 0, zoom: window.innerWidth > 960 ? 0.5 : 1 })), k);
    thumbs.forEach((b, i) => {
      b.addEventListener("mouseenter", () => { hover = true; show(i); run(); });
      b.addEventListener("mouseleave", () => { hover = false; run(); });
      b.addEventListener("click", () => { show(i); open(i); });
    });
    el.querySelector(".hm-bus__ad").addEventListener("click", () => open(cur));
    show(0);
    if (!("IntersectionObserver" in window)) { visible = true; run(); return; }
    new IntersectionObserver((entries) => { visible = entries[0].isIntersecting; run(); }, { threshold: 0.2 }).observe(el);
  }

  // «Пролёт камеры»: кадры сменяют друг друга каждые 4,5 с, каждый медленно наезжает и сдвигается в свою сторону.
  // Миниатюра — выбрать кадр (полоска на ней показывает время до следующего), клик по кадру — просмотр на весь экран.
  // Вне экрана и под курсором облёт стоит
  function pjBuildFly(el, group) {
    const shots = group.shots;
    const STEP = 4500;
    const moves = ["fly-a", "fly-b", "fly-c", "fly-d"];
    el.innerHTML = `<div class="hm-fly__stage">${shots.map((shot, i) =>
      `<img class="${moves[i % moves.length]}" src="${shot.src}.webp" alt="${shot.alt}" loading="${i < 2 ? "eager" : "lazy"}" decoding="async">`).join("")}
      <span class="hm-fly__cap"></span></div>
      <div class="hm-fly__thumbs">${shots.map((shot, i) =>
      `<button type="button" aria-label="${shot.alt}"><img src="${shot.src}-thumb.webp" alt="" loading="lazy"><i></i></button>`).join("")}</div>`;
    const slides = [...el.querySelectorAll(".hm-fly__stage img")];
    const thumbs = [...el.querySelectorAll(".hm-fly__thumbs button")];
    const cap = el.querySelector(".hm-fly__cap");
    let cur = -1, timer = 0, visible = false, hover = false;

    const show = (k) => {
      cur = (k + shots.length) % shots.length;
      slides.forEach((img, i) => {
        const on = i === cur;
        // Наезд (is-play) снимаем только с нового кадра, чтобы начать заново. Уходящий кадр
        // продолжает движение, пока растворяется, иначе на смене он рывком встаёт на место
        if (on) { img.classList.remove("is-on", "is-play"); void img.offsetWidth; img.classList.add("is-play"); }
        img.classList.toggle("is-on", on);
      });
      thumbs.forEach((b, i) => {
        b.classList.remove("is-on");
        if (i === cur) { void b.offsetWidth; b.classList.add("is-on"); }
      });
      cap.textContent = `${String(cur + 1).padStart(2, "0")} / ${shots.length} · ${shots[cur].alt}`;
      const t = thumbs[cur];
      const strip = t.parentElement;
      if (strip.scrollWidth > strip.clientWidth) strip.scrollTo({ left: t.offsetLeft - (strip.clientWidth - t.offsetWidth) / 2, behavior: "smooth" });
    };
    const run = () => {
      clearInterval(timer);
      const go = visible && !hover;
      el.classList.toggle("is-paused", !go);
      if (go) timer = setInterval(() => show(cur + 1), STEP);
    };
    thumbs.forEach((b, i) => b.addEventListener("click", () => { show(i); run(); }));
    const stage = el.querySelector(".hm-fly__stage");
    stage.addEventListener("click", () => openLightbox(shots.map((shot) => ({ full: shot.src + ".webp", title: shot.alt, free: true, max: 2, px: 0 })), cur));
    stage.addEventListener("mouseenter", () => { hover = true; run(); });
    stage.addEventListener("mouseleave", () => { hover = false; run(); });
    show(0);
    if (!("IntersectionObserver" in window)) { visible = true; run(); return; }
    new IntersectionObserver((entries) => { visible = entries[0].isIntersecting; run(); }, { threshold: 0.3 }).observe(el);
  }

  // Настольный календарь-домик DAFNA 2025 — рисуется на canvas в своей изометрии (без CSS-3D, поэтому без дёрганий).
  // Размеры в сантиметрах: x вдоль стола, y к зрителю, z вверх. Лист 21 × 15 см, домик наклонён на 17°, пружина
  // Wire-O. Верхний лист каждые несколько секунд поднимается, изгибаясь, проходит через верх и ложится назад;
  // под ним уже следующий месяц. Только календарь, без стола (его просьба 2026-11-14). Клик открывает текущий месяц.
  // Вне экрана и при «меньше движения» календарь стоит
  /* ---------- Анимация юбилейного знака «30 DAFNA yil birga» (2026-11-15, третья версия) ----------
     Без SVG: берём его PNG (1362 × 287) и показываем по частям через маски на canvas.
       «3» рисуется как рукой, по частям: верхняя планка слева направо → диагональ сверху вниз →
           когда диагональ дошла до конца, по часовой обводится закругление → хвосты внизу уходят влево;
       «0» — три кольца по очереди: сначала внешнее, потом среднее, потом внутреннее,
           каждое обводится по кругу от верхней точки;
       у каждой линии впереди бежит мягкий золотой огонёк;
       буквы DAFNA (белые, фон тёмный) плавно поднимаются по одной, затем проявляется YIL BIRGA;
       пауза с бликом по цифрам, плавное затухание — и по кругу, как зацикленная гифка.
     Пиксели картинки не читаем: при открытии сайта файлом с диска браузер это запрещает.
     Все числа — в пикселях исходного PNG. Длительность цикла — LOGO30_LOOP секунд */
  const LOGO30_LOOP = 10;
  // 2026-11-19 (его просьба): вся анимация на 20 % быстрее, цифры 30 собираются ещё на 10 % быстрее
  const LOGO30_SPEED = 1.2, LOGO30_DIGITS = 1.1;

  function pjBuildLogo30(el) {
    const img = new Image();
    img.onload = () => {
      const W = img.naturalWidth, H = img.naturalHeight;
      const PAD = 36;                                   // поля под свечение
      const canvas = document.createElement("canvas");
      canvas.className = "df-logo30__canvas";
      canvas.width = W + PAD * 2;
      canvas.height = H + PAD * 2;
      el.appendChild(canvas);
      const ctx = canvas.getContext("2d");

      const mk = () => {
        const c = document.createElement("canvas");
        c.width = W;
        c.height = H;
        return c;
      };
      // Слой: кусок PNG; white — перекрасить в белый
      const layer = (x0, x1, y0, y1, white) => {
        const c = mk();
        const g = c.getContext("2d");
        g.drawImage(img, x0, y0, x1 - x0, y1 - y0, x0, y0, x1 - x0, y1 - y0);
        if (white) {
          g.globalCompositeOperation = "source-in";
          g.fillStyle = "#ffffff";
          g.fillRect(0, 0, W, H);
        }
        return c;
      };
      const THREE_X = 193, ZERO_X = 500, TEXT_X = 520, BIG_Y = 200;
      const three = layer(0, THREE_X, 0, H);
      const zero = layer(THREE_X, ZERO_X, 0, H);
      const sub = layer(TEXT_X, W, BIG_Y, H, true);
      // Буквы DAFNA: границы посчитаны заранее по пустым столбцам картинки
      const letters = [[552, 706], [712, 875], [896, 1004], [1029, 1179], [1198, 1362]].map(([a, b]) => layer(a, b, 0, BIG_Y, true));

      // Плавность: мягкий разгон и мягкое торможение
      const clamp = (t) => Math.max(0, Math.min(1, t));
      const inOut = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
      const outQ = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : 1 - Math.pow(1 - t, 4));
      const seg = (t, from, dur, fn = inOut) => fn(clamp((t - from) / dur));

      const mask = mk();
      const mg = mask.getContext("2d");
      const tmp = mk();
      const tg = tmp.getContext("2d");

      // Показать часть слоя: draw рисует маску (чёрным, любой формы и сколько угодно вызовов)
      function reveal(src, draw, alpha = 1) {
        mg.clearRect(0, 0, W, H);
        mg.fillStyle = mg.strokeStyle = "#000";
        draw(mg);
        tg.globalCompositeOperation = "source-over";
        tg.clearRect(0, 0, W, H);
        tg.drawImage(src, 0, 0);
        tg.globalCompositeOperation = "destination-in";
        tg.drawImage(mask, 0, 0);
        tg.globalCompositeOperation = "source-over";
        ctx.globalAlpha = alpha;
        ctx.drawImage(tmp, 0, 0);
      }

      // Огонёк на конце линии: кусочек слоя вокруг точки, подсвеченный и с мягким ореолом
      function spark(src, x, y, power, alpha) {
        if (power <= 0.01) return;
        mg.clearRect(0, 0, W, H);
        const r = 30;
        const grd = mg.createRadialGradient(x, y, 0, x, y, r);
        grd.addColorStop(0, "rgba(0,0,0,1)");
        grd.addColorStop(1, "rgba(0,0,0,0)");
        mg.fillStyle = grd;
        mg.fillRect(x - r, y - r, r * 2, r * 2);
        tg.globalCompositeOperation = "source-over";
        tg.clearRect(0, 0, W, H);
        tg.drawImage(src, 0, 0);
        tg.globalCompositeOperation = "destination-in";
        tg.drawImage(mask, 0, 0);
        tg.globalCompositeOperation = "source-in";
        tg.fillStyle = "rgb(255, 226, 160)";
        tg.fillRect(0, 0, W, H);
        tg.globalCompositeOperation = "source-over";
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        ctx.globalAlpha = alpha * power;
        ctx.shadowColor = "rgba(255, 190, 90, 0.85)";
        ctx.shadowBlur = 22;
        ctx.drawImage(tmp, 0, 0);
        ctx.restore();
      }
      // Огонёк виден, пока линия рисуется, и мягко гаснет в конце
      const sparkPower = (p) => (p <= 0 || p >= 1 ? 0 : Math.min(1, p * 6, (1 - p) * 5));

      /* ----- «3» ----- */
      const lerp = (a, b, p) => a + (b - a) * p;
      const BAR = { x0: -12, x1: 196, y: 21, w: 50 };                 // верхняя планка
      const DIAG = { x0: 176, y0: 30, x1: 4, y1: 182, w: 54 };         // диагональ
      // Закругление: сектор по часовой от конца диагонали (слева, -170°) до низа (+90°) — так открываются и перемычки у диагонали
      const BOWL = { cx: 95, cy: 195, r: 125, a0: -2.967, a1: Math.PI / 2 };
      const TAIL = { x0: 100, x1: -12, y0: 196, y1: H };               // хвосты внизу — влево

      function drawThree(t, alpha) {
        const pBar = seg(t, 0.0, 0.85);
        const pDiag = seg(t, 0.7, 0.9);
        const pBowl = seg(t, 1.5, 1.15);
        const pTail = seg(t, 2.5, 0.55);
        if (pBar <= 0) return;
        reveal(three, (g) => {
          g.lineCap = "round";
          g.lineWidth = BAR.w;
          g.beginPath();
          g.moveTo(BAR.x0, BAR.y);
          g.lineTo(lerp(BAR.x0, BAR.x1, pBar), BAR.y);
          g.stroke();
          if (pDiag > 0) {
            g.lineWidth = DIAG.w;
            g.beginPath();
            g.moveTo(DIAG.x0, DIAG.y0);
            g.lineTo(lerp(DIAG.x0, DIAG.x1, pDiag), lerp(DIAG.y0, DIAG.y1, pDiag));
            g.stroke();
          }
          if (pBowl > 0) {
            g.beginPath();
            g.moveTo(BOWL.cx, BOWL.cy);
            g.arc(BOWL.cx, BOWL.cy, BOWL.r, BOWL.a0, lerp(BOWL.a0, BOWL.a1, pBowl));
            g.closePath();
            g.fill();
          }
          if (pTail > 0) g.fillRect(lerp(TAIL.x0, TAIL.x1, pTail), TAIL.y0, TAIL.x0 - lerp(TAIL.x0, TAIL.x1, pTail), TAIL.y1 - TAIL.y0);
        }, alpha);
        // Огоньки на концах рисующихся линий
        spark(three, lerp(BAR.x0, BAR.x1, pBar), BAR.y, sparkPower(pBar), alpha);
        spark(three, lerp(DIAG.x0, DIAG.x1, pDiag), lerp(DIAG.y0, DIAG.y1, pDiag), sparkPower(pDiag), alpha);
        const aB = lerp(BOWL.a0, BOWL.a1, pBowl);
        spark(three, BOWL.cx + Math.cos(aB) * 75, BOWL.cy + Math.sin(aB) * 75, sparkPower(pBowl), alpha);
      }

      /* ----- «0»: три кольца по очереди, снаружи внутрь ----- */
      const CX = 345, CY = 143;
      const RINGS = [
        { r0: 121, r1: 152, from: 1.0, dur: 1.6, mid: 137 },  // внешнее
        { r0: 88, r1: 121, from: 1.55, dur: 1.5, mid: 105 },  // среднее
        { r0: 0, r1: 88, from: 2.1, dur: 1.4, mid: 73 },      // внутреннее
      ];
      function drawZero(t, alpha) {
        const ps = RINGS.map((R) => seg(t, R.from, R.dur));
        if (ps[0] <= 0) return;
        reveal(zero, (g) => {
          RINGS.forEach((R, i) => {
            const p = ps[i];
            if (p <= 0) return;
            const a0 = -Math.PI / 2, a1 = a0 + Math.PI * 2 * p;
            g.beginPath();                                   // кольцевой сектор: внешняя дуга туда, внутренняя обратно
            g.arc(CX, CY, R.r1, a0, a1);
            if (R.r0 > 0) g.arc(CX, CY, R.r0, a1, a0, true);
            else g.lineTo(CX, CY);
            g.closePath();
            g.fill();
          });
        }, alpha);
        RINGS.forEach((R, i) => {
          const a = -Math.PI / 2 + Math.PI * 2 * ps[i];
          spark(zero, CX + Math.cos(a) * R.mid, CY + Math.sin(a) * R.mid, sparkPower(ps[i]), alpha);
        });
      }

      // Блик по цифрам: светлая полоса медленно проезжает слева направо
      function drawShine(p, alpha) {
        if (p <= 0 || p >= 1) return;
        const x = -160 + p * (ZERO_X + 320);
        mg.clearRect(0, 0, W, H);
        const grd = mg.createLinearGradient(x - 90, 0, x + 90, 0);
        grd.addColorStop(0, "rgba(0,0,0,0)");
        grd.addColorStop(0.5, "rgba(0,0,0,1)");
        grd.addColorStop(1, "rgba(0,0,0,0)");
        mg.fillStyle = grd;
        mg.fillRect(0, 0, W, H);
        tg.globalCompositeOperation = "source-over";
        tg.clearRect(0, 0, W, H);
        tg.drawImage(three, 0, 0);
        tg.drawImage(zero, 0, 0);
        tg.globalCompositeOperation = "destination-in";
        tg.drawImage(mask, 0, 0);
        tg.globalCompositeOperation = "source-in";
        tg.fillStyle = "rgb(255, 236, 190)";
        tg.fillRect(0, 0, W, H);
        tg.globalCompositeOperation = "source-over";
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        ctx.globalAlpha = alpha * 0.8;
        ctx.drawImage(tmp, 0, 0);
        ctx.restore();
      }

      function frame(t) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.globalAlpha = 1;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Весь знак медленно «наезжает»: 0,96 → 1 за время сборки
        const k = 0.96 + 0.04 * seg(t, 0, 5.2, outQ);
        ctx.setTransform(k, 0, 0, k, PAD + (W / 2) * (1 - k), PAD + (H / 2) * (1 - k));
        const out = 1 - seg(t, 8.4, 1.0);                     // плавное затухание в конце цикла

        drawThree(t * LOGO30_DIGITS, out);
        drawZero(t * LOGO30_DIGITS, out);

        // Буквы DAFNA: плавно поднимаются и проявляются по одной
        letters.forEach((c, i) => {
          const p = seg(t, 3.1 + i * 0.16, 0.95, outQ);
          if (p <= 0) return;
          ctx.globalAlpha = out * p;
          ctx.drawImage(c, 0, (1 - p) * 34);
        });
        // YIL BIRGA: мягко проявляется слева направо
        const ps = seg(t, 4.1, 1.0);
        if (ps > 0) {
          const edge = 120;                                   // ширина мягкого края
          const x = TEXT_X - edge + (W - TEXT_X + edge * 2) * ps;
          mg.clearRect(0, 0, W, H);
          const grd = mg.createLinearGradient(x - edge, 0, x, 0);
          grd.addColorStop(0, "rgba(0,0,0,1)");
          grd.addColorStop(1, "rgba(0,0,0,0)");
          mg.fillStyle = grd;
          mg.fillRect(0, BIG_Y, x, H - BIG_Y);
          tg.globalCompositeOperation = "source-over";
          tg.clearRect(0, 0, W, H);
          tg.drawImage(sub, 0, 0);
          tg.globalCompositeOperation = "destination-in";
          tg.drawImage(mask, 0, 0);
          tg.globalCompositeOperation = "source-over";
          ctx.globalAlpha = out;
          ctx.drawImage(tmp, 0, 0);
        }
        drawShine(seg(t, 5.6, 1.6), out);
        ctx.globalAlpha = 1;
      }
      el.__logoTest = frame; // для проверки отдельных кадров

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        frame(5.4); // сразу собранный знак
        return;
      }
      // Крутим только на экране
      let raf = 0, t0 = 0, visible = false;
      const loop = (now) => {
        if (!t0) t0 = now;
        frame(((now - t0) / 1000 * LOGO30_SPEED) % LOGO30_LOOP);
        raf = visible ? requestAnimationFrame(loop) : 0;
      };
      new IntersectionObserver((entries) => {
        visible = entries[0].isIntersecting;
        if (visible && !raf) raf = requestAnimationFrame(loop);
      }).observe(el);
      frame(0);
    };
    img.src = el.dataset.dfLogo30;
  }

  /* KCHM: настольный календарь «часами» (2026-11-23, его просьба).
     По центру — его 4 мокапа (январь–апрель) в круге, сменяются по очереди; вокруг, как цифры на часах, 12 круглых
     месяцев (calround/NN.png — вырезаны из страниц календаря, прозрачный фон). Месяц мокапа подсвечен; после апреля
     подсветка быстро «прощёлкивает» май → декабрь и возвращается к январю. Всё кликается: мокапы листаются своей
     группой, месяцы — своей. Пиксели не читаем (file://) */
  function pjBuildClock(el) {
    const path = el.dataset.pjClock;
    const MONTHS = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
    const nn = (k) => String(k).padStart(2, "0");
    let html = '<div class="pj-clock__face">';
    for (let k = 1; k <= 4; k++) {
      html += `<button class="brand-shot pj-clock__mock${k === 1 ? " is-on" : ""}" type="button" data-lb-group="kchm-cal-mock" data-full="${path}/calmock/${nn(k)}.webp"><img src="${path}/calmock/${nn(k)}-thumb.webp" alt="Настольный календарь: ${MONTHS[k - 1].toLowerCase()}"></button>`;
    }
    html += "</div>";
    for (let k = 1; k <= 12; k++) {
      const a = (-90 + (k - 1) * 30) * Math.PI / 180;           // январь — сверху, дальше по часовой
      const x = 50 + 40.5 * Math.cos(a), y = 50 + 40.5 * Math.sin(a);
      html += `<button class="brand-shot pj-clock__month${k === 1 ? " is-on" : ""}" type="button" data-lb-group="kchm-cal-month" data-zoom-pc="0.7" data-full="${path}/calround/${nn(k)}.png" style="left:${x.toFixed(2)}%;top:${y.toFixed(2)}%"><img src="${path}/calround/${nn(k)}-thumb.png" alt="Календарь, ${MONTHS[k - 1].toLowerCase()}"></button>`;
    }
    el.innerHTML = html;
    const mocks = [...el.querySelectorAll(".pj-clock__mock")];
    const months = [...el.querySelectorAll(".pj-clock__month")];
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const HOLD = 2600, TICK = 110;   // сколько стоит месяц с мокапом и шаг быстрого «прощёлкивания», мс
    let m = 0, timer = 0, visible = false;
    function show(k) {
      months.forEach((b, i) => b.classList.toggle("is-on", i === k));
      if (k < 4) mocks.forEach((b, i) => b.classList.toggle("is-on", i === k));
    }
    function next() {
      m = (m + 1) % 12;
      show(m);
      timer = setTimeout(next, m < 4 ? HOLD : TICK);
    }
    new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      clearTimeout(timer);
      if (visible) timer = setTimeout(next, HOLD);
    }).observe(el);
  }

  function pjBuildDeskCal(el, group) {
    const canvas = document.createElement("canvas");
    canvas.className = "df-cal__canvas";
    el.innerHTML = "";
    el.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    const rad = Math.PI / 180;

    // Вид: поворот вокруг вертикали и наклон камеры
    const AZ = 30 * rad, EL = 30 * rad;
    const cA = Math.cos(AZ), sA = Math.sin(AZ), cE = Math.cos(EL), sE = Math.sin(EL);
    const view = (p) => {
      const x1 = p[0] * cA - p[1] * sA;
      const y1 = p[0] * sA + p[1] * cA;
      return [x1, y1 * sE - p[2] * cE, y1 * cE + p[2] * sE]; // экран x, экран y, глубина (к зрителю)
    };
    const depthOf = (v) => (v[0] * sA + v[1] * cA) * cE + v[2] * sE;
    // Свет сверху-слева-спереди
    const L = (() => { const v = [-0.5, 0.45, 0.8]; const n = Math.hypot(...v); return v.map((c) => c / n); })();
    const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
    const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
    const mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
    const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
    const norm = (a) => { const n = Math.hypot(...a) || 1; return mul(a, 1 / n); };
    const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    const lit = (n, amb = 0.62) => amb + (1 - amb) * Math.max(0, dot(n, L));
    const rgb = (c, f = 1, a = 1) => `rgba(${Math.min(255, c[0] * f) | 0},${Math.min(255, c[1] * f) | 0},${Math.min(255, c[2] * f) | 0},${a})`;

    // Календарь
    const W = 21, H = 15, A = 17 * rad, S0 = 0.55; // лист начинается чуть ниже пружины
    const LB = S0 + H + 0.35;                        // длина картона от пружины до стола
    const ZR = LB * Math.cos(A);                     // высота пружины
    const X0 = -W / 2;
    const TH_F = 17, TH_B = 343;                     // угол листа: 0 — вниз, растёт через «вперёд» и «вверх»
    const dir = (th) => [0, Math.sin(th * rad), -Math.cos(th * rad)];
    const nrm = (th) => [0, Math.cos(th * rad), Math.sin(th * rad)];
    const hinge = [0, 0, ZR];
    const onPlane = (x, s, th, off) => add(add([x, 0, ZR], mul(dir(th), s)), mul(nrm(th), off));

    // Цвета
    const C = {
      board: [44, 47, 54], boardIn: [30, 32, 37], paper: [246, 244, 239], edge: [228, 224, 214],
      gold: [201, 162, 74], goldHi: [250, 226, 160],
    };

    // Месяцы: крупные картинки, грузятся, когда сцена видна
    const pics = group.shots.map((s) => s.src + ".webp");
    const imgs = pics.map(() => null);
    const load = (k) => {
      k = (k + pics.length) % pics.length;
      if (imgs[k]) return;
      const img = new Image();
      img.decoding = "async";
      img.onload = () => draw();
      img.src = pics[k];
      imgs[k] = img;
    };
    const pic = (k) => { const img = imgs[(k + pics.length) % pics.length]; return img && img.complete && img.naturalWidth ? img : null; };


    // Проекция с масштабом
    let k = 1, ox = 0, oy = 0, dpr = 1;
    const P = (p) => { const v = view(p); return [ox + v[0] * k, oy + v[1] * k]; };
    const path = (pts) => {
      ctx.beginPath();
      pts.forEach((p, i) => { const q = P(p); if (i) ctx.lineTo(q[0], q[1]); else ctx.moveTo(q[0], q[1]); });
      ctx.closePath();
    };
    const fill = (pts, style) => { path(pts); ctx.fillStyle = style; ctx.fill(); };
    // Клетка листа, раздутая на 0,6 px по нормалям рёбер: соседние клетки перекрываются, швов не видно
    const cellPath = (pts, d = 0.6) => {
      let q = pts.map(P);
      const area = q.reduce((s, p, i) => { const n = q[(i + 1) % q.length]; return s + p[0] * n[1] - n[0] * p[1]; }, 0);
      if (area < 0) q = q.reverse();
      const m = q.length;
      const nrmE = (p, n) => { const dx = n[0] - p[0], dy = n[1] - p[1], l = Math.hypot(dx, dy) || 1; return [dy / l, -dx / l]; };
      ctx.beginPath();
      q.forEach((p, i) => {
        const n1 = nrmE(q[(i + m - 1) % m], p), n2 = nrmE(p, q[(i + 1) % m]);
        const k2 = 1 + n1[0] * n2[0] + n1[1] * n2[1];
        const f = k2 > 0.3 ? d / k2 : d;
        const x = p[0] + (n1[0] + n2[0]) * f, y = p[1] + (n1[1] + n2[1]) * f;
        if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y);
      });
      ctx.closePath();
    };
    const fillCell = (pts, style, d) => { cellPath(pts, d); ctx.fillStyle = style; ctx.fill(); };
    const faceN = (pts) => norm(cross(sub(pts[1], pts[0]), sub(pts[pts.length - 1], pts[0])));
    // Грань с плоской заливкой по свету; рисуется, только если смотрит на зрителя
    const face = (pts, col, amb) => {
      const n = faceN(pts);
      if (depthOf(n) <= 0) return;
      fillCell(pts, rgb(col, lit(n, amb)));
    };
    // Мягкая тень на столе: многоугольник в плоскости стола, размытый
    const shadow = (pts2, blur, alpha) => {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      const shift = 4000;
      ctx.shadowColor = `rgba(0, 0, 0, ${alpha})`;
      ctx.shadowBlur = blur * k * dpr;
      ctx.shadowOffsetX = shift;
      ctx.beginPath();
      pts2.forEach((p, i) => { const q = P([p[0], p[1], 0.01]); const x = q[0] * dpr - shift, y = q[1] * dpr; if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); });
      ctx.closePath();
      ctx.fillStyle = "#000";
      ctx.fill();
      ctx.restore();
    };
    // Тень от точки по направлению света на стол
    const castXY = (p) => [p[0] - (L[0] / L[2]) * p[2], p[1] - (L[1] / L[2]) * p[2]];
    const hull = (pts) => {
      const s = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
      const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
      const lo = [], up = [];
      s.forEach((p) => { while (lo.length > 1 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); });
      s.slice().reverse().forEach((p) => { while (up.length > 1 && cr(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p); });
      return lo.slice(0, -1).concat(up.slice(0, -1));
    };

    // Сетка листа: точки (u — по ширине, s — по высоте) с изгибом. th0 — угол у пружины, curl — насколько отстаёт низ листа
    const GU = 8, GS = 30;
    const sheetGrid = (th0, curl, off) => {
      const g = [];
      for (let i = 0; i <= GU; i += 1) {
        const fu = i / GU;
        const col = [];
        let p = [X0 + fu * W, 0, ZR];
        let s = 0;
        const step = (S0 + H) / GS;
        // Угол меняется вдоль листа; дальний угол (правый) отстаёт сильнее — лист изгибается по диагонали
        const ang = (fs) => Math.max(TH_F, th0 - curl * fs * fs * (0.7 + 0.6 * fu)); // ниже пачки лист не уходит
        for (let j = 0; j <= GS; j += 1) {
          s = j * step;
          if (j) {
            const th = ang((s - step / 2) / (S0 + H));
            p = add(p, mul(dir(th), step));
          }
          const th = ang(s / (S0 + H));
          col.push({ p: add(p, mul(nrm(th), off)), s });
        }
        g.push(col);
      }
      return g;
    };
    // Клетки листа: часть картинки, натянутая аффинно на параллелограмм, плюс затенение по свету
    const sheetCells = (g) => {
      const cells = [];
      for (let i = 0; i < GU; i += 1) {
        for (let j = 0; j < GS; j += 1) {
          const a = g[i][j], b = g[i + 1][j], c = g[i + 1][j + 1], d = g[i][j + 1];
          if (a.s < S0 - 1e-6 && d.s <= S0 + 1e-6) continue; // полоска над листом (у пружины) — пустая
          const n = norm(cross(sub(b.p, a.p), sub(d.p, a.p)));
          const mid = mul(add(add(a.p, b.p), add(c.p, d.p)), 0.25);
          cells.push({ i, j, a, b, c, d, n, mid, depth: depthOf(mid) });
        }
      }
      return cells;
    };
    // pass 0 — картинка или бумага, pass 1 — свет и тень поверх. Отдельным проходом: иначе соседняя клетка
    // перекрывает тень светлой полоской
    const drawCell = (cell, img, pass) => {
      const { i, a, b, d, n } = cell;
      const front = depthOf(n) > 0;
      const quad = [a.p, b.p, cell.c.p, d.p];
      const f = lit(front ? n : mul(n, -1), 0.7);
      if (pass === 1) {
        if (!front || !img) return;
        const dark = Math.max(0, 0.92 - f) * 0.9;
        if (dark > 0.01) fillCell(quad, `rgba(20, 16, 10, ${Math.min(0.6, dark)})`, 0);
        const glare = Math.max(0, f - 0.97) * 4;
        if (glare > 0.01) fillCell(quad, `rgba(255, 255, 255, ${glare})`, 0);
        return;
      }
      if (front && img) {
        const iw = img.naturalWidth, ih = img.naturalHeight;
        const u0 = (i / GU) * iw, u1 = ((i + 1) / GU) * iw;
        const v0 = ((a.s - S0) / H) * ih, v1 = ((d.s - S0) / H) * ih;
        const pa = P(a.p), pb = P(b.p), pc = P(cell.c.p), pd = P(d.p);
        const sw = u1 - u0, sh = v1 - v0;
        // Клетка — два треугольника, у каждого своё точное наложение картинки. Контур чуть раздут,
        // картинка берётся с запасом — щелей и ступенек нет
        const mx = sw * 0.15, my = sh * 0.15;
        const x0 = Math.max(0, u0 - mx), y0 = Math.max(0, v0 - my);
        const x1 = Math.min(iw, u1 + mx), y1 = Math.min(ih, v1 + my);
        const tri = (pts, o, ex, ey, ou, ov) => {
          ctx.save();
          cellPath(pts);
          ctx.clip();
          ctx.transform((ex[0] - o[0]) / sw, (ex[1] - o[1]) / sw, (ey[0] - o[0]) / sh, (ey[1] - o[1]) / sh, o[0], o[1]);
          ctx.drawImage(img, x0, y0, x1 - x0, y1 - y0, x0 - ou, y0 - ov, x1 - x0, y1 - y0);
          ctx.restore();
        };
        tri([a.p, b.p, d.p], pa, pb, pd, u0, v0);
        // Второй треугольник: начало в правом нижнем углу, оси смотрят назад
        tri([b.p, cell.c.p, d.p], pc, [2 * pc[0] - pd[0], 2 * pc[1] - pd[1]], [2 * pc[0] - pb[0], 2 * pc[1] - pb[1]], u1, v1);
      } else {
        fillCell(quad, rgb(C.paper, front ? f : 0.25 + f * 0.72));
      }
    };
    // Плоский лист на месте (без изгиба) — тоже клетками, но одной картинкой
    const flatSheet = (th, off, img, shade = 0) => {
      const p0 = onPlane(X0, S0, th, off), p1 = onPlane(X0 + W, S0, th, off), p3 = onPlane(X0, S0 + H, th, off);
      const n = nrm(th);
      if (depthOf(n) <= 0 || !img) { fill([p0, p1, onPlane(X0 + W, S0 + H, th, off), p3], rgb(C.paper, lit(n, 0.7))); return; }
      const pa = P(p0), pb = P(p1), pd = P(p3);
      ctx.save();
      ctx.transform((pb[0] - pa[0]) / img.naturalWidth, (pb[1] - pa[1]) / img.naturalWidth, (pd[0] - pa[0]) / img.naturalHeight, (pd[1] - pa[1]) / img.naturalHeight, pa[0], pa[1]);
      ctx.drawImage(img, 0, 0);
      ctx.restore();
      const dark = Math.max(0, 0.92 - lit(n, 0.7)) * 0.9 + shade;
      if (dark > 0.01) fill([p0, p1, onPlane(X0 + W, S0 + H, th, off), p3], `rgba(20, 16, 10, ${Math.min(0.6, dark)})`);
    };

    // Картон домика: панель с толщиной
    const panel = (th, inner) => {
      const T = 0.22;
      const a = onPlane(X0 - 0.4, 0.15, th, 0), b = onPlane(-X0 + 0.4, 0.15, th, 0);
      const c = onPlane(-X0 + 0.4, LB, th, 0), d = onPlane(X0 - 0.4, LB, th, 0);
      const back = (p) => add(p, mul(nrm(th), th > 180 ? T : -T));
      const n = nrm(th);
      const outer = th > 180 ? mul(n, -1) : n;
      // Торцы толщины: правый и нижний
      face([b, back(b), back(c), c], C.board, 0.45);
      face([c, back(c), back(d), d], C.board, 0.45);
      face([a, d, back(d), back(a)], C.board, 0.45);
      if (depthOf(outer) > 0) fill([a, b, c, d], rgb(C.board, lit(outer, 0.55)));
      else fill([back(a), back(b), back(c), back(d)].reverse(), rgb(C.boardIn, lit(mul(outer, -1), 0.6)));
      if (inner) return;
    };
    // Пачка листов: видимые торцы снизу и справа
    const stack = (th, o0, o1) => {
      const bl = (x, off) => onPlane(x, S0 + H, th, off);
      fill([bl(X0, o0), bl(X0 + W, o0), bl(X0 + W, o1), bl(X0, o1)], rgb(C.edge, 0.97));
      const rt = (s, off) => onPlane(X0 + W, s, th, off);
      face([rt(S0, o0), rt(S0 + H, o0), rt(S0 + H, o1), rt(S0, o1)].reverse(), C.edge, 0.8);
      // Линии листов на торце
      ctx.strokeStyle = "rgba(150, 140, 120, 0.35)";
      ctx.lineWidth = Math.max(0.5, k * 0.02);
      for (let q = 1; q < 4; q += 1) {
        const o = o0 + ((o1 - o0) * q) / 4;
        ctx.beginPath();
        const s = P(bl(X0, o)), e = P(bl(X0 + W, o));
        ctx.moveTo(s[0], s[1]); ctx.lineTo(e[0], e[1]); ctx.stroke();
      }
    };
    // Пружина Wire-O: двойные петли вокруг оси. half: -1 задние половинки, 1 передние
    const rings = (half) => {
      const R = 0.5;
      ctx.lineCap = "round";
      for (let x = X0 + 0.55; x <= -X0 - 0.4; x += 0.84) {
        for (const dx of [0, 0.22]) {
          const pts = [];
          for (let q = 0; q <= 28; q += 1) {
            const a = (q / 28) * Math.PI * 2;
            const p = [x + dx, R * Math.cos(a), ZR + R * Math.sin(a)];
            pts.push({ p, f: depthOf(p) - depthOf([x + dx, 0, ZR]) });
          }
          const draw = (style, wpx) => {
            ctx.strokeStyle = style;
            ctx.lineWidth = wpx;
            ctx.beginPath();
            let on = false;
            pts.forEach(({ p, f }) => {
              const q = P(p);
              if (f * half >= 0) { if (on) ctx.lineTo(q[0], q[1]); else ctx.moveTo(q[0], q[1]); on = true; } else on = false;
            });
            ctx.stroke();
          };
          if (half < 0) draw(rgb(C.gold, 0.6), k * 0.13);
          else { draw(rgb(C.gold, 0.9), k * 0.15); draw(rgb(C.goldHi), k * 0.05); }
        }
      }
    };

    const drawCells = (list) => [0, 1].forEach((pass) => list.forEach((c) => drawCell(c, pic(cur), pass)));

    // Ход перелистывания
    let cur = 0, flipT = -1; // flipT в [0..1] — идёт перелистывание
    // Изгиб листа: сильнее всего на подъёме, к концу лист выпрямляется и ложится ровно
    const curlAt = (t) => 88 * Math.pow(Math.sin(Math.PI * Math.min(1, t * 1.1)), 1.4) * (1 - 0.45 * t);
    const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    const draw = () => {
      const w = canvas.clientWidth;
      if (!w) return;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingQuality = "high";

      // Мягкая тень под календарём (стола нет — календарь стоит прямо на странице)
      const yb = LB * Math.sin(A) + 0.1;
      shadow(hull([[X0 - 0.4, yb], [-X0 + 0.4, yb], [-X0 + 0.4, -yb], [X0 - 0.4, -yb],
        castXY([X0 - 0.4, 0, ZR + 0.6]), castXY([-X0 + 0.4, 0, ZR + 0.6])]), 1.8, 0.55);
      shadow([[X0 - 0.4, yb], [-X0 + 0.4, yb], [-X0 + 0.4, -yb], [X0 - 0.4, -yb]], 0.4, 0.6);

      // Календарь: задняя панель, основание, задние половинки пружины
      panel(TH_B);
      fill([[X0 - 0.4, -yb, 0.02], [-X0 + 0.4, -yb, 0.02], [-X0 + 0.4, yb, 0.02], [X0 - 0.4, yb, 0.02]], rgb(C.boardIn));
      rings(-1);

      // Перелистываемый лист
      let cells = null, behind = [], ahead = [];
      const flipping = flipT >= 0;
      if (flipping) {
        const e = ease(flipT);
        const th0 = TH_F + (TH_B - TH_F) * e;
        const curl = curlAt(flipT);
        const off = 0.24 * (1 - 2 * e);
        cells = sheetCells(sheetGrid(th0, curl, off));
        const nf = nrm(TH_F);
        cells.forEach((c) => (dot(sub(c.mid, hinge), nf) < -0.05 ? behind : ahead).push(c));
        behind.sort((a, b) => a.depth - b.depth);
        ahead.sort((a, b) => a.depth - b.depth);
        drawCells(behind);
      }

      // Передняя панель и пачка
      panel(TH_F);
      stack(TH_F, 0.02, 0.22);
      // Следующий месяц под верхним листом; пока лист рядом, на нём тень
      const lift = flipping ? Math.max(0, 1 - Math.abs(flipT - 0.18) / 0.3) : 1;
      flatSheet(TH_F, 0.22, pic(cur + 1), flipping ? 0.22 * lift : 0);
      if (!flipping) flatSheet(TH_F, 0.24, pic(cur));
      else drawCells(ahead);
      rings(1);

    };

    // Рамка. Блок на странице — по размеру стоящего календаря; холст выше блока и уходит вверх,
    // поэтому лист в верхней точке перелистывания проходит поверх того, что стоит над календарём
    const box = (withFlip) => {
      const pts = [];
      const yb = LB * Math.sin(A) + 0.6;
      [[X0 - 0.6, yb, 0], [-X0 + 0.6, yb, 0], [-X0 + 0.6, -yb, 0], [X0 - 0.6, -yb, 0], [X0 - 0.6, 0, ZR + 0.7], [-X0 + 0.6, 0, ZR + 0.7]].forEach((p) => pts.push(p));
      if (withFlip) for (let t = 0; t <= 1; t += 0.05) {
        sheetGrid(TH_F + (TH_B - TH_F) * ease(t), curlAt(t), 0).forEach((col) => col.forEach((q) => pts.push(q.p)));
      }
      let l = 1e9, t = 1e9, r = -1e9, b = -1e9;
      pts.forEach((p) => { const v = view(p); l = Math.min(l, v[0]); r = Math.max(r, v[0]); t = Math.min(t, v[1]); b = Math.max(b, v[1]); });
      return { l, t, r, b };
    };
    const B = box(false), F = box(true);
    const SIZE = 0.56;                 // календарь занимает 56% ширины колонки (на телефоне 92%)
    const PADB = 0.06;                 // запас снизу под тень (в долях ширины календаря)
    const resize = () => {
      const w = el.clientWidth;
      if (!w) return;
      const cw = w * (window.innerWidth <= 640 ? 0.92 : SIZE);
      k = cw / (B.r - B.l);
      const pad = (B.r - B.l) * PADB * k;
      const boxH = (B.b - B.t) * k + pad;
      const extra = (B.t - Math.min(F.t, B.t)) * k;     // насколько лист поднимается над стоящим календарём
      el.style.height = Math.round(boxH) + "px";
      canvas.style.height = Math.round(boxH + extra) + "px";
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round((boxH + extra) * dpr);
      ox = w / 2 - ((B.l + B.r) / 2) * k;
      oy = extra - B.t * k;
      draw();
    };
    new ResizeObserver(resize).observe(el);

    // Перелистывание: 1,6 с движения, затем пауза
    const FLIP = 1600, PAUSE = 2600;
    let running = false, raf = 0, timer = 0, t0 = 0;
    const frame = (now) => {
      if (!running) return;
      flipT = Math.min(1, (now - t0) / FLIP);
      if (flipT >= 1) {
        flipT = -1;
        cur = (cur + 1) % pics.length;
        load(cur + 1); load(cur + 2);
        draw();
        timer = setTimeout(start, PAUSE);
        return;
      }
      draw();
      raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (!running) return;
      if (!pic(cur + 1)) { load(cur + 1); timer = setTimeout(start, 300); return; } // ждём следующий месяц
      t0 = performance.now();
      raf = requestAnimationFrame(frame);
    };
    load(0); load(1);
    el.__calTest = (k2, t) => { cur = k2; flipT = t; draw(); }; // для проверки кадров
    const zoom = () => (window.innerWidth > 960 ? 0.5 : 1); // на ПК просмотр вдвое меньше, как у сетки месяцев
    el.addEventListener("click", () => openLightbox(group.shots.map((s) => ({ full: s.src + ".webp", title: s.alt, free: true, max: 2, px: 0, zoom: zoom() })), cur));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) { running = true; load(2); timer = setTimeout(start, 1000); }
      if (!entry.isIntersecting && running) {
        running = false;
        clearTimeout(timer);
        cancelAnimationFrame(raf);
        if (flipT >= 0) { flipT = -1; draw(); }
      }
    }, { threshold: 0.3 }).observe(el);
  }

  /* ---------- Книжка, которая листается сама (KCHM, книжка для партнёров из Китая, 2026-11-22) ----------
     По образцу календаря-домика DAFNA: canvas, своя проекция, лист с изгибом, свет и тени, без CSS-3D.
     Книжка лежит на столе, камера смотрит спереди сверху. Сантиметры: x вправо, y к зрителю, z вверх, корешок — x = 0.
     Цикл: закрытая книжка (обложка) → обложка открывается влево, книжка съезжает в центр разворота →
     листы переворачиваются по одному → на последней странице книжка закрывается → снова открывается.
     Листы: 0 — обложка (снаружи первая картинка, изнутри бумага), лист f — страницы 2f−1 (справа) и 2f (на обороте).
     Клик — страница крупно в обычном просмотре сайта, листается по кругу */
  function pjBuildBook(el, group) {
    const canvas = document.createElement("canvas");
    canvas.className = "pj-book__canvas";
    el.innerHTML = "";
    el.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    const shade = document.createElement("canvas");     // слой света и тени листа (см. drawSheet)
    const sctx = shade.getContext("2d");
    const rad = Math.PI / 180;

    // Камера: спереди, наклон 62° (страницы читаются, а поднятый лист видно объёмным)
    const EL = 62 * rad, cE = Math.cos(EL), sE = Math.sin(EL);
    const view = (p) => [p[0], p[1] * sE - p[2] * cE];
    const depthOf = (v) => v[1] * cE + v[2] * sE;
    const L = (() => { const v = [-0.5, 0.45, 0.8]; const n = Math.hypot(...v); return v.map((c) => c / n); })();
    const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
    const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
    const mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
    const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
    const norm = (a) => { const n = Math.hypot(...a) || 1; return mul(a, 1 / n); };
    const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    const lit = (n, amb = 0.7) => amb + (1 - amb) * Math.max(0, dot(n, L));
    const rgb = (c, f = 1, a = 1) => `rgba(${Math.min(255, c[0] * f) | 0},${Math.min(255, c[1] * f) | 0},${Math.min(255, c[2] * f) | 0},${a})`;
    const C = { paper: [247, 246, 242], edge: [226, 223, 214], cover: [28, 28, 30] };

    // Страницы
    const pics = group.shots.map((s) => s.src + ".webp");
    const imgs = pics.map(() => null);
    const load = (i) => {
      if (i < 0 || i >= pics.length || imgs[i]) return;
      const img = new Image();
      img.decoding = "async";
      img.onload = () => draw();
      img.src = pics[i];
      imgs[i] = img;
    };
    const pic = (i) => { const img = i == null ? null : imgs[i]; return img && img.complete && img.naturalWidth ? img : null; };

    // Размеры: высота страницы 21 см, ширина — по пропорции картинок
    const H = 21, W = (H * 892) / 1260, Y0 = -H / 2;
    const SHEETS = Math.ceil((pics.length - 1) / 2) + 1;   // обложка + бумажные листы (13 страниц → 7)
    const COV = 0.1, SH = 0.06;                              // толщина обложки и листа
    const th = (f) => (f === 0 ? COV : SH);
    const frontImg = (f) => (f === 0 ? 0 : 2 * f - 1 < pics.length ? 2 * f - 1 : null);
    const backImg = (f) => (f === 0 ? null : 2 * f < pics.length ? 2 * f : null);

    // Проекция с масштабом
    let k = 1, ox = 0, oy = 0, dpr = 1;
    const P = (p) => { const v = view(p); return [ox + v[0] * k, oy + v[1] * k]; };
    const poly = (pts) => {
      ctx.beginPath();
      pts.forEach((p, i) => { const q = P(p); if (i) ctx.lineTo(q[0], q[1]); else ctx.moveTo(q[0], q[1]); });
      ctx.closePath();
    };
    const fill = (pts, style) => { poly(pts); ctx.fillStyle = style; ctx.fill(); };
    // Многоугольник на экране, раздутый на d px по нормалям рёбер: соседние клетки перекрываются, швов нет
    const inflatedPath = (q, d = 0.6, c = ctx, begin = true) => {
      const area = q.reduce((s, p, i) => { const n = q[(i + 1) % q.length]; return s + p[0] * n[1] - n[0] * p[1]; }, 0);
      if (area < 0) q = q.slice().reverse();
      const m = q.length;
      const nrmE = (p, n) => { const dx = n[0] - p[0], dy = n[1] - p[1], l = Math.hypot(dx, dy) || 1; return [dy / l, -dx / l]; };
      if (begin) c.beginPath();
      q.forEach((p, i) => {
        const n1 = nrmE(q[(i + m - 1) % m], p), n2 = nrmE(p, q[(i + 1) % m]);
        const k2 = 1 + n1[0] * n2[0] + n1[1] * n2[1];
        const f = k2 > 0.3 ? d / k2 : d;
        const x = p[0] + (n1[0] + n2[0]) * f, y = p[1] + (n1[1] + n2[1]) * f;
        if (i) c.lineTo(x, y); else c.moveTo(x, y);
      });
      c.closePath();
    };
    // Треугольник картинки: точки t (в пикселях картинки) ложатся в точки p (на экране)
    // clip — свой контур (у лежащей страницы — вся полоска-параллелограмм, тогда внутри полоски стыка нет)
    const texTri = (img, p, t, clip = p) => {
      const du1 = t[1][0] - t[0][0], dv1 = t[1][1] - t[0][1], du2 = t[2][0] - t[0][0], dv2 = t[2][1] - t[0][1];
      const det = du1 * dv2 - du2 * dv1;
      if (!det) return;
      const dx1 = p[1][0] - p[0][0], dy1 = p[1][1] - p[0][1], dx2 = p[2][0] - p[0][0], dy2 = p[2][1] - p[0][1];
      const a = (dx1 * dv2 - dx2 * dv1) / det, b = (dy1 * dv2 - dy2 * dv1) / det;
      const c = (dx2 * du1 - dx1 * du2) / det, d = (dy2 * du1 - dy1 * du2) / det;
      const e = p[0][0] - a * t[0][0] - c * t[0][1], f = p[0][1] - b * t[0][0] - d * t[0][1];
      const xs = t.map((q) => q[0]), ys = t.map((q) => q[1]);
      const mx = (Math.max(...xs) - Math.min(...xs)) * 0.2 + 2, my = (Math.max(...ys) - Math.min(...ys)) * 0.2 + 2;
      const x0 = Math.max(0, Math.min(...xs) - mx), y0 = Math.max(0, Math.min(...ys) - my);
      const x1 = Math.min(img.naturalWidth, Math.max(...xs) + mx), y1 = Math.min(img.naturalHeight, Math.max(...ys) + my);
      ctx.save();
      inflatedPath(clip);
      ctx.clip();
      ctx.transform(a, b, c, d, e, f);
      ctx.drawImage(img, x0, y0, x1 - x0, y1 - y0, x0, y0, x1 - x0, y1 - y0);
      ctx.restore();
    };
    // Мягкая тень на столе (размытый многоугольник)
    const shadow = (pts2, blur, alpha) => {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      const shift = 4000;
      ctx.shadowColor = `rgba(0, 0, 0, ${alpha})`;
      ctx.shadowBlur = blur * k * dpr;
      ctx.shadowOffsetX = shift;
      ctx.beginPath();
      pts2.forEach((p, i) => { const q = P([p[0], p[1], 0]); const x = q[0] * dpr - shift, y = q[1] * dpr; if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); });
      ctx.closePath();
      ctx.fillStyle = "#000";
      ctx.fill();
      ctx.restore();
    };

    // 2026-11-23 (его замечание: на стыке ступенька, лист у корешка не загнут). Теперь как у настоящей брошюры:
    // обе раскрытые страницы у корешка выгибаются дугой и уходят вниз в одну точку переплёта ZS, поэтому
    // левая и правая страницы сходятся без ступеньки. Переворачиваемый лист выходит из этого же желоба:
    // у корешка он прижат к дуге своей стопки и плавно отрывается от неё.
    // Профиль страницы задан углом наклона вдоль листа (от корешка к краю), лист строится шагами по этому углу —
    // поэтому лежащая страница и перевёрнутый лист совпадают точно, без скачка в начале и в конце.
    const ZS = COV;                    // высота переплёта: туда сходятся страницы обеих стопок
    const GD = 1.6, GB = 2.6;          // длина спуска в желоб и где выше всего выгиб страницы (см)
    const BULGE = 0.55;                // насколько страница у корешка выгнута вверх (см), у раскрытой книжки
    // Угол страницы (в градусах) на расстоянии s от корешка: стопка высотой zt, переплёт на высоте zsp, выгиб a
    const restAng = (s, zt, zsp, a) => {
      const u = Math.min(1, s / GD);
      const dz = (zt - zsp) * 2 * (1 - u) / GD + a * Math.exp(1 - s / GB) * (1 - s / GB) / GB;
      return Math.atan(dz) / rad;
    };
    // Сетка листа шагами по углу: g[j][i], j — по высоте страницы, i — от корешка к краю.
    // side 1 — вправо от корешка (угол как есть), −1 — влево (угол 180 − a)
    const GU = 28;
    const grid = (xs, zh, gv, angle) => {
      const g = [];
      const ds = W / GU;
      for (let j = 0; j <= gv; j += 1) {
        const fv = j / gv;
        const y = Y0 + fv * H;
        const col = [];
        let p = [xs, y, zh];
        for (let i = 0; i <= GU; i += 1) {
          if (i) { const a = angle((i - 0.5) * ds, fv) * rad; p = add(p, [Math.cos(a) * ds, 0, Math.sin(a) * ds]); }
          col.push(p);
        }
        g.push(col);
      }
      return g;
    };
    // Контур поверхности листа (для теней поверх): верхний край от корешка, нижний обратно; upto — до какой клетки
    const outline = (g, upto = GU) => g[0].slice(0, upto + 1).concat(g[g.length - 1].slice(0, upto + 1).reverse());
    const drawSheet = (g, fi, bi) => {
      const gv = g.length - 1;
      const cells = [];
      for (let j = 0; j < gv; j += 1) {
        for (let i = 0; i < GU; i += 1) {
          const a = g[j][i], b = g[j][i + 1], c = g[j + 1][i + 1], d = g[j + 1][i];
          const n = norm(cross(sub(b, a), sub(d, a)));
          const mid = mul(add(add(a, b), add(c, d)), 0.25);
          cells.push({ i, j, a, b, c, d, n, depth: depthOf(mid) });
        }
      }
      cells.sort((p, q) => p.depth - q.depth);
      // подложка — бумага под всем листом: на стыках клеток не просвечивает то, что под ним
      if (gv === 1) fill(outline(g), rgb(C.paper));
      const fImg = fi == null ? null : pic(fi), bImg = bi == null ? null : pic(bi);
      cells.forEach((cell) => {
        const { i, j, a, b, c, d, n } = cell;
        const front = depthOf(n) > 0;
        const img = front ? fImg : bImg;
        const f = lit(front ? n : mul(n, -1));
        const q = [P(a), P(b), P(c), P(d)];
        cell.q = q;
        cell.dark = Math.min(0.6, Math.max(0, 0.94 - f) * 0.95);
        if (!img) { inflatedPath(q); ctx.fillStyle = rgb(C.paper, front ? 1 : 0.97); ctx.fill(); return; }
        const iw = img.naturalWidth, ih = img.naturalHeight;
        const v0 = (j / gv) * ih, v1 = ((j + 1) / gv) * ih;
        // лицевая сторона: от корешка вправо; оборот зеркальный — корешок у правого края картинки
        const u0 = front ? (i / GU) * iw : (1 - i / GU) * iw;
        const u1 = front ? ((i + 1) / GU) * iw : (1 - (i + 1) / GU) * iw;
        if (gv === 1) { texTri(img, [q[0], q[1], q[3]], [[u0, v0], [u1, v0], [u0, v1]], q); return; }
        texTri(img, [q[0], q[1], q[3]], [[u0, v0], [u1, v0], [u0, v1]]);
        texTri(img, [q[1], q[2], q[3]], [[u1, v0], [u1, v1], [u0, v1]]);
      });
      // Свет и тень листа — одним слоем: клетки рисуются непрозрачным серым на белом (ближние поверх дальних),
      // затем слой умножается на лист. Полупрозрачные клетки по отдельности давали тонкие полоски на стыках
      if (!cells.some((c) => c.dark > 0.005)) return;
      if (shade.width !== canvas.width || shade.height !== canvas.height) { shade.width = canvas.width; shade.height = canvas.height; }
      sctx.setTransform(1, 0, 0, 1, 0, 0);
      sctx.fillStyle = "#fff";
      sctx.fillRect(0, 0, shade.width, shade.height);
      sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cells.forEach((c) => { const v = Math.round(255 * (1 - c.dark)); inflatedPath(c.q, 0.6, sctx); sctx.fillStyle = `rgb(${v}, ${v - 2}, ${v - 5})`; sctx.fill(); });
      ctx.save();
      ctx.beginPath();
      cells.forEach((c) => inflatedPath(c.q, 0.3, ctx, false));
      ctx.clip();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalCompositeOperation = "multiply";
      ctx.drawImage(shade, 0, 0);
      ctx.restore();
    };
    // Стопка: передний торец под изогнутой верхней страницей (тёмная обложка снизу) и сама страница
    const slab = (g, zt, side, img, coverTop) => {
      if (zt <= 0) return;
      const top = g[g.length - 1];                       // ближний край страницы (y = −Y0)
      const xs = top[0][0], xe = top[GU][0];
      fill(top.concat([[xe, -Y0, 0], [xs, -Y0, 0]]), rgb(C.edge, 0.93));
      fill([[xs, -Y0, 0], [xe, -Y0, 0], [xe, -Y0, COV], [xs, -Y0, COV]], rgb(C.cover));
      if (coverTop) fill([[xs, -Y0, zt - COV], [xe, -Y0, zt - COV], [xe, -Y0, zt], [xs, -Y0, zt]], rgb(C.cover));
      // линии листов на торце повторяют изгиб страницы
      ctx.strokeStyle = "rgba(140, 132, 115, 0.35)";
      ctx.lineWidth = Math.max(0.5, k * 0.012);
      for (let q = COV + SH; q < zt - SH * 0.5; q += SH) {
        const f = (q - COV) / Math.max(0.001, zt - COV);
        ctx.beginPath();
        top.forEach((p, i) => { const z = COV + (p[2] - COV) * f; const s = P([p[0], -Y0, z]); if (i) ctx.lineTo(s[0], s[1]); else ctx.moveTo(s[0], s[1]); });
        ctx.stroke();
      }
      if (side > 0) drawSheet(g, img, null); else drawSheet(g, null, img);
    };
    // Тень у корешка на раскрытых страницах (полоса 2,2 см вдоль желоба)
    const spineShade = (g, a) => {
      const upto = Math.round((2.2 / W) * GU);
      const g0 = P(g[0][0]), g1 = P(g[0][upto]);
      const gr = ctx.createLinearGradient(g0[0], 0, g1[0], 0);
      gr.addColorStop(0, `rgba(30, 24, 12, ${a})`);
      gr.addColorStop(0.35, `rgba(30, 24, 12, ${a * 0.35})`);
      gr.addColorStop(1, "rgba(30, 24, 12, 0)");
      fill(outline(g, upto), gr);
    };
    const pageShade = (g, a) => { if (a > 0.005) fill(outline(g), `rgba(20, 16, 10, ${a})`); };

    // Состояние: left — сколько листов слева; mode: "page" (лист left переворачивается), "close"; t — ход 0..1 (−1 — стоит)
    let left = 0, mode = "page", flipT = -1;
    const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const curlAt = (t) => 70 * Math.pow(Math.sin(Math.PI * Math.min(1, t * 1.08)), 1.3) * (1 - 0.4 * t);
    const sumTh = (a, b) => { let s = 0; for (let f = a; f < b; f += 1) s += th(f); return s; };
    const BLOCK = sumTh(0, SHEETS);
    const clampA = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

    const draw = () => {
      const w = canvas.clientWidth;
      if (!w) return;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingQuality = "high";

      const flipping = flipT >= 0;
      const closing = flipping && mode === "close";
      const e = flipping ? ease(flipT) : 0;
      // Угол переворачиваемого листа и сдвиг книжки: закрытая лежит по центру, раскрытая — корешком по центру
      let phi = 0;
      if (flipping) phi = closing ? 180 * (1 - e) : 180 * e;
      const coverMove = flipping && (closing || left === 0);
      const opened = coverMove ? phi / 180 : left > 0 ? 1 : 0;
      const xs = (-W / 2) * (1 - opened);
      const bul = BULGE * opened;
      const spineZ = (zt) => zt - (zt - ZS) * opened;     // закрытая книжка ровная, раскрытая уходит в желоб

      // Высота стопок без переворачиваемого листа (при закрытии весь левый блок переворачивается целиком)
      const zl = closing ? 0 : sumTh(0, left);
      const zr = COV + (closing ? 0 : flipping ? sumTh(left + 1, SHEETS) : sumTh(left, SHEETS));

      // Тень под книжкой
      const xl0 = zl > 0 ? xs - W : xs;
      shadow([[xl0 - 0.2, Y0 - 0.1], [xs + W + 0.2, Y0 - 0.1], [xs + W + 0.3, -Y0 + 0.5], [xl0 - 0.3, -Y0 + 0.5]], 1.6, 0.5);
      shadow([[xl0, Y0], [xs + W, Y0], [xs + W, -Y0 + 0.1], [xl0, -Y0 + 0.1]], 0.35, 0.45);

      // Правая стопка: сверху следующая страница (или изнанка задней обложки)
      const fR = flipping && !closing ? left + 1 : left;
      const rightImg = closing || fR >= SHEETS ? null : frontImg(fR);
      const closedNow = !flipping && left === 0;
      const gR = grid(xs, spineZ(zr), 1, (s) => restAng(s, zr, spineZ(zr), bul));
      slab(gR, zr, 1, rightImg, closedNow);
      // Левая стопка: оборот последнего перевёрнутого листа
      let gL = null;
      if (zl > 0) {
        gL = grid(xs, spineZ(zl), 1, (s) => 180 - restAng(s, zl, spineZ(zl), bul));
        slab(gL, zl, -1, backImg(left - 1), false);
      }
      // Тень у корешка и тень от поднятого листа
      if (opened > 0.02) {
        spineShade(gR, 0.22 * opened);
        if (gL) spineShade(gL, 0.28);
      }
      if (flipping) {
        if (!closing) {
          pageShade(gR, 0.2 * Math.max(0, 1 - Math.abs(phi - 30) / 70));
          if (gL) pageShade(gL, 0.2 * Math.max(0, 1 - Math.abs(phi - 150) / 70));
        }
        // Переворачиваемый лист: лежал на своей стопке (её профиль с этим листом), ляжет на другую.
        // У корешка он зажат между дугами обеих стопок — поэтому у переплёта всегда загнут, а не ломается
        const zRi = closing ? COV + BLOCK : COV + sumTh(left, SHEETS);
        const zLi = closing ? BLOCK : sumTh(0, left + 1);
        const zh = spineZ(closing ? zRi : zRi);
        const curl = (closing ? -0.35 : left === 0 ? 0.4 : 1) * curlAt(flipT);
        const fi = closing ? 0 : frontImg(left);
        const bi = closing ? pics.length - 1 : backImg(left);
        const g = grid(xs, zh, 6, (s, fv) => {
          const free = phi - curl * Math.pow(s / W, 2) * (0.75 + 0.5 * fv);
          return clampA(free, restAng(s, zRi, zh, bul), 180 - restAng(s, zLi, zh, bul));
        });
        drawSheet(g, fi, bi);
      }
    };

    // Рамка. Блок на странице — по размеру лежащей раскрытой книжки; холст выше блока и уходит вверх,
    // поэтому поднятый лист пролетает поверх заголовка и картинок над книжкой (его просьба 2026-11-23)
    const bounds = (pts) => {
      let l = 1e9, t = 1e9, r = -1e9, b = -1e9;
      pts.forEach((p) => { const v = view(p); l = Math.min(l, v[0]); r = Math.max(r, v[0]); t = Math.min(t, v[1]); b = Math.max(b, v[1]); });
      return { l, t, r, b };
    };
    const flat = [[-W - 0.4, Y0, 0], [W + 0.4, Y0, 0], [W + 0.4, -Y0 + 0.8, 0], [-W - 0.4, -Y0 + 0.8, 0], [0, Y0, BLOCK + BULGE + 0.4]];
    const B = bounds(flat), F = bounds(flat.concat([[0, Y0, W + 0.8], [0, -Y0, W + 0.8]]));
    const SIZE = 0.89;                 // раскрытая книжка — 89% ширины колонки (2026-11-23: +20%), на телефоне почти вся ширина
    const resize = () => {
      const w = el.clientWidth;
      if (!w) return;
      k = (w * (window.innerWidth <= 640 ? 0.98 : SIZE)) / (B.r - B.l);
      const h = (B.b - B.t) * k;
      const extra = (B.t - F.t) * k;     // насколько лист поднимается над лежащей книжкой
      el.style.height = Math.round(h) + "px";
      canvas.style.height = Math.round(h + extra) + "px";
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round((h + extra) * dpr);
      ox = w / 2 - ((B.l + B.r) / 2) * k;
      oy = extra - B.t * k;
      draw();
    };
    new ResizeObserver(resize).observe(el);

    // Ход: лист 1,3 с и пауза на развороте; закрытая книжка стоит чуть дольше
    const FLIP = 1300, CLOSE = 1500, PAUSE = 1700, PAUSE_CLOSED = 1600;
    let running = false, raf = 0, timer = 0, t0 = 0, dur = FLIP;
    const frame = (now) => {
      if (!running) return;
      flipT = Math.min(1, (now - t0) / dur);
      if (flipT >= 1) {
        flipT = -1;
        if (mode === "close") { left = 0; mode = "page"; } else left += 1;
        draw();
        timer = setTimeout(start, left === 0 ? PAUSE_CLOSED : PAUSE);
        return;
      }
      draw();
      raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (!running) return;
      mode = left >= SHEETS ? "close" : "page";
      dur = mode === "close" ? CLOSE : FLIP;
      t0 = performance.now();
      raf = requestAnimationFrame(frame);
    };
    pics.forEach((_, i) => { if (i < 3) load(i); });
    el.__bookTest = (l, m, t) => { left = l; mode = m; flipT = t; draw(); }; // для проверки кадров
    // Какая страница сейчас перед глазами: правая на развороте, в конце — последняя
    const current = () => (left === 0 ? 0 : left >= SHEETS ? pics.length - 1 : frontImg(left) ?? pics.length - 1);
    el.addEventListener("click", () => openLightbox(group.shots.map((s) => ({ full: s.src + ".webp", title: s.alt, free: true, max: 2, px: 0 })), current()));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { pics.forEach((_, i) => load(i)); return; }
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) { running = true; pics.forEach((_, i) => load(i)); timer = setTimeout(start, 900); }
      if (!entry.isIntersecting && running) {
        running = false;
        clearTimeout(timer);
        cancelAnimationFrame(raf);
        if (flipT >= 0) { flipT = -1; if (mode === "close") { left = 0; mode = "page"; } draw(); }
      }
    }, { threshold: 0.3 }).observe(el);
  }

  // Остановка в изометрии.
  // Сцены на панелях сменяет CSS (hm-stop-in)
  function pjBuildStop(el) {
    const { parts, face, box } = pjIsoKit();
    const led = (kind, x, y, z, w, h, name) => {
      const slides = [1, 2, 3, 4, 5].map((n) => `<img src="images/projects/home-market/stop/${name}-${n}.webp" alt="" style="--n:${n - 1}">`);
      face(kind, x, y, z, w, h, `hm-stop__slides hm-stop__${name}`, slides.join(""));
    };

    // Дорога, бордюр, тротуар, газон
    box(0, 6.3, -0.6, 13, 2.7, 0.6, "is-road");
    box(0, 0, -0.6, 13, 6, 0.78, "is-walk");
    box(0, 6, -0.6, 13, 0.3, 0.84, "is-curb");
    box(0, 0, 0.18, 13, 0.7, 0.06, "is-grass");
    box(0.5, 0.1, 0.24, 0.9, 0.5, 0.5, "is-bush");
    box(10.6, 0.1, 0.24, 1.6, 0.5, 0.5, "is-bush");
    face("top", 0, 6.45, 0.01, 10.3, 0.08, "is-edge");
    face("top", 0, 7.6, 0.01, 10.3, 0.12, "is-dash");
    for (let y = 6.55; y < 8.6; y += 0.6) face("top", 10.6, y, 0.01, 2.1, 0.3, "is-zebra");

    // Свет панелей на тротуаре
    face("top", 0.6, 0.7, 0.19, 11, 5.3, "is-glow");
    face("top", 9.4, 3.2, 0.2, 3.6, 2.8, "is-glow");

    // Стены, стойки и скамейка
    face("front", 2.12, 1.12, 3.08, 7.44, 2.9, "is-glass");
    face("side", 2.12, 2.6, 3.08, 1.48, 2.9, "is-glass");
    [[2, 1], [5.78, 1], [9.56, 1], [2, 4.4], [9.56, 4.4]].forEach(([x, y]) => box(x, y, 0.18, 0.12, 0.12, 2.9, "is-steel"));
    box(3.6, 1.7, 0.62, 4, 0.55, 0.1, "is-wood");
    box(3.9, 1.8, 0.18, 0.1, 0.35, 0.44, "is-steel");
    box(7.1, 1.8, 0.18, 0.1, 0.35, 0.44, "is-steel");
    box(1.1, 4.7, 0.18, 0.36, 0.36, 0.6, "is-steel");

    // Крыша с панелями
    box(2, 1, 3.08, 7.68, 3.52, 0.64, "is-steel");
    box(1.96, 0.96, 3.72, 7.76, 3.6, 0.06, "is-roof");
    led("front", 2, 4.53, 3.72, 7.68, 0.64, "mid");
    led("side", 9.69, 4.52, 3.72, 3.52, 0.64, "wing");

    // Вертикальная панель рядом с остановкой
    box(11, 4.2, 0.18, 1.42, 0.22, 2.3, "is-cap");
    led("front", 11.07, 4.43, 2.4, 1.28, 1.92, "panel");

    el.querySelector("[data-hm-scene]").innerHTML = parts.join("");
  }

  // Лайтбоксы-история: окошко идёт слева направо и увеличивает плитку. Без просмотра по клику
  function pjBuildStory(el, group) {
    el.innerHTML = group.shots.map((shot, i) => `<img src="${shot.src}.${shot.ext || "webp"}" alt="" style="animation-delay:${(i - 4) * 2.5}s">`).join("")
      + '<i class="pj-story__lens"></i>';
  }

  // Ноутбук и телефон стоят неподвижно, на обоих экранах баннеры сайта сами сменяют друг друга.
  // Сцена рисуется в 1000 × 660 px и масштабируется под ширину окна
  function pjBuildDevices(el, matrix) {
    const lang = matrix.langs[0].id;
    const [deskSize, phoneSize] = Object.keys(matrix.mock);
    const count = matrix.models.length;
    const stack = (size) => matrix.models.map((model, i) =>
      `<img src="${matrix.path}/${model.id}-${size}-${lang}.webp" alt=""${i === 0 ? ' class="is-active"' : ""}>`).join("");

    // Раскладка MacBook: подпись клавиши, ширина в клавишах (по умолчанию 1), выравнивание подписи
    const layout = [
      [["esc", 1.4], ..."☀ ☀ ⊞ ⌕ ◐ ☾ ◁◁ ▷ ▷▷ ◇ ◁ ◁)".split(" "), ["", 1]],
      [..."` 1 2 3 4 5 6 7 8 9 0 - =".split(" "), ["delete", 1.5, "end"]],
      [["tab", 1.5, "end"], ..."Q W E R T Y U I O P [ ] \\".split(" ")],
      [["caps lock", 1.8, "end"], ..."A S D F G H J K L ; '".split(" "), ["return", 1.8, "end"]],
      [["shift", 2.35, "end"], ..."Z X C V B N M , . /".split(" "), ["shift", 2.35, "end"]],
      [["fn", 1], ["control", 1, "end"], ["option", 1, "end"], ["command", 1.3, "end"], ["", 5.2], ["command", 1.3], ["option", 1], ["◀", 1, "c"], "pair", ["▶", 1, "c"]],
    ];
    const key = (item) => {
      if (item === "pair") return `<span class="lt__pair"><i class="lt__key lt__key--c">▲</i><i class="lt__key lt__key--c">▼</i></span>`;
      const [label, w = 1, align = ""] = Array.isArray(item) ? item : [item];
      return `<i class="lt__key${align ? " lt__key--" + align : ""}" style="--w:${w}">${label}</i>`;
    };
    const keyboard = layout.map((row, i) => `<span class="lt__row${i === 0 ? " lt__row--fn" : ""}">${row.map(key).join("")}</span>`).join("");

    el.innerHTML = `<div class="dv__stage">`
      + `<i class="dv__shadow dv__shadow--laptop"></i><i class="dv__shadow dv__shadow--phone"></i>`
      + `<div class="lt"><div class="lt__body">`
      + `<div class="lt__lid"><i class="lt__cam"></i><div class="lt__screen">${pjPage(matrix.mock[deskSize], stack(deskSize), count)}</div><span class="lt__label">MacBook Pro</span></div>`
      + `<div class="lt__base"><i class="lt__hinge"></i><i class="lt__speaker lt__speaker--left"></i><i class="lt__speaker lt__speaker--right"></i>`
      + `<span class="lt__keys">${keyboard}</span><i class="lt__pad"></i><i class="lt__notch"></i><i class="lt__front"></i><i class="lt__side"></i></div>`
      + `</div></div>`
      + `<div class="dv__phone"><div class="ip17 ip17--flat"><div class="ip17__body" data-ip-body>`
      + `<i class="ip17__btn ip17__btn--action"></i><i class="ip17__btn ip17__btn--up"></i><i class="ip17__btn ip17__btn--down"></i>`
      + `<div class="ip17__face"><div class="ip17__screen dv__screen">${pjPage(matrix.mock[phoneSize], stack(phoneSize), count)}`
      + `<span class="ip17__island"></span><i class="ip17__home"></i></div></div></div></div></div></div>`;

    // Толщина крышки — слои за ней, как у телефона
    const lid = el.querySelector(".lt__lid");
    for (let z = 1; z <= 7; z += 1) {
      const layer = document.createElement("i");
      layer.className = "lt__layer";
      layer.style.transform = `translateZ(${-z}px)`;
      lid.prepend(layer);
    }

    const stage = el.querySelector(".dv__stage");
    const fit = () => {
      const k = el.clientWidth / 1000;
      stage.style.transform = `scale(${k})`;
      el.style.height = 660 * k + "px";
    };
    new ResizeObserver(fit).observe(el);

    let index = 0;
    const timer = setInterval(() => {
      if (!el.isConnected) {
        clearInterval(timer); // окно закрыли — смена больше не нужна
        return;
      }
      index = (index + 1) % count;
      el.querySelectorAll(".pj-page").forEach((page) => {
        page.querySelectorAll(".pj-page__slot > img").forEach((img, i) => img.classList.toggle("is-active", i === index));
        page.querySelectorAll(".pj-page__dots i").forEach((dot, i) => dot.classList.toggle("is-active", i === index));
      });
    }, 3000);
  }

  // Стикеры DAFNA в Telegram: переписка менеджера с клиентом. Клиент пишет, менеджер выбирает стикер в наборе внизу
  // (стикер подсвечивается) — и он появляется в чате. Сначала на экране уже видна переписка до стикера «Zo'r»,
  // потом идут следующие сообщения, после паузы всё начинается заново. Вне экрана и при «меньше движения» стоит
  function pjBuildTgStickers(el) {
    const path = el.dataset.tgStickers;
    const chat = el.querySelector("[data-tgs-chat]");
    const grid = el.querySelector("[data-tgs-grid]");
    const pic = (n) => path + "/" + String(n).padStart(2, "0") + "-thumb.png";
    grid.innerHTML = Array.from({ length: 22 }, (_, i) => `<img src="${pic(i + 1)}" alt="" data-n="${i + 1}">`).join("");
    const SCRIPT = [
      { text: "Здравствуйте! Диван сегодня привезли 😊" },
      { sticker: 3 },
      { text: "Собрали за полчаса, всё отлично" },
      { sticker: 12 },
      { text: "Ещё хочу стол в детскую. Подскажете?" },
      { sticker: 19 },
      { text: "Спасибо, завтра заеду в шоурум" },
      { sticker: 22 },
    ];
    const START = 4; // столько сообщений видно сразу: до стикера «Zo'r»
    const time = (i) => "14:" + String(2 + i * 2).padStart(2, "0");
    const add = (i, animate) => {
      const m = SCRIPT[i];
      const node = document.createElement("div");
      node.className = m.sticker ? "df-tgs__st" : "df-tgs__msg";
      node.innerHTML = m.sticker
        ? `<img src="${pic(m.sticker)}" alt=""><time>${time(i)} ✓✓</time>`
        : `${m.text}<time>${time(i)}</time>`;
      if (animate) node.classList.add("is-new");
      chat.appendChild(node);
      // Старые сообщения, ушедшие за верх, убираем
      while (chat.children.length > 7) chat.children[1].remove();
    };
    const reset = () => [...chat.children].slice(1).forEach((n) => n.remove());
    for (let i = 0; i < START; i += 1) add(i, false);

    const pick = (n) => {
      const img = grid.querySelector(`[data-n="${n}"]`);
      grid.scrollTo({ top: Math.max(0, img.offsetTop - grid.clientHeight / 2 + img.offsetHeight / 2), behavior: "smooth" });
      img.classList.add("is-pick");
      setTimeout(() => img.classList.remove("is-pick"), 900);
    };
    let step = START;
    let timer = 0;
    let running = false;
    const tick = () => {
      if (!running) return;
      if (step >= SCRIPT.length) {
        // Пауза на последнем сообщении, затем переписка начинается с начала
        chat.classList.add("is-out");
        timer = setTimeout(() => {
          reset();
          chat.classList.remove("is-out");
          step = 0;
          grid.scrollTo({ top: 0 });
          tick();
        }, 900);
        return;
      }
      if (SCRIPT[step].sticker) {
        pick(SCRIPT[step].sticker);
        timer = setTimeout(() => { add(step, true); step += 1; timer = setTimeout(tick, 2200); }, 750);
      } else {
        add(step, true);
        step += 1;
        timer = setTimeout(tick, 1800);
      }
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) { running = true; timer = setTimeout(tick, 1600); }
      if (!entry.isIntersecting && running) { running = false; clearTimeout(timer); }
    }, { threshold: 0.4 }).observe(el);
  }

  // Толщина корпуса телефона: стопка слоёв за лицевой панелью
  function pjBuildPhone(body) {
    for (let z = 1; z <= 12; z += 1) {
      const layer = document.createElement("i");
      layer.className = "ip17__layer";
      layer.style.transform = `translateZ(${-z}px)`;
      body.prepend(layer);
    }
  }
  // Плашка Telegram: кампания и язык меняются кнопками, части собираются заново
  function pjBuildStrips(el, strips) {
    const box = el.querySelector("[data-tg-strip]");
    const controls = el.querySelector("[data-tg-controls]");
    let campaign = strips.campaigns[0];
    let lang = campaign.langs[0];


    function draw() {
      const parts = [];
      for (let n = 1; n <= strips.parts; n += 1) parts.push(`<video playsinline muted src="${strips.path}/${campaign.id}-${lang.id}-${n}.webm"></video>`);
      box.innerHTML = parts.join("");
      pjSyncVideos(box);
      const img = el.querySelector("[data-tg-img]");
      if (img) img.src = campaign.img;
      const photo = el.querySelector("[data-tg-photo]");
      if (photo) photo.textContent = lang.photo;
      const text = el.querySelector("[data-tg-text]");
      if (text) text.textContent = lang.text;
    }
    function drawControls() {
      controls.innerHTML = `<div><b>Кампания</b>${strips.campaigns.map((item) => `<button class="pj-pill${item === campaign ? " is-active" : ""}" type="button" data-campaign="${item.id}">${item.name}</button>`).join("")}</div>`
        + `<div><b>Язык</b>${campaign.langs.map((item) => `<button class="pj-pill${item === lang ? " is-active" : ""}" type="button" data-lang="${item.id}">${item.name}</button>`).join("")}</div>`;
    }
    controls.addEventListener("click", (event) => {
      const pill = event.target.closest(".pj-pill");
      if (!pill) return;
      if (pill.dataset.campaign) {
        campaign = strips.campaigns.find((item) => item.id === pill.dataset.campaign);
        lang = campaign.langs[0];
      } else {
        lang = campaign.langs.find((item) => item.id === pill.dataset.lang);
      }
      drawControls();
      draw();
    });
    drawControls();
    draw();
  }

  let stopProjectSteps = null;

  function initProject(root) {
    const project = root.querySelector("[data-project]");
    if (!project) return;
    const id = project.dataset.project;

    project.querySelectorAll("[data-pj-group]").forEach((el) => {
      pjBuildGroup(el, window.PROJECT_GROUPS[id][el.dataset.pjGroup]);
    });
    // Если матриц в проекте несколько, у блока указано имя нужной
    project.querySelectorAll("[data-pj-matrix]").forEach((el) => {
      const matrix = window.PROJECT_MATRIX[id];
      pjBuildMatrix(el, el.dataset.pjMatrix ? matrix[el.dataset.pjMatrix] : matrix);
    });
    project.querySelectorAll("[data-pj-sync]").forEach(pjSyncVideos);
    project.querySelectorAll("[data-pj-years]").forEach((el) => {
      const groups = window.PROJECT_GROUPS[id];
      pjBuildYears(el, window.PROJECT_YEARS[id][el.dataset.pjYears].map((item) => ({ ...item, group: groups[item.group] })));
    });
    project.querySelectorAll("[data-pj-screens]").forEach((el) => pjBuildScreens(el, window.PROJECT_SCREENS[id]));
    project.querySelectorAll("[data-pj-videos]").forEach((el) => pjBuildVideos(el, window.PROJECT_VIDEOS[id][el.dataset.pjVideos]));
    project.querySelectorAll("[data-pj-video-matrix]").forEach((el) => pjBuildVideoMatrix(el, window.PROJECT_MATRIX[id][el.dataset.pjVideoMatrix]));
    project.querySelectorAll("[data-hm-stop]").forEach(pjBuildStop);
    project.querySelectorAll("[data-df-logo30]").forEach(pjBuildLogo30);
    project.querySelectorAll("[data-df-cal]").forEach((el) => pjBuildDeskCal(el, window.PROJECT_GROUPS[id][el.dataset.dfCal]));
    project.querySelectorAll("[data-pj-book]").forEach((el) => pjBuildBook(el, window.PROJECT_GROUPS[id][el.dataset.pjBook]));
    project.querySelectorAll("[data-pj-clock]").forEach(pjBuildClock);
    project.querySelectorAll("[data-hm-billboard]").forEach(pjBuildBillboard);
    project.querySelectorAll("[data-hm-bus]").forEach((el) => pjBuildBus(el, window.PROJECT_GROUPS[id][el.dataset.hmBus]));
    project.querySelectorAll("[data-hm-fly]").forEach((el) => pjBuildFly(el, window.PROJECT_GROUPS[id][el.dataset.hmFly]));
    project.querySelectorAll("[data-iso-screen]").forEach(pjBuildScreen);
    project.querySelectorAll("[data-pj-devices]").forEach((el) => pjBuildDevices(el, window.PROJECT_MATRIX[id][el.dataset.pjDevices]));
    project.querySelectorAll("[data-ip-body]").forEach(pjBuildPhone);
    project.querySelectorAll("[data-tg-stickers]").forEach(pjBuildTgStickers);
    project.querySelectorAll("[data-pj-story]").forEach((el) => pjBuildStory(el, window.PROJECT_GROUPS[id][el.dataset.pjStory]));
    project.querySelectorAll("[data-hm-lift]").forEach(pjBuildLift);
    project.querySelectorAll(".hm-ai-row").forEach(pjFitAi);
    project.querySelectorAll("[data-pj-mockset]").forEach((el) => pjMarkMockset(project, el.dataset.set, el));
    project.querySelectorAll("[data-pj-pair]").forEach((el) => pjShowRow([...el.children], el));
    project.querySelectorAll("[data-pj-strips]").forEach((el) => pjBuildStrips(el, window.PROJECT_STRIPS[id]));

    // Заголовок раздела получает ту же анимированную иконку, что и его плитка в «Что я делал»
    project.querySelectorAll("[data-pj-jump]").forEach((tile) => {
      const head = project.querySelector("#" + tile.dataset.pjJump + " .pj-head");
      head.prepend(tile.querySelector(".pj-icon").cloneNode(true));
    });

    // Этапы работы: та же анимация, что в «Как я работаю»
    if (stopProjectSteps) stopProjectSteps();
    // Блока этапов может не быть (витрины внутри SMM-кейса Barbican)
    const stepsEl = project.querySelector("[data-pj-steps]");
    stopProjectSteps = stepsEl ? runSteps(stepsEl) : null;
  }

  function initGalleries(root) {
    root.querySelectorAll(".smm-gallery").forEach(buildGallery);
  }

  function buildGallery(box) {
    const id = box.dataset.gallery;
    const items = (window.GALLERIES || {})[id] || [];
    const groupInfo = (window.GALLERY_GROUPS || {})[id] || {};
    if (!items.length) return;

    // Только те форматы, в которых есть работы
    const formats = GALLERY_FORMATS.filter((f) => items.some((item) => item.format === f.key));
    const wall = (window.GALLERY_WALL || {})[id];
    const instagram = (window.GALLERY_INSTAGRAM || {})[id];   // если есть — большой просмотр с интерфейсом Instagram

    // Все вкладки открываются окном с бегущими колонками: вместо сетки — плитки запуска,
    // чтобы работы нигде нельзя было открыть по одной
    if (wall && formats.every((f) => wall.formats.includes(f.key))) {
      box.innerHTML =
        '<div class="smm-gallery__head"><h4 class="smm-gallery__title">Работы</h4></div>' +
        '<div class="wall-tiles"></div>';
      formats.forEach((format) => {
        const list = items.filter((item) => item.format === format.key);
        const tile = document.createElement("button");
        tile.type = "button";
        tile.className = "wall-tile";
        const coverPosition = (wall.coverPositions || {})[format.key];
        tile.innerHTML =
          '<span class="wall-tile__cover" style="background-image:url(\'' + wall.covers[format.key] + '\');' +
            (coverPosition ? "background-position:" + coverPosition + ";" : "") + '"></span>' +
          '<span class="wall-tile__label"><span class="smm-tab__full">' + format.label + "</span>" +
            '<span class="smm-tab__short">' + format.short + "</span></span>";
        tile.addEventListener("click", () => openReelsWall(list, wall, format.label, groupInfo));
        box.querySelector(".wall-tiles").appendChild(tile);
      });
      return;
    }

    box.innerHTML =
      '<div class="smm-gallery__head">' +
        '<h4 class="smm-gallery__title">Работы</h4>' +
        '<div class="smm-gallery__tabs" role="tablist"></div>' +
      "</div>" +
      '<div class="smm-gallery__body"></div>';

    const tabs = box.querySelector(".smm-gallery__tabs");
    tabs.classList.toggle("smm-gallery__tabs--many", formats.length > 3);
    const body = box.querySelector(".smm-gallery__body");

    // Вкладки форматов
    formats.forEach((format, i) => {
      const tab = document.createElement("button");
      tab.type = "button";
      tab.className = "smm-tab" + (i === 0 ? " is-active" : "");
      tab.setAttribute("role", "tab");
      tab.innerHTML =
        '<span class="smm-tab__full">' + format.label + "</span>" +
        '<span class="smm-tab__short">' + format.short + "</span>";
      tab.addEventListener("click", () => {
        // Вкладка с бегущими колонками открывается отдельным окном, текущая вкладка не меняется
        if (wall && wall.formats.includes(format.key)) {
          openReelsWall(items.filter((item) => item.format === format.key), wall, format.label, groupInfo, instagram);
          return;
        }
        tabs.querySelectorAll(".smm-tab").forEach((t) => t.classList.toggle("is-active", t === tab));
        showFormat(format.key);
      });
      tabs.appendChild(tab);
    });

    // Работы выбранного формата, разбитые на группы (main, techno…)
    function showFormat(formatKey) {
      const list = items.filter((item) => item.format === formatKey);
      const groups = [...new Set(list.map((item) => item.group || "main"))];
      body.innerHTML = "";

      groups.forEach((groupKey) => {
        const groupItems = list.filter((item) => (item.group || "main") === groupKey);
        const ordered = []; // 2026-11-17: листаются только работы этой группы (main и TECHNO — отдельно)
        const info = groupInfo[groupKey] || {};

        const group = document.createElement("section");
        // Пропорции плиток: у вкладки формата — как у формата, у смешанных вкладок — из ratio группы
        group.className = "smm-group smm-group--" + (info.ratio || formatKey);

        // Подзаголовок — только у дополнительных групп (например, TECHNO), у основной его нет
        if (groupKey !== groups[0]) {
          group.innerHTML =
            '<div class="smm-group__head"><span>' + (info.title || groupKey) + "</span></div>" +
            (info.text ? '<p class="smm-group__text">' + info.text + "</p>" : "");
        }
        const grid = document.createElement("div");
        grid.className = "smm-grid";
        group.appendChild(grid);

        groupItems.forEach((item) => {
          const index = ordered.length;
          ordered.push(item);
          const tile = document.createElement("button");
          tile.type = "button";
          tile.className = "smm-item";
          tile.innerHTML =
            '<img src="' + item.thumb + '" alt="' + item.title + '" loading="lazy" decoding="async">' +
            '<span class="smm-item__caption">' + item.title + "</span>";
          tile.addEventListener("click", () => openLightbox(ordered, index, instagram));
          grid.appendChild(tile);
        });

        body.appendChild(group);
      });

      // Плавное появление при смене вкладки
      body.classList.remove("is-shown");
      void body.offsetWidth;
      body.classList.add("is-shown");
    }

    showFormat(formats[0].key);
  }


  /* ---------- 13. Лайтбокс: картинка на весь экран ----------
     Листание: стрелки на экране, клавиши ← →, свайп на телефоне. Esc — закрыть. */
  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightbox-img");
  const lbStage = lightbox.querySelector(".lightbox__stage");
  const lbInsta = document.getElementById("lightbox-insta");
  let lbItems = [];
  let lbIndex = 0;
  let lbInstagram = null;   // данные для интерфейса Instagram, null — обычный просмотр
  let lbToken = 0;          // номер показа: ответ от старой картинки не трогает новую

  function renderLightbox() {
    const item = lbItems[lbIndex];
    lightbox.classList.toggle("lightbox--insta", !!lbInstagram);
    lbStage.classList.toggle("lightbox__stage--insta", !!lbInstagram);
    lbInsta.hidden = !lbInstagram;
    if (lbInstagram) {
      renderInsta(item, lbInstagram);
    } else {
      lbImg.classList.remove("is-loaded");
      // 2026-11-27 (он заметил подвисания на телефоне): token — чтобы догрузившаяся старая картинка не перебила новую;
      // на телефоне сразу ставим уже загруженное превью, а большую подменяем, когда она загрузится
      const token = ++lbToken;
      const ready = () => {
        if (token !== lbToken) return;
        fitFreeImage(item);
        lbImg.classList.add("is-loaded");
      };
      lbImg.onload = ready;
      if (item.thumb && item.thumb !== item.full && lightbox.classList.contains("lightbox--full")) {
        lbImg.src = item.thumb;
        const big = new Image();
        big.onload = () => { if (token === lbToken) lbImg.src = item.full; };
        big.src = item.full;
      } else {
        lbImg.src = item.full;
      }
      lbImg.alt = item.title;
      // Прозрачный PNG (указатели, стикеры) — без тени и скругления, иначе вокруг фигуры видна тёмная рамка прямоугольника
      lbImg.classList.toggle("lightbox__img--clear", /\.png$/i.test(item.full));
      if (lbImg.complete) ready();
    }

    // Заранее подгружаем соседние картинки — листание без задержек
    [lbIndex - 1, lbIndex + 1].forEach((i) => {
      if (lbItems[i]) new Image().src = lbItems[i].full;
    });
  }

  // Картинка со своими пропорциями: вписываем в экран, мелкие баннеры увеличиваем максимум вдвое.
  // Лендинг идёт по ширине и прокручивается, всё остальное видно целиком
  function fitFreeImage(item) {
    lbStage.classList.remove("lightbox__stage--scroll");
    lbStage.scrollTop = 0;
    lbImg.style.width = "";
    lbImg.style.height = "";
    if (!item.free || !lbImg.naturalWidth) return;

    const full = lightbox.classList.contains("lightbox--full");
    const zoom = full ? 1 : item.zoom || 1;
    const maxW = full ? window.innerWidth : (window.innerWidth - (window.innerWidth > 960 ? 144 : 32)) * zoom;
    const maxH = full ? window.innerHeight : (window.innerHeight - 48) * zoom;
    const w = lbImg.naturalWidth;
    const h = lbImg.naturalHeight;
    let k = full ? Math.min(maxW / w, maxH / h) : Math.min(maxW / w, maxH / h, item.max || 2);
    if (item.px && !full) k = Math.min(maxW / w, maxH / h, item.px / w); // ровно во столько px шириной, сколько просили
    if (item.scroll) {
      k = Math.min(maxW, 900) / w;
      lbStage.classList.add("lightbox__stage--scroll");
    }
    lbImg.style.width = Math.round(w * k) + "px";
    lbImg.style.height = Math.round(h * k) + "px";
  }

  // 2026-11-27, его правило: на телефоне (до 640 px) просмотр картинок во ВСЕХ кейсах — во весь экран,
  // без полей и уменьшений (data-zoom-pc, zoom, max, px действуют только на компьютере)
  function openLightbox(items, index, instagram) {
    lightbox.classList.toggle("lightbox--full", !instagram && window.matchMedia("(max-width: 640px)").matches);
    lbItems = items;
    lbIndex = index;
    lbInstagram = instagram || null;
    // Цвет стрелок — как у открытого кейса
    lightbox.style.setProperty("--case-accent", modalWindow.style.getPropertyValue("--case-accent"));
    renderLightbox();
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
  }

  function stepLightbox(direction) {
    lbIndex = (lbIndex + direction + lbItems.length) % lbItems.length;
    renderLightbox();
  }

  lightbox.querySelector("[data-lb-prev]").addEventListener("click", () => stepLightbox(-1));
  lightbox.querySelector("[data-lb-next]").addEventListener("click", () => stepLightbox(1));

  // Закрыть: второй клик по самой картинке (2026-11-15) или, как раньше, по тёмному фону вокруг.
  // В интерфейсе Instagram закрывает клик по фото поста, а комментарии и кнопки — нет
  lightbox.addEventListener("click", (event) => {
    const t = event.target;
    // 2026-11-27: на телефоне Reels открыт во всю ширину — закрывается и касанием по самому экрану Reels
    if (t === lightbox || t === lbStage || t === lbImg || t.closest(".insta__media") || t.classList.contains("reel__screen")) closeLightbox();
  });

  // Клавиши. Перехватываем раньше окна проекта, чтобы Esc закрывал сначала лайтбокс
  window.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("is-open")) return;
    if (event.key === "Escape") { closeLightbox(); event.stopImmediatePropagation(); }
    if (event.key === "ArrowLeft") stepLightbox(-1);
    if (event.key === "ArrowRight") stepLightbox(1);
  }, true);

  // Свайп пальцем влево/вправо
  let touchX = null;
  lightbox.addEventListener("touchstart", (event) => { touchX = event.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener("touchend", (event) => {
    if (touchX === null) return;
    const dx = event.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) stepLightbox(dx < 0 ? 1 : -1);
    touchX = null;
  });


  /* ---------- 13а. Интерфейс Instagram в большом просмотре ----------
     Посты: картинка и панель с комментариями. 9:16: экран Reels или Stories
     (Stories — если это слово есть в названии работы).
     Тексты — рыба из window.GALLERY_INSTAGRAM в файле данных галереи. */
  const INSTA_LIKES_MIN = 40;      // лайков у поста: от этого числа
  const INSTA_LIKES_SPREAD = 320;  // и ещё до стольких сверху

  // Число из пути к картинке: у каждой работы свои лайки, и при листании они не меняются
  function instaSeed(text) {
    let seed = 0;
    for (const char of text) seed = (seed * 31 + char.charCodeAt(0)) % 9973;
    return seed;
  }

  function instaPlural(n, one, few, many) {
    const tens = n % 100;
    const units = n % 10;
    if (tens >= 11 && tens <= 14) return many;
    if (units === 1) return one;
    return units >= 2 && units <= 4 ? few : many;
  }

  // Подпись и дата берутся из названия работы: «Пледы · Сентябрь 2022»
  function instaCaption(item) {
    const parts = item.title.split(" · ");
    const text = parts[0].replace(/^Обложка (Reels|видео):?\s*/, "").replace(/^Пост для соцсетей$/, "");
    return {
      text: text.charAt(0).toUpperCase() + text.slice(1),
      date: parts[1] ? parts[1] + " г." : "",
    };
  }

  function instaRow(name, text, details) {
    return '<div class="insta__row">' +
      '<span class="insta__avatar insta__avatar--letter">' + name.charAt(0).toUpperCase() + "</span>" +
      '<div class="insta__row-text"><p><b>' + name + "</b> " + text + "</p><small>" + details + "</small></div>" +
      REEL_ICONS.heart +
    "</div>";
  }

  // Пропорции работы: у смешанных вкладок (Лендинг) — из ratio её группы
  function instaRatio(item, data) {
    return ((data.groups || {})[item.group] || {}).ratio || item.format;
  }

  function instaPost(item, data) {
    const seed = instaSeed(item.full);
    const caption = instaCaption(item);
    const bare = ((data.groups || {})[item.group] || {}).noComments;   // без подписи и комментариев
    const likes = INSTA_LIKES_MIN + (seed % INSTA_LIKES_SPREAD);
    const shown = 2 + (seed % 4);                 // сколько комментариев видно
    const total = shown + 1 + (seed % 14);        // сколько их всего
    let rows = "";
    for (let i = 0; i < shown; i++) {
      const name = data.people[(seed + i * 3) % data.people.length];
      const text = data.comments[(seed + i * 5) % data.comments.length];
      const commentLikes = (seed + i) % 6;
      const age = (i + 1 + (seed % 3)) + " нед.";
      rows += instaRow(name, text, age + (commentLikes ? " · " + commentLikes + " " +
        instaPlural(commentLikes, "отметка", "отметки", "отметок") + " «Нравится»" : "") + " · Ответить");
    }

    // 2026-11-16: посты 1:1 и 4:5 во всех SMM-кейсах открываются на 30% меньше (класс insta--small)
    const small = !bare && ["1x1", "4x5"].includes(instaRatio(item, data));
    lbInsta.className = "insta insta--post" + (bare ? " insta--bare" : "") + (small ? " insta--small" : "");
    lbInsta.style.setProperty("--insta-ratio", instaRatio(item, data) === "4x5" ? 0.8 : 1);
    lbInsta.innerHTML =
      '<header class="insta__head">' +
        '<span class="insta__avatar" style="background-image:url(\'' + data.avatar + '\')"></span>' +
        '<div class="insta__who"><p><b>' + data.account + '</b> · <a>Подписаться</a></p><small>' + data.location + "</small></div>" +
        REEL_ICONS.dots +
      "</header>" +
      '<div class="insta__media"><img src="' + item.full + '" alt="' + item.title + '"></div>' +
      (bare ? "" :
      '<div class="insta__comments">' +
        '<div class="insta__row insta__row--caption">' +
          '<span class="insta__avatar" style="background-image:url(\'' + data.avatar + '\')"></span>' +
          '<div class="insta__row-text"><p><b>' + data.account + "</b> " + (caption.text ? caption.text + "<br>" : "") + data.captionText +
            "<br><em>" + data.tags + "</em></p></div>" +
        "</div>" +
        rows +
        '<p class="insta__more">Посмотреть все комментарии (' + total + ")</p>" +
      "</div>") +
      '<footer class="insta__foot">' +
        '<div class="insta__actions">' + REEL_ICONS.heart + (bare ? "" : REEL_ICONS.comment) + REEL_ICONS.send +
          '<span class="post__save">' + REEL_ICONS.save + "</span></div>" +
        '<p class="insta__likes">' + likes + " " + instaPlural(likes, "отметка", "отметки", "отметок") + " «Нравится»</p>" +
        '<p class="insta__date">' + caption.date + "</p>" +
        (bare ? "" : '<div class="insta__input"><span>Добавьте комментарий…</span><a>Опубликовать</a></div>') +
      "</footer>";
    if (!bare) lbInsta.querySelector(".insta__comments").scrollTop = 0;
    lbStage.scrollTop = 0;
  }

  function instaScreen(item, data, opts = {}) {
    const seed = instaSeed(item.full);
    const isStory = opts.story || item.title.includes("Stories") || item.format === "highlights";   // актуальные — это сторис
    lbInsta.className = "insta insta--screen";
    lbInsta.innerHTML = '<div class="reel insta__phone">' + (isStory
      ? REEL_TEMPLATES.story(data, (1 + (seed % 20)) + " ч.")
      : REEL_TEMPLATES.reel(data, {
          likes: INSTA_LIKES_MIN + (seed % INSTA_LIKES_SPREAD),
          comments: 3 + (seed % 14),
          shares: 1 + (seed % 12),
          music: data.music,
        })) + "</div>";
    const screen = lbInsta.querySelector(".js-image");
    screen.style.backgroundImage = "url('" + item.full + "')";
    if (opts.fit) {
      screen.classList.add("story--fit");
      screen.insertAdjacentHTML("afterbegin", '<span class="story__fit"><img src="' + item.full + '" alt=""></span>');
    }
    const caption = lbInsta.querySelector(".js-caption");
    if (caption) {
      const text = instaCaption(item).text;
      caption.textContent = (text ? text + ". " : "") + data.captionText;
    }
  }

  function renderInsta(item, data) {
    // 2026-11-27, его поправка: «Лендинг» в Instagram показывается в историях — интерфейс Stories для всех его работ.
    // Работа 4:5 стоит в истории по центру целиком, за ней размытая она же (как Instagram показывает пост в сторис)
    if (item.format === "landing") instaScreen(item, data, { story: true, fit: instaRatio(item, data) !== "9x16" });
    else if (instaRatio(item, data) === "9x16") instaScreen(item, data);
    else instaPost(item, data);
  }


  /* ---------- 14. Окно Reels: колонки сами бегут вверх и вниз ----------
     Обычно работы только показываются: по ним нельзя кликнуть. Если в данных окна стоит
     openable, карточка — просто картинка без интерфейса, и по клику открывается просмотр.
     Картинка — фон, а не <img>, и берётся маленькое превью. Карточек в окне немного:
     уехавшая за край карточка перескакивает на другой край и получает следующую работу.
     Поэтому даже сотни работ не тормозят страницу. */
  const REEL_SPEEDS = [26, 32, 24, 30];   // скорость колонок, пикселей в секунду
  const REEL_GAP = 20;                    // отступ между карточками, px
  const REEL_SPEED_MAX = 10;              // самая высокая скорость колесом: во столько раз быстрее обычной
  const REEL_SPEED_STEP = 0.5;            // на сколько меняется скорость за один щелчок колеса
  const REEL_SPEED_PHONE = 5;             // на телефоне (до 640 px) скорость постоянная, колесом не меняется
  const REEL_SPEED_START = 3.5;           // с какой скоростью колонки бегут при открытии окна
  const LENS_PERIOD = 2.4;                // окно с кружком: секунд на один шаг при обычной скорости ×1
  const LENS_HOLD = 0.38;                 // какую долю шага картинка стоит в кружке
  const LENS_SPEED_MIN = 0.5;             // окно с кружком: скорость колесом — только от ×0,5
  const LENS_SPEED_MAX = 2;               // до ×2, через ×1,5
  const LENS_GROW = 1.45;                 // во сколько раз круг больше своей обрезки из картинки
  const LENS_GAP = 40;                    // самый маленький зазор между кружком и соседней картинкой, px
  const LENS_ZOOM = 0.78;                 // масштаб всего окна с кружком: меньше — ряды дальше и мельче

  const wallEl = document.getElementById("reels-wall");
  const wallStream = document.getElementById("rw-stream");
  let wallItems = [];
  let wallInfo = null;
  let wallGroups = null;
  let wallInstagram = null;               // интерфейс для просмотра по клику (окна с openable)
  let wallMode = "columns";              // "columns" — колонки, "lens" — ряды с кружком
  let wallPhase = 0;                      // окно с кружком: сколько шагов пройдено
  let wallRows = [];
  let wallColumns = [];
  let wallFrame = null;
  let wallLastTime = 0;
  let wallLastFocus = null;
  let wallSpeed = 1;                      // текущая скорость (1 = обычная, 0 = стоит)
  let wallSpeedTarget = 1;                // скорость, которую задали колесом
  const wallCalm = window.matchMedia("(prefers-reduced-motion: reduce)");

  // Значки условного интерфейса. Счётчиков нет — цифры были бы выдуманными
  const REEL_ICONS = {
    heart: '<svg viewBox="0 0 24 24"><path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 7.5 2.8C19.5 15.4 12 20 12 20z"/></svg>',
    comment: '<svg viewBox="0 0 24 24"><path d="M12 4a8 8 0 0 1 6.9 12l1.1 4-4-1.1A8 8 0 1 1 12 4z"/></svg>',
    send: '<svg viewBox="0 0 24 24"><path d="M21 4L3 11l7 2.5L12.500 20.500z"/><path d="M10 13.500L21 4"/></svg>',
    dots: '<svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg>',
    camera: '<svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="14" rx="4"/><circle cx="12" cy="13" r="3.5"/><path d="M8 6l1.5-2.5h5L16 6"/></svg>',
    save: '<svg viewBox="0 0 24 24"><path d="M6 4h12v16l-6-4-6 4z"/></svg>',
  };

  // Виды карточки. У картинки класс js-image, у подписи — js-caption
  function reelAvatar(info) {
    return '<span class="reel__avatar" style="background-image:url(\'' + info.avatar + '\')"></span>';
  }
  // Значок со счётчиком под ним. Без числа — просто значок
  function reelStat(icon, value) {
    return value ? '<span class="reel__stat">' + icon + "<small>" + value + "</small></span>" : icon;
  }
  const REEL_TEMPLATES = {
    // Только картинка, без интерфейса (окна с openable)
    plain: () => '<div class="reel__screen reel__screen--plain js-image"></div>',
    // Reels: экран во всю карточку, значки справа. stats — счётчики и музыка (в большом просмотре)
    reel: (info, stats = {}) =>
      '<div class="reel__screen js-image">' +
        '<div class="reel__top"><span>Reels</span>' + REEL_ICONS.camera + "</div>" +
        '<div class="reel__side">' + reelStat(REEL_ICONS.heart, stats.likes) + reelStat(REEL_ICONS.comment, stats.comments) +
          reelStat(REEL_ICONS.send, stats.shares) + (stats.music ? REEL_ICONS.save : "") + REEL_ICONS.dots + "</div>" +
        '<div class="reel__bottom">' +
          '<div class="reel__account">' + reelAvatar(info) + "<b>" + info.account + "</b><i>Подписаться</i></div>" +
          '<p class="reel__caption js-caption"></p>' +
          (stats.music ? '<p class="reel__music">♫ ' + stats.music + "</p>" : "") +
        "</div>" +
      "</div>",
    // Stories: полоска просмотра и аккаунт сверху, поле сообщения снизу. time — сколько часов назад
    story: (info, time) =>
      '<div class="reel__screen js-image">' +
        '<div class="story__head">' +
          '<span class="story__bar"></span>' +
          '<div class="reel__account">' + reelAvatar(info) + "<b>" + info.account + "</b>" +
            (time ? "<em>" + time + "</em>" : "") + "</div>" +
        "</div>" +
        '<div class="story__foot"><span class="story__field">Отправить сообщение</span>' + REEL_ICONS.heart + REEL_ICONS.send + "</div>" +
      "</div>",
    // Пост из ленты: шапка, картинка, значки, подпись
    post: (info) =>
      '<div class="post">' +
        '<div class="post__head"><div class="reel__account">' + reelAvatar(info) + "<b>" + info.account + "</b></div>" + REEL_ICONS.dots + "</div>" +
        '<div class="post__image js-image"></div>' +
        '<div class="post__actions">' + REEL_ICONS.heart + REEL_ICONS.comment + REEL_ICONS.send + '<span class="post__save">' + REEL_ICONS.save + "</span></div>" +
        '<p class="post__caption"><b>' + info.account + '</b> <span class="js-caption"></span></p>' +
      "</div>",
  };

  // Вид и высота карточки по пропорциям работы. Корпус — 3,2% ширины, внутри него пост:
  // картинка и шапка с низом (их высоты в cqw дают 35% внутренней ширины)
  function wallCardShape(item, cardWidth) {
    if (wallInfo.openable) return { kind: "plain", height: (cardWidth * 16) / 9 };
    const groups = wallGroups || {};
    const ratio = (groups[item.group] || {}).ratio || item.format;
    if (ratio === "9x16") {
      return { kind: item.format === "9x16" ? "reel" : "story", height: (cardWidth * 16) / 9 };
    }
    const tall = ratio === "4x5" ? 1.25 : 1;
    return { kind: "post", height: cardWidth * (0.032 + 0.968 * (tall + 0.35)) };
  }

  function buildWall() {
    wallStream.classList.toggle("reels-wall__stream--lens", wallMode === "lens");
    wallStream.classList.toggle("reels-wall__stream--open", !!wallInfo.openable);
    if (wallMode === "lens") {
      buildLens();
      return;
    }
    const width = wallStream.clientWidth;
    const count = width >= 1000 ? 4 : width >= 640 ? 3 : 2;
    const cardWidth = (width - REEL_GAP * (count - 1)) / count;
    const viewHeight = wallStream.clientHeight;
    wallStream.style.setProperty("--reel-radius", cardWidth * 0.08 + "px");

    wallStream.innerHTML = "";
    wallColumns = [];
    for (let c = 0; c < count; c++) {
      const box = document.createElement("div");
      box.className = "reels-wall__column";
      box.style.left = c * (cardWidth + REEL_GAP) + "px";
      box.style.width = cardWidth + "px";
      wallStream.appendChild(box);

      // Лента колонки: высота каждой работы своя. Короткую ленту повторяем, чтобы она не кончалась
      const own = wallItems.filter((_, i) => i % count === c);
      const entries = [];
      let length = 0;
      let margin = 0;
      do {
        own.forEach((item) => {
          const shape = wallCardShape(item, cardWidth);
          entries.push({ item, kind: shape.kind, height: shape.height, top: length, index: entries.length });
          length += shape.height + REEL_GAP;
          margin = Math.max(margin, shape.height);
        });
      } while (own.length && length < viewHeight + margin * 2);

      const column = {
        box,
        entries,
        length,
        margin,                                     // запас за краями: карточка готова заранее
        viewHeight,
        direction: c % 2 === 0 ? -1 : 1,            // нечётные вверх, чётные вниз
        // На узких экранах карточки мельче, и скорость уменьшается вместе с ними
        speed: REEL_SPEEDS[c % REEL_SPEEDS.length] * Math.min(1, cardWidth / 300),
        offset: c % 2 === 0 ? 0 : margin / 2,       // соседние колонки вразбежку
        active: new Map(),                          // какая работа сейчас в какой карточке
        free: { plain: [], reel: [], story: [], post: [] },   // свободные карточки по видам
      };
      wallColumns.push(column);
    }
    placeWall();
  }

  // Взять свободную карточку нужного вида или создать новую, и показать в ней работу
  function takeWallCard(column, entry) {
    let card = column.free[entry.kind].pop();
    if (!card) {
      const el = document.createElement("div");
      el.className = "reel" + (entry.kind === "plain" ? " reel--plain" : "");
      el.innerHTML = REEL_TEMPLATES[entry.kind](wallInfo);
      column.box.appendChild(el);
      card = { el, image: el.querySelector(".js-image"), caption: el.querySelector(".js-caption") };
    }
    card.el.style.height = entry.height + "px";
    card.el.style.visibility = "visible";
    card.el.dataset.index = wallItems.indexOf(entry.item);       // какую работу открыть по клику
    card.image.style.backgroundImage = "url('" + entry.item.thumb + "')";
    if (card.caption) card.caption.textContent = entry.item.title.split(" · ")[0];  // в сторис подписи нет
    // Заранее подгружаем следующие работы: на высокой скорости они не успели бы загрузиться
    for (let i = 1; i <= 3; i++) {
      const next = column.direction < 0 ? entry.index + i : entry.index - i;
      const count = column.entries.length;
      new Image().src = column.entries[((next % count) + count) % count].item.thumb;
    }
    return card;
  }

  /* Окно с кружком (режим "lens"), для «Актуальных»: два ряда едут навстречу шагами.
     Посередине ряда стоит кружок. Подъезжая к нему, картинка обрезается до круга — так
     обложка выглядит в профиле, — стоит в нём и, уезжая, снова раскрывается целиком. */
  function buildLens() {
    const width = wallStream.clientWidth;
    const count = Math.round((width >= 1000 ? 4 : width >= 640 ? 3 : 2) / LENS_ZOOM);
    const rowCount = wallInfo.lensRows === 1 ? 1 : 2;              // 2026-11-16: мало обложек — одна полоска
    const rowHeight = ((wallStream.clientHeight - REEL_GAP) / 2) * LENS_ZOOM;
    const rowsTop = (wallStream.clientHeight - rowHeight * rowCount - REEL_GAP * (rowCount - 1)) / 2;   // ряды — по центру окна
    const cardWidth = Math.min(width * 0.42 * LENS_ZOOM, ((rowHeight - 8) * 9) / 16);
    const cardHeight = (cardWidth * 16) / 9;
    const circle = cardWidth * 0.94;                                // круг обложки: почти вся её ширина
    // Кружок: внизу остаётся место для подписи, по бокам — для соседних картинок
    const lensSize = Math.min(circle * LENS_GROW, rowHeight - 56, width * 0.62);
    const avatarSize = Math.min(cardWidth * 1.1, rowHeight - 56);
    // Шаг ряда: соседняя картинка не заходит на кружок, даже когда экран узкий
    const pitch = Math.max(width / count, (lensSize + 14) / 2 + Math.max(cardWidth, avatarSize) / 2 + LENS_GAP);
    const reach = width / 2 / pitch + 1.5;                          // на сколько шагов от центра ряд виден

    wallStream.innerHTML = "";
    wallRows = (rowCount === 1 ? [0] : [0, 1]).map((r) => {
      const box = document.createElement("div");
      box.className = "hl-row";
      box.style.top = rowsTop + r * (rowHeight + REEL_GAP) + "px";
      box.style.height = rowHeight + "px";
      box.innerHTML =
        '<span class="hl-lens" style="width:' + (lensSize + 14) + "px;height:" + (lensSize + 14) + 'px;"></span>' +
        '<span class="hl-lens__label" style="margin-top:' + ((lensSize + 14) / 2 + 8) + 'px;"></span>';
      wallStream.appendChild(box);

      const own = wallItems.filter((_, i) => i % rowCount === r);
      const entries = [];
      do {
        own.forEach((item) => entries.push({ item, kind: (wallGroups[item.group] || {}).ratio === "1x1" ? "avatar" : "cover" }));
      } while (own.length && entries.length < reach * 2 + 2);       // короткий ряд повторяем

      return {
        box,
        lens: box.querySelector(".hl-lens"),
        label: box.querySelector(".hl-lens__label"),
        entries,
        direction: r === 0 ? -1 : 1,                                // верхний ряд влево, нижний вправо
        phaseShift: r * 0.5,                                        // ряды шагают по очереди
        pitch, width, rowHeight, cardWidth, cardHeight, circle, lensSize, avatarSize,
        active: new Map(),
        free: { cover: [], avatar: [] },
        reach,
      };
    });
    placeLens();
  }

  function takeLensCard(row, entry) {
    let card = row.free[entry.kind].pop();
    if (!card) {
      const el = document.createElement("div");
      el.className = "hl-card";
      el.innerHTML = '<div class="hl-card__image"></div>';
      row.box.insertBefore(el, row.box.firstChild);                 // под кружком и подписью
      card = { el, image: el.firstChild };
    }
    const avatar = entry.kind === "avatar";
    const w = avatar ? row.avatarSize : row.cardWidth;
    const h = avatar ? row.avatarSize : row.cardHeight;
    card.el.style.width = w + "px";
    card.el.style.height = h + "px";
    card.el.style.marginLeft = -w / 2 + "px";
    card.el.style.marginTop = -h / 2 + "px";
    card.el.style.visibility = "visible";
    card.el.dataset.index = wallItems.indexOf(entry.item);       // какую работу открыть по клику
    card.image.style.backgroundImage = "url('" + entry.item.thumb + "')";
    return card;
  }

  // Доля пути за шаг: сначала стоим в кружке, потом плавно едем к следующему положению
  function lensEase(part) {
    if (part < LENS_HOLD) return 0;
    const u = (part - LENS_HOLD) / (1 - LENS_HOLD);
    return u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
  }

  function placeLens() {
    wallRows.forEach((row) => {
      const phase = wallPhase + row.phaseShift;
      const steps = Math.floor(phase);
      const position = steps + lensEase(phase - steps);
      const count = row.entries.length;
      let nearest = null;
      let nearestMorph = 0;
      let nearestAway = 1;

      row.entries.forEach((entry, i) => {
        // Расстояние от центра ряда в шагах, по кругу
        let d = (((i + row.direction * position) % count) + count) % count;
        if (d > count / 2) d -= count;

        const inView = Math.abs(d) < row.reach;
        let card = row.active.get(entry);
        if (inView && !card) {
          card = takeLensCard(row, entry);
          row.active.set(entry, card);
        } else if (!inView && card) {
          card.el.style.visibility = "hidden";
          row.free[entry.kind].push(card);
          row.active.delete(entry);
          card = null;
        }
        if (!card) return;

        // Насколько картинка уже в кружке: 0 — целиком, 1 — только круг
        const away = Math.abs(d);
        const raw = Math.max(0, Math.min(1, (0.85 - away) / 0.7));
        const morph = raw * raw * (3 - 2 * raw);
        if (morph > nearestMorph) {
          nearestMorph = morph;
          nearest = entry;
          nearestAway = away;
        }

        const avatar = entry.kind === "avatar";
        const w = avatar ? row.avatarSize : row.cardWidth;
        const h = avatar ? row.avatarSize : row.cardHeight;
        const circle = avatar ? row.avatarSize : row.circle;
        const scale = 1 + (row.lensSize / circle - 1) * morph;
        const sideInset = (morph * (w - circle)) / 2;
        const topInset = (morph * (h - circle)) / 2;
        const radius = 14 + (circle / 2 - 14) * morph;
        const topRight = (circle / 2) * morph;                      // фирменный острый угол, пока это не круг
        card.el.style.transform =
          "translate3d(" + (row.width / 2 + d * row.pitch) + "px," + row.rowHeight / 2 + "px,0) scale(" + scale + ")";
        card.image.style.clipPath =
          "inset(" + topInset + "px " + sideInset + "px " + topInset + "px " + sideInset + "px round " +
          radius + "px " + topRight + "px " + radius + "px " + radius + "px)";
      });

      // Подпись под кружком — как у актуальных в профиле
      const text = nearest ? nearest.item.title.split(" · ")[0] : "";
      if (row.label.textContent !== text) row.label.textContent = text;

      // Кружок и подпись появляются, только когда круг уже почти в центре: кружок не ложится
      // на проезжающую картинку и при появлении немного увеличивается
      const settled = Math.max(0, Math.min(1, (0.1 - nearestAway) / 0.08));
      row.label.style.opacity = settled;
      row.lens.style.opacity = settled;
      row.lens.style.transform = "scale(" + (0.86 + 0.14 * settled) + ")";
    });
  }

  // Расставить карточки. Уехавшая за край карточка освобождается и получает другую работу
  function placeWall() {
    wallColumns.forEach((column) => {
      column.entries.forEach((entry) => {
        const position = entry.top + column.offset;
        const y = ((position % column.length) + column.length) % column.length - column.margin;
        const inView = y < column.viewHeight + column.margin;
        let card = column.active.get(entry);
        if (inView && !card) {
          card = takeWallCard(column, entry);
          column.active.set(entry, card);
        } else if (!inView && card) {
          card.el.style.visibility = "hidden";
          column.free[entry.kind].push(card);
          column.active.delete(entry);
          card = null;
        }
        if (card) card.el.style.transform = "translate3d(0," + y + "px,0)";
      });
    });
  }

  function runWall(now) {
    const seconds = Math.min((now - wallLastTime) / 1000, 0.05);  // после паузы вкладки лента не прыгает
    wallLastTime = now;
    wallSpeed += (wallSpeedTarget - wallSpeed) * Math.min(seconds * 6, 1);  // плавный разгон и торможение
    if (lightbox.classList.contains("is-open")) {
      // Пока работа открыта большой, колонки стоят
    } else if (wallMode === "lens") {
      if (!lensDrag) wallPhase += (seconds * wallSpeed) / LENS_PERIOD;
      placeLens();
    } else {
      wallColumns.forEach((column) => {
        column.offset += column.direction * column.speed * wallSpeed * seconds;
      });
      placeWall();
    }
    wallFrame = requestAnimationFrame(runWall);
  }


  // 2026-11-17: перемешать работы окна (DAFNA, Reels и Stories) — при каждом открытии по-новому.
  // Сначала самые свежие (месяц берём из подписи «… · Март 2026»), но с разбросом в пару месяцев,
  // чтобы первые экраны каждый раз были разные. Следующую работу выбираем из 10 ближайших по свежести
  // так, чтобы по цвету она сильнее всего отличалась от соседей слева и сверху (колонок 4).
  const MONTHS = ["январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"];
  function itemMonth(item) {
    const m = String(item.title || "").match(/·\s*([А-Яа-яЁё]+)\s+(\d{4})/);
    const month = m ? MONTHS.indexOf(m[1].toLowerCase()) : -1;
    if (!m) return (Number(item.year) || 2000) * 12;
    return Number(m[2]) * 12 + Math.max(0, month);
  }
  function colorGap(a, b) {
    if (!a || !b || !a.c || !b.c) return 0;
    const p = (h) => [1, 3, 5].map((i) => parseInt(h.c.substr(i, 2), 16));
    const [r1, g1, b1] = p(a), [r2, g2, b2] = p(b);
    const rm = (r1 + r2) / 2;
    return Math.sqrt((2 + rm / 256) * (r1 - r2) ** 2 + 4 * (g1 - g2) ** 2 + (2 + (255 - rm) / 256) * (b1 - b2) ** 2);
  }
  function mixWall(items) {
    const COLS = 4, LOOK = 10;
    const rest = items
      .map((item) => ({ item, key: itemMonth(item) + Math.random() * 3 }))
      .sort((a, b) => b.key - a.key)
      .map((x) => x.item);
    const out = [];
    while (rest.length) {
      const near = [out[out.length - 1], out[out.length - COLS], out[out.length - COLS + 1], out[out.length - COLS - 1]].filter(Boolean);
      let best = 0, bestScore = -1;
      for (let k = 0; k < Math.min(LOOK, rest.length); k++) {
        const score = near.length ? Math.min(...near.map((n) => colorGap(n, rest[k]))) + Math.random() * 20 : Math.random();
        if (score > bestScore) { bestScore = score; best = k; }
      }
      out.push(rest.splice(best, 1)[0]);
    }
    return out;
  }

  function openReelsWall(items, info, title, groups, instagram) {
    if ((info.mix || []).includes(items[0].format)) items = mixWall(items);   // свой порядок при каждом открытии
    wallItems = items;
    wallInfo = info;
    wallGroups = groups || {};
    wallInstagram = instagram || null;
    wallMode = (info.modes || {})[items[0].format] || "columns";
    wallPhase = 0;
    wallLastFocus = document.activeElement;
    document.getElementById("rw-brand").textContent = info.brand;
    document.getElementById("rw-title").textContent = title;
    // Цвет окна — как у открытого кейса
    wallEl.style.setProperty("--case-accent", modalWindow.style.getPropertyValue("--case-accent"));
    wallEl.classList.add("is-open");
    wallEl.setAttribute("aria-hidden", "false");
    buildWall();
    // Кто отключил анимацию в системе, тому лента не едет сама, но колесо работает
    // У кружка своя скорость: на высокой его не успеть рассмотреть
    // 2026-11-27, его просьба: на телефоне колеса нет — колонки всегда бегут с одной скоростью ×5 (REEL_SPEED_PHONE)
    const onPhone = wallMode !== "lens" && window.matchMedia("(max-width: 640px)").matches;
    const startSpeed = onPhone ? REEL_SPEED_PHONE : info.startSpeed || (wallMode === "lens" ? 1 : REEL_SPEED_START);
    wallSpeed = wallSpeedTarget = wallCalm.matches ? 0 : startSpeed;
    showWallSpeed();
    wallLastTime = performance.now();
    wallFrame = requestAnimationFrame(runWall);
    wallEl.querySelector(".reels-wall__close").focus();
  }

  function closeReelsWall() {
    if (!wallEl.classList.contains("is-open")) return;
    cancelAnimationFrame(wallFrame);
    wallEl.classList.remove("is-open");
    wallEl.setAttribute("aria-hidden", "true");
    wallStream.innerHTML = "";
    wallColumns = [];
    wallRows = [];
    if (wallLastFocus) wallLastFocus.focus();
  }

  function showWallSpeed() {
    document.getElementById("rw-speed").textContent =
      wallSpeedTarget === 0 ? "стоп" : "×" + String(wallSpeedTarget).replace(".", ",");
  }

  // Колесо мыши: вверх — быстрее, вниз — медленнее, до полной остановки.
  // Щелчок колеса — около 100 единиц; у тачпада шаги мельче, и скорость меняется плавнее
  wallEl.addEventListener("wheel", (event) => {
    event.preventDefault();
    const units = event.deltaMode === 1 ? event.deltaY * 33 : event.deltaY;   // колесо «по строкам» — в те же единицы
    const next = wallSpeedTarget - (units / 100) * REEL_SPEED_STEP;
    const lowest = wallMode === "lens" ? LENS_SPEED_MIN : 0;
    const highest = wallMode === "lens" ? LENS_SPEED_MAX : REEL_SPEED_MAX;
    wallSpeedTarget = Math.round(Math.min(highest, Math.max(lowest, next)) * 100) / 100;
    showWallSpeed();
  }, { passive: false });

  // Клик по карточке открывает работу большой (окна с openable; в остальных клики выключены в CSS)
  wallStream.addEventListener("click", (event) => {
    const card = event.target.closest(".reel, .hl-card");
    if (card) openLightbox(wallItems, Number(card.dataset.index), wallInstagram);
  });

  // «Актуальные»: ряды можно тянуть пальцем влево и вправо (2026-11-27, его просьба). Ряд идёт за пальцем,
  // второй ряд, как и раньше, движется навстречу. Отпустил — лента едет дальше сама. После протяжки клик не открывает работу
  let lensDrag = null;
  let lensDragged = false;
  wallStream.addEventListener("pointerdown", (event) => {
    if (wallMode !== "lens" || event.pointerType === "mouse") return;
    const row = wallRows.find((r) => {
      const box = r.lens.parentElement.getBoundingClientRect();
      return event.clientY >= box.top && event.clientY <= box.bottom;
    }) || wallRows[0];
    if (!row) return;
    lensDrag = { x: event.clientX, phase: wallPhase, row, id: event.pointerId };
    lensDragged = false;
  });
  wallStream.addEventListener("pointermove", (event) => {
    if (!lensDrag || event.pointerId !== lensDrag.id) return;
    const dx = event.clientX - lensDrag.x;
    if (Math.abs(dx) > 8) lensDragged = true;
    // карточка стоит в d * pitch от центра, d растёт вместе с direction * фаза — отсюда знак
    wallPhase = lensDrag.phase + (dx / lensDrag.row.pitch) * lensDrag.row.direction;
    placeLens();
  });
  const lensDrop = (event) => {
    if (!lensDrag || event.pointerId !== lensDrag.id) return;
    // доводим до ближайшего целого шага, чтобы картинка встала в кружок, а не застряла между
    const shift = lensDrag.row.phaseShift;
    wallPhase = Math.round(wallPhase + shift) - shift;
    lensDrag = null;
    placeLens();
  };
  wallStream.addEventListener("pointerup", lensDrop);
  wallStream.addEventListener("pointercancel", lensDrop);
  wallStream.addEventListener("click", (event) => {
    if (lensDragged) { event.stopImmediatePropagation(); event.preventDefault(); lensDragged = false; }
  }, true);

  wallEl.querySelectorAll("[data-rw-close]").forEach((el) => el.addEventListener("click", closeReelsWall));
  wallEl.addEventListener("contextmenu", (event) => event.preventDefault()); // без меню «сохранить картинку»

  // Esc закрывает сначала окно Reels, а не весь кейс
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && wallEl.classList.contains("is-open")) {
      closeReelsWall();
      event.stopPropagation();
    }
  }, true);

  // Размер окна изменился — пересобираем колонки под новую ширину
  let wallResizeTimer = null;
  window.addEventListener("resize", () => {
    if (!wallEl.classList.contains("is-open")) return;
    clearTimeout(wallResizeTimer);
    wallResizeTimer = setTimeout(buildWall, 200);
  });


  /* ---------- 15. Инфографика: веер слайдов и барабан карточек ----------
     Данные — window.INFOGRAPHIC (файл data/infographic.js).
     Веер: слайды одного товара стоят в ряд, к краям всё мельче, цвет товара меняется волной
     (карточки по очереди переворачиваются). Клик по центральной карточке открывает её большой.
     Барабан: главные карточки стоят на внутренней стенке цилиндра, он крутится сам
     и от перетаскивания. Клик без перетаскивания открывает карточку большой, барабан на это время стоит. */
  const DRUM_CLICK_MOVE = 6;   // сдвиг мыши в px, после которого это уже перетаскивание, а не клик
  const IG_STEP_X = 50;       // сдвиг соседней карточки веера, % её ширины
  const IG_SHRINK = 0.16;      // насколько мельче каждая следующая карточка к краю
  const DRUM_PANELS = 18;      // карточек в одном кольце барабана
  const DRUM_ROWS = 2;         // колец барабана
  const DRUM_SPEED = 3.5;      // скорость вращения барабана, градусов в секунду
  const DRUM_FILTERS = [
    { key: "all",     label: "Все",              short: "Все" },
    { key: "chair",   label: "Кресла",           short: "Кресла" },
    { key: "table",   label: "Столы и хранение", short: "Столы" },
    { key: "stool",   label: "Стулья",           short: "Стулья" },
    { key: "soft",    label: "Мягкая мебель",    short: "Мягкая" },
  ];
  const igCalm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function initInfographic(root) {
    const data = window.INFOGRAPHIC;
    if (!data) return;
    root.querySelectorAll("[data-ig-fan]").forEach((box) => buildFan(box, data));
    root.querySelectorAll("[data-ig-drum]").forEach((box) => buildDrum(box, data.covers));
  }

  // Загрузить картинки заранее, чтобы смена цвета шла без пустых карточек (но не ждать дольше 1,5 с)
  function igPreload(urls) {
    const loading = urls.map((url) => {
      const image = new Image();
      image.src = url;
      return image.decode().catch(() => {});
    });
    return Promise.race([
      Promise.all(loading),
      new Promise((resolve) => setTimeout(resolve, 1500)),
    ]);
  }

  function buildFan(box, data) {
    box.innerHTML =
      '<div class="smm-gallery__head">' +
        '<h4 class="smm-gallery__title">Наборы карточек</h4>' +
        '<p class="ig-hint">Листайте слайды, меняйте цвет товара, а центральную карточку откройте нажатием</p>' +
      "</div>" +
      '<div class="ig-stage" tabindex="0" aria-label="Слайды товара: стрелки влево и вправо листают">' +
        '<span class="ig-stage__glow"></span>' +
        '<div class="ig-deck"></div>' +
      "</div>" +
      '<div class="ig-bar">' +
        '<div class="ig-bar__title"><b></b><span></span></div>' +
        '<div class="ig-bar__slide"><span class="ig-bar__label"></span><span class="ig-dots"></span></div>' +
        '<div class="ig-swatches"></div>' +
      "</div>" +
      '<div class="ig-models"></div>';

    const stage = box.querySelector(".ig-stage");
    const deck = box.querySelector(".ig-deck");
    const titleName = box.querySelector(".ig-bar__title b");
    const titleType = box.querySelector(".ig-bar__title span");
    const slideLabel = box.querySelector(".ig-bar__label");
    const dots = box.querySelector(".ig-dots");
    const swatches = box.querySelector(".ig-swatches");
    const models = box.querySelector(".ig-models");

    let series = data.series[0];
    let color = series.colors[0];
    let active = 0;
    let cards = [];
    let loadToken = 0;

    const slideUrl = (s, c, i) => data.base + s.id + "/" + c.key + "-" + (i + 1) + ".webp";
    const allSlides = (s, c) => s.slides.map((_, i) => slideUrl(s, c, i));

    // Расстояние карточки от активной по кругу: -2, -1, 0, 1, 2
    function offsetOf(i) {
      const n = series.slides.length;
      const half = Math.floor(n / 2);
      return ((i - active + n + half) % n) - half;
    }

    // Расставить карточки ровным рядом вокруг активной: центры на одной линии, без наклона
    function placeFan() {
      cards.forEach((card, i) => {
        const d = offsetOf(i);
        const far = Math.abs(d);
        card.style.transform =
          "translate(" + (-50 + d * IG_STEP_X) + "%, -50%) scale(" + (1 - far * IG_SHRINK) + ")";
        card.style.zIndex = 5 - far;
        card.style.setProperty("--dim", far * 0.22);
        card.classList.toggle("is-active", d === 0);
      });
      slideLabel.textContent = series.slides[active];
      [...dots.children].forEach((dot, i) => dot.classList.toggle("is-active", i === active));
    }

    function goTo(i) {
      const n = series.slides.length;
      active = (i + n) % n;
      placeFan();
    }

    function buildDots() {
      dots.innerHTML = "";
      series.slides.forEach((label, i) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "ig-dot";
        dot.setAttribute("aria-label", label);
        dot.addEventListener("click", () => goTo(i));
        dots.appendChild(dot);
      });
    }

    function buildSwatches() {
      swatches.innerHTML = '<span class="ig-swatches__label"></span>';
      swatches.hidden = series.colors.length < 2; // один цвет — выбирать нечего
      series.colors.forEach((c) => {
        const swatch = document.createElement("button");
        swatch.type = "button";
        swatch.className = "ig-swatch";
        swatch.style.setProperty("--swatch", c.swatch);
        swatch.setAttribute("aria-label", c.label);
        swatch.addEventListener("pointerenter", () => igPreload(allSlides(series, c)));
        swatch.addEventListener("click", () => setColor(c));
        swatches.appendChild(swatch);
      });
      markSwatch();
    }

    function markSwatch() {
      swatches.querySelector(".ig-swatches__label").textContent = color.label;
      [...swatches.querySelectorAll(".ig-swatch")].forEach((el, i) => {
        el.classList.toggle("is-active", series.colors[i] === color);
      });
      stage.style.setProperty("--glow", color.glow);
    }

    // Новый товар: старые карточки уходят, новые разлетаются из центра
    async function setSeries(next) {
      const token = ++loadToken;
      [...models.children].forEach((el, i) => el.classList.toggle("is-active", data.series[i] === next));
      const button = models.children[data.series.indexOf(next)];
      models.scrollTo({ left: button.offsetLeft - (models.clientWidth - button.offsetWidth) / 2, behavior: igCalm ? "auto" : "smooth" });
      await igPreload(allSlides(next, next.colors[0]));
      if (token !== loadToken) return; // пока грузилось, выбрали другой товар

      series = next;
      color = next.colors[0];
      active = 0;
      titleName.textContent = next.name;
      titleType.textContent = next.type;
      deck.innerHTML = "";
      cards = next.slides.map((label, i) => {
        const card = document.createElement("div");
        card.className = "ig-card";
        card.innerHTML = '<div class="ig-card__flip"><img alt="" draggable="false"></div>';
        const image = card.querySelector("img");
        image.alt = next.name + " — " + label;
        image.src = slideUrl(next, color, i);
        card.addEventListener("click", () => {
          if (swiped) return;
          if (i !== active) goTo(i);
          else openLightbox(series.slides.map((slide, s) => (
            { format: "3x4", title: series.name + " — " + slide, full: slideUrl(series, color, s) }
          )), active);
        });
        deck.appendChild(card);
        return card;
      });
      buildDots();
      buildSwatches();
      placeFan();
      if (!igCalm) {
        cards.forEach((card, i) => {
          card.firstChild.animate(
            [{ opacity: 0, transform: "translateY(16%) scale(0.92)" }, { opacity: 1, transform: "none" }],
            { duration: 640, delay: Math.abs(offsetOf(i)) * 70, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "backwards" }
          );
        });
      }
    }

    // Новый цвет: карточки по очереди переворачиваются и показывают товар в этом цвете
    async function setColor(next) {
      if (next === color) return;
      color = next;
      markSwatch();
      await igPreload(allSlides(series, next));
      cards.forEach((card, i) => {
        const showNew = () => { card.querySelector("img").src = slideUrl(series, color, i); };
        if (igCalm) { showNew(); return; }
        const flip = card.firstChild;
        const half = flip.animate(
          [{ transform: "perspective(1100px) rotateY(0)" }, { transform: "perspective(1100px) rotateY(90deg)" }],
          { duration: 210, delay: Math.abs(offsetOf(i)) * 80, easing: "ease-in", fill: "both" }
        );
        half.onfinish = () => {
          showNew();
          flip.animate(
            [{ transform: "perspective(1100px) rotateY(-90deg)" }, { transform: "perspective(1100px) rotateY(0)" }],
            { duration: 360, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
          );
          half.cancel();
        };
      });
    }

    // Лента товаров под веером
    data.series.forEach((s) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "ig-model";
      button.innerHTML =
        '<span class="ig-model__cover"><img src="' + data.base + s.id + "/" + s.colors[0].key + '-1-thumb.webp" alt="" loading="lazy" draggable="false"></span>' +
        '<span class="ig-model__name">' + s.name + "</span>";
      button.addEventListener("click", () => setSeries(s));
      models.appendChild(button);
    });

    // Листание: смахнуть веер пальцем или мышью, стрелки на клавиатуре
    let swipeStart = null;
    let swiped = false;
    stage.addEventListener("pointerdown", (event) => {
      swipeStart = event.clientX;
      swiped = false;
    });
    stage.addEventListener("pointerup", (event) => {
      if (swipeStart === null) return;
      const moved = event.clientX - swipeStart;
      swipeStart = null;
      if (Math.abs(moved) > 40) {
        swiped = true;
        goTo(active + (moved < 0 ? 1 : -1));
      }
    });
    stage.addEventListener("pointercancel", () => { swipeStart = null; });
    stage.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight") goTo(active + 1);
      if (event.key === "ArrowLeft") goTo(active - 1);
    });
    box.addEventListener("contextmenu", (event) => event.preventDefault()); // без меню «сохранить картинку»

    setSeries(series);
  }

  function buildDrum(box, covers) {
    box.innerHTML =
      '<div class="smm-gallery__head">' +
        '<h4 class="smm-gallery__title">Главные карточки</h4>' +
        '<div class="smm-gallery__tabs" role="tablist"></div>' +
      "</div>" +
      '<div class="ig-drum__view" tabindex="0" aria-label="Барабан с карточками: стрелки влево и вправо крутят его">' +
        '<span class="ig-drum__hint">Потяните, чтобы покрутить, нажмите, чтобы открыть</span>' +
      "</div>" +
      // 2026-11-27: на телефоне подсказка стоит под барабаном простым текстом и не пропадает (верхняя скрыта в CSS)
      '<p class="ig-drum__note">Потяните, чтобы покрутить, нажмите, чтобы открыть</p>';

    const view = box.querySelector(".ig-drum__view");
    const hint = box.querySelector(".ig-drum__hint");
    const tabs = box.querySelector(".smm-gallery__tabs");
    const stepAngle = 360 / DRUM_PANELS;
    const degPerRad = 180 / Math.PI;
    const autoSpeed = igCalm ? 0 : DRUM_SPEED;

    let pool = covers;
    let theta = 0;              // текущий поворот барабана, градусы
    let speed = autoSpeed;      // скорость сейчас, градусов в секунду
    let radius = 1;
    let panelHeight = 0;
    let panelGap = 0;

    // Кольца и карточки. Панелей мало, картинки в них меняются, пока панель за спиной зрителя
    const rings = [];
    for (let r = 0; r < DRUM_ROWS; r++) {
      const el = document.createElement("div");
      el.className = "ig-drum__ring";
      const panels = [];
      for (let i = 0; i < DRUM_PANELS; i++) {
        const panel = document.createElement("div");
        panel.className = "ig-drum__panel";
        panel.innerHTML = '<img alt="" draggable="false">';
        el.appendChild(panel);
        panels.push({ el: panel, img: panel.firstChild, slot: null });
      }
      view.appendChild(el);
      rings.push({ el, panels });
    }

    // Размеры зависят от ширины окна
    function layout() {
      const width = view.clientWidth;
      const panelWidth = Math.min(210, Math.max(128, width * 0.19));
      panelGap = panelWidth * 0.07;
      panelHeight = panelWidth * 4 / 3;
      radius = (panelWidth + panelGap) * DRUM_PANELS / (2 * Math.PI);
      view.style.perspective = radius * 1.35 + "px";
      view.style.height = panelHeight * DRUM_ROWS + panelGap + 64 + "px";
      rings.forEach((ring, r) => {
        ring.panels.forEach((panel, i) => {
          panel.el.style.width = panelWidth + "px";
          panel.el.style.height = panelHeight + "px";
          panel.el.style.margin = -panelHeight / 2 + "px 0 0 " + -panelWidth / 2 + "px";
          panel.el.style.transform =
            "rotateY(" + (i + r / 2) * stepAngle + "deg) translateZ(" + -radius + "px)";
        });
      });
    }

    // Поставить барабан в текущий поворот и подменить картинки у панелей за спиной
    function draw() {
      rings.forEach((ring, r) => {
        const shift = (r - (DRUM_ROWS - 1) / 2) * (panelHeight + panelGap);
        ring.el.style.transform =
          "translateY(" + shift + "px) translateZ(" + radius + "px) rotateY(" + theta + "deg)";
        ring.panels.forEach((panel, i) => {
          const base = theta + (i + r / 2) * stepAngle;
          const slot = i + DRUM_PANELS * Math.round(-base / 360);
          const seen = Math.abs(base + (slot - i) * stepAngle) < 72;
          panel.el.style.visibility = seen ? "visible" : "hidden";
          if (seen && panel.slot !== slot) {
            panel.slot = slot;
            const n = pool.length;
            panel.index = ((slot * DRUM_ROWS + r) % n + n) % n;
            panel.img.src = pool[panel.index].src;
          }
        });
      });
    }

    // Крутим, только пока барабан виден
    let running = false;
    let lastTime = 0;
    let dragging = false;
    function frame(now) {
      if (!running) return;
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;
      if (!dragging && !lightbox.classList.contains("is-open")) {   // пока карточка открыта большой, барабан стоит
        speed += (autoSpeed - speed) * Math.min(1, dt * 1.6); // после броска плавно возвращаемся к обычной скорости
        theta += speed * dt;
      }
      draw();
      requestAnimationFrame(frame);
    }
    const watcher = new IntersectionObserver((entries) => {
      if (!view.isConnected) {
        running = false;
        watcher.disconnect();
        sizes.disconnect();
        return;
      }
      const visible = entries[entries.length - 1].isIntersecting;
      if (visible && !running) {
        running = true;
        lastTime = performance.now();
        requestAnimationFrame(frame);
      }
      if (!visible) running = false;
    });
    const sizes = new ResizeObserver(() => {
      layout();
      draw();
    });
    sizes.observe(view);
    watcher.observe(view);

    // Перетаскивание: при отпускании барабан ещё катится по инерции
    let dragX = 0;
    let dragStartX = 0;
    let dragTime = 0;
    let dragMoved = false;
    view.addEventListener("pointerdown", (event) => {
      dragging = true;
      dragX = dragStartX = event.clientX;
      dragMoved = false;
      dragTime = event.timeStamp;
      speed = 0;
      view.setPointerCapture(event.pointerId);
      view.classList.add("is-dragging");
      hint.classList.add("is-hidden");
    });
    view.addEventListener("pointermove", (event) => {
      if (!dragging) return;
      if (Math.abs(event.clientX - dragStartX) > DRUM_CLICK_MOVE) dragMoved = true;
      const turn = -(event.clientX - dragX) / radius * degPerRad;
      theta += turn;
      const dt = Math.max(1, event.timeStamp - dragTime) / 1000;
      speed = Math.max(-200, Math.min(200, turn / dt));
      dragX = event.clientX;
      dragTime = event.timeStamp;
    });
    const stopDrag = () => {
      dragging = false;
      view.classList.remove("is-dragging");
    };
    view.addEventListener("pointerup", (event) => {
      stopDrag();
      if (dragMoved) return;
      // Мышь захвачена барабаном, поэтому карточку под ней ищем по координатам
      const hit = document.elementFromPoint(event.clientX, event.clientY);
      const panel = hit && hit.closest(".ig-drum__panel");
      if (!panel) return;
      const found = rings.flatMap((ring) => ring.panels).find((p) => p.el === panel);
      speed = autoSpeed;
      openLightbox(pool.map((cover) => ({ format: "3x4", title: "Карточка товара", full: cover.full })), found.index);
    });
    view.addEventListener("pointercancel", stopDrag);
    view.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight") speed = 70;
      if (event.key === "ArrowLeft") speed = -70;
    });
    box.addEventListener("contextmenu", (event) => event.preventDefault());

    // Фильтр по типу мебели
    DRUM_FILTERS.forEach((filter, i) => {
      const tab = document.createElement("button");
      tab.type = "button";
      tab.className = "smm-tab" + (i === 0 ? " is-active" : "");
      tab.setAttribute("role", "tab");
      tab.innerHTML =
        '<span class="smm-tab__full">' + filter.label + "</span>" +
        '<span class="smm-tab__short">' + filter.short + "</span>";
      tab.addEventListener("click", () => {
        tabs.querySelectorAll(".smm-tab").forEach((t) => t.classList.toggle("is-active", t === tab));
        pool = filter.key === "all" ? covers : covers.filter((cover) => cover.cat === filter.key);
        rings.forEach((ring) => ring.panels.forEach((panel) => { panel.slot = null; }));
        draw(); // 2026-11-23: без затухания
      });
      tabs.appendChild(tab);
    });
  }
});

/* О себе: раскрывающиеся блоки (2026-11-15). Кнопка открывает свой блок, остальные закрываются; повторный клик закрывает */
(function () {
  const buttons = [...document.querySelectorAll(".about-more__btn")];
  buttons.forEach((btn) => btn.addEventListener("click", () => {
    const open = btn.getAttribute("aria-expanded") !== "true";
    buttons.forEach((other) => {
      const on = other === btn && open;
      other.setAttribute("aria-expanded", String(on));
      document.getElementById(other.getAttribute("aria-controls")).hidden = !on;
    });
  }));
})();

/* ---------- Упаковка: переключатель вкусов (2026-11-16) ----------
   Кнопка data-pack-pick показывает панель data-pack с тем же именем, остальные прячет.
   Кейсы вставляются в окно из шаблонов, поэтому слушаем клики на всём документе */
(function () {
  document.addEventListener("click", function (event) {
    const pick = event.target.closest("[data-pack-pick]");
    if (!pick) return;
    const box = pick.closest("[data-pack-switch]");
    box.querySelectorAll("[data-pack-pick]").forEach(function (b) {
      const on = b === pick;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-selected", on ? "true" : "false");
    });
    box.querySelectorAll("[data-pack]").forEach(function (panel) {
      panel.hidden = panel.dataset.pack !== pick.dataset.packPick;
    });
  });
})();

/* ---------- Taqachi: стопка листов брендбука (2026-11-17) ----------
   Разметка: .bb-fly[data-bb-fly] > .bb-fly__src (скрытые кнопки .brand-shot — по ним работает лайтбокс).
   Скрипт строит 3D-сцену: каждый лист — цепочка полосок (.bb-seg), каждая следующая повёрнута
   на свой угол, поэтому лист изгибается волной. Пиксели картинок не читаем (file://).
   2026-11-17 (по его просьбе): сами листы не вылетают — колонка просто парит. Клик по листу открывает обычный
   просмотр сайта с этой страницы (листание по кругу, закрытие кликом по картинке). Код вылета (open/close) оставлен
   на случай, если он захочет вернуть вылет листа */
(function () {
  const SEG = 6;          // полосок в листе
  const FLY = 900;        // полёт туда или обратно, мс
  const SWAP = 520;       // смена страницы свайпом — быстрее, мс
  const SIZE = 0.7;       // вылетевший лист на 30% меньше прежнего (2026-11-17)
  const TILT = 58;        // наклон листа в стопке, градусы
  const PERSP = 1000;     // перспектива сцены, px (то же число в styles.css, .bb-fly)
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const lerp = (a, b, t) => a + (b - a) * t;

  function init(root) {
    if (root._bbFly) return;
    root._bbFly = true;
    const btns = [...root.querySelectorAll(".bb-fly__src .brand-shot")];
    const n = btns.length;
    if (!n) return;
    const RATIO = parseFloat(root.dataset.ratio) || 0.6; // 2026-11-17: та же колонка для Pedant.ru и Kittek Group (16:9 → 0.5625)

    const scene = document.createElement("div");
    scene.className = "bb-fly__scene";
    root.appendChild(scene);

    // Листы: цепочка вложенных полосок, у каждой — кусок картинки и тень сгиба
    const sheets = btns.map((btn, i) => {
      const img = btn.querySelector("img");
      const url = img.getAttribute("src");
      const el = document.createElement("div");
      el.className = "bb-sheet";
      el.title = img.alt;
      let parent = el;
      const segs = [];
      for (let k = 0; k < SEG; k++) {
        const s = document.createElement("div");
        s.className = "bb-seg";
        s.style.backgroundImage = 'url("' + url + '")';
        s.style.backgroundSize = "100% " + SEG * 100 + "%";
        s.style.backgroundPosition = "0 " + (k / (SEG - 1)) * 100 + "%";
        const shade = document.createElement("i");
        s.appendChild(shade);
        parent.appendChild(s);
        parent = s;
        segs.push({ s, shade });
      }
      // Цельная картинка поверх полосок: проявляется, когда лист распрямился, — без швов между полосками
      const face = document.createElement("div");
      face.className = "bb-sheet__face";
      face.style.backgroundImage = 'url("' + url + '")';
      el.appendChild(face);
      scene.appendChild(el);
      return {
        el, segs, btn, i, url,
        amp: 3 + Math.random() * 5,            // сила изгиба, градусы на полоску
        ph: Math.random() * Math.PI * 2,        // фаза волны
        sp: 0.35 + Math.random() * 0.45,        // скорость волны
        freq: 0.6 + Math.random() * 0.7,        // сколько изгибов по листу
        rz: -16 + (Math.random() * 2 - 1) * 7,       // разворот в стопке
        dx: (Math.random() * 2 - 1) * 0.05,     // сдвиг в стопке, доля ширины
        k: 0, dir: 0, fly: FLY,                 // 0 — в стопке, 1 — перед зрителем; fly — длительность полёта
        face,
      };
    });

    // Размеры: колонка растёт вниз — сколько листов, такая и высота плиты (2026-11-17: все 51 страница).
    // Точка взгляда и место вылетевшего листа ездят за серединой экрана, поэтому при прокрутке
    // лист всегда перед глазами, а стопка видна чуть сверху
    let G = null, all = true; // all — расставить все листы, включая те, что за экраном
    function measure() {
      all = true;
      const W = root.clientWidth, phone = W < 700;
      const sw = phone ? W * 0.78 : Math.min(W * 0.36, 400);
      const sh = sw * RATIO;                     // высота/ширина страницы: Taqachi 5:3, презентации 16:9 (data-ratio)
      const gap = sh * (phone ? 0.2 : 0.22);     // шаг листов в колонке
      // запас сверху и снизу — изгибы не обрезаются. 2026-11-27 (его просьба, Kittek): на телефоне запас меньше —
      // над колонкой не остаётся пустого места (колонка не обрезается: overflow-y у .bb-fly виден)
      const padT = sh * (phone ? 0.22 : 0.75), padB = sh * (phone ? 0.6 : 1.1);
      const H = Math.round(padT + gap * (n - 1) + padB);
      root.style.height = H + "px";
      G = { W, H, phone, sw, sh, gap, padT, cx: W * 0.5, z: 260 }; // 2026-11-17: колонка по центру, лист вылетает поверх неё
      sheets.forEach((o) => { o.el.style.width = sw + "px"; o.el.style.height = sh + "px"; });
    }
    measure();
    new ResizeObserver(() => { if (root.clientWidth !== (G && G.W)) measure(); }).observe(root);
    const slotY = (o) => G.padT + G.gap * o.i;

    let cur = -1, hover = false;
    let view = { c: 0, h: 800 };   // середина экрана в координатах плиты и высота экрана
    function open(i, fly) {
      if (cur >= 0 && cur !== i) { sheets[cur].dir = -1; sheets[cur].fly = fly; }
      // Крупно — полноразмерная страница (превью 800 px мылилось бы); пока грузится, под ней превью
      const o = sheets[i];
      if (!o.full) { o.full = true; o.face.style.backgroundImage = 'url("' + o.btn.dataset.full + '"), url("' + o.url + '")'; }
      o.dir = 1; o.fly = fly;
      cur = i;
    }
    function close() {
      if (cur < 0) return;
      sheets[cur].dir = -1; sheets[cur].fly = FLY;
      cur = -1;
    }
    function step(d) { if (cur >= 0) open((cur + d + n) % n, SWAP); }

    // 2026-11-17 (его просьба): клик по листу открывает обычный просмотр сайта (лайтбокс, группа taqachi-bb)
    // с этой страницы — там листание стрелками/свайпом и закрытие кликом по картинке. Сам лист из колонки не вылетает
    root.addEventListener("click", (event) => {
      if (event.target.closest(".bb-fly__src")) return; // это наш же программный клик для лайтбокса
      const el = event.target.closest(".bb-sheet");
      const o = el && sheets.find((s) => s.el === el);
      if (o) o.btn.click();
    });
    root.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      const o = sheets.reduce((m, s) => (Math.abs(slotY(s) - view.c) < Math.abs(slotY(m) - view.c) ? s : m), sheets[0]);
      o.btn.click(); // с клавиатуры — лист у середины экрана
    });
    root.addEventListener("pointermove", (event) => {
      const el = event.target.closest(".bb-sheet");
      const on = !!el && cur >= 0 && sheets[cur].el === el;
      hover = on;
      root.classList.toggle("is-hover-stage", on);
    });
    root.addEventListener("pointerleave", () => {
      hover = false;
      root.classList.remove("is-hover-stage");
    });

    let visible = true;
    new IntersectionObserver((entries) => { visible = entries[0].isIntersecting; }).observe(root);

    let last = performance.now();
    function frame(now) {
      if (!root.isConnected) return; // окно закрыли — сцена выброшена
      requestAnimationFrame(frame);
      const dt = Math.min(now - last, 60);
      last = now;
      if (!visible || !G) return;

      // Точка взгляда и место вылетевшего листа — у середины экрана
      const r = root.getBoundingClientRect();
      const vh = window.innerHeight;
      view = { c: Math.min(Math.max(vh / 2 - r.top, 0), G.H), h: vh };
      // ширина вылетевшего листа: во всю колонку, но целиком помещается в экран по высоте
      const st = Math.min(G.W * (G.phone ? 0.96 : 1), (vh * 0.84) / RATIO) * (G.phone ? 1 : SIZE);
      const sx = G.W * 0.5;
      const half = st * RATIO / 2 + 16;
      const sy = Math.min(Math.max(view.c, half), G.H - half);
      const ox = G.cx, oy = view.c;
      const f = (PERSP - G.z) / PERSP; // поправка на перспективу: ближе — крупнее и дальше от центра
      const stage = { x: ox + (sx - ox) * f - G.sw / 2, y: oy + (sy - oy) * f - G.sh / 2, s: (st / G.sw) * f };
      root.style.perspectiveOrigin = ox.toFixed(1) + "px " + oy.toFixed(1) + "px";

      const t = now / 1000;
      sheets.forEach((o) => {
        const y = slotY(o);
        if (!all && !o.k && !o.dir && Math.abs(y - view.c) > vh * 1.1) return; // далеко за экраном — не трогаем
        if (o.dir) {
          o.k = Math.min(1, Math.max(0, o.k + (o.dir * dt) / o.fly));
          if ((o.dir < 0 && o.k === 0) || (o.dir > 0 && o.k === 1)) o.dir = 0;
        }
        const e = ease(o.k);
        const arc = Math.sin(Math.PI * o.k); // посередине полёта лист поднимается к зрителю
        const bob = reduce ? 0 : Math.sin(t * o.sp * 2 + o.ph) * 3;
        const x0 = G.cx - G.sw / 2 + o.dx * G.sw, y0 = y - G.sh / 2 + bob;
        const x = lerp(x0, stage.x, e);
        const yy = lerp(y0, stage.y, e);
        const z = lerp(0, G.z, e) + arc * 50;   // большой лист в полёте не вылезает за края
        const rx = lerp(TILT, 0, e);
        const rz = lerp(o.rz, 0, e);
        const ry = -arc * 10;
        const s = lerp(1, stage.s, e);
        o.el.style.transform =
          "translate3d(" + x.toFixed(1) + "px," + yy.toFixed(1) + "px," + z.toFixed(1) + "px) rotateX(" + rx.toFixed(2) +
          "deg) rotateY(" + ry.toFixed(2) + "deg) rotateZ(" + rz.toFixed(2) + "deg) scale(" + s.toFixed(4) + ")";
        o.el.classList.toggle("is-out", o.i === cur && o.k > 0.5);

        // Изгиб: волна бежит по листу; вылетевший лист распрямляется
        const amp = o.amp * (1 - e) * (reduce ? 0.5 : 1);
        let cum = 0;
        o.segs.forEach((g, k) => {
          const a = k === 0 ? 0 : amp * Math.sin(o.ph + (reduce ? 0 : t * o.sp) + k * o.freq);
          cum += a;
          if (k) g.s.style.transform = "rotateX(" + a.toFixed(2) + "deg)";
          g.shade.style.opacity = (Math.min(Math.abs(cum) / 40, 1) * 0.45 * (1 - e)).toFixed(3);
        });
        o.face.style.opacity = Math.min(1, Math.max(0, (e - 0.82) / 0.14)).toFixed(3);
      });
      all = false;
    }
    requestAnimationFrame(frame);
  }

  function scan() { document.querySelectorAll("[data-bb-fly]").forEach(init); }
  const body = document.getElementById("modal-body");
  if (body) new MutationObserver(scan).observe(body, { childList: true });
  scan();
})();

/* ---------- Taqachi: стихии (2026-11-17) ----------
   Миниатюра [data-el-pick] показывает свою большую картинку [data-el] и меняет подпись [data-el-cap] */
(function () {
  document.addEventListener("click", function (event) {
    const pick = event.target.closest("[data-el-pick]");
    if (!pick) return;
    const box = pick.closest("[data-el-view]");
    box.querySelectorAll("[data-el-pick]").forEach(function (b) {
      const on = b === pick;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-selected", on ? "true" : "false");
    });
    box.querySelectorAll("[data-el]").forEach(function (shot) {
      shot.hidden = shot.dataset.el !== pick.dataset.elPick;
    });
    const cap = box.querySelector("[data-el-cap]");
    cap.innerHTML = "";
    const name = document.createElement("span");
    name.textContent = pick.dataset.name;
    cap.append(name, pick.dataset.slogan);
  });
})();

/* ---------- Наезды разделов (2026-11-23, его просьба; переделано в тот же день) ----------
   Страница обычная, разделы минимум на весь экран (styles.css, «РАЗДЕЛЫ НАЕЗЖАЮТ…»).
   Колёсико на компьютере: один щелчок — следующий раздел наезжает снизу, вверх — предыдущий сверху.
   Как сделан наезд: прокрутка идёт сама, а текущий раздел на это время сдвигаем ровно навстречу
   (transform) — он стоит на месте, новый проезжает поверх. В конце сдвиг снимается, старый раздел
   уже за экраном: прилипших слоёв нет, обезьянка и меню видят только видимое.
   Внутри длинного раздела («Проекты», «Обо мне») колёсико крутит сам скрипт и останавливается
   точно на краю раздела — браузерная плавная докрутка больше не проскакивает в соседний раздел.
   Если прокрутку остановили между разделами (полоса прокрутки, клавиши) — страница доезжает
   до ближайшего целого раздела. */
(function () {
  const secs = [...document.querySelectorAll("main > section.section")];
  if (!secs.length) return;
  const html = document.documentElement;
  const topOf = (s) => s.getBoundingClientRect().top + window.scrollY;
  const locked = () => document.body.classList.contains("is-locked");

  // Ссылки на разделы (#works, «Наверх»…): плавно к началу раздела
  document.addEventListener("click", (event) => {
    const a = event.target.closest && event.target.closest("a[href^=\"#\"]");
    if (!a || event.defaultPrevented) return;
    const id = a.getAttribute("href").slice(1);
    const sec = secs.find((s) => s.id === id);
    if (!sec) return;
    event.preventDefault();
    glide(sec === secs[0] ? 0 : Math.round(topOf(sec)));
    if (history.replaceState) history.replaceState(null, "", "#" + id);
  });

  const desktop = !window.matchMedia("(hover: none), (prefers-reduced-motion: reduce)").matches;
  // На телефоне — обычная плавная прокрутка браузера
  function glide(y) {
    if (!desktop) { window.scrollTo({ top: y, behavior: "smooth" }); return; }
    scrollAnim(y, 700);
  }
  if (!desktop) return;

  html.style.scrollBehavior = "auto";           // плавность делаем сами — браузерная мешала (застревания)
  html.classList.add("is-pager");

  // «Проекты» — в один экран: ряды карточек ниже, если окно невысокое (от 150 до 280 px)
  const works = document.getElementById("works");
  const wGrid = works && works.querySelector(".works-grid");
  function fitWorks() {
    if (!wGrid) return;
    html.style.setProperty("--wk-row", "280px");
    const over = works.scrollHeight - window.innerHeight;
    const rows = Math.max(1, Math.round((wGrid.offsetHeight + 16) / 296));
    if (over > 0) html.style.setProperty("--wk-row", Math.max(150, Math.floor(280 - over / rows)) + "px");
  }
  fitWorks();
  window.addEventListener("resize", fitWorks);
  if (document.fonts) document.fonts.ready.then(fitWorks);
  works && works.addEventListener("click", (e) => { if (e.target.closest(".pill")) requestAnimationFrame(fitWorks); });
  const DUR = 850;                              // время наезда, мс
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  let busy = false;                             // идёт наезд
  let quietUntil = 0;                           // после наезда гасим хвост инерции колёсика/тачпада
  let anim = 0;                                 // номер текущей анимации прокрутки (новая отменяет старую)
  let edgeLock = false;                         // дошли до края длинного раздела — наезд только со следующего жеста
  let lastWheel = 0;

  // Плавная прокрутка без наезда (внутри длинного раздела, по ссылкам, доводка)
  let target = null;
  function scrollAnim(y, dur) {
    const id = ++anim, from = window.scrollY, d = y - from, t0 = performance.now();
    target = y;
    if (Math.abs(d) < 1) { target = null; return; }
    (function frame(now) {
      if (id !== anim) return;
      const k = Math.min(1, (now - t0) / dur);
      window.scrollTo(0, Math.round(from + d * (1 - Math.pow(1 - k, 3))));
      if (k < 1) requestAnimationFrame(frame); else target = null;
    })(t0);
  }

  // Наезд: cur стоит на месте, next проезжает поверх; to — куда в итоге встанет прокрутка
  function slide(cur, next, to) {
    const id = ++anim, from = window.scrollY, d = to - from, t0 = performance.now();
    busy = true;
    target = null;
    window.dispatchEvent(new CustomEvent("section-slide", { detail: { dir: d > 0 ? 1 : -1, dur: DUR, cur, next, to } }));  // обезьянка ждёт, когда до неё доедет край next
    cur.classList.add("is-under");
    next.classList.add(d > 0 ? "is-over-up" : "is-over-down");
    const finish = () => {
      cur.style.transform = "";
      cur.classList.remove("is-under");
      next.classList.remove("is-over-up", "is-over-down");
      window.scrollTo(0, to);
      busy = false;
      quietUntil = performance.now() + 300;
      window.dispatchEvent(new Event("section-slide-end"));
      window.dispatchEvent(new Event("scroll"));  // меню и обезьянка пересчитывают места по итогу
    };
    (function frame(now) {
      if (id !== anim) { finish(); return; }
      const k = Math.min(1, (now - t0) / DUR);
      window.scrollTo(0, Math.round(from + d * ease(k)));
      // сдвиг ровно на столько, на сколько уже прокрутили — раздел визуально стоит
      cur.style.transform = "translate3d(0," + (window.scrollY - from) + "px,0)";
      if (k < 1) requestAnimationFrame(frame); else finish();
    })(t0);
  }

  // Где мы: раздел, в котором верх экрана, и его границы
  function where() {
    const y = window.scrollY, T = secs.map(topOf);
    let i = 0;
    T.forEach((t, k) => { if (t <= y + 2) i = k; });
    return { y, T, i, top: T[i], bottom: T[i] + secs[i].offsetHeight };
  }

  function step(dir, px) {
    const vh = window.innerHeight;
    const base = target !== null ? target : window.scrollY;   // копим щелчки во время прокрутки
    const { T, i, top, bottom } = where();
    if (dir > 0) {
      if (bottom - (base + vh) > 2) {                          // длинный раздел ещё не досмотрен
        const y = Math.min(base + px, bottom - vh);
        if (y >= bottom - vh - 1) edgeLock = true;
        scrollAnim(Math.round(y), 320);
        return true;
      }
      if (i + 1 >= secs.length) return false;                  // после последнего — подвал, как обычно
      if (edgeLock || target !== null) return true;
      slide(secs[i], secs[i + 1], Math.round(T[i + 1]));
      return true;
    }
    if (base - top > 2) {                                      // внутри длинного раздела — вверх до его верха
      const y = Math.max(base - px, top);
      if (y <= top + 1) edgeLock = true;
      scrollAnim(Math.round(y), 320);
      return true;
    }
    if (i === 0) return false;
    if (edgeLock || target !== null) return true;
    slide(secs[i], secs[i - 1], Math.round(Math.max(T[i - 1], top - vh)));
    return true;
  }

  window.addEventListener("wheel", (event) => {
    if (event.ctrlKey || locked()) return;
    if (event.target.closest && event.target.closest(".modal, .lightbox, .reels-wall")) return;
    if (Math.abs(event.deltaY) < Math.abs(event.deltaX)) return;
    const now = performance.now();
    if (now - lastWheel > 220) edgeLock = false;               // пауза в колёсике — новый жест
    lastWheel = now;
    if (busy || now < quietUntil) { event.preventDefault(); return; }
    if (!event.deltaY) return;
    let px = Math.abs(event.deltaY) * (event.deltaMode === 1 ? 40 : event.deltaMode === 2 ? window.innerHeight : 1);
    px = Math.min(Math.max(px, 60), 400);
    if (step(Math.sign(event.deltaY), px)) event.preventDefault();
  }, { passive: false });

  // Клавиши: стрелки, PageUp/PageDown, пробел — так же, как колёсико
  window.addEventListener("keydown", (event) => {
    if (locked() || event.altKey || event.ctrlKey || event.metaKey) return;
    const t = event.target;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
    const k = event.key;
    const dir = k === "ArrowDown" || k === "PageDown" || (k === " " && !event.shiftKey) ? 1
      : k === "ArrowUp" || k === "PageUp" || (k === " " && event.shiftKey) ? -1 : 0;
    if (!dir) return;
    if (busy) { event.preventDefault(); return; }
    edgeLock = false;
    if (step(dir, k.startsWith("Arrow") ? 120 : window.innerHeight * 0.8)) event.preventDefault();
  });

  // Доводка: остановились между разделами (полоса прокрутки, кнопка мыши) — доезжаем до целого раздела
  let idleT = 0;
  window.addEventListener("scroll", () => {
    clearTimeout(idleT);
    idleT = setTimeout(() => {
      if (busy || target !== null || locked()) return;
      const vh = window.innerHeight, { y, T, i, bottom } = where();
      if (i + 1 >= secs.length) return;
      const over = y + vh - bottom;                            // сколько видно следующего раздела
      if (over <= 2 || y - T[i] < 0) return;
      glide(Math.round(over < vh / 2 ? bottom - vh : T[i + 1]));
    }, 260);
  }, { passive: true });
})();


/* ---------- Копирование почты (2026-11-23, его просьба) ----------
   Клик по почте в контактах не открывает почтовую программу, а копирует адрес.
   Работает и при открытии файла двойным кликом (file://): если буфер обмена недоступен — запасной способ через выделение */
(function () {
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    const hint = btn.querySelector(".contact-link__hint");
    let t = 0;
    btn.addEventListener("click", async () => {
      const text = btn.dataset.copy;
      let ok = false;
      try { await navigator.clipboard.writeText(text); ok = true; } catch (e) {
        const ta = document.createElement("textarea");
        ta.value = text; ta.setAttribute("readonly", ""); ta.style.cssText = "position:fixed;left:-9999px;top:0";
        document.body.appendChild(ta); ta.select();
        try { ok = document.execCommand("copy"); } catch (e2) { ok = false; }
        ta.remove();
      }
      if (!hint) return;
      hint.textContent = ok ? "скопировано ✓" : "выделите и скопируйте";
      btn.classList.toggle("is-copied", ok);
      clearTimeout(t);
      t = setTimeout(() => { hint.textContent = hint.dataset.hint; btn.classList.remove("is-copied"); }, 2200);
    });
  });
})();
