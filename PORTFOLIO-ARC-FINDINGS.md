# ARC portfolio findings — November 3, 2026

This research addendum supplies additional source-grounded detail for the ARC case study. Keep it as a local editorial source; do not publish these notes verbatim. Confirm any personal or team-approved media with Benjamin before adding it to the site.

## Stronger story: treat the project as staged interface integration

The clearest ARC narrative is a sequence of engineering boundaries: acquire sensor data over a shared, multiplexed I²C bus; expose readings through a sensor interface; then exchange requests and responses over half-duplex RS-485 with the VEX V5 Brain. The architecture diagram documents this intended software design, and the current `app_main()` deliberately starts the RS-485 receiver with an empty sensor registry. This is a useful bring-up choice because it lets communication work proceed without claiming the sensor path is already integrated.

Frame the achievement as building and checking pieces of a larger student robotics system. Do not describe the current prototype as a completed sensor-to-controller pipeline, deployed product, validated fixture, or production system.

## Additional evidence available for the case study

- **Incremental firmware design:** The local ARC histories show a progression from an early sensor base class and optical specialization toward configurable setup/read callbacks and preconfiguration. Subsequent work introduced an ESP-IDF I²C master bus abstraction, mux device handling, optical register operations and position decoding, then explicit error propagation. This gives the case study a concrete design-evolution arc rather than a list of technologies.
- **Concurrency and ownership:** The work moved mux selection and device access behind bus ownership and mutex protection. The portfolio can explain why channel selection and the associated transaction must share a lock: another task changing the mux between those operations could send the transaction to the wrong sensor. Describe the design intent and source-level implementation, not a claim that race freedom has been proven under load.
- **Failure isolation:** The current entry point logs UART setup/start failures and reports serial state. It starts RS-485 with no registered sensors, which isolates communication bring-up from the still-incomplete I²C optical path. This is a specific, defensible example of narrowing a debugging problem.
- **Dated build evidence:** The November 3 local `CPPDev` checkout is clean at `3eb3ed6` and matches `origin/CPPDev`; its `pio run -e seeed_xiao_esp32s3` completed successfully. The application built was RS-485-only. The output warned that the configuration expected 8 MB flash while SDK settings reported 2 MB; treat the build as compile/link evidence and leave physical flash configuration unresolved until the board is checked.
- **Older protocol evidence:** An October 28 commit `cef105f` records successful RS-485 protocol checks across multiple packet formats. State the date and attribute this to the commit record if used. It predates later communication changes, so it does not establish validation of the November 3 source.
- **External traceability:** The local `CPPDev` head was fetched and compared with its upstream tracking ref; both resolve to `3eb3ed6d2da7b0f206085c35aa9a44065f83e703`. The public `SdBenE/ARC-Testing` default HEAD is a different revision (`7efb1f65ee1d330b1f1659165fb0cab597680c46`), so link to a repository only with a clear note that the documented verification used the named `CPPDev` commit. Avoid implying the public default branch reproduces that exact build.

## Suggested compact case-study wording

> I’m developing ARC, C++ firmware for a student robotics sensor interface. I worked on the ESP-IDF I²C/multiplexer layer, optical register access, sensor abstractions and RS-485 communication with a VEX V5 controller. I separated communication bring-up from the sensor path so I could investigate each interface on its own. A November 2026 target build passed for the RS-485-only entry point; optical sensor integration and end-to-end hardware validation remain open.

This wording is deliberately bounded. Use “developing,” “worked on,” and “target build passed”; do not say the complete sensor path was demonstrated on hardware.

## Relevance to defense and space manufacturing

The transferable connection is interface-focused embedded engineering: owning a device boundary, logging errors, isolating subsystem failures, and building a target-specific firmware image. These practices are relevant to manufacturing test software and equipment integration, where hardware interfaces need clear ownership and failures need to be diagnosable. Present this as an interest and a connection to the practices demonstrated in student robotics, not as prior defense/space manufacturing experience.

## Publication and claim limits

- Architecture and source notes establish intended structure and committed implementation. They do not establish physical mux routing, sensor readout, RS-485 electrical behavior, V5 interoperability, timing, reliability, throughput, or production readiness.
- The November 3 build did not exercise the sensor pipeline; the application instantiated communication with an empty registry.
- The flash-size mismatch requires physical board/configuration confirmation before changing the claim or settings.
- Keep pin details, device-specific register values, raw serial captures, direct contact data, and non-approved team/board imagery out of the public page unless Benjamin explicitly approves them.
- Attribute the ARSENAL board and existing/reference sensor code to the team or prior source where appropriate; Benjamin's commits are evidence of his contributions, not sole authorship of the full system.

## Evidence checked

- `ARC.md` and `ARC Commit Ledger.md` in the active Obsidian vault: reviewed contribution timeline, source attribution, and commit provenance.
- `ARC Architecture and Notes.md` and `ARC Software Architecture Diagram.md` in the active vault: intended software boundaries and explicit integration limits.
- `ARC Sensor Pipeline Quick Fix Checklist.md`: additional validation limits and deferred integration work; checklist status is dated October 26 and is not a fresh revalidation.
- `ARC-Testing/src\main.cpp` at `3eb3ed6`: RS-485-only startup with an empty registry and UART status logging.
- `ARC-Testing/lib\RS485\RS485Comm.h` at `3eb3ed6`: UART configuration/status path, sensor registry, task startup, and diagnostics.
- `ARC-Testing/.pio\validation-progress.log`: existing October 26 build output and warning record; the fresh November 3 build/check and repository equality were separately verified during this research pass.
- Upstream refs checked November 3: ARC-Testing `CPPDev` resolves to `3eb3ed6`; public repository default HEAD resolves to `7efb1f6`, a separate ref.
