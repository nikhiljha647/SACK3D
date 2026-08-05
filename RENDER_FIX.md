# 🔧 Render Deployment Fix Guide

## Issues Fixed

✅ **Backend "Cannot GET /" error** - Added root route handler  
✅ **CORS blocking frontend** - Added Render frontend URLs to allowed origins  
✅ **MySQL → PostgreSQL compatibility** - Dynamic database switching based on NODE_ENV  
✅ **SQL query syntax** - Converted MySQL queries (`?`) to PostgreSQL (`$1, $2`)  
✅ **Auto-migration on deploy** - Runs `deploy-migrate.js` during build  

---

## 🚀 Deployment Steps

### Option 1: Redeploy from Render Dashboard (Recommended)

1. **Go to Render Dashboard**: https://dashboard.render.com/
2. **Find your `sack3d-api` service**
3. Click **"Manual Deploy"** → **"Clear build cache & deploy"**
4. Wait 3-5 minutes for deployment to complete
5. Check logs for migration success:
   ```
   ✅ Users table created
   ✅ Models table created  
   ✅ Activities table created
   🎉 Migration completed successfully!
   🚀 SACK3D API running on...
   ```

### Option 2: Push Code to GitHub (Auto-deploy)

```bash
# Stage all changes
git add .

# Commit with message
git commit -m "Fix: PostgreSQL compatibility, CORS, and root route"

# Push to GitHub
git push origin main
```

Render will automatically detect the push and redeploy.

---

## ✅ Verify Backend is Working

### Test 1: Root Endpoint
```bash
curl https://sack3d-api.onrender.com/
```

**Expected response:**
```json
{
  "success": true,
  "message": "SACK3D API is running",
  "version": "1.0.0",
  "endpoints": {...}
}
```

### Test 2: Health Check
```bash
curl https://sack3d-api.onrender.com/api/health
```

**Expected response:**
```json
{
  "success": true,
  "status": "ok"
}
```

### Test 3: Models Endpoint
```bash
curl https://sack3d-api.onrender.com/api/models
```

**Expected response:**
```json
{
  "success": true,
  "data": []
}
```

---

## 🔍 Troubleshooting

### Backend Still Not Working?

1. **Check Environment Variables** in Render Dashboard:
   - `NODE_ENV` = `production`
   - `DATABASE_URL` = (auto-set from database)
   - `JWT_SECRET` = (auto-generated)
   - `PORT` = `4000`

2. **Check Database Connection**:
   - Go to your database in Render
   - Verify it's running and not suspended
   - Check connection string is set

3. **View Backend Logs**:
   - Go to `sack3d-api` service
   - Click "Logs" tab
   - Look for errors (red text)

### Frontend Can't Connect?

1. **Verify API URL** in frontend environment:
   - `.env.production` should have: `VITE_API_URL=https://sack3d-api.onrender.com`

2. **Redeploy Frontend**:
   - Go to `sack3d-frontend` service
   - Click "Manual Deploy" → "Clear build cache & deploy"

3. **Check Browser Console**:
   - Open DevTools (F12)
   - Look for CORS or network errors
   - Verify API URL is correct

---

## 📝 What Changed?

### 1. Dynamic Database Loading (`server/index.js`, `authRoutes.js`, controllers)
```javascript
// Automatically uses PostgreSQL in production, MySQL locally
const dbFile = process.env.NODE_ENV === 'production' ? './db-postgres.js' : './db.js'
const pool = require(dbFile)
```

### 2. PostgreSQL Query Syntax
```javascript
// MySQL uses ?
await pool.query('SELECT * FROM users WHERE id = ?', [userId])

// PostgreSQL uses $1, $2, $3
await pool.query('SELECT * FROM users WHERE id = $1', [userId])
```

### 3. Result Format Handling
```javascript
// MySQL
const [rows] = await pool.query('SELECT * FROM users')

// PostgreSQL
const result = await pool.query('SELECT * FROM users')
const rows = result.rows
```

### 4. CORS Configuration (`server/index.js`)
```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'https://sack3d-frontend.onrender.com',
  'https://sack3d.onrender.com'
]
```

### 5. Root Route Handler (`server/index.js`)
```javascript
app.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: 'SACK3D API is running',
    version: '1.0.0'
  })
})
```

---

## 🎯 Next Steps After Deployment

1. **Test Full User Flow**:
   - Sign up a new account
   - Login and check daily bonus
   - Upload a 3D model
   - View gallery
   - Open model detail page

2. **Monitor Performance**:
   - Check response times in Network tab
   - Watch for any errors in logs
   - Monitor database queries

3. **Set Up Custom Domain** (Optional):
   - Go to frontend service settings
   - Add custom domain
   - Update DNS records
   - Update CORS in backend

---

## 🆘 Still Having Issues?

Check the following files match the expected structure:

- `server/index.js` - Root route, CORS, dynamic DB
- `server/db-postgres.js` - PostgreSQL connection
- `server/authRoutes.js` - PostgreSQL queries
- `server/controllers/activityController.js` - PostgreSQL transactions
- `server/controllers/modelsController.js` - PostgreSQL queries
- `render.yaml` - Build command with migration
- `.env.production` - Frontend API URL

All files have been updated to support both MySQL (local) and PostgreSQL (production).
