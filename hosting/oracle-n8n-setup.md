# Oracle Cloud Free Tier → n8n (24/7, £0)

Move the scraper onto an always-free Oracle VM so it runs without your laptop. Later, install Claude
Code on the same VM to run the auto-build pipeline too.

> Honest heads-up: Oracle's console is clunky and **free ARM instances are often "out of capacity"** —
> you may need to retry, switch region, or fall back to the tiny AMD micro. This is the fiddliest
> option; the payoff is £0 forever. Once you're SSH'd in, **Claude Code can run the install commands
> for you** — just paste them.

---

## Phase 0 — Account (~15 min)
1. Sign up at **cloud.oracle.com** → "Start for free". Needs a card for identity verification;
   always-free resources are **not** charged. Pick your home region carefully — you can't change it,
   and ARM capacity varies by region.
2. After signup you land in the OCI console.

## Phase 1 — Create the VM (Always Free)
1. Console → **Compute → Instances → Create instance**.
2. **Image:** Canonical **Ubuntu 24.04**.
3. **Shape:** click *Change shape* → **Ampere (ARM)** → `VM.Standard.A1.Flex`, set **2 OCPU / 12 GB**
   (well within the always-free 4 OCPU/24 GB). If it says "out of capacity", either retry later or
   use the always-available **VM.Standard.E2.1.Micro** (AMD, 1 GB — tight but works for just the scraper).
4. **SSH keys:** choose *Generate a key pair for me* and **download both keys** (you need the private
   key to log in). Or paste your own public key.
5. **Networking:** keep "Assign a public IPv4 address" ticked. Create.
6. Note the instance's **public IP**.

## Phase 2 — Open the ports
Two layers block traffic by default:
1. **Cloud firewall (VCN):** Networking → your VCN → the public subnet → **Security List** → *Add
   Ingress Rule*: Source `0.0.0.0/0`, TCP, destination port **5678** (n8n). (Later add 80/443 if you
   put HTTPS in front.)
2. **OS firewall (Ubuntu on Oracle uses iptables):** after you SSH in (Phase 3), run:
   ```
   sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 5678 -j ACCEPT
   sudo netfilter-persistent save
   ```

## Phase 3 — Connect + install Docker + n8n
1. SSH in (from a terminal, using the private key you downloaded):
   ```
   ssh -i path\to\privatekey ubuntu@YOUR_PUBLIC_IP
   ```
2. Install Docker:
   ```
   curl -fsSL https://get.docker.com | sudo sh
   sudo usermod -aG docker ubuntu    # then log out/in once
   ```
3. Run n8n (persistent data, basic auth, correct timezone):
   ```
   docker run -d --restart unless-stopped --name n8n \
     -p 5678:5678 \
     -e N8N_BASIC_AUTH_ACTIVE=true \
     -e N8N_BASIC_AUTH_USER=luke \
     -e N8N_BASIC_AUTH_PASSWORD='choose-a-strong-password' \
     -e N8N_SECURE_COOKIE=false \
     -e GENERIC_TIMEZONE=Europe/London \
     -e N8N_HOST=YOUR_PUBLIC_IP \
     -v n8n_data:/home/node/.n8n \
     docker.n8n.io/n8nio/n8n
   ```
4. Open **http://YOUR_PUBLIC_IP:5678** in your browser → log in with the basic-auth user/password.

## Phase 4 — Move the scraper over
1. In the new n8n, **Import from File** → `scraper/reddit-scraper.v2-rss.n8n.json`.
2. Re-add credentials (Telegram bot, and your Gemini key in the Code node) and your Chat ID.
3. Paste the current `scoring-rss.js` and `monetisable-check-gemini.js` into their nodes.
4. **Activate** the workflow. It now runs every 4h on the server — laptop-free.

> Tip: because it's a fresh n8n, the de-dupe memory starts empty, so the first run may send a batch.

## Phase 5 — (Later) Add the auto-build on the same VM
To run the Telegram→build pipeline here too, install on the VM:
```
sudo apt update && sudo apt install -y nodejs npm git
npm i -g vercel @anthropic-ai/claude-code   # Claude Code CLI
```
Then sign Claude Code into your Pro plan, `gh auth login`, `vercel login`, and point the Execute
Command node at the project path on the server. (Do this after the scraper's proven on Oracle.)

## Security
- Use a strong basic-auth password (above). Better: put n8n behind HTTPS with a domain + Caddy/Traefik
  later, and restrict the 5678 ingress to your IP if you don't need it public.
- Keep all API keys in n8n credentials / server env — never in the workflow export you push to GitHub.

---
Once the scraper's happily running on Oracle, the "keep the laptop on" problem is gone for good — and
upgrading to a paid Hetzner box later is a 10-minute lift-and-shift of the same Docker setup.
