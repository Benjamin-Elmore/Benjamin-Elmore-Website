#!/usr/bin/env python3
"""Static checks for the portfolio site (stdlib only). Run from anywhere: python tools/check_site.py"""
import os
import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urldefrag, urlparse

ROOT = Path(__file__).resolve().parent.parent
DOCS = ROOT / "docs"
PAGES = ["index.html", "ARC/index.html", "MarketTesting/index.html",
         "CBU-Robotics/index.html", "In-N-Out/index.html", "LEGOLAND/index.html"]
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
# Generic leak patterns. Specific private names come from PRIVATE_NAMES (comma separated)
# or the gitignored tools/private-names.txt (one per line), so they are never committed.
GENERIC = [r"SdBenE", r"\bwork/", r"Co-Authored-By"]
EMAIL_RE = re.compile(r"[\w.+-]+@[\w-]+\.[\w.-]+")


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids, self.links, self.text, self.ok = set(), [], [], True

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

    def handle_data(self, d):
        self.text.append(d)


def private_names():
    names = [n.strip() for n in os.environ.get("PRIVATE_NAMES", "").split(",") if n.strip()]
    f = ROOT / "tools" / "private-names.txt"
    if f.exists():
        names += [l.strip() for l in f.read_text(encoding="utf-8").splitlines() if l.strip()]
    return names


def main():
    errors, parsed, raw = [], {}, {}
    for p in PAGES:
        f = DOCS / p
        if not f.exists():
            errors.append(f"missing page: {p}")
            continue
        raw[p] = f.read_text(encoding="utf-8")
        pg = Page()
        pg.feed(raw[p])
        parsed[p] = pg
        for tag in ("<title>", 'rel="canonical"', 'name="description"'):
            if tag not in raw[p]:
                errors.append(f"{p}: missing {tag}")

    for p, pg in parsed.items():
        base = (DOCS / p).parent
        for link in pg.links:
            u = urlparse(link)
            if u.scheme in ("http", "https", "mailto"):
                if "/work/" in link or link.rstrip("/").endswith("/work"):
                    errors.append(f"{p}: link to work/: {link}")
                continue
            path, frag = urldefrag(link)
            target = (base / unquote(path)).resolve() if path else (DOCS / p)
            if target.is_dir():
                target = target / "index.html"
            if not target.exists():
                errors.append(f"{p}: broken link {link}")
                continue
            if frag and target.suffix == ".html":
                tp = str(target.relative_to(DOCS.resolve())).replace("\\", "/")
                if tp in parsed and frag not in parsed[tp].ids and frag != "top":
                    errors.append(f"{p}: missing anchor {link}")

    for name, (p, text) in REQUIRED.items():
        if p in raw and text not in raw[p]:
            errors.append(f"required fact missing ({name}): {text!r} not in {p}")
    if "#software-engineer" not in raw.get("index.html", "") or \
       "software-engineer" not in parsed.get("CBU-Robotics/index.html", Page()).ids or \
       "vice-president" not in parsed.get("CBU-Robotics/index.html", Page()).ids:
        errors.append("CBU-Robotics sections #software-engineer / #vice-president missing")

    pats = [re.compile(x) for x in GENERIC] + [re.compile(re.escape(n), re.I) for n in private_names()]
    for p, s in raw.items():
        for rx in pats:
            if rx.search(s):
                errors.append(f"{p}: private-name pattern matched: {rx.pattern}")
        for m in EMAIL_RE.findall(s):
            if m.lower() != EMAIL:
                errors.append(f"{p}: unexpected email address: {m}")

    if errors:
        print("FAIL")
        for e in errors:
            print(" -", e)
        return 1
    print(f"OK: {len(parsed)} pages, links and required facts checked "
          f"({len(private_names())} private names loaded)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
