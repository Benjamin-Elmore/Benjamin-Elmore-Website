# VERIFY-4: Verify step, queue 11-03-26 (after fix round 3)

- **Who / when:** test-engineer, 2026-11-03
- **Under test:** branch `dev-11-03-26` at `0012005` ("Fix round 3"). `docs/` and `tools/` are clean against HEAD. The only working-tree change is `work/RUN-STATE.md`, which is not mine. Local Python 3.14.6, Node v24, headless Edge.
- **Scratch folder** (screenshots, wrapper, probes, Edge profile, raw outputs):
  `C:\Users\Kyle\AppData\Local\Temp\claude\63a5ae193b538a83\5c9a8532-c9d3-4ba5-b4a4-8c9a4d4c95b8\scratchpad\te-verify4-184846\`
  Below, `<S>` stands for that folder and `<S>\render\` holds every PNG and JSON. The probes are adapted from CODE-REVIEW-3's `cdp.mjs` and `png.mjs` (copied, not edited in place). They serve a copy of `docs/` at HEAD (`<S>\docs\`) over a local HTTP server and drive Edge over CDP (Chrome DevTools Protocol) with real `Input.dispatchMouseEvent` / `Input.dispatchKeyEvent` input. Edge profile: `<S>\edge-prof\`.

## Summary

| Item | Result | Evidence |
|---|---|---|
| Self-test (`tools/test_check_site.py`) | **PASS** | 69 tests, 0 failures, 0 skipped (`RealDocsTest` ran). Was 63 in VERIFY-3, and the 6 new tests cover the CR3-2/4/5 checker fixes. |
| C01-C19 (`tools/check_site.py`) | **PASS** (19/19) | exit 0. C19 now reports 42038 bytes (was 40894). |
| CI on `0012005` | **PASS** | `site-checks` run 41763001353, headSha `0012005fcc06…`, job `checks` success (9s). PR #1 headRefOid = `0012005fcc06…` = local HEAD. Nothing pending. |
| CR3-1: one real mouse click on each stuck nav link (1280, from y=1500) | **PASS** (6/6 links, both themes) | Every link navigates on the first click. Header `top` is 0 before and after, and the theme never changes. Table in section 4.1. `<S>\render\probe-click-out.json` |
| CR3-3: Tab / Shift+Tab from pinned "Contact" to the toggle (1280, y=3000) | **PASS** | delta **0px** on Tab and **0px** on Shift+Tab, with both `scroll-behavior: auto` and smooth, in both themes (target under 16px; it was 406/20 in VERIFY-3). `<S>\render\jump-*.png` |
| Full header Tab sequence while stuck (1280, y=3000) | **PASS** | Forward: name, 6 nav links, then the toggle. Back: the reverse. Each one is on screen, topmost at its centre and `:focus-visible`, with its ring fully inside the viewport. scrollY stays at 3000 throughout. `<S>\render\tabseq-strip-{light,dark}.png` |
| Focus scrolling into main/footer clears the header | **PASS** | Tab from the toggle through every main and footer link, then Shift+Tab back: every focus ring top is at or below the header bottom (104) and on screen. `<S>\render\probe-maintab-out.json` |
| Anchor landings: heading clear of the header | **PASS** (6/6) | heading top is 71.7 to 73.3px below the header bottom for ARC, Experience, Projects, Skills and Education. For Contact (clamped by the page end) it is 370.8px below. |
| Anchor landings: no double divider | **FAIL (Minor, cosmetic)** | It holds for ARC, Experience, Projects and Skills: the section rule sits at 102.7 to 103.3, under the header rule. For **Education and Contact** the page end clamps the scroll, so the Education rule lands 1 to 56px under the header rule at viewport heights of about 800 to 860. At 1280x800 the two rules merge into a 2px line; at 1280x830 they are two lines 31px apart. See 4.4. |
| 719px: header static, no h-scroll | **PASS** | `position: static`, header 148px tall, scrolls away (top -1500 at y=1500). `scrollWidth` = `clientWidth` = 719. Stacked diagram. `<S>\render\w719-scrolled.png` |
| 720px: header sticky, no h-scroll | **PASS** | `position: sticky; top: 0`, 104px tall, top 0 at y=1500. `scroll-padding-top` 0, `#arc` `scroll-margin-top` 103px. `scrollWidth` = `clientWidth` = 720. Wide diagram. `<S>\render\w720-scrolled.png` |
| Shot 1280 light / dark | **PASS** (captured, theme confirmed) | `<S>\render\full-1280-light.png`, `<S>\render\full-1280-dark.png` |
| Shot 360 light / dark | **PASS** (captured, true 360px) | `<S>\render\full-360-light.png`, `<S>\render\full-360-dark.png` |
| Diagram crop 360 | **PASS** (captured) | `<S>\render\diagram-360-{light,dark}.png`, 2x: `<S>\render\diagram-360-{light,dark}-x2.png` |
| Visual appeal rubric (9 items) | **PASS** 9/9, no petitions | Section 5 |

"Shot PASS" means only that the capture worked and is valid. Section 5 grades the rubric.

## 1. Self-test

`python -m unittest tools/test_check_site.py -v` gave `Ran 69 tests in 2.864s`, then `OK`. There were no skips, and `RealDocsTest.test_real_docs_pass` ran against the real `docs/` and passed.

## 2. Site checks

`python tools/check_site.py` exited 0:

```
PASS C01 index.html parses, tags balanced, .nojekyll present
PASS C02 lang, charset, viewport, title, description, og:* ok
PASS C03 23 ids, all unique
PASS C04 8 in-page links resolve
PASS C05 7 sections in order, one h1, no heading skips
PASS C06 landmarks ok, skip link first
PASS C07 1 img, 1 picture ok, 4 local paths exist
PASS C08 14 external URL uses, all allowlisted https
PASS C09 no FSW-UAV-SIM URL
PASS C10 no handoff/work-file references, no .md or resume files
PASS C11 no email, phone, mailto: or tel:
PASS C12 only assets/site.js, no inline script/handlers/embeds
PASS C13 none of 35 forbidden phrases (0 allowed)
PASS C14 all 15 required facts present
PASS C15 ARC link in #arc, MarketTesting in #projects, no FSW link
PASS C16 13 tokens, 8 colors redefined in both dark blocks
PASS C17 lowest 5.95:1 (light --color-muted/--color-code-bg)
PASS C18 2 SVGs well-formed with title and desc; 2 architecture diagrams carry the labels
PASS C19 docs/ 42038 bytes, site.js 1391 bytes
```

## 3. CI

`gh run list --branch dev-11-03-26 -L 3`: all three are `completed success`. The newest, run 41763001353 (2026-11-04T02:47Z, 9s), has headSha `0012005fcc06e144b1b6864fa45e67a90853e4da` (`gh run view`), and its job `checks` succeeded. `gh pr view 1` headRefOid is the same SHA.

## 4. Real-input probes (headless Edge, CDP)

Method: `Emulation.setDeviceMetricsOverride` 1280x800 (`innerWidth` 1280), `scroll-behavior` forced to `auto` unless stated, theme set through `localStorage` and a reload. Clicks are `mouseMoved`, then `mousePressed`, then `mouseReleased` at the link's centre. Keys are `keyDown`/`keyUp` with Shift as modifier 8.

### 4.1 CR3-1: a single mouse click on each stuck nav link (`<S>\probe-click.mjs`)

The page was scrolled to y=1500 before each click. The header was `top: 0` before every click, and the click point is y=74 (row 2). The light and dark themes gave identical numbers.

| Link | Hash after 1st click | scrollY | Header top | Section top | Heading below header | Theme changed |
|---|---|---|---|---|---|---|
| ARC firmware | `#arc` | 553 | 0 | 103.2 | 72.2px | no |
| Experience | `#experience` | 4001 | 0 | 103.1 | 72.1px | no |
| Projects | `#projects` | 4660 | 0 | 102.7 | 71.7px | no |
| Skills | `#skills` | 5620 | 0 | 103.3 | 72.3px | no |
| Education | `#education` | 6005 (max) | 0 | 104.3 | 73.3px | no |
| Contact | `#contact` | 6005 (max) | 0 | 401.8 | 370.8px | no |

The event trace is the same for every link: `mousedown>A`, `focusin>A`, `mouseup>A`, `click>A`. The mouseup now lands on the same link, where in CR3-1 it went to the name link or the header. Nothing in the header moves on mousedown. Screenshots: `<S>\render\land-{arc,experience,projects,skills,education,contact}-1280-{light,dark}.png`.

### 4.2 CR3-3: Tab / Shift+Tab scroll deltas (`<S>\probe-kbd.mjs`, section A)

Setup: y=3000, then `focus({preventScroll:true})` on the pinned "Contact" link. Then a real Tab, then a real Shift+Tab, each followed by a 1.2s settle.

| Theme / scroll-behavior | Start | After Tab (toggle) | After Shift+Tab (Contact) | Deltas |
|---|---|---|---|---|
| light / auto | 3000 | 3000 | 3000 | 0 / 0 |
| light / smooth | 3000 | 3000 | 3000 | 0 / 0 |
| dark / auto | 3000 | 3000 | 3000 | 0 / 0 |
| dark / smooth | 3000 | 3000 | 3000 | 0 / 0 |

The toggle and Contact are each on screen, topmost and `:focus-visible` after the key press. Shots: `<S>\render\jump-0-contact-1280-{light,dark}.png` (before) and `<S>\render\jump-1-toggle-1280-{light,dark}.png` (toggle focused, ring visible, content unmoved).

### 4.3 Header Tab sequence while stuck (`<S>\probe-kbd.mjs`, section B)

Setup: y=3000, the skip link focused with `preventScroll`, then 8 real Tabs and 7 real Shift+Tabs. scrollY stayed at 3000 for all 15 steps, in both themes.

| Control | Box (x, y, w, h) | Ring box (top-bottom) | `:focus-visible` | Topmost | Ring in viewport |
|---|---|---|---|---|---|
| Benjamin Elmore | 348, 8, 125, 44 | 3-57 | yes | yes | yes |
| ARC firmware | 348, 52, 94.5, 44 | 47-101 | yes | yes | yes |
| Experience | 466.5, 52, 78.8, 44 | 47-101 | yes | yes | yes |
| Projects | 569.3, 52, 63, 44 | 47-101 | yes | yes | yes |
| Skills | 656.3, 52, 47.3, 44 | 47-101 | yes | yes | yes |
| Education | 727.6, 52, 70.9, 44 | 47-101 | yes | yes | yes |
| Contact | 822.5, 52, 55.1, 44 | 47-101 | yes | yes | yes |
| Dark theme (toggle) | 825.3, 8, 106.7, 44 | 3-57 | yes | yes | yes |

The ring is 3px solid with a 2px offset: `rgb(10,88,168)` in light and `rgb(111,179,245)` in dark. Ring bottoms (101) sit above the header rule (103), and no ring is clipped. That is confirmed visually in `<S>\render\tabseq-strip-light.png` and `<S>\render\tabseq-strip-dark.png`. The strips stack the 8 frames `<S>\render\tabseq-{0..7}-1280-{light,dark}.png`.

Extra checks:
- **Focus into content** (`<S>\probe-maintab.mjs`): Tab from the toggle through every link in main and the footer, then Shift+Tab back. Every focused link's ring top is at or below the header bottom (104), and the link is on screen. The only "miss" logged is the Tab wrap at the end of the document, which puts focus on the skip link without scrolling. That is a browser focus-cycling artifact, not a page defect.
- **Skip link** (`<S>\probe-skip.mjs`): from y=3000 with nothing focused, the first Tab focuses "Skip to content", scrolls to 0 and shows it at (24, 8), `:focus-visible`. `<S>\render\skip-firsttab-1280.png`, `<S>\render\skip-firsttab-360.png`.

### 4.4 Anchor landings and the divider (`<S>\rules.py`, `<S>\probe-heights.mjs`)

A pixel scan of rows 96-149 in each landing shot (more than 400 non-background pixels in a row counts as a rule) gives the following:
- ARC, Experience, Projects, Skills: **one** rule row, y=103, x 324-955 (632px), in both themes. The section's own top border sits at 102.7-103.3, so it is hidden under the header rule as intended. PASS.
- Education, Contact (1280x800): **two adjacent** rule rows, y=103 and y=104. The page cannot scroll far enough: the Education target is y≈6006.3 but the maximum scroll is 6005, so the Education border lands at 104.3, just under the header rule, and reads as a 2px rule. The zoom comparison is `<S>\render\rule-zoom-light.png` / `rule-zoom-dark.png`: ARC on top, Education below.
- **Viewport-height sweep, 1280 wide** (`<S>\render\probe-heights-out.json`). The Education divider position after clicking Education or Contact:

  | Viewport height | 700 | 768 | 800 | 810 | 830 | 900 | 1000 |
  |---|---|---|---|---|---|---|---|
  | Education rule | 103.3 (hidden) | 103.3 (hidden) | 104.3 (2px merge) | 114.3 | 134.3 | off band | off band |

  At heights from about 801 to 860px, the Education rule shows as a **second line 10 to 56px under the header rule**: `<S>\render\land-education-1280x830.png` (dark), and the Contact click looks the same. In this band the double divider that the 1px `scroll-margin` tweak is meant to hide does show.
- **Assessment:** the cause is the page-end scroll clamp, not the scroll-margin values. The same picture appears whenever a reader scrolls by hand to that position. It is cosmetic, the heading is always clear, and navigation works. I am reporting it as a Minor FAIL against the "no double divider" check. Reviewers judge severity.

### 4.5 719 / 720px

| Width | Header `position` / `top` | Header height | Header top at y=1500 | `innerWidth` / `clientWidth` / `scrollWidth` / body `scrollWidth` | Diagram |
|---|---|---|---|---|---|
| 719 | static / auto | 148 | -1500 (scrolled away) | 719 / 719 / 719 / 719 | stacked |
| 720 | sticky / 0px | 104 | 0 (stuck) | 720 / 720 / 720 / 720 | wide |

At 719, `html` keeps `scroll-padding-top: 16px` and `#arc` `scroll-margin-top: 0`. At 720 they are `0px` and `103px`. Shots: `<S>\render\w719-scrolled.png` and `<S>\render\w720-scrolled.png`. At 720 the stuck header lines up with the column, and the content scrolls cleanly under the rule.

## 5. Visual appeal check (CLAUDE.md)

### Method
- `<S>\wrap.html?w=<360|1280>&theme=<light|dark>` (VERIFY-3's wrapper, with the iframe `src` pointed at the served `docs/index.html`) loads the page in a `w`-px iframe. Edge's window is `w+40` wide, the iframe is resized to the full document height, the capture is `Page.captureScreenshot` with `captureBeyondViewport`, and the PNG is cropped to `w`.
- **True width:** inside the iframe, `innerWidth` = `clientWidth` = `scrollWidth` = 360 / 1280. Pixel x=w-2 is page background and x=w+5 is wrapper grey (136,136,136), so the crop edge is the true page edge.
- **Theme:** `data-theme` reads light/dark, the body background is `rgb(246,246,243)` / `rgb(15,18,21)`, and PNG pixel (5,5) matches.
- Full heights: 8795px at 360 and 6805px at 1280, the same as VERIFY-3. Segments: `<S>\render\seg-360-<theme>-0..5.png` (1500px) and `<S>\render\seg-1280-<theme>-0..6.png` (1100px). Uncropped captures: `<S>\render\raw-*.png`.
- **Read:** all four full PNGs, all 26 segments, the four diagram crops, both tab-sequence strips, 8 of the 12 landing shots plus the 1280x830 one, the jump, skip, 719/720 and rule-zoom shots. The four landing shots I did not open by eye (`land-arc-dark`, `land-experience-dark`, `land-projects-light`, `land-skills-dark`) have the same geometry as their theme twins in the pixel scan in 4.4.
- **Wrapper measurements** (`<S>\render\probe-full-out.json`): 0 elements overflow at 360 or 1280. At 360 the stacked diagram renders 328 x 561.2 with ratio 1.7111 = viewBox, smallest text **15.5px**. At 1280 the wide diagram renders 584 x 219, ratio 0.375 = viewBox, smallest text 12.2px. The only control under 44px is the repo link "Benjamin-Elmore/ARC on GitHub" (219x20), whose measured hit area is **44.5px** tall (`::before` inset `-18px -4px -6px`). All images complete.

### Rubric

| # | Item | Grade | Screenshot |
|---|---|---|---|
| 1 | First impression | **PASS**. Name, role line ("Computer science student and robotics software engineer"), a one-sentence pitch and the GitHub/LinkedIn links are above the fold at both widths. The ARC case study heading starts at y≈760 at 1280 and y≈880 at 360, right after the intro. | `seg-1280-light-0.png`, `seg-360-light-0.png` |
| 2 | Hierarchy | **PASS**. h1 48px, then section h2s with an accent bar, then h3 subsections, then lede with a left accent rule, then body and mono metadata. The ARC section is the longest and the only one with a diagram, decision cards and an evidence log, so it reads as the centerpiece. | `seg-1280-light-0..3.png` |
| 3 | Typography | **PASS**. About 70-character measure at 1280, comfortable line height, consistent weights. No orphaned single word in any heading. At 360, "Case study: ARC / firmware for ARSENAL" breaks into two balanced lines. | `seg-360-light-0.png`, `seg-1280-dark-0.png` |
| 4 | Spacing and alignment | **PASS**. One left edge (x=348 at 1280, 16 at 360) for header, sections, cards and footer. Section rules and the header rule share x 324-955. Even section padding. No cramped or floating blocks. | `seg-1280-light-5.png`, `seg-360-light-5.png` |
| 5 | Color | **PASS**. Neutral warm-grey / near-black grounds with one blue accent (section bars, links, timeline, card top borders, focus) plus the amber "case study" badge in the diagram. The dark theme uses lifted surfaces and a lighter blue, not a plain inversion. Carry-over: the diagram keeps one navy palette in both themes (VERIFY-1 #2). It reads as a deliberate dark figure panel on the light page. | `seg-1280-light-1.png`, `seg-1280-dark-1.png` |
| 6 | Components | **PASS**. Decision cards (accent top border, mono labels), evidence log (timeline dots, mono dates), the repo note box, project cards, tag pills and nav all share the radius, border colour and mono label style. | `seg-1280-light-2.png`, `seg-1280-light-4.png`, `seg-1280-light-5.png` |
| 7 | Diagram | **PASS**. At 360, the smallest text is 15.5px. Labels, arrows and the "case study" pill are crisp, with even margins, and the diagram sits well on both grounds. | `diagram-360-light-x2.png`, `diagram-360-dark-x2.png`, `diagram-360-{light,dark}.png` |
| 8 | Mobile | **PASS**. No horizontal scroll (`scrollWidth` 360, 0 overflowing elements). The nav is a 3x2 grid of 44px-tall targets, the toggle is 44px tall, and the repo link's hit area is 44.5px. | `seg-360-light-0.png`, `seg-360-dark-0.png` |
| 9 | Polish | **PASS**. No broken images, placeholder text, unstyled elements, overflow or stray borders in the full shots. The only stray-looking rule is the end-of-page double divider after an anchor jump, which shows only in the 801-860px viewport band (4.4, logged as a Minor FAIL there). It is not visible in the full-page captures. | `full-*.png`, `land-education-1280x830.png` |

### Judgement: is the 104px sticky header at 1280 heavy?
No. In my view it reads light. It is 104px tall, which is 13% of an 800px-tall viewport, 14.4% at 720, and about 11% at 950. It has no shadow or fill change: the page background, a bold name, a mono nav row in muted grey, an outlined toggle, and a 1px rule at column width. When stuck, the content cuts cleanly at the hairline (`jump-1-toggle-1280-light.png`, `jump-1-toggle-1280-dark.png`) and nothing competes with the reading column. The cost is real but modest. Two text rows are always pinned, and on a short laptop viewport (about 650px tall) that takes 16% of the height for a single-page site with only 6 links. If reviewers want it slimmer, the obvious move is a one-row header at 1280 (name, nav and toggle on one line fit easily in 584px plus gutters). That is a taste call, Minor, and it does not block.

## 6. Observations (factual; reviewers judge severity)

1. **End-of-page double divider (Minor):** see 4.4. The Education and Contact anchor landings at 1280 wide, viewport heights of about 800 to 860, show the Education section rule just under the header rule. `land-education-1280x830.png`, `rule-zoom-*.png`, `probe-heights-out.json`.
2. **After a mouse click, the nav link shows its hover state** (accent colour plus underline), because the pointer is still over it. That is expected and is not a "current section" indicator. `land-arc-1280-light.png`.
3. **The skip link's Enter at 1280** leaves scrollY at 0 and `document.activeElement` on `BODY` (`#main` has no `tabindex`). The next Tab still continues from main in Chromium. This is unchanged from earlier rounds and outside this round's scope.
4. The carry-overs from VERIFY-3 are unchanged: the wide diagram's smallest text is 12.2px at 1280, the diagram uses one navy palette in both themes, and the repo link is 219x20 visually with a 44.5px hit area.

## Verdict

**PASS with one Minor FAIL.** CR3-1 is fixed: every stuck nav link navigates on the first real click, and the theme never changes. CR3-3 is fixed: the Tab/Shift+Tab deltas are 0/0. The keyboard focus sequence, the 719/720 seam, the checks (69 tests, 19/19) and CI on `0012005` all pass, and the visual rubric passes 9/9. The open item is a cosmetic double divider at Education and Contact anchor landings in viewports about 800 to 860px tall, caused by the page-end scroll clamp. Nothing is UNRUN.
