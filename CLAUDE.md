# CLAUDE.md — project context (read this first)

This file is the shared brain between the **Cowork** assistant (strategy, design, docs, the n8n
scraper) and **Claude Code** sessions (building/running/deploying code). Both work in this same
folder. Cowork writes specs here; Claude Code implements them and writes status back.

## What this project is
An end-to-end system that finds monetisable niches from Reddit, judges them with an LLM, and
auto-builds + deploys affiliate content sites. Goal: sustained passive income; portfolio piece for an
AI-technician. Full write-up in `README.md`.

## The system (4 parts)
1. **Niche-finder (scraper)** — n8n workflow: big-subreddit `/top?t=week` RSS → pre-filter (`scraper/scoring-rss.js`) → Gemini niche judge (`scraper/monetisable-check-gemini.js`, free tier) → Telegram. Working; needs an always-on host (see `hosting/`). Code changes sync to the live workflow via `scraper/sync-to-n8n.js` (n8n REST API) instead of manual copy-paste.
2. **Site template** — `template/` (Astro, SEO/GEO-ready). On GitHub as `trend-site-template`. Each site is generated from it.
3. **Build-site agent** — `pipeline/build-site-agent.md`: niche → researched content → build → deploy to Vercel → prints `LIVE_URL:`. Proven (built `flight-sim-xbox.vercel.app`).
4. **Telegram auto-build pipeline** — `pipeline/n8n-telegram-wiring.md` + `pipeline/telegram-build-loop.n8n.json`: `/build <niche>` → n8n Execute Command → headless `claude -p` → deploy → reply. Live via ngrok while the laptop's up.

## Conventions & gotchas (important — learned the hard way)
- **Vercel:** the bare `vercel` binary isn't on PATH — always use `npx --yes vercel` (authed as `luke-ai-developments`).
- **n8n Execute Command node:** disabled by default in n8n 2.x — start n8n with `NODES_EXCLUDE=[]` or the node won't appear.
- **Gemini key:** every fresh paste of `monetisable-check-gemini.js` resets the key to the `YOUR_GEMINI_KEY` placeholder — re-insert the real key. Once working, edit in place, don't re-paste.
- **Gemini rate limits (free tier):** keep batches small + throttled; don't retry 429s (makes it worse); retry only 503/500. Model: `gemini-flash-latest`.
- **ngrok tunnel:** free URL rotates on restart; processes are session-bound (die on reboot). Permanent fix = the Oracle VM (`hosting/oracle-n8n-setup.md`).
- **Unsplash key (imagery):** builds only fetch real hero/lead photos if `UNSPLASH_ACCESS_KEY` is set in the environment n8n was started in (same pattern as `NODES_EXCLUDE`/`WEBHOOK_URL` — export it before `n8n start`). Without it, sites still look designed (hero/card gradients + fuller colour theme), just no photos. Never commit the key.
- **Content integrity (non-negotiable):** never fake hands-on testing; write from specs + real owner reports, transparently; only real, sourced facts; prices are "approx / check current". See `site-content-model.md`.
- **Secrets:** never commit keys/tokens/chat-IDs. Files use placeholders; `.gitignore` covers env/node_modules.
- **n8n API key:** needed to run `scraper/sync-to-n8n.js` (`N8N_API_KEY=<key> node scraper/sync-to-n8n.js`). Generate from n8n Settings → n8n API. Never commit it; pass it inline or export it per-session.

## Key files
- `roadmap.md`, `decisions-log.md`, `project-state.md` — strategy, decisions, current status.
- `scraper/` — the niche-finder (n8n JSON + code + SETUP).
- `template/` — the Astro site template.
- `pipeline/` — build-site agent, Telegram wiring, and specs to implement.
- `hosting/` — Oracle always-on setup.
- `01 Daily Logs/` — the build journey.

## Pending — specs for Claude Code to implement
- [x] **Tighten scraper freshness further — "top post from the last few hours".** Implemented
  2026-07-26. Flagged the `t=hour` sparse-results trade-off to Luke first (per the note below, kept for
  the record) — he chose to proceed. `scraper/scoring-rss.js` already had `MAX_AGE_HOURS` 36 → 6 from
  Cowork; ran `node scraper/sync-to-n8n.js --rss-url ".../top/.rss?t=hour&limit=25"` to push that plus
  the new `RSS Read` URL into the live workflow. Verified directly against the API: `active` stayed
  `true`, `versionId === activeVersionId`, `RSS Read` url and `MAX_AGE_HOURS = 6` both confirmed live.
  **Watch alert volume over the next day or two** — if `t=hour` comes back too sparse on quieter
  subreddits (the flagged risk), the fix is reverting to `t=day` or relaxing `MAX_PER_SUB`/subreddit
  list, not a bug to chase.
  <details><summary>Original heads-up (for the record)</summary>
  Reddit's `t=hour` bucket is thin for smaller/niche subreddits — top-of-the-last-hour on a quieter sub
  may return very few or zero posts, so some runs could come back sparse. This is a real trade-off of
  "last few hours" vs the fuller `t=day` pool, not a bug.
  </details>

- [x] **Fix stale scraper alerts (posts several days old).** Implemented 2026-07-25. Root cause: the
  earlier BuyItForLife-diversity fix switched the RSS feed to `/top?t=week` and widened `MAX_AGE_HOURS`
  to 168 to match — a real tradeoff, not a bug, but it meant alerts surfaced posts that had been at the
  top of the week for days. Cowork had already edited `scraper/scoring-rss.js` (`MAX_AGE_HOURS` 168 →
  36); ran `node scraper/sync-to-n8n.js --rss-url ".../top/.rss?t=day&limit=25"` to push both that and
  the new `RSS Read` URL (`t=day` instead of `t=week`) into the live workflow. Verified directly against
  the API afterward: `active` stayed `true`, `versionId === activeVersionId`, `RSS Read` url and
  `MAX_AGE_HOURS = 36` both confirmed live. Watch the next few Telegram alerts to confirm ages read
  same-day/~1-day in practice.

- [x] **Niche-researcher subagent** — implemented 2026-07-25, tested end-to-end 2026-07-25. Added
  `.claude/agents/niche-researcher.md` (web search + WebFetch + Write/Read, writes `research-brief.md`).
  `build-site-agent.md` and `pipeline/build-site-agent-prompt.txt` updated: step 3 invokes the subagent
  instead of researching inline, step 4 writes content FROM the brief. Confirmed working on the
  `cast-iron-carbon-steel-care` build — `research-brief.md` was produced and the agent used it to
  refine the niche and write sourced content.

- [x] **Fix affiliate links (was 404).** Implemented 2026-07-25. `AffiliateButton.astro` now accepts a
  `product` prop and auto-builds `https://www.amazon.co.uk/s?k=<product>&tag=<amazonTag>` whenever `url`
  is missing/`AFFILIATE_URL` (works with no tag too — just doesn't earn until Associates is approved).
  `guides/[...slug].astro` passes `product={p.name}` automatically from frontmatter. Both build prompts
  updated to require a `product="<exact name>"` prop on every button. Verified with `npm run build`.
  **Not yet retrofitted to already-live sites** (flight-sim-xbox, durable-travel-luggage,
  ergonomic-office-furniture, manual-reel-mowers all still have the old broken component + literal
  `AFFILIATE_URL` hrefs) — only fixes future builds unless someone asks for a retrofit pass.

- [x] **Visual design & imagery** — fully implemented and verified 2026-07-25. Template: fuller theme
  (`primary`/`primaryDark`/`secondary`/`surface` in `site.mjs`), new `Hero` component (gradient fallback
  when no image), card-grid layout with thumbnails on home + all three list pages, optional lead image
  (`image`/`imageAlt`/`imageCredit` frontmatter) on detail pages. Verified in browser via `npm run
  preview` — hero, cards, and detail pages all render correctly with the gradient fallback.
  Real Unsplash fetching: the first live build (`cast-iron-carbon-steel-care`) skipped it — the agent's
  own check for `UNSPLASH_ACCESS_KEY` turned out unreliable, not a real inheritance failure (a direct
  `process.env` check inside the same n8n Execute Command process confirmed the key genuinely was
  present). Rewrote the check to be shell-agnostic (`node -e "console.log(process.env.UNSPLASH_ACCESS_KEY
  ? 'YES' : 'NO')"` instead of `$VAR`/`%VAR%` expansion, which differs by shell) in both
  `build-site-agent.md` and `pipeline/build-site-agent-prompt.txt`.
  **Re-tested in isolation 2026-07-25** (piped the corrected step through `claude -p` the same way n8n
  does, env var set the same way): env check printed YES, Unsplash search + download succeeded, saved a
  real 496KB JPEG — opened and visually confirmed it's a genuine, on-topic, well-composed stock photo
  (cast iron skillet + spatula + towel), not corrupt/placeholder data. The fix works end to end. Not yet
  seen on a *full* site build with the corrected check (next `/build` will confirm in that context too).
  Still not retrofitted to already-live sites.

- [x] **Auto-sync scraper code into live n8n (via the n8n REST API).** Implemented 2026-07-25 as
  `scraper/sync-to-n8n.js`. `GET`s the live "Reddit Trend Scraper" workflow (`H65TBTLODwCOlvpD`),
  updates the `Score & gate` node from `scraper/scoring-rss.js`, optionally sets `RSS Read`'s url
  (`--rss-url "<url>"`), and `PUT`s it back. Usage: `N8N_API_KEY=<key> node scraper/sync-to-n8n.js
  [--rss-url "..."]` (key from n8n Settings → n8n API, never committed).
  Two things learned building it, worth knowing:
  - The `PUT` schema rejects most of what `GET` returns for `settings` ("must NOT have additional
    properties") and separately requires `settings` to be present at all — the fix is sending back
    only `{ executionOrder: "v1" }`, not the full object GET gives you.
  - **The `gemini api` node (`monetisable-check-gemini.js`) is deliberately never auto-synced.** The
    on-disk file still ships the `YOUR_GEMINI_KEY` placeholder (per the gotcha above) while the live
    node has the real key hand-edited in — a naive sync would have clobbered a working key with the
    placeholder. The script only touches it with `--include-gemini`, and even then refuses if the
    disk file still has the placeholder string.
  **First job applied and verified 2026-07-25:** `Score & gate` now runs the latest `scoring-rss.js`
  (`MAX_PER_SUB` 2, `MAX_TO_CHECK` 16) and `RSS Read` now points at
  `.../top/.rss?t=week&limit=25`. Confirmed the live workflow's `versionId === activeVersionId` after
  the push, and `active` stayed `true` throughout — the official API applies cleanly in one step,
  **no manual re-activate needed** (checked directly against the DB, not assumed).

## How to collaborate through this file
- **Cowork:** add designs/specs under "Pending"; keep conventions + state current.
- **Claude Code:** on start, read this file. Implement pending items, tick them off, and note what changed in `project-state.md` (or append a line here). Flag anything that contradicts a convention above.
