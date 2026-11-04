"""Self-test for tools/check_site.py (PLAN.md section 4).

A minimal fixture site that passes every check is written to a temp dir; each
mutation test then breaks exactly one check and asserts that only that check
fails. A final test runs the checker against the real docs/ tree.

Run: python -m unittest tools/test_check_site.py -v
"""

from __future__ import annotations

import sys
import tempfile
import unittest
from pathlib import Path
from typing import Callable

sys.path.insert(0, str(Path(__file__).resolve().parent))
import check_site  # noqa: E402

REPO_DOCS = Path(__file__).resolve().parent.parent / "docs"
ALL_IDS = [cid for cid, _ in check_site.CHECKS]

INDEX_HTML = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Benjamin Elmore | Embedded and robotics software</title>
<meta name="description" content="Benjamin Elmore, computer science student and robotics software engineer working on embedded firmware.">
<meta property="og:title" content="Benjamin Elmore">
<meta property="og:description" content="Embedded and robotics software portfolio.">
<meta property="og:type" content="website">
<meta property="og:url" content="https://benjamin-elmore.github.io/Benjamin-Elmore-Website/">
<link rel="canonical" href="https://benjamin-elmore.github.io/Benjamin-Elmore-Website/">
<meta name="color-scheme" content="light dark">
<link rel="stylesheet" href="assets/site.css">
<script src="assets/site.js"></script>
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header"><a class="site-header__name" href="#top">Benjamin Elmore</a>
<nav class="site-nav" aria-label="Sections"><ul class="site-nav__list">
<li><a href="#arc">ARC</a></li><li><a href="#contact">Contact</a></li>
</ul></nav>
<button class="theme-toggle" type="button" hidden aria-pressed="false">Dark theme</button>
</header>
<main id="main">
<section id="top" class="section section--intro" aria-labelledby="intro-title">
<h1 id="intro-title" class="intro__name">Benjamin Elmore</h1>
<p class="intro__role">Computer science student and robotics software engineer</p>
<ul class="link-list intro__links"><li><a href="https://github.com/Benjamin-Elmore" rel="noopener">GitHub</a></li>
<li><a href="https://www.linkedin.com/in/benjamin-n-elmore/" rel="noopener">LinkedIn</a></li></ul>
</section>
<section id="arc" class="section case-study" aria-labelledby="arc-title">
<h2 id="arc-title" class="section__title">ARC sensor firmware</h2>
<figure class="figure figure--diagram" id="arc-architecture">
<img src="assets/arc-architecture.svg" width="960" height="360" alt="Block diagram of the intended ARC system architecture." loading="lazy" decoding="async">
<figcaption class="figure__caption">Intended system architecture.</figcaption>
<ol class="figure__steps"><li>The ESP32-S3 talks to the V5 Brain over half-duplex RS-485.</li></ol>
</figure>
<div class="case-study__block" id="arc-verification">
<h3>Verification so far</h3>
<ul class="evidence-list">
<li class="evidence"><p class="evidence__date"><time datetime="2026-11-03">November 3, 2026</time></p>
<p class="evidence__text">Built <code>3eb3ed6</code> with a flash warning (8 MB expected, 2 MB configured). No hardware test was run.</p></li>
<li class="evidence"><p class="evidence__date"><time datetime="2026-10-28">October 28, 2026</time></p>
<p class="evidence__text">Commit <code>cef105f</code> records protocol checks.</p></li>
</ul>
<h4>Open work</h4>
<ul class="open-work"><li>Optical bring-up.</li></ul>
</div>
<p class="case-study__repo"><a href="https://github.com/Benjamin-Elmore/ARC" rel="noopener">ARC on GitHub</a></p>
</section>
<section id="experience" class="section" aria-labelledby="experience-title">
<h2 id="experience-title" class="section__title">Experience</h2>
<p class="role__title">Software Engineer, <time datetime="2025-09">September 2025</time>; Vice President, <time datetime="2026-10">October 2026</time></p>
</section>
<section id="projects" class="section" aria-labelledby="projects-title">
<h2 id="projects-title" class="section__title">Projects</h2>
<article class="card"><h3 class="card__title">FSW-UAV-SIM</h3>
<p class="card__body">A staged prototype; AI-assisted implementation.</p></article>
<article class="card"><h3 class="card__title">MarketTesting</h3>
<p class="card__link"><a href="https://github.com/Benjamin-Elmore/MarketTesting" rel="noopener">MarketTesting on GitHub</a></p></article>
</section>
<section id="skills" class="section" aria-labelledby="skills-title">
<h2 id="skills-title" class="section__title">Skills</h2>
<ul class="tag-list"><li class="tag">C/C++</li></ul>
</section>
<section id="education" class="section" aria-labelledby="education-title">
<h2 id="education-title" class="section__title">Education</h2>
<p class="meta">Expected May 2029</p>
</section>
<section id="contact" class="section" aria-labelledby="contact-title">
<h2 id="contact-title" class="section__title">Contact</h2>
<p class="section__lede">Find me on GitHub or LinkedIn.</p>
</section>
</main>
<footer class="site-footer"><p>Benjamin Elmore, 2026</p></footer>
</body>
</html>
"""

SITE_CSS = """/* Contrast ratios recorded here. */
:root {
  --color-bg: #ffffff; --color-surface: #f5f5f5; --color-text: #111111;
  --color-muted: #555555; --color-accent: #0050a0; --color-border: #cccccc;
  --color-focus: #0050a0; --color-code-bg: #eeeeee;
  --font-sans: system-ui, sans-serif; --font-mono: ui-monospace, monospace;
  --measure: 65ch; --page-max: 72rem; --gutter: 16px;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --color-bg: #111111; --color-surface: #1c1c1c; --color-text: #eeeeee;
    --color-muted: #bbbbbb; --color-accent: #8cc4ff; --color-border: #444444;
    --color-focus: #8cc4ff; --color-code-bg: #222222;
  }
}
:root[data-theme="dark"] {
  --color-bg: #111111; --color-surface: #1c1c1c; --color-text: #eeeeee;
  --color-muted: #bbbbbb; --color-accent: #8cc4ff; --color-border: #444444;
  --color-focus: #8cc4ff; --color-code-bg: #222222;
}
@import url("print.css") print;
body { background: var(--color-bg); color: var(--color-text); }
a:focus-visible { outline: 3px solid var(--color-focus); }
@media (prefers-reduced-motion: reduce) { * { transition: none; } }
"""

SITE_JS = """(function () {
  try { var t = localStorage.getItem('theme'); if (t) document.documentElement.dataset.theme = t; } catch (e) {}
})();
"""

SVG = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 360" role="img">
<title>Intended system architecture</title>
<desc>Sensors to I2C mux to ESP32-S3 to VEX V5 Brain over half-duplex RS-485.</desc>
<rect width="960" height="360" fill="#0b1f3a"/>
<text x="20" y="40" font-size="20" fill="#ffffff">Intended system architecture</text>
<text x="20" y="80" font-size="18" fill="#ffffff">I²C</text>
<text x="200" y="80" font-size="18" fill="#ffffff">ESP32-S3</text>
<text x="400" y="80" font-size="18" fill="#ffffff">half-duplex RS-485</text>
<text x="700" y="80" font-size="18" fill="#ffffff">V5 Brain</text>
</svg>
"""

BASE_FILES: dict[str, str] = {
    "index.html": INDEX_HTML,
    ".nojekyll": "",
    "assets/site.css": SITE_CSS,
    "assets/site.js": SITE_JS,
    "assets/arc-architecture.svg": SVG,
}

Files = dict[str, "str | bytes | None"]


def edit(files: Files, path: str, old: str, new: str) -> None:
    text = files[path]
    assert isinstance(text, str) and text.count(old) == 1, f"fixture edit anchor not unique in {path}: {old!r}"
    files[path] = text.replace(old, new)


class CheckerFixtureTest(unittest.TestCase):
    def run_fixture(self, mutate: Callable[[Files], None] | None = None) -> dict[str, tuple[bool, str]]:
        files: Files = dict(BASE_FILES)
        if mutate:
            mutate(files)
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp) / "docs"
            for rel, content in files.items():
                if content is None:
                    continue
                path = root / rel
                path.parent.mkdir(parents=True, exist_ok=True)
                if isinstance(content, bytes):
                    path.write_bytes(content)
                else:
                    path.write_text(content, encoding="utf-8", newline="\n")
            results = check_site.run_checks(root)
        self.assertEqual([r[0] for r in results], ALL_IDS)
        return {cid: (ok, detail) for cid, ok, detail in results}

    def assert_only_fails(self, cid: str, mutate: Callable[[Files], None]) -> str:
        results = self.run_fixture(mutate)
        failed = {k: d for k, (ok, d) in results.items() if not ok}
        self.assertEqual(set(failed), {cid}, f"expected only {cid} to fail, got {failed}")
        return failed[cid]

    def assert_all_pass(self, mutate: Callable[[Files], None] | None = None) -> None:
        results = self.run_fixture(mutate)
        failed = {k: d for k, (ok, d) in results.items() if not ok}
        self.assertEqual(failed, {}, "fixture should pass every check")

    # -- baseline ---------------------------------------------------------
    def test_valid_fixture_passes_all(self):
        self.assert_all_pass()
        self.assertEqual(len(ALL_IDS), 19)

    # -- one mutation per check ------------------------------------------
    def test_c01_missing_nojekyll(self):
        detail = self.assert_only_fails("C01", lambda f: f.update({".nojekyll": None}))
        self.assertIn(".nojekyll", detail)

    def test_c01_unclosed_tag(self):
        detail = self.assert_only_fails(
            "C01", lambda f: edit(f, "index.html", "<p class=\"meta\">Expected May 2029</p>",
                                  "<p class=\"meta\"><span>Expected May 2029</p>"))
        self.assertIn("span", detail)

    def test_c02_short_description(self):
        detail = self.assert_only_fails("C02", lambda f: edit(
            f, "index.html",
            'content="Benjamin Elmore, computer science student and robotics software engineer working on embedded firmware."',
            'content="Too short."'))
        self.assertIn("description", detail)

    def test_c03_duplicate_id(self):
        detail = self.assert_only_fails("C03", lambda f: edit(
            f, "index.html", "<p class=\"section__lede\">", "<p class=\"section__lede\" id=\"arc-title\">"))
        self.assertIn("arc-title", detail)

    def test_c04_dangling_fragment(self):
        detail = self.assert_only_fails("C04", lambda f: edit(
            f, "index.html", "<li><a href=\"#contact\">Contact</a></li>",
            "<li><a href=\"#contact\">Contact</a></li><li><a href=\"#nowhere\">X</a></li>"))
        self.assertIn("#nowhere", detail)

    def test_c05_section_order(self):
        def swap(f):
            html = f["index.html"]
            skills = html[html.index('<section id="skills"'):html.index('<section id="education"')]
            edu = html[html.index('<section id="education"'):html.index('<section id="contact"')]
            f["index.html"] = html.replace(skills + edu, edu + skills)
        detail = self.assert_only_fails("C05", swap)
        self.assertIn("order", detail)

    def test_c05_heading_skip(self):
        detail = self.assert_only_fails("C05", lambda f: edit(
            f, "index.html", "<h4>Open work</h4>", "<h5>Open work</h5>"))
        self.assertIn("h5", detail)

    def test_c06_skip_link_not_first(self):
        detail = self.assert_only_fails("C06", lambda f: edit(
            f, "index.html", "<body>\n", "<body>\n<a href=\"#top\">Home</a>\n"))
        self.assertIn("skip-link", detail)

    def test_c06_second_footer(self):
        detail = self.assert_only_fails("C06", lambda f: edit(
            f, "index.html", "<p class=\"meta\">Expected May 2029</p>",
            "<p class=\"meta\">Expected May 2029</p><footer>x</footer>"))
        self.assertIn("footer", detail)

    def test_c07_img_without_alt(self):
        detail = self.assert_only_fails("C07", lambda f: edit(
            f, "index.html", 'alt="Block diagram of the intended ARC system architecture." ', ""))
        self.assertIn("alt", detail)

    def test_c07_root_absolute_path(self):
        detail = self.assert_only_fails("C07", lambda f: edit(
            f, "index.html", 'href="assets/site.css"', 'href="/assets/site.css"'))
        self.assertIn("root-absolute", detail)

    def test_c07_missing_local_file(self):
        detail = self.assert_only_fails("C07", lambda f: edit(
            f, "index.html", 'href="assets/site.css"', 'href="assets/missing.css"'))
        self.assertIn("missing.css", detail)

    def test_c08_unlisted_url(self):
        detail = self.assert_only_fails("C08", lambda f: edit(
            f, "index.html", 'href="https://github.com/Benjamin-Elmore" rel', 'href="https://example.com/" rel'))
        self.assertIn("example.com", detail)

    def test_c08_site_url_outside_canonical(self):
        detail = self.assert_only_fails("C08", lambda f: edit(
            f, "index.html", 'href="https://github.com/Benjamin-Elmore" rel',
            'href="https://benjamin-elmore.github.io/Benjamin-Elmore-Website/" rel'))
        self.assertIn("og:url/canonical", detail)

    def test_c08_css_remote_url(self):
        detail = self.assert_only_fails("C08", lambda f: edit(
            f, "assets/site.css", "body { background: var(--color-bg);",
            "body { background: var(--color-bg) url(http://example.com/x.png);"))
        self.assertIn("http://", detail)

    def test_c09_fsw_url_in_text(self):
        detail = self.assert_only_fails("C09", lambda f: edit(
            f, "index.html", "A staged prototype;", "github.com/Benjamin-Elmore/FSW-UAV-SIM A staged prototype;"))
        self.assertIn("FSW", detail)

    def test_c10_work_file_reference(self):
        detail = self.assert_only_fails("C10", lambda f: edit(
            f, "index.html", "Find me on GitHub", "See PLAN.md. Find me on GitHub"))
        self.assertIn("PLAN.md", detail)

    def test_c10_markdown_file(self):
        detail = self.assert_only_fails("C10", lambda f: f.update({"notes.md": "hi"}))
        self.assertIn("notes.md", detail)

    def test_c11_phone_number(self):
        detail = self.assert_only_fails("C11", lambda f: edit(
            f, "index.html", "Find me on GitHub", "Call (951) 555-0142 or find me on GitHub"))
        self.assertIn("phone", detail)

    def test_c11_email(self):
        detail = self.assert_only_fails("C11", lambda f: edit(
            f, "index.html", "Find me on GitHub", "Write to ben.elmore@example.com or find me on GitHub"))
        self.assertIn("ben.elmore@example.com", detail)

    def test_c12_handler_attribute(self):
        detail = self.assert_only_fails("C12", lambda f: edit(
            f, "index.html", "<p class=\"section__lede\">", "<p class=\"section__lede\" onclick=\"go()\">"))
        self.assertIn("onclick", detail)

    def test_c12_inline_script(self):
        detail = self.assert_only_fails("C12", lambda f: edit(
            f, "index.html", "</body>", "<script>var x = 1;</script>\n</body>"))
        self.assertIn("inline", detail)

    def test_c12_svg_script(self):
        detail = self.assert_only_fails("C12", lambda f: edit(
            f, "assets/arc-architecture.svg", "</svg>", "<script>/* x */</script>\n</svg>"))
        self.assertIn("<script", detail)

    def test_c13_forbidden_phrase(self):
        detail = self.assert_only_fails("C13", lambda f: edit(
            f, "index.html", "Optical bring-up.", "Optical bring-up of a ROBUST bus."))
        self.assertIn("robust", detail)

    def test_c13_forbidden_phrase_in_alt(self):
        detail = self.assert_only_fails("C13", lambda f: edit(
            f, "index.html", 'alt="Block diagram', 'alt="Proven block diagram'))
        self.assertIn("proven", detail)

    def test_c13_forbidden_phrase_in_svg(self):
        detail = self.assert_only_fails("C13", lambda f: edit(
            f, "assets/arc-architecture.svg", ">V5 Brain<", ">V5 Brain, low-latency<"))
        self.assertIn("latency", detail)

    def test_c13_allow_exempts_phrase(self):
        def mutate(f):
            edit(f, "index.html", "Optical bring-up.", "Optical bring-up is robust.")
        original = dict(check_site.ALLOW)
        check_site.ALLOW["robust"] = "test exemption"
        try:
            self.assert_all_pass(mutate)
        finally:
            check_site.ALLOW.clear()
            check_site.ALLOW.update(original)

    def test_c14_missing_fact(self):
        detail = self.assert_only_fails("C14", lambda f: edit(
            f, "index.html", "Expected May 2029", "Expected 2029"))
        self.assertIn("May 2029", detail)

    def test_c15_link_in_wrong_section(self):
        def move(f):
            link = '<p class="card__link"><a href="https://github.com/Benjamin-Elmore/MarketTesting" rel="noopener">MarketTesting on GitHub</a></p>'
            edit(f, "index.html", link, "")
            edit(f, "index.html", '<ul class="tag-list">', link + '<ul class="tag-list">')
        detail = self.assert_only_fails("C15", move)
        self.assertIn("#projects", detail)

    def test_c15_fsw_link_in_projects(self):
        detail = self.assert_only_fails("C15", lambda f: edit(
            f, "index.html", "<h3 class=\"card__title\">FSW-UAV-SIM</h3>",
            "<h3 class=\"card__title\"><a href=\"#projects\">FSW-UAV-SIM</a></h3>"))
        self.assertIn("FSW", detail)

    def test_c16_missing_reduced_motion(self):
        detail = self.assert_only_fails("C16", lambda f: edit(
            f, "assets/site.css", "@media (prefers-reduced-motion: reduce) { * { transition: none; } }", ""))
        self.assertIn("prefers-reduced-motion", detail)

    def test_c16_dark_block_missing_token(self):
        detail = self.assert_only_fails("C16", lambda f: edit(
            f, "assets/site.css",
            "  --color-focus: #8cc4ff; --color-code-bg: #222222;\n}\n@import",
            "  --color-focus: #8cc4ff;\n}\n@import"))
        self.assertIn("--color-code-bg", detail)

    def test_c17_low_contrast(self):
        detail = self.assert_only_fails("C17", lambda f: edit(
            f, "assets/site.css", "--color-muted: #555555;", "--color-muted: #aaaaaa;"))
        self.assertIn("--color-muted", detail)

    def test_c17_non_hex_token(self):
        detail = self.assert_only_fails("C17", lambda f: edit(
            f, "assets/site.css", "--color-muted: #555555;", "--color-muted: rgb(85, 85, 85);"))
        self.assertIn("not #rgb/#rrggbb", detail)

    def test_c18_missing_desc(self):
        detail = self.assert_only_fails("C18", lambda f: edit(
            f, "assets/arc-architecture.svg",
            "<desc>Sensors to I2C mux to ESP32-S3 to VEX V5 Brain over half-duplex RS-485.</desc>\n", ""))
        self.assertIn("desc", detail)

    def test_c19_over_budget(self):
        detail = self.assert_only_fails("C19", lambda f: f.update({"assets/pad.bin": b"\0" * (300 * 1024)}))
        self.assertIn("budget", detail)

    def test_c19_js_over_budget(self):
        detail = self.assert_only_fails("C19", lambda f: f.update(
            {"assets/site.js": SITE_JS + "/*" + "x" * 3100 + "*/\n"}))
        self.assertIn("site.js", detail)

    # -- false-positive guards (all must still pass) ----------------------
    def test_no_false_positives(self):
        def mutate(f):
            edit(f, "index.html", "Find me on GitHub or LinkedIn.",
                 "Commit 1a2b3c4d5e6f7a8b9c0d at 2026-11-03, years 2025 - 2026, 8 MB, "
                 "resumed work, unproven, reliably, framework/ notes, RS-485 at 115200. "
                 "Find me on GitHub or LinkedIn.")
            edit(f, "index.html", '<time datetime="2026-11-03">',
                 '<time datetime="2026-11-03T10:00:00-08:00">')
            edit(f, "assets/site.css", "@import url(\"print.css\") print;",
                 "@import url(\"print.css\") print;\n@media (min-width: 40em) { body { margin: 0; } }")
        self.assert_all_pass(mutate)

    def test_phone_and_email_helpers(self):
        self.assertEqual(check_site.find_phones("hash 3eb3ed6 and cef105f, May 2029"), [])
        self.assertEqual(check_site.find_phones("2026-11-03 and 2025 - 2026"), [])
        self.assertEqual(check_site.find_phones("+1 951 555 0142"), ["+1 951 555 0142"])
        self.assertEqual(check_site.find_emails("img logo@2x.png"), [])
        self.assertEqual(check_site.find_emails("me@x.io"), ["me@x.io"])


class RealDocsTest(unittest.TestCase):
    def test_real_docs_pass(self):
        if not (REPO_DOCS / "index.html").is_file():
            self.skipTest(f"{REPO_DOCS / 'index.html'} does not exist yet")
        results = check_site.run_checks(REPO_DOCS)
        failed = [f"{cid} {detail}" for cid, ok, detail in results if not ok]
        self.assertEqual(failed, [], "real docs/ fails:\n" + "\n".join(failed))


if __name__ == "__main__":
    unittest.main()
