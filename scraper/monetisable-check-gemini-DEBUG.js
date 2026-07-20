// TEMPORARY DEBUG — shows Gemini's verdict (or error) for EVERY post, no filtering.
// Paste this into the Code node, run once, read the Telegram/output. Then switch back
// to monetisable-check-gemini.js.

const API_KEY    = 'YOUR_GEMINI_KEY';         // <-- your key, in quotes
const MODEL      = 'gemini-flash-latest';
const THROTTLE_MS = 6000;                      // 6s gap → stays under free-tier per-minute limit
const URL     = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

const out = [];

for (const item of items) {
  const title = item.json.title || '';
  const sub   = item.json.subreddit || '';

  const prompt =
    `You spot niches for affiliate content sites. Given a popular Reddit post and its subreddit, ` +
    `decide if it relates to a niche where an affiliate site could recommend products, gear, tools ` +
    `or services. Use the SUBREDDIT as a strong hint: hobby/interest/product subs almost always map ` +
    `to a monetisable niche — infer the products even if the post is just a photo or a question. ` +
    `Lean towards YES. Only answer false for pure entertainment, jokes, drama, politics or venting. ` +
    `Return ONLY JSON: {"monetizable": true|false, "niche": "short", "angle": "what to sell"}. ` +
    `Subreddit: r/${sub}. Title: "${title}"`;

  let verdictText = '';
  let errText = '';

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
      verdictText = res?.candidates?.[0]?.content?.parts?.[0]?.text || '(empty response)';
      errText = '';
      break;  // success
    } catch (e) {
      const status = Number(e.statusCode || e.httpCode || e.code);
      errText = `${e.message || 'err'} | status:${status || '?'}`.slice(0, 300);
      if ([500, 503].includes(status) && attempt < 2) {   // don't retry 429 (makes rate limit worse)
        await new Promise((r) => setTimeout(r, 3000 * (attempt + 1)));  // backoff, then retry
        continue;
      }
      break;  // non-retryable or out of attempts
    }
  }

  out.push({ json: {
    subreddit: sub,
    title,
    url: item.json.url,
    verdict: verdictText,
    error: errText,
    message:
      `🔎 DEBUG — r/${sub}\n` +
      `${title}\n` +
      (errText ? `ERROR: ${errText}\n` : `Gemini: ${verdictText}\n`) +
      `${item.json.url}`,
  }});

  await new Promise((r) => setTimeout(r, THROTTLE_MS));  // stay under the rate limit
}

return out;
