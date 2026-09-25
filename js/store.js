// 모든 데이터는 기기 안(localStorage)에만 저장된다.
import { DEFAULT_OPTIONS } from './schedule.js';
import { isValidDate } from './dates.js';

const KEY = 'moonsik.vaccination.v1';

function empty() {
  return { children: [], records: {}, activeChildId: null, lastNotified: null };
}

export function normalize(raw) {
  const state = { ...empty(), ...(raw && typeof raw === 'object' ? raw : {}) };
  state.children = (Array.isArray(state.children) ? state.children : [])
    .filter((c) => c && typeof c.id === 'string' && isValidDate(c.birth))
    .map((c) => ({ id: c.id, name: String(c.name || '아기'), birth: c.birth, options: { ...DEFAULT_OPTIONS, ...c.options } }));
  const records = {};
  for (const child of state.children) {
    const src = state.records?.[child.id] ?? {};
    records[child.id] = {};
    for (const [doseId, rec] of Object.entries(src)) {
      if (rec && isValidDate(rec.date)) records[child.id][doseId] = { date: rec.date, memo: String(rec.memo ?? '') };
    }
  }
  state.records = records;
  if (!state.children.some((c) => c.id === state.activeChildId)) state.activeChildId = state.children[0]?.id ?? null;
  return state;
}

export function load(storage = globalThis.localStorage) {
  try {
    return normalize(JSON.parse(storage.getItem(KEY)));
  } catch {
    return empty();
  }
}

export function save(state, storage = globalThis.localStorage) {
  try {
    storage.setItem(KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function newId() {
  return `c${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}
