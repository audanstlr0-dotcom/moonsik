import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildPlan, agenda, reminders, summarize, groupByStage } from '../js/planner.js';
import { buildICS, foldLine } from '../js/ics.js';
import { normalize } from '../js/store.js';

const child = (options) => ({ id: 'c1', name: '문식', birth: '2026-07-25', options });
const find = (plan, id) => plan.find((i) => i.id === id);

test('출생일 기준 권장일 계산', () => {
  const plan = buildPlan(child(), {}, '2026-09-25');
  assert.equal(find(plan, 'bcg-1').start, '2026-07-25');
  assert.equal(find(plan, 'bcg-1').lastDay, '2026-08-22'); // 생후 4주 이내
  assert.equal(find(plan, 'hepb-2').start, '2026-08-25');
  assert.equal(find(plan, 'dtap-1').start, '2026-09-25');
  assert.equal(find(plan, 'dtap-1').lastDay, '2026-10-24');
  assert.equal(find(plan, 'mmr-1').start, '2027-07-25');
  assert.equal(find(plan, 'mmr-1').lastDay, '2027-11-24'); // 12 ~ 15개월
});

test('접종 상태 판정', () => {
  const plan = buildPlan(child(), { 'hepb-1': { date: '2026-07-25' } }, '2026-09-25');
  assert.equal(find(plan, 'hepb-1').status, 'done');
  assert.equal(find(plan, 'bcg-1').status, 'overdue');
  assert.equal(find(plan, 'hepb-2').status, 'overdue');
  assert.equal(find(plan, 'dtap-1').status, 'due');
  assert.equal(find(plan, 'dtap-2').status, 'upcoming');

  const soon = buildPlan(child(), {}, '2026-09-15');
  assert.equal(find(soon, 'dtap-1').status, 'soon');
});

test('이전 차수 기준 일정은 실제 접종일로 다시 계산된다', () => {
  const before = buildPlan(child(), {}, '2027-08-01');
  const je2 = find(before, 'je-2');
  assert.equal(je2.status, 'waiting');
  assert.equal(je2.estimated, true);
  assert.equal(je2.start, '2027-08-01'); // 예정 1차(2027-07-25) + 7일

  const after = buildPlan(child(), { 'je-1': { date: '2027-09-10' } }, '2027-09-20');
  assert.equal(find(after, 'je-2').start, '2027-09-17');
  assert.equal(find(after, 'je-2').status, 'due');
  assert.equal(find(after, 'je-2').estimated, false);
});

test('백신 종류 옵션에 따라 차수가 달라진다', () => {
  const rv1 = buildPlan(child({ rv: 'rv1', je: 'live' }), {}, '2026-09-25');
  const rv5 = buildPlan(child({ rv: 'rv5', je: 'inactivated' }), {}, '2026-09-25');
  assert.equal(rv1.filter((i) => i.vaccine.id === 'rv').length, 2);
  assert.equal(rv5.filter((i) => i.vaccine.id === 'rv').length, 3);
  assert.equal(rv1.filter((i) => i.vaccine.id === 'je').length, 2);
  assert.equal(rv5.filter((i) => i.vaccine.id === 'je').length, 5);
  assert.equal(find(rv1, 'je-2').dose.when, '1차 접종 12개월 후');
});

test('인플루엔자는 기한이 없어 권장 시기 지남으로 표시되지 않는다', () => {
  const plan = buildPlan(child(), {}, '2030-01-01');
  assert.equal(find(plan, 'iiv-1').status, 'due');
  assert.equal(find(plan, 'iiv-1').end, null);
});

test('홈 화면 요약과 알림 대상', () => {
  const plan = buildPlan(child(), { 'hepb-1': { date: '2026-07-25' } }, '2026-09-25');
  const sum = summarize(plan);
  assert.equal(sum.done, 1);
  assert.equal(sum.total, plan.length);
  const { now, next } = agenda(plan);
  assert.equal(now[0].status, 'overdue');
  assert.ok(now.some((i) => i.id === 'dtap-1'));
  assert.ok(next.every((i) => i.status === 'upcoming' || i.status === 'soon'));
  assert.ok(reminders(plan, '2026-09-25').some((i) => i.id === 'pcv-1'));
  assert.ok(groupByStage(plan).every((g) => g.items.length > 0));
});

test('캘린더 파일은 남은 접종만 담고 줄을 75바이트 이하로 접는다', () => {
  const plan = buildPlan(child(), { 'hepb-1': { date: '2026-07-25' } }, '2026-09-25');
  const ics = buildICS(child(), plan, { now: new Date('2026-09-25T00:00:00Z') });
  assert.ok(ics.startsWith('BEGIN:VCALENDAR\r\n'));
  assert.ok(!ics.includes('UID:c1-hepb-1@'));
  assert.ok(ics.includes('DTSTART;VALUE=DATE:20260925'));
  const enc = new TextEncoder();
  for (const line of ics.split('\r\n')) assert.ok(enc.encode(line).length <= 75, line);
  assert.equal(foldLine('가'.repeat(30)).split('\r\n ').join(''), '가'.repeat(30));
});

test('저장 데이터 정리: 잘못된 값은 버린다', () => {
  const state = normalize({
    children: [{ id: 'a', name: '', birth: '2026-01-01' }, { id: 'b', birth: 'nope' }],
    records: { a: { 'bcg-1': { date: '2026-01-10' }, 'hepb-1': { date: 'x' } } },
    activeChildId: 'zzz',
  });
  assert.equal(state.children.length, 1);
  assert.equal(state.children[0].name, '아기');
  assert.deepEqual(state.children[0].options, { rv: 'rv1', je: 'inactivated' });
  assert.deepEqual(Object.keys(state.records.a), ['bcg-1']);
  assert.equal(state.activeChildId, 'a');
  assert.deepEqual(normalize(null).children, []);
});
