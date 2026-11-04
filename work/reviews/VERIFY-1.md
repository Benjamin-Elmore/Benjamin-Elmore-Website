# VERIFY-1: Verify step, queue 11-03-26

- **Who / when:** test-engineer, 2026-11-03
- **Under test:** branch `dev-11-03-26` at `89db530` (working tree clean apart from this report). Local Python 3.14.6.
- **Scratch folder** (all screenshots, wrappers, Edge profiles and raw outputs):
  `C:\Users\Kyle\AppData\Local\Temp\claude\63a5ae193b538a83\422e17bb-5764-465e-a041-6e3401fe89d4\scratchpad\verify-1\te-verify1-161823\`
  Below, `<S>` stands for that folder.

## Summary

| Item | Result | Evidence |
|---|---|---|
| Self-test (`tools/test_check_site.py`) | **PASS** | 41 tests, 0 failures, 0 skipped |
| C01-C19 (`tools/check_site.py`) | **PASS** (19/19) | exit 0, output below |
| CI on PR #1 | **PASS** | `site-checks / checks` SUCCESS on head `89db530` |
| Shot 1280 light | **PASS** (captured, theme confirmed) | `<S>\full-1280-light.png` |
| Shot 1280 dark | **PASS** (captured, theme confirmed) | `<S>\full-1280-dark.png` |
| Shot 360 light | **PASS** (captured, theme confirmed, true 360px) | `<S>\full-360-light.png` |
| Shot 360 dark | **PASS** (captured, theme confirmed, true 360px) | `<S>\full-360-dark.png` |
| Diagram at 360 | **FAIL** (legibility). Renders correctly, but the labels are about 6-10px | `<S>\diagram-360-light.png`, `<S>\diagram-360-dark.png` (2x: `*-x2.png`) |
| Theme toggle: hidden without JS | **PASS** | `<S>\nojs-result.txt`, `<S>\nojs-1280-top.png` |
| Theme toggle: toggles and persists with JS | **PASS** | `<S>\toggle-result.txt` |
| Keyboard tab order (DOM order) | **PASS** (read from DOM; no real key presses, so focus-ring visuals are UNRUN) | `<S>\measure-*.txt` (`tabOrder`) |
| Horizontal scroll at 360 | **PASS** | `scrollWidth` = `clientWidth` = 360 in both themes |

"Shot PASS" means only that the capture worked and is valid. Taste is for the reviewers. The visual defects I saw are listed at the end.

## 1. Self-test

`python -m unittest tools/test_check_site.py -v` gave `Ran 41 tests in 0.412s`, then `OK`. That covers 39 fixture tests: a valid fixture passes every check, at least one mutation per check ID C01-C19, no false positives, and the helpers. `RealDocsTest.test_real_docs_pass` also ran against the real `docs/` and passed (it was not skipped).

## 2. Site checks

`python tools/check_site.py` exited 0:

```
PASS C01 index.html parses, tags balanced, .nojekyll present
PASS C02 lang, charset, viewport, title, description, og:* ok
PASS C03 23 ids, all unique
PASS C04 8 in-page links resolve
PASS C05 7 sections in order, one h1, no heading skips
PASS C06 landmarks ok, skip link first
PASS C07 1 img ok, 3 local paths exist
PASS C08 8 external URLs, all allowlisted https
PASS C09 no FSW-UAV-SIM URL
PASS C10 no handoff/work-file references, no .md files
PASS C11 no email, phone, mailto: or tel:
PASS C12 only assets/site.js, no inline script/handlers/embeds
PASS C13 none of 31 forbidden phrases (0 allowed)
PASS C14 all 14 required facts present
PASS C15 ARC link in #arc, MarketTesting in #projects, no FSW link
PASS C16 13 tokens, 8 colors redefined in both dark blocks
PASS C17 lowest 6.46:1 (light --color-muted/--color-bg)
PASS C18 assets/arc-architecture.svg well-formed with title, desc and labels
PASS C19 docs/ 34810 bytes, site.js 1105 bytes
```

C01-C19: **PASS** each.

## 3. CI

`gh pr checks 1 --repo Benjamin-Elmore/Benjamin-Elmore-Website` returned `checks pass 5s` (run 41745725374, job 126298086479). `gh pr view 1` confirms the head is `89db530fdc8f…`, the workflow is `site-checks`, and the conclusion is SUCCESS. The PR is still a draft. Nothing was pending, so there was no wait.

## 4. Visual capture: method

- Headless Edge `--headless=new --disable-gpu --allow-file-access-from-files`, with a separate `--user-data-dir` per run (`<S>\prof-*`).
- **True width:** `<S>\wrap.html?w=<360|1280>&theme=<light|dark>` loads `docs/index.html` in a `w`-px-wide iframe. Inside the iframe, `innerWidth` = `clientWidth` = 360 and 1280 respectively (`<S>\measure-*.txt`). The 360 PNGs are exactly 360px wide, and their right edge shows page background, not wrapper grey.
- **Theme forcing:** the wrapper writes `localStorage.theme` in the iframe and reloads it, which is the same path the site's own persistence uses. I confirmed it took effect each time: `data-theme` is light or dark, and the computed body background is `rgb(246,246,243)` for light and `rgb(15,18,21)` for dark. The pixel at (5,5) of each PNG matches.
- Full-page height comes from a first measuring pass: 8004px at 360 and 6626px at 1280. I split the PNGs into segments (`<S>\seg-<w>-<theme>-<n>.png`) so I could read them at full resolution. I read all four full PNGs, all 20 segments and both diagram crops.
- **Capture artifact, not a site defect:** the 360 PNGs end with 10px of wrapper grey. The measuring pass ran without `--hide-scrollbars`, so the nav strip's thin horizontal scrollbar was included in the measured height.

## 5. Theme toggle and keyboard

- **No JS** (`<S>\nojs.html`: the page loads in an iframe with `sandbox="allow-same-origin"`, so its scripts can't run): `hidden=true`, `display=none`, size 0x0, and `data-theme` is unset. The page still followed the OS dark preference through the `prefers-color-scheme` block (`<S>\nojs-1280-top.png`, header with no button). `--blink-settings=scriptEnabled=false` with `--dump-dom` returned an empty DOM, so I used the sandbox method instead.
- **With JS** (`<S>\toggle.html`, real `.click()` on the button plus reloads; full log in `<S>\toggle-result.txt`):
  1. Fresh load with nothing stored. The headless environment reported prefers-dark, so the page was dark: label "Light theme", `aria-pressed=true`, button visible.
  2. Click → `data-theme=light`, stored `light`, light background, label "Dark theme", `aria-pressed=false`.
  3. Reload → still light (persisted).
  4. Click → dark, stored `dark`. 5. Reload → still dark (persisted).
- **Tab order** (DOM order of focusables, the same at 360 and 1280, no `tabindex`): Skip to content → Benjamin Elmore → ARC firmware → Experience → Projects → Skills → Education → Contact → theme button → GitHub → LinkedIn (hero) → Benjamin-Elmore/ARC on GitHub → MarketTesting on GitHub → GitHub → LinkedIn (contact). The order is logical, with the skip link first. I didn't press any keys, so focus-ring visibility is UNRUN here. `:focus-visible` exists in the CSS (C16).

## 6. Visual defects observed (factual; reviewers judge severity)

1. **Diagram labels are small at 360.** The SVG (viewBox 960 wide) renders 328px wide, a scale of 0.34. Label sizes come out at about 9.6px for the title, 7.5px for box names and 6.1px for sub-labels, "this work" and the link labels. That is below the roughly 12px rubric minimum. The ordered list under the figure repeats the same content as text at normal size. Crops: `<S>\diagram-360-*.png`.
2. **The diagram doesn't change with the theme.** The SVG has hard-coded colors, so a dark navy panel sits on the light page in light mode. In dark mode it is close to the page background. Both are visible in `seg-1280-light-0.png` and `seg-1280-dark-0.png`. The VEX V5 Brain box has no sub-label, so the bottom half of that box is empty.
3. **Tap targets are under 44px** (measured at 360): nav links 29px tall, theme button 32px (`min-height: 2rem`), header name 26px, inline GitHub/LinkedIn/repo links 20-21px.
4. **The nav at 360 scrolls sideways in its own strip.** "Skills" is cut off at the right edge, and Education and Contact sit off-screen until the strip is scrolled (`seg-360-*-0.png`). The page itself does not scroll horizontally. The only elements that extend past 360 are the nav `li`/`a` items at x 364-506.
5. **At 1280 the left edges don't line up.** The header name sits at x=24, while the content column starts at x=347. The footer rule spans x≈377-903, narrower than the section dividers (x≈323-957), and the footer text starts at x≈401, not at the content edge (`seg-1280-*-3.png`).
6. **The MarketTesting card at 1280** is stretched to the height of the FSW-UAV-SIM card. That leaves a tall empty gap between its tags and the "MarketTesting on GitHub" link, which is pinned to the bottom (`seg-1280-light-2.png`, `seg-1280-light-3.png`).
7. **The "My role" lead-in** ("…My part:") is followed by the bullet list with almost no gap, tighter than the spacing between the bullets (`seg-360-light-1.png`, `seg-1280-light-0.png`).
8. I saw no broken images, placeholder text, unstyled elements or clipped body text in any shot. Inline code chips wrap within the column at 360.
