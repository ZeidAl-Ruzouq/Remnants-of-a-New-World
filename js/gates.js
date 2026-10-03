/* Level gates: scroll locking so uncleared levels cannot be skipped. */

/* ---------- hard level scroll lock (anti-skip) ---------- */
function firstUnclearedGate() {
  return [...document.querySelectorAll('.beat.found[data-level]:not([data-cleared="1"])')]
    .find((el) => el.style.display !== "none") || null;
}

function refreshGateMax() {
  const gate = firstUnclearedGate();
  if (!gate) {
    state.gateMax = null;
    return null;
  }
  // Max scroll = bottom of gate section aligned to viewport bottom
  // For 100vh levels this is ~ gate.offsetTop
  state.gateMax = gate.offsetTop + Math.max(0, gate.offsetHeight - innerHeight);
  return gate;
}

function forceScrollY(y) {
  state.clamping = true;
  const html = document.documentElement;
  const prev = html.style.scrollBehavior;
  html.style.scrollBehavior = "auto";
  window.scrollTo(0, y);
  html.scrollTop = y;
  document.body.scrollTop = y;
  html.style.scrollBehavior = prev;
  state.clamping = false;
}

function clampScrollNow() {
  refreshGateMax();
  if (state.gateMax == null) return;
  const y = window.scrollY || document.documentElement.scrollTop || 0;
  if (y > state.gateMax + 0.5) forceScrollY(state.gateMax);
}

function wireScrollGate() {
  addEventListener("wheel", (e) => {
    refreshGateMax();
    if (state.gateMax == null) return;
    const y = window.scrollY || 0;
    if (e.deltaY > 0 && y >= state.gateMax - 1) {
      e.preventDefault();
      forceScrollY(state.gateMax);
    }
  }, { passive: false });

  addEventListener("scroll", () => {
    if (state.clamping) return;
    state.furthestScroll = Math.max(state.furthestScroll, window.scrollY || 0);
    clampScrollNow();
    onScroll();
  }, { passive: true });

  addEventListener("touchmove", () => {
    requestAnimationFrame(clampScrollNow);
  }, { passive: true });

  addEventListener("touchend", () => {
    requestAnimationFrame(clampScrollNow);
    setTimeout(clampScrollNow, 50);
    setTimeout(clampScrollNow, 150);
  }, { passive: true });

  addEventListener("keydown", (e) => {
    refreshGateMax();
    if (state.gateMax == null) return;
    const y = window.scrollY || 0;
    const downKeys = ["PageDown", "ArrowDown", " ", "Spacebar", "End"];
    if (downKeys.includes(e.key) && y >= state.gateMax - 1) {
      e.preventDefault();
      forceScrollY(state.gateMax);
    }
  });

  addEventListener("hashchange", () => {
    requestAnimationFrame(clampScrollNow);
    setTimeout(clampScrollNow, 0);
  });

  // continuous rAF catch for fling / lag / scrollbar drag
  (function gateLoop() {
    clampScrollNow();
    requestAnimationFrame(gateLoop);
  })();
}

function canScrollToEl(el) {
  if (!el || el.style.display === "none") return false;
  const gate = firstUnclearedGate();
  if (gate && el.offsetTop > gate.offsetTop + 2) return false;
  if (el.offsetTop > state.furthestScroll + innerHeight * 0.85) return false;
  return true;
}

function jumpToSection(el) {
  if (!el || !canScrollToEl(el)) return false;
  const html = document.documentElement;
  const prev = html.style.scrollBehavior;
  html.style.scrollBehavior = "auto";
  el.scrollIntoView({ block: "start" });
  html.style.scrollBehavior = prev;
  requestAnimationFrame(clampScrollNow);
  return true;
}

function clearLevel(sec) {
  if (!sec || sec.dataset.cleared === "1") return;
  sec.dataset.cleared = "1";
  sfx("clear");
  if (sec.dataset.chart) {
    state.visited.add(sec.dataset.chart);
    const chart = sec.dataset.chart;
    if (chart === "reveal") earn("reveal");
    if (chart === "errors") earn("errors");
    if (chart === "nyan") {
      earn("nyan");
      if (state.nyanCollected >= state.nyanBitsTotal) earn("nyan-lines");
    }
    if (chart === "hole") earn("hole");
    if (chart === "matrix") {
      earn("matrix");
      if (state.matrixCaught >= state.matrixNeed) earn("matrix-all");
    }
    if (chart === "end") earn("end");
  }
  maybeEarnLevels();
  refreshGateMax();
}

function maybeEarnLevels() {
  // the black hole only counts on the X route, so check the levels actually on screen
  const levels = [...document.querySelectorAll("#journey > .beat.found[data-level]")]
    .filter((el) => el.style.display !== "none");
  if (levels.length && levels.every((el) => el.dataset.cleared === "1")) earn("levels");
}

function unlockGatesBefore(el) {
  if (!el) return;
  document.querySelectorAll('.beat.found[data-level]:not([data-cleared="1"])').forEach((g) => {
    if (g.style.display === "none") return;
    if (g.offsetTop < el.offsetTop - 1) g.dataset.cleared = "1";
  });
  refreshGateMax();
}
