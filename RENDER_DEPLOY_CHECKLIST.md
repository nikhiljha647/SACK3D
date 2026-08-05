# 🎯 Render Deployment Checklist

## ✅ Pre-Deployment (COMPLETED)

- [x] Fixed backend root route handler
- [x] Updated CORS to allow Render frontend URLs
- [x] Converted MySQL queries to PostgreSQL format
- [x] Added dynamic database switching (prod/dev)
- [x] Created auto-migration script
- [x] Updated all controllers for PostgreSQL
- [x] Updated render.yaml with migration command
- [x] Pushed all changes to GitHub
- [x] Created documentation files

## 🚀 Deploy Backend

### Step 1: Trigger Deployment
- [ ] Go to https://dashboard.render.com/
- [ ] Click on **sack3d-api** service
- [ ] Click **Manual Deploy** button
- [ ] Select **"Clear build cache & deploy"**
- [ ] Wait for build to complete (3-5 minutes)

### Step 2: Verify Backend Logs
Look for these messages in the logs:

```
✅ Building...
   Running: cd server && npm install && node deploy-migrate.js
   
✅ Migration messages:
   🚀 Starting PostgreSQL migration for Render...
   ✅ Users table created
   ✅ Models table created
   ✅ Activities table created
   🎉 Migration completed successfully!

✅ Starting server:
   🗄️  Using database: ./db-postgres.js
   🚀  SACK3D API running on http://0.0.0.0:4000
```

### Step 3: Test Backend Endpoints

**Root endpoint:**
```bash
curl https://sack3d-api.onrender.com/
```
Expected: `{"success": true, "message": "SACK3D API is running", "version": "1.0.0"}`

- [ ] Root endpoint works

**Health check:**
```bash
curl https://sack3d-api.onrender.com/api/health
```
Expected: `{"success": true, "status": "ok"}`

- [ ] Health check works

**Models endpoint:**
```bash
curl https://sack3d-api.onrender.com/api/models
```
Expected: `{"success": true, "data": []}`

- [ ] Models endpoint works

## 🎨 Deploy Frontend

### Step 1: Redeploy Frontend (if needed)
- [ ] Go to **sack3d-frontend** service
- [ ] Click **Manual Deploy** → **Clear build cache & deploy**
- [ ] Wait for build to complete

### Step 2: Verify Frontend
- [ ] Open https://sack3d-frontend.onrender.com/
- [ ] Login page loads without errors
- [ ] Check browser console (F12) - no CORS errors
- [ ] Network tab shows API calls to correct URL

## 🧪 Complete User Flow Testing

### Authentication Flow
- [ ] Sign up new account
  - [ ] Form submits successfully
  - [ ] Get 100 coins signup bonus
  - [ ] Redirected to /gallery
  
- [ ] Logout
- [ ] Login with same account
  - [ ] Get 10 coins daily bonus (first login of day)
  - [ ] Redirected to /gallery
  - [ ] Navbar shows coin balance

### Gallery Flow
- [ ] Gallery page loads
- [ ] Shows "All public", "Curated", "My models" tabs
- [ ] "My models" tab visible when logged in
- [ ] Upload button visible when logged in
- [ ] Search bar works
- [ ] Model cards display correctly

### Upload Flow
- [ ] Click Upload button in navbar
- [ ] Upload page loads
- [ ] Can drag/drop or select 3D model file (.glb/.gltf)
- [ ] Can add thumbnail image
- [ ] Title field required
- [ ] Description field optional
- [ ] Submit deducts 25 coins
- [ ] Redirected to gallery after upload
- [ ] Uploaded model appears in "My models"

### Model Detail Flow
- [ ] Click on a model card
- [ ] Model detail page loads
- [ ] 3D viewer displays model
- [ ] Can rotate/zoom model
- [ ] Model info shows (title, description, uploader, stats)
- [ ] QR code displays
- [ ] Download buttons work
- [ ] Delete button shows for own models

### Dashboard Flow
- [ ] Click coin badge in navbar
- [ ] Dashboard page loads
- [ ] Shows current balance
- [ ] Shows reward info cards
- [ ] Activity timeline displays
- [ ] Activities show correct icons and amounts

### Coin Economy
- [ ] Signup: +100 coins ✅
- [ ] Daily login: +10 coins ✅
- [ ] Upload model: -25 coins ✅
- [ ] Download QR: -5 coins
- [ ] Download model: -10 coins
- [ ] Balance updates in navbar immediately
- [ ] Activities logged correctly

## 📊 Performance Checks

- [ ] Page load time < 3 seconds
- [ ] 3D models load within 5 seconds
- [ ] API responses < 1 second
- [ ] No console errors
- [ ] No network errors
- [ ] Images load correctly

## 🔒 Security Checks

- [ ] HTTPS enabled on all pages
- [ ] JWT tokens stored securely
- [ ] API requires authentication for protected routes
- [ ] CORS only allows specific domains
- [ ] File upload size limits enforced
- [ ] SQL injection prevented (parameterized queries)

## 🐛 Common Issues & Solutions

### Backend doesn't start
**Solution:** Check environment variables in Render
- NODE_ENV = production
- DATABASE_URL = (should be auto-set)
- JWT_SECRET = (should exist)

### CORS errors in frontend
**Solution:** Verify CORS configuration includes:
```javascript
'https://sack3d-frontend.onrender.com'
```

### Database connection fails
**Solution:** Check database status in Render
- Should show "Available"
- Connection string should be set
- Not suspended

### Frontend can't connect to backend
**Solution:** Check .env.production:
```
VITE_API_URL=https://sack3d-api.onrender.com
```

### Tables don't exist
**Solution:** Migration didn't run
- Check build logs for migration output
- Manually run: `node server/deploy-migrate.js` in shell

## 📈 Post-Deployment Monitoring

### First 24 Hours
- [ ] Monitor error logs in Render
- [ ] Check database performance
- [ ] Watch for any 500 errors
- [ ] Verify daily login bonus working
- [ ] Test file uploads work consistently

### First Week
- [ ] Monitor free tier usage (750 hours/month)
- [ ] Check if services go to sleep
- [ ] Verify wake-up time acceptable
- [ ] Consider upgrading if needed

### Ongoing
- [ ] Weekly log review
- [ ] Monthly usage check
- [ ] Database size monitoring
- [ ] User feedback collection

## 🎉 Success Criteria

✅ **Deployment is successful when:**

1. Backend responds at root URL
2. All API endpoints work
3. Frontend loads without errors
4. User can sign up and login
5. Upload functionality works
6. 3D models display correctly
7. Coin system tracks properly
8. No CORS errors
9. Database persists data
10. All features from local work in production

## 📞 Support Resources

- **Render Documentation:** https://render.com/docs
- **PostgreSQL Guide:** https://www.postgresql.org/docs/
- **Project Docs:** See RENDER_FIX.md, DEPLOYMENT_GUIDE.md
- **GitHub Repo:** https://github.com/nikhiljha647/SACK3D

---

## 🚦 Current Status

**Backend:** ✅ Code fixed and pushed to GitHub  
**Frontend:** ✅ Environment variables configured  
**Database:** ✅ Auto-migration script ready  
**Next Step:** 👉 **YOU: Trigger manual deploy in Render Dashboard**

---

**Last Updated:** Context transfer session  
**Version:** 1.0 - PostgreSQL compatible
