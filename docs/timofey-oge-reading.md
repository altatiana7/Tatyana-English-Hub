# Тимофей · ОГЭ Reading от 6 ноября

Домашка от 6 ноября: два интерактивных задания ОГЭ по чтению —
«The Smart Glasses Scandal» и «The Competition Where Nobody Does Anything».
В каждом тексте 8 вопросов True / False / Not stated, всего 16 баллов.
Проверка ответов, подсветка ошибок и результат из 16 баллов.

## Где живёт сайт Тимофея

| Что | Адрес |
|---|---|
| Репозиторий сайта | `https://github.com/altatiana7/altatiana7.github.io` |
| Папка с домашкой | `timofey-homework/` → `https://github.com/altatiana7/altatiana7.github.io/tree/main/timofey-homework` |
| Страница домашки | `https://altatiana7.github.io/timofey-homework/` |
| Хаб учителя Тимофея | `timofey-teacher/` → `https://altatiana7.github.io/timofey-teacher/` |
| Сайт ученика | `timofey/` → `https://altatiana7.github.io/timofey/` |

Отдельного репозитория `Timofey Homework` нет: это папка `timofey-homework`
внутри репозитория `altatiana7.github.io` (из него же публикуются `timofey/`
и `timofey-teacher/`).

## Что сделано

### 1. Отдельная страница (уже в этом репозитории, работает)

`timofey-oge-reading/index.html` →
`https://altatiana7.github.io/Tatyana-English-Hub/timofey-oge-reading/`

* два текста, по 8 вопросов True / False / Not stated;
* кнопка «Проверить ответы»: верные варианты подсвечиваются зелёным,
  ошибки — красным, рядом написан верный ответ;
* результат: «Верно X из 16 · X / 16 баллов»;
* ответы сохраняются в браузере, есть кнопка «I'm done · send to teacher»
  (работа появляется в «Домашке» на `my-hub.html`).

Ссылка добавлена в `my-hub.html` (группа «Тимофей») и в `homework-hub/`.

### 2. Готовая правка для самой страницы домашки

`docs/patches/timofey-homework-oge-reading-2026-11-06.patch` добавляет раздел
«ОГЭ Reading» прямо в существующую `timofey-homework` — рядом с Vocabulary,
Grammar и т. д., не меняя остальные разделы:

* 16 вопросов входят в общий прогресс и в файл ответов;
* ответы уходят Татьяне вместе с остальной домашкой;
* на странице учителя (`timofey-homework/teacher.html`) раздел проверяется
  по ключу автоматически, как остальные задания.

Применить (когда у подключения будет доступ на запись к `altatiana7.github.io`):

```bash
git clone https://github.com/altatiana7/altatiana7.github.io.git
cd altatiana7.github.io
git apply ../docs/patches/timofey-homework-oge-reading-2026-11-06.patch
git commit -am "Timofey homework: ОГЭ Reading от 6 ноября"
git push origin main
```

## Почему правка не применена сразу

Подключённый в Arena GitHub видит репозиторий `altatiana7.github.io` только
на чтение: `git push` и API отвечают `403 Permission to altatiana7/altatiana7.github.io.git denied`.
Нужно переподключить GitHub в Arena и выдать доступ на запись к этому
репозиторию (или к аккаунту `altatiana7` целиком) — после этого правку
применяю одной командой.
