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

n8n · Google Gemini API (free tier) · Claude Code (headless build agent) · Astro + MDX · Vercel ·
Telegram Bot API · Reddit RSS

## Repo map

| Path | What |
|---|---|
| `roadmap.md`, `decisions-log.md` | Strategy + every decision, with reasoning |
| `reddit-scraper-brief.md` | The niche-finder's design (gates, scoring, signals) |
| `scraper/` | n8n workflow (JSON) + Code-node logic + setup + Gemini niche-finder |
| `ai-visibility-playbook.md` | Zero-click / GEO strategy + audience profile |
| `site-content-model.md` | What every generated site contains, and the integrity rules |
| `template/` | The reusable Astro site template (SEO/GEO-ready) — also its own repo |
| `pipeline/` | The auto-build agent + Telegram→Claude Code wiring |
| `sites/` | Example content pack for a specific niche |
| `01 Daily Logs/` | The build journey, day by day (the real, messy process) |

## Status / honesty

- **Niche-finder:** built and working; the main constraint is keeping it on an always-on host
  (currently a laptop → moving to a small VPS). Free-tier rate limits require gentle, spaced runs.
- **Auto-build pipeline:** the Claude Code build agent + Telegram wiring are designed and being
  proven by hand before full automation.
- **Deliberately unfinished in public:** this is a live learning project, not a polished product.

## What I learned

Working through real 403 / 404 / 429 / 503 / timeout errors across Reddit, Gemini and n8n; why you
prove a core capability by hand before automating it; LLM-as-a-filter design and cost control on a
free tier; and headless-agent build pipelines. The `01 Daily Logs/` folder is the unedited trail.

---

*Not financial advice; affiliate content is created to be genuinely useful, with honest sourcing and
disclosure.*
