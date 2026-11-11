# Benjamin Elmore: portfolio site

Portfolio of Benjamin Elmore, a computer science student seeking embedded, autonomy and flight-software work. The site covers the ARC project overview, market testing, CBU Robotics, an About page and a photo Gallery organised into sets with filter buttons.

## Stack

React with React Router, built by Vite. Source is in `site/`. The build pre-renders each route to static HTML in `docs/`, which is committed. The site is dark-only by design.

Routes: `/`, `/ARC/`, `/MarketTesting/`, `/CBU-Robotics/`, `/In-N-Out/`, `/LEGOLAND/`, `/About/`, `/Gallery/`, plus `404.html`. Page content is in `site/src/pages/`; shared styles and scripts are in `site/public/assets/`.

## Build

```
cd site
npm ci
npm run build
```

The build writes to `docs/`. Commit the result; CI fails if `docs/` differs from a fresh build. `npm run dev` starts the dev server.

## Checks

```
python tools/check_site.py
node tools/clickthrough.mjs --browser "<path to Edge or Chrome>" --profile "<empty directory>" --root docs
```

`check_site.py` validates the built pages (titles, canonical and og tags, links, copy rules). `clickthrough.mjs` drives headless Edge or Chrome against a local Pages-faithful server (`tools/pages_server.py`). Both run in CI.

## Hosting

GitHub Pages serves the `main` branch, `/docs` folder, at https://benjamin-elmore.github.io/Benjamin-Elmore-Website/. The Vite base path is `/Benjamin-Elmore-Website/`, and `docs/.nojekyll` disables Jekyll processing.
