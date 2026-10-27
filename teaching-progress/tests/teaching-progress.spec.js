const { test, expect } = require('@playwright/test');

const BASE = 'http://127.0.0.1:5174/teaching-progress/index.html';

test.beforeEach(async ({ page }) => {
  // Свежее localStorage для каждого теста: открываем в чистом контексте
  await page.goto(BASE);
  await page.waitForSelector('#students-list');
});

test('отображает демо-учеников и баннер прототипа', async ({ page }) => {
  await expect(page.locator('#students-list .student-card')).toHaveCount(6);
  await expect(page.locator('.demo-banner')).toContainText('Демо-прототип');
  await expect(page.getByRole('heading', { name: /Ученики/ })).toBeVisible();
});

test('добавление нового ученика', async ({ page }) => {
  await page.locator('#btn-add-student').click();
  await page.waitForSelector('#modal');
  await page.locator('input[name="name"]').fill('Тест Ученик');
  await page.locator('select[name="level"]').selectOption('B1');
  await page.locator('input[name="textbook"]').fill('Тестовый учебник');
  await page.locator('input[name="lastTopic"]').fill('Тестовая тема');
  await page.locator('textarea[name="homework"]').fill('Тестовое ДЗ');
  await page.locator('select[name="homeworkStatus"]').selectOption('assigned');
  await page.locator('#modal-save').click();
  await expect(page.locator('.toast')).toContainText('Ученик добавлен');
  await expect(page.locator('#students-list .student-card')).toHaveCount(7);
  await expect(page.locator('#students-list')).toContainText('Тест Ученик');
});

test('редактирование ученика', async ({ page }) => {
  // редактируем первого демо-ученика (Мая)
  await page.locator('#students-list .student-card').first().locator('button[title="Редактировать карточку"]').click();
  await page.waitForSelector('#modal');
  await page.locator('input[name="name"]').fill('Мая Обновлённая');
  await page.locator('#modal-save').click();
  await expect(page.locator('.toast')).toContainText('Карточка обновлена');
  await expect(page.locator('#students-list .student-card')).toHaveCount(6);
  await expect(page.locator('#students-list')).toContainText('Мая Обновлённая');
  await expect(page.locator('#students-list')).not.toContainText('Мая');
});

test('удаление ученика удаляет его и уроки', async ({ page }) => {
  const beforeCount = await page.locator('#students-list .student-card').count();
  await page.locator('#students-list .student-card').first().locator('button.btn-danger').click();
  await page.on('dialog', d => d.accept());
  await expect(page.locator('#students-list .student-card')).toHaveCount(beforeCount - 1);
});

test('поиск учеников фильтрует карточки', async ({ page }) => {
  await page.locator('#search-students').fill('Мая');
  await expect(page.locator('#students-list .student-card')).toHaveCount(1);
  await expect(page.locator('#students-list .student-card')).toContainText('Мая');
  await page.locator('#search-students').fill('');
  await expect(page.locator('#students-list .student-card')).toHaveCount(6);
});

test('добавление занятия для ученика', async ({ page }) => {
  // заходим в историю первого ученика
  await page.locator('#students-list .student-card').first().locator('header').click();
  await expect(page.locator('#view-history')).not.toHaveClass(/hidden/);
  await page.locator('#btn-add-lesson-for').click();
  await page.waitForSelector('#modal');
  await page.locator('input[name="date"]').fill('2026-10-25');
  await page.locator('select[name="status"]').selectOption('done');
  await page.locator('input[name="topic"]').fill('Тестовое занятие');
  await page.locator('input[name="homework"]').fill('Тестовое ДЗ');
  await page.locator('select[name="homeworkStatus"]').selectOption('completed');
  await page.locator('#modal-save').click();
  await expect(page.locator('.toast')).toContainText('Занятие добавлено');
  await expect(page.locator('#lessons-list .lesson-card')).toContainText('Тестовое занятие');
});

test('редактирование занятия', async ({ page }) => {
  await page.locator('#students-list .student-card').first().locator('header').click();
  await page.locator('#lessons-list .lesson-card').first().locator('button.btn-icon.edit').click();
  await page.waitForSelector('#modal');
  await page.locator('input[name="topic"]').fill('Обновлённая тема');
  await page.locator('#modal-save').click();
  await expect(page.locator('.toast')).toContainText('Занятие обновлено');
  await expect(page.locator('#lessons-list .lesson-card')).toContainText('Обновлённая тема');
});

test('удаление занятия', async ({ page }) => {
  await page.locator('#students-list .student-card').first().locator('header').click();
  const before = await page.locator('#lessons-list .lesson-card').count();
  await page.locator('#lessons-list .lesson-card').first().locator('button.btn-icon.del').click();
  await page.on('dialog', d => d.accept());
  await expect(page.locator('#lessons-list .lesson-card')).toHaveCount(before - 1);
});

test('фильтрация истории по статусу занятия', async ({ page }) => {
  await page.locator('#nav-history').click();
  await page.locator('#filter-status').selectOption('done');
  await page.waitForTimeout(100);
  const cards = page.locator('#lessons-list .lesson-card');
  const count = await cards.count();
  for (let i = 0; i < count; i++) {
    await expect(cards.nth(i)).toContainText('Проведено');
  }
});

test('фильтрация истории по статусу ДЗ', async ({ page }) => {
  await page.locator('#nav-history').click();
  await page.locator('#filter-homework').selectOption('completed');
  await page.waitForTimeout(100);
  const cards = page.locator('#lessons-list .lesson-card');
  const count = await cards.count();
  for (let i = 0; i < count; i++) {
    await expect(cards.nth(i)).toContainText('Выполнено');
  }
});

test('сохранение после перезагрузки (localStorage)', async ({ page }) => {
  await page.locator('#btn-add-student').click();
  await page.waitForSelector('#modal');
  await page.locator('input[name="name"]').fill('Персистент Ученик');
  await page.locator('#modal-save').click();
  await expect(page.locator('.toast')).toContainText('Ученик добавлен');
  await page.reload();
  await page.waitForSelector('#students-list .student-card');
  await expect(page.locator('#students-list')).toContainText('Персистент Ученик');
});

test('экспорт JSON создаёт файл', async ({ page }) => {
  const downloadPromise = page.waitForEvent('download');
  await page.locator('#btn-export').click();
  const download = await downloadPromise;
  const name = download.suggestedFilename();
  expect(name).toMatch(/teaching-progress.*\.json$/);
});

test('импорт JSON заменяет данные', async ({ page }) => {
  // Сначала экспортируем текущее, чтобы иметь валидный файл? Нет — загрузим свой тестовый JSON.
  const fileChooserPromise = page.waitForEvent('filechooser');
  // Открываем подтверждение импорта и выбираем "Импортировать без копии"
  await page.locator('#btn-import').click();
  await page.waitForSelector('#import-confirm:not(.hidden)');
  await page.locator('#import-proceed').click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles({
    name: 'test-import.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify({
      version: 2,
      students: [
        { id: 'imp-1', name: 'Импортович', textbook: 'Импорт Учебник', level: 'A2', lastTopic: 'Импорт Тема', vocab: [], grammar: [], homework: 'Импорт ДЗ', homeworkStatus: 'assigned', lessonKey: 'maya', color: '#123456', createdAt: '2026-10-27' }
      ],
      lessons: [
        { id: 'imp-l1', studentId: 'imp-1', date: '2026-10-27', topic: 'Импорт Занятие', homework: 'Импорт ДЗ', status: 'done', homeworkStatus: 'completed', notes: 'нота', createdAt: '2026-10-27' }
      ]
    }), 'utf8')
  });
  await page.waitForTimeout(300);
  await expect(page.locator('.toast')).toContainText('Импорт завершён');
  await expect(page.locator('#students-list .student-card')).toHaveCount(1);
  await expect(page.locator('#students-list')).toContainText('Импортович');
});

test('импорт с некорректной структурой показывает ошибку', async ({ page }) => {
  const fileChooserPromise = page.waitForEvent('filechooser');
  await page.locator('#btn-import').click();
  await page.waitForSelector('#import-confirm:not(.hidden)');
  await page.locator('#import-proceed').click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles({
    name: 'bad.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify({ not: 'students' }), 'utf8')
  });
  await page.waitForTimeout(300);
  await expect(page.locator('.toast')).toContainText('Ошибка импорта');
});
