# 🚀 Deploy SACK3D FREE in 10 Minutes

## Option 1: Render.com (Recommended - Easiest)

### Step 1: Sign Up
1. Go to https://render.com
2. Click "Get Started"
3. Sign up with your GitHub account

### Step 2: Create Database
1. Click "New +" → "PostgreSQL"
2. Name: `sack3d-db`
3. Database: `sack3d`
4. Region: Oregon
5. Plan: **Free**
6. Click "Create Database"
7. **Copy the "Internal Database URL"** (you'll need this!)

### Step 3: Deploy Backend
1. Click "New +" → "Web Service"
2. Connect your repository: `nikhiljha647/SACK3D`
3. Name: `sack3d-api`
4. Region: Oregon
5. Branch: `main`
6. Root Directory: (leave empty)
7. Runtime: **Node**
8. Build Command: `cd server && npm install`
9. Start Command: `cd server && node index.js`
10. Plan: **Free**

**Environment Variables** (click "Advanced"):
```
NODE_ENV = production
PORT = 4000
JWT_SECRET = sack3d-super-secret-key-2026
JWT_EXPIRES_IN = 7d
DATABASE_URL = (paste your database URL from Step 2)
```

11. Click "Create Web Service"
12. **Copy your backend URL** (e.g., https://sack3d-api.onrender.com)

### Step 4: Deploy Frontend
1. Click "New +" → "Static Site"
2. Connect repository: `nikhiljha647/SACK3D`
3. Name: `sack3d-frontend`
4. Branch: `main`
5. Build Command: `npm install && npm run build`
6. Publish Directory: `dist`
7. Plan: **Free**

**Environment Variables**:
```
VITE_API_URL = (paste your backend URL from Step 3)
```

8. Click "Create Static Site"

### Step 5: Run Database Migration
1. Go to your backend service dashboard
2. Click "Shell" tab
3. Run:
```bash
cd server
node migrations-postgres/migrate.js
```

### Step 6: Test Your Live Site! 🎉
Your frontend URL: `https://sack3d-frontend.onrender.com`

---

## Option 2: Vercel + Railway (Alternative)

### Frontend on Vercel:
```bash
npm i -g vercel
vercel login
vercel
```

### Backend on Railway:
1. Go to https://railway.app
2. Sign in with GitHub
3. "New Project" → "Deploy from GitHub"
4. Select SACK3D repository
5. Add PostgreSQL database
6. Deploy!

---

## ⚠️ Important Notes

1. **Free tier spins down after 15 mins** - First load takes 30 seconds
2. **Limited to 750 hours/month** - Enough for constant use
3. **Use UptimeRobot** to keep it alive (free monitoring service)

---

## 🐛 If Something Goes Wrong

1. Check Render dashboard logs
2. Verify environment variables are correct
3. Make sure DATABASE_URL is the "Internal" URL
4. Check that migrations ran successfully

---

## 🎯 Quick Checklist

- [ ] Render account created
- [ ] PostgreSQL database created
- [ ] Backend service deployed
- [ ] Frontend service deployed
- [ ] Environment variables set
- [ ] Database migrated
- [ ] Site loads successfully
- [ ] Can signup/login
- [ ] Can upload models

---

**Need help?** Check the detailed `DEPLOYMENT_GUIDE.md`

Your SACK3D project will be **LIVE and FREE** forever! 🚀
