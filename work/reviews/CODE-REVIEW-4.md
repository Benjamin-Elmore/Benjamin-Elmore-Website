# CODE-REVIEW-4: code review, queue 11-03-26, round 4

- **Who / when:** code reviewer (read-only), 2026-11-03
- **Under review:** the fix-round-3 diff `git diff cfa1b79..0012005 -- docs tools .github work/PLAN.md` on branch `dev-11-03-26` (HEAD is `0012005`; the working tree differs only in `work/RUN-STATE.md`). Context: `CODE-REVIEW-3.md` (CR3-1 to CR3-8) and `CODE-REVIEW-2.md`.
- **Re-ran:** `python tools/check_site.py` gives 19/19 PASS. `python -m unittest tools/test_check_site.py` runs 69 tests, OK (63 before this round, plus 6 new).
- **Scratch folder:** `C:\Users\Kyle\AppData\Local\Temp\claude\63a5ae193b538a83\5c9a8532-c9d3-4ba5-b4a4-8c9a4d4c95b8\scratchpad\cr4-codereview\` (written `<S>` below)
  - `<S>\docs-base\`: `docs/` at `0012005`. `<S>\docs-cfa\docs\`: `docs/` at `cfa1b79`. `<S>\tools\`: the checker at `0012005`.
  - `<S>\fix-em\`: `docs-base` with the CR4-1 breakpoint fix applied to `site.css` (tested).
  - `<S>\mutate4.py` and `<S>\mutate4-out.txt`: 30 checker probes for C08, C10 and C13 (expected fail or pass, and what the checker did).
  - `<S>\cdp.mjs`: the CR3 CDP (Chrome DevTools Protocol) harness, copied, driving headless Edge with its own `--user-data-dir` (`<S>\edge-prof`). The probes are `<S>\probe-geom.mjs`, `probe-ovf.mjs` and `probe-focus.mjs`, and their output is in `<S>\render\probe-*-out.json`. Default font sizes were set with `Page.setFontSizes`. Mouse and keyboard input are real CDP input events.
  - I did not run a visual pass, because the test engineer is doing that this round. No screenshots.

## Verdict: **APPROVE WITH MINORS**

| Severity | Count | IDs |
|---|---|---|
| Blocker | 0 | none |
| Major | 0 | none |
| Minor | 2 | CR4-1, CR4-2 |
| Nit | 2 | CR4-3, CR4-4 |

All eight CR3 items are CLOSED. The CR3-1 alternative, which sticks the whole header at `top: 0`, is correct and holds up better than the `:has()` fix I proposed. Its geometry never depends on focus, so mouse clicks, Tab and Shift+Tab all behave, and it also removes the CR2-9 remainder (the negative `top` that assumed row 1 was 44px). The header height formula is exact at every width from 720px to 2560px with default font sizes of 16px and 20px.

CR4-1 is older than this round. Probing the header at large default font sizes turned it up: with the browser's "Very large" (24px) setting, the nav row overflows and the page scrolls sideways between 720px and about 900px. CR4-2 is a small regression in the CR3-4 change: a `content: image-set("//host/...")` now gets past C08. Neither blocks, and both have small fixes.

---

## CR3 status

| ID | Status | Evidence |
|---|---|---|
| CR3-1 | CLOSED (alternative accepted) | `site.css:770-773` `.site-header { position: sticky; top: 0; }`. The `:focus-within` rule is gone and nothing in the header depends on `:focus`, `:hover` or `:active`. **Real mouse clicks** (`probe-focus-out.json` `navClicks`), at 1280x900 and scrolled to y=1500: all six stuck nav links navigate on the first click (`#arc` y=553, `#experience` 4001, `#projects` 4660, `#skills` 5620; `#education` and `#contact` stop at the page end, 5905). **Header height** (`probe-geom-out.json`, 720, 721, 768, 800, 960, 1024, 1280, 1600, 1920 and 2560px): 104px at a 16px default and 108px at 20px, equal to `2*--tap + 2*--space-2` at every width. Name and toggle share row 1 (y=8, both 44px tall) and the nav is one row at y=52. **Can the nav wrap?** No, at any width or font size. `.site-nav` is `flex: 1 0 100%`, so it always takes its own row and never sits beside the name. `.site-nav__list` is `display: flex` without `flex-wrap`, so it never makes a third row, but it can overflow sideways (CR4-1). Row 1 holds two short items and never wraps (checked up to a 32px default at 720px). **Large fonts:** see the notes. The formula drifts from a 24px default upwards, but nothing breaks. |
| CR3-2 | CLOSED (residual CR4-3) | `RESUME_NAME_RE` (`check_site.py:163`) catches `cv2026`, `CV2026`, `cv1`, `cv22`, `cv-2026`, `Elmore_CV_v2` and `cv.pdf`. It passes `arc-cv2.png`, `opencv.svg`, `opencv2.png` and `CV2-pipeline.png` (`mutate4-out.txt` and the new tests). The exemption for the bare `cv2` also lets `cv2.pdf` through (CR4-3). |
| CR3-3 | CLOSED | `html { scroll-padding-top: 0 }` from 720px. The header has no scroll margin. `probe-focus-out.json` `headerTabbing`: at y=3000, Tab from "Contact" to the toggle gives a 0px delta (it was 456px in CR3), and Shift+Tab back gives 0px. Shift+Tabbing through the rest of the header moves nothing until the skip link (as expected; see the notes). **Focus scrolling below the header still works.** With a main link placed at viewport y=60 (under the stuck header), Shift+Tab onto it scrolls it to y=112, which is the 104px header plus 8px of ring room (`shiftTabReveal`). The computed `scroll-margin-top` is 112px. **Specificity:** `main *` is (0,0,1) and `main > section[id]` is (0,1,2), so the 103px section rule wins over the 112px rule as intended, and section landings measure 0.7px to 1.3px under the header bottom (`sectionTopMinusHdr`), with the `h2` 72px clear. **Skip link:** it sits outside `main` and the header, so its own focus never scrolls. Enter goes to `#main` (whose margin clamps to y=0) and the next Tab reaches the first link in `main` with no jump (`skip`). **`#top`:** see the notes (it lands at y=1, which is harmless). |
| CR3-4 | CLOSED (regression CR4-2) | `content: "// "`, `content: '//'`, `content: "\\"` and `content: "//" attr(data-x) " //"` pass in `site.css` and in `<style>` (new test). `quotes: "//" "//"` passes, and a bare `"https://"` passes. Host-bearing strings outside `content:` still fail, including in a `style` attribute, a `--u:` custom property and `https:evil` without slashes. `CSS_CONTENT_RE` exists at module level (`check_site.py:1165`). It is defined after `c08` but resolved at call time, so the lookup works. `m.span(1)` starts at the first token of the value, so `lo <= m.start()` holds for the value's first string. `browser_url` (`:758`) strips tab, CR and LF and turns backslashes into slashes, so the `startswith("//")` test sees what `canonical_external` saw. `urlsplit` is stdlib and sees `https://` with an empty netloc, as the code assumes. The skip is too broad (CR4-2). |
| CR3-5 | CLOSED | `r"re:ARC-Testing\b"` is case-insensitive and not folded. It catches `ARC-Testing`, `arc-testing repo`, `ARC-TESTING`, U+2011, U+2010, an en dash (folded by `normalise` first), `ARC-Testing/CPPDev` and `ARC-Testing's`. It passes "ARC testing so far…", "ARC  testing", "ARC Testing", "ARC-Tests" and "ARC-Testingham". `ARC_Testing` passes, the same as in round 2, and it is not a plausible spelling. |
| CR3-6 | CLOSED | `site.css:866-870`: in print, `.site-header { position: static; background: none; border-bottom: 1px solid var(--color-border); }`, with the print `--color-border` of `#999999`. A border prints by default. Checked by code inspection only. |
| CR3-7 | CLOSED | The comment is amended at `site.css:472-478`, and the behaviour is accepted as CR3 recommended. |
| CR3-8 | CLOSED | `PLAN.md:91` now says 20u minimum, 24u box names, `viewBox 0 0 360 616` and `max-width: 719.98px`. All of these match the shipped SVGs (font sizes 20/22/24/30 wide, 17/20/22 stacked) and `index.html:71`. |

CR2 carry-over: the CR2-9 remainder (the negative `top` that assumed row 1 is 44px) is gone along with the negative `top`, so CR2-9 is now fully CLOSED.

---

## New findings

### CR4-1 (Minor): with a 24px default font ("Very large" in Edge and Chrome), the nav row overflows and the page scrolls sideways from 720px to about 900px. Owner: style-engineer (`site.css`), with the content-engineer for the one-line `<source>` change and the lead for PLAN A1.

- **Where:** `site.css:747` (`@media (min-width: 720px)`) together with `:782-785` (`.site-nav__list { display: flex; gap: var(--space-5); }`, which does not wrap). The bug predates this round: `<S>\docs-cfa` (at `cfa1b79`) gives the same numbers.
- **Evidence (`probe-ovf-out.json`):** with a 24px default, the nav list overflows by 122px at 720px and 42px at 800px, and the document scrolls sideways by 98px and 18px. "Contact" ends at x=818 in a 720px viewport, so it is off-screen in the stuck header. With a 32px default the page overflows by 363px at 720px, 123px at 960px and 3px at 1080px. Below 720px the phone grid is fine at 24px, and at 32px only 360px overflows (17px), which is a separate and accepted extreme. This hits rubric item 8 (no horizontal scroll, nav usable) for anyone who uses the preset large-font setting on a tablet-width or narrow desktop window. It is Minor, not Major, because the default setting is unaffected.
- **Fix (tested in `<S>\fix-em\`):** use an em breakpoint, so the desktop header only engages when the nav fits at the user's font size. Media-query `em` is based on the browser default font size, so 45em is 720px at 16px, 900px at 20px and 1080px at 24px.
  ```css
  @media (min-width: 45em) { … }          /* site.css:747, was 720px */
  ```
  ```html
  <source media="(max-width: 44.99875em)" …>   <!-- index.html:71, was 719.98px; same 0.02px seam at 16px -->
  ```
  Result in `fix-em`: zero overflow at every width tested for 16px and 24px defaults, and for a 32px default from 480px up. A 16px default is unchanged pixel for pixel (header 104px and sticky from 720px). At 24px the header stays in the phone layout up to 1079px and sticks from 1080px (112.6px, no overflow). Without the `<source>` change, a 24px-default user between 720px and 1079px would get the phone layout with the wide diagram, so ship both lines together. Update PLAN A1's breakpoint wording. Also update the fixture's `<source media>` at `test_check_site.py:60`, although no check reads it. Do not use `flex-wrap: wrap` on the nav instead: it adds a third header row, and the fixed `scroll-margin-top` calc would then be about 44px short.

### CR4-2 (Minor): the CR3-4 change lets `content: image-set("//host/x.png" 1x)` through C08, and that loads a third-party image. Owner: test-engineer.

- **Where:** `check_site.py:907-915`. Inside a `content:` span, any string whose `browser_url` starts with `//` is skipped, including strings nested in a function.
- **Evidence:** `mutate4-out.txt`. `.x::after{content:image-set("//evil.example/x.png" 1x);}` passes all 19 checks. In round 2 it failed, because every string was judged. Edge reports `CSS.supports('content', 'image-set("x.png" 1x)') === true` (`probe-focus-out.json` `supports`), so this is a real image fetch, not decorative text. A second, more contrived miss comes from the same regex having no left boundary: `CSS_CONTENT_RE` also matches `--icon-content:`, so `:root{--icon-content:"//evil.example/x.png"} .x{background-image:image-set(var(--icon-content) 1x)}` passes, while the same thing named `--u` fails. `content: url(//…)` and `content: image-set("https://…")` are still caught, by the `url()` pass and by the "not `//`" condition respectively.
- **Fix:** skip only top-level `content` strings. Judge the string when it sits inside an open parenthesis within its declaration:
  ```python
  in_content = any(lo <= m.start() < hi and css.count("(", lo, m.start()) <= css.count(")", lo, m.start())
                   for lo, hi in content_spans)
  ```
  For the C08 spans only, give the declaration a left boundary, `(?<![\w-])content\s*:`. Keep the shared `CSS_CONTENT_RE` as it is, because C11 and C13 read it. Add two must-fail self-tests: `content: image-set("//evil.example/x.png" 1x)` in `site.css` and the same rule in an inline `<style>`. The new `test_c08_round3_css_string_vectors` tests image-set outside `content` only, which is why this regression slipped through.

### CR4-3 (Nit): `cv2.pdf` and `Benjamin-Elmore-CV2.pdf` pass C10. Owner: test-engineer.

- **Where:** `check_site.py:163`. `(?!2(?![0-9]))` exempts `cv2` whatever the extension. It is the exemption I suggested in CR3-2, and round 2 missed these names too.
- **Evidence:** `mutate4-out.txt`. "CV2" is a plausible name for a second CV draft, and C10 is the only guard on a PDF (C11 does not read PDFs).
- **Fix:** apply the `cv2` exemption only to non-document extensions. Simpler still, and already suggested in CR3-2, fail any `.pdf` under `docs/`, since the plan ships none. Add `assets/Benjamin-Elmore-CV2.pdf` as a must-fail case. While there, `test_c10_opencv_names_pass` calls `RESUME_NAME_RE` directly. Run those names through `assert_all_pass` with a real file, so that the test covers C10's file walk and not only the regex.

### CR4-4 (Nit): the CSS-string pass does not decode CSS escapes, so `image-set("\2f\2f evil.example/x.png" 1x)` and `image-set("\68ttps://evil.example/x.png" 1x)` pass C08. Owner: test-engineer.

- **Where:** `check_site.py:905-915`. `css_targets` decodes escapes (`:851-855`) before it reads `url()` and `@import`, but the string pass works on the raw text. This behaviour predates this round. CR2-8 covered the escaped `u\72l(` form only.
- **Fix:** factor the two `re.sub` escape-decoding lines in `css_targets` out into `decode_css_escapes(css)`, and call it on `css` before `content_spans` and the string loop. Decoded `content: "\\"` is `\`, which `browser_url` still turns into `/`, so the CR3-4 guards keep passing. Add one must-fail test for each escaped form.

---

## Other review notes (no action)

- **Large default fonts against the scroll-margin calc.** Measured header heights against `2*--tap + 2*--space-2`: 104 = 104 (16px default), 108 = 108 (20px), 112.6 against 112 (24px; the nav row grows to 44.6px from the `li` line-box strut), 120 against 116 (28px; the name's line height passes 44px) and 136 against 120 (32px). So from 24px up, sections land 1.6px, 5px and 17px under the header instead of 1px. The `section` padding is in rem (`--space-8`: 4.5rem), so headings stay well clear. For focused elements, ring room shrinks from 0.5rem to 11.4px, 10px and 0px. That is acceptable. CR4-1's em breakpoint keeps 24px+ users out of the sticky layout below 1080px in any case.
- **`#top`.** The name link lands at scrollY 1, not 0, because `main > section[id]` (header - 1px) also matches the intro section, which has no top border to tuck. It is invisible, because the stuck header looks the same at 0 and at 1. An `#top { scroll-margin-top: 0 }` would tidy it, but it is optional.
- **Skip link and Shift+Tab to the top.** Shift+Tab from the header to the skip link scrolls to y=0. That is the skip link's own focus scroll (it is `position: absolute` at the top of the page), and it is expected.
- **Vertical space.** The desktop header now takes 104px instead of 52px all the time. On a 1280x720 screen at 125% scaling (about 1024x577 CSS px) that is 18% of the viewport. This is the price of the CR3-1 alternative, and I accept it. If a validator objects, a `and (min-height: 560px)` condition on the sticky rule is the lever, with the scroll margins moved into the same query.
- **Checker false positive kept:** `font-family: "//mono"` fails C08 ("https://mono"). It is not a plausible style, so no guard is needed.
- **Tests.** The C10 digit cases, the C13 positive and negative phrase sets (including U+2011 and "ARC-Testingham") and the decorative `content` guards test the intent, not the implementation. The gaps are the missing `content: image-set(//…)` negative (CR4-2) and the regex-only OpenCV test (CR4-3).
- **Residuals carried, unchanged and accepted:** `[at]` obfuscation, a fullwidth `＠`, a phone in a JS string, "proven" written by `site.js`, the bare word "CV" in text, `curriculum-vitae.pdf`, `presumed.png` failing C10 (no whole-word boundary on `resume`), and `ARC_Testing`.

## Routing summary

| Owner | Findings |
|---|---|
| style-engineer | CR4-1 (`site.css` breakpoint to `45em`) |
| content-engineer | CR4-1 (`index.html:71` `<source media>` to `44.99875em`, in the same change) |
| test-engineer | CR4-2; CR4-3; CR4-4 |
| lead / architect | CR4-1 (PLAN A1 breakpoint wording) |

Next verify, if CR4-1 lands: re-run the CR3-1 and CR3-3 real-input checks at 1280px (a first-click nav landing, and a 0px delta on Tab to the toggle). Add a 24px-default pass at 720px and 800px that records `scrollWidth - innerWidth` (expect 0), and confirm that the stacked diagram shows at 720px with a 24px default.
