---
name: Soft Skills Lab
description: A school lab notebook on cool grid paper, written in ballpoint and marked in lime.
colors:
  pen: "#1f3fc4"
  marker: "#e4ff4f"
  pink-text: "#cc1f62"
  green: "#2b8a4e"
  sticky: "#ffe76a"
  sticky-ink: "#5a4300"
  sticky-ink-soft: "#7a5d00"
  sticky-pink: "#ffc2dc"
  sticky-pink-ink: "#6b1a3d"
  sticky-pink-ink-soft: "#8a2a52"
  sticky-green: "#c7f0a6"
  sticky-green-ink: "#234a10"
  sticky-green-ink-soft: "#2f5e17"
  paper: "#fbfcff"
  sheet: "#fff"
  grid: "#d9e5f6"
  margin: "#f0a2a2"
  ink: "#151a3a"
  ink-2: "#4b5276"
  permit-text: "#d8dcf3"
  tape: "rgba(255,231,106,.75)"
typography:
  display:
    fontFamily: "Onest, system-ui, sans-serif"
    fontSize: "clamp(40px,5vw,72px)"
    fontWeight: 900
    lineHeight: 1.02
    letterSpacing: "-0.025em"
  headline-lg:
    fontFamily: "Onest, system-ui, sans-serif"
    fontSize: "clamp(36px,5vw,72px)"
    fontWeight: 900
    lineHeight: 1.02
    letterSpacing: "-0.025em"
  headline-md:
    fontFamily: "Onest, system-ui, sans-serif"
    fontSize: "clamp(34px,4.6vw,64px)"
    fontWeight: 900
    lineHeight: 1.02
    letterSpacing: "-0.025em"
  figure:
    fontFamily: "Onest, system-ui, sans-serif"
    fontSize: "clamp(56px,6vw,88px)"
    fontWeight: 900
    lineHeight: 1
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Onest, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "-0.01em"
  lead:
    fontFamily: "Onest, system-ui, sans-serif"
    fontSize: "clamp(18px,1.5vw,20px)"
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: "Onest, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.55
  body-sm:
    fontFamily: "Onest, system-ui, sans-serif"
    fontSize: "16.5px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Onest, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 700
    letterSpacing: "0.06em"
  button:
    fontFamily: "Onest, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 600
  button-stamp:
    fontFamily: "Onest, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 800
  hand-answer:
    fontFamily: "Caveat, Comic Sans MS, cursive"
    fontSize: "clamp(38px,4.2vw,60px)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "0"
  hand-conclusion:
    fontFamily: "Caveat, Comic Sans MS, cursive"
    fontSize: "clamp(26px,2.3vw,32px)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "0"
  hand-entry:
    fontFamily: "Caveat, Comic Sans MS, cursive"
    fontSize: "28px"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "0"
  hand-note:
    fontFamily: "Caveat, Comic Sans MS, cursive"
    fontSize: "24px"
    fontWeight: 500
    lineHeight: 1.1
rounded:
  none: "0"
  stamp: "12px"
  bubble: "18px"
  pill: "999px"
  circle: "50%"
spacing:
  cell: "24px"
  margin-line: "clamp(10px,3vw,44px)"
  gutter: "clamp(16px,4vw,56px)"
  container: "1240px"
  column-gap: "clamp(28px,5vw,80px)"
  section-top: "clamp(40px,6vw,80px)"
  section-bottom: "clamp(64px,8vw,120px)"
components:
  button-pen:
    backgroundColor: "{colors.pen}"
    textColor: "{colors.sheet}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "0 20px"
    height: "48px"
  button-pen-large:
    backgroundColor: "{colors.pen}"
    textColor: "{colors.sheet}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "0 26px"
    height: "56px"
  button-stamp:
    backgroundColor: "{colors.marker}"
    textColor: "{colors.ink}"
    typography: "{typography.button-stamp}"
    rounded: "{rounded.stamp}"
    padding: "0 28px"
    height: "64px"
  nav-link:
    textColor: "{colors.ink-2}"
  nav-link-hover:
    textColor: "{colors.pen}"
  sheet-polaroid:
    backgroundColor: "{colors.sheet}"
    rounded: "{rounded.none}"
    padding: "14px 14px 18px"
  sheet-snapshot:
    backgroundColor: "{colors.sheet}"
    rounded: "{rounded.none}"
    padding: "10px 10px 14px"
  sheet-roster:
    backgroundColor: "{colors.sheet}"
    rounded: "{rounded.none}"
    padding: "clamp(20px,3vw,36px)"
  sheet-protocol:
    backgroundColor: "{colors.sheet}"
    rounded: "{rounded.none}"
    padding: "clamp(20px,2.6vw,32px)"
  sheet-portrait:
    backgroundColor: "{colors.sheet}"
    rounded: "{rounded.none}"
    padding: "clamp(20px,3vw,32px)"
  sticker-mascot:
    rounded: "{rounded.circle}"
    size: "clamp(110px,12vw,160px)"
  speech-bubble:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    typography: "{typography.hand-note}"
    rounded: "{rounded.bubble}"
    padding: "6px 12px"
  peel-note-yellow:
    backgroundColor: "{colors.sticky}"
    textColor: "{colors.sticky-ink}"
    typography: "{typography.hand-entry}"
    rounded: "{rounded.none}"
    padding: "14px"
  peel-note-pink:
    backgroundColor: "{colors.sticky-pink}"
    textColor: "{colors.sticky-pink-ink}"
    typography: "{typography.hand-entry}"
    rounded: "{rounded.none}"
    padding: "14px"
  peel-note-green:
    backgroundColor: "{colors.sticky-green}"
    textColor: "{colors.sticky-green-ink}"
    typography: "{typography.hand-entry}"
    rounded: "{rounded.none}"
    padding: "14px"
  permit:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.sheet}"
    rounded: "{rounded.none}"
    padding: "clamp(28px,5vw,64px)"
---

# Design System: Soft Skills Lab

## Overview

**Creative North Star: "Журнал опытов" (The Lab Journal)**

The page is a working school lab notebook that a group has been filling in. Cool grid paper runs edge to edge behind everything, a red margin line stands to the left, and every piece of content is either printed on the journal's form, written into it by hand, or physically stuck onto it. Nothing floats in abstract space: a card is a sheet of paper, a photo is a print with tape on it, a hidden answer is a sticky note.

Print and handwriting are the system's two voices. Heavy black-ink grotesque carries the facts and the structure; blue ballpoint carries the reaction to them. Density stays comfortable and hand-made, with sheets laid slightly crooked and overlapping at the edges, so the page reads as used rather than designed. One dark block, the entry pass, is the only departure from paper.

The world refuses the dark neon space-science page and the generic kids'-club card grid.

**Key Characteristics:**
- Cool white grid paper (24px cell) with a fixed red margin line
- Heavy Onest headings set against blue Caveat handwriting
- White square-cornered sheets, slightly rotated, lifted by soft navy-tinted shadows
- Lime marker highlights behind single phrases, and one yellow tape
- Pastel sticky notes that peel away to reveal content
- One dark entry-pass block with a dashed inner border

## Colors

A cool paper-and-ink palette: stationery neutrals, one ballpoint blue, and one loud lime, with pastel sticky-note colours held to the notes themselves.

### Primary
- **Ballpoint Blue** (#1f3fc4): All handwriting on paper, the main button fill, every text link, and the dashed focus outline on paper.

### Secondary
- **Highlighter Lime** (#e4ff4f): The marker stroke behind a highlighted phrase, text selection, the stamp button, and handwriting and the focus outline on the dark block.

### Tertiary
- **Correction Pink** (#cc1f62): The one pink outside the sticky notes: the hand-drawn arrow, the wavy link underline, the roster's month, and its empty seats (5.33:1 on white, 5.2:1 on paper).
- **Check Green** (#2b8a4e): The hand-drawn check marks in a credentials list (4.22:1 on paper).
- **Yellow Tape** (rgba(255,231,106,.75)): The only tape, Yellow Sticky at 75%.
- **Yellow Sticky** (#ffe76a) with **Umber Sticky Ink** (#5a4300) and **Soft Umber** (#7a5d00): First note colour.
- **Pink Sticky** (#ffc2dc) with **Plum Sticky Ink** (#6b1a3d) and **Soft Plum** (#8a2a52): Second note colour.
- **Green Sticky** (#c7f0a6) with **Moss Sticky Ink** (#234a10) and **Soft Moss** (#2f5e17): Third note colour.

### Neutral
- **Cool Paper** (#fbfcff): The page ground, always under the grid.
- **Sheet White** (#fff): Every object laid on the page, and text on blue and dark fills.
- **Grid Blue** (#d9e5f6): The 1px page grid and the roster's row rules.
- **Margin Red** (#f0a2a2): The single vertical margin line. Decorative.
- **Black Ink** (#151a3a): Headings, strong text, rules under form labels, and the entry-pass fill. Navy, never pure black.
- **Faded Ink** (#4b5276): Secondary body text, labels, and nav links (7.4:1 on paper).
- **Permit Lavender** (#d8dcf3): Body text on the dark block.

### Named Rules

**The Ballpoint Rule.** Handwriting on paper is blue. The only exceptions are Correction Pink for roster marks, each note's own ink, Black Ink inside the speech bubble, and lime on the dark block.

**The One Stroke Rule.** A heading or handwritten conclusion carries at most one lime-highlighted phrase, and the text over it keeps its own ink: Black Ink in headings, Ballpoint Blue in conclusions. Lime is never text on paper.

**The One Pink Rule.** Outside the sticky notes, pink has one value, dark enough to read as text. Correction Pink both draws and writes.

**The One Dark Page Rule.** A page gets one dark block, the entry pass. Everything else stays on paper.

## Typography

**Display Font:** Onest (with system-ui, sans-serif)
**Body Font:** Onest (with system-ui, sans-serif)
**Handwriting Font:** Caveat (with Comic Sans MS, cursive)

**Character:** Onest at weight 900 with tightened tracking reads as heavy black printed ink; Caveat reads as someone answering in the margin. Both cover the Cyrillic the page is written in, and the contrast between them does the work a larger type palette would otherwise do. Loaded weights are Onest 400, 500, 600, 800, 900 and Caveat 500, 700.

### Hierarchy
- **Display** (900, clamp(40px,5vw,72px), 1.02): The page's opening question, balanced across lines. On wide but short viewports (from 901px wide, up to 800px high) it drops to 58px so the first screen still fits.
- **Headline** (900, clamp(36px,5vw,72px) or clamp(34px,4.6vw,64px), 1.02): Section headings; the larger step for the protocols and the entry pass, the smaller for sections sharing a row with a sheet. On the entry pass, line-height opens to 1.12 to give the marker stroke room.
- **Figure** (900, clamp(56px,6vw,88px), 1): The price, with tracking tightened further to -0.04em.
- **Title** (800, 20px, 1.02): The heading printed on a sheet.
- **Body** (400, 18px, 1.55): Default text, with lead paragraphs at clamp(18px,1.5vw,20px) held to 42–54ch, and protocol columns at 16.5px and 1.5.
- **Label** (700, 12px, 0.06em, uppercase by CSS): The one label style, for form-field names such as «Что делаем», «Наблюдение», «Подпись», and «Место».
- **Hand, answer** (Caveat 700, clamp(38px,4.2vw,60px), 1.05): The one large handwritten line that answers the display heading.
- **Hand, entry** (Caveat 700, 26–32px, 1.05–1.08): Protocol conclusions, roster entries (23px at 600px and below), and note faces.
- **Hand, note** (Caveat 500, 23–30px, 1.05–1.1): Photo captions and annotations.

### Named Rules

**The No Hanging Words Rule.** No line ends with a one- or two-letter preposition, conjunction or particle, a number never parts from the word after it, and a line never starts with a dash. Non-breaking spaces do this automatically (`src/lib/typography.ts`).

**The Two Voices Rule.** Print states; handwriting responds. Headings, explanations, and form labels are Onest. Answers, conclusions, captions, and filled-in values are Caveat, and never run past a sentence or two.

**The Form Field Rule.** A small tracked label names a field whose value sits directly beside or beneath it, as on a printed form. It never introduces a heading.

## Layout

The page ground is a fixed 24px grid drawn as a background, with the 2px margin line fixed to the viewport at clamp(10px,3vw,44px). The grid is a surface and not a layout system: content does not snap to its cells. Content sits in a centred 1240px container with fluid gutters (clamp(16px,4vw,56px)) and 12px of extra left inset that keeps it clear of the margin line.

Sections are asymmetric two-column grids (ratios between 1.2/.8 and .9/1.1) with fluid gaps, separated by generous vertical padding (up to clamp(64px,8vw,120px)) and no rules or bands. The layout has two breakpoints. At 900px, two-column grids stack, protocol rows step from four columns to two, the photo strip steps from four to two, and the nav wraps to a full-width row under the logo and WhatsApp button. At 600px, protocol rows become one column. One further query tightens the hero on wide but short viewports (from 901px wide, up to 800px high).

## Elevation & Depth

Depth is physical: objects lie on paper and cast soft, wide, navy-tinted shadows, while the paper itself stays flat. Tape and sticky notes sit one layer above the sheets they fasten or cover, and the mascot sticker overlaps its photo's corner. Rotation does as much of this work as shadow.

### Shadow Vocabulary
- **Print lift** (`box-shadow: 0 2px 2px rgba(20,30,80,.06), 0 18px 34px rgba(20,30,80,.14)`): The hero photo, the highest sheet.
- **Sheet lift** (`box-shadow: 0 18px 34px rgba(20,30,80,.12)`): Roster and portrait sheets.
- **Protocol lift** (`box-shadow: 0 2px 2px rgba(20,30,80,.05), 0 14px 28px rgba(20,30,80,.09)`): Protocol sheets, the lowest because they repeat.
- **Snapshot lift** (`box-shadow: 0 12px 24px rgba(20,30,80,.12)`): Small photo prints.
- **Sticker lift** (`box-shadow: 0 10px 18px rgba(20,30,80,.25)`): The round mascot sticker.
- **Permit lift** (`box-shadow: 0 24px 48px rgba(20,30,80,.25)`): The dark entry pass.
- **Note lift** (`filter: drop-shadow(0 6px 8px rgba(20,30,80,.16))`, so the shadow follows the curled edge; the fold casts `drop-shadow(0 6px 10px rgba(20,30,80,.3))` while peeling): Sticky notes.
- **Button lift** (`box-shadow: 0 6px 14px rgba(20,30,80,.28)`, hover `0 3px 8px rgba(20,30,80,.3)`): The pen button, tightening as it presses in.
- **Stamp lift** (`box-shadow: 0 8px 18px rgba(0,0,0,.35)`, hover `0 4px 10px rgba(0,0,0,.4)`): The stamp button; neutral black because it sits on the dark block.
- **Tape edge** (`box-shadow: 0 1px 3px rgba(0,0,0,.08)`): Tape, barely lifted.

### Named Rules

**The Reading Tilt Rule.** The more text a sheet holds, the less it tilts: small photo prints up to 3deg, the hero photo 2.5deg, the portrait sheet 1.5deg, the roster 1deg, protocol sheets about 0.4deg in alternating directions. The entry pass does not tilt.

## Shapes

Paper has square corners. Every sheet, photo, note, and the entry pass is cut at 0 radius, and character comes from rotation and tape rather than curves. Radius belongs only to things that are not paper: the pill button (999px), the rubber stamp button (12px), the speech bubble (18px with one 4px tail corner), and the round mascot sticker (50%). Photos crop to a 1:1 square. Line drawings use round caps and joins, at stroke 2.5 to 4, so they read as pen.

### Named Rules

**The Square Paper Rule.** If it is paper, its corners are square.

## Components

The page is built in SvelteKit: tokens and global rules live in `src/routes/layout.css`, sections in `src/lib/components/journal/`. shadcn-svelte primitives in `src/lib/components/ui/` take the journal's look through its role variables (primary = pen, accent = marker, radius 0) and the added Button variants `pen`, `stamp` and `pencil`. Fonts are self-hosted through Fontsource as `Onest Variable` and `Caveat Variable`.

### Buttons
Tactile and physical: on hover they press into the page and their shadow tightens, over 0.15s. Every focusable element shows a 3px dashed outline at 4px offset, Ballpoint Blue on paper and lime on the dark block.
- **Pen button:** A Ballpoint Blue pill with white Onest 600 text, 48px high, or 56px with 26px of padding in a call-to-action row, and 44px with 16px of padding in the header at 900px and below. It moves down 2px on hover, uses Button lift, and may lead with an inline WhatsApp icon.
- **Stamp button:** The entry pass's primary action. A lime block with 12px corners, Black Ink Onest 800, 64px high, tilted -2deg like a rubber stamp, with Stamp lift. It moves down 3px on hover, keeping its tilt. At 600px and below it drops to 16px text and 18px of side padding, keeping at least 64px of height.
- **Links:** Text links are plain Ballpoint Blue with no underline. On hover they get a wavy Correction Pink underline. The phone link on the dark block is white, with a wavy lime underline on hover. On hover the pen button turns Black Ink and the stamp turns white.
- **Hand link button:** A bare line of blue Caveat (24px) that takes the wavy link underline on hover, with no fill or border, used for «отклеить все стикеры». It exists only with JavaScript and sits at the right of the section head, or under the intro at 900px and below. Once every note is peeled it hides but keeps its place, so the sheets don't move.

### Navigation
Plain Onest 500 links at 16px in Ballpoint Blue, with no container. On hover they get a wavy Correction Pink underline at 6px offset. Below 900px they spread across a full-width row with 44px tap height. The flask-only logo mark (44px) sits beside a bold typeset wordmark and a handwritten line, «журнал опытов».

### Cards / Containers
- **Corner Style:** Square (0).
- **Background:** Sheet White on the grid.
- **Shadow Strategy:** One lift from the Elevation vocabulary per sheet type.
- **Border:** None. Sheets are defined by their shadow and their contrast with the grid.
- **Internal Padding:** Fluid, from 20px up to 36px; photo prints use a fixed 10–14px with a deeper bottom edge and a handwritten caption.

### Hero Print
The taped print on the first screen shows one of the five photos, picked at random on the server for each page load, with that photo's own handwritten caption. The photo strip further down shows the other four, so no photo repeats on a page.

### Snow
Shown only from 1 December to 10 January, by the date in Akko, together with the footer greeting; add `?date=2027-01-01T12:00:00Z` to preview a day in `pnpm dev`, or set `localStorage.show_ny = true` and reload to see it on any date, including the live site. New Year doodles: blue ballpoint snowflakes fall down the grid paper, 18 on desktop and 7 on phones, at 34–58% ink. Each is 27–72px wide with a 2.4px pen line: six hand-drawn arms in one of four shapes, retraced in two slightly different frames that alternate every 0.4s, like a flipbook. Larger flakes fall faster (16–34s). They come down in a wave on the wind: each swings side to side like a falling leaf, tilting most mid-sweep and easing at each end, while a slow shared gust passes down the page and a steady drift carries them all to the right. The swing is 60% as wide on phones. They are drawn on one canvas in a Web Worker, so the snow adds a single layer and no main-thread work (`snow-flakes.ts`, `snow-worker.ts`). The layer is fixed under `.wrap`, so flakes pass beneath the text and every sheet and never catch a click. With reduced motion they stay as still doodles on the page. Clicking a flake over bare paper or plain text bursts it: its arms and short Correction Pink rays fly apart in 0.6s, and it returns on its next lap from above the screen. Links, buttons and sheets keep their own clicks. They are not printed. In the same season Пушистик's speech bubble says «Хо-хо-хо!», and its round sticker gets a head-sized Santa hat, a moustache and a long beard drawn in the logo mark's style, in both places it appears: a lime marker patch behind, a flat Correction Pink hat, white brim, pompom, moustache and beard, one round Black Ink line, no wobble. The footer closes the page in large blue Caveat, tilted 2deg: «С наступающим Новым годом!» in December, «С Новым годом!» from 1 January.

### Margin Game
Outside the New Year season, on screens from 1440px, on the home page and the journal pages alike, a noughts-and-crosses board is already drawn in ballpoint on a random empty spot of the grid in view, snapped to the cells and tilted 1.5–4.5deg at random. The visitor plays crosses in blue, the page answers with pink noughts and sometimes misses a block, and a win gets a lime marker stroke. When a game ends, the next board draws itself after 1.4s. At most four boards stay on the paper: a fifth rubs out the oldest. Boards never overlap, and with no room in view the next one waits for a scroll. An untouched board follows the visitor after a scroll.

### Tape
A 120 × 34px strip of Yellow Tape with faint dashed cut ends, placed across a sheet's top edge at a slight angle. A sheet held by two strips, like the roster, narrows them to 96px.

### Protocol Sheet
A form-like sheet whose first column holds the experiment heading, a handwritten number over a bold 15px block title, and an 84px line-drawn doodle (hidden at 900px and below). The other columns each open with a label over a 2px Black Ink rule. The experiment steps stay in print; the last column holds the handwritten conclusion.

### Peel Note
The signature interaction: a sticky note covering a protocol's conclusion. Its face asks that experiment's own question in Caveat, such as «а при чём тут крик?», over the small Onest verb «отклейте» at 65% opacity.
- **Colour rotation:** Yellow, pink, green, repeating by sheet position, each with its own two inks.
- **Rest:** Square paper with a soft diagonal gradient, lighter toward the curl, hinged at the centre of its top edge, overhanging the column by 6–9px and leaving the column label visible above it. No adhesive strip.
- **Curl:** One bottom corner is folded over along a straight diagonal, showing the darker back of the note with a highlight on the fold, over a navy shadow on the sheet. This is the first frame of the peel, so the note starts moving without a jump. A sheet-coloured layer beneath keeps the conclusion hidden until then. Odd sheets fold left, even sheets fold right.
- **Variation:** Each of the six notes has its own fold size (34–64px), tilt (-1.5deg to 2.5deg), overhang and a slight tilt of its text, so no two look stamped.
- **Hover:** The corner folds 14px further over 0.3s `cubic-bezier(.16,1,.3,1)`. The note itself stays still. Only on devices that really hover, so a tap on a phone goes straight to the peel.
- **Peeled:** On click the note is pulled off sideways by its curled corner, over 0.65s, speeding up the whole way (progress to the power 2.2). It starts from the note's current fold. The corner travels up and across the note, the note folds along a straight line that sweeps past it, and the folded part shows its darker back with a highlight on the fold. Near the end it drifts on and fades. Text on the note folds away with the paper. The geometry is in `journal/peel.ts`. With reduced motion the note disappears at once. The note stays removed and focus moves to the revealed writing.
- **Peel all:** A hand link button lifts every remaining note in sequence, 110ms apart.
- **Without JavaScript:** Notes are not rendered, so every conclusion is simply visible.

### Roster Sheet
A ruled form on a taped sheet: a title with a pink handwritten month, a printed header row over a 2px Black Ink rule, and 48px rows divided by Grid Blue. Printed numbers use tabular figures. Filled-in values are in blue Caveat; unfilled seats are in Correction Pink.

### Entry Pass
The one dark block: a Black Ink slab with white headline, Permit Lavender body, a large price figure, a lime handwritten note, and a stamp button. A 2px dashed white border (rgba(255,255,255,.28)) sits 10px inside the edge, like a perforated ticket. A marker highlight here keeps Black Ink text on lime and runs lower, to the bottom of the line.

### Mascot
Пушистик appears only as a round sticker: circle crop, 6px white border, tilted -8deg, with Sticker lift, overlapping the corner of a print or sheet. On a photo it may carry a speech bubble in Caveat, outlined 2px in Black Ink.

On the taped portrait sheet, the sticker overlaps the bottom right corner of Аня's portrait.

### Portrait
Аня's photo is a cut-out, her real outline with the background removed, laid on a lime marker patch the way the logo's flasks sit on theirs: three wide Highlighter Lime strokes (30 units in a 100-unit box, round caps) drawn behind her. The square shows her head and shoulders, with the sweater running off the bottom edge. It sits on the taped portrait sheet, under the Пушистик sticker. Only a real alpha matte is allowed here, never a circle or polygon mask. Over the photo, a ballpoint doodle is drawn stroke by stroke when the portrait scrolls into view: one of nine sets picked on the server for each page load (top hat and moustache, curved devil horns and pitchfork, pince-nez and goatee, kokoshnik and pink rouge, crown and sceptre, pirate captain's hat with skull and bones and an eye patch, halo and wings, mortarboard and round glasses, bunny ears with front teeth, a pink nose and whiskers), and a Snow Maiden set in the New Year season. Sets live in `src/lib/anya-looks.ts`, in a frame that turns with her head; `?anya=N` shows set N in `pnpm dev`.

**The Framed Пушистик Rule.** The artwork keeps its original grey background, because a clean cutout was not achievable. Show it only inside a frame, as a round sticker with a white border.

### Form Field Line
A wrapping row of label and handwritten value pairs (24px blue Caveat), such as «Место» Акко. It records facts under the call to action, never above a heading.

### Handwritten Answer
Handwriting that writes itself on load: a clip reveal from the left (1.6s `cubic-bezier(.6,.05,.3,1)`, after 0.5s) following an arrow that draws first (0.7s ease-out, after 0.25s). With reduced motion, both appear complete.

### Notebook Problem
The «Что такое софт скиллы?» section, before the roster: a school physics problem written in blue ballpoint straight onto the grid, with no sheet under it. «Дано:» and «Найти:» sit in the left half, under and over a 2px Ballpoint Blue ruler line; a second ruler line divides them from «Решение:» and «Ответ:» on the right, the way every Russian exercise book lays it out. Labels are Caveat 700, values Caveat 500 at 26–32px, broken into short lines as if written by hand; the answer is Caveat 700 at 1.15em with its one lime-highlighted phrase. A ballpoint volcano sketch sits under «Найти:». The whole problem tilts -0.6deg. The section adds clamp(24px,4vw,56px) above and below to the neighbouring sections' own padding. It stands left of the printed explanation on desktop and below it from 900px; at 600px and below the halves stack, each closed by a ruler line, at 23px, with the volcano beside «Найти:».

### Lab Journal
Аня's posts after lessons. A section under the entry pass, «Журнал занятий», shows the three newest as cards; `/zhurnal` lists all of them, and each post has its own page at `/zhurnal/<file name>`. Posts are plain text in `src/posts/`, so the look has to come from the text itself:
- **Post card:** a taped sheet tilted about 1deg, with the post number in blue Caveat, the post's doodle in Black Ink line, the opening quote in Caveat, the printed title, its first lines in Faded Ink, and a foot of reading time over «читать запись» with a drawn arrow. It lifts 4px on hover.
- **Post page:** a single page taken out of the journal, with tape and punched holes on the binding edge. A margin column sticks while reading: the large handwritten number, the doodle, reading time. The text column holds the printed title, the opening quote as a handwritten line behind a pink drawn arrow (as in the hero), a larger lead paragraph in Black Ink, then body text at 18px in Faded Ink, held to 62ch.
- **Read from the text:** a paragraph that is only a «quote» becomes the handwritten line; a short line ending in «?» or «:» becomes a subheading with a wavy pink underline; a «…вывод…:» heading opens a sticky note in the post's colour (yellow, pink, green by number, unless Аня picked one in the editor) that holds the rest, and a paragraph starting «Главный вывод» becomes a sticky note titled «Главное». Emoji are removed. The doodle is picked by keywords (губка, границы, башня, карта, опыт) or set in front matter.
- **Photos:** prints laid on the page, with a 12px white border, Snapshot lift and an optional handwritten caption, tilted between -1.6 and 1.8deg. One photo keeps its shape under a strip of tape; two or more crop to squares, two to a row.
- **After the post:** a handwritten line with the pen button to WhatsApp, and the next post's card.
- **Editor (/adm):** the same paper world for Аня, in Operate mode: a taped login sheet, a ruled list of posts with handwritten numbers, and a visual editor that is the post page itself. Title, quote, paragraphs and stickers are typed in place (placeholders in faded ink, a light dashed focus line). A focused block shows a Black Ink panel above it (under it on phones): paragraph, subheading or sticker, the three sticker colours for a sticker, up, down, delete; a dotted grip on its left drags it, with a Ballpoint Blue line marking where it will land. A dashed «добавить» row adds blocks, photos included (one or several at once, shrunk to 1800px in the browser before upload; «ещё фото» on a photo block adds to it), a date field under the number in the margin (today for a new post, optional, «убрать дату» clears it), the doodle in the margin opens a picker, a whole post pasted in is laid out by the text rules, and a sticky bar at the bottom holds the pen button.

### Credential List
A list without bullets: a 30px hand-drawn check in Check Green, a bold line, and a Faded Ink line beneath. It closes on a signature line, with «Подпись» and a large handwritten name (52px, -4deg) over a 2px Black Ink rule.

## Do's and Don'ts

### Do:
- **Do** lay new content on paper as a physical object: a sheet, a print, a note, or a line written directly on the grid.
- **Do** write handwriting in Ballpoint Blue (#1f3fc4), and use Correction Pink (#cc1f62) for any pink text on white.
- **Do** give each sticky note its paired inks, in the yellow, pink, green order.
- **Do** tilt sheets by how much text they hold, from about 0.4deg for protocols up to 3deg for small prints.
- **Do** show Пушистик only as a round sticker with a white border.
- **Do** tint soft shadows on paper navy (rgba(20,30,80,…)) and keep them wide.
- **Do** keep the 3px dashed focus outline, lime on the dark block, and the reduced-motion fallbacks on anything new.

### Don't:
- **Don't** cut Пушистик out of its grey background or place the artwork unframed on the grid.
- **Don't** add a second pink outside the sticky notes, or use lime for text on paper.
- **Don't** add a second dark block to a page.
- **Don't** cut a photo out with a geometric mask; a cut-out needs the subject's real outline.
- **Don't** round the corners of paper.
- **Don't** set paragraphs in Caveat.
- **Don't** put more than one lime highlight in a heading or conclusion.
- **Don't** drift toward a dark neon space-science page or a generic kids'-club card grid.
