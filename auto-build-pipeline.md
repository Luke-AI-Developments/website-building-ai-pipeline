# Auto-Build Pipeline

> BUILD DOCS (concrete, current): `pipeline/build-site-agent.md` (the core Claude Code agent) and
> `pipeline/n8n-telegram-wiring.md` (the Telegram wrapper). Sequence: prove the agent by hand → wrap
> in Telegram. The overview below is the original design rationale.

---


Goal: once an idea is nailed, Luke sends one Telegram message and gets back a link to a working
**private preview site** — then requests changes via Telegram until it's ready to go live.

> Human checkpoints kept on purpose: (1) Luke approves the *idea* before any build, (2) Luke
> approves the *result* before it goes public. Everything between is automated.

---

## The chain

1. **Telegram (trigger)** — Luke replies to a trend alert with `/build <trend>` (plus any notes).
2. **Orchestrator (n8n)** — catches the message, loads the site template + the trend brief, and starts the build job. n8n is chosen because Luke already knows it.
3. **Claude Code (headless)** — runs non-interactively (print/`-p` mode or the Agent SDK) against a reusable template repo. It fills in the niche: content, product/affiliate blocks, config, GEO structure. It does NOT invent architecture each time.
4. **Quality gate** — pipeline runs the build + a basic check (does it compile, does the homepage load). Only a passing build proceeds. A failing build pings Telegram with the error instead of a dead link.
5. **Vercel (private preview)** — deploy a **preview deployment** (not production). Vercel returns a shareable preview URL. Nothing is public yet.
6. **Telegram (review)** — bot sends: "Preview ready: <url>". Luke opens it on phone/desktop.
7. **Change-request loop** — Luke replies in plain English ("make the header green", "swap the top product", "add a buying guide"). n8n feeds that back into the *same* Claude Code working repo → rebuild → new preview → new link. Repeat until happy.
8. **Go live** — when Luke sends `/ship`, the pipeline promotes the preview to **production** (`vercel --prod`). Only this step makes it public.

---

## The real unlock: a reusable template

Build ONE site template first (a one-off task). The agent's speed and reliability come from
narrowing its job. The template ships with, from day one:

- Layout, navigation, mobile-first styling.
- Affiliate blocks + display-ad slots.
- GEO structure from `ai-visibility-playbook.md` (direct-answer format, schema.org, author/date fields, Bing-ready).
- Email capture.
- Analytics.
- A config file for niche name, keywords, products, colours.

The agent then does "fill in the trend," not "design a website." This is what makes 24–72h realistic.

The template also ships with the **content structure** every site needs (money pages, traffic/trust
pages, legal) — see `site-content-model.md`. So each build arrives as a real, useful resource, not a
thin doorway site.

---

## Vercel notes (Luke has an account)

- **Preview deployments** are the core feature we use — every build gets its own private URL, perfect for review; nothing public until we promote.
- Two wiring options: (a) **Git-based** — n8n pushes to a branch, Vercel auto-builds a preview; or (b) **Vercel CLI** — orchestrator runs `vercel` (preview) and `vercel --prod` (live) with a project token.
- Store the Vercel token as an env var/secret in n8n, never in code.

---

## Guardrails

- **Quality gate before the link** — never send Luke a broken preview; send the error instead.
- **Cost metering** — each autonomous run burns API tokens; log per-run cost.
- **Security/scope** — the agent is scoped to one project repo; no access to anything sensitive; secrets in env vars only.
- **Persistent working repo** — keep the build repo alive between messages so change-requests are incremental, not from-scratch.
- **Two human gates stay** — idea approval (`/build`) and go-live approval (`/ship`).

---

## To verify at build time (moves fast — flag, don't assume)

- Exact Claude Code headless invocation (print mode / Agent SDK) and how to pass the template + brief.
- Vercel preview + promote-to-prod commands and token setup.
- Telegram bot ↔ n8n webhook wiring and the reply-threading for the change loop.

## Build order

1. Build the reusable site template (one-off).
2. Wire Telegram → n8n → Claude Code headless → Vercel preview → Telegram link.
3. Add the change-request loop.
4. Add `/ship` promote-to-production.
5. Add quality gate + cost logging.

## Open questions for Luke

1. n8n as the orchestrator — confirm (vs a plain Python script)?
2. Vercel wiring — Git-based auto-preview, or CLI with a token?
3. What tech stack should the template be (e.g. Next.js on Vercel is the natural fit)?
