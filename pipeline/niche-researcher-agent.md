# Niche-Researcher Subagent

A dedicated research pass that runs **before** any writing, so the build agent writes from a rich,
sourced brief instead of rushing research inline. This is the biggest quality lever we have: deep,
accurate research is what separates an earning site from thin affiliate spam.

## Where it fits

```
/build <niche>  →  Niche-Researcher subagent  →  research-brief.md  →  Site-builder writes content
                                                                       from the brief → build → deploy
```

The site-builder agent (`build-site-agent.md`) calls this researcher FIRST, gets `research-brief.md`,
and only then writes the pages.

## The subagent's job (its focused prompt)

> You are a product-research specialist for affiliate content sites. Given a NICHE, research it
> thoroughly using web search and output a single structured brief. Depth and accuracy matter more
> than speed. Use real, current sources; never invent products, prices, or specs; flag anything
> uncertain. Output ONLY the brief in the format below.

## Output: `research-brief.md`

```
# Research brief — <niche>

## Niche overview
- What it is, who buys, why now (2–4 sentences).

## Target buyer
- Who they are, budget range, what they care about, common mistakes.

## Products (4–8 real, buyable now)
For each: name · approx price range · 2–3 genuine pros · 1–2 real cons · who it's best for · source link.

## Buying considerations
- The 4–6 things that actually matter when choosing in this niche (spec, material, size, etc.).

## Top questions & pains (for FAQ / articles)
- 6–10 real recurring questions people ask (from Reddit/forums/search), each with a short honest answer.

## Comparison angles
- The 2–3 "X vs Y" or "best for [use case]" comparisons worth a page.

## What owners actually report
- Honest sentiment summary from real reviews/threads — the good and the annoying.

## Sources
- The URLs used (so claims are checkable).

## Integrity flags
- Anything uncertain, unavailable, or that shouldn't be claimed as tested.
```

## Integrity rules (carry into the writing)
- Only real, sourced facts. No invented specs/prices. Flag uncertainty.
- Never claim hands-on testing of products not owned — write from specs + owner reports, transparently.
- Prices are "approx / check current" (they move); the affiliate button says "Check price" anyway.

## How to integrate (for Claude Code)
1. Add it as a Claude Code **subagent**: `.claude/agents/niche-researcher.md` with the focused prompt
   above and **web search enabled**.
2. In `build-site-agent.md`, add a first step: "Invoke the `niche-researcher` subagent for NICHE →
   save `research-brief.md`." Then have the content-generation steps **draw from `research-brief.md`**
   (products list, FAQ, comparisons, angle) instead of researching inline.
3. Keep everything else (build, verify, deploy, print `LIVE_URL:`) the same.

## Trade-offs
- Adds one research pass → more time + Claude usage per build. Worth it for quality; watch it if you
  batch many sites.
- Raises the content baseline; does NOT replace Luke's yes/nay review of the finished site.

## Suggested test
Run one build **with** the researcher and compare the pages to the flight-sim site (built without it)
— the guide/reviews should be noticeably more specific, better-sourced, and more useful.
