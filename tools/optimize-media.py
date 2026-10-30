#!/usr/bin/env python3
"""Сжатие медиа хаба: видео и аудио.

Скрипт НЕ удаляет оригиналы безвозвратно: перекодирует во временный файл,
сравнивает размер и подменяет исходник только если стало заметно меньше.
Все решения пишутся в отчёт (JSON) -- по нему можно откатить или перепроверить.

Требуется PyAV (ffmpeg внутри wheel):

    python3 -m venv .venv-media
    .venv-media/bin/pip install av
    .venv-media/bin/python tools/optimize-media.py --videos --dry-run

Типовые запуски:

    tools/optimize-media.py --videos              # видео: H.264 CRF 27, до 720p
    tools/optimize-media.py --audio               # mp3: mono 48 кбит/с
    tools/optimize-media.py --videos --audio      # всё
"""

from __future__ import annotations

import argparse
import json
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

VIDEO_TARGET_HEIGHT = 720
VIDEO_CRF = 27
VIDEO_PRESET = "medium"
VIDEO_MAX_AUDIO_BITRATE = 96_000

AUDIO_BITRATE = 48_000
AUDIO_MIN_SOURCE_BITRATE = 56_000  # ниже этого уже нет смысла перекодировать
AUDIO_SKIP_PREFIXES = ("card-audio/",)  # уже 48 кбит/с mono, трогать нечего

MIN_GAIN = 0.90  # подменяем только если новый файл меньше на 10% и больше


def repo_root() -> Path:
    return Path(__file__).resolve().parent.parent


def tracked_files(root: Path, pattern: str) -> list[Path]:
    out = subprocess.run(
        ["git", "ls-files", "-z", pattern],
        cwd=root, capture_output=True, text=True, check=True,
    ).stdout.split("\0")
    return [root / p for p in out if p]


def human(num: float) -> str:
    for unit in ("Б", "КБ", "МБ", "ГБ"):
        if abs(num) < 1024:
            return f"{num:.1f} {unit}"
        num /= 1024
    return f"{num:.1f} ТБ"


# --------------------------------------------------------------------------- видео
def compress_video(path: Path, *, dry_run: bool, av_module, crf: int = VIDEO_CRF) -> dict | None:
    av = av_module
    before = path.stat().st_size
    with av.open(str(path)) as inp:
        if not inp.streams.video:
            return None
        vsrc = inp.streams.video[0]
        asrc = inp.streams.audio[0] if inp.streams.audio else None

        w, h = vsrc.codec_context.width, vsrc.codec_context.height
        if h > VIDEO_TARGET_HEIGHT:
            h = VIDEO_TARGET_HEIGHT
            w = int(round(w * VIDEO_TARGET_HEIGHT / vsrc.codec_context.height))
        w -= w % 2
        h -= h % 2
        if w == 0 or h == 0:
            return None

        tmp = Path(tempfile.mkstemp(suffix=".mp4", dir=path.parent)[1])
        try:
            with av.open(str(tmp), "w", options={"movflags": "+faststart"}) as out:
                vout = out.add_stream("libx264", rate=vsrc.average_rate)
                vout.width, vout.height = w, h
                vout.pix_fmt = "yuv420p"
                vout.options = {"crf": str(crf), "preset": VIDEO_PRESET}

                aout = None
                if asrc is not None:
                    aout = out.add_stream("aac", rate=44100)
                    aout.bit_rate = min(
                        asrc.codec_context.bit_rate or VIDEO_MAX_AUDIO_BITRATE,
                        VIDEO_MAX_AUDIO_BITRATE,
                    )
                    aout.layout = "stereo"

                for frame in inp.decode(vsrc, asrc):
                    if isinstance(frame, av.VideoFrame):
                        for packet in vout.encode(frame.reformat(width=w, height=h, format="yuv420p")):
                            out.mux(packet)
                    elif aout is not None and isinstance(frame, av.AudioFrame):
                        frame.pts = None
                        for packet in aout.encode(frame):
                            out.mux(packet)

                for packet in vout.encode():
                    out.mux(packet)
                if aout is not None:
                    for packet in aout.encode():
                        out.mux(packet)

            after = tmp.stat().st_size
            result = {
                "file": str(path.relative_to(repo_root())),
                "before": before, "after": after,
                "saved": before - after,
                "geometry": f"{w}x{h}",
                "crf": crf,
            }
            if dry_run:
                tmp.unlink(missing_ok=True)
                return result
            if after < before * MIN_GAIN:
                shutil.move(str(tmp), str(path))
                result["applied"] = True
            else:
                tmp.unlink(missing_ok=True)
                result["applied"] = False
            return result
        except Exception:
            tmp.unlink(missing_ok=True)
            raise


# --------------------------------------------------------------------------- аудио
def compress_audio(path: Path, *, dry_run: bool, av_module) -> dict | None:
    av = av_module
    before = path.stat().st_size
    with av.open(str(path)) as inp:
        src = inp.streams.audio[0]
        bitrate = src.codec_context.bit_rate or 0
        if bitrate and bitrate < AUDIO_MIN_SOURCE_BITRATE:
            return None
        rate = src.sample_rate
        tmp = Path(tempfile.mkstemp(suffix=".mp3", dir=path.parent)[1])
        try:
            from av.audio.resampler import AudioResampler  # noqa: PLC0415

            with av.open(str(tmp), "w") as out:
                enc = out.add_stream("libmp3lame", rate=rate)
                enc.bit_rate = AUDIO_BITRATE
                enc.layout = "mono"
                resampler = AudioResampler(format="s16p", layout="mono", rate=rate)

                def flush_frames(frames):
                    for rf in frames:
                        rf.pts = None
                        for packet in enc.encode(rf):
                            out.mux(packet)

                for frame in inp.decode(src):
                    flush_frames(resampler.resample(frame))
                flush_frames(resampler.resample(None))
                for packet in enc.encode():
                    out.mux(packet)

            after = tmp.stat().st_size
            result = {
                "file": str(path.relative_to(repo_root())),
                "before": before, "after": after, "saved": before - after,
                "bitrate_before": bitrate,
            }
            if dry_run:
                tmp.unlink(missing_ok=True)
                return result
            if after < before * MIN_GAIN:
                shutil.move(str(tmp), str(path))
                result["applied"] = True
            else:
                tmp.unlink(missing_ok=True)
                result["applied"] = False
            return result
        except Exception:
            tmp.unlink(missing_ok=True)
            raise


# --------------------------------------------------------------------------- main
def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__,
                                     formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--videos", action="store_true", help="перекодировать mp4")
    parser.add_argument("--audio", action="store_true", help="перекодировать mp3")
    parser.add_argument("--dry-run", action="store_true", help="только посчитать, не менять файлы")
    parser.add_argument("--report", default="tools/media-optimize-report.json")
    parser.add_argument("--limit", type=int, default=0, help="обработать первые N файлов")
    args = parser.parse_args()

    if not (args.videos or args.audio):
        parser.error("укажите --videos и/или --audio")

    try:
        import av  # noqa: PLC0415
    except ImportError:
        print("нужен PyAV: pip install av  (или .venv-media/bin/pip install av)", file=sys.stderr)
        return 2

    root = repo_root()
    results: list[dict] = []

    if args.videos:
        files = tracked_files(root, "*.mp4")
        if args.limit:
            files = files[: args.limit]
        print(f"Видео: {len(files)} файлов")
        for path in files:
            try:
                res = compress_video(path, dry_run=args.dry_run, av_module=av)
            except Exception as exc:  # noqa: BLE001
                print(f"  !! {path}: {exc}", file=sys.stderr)
                continue
            if res:
                # Первый проход может не дать выигрыша на уже сжатых файлах --
                # пробуем более сильное сжатие, но не бесконечно.
                if not res.get("applied") and res["before"] > 2_000_000 and not args.dry_run:
                    retry = compress_video(path, dry_run=False, av_module=av, crf=VIDEO_CRF + 5)
                    if retry and retry.get("applied"):
                        retry["first_pass"] = res["after"]
                        res = retry
                results.append(res)
                print(f"  {res['file']}: {human(res['before'])} -> {human(res['after'])} "
                      f"({'замена' if res.get('applied') else 'оставлено'})")

    if args.audio:
        files = [p for p in tracked_files(root, "*.mp3")
                 if not str(p.relative_to(root)).startswith(AUDIO_SKIP_PREFIXES)]
        if args.limit:
            files = files[: args.limit]
        print(f"Аудио: {len(files)} файлов")
        for path in files:
            try:
                res = compress_audio(path, dry_run=args.dry_run, av_module=av)
            except Exception as exc:  # noqa: BLE001
                print(f"  !! {path}: {exc}", file=sys.stderr)
                continue
            if res:
                results.append(res)
                print(f"  {res['file']}: {human(res['before'])} -> {human(res['after'])} "
                      f"({'замена' if res.get('applied') else 'оставлено'})")

    total_before = sum(r["before"] for r in results)
    total_after = sum(r["after"] if r.get("applied") else r["before"] for r in results)
    print(f"\nБыло: {human(total_before)}  Стало: {human(total_after)}  "
          f"Экономия: {human(total_before - total_after)}")

    if not args.dry_run:
        report = root / args.report
        report.parent.mkdir(parents=True, exist_ok=True)
        report.write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"Отчёт: {report}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
