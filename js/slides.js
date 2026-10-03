/* Found slides (the level scenes) and the helpers that build them. */

/* Found slides — components extracted from your PDF/PPT (960×540) */
const PART = "assets/found-parts/";

const SLIDES = [
  {
    id: 1,
    build(slide) {
      /* unused as start — kept for references / optional insert */
      slide.style.background = "#1a1520";
      const t = document.createElement("div");
      t.className = "slide-title";
      t.innerHTML = "Remnants of a<br>New World";
      slide.appendChild(t);
    }
  },
  {
    id: 2,
    level: 1,
    hint: "Every clipping has to come off the face — click one to peel it into the tray, or drag it away.",
    build(slide) {
      // a corkboard: framed portrait in the middle, newspaper clippings pinned over the face
      slide.classList.add("reveal-board");
      const note = document.createElement("div");
      note.className = "board-note";
      note.innerHTML = "Peel every clipping off the portrait. Click to peel, or drag.";
      slide.appendChild(note);
      const tray = document.createElement("div");
      tray.className = "scrap-tray";
      tray.innerHTML = "<span>Cuttings</span>";
      slide.appendChild(tray);
      const wrap = document.createElement("div");
      wrap.className = "portrait-wrap";
      slide.appendChild(wrap);
      const portrait = addObj(wrap, "p2-img1.png", { left: "auto", top: "auto", width: "100%" });
      portrait.dataset.portrait = "1";
      // [file, left%, top%, width%] relative to the framed portrait
      const strips = [
        ["p2-img9.png", "40%", "10%", "42%"],
        ["p2-img2.png", "-9%", "23%", "118%"],
        ["p2-img10.png", "30%", "35%", "44%"],
        ["p2-img3.png", "10%", "46%", "78%"],
        ["p2-img4.png", "40%", "56%", "30%"],
        ["p2-img6.png", "20%", "64%", "58%"],
        ["p2-img7.png", "50%", "73%", "38%"],
        ["p2-img8.png", "16%", "81%", "36%"]
      ];
      strips.forEach(([f, l, t, w], i) => {
        const img = addStrip(wrap, f, { left: l, top: t, width: w, rotate: ((i % 5) - 2) * 1.6 });
        img.classList.add("blocker");
        img.dataset.blocker = "1";
      });
    }
  },
  {
    id: 3,
    level: 2,
    hint: "Close every window — click OK or ×.",
    build(slide) {
      slide.style.background = "#008080"; // classic teal desktop
      const layer = document.createElement("div");
      layer.className = "win-layer";
      slide.appendChild(layer);
      // fewer windows — easy clear
      const dialogs = [
        { title: "System Failure", msg: "FATAL ERROR!", icon: "x", left: "8%", top: "12%", delay: 0, btns: ["OK", "Reboot"] },
        { title: "Error", msg: "Crirical error #123567AB21200", icon: "x", left: "42%", top: "10%", delay: 0.06 },
        { title: "WARNING", msg: "Your system has been infected by <Unknown> virus.", icon: "!", left: "55%", top: "28%", delay: 0.12, btns: ["Whatever", "Format C:\\"] },
        { title: "Downloading [72%]", msg: "", icon: "i", left: "18%", top: "42%", delay: 0.18, bar: true, btns: ["Cancel"] },
        { title: "System Message", msg: "", icon: "i", left: "48%", top: "55%", delay: 0.24, btns: ["OK"] },
        { title: "Fail", msg: "Critical error.", icon: "x", left: "28%", top: "70%", delay: 0.3 }
      ];
      dialogs.forEach((d) => layer.appendChild(win95(d)));
      [
        ["p3-img1.png", "8%", "4%", "26%"],
        ["p3-img5.png", "20%", "34%", "42%"],
        ["p3-img6.png", "18%", "52%", "48%"],
        ["p3-img8.png", "30%", "72%", "32%"],
        ["p3-img9.png", "55%", "80%", "24%"]
      ].forEach(([f, l, t, w], i) => addStrip(slide, f, { left: l, top: t, width: w, z: 6, rotate: (i - 2) * 0.8 }));
    }
  },
  {
    id: 4,
    nyan: true,
    level: 3,
    hint: "Hold to ride · W/S or ↑/↓ to fly up and down · touch a note to take it · mid-ride pick → X or ↓ Y.",
    build(slide) {
      slide.classList.add("nyan-sticky");
      slide.style.opacity = "1";
      const world = document.createElement("div");
      world.className = "nyan-world";
      world.id = "nyan-world";

      const stars = document.createElement("div");
      stars.className = "starfield";
      for (let i = 0; i < 110; i++) {
        const s = document.createElement("i");
        const sz = i % 7 === 0 ? 3 : (i % 3 === 0 ? 2 : 1);
        s.style.width = sz + "px";
        s.style.height = sz + "px";
        s.style.left = (Math.random() * 100) + "%";
        s.style.top = (Math.random() * 100) + "%";
        if (sz === 1) s.classList.add("far");
        if (Math.random() > 0.65) s.classList.add("dim");
        stars.appendChild(s);
      }
      world.appendChild(stars);
      const haze = document.createElement("div");
      haze.className = "nyan-haze";
      haze.setAttribute("aria-hidden", "true");
      world.appendChild(haze);

      const strips = [
        ["p4-img2.png", "8vw", "8%", "30vw"],
        ["p4-img3.png", "55vw", "12%", "32vw"],
        ["p4-img4.png", "100vw", "20%", "28vw"],
        ["p4-img7.png", "145vw", "58%", "24vw"],
        ["p4-img8.png", "185vw", "70%", "45vw"],
        ["p4-img9.png", "230vw", "28%", "38vw"]
      ];
      strips.forEach(([f, l, t, w]) => {
        const img = document.createElement("img");
        img.className = "strip";
        img.src = PART + f;
        img.alt = "";
        img.style.left = l;
        img.style.top = t;
        img.style.width = w;
        world.appendChild(img);
      });

      // collectible poem fragments along the ride — touching one takes it
      const bitLines = [0, 8, 15, 24, 35, 42, 52, 60].map((i) => POEM[i % POEM.length]);
      const bitSpots = [
        [42, 20], [70, 70], [98, 32], [125, 78],
        [152, 14], [178, 62], [210, 40], [248, 74]
      ];
      bitSpots.forEach(([x, y], i) => {
        const bit = document.createElement("button");
        bit.type = "button";
        bit.className = "nyan-bit";
        bit.dataset.bit = "1";
        bit.textContent = bitLines[i % bitLines.length];
        bit.style.left = x + "vw";
        bit.style.top = y + "%";
        world.appendChild(bit);
      });

      // asteroid layer — rocks spawn & drift during the ride (seed a few starters)
      const rocks = document.createElement("div");
      rocks.id = "nyan-rocks";
      rocks.style.cssText = "position:absolute;inset:0;z-index:4;pointer-events:none;";
      world.appendChild(rocks);
      // seed a couple so the field isn't empty at the start
      for (let i = 0; i < 3; i++) {
        spawnAsteroid(rocks, 50 + i * 28 + Math.random() * 10, 18 + (i % 3) * 22 + Math.random() * 10);
      }

      slide.appendChild(world);
      // Cat lives on the slide (not the scrolling world) so Y stays viewport-safe
      const nyan = document.createElement("img");
      nyan.className = "nyan-fly player-control";
      nyan.id = "nyan-cat";
      nyan.src = PART + "nyan.gif";
      nyan.alt = "";
      nyan.style.left = "12%";
      nyan.style.top = "38%";
      slide.appendChild(nyan);
      const score = document.createElement("div");
      score.className = "nyan-score";
      score.id = "nyan-score";
      score.textContent = "lines 0/4";
      slide.appendChild(score);
      const bar = document.createElement("div");
      bar.className = "nyan-progress";
      bar.innerHTML = "<i id='nyan-bar'></i>";
      slide.appendChild(bar);
      const hold = document.createElement("button");
      hold.type = "button";
      hold.className = "nyan-hold";
      hold.id = "nyan-hold";
      hold.textContent = "Hold to start";
      slide.appendChild(hold);
      const hint = document.createElement("div");
      hint.className = "nyan-hint";
      hint.textContent = "hold · fly up and down · touch the notes";
      slide.appendChild(hint);
      // mid-ride spatial fork: X continue vs Y descend
      const choice = document.createElement("div");
      choice.className = "path-choice";
      choice.id = "path-choice";
      choice.innerHTML =
        "<div class=\"box\">" +
          "<h3>Fork in the path</h3>" +
          "<p class=\"sub\">→ X keeps going sideways into the black hole. ↓ Y drops below it. Either way the next desk is waiting.</p>" +
          "<div class=\"choices\">" +
            "<button type=\"button\" class=\"path-x\" data-path=\"hole\">" +
              "<span class=\"axis\">X</span>" +
              "<b>Keep going right</b>" +
              "<span>Ends the ride at the black hole</span>" +
            "</button>" +
            "<button type=\"button\" class=\"path-y\" data-path=\"memory\">" +
              "<span class=\"axis\">Y</span>" +
              "<b>Dive down</b>" +
              "<span>Skips the black hole — the poem carries on</span>" +
            "</button>" +
          "</div>" +
        "</div>";
      slide.appendChild(choice);
    }
  },
  {
    id: 5,
    hole: true,
    level: 4,
    hint: "Drag pieces away from the hole — keep them from falling in.",
    build(slide) {
      slide.classList.add("hole-sticky");
      slide.style.opacity = "1";
      const field = document.createElement("div");
      field.className = "hole-field";
      slide.appendChild(field);
      const stars = document.createElement("div");
      stars.className = "hole-stars";
      for (let i = 0; i < 70; i++) {
        const s = document.createElement("i");
        s.style.left = Math.random() * 100 + "%";
        s.style.top = Math.random() * 100 + "%";
        s.style.opacity = String(0.25 + Math.random() * 0.55);
        stars.appendChild(s);
      }
      slide.appendChild(stars);
      const disk = document.createElement("div");
      disk.className = "hole-disk";
      disk.id = "hole-disk";
      const hole = document.createElement("div");
      hole.className = "hole clickable";
      hole.id = "black-hole";
      hole.title = "Don't poke the hole";
      slide.appendChild(disk);
      slide.appendChild(hole);

      // few readable pieces, spawned near the edges
      const readable = POEM.slice(24, 29); // 5 pieces
      readable.forEach((line, i) => {
        const wrap = document.createElement("div");
        wrap.className = "orbit-strip draggable";
        wrap.dataset.i = String(i);
        wrap.dataset.phase = String((i / readable.length) * Math.PI * 2);
        wrap.dataset.piece = "1";
        const t = document.createElement("div");
        t.className = "readable";
        t.textContent = line;
        wrap.appendChild(t);
        slide.appendChild(wrap);
      });
      const hint = document.createElement("div");
      hint.className = "hole-hint";
      hint.textContent = "keep them away";
      slide.appendChild(hint);
    }
  },
  {
    id: 6,
    matrix: true,
    level: 5,
    hint: "Click each line before it vanishes.",
    build(slide) {
      slide.style.background = "#020805";
      slide.dataset.matrix = "1";
      const wrap = document.createElement("div");
      wrap.className = "matrix-wrap";
      const c = document.createElement("canvas");
      wrap.appendChild(c);
      slide.appendChild(wrap);
      requestAnimationFrame(() => matrix(c));

      // readable poem lines front-and-center
      const lines = POEM.slice(32, 40);
      const places = [
        ["8%", "10%"], ["48%", "14%"], ["12%", "28%"], ["52%", "34%"],
        ["10%", "48%"], ["46%", "54%"], ["16%", "70%"], ["50%", "76%"]
      ];
      lines.forEach((line, i) => {
        const el = document.createElement("div");
        el.className = "matrix-line matrix-bit";
        el.textContent = line;
        el.style.left = places[i][0];
        el.style.top = places[i][1];
        el.dataset.catch = "1";
        slide.appendChild(el);
      });
      // found strips as quieter accents
      [
        ["p6-img1.png", "72%", "8%", "22%"],
        ["p6-img6.png", "70%", "42%", "24%"],
        ["p6-img9.png", "6%", "84%", "36%"]
      ].forEach(([f, l, t, w]) => {
        const img = document.createElement("img");
        img.className = "strip matrix-bit";
        img.src = PART + f;
        img.alt = "";
        img.style.left = l; img.style.top = t; img.style.width = w;
        img.dataset.catch = "1";
        slide.appendChild(img);
      });
    }
  },
  {
    id: 7,
    end: true,
    build(slide) {
      slide.style.background = "#1a1a1a";
      slide.dataset.end = "1";
      // main end art only — omit p7-img1 achievement banner (duplicate of sticky toast)
      addObj(slide, "p7-img0.png", { left: "8%", top: "18%", width: "84%" });
    }
  }
];

function addBg(slide, file) {
  const img = document.createElement("img");
  img.className = "bg";
  img.src = PART + file;
  img.alt = "";
  slide.appendChild(img);
}

function addStrip(slide, file, { left, top, width, rotate = 0, z = 3 }) {
  const img = document.createElement("img");
  img.className = "strip";
  img.src = PART + file;
  img.alt = "";
  img.style.left = left; img.style.top = top; img.style.width = width;
  img.style.zIndex = String(z);
  if (rotate) img.style.transform = `rotate(${rotate}deg)`;
  slide.appendChild(img);
  return img;
}

function addObj(slide, file, { left, top, width }) {
  const img = document.createElement("img");
  img.className = "obj";
  img.src = PART + file;
  img.alt = "";
  img.style.left = left; img.style.top = top; img.style.width = width;
  slide.appendChild(img);
  return img;
}

function win95({ title, msg, icon, left, top, delay = 0, btns, bar }) {
  const el = document.createElement("div");
  el.className = "win95";
  el.style.left = left; el.style.top = top;
  el.style.transitionDelay = delay + "s";
  const ic = icon === "!" ? "warn" : icon === "i" ? "info" : "";
  const buttons = (btns || ["OK"]).map((b) => `<button type="button">${b}</button>`).join("");
  el.innerHTML =
    `<div class="title"><span>${title}</span><span class="x">×</span></div>` +
    `<div class="body"><div class="icon ${ic}">${icon === "!" ? "!" : icon === "i" ? "i" : "X"}</div><div>${msg}</div></div>` +
    (bar ? `<div class="bar"><i></i></div>` : "") +
    `<div class="btns">${buttons}</div>`;
  return el;
}
