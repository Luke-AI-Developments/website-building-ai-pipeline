# Reddit Trend-Scraper — Build Brief

Spec for the local AI agent that finds fast-emerging trends on Reddit and alerts Telegram.
Hand this to Claude Code / n8n as the requirements doc.

---

## 1. Objective

Catch topics with **fast-growing interest, early**, that have a plausible **lasting tail** and a
**product to buy** (so we can monetise with affiliate). Alert Luke on Telegram the moment a
candidate crosses the bar, with enough info to judge it in 30 seconds.

We are NOT looking for "already popular." We are looking for **acceleration** — things on the way up.

---

## 2. What to watch (input)

**Subreddit strategy — two buckets:**
- **Discovery subs** (where trends surface early): r/trend, r/OutOfTheLoop, r/BuyItForLife, r/gadgets, r/ProductPorn, r/Aliexpress, r/TikTokMade­MeBuyIt, r/coolgadgets, plus large general subs (r/AskReddit, r/mildlyinteresting) filtered by topic.
- **Money subs** (confirm buying intent): product/hobby subs where people ask "where do I buy X", "is there a site for X", "which one should I get".

> Start with ~15–25 subreddits. Keep the list in a config file so it's easy to edit. We'll refine it after the first batch of results.

**Bias the subreddit list toward our audience** (see `ai-visibility-playbook.md` Part C): the
AI-chatbot buyer skews **18–34, tech-comfortable, educated, tier-one English markets** (US/UK/CA/AU/NZ),
near gender-parity. Prefer subs matching that profile; go easy on ones skewing 55+.

---

## 3. The signal: detect ACCELERATION, not popularity

For each candidate topic/keyword, the agent tracks these over a rolling window (e.g. last 24–72h vs the previous period):

- **Mention velocity** — rate of *new* posts/comments mentioning it, and whether that rate is *increasing*.
- **Upvote acceleration** — how fast top posts are gaining upvotes (upvotes ÷ hours since posted).
- **Cross-sub spread** — the same topic appearing in *multiple* subreddits (strong signal it's breaking out).
- **Buying-intent language** — posts containing "where to buy", "is there a site/app for", "which one should I get", "worth it?", "dupe for".
- **Newness** — topic barely existed in the window before (a spike from near-zero beats a steady high).

A topic scores high when it is **rising fast, spreading across subs, and people want to buy.**

---

## 3b. Gating funnel — must pass BOTH gates before Luke is messaged

Cheap check first; only run the pricier check on survivors; only alert on qualified items.
A candidate that fails a gate is dropped silently (logged, not alerted).

1. **Gate 1 — Strong, accelerating Reddit activity** (cheapest, from data already scraped). Two parts:
   - *Accelerating* — mentions + upvotes rising fast (see §3), AND
   - *Activity floor* — enough real engagement (upvotes/comments) on a big-enough subreddit that redirecting from the post could send meaningful traffic. This is our "highly-viewed post on a well-subscribed sub" rule. Below the floor → drop.
2. **Gate 2 — Affiliate / monetisable** (see §5a). Is it a real buyable product with a commission path? No product / no affiliate path → drop.

**Google Trends is NOT a gate** — the Reddit activity already proves demand, and gating on Trends would miss genuinely early movers it hasn't caught up to yet. Trends is a *bonus signal* that boosts the score and the lasting-tail read (see §5).

Only candidates that clear both gates get **scored** (§4) and sent to Telegram.

## 5a. Affiliate / monetisability check (Gate 2)

The real question: *"is this an actual product I can sell?"* — not a meme, event, or vague concept.
This gate alone kills every trend we can't make money from.

- For **physical products, Amazon Associates covers almost everything** — if it's buyable, an Amazon affiliate link basically always exists. So the check is mostly "is there a real product behind this trend?"
- The agent reports one of three levels:
  - **On Amazon** → baseline commission available (pass).
  - **Higher-paying brand/network program likely** (e.g. via Impact, ShareASale, Awin, CJ) → better payout (pass, flagged as a bonus).
  - **No affiliate path found** → drop.

> Caveat to verify at build: Amazon's **Product Advertising API needs qualifying sales before access** (chicken-and-egg on a new account). For v1, use a lightweight "does the product exist on Amazon / does a brand program exist" check, NOT the PA-API. Respect Amazon Associates ToS on data use.

---

## 4. Scoring — ranks the survivors (tune after first run)

Scoring does NOT decide *whether* Luke hears about a candidate (the gates in §3b do that) —
it decides **priority/order** among candidates that already passed all gates.

Suggested weighted score (0–100):

- Mention velocity / acceleration — 25
- Cross-sub spread — 15
- Buying-intent signals — 20
- Google Trends strength (see §5) — 15
- **Audience fit** (AI-chatbot demo + tier-one market — see §6a) — 15
- Lasting-tail gut-check (see §6) — 10

**Ordering:** send higher-scoring candidates first / more prominently.

---

## 5. Google Trends — bonus signal (not a gate)

The Reddit activity in Gate 1 already proves demand, so Trends does NOT decide whether Luke is
alerted. Instead the agent queries **Google Trends** for the keyword and uses it to:

- **Boost the score** when search interest is rising/breakout (a strong candidate that will also earn SEO traffic later).
- **Inform the lasting-tail read** (§6) — a rising search curve is the clearest sign a trend will outlive its Reddit spike, i.e. an emerging trend vs a pure fad.
- A flat or absent Trends does **not** kill a candidate with strong Reddit activity — it may just be early. Report it as "search: rising / flat / not yet" so Luke can judge.

> Assumption to verify: reliable programmatic Google Trends access (e.g. the `pytrends` library) — it's unofficial and can rate-limit. Flagged for the build phase.

---

## 6. Fad vs emerging-trend filter (the money judgment)

This is the call that separates a treadmill from a passive asset. For each candidate the agent
adds a quick note (and Luke/mentor makes the final call):

- **Fad markers** (spike-and-die): novelty toy, meme-driven, no repeat-purchase, no utility.
- **Emerging-trend markers** (lasting tail): solves a real ongoing need, repeat purchases, a growing *category* not a single item, adjacent products exist.

We prioritise emerging trends. Pure fads get logged but not built (yet).

## 6a. Audience-fit check (does it match our AI-chatbot buyer?)

Because AI-referral is a core traffic channel, favour trends that fit who actually uses AI chatbots
(full profile in `ai-visibility-playbook.md` Part C). The agent scores audience fit higher when:

- The topic appeals to **18–34, tech-comfortable, educated** users (consumer tech, gaming, hobbies, productivity, fitness/wellness, home & kitchen gadgets, pets, beauty/fashion).
- Discussion is concentrated in **tier-one English markets** (US/UK/CA/AU/NZ) — better ad rates + higher-value affiliate buyers.
- It is NOT skewing heavily **55+** (weak AI-referral channel — downgrade, don't discard).

Signals the agent can use: subreddit's known demographic, language/spelling/currency in posts (£/$/AU$), and topic category.

---

## 7. Telegram alert format (decide in 30 seconds)

Each alert should contain:

```
🚨 TREND ALERT — [keyword]   Score: 78/100

Why flagged: mentions +340% in 48h · seen in 4 subs · strong buying intent
Google Trends: RISING (breakout)
Fad-vs-trend: leans EMERGING (repeat-purchase category)
Audience fit: STRONG (18–34 tech, mostly US/UK)
Gates passed: strong Reddit activity ✓ · affiliate ✓
Search trend: rising (bonus) — or "flat / not yet"

Top threads:
  • [title] — 2.1k upvotes, r/gadgets — [link]
  • [title] — 800 upvotes, r/TikTokMadeMeBuyIt — [link]

Affiliate: on Amazon (baseline) + brand program likely — higher payout
```

Keep it skimmable. Links must be clickable so Luke can verify the source instantly.

---

## 8. Cadence & housekeeping

- Run on a schedule (e.g. every 2–4h). Overnight batching is fine.
- **De-dupe:** don't re-alert the same topic within X days unless its score jumps.
- Log every candidate (even below-threshold) to a local file/DB so we can review patterns weekly.

## 9. Guardrails — verify before building

- **Reddit API terms & rate limits changed significantly in 2023** and may have changed again. Before building, confirm current free-tier limits, auth, and acceptable-use rules. *(Assumption — needs verification; I can research current terms if you want.)*
- Respect rate limits; use official API + OAuth, not aggressive HTML scraping, to avoid bans.
- Store any API keys/tokens in env vars, never in the code.

---

## 10. Open questions for Luke

1. Build stack — n8n, Python, or Claude Code generating a script? (You've used all three.)
2. Is Reddit API access already set up, or do we sort that first?
3. Telegram bot — already have one, or shall we create the bot + get the chat ID?
