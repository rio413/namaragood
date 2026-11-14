// Step 3: translate Note and Tip into ko / zh (Simplified) / th / vi.
// Every text is cached by a hash of its English wording, so only new or edited
// notes cost an API call. The cache (data/cache/translations.json) is committed,
// which also means you can read and hand-correct any translation in GitHub.
import { readFileSync } from 'node:fs';
import { p, readJson, writeJson, sha, log, TARGET_LANGS } from './lib.mjs';

export const PROMPT_VERSION = 'v1';
const KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = process.env.TRANSLATE_MODEL || 'claude-sonnet-5-5';
const SOFTEN = process.env.SOFTEN_SWEARING !== '0';

// Chinese text should use full-width punctuation next to Chinese characters.
export const zhPunct = (t) => t.replace(/([\u3400-\u9fff」）])\s*([,!?:;])\s*/g, (_, a, b) => a + { ',': '，', '!': '！', '?': '？', ':': '：', ';': '；' }[b]);

export const hashOf = (paras) => sha(PROMPT_VERSION + '\u0000' + JSON.stringify(paras));

const SYSTEM = `You translate short, personal restaurant and bar notes for NAMARA GOOD, a guide to eating and drinking in Sapporo written by a local man who grew up in Hokkaido. His English is casual, British, funny and opinionated. Readers are tourists.

Translate into Korean (ko), Simplified Chinese (zh), Thai (th) and Vietnamese (vi).

Rules:
- Write it the way a local friend would say it in each language. Natural, not literal. Keep his humour, warnings and opinions intact; do not add or remove information.
- Korean: casual polite 해요체. Chinese: Simplified characters, full-width Chinese punctuation (，。！？：；), conversational, like a trusted friend's RedNote post (no emoji). Thai: friendly and casual, the writer uses ผม, use ครับ sparingly. Vietnamese: friendly, the writer is "mình", the reader is "bạn".
- British slang (sarnies, innit, bloody, a good shout) becomes a natural equivalent, never a literal rendering.
- ${SOFTEN ? 'Strong swear words become a mild, natural expression with the same attitude.' : 'Keep swear words at a similar strength.'}
- Shop names stay as written in the English (romaji). In Chinese you may add the Japanese name in 「」 the first time if it helps. Area names: Susukino = 스스키노 / 薄野 / ซูซูกิโนะ / Susukino; Odori = 오도리 / 大通 / โอโดริ / Odori. Jingisukan = 징기스칸 / 成吉思汗烤肉 / จิงกิสข่าน / jingisukan.
- Keep HTML tags (<b>, <i>, <a ...>, <br>) exactly as they are, around the matching words.
- The input is a JSON array of paragraphs. Return the same number of paragraphs, in the same order.

Reply with JSON only, no commentary: {"ko":[...],"zh":[...],"th":[...],"vi":[...]}`;

async function callClaude(paras, extra = '') {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': KEY, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 8000,
      system: extra ? `${SYSTEM}\n\n${extra}` : SYSTEM,
      messages: [{ role: 'user', content: JSON.stringify(paras) }],
    }),
  });
  if (!res.ok) throw new Error(`Anthropic ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const text = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('');
  const json = JSON.parse(text.replace(/^```(?:json)?\s*|\s*```$/g, '').trim());
  for (const l of TARGET_LANGS) {
    if (!Array.isArray(json[l]) || json[l].length !== paras.length) throw new Error(`bad ${l} output (paragraph count)`);
  }
  json.zh = json.zh.map(zhPunct);
  return json;
}

const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  const notion = readJson(p('data/notion.json'));
  if (!notion) { log('no data/notion.json, skipping translation'); process.exit(0); }
  const cache = readJson(p('data/cache/translations.json'), {});
  const needed = new Map();
  for (const pl of notion.places) for (const paras of [pl.note, pl.tip, pl.quote]) {
    if (paras?.length) { const h = hashOf(paras); if (!cache[h]) needed.set(h, { paras, name: pl.name }); }
  }
  if (needed.size && !KEY) log(`no ANTHROPIC_API_KEY: ${needed.size} text(s) will show in English only`);
  let done = 0;
  if (KEY) for (const [h, { paras, name }] of needed) {
    let out;
    for (let attempt = 1; attempt <= 2 && !out; attempt++) {
      try { out = await callClaude(paras); }
      catch (e) { log(`translate "${name}" attempt ${attempt} failed: ${e.message}`); }
    }
    if (out) { cache[h] = { en: paras, ...out, model: MODEL, at: new Date().toISOString() }; done++; }
  }
  writeJson(p('data/cache/translations.json'), cache);
  log(`translations: ${done} new, ${Object.keys(cache).length} cached`);

  // New Notion options (tags) that src/i18n/tags.js doesn't know yet.
  const known = new Set([...readFileSync(p('src/i18n/tags.js'), 'utf8').matchAll(/^\s*'?([^':\n]+?)'?: \[/gm)].map(m => m[1]));
  const tagCache = readJson(p('data/cache/tags.json'), {});
  const fields = ['types', 'specs', 'dietary', 'good', 'prac', 'area'];
  const newTags = [...new Set(notion.places.flatMap(pl => fields.flatMap(f => [].concat(pl[f] || []))))]
    .filter(t => t && !known.has(t) && !tagCache[t]);
  if (newTags.length && KEY) {
    try {
      const out = await callClaude(newTags.map(t => `<span>${t}</span>`), 'These are short filter labels on a food and drink guide (dish types, drinks, areas of Sapporo, practical notes). Keep each as a short label inside its <span>.');
      newTags.forEach((t, i) => {
        tagCache[t] = Object.fromEntries(TARGET_LANGS.map(l => [l, out[l][i].replace(/<\/?span>/g, '').trim()]));
      });
      writeJson(p('data/cache/tags.json'), tagCache);
      log(`tags: translated ${newTags.length} new label(s)`);
    } catch (e) { log(`tag translation failed: ${e.message}`); }
  }
}
