import assert from 'node:assert/strict';
import { test } from 'node:test';
import { isProjectDate, projectDateSortKey, projectDateYear } from '../src/lib/project-dates.ts';

test('project dates preserve known precision and reject invalid calendar dates', () => {
  for (const value of ['2026', '2026-11', '2026-11-15', '2024-02-29']) {
    assert.equal(isProjectDate(value), true, value);
  }
  for (const value of ['2026-13', '2026-00', '2026-11-31', '2026-02-29', '2026-11-00', '2026-1']) {
    assert.equal(isProjectDate(value), false, value);
  }
});

test('newest-first sorting uses months and days, including year boundaries', () => {
  const dates = ['2026', '2026-11-14', '2026-10', '2027', '2026-11-15', '2026-11'];
  assert.deepEqual(
    dates.toSorted((a, b) => projectDateSortKey(b) - projectDateSortKey(a)),
    ['2027', '2026-11-15', '2026-11-14', '2026-11', '2026-10', '2026'],
  );
});

test('year display and grouping are independent of sorting precision', () => {
  for (const value of ['2026', '2026-11', '2026-11-15']) {
    assert.equal(projectDateYear(value), 2026);
  }
});
