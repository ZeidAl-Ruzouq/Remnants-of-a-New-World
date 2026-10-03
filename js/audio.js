/* Looping background track (<audio id="bg-track">), Web Audio sound effects, mute. */

const BG_TRACK_VOLUME = 0.6;

let audioOut = null;   /* every sound effect passes through here — the effects mute switch */

function bgTrack() { return document.getElementById("bg-track"); }

/** Play the track; if the browser blocks it, try again on the next click or key press. */
function playBgTrack() {
  const a = bgTrack();
  a.volume = BG_TRACK_VOLUME;
  const p = a.play();
  if (p && p.catch) p.catch(() => {
    const retry = () => {
      removeEventListener("pointerdown", retry);
      removeEventListener("keydown", retry);
      if (state.sound) bgTrack().play().catch(() => {});
    };
    addEventListener("pointerdown", retry);
    addEventListener("keydown", retry);
  });
}

function bootAudio() {
  if (ctx) return;
  ctx = new (AudioContext || webkitAudioContext)();
  audioOut = ctx.createGain();
  audioOut.gain.value = 0;
  audioOut.connect(ctx.destination);

  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -16;
  comp.ratio.value = 6;
  comp.attack.value = 0.003;
  comp.release.value = 0.22;
  comp.connect(audioOut);
  sfxBus = ctx.createGain();      /* interaction sounds — deliberately loud */
  sfxBus.gain.value = 3.4;
  sfxBus.connect(comp);
}

/* Short Web Audio SFX — muted with Sound toggle */
function sfx(kind) {
  if (!ctx || !state.sound || !sfxBus) return;
  const t0 = ctx.currentTime;
  const beep = (freq, dur, type = "square", vol = 0.16, when = 0) => {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.value = 0;
    o.connect(g); g.connect(sfxBus);
    const t = t0 + when;
    g.gain.linearRampToValueAtTime(vol, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.start(t); o.stop(t + dur + 0.03);
  };
  const noise = (dur, vol = 0.12) => {
    const n = ctx.createBufferSource();
    const buf = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (d.length * 0.35));
    n.buffer = buf;
    const g = ctx.createGain();
    g.gain.value = vol;
    n.connect(g); g.connect(sfxBus);
    n.start(t0);
  };
  if (kind === "click") beep(640, 0.07, "square", 0.15);
  else if (kind === "nav") { beep(420, 0.06, "triangle", 0.13); beep(560, 0.08, "triangle", 0.1, 0.05); }
  else if (kind === "hint") { beep(360, 0.09, "sine", 0.15); beep(540, 0.14, "triangle", 0.13, 0.06); }
  else if (kind === "pickup") { beep(300, 0.08, "triangle", 0.17); beep(600, 0.1, "sine", 0.1, 0.04); }
  else if (kind === "drop") beep(190, 0.1, "triangle", 0.16);
  else if (kind === "close") { beep(160, 0.09, "square", 0.19); beep(110, 0.12, "square", 0.14, 0.05); }
  else if (kind === "hit") { beep(80, 0.18, "sawtooth", 0.24); noise(0.12, 0.15); }
  else if (kind === "fire") { noise(0.1, 0.16); beep(140, 0.12, "sawtooth", 0.15); }
  else if (kind === "miss") beep(520, 0.05, "sine", 0.1);
  else if (kind === "save") { beep(480, 0.08, "sine", 0.16); beep(720, 0.12, "sine", 0.12, 0.05); }
  else if (kind === "catch") { beep(760, 0.08, "square", 0.17); beep(980, 0.1, "square", 0.12, 0.05); }
  else if (kind === "clear") { beep(392, 0.12, "triangle", 0.2); beep(523, 0.15, "triangle", 0.16, 0.08); beep(659, 0.22, "triangle", 0.14, 0.16); }
  else if (kind === "toast") { beep(262, 0.16, "square", 0.2); beep(330, 0.2, "square", 0.16, 0.1); beep(392, 0.28, "square", 0.14, 0.2); }
  else if (kind === "path") { beep(310, 0.1, "triangle", 0.18); beep(465, 0.16, "triangle", 0.15, 0.08); }
  else if (kind === "overtake") { beep(60, 0.25, "sawtooth", 0.28); noise(0.2, 0.2); beep(40, 0.3, "sine", 0.16, 0.05); }
  else if (kind === "dest") beep(500, 0.07, "square", 0.15);
  else if (kind === "lamp") { beep(1200, 0.03, "square", 0.14); beep(240, 0.09, "triangle", 0.14, 0.03); }
  else if (kind === "flip") { noise(0.08, 0.1); beep(420, 0.05, "sine", 0.09, 0.02); }
  else if (kind === "grow") { beep(180, 0.3, "sine", 0.12); beep(270, 0.42, "sine", 0.09, 0.12); beep(360, 0.5, "sine", 0.07, 0.26); }
  else if (kind === "thunder") { noise(1.9, 0.26); beep(44, 1.5, "sine", 0.24, 0.02); beep(61, 1.0, "triangle", 0.12, 0.12); }
}

/** Off pauses the track at once, silences effects within ~80 ms and suspends the audio engine. */
function setSound(on) {
  state.sound = on;
  if (on) playBgTrack();
  else bgTrack().pause();
  bootAudio();
  const b = document.getElementById("sound-toggle");
  b.textContent = on ? "Sound: On" : "Sound: Off";
  b.setAttribute("aria-pressed", on ? "true" : "false");
  const now = ctx.currentTime;
  audioOut.gain.cancelScheduledValues(now);
  audioOut.gain.setValueAtTime(audioOut.gain.value, now);
  if (on) {
    if (ctx.state === "suspended") ctx.resume();
    audioOut.gain.linearRampToValueAtTime(1, now + 0.15);
  } else {
    audioOut.gain.linearRampToValueAtTime(0, now + 0.08);
    setTimeout(() => {
      if (!state.sound && ctx.state === "running") ctx.suspend();
    }, 140);
  }
}
