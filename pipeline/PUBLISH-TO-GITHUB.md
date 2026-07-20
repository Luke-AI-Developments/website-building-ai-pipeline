# Publish the project to GitHub (do this in Claude Code / a terminal)

The repo is prepped: `README.md` (case study), `.gitignore`, and a clean secret scan (all keys/tokens
are placeholders). The actual push happens on your machine.

## Steps (Claude Code can do these, or run them yourself)

1. In a terminal at the project root:
   ```
   cd "C:\Users\luket\Claude\Projects\Website passive income"
   ```
2. If a nested `template/.git` exists (the template is its own repo), either leave it (it's
   git-ignored) or, to include the template source cleanly in this repo:
   ```
   rmdir /s /q template\.git
   ```
3. Initialise + commit:
   ```
   git init
   git add .
   git commit -m "AI niche-finder + auto-build pipeline for passive-income sites"
   ```
4. Create the public repo and push (GitHub CLI is already authenticated):
   ```
   gh repo create passive-income-ai-pipeline --public --source=. --push
   ```
   (Pick any name you like instead of `passive-income-ai-pipeline`.)

## Before you push — 30-second sanity check
- Open `.gitignore` — confirm `node_modules/` and `.env` are listed (they are).
- Search the repo once more for a stray key: in the terminal
  `findstr /s /i "AIzaSy AQ. 308234279" *.md *.js *.json *.mjs` — should return **nothing**.
- The `01 Daily Logs/` folder is included on purpose (it shows the build journey) — remove it first
  if you'd rather keep the process private.

## Optional polish
- Add a repo description + topics on GitHub: `n8n`, `ai`, `automation`, `astro`, `gemini`, `claude`.
- Pin it on your GitHub profile as a portfolio piece.
