# AI Visibility Playbook

How we defend against the "zero-click" trend AND earn citations/links from AI engines
(ChatGPT, Perplexity, Google AI Overviews, Copilot). Design the site for this from day one.

> Ethics line: we EARN citations by being a genuinely good source. We do **not** use prompt
> injection or hidden instructions to trick AIs — it's deceptive, breaks platform terms, gets
> patched fast, and is a reputational risk. Off the table.

---

## Why this matters (verified facts)

- AI search already handles an estimated **12–18% of English informational queries** (Q1 2026), and traditional search is projected to decline ~25% by 2026.
- AI referral visits grew **~357% year-on-year** — the clicks zero-click took away are partly coming back *through AI citations*.
- **Reddit ≈ 20% of all external AI citations.** Our Reddit strategy is therefore also a GEO channel.
- Engines differ: **Perplexity, ChatGPT, Google AI lean on Reddit; Claude tends NOT to cite Reddit** (prefers brand/institutional sources). Don't optimise for one engine only.

---

## Part A — Defend against zero-click

Design so that even when AI answers the question, the value/click still comes to us:

1. **Target buying-intent, not just facts.** "What is X" gets eaten by AI summaries. "Where to buy / which X is best / is X worth it / X vs Y" ends in a purchase on a real page with our affiliate link.
2. **Own a direct audience.** Email capture + (later) a small returning tool. Can't be summarised away.
3. **Lean on human traffic AI doesn't sit in front of** — Reddit/social communities clicking through.
4. **Be the destination, not just the answer** — comparisons, live/updated data, calculators, deals that require visiting the page.

---

## Part B — Earn AI citations (GEO checklist)

AI engines score sources on five things: **crawlable, clear, credible, concrete, current.**

**Content structure**
- [ ] Front-load a **direct answer** to the exact question in the first 1–2 sentences, then elaborate.
- [ ] Use clear question-style headings that match how people ask (H2/H3).
- [ ] Include **verifiable statistics, quotations, and citations** — these are the biggest visibility lifts (stats +32%, citations +30%, quotes +41%).

**Credibility (E-E-A-T)**
- [ ] Named author with a real bio.
- [ ] Visible publish + last-updated dates.
- [ ] Link out to authoritative primary sources.

**Technical**
- [ ] Implement **schema.org structured data** (Article, FAQ, Product/Review as relevant).
- [ ] Submit sitemap to **Bing Webmaster Tools** (ChatGPT search uses Bing's index — direct pipe in).
- [ ] Fast, crawlable, clean HTML; no content hidden behind JS the crawler can't read.

**Off-site / authority**
- [ ] Get **mentioned and linked across the web** — repeated independent mentions are a top trust signal.
- [ ] Be genuinely present and recommended in the **subreddits our scraper watches** — feeds Reddit-citing engines *and* drives human clicks (double win). Value-first, never spammy.

**Freshness (our edge)**
- [ ] Publish **early** on emerging trends and keep pages updated — Perplexity favours recent, tightly-relevant pages. Being first to cover a trend helps us get cited, not just ranked.

---

## Part C — Who we're writing for (the AI-chatbot audience)

If AI referral is a core channel, we should target trends the AI-chatbot crowd actually cares
about and buys. Verified profile of who uses AI chatbots in 2026:

- **Young-skewing:** ~53% of ChatGPT users are 18–34, and the 18–24 group is heavily
  over-represented (nearly 2x their share of Google users). Usage drops steeply above 55.
- **Near gender parity now:** ~55% male / 45% female (was ~80% male at launch — women are the fast-growing half).
- **Educated & higher-income:** adoption rises sharply with education (postgrad/degree far more than high-school-only). This is a relatively affluent, tech-comfortable audience.
- **Geography:** US + India dominate usage. For *our money* (ad RPM + affiliate value) the tier-one English markets matter most: **US, UK, Canada, Australia, NZ**.
- **Engine skews:** ChatGPT/Claude skew younger; **Perplexity skews mid-career** — a slightly older, research-heavy buyer.

**What this means for niche selection:**
- Favour trends that land with **18–34, tech-comfortable, tier-one, decent-disposable-income** users — e.g. consumer tech/gadgets, gaming, hobbies, productivity, fitness/wellness, home & kitchen gadgets, pets, and (given near gender-parity) beauty/fashion.
- Be cautious with niches skewing **55+** — the AI-referral channel is weak there (they can still work via other traffic, but they're off-strategy for us).
- **Bias toward tier-one-English discussion** — better ad rates, higher-value affiliate buyers, and it satisfies premium ad networks' tier-one traffic requirement.

> This profile is now a scraper parameter — see `reddit-scraper-brief.md` §4 & §6a (audience fit).

## How this plugs into the roadmap

- **Phase 2 (build):** bake in schema, author bios, dates, direct-answer formatting, Bing sitemap, email capture.
- **Phase 3 (traffic):** Reddit presence does double duty as traffic + GEO; track whether we start appearing in AI answers.

## To verify during build
- Current Bing Webmaster / ChatGPT indexing steps (moves fast).
- Which engines are actually sending us referrals (check analytics referrers for perplexity.ai, chatgpt.com, etc.).
