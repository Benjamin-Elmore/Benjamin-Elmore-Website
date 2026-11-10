# Benjamin Elmore: portfolio site

React (Vite + React Router) pre-rendered to static HTML. Source is in `site/`; the build output is `docs/`, committed, and is what GitHub Pages serves (`main` `/docs`). Live at https://benjamin-elmore.github.io/Benjamin-Elmore-Website/.

Pages (routes): `/`, `/ARC/`, `/MarketTesting/`, `/CBU-Robotics/`, `/In-N-Out/`, `/LEGOLAND/`, `/About/`, `/Notes/` (index plus three notes), plus `404.html`. Page content is in `site/src/pages/`; shared styles and the theme script are in `site/public/assets/`.

Run it:
- Dev server: `cd site && npm ci && npm run dev`
- Build into `docs/`: `cd site && npm run build` (commit the result; CI fails if `docs/` differs from a fresh build)
- Preview the build: `cd site && npm run preview`. For a Pages-faithful local server (redirects and 404.html), run `python tools/pages_server.py --root docs`.

Checks: `python tools/check_site.py` (also runs in CI, with a headless click-through). To also flag private names, set `PRIVATE_NAMES` (comma separated) or list them in a gitignored `tools/private-names.txt`.

Swapping in a photo: each photo slot is a JSX comment in the page source (`site/src/pages/*.jsx`) naming the file path. Put the image in `site/public/assets/photos/`, replace the dashed `.photo-slot__box` div with an `<img>` for that path (add `alt`, `width`, `height`), keep the caption, then run `npm run build`. The serial-output slot on the ARC page is a `<pre>` block: paste in real captured output.
