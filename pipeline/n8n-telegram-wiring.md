# Telegram → Claude Code wiring (the automation wrapper)

Wrap the build-site agent (`build-site-agent.md`) so you can text a niche and get back a live link.
**Only wire this after the agent works by hand.**

## Status: live

The workflow is built, published, and active in n8n — **"Telegram Build/Change Loop"**. It's exposed
via an ngrok tunnel while the laptop's up (see the gotcha in `CLAUDE.md`) and has shipped multiple
real sites end to end via `/build`, replies, and `/ship`.

- Exported copy: `pipeline/telegram-build-loop.n8n.json` (importable, mirrors what's in n8n).
- Plain-text prompts it pipes into `claude -p` (avoids shell-quoting the whole prompt inline):
  `pipeline/build-site-agent-prompt.txt` (build) and `pipeline/build-site-agent-changes-prompt.txt`
  (changes).
- Telegram credential reused from the scraper's existing "Telegram account" credential.
- `NODES_EXCLUDE=[]` must be set when starting n8n — this n8n version (2.x) disables the Execute
  Command node by default for security; that env var re-enables it. Without it the node won't even
  appear in the node picker.

### Exposing the webhook — resolved with ngrok, still session-bound

Using ngrok pointed at port 5678. Works, but the free-tier URL rotates whenever ngrok or n8n
restarts, and both are session-bound (die on reboot) — see the ngrok gotcha in `CLAUDE.md`. The
permanent fix is the Oracle/VPS host in `hosting/`, not yet done.

## The loop

1. **Telegram (you):** send `/build cast iron cookware care` (or reply to a scraper niche alert).
2. **n8n — Telegram Trigger node:** listens for your messages, extracts the niche text.
3. **n8n — Execute Command node:** runs Claude Code headless on your machine:
   ```
   cd "C:\Users\luket\Claude\Projects\Website passive income" && claude -p "<paste the build-site-agent prompt> NICHE: {{ $json.niche }}" --dangerously-skip-permissions
   ```
   (Claude Code builds + deploys and prints `LIVE_URL: ...`.)
4. **n8n — extract the URL:** a small Set/Code node greps `LIVE_URL:` out of the command's stdout.
5. **n8n — Telegram node:** sends you "✅ Preview ready: <url>".
6. **Change loop:** you reply "make the header shorter" → Telegram Trigger → Execute Command with
   `CHANGES: {{ $json.text }} PROJECT: <folder>` → new `LIVE_URL` back to Telegram.
7. **Go live:** reply `/ship` → an Execute Command that runs `vercel --prod` in that project. The
   Telegram reply reports the **known clean alias** (`https://<brand-slug>.vercel.app`, stored from
   the original `/build`), not whatever `vercel --prod` prints to stdout — that command's own
   confirmation line is a per-deployment hash+team URL, not the stable alias, and relaying it
   verbatim shipped a broken-looking link on the first live `/ship` (caught and fixed 2026-07-26).

## Prereqs
- n8n and Claude Code on the **same machine** (so Execute Command can call `claude`).
- `gh` + `vercel` already authenticated (done).
- Claude Code signed in on your Pro plan.
- n8n's **Execute Command** node is available (self-hosted n8n — yours is).

## Guardrails (important)
- `--dangerously-skip-permissions` lets it run unattended — only because this runs in **your** scoped
  project folder and the niche comes from **you** (not untrusted web input). Don't point it at
  arbitrary external input without a human approving first.
- **Two human gates stay:** you send the niche (`/build`), and you review the preview before `/ship`.
- Each build spends your Claude Pro allowance; fine for a few, watch it if you batch many.
- The machine must be awake + n8n running (same always-on caveat as the scraper → VPS later).

## Build order
1. Prove `build-site-agent.md` by hand (one niche → live site).
2. Add the Telegram Trigger + Execute Command for `/build`.
3. Add the URL-extract + Telegram reply.
4. Add the CHANGES reply loop.
5. Add `/ship` → production.
