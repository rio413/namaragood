// Cheap hourly check: has anything in the Notion database been edited since the
// last build? Prints changed=true|false for GitHub Actions. One API call.
import { appendFileSync } from 'node:fs';
import { p, readJson, writeJson, log } from './lib.mjs';

const TOKEN = process.env.NOTION_TOKEN;
const DB = process.env.NOTION_DATABASE_ID;
const out = (changed) => {
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `changed=${changed}\n`);
  log(`changed=${changed}`);
};

const res = await fetch(`https://api.notion.com/v1/databases/${DB}/query`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${TOKEN}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' },
  body: JSON.stringify({ page_size: 1, sorts: [{ timestamp: 'last_edited_time', direction: 'descending' }] }),
});
if (!res.ok) { log(`Notion check failed (${res.status}); building anyway`); out(true); process.exit(0); }
const latest = (await res.json()).results?.[0]?.last_edited_time || '';
const state = readJson(p('data/cache/state.json'), {});
const changed = latest !== state.lastEdited;
if (changed && process.argv.includes('--save')) writeJson(p('data/cache/state.json'), { lastEdited: latest });
out(changed);
