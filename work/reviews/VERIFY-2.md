# VERIFY-2: Verify step, queue 11-03-26 (after fix round 1)

- **Who / when:** test-engineer, 2026-11-03
- **Under test:** branch `dev-11-03-26` at `17b6784` (working tree clean apart from this report). Local Python 3.14.6.
- **Scratch folder** (all screenshots, wrappers, Edge profiles and raw outputs):
  `C:\Users\Kyle\AppData\Local\Temp\claude\63a5ae193b538a83\422e17bb-5764-465e-a041-6e3401fe89d4\scratchpad\verify-2\te-verify2-164053\`
  Below, `<S>` stands for that folder.

## Summary

| Item | Result | Evidence |
|---|---|---|
| Self-test (`tools/test_check_site.py`) | **PASS** | 58 tests, 0 failures, 0 skipped (`RealDocsTest` ran) |
| C01-C19 (`tools/check_site.py`) | **PASS** (19/19) | exit 0, output below |
| CI on PR #1 | **PASS** | `site-checks / checks` pass (8s), run 41748533833, headSha `17b6784` |
| Shot 1280 light | **PASS** (captured, theme confirmed) | `<S>\full-1280-light.png` |
| Shot 1280 dark | **PASS** (captured, theme confirmed) | `<S>\full-1280-dark.png` |
| Shot 360 light | **PASS** (captured, true 360px) | `<S>\full-360-light.png` |
| Shot 360 dark | **PASS** (captured, true 360px) | `<S>\full-360-dark.png` |
| `<picture>` source selection | **PASS** | 360: `currentSrc` = `arc-architecture-stacked.svg`; 1280: `arc-architecture.svg` (`<S>\measure-*.txt`) |
| VERIFY-1 #1: diagram legibility at 360 | **PASS** | smallest text 15.5px at 360 (17 units x 328/360); 13.4px at 1280 (22 units x 584/960). `<S>\diagram-360-*.png`, `<S>\diagram-1280-*.png` |
| VERIFY-1 #3: tap targets (nav, toggle, name, GitHub/LinkedIn) | **PASS** | all nav links 44px tall, toggle 106.7x44, header name 125x44, hero/contact links and "MarketTesting on GitHub" 44px. One remaining under-44 element: inline sentence link "Benjamin-Elmore/ARC on GitHub" 219x20 (see note) |
| VERIFY-1 #4: nav at 360 | **PASS** | 3x2 grid, all six links inside x 16-306, nothing off-screen, no strip scroll (`<S>\seg-360-*-0.png`) |
| VERIFY-1 #5: alignment at 1280 | **PASS** | header name, nav, h1, every section title, card and footer text start at x=348; toggle right edge = 932 = content right edge; footer rule = section dividers (x 324-956) (`<S>\seg-1280-*-0.png`, `-6.png`) |
| VERIFY-1 #6: MarketTesting card gap | **PASS** | cards now stack in one column at 1280 (FSW 421px, MarketTesting 305px tall); link sits directly under the tags, no stretched gap (`<S>\seg-1280-light-5.png`) |
| VERIFY-1 #7: "My part:" spacing | **PASS** | lead-in to first bullet 12px, bullet to bullet 8px, at both widths (`<S>\seg-360-light-1.png`, `<S>\seg-1280-light-1.png`) |
| Toggle: aria-pressed / fixed label / persistence | **PASS** | `<S>\toggle-result.txt` |
| Horizontal scroll at 360 | **PASS** | `scrollWidth` = `clientWidth` = 360 in both themes; 0 elements extend past 360 |

"Shot PASS" means only that the capture worked and is valid. Taste is for the reviewers. Visual observations are listed at the end.

## 1. Self-test

`python -m unittest tools/test_check_site.py -v` gave `Ran 58 tests in 1.422s`, then `OK`. No skips; `RealDocsTest.test_real_docs_pass` ran against the real `docs/` and passed.

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
PASS C13 none of 34 forbidden phrases (0 allowed)
PASS C14 all 15 required facts present
PASS C15 ARC link in #arc, MarketTesting in #projects, no FSW link
PASS C16 13 tokens, 8 colors redefined in both dark blocks
PASS C17 lowest 5.95:1 (light --color-muted/--color-code-bg)
PASS C18 2 SVGs well-formed with title and desc; 2 architecture diagrams carry the labels
PASS C19 docs/ 39735 bytes, site.js 1219 bytes
```

## 3. CI

`gh pr checks 1 --repo Benjamin-Elmore/Benjamin-Elmore-Website` returned `checks pass 8s` (run 41748533833, job 126307554187). `gh run view` confirms headSha `17b678478cd5…`, workflow `site-checks`, conclusion success. Nothing was pending.

## 4. Visual capture: method

- Headless Edge `--headless=new --disable-gpu --hide-scrollbars --allow-file-access-from-files`, separate `--user-data-dir` per run (`<S>\prof-*`).
- **True width:** `<S>\wrap.html?w=<360|1280>&theme=<light|dark>` loads `docs/index.html` in a `w`-px iframe (window `w+40` wide; the PNG is cropped to `w`). Inside the iframe `innerWidth` = `clientWidth` = 360 / 1280. The pixel at x=358 is page background and x=365 is wrapper grey, so the crop edge is the true page edge. The wrapper sets the diagram `img` to eager loading before measuring.
- **Theme forcing:** the wrapper writes `localStorage.theme` and reloads the iframe. Confirmed each time: `data-theme` light/dark, body background `rgb(246,246,243)` / `rgb(15,18,21)`, and PNG pixel (5,5) matches.
- Full-page heights: 8792px at 360, 6806px at 1280. Segments: `<S>\seg-360-<theme>-0..5.png` (1500px each) and `<S>\seg-1280-<theme>-0..6.png` (1100px each). I read all four full PNGs, all 26 segments, the four diagram crops and the two 2x diagram crops. The uncropped raw captures were deleted after cropping.
- **Diagram text size:** an SVG inside `<img>` can't be queried, so the smallest rendered size is (smallest `font-size` in the selected SVG, inherited through groups) x (rendered width / viewBox width). Stacked SVG: smallest 17, largest 22 units, viewBox 360, rendered 328px → 15.5px to 20.0px. Wide SVG: smallest 22, largest 30 units, viewBox 960, rendered 584px → 13.4px to 18.3px.

## 5. Theme toggle

`<S>\toggle.html` (real `.click()` plus reloads; log in `<S>\toggle-result.txt`). The headless environment reports `prefers-color-scheme: dark`.
1. Fresh load, nothing stored: dark, label "Dark theme", `aria-pressed=true`, visible.
2. Click → light, stored `light`, label "Dark theme", `aria-pressed=false`.
3. Reload → still light, `aria-pressed=false` (persisted).
4. Click → dark, stored `dark`, label "Dark theme", `aria-pressed=true`.
5. Reload → still dark, `aria-pressed=true` (persisted).

The label never changes; `aria-pressed` is true exactly when dark is on. In the dark shots the pressed state also shows as accent text and border on a `--color-code-bg` fill.

## 6. Visual observations (factual; reviewers judge severity)

1. **Wide diagram at 1280: the link labels are tight.** The "I²C" labels between Sensors / I²C mux / ESP32-S3 sit in a gap of roughly 20px and nearly touch the box edges and arrowheads; "half-duplex" / "RS-485" fill the gap between ESP32-S3 and VEX V5 Brain (`<S>\diagram-1280-light.png`, `<S>\diagram-1280-dark.png`). They are legible (13.4px).
2. **The diagram still uses one fixed navy palette in both themes** (VERIFY-1 #2, not in this round's re-check list). The navy panel sits on the light page in light mode; in dark mode its lighter border separates it from the page. Unchanged.
3. **Stacked diagram:** the panel has about 60px of empty space under the VEX V5 Brain box, more than the space above the title (`<S>\diagram-360-light-x2.png`).
4. **Inline repo link** "Benjamin-Elmore/ARC on GitHub" (in the sentence under Open work) is 20px tall. It is an inline link in running text, the only element under 44px at both widths.
5. **At 1280 the header's bottom rule spans the full viewport (x 0-1280)**, while the section dividers and footer rule span x 324-956. All text edges line up at x=348.
6. No broken images, placeholder text, unstyled elements, clipping or overflow seen in any shot. No VEX V5 Brain empty-half issue in the new diagrams: both boxes now carry the "robot controller" sub-label.
