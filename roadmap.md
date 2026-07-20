# Roadmap — Passive Income Niche Website

**Goal:** maximise **sustained monthly income** from a niche website we own — build a real asset that grows and keeps earning.
**Owner:** Luke · **Mentor:** Claude

> No fixed revenue deadline. We build steadily, get to first real income, then compound it. Weekly phase timings below are a build cadence, not a revenue clock.
> Note: the project's saved settings still list an old "£100/mo" target — worth updating in project settings so it matches this.

---

## The core strategy (one sentence)

Use a local AI scraper to catch **fast-emerging trends** on Reddit *early*, pick one with a lasting tail, build a site we **own** fast with Claude Code, and monetise primarily with **affiliate + content** (plus ads on the traffic spike) — with lead-gen/paid-tool held as a hedge.

**Niche approach:** emerging-trend surfing (one quality site first; fad "machine" later). **Automation:** local agent → Telegram alerts, detecting acceleration and cross-checking Google Trends. See `reddit-scraper-brief.md`.

---

## Phase 1 — Demand mining & niche validation  (Week 1–2)

Goal: pick ONE niche backed by evidence, not a hunch.

- Build the local scraping agent from `reddit-scraper-brief.md` (Telegram alerts).
- Detect *acceleration* (not just popularity); cross-check Google Trends to confirm real rising search demand.
- Score each candidate on: trend velocity, lasting-tail potential (fad vs emerging trend), monetisation path (affiliate payouts), competition, and traffic feasibility.
- Shortlist 3, then commit to 1.

**Deliverables:** `niche-candidates.md` (with sources), `niche-decision.md`.
**Exit test:** we can name the audience, the pain, the money model, and 3+ real Reddit threads proving demand.

## Phase 2 — Build  (Week 2–3, target 24–72hr active build)

Goal: a live, useful site that directly answers the validated pain.

- **First:** build the reusable site template (one-off) — layout, affiliate/ad slots, GEO structure, email capture, analytics, config file. See `auto-build-pipeline.md`.
- **Then:** stand up the auto-build pipeline — Telegram `/build` → n8n → Claude Code (headless) → **Vercel private preview** → Telegram link → plain-English change requests → `/ship` to go live.
- Site structure + 5–10 genuinely useful pages/tools, generated into the template.
- Affiliate links / product placed from day one; hosting on **Vercel**.

**Deliverables:** template repo, working pipeline, live URL, `build-notes.md`.
**Exit test:** a stranger from the target subreddit would find it useful and trust it.

## Phase 3 — Traffic & monetisation  (ongoing)

Goal: real visitors, then real income — growing month over month.

- Seed traffic from the subreddits that revealed the need (value-first, not spam).
- Layer in SEO for compounding long-term traffic.
- Watch conversion; if affiliate is too slow, pull the lead-gen / paid-tool lever.
- Iterate weekly on what the data says; reinvest wins.

**Deliverables:** weekly `metrics-log.md` updates.
**Exit test:** first real, repeatable monthly income arriving — then it's about growing it.

---

## Guardrails (from project rules)

- Real research with sources; always flag assumption vs verified fact.
- Ask before big strategic choices; just execute the small ones.
- Every deliverable is a named file; `decisions-log.md` is kept current.
- Free/low-cost tools unless the ROI case is clear.

## Honest risk flags

- Meaningful income from a brand-new site takes time — Google is slow to trust new domains, so early traffic must come from Reddit, not SEO. For context: a site earning ~£100/mo needs roughly 8–12k visitors/mo; a strong single site can reach ~£1–2k/mo over time.
- Affiliate is the safest passive base but the **slowest to first cash**; the lead-gen/tool lever is our hedge.
- Reddit self-promotion rules are strict — we drive traffic by being genuinely useful, or we get banned.

## Immediate next step

Start Phase 1: define the subreddit list and the scoring method for demand mining.
