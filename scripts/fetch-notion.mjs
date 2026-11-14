// Step 1: read the Notion "Places" database and write data/notion.json.
// Only Status = Published is included, unless INCLUDE_DRAFTS=1 (preview builds).
import { writeFileSync, mkdirSync } from 'node:fs';
import { p, writeJson, log, fail } from './lib.mjs';

const TOKEN = process.env.NOTION_TOKEN;
const DB = process.env.NOTION_DATABASE_ID;
const INCLUDE_DRAFTS = process.env.INCLUDE_DRAFTS === '1';
if (!TOKEN || !DB) fail('NOTION_TOKEN and NOTION_DATABASE_ID must be set.');

const API = 'https://api.notion.com/v1';
const HEADERS = {
  Authorization: `Bearer ${TOKEN}`,
  'Notion-Version': '2022-06-28',
  'Content-Type': 'application/json',
};

async function notion(path, body) {
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch(API + path, { method: body ? 'POST' : 'GET', headers: HEADERS, body: body && JSON.stringify(body) });
    if (res.status === 429) { await new Promise(r => setTimeout(r, 1000 * (attempt + 1))); continue; }
    if (!res.ok) fail(`Notion ${path} → ${res.status} ${await res.text()}`);
    return res.json();
  }
  fail('Notion rate limit kept hitting; try again later.');
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Rich text → array of paragraph HTML strings (bold, italic, links kept; nothing else).
function richToParas(rich = []) {
  let html = '';
  for (const r of rich) {
    let t = esc(r.plain_text || '');
    const a = r.annotations || {};
    if (a.bold) t = `<b>${t}</b>`;
    if (a.italic) t = `<i>${t}</i>`;
    if (r.href) t = `<a href="${esc(r.href)}" rel="noopener">${t}</a>`;
    html += t;
  }
  return html
    .split(/\n\s*\n/)
    .map(s => s.trim().replace(/\n/g, '<br>'))
    .filter(Boolean);
}
const plain = (rich = []) => rich.map(r => r.plain_text || '').join('').trim();

function prop(page, name) { return page.properties?.[name]; }
const sel = (pr) => pr?.select?.name ?? null;
const multi = (pr) => (pr?.multi_select ?? []).map(o => o.name);

async function downloadPhotos(page) {
  const files = prop(page, 'Photos')?.files ?? [];
  const out = [];
  mkdirSync(p('public/photos'), { recursive: true });
  let i = 0;
  for (const f of files) {
    const url = f.file?.url || f.external?.url;
    if (!url) continue;
    const ext = (new URL(url).pathname.match(/\.(jpe?g|png|webp|gif|avif)$/i)?.[1] || 'jpg').toLowerCase();
    const name = `${page.id.replace(/-/g, '')}-${i++}.${ext}`;
    const res = await fetch(url);
    if (!res.ok) { log(`photo skipped (${res.status}) for ${page.id}`); continue; }
    writeFileSync(p('public/photos', name), Buffer.from(await res.arrayBuffer()));
    out.push(`/photos/${name}`);
  }
  return out;
}

const statuses = INCLUDE_DRAFTS ? ['Published', 'Draft'] : ['Published'];
const filter = { or: statuses.map(s => ({ property: 'Status', select: { equals: s } })) };

const pages = [];
let cursor;
do {
  const res = await notion(`/databases/${DB}/query`, { filter, page_size: 100, start_cursor: cursor });
  pages.push(...res.results);
  cursor = res.has_more ? res.next_cursor : undefined;
} while (cursor);

const places = [];
for (const pg of pages) {
  const name = plain(prop(pg, 'Name')?.title);
  if (!name) continue;
  places.push({
    id: pg.id,
    created: pg.created_time,
    edited: pg.last_edited_time,
    status: sel(prop(pg, 'Status')),
    name,
    nameJa: plain(prop(pg, 'Name (JA)')?.rich_text),
    types: multi(prop(pg, 'Type')),
    specs: multi(prop(pg, 'Speciality')),
    dietary: multi(prop(pg, 'Dietary')),
    good: multi(prop(pg, 'Good for')),
    prac: multi(prop(pg, 'Practical')),
    price: sel(prop(pg, 'Price')),
    city: sel(prop(pg, 'City')) || 'Sapporo',
    area: sel(prop(pg, 'Area')),
    reservation: sel(prop(pg, 'Reservation')),
    mapsUrl: prop(pg, 'Maps link')?.url || null,
    // Optional manual pin fix: if you type Lat/Lng in Notion they win over Google's lookup.
    manualLat: prop(pg, 'Lat')?.number ?? null,
    manualLng: prop(pg, 'Lng')?.number ?? null,
    note: richToParas(prop(pg, 'Note')?.rich_text),
    tip: richToParas(prop(pg, 'Tip')?.rich_text),
    featured: !!prop(pg, 'Featured')?.checkbox,
    lastChecked: prop(pg, 'Last checked')?.date?.start || null,
    drawing: sel(prop(pg, 'Drawing')) ?? (prop(pg, 'Drawing')?.number ?? null),
    photos: await downloadPhotos(pg),
  });
}

writeJson(p('data/notion.json'), { fetchedAt: new Date().toISOString(), places });
log(`fetched ${places.length} place(s) from Notion (${statuses.join(' + ')})`);
