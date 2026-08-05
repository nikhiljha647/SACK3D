# 🚀 Deploy Fixes to Render - Step by Step

## 📋 What We Fixed
1. ✅ Coin balance: New users now get 100 coins (was 300)
2. ✅ File URLs: Fixed localhost URLs to use production API

---

## 🎯 Deployment Steps

### Step 1: Deploy Backend (sack3d-api)

**Why first?** The frontend depends on the backend API being updated.

1. **Go to Render Dashboard:**
   ```
   https://dashboard.render.com/
   ```

2. **Click on `sack3d-api` service**

3. **Click "Manual Deploy" button** (top-right)

4. **Select "Clear build cache & deploy"**

5. **Wait 2-3 minutes** for deployment

6. **Check logs for success:**
   ```
   ✅ Users table created (or "already exists")
   ✅ Models table created
   ✅ Activities table created
   🎉 Migration completed successfully!
   🗄️  Using database: ./db-postgres.js
   🚀 SACK3D API running on...
   ```

7. **Test backend is running:**
   - Open: `https://sack3d-api.onrender.com/`
   - Should show: `{"success": true, "message": "SACK3D API is running"}`

---

### Step 2: Deploy Frontend (sack3d or sack3d-frontend)

**Why?** Frontend needs the new URL helper function.

1. **Stay in Render Dashboard**

2. **Click on `sack3d` (or `sack3d-frontend`) service**

3. **Verify Environment Variable:**
   - Go to **Environment** tab
   - Check `VITE_API_URL` = `https://sack3d-api.onrender.com`
   - If wrong, fix it and save

4. **Click "Manual Deploy" button**

5. **Select "Clear build cache & deploy"**

6. **Wait 2-3 minutes** for deployment

7. **Test frontend is running:**
   - Open: `https://sack3d.onrender.com/`
   - Should load the homepage

---

## ✅ Verification Tests

### Test 1: Backend is Updated

Open this URL in browser:
```
https://sack3d-api.onrender.com/api/health
```

**Expected response:**
```json
{"success": true, "status": "ok"}
```

---

### Test 2: New User Gets 100 Coins

1. **Logout** from your current account
2. **Sign up** with a NEW email:
   - Name: Test User 2
   - Email: `test2@example.com`
   - Password: `password123`
3. **Check Dashboard:**
   - Should show: **100 coins** (not 300)
   - Activity: "Signup Bonus +100"

**Current user with 300 coins:** This is normal! Existing users keep their coins.

---

### Test 3: File URLs Work in Production

1. **Go to Gallery:** `https://sack3d.onrender.com/gallery`

2. **Check image URLs:**
   - Press F12 (DevTools)
   - Go to **Network** tab
   - Look at image requests
   - Should show: `sack3d-api.onrender.com/uploads/...`
   - Should NOT show: `localhost:4000`

3. **Click on a model** to open detail page

4. **Verify 3D viewer loads:**
   - Model should display in viewer
   - Check Network tab shows: `sack3d-api.onrender.com/uploads/models/...`

5. **Test download button:**
   - Click "Download Model"
   - File should download successfully
   - Network tab should show production URL

---

## 🐛 Troubleshooting

### Backend deployment fails
**Solution:**
- Check logs for specific error
- Verify `DATABASE_URL` environment variable is set
- Ensure database (sack3d-db) is running

### Frontend still shows localhost URLs
**Solution:**
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Check environment variable: `VITE_API_URL`
- Redeploy frontend with cache clear

### New users still get 300 coins
**Solution:**
- Check if backend migration ran successfully
- Look for migration messages in backend logs
- May need to manually alter the users table

### Images/models not loading
**Solution:**
- Verify CORS settings in backend allow frontend domain
- Check file paths in database are correct (`/uploads/models/...`)
- Ensure uploads directory exists in backend

---

## 📊 Expected Results After Deployment

### New User Signup Flow:
```
1. Sign up → Coins: 0
2. Signup bonus → Coins: 0 + 100 = 100 ✅
3. Dashboard shows: "Current Balance: 100 coins"
```

### Existing User (you):
```
Current balance: 300 coins (unchanged) ✅
This is correct - existing users keep their coins
```

### File URLs:
```
✅ Gallery thumbnails: https://sack3d-api.onrender.com/uploads/thumbnails/...
✅ Model viewer: https://sack3d-api.onrender.com/uploads/models/...
✅ Downloads: https://sack3d-api.onrender.com/uploads/models/...
❌ NO localhost:4000 URLs
```

---

## 🎉 Success Criteria

Deployment is successful when:
- ✅ Backend responds at health endpoint
- ✅ Frontend loads without errors
- ✅ NEW users get 100 coins on signup
- ✅ Gallery thumbnails load (not broken)
- ✅ 3D viewer displays models
- ✅ Download button works
- ✅ Network tab shows production URLs (no localhost)

---

## 📝 Summary of Changes

### Backend Changes:
- `server/deploy-migrate.js` - Default coins: 200 → 0
- `server/authRoutes.js` - Signup insert coins: 200 → 0

### Frontend Changes:
- `src/utils/url.ts` - NEW: URL helper function
- `src/components/gallery/GalleryPage.tsx` - Use dynamic URLs
- `src/pages/ModelDetailPage.tsx` - Use dynamic URLs

### Environment Variables Required:
- Backend: `DATABASE_URL` (from sack3d-db)
- Frontend: `VITE_API_URL` = `https://sack3d-api.onrender.com`

---

## ⏱️ Deployment Timeline

- Backend deploy: ~3 minutes
- Frontend deploy: ~2 minutes
- **Total: ~5 minutes**

---

## 🆘 Need Help?

If something goes wrong:
1. Check service logs in Render
2. Verify environment variables
3. Test backend health endpoint
4. Check browser console for errors
5. Review FIXES_APPLIED.md for details

---

**Ready to deploy?** Follow Step 1 above! 🚀
