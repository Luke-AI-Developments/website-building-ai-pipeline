# Niche-Finder → Auto-Build: an AI pipeline for passive-income websites

An end-to-end system that **finds monetisable niches from Reddit, judges them with an LLM, and
auto-builds and deploys affiliate content sites** — orchestrated with n8n, Google Gemini (free tier),
Claude Code, Astro and Vercel.

Built as a hands-on AI-automation project: real APIs, real rate limits, real debugging. This repo is
both the working system and a case study of how it was designed and built.

---

## What it does

```
Reddit (big subs, /hot)  →  n8n pre-filter  →  Gemini LLM "is this a monetisable niche?"
        →  Telegram alert  →  you approve  →  Claude Code builds a site from a template
        →  Vercel deploy  →  link back to Telegram  →  you request changes / ship it
```

1. **Find** — an n8n workflow pulls popular posts from big mainstream subreddits (not obvious product
   subs), de-dupes, and hands a small batch to **Gemini** which judges whether each reveals a niche
   an affiliate site could monetise — inferring the angle, not just matching keywords.
2. **Alert** — qualifying niches are pushed to **Telegram** with the niche + suggested angle.
3. **Build** — you reply to approve; **Claude Code** (headless) generates a full site from a reusable
   **Astro template** (buying guides, reviews, comparisons, FAQ), honestly sourced, GEO/SEO-ready.
4. **Deploy** — it ships to **Vercel** and texts you the live link; you approve or request changes.

## Why these choices

- **Big mainstream subreddits, not product subs** — the edge is spotting a rising interest in a huge
  community *before* it's an obvious niche. An LLM infers the money angle.
- **LLM as the filter, keywords as the cheap pre-pass** — keywords protect the API budget; the LLM
  makes the actual judgment. Runs on Gemini's free tier.
- **Template + agent, not hand-coding each site** — the reusable Astro template means the build agent
  fills in a niche rather than reinventing a website; fast and consistent.
- **Human in the loop on purpose** — you approve the niche and review the site. The automation does
  the grunt work; a person guards quality and honesty.

## Tech

n8n · Google Gemini API (free tier) · Claude Code (headless build agent + research subagent) ·
Astro + MDX · Vercel · Unsplash API · Telegram Bot API · Reddit RSS

## Repo map

| Path | What |
|---|---|
| `roadmap.md`, `decisions-log.md` | Strategy + every decision, with reasoning |
| `reddit-scraper-brief.md` | The niche-finder's design (gates, scoring, signals) |
| `scraper/` | n8n workflow (JSON) + Code-node logic + setup + Gemini niche-finder + REST API sync script |
| `ai-visibility-playbook.md` | Zero-click / GEO strategy + audience profile |
| `site-content-model.md` | What every generated site contains, and the integrity rules |
| `template/` | The reusable Astro site template (SEO/GEO-ready) — also its own repo |
| `pipeline/` | The auto-build agent, research subagent spec, Telegram→Claude Code wiring, visual design spec |
| `.claude/agents/` | The niche-researcher subagent Claude Code runs before writing any content |
| `sites/` | Build docs for the first (hand-built) site — each generated site deploys to its own repo |
| `01 Daily Logs/` | The build journey, day by day (the real, messy process) |

## See it live

**[ironseam.vercel.app](https://ironseam.vercel.app)** — one of 8 real sites the pipeline has built and
deployed end to end, monetising through a live, approved Amazon Associates account
(`ironseam-21`). Real Vercel Web Analytics is wired in on every site.

## Status / honesty

- **Niche-finder:** built and running on a 4-hourly schedule; the main constraint is keeping it on an
  always-on host (currently a laptop → moving to a small VPS, see `hosting/`). Free-tier rate limits
  require gentle, spaced runs. Code changes now sync into the live n8n workflow via a REST API script
  (`scraper/sync-to-n8n.js`) instead of manual copy-paste.
- **Auto-build pipeline:** live end-to-end. `/build <niche>` on Telegram → n8n → a headless Claude Code
  agent researches the niche (a dedicated research subagent, sourced not improvised), invents a
  brandable name and persona, picks a niche-appropriate colour palette + real stock photography, and
  deploys to its own Vercel project — then texts the link back. Reply with a change, or `/ship` to go
  to production. **8 real sites** have been built this way end-to-end (see `sites/` and the daily logs).
- **Monetisation:** real Amazon Associates account, approved and live (`ironseam-21`) — affiliate
  buttons resolve to working search links from day one, and earn the moment a real tag is set. Traffic
  is the current bottleneck, not the pipeline.
- **Deliberately unfinished in public:** this is a live learning project, not a polished product —
  content quality gets a human review before any site goes live, and some fixes (a visual redesign,
  working affiliate links) landed after the first few sites shipped, so not every live site has every
  improvement yet. That gap is tracked, not hidden.

## What I learned

Working through real 403 / 404 / 429 / 503 / timeout errors across Reddit, Gemini and n8n; a
draft-vs-published versioning gotcha in n8n's workflow API that silently kept an old, buggy version
live after a "fix"; why an agent's own runtime check for an env var can lie even when the variable is
genuinely there (shell-syntax dependent checks vs. reading `process.env` directly); why a CLI's own
stdout is the wrong thing to relay verbatim (a per-deployment URL leaked to Telegram instead of the
stable site alias); why you prove a core capability by hand before automating it; LLM-as-a-filter
design and cost control on a free tier; and headless-agent build pipelines end to end, including a
deploy-target collision a live build caught and self-corrected, and a retrofit-across-many-sites job
where content-checking every target before trusting a name match caught a real mistake (a broken local
folder linked to someone else's unrelated live project) within minutes instead of leaving it live.
The `01 Daily Logs/` folder is the unedited trail.

---

*Not financial advice; affiliate content is created to be genuinely useful, with honest sourcing and
disclosure.*
