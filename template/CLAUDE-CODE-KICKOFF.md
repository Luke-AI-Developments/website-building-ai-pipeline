# Claude Code kickoff prompt

Open the `template/` folder in Claude Code and paste the prompt below.

---

## Paste this:

You are working in an Astro site template (`template/`) that will be the reusable base for a network
of fast, SEO-first affiliate content sites. It was scaffolded but never build-tested. Do this:

1. **Get it running.** Run `npm install`, then `npm run build`. Fix any errors — expect possible
   version/import/config nits (Astro 4, `@astrojs/mdx`, `@astrojs/sitemap`, content collections in
   `src/content/config.ts`, MDX importing `.astro` components). Then `npm run dev` and confirm every
   route renders:
   - `/` (home hub), `/guides/`, `/reviews/`, `/articles/`
   - one of each detail page: `/guides/best-flight-sim-controllers/`, `/reviews/example-review/`,
     `/articles/flight-sim-controller-faq/`
   - `/about/`, `/affiliate-disclosure/`
2. **Verify the SEO/GEO output** in the built HTML: each page has a `<title>`, meta description,
   canonical, Open Graph tags, and JSON-LD (`WebSite`, `Article`, `Review`, and `FAQPage` on the FAQ
   article). Confirm `sitemap-index.xml` and `robots.txt` are generated.
3. **Don't change the architecture** — keep the config-driven approach (`src/config/site.mjs`) and the
   three content collections (`guides`, `reviews`, `articles`). Only fix what's broken and tidy.
4. **Report back**: what you changed to make it build, and a screenshot or description of the home page.

Context files (read them, don't duplicate them):
- `README.md` — how the template works and how sites get filled per trend.
- `../site-content-model.md` — the content structure every site must have.
- `../ai-visibility-playbook.md` — the GEO/SEO rules baked into the layout.

Goal for this session: a **clean, building, locally-running template** ready to deploy to Vercel.
Do NOT write real niche content yet — that happens per trend later. Just make the scaffold solid.

---

## After it builds
- Push to a Git repo and import into Vercel (framework preset: Astro), or deploy with the Vercel CLI.
- Come back to Cowork and we'll wire it into the auto-build pipeline and point it at the first real
  trend from the scraper.
