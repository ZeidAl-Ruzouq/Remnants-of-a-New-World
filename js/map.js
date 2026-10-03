/* The square maze map: layout, drawing, tracking and travel. */

/* Map: a square maze on a 6×6 grid. Corridors run orthogonally between rooms
   (optionally via empty cells). Four forks let you skip Warp, Errors, the Black
   Hole or the Error level (id "matrix"); three stops hang off the path to collect notes, and a stop
   on a branch you skip can't be reached. */
const CHART_CELL = 60;

const chartXY = (c, r) => ({ x: 30 + c * CHART_CELL, y: 30 + r * CHART_CELL });

const CHART_NODES = [
  { id: "search", label: "Search Page", short: "Search",   c: 0, r: 0 },
  { id: "p1",     label: "First Desk",  short: "Desk I",   c: 1, r: 0 },
  { id: "reveal", label: "Reveal",      short: "Reveal",   c: 2, r: 0 },
  { id: "p2",     label: "Second Desk", short: "Desk II",  c: 3, r: 0 },
  { id: "warp",   label: "Warp",        short: "Warp",     c: 4, r: 0 },
  { id: "p3",     label: "Third Desk",  short: "Desk III", c: 5, r: 0 },
  { id: "room",   label: "Ordinary Room", short: "Room",   c: 1, r: 1, stop: true },
  { id: "office", label: "Office",      short: "Office",   c: 4, r: 1, stop: true },
  { id: "shelter", label: "Shelter",    short: "Shelter",  c: 2, r: 2, stop: true },
  { id: "errors", label: "Errors",      short: "Errors",   c: 3, r: 2 },
  { id: "matrix", label: "Error",       short: "Error",    c: 2, r: 3 },
  { id: "p4",     label: "Fourth Desk", short: "Desk IV",  c: 4, r: 3 },
  { id: "nyan",   label: "Nyan Run",    short: "Nyan",     c: 4, r: 4 },
  { id: "hole",   label: "Black Hole",  short: "Hole",     c: 5, r: 4 },
  { id: "end",    label: "The End?",    short: "End?",     c: 0, r: 5 },
  { id: "p6",     label: "Last Desk",   short: "Desk VI",  c: 1, r: 5 },
  { id: "p5",     label: "Fifth Desk",  short: "Desk V",   c: 3, r: 5 }
].map((n) => Object.assign(n, chartXY(n.c, n.r)));

/* [a, b, via-cells] — via cells are the empty squares a corridor bends through */
const CHART_LINKS = [
  ["search", "p1"], ["p1", "reveal"], ["reveal", "p2"],
  ["p1", "room"], ["warp", "office"], ["matrix", "shelter"],
  ["p2", "warp"], ["warp", "p3"], ["p2", "errors"],
  ["p3", "errors", [[5, 2]]], ["p3", "p4", [[5, 3]]], ["errors", "p4", [[3, 3]]],
  ["p4", "nyan"], ["nyan", "hole"], ["hole", "p5", [[5, 5]]], ["nyan", "p5", [[3, 4]]],
  ["p5", "p6"], ["p5", "matrix", [[2, 5]]], ["matrix", "p6", [[1, 3]]],
  ["p6", "end"], ["end", "search"]
].map(([a, b, via]) => ({ a, b, via: via || [] }));

/* corridors that run out: [from-room, cells walked] */
const DEAD_ENDS = [
  { from: "room", via: [[1, 2]] }
];

function chartNode(id) {
  return CHART_NODES.find((n) => n.id === id);
}

function chartNeighbors(id) {
  return CHART_LINKS.filter((l) => l.a === id || l.b === id).map((l) => (l.a === id ? l.b : l.a));
}

/** Cell-by-cell walk of a corridor, used to know which squares are passages. */
function chartLinkCells(link) {
  const A = chartNode(link.a), B = chartNode(link.b);
  const stops = [[A.c, A.r]].concat(link.via, [[B.c, B.r]]);
  const cells = [];
  for (let i = 1; i < stops.length; i++) {
    let [c, r] = stops[i - 1];
    const [c2, r2] = stops[i];
    while (c !== c2 || r !== r2) {
      c += Math.sign(c2 - c);
      r += Math.sign(r2 - r);
      cells.push(c + "," + r);
    }
  }
  return cells;
}

function chartLinkPath(link) {
  const A = chartNode(link.a), B = chartNode(link.b);
  const pts = [A].concat(link.via.map(([c, r]) => chartXY(c, r)), [B]);
  return "M" + pts.map((p) => p.x + " " + p.y).join(" L");
}

function deadEndPath(d) {
  const pts = [chartNode(d.from)].concat(d.via.map(([c, r]) => chartXY(c, r)));
  return "M" + pts.map((p) => p.x + " " + p.y).join(" L");
}

function buildChartSvg() {
  const svg = document.getElementById("chart-svg");
  const size = CHART_CELL * 6;
  const used = new Set(CHART_NODES.map((n) => n.c + "," + n.r));
  CHART_LINKS.forEach((l) => chartLinkCells(l).forEach((k) => used.add(k)));
  DEAD_ENDS.forEach((d) => d.via.forEach(([c, r]) => used.add(c + "," + r)));
  let html = `<rect class="maze-ground" x="0" y="0" width="${size}" height="${size}"/>`;
  // solid rock wherever no room or corridor was carved
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 6; c++) {
      if (used.has(c + "," + r)) continue;
      html += `<rect class="maze-rock" x="${c * CHART_CELL + 3}" y="${r * CHART_CELL + 3}" width="${CHART_CELL - 6}" height="${CHART_CELL - 6}" rx="3"/>`;
    }
  }
  for (let i = 1; i < 6; i++) {
    html += `<line class="maze-grid" x1="${i * CHART_CELL}" y1="0" x2="${i * CHART_CELL}" y2="${size}"/>`;
    html += `<line class="maze-grid" x1="0" y1="${i * CHART_CELL}" x2="${size}" y2="${i * CHART_CELL}"/>`;
  }
  const paths = CHART_LINKS.map(chartLinkPath).concat(DEAD_ENDS.map(deadEndPath));
  paths.forEach((d) => { html += `<path class="maze-wall" d="${d}"/>`; });
  paths.forEach((d) => { html += `<path class="maze-floor" d="${d}"/>`; });
  DEAD_ENDS.forEach((d) => {
    const [c, r] = d.via[d.via.length - 1];
    const p = chartXY(c, r);
    html += `<path class="dead-x" d="M${p.x - 4} ${p.y - 4} L${p.x + 4} ${p.y + 4} M${p.x + 4} ${p.y - 4} L${p.x - 4} ${p.y + 4}"/>`;
  });
  CHART_LINKS.forEach((l) => {
    html += `<path class="web-link" data-a="${l.a}" data-b="${l.b}" d="${chartLinkPath(l)}"/>`;
  });
  CHART_NODES.forEach((n) => {
    html += `<g class="web-node${n.stop ? " stop" : ""}" data-id="${n.id}" role="button" tabindex="0" aria-label="${n.label}">
      <rect class="room" x="${n.x - 19}" y="${n.y - 19}" width="38" height="38" rx="4"/>
      <text x="${n.x}" y="${n.y + 3}" text-anchor="middle">${n.short}</text>
    </g>`;
  });
  html += `<rect class="maze-frame" x="1.5" y="1.5" width="${size - 3}" height="${size - 3}"/>`;
  const start = CHART_NODES.find((n) => n.id === "search");
  html += `<rect id="chart-you" x="${start.x - 24}" y="${start.y - 24}" width="48" height="48" rx="7"/>`;
  svg.innerHTML = html;
  refreshChart();
}

/** Paint visited / here / reachable / locked / off-route state onto the maze. */
function refreshChart() {
  const svg = document.getElementById("chart-svg");
  if (!svg) return;
  const gate = firstUnclearedGate();
  const here = state.hereNode;
  const near = new Set(chartNeighbors(here));
  svg.querySelectorAll(".web-node").forEach((g) => {
    const id = g.dataset.id;
    const target = id === "search" ? null : sectionForChart(id, true);
    const open = id === "search" || !state.journeyBuilt || (target && target.style.display !== "none");
    const locked = !!(target && open && gate && target.offsetTop > gate.offsetTop + 2);
    g.classList.toggle("visited", state.visited.has(id));
    g.classList.toggle("here", id === here);
    g.classList.toggle("off-route", !open);
    g.classList.toggle("locked", locked);
    g.classList.toggle("next", near.has(id) && !locked);
  });
  svg.querySelectorAll(".web-link").forEach((l) => {
    const a = l.dataset.a, b = l.dataset.b;
    l.classList.toggle("on", state.visited.has(a) && state.visited.has(b));
    l.classList.toggle("next", a === here || b === here);
  });
  const node = chartNode(here);
  const you = document.getElementById("chart-you");
  if (you && node) {
    you.setAttribute("x", node.x - 24);
    you.setAttribute("y", node.y - 24);
  }
}

function chartMsg(text) {
  const m = document.getElementById("chart-msg");
  if (m) m.textContent = text || "";
}

/** Walking a corridor commits you to the route it implies. */
function applyTravelRoute(from, to) {
  if (to === "room") chooseRoute("room", "visit");
  if (to === "office") { chooseRoute("mid", "warp"); chooseRoute("office", "visit"); }
  if (to === "shelter") { chooseRoute("late", "matrix"); chooseRoute("shelter", "visit"); }
  if (to === "warp" || to === "p3") chooseRoute("mid", "warp");
  if (to === "errors") {
    if (from === "p2") chooseRoute("mid", "skip");
    chooseRoute("errors", "visit");
  }
  if (to === "p4" && from === "p3") chooseRoute("errors", "skip");
  if (to === "matrix") chooseRoute("late", "matrix");
  if (to === "p6" && from === "p5") chooseRoute("late", "skip");
  if (to === "hole" && state.path !== "hole") {
    if (!state.path) choosePath("hole");
    else { state.path = "hole"; earn("path-hole"); applyBranchVisibility(); }
  }
  if (to === "p5" && from === "nyan" && !state.path) choosePath("memory");
}

/** Move along the maze: any corridor from where you stand, or back to a room you know. */
function travelTo(id) {
  const from = state.hereNode;
  if (id === from) { chartMsg("You are already here."); return; }
  if (!chartNeighbors(from).includes(id) && !state.visited.has(id)) {
    sfx("miss");
    chartMsg("No corridor from here — move room by room, or return somewhere you've been.");
    return;
  }
  if (id === "search") { sfx("click"); chartMsg(""); forceScrollY(0); return; }
  applyTravelRoute(from, id);
  const target = sectionForChart(id);
  if (!target) { sfx("miss"); chartMsg("That room is closed on this route."); return; }
  const gate = firstUnclearedGate();
  if (gate && target.offsetTop > gate.offsetTop + 2) {
    sfx("miss");
    chartMsg("Locked — clear " + (gate.dataset.chartLabel || "the level") + " first.");
    forceScrollY(gate.offsetTop);
    return;
  }
  sfx("click");
  chartMsg("");
  arriveAt(target, id);
}

let jumpTimer = null;

/** Jump the scroll straight to `target`. Transitions are switched off for the
 *  jump so the whole environment snaps to the new place instead of animating
 *  every vine, window and mood change between here and there at once. */
function jumpTo(target) {
  document.body.classList.add("jumping");
  forceScrollY(target.offsetTop);
  state.furthestScroll = Math.max(state.furthestScroll, target.offsetTop);
  onScroll();
  clearTimeout(jumpTimer);
  jumpTimer = setTimeout(() => document.body.classList.remove("jumping"), 350);
}

function arriveAt(target, id) {
  jumpTo(target);
  updateChartHere(target.dataset.chartLabel || id, id);
  markVisited(id);
  if (target.classList.contains("poem")) enterRoom(target);
}

function sectionForChart(id, includeHidden) {
  return [...document.querySelectorAll("#journey > .beat, #closing, #achievements, #reflection, #refs")]
    .find((s) => s.dataset.chart === id && (includeHidden || s.style.display !== "none")) || null;
}

function updateChartHere(label, nodeId) {
  if (state.here === label && state.hereNode === nodeId) return;
  state.here = label;
  state.hereNode = nodeId;
  const el = document.getElementById("chart-here");
  if (el) el.textContent = label;
  refreshChart();
}

function markVisited(nodeId) {
  if (!nodeId) return;
  state.visited.add(nodeId);
  // Chart presence only — level achievements come from clearLevel / gameplay
  if (nodeId === "warp") earn("warp");
  if (nodeId === "end") earn("end");
  if (CHART_NODES.every((n) => state.visited.has(n.id))) earn("maze-all");
  refreshChart();
}

function syncChartFromScroll() {
  const sections = [...document.querySelectorAll("#journey > .beat, #closing, #achievements, #reflection, #refs")]
    .filter((el) => el.style.display !== "none" && el.dataset.chart);
  let best = null;
  let bestScore = -Infinity;
  const mark = innerHeight * 0.38;
  sections.forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.bottom < 48 || r.top > innerHeight - 48) return;
    const overlap = Math.min(r.bottom, innerHeight) - Math.max(r.top, 0);
    const center = (r.top + r.bottom) / 2;
    const score = overlap - Math.abs(center - mark) * 0.35;
    if (score > bestScore) {
      bestScore = score;
      best = el;
    }
  });
  if (!best) return;
  updateChartHere(best.dataset.chartLabel || best.dataset.chart, best.dataset.chart);
  markVisited(best.dataset.chart);
  if (best.classList.contains("poem")) enterRoom(best);
}

function toggleChart(open) {
  const chart = document.getElementById("chart");
  const on = open != null ? open : !chart.classList.contains("open");
  chart.classList.toggle("open", on);
  chart.setAttribute("aria-hidden", on ? "false" : "true");
  if (on) sfx("click");
}

function wireChartJumps() {
  const svg = document.getElementById("chart-svg");
  svg.addEventListener("click", (ev) => {
    const g = ev.target.closest(".web-node");
    if (g) travelTo(g.dataset.id);
  });
  svg.addEventListener("keydown", (ev) => {
    const g = ev.target.closest(".web-node");
    if (!g || (ev.key !== "Enter" && ev.key !== " ")) return;
    ev.preventDefault();
    travelTo(g.dataset.id);
  });
}
