# Project State — read me first

This file is the quick-context handoff between sessions. Update it at the end of each session
(the `end-of-day` skill can do this). Keep it short.

---

## Snapshot
- **Goal:** maximise sustained monthly income from an owned niche website. No fixed target/deadline — build a real asset and grow it.
- **Current phase:** Phase 3 — Traffic & monetisation. Phases 1 (scraper) and 2 (auto-build pipeline)
  are built and running, not just designed — see below.
- **Niche approach:** no longer "pick one" — the auto-build pipeline now ships a new branded site per
  approved Telegram alert. **8 real sites live** (e.g. `ironseam.vercel.app`), each its own brand/persona.
- **Monetisation:** Amazon Associates approved and live (`ironseam-21`) — affiliate buttons work and
  earn from day one on new builds. Real Vercel Web Analytics wired in on every site.
- **Current bottleneck:** traffic, not the pipeline — see `roadmap.md` "Immediate next step".

## Locked decisions (see decisions-log.md for full reasoning)
- Monetisation: **Affiliate + content** primary; lead-gen / paid-tool held as a hedge.
- Strategy: **Owned-asset demand mining** from Reddit (build a site we keep, not client work).
- Niche approach: **Emerging-trend surfing** — one quality site on a fast-riser with a lasting tail; fad "machine" comes later.
- Automation: Luke runs a **local AI scraper → Telegram alerts**; detects acceleration, cross-checks Google Trends. Spec in `reddit-scraper-brief.md`.
- Audience: target the **AI-chatbot buyer** (18–34, tech-comfortable, tier-one English). Now a scraper scoring parameter + subreddit bias. Full profile in `ai-visibility-playbook.md` Part C.
- Build: **auto-build pipeline** — Telegram `/build` → n8n → Claude Code (headless) → **Vercel** private preview → Telegram link → change loop → `/ship`. Reusable template built first. Spec in `auto-build-pipeline.md`.

## Key files
- `roadmap.md` — full phased plan.
- `decisions-log.md` — all strategic decisions.
- `reddit-scraper-brief.md` — spec for the local trend-scraping agent.
- `ai-visibility-playbook.md` — zero-click defence + GEO (earning AI citations).
- `auto-build-pipeline.md` — Telegram-triggered auto-build → Vercel preview → change loop.
- `site-content-model.md` — what each site actually contains (money/traffic/trust pages); wired into the template.
- `template/` — Astro site template. ✅ Built, tested, on GitHub (`Luke-AI-Developments/trend-site-template`, private), and LIVE on Vercel: https://template-virid-beta.vercel.app (auto-deploys on push to master). Home/detail/sitemap verified 200. SITE.url being corrected off example.com. Content-model structure, GEO, affiliate/ad/email components, config-driven. See `template/README.md`.
- `project-state.md` — this file.
- `CLAUDE.md` — shared context/conventions bridge (Cowork ↔ Claude Code); Claude Code auto-loads it.
- `pipeline/niche-researcher-agent.md` — spec for the research subagent that lifts content quality. **Implemented** as `.claude/agents/niche-researcher.md`, tested end-to-end (see CLAUDE.md).
- `hosting/oracle-n8n-setup.md` — always-on host guide. Oracle console setup PAUSED (needs human for free-Shape + SSH-key steps; nothing created, no charges).

## FOCUS (2026-07-29): PIPELINE LIVE, 8 SITES SHIPPED — TRAFFIC IS THE FRONTIER
Everything below this entry describes the pipeline being built and proven; it's now live and running
day to day. Since: webhook exposed via ngrok (session-bound, permanent fix is the VPS in `hosting/`);
niche-researcher subagent implemented and tested; affiliate-link 404 fixed (working Amazon search
links); template got a real visual redesign (hero, cards, colour theming, imagery via Unsplash);
sites got brandable names + invented personas instead of niche-slug URLs (decided 2026-07-25 — no
personal identifiers, no keyword-stuffed domains); Amazon Associates applied for and approved
(`ironseam-21`, live); `scraper/sync-to-n8n.js` built so scraper code changes push to the live n8n
workflow via its REST API instead of copy-paste; Vercel Web Analytics wired into every site; a
`/ship` bug (reported a per-deployment hash URL instead of the site's stable alias) found and fixed.
One real mistake happened and was caught fast during a retrofit-across-8-sites job — a broken local
folder got linked to someone else's unrelated Vercel project and briefly overwrote it, rolled back
within minutes via `vercel promote` once caught by content-checking the deploy target. Full detail on
all of this, day by day, is in `CLAUDE.md`'s Pending section (all ticked off) — that's the current
source of truth, not this file, going forward for build/pipeline changes. This file still tracks the
overall snapshot and phase.
**Next:** Phase 3 — seed real traffic from Reddit to the live sites (see `roadmap.md`), watch
conversion, log real numbers in `metrics-log.md` once there's a first week of them, and get Ironseam
to its first 3 qualifying Associates sales (the account stays provisional until then).

## FOCUS (2026-07-23): TELEGRAM PIPELINE BUILT, NEEDS WEBHOOK EXPOSURE DECISION
Both build steps from the 07-20 focus are now done:
(a) **`build-site-agent.md` proven by hand** — built site #1 for real: flight-sim-xbox, headless
`claude -p ... --dangerously-skip-permissions`, private GitHub repo, live on Vercel
(https://flight-sim-xbox.vercel.app), spot-checked in browser (pages, affiliate buttons, FAQ schema
all good). Found + documented that bare `vercel` isn't on PATH here — use `npx --yes vercel`
everywhere (already fixed in `build-site-agent.md` and the new prompt files below).
(b) **Telegram build/change/ship loop wired in n8n** — workflow "Telegram Build/Change Loop"
(24 nodes: routes `/build <niche>` / a plain-text reply (= change request) / `/ship` into three
branches, each running headless Claude or `npx vercel --prod` and reporting back to Telegram).
Exported to `pipeline/telegram-build-loop.n8n.json`. Every branch's logic tested (command strings,
regex URL extraction, the `cmd.exe` grouped-pipe pattern feeding `claude -p` via stdin — confirmed
end-to-end with a real call). Telegram credential reused from the scraper. Currently **inactive**.
Also found n8n 2.x disables the Execute Command node by default — needs `NODES_EXCLUDE=[]` set when
starting n8n, or the node doesn't even show up in the picker.
**Blocker before this can go live:** the Telegram Trigger needs a public HTTPS URL (Telegram calls
n8n's webhook) and n8n only runs on localhost right now — n8n's old `--tunnel` flag is gone, no
ngrok/tunnel installed. Needs a deliberate choice (ngrok, a fixed tunnel, or manual in-n8n testing
without exposing anything) — see `pipeline/n8n-telegram-wiring.md` "Blocker: exposing the webhook".
NEXT: (a) Luke decides the tunnel approach and we activate the workflow. (b) Real end-to-end Telegram
test. (c) GitHub publish prep (still pending): README/case-study, structure, .gitignore, secret scrub.

## STATUS (2026-07-17 late): ROOT CAUSE = 429 rate limit (over-testing)
Debug finally showed the truth: every Gemini call was **429 rate-limited** — from us hammering the free API with dozens of manual test runs all evening (and retrying 429s made it worse). The filter was fine; it just never got to run. Fixes: batch → 8, throttle → 6s, and retry now EXCLUDES 429 (only 503/500). Likely also hit the daily free quota tonight → may need to wait for reset (Google free tier resets ~daily).
**PLAN: stop manual testing. Let the 4-hourly schedule run overnight** — naturally spaced, only 8 posts/run at 6s gaps = well under limits. Check Telegram tomorrow for 💡 NICHE messages. If still 429 tomorrow, the free RPM is lower than assumed → raise throttle further or use gemini-2.0-flash-lite (higher free RPM).

## STATUS (2026-07-17 pm): Gemini node — added RETRY for 503s
Debug revealed the failures were **503 (Google overloaded)**, not key/model — key + model now correct. Added retry-with-backoff (429/500/503, 3 attempts) to both `monetisable-check-gemini.js` and the DEBUG version. Also: batch 5, throttle 2500. Reminder: every fresh paste of the file has the `YOUR_GEMINI_KEY` placeholder — must re-insert Luke's key each time.
**Sampling bug found & fixed:** batch=5 but 10 subs, round-robin samples first-5-only → was only checking the noisiest subs (AskReddit etc.) and NEVER the money-dense hobby subs. Reordered Config so hobby/product subs come FIRST (BuyItForLife, HomeImprovement, Fitness, Cooking, gardening, DIY, Frugal, YouShouldKnow, LifeProTips, AskReddit). This should be why no niches appeared. Next: run, confirm 💡 NICHE, watch 24h.

## STATUS (2026-07-17): LIVE, scheduled, in the 24h watch phase
Scheduled runs were erroring at Score & gate ("seenUrls undefined / push") after the temp reset line was removed — FIXED with a safety guard in `scoring-rss.js` (re-pasted). Cleanups done (production code, activated, key rotated). Now running every 4h; waiting to see if 💡 NICHE messages land. If nothing after ~24–48h, loosen the Gemini niche prompt (too strict).

## Scraper v4 + Gemini niche-finder: BUILT & RUNNING (pending real-world proof)
Full chain works end to end: big subs (/hot) → pre-filter (8 posts) → Gemini niche-finder (gemini-flash-latest, free tier, 4.5s throttle) → Telegram. Debugged through: undefined msg, URL double-=, model 404 (→gemini-flash-latest), rate-limit 429, 300s timeout (→batch cut to 8). NOT yet seen a positive niche verdict — AskReddit entertainment posts correctly rejected. LIVE TEST = watch Telegram over 24h; if silent, loosen the Gemini prompt (too strict).
Cleanup left for Luke: (1) ensure production code in Code node (not debug), (2) delete temp `staticData.seenUrls = []` reset line in Score & gate, (3) ACTIVATE workflow so Schedule Trigger runs every 4h, (4) rotate the Gemini key (was on screen).

## (earlier) agent find-logic → BIG SUBS + NICHE FINDER (v4)
Reframed: hunt popular posts on big mainstream subs (AskReddit, LifeProTips, YouShouldKnow, BuyItForLife, Frugal, HomeImprovement, Fitness, Cooking, gardening, DIY) via /hot, and let Gemini infer the monetisable niche (opportunity-finder, not product-detector).
Luke to update his live n8n:
1. Config node → new big-subs list.
2. RSS Read node → change URL to `/hot/.rss` (was /rising).
3. Score & gate node → paste new `scoring-rss.js` (lean pre-filter).
4. Add "Monetisable check" Gemini Code node between Score & gate and Telegram → paste `monetisable-check-gemini.js` + free Gemini key (aistudio.google.com).
Then run and judge the quality of niches surfaced. LLM = free Gemini tier. Importable file updated to v4.
NEXT after testing: resume building a site once a good NICHE lands (not the flight-sim product).

## Site #1 drafted (paused)
Niche: **Flight sim controllers for Xbox** ("Yoke & Throttle"). Trend hook: new 2026 Xbox controllers (Honeycomb Echo XPC, PowerA X-Ray) — not on sale yet, so they're the traffic hook; money comes from available gear (Thrustmaster HOTAS One, Turtle Beach VelocityOne). Content researched + drafted: `sites/flight-sim-xbox/CONTENT-PACK.md`. Build brief for Claude Code: `sites/flight-sim-xbox/CLAUDE-CODE-BUILD-BRIEF.md`. Next: Luke builds it in Claude Code → new Vercel project; then Amazon Associates signup + email provider + Reddit traffic.

## Next action
✅ SCRAPER LIVE + TUNED — recency gate (48h), cross-run de-dupe, cap 10, buying-intent flagged/sorted (BUY_ONLY=false; subreddits do the product filtering). Producing clean, fresh product-trend candidates.
Next: (1) run the FULL workflow to confirm alerts hit Telegram, (2) ACTIVATE it on the 4h Schedule Trigger and let it collect candidates over a few days, (3) start the SITE TEMPLATE + auto-build pipeline track so we're ready to build when a great trend lands. Subreddit list is now the main relevance dial. Later: restore upvote metrics via third-party Reddit API.

## Build decisions (session 2)
- Track: scraper first. Tech: **n8n**. Telegram bot: exists (needs chat ID). Reddit API app: not needed for v1 (public JSON), OAuth upgrade in v2.
- v1 files: `scraper/SETUP.md` (build recipe), `scraper/scoring.js` (Code-node logic).

## Open questions for Luke
1. Any non-negotiables (time budget per week, brand-safety, ethics)?
2. Template stack for later — Next.js on Vercel (proposed default)?

## Session log
- **2026-07-07:** Set direction. Reframed idea from client work → owned-asset demand mining. Chose affiliate-primary monetisation. Target moved to 7 Oct 2026. Chose emerging-trend surfing. Drafted scraper brief. Discussed realistic earnings (~£1–2k/mo for a winning site; goal reframed to maximise sustained income, no fixed target). Covered zero-click + GEO; created ai-visibility-playbook. Added audience targeting (AI-chatbot buyer). Designed auto-build pipeline (Telegram → n8n → Claude Code → Vercel preview → change loop). Made a strategy visualisation. Files: roadmap, decisions-log, scraper-brief, ai-visibility-playbook, auto-build-pipeline, project-state.
