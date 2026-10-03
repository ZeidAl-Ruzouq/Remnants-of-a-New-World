/* Background stage, mood switching and the end toast. */

/* atmosphere shapes */
function buildStage() {
  const helix = document.getElementById("helix");
  for (let i = 0; i < 28; i++) {
    const s = document.createElement("span");
    s.style.top = (i / 28 * 100) + "%";
    s.style.transform = `rotate(${i % 2 ? 28 : -28}deg) scaleX(${0.55 + (i % 5) * 0.08})`;
    helix.appendChild(s);
  }
  const notes = document.getElementById("notes");
  const spots = [[8,12],[84,22],[14,52],[78,42],[28,78],[62,74],[50,20],[88,80]];
  const scraps = ["memory", "patient", "connection", "HelloWorld", "remnants", "presence", "healing", "hand-to-hand"];
  spots.forEach(([x, y], i) => {
    const n = document.createElement("div");
    n.className = "note" + (i % 3 === 0 ? " ruled" : "") + (i % 2 === 0 ? " tape" : "");
    n.style.left = x + "%";
    n.style.top = y + "%";
    n.style.setProperty("--r", ((i % 7) - 3) * 3.5 + "deg");
    n.style.width = (48 + (i % 4) * 10) + "px";
    n.style.height = (i % 3 === 0 ? 88 : 48 + (i % 3) * 8) + "px";
    const sc = document.createElement("div");
    sc.className = "scribble";
    sc.textContent = scraps[i % scraps.length];
    n.appendChild(sc);
    notes.appendChild(n);
  });
  const threads = document.getElementById("threads");
  for (let i = 0; i < 12; i++) {
    const h = document.createElement("i");
    h.style.top = (6 + i * 8) + "%";
    threads.appendChild(h);
  }
  for (let i = 0; i < 10; i++) {
    const v = document.createElement("b");
    v.style.left = (8 + i * 9) + "%";
    threads.appendChild(v);
  }
  buildChartSvg();
}

function hideMinecraftToast() {
  const toast = document.getElementById("mc-toast");
  if (!toast) return;
  toast.classList.remove("show");
  toast.setAttribute("aria-hidden", "true");
  clearTimeout(mcToastTimer);
  mcToastTimer = null;
}

function showMinecraftToast(fromEl) {
  if (mcPlayed) return;
  mcPlayed = true;
  const toast = document.getElementById("mc-toast");
  toast.classList.add("show");
  toast.setAttribute("aria-hidden", "false");
  sfx("toast");
  mcToastAtY = window.scrollY || 0;
  mcToastSection = fromEl || null;
  clearTimeout(mcToastTimer);
  mcToastTimer = setTimeout(hideMinecraftToast, 3500);
}

function maybeDismissMinecraftToast(activeEl) {
  const toast = document.getElementById("mc-toast");
  if (!toast || !toast.classList.contains("show")) return;
  const y = window.scrollY || 0;
  if (Math.abs(y - mcToastAtY) > innerHeight * 0.4) {
    hideMinecraftToast();
    return;
  }
  if (activeEl && mcToastSection && activeEl !== mcToastSection) {
    hideMinecraftToast();
  }
}

function setMood(zone, isPoem) {
  state.zone = zone;
  document.body.classList.remove("mood-science", "mood-clinic", "mood-human", "mood-poem");
  const mood = (zone === "found" || zone === "flatline") ? "clinic" : (zone === "end" ? "human" : zone);
  document.body.classList.add("mood-" + mood);
  if (isPoem) document.body.classList.add("mood-poem");
}
