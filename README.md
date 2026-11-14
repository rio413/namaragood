# NAMARA GOOD.

Where a local actually eats and drinks in Sapporo. Good is good. That's it.

You write places in **Notion**. Every hour, GitHub checks Notion; if anything changed it rebuilds the site, translates new notes into Korean, Chinese, Thai and Vietnamese, finds each place on Google Maps, and publishes to **Cloudflare Pages**. You never touch code to add a place.

```
Notion (Places)  →  GitHub Actions (hourly)  →  Cloudflare Pages
                     ├ read Notion
                     ├ find pins (Google Places)
                     ├ translate new notes (Claude)
                     └ build the site (Astro)
```

---

## Adding a place

1. Add a row in the Notion **Places** database: Name (romaji, as people would search it), Name (JA), Type, Speciality, Area, Maps link, Note.
2. Set **Status → Published**. Draft rows never appear on the live site.
3. Wait up to an hour, or publish now: GitHub → **Actions** → **Publish** → **Run workflow**.

Tips:
- **Note**: write as many paragraphs as you like; leave an empty line between them. **Bold**, *italic* and links are kept. The first paragraph is shown larger, so make it the hook.
- **Tip**: an optional heads-up box (queues, closed days).
- **Maps link**: the share link from Google Maps. The pin comes from the place name in that link. If a pin lands in the wrong spot, type the correct **Lat** and **Lng** in Notion; they win.
- **Status → Closed** takes a place off the site without deleting your notes.
- Numbers (#01, #02 …) follow the order you added places and never change, even if you rename one. Page addresses never change either, so shared links keep working.
- Edited a note? Only that note is re-translated. Translations are saved in `data/cache/translations.json`; you can fix a wording there by hand in GitHub and it will stick until you edit the English.

---

## One-time setup

Do these once, in this order. Nothing here needs code. **Never paste a key into a chat or a file in this repo**: keys only go into GitHub's Secrets page (step 5).

### 1. Notion key
1. Go to <https://www.notion.so/profile/integrations> → **New integration**. Name it `namara-site`, type **Internal**, capabilities **Read content** only.
2. Copy the **Internal Integration Secret** (keep it for step 5 → `NOTION_TOKEN`).
3. Open the **Places** database in Notion → `•••` menu → **Connections** → add `namara-site`. (Without this the build sees an empty database.)

### 2. Google Cloud (pins and the map)
In <https://console.cloud.google.com> pick or create a project with billing on (the monthly free credit covers a site this size).

1. **APIs & Services → Library**: enable **Places API (New)** and **Maps JavaScript API**.
2. **Credentials → Create credentials → API key** twice:
   - Key A, the server key → `GOOGLE_PLACES_KEY`. Edit it: *API restrictions* → **Places API (New)** only. *Application restrictions*: none (GitHub has no fixed IP).
   - Key B, the browser key → `PUBLIC_GOOGLE_MAPS_KEY`. *API restrictions* → **Maps JavaScript API** only. *Application restrictions* → **Websites**: `namaragood.com/*`, `*.namaragood.com/*`, `namaragood.pages.dev/*`, `*.namaragood.pages.dev/*`, `localhost:4321/*`. Key B is visible to anyone who views the page, which is normal; the restrictions are what protect it.
3. Optional, for the custom dark map: **Map Management → Create Map ID** (JavaScript, Vector), then **Map Styles** → create a style (start from *Dark*, hide points of interest and business labels) and attach it to the Map ID. Put the Map ID in GitHub **Variables** as `PUBLIC_GOOGLE_MAP_ID`. Until then the map uses Google's standard dark scheme.
4. **Billing → Budgets & alerts**: set a budget alert (e.g. ¥3,000) so nothing surprises you.

### 3. Anthropic key (translations)
<https://console.anthropic.com> → **API Keys** → create `namara-site` → `ANTHROPIC_API_KEY`. Set a monthly spend limit under **Limits**. Translating a note costs a fraction of a yen; only new or edited notes are translated.

### 4. Cloudflare Pages
1. Sign in at <https://dash.cloudflare.com>. The Pages project `namaragood` is created automatically on the first publish.
2. **My Profile → API Tokens → Create Token** → template **Edit Cloudflare Workers** (or custom: *Account → Cloudflare Pages → Edit*) → `CLOUDFLARE_API_TOKEN`.
3. Your **Account ID** is on the Workers & Pages overview, right-hand side → `CLOUDFLARE_ACCOUNT_ID`.
4. When you own the domain: project → **Custom domains** → add `namaragood.com` and `www.namaragood.com`.

### 5. Put the keys in GitHub
This repo → **Settings → Secrets and variables → Actions**.

**Secrets** tab → *New repository secret*, one per line:

| Name | From |
|---|---|
| `NOTION_TOKEN` | step 1 |
| `GOOGLE_PLACES_KEY` | step 2, key A |
| `PUBLIC_GOOGLE_MAPS_KEY` | step 2, key B |
| `ANTHROPIC_API_KEY` | step 3 |
| `CLOUDFLARE_API_TOKEN` | step 4 |
| `CLOUDFLARE_ACCOUNT_ID` | step 4 |

**Variables** tab (optional, none are secret):

| Name | Value |
|---|---|
| `SITE_URL` | `https://namaragood.com` once the domain is live (default `https://namaragood.pages.dev`) |
| `PUBLIC_GOOGLE_MAP_ID` | your Map ID from step 2.3 |
| `INCLUDE_DRAFTS` | `1` to show Draft places too, while testing. Set back to `0` before you share the site |

### 6. First publish
**Actions** → **Publish** → **Run workflow**. Takes about two minutes. The site appears at `https://namaragood.pages.dev`.

---

## Running it on your own computer (optional)

```bash
npm install
npm run data:sample   # sample data, no keys needed (pins are rough test positions)
npm run dev           # http://localhost:4321
```
With real data: copy `.env.example` to `.env`, fill it in (it is git-ignored), then `npm run data && npm run dev`.

## Where things live

| What | Where |
|---|---|
| Button and heading wording, all languages | `src/i18n/ui.js` |
| Tag names (Ramen, Susukino …) in each language | `src/i18n/tags.js` (new Notion options are translated automatically into `data/cache/tags.json`) |
| Line drawings and which speciality gets which | `src/lib/drawings.js` |
| Colours, type, layout | `src/styles/global.css` |
| Translation instructions (tone, glossary) | `scripts/translate.mjs` |
| Publishing schedule | `.github/workflows/publish.yml` |
