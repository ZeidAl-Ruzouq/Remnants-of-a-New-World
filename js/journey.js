/* Journey builder, scroll handling and teleporting. */

/** Back-wall text for the warp room — only the Warp piece's own two lines,
 *  repeated and doubled so the scroll loop is seamless. */
function warpWallCode() {
  const lines = ["> print(\"HelloWorld\")", "Code does not work", ""];
  const block = Array.from({ length: 12 }, () => lines.join("\n")).join("\n");
  return (block + "\n" + block).replace(/</g, "&lt;");
}

function preloadJourneyAssets() {
  document.querySelectorAll("#journey img").forEach((img) => {
    img.loading = "eager";
    img.decoding = "async";
    if (img.getAttribute("src")) {
      const pre = new Image();
      pre.src = img.src;
    }
  });
  ["assets/warp.jpg"].forEach((src) => {
    const pre = new Image();
    pre.src = src;
  });
}

/** Fill an element with text; *like this* becomes italic. */
function fillRichText(el, str) {
  const re = /\*([^*]+)\*/g;
  let last = 0, m;
  while ((m = re.exec(str))) {
    if (m.index > last) el.appendChild(document.createTextNode(str.slice(last, m.index)));
    const i = document.createElement("i");
    i.textContent = m[1];
    el.appendChild(i);
    last = m.index + m[0].length;
  }
  if (last < str.length) el.appendChild(document.createTextNode(str.slice(last)));
}

function appendEssayBlock(parent, block) {
  if (block.quote) {
    const q = document.createElement("blockquote");
    block.quote.forEach((line) => {
      const l = document.createElement("span");
      l.textContent = line;
      q.appendChild(l);
    });
    parent.appendChild(q);
    return;
  }
  const p = document.createElement("p");
  fillRichText(p, block.p);
  parent.appendChild(p);
}

function appendApaEntry(list, entry) {
  const li = document.createElement("li");
  entry.parts.forEach((part) => {
    if (part.italic) {
      const i = document.createElement("i");
      i.textContent = part.italic;
      li.appendChild(i);
    } else {
      li.appendChild(document.createTextNode(part.text));
    }
  });
  if (entry.href) {
    const a = document.createElement("a");
    a.href = entry.href;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.textContent = entry.href;
    li.appendChild(a);
  }
  list.appendChild(li);
}

function appendApaList(parent, title, entries) {
  const h = document.createElement("h2");
  h.textContent = title;
  parent.appendChild(h);
  const ul = document.createElement("ul");
  ul.className = "apa-list";
  entries.forEach((entry) => appendApaEntry(ul, entry));
  parent.appendChild(ul);
}

/* build interleaved journey */

function buildJourney() {
  const root = document.getElementById("journey");
  // Avoid remounting rooms if journey already exists (re-submit / late observers)
  if (state.journeyBuilt && root.children.length) return;
  if (beatIo) { try { beatIo.disconnect(); } catch (_) {} beatIo = null; }
  if (lineIo) { try { lineIo.disconnect(); } catch (_) {} lineIo = null; }
  root.innerHTML = "";
  state.notesTotal = 0;
  state.notesCollected = 0;
  state.poemRoomsSeen = new Set();

  JOURNEY.forEach((step, stepIdx) => {
    if (step.type === "poem") {
      const rooms = step.rooms || [ROOMS[0]];
      const main = rooms[rooms.length - 1];
      const sheetIdx = rooms.reduce((all, r) => all.concat(r.sheets), []);
      const sec = document.createElement("section");
      sec.className = "beat poem" + (main.stop ? " stop" : "");
      sec.dataset.zone = main.grow < 0.3 ? "science" : main.grow < 0.8 ? "flatline" : "end";
      sec.dataset.chart = main.id;
      sec.dataset.chartLabel = main.name;
      sec.dataset.poemId = main.id;
      sec.dataset.grow = String(main.grow);
      sec.dataset.weather = main.weather;
      if (step.branch) sec.dataset.branch = step.branch;

      const room = document.createElement("div");
      room.className = "study-room";
      if (main.weather === "rain") room.classList.add("raining");

      const wall = document.createElement("div");
      wall.className = "study-wall";

      // this room's notes from the reflection, pinned around the windows
      const local = document.createElement("div");
      local.className = "local-notes";
      const spots = main.stop ? NOTE_SPOTS.stop : NOTE_SPOTS.desk;
      REFLECTION_NOTES.map((entry, idx) => ({ entry, idx }))
        .filter(({ entry }) => entry.room === main.id)
        .forEach(({ entry, idx }, k) => {
          const [nx, ny] = spots[k % spots.length];
          const n = document.createElement("button");
          n.type = "button";
          n.className = "note tape" + ((idx + k) % 2 ? " ruled" : "");
          n.dataset.note = String(idx);
          n.style.left = nx + "%";
          n.style.top = ny + "%";
          n.style.setProperty("--r", (((idx * 7) % 5) - 2) * 3 + "deg");
          n.title = "Read note";
          n.setAttribute("aria-label", "Read note " + (idx + 1));
          const sc = document.createElement("div");
          sc.className = "scribble";
          sc.textContent = entry.text;
          n.appendChild(sc);
          n.addEventListener("click", (ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            collectWallNote(n);
          });
          local.appendChild(n);
          state.notesTotal += 1;
        });
      wall.appendChild(local);

      const windows = document.createElement("div");
      windows.className = "windows-row";
      windows.appendChild(makeWorldWindow(main.weather));
      windows.appendChild(makeWorldWindow(main.weather));
      wall.appendChild(windows);
      buildSprouts(wall, stepIdx + 3);
      room.appendChild(wall);

      if (main.stop) {
        buildVines(room, stepIdx + 3);
        const dark = document.createElement("div");
        dark.className = "room-dark";
        dark.setAttribute("aria-hidden", "true");
        room.appendChild(dark);
        if (main.weather === "rain") {
          const bolt = document.createElement("div");
          bolt.className = "room-lightning";
          bolt.setAttribute("aria-hidden", "true");
          room.appendChild(bolt);
        }
        sec.appendChild(room);
        root.appendChild(sec);
        return;
      }

      const desk = document.createElement("div");
      desk.className = "study-desk";
      const surface = document.createElement("div");
      surface.className = "desk-surface";

      // papers for this desk, stacked — the reader shuffles through them
      const paperCol = document.createElement("div");
      paperCol.className = "paper-col";
      const stack = document.createElement("div");
      stack.className = "paper-stack";
      sheetIdx.forEach((si, pos) => {
        const sheet = SHEETS[si];
        if (!sheet) return;
        const paper = document.createElement("article");
        paper.className = "poem-paper";
        paper.dataset.sheet = String(si);
        paper.dataset.idx = String(pos);
        paper.setAttribute("aria-label", "Sheet " + sheet.label);
        const no = document.createElement("div");
        no.className = "sheet-no";
        no.textContent = sheet.label;
        paper.appendChild(no);
        if (si === 0 && typeof POEM_TITLE === "string" && POEM_TITLE) {
          const title = document.createElement("h3");
          title.className = "poem-title";
          title.textContent = POEM_TITLE;
          paper.appendChild(title);
        }
        sheet.lines.forEach((text, li) => {
          const p = document.createElement("p");
          p.className = "line";
          p.style.setProperty("--i", String(li));
          p.textContent = text;
          paper.appendChild(p);
        });
        paper.addEventListener("click", () => {
          if (paper.dataset.pos === "0") return;
          showSheet(sec, pos);
        });
        stack.appendChild(paper);
      });
      paperCol.appendChild(stack);

      const tabs = document.createElement("div");
      tabs.className = "sheet-tabs";
      const prev = document.createElement("button");
      prev.type = "button";
      prev.className = "sheet-prev";
      prev.textContent = "‹ Prev sheet";
      const count = document.createElement("span");
      count.className = "sheet-count";
      const next = document.createElement("button");
      next.type = "button";
      next.className = "sheet-next";
      next.textContent = "Next sheet ›";
      tabs.appendChild(prev);
      sheetIdx.forEach((si, pos) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "sheet-dot";
        dot.dataset.pos = String(pos);
        dot.textContent = SHEETS[si] ? SHEETS[si].label : String(pos + 1);
        dot.addEventListener("click", () => showSheet(sec, pos));
        tabs.appendChild(dot);
      });
      tabs.appendChild(count);
      tabs.appendChild(next);
      prev.addEventListener("click", () => showSheet(sec, (+sec.dataset.sheetPos || 0) - 1));
      next.addEventListener("click", () => showSheet(sec, (+sec.dataset.sheetPos || 0) + 1));
      if (sheetIdx.length) paperCol.appendChild(tabs);

      // the lamp lives in the paper column so its head always hangs over the top sheet
      const light = document.createElement("div");
      light.className = "lamp-light";
      light.setAttribute("aria-hidden", "true");
      light.innerHTML = '<span class="lamp-cone"></span><span class="lamp-pool"></span>';
      paperCol.appendChild(light);
      const lamp = document.createElement("button");
      lamp.type = "button";
      lamp.className = "desk-lamp";
      lamp.setAttribute("aria-pressed", "true");
      lamp.setAttribute("aria-label", "Desk lamp");
      lamp.innerHTML = lampSvg("l" + stepIdx) +
        '<span class="lamp-vines"><i></i><i></i><i></i><i></i></span>';
      lamp.addEventListener("click", (ev) => {
        ev.stopPropagation();
        toggleLamp();
      });
      paperCol.appendChild(lamp);

      surface.appendChild(paperCol);
      desk.appendChild(surface);
      if (step.doors) desk.appendChild(buildDoorChoice(step.doors));
      room.appendChild(desk);

      buildVines(room, stepIdx + 3);
      buildFireflies(room, stepIdx + 3);
      const dark = document.createElement("div");
      dark.className = "room-dark";
      dark.setAttribute("aria-hidden", "true");
      room.appendChild(dark);
      if (main.weather === "rain") {
        const bolt = document.createElement("div");
        bolt.className = "room-lightning";
        bolt.setAttribute("aria-hidden", "true");
        room.appendChild(bolt);
      }

      sec.appendChild(room);
      sec.dataset.sheetPos = "0";
      root.appendChild(sec);
      showSheet(sec, 0, true);
    } else if (step.type === "found") {
      const slideData = SLIDES[step.i];
      const sec = document.createElement("section");
      let extra = "";
      if (slideData.nyan) extra += " nyan-ride";
      if (slideData.hole) extra += " hole-ride";
      sec.className = "beat found" + extra;
      sec.dataset.zone = slideData.nyan ? "flatline" : (slideData.end || step.i >= 5 ? "end" : "found");
      if (step.branch) sec.dataset.branch = step.branch;
      if (slideData.nyan) { sec.dataset.chart = "nyan"; sec.dataset.chartLabel = "Nyan Run"; }
      else if (slideData.hole) { sec.dataset.chart = "hole"; sec.dataset.chartLabel = "Black Hole"; }
      else if (slideData.matrix) { sec.dataset.chart = "matrix"; sec.dataset.chartLabel = "Error"; }
      else if (slideData.end) { sec.dataset.chart = "end"; sec.dataset.chartLabel = "The End?"; }
      else if (slideData.level === 1) { sec.dataset.chart = "reveal"; sec.dataset.chartLabel = "Reveal"; }
      else if (slideData.level === 2) { sec.dataset.chart = "errors"; sec.dataset.chartLabel = "Errors"; }
      else { sec.dataset.chart = "reveal"; sec.dataset.chartLabel = "Reveal"; }
      if (slideData.level) {
        sec.dataset.level = String(slideData.level);
        sec.dataset.cleared = "0";
        sec.dataset.hint = slideData.hint || "";
      }
      const slide = document.createElement("div");
      slide.className = "slide";
      slideData.build(slide);
      if (slideData.level) {
        const badge = document.createElement("div");
        badge.className = "level-badge";
        badge.textContent = "Level " + slideData.level;
        slide.appendChild(badge);
        const hb = document.createElement("button");
        hb.type = "button";
        hb.className = "level-hint-btn";
        hb.textContent = "Hint";
        const hm = document.createElement("div");
        hm.className = "level-hint-msg";
        hm.textContent = slideData.hint || "";
        hb.addEventListener("click", (ev) => {
          ev.stopPropagation();
          hm.classList.toggle("show");
          if (hm.classList.contains("show")) sfx("hint");
          else sfx("click");
        });
        slide.appendChild(hb);
        slide.appendChild(hm);
      }
      if (step.doors) {
        const doors = buildDoorChoice(step.doors);
        doors.classList.add("door-float");
        slide.appendChild(doors);
      }
      sec.appendChild(slide);
      root.appendChild(sec);
    } else if (step.type === "warp") {
      const sec = document.createElement("section");
      sec.className = "beat warp";
      sec.dataset.zone = "flatline";
      sec.dataset.chart = "warp";
      sec.dataset.chartLabel = "Warp";
      if (step.branch) sec.dataset.branch = step.branch;
      sec.innerHTML =
        '<div class="warp-room">' +
          '<pre class="warp-code" aria-hidden="true">' + warpWallCode() + "</pre>" +
          '<div class="warp-glow" aria-hidden="true"></div>' +
          '<div class="crt">' +
            '<div class="crt-screen">' +
              '<div class="term">' +
                '<div class="term-bar"><i></i><i></i><i></i></div>' +
                '<div class="term-body">' +
                  '<div class="cmd">&gt; print("HelloWorld")<b id="wcur"></b></div>' +
                  '<div class="err" id="werr">Code does not work</div>' +
                  '<button class="run" id="wrun" type="button">Run</button>' +
                  '<div class="bits" id="wbits" aria-hidden="true"></div>' +
                  '<img class="warp-img" id="wimg" src="assets/warp.jpg" alt="" width="1200" height="1600" />' +
                '</div>' +
              '</div>' +
            '</div>' +
            '<div class="crt-chin"><span>Remnant-OS</span><i class="crt-led"></i></div>' +
          '</div>' +
          '<div class="crt-stand" aria-hidden="true"></div>' +
          '<div class="warp-desk" aria-hidden="true"></div>' +
        '</div>';
      if (step.doors) {
        const doors = buildDoorChoice(step.doors);
        doors.classList.add("door-float");
        sec.querySelector(".warp-room").appendChild(doors);
      }
      root.appendChild(sec);
    } else if (step.type === "cross") {
      const d = document.createElement("div");
      d.className = "cross";
      d.setAttribute("aria-hidden", "true");
      if (step.branch) d.dataset.branch = step.branch;
      root.appendChild(d);
    } else if (step.type === "close") {
      const sec = document.createElement("section");
      sec.id = "closing";
      sec.dataset.zone = "end";
      sec.dataset.chart = "end";
      sec.dataset.chartLabel = "The End?";
      sec.innerHTML =
        '<button class="btn" id="again" type="button">Search again</button>';
      root.appendChild(sec);
    } else if (step.type === "achievements") {
      const sec = document.createElement("section");
      sec.id = "achievements";
      sec.dataset.zone = "end";
      sec.dataset.chart = "end";
      sec.dataset.chartLabel = "The End?";
      sec.innerHTML =
        "<h2>Achievements</h2>" +
        '<p class="ach-count" id="ach-count">Earned <b>0</b> / ' + ACHIEVEMENTS.length + " possible</p>" +
        '<div class="ach-bar" aria-hidden="true"><i id="ach-bar-fill"></i></div>' +
        '<div class="ach-tabs">' +
          '<button type="button" data-ach="earned">Earned</button>' +
          '<button type="button" class="on" data-ach="all">All</button>' +
          '<button type="button" data-ach="missed">Missed</button>' +
        "</div>" +
        '<div id="ach-list" data-mode="all"></div>';
      root.appendChild(sec);
    } else if (step.type === "reflection") {
      const sec = document.createElement("section");
      sec.id = "reflection";
      sec.dataset.zone = "end";
      sec.dataset.chart = "end";
      sec.dataset.chartLabel = "The End?";
      const h = document.createElement("h2");
      h.textContent = "Reflection";
      sec.appendChild(h);
      REFLECTION_ESSAY.forEach((block) => appendEssayBlock(sec, block));
      root.appendChild(sec);
    } else if (step.type === "process") {
      const sec = document.createElement("section");
      sec.id = "process";
      sec.dataset.zone = "end";
      sec.dataset.chart = "end";
      sec.dataset.chartLabel = "The End?";
      const h = document.createElement("h2");
      h.textContent = "AI Standard of Conduct/Process and Tools Statement";
      sec.appendChild(h);
      PROCESS_TOOLS.forEach((block) => appendEssayBlock(sec, block));
      root.appendChild(sec);
    } else if (step.type === "refs") {
      const sec = document.createElement("section");
      sec.id = "refs";
      sec.dataset.zone = "end";
      sec.dataset.chart = "end";
      sec.dataset.chartLabel = "The End?";
      appendApaList(sec, "References", APA_REFS);
      appendApaList(sec, "Additional Project Materials", APA_MATERIALS);
      root.appendChild(sec);
    }
  });

  applyBranchVisibility();

  beatIo = new IntersectionObserver((ents) => {
    ents.forEach((e) => {
      // Tall merged poem papers may never reach a high ratio — any visible
      // intersection is enough (avoids late pages never applying stage / inview).
      if (!e.isIntersecting) return;
      if (e.target.style.display === "none") return;
      e.target.classList.add("inview");
      maybeDismissMinecraftToast(e.target);
      const z = e.target.dataset.zone || "science";
      setMood(z === "found" ? "found" : z, e.target.classList.contains("poem"));
      if (e.target.dataset.chart) {
        updateChartHere(e.target.dataset.chartLabel || e.target.dataset.chart, e.target.dataset.chart);
        markVisited(e.target.dataset.chart);
      }
      if (e.target.classList.contains("poem")) enterRoom(e.target);
      if (e.target.dataset.level && !e.target.dataset.armed) {
        e.target.dataset.armed = "1";
        armLevel(e.target);
      }
      const matrixSlide = e.target.querySelector(".slide[data-matrix]");
      if (matrixSlide && !matrixSlide.dataset.flicker) {
        matrixSlide.dataset.flicker = "1";
        startMatrixFlicker(matrixSlide);
      }
      if (e.target.querySelector(".slide[data-end]")) {
        showMinecraftToast(e.target);
        earn("end");
      }
      if (e.target.id === "achievements") renderAchievements();
    });
  }, { threshold: [0, 0.05, 0.12, 0.25], rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll(".beat, #closing, #achievements, #reflection, #process, #refs").forEach((el) => beatIo.observe(el));

  const wrun = document.getElementById("wrun");
  if (wrun) wrun.addEventListener("click", () => { sfx("click"); runWarp(); earn("warp"); });
  const again = document.getElementById("again");
  if (again) again.addEventListener("click", () => location.reload());
  document.querySelectorAll("#achievements .ach-tabs button").forEach((btn) => {
    btn.addEventListener("click", () => {
      sfx("nav");
      document.querySelectorAll("#achievements .ach-tabs button").forEach((b) => b.classList.remove("on"));
      btn.classList.add("on");
      const list = document.getElementById("ach-list");
      list.dataset.mode = btn.dataset.ach;
      renderAchievements();
    });
  });
  wireScrollGate();
  refreshGateMax();
  // wake sections a full screen early so nothing pops in on arrival
  const preIo = new IntersectionObserver((ents) => {
    ents.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("near");
      e.target.querySelectorAll("img").forEach((img) => { if (img.decode) img.decode().catch(() => {}); });
      preIo.unobserve(e.target);
    });
  }, { rootMargin: "120% 0px 120% 0px" });
  // only sections near the screen keep their looping animations running
  const liveIo = new IntersectionObserver((ents) => {
    ents.forEach((e) => e.target.classList.toggle("live", e.isIntersecting));
  }, { rootMargin: "40% 0px 40% 0px" });
  document.querySelectorAll("#journey > .beat").forEach((el) => {
    preIo.observe(el);
    liveIo.observe(el);
  });
  state.journeyBuilt = true;
  buildOvergrowth();
  startLightning();
  preloadJourneyAssets();
  const firstRoom = document.querySelector("#journey > .beat.poem");
  if (firstRoom) enterRoom(firstRoom);
  applyLampLight();
  onScroll();
}

function onScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  const p = max > 0 ? (window.scrollY || 0) / max : 0;
  const rail = document.getElementById("rail");
  if (rail) rail.style.height = p * 100 + "%";
  if (state.journeyBuilt) {
    setGrowth(growthFromScroll());
    syncChartFromScroll();
  }
  updateNyanRide();
  updateHoleRide();
  maybeDismissMinecraftToast();
}

function teleportTo(el) {
  if (!el) return;
  const branch = el.dataset.branch;
  if (branch === "warp") chooseRoute("mid", "warp");
  if (branch === "errors") chooseRoute("errors", "visit");
  if (branch === "matrix") chooseRoute("late", "matrix");
  if (branch === "room") chooseRoute("room", "visit");
  if (branch === "office") { chooseRoute("mid", "warp"); chooseRoute("office", "visit"); }
  if (branch === "shelter") { chooseRoute("late", "matrix"); chooseRoute("shelter", "visit"); }
  if (el.dataset.branch === "hole" && !state.path) choosePath("hole");
  if (el.dataset.branch === "memory" && !state.path) choosePath("memory");
  const nyan = document.querySelector(".beat.found.nyan-ride");
  if (!state.path && nyan && el.offsetTop > nyan.offsetTop + 8) {
    choosePath(el.dataset.branch === "memory" ? "memory" : "hole");
  }
  // branch visibility may have changed — keep a live reference
  if (el.style.display === "none") {
    el = document.querySelector('#journey > .beat[data-chart="' + (el.dataset.chart || "") + '"]:not([style*="display: none"])') || el;
  }
  unlockGatesBefore(el);
  document.documentElement.style.scrollBehavior = "auto";
  jumpTo(el);
  if (el.dataset.chart) {
    updateChartHere(el.dataset.chartLabel || el.dataset.chart, el.dataset.chart);
    markVisited(el.dataset.chart);
  }
  clampScrollNow();
}

function pickRandomMidBeat() {
  const beats = [...document.querySelectorAll("#journey > .beat")];
  const first = beats[0];
  const candidates = beats.filter((s) => {
    if (s === first) return false;
    if (s.dataset.chart === "end") return false;
    // include branch sections as candidates (path chosen on teleport)
    return true;
  });
  if (!candidates.length) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}
