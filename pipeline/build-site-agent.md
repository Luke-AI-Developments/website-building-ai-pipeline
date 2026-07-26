# Build-Site Agent — the core of the auto-populate pipeline

This is the reusable instruction set Claude Code runs to turn a **niche** into a **deployed site**.
Run it two ways:
- **By hand (do this first):** open Claude Code in the project, paste the prompt below with a niche.
- **Automated (later):** n8n runs it headless via `claude -p "<this prompt> NICHE: ..."` — see
  `n8n-telegram-wiring.md`.

Prereqs (already done): template on GitHub (`trend-site-template`), `gh` + `vercel` authenticated,
Vercel connected.

> Note: the bare `vercel` binary is not on PATH on this machine — use `npx --yes vercel` for every
> Vercel CLI command instead (already authenticated as `luke-ai-developments`). The prompt below and
> `pipeline/build-site-agent-prompt.txt` (the plain-text version used by the Telegram automation)
> both account for this.

---

## The prompt (paste into Claude Code)

You are a site-builder agent. Build a complete, deployed affiliate content site from the
`trend-site-template`. Work autonomously and end by printing the live URL on its own line.

INPUT:
- NICHE: <e.g. "cast iron cookware care">
- NOTES (optional): <any steer>
- If instead given `CHANGES: <text>` and `PROJECT: <folder>`, skip to the CHANGES section.

STEPS:
1. **New project from the template** — copy `trend-site-template` into a new folder named after the
   niche (kebab-case, e.g. `cast-iron-cookware`). You may narrow/refine the niche during research
   (e.g. a more specific, more monetisable sub-niche) — if you do, the folder name should reflect
   the FINAL niche you actually build, not the original request text. Do NOT modify the template
   itself. Create a new LOCAL Git repo for it (git init + first commit) for version history only —
   do NOT publish/push it to GitHub. Each site deploys straight to Vercel from the local folder; we
   deliberately don't create a GitHub repo per site (keeps the Luke-AI-Developments org from filling
   up with one-off niche repos).
   IMPORTANT — the template ships linked to its OWN Vercel project: delete any copied `.vercel/`
   folder from the new project immediately (it's a stale link, not yours), and change
   `package.json`'s `"name"` field from `"trend-site-template"` to match your new folder/slug.
   Skipping this causes Vercel to silently deploy into the shared template project instead of a
   new one.
2. **Config** — set `src/config/site.mjs`:
   - `name`: a short, brandable, made-up-sounding brand name (1–2 words, reads like a real consumer
     brand — e.g. "RuggedWear", "HardyShirts", "AnvilKitchen") that a stranger could believe is a
     real independent site. NEVER a literal keyword-stuffed niche phrase (avoid "Cast Iron Carbon
     Steel Care Guide") — those read as AI-generated and spammy. NEVER any personal name or anything
     that could identify Luke — needs to be shareable on Reddit without reading as self-promotion.
   - `author`: an invented persona name + bio (plausible, per `site-content-model.md`'s E-E-A-T
     guidance) — not a real person, never Luke's own name.
   - `tagline`, `niche` as before. `emailEnabled: true`, `adsEnabled: false`.
   - `amazonTag`: CHECK FIRST by running exactly
     `node -e "console.log(process.env.AMAZON_ASSOCIATES_TAG ? 'YES' : 'NO')"` (same pattern as the
     `UNSPLASH_ACCESS_KEY` check below — don't guess, don't use shell `$VAR`/`%VAR%` expansion). If
     it prints `YES`, set `amazonTag` to the real value of `process.env.AMAZON_ASSOCIATES_TAG` (read
     it in a small Node script, not shell expansion). If it prints `NO`, leave `amazonTag` as the
     placeholder — links still work (Amazon search links, no 404s), they just don't earn yet.
3. **Research** — invoke the `niche-researcher` subagent for NICHE (see
   `../pipeline/niche-researcher-agent.md`). It researches thoroughly via web search and writes
   `research-brief.md` in this project's folder. Do NOT research inline — wait for the brief.
4. **Generate content** (replace the template's examples) per `../site-content-model.md`, writing
   FROM `research-brief.md` (its products list, FAQ questions, comparison angles, and owner-sentiment
   notes — not fresh inline research):
   - 1 hub buying guide ("Best X for Y") with a `products` frontmatter list.
   - 2 reviews / deep-dives of key products.
   - 1 comparison ("X vs Y" or "HOTAS vs yoke"-style).
   - 1–2 informational/how-to articles, and 1 FAQ article with a `faq:` list (→ FAQ schema).
   - Keep About + Affiliate Disclosure.
   VOICE & STYLE (write like a real enthusiast, not a spec sheet):
   - Opinionated, first-person editorial voice — take a clear stance, name a favourite AND an
     also-ran, don't hedge every sentence.
   - Lead with the verdict. Put the recommendation up top, then the reasoning — readers and AI answer
     engines both want the answer first.
   - Concrete over generic: use specific detail from `research-brief.md` (real numbers, materials,
     quirks owners actually mention), never filler like "high quality" or "great value".
   - Vary the rhythm — mix short, punchy sentences with longer ones. Read it back; if it sounds like a
     brochure, rewrite it.
   - Cut filler openers and closers: no "in today's world", "when it comes to", "in conclusion", and
     never restate the heading. Every sentence earns its place.
   - Talk to the reader directly ("you'll want…", "skip this one if…"). Helpful, not salesy.
   - This is STYLE ONLY and never licenses inventing facts — personality comes from how you frame
     real, brief-sourced detail, not from making anything up. The integrity rules below always win.
   INTEGRITY (hard rules): never fake hands-on testing ("I tested…") for products not owned — write
   from specs + what real owners report, transparently. AI-drafted but genuinely useful. No thin
   filler. Never invent facts beyond the brief.
   AFFILIATE LINKS: every `<AffiliateButton>` (inline in MDX body, and every `products[].url` /
   `affiliateUrl` in frontmatter) must include a `product="<exact product name>"` prop — leave `url`
   as `AFFILIATE_URL` (or omit it). The component auto-builds a working Amazon search link from
   `product` + the site's `amazonTag`, so buttons work immediately (no 404s) and start earning the
   moment a real tag is set. Never hand-write a real `amazon.co.uk/dp/...` URL — you don't have one.
5. **Theme + imagery** — see `../pipeline/visual-design-spec.md` for full rules. Two parts, do both:
   - **Palette (always):** in `src/config/site.mjs`, set `theme.primary` / `theme.primaryDark` /
     `theme.secondary` / `theme.surface` to a palette that fits the niche's mood (warm earthy for
     cast-iron cooking, greens for gardening, cool blues/greys for tech, etc). No API key needed —
     always do this.
   - **Real imagery (only if `UNSPLASH_ACCESS_KEY` is set):** CHECK FIRST by running exactly
     `node -e "console.log(process.env.UNSPLASH_ACCESS_KEY ? 'YES' : 'NO')"` — do not guess or
     assume based on anything else. If it prints `NO`, skip imagery entirely and move on (the
     template's hero/card gradients and fuller colour theme already make the site look designed
     without photos — this is a normal, expected outcome, not an error).
     If it prints `YES`: write and run a small Node script (don't rely on shell env-var expansion
     syntax like `$VAR` or `%VAR%`, which differs by shell — read `process.env.UNSPLASH_ACCESS_KEY`
     directly in the script instead) that, for the hero and each guide/review/article: calls
     `https://api.unsplash.com/search/photos?query=<niche term>&per_page=1` with header
     `Authorization: Client-ID <the key>`, downloads the first result's regular-size image into
     `public/images/` (never hotlink), and prints the local path + photographer name. Then set
     `SITE.hero.image` + each content file's `image` / `imageAlt` / `imageCredit` frontmatter
     (credit format: "Photo by <name> on Unsplash"). NEVER use Amazon/retailer product photos
     (breaks Associates ToS) — stock/lifestyle imagery only.
6. **Build + verify** — `npm install`, `npm run build`, then confirm every route renders and the FAQ
   page outputs FAQPage JSON-LD.
7. **Deploy** — push to a new Vercel project (its own URL). Name the Vercel project after the BRAND
   name from step 2 (kebab-case), not the raw niche slug — so even the temporary `*.vercel.app` URL
   looks clean and brand-like (`rugged-wear.vercel.app`, not `cast-iron-carbon-steel-care.vercel.app`).
   **Availability check** (before treating the deploy as done): compare the resulting URL against
   the clean `<brand-slug>.vercel.app` you asked for. Vercel does not error when a project
   name/domain collides with something else already on Vercel — it silently falls back to a
   random-suffixed URL instead (e.g. `finblade-iota.vercel.app`, a different hash on every
   subsequent deploy). A suffix means the name is taken and should be treated as unavailable: pick a
   different brand name (back to step 2), rename in `site.mjs`, delete the `.vercel/` folder this
   attempt created, and redeploy under the new name. Don't ship a hash/suffixed URL silently as if
   it were the clean brand URL — resolve it by renaming, or if you must proceed, flag the collision
   explicitly in your output. Once the deploy resolves to a clean `<brand-slug>.vercel.app`, set
   `SITE.url` to that URL so canonical/OG/sitemap are correct, and redeploy.
8. **Suggest a real domain** — do not attempt to buy or register anything yourself (never enter
   payment details — that's Luke's step). Propose 3 candidate domains matching the brand (mix of
   `.com` / `.co.uk`). Luke will check availability and register at a low-cost registrar (Cloudflare
   Registrar or Namecheap) himself.
9. **Output** — print exactly these three lines (so automation can grab them):
   `PROJECT_FOLDER: <the folder name under sites/ you actually used>`
   `LIVE_URL: <the vercel url>`
   `DOMAIN_SUGGESTIONS: <comma-separated list of the 3 candidate domains from step 8>`
   Print `PROJECT_FOLDER` even if it matches the folder from step 1 exactly.

## CHANGES mode
If given `CHANGES: <text>` and `PROJECT: <folder>`: open that project, apply the requested changes,
`npm run build` to verify, redeploy to the same Vercel project, and print `LIVE_URL: <url>` again.

---

## How to test it (do this before any Telegram wiring)
1. Open Claude Code in this project.
2. Paste the prompt above with a real niche, e.g. `NICHE: cast iron cookware care`.
3. Watch it build + deploy, and check the live URL it prints.
4. Reply with a change (e.g. "make the hero heading shorter") to test CHANGES mode.

Only once this works by hand do we wrap it in Telegram (`n8n-telegram-wiring.md`).

## Notes / guardrails
- Content quality is the whole game — this is why YOU review the preview (the yes/nay step). Never
  auto-promote unreviewed content to a primary domain.
- Each run uses Claude Code = your Claude Pro allowance (no extra $), but heavy batches eat the
  shared limit.
- Keep the agent scoped to this project folder; secrets (Vercel token etc.) stay in the CLI's own
  auth, never in prompts.
