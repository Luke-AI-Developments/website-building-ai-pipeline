// ===================================================================
// Sync scraper code from disk into the live n8n workflow via the REST API.
// Reusable: Cowork edits scraper/*.js -> run this -> code lands in the live nodes.
//
// Usage:
//   N8N_API_KEY=... node scraper/sync-to-n8n.js [--rss-url "<url>"]
//
// Env vars:
//   N8N_API_KEY   required. Settings -> n8n API in the n8n UI.
//   N8N_BASE_URL  optional, default http://localhost:5678
//   WORKFLOW_ID   optional, default the live "Reddit Trend Scraper - v2 (RSS)" workflow
//
// What it does:
//   - GETs the workflow, replaces "Score & gate" node's code with scraper/scoring-rss.js
//   - if --rss-url is given, sets the "RSS Read" node's url parameter to it
//   - PUTs the workflow back (name/nodes/connections/staticData only -- n8n's API
//     rejects extra read-only fields like id/createdAt/versionId, and rejects most
//     `settings` sub-fields too, so settings is omitted rather than guessed at)
//
// The "gemini api" node (monetisable-check-gemini.js) is NEVER synced by default.
// The on-disk copy ships with a YOUR_GEMINI_KEY placeholder (see CLAUDE.md gotcha);
// the live node has the real key hand-edited in. Syncing it by default would
// silently clobber a working key with the placeholder. Pass --include-gemini to
// sync it anyway -- the script still refuses if the disk file still has the
// placeholder key.
//
// It does NOT touch active/publish state. n8n does not apply node changes to an
// already-running scheduled trigger until you re-save/re-activate the workflow in
// the UI -- do that after running this script.
// ===================================================================

const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.N8N_BASE_URL || 'http://localhost:5678';
const WORKFLOW_ID = process.env.WORKFLOW_ID || 'H65TBTLODwCOlvpD'; // Reddit Trend Scraper - v2 (RSS)
const API_KEY = process.env.N8N_API_KEY;

if (!API_KEY) {
  console.error('N8N_API_KEY is not set. Get one from n8n Settings -> n8n API.');
  process.exit(1);
}

const rssUrlArgIndex = process.argv.indexOf('--rss-url');
const rssUrl = rssUrlArgIndex !== -1 ? process.argv[rssUrlArgIndex + 1] : null;

const scoringPath = path.join(__dirname, 'scoring-rss.js');
const geminiPath = path.join(__dirname, 'monetisable-check-gemini.js');

async function apiFetch(pathname, options = {}) {
  const res = await fetch(`${BASE_URL}/api/v1${pathname}`, {
    ...options,
    headers: {
      'X-N8N-API-KEY': API_KEY,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const text = await res.text();
  let body;
  try { body = JSON.parse(text); } catch { body = text; }
  if (!res.ok) {
    throw new Error(`${options.method || 'GET'} ${pathname} -> ${res.status}: ${JSON.stringify(body)}`);
  }
  return body;
}

async function main() {
  console.log(`Fetching workflow ${WORKFLOW_ID} from ${BASE_URL}...`);
  const wf = await apiFetch(`/workflows/${WORKFLOW_ID}`);
  console.log(`Loaded "${wf.name}" (active: ${wf.active}), ${wf.nodes.length} nodes.`);

  let changed = [];

  const scoreNode = wf.nodes.find((n) => n.name === 'Score & gate');
  if (scoreNode && fs.existsSync(scoringPath)) {
    scoreNode.parameters.jsCode = fs.readFileSync(scoringPath, 'utf8');
    changed.push('Score & gate <- scraper/scoring-rss.js');
  }

  const includeGemini = process.argv.includes('--include-gemini');
  const geminiNode = wf.nodes.find((n) => n.name === 'gemini api');
  if (includeGemini && geminiNode && fs.existsSync(geminiPath)) {
    const geminiCode = fs.readFileSync(geminiPath, 'utf8');
    if (geminiCode.includes('YOUR_GEMINI_KEY')) {
      console.warn(
        'Skipping gemini api: scraper/monetisable-check-gemini.js still has the ' +
        'YOUR_GEMINI_KEY placeholder. Paste the real key into the file first, or ' +
        'this would overwrite the live node\'s working key.'
      );
    } else {
      geminiNode.parameters.jsCode = geminiCode;
      changed.push('gemini api <- scraper/monetisable-check-gemini.js');
    }
  }

  if (rssUrl) {
    const rssNode = wf.nodes.find((n) => n.name === 'RSS Read');
    if (rssNode) {
      rssNode.parameters.url = rssUrl;
      changed.push(`RSS Read url <- ${rssUrl}`);
    }
  }

  if (changed.length === 0) {
    console.log('Nothing to change.');
    return;
  }

  console.log('Applying:\n  ' + changed.join('\n  '));

  const payload = {
    name: wf.name,
    nodes: wf.nodes,
    connections: wf.connections,
    staticData: wf.staticData,
    // n8n's PUT schema only accepts a narrow settings shape (rejects the fuller
    // object GET returns) -- pass through just the one field older exports use.
    settings: { executionOrder: (wf.settings && wf.settings.executionOrder) || 'v1' },
  };

  await apiFetch(`/workflows/${WORKFLOW_ID}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

  console.log('Pushed successfully.');
  console.log('NOTE: re-save/re-activate the workflow in the n8n UI so the running');
  console.log('schedule trigger picks up the new node code.');
}

main().catch((err) => {
  console.error('Sync failed:', err.message);
  process.exit(1);
});
