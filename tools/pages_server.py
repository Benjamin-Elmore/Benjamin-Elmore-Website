#!/usr/bin/env python3
"""Local stand-in for GitHub Pages (stdlib only).

Case-sensitive lookup, 301 from a directory to its trailing-slash form, dir/ serves index.html,
anything missing gets a 404 with the body of 404.html, no directory listings.

  python tools/pages_server.py [--root docs] [--port 8765] [--base /]
Port 0 picks a free port. The first line printed is "listening http://127.0.0.1:<port>".
"""
import argparse
import mimetypes
import os
import sys
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlsplit

mimetypes.add_type("font/woff2", ".woff2")
mimetypes.add_type("text/javascript", ".js")


def make_handler(root, base):
    root = root.resolve()
    not_found = (root / "404.html").read_bytes() if (root / "404.html").is_file() else b"Not found"

    def lookup(rel):
        """Exact-case walk under root; returns a Path or None. Never leaves root."""
        cur = root
        for part in [p for p in rel.split("/") if p]:
            if part in ("..", ".") or "\\" in part or "\0" in part:
                return None
            if not cur.is_dir() or part not in os.listdir(cur):
                return None
            cur = cur / part
        return cur

    class H(BaseHTTPRequestHandler):
        def log_message(self, *a):
            pass

        def send(self, code, body, ctype="text/html; charset=utf-8", extra=None, head=False):
            self.send_response(code)
            self.send_header("Content-Type", ctype)
            self.send_header("Content-Length", str(len(body)))
            self.send_header("Cache-Control", "no-store")
            for k, v in (extra or {}).items():
                self.send_header(k, v)
            self.end_headers()
            if not head:
                self.wfile.write(body)

        def handle_any(self, head):
            parts = urlsplit(self.path)
            path = unquote(parts.path)
            query = "?" + parts.query if parts.query else ""
            if path + "/" == base:  # /Benjamin-Elmore-Website -> slash form
                return self.send(301, b"", extra={"Location": base + query}, head=head)
            if not path.startswith(base):
                return self.send(404, not_found, head=head)
            rel = path[len(base):]
            target = lookup(rel)
            if target is not None and target.is_dir():
                if rel and not rel.endswith("/"):
                    return self.send(301, b"", extra={"Location": base + rel + "/" + query}, head=head)
                target = target / "index.html"
                if not target.is_file():
                    target = None
            if target is None or not target.is_file() or (rel.endswith("/") and not rel.endswith("//") and target.name != "index.html"):
                return self.send(404, not_found, head=head)
            ctype = mimetypes.guess_type(target.name)[0] or "application/octet-stream"
            if ctype.startswith("text/") or ctype in ("image/svg+xml",):
                ctype += "; charset=utf-8" if "charset" not in ctype else ""
            self.send(200, target.read_bytes(), ctype, head=head)

        def do_GET(self):
            self.handle_any(False)

        def do_HEAD(self):
            self.handle_any(True)

    return H


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--root", default=str(Path(__file__).resolve().parent.parent / "docs"))
    ap.add_argument("--port", type=int, default=8765)
    ap.add_argument("--base", default="/")
    a = ap.parse_args()
    srv = ThreadingHTTPServer(("127.0.0.1", a.port), make_handler(Path(a.root), a.base))
    print(f"listening http://127.0.0.1:{srv.server_address[1]}", flush=True)
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        pass
    return 0


if __name__ == "__main__":
    sys.exit(main())
