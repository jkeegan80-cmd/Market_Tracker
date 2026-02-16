# 🚀 Quick Deployment Guide

## Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Market Tracker app"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR-USERNAME/market-tracker.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Vercel (Easiest!)

### Method A: Using Vercel Website
1. Go to https://vercel.com
2. Sign up/login with GitHub
3. Click "Add New Project"
4. Select your `market-tracker` repository
5. Click "Deploy" (Vercel auto-detects everything!)
6. Wait ~1 minute
7. Your app is live! 🎉

### Method B: Using Vercel CLI
```bash
npm install -g vercel
vercel login
vercel
# Follow the prompts
```

## Step 3: Share Your App

Your app will be available at:
- `https://your-project-name.vercel.app`
- You can add a custom domain in Vercel settings

## Alternative: Deploy to Netlify

1. Go to https://netlify.com
2. Sign up/login
3. Click "Add new site" → "Import an existing project"
4. Connect to GitHub and select your repo
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click "Deploy"

## That's it!

Your Market Tracker app is now live and accessible to anyone! 🌍

## Need Help?

- Check the main README.md for detailed instructions
- Vercel docs: https://vercel.com/docs
- Netlify docs: https://docs.netlify.com

---

**Pro Tips:**
- Vercel and Netlify both offer free SSL certificates
- Auto-deploys on every git push
- Free tier is perfect for this app
- Add a custom domain later if you want!
