#!/usr/bin/env python3
"""Static checks for the portfolio site (stdlib only). Run from anywhere: python tools/check_site.py

Set SITE_DOCS_DIR to check a build somewhere other than docs/.
"""
import json
import os
import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urldefrag, urlparse

ROOT = Path(__file__).resolve().parent.parent
DOCS = Path(os.environ.get("SITE_DOCS_DIR") or ROOT / "docs").resolve()
BASE = "/Benjamin-Elmore-Website/"
SITE_URL = "https://benjamin-elmore.github.io/Benjamin-Elmore-Website/"
NOT_FOUND = "404.html"
PAGES = ["index.html", "ARC/index.html", "MarketTesting/index.html",
         "CBU-Robotics/index.html", "In-N-Out/index.html", "LEGOLAND/index.html",
         "About/index.html", "Notes/index.html", "Gallery/index.html", "Notes/i2c-bus-sharing/index.html",
         "Notes/rs485-bring-up/index.html", "Notes/false-status-flag/index.html"]
FONTS = ["assets/fonts/IBMPlexSans-400.woff2", "assets/fonts/IBMPlexSans-600.woff2", "assets/fonts/RedHatMono-400.woff2", "assets/fonts/RedHatMono-600.woff2", "assets/fonts/BarlowCondensed-600.woff2", "assets/fonts/BarlowCondensed-700.woff2", "assets/fonts/OFL-IBM-Plex.txt", "assets/fonts/OFL-Red-Hat-Mono.txt", "assets/fonts/OFL-Barlow.txt"]
EMAIL = "benelmore6@gmail.com"
REQUIRED = {  # fact -> (page, text that must appear)
    "email text": ("index.html", EMAIL),
    "email mailto": ("index.html", "mailto:" + EMAIL),
    "LinkedIn": ("index.html", "linkedin.com/in/benjamin-n-elmore"),
    "ARC project": ("index.html", "ARC/"),
    "MarketTesting project": ("index.html", "MarketTesting/"),
    "Software Engineer role": ("CBU-Robotics/index.html", "Software Engineer"),
    "Vice President role": ("CBU-Robotics/index.html", "Vice President"),
    "Associate role": ("In-N-Out/index.html", "Associate"),
    "Lifeguard role": ("LEGOLAND/index.html", "Lifeguard"),
}
# Vendor strings that may appear only inside assets/app-*.js (React, React Router).
BUNDLE_ALLOWED = [
    "http://www.w3.org/2000/svg", "http://www.w3.org/1999/xlink",
    "http://www.w3.org/1998/Math/MathML", "http://www.w3.org/XML/1998/namespace",
    "http://localhost", "https://react.dev/errors/",
    "https://reactrouter.com/en/main/routers/picking-a-router",
]
BUNDLE_ALLOWED_PREFIX = [SITE_URL]
URL_RE = re.compile(r"""https?://[^\s"'`)\\<>]+""")
SITE_TEXT_GLOBS = ["index.html", "vite.config.js", "package.json", "src/**/*", "public/**/*", "scripts/**/*"]
TEXT_EXT = {".html", ".js", ".jsx", ".mjs", ".json", ".css", ".txt", ".svg", ".md"}
# Generic leak patterns. Specific private names come from PRIVATE_NAMES (comma separated)
# or the gitignored tools/private-names.txt (one per line), so they are never committed.
GENERIC = [r"SdBenE", r"\bwork/(?!experience)", r"Co-Authored-By"]
EMAIL_RE = re.compile(r"[\w.+-]+@[\w-]+\.[\w.-]+")


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids, self.links, self.text = set(), [], []
        self.canonical, self.robots, self.scripts = None, None, []
        self.in_root = self.in_main = self.root_has_main = False
        self.h1, self.main_text, self.toggle_hidden = 0, [], None

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if "id" in a:
            self.ids.add(a["id"])
        for k in ("href", "src"):
            if a.get(k):
                self.links.append(a[k])
        for part in (a.get("srcset") or "").split(","):
            if part.strip():
                self.links.append(part.split()[0])
        if tag == "link" and a.get("rel") == "canonical":
            self.canonical = a.get("href")
        if tag == "meta" and a.get("name") == "robots":
            self.robots = a.get("content")
        if tag == "script" and a.get("src"):
            self.scripts.append(a["src"])
        if tag == "div" and a.get("id") == "root":
            self.in_root = True
        if tag == "main" and a.get("id") == "main" and self.in_root:
            self.in_main = self.root_has_main = True
        if self.in_main and tag == "h1":
            self.h1 += 1
        if tag == "button" and "theme-toggle" in (a.get("class") or "").split():
            self.toggle_hidden = "hidden" in a

    def handle_endtag(self, tag):
        if tag == "main":
            self.in_main = False

    def handle_data(self, d):
        self.text.append(d)
        if self.in_main:
            self.main_text.append(d)


def private_names():
    names = [n.strip() for n in os.environ.get("PRIVATE_NAMES", "").split(",") if n.strip()]
    f = ROOT / "tools" / "private-names.txt"
    if f.exists():
        names += [l.strip() for l in f.read_text(encoding="utf-8").splitlines() if l.strip()]
    return names


def exists_exact(rel):
    """True if rel (posix, under DOCS) exists with exactly this case, as a case-sensitive host would serve it."""
    cur = DOCS
    for part in [x for x in rel.split("/") if x]:
        if not cur.is_dir() or part not in os.listdir(cur):
            return False
        cur = cur / part
    return True


def route_dir(p):
    return p[: -len("index.html")] if p.endswith("index.html") else p


def expected_case_map():
    m = {}
    for p in PAGES[1:]:
        d = route_dir(p)
        m[d.rstrip("/").lower()] = d
    return m


def check_structure(errors, parsed):
    rels = sorted(f.relative_to(DOCS).as_posix() for f in DOCS.rglob("*") if f.is_file())
    bundles = [r for r in rels if re.fullmatch(r"assets/app-[^/]+\.js", r)]
    if len(bundles) != 1:
        errors.append(f"expected exactly one assets/app-*.js, found {len(bundles)}")
    for r in rels:
        if r.endswith(".map"):
            errors.append(f"source map shipped: {r}")
        if re.search(r"(^|/)chunk-[^/]*$", r):
            errors.append(f"chunk file shipped: {r}")
    if "assets/site.js" in rels:
        errors.append("assets/site.js should not exist (the bundle replaces it)")
    for need in ("assets/route-case.js", "assets/site.css", "assets/arc.css", ".nojekyll"):
        if need not in rels:
            errors.append(f"missing {need}")

    # No path that matches a route when case is ignored but differs in case.
    real = set(PAGES + [NOT_FOUND])
    route_lc = {r.lower() for r in real} | {route_dir(r).lower().rstrip("/") for r in PAGES[1:]}
    seen = {}
    for r in rels:
        if r.lower() in seen:
            errors.append(f"paths differ only by case: {seen[r.lower()]} / {r}")
        seen[r.lower()] = r
        if r.lower() in route_lc and r not in real:
            errors.append(f"path matches a route except for case: {r}")
        parts = r.split("/")
        for i in range(1, len(parts)):
            d = "/".join(parts[:i])
            if d.lower() in route_lc and d + "/index.html" not in real:
                errors.append(f"directory matches a route except for case: {d}")
    errors[:] = list(dict.fromkeys(errors))

    # route-case.js holds exactly the map derived from the routes; only 404.html loads it.
    rc = DOCS / "assets" / "route-case.js"
    if rc.exists():
        text = rc.read_text(encoding="utf-8")
        m = re.search(r"var M = (\{.*?\});", text)
        try:
            got = json.loads(m.group(1)) if m else None
        except ValueError:
            got = None
        if got != expected_case_map():
            errors.append("assets/route-case.js map does not match the routes")
        if len(rc.read_bytes()) >= 1024:
            errors.append("assets/route-case.js is 1 KB or more")
    for p, pg in parsed.items():
        loads = any(x.endswith("assets/route-case.js") for x in pg.scripts)
        if loads != (p == NOT_FOUND):
            errors.append(f"{p}: route-case.js must be loaded by 404.html only")
        mods = [x for x in pg.scripts if re.search(r"assets/app-[^/]+\.js$", x)]
        if len(mods) != 1:
            errors.append(f"{p}: expected one app-*.js script, found {len(mods)}")
        elif len(bundles) == 1 and mods[0] != BASE + bundles[0]:
            errors.append(f"{p}: script {mods[0]} is not the built bundle")
    return bundles


def check_page_rules(errors, parsed, raw):
    for p, pg in parsed.items():
        # Works without JS: the content is already in the served HTML.
        if not pg.root_has_main:
            errors.append(f"{p}: #root has no main#main in the HTML (it would need JS to render)")
        elif pg.h1 != 1:
            errors.append(f"{p}: main#main has {pg.h1} h1 elements, expected 1")
        elif len(" ".join(" ".join(pg.main_text).split())) < 40:
            errors.append(f"{p}: main#main has too little text in the HTML")
        if p == NOT_FOUND:
            if pg.canonical or 'property="og:' in raw[p]:
                errors.append(f"{p}: the 404 page must not carry canonical or og tags")
            if pg.robots != "noindex":
                errors.append(f"{p}: the 404 page needs robots noindex")
            continue
        want = SITE_URL + route_dir(p)
        if pg.canonical != want:
            errors.append(f"{p}: canonical {pg.canonical!r}, expected {want!r}")
        if pg.robots:
            errors.append(f"{p}: unexpected robots tag")
        if f'property="og:url" content="{want}"' not in raw[p]:
            errors.append(f"{p}: og:url missing or wrong")


def check_links(errors, parsed):
    for p, pg in parsed.items():
        for link in pg.links:
            u = urlparse(link)
            if u.scheme in ("http", "https", "mailto"):
                if "/work/" in link or link.rstrip("/").endswith("/work"):
                    errors.append(f"{p}: link to work/: {link}")
                continue
            if u.scheme or link.startswith("//"):
                errors.append(f"{p}: unexpected link scheme: {link}")
                continue
            path, frag = urldefrag(link)
            if not path:
                target = p
            elif path.startswith(BASE):
                rel = unquote(path[len(BASE):])
                if rel == "" or rel.endswith("/"):
                    target = rel + "index.html"
                elif "." not in rel.rsplit("/", 1)[-1]:
                    errors.append(f"{p}: directory link without trailing slash: {link}")
                    continue
                else:
                    target = rel
            else:
                errors.append(f"{p}: local link is not base-absolute ({BASE}...): {link}")
                continue
            if not exists_exact(target):
                errors.append(f"{p}: broken link {link}")
                continue
            if frag and target in parsed and frag not in parsed[target].ids and frag != "top":
                errors.append(f"{p}: missing anchor {link}")


def check_bundle_strings(errors, name, text, page_urls=()):
    for url in sorted(set(URL_RE.findall(text))):
        if url.startswith(tuple(BUNDLE_ALLOWED)) or url.startswith(tuple(BUNDLE_ALLOWED_PREFIX)) or url in page_urls:
            continue
        errors.append(f"{name}: URL not on the vendor allowlist: {url}")
    # tel:!0 comes from React's input-type table; a real tel: link would be a leak.
    for m in re.finditer(r"tel:[+\d(][^\s\"'`]*", text):
        errors.append(f"{name}: unexpected {m.group(0)}")


def site_text_files():
    out = {}
    for g in SITE_TEXT_GLOBS:
        for f in (ROOT / "site").glob(g):
            if f.is_file() and f.suffix in TEXT_EXT:
                out[f"site/{f.relative_to(ROOT / 'site').as_posix()}"] = f
    return out


def main():
    errors, parsed, raw = [], {}, {}
    for fp in FONTS:
        if not (DOCS / fp).exists():
            errors.append(f"missing font file: {fp}")
    for p in PAGES + [NOT_FOUND]:
        f = DOCS / p
        if not f.exists():
            errors.append(f"missing page: {p}")
            continue
        raw[p] = f.read_text(encoding="utf-8")
        pg = Page()
        pg.feed(raw[p])
        parsed[p] = pg
        for tag in ("<title>", 'name="description"'):
            if tag not in raw[p]:
                errors.append(f"{p}: missing {tag}")

    bundles = check_structure(errors, parsed)
    check_page_rules(errors, parsed, raw)
    check_links(errors, parsed)
    if len(bundles) == 1:
        page_urls = {l for pg in parsed.values() for l in pg.links if l.startswith("https://")}
        check_bundle_strings(errors, bundles[0], (DOCS / bundles[0]).read_text(encoding="utf-8"), page_urls)

    for name, (p, text) in REQUIRED.items():
        if p in raw and text not in raw[p]:
            errors.append(f"required fact missing ({name}): {text!r} not in {p}")
    cbu = parsed.get("CBU-Robotics/index.html")
    if "#software-engineer" not in raw.get("index.html", "") or cbu is None or \
       "software-engineer" not in cbu.ids or "vice-president" not in cbu.ids:
        errors.append("CBU-Robotics sections #software-engineer / #vice-president missing")

    pats = [re.compile(x) for x in GENERIC] + [re.compile(re.escape(n), re.I) for n in private_names()]
    scan = dict(raw)
    for f in sorted((DOCS / "assets").glob("*.js")):
        scan[f"assets/{f.name}"] = f.read_text(encoding="utf-8")
    for name, f in site_text_files().items():
        scan[name] = f.read_text(encoding="utf-8")
    for name, s in scan.items():
        for rx in pats:
            if rx.search(s):
                errors.append(f"{name}: private-name pattern matched: {rx.pattern}")
        for m in EMAIL_RE.findall(s):
            if m.lower() != EMAIL:
                errors.append(f"{name}: unexpected email address: {m}")

    if errors:
        print("FAIL")
        for e in errors:
            print(" -", e)
        return 1
    print(f"OK: {len(parsed)} pages, {len(scan)} files scanned; routes, 404, redirects map, no-JS content, "
          f"links and required facts checked ({len(private_names())} private names loaded)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
