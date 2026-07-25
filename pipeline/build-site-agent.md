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
   itself. Create a new Git repo for it.
2. **Config** — set `src/config/site.mjs`: a clean brand `name`, `tagline`, `niche`, `author` bio,
   leave `amazonTag` as the placeholder, `emailEnabled: true`, `adsEnabled: false`.
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
   - **Real imagery (only if `UNSPLASH_ACCESS_KEY` is set in the environment):** fetch a hero photo
     and a lead photo per guide/review/article from the Unsplash API
     (`https://api.unsplash.com/search/photos?query=<niche term>` with header
     `Authorization: Client-ID $UNSPLASH_ACCESS_KEY`), **download the files into `public/images/`**
     (never hotlink), and set `SITE.hero.image` + each content file's `image` / `imageAlt` /
     `imageCredit` frontmatter (credit format: "Photo by <name> on Unsplash"). NEVER use Amazon/retailer
     product photos (breaks Associates ToS) — stock/lifestyle imagery only.
     If the env var isn't set, skip imagery entirely — do not fail or block on it. The template's
     hero/card gradients and fuller colour theme already make the site look designed without photos.
6. **Build + verify** — `npm install`, `npm run build`, then confirm every route renders and the FAQ
   page outputs FAQPage JSON-LD.
7. **Deploy** — push to a new Vercel project (its own URL). Set `SITE.url` to that URL so
   canonical/OG/sitemap are correct, and redeploy.
8. **Output** — print exactly these two lines (so automation can grab them):
   `PROJECT_FOLDER: <the folder name under sites/ you actually used>`
   `LIVE_URL: <the vercel url>`
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
