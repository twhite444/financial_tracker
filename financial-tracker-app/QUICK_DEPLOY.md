# 🚀 Quick Start Deployment

This guide will help you deploy your Financial Tracker app in under 30 minutes!

## ⚡ Fast Track (Step-by-Step)

### 1. Database (5 minutes)

1. Go to https://mongodb.com/cloud/atlas/register
2. Create FREE cluster
3. Create database user (save password!)
4. Allow access from anywhere (0.0.0.0/0)
5. Get connection string:
   ```
   mongodb+srv://username:PASSWORD@cluster.xxxxx.mongodb.net/financial_tracker?retryWrites=true&w=majority
   ```

### 2. Backend (10 minutes)

1. Go to https://render.com
2. Sign up with GitHub
3. New + → Web Service
4. Connect your `financial_tracker` repo
5. Configure:
   - Root Directory: `financial-tracker-app/server`
   - Build: `npm install && npm run build`
   - Start: `npm start`
6. Add environment variables:
   ```
   NODE_ENV=production
   PORT=5001
   JWT_SECRET=<generate-32-char-secret>
   MONGODB_URI=<your-mongodb-connection-string>
   CORS_ORIGIN=https://your-app.vercel.app
   ```
7. Deploy!
8. Save your URL: `https://financial-tracker-api.onrender.com`

**Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Frontend (10 minutes)

1. Go to https://vercel.com
2. Sign up with GitHub
3. Import Project → Select `financial_tracker`
4. Configure:
   - Root Directory: `financial-tracker-app`
   - Framework: Vite
   - Build: `npm run build`
5. Add environment variable:
   ```
   VITE_API_URL=https://financial-tracker-api.onrender.com
   ```
6. Deploy!
7. Save your URL: `https://financial-tracker.vercel.app`

### 4. Update CORS (2 minutes)

1. Go back to Render
2. Environment tab
3. Update `CORS_ORIGIN` to your Vercel URL
4. Save (triggers redeploy)

### 5. Test! (3 minutes)

Visit your Vercel URL and test:
- ✅ Register account
- ✅ Login
- ✅ Create account
- ✅ Add transaction
- ✅ View dashboard

## 🎉 Done!

Your app is now live on the internet!

**Share your URLs:**
- Frontend: https://your-app.vercel.app
- Backend: https://your-api.onrender.com

---

## 📱 Next Steps

### Share Your App
- Add URLs to README
- Share with friends/family
- Get feedback!

### Monitor
- Check Render logs for errors
- Check Vercel analytics
- Monitor MongoDB Atlas usage

### Upgrade (Optional)
- Custom domain ($12/year)
- Render paid tier ($7/month - no sleep)
- MongoDB upgraded storage

---

## ⚠️ Important Notes

### Free Tier Limitations
- **Render:** Backend sleeps after 15 min inactivity
  - First request takes 30-60 seconds to wake up
  - Add loading message: "Waking up server..."
- **Vercel:** Frontend never sleeps (always fast!)
- **MongoDB:** 512MB storage (enough for thousands of transactions)

### Security
- ✅ All traffic is HTTPS encrypted
- ✅ JWT tokens for authentication
- ✅ MongoDB credentials secured
- ✅ CORS limited to your domain

### Auto-Deploy
- Push to GitHub `main` branch
- Both frontend and backend auto-deploy
- Live in 2-5 minutes!

---

## 🆘 Troubleshooting

### "Failed to fetch"
- Backend is waking up (wait 30-60 sec)
- Check Render logs for errors
- Verify MONGODB_URI is correct

### CORS Error
- Check CORS_ORIGIN matches Vercel URL exactly
- No trailing slash
- Wait for Render redeploy

### Can't Connect to MongoDB
- Check password is correct in connection string
- Verify IP whitelist allows 0.0.0.0/0
- Check cluster is running (not paused)

---

## 📖 Full Guide

For detailed instructions, see [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md)

---

**Questions?** Open an issue on GitHub or check the full deployment guide!
