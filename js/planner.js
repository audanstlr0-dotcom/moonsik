import { VACCINES, STAGES, dosesFor, doseId } from './schedule.js';
import { addOffset, compare, diffDays } from './dates.js';

// 권장 시작일 며칠 전부터 "곧 접종"으로 보여줄지
export const SOON_DAYS = 14;

export const STATUS = {
  done: { label: '접종 완료', order: 5 },
  overdue: { label: '권장 시기 지남', order: 0 },
  due: { label: '지금 접종 시기', order: 1 },
  soon: { label: '곧 접종', order: 2 },
  upcoming: { label: '예정', order: 3 },
  waiting: { label: '이전 차수 대기', order: 4 },
};

function statusFor({ record, start, end, waiting }, today) {
  if (record) return 'done';
  if (waiting) return 'waiting';
  if (end && compare(today, end) >= 0) return 'overdue';
  if (compare(today, start) >= 0) return 'due';
  if (diffDays(today, start) <= SOON_DAYS) return 'soon';
  return 'upcoming';
}

// 아이 한 명의 전체 접종 계획을 계산한다.
// records: { [doseId]: { date: 'YYYY-MM-DD', memo?: string } }
export function buildPlan(child, records = {}, today) {
  const items = [];
  for (const vaccine of VACCINES) {
    const doses = dosesFor(vaccine, child.options);
    const byNo = new Map();
    for (const dose of doses) {
      const id = doseId(vaccine, dose);
      const record = records[id] ?? null;
      let base = child.birth;
      let waiting = false;
      if (dose.after) {
        const prev = byNo.get(dose.after);
        // 이전 차수를 맞았으면 실제 접종일 기준, 아니면 이전 차수의 예정일 기준으로 추정한다.
        base = prev.record ? prev.record.date : prev.start;
        waiting = !prev.record;
      }
      const start = addOffset(base, dose.start);
      const end = dose.end ? addOffset(base, dose.end) : null;
      const item = {
        id,
        vaccine,
        dose,
        total: doses.length,
        start,
        end,
        // 화면 표시용 마지막 권장일 (end 는 미포함 경계)
        lastDay: end ? addOffset(end, { days: -1 }) : null,
        record,
        estimated: waiting,
      };
      item.status = statusFor({ record, start, end, waiting }, today);
      byNo.set(dose.no, item);
      items.push(item);
    }
  }
  return items.sort((a, b) => compare(a.start, b.start) || a.vaccine.name.localeCompare(b.vaccine.name));
}

export function groupByStage(plan) {
  return STAGES.map((stage) => ({ stage, items: plan.filter((i) => i.dose.stage === stage.id) })).filter(
    (g) => g.items.length,
  );
}

export function groupByVaccine(plan) {
  return VACCINES.map((vaccine) => ({
    vaccine,
    items: plan.filter((i) => i.vaccine === vaccine).sort((a, b) => a.dose.no - b.dose.no),
  }));
}

export function summarize(plan) {
  const count = (s) => plan.filter((i) => i.status === s).length;
  return {
    total: plan.length,
    done: count('done'),
    overdue: count('overdue'),
    due: count('due'),
    soon: count('soon'),
  };
}

// 홈 화면에 보여줄 "지금 필요한 접종"과 "다가오는 접종"
export function agenda(plan, { upcomingLimit = 6 } = {}) {
  const now = plan
    .filter((i) => i.status === 'overdue' || i.status === 'due')
    .sort((a, b) => STATUS[a.status].order - STATUS[b.status].order || compare(a.start, b.start));
  const next = plan.filter((i) => i.status === 'soon' || i.status === 'upcoming').slice(0, upcomingLimit);
  return { now, next };
}

// 알림 대상: 기한이 지났거나, 오늘 시작이거나, withinDays 안에 시작하는 접종
export function reminders(plan, today, withinDays = 3) {
  return plan.filter(
    (i) =>
      i.status === 'overdue' ||
      i.status === 'due' ||
      (i.status === 'soon' && diffDays(today, i.start) <= withinDays),
  );
}
