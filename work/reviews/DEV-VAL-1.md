# DEV-VAL-1: change validation, queue 11-03-26

- **Who / when:** Opus change validator, 2026-11-03, read-only except for this file.
- **Scope:** `git diff e22552a..6926287` (27 files) on `dev-11-03-26`. The working tree is clean at `6926287`.
- **Read:** `CLAUDE.md`, `PORTFOLIO-CONTENT.md`, `work/reviews/FINDINGS-portfolio-findings.md`, `work/PLAN.md`, `work/RUN-STATE.md`, `CODE-REVIEW-4.md`, `VERIFY-4.md`, `CONTENT-REVIEW-3.md`, `README.md`, and every published file under `docs/`.
- **Scratch folder** (written `<S>` below): `C:\Users\Kyle\AppData\Local\Temp\claude\63a5ae193b538a83\5c9a8532-c9d3-4ba5-b4a4-8c9a4d4c95b8\scratchpad\devval1-185950\`
  - `<S>\docs\`: `git archive 6926287 docs`, served over local HTTP.
  - `<S>\cdp.mjs`, `wrap.html`, `png.mjs`, `probe-full.mjs`, `probe-click.mjs`, `probe-kbd.mjs`: copied from `te-verify4-184846` and not edited. `probe-seam.mjs` and `probe-seamdiag.mjs` are new.
  - `<S>\edge-prof\`: the Edge profile used here. `<S>\render\`: every PNG and JSON. `<S>\mut\`: checker mutation probes.

## Verdict: **SATISFIED**

There are no blocking petitions. Four Minor items are listed in section 7. They are taste or housekeeping, and none blocks the merge.

| Question | Answer |
|---|---|
| Site meets the plan | Yes (section 1) |
| Every claim traces to the brief, within its limits | Yes (section 2) |
| `docs/` leaks or links to `work/` or handoff files | No (section 3) |
| Checks and CI green, and they guard what they claim | Yes (section 4) |
| Earlier findings closed or explicitly accepted | Yes (section 5) |
| Fix round 4 (`45em` / `44.99875em`) safe at 719/720/721px at 16px, and at a 24px default | Yes (section 6) |
| Visual appeal check | Run, 9/9 PASS (section 8) |

---

## 1. Plan conformance

- **Skeleton (PLAN 2.1):**
  - Section order is `top, arc, experience, projects, skills, education, contact`, with one `h1` and no skipped heading levels.
  - The skip link is the first focusable element. The header holds the name, a labelled nav and a hidden toggle.
  - `site.js` loads in `<head>` without `defer`.
  - C05 and C06 PASS, and `index.html:17-258` agrees on reading.
- **ARC contract (2.4):**
  - The page has the problem, role, `<picture>` diagram, figcaption with `ol.figure__steps`, four `li.decision` cards using failure-mode / design-response `dl`s, a dated `evidence-list`, an "Open work" list and the repo note (`index.html:47-147`).
- **Diagram (2.5, A1):**
  - The wide SVG is 960x360 and the stacked SVG is 360x616. The `<source media="(max-width: 44.99875em)">` (`index.html:71`) matches PLAN A1 (`PLAN.md:91`) and the `@media (min-width: 45em)` rule (`site.css:747`). `site.css` has no other width breakpoint.
- **Remaining sections (2.6, 3):**
  - Experience, projects, skills, education and contact match the contract and the copy guidance.
  - FSW-UAV-SIM has no link. MarketTesting is linked. Skills have no duplicates. Contact offers only GitHub and LinkedIn.
- **Style obligations (2.7):**
  - C16 and C17 PASS. The lowest contrast is 5.95:1.
  - `site.js` is 32 lines and handles only the theme.
- **CI (section 4 of the plan):** `site-checks.yml` matches. It runs on `pull_request` and on push to `main`, pins Python 3.12, has a read-only token, and runs the self-test followed by the checker.

## 2. Claims against the brief

I read every visible sentence in `index.html` and both SVGs against `PORTFOLIO-CONTENT.md` as corrected by FINDINGS and the RUN-STATE B1-B6 defaults.

- **Forbidden claim classes:** there are no deployment, release, throughput, latency, timing, determinism, reliability or forecasting-accuracy claims.
  - MarketTesting says "I don't report forecast results" (`:187`).
  - The decision cards use design tense ("The architecture gives…", `:110`). Steps 3 and 4 say "In the design" (`:78-79`).
  - The diagram heading and caption say "Intended" and "has not had a hardware test yet" (`:74`).
- **Verification is dated and attributed:**
  - "November 3, 2026: A local check…" covers `CPPDev` at `3eb3ed6`, the flash mismatch (8 MB in the configuration, 2 MB in the SDK settings, board unchecked; C4), the RS-485-only entry point and "No hardware test was run" (`:129-130`).
  - "October 28, 2026: Commit `cef105f` … per the commit message. That message is the only evidence…" (`:133-134`).
  - FSW cites its "October 15, 2026 review of commit `f4f6229`", including the failures and the parts that weren't built (`:177`, N10/C6).
- **Team and AI credit:**
  - "The ARSENAL board is the team's work. The existing sensor code came from the team and from earlier reference code." (`:53`, C3).
  - Ben is "a firmware contributor" working with electrical and computer engineers (`:58`).
  - FSW is marked "AI-assisted implementation" and "AI agents did substantial implementation and review", with the mechanical engineer credited (`:176-177`, C5/B4).
- **Repo caveat (C1, C2, C8, B1):**
  - `:146` names the public `CPPDev` branch at `3eb3ed6` and says `main` is a different revision.
  - "ARC-Testing", SdBenE and team-org links don't appear, and no teammate is named (B2, B7).
- **Interests:** defense, space and manufacturing are stated as interests (`:39-40`), not experience. VEX leadership is limited to the stated roles ("Coordinate milestones…", "Help plan…").
- **Wording I checked and accept:**
  - "My spline and odometry work was left unfinished" (`:161`) is a fair plain-English reading of the brief's "had open items".
  - "Repository not public" (`:176`) follows from the brief's 404 public check and the "leave the link off" rule.
  - "Added explicit error propagation" is P9 / N4.
- The `<meta>` descriptions say "contributing C++ firmware for a board designed to link sensors…". That is within the brief.

## 3. Publication boundary

- `docs/` contains only `index.html`, `.nojekyll`, `assets/site.css`, `site.js` and the two SVGs.
- `grep -rniE "work/|PORTFOLIO|RUN-STATE|PLAN\.md|CLAUDE|FINDINGS|reviews|\.md\b" docs/` finds one match, the CSS header comment "Benjamin Elmore portfolio: site styles." (`site.css:2`). It is not a reference.
- No file is copied in from `work/` or the handoff files.
- **Mutation probes** (`<S>\mut\`, each run against a fresh copy of `docs/`):
  - `<a href="../work/PLAN.md">` fails C07 and C10.
  - `<a href="../PORTFOLIO-CONTENT.md">` fails C07 and C10.

## 4. Checks and CI

- `python tools/check_site.py`: 19/19 PASS, exit 0.
- `python -m unittest tools/test_check_site.py`: 73 tests, OK. That is 69 in VERIFY-4 plus 4 new tests for CR4-2, CR4-3 and CR4-4.
- **CI:** `site-checks` run 41764139262 has headSha `69262874…`, which is the tip, and concluded `success`. Both "Self-test the checker" and "Check the site in docs/" succeeded. PR #1 is a draft whose `headRefOid` is the same tip, with base `main`.
- **Do the checks guard what they claim?** My own probes (`<S>\mut\`) gave these results:
  - "It was deployed." fails C13.
  - "cut latency in half" fails C13.
  - `@import "//evil.example/a.css"` fails C08.
  - A CSS `url("https://evil…")` fails C08.
  - A third-party `<link rel=preconnect>` or stylesheet fails C08.
  - A `<meta http-equiv=refresh>` to an off-site URL fails C08.
  - A paraphrased claim ("dependable under load", "forecasts prices with high precision") passes C13. That is expected: PLAN section 4 assigns claim accuracy beyond the phrase list to content review, and README:42-47 says "examples", not "every claim".
  - The README's description of the checks (CT3-1 fixed at README:44) is accurate.

## 5. Earlier findings

| Item | Status | Evidence |
|---|---|---|
| CR4-1 (24px nav overflow) | CLOSED | `site.css:747` is `45em` and `index.html:71` is `44.99875em`, matching PLAN A1. Section 6 shows 0 horizontal scroll at every tested width and font size. |
| CR4-2 (`content: image-set("//…")`) | CLOSED | `top_level_content_strings` and `C08_CONTENT_DECL_RE` (`check_site.py:848-903`). 11 must-fail vectors × 2 locations, plus a style-attribute test. The decorative `content: "//"` forms still pass. |
| CR4-3 (`cv2.pdf`) | CLOSED | Any `.pdf` under `docs/` fails C10 (`check_site.py:1054-1059`). The OpenCV-name test now goes through the file walk. |
| CR4-4 (CSS escapes) | CLOSED | `decode_css_escapes` is shared by both passes. The `\2f\2f` and `\68ttps` vectors are in the new tests. |
| CR4 "next verify" request (re-run CR3-1 and CR3-3 after CR4-1) | DONE here | `<S>\render\probe-click-out.json`: 12/12 nav clicks navigate on the first click, and the theme never changes. `<S>\render\probe-kbd-out.json`: Tab and Shift+Tab deltas are 0/0 in both themes, with auto and smooth scrolling. |
| CR3-1 to CR3-8, CR2-9 | CLOSED | CODE-REVIEW-4 table. Re-confirmed for CR3-1 and CR3-3 above. |
| CT3-1 (README over-statement) | CLOSED | README:44 |
| CT3-2, CT3-3 (optional C13 narrowings) | Not applied (as intended) | They apply only if Ben wants that copy. |
| CT2-3 leftovers (PLAN flash wording, brief FSW verb) | Accepted, unpublished | `PLAN.md:123,125` still says "2 MB configured" and "flash configuration warning". The page is correct. |
| VERIFY-4 double divider (Minor FAIL) | ACCEPTED by the lead | RUN-STATE "Lead notes (fix round 3)" |
| CODE-REVIEW-4 residuals (`[at]`, fullwidth `＠`, JS phone, etc.) | ACCEPTED | CODE-REVIEW-4 notes |
| FINDINGS C1-C8, N1-N13, B1-B7 | Reflected on the page or defaulted in RUN-STATE | Section 2 |

## 6. Fix round 4 seam (em breakpoint)

`<S>\probe-seam.mjs` sets the default font size with `Page.setFontSizes` and the width with `setDeviceMetricsOverride`, in both themes, then measures with `matchMedia`. The raw output is in `<S>\render\probe-seam-out.json`.

| Default font | Width | `min-width:45em` | `max-width:44.99875em` | Header | Header h | Diagram (min text) | h-scroll | Overflowing elements |
|---|---|---|---|---|---|---|---|---|
| 16px | 719 | false | true | static, scrolls away | 148 | stacked 416px (19.6px) | 0 | 0 |
| 16px | 720 | true | false | sticky, top 0 at y=1500 | 104 | wide 584px (12.2px) | 0 | 0 |
| 16px | 721 | true | false | sticky | 104 | wide 584px (12.2px) | 0 | 0 |
| 24px | 719 / 720 / 721 | false | true | static (phone grid) | 157.2 | stacked 624px (29.5px) | 0 | 0 |
| 24px | 1079 | false | true | static | 157.2 | stacked 624px | 0 | 0 |
| 24px | 1080 / 1081 | true | false | sticky | 112.6 | wide 876px (18.3px) | 0 | 0 |
| 20px | 899 / 900 / 901 | false / true / true | true / false / false | static / sticky / sticky | 152 / 108 / 108 | stacked / wide / wide | 0 | 0 |

- **The two queries never disagree.** Exactly one of them matches at every tested width, so the diagram swaps on the same pixel as the header.
- **Nav overflow** is 0 everywhere, and no header control is shorter than 44px. `#arc` `scroll-margin-top` is 0 in the phone layout and 103, 107 and 111px in the sticky layout.
- **Shots:**
  - `<S>\render\seam-16px-{719,720,721}-*-top.png` and `seam-16px-{719,720}-light-diagram.png`, `seam-16px-721-dark-diagram.png`.
  - `seam-24px-{720,1079,1080}-*-top.png` and `seam-24px-{720,1080}-light-diagram.png`, `seam-24px-1079-dark-diagram.png`.
  - All read by eye. 16px at 720/721 is identical to the pre-fix 720px layout in VERIFY-4.

## 7. Petitions

All four are Minor and none blocks the merge.

### DEV-VAL-1.1 (Minor, taste): compound tech terms break at their hyphen
- **Evidence:**
  - "ESP-" / "IDF" in the My role list at 360px (`<S>\render\seg-360-light-1.png`, `index.html:61`).
  - "RS-" / "485" in the October 28 entry at 360px (`seg-360-light-4.png`, `index.html:134`).
  - "Level-2 S-" / "function" in the FSW card at 1280px (`seg-1280-light-4.png`, `index.html:177`).
- **Owner:** content-engineer (markup) and style-engineer (one rule).
- **Fix:** wrap these terms in `<span class="nowrap">` and add `.nowrap { white-space: nowrap; }`. Don't use U+2011, because the checker's normalisation and the C14 required facts ("half-duplex RS-485") match on ASCII hyphens.

### DEV-VAL-1.2 (Minor, housekeeping): the checker fixture still has the old seam
- **Evidence:** `tools/test_check_site.py:60` reads `<source media="(max-width: 719px)" … height="640">`. The shipped values are `44.99875em` and `616`. CR4-1 asked for this update, and no check reads the value.
- **Owner:** test-engineer.
- **Fix:** change it to `media="(max-width: 44.99875em)"` and `height="616"`.

### DEV-VAL-1.3 (Minor, taste): with a 24px default, the stacked diagram is taller than the viewport
- **Evidence:** between 720px and 1079px at a 24px default, the stacked SVG renders at 624 x 1068px, taller than a 900px viewport (`<S>\render\seam-24px-1079-dark-diagram.png`). It is legible, but the comment at `site.css:495` says "Capped … so the tall version stays in view".
- **Owner:** style-engineer.
- **Fix (optional):** add a viewport cap to `.figure--diagram img`, for example `max-width: min(26rem, calc((100vh - 4rem) * 360 / 616))`. Otherwise, reword the comment.

### DEV-VAL-1.4 (Minor, housekeeping): PLAN flash wording lags the page
- **Evidence:** `work/PLAN.md:123,125` says "2 MB configured" and "resolving the flash configuration warning". The page says "the SDK settings report 2 MB" and "checking the board's actual flash size" (CT2-3 leftover). The PLAN is unpublished.
- **Owner:** lead.
- **Fix:** copy the page wording into PLAN section 3.

## 8. Visual appeal check (CLAUDE.md)

### Method
- Headless Edge (`C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`), with its own profile `<S>\edge-prof\`, driven over CDP. `<S>\docs\` is served over local HTTP.
- `wrap.html?w=<360|1280>&theme=<light|dark>` loads the page in a `w`-px iframe sized to the full document height. The capture is cropped to `w`.
- **True width:** inside the iframe, `innerWidth` = `clientWidth` = `scrollWidth` = 360 / 1280. The crop edge pixel is page background (246,246,243 light; 15,18,21 dark), and the wrapper grey starts at x=w+5. The theme was confirmed from `data-theme` and the body background (`<S>\render\probe-full-out.json`).
- **Shots:**
  - `<S>\render\full-360-light.png`, `full-360-dark.png`, `full-1280-light.png`, `full-1280-dark.png`.
  - Diagram crops: `<S>\render\diagram-360-light.png`, `diagram-360-dark.png`, and 2x versions `diagram-360-{light,dark}-x2.png`.
  - Segments for close reading: `<S>\render\seg-360-<theme>-0..7.png` and `seg-1280-<theme>-0..6.png`.
- **What I read:** all four full shots, both diagram crops, 360 light segments 0-7, 360 dark segments 0 and 6, 1280 segments light-0, dark-1, light-2 and light-4, and the 12 seam shots in section 6.
- **Measurements:** 0 overflowing elements at 360 and 1280. All images are complete. At 360 the stacked diagram is 328 x 561.2 with its smallest text at **15.5px**. At 1280 the wide diagram's smallest text is 12.2px. The only link shorter than 44px is the repo link (219x20), and its measured hit area is 44.5px.

### Rubric

| # | Item | Grade | Screenshot |
|---|---|---|---|
| 1 | First impression | **PASS**. The name, mono role line, a one-sentence pitch and the GitHub/LinkedIn links fill the first screen at both widths. "Case study: ARC firmware for ARSENAL" follows straight after the intro, with its accent bar and quoted summary. | `seg-1280-light-0.png`, `seg-360-light-0.png` |
| 2 | Hierarchy | **PASS**. The rank runs h1, then h2 with accent bar, then h3, then lede, body and mono meta. ARC is the longest section and the only one with a diagram, numbered decision cards and an evidence timeline, so it reads as the centerpiece. | `full-1280-light.png`, `seg-1280-light-2.png` |
| 3 | Typography | **PASS**. The measure is about 70 characters at 1280, line height is comfortable, and sizes and weights are consistent. No heading has an orphaned word; "Case study: ARC / firmware for ARSENAL" breaks into two balanced lines at 360. Nits are in DEV-VAL-1.1. A taste-level note with no petition: the 1280 FSW card meta leaves "public." alone on a line. | `seg-360-light-0.png`, `seg-1280-light-4.png` |
| 4 | Spacing and alignment | **PASS**. Everything shares one left edge (x=348 at 1280, 16 at 360) across header, sections, cards and footer. The section rules match the header rule's width, and padding is even from section to section. No block is cramped or floating. | `seg-1280-light-0.png`, `seg-360-light-6.png` |
| 5 | Color | **PASS**. A warm off-white or near-black ground with a single blue accent, used for section bars, links, the timeline, card top borders and focus. The dark theme lifts its surfaces and lightens the blue, so it isn't a plain inversion. The navy diagram panel and amber "case study" pill read as a deliberate figure in both themes. | `seg-1280-dark-1.png`, `seg-360-dark-0.png` |
| 6 | Components | **PASS**. Decision cards (accent top border, mono labels), the evidence timeline (dots, mono dates), the repo note box, project cards, tag pills and nav share the same radius, border and mono-label system. | `seg-1280-light-2.png`, `seg-360-light-4.png`, `seg-360-light-6.png` |
| 7 | Diagram | **PASS**. At 360 the smallest text is 15.5px. Labels, arrows and the pill are crisp, the panel stroke shows on the dark page, and the margins are even. The wide version at 720 and 1280 keeps 12.2px minimum text. | `diagram-360-light-x2.png`, `diagram-360-dark.png`, `seam-16px-720-light-diagram.png` |
| 8 | Mobile | **PASS**. `scrollWidth` is 360 with 0 overflowing elements. The nav is a 3x2 grid of 44px targets, the toggle is 44px, and the repo link's hit area is 44.5px. | `seg-360-light-0.png`, `seg-360-dark-0.png` |
| 9 | Polish | **PASS**. No broken images, placeholder text, unstyled elements, overflow or stray borders. The accepted end-of-page double divider (VERIFY-4 4.4) doesn't show in full-page captures. | `full-*.png` |

**Bar:** the page reads as a carefully made engineering portfolio, not a default template. Nothing looks broken, unfinished or hard to read.
