# Site Content Model

What every generated site actually contains — beyond the affiliate links. This is the structure the
template ships with by default, so each site is a real, useful resource (not a thin doorway site
that gets penalised).

> Core principle: the affiliate links are the *money*, but the **content is the reason the site
> exists**. No genuine content = no traffic, no citations, no trust, no income.

---

## The three content layers

### Layer 1 — Money pages (buying intent → where affiliate links live)
These convert visitors into commissions.
- **Hub buying guide** — "Best [category] for [use case] (2026)". The centrepiece; links out to the reviews.
- **Individual reviews / deep-dives** — one per key product (pros/cons, who it's for, specs, verdict).
- **Comparisons** — "[Product] vs [Product]", "[Product] alternatives".
- **"Is [X] worth it?"** verdict pages — high buying-intent, easy to rank/cite.

### Layer 2 — Traffic + trust pages (informational, no hard selling)
These pull SEO + AI citations and make the site look legitimate.
- **How-to / setup guides** — "How to [do the thing]".
- **Explainers** — "What is [X] / how does it work".
- **Troubleshooting** — "Why does [X] keep doing [Y]" / common fixes.
- **FAQ** in direct-answer format — GEO gold; this is what AI engines quote.

### Layer 3 — Trust + legal pages (E-E-A-T + required)
These decide whether Google/AI trust the site at all.
- **About** page with a real author bio.
- **Review methodology** — how we assess products (short, honest).
- **Affiliate disclosure** (legally required), **privacy policy**, **contact**.

---

## The content brief writes itself

The scraper flags a trend *because people are asking about it on Reddit*. So **those threads ARE the
content brief and keyword list.** For each site:
1. Pull the top questions/pain points from the Reddit threads that triggered the alert.
2. Each recurring question → one page (FAQ entry, how-to, or comparison).
3. The buying intent in those threads → the money pages.

You're not inventing what to write — the demand hands it to you.

---

## Integrity rules (non-negotiable — keeps us off the penalty list)

- **Never fake hands-on** ("I tested this") for products we don't own. Google's helpful-content
  system and readers both punish it, and it's dishonest.
- **Honest angles that work without owning the product:**
  - Synthesise **real user experience** transparently — "what owners actually report" (from the same
    Reddit threads + reviews).
  - Lean on **buying guides, comparisons, explainers** — these don't require personal testing.
- **AI-assisted, human-edited.** Draft with AI (fast), but fact-check and give every page a real
  angle. Mass-produced slop = thin-content penalty + no trust.
- **Genuinely useful or it doesn't ship.** The test: would someone from the target subreddit find
  this page actually helpful?

---

## Starter site = ~10–12 pages

A first site should launch with roughly:
- 1 hub buying guide
- 3–4 reviews / comparisons
- 3–4 informational / FAQ pages
- Trust + legal pages

Enough to be a genuine resource, not a thin flip. Grow the winners; archive the duds.

---

## How this wires into the build

- The **template** (`auto-build-pipeline.md`) ships with these page types as scaffolding + the GEO
  structure from `ai-visibility-playbook.md` (direct-answer format, schema, author/date fields).
- When Claude Code builds a site, its brief = this model + the Reddit threads for that trend.
- So every generated site arrives with the right shape by default; we fill it with trend-specific,
  honestly-sourced content.
