import { defineCollection, z } from 'astro:content';

// Shared SEO/date fields every content type carries (E-E-A-T + GEO signals)
const base = {
  title: z.string(),
  description: z.string(),          // used for meta description + AI answer snippet
  published: z.string(),            // ISO date, e.g. "2026-07-13"
  updated: z.string().optional(),
  author: z.string().optional(),
  draft: z.boolean().default(false),
};

// Money page: buying guide ("Best X for Y")
const guides = defineCollection({
  type: 'content',
  schema: z.object({
    ...base,
    products: z.array(z.object({
      name: z.string(),
      url: z.string(),             // affiliate URL
      blurb: z.string().optional(),
    })).optional(),
  }),
});

// Money page: individual review / deep-dive
const reviews = defineCollection({
  type: 'content',
  schema: z.object({
    ...base,
    productName: z.string(),
    affiliateUrl: z.string(),
    rating: z.number().min(0).max(5).optional(),
    verdict: z.string().optional(),
  }),
});

// Traffic/trust page: how-to, explainer, troubleshooting, FAQ
const articles = defineCollection({
  type: 'content',
  schema: z.object({
    ...base,
    // Optional FAQ entries → rendered as FAQ schema (GEO gold)
    faq: z.array(z.object({
      q: z.string(),
      a: z.string(),
    })).optional(),
  }),
});

export const collections = { guides, reviews, articles };
