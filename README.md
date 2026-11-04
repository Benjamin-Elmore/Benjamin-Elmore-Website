# Benjamin Elmore: portfolio site

Static HTML and CSS, no build step. Live at https://benjamin-elmore.github.io/Benjamin-Elmore-Website/ (GitHub Pages, `main` `/docs`).

Pages (all in `docs/`): `index.html`, `ARC/`, `MarketTesting/`, `CBU-Robotics/`, `In-N-Out/`, `LEGOLAND/`. Shared styles and the theme toggle are in `docs/assets/`.

Preview: `cd docs && python -m http.server`, then open http://localhost:8000/.

Checks: `python tools/check_site.py` (also runs in CI). To also flag private names, set `PRIVATE_NAMES` (comma separated) or list them in a gitignored `tools/private-names.txt`.

Swapping in a photo: each `.photo-slot` figure has an HTML comment with the file path. Put the image in `docs/assets/photos/`, replace the dashed `.photo-slot__box` div with an `<img>` for that path (add `alt`, `width`, `height`) and keep the caption. The serial-output slot on the ARC page is a `<pre>` block: paste in real captured output.
