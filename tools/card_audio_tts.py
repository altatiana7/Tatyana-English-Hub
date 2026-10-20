"""Record card audio with a natural neural voice.

Reads card-audio/texts.json ({key: text}) and writes card-audio/<key>.mp3 for every
text that has no recording yet. Run by the "Card audio" GitHub workflow.
"""
import asyncio
import json
import pathlib
import sys

import edge_tts

ROOT = pathlib.Path(__file__).resolve().parent.parent
DIR = ROOT / "card-audio"
VOICE = "en-GB-SoniaNeural"
RATE = "-6%"
WORKERS = 8


async def record(key, text, sem, stats):
    out = DIR / f"{key}.mp3"
    async with sem:
        for attempt in range(4):
            try:
                tmp = out.with_suffix(".part")
                await edge_tts.Communicate(text, VOICE, rate=RATE).save(str(tmp))
                if tmp.stat().st_size < 1000:
                    raise RuntimeError("empty audio")
                tmp.replace(out)
                stats["ok"] += 1
                if stats["ok"] % 200 == 0:
                    print(f"  {stats['ok']} recorded", flush=True)
                return
            except Exception as e:  # network hiccups: wait and retry
                await asyncio.sleep(2 + attempt * 3)
                last = e
        stats["fail"] += 1
        print(f"FAILED {key}: {text!r} ({last})", flush=True)


async def main():
    texts = json.loads((DIR / "texts.json").read_text(encoding="utf-8"))
    todo = [(k, t) for k, t in texts.items() if not (DIR / f"{k}.mp3").exists()]
    print(f"{len(texts)} texts, {len(todo)} to record with {VOICE}", flush=True)
    sem = asyncio.Semaphore(WORKERS)
    stats = {"ok": 0, "fail": 0}
    await asyncio.gather(*(record(k, t, sem, stats) for k, t in todo))
    for p in DIR.glob("*.part"):
        p.unlink()
    print(f"done: {stats['ok']} recorded, {stats['fail']} failed", flush=True)
    if todo and stats["ok"] == 0:
        sys.exit(1)


asyncio.run(main())
