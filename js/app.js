import { VACCINES, productsFor } from './schedule.js';
import { buildPlan, groupByStage, groupByVaccine, summarize, agenda, reminders, STATUS } from './planner.js';
import { todayISO, formatAge, formatDate, relativeDays, isValidDate, compare } from './dates.js';
import { buildICS } from './ics.js';
import { load, save, normalize, newId } from './store.js';

const $ = (sel, root = document) => root.querySelector(sel);
const view = $('#view');
const dialog = $('#dialog');
const childSelect = $('#child-select');

let state = load();
let currentView = 'home';
let scheduleMode = 'stage';

const today = () => todayISO();

// claude.ai 에 올리는 테스트용 미리보기에서는 파일 저장·설치·알림을 쓸 수 없어 숨긴다.
const PREVIEW = globalThis.VACCINATION_PREVIEW === true;

// ---------- 홈 화면에 설치 ----------

let installPrompt = null;
const isStandalone = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  installPrompt = e;
  if (activeChild()) render();
});

window.addEventListener('appinstalled', () => {
  installPrompt = null;
  render();
  toast('홈 화면에 설치했어요');
});

function installHTML({ dismissible = false } = {}) {
  if (PREVIEW || isStandalone()) return '';
  if (dismissible && state.installDismissed) return '';
  const how = installPrompt
    ? '<button type="button" class="btn primary small" data-action="install">설치</button>'
    : '';
  const text = isIOS()
    ? 'Safari 아래쪽 <b>공유 버튼(□↑)</b> → <b>홈 화면에 추가</b>를 누르세요. 설치해야 알림도 받을 수 있어요.'
    : installPrompt
      ? '앱처럼 바로 열고, 인터넷 없이도 쓸 수 있어요.'
      : 'Chrome 오른쪽 위 <b>⋮ 메뉴</b> → <b>홈 화면에 추가</b> 또는 <b>앱 설치</b>를 누르세요.';
  return `
    <div class="card row install">
      <div><strong>📲 홈 화면에 앱으로 설치</strong><span>${text}</span></div>
      ${how}
      ${dismissible ? '<button type="button" class="close" data-action="dismiss-install" aria-label="닫기">×</button>' : ''}
    </div>`;
}

async function install() {
  if (!installPrompt) return;
  installPrompt.prompt();
  await installPrompt.userChoice;
  installPrompt = null;
  render();
}

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

function activeChild() {
  return state.children.find((c) => c.id === state.activeChildId) ?? null;
}

function recordsOf(child) {
  return (state.records[child.id] ??= {});
}

function currentPlan() {
  const child = activeChild();
  return child ? buildPlan(child, recordsOf(child), today()) : [];
}

function persist() {
  if (!save(state)) toast('저장에 실패했어요. 브라우저 저장 공간을 확인해 주세요.');
}

function toast(message) {
  const el = $('#toast');
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove('show'), 2800);
}

// ---------- 공통 조각 ----------

function statusChip(item) {
  return `<span class="chip chip-${item.status}">${STATUS[item.status].label}</span>`;
}

function dateLine(item) {
  if (item.record) return `${formatDate(item.record.date)} 접종`;
  const t = today();
  const range = item.lastDay ? `${formatDate(item.start)} ~ ${formatDate(item.lastDay)}` : `${formatDate(item.start)} 부터`;
  const prefix = item.estimated ? '예상 ' : '';
  let hint = '';
  if (item.status === 'soon' || item.status === 'upcoming') hint = ` · ${relativeDays(t, item.start)}`;
  if (item.status === 'overdue') hint = ` · ${relativeDays(t, item.lastDay)}`;
  return `${prefix}${range}${hint}`;
}

// 기록된 제품이 있으면 그 이름, 없으면 대표 제품 이름
function productHint(item) {
  if (item.record?.product) return item.record.product;
  const names = productsFor(item.vaccine, activeChild().options).map((p) => p.name);
  return names.length > 2 ? `${names.slice(0, 2).join(', ')} 등` : names.join(', ');
}

function doseRow(item, { showWhen = true } = {}) {
  const done = item.status === 'done';
  const product = productHint(item);
  return `
    <li class="dose status-${item.status}">
      <button type="button" class="check" data-action="quick-toggle" data-dose="${item.id}"
        aria-pressed="${done}" aria-label="${esc(item.vaccine.name)} ${item.dose.no}차 ${done ? '접종 취소' : '접종 완료로 표시'}">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 12.5 4 4 8-9" /></svg>
      </button>
      <button type="button" class="dose-body" data-action="open-dose" data-dose="${item.id}">
        <span class="dose-title">
          <strong>${esc(item.vaccine.name)} ${item.dose.no}차</strong>
          <span class="disease">${esc(item.vaccine.disease)}</span>
        </span>
        <span class="dose-meta">${showWhen ? `${esc(item.dose.when)} · ` : ''}${dateLine(item)}</span>
        ${product ? `<span class="dose-product${item.record?.product ? ' is-set' : ''}">${esc(product)}</span>` : ''}
      </button>
      ${statusChip(item)}
    </li>`;
}

// ---------- 화면: 시작(아이 등록) ----------

function renderWelcome() {
  view.innerHTML = `
    <section class="welcome">
      <div class="welcome-art" aria-hidden="true">👶💉📅</div>
      <h1>우리 아기 예방접종,<br />놓치지 않게 챙겨요</h1>
      <p>생년월일만 입력하면 개월 수에 맞춰 국가예방접종 일정을 계산하고, 맞은 접종을 체크할 수 있어요.</p>
      ${childFormHTML()}
      <p class="fine">입력한 정보는 이 기기에만 저장되고 외부로 전송되지 않아요.</p>
    </section>`;
}

function childFormHTML(child = null) {
  return `
    <form class="card form" data-form="child" data-child="${child?.id ?? ''}">
      <label>아기 이름 (태명도 좋아요)
        <input name="name" required maxlength="20" value="${esc(child?.name ?? '')}" placeholder="예) 문식이" />
      </label>
      <label>생년월일
        <input name="birth" type="date" required max="${today()}" value="${esc(child?.birth ?? '')}" />
      </label>
      <div class="actions">
        ${child ? '<button type="button" class="btn ghost" data-action="close-dialog">취소</button>' : ''}
        <button class="btn primary">${child ? '저장' : '시작하기'}</button>
      </div>
    </form>`;
}

// ---------- 화면: 홈 ----------

function renderHome() {
  const child = activeChild();
  const plan = currentPlan();
  const sum = summarize(plan);
  const { now, next } = agenda(plan);
  const pct = sum.total ? Math.round((sum.done / sum.total) * 100) : 0;
  const overdue = now.filter((i) => i.status === 'overdue');

  view.innerHTML = `
    ${installHTML({ dismissible: true })}
    <section class="hero card">
      <div>
        <p class="hero-name">${esc(child.name)}</p>
        <p class="hero-age">${formatAge(child.birth, today())}</p>
        <p class="hero-birth">${formatDate(child.birth, { weekday: true })} 출생</p>
      </div>
      <div class="ring" style="--pct:${pct}" role="img" aria-label="전체 ${sum.total}회 중 ${sum.done}회 접종 완료">
        <span><strong>${sum.done}</strong>/${sum.total}</span>
      </div>
    </section>

    <section class="stats">
      <div class="stat ${sum.overdue ? 'warn' : ''}"><strong>${sum.overdue}</strong><span>권장 시기 지남</span></div>
      <div class="stat ${sum.due ? 'accent' : ''}"><strong>${sum.due}</strong><span>지금 접종 시기</span></div>
      <div class="stat"><strong>${sum.soon}</strong><span>2주 안에 예정</span></div>
    </section>

    <section class="block">
      <h2>지금 챙겨야 할 접종</h2>
      ${
        now.length
          ? `<ul class="doses">${now.map((i) => doseRow(i)).join('')}</ul>
             ${
               overdue.length >= 2
                 ? `<button type="button" class="btn ghost small" data-action="bulk-overdue">이미 맞은 접종이라면 ${overdue.length}건 한 번에 체크하기</button>`
                 : ''
             }`
          : '<p class="empty">지금 맞아야 할 접종이 없어요. 잘하고 있어요! 🎉</p>'
      }
    </section>

    <section class="block">
      <h2>다가오는 접종</h2>
      ${next.length ? upcomingHTML(next) : '<p class="empty">예정된 접종이 없어요.</p>'}
    </section>

    <p class="disclaimer">
      일정은 질병관리청 국가예방접종 표준일정을 기준으로 계산한 권장 시기예요.
      실제 접종은 아이 상태와 백신 종류에 따라 달라질 수 있으니 소아청소년과 의사와 상담하고,
      <a href="https://nip.kdca.go.kr" target="_blank" rel="noopener">예방접종도우미</a>에서도 확인해 주세요.
    </p>`;
}

function upcomingHTML(items) {
  const groups = new Map();
  for (const item of items) {
    if (!groups.has(item.start)) groups.set(item.start, []);
    groups.get(item.start).push(item);
  }
  return [...groups]
    .map(
      ([date, list]) => `
      <div class="day">
        <p class="day-head"><strong>${formatDate(date, { weekday: true })}</strong>
          <span>${relativeDays(today(), date)}${list.some((i) => i.estimated) ? ' · 예상' : ''}</span></p>
        <ul class="doses">${list.map((i) => doseRow(i)).join('')}</ul>
      </div>`,
    )
    .join('');
}

// ---------- 화면: 접종표 ----------

function renderSchedule() {
  const plan = currentPlan();
  const body =
    scheduleMode === 'stage'
      ? groupByStage(plan)
          .map(({ stage, items }) => {
            const done = items.filter((i) => i.status === 'done').length;
            return `
            <section class="block">
              <h2>${esc(stage.label)} <small>${done}/${items.length}</small></h2>
              <ul class="doses">${items.map((i) => doseRow(i)).join('')}</ul>
            </section>`;
          })
          .join('')
      : groupByVaccine(plan)
          .map(({ vaccine, items }) => {
            const done = items.filter((i) => i.status === 'done').length;
            return `
            <section class="block">
              <h2>${esc(vaccine.name)} <span class="h-sub">${esc(vaccine.disease)}</span> <small>${done}/${items.length}</small></h2>
              ${vaccine.variants ? variantPicker(vaccine) : ''}
              <p class="note">대표 제품: ${esc(productsFor(vaccine, activeChild().options).map((p) => p.name).join(' · '))}</p>
              <ul class="doses">${items.map((i) => doseRow(i)).join('')}</ul>
            </section>`;
          })
          .join('');

  view.innerHTML = `
    <div class="segmented" role="tablist" aria-label="보기 방식">
      <button type="button" role="tab" data-action="mode" data-mode="stage" aria-selected="${scheduleMode === 'stage'}">시기별</button>
      <button type="button" role="tab" data-action="mode" data-mode="vaccine" aria-selected="${scheduleMode === 'vaccine'}">백신별</button>
    </div>
    <p class="hint">동그라미를 누르면 접종 완료로 체크되고, 항목을 누르면 접종일과 메모를 기록할 수 있어요.</p>
    ${body}`;
}

// 로타릭스/로타텍처럼 제품에 따라 일정이 바뀌는 백신의 선택 버튼
function variantPicker(vaccine, { name = `variant-${vaccine.id}` } = {}) {
  const current = activeChild().options[vaccine.option];
  return `
    <div class="segmented variant" role="radiogroup" aria-label="${esc(vaccine.disease)} 백신 종류">
      ${Object.entries(vaccine.variants)
        .map(
          ([key, v]) => `
        <label><input type="radio" name="${name}" value="${key}" data-action="set-option" data-option="${vaccine.option}"
          ${current === key ? 'checked' : ''} /><span>${esc(v.label)}</span></label>`,
        )
        .join('')}
    </div>`;
}

// ---------- 화면: 설정 ----------

function renderSettings() {
  const child = activeChild();
  const optionVaccines = VACCINES.filter((v) => v.variants);
  const notif = typeof Notification === 'undefined' ? 'unsupported' : Notification.permission;
  const notifText = {
    granted: '켜짐 · 앱을 열 때 접종 시기가 된 항목을 알려드려요',
    denied: '차단됨 · 브라우저 설정에서 알림을 허용해 주세요',
    default: '꺼짐',
    unsupported: isIOS() && !isStandalone() ? '홈 화면에 추가한 뒤 켤 수 있어요' : '이 브라우저는 알림을 지원하지 않아요',
  }[notif];

  view.innerHTML = `
    ${
      PREVIEW
        ? `<section class="block"><div class="card row install"><div><strong>테스트 버전이에요</strong>
            <span>이 화면에서는 홈 화면 설치, 알림, 캘린더·백업 파일 저장이 동작하지 않아요. 입력한 기록도 오래 보관되지 않을 수 있어요.</span></div></div></section>`
        : isStandalone()
          ? ''
          : `<section class="block"><h2>설치</h2>${installHTML()}</section>`
    }
    <section class="block">
      <h2>아이 정보</h2>
      <ul class="list card">
        ${state.children
          .map(
            (c) => `
          <li>
            <div><strong>${esc(c.name)}</strong><span>${formatDate(c.birth)} 출생 · ${formatAge(c.birth, today())}</span></div>
            <button type="button" class="btn ghost small" data-action="edit-child" data-child="${c.id}">수정</button>
          </li>`,
          )
          .join('')}
      </ul>
      <button type="button" class="btn ghost" data-action="add-child">+ 아이 추가</button>
    </section>

    <section class="block">
      <h2>${esc(child.name)}의 백신 종류</h2>
      <div class="card form">
        ${optionVaccines
          .map(
            (v) => `
          <label>${esc(v.disease)}
            <select data-action="set-option" data-option="${v.option}">
              ${Object.entries(v.variants)
                .map(([k, variant]) => `<option value="${k}" ${child.options[v.option] === k ? 'selected' : ''}>${esc(variant.label)}</option>`)
                .join('')}
            </select>
          </label>`,
          )
          .join('')}
        <p class="note">병원에서 접종한 백신 제품에 따라 횟수와 간격이 달라져요.</p>
      </div>
    </section>

    <section class="block" data-preview-hide>
      <h2>알림</h2>
      <div class="card row">
        <div><strong>접종 알림</strong><span>${notifText}</span></div>
        ${notif === 'default' ? '<button type="button" class="btn primary small" data-action="enable-notif">켜기</button>' : ''}
      </div>
      <div class="card row">
        <div><strong>캘린더에 일정 추가</strong><span>남은 접종 일정을 휴대폰 캘린더로 가져가면 전날 알림을 받을 수 있어요</span></div>
        <button type="button" class="btn primary small" data-action="export-ics">내보내기</button>
      </div>
    </section>

    <section class="block">
      <h2>데이터</h2>
      <div class="card row" data-preview-hide>
        <div><strong>백업 파일 저장</strong><span>기기를 바꿀 때 백업 파일로 옮길 수 있어요</span></div>
        <button type="button" class="btn ghost small" data-action="export-json">저장</button>
      </div>
      <div class="card row" data-preview-hide>
        <div><strong>백업 불러오기</strong><span>현재 데이터를 백업 파일 내용으로 바꿔요</span></div>
        <label class="btn ghost small">불러오기<input type="file" accept="application/json,.json" data-action="import-json" hidden /></label>
      </div>
      <button type="button" class="btn danger" data-action="reset">모든 데이터 삭제</button>
    </section>

    <p class="disclaimer">
      접종 일정 출처: 질병관리청 국가예방접종 표준일정(영유아·어린이).
      이 앱은 기록과 안내를 돕는 도구이며 의료적 판단을 대신하지 않아요.
    </p>`;
}

// ---------- 다이얼로그 ----------

function openDialog(html) {
  dialog.innerHTML = html;
  if (!dialog.open) dialog.showModal();
}

function closeDialog() {
  if (dialog.open) dialog.close();
}

// 브라우저 기본 confirm() 대신 쓰는 앱 안 확인 창
function ask(message, { ok = '확인', danger = false } = {}) {
  return new Promise((resolve) => {
    openDialog(`
      <div class="sheet">
        <p class="ask">${esc(message).replace(/\n/g, '<br />')}</p>
        <div class="actions">
          <button type="button" class="btn ghost" data-ask="no">취소</button>
          <button type="button" class="btn ${danger ? 'danger solid' : 'primary'}" data-ask="yes">${esc(ok)}</button>
        </div>
      </div>`);
    const done = (answer) => {
      dialog.removeEventListener('close', onClose);
      closeDialog();
      resolve(answer);
    };
    const onClose = () => done(false);
    dialog.addEventListener('close', onClose);
    for (const btn of dialog.querySelectorAll('[data-ask]')) btn.addEventListener('click', () => done(btn.dataset.ask === 'yes'));
  });
}

function productFieldHTML(item, current) {
  const products = productsFor(item.vaccine, activeChild().options);
  // 로타바이러스처럼 종류마다 제품이 하나뿐이면 종류 선택이 곧 제품 선택이다.
  if (item.vaccine.variants && products.length === 1) {
    return `<input type="hidden" name="product" value="${esc(products[0].name)}" />`;
  }
  const known = !current || products.some((p) => p.name === current);
  return `
    <label>백신 제품
      <select name="product" data-action="dose-product">
        <option value="">선택 안 함</option>
        ${products
          .map((p) => `<option value="${esc(p.name)}" ${p.name === current ? 'selected' : ''}>${esc(p.name)}${p.covers ? ' (혼합)' : ''}</option>`)
          .join('')}
        <option value="__custom" ${known ? '' : 'selected'}>직접 입력</option>
      </select>
    </label>
    <input name="productCustom" maxlength="30" placeholder="제품 이름" value="${known ? '' : esc(current)}" ${known ? 'hidden' : ''} aria-label="제품 이름 직접 입력" />`;
}

// 혼합백신(예: 펜탁심)을 고르면 함께 맞은 백신의 다음 차수를 같이 기록할 수 있게 한다.
function comboTargets(item, productName) {
  const product = item.vaccine.products.find((p) => p.name === productName);
  if (!product?.covers) return [];
  const plan = currentPlan();
  return product.covers
    .map((vid) => plan.find((i) => i.vaccine.id === vid && !i.record && i.id !== item.id))
    .filter(Boolean);
}

function comboHTML(item, productName) {
  const targets = comboTargets(item, productName);
  if (!targets.length) return '';
  return `
    <fieldset class="combo">
      <legend>${esc(productName)}은(는) 혼합백신이에요. 함께 기록할까요?</legend>
      ${targets
        .map(
          (t) => `<label class="check-line"><input type="checkbox" name="also" value="${t.id}" checked />
            <span>${esc(t.vaccine.name)} ${t.dose.no}차 <span class="opt">${esc(t.vaccine.disease)}</span></span></label>`,
        )
        .join('')}
    </fieldset>`;
}

function openDose(id, draft = null) {
  const item = currentPlan().find((i) => i.id === id);
  if (!item) return;
  const t = today();
  const defaultDate = draft?.date || item.record?.date || (item.status === 'overdue' ? item.start : t);
  const product = draft?.product ?? item.record?.product ?? '';
  openDialog(`
    <form class="sheet" data-form="dose" data-dose="${item.id}">
      <header>
        <div>
          <p class="sheet-kicker">${esc(item.vaccine.disease)}</p>
          <h2>${esc(item.vaccine.name)} ${item.dose.no}차${item.total > 1 ? ` <small>총 ${item.total}회</small>` : ''}</h2>
        </div>
        ${statusChip(item)}
      </header>
      <dl class="facts">
        <div><dt>권장 시기</dt><dd>${esc(item.dose.when)}</dd></div>
        <div><dt>${item.estimated ? '예상 날짜' : '권장 날짜'}</dt><dd>${
          item.lastDay ? `${formatDate(item.start)} ~ ${formatDate(item.lastDay)}` : `${formatDate(item.start)} 이후`
        }</dd></div>
      </dl>
      ${item.estimated ? `<p class="note">이전 차수를 맞으면 그 날짜를 기준으로 다시 계산돼요.</p>` : ''}
      ${item.vaccine.note ? `<p class="note">${esc(item.vaccine.note)}</p>` : ''}
      ${item.vaccine.variants ? `<div class="field"><span class="field-label">백신 종류</span>${variantPicker(item.vaccine, { name: 'variant' })}</div>` : ''}
      ${productFieldHTML(item, product)}
      <div data-combo>${item.record ? '' : comboHTML(item, product)}</div>
      <label>접종일
        <input type="date" name="date" required max="${t}" value="${defaultDate}" />
      </label>
      <label><span>메모 <span class="opt">(병원, 접종 후 반응 등)</span></span>
        <input name="memo" maxlength="60" value="${esc(draft?.memo ?? item.record?.memo ?? '')}" placeholder="예) 우리소아과, 미열 있었음" />
      </label>
      <p class="warn-text" data-early hidden>권장 시기보다 이른 날짜예요. 날짜를 한 번 더 확인해 주세요.</p>
      <div class="actions">
        ${item.record ? '<button type="button" class="btn danger" data-action="clear-dose">기록 삭제</button>' : '<button type="button" class="btn ghost" data-action="close-dialog">닫기</button>'}
        <button class="btn primary">${item.record ? '수정 저장' : '접종 완료로 기록'}</button>
      </div>
    </form>`);
  const input = $('input[name="date"]', dialog);
  const warn = $('[data-early]', dialog);
  const check = () => (warn.hidden = !(input.value && compare(input.value, item.start) < 0));
  input.addEventListener('input', check);
  check();
}

// ---------- 동작 ----------

function setRecord(id, record) {
  const records = recordsOf(activeChild());
  if (record) records[id] = record;
  else delete records[id];
  persist();
  render();
}

function quickToggle(id) {
  const item = currentPlan().find((i) => i.id === id);
  if (!item) return;
  if (item.record) {
    setRecord(id, null);
    toast(`${item.vaccine.name} ${item.dose.no}차 기록을 취소했어요`);
    return;
  }
  const t = today();
  // 권장 기간이 이미 지난 항목은 보통 예전에 맞은 것을 뒤늦게 체크하는 경우라 권장 시작일로 기록한다.
  const date = item.status === 'overdue' ? item.start : t;
  setRecord(id, { date, memo: '' });
  toast(
    date === t
      ? `${item.vaccine.name} ${item.dose.no}차 접종 완료! 오늘 날짜로 기록했어요`
      : `${formatDate(date)}(권장일)로 기록했어요. 항목을 눌러 날짜를 고칠 수 있어요`,
  );
}

async function bulkOverdue() {
  const overdue = currentPlan().filter((i) => i.status === 'overdue');
  if (!overdue.length) return;
  const msg = `권장 시기가 지난 ${overdue.length}건을 모두 권장일에 맞은 것으로 기록할까요?\n나중에 항목별로 날짜를 고칠 수 있어요.`;
  if (!(await ask(msg, { ok: `${overdue.length}건 기록` }))) return;
  const records = recordsOf(activeChild());
  for (const item of overdue) records[item.id] = { date: item.start, memo: '' };
  persist();
  render();
  toast(`${overdue.length}건을 기록했어요`);
}

function saveChild(form) {
  const data = new FormData(form);
  const name = String(data.get('name')).trim();
  const birth = String(data.get('birth'));
  if (!name || !isValidDate(birth)) return toast('이름과 생년월일을 확인해 주세요');
  if (compare(birth, today()) > 0) return toast('생년월일은 오늘 이후일 수 없어요');
  const id = form.dataset.child;
  const existing = state.children.find((c) => c.id === id);
  if (existing) {
    Object.assign(existing, { name, birth });
  } else {
    const child = normalize({ children: [{ id: newId(), name, birth }] }).children[0];
    state.children.push(child);
    state.records[child.id] = {};
    state.activeChildId = child.id;
  }
  persist();
  closeDialog();
  if (!existing) currentView = 'home';
  render();
  toast(existing ? '저장했어요' : `${name}의 접종 일정을 만들었어요`);
}

async function deleteChild(id) {
  const child = state.children.find((c) => c.id === id);
  if (!child || !(await ask(`${child.name}의 정보와 접종 기록을 모두 삭제할까요?`, { ok: '삭제', danger: true }))) return;
  state.children = state.children.filter((c) => c.id !== id);
  delete state.records[id];
  state = normalize(state);
  persist();
  closeDialog();
  render();
}

function download(filename, content, type) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = Object.assign(document.createElement('a'), { href: url, download: filename });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function exportICS() {
  const child = activeChild();
  download(`vaccination-schedule.ics`, buildICS(child, currentPlan()), 'text/calendar;charset=utf-8');
  toast('캘린더 파일을 저장했어요. 파일을 열어 캘린더에 추가하세요');
}

function exportJSON() {
  download(`vaccination-backup-${today()}.json`, JSON.stringify(state, null, 2), 'application/json');
}

async function importJSON(file) {
  try {
    const next = normalize(JSON.parse(await file.text()));
    if (!next.children.length) throw new Error('empty');
    if (!(await ask(`백업에서 아이 ${next.children.length}명의 기록을 불러올까요?\n현재 데이터는 대체돼요.`, { ok: '불러오기' }))) return;
    state = next;
    persist();
    render();
    toast('백업을 불러왔어요');
  } catch {
    toast('올바른 백업 파일이 아니에요');
  }
}

async function enableNotifications() {
  const result = await Notification.requestPermission();
  if (result === 'granted') {
    state.lastNotified = null;
    await notifyIfNeeded();
  }
  render();
}

// 하루에 한 번, 앱을 열 때 접종 시기가 된 항목을 알림으로 보여준다.
async function notifyIfNeeded() {
  if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;
  const t = today();
  if (state.lastNotified === t) return;
  const lines = [];
  for (const child of state.children) {
    const due = reminders(buildPlan(child, recordsOf(child), t), t);
    if (due.length) lines.push(`${child.name}: ${due.map((i) => `${i.vaccine.name} ${i.dose.no}차`).join(', ')}`);
  }
  state.lastNotified = t;
  persist();
  if (!lines.length) return;
  const title = '예방접종 챙길 시간이에요 💉';
  const options = { body: lines.join('\n'), icon: 'icons/icon-192.png', tag: 'vaccination-reminder' };
  try {
    const reg = await navigator.serviceWorker?.getRegistration();
    if (reg) await reg.showNotification(title, options);
    else new Notification(title, options);
  } catch {
    /* 알림을 띄울 수 없는 환경이면 조용히 넘어간다 */
  }
}

async function resetAll() {
  if (!(await ask('모든 아이 정보와 접종 기록을 삭제할까요?\n되돌릴 수 없어요.', { ok: '모두 삭제', danger: true }))) return;
  state = normalize({});
  persist();
  currentView = 'home';
  render();
}

// ---------- 렌더링 / 이벤트 ----------

function render() {
  const child = activeChild();
  const switcher = childSelect.parentElement;
  switcher.hidden = state.children.length < 2;
  childSelect.innerHTML = state.children
    .map((c) => `<option value="${c.id}" ${c.id === state.activeChildId ? 'selected' : ''}>${esc(c.name)}</option>`)
    .join('');
  document.body.classList.toggle('no-child', !child);
  document.body.classList.toggle('preview', PREVIEW);

  if (!child) return renderWelcome();
  for (const btn of document.querySelectorAll('.tabbar button')) {
    if (btn.dataset.view === currentView) btn.setAttribute('aria-current', 'page');
    else btn.removeAttribute('aria-current');
  }
  ({ home: renderHome, schedule: renderSchedule, settings: renderSettings })[currentView]();
}

document.addEventListener('click', (e) => {
  const tab = e.target.closest('.tabbar button');
  if (tab) {
    currentView = tab.dataset.view;
    render();
    window.scrollTo(0, 0);
    return;
  }
  const el = e.target.closest('[data-action]');
  if (!el || el.tagName === 'SELECT' || el.tagName === 'INPUT') return;
  const { action } = el.dataset;
  if (action === 'quick-toggle') quickToggle(el.dataset.dose);
  else if (action === 'open-dose') openDose(el.dataset.dose);
  else if (action === 'close-dialog') closeDialog();
  else if (action === 'clear-dose') {
    setRecord($('form', dialog).dataset.dose, null);
    closeDialog();
    toast('기록을 삭제했어요');
  } else if (action === 'mode') {
    scheduleMode = el.dataset.mode;
    render();
  } else if (action === 'bulk-overdue') bulkOverdue();
  else if (action === 'add-child') openDialog(`<div class="sheet"><h2>아이 추가</h2>${childFormHTML()}</div>`);
  else if (action === 'edit-child') {
    const child = state.children.find((c) => c.id === el.dataset.child);
    openDialog(`<div class="sheet"><h2>아이 정보 수정</h2>${childFormHTML(child)}
      <button type="button" class="btn danger" data-action="delete-child" data-child="${child.id}">이 아이 삭제</button></div>`);
  } else if (action === 'delete-child') deleteChild(el.dataset.child);
  else if (action === 'enable-notif') enableNotifications();
  else if (action === 'install') install();
  else if (action === 'dismiss-install') {
    state.installDismissed = true;
    persist();
    render();
  }
  else if (action === 'export-ics') exportICS();
  else if (action === 'export-json') exportJSON();
  else if (action === 'reset') resetAll();
});

document.addEventListener('change', (e) => {
  const el = e.target;
  if (el === childSelect) {
    state.activeChildId = el.value;
    persist();
    render();
  } else if (el.dataset.action === 'set-option') {
    activeChild().options[el.dataset.option] = el.value;
    persist();
    render();
    const form = el.closest('form[data-form="dose"]');
    if (form) {
      // 다이얼로그 안에서 바꾼 경우: 입력 중인 내용은 두고 새 일정으로 다시 그린다.
      const id = form.dataset.dose;
      if (currentPlan().some((i) => i.id === id)) openDose(id, { date: form.date.value, memo: form.memo.value, product: '' });
      else closeDialog();
    }
    const label = el.tagName === 'SELECT' ? el.selectedOptions[0].textContent : el.nextElementSibling.textContent;
    toast(`${label}(으)로 바꿨어요`);
  } else if (el.dataset.action === 'dose-product') {
    const form = el.closest('form');
    const custom = form.productCustom;
    custom.hidden = el.value !== '__custom';
    if (!custom.hidden) custom.focus();
    const item = currentPlan().find((i) => i.id === form.dataset.dose);
    if (!item.record) $('[data-combo]', form).innerHTML = comboHTML(item, el.value);
  } else if (el.dataset.action === 'import-json' && el.files[0]) {
    importJSON(el.files[0]);
    el.value = '';
  }
});

document.addEventListener('submit', (e) => {
  const form = e.target;
  e.preventDefault();
  if (form.dataset.form === 'child') saveChild(form);
  else if (form.dataset.form === 'dose') {
    const data = new FormData(form);
    const date = String(data.get('date'));
    if (!isValidDate(date) || compare(date, today()) > 0) return toast('접종일을 확인해 주세요');
    const records = recordsOf(activeChild());
    const had = Boolean(records[form.dataset.dose]);
    let product = String(data.get('product') ?? '');
    if (product === '__custom') product = String(data.get('productCustom') ?? '').trim();
    const record = { date, memo: String(data.get('memo')).trim(), product };
    const also = data.getAll('also').filter((id) => !records[id]);
    for (const id of also) records[id] = { ...record };
    setRecord(form.dataset.dose, record);
    closeDialog();
    const names = also.map((id) => currentPlan().find((i) => i.id === id)).map((i) => `${i.vaccine.name} ${i.dose.no}차`);
    toast(had ? '수정했어요' : names.length ? `${names.join(', ')}도 함께 기록했어요 👏` : '접종 완료로 기록했어요 👏');
  }
});

// 배경을 누르면 닫힘
dialog.addEventListener('click', (e) => {
  if (e.target === dialog) closeDialog();
});

// 자정을 넘겨 다시 열었을 때 날짜 기준을 갱신
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    render();
    notifyIfNeeded();
  }
});

render();
notifyIfNeeded();

// 저장 공간이 부족해도 브라우저가 접종 기록을 지우지 않도록 요청
navigator.storage?.persist?.().catch(() => {});

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
