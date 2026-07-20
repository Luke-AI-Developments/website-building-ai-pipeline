# Reddit Trend Scraper — build (n8n)

> ⚠️ UPDATE: Reddit now blocks both the unauthenticated JSON feed (403) and legacy API-app
> creation for many accounts. We pivoted to the **RSS build** — no Reddit app, no OAuth, no captcha.
> **Use `reddit-scraper.v2-rss.n8n.json` + `scoring-rss.js`.** The v1 (JSON) instructions below are
> kept for reference / for if you later get authenticated API access.

## RSS build (current path)

1. Import **`reddit-scraper.v2-rss.n8n.json`** (Workflows → ⋯ → Import from File).
2. Open the **Telegram** node → add your bot credential (token) → set **Chat ID** to your number.
3. **Execute Workflow.**

Nodes: Manual Trigger → Config → **RSS Read** (`.../r/{{subreddit}}/rising/.rss`) → Score & gate
(`scoring-rss.js`) → Telegram.

What it does: Reddit's `/rising` feed already ranks posts *gaining traction*, so being in it is our
"accelerating" signal. The Score node de-dupes, flags buying-intent titles (🛒), and sends the top
20 to Telegram (buying-intent first).

**Known limits (by design, for now):** RSS has **no upvote/comment counts**, so there's no numeric
activity floor and no velocity — we're trusting Reddit's ranking plus keyword intent. We restore
exact metrics later via a proper API (authenticated Reddit, or a third-party Reddit API with a free
tier) once access is sorted.

**If the RSS Read node also 403s** (Reddit blocking RSS too): that's the cue for **Plan C — a
third-party Reddit API** (e.g. a RapidAPI endpoint, free tier: sign up, drop the API key in an HTTP
header). Tell me and I'll rebuild for that. It returns full data including upvotes.

## Tuning update (buying-intent filter + de-dupe + schedule)

Do this in your existing working workflow — no re-import needed (keeps your Telegram credential):

1. **Update the Score node:** open **Score & gate** → replace its code with the latest
   `scoring-rss.js`. Now it only alerts **buying-intent** posts, caps at 10 per run, and
   **remembers what it already sent** so it won't repeat posts on later runs.
   - First run after this still sends a batch (memory starts empty); it quiets down after that.
   - Want everything again temporarily? Set `BUY_ONLY = false` at the top.
2. **Add a Schedule Trigger** so it runs itself: add node → **Schedule Trigger** → set e.g. every
   **4 hours** → connect its output into the **Config** node (same as the Manual Trigger). Keep the
   Manual Trigger too, for testing.
3. **Activate** the workflow (top-right toggle) so the schedule actually fires.

> De-dupe note: n8n persists the "already alerted" memory as workflow static data, which saves after
> executions once the workflow is active. During manual test runs it may not always persist between
> runs — that's expected; it works properly once scheduled/active.

---

# v1 (JSON API) — reference only

Goal of v1: prove the whole pipe end to end — pull rising Reddit posts → apply Gate 1 (activity +
velocity) and a rough Gate 2 (buying intent) → get a Telegram alert. No Reddit login needed yet.

> Security: your Telegram bot token and any credentials go **into n8n only** — never paste them
> into chat. I don't need to see them.

---

## Step 1 — Get your Telegram chat ID (5 min)

Your bot can't message you until it knows your chat ID.

- Easiest: in Telegram, message **@userinfobot** — it replies with your numeric ID.
- Or: message your own bot once, then open
  `https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates` in a browser and read `"chat":{"id":...}`.

Keep that number handy for Step 2's Telegram node.

---

## Step 2 — Import the workflow (fastest)

In n8n: **Workflows → top-right menu (⋯) → Import from File** → pick
`reddit-scraper.v1.n8n.json` (this folder). All 5 nodes appear pre-wired. Then just:
- Open the **Telegram** node → add your bot credential (token) → set **Chat ID** to your number from Step 1.
- Hit **Execute Workflow**.

If import throws a node-version warning, it's usually harmless — open the flagged node and re-save it.
Prefer to build it by hand instead? Follow Step 2b below.

---

## Step 2b — Build the workflow manually (alternative)

Create a new workflow and add these 5 nodes, wired left to right:

**Manual Trigger → Code (Config) → HTTP Request → Code (Score & gate) → Telegram**

### Node 1 — Manual Trigger
Default. (We swap this for a Schedule Trigger once it works.)

### Node 2 — Code  · name it "Config"
- Mode: **Run Once for All Items**
- Paste:
```js
// Edit this subreddit list anytime (audience-fit, product-heavy subs)
const subreddits = [
  "gadgets",
  "TikTokMadeMeBuyIt",
  "BuyItForLife",
  "ProductPorn",
  "coolgadgets",
  "INEEEEDIT",
  "shutupandtakemymoney"
];
return subreddits.map(s => ({ json: { subreddit: s } }));
```

### Node 3 — HTTP Request
- Method: **GET**
- URL: `=https://www.reddit.com/r/{{ $json.subreddit }}/rising.json?limit=75`
- Options → **Send Headers** → add header `User-Agent` = `trend-scraper/0.1`
- (This runs once per subreddit automatically.)

### Node 4 — Code  · name it "Score & gate"
- Mode: **Run Once for All Items**
- Paste the contents of `scoring.js` (same folder as this file).

### Node 5 — Telegram
- Add your bot's credential (paste the token here, in n8n).
- Resource: **Message**, Operation: **Send Message**
- Chat ID: your numeric ID from Step 1
- Text: `={{ $json.message }}`

---

## Step 3 — Test

Click **Execute Workflow**. Within a few seconds you should get one Telegram message per
qualifying post (top 10 by score). If you get nothing, it usually means the gates are too strict —
lower `MIN_UPS` / `MIN_VELOCITY` in the Score node and re-run.

If the HTTP node returns 403/429, Reddit is throttling the public feed — that's the cue to move to
the authenticated Reddit node (v2, below).

---

## v4 strategy — big subs + niche finder

The scraper now hunts **popular posts on big mainstream subreddits** (AskReddit, LifeProTips,
YouShouldKnow, BuyItForLife, Frugal, HomeImprovement, Fitness, Cooking, gardening, DIY) via the
**/hot** feed — not obvious product subs. The **Score & gate** node is now a lean pre-filter
(de-dupe, recency, interleave across subs, cap ~20 for the LLM). The Gemini node does the smart work.

## Monetisability check (Gemini free tier) — the niche finder

Instead of "is this a product?", Gemini now judges "does this popular post reveal a **monetisable
niche** I could build an affiliate site around?" — inferring the opportunity even when the post isn't
about a product. Free via Google's Gemini tier (1,500 req/day; we use a tiny fraction). Use
`monetisable-check-gemini.js`.

1. **Free key:** aistudio.google.com → sign in → Get API key → Create. No card needed.
2. **Add a Code node** named "Monetisable check" **between Score & gate and Telegram** (delete the
   Score→Telegram wire, insert this node in the middle).
   - Mode: Run Once for All Items.
   - Paste `monetisable-check-gemini.js`, and replace `YOUR_GEMINI_KEY` with your key.
3. The node only passes posts Gemini says are buyable now, and puts the product name in the alert.
   Telegram's Text stays `={{ $json.message }}`.

Notes:
- Keep the workflow private (the key sits in the node). Fine for local personal n8n.
- It "fails open" — if Gemini errors, the post still passes (so you never lose finds to an API blip).
- If your n8n's Code node can't do `this.helpers.httpRequest`, use a separate HTTP Request node to
  the same Gemini endpoint instead — tell me and I'll give that variant.

---

## Troubleshooting

**HTTP Request returns "Forbidden – perhaps check your credentials?" / a wall of CSS**
Reddit is blocking the request because of a generic User-Agent. In the HTTP Request node, set the
`User-Agent` header value to a real browser string:
`Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36`
Re-run. A working response shows JSON with `data.children`.

If it STILL 403s (Reddit blocks unauthenticated feeds), go authenticated. This keeps the scoring
code and Telegram unchanged — we only give the HTTP node a Reddit login:

1. **Create a Reddit app** — https://www.reddit.com/prefs/apps → "create another app" → type **web app** → redirect URI: `http://localhost:5678/rest/oauth2-credential/callback` → create. Note the **client ID** (under the app name) and **secret**.
2. **Credential in n8n** — in the HTTP Request node: Authentication → **Predefined Credential Type** → **Reddit OAuth2 API** → new credential → paste client ID + secret → Connect (approve the Reddit popup). Secrets stay in n8n.
3. **Point at the authenticated endpoint** — change the URL to `=https://oauth.reddit.com/r/{{ $json.subreddit }}/rising?limit=75` and keep the User-Agent header. Execute → JSON with `data.children`. Score node needs no changes (same shape).

(Alternative to steps 2–3: use n8n's native **Reddit** node — Post → Get Many, subreddit `={{ $json.subreddit }}` — but its output is flat, one post per item, so the Score node would need adjusting. The HTTP+OAuth route above is less disruptive.)

---

## Tuning (in the Score node)
- `MIN_UPS` — the activity floor (raise for fewer, bigger trends).
- `MIN_VELOCITY` — upvotes/hour (raise to catch only fast movers).
- `MAX_AGE_HOURS` — how recent a post must be.
- `BUY_WORDS` — words that flag buying intent.

---

## What's deliberately NOT in v1 (the v2 upgrade list)
- **Authenticated Reddit** (OAuth via the Reddit node) — for reliability + higher rate limits.
- **Real acceleration** — store each run's counts (n8n static data or a small DB) to measure
  rate-of-change, not just upvotes/hour.
- **Proper Gate 2** — a real "is it on Amazon / affiliate available" check instead of keywords.
- **Google Trends bonus signal** — boosts score + informs the lasting-tail read.
- **Schedule Trigger** — run every few hours automatically instead of by hand.
- **De-dupe** — don't re-alert the same post on the next run.

Full target design: `../reddit-scraper-brief.md`.
