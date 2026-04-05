# SikhiThreads — Deployment Guide

## Architecture
- **Frontend** → Vercel (sikhithreads.com)
- **Backend API** → Railway (api.sikhithreads.com)
- **Database** → Supabase (managed Postgres)
- **Storage** → Supabase Storage (product images)

---

## Step 1: Push Code to GitHub

```bash
# Create GitHub repo (do this first at github.com/new)
cd /Users/amanjuneja/Desktop/ThreadsBiz
gh repo create SikhiThreads --private --source=. --push
```

---

## Step 2: Deploy Backend to Railway

1. Go to **railway.app** → Sign up / Log in with GitHub
2. Click **"New Project"** → **"Deploy from GitHub Repo"**
3. Select the **SikhiThreads** repo
4. Railway will auto-detect Node.js
5. Set the **Root Directory** to `server`
6. Add **Environment Variables** (Settings → Variables):

```
SUPABASE_URL=https://zrifbfdityvyyxgomptl.supabase.co
SUPABASE_SERVICE_KEY=<your-service-role-key>
STRIPE_SECRET_KEY=sk_live_... (or sk_test_... for testing)
STRIPE_WEBHOOK_SECRET=whsec_...
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=...
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=hello@sikhithreads.com
SMTP_PASS=<app-password>
NOTIFICATION_EMAIL=hello@sikhithreads.com
ADMIN_EMAILS=aman@sikhithreads.com
PORT=3001
CLIENT_URL=https://sikhithreads.com
```

7. In **Settings → Networking**, add a custom domain: `api.sikhithreads.com`
8. Railway will give you a CNAME record to add to your DNS

---

## Step 3: Deploy Frontend to Vercel

1. Go to **vercel.com** → Sign up / Log in with GitHub
2. Click **"Add New Project"** → Import the **SikhiThreads** repo
3. Set:
   - **Root Directory:** `client`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add **Environment Variables**:

```
VITE_SUPABASE_URL=https://zrifbfdityvyyxgomptl.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
VITE_API_URL=https://api.sikhithreads.com
VITE_STRIPE_PUBLIC_KEY=pk_live_... (or pk_test_...)
```

5. Click **Deploy**

---

## Step 4: Connect Domain (sikhithreads.com)

### For Vercel (main site):
1. In Vercel project → **Settings → Domains**
2. Add `sikhithreads.com` and `www.sikhithreads.com`
3. Vercel will give you DNS records to add:
   - `A` record: `76.76.21.21` for `sikhithreads.com`
   - `CNAME` record: `cname.vercel-dns.com` for `www`

### For Railway (API):
1. In Railway project → **Settings → Networking → Custom Domain**
2. Add `api.sikhithreads.com`
3. Railway gives you a CNAME record to add

### At your domain registrar:
Add these DNS records:
| Type | Name | Value |
|------|------|-------|
| A | @ | 76.76.21.21 |
| CNAME | www | cname.vercel-dns.com |
| CNAME | api | <railway-provided-value> |

---

## Step 5: Update CORS

After deployment, update the server's CORS origin in Railway env vars:
```
CLIENT_URL=https://sikhithreads.com
```

---

## Step 6: SSL Certificates

Both Vercel and Railway provide **free SSL certificates** automatically. No action needed.

---

## Step 7: Verify Everything Works

- [ ] https://sikhithreads.com loads the storefront
- [ ] https://api.sikhithreads.com/api/health returns OK
- [ ] Products load on the shop page
- [ ] Admin login works at /admin
- [ ] Email subscription works
- [ ] Images load from Supabase Storage

---

## Cost Breakdown

| Service | Free Tier | Estimated Monthly |
|---------|-----------|-------------------|
| Vercel | Yes (hobby) | $0 |
| Railway | $5 credit/month | $5–10 |
| Supabase | Yes (500MB DB) | $0 |
| Domain | — | ~$12/year |
| **Total** | | **~$5–10/month** |
