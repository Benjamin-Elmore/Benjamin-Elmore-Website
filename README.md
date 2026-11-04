# Benjamin Elmore: portfolio site

This is the source for my portfolio, a single page covering embedded firmware for physical systems. The main section is a case study of ARC, the C++ sensor firmware for the CBU1 VEX U team's ARSENAL board.

**Live site:** https://benjamin-elmore.github.io/Benjamin-Elmore-Website/ (once GitHub Pages is turned on; see [Publishing](#publishing))

## What's here

| Path | What it is |
|---|---|
| `docs/` | **The published site.** GitHub Pages serves only this folder. |
| `docs/index.html` | All markup and copy |
| `docs/assets/site.css` | Styles, design tokens, light and dark themes |
| `docs/assets/site.js` | The theme toggle; that's all it does |
| `docs/assets/arc-architecture*.svg` | The ARC architecture diagram: a wide version and a stacked one for phones |
| `tools/check_site.py` | Site checks: structure, links, claims, privacy, contrast, size |
| `tools/test_check_site.py` | Self-test for the checker |
| `.github/workflows/site-checks.yml` | CI that runs both on every pull request and every push to `main` |
| `PORTFOLIO-CONTENT.md`, `PORTFOLIO-RESEARCH.md` | Editorial brief and source index (never published) |
| `work/` | Dev-cycle records: `RUN-STATE.md`, `PLAN.md`, `reviews/` (never published) |
| `CLAUDE.md` | Project rules and the dev cycle used to build the site |

The site is plain HTML and CSS. There's no framework, build step, external script, web font or analytics.

## Preview locally

Open `docs/index.html` in a browser, or serve the folder:

```sh
python -m http.server --directory docs 8000
# then open http://localhost:8000
```

## Run the checks

You need Python 3.12 or newer. The tools use the standard library only.

```sh
python -m unittest tools/test_check_site.py -v   # checker self-test
python tools/check_site.py                       # site checks (C01–C19), exits 1 on any FAIL
```

The checks enforce what the site is allowed to say and link to, as well as how it's built. Examples:
- the required dates, commit hashes and AI-assisted credit appear on the page
- no forbidden claims (throughput, latency, reliability, "validated" and similar)
- external links come from an allowlist
- no email or phone number
- WCAG AA contrast in both themes

To change the copy, edit `docs/index.html` and re-run the checks. The facts come from `PORTFOLIO-CONTENT.md`, as corrected by `work/reviews/FINDINGS-portfolio-findings.md`.

## Publishing

1. Merge into `main`.
2. In the repository settings, go to **Pages** and choose **Deploy from a branch**, then branch `main`, folder `/docs`.

`docs/.nojekyll` makes Pages serve the files as they are. All asset paths are relative, so the site works at the project-site URL.

## How it's built

Changes go through the same agent dev cycle as FSW-UAV-SIM, without the work packets:
1. Plan
2. Parallel build with independent tests
3. Verify
4. Code and content review, then a fix loop
5. Validate the changes
6. Validation Council over the whole repo

Both validation phases include a visual appeal check, done from screenshots at phone and desktop widths in both themes. Each queue runs on a `dev-MM-DD-YY` branch with one PR, and I review and merge. See `CLAUDE.md` for the full process and `work/RUN-STATE.md` for the current status.

## Contact

[GitHub](https://github.com/Benjamin-Elmore) · [LinkedIn](https://www.linkedin.com/in/benjamin-n-elmore/)
