# helloKotagiri — Cloud Setup Guide

This guide covers two things:

1. **Live site in the cloud** — the app runs 24/7 at a public URL (hellokotagiri.com)
2. **GitHub connected** — code is on GitHub so Cursor Cloud Agents and CI/CD can work while your laptop is closed

---

## Current status

| Item | Status |
|---|---|
| Local git remote | Connected → `https://github.com/enkayas/hello-ktg.git` |
| GitHub account | `enkayas` (authenticated via `gh`) |
| Production branch | `main` (auto-deploys on push to `web/`) |
| GitHub Actions secrets | Configured (Cloudflare + Supabase) |
| CI/CD workflow | `.github/workflows/deploy-cloudflare.yml` — **active, passing** |
| Live URLs | hellokotagiri.com · console.hellokotagiri.com · helloktg.silvertip.workers.dev |
| Supabase backend | Live at `lewhmonjzoznnqxtdkcn.supabase.co` |

**Important:** Uncommitted local changes are invisible to Cloud Agents and CI.
Agents must **commit and push** after work so the repo stays the source of truth.

---

## Agent deploy rule (read every session)

**AI assistants must deploy after every live-site change — without asking.**

1. `cd web && npm run build` — fix errors
2. `cd web && npm run deploy` — or push to `main` and verify Actions passed
3. Report "live at hellokotagiri.com" to the owner

Do not end a task with "you can deploy if you want" or "shall I deploy?"


## Part 1 — Push code to GitHub

Your laptop already has the repo linked. The Next.js app and Supabase work live on a
feature branch that GitHub does not have yet.

```bash
cd /Users/nk/Desktop/helloKTG

# Push the feature branch (keeps main untouched)
git push -u origin claude/confident-wozniak-wsoqut
```

When you are ready for production, merge that branch into `main` (via PR on GitHub).
Every push to `main` that touches `web/` will auto-deploy (see Part 3).

**Optional — commit the new docs and static site work first:**

```bash
git add PROJECT.md DEPLOY.md AGENTS.md .github/ web/.env.example
git commit -m "Add cloud deployment guide and GitHub Actions workflow"
git push
```

Do **not** commit `.env.local` — it contains secrets and is gitignored.

---

## Part 2 — Deploy the app to Cloudflare (recommended)

The Next.js app is already configured for **Cloudflare Workers** via OpenNext.

### 2a. One-time Cloudflare setup

1. Log in at [dash.cloudflare.com](https://dash.cloudflare.com) (free account is fine).
2. Note your **Account ID** (Workers dashboard → right sidebar).
3. Create an **API token**: My Profile → API Tokens → Create Token →
   **Edit Cloudflare Workers** template → Create.
4. Save the token somewhere safe — you will only see it once.

### 2b. Add secrets to GitHub

Go to **github.com/enkayas/hello-ktg → Settings → Secrets and variables → Actions**
and add:

| Secret name | Value |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Token from step 2a |
| `CLOUDFLARE_ACCOUNT_ID` | From Cloudflare dashboard |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://lewhmonjzoznnqxtdkcn.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase publishable key (from `web/.env.local`) |

### 2c. Trigger the first deploy

Merge your feature branch into `main`, or push directly to `main`:

```bash
git checkout main
git merge claude/confident-wozniak-wsoqut
git push origin main
```

Watch the deploy: **GitHub → Actions → "Deploy to Cloudflare Workers"**.

When it succeeds, your app is live at a `*.workers.dev` URL (shown in the Actions log).

### 2d. Connect hellokotagiri.com

In Cloudflare dashboard:

1. **Workers & Pages → helloktg → Settings → Domains & Routes**
2. Add custom domain: `hellokotagiri.com` (and `www.hellokotagiri.com`)
3. If hellokotagiri.com is already on Cloudflare, DNS updates automatically.
   If not, point your domain's nameservers to Cloudflare first, then add the route.

---

## Part 3 — Alternative: Cloudflare Workers Builds (no GitHub Actions)

Instead of GitHub Actions, you can let Cloudflare build directly from GitHub:

1. Cloudflare dashboard → **Workers & Pages → Create → Connect to Git**
2. Select **enkayas/hello-ktg**
3. **Production branch:** `main`
4. **Root directory:** `web`
5. **Build command:** `npx opennextjs-cloudflare build`
6. **Deploy command:** `npx wrangler deploy`
7. Add environment variables (same Supabase keys as above) as **build variables**

This also deploys automatically on every push to `main`.

---

## Part 4 — Cursor Cloud Agents (work while laptop is closed)

This is the **primary way** the owner should develop without keeping a laptop open.

### What you get

- Agent runs on **Cursor's servers**, not your Mac
- You can close the laptop, use a phone, or walk away
- Agent edits code, commits, pushes to GitHub
- **GitHub Actions auto-deploys** to hellokotagiri.com (~2 minutes)

### Setup (one time — ~5 minutes)

1. **GitHub connected in Cursor**
   - Cursor → **Settings → General → GitHub**
   - Sign in as `enkayas`, grant access to repo `hello-ktg`

2. **Secrets already on GitHub** ✓ (Cloudflare + Supabase — configured 2026-06-28)

3. **Ensure `main` has latest code** — merge or push so GitHub matches production

### How to start a cloud task (owner)

1. Open **Cursor** (desktop app or [cursor.com/agents](https://cursor.com/agents))
2. Start a new agent
3. Choose **Cloud** (not Local)
4. Select repo: `enkayas/hello-ktg`, branch: `main`
5. Describe the task in plain English, e.g. *"Add Tamil translations to the Eat page"*
6. Close the laptop — the agent keeps working
7. When done: review the commit on GitHub; site updates automatically

### What the agent does automatically

Per `AGENTS.md`: implement → build → deploy → report live. No commands for you.

### Tips

- `PROJECT.md`, `AGENTS.md`, and `DEPLOY.md` are committed so agents have full context
- For database changes, agent applies Supabase migrations via CLI/MCP
- Check deploy: GitHub → Actions → "Deploy to Cloudflare Workers"


---

## Part 5 — Verify everything works

After deploy, check these URLs (replace with your workers.dev URL if domain not wired yet):

| Check | URL / action |
|---|---|
| Homepage loads | `https://hellokotagiri.com/` |
| Stays directory | `/stays` |
| Property detail | `/stays/silvertip-homestay` (or any seeded slug) |
| Owner login | `/owner/login` |
| List your property | `/list-your-property` — submit a test form |
| Supabase data | Stays appear (not empty) — confirms env vars are set at build time |
| Admin panel | `/admin` — login as admin user |

**Make yourself admin** (once, after signing up at `/owner/login`):

```sql
update profiles set role = 'admin'
where id = (select id from auth.users where email = 'enkayas@gmail.com');
```

Run in Supabase dashboard → SQL Editor.

---

## Part 6 — Day-to-day workflow

### Owner (no laptop required)

```
Describe task in Cursor Cloud Agent
    ↓
Agent implements on GitHub (main)
    ↓
GitHub Actions auto-deploys (~2 min)
    ↓
hellokotagiri.com updates — you get a summary in Cursor
```

### Developer / agent (with laptop)

```
Edit in Cursor
    ↓
npm run build && npm run deploy   ← mandatory before "done"
    ↓
git commit + push to main
    ↓
CI deploys again (backup / team visibility)
```

For long tasks while away: start a **Cursor Cloud Agent** — same repo, branch `main`.


---

## Troubleshooting

| Problem | Fix |
|---|---|
| Site loads but no stays | Build env vars missing — add Supabase secrets to GitHub/Cloudflare |
| Deploy fails on OpenNext build | Check Actions log; run `cd web && npm run build` locally first |
| Supabase project paused | Restore at supabase.com → project helloKTG |
| Owner login redirect loop | Already fixed on feature branch — ensure that branch is deployed |
| Domain not resolving | Confirm nameservers point to Cloudflare; wait up to 24 h for DNS |

---

## Quick reference

```bash
# Local dev
cd web && npm install && npm run dev

# Manual deploy (from your machine)
cd web && npm run deploy   # needs: wrangler login

# Push feature branch
git push -u origin claude/confident-wozniak-wsoqut

# Merge to production
git checkout main && git merge claude/confident-wozniak-wsoqut && git push
```

**Repo:** https://github.com/enkayas/hello-ktg  
**Supabase:** https://supabase.com/dashboard/project/lewhmonjzoznnqxtdkcn  
**Domain:** https://hellokotagiri.com
