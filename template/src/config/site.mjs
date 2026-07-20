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

  // Analytics (paste a script/snippet id when ready)
  analyticsId: '',

  // Brand colours (CSS variables)
  theme: {
    accent: '#1d9e75',
    accentDark: '#0f6e56',
  },

  // Top nav (label + href)
  nav: [
    { label: 'Buying Guides', href: '/guides/' },
    { label: 'Reviews', href: '/reviews/' },
    { label: 'Guides & FAQ', href: '/articles/' },
    { label: 'About', href: '/about/' },
  ],
};
