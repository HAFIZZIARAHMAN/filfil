# Deploy FILFIL Café — GitHub + Cloudflare (Auto-Update on Push)

Every time you run `git push`, Cloudflare automatically rebuilds and updates your live website.

**Your GitHub repo:** https://github.com/HAFIZZIARAHMAN/filfil

---

## How it works

```
You edit files locally
       ↓
git add .  →  git commit  →  git push
       ↓
GitHub receives the update
       ↓
Cloudflare Pages detects the push
       ↓
Site rebuilds automatically (1–3 minutes)
       ↓
Live website is updated
```

You only connect Cloudflare to GitHub **once**. After that, every push to `main` updates the site.

---

## One-time setup (do this once)

### Step 1 — Push your latest code to GitHub

Open terminal in your project folder:

```powershell
cd "C:\Users\ifazl\OneDrive\Documents\Filfil_cafe"

git add .
git commit -m "Update site"
git push origin main
```

> **Note:** Large files (videos ~7–17 MB) must be in the repo. GitHub allows files up to 100 MB each.

---

### Step 2 — Connect Cloudflare to your GitHub repo

1. Go to **[dash.cloudflare.com](https://dash.cloudflare.com)** and sign in (free account is fine).
2. Left sidebar → **Workers & Pages**.
3. Click **Create** → **Pages** → **Connect to Git**.
4. Click **Connect GitHub** and authorize Cloudflare.
5. Select repository: **`HAFIZZIARAHMAN/filfil`**.

---

### Step 3 — Configure build settings

Use **exactly** these settings (this is a static site — no build step):

| Setting | Value |
|---------|--------|
| **Project name** | `filfil-cafe` (or any name you like) |
| **Production branch** | `main` |
| **Framework preset** | `None` |
| **Build command** | *(leave completely empty)* |
| **Build output directory** | `/` |

Click **Save and Deploy**.

Cloudflare will clone your repo and publish the site. First deploy takes 2–5 minutes.

---

### Step 4 — Get your live URL

After deploy succeeds, Cloudflare shows a URL like:

```
https://filfil-cafe.pages.dev
```

Open it in your browser — your site is live.

---

## Daily workflow (after setup)

Whenever you change the website:

```powershell
cd "C:\Users\ifazl\OneDrive\Documents\Filfil_cafe"

git add .
git commit -m "Describe what you changed"
git push origin main
```

Wait 1–3 minutes. Cloudflare deploys automatically. No need to log in to Cloudflare again.

**Check deploy status:** Cloudflare Dashboard → **Workers & Pages** → your project → **Deployments** tab.

---

## Add a custom domain (optional)

Example: `filfilcafe.com` or `www.filfilcafe.com`

1. Cloudflare Pages → your project → **Custom domains**.
2. Click **Set up a custom domain**.
3. Enter your domain and follow the DNS steps Cloudflare shows.
4. HTTPS is enabled automatically after DNS propagates (usually a few minutes).

---

## Important notes for your project

### Homepage file

Cloudflare serves **`index.html`** as the homepage. Your repo has both `Index.html` and `index.html` — keep **`index.html`** as the main homepage and make sure it has your latest changes.

### Folder names with spaces

These paths must match exactly in your HTML:

- `photos of menu/`
- `Photos to be changed/`

Cloudflare runs on Linux — paths are **case-sensitive**.

### Files not needed on the live site

The nested `Filfil_cafe/` folder in your repo is a duplicate. Consider removing it later to avoid confusion (optional cleanup).

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Push works but site unchanged | Hard refresh: `Ctrl + Shift + R`. Check **Deployments** in Cloudflare for errors. |
| 404 on homepage | Ensure `index.html` exists at the repo root with your latest content. |
| Images not loading | Check folder/file names match exactly (case and spaces). |
| Deploy failed | Cloudflare → **Deployments** → click failed deploy → read the log. |
| Git push rejected | Run `git pull origin main` first, then push again. |

---

## Quick reference

| Item | Value |
|------|--------|
| GitHub repo | `https://github.com/HAFIZZIARAHMAN/filfil` |
| Branch that auto-deploys | `main` |
| Build command | *(empty)* |
| Output directory | `/` |
| Update command | `git push origin main` |
| Deploy time | ~1–3 minutes after push |

---

## Helpful links

- [Cloudflare Pages — Git integration](https://developers.cloudflare.com/pages/configuration/git-integration/)
- [Custom domains on Pages](https://developers.cloudflare.com/pages/configuration/custom-domains/)
