// Copy the fonts the site uses into public/fonts, so pages never depend on
// Google Fonts (blocked in mainland China, and one less third party).
// Only the needed weights, only .woff2 files; the CSS keeps its unicode-range
// slices, so a browser downloads just the characters a page actually uses.
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, rmSync } from 'node:fs';
import { p, log } from './lib.mjs';

const SETS = {
  archivo: { pkg: '@fontsource-variable/archivo', css: ['wdth.css'] },
  'noto-sans-jp': { pkg: '@fontsource/noto-sans-jp', css: ['700.css', '900.css'] },
  'noto-sans-kr': { pkg: '@fontsource/noto-sans-kr', css: ['500.css', '700.css', '900.css'] },
  'noto-sans-sc': { pkg: '@fontsource/noto-sans-sc', css: ['500.css', '700.css', '900.css'] },
  'noto-sans-thai': { pkg: '@fontsource/noto-sans-thai', css: ['500.css', '700.css', '900.css'] },
};
rmSync(p('public/fonts'), { recursive: true, force: true });
let files = 0;
for (const [name, { pkg, css }] of Object.entries(SETS)) {
  const out = p('public/fonts', name);
  mkdirSync(p(out, 'files'), { recursive: true });
  let all = '';
  for (const c of css) {
    // keep only the woff2 source
    all += readFileSync(p('node_modules', pkg, c), 'utf8').replace(/,\s*url\([^)]*\.woff\)\s*format\('woff'\)/g, '');
  }
  for (const [, f] of all.matchAll(/url\(\.\/files\/([^)]+\.woff2)\)/g)) { copyFileSync(p('node_modules', pkg, 'files', f), p(out, 'files', f)); files++; }
  writeFileSync(p(out, 'fonts.css'), all);
}
log(`fonts: ${files} files copied to public/fonts`);
