# Trend Site Template (Astro)

A fast, SEO-first affiliate content site. This is the reusable template the pipeline stamps out per
trend. Built to match `../site-content-model.md` and the GEO rules in `../ai-visibility-playbook.md`.

## Run it

```bash
npm install
npm run dev        # local preview at http://localhost:4321
npm run build      # static output in ./dist
```

Deploy: push to a Git repo and import on Vercel (framework preset: Astro), or `vercel` via CLI.

## How a new site is made (what Claude Code does per trend)

1. **Edit `src/config/site.mjs`** — name, tagline, niche, url, author bio, Amazon tag, colours, nav.
2. **Write content** as Markdown/MDX in `src/content/`:
   - `guides/` — buying guides ("Best X for Y"), with a `products` list in frontmatter.
   - `reviews/` — individual product reviews (`productName`, `affiliateUrl`, `rating`, `verdict`).
   - `articles/` — how-tos, explainers, FAQs. Add a `faq:` list in frontmatter → auto FAQ schema.
3. Delete the example content, drop in trend-specific pages sourced honestly (specs + real owner
   reports — never faked hands-on).
4. Build + deploy.

## What's built in (so every site ships correct by default)

- **Content-model structure**: money pages (guides, reviews), traffic/trust pages (articles/FAQ),
  About + Affiliate Disclosure.
- **GEO / SEO**: per-page `<title>`/description, canonical, Open Graph, author + published/updated
  dates, JSON-LD schema (WebSite, Article, Review→Product, FAQPage), sitemap, robots.txt.
- **Monetisation**: `AffiliateButton` (rel="nofollow sponsored"), `AdSlot` (off until `adsEnabled`),
  `EmailSignup` (a direct audience AI can't summarise away).
- **Config-driven theming** via `site.mjs`.

## Structure

```
src/
  config/site.mjs         ← main per-site knobs
  content/                ← the content (Markdown/MDX)
    config.ts             ← content schemas
    guides/ reviews/ articles/
  layouts/BaseLayout.astro
  components/             ← AffiliateButton, AdSlot, EmailSignup
  pages/                  ← routes (index, list + [...slug] per type, about, disclosure)
public/robots.txt
```

## Note
This scaffold was drafted in Cowork but not build-tested there (no npm access in that sandbox).
First run it locally with Claude Code — install, `npm run build`, fix any version/import nits, then
deploy. After that, it's the reusable base for every trend site.
