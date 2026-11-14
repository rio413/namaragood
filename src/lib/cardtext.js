// Text for the share cards. Plain JS so both the site and scripts/cards.mjs can use it.
const strip = (h) => String(h ?? '').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();

function firstSentence(t) {
  const m = t.match(/^.+?[.!?。！？](?=\s|$)/u);
  return (m ? m[0] : t).trim();
}

// The Quote field in the right language; otherwise the first sentence of the note.
export function cardQuote(p, lang) {
  const q = p.quote?.[lang]?.[0] || (lang === 'en' ? p.quote?.en?.[0] : null);
  if (q) return strip(q);
  const note = p.note?.[lang]?.length ? p.note[lang] : p.note?.en || [];
  return note.length ? firstSentence(strip(note[0])) : '';
}

export const CARD_SIZES = {
  post: { w: 1080, h: 1440 },
  story: { w: 1080, h: 1920, scale: 1.25 }, // laid out at 864×1536, drawn 1.25× so text reads bigger
  square: { w: 1080, h: 1080 },
  og: { w: 1200, h: 630 },
};
export const cardPath = (lang, slug, size) => `/cards/${lang}/${slug}-${size}.png`;
