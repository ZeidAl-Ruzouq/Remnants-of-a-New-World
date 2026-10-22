/* End-matter text: reflection essay, process/tools statement, APA references.
   YOUR TEXT ONLY — paragraphs use `p`, the poem excerpt uses `quote`.
   APA entries use `parts` (plain `text` or `italic`) and optional `href` for the URL. */

const REFLECTION_ESSAY = [
  { p: "The human experience of life exists beyond vision alone; most define the full range of human senses as having five categories: sight, hearing, smell, taste, and touch. These senses permit us to experience our environment and pursue meaning. They make us what we are. However, I believe that there is more to the experience of life than just these five senses. A sixth sense? Or even a spectrum of senses? The way I think of it is that, at least with our traditional system of five senses, all senses derive, in essence, from the fundamental interactions of the forces of gravity, electromagnetism, and the strong and weak nuclear forces. Whether it be sugar molecules attaching to our taste receptors or our retinas producing and sending electrical signals to our brains after being bombarded by light photons, these senses ultimately emerge from the same fundamental interactions. So why don’t we just define them as one sense, or have a continuous spectrum of senses, if they are all fundamentally one and the same? Rather than treating these senses as entirely isolated categories, I wanted my project to similarly blur the boundaries between different ways of experiencing and interpreting something." },
  { p: "In this project, I aimed to give readers a way to make their own sense, draw their own paths, and become authors of their own found memories. In the design of my online portfolio, I set out to imitate free-form video games that use content I “found” (more on that later) as the material, while also incorporating a broader range of human senses rather than relying on vision and text alone." },
  { p: "You start at a search screen, where you are already given something to search for. However, you notice that you can remove phrases like “Remnants of a” to get only the phrase “New World,” which, when searched, takes you immediately to the end, but you can also search for anything or press “I’m feeling lucky” to start on a random level. When you first enter, strange but calm music fills the atmosphere; you are in an ordinary room. Scattered notes line the wall. Gloomy but warm colors fill the room. A lamp illuminates a note that you start reading. While the atmosphere is calm, you still feel a sense of urgency. A sense of curiosity? Primal instinct? Your “curiosity” drives you to understand and find meaning in the memories that lie in front of you. The poem talks of transactions and presence in medicine? There is a map at the lower end, and you learn of an “End?” Are you in a maze? You make your way through a strange landscape. A portrait of an unknown figure awaits behind “alien” notes. You remove it to reveal a figure who stares at you, as if he knows you, but you sure don’t. You come across more notes, then are suddenly greeted by a computer terminal. But weren’t you just in an office? You click “run,” but “it does not work” — strange? You come across more notes and notice that each level is an obstacle leading to more memories, but do the levels themselves hold memories? You begin to notice a change in the tone of the poem; was there more than one person here? Outside, things have changed too. It gets darker and starts raining. You continue, but your path is interrupted by an “error”; you resolve it and continue. The path stops; there is a rainbow cat. You click and move it horizontally across the page, avoiding meteors, but not the poems. Suddenly, you stop, and you stumble across a divergence. Should I continue forward, or take “the path not taken?” You choose to continue on your usual path and come across a black hole. It sucks in the memories you were looking for; you try to save them, but accidentally click too many times on the black hole and are returned to the search page. You take the same journey again, following the map, but this time you choose the other path and reach another level — a break. While taking a break and repairing another bug, you ask yourself if the path you took this time left a memory behind. Your train of thought is interrupted when the sun’s glaring beams catch you off guard; the rain has stopped, and the plants have grown and overtaken your shelter. However, it feels calming, like an end to a search for meaning or the beginning of something new. You finish the break and continue. You finally reach the end? You find a list of “achievements.” You know you have missed something." },
  { p: "The experience just described is one of various scenarios a typical reader could follow (some of which I included in the notes spread throughout the portfolio). These formal choices—the shifting colors, sound, scattered layout, environmental changes, and nonlinear paths—intentionally complicate the content by requiring readers to search for meaning and create it in the process, rather than encounter the poems in a fixed order. Searching for the “New World” lets readers reach the ending without experiencing the memories that would otherwise lead them there. The achievements list reveals paths and interactions they have missed, suggesting that even after reaching the end, their experience remains incomplete. In this sense, the sequence does more than organize the different works: it determines which memories readers encounter and which they leave behind. The online portfolio mixes my found poems, weavings, and generated text so that they are in conversation with one another. Its “strangeness” is derived from the fundamental differences and areas of slippage between the analogue and digital processes I used to create media. In analogue processes such as weaving, I could manipulate and place meaning exactly as I saw it, which allowed me to convey a clearer message to readers. The crossing of threads creates a fixed arrangement that readers can interpret but cannot rearrange themselves. I carried a similar pattern into the website's background through horizontal and vertical lines, except that the digital environment changes as readers move between sections. However, I am limited by both the arduous labor involved and the medium’s inability to incorporate the full range of senses. On the other hand, digital processes like my PowerPoint found poems, and the Markov generator allowed me to incorporate a much wider sensory range through media such as sound, touch, and sight, which I explored through specific interactions rather than through text alone. For instance, Danijel Zambo's “Only You” plays throughout the journey, while the sounds of flipping papers, picking up and dropping fragments, and switching the lamp accompany the reader's actions (Zambo, n.d.). Even the approaching storm is not communicated through darker colors and rain alone, but through the sound of thunder. The reader also has to drag away the clippings covering the portrait and physically guide the rainbow cat across the screen. Though this does not reproduce the literal sensation of touch, it requires movement and interaction, allowing readers to participate in the work beyond simply looking at it. These different forms of sensory engagement participate in what Ron Padgett (1997) describes in *Creative Reading* as “misunderstandings” by creating even more possibilities for something newfound. This is also evident in the found poems themselves. For instance, one fragment placed over the portrait contains the unfinished words “haunts the,” leaving the reader without the context necessary to understand what is haunting whom. Another fragment reads “contains all the complete stories, and several fragments of stories,” even though readers encounter it as a fragment removed from a larger text. The contrast between the fragment's claim and its actual form creates a new interpretation that may not have existed in its original context. A natural consequence, though, of the digital processes that I used is that intended meaning becomes harder to control, as algorithms such as RiTa.js’s markov() function are devoid of contextual memory. An example is the part of the generated poem that reads:" },
  { quote: ["“In medicine, my values change from hand to hand", "For they cannot remain theory alone”"] },
  { p: "This was generated from my application for a pre-med program, in which I wrote about why medicine matters to me and whether I had contemplated another career path at any point in my life. In the essay, I wrote that I did not want my values to change and that I feared my humanity would fade if I became a doctor due to repeated exposure to procedures, reducing medicine to a transaction to be completed rather than focusing on the person. However, the generated text inverts my meaning in a way that claims I plan to change my values to accommodate a more human side, as if I am already a doctor. This misunderstanding continues throughout the generated poem, where it also makes it seem as though I am lecturing Dr. Kalanithi on how to become more human, even though my original intent was the opposite: I sought Kalanithi’s experiences to teach me how to maintain my own humanity. The line “Didn’t philosophize about meaning in my residency” gives the speaker an experience I have never had. In contrast, the line “A dying man, a neurosurgeon, had finally become a patient” draws on Kalanithi's experience of becoming a patient himself (Kalanithi, 2016). The generated writing moves between these identities as though they belong to one person. This was not a contradiction I deliberately asked the Markov generator to create; rather, it was an unintended result of combining the source texts that I chose to retain in the final poem. This parallels what Kim (2016) describes when she writes, “Of the removed found. Of the found that does not live. Of found devoid of memory” (p. 55), suggesting a “found” that has been separated from the lived memory that originally gave it meaning. However, Kim's essay also demonstrates that removing something from its original context can involve questions of power and ownership, particularly in her discussions of archival photographs of enslaved people and the appropriation of Michael Brown's autopsy report. The consequences of those examples are not equivalent to the misunderstandings in my generated poem, but her argument raises a question that applies to my own use of found language: does having access to someone's words necessarily give us the authority to redefine their meaning? In this sense, the algorithm can retain the language while forgetting what lies behind it: it holds no purpose of its own for reading or writing and cannot itself assume the responsibility for properly carrying forward the intended meaning of the original text. This is where the Markov chain’s memorylessness becomes most visible in my project: it can “remember” nearby words and patterns while forgetting the larger history that gave those words meaning. I also tried to make this limitation something readers could experience rather than merely read about. In the black-hole level, the fragments being pulled inward include “Yet memory captivated me” and “If intellect is lost, is the physician lost too?” The reader must attempt to save these words from disappearing, even though the words themselves question what remains of a person when memory or intellect is lost. The action therefore gives the generated text an additional meaning through the very possibility of losing it." },
  { p: "Moreover, the project’s methodology complicates who I can name as the author. For context, the online portfolio was created with the assistance of Cursor, an AI-powered IDE that provides access to agents from parent LLMs such as Claude and ChatGPT to provide code completions. From my perspective, I created the weaving and its message, one of the sources of the text, the choices and organization of words selected from the Markov generator, and the ideas and features that my prompts asked Cursor to create. Cursor responded to my prompts by using agents to create what I asked for, but based on how those agents interpreted my requests. At times, however, I would also blank out while working on the project and turn to ChatGPT for suggestions on how I might continue. This meant that some of the ideas incorporated into the project were influenced by ChatGPT's responses rather than coming solely from my initial intentions. The distinction between these contributions becomes important: RiTa.js generated combinations of language that I selected and organized, while Cursor's agents implemented features based on my prompts, and ChatGPT sometimes helped determine what those ideas could become in the first place. Rather than attempting to separate every contribution into a single author's work, I wanted this uncertainty to become part of the project itself: just as readers cannot always distinguish which memories belong to whom, I cannot always identify where one contributor's ideas end and another's begin. Even the strange error messages scattered throughout the website, such as “Code does not work,” were intentionally included as part of the experience (a response from one of Prof. Baskin’s students to my Weft message) rather than just being actual failures of the website's code. A fourth contributor was Paul Kalanithi’s *When Breath Becomes Air* (2016), which acted as both a second source for the Markov generator and provided context for my prompting of Cursor. However, a fifth contributor to the project was the secondary material provided to Cursor that further shaped its understanding of the project. I added examples of sites from The HTML Review (2026) that inspired me to create my portfolio as an online simulation, the assignment description and requirements to explain how the website was intended to showcase my work, and even literary material such as Eunsong Kim’s “Found, Found, Found: Lived, Lived, Lived” and Ron Padgett’s “Creative Reading,” which affected my prompting by giving me ideas and context to consider in the creation of the project. Taken all at once, this project seems to serve as a community effort that incorporates voices from many sources, whether indirectly or directly, and does not seem to have a sole author." },
  { p: "This project remembers, forgets, and creates new meaning. It remembers the sentiments expressed in the found poems, the importance of human virtue in medicine, and the assignment’s requirements. For instance, the opening lines “Medicine isn’t worth mastering without connection” and “Transactions can fail between human beings” preserve the concerns about human relationships that I expressed in my original writing, even when later generated passages distort my intended meaning. It forgets any person or entity’s identity or goal: that I am a student, not a doctor; Kalanithi’s circumstances when writing his text; and the original narrative context of the individual texts used. At the same time, it creates new forms of media, such as sound and interactive touch, through which to view the remembered themes of retaining one’s humanity, as well as new ways to encounter someone else’s misunderstandings: This appears toward the end of the portfolio, where the environment gradually becomes overtaken by plants, and the lamp is replaced by fireflies. The generated line “From what remained, something new could still grow” begins to describe the changing environment as much as the experiences of illness and renewal within the original texts. Likewise, the final line, “At the root of every future breath was healing,” connects the physical roots spreading across the website with the poem's recurring discussion of medicine, humanity, and growth. Though the Markov generator could not have understood this relationship, placing the words within the environment allowed me to create a meaning beyond the language it generated. In that sense, neither the generated words nor the environment creates meaning entirely on its own; the meaning emerges from the relationship between what was already there and what I, alongside the reader, chose to make of it. The main takeaway, at least my own takeaway, from this project is that memory is found, revitalized, and then shared. Memory is similar to the domain of mathematics in that it does not really exist in nature as a physical object, but we use it to infer the logic we observe in our natural environment. Maybe memory has always existed, waiting to be discovered; maybe no one and everyone is original at the same time." }
];

const PROCESS_TOOLS = [
  { p: "For the Markov poetry, I used RiTa.js to generate language from my pre-med application essay and excerpts from Paul Kalanithi's ‘When Breath Becomes Air’, after which I selected and organized the resulting text into the final poem. I created the weaving and found poems, determined the arrangement of the generated writing, and intentionally retained certain unexpected contradictions in the language. I used Cursor's AI-powered coding agents to implement the website's interactive features, environmental changes, and design through prompts, while reviewing and adjusting the resulting work. When I blanked out or wasn't sure how to continue, I also asked ChatGPT for suggestions, so some of the project's ideas and directions were influenced by those conversations. For this revision, I used ChatGPT to identify evidence in the website's source files and suggest changes to the reflection, which I reviewed before deciding what to include." }
];

const APA_REFS = [
  {
    parts: [
      { text: "Kalanithi, P. (2016). " },
      { italic: "When breath becomes air" },
      { text: ". Random House." }
    ]
  },
  {
    parts: [
      { text: "Kim, E. (2016). Found, found, found: Lived, lived, lived. " },
      { italic: "Scapegoat, 9" },
      { text: ", 53–60. " }
    ],
    href: "https://eun-song.org/storage/2020/09/Eunsong-KIM-Found-Found-Found_-Lived-Lived-Lived.pdf"
  },
  {
    parts: [
      { text: "Padgett, R. (1997). " },
      { italic: "Creative reading: What it is, how to do it, and why" },
      { text: ". National Council of Teachers of English." }
    ]
  },
  {
    parts: [
      { text: "The HTML Review. (2026). " },
      { italic: "Issue 05" },
      { text: ". " }
    ],
    href: "https://thehtml.review/05/"
  },
  {
    parts: [
      { text: "Zambo, D. (n.d.). " },
      { italic: "Only You" },
      { text: " [Song]. Uppbeat. " }
    ],
    href: "https://uppbeat.io/contributors/danijel-zambo"
  }
];

const APA_MATERIALS = [
  {
    parts: [
      { text: "Al Ruzouq, Z. (2026a). " },
      { italic: "Cover letter" },
      { text: " [Course reflection]. Johns Hopkins University. " }
    ],
    href: "https://docs.google.com/document/d/15vBbWZwp_haFYjDgxkm_kSAeqCK9Zm_UzzE6n64aHi4/edit"
  },
  {
    parts: [
      { text: "Al Ruzouq, Z. (2026b). " },
      { italic: "Found poems: Remnants of a new world" },
      { text: " [Course project]. Johns Hopkins University. " }
    ],
    href: "https://drive.google.com/file/d/16MWYGTbL28bmbyB627_8dohjSYwqt7Jh/view"
  },
  {
    parts: [
      { text: "Al Ruzouq, Z. (2026c). " },
      { italic: "Found poems reflection" },
      { text: " [Course reflection]. Johns Hopkins University. " }
    ],
    href: "https://docs.google.com/document/d/1HxfWr1FAbGaS_ZvMk1D6Ks132XgQmGawwon5yFmA5jE/edit"
  },
  {
    parts: [
      { text: "Al Ruzouq, Z. (2026d). " },
      { italic: "Markov poems and reflection" },
      { text: " [Course project]. Johns Hopkins University. " }
    ],
    href: "https://docs.google.com/document/d/1moxMrNwSOm2a69cQ_ovl5xBEKoB9r-7wB0LJvs6DCqU/edit"
  },
  {
    parts: [
      { text: "Al Ruzouq, Z. (2026e). " },
      { italic: "Remnants of a new world" },
      { text: " [Source code]. GitHub. " }
    ],
    href: "https://github.com/ZeidAl-Ruzouq/Remnants-of-a-New-World"
  },
  {
    parts: [
      { text: "Al Ruzouq, Z. (2026f). " },
      { italic: "Revised unit project 1: Markov memory synthesis" },
      { text: " [Course project]. Johns Hopkins University. " }
    ],
    href: "https://docs.google.com/document/d/14s6Wc_6JT2SpZll4obksspoQfSErulh_tYHozD-UwfY/edit"
  },
  {
    parts: [
      { text: "Al Ruzouq, Z. (2026g). " },
      { italic: "Warp reflection" },
      { text: " [Course reflection]. Johns Hopkins University. " }
    ],
    href: "https://docs.google.com/document/d/1NsaASu_AoFh2bdqSm7z_2T7JUJAFuhirr7P3jvbqQdY/edit"
  },
  {
    parts: [
      { text: "Schnitzler, C. (2026). " },
      { italic: "Unit project 1: Markov memory, synthesis, and reflection" },
      { text: " [Course assignment]. Johns Hopkins University. " }
    ],
    href: "https://jhu.instructure.com/courses/130735/assignments/1322810"
  },
  {
    parts: [
      { text: "Van Rys, J., Meyer, V., & Sebranek, P. (2005). " },
      { italic: "The business writer" },
      { text: ". Houghton Mifflin." }
    ]
  }
];
