# Site #1 Content Pack — Flight Sim Controllers for Xbox

Everything Claude Code needs to build site #1 from `template/`. Content is drafted honestly from
research (sources at bottom). Prices are approximate — the affiliate buttons say "Check price" so we
never show a stale number.

> Monetisation note: the two newly-announced controllers (Honeycomb Echo XPC, PowerA X-Ray) are NOT
> on sale yet → no affiliate links for those (they're the traffic hook + email capture). The
> **available** products (Thrustmaster HOTAS One, Turtle Beach VelocityOne range) carry the affiliate
> links and earn from day one. Replace every `AFFILIATE_URL` placeholder with a real Amazon Associates
> link (your tag) once the account's set.

---

## 1. Site config (`src/config/site.mjs`)

```js
name: 'Yoke & Throttle',
tagline: 'Honest guides to flight sim controllers for Xbox and PC.',
niche: 'flight sim controllers for Xbox',
url: '<vercel-url-or-domain>',
author: {
  name: 'Luke @ Yoke & Throttle',
  bio: 'We research flight sim gear — comparing specs, prices, and what real pilots-in-the-making report — so you buy the right controller once.',
},
affiliate: { amazonTag: 'YOURTAG-21', disclosure: 'As an Amazon Associate we earn from qualifying purchases at no extra cost to you.' },
nav: [
  { label: 'Best Controllers', href: '/guides/' },
  { label: 'Reviews', href: '/reviews/' },
  { label: 'Guides & FAQ', href: '/articles/' },
  { label: 'About', href: '/about/' },
],
```
Domain idea: `yokeandthrottle.com` (check availability; Vercel subdomain is fine to start).

---

## 2. GUIDE (hub, money page) → `src/content/guides/best-flight-sim-controllers-xbox.mdx`

```mdx
---
title: "Best Flight Sim Controllers for Xbox (2026)"
description: "The best flight sim controllers you can actually buy for Xbox right now — from a cheap first HOTAS to a full yoke-and-throttle setup — plus the new controllers coming later in 2026."
published: "2026-07-14"
author: "Luke @ Yoke & Throttle"
products:
  - name: "Thrustmaster HOTAS One (MSFS Edition)"
    url: "AFFILIATE_URL"
    blurb: "Best starting point — cheapest way onto a stick + throttle on Xbox (~$100)"
  - name: "Turtle Beach VelocityOne Flightstick"
    url: "AFFILIATE_URL"
    blurb: "Best mid-range HOTAS — stick + throttle, Xbox-ready"
  - name: "Turtle Beach VelocityOne Flight"
    url: "AFFILIATE_URL"
    blurb: "Best premium — full yoke, throttle quadrant, trim wheel + display"
---
import AffiliateButton from '../../components/AffiliateButton.astro';

If you play **Microsoft Flight Simulator on Xbox**, a controller only gets you so far — a dedicated
stick or yoke transforms it. Here's what's genuinely worth buying today, at every budget, plus the
new Xbox-specific controllers arriving later in 2026.

**One rule for Xbox first:** only buy gear explicitly labelled **Xbox-compatible**. Xbox locks out
generic USB peripherals, so a PC-only yoke won't work. Everything below is Xbox-supported and
plug-and-play over USB.

## Best starting point — Thrustmaster HOTAS One
The cheapest honest way onto a proper stick-and-throttle on Xbox. Reviewers consistently rate it as
the easiest entry: plug in over USB, and you're flying with far more control than a gamepad.

<AffiliateButton url="AFFILIATE_URL" label="Check price on Amazon" />

## Best mid-range — Turtle Beach VelocityOne Flightstick
A step up in build and buttons — a HOTAS stick with integrated throttle, Xbox-ready. A good middle
ground if the entry stick feels limiting but a full yoke is overkill.

<AffiliateButton url="AFFILIATE_URL" label="Check price on Amazon" />

## Best premium — Turtle Beach VelocityOne Flight
The closest to a real cockpit on Xbox: a 180-degree **yoke**, modular **throttle quadrant**, trim
wheel and a full-colour flight-management display. Ideal if you mostly fly airliners and general
aviation rather than fast jets.

<AffiliateButton url="AFFILIATE_URL" label="Check price on Amazon" />

## Coming later in 2026 (not on sale yet)
Two Xbox-specific controllers were announced in 2026 — Honeycomb's **Echo Aviation Controller XPC**
(a 3-in-1 with pedals, throttle and control unit, due fall 2026) and PowerA's **Project X-Ray Flight
Deck**. Neither has a price or on-sale date yet. [Read what we know →](/articles/new-xbox-flight-sim-controllers-2026/)

*We update this guide as gear ships and prices change.*
```

---

## 3. REVIEW (money page) → `src/content/reviews/thrustmaster-hotas-one.mdx`

```mdx
---
title: "Thrustmaster HOTAS One Review: The Best First Flight Stick for Xbox?"
description: "Is the Thrustmaster HOTAS One the right first flight sim controller for Xbox? What it does well, where it falls short, and who it's for."
published: "2026-07-14"
author: "Luke @ Yoke & Throttle"
productName: "Thrustmaster HOTAS One"
affiliateUrl: "AFFILIATE_URL"
rating: 4
verdict: "The easiest, cheapest way onto a real stick-and-throttle on Xbox. Not fancy, but the best on-ramp to the hobby."
---
import AffiliateButton from '../../components/AffiliateButton.astro';

If you're moving off a gamepad, the HOTAS One is the controller most Xbox flight simmers start with —
and for good reason.

## What it does well
Reviewers highlight the price-to-capability ratio: a genuine hands-on-throttle-and-stick setup for
around $100, plug-and-play on Xbox over USB, with enough buttons and axes for airliners and GA.

## Where it falls short
It's plastic and entry-level — the throttle and stick don't have the precision or heft of premium
gear, and hardcore simmers eventually outgrow it.

## Who it's for
Newcomers who want a big upgrade over the controller without spending yoke money.

<AffiliateButton url="AFFILIATE_URL" label="Check price on Amazon" />

*Based on published reviews and owner feedback; we'll add hands-on notes if we test a unit.*
```

---

## 4. COMPARISON (money page) → `src/content/articles/hotas-vs-yoke-xbox.mdx`

```mdx
---
title: "HOTAS vs Yoke for Xbox Flight Sim: Which Should You Buy?"
description: "Stick or yoke for Microsoft Flight Simulator on Xbox? A plain-English guide to which control type fits how you actually fly."
published: "2026-07-14"
author: "Luke @ Yoke & Throttle"
---
The short answer: **fly airliners and general aviation → a yoke. Fly fast jets, helicopters or combat
→ a HOTAS stick.**

## HOTAS (stick + throttle)
Best for high-workload flying where your hands stay on the throttle and stick. Cheaper to get into
(the Thrustmaster HOTAS One is the classic entry). Compact on a desk.

## Yoke
Best for the airliners and Cessnas most Flight Simulator players actually fly — the yoke motion
matches the aircraft. The Turtle Beach VelocityOne Flight is the main Xbox-compatible full setup.

## If you're not sure
Start with an entry HOTAS. It's the cheapest way to learn whether the hobby sticks before spending
on a yoke.
```

---

## 5. NEWS / TRAFFIC HOOK → `src/content/articles/new-xbox-flight-sim-controllers-2026.mdx`

```mdx
---
title: "New Xbox Flight Sim Controllers Coming in 2026: Honeycomb Echo XPC & PowerA X-Ray"
description: "Two flight sim controllers built specifically for Xbox were announced in 2026 — the Honeycomb Echo Aviation Controller XPC and PowerA's Project X-Ray Flight Deck. Here's what we know."
published: "2026-07-14"
author: "Luke @ Yoke & Throttle"
---
For years the best flight sim gear skipped Xbox. That's changing — two Xbox-specific controllers were
announced in 2026.

## Honeycomb Echo Aviation Controller XPC
A console version of Honeycomb's Echo — a 3-in-1 combining rudder pedals, throttle controls and a
control unit in one compact unit, aimed at Xbox Series X|S. Due **fall 2026**; price not yet announced.

## PowerA Project X-Ray Flight Deck
Announced June 2026, developed with Meridian GMT, aiming to put dedicated flight controls into an
Xbox controller. No price or release date confirmed yet.

## Should you wait?
If you want to fly *now*, the [controllers available today](/guides/best-flight-sim-controllers-xbox/)
are the move — these two aren't on sale yet. **Want us to tell you the moment they launch (and how
they compare)?** Drop your email below.

*Updated as details are confirmed.*
```

---

## 6. FAQ (traffic/trust, GEO) → `src/content/articles/flight-sim-controller-faq.mdx`

```mdx
---
title: "Flight Sim Controllers for Xbox: Setup & Buying FAQ"
description: "Quick, direct answers to the most common questions about flight sim controllers for Xbox."
published: "2026-07-14"
author: "Luke @ Yoke & Throttle"
faq:
  - q: "Do you need a yoke to play Microsoft Flight Simulator on Xbox?"
    a: "No. You can fly with the standard controller or a joystick. A yoke adds realism for airliners and GA but isn't required to start."
  - q: "Will any flight stick work on Xbox?"
    a: "No — Xbox only supports peripherals explicitly labelled Xbox-compatible. A PC-only stick or yoke won't be recognised. Always check for Xbox support before buying."
  - q: "What's the cheapest way to start on Xbox?"
    a: "The Thrustmaster HOTAS One is the most affordable proper stick-and-throttle for Xbox, at around $100."
  - q: "HOTAS or yoke — which is better?"
    a: "HOTAS for jets, helicopters and combat; a yoke for airliners and general aviation. Most Flight Simulator players fly airliners, so a yoke feels more natural — but a HOTAS is cheaper to start with."
  - q: "Do Xbox flight controllers need extra software or adapters?"
    a: "No. Xbox-labelled controllers are plug-and-play over USB — no adapters or driver setup."
---
Short, direct answers first — because that's what search and AI assistants surface.

New to this? Start with our [best controllers guide](/guides/best-flight-sim-controllers-xbox/) and
the [HOTAS vs yoke breakdown](/articles/hotas-vs-yoke-xbox/).
```

---

## Sources (for accuracy; keep site claims honest)
- Notebookcheck — "Special Microsoft Flight Simulator controller is coming to Xbox" (Honeycomb Echo XPC): https://www.notebookcheck.net/Special-Microsoft-Flight-Simulator-controller-is-coming-to-Xbox.1341165.0.html
- Windows Central — PowerA Project X-Ray Flight Deck (with Meridian GMT): https://www.windowscentral.com/gaming/xbox/powera-now-wants-in-on-microsoft-flight-simulator-2024-with-a-specialist-new-controller-and-itll-work-on-xbox-too
- Turtle Beach — Best Xbox Flight Simulator Controllers (2026): https://www.turtlebeach.com/blog/xbox-flight-simulator-controllers
- Windows Central — best flight sticks for MSFS (Xbox/PC): https://www.windowscentral.com/best-joysticks-and-flight-sticks-microsoft-flight-simulator
- MSFS official — Beginner's Guide to Peripherals: https://www.flightsimulator.com/guide/beginners-guide-to-peripherals/

## Integrity reminders
- Don't claim we hands-on tested gear we haven't — the drafts use "reviewers/owners report" framing.
- Upcoming products: no affiliate links, no fake specs/prices — only what's confirmed.
- Replace `AFFILIATE_URL` / `YOURTAG-21` with real Amazon Associates links once approved.
