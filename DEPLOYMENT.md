# Deployment guide

BUSINESS-HUB COMPUTERS. Push to GitHub, then deploy on Vercel.

Follow these steps in order. Nothing is skipped.

---

## 1. Requirements on your computer

- Node.js version 18.17 or newer. Check with `node -v`.
- Git. Check with `git --version`.
- A GitHub account and a Vercel account.

---

## 2. Unzip and install

```bash
unzip business-hub-computers.zip
cd business-hub-computers
npm install
```

The install runs `prisma generate` automatically at the end. That is expected.

---

## 3. Create the database

You need a PostgreSQL database that is reachable from the internet, because Vercel cannot see a database running on your own laptop.

Use any of these:

- **Neon** at neon.tech, free tier, recommended
- **Supabase** at supabase.com, free tier
- **Vercel Postgres** from inside the Vercel dashboard

Create the database and copy the connection string. It looks like this:

```
postgresql://username:password@host.neon.tech/dbname?sslmode=require
```

---

## 4. Create your local .env file

```bash
cp .env.example .env
```

Open `.env` and fill in at minimum:

```
DATABASE_URL="paste your connection string here"
AUTH_SECRET="paste a generated secret here"
SUPER_ADMIN_EMAIL="your-admin-email@example.com"
SUPER_ADMIN_PASSWORD="a strong password of at least 12 characters"
```

Generate `AUTH_SECRET` with:

```bash
openssl rand -base64 48
```

On Windows without openssl, use any long random string of 48 or more characters.

**The `.env` file must never be pushed to GitHub.** It is already listed in `.gitignore`.

---

## 5. Create the database tables and load data

```bash
npm run db:push      # creates every table from prisma/schema.prisma
npm run db:seed      # loads categories, site settings and demo products
npm run setup:admin  # creates the first Super Admin from your .env values
```

---

## 6. Run it locally to confirm

```bash
npm run dev
```

Open http://localhost:3000. You should see the homepage with categories and demo products.

Stop the server with Ctrl and C.

---

## 7. Push to GitHub

Create a new **empty** repository on GitHub. Do not add a README, .gitignore or licence, because this project already has them.

Then, from inside the project folder:

```bash
git init
git add .
git commit -m "Business-Hub Computers: stage 1 and stage 2"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

Before pushing, confirm the secret file is not included:

```bash
git status --short | grep "\.env$"
```

That command should return nothing. If it returns `.env`, stop and run `git rm --cached .env` before committing.

---

## 8. Deploy on Vercel

1. Go to vercel.com and choose **Add New**, then **Project**.
2. Import the GitHub repository you just pushed.
3. Vercel detects Next.js automatically. Leave the framework preset, build command and output directory exactly as detected.
4. Open **Environment Variables** and add the following, for the Production, Preview and Development environments:

| Name | Value |
|---|---|
| `DATABASE_URL` | Your PostgreSQL connection string |
| `AUTH_SECRET` | Your generated secret |
| `NEXT_PUBLIC_SITE_URL` | `https://your-project.vercel.app` at first, your real domain later |
| `NEXT_PUBLIC_SITE_NAME` | `BUSINESS-HUB COMPUTERS` |

Add `SUPER_ADMIN_EMAIL` and `SUPER_ADMIN_PASSWORD` only if you intend to run the admin setup script against the live database. Remove them afterwards.

Leave the Paystack, Flutterwave and storage variables empty for now. They are wired in stage 9.

5. Click **Deploy**.

The first build takes roughly two to four minutes.

---

## 9. After the first deploy

If you have not already run the database commands against the live database, run them now from your computer with the live `DATABASE_URL` in your `.env`:

```bash
npm run db:push
npm run db:seed
npm run setup:admin
```

Then update `NEXT_PUBLIC_SITE_URL` in Vercel to your final domain and redeploy.

---

## 10. Things that commonly break a deployment, and how this project avoids them

| Risk | How it is handled here |
|---|---|
| Prisma client missing at build time | `postinstall` and the `build` script both run `prisma generate` |
| Build fails because the database is unreachable | The homepage is rendered per request, not at build time, and every query is guarded |
| Build fails because `DATABASE_URL` is not set | The Prisma client falls back to a placeholder URL so it can still be constructed |
| Secrets leaking into the repository | `.env` is git-ignored, and only `.env.example` is committed |
| Remote images blocked by Next.js | Allowed image hosts are declared in `next.config.mjs` |
| Node version mismatch | `engines` in `package.json` pins Node 18.17 or newer |
| Lint or type errors stopping the build | The project passes `next lint` with no warnings or errors |

---

## 11. Updating the site later

```bash
git add .
git commit -m "Describe what changed"
git push
```

Vercel rebuilds and redeploys automatically on every push to `main`.
