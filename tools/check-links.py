#!/usr/bin/env python3
"""Проверка локальных ссылок в HTML-страницах хаба.

Ищет в src= / href= / url(...) относительные пути и проверяет, что файл
существует на диске. Ссылки внутри JS-шаблонов (``${...}``), внешние URL,
``about:blank``, ``data:`` и якоря пропускаются -- это не настоящие пути.

Использование:
    python3 tools/check-links.py            # отчёт в stdout
    python3 tools/check-links.py --strict   # exit code 1 при находках (для CI)
"""

from __future__ import annotations

import argparse
import os
import re
import sys
from collections import defaultdict

SKIP_SCHEMES = (
    "http://", "https://", "//", "#", "mailto:", "tel:", "data:",
    "javascript:", "about:", "file:", "blob:", "ftp:",
)

# href="..." / src="..." / src='...'   -- атрибуты всегда в кавычках
ATTR_RE = re.compile(
    r"""(?:src|href|poster|data-src)\s*=\s*(?:"([^"]*)"|'([^']*)')""",
    re.I,
)
# url(...) в CSS. Намеренно без re.I: иначе в сетку попадает JS `new URL(r)`.
CSS_URL_RE = re.compile(r"""(?<![A-Za-z-])url\(\s*['"]?([^'")]+)['"]?\s*\)""")


def collect_html(root: str) -> list[str]:
    out = []
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [
            d for d in dirnames
            if d not in {".git", "node_modules", ".github"}
        ]
        for name in filenames:
            if name.endswith(".html"):
                out.append(os.path.join(dirpath, name))
    return sorted(out)


# Путь, по которому сайт реально опубликован на GitHub Pages:
# https://<user>.github.io/Tatyana-English-Hub/ -- абсолютные ссылки внутри
# страниц начинаются с этого префикса.
SITE_BASE = "/Tatyana-English-Hub/"

# Слова, после которых src=/href= -- это переменная JS, а не атрибут тега.
JS_ASSIGN_WORDS = ("let ", "const ", "var ", "return ", ".", "[")


def is_dynamic(ref: str, after: str = "") -> bool:
    """Ссылка собрана в JS, проверить её статически нельзя."""
    if any(tok in ref for tok in ("${", "{{", "}}", "' +", '" +', "'+", '+"', "+'")):
        return True
    # 'prefix-' + i + '.js' -- склейка сразу за кавычкой
    return after.lstrip()[:1] in {"+", "\\"}


def normalise(ref: str) -> str:
    return ref.split("?")[0].split("#")[0].strip()


def check(root: str) -> tuple[int, dict[str, list[tuple[str, str]]]]:
    pages = collect_html(root)
    missing: dict[str, list[tuple[str, str]]] = defaultdict(list)
    checked = 0

    for page in pages:
        rel_page = os.path.relpath(page, root)
        base = os.path.dirname(page)
        try:
            text = open(page, encoding="utf-8", errors="ignore").read()
        except OSError as exc:  # noqa: BLE001
            print(f"!! не удалось прочитать {rel_page}: {exc}", file=sys.stderr)
            continue

        refs: list[tuple[str, str]] = []
        for m in ATTR_RE.finditer(text):
            ref = next((g for g in m.groups() if g), "")
            before = text[max(0, m.start() - 8):m.start()]
            if before.rstrip().endswith((".", "=")) or any(
                before.endswith(w) for w in JS_ASSIGN_WORDS
            ):
                continue  # x.src="C" / let src="kate" -- код, не разметка
            refs.append((ref, text[m.end():m.end() + 4]))

        # Из url() берём только то, что похоже на путь к файлу.
        refs += [
            (m.group(1), text[m.end():m.end() + 4])
            for m in CSS_URL_RE.finditer(text)
            if ("/" in m.group(1) or "." in m.group(1))
        ]

        for ref, after in refs:
            if not ref or not ref.strip():
                continue
            low = ref.strip().lower()
            if low.startswith(SKIP_SCHEMES):
                continue
            if is_dynamic(ref, after):
                continue
            # Локальный путь почти всегда содержит '/' или расширение.
            # Голое слово ('kate', 'C') -- это переменная в JS, а не файл.
            if "/" not in ref and "." not in ref:
                continue

            target = normalise(ref)
            if not target:
                continue
            # абсолютные пути от корня сайта
            if target.startswith(SITE_BASE):
                target = target[len(SITE_BASE) - 1:]
            if target.startswith("/"):
                path = os.path.normpath(os.path.join(root, target.lstrip("/")))
            else:
                path = os.path.normpath(os.path.join(base, target))
            checked += 1
            if not os.path.exists(path):
                missing[rel_page].append((ref, target))

    return checked, missing


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--root",
        default=os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
        help="корень сайта (по умолчанию -- корень репозитория)",
    )
    parser.add_argument("--strict", action="store_true", help="exit 1 при находках")
    args = parser.parse_args()

    checked, missing = check(args.root)
    total_missing = sum(len(v) for v in missing.values())

    print(f"Проверено локальных ссылок: {checked}")
    print(f"Страниц с битыми ссылками: {len(missing)}")
    print(f"Всего битых ссылок: {total_missing}")

    for page in sorted(missing):
        print(f"\n{page}")
        for ref, target in sorted(set(missing[page])):
            print(f"  {ref!r}  (искали {target})")

    if args.strict and total_missing:
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
