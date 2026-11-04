# CODE-REVIEW-2: code review, queue 11-03-26, round 2

- **Who / when:** code reviewer (read-only), 2026-11-03
- **Under review:** the fix-round-1 diff `git diff 9eba5c3..17b6784 -- docs tools .github` on branch `dev-11-03-26`. Later commits (`6bf5bb4`, `03bc74a`) touch only `work/`, so the code reviewed is the same at the branch tip `03bc74a`. Context: `CLAUDE.md`, `work/PLAN.md` (amendment A1 in 2.5) and `CODE-REVIEW-1.md`.
- **Re-ran:** `python tools/check_site.py` gives 19/19 PASS, and `python -m unittest tools/test_check_site.py` runs 58 tests, OK. CI `site-checks` is green on `17b6784`, `6bf5bb4` and `03bc74a`. Run `5de374d` was cancelled by the new concurrency group, as intended.
- **Scratch folder:** `C:\Users\Kyle\AppData\Local\Temp\claude\63a5ae193b538a83\422e17bb-5764-465e-a041-6e3401fe89d4\scratchpad\cr2-codereview-164233\` (written `<R>` below)
  - `<R>\mutate2.py` and `<R>\mutate2-out.txt`: the 34 round-1 probes, 48 new false-negative probes and 17 false-positive probes, each run on a copy of `docs/` at `17b6784`.
  - `<R>\check_site_r1.py`: the round-1 checker, used for the regression comparison in CR2-2.
  - `<R>\render\probe*.html` and `probe*-dom.html`: headless Edge layout probes (iframes at 360, 719, 720 and 1280px). `<R>\render\sitefix\` holds the one-line CR2-1 fix, tested.
  - `<R>\render\svgs-2x.png`: both SVGs at their target widths, at 2x. `<R>\render\fonts.png`: both SVGs rendered in Arial and in Verdana.

## Verdict: **CHANGES REQUIRED**

| Severity | Count | IDs |
|---|---|---|
| Blocker | 0 | none |
| Major | 1 | CR2-1 |
| Minor | 4 | CR2-2, CR2-3, CR2-4, CR2-5 |
| Nit | 5 | CR2-6 to CR2-10 |

All 22 CR1 items are **CLOSED**. One new Major remains, CR2-1, and it is a one-line CSS fix that I have already tested in scratch. Once CR2-1 lands I would approve with minors. The Minors can go in this round or be logged for the validators.

---

## CR1 status

| ID | Status | Evidence |
|---|---|---|
| CR1-1 | CLOSED | Below 720px the nav is a 3×2 grid (`site.css:237-245`) and the header is static (`:208-209`). Probe at 360px: the six links sit in two rows (y=52 and y=96). "ARC firmware" is 95px wide in a 96px cell, even with the iframe's 15px scrollbar taking width (101px on a real 360px phone). `scrollWidth` equals the viewport, and nothing is off-screen. |
| CR1-2 | CLOSED | The name, toggle and all six nav links measure 44px tall at 360, 720 and 1280px (probe). `.link-list a` and `.card__link a` have `min-height: var(--tap)` (`:382-388`). The inline repo link stays inline, which WCAG 2.5.8 exempts. |
| CR1-3 | CLOSED | The overflow container is gone (`.site-nav` has no `overflow`), so nothing clips the ring at rest. See CR2-1 for a new clip, but only when the header is stuck. |
| CR1-4 | CLOSED | Model A. The label stays fixed at "Dark theme" and `aria-pressed` carries the state (`site.js:17-19`). Probe: clicking flips `aria-pressed` true→false→true and `data-theme` dark→light→dark, while the text stays "Dark theme". The pressed style is accent on code-bg (`site.css:284-288`), 6.95:1. It only ever shows in the dark theme, because pressed means dark. |
| CR1-5 | CLOSED | `--measure: 36.5rem` (`:35`), and the footer font has moved to `.site-footer p`. Probe at 1280px: the header name, `.case-study__summary` and the footer `p` all start at x=340.5 and are 584px wide. The toggle's right edge, 924.5, matches the column's right edge. `--page-max` is commented as reserved. |
| CR1-6 | CLOSED (deviation accepted) | The cards are one column at every width (`:641-646`), and the empty gap is gone because no row stretches them. Accepted: two cards in a 36.5rem column would each be about 280px, which is too narrow for the FSW body text, and the stacked cards (584px wide) read better. |
| CR1-7 | CLOSED | `.case-study__block p + ul/ol { margin-top }` (`:447-450`). |
| CR1-8 | CLOSED | `text-wrap: balance` is on h1-h4, and `pretty` is on the summary, lede and intro. The visual result was checked in VERIFY-2. |
| CR1-9 | CLOSED | `.decision__label` is 0.75rem, and the toggle border uses `--color-muted` (6.46:1 light, 8.08:1 dark; recorded in the CSS comment). |
| CR1-10 | CLOSED | The `matchMedia` change listener is added (`site.js:22`). See the CR2-6 nit. |
| CR1-11 | CLOSED | Stacked SVG (`viewBox 0 0 360 640`). At 328px the 17u text renders at 15.5px and the 22u text at 20px. At 313px (iframe with scrollbar) it is 14.8px. The wide SVG has a 22u minimum and 26u names, which render at 13.4px at 584px. Probe: at 719px `currentSrc` is the stacked file (416×739.5, capped by `max-width: 26rem`), and at 720px it is the wide file (584×219). The 720px switch in A1 matches the CSS breakpoint. C07 resolves `srcset` (probe: renaming the real `<source>` target is caught), and C18 covers every SVG. |
| CR1-12 | CLOSED (print part skipped, accepted) | Panel stroke `#4a78b5` in both files (`:9`), and V5 Brain has the sub-label "robot controller". Skipping the print invert is acceptable. I marked it optional and taste-only, and a navy plate on paper is legible. |
| CR1-13 | CLOSED | The badge now reads "case study" in both files. |
| CR1-14 | CLOSED | `ol.figure__steps` is now inside `<figcaption>` (`index.html:74-81`). Its rem font sizes don't compound. |
| CR1-15 | CLOSED | `div.skill-group`, and `role="list"` on the three styled lists. |
| CR1-16 | CLOSED | All six round-1 forms are caught, and stems are allowed through `re:` entries (`check_site.py:42-77`). The remaining gaps are new and smaller (CR2-3). |
| CR1-17 | CLOSED | Emails in a comment, a `<template>`, CSS `content`, `humans.txt`, a CSS comment, a JS comment and an SVG comment are all caught, as are phones in a comment. See CR2-2 for a regression this introduced. |
| CR1-18 | CLOSED | All five round-1 vectors are caught, plus protocol-relative `img`, `link` and `script`, a tab inside the scheme, uppercase `HTTPS`, `@import` in string or `url()` form in `.css`, `<style>` and SVG `<style>`, `srcset` candidates and SVG `<use href=//>`. The residuals are in CR2-8, and the second-page coverage is in CR2-4. |
| CR1-19 | CLOSED | `title`, `aria-label`, CSS `content`, U+200B, `<wbr>` and the en dash are all caught. |
| CR1-20 | CLOSED | `srcset` is split and each URL resolved. C18 runs on every `assets/*.svg`. C17 adds the code-bg pairs, and the lowest ratio is now reported as 5.95:1. Résumé and CV file names are caught. |
| CR1-21 | CLOSED | The T1 phrases are in the list, the T2 `DENY_RE` scans raw text in every file, T3 forbids `ARC-Testing`, and `CPPDev` is required. CI stayed green across the sequence. |
| CR1-22 | CLOSED | `timeout-minutes: 5` and a concurrency group with `cancel-in-progress`. See the CR2-10 nit. |

### Style-engineer deviations

- **Cards in one column at every width:** acceptable (see CR1-6).
- **Two-row header at every width:** acceptable. Row 1 (name and toggle) lines up with the content column, which is what CR1-5 asked for, and at 720px and above it scrolls away, so it costs no screen space after the top of the page.
- **Header static below 720px, sticky nav row at 720px and above:** acceptable as a design, and it matches the CR1-1 advice. The negative-`top` implementation has one defect (CR2-1).
- **CR1-12 print invert skipped:** acceptable.

---

## New findings

### CR2-1 (Major): at 720px and wider, keyboard focus on the name link or the theme toggle is fully off-screen once the header is stuck. Owner: style-engineer.

- **Where:** `site.css:736-739` (`.site-header { position: sticky; top: calc(-1 * (var(--space-2) + var(--tap))); }`).
- **Evidence (`<R>\render\probe3-dom.html`, 1280px):**
  - After scrolling to y=3000, the header sits at top -52px, the nav row at 0 and the toggle at y=-44 (height 44), so the toggle is entirely above the viewport.
  - `scrollIntoView({block:'nearest'})`, which is what a browser does on focus, scrolls the page up 116px. The toggle is still at y=-44 afterwards, because a stuck element moves with the scroll. The name link behaves the same way.
  - So a keyboard user who scrolls (Space or PageDown) and then tabs reaches the name link and the toggle with no visible focus. The same happens when tabbing on from the last nav link. This fails WCAG 2.4.7 / 2.4.11 for the page's only control.
  - It also clips the top edge of the focus ring on stuck nav links: the link box starts at y=0, and the outline (3px plus a 2px offset) extends to y=-5. This is the same symptom as CR1-3, but only while stuck.
- **Fix (one line, tested in `<R>\render\sitefix\`):** inside the `min-width: 720px` block add
  ```css
  .site-header:focus-within { top: 0; }
  ```
  With this rule, the probe (`<R>\render\probe4-dom.html`) puts the focused toggle at y=8 and the focused name link at y=8 at scroll 3000. Nav-link rings get their 8px of room above as well. Nothing changes for mouse users. VERIFY-3 should screenshot keyboard focus while stuck at 1280px.

### CR2-2 (Minor): C11 no longer catches an email split by inline markup. This is a regression. Owner: test-engineer.

- **Where:** `check_site.py:997-1012`. The email scan now runs only on the **raw** text of each file, and the round-1 scan over `visible_text(doc)` was dropped.
- **Evidence:** `<p>ben.elmore<span>@</span>example.com</p>` renders as a plain email. The round-1 checker (`<R>\check_site_r1.py`) fails C11 on it ("email-like 'ben.elmore@example.com' in index.html text"). The round-2 checker passes it. `ben.elmore<!-- -->@example.com` also passes. A split like `<code>ben.elmore</code>@example.com` is a realistic formatting edit, not only an attack.
- **Fix:** also run `find_emails` and the `mailto:`/`tel:` regex over `visible_text(doc)` and `svg_text(...)` (two lines), and add a self-test case for the `<span>@</span>` form.

### CR2-3 (Minor): C13 still misses common word forms and space-for-hyphen spellings, and the self-test locks one inconsistency in. Owner: test-engineer, with content-reviewer sign-off for list changes.

- **Where:** `check_site.py:42-77` (the list) and `:1068-1073` (`phrase_regex` joins plain phrases on `\s+`, so a hyphen in the entry is required literally). Also `test_check_site.py:639`.
- **Evidence (`<R>\mutate2-out.txt`, section B):** each of these passes every check:
  - `proves`, `proving` and `provably`, because `prove[nd]\b` covers only proven and proved;
  - `validates`;
  - `production-grade`;
  - `battle tested`, `flight ready` and `hardware tested`, which are the spaced spellings of listed hyphenated phrases;
  - `end to end tested` and `fully-tested`, which are the opposite case: listed with spaces or hyphens, but spelled the other way;
  - `real—time` (an em dash; `_DASH_RE` stops at U+2013).

  There is also an inconsistency. `release the lock` and `the guard releases the mutex` **fail** C13 (section C), while `test_no_false_positives` asserts that `releasing` **passes** (`test_check_site.py:639`). So "Releasing the firmware this month" passes, while honest mutex language fails.
- **Fix:**
  - In `phrase_regex`, split plain entries on `[\s-]+` and join them with `[-\s]+`, so hyphen and space forms match each other.
  - Use `prov(?:e[nsd]?|ing|abl[ey])\b` and `validat(?:e[sd]?|ing)\b`. Keep bare "validation" allowed, per CONTENT-REVIEW-1.
  - Add `production[-\s]grade`.
  - Add U+2014 to `_DASH_RE`.
  - For release, the content reviewer picks a single rule: either every form including "releasing", or only the claim sense (`released\b`, `(?:public|first|stable)\s+release`), so firmware wording about releasing a lock passes.
  - Add one test per new form.

### CR2-4 (Minor): coverage stops at `index.html` for C11 phones, C12 and C13, and phones in attributes or CSS slip through. Owner: test-engineer.

- **Where:** `Site.html_docs` (`check_site.py:488-499`) is used only by C08. C11 phones come from `phone_sources` (`:1013-1024`), and C12 and C13 read only `site.doc`.
- **Evidence (section B):** each of these passes:
  - `docs/about.html` containing "Proven firmware", `(951) 555-0142`, or an inline `<script>fetch('//evil.example')</script>`;
  - `title="Call (951) 555-0142"`;
  - a phone number in a CSS `content:` string;
  - a phone number in a `site.js` string.

  Round 1 suggested failing on any second page. The fix round instead parses every page, but only for C08.
- **Fix:**
  - Fail C01 (or C10) when any `*.html` other than `index.html` exists. This is one constant, `PAGES = ("index.html",)`, and it is simpler than widening C11, C12 and C13.
  - Add the `C13_ATTRS` values and `css_content_strings(...)` to `phone_sources`.
  - Phones in JS strings are an accepted residual: `site.js` is under 3 KB and a reviewer reads it.

### CR2-5 (Minor): diagram labels leave almost no horizontal slack, so a wider system font overflows the boxes. Owner: diagram-engineer.

- **Where:**
  - `arc-architecture.svg:27-48`: the box widths are 190, 166, 188 and 182u, with 26u names and 22u sub-labels.
  - `arc-architecture-stacked.svg:10`: the 22u bold title spans about 290 of the 312u available.
- **Evidence:**
  - In Segoe UI (`<R>\render\svgs-2x.png`) everything fits, but "VEX V5 Brain" and "multiplexed I²C" come within about 4px of the box strokes.
  - With `font-family` swapped to Arial (`<R>\render\fonts.png`, top), roughly the width of SF/Helvetica that macOS desktops get through `system-ui`, both labels touch the strokes.
  - In Verdana (second and right-hand images), roughly the width of DejaVu Sans, the default `system-ui` on many Linux desktops, "multiplexed I²C", "optical and other" and "VEX V5 Brain" cross the strokes, and the stacked title clips at the panel edge.
  - Separately, the stacked file has 48u of empty panel below the last box against 24u side margins (`svgs-2x.png`), so the plate looks bottom-heavy.
- **Fix:**
  - Wide file: give each box at least 12u of slack per side at Arial widths. For example, widen boxes 1, 2 and 4 to about 200u by taking space from the outer margins and the RS-485 gap, which can shrink if "half-duplex" and "RS-485" stay stacked. Alternatively, drop the names to 24u, which renders at 14.6px and is still within A1.
  - Stacked file: set the title to 20u (18px rendered).
  - Stacked file: trim the viewBox to `0 0 360 616` and the `<source height>` to 616 (content-engineer).
  - Re-render with Arial and Verdana substituted as a check.

### CR2-6 (Nit): `site.js:22` runs before the click handler is attached. Owner: style-engineer.

On browsers without `MediaQueryList.addEventListener` (Safari 13 and older), line 22 throws, so line 23 never runs and the button is visible but does nothing. Move line 22 after the click listener, or guard it with `var mq = matchMedia(...); (mq.addEventListener ? mq.addEventListener('change', render) : mq.addListener(render));`. The file stays well under its budget.

### CR2-7 (Nit): checker false positives (they fail safe, but they create noise). Owner: test-engineer.

Section C of `<R>\mutate2-out.txt` shows each of these failing:
- "release the lock" and "releases the mutex" (C13; see CR2-3);
- "The read returns an error code." (C13 `returns`, inherited from round 1, likely on a firmware page);
- "non-deterministic" and "not deployed" (C13; accepted, since a reviewer can rephrase);
- a prose URL followed by a period, "See https://github.com/Benjamin-Elmore." (C08 reads the `.` as part of the URL);
- a file named `arc-cv2.png` (C10 `(?<![a-z])cv(?![a-z])`);
- decimal numbers in SVG text read as a phone number (C11).

Fix: strip trailing `.,;:!?` from `RAW_URL_RE` matches, and require `(?![a-z0-9])` after `cv`. The rest are acceptable.

### CR2-8 (Nit): C08 residual vectors. Owner: test-engineer, optional.

These pass:
- a CSS escape, `u\72l(//evil.example/x.png)`;
- a string inside `image-set("//evil.example/x.png" 1x)`;
- `<meta http-equiv="refresh" content="0;url=//evil.example/">`.

The first two are unlikely in a hand-written stylesheet. Cheap closes:
- in `judge_css`, also judge every quoted CSS string that starts with `//` or a scheme;
- parse the `url=` part of a refresh `content` value.

### CR2-9 (Nit): breakpoint seams and header assumptions. Owners: content-engineer for `index.html:71`, style-engineer for CSS.

- `<source media="(max-width: 719px)">` and `@media (min-width: 720px)` both fail at fractional widths between 719 and 720 CSS px, which happen at non-100% zoom. At those widths the wide SVG shows under the phone cap (26rem), so its 22u labels render at about 9.5px. Use `(width < 720px)` or `(max-width: 719.98px)` in both places.
- The negative `top` assumes row 1 is exactly 44px tall. With a large default font size, a sliver of row 1 stays visible. This is cosmetic only.
- The toggle is visually in row 1 but comes after the nav in tab order (the DOM order is fixed by PLAN 2.1). That is acceptable, and noted only for the validators.

### CR2-10 (Nit): CI concurrency also cancels runs on `main`. Owner: test-engineer.

`cancel-in-progress: true` (`site-checks.yml:21`) also applies to pushes to `main`, so a quick second merge cancels the first commit's check. Use `cancel-in-progress: ${{ github.event_name == 'pull_request' }}`. The rest of the CI is correct: least-privilege token, Python pinned to 3.12, a 5-minute timeout, and green on the branch. No 3.13+ APIs are used in `tools/`.

---

## Other review notes (no action)

- **`<picture>` markup** (`index.html:70-73`) is correct. The `<source>` has `media`, `srcset` and its own `width`/`height`, so each file keeps its aspect ratio and there is no layout shift. The `<img>` keeps the alt text, `loading="lazy"` and `decoding="async"`. `img { display:block }` together with `margin-inline:auto` centres the capped phone image (probe at 719px: x=144 in a column from 60 to 644).
- **Stacked SVG.** It has no script, no external refs and no `foreignObject`. `<title>` and `<desc>` are referenced by `aria-labelledby`. That is harmless in `<img>` and helps if the file is opened directly. Marker ids repeat across the two files, which is fine because they are separate documents. The arrowheads end 3u short of the boxes, and the RS-485 arrow has heads at both ends.
- **Header z-index and the skip link.** The skip link (z 100, absolute) still beats the header (z 50). Print resets the header to static after the 720px block, so source order wins.

## Routing summary

| Owner | Findings |
|---|---|
| style-engineer | **CR2-1 (Major, one line)**; CR2-6; the CSS part of CR2-9 |
| test-engineer | CR2-2, CR2-3 (list changes need content-reviewer sign-off), CR2-4; CR2-7, CR2-8, CR2-10 |
| diagram-engineer | CR2-5 |
| content-engineer | The `<source>` media query (CR2-9) and its `height` if CR2-5 trims the stacked viewBox |

Next verify: add a 1280px keyboard-focus screenshot with the header stuck, and render the diagrams with a wide fallback font.
