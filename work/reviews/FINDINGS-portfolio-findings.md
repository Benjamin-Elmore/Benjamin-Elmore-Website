# Findings review: origin/portfolio-findings (09d157b) vs brief, plan and page

Reviewed November 3, 2026, read-only. The findings files were compared against PORTFOLIO-CONTENT.md (the brief), work/PLAN.md (the plan) and docs/index.html (the page). docs/assets/ was not read. (The analyst could not write this file, so the lead saved its report.)

Extra evidence from the unauthenticated GitHub API, checked November 3, 2026:
- SdBenE is the former name of the Benjamin-Elmore account (id 182452645).
  - SdBenE/ARC-Testing redirects (301) to repo 1377577142, which is Benjamin-Elmore/ARC.
  - SdBenE/MarketTesting redirects (301) to Benjamin-Elmore/MarketTesting.
- Benjamin-Elmore/ARC is public. Its `main` branch is at `7efb1f6` and its `CPPDev` branch is at `3eb3ed6d2da7b0f206085c35aa9a44065f83e703`.
- `cef105f` is public, dated 2026-10-29T05:50Z (October 28, 2026 Pacific).
- CBU-Robotics/HamburgerTesting and RobotBenjaminLucas return 404.
- MarketTesting's public `main` has 79 commits; the vault says 84.

## 1. New facts
- **N1:** the public ARC repo is the old ARC-Testing, and its `CPPDev` branch is `3eb3ed6`. SAFE to publish.
- **N2:** local `CPPDev` matches `origin/CPPDev` at `3eb3ed6`. SAFE.
- **N3:** the flash warning is 8 MB in the config vs 2 MB reported by the SDK settings; the physical flash size is unresolved. SAFE.
- **N4:** design evolution was base class, then callbacks and preconfiguration, then the ESP-IDF I²C bus, mux, optical registers and position decoding, then explicit error propagation. SAFE as source-level history.
- **N5:** an October 26 validation log exists but is not a fresh revalidation. INTERNAL; do not publish.
- **N6:** bounded wording: "developing", "worked on", "target build passed", "end-to-end hardware validation remain open". SAFE.
- **N7:** HamburgerTesting has 14 commits, September 16 to October 28, 2025: driver controls, Pure Pursuit/spline exploration, point navigation. Prose is SAFE; links need Ben (404, team repo).
- **N8:** point navigation reads odometry, rotates the error into the robot frame, and maps proportional x/y/heading commands to the drive motors. SAFE as source-level only; there was no robot run.
- **N9:** RobotBenjaminLucas `04fdac4` adds joystick drivetrain control and motor groups. Prose is SAFE. Do not publish the repo name or link (teammate's name).
- **N10:** FSW review of `f4f6229` (October 15, 2026):
  - generator tests 13/13; freshness check and rule scan passed
  - checker self-test failed on Windows 8.3 paths
  - MATLAB 12 passed, 15 skipped
  - native C++/CTest and MEX not built
- **N11:** Ben coordinates and owns the C++/simulation integration decisions with one mechanical engineer; AI agents did the implementation and review.
- **N12:** FSW-UAV-SIM scope: telemetry, JSON parameters, replay tests and an aero/CAD pipeline. Publish only with the caveats "reference geometry", "aero data is draft", "MissionManager idle".
- **N13:** MarketTesting ran October 29, 2025 to June 13, 2026, with a `src` restructure, VIX retrieval, general CSV ingestion and loss protection. SAFE. The commit count needs Ben.

## 2. Corrections
- **C1 (Major).** The page's repo caveat ("a separate snapshot from the ARC-Testing branch") is false. The public repo's `CPPDev` branch is `3eb3ed6`. The brief and the PLAN forbidden claim are also wrong.
- **C2 (Major).** "ARC-Testing repository" is the old repo name. It should be the ARC repository's `CPPDev` branch at `3eb3ed6`, matching the public branch.
- **C3 (Minor).** Credit the existing sensor code to the team and earlier reference sources.
- **C4 (Minor).** Flash wording: the configuration expects 8 MB but the SDK settings report 2 MB; the board itself is unchecked.
- **C5 (Minor).** FSW role: "coordinate … own C++/simulation integration decisions; a mechanical engineer; AI agents did substantial implementation and review".
- **C6 (Minor+).** FSW verification: add the October 15, 2026 review of `f4f6229`, 13/13 generator tests, and native C++ tests and MEX not built. Change "standalone replay" to "replay fixtures and tests".
- **C7 (Minor).** Use design tense where the code is not yet working ("is designed to read", "In the design, …").
- **C8.** Never use SdBenE URLs. The MarketTesting link is correct.

## 3. Proposed changes
- **content-engineer:** P1 and P2 (Major) as C1 and C2; P3 to P6 as C3 to C7; optional P7 (navigation detail, source-level), P8 (MarketTesting dates and features, no count) and P9 ("explicit error propagation" in the role list).
- **diagram-engineer:** D1 (optional), bring-up stage labels.
- **test-engineer:**
  - T1: add to C13 `validated`, `autonomous navigation`, `autonomous flight`, `flight-validated`, `CFD`, `race-free`, `race freedom`, `sole author`, `production system`; don't add bare `validation` or `end-to-end`.
  - T2: C08 denies `github.com/SdBenE`, `github.com/CBU-Robotics`, `RobotBenjaminLucas`.
  - T3: C14 requires `CPPDev`; forbid `ARC-Testing`.
- **lead:** L1 to L5, PLAN updates matching the above.

## 4. Needs Ben
- **B1:** brief correction C1; `CPPDev` branch link or repo root.
- **B2:** team repo links (404, teammate name).
- **B3:** MarketTesting commit count (84 vs 79).
- **B4:** FSW role verb, and mentioning the mechanical engineer and AI review.
- **B5:** bring-up labels on the diagram.
- **B6:** "My local check" or "A local check".
- **B7 (keep off the page):** vault paths, validation logs, teammate's name, team-org links, serial captures, pin/register values, board imagery, personal email.
