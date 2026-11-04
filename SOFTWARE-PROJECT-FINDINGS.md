# Software project portfolio findings

Prepared November 3, 2026 from the active Obsidian vault. This is a content handoff for portfolio writing, not a claim that either project is production-ready.

## FSW-UAV-SIM

### Portfolio angle

Show this as an aerospace software integration and verification prototype. The strongest story is coordinating an AI-assisted development workflow around C++ flight-software components, a Simulink plant interface, generated message contracts, and replay-based tests. Benjamin orchestrates the work, owns C++/simulation integration decisions, and collaborates with a mechanical engineer on aerodynamic and mechanical work. Credit AI agents for substantial implementation and review contributions.

Suggested concise description:

> I coordinate an AI-assisted UAV flight-software simulation project, integrating C++ components with a Simulink plant and building interface and replay checks to make software behavior easier to inspect.

### Evidence-backed technical scope

- The project separates C++ flight-software logic from a Simulink plant through a Level-2 S-function.
- Generated interfaces, uav_msg, telemetry, shared source lists, and lifecycle fixes were recorded as integrated by work packet WP-004 and associated commits.
- Core math/test work and an aerodynamic loader/model were integrated in later work packets.
- Replay sources, fixtures, CMake tests, a MATLAB exporter, and MATLAB replay tests were present at reviewed commit f4f6229.
- JSON parameters and sample-time plumbing were integrated. Replay configuration follow-ups remained.
- The project has a low-order aero/CAD pipeline. The CAD builds named bodies and exports STEP and parts reports. Treat geometry as a reference outer-mould-line model, not a manufacturing design. The aero data was draft and placeholder-dependent, not CFD- or flight-validated.

### Verification snapshot and exact limits

The vault records a source-level review of commit f4f6229051944d059002ef0ce30da2aaa8e85998 (f4f6229, October 15, 2026). At that review:

- Interface generator unit tests passed 13/13.
- Generated-interface freshness check passed.
- The normal software-rule scan passed with zero errors and warnings.
- The rule-checker self-test failed on Windows canonical/8.3 temporary paths.
- MATLAB R2025a was detected. MATLAB tests reported 12 passed and 15 filtered or assumption-skipped because compiler/MEX and replay prerequisites were absent.
- Native C++/CTest and MEX were not built during that review session.
- Historical packet records have other CTest and MATLAB pass totals, but those are different snapshots and were not independently reproduced during the review.

The project is explicitly staged verification software, not flight-ready. MissionManager remains Idle, Autopilot emits zero commands, and the aero database is draft placeholder/model data. Do not claim autonomous flight, validated control performance, verified flight dynamics, or a complete end-to-end simulation. Native/MEX agreement would establish software consistency, not aircraft or controller validity.

### Strong portfolio framing

Emphasize interface contracts, generated code checks, replay fixtures, and the discipline of marking unavailable checks clearly. This can connect to defense and space work through software integration, simulation, test tooling, and traceable verification practices. Describe that connection as relevant experience, not as aerospace certification or flight-test qualification.

### Publicity and attribution

The project repository returned 404 in a public check recorded in the content brief. Do not link it until access is confirmed. Keep the AI-assisted nature of implementation clear. The review notes include unresolved technical gates, so present a bounded prototype snapshot rather than a polished product claim.

## MarketTesting

### Portfolio angle

Use this as an individually developed learning project demonstrating Python package structure, market-data ingestion, experimentation with a TensorFlow LSTM, and iterative maintenance. It is supporting evidence for data/software pipeline ownership, not the lead project for an embedded or manufacturing audience.

Suggested concise description:

> I built a Python project that ingests historical market data from CSV or yfinance, organizes it for per-ticker LSTM experiments, and produces prediction tables.

### Evidence-backed contribution record

The vault’s review of repository history records 84 commits authored by Benjamin Elmore across his author-name variants, from October 29, 2025 through June 13, 2026. Representative public commit evidence shows:

- Entry point and model/training development: [initial main.py](https://github.com/SdBenE/MarketTesting/commit/1d38658d4f5000c8e70e2df5b2eb1ec20e6eb12e), [model and training structure](https://github.com/SdBenE/MarketTesting/commit/3de8b4ed44d35adccee9edf1b609f50b0a969724).
- CSV and yfinance selection paths: [data pull functions](https://github.com/SdBenE/MarketTesting/commit/903f7f06cb3e063f3565014a4a531108cf7228b5).
- Data logging and prediction output: [DataLog work](https://github.com/SdBenE/MarketTesting/commit/c18a55049dc4b90c372cc47797ae45c461dd6df2), [prediction table](https://github.com/SdBenE/MarketTesting/commit/45dc0dc8abaa64d062099e33e069bfdfc412046b).
- Per-ticker scaling and loss protection: [model update](https://github.com/SdBenE/MarketTesting/commit/122e94755fe7b8cfd834489a7a080f6fb9783d16).
- Package restructuring and broader ingestion: [src package organization](https://github.com/SdBenE/MarketTesting/commit/79f6e126636b6706006b147a128676d5668054ce), [VIX retrieval](https://github.com/SdBenE/MarketTesting/commit/69382c36410caf1df59765ff69a30f98df84bb09), and [general CSV ingestion](https://github.com/SdBenE/MarketTesting/commit/19c71f5dc8ba8f16db827237c98c7478aae07cc2).

The reviewed modules include a StockModel, CSV/yfinance pull paths, and training functions. The project demonstrates iterative development and data handling. It does not establish forecast accuracy, investment usefulness, or trading performance. The vault contains a historical NaN validation-loss troubleshooting discussion, so avoid implying model quality unless new evaluation supports it.

### Public link

The vault identifies the repository as [SdBenE/MarketTesting](https://github.com/SdBenE/MarketTesting). The earlier portfolio brief has a link under a different GitHub owner. Use the repository link in the vault until the canonical owner or redirect is confirmed.

## Source index

Paths are relative to the active Obsidian vault.

- Projects/Aerospace/FSW-UAV-SIM/Development Status and Validation.md — integrated state, reviewed commit, checks, limitations, validation gates.
- Projects/Aerospace/FSW-UAV-SIM/2026-10-15 Codebase Hardening Milestone.md — project role, AI contribution context, work priorities, and review scope.
- Projects/Aerospace/FSW-UAV-SIM/Aero CAD and Data Pipeline.md — aero and CAD capabilities, source files, assumptions, and draft-data limitations.
- Projects/Software/MarketTesting.md — authorship history, feature contributions, representative commits, and performance boundary.
- PORTFOLIO-CONTENT.md in the website repository — existing summary to reconcile against this expanded evidence before using it.
