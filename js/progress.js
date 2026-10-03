/* Progress: achievements, routes and branches, doors, notes. */

function maybeEarnPoemRooms() {
  const rooms = [...document.querySelectorAll("#journey > .beat.poem:not(.stop)")];
  if (!rooms.length) return;
  if (rooms.every((el) => state.poemRoomsSeen.has(el.dataset.poemId))) earn("poem-rooms");
}

function earn(id) {
  if (!id || state.earned.has(id)) return;
  state.earned.add(id);
  renderAchievements();
}

function branchVisible(branch) {
  if (!branch) return true;
  const r = state.routes;
  if (branch === "room") return r.room === "visit";
  if (branch === "office") return r.mid !== "skip" && r.office === "visit";
  if (branch === "shelter") return r.late !== "skip" && r.shelter === "visit";
  if (branch === "warp") return r.mid !== "skip";
  if (branch === "errors") return r.mid === "skip" || r.errors !== "skip";
  if (branch === "hole") return state.path === "hole";
  if (branch === "memory") return state.path === "memory";
  if (branch === "matrix") return r.late !== "skip";
  return true;
}

function applyBranchVisibility() {
  document.querySelectorAll("#journey [data-branch]").forEach((el) => {
    el.style.display = branchVisible(el.dataset.branch) ? "" : "none";
  });
  document.querySelectorAll(".door-choice button").forEach((btn) => {
    const cur = state.routes[btn.dataset.kind];
    btn.classList.toggle("on", cur === btn.dataset.value || (!cur && btn.dataset.main === "1"));
  });
  refreshGateMax();
  refreshChart();
}

/* routes can be re-chosen on the map — walking back into a skipped room reopens it */
const ROUTE_ACHIEVEMENT = {
  "mid:skip": "path-skip-warp",
  "errors:skip": "path-skip-errors",
  "late:skip": "path-skip-matrix",
  "room:visit": "stop-room",
  "office:visit": "stop-office",
  "shelter:visit": "stop-shelter"
};

function chooseRoute(kind, value) {
  if (!(kind in state.routes) || state.routes[kind] === value) return;
  state.routes[kind] = value;
  earn(ROUTE_ACHIEVEMENT[kind + ":" + value]);
  sfx("path");
  applyBranchVisibility();
}

function choosePath(path) {
  if (state.path) return;
  if (path !== "hole" && path !== "memory") return;
  state.path = path;
  state.pathChoiceShown = true;
  state.nyanForkAt = Math.max(0.5, Math.min(state.nyanP || 0.52, 0.6));
  if (path === "hole") earn("path-hole");
  if (path === "memory") earn("path-memory");
  sfx("path");
  const choice = document.getElementById("path-choice");
  if (choice) choice.classList.remove("show");
  const world = document.getElementById("nyan-world");
  if (world) {
    world.classList.toggle("axis-y", path === "memory");
    world.classList.toggle("axis-x", path === "hole");
    // Reliable geometry switch for the fork
    if (path === "memory") {
      world.style.height = "220%";
      world.style.width = "260vw";
    } else {
      world.style.height = "140%";
      world.style.width = "300vw";
    }
  }
  applyBranchVisibility();
  refreshChart();
  // nudge progress past the fork so ride continues on the chosen axis
  state.nyanP = Math.max(state.nyanP, (state.nyanForkAt || 0.52) + 0.01);
  // allow nyan clear to complete after choice if already at end
  const ride = document.querySelector(".beat.found.nyan-ride");
  if (ride && state.nyanP >= 1) clearLevel(ride);
}

function collectWallNote(note) {
  if (!note) return;
  openNoteReader(note);
  if (note.dataset.got === "1") return;
  note.dataset.got = "1";
  note.classList.add("got");
  state.notesCollected += 1;
  sfx("pickup");
  if (state.notesCollected >= 1) earn("notes");
  maybeEarnAllNotes();
}

/** Show a wall note full size so it can be read. */
function openNoteReader(note) {
  const reader = document.getElementById("note-reader");
  const entry = REFLECTION_NOTES[+note.dataset.note];
  if (!reader || !entry) return;
  reader.querySelector(".nr-text").textContent = entry.text;
  reader.querySelector(".nr-count").textContent = "note " + (+note.dataset.note + 1) + " / " + REFLECTION_NOTES.length;
  reader.hidden = false;
  requestAnimationFrame(() => reader.classList.add("show"));
  state.readerAtY = window.scrollY || 0;
}

function closeNoteReader() {
  const reader = document.getElementById("note-reader");
  if (!reader || reader.hidden) return;
  reader.classList.remove("show");
  setTimeout(() => { if (!reader.classList.contains("show")) reader.hidden = true; }, 250);
}

function maybeEarnAllNotes() {
  const all = [...document.querySelectorAll("#journey .beat.poem .local-notes .note")];
  const visible = all.filter((n) => {
    const beat = n.closest(".beat");
    return beat && beat.style.display !== "none";
  });
  const visibleGot = visible.filter((n) => n.dataset.got === "1").length;
  const allGot = all.filter((n) => n.dataset.got === "1").length;
  if (visible.length && visibleGot >= visible.length) earn("notes-all");
  const nyanDone = state.nyanCollected >= state.nyanBitsTotal;
  const matrixSec = document.querySelector('#journey > .beat[data-chart="matrix"]');
  const matrixOnRoute = !!(matrixSec && matrixSec.style.display !== "none");
  const matrixDone = !matrixOnRoute || state.matrixCaught >= state.matrixNeed;
  if (all.length && allGot >= all.length && nyanDone && matrixDone) earn("notes-complete");
}

function renderAchievements() {
  const list = document.getElementById("ach-list");
  if (!list) return;
  const mode = list.dataset.mode || "all";
  const earnedN = ACHIEVEMENTS.filter((a) => state.earned.has(a.id)).length;
  const totalN = ACHIEVEMENTS.length;
  const countEl = document.getElementById("ach-count");
  if (countEl) {
    countEl.innerHTML = "Earned <b>" + earnedN + "</b> / " + totalN + " possible";
  }
  const bar = document.getElementById("ach-bar-fill");
  if (bar) bar.style.width = Math.round((earnedN / totalN) * 100) + "%";
  list.innerHTML = "";
  let shown = 0;
  ACHIEVEMENT_GROUPS.forEach((group) => {
    const items = ACHIEVEMENTS.filter((a) => {
      if ((a.group || "journey") !== group.id) return false;
      const earned = state.earned.has(a.id);
      if (mode === "earned" && !earned) return false;
      if (mode === "missed" && earned) return false;
      return true;
    });
    if (!items.length) return;
    const wrap = document.createElement("div");
    wrap.className = "ach-group";
    wrap.innerHTML = "<h3>" + group.label + "</h3>";
    const ul = document.createElement("ul");
    items.forEach((a) => {
      const earned = state.earned.has(a.id);
      const li = document.createElement("li");
      li.className = earned ? "earned" : "";
      li.innerHTML =
        "<span>" + a.label +
        (a.hint ? '<span class="hint">' + a.hint + "</span>" : "") +
        "</span><span class=\"mark\">" + (earned ? "DONE" : "LOCKED") + "</span>";
      ul.appendChild(li);
      shown += 1;
    });
    wrap.appendChild(ul);
    list.appendChild(wrap);
  });
  if (!shown) {
    const li = document.createElement("div");
    li.textContent = mode === "earned" ? "None yet — keep going." : "Nothing missed — you found every route.";
    list.appendChild(li);
  }
}

function buildDoorChoice(kind) {
  const box = document.createElement("div");
  box.className = "door-choice";
  // forks offer both ways every time you come back; stops stay open once visited
  const doors = {
    p1: [{ label: "Stop → Ordinary Room", hint: "notes", kind: "room", value: "visit", to: "room" }],
    p2: [
      { label: "Main path → Warp", hint: "Warp, Desk III", kind: "mid", value: "warp", to: "warp", main: true },
      { label: "Shortcut → Errors", hint: "skips Warp and Desk III", kind: "mid", value: "skip", to: "errors" }
    ],
    warp: [{ label: "Stop → Office", hint: "notes", kind: "office", value: "visit", to: "office" }],
    p3: [
      { label: "Main path → Errors", hint: "Errors", kind: "errors", value: "visit", to: "errors", main: true },
      { label: "Shortcut → Desk IV", hint: "skips Errors", kind: "errors", value: "skip", to: "p4" }
    ],
    p5: [
      { label: "Main path → Error", hint: "Error", kind: "late", value: "matrix", to: "matrix", main: true },
      { label: "Shortcut → Last Desk", hint: "skips Error", kind: "late", value: "skip", to: "p6" }
    ],
    matrix: [{ label: "Stop → Shelter", hint: "notes", kind: "shelter", value: "visit", to: "shelter" }]
  };
  (doors[kind] || []).forEach((d) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.innerHTML = d.label + '<small>' + d.hint + "</small>";
    btn.dataset.kind = d.kind;
    btn.dataset.value = d.value;
    if (d.main) btn.dataset.main = "1";
    btn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      chooseRoute(d.kind, d.value);
      const next = sectionForChart(d.to);
      if (!next) return;
      const gate = firstUnclearedGate();
      if (gate && next.offsetTop > gate.offsetTop + 2) { sfx("miss"); return; }
      sfx("click");
      arriveAt(next, d.to);
    });
    box.appendChild(btn);
  });
  return box;
}
