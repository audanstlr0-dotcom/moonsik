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

// 국내에서 쓰이는 대표 백신 제품. 목록에 없는 제품은 앱에서 직접 입력할 수 있다.
//   variant: 로타바이러스·일본뇌염처럼 제품에 따라 접종 횟수가 달라지는 경우 해당 일정
//   covers:  혼합백신이 함께 접종하는 다른 백신 (예: 펜탁심 = DTaP + IPV + Hib)
const PRODUCTS = {
  bcg: [{ name: '피내용 BCG (국가무료)' }, { name: '경피용 BCG (도장형)' }],
  hepb: [{ name: '유박스B' }, { name: '헤파박스-진' }, { name: '엔게릭스-B' }],
  dtap: [
    { name: '인판릭스' },
    { name: '펜탁심', covers: ['ipv', 'hib'] },
    { name: '테트락심', covers: ['ipv'] },
    { name: '인판릭스-IPV', covers: ['ipv'] },
  ],
  ipv: [
    { name: '이모박스폴리오' },
    { name: '펜탁심', covers: ['dtap', 'hib'] },
    { name: '테트락심', covers: ['dtap'] },
    { name: '인판릭스-IPV', covers: ['dtap'] },
  ],
  hib: [{ name: '악티브' }, { name: '히베릭스' }, { name: '유히브' }, { name: '펜탁심', covers: ['dtap', 'ipv'] }],
  pcv: [{ name: '프리베나13' }, { name: '신플로릭스' }, { name: '박스뉴반스' }],
  rv: [
    { name: '로타릭스', variant: 'rv1' },
    { name: '로타텍', variant: 'rv5' },
  ],
  mmr: [{ name: '엠엠알II' }, { name: '프리오릭스' }],
  var: [{ name: '스카이바리셀라' }, { name: '배리셀라' }, { name: '수두박스' }, { name: '바리박스' }],
  hepa: [{ name: '하브릭스' }, { name: '박타' }, { name: '아박심' }],
  je: [
    { name: '보령 세포배양 일본뇌염백신', variant: 'inactivated' },
    { name: '이모젭', variant: 'live' },
    { name: '씨디제박스', variant: 'live' },
  ],
  iiv: [{ name: '지씨플루' }, { name: '스카이셀플루' }, { name: '박씨그리프' }, { name: '플루아릭스' }],
  tdap: [{ name: '부스트릭스' }, { name: '아다셀' }, { name: '티디퓨어 (Td)' }],
  hpv: [{ name: '가다실' }, { name: '서바릭스' }, { name: '가다실9 (유료)' }],
};

// 베트남에서 접종할 수 있는 제품 (VNVC·롱쩌우 등 민간 접종센터와 국가예방접종 TCMR 기준).
// 6가 혼합백신(Hexaxim, Infanrix Hexa)은 B형간염까지 함께 접종한다.
const HEXA = ['dtap', 'ipv', 'hib', 'hepb'];
const combo = (name, all, self) => ({ name, covers: all.filter((id) => id !== self) });
const PRODUCTS_VN = {
  bcg: [{ name: 'BCG (IVAC, 국가무료)' }],
  hepb: [
    { name: 'Gene-HBvax (베트남)' },
    { name: 'Engerix-B' },
    { name: 'Euvax B' },
    { name: 'Heberbiovac HB' },
    combo('Hexaxim (6가)', HEXA, 'hepb'),
    combo('Infanrix Hexa (6가)', HEXA, 'hepb'),
  ],
  dtap: [
    combo('Hexaxim (6가)', HEXA, 'dtap'),
    combo('Infanrix Hexa (6가)', HEXA, 'dtap'),
    { name: 'Pentaxim (5가)', covers: ['ipv', 'hib'] },
    { name: 'Tetraxim (4가)', covers: ['ipv'] },
    { name: '5가 DPT-VGB-Hib (국가무료)', covers: ['hib', 'hepb'] },
  ],
  ipv: [
    { name: 'Imovax Polio (IPV)' },
    { name: 'bOPV 경구 (국가무료)' },
    combo('Hexaxim (6가)', HEXA, 'ipv'),
    combo('Infanrix Hexa (6가)', HEXA, 'ipv'),
    { name: 'Pentaxim (5가)', covers: ['dtap', 'hib'] },
    { name: 'Tetraxim (4가)', covers: ['dtap'] },
  ],
  hib: [
    combo('Hexaxim (6가)', HEXA, 'hib'),
    combo('Infanrix Hexa (6가)', HEXA, 'hib'),
    { name: 'Pentaxim (5가)', covers: ['dtap', 'ipv'] },
    { name: '5가 DPT-VGB-Hib (국가무료)', covers: ['dtap', 'hepb'] },
  ],
  pcv: [{ name: 'Synflorix (10가)' }, { name: 'Prevenar 13' }, { name: 'Vaxneuvance (15가)' }, { name: 'Prevenar 20' }],
  rv: [
    { name: 'Rotarix', variant: 'rv1' },
    { name: 'Rotavin-M1 (베트남)', variant: 'rv1' },
    { name: 'RotaTeq', variant: 'rv5' },
  ],
  mmr: [
    { name: 'MMR II' },
    { name: 'Priorix' },
    { name: 'ProQuad (MMR+수두)', covers: ['var'] },
    { name: 'MVVac 홍역 단독 (국가무료)' },
    { name: 'MR 홍역·풍진 (국가무료)' },
  ],
  var: [
    { name: 'Varivax' },
    { name: 'Varilrix' },
    { name: 'Varicella (녹십자, 한국)' },
    { name: 'ProQuad (MMR+수두)', covers: ['mmr'] },
  ],
  hepa: [{ name: 'Avaxim 80' }, { name: 'Havax (베트남, 만 2세~)' }, { name: 'Twinrix (A+B형)', covers: ['hepb'] }],
  je: [
    { name: 'Jeev (인도)', variant: 'inactivated' },
    { name: 'Jevax (베트남, 국가무료)', variant: 'inactivated' },
    { name: 'Imojev', variant: 'live' },
  ],
  iiv: [{ name: 'Vaxigrip Tetra' }, { name: 'Influvac Tetra' }, { name: 'GCFlu Quadrivalent' }, { name: 'Ivacflu-S (베트남)' }],
  tdap: [{ name: 'Adacel' }, { name: 'Boostrix' }],
  hpv: [{ name: 'Gardasil' }, { name: 'Gardasil 9' }],
};

// 베트남에서 한국과 다르게 알아둘 점
const NOTES_VN = {
  bcg: '베트남 국가예방접종(TCMR)은 출생 후 1개월 이내 무료로 접종해요.',
  hepb: '베트남에서는 2·3·4개월(국가) 또는 2·4·6개월(민간)에 6가/5가 혼합백신으로 B형간염을 함께 맞는 경우가 많아요.',
  dtap: '한국에서 쓰는 인판릭스 단독 백신 대신, 베트남에서는 Hexaxim·Infanrix Hexa(6가)나 Pentaxim(5가) 혼합백신을 주로 맞아요.',
  hib: '베트남에는 Hib 단독 백신이 거의 없어 혼합백신으로 맞아요.',
  mmr: '베트남 국가예방접종은 생후 9개월 홍역(MVVac), 18개월 MR을 무료로 접종해요. 한국 일정(12개월 MMR)과 다르니 병원과 상의하세요.',
  rv: 'Rotavin-M1(베트남)은 로타릭스처럼 2회 먹는 백신이에요.',
  je: 'Jevax(국가무료)와 Jeev는 불활성화 백신, Imojev는 생백신이에요. 제품마다 추가접종 일정이 다를 수 있어요.',
  hepa: 'Havax는 만 2세부터 접종할 수 있어요.',
};

// 로타바이러스·일본뇌염 일정 선택 버튼의 나라별 이름
const VARIANT_LABELS_VN = {
  rv: { rv1: 'Rotarix·Rotavin (2회)', rv5: 'RotaTeq (3회)' },
  je: { inactivated: '불활성화 Jeev·Jevax', live: '생백신 Imojev (2회)' },
};

export const REGIONS = {
  kr: { label: '한국', guide: { name: '예방접종도우미', url: 'https://nip.kdca.go.kr' } },
  vn: { label: '베트남', guide: { name: 'VNVC', url: 'https://vnvc.vn' } },
};

// 베트남에서 추가로 고려하는 접종 (앱 일정에는 넣지 않고 안내만 한다)
export const EXTRAS_VN = [
  {
    name: '수막구균 B',
    products: 'Bexsero, VA-Mengoc-BC',
    when: 'Bexsero 생후 2개월부터, VA-Mengoc-BC 생후 6개월부터',
  },
  {
    name: '수막구균 ACYW',
    products: 'Menactra, MenQuadfi, Nimenrix',
    when: 'Menactra 생후 9개월부터 (제품별 일정 다름)',
  },
  { name: '뎅기열', products: 'Qdenga', when: '만 4세부터, 3개월 간격 2회' },
];

for (const vaccine of VACCINES) {
  vaccine.productsByRegion = { kr: PRODUCTS[vaccine.id] ?? [], vn: PRODUCTS_VN[vaccine.id] ?? [] };
  vaccine.notesByRegion = { vn: NOTES_VN[vaccine.id] };
}

function allProducts(vaccine) {
  return [...vaccine.productsByRegion.kr, ...vaccine.productsByRegion.vn];
}

export function findProduct(vaccine, name) {
  return allProducts(vaccine).find((p) => p.name === name) ?? null;
}

// 거주 국가와 선택된 일정(로타릭스/로타텍 등)에 맞는 제품만 돌려준다.
export function productsFor(vaccine, options = {}, region = 'kr') {
  const list = vaccine.productsByRegion[region] ?? vaccine.productsByRegion.kr;
  if (!vaccine.variants) return list;
  const key = options[vaccine.option] ?? DEFAULT_OPTIONS[vaccine.option];
  return list.filter((p) => !p.variant || p.variant === key);
}

export function variantLabel(vaccine, key, region = 'kr') {
  return (region === 'vn' && VARIANT_LABELS_VN[vaccine.option]?.[key]) || vaccine.variants[key].label;
}

export function regionNote(vaccine, region = 'kr') {
  return vaccine.notesByRegion[region] ?? null;
}
