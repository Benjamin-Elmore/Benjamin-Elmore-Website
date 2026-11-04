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
6. **Validate changes:** an Opus validator runs over the queue's changes (`DEV-VAL-n`, petitions `DEV-VAL-n.k`) until it returns SATISFIED. This includes the **visual appeal check** below.
7. **Validate codebase:** the Validation Council (analyst, challenger, chair; all Opus) runs over the whole repo at the branch tip until the chair returns SATISFIED. A dedicated **visual analyst** runs the visual appeal check on the whole site in every council run. The challenger confirms its findings like any other candidate. The register is `work/reviews/VAL-register.md`. If the loop stops converging, stop it, note the stalled IDs for Ben and move on.

### Visual appeal check (Ben, 2026-11-03)
This check runs in both validation phases. A validator that hasn't looked at the rendered page can't return SATISFIED.
- **Render:** headless Edge (`C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`, with its own `--user-data-dir` in the agent's unique scratch folder) takes full-page screenshots at 360px and 1280px, in both the light and the dark theme. That makes four shots, plus a crop of the diagram at 360px. Headless Edge renders wider than asked at 360px, so for the phone shots load the page inside a 360px-wide iframe wrapper page (or use an equivalent method that gives the true width). Read every PNG. If rendering fails, the check is UNRUN, which is never a pass.
- **Rubric:** each item gets a PASS or a petition with a screenshot reference.
  1. First impression: within 5 seconds a reader sees who Ben is, what he does, and that ARC is the main story.
  2. Hierarchy: headings, ledes and body text are clearly ranked, and the ARC case study reads as the centerpiece.
  3. Typography: a comfortable measure and line height, consistent sizes and weights, and no orphaned single words in headings where that's avoidable.
  4. Spacing and alignment: consistent vertical rhythm, aligned edges, and no cramped or floating blocks.
  5. Color: a restrained palette and an accent with a purpose. Both themes look intentional, not merely inverted.
  6. Components: the decision cards, evidence log, tags, cards and nav look like one system.
  7. Diagram: the labels are legible at 360px (about 12px rendered text at minimum) and the diagram sits well in both themes.
  8. Mobile: no horizontal scroll or clipping, the nav is usable, and tap targets are at least 44px.
  9. Polish: no broken images, stray borders, overflow, unstyled elements or placeholder text.
- **Bar:** the page should look like a carefully made engineering portfolio, not a default template. Taste-only nits are Minor and don't block. Anything that makes the page look broken, unfinished or hard to read is Major.
- Screenshots go in the agent's scratch folder, and the report in `work/reviews/` lists their paths.
8. **Complete PR:** CI green, then a PR description with what changed, the validation verdicts and what Ben needs to do. Ben merges.

## Rules
- Do not put `Co-Authored-By` trailers or "Generated with Claude Code" lines in commits, PRs or comments.
- Don't prompt the terminal mid-queue. Take the sensible default, record it in RUN-STATE and continue.
- Every agent that clones uses its own uniquely named scratch folder and never deletes a folder it didn't create.
- GitHub auth: `git -c credential.helper= -c 'credential.helper=!gh auth git-credential' push`.
- Reply format for Ben: short, with Done / Blocked / Needs Ben headers. Expand acronyms on first use.
