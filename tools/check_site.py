#!/usr/bin/env python3
"""Acceptance checks for the static portfolio site in docs/ (PLAN.md section 4).

Usage:
    python tools/check_site.py [--root docs]

Prints one line per check, ``PASS|FAIL <id> <detail>``, and exits 1 if any
check fails. Standard library only; compatible with Python 3.12.

Definitions used throughout:
* "Visible text" of an HTML page is its text nodes, excluding <script> and
  <style> contents and excluding attribute values, except that <img alt> text
  counts. Whitespace is collapsed and the text is NFC-normalised.
* "SVG text" is the text content of an SVG file, excluding <script>/<style>.
"""

from __future__ import annotations

import argparse
import re
import sys
import unicodedata
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path
from typing import Callable

# ---------------------------------------------------------------------------
# Tunable constants (reviewers edit these, not the check code)
# ---------------------------------------------------------------------------

#: C13. Matched case-insensitively on word boundaries against the visible text
#: of index.html, its public metadata (meta description / og:*) and SVG text.
FORBIDDEN_PHRASES: tuple[str, ...] = (
    "throughput",
    "latency",
    "low-latency",
    "deterministic",
    "determinism",
    "real-time",
    "realtime",
    "reliable",
    "reliability",
    "robust",
    "deployed",
    "deployment",
    "in production",
    "production-ready",
    "production ready",
    "released",
    "flight-ready",
    "flight-tested",
    "battle-tested",
    "proven",
    "guarantee",
    "accuracy",
    "accurate",
    "outperform",
    "profit",
    "returns",
    "fully tested",
    "end-to-end tested",
    "hardware-verified",
    "résumé",
    "resume",
)

#: C13 exemptions: phrase -> reason. A phrase listed here is not reported.
#: Changes need the content reviewer's sign-off (PLAN.md section 5). Empty
#: this queue.
ALLOW: dict[str, str] = {}

#: C14. Required facts (case-insensitive) in the visible text of index.html.
REQUIRED_FACTS: tuple[str, ...] = (
    "intended system architecture",
    "3eb3ed6",
    "cef105f",
    "November 3, 2026",
    "October 28",
    "flash",
    "AI-assisted",
    "prototype",
    "May 2029",
    "half-duplex RS-485",
    "Vice President",
    "September 2025",
    "October 2026",
)

SECTION_IDS: tuple[str, ...] = (
    "top", "arc", "experience", "projects", "skills", "education", "contact",
)

SITE_URL = "https://benjamin-elmore.github.io/Benjamin-Elmore-Website/"
#: C08. External URLs allowed anywhere (compared ignoring a trailing slash).
ALLOWED_URLS: tuple[str, ...] = (
    "https://github.com/Benjamin-Elmore",
    "https://github.com/Benjamin-Elmore/ARC",
    "https://github.com/Benjamin-Elmore/MarketTesting",
    "https://www.linkedin.com/in/benjamin-n-elmore/",
)
ARC_REPO_URL = "https://github.com/Benjamin-Elmore/ARC"
MARKET_REPO_URL = "https://github.com/Benjamin-Elmore/MarketTesting"

#: C10. Case-insensitive patterns for handoff/work files.
WORK_FILE_PATTERNS: tuple[str, ...] = (
    r"PORTFOLIO-CONTENT",
    r"PORTFOLIO-RESEARCH",
    r"RUN-STATE",
    r"PLAN\.md",
    r"(?<![\w-])work/",  # boundary so "framework/" or "network/" don't trip
    r"CLAUDE\.md",
)

#: C16. Tokens that must be defined on :root.
REQUIRED_TOKENS: tuple[str, ...] = (
    "--color-bg", "--color-surface", "--color-text", "--color-muted",
    "--color-accent", "--color-border", "--color-focus", "--color-code-bg",
    "--font-sans", "--font-mono", "--measure", "--page-max", "--gutter",
)

TOTAL_BUDGET_BYTES = 300 * 1024
JS_BUDGET_BYTES = 3 * 1024

TEXT_EXTENSIONS = {".html", ".css", ".js", ".svg", ".txt", ".xml", ".json"}
SVG_PATH = "assets/arc-architecture.svg"
CSS_PATH = "assets/site.css"
JS_PATH = "assets/site.js"

VOID_TAGS = {
    "area", "base", "br", "col", "embed", "hr", "img", "input", "link",
    "meta", "param", "source", "track", "wbr",
}
#: Elements that do not introduce a word break in visible text.
INLINE_TAGS = {
    "a", "abbr", "b", "bdi", "bdo", "cite", "code", "data", "dfn", "em", "i",
    "kbd", "mark", "q", "s", "samp", "small", "span", "strong", "sub", "sup",
    "time", "u", "var",
}
HIDDEN_TEXT_TAGS = {"script", "style", "template"}

# Regexes
URL_RE = re.compile(r"https?://[^\s\"'<>()]+", re.I)
EMAIL_RE = re.compile(r"[\w.+-]+@[\w-]+\.[\w.]+")
# Asset names like logo@2x.png look like emails; ignore those.
EMAIL_FILE_EXT_RE = re.compile(
    r"\.(png|jpe?g|gif|svg|webp|avif|ico|css|js)$", re.I)
PHONE_RE = re.compile(r"\+?\d[\d\s().-]{8,}\d")
PHONE_MIN_DIGITS = 9  # a year range "2025 - 2026" (8 digits) is not a phone
ISO_DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")
# Hex hashes (7-40 chars, at least one letter and one digit) are not phones.
HEX_HASH_RE = re.compile(
    r"\b(?=[0-9a-f]*[a-f])(?=[0-9a-f]*\d)[0-9a-f]{7,40}\b", re.I)
FSW_URL_RE = re.compile(r"github\.com/[^\"' ]*FSW", re.I)


# ---------------------------------------------------------------------------
# HTML model
# ---------------------------------------------------------------------------

class Element:
    __slots__ = ("tag", "attrs", "children", "parent", "line")

    def __init__(self, tag: str, attrs: dict[str, str], parent: "Element | None",
                 line: int) -> None:
        self.tag = tag
        self.attrs = attrs
        self.children: list["Element | str"] = []
        self.parent = parent
        self.line = line

    def iter(self):
        """Yield this element and all descendant elements, document order."""
        yield self
        for child in self.children:
            if isinstance(child, Element):
                yield from child.iter()

    def find_all(self, tag: str) -> list["Element"]:
        return [e for e in self.iter() if e.tag == tag]

    def classes(self) -> set[str]:
        return set(self.attrs.get("class", "").split())

    def has_ancestor(self, pred: Callable[["Element"], bool]) -> bool:
        node = self.parent
        while node is not None:
            if pred(node):
                return True
            node = node.parent
        return False

    def raw_text(self) -> str:
        """All text including script/style bodies (used for <script> checks)."""
        out = []
        for child in self.children:
            out.append(child if isinstance(child, str) else child.raw_text())
        return "".join(out)

    def describe(self) -> str:
        bits = [self.tag]
        if "id" in self.attrs:
            bits.append(f'id="{self.attrs["id"]}"')
        return f"<{' '.join(bits)}> (line {self.line})"


class TreeBuilder(HTMLParser):
    """Builds a small DOM and records tag-balance errors (C01)."""

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.document = Element("#document", {}, None, 0)
        self.stack: list[Element] = [self.document]
        self.errors: list[str] = []

    def _make(self, tag: str, attrs) -> Element:
        attr_map: dict[str, str] = {}
        for name, value in attrs:
            attr_map.setdefault(name.lower(), value if value is not None else "")
        el = Element(tag.lower(), attr_map, self.stack[-1], self.getpos()[0])
        self.stack[-1].children.append(el)
        return el

    def handle_starttag(self, tag, attrs):
        el = self._make(tag, attrs)
        if el.tag not in VOID_TAGS:
            self.stack.append(el)

    def handle_startendtag(self, tag, attrs):
        self._make(tag, attrs)

    def handle_endtag(self, tag):
        tag = tag.lower()
        line = self.getpos()[0]
        if tag in VOID_TAGS:
            return
        top = self.stack[-1]
        if top.tag == tag and len(self.stack) > 1:
            self.stack.pop()
            return
        open_tags = [e.tag for e in self.stack[1:]]
        if tag in open_tags:
            self.errors.append(
                f"</{tag}> at line {line} closes {top.describe()} out of order")
            while len(self.stack) > 1:
                popped = self.stack.pop()
                if popped.tag == tag:
                    break
        else:
            self.errors.append(f"stray </{tag}> at line {line}")

    def handle_data(self, data):
        self.stack[-1].children.append(data)

    def close(self):
        super().close()
        for el in self.stack[1:]:
            self.errors.append(f"{el.describe()} never closed")
        del self.stack[1:]


def normalise(text: str) -> str:
    text = unicodedata.normalize("NFC", text)
    text = text.replace("­", "").replace("‑", "-")
    return " ".join(text.split())


def visible_text(node: Element) -> str:
    parts: list[str] = []

    def walk(el: Element) -> None:
        for child in el.children:
            if isinstance(child, str):
                parts.append(child)
                continue
            if child.tag in HIDDEN_TEXT_TAGS:
                continue
            block = child.tag not in INLINE_TAGS
            if block:
                parts.append(" ")
            if child.tag == "img" and child.attrs.get("alt"):
                parts.append(f" {child.attrs['alt']} ")
            walk(child)
            if block:
                parts.append(" ")

    if node.tag == "img" and node.attrs.get("alt"):
        parts.append(node.attrs["alt"])
    walk(node)
    return normalise("".join(parts))


def svg_text(root: ET.Element) -> str:
    parts: list[str] = []

    def walk(el: ET.Element) -> None:
        local = el.tag.rsplit("}", 1)[-1] if isinstance(el.tag, str) else ""
        if local in ("script", "style"):
            return
        if el.text:
            parts.append(el.text)
        parts.append(" ")
        for child in el:
            walk(child)
            if child.tail:
                parts.append(child.tail)
            parts.append(" ")

    walk(root)
    return normalise("".join(parts))


def local_name(tag) -> str:
    return tag.rsplit("}", 1)[-1] if isinstance(tag, str) else ""


# ---------------------------------------------------------------------------
# CSS model (tiny: enough for tokens, @media blocks and simple rules)
# ---------------------------------------------------------------------------

class CssRule:
    __slots__ = ("context", "selectors", "decls")

    def __init__(self, context: tuple[str, ...], selectors: list[str],
                 decls: dict[str, str]) -> None:
        self.context = context
        self.selectors = selectors
        self.decls = decls


def strip_css_comments(text: str) -> str:
    return re.sub(r"/\*.*?\*/", "", text, flags=re.S)


def norm_selector(sel: str) -> str:
    sel = sel.replace("'", '"')
    sel = re.sub(r"\s+", " ", sel).strip()
    sel = re.sub(r"\[\s*([\w-]+)\s*=\s*", r"[\1=", sel)
    sel = re.sub(r"\[([\w-]+)=([\w-]+)\s*\]", r'[\1="\2"]', sel)
    return re.sub(r'"\s*\]', '"]', sel)


def parse_decls(body: str) -> dict[str, str]:
    body = re.sub(r"\{[^{}]*\}", "", body)  # drop any nested blocks
    decls: dict[str, str] = {}
    for part in body.split(";"):
        if ":" not in part:
            continue
        prop, _, value = part.partition(":")
        prop = prop.strip()
        if not prop or "{" in prop or "}" in prop:
            continue
        value = re.sub(r"!\s*important\s*$", "", value.strip(), flags=re.I).strip()
        decls[prop if prop.startswith("--") else prop.lower()] = value
    return decls


def parse_css(text: str, context: tuple[str, ...] = ()) -> list[CssRule]:
    rules: list[CssRule] = []
    i, n = 0, len(text)
    while i < n:
        brace = text.find("{", i)
        if brace == -1:
            break
        prelude = text[i:brace]
        prelude = prelude.rsplit(";", 1)[-1].rsplit("}", 1)[-1].strip()
        depth, j = 1, brace + 1
        while j < n and depth:
            if text[j] == "{":
                depth += 1
            elif text[j] == "}":
                depth -= 1
            j += 1
        body = text[brace + 1:j - 1]
        if prelude.startswith("@"):
            name = prelude.split(None, 1)[0].lower()
            if name in ("@media", "@supports", "@layer", "@container", "@scope"):
                rules.extend(parse_css(body, context + (" ".join(prelude.split()),)))
            # @font-face, @keyframes, @page ... are ignored
        else:
            selectors = [norm_selector(s) for s in prelude.split(",") if s.strip()]
            rules.append(CssRule(context, selectors, parse_decls(body)))
        i = j
    return rules


HEX_RE = re.compile(r"^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$")


def hex_luminance(value: str) -> float:
    h = value[1:]
    if len(h) == 3:
        h = "".join(c * 2 for c in h)
    chans = []
    for k in range(0, 6, 2):
        c = int(h[k:k + 2], 16) / 255
        chans.append(c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4)
    r, g, b = chans
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def contrast(a: str, b: str) -> float:
    la, lb = hex_luminance(a), hex_luminance(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)


# ---------------------------------------------------------------------------
# Site loader
# ---------------------------------------------------------------------------

class Site:
    def __init__(self, root: Path) -> None:
        self.root = root
        self.files: list[Path] = (
            sorted(p for p in root.rglob("*") if p.is_file()) if root.is_dir() else [])
        self.index_path = root / "index.html"
        self.html: str | None = None
        self.html_error: str | None = None
        self.doc: Element | None = None
        self.balance_errors: list[str] = []
        if self.index_path.is_file():
            try:
                self.html = self.index_path.read_text(encoding="utf-8")
                builder = TreeBuilder()
                builder.feed(self.html)
                builder.close()
                self.doc = builder.document
                self.balance_errors = builder.errors
            except Exception as exc:  # decode or parser failure
                self.html_error = f"{type(exc).__name__}: {exc}"
        self.css_path = root / CSS_PATH
        self.css: str | None = (
            strip_css_comments(self.css_path.read_text(encoding="utf-8"))
            if self.css_path.is_file() else None)
        self.css_rules = parse_css(self.css) if self.css is not None else []
        self.svgs: dict[Path, ET.Element | None] = {}
        self.svg_raw: dict[Path, str] = {}
        self.svg_errors: dict[Path, str] = {}
        for p in self.files:
            if p.suffix.lower() == ".svg":
                raw = p.read_text(encoding="utf-8", errors="replace")
                self.svg_raw[p] = raw
                try:
                    self.svgs[p] = ET.fromstring(raw)
                except ET.ParseError as exc:
                    self.svgs[p] = None
                    self.svg_errors[p] = str(exc)

    def rel(self, p: Path) -> str:
        try:
            return p.relative_to(self.root).as_posix()
        except ValueError:
            return str(p)

    def text_files(self) -> list[tuple[Path, str]]:
        out = []
        for p in self.files:
            if p.suffix.lower() in TEXT_EXTENSIONS:
                out.append((p, p.read_text(encoding="utf-8", errors="replace")))
        return out

    def elements(self) -> list[Element]:
        return list(self.doc.iter())[1:] if self.doc else []

    def by_id(self, ident: str) -> Element | None:
        for el in self.elements():
            if el.attrs.get("id") == ident:
                return el
        return None

    def body(self) -> Element | None:
        bodies = self.doc.find_all("body") if self.doc else []
        return bodies[0] if bodies else None


class CheckFailed(Exception):
    pass


Result = tuple[str, bool, str]
CHECKS: list[tuple[str, Callable[[Site], str]]] = []


def check(cid: str):
    def deco(fn: Callable[[Site], str]):
        CHECKS.append((cid, fn))
        return fn
    return deco


def need_html(site: Site) -> Element:
    if site.doc is None:
        raise CheckFailed(
            "index.html missing" if site.html_error is None and site.html is None
            else f"index.html unreadable ({site.html_error})")
    return site.doc


def fail_if(problems: list[str], ok_detail: str, limit: int = 6) -> str:
    if problems:
        more = f" (+{len(problems) - limit} more)" if len(problems) > limit else ""
        raise CheckFailed("; ".join(problems[:limit]) + more)
    return ok_detail


def url_allowed(url: str) -> bool:
    return url.rstrip("/") in {u.rstrip("/") for u in ALLOWED_URLS}


# ---------------------------------------------------------------------------
# Checks
# ---------------------------------------------------------------------------

@check("C01")
def c01(site: Site) -> str:
    problems = []
    if not site.index_path.is_file():
        problems.append("index.html missing")
    elif site.html_error:
        problems.append(f"index.html unreadable ({site.html_error})")
    if not (site.root / ".nojekyll").is_file():
        problems.append(".nojekyll missing")
    problems.extend(f"index.html: {e}" for e in site.balance_errors)
    return fail_if(problems, "index.html parses, tags balanced, .nojekyll present")


@check("C02")
def c02(site: Site) -> str:
    doc = need_html(site)
    problems = []
    htmls = doc.find_all("html")
    if not htmls or htmls[0].attrs.get("lang", "").lower() != "en":
        problems.append('<html lang="en"> missing')
    metas = doc.find_all("meta")
    if not any("charset" in m.attrs for m in metas):
        problems.append("<meta charset> missing")

    def meta(key: str, attr: str = "name") -> list[Element]:
        return [m for m in metas if m.attrs.get(attr, "").lower() == key]

    vp = meta("viewport")
    if not vp or "width=device-width" not in vp[0].attrs.get("content", "").replace(" ", ""):
        problems.append("viewport meta with width=device-width missing")
    titles = doc.find_all("title")
    if not titles or not visible_text(titles[0]):
        problems.append("non-empty <title> missing")
    desc = meta("description")
    if not desc:
        problems.append("meta description missing")
    else:
        length = len(normalise(desc[0].attrs.get("content", "")))
        if not 50 <= length <= 160:
            problems.append(f"meta description is {length} chars (need 50-160)")
    for prop in ("og:title", "og:description", "og:type", "og:url"):
        found = meta(prop, "property") or meta(prop, "name")
        if not found or not found[0].attrs.get("content", "").strip():
            problems.append(f"{prop} missing or empty")
    return fail_if(problems, "lang, charset, viewport, title, description, og:* ok")


@check("C03")
def c03(site: Site) -> str:
    doc = need_html(site)
    seen: dict[str, int] = {}
    problems = []
    for el in doc.iter():
        ident = el.attrs.get("id")
        if ident is None:
            continue
        if ident in seen:
            problems.append(f'duplicate id "{ident}" (lines {seen[ident]} and {el.line})')
        else:
            seen[ident] = el.line
    return fail_if(problems, f"{len(seen)} ids, all unique")


@check("C04")
def c04(site: Site) -> str:
    doc = need_html(site)
    ids = {el.attrs["id"] for el in doc.iter() if "id" in el.attrs}
    problems, count = [], 0
    for el in doc.iter():
        href = el.attrs.get("href")
        if href is None or not href.startswith("#"):
            continue
        count += 1
        if href == "#":
            problems.append(f'bare href="#" on {el.describe()}')
        elif href[1:] not in ids:
            problems.append(f'href="{href}" on {el.describe()} has no target id')
    return fail_if(problems, f"{count} in-page links resolve")


@check("C05")
def c05(site: Site) -> str:
    doc = need_html(site)
    problems = []
    mains = [m for m in doc.find_all("main") if m.attrs.get("id") == "main"]
    if not mains:
        problems.append('<main id="main"> missing')
    else:
        child_ids = [c.attrs.get("id") for c in mains[0].children
                     if isinstance(c, Element) and c.tag == "section"]
        present = [i for i in child_ids if i in SECTION_IDS]
        missing = [i for i in SECTION_IDS if i not in child_ids]
        if missing:
            problems.append("sections missing as children of main: " + ", ".join(missing))
        elif present != list(SECTION_IDS):
            problems.append("section order is " + ", ".join(present))
    h1s = doc.find_all("h1")
    if len(h1s) != 1:
        problems.append(f"{len(h1s)} <h1> elements (need exactly 1)")
    prev = 0
    for el in doc.iter():
        if re.fullmatch(r"h[1-6]", el.tag):
            level = int(el.tag[1])
            if level > prev + 1:
                problems.append(f"heading skip h{prev or '-'} -> {el.describe()}")
            prev = level
    return fail_if(problems, "7 sections in order, one h1, no heading skips")


FOCUSABLE_TAGS = {"button", "select", "textarea", "iframe", "summary"}


def is_focusable(el: Element) -> bool:
    if el.tag in ("a", "area") and "href" in el.attrs:
        return True
    if el.tag == "input" and el.attrs.get("type", "").lower() != "hidden":
        return True
    if el.tag in FOCUSABLE_TAGS:
        return True
    tabindex = el.attrs.get("tabindex")
    if tabindex is not None and tabindex.strip().lstrip("+").isdigit():
        return True
    return "contenteditable" in el.attrs


@check("C06")
def c06(site: Site) -> str:
    doc = need_html(site)
    problems = []
    for tag in ("header", "nav", "main", "footer"):
        n = len(doc.find_all(tag))
        if n != 1:
            problems.append(f"{n} <{tag}> elements (need exactly 1)")
    navs = doc.find_all("nav")
    if navs and not navs[0].attrs.get("aria-label", "").strip():
        problems.append("<nav> has no aria-label")
    mains = doc.find_all("main")
    if mains and mains[0].attrs.get("id") != "main":
        problems.append('<main> does not have id="main"')
    body = site.body()
    first = None
    if body is not None:
        first = next((e for e in body.iter() if e is not body and is_focusable(e)), None)
    if first is None:
        problems.append("no focusable element in <body>")
    elif not (first.tag == "a" and "skip-link" in first.classes()
              and first.attrs.get("href") == "#main"):
        problems.append(f"first focusable element is {first.describe()}, "
                        'not a.skip-link[href="#main"]')
    return fail_if(problems, "landmarks ok, skip link first")


def is_external(value: str) -> bool:
    return bool(re.match(r"^(https?:|mailto:|tel:|data:|javascript:|#)", value.strip(), re.I))


@check("C07")
def c07(site: Site) -> str:
    doc = need_html(site)
    problems = []
    imgs = doc.find_all("img")
    for img in imgs:
        for attr in ("alt", "width", "height"):
            if not img.attrs.get(attr, "").strip():
                problems.append(f"{img.describe()} missing {attr}")
    root = site.root.resolve()
    checked = 0
    for el in doc.iter():
        for attr in ("src", "href"):
            value = el.attrs.get(attr)
            if value is None or is_external(value):
                continue
            value = value.strip()
            if value.startswith("/"):
                problems.append(f'root-absolute {attr}="{value}" on {el.describe()}')
                continue
            path = re.split(r"[?#]", value, maxsplit=1)[0]
            if not path:
                continue
            checked += 1
            target = (root / path).resolve()
            if not target.is_relative_to(root):
                problems.append(f'{attr}="{value}" points outside docs/')
            elif not target.is_file():
                problems.append(f'{attr}="{value}" on {el.describe()} does not exist')
    return fail_if(problems, f"{len(imgs)} img ok, {checked} local paths exist")


def html_urls(doc: Element):
    """Yield (url, element, attr) for every http(s) URL in an attribute value."""
    for el in doc.iter():
        for name, value in el.attrs.items():
            if name.startswith("xmlns"):
                continue
            for m in URL_RE.finditer(value or ""):
                yield m.group(0), el, name


def js_without_comments(text: str) -> str:
    text = re.sub(r"/\*.*?\*/", "", text, flags=re.S)
    return re.sub(r"(?m)^\s*//.*$", "", text)


@check("C08")
def c08(site: Site) -> str:
    doc = need_html(site)
    problems, count = [], 0

    def judge(url: str, where: str, site_url_ok: bool) -> None:
        nonlocal count
        count += 1
        if url.lower().startswith("http://"):
            problems.append(f"insecure http:// URL {url} in {where}")
        elif url.rstrip("/") == SITE_URL.rstrip("/"):
            if not site_url_ok:
                problems.append(f"site URL {url} outside og:url/canonical ({where})")
        elif not url_allowed(url):
            problems.append(f"URL not on allowlist: {url} in {where}")

    for url, el, attr in html_urls(doc):
        is_og_url = el.tag == "meta" and el.attrs.get("property") == "og:url" and attr == "content"
        is_canonical = (el.tag == "link" and attr == "href"
                        and "canonical" in el.attrs.get("rel", "").lower().split())
        judge(url, f"index.html {attr} of {el.describe()}", is_og_url or is_canonical)
    if site.css is not None:
        for m in URL_RE.finditer(site.css):
            judge(m.group(0), CSS_PATH, False)
    for p, root in site.svgs.items():
        if root is None:
            continue
        for el in root.iter():
            for name, value in el.attrib.items():
                for m in URL_RE.finditer(value):
                    judge(m.group(0), f"{site.rel(p)} attribute {local_name(name)}", False)
            if local_name(el.tag) == "style" and el.text:
                for m in URL_RE.finditer(el.text):
                    judge(m.group(0), f"{site.rel(p)} <style>", False)
    for p, text in site.text_files():
        if p.suffix.lower() == ".js":
            for m in URL_RE.finditer(js_without_comments(text)):
                judge(m.group(0), site.rel(p), False)
    return fail_if(problems, f"{count} external URLs, all allowlisted https")


@check("C09")
def c09(site: Site) -> str:
    problems = []
    for p, text in site.text_files():
        for m in FSW_URL_RE.finditer(text):
            problems.append(f"{site.rel(p)}: FSW URL '{m.group(0)}'")
    return fail_if(problems, "no FSW-UAV-SIM URL")


@check("C10")
def c10(site: Site) -> str:
    problems = []
    for p in site.files:
        if p.suffix.lower() == ".md":
            problems.append(f"markdown file {site.rel(p)} under docs/")
    for p, text in site.text_files():
        for pat in WORK_FILE_PATTERNS:
            m = re.search(pat, text, re.I)
            if m:
                problems.append(f"{site.rel(p)}: references '{m.group(0)}'")
    return fail_if(problems, "no handoff/work-file references, no .md files")


def find_phones(text: str) -> list[str]:
    text = HEX_HASH_RE.sub(" ", text)
    hits = []
    for m in PHONE_RE.finditer(text):
        s = m.group(0).strip()
        digits = sum(c.isdigit() for c in s)
        if digits < PHONE_MIN_DIGITS or ISO_DATE_RE.match(s):
            continue
        hits.append(s)
    return hits


def find_emails(text: str) -> list[str]:
    return [m.group(0) for m in EMAIL_RE.finditer(text)
            if not EMAIL_FILE_EXT_RE.search(m.group(0))]


@check("C11")
def c11(site: Site) -> str:
    doc = need_html(site)
    problems = []
    vis = visible_text(doc)
    # Email + mailto/tel: HTML text (not CSS/JS) and every attribute value.
    html_strings = [("index.html text", vis)]
    for el in doc.iter():
        for name, value in el.attrs.items():
            html_strings.append((f"index.html {name} of {el.describe()}", value or ""))
    for p, root in site.svgs.items():
        if root is None:
            continue
        html_strings.append((f"{site.rel(p)} text", svg_text(root)))
        for el in root.iter():
            for name, value in el.attrib.items():
                html_strings.append((f"{site.rel(p)} attribute {local_name(name)}", value))
    for where, s in html_strings:
        for e in find_emails(s):
            problems.append(f"email-like '{e}' in {where}")
        m = re.search(r"\b(mailto|tel):", s, re.I)
        if m:
            problems.append(f"'{m.group(0)}' in {where}")
    # Phone numbers: visible text only (attributes like datetime are excluded).
    for where, s in [("index.html", vis)] + [
            (site.rel(p), svg_text(r)) for p, r in site.svgs.items() if r is not None]:
        for ph in find_phones(s):
            problems.append(f"phone-like '{ph}' in {where} visible text")
    return fail_if(problems, "no email, phone, mailto: or tel:")


@check("C12")
def c12(site: Site) -> str:
    doc = need_html(site)
    problems = []
    for el in doc.find_all("script"):
        src = el.attrs.get("src")
        if src is None:
            problems.append(f"inline {el.describe()}")
            continue
        src = src.strip()
        if src.lower().startswith(("http:", "https:", "//")):
            problems.append(f'remote script src="{src}"')
        elif src.removeprefix("./") != JS_PATH:
            problems.append(f'script src="{src}" is not {JS_PATH}')
        if el.raw_text().strip():
            problems.append(f"{el.describe()} has src and an inline body")
    for el in doc.iter():
        for name, value in el.attrs.items():
            if re.fullmatch(r"on[a-z]+", name):
                problems.append(f"handler attribute {name}= on {el.describe()}")
            if name in ("href", "src", "action") and (value or "").strip().lower().startswith("javascript:"):
                problems.append(f"javascript: URL on {el.describe()}")
        if el.tag in ("iframe", "object", "embed"):
            problems.append(f"{el.describe()} not allowed")
    for p, raw in site.svg_raw.items():
        for pat, label in ((r"<script", "<script"), (r"<foreignObject", "<foreignObject"),
                           (r"href\s*=\s*[\"']\s*https?:", "external href")):
            if re.search(pat, raw, re.I):
                problems.append(f"{site.rel(p)} contains {label}")
        root = site.svgs.get(p)
        if root is not None:
            for el in root.iter():
                for name in el.attrib:
                    if re.fullmatch(r"on[a-z]+", local_name(name).lower()):
                        problems.append(f"{site.rel(p)} handler attribute {local_name(name)}=")
    return fail_if(problems, f"only {JS_PATH}, no inline script/handlers/embeds")


def phrase_regex(phrase: str) -> re.Pattern:
    body = r"\s+".join(re.escape(w) for w in phrase.split())
    return re.compile(rf"(?<!\w){body}(?!\w)", re.I)


def find_forbidden(text: str) -> list[str]:
    hits = []
    for phrase in FORBIDDEN_PHRASES:
        if phrase in ALLOW:
            continue
        m = phrase_regex(phrase).search(text)
        if m:
            lo, hi = max(0, m.start() - 30), min(len(text), m.end() + 30)
            hits.append(f"'{phrase}' in \"...{text[lo:hi]}...\"")
    return hits


@check("C13")
def c13(site: Site) -> str:
    doc = need_html(site)
    problems = []
    sources = [("index.html", visible_text(doc))]
    # Public metadata (search/social previews) is held to the same standard.
    for m in doc.find_all("meta"):
        key = (m.attrs.get("name") or m.attrs.get("property") or "").lower()
        if key == "description" or key.startswith("og:"):
            sources.append((f"index.html meta {key}", normalise(m.attrs.get("content", ""))))
    for p, root in site.svgs.items():
        if root is not None:
            sources.append((site.rel(p), svg_text(root)))
    for where, text in sources:
        problems.extend(f"{where}: {h}" for h in find_forbidden(text))
    return fail_if(problems, f"none of {len(FORBIDDEN_PHRASES)} forbidden phrases "
                             f"({len(ALLOW)} allowed)")


@check("C14")
def c14(site: Site) -> str:
    doc = need_html(site)
    text = visible_text(doc).lower()
    missing = [f for f in REQUIRED_FACTS if f.lower() not in text]
    if "no hardware test" not in text:
        block = site.by_id("arc-verification")
        if block is None or "hardware test" not in visible_text(block).lower():
            missing.append("no hardware test (or 'hardware test' in #arc-verification)")
    return fail_if([f"missing fact '{m}'" for m in missing],
                   f"all {len(REQUIRED_FACTS) + 1} required facts present", limit=20)


@check("C15")
def c15(site: Site) -> str:
    doc = need_html(site)
    problems = []

    def inside(el: Element, ident: str) -> bool:
        return el.has_ancestor(lambda a: a.attrs.get("id") == ident)

    anchors = doc.find_all("a")

    def links_to(url: str) -> list[Element]:
        return [a for a in anchors
                if a.attrs.get("href", "").strip().rstrip("/") == url.rstrip("/")]

    for url, sect in ((ARC_REPO_URL, "arc"), (MARKET_REPO_URL, "projects")):
        found = links_to(url)
        if not any(inside(a, sect) for a in found):
            problems.append(f"no link to {url} inside #{sect}")
    projects = site.by_id("projects")
    if projects is not None:
        for a in projects.find_all("a"):
            if "fsw" in (a.attrs.get("href", "") + " " + visible_text(a)).lower():
                problems.append(f"FSW link in #projects: {a.describe()}")
    return fail_if(problems, "ARC link in #arc, MarketTesting in #projects, no FSW link")


def css_sets(site: Site):
    """Return (root_decls, media_dark_decls, attr_dark_decls)."""
    root: dict[str, str] = {}
    media_dark: dict[str, str] = {}
    attr_dark: dict[str, str] = {}
    dark_attr = '[data-theme="dark"]'
    light_not = ':not([data-theme="light"])'
    for rule in site.css_rules:
        ctx = " ".join(rule.context).lower().replace(" ", "")
        in_dark_media = "prefers-color-scheme:dark" in ctx
        if not rule.context and ":root" in rule.selectors:
            root.update(rule.decls)
        if in_dark_media and any(s.startswith(":root") and light_not in s for s in rule.selectors):
            media_dark.update(rule.decls)
        if not in_dark_media and any(dark_attr in s for s in rule.selectors):
            attr_dark.update(rule.decls)
    return root, media_dark, attr_dark


@check("C16")
def c16(site: Site) -> str:
    if site.css is None:
        raise CheckFailed(f"{CSS_PATH} missing")
    problems = []
    root, media_dark, attr_dark = css_sets(site)
    missing = [t for t in REQUIRED_TOKENS if t not in root]
    if missing:
        problems.append(":root missing tokens " + ", ".join(missing))
    color_tokens = sorted(t for t in root if t.startswith("--color-"))
    for label, decls in (
            ('@media (prefers-color-scheme: dark) :root:not([data-theme="light"])', media_dark),
            (':root[data-theme="dark"]', attr_dark)):
        if not decls:
            problems.append(f"no {label} block")
            continue
        lacking = [t for t in color_tokens if t not in decls]
        if lacking:
            problems.append(f"{label} does not redefine " + ", ".join(lacking))
    for needle in (":focus-visible", "prefers-reduced-motion"):
        if needle not in site.css:
            problems.append(f"no {needle} rule")
    body_bg = any("body" in r.selectors and ("background" in r.decls or "background-color" in r.decls)
                  for r in site.css_rules)
    if not body_bg:
        problems.append("body rule does not set background")
    return fail_if(problems, f"{len(REQUIRED_TOKENS)} tokens, {len(color_tokens)} colors "
                             "redefined in both dark blocks")


@check("C17")
def c17(site: Site) -> str:
    if site.css is None:
        raise CheckFailed(f"{CSS_PATH} missing")
    root, media_dark, attr_dark = css_sets(site)
    problems, worst = [], None
    pairs = [(fg, bg, 4.5) for fg in ("--color-text", "--color-muted", "--color-accent")
             for bg in ("--color-bg", "--color-surface")] + [("--color-focus", "--color-bg", 3.0)]
    for label, decls in (("light", root), ("dark-media", {**root, **media_dark}),
                         ("dark-attr", {**root, **attr_dark})):
        for fg, bg, need in pairs:
            vals = []
            for tok in (fg, bg):
                v = decls.get(tok)
                if v is None or not HEX_RE.match(v.strip()):
                    problems.append(f"{label} {tok} is {v!r}, not #rgb/#rrggbb hex")
                    vals = []
                    break
                vals.append(v.strip())
            if not vals:
                continue
            ratio = contrast(*vals)
            if worst is None or ratio < worst[0]:
                worst = (ratio, f"{label} {fg}/{bg}")
            if ratio < need:
                problems.append(f"{label} {fg} {vals[0]} on {bg} {vals[1]} "
                                f"= {ratio:.2f}:1 (need {need}:1)")
    problems = list(dict.fromkeys(problems))
    detail = f"lowest {worst[0]:.2f}:1 ({worst[1]})" if worst else "no pairs"
    return fail_if(problems, detail)


@check("C18")
def c18(site: Site) -> str:
    path = site.root / SVG_PATH
    if not path.is_file():
        raise CheckFailed(f"{SVG_PATH} missing")
    root = site.svgs.get(path)
    if root is None:
        raise CheckFailed(f"{SVG_PATH} is not well-formed XML ({site.svg_errors.get(path)})")
    problems = []
    if local_name(root.tag) != "svg":
        problems.append(f"root element is <{local_name(root.tag)}>, not <svg>")
    if not root.get("viewBox"):
        problems.append("root has no viewBox")
    if root.get("role") != "img":
        problems.append('root lacks role="img"')
    kids = {local_name(c.tag) for c in root}
    for need in ("title", "desc"):
        if need not in kids:
            problems.append(f"no child <{need}>")
    text = svg_text(root).lower()
    for needed in (("Intended system architecture",), ("I²C", "I2C"), ("ESP32-S3",),
                   ("RS-485",), ("V5 Brain",)):
        if not any(n.lower() in text for n in needed):
            problems.append("text lacks " + " or ".join(f"'{n}'" for n in needed))
    return fail_if(problems, f"{SVG_PATH} well-formed with title, desc and labels")


@check("C19")
def c19(site: Site) -> str:
    total = sum(p.stat().st_size for p in site.files)
    problems = []
    if total >= TOTAL_BUDGET_BYTES:
        problems.append(f"docs/ is {total} bytes (budget < {TOTAL_BUDGET_BYTES})")
    js = site.root / JS_PATH
    if not js.is_file():
        problems.append(f"{JS_PATH} missing")
    elif js.stat().st_size >= JS_BUDGET_BYTES:
        problems.append(f"{JS_PATH} is {js.stat().st_size} bytes (budget < {JS_BUDGET_BYTES})")
    js_size = js.stat().st_size if js.is_file() else 0
    return fail_if(problems, f"docs/ {total} bytes, site.js {js_size} bytes")


# ---------------------------------------------------------------------------
# Runner
# ---------------------------------------------------------------------------

def run_checks(root: Path | str) -> list[Result]:
    root = Path(root)
    if not root.is_dir():
        return [(cid, False, f"root {root} is not a directory") for cid, _ in CHECKS]
    site = Site(root)
    results: list[Result] = []
    for cid, fn in CHECKS:
        try:
            results.append((cid, True, fn(site)))
        except CheckFailed as exc:
            results.append((cid, False, str(exc)))
        except Exception as exc:  # a crashing check is a failure, never a pass
            results.append((cid, False, f"check crashed: {type(exc).__name__}: {exc}"))
    return results


def main(argv: list[str] | None = None) -> int:
    default_root = Path(__file__).resolve().parent.parent / "docs"
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--root", type=Path, default=default_root,
                        help="site directory to check (default: docs/ next to tools/)")
    args = parser.parse_args(argv)
    try:
        sys.stdout.reconfigure(errors="replace")
    except AttributeError:
        pass
    results = run_checks(args.root)
    for cid, ok, detail in results:
        print(f"{'PASS' if ok else 'FAIL'} {cid} {detail}")
    return 1 if any(not ok for _, ok, _ in results) else 0


if __name__ == "__main__":
    sys.exit(main())
