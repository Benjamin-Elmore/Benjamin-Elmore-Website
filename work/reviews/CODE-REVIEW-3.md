# CODE-REVIEW-3: code review, queue 11-03-26, round 3

- **Who / when:** code reviewer (read-only), 2026-11-03
- **Under review:** the fix-round-2 diff `git diff d1bcab9..6f3c663 -- docs tools .github` on branch `dev-11-03-26`. The later commits `d4789ed` and `526b4d5` touch only `README.md` and `work/`, so the code at the branch tip is the code reviewed. Context: `CODE-REVIEW-2.md`, `work/PLAN.md` (A1), `CONTENT-REVIEW-3.md` (C13 sign-off) and `VERIFY-3.md` (observation 1).
- **Re-ran:** `python tools/check_site.py` gives 19/19 PASS. `python -m unittest tools/test_check_site.py` runs 63 tests, OK. CI `site-checks` is green on `6f3c663`, `d4789ed` and `526b4d5`.
- **Scratch folder:** `C:\Users\Kyle\AppData\Local\Temp\claude\63a5ae193b538a83\422e17bb-5764-465e-a041-6e3401fe89d4\scratchpad\cr3-codereview-165635\` (written `<R>` below)
  - `<R>\docs-base\`: `docs/` at `6f3c663`. `<R>\tools\check_site.py`: the checker at `6f3c663`.
  - `<R>\mutate3.py` and `<R>\mutate3-out.txt`: every round-1 and round-2 probe (sections A to C), plus 18 new false-positive probes (D) and 13 new false-negative probes (E).
  - `<R>\cdp.mjs`: headless Edge driven over CDP (Chrome DevTools Protocol) with real mouse and keyboard input. The probes are `<R>\probe-*.mjs`, and their output is in `<R>\render\probe-*-out.json`.
  - `<R>\fix-has\`: `docs-base` with the CR3-1 fix applied (tested). `<R>\fix-sm\`: the same plus the CR3-3 fix (tested).
  - Screenshots: `<R>\render\click-docs-base-1-after.png` (CR3-1), `<R>\render\svgs-fonts.png` (diagrams in Segoe UI, Arial and Verdana), and `<R>\render\hdr-{light,dark}-{360,1280}.png`.

## Verdict: **CHANGES REQUIRED**

| Severity | Count | IDs |
|---|---|---|
| Blocker | 0 | none |
| Major | 1 | CR3-1 |
| Minor | 2 | CR3-2, CR3-3 |
| Nit | 5 | CR3-4 to CR3-8 |

All ten CR2 items are CLOSED except CR2-9, which is PARTIAL because its cosmetic bullet was deferred. The blocking problem is CR3-1. It comes from the `:focus-within` rule that I proposed in CR2-1. My claim there that "nothing changes for mouse users" was wrong. In Chromium, a mouse click on a nav link in the stuck header does nothing, and a second click lands on whatever row 1 has moved under the pointer. The fix is the same size, and I have tested it with real input. Once CR3-1 lands I would approve with minors.

---

## CR2 status

| ID | Status | Evidence |
|---|---|---|
| CR2-1 | CLOSED (but see CR3-1) | Tested with real Tab key events at 1280px after scrolling to y=3000 (`probe-focus-out.json`). Each Tab sets header `top: 0`. The name link is at y=8, the six nav links at y=52 and the toggle at y=8, and every one of them is `:focus-visible` and on screen. Nav-link rings have 52px of room above. The keyboard defect is fixed. The rule that fixed it causes CR3-1. |
| CR2-2 | CLOSED | `<span>@</span>`, `<!-- -->`, `<code>` local part and `&#64;` split are all caught (C11 now scans the `visible_text` and `svg_text` of every page, `check_site.py:1034-1041`), and so is a split on a second page (probe E). There is a self-test for each form. |
| CR2-3 | CLOSED | All 12 CR2 forms are caught (section B), plus U+2011, NBSP, `end-to-end-tested`, `In-production`, `release-ready`, `pre-release` and `hardware-validated` (section E). The content reviewer chose "release in every form" and signed it off (CONTENT-REVIEW-3). The false positives that fold creates are recorded in CR3-5. |
| CR2-4 | CLOSED (alternative accepted) | Instead of banning second pages, C11, C12 and C13 now run on every `*.html` page. A second page with "Proven", a phone number, an inline script or `tel:` fails, as do a phone in `title`/`aria-label`, in CSS `content` and in an inline `<style>` (sections B and E). A phone in a JS string still passes, which was accepted in CR2-4. |
| CR2-5 | CLOSED | Measured slack inside the box strokes, each side, in viewBox units (`probe-svg-out.json`). **Wide, Segoe UI:** at least 12.4. **Wide, Arial:** at least 13.5, which meets the 12u target. **Wide, Verdana:** at least 1.7 ("VEX V5 Brain"), so tight but nothing crosses a stroke (in CR2 it did). **Stacked title:** 60u spare in Segoe UI and 0.1u in Verdana, so it no longer clips. **Stacked file:** viewBox and `<source height>` are 616, and the bottom margin (24u) now matches the sides. Note that the wide sub-labels are now 20u, which renders at 12.17px at 584px. That passes A1's 12px floor with no headroom (see CR3-8). |
| CR2-6 | CLOSED | Tested over CDP with emulated `prefers-color-scheme`. **Modern browsers:** an OS dark/light change flips `aria-pressed`, and once the user has chosen, the choice holds. **`addEventListener` removed from `MediaQueryList.prototype`** (the old-Safari case): `addListener` is called once, OS changes still update the toggle, and the click handler works. **`window.matchMedia` undefined:** clicking still works. No exceptions in any case. `if (mq) a ? b : c;` parses as intended. |
| CR2-7 | CLOSED | A URL followed by a period and `arc-cv2.png` both pass now, as does "OpenCV and cv2". "release the lock" failing is now by design (CR2-3). `returns`, `non-deterministic`, `not deployed` and decimals in SVG text still fail, as accepted. The `cv` change opened a regression (CR3-2). |
| CR2-8 | CLOSED | `u\72l(//…)`, `image-set("//…")` and `meta refresh url=//…` are all caught, each with a self-test. The new CSS-string pass has a false positive (CR3-4). |
| CR2-9 | PARTIAL (remainder accepted) | The media-query seam is closed. `max-width: 719.98px` (`index.html:71`) and `min-width: 720px` (`site.css:744`) leave only (719.98, 720) uncovered, and no common zoom factor produces a width in that gap. Chromium rounds iframe widths to whole pixels (719.5 to 720), so I could not show this empirically. At 719px the stacked file shows with the 416px cap. At 720px the wide file shows at 584px. Still open: negative `top` assumes row 1 is 44px. This is cosmetic, appears only at very large default font sizes, and was deferred. The tab-order note needs no action. |
| CR2-10 | CLOSED | `cancel-in-progress: ${{ github.event_name == 'pull_request' }}` (`site-checks.yml:22`). Pushes to `main` now run to completion. |

---

## New findings

### CR3-1 (Major): at 720px and wider, a mouse click on a nav link does nothing once the header is stuck, and a second click hits the wrong control. Owner: style-engineer.

- **Where:** `site.css:760-762` (`.site-header:focus-within { top: 0; }`, inside `@media (min-width: 720px)`).
- **Evidence:** real CDP mouse events at 1280px, scrolled to y=1500 (`<R>\probe-click.mjs`, `probe-click-out.json`, screenshot `<R>\render\click-docs-base-1-after.png`):
  - Chromium focuses a link on `mousedown`. The header then matches `:focus-within` and jumps from `top:-52px` to `top:0`, and the nav row moves 52px down while the button is still held.
  - Trace for "ARC firmware": `mousedown>A:ARC firmware@y22`, `focusin>A`, `mouseup>site-header__name@y22`, `click>site-header`. The click goes to the common ancestor, so there is no navigation (`hash` stays empty, `scrollY` stays 1500). "Projects" and "Contact" behave the same way.
  - A second click in the same place hits row 1, which has moved under the pointer. On "ARC firmware" it hits the name link and goes to `#top`. On "Contact" it hits **the theme toggle and changes the theme**. On "Projects" it hits empty header space.
  - Row 1 then stays visible (104px header) after further scrolling, until the user clicks somewhere else.
  - This affects Chrome and Edge, and Firefox on Windows and Linux, which also focus links on click. Safari does not focus links on click, so it is unaffected. It breaks the site's primary navigation for most desktop mouse users at the main breakpoint.
- **Fix (tested in `<R>\fix-has\`):** replace the rule with
  ```css
  .site-header:has(:focus-visible) { top: 0; }
  @supports not selector(:has(*)) {
    .site-header:focus-within { top: 0; }
  }
  ```
  Results: the mouse clicks on all three links navigate on the first click (`#arc`, `#projects` and `#contact`), and the header stays at -52px. The keyboard Tab sequence is identical to the shipped CSS: header at 0, and name, links and toggle all on screen and `:focus-visible`. Browsers without `:has` (for example Firefox 115 ESR) fall back to today's behaviour, which is an acceptable residual. VERIFY-4 should add a real mouse click on a stuck nav link at 1280px. Calling `.click()` from a script does not reproduce this bug, because it never moves focus on mousedown.

### CR3-2 (Minor): C10 no longer catches a CV file name followed by digits, such as `Benjamin-Elmore-CV2026.pdf`. This is a regression. Owner: test-engineer.

- **Where:** `check_site.py:159`. `(?<![a-z])cv(?![a-z0-9])` was changed from `(?![a-z])` to let `arc-cv2.png` through (CR2-7).
- **Evidence:** `RESUME_NAME_RE` misses `assets/elmore-cv2026.pdf`, `assets/Benjamin-Elmore-CV2026.pdf` and `assets/ben_cv1.pdf`. The round-2 regex caught all three. The brief says the working résumé contains direct contact details, and C11 does not read PDFs, so C10 is the only guard.
- **Fix:** exclude only the OpenCV module name, `(?<![a-z])cv(?![a-z])(?!2(?![0-9]))`. I checked it: it catches `cv2026` and `cv.pdf` and passes `arc-cv2.png` and `opencv.svg`. Also consider failing on any `.pdf` under `docs/`, since the plan has none. Add a self-test for `cv2026.pdf`.

### CR3-3 (Minor): Tab from a pinned nav link to the toggle scrolls the page about 450px. This confirms VERIFY-3 observation 1 and gives its cause. Owner: style-engineer.

- **Where:** `site.css:750` (`html { scroll-padding-top: 4.5rem; }` in the 720px block).
- **Evidence (`probe-jump-out.json`):** at scrollY 3000 with focus on "Contact", one Tab to the toggle moves the page to 2544, and Shift+Tab back moves it to 2524. The results are the same with smooth and auto scrolling, and the same with the CR3-1 fix applied. The focused controls sit inside the sticky header at y=8 and y=52, which is inside the 72px scroll-padding band. Chromium therefore scrolls the document to clear them, but the header is stuck, so the controls never leave the band and the content underneath jumps.
- **Fix (tested in `<R>\fix-sm\`):** drop the `html` scroll-padding in the 720px block and put the offset on the targets instead: `main [id] { scroll-margin-top: 4.5rem; }`. With this change Tab to the toggle moves the page 8px instead of 456px, Shift+Tab moves it 0px, and nav clicks still land with the heading clear of the header. `#arc` lands 16px lower than today (scrollY 568 instead of 584). VERIFY-4 should re-shoot the anchor screenshots.

### CR3-4 (Nit): C08's new CSS-string pass rejects a decorative `content: "//"`. Owner: test-engineer.

- **Where:** `check_site.py:898-901`. Every quoted CSS string goes to `judge_value`, and `canonical_external("//")` returns `https://`.
- **Evidence:** section D. `.section__title::before { content: "// " }` in `site.css` fails C08 with "URL not on allowlist: https://". The same rule in an inline `<style>` also fails. A code-comment label is a plausible style edit for this monospace-accented design, and the error message points nowhere useful. `content: "\\"` would fail the same way, because backslashes become slashes.
- **Fix:** in the string pass, judge a value only if it has a host, for example skip it when `urlsplit(url).netloc` is empty. Alternatively, skip strings that sit in a `content:` declaration, since C11 and C13 already police those. Add a false-positive guard.

### CR3-5 (Nit): folding spaces and hyphens turns the T3 repo name into ordinary English. Owner: test-engineer, with content-reviewer sign-off.

- **Where:** `check_site.py:80` (`"ARC-Testing"`) together with `:1126-1128`.
- **Evidence:** section D. "ARC testing so far is a host build." fails C13 against rule `ARC-Testing`. T3 targets the local repository name. Its spaced form is a natural phrase for this case study, and the content reviewer's sign-off (CONTENT-REVIEW-3) did not cover it. The other false positives from the fold are honest negations that the content reviewer accepted: "not yet hardware tested", "has not been flight tested", "not fully tested". So are the release forms: "a CMake Release build", "release the bus", and the brief's own "verification before release" and "scopes release".
- **Fix:** make the entry `r"re:ARC-Testing\b"`. `re:` entries are not folded, and they are still case-insensitive. Optional false negative while you are there: "flight readiness" passes. Add `re:flight[-\s]+readiness\b` if the content reviewer wants it.

### CR3-6 (Nit): the header rule disappears in print and wherever the gradient declaration is dropped. Owner: style-engineer.

- **Where:** `site.css:219-221` and the print block (`:832` onward).
- **Evidence:** the rule renders exactly where intended. Pixel rows (`probe-hdr-out.json`) show it full-bleed below 616px and at x=52-667 (719px), 44-675 (720px), 324-955 (1280px) and 484-1115 (1600px), matching the `#arc` and footer rules pixel for pixel in both themes. But it is now a background image. Browsers drop backgrounds when printing by default, so the printed page loses the line under the name, while the section rules (borders) still print. In a browser that rejects `min()` in `background-size` (Chrome before 79, Safari before 11.1, Firefox before 75), the fallback keeps the background colour and no rule. That fallback is acceptable, because the rule is decorative.
- **Fix:** in `@media print`, add `.site-header { background: none; border-bottom: 1px solid var(--color-border); }`.

### CR3-7 (Nit): the repo link's invisible hit area works on one line, but it collapses when the link wraps. Owner: style-engineer.

- **Where:** `site.css:471-484`.
- **Evidence:** `probe-repo-out.json` runs `elementFromPoint` on every pixel of the box, with the `::before` on and off.
  - **One line (360, 720 and 1280px):** the hit area is 44px tall (box y 393-437 at 360px). It starts on the box's own top border, so it never leaves the box. It extends 4px each side, over the space before the link and the period after it. Every pixel it adds was the paragraph's own (`P`). It takes no clicks from `code` or any other control. It overlaps the next line's text box by about 2px, which is negligible. The focus ring stays on the text.
  - **Wrapped (320px, and 360px with a 20px default font):** "Benjamin-Elmore/ARC on GitHub" splits over two lines. The `::before` then takes its containing block from the first fragment's start (x=75) to the last fragment's end (x=80), so the extension is a 13px-wide strip (x 70-83, y 381-449) spanning both lines. It is harmless (546 px² of `P`, nothing interactive), but most of the link gets no extra height. The comment's "stretches its hit area to 44px" does not hold there. WCAG 2.5.8's inline exception still covers the link, so this is not a failure.
- **Fix:** amend the comment to say the extension only applies when the link sits on one line, and accept the behaviour. `white-space: nowrap` would keep the link on one line at 360px with a 20px default font, but at 320px with a 20px default it would overflow by about 23px, so I do not recommend it.

### CR3-8 (Nit): PLAN amendment A1 is out of date. Owner: lead / architect.

`work/PLAN.md:91` still says the wide SVG has "a minimum font of 22u (box names 26u or more)", `viewBox 0 0 360 640` and `media="(max-width: 719px)"`. After this round those are 20u and 24u, 616 and 719.98px. The governing rule ("12px or more at their target widths") still holds: 20u at 584px is 12.17px. Update A1 so validators check against the shipped numbers. Note in it that the wide sub-labels have no room to shrink further.

---

## Other review notes (no action)

- **Diagram geometry.** Every arrow in the wide file ends 3u from its boxes. The labels sit at the arrow midpoints (221, 411, 693). The badge (460-604) and the four names are centred on their boxes. Name plus sub-labels centre at about 226 in a 138-318 box. The stacked labels moved 2u right, which leaves a 20u gap to the arrows. `<source width="360" height="616">` matches the new viewBox, so there is no layout shift. Both files render cleanly in Segoe UI, Arial and Verdana (`svgs-fonts.png`). The narrower "I²C mux" box with "multiplexed / I²C" on two lines is a taste call that reads fine. The stacked "case study" pill is 0.7u tight in Verdana. That pill was not changed in this diff and is cosmetic.
- **Header gradient.** `background-size: min(100%, calc(var(--measure) + 2 * var(--gutter))) 1px`, centred at the bottom with `no-repeat`, is the right construction. The header has no border, so the padding-box bottom is the header bottom. The `var(--color-border)` inside the gradient follows `data-theme` switches (verified in both themes). `scrollWidth` equals the viewport at every width tested.
- **Checker changes.** The C12 multi-page logic resolves `../assets/site.js` from a nested page correctly and flags a root-relative `/assets/site.js` (and C07 flags it too). CSS escape decoding in `css_targets` handles code points above U+10FFFF. The meta-refresh parse is correct. None of the round-1 and round-2 false-positive guards regressed. The em dash fold does not create false positives in prose such as "real—world" or "time—real hardware".
- **Probe residuals unchanged and accepted:** `[at]` obfuscation, a fullwidth `＠`, a phone in a JS string, "proven" written by `site.js`, and the bare word "CV" in text.

## Routing summary

| Owner | Findings |
|---|---|
| style-engineer | **CR3-1 (Major, tested two-rule fix)**; CR3-3; CR3-6; CR3-7 |
| test-engineer | CR3-2; CR3-4; CR3-5 (with content-reviewer sign-off) |
| lead / architect | CR3-8 |

Next verify: a real-input (CDP) mouse click on each stuck nav link at 1280px, with the hash and scrollY recorded; Tab to the toggle from a pinned nav link, with the scrollY delta recorded; and the anchor screenshots again if CR3-3 lands.
