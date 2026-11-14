// All the interactive bits. No framework; the pages work without this, it only adds:
// filters, list/map switch, saved places, share, Japanese phrase cards.
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};
const saved = new Set(store.get('ng-saved', []));
const persistSaved = () => store.set('ng-saved', [...saved]);

function toast(msg) {
  const t = $('#toast'); if (!t) return;
  t.textContent = msg; t.hidden = false;
  clearTimeout(toast.t); toast.t = setTimeout(() => { t.hidden = true; }, 2200);
}

// Remember the language a visitor picks; offer it on the English home page.
$$('[data-setlang]').forEach(a => a.addEventListener('click', () => store.set('ng-lang', a.dataset.setlang)));
(function langHint() {
  const box = $('#langhint'); if (!box) return;
  if (store.get('ng-lang', null) || store.get('ng-hint-off', false)) return;
  const nav = (navigator.languages || [navigator.language || '']).map(s => s.toLowerCase());
  const pick = nav.map(s => s.startsWith('ko') ? 'ko' : s.startsWith('zh') ? 'zh' : s.startsWith('th') ? 'th' : s.startsWith('vi') ? 'vi' : s.startsWith('en') ? 'en' : null).find(Boolean);
  const TXT = { ko: '한국어로 보기 →', zh: '查看简体中文版 →', th: 'ดูเป็นภาษาไทย →', vi: 'Xem bằng tiếng Việt →' };
  if (!pick || !TXT[pick]) return;
  const a = $('#langhintLink'); a.textContent = TXT[pick]; a.href = `/${pick}/`; a.lang = pick;
  a.addEventListener('click', () => store.set('ng-lang', pick));
  $('#langhintClose').addEventListener('click', () => { box.hidden = true; store.set('ng-hint-off', true); });
  box.hidden = false;
})();

/* ---------- Google Maps loader (shared) ---------- */
let mapsPromise;
function loadMaps(key, lang) {
  if (!mapsPromise) mapsPromise = new Promise((resolve, reject) => {
    window.__ngMaps = () => resolve(window.google.maps);
    const s = document.createElement('script');
    s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&v=weekly&loading=async&language=${lang}&region=JP&callback=__ngMaps`;
    s.async = true; s.onerror = reject;
    document.head.appendChild(s);
  });
  return mapsPromise;
}
async function makeMap(el, { key, mapId, lang, center, zoom }) {
  const maps = await loadMaps(key, lang);
  const { Map } = await maps.importLibrary('maps');
  const { AdvancedMarkerElement } = await maps.importLibrary('marker');
  const map = new Map(el, {
    center, zoom, mapId, colorScheme: 'DARK', disableDefaultUI: true, zoomControl: true,
    gestureHandling: 'greedy', clickableIcons: false,
  });
  return { map, AdvancedMarkerElement, maps };
}

/* ---------- List page ---------- */
const app = $('#listapp');
if (app) {
  const i18n = JSON.parse(app.dataset.i18n);
  const rows = $$('ol.rows li', app);
  const fstate = {}; // field -> Set of values
  let savedOnly = false;

  const fmtCount = n => n === 0 ? i18n.count[0] : n === 1 ? i18n.count[1] : i18n.countTpl.replace('{n}', n);
  const match = li => {
    if (savedOnly && !saved.has(li.dataset.id)) return false;
    for (const [f, set] of Object.entries(fstate)) {
      if (!set.size) continue;
      const vals = (li.dataset[f] || '').split('|');
      if (![...set].some(v => vals.includes(v))) return false; // OR inside a group, AND across groups
    }
    return true;
  };

  function apply() {
    let n = 0;
    for (const li of rows) { const ok = match(li); li.hidden = !ok; if (ok) n++; $('.heart', li)?.classList.toggle('on', saved.has(li.dataset.id)); }
    $$('[data-count]').forEach(e => { e.textContent = fmtCount(n); });
    const c2 = $('[data-count2]'); if (c2) c2.textContent = `(${n})`;
    $('[data-empty]', app).hidden = n > 0;
    $$('.chip[data-f]').forEach(b => {
      const set = fstate[b.dataset.f];
      b.setAttribute('aria-pressed', b.dataset.v === '' ? String(!set || !set.size) : String(!!set?.has(b.dataset.v)));
    });
    const sheetN = Object.entries(fstate).filter(([f]) => f !== 'types').reduce((a, [, s]) => a + s.size, 0);
    const fn = $('[data-fn]', app); if (fn) fn.textContent = sheetN ? sheetN : '';
    $('[data-saved]', app).setAttribute('aria-pressed', String(savedOnly));
    $('[data-savedn]', app).textContent = saved.size;
    const any = savedOnly || Object.values(fstate).some(s => s.size);
    $$('[data-clear]').forEach(b => { if (b.closest('.status')) b.hidden = !any; });
    updateMarkers?.();
    try { sessionStorage.setItem('ng-f', JSON.stringify({ f: Object.fromEntries(Object.entries(fstate).map(([k, s]) => [k, [...s]])), savedOnly })); } catch {}
  }

  document.addEventListener('click', e => {
    const chip = e.target.closest('.chip[data-f]');
    if (chip) {
      const { f, v } = chip.dataset;
      fstate[f] ||= new Set();
      if (v === '') fstate[f].clear();
      else if (f === 'types') { const on = fstate[f].has(v); fstate[f].clear(); if (!on) fstate[f].add(v); }
      else fstate[f].has(v) ? fstate[f].delete(v) : fstate[f].add(v);
      apply(); return;
    }
    if (e.target.closest('[data-saved]')) { savedOnly = !savedOnly; apply(); return; }
    if (e.target.closest('[data-clear]')) { for (const s of Object.values(fstate)) s.clear(); savedOnly = false; apply(); return; }
    if (e.target.closest('[data-openfilters]')) { $('#filters').showModal(); return; }
    if (e.target.closest('[data-closefilters]')) { $('#filters').close(); return; }
  });
  $('#filters')?.addEventListener('click', e => { if (e.target.id === 'filters') e.target.close(); }); // tap backdrop

  // Restore filters when coming back from a place page.
  try {
    const s = JSON.parse(sessionStorage.getItem('ng-f') || 'null');
    if (s) { for (const [k, v] of Object.entries(s.f)) fstate[k] = new Set(v); savedOnly = !!s.savedOnly; }
  } catch {}

  /* List / map switch */
  const panels = { list: $('[data-panel="list"]', app), map: $('[data-panel="map"]', app) };
  function setView(v, push) {
    for (const [k, el] of Object.entries(panels)) el.hidden = k !== v;
    $$('[data-view]', app).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.view === v)));
    if (push) history.replaceState(null, '', v === 'map' ? '#map' : location.pathname);
    if (v === 'map') {
      initMap();
      // Bring the whole map into view (it sits below the big header).
      if (push) $('.lh', app).scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  $$('[data-view]', app).forEach(b => b.addEventListener('click', () => setView(b.dataset.view, true)));

  /* Map */
  const points = JSON.parse($('#mapdata').textContent);
  let markers = [], current = null, mapStarted = false;
  var updateMarkers = () => {
    for (const m of markers) {
      const li = rows.find(r => r.dataset.id === m.id);
      m.marker.map = li && !li.hidden ? m.map : null;
    }
  };
  function select(m) {
    for (const x of markers) { x.el.classList.toggle('on', x === m); x.marker.zIndex = x === m ? 999 : null; }
    current = m;
    const card = $('[data-mapcard]', app);
    if (!m) { card.hidden = true; return; }
    card.href = m.p.url;
    card.innerHTML = `${m.p.svg}<span><span class="nm d"></span><span class="sub"></span></span><span class="go" aria-hidden="true">→</span>`;
    $('.nm', card).textContent = `${m.p.n} ${m.p.name}`;
    $('.sub', card).textContent = m.p.sub;
    card.hidden = false;
  }
  async function initMap() {
    if (mapStarted) return; mapStarted = true;
    const msg = $('[data-mapmsg]', app);
    const key = app.dataset.mapsKey;
    if (!key) return; // message already says the map is off
    try {
      const { map, AdvancedMarkerElement, maps } = await makeMap($('[data-gm]', app), {
        key, mapId: app.dataset.mapId, lang: app.dataset.mapsLang, center: { lat: 43.0575, lng: 141.3535 }, zoom: 15,
      });
      msg.hidden = true;
      const bounds = new maps.LatLngBounds();
      markers = points.map(p => {
        const el = document.createElement('div');
        el.className = 'pin';
        el.innerHTML = `<span>${p.n.slice(1)}</span>${p.svg}`;
        const marker = new AdvancedMarkerElement({ map, position: { lat: p.lat, lng: p.lng }, content: el, title: p.name, gmpClickable: true });
        const m = { id: p.id, p, el, marker, map };
        marker.addListener('gmp-click', () => select(current === m ? null : m));
        bounds.extend(marker.position);
        return m;
      });
      if (points.length > 1) map.fitBounds(bounds, 48);
      map.addListener('click', () => select(null));
      // Small squares when zoomed out; numbers once you zoom in.
      const gm = $('[data-gm]', app);
      const zoomed = () => gm.classList.toggle('near', map.getZoom() >= 17);
      map.addListener('zoom_changed', zoomed); zoomed();
      updateMarkers();
    } catch (e) {
      msg.textContent = i18n.mapOff; msg.hidden = false;
    }
  }

  // Fade the edge of the type row when there are more chips to scroll to.
  const frow = $('.frow', app);
  const edges = () => {
    frow.classList.toggle('fade-r', frow.scrollLeft + frow.clientWidth < frow.scrollWidth - 4);
    frow.classList.toggle('fade-l', frow.scrollLeft > 4);
  };
  frow.addEventListener('scroll', edges, { passive: true });
  addEventListener('resize', edges);
  edges();

  apply();
  setView(location.hash === '#map' ? 'map' : 'list', false);
}

/* ---------- Place page ---------- */
const phrases = $('#phrases');
if (phrases) {
  const name = phrases.dataset.name, addr = phrases.dataset.addr;
  const big = $('[data-big]', phrases), addrEl = $('[data-addr]', phrases);
  const stepper = $('[data-stepper]', phrases), nOut = $('[data-n]', phrases);
  let current = $('.say button[aria-pressed="true"]', phrases), people = 2;

  const jaFor = b => b.dataset.k === 'table' ? `${people}名です。` : b.dataset.ja;
  const addrHTML = b => {
    if (!b.dataset.place) return '';
    const d = document.createElement('div');
    d.append(name); if (addr) { d.append(document.createElement('br'), addr); }
    return d.innerHTML;
  };
  function render() {
    big.textContent = jaFor(current);
    addrEl.innerHTML = addrHTML(current); addrEl.hidden = !current.dataset.place;
    stepper.hidden = current.dataset.k !== 'table';
    nOut.textContent = people;
  }
  $$('.say button', phrases).forEach(b => b.addEventListener('click', () => {
    current = b; $$('.say button', phrases).forEach(x => x.setAttribute('aria-pressed', String(x === b))); render();
  }));
  $$('[data-step]', phrases).forEach(b => b.addEventListener('click', () => {
    people = Math.min(20, Math.max(1, people + Number(b.dataset.step))); render();
  }));

  const full = $('#full');
  $('[data-cardja]', phrases).addEventListener('click', async () => {
    $('[data-fbig]', full).textContent = jaFor(current);
    $('[data-faddr]', full).innerHTML = addrHTML(current);
    full.hidden = false; full.focus();
    try { await document.documentElement.requestFullscreen?.(); } catch {}
    try { full._lock = await navigator.wakeLock?.request('screen'); } catch {}
  });
  const closeFull = () => {
    full.hidden = true; full._lock?.release?.();
    if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
  };
  full.addEventListener('click', closeFull);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !full.hidden) closeFull(); });
  render();
}

// Save
$$('[data-save]').forEach(b => {
  const id = b.dataset.save;
  const paint = () => {
    const on = saved.has(id);
    b.setAttribute('aria-pressed', String(on));
    b.firstChild.textContent = on ? '♥ ' : '♡ ';
    b.querySelector('span').textContent = on ? b.dataset.on : b.dataset.off;
  };
  b.addEventListener('click', () => { saved.has(id) ? saved.delete(id) : saved.add(id); persistSaved(); paint(); });
  paint();
});

// Share
$$('[data-share]').forEach(b => b.addEventListener('click', async () => {
  const data = { title: b.dataset.title, url: location.href.split('#')[0] };
  if (navigator.share) { try { await navigator.share(data); return; } catch (e) { if (e.name === 'AbortError') return; } }
  try { await navigator.clipboard.writeText(data.url); toast(b.dataset.copied); }
  catch { prompt('', data.url); }
}));

// Small map on a place page, loaded only when scrolled near it.
const mini = $('[data-minimap]');
if (mini) {
  const start = async () => {
    try {
      const pos = { lat: +mini.dataset.lat, lng: +mini.dataset.lng };
      const { map, AdvancedMarkerElement } = await makeMap(mini, { key: mini.dataset.mapsKey, mapId: mini.dataset.mapId, lang: mini.dataset.mapsLang, center: pos, zoom: 16 });
      const el = document.createElement('div'); el.className = 'pin on'; el.innerHTML = mini.dataset.svg;
      new AdvancedMarkerElement({ map, position: pos, content: el });
    } catch { mini.remove(); }
  };
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { io.disconnect(); start(); } }, { rootMargin: '300px' });
    io.observe(mini);
  } else start();
}
