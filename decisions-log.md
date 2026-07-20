# Decisions Log

A running record of strategic decisions, with reasoning and assumption-vs-fact flags.
Newest entries at the top.

---

## 2026-07-14 — Session 4 (cont.): Big subs + niche finder (v4)

Bigger reframe (Luke's call): stop mining obvious product subs (r/gadgets = everything's a product,
no edge). Instead hunt **popular posts on big mainstream subreddits** via the **/hot** feed and let
the LLM **infer the monetisable niche** — an opportunity-finder, not a product-detector. This is
closer to Luke's original vision (big, well-subscribed communities reveal rising interests/needs
before they're obvious niches; lower competition).

Changes:
- Subreddits → AskReddit, LifeProTips, YouShouldKnow, BuyItForLife, Frugal, HomeImprovement, Fitness, Cooking, gardening, DIY.
- RSS feed → `/hot` (popular) instead of `/rising`.
- `scoring-rss.js` → now a lean pre-filter (de-dupe, recency 72h, interleave across subs, cap 20 for the LLM). Dropped the product-keyword heuristics (Gemini judges now).
- `monetisable-check-gemini.js` → prompt changed from "buyable product today" to "monetisable niche/opportunity"; fails CLOSED (drop on uncertainty, since mainstream feed is noisier). Alert now shows niche + angle.
- Importable file updated to v4.

---

## 2026-07-14 — Session 4: Refine find-logic (hype vs buyable)

Insight from the flight-sim niche: the agent surfaced a trend whose headline product (new Xbox
controllers) isn't on sale yet — so the find-logic wasn't distinguishing "buyable NOW" from "hype
about something coming". Fix (heuristics layer): `scoring-rss.js` v3 drops pure-hype posts
(announcement/leak/pre-order words with no buying signal) and boosts buyable-now signals; subreddit
list re-curated toward buying-decision communities. Next (agreed): add an **LLM monetisability node**
in n8n that judges each survivor ("is there a product buyable on Amazon today? name it") for real
accuracy — needs an LLM API key.

Also decided: don't fully automate n8n→Claude Code build yet (prove one site first; unsupervised
content = quality/honesty risk; auto-agent on Reddit-derived input = prompt-injection surface). Keep
the human approval + content vetting in the loop.

Site #1 (flight sim) content was drafted but paused in favour of fixing the upstream find-logic.

---

## 2026-07-08 — Session 2: Scraper LIVE (RSS pivot)

Reddit blocked both the unauthenticated JSON feed (403) and legacy API-app creation for Luke's
account (create-app button did nothing; email verify didn't help). **Pivoted to Reddit RSS** via
n8n's RSS Read node (`/r/{sub}/rising/.rss`) — no app, no OAuth, no captcha. Pipeline now works end
to end: Config → RSS Read → Score & gate → Telegram, messages landing on Luke's phone.
Trade-off: RSS has no upvote/comment counts, so we rely on Reddit's own `/rising` ranking +
buying-intent keywords; exact metrics to be restored later via a third-party Reddit API.
Files: `scraper/reddit-scraper.v2-rss.n8n.json`, `scraper/scoring-rss.js`, `scraper/SETUP.md`.
Telegram gotcha logged: must message the bot first (`/start`) or it returns "chat not found".

---

## 2026-07-08 — Session 2: Scraper gating funnel

### Decision 7 — Two hard gates before any alert (Trends demoted to a signal)
**Chosen: the scraper only messages Luke when a candidate passes two gates** — (1) strong, *accelerating* Reddit activity above an activity floor (enough upvotes/comments on a big-enough sub to redirect real traffic), and (2) affiliate/monetisable (a real buyable product with a commission path).

**Google Trends is NOT a gate.** Rationale (Luke's call): the Reddit post activity already proves demand and can drive the initial traffic itself, so gating on Trends would miss genuinely early movers it hasn't caught up to. Trends stays as a *bonus signal* — it boosts the score and informs the lasting-tail (fad-vs-trend) read.

Scoring (audience fit, buying intent, Trends strength, lasting tail) only *ranks* survivors — it no longer decides whether Luke hears about them. Gate 2 (affiliate) is essentially "is this a real product I can sell?"; Amazon Associates covers most physical products (v1 uses a lightweight product-existence check, not the PA-API, which needs qualifying sales). Updated in `reddit-scraper-brief.md` §3b, §5, §5a.

---

## 2026-07-07 — Session 1 (cont.): Goal reframed

### Decision 6 — Drop the fixed £100/mo-by-date target
**Chosen: goal is now "maximise sustained monthly income" with no fixed number or deadline.** Luke found the £100 target irrelevant — the real aim is as much lasting income as possible.

Kept as *context* (not targets): a site earning ~£100/mo needs roughly 8–12k visitors/mo; a strong single site can reach ~£1–2k/mo over time. These are expectation-setting figures, not goals.

Note: the project's saved settings still list the old £100/07-09-2026 target — flagged for Luke to update in project settings.

---

## 2026-07-07 — Session 1: Foundations

### Decision 1 — Monetisation model
**Chosen: Affiliate + content as the primary/owned-asset model, with the niche selected so a lead-gen or paid-tool upgrade is possible.**

Reasoning: goal is *passive* income, low budget, beginner. Affiliate is the cheapest, lowest-risk, most genuinely passive foundation. Lead-gen earns faster but is really a sales business (not passive). A digital tool suits Luke's AI skills but carries "nobody buys" risk on attempt one. Keep lead-gen/tool as a hedge if affiliate proves too slow.

Options considered:
- Affiliate + content — cheap, passive, compounds; slow to rank. **← chosen (primary)**
- Lead generation — fastest to cash, high value/visitor; requires outreach/sales, least passive. **← reserve lever**
- Digital product/tool — owns margin, fits skills; build + market risk. **← reserve lever**
- Display ads — hands-off; needs ~30–50k pageviews/mo for £100. **← rejected as primary, too slow**

### Decision 2 — Reddit strategy
**Chosen: Owned-asset demand mining** — scrape Reddit for recurring unmet needs and build a site we own and monetise.

Reasoning: only this option produces a passive, compounding asset. "Build-for-others/spec sites" is freelancing (one-off pay, not passive). "Blend" splits a beginner's focus. Keeps Luke's speed/24hr-build instinct and his idea of prioritising high-view posts on large subreddits as demand signals.

### Reframe agreed
Luke's original idea ("find people longing for a website, build in 24hr") was reframed from *client work* to *demand mining for an asset we keep* — same scraping, same speed, but pointed at a site we own.

### Assumptions flagged
- Meaningful income from a new site takes time; early traffic must come from Reddit, not SEO. (Assumption based on standard SEO ramp times — to be validated.)

### Still TBD
- The niche itself (Phase 1 output).
- Hosting/tech stack for the build.

---

## 2026-07-07 — Session 1 (cont.): Niche approach & automation

### Decision 3 — Niche selection approach
**Chosen: Emerging-trend surfing** — target topics with fast-growing interest that also have a lasting tail, build ONE owned site done well. Graduate to a rapid "fad machine" later once the pipeline is proven.

Reasoning: Luke wants explosive traction (fad-style, e.g. Labubu). Pure fads spike then die (a treadmill, not passive). Emerging trends spike *and settle into lasting niches* (e.g. air fryers 2020) — giving explosive early traffic AND a passive tail. Start with one quality site (lower risk, proves the whole pipeline), then automate a portfolio later.

Options considered:
- Emerging-trend surfing — one quality owned site, passive tail. **← chosen**
- Fad portfolio/machine — 24hr throwaway sites, ride & repeat; more work, less passive. **← later phase**
- Both at once — splits a first-timer's focus. **← rejected for now**

### Key caveat recorded
For fast-moving trends, **SEO won't rank in time** — early traffic must come from being early on Reddit/social. SEO becomes the passive engine only for trends with a lasting tail. Hence: catching trends *early* is the whole game.

### Automation (Luke's build)
Luke will run a **local AI scraping agent on his laptop** that alerts his **Telegram** when it finds something. Agent must detect *acceleration* (not just popularity), cross-check **Google Trends** to confirm real rising search demand, and send a decide-in-30-seconds alert. Full spec: `reddit-scraper-brief.md`.

### Monetisation note
The trend angle reinforces (does not change) the affiliate-primary decision — hot products = things people buy. It's a topic/timing filter, with display ads capturing traffic spikes.

### Decision 4 — Target audience = the AI-chatbot buyer
**Chosen: aim niches at who actually uses AI chatbots**, since AI-referral is a core traffic channel. Added as a scraper scoring parameter (audience fit, weight 15/100) and a subreddit-selection bias.

Verified 2026 profile (sources in this session): AI-chatbot users skew **18–34** (18–24 heavily over-represented, usage drops above 55), **near gender-parity** (~55/45 M/F, women fastest-growing), **educated & higher-income**, concentrated in **US + India** but our money-markets are **tier-one English** (US/UK/CA/AU/NZ). ChatGPT/Claude skew younger; Perplexity skews mid-career.

Implication: favour consumer tech, gaming, hobbies, productivity, fitness/wellness, home & kitchen gadgets, pets, beauty/fashion; go easy on 55+ niches. Full write-up in `ai-visibility-playbook.md` Part C.

### Decision 5 — Auto-build pipeline
**Chosen: a Telegram-triggered pipeline that auto-builds a private preview site, with a plain-English change loop.** Full spec: `auto-build-pipeline.md`.

Chain: Telegram `/build <trend>` → **n8n** orchestrator → **Claude Code (headless)** filling a reusable template → quality gate → **Vercel private preview** → Telegram sends the link → Luke requests changes in plain English (incremental rebuilds) → `/ship` promotes to production.

Key calls:
- **Vercel** for hosting (Luke has an account) — preview deployments for review, nothing public until `/ship`.
- **Reusable template built first** — the agent fills in the niche, doesn't invent architecture. This is what makes 24–72h reliable.
- **Two human gates kept:** idea approval and go-live approval. Everything between is automated.
- Guardrails: quality gate before sending link, cost metering, scoped/secure agent, secrets in env vars.

To verify at build: exact Claude Code headless commands, Vercel CLI/token setup, Telegram↔n8n webhook wiring (all move fast).
