# 📋 Deployment Checklist

Use this checklist to deploy your Financial Tracker app step-by-step.

---

## ☁️ Phase 1: Database Setup (MongoDB Atlas)

- [ ] Create MongoDB Atlas account at https://mongodb.com/cloud/atlas/register
- [ ] Create FREE M0 cluster (512MB)
- [ ] Select cloud provider and region
- [ ] Create database user with username and password
- [ ] Save username: `________________`
- [ ] Save password: `________________`
- [ ] Configure network access (allow 0.0.0.0/0)
- [ ] Get connection string
- [ ] Replace `<password>` with actual password
- [ ] Add database name `/financial_tracker`
- [ ] Test connection string (save for later)

**Connection String Format:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/financial_tracker?retryWrites=true&w=majority
```

---

## 🖥️ Phase 2: Backend Deployment (Render)

- [ ] Create Render account at https://render.com
- [ ] Sign up with GitHub for easy integration
- [ ] Authorize Render to access your repositories
- [ ] Click "New +" → "Web Service"
- [ ] Connect repository: `twhite444/financial_tracker`
- [ ] Configure service settings:
  - [ ] Name: `financial-tracker-api`
  - [ ] Region: Oregon (or closest)
  - [ ] Branch: `main`
  - [ ] Root Directory: `financial-tracker-app/server`
  - [ ] Runtime: Node
  - [ ] Build Command: `npm install && npm run build`
  - [ ] Start Command: `npm start`
  - [ ] Instance Type: Free

### Environment Variables

- [ ] Generate JWT secret:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- [ ] Add environment variables:
  - [ ] `NODE_ENV` = `production`
  - [ ] `PORT` = `5001`
  - [ ] `JWT_SECRET` = `<your-generated-secret>`
  - [ ] `MONGODB_URI` = `<your-mongodb-connection-string>`
  - [ ] `CORS_ORIGIN` = `https://yourfrontend.vercel.app` (will update later)

### Deploy and Test

- [ ] Click "Create Web Service"
- [ ] Wait for deployment (2-5 minutes)
- [ ] Check deployment logs for errors
- [ ] Note your backend URL: `________________.onrender.com`
- [ ] Test health endpoint:
  ```bash
  curl https://your-backend.onrender.com/health
  ```
- [ ] Should return: `{"status":"ok"}`

---

## 🎨 Phase 3: Frontend Deployment (Vercel)

- [ ] Create Vercel account at https://vercel.com/signup
- [ ] Sign up with GitHubz
- [ ] Authorize Vercel to access repositories
- [ ] Click "Add New..." → "Project"
- [ ] Import repository: `twhite444/financial_tracker`
- [ ] Configure project settings:
  - [ ] Framework Preset: Vite
  - [ ] Root Directory: `financial-tracker-app`
  - [ ] Build Command: `npm run build`
  - [ ] Output Directory: `dist`
  - [ ] Install Command: `npm install`

### Environment Variables

- [ ] Add environment variable:
  - [ ] Key: `VITE_API_URL`
  - [ ] Value: `https://your-backend.onrender.com`
  - [ ] (Use your actual Render URL from Phase 2)

### Deploy and Test

- [ ] Click "Deploy"
- [ ] Wait for build (1-3 minutes)
- [ ] Note your frontend URL: `________________.vercel.app`
- [ ] Visit your frontend URL
- [ ] Check console for any errors

---

## 🔗 Phase 4: Connect Frontend & Backend

- [ ] Go back to Render dashboard
- [ ] Select your backend service
- [ ] Go to "Environment" tab
- [ ] Edit `CORS_ORIGIN` variable
- [ ] Update to your Vercel URL: `https://your-app.vercel.app`
- [ ] Save changes (will trigger automatic redeploy)
- [ ] Wait for redeploy to complete

---

## 🧪 Phase 5: End-to-End Testing

### Test User Registration
- [ ] Visit your Vercel URL
- [ ] Click "Register"
- [ ] Fill in: First Name, Last Name, Email, Password
- [ ] Submit registration form
- [ ] Should see success toast
- [ ] Should redirect to dashboard
- [ ] No console errors

### Test Login
- [ ] Logout
- [ ] Click "Login"
- [ ] Enter your credentials
- [ ] Should see "Welcome back!" toast
- [ ] Should redirect to dashboard

### Test Account Management
- [ ] Navigate to Accounts page
- [ ] Click "Add Account"
- [ ] Create a checking account with balance
- [ ] Should see success toast
- [ ] Account should appear in list
- [ ] Try deleting the account
- [ ] Confirm deletion
- [ ] Should see success toast
- [ ] Account should disappear

### Test Transactions
- [ ] Create a new account first
- [ ] Navigate to Transactions page
- [ ] Click "Add Transaction"
- [ ] Create an expense transaction
- [ ] Should see success toast
- [ ] Transaction should appear
- [ ] Check account balance updated
- [ ] Try deleting transaction
- [ ] Balance should revert

### Test Payment Reminders
- [ ] Navigate to Payments page
- [ ] Click "Add Reminder"
- [ ] Create a payment reminder
- [ ] Should see success toast
- [ ] Payment appears on calendar
- [ ] Click "Mark Paid"
- [ ] Should see success toast
- [ ] Try deleting payment
- [ ] Should disappear from calendar

### Test Dashboard
- [ ] Navigate to Dashboard
- [ ] Should see real-time stats
- [ ] Net worth calculation correct
- [ ] Recent transactions display
- [ ] Spending breakdown chart shows
- [ ] All accounts listed

### Test Performance
- [ ] Refresh page after 15+ minutes
- [ ] First API call may take 30-60 seconds (backend waking up)
- [ ] Subsequent calls should be fast
- [ ] No errors in console
- [ ] All features work

---

## 📱 Phase 6: Mobile Testing

- [ ] Open your app on mobile browser
- [ ] Test all pages load correctly
- [ ] Test responsive design
- [ ] Test touch interactions
- [ ] Test forms work
- [ ] Test buttons are clickable
- [ ] Test navigation works

---

## 📖 Phase 7: Documentation

- [ ] Update README.md with live URLs:
  ```markdown
  ## 🌐 Live Demo
  
  - **Frontend:** https://your-app.vercel.app
  - **Backend API:** https://your-api.onrender.com
  ```
- [ ] Commit and push README update
- [ ] Verify auto-deploy works (should update automatically)

---

## 🎉 Phase 8: Share & Monitor

### Share Your App
- [ ] Share frontend URL with friends/family
- [ ] Get initial feedback
- [ ] Note any issues

### Monitor Services
- [ ] Check Render dashboard for backend health
- [ ] Check Vercel dashboard for frontend analytics
- [ ] Check MongoDB Atlas for database usage
- [ ] Set up email alerts (optional)

### Track Usage
- [ ] Monitor free tier limits:
  - Vercel: 100GB bandwidth/month
  - Render: 750 hours/month
  - MongoDB: 512MB storage

---

## 🚨 Troubleshooting Checklist

### If Registration Fails
- [ ] Check browser console for errors
- [ ] Check Render logs for backend errors
- [ ] Verify MongoDB connection string is correct
- [ ] Check network tab for API call status

### If CORS Error Appears
- [ ] Verify CORS_ORIGIN in Render matches Vercel URL exactly
- [ ] No trailing slash in URLs
- [ ] Check Render redeployed after changing env var
- [ ] Clear browser cache

### If Backend Times Out
- [ ] Wait 60 seconds for cold start
- [ ] Check Render logs for crashes
- [ ] Verify all environment variables are set
- [ ] Check MongoDB cluster is running

### If Frontend Won't Build
- [ ] Check Vercel build logs
- [ ] Verify VITE_API_URL is set correctly
- [ ] Check all dependencies in package.json
- [ ] Try building locally first

---

## ✅ Success Criteria

You've successfully deployed when:

- [x] Frontend loads at Vercel URL
- [x] Backend responds to health check
- [x] Can register new user
- [x] Can login
- [x] Can create accounts
- [x] Can add transactions
- [x] Can create payment reminders
- [x] Dashboard shows real data
- [x] Delete operations work
- [x] Toast notifications appear
- [x] No console errors
- [x] Mobile responsive
- [x] HTTPS enabled
- [x] Auto-deploy works

---

## 📊 Deployment Summary

Once complete, document your deployment:

**Frontend URL:** `________________`  
**Backend URL:** `________________`  
**Database:** MongoDB Atlas (FREE M0)  
**Deployment Date:** `________________`  
**Status:** 🟢 LIVE

---

## 🔄 Auto-Deploy Workflow

From now on, to update your app:

1. Make changes locally
2. Commit changes: `git commit -m "your message"`
3. Push to GitHub: `git push origin main`
4. ⚡ Automatic deployment triggers
5. 🎉 Live in 2-5 minutes!

---

## 💰 Cost Summary

| Service | Plan | Cost | Limits |
|---------|------|------|--------|
| Vercel | Free | $0 | 100GB bandwidth/month |
| Render | Free | $0 | 750 hours/month, sleeps after 15min |
| MongoDB Atlas | M0 | $0 | 512MB storage |
| **Total** | | **$0/month** | Generous free tiers! |

---

## 🎯 Optional Upgrades

If you outgrow free tiers:

- **Custom Domain:** $12/year (Namecheap, Google Domains)
- **Render Starter:** $7/month (no sleep, better performance)
- **MongoDB M10:** $0.08/hour (~$57/month, more storage)
- **Vercel Pro:** $20/month (unlimited bandwidth)

---

## 🆘 Need Help?

- [ ] Check [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for details
- [ ] Check [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) for fast track
- [ ] Open issue on GitHub
- [ ] Check service status pages:
  - Vercel: https://vercel-status.com
  - Render: https://status.render.com
  - MongoDB: https://status.mongodb.com

---

**Last Updated:** October 2, 2025  
**Version:** 1.0.0  
**Status:** ✅ Ready for Deployment
