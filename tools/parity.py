#!/usr/bin/env python3
"""Copy parity: every built page in docs/ against the same page on a git ref (default: fresh).

  python tools/parity.py [--ref fresh] [--root docs] [page ...]

Compares the visible text (a space at every non-inline tag boundary, whitespace collapsed),
the exact <pre> bodies, the title, description, og:*, canonical and robots tags, the ordered ids,
the (href, text) anchor pairs, img/source src/srcset/alt/width/height, and aria-* attributes.
URLs are resolved against the page's live URL and reduced to the docs-relative path, so
"../ARC/" and "/Benjamin-Elmore-Website/ARC/" compare equal. Ignored on purpose: div#root,
data-discover, scripts, stylesheet links, HTML comments (React's <!-- --> separators and the
slot comments, which became JSX comments) and whitespace-only text between block elements.
Prints the diffs and exits 1 on any. Standard library only.
"""
import argparse
import difflib
import subprocess
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin

ORIGIN = "https://benjamin-elmore.github.io"
BASE = "/Benjamin-Elmore-Website/"
SITE = ORIGIN + BASE
PAGES = ["index.html", "ARC/index.html", "MarketTesting/index.html", "CBU-Robotics/index.html",
         "In-N-Out/index.html", "LEGOLAND/index.html", "About/index.html"]
INLINE = {"a", "abbr", "b", "bdi", "bdo", "cite", "code", "data", "dfn", "em", "i", "img", "kbd", "mark",
          "q", "s", "samp", "small", "span", "strong", "sub", "sup", "time", "u", "var", "wbr"}
VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"}
HIDDEN = {"script", "style", "template", "title"}
REPO = Path(__file__).resolve().parent.parent


def rel(url, page_url):
    """Resolve against the page URL; site URLs become docs-relative paths."""
    if not url or url.startswith(("#", "mailto:", "tel:", "data:")):
        return url
    u = urljoin(page_url, url)
    return u[len(SITE):] if u.startswith(SITE) else u


class Page(HTMLParser):
    def __init__(self, page_url):
        super().__init__(convert_charrefs=True)
        self.url = page_url
        self.stack = []
        self.text = []
        self.pre = []
        self.title = ""
        self.head = []
        self.ids = []
        self.anchors = []
        self.media = []
        self.aria = []

    def boundary(self, tag):
        if tag not in INLINE:
            self.text.append(" ")

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "meta":
            key = a.get("name") or a.get("property")
            if key in ("description", "robots") or (key or "").startswith("og:"):
                val = a.get("content") or ""
                self.head.append((key, rel(val, self.url) if key == "og:url" else val))
        elif tag == "link" and a.get("rel") == "canonical":
            self.head.append(("canonical", rel(a.get("href", ""), self.url)))
        if "id" in a and not (tag == "div" and a["id"] == "root"):
            self.ids.append(a["id"])
        for k, v in attrs:
            if k.startswith("aria-"):
                self.aria.append((tag, k, v))
        if tag == "a":
            self.anchors.append([rel(a.get("href", ""), self.url), ""])
        if tag in ("img", "source"):
            srcset = a.get("srcset")
            if srcset:
                srcset = ", ".join(" ".join([rel(p.split()[0], self.url)] + p.split()[1:]) for p in srcset.split(","))
            self.media.append((tag, rel(a.get("src"), self.url) if a.get("src") else None, srcset,
                               a.get("media"), a.get("alt"), a.get("width"), a.get("height")))
        if tag == "pre":
            self.pre.append("")
        self.boundary(tag)
        if tag not in VOID:
            self.stack.append(tag)

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in VOID:
            self.handle_endtag(tag)

    def handle_endtag(self, tag):
        self.boundary(tag)
        if tag in self.stack:
            while self.stack and self.stack.pop() != tag:
                pass

    def handle_data(self, d):
        if "title" in self.stack:
            self.title += d
        if any(t in HIDDEN for t in self.stack):
            return
        if "body" not in self.stack:
            return
        self.text.append(d)
        if "pre" in self.stack:
            self.pre[-1] += d
        if "a" in self.stack and self.anchors:
            self.anchors[-1][1] += d

    def result(self):
        return {
            "title": [" ".join(self.title.split())],
            "head": self.head,
            "text": " ".join("".join(self.text).split()).split(" "),
            "pre": self.pre,
            "ids": self.ids,
            "anchors": [(h, " ".join(t.split())) for h, t in self.anchors],
            "img/source": self.media,
            "aria": self.aria,
        }


def parse(html, page):
    p = Page(SITE + page[: -len("index.html")])
    p.feed(html)
    p.close()
    return p.result()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--ref", default="fresh")
    ap.add_argument("--root", default=str(REPO / "docs"))
    ap.add_argument("pages", nargs="*", default=PAGES)
    args = ap.parse_args()
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(errors="backslashreplace")
    failed = 0
    for page in args.pages:
        old = subprocess.run(["git", "-C", str(REPO), "show", f"{args.ref}:docs/{page}"],
                             capture_output=True, check=True).stdout.decode("utf-8")
        new = (Path(args.root) / page).read_text(encoding="utf-8")
        a, b = parse(old, page), parse(new, page)
        diffs = []
        for key in a:
            if a[key] != b[key]:
                diffs.append(f"  [{key}]")
                diffs += ["    " + line for line in difflib.unified_diff(
                    [repr(x) for x in a[key]], [repr(x) for x in b[key]], args.ref, "docs", n=1, lineterm="")
                    if not line.startswith(("---", "+++"))]
        print(f"{'DIFF' if diffs else 'OK  '} {page}")
        if diffs:
            failed += 1
            print("\n".join(diffs))
    print(f"parity: {failed} page(s) differ" if failed else "parity: OK")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
