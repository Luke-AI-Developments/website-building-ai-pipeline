# Visual design & imagery spec

Problem: generated sites currently look **bare** — no imagery, flat single-accent colour. Make each
site look designed and niche-appropriate, **without breaking affiliate/image rules**. Two parts:

## 1. Template enhancement (one-time, in `trend-site-template`)
Upgrade the Astro template so it looks rich by default:
- **Hero section** — full-width banner: background/hero image + headline + subhead + primary CTA.
- **Cards with thumbnails** for guides/reviews/articles on the home and list pages.
- **Lead image** at the top of each review/article/guide page.
- **Fuller theme system** in `site.mjs`: `primary`, `secondary`, `surface/background`, `text` (not just
  one accent). Wire these as CSS variables through the layout so changing them re-skins the whole site.
- Tasteful defaults: solid type scale, spacing, section dividers — so it reads as intentional even
  before niche imagery.
- Keep it **fast** (Astro, `astro:assets` image optimisation) and **accessible** (alt text, contrast).

## 2. Per-build theming + imagery (in the build agent, after content)
For each niche:
- **Colour palette:** choose one that fits the niche's mood (warm earthy tones for cast-iron cooking;
  greens for gardening; cool blues/greys for tech). Set the theme values in `site.mjs`. The
  `niche-researcher` can suggest a palette, or the agent picks.
- **Imagery:** fetch niche-relevant photos from a **free stock source** (Unsplash or Pexels API — free
  key) for the hero + section/lead images. **Download into the site's `public/` folder and reference
  locally** (don't hotlink). Add real alt text; honour licence attribution if required.

### Legal caveat — product images (important)
Do **NOT** scrape or hotlink Amazon/retailer **product photos** — that breaks Amazon Associates terms
(product images must come via their Product Advertising API with approved assets). For now use generic
stock imagery or clean icons on product cards; the affiliate button ("Check price on Amazon") carries
the action. Revisit real product images later via the PA-API once the Associates account is approved.

## Integration
- Extend the template (`theme` + hero/image handling), exposed via `site.mjs` / content frontmatter.
- In `build-site-agent.md` **and** `pipeline/build-site-agent-prompt.txt`: after content generation,
  set the niche palette and fetch/place hero + section images, then build/deploy.
- Needs a **free Unsplash or Pexels API key** — keep it in an env var, never in the repo (add to
  CLAUDE.md gotchas).

## Test
Rebuild a niche and compare to the current bare sites — should have a hero image, themed colours, and
imagery on pages, while staying fast and honest (no faked or ToS-breaking product images).
