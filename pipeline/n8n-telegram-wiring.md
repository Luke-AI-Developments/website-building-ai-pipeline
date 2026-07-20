# Telegram → Claude Code wiring (the automation wrapper)

Wrap the build-site agent (`build-site-agent.md`) so you can text a niche and get back a live link.
**Only wire this after the agent works by hand.**

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
7. **Go live:** reply `/ship` → an Execute Command that runs `vercel --prod` in that project.

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
