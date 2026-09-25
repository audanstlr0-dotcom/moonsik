import { test } from 'node:test';
import assert from 'node:assert/strict';
import { addOffset, age, diffDays, formatAge, isValidDate, relativeDays } from '../js/dates.js';

test('월 덧셈은 말일을 넘지 않는다', () => {
  assert.equal(addOffset('2026-01-31', { months: 1 }), '2026-02-28');
  assert.equal(addOffset('2024-01-31', { months: 1 }), '2024-02-29');
  assert.equal(addOffset('2026-03-15', { months: 12 }), '2027-03-15');
  assert.equal(addOffset('2026-11-10', { months: 2 }), '2027-01-10');
});

test('주·일 덧셈과 뺄셈', () => {
  assert.equal(addOffset('2026-02-25', { weeks: 1 }), '2026-03-04');
  assert.equal(addOffset('2026-03-01', { days: -1 }), '2026-02-28');
  assert.equal(addOffset('2026-01-01', { months: 1, days: 7 }), '2026-02-08');
});

test('생후 개월 수 계산', () => {
  assert.deepEqual(age('2026-01-15', '2026-03-20'), { months: 2, days: 5, totalDays: 64 });
  assert.deepEqual(age('2026-01-31', '2026-02-28'), { months: 1, days: 0, totalDays: 28 });
  assert.deepEqual(age('2026-01-15', '2026-02-14'), { months: 0, days: 30, totalDays: 30 });
});

test('나이 표시', () => {
  assert.equal(formatAge('2026-09-01', '2026-09-25'), '생후 24일');
  assert.equal(formatAge('2026-07-25', '2026-09-25'), '생후 2개월');
  assert.equal(formatAge('2026-07-20', '2026-09-25'), '생후 2개월 5일');
  assert.equal(formatAge('2023-06-25', '2026-09-25'), '만 3세 3개월');
});

test('날짜 검증과 상대 표시', () => {
  assert.ok(isValidDate('2024-02-29'));
  assert.ok(!isValidDate('2026-02-29'));
  assert.ok(!isValidDate('2026-13-01'));
  assert.ok(!isValidDate(undefined));
  assert.equal(diffDays('2026-09-25', '2026-10-05'), 10);
  assert.equal(relativeDays('2026-09-25', '2026-09-26'), '내일');
  assert.equal(relativeDays('2026-09-25', '2026-09-20'), '5일 지남');
});
