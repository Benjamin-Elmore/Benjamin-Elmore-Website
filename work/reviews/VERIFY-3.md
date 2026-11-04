# VERIFY-3: Verify step, queue 11-03-26 (after fix round 2)

- **Who / when:** test-engineer, 2026-11-03
- **Under test:** branch `dev-11-03-26` at `6f3c663` (working tree clean apart from this report). Local Python 3.14.6.
- **Scratch folder** (all screenshots, wrappers, Edge profiles and raw outputs):
  `C:\Users\Kyle\AppData\Local\Temp\claude\63a5ae193b538a83\422e17bb-5764-465e-a041-6e3401fe89d4\scratchpad\verify-3\te-verify3-165552\`
  Below, `<S>` stands for that folder.

## Summary

| Item | Result | Evidence |
|---|---|---|
| Self-test (`tools/test_check_site.py`) | **PASS** | 63 tests, 0 failures, 0 skipped (`RealDocsTest` ran) |
| C01-C19 (`tools/check_site.py`) | **PASS** (19/19) | exit 0, output below |
| CI on PR #1 | **PASS** | `site-checks / checks` pass (10s), run 41750327234, headSha `6f3c663`; PR head = local HEAD |
| Shot 1280 light | **PASS** (captured, theme confirmed) | `<S>\full-1280-light.png` |
| Shot 1280 dark | **PASS** (captured, theme confirmed) | `<S>\full-1280-dark.png` |
| Shot 360 light | **PASS** (captured, true 360px) | `<S>\full-360-light.png` |
| Shot 360 dark | **PASS** (captured, true 360px) | `<S>\full-360-dark.png` |
| VERIFY-2 #1: wide-diagram label spacing at 1280 | **PASS** | both "I²C" labels now sit clear of the box edges and arrowheads; "half-duplex" / "RS-485" sit above and below the arrow with clear space to the ESP32-S3 and VEX V5 Brain boxes. Mux sub-label now wraps to "multiplexed / I²C". `<S>\diagram-1280-light-x2.png`, `<S>\diagram-1280-dark.png` |
| VERIFY-2 #3: stacked diagram bottom space | **PASS** | panel 557px tall at 360; 24px from panel top to title ink, 18px from the VEX V5 Brain box to panel bottom (was ~60px). `<S>\diagram-360-light-x2.png`, `<S>\diagram-360-dark.png` |
| VERIFY-2 #4: repo link 44px hit area | **PASS** | visible box 219x20, but `elementFromPoint` hits the link from 18.5px above to 6px below the text: 44.5px tall at both widths (`::before` inset `-18px -4px -6px`). `<S>\measure-*.txt` (`repoLink`) |
| VERIFY-2 #5: header rule vs section rules at 1280 | **PASS** | header rule pixels x 324-955 (632px) at y=103, same as the section divider at y=656 (x 324-955), both themes. Header `border-bottom` is 0, rule is the background gradient. At 360 both span 0-359. |
| Sticky-header focus at 1280 (Tab to the toggle) | **PASS** | real Tab key events (CDP). Scrolled to y=3000 with focus in the pinned nav, Tab → toggle: header `top` 0px, toggle at (825, 8, 107x44), top-most element at its centre, `:focus-visible`, 3px focus ring visible. `<S>\focus-B-1280-light.png`, `<S>\focus-B-1280-dark.png`, `<S>\focus-result.txt`. See observation 1 (page scroll jump). |
| Stacked diagram height vs `<source>` (616), no distortion | **PASS** | `<source width="360" height="616">`; rendered 328 x 561.2, ratio 1.7111 = 616/360; wide img 584 x 219, ratio 0.375 = 360/960; `object-fit: fill` with matching ratios, so no stretch. Shots show round arrowheads and undistorted text. |
| Smallest diagram text | **PASS** (above the ~12px floor) | 360: stacked, smallest 17 units x 328/360 = **15.5px** (largest 20.0px). 1280: wide, smallest now 20 units x 584/960 = **12.2px** (was 13.4px in VERIFY-2; labels went from 22 to 20 units). See observation 2. |
| Horizontal scroll at 360 | **PASS** | `scrollWidth` = `clientWidth` = 360 in both themes; 0 elements extend past 360 |
| Toggle: aria-pressed / fixed label / persistence | **PASS** | `<S>\toggle-result.txt` |
| `<picture>` source selection | **PASS** | 360: `arc-architecture-stacked.svg`; 1280: `arc-architecture.svg`; source media now `(max-width: 719.98px)` |

"Shot PASS" means only that the capture worked and is valid. Taste is for the reviewers. Visual observations are listed at the end.

## 1. Self-test

`python -m unittest tools/test_check_site.py -v` gave `Ran 63 tests in 1.948s`, then `OK`. No skips; `RealDocsTest.test_real_docs_pass` ran against the real `docs/` and passed.

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
PASS C19 docs/ 40894 bytes, site.js 1391 bytes
```

## 3. CI

`gh pr checks 1 --repo Benjamin-Elmore/Benjamin-Elmore-Website` returned `checks pass 10s` (run 41750327234, job 126313534103). `gh run list` shows that run on headSha `6f3c6637b311…`, workflow `site-checks`, conclusion success; `gh pr view 1` headRefOid is the same SHA. Nothing was pending.

## 4. Visual capture: method

- Same as VERIFY-2. Headless Edge `--headless=new --disable-gpu --hide-scrollbars --allow-file-access-from-files`, separate `--user-data-dir` per run (`<S>\prof-*`).
- **True width:** `<S>\wrap.html?w=<360|1280>&theme=<light|dark>` loads `docs/index.html` in a `w`-px iframe (window `w+40` wide; PNG cropped to `w`). Inside the iframe `innerWidth` = `clientWidth` = 360 / 1280. Pixel at x=w-2 is page background and x=w+5 is wrapper grey (136,136,136), so the crop edge is the true page edge. The wrapper sets the diagram `img` to eager loading before measuring. This round the wrapper also records the `<source>` attributes, rendered vs viewBox ratio, the repo link's hit area (`elementFromPoint` scan) and the header background.
- **Theme forcing:** wrapper writes `localStorage.theme` and reloads the iframe. Confirmed: `data-theme` light/dark, body background `rgb(246,246,243)` / `rgb(15,18,21)`, PNG pixel (5,5) matches.
- Full-page heights: 8795px at 360, 6805px at 1280. Segments: `<S>\seg-360-<theme>-0..5.png` (1500px) and `<S>\seg-1280-<theme>-0..6.png` (1100px). I read all four full PNGs, all 26 segments, the four diagram crops, the two 2x crops (LANCZOS upscale of the 1x crop) and the focus shots. Raw uncropped captures are `<S>\raw-*.png`.
- **Diagram text size:** smallest `font-size` in the selected SVG x (rendered width / viewBox width). Stacked: 17-22 units, viewBox 360, rendered 328px → 15.5-20.0px. Wide: 20-30 units, viewBox 960, rendered 584px → 12.2-18.3px.
- **Focus test:** `<S>\focus_cdp.py` drives headless Edge over CDP (`Emulation.setDeviceMetricsOverride` 1280x800, so `innerWidth` = 1280) and sends real `Tab` / `Shift+Tab` key events. Log in `<S>\focus-result.txt`.
  - A: scroll to 3000, nothing focused, Tab → focus goes to the skip link and the page scrolls to 0 (expected document order); Tab x8 more reaches the toggle at scrollY 0, ring visible.
  - B (the stuck case): scroll to 3000, focus the pinned "Contact" nav link (`preventScroll`), Tab → toggle focused, header `top: 0px` (`:focus-within`), toggle fully on screen at y 8-52 and topmost, `:focus-visible` with a 3px `#0a58a8` (light) / `#6fb3f5` (dark) ring. Shots `<S>\focus-B0-1280-light.png` (Contact focused) and `<S>\focus-B-1280-<theme>.png`.
  - C: Shift+Tab back to Contact keeps row 1 shown; Tab past the toggle moves focus to the intro GitHub link and the header returns to `top: -52px` (row 1 hidden again). `<S>\focus-C-1280-<theme>.png`.

## 5. Theme toggle

`<S>\toggle.html` (real `.click()` plus reloads; log in `<S>\toggle-result.txt`). The headless environment reports `prefers-color-scheme: dark`.
1. Fresh load, nothing stored: dark, label "Dark theme", `aria-pressed=true`, visible.
2. Click → light, stored `light`, `aria-pressed=false`.
3. Reload → still light, `aria-pressed=false` (persisted).
4. Click → dark, stored `dark`, `aria-pressed=true`.
5. Reload → still dark, `aria-pressed=true` (persisted).

The label never changes; `aria-pressed` is true exactly when dark is on.

## 6. Visual observations and new defects (factual; reviewers judge severity)

1. **New: focusing the toggle in the stuck header scrolls the page.** At 1280, with the page at scrollY 3000 and focus on the pinned "Contact" link, Tab to the toggle moved the page to scrollY 2594 (406px up); Shift+Tab back to Contact moved it a further 20px (2574). The toggle itself stays visible and pinned, so the focus requirement holds; the content under the header jumps. Likely the browser scrolling the newly revealed row 1 clear of `scroll-padding-top: 4.5rem`. `<S>\focus-result.txt`, compare `<S>\focus-B0-1280-light.png` with `<S>\focus-B-1280-light.png`.
2. **Wide diagram text is smaller than in VERIFY-2.** The fix dropped the link labels and sub-labels from 22 to 20 units and box names from 26 to 24, so the smallest rendered text at 1280 is 12.2px (was 13.4px). It is above the ~12px floor CLAUDE.md sets for 360px and reads clearly in the shots. The floor is defined for 360, where the stacked diagram gives 15.5px.
3. **Diagram still uses one fixed navy palette in both themes** (VERIFY-1 #2, unchanged, not in this re-check list).
4. The repo link "Benjamin-Elmore/ARC on GitHub" still draws as 219x20 and the generic tap scan still lists it as under 44px; its actual hit area is 44.5px tall via `::before` (see summary).
5. No broken images, placeholder text, unstyled elements, clipping or overflow in any shot. Stacked sub-label now reads "optical and other external sensors" and fits inside its box at 360.
