// 질병관리청 국가예방접종 표준일정(영유아~만 12세)을 기준으로 한 접종 데이터.
//
// 각 차수(dose)의 시기는 "출생일 기준" 또는 "이전 차수 접종일 기준(after)" 오프셋으로 표현한다.
//   start: 권장 시작 시점 (이 날부터 접종 가능)
//   end:   권장 기간이 끝나는 시점 (이 날 전까지 접종 권장, 미포함). 없으면 기한 없음.
// 오프셋은 { months, weeks, days } 형태.

export const STAGES = [
  { id: 'birth', label: '출생 ~ 1개월' },
  { id: 'm2', label: '생후 2개월' },
  { id: 'm4', label: '생후 4개월' },
  { id: 'm6', label: '생후 6개월' },
  { id: 'm12', label: '생후 12 ~ 23개월' },
  { id: 'y2', label: '만 2 ~ 3세' },
  { id: 'y4', label: '만 4 ~ 6세' },
  { id: 'y11', label: '만 11 ~ 12세' },
  { id: 'flu', label: '인플루엔자 (생후 6개월 이후 매년)' },
];

export const VACCINES = [
  {
    id: 'bcg',
    name: 'BCG',
    disease: '결핵',
    doses: [{ no: 1, stage: 'birth', when: '생후 4주 이내', start: {}, end: { weeks: 4, days: 1 } }],
  },
  {
    id: 'hepb',
    name: 'HepB',
    disease: 'B형간염',
    doses: [
      { no: 1, stage: 'birth', when: '출생 시', start: {}, end: { months: 1 } },
      { no: 2, stage: 'birth', when: '생후 1개월', start: { months: 1 }, end: { months: 2 } },
      { no: 3, stage: 'm6', when: '생후 6개월', start: { months: 6 }, end: { months: 7 } },
    ],
  },
  {
    id: 'dtap',
    name: 'DTaP',
    disease: '디프테리아·파상풍·백일해',
    doses: [
      { no: 1, stage: 'm2', when: '생후 2개월', start: { months: 2 }, end: { months: 3 } },
      { no: 2, stage: 'm4', when: '생후 4개월', start: { months: 4 }, end: { months: 5 } },
      { no: 3, stage: 'm6', when: '생후 6개월', start: { months: 6 }, end: { months: 7 } },
      { no: 4, stage: 'm12', when: '생후 15 ~ 18개월', start: { months: 15 }, end: { months: 19 } },
      { no: 5, stage: 'y4', when: '만 4 ~ 6세', start: { months: 48 }, end: { months: 84 } },
    ],
  },
  {
    id: 'ipv',
    name: 'IPV',
    disease: '폴리오(소아마비)',
    doses: [
      { no: 1, stage: 'm2', when: '생후 2개월', start: { months: 2 }, end: { months: 3 } },
      { no: 2, stage: 'm4', when: '생후 4개월', start: { months: 4 }, end: { months: 5 } },
      { no: 3, stage: 'm6', when: '생후 6 ~ 18개월', start: { months: 6 }, end: { months: 19 } },
      { no: 4, stage: 'y4', when: '만 4 ~ 6세', start: { months: 48 }, end: { months: 84 } },
    ],
  },
  {
    id: 'hib',
    name: 'Hib',
    disease: 'b형 헤모필루스 인플루엔자',
    doses: [
      { no: 1, stage: 'm2', when: '생후 2개월', start: { months: 2 }, end: { months: 3 } },
      { no: 2, stage: 'm4', when: '생후 4개월', start: { months: 4 }, end: { months: 5 } },
      { no: 3, stage: 'm6', when: '생후 6개월', start: { months: 6 }, end: { months: 7 } },
      { no: 4, stage: 'm12', when: '생후 12 ~ 15개월', start: { months: 12 }, end: { months: 16 } },
    ],
  },
  {
    id: 'pcv',
    name: 'PCV',
    disease: '폐렴구균',
    doses: [
      { no: 1, stage: 'm2', when: '생후 2개월', start: { months: 2 }, end: { months: 3 } },
      { no: 2, stage: 'm4', when: '생후 4개월', start: { months: 4 }, end: { months: 5 } },
      { no: 3, stage: 'm6', when: '생후 6개월', start: { months: 6 }, end: { months: 7 } },
      { no: 4, stage: 'm12', when: '생후 12 ~ 15개월', start: { months: 12 }, end: { months: 16 } },
    ],
  },
  {
    id: 'rv',
    name: 'RV',
    disease: '로타바이러스',
    option: 'rv',
    note: '1차는 생후 15주 이전에 시작하고, 마지막 차수는 생후 8개월 0일 이전에 마쳐야 합니다.',
    variants: {
      rv1: {
        label: '로타릭스 (2회)',
        doses: [
          { no: 1, stage: 'm2', when: '생후 2개월', start: { months: 2 }, end: { months: 3 } },
          { no: 2, stage: 'm4', when: '생후 4개월', start: { months: 4 }, end: { months: 5 } },
        ],
      },
      rv5: {
        label: '로타텍 (3회)',
        doses: [
          { no: 1, stage: 'm2', when: '생후 2개월', start: { months: 2 }, end: { months: 3 } },
          { no: 2, stage: 'm4', when: '생후 4개월', start: { months: 4 }, end: { months: 5 } },
          { no: 3, stage: 'm6', when: '생후 6개월', start: { months: 6 }, end: { months: 7 } },
        ],
      },
    },
  },
  {
    id: 'mmr',
    name: 'MMR',
    disease: '홍역·유행성이하선염·풍진',
    doses: [
      { no: 1, stage: 'm12', when: '생후 12 ~ 15개월', start: { months: 12 }, end: { months: 16 } },
      { no: 2, stage: 'y4', when: '만 4 ~ 6세', start: { months: 48 }, end: { months: 84 } },
    ],
  },
  {
    id: 'var',
    name: 'VAR',
    disease: '수두',
    doses: [{ no: 1, stage: 'm12', when: '생후 12 ~ 15개월', start: { months: 12 }, end: { months: 16 } }],
  },
  {
    id: 'hepa',
    name: 'HepA',
    disease: 'A형간염',
    note: '2차 접종 간격은 백신 제품에 따라 6 ~ 18개월입니다.',
    doses: [
      { no: 1, stage: 'm12', when: '생후 12 ~ 23개월', start: { months: 12 }, end: { months: 24 } },
      { no: 2, stage: 'y2', when: '1차 접종 6 ~ 12개월 후', after: 1, start: { months: 6 }, end: { months: 13 } },
    ],
  },
  {
    id: 'je',
    name: '일본뇌염',
    disease: '일본뇌염',
    option: 'je',
    variants: {
      inactivated: {
        label: '불활성화 백신 (5회)',
        doses: [
          { no: 1, stage: 'm12', when: '생후 12 ~ 23개월', start: { months: 12 }, end: { months: 24 } },
          { no: 2, stage: 'm12', when: '1차 접종 7 ~ 30일 후', after: 1, start: { days: 7 }, end: { days: 31 } },
          { no: 3, stage: 'y2', when: '2차 접종 12개월 후', after: 2, start: { months: 12 }, end: { months: 13 } },
          { no: 4, stage: 'y4', when: '만 6세', start: { months: 72 }, end: { months: 84 } },
          { no: 5, stage: 'y11', when: '만 12세', start: { months: 144 }, end: { months: 156 } },
        ],
      },
      live: {
        label: '약독화 생백신 (2회)',
        doses: [
          { no: 1, stage: 'm12', when: '생후 12 ~ 23개월', start: { months: 12 }, end: { months: 24 } },
          { no: 2, stage: 'y2', when: '1차 접종 12개월 후', after: 1, start: { months: 12 }, end: { months: 13 } },
        ],
      },
    },
  },
  {
    id: 'iiv',
    name: 'IIV',
    disease: '인플루엔자',
    note: '생후 6개월 이후 매년 접종합니다. 처음 접종하는 만 9세 미만 어린이는 4주 간격으로 2회 접종합니다.',
    doses: [
      { no: 1, stage: 'flu', when: '생후 6개월 이후 첫 접종', start: { months: 6 } },
      { no: 2, stage: 'flu', when: '1차 접종 4주 후', after: 1, start: { weeks: 4 } },
    ],
  },
  {
    id: 'tdap',
    name: 'Tdap/Td',
    disease: '파상풍·디프테리아·백일해',
    doses: [{ no: 6, stage: 'y11', when: '만 11 ~ 12세', start: { months: 132 }, end: { months: 156 } }],
  },
  {
    id: 'hpv',
    name: 'HPV',
    disease: '사람유두종바이러스',
    doses: [
      { no: 1, stage: 'y11', when: '만 12세', start: { months: 144 }, end: { months: 156 } },
      { no: 2, stage: 'y11', when: '1차 접종 6 ~ 12개월 후', after: 1, start: { months: 6 }, end: { months: 13 } },
    ],
  },
];

export const DEFAULT_OPTIONS = { rv: 'rv1', je: 'inactivated' };

// 아이의 선택 옵션(로타바이러스·일본뇌염 백신 종류)을 반영해 실제 접종할 차수 목록을 돌려준다.
export function dosesFor(vaccine, options = {}) {
  if (!vaccine.variants) return vaccine.doses;
  const key = options[vaccine.option] ?? DEFAULT_OPTIONS[vaccine.option];
  return (vaccine.variants[key] ?? Object.values(vaccine.variants)[0]).doses;
}

export function doseId(vaccine, dose) {
  return `${vaccine.id}-${dose.no}`;
}
