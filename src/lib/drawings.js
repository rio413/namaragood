// Line drawings, one small set per speciality. All share one style:
// 120×80 box, round 3px-ish strokes in currentColor, flat fills in var(--paper).
// To add a variant, append another string to the list: places are spread across
// variants automatically and keep the same one forever (picked from their ID).
// A place can also pick one by hand with the optional "Drawing" field in Notion
// (e.g. "ramen-2").

const F = 'class="f"'; // filled shape

export const DRAWINGS = {
  ramen: [
    `<path ${F} d="M14 38h92c0 20-20 34-46 34S14 58 14 38z"/><path d="M44 72h32M70 8l26 26M80 6l22 22M40 30c-4-6 4-10 0-16M56 30c-4-6 4-10 0-16M26 46c10 4 24 4 34 0s24-4 34 0"/>`,
    `<ellipse ${F} cx="60" cy="42" rx="44" ry="30"/><ellipse cx="60" cy="42" rx="34" ry="22"/><circle cx="46" cy="38" r="8"/><circle cx="46" cy="38" r="3"/><path d="M66 30h14v18H66zM72 52c6 2 12 2 16-2M30 48c4 4 10 6 16 4"/>`,
    `<path ${F} d="M18 44h84c0 16-18 28-42 28S18 60 18 44z"/><path d="M30 44c0-14 6-30 12-36M42 44c0-12 4-26 8-34M54 44c0-10 3-22 6-30"/><path d="M36 8l40 20M38 4l40 20"/>`,
  ],
  mazesoba: [
    `<path ${F} d="M14 40h92c0 18-20 32-46 32S14 58 14 40z"/><path d="M26 38c6-12 12 0 18-8s12 0 18-8 12 0 18-8 12 0 16-6M84 4l14 30M44 72h32"/><circle cx="52" cy="30" r="5"/>`,
  ],
  jingisukan: [
    `<path ${F} d="M20 62c0-26 18-44 40-44s40 18 40 44z"/><path d="M12 62h96M60 18v44M38 26c6 10 8 22 8 36M82 26c-6 10-8 22-8 36M50 10c-3-4 3-6 0-10M70 10c-3-4 3-6 0-10"/>`,
    `<circle ${F} cx="60" cy="44" r="32"/><path d="M60 12v64M28 44h64M37 21l46 46M83 21L37 67"/><path ${F} d="M40 30l14 4-4 12-14-4zM66 46l14 4-4 12-14-4z"/>`,
  ],
  takoyaki: [
    `<path d="M8 54l14 18h76l14-18z"/><circle ${F} cx="36" cy="40" r="15"/><circle ${F} cx="62" cy="38" r="15"/><circle ${F} cx="88" cy="40" r="15"/><path d="M28 36l6 4M56 32l6 6M82 36l8 2M100 10L80 32"/>`,
  ],
  chinese: [
    `<path ${F} d="M14 60c2-22 28-38 50-34s36 20 42 34z"/><path d="M36 38l4-8M52 32l1-8M68 32l-1-8M84 38l-4-7M10 64h100"/>`,
  ],
  wine: [
    `<path ${F} d="M44 6h32c2 18-4 32-16 32S42 24 44 6z"/><path d="M60 38v32M44 72h32M86 52c4-6 14-6 16 2-4 6-12 8-16 2zM90 48l-4-6"/>`,
    `<path ${F} d="M30 30c0-8 4-12 4-22h12c0 10 4 14 4 22v42H30z"/><path d="M34 8h12M30 44h20"/><path ${F} d="M66 22h28c2 14-4 26-14 26s-16-12-14-26z"/><path d="M80 48v22M70 72h20"/>`,
  ],
  pint: [
    `<path ${F} d="M40 8h40l-6 68H46z"/><path d="M41 22h38M60 12c-3-3-7 0-4 3 3 3 4 2 4 2s1 1 4-2c3-3-1-6-4-3z"/>`,
    `<path ${F} d="M30 16h46v56H30z"/><path d="M76 28h10c6 0 8 4 8 10v10c0 6-2 10-8 10H76M30 16c0-8 46-8 46 0M40 30v32M53 30v32M66 30v32"/>`,
  ],
  coffee: [
    `<path ${F} d="M30 34h50v18c0 12-10 20-25 20S30 64 30 52z"/><path d="M80 40h6c6 0 8 4 8 8s-2 8-8 8h-8M22 74h66M46 26c-3-5 3-8 0-14M60 26c-3-5 3-8 0-14"/>`,
  ],
  sandwich: [
    `<path ${F} d="M14 30c0-14 92-14 92 0v6H14z"/><path d="M14 42c10 4 20-4 30 0s20-4 30 0 20-4 32 0M14 50h92"/><path ${F} d="M14 58c0 10 92 10 92 0v-4H14z"/>`,
  ],
  cocktail: [
    `<path ${F} d="M26 10h68L60 46z"/><path d="M60 46v24M44 72h32M74 24l20-18M90 4l6 6"/><circle cx="80" cy="16" r="5"/>`,
  ],
  record: [
    `<circle ${F} cx="54" cy="42" r="30"/><circle cx="54" cy="42" r="6"/><circle cx="54" cy="42" r="18"/><path d="M104 8L80 40"/>`,
  ],
  sake: [
    `<path ${F} d="M34 74V40c0-10 8-14 8-22V8h12v10c0 8 8 12 8 22v34z"/><path d="M38 52h20"/><path ${F} d="M72 52h22l-3 22H75z"/>`,
  ],
  house: [
    `<path ${F} d="M22 40L60 10l38 30v34H22z"/><path d="M50 74V52h20v22M16 44L60 8l44 36"/>`,
  ],
  plate: [
    `<ellipse ${F} cx="56" cy="50" rx="44" ry="20"/><ellipse cx="56" cy="50" rx="28" ry="11"/><path d="M78 6L102 38M88 4l20 30"/>`,
  ],
  generic: [
    `<path ${F} d="M20 70V30h80v40z"/><path d="M14 30l10-18h72l10 18M48 70V48h24v22"/>`,
  ],
};

// Speciality (and Type, as a fallback) → drawing set. First match wins.
const BY_TAG = {
  Ramen: 'ramen', 'Soba & Udon': 'ramen', Jingisukan: 'jingisukan', Yakiniku: 'jingisukan',
  Takoyaki: 'takoyaki', Chinese: 'chinese', Korean: 'chinese', Asian: 'chinese',
  Italian: 'wine', Spanish: 'wine', French: 'wine', Wine: 'wine', Western: 'plate',
  Pub: 'pint', Beer: 'pint', Coffee: 'coffee', Tea: 'coffee', Cakes: 'coffee', Bread: 'sandwich',
  Sandwiches: 'sandwich', Burgers: 'sandwich', Brunch: 'coffee', Cocktails: 'cocktail', Whisky: 'cocktail',
  Sake: 'sake', Sushi: 'plate', Seafood: 'plate', Japanese: 'plate', Yakitori: 'sake', Curry: 'plate', 'Soup curry': 'ramen',
  Guesthouse: 'house', Hotel: 'house', Ryokan: 'house',
  // Types
  Restaurant: 'plate', Izakaya: 'sake', 'Café': 'coffee', Bar: 'cocktail', 'Bakery & Sweets': 'coffee', Stay: 'house',
};

function hash(s) { let h = 2166136261; for (const c of s) h = Math.imul(h ^ c.codePointAt(0), 16777619); return h >>> 0; }

export function drawingFor(place) {
  if (place.drawing) {
    const [set, n] = String(place.drawing).split('-');
    if (DRAWINGS[set]) return { set, i: Math.min(DRAWINGS[set].length, Math.max(1, +n || 1)) - 1 };
  }
  const name = /mazesoba|まぜそば/i.test(place.name + place.nameJa) ? 'mazesoba'
    : [...place.specs, ...place.types].map(t => BY_TAG[t]).find(Boolean) || 'generic';
  return { set: name, i: hash(place.id) % DRAWINGS[name].length };
}

// Same as drawingFor, but nudges a place to another variant when the place
// before it in the list would show the identical drawing.
export function drawingsForList(places) {
  let prev = null;
  return places.map(pl => {
    let d = drawingFor(pl);
    if (!pl.drawing && prev && prev.set === d.set && prev.i === d.i && DRAWINGS[d.set].length > 1) {
      d = { set: d.set, i: (d.i + 1) % DRAWINGS[d.set].length };
    }
    prev = d;
    return d;
  });
}

export const svg = ({ set, i }, attrs = '') =>
  `<svg viewBox="0 0 120 80" ${attrs} aria-hidden="true" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">${DRAWINGS[set][i]}</svg>`;
