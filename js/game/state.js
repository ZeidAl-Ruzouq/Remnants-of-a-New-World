/* Achievements list, player state and shared runtime handles. */

const ACHIEVEMENTS = [
  { id: "reveal", group: "levels", label: "Reveal the portrait", hint: "Clear Level 1", node: "reveal" },
  { id: "warp", group: "levels", label: "Run HelloWorld", hint: "Warp terminal", node: "warp" },
  { id: "errors", group: "levels", label: "Close the errors", hint: "Clear Level 2", node: "errors" },
  { id: "nyan", group: "levels", label: "Finish the cat ride", hint: "Clear Level 3", node: "nyan" },
  { id: "nyan-lines", group: "notes", label: "Take every floating note", hint: "Touch all eight on the ride", node: "nyan" },
  { id: "path-hole", group: "routes", label: "Path X: Black Hole", hint: "Keep going right", node: "hole" },
  { id: "path-memory", group: "routes", label: "Path Y: Dive under", hint: "Drop below the hole", node: "nyan" },
  { id: "path-skip-warp", group: "routes", label: "Shortcut past Warp", hint: "Go from Desk II straight to Errors", node: "errors" },
  { id: "path-skip-errors", group: "routes", label: "Shortcut past Errors", hint: "Go from Desk III straight to Desk IV", node: "p4" },
  { id: "path-skip-matrix", group: "routes", label: "Shortcut past Error", hint: "Go from Desk V straight to the Last Desk", node: "p6" },
  { id: "stop-room", group: "routes", label: "Stop: Ordinary Room", hint: "Step off at the first desk", node: "room" },
  { id: "stop-office", group: "routes", label: "Stop: Office", hint: "Step off after the terminal", node: "office" },
  { id: "stop-shelter", group: "routes", label: "Stop: Shelter", hint: "Step off after the Error level", node: "shelter" },
  { id: "maze-all", group: "routes", label: "Every room", hint: "Set foot in every room on the map", node: "search" },
  { id: "hole", group: "levels", label: "Survive the hole", hint: "Clear Level 4", node: "hole" },
  { id: "hole-restart", group: "secrets", label: "Poked the void once too often", hint: "Touch the black hole until it spits you back to the search page", node: "hole" },
  { id: "matrix", group: "levels", label: "Catch the error", hint: "Clear Level 5", node: "matrix" },
  { id: "matrix-all", group: "notes", label: "Error sweep", hint: "Catch every bit in one run", node: "matrix" },
  { id: "notes", group: "notes", label: "Note collector", hint: "Read a note on the wall", node: "p1" },
  { id: "notes-all", group: "notes", label: "Every note on the way", hint: "Read every wall note on your route", node: "p1" },
  { id: "notes-complete", group: "notes", label: "Nothing left unread", hint: "Collect every note in the entire experience", node: "p6" },
  { id: "poem-rooms", group: "journey", label: "Sit at every desk", hint: "Visit all six desks", node: "p1" },
  { id: "sheets-all", group: "journey", label: "Read every sheet", hint: "Turn to all thirteen papers", node: "p6" },
  { id: "lamp", group: "secrets", label: "Pull the lamp chain", hint: "Switch the desk lamp off and on", node: "p1" },
  { id: "fireflies", group: "journey", label: "Light without a lamp", hint: "Let the vines take the lamp", node: "p6" },
  { id: "lucky", group: "secrets", label: "Feeling Lucky", hint: "Use I'm Feeling Lucky", node: "search" },
  { id: "random", group: "secrets", label: "Random remnant", hint: "Search a random query", node: "search" },
  { id: "levels", group: "journey", label: "Clear every level", hint: "Finish every level on your route", node: "end" },
  { id: "end", group: "journey", label: "Reach The End?", hint: "Find the last slide", node: "end" }
];

const ACHIEVEMENT_GROUPS = [
  { id: "journey", label: "Journey" },
  { id: "levels", label: "Levels" },
  { id: "notes", label: "Notes" },
  { id: "routes", label: "Routes" },
  { id: "secrets", label: "Secrets" }
];

const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

const state = {
  sound: false,
  zone: "science",
  here: "Search Page",
  hereNode: "search",
  gateMax: null,
  furthestScroll: 0,
  path: null, /* "hole" (X) | "memory" (Y) after nyan fork */
  /* forks: "skip" hides the rooms a shortcut passes; stops: "visit" opens them */
  routes: { mid: null, errors: null, late: null, room: null, office: null, shelter: null },
  readerAtY: 0,
  pathChoiceShown: false,
  pathChoiceAt: 0,
  nyanForkAt: 0.52,
  visited: new Set(["search"]),
  earned: new Set(),
  grow: 0,              /* how far the vines have taken over (0..1, never rewinds) */
  lampOn: true,
  lampLost: false,
  poemRoomsSeen: new Set(),
  sheetsRead: new Set(),
  notesCollected: 0,
  notesTotal: 0,
  nyanY: 0.42,
  nyanYVel: 0,
  nyanP: 0,
  nyanStarted: false,
  nyanHolding: false,
  nyanKeys: { u: false, d: false, l: false, r: false },
  nyanHitCooldown: 0,
  nyanMissCooldown: 0,
  nyanCollected: 0,
  nyanBitsNeed: 4,
  nyanBitsTotal: 8,
  asteroidSpawnAt: 0,
  holeStarted: false,
  holeStartAt: 0,
  holeDefense: null,
  holeClicks: 0,
  returnTo: null,       /* section to drop back into after a black-hole restart */
  matrixCaught: 0,
  matrixNeed: 5,
  usedLucky: false,
  usedRandom: false,
  clamping: false,
  journeyBuilt: false
};

let ctx, sfxBus = null;

let matrixTimer = null, mcPlayed = false;

let mcToastTimer = null, mcToastAtY = 0, mcToastSection = null;

let beatIo = null, lineIo = null;
