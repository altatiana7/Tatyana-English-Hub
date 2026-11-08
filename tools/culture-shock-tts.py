#!/usr/bin/env python3
"""Озвучка урока Culture Shock (B1) — три истории.

Читает `culture-shock-b1/data.js`, вытаскивает тексты и записывает mp3
в `culture-shock-b1/audio/` нейроголосом (edge-tts). Файлы, которые уже есть,
повторно не пишутся, поэтому скрипт можно запускать сколько угодно раз.

Запуск:
    python3 -m venv .venv-tts && .venv-tts/bin/pip install edge-tts
    .venv-tts/bin/python tools/culture-shock-tts.py            # записать истории
    .venv-tts/bin/python tools/culture-shock-tts.py --manifest # только пересобрать манифест

Нужен интернет до speech.platform.bing.com — в песочнице Arena он закрыт,
поэтому там скрипт не отработает (плеер тогда читает браузерным синтезом).
"""
from __future__ import annotations

import argparse
import asyncio
import json
import pathlib
import re
import sys

try:
    import edge_tts
except ImportError:  # pragma: no cover
    edge_tts = None

ROOT = pathlib.Path(__file__).resolve().parent.parent
DIR = ROOT / "culture-shock-b1"
AUDIO = DIR / "audio"

VOICE_GB = "en-GB-SoniaNeural"
VOICE_US = "en-US-AriaNeural"
RATE = "-4%"


# ─────────────────────────── разбор data.js ───────────────────────────
def parse_data() -> dict:
    """Достаём истории из data.js без запуска JS.

    Файл — обычный JS-объект, поэтому идём по блокам вручную:
    истории лежат между `videos: [` и `comparison:`, в каждой есть id,
    speaker и массив transcript со строками {who, text}.
    """
    src = (DIR / "data.js").read_text(encoding="utf-8")
    start = src.index("videos: [")
    end = src.index("comparison:", start)
    block = src[start:end]
    stories = []
    for m in re.finditer(r'\{\s*\n\s*id:\s*"(\w+)"', block):
        story_id = m.group(1)
        chunk = block[m.start():]
        # speaker
        sp = re.search(r'speaker:\s*"([^"]+)"', chunk)
        # transcript до следующего questions:
        tr = re.search(r"transcript:\s*\[(.*?)\n\s*\],", chunk, re.S)
        lines = []
        if tr:
            lines = re.findall(r'text:\s*"((?:[^"\\]|\\.)*)"', tr.group(1))
        stories.append({
            "id": story_id,
            "speaker": (sp.group(1).split(",")[0] if sp else "Speaker"),
            "lines": [_js_string(l) for l in lines],
        })
    return {"stories": stories}


def _js_string(raw: str) -> str:
    """Раскрываем JS-эскейпы в строке (\\" и т.п.) через json, не ломая UTF-8."""
    try:
        return json.loads('"' + raw.replace('"', '\\"') + '"') if "\\" in raw else raw
    except Exception:
        return raw


def clean(text: str) -> str:
    """Убираем типографские кавычки и лишние пробелы — так голос звучит ровнее."""
    text = text.replace("“", "").replace("”", "").replace("’", "'").replace("—", "-")
    return re.sub(r"\s+", " ", text).strip()


async def record(path: pathlib.Path, text: str, voice: str, rate: str = RATE) -> None:
    if path.exists() and path.stat().st_size > 1000:
        print(f"  skip {path.name}", flush=True)
        return
    if edge_tts is None:
        raise SystemExit("edge-tts не установлен: pip install edge-tts")
    tmp = path.with_suffix(".part")
    await edge_tts.Communicate(text, voice, rate=rate).save(str(tmp))
    if tmp.stat().st_size < 1000:
        tmp.unlink(missing_ok=True)
        raise RuntimeError(f"empty audio for {path.name}")
    tmp.replace(path)
    print(f"  ok   {path.name} ({path.stat().st_size // 1024} KB)", flush=True)


async def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--manifest", action="store_true", help="только пересобрать audio-manifest.js")
    args = ap.parse_args()

    AUDIO.mkdir(parents=True, exist_ok=True)
    data = parse_data()
    if not data["stories"]:
        raise SystemExit("не удалось разобрать истории из data.js")

    if not args.manifest:
        for st in data["stories"]:
            text = " ".join(clean(l) for l in st["lines"])
            print(f"story {st['id']} — {len(text)} chars", flush=True)
            voice = VOICE_US if st["id"] == "kr" else VOICE_GB
            await record(AUDIO / f"{st['id']}.mp3", text, voice)

    # манифест для плеера: какие файлы реально есть
    files = sorted(p.stem for p in AUDIO.glob("*.mp3"))
    manifest = {f: True for f in files}
    out = DIR / "audio-manifest.js"
    body = "/* Сгенерировано tools/culture-shock-tts.py — не править вручную. */\n" \
           "window.CULTURE_SHOCK_AUDIO = " + json.dumps(manifest, ensure_ascii=False, indent=2) + ";\n"
    out.write_text(body, encoding="utf-8")
    print(f"manifest: {out.name} — {len(files)} файлов")


if __name__ == "__main__":
    asyncio.run(main())
