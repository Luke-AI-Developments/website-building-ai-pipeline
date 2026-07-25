# Always-On Hosting Plan (get it off the laptop)

The scraper only works if it's always running — which a laptop can't reliably do. Here's how to move
it to a box that runs 24/7. Prices verified July 2026 (sources at bottom).

## The one thing that shapes the choice

Two parts of the system have **different** hosting needs:

| Part | Needs | Runs on |
|---|---|---|
| **Scraper** (Reddit RSS → Gemini → Telegram) | just n8n + internet | *anything* — even the cheapest managed n8n |
| **Auto-build pipeline** (Execute Command → `claude -p` → Vercel) | n8n **on the same box as** Claude Code + Node + git + Vercel CLI | a full Linux VPS or a Pi where you install Claude Code |

So: managed n8n (PikaPods, n8n Cloud) can host the **scraper**, but **cannot** run the auto-build
(they have no shell / no Claude Code). For the *whole* system on one machine, you need a real VPS.

## Options (cheapest → easiest)

| Option | Cost | Runs scraper? | Runs auto-build? | Effort |
|---|---|---|---|---|
| **Oracle Cloud Free Tier** (ARM VM, 4 CPU/24GB, *permanent free*) | **£0** | ✅ | ✅ (install Claude Code) | Med–High; hard to grab a free ARM instance in busy regions |
| **PikaPods / InstaPods** (managed n8n) | ~£3/mo | ✅ | ❌ | Tiny — n8n live in a minute |
| **Hetzner VPS** (CX22/CPX21, Docker) | ~£4–5/mo | ✅ | ✅ | Med — ~30–60 min setup |
| **Contabo VPS** (4 vCPU/8GB) | ~£5–6/mo | ✅ | ✅ | Med |
| **n8n Cloud** (official managed) | ~£20/mo | ✅ | ❌ | Tiny, but pricey + no shell |
| **Raspberry Pi** (at home) | ~£50 once + pennies power | ✅ | ✅ | Med–High; you own the hardware |

## Recommendation

- **Just unblock the scraper this week, minimum fuss:** **PikaPods (~£3/mo)** — n8n running in a
  minute, they handle updates/SSL/backups. Import the scraper workflow, done. (Or Oracle free tier if
  you want £0 and don't mind the setup.)
- **Best end-state for the whole system (and best for your AI-technician portfolio):** a **Hetzner
  VPS (~£4–5/mo)** running n8n in Docker **plus Claude Code + Node + Vercel CLI installed on it**.
  Then *both* the scraper and the auto-build run 24/7 and your laptop is out of the loop entirely.
  This is the clean, "real infrastructure" version worth learning.

## Rough setup (Hetzner / any Ubuntu VPS)

1. Spin up an Ubuntu 24.04 VPS (Hetzner CX22).
2. Install Docker + Docker Compose; run **n8n** via Docker (persist data to a volume). Optionally use
   **Coolify** (an open-source, self-hosted Vercel/Heroku) to manage it with SSL — it's become the
   standard for this in 2026.
3. Import your scraper workflow; set the schedule; add your Telegram + Gemini creds.
4. For the auto-build: install **Node**, **git**, the **Vercel CLI**, and **Claude Code**; sign
   Claude Code into your Pro plan; authenticate `gh` and `vercel`. Now the Execute Command node can
   call `claude -p` right there on the server.
5. Point the workflow's Execute Command at the project path on the server.

## Security note
- Put n8n behind a login + HTTPS (Coolify/Traefik do this).
- Keep API keys/tokens in n8n credentials or server env vars — never in the workflow export.

---

### Sources
- [The Cheapest Way to Self-Host n8n in 2026 — dev.to](https://dev.to/vikasprogrammer/the-cheapest-way-to-self-host-n8n-in-2026-8ac)
- [Cheapest Self-Hosting for n8n in 2026 — Thinkpeak AI](https://thinkpeak.ai/cheapest-self-hosting-n8n-2026/)
- [Deploy n8n on Oracle Cloud Free Tier (2026) — Maaz Siddiqui](https://maazsiddiqui.com/blog/self-host-n8n-oracle-cloud-free)
- [Top 10 n8n Self-Hosting Solutions — Augmented Startups](https://www.augmentedstartups.com/blog/top-10-n8n-self-hosting-solutions)
