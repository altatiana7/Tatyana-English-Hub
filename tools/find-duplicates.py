#!/usr/bin/env python3
"""Поиск файлов-дублей по содержимому.

Git хранит одинаковые блобы один раз, но **рабочая копия** и опубликованный
сайт содержат каждую копию отдельно. Поэтому файл, разложенный по пяти папкам
учеников, пять раз скачивается и пять раз попадает в артефакт деплоя.

    python3 tools/find-duplicates.py             # отчёт по всему репозиторию
    python3 tools/find-duplicates.py --media     # только медиа
    python3 tools/find-duplicates.py --min-size 1000000   # только крупные

Скрипт ничего не удаляет: он лишь показывает, где лежит лишнее.
"""

from __future__ import annotations

import argparse
import hashlib
import os
import subprocess
import sys
from collections import defaultdict
from pathlib import Path

MEDIA_EXT = {
    ".mp3", ".mp4", ".m4a", ".wav", ".ogg", ".oga", ".webm",
    ".jpg", ".jpeg", ".png", ".webp", ".gif", ".pdf",
}


def repo_root() -> Path:
    return Path(__file__).resolve().parent.parent


def tracked(root: Path, media_only: bool) -> list[Path]:
    args = ["git", "ls-files", "-z"]
    if media_only:
        args += ["*.mp3", "*.mp4", "*.m4a", "*.wav", "*.ogg", "*.webm",
                 "*.jpg", "*.jpeg", "*.png", "*.webp", "*.gif", "*.pdf"]
    names = subprocess.run(args, cwd=root, capture_output=True, text=True,
                           check=True).stdout.split("\0")
    return [root / n for n in names if n]


def digest(path: Path) -> str | None:
    h = hashlib.md5()
    try:
        with open(path, "rb") as fh:
            for chunk in iter(lambda: fh.read(1 << 20), b""):
                h.update(chunk)
    except OSError:
        return None
    return h.hexdigest()


def human(num: float) -> str:
    for unit in ("Б", "КБ", "МБ", "ГБ"):
        if abs(num) < 1024:
            return f"{num:.1f} {unit}"
        num /= 1024
    return f"{num:.1f} ТБ"


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__,
                                     formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--media", action="store_true", help="только медиафайлы")
    parser.add_argument("--min-size", type=int, default=1,
                        help="не показывать группы мельче N байт")
    args = parser.parse_args()

    root = repo_root()
    groups: dict[str, list[Path]] = defaultdict(list)
    for path in tracked(root, args.media):
        if path.suffix.lower() not in MEDIA_EXT and args.media:
            continue
        try:
            if path.stat().st_size < args.min_size:
                continue
        except OSError:
            continue
        md5 = digest(path)
        if md5:
            groups[md5].append(path)

    dups = {k: v for k, v in groups.items() if len(v) > 1}
    if not dups:
        print("Дублей не найдено.")
        return 0

    waste = 0
    rows = []
    for _md5, paths in dups.items():
        size = paths[0].stat().st_size
        waste += size * (len(paths) - 1)
        rows.append((size, paths))
    rows.sort(reverse=True)

    print(f"Групп дублей: {len(rows)}   лишнего объёма: {human(waste)}\n")
    for size, paths in rows:
        print(f"{human(size):>10} × {len(paths)}")
        for p in paths:
            print(f"    {p.relative_to(root)}")
        print()

    print(f"Итого лишнего объёма: {human(waste)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
