# Content review 3: round-2 fixes, both SVGs, C13 changes, README

Reviewed November 3, 2026, read-only, at `dev-11-03-26` `6f3c663`. The fix diff is `git diff 6bf5bb4..6f3c663 -- docs tools/check_site.py`.

**Sources:** the same as round 2: `work/reviews/FINDINGS-portfolio-findings.md`, the B1-B7 defaults in `work/RUN-STATE.md`, `PORTFOLIO-CONTENT.md` with its 2026-11-03 correction note, and `work/PLAN.md` section 3.

**Checker:** `python tools/check_site.py` passes all 19 checks locally. C13 now has 35 forbidden phrases and an empty `ALLOW`. C14 has 15 required facts.

---

## 1. Round-2 items

| ID | Status | Evidence |
| --- | --- | --- |
| CT2-1 stacked sensor label | CLOSED | The stacked label (`<text x="42" y="138">`) and the stacked `<desc>` both read "optical and other external sensors". That now matches the wide SVG, step 1 and the brief. The font size stays at 17, as asked. The label is 34 characters, starting at x=42 inside a box whose inner edge is at about x=334. By estimate it fits, but VERIFY should confirm it at 360px in both themes. |
| CT2-2 "MEX build were not built" | CLOSED | The FSW card now reads "…and the native C++ tests and the MEX file were not built." This is the text I proposed, word for word, and it matches N10. |
| CT2-3 stale PLAN bullets (lead) | CLOSED (confirmed), with one optional leftover | The PLAN section 3 FSW-UAV-SIM bullet now matches my proposed text word for word: coordinate wording, mechanical engineer and AI agents credited, and October 15, 2026 review of `f4f6229`. The over-claim risk is gone. The smaller lag is still there. PLAN Open work still says "resolving the flash configuration warning", and the PLAN verification bullet says "2 MB configured". The page says "the SDK settings report 2 MB" and "checking the board's actual flash size". The brief's FSW bullet (line 40) still says "leads and orchestrates" and has no correction note. Neither is published, and the page is correct, so these don't block. The lead can tidy them if they want to. |

---

## 2. SVG visible text (round 3)

The round-2 diff changed only the wide SVG's geometry and font sizes. The words are the same, except that the I²C mux sub-label now wraps as "multiplexed" / "I²C" instead of one line.

| Element | Wide (`arc-architecture.svg`) | Stacked (`arc-architecture-stacked.svg`) | Source |
| --- | --- | --- | --- |
| `<title>` | ARC intended system architecture | same | brief "intended system architecture" |
| Heading | Intended system architecture | same | same |
| Sensors | "optical and other" / "external sensors" | "optical and other external sensors" | brief, step 1 |
| I²C mux | "multiplexed" / "I²C" | "multiplexed I²C" | brief "multiplexed I²C" |
| ESP32-S3 | "ARC firmware on" / "ARSENAL board" | "ARC firmware on ARSENAL board" | brief, step 3 |
| VEX V5 Brain | "robot controller" | same | brief positioning line (ruled in round 2) |
| Pill | case study | case study | CT1-12 |
| Links | I²C, I²C, "half-duplex" / "RS-485" | I²C, I²C, "half-duplex RS-485" | brief, C14 |
| Arrows | one-way, one-way, two-way | same | brief, step 4 |
| `<desc>` | "left to right: optical and other external sensors…" | "top to bottom: optical and other external sensors…" | otherwise identical |

**Result:** the two SVGs now say the same thing, word for word. The only differences are line breaks and "left to right" versus "top to bottom". Both match the alt text, the figcaption steps and the brief. Splitting "multiplexed" from "I²C" changes no meaning, because the box title "I²C mux" sits directly above. Neither SVG makes a status claim. The heading still says "Intended".

---

## 3. C13 changes: sign-off

I probed each change against copy Ben is likely to want, using `phrase_regex` on `normalise`d text:

| Change | Ruling | Likely copy it blocks | Rephrase available |
| --- | --- | --- | --- |
| `releas(?:e[sd]?\|ing)` (every form) | **Signed off** | "release the lock" (the brief's decision row says "scopes release"). "verification before release" (brief line 11, an *interest*, not a claim). "pre-release". | Yes. The page already says "scopes the lock". For the interest, "verification before shipping" or "verification before hand-off" works. See CT3-2. |
| Spaces and hyphens equivalent | **Signed off** | "has not been hardware tested" and "not flight ready". These are honest negations, and their hyphenated forms were already blocked. | Yes. The page's existing wording "has not had a hardware test" is the pattern to use. |
| `prov(?:e[nsd]?\|ing\|abl[ey])` | **Signed off** | None found. "unproven", "improve", "provide" and "provenance" all still pass. | n/a |
| `validat(?:e[sd]?\|ing)` | **Signed off** | "the checker validates JSON parameter files". That describes a function and could be accurate, but it reads as a claim. "validation" still passes (N6 "hardware validation remain open"). | Yes: "checks". The page already uses "interface and rule checks". |
| `production[-\s]+grade` | **Signed off** | None. There is no honest use on this page. | n/a |
| `—` (em dash) folded to `-` | **Signed off** | None found | n/a |

**Overall:** I sign off on all of the test engineer's C13 changes. None of them blocks copy that can't be rephrased in plain words, so I'm not proposing an `ALLOW` entry. Note that `ALLOW` exempts a phrase everywhere, so allowing the `releas…` regex would reopen "released". If a context exemption is ever needed, it should be a narrowing of the pattern, not an `ALLOW` entry (CT3-2).

**Pre-existing entries this round made more visible** (no change needed now, and none blocks the page):
- `in production` matches "an interest in production test equipment". The brief (line 33) maps Ben's work to "production test equipment", and an intro line along those lines is plausible. "production test equipment" on its own passes. See CT3-3.
- `returns` matches "the read call returns an error". That's plausible if Ben expands the "Added explicit error propagation." bullet. Rephrase as "reports an error" or "passes the error back".

---

## 4. README.md (repo root, not published)

I re-read the whole README against the brief, the findings and the page. Most of it is consistent:
- The positioning ("embedded firmware for physical systems") matches the brief.
- "ARC, the C++ sensor firmware for the CBU1 VEX U team's ARSENAL board" matches the page's problem paragraph and the team credit.
- It names no teammates, has no vault paths and gives no contact detail beyond GitHub and LinkedIn (B7).
- FSW-UAV-SIM appears only as the name of the dev cycle, with no link (C09/B4).
- The trigger claim ("every pull request and every push to `main`") matches `.github/workflows/site-checks.yml`.
- "No framework, build step, external script, web font or analytics" matches C12, C08 and PLAN.
- "The facts come from `PORTFOLIO-CONTENT.md`, as corrected by `FINDINGS…`" is accurate.

There is one over-statement, CT3-1.

---

## 5. New findings

### CT3-1 (Minor, README): "every fact is dated and attributed" over-states the checks (lead or README owner)
- **Current:** "The checks enforce … every fact is dated and attributed where the brief requires it"
- **Issue:** C14 checks that 15 specific strings are present, including the dates, `AI-assisted` and `prototype`. It doesn't check that every fact is dated or attributed. That was done by content review. The README is in the public repo, so it should describe its own checks accurately.
- **Replace with:** `the required dates, commit hashes and AI-assisted credit appear on the page`
- This doesn't block, and nothing published changes.

### CT3-2 (Optional, checker): a narrowing for "verification before release", only if Ben wants that line (test-engineer)
- If Ben wants the brief's "verification before release" as an interest statement, don't add an `ALLOW` entry. Narrow the entry instead:
  `r"re:(?<!before )releas(?:e[sd]?|ing)\b"`
- I probed it. It passes "verification before release" and still catches "released" and "release the lock". `normalise` collapses whitespace, so the fixed-width lookbehind holds.
- Don't make the change unless the copy is wanted.

### CT3-3 (Optional, checker): a narrowing for "in production test equipment", only if Ben wants that line (test-engineer)
- If such copy is wanted, narrow the entry `in production` to:
  `r"re:in[-\s]+production\b(?![-\s]+test)"`
- I probed it. It passes "in production test equipment" and still catches "in production" and "in-production".
- Don't make the change unless the copy is wanted.

---

## 6. Verdict

**APPROVE WITH MINORS.**
- CT2-1 and CT2-2 are CLOSED, and CT2-3 is confirmed CLOSED. The PLAN flash wording and the brief's FSW note are optional leftovers that aren't published.
- Both SVGs match each other, the page and the brief.
- The C13 changes are signed off, and no `ALLOW` entry is needed.
- CT3-1 is a non-blocking README wording fix. CT3-2 and CT3-3 are optional narrowings, to apply only if Ben wants that copy.
