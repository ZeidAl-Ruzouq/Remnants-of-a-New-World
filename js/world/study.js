/* Study rooms: sheets, lamp, windows, weather, vines, sprouts, growth, sunlight. */

/** Bring sheet `pos` of a desk's stack to the top. */
function showSheet(sec, pos, silent) {
  const sheets = [...sec.querySelectorAll(".poem-paper")];
  if (!sheets.length) return;
  const n = sheets.length;
  const cur = +sec.dataset.sheetPos || 0;
  const next = Math.max(0, Math.min(n - 1, pos));
  sec.dataset.sheetPos = String(next);
  sheets.forEach((el, i) => {
    const rel = (i - next + n) % n;
    el.dataset.pos = rel <= 3 ? String(rel) : "hidden";
    el.setAttribute("aria-hidden", rel === 0 ? "false" : "true");
  });
  sec.querySelectorAll(".sheet-dot").forEach((d) => {
    d.classList.toggle("on", +d.dataset.pos === next);
  });
  const count = sec.querySelector(".sheet-count");
  if (count) count.textContent = "sheet " + (next + 1) + " of " + n;
  const prevBtn = sec.querySelector(".sheet-prev");
  const nextBtn = sec.querySelector(".sheet-next");
  if (prevBtn) prevBtn.disabled = next <= 0;
  if (nextBtn) nextBtn.disabled = next >= n - 1;
  if (!silent) {
    revealSheet(sheets[next]);
    if (next !== cur) sfx("flip");
  }
}

function revealSheet(paper) {
  if (!paper) return;
  const sheetId = paper.dataset.sheet;
  if (sheetId != null) {
    state.sheetsRead.add(sheetId);
    if (state.sheetsRead.size >= SHEETS.length) earn("sheets-all");
    const dot = paper.closest(".beat.poem");
    const tab = dot && dot.querySelector('.sheet-dot[data-pos="' + paper.dataset.idx + '"]');
    if (tab) tab.classList.add("read");
  }
  if (paper.dataset.revealed === "1" || reduced) return;
  paper.dataset.revealed = "1";
  paper.classList.add("ink-in");
}

/** Brass architect lamp in three parts so it fits any sheet height: the head
 *  (upper arm + shade) hangs over the top of the paper, the base sits on the
 *  desk, and the post between them stretches. `u` keeps gradient ids unique. */
function lampSvg(u) {
  const brass = "url(#brass-" + u + ")";
  return '<svg class="lamp-head lamp-body" viewBox="0 0 480 240" aria-hidden="true">' +
    '<defs>' +
      '<linearGradient id="brass-' + u + '" x1="0" y1="0" x2="1" y2="0">' +
        '<stop offset="0" stop-color="#3a2912"/><stop offset=".32" stop-color="#a98446"/>' +
        '<stop offset=".52" stop-color="#f2d99c"/><stop offset=".78" stop-color="#8a6632"/>' +
        '<stop offset="1" stop-color="#271a0b"/></linearGradient>' +
      '<linearGradient id="shade-' + u + '" x1="0" y1="0" x2="1" y2="0">' +
        '<stop offset="0" stop-color="#0f241a"/><stop offset=".42" stop-color="#2f6a4c"/>' +
        '<stop offset=".58" stop-color="#5f9c7b"/><stop offset="1" stop-color="#0c1d14"/></linearGradient>' +
      '<radialGradient id="bulb-' + u + '">' +
        '<stop offset="0" stop-color="#fffbe6"/><stop offset=".5" stop-color="#ffe1a0"/>' +
        '<stop offset="1" stop-color="#ffc060" stop-opacity="0"/></radialGradient>' +
    '</defs>' +
    '<g class="lamp-hit">' +
      // upper arm: twin rods + spring, from the elbow up and over to the head
      '<g transform="translate(420 200) rotate(-60.7)">' +
        '<rect x="-6" y="-278" width="12" height="278" rx="6" fill="' + brass + '"/>' +
        '<rect x="9" y="-252" width="4" height="226" rx="2" fill="' + brass + '"/>' +
        '<line x1="-14" y1="-40" x2="-14" y2="-230" stroke="#c9a868" stroke-width="4" stroke-dasharray="2 2"/>' +
      '</g>' +
      '<circle cx="420" cy="200" r="14" fill="' + brass + '"/><circle cx="420" cy="200" r="5" fill="#2a1c0c"/>' +
      '<rect x="430" y="193" width="18" height="14" rx="4" fill="#5a4220"/>' +
      // shade, angled down onto the paper
      '<g transform="translate(178 64) rotate(18) scale(1.55)">' +
        '<rect x="-7" y="-6" width="14" height="20" rx="3" fill="' + brass + '"/>' +
        '<path d="M-17 12 L17 12 Q22 14 24 22 L50 78 Q0 93 -50 78 L-24 22 Q-22 14 -17 12Z" fill="url(#shade-' + u + ')"/>' +
        '<path d="M-8 18 L-30 72" stroke="rgba(255,255,255,.22)" stroke-width="4" stroke-linecap="round"/>' +
        '<ellipse cx="0" cy="78" rx="50" ry="11" fill="' + brass + '"/>' +
        '<ellipse class="lamp-mouth" cx="0" cy="79" rx="45" ry="8" fill="#fff0c2"/>' +
        '<ellipse class="lamp-bulb" cx="0" cy="76" rx="26" ry="14" fill="url(#bulb-' + u + ')"/>' +
      '</g>' +
      '<circle cx="178" cy="64" r="11" fill="' + brass + '"/><circle cx="178" cy="64" r="4" fill="#2a1c0c"/>' +
    '</g>' +
  '</svg>' +
  '<span class="lamp-post lamp-hit" aria-hidden="true"></span>' +
  '<svg class="lamp-base lamp-body" viewBox="0 0 160 44" aria-hidden="true">' +
    '<g class="lamp-hit">' +
      '<ellipse cx="80" cy="36" rx="68" ry="8" fill="#0d0804" opacity=".55"/>' +
      '<path d="M14 30 Q16 13 80 11 Q144 13 146 30 Q144 41 80 43 Q16 41 14 30Z" fill="' + brass + '"/>' +
      '<ellipse cx="80" cy="17" rx="48" ry="6" fill="#f6e2ac" opacity=".32"/>' +
      '<rect x="70" y="0" width="20" height="16" rx="3" fill="' + brass + '"/>' +
    '</g>' +
  '</svg>';
}

/* ---------- the study: windows, vines, lamp, fireflies ---------- */

/** Tiny deterministic RNG so each room's vines look the same every visit. */
function seeded(seed) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13; s >>>= 0;
    s ^= s >> 17;
    s ^= s << 5; s >>>= 0;
    return s / 4294967296;
  };
}

function makeWorldWindow(weather) {
  const w = document.createElement("div");
  w.className = "world-window stage-" + (weather || "calm");
  w.setAttribute("aria-hidden", "true");
  const pane = document.createElement("div");
  pane.className = "pane";
  pane.innerHTML =
    '<div class="sky"></div><div class="ground"></div><div class="rain"></div>' +
    '<div class="mullion-v"></div><div class="mullion-h"></div>';
  if (weather === "rain") {
    const x = 30 + Math.random() * 40;
    pane.querySelector(".sky").insertAdjacentHTML("afterend",
      '<svg class="bolt" viewBox="0 0 100 100" preserveAspectRatio="none">' +
        '<polyline points="' + x + ',0 ' + (x - 8) + ',26 ' + (x + 4) + ',30 ' + (x - 10) + ',58 ' +
          (x - 1) + ',61 ' + (x - 14) + ',100" fill="none" stroke="#f4f7ff" stroke-width="2.4" stroke-linejoin="bevel"/>' +
        '<polyline points="' + (x + 4) + ',30 ' + (x + 14) + ',44 ' + (x + 12) + ',56" fill="none" stroke="#dfe8ff" stroke-width="1.2"/>' +
      "</svg>");
  }
  const rain = pane.querySelector(".rain");
  for (let i = 0; i < 18; i++) {
    const s = document.createElement("span");
    s.style.left = (Math.random() * 100) + "%";
    s.style.animationDelay = (Math.random() * 0.7) + "s";
    s.style.animationDuration = (0.55 + Math.random() * 0.35) + "s";
    rain.appendChild(s);
  }
  for (let i = 0; i < 6; i++) {
    const p = document.createElement("div");
    p.className = "plant";
    p.style.left = (8 + i * 16 + (i % 2) * 3) + "%";
    p.style.height = (22 + (i % 3) * 12 + (i % 2) * 5) + "%";
    p.style.setProperty("--pw", String(0.65 + (i % 4) * 0.12));
    p.style.transitionDelay = (0.14 * i) + "s";
    p.innerHTML = '<i class="leaf l" style="top:35%"></i><i class="leaf r" style="top:55%"></i><i class="leaf t"></i>';
    pane.appendChild(p);
  }
  pane.insertAdjacentHTML("beforeend", '<div class="sash l"></div><div class="sash r"></div>');
  const wv = document.createElement("div");
  wv.className = "window-vines";
  wv.innerHTML = "<i></i><i></i><i></i>";
  pane.appendChild(wv);
  w.appendChild(pane);
  const sill = document.createElement("div");
  sill.className = "sill";
  w.appendChild(sill);
  return w;
}

/* Where vines enter the room and where they are heading (room-space %). */
const VINE_SEEDS = [
  { from: [-2, 104], to: [16, -6], t0: 0.22, t1: 0.58, w: 7, leaves: 5 },
  { from: [102, 104], to: [86, -6], t0: 0.24, t1: 0.6, w: 7, leaves: 5 },
  { from: [-3, 68], to: [30, 2], t0: 0.34, t1: 0.7, w: 6, leaves: 4 },
  { from: [103, 72], to: [70, 2], t0: 0.36, t1: 0.72, w: 6, leaves: 4 },
  { from: [34, 44], to: [8, 10], t0: 0.56, t1: 0.84, w: 5, leaves: 4 },
  { from: [66, 44], to: [94, 12], t0: 0.58, t1: 0.86, w: 5, leaves: 4 },
  { from: [0, 2], to: [52, 16], t0: 0.72, t1: 0.96, w: 4, leaves: 4 },
  { from: [100, 2], to: [48, 20], t0: 0.74, t1: 0.98, w: 4, leaves: 4 }
];

function vinePathData(rnd, from, to, wob) {
  let d = "M " + from[0].toFixed(1) + " " + from[1].toFixed(1);
  let px = from[0], py = from[1];
  const segs = 4;
  for (let i = 1; i <= segs; i++) {
    const t = i / segs;
    const nx = from[0] + (to[0] - from[0]) * t + (rnd() * 2 - 1) * wob;
    const ny = from[1] + (to[1] - from[1]) * t + (rnd() * 2 - 1) * wob * 0.7;
    const c1x = px + (nx - px) * 0.3 + (rnd() * 2 - 1) * wob;
    const c1y = py + (ny - py) * 0.3 + (rnd() * 2 - 1) * wob * 0.5;
    const c2x = px + (nx - px) * 0.72 - (rnd() * 2 - 1) * wob;
    const c2y = py + (ny - py) * 0.72;
    d += " C " + c1x.toFixed(1) + " " + c1y.toFixed(1) + ", " +
         c2x.toFixed(1) + " " + c2y.toFixed(1) + ", " +
         nx.toFixed(1) + " " + ny.toFixed(1);
    px = nx; py = ny;
  }
  return d;
}

/* Late-game vines that creep in from the edges of the screen itself (viewport %). */
const EDGE_VINE_SEEDS = [
  { from: [-2, 104], to: [4, 40], t0: 0.6, t1: 0.84, w: 6, leaves: 4 },
  { from: [102, 104], to: [96, 36], t0: 0.62, t1: 0.86, w: 6, leaves: 4 },
  { from: [-2, -4], to: [24, 4], t0: 0.72, t1: 0.92, w: 4, leaves: 3 },
  { from: [102, -4], to: [76, 5], t0: 0.74, t1: 0.94, w: 4, leaves: 3 }
];

/** First green: sprouts and moss along the skirting board, each with its own threshold. */
function buildSprouts(wall, seed) {
  const layer = document.createElement("div");
  layer.className = "room-sprouts";
  layer.setAttribute("aria-hidden", "true");
  const rnd = seeded(seed * 7919 + 3);
  for (let i = 0; i < 8; i++) {
    const s = document.createElement("i");
    const moss = i % 3 === 0;
    if (moss) s.className = "moss";
    const edge = rnd() < 0.7;
    s.style.left = (edge ? (rnd() < 0.5 ? rnd() * 18 : 82 + rnd() * 16) : 20 + rnd() * 60).toFixed(1) + "%";
    s.style.setProperty("--w", (moss ? 26 + rnd() * 40 : 14 + rnd() * 12).toFixed(0) + "px");
    s.style.setProperty("--h", (12 + rnd() * 22).toFixed(0) + "px");
    s.style.transitionDelay = (rnd() * 1.2).toFixed(2) + "s";
    s.dataset.t = (0.04 + (i / 8) * 0.4 + rnd() * 0.04).toFixed(3);
    layer.appendChild(s);
  }
  wall.appendChild(layer);
}

function buildOvergrowth() {
  if (document.getElementById("overgrowth")) return;
  const over = document.createElement("div");
  over.id = "overgrowth";
  over.setAttribute("aria-hidden", "true");
  document.body.appendChild(over);
  buildVines(over, 4242, EDGE_VINE_SEEDS, 4);
  const sun = document.createElement("div");
  sun.id = "sunlight";
  sun.setAttribute("aria-hidden", "true");
  document.body.appendChild(sun);
}

/** Rain rooms: every 6–14s, if a raining room is on screen, lightning then thunder. */
function startLightning() {
  if (startLightning.on || reduced) return;
  startLightning.on = true;
  const strike = () => {
    const room = [...document.querySelectorAll("#journey .study-room.raining")].find((r) => {
      if (r.closest(".beat").style.display === "none") return false;
      const b = r.getBoundingClientRect();
      return b.bottom > innerHeight * 0.25 && b.top < innerHeight * 0.75;
    });
    if (room) {
      room.classList.remove("flash");
      void room.offsetWidth;
      room.classList.add("flash");
      setTimeout(() => room.classList.remove("flash"), 1200);
      setTimeout(() => sfx("thunder"), 300 + Math.random() * 1100);
    }
    setTimeout(strike, room ? 6000 + Math.random() * 8000 : 2500);
  };
  setTimeout(strike, 2500);
}

/** Build one vine network (strands plus the leaves that ride them) inside `room`. */
function buildVines(room, seed, seeds = VINE_SEEDS, wobble = 9) {
  const layer = document.createElement("div");
  layer.className = "room-vines";
  layer.setAttribute("aria-hidden", "true");
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.setAttribute("preserveAspectRatio", "none");
  layer.appendChild(svg);
  room.appendChild(layer);

  const rnd = seeded(seed * 2654435761);
  const strands = [];
  seeds.forEach((s, i) => {
    const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
    p.setAttribute("d", vinePathData(rnd, s.from, s.to, wobble));
    p.setAttribute("stroke-width", String(s.w * 0.12));
    if (i % 3 === 2) p.classList.add("under");
    svg.appendChild(p);
    const leaves = [];
    for (let k = 0; k < s.leaves; k++) {
      const at = (k + 0.65) / (s.leaves + 0.3);
      const leaf = document.createElement("div");
      leaf.className = "vine-leaf" + (rnd() > 0.72 ? " pale" : "");
      const size = 11 + rnd() * 13;
      leaf.style.setProperty("--lw", size.toFixed(1) + "px");
      leaf.style.setProperty("--lh", (size * 0.62).toFixed(1) + "px");
      leaf.style.setProperty("--lr", (rnd() * 300 - 150).toFixed(0) + "deg");
      leaf.style.transitionDelay = (rnd() * 0.8).toFixed(2) + "s";
      layer.appendChild(leaf);
      leaves.push({ el: leaf, at });
      if (rnd() > 0.78) {
        const bud = document.createElement("div");
        bud.className = "vine-bud";
        layer.appendChild(bud);
        leaves.push({ el: bud, at: Math.min(0.97, at + 0.06) });
      }
    }
    strands.push({ path: p, spec: s, leaves, placed: false });
  });
  room._vines = strands;
  return layer;
}

/** Push a room's vines to growth g (0..1). */
function applyVines(room, g) {
  const strands = room._vines;
  if (!strands) return;
  strands.forEach((st) => {
    const len = st.len || (st.len = st.path.getTotalLength() || 100);
    const span = Math.max(0.01, st.spec.t1 - st.spec.t0);
    const p = Math.max(0, Math.min(1, (g - st.spec.t0) / span));
    st.path.style.setProperty("--len", len.toFixed(1));
    st.path.style.setProperty("--off", (len * (1 - p)).toFixed(1));
    // a zero-length dash still paints its round caps, stretched into streaks by the room's non-uniform scale
    st.path.classList.toggle("grown", p > 0);
    if (!st.placed && len > 1) {
      st.placed = true;
      st.leaves.forEach((lf) => {
        const pt = st.path.getPointAtLength(len * lf.at);
        lf.el.style.left = pt.x.toFixed(2) + "%";
        lf.el.style.top = pt.y.toFixed(2) + "%";
      });
    }
    st.leaves.forEach((lf) => {
      lf.el.classList.toggle("out", p >= lf.at * 0.96);
    });
  });
}

function buildFireflies(room, seed) {
  const layer = document.createElement("div");
  layer.className = "room-fireflies";
  layer.setAttribute("aria-hidden", "true");
  const rnd = seeded(seed * 97 + 7);
  for (let i = 0; i < 10; i++) {
    const f = document.createElement("i");
    f.className = "firefly";
    f.style.left = (4 + rnd() * 92) + "%";
    f.style.top = (8 + rnd() * 84) + "%";
    f.style.setProperty("--fx", (rnd() * 120 - 60).toFixed(0) + "px");
    f.style.setProperty("--fy", (rnd() * -90 - 10).toFixed(0) + "px");
    f.style.setProperty("--fd", (6 + rnd() * 9).toFixed(1) + "s");
    f.style.setProperty("--fb", (2.2 + rnd() * 3.4).toFixed(1) + "s");
    f.style.setProperty("--fdelay", (-rnd() * 8).toFixed(1) + "s");
    layer.appendChild(f);
  }
  room.appendChild(layer);
  return layer;
}

/** Set the overgrowth level for where the reader is and repaint every room.
 *  Snapped to 1/250 steps so scrolling doesn't restyle every vine each frame. */
function setGrowth(g) {
  const next = Math.round(Math.max(0, Math.min(1, g)) * 250) / 250;
  if (next === state.grow && state.growPainted) return;
  state.grow = next;
  state.growPainted = true;
  const plantT = Math.max(0, Math.min(1, (state.grow - 0.03) / 0.82));
  const vineWin = Math.max(0, Math.min(1, (state.grow - VINES_WINDOW_AT) / 0.34));
  document.querySelectorAll("#journey .study-room").forEach((room) => {
    applyVines(room, state.grow);
    room.querySelectorAll(".world-window").forEach((w) => {
      w.style.setProperty("--pg", String(plantT));
      w.style.setProperty("--wv", vineWin.toFixed(3));
      w.classList.toggle("open", state.grow >= WINDOW_OPEN_AT);
    });
  });
  document.querySelectorAll("#journey .room-sprouts i").forEach((s) => {
    s.classList.toggle("up", state.grow >= +s.dataset.t);
  });
  const over = document.getElementById("overgrowth");
  if (over) applyVines(over, state.grow);
  document.body.style.setProperty("--sun", Math.max(0, Math.min(1, (state.grow - 0.7) / 0.3)).toFixed(3));
  const stages = [
    ["growth-sprout", 0.05], ["growth-plants", 0.18], ["growth-vines", 0.42],
    ["growth-window", VINES_WINDOW_AT], ["growth-takeover", 0.78], ["growth-sun", 0.9]
  ];
  let stage = 0;
  stages.forEach(([cls, at]) => {
    const on = state.grow >= at;
    document.body.classList.toggle(cls, on);
    if (on) stage++;
  });
  const newStage = stage > (state.growStage || 0);
  state.growStage = Math.max(stage, state.growStage || 0);
  const lost = state.grow >= LAMP_LOST_AT;
  if (lost && !state.earned.has("fireflies")) {
    earn("fireflies");
    sfx("overtake");
  }
  state.lampLost = lost;
  document.querySelectorAll(".desk-lamp").forEach((l) => l.classList.toggle("overtaken", lost));
  document.body.classList.toggle("fireflies-on", lost);
  applyLampLight();
  if (newStage && state.grow > 0.15) sfx("grow");
}

function enterRoom(sec) {
  if (!sec || sec.style.display === "none") return;
  if (sec.dataset.poemId) {
    state.poemRoomsSeen.add(sec.dataset.poemId);
    maybeEarnPoemRooms();
  }
  const first = sec.querySelector('.poem-paper[data-pos="0"]') || sec.querySelector(".poem-paper");
  if (first) revealSheet(first);
}

function growthFromScroll() {
  const rooms = [...document.querySelectorAll("#journey > .beat.poem")]
    .filter((el) => el.style.display !== "none");
  if (!rooms.length) return state.grow;
  // nothing grows until you leave the first desk
  const start = (rooms[1] || rooms[0]).offsetTop - innerHeight * 0.42;
  const last = rooms[rooms.length - 1];
  const end = last.offsetTop + last.offsetHeight * 0.72;
  const y = (window.scrollY || 0) + innerHeight * 0.42;
  const t = Math.max(0, Math.min(1, (y - start) / Math.max(1, end - start)));
  return Math.pow(t, 1.18);
}

/** The lamp is the reading light until the vines take it. */
function applyLampLight() {
  const dark = state.lampLost || !state.lampOn;
  document.body.classList.toggle("lamp-off", dark);
  document.querySelectorAll(".desk-lamp").forEach((l) => {
    l.setAttribute("aria-pressed", dark ? "false" : "true");
    l.title = state.lampLost
      ? "The vines have taken the lamp — the fireflies light the room now"
      : (state.lampOn ? "Turn the desk lamp off" : "Turn the desk lamp on");
  });
}

function toggleLamp() {
  if (state.lampLost) { sfx("miss"); return; }
  state.lampOn = !state.lampOn;
  sfx("lamp");
  earn("lamp");
  applyLampLight();
}
