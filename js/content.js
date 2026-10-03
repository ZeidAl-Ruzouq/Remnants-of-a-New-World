/* Content: poem text, sheets, rooms, the journey sequence. */

/* =========================================================
   YOUR TEXT ONLY — poem lines
   ========================================================= */
/* Nine stanzas — the AAAA separator lines are stanza breaks and never rendered */
const STANZAS = [
  [
    "Medicine isn’t worth mastering without connection",
    "Transactions can fail between human beings",
    "But presence can create deep connection"
  ],
  [
    "In medicine, my values change from hand to hand",
    "For they cannot remain theory alone",
    "Connection can make families feel whole",
    "It can make healing of suffering immediate"
  ],
  [
    "Didn’t philosophize about meaning in my residency",
    "Much of my life built on that bedrock",
    "It lacked the mortality that I had never faced",
    "I only hoped for balance, a plan, and action"
  ],
  [
    "Oh, how mortality became its own lesson",
    "I remembered, but only later understood",
    "I chose decisions inspired by the faces before me",
    "Not by the fear of defeat"
  ],
  [
    "Agent meets another",
    "Agent forced another to look at themselves",
    "A doctor carries responsibility with every decision",
    "So philosophy follows those decisions too",
    "But something about those decisions felt urgent",
    "Sometimes it is sad and urgent",
    "Think about the cadaver’s place in our future work",
    "Think about the ethics that follow it",
    "Intellect inspired my career",
    "Yet memory captivated me",
    "Ask the neurological question",
    "If intellect is lost, is the physician lost too?",
    "Or does morality reveal the person beneath the profession?",
    "What will our future choices leave behind?",
    "What will they allow us to breathe?",
    "A surgeon can shape policy",
    "But policy does not always picture the homes behind it",
    "Healing requires renewal and humility",
    "It also requires belief and growth",
    "It requires a patient"
  ],
  [
    "Illness revealed what scientists could miss",
    "It also revealed what patients valued",
    "Terminally ill, I was leaving one foundation behind",
    "I had to find another route"
  ],
  [
    "Ultimately, found relationality, theory, studying, business, and policy left me dissatisfied",
    "Knowledge sometimes avoided what was “invisible”",
    "Comfort entered patients’ rooms",
    "Can anyone truly be prepared to die?",
    "Wouldn’t losing your years change more than death?",
    "Wouldn’t it change your understanding of humanity?",
    "A Doctor didn’t only need to listen",
    "They need to learn to see people’s stories in their eyes",
    "Scientists esteem neurology",
    "But what happens to memory?",
    "Death changed how we made meaning from suffering",
    "Life and pride suddenly seem like a joke",
    "Medicine was no longer only about treating patients"
  ],
  [
    "A dying man, a neurosurgeon, had finally become a patient",
    "Even Nietzsche seemed to follow him into his fear",
    "She who cared for him said love remained",
    "Even when so much else had passed",
    "From what remained, something new could still grow",
    "Could that be what brings new life forward?",
    "A bright mind could feel miles away",
    "Its voice could still reveal what mattered"
  ],
  [
    "Belief was saved through presence",
    "The patient began to grow through that presence",
    "The transaction between doctor and patient became fragile",
    "It became human-to-human",
    "hand-to-hand",
    "At the root of every future breath was healing"
  ]
];

/* Flat line list — used by the levels that scatter single lines. */
const POEM = STANZAS.reduce((all, s) => all.concat(s), []);

/* Sheets of paper. Long stanzas (V, VII, VIII) span more than one sheet so the
   word count can be spread evenly between the game sections; every other
   stanza stays whole on a single sheet. */
const SHEETS = [
  { label: "I", lines: STANZAS[0] },
  { label: "II", lines: STANZAS[1] },
  { label: "III", lines: STANZAS[2] },
  { label: "IV", lines: STANZAS[3] },
  { label: "V · i", lines: STANZAS[4].slice(0, 7) },
  { label: "V · ii", lines: STANZAS[4].slice(7, 14) },
  { label: "V · iii", lines: STANZAS[4].slice(14) },
  { label: "VI", lines: STANZAS[5] },
  { label: "VII · i", lines: STANZAS[6].slice(0, 6) },
  { label: "VII · ii", lines: STANZAS[6].slice(6) },
  { label: "VIII · i", lines: STANZAS[7].slice(0, 4) },
  { label: "VIII · ii", lines: STANZAS[7].slice(4) },
  { label: "IX", lines: STANZAS[8] }
];

/* Rooms. Desks keep the poem sheets; stops are optional rooms with only wall notes.
   grow:  how far this room has been claimed when you sit here
   weather: what the windows are doing */
const ROOMS = [
  { id: "p1", name: "Study · First Desk", sheets: [0, 1, 2], grow: 0.04, weather: "calm" },
  { id: "p2", name: "Study · Second Desk", sheets: [3, 4], grow: 0.16, weather: "rain" },
  { id: "p3", name: "Study · Third Desk", sheets: [5, 6], grow: 0.34, weather: "rain" },
  { id: "p4", name: "Study · Fourth Desk", sheets: [7, 8], grow: 0.48, weather: "sun" },
  { id: "p5", name: "Study · Fifth Desk", sheets: [9, 10], grow: 0.66, weather: "sun" },
  { id: "p6", name: "Study · Last Desk", sheets: [11, 12], grow: 1, weather: "overgrow" },
  { id: "room", name: "Ordinary Room", stop: true, sheets: [], grow: 0.08, weather: "calm" },
  { id: "office", name: "Office", stop: true, sheets: [], grow: 0.3, weather: "rain" },
  { id: "shelter", name: "Shelter", stop: true, sheets: [], grow: 0.86, weather: "overgrow" }
];

/* =========================================================
   YOUR TEXT ONLY — the reflection, split into wall notes in reading order.
   room: where the note is pinned
   ========================================================= */
const REFLECTION_NOTES = [
  { room: "p1", text: "You start at a search screen, where you are already given something to search for. However, you notice that you can remove phrases like “Remnants of a” to get only the phrase “New World,” but you can also search for anything or press “I’m feeling lucky” to start on a random level." },
  { room: "p1", text: "When you enter, strange but calm music fills the atmosphere; you are in an ordinary room. Scattered notes line the wall. Gloomy but warm colors fill the room." },
  { room: "room", text: "A lamp illuminates a note that you start reading." },
  { room: "room", text: "While the atmosphere is calm, you still feel a sense of urgency. A sense of curiosity? Primal instinct?" },
  { room: "room", text: "Your “curiosity” drives you to understand and find meaning in the memories that lie in front of you." },
  { room: "room", text: "The poem talks of transactions and presence in medicine? There is a map at the lower end, and you learn of an “End?” Are you in a maze?" },
  { room: "p2", text: "You make your way through a strange landscape. A portrait of an unknown figure awaits behind “alien” notes." },
  { room: "p2", text: "You remove it to reveal a figure who stares at you, as if he knows you, but you sure don’t." },
  { room: "office", text: "You come across more notes, then are suddenly greeted by a computer terminal." },
  { room: "office", text: "But weren’t you just in an office?" },
  { room: "office", text: "You click “run,” but “it does not work” — strange?" },
  { room: "p3", text: "You come across more notes and notice that each level is an obstacle leading to more memories, but do the levels themselves hold memories?" },
  { room: "p3", text: "You begin to notice a change in the tone of the poem; was there more than one person here?" },
  { room: "p3", text: "Outside, things have changed too. It gets darker and starts raining." },
  { room: "p4", text: "You continue, but your path is interrupted by an “error”; you resolve it and continue." },
  { room: "p4", text: "The path stops, but there is a rainbow cat? You click and move it horizontally across the page, avoiding meteors, but not the poems." },
  { room: "p5", text: "Suddenly, you stop, and you stumble across a divergence. Should I continue forward, or take “the path not taken?”" },
  { room: "p5", text: "You choose to continue on your usual path and come across a black hole." },
  { room: "p5", text: "It sucks in the memories you were looking for; you try to save them, but accidentally click too many times on the black hole and are returned to the search page." },
  { room: "shelter", text: "You take the same journey again, following the map, but this time you choose the other path and reach another level — a break." },
  { room: "shelter", text: "While taking a break and repairing another bug, you ask yourself if the path you took this time left a memory behind." },
  { room: "shelter", text: "Your train of thought is interrupted when you notice that plants have grown and overtaken your shelter." },
  { room: "p6", text: "You finish the break and continue. You finally reach the end?" },
  { room: "p6", text: "You find a list of “achievements.”" },
  { room: "p6", text: "You know you have missed something." }
];

/* wall positions [left%, top%] by how many notes a room holds — clear of the windows */
const NOTE_SPOTS = {
  desk: [[5, 9], [83, 11], [12, 46], [80, 44]],
  stop: [[6, 10], [80, 9], [13, 50], [44, 62], [74, 50]]
};

const WINDOW_OPEN_AT = 0.48;  /* plants slowly push the casements open */

const VINES_WINDOW_AT = 0.58; /* vines begin climbing through the glass */

const LAMP_LOST_AT = 0.93;    /* vines swallow the lamp; fireflies take over */

/*
  Conversation sequence: cut & braid poem / warp / found.
  Edit this array to rearrange the journey.
*/
/* One desk between each pair of game sections. A poem step never creates a
   second room: adjacent poem steps are folded into one desk's sheet stack,
   which is what used to make late stanzas spawn a surprise extra room. */
const SEQUENCE = [
  { type: "poem", room: 0, doors: "p1" },
  { type: "poem", room: 6, branch: "room" },
  { type: "found", i: 1 },
  { type: "poem", room: 1, doors: "p2" },
  { type: "warp", branch: "warp", doors: "warp" },
  { type: "poem", room: 7, branch: "office" },
  { type: "poem", room: 2, branch: "warp", doors: "p3" },
  { type: "found", i: 2, branch: "errors" },
  { type: "poem", room: 3 },
  { type: "found", i: 3 },
  { type: "found", i: 4, branch: "hole" },
  { type: "poem", room: 4, doors: "p5" },
  { type: "found", i: 5, branch: "matrix", doors: "matrix" },
  { type: "poem", room: 8, branch: "shelter" },
  { type: "poem", room: 5 },
  { type: "found", i: 6 },
  { type: "close" },
  { type: "achievements" },
  { type: "reflection" },
  { type: "refs" }
];

/** Fold consecutive poem steps (same branch) into one desk so no step can
 *  ever mount a second room on its own. */
function coalesceSequence(seq) {
  const out = [];
  seq.forEach((step) => {
    const copy = Object.assign({}, step);
    if (copy.type === "poem") {
      const room = ROOMS[copy.room] || ROOMS[0];
      copy.rooms = copy.rooms || [room];
      const prev = out[out.length - 1];
      if (prev && prev.type === "poem" && (prev.branch || null) === (copy.branch || null)) {
        prev.rooms = prev.rooms.concat(copy.rooms);
        return;
      }
    }
    out.push(copy);
  });
  return out;
}

const JOURNEY = coalesceSequence(SEQUENCE);
