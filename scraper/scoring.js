// ===================================================================
// Reddit Trend Scraper — "Score & gate" Code node (n8n)
// Mode: Run Once for All Items
// Input : one item per subreddit, each item.json = Reddit rising.json response
// Output: one item per QUALIFYING post, with a ready-to-send Telegram message
// ===================================================================

// --- Tuning knobs (adjust after the first run) ---
const MIN_UPS        = 100;   // Gate 1: activity floor — enough audience to redirect
const MIN_VELOCITY   = 20;    // Gate 1: upvotes per hour (our acceleration proxy)
const MAX_AGE_HOURS  = 24;    // only recent posts (a spike, not old news)
const MAX_ALERTS     = 10;    // top N per run, so Telegram isn't flooded

// Gate 2 (rough v1): buying-intent / product signal in the title.
// A real Amazon/affiliate check replaces this in v2.
const BUY_WORDS = [
  "buy","where","worth it","link","amazon","order","price","cost",
  "dupe","which","recommend","need this","take my money","best "
];

const now = Date.now() / 1000;
const out = [];

for (const item of items) {
  const children = item.json?.data?.children || [];
  for (const c of children) {
    const p = c.data || {};
    const ageH = Math.max((now - (p.created_utc || now)) / 3600, 0.1);
    if (ageH > MAX_AGE_HOURS) continue;

    const ups      = p.ups || 0;
    const comments = p.num_comments || 0;
    const velocity = ups / ageH;                     // upvotes per hour

    // --- Gate 1: strong, accelerating activity ---
    if (ups < MIN_UPS || velocity < MIN_VELOCITY) continue;

    // --- Gate 2 (rough): buying intent / product signal ---
    const title  = (p.title || "").toLowerCase();
    const buyHit = BUY_WORDS.some(w => title.includes(w));

    // --- Score (ranks survivors only) ---
    const score = Math.round(velocity + comments * 2 + (buyHit ? 50 : 0));
    const url   = "https://www.reddit.com" + (p.permalink || "");

    out.push({ json: {
      subreddit: p.subreddit,
      title: p.title,
      ups, comments,
      ageHours: Math.round(ageH * 10) / 10,
      velocity: Math.round(velocity),
      buyingIntent: buyHit,
      score,
      url,
      message:
        `🚨 TREND CANDIDATE — r/${p.subreddit}  (score ${score})\n` +
        `${p.title}\n` +
        `👍 ${ups} · 💬 ${comments} · ${Math.round(velocity)} ups/hr · ${Math.round(ageH)}h old\n` +
        `Buying intent: ${buyHit ? "yes" : "no"}\n` +
        `${url}`
    }});
  }
}

// Highest score first; cap the number of alerts per run
out.sort((a, b) => b.json.score - a.json.score);
return out.slice(0, MAX_ALERTS);
