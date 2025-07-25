# Render Deployment Guide for MLB Sun Tracker

## Current Status
The app has been configured for deployment on Render. All GitHub Pages specific configurations have been removed.

## What Changed
1. **next.config.js**: Removed static export, basePath, and assetPrefix
2. **manifest.json**: Updated paths to use root URLs
3. **SEOHelmet.tsx**: Made canonical URLs dynamic
4. **render.yaml**: Created deployment configuration
5. **.env.local**: Updated for environment variables

## Deploy to Render

### Step 1: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub for easy integration

### Step 2: Create New Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub account
3. Select the `mlb-sun-tracker` repository
4. Configure with these settings:
   - **Name**: mlb-sun-tracker
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free (upgradeable later)

### Step 3: Environment Variables (Optional)
Add these in Render dashboard if needed:
```
NEXT_PUBLIC_GA_ID=G-JXGEKF957C
NEXT_PUBLIC_SITE_URL=https://mlb-sun-tracker.onrender.com
```

### Step 4: Deploy
1. Click "Create Web Service"
2. Render will automatically build and deploy
3. Your app will be live at: `https://mlb-sun-tracker.onrender.com`

## Custom Domain (Optional)
1. Go to Settings → Custom Domains
2. Add your domain
3. Update DNS records as instructed

## Database Integration (Future)
When ready to add a database:
1. Create a PostgreSQL database on Render
2. Link it to your web service
3. Use the `DATABASE_URL` environment variable

## Monitoring
- View logs in real-time
- Set up health checks
- Monitor performance metrics

## Automatic Deploys
With `render.yaml` configured, every push to `main` will trigger a new deployment.

## Rollback
If needed, you can rollback to any previous deployment from the Render dashboard.

## Cost
- **Free tier**: Spins down after 15 minutes of inactivity
- **Starter ($7/mo)**: Always on, better performance
- **Scale as needed**: Upgrade anytime

## Support
- [Render Docs](https://render.com/docs)
- [Next.js on Render](https://render.com/docs/deploy-nextjs)