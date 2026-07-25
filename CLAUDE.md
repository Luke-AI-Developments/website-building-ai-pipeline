# CLAUDE.md — project context (read this first)

This file is the shared brain between the **Cowork** assistant (strategy, design, docs, the n8n
scraper) and **Claude Code** sessions (building/running/deploying code). Both work in this same
folder. Cowork writes specs here; Claude Code implements them and writes status back.

## What this project is
An end-to-end system that finds monetisable niches from Reddit, judges them with an LLM, and
auto-builds + deploys affiliate content sites. Goal: sustained passive income; portfolio piece for an
AI-technician. Full write-up in `README.md`.

## The system (4 parts)
1. **Niche-finder (scraper)** — n8n workflow: big-subreddit `/hot` RSS → pre-filter (`scraper/scoring-rss.js`) → Gemini niche judge (`scraper/monetisable-check-gemini.js`, free tier) → Telegram. Working; needs an always-on host (see `hosting/`).
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

## Key files
- `roadmap.md`, `decisions-log.md`, `project-state.md` — strategy, decisions, current status.
- `scraper/` — the niche-finder (n8n JSON + code + SETUP).
- `template/` — the Astro site template.
- `pipeline/` — build-site agent, Telegram wiring, and specs to implement.
- `hosting/` — Oracle always-on setup.
- `01 Daily Logs/` — the build journey.

## Pending — specs for Claude Code to implement
- [x] **Niche-researcher subagent** — implemented 2026-07-25. Added `.claude/agents/niche-researcher.md`
  (web search + WebFetch + Write/Read, writes `research-brief.md`). `build-site-agent.md` and
  `pipeline/build-site-agent-prompt.txt` (the headless/Telegram version) both updated: step 3 now
  invokes the subagent instead of researching inline, and step 4 writes content FROM the brief.
  Not yet tested end-to-end (no build run since the change) — next `/build` will be the first real
  test; compare resulting site to `flight-sim-xbox` per the spec's suggested test.

- [x] **Fix affiliate links (was 404).** Implemented 2026-07-25. `AffiliateButton.astro` now accepts a
  `product` prop and auto-builds `https://www.amazon.co.uk/s?k=<product>&tag=<amazonTag>` whenever `url`
  is missing/`AFFILIATE_URL` (works with no tag too — just doesn't earn until Associates is approved).
  `guides/[...slug].astro` passes `product={p.name}` automatically from frontmatter. Both build prompts
  updated to require a `product="<exact name>"` prop on every button. Verified with `npm run build`.
  **Not yet retrofitted to already-live sites** (flight-sim-xbox, durable-travel-luggage,
  ergonomic-office-furniture, manual-reel-mowers all still have the old broken component + literal
  `AFFILIATE_URL` hrefs) — only fixes future builds unless someone asks for a retrofit pass.

- [x] **Visual design & imagery** — structurally implemented 2026-07-25, imagery half untested (needs a
  key). Template: fuller theme (`primary`/`primaryDark`/`secondary`/`surface` in `site.mjs`), new `Hero`
  component (gradient fallback when no image), card-grid layout with thumbnails on home + all three list
  pages, optional lead image (`image`/`imageAlt`/`imageCredit` frontmatter) on detail pages. Verified in
  browser via `npm run preview` — hero, cards, and detail pages all render correctly with the gradient
  fallback (no photos needed to look designed). Both build prompts updated: palette selection always
  runs; real Unsplash photo fetching only runs if `UNSPLASH_ACCESS_KEY` is set in the environment,
  otherwise skipped gracefully. **Needs `UNSPLASH_ACCESS_KEY` supplied** (free key from
  unsplash.com/developers) to actually test the imagery half — same pattern as the other env vars
  (`NODES_EXCLUDE`, `WEBHOOK_URL`): export it before starting n8n so headless builds inherit it. Also
  not retrofitted to already-live sites.

## How to collaborate through this file
- **Cowork:** add designs/specs under "Pending"; keep conventions + state current.
- **Claude Code:** on start, read this file. Implement pending items, tick them off, and note what changed in `project-state.md` (or append a line here). Flag anything that contradicts a convention above.
