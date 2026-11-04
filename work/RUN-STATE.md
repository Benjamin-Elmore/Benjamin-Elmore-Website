# Portfolio site: run state

## 11-03-26 Queue: initial framework (Ben, 2026-11-03)
Ben asked: "go ahead and build it. Let's start with the initial framework like you outlined. Use the same dev cycle that we use in FSW UAV sim but w/o the work packets".

- Branch `dev-11-03-26` (from `main` e22552a), with a draft PR to `main`.
- Scope: a single-page site in `docs/` following the outline (intro, ARC case study, experience, other projects, skills, education and contact), along with site checks and CI.
- **Lead defaults** (Ben can override): plain HTML/CSS; Pages from `main` `/docs`; the architecture diagram is a clean inline-SVG redraw of the four generic blocks (the team PlantUML stays unpublished); no résumé download; default `github.io` URL; the handoff `.md` files stay at the repo root (not published; whether to move them out of the public repo is Ben's call).

| # | Phase | Item | State | Next action |
|---|---|---|---|---|
| 1 | Plan | Architect plan, `work/PLAN.md` | **Done**, no Gate A blockers | — |
| 2 | Build | content, style, diagram, test engineers (parallel) | in progress | — |
| 3 | Verify / Review / Fix | Checks, code and content review | pending | — |
| 4 | Validate changes | DEV-VAL-n + visual appeal check | pending | — |
| 5 | Validate codebase | Validation Council + visual analyst | pending | — |
| 6 | Complete PR | CI green, description; Ben merges | pending | — |

## portfolio-findings branch (Ben, 2026-11-03; 09d157b)
Review: `work/reviews/FINDINGS-portfolio-findings.md` (13 new facts, 9 corrections with 2 Major). Its fixes go into fix round 1. **Lead defaults** for its Needs Ben items (Ben can override):
- B1: link the repo root and state that the verified build is the public `CPPDev` branch at `3eb3ed6`, with `main` a different revision. The brief and PLAN rule are corrected to match.
- B2: no team-repo links or teammate names; earlier VEX work stays as prose only.
- B3: no commit count for MarketTesting.
- B4: FSW role is "coordinate … own the C++/simulation integration decisions", with a mechanical engineer and AI agents credited.
- B5: no bring-up labels on the diagram this queue.
- B6: "A local check on November 3, 2026" (neutral; doesn't claim who ran it).

## Needs Ben (after merge)
- Turn on Pages: Settings → Pages → Deploy from branch `main`, folder `/docs`.
