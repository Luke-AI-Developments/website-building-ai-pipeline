# Build-Site Agent — the core of the auto-populate pipeline

This is the reusable instruction set Claude Code runs to turn a **niche** into a **deployed site**.
Run it two ways:
- **By hand (do this first):** open Claude Code in the project, paste the prompt below with a niche.
- **Automated (later):** n8n runs it headless via `claude -p "<this prompt> NICHE: ..."` — see
  `n8n-telegram-wiring.md`.

Prereqs (already done): template on GitHub (`trend-site-template`), `gh` + `vercel` authenticated,
Vercel connected.

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
   niche (kebab-case, e.g. `cast-iron-cookware`). Do NOT modify the template itself. Create a new
   Git repo for it.
2. **Config** — set `src/config/site.mjs`: a clean brand `name`, `tagline`, `niche`, `author` bio,
   leave `amazonTag` as the placeholder, `emailEnabled: true`, `adsEnabled: false`.
3. **Research** — gather real facts for the niche: the main products people buy, price ranges, the
   recurring questions/pains (search + reddit-style queries). Note 3–6 real products with genuine
   pros/cons. Do NOT invent products, prices, or specs.
4. **Generate content** (replace the template's examples) per `../site-content-model.md`:
   - 1 hub buying guide ("Best X for Y") with a `products` frontmatter list.
   - 2 reviews / deep-dives of key products.
   - 1 comparison ("X vs Y" or "HOTAS vs yoke"-style).
   - 1–2 informational/how-to articles, and 1 FAQ article with a `faq:` list (→ FAQ schema).
   - Keep About + Affiliate Disclosure.
   INTEGRITY (hard rules): never fake hands-on testing ("I tested…") for products not owned — write
   from specs + what real owners report, transparently. AI-drafted but genuinely useful. No thin
   filler. Affiliate links stay as `AFFILIATE_URL` placeholders.
5. **Build + verify** — `npm install`, `npm run build`, then confirm every route renders and the FAQ
   page outputs FAQPage JSON-LD.
6. **Deploy** — push to a new Vercel project (its own URL). Set `SITE.url` to that URL so
   canonical/OG/sitemap are correct, and redeploy.
7. **Output** — print exactly: `LIVE_URL: <the vercel url>` on its own line (so automation can grab it).

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
