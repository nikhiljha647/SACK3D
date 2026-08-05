# 🚀 Deploy SACK3D for FREE

## Best Free Hosting: Render.com

**Why Render?**
- ✅ FREE forever tier
- ✅ Backend (Node.js) hosting
- ✅ Frontend (Static) hosting
- ✅ PostgreSQL database (FREE)
- ✅ Auto-deploy from GitHub
- ✅ HTTPS included
- ✅ No credit card needed

---

## 📋 STEP-BY-STEP DEPLOYMENT

### **Step 1: Create Render Account**

1. Go to https://render.com
2. Click "Get Started" 
3. Sign up with GitHub account
4. Authorize Render to access your repositories

---

### **Step 2: Deploy Backend + Database**

#### **Option A: Using Dashboard (Easier)**

1. **Create PostgreSQL Database:**
   - Click "New" → "PostgreSQL"
   - Name: `sack3d-db`
   - Database: `sack3d`
   - User: (auto-generated)
   - Region: Oregon (Free)
   - Plan: Free
   - Click "Create Database"
   - **Save the connection details!**

2. **Create Backend Service:**
   - Click "New" → "Web Service"
   - Connect your GitHub repository: `nikhiljha647/SACK3D`
   - Name: `sack3d-api`
   - Region: Oregon
   - Branch: `main`
   - Root Directory: `.` (leave empty)
   - Runtime: Node
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && node index.js`
   - Plan: Free

3. **Add Environment Variables:**
   ```
   NODE_ENV = production
   PORT = 4000
   JWT_SECRET = your-super-secret-key-here
   JWT_EXPIRES_IN = 7d
   DATABASE_URL = (paste from PostgreSQL database internal URL)
   ```

4. Click "Create Web Service"

#### **Option B: Using Blueprint (Automatic)**

1. Fork the repository to your GitHub
2. Add `render.yaml` to root (already done)
3. Go to Render Dashboard
4. Click "New" → "Blueprint"
5. Select your repository
6. Render will auto-create:
   - Backend service
   - Frontend service  
   - PostgreSQL database
7. Click "Apply"

---

### **Step 3: Update Backend for PostgreSQL**

Since Render uses PostgreSQL (not MySQL), we need to make small changes:

1. **Install pg package:**
```bash
cd server
npm install pg
```

2. **Update server/db.js:**
```javascript
// Use PostgreSQL instead of MySQL
const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

module.exports = pool
```

3. **Update SQL queries for PostgreSQL:**
   - Change `AUTO_INCREMENT` → `SERIAL`
   - Change backticks → quotes
   - Change `DATETIME` → `TIMESTAMP`

**OR use the provided migrations in `server/migrations-postgres/`**

---

### **Step 4: Deploy Frontend**

1. **Create Frontend Service:**
   - Click "New" → "Static Site"
   - Connect repository: `nikhiljha647/SACK3D`
   - Name: `sack3d-frontend`
   - Branch: `main`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
   - Plan: Free

2. **Add Environment Variable:**
   ```
   VITE_API_URL = https://sack3d-api.onrender.com
   ```
   (Replace with your actual backend URL)

3. Click "Create Static Site"

---

### **Step 5: Update Frontend API URL**

1. **Create `.env.production` file:**
```bash
VITE_API_URL=https://sack3d-api.onrender.com
```

2. **Update `src/services/api.ts`:**
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'
```

3. Commit and push changes

---

### **Step 6: Test Your Live Site**

Your URLs will be:
- **Frontend:** `https://sack3d-frontend.onrender.com`
- **Backend:** `https://sack3d-api.onrender.com`
- **Database:** (internal URL only)

Test:
1. Visit frontend URL
2. Try signup/login
3. Upload a model
4. View 3D models
5. Scan QR code with phone

---

## 🆓 ALTERNATIVE FREE HOSTING OPTIONS

### **Option 2: Vercel (Frontend) + Railway (Backend)**

**Frontend on Vercel:**
- Free static hosting
- Auto-deploy from GitHub
- Custom domain support

**Backend on Railway:**
- Free $5/month credit (500 hours)
- PostgreSQL included
- Easy deployment

**Steps:**
1. Deploy frontend: `npx vercel` in root
2. Deploy backend: Railway.app → New Project → Deploy from GitHub

---

### **Option 3: Netlify (Frontend) + Heroku (Backend)**

**Frontend on Netlify:**
- Free static hosting
- Build command: `npm run build`
- Publish dir: `dist`

**Backend on Heroku:**
- Free tier (with credit card)
- PostgreSQL add-on
- `git push heroku main`

---

## 📝 MIGRATION SCRIPTS

### **PostgreSQL Migration**

Create `server/migrate-postgres.js`:

```javascript
const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

async function migrate() {
  // Users table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      coins INTEGER DEFAULT 200,
      last_login_date DATE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Models table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS models (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      model_file VARCHAR(500) NOT NULL,
      thumbnail VARCHAR(500),
      uploaded_by INTEGER NOT NULL REFERENCES users(id),
      downloads INTEGER DEFAULT 0,
      views INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Activities table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS activities (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      type VARCHAR(50) NOT NULL,
      title VARCHAR(255) NOT NULL,
      amount INTEGER NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)

  console.log('✅ PostgreSQL tables created')
  await pool.end()
}

migrate().catch(console.error)
```

Run: `node server/migrate-postgres.js`

---

## ⚙️ ENVIRONMENT VARIABLES

### **Backend (.env):**
```env
NODE_ENV=production
PORT=4000
DATABASE_URL=postgresql://user:pass@host:5432/database
JWT_SECRET=your-super-secret-key-change-this
JWT_EXPIRES_IN=7d
```

### **Frontend (.env.production):**
```env
VITE_API_URL=https://your-backend-url.onrender.com
```

---

## 🚨 IMPORTANT NOTES

### **Free Tier Limitations:**

**Render Free Tier:**
- ⚠️ Services spin down after 15 mins of inactivity
- ⚠️ Cold start takes ~30 seconds
- ✅ 750 hours/month (enough for 1 service)
- ✅ 512MB RAM
- ✅ Shared CPU

**Solutions for Cold Start:**
1. Use UptimeRobot to ping your site every 5 mins (keeps it alive)
2. Upgrade to paid tier ($7/month per service)
3. Use multiple free accounts (not recommended)

### **File Uploads:**

Free tier has limited disk space. Consider:
1. Use Cloudinary for file storage (free tier: 25GB)
2. Use AWS S3 (free tier: 5GB)
3. Keep uploads small (<10MB per file)

---

## 📊 DEPLOYMENT CHECKLIST

- [ ] GitHub repository is public
- [ ] `render.yaml` file in root
- [ ] PostgreSQL migration script created
- [ ] Environment variables configured
- [ ] Backend service created on Render
- [ ] Database created on Render
- [ ] Frontend service created on Render
- [ ] API URL updated in frontend
- [ ] Commit and push all changes
- [ ] Test live site
- [ ] Setup custom domain (optional)

---

## 🎯 QUICK DEPLOY (5 Minutes)

```bash
# 1. Update backend for PostgreSQL
cd server
npm install pg

# 2. Push to GitHub
git add .
git commit -m "Add Render deployment config"
git push origin main

# 3. Go to Render.com
# - Sign in with GitHub
# - New → Blueprint
# - Select SACK3D repository
# - Click "Apply"

# 4. Done! 
# Your site will be live at:
# https://sack3d-frontend.onrender.com
```

---

## 🔗 USEFUL LINKS

- **Render Dashboard:** https://dashboard.render.com
- **Render Docs:** https://render.com/docs
- **PostgreSQL Docs:** https://www.postgresql.org/docs/
- **Render Free Tier:** https://render.com/docs/free

---

## 💡 TIPS

1. **Use Render Blueprint** for easiest deployment (one-click)
2. **Keep services in same region** (Oregon) for better performance
3. **Enable auto-deploy** from GitHub for automatic updates
4. **Monitor logs** in Render dashboard for errors
5. **Test thoroughly** after deployment

---

## 🆘 TROUBLESHOOTING

### Issue: "Service unavailable"
- Check Render dashboard for service status
- Services spin down after 15 mins (wait 30s for cold start)
- Check logs for errors

### Issue: "Database connection failed"
- Verify DATABASE_URL is correct
- Check PostgreSQL service is running
- Verify SSL settings for production

### Issue: "API calls failing"
- Check CORS settings in backend
- Verify VITE_API_URL in frontend
- Check network tab for actual error

### Issue: "Build failed"
- Check build logs in Render dashboard
- Verify package.json has all dependencies
- Check Node version compatibility

---

**Ready to deploy? Follow the steps above and your SACK3D project will be live for FREE! 🚀**
