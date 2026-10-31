#!/usr/bin/env node
/**
 * Перенос данных из резервной копии планнера в Supabase.
 *
 * На вход — файл, который планнер сохраняет сам:
 *   planner-data.json                  («В файл…»)
 *   planner-backup-ГГГГ-ММ-ДД.json     (ежедневная копия)
 *   tatyana-planner-backup-ГГГГ-ММ-ДД.json  (кнопка Backup, попадает в «Загрузки»)
 * Внутри — {version, schedule, students, notes, payments, paymentPlans, actualPayments},
 * либо тот же объект под ключом state.
 * На выход — SQL-файл с INSERT'ами. Ничего никуда не отправляет сам.
 *
 *   node tools/planner-to-supabase.mjs planner-data.json > import.sql
 *
 * Почему SQL, а не прямой вызов API: так видно, что именно попадёт в базу,
 * файл можно просмотреть, отредактировать и выполнить в Supabase SQL Editor.
 *
 * Идемпотентность: id учеников вычисляются из имени (uuid v5-подобно),
 * поэтому повторный импорт не создаёт дубликаты.
 */

import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const file = process.argv[2];
if (!file) {
  console.error('Использование: node tools/planner-to-supabase.mjs <backup.json>');
  process.exit(1);
}

const raw = JSON.parse(readFileSync(file, 'utf8'));
const state = raw.state || raw;            // поддерживаем обе формы экспорта

/** Детерминированный uuid из строки — чтобы повторный импорт не дублировал. */
function stableUuid(name) {
  const h = createHash('md5').update(String(name)).digest('hex');
  return [
    h.slice(0, 8),
    h.slice(8, 12),
    '5' + h.slice(13, 16),
    ((parseInt(h.slice(16, 17), 16) & 0x3) | 0x8).toString(16) + h.slice(17, 20),
    h.slice(20, 32),
  ].join('-');
}

const q = (v) => (v === null || v === undefined || v === ''
  ? 'null'
  : `'${String(v).replace(/'/g, "''")}'`);

const num = (v) => {
  const n = Number(String(v ?? 0).replace(',', '.').replace(/[^\d.-]/g, ''));
  return Number.isFinite(n) ? n : 0;
};

const students = state.students || [];
const payments = state.payments || [];
const paymentPlans = state.paymentPlans || {};
const actualPayments = state.actualPayments || {};

const lines = [];
lines.push('-- Сгенерировано tools/planner-to-supabase.mjs');
lines.push(`-- Источник: ${file}`);
lines.push(`-- Дата подготовки: ${new Date().toISOString()}`);
lines.push('begin;');
lines.push('');

// --- ученики -----------------------------------------------------------------
lines.push('-- Ученики');
const byLegacyId = new Map();
for (const s of students) {
  const id = stableUuid('student:' + (s.name || s.id));
  byLegacyId.set(String(s.id), id);
  lines.push(
    `insert into public.students (id, name, level, color, lesson_time) values\n` +
    `  (${q(id)}, ${q(s.name)}, ${q(s.level)}, ${q(s.color)}, ${q(s.time || null)})\n` +
    `on conflict (id) do update set\n` +
    `  name = excluded.name, level = excluded.level,\n` +
    `  color = excluded.color, lesson_time = excluded.lesson_time;`
  );
}
lines.push('');

// --- планы по месяцам --------------------------------------------------------
// В планнере одна и та же сумма может лежать в двух местах: в планах/фактах
// по месяцам и в старом списке payments[]. migrateLegacyPayments() уже
// разложил старый список по месяцам, поэтому берём ОДИН источник, иначе
// долг задвоится (проверено на тестовых данных).
const hasPlanMap = Object.keys(paymentPlans).length > 0;
const hasActualMap = Object.keys(actualPayments).length > 0;

lines.push('-- Планы оплат (ключи вида "2026-10|3")');
if (hasPlanMap) {
  for (const [key, amount] of Object.entries(paymentPlans)) {
    const [month, legacyId] = key.split('|');
    const studentId = byLegacyId.get(String(legacyId));
    if (!studentId || !/^\d{4}-\d{2}$/.test(month)) continue;
    const period = `${month}-01`;
    lines.push(
      `insert into public.payment_plans (student_id, period, planned) values\n` +
      `  (${q(studentId)}, ${q(period)}, ${num(amount)})\n` +
      `on conflict (student_id, period) do update set planned = excluded.planned;`
    );
  }
} else {
  // запасной путь: планы только в старом списке — записи без даты
  for (const p of payments) {
    if (p.date) continue;
    const studentId = byLegacyId.get(String(p.studentId));
    const month = p.month && /^\d{4}-\d{2}$/.test(String(p.month)) ? `${p.month}-01` : null;
    if (!studentId || !month) continue;
    lines.push(
      `insert into public.payment_plans (student_id, period, planned) values\n` +
      `  (${q(studentId)}, ${q(month)}, ${num(p.amount)})\n` +
      `on conflict (student_id, period) do update set planned = excluded.planned;`
    );
  }
}
lines.push('');

// --- фактические оплаты ------------------------------------------------------
lines.push('-- Фактические оплаты');
if (hasActualMap) {
  for (const [key, amount] of Object.entries(actualPayments)) {
    const [month, legacyId] = key.split('|');
    const studentId = byLegacyId.get(String(legacyId));
    if (!studentId || !/^\d{4}-\d{2}$/.test(month)) continue;
    const period = `${month}-01`;
    const amountValue = num(amount);
    if (amountValue <= 0) continue;
    lines.push(
      `insert into public.payments (id, student_id, period, amount, paid_on, note) values\n` +
      `  (${q(stableUuid('payment-month:' + key))}, ${q(studentId)}, ${q(period)}, ${amountValue}, ${q(period)}, 'перенос из планнера (сводно за месяц)')\n` +
      `on conflict (id) do update set amount = excluded.amount;`
    );
  }
} else {
  // запасной путь: отдельные платежи из старого списка — у них есть дата
  for (const p of payments) {
    if (!p.date) continue;
    const studentId = byLegacyId.get(String(p.studentId));
    const month = p.month && /^\d{4}-\d{2}$/.test(String(p.month)) ? `${p.month}-01` : null;
    const amount = num(p.amount);
    if (!studentId || !month || amount <= 0) continue;
    const key = `${p.studentId}|${p.month}|${p.date}|${amount}`;
    lines.push(
      `insert into public.payments (id, student_id, period, amount, paid_on, note) values\n` +
      `  (${q(stableUuid('payment:' + key))}, ${q(studentId)}, ${q(month)}, ${amount}, ${q(p.date)}, 'перенос из планнера')\n` +
      `on conflict (id) do update set amount = excluded.amount;`
    );
  }
}
lines.push('');

lines.push('commit;');
lines.push('');

// Если старый список расходится с суммами по месяцам — не молчим.
if (hasActualMap && payments.some((p) => p.date)) {
  process.stderr.write(
    'Внимание: в файле есть и суммы по месяцам, и старый список платежей. ' +
    'Взяты суммы по месяцам, список не импортируется — иначе долг задвоится. Проверьте итоги.\n'
  );
}

const sql = lines.join('\n');
process.stdout.write(sql);
process.stderr.write(
  `Готово: учеников ${students.length}, планов ${Object.keys(paymentPlans).length}, ` +
  `месячных сумм ${Object.keys(actualPayments).length}, платежей ${payments.length}\n`
);
