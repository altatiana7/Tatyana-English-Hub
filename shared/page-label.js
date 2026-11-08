/* Плашка «Teacher» / «Homework» сверху каждой страницы.
   Узкая метка по центру верхнего края: не сдвигает вёрстку и не мешает кликам (pointer-events:none).
   Тип страницы определяется по адресу. Чтобы поменять — правь списки ниже:
   - TEACHER_FILE: если в имени файла есть это слово, страница всегда «Teacher» (проверки, учительские входы);
   - HOMEWORK_DIRS: папки с домашками учеников;
   - всё остальное (папки с уроками, хабы, тренажёры, общие страницы) — «Teacher». */
(function () {
  try { if (window.top !== window) return; } catch (e) { return; }
  if (document.getElementById('page-label')) return;

  var HOMEWORK_DIRS = [
    'ege-2027-b2-katya', 'ege-2027-b2-rita',
    'kate-english-hub',
    'gabriel-homework', 'gabi-homework',
    'nikita-homework', 'nikita-course',
    'maya-english-hub'
  ];
  var TEACHER_FILE = /teacher/i;

  var path;
  try { path = decodeURIComponent(location.pathname); } catch (e) { path = location.pathname; }
  var parts = path.split('/').filter(Boolean);
  var file = parts.length ? parts[parts.length - 1] : '';

  var type = 'Teacher';
  var inHomeworkDir = parts.some(function (p) { return HOMEWORK_DIRS.indexOf(p) !== -1; });
  var teacherNamed = TEACHER_FILE.test(file) || parts.some(function (p) { return /^teacher-/i.test(p); });
  if (inHomeworkDir && !teacherNamed) type = 'Homework';

  var st = document.createElement('style');
  st.textContent =
    '#page-label{position:fixed;top:0;left:50%;transform:translateX(-50%);z-index:2147483000;' +
    'height:22px;padding:0 16px;border-radius:0 0 10px 10px;box-sizing:border-box;' +
    'font:700 12px/22px Arial,Helvetica,sans-serif;letter-spacing:.14em;text-transform:uppercase;' +
    'color:#fff;pointer-events:none;user-select:none;box-shadow:0 1px 4px rgba(0,0,0,.18)}' +
    '#page-label.is-teacher{background:#44508f}' +
    '#page-label.is-homework{background:#2f7d62}' +
    '@media print{#page-label{display:none}}';

  var el = document.createElement('div');
  el.id = 'page-label';
  el.className = type === 'Teacher' ? 'is-teacher' : 'is-homework';
  el.setAttribute('aria-hidden', 'true');
  el.textContent = type;

  // Крепим к <html>, чтобы метку не стирали страницы, которые перерисовывают весь body.
  var root = document.documentElement;
  root.appendChild(st);
  root.appendChild(el);
})();
