// Step 2: find each place on Google (Places API, New) for its place ID, pin
// position and Japanese address. Results are cached in data/cache/geo.json.
// Google's terms allow keeping place IDs indefinitely but positions only for
// 30 days, so entries older than that are looked up again.
import { p, readJson, writeJson, log } from './lib.mjs';

const KEY = process.env.GOOGLE_PLACES_KEY;
const MAX_AGE_DAYS = 30;
const notion = readJson(p('data/notion.json'));
if (!notion) { log('no data/notion.json, skipping enrichment'); process.exit(0); }
const cache = readJson(p('data/cache/geo.json'), {});

function queryFor(place) {
  // Prefer the name inside the Google Maps link: it is exactly what Google calls the place.
  if (place.mapsUrl) {
    const m = place.mapsUrl.match(/\/maps\/place\/([^/]+)/);
    if (m) return decodeURIComponent(m[1].replace(/\+/g, ' '));
  }
  return [place.nameJa || place.name, place.city === 'Sapporo' ? '札幌' : place.city].filter(Boolean).join(' ');
}

async function search(textQuery) {
  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': KEY,
      'X-Goog-FieldMask': 'places.id,places.location,places.formattedAddress',
    },
    body: JSON.stringify({
      textQuery,
      languageCode: 'ja',
      regionCode: 'JP',
      pageSize: 1,
      locationBias: { circle: { center: { latitude: 43.0618, longitude: 141.3545 }, radius: 50000 } },
    }),
  });
  if (!res.ok) throw new Error(`Places ${res.status}: ${await res.text()}`);
  return (await res.json()).places?.[0] ?? null;
}

const now = Date.now();
let looked = 0, failed = 0;
for (const place of notion.places) {
  const q = queryFor(place);
  const hit = cache[place.id];
  const fresh = hit && hit.query === q && now - Date.parse(hit.fetchedAt) < MAX_AGE_DAYS * 864e5;
  if (fresh) continue;
  if (!KEY) { if (!hit) log(`no GOOGLE_PLACES_KEY: "${place.name}" will have no map pin`); continue; }
  try {
    const r = await search(q);
    looked++;
    if (!r) { log(`Google found nothing for "${q}" (${place.name}) — check the Maps link`); failed++; continue; }
    cache[place.id] = {
      query: q,
      placeId: r.id,
      lat: r.location?.latitude ?? null,
      lng: r.location?.longitude ?? null,
      addressJa: (r.formattedAddress || '').replace(/^日本、\s*/, ''),
      fetchedAt: new Date().toISOString(),
    };
  } catch (e) { log(String(e)); failed++; }
}

// Drop entries for places that no longer exist.
const ids = new Set(notion.places.map(x => x.id));
for (const k of Object.keys(cache)) if (!ids.has(k)) delete cache[k];

writeJson(p('data/cache/geo.json'), cache);
log(`geo: ${looked} looked up, ${failed} failed, ${Object.keys(cache).length} cached`);
