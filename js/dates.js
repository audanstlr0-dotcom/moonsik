// 날짜는 시간대 문제를 피하기 위해 항상 'YYYY-MM-DD' 문자열로 다루고, 계산은 UTC 기준으로 한다.

const DAY_MS = 24 * 60 * 60 * 1000;

function toParts(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return { y, m, d };
}

function toMs(iso) {
  const { y, m, d } = toParts(iso);
  return Date.UTC(y, m - 1, d);
}

function fromMs(ms) {
  return new Date(ms).toISOString().slice(0, 10);
}

function daysInMonth(y, m) {
  return new Date(Date.UTC(y, m, 0)).getUTCDate();
}

export function isValidDate(iso) {
  if (typeof iso !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  const { y, m, d } = toParts(iso);
  return m >= 1 && m <= 12 && d >= 1 && d <= daysInMonth(y, m);
}

export function todayISO(now = new Date()) {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// 월 단위 덧셈은 말일을 넘지 않도록 맞춘다 (예: 1월 31일 + 1개월 = 2월 28일).
export function addOffset(iso, { months = 0, weeks = 0, days = 0 } = {}) {
  const { y, m, d } = toParts(iso);
  const total = y * 12 + (m - 1) + months;
  const ny = Math.floor(total / 12);
  const nm = (total % 12) + 1;
  const nd = Math.min(d, daysInMonth(ny, nm));
  return fromMs(Date.UTC(ny, nm - 1, nd) + (weeks * 7 + days) * DAY_MS);
}

export function diffDays(from, to) {
  return Math.round((toMs(to) - toMs(from)) / DAY_MS);
}

export function compare(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

// 생후 개월 수와 남은 일 수. 예) { months: 2, days: 5, totalDays: 66 }
export function age(birth, on) {
  const b = toParts(birth);
  const o = toParts(on);
  let months = (o.y - b.y) * 12 + (o.m - b.m);
  if (compare(addOffset(birth, { months }), on) > 0) months -= 1;
  months = Math.max(0, months);
  return {
    months,
    days: diffDays(addOffset(birth, { months }), on),
    totalDays: diffDays(birth, on),
  };
}

export function formatAge(birth, on) {
  const totalDays = diffDays(birth, on);
  if (totalDays < 0) return `출생 ${-totalDays}일 전`;
  const { months, days } = age(birth, on);
  if (months >= 24) {
    const years = Math.floor(months / 12);
    const rest = months % 12;
    return rest ? `만 ${years}세 ${rest}개월` : `만 ${years}세`;
  }
  if (months === 0) return `생후 ${days}일`;
  return days ? `생후 ${months}개월 ${days}일` : `생후 ${months}개월`;
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

export function formatDate(iso, { weekday = false } = {}) {
  const { y, m, d } = toParts(iso);
  const base = `${y}.${String(m).padStart(2, '0')}.${String(d).padStart(2, '0')}`;
  if (!weekday) return base;
  return `${base} (${WEEKDAYS[new Date(toMs(iso)).getUTCDay()]})`;
}

export function relativeDays(from, to) {
  const n = diffDays(from, to);
  if (n === 0) return '오늘';
  if (n === 1) return '내일';
  if (n > 0) return `${n}일 후`;
  return `${-n}일 지남`;
}
