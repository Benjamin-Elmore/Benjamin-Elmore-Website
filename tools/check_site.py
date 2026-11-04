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
from html import unescape
from html.parser import HTMLParser
from pathlib import Path
from typing import Callable
from urllib.parse import unquote

# ---------------------------------------------------------------------------
# Tunable constants (reviewers edit these, not the check code)
# ---------------------------------------------------------------------------

#: C13. Matched case-insensitively against the visible text of index.html,
#: its public metadata (meta description / og:*), the text of title /
#: aria-label / aria-description / placeholder attributes, CSS ``content:``
#: strings and SVG text. A plain entry is a whole-word phrase (word boundary
#: on both sides; spaces match any whitespace). An entry starting with ``re:``
#: is a regex with a word boundary at the start only, so a stem such as
#: ``reliab\w*`` also catches "reliably" and "reliability" (CR1-16). Stems
#: start at a word boundary, so negated forms like "unproven" still pass.
FORBIDDEN_PHRASES: tuple[str, ...] = (
    r"re:throughputs?\b",
    r"re:latenc\w*",                      # latency, latencies, low-latency
    r"re:determinis\w*",                  # deterministic(ally), determinism
    r"re:real[-\s]?time\b",               # real-time, real time, realtime
    r"re:reliab\w*",                      # reliable, reliably, reliability
    r"re:robust\w*",                      # robust, robustness, robustly
    r"re:deploy\w*",                      # deploy, deployed, deployment
    "in production",
    r"re:production[-\s]ready\b",
    r"re:production[-\s]systems?\b",
    r"re:release[sd]?\b",                 # release, released, releases
    "flight-ready",
    "flight-tested",
    "flight-validated",
    "battle-tested",
    "hardware-tested",
    "hardware-verified",
    r"re:prove[nd]\b",                    # proven, proved ("unproven" passes)
    r"re:guarantee\w*",                   # guarantee, guaranteed, guarantees
    r"re:accura\w*",                      # accuracy, accurate, accurately
    r"re:outperform\w*",
    r"re:profit\w*",                      # profit, profitable, profits
    "returns",
    "fully tested",
    "end-to-end tested",
    "validated",                          # not bare "validation" (CONTENT-REVIEW-1)
    r"re:autonomous(?:ly)?[-\s]+navigat\w*",
    r"re:autonomous(?:ly)?[-\s]+(?:flight|fl(?:y|ies|ying|own|ew))\b",
    "CFD",
    r"re:race[-\s]free(?:dom)?\b",        # race-free, race freedom
    r"re:sole[-\s]author\w*",             # sole author, sole authorship
    "ARC-Testing",                        # T3: the public branch is CPPDev
    "separate snapshot",
    r"re:r[eé]sum[eé]\b",                # whole word, so "resumed" passes
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
    "CPPDev",
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

#: C08 (T2). Denied anywhere in the raw text of any file under docs/: team and
#: teammate accounts stay off the page (FINDINGS B2/B7).
DENY_RE = re.compile(r"SdBenE|CBU-Robotics|RobotBenjaminLucas", re.I)
#: C08. Namespace URIs that are identifiers, not requests.
XMLNS_URLS = frozenset({
    "http://www.w3.org/2000/svg", "http://www.w3.org/1999/xlink",
    "http://www.w3.org/1999/xhtml", "http://www.w3.org/XML/1998/namespace",
})
#: C07/C08. Attributes whose value is a URL (srcset/imagesrcset are lists).
URL_ATTRS = frozenset({
    "href", "src", "srcset", "imagesrcset", "poster", "action", "formaction",
    "data", "cite", "background", "manifest", "longdesc", "icon", "ping",
    "xlink:href",
})
SRCSET_ATTRS = frozenset({"srcset", "imagesrcset"})
#: C10 (CR1-20). File names that look like a resume/CV.
RESUME_NAME_RE = re.compile(r"r[eé]sum[eé]|(?<![a-z])cv(?![a-z])", re.I)

BINARY_EXTENSIONS = {".png", ".jpg", ".jpeg", ".gif", ".webp", ".avif", ".ico",
                     ".pdf", ".woff", ".woff2", ".ttf", ".otf", ".zip", ".bin"}
TEXT_EXTENSIONS = {".html", ".htm", ".css", ".js", ".mjs", ".svg", ".txt",
                   ".xml", ".json", ".webmanifest", ".map"}
SVG_PATH = "assets/arc-architecture.svg"
STACKED_SVG_PATH = "assets/arc-architecture-stacked.svg"
#: C18. Architecture diagrams (PLAN 2.5 amendment A1). Each must exist and
#: carry the required labels; every other *.svg under assets/ gets the
#: structural checks only.
ARCH_SVG_PATHS: tuple[str, ...] = (SVG_PATH, STACKED_SVG_PATH)
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
    "time", "u", "var", "wbr",
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
        #: (line, text) of every HTML comment; comments are published (C11).
        self.comments: list[tuple[int, str]] = []

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

    def handle_comment(self, data):
        self.comments.append((self.getpos()[0], data))

    def close(self):
        super().close()
        for el in self.stack[1:]:
            self.errors.append(f"{el.describe()} never closed")
        del self.stack[1:]


_INVISIBLE_RE = re.compile("[\u00ad\u200b-\u200d\u2060\ufeff]")
_DASH_RE = re.compile("[\u2010-\u2013\u2212]")


def normalise(text: str) -> str:
    """NFC, drop soft hyphen / zero-width characters, fold dashes to '-'."""
    text = unicodedata.normalize("NFC", text)
    text = _DASH_RE.sub("-", _INVISIBLE_RE.sub("", text))
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

def parse_html(text: str) -> TreeBuilder:
    builder = TreeBuilder()
    builder.feed(text)
    builder.close()
    return builder


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
        self.comments: list[tuple[int, str]] = []
        if self.index_path.is_file():
            try:
                self.html = self.index_path.read_text(encoding="utf-8")
                builder = parse_html(self.html)
                self.doc = builder.document
                self.balance_errors = builder.errors
                self.comments = builder.comments
            except Exception as exc:  # decode or parser failure
                self.html_error = f"{type(exc).__name__}: {exc}"
        #: Every *.html under docs/ (index included), parsed (C08 scans all).
        self.html_docs: dict[Path, Element] = {}
        for p in self.files:
            if p.suffix.lower() in (".html", ".htm"):
                if p == self.index_path and self.doc is not None:
                    self.html_docs[p] = self.doc
                    continue
                try:
                    self.html_docs[p] = parse_html(
                        p.read_text(encoding="utf-8", errors="replace")).document
                except Exception:
                    pass
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
        """Every text-like file under docs/ (by extension, or no NUL bytes)."""
        if not hasattr(self, "_text_files"):
            out = []
            for p in self.files:
                data = p.read_bytes()
                if p.suffix.lower() in TEXT_EXTENSIONS or (data and b"\0" not in data[:4096]
                                                          and p.suffix.lower() not in BINARY_EXTENSIONS):
                    out.append((p, data.decode("utf-8", errors="replace")))
            self._text_files = out
        return self._text_files

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


SCHEME_RE = re.compile(r"^[a-z][a-z0-9+.-]*:", re.I)


def browser_url(value: str) -> str:
    """Normalise a URL the way browsers do before resolving it (CR1-18):
    strip ASCII tab/newline/CR and outer whitespace, and turn every backslash
    into a slash (http(s) URLs treat them alike)."""
    return re.sub(r"[\t\n\r]", "", value).strip().replace("\\", "/")


def is_external(value: str) -> bool:
    """True for anything that is not a local path: a scheme, //host or #."""
    v = browser_url(value)
    return bool(SCHEME_RE.match(v) or v.startswith("//") or v.startswith("#"))


def srcset_urls(value: str) -> list[str]:
    """The URL of each candidate in a srcset list ("a.svg 1x, b.svg 2x")."""
    return [cand.split()[0] for cand in value.split(",") if cand.strip()]


def attr_urls(name: str, value: str) -> list[str]:
    """URLs held by an attribute named in URL_ATTRS (srcset lists split)."""
    name = name.lower()
    if name in SRCSET_ATTRS:
        return srcset_urls(value or "")
    if name in URL_ATTRS:
        return [value or ""]
    return []


@check("C07")
def c07(site: Site) -> str:
    doc = need_html(site)
    problems = []
    imgs = doc.find_all("img")
    for img in imgs:
        for attr in ("alt", "width", "height"):
            if not img.attrs.get(attr, "").strip():
                problems.append(f"{img.describe()} missing {attr}")
    pictures = doc.find_all("picture")
    for pic in pictures:
        if not pic.find_all("img"):
            problems.append(f"{pic.describe()} has no <img> fallback")
        for src in pic.find_all("source"):
            if not src.attrs.get("srcset", "").strip():
                problems.append(f"{src.describe()} in <picture> has no srcset")
    root = site.root.resolve()
    checked = 0
    for el in doc.iter():
        for attr, raw in el.attrs.items():
            for value in attr_urls(attr, raw):
                if is_external(value):
                    continue  # C08 judges external URLs
                value = browser_url(value)
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
    return fail_if(problems, f"{len(imgs)} img, {len(pictures)} picture ok, "
                             f"{checked} local paths exist")


def html_urls(doc: Element):
    """Yield (url, element, attr) for every http(s) URL in an attribute value."""
    for el in doc.iter():
        for name, value in el.attrs.items():
            if name.startswith("xmlns"):
                continue
            for m in URL_RE.finditer(browser_url(value or "")):
                yield m.group(0), el, name


def js_without_comments(text: str) -> str:
    text = re.sub(r"/\*.*?\*/", "", text, flags=re.S)
    return re.sub(r"(?m)^\s*//.*$", "", text)


#: Any http(s)/ftp URL in raw text, tolerating backslashes and odd slashes.
RAW_URL_RE = re.compile(r"\b(?:https?|ftp)\s*:[\\/]*[^\s\"'<>()\\/][^\s\"'<>()]*", re.I)
CSS_URL_RE = re.compile(r"""url\(\s*(?:"([^"]*)"|'([^']*)'|([^)\s]*))\s*\)""", re.I)
CSS_IMPORT_RE = re.compile(r"""@import\s+(?:"([^"]*)"|'([^']*)')""", re.I)


def css_targets(css: str) -> list[str]:
    """Every url(...) and @import "..." target in a CSS text."""
    css = strip_css_comments(css)
    out = []
    for rx in (CSS_URL_RE, CSS_IMPORT_RE):
        for m in rx.finditer(css):
            out.append(next(g for g in m.groups() if g is not None))
    return out


def canonical_external(value: str) -> str | None:
    """The absolute URL a value would load if it leaves the site, else None.
    A leading // becomes https://; "https:" followed by any run of slashes or
    backslashes becomes "https://"."""
    v = browser_url(value)
    if v.startswith("//"):
        return "https:" + v
    m = re.match(r"^(https?|ftp):/*(.*)$", v, re.I | re.S)
    if m:
        return f"{m.group(1).lower()}://{m.group(2)}"
    return None


@check("C08")
def c08(site: Site) -> str:
    need_html(site)
    problems, count = [], 0
    allowed_norm = {u.rstrip("/") for u in ALLOWED_URLS}
    site_norm = SITE_URL.rstrip("/")

    def judge(url: str, where: str, site_url_ok: bool) -> None:
        nonlocal count
        count += 1
        if url.lower().startswith(("http://", "ftp://")):
            problems.append(f"insecure {url.split(':', 1)[0]}:// URL {url} in {where}")
        elif url.rstrip("/") == site_norm:
            if not site_url_ok:
                problems.append(f"site URL {url} outside og:url/canonical ({where})")
        elif url.rstrip("/") not in allowed_norm:
            problems.append(f"URL not on allowlist: {url} in {where}")

    def judge_value(value: str, where: str, site_url_ok: bool = False) -> None:
        url = canonical_external(value)
        if url is not None:
            judge(url, where, site_url_ok)

    def judge_css(css: str, where: str) -> None:
        for target in css_targets(css):
            judge_value(target, f"{where} url()/@import")

    def judge_raw(text: str, where: str) -> None:
        # The site URL is policed in attributes (step 1), so raw text skips it.
        for m in RAW_URL_RE.finditer(text):
            url = canonical_external(m.group(0)) or m.group(0)
            head = text[max(0, m.start() - 40):m.start()]
            if url in XMLNS_URLS and re.search(r"xmlns(?::[\w-]+)?\s*=\s*[\"']$", head):
                continue
            if url.rstrip("/") != site_norm:
                judge(url, where, False)

    # 1. Every HTML file: URL attributes (incl. //host and backslash forms),
    #    http(s) URLs inside any other attribute, style attributes, <style>.
    for p, doc in site.html_docs.items():
        name = site.rel(p)
        for el in doc.iter():
            is_og_url = el.tag == "meta" and el.attrs.get("property") == "og:url"
            is_canonical = (el.tag == "link" and "canonical"
                            in el.attrs.get("rel", "").lower().split())
            for attr, value in el.attrs.items():
                if attr.startswith("xmlns"):
                    continue
                where = f"{name} {attr} of {el.describe()}"
                ok = (is_og_url and attr == "content") or (is_canonical and attr == "href")
                urls = attr_urls(attr, value or "")
                for u in urls:
                    judge_value(u, where, ok)
                if not urls:
                    for m in URL_RE.finditer(browser_url(value or "")):
                        judge(m.group(0), where, ok)
                if attr == "style":
                    judge_css(value or "", where)
            if el.tag == "style":
                judge_css(el.raw_text(), f"{name} <style> {el.describe()}")
    # 2. Every CSS file and every SVG: url()/@import targets, href/src.
    for p, text in site.text_files():
        if p.suffix.lower() == ".css":
            judge_css(text, site.rel(p))
    for p, root in site.svgs.items():
        if root is None:
            continue
        for el in root.iter():
            for name, value in el.attrib.items():
                lname = local_name(name)
                if lname in ("href", "src"):
                    judge_value(value, f"{site.rel(p)} attribute {lname}")
                elif lname == "style":
                    judge_css(value, f"{site.rel(p)} style attribute")
            if local_name(el.tag) == "style" and el.text:
                judge_css(el.text, f"{site.rel(p)} <style>")
    # 3. Raw text of every text file: comments, prose, JS strings, .txt ...
    for p, text in site.text_files():
        if p.suffix.lower() in (".js", ".mjs"):
            text = js_without_comments(text)
        judge_raw(text, site.rel(p))
    # 4. T2: team and teammate accounts are denied anywhere, links or prose.
    for p, text in site.text_files():
        for m in DENY_RE.finditer(text):
            problems.append(f"{site.rel(p)}: denied account '{m.group(0)}'")
    problems = list(dict.fromkeys(problems))
    return fail_if(problems, f"{count} external URL uses, all allowlisted https")


@check("C09")
def c09(site: Site) -> str:
    problems = []
    for p, text in site.text_files():
        # Also decode %xx so "%46SW-UAV-SIM" can't slip past (CR1 mutation run).
        for variant in dict.fromkeys((text, unquote(text))):
            for m in FSW_URL_RE.finditer(variant):
                problems.append(f"{site.rel(p)}: FSW URL '{m.group(0)}'")
    problems = list(dict.fromkeys(problems))
    return fail_if(problems, "no FSW-UAV-SIM URL")


@check("C10")
def c10(site: Site) -> str:
    problems = []
    for p in site.files:
        if p.suffix.lower() == ".md":
            problems.append(f"markdown file {site.rel(p)} under docs/")
        if RESUME_NAME_RE.search(p.name):
            problems.append(f"file name {site.rel(p)} looks like a resume/CV")
    for p, text in site.text_files():
        for pat in WORK_FILE_PATTERNS:
            m = re.search(pat, text, re.I)
            if m:
                problems.append(f"{site.rel(p)}: references '{m.group(0)}'")
    return fail_if(problems, "no handoff/work-file references, no .md or resume files")


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


def hidden_html_text(doc: Element) -> list[tuple[str, str]]:
    """(where, text) for published-but-unrendered HTML text: <template> bodies."""
    out = []
    for el in doc.find_all("template"):
        out.append((f"<template> {el.describe()}", normalise(el.raw_text())))
    return out


@check("C11")
def c11(site: Site) -> str:
    doc = need_html(site)
    problems = []
    # Emails and mailto:/tel: in the raw text of every text file under docs/
    # (HTML incl. comments, <template> and attributes; CSS; JS; SVG; .txt).
    # "@media"/"@import" never follow a word character, so CSS at-rules
    # don't look like emails (CR1-17).
    for p, text in site.text_files():
        for e in find_emails(unescape(text)):
            problems.append(f"email-like '{e}' in {site.rel(p)}")
        m = re.search(r"\b(mailto|tel):", unescape(text), re.I)
        if m:
            problems.append(f"'{m.group(0)}' in {site.rel(p)}")
    # Phone numbers: text a reader can see (visible text, SVG text, HTML
    # comments, <template> bodies, .txt files). Not attributes, CSS or SVG
    # geometry, where long digit runs are coordinates.
    phone_sources = [("index.html visible text", visible_text(doc))]
    phone_sources += [(f"index.html {w}", t) for w, t in hidden_html_text(doc)]
    phone_sources += [(f"index.html comment at line {ln}", normalise(c))
                      for ln, c in site.comments]
    for p, root in site.svgs.items():
        if root is not None:
            phone_sources.append((f"{site.rel(p)} text", svg_text(root)))
    for p, text in site.text_files():
        if p.suffix.lower() == ".txt":
            phone_sources.append((site.rel(p), normalise(text)))
    for where, s in phone_sources:
        for ph in find_phones(s):
            problems.append(f"phone-like '{ph}' in {where}")
    problems = list(dict.fromkeys(problems))
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
    """Compile a FORBIDDEN_PHRASES entry (see its comment for the syntax)."""
    if phrase.startswith("re:"):
        return re.compile(rf"(?<!\w)(?:{phrase[3:]})", re.I)
    body = r"\s+".join(re.escape(w) for w in phrase.split())
    return re.compile(rf"(?<!\w){body}(?!\w)", re.I)


def phrase_label(phrase: str) -> str:
    return phrase[3:] if phrase.startswith("re:") else phrase


def find_forbidden(text: str) -> list[str]:
    hits = []
    for phrase in FORBIDDEN_PHRASES:
        if phrase in ALLOW or phrase_label(phrase) in ALLOW:
            continue
        m = phrase_regex(phrase).search(text)
        if m:
            lo, hi = max(0, m.start() - 30), min(len(text), m.end() + 30)
            hits.append(f"'{m.group(0)}' (rule {phrase_label(phrase)}) in "
                        f"\"...{text[lo:hi]}...\"")
    return hits


#: C13. Attributes whose text a reader sees or hears (tooltip, screen reader).
C13_ATTRS = ("title", "aria-label", "aria-description", "placeholder")
CSS_CONTENT_RE = re.compile(r"""content\s*:\s*((?:"[^"]*"|'[^']*'|[^;}"'])*)""", re.I)


def css_content_strings(css: str) -> list[str]:
    out = []
    for m in CSS_CONTENT_RE.finditer(strip_css_comments(css)):
        out.extend(a or b for a, b in re.findall(r'"([^"]*)"|\'([^\']*)\'', m.group(1)))
    return [s for s in out if s.strip()]


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
    for el in doc.iter():
        for attr in C13_ATTRS:
            if el.attrs.get(attr):
                sources.append((f"index.html {attr} of {el.describe()}",
                                normalise(el.attrs[attr])))
        if el.tag == "style":
            for s in css_content_strings(el.raw_text()):
                sources.append((f"index.html <style> content", normalise(s)))
    for p, text in site.text_files():
        if p.suffix.lower() == ".css":
            for s in css_content_strings(text):
                sources.append((f"{site.rel(p)} content", normalise(s)))
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
             for bg in ("--color-bg", "--color-surface")] + [
        # .tag and inline code sit on --color-code-bg (CR1-20).
        ("--color-text", "--color-code-bg", 4.5), ("--color-muted", "--color-code-bg", 4.5),
        ("--color-focus", "--color-bg", 3.0)]
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
    """Every *.svg under docs/assets/ is well-formed, an <svg role="img"> with
    viewBox, <title> and <desc>; each ARCH_SVG_PATHS file must exist and carry
    the architecture labels (PLAN 2.5 amendment A1, CR1-20)."""
    problems = []
    arch = {site.root / rel for rel in ARCH_SVG_PATHS}
    for path in sorted(arch):
        if not path.is_file():
            problems.append(f"{site.rel(path)} missing")
    assets = site.root / "assets"
    svgs = sorted(p for p in site.svgs if assets in p.parents) + sorted(
        p for p in arch if p.is_file() and assets not in p.parents)
    for path in svgs:
        name = site.rel(path)
        root = site.svgs.get(path)
        if root is None:
            problems.append(f"{name} is not well-formed XML ({site.svg_errors.get(path)})")
            continue
        if local_name(root.tag) != "svg":
            problems.append(f"{name} root element is <{local_name(root.tag)}>, not <svg>")
        if not root.get("viewBox"):
            problems.append(f"{name} root has no viewBox")
        if root.get("role") != "img":
            problems.append(f'{name} root lacks role="img"')
        kids = {local_name(c.tag) for c in root}
        for need in ("title", "desc"):
            if need not in kids:
                problems.append(f"{name} has no child <{need}>")
        if path in arch:
            text = svg_text(root).lower()
            for needed in (("Intended system architecture",), ("I²C", "I2C"), ("ESP32-S3",),
                           ("RS-485",), ("V5 Brain",)):
                if not any(n.lower() in text for n in needed):
                    problems.append(f"{name} text lacks "
                                    + " or ".join(f"'{n}'" for n in needed))
    return fail_if(problems, f"{len(svgs)} SVGs well-formed with title and desc; "
                             f"{len(arch)} architecture diagrams carry the labels")


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
