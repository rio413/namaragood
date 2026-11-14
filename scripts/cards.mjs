// Step 6 (after the site is built): draw a share card for every place, in every
// language and size, into dist/cards/<lang>/<slug>-<size>.png.
//   post 1080×1440 (Instagram / RedNote)   story 1080×1920   square 1080×1080
//   og 1200×630 (the preview shown when a link is pasted into LINE, WhatsApp…)
// Cards are drawn by a headless browser from the HTML below, so they use the
// same fonts and outlined lettering as the site. Each card is cached by a hash
// of its content, so only new or changed places are redrawn.
import { createServer } from 'node:http';
import { readFileSync, existsSync, mkdirSync, copyFileSync, readdirSync, unlinkSync } from 'node:fs';
import { extname } from 'node:path';
import { chromium } from 'playwright';
import { p, readJson, sha, log, fail } from './lib.mjs';
import { UI, LANGS } from '../src/i18n/ui.js';
import { makeTag } from '../src/i18n/tags.js';
import { drawingFor, svg } from '../src/lib/drawings.js';
import { cardQuote, CARD_SIZES } from '../src/lib/cardtext.js';

const TEMPLATE_VERSION = 'v1';
const data = readJson(p('data/places.json'));
if (!data) fail('no data/places.json');
if (!existsSync(p('dist'))) fail('build the site first (npm run build)');
const tag = makeTag(readJson(p('data/cache/tags.json'), {}));
const host = new URL(process.env.SITE_URL || 'https://namaragood.pages.dev').host.replace(/^www\./, '');
const CACHE = p('.cache/cards');
mkdirSync(CACHE, { recursive: true });

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const num = (n) => '#' + String(n).padStart(2, '0');
const FONT_CSS = {
  en: [], vi: [],
  ko: ['@fontsource/noto-sans-kr/700.css', '@fontsource/noto-sans-kr/900.css'],
  zh: ['@fontsource/noto-sans-sc/700.css', '@fontsource/noto-sans-sc/900.css'],
  th: ['@fontsource/noto-sans-thai/700.css', '@fontsource/noto-sans-thai/900.css'],
};
const FAMILY = { en: '', vi: '', ko: "'Noto Sans KR',", zh: "'Noto Sans SC',", th: "'Noto Sans Thai'," };

function cardHTML(pl, lang, size) {
  const u = UI[lang];
  const { w: W, h: H, scale = 1 } = CARD_SIZES[size];
  const w = Math.round(W / scale), h = Math.round(H / scale);
  const what = (pl.specs.length ? pl.specs : pl.types).slice(0, 2).map(t => tag(t, lang));
  const meta = [...what, tag(pl.area, lang)].filter(Boolean).join(' · ');
  const quote = cardQuote(pl, lang);
  const ja = pl.nameJa && pl.nameJa !== pl.name ? pl.nameJa : '';
  const css = ['@fontsource-variable/archivo/wdth.css', '@fontsource/noto-sans-jp/700.css', '@fontsource/noto-sans-jp/900.css', ...FONT_CSS[lang]]
    .map(f => `<link rel="stylesheet" href="/node_modules/${f}">`).join('');
  const L = LANGS.find(l => l.code === lang);
  return `<!doctype html><html lang="${L.html}"><head><meta charset="utf-8">${css}<style>
:root{--m:#E8C15A;--k:#0A0A0A;--p:#EFEDE7;--d:'Archivo Variable',${FAMILY[lang]}'Noto Sans JP',sans-serif}
*{box-sizing:border-box;margin:0}
html,body{width:${w}px;height:${h}px;overflow:hidden}
body{background:var(--k);color:var(--m);font-family:var(--d);-webkit-font-smoothing:antialiased}
.c{width:100%;height:100%;padding:${size === 'og' ? '48px 56px' : '64px 72px'};display:flex;flex-direction:column;gap:${size === 'story' ? 40 : 28}px}
.top{display:flex;justify-content:space-between;align-items:flex-start}
.u{font-stretch:125%;font-weight:900;text-transform:uppercase;line-height:.92}
.ol{color:transparent;-webkit-text-stroke:2px var(--m)}
.city{font-size:${size === 'og' ? 26 : 34}px}
.no{font-size:${size === 'og' ? 64 : 92}px;-webkit-text-stroke-width:3px}
.art{flex:1 1 0;min-height:0;display:flex;align-items:center;justify-content:center}
.art svg{height:100%;max-width:100%;width:auto;stroke:var(--m);stroke-width:2.2}
.art svg .f{fill:none}
.name{font-size:120px;overflow-wrap:normal}
.ja{font-family:'Noto Sans JP',sans-serif;font-weight:700;font-size:${size === 'og' ? 30 : 40}px;margin-top:14px}
.meta{font-stretch:112%;font-weight:800;font-size:${size === 'og' ? 24 : 30}px;text-transform:uppercase;letter-spacing:.02em}
.q{margin-top:44px;background:var(--p);color:var(--k);padding:${size === 'og' ? '22px 26px' : '30px 36px'};font-weight:800;font-size:56px;line-height:1.22;position:relative}
.q::before{content:'\\201C';position:absolute;left:-6px;top:-58px;font-size:150px;font-weight:900;color:var(--m);line-height:1}
.foot{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;border-top:3px solid var(--m);padding-top:24px}
.logo{flex:none;font-size:${size === 'og' ? 34 : size === 'story' ? 32 : 40}px;white-space:nowrap}
.logo .ol{-webkit-text-stroke-width:1.6px}
.cta{text-align:right;text-wrap:balance;min-width:0;font-weight:700;font-size:${size === 'og' ? 20 : 26}px;line-height:1.3}
.cta b{display:block;font-stretch:112%;font-weight:800;font-size:${size === 'og' ? 22 : size === 'story' ? 24 : 28}px;text-transform:lowercase}
.row{display:flex;gap:40px;flex:1;min-height:0}.row .left{flex:1.3;display:flex;flex-direction:column;justify-content:center;gap:20px;min-width:0}
</style></head><body><div class="c">
${size === 'og' ? `
  <div class="top"><span class="u ol city">Sapporo</span><span class="u ol no">${num(pl.num)}</span></div>
  <div class="row">
    <div class="left">
      <div><h1 class="u name" data-fit="2" data-max="96">${esc(pl.name)}</h1>${ja ? `<p class="ja" lang="ja">${esc(ja)}</p>` : ''}</div>
      ${quote ? `<p class="q" data-fitq data-maxq="38" data-h="150" style="font-size:38px">${esc(quote)}</p>` : ''}
    </div>
    <div class="art" style="flex:1">${svg(drawingFor(pl))}</div>
  </div>
  <div class="foot"><span class="u logo">Namara <span class="ol">Good.</span></span><span class="cta">${esc(u.cardCta)}<b>${esc(host)}</b></span></div>
` : `
  <div class="top"><span class="u ol city">Sapporo</span><span class="u ol no">${num(pl.num)}</span></div>
  <div class="art">${svg(drawingFor(pl))}</div>
  <div><h1 class="u name" data-fit="${size === 'square' ? 2 : 3}" data-max="${size === 'story' ? 132 : size === 'square' ? 96 : 116}">${esc(pl.name)}</h1>${ja ? `<p class="ja" lang="ja">${esc(ja)}</p>` : ''}</div>
  ${meta ? `<p class="meta">${esc(meta)}</p>` : ''}
  ${quote ? `<p class="q" data-fitq data-maxq="${size === 'story' ? 64 : size === 'square' ? 44 : 54}" data-h="${size === 'story' ? 420 : size === 'square' ? 190 : 300}">${esc(quote)}</p>` : ''}
  <div class="foot"><span class="u logo">Namara <span class="ol">Good.</span></span><span class="cta">${esc(u.cardCta)}<b>${esc(host)}</b></span></div>
`}
</div><script>
(async () => {
  await document.fonts.ready;
  // Shrink the name until it fits in N lines, and the quote until it fits its box.
  for (const el of document.querySelectorAll('[data-fit]')) {
    let fs = +el.dataset.max; el.style.fontSize = fs + 'px';
    const lh = () => parseFloat(getComputedStyle(el).lineHeight);
    while (fs > 40 && (el.scrollHeight > lh() * +el.dataset.fit + 2 || el.scrollWidth > el.clientWidth)) { fs -= 2; el.style.fontSize = fs + 'px'; }
  }
  for (const el of document.querySelectorAll('[data-fitq]')) {
    let fs = +el.dataset.maxq; el.style.fontSize = fs + 'px';
    while (fs > 22 && el.offsetHeight > +el.dataset.h) { fs -= 2; el.style.fontSize = fs + 'px'; }
  }
  await document.fonts.ready;
  window.__ready = true;
})();
</script></body></html>`;
}

// Tiny local server: card pages from memory, fonts from node_modules.
const pages = new Map();
const TYPES = { '.css': 'text/css', '.woff2': 'font/woff2', '.woff': 'font/woff', '.html': 'text/html' };
const server = createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  if (pages.has(url)) { res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); return res.end(pages.get(url)); }
  if (url.startsWith('/node_modules/')) {
    const file = p('.' + url);
    if (existsSync(file)) { res.writeHead(200, { 'content-type': TYPES[extname(file)] || 'application/octet-stream' }); return res.end(readFileSync(file)); }
  }
  res.writeHead(404); res.end();
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

const jobs = [];
for (const pl of data.places) for (const { code } of LANGS) for (const size of Object.keys(CARD_SIZES)) {
  const html = cardHTML(pl, code, size);
  const key = sha(TEMPLATE_VERSION + html);
  jobs.push({ out: p('dist/cards', code, `${pl.slug}-${size}.png`), cached: p(CACHE, `${key}.png`), html, size, key });
}
const todo = jobs.filter(j => !existsSync(j.cached));
log(`cards: ${jobs.length} total, ${todo.length} to draw`);

if (todo.length) {
  const browser = await chromium.launch();
  const ctxs = {};
  const ctxFor = async (scale) => (ctxs[scale] ||= await browser.newContext({ deviceScaleFactor: scale }));
  let i = 0;
  const worker = async () => {
    const pagesBy = {};
    while (i < todo.length) {
      const j = todo[i++];
      const { w, h, scale = 1 } = CARD_SIZES[j.size];
      const page = pagesBy[scale] ||= await (await ctxFor(scale)).newPage();
      await page.setViewportSize({ width: Math.round(w / scale), height: Math.round(h / scale) });
      pages.set(`/c/${j.key}.html`, j.html);
      await page.goto(`${base}/c/${j.key}.html`);
      await page.waitForFunction(() => window.__ready === true, null, { timeout: 30000 });
      await page.screenshot({ path: j.cached, type: 'png' });
      pages.delete(`/c/${j.key}.html`);
    }
  };
  await Promise.all([worker(), worker(), worker(), worker()]);
  await browser.close();
}
server.close();

for (const j of jobs) { mkdirSync(p('dist/cards', j.out.split('/').at(-2)), { recursive: true }); copyFileSync(j.cached, j.out); }
// Forget cards that no longer match any place (old wording, removed places).
const keep = new Set(jobs.map(j => `${j.key}.png`));
for (const f of readdirSync(CACHE)) if (!keep.has(f)) unlinkSync(p(CACHE, f));
log(`cards: written to dist/cards (${readdirSync(p('dist/cards')).length} languages)`);
