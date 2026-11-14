// Step 4: merge Notion data, Google lookups and translations into
// data/places.json, which the site reads at build time.
// Each place keeps a permanent entry number (#01, #02 … in the order you added
// them) and a permanent web address, stored in data/cache/registry.json, so
// renaming a place in Notion never breaks links people have shared.
import { p, readJson, writeJson, slugify, log, fail, TARGET_LANGS } from './lib.mjs';
import { hashOf } from './translate.mjs';

const sample = process.argv.includes('--sample');
const notion = readJson(p(sample ? 'data/sample/notion.json' : 'data/notion.json'));
if (!notion) fail('no Notion data. Run "npm run data" (needs NOTION_TOKEN) or "npm run data:sample".');

// In --sample mode, data/sample/geo.json holds rough test pins (no Google key needed).
const geo = readJson(p(sample ? 'data/sample/geo.json' : 'data/cache/geo.json'), {});
const tr = readJson(p('data/cache/translations.json'), {});
const registry = readJson(p('data/cache/registry.json'), {});

// Assign entry numbers and slugs to new places, oldest first.
const used = new Set(Object.values(registry).map(r => r.slug));
let maxNum = Math.max(0, ...Object.values(registry).map(r => r.num));
for (const pl of [...notion.places].sort((a, b) => a.created.localeCompare(b.created))) {
  if (registry[pl.id]) continue;
  let slug = slugify(pl.name);
  if (used.has(slug)) slug = slugify(`${pl.name} ${pl.area || ''}`);
  for (let i = 2; used.has(slug); i++) slug = `${slugify(pl.name)}-${i}`;
  used.add(slug);
  registry[pl.id] = { num: ++maxNum, slug };
}

function translated(paras) {
  const out = { en: paras || [] };
  const hit = paras?.length ? tr[hashOf(paras)] : null;
  for (const l of TARGET_LANGS) out[l] = hit?.[l] || null; // null = fall back to English
  return out;
}

const places = notion.places.map(pl => {
  const g = geo[pl.id] || {};
  return {
    id: pl.id,
    num: registry[pl.id].num,
    slug: registry[pl.id].slug,
    status: pl.status,
    name: pl.name,
    nameJa: pl.nameJa || '',
    types: pl.types, specs: pl.specs, dietary: pl.dietary, good: pl.good, prac: pl.prac,
    price: pl.price, city: pl.city, area: pl.area, reservation: pl.reservation,
    mapsUrl: pl.mapsUrl, placeId: g.placeId || null,
    lat: pl.manualLat ?? g.lat ?? null, lng: pl.manualLng ?? g.lng ?? null,
    addressJa: g.addressJa || '',
    note: translated(pl.note),
    tip: translated(pl.tip),
    featured: pl.featured, lastChecked: pl.lastChecked, edited: pl.edited,
    drawing: pl.drawing, photos: pl.photos || [],
  };
}).sort((a, b) => a.num - b.num);

writeJson(p('data/places.json'), { builtAt: new Date().toISOString(), sample, places });
if (!sample) writeJson(p('data/cache/registry.json'), registry);
const missing = places.filter(x => TARGET_LANGS.some(l => x.note.en.length && !x.note[l])).length;
log(`places.json: ${places.length} place(s)${missing ? `, ${missing} with untranslated notes` : ''}`);
