import data from '../../data/places.json';
import { LANGS, UI, langByCode } from '../i18n/ui.js';
import { makeTag } from '../i18n/tags.js';
import autoTags from '../../data/cache/tags.json';
const tag = makeTag(autoTags);
import { drawingFor, drawingsForList, svg } from './drawings.js';

export { LANGS, UI, langByCode, tag, drawingFor, drawingsForList, svg };
export const PLACES = data.places;

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const stripTags = (h) => String(h ?? '').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");

// URL of a page in a language. kind: 'home' | 'about' | 'place'
export function href(lang, kind = 'home', slug = '') {
  const base = langByCode[lang].path ? `/${langByCode[lang].path}/` : '/';
  if (kind === 'about') return `${base}about/`;
  if (kind === 'place') return `${base}p/${slug}/`;
  return base;
}

export const num = (n) => '#' + String(n).padStart(2, '0');

// Link that opens the exact place in the Google Maps app or website.
export function mapsLink(pl) {
  if (pl.placeId) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pl.nameJa || pl.name)}&query_place_id=${pl.placeId}`;
  }
  return pl.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((pl.nameJa || pl.name) + ' 札幌')}`;
}

// Short "MISO RAMEN · SUSUKINO · LATE" line under a name in the list.
export function subline(pl, lang) {
  const bits = [...(pl.specs.length ? pl.specs.slice(0, 2) : pl.types.slice(0, 1)).map(t => tag(t, lang))];
  if (pl.area) bits.push(tag(pl.area, lang));
  if (pl.prac.includes('Open late')) bits.push(tag('Open late', lang));
  else if (pl.prac.includes('Cash only')) bits.push(tag('Cash only', lang));
  return bits.join(' · ');
}

// Note/tip paragraphs in a language, with English as the fallback.
export function textIn(field, lang) {
  const t = field?.[lang];
  return { paras: t?.length ? t : field?.en || [], translated: lang !== 'en' && !!t?.length };
}

export const SITE = (import.meta.env.SITE || 'https://namaragood.com').replace(/\/$/, '');
export const MAPS_KEY = import.meta.env.PUBLIC_GOOGLE_MAPS_KEY || '';
export const MAP_ID = import.meta.env.PUBLIC_GOOGLE_MAP_ID || 'DEMO_MAP_ID';
export const MAPS_LANG = { en: 'en-GB', ko: 'ko', zh: 'zh-CN', th: 'th', vi: 'vi' };
