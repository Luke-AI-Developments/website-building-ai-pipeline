// ===================================================================
// Reddit Trend Scraper (RSS) — "Score & gate" = PRE-FILTER (v4)
// Mode: Run Once for All Items
//
// New strategy: hunt POPULAR posts on BIG mainstream subreddits (not obvious
// product subs). This node just does the cheap housekeeping — de-dupe, recency,
// interleave across subs so we sample the top of each, and cap how many go to
// the LLM. The Gemini node does the smart "is there a niche here?" judgment.
// ===================================================================

const MAX_AGE_HOURS = 168;    // allow up to a week old (we now use the /top?t=week feed)
const MAX_TO_CHECK  = 16;     // ~top 20 posts handed to the LLM per run
const MAX_PER_SUB   = 2;      // HARD cap per subreddit — stops one sub (e.g. BuyItForLife) flooding
const MEMORY_CAP    = 1500;   // remember this many recent posts to avoid re-checking

const staticData = $getWorkflowStaticData('global');
staticData.seenUrls = staticData.seenUrls || [];
const alreadyChecked = new Set(staticData.seenUrls);
const seenThisRun = new Set();

const now = Date.now();
const bySub = {};

for (const item of items) {
  const e = item.json || {};
  const title = e.title || '';
  const link  = e.link || e.guid || '';
  if (!link) continue;
  if (alreadyChecked.has(link) || seenThisRun.has(link)) continue;  // de-dupe
  seenThisRun.add(link);

  const pub  = e.isoDate || e.pubDate || '';
  const ageH = pub ? (now - new Date(pub).getTime()) / 3600000 : null;
  if (ageH !== null && ageH > MAX_AGE_HOURS) continue;

  const m   = String(link).match(/reddit\.com\/r\/([^/]+)/i);
  const sub = m ? m[1] : 'reddit';
  (bySub[sub] = bySub[sub] || []).push({ sub, title, link, ageH });
}

// Cap each subreddit to its top MAX_PER_SUB posts (the RSS /top feed is already
// performance-ordered, so [0..MAX_PER_SUB] = that sub's best), THEN round-robin
// across subs — so no single sub can dominate and we get a spread of niches.
const groups = Object.values(bySub).map((g) => g.slice(0, MAX_PER_SUB));
const picked = [];
let depth = 0;
while (picked.length < MAX_TO_CHECK) {
  let addedThisPass = false;
  for (const g of groups) {
    if (g[depth]) {
      picked.push(g[depth]);
      addedThisPass = true;
      if (picked.length >= MAX_TO_CHECK) break;
    }
  }
  if (!addedThisPass) break;
  depth++;
}

const out = picked.map((p) => ({ json: {
  subreddit: p.sub,
  title: p.title,
  url: p.link,
  ageHours: p.ageH !== null ? Math.round(p.ageH) : null,
  // Fallback message so Telegram is never "undefined" even without the Gemini node.
  // The Gemini node overwrites this with the niche verdict when it's in the chain.
  message: `📈 POPULAR — r/${p.sub}\n${p.title}\n${p.link}`,
}}));

// Remember what we're handing to the LLM so we don't re-check (or re-pay for) it.
if (!Array.isArray(staticData.seenUrls)) staticData.seenUrls = [];   // safety guard
for (const o of out) staticData.seenUrls.push(o.json.url);
if (staticData.seenUrls.length > MEMORY_CAP) {
  staticData.seenUrls = staticData.seenUrls.slice(-MEMORY_CAP);
}

return out;
