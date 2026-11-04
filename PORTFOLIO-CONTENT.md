# Benjamin Elmore portfolio content brief

Prepared November 3, 2026 for a separate model to design and build the portfolio. This file is a local editorial handoff. Use the facts below to write the site in Benjamin’s voice and keep this handoff outside the published Pages directory.

## Positioning

Lead with **embedded software for physical systems**, backed by a robotics firmware case study. Benjamin is a California Baptist University B.S. Computer Science student (Machine Learning and Artificial Intelligence concentration, expected May 2029) and CBU1 VEX U Robotics software engineer and vice president. His strongest relevant evidence is his C++ firmware work where sensors, a custom board, and a robot controller meet.

Suggested opening: “I’m Benjamin Elmore, a computer science student and robotics software engineer. I’m developing embedded firmware that helps a VEX V5 robot work with external sensors, and I’m interested in applying that experience to defense and space manufacturing.”

For this audience, emphasize component bring-up, interface ownership, reproducible checks, diagnostics, and collaboration across hardware and software. Relevant parallels include sensor interfaces for test fixtures and manufacturing equipment, subsystem integration, telemetry, and verification before release. Describe these as areas of interest and transferable engineering practices. Keep the work grounded in student robotics.

## Flagship case study — ARC firmware for ARSENAL

**What it addresses.** The CBU1 team is developing ARSENAL, a custom ESP32-S3 board designed to connect external sensors to a VEX V5 Brain. ARC is the C++ sensor firmware. The hardware path is optical and other external sensors → multiplexed I²C → ESP32-S3 → half-duplex RS-485 → VEX V5 Brain. Label this the intended system architecture.

**Benjamin’s role.** Firmware contributor collaborating with electrical and computer engineers on device interfaces. Prototyped the sensor abstraction, moved I²C communication toward the ESP-IDF master API, added optical register access and position decoding, and worked on mutex-protected bus access and UART/RS-485 diagnostics. His commits include implementation and debugging work. Attribute team hardware and existing sensor code to the team.

| Engineering decision | What to explain |
| --- | --- |
| Evolve the sensor abstraction | Early work used a sensor base class and optical specialization. The testing design uses configurable sensor setup/read callbacks and preconfiguration to reuse acquisition logic across sensor types. Optical register reads/writes and offset handling give a concrete example. |
| Give the bus a clear owner | A templated `I2CBus<N>` owns device registrations, register operations, mux selection, and a bus mutex. Keep the mux channel selection and its matching sensor transaction under the same lock so another task cannot change channels between them. A noncopyable lock guard scopes release, and later work checks failed acquisition. |
| Separate acquisition from requests | The architecture gives acquisition and communication separate tasks. The acquisition side selects the channel and stores readings. The communication side uses a sensor-ID registry and a small readings/offset interface. This keeps a controller request from needing to run the sensor-specific I²C sequence directly. |
| Isolate bring-up failures | The current entry point starts the RS-485 path with an empty registry, so communication debugging can proceed with the sensor hardware out of the loop. UART startup/status reporting and I²C error logging help narrow failures to the relevant layer. |

**Verification and open work.**

- Fresh local check on November 3, 2026: `ARC-Testing` branch `CPPDev`, head `3eb3ed6`, clean working tree. `pio run -e seeed_xiao_esp32s3` passed. The build emitted a flash configuration mismatch warning (8 MB expected, 2 MB configured/reported in the warning). This was a build of the active RS-485-only entry point. It establishes that target builds, with no new hardware test performed.
- October 28 commit `cef105f` records successful RS-485 protocol checks across multiple packet formats. The commit message is the evidence for that earlier test. Attribute and date the result if used. Later commits changed the communication code, and the November 3 head has header-dispatch preparation with per-command parser stubs.
- The active `src/main.cpp` exercises RS-485 with an empty registry. Optical I²C bring-up and a current sensor-to-V5 hardware test remain open. Keep deployment, release, throughput, latency, determinism, and reliability claims out unless Benjamin provides evidence.
- For an interview or longer case study, ask Benjamin for one annotated serial capture with test configuration, one specific hardware fault and how he isolated it, and a team-approved board photo or diagram. The vault has an editable PlantUML diagram and SVG/PNG exports. Review and approve those assets before publication. A clean redraw can use the four generic blocks above.

**Audience connection.** The story is strongest when the reader sees the failure modes Benjamin reasoned about. A shared mux can be switched between tasks, a transceiver problem can obscure sensor bugs, and a successful compile only covers a subset of the integration. Show how ownership of the bus and a communication-only harness make those failures easier to isolate. This maps naturally to bring-up and test software around robotics, avionics, and production test equipment.

Public repository: [Benjamin-Elmore/ARC](https://github.com/Benjamin-Elmore/ARC). **Correction (2026-11-03, from the portfolio-findings review):** ARC-Testing is the repo's former name (SdBenE was the account's former name). The public `CPPDev` branch is `3eb3ed6`, the verified build; `main` is a different revision.

## Supporting experience and projects

- **CBU1 VEX U Robotics** · Software Engineer since September 2025, Vice President since October 2026, per current résumé. Coordinates milestones across disciplines and helps plan events and competition preparation. Earlier PROS/C++ drivetrain work included driver controls, baseline point navigation using odometry and robot-frame error, and PID/Pure Pursuit exploration. Spline and odometry work had open items and the vault establishes source-level contributions. Pair this with ARC to show growth from robot control to device interfaces and team coordination.
- **FSW-UAV-SIM** · Benjamin leads and orchestrates an AI-assisted UAV simulation effort with mechanical/aerodynamic collaboration. The architecture separates C++ flight-software logic and a Simulink plant behind a Level-2 S-function. Generated interface contracts, standalone replay, and configuration plumbing are useful evidence of interface discipline and verification thinking. The October 15–16 review verified generator tests and interface/rule checks at its snapshot and documented a Windows checker self-test failure. GNC was stubbed and aerodynamic data was draft. Treat it as a staged engineering prototype and credit AI-assisted implementation. The repository returned 404 in a public check, so leave the link off unless public access is confirmed.
- **MarketTesting** · Independently developed Python learning project with CSV/yfinance ingestion, pandas/NumPy preprocessing, per-ticker scaling and 100-day input windows, TensorFlow LSTM training, and prediction-table output. Use it to show data and software pipeline ownership. Avoid forecasting accuracy or financial-performance claims. [Public repository](https://github.com/Benjamin-Elmore/MarketTesting).
- **In-N-Out Burger** · Associate since May 2024, per current résumé. Optional one-line support for teamwork and maintaining service quality in a fast-paced environment.
- **Technical skills to surface in context** · C/C++, Python, ESP-IDF, FreeRTOS, ESP32-S3, PlatformIO, I²C, UART, RS-485, VEX V5/PROS, Linux, Git, MATLAB/Simulink, TensorFlow, pandas/NumPy. Java and Arduino can appear in a short broader skills section.
- **Public contact** · [GitHub](https://github.com/Benjamin-Elmore) and [LinkedIn](https://www.linkedin.com/in/benjamin-n-elmore/). Confirm an approved public résumé before offering a download. The working résumé includes direct contact information.

## Editorial order

1. Short introduction focused on embedded firmware, hardware/software interfaces, and defense and space manufacturing interests.
2. ARC case study with problem, individual role, architecture, design decisions, and dated verification.
3. CBU1 leadership and earlier controls work, then compact FSW-UAV-SIM and MarketTesting entries.
4. Education and public contact.
