# Project guide

The portfolio asks what happens to words when they lose their original context. The found poems and weaving sit alongside Markov poetry that draws on a pre-med application and Paul Kalanithi’s *When Breath Becomes Air*. The route you choose decides which fragments, rooms, and notes you encounter.

## Finding your way

- Search for **Remnants of a New World**, or leave the search empty, to start at the first desk. Search for **New World** to jump to the ending. A different search or **I'm Feeling Lucky** starts partway through.
- Scroll between rooms and open wall notes as you go. The map shows visited rooms and which rooms you can reach from them. At a fork, you can return and try the other door.
- If you hit a gate, use **Hint**. The five levels have you peel a portrait, close error windows, guide a rainbow cat, save fragments from a black hole, and catch falling lines.
- The ending shows achievements, the author’s full reflection, the process and tools statement, and references. The **Sound** button controls the background track and effects. The track is “Only You” by Danijel Zambo.

## Editing the project

| File | What to edit |
| --- | --- |
| [js/content/content.js](../js/content/content.js) | `SEQUENCE` orders the scenes. `ROOMS` defines desks and stops. `REFLECTION_NOTES` and `NOTE_SPOTS` define what the wall notes say and where they appear. |
| [js/content/reflection.js](../js/content/reflection.js) | The essay, process statement, and references that appear after the achievements. |
| [js/game/map.js](../js/game/map.js) | The rooms, links, and dead ends on the maze map. |
| [js/game/state.js](../js/game/state.js) | Shared progress and the achievement list. |
| [js/game/levels.js](../js/game/levels.js) | The five games that unlock the route. |
| [js/world/study.js](../js/world/study.js) | Desks, lamps, weather, and plant growth. |
| [js/world/journey.js](../js/world/journey.js) | Builds the scroll from the sequence and tracks which scene is active. |
| [js/boot.js](../js/boot.js) | Connects the search screen to the journey and starts the page. |

The browser loads the scripts in the order listed in [index.html](../index.html). Keep the content and shared state before the scripts that use them, and load `boot.js` last. The poems are stored as text in the repo.
