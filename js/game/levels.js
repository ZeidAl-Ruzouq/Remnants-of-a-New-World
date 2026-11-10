/* Level gameplay: portrait clippings, errors, nyan ride, black hole, matrix, warp. */

function spawnAsteroid(rocks, xVw, yPct) {
  if (!rocks) return null;
  const a = document.createElement("div");
  a.className = "asteroid";
  const size = 120 + Math.floor(Math.random() * 90);
  a.style.width = size + "px";
  a.style.height = (size * (0.82 + Math.random() * 0.22)) + "px";
  const x = xVw != null ? xVw : (110 + Math.random() * 40);
  const y = yPct != null ? yPct : (12 + Math.random() * 70);
  a.dataset.x = String(x);
  a.dataset.y = String(y);
  a.dataset.vx = String(-0.012 - Math.random() * 0.028);
  a.dataset.vy = String((Math.random() - 0.5) * 0.018);
  a.dataset.rot = String((Math.random() * 80) - 40);
  a.dataset.spin = String((Math.random() - 0.5) * 0.6);
  a.dataset.rock = "1";
  a.style.left = x + "vw";
  a.style.top = y + "%";
  a.style.transform = "rotate(" + a.dataset.rot + "deg)";
  rocks.appendChild(a);
  return a;
}

function updateAsteroids(world, dt) {
  const rocks = world && world.querySelector("#nyan-rocks");
  if (!rocks) return;
  const now = performance.now();
  if (!state.asteroidSpawnAt) state.asteroidSpawnAt = now + 900;
  const live = rocks.querySelectorAll(".asteroid").length;
  if (state.nyanStarted && state.nyanP < 0.95 && live < 10 && now >= state.asteroidSpawnAt) {
    const ahead = 95 + state.nyanP * 160 + Math.random() * 35;
    spawnAsteroid(rocks, ahead, 10 + Math.random() * 72);
    state.asteroidSpawnAt = now + 700 + Math.random() * 1100;
  }
  rocks.querySelectorAll(".asteroid").forEach((a) => {
    let x = parseFloat(a.dataset.x || "0");
    let y = parseFloat(a.dataset.y || "0");
    let vx = parseFloat(a.dataset.vx || "0");
    let vy = parseFloat(a.dataset.vy || "0");
    let rot = parseFloat(a.dataset.rot || "0");
    const spin = parseFloat(a.dataset.spin || "0");
    const t = Math.min(2.5, (dt || 16) / 16);
    x += vx * t * 18;
    y += vy * t * 10;
    rot += spin * t;
    // gentle bob
    y += Math.sin(now / 420 + x) * 0.012 * t;
    a.dataset.x = String(x);
    a.dataset.y = String(y);
    a.dataset.rot = String(rot);
    a.style.left = x + "vw";
    a.style.top = y + "%";
    a.style.transform = "rotate(" + rot + "deg)";
    if (x < -20 || y < -25 || y > 125) a.remove();
  });
}

/** Pointer drag inside `container`. A press that barely moves counts as a tap (onTap). */
function enableDrag(el, { onMove, onEnd, onTap, container }) {
  let dragging = false, ox = 0, oy = 0, startL = 0, startT = 0, pid = null, travel = 0;
  const down = (ev) => {
    if (ev.button != null && ev.button !== 0) return;
    if (el.dataset.lockDrag === "1") return;
    dragging = true;
    travel = 0;
    pid = ev.pointerId;
    try { el.setPointerCapture(pid); } catch (_) {}
    el.classList.add("dragging");
    sfx("pickup");
    ox = ev.clientX; oy = ev.clientY;
    const rect = el.getBoundingClientRect();
    const crect = (container || el.parentElement).getBoundingClientRect();
    startL = rect.left - crect.left;
    startT = rect.top - crect.top;
    el.style.left = startL + "px";
    el.style.top = startT + "px";
    el.style.right = "auto";
    el.style.bottom = "auto";
    ev.preventDefault();
  };
  const move = (ev) => {
    if (!dragging) return;
    const nx = startL + (ev.clientX - ox);
    const ny = startT + (ev.clientY - oy);
    travel = Math.max(travel, Math.abs(ev.clientX - ox) + Math.abs(ev.clientY - oy));
    el.style.left = nx + "px";
    el.style.top = ny + "px";
    if (onMove) onMove(el, nx, ny);
  };
  const up = () => {
    if (!dragging) return;
    dragging = false;
    el.classList.remove("dragging");
    try { if (pid != null) el.releasePointerCapture(pid); } catch (_) {}
    pid = null;
    if (onTap && travel < 6) { onTap(el); return; }
    sfx("drop");
    if (onEnd) onEnd(el);
  };
  el.addEventListener("pointerdown", down);
  el.addEventListener("pointermove", move);
  el.addEventListener("pointerup", up);
  el.addEventListener("pointercancel", up);
}

function armLevel(sec) {
  const level = +sec.dataset.level;
  if (level === 1) armLevel1(sec);
  else if (level === 2) armLevel2(sec);
  else if (level === 3) armLevel3(sec);
  else if (level === 4) armLevel4(sec);
  else if (level === 5) armLevel5(sec);
  refreshGateMax();
}

function armLevel1(sec) {
  const slide = sec.querySelector(".slide");
  const portrait = slide.querySelector("[data-portrait]");
  const wrap = slide.querySelector(".portrait-wrap") || slide;
  const tray = slide.querySelector(".scrap-tray");
  const blockers = [...sec.querySelectorAll(".strip.blocker")];
  const readout = document.createElement("div");
  readout.className = "level-progress";
  slide.appendChild(readout);
  let trayed = 0;
  // tap: the clipping lifts off the face and settles into the cuttings tray
  const peel = (b) => {
    if (b.dataset.off === "1" || !tray) return;
    sfx("flip");
    const wr = wrap.getBoundingClientRect();
    const tr = tray.getBoundingClientRect();
    const br = b.getBoundingClientRect();
    const w = Math.min(br.width, tr.width - 28);
    const slot = trayed++;
    const step = Math.max(14, Math.min(30, (tr.height - 56) / blockers.length));
    b.dataset.lockDrag = "1";
    b.classList.add("peeling");
    b.style.left = (br.left - wr.left) + "px";
    b.style.top = (br.top - wr.top) + "px";
    b.style.width = br.width + "px";
    requestAnimationFrame(() => {
      b.style.left = (tr.left - wr.left + 14 + (slot % 2) * 6) + "px";
      b.style.top = (tr.top - wr.top + 34 + slot * step) + "px";
      b.style.width = w + "px";
      b.style.transform = "rotate(" + ((slot % 3) - 1) * 2.5 + "deg)";
    });
    b.dataset.off = "1";
    b.classList.add("moved");
    setTimeout(() => { b.classList.remove("peeling"); b.dataset.lockDrag = ""; check(); }, 620);
  };
  // The level only opens when every strip is off the portrait — no partial pass.
  const check = () => {
    if (sec.dataset.cleared === "1") return;
    const sr = slide.getBoundingClientRect();
    const pr = portrait ? portrait.getBoundingClientRect() : sr;
    let off = 0;
    blockers.forEach((b) => {
      if (b.dataset.off !== "1") {
        const r = b.getBoundingClientRect();
        const clearOfFace =
          r.right < pr.left + 4 || r.left > pr.right - 4 ||
          r.bottom < pr.top + 4 || r.top > pr.bottom - 4;
        const offSlide =
          r.right < sr.left + 10 || r.left > sr.right - 10 ||
          r.bottom < sr.top + 10 || r.top > sr.bottom - 10;
        if (clearOfFace || offSlide) {
          b.dataset.off = "1";
          b.classList.add("moved");
        }
      }
      if (b.dataset.off === "1") off++;
    });
    readout.textContent = "clippings peeled " + off + " / " + blockers.length;
    slide.classList.toggle("revealed", off >= blockers.length);
    if (off >= blockers.length) clearLevel(sec);
  };
  blockers.forEach((b) => {
    enableDrag(b, { container: wrap, onEnd: check, onMove: check, onTap: peel });
  });
  readout.textContent = "clippings peeled 0 / " + blockers.length;
  if (reduced) {
    blockers.forEach((b) => { b.dataset.off = "1"; b.classList.add("moved"); });
    clearLevel(sec);
  }
}

function armLevel2(sec) {
  const layer = sec.querySelector(".win-layer");
  if (!layer) return;
  layer.dataset.flood = "done";
  const dismiss = (win) => {
    sfx("close");
    win.style.opacity = "0";
    win.style.transform = "scale(0.9)";
    setTimeout(() => {
      win.remove();
      if (!layer.querySelector(".win95")) clearLevel(sec);
    }, 150);
  };
  layer.querySelectorAll(".win95").forEach((win) => {
    win.querySelectorAll(".btns button, .title .x").forEach((btn) => {
      btn.addEventListener("click", (ev) => {
        ev.stopPropagation();
        dismiss(win);
      });
    });
  });
  if (reduced) {
    layer.querySelectorAll(".win95").forEach((w) => w.remove());
    clearLevel(sec);
  }
}

/* The cat may fly almost the whole height of the screen. */
const NYAN_Y_MIN = 0.06;

const NYAN_Y_MAX = 0.94;

function armLevel3(sec) {
  state.nyanY = 0.38;
  state.nyanP = 0;
  state.nyanStarted = false;
  state.nyanHolding = false;
  state.nyanCollected = 0;
  const hold = sec.querySelector("#nyan-hold");
  const slide = sec.querySelector(".slide");
  const score = sec.querySelector("#nyan-score");
  if (score) score.textContent = "lines 0/" + state.nyanBitsNeed;
  sec.querySelectorAll(".nyan-bit").forEach((bit) => {
    bit.addEventListener("click", (ev) => {
      ev.stopPropagation();
      if (!state.nyanStarted) {
        state.nyanStarted = true;
        if (hold) hold.classList.add("done");
      }
      collectNyanBit(bit);
    });
  });
  const onKey = (e) => {
    if (!sec.classList.contains("inview")) return;
    const k = e.key.toLowerCase();
    const down = e.type === "keydown";
    // up/down fly; left/right only brake and boost — they never drag the cat down
    if (k === "arrowup" || k === "w") state.nyanKeys.u = down;
    if (k === "arrowdown" || k === "s") state.nyanKeys.d = down;
    if (k === "arrowleft" || k === "a") state.nyanKeys.l = down;
    if (k === "arrowright" || k === "d") state.nyanKeys.r = down;
    // keyboard also starts the ride (no rewind ever)
    if (down && (k === "arrowup" || k === "arrowdown" || k === "arrowleft" || k === "arrowright" ||
        k === "w" || k === "a" || k === "s" || k === "d")) {
      if (!state.nyanStarted) {
        state.nyanStarted = true;
        sfx("click");
        if (hold) hold.classList.add("done");
      }
    }
    if (["arrowup", "arrowdown", "arrowleft", "arrowright", " ", "spacebar"].includes(k)) {
      e.preventDefault();
    }
  };
  addEventListener("keydown", onKey);
  addEventListener("keyup", onKey);
  const setHold = (on) => {
    state.nyanHolding = on;
    if (on) state.nyanStarted = true;
    if (hold) hold.classList.toggle("holding", on);
  };
  if (hold) {
    hold.addEventListener("pointerdown", (ev) => {
      ev.preventDefault();
      try { hold.setPointerCapture(ev.pointerId); } catch (_) {}
      setHold(true);
      sfx("click");
    });
    hold.addEventListener("pointerup", () => setHold(false));
    hold.addEventListener("pointercancel", () => setHold(false));
    hold.addEventListener("lostpointercapture", () => setHold(false));
  }
  // Relative-delta steering — never snap to raw clientY (avoids jump below screen)
  let pointerSteering = false;
  let lastPointerY = 0;
  const clampNyanY = (y) => Math.min(NYAN_Y_MAX, Math.max(NYAN_Y_MIN, y));
  const onPointerSteer = (ev) => {
    if (sec.dataset.cleared === "1") return;
    if (!pointerSteering) return;
    const r = slide.getBoundingClientRect();
    const h = Math.max(1, Math.min(r.height, innerHeight));
    const dy = ev.clientY - lastPointerY;
    lastPointerY = ev.clientY;
    // Relative delta only — never map absolute clientY into world space
    state.nyanY = clampNyanY(state.nyanY + dy / h);
    state.nyanYVel = 0;
    // Live clamp cat element while dragging
    const cat = document.getElementById("nyan-cat");
    if (cat) {
      const catH = cat.offsetHeight || 70;
      const maxTop = Math.max(10, h - catH - 10);
      const top = Math.min(maxTop, Math.max(10, state.nyanY * h - catH * 0.5));
      cat.style.top = top + "px";
      state.nyanY = clampNyanY((top + catH * 0.5) / h);
    }
  };
  const endPointerSteer = () => { pointerSteering = false; };
  slide.addEventListener("pointerdown", (ev) => {
    if (ev.target.closest(".level-hint-btn, .nyan-hold, .path-choice, .nyan-bit")) return;
    if (!state.nyanStarted) {
      state.nyanStarted = true;
      if (hold) hold.classList.add("done");
      sfx("click");
    }
    pointerSteering = true;
    lastPointerY = ev.clientY;
    try { slide.setPointerCapture(ev.pointerId); } catch (_) {}
    ev.preventDefault();
  });
  slide.addEventListener("pointermove", onPointerSteer);
  slide.addEventListener("pointerup", endPointerSteer);
  slide.addEventListener("pointercancel", endPointerSteer);
  slide.addEventListener("lostpointercapture", endPointerSteer);
  const choice = sec.querySelector("#path-choice");
  if (choice) {
    choice.querySelectorAll("button[data-path]").forEach((btn) => {
      btn.addEventListener("click", (ev) => {
        ev.stopPropagation();
        choosePath(btn.dataset.path);
      });
    });
  }
  // smoother steer target via velocity
  state.nyanYVel = 0;
  state.nyanY = clampNyanY(state.nyanY);
  if (reduced) {
    state.nyanP = 1;
    state.nyanStarted = true;
    state.path = state.path || "hole";
    applyBranchVisibility();
    if (hold) hold.classList.add("done");
    clearLevel(sec);
  }
}

function armLevel4(sec) {
  const slide = sec.querySelector(".slide");
  const pieces = [...sec.querySelectorAll(".orbit-strip[data-piece]")];
  // start near screen edges — large radius
  const defense = pieces.map((el, i) => {
    const phase = parseFloat(el.dataset.phase || "0");
    const r0 = Math.min(innerWidth, innerHeight) * (0.58 + (i % 3) * 0.06);
    const x = Math.cos(phase) * r0;
    const y = Math.sin(phase) * r0 * 0.72;
    el.style.left = "50%";
    el.style.top = "50%";
    el.style.margin = "0";
    el.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
    return { el, x, y, held: false, gone: false };
  });
  state.holeDefense = defense;
  state.holeStarted = true;
  state.holeStartAt = performance.now();
  // place with % after first layout tick
  requestAnimationFrame(() => {
    const sr = slide.getBoundingClientRect();
    defense.forEach((p) => {
      if (p.gone) return;
      p.el.style.left = ((sr.width / 2 + p.x) / sr.width * 100) + "%";
      p.el.style.top = ((sr.height / 2 + p.y) / sr.height * 100) + "%";
      p.el.style.transform = "translate(-50%, -50%)";
    });
  });
  defense.forEach((p) => {
    enableDrag(p.el, {
      container: slide,
      onMove: (el) => {
        if (p.gone) return;
        p.held = true;
        const sr = slide.getBoundingClientRect();
        const r = el.getBoundingClientRect();
        p.x = (r.left + r.width / 2) - (sr.left + sr.width / 2);
        p.y = (r.top + r.height / 2) - (sr.top + sr.height / 2);
      },
      onEnd: () => {
        if (p.gone) return;
        p.held = false;
        sfx("save");
      }
    });
  });
  state.holeClicks = 0;
  const holeEl = sec.querySelector("#black-hole, .hole");
  if (holeEl && !holeEl.dataset.wired) {
    holeEl.dataset.wired = "1";
    const poke = (ev) => {
      ev.stopPropagation();
      if (sec.dataset.cleared === "1" || sec.dataset.evaporating === "1") return;
      state.holeClicks++;
      sfx("hit");
      holeEl.style.transform = "translate(-50%, -50%) scale(" + (1 + state.holeClicks * 0.07) + ")";
      const hint = sec.querySelector(".hole-hint");
      if (hint && state.holeClicks < HOLE_POKE_LIMIT) {
        hint.textContent = "it is pulling harder · " + (HOLE_POKE_LIMIT - state.holeClicks) + " more and it swallows you";
      }
      if (state.holeClicks >= HOLE_POKE_LIMIT) swallowedByHole(sec);
    };
    holeEl.addEventListener("click", poke);
    holeEl.addEventListener("pointerdown", (ev) => {
      if (ev.pointerType === "mouse") return; /* click already covers it */
      poke(ev);
    });
  }
  if (reduced) evaporateHole(sec);
}

function armLevel5(sec) {
  const slide = sec.querySelector(".slide");
  const bits = [...slide.querySelectorAll(".matrix-bit[data-catch]")];
  state.matrixCaught = 0;
  state.matrixNeed = 5;
  const badge = () => {
    const hint = sec.querySelector(".level-hint-msg");
    const live = sec.querySelector(".hole-hint") || sec.querySelector(".nyan-hint");
    const label = "caught " + state.matrixCaught + " / " + state.matrixNeed;
    sec.dataset.matrixProgress = label;
    const bar = slide.querySelector(".matrix-progress");
    if (bar) bar.textContent = label;
  };
  let prog = slide.querySelector(".matrix-progress");
  if (!prog) {
    prog = document.createElement("div");
    prog.className = "nyan-hint matrix-progress";
    prog.style.bottom = "1.25rem";
    slide.appendChild(prog);
  }
  badge();
  bits.forEach((el) => {
    el.addEventListener("click", (ev) => {
      ev.stopPropagation();
      if (el.classList.contains("gone")) return;
      if (el.dataset.caught === "1") return;
      el.classList.add("caught");
      el.dataset.caught = "1";
      state.matrixCaught++;
      sfx("catch");
      maybeEarnAllNotes();
      badge();
  if (state.matrixCaught >= state.matrixNeed) {
        earn("matrix");
        if (state.matrixCaught >= bits.length || state.matrixCaught >= state.matrixNeed) {
          // sweep if we caught the required set (all catchables available)
          const catchables = bits.filter((b) => b.dataset.catch);
          if (state.matrixCaught >= Math.min(state.matrixNeed, catchables.length)) earn("matrix-all");
        }
        clearLevel(sec);
      }
    });
  });
  if (reduced) {
    state.matrixCaught = state.matrixNeed;
    clearLevel(sec);
  }
}

function consumeHolePiece(p) {
  if (p.gone) return;
  p.gone = true;
  p.held = false;
  p.el.classList.add("consumed");
  p.el.dataset.piece = "0";
  sfx("hit");
  setTimeout(() => { try { p.el.remove(); } catch (_) {} }, 480);
}

function updateHoleDefense(now) {
  const ride = document.querySelector(".beat.found.hole-ride");
  if (!ride || !ride.classList.contains("inview")) return;
  if (ride.dataset.cleared === "1" || !state.holeStarted || !state.holeDefense) return;
  if (ride.dataset.evaporating === "1") return;
  const elapsed = (now - state.holeStartAt) / 1000;
  const pull = 0.22 + Math.min(0.7, elapsed * 0.035); // gentle drift
  const holeR = Math.min(innerWidth, innerHeight) * 0.1;
  const slide = ride.querySelector(".slide");
  if (!slide) return;
  const sr = slide.getBoundingClientRect();
  let alive = 0;
  state.holeDefense.forEach((p) => {
    if (p.gone) return;
    alive++;
    if (!p.held) {
      const dist = Math.hypot(p.x, p.y) || 1;
      p.x -= (p.x / dist) * pull;
      p.y -= (p.y / dist) * pull;
      if (Math.hypot(p.x, p.y) < holeR * 0.55) {
        consumeHolePiece(p);
        return;
      }
      p.el.style.left = ((sr.width / 2 + p.x) / sr.width * 100) + "%";
      p.el.style.top = ((sr.height / 2 + p.y) / sr.height * 100) + "%";
      p.el.style.transform = "translate(-50%, -50%)";
      p.el.style.margin = "0";
    }
    p.el.style.opacity = "1";
    p.el.style.filter = "none";
    p.el.style.zIndex = p.y > 0 ? "5" : "3";
  });
  const hint = ride.querySelector(".hole-hint");
  const need = reduced ? 2 : 8; // still easy timer clear
  const left = Math.max(0, need - elapsed);
  if (hint) {
    hint.textContent = left > 0.2
      ? ("save them · " + left.toFixed(0) + "s · " + alive + " left")
      : "evaporating…";
  }
  if (elapsed >= need) evaporateHole(ride);
}

function evaporateHole(sec) {
  if (!sec || sec.dataset.evaporating === "1") return;
  sec.dataset.evaporating = "1";
  const hole = sec.querySelector("#black-hole, .hole");
  const disk = sec.querySelector("#hole-disk, .hole-disk");
  if (hole) hole.classList.add("evaporating");
  if (disk) disk.classList.add("evaporating");
  const hint = sec.querySelector(".hole-hint");
  if (hint) hint.textContent = "cleared";
  setTimeout(() => { clearLevel(sec); }, reduced ? 0 : 1200);
}

function collectNyanBit(bit) {
  if (!bit || bit.dataset.got === "1") return;
  bit.dataset.got = "1";
  bit.classList.add("got");
  state.nyanCollected += 1;
  state.nyanP = Math.min(1, state.nyanP + 0.055);
  sfx("pickup");
  const score = document.getElementById("nyan-score");
  if (score) score.textContent = "lines " + state.nyanCollected + "/" + state.nyanBitsNeed;
  if (state.nyanCollected >= state.nyanBitsTotal) earn("nyan-lines");
  maybeEarnAllNotes();
}

const HOLE_POKE_LIMIT = 5;

/** Rebuild the hole section from scratch (pieces, timer, poke counter). */
function restartHoleLevel(sec) {
  state.holeClicks = 0;
  state.holeStarted = false;
  state.holeDefense = null;
  sec.dataset.armed = "";
  sec.dataset.cleared = "0";
  sec.dataset.evaporating = "";
  const slide = sec.querySelector(".slide");
  // rebuild hole contents
  const keep = [...slide.querySelectorAll(".level-badge, .level-hint-btn, .level-hint-msg")];
  const hintText = sec.dataset.hint || "";
  slide.innerHTML = "";
  SLIDES[4].build(slide);
  keep.forEach((el) => {
    if (el.classList.contains("level-hint-msg")) el.textContent = hintText;
    slide.appendChild(el);
  });
  // re-add badge/hint if wiped
  if (!slide.querySelector(".level-badge")) {
    const badge = document.createElement("div");
    badge.className = "level-badge";
    badge.textContent = "Level 4";
    slide.appendChild(badge);
  }
  sec.dataset.armed = "1";
  armLevel4(sec);
  refreshGateMax();
}

/** Poke the hole once too often and it spits you back out at the search page. */
function swallowedByHole(sec) {
  sfx("overtake");
  earn("hole-restart");
  restartHoleLevel(sec);
  state.returnTo = sec;
  mcPlayed = false;
  hideMinecraftToast();
  toggleChart(false);
  const opening = document.getElementById("opening");
  const note = document.getElementById("search-note");
  if (note) {
    note.textContent = "The black hole swallowed you. Search again to drop back in.";
    note.hidden = false;
  }
  opening.hidden = false;
  opening.classList.remove("go");
  document.body.classList.add("locked");
  forceScrollY(sec.offsetTop);
  const q = document.getElementById("search-q");
  if (q) { try { q.focus(); q.select(); } catch (_) {} }
}

function runWarp() {
  document.getElementById("wcur").style.display = "none";
  document.getElementById("wrun").disabled = true;
  if (navigator.vibrate) navigator.vibrate([16, 30, 16]);
  let s = "";
  for (let i = 0; i < 240; i++) s += Math.random() > 0.5 ? "1" : "0";
  document.getElementById("wbits").textContent = s;
  setTimeout(() => {
    document.getElementById("werr").classList.add("show");
    document.getElementById("wimg").classList.add("show");
  }, reduced ? 0 : 400);
}

function matrix(canvas) {
  const parent = canvas.parentElement;
  const c = canvas.getContext("2d");
  let w, h, cols, drops;
  const glyphs = "01アイウエオカキクケコサシスセソタチツテトナニヌネノﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ";
  const resize = () => {
    w = canvas.width = parent.clientWidth * devicePixelRatio;
    h = canvas.height = parent.clientHeight * devicePixelRatio;
    cols = Math.max(8, Math.floor(w / (14 * devicePixelRatio)));
    drops = Array.from({ length: cols }, () => Math.random() * 40);
  };
  resize();
  addEventListener("resize", resize);
  const draw = () => {
    c.fillStyle = "rgba(2,8,5,0.12)";
    c.fillRect(0, 0, w, h);
    c.font = 13 * devicePixelRatio + "px monospace";
    for (let i = 0; i < drops.length; i++) {
      const ch = glyphs[Math.floor(Math.random() * glyphs.length)];
      c.fillStyle = Math.random() > 0.92 ? "#c8ffd0" : "#3a9a5a";
      c.fillText(ch, i * 14 * devicePixelRatio, drops[i] * 16 * devicePixelRatio);
      if (drops[i] * 16 * devicePixelRatio > h && Math.random() > 0.96) drops[i] = 0;
      drops[i]++;
    }
    if (!reduced) requestAnimationFrame(draw);
  };
  draw();
}

function randDigits(n) {
  let s = "";
  for (let i = 0; i < n; i++) {
    s += Math.random() > 0.5 ? "1" : "0";
    if (i % 8 === 7) s += "\n";
  }
  return s;
}

function startMatrixFlicker(slide) {
  if (reduced) return;
  const bits = [...slide.querySelectorAll(".matrix-bit")];
  if (!bits.length) return;
  const tick = () => {
    if (!slide.closest(".beat.found.inview")) {
      matrixTimer = setTimeout(tick, 1200);
      return;
    }
    const picks = bits.filter((el) => !el.classList.contains("gone") && el.dataset.caught !== "1")
      .sort(() => Math.random() - 0.5).slice(0, 1);
    picks.forEach((el) => {
      el.classList.add("gone");
      const ghost = document.createElement("div");
      ghost.className = "digit-ghost";
      ghost.textContent = randDigits(56);
      ghost.style.left = el.style.left;
      ghost.style.top = el.style.top;
      ghost.style.width = el.style.width || "40%";
      slide.appendChild(ghost);
      requestAnimationFrame(() => ghost.classList.add("on"));
      setTimeout(() => {
        ghost.classList.remove("on");
        setTimeout(() => ghost.remove(), 300);
        // assign a random new poem line when reappearing (for text bits)
        if (el.classList.contains("matrix-line") && el.dataset.caught !== "1") {
          el.textContent = POEM[Math.floor(Math.random() * POEM.length)];
        }
        el.classList.remove("gone");
      }, 650 + Math.random() * 450);
    });
    matrixTimer = setTimeout(tick, 1200 + Math.random() * 900);
  };
  matrixTimer = setTimeout(tick, 700);
}

function updateNyanRide() {
  const ride = document.querySelector(".beat.found.nyan-ride");
  const world = document.getElementById("nyan-world");
  const cat = document.getElementById("nyan-cat");
  if (!ride || !world || !cat || !ride.classList.contains("inview")) return;
  if (ride.dataset.cleared === "1") {
    state.nyanP = 1;
    state.nyanStarted = true;
    const hold = ride.querySelector("#nyan-hold");
    if (hold) hold.classList.add("done");
  }

  // forward-only progress
  if (ride.dataset.cleared !== "1" && state.nyanStarted && state.nyanP < 1) {
    // pause forward while path choice is open (unless auto-continuing on X)
    if (!(state.pathChoiceShown && !state.path)) {
      const base = 0.0015;
      const boost = 0.0005;
      // collecting lines makes the run easier
      const collectBoost = state.nyanCollected >= state.nyanBitsNeed ? 0.0006 : 0;
      state.nyanP = Math.min(1, state.nyanP + base + (state.nyanHolding ? boost : 0) + collectBoost);
    }
  }

  // mid-ride path fork (spatial X vs Y) — X/hole is the natural continuation
  if (state.nyanStarted && !state.path && state.nyanP >= 0.52 && !state.pathChoiceShown) {
    state.pathChoiceShown = true;
    state.pathChoiceAt = performance.now();
    state.nyanForkAt = 0.52;
    const choice = document.getElementById("path-choice");
    if (choice) choice.classList.add("show");
    sfx("path");
  }
  // Default: holding / continuing auto-picks Black Hole (X) after a short beat
  if (state.pathChoiceShown && !state.path) {
    const waited = performance.now() - (state.pathChoiceAt || 0);
    if (waited > 2800 || (waited > 1400 && (state.nyanHolding || state.nyanKeys.r))) {
      choosePath("hole");
    }
  }

  // velocity-based vertical steering (keyboard); pointer uses relative deltas
  let target = 0;
  if (state.nyanKeys.u) target -= 1;
  if (state.nyanKeys.d) target += 1;
  // Y-path gently pulls the cat downward after the fork
  if (state.path === "memory") target += 0.4;
  state.nyanYVel += (target * 0.012 - state.nyanYVel) * 0.3;
  if (target === 0) state.nyanYVel *= 0.84;
  const yMax = NYAN_Y_MAX;
  state.nyanY = Math.min(yMax, Math.max(NYAN_Y_MIN, state.nyanY + state.nyanYVel));

  const p = state.nyanP;
  const forkAt = state.nyanForkAt != null ? state.nyanForkAt : 0.52;
  const maxX = Math.max(0, world.offsetWidth - innerWidth);
  const maxY = Math.max(0, world.offsetHeight - innerHeight);
  let scrollX = 0;
  let scrollY = 0;
  if (state.path === "memory" && p > forkAt) {
    // Vertical descend: hold most horizontal progress, scroll down
    const t = Math.min(1, (p - forkAt) / Math.max(0.001, 1 - forkAt));
    scrollX = maxX * (forkAt + (p - forkAt) * 0.22);
    scrollY = maxY * t;
  } else if (state.path === "hole" && p > forkAt) {
    // Horizontal continue: pure X after fork → Black Hole
    scrollX = maxX * p;
    scrollY = 0;
  } else {
    scrollX = maxX * p;
    scrollY = 0;
  }
  world.style.transform = `translate3d(${-scrollX}px, ${-scrollY}px, 0)`;

  // Drift + spawn asteroids during the ride
  updateAsteroids(world, 16);

  // Cat is on the slide — clamp to the *visible* sticky viewport, never below screen
  const slideEl = ride.querySelector(".slide") || ride;
  const slideRect = slideEl.getBoundingClientRect();
  const viewH = Math.min(slideEl.clientHeight || innerHeight, innerHeight, Math.max(1, slideRect.height));
  const slideW = slideEl.clientWidth || innerWidth;
  const catW = Math.min(slideW * 0.14, 100);
  const catH = Math.min(cat.offsetHeight || catW * 0.65, viewH * 0.28);
  const minTop = 10;
  const maxTop = Math.max(minTop, viewH - catH - 10);
  const catTop = Math.min(maxTop, Math.max(minTop, state.nyanY * viewH - catH * 0.5));
  // Keep normalized Y consistent with clamped pixel top (prevents drag below screen)
  state.nyanY = Math.min(yMax, Math.max(NYAN_Y_MIN, (catTop + catH * 0.5) / viewH));
  const viewLeft = slideW * 0.12;
  cat.style.width = catW + "px";
  cat.style.maxWidth = "100px";
  cat.style.left = viewLeft + "px";
  cat.style.top = catTop + "px";
  const tilt = state.nyanYVel * 120 + (state.path === "memory" ? 8 : 0);
  cat.style.transform = `rotate(${tilt}deg)`;

  const bar = document.getElementById("nyan-bar");
  if (bar) bar.style.width = (p * 100) + "%";
  const hold = ride.querySelector("#nyan-hold");
  if (hold && state.nyanStarted) hold.classList.add("done");

  const cr = cat.getBoundingClientRect();
  const cx = cr.left + cr.width * 0.55;
  const cy = (cr.top + cr.bottom) / 2;

  // collect poem bits by overlap (or click — wired in armLevel3)
  if (ride.dataset.cleared !== "1" && state.nyanStarted) {
    world.querySelectorAll(".nyan-bit:not(.got)").forEach((bit) => {
      const br = bit.getBoundingClientRect();
      if (br.right < 0 || br.left > innerWidth) return;
      const bx = (br.left + br.right) / 2;
      const by = (br.top + br.bottom) / 2;
      const hit = Math.hypot(cx - bx, cy - by) < Math.min(cr.width, cr.height) * 0.28 + 36;
      if (hit) collectNyanBit(bit);
    });
  }

  if (ride.dataset.cleared !== "1" && performance.now() > state.nyanHitCooldown) {
    const rocks = world.querySelectorAll(".asteroid");
    for (const rock of rocks) {
      const rr = rock.getBoundingClientRect();
      if (rr.right < 0 || rr.left > innerWidth) continue;
      const rx = (rr.left + rr.right) / 2;
      const ry = (rr.top + rr.bottom) / 2;
      const dist = Math.hypot(cx - rx, cy - ry);
      const hitR = Math.min(cr.width, cr.height) * 0.22 + Math.min(rr.width, rr.height) * 0.28;
      if (dist < hitR + 28 && dist >= hitR && performance.now() > state.nyanMissCooldown) {
        sfx("miss");
        state.nyanMissCooldown = performance.now() + 450;
      }
      if (dist < hitR) {
        state.nyanP = Math.max(0, state.nyanP - 0.02);
        state.nyanHitCooldown = performance.now() + 1000;
        sfx("hit");
        cat.style.filter = "brightness(1.3)";
        setTimeout(() => { cat.style.filter = ""; }, 200);
        break;
      }
    }
  }

  const hint = ride.querySelector(".nyan-hint");
  if (hint) {
    if (p >= 1 && state.path) hint.textContent = state.path === "hole" ? "→ into the black hole" : "↓ under the black hole";
    else if (!state.path && state.pathChoiceShown) hint.textContent = "→ X black hole (default) · ↓ Y skip it";
    else if (state.nyanStarted) hint.textContent = "W/S or ↑/↓ to fly · touch the notes";
    else hint.textContent = "hold to ride · W/S to fly · touch the notes";
  }

  // path choice required (auto-defaults to hole); collecting enough soft-clears at end
  const canClear = state.path && (p >= 1 || (p >= 0.92 && state.nyanCollected >= state.nyanBitsNeed));
  if (ride.dataset.cleared !== "1" && canClear) {
    state.nyanP = 1;
    if (hold) hold.classList.add("done");
    clearLevel(ride);
    // Natural ending: after X path, land the scroll at the Black Hole
    if (state.path === "hole") {
      const holeSec = document.querySelector('.beat.found.hole-ride:not([style*="display: none"])');
      if (holeSec) {
        requestAnimationFrame(() => {
          try { holeSec.scrollIntoView({ block: "start" }); } catch (_) {}
        });
      }
    }
  }
}

function updateHoleRide() {
  updateHoleDefense(performance.now());
}
