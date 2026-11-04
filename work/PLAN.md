# PLAN: queue 11-03-26, initial framework

Single-page static portfolio in `docs/`, plain HTML + CSS, one small local JS file for the theme toggle. Every fact comes from `PORTFOLIO-CONTENT.md` (the brief). Pages serves `main` `/docs` as a project site at `https://benjamin-elmore.github.io/Benjamin-Elmore-Website/`, so **all asset paths are relative** (`assets/site.css`, never `/assets/...`).

## 1. Files and owners (one writer per file)

| File | Owner | Notes |
|---|---|---|
| `docs/index.html` | content-engineer | All markup and copy, per the contract in section 2. |
| `docs/.nojekyll` | content-engineer | Empty file. |
| `docs/assets/site.css` | style-engineer | All styling, tokens, light/dark, print-safe basics. |
| `docs/assets/site.js` | style-engineer | Theme toggle only (under 40 lines). |
| `docs/assets/arc-architecture.svg` | diagram-engineer | Wide standalone SVG, see section 2.5. |
| `docs/assets/arc-architecture-stacked.svg` | diagram-engineer | Vertically stacked SVG for narrow screens (amendment A1). |
| `tools/check_site.py` | test-engineer | Checks from section 4, stdlib only, Python 3.12-compatible. |
| `tools/test_check_site.py` | test-engineer | `unittest` self-test: one failing fixture per check plus a passing fixture. |
| `.github/workflows/site-checks.yml` | test-engineer | Runs on `pull_request` and `push` to `main`. |
| `work/reviews/*.md` | reviewers | One file per reviewer per round. |
| `work/RUN-STATE.md` | lead only | Status board. |

Decisions taken (lead default; Ben can override):
- **No `docs/404.html`.** A project-site 404 is served at arbitrary depths, so relative asset paths break; GitHub's default 404 is fine for now.
- **No Google Font.** System font stack only, so the page makes no third-party requests at all.
- **Diagram as an external SVG via `<img>`**, not inlined. One writer, cacheable, and the text alternative lives in index.html (content-engineer). The SVG draws its own opaque panel, so it does not depend on page theme (an `<img>` SVG cannot see the page's `data-theme`).
- **No `og:image`** this queue (no approved image). `og:url` and `<link rel="canonical">` use the github.io URL above.

## 2. HTML contract (content-engineer writes, style-engineer styles)

### 2.1 Page skeleton (exact order)
```
<html lang="en">
<head> charset, viewport, <title>Benjamin Elmore | Embedded and robotics software</title>,
  meta description, og:title, og:description, og:type=website, og:url, canonical,
  <meta name="color-scheme" content="light dark">,
  <link rel="stylesheet" href="assets/site.css">,
  <script src="assets/site.js"></script>   (in head, NOT defer: sets theme before paint)
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header"> <a class="site-header__name" href="#top">Benjamin Elmore</a>
    <nav class="site-nav" aria-label="Sections"><ul class="site-nav__list"> links to #arc #experience #projects #skills #education #contact </ul></nav>
    <button class="theme-toggle" type="button" hidden aria-pressed="false">Dark theme</button>
  </header>
  <main id="main">
    <section id="top" class="section section--intro" aria-labelledby="intro-title">…
    <section id="arc" class="section" aria-labelledby="arc-title">…
    <section id="experience" …> <section id="projects" …> <section id="skills" …>
    <section id="education" …> <section id="contact" …>
  </main>
  <footer class="site-footer">…</footer>
```
Required section ids, in this order: `top, arc, experience, projects, skills, education, contact`. Each section has exactly one `<h2 id="{id}-title" class="section__title">` except the intro, which has the page's only `<h1 id="intro-title">`. Heading levels never skip (h1 > h2 > h3 > h4).

### 2.2 Layout and generic classes
- `.section` (vertical rhythm, max content width), `.section--intro`, `.section__title`, `.section__lede` (one intro paragraph under a title).
- `.container` is NOT used; `.section` and `.site-header`/`.site-footer` constrain their own width (`max-width` via `--measure`/`--page-max`).
- `.visually-hidden` (screen-reader-only utility).
- `.tag-list` > `li.tag` (inline chips for tech used); `.link-list` > `li` > `a` (horizontal list of external links).
- External links: `<a href="https://..." rel="noopener">` with visible text; no `target="_blank"`.
- `.meta` for small muted text (dates, hashes). Commit hashes and commands go in `<code>`.

### 2.3 Intro (`#top`)
`h1.intro__name`, `p.intro__role` ("Computer science student and robotics software engineer"), `p.intro__lede` (the opening), `ul.link-list.intro__links` (GitHub, LinkedIn).

### 2.4 ARC case study (`#arc`)
```
<section id="arc" class="section case-study">
  h2 #arc-title; p.case-study__summary
  <div class="case-study__block" id="arc-problem">      h3 "The problem" …
  <div class="case-study__block" id="arc-role">         h3 "My role" …
  <figure class="figure figure--diagram" id="arc-architecture">
     <img src="assets/arc-architecture.svg" width="960" height="360" alt="(short alt, see 3)" loading="lazy" decoding="async">
     <figcaption class="figure__caption">Intended system architecture. …</figcaption>
     <ol class="figure__steps">  one li per hop, the full text alternative (visible) </ol>
  </figure>
  <div class="case-study__block" id="arc-decisions">    h3 "Engineering decisions"
     <ol class="decision-list"> 4 x
       <li class="decision"><h4 class="decision__title">…</h4>
         <dl class="decision__body">
           <dt class="decision__label">Failure mode</dt><dd class="decision__text">…</dd>
           <dt class="decision__label">Design response</dt><dd class="decision__text">…</dd>
         </dl></li>
  <div class="case-study__block" id="arc-verification"> h3 "Verification so far"
     <ul class="evidence-list"><li class="evidence"><p class="evidence__date"><time datetime="2026-11-03">November 3, 2026</time></p><p class="evidence__text">…</p></li> …</ul>
     h4 "Open work"; <ul class="open-work">…</ul>
  <p class="case-study__repo"> link to github.com/Benjamin-Elmore/ARC + caveat sentence
```
### 2.5 Diagram spec (diagram-engineer)
- `viewBox="0 0 960 360"`, `role="img"`, `<title>` and `<desc>` inside, `xmlns` set. No scripts, no external refs, no `<foreignObject>`, no web fonts (use `font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"`).
- Four boxes left to right with arrows: **Sensors** ("optical and other external sensors") → **I²C mux** ("multiplexed I²C") → **ESP32-S3** ("ARC firmware on ARSENAL board") → **VEX V5 Brain**. The link between ESP32-S3 and V5 Brain is labelled **"half-duplex RS-485"**; the sensor-side links are labelled **"I²C"**. Heading text in the SVG: "Intended system architecture".
- Self-contained palette on an opaque background rect (rounded, dark navy "blueprint" or light paper; diagram-engineer's choice), every text/background pair at least 4.5:1, strokes at least 3:1 against the panel. Must look fine on both page themes.
- **Amendment A1 (lead, fix round 1, CR1-11):** the 18-unit rule could not reach 12px rendered text at 328px. There are now two files: the wide SVG (`viewBox 0 0 960 360`, minimum font 20u ≈ 12.2px at 584px, box names 24u; fix round 2; the sub-labels have no room to shrink further), and `arc-architecture-stacked.svg` (`viewBox 0 0 360 616`, same palette and restrictions, one-line sub-labels at 17u or more) served below 720px via `<picture><source media="(max-width: 719.98px)" srcset="assets/arc-architecture-stacked.svg">`. Both must render text at 12px or more at their target widths. Add a panel stroke so the panel edge shows in the dark theme (CR1-12).
- No ESP32 pin numbers, part numbers, data rates or anything not in the brief. Do not reproduce the team PlantUML.
- Content-engineer must use `width="960" height="360"` on the `<img>`; style-engineer sets `.figure--diagram img { width:100%; height:auto }`.

### 2.6 Experience, projects, skills, education, contact
- `#experience`: `ol.timeline` > `li.role` > `h3.role__org`, `p.role__title` (with `<time>`), `ul.role__points`. One `li.role` for CBU1 VEX U (both titles inside it, `p.role__title` twice), one compact `li.role.role--compact` for In-N-Out (one line, no points list).
- `#projects`: `div.card-grid` > `article.card` (x2) > `h3.card__title`, `p.card__meta` (status/credit), `p.card__body`, `ul.tag-list`, optional `p.card__link > a`.
- `#skills`: `div.skill-groups` > `section.skill-group` (x3: Embedded, Software, Tools) > `h3.skill-group__title` + `ul.tag-list`.
- `#education`: `div.edu` > `h3.edu__school`, `p.edu__degree`, `p.meta`.
- `#contact`: `p.section__lede` + `ul.link-list.contact__links` (GitHub, LinkedIn).
- `.site-footer`: one line, name and year; no links beyond `#top`.

### 2.7 Style-engineer obligations
- Tokens on `:root`: at least `--color-bg, --color-surface, --color-text, --color-muted, --color-accent, --color-border, --color-focus, --color-code-bg`, plus `--font-sans, --font-mono, --measure, --page-max, --gutter` (`--gutter: 16px` minimum on mobile).
- Dark mode: every `--color-*` redefined in **both** `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) {…} }` and `:root[data-theme="dark"] {…}`; `:root[data-theme="light"]` must win over a dark OS preference. `body` has an explicit `background`.
- Mobile-first: base styles at 360px, `min-width` media queries only. No horizontal scroll at 360px (`overflow-wrap:anywhere` on `code`, `max-width:100%` on media).
- Visible `:focus-visible` outline using `--color-focus` (3:1 against both backgrounds); `.skip-link` hidden until focused; `prefers-reduced-motion` disables transitions.
- All text/background token pairs WCAG AA (4.5:1 body, 3:1 large text and UI). Record the computed ratios as a comment block at the top of `site.css`.
- `site.js`: reads `localStorage['theme']` in try/catch, sets `document.documentElement.dataset.theme` immediately; on `DOMContentLoaded` un-hides `.theme-toggle`, updates its `aria-pressed` and label, toggles and persists on click. Without JS the page follows the OS preference and the button stays hidden. No other behaviour.

## 3. Copy guidance (content-engineer; voice: Ben, first person, plain)

- **Intro.** Use the brief's suggested opening near-verbatim. Role line: "Computer science student and robotics software engineer". Mention embedded firmware, hardware/software interfaces, and interest in defense and space manufacturing as an *interest*, not experience.
- **ARC problem.** CBU1 is developing ARSENAL, a custom ESP32-S3 board connecting external sensors to a VEX V5 Brain; ARC is the C++ sensor firmware. Board and existing sensor code are the team's.
- **ARC role.** Firmware contributor working with electrical and computer engineers. List only: prototyped sensor abstraction; moved I²C toward the ESP-IDF master API; optical register access and position decoding; mutex-protected bus access; UART/RS-485 diagnostics; implementation and debugging commits.
- **Diagram alt** (short): "Block diagram of the intended ARC system architecture: sensors to I²C multiplexer to ESP32-S3 to VEX V5 Brain over half-duplex RS-485." The `ol.figure__steps` restates the four hops in words.
- **Decisions** (failure mode → design response), from the brief's table, in this order:
  1. Sensor abstraction: per-sensor code duplicates acquisition logic → base class evolved to configurable setup/read callbacks + preconfiguration; optical register reads/writes and offsets as the example.
  2. Bus ownership: another task can switch the shared mux between channel select and the sensor transaction → templated `I2CBus<N>` owns registrations, register ops, mux selection and a mutex; select + transaction under one lock; noncopyable lock guard; later work checks failed acquisition.
  3. Acquisition vs requests: a controller request should not have to run a sensor-specific I²C sequence → separate acquisition and communication tasks; sensor-ID registry and a small readings/offset interface. Say "the architecture gives…" (design), not "proven".
  4. Bring-up isolation: a transceiver problem can hide sensor bugs → entry point runs RS-485 with an empty registry; UART startup/status reporting and I²C error logging narrow failures to a layer.
- **Verification** (dated, attributed):
  - November 3, 2026: a local check of the ARC repository's `CPPDev` branch at `3eb3ed6` (matching the public branch), clean tree, `pio run -e seeed_xiao_esp32s3` passed with a flash-size configuration warning (8 MB expected, 2 MB configured). Build of the RS-485-only entry point; it shows the target builds; no hardware test was run.
  - October 28, 2026: commit `cef105f` records successful RS-485 protocol checks across multiple packet formats "per the commit message"; later commits changed the communication code.
  - Open work: optical I²C bring-up; a current sensor-to-V5 hardware test; per-command parser stubs (header dispatch is prepared); resolving the flash configuration warning.
- **Repo link (corrected, findings C1/B1).** Link `https://github.com/Benjamin-Elmore/ARC`. The verified build is that repo's public `CPPDev` branch at `3eb3ed6`; its default branch `main` is a different revision. Never say `main` holds the verified build. Never use "ARC-Testing" (old name) or SdBenE URLs.
- **Experience.** CBU1 VEX U Robotics: Software Engineer since September 2025; Vice President since October 2026. Coordinates milestones across disciplines, helps plan events and competition prep. Earlier PROS/C++ drivetrain work: driver controls, baseline point navigation with odometry and robot-frame error, PID/Pure Pursuit *exploration*; spline/odometry work had open items. In-N-Out Burger, Associate since May 2024, one line (teamwork, service quality in a fast-paced environment).
- **FSW-UAV-SIM.** No link. "I coordinate this AI-assisted UAV simulation effort and own its C++/simulation integration decisions", with one mechanical engineer and AI agents credited (B4, C5, N11). C++ flight-software logic and Simulink plant behind a Level-2 S-function; generated interface contracts, JSON parameter files, replay fixtures and tests. Status: staged prototype; GNC stubbed, aero data draft; October 15, 2026 review of f4f6229: 13/13 generator tests, interface and rule checks passed, Windows checker self-test failed, native C++ tests and MEX not built (C6, N10).
- **MarketTesting.** Linked. Independent Python learning project: CSV/yfinance ingestion, pandas/NumPy preprocessing, per-ticker scaling, 100-day windows, TensorFlow LSTM training, prediction-table output. Pipeline ownership only; no results.
- **Skills.** Embedded: C/C++, ESP-IDF, FreeRTOS, ESP32-S3, PlatformIO, I²C, UART, RS-485, VEX V5/PROS. Software: Python, Java, TensorFlow, pandas/NumPy, MATLAB/Simulink. Tools: Git, Linux, PlatformIO, Arduino. (PlatformIO may sit in Embedded only; no duplicates.)
- **Education.** California Baptist University, B.S. Computer Science, Machine Learning and Artificial Intelligence concentration, expected May 2029.
- **Contact.** GitHub and LinkedIn only.

**Forbidden claims** (content reviewer enforces; section 4 automates the phrase list): deployment/release/production use; throughput, latency, timing, real-time or determinism; reliability or robustness; forecasting accuracy, returns or financial performance; that ARC was hardware-tested end to end or that the sensor-to-V5 path works; that the ARC repo's `main` branch holds the verified build; "separate snapshot" wording; that Ben designed the ARSENAL board or wrote the team's existing sensor code; that Ben led VEX U as a whole; that FSW-UAV-SIM is flight-ready, complete, or hand-written without AI; any defense/space job experience; email, phone, address, résumé.

## 4. Acceptance checks (`tools/check_site.py`)

CLI: `python tools/check_site.py [--root docs]` prints one line per check `PASS|FAIL <id> <detail>`, exits 1 on any FAIL. Parse with `html.parser.HTMLParser`. Checks scan `docs/**` text files (`.html .css .js .svg`) unless stated.

| ID | Check |
|---|---|
| C01 | `docs/index.html` exists and parses; `docs/.nojekyll` exists. Void/unclosed-tag balance: every non-void opened tag is closed in order. |
| C02 | `<html lang="en">`; `<meta charset>`; viewport meta containing `width=device-width`; non-empty `<title>`; `meta[name=description]` 50-160 chars; `og:title`, `og:description`, `og:type`, `og:url` present. |
| C03 | All `id` values unique. |
| C04 | Every `href="#x"` resolves to an id (`#` alone not allowed). |
| C05 | Sections `top, arc, experience, projects, skills, education, contact` exist as `<section>` children of `<main id="main">`, in that order. Exactly one `<h1>`; heading levels never skip. |
| C06 | Landmarks: one `<header>`, one `<nav>` with `aria-label`, one `<main id="main">`, one `<footer>`; first focusable element in `<body>` is `a.skip-link[href="#main"]`. |
| C07 | Every `<img>` has non-empty `alt`, `width`, `height`; every local `src`/`href` (`assets/...`) exists on disk; no root-absolute (`/...`) local paths. |
| C08 | External URL allowlist (every `http(s)` in `href`, `src`, `content`, CSS `url()`): `https://github.com/Benjamin-Elmore`, `https://github.com/Benjamin-Elmore/ARC`, `https://github.com/Benjamin-Elmore/MarketTesting`, `https://www.linkedin.com/in/benjamin-n-elmore/`, `https://benjamin-elmore.github.io/Benjamin-Elmore-Website/` (only in `og:url`/canonical). SVG `xmlns` `http://www.w3.org/2000/svg` exempt. No `http://` links. |
| C09 | No `FSW-UAV-SIM` URL anywhere (regex `github\.com/[^"' ]*FSW`). |
| C10 | No reference to handoff/work files in `docs/`: case-insensitive `PORTFOLIO-CONTENT`, `PORTFOLIO-RESEARCH`, `RUN-STATE`, `PLAN.md`, `work/`, `CLAUDE.md`; and no `.md` file under `docs/`. |
| C11 | No email or phone: regex `[\w.+-]+@[\w-]+\.[\w.]+` (ignoring the `@media`/`@import`-free context by scanning HTML text and attributes, not CSS), `mailto:`, `tel:`, and `\+?\d[\d\s().-]{8,}\d` in visible text (exclude `datetime` attributes and hex hashes). |
| C12 | No `<script src="http...">`; only allowed script is `assets/site.js`; no inline `<script>` bodies; no `on*=` handler attributes; no `<iframe>`, `<object>`, `<embed>`; SVG file contains no `<script`, `<foreignObject`, `href="http`. |
| C13 | Forbidden phrases absent from visible text of `index.html` and SVG text (case-insensitive, word-boundary): `throughput`, `latency`, `low-latency`, `deterministic`, `determinism`, `real-time`, `realtime`, `reliable`, `reliability`, `robust`, `deployed`, `deployment`, `in production`, `production-ready`, `production ready`, `released`, `flight-ready`, `flight-tested`, `battle-tested`, `proven`, `guarantee`, `accuracy`, `accurate`, `outperform`, `profit`, `returns`, `fully tested`, `end-to-end tested`, `hardware-verified`, `résumé`, `resume`. Implement the list as one constant so reviewers can tune it; allow a per-phrase exemption only via an explicit `ALLOW` constant (empty this queue). |
| C14 | Required facts present in visible text: `intended system architecture`, `3eb3ed6`, `cef105f`, `November 3, 2026`, `October 28`, `flash`, `no hardware test` (or `hardware test` within the verification block), `AI-assisted`, `prototype`, `May 2029`, `half-duplex RS-485`, `Vice President`, `September 2025`, `October 2026`. |
| C15 | ARC repo link is inside `#arc`; MarketTesting link inside `#projects`; `#projects` contains no `<a>` whose text or href mentions FSW. |
| C16 | CSS: `site.css` defines on `:root` every token named in 2.7; contains a `prefers-color-scheme: dark` block and a `[data-theme="dark"]` block, each redefining every `--color-*` token defined on `:root`; contains `:focus-visible` and `prefers-reduced-motion`; `body` rule sets `background`. |
| C17 | Contrast: parse hex `--color-text`/`--color-muted`/`--color-accent` vs `--color-bg` and `--color-surface` for light and dark sets; require >= 4.5:1 (focus vs bg >= 3:1). Hex only (`#rgb`/`#rrggbb`); FAIL if a color token is not hex, so the check can't silently skip. |
| C18 | SVG: parses as XML, root has `viewBox`, `role="img"`, child `<title>` and `<desc>`; text includes `Intended system architecture`, `I²C` or `I2C`, `ESP32-S3`, `RS-485`, `V5 Brain`. |
| C19 | Size budget: total `docs/` under 300 KB; `site.js` under 3 KB. |

`tools/test_check_site.py`: builds temp fixture trees (`tempfile`) with a minimal valid site that passes every check, then one mutation per check ID that must make exactly that check FAIL. Also one test running the checker against the real `docs/` (skipped with a message if `docs/index.html` is absent).

CI (`site-checks.yml`): `on: pull_request` and `push: branches [main]`; `ubuntu-latest`; `actions/checkout@v4`, `actions/setup-python@v5` with `python-version: "3.12"`; run `python -m unittest tools/test_check_site.py -v` then `python tools/check_site.py`. `permissions: contents: read`. No other actions.

**Not automated (manual, recorded in the verify report):**
- Visual review at 360px and 1280px, both themes, plus toggle behaviour and keyboard tab order. Chrome is not installed; Edge is at `C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`. Headless screenshots (separate profile avoids the singleton lock seen when Edge is open):
  `"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --headless=new --disable-gpu --user-data-dir=<scratch>\edge-prof --hide-scrollbars --window-size=360,3000 --screenshot=<scratch>\m360.png file:///C:/Elmore/Benjamin-Elmore-Website/docs/index.html` (repeat at 1280 width; add `--force-dark-mode` / `--blink-settings=preferredColorScheme=0` for dark). Horizontal-scroll check: `--dump-dom` is not enough; inspect the 360 screenshot for clipped content, or use Claude in Chrome/Edge DevTools if available. If headless Edge fails, mark visual review UNRUN and hand it to Ben.
- Diagram legibility at 328px and contrast inside the SVG (reviewer eyeballs plus spot-check ratios).
- Claim accuracy beyond the phrase list (content reviewer).
- Local Python is 3.14; CI pins 3.12, so avoid 3.13+ APIs.

## 5. Order and reviewers

1. **Build, all parallel** (contract above is the interface): content-engineer, style-engineer, diagram-engineer, test-engineer. test-engineer writes checks from this plan, not from the others' output. Nobody edits another owner's file; contract gaps go to the lead, who amends this plan.
2. **Verify** (waits for all four): test-engineer runs the self-test, `check_site.py`, and the Edge screenshots; reports PASS / FAIL / UNRUN per check in `work/reviews/VERIFY-1.md`.
3. **Review**, parallel, after verify:
   - Code reviewer (effort high): HTML semantics, contract conformance, CSS tokens/dark mode/360px, a11y (landmarks, focus, contrast, SVG alt), JS minimalism, checker correctness and false-negative risk, CI. Writes `work/reviews/CODE-REVIEW-1.md`.
   - Content reviewer: every sentence in `index.html` and the SVG traced to the brief; forbidden-claims list; dating and attribution of verification; team and AI credit; repo-link caveat; FSW not linked. Writes `work/reviews/CONTENT-REVIEW-1.md`.
4. **Fix loop:** findings routed to the owning role in section 1, then verify and both reviews rerun (`-2`, `-3`...). A request to change the forbidden list (C13) goes to the test-engineer with the content reviewer's sign-off.
5. Then DEV-VAL and the Validation Council per `CLAUDE.md`.

## Needs Ben (non-blocking, defaults above apply)
- Confirm the "interest in defense and space manufacturing" line is OK on a public page.
- Approve or replace the redrawn diagram before merge (brief asks for team-approved assets).
- Résumé download, `og:image`, custom domain: deferred.
