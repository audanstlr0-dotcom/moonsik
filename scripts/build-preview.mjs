// claude.ai 아티팩트(휴대폰 테스트용 링크)에 올릴 한 파일짜리 미리보기를 만든다.
// 사용법: node scripts/build-preview.mjs → dist/preview.html
import { readFile, writeFile, mkdir } from 'node:fs/promises';

const root = new URL('..', import.meta.url);
const read = (p) => readFile(new URL(p, root), 'utf8');

// 의존 순서대로 모듈을 이어 붙이고 import/export 문을 걷어낸다 (한 <script type="module"> 스코프).
const modules = ['js/schedule.js', 'js/dates.js', 'js/planner.js', 'js/ics.js', 'js/store.js', 'js/app.js'];
const js = (await Promise.all(modules.map(read)))
  .map((src) => src.replace(/^import [\s\S]*?;\n/gm, '').replace(/^export /gm, ''))
  .join('\n');

let css = await read('css/style.css');
// 아티팩트는 화면 위아래 안전 영역을 이미 비워 두므로 상단 바에서 중복으로 더하지 않는다.
css = css
  .replace('padding: calc(10px + env(safe-area-inset-top)) 16px 10px;', 'padding: 10px 16px;')
  .replace(/(\.topbar \{\n  position: sticky;\n  )top: 0;/, '$1top: env(safe-area-inset-top, 0px);');
// 뷰어에서 다크 모드를 직접 고른 경우(data-theme)에도 다크 팔레트를 쓴다.
const dark = css.match(/:root:not\(\[data-theme='light'\]\) \{([\s\S]*?)\n  \}/)[1];
css += `\n:root[data-theme='dark'] {${dark.replace(/\n    /g, '\n  ')}\n}\n`;

const html = await read('index.html');
const body = html
  .slice(html.indexOf('<body>') + 6, html.indexOf('</body>'))
  .replace(/<script type="module" src="js\/app.js"><\/script>/, '');
const icon = `data:image/svg+xml;base64,${Buffer.from(await read('icons/icon.svg')).toString('base64')}`;

const out = `<title>아기 예방접종 수첩</title>
<style>
${css}
</style>
${body.replaceAll('src="icons/icon.svg"', `src="${icon}"`)}
<script type="module">
globalThis.VACCINATION_PREVIEW = true;
${js}
</script>
`;
await mkdir(new URL('dist/', root), { recursive: true });
await writeFile(new URL('dist/preview.html', root), out);
console.log(`dist/preview.html (${(out.length / 1024).toFixed(0)} KB)`);
