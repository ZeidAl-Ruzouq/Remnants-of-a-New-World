# Remnants of a New World

An online portfolio built as a free-form, game-like website. The reader moves through found poems, generated poetry, a weaving and small interactive levels. They choose their own path through a maze, read notes pinned to walls, and gradually discover what they've missed.

This README explains what the project is about (a summary of the author's reflection) and how the repository works. The full reflection is shown at the end of the site, after the achievements, and is stored in `js/reflection.js`.

---

## What this project is

### A spectrum of senses

The project starts from a question about perception. People usually count five senses: sight, hearing, smell, taste and touch. Yet each of them comes from the same fundamental physical interactions, whether it's a sugar molecule binding to a taste receptor or a photon striking the retina. If they share one origin, why treat them as separate categories rather than one sense, or a continuous spectrum? The portfolio carries that idea into its form. It deliberately blurs the boundaries between different ways of experiencing and interpreting a text.

### Readers as authors of found memories

The aim is to let readers make their own sense, draw their own paths and become authors of their own found memories. The design imitates free-form video games and uses "found" content as its material. It also reaches past vision and text alone, using sound, touch (clicking, dragging, peeling, steering) and a changing environment.

A typical visit goes like this. You start at a search screen and are taken into an ordinary room with calm music, warm but gloomy colours, a lamp and notes on the wall. A map hints at an "End?". You peel clippings off a portrait, meet a terminal whose code "does not work", and notice the weather turning to rain. You clear an "error", steer a rainbow cat between meteors, and choose between paths. You may be swallowed by a black hole and sent back to the search page. On another run you find a shelter overtaken by plants in sudden sunlight. You reach a list of achievements and know you've missed something. The shifting colours, sound, scattered layout, environmental changes and nonlinear paths are all deliberate. They make readers search for meaning, and create it as they go, instead of reading the poems in a fixed order.

### Analogue versus digital, and where meaning slips

The portfolio puts found poems, weavings and generated text in conversation with one another. Its strangeness comes from the slippage between analogue and digital ways of making.

- **Analogue (weaving):** meaning can be placed exactly, so the message reaches readers directly. The cost is the labour involved and a narrow sensory range.
- **Digital (PowerPoint found poems and a Markov generator):** many more senses can be engaged, such as sound, touch and sight. In the words of Ron Padgett's "Creative Reading", this introduces "misunderstandings" that can create something new.

The cost of the digital side is that deliberate meaning becomes harder to carry. RiTa.js's `markov()` has no contextual memory. One generated couplet shows this:

> In medicine, my values change from hand to hand
> For they cannot remain theory alone

The source was the author's pre-med application. It said the opposite: a fear of letting values change, and of humanity fading as medicine turns into a transaction. The generator flips that into a claim of changing values, as if the author were already a doctor. Elsewhere it seems to lecture Dr. Paul Kalanithi on being human, when the author had turned to Kalanithi to learn how to stay human. This echoes Eunsong Kim's "found devoid of memory" in "Found, Found, Found: Lived, Lived, Lived". The Markov chain "remembers" nearby words and patterns but forgets the larger history that gave them meaning. That memorylessness is the project's central theme.

### Who is the author?

The project credits several contributors:

- **The author:** the weaving and its message, one of the source texts, the selection and arrangement of the generated words, and the ideas and features requested while building the site.
- **Cursor:** the AI-powered IDE whose agents (from models such as Claude and ChatGPT) wrote the code as they interpreted those requests.
- **Paul Kalanithi's *When Breath Becomes Air*:** the second source for the Markov generator and context for the prompts.
- **Secondary material given to Cursor:** example sites from HTML Review, the assignment description, and Kim's and Padgett's essays. These shaped both the prompts and how the agents understood the project.

The result reads as a community effort with no single author.

### Remember, forget, create

The project:

- **Remembers** the feelings in the found poems, the importance of human virtue in medicine, and the assignment's requirements.
- **Forgets** individual identities and contexts: that the author is a student, not a doctor; Kalanithi's circumstances when he wrote; and the original narrative of each source.
- **Creates** new media, such as sound and interactive touch, for revisiting the theme of keeping one's humanity, along with new ways to meet someone else's misunderstandings.

The author's takeaway is that memory is found, revitalized and then shared. Like mathematics, it isn't a physical object, but we use it to make sense of the world. "Maybe memory has always existed, waiting to be discovered; maybe no one and everyone is original at the same time."

---

## Running it

It's a static site with no build step. Serve the folder and open it in a browser:

```bash
python -m http.server 8765
```

Then visit <http://127.0.0.1:8765/>.

---

## The experience, piece by piece

### Search page

The opening screen imitates an early search homepage. The query decides where you start:

| Query | Where you land |
|---|---|
| Default ("Remnants of a New World") or empty | The beginning |
| "New World" | The end ("The End?") |
| Anything else, or **I'm Feeling Lucky** | A random level partway through. Level gates before that point are unlocked so you can explore. |

### The journey

A single long scroll braids three kinds of section:

- **Desks:** study rooms where the generated poem sits as a paper on a desk under a lamp, with notes taped to the wall and windows to the outside.
- **Found-poem levels:** slides built from cut-out pieces of the PowerPoint found poems in `assets/found-parts/`. Each level must be cleared before you can scroll past it. An uncleared level hard-locks the scroll.
- **Warp:** a computer terminal (`assets/warp.jpg`). It runs `print("HelloWorld")` and answers "Code does not work".

The levels are kept easy:

1. **Reveal:** peel every clipping off the portrait, by clicking or dragging.
2. **Errors:** close the Windows 95 error pop-ups.
3. **Nyan Run:** hold to start, then steer the rainbow cat (mouse, WASD or arrows) past fiery rocks.
4. **Black Hole:** save the pieces before the hole swallows them. Poke it too many times and you're sent back to the search page.
5. **Error:** catch the falling code-rain lines.

### The maze map and paths

A map in the bottom-left corner shows a 6×6 maze of rooms. You can click any room joined to one you're in or have visited to travel there. The route has four forks:

- **Skip Warp** (and Desk III), going straight to Errors.
- **Skip Errors.**
- **Black Hole or Memory** during the Nyan Run.
- **Skip Error,** taking the shortcut to the last desk.

There are also three optional **note stops**: the Ordinary Room, the Office and the Shelter. Door buttons at each fork offer both ways every time you return, so you can scroll back and take the other path. Rooms you skip disappear from the scroll. A stop that sits on a branch you skipped can't be reached. The map also includes a dead end.

### Notes

The wall notes are the author's walkthrough of a visit, split into 25 notes in reading order and pinned across the desks and stops. Clicking a note opens it in a reader showing "note *k* / 25". Notes you've read stay on the wall with a check mark. Collecting them all earns an achievement.

### Environment

The world changes as you go:

- **Weather:** calm at first, rain from the middle of the journey, then sun.
- **Growth:** vines and plants grow from the second desk onward as you scroll, and by the Shelter they have overtaken the room. Fireflies and sunlight arrive late.
- **Lamp:** an articulated desk lamp leans over each desk and lights the notes and poem.
- **Lightning:** flashes in the storm rooms.

The background stage shifts colour and mood with each zone, and floating words drift past.

### Sound

The background music is "Only You" by Danijel Zambo (`assets/audio/only-you.mp3`). It loops for the whole journey, giving the warm but strange atmosphere. Short interaction sound effects are generated live with the Web Audio API and play on top.

The **Sound** button in the bottom-right corner silences everything at once. It pauses the track and suspends the audio engine. If you turn sound off on the search page, it stays off when the journey starts. Audio only starts after you interact with the page, as browsers require.

### End

At the end of the journey, three sections follow in order:

- **Achievements:** 29 in total, covering routes, stops, levels, the maze, and the notes. You can filter them by earned, all or missed.
- **Reflection:** the full reflection essay.
- **References:** links to the Markov poems and reflection, the found poems, the found-poems reflection, the Warp reflection, the project assignment and HTML Review issue 05. It also cites Kalanithi, Padgett and Kim.

---

## Repository layout

```
index.html          page markup; loads stylesheets and scripts in order
README.md
assets/
  audio/only-you.mp3 looping background music
  warp.jpg          the terminal image for the Warp section
  found-parts/      cut-out pieces used to build the found-poem slides
css/                cascade order matters (as listed in index.html)
  base.css          variables, typography, sound button, scrollbar
  stage.css         fixed background stage and moods
  opening.css       the search homepage
  map.css           the maze chart
  study.css         desks, stop rooms, notes, note reader, lamp, vines
  levels.css        level UI, door buttons
  reveal.css        the peel-the-portrait level
  weather-growth.css rain, sun, overgrowth, achievements panel
  warp.css          the terminal
  end.css           closing, reflection, references, reduced motion
js/                 classic scripts sharing one global scope, in load order
  content.js        poem, sheets, ROOMS, REFLECTION_NOTES, NOTE_SPOTS, SEQUENCE
  reflection.js     REFLECTION_ESSAY — the full reflection shown at the end
  slides.js         found-poem slide layouts and Win95 pop-ups
  state.js          ACHIEVEMENTS and shared game state
  map.js            maze nodes, links, dead ends, travel and routes
  audio.js          background track, sound effects, sound toggle
  atmosphere.js     background stage, floating words, moods
  gates.js          scroll locking until levels are cleared
  levels.js         the five levels (reveal, errors, nyan, hole, error)
  progress.js       route visibility, door buttons, notes, achievements
  study.js          desk rooms, lamp, vines, growth, lightning
  journey.js        builds every section from SEQUENCE and handles scroll
  boot.js           search page, wiring, starts everything (runs last)
```

## Editing the content

- **Order of the journey:** `SEQUENCE` in `js/content.js`. Each step is a `poem` (desk), `found` (level), `warp`, `close`, `achievements`, `reflection` or `refs`. `branch` ties a step to a fork, and `doors` places that fork's door buttons.
- **Desks and stops:** `ROOMS` in `js/content.js`. This sets which poem sheets sit on each desk, plus growth and weather. Stops have `stop: true` and no desk.
- **Wall notes:** `REFLECTION_NOTES` in `js/content.js`. Each note has a `room` and `text`. `NOTE_SPOTS` sets where notes are pinned on the wall.
- **Reflection essay:** `REFLECTION_ESSAY` in `js/reflection.js`. Each entry is a paragraph (`p`) or an indented quote (`quote`, one string per line).
- **Maze:** `CHART_NODES`, `CHART_LINKS` and `DEAD_ENDS` in `js/map.js`. Nodes sit on grid cells (`c`, `r`). Links can bend through `via` cells.
- **Achievements:** `ACHIEVEMENTS` in `js/state.js`.

All text appears exactly as written in these files. Nothing is generated at runtime.
