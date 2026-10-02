"""Dependency-free static checks, without opening pages or calling services."""
import json
import subprocess
import tempfile
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
paths = [ROOT / p for p in subprocess.check_output(
    ["git", "ls-files", "-z"], cwd=ROOT).decode().split("\0") if p]

def check_js(source, label, module=False):
    result = subprocess.run(
        ["node", "--check", "--input-type=" + ("module" if module else "commonjs")],
        input=source, text=True, capture_output=True)
    if result.returncode:
        raise ValueError(f"{label}:\n{result.stderr}")

class Page(HTMLParser):
    def __init__(self, path):
        super().__init__(convert_charrefs=False)
        self.path, self.script, self.buffer = path, None, []
        self.scripts = 0

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "script":
            self.script, self.buffer = attrs, []
        resource = attrs.get("src") if tag == "script" else (
            attrs.get("href") if tag == "link" and attrs.get("rel") == "stylesheet" else None)
        if resource:
            url = urlsplit(resource)
            if not url.scheme and not url.netloc:
                target = (ROOT if url.path.startswith("/") else self.path.parent) / unquote(url.path.lstrip("/"))
                if not target.is_file():
                    raise ValueError(f"{self.path.relative_to(ROOT)}: missing local resource {resource}")

    def handle_data(self, data):
        if self.script is not None:
            self.buffer.append(data)

    def handle_endtag(self, tag):
        if tag != "script" or self.script is None:
            return
        attrs, source = self.script, "".join(self.buffer)
        kind = attrs.get("type", "").strip().lower()
        if "src" not in attrs and source.strip():
            if kind in ("", "text/javascript", "application/javascript", "module"):
                check_js(source, f"{self.path.relative_to(ROOT)} inline script {self.scripts + 1}", kind == "module")
                self.scripts += 1
            elif kind in ("application/json", "application/ld+json", "importmap"):
                json.loads(source)
        self.script = None

count = 0
for path in paths:
    if path.suffix == ".html":
        page = Page(path)
        page.feed(path.read_text(encoding="utf-8"))
        page.close()
        if page.script is not None:
            raise ValueError(f"{path}: unclosed script element")
        print(f"OK {path.relative_to(ROOT)} ({page.scripts} inline scripts)")
        count += 1
    elif path.suffix in (".js", ".mjs", ".cjs"):
        subprocess.run(["node", "--check", str(path)], check=True)
        print(f"OK {path.relative_to(ROOT)}")
        count += 1
assert count, "No HTML or JavaScript files found"
print("Static syntax/resources passed; browser rendering and runtime behavior are not tested")
