// 백신 제품 정보 (제조사, 종류, 접종 방법 등). 이름은 schedule.js 의 제품 이름과 정확히 같아야 한다.
// 자세한 허가 사항은 각 제품 설명서와 의사 안내가 우선한다.

const LIVE = '생백신 (약독화)';
const INACT = '불활성화 백신';
const RECOMB = '유전자재조합 백신';
const CONJ = '단백결합 백신';
const COMBO = '혼합백신 (무세포 백일해)';

const IM = '근육주사';
const SC = '피하주사';
const ORAL = '먹는 백신';

export const PRODUCT_INFO = {
  // ---------- 결핵 ----------
  '피내용 BCG (국가무료)': { maker: 'Statens Serum Institut 계열', country: '덴마크', type: LIVE, route: '피내주사', note: '보건소 등 지정 의료기관에서 무료로 접종해요.' },
  '경피용 BCG (도장형)': { maker: '일본 BCG 연구소', country: '일본', type: LIVE, route: '경피 (도장형, 9개 바늘 2회 누름)', note: '민간 병원에서 유료로 접종해요.' },
  'Ivactuber BCG (IVAC, 국가무료)': { maker: 'IVAC (백신·의료생물제품연구소)', country: '베트남', type: LIVE, route: '피내주사', note: '베트남 국가예방접종용으로 생후 1개월 이내, 체중 2kg 이상일 때 접종해요.' },

  // ---------- B형간염 ----------
  유박스B: { maker: 'LG화학', country: '한국', type: RECOMB, route: IM },
  '헤파박스-진티에프': { maker: '얀센', country: '한국 생산', type: RECOMB, route: IM },
  '엔제릭스-B': { maker: 'GSK', country: '벨기에', type: RECOMB, route: IM },
  'Gene-HBvax (베트남)': { maker: 'Vabiotech', country: '베트남', type: RECOMB, route: IM },
  'Engerix-B': { maker: 'GSK', country: '벨기에', type: RECOMB, route: IM },
  'Euvax B': { maker: 'LG화학', country: '한국', type: RECOMB, route: IM, note: '한국의 유박스B와 같은 제품이에요.' },
  'Heberbiovac HB': { maker: 'CIGB', country: '쿠바', type: RECOMB, route: IM },

  // ---------- 6가 / 5가 / 4가 혼합 ----------
  '헥사심 (6가, 국가무료)': {
    maker: '사노피', country: '프랑스', type: COMBO, route: IM,
    prevents: '디프테리아·파상풍·백일해·폴리오·Hib·B형간염',
    note: '출생 시 B형간염 1회를 맞은 뒤 생후 2·4·6개월에 3회 맞아요. 한 번에 6가지를 예방해 주사 횟수가 줄어요.',
  },
  'Hexaxim (6가)': {
    maker: '사노피', country: '프랑스', type: COMBO, route: IM,
    prevents: '디프테리아·파상풍·백일해·폴리오·Hib·B형간염',
    note: '한국의 헥사심과 같은 제품이에요.',
  },
  'Infanrix Hexa (6가)': {
    maker: 'GSK', country: '벨기에', type: COMBO, route: IM,
    prevents: '디프테리아·파상풍·백일해·폴리오·Hib·B형간염',
  },
  펜탁심: { maker: '사노피', country: '프랑스', type: COMBO, route: IM, prevents: '디프테리아·파상풍·백일해·폴리오·Hib' },
  'Pentaxim (5가)': { maker: '사노피', country: '프랑스', type: COMBO, route: IM, prevents: '디프테리아·파상풍·백일해·폴리오·Hib', note: '한국의 펜탁심과 같은 제품이에요.' },
  테트락심: { maker: '사노피', country: '프랑스', type: COMBO, route: IM, prevents: '디프테리아·파상풍·백일해·폴리오', note: '만 4~6세 추가접종에 많이 써요.' },
  'Tetraxim (4가)': { maker: '사노피', country: '프랑스', type: COMBO, route: IM, prevents: '디프테리아·파상풍·백일해·폴리오', note: '한국의 테트락심과 같은 제품이에요.' },
  '인판릭스-IPV': { maker: 'GSK', country: '벨기에', type: COMBO, route: IM, prevents: '디프테리아·파상풍·백일해·폴리오' },
  인판릭스: { maker: 'GSK', country: '벨기에', type: '톡소이드·무세포 백일해 백신', route: IM, prevents: '디프테리아·파상풍·백일해' },
  '5가 DPT-VGB-Hib (SII, 국가무료)': {
    maker: 'Serum Institute of India', country: '인도', type: '혼합백신 (전세포 백일해)', route: IM,
    prevents: '디프테리아·파상풍·백일해·B형간염·Hib',
    note: '베트남 국가예방접종에서 생후 2·3·4개월에 무료로 맞아요. 전세포 백일해 백신이라 무세포 백신보다 열이 조금 더 날 수 있어요.',
  },

  // ---------- 폴리오 ----------
  이모박스폴리오: { maker: '사노피', country: '프랑스', type: INACT, route: `${IM} 또는 ${SC}` },
  'Imovax Polio (IPV)': { maker: '사노피', country: '프랑스', type: INACT, route: `${IM} 또는 ${SC}`, note: '한국의 이모박스폴리오와 같은 제품이에요.' },
  'bOPV 경구 (국가무료)': { maker: null, country: '베트남 국가예방접종', type: LIVE, route: ORAL, note: '베트남 국가예방접종에서 생후 2·3·4개월에 입으로 먹여요.' },

  // ---------- Hib ----------
  악티브: { maker: '사노피', country: '프랑스', type: CONJ, route: IM },
  히베릭스: { maker: 'GSK', country: '벨기에', type: CONJ, route: IM },
  유히브: { maker: 'LG화학', country: '한국', type: CONJ, route: IM },
  'Quimi-Hib (단독, 12개월 이후 추가접종용)': { maker: 'CIGB', country: '쿠바', type: CONJ, route: IM, note: '베트남에서는 혼합백신으로 기초접종을 하고, 추가접종을 못 한 경우에 주로 써요.' },

  // ---------- 폐렴구균 ----------
  '프리베나20 (20가)': { maker: '화이자', country: '벨기에 생산', type: CONJ, route: IM, prevents: '폐렴구균 20가지 혈청형', note: '한국은 2025년 10월부터 국가무료예요. 프리베나13으로 시작했어도 이어서 맞을 수 있어요.' },
  'Prevenar 20': { maker: '화이자', country: '벨기에 생산', type: CONJ, route: IM, prevents: '폐렴구균 20가지 혈청형' },
  '박스뉴반스 (15가)': { maker: 'MSD', country: '아일랜드 생산', type: CONJ, route: IM, prevents: '폐렴구균 15가지 혈청형' },
  'Vaxneuvance (15가)': { maker: 'MSD', country: '아일랜드 생산', type: CONJ, route: IM, prevents: '폐렴구균 15가지 혈청형' },
  '프리베나13 (13가)': { maker: '화이자', country: '벨기에 생산', type: CONJ, route: IM, prevents: '폐렴구균 13가지 혈청형' },
  'Prevenar 13': { maker: '화이자', country: '벨기에 생산', type: CONJ, route: IM, prevents: '폐렴구균 13가지 혈청형' },
  '신플로릭스 (10가, 신규접종 종료)': { maker: 'GSK', country: '벨기에', type: CONJ, route: IM, prevents: '폐렴구균 10가지 혈청형', note: '한국에서는 2025년부터 새로 시작하는 접종에 쓰지 않아요. 이미 시작했다면 남은 차수를 마칠 수 있어요.' },
  'Synflorix (10가)': { maker: 'GSK', country: '벨기에', type: CONJ, route: IM, prevents: '폐렴구균 10가지 혈청형' },

  // ---------- 로타바이러스 ----------
  로타릭스: { maker: 'GSK', country: '벨기에', type: LIVE, route: ORAL, doses: '2회 (생후 2·4개월)' },
  로타텍: { maker: 'MSD', country: '미국', type: LIVE, route: ORAL, doses: '3회 (생후 2·4·6개월)' },
  Rotarix: { maker: 'GSK', country: '벨기에', type: LIVE, route: ORAL, doses: '2회' },
  RotaTeq: { maker: 'MSD', country: '미국', type: LIVE, route: ORAL, doses: '3회' },
  'Rotavin-M1 (베트남, 국가무료)': { maker: 'Polyvac', country: '베트남', type: LIVE, route: ORAL, doses: '2회 (생후 2개월 시작, 6개월 전 완료)', note: '2026년부터 베트남 전국 보건소에서 무료예요. Rotarix·RotaTeq로 시작했다면 이어서 맞을 수 없어요.' },

  // ---------- MMR / 수두 ----------
  엠엠알II: { maker: 'MSD', country: '미국', type: LIVE, route: `${SC} 또는 ${IM}` },
  프리오릭스: { maker: 'GSK', country: '벨기에', type: LIVE, route: `${SC} 또는 ${IM}` },
  'MMR II': { maker: 'MSD', country: '미국', type: LIVE, route: `${SC} 또는 ${IM}` },
  Priorix: { maker: 'GSK', country: '벨기에', type: LIVE, route: `${SC} 또는 ${IM}` },
  'ProQuad (MMR+수두)': { maker: 'MSD', country: '미국', type: LIVE, route: SC, prevents: '홍역·유행성이하선염·풍진·수두' },
  'MVVac 홍역 단독 (국가무료)': { maker: 'Polyvac', country: '베트남', type: LIVE, route: SC, prevents: '홍역', note: '베트남 국가예방접종에서 생후 9개월에 맞아요.' },
  'MR 홍역·풍진 (국가무료)': { maker: 'Polyvac', country: '베트남', type: LIVE, route: SC, prevents: '홍역·풍진', note: '베트남 국가예방접종에서 생후 18개월에 맞아요. 유행성이하선염은 들어 있지 않아요.' },
  스카이바리셀라: { maker: 'SK바이오사이언스', country: '한국', type: LIVE, route: SC },
  배리셀라: { maker: 'GC녹십자', country: '한국', type: LIVE, route: SC },
  바리박스: { maker: 'MSD', country: '미국', type: LIVE, route: `${SC} 또는 ${IM}` },
  Varivax: { maker: 'MSD', country: '미국', type: LIVE, route: `${SC} 또는 ${IM}` },
  Varilrix: { maker: 'GSK', country: '벨기에', type: LIVE, route: SC },
  'Varicella (녹십자, 한국)': { maker: 'GC녹십자', country: '한국', type: LIVE, route: SC },

  // ---------- A형간염 ----------
  하브릭스: { maker: 'GSK', country: '벨기에', type: INACT, route: IM, doses: '2회 (6~12개월 간격)' },
  박타: { maker: 'MSD', country: '미국', type: INACT, route: IM, doses: '2회 (6~18개월 간격)' },
  아박심: { maker: '사노피', country: '프랑스', type: INACT, route: IM, doses: '2회', note: '제품(용량)에 따라 접종 가능한 나이가 달라요.' },
  'Avaxim 80': { maker: '사노피', country: '프랑스', type: INACT, route: IM, doses: '2회', note: '만 12개월~15세 소아용이에요.' },
  'Havax (베트남, 만 2세~)': { maker: 'Vabiotech', country: '베트남', type: INACT, route: IM, note: '만 2세부터 맞을 수 있어요.' },
  'Twinrix (A+B형)': { maker: 'GSK', country: '벨기에', type: INACT, route: IM, prevents: 'A형간염·B형간염' },

  // ---------- 일본뇌염 ----------
  '세포배양 불활성화 백신 (보령·GC녹십자)': { maker: '보령바이오파마·GC녹십자', country: '한국', type: `${INACT} (베로세포)`, route: SC, doses: '5회 (기초 3회 + 만 6세·12세)', note: '한국 국가무료예요.' },
  '씨디제박스 (국가무료)': { maker: '청두 생물제품연구소 (CDIBP)', country: '중국', type: LIVE, route: SC, doses: '2회 (12개월 간격)', note: '한국 국가무료 생백신이에요.' },
  '이모젭 (유료)': { maker: '사노피', country: '태국 생산', type: `${LIVE} (키메라)`, route: SC, doses: '2회 (12~24개월 간격)', note: '한국에서는 국가 지원이 아닌 유료 접종이에요.' },
  'Jeev (인도)': { maker: 'Biological E', country: '인도', type: `${INACT} (베로세포)`, route: IM, doses: '28일 간격 2회 + 1년 뒤 추가' },
  'Jevax (베트남, 국가무료)': { maker: 'Vabiotech', country: '베트남', type: INACT, route: SC, doses: '1차 → 7~14일 뒤 → 12개월 뒤, 이후 3년마다', note: '베트남 국가예방접종에서 만 1세부터 맞아요.' },
  Imojev: { maker: '사노피', country: '태국 생산', type: `${LIVE} (키메라)`, route: SC, doses: '생후 9개월부터 1년 간격 2회' },

  // ---------- 인플루엔자 ----------
  지씨플루: { maker: 'GC녹십자', country: '한국', type: `${INACT} (유정란)`, route: IM },
  스카이셀플루: { maker: 'SK바이오사이언스', country: '한국', type: `${INACT} (세포배양)`, route: IM },
  박씨그리프: { maker: '사노피', country: '프랑스', type: `${INACT} (유정란)`, route: IM },
  플루아릭스: { maker: 'GSK', country: '독일 생산', type: `${INACT} (유정란)`, route: IM },
  'Vaxigrip Tetra': { maker: '사노피', country: '프랑스', type: `${INACT} (4가)`, route: IM },
  'Influvac Tetra': { maker: 'Abbott', country: '네덜란드', type: `${INACT} (4가)`, route: IM },
  'GCFlu Quadrivalent': { maker: 'GC녹십자', country: '한국', type: `${INACT} (4가)`, route: IM },
  'Ivacflu-S (베트남)': { maker: 'IVAC', country: '베트남', type: `${INACT} (3가)`, route: IM, note: '만 9세 미만도 1회 접종으로 허가되어 있어요.' },

  // ---------- Tdap / Td ----------
  부스트릭스: { maker: 'GSK', country: '벨기에', type: 'Tdap (성분 줄인 무세포 백일해)', route: IM },
  아다셀: { maker: '사노피', country: '캐나다', type: 'Tdap (성분 줄인 무세포 백일해)', route: IM },
  '티디퓨어 (Td)': { maker: 'GC녹십자', country: '한국', type: 'Td (파상풍·디프테리아)', route: IM, prevents: '파상풍·디프테리아', note: '백일해 성분은 들어 있지 않아요.' },
  Adacel: { maker: '사노피', country: '캐나다', type: 'Tdap', route: IM },
  Boostrix: { maker: 'GSK', country: '벨기에', type: 'Tdap', route: IM },

  // ---------- HPV ----------
  '가다실 (4가, 국가무료)': { maker: 'MSD', country: '미국', type: RECOMB, route: IM, prevents: 'HPV 6·11·16·18형', note: '2026년부터 12세 남아·여아 모두 무료예요.' },
  '가다실9 (유료)': { maker: 'MSD', country: '미국', type: RECOMB, route: IM, prevents: 'HPV 9가지 유형' },
  '서바릭스 (2가)': { maker: 'GSK', country: '벨기에', type: RECOMB, route: IM, prevents: 'HPV 16·18형' },
  Gardasil: { maker: 'MSD', country: '미국', type: RECOMB, route: IM, prevents: 'HPV 6·11·16·18형' },
  'Gardasil 9': { maker: 'MSD', country: '미국', type: RECOMB, route: IM, prevents: 'HPV 9가지 유형' },
};

// 백신 종류별 접종 후 살펴볼 점 (일반적인 안내)
const INJECTION = '접종 부위가 붉어지거나 붓고 아플 수 있어요. 보통 1~2일 안에 좋아져요.';
const FEVER = '미열이 나거나 평소보다 보챌 수 있어요.';
export const AFTERCARE = {
  bcg: [
    '접종 2~4주 뒤 접종 부위에 작은 멍울이나 고름이 생겼다가 2~3개월에 걸쳐 흉터로 아물어요. 정상 반응이에요.',
    '고름을 짜거나 반창고를 붙이지 말고 깨끗하게만 두세요.',
    '겨드랑이 멍울이 커지거나 고름이 터지면 병원에 보여 주세요.',
  ],
  hepb: [INJECTION, FEVER],
  dtap: [INJECTION, FEVER, '38.5℃ 이상 열이 이어지거나 3시간 넘게 달래지지 않고 울면 병원에 가세요.'],
  ipv: [INJECTION],
  hib: [INJECTION, FEVER],
  pcv: [INJECTION, FEVER, '졸려하거나 잘 먹지 않을 수 있어요.'],
  rv: [
    '먹는 백신이라 주사 자국은 없어요.',
    '가벼운 설사나 구토, 보챔이 있을 수 있어요.',
    '접종 후 1주일 안에 심하게 보채거나 반복해서 토하거나 혈변을 보면 장중첩증일 수 있으니 바로 병원에 가세요.',
  ],
  mmr: [INJECTION, '생백신이라 접종 7~12일 뒤에 열이나 가벼운 발진이 생길 수 있어요.'],
  var: [INJECTION, '접종 부위나 몸에 수두 같은 작은 물집이 몇 개 생길 수 있어요.'],
  hepa: [INJECTION],
  je: [INJECTION, FEVER],
  iiv: [INJECTION, FEVER, '달걀 알레르기가 심하면 접종 전에 의사에게 알려 주세요.'],
  tdap: [INJECTION],
  hpv: [INJECTION, '접종 직후 어지러울 수 있어 15~30분 앉아서 쉬었다 가요.'],
};

export const EMERGENCY = '숨쉬기 힘들어하거나 얼굴·입술이 붓고, 온몸에 두드러기가 나거나, 경련을 하면 바로 응급실에 가세요.';
