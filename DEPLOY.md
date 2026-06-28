# helloKotagiri — Cloud Setup Guide

This guide covers two things:

1. **Live site in the cloud** — the app runs 24/7 at a public URL (hellokotagiri.com)
2. **GitHub connected** — code is on GitHub so Cursor Cloud Agents and CI/CD can work while your laptop is closed

---

## Current status

| Item | Status |
|---|---|
| Local git remote | Connected → `https://github.com/enkayas/travelktg.git` |
| GitHub account | `enkayas` (authenticated via `gh`) |
| Production code branch | `claude/confident-wozniak-wsoqut` (8 commits ahead of `main`, **not yet on GitHub**) |
| CI/CD workflow | `.github/workflows/deploy-cloudflare.yml` (deploys on push to `main`) |
| Supabase backend | Live at `lewhmonjzoznnqxtdkcn.supabase.co` |

---

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

Go to **github.com/enkayas/travelktg → Settings → Secrets and variables → Actions**
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
2. Select **enkayas/travelktg**
3. **Production branch:** `main`
4. **Root directory:** `web`
5. **Build command:** `npx opennextjs-cloudflare build`
6. **Deploy command:** `npx wrangler deploy`
7. Add environment variables (same Supabase keys as above) as **build variables**

This also deploys automatically on every push to `main`.

---

## Part 4 — Cursor Cloud Agents (work while laptop is closed)

Cursor Cloud Agents run on Cursor's servers, not your laptop. They need your code
on GitHub.

### Setup (one time)

1. **Push code to GitHub** (Part 1 above).
2. In Cursor: **Settings → General → GitHub** → connect your `enkayas` account
   and grant access to the `travelktg` repo.
3. Use **Cloud** mode when starting an agent (not Local).

### How it works

- You give the agent a task and pick **Cloud** as the environment.
- Cursor spins up a VM, clones your repo branch, and works independently.
- You can close your laptop; the agent keeps running.
- When done, it commits to a branch and you can review/merge on GitHub.

### Tips

- Push your working branch before starting a cloud agent so it has the latest code.
- Cloud agents work best when `PROJECT.md` and `DEPLOY.md` are committed — they
  give the agent full context without you re-explaining the project.
- For deployment tasks, add the Cloudflare and Supabase secrets to GitHub first
  so CI can deploy without your laptop.

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

```
Edit locally in Cursor
    ↓
git push to feature branch
    ↓
Open PR on GitHub → merge to main
    ↓
GitHub Actions (or Cloudflare Builds) auto-deploys
    ↓
hellokotagiri.com updates in ~2–3 minutes
```

For long tasks while away: start a **Cursor Cloud Agent** on the same repo/branch.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Site loads but no stays | Build env vars missing — add Supabase secrets to GitHub/Cloudflare |
| Deploy fails on OpenNext build | Check Actions log; run `cd web && npm run build` locally first |
| Supabase project paused | Restore at supabase.com → project travelKTG |
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

**Repo:** https://github.com/enkayas/travelktg  
**Supabase:** https://supabase.com/dashboard/project/lewhmonjzoznnqxtdkcn  
**Domain:** https://hellokotagiri.com
