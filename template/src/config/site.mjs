// ===================================================================
// PER-SITE CONFIG — this is the main file Claude Code edits per trend.
// Change these values and the whole site rebrands. Content lives in
// src/content/ as Markdown/MDX.
// ===================================================================

export const SITE = {
  // Identity
  name: 'Trend Site Template',
  tagline: 'Honest guides and reviews for [the niche].',
  niche: 'gadgets',                 // the trend/category this site covers
  url: 'https://example.com',       // set to the Vercel/prod domain before deploy

  // Author / trust (E-E-A-T — real name + bio)
  author: {
    name: 'The Editor',
    bio: 'We research products so you don’t have to — comparing specs, prices, and what real owners say.',
  },

  // Monetisation
  affiliate: {
    amazonTag: 'yourtag-21',        // Amazon Associates tracking id
    disclosure: 'As an Amazon Associate and affiliate we may earn from qualifying purchases at no extra cost to you.',
  },
  adsEnabled: false,                // flip on once ad network is approved
  emailEnabled: true,

  // Analytics: Vercel Web Analytics, wired into BaseLayout.astro via @vercel/analytics/astro.
  // Nothing to configure here — it activates automatically once deployed on Vercel.

  // Brand colours (CSS variables) — pick a palette that fits the niche's mood
  // (warm earthy for cast-iron cooking, greens for gardening, cool blues/greys for tech, etc).
  theme: {
    primary: '#1d9e75',      // main brand colour — links, buttons, headings accents
    primaryDark: '#0f6e56',  // hover/active state for primary
    secondary: '#e8f5f0',    // complementary tone — tags, highlights, hero backdrop
    surface: '#f7f9f8',      // card/section background (slightly off-white, not stark)
  },

  // Hero banner on the homepage (and reused as a fallback lead-image backdrop)
  hero: {
    headline: '',            // defaults to SITE.name if empty
    subhead: '',             // defaults to SITE.tagline if empty
    ctaLabel: 'See the top picks',
    ctaHref: '/guides/',
    image: '',               // e.g. '/images/hero.jpg' — local file under public/. Optional:
                              // falls back to a primary/secondary gradient if not set.
  },

  // Top nav (label + href)
  nav: [
    { label: 'Buying Guides', href: '/guides/' },
    { label: 'Reviews', href: '/reviews/' },
    { label: 'Guides & FAQ', href: '/articles/' },
    { label: 'About', href: '/about/' },
  ],
};
