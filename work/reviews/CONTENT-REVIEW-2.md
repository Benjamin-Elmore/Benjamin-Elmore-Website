# Content review 2: docs/index.html and both architecture SVGs

Reviewed November 3, 2026, read-only, at `dev-11-03-26` `17b6784`. The fix diff is `git diff 9eba5c3..17b6784 -- docs`.

**Sources (in priority order):** `work/reviews/FINDINGS-portfolio-findings.md` (N*, C*); the Lead defaults B1-B6 in `work/RUN-STATE.md`; `PORTFOLIO-CONTENT.md` with its 2026-11-03 correction note; `work/PLAN.md` section 3 and its forbidden-claims list.

**Scope:** all visible text in `docs/index.html` (including the `<title>`, meta and og tags, alt text, figcaption and steps, nav and footer), and the `<title>`, `<desc>` and labels of `docs/assets/arc-architecture.svg` (wide) and `docs/assets/arc-architecture-stacked.svg` (stacked).

**Checker:** `python tools/check_site.py` passes C12-C19 locally, including C13 (34 forbidden phrases, empty `ALLOW`) and C14 (15 required facts, with `CPPDev` added).

---

## 1. Round-1 items

| ID | Status | Evidence |
| --- | --- | --- |
| CT1-1 (Major) repo caveat | CLOSED | `p.case-study__repo` now reads "The build checked above is the public `CPPDev` branch at `3eb3ed6`. The default `main` branch is a different revision." The link is to the repo root. This matches B1 and N1. "separate snapshot" is gone, and C13 now guards against it. |
| CT1-2 (Major) old repo name, first person | CLOSED | "A local check of the ARC repository's `CPPDev` branch at `3eb3ed6`, the same commit as the public branch, with a clean working tree." This matches B6 and N2. `ARC-Testing` no longer appears on the page and is in C13. |
| CT1-3 flash wording | CLOSED | "the project configuration expects 8 MB, but the SDK settings report 2 MB. The board's actual flash size hasn't been checked." The Open-work item reads "Resolving the flash-size mismatch and checking the board's actual flash size." This matches N3 and C4. |
| CT1-4 "no hardware test" | CLOSED (kept, as ruled) | The optional tightening was applied: "This was a build of the RS-485-only entry point, so it shows the target builds." C14's `no hardware test` is still present. |
| CT1-5 (Major) meta/og over-claim | CLOSED | Both now say "contributing C++ firmware for a board designed to link sensors to a VEX V5 robot." This is design tense and doesn't claim the path works. C02 passes. |
| CT1-6 (Major) steps in design tense | CLOSED | Steps 3 and 4 start with "In the design, …". Steps 1 and 2 are topology and unchanged, as ruled. "half-duplex RS-485" is kept. |
| CT1-7 "runs on it" | CLOSED | "ARC is the C++ sensor firmware written for it." |
| CT1-8 sensor-code credit | CLOSED | "The ARSENAL board is the team's work. The existing sensor code came from the team and from earlier reference code." This matches C3 and names nobody (B2/B7). |
| CT1-9 (Major) FSW role | CLOSED | "I coordinate this AI-assisted UAV simulation effort and own its C++/simulation integration decisions. I work with a mechanical engineer, and AI agents did substantial implementation and review." This is C5 word for word and satisfies B4 and N11. |
| CT1-10 FSW verification | CLOSED (one wording Minor, CT2-2) | It now gives the date (October 15, 2026), commit `f4f6229`, 13 generator tests, "JSON parameter files", "replay fixtures and tests", the Windows self-test failure, and native C++ tests and MEX not built. All of that traces to N10, N12 and C6. |
| CT1-11 FSW meta | CLOSED | "Staged engineering prototype. AI-assisted implementation. Repository not public." |
| CT1-12 SVG pill | CLOSED | The wide and stacked pills both read "case study". Both `<desc>` elements say "marked as the subject of this case study". The wide pill was widened to 136 units. |
| CT1-13 "testing design" / history | CLOSED | The failure mode is now one sentence. The base-class history moved to the design response, followed by "The later design moved to configurable setup and read callbacks plus preconfiguration, so one acquisition path can serve different sensor types." "can serve" is design tense (N4). |
| CT1-14 lock acquisition | CLOSED | "later work checks whether taking the lock failed." |
| CT1-15 open-work wording | CLOSED | "A sensor-to-V5 hardware test on the current code." |
| CT1-16 role list, last item | CLOSED | "Added explicit error propagation." This is optional P9 and is SAFE under N4. |
| CT1-17 intro redundancy | CLOSED | The lede now starts "I'm developing embedded firmware…". The h1 and role line carry the name and role. |
| CT1-18 ARC summary | CLOSED | "I contribute to ARC, the C++ sensor firmware for my robotics team's custom board. This case study covers…" |
| CT1-19 spline/odometry | CLOSED | "My spline and odometry work was left unfinished." This is source-level only (N7, N8). It makes no robot-run claim. |
| CT1-20 MarketTesting fluff | CLOSED | "It's a learning project, so I don't report forecast results." P8 was applied to the meta: "October 2025 to June 2026" (N13). There is no commit count (B3) and no "loss protection". |
| CT1-21 (lead) PLAN/brief repo rule | CLOSED | PLAN section 3 "Repo link (corrected, findings C1/B1)" and its forbidden claims now forbid "`main` holds the verified build" and "separate snapshot". The brief carries the 2026-11-03 correction note. Brief line 28 still says `ARC-Testing`, but the note overrides it, and it isn't published. A leftover in another PLAN bullet is in CT2-3. |
| Section 3: C13/C14 lists | CLOSED | All 12 phrases are in C13, including `ARC-Testing`, `separate snapshot` and `hardware-tested`, and `ALLOW` is empty. C14 has `CPPDev`. The optional `AI agents` fact wasn't added. That's acceptable, because it was optional. |

**Result:** all 5 Majors and all 16 Minors are CLOSED.

---

## 2. Re-trace of the round-1 text

Every sentence the diff added or changed traces to a source.

| New or changed text | Source |
| --- | --- |
| meta and og descriptions | brief ("designed to connect"), C7 |
| lede | brief's suggested opening, trimmed per PLAN "near-verbatim" |
| ARC summary and problem | brief, C3 |
| "Added explicit error propagation." | N4, P9 |
| figcaption and steps | brief "intended system architecture", C7 |
| decisions 1 and 2 | brief table, N4 |
| verification and open work | N1-N3, B1, B6, C4, brief |
| repo paragraph | B1, N1 |
| VEX bullet | brief, N7, N8 |
| FSW card | C5, C6, N10-N12, B4 |
| MarketTesting card | N13, B3 |

**Text that didn't change:** the alt text, the `<title>`, `og:title`, the nav, decisions 3 and 4, the October 28 item, Skills, Education, Contact and the footer. All were re-read, and none contain an over-claim.

**The `<figcaption>` now wraps the `<ol>`.** The words are unchanged, so content is fine. This is structure only.

**Forbidden-claims sweep:**
- There is no deployment, throughput, latency, timing, reliability or forecasting claim.
- Nothing says the sensor-to-V5 path works.
- Nothing says `main` holds the build.
- Nothing credits Ben with designing the board or writing the team's sensor code, or with leading VEX U as a whole.
- FSW is marked prototype and AI-assisted.
- There is no defense or space job claim.

**Personal details:** there is no contact detail beyond GitHub and LinkedIn. B7 is clean: no teammate names, team-repo links, pin or register values, or internal logs.

### Ruling: V5 Brain sub-label "robot controller"

**Acceptable. Keep it.** It isn't an over-claim or an unsourced fact.
- The brief's positioning line says Ben's work is "where sensors, a custom board, and a robot controller meet". In that sentence the robot controller can only be the VEX V5 Brain.
- The page's own section lede uses the same phrase.
- The label describes what the block is and says nothing about status. The diagram heading already says "Intended system architecture".
- The `<desc>` phrase "the VEX V5 Brain, the robot controller" is equally fine.

### Ruling: "case study" pill

**Acceptable. Keep it.**
- This is the CT1-12 replacement. It marks the block as the page's subject without claiming that Ben built the board or wrote all of the firmware.
- The team credit sits next to the figure, in "The problem".
- The pill and the `<desc>` wording match in both SVGs.

### Wide versus stacked SVG

The two SVGs carry the same information:
- the same `<title>` ("ARC intended system architecture") and heading ("Intended system architecture")
- the same four box titles and sub-labels "multiplexed I²C", "ARC firmware on ARSENAL board" and "robot controller"
- the same link labels: I²C, I²C, and half-duplex RS-485
- the same arrow directions: one-way for I²C, two-way for RS-485
- the same highlighted ESP32-S3 block with the "case study" pill

The one difference is the Sensors sub-label and the sensor phrase in the `<desc>`, covered in CT2-1.

---

## 3. New findings

### CT2-1 (Minor): the stacked SVG drops "other" from the sensor label (diagram-engineer)
- **Current, stacked label** (`arc-architecture-stacked.svg`, `<text x="42" y="138">`): "optical and external sensors"
- **Current, stacked `<desc>`:** "…top to bottom: optical and external sensors connect over I²C…"
- **Wide SVG, the brief and step 1 all say:** "optical and other external sensors"
- **Issue:** "optical and external" reads as if optical sensors were not external. It also makes the two SVGs say different things.
- **Source:** brief ("optical and other external sensors → multiplexed I²C"), PLAN 2.5.
- **Replace the stacked `<desc>` fragment with:** `optical and other external sensors connect over I²C`. The `<desc>` has no width limit.
- **Replace the stacked label with:** `optical and other external sensors`, if it fits in the 294-unit line (x=42 to x=336) at the current font size. If it doesn't fit, use `optical and other sensors`. That keeps "other", and the box sits under the "Sensors" title, so "external" is implied. Don't shrink the font below 17, because the 360px legibility floor was the reason for the current size.

### CT2-2 (Minor, wording): "MEX build were not built" (content-engineer)
- **Current** (FSW card): "The checker's self-test failed on Windows, and the native C++ tests and MEX build were not built."
- **Issue:** "build … not built" repeats itself, and "MEX build were" reads badly. The wording came from CT1-10 in round 1, so this is my own error.
- **Source:** N10, "native C++/CTest and MEX not built".
- **Replace with:** `The checker's self-test failed on Windows, and the native C++ tests and the MEX file were not built.`

### CT2-3 (Minor, lead, not published): two PLAN section 3 bullets are stale
- **Current, PLAN section 3 FSW-UAV-SIM bullet:** "\"I lead and orchestrate an AI-assisted UAV simulation effort\" with mechanical/aerodynamic collaborators; … standalone replay. … October 2026 review verified generator tests and interface checks at its snapshot."
- **Current, PLAN section 3 Open work:** "resolving the flash configuration warning". This is a smaller wording lag.
- **Issue:** this guidance contradicts B4, C5, C6 and N11. A later fix round or validator could reintroduce the over-claim CT1-9 removed.
- **Brief line 47** has the same old FSW text, and it has no correction note for FSW.
- **Replace the PLAN FSW bullet with:** `No link. "I coordinate this AI-assisted UAV simulation effort and own its C++/simulation integration decisions", with one mechanical engineer and AI agents credited (B4, C5, N11). C++ flight-software logic and Simulink plant behind a Level-2 S-function; generated interface contracts, JSON parameter files, replay fixtures and tests. Status: staged prototype; GNC stubbed, aero data draft; October 15, 2026 review of f4f6229: 13/13 generator tests, interface and rule checks passed, Windows checker self-test failed, native C++ tests and MEX not built (C6, N10).`
- **Brief:** optionally, add a matching correction note under the brief's FSW bullet.
- None of this changes the published page.

---

## 4. Verdict

**APPROVE WITH MINORS.** All CT1 items are CLOSED, and the page and both SVGs contain no new over-claim or unsourced fact. "robot controller" and "case study" both stand. CT2-1 and CT2-2 are Minor copy fixes that can go in the next fix round without re-review. CT2-3 is a lead-only documentation correction and doesn't block.
