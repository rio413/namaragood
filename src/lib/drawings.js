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
    `<path ${F} d="M14 40h92c0 18-20 32-46 32S14 58 14 40z"/><path ${F} d="M74 14h16v28H74z"/><circle ${F} cx="46" cy="34" r="9"/><path d="M42 32c2-4 8-2 6 2s-6 4-4 0M44 72h32M20 4l16 34M28 4l14 34"/>`,
    `<ellipse ${F} cx="60" cy="42" rx="46" ry="30"/><circle cx="44" cy="34" r="10"/><path d="M38 32c4-6 14-2 10 4s-10 2-6-2"/><ellipse ${F} cx="74" cy="32" rx="10" ry="7"/><circle cx="74" cy="32" r="3"/><path d="M50 50h18v12H50zM78 48c6 2 10 6 10 10M32 50c4 2 8 6 8 10"/>`,
  ],
  mazesoba: [
    `<path ${F} d="M14 40h92c0 18-20 32-46 32S14 58 14 40z"/><path d="M26 38c6-12 12 0 18-8s12 0 18-8 12 0 18-8 12 0 16-6M84 4l14 30M44 72h32"/><circle cx="52" cy="30" r="5"/>`,
    `<ellipse ${F} cx="60" cy="42" rx="46" ry="30"/><ellipse cx="60" cy="42" rx="36" ry="22"/><circle cx="60" cy="40" r="7"/><path d="M30 46c6-6 12 4 18-2M72 48c6-6 12 4 18-2M40 30l5 2M46 27l5 3M74 28l3 5M80 32l5 2"/>`,
  ],
  jingisukan: [
    `<path ${F} d="M20 62c0-26 18-44 40-44s40 18 40 44z"/><path d="M12 62h96M60 18v44M38 26c6 10 8 22 8 36M82 26c-6 10-8 22-8 36M50 10c-3-4 3-6 0-10M70 10c-3-4 3-6 0-10"/>`,
    `<path ${F} d="M34 56c-10 0-12-14-2-16-2-10 10-14 16-8 4-8 18-8 20 0 8-4 18 2 14 10 8 2 8 14-2 16 2 8-10 12-16 6-6 6-18 6-22-2-6 4-12 0-8-6z"/><ellipse ${F} cx="90" cy="38" rx="10" ry="8"/><path d="M84 32l-6-6M96 32l4-6M40 58v14M52 60v12M68 60v12M80 58v14"/><circle cx="88" cy="37" r="1.5"/>`,
  ],
  takoyaki: [
    `<path d="M8 54l14 18h76l14-18z"/><circle ${F} cx="36" cy="40" r="15"/><circle ${F} cx="62" cy="38" r="15"/><circle ${F} cx="88" cy="40" r="15"/><path d="M28 36l6 4M56 32l6 6M82 36l8 2M100 10L80 32"/>`,
    `<path ${F} d="M40 40c-2-26 42-26 40 0z"/><path d="M38 32h44M42 40c-4 10-12 14-16 10M50 42c0 12-4 20-10 22M60 42v24M70 42c0 12 4 20 10 22M78 40c4 10 12 14 16 10"/><circle cx="52" cy="24" r="2"/><circle cx="68" cy="24" r="2"/>`,
  ],
  chinese: [
    `<path ${F} d="M14 60c2-22 28-38 50-34s36 20 42 34z"/><path d="M36 38l4-8M52 32l1-8M68 32l-1-8M84 38l-4-7M10 64h100"/>`,
    `<path ${F} d="M10 60c0-14 12-22 24-22s24 8 24 22z"/><path ${F} d="M56 60c0-14 12-22 24-22s24 8 24 22z"/><path d="M20 44l2 6M28 40v8M36 40v8M44 44l-2 6M66 44l2 6M74 40v8M82 40v8M90 44l-2 6M6 64h108"/>`,
    `<path ${F} d="M20 36h80v30H20z"/><path ${F} d="M16 36c4-18 84-18 88 0z"/><path d="M20 48h80M20 58h80M44 14c-3-4 3-6 0-10M60 12c-3-4 3-6 0-10M76 14c-3-4 3-6 0-10"/>`,
  ],
  italian: [
    `<path ${F} d="M60 6L22 70c20 8 56 8 76 0z"/><path d="M22 70c20 8 56 8 76 0"/><circle cx="60" cy="30" r="5"/><circle cx="50" cy="52" r="5"/><circle cx="70" cy="56" r="5"/>`,
    `<ellipse ${F} cx="58" cy="62" rx="48" ry="12"/><path ${F} d="M28 60c0-16 60-16 60 0z"/><path d="M36 54c8-8 36-8 44 0M44 48c6-6 26-6 32 0M92 4L70 50M86 2l-6 14M98 6l-6 14"/>`,
  ],
  spanish: [
    `<ellipse ${F} cx="60" cy="46" rx="44" ry="22"/><path d="M16 46H4M104 46h12M34 42c4-8 14-8 16 0M62 36c4-8 14-8 16 0"/><path ${F} d="M66 52c4-8 18-8 20 0z"/><ellipse cx="46" cy="56" rx="7" ry="4"/><circle cx="58" cy="44" r="2"/><circle cx="82" cy="44" r="2"/>`,
  ],
  wine: [
    `<path ${F} d="M44 6h32c2 18-4 32-16 32S42 24 44 6z"/><path d="M60 38v32M44 72h32M86 52c4-6 14-6 16 2-4 6-12 8-16 2zM90 48l-4-6"/>`,
    `<path ${F} d="M30 30c0-8 4-12 4-22h12c0 10 4 14 4 22v42H30z"/><path d="M34 8h12M30 44h20"/><path ${F} d="M66 22h28c2 14-4 26-14 26s-16-12-14-26z"/><path d="M80 48v22M70 72h20"/>`,
    `<path ${F} d="M10 70l40-30 34 30z"/><circle cx="40" cy="58" r="4"/><circle cx="56" cy="62" r="3"/><path ${F} d="M84 8h24c2 16-4 26-12 26s-14-10-12-26z"/><path d="M96 34v34M88 70h16"/>`,
  ],
  pint: [
    `<path ${F} d="M40 8h40l-6 68H46z"/><path d="M41 22h38M60 12c-3-3-7 0-4 3 3 3 4 2 4 2s1 1 4-2c3-3-1-6-4-3z"/>`,
    `<path ${F} d="M30 16h46v56H30z"/><path d="M76 28h10c6 0 8 4 8 10v10c0 6-2 10-8 10H76M30 16c0-8 46-8 46 0M40 30v32M53 30v32M66 30v32"/>`,
    `<path ${F} d="M16 30h30v42H16z"/><path ${F} d="M66 30h30v42H66z"/><path d="M16 38H8v22h8M96 38h8v22h-8M16 30c2-8 28-8 30 0M66 30c2-8 28-8 30 0M56 18v-10M50 22l-6-6M62 22l6-6"/>`,
  ],
  coffee: [
    `<path ${F} d="M30 34h50v18c0 12-10 20-25 20S30 64 30 52z"/><path d="M80 40h6c6 0 8 4 8 8s-2 8-8 8h-8M22 74h66M46 26c-3-5 3-8 0-14M60 26c-3-5 3-8 0-14"/>`,
    `<path ${F} d="M36 12h48l-14 24H50z"/><path ${F} d="M40 42h40v26c0 6-40 6-40 0z"/><path d="M60 36v4M34 12h52M80 50h6c4 0 6 3 6 6s-2 6-6 6h-6"/>`,
    `<path ${F} d="M40 22h40l-5 52H45z"/><path ${F} d="M36 14h48v8H36z"/><path d="M42 36h36M44 54h32M54 14l2-8h8l2 8"/>`,
  ],
  tea: [
    `<path ${F} d="M30 66c-8-24 4-40 30-40s38 16 30 40z"/><path d="M46 26c0-8 28-8 28 0M90 46c8-2 14-10 18-20M30 36c-12 0-14 20-2 22M26 70h68"/><circle cx="60" cy="16" r="3"/>`,
    `<path ${F} d="M36 30h48l-4 42H40z"/><path d="M38 44h44M50 22c-3-4 3-6 0-10M62 22c-3-4 3-6 0-10M74 22c-3-4 3-6 0-10"/>`,
  ],
  sandwich: [
    `<path ${F} d="M14 30c0-14 92-14 92 0v6H14z"/><path d="M14 42c10 4 20-4 30 0s20-4 30 0 20-4 32 0M14 50h92"/><path ${F} d="M14 58c0 10 92 10 92 0v-4H14z"/>`,
    `<path ${F} d="M12 66L60 18l48 48z"/><path d="M22 56h76M30 48c10 4 20-4 30 0s20-4 30 0M12 66h96"/>`,
  ],
  burger: [
    `<path ${F} d="M18 38c0-22 84-22 84 0z"/><path d="M16 44c6 4 12-4 18 0s12-4 18 0 12-4 18 0 12-4 18 0 12-4 18 0M44 24l3-2M60 20l3 1M74 26l3-2"/><path ${F} d="M18 48h84v10H18z"/><path ${F} d="M18 62h84c0 8-6 10-12 10H30c-6 0-12-2-12-10z"/>`,
    `<path ${F} d="M10 48c0-16 50-16 50 0z"/><path ${F} d="M10 52h50v8H10z"/><path ${F} d="M10 64h50c0 6-4 8-8 8H18c-4 0-8-2-8-8z"/><path ${F} d="M78 74l-6-36h32l-6 36z"/><path d="M80 38l-3-22M86 38l-1-26M92 38l1-24M98 38l4-20"/>`,
  ],
  bread: [
    `<path ${F} d="M16 66V40c0-14 12-22 26-22h36c14 0 26 8 26 22v26z"/><path d="M40 30c4 8 4 16 0 24M60 28c4 8 4 18 0 26M80 30c4 8 4 16 0 24"/>`,
    `<path ${F} d="M12 58c4-24 30-38 48-38s44 14 48 38c-8-4-14-4-18 2-6-10-16-14-30-14s-24 4-30 14c-4-6-10-6-18-2z"/><path d="M40 26c4 8 4 16 2 24M60 20v26M80 26c-4 8-4 16-2 24"/>`,
  ],
  cakes: [
    `<path ${F} d="M18 66V40l80-16v42z"/><path d="M18 52l80-12M18 66h80"/><path ${F} d="M54 24c0-6 10-6 10 0 0 6-5 10-5 10s-5-4-5-10z"/>`,
    `<path ${F} d="M20 36v28c0 6 18 10 40 10s40-4 40-10V36"/><ellipse ${F} cx="60" cy="36" rx="40" ry="10"/><path d="M20 50c0 6 18 10 40 10s40-4 40-10"/><circle cx="44" cy="32" r="4"/><circle cx="60" cy="30" r="4"/><circle cx="76" cy="32" r="4"/>`,
  ],
  parfait: [
    `<path ${F} d="M40 22h40l-6 40H46z"/><path d="M42 34h36M44 48h32M60 62v10M48 74h24M38 22c4-8 10-8 12 0 4-8 10-8 12 0 4-8 10-8 12 0 4-8 10-8 8 0"/><circle cx="62" cy="10" r="4"/><path d="M62 6c2-4 6-4 8-2"/>`,
  ],
  icecream: [
    `<path d="M60 6c-2 4-4 6-2 10"/><path ${F} d="M50 26c0-12 20-12 20 0z"/><path ${F} d="M44 36c0-12 32-12 32 0z"/><path ${F} d="M38 46c0-12 44-12 44 0z"/><path ${F} d="M44 46l16 30 16-30z"/><path d="M50 54l16 10M56 66l12-8M48 50l20 4"/>`,
    `<path ${F} d="M46 44l14 32 14-32z"/><circle ${F} cx="52" cy="34" r="12"/><circle ${F} cx="68" cy="34" r="12"/><circle ${F} cx="60" cy="20" r="12"/>`,
  ],
  brunch: [
    `<circle cx="50" cy="44" r="30"/><path d="M80 44h32"/><path ${F} d="M32 42c-2-12 14-18 22-12 10-4 22 4 18 14 4 10-8 18-18 14-10 6-24-2-22-16z"/><circle cx="52" cy="44" r="7"/>`,
    `<path ${F} d="M20 58c0 6 18 10 40 10s40-4 40-10v-6H20z"/><path ${F} d="M22 46c0 6 18 10 38 10s38-4 38-10v-6H22z"/><path ${F} d="M24 34c0 6 16 10 36 10s36-4 36-10v-6H24z"/><path ${F} d="M50 20h20v10H50z"/><path d="M30 34c4 10 2 18 6 24"/>`,
  ],
  cocktail: [
    `<path ${F} d="M26 10h68L60 46z"/><path d="M60 46v24M44 72h32M74 24l20-18M90 4l6 6"/><circle cx="80" cy="16" r="5"/>`,
    `<path ${F} d="M30 16h60L60 44z"/><path d="M46 30l22-24M60 44v26M44 72h32"/><circle ${F} cx="52" cy="24" r="5"/>`,
    `<path ${F} d="M30 22h56l-4 50H34z"/><path d="M33 36h50"/><path ${F} d="M42 42l12-4 4 12-12 4zM60 48l12 2-2 12-12-2z"/>`,
  ],
  record: [
    `<circle ${F} cx="54" cy="42" r="30"/><circle cx="54" cy="42" r="6"/><circle cx="54" cy="42" r="18"/><path d="M104 8L80 40"/>`,
  ],
  sake: [
    `<path ${F} d="M34 74V40c0-10 8-14 8-22V8h12v10c0 8 8 12 8 22v34z"/><path d="M38 52h20"/><path ${F} d="M72 52h22l-3 22H75z"/>`,
    `<path ${F} d="M28 34l20-10h44L72 34z"/><path ${F} d="M28 34h44v36H28z"/><path ${F} d="M72 34l20-10v36L72 70z"/><path d="M40 46h20"/>`,
  ],
  izakaya: [
    `<path ${F} d="M44 14c-14 10-14 46 0 56h32c14-10 14-46 0-56z"/><path d="M40 14h40M40 70h40M60 14V4M36 28h48M34 42h52M36 56h48"/>`,
    `<path ${F} d="M50 20h32v52H50z"/><path d="M82 30h8c4 0 6 3 6 6v16c0 3-2 6-6 6h-8M50 20c2-8 30-8 32 0"/><path ${F} d="M10 62c8-14 28-16 36-6-8 12-28 14-36 6z"/><path d="M20 58c2-3 4-3 6 0M30 56c2-3 4-3 6 0"/>`,
  ],
  sushi: [
    `<path ${F} d="M10 60h100v8H10z"/><path ${F} d="M18 58c0-10 6-14 18-14s18 4 18 14z"/><path ${F} d="M14 50c6-10 32-12 44-4-10 4-30 8-44 4z"/><path ${F} d="M62 58c0-10 6-14 18-14s18 4 18 14z"/><path ${F} d="M58 50c6-10 32-12 44-4-10 4-30 8-44 4z"/><path d="M70 45l3 4M78 43l3 5M86 44l3 4"/>`,
    `<circle ${F} cx="28" cy="44" r="14"/><circle cx="28" cy="44" r="7"/><circle ${F} cx="60" cy="44" r="14"/><circle cx="60" cy="44" r="7"/><circle ${F} cx="92" cy="44" r="14"/><circle cx="92" cy="44" r="7"/><path d="M14 66h92"/>`,
  ],
  seafood: [
    `<ellipse ${F} cx="60" cy="50" rx="24" ry="14"/><path d="M52 36l-2-8M68 36l2-8M36 52l-14 6M36 58l-12 10M84 52l14 6M84 58l12 10M40 42c-10-2-18-10-16-22 6 0 10 4 10 10M80 42c10-2 18-10 16-22-6 0-10 4-10 10"/><circle cx="50" cy="26" r="2.5"/><circle cx="70" cy="26" r="2.5"/>`,
    `<path ${F} d="M14 40c14-18 50-22 74 0-24 22-60 18-74 0z"/><path ${F} d="M88 40l18-14v28z"/><path d="M42 30c4 6 4 14 0 20"/><circle cx="28" cy="38" r="3"/>`,
    `<path ${F} d="M14 42h92c0 16-20 28-46 28S14 58 14 42z"/><circle ${F} cx="28" cy="38" r="4"/><circle ${F} cx="36" cy="34" r="4"/><circle ${F} cx="44" cy="38" r="4"/><path ${F} d="M52 40c6-12 22-14 28-4zM64 40c6-12 22-14 28-4z"/><path d="M44 70h32"/>`,
  ],
  yakitori: [
    `<path d="M6 28h108M6 54h108"/><rect ${F} x="22" y="20" width="16" height="16" rx="3"/><rect ${F} x="42" y="22" width="10" height="12" rx="3"/><rect ${F} x="56" y="20" width="16" height="16" rx="3"/><rect ${F} x="76" y="22" width="10" height="12" rx="3"/><rect ${F} x="30" y="46" width="16" height="16" rx="3"/><rect ${F} x="50" y="46" width="16" height="16" rx="3"/><rect ${F} x="70" y="46" width="16" height="16" rx="3"/>`,
    `<path ${F} d="M14 46h92v24H14z"/><path d="M24 54h72M24 62h72M10 40h100M38 26c-3-5 3-8 0-14M60 26c-3-5 3-8 0-14M82 26c-3-5 3-8 0-14"/><rect ${F} x="28" y="34" width="12" height="12" rx="3"/><rect ${F} x="54" y="34" width="12" height="12" rx="3"/><rect ${F} x="80" y="34" width="12" height="12" rx="3"/>`,
  ],
  yakiniku: [
    `<circle ${F} cx="58" cy="44" r="30"/><path d="M36 30h44M30 40h56M30 50h56M36 60h44M104 8L82 38M112 12L88 40"/><path ${F} d="M40 32l16-4 4 12-16 4z"/><path ${F} d="M60 46l16-2 2 12-16 2z"/>`,
  ],
  curry: [
    `<ellipse ${F} cx="58" cy="52" rx="50" ry="18"/><path d="M20 52c0-10 12-14 24-12 6-6 18-4 20 4"/><path d="M60 46c12-6 30-6 38 4-6 8-24 10-38 6M100 6L84 36"/><circle cx="102" cy="6" r="4"/>`,
  ],
  soupcurry: [
    `<path ${F} d="M16 38h88c0 22-18 36-44 36S16 60 16 38z"/><path d="M64 36l16-22M20 42c12 4 28 4 40 0s28-4 40 0"/><circle cx="82" cy="10" r="4"/><circle cx="86" cy="14" r="4"/><path ${F} d="M28 36l10-18 6 18z"/><path d="M48 36c0-10 4-16 10-20"/>`,
  ],
  soba: [
    `<path ${F} d="M10 54h100l-8 14H18z"/><path ${F} d="M26 54c2-18 64-18 68 0z"/><path d="M34 48c8-6 16 2 24-4s16 2 24-4M48 32l4-4M60 30l3-5M72 32l4-4"/>`,
    `<path ${F} d="M14 42h92c0 16-20 28-46 28S14 58 14 42z"/><path ${F} d="M50 42c8-22 30-30 40-26-8 6-14 16-16 26z"/><path d="M90 16l8-10M90 16l12-2M22 48c12 4 28 4 38 0M44 70h32"/>`,
  ],
  korean: [
    `<path ${F} d="M18 38h84c0 20-18 34-42 34S18 58 18 38z"/><circle ${F} cx="60" cy="32" r="7"/><circle cx="60" cy="32" r="2.5"/><path d="M30 34l8-6M36 36l8-6M78 30l8 4M80 36l8 2M104 4L88 30"/>`,
  ],
  asian: [
    `<path ${F} d="M36 30h48l-6 44H42z"/><path d="M36 30l-6-12M84 30l6-12M30 18h60M50 30c0-10 2-18 6-24M62 30c0-10 2-18 6-24"/>`,
  ],
  japanese: [
    `<path ${F} d="M60 12c8 0 42 48 42 54 0 6-84 6-84 0 0-6 34-54 42-54z"/><path fill="currentColor" d="M46 52h28v18H46z"/>`,
    `<path ${F} d="M14 22h92v48H14z"/><path d="M60 22v48M60 46h46"/><path ${F} d="M68 30h28v10H68z"/><circle cx="28" cy="36" r="2"/><circle cx="40" cy="40" r="2"/><circle cx="32" cy="52" r="2"/><circle cx="46" cy="56" r="2"/><path d="M72 56c6-6 14-6 20 0"/>`,
  ],
  house: [
    `<path ${F} d="M22 40L60 10l38 30v34H22z"/><path d="M50 74V52h20v22M16 44L60 8l44 36"/>`,
    `<path d="M14 64V28M14 50h92v14M106 50v18M14 64v6"/><path ${F} d="M20 40h20v10H20z"/><path ${F} d="M44 40h62v10H44z"/>`,
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
  Ramen: 'ramen', 'Soba & Udon': 'soba', Jingisukan: 'jingisukan', Yakiniku: 'yakiniku', Yakitori: 'yakitori',
  Takoyaki: 'takoyaki', Chinese: 'chinese', Korean: 'korean', Asian: 'asian', Sushi: 'sushi', Seafood: 'seafood',
  Japanese: 'japanese', Curry: 'curry', 'Soup curry': 'soupcurry',
  Italian: 'italian', Spanish: 'spanish', French: 'wine', Wine: 'wine', Western: 'plate',
  Burgers: 'burger', Sandwiches: 'sandwich', Brunch: 'brunch', Bread: 'bread',
  Cakes: 'cakes', Parfait: 'parfait', 'Ice cream': 'icecream', Coffee: 'coffee', Tea: 'tea',
  Pub: 'pint', Beer: 'pint', Cocktails: 'cocktail', Whisky: 'cocktail', Sake: 'sake',
  Guesthouse: 'house', Hotel: 'house', Ryokan: 'house',
  // Types (used when no speciality has a drawing)
  Restaurant: 'plate', Izakaya: 'izakaya', 'Café': 'coffee', Bar: 'cocktail', 'Bakery & Sweets': 'cakes', Stay: 'house',
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
