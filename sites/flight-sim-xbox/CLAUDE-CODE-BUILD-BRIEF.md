# Claude Code build brief — Site #1 (Flight Sim Controllers for Xbox)

Open Claude Code in the `template/` project (or wherever you keep the template repo) and paste the
prompt below. Content to use is in `CONTENT-PACK.md` (same folder as this file).

---

## Paste this into Claude Code:

Build a new affiliate content site from the `trend-site-template` — do NOT modify the template
itself. Steps:

1. **Make a new project from the template.** Copy the template into a new folder named
   `flight-sim-xbox` (or create a new repo from it). This is a separate site, separate Vercel project.
2. **Set the config** in `src/config/site.mjs` using the "Site config" section of
   `CONTENT-PACK.md` (name "Yoke & Throttle", tagline, niche, author, nav). Leave `amazonTag` as the
   placeholder for now; keep `emailEnabled: true`, `adsEnabled: false`.
3. **Replace the example content** in `src/content/` with the pages in `CONTENT-PACK.md`:
   - `guides/best-flight-sim-controllers-xbox.mdx`
   - `reviews/thrustmaster-hotas-one.mdx`
   - `articles/hotas-vs-yoke-xbox.mdx`
   - `articles/new-xbox-flight-sim-controllers-2026.mdx`
   - `articles/flight-sim-controller-faq.mdx`
   Delete the old example files (best-flight-sim-controllers guide, example-review, the old FAQ).
4. **Leave `AFFILIATE_URL` placeholders as-is** — Luke swaps in real Amazon Associates links after
   the account's approved. Don't invent product URLs.
5. **Build + verify**: `npm install`, `npm run build`, then `npm run dev` and confirm every page
   renders, internal links work, and the FAQ page outputs FAQPage JSON-LD.
6. **Deploy** to a NEW Vercel project (its own URL), and set `SITE.url` to that URL so
   canonical/OG/sitemap are correct. Report the live URL.

Do not add content beyond the pack. Keep it honest — no faked hands-on claims, no links/specs for the
unreleased controllers.

---

## After it's live (Luke's follow-ups, not Claude Code's)
- **Amazon Associates:** apply with the live site (you need a real site to apply). Once approved,
  replace every `AFFILIATE_URL` with a real product link carrying your tag. Note: Associates requires
  ~3 qualifying sales within 180 days to keep the account — so the traffic push matters.
- **Email capture:** wire the `EmailSignup` form to a free provider (Buttondown/MailerLite) so the
  "notify me when the new controllers launch" capture actually collects addresses.
- **Traffic:** value-first participation in the flight-sim subreddits the trend came from — not spam.
