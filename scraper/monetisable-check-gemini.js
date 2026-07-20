// ===================================================================
// Niche opportunity finder (Gemini free tier) — n8n Code node (v2)
// Mode: Run Once for All Items
// Place it BETWEEN "Score & gate" (pre-filter) and "Telegram".
//
// New job: not "is this a product?" but "does this popular post reveal a
// MONETISABLE NICHE I could build an affiliate site around?" — inferring the
// opportunity even when the post isn't about a product. This is the intelligence
// that lets us mine big mainstream subreddits instead of obvious product subs.
// ===================================================================

const API_KEY    = 'YOUR_GEMINI_KEY';         // paste your free AI Studio key
const MODEL      = 'gemini-flash-latest';
const URL        = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
const MAX_ALERTS = 10;                          // cap messages per run
const THROTTLE_MS = 6000;                       // 6s gap → stays under free-tier per-minute limit

const out = [];

for (const item of items) {
  if (out.length >= MAX_ALERTS) break;

  const title = item.json.title || '';
  const sub   = item.json.subreddit || '';

  const prompt =
    `You spot niches for affiliate content sites. Given a popular Reddit post and its subreddit, ` +
    `decide if it relates to a niche where an affiliate site could recommend products, gear, tools, ` +
    `or services. Use the SUBREDDIT as a strong hint: hobby/interest/product subs (fitness, cooking, ` +
    `gardening, DIY, home improvement, durable goods, frugal living) almost always map to a ` +
    `monetisable niche — infer the products even if the post itself is just a photo or a question. ` +
    `Lean towards YES. Only answer false for pure entertainment, jokes, drama, politics, or personal ` +
    `venting with genuinely nothing to recommend. ` +
    `Return ONLY JSON: {"monetizable": true|false, "niche": "short niche name", "angle": "what you'd recommend or sell"}. ` +
    `Subreddit: r/${sub}. Title: "${title}"`;

  // Fail CLOSED (drop) when unsure. Retry transient 429/500/503 (server overload).
  let v = { monetizable: false };

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await this.helpers.httpRequest({
        method: 'POST',
        url: URL,
        headers: { 'x-goog-api-key': API_KEY, 'Content-Type': 'application/json' },
        body: {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json', temperature: 0 },
        },
        json: true,
      });
      const text = res?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
      v = JSON.parse(text);
      break;  // success
    } catch (e) {
      const status = Number(e.statusCode || e.httpCode || e.code);
      // Only retry server overloads (503/500). Do NOT retry 429 — that just adds
      // more load to an already-maxed rate limit and makes it worse.
      if ([500, 503].includes(status) && attempt < 2) {
        await new Promise((r) => setTimeout(r, 3000 * (attempt + 1)));  // backoff, then retry
        continue;
      }
      v = { monetizable: false };
      break;  // non-retryable or out of attempts
    }
  }

  if (v.monetizable) {
    out.push({ json: {
      ...item.json,
      niche: v.niche || '',
      angle: v.angle || '',
      message:
        `💡 NICHE — r/${sub}` + (v.niche ? ` · ${v.niche}` : ``) + `\n` +
        `${title}\n` +
        (v.angle ? `Angle: ${v.angle}\n` : ``) +
        `${item.json.url}`,
    }});
  }

  await new Promise((r) => setTimeout(r, THROTTLE_MS));  // stay under the rate limit
}

return out;
