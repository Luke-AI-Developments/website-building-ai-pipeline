# Amazon Associates (UK) — application walkthrough + drafted answers

Listing: **ironseam.vercel.app** (Ironseam — men's durable work trousers). Additional sites get
added to this SAME account later via "Add Websites/Apps" in Associates Central — no need to
re-apply per site.

Anything involving your identity, address, phone verification, tax declaration, or bank/payment
details is for you to enter yourself — never me or Claude Code. Everything below is either
informational (what to expect) or copy-paste text for the descriptive questions.

## Walkthrough

1. Go to **affiliate-program.amazon.co.uk** → **Join Now for Free**.
2. Sign in with your existing Amazon.co.uk account (or create one) — your normal personal account
   is fine; nothing here is shown publicly, it's just how Amazon identifies the payee.
3. **Account details** — name, address, phone number (used for identity verification via SMS code).
   You enter this.
4. **Website/app URL(s)** — add `https://ironseam.vercel.app`. You can add up to 50 URLs total, so
   just add each new site here as it goes live rather than reapplying.
5. **Preferred Store ID** — this becomes your tracking tag (Amazon appends a marketplace suffix
   automatically, e.g. `-21` for UK). Try `ironseam` first; if taken, `ironseamuk` or `getironseam`
   as fallbacks.
6. **Profile questions** — the descriptive section (what your site's about, how you drive traffic,
   how you link to products, estimated traffic, why you're joining). Drafted answers below.
7. **Tax interview** — a short electronic form confirming UK tax residency. You complete this
   yourself (it's identity/tax data).
8. **Payment method** — bank details for direct deposit. You enter this yourself; Amazon lets you
   add this before or shortly after submitting.
9. **Submit** — you get a tracking ID immediately and can start building links right away, but the
   account is provisional: Amazon requires at least one qualifying sale within 180 days of signing
   up, or the account closes (you'd reapply from scratch). This is why it's worth having the site
   live with some real content before applying — which it now is.
10. Once through, take the tracking ID (format like `ironseam-21`) and set it as
    `AMAZON_ASSOCIATES_TAG` before your next build/redeploy — the pipeline picks it up automatically
    (see `CLAUDE.md` conventions).

## Drafted answers (copy-paste)

**What is the primary content of your website?**
> Ironseam is an independent buying-guide and review site focused on men's durable work trousers —
> helping tradespeople and outdoor workers choose hardwearing workwear that actually holds up.
> Content includes in-depth product reviews, head-to-head comparisons, and care/maintenance guides,
> all written from product specifications and real owner feedback.

**How do you drive traffic to your site?**
> Primarily organic search — content is structured around the specific questions buyers are
> searching for (best pants for a given trade, durability comparisons, care instructions), with
> clear direct-answer formatting and FAQ schema markup to support search visibility. The site is
> newly launched, so traffic is currently building; we plan to grow it through targeted content
> production and relevant, non-spammy community engagement rather than paid ads.

**How do you (or will you) build links to Amazon / add Amazon products to your site?**
> Manually, within the site's own review and buying-guide content — each product recommendation
> links directly to the relevant Amazon listing via a standard text/button link placed in context,
> not through a plugin or automated feed.

**Estimated average monthly unique visitors / page views:**
> Under 500 currently — the site has just launched. Expected to grow as content gets indexed and
> ranks organically over the coming weeks/months.

**Why do you want to join the Amazon Associates program?**
> To monetize genuinely useful, well-researched buying content through affiliate commission on the
> products we recommend, funding further content production.

## Status: applied and got a tag — 2026-07-25

Submitted, Associates ID assigned immediately: **`ironseam-21`** (Amazon.co.uk Associates).

Amazon's own confirmation page said the account is reviewed for compliance once it generates
**three qualifying sales** (not the "one sale" figure general guides quote — go with what Amazon's
own page said). Until those three sales happen, the account can still be closed — so getting real
traffic to Ironseam is now the priority, not a later step.

Next actions:
- Set `AMAZON_ASSOCIATES_TAG=ironseam-21` in your environment before running any build — all future
  builds insert it automatically (see `CLAUDE.md`).
- The 5 already-live sites (cast-iron-carbon-steel-care, durable-travel-luggage,
  ergonomic-office-furniture, flight-sim-xbox, manual-reel-mowers) still need a manual retrofit —
  paste `amazonTag: "ironseam-21"` into each `src/config/site.mjs`, `npm run build`, redeploy. Same
  account/tag works across all your own sites.
- Add each new site's URL to this same Associates account as it goes live (Associates Central →
  "Add Websites/Apps") — no new application needed.
