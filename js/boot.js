/* Opening search, begin(), and boot wiring. Loaded last. */

const DEFAULT_QUERY = "remnants of a new world";

function normalizeSearchQuery(q) {
  return String(q || "").trim().toLowerCase().replace(/\s+/g, " ");
}

function resolveSearchDest(q) {
  const n = normalizeSearchQuery(q);
  if (!n || n === DEFAULT_QUERY) return "start";
  if (n === "new world") return "end";
  return "random";
}

let soundMutedByUser = false;

function begin(e) {
  if (e) e.preventDefault();
  if (!soundMutedByUser) setSound(true);
  sfx("dest");
  const opening = document.getElementById("opening");
  const journey = document.getElementById("journey");
  // I'm Feeling Lucky always mid-journey teleports (ignore query text)
  const submitter = e && e.submitter;
  const lucky = !!(submitter && submitter.name === "lucky");
  const dest = lucky ? "random" : resolveSearchDest(document.getElementById("search-q").value);
  if (lucky) { state.usedLucky = true; earn("lucky"); }
  if (dest === "random" && !lucky) { state.usedRandom = true; earn("random"); }
  if (dest === "random" && lucky) { state.usedRandom = true; /* lucky already earned */ }
  document.body.classList.remove("locked");
  journey.classList.add("on");
  // Non-default / lucky: hide journey until scroll target is applied (no flash of start)
  if (dest !== "start") journey.classList.add("prejump");
  document.getElementById("map-btn").style.display = "block";
  buildJourney();
  const first = document.querySelector("#journey > .beat.poem, #journey > .beat");
  if (first && first.dataset.chart) {
    updateChartHere(first.dataset.chartLabel || first.dataset.chart, first.dataset.chart);
    markVisited(first.dataset.chart);
  }

  const finishReveal = () => {
    if (dest === "end") {
      const end =
        document.querySelector('#journey > .beat.found .slide[data-end]')?.closest(".beat") ||
        document.querySelector('#journey > .beat[data-chart="end"]') ||
        document.getElementById("closing");
      teleportTo(end);
    } else if (dest === "random") {
      teleportTo(pickRandomMidBeat());
    } else {
      forceScrollY(0);
    }
    onScroll();
    clampScrollNow();
    // Reveal at destination, then fade the search overlay
    journey.classList.remove("prejump");
    opening.classList.add("go");
    setTimeout(() => { opening.hidden = true; }, 900);
  };

  // Wait for layout so offsetTop is accurate before teleport / paint
  requestAnimationFrame(() => requestAnimationFrame(finishReveal));
}

buildStage();
document.getElementById("search-form").addEventListener("submit", begin);
document.getElementById("sound-toggle").addEventListener("click", () => {
  setSound(!state.sound);
  soundMutedByUser = !state.sound;
  sfx("click");
});
document.getElementById("map-btn").addEventListener("click", () => toggleChart());
document.getElementById("chart-close").addEventListener("click", () => toggleChart(false));
wireChartJumps();
document.getElementById("note-reader").addEventListener("click", closeNoteReader);
addEventListener("keydown", (ev) => { if (ev.key === "Escape") closeNoteReader(); });
addEventListener("scroll", () => {
  if (Math.abs((window.scrollY || 0) - state.readerAtY) > 160) closeNoteReader();
}, { passive: true });
(function gameLoop() {
  updateNyanRide();
  updateHoleRide();
  requestAnimationFrame(gameLoop);
})();
