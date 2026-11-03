"""Collect every English text spoken in dasha-english-hub and add it to card-audio/texts.json.
Run: python3 tools/dasha-audio-collect.py   (serves the repo locally, opens the page in headless Chromium)
Then push: the "Card audio" workflow records new texts with a natural neural voice."""
import json, pathlib, threading, http.server, socketserver, functools
from playwright.sync_api import sync_playwright
ROOT = pathlib.Path(__file__).resolve().parent.parent
handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(ROOT))
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
srv = socketserver.TCPServer(("127.0.0.1", 0), functools.partial(Q, directory=str(ROOT)))
port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page()
    pg.goto(f"http://127.0.0.1:{port}/dasha-english-hub/"); pg.wait_for_timeout(800)
    new = pg.evaluate("window.__collectTexts()")
    b.close()
out = ROOT / "card-audio" / "texts.json"
cur = json.loads(out.read_text(encoding="utf-8")) if out.exists() else {}
add = {k: v for k, v in new.items() if k not in cur}
print(f"{len(new)} texts on the page, {len(add)} new")
if add:
    cur.update(add)
    out.write_text("{" + ",\n".join(f"{json.dumps(k)}:{json.dumps(v, ensure_ascii=False)}" for k, v in cur.items()) + "}", encoding="utf-8")
