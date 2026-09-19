// ===================================================================
// Eval: does the niche-judgment step's reasoning do its actual job?
//
// The niche-finder's job (per README.md) is NOT "is this post about a product" —
// that's what the cheap keyword pre-filter (scoring-rss.js) already does before a
// post ever reaches Gemini. The judgment step exists to spot a monetisable angle
// that ISN'T obvious from the words alone (that's why big mainstream subreddits are
// scraped instead of product subreddits). A judgment that's really just "this
// mentions a product" is redoing the pre-filter's job, not adding value.
//
// This script reads real logged judgments (scraper/monetisable-check-gemini.js
// appends one JSONL record per judgment to niche-judgments.jsonl once reasoning
// capture is live) and sends each one to a judge LLM to score 1-5: does the
// reasoning reflect a genuine, specific, non-obvious angle, or does it just
// restate that the post/subreddit is about a product?
//
// Usage:
//   GEMINI_API_KEY=... node scraper/eval-niche-judgments.js [path-to-jsonl]
//   node scraper/eval-niche-judgments.js --self-test     (no API key, no network —
//     verifies the scoring/aggregation plumbing against a small fixed mock judge;
//     NOT a quality result, just proves the harness runs)
//
// Default log path: scraper/niche-judgments.jsonl (same default the judgment
// step writes to).
// ===================================================================

const fs = require('fs');
const path = require('path');

const MODEL = 'gemini-flash-latest';
const THROTTLE_MS = 4000; // stay under Gemini free-tier per-minute limits

const SELF_TEST = process.argv.includes('--self-test');
const pathArg = process.argv.find((a, i) => i >= 2 && !a.startsWith('--'));
const LOG_PATH = pathArg || path.join(__dirname, 'niche-judgments.jsonl');
const LOW_SCORE_THRESHOLD = 3; // scores <= this get flagged in the summary

const JUDGE_PROMPT_PREFIX = `You are auditing an automated niche-finding system for affiliate
content sites. Its actual job is to spot a monetisable angle in a post that is NOT obvious just
from keywords or the subreddit's general topic — that's the entire reason it scans big mainstream
subreddits (AskReddit, LifeProTips, Fitness, ...) instead of already-obvious product subreddits.
A judgment that just says "this is about a product" or "this subreddit is about fitness/cooking/
DIY so it's monetisable" is redoing the job of the system's cheap keyword pre-filter, not the real
judgment it's meant to make.

Score the SYSTEM'S REASONING below, 1-5:
1 = pure restatement / category-matching, no real inference ("it's a fitness sub so gear is
    monetisable")
2 = mostly restatement with a token gesture at specifics
3 = some inference but still fairly generic or the kind of angle keyword-matching would already
    find
4 = a genuinely specific angle inferred from the actual post content, mostly non-obvious
5 = clearly identifies a non-obvious angle that required real inference from the post, not just
    its subreddit or topic

Judge the REASONING, not whether you personally agree the niche is monetisable.

Return ONLY JSON: {"score": 1-5, "why": "one sentence"}`;

function buildJudgePrompt(record) {
  const decision = record.monetizable ? 'APPROVED as monetisable' : 'REJECTED as not monetisable';
  return (
    `${JUDGE_PROMPT_PREFIX}\n\n` +
    `Subreddit: r/${record.subreddit}\n` +
    `Post title: "${record.title}"\n` +
    `System's decision: ${decision}\n` +
    `System's stated niche: ${record.niche || '(none)'}\n` +
    `System's stated angle: ${record.angle || '(none)'}\n` +
    `System's stated reasoning: "${record.reasoning}"`
  );
}

async function callGeminiJudge(apiKey, prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'x-goog-api-key': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json', temperature: 0 },
    }),
  });
  if (!res.ok) {
    throw new Error(`Gemini judge call failed: ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
  return JSON.parse(text);
}

// Fixed, deterministic mock judge — used only by --self-test to prove the
// read/score/aggregate/report pipeline works without calling any API.
function mockJudge(record) {
  const reasoning = (record.reasoning || '').toLowerCase();
  const isGeneric =
    reasoning.includes('is about') || reasoning.includes('subreddit is') || reasoning.length < 25;
  return { score: isGeneric ? 2 : 4, why: isGeneric ? 'reads as category restatement' : 'names a specific angle' };
}

function loadRecords(logPath) {
  if (!fs.existsSync(logPath)) return null;
  const lines = fs.readFileSync(logPath, 'utf8').split('\n').filter((l) => l.trim());
  return lines.map((l) => JSON.parse(l));
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  let records;
  let usingFixture = false;

  if (SELF_TEST) {
    usingFixture = true;
    records = [
      {
        subreddit: 'HomeImprovement', title: 'Finally fixed my drafty windows',
        monetizable: true, niche: 'DIY window insulation', angle: 'window insulation film kits',
        reasoning: 'HomeImprovement is about home stuff so gear is monetisable.',
      },
      {
        subreddit: 'AskReddit', title: "What's a tool that changed how you cook?",
        monetizable: true, niche: 'underrated kitchen tools', angle: 'niche kitchen gadgets',
        reasoning: 'Replies naming specific unusual tools (fish spatula, bench scraper) reveal an underrated-kitchen-gadget buying guide angle a product subreddit would never surface, since nobody searches for these by name.',
      },
      {
        subreddit: 'LifeProTips', title: 'LPT: freeze your coffee beans if you buy in bulk',
        monetizable: false, niche: '', angle: '',
        reasoning: 'This is just a tip, not a product.',
      },
    ];
  } else {
    records = loadRecords(LOG_PATH);
  }

  if (!records) {
    console.log(`No log file found at ${LOG_PATH}.`);
    console.log(
      'Reasoning capture was only just added to scraper/monetisable-check-gemini.js — there are ' +
      'no real logged judgments yet. Run the pipeline (or the scraper\'s Gemini node) to accumulate ' +
      'some, then re-run this script. Use --self-test to verify this script itself works in the ' +
      'meantime (mock judge, not a real quality result).'
    );
    process.exitCode = 1;
    return;
  }

  if (records.length === 0) {
    console.log(`${LOG_PATH} exists but has no records yet.`);
    process.exitCode = 1;
    return;
  }

  if (!SELF_TEST && !apiKey) {
    console.error('GEMINI_API_KEY (or GOOGLE_API_KEY) is not set. Set it, or pass --self-test.');
    process.exitCode = 1;
    return;
  }

  console.log(
    usingFixture
      ? `SELF-TEST MODE — scoring ${records.length} fixture records with a fixed mock judge (no API call). This checks the harness, not judgment quality.`
      : `Judging ${records.length} real logged judgment(s) from ${LOG_PATH}...`
  );

  const results = [];
  for (const record of records) {
    const verdict = usingFixture
      ? mockJudge(record)
      : await callGeminiJudge(apiKey, buildJudgePrompt(record));
    results.push({ record, score: Number(verdict.score) || 0, why: verdict.why || '' });
    if (!usingFixture) await sleep(THROTTLE_MS);
  }

  const avg = results.reduce((sum, r) => sum + r.score, 0) / results.length;
  const low = results.filter((r) => r.score <= LOW_SCORE_THRESHOLD);

  console.log('\n=== Niche-judgment reasoning eval ===');
  console.log(`Records scored: ${results.length}`);
  console.log(`Average score (1-5): ${avg.toFixed(2)}`);
  console.log(`Low-scoring (<= ${LOW_SCORE_THRESHOLD}): ${low.length}/${results.length}`);

  if (low.length) {
    console.log('\n--- Low-scoring judgments (surface-level reasoning) ---');
    for (const r of low) {
      const decision = r.record.monetizable ? 'APPROVED' : 'REJECTED';
      console.log(`\n[${r.score}/5] ${decision} — r/${r.record.subreddit} — "${r.record.title}"`);
      console.log(`  reasoning: "${r.record.reasoning}"`);
      console.log(`  judge: ${r.why}`);
    }
  }

  console.log('');
}

main().catch((err) => {
  console.error('Eval failed:', err.message);
  process.exitCode = 1;
});
