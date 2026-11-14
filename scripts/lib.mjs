// Shared helpers for the data scripts. No dependencies on purpose.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const p = (...parts) => resolve(ROOT, ...parts);

// Minimal .env loader (GitHub Actions passes real env vars; .env is for local runs).
export function loadEnv() {
  const file = p('.env');
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
  }
}
loadEnv();

export function readJson(path, fallback) {
  try { return JSON.parse(readFileSync(path, 'utf8')); } catch { return fallback; }
}
export function writeJson(path, data) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
}

export const sha = (s) => createHash('sha256').update(s).digest('hex').slice(0, 16);

export function slugify(s) {
  return String(s)
    .normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/&/g, ' and ')
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'place';
}

export const LANGS = ['en', 'ko', 'zh', 'th', 'vi'];
export const TARGET_LANGS = ['ko', 'zh', 'th', 'vi'];

export function log(...a) { console.log('[namara]', ...a); }
export function fail(msg) { console.error('[namara] ERROR:', msg); process.exit(1); }
