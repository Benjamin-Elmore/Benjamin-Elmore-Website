# Benjamin Elmore portfolio site

Ben's public portfolio. It is a static site in plain HTML and CSS, with no framework and no build step. GitHub Pages serves it from `docs/` on `main`.

## Sources of truth
- **Content:** `PORTFOLIO-CONTENT.md` is the editorial brief. Every fact on the site comes from it, written in Ben's voice. Follow its limits on claims: no deployment, throughput, latency, reliability or forecasting-accuracy claims; date and attribute the verification results; credit the team and AI-assisted work.
- **Sources:** `PORTFOLIO-RESEARCH.md` lists the local evidence behind the brief.
- **Not published:** both handoff files and `work/` stay outside `docs/`. Nothing under `docs/` may link to them or copy them.

## Layout
- `docs/`: the published site (`index.html`, `assets/`). Only this folder is public on Pages.
- `tools/`: the site checks (Python standard library only, Python 3.12-compatible).
- `.github/workflows/`: CI that runs the checks on every pull request.
- `work/`: `RUN-STATE.md` (the status board) and `reviews/`.

## Dev cycle (same as FSW-UAV-SIM, without work packets)
Each queue runs on a `dev-MM-DD-YY` branch from `main` with one draft PR to `main`. Ben merges; agents never merge.
1. **Plan:** the architect writes `work/PLAN.md`: files, one writer per file, order, acceptance checks and reviewers.
2. **Build:** implementers and the test engineer work in parallel, each writing only its own files. The tests come from the plan, not from the code.
3. **Verify:** the test engineer runs every check and reports PASS / FAIL / UNRUN honestly.
4. **Review:** a code reviewer (effort high) plus a content reviewer, which checks claims against the brief. Reviews go in `work/reviews/`.
5. **Fix loop:** findings go back to the file's owner, then tests and reviewers run again.
6. **Validate changes:** an Opus validator runs over the queue's changes (`DEV-VAL-n`, petitions `DEV-VAL-n.k`) until it returns SATISFIED.
7. **Validate codebase:** the Validation Council (analyst, challenger, chair; all Opus) runs over the whole repo at the branch tip until the chair returns SATISFIED. The register is `work/reviews/VAL-register.md`. If the loop stops converging, stop it, note the stalled IDs for Ben and move on.
8. **Complete PR:** CI green, then a PR description with what changed, the validation verdicts and what Ben needs to do. Ben merges.

## Rules
- Do not put `Co-Authored-By` trailers or "Generated with Claude Code" lines in commits, PRs or comments.
- Don't prompt the terminal mid-queue. Take the sensible default, record it in RUN-STATE and continue.
- Every agent that clones uses its own uniquely named scratch folder and never deletes a folder it didn't create.
- GitHub auth: `git -c credential.helper= -c 'credential.helper=!gh auth git-credential' push`.
- Reply format for Ben: short, with Done / Blocked / Needs Ben headers. Expand acronyms on first use.
