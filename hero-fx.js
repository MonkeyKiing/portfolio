/* ==========================================================================
   ЖИВАЯ ШАПКА (2026-11-15, картинка обновлена 2026-11-16): ночной город на его картинке оживает
   - рекламные экраны на зданиях показывают меняющиеся ролики;
   - летающие машины пролетают мимо и уходят вдаль;
   - бьёт молния, небо и город вспыхивают;
   - мигают красные огни на шпилях.
   Огни окон и зелёная подсветка мыши «дышат» отдельными слоями в CSS (.hero-fx).

   Всё рисуется в координатах исходной картинки 2538 × 1039 и пересчитывается
   так же, как фото (object-fit: cover + object-position), поэтому экраны всегда
   стоят точно на своих местах.
   Пиксели картинок скрипт не читает: сайт открывается и файлом с диска (file://),
   а там чтение пикселей запрещено. Картинки только рисуются поверх друг друга.
   ========================================================================== */
(() => {
  "use strict";

  const scene = document.querySelector(".hero__scene");
  const fxCanvas = scene && scene.querySelector(".hero__fx");
  const lightCanvas = scene && scene.querySelector(".hero__light");
  const photo = scene && scene.querySelector(".hero__photo");
  if (!fxCanvas || !lightCanvas || !photo) return;

  let ctx = fxCanvas.getContext("2d");      // экраны, корпуса машин — обычное наложение
  let lctx = lightCanvas.getContext("2d");  // свет: вспышки, ореолы, фары — слой «экран» (screen)
  const IW = 2538, IH = 1039;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const rnd = (a, b) => a + Math.random() * (b - a);
  const hash = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const clamp01 = (v) => Math.max(0, Math.min(1, v));
  const smooth = (a, b, v) => { const t = clamp01((v - a) / (b - a)); return t * t * (3 - 2 * t); };

  /* ---------- Пересчёт координат картинки в координаты холста ---------- */
  let cw = 0, ch = 0, dpr = 1, scale = 1, ox = 0, oy = 0;
  function layout() {
    const r = scene.getBoundingClientRect();
    cw = r.width; ch = r.height;
    if (!cw || !ch) return;
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    for (const c of [fxCanvas, lightCanvas]) {
      c.width = Math.round(cw * dpr);
      c.height = Math.round(ch * dpr);
    }
    scale = Math.max(cw / IW, ch / IH);
    const pos = getComputedStyle(photo).objectPosition.split(" ");
    const px = parsePct(pos[0]), py = parsePct(pos[1]);
    ox = (cw - IW * scale) * px;
    oy = (ch - IH * scale) * py;
    flashCache.clear();
    placeBeaconCanvas();
  }
  function parsePct(v) {
    if (!v) return 0.5;
    if (v.endsWith("%")) return parseFloat(v) / 100;
    if (v === "left" || v === "top") return 0;
    if (v === "right" || v === "bottom") return 1;
    return 0.5;
  }
  const toImage = (c) => c.setTransform(dpr * scale, 0, 0, dpr * scale, dpr * ox, dpr * oy);

  /* ==========================================================================
     1. РЕКЛАМНЫЕ ЭКРАНЫ
     x, y, w, h — место экрана на картинке (замерено по исходнику).
     slides — что показывает экран по очереди; смена через «глитч».
     ========================================================================== */
  const KATA = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワン0123456789";
  const WORDS = ["DESIGN", "BRAND", "SMM", "AI", "2026"];
  const BOARDS = [
    { x: 75, y: 287, w: 95, h: 48, c1: "#19e6ff", c2: "#ff3fd2", bg: "#041a26",
      slides: [{ k: "ticker", text: "ALEXANDER VOLVAKH · GRAPHIC DESIGNER · ", sub: "PORTFOLIO 2026 · BRANDING · SMM · " }, { k: "big" }] },
    { x: 88, y: 397, w: 89, h: 148, c1: "#2ff3ff", c2: "#9b5cff", bg: "#03141c",
      slides: [{ k: "glyphs" }, { k: "rings", text: "AV" }] },
    { x: 185, y: 452, w: 62, h: 166, c1: "#ff4fd8", c2: "#8a5bff", c3: "#ffd36a", bg: "#1a0626",
      slides: [{ k: "wave" }, { k: "vtext", words: ["デザイン", "NEON"] }] },
    { x: 590, y: 190, w: 55, h: 55, c1: "#3ff8ff", c2: "#ffffff", bg: "#03303a",
      slides: [{ k: "rings", text: "AV" }, { k: "big", words: ["AI", "SMM", "AV"] }] },
    { x: 583, y: 280, w: 45, h: 110, c1: "#3ff8ff", c2: "#2b8cff", bg: "#032229",
      slides: [{ k: "eq" }, { k: "glyphs" }] },
    { x: 390, y: 375, w: 50, h: 25, c1: "#e9fbff", c2: "#3ff8ff", bg: "#0a3a48",
      slides: [{ k: "big", words: ["OPEN", "24/7", "NEON"] }] },
    { x: 775, y: 388, w: 33, h: 80, c1: "#ffb35c", c2: "#ff5d8f", c3: "#fff2c9", bg: "#2a1206",
      slides: [{ k: "wave" }, { k: "vtext", words: ["SMM", "ART"] }] },
    { x: 715, y: 497, w: 30, h: 73, c1: "#ff4fd8", c2: "#ff9a3c", bg: "#22051e",
      slides: [{ k: "eq" }, { k: "vtext", words: ["ネオン"] }] },
    { x: 1052, y: 313, w: 88, h: 27, c1: "#ffb020", c2: "#ff6a00", bg: "#1a0b00",
      slides: [{ k: "sign", text: "NEON 24" }] },
    { x: 1037, y: 500, w: 113, h: 40, c1: "#ff4fd8", c2: "#4fa8ff", bg: "#0c0a3a",
      slides: [{ k: "ticker", text: "BRANDING · SMM · INFOGRAPHICS · PACKAGING · ", sub: "ALEXANDER VOLVAKH · " }, { k: "big", words: ["PORTFOLIO", "2026", "DESIGN"] }] },
    { x: 1315, y: 427, w: 53, h: 165, c1: "#3ff8ff", c2: "#ff3fd2", c3: "#8a5bff", bg: "#0b0830",
      clip: [[0, 0], [53, 0], [53, 132], [36, 144], [24, 165], [0, 165]],
      slides: [{ k: "wave" }, { k: "vtext", words: ["VOLVAKH", "AI"] }, { k: "glyphs" }] },
    { x: 876, y: 176, w: 59, h: 22, c1: "#7fd8ff", c2: "#ffffff", bg: "#06213d",
      slides: [{ k: "ticker", text: "GRAPHIC DESIGN · " }] },
    { x: 1285, y: 267, w: 105, h: 14, c1: "#62e6ff", c2: "#ffffff", bg: "#061a4a",
      slides: [{ k: "ticker", text: "ALEXANDER VOLVAKH · 18 YEARS OF DESIGN · " }] },
    { x: 945, y: 473, w: 22, h: 95, c1: "#ffd27a", c2: "#ff7a3c", bg: "#2b1405",
      slides: [{ k: "vtext", words: ["ネオン", "OPEN"] }, { k: "eq" }] },
    { x: 2110, y: 577, w: 74, h: 77, c1: "#33f0ff", c2: "#2b6cff", bg: "#03202a",
      slides: [{ k: "glyphs" }, { k: "rings", text: "AV" }] },
    { x: 2247, y: 555, w: 47, h: 99, c1: "#ff52d9", c2: "#ff9ad8", bg: "#2a0624",
      slides: [{ k: "eq" }, { k: "vtext", words: ["SALE", "ネオン"] }] },
  ];
  BOARDS.forEach((b, i) => {
    b.period = rnd(5.5, 8.5);
    b.phase = rnd(0, b.period * b.slides.length);
    b.seed = i * 17.3;
  });

  const FONT = '"Arial Black", "Segoe UI Black", Arial, sans-serif';
  const FONT_JP = '"Yu Gothic", "Meiryo", "MS Gothic", "Hiragino Sans", sans-serif';

  function bgFill(c, b, w, h) {
    const g = c.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, b.bg);
    g.addColorStop(1, "#000000");
    c.fillStyle = g;
    c.fillRect(0, 0, w, h);
    // экран светится сам: цветная подложка в тон ролика
    const g2 = c.createLinearGradient(0, 0, w, h);
    g2.addColorStop(0, hexA(b.c1, 0.32));
    g2.addColorStop(1, hexA(b.c2, 0.2));
    c.fillStyle = g2;
    c.fillRect(0, 0, w, h);
  }

  const RENDER = {
    // бегущая строка
    ticker(c, b, s, w, h, t) {
      bgFill(c, b, w, h);
      const two = !!s.sub && h >= 36;
      const fs = two ? h * 0.42 : h * 0.72;
      c.font = `900 ${fs}px ${FONT}`;
      c.textBaseline = "middle";
      const tw = (s._tw ||= c.measureText(s.text).width);
      let x = -((t * fs * 2.2) % tw);
      const gr = c.createLinearGradient(0, 0, w, 0);
      gr.addColorStop(0, b.c1); gr.addColorStop(1, b.c2);
      c.fillStyle = gr;
      const y = two ? h * 0.36 : h * 0.54;
      for (; x < w; x += tw) c.fillText(s.text, x, y);
      if (two) {
        const fs2 = h * 0.24;
        c.font = `700 ${fs2}px ${FONT}`;
        const tw2 = (s._tw2 ||= c.measureText(s.sub).width);
        let x2 = ((t * fs2 * 2.5) % tw2) - tw2;
        c.fillStyle = b.c2;
        c.globalAlpha = 0.85;
        for (; x2 < w; x2 += tw2) c.fillText(s.sub, x2, h * 0.77);
        c.globalAlpha = 1;
        c.fillStyle = b.c1;
        c.fillRect(0, h * 0.6, w, Math.max(1, h * 0.03));
      }
    },
    // крупное слово с «ударом» в такт
    big(c, b, s, w, h, t) {
      bgFill(c, b, w, h);
      const words = s.words || WORDS;
      const beat = t * 1.25;
      const word = words[Math.floor(beat) % words.length];
      const p = beat % 1;
      const punch = 1 + 0.18 * Math.exp(-p * 7);
      c.save();
      c.translate(w / 2, h / 2);
      c.scale(punch, punch);
      let fs = h * 0.62;
      c.font = `900 ${fs}px ${FONT}`;
      const mw = c.measureText(word).width;
      if (mw > w * 0.86) { fs *= (w * 0.86) / mw; c.font = `900 ${fs}px ${FONT}`; }
      c.textAlign = "center";
      c.textBaseline = "middle";
      c.fillStyle = Math.floor(beat) % 2 ? b.c1 : b.c2;
      c.shadowColor = b.c1;
      c.shadowBlur = 10 * dpr * scale;
      c.fillText(word, 0, fs * 0.05);
      c.restore();
      // вспышка в начале удара
      c.fillStyle = `rgba(255,255,255,${0.35 * Math.exp(-p * 12)})`;
      c.fillRect(0, 0, w, h);
    },
    // падающие символы
    glyphs(c, b, s, w, h, t) {
      bgFill(c, b, w, h);
      const cols = Math.max(3, Math.round(w / 13));
      const cwid = w / cols;
      const fs = cwid * 1.05;
      c.font = `700 ${fs}px ${FONT_JP}`;
      c.textAlign = "center";
      c.textBaseline = "top";
      for (let i = 0; i < cols; i++) {
        const sp = 18 + hash(b.seed + i) * 34;
        const len = h * 1.5;
        const head = ((t * sp + hash(b.seed + i * 3.1) * len) % len) - h * 0.2;
        for (let j = 0; j < 9; j++) {
          const y = head - j * fs;
          if (y < -fs || y > h) continue;
          const ch = KATA[Math.floor(hash(i * 31 + j * 7 + Math.floor(t * 5 + hash(i)) * 13) * KATA.length)];
          c.globalAlpha = j === 0 ? 1 : 0.85 * (1 - j / 9);
          c.fillStyle = j === 0 ? "#ffffff" : b.c1;
          c.fillText(ch, cwid * (i + 0.5), y);
        }
      }
      c.globalAlpha = 1;
    },
    // расходящиеся кольца и знак AV
    rings(c, b, s, w, h, t) {
      bgFill(c, b, w, h);
      const cx = w / 2, cy = h / 2, R = Math.hypot(w, h) * 0.55;
      c.lineWidth = Math.max(1, Math.min(w, h) * 0.035);
      for (let k = 0; k < 4; k++) {
        const p = (t * 0.45 + k / 4) % 1;
        c.strokeStyle = k % 2 ? b.c2 : b.c1;
        c.globalAlpha = 1 - p;
        c.beginPath(); c.arc(cx, cy, p * R, 0, Math.PI * 2); c.stroke();
      }
      c.globalAlpha = 1;
      const r = Math.min(w, h) * 0.34;
      c.strokeStyle = b.c1;
      c.lineWidth = Math.max(1.2, r * 0.12);
      c.beginPath(); c.arc(cx, cy, r, t * 2.4, t * 2.4 + Math.PI * 1.3); c.stroke();
      c.strokeStyle = b.c2;
      c.beginPath(); c.arc(cx, cy, r * 0.78, -t * 3.1, -t * 3.1 + Math.PI * 0.8); c.stroke();
      const fs = r * 0.95;
      c.font = `900 ${fs}px ${FONT}`;
      c.textAlign = "center"; c.textBaseline = "middle";
      c.fillStyle = "#ffffff";
      c.shadowColor = b.c1; c.shadowBlur = 8 * dpr * scale;
      c.globalAlpha = 0.75 + 0.25 * Math.sin(t * 4);
      c.fillText(s.text || "AV", cx, cy + fs * 0.04);
      c.shadowBlur = 0; c.globalAlpha = 1;
    },
    // эквалайзер
    eq(c, b, s, w, h, t) {
      bgFill(c, b, w, h);
      const tall = h > w * 1.6;
      const n = tall ? Math.max(6, Math.round(h / 9)) : Math.max(6, Math.round(w / 8));
      const gr = tall ? c.createLinearGradient(0, 0, w, 0) : c.createLinearGradient(0, h, 0, 0);
      gr.addColorStop(0, b.c1); gr.addColorStop(1, b.c2);
      c.fillStyle = gr;
      for (let i = 0; i < n; i++) {
        const v = 0.25 + 0.75 * Math.abs(Math.sin(t * (2.1 + hash(b.seed + i) * 3) + i * 0.9) * Math.sin(t * 1.3 + i * 0.37));
        if (tall) {
          const bh = h / n;
          const len = v * w;
          c.fillRect((w - len) / 2, i * bh + bh * 0.18, len, bh * 0.64);
        } else {
          const bw = w / n;
          const len = v * h;
          c.fillRect(i * bw + bw * 0.15, h - len, bw * 0.7, len);
        }
      }
    },
    // переливающиеся волны
    wave(c, b, s, w, h, t) {
      bgFill(c, b, w, h);
      c.globalCompositeOperation = "lighter";
      const cols = [b.c1, b.c2, b.c3 || b.c1];
      for (let k = 0; k < 5; k++) {
        c.fillStyle = cols[k % 3];
        c.globalAlpha = 0.55;
        c.beginPath();
        const amp = w * (0.22 + 0.1 * k);
        const base = w * (0.15 + 0.17 * k);
        c.moveTo(0, 0);
        for (let y = 0; y <= h; y += 4) {
          const x = base + amp * Math.sin(y / h * Math.PI * (1.4 + k * 0.35) + t * (0.9 + k * 0.3) + k);
          c.lineTo(x, y);
        }
        c.lineTo(0, h);
        c.closePath();
        c.fill();
      }
      c.globalAlpha = 1;
      c.globalCompositeOperation = "source-over";
      // бегущий блик
      const y = ((t * 40) % (h * 1.6)) - h * 0.3;
      const g = c.createLinearGradient(0, y - 12, 0, y + 12);
      g.addColorStop(0, "rgba(255,255,255,0)");
      g.addColorStop(0.5, "rgba(255,255,255,0.35)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      c.fillStyle = g;
      c.fillRect(0, y - 12, w, 24);
    },
    // вертикальная неоновая вывеска: буквы зажигаются по очереди
    vtext(c, b, s, w, h, t) {
      bgFill(c, b, w, h);
      const words = s.words || ["NEON"];
      const cyc = 3.2;
      const word = words[Math.floor(t / cyc) % words.length];
      const p = (t % cyc) / cyc;
      const chars = Array.from(word);
      const step = h / (chars.length + 0.6);
      const fs = Math.min(w * 0.82, step * 0.92);
      const jp = /[^\x00-\x7F]/.test(word);
      c.font = `900 ${fs}px ${jp ? FONT_JP : FONT}`;
      c.textAlign = "center"; c.textBaseline = "middle";
      c.shadowColor = b.c1; c.shadowBlur = 9 * dpr * scale;
      chars.forEach((chr, i) => {
        const on = p * (chars.length + 3) > i;
        const flick = hash(Math.floor(t * 14) + i * 9.7) > 0.93 ? 0.35 : 1;
        c.globalAlpha = on ? flick : 0.12;
        c.fillStyle = i % 2 ? b.c2 : b.c1;
        c.fillText(chr, w / 2, step * (i + 0.8));
      });
      c.shadowBlur = 0; c.globalAlpha = 1;
    },
    // неоновая вывеска с мерцающими буквами
    sign(c, b, s, w, h, t) {
      c.fillStyle = b.bg; c.fillRect(0, 0, w, h);
      let fs = h * 0.78;
      c.font = `900 ${fs}px ${FONT}`;
      c.textBaseline = "middle"; c.textAlign = "left";
      const chars = Array.from(s.text);
      let tw = c.measureText(s.text).width;
      if (tw > w * 0.9) { fs *= (w * 0.9) / tw; c.font = `900 ${fs}px ${FONT}`; tw = c.measureText(s.text).width; }
      let x = (w - tw) / 2;
      c.shadowColor = b.c2; c.shadowBlur = 10 * dpr * scale;
      chars.forEach((chr, i) => {
        const broken = i === 2 && hash(Math.floor(t * 9)) > 0.6;
        c.globalAlpha = broken ? 0.2 : 0.92 + 0.08 * Math.sin(t * 30 + i);
        c.fillStyle = i < 4 ? b.c1 : b.c2;
        c.fillText(chr, x, h * 0.55);
        x += c.measureText(chr).width;
      });
      c.shadowBlur = 0; c.globalAlpha = 1;
    },
  };

  function renderSlide(c, b, s, t) {
    c.save();
    RENDER[s.k](c, b, s, b.w, b.h, t);
    c.restore();
  }

  function drawBoard(b, T, noGlow) {
    const t = T + b.phase;
    const n = b.slides.length;
    const idx = Math.floor(t / b.period) % n;
    const local = t % b.period;
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.beginPath();
    if (b.clip) { b.clip.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); }
    else ctx.rect(0, 0, b.w, b.h);
    ctx.clip();

    const GL = 0.45; // длительность глитча при смене ролика, с
    if (n > 1 && local < GL) {
      const prev = b.slides[(idx - 1 + n) % n];
      const cur = b.slides[idx];
      const g = local / GL;
      const bands = 7;
      for (let k = 0; k < bands; k++) {
        const y0 = (b.h / bands) * k;
        const useNew = hash(b.seed + k * 3.7 + Math.floor(local * 30)) < g;
        const jx = (hash(k + Math.floor(local * 40)) - 0.5) * b.w * 0.25 * Math.sin(g * Math.PI);
        ctx.save();
        ctx.beginPath(); ctx.rect(0, y0, b.w, b.h / bands + 0.5); ctx.clip();
        ctx.translate(jx, 0);
        renderSlide(ctx, b, useNew ? cur : prev, t);
        ctx.restore();
      }
      ctx.fillStyle = `rgba(255,255,255,${0.25 * Math.sin(g * Math.PI)})`;
      ctx.fillRect(0, 0, b.w, b.h);
    } else {
      renderSlide(ctx, b, b.slides[idx], t);
    }

    // строки развёртки, виньетка, редкое подмигивание
    ctx.fillStyle = "rgba(0,0,0,0.16)";
    for (let y = 0; y < b.h; y += 3) ctx.fillRect(0, y, b.w, 1);
    const vg = ctx.createRadialGradient(b.w / 2, b.h / 2, Math.min(b.w, b.h) * 0.3, b.w / 2, b.h / 2, Math.hypot(b.w, b.h) * 0.6);
    vg.addColorStop(0, "rgba(0,0,0,0)");
    vg.addColorStop(1, "rgba(0,0,0,0.35)");
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, b.w, b.h);
    if (hash(b.seed + Math.floor(T * 12)) > 0.985) {
      ctx.fillStyle = "rgba(0,0,0,0.45)";
      ctx.fillRect(0, 0, b.w, b.h);
    }
    ctx.restore();

    // свет экрана на стенах вокруг
    if (noGlow) return;
    const cx = b.x + b.w / 2, cy = b.y + b.h / 2;
    const R = Math.max(b.w, b.h) * 0.95;
    const glow = lctx.createRadialGradient(cx, cy, Math.min(b.w, b.h) * 0.3, cx, cy, R);
    const a = 0.22 + 0.06 * Math.sin(T * 2 + b.seed);
    glow.addColorStop(0, hexA(b.c1, a));
    glow.addColorStop(1, hexA(b.c1, 0));
    lctx.fillStyle = glow;
    lctx.fillRect(cx - R, cy - R, R * 2, R * 2);
  }

  function hexA(hex, a) {
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
  }

  /* ==========================================================================
     2. ЛЕТАЮЩИЕ КОРАБЛИ (до 2026-11-16 были машины)
     Трассы проложены так, чтобы не пересекать его фигуру (x ≈ 1290–1830).
     s0 → s1 — размер в начале и в конце: растёт — машина летит на нас и проносится мимо,
     уменьшается — уходит вдаль и тает в дымке.
     ========================================================================== */
  // 2026-11-19: он попросил пока выключить корабли — посмотреть шапку без них. Код не удалён: вернуть — поставить true
  const SHIPS_ON = false;
  const CAR_SCALE = 1.6; // общий размер машин
  const LANES = [
    { from: [980, 330], to: [-320, 140], s0: 0.22, s1: 2.6, dur: 3.4, ease: "in", every: [6, 10], hue: "#22e1ff" },
    { from: [-220, 96], to: [1180, 236], s0: 0.95, s1: 0.2, dur: 9.5, ease: "out", every: [8, 13], hue: "#ff3fd2" },
    { from: [2780, 120], to: [1990, 236], s0: 1.25, s1: 0.18, dur: 6.8, ease: "out", every: [9, 14], hue: "#ffb020" },
    { from: [1930, 305], to: [2780, 70], s0: 0.18, s1: 1.6, dur: 4.4, ease: "in", every: [10, 16], hue: "#8a7bff" },
    { from: [-260, 610], to: [1120, 470], s0: 1.9, s1: 0.3, dur: 7.2, ease: "out", every: [10, 15], hue: "#46e07a" },
    { from: [560, 300], to: [1150, 355], s0: 0.16, s1: 0.32, dur: 11, ease: "lin", every: [4, 9], hue: "#ff5a5a", fadeIn: true },
  ];
  // 2026-11-16: он попросил, чтобы корабли летали постоянно и в разные стороны.
  // Паузы между пролётами короткие, направление на каждой трассе выбирается случайно,
  // а с первого кадра часть кораблей уже в пути — пустого неба не бывает.
  LANES.forEach((l) => { l.every = [0.6, 3]; l.next = rnd(0, 1.5); l.car = null; });
  LANES.forEach((l, i) => { if (i % 2 === 0) l.car = { t0: -rnd(0.15, 0.6) * l.dur, bob: rnd(0, 6), type: ["dart", "saucer", "skiff"][i / 2], rev: Math.random() < 0.5 }; });
  let lastShip = "";

  function laneUpdate(l, T) {
    if (!l.car && T >= l.next) {
      let type;
      do { type = SHIP_TYPES[Math.floor(Math.random() * SHIP_TYPES.length)]; } while (type === lastShip && SHIP_TYPES.length > 1);
      lastShip = type;
      l.car = { t0: T, bob: rnd(0, 6), type, rev: Math.random() < 0.5 };
    }
    if (!l.car) return null;
    const pt = (T - l.car.t0) / l.dur;
    if (pt >= 1) { l.car = null; l.next = T + rnd(l.every[0], l.every[1]); return null; }
    // обратный рейс: та же трасса, пройденная с конца (растущий корабль уходит вдаль и наоборот)
    const p = l.car.rev ? 1 - pt : pt;
    const ez = (v) => (l.ease === "in" ? Math.pow(v, 1.9) : l.ease === "out" ? 1 - Math.pow(1 - v, 1.9) : v);
    const q = ez(p);
    const q2 = ez(Math.max(0, Math.min(1, l.car.rev ? p - 0.01 : p + 0.01)));
    const x = l.from[0] + (l.to[0] - l.from[0]) * q;
    const y = l.from[1] + (l.to[1] - l.from[1]) * q + Math.sin(T * 2 + l.car.bob) * 1.5;
    const vx = (l.to[0] - l.from[0]) * (q2 - q), vy = (l.to[1] - l.from[1]) * (q2 - q);
    const s = (l.s0 + (l.s1 - l.s0) * q) * CAR_SCALE;
    let alpha = 1;
    if (l.s1 < l.s0) alpha *= 1 - smooth(0.78, 1, p);            // уходит вдаль — тает
    if (l.s0 < 0.4 || l.fadeIn) alpha *= smooth(0, 0.12, p);       // появляется из дымки
    const haze = clamp01((s / CAR_SCALE - 0.15) / 0.8);                         // дальние — тусклее
    return { x, y, s, vx, vy, alpha, haze, hue: l.hue, speed: Math.hypot(vx, vy), type: l.car.type };
  }

  /* ---------- Корабли (2026-11-16): шесть разных, объёмных ----------
     Каждая деталь — тело из нескольких «колец» (план сверху на разной высоте): x — вперёд, z — к зрителю, h — вверх.
     Из колец собираются грани; видимые грани заливаются по освещению сверху-спереди, поэтому корпус выглядит
     литым и объёмным, а не плоской пластиной. Проекция: экран = (x + 0,26·z, 0,34·z − h). */
  const PZ = 0.26, PY = 0.34;
  const prj = (x, z, h) => [x + z * PZ, z * PY - h];
  const VIEW = (() => { const v = [-PZ, PY, 1]; const l = Math.hypot(...v); return v.map((a) => a / l); })();   // (x, h, z)
  const SUN = (() => { const v = [0.25, 0.9, 0.45]; const l = Math.hypot(...v); return v.map((a) => a / l); })();
  function circle(cx, cz, r, n = 18) {
    const o = [];
    for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; o.push([cx + Math.cos(a) * r, cz + Math.sin(a) * r]); }
    return o;
  }
  const mirrorZ = (pts) => pts.map(([x, z]) => [x, -z]).reverse();
  // кольца «линзы»: план сужается к низу и верху, получается обтекаемое тело
  function lens(plan, hMid, down, up, steps = 3, minS = 0.4) {
    let cx = 0, cz = 0;
    plan.forEach(([x, z]) => { cx += x; cz += z; });
    cx /= plan.length; cz /= plan.length;
    const rings = [];
    for (let i = -steps; i <= steps; i++) {
      const t = i / steps;
      const p = minS + (1 - minS) * Math.sqrt(Math.max(0, 1 - t * t));
      const sx = 1 - (1 - p) * 0.45;
      rings.push({ h: t < 0 ? hMid + t * down : hMid + t * up, p: plan.map(([x, z]) => [cx + (x - cx) * sx, cz + (z - cz) * p]) });
    }
    return rings;
  }
  // прямое тело с фаской сверху и снизу
  const slab = (plan, h0, h1, bevel = 0.85) => {
    const sc = (k) => { let cx = 0, cz = 0; plan.forEach(([x, z]) => { cx += x; cz += z; }); cx /= plan.length; cz /= plan.length; return plan.map(([x, z]) => [cx + (x - cx) * (1 - (1 - k) * 0.3), cz + (z - cz) * k]); };
    const d = (h1 - h0) * 0.18;
    return [{ h: h0, p: sc(bevel) }, { h: h0 + d, p: plan }, { h: h1 - d, p: plan }, { h: h1, p: sc(bevel) }];
  };
  const rgbK = (rgb, k, add = 0) => `rgb(${Math.min(255, rgb[0] * k + add) | 0},${Math.min(255, rgb[1] * k + add) | 0},${Math.min(255, rgb[2] * k + add) | 0})`;
  // нарисовать тело из колец: видимые грани, свет, тонкий блик по рёбрам
  function body(c, rings, rgb, opt = {}) {
    const faces = [];
    const n = rings[0].p.length;
    for (let r = 0; r < rings.length - 1; r++) {
      const A = rings[r], B = rings[r + 1];
      for (let i = 0; i < n; i++) {
        const j = (i + 1) % n;
        faces.push([[A.p[i][0], A.p[i][1], A.h], [A.p[j][0], A.p[j][1], A.h], [B.p[j][0], B.p[j][1], B.h], [B.p[i][0], B.p[i][1], B.h]]);
      }
    }
    const cap = (R) => R.p.map(([x, z]) => [x, z, R.h]);
    faces.push(cap(rings[0]), cap(rings[rings.length - 1]));
    let gx = 0, gh = 0, gz = 0, cnt = 0;
    rings.forEach((R) => R.p.forEach(([x, z]) => { gx += x; gz += z; gh += R.h; cnt++; }));
    gx /= cnt; gh /= cnt; gz /= cnt;
    for (const F of faces) {
      // нормаль по Ньюэллу в осях (x, h, z) и центр грани
      let fx = 0, fh = 0, fz = 0, N;
      for (const a of F) { fx += a[0]; fz += a[1]; fh += a[2]; }
      {
        let X = 0, Y = 0, Z = 0;
        for (let i = 0; i < F.length; i++) {
          const a = F[i], b = F[(i + 1) % F.length];
          const ax = a[0], ay = a[2], az = a[1], bx = b[0], by = b[2], bz = b[1];
          X += (ay - by) * (az + bz);
          Y += (az - bz) * (ax + bx);
          Z += (ax - bx) * (ay + by);
        }
        const l = Math.hypot(X, Y, Z);
        if (l < 1e-6) continue;
        N = [X / l, Y / l, Z / l];
      }
      fx /= F.length; fz /= F.length; fh /= F.length;
      if (N[0] * (fx - gx) + N[1] * (fh - gh) + N[2] * (fz - gz) < 0) N = N.map((v) => -v);
      const vis = N[0] * VIEW[0] + N[1] * VIEW[1] + N[2] * VIEW[2];
      if (vis <= 0.01) continue;
      const lit = Math.max(0, N[0] * SUN[0] + N[1] * SUN[1] + N[2] * SUN[2]);
      c.beginPath();
      F.forEach(([x, z, h], i) => { const p = prj(x, z, h); i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]); });
      c.closePath();
      let col;
      if (opt.glass) {
        const k = 0.35 + 0.9 * lit;
        col = `rgba(${Math.min(255, 40 + 190 * k) | 0},${Math.min(255, 110 + 140 * k) | 0},${Math.min(255, 170 + 90 * k) | 0},0.96)`;
      } else {
        const spec = Math.pow(lit, 10) * 70;
        col = rgbK(rgb, 0.3 + 0.95 * lit, spec);
      }
      c.fillStyle = col; c.fill();
      c.strokeStyle = col; c.lineWidth = 0.35; c.stroke();   // закрыть щели сглаживания между гранями
    }
    if (opt.neon) {   // светящаяся кромка по кольцу, только на видимой (ближней) стороне
      const R = rings[opt.neon.ring];
      c.strokeStyle = opt.neon.color; c.lineWidth = opt.neon.w || 1.1;
      c.beginPath();
      for (let i = 0; i < n; i++) {
        const a = R.p[i], b = R.p[(i + 1) % n];
        if ((a[1] + b[1]) / 2 < gz + (opt.neon.from || 0)) continue;
        const p1 = prj(a[0], a[1], R.h), p2 = prj(b[0], b[1], R.h);
        c.moveTo(p1[0], p1[1]); c.lineTo(p2[0], p2[1]);
      }
      c.stroke();
    }
  }
  function neonLine(c, pts, h, color, w = 1.2) {
    c.strokeStyle = color; c.lineWidth = w;
    c.beginPath();
    pts.forEach(([x, z], i) => { const p = prj(x, z, h); i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]); });
    c.stroke();
  }
  function dot(c, x, z, h, r, color) { const p = prj(x, z, h); c.fillStyle = color; c.beginPath(); c.arc(p[0], p[1], r, 0, Math.PI * 2); c.fill(); }

  const HULL = [150, 160, 186];     // светлый металл
  const STEEL = [104, 114, 140];
  const DARK = [58, 64, 82];
  // engines — точки двигателей (x, z, h) для свечения и шлейфа; nose — фара
  const SHIPS = {
    // 1. Перехватчик: острый фюзеляж, стреловидные крылья, киль
    dart: {
      engines: [[-38, -5, 4], [-38, 5, 4]], nose: [52, 0, 4],
      draw(c, hue, t) {
        const wing = [[12, 5], [-18, 5], [-32, 36], [-23, 38]];
        body(c, slab(mirrorZ(wing), 2, 4.5, 0.8), STEEL);
        neonLine(c, mirrorZ([[-32, 36], [-23, 38]]), 3.3, hue, 1.4);
        body(c, lens([[52, 0], [30, 6], [0, 9], [-32, 9], [-38, 5], [-38, -5], [-32, -9], [0, -9], [30, -6]], 4, 4, 5, 3, 0.35), HULL, { neon: { ring: 3, color: hexA(hue, 0.85), w: 1 } });
        body(c, [{ h: 8, p: [[-20, 1], [-36, 1], [-36, -1], [-20, -1]] }, { h: 19, p: [[-31, 0.7], [-40, 0.7], [-40, -0.7], [-31, -0.7]] }], STEEL);
        body(c, lens([[28, 0], [16, 4.5], [0, 4.5], [-8, 0], [0, -4.5], [16, -4.5]], 8.5, 0.5, 4, 3, 0.3), null, { glass: true });
        body(c, slab(wing, 2, 4.5, 0.8), STEEL);
        neonLine(c, [[-32, 36], [-23, 38]], 3.3, hue, 1.6);
        dot(c, -27, 37, 3.5, 1.2, "#ffffff");
      },
    },
    // 2. Грузовой тягач: рубленый корпус-контейнер, кабина впереди, четыре гондолы двигателей
    hauler: {
      engines: [[-44, -17, 2], [-44, 17, 2], [-46, 0, 8]], nose: [54, 0, 7],
      draw(c, hue, t) {
        const pod = (x, z) => lens([[x + 12, z], [x + 8, z - 6], [x - 10, z - 6], [x - 14, z], [x - 10, z + 6], [x + 8, z + 6]], 2, 5, 5, 2, 0.45);
        body(c, pod(-30, -17), DARK); body(c, pod(26, -17), DARK);
        const box = [[36, -12], [-40, -12], [-46, -7], [-46, 7], [-40, 12], [36, 12], [40, 7], [40, -7]];
        body(c, slab(box, -1, 17, 0.8), STEEL, { neon: { ring: 1, color: hexA(hue, 0.9), w: 1.3 } });
        // рёбра контейнера на ближнем борту
        c.strokeStyle = "rgba(20,24,34,0.55)"; c.lineWidth = 0.8;
        for (const x of [-26, -8, 10, 26]) { const a = prj(x, 12, 2), b = prj(x, 12, 14); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); }
        neonLine(c, [[-40, 12.1], [36, 12.1]], 10, hexA(hue, 0.55), 0.9);
        body(c, slab([[56, 0], [50, -9], [38, -11], [38, 11], [50, 9]], 2, 15, 0.75), HULL);
        body(c, lens([[54, 0], [49, -6], [42, -7], [42, 7], [49, 6]], 15, 0.5, 2.5, 2, 0.4), null, { glass: true });
        const on = Math.floor(t * 3) % 2 === 0;
        dot(c, -36, 0, 18.5, on ? 2 : 1.2, on ? "#ffb020" : "rgba(120,70,20,0.9)");
        body(c, pod(-30, 17), DARK); body(c, pod(26, 17), DARK);
        neonLine(c, [[-40, 23], [-22, 23]], 2, hue, 1.2);
        neonLine(c, [[16, 23], [34, 23]], 2, hue, 1.2);
      },
    },
    // 3. Тарелка: линзовидный диск, кольцо, стеклянный купол и бегущие огни
    saucer: {
      engines: [[0, 0, -2]], nose: null,
      draw(c, hue, t) {
        body(c, lens(circle(0, 0, 36, 28), 2, 4, 3, 3, 0.55), STEEL);
        body(c, slab(circle(0, 0, 21, 24), 4, 7.5, 0.85), HULL, { neon: { ring: 1, color: hexA(hue, 0.9), w: 1.1 } });
        body(c, lens(circle(-1, 0, 12, 20), 7.5, 0.5, 8, 4, 0.2), null, { glass: true });
        for (let i = 0; i < 18; i++) {
          const a = (i / 18) * Math.PI * 2;
          if (Math.sin(a) < -0.35) continue;   // дальняя кромка закрыта корпусом
          const on = (Math.floor(t * 10) + i) % 4 === 0;
          dot(c, Math.cos(a) * 35, Math.sin(a) * 35, 2, on ? 1.8 : 1, on ? "#ffffff" : hue);
        }
      },
    },
    // 4. «Скат»: летающее крыло с толстым центром и светящейся передней кромкой
    manta: {
      engines: [[-20, -8, 4], [-20, 8, 4]], nose: [42, 0, 4],
      draw(c, hue, t) {
        body(c, lens([[44, 0], [8, 44], [-18, 42], [-12, 16], [-18, 0], [-12, -16], [-18, -42], [8, -44]], 2.5, 1.5, 2, 1, 0.7), STEEL);
        neonLine(c, [[8, -44], [44, 0], [8, 44]], 3.3, hue, 1.5);
        body(c, lens([[38, 0], [12, 13], [-16, 11], [-22, 0], [-16, -11], [12, -13]], 4.5, 3, 7, 3, 0.35), HULL);
        body(c, lens([[26, 0], [14, 5], [2, 4], [2, -4], [14, -5]], 10, 0.5, 3.5, 2, 0.3), null, { glass: true });
        const fin = (z, lean) => body(c, [{ h: 5, p: [[-2, z + 1], [-18, z + 1], [-18, z - 1], [-2, z - 1]] }, { h: 17, p: [[-14, z + lean + 0.7], [-24, z + lean + 0.7], [-24, z + lean - 0.7], [-14, z + lean - 0.7]] }], STEEL);
        fin(-10, -4); fin(10, 4);
        neonLine(c, [[-14, 14.7], [-24, 14.7]], 17, hue, 1.2);
        for (const z of [-30, 30]) dot(c, -4, z, 4, 1.2, z > 0 ? "#46ff8a" : "#ff4a4a");
      },
    },
    // 5. Двухкорпусный гонщик: две гондолы-двигателя, перемычка и кабина посередине
    skiff: {
      engines: [[-42, -17, 5], [-42, 17, 5]], nose: [46, 17, 5],
      draw(c, hue, t) {
        const pod = (z) => lens([[46, z], [30, z - 6.5], [-36, z - 6.5], [-42, z], [-36, z + 6.5], [30, z + 6.5]], 5, 5.5, 5.5, 3, 0.35);
        const fin = (z) => body(c, [{ h: 9, p: [[-22, z + 0.9], [-38, z + 0.9], [-38, z - 0.9], [-22, z - 0.9]] }, { h: 18, p: [[-34, z + 0.6], [-44, z + 0.6], [-44, z - 0.6], [-34, z - 0.6]] }], DARK);
        fin(-17); body(c, pod(-17), HULL);
        body(c, slab([[14, -15], [-18, -15], [-18, 15], [14, 15]], 3, 5.5, 0.9), DARK);
        body(c, lens([[36, 0], [18, 8], [-18, 8], [-24, 0], [-18, -8], [18, -8]], 6, 3, 4, 3, 0.4), STEEL);
        body(c, lens([[28, 0], [18, 5], [4, 5], [2, 0], [4, -5], [18, -5]], 9.5, 0.5, 3.5, 2, 0.3), null, { glass: true });
        body(c, pod(17), HULL, { neon: { ring: 3, color: hue, w: 1.3 } });
        fin(17);
        neonLine(c, [[-34, 17.6], [-44, 17.6]], 18, hue, 1.1);
        dot(c, 45, 17, 5, 1.8, "#ffffff");
      },
    },
    // 6. Полицейский дрон: белый обтекаемый корпус, мигалка, четыре кольца-винта
    drone: {
      engines: [[-24, 0, 4]], nose: [30, 0, 5],
      draw(c, hue, t) {
        const rotor = (x, z) => {
          body(c, slab(circle(x, z, 10, 18), 2, 4.5, 0.8), DARK, { neon: { ring: 3, color: "rgba(140,210,255,0.55)", w: 0.8, from: -20 } });
          dot(c, x, z, 4.6, 7, "rgba(120,200,255,0.16)");
        };
        rotor(-16, -19); rotor(16, -19);
        body(c, lens([[30, 0], [24, -11], [-18, -11], [-26, 0], [-18, 11], [24, 11]], 4, 4, 5, 3, 0.45), [205, 212, 228], { neon: { ring: 3, color: "#3d7bff", w: 1.2 } });
        body(c, lens([[26, 0], [18, -6], [6, -6], [6, 6], [18, 6]], 8.5, 0.5, 2.5, 2, 0.35), null, { glass: true });
        const red = Math.floor(t * 6) % 2 === 0;
        body(c, slab([[0, -7], [-10, -7], [-10, 0], [0, 0]], 9, 12, 0.9), red ? [255, 50, 70] : [70, 24, 34]);
        body(c, slab([[0, 0], [-10, 0], [-10, 7], [0, 7]], 9, 12, 0.9), red ? [24, 34, 80] : [60, 120, 255]);
        rotor(-16, 19); rotor(16, 19);
      },
    },
  };
  const SHIP_TYPES = Object.keys(SHIPS);

  function drawCar(car, T) {
    const dir = car.vx >= 0 ? 1 : -1;
    let ang = Math.atan2(car.vy, car.vx * dir);
    ang = Math.max(-0.25, Math.min(0.25, ang));
    const s = car.s * 0.9;
    const ship = SHIPS[car.type];
    const trail = Math.min(240, 30 + car.speed * 800);

    // --- свет: двигатели, шлейфы, фара, отсвет снизу (слой screen) ---
    lctx.save();
    lctx.translate(car.x, car.y);
    lctx.scale(dir, 1);
    lctx.rotate(ang);
    lctx.scale(s, s);
    lctx.globalAlpha = car.alpha;
    lctx.globalCompositeOperation = "lighter";
    let g = lctx.createRadialGradient(0, 14, 2, 0, 14, 40);
    g.addColorStop(0, hexA(car.hue, 0.35 * car.haze + 0.12));
    g.addColorStop(1, hexA(car.hue, 0));
    lctx.fillStyle = g;
    lctx.beginPath(); lctx.ellipse(0, 14, 40, 11, 0, 0, Math.PI * 2); lctx.fill();
    for (const [ex, ez, eh] of ship.engines) {
      const [px, py] = prj(ex, ez, eh);
      g = lctx.createLinearGradient(px, py, px - trail, py);
      g.addColorStop(0, hexA(car.hue, 0.75));
      g.addColorStop(0.15, hexA(car.hue, 0.35));
      g.addColorStop(1, hexA(car.hue, 0));
      lctx.fillStyle = g;
      lctx.fillRect(px - trail, py - 2, trail, 4);
      g = lctx.createRadialGradient(px, py, 0, px, py, 9);
      g.addColorStop(0, "rgba(255,255,255,0.95)");
      g.addColorStop(0.35, hexA(car.hue, 0.8));
      g.addColorStop(1, hexA(car.hue, 0));
      lctx.fillStyle = g;
      lctx.fillRect(px - 9, py - 9, 18, 18);
    }
    if (ship.nose) {
      const [nx, ny] = prj(...ship.nose);
      g = lctx.createLinearGradient(nx, ny, nx + 90, ny);
      g.addColorStop(0, "rgba(220,240,255,0.28)");
      g.addColorStop(1, "rgba(220,240,255,0)");
      lctx.fillStyle = g;
      lctx.beginPath(); lctx.moveTo(nx, ny); lctx.lineTo(nx + 95, ny - 13); lctx.lineTo(nx + 95, ny + 15); lctx.closePath(); lctx.fill();
      g = lctx.createRadialGradient(nx, ny, 0, nx, ny, 8);
      g.addColorStop(0, "rgba(255,255,255,0.9)");
      g.addColorStop(1, "rgba(190,230,255,0)");
      lctx.fillStyle = g;
      lctx.fillRect(nx - 8, ny - 8, 16, 16);
    }
    lctx.restore();

    // --- корпус ---
    ctx.save();
    ctx.translate(car.x, car.y);
    ctx.scale(dir, 1);
    ctx.rotate(ang);
    ctx.scale(s, s);
    ctx.globalAlpha = car.alpha * (0.65 + 0.35 * car.haze);
    ctx.lineJoin = "round";
    ship.draw(ctx, car.hue, T);
    ctx.restore();
  }

  /* ==========================================================================
     3. МОЛНИЯ
     Зона 0 — та молния, что нарисована на картинке (bolt.png вынут из фона и вспыхивает).
     Остальные зоны — новые молнии, кусочки неба между башнями (обрезаются по зоне).
     ========================================================================== */
  const boltImg = new Image();
  boltImg.src = "images/about/hero-fx/bolt.png";
  const BOLT_POS = [1825, 115];
  const ZONES = [
    { x: 1830, y: 0, w: 230, h: 340, cx: 1935, cy: 230, own: true },
    { x: 2185, y: 0, w: 345, h: 292, cx: 2360, cy: 140 },
    { x: 1040, y: 0, w: 135, h: 300, cx: 1105, cy: 150 },
    { x: 398, y: 0, w: 165, h: 292, cx: 480, cy: 140 },
    { x: 680, y: 0, w: 180, h: 255, cx: 770, cy: 130 },
  ];
  let strike = null;
  let nextStrike = rnd(1.5, 3.5);

  function makeBolt(z) {
    const x0 = z.x + z.w * rnd(0.25, 0.75), y0 = rnd(-10, 25);
    const x1 = x0 + rnd(-z.w * 0.35, z.w * 0.35), y1 = z.y + z.h - rnd(5, 45);
    const main = jag([[x0, y0], [x1, y1]], 6, (y1 - y0) * 0.22);
    const branches = [];
    for (let i = 0; i < 3; i++) {
      const k = Math.floor(rnd(0.15, 0.7) * main.length);
      const [bx, by] = main[k];
      const ang = rnd(0.25, 1.1) * (Math.random() < 0.5 ? -1 : 1);
      const len = rnd(40, 110);
      const ex = bx + Math.sin(ang) * len, ey = by + Math.cos(ang) * len * 0.8;
      branches.push(jag([[bx, by], [ex, ey]], 4, len * 0.25));
    }
    return { main, branches };
  }
  function jag(pts, depth, amp) {
    for (let d = 0; d < depth; d++) {
      const out = [pts[0]];
      for (let i = 1; i < pts.length; i++) {
        const [ax, ay] = pts[i - 1], [bx, by] = pts[i];
        out.push([(ax + bx) / 2 + rnd(-amp, amp), (ay + by) / 2 + rnd(-amp, amp) * 0.3], [bx, by]);
      }
      pts = out;
      amp *= 0.55;
    }
    return pts;
  }

  function startStrike(T) {
    const zi = Math.random() < 0.45 ? 0 : 1 + Math.floor(Math.random() * (ZONES.length - 1));
    const z = ZONES[zi];
    // вспышки серии: [начало, длительность, яркость]
    const pulses = [[0, 0.07, 1]];
    let t = 0.07;
    const n = 1 + Math.floor(rnd(1, 4));
    for (let i = 0; i < n; i++) { t += rnd(0.05, 0.16); const d = rnd(0.04, 0.11); pulses.push([t, d, rnd(0.5, 1)]); t += d; }
    strike = { zi, z, t0: T, pulses, end: t + 0.55, bolt: z.own ? null : makeBolt(z) };
  }

  // Подсветка всего города при вспышке: копия фото, ослабленная к краям от молнии.
  // Готовится один раз на зону (картинку только рисуем, пиксели не читаем)
  const flashCache = new Map();
  function flashLayer(zi) {
    if (flashCache.has(zi)) return flashCache.get(zi);
    if (!photo.complete || !photo.naturalWidth) return null;
    const z = ZONES[zi];
    const f = 0.5; // половинное разрешение — свет мягкий
    const c = document.createElement("canvas");
    c.width = Math.max(1, Math.round(cw * dpr * f));
    c.height = Math.max(1, Math.round(ch * dpr * f));
    const x = c.getContext("2d");
    const k = dpr * f * scale;
    x.setTransform(k, 0, 0, k, dpr * f * ox, dpr * f * oy);
    x.drawImage(photo, 0, 0, IW, IH);
    x.globalCompositeOperation = "destination-in";
    const g = x.createRadialGradient(z.cx, z.cy, 40, z.cx, z.cy, 900);
    g.addColorStop(0, "rgba(0,0,0,1)");
    g.addColorStop(0.45, "rgba(0,0,0,0.55)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    x.fillStyle = g;
    x.fillRect(-200, -200, IW + 400, IH + 400);
    flashCache.set(zi, c);
    return c;
  }

  function drawStrike(T) {
    if (!strike) return;
    const t = T - strike.t0;
    if (t > strike.end) { strike = null; nextStrike = T + rnd(1.6, 4.2); return; }  // 2026-11-16: молнии чаще, по его просьбе
    let a = 0;
    for (const [s, d, v] of strike.pulses) {
      if (t >= s && t < s + d) a = Math.max(a, v);
      else if (t >= s + d) a = Math.max(a, v * Math.exp(-(t - s - d) * 9) * 0.6);
    }
    if (a < 0.01) return;
    const z = strike.z;
    // 1) город и облака вспыхивают
    const fl = flashLayer(strike.zi);
    if (fl) {
      lctx.save();
      lctx.setTransform(1, 0, 0, 1, 0, 0);
      lctx.globalAlpha = Math.min(1, a * 0.85);
      lctx.drawImage(fl, 0, 0, lightCanvas.width, lightCanvas.height);
      lctx.restore();
    }
    const g = lctx.createRadialGradient(z.cx, z.cy, 10, z.cx, z.cy, 520);
    g.addColorStop(0, `rgba(185,190,255,${0.32 * a})`);
    g.addColorStop(1, "rgba(185,190,255,0)");
    lctx.fillStyle = g;
    lctx.fillRect(z.cx - 520, z.cy - 520, 1040, 1040);
    // 2) сама молния
    const lit = strike.pulses.some(([s, d]) => t >= s && t < s + d + 0.03);
    if (!lit) return;
    if (z.own) {
      if (boltImg.complete && boltImg.naturalWidth) {
        lctx.save();
        lctx.globalCompositeOperation = "lighter";
        lctx.globalAlpha = Math.min(1, a * 1.15);
        lctx.drawImage(boltImg, BOLT_POS[0], BOLT_POS[1]);
        lctx.globalAlpha = Math.min(1, a * 0.6);
        lctx.drawImage(boltImg, BOLT_POS[0], BOLT_POS[1]);
        lctx.restore();
      }
    } else {
      lctx.save();
      lctx.beginPath(); lctx.rect(z.x, z.y, z.w, z.h); lctx.clip();
      lctx.globalCompositeOperation = "lighter";
      lctx.lineCap = "round"; lctx.lineJoin = "round";
      const path = (pts) => { lctx.beginPath(); pts.forEach(([x, y], i) => (i ? lctx.lineTo(x, y) : lctx.moveTo(x, y))); lctx.stroke(); };
      lctx.shadowColor = "rgba(170,160,255,0.9)";
      lctx.shadowBlur = 16 * dpr * scale;
      lctx.strokeStyle = `rgba(170,150,255,${0.35 * a})`;
      lctx.lineWidth = 7; path(strike.bolt.main);
      lctx.lineWidth = 4; strike.bolt.branches.forEach(path);
      lctx.shadowBlur = 0;
      lctx.strokeStyle = `rgba(255,255,255,${0.95 * a})`;
      lctx.lineWidth = 1.8; path(strike.bolt.main);
      lctx.lineWidth = 1; lctx.strokeStyle = `rgba(230,225,255,${0.7 * a})`;
      strike.bolt.branches.forEach(path);
      lctx.restore();
    }
  }

  /* ==========================================================================
     4. ЗАГРАДИТЕЛЬНЫЕ ОГНИ на шпилях — красные, мигают
     ========================================================================== */
  // 2026-11-16: огни на углах крыш и шпилях всех зданий (замерено по картинке).
  // Рисуются на отдельном холсте ПОВЕРХ затемнения шапки, поэтому горят и слева, в тени под текстом
  const BEACONS = [
    [58, 208], [32, 265], [85, 265], [80, 288], [170, 288], [200, 295], [277, 12], [302, 287], [380, 295],
    [387, 375], [440, 375], [487, 500], [540, 500], [585, 175], [650, 175], [638, 120], [10, 425],
    [62, 545], [108, 545], [190, 392], [246, 392],
    [740, 283], [803, 283], [880, 178], [933, 178], [1006, 128], [977, 170], [1028, 175], [1048, 342],
    [1150, 342], [1212, 267], [1286, 265], [1390, 265], [1035, 545], [1150, 545],
    [2102, 146], [2095, 235], [2165, 235], [1965, 395], [2050, 395], [2205, 345], [2270, 345], [2440, 332],
    [2535, 332], [2112, 438], [2248, 438], [2312, 438], [2420, 438], [2168, 418],
  ].map(([x, y], i) => [x, y, hash(i * 3.3) * 3, 1.8 + hash(i * 7.1) * 1.4]);
  const beaconCanvas = document.createElement("canvas");
  beaconCanvas.className = "hero__beacons";
  beaconCanvas.setAttribute("aria-hidden", "true");
  scene.after(beaconCanvas);
  const bctx = beaconCanvas.getContext("2d");
  function placeBeaconCanvas() {
    const hero = scene.parentElement.getBoundingClientRect();
    const r = scene.getBoundingClientRect();
    Object.assign(beaconCanvas.style, {
      left: r.left - hero.left + "px", top: r.top - hero.top + "px", width: r.width + "px", height: r.height + "px",
    });
    beaconCanvas.width = Math.round(r.width * dpr);
    beaconCanvas.height = Math.round(r.height * dpr);
    liftBoards();
  }
  // 2026-11-16: экраны в тёмной левой части, которые не попадают под текст, рисуются второй раз
  // на этом же верхнем холсте — пробиваются сквозь затемнение. Под буквами остаются тусклыми, чтобы текст читался.
  const TEXT_SEL = ".hero__eyebrow, .hero__title, .hero__lead";
  const BOX_SEL = ".hero__buttons .btn, .hero__info .info-item";
  let textRects = [];   // строки текста в координатах сцены
  // насколько можно поднять предмет в точке (x, y сцены): у текста — почти не поднимаем
  function textFade(x, y) {
    let d = Infinity;
    for (const q of textRects) {
      const dx = Math.max(q[0] - x, 0, x - q[2]), dy = Math.max(q[1] - y, 0, y - q[3]);
      d = Math.min(d, Math.hypot(dx, dy));
    }
    return 0.12 + 0.88 * clamp01(d / 60);
  }
  function liftBoards() {
    const sr = scene.getBoundingClientRect();
    const rects = [];
    document.querySelectorAll(TEXT_SEL).forEach((el) => {
      const rg = document.createRange();
      rg.selectNodeContents(el);
      for (const q of rg.getClientRects()) rects.push(q);
    });
    document.querySelectorAll(BOX_SEL).forEach((el) => { if (el.offsetParent) rects.push(el.getBoundingClientRect()); });
    const pad = 14;
    textRects = rects.filter((q) => q.width > 0).map((q) => [q.left - sr.left, q.top - sr.top, q.right - sr.left, q.bottom - sr.top]);
    BOARDS.forEach((b) => {
      const x0 = ox + b.x * scale, y0 = oy + b.y * scale, x1 = x0 + b.w * scale, y1 = y0 + b.h * scale;
      // только левая, затемнённая часть: дальше середины картинки экраны и так яркие
      b.lift = b.x < 1200 && !rects.some((q) => {
        const qx0 = q.left - sr.left - pad, qy0 = q.top - sr.top - pad, qx1 = q.right - sr.left + pad, qy1 = q.bottom - sr.top + pad;
        return q.width > 0 && x0 < qx1 && x1 > qx0 && y0 < qy1 && y1 > qy0;
      });
    });
  }
  function drawLiftedBoards(T) {
    const base = ctx;
    ctx = bctx;
    for (const b of BOARDS) {
      if (!b.lift) continue;
      const cx = b.x + b.w / 2, cy = b.y + b.h / 2, R = Math.max(b.w, b.h) * 0.9;
      const g = bctx.createRadialGradient(cx, cy, Math.min(b.w, b.h) * 0.3, cx, cy, R);
      g.addColorStop(0, hexA(b.c1, 0.2 + 0.05 * Math.sin(T * 2 + b.seed)));
      g.addColorStop(1, hexA(b.c1, 0));
      bctx.globalCompositeOperation = "lighter";
      bctx.fillStyle = g;
      bctx.fillRect(cx - R, cy - R, R * 2, R * 2);
      bctx.globalCompositeOperation = "source-over";
      bctx.globalAlpha = 0.92;
      drawBoard(b, T, true);
      bctx.globalAlpha = 1;
    }
    ctx = base;
  }

  if (document.fonts) document.fonts.ready.then(() => { if (cw) liftBoards(); });   // шрифт меняет ширину строк
  // горят всегда; мягко дышат и время от времени коротко вспыхивают
  function drawBeacons(T) {
    for (const [x, y, ph, per] of BEACONS) {
      const p = (T + ph) % per;
      const a = 0.7 + 0.12 * Math.sin(T * 2.2 + ph * 5) + (p < 0.14 ? 0.3 : p < 0.4 ? 0.3 * Math.exp(-(p - 0.14) * 12) : 0);
      let g = bctx.createRadialGradient(x, y, 0, x, y, 13);
      g.addColorStop(0, `rgba(255,60,60,${0.55 * a})`);
      g.addColorStop(0.3, `rgba(255,30,40,${0.22 * a})`);
      g.addColorStop(1, "rgba(255,0,0,0)");
      bctx.fillStyle = g;
      bctx.fillRect(x - 13, y - 13, 26, 26);
      g = bctx.createRadialGradient(x, y, 0, x, y, 2.6);
      g.addColorStop(0, `rgba(255,235,230,${Math.min(1, a)})`);
      g.addColorStop(0.5, `rgba(255,60,60,${Math.min(1, a)})`);
      g.addColorStop(1, "rgba(255,40,40,0)");
      bctx.fillStyle = g;
      bctx.fillRect(x - 3, y - 3, 6, 6);
    }
  }

  /* ==========================================================================
     Цикл кадров
     ========================================================================== */
  let T = 0, last = 0, running = false, visible = true;
  function draw() {
    for (const c of [ctx, lctx, bctx]) {
      c.setTransform(1, 0, 0, 1, 0, 0);
      c.clearRect(0, 0, c.canvas.width, c.canvas.height);
      toImage(c);
    }
    drawStrike(T);
    BOARDS.forEach((b) => drawBoard(b, T));
    drawLiftedBoards(T);
    drawBeacons(T);
    if (SHIPS_ON) LANES.forEach((l) => {
      const car = laneUpdate(l, T);
      if (!car) return;
      drawCar(car, T);
      // слева шапка затемнена под текст — там корабль рисуется ещё раз поверх затемнения, чтобы не терялся
      const sx = ox + car.x * scale, sy = oy + car.y * scale;
      const f = clamp01((0.6 * cw - sx) / (0.25 * cw)) * textFade(sx, sy);
      if (f > 0.02) {
        const c0 = ctx, l0 = lctx;
        ctx = bctx; lctx = bctx;
        drawCar({ ...car, alpha: car.alpha * f * 0.85 }, T);
        ctx = c0; lctx = l0;
      }
    });
    if (!strike && T >= nextStrike) startStrike(T);
  }
  function frame(now) {
    if (!running) return;
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
    last = now;
    T += dt;
    draw();
    requestAnimationFrame(frame);
  }
  function start() {
    if (running || reduceMotion.matches || !visible) return;
    running = true; last = 0;
    requestAnimationFrame(frame);
  }
  function stop() { running = false; }

  function init() {
    layout();
    if (reduceMotion.matches) { T = 3; draw(); return; }  // без движения: экраны просто светятся
    start();
  }

  if ("ResizeObserver" in window) new ResizeObserver(() => { layout(); if (!running) draw(); }).observe(scene);
  else window.addEventListener("resize", layout);
  if ("IntersectionObserver" in window) {
    new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      visible ? start() : stop();
    }).observe(scene);
  }
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
  reduceMotion.addEventListener?.("change", () => (reduceMotion.matches ? stop() : start()));

  if (photo.complete) init();
  else photo.addEventListener("load", init, { once: true });
})();
