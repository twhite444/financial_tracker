# 🚀 Deployment Guide - Financial Tracker

Complete guide for deploying your financial tracker application to production.

---

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Prerequisites](#prerequisites)
3. [Backend Deployment (Render)](#backend-deployment-render)
4. [Database Setup (MongoDB Atlas)](#database-setup-mongodb-atlas)
5. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
6. [Environment Variables](#environment-variables)
7. [Testing Deployment](#testing-deployment)
8. [Troubleshooting](#troubleshooting)

---

## 🏗️ Architecture Overview

### Deployment Stack
- **Frontend:** Vercel (React + Vite)
- **Backend:** Render (Node.js + Express)
- **Database:** MongoDB Atlas (Cloud)
- **Total Cost:** FREE tier available for all services!

### Why This Stack?
- ✅ **Free Tier:** All services offer generous free tiers
- ✅ **Auto-Deploy:** Git push triggers automatic deployment
- ✅ **HTTPS:** Free SSL certificates included
- ✅ **Scalable:** Easy to upgrade as you grow
- ✅ **Global CDN:** Fast worldwide access

---

## ✅ Prerequisites

Before deploying, ensure you have:

- [x] GitHub account (you already have this!)
- [x] Git repository pushed to GitHub ✅
- [ ] MongoDB Atlas account (free signup)
- [ ] Render account (free signup)
- [ ] Vercel account (free signup)

**Your repository:** https://github.com/twhite444/financial_tracker

---

## 🗄️ Database Setup (MongoDB Atlas)

### Step 1: Create MongoDB Atlas Account

1. **Go to:** https://www.mongodb.com/cloud/atlas/register
2. **Sign up** with Google or email
3. **Choose:** Free M0 cluster (512MB storage)

### Step 2: Create Cluster

1. **Click:** "Build a Database"
2. **Choose:** FREE Shared Cluster
3. **Provider:** AWS (recommended)
4. **Region:** Choose closest to your users (e.g., US East)
5. **Cluster Name:** `financial-tracker` (or leave default)
6. **Click:** "Create"

### Step 3: Create Database User

1. **Security > Database Access**
2. **Add New Database User**
3. **Authentication:** Password
4. **Username:** `financial_tracker_user`
5. **Password:** Generate secure password (SAVE THIS!)
6. **Database User Privileges:** "Read and write to any database"
7. **Click:** "Add User"

### Step 4: Configure Network Access

1. **Security > Network Access**
2. **Add IP Address**
3. **Choose:** "Allow Access from Anywhere" (0.0.0.0/0)
   - ⚠️ For production, restrict to your backend server IP
4. **Click:** "Confirm"

### Step 5: Get Connection String

1. **Click:** "Connect" on your cluster
2. **Choose:** "Connect your application"
3. **Driver:** Node.js
4. **Version:** 5.5 or later
5. **Copy the connection string:**
   ```
   mongodb+srv://financial_tracker_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. **Replace** `<password>` with your actual password
7. **Add database name:** Replace `/?retry` with `/financial_tracker?retry`
   ```
   mongodb+srv://financial_tracker_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/financial_tracker?retryWrites=true&w=majority
   ```

**SAVE THIS CONNECTION STRING** - you'll need it for backend deployment!

---

## 🖥️ Backend Deployment (Render)

### Step 1: Create Render Account

1. **Go to:** https://render.com
2. **Sign up** with GitHub (easiest)
3. **Authorize** Render to access your repositories

### Step 2: Create Web Service

1. **Click:** "New +"
2. **Choose:** "Web Service"
3. **Connect Repository:** Select `twhite444/financial_tracker`
4. **Click:** "Connect"

### Step 3: Configure Service

**Basic Settings:**
- **Name:** `financial-tracker-api`
- **Region:** US West (or closest to you)
- **Branch:** `main`
- **Root Directory:** `financial-tracker-app/server`
- **Runtime:** Node
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`

**Instance Type:**
- Choose: **Free** ($0/month)
- Note: Service sleeps after 15 min of inactivity

### Step 4: Add Environment Variables

Click "Advanced" and add these environment variables:

```bash
NODE_ENV=production
PORT=5001
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
MONGODB_URI=mongodb+srv://financial_tracker_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/financial_tracker?retryWrites=true&w=majority
CORS_ORIGIN=https://your-frontend-url.vercel.app
```

**Important:**
- Replace `JWT_SECRET` with a strong random string (32+ characters)
- Replace `MONGODB_URI` with your actual MongoDB Atlas connection string
- We'll update `CORS_ORIGIN` after deploying frontend

**To generate a secure JWT secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 5: Deploy Backend

1. **Click:** "Create Web Service"
2. **Wait** for deployment (2-5 minutes)
3. **Check logs** for any errors
4. **Get your backend URL:** `https://financial-tracker-api.onrender.com`

### Step 6: Test Backend

Open your browser or use curl:
```bash
curl https://financial-tracker-api.onrender.com/health
```

Should return: `{"status":"ok","timestamp":"..."}`

**SAVE YOUR BACKEND URL** - you'll need it for frontend!

---

## 🎨 Frontend Deployment (Vercel)

### Step 1: Prepare Frontend for Deployment

First, we need to update the API URL in the frontend to use the production backend.

**Create production environment file:**

```bash
# In your local project
cd financial-tracker-app
```

Create `.env.production`:
```env
VITE_API_URL=https://financial-tracker-api.onrender.com
```

Update `AuthService.ts` and other services to use environment variable:
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
```

### Step 2: Create Vercel Account

1. **Go to:** https://vercel.com/signup
2. **Sign up** with GitHub
3. **Authorize** Vercel to access repositories

### Step 3: Import Project

1. **Click:** "Add New..." → "Project"
2. **Import** your repository: `twhite444/financial_tracker`
3. **Click:** "Import"

### Step 4: Configure Project

**Framework Preset:** Vite  
**Root Directory:** `financial-tracker-app`  
**Build Settings:**
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

**Environment Variables:**
Add this environment variable:
```
VITE_API_URL = https://financial-tracker-api.onrender.com
```
(Replace with your actual Render backend URL)

### Step 5: Deploy Frontend

1. **Click:** "Deploy"
2. **Wait** for build (1-3 minutes)
3. **Get your frontend URL:** `https://financial-tracker-xyz.vercel.app`

### Step 6: Update Backend CORS

Now go back to Render and update the `CORS_ORIGIN` environment variable:

1. **Render Dashboard** → Your service
2. **Environment** tab
3. **Edit** `CORS_ORIGIN`
4. **Set to:** `https://financial-tracker-xyz.vercel.app`
5. **Save Changes** (will trigger redeploy)

---

## 🔐 Environment Variables

### Backend Environment Variables (Render)

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Node environment | `production` |
| `PORT` | Server port | `5001` |
| `JWT_SECRET` | JWT signing secret | `abc123...` (32+ chars) |
| `MONGODB_URI` | MongoDB connection | `mongodb+srv://...` |
| `CORS_ORIGIN` | Allowed frontend origin | `https://your-app.vercel.app` |

### Frontend Environment Variables (Vercel)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://your-api.onrender.com` |

---

## 🧪 Testing Deployment

### 1. Test Backend Health

```bash
curl https://financial-tracker-api.onrender.com/health
```

Expected: `{"status":"ok"}`

### 2. Test Frontend

Visit your Vercel URL: `https://financial-tracker-xyz.vercel.app`

**Test Flow:**
1. ✅ Home page loads
2. ✅ Register new account
3. ✅ Login works
4. ✅ Create an account
5. ✅ Add a transaction
6. ✅ Create payment reminder
7. ✅ View dashboard
8. ✅ Delete operations work
9. ✅ Toast notifications appear

### 3. Check Network Tab

Open DevTools → Network:
- ✅ API calls go to correct backend URL
- ✅ Status codes are 200/201
- ✅ No CORS errors

---

## 🔧 Troubleshooting

### Common Issues

#### 1. CORS Error
**Error:** "Access-Control-Allow-Origin"
**Solution:**
- Check `CORS_ORIGIN` in Render matches your Vercel URL exactly
- No trailing slash in URLs
- Wait for Render to redeploy after changing env vars

#### 2. Backend Not Responding
**Error:** "Failed to fetch" or timeout
**Solution:**
- Render free tier sleeps after 15 min inactivity
- First request takes 30-60 seconds to "wake up"
- Add loading state for initial requests

#### 3. MongoDB Connection Failed
**Error:** "MongoNetworkError"
**Solution:**
- Check MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
- Verify connection string password is correct (no special chars need encoding)
- Check cluster is running (not paused)

#### 4. Environment Variables Not Working
**Error:** Variables are undefined
**Solution:**
- Vercel: Must start with `VITE_`
- Render: Check "Environment" tab, not hidden
- Redeploy after changing env vars

#### 5. Build Fails on Vercel
**Error:** Build command failed
**Solution:**
- Check `package.json` has `build` script
- Ensure all dependencies in `package.json`
- Check build logs for specific error

---

## 🚀 Post-Deployment

### 1. Update Repository README

Add deployment URLs to your README:
```markdown
## 🌐 Live Demo

- **Frontend:** https://financial-tracker-xyz.vercel.app
- **Backend:** https://financial-tracker-api.onrender.com
```

### 2. Enable Auto-Deploy

Both Vercel and Render auto-deploy on git push to `main` branch!

**Workflow:**
1. Make changes locally
2. Commit and push to GitHub
3. Automatic deployment triggers
4. Live in 2-5 minutes! 🎉

### 3. Monitor Deployments

**Vercel:**
- Dashboard shows all deployments
- View build logs
- Rollback if needed

**Render:**
- Dashboard shows service status
- View logs in real-time
- Manual deploy button available

### 4. Set Up Custom Domain (Optional)

**Vercel:**
1. Buy domain (Namecheap, Google Domains, etc.)
2. Vercel → Project → Settings → Domains
3. Add your domain
4. Update DNS records as instructed

**Render:**
1. Render → Service → Settings → Custom Domain
2. Add your domain
3. Update DNS records

---

## 📊 Free Tier Limits

### Vercel (Frontend)
- ✅ 100GB bandwidth/month
- ✅ Unlimited sites
- ✅ Auto SSL
- ✅ Global CDN
- ⚠️ No custom domain on free tier

### Render (Backend)
- ✅ 750 hours/month (enough for 1 service)
- ✅ 512MB RAM
- ✅ Auto SSL
- ⚠️ Sleeps after 15 min inactivity
- ⚠️ Limited to 100GB bandwidth/month

### MongoDB Atlas
- ✅ 512MB storage
- ✅ Shared cluster
- ✅ No time limit
- ⚠️ Limited to 10 databases

---

## 💡 Pro Tips

### 1. Keep Backend Awake
Free tier sleeps after 15 min. Options:
- **UptimeRobot:** Free service to ping your API every 5 min
- **Cron Job:** Ping your health endpoint
- **Upgrade:** Render paid tier ($7/month) never sleeps

### 2. Optimize Cold Starts
- Add loading states for first request
- Show user message: "Waking up server..."
- Consider paid tier for production use

### 3. Monitor Errors
- Render logs show all errors
- Vercel logs show frontend errors
- Set up error tracking (Sentry free tier)

### 4. Database Backups
- MongoDB Atlas auto-backs up free tier
- Can download manual backup anytime
- Enable point-in-time recovery on paid tier

### 5. Security Best Practices
- ✅ Use strong JWT secret (32+ chars)
- ✅ Never commit `.env` files
- ✅ Rotate secrets periodically
- ✅ Limit CORS to specific domains
- ✅ Enable MongoDB IP whitelist in production

---

## 🎯 Deployment Checklist

Before going live:

### Backend
- [ ] MongoDB Atlas cluster created
- [ ] Database user created with strong password
- [ ] Network access configured
- [ ] Render account created
- [ ] Backend deployed to Render
- [ ] Environment variables set
- [ ] Health endpoint working
- [ ] CORS configured correctly

### Frontend
- [ ] Vercel account created
- [ ] Frontend deployed to Vercel
- [ ] Environment variables set
- [ ] API URL points to production backend
- [ ] All pages load correctly
- [ ] Authentication works
- [ ] CRUD operations work
- [ ] Toast notifications work

### Testing
- [ ] Register new user
- [ ] Login/logout
- [ ] Create account
- [ ] Add transaction
- [ ] Add payment reminder
- [ ] Delete operations
- [ ] Dashboard displays data
- [ ] No console errors
- [ ] Mobile responsive

### Documentation
- [ ] Update README with live URLs
- [ ] Document deployment process
- [ ] Note any limitations
- [ ] Add screenshots

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Vite Production Build](https://vitejs.dev/guide/build.html)
- [Express Best Practices](https://expressjs.com/en/advanced/best-practice-production.html)

---

## 🎉 Success!

Once deployed, your financial tracker will be:
- ✅ **Live** on the internet
- ✅ **Secure** with HTTPS
- ✅ **Fast** with global CDN
- ✅ **Scalable** ready to grow
- ✅ **Free** on generous free tiers

Share your live URL and start tracking finances! 🚀

---

**Questions or issues?** Check the troubleshooting section or open an issue on GitHub.

**Next Steps:** Consider adding analytics, error tracking, or upgrading to paid tiers for better performance!
