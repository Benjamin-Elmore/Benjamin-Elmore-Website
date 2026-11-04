# CODE-REVIEW-1: code review, queue 11-03-26, round 1

- **Who / when:** code reviewer (read-only), 2026-11-03
- **Under review:** branch `dev-11-03-26` at `9eba5c3`: `docs/index.html`, `docs/assets/site.css`, `docs/assets/site.js`, `docs/assets/arc-architecture.svg`, `tools/check_site.py`, `tools/test_check_site.py`, `.github/workflows/site-checks.yml`. Context: `CLAUDE.md`, `work/PLAN.md`, `work/reviews/VERIFY-1.md` and section 3 (T1-T3) of `work/reviews/FINDINGS-portfolio-findings.md`.
- **Re-ran:** `python tools/check_site.py` gives 19/19 PASS, and `python -m unittest tools/test_check_site.py` gives OK. Both match VERIFY-1.
- **Scratch folder** (mutation harness, outputs and the focus screenshot):
  `C:\Users\Kyle\AppData\Local\Temp\claude\63a5ae193b538a83\422e17bb-5764-465e-a041-6e3401fe89d4\scratchpad\cr1-codereview-162638\`
  Below, `<R>` stands for that folder and `<S>` for the VERIFY-1 folder `...\scratchpad\verify-1\te-verify1-161823\`.
  - `<R>\mutate.py`: 34 mutations applied to copies of `docs/`. Output is in `<R>\mutate-out.txt`.
  - `<R>\focus-1280.png`: headless Edge at 1280px and 2x scale, with the "Projects" nav link focused.

## Verdict: **CHANGES REQUIRED**

| Severity | Count | IDs |
|---|---|---|
| Blocker | 0 | none |
| Major | 9 | CR1-1, 2, 3, 4, 5, 11, 16, 17, 18 |
| Minor | 13 | CR1-6 to 10, 12 to 15, 19 to 22 |

No finding is a Blocker. Every Major is a contained fix in one owner's file, apart from CR1-11, which needs a plan amendment from the lead (described below).

## What is sound (no change needed)

- **Dark-mode cascade.** `data-theme="light"` beats an OS dark preference. The base `:root` holds the light values (`site.css:20-47`), and the dark media block only matches `:root:not([data-theme="light"])` (`:49-61`). `:root[data-theme="dark"]` (`:63-73`) has the same specificity and sets identical values, so source order can't cause a conflict. `color-scheme` follows the theme in all three cases. `body` sets an explicit background (`:91`). Print overrides the tokens on `body` (`:769-781`), which beats inheritance from `:root` whichever theme is active.
- **No flash of the wrong theme.** `site.js` loads in `<head>` after the stylesheet with no `defer` (`index.html:14-15`), so `data-theme` is set before `<body>` is parsed. Both `localStorage` calls are wrapped in try/catch (`site.js:5,26`). A stored value other than `dark` or `light` is ignored (`:6`). Without JS the button stays `hidden` (VERIFY-1 section 5). The file is 30 lines, does nothing beyond the theme toggle, and makes no network calls.
- **Reduced motion and focus.** `scroll-behavior: smooth` is only set under `no-preference` (`:749-753`). Under `reduce`, transitions and animations are off (`:755-763`). `:focus-visible` uses `--color-focus` at 3px with an offset (`:139-143`), and the token ratios are at least 6.5:1 (see CR1-3 for where the ring is clipped).
- **Token contrast.** I recomputed the ratios with the checker's own formula and they match the comment block (`site.css:5-17`). The lowest is 5.95:1 (muted on code-bg, used by `.tag`).
- **Landmarks and skip link.** There is one header, one labelled nav, `main#main` and one footer. The skip link is the first focusable element and stays hidden until focused (`:178-195`), with `z-index` above the sticky header. Heading levels never skip. Every `time` element has a valid `datetime`. The `<img>` has `width`/`height` and the alt text the plan asks for. The visible `ol.figure__steps` is a full text alternative to the diagram.
- **Layout at 360px.** The page doesn't scroll sideways (`scrollWidth` = 360, per VERIFY-1). `code` has `overflow-wrap: anywhere`, and media are capped at `max-width: 100%`.
- **Colors inside the SVG** (spot-checked): sub-labels `#d6e2f3` on `#13325e` are 9.74:1, the "this work" text `#0b1f3a` on `#ffc857` is 10.74:1, link labels `#e8eef8` on `#0b1f3a` are 14.17:1, and the strokes `#8fbcff` are at least 6.57:1 against both fills. All of these meet the plan's contrast targets.
- **Checker structure.** A check that crashes reports FAIL, never PASS (`check_site.py:1081-1082`). A missing root fails every check and exits 1. C17 fails when a token isn't hex, so it can't skip silently. The self-test asserts that each mutation makes *exactly* its own check fail, which is a strong design. The checker uses only Python 3.12-safe APIs (`is_relative_to`, `removeprefix`, PEP 604 types under `from __future__ import annotations`).

---

## Findings by owner

### style-engineer (`site.css`, `site.js`)

**CR1-1 (Major): at 360px the nav hides half its items in a sideways strip that gives no sign it scrolls.**
- *Where:* `site.css:220-246` (`.site-nav { overflow-x: auto }` and `.site-nav__list { white-space: nowrap }`).
- *Evidence:* in `<S>\seg-360-light-0.png`, "Skills" is cut off at the right edge, and Education and Contact sit off-screen at x 364-506 (VERIFY-1 defect 4). The only cue is a thin scrollbar, and `--hide-scrollbars` and most phones hide even that. Two of the six sections can't be found from the nav.
- *Fix:* below 720px, lay the six links out as a 3×2 grid and make the header non-sticky, so the taller nav doesn't take up the viewport:
  ```css
  .site-header { position: static; }              /* base; restore sticky in the 720px query */
  .site-nav { overflow: visible; }
  .site-nav__list { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr));
                    gap: 0 var(--space-3); white-space: normal; padding-bottom: var(--space-1); }
  html { scroll-padding-top: 1rem; }
  @media (min-width: 720px) { .site-header { position: sticky; } .site-nav__list { display: flex; } html { scroll-padding-top: 4.5rem; } }
  ```
  At 13px monospace, "ARC firmware" (about 94px) fits a 100px column. If it doesn't fit, shorten the label to "ARC" (a content-engineer change). The grid adds about 88px of nav to a header that no longer sticks on phones, so nothing is lost on screen.

**CR1-2 (Major): tap targets are under 44px.**
- *Where:* nav links (`site.css:238-246`, `padding: var(--space-1) 0`, 29px tall), theme toggle (`:254`, `min-height: 2rem`, 32px), header name (`:213-218`, 26px), and the hero, contact and card links (`.link-list a`, `.card__link a`, 20-21px).
- *Evidence:* VERIFY-1 defect 3 (measured at 360px) fails CLAUDE.md rubric item 8.
- *Fix:* `.site-nav__list a, .site-header__name, .link-list a, .card__link a { display: inline-flex; align-items: center; min-height: 44px; }` and `.theme-toggle { min-height: 44px; }` (`2.75rem`). The repo link inside the `.case-study__repo` sentence is an inline link in running text. WCAG 2.5.8 exempts those, so leave it inline. Recheck `scroll-padding-top` once the header height changes.

**CR1-3 (Major): the focus ring on nav links is clipped at every width.**
- *Where:* `site.css:221-227`. `overflow-x: auto` on `.site-nav` makes `overflow-y` compute to `auto` too, so the 3px ring with its 2px offset is cut off above and below the link. The rule isn't reset at 720px or wider, and at that width `.site-nav__list` has no bottom padding (`:700-702`).
- *Evidence:* `<R>\focus-1280.png`. The focused "Projects" link shows only the left and right bars of the ring. Its top and bottom edges are clipped. VERIFY-1 recorded focus visuals as UNRUN, so this hadn't been seen before. It weakens WCAG 2.4.7 for the keyboard user's main way of moving around the page.
- *Fix:* remove the overflow container. The CR1-1 grid needs no scrolling, so `.site-nav { overflow: visible; }` at all widths does it. If any scrolling container stays, give it `padding-block: 6px` and use `outline-offset: -3px` on `.site-nav__list a:focus-visible`.

**CR1-4 (Major): `aria-pressed` and the label that flips contradict each other.**
- *Where:* `site.js:16-20`. The plan contract (section 2.7) asks for both.
- *Evidence:* in the dark theme the button reads "Light theme" with `aria-pressed="true"` (VERIFY-1 section 5, step 1). A screen reader announces "Light theme, toggle button, pressed", which says the light theme is on when it is off. A toggle button needs a fixed name, and its pressed state carries the meaning. A label that flips belongs on a plain action button.
- *Fix (plan amendment to 2.7, lead):* pick one model.
  - **(A, preferred)** Keep the text fixed at "Dark theme", set `aria-pressed` to whether dark is on, and give `.theme-toggle[aria-pressed="true"]` a visible pressed style (for example, accent border plus `--color-code-bg` fill).
  - **(B)** Drop `aria-pressed` and keep the flipping text as the action ("Light theme" means switch to light).

  Both take about the same number of lines. Don't combine them.

**CR1-5 (Major): left edges don't line up at 1280px, and the footer is narrower than the content column.**
- *Where:* `site.css:282-287` together with `:670-676`, and `.site-header` at `:199-211`.
- *Evidence:* VERIFY-1 defect 5 and `<S>\seg-1280-*-3.png`. The footer spans x≈377-903, while the section dividers span x≈323-957. The cause is a real bug: `--measure: 68ch` is resolved in the footer's own font (monospace at 0.75rem), so `68ch` there is far narrower than in body text. Separately, the header name sits at x=24 while the content starts at x=347, so the page has two left edges.
- *Fix:*
  1. Move the footer's font onto its paragraph: `.site-footer { color: var(--color-muted); } .site-footer p { font-family: var(--font-mono); font-size: 0.75rem; }`. Better still, define `--measure` in `rem` (about `36.5rem`, the current rendered width) so no element's font can change it.
  2. Line the header up with the column: `.site-header { padding-inline: max(var(--gutter), calc((100% - var(--measure)) / 2)); }`. The header background still spans the full width.
  3. `--page-max` (`:34`) is defined but never used. Either use it here or say in a comment that it is reserved.

**CR1-6 (Minor): the MarketTesting card has a tall empty gap above its link.**
- *Where:* `site.css:631-635` (`.card__link { margin-top: auto }`) inside an equal-height grid row.
- *Evidence:* VERIFY-1 defect 6 and `<S>\seg-1280-light-2.png`.
- *Fix:* `margin-top: 0; padding-top: var(--space-4);` so the link follows its tags. The cards can keep equal heights.

**CR1-7 (Minor): no gap between the "My part:" lead-in and its list.**
- *Where:* `site.css:415-427`. The `ul:not([class])` rules give no top margin.
- *Evidence:* VERIFY-1 defect 7 and `<S>\seg-1280-light-0.png`.
- *Fix:* `.case-study__block p + ul, .case-study__block p + ol { margin-top: var(--space-3); }`.

**CR1-8 (Minor): a heading wraps with an orphan word at 360px.**
- *Where:* `site.css:107-115`.
- *Evidence:* in `<S>\seg-360-light-0.png`, "Case study: ARC firmware for" wraps, leaving "ARSENAL" alone on the second line (rubric item 3).
- *Fix:* add `text-wrap: balance;` to the `h1-h4` rule. It degrades gracefully in browsers without support. Also consider `text-wrap: pretty` on `.case-study__summary` and `.intro__lede`.

**CR1-9 (Minor): some text is very small, and the toggle's edge is faint.**
- *Where:* `.decision__label` (`site.css:515`) is 0.6875rem (11px) uppercase monospace, under the roughly 12px floor used elsewhere. The `.theme-toggle` border is `--color-border` (`:262`), which is 1.35:1 against `--color-bg` in the light theme and 1.49:1 in the dark theme. The button is mostly recognisable from its text, but the edge is close to invisible.
- *Fix:* set `.decision__label` to `0.75rem` and the toggle's border to `var(--color-muted)` (6.46:1 light, 8.08:1 dark).

**CR1-10 (Minor): the button state goes stale when the OS theme changes.**
- *Where:* `site.js:13-29`.
- *Evidence:* with nothing stored, the CSS follows a live OS change, but `render()` isn't called again, so the label and `aria-pressed` describe the old theme.
- *Fix:* inside the `DOMContentLoaded` handler, add `if (window.matchMedia) matchMedia('(prefers-color-scheme: dark)').addEventListener('change', render);`. This adds one line and keeps the file well under budget.

### diagram-engineer (`arc-architecture.svg`), with lead, content-engineer and test-engineer follow-ups

**CR1-11 (Major): the diagram can't be read at 360px and is small at 1280px. This is the FAIL in VERIFY-1.**
- *Where:* the whole file. The plan spec itself is the root cause (PLAN 2.5, "minimum label font-size 18 user units").
- *Evidence:* `<S>\diagram-360-light-x2.png`. At 328px the scale is 0.342, so the 18-unit sub-labels render at about 6.2px and the 22-unit box names at about 7.5px. The arithmetic can't work: reaching 12px at 328px wide needs **35 or more user units** on a 960-wide viewBox, which doesn't fit four boxes side by side with sub-labels. At 1280px the figure is about 586px wide (scale 0.61), so the 18-unit labels come out near 11px (`<S>\seg-1280-dark-0.png`), also under 12px. Larger fonts in the same file can't fix this. The layout has to change below some width.
- *Fix (plan amendment to 2.5: lift "stack vertically is NOT allowed (one file)"):*
  1. **New file `docs/assets/arc-architecture-stacked.svg`** (diagram-engineer). Use `viewBox="0 0 360 640"`, the same palette, panel, `role`, `<title>` and `<desc>`, and the same restrictions (no script, no external refs). Lay it out as:
     - the title "Intended system architecture" at 22u bold;
     - four full-width boxes (x=24, w=312, h=88) at y=72, 216, 360 and 504, separated by 56-unit vertical arrows;
     - box names at 22u bold and **one-line** sub-labels at 17u or more: "optical and external sensors", "multiplexed I²C", "ARC firmware on ARSENAL board";
     - link labels left-aligned beside each arrow at x≈212, at 17u or more: "I²C", "I²C", "half-duplex RS-485" (with arrowheads at both ends for RS-485).

     At 328px the scale is 0.911, so 17u renders at about 15.5px and 22u at about 20px. The rendered height is about 583px. That is tall, but this is the page's centerpiece, and it beats an image no one can read. Take "fewer words" seriously: one line per sub-label, no prose.
  2. **Wide file `arc-architecture.svg`.** Raise the minimum font to **22u** (about 13.4px at 586px, 13.9px at 608px) and the box names to 26u or more. Let sub-labels wrap to two lines and make the boxes taller as needed. If the viewBox height changes, the `<img>` `height` must match.
  3. **Markup** (content-engineer; replaces the bare `<img>` at `index.html:70`):
     ```html
     <picture>
       <source media="(max-width: 639px)" srcset="assets/arc-architecture-stacked.svg" width="360" height="640">
       <img src="assets/arc-architecture.svg" width="960" height="360" alt="…unchanged…" loading="lazy" decoding="async">
     </picture>
     ```
     Width and height on `<source>` keep the aspect ratio correct for each file (supported by Chromium, Firefox and Safari 15+).
  4. **CSS** (style-engineer): `.figure--diagram picture { display: block; }`. Below 640px, add `.figure--diagram img { max-width: 26rem; margin-inline: auto; }` so the stacked version can't grow past about 740px tall on large phones.
  5. **Checks** (test-engineer): C07 must resolve every URL in `srcset` (it doesn't today: see CR1-20). C18 must apply to every `*.svg` under `docs/assets/`, not only `SVG_PATH` (`check_site.py:126,1026`).

  I rejected a single SVG with `@media` rules inside it. An `<img>` SVG can't change its own viewBox from CSS, so the boxes would have to be laid out twice and hidden by the query. That is harder to review than two plain files.
- *Fixed dark panel on the light theme:* **acceptable.** It reads as a deliberate "blueprint" plate, like a code block. Contrast inside the panel is 6.6:1 to 14:1 regardless of page theme, and an `<img>` can't follow the theme toggle anyway (a `prefers-color-scheme` `<source>` would ignore `data-theme`). CR1-12 covers the one weakness, in the dark theme.

**CR1-12 (Minor): in the dark theme the panel's edge disappears, and the V5 Brain box has nothing under its name.**
- *Where:* `arc-architecture.svg:9` (panel rect) and `:40-49` (sub-labels).
- *Evidence:*
  - Panel `#0b1f3a` against the dark page `#0f1215` is **1.14:1**, so the plate's edge is gone and the boxes look like they float (`<S>\seg-1280-dark-0.png`).
  - The V5 Brain box has no sub-label, so its lower half is empty (VERIFY-1 defect 2).
  - Printing puts a full navy panel on paper.
- *Fix:*
  - Add `stroke="#4a78b5" stroke-width="2"` to the panel rect in both files. That is 4.16:1 against the dark page, 4.18:1 against the light page and 3.65:1 against the panel itself.
  - Give V5 Brain a short sub-label such as "robot controller". The page already uses that phrase (`index.html:40`), but the content reviewer should sign off.
  - Print is optional: `@media print { .figure--diagram img { filter: invert(1) hue-rotate(180deg); } }` (style-engineer). Taste, not required.

**CR1-13 (Minor): the "this work" badge can be read as an authorship claim.**
- *Where:* `arc-architecture.svg:32-33` and `<desc>` at `:3` ("marked as this work").
- *Evidence:* PLAN 2.5 doesn't specify the badge. Sitting on the ESP32-S3 / ARSENAL box, it can read as "I built this board". PLAN section 3 forbids claiming Ben designed ARSENAL, and the brief credits the board to the team.
- *Fix:* relabel it "ARC firmware" or "case study", or drop it. Route through the content reviewer.

### content-engineer (`index.html`)

**CR1-14 (Minor): `<figcaption>` sits in the middle of the `<figure>`, which isn't valid HTML.**
- *Where:* `index.html:69-78`, ordered img → figcaption → ol. The PLAN 2.4 contract sets this order.
- *Evidence:* the HTML content model for `<figure>` allows a `figcaption` only as the first or last child. The W3C validator reports an error, though users see no difference.
- *Fix (plan amendment to 2.4):* move the `<ol class="figure__steps">` *inside* the `<figcaption>`, after the caption sentence. `figcaption` accepts flow content, and the visual order stays the same. Style-engineer: the `.figure__steps` rules keep working because they select by class.

**CR1-15 (Minor): too many landmarks, and lists that may lose their list semantics.**
- *Where:* `index.html:198,212,222` (`section.skill-group` with `aria-labelledby`) and the `list-style: none` lists (`ol.decision-list` `:82`, `ul.evidence-list` `:124`, `ol.timeline` `:148`).
- *Evidence:*
  - A named `<section>` becomes a `region` landmark, so the page exposes 10 regions. The three skill groups are noise in a landmark menu.
  - Safari and VoiceOver drop list semantics from lists styled `list-style: none`, which loses the "list, 4 items" count on the decisions and evidence log.
- *Fix (plan amendment to 2.6):*
  - Make `.skill-group` a `<div>` and keep its `<h3>`.
  - Add `role="list"` to the three styled lists. That is a known, harmless workaround.

### test-engineer (`tools/`, CI)

Mutation results are in `<R>\mutate-out.txt`. 28 of 34 mutations got past the checker. The six that were caught were controls (exact "robust", an https link to `SdBenE`, a `//` href, a style-attribute `url(https:…)`, an entity-encoded email and `mailto:`). A percent-encoded FSW URL (`%46SW-UAV-SIM`) also passes C09. That is low risk, and decoding `%xx` before C09 runs would close it. Each one below is a realistic edit, not an attack.

**CR1-16 (Major): C13 only matches the exact form of each phrase, so other forms of the same claim pass.**
- *Where:* `check_site.py:34-66` (the phrase list) and `:868-870` (`phrase_regex` adds `(?!\w)` after the word). The self-test locks one gap in: `test_check_site.py:412` asserts that "reliably" **passes**.
- *Evidence:* each of these passes all 19 checks:
  - "The bus layer adds **robustness**."
  - "It reads sensors **reliably**."
  - "Ordering is **guaranteed**."
  - "Ready to **deploy**."
  - "The LSTM predicts **accurately**."
  - "A **profitable** strategy."

  Every one is exactly the kind of claim the brief forbids. Only the exact form "robust" is caught.
- *Fix:* allow a regex entry in the phrase list and use stems with a word boundary at the start only: `reliab\w*`, `robust\w*`, `deploy\w*`, `guarantee\w*`, `accura\w*`, `profit\w*`, `outperform\w*`, `prove[nd]`, `release[sd]?` and `latenc\w*`. Keep `resume`/`résumé` as whole words so "resumed" still passes. Replace "reliably" in `test_no_false_positives` with something genuinely harmless, and add one mutation test per stem family. Fold T1 in at the same time (CR1-21).

**CR1-17 (Major): C11 misses an email or phone number in an HTML comment, a `<template>` or any non-HTML file.**
- *Where:* `TreeBuilder` (`check_site.py:207-259`) has no `handle_comment`, so comments are dropped. `HIDDEN_TEXT_TAGS` (`:140`) removes `<template>` text. C11 (`:799-827`) only looks at the index's visible text, its attributes and the SVG text.
- *Evidence:* `<!-- contact ben.elmore@example.com -->`, `<!-- (951) 555-0142 -->`, `<template><p>ben.elmore@example.com</p></template>`, a CSS `content:"ben.elmore@example.com"` and a new `docs/humans.txt` each pass. HTML comments are published, and anyone can read them in view-source. Avoiding a personal email is an explicit rule in the brief (FINDINGS B7).
- *Fix:* run `find_emails` and the `mailto:`/`tel:` regex over the **raw text of every text file** under `docs/`. In CSS, `@media` always follows a space or `}`, and `[\w.+-]+@` needs a word character right before the `@`, so it won't trip on at-rules. Keep `EMAIL_FILE_EXT_RE`. Add `handle_comment` to `TreeBuilder` and run `find_phones` over comment text as well as visible text. Add mutation tests for a comment, a `<template>` and a `.txt` file. Obfuscated forms ("ben [at] example [dot] com") also pass. That is an accepted residual, which the content reviewer covers.

**CR1-18 (Major): C08 misses several ways of loading an external resource.**
- *Where:* `check_site.py:718-756`, `URL_RE` at `:143` and `is_external` at `:667-668`.
- *Evidence:* each of these passes every check:
  1. An inline `<style>@import url("https://evil.example/x.css")</style>` in `index.html`. C08 scans HTML attributes but never the text of `<style>` elements.
  2. A protocol-relative `url(//evil.example/x.png)` in `site.css`, which `URL_RE` misses because it requires `https?://`.
  3. `href="https:\\evil.example/"` and `href="https:/\evil.example/"`. Browsers treat a backslash as a slash in http(s) URLs, so both go to evil.example. `is_external` exempts them from C07 and `URL_RE` doesn't match them.
  4. `xlink:href="//evil.example/a.png"` in the SVG.
  5. A second page `docs/about.html` with any link, or `docs/assets/extra.css` with `url(https://…)`. Only `index.html` and `site.css` are parsed.

  The plan's own wording is "Checks scan `docs/**` text files". The page relies on making no third-party requests at all (PLAN section 1), and today nothing would catch a font or CDN URL pasted in.
- *Fix:*
  - Before judging, normalise every URL-bearing value the way browsers do: strip ASCII tab and newline, turn `\` into `/`, and resolve a leading `//` to `https://`.
  - Treat any `href`, `src`, `srcset`, `poster`, `action`, `data` or `xlink:href` that starts with a scheme (`^[a-z][a-z0-9+.-]*:`) or `//` as external.
  - Scan `<style>` element text, `style` attributes, every `*.css` and every SVG for `url(` and `@import` targets using the same normaliser.
  - Since the site is one page, fail C01 or C10 if any `*.html` other than `index.html` exists (one constant to widen later), and parse every `*.css`.
  - Add one mutation test for each item 1-5 above.

**CR1-19 (Minor): C13 doesn't look at attributes or CSS text, and its normaliser misses a few characters.**
- *Where:* `check_site.py:885-901` and `normalise` at `:262-265`.
- *Evidence:* each of these passes:
  - `title="Production-ready firmware"` (shown as a tooltip);
  - `aria-label="Proven ARC firmware"` (read out by screen readers);
  - a CSS `::after { content: " Proven on hardware." }`;
  - `reli\u200bable` (a zero-width space);
  - `real<wbr>-time` (`wbr` isn't in `INLINE_TAGS`, so the checker inserts a space);
  - `real–time` (an en dash).
- *Fix:*
  - Add `title`, `aria-label`, `aria-description` and `placeholder` values, plus the strings in CSS `content:`, to the C13 sources.
  - In `normalise`, also remove U+200B to U+200D and U+2060, and turn U+2010 to U+2013 into `-`.
  - Add `wbr` to `INLINE_TAGS`.

**CR1-20 (Minor): coverage gaps in C07, C17, C18 and file names.**
- *Where:* C07 (`:671-700`) only checks `src` and `href`. C18 (`:1024-1048`) only checks `SVG_PATH`. C17's pairs (`:998-999`) leave out muted on code-bg, which is what `.tag` uses. No check looks at file names.
- *Evidence:* `<source srcset="assets/nope.svg">` passes, so CR1-11 would ship with a broken image undetected. A `docs/assets/Benjamin-Elmore-resume.pdf` passes every check, and the brief forbids a résumé on the page.
- *Fix:*
  - C07: split `srcset` on commas and resolve each URL.
  - C18: check every `docs/assets/*.svg` (title, desc, role and viewBox for each; the required labels for each architecture file).
  - C17: add the pairs `--color-muted`/`--color-code-bg` and `--color-text`/`--color-code-bg`.
  - C10 or C13: fail any file whose name matches `(?i)r[eé]sum[eé]|cv\b`.

**CR1-21 (Minor): T1-T3 from FINDINGS section 3 aren't implemented yet, and T3 has an ordering trap.**
- *Where:* `check_site.py:34-66` and `:74-88`.
- *Evidence:*
  - None of the T1 phrases (`validated`, `autonomous navigation`, `autonomous flight`, `flight-validated`, `CFD`, `race-free`, `race freedom`, `sole author`, `production system`) is in the list.
  - Neither C08 nor any other check names `SdBenE`, `CBU-Robotics` or `RobotBenjaminLucas`.
  - `CPPDev` isn't required, and `ARC-Testing` isn't forbidden.
  - The page currently says `ARC-Testing` twice (`index.html:127,143`), so landing T3 alone turns the real-docs test and CI red.
- *Fix:*
  - Land T1 as part of CR1-16.
  - For T2, apply the deny regex `(?i)SdBenE|CBU-Robotics|RobotBenjaminLucas` to the **raw text of every file** in the same way as C09. The C08 allowlist already rejects these as links, so the value here is catching prose mentions and comments.
  - Land T3 in the **same fix round** as the content-engineer's C1/C2 copy change. Sequence the commits so CI stays green, or land T3 after them.

**CR1-22 (Minor): CI is correct but has no time limit or concurrency control.**
- *Where:* `.github/workflows/site-checks.yml:18-29`.
- *Evidence:* the triggers, `permissions: contents: read`, `ubuntu-latest`, Python pinned to 3.12 and both steps match the plan exactly. There is no `timeout-minutes`, and a burst of pushes stacks up duplicate runs.
- *Fix:* add `timeout-minutes: 5` to the job and `concurrency: { group: site-checks-${{ github.ref }}, cancel-in-progress: true }`. Pinning `actions/checkout` and `actions/setup-python` to commit SHAs is optional with a read-only token.

---

## Routing summary

| Owner | Findings |
|---|---|
| style-engineer | CR1-1, CR1-2, CR1-3, CR1-4 (after the plan amendment), CR1-5 (Majors); CR1-6 to 10; CSS parts of CR1-11 and CR1-14 |
| diagram-engineer | CR1-11 (Major: new stacked SVG, larger fonts in the wide one); CR1-12, CR1-13 |
| content-engineer | `<picture>` markup for CR1-11; CR1-14, CR1-15; `ARC-Testing` copy for CR1-21 (already C1/C2 in FINDINGS) |
| test-engineer | CR1-16, CR1-17, CR1-18 (Majors); CR1-19 to 22; check updates for CR1-11 |
| lead (PLAN amendments) | 2.5: allow the stacked second SVG through `<picture>` and replace "18 user units" with "≥ 12px rendered at the width it is shown" (CR1-11). 2.7: one toggle model (CR1-4). 2.4: steps inside `figcaption` (CR1-14). 2.6: `div.skill-group` (CR1-15). Section 4: the extended C07/C08/C11/C13/C18 scope (CR1-16 to 20). |

After the fix round, the next verify should screenshot keyboard focus at 360px and 1280px (VERIFY-1 left it UNRUN, and CR1-3 shows it matters) and crop the stacked diagram at 360px.
