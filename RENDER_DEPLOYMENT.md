# Deployment Guide for Render.com

This guide explains how to deploy the Royal Care Dental website to Render using the free tier.

## 1. Prerequisites
- A GitHub account with the repository pushed to: `https://github.com/ninga09/dental-website.git`
- A [Render.com](https://render.com) account.

## 2. Deploying the Web Service
1. Log in to your Render Dashboard.
2. Click **New +** and select **Web Service**.
3. Connect your GitHub account and select the `dental-website` repository.
4. Configure the following settings:
   - **Name**: `royal-care-dental`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

## 3. Environment Variables
In the **Environment** tab of your service, add the following variables:
- `DATABASE_URL`: `file:./prisma/dev.db`
- `NODE_ENV`: `production`

> **Note on SQLite Persistence:** On Render's Free Plan, the filesystem is ephemeral. Any data saved to the SQLite database (like new bookings or reviews) will be **lost** whenever the service restarts or redeploys. For production persistence, consider using Render's **PostgreSQL** service or a persistent disk (paid).

## 4. Setting up Custom Domain (`royalcaredental.co.ke`)
1. In your Render service, go to **Settings** > **Custom Domains**.
2. Click **Add Custom Domain** and enter `royalcaredental.co.ke`.
3. Render will provide you with DNS records to update at your domain registrar (e.g., GoDaddy, Namecheap):
   - **CNAME Record**: Point `www` to your Render app URL (e.g., `royal-care-dental.onrender.com`).
   - **A Record**: Point your root domain to Render's IP address (provided in the dashboard).

## 5. Initializing the Database
Since the database starts empty, you may need to run the seed script once deployed. You can do this via the Render **Shell** tab:
```bash
npx prisma db seed
```
(Ensure your `package.json` has a `prisma` field with the seed command pointing to `seed.js`).

---
Prepared by Antigravity AI
