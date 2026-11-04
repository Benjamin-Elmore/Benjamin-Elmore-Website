# Content review 1: docs/index.html and docs/assets/arc-architecture.svg

Reviewed November 3, 2026, read-only, at `dev-11-03-26` `9eba5c3`.

**Sources (in priority order):** `work/reviews/FINDINGS-portfolio-findings.md` (N*, C*); the Lead defaults B1-B6 in `work/RUN-STATE.md`; `PORTFOLIO-CONTENT.md` (the brief); `work/PLAN.md` section 3 and its forbidden-claims list. Where the findings correct the brief, the findings win. The public `Benjamin-Elmore/ARC` repo's `CPPDev` branch is `3eb3ed6`, and "ARC-Testing" is the repo's old name.

**Scope:** every visible sentence, the `<title>`, the meta description, the og tags, the image alt, the SVG `<title>`/`<desc>` and the SVG labels.

**Severity:** Major means wrong, unsupported or over-claimed. Minor means wording, voice or clarity.

**Owners:** `docs/index.html` belongs to the content-engineer, the SVG to the diagram-engineer, C13/C14 to the test-engineer, and PLAN/brief to the lead.

---

## 1. Findings

### CT1-1 (Major): repo caveat is false (C1, B1)
- **Current** (`p.case-study__repo`): "Code: Benjamin-Elmore/ARC on GitHub. The public repository is a separate snapshot from the `ARC-Testing` branch checked above."
- **Source:** N1, C1, B1. The public `CPPDev` branch is `3eb3ed6`, and `main` is `7efb1f6`.
- **Replace with** (keep the link to the repo root, as the C08 allowlist requires):
  `Code: <a href="https://github.com/Benjamin-Elmore/ARC" rel="noopener">Benjamin-Elmore/ARC on GitHub</a>. The build checked above is the public <code>CPPDev</code> branch at <code>3eb3ed6</code>. The default <code>main</code> branch is a different revision.`

### CT1-2 (Major): old repo name, and the check claimed in first person (C2, B6)
- **Current** (first `evidence__text`, opening sentence): "My local check of the `ARC-Testing` repository, branch `CPPDev`, at head `3eb3ed6` with a clean working tree."
- **Source:** N1, N2, C2, B6. B6 wants the neutral "A local check", and the date is already in the `<time>` element.
- **Replace with:** `A local check of the ARC repository’s <code>CPPDev</code> branch at <code>3eb3ed6</code>, the same commit as the public branch, with a clean working tree.`

### CT1-3 (Minor): flash wording (C4)
- **Current:** "The build emitted a flash configuration warning: 8 MB expected, 2 MB configured."
- **Source:** N3, C4. The project configuration expects 8 MB, the SDK settings report 2 MB, and the physical size is unchecked.
- **Replace with:** `The build warned about flash size: the project configuration expects 8 MB, but the SDK settings report 2 MB. The board’s actual flash size hasn’t been checked.`
- **Also in Open work:** replace "Resolving the flash configuration warning." with `Resolving the flash-size mismatch and checking the board’s actual flash size.`

### CT1-4 (no change): the "no hardware test" wording
- **Current:** "This was a build of the RS-485-only entry point. It shows the target builds. No hardware test was run as part of this check, and a passing compile covers only part of the integration."
- **Judgement: acceptable. Keep it.** The brief's "no new hardware test" is meant to scope the denial to this check without denying the earlier `cef105f` test. "As part of this check" does that more plainly than "new" does, and "new" could suggest that hardware testing is routine. The sentence is dated by its `<time>`, the next item gives the earlier test separately, and it keeps the C14 `no hardware test` substring.
- **Optional tightening (Minor):** merge the first two sentences into `This was a build of the RS-485-only entry point, so it shows the target builds.`

### CT1-5 (Major): meta and og descriptions claim the sensor-to-V5 path works
- **Current** (`meta name=description`): "Benjamin Elmore, computer science student and robotics software engineer, writing C++ sensor firmware that connects external sensors to a VEX V5 robot."
- **Current** (`og:description`): "Computer science student and robotics software engineer, writing C++ sensor firmware that connects external sensors to a VEX V5 robot."
- **Source:** the PLAN forbidden claim ("the sensor-to-V5 path works") and C7. The brief calls the board "designed to connect", and the integration is open work.
- **Replace description with** (155 characters, within the C02 range of 50-160): `Benjamin Elmore, computer science student and robotics software engineer, contributing C++ firmware for a board designed to link sensors to a VEX V5 robot.`
- **Replace og:description with** (147 characters): `Computer science student and robotics software engineer, contributing C++ firmware for a board designed to link sensors to a VEX V5 robot.`

### CT1-6 (Major): diagram steps state unfinished behaviour as fact (C7)
- **Current** step 3: "The ESP32-S3 on the ARSENAL board runs the ARC firmware and reads the sensors."
- **Current** step 4: "The ESP32-S3 talks to the VEX V5 Brain over half-duplex RS-485."
- **Source:** brief (the current entry point has an empty registry, and optical I²C bring-up and a sensor-to-V5 test are open) and C7.
- **Replace** step 3 with `In the design, the ESP32-S3 on the ARSENAL board runs the ARC firmware and reads the sensors.`
- **Replace** step 4 with `In the design, the ESP32-S3 talks to the VEX V5 Brain over half-duplex RS-485.`
- Steps 1-2 describe the physical topology and can stay. Keep "half-duplex RS-485" for C14.

### CT1-7 (Minor): "runs on it" (C7)
- **Current** (`#arc-problem`): "ARC is the C++ firmware that runs on it."
- **Replace with:** `ARC is the C++ sensor firmware written for it.`

### CT1-8 (Minor): credit for the existing sensor code (C3)
- **Current:** "The ARSENAL board and the existing sensor code are the team’s work."
- **Source:** C3 (credit the team and earlier reference sources). No source or teammate is named (B2, B7).
- **Replace with:** `The ARSENAL board is the team’s work. The existing sensor code came from the team and from earlier reference code.`

### CT1-9 (Major): FSW-UAV-SIM role and collaborators over-stated (C5, N11, B4)
- **Current:** "I lead and orchestrate an AI-assisted UAV simulation effort, working with mechanical and aerodynamic collaborators."
- **Source:** N11, C5, B4. Ben coordinates and owns the C++/simulation integration decisions with **one** mechanical engineer, and AI agents did the implementation and review. "Collaborators" in the plural, plus the "aerodynamic" role, isn't supported.
- **Replace with:** `I coordinate this AI-assisted UAV simulation effort and own its C++/simulation integration decisions. I work with a mechanical engineer, and AI agents did substantial implementation and review.`

### CT1-10 (Minor+): FSW verification and replay wording (C6, N10, N12)
- **Current:** "Generated interface contracts, standalone replay and configuration plumbing keep the interfaces explicit. An October 2026 review verified the generator tests and interface and rule checks at its snapshot, and documented a Windows checker self-test failure."
- **Source:** C6, N10 and N12. N12 gives JSON parameters, and "standalone replay" becomes "replay fixtures and tests". MATLAB counts are left off on purpose: "12 passed, 15 skipped" needs context the card can't give, and the aero/CAD pipeline would need all the N12 caveats.
- **Replace with:** `Generated interface contracts, JSON parameter files, and replay fixtures and tests keep the interfaces explicit. An October 15, 2026 review of commit f4f6229 found all 13 generator tests passing, along with the interface and rule checks. The checker’s self-test failed on Windows, and the native C++ tests and MEX build were not built.`
- Keep the final sentence: "GNC (guidance, navigation and control) is stubbed and the aerodynamic data is a draft."

### CT1-11 (Minor): FSW card meta
- **Current:** "Staged engineering prototype. AI-assisted implementation. No public link."
- **Issue:** "No public link" describes the page, not the project.
- **Replace with:** `Staged engineering prototype. AI-assisted implementation. Repository not public.` (Keep "prototype" and "AI-assisted" for C14.)

### CT1-12 (Minor): SVG "this work" pill implies Ben made the ESP32-S3/ARSENAL block (diagram-engineer)
- **Current:** pill text "this work". The `<desc>` says "...on the ARSENAL board, marked as this work;".
- **Source:** brief (credit the team hardware). The block is the team's board plus ARC firmware, and Ben is a contributor.
- **Replace** the pill text with `case study`.
- **Replace** that `<desc>` fragment with `..., marked as the subject of this case study;`
- "case study" is 10 characters, against 9 for "this work", so widen the pill by about 12 units if needed. The VERIFY-1 legibility fix may resize this anyway, so carry the new text into that fix. All other SVG text traces to the brief and PLAN 2.5: the heading "Intended system architecture", the box names, the sub-labels, "I²C" and "half-duplex RS-485".

### CT1-13 (Minor): "testing design" is internal jargon, and history sits under the wrong label (decision 1)
- **Current failure mode:** "If each sensor type gets its own code, the acquisition logic is copied from sensor to sensor. Early work used a sensor base class with an optical specialization."
- **Current design response:** "The testing design uses configurable setup and read callbacks plus preconfiguration, so one acquisition path serves different sensor types. Optical register reads, writes and offset handling are the concrete example."
- **Source:** brief and N4. "Testing design" refers to the old ARC-Testing repo, and a reader won't know that. The base-class sentence is history, not a failure mode.
- **Replace failure mode with:** `If each sensor type gets its own code, the acquisition logic gets copied from sensor to sensor.`
- **Replace design response with:** `Early work used a sensor base class with an optical specialization. The later design moved to configurable setup and read callbacks plus preconfiguration, so one acquisition path can serve different sensor types. Optical register reads, writes and offset handling are the concrete example.`

### CT1-14 (Minor): "failed acquisition" is ambiguous (decision 2)
- **Current:** "A noncopyable lock guard scopes the lock, and later work checks for failed acquisition."
- **Issue:** the page uses "acquisition" for sensor reads everywhere else.
- **Replace with:** `A noncopyable lock guard scopes the lock, and later work checks whether taking the lock failed.`

### CT1-15 (Minor): "A current sensor-to-V5 hardware test" reads as a current sensor
- **Current** (Open work): "A current sensor-to-V5 hardware test."
- **Replace with:** `A sensor-to-V5 hardware test on the current code.`

### CT1-16 (Minor): role list, last item
- **Current:** "Committed implementation and debugging work."
- **Issue:** this restates the list above it.
- **Replace with** `Added explicit error propagation.`, which is optional P9 and safe under N4, or delete the item.

### CT1-17 (Minor): intro redundancy (voice and scan time)
- **Current:** the h1 "Benjamin Elmore" is followed by the role line "Computer science student and robotics software engineer", and then the lede repeats both: "I’m Benjamin Elmore, a computer science student and robotics software engineer. I’m developing..."
- **Source:** the brief's suggested opening. PLAN asks for it "near-verbatim", so trimming the restated clause is allowed.
- **Replace lede with:** `I’m developing embedded firmware that helps a VEX V5 robot work with external sensors, and I’m interested in applying that experience to defense and space manufacturing.`

### CT1-18 (Minor): ARC summary duplicates "The problem" and calls the section a page
- **Current:** "ARC is the C++ sensor firmware for ARSENAL, a custom ESP32-S3 board my robotics team is developing. I contribute to the firmware. This page covers the failure modes I reasoned about, how the design responds to them, and what has actually been checked so far."
- **Replace with:** `I contribute to ARC, the C++ sensor firmware for my robotics team’s custom board. This case study covers the failure modes I reasoned about, how the design responds to them, and what has been checked so far.`

### CT1-19 (Minor): VEX spline and odometry phrasing
- **Current:** "Explored PID and Pure Pursuit control. My spline and odometry work had open items."
- **Source:** brief and N7. This is source-level work only, and N8 records no robot run.
- **Replace with:** `Explored PID and Pure Pursuit control. My spline and odometry work was left unfinished.`

### CT1-20 (Minor): MarketTesting self-assessment fluff (N13, B3)
- **Current:** "...and a prediction-table output. It shows pipeline ownership. I make no claims about its forecasts."
- **Issue:** the page shouldn't tell the reader what the work shows.
- **Replace the last two sentences with:** `It’s a learning project, so I don’t report forecast results.`
- **Optional, P8 (N13, SAFE):** change the meta to `Independent Python learning project, October 2025 to June 2026`.
- **Do not** add a commit count (B3) or the "loss protection" feature, which reads as a financial claim.

### CT1-21 (Minor, lead): PLAN and brief still encode the C1 error
- PLAN section 3 "Repo link" and the forbidden claim "that the public ARC repo holds `3eb3ed6`" are now wrong. So is brief line 35.
- Per B1 and L1-L5, the lead should invert them to forbid "that `main` holds the verified build", and forbid any "separate snapshot" wording.

## 2. Checks requested

- **Dating and attribution of the verification items.**
  - Both items are dated with `<time>`, and the October 28 date matches `cef105f`: 2026-10-29T05:50Z is October 28 Pacific.
  - The `cef105f` result is attributed to the commit message and caveated ("only evidence", "later commits changed").
  - The November 3 item needs CT1-2 (B6 neutral, no ARC-Testing).
  - The FSW review date gets fixed in CT1-10.
  - The October 26 validation log (N5) is correctly absent.
- **Team, prior-source and AI credit.**
  - The team board and code are credited, with CT1-8 adding the prior sources.
  - The EE/CE collaboration is stated.
  - The VEX VP role doesn't claim that Ben led the team.
  - FSW is credited as AI-assisted. CT1-9 adds the AI agents and the single mechanical engineer.
  - The diagram pill needs CT1-12.
- **Present-tense over-claims.** CT1-5 (meta), CT1-6 (steps), CT1-7 (problem) and CT1-13 ("serves"). Decisions 2-4 describe code structure or the stated architecture ("the architecture gives...") and are fine.
- **FSW-UAV-SIM against N10-N12 and B4.** Not compliant until CT1-9, CT1-10 and CT1-11 are applied. No link is present, so C09 and C15 hold.
- **MarketTesting against N13 and B3.** Compliant: there's no count, and the link is correct (not SdBenE, per C8). CT1-20 is voice only.
- **B7 sensitive list.** Clean:
  - no vault paths, validation logs or serial captures
  - no teammate names, team-org or team-repo links
  - no pin or register values, and no board imagery
  - no email, phone or résumé
- **Voice and scanning.** The page is first person and plain, and the decision cards scan well. The fluff and redundancy are in CT1-16 to CT1-20. With those applied, a hiring engineer can get the story in about 2 minutes. The In-N-Out fragment ("Teamwork and keeping service quality up in a fast-paced environment.") is acceptable per the brief's "optional one-line".
- **Forbidden list.** After the replacements above, the copy contains none of the current C13 phrases.

## 3. C13/C14 changes for the test-engineer (T1, T3), with my sign-off (PLAN section 5)

**C13 `FORBIDDEN_PHRASES`, add:**
- `validated`
- `autonomous navigation`
- `autonomous flight`
- `flight-validated`
- `CFD`
- `race-free`
- `race freedom`
- `sole author`
- `production system`
- `ARC-Testing` (T3)
- `separate snapshot` (guards against C1 coming back)
- `hardware-tested`

Do **not** add bare `validation`, `end-to-end`, `hardware test`, `flight` or `production`.

**Collision check** against every replacement sentence in section 1, the unchanged copy and the SVG:
- None of the new phrases appear.
- "No hardware test was run" doesn't match `hardware-tested`, because the matcher escapes the hyphen and requires a word boundary.
- "flight-software" doesn't match `autonomous flight` or `flight-validated`.
- "manufacturing" doesn't contain `production system`.
- No CT1 text uses "validated". Keep the `ALLOW` constant empty.

**C14 `REQUIRED_FACTS`, add:**
- `CPPDev` (T3). It's present in CT1-1 and CT1-2.
- `AI agents`. Optional, but recommended to lock in the B4 credit. It's present in CT1-9.

Keep the existing facts and the special `no hardware test` rule. These still appear after the edits:
- `no hardware test` (CT1-4 unchanged)
- `October 28`
- `October 2026` (the VP line)
- `flash` (CT1-3)
- `prototype` and `AI-assisted` (CT1-11)
- `half-duplex RS-485` (CT1-6)

**Ordering note:** apply the content edits in the same fix round as the list change. `ARC-Testing` is currently on the page twice, and `CPPDev` is already present.

## 4. Verdict

**CHANGES REQUIRED.** The Majors are CT1-1, CT1-2, CT1-5, CT1-6 and CT1-9. The rest are Minors and can go in the same fix round.
