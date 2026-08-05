# 🚀 SACK3D - Quick Start Guide

## Current Status
✅ **Both servers are running!**
- Backend: http://localhost:4000
- Frontend: http://localhost:5174

---

## 🎯 Test Everything in 5 Minutes

### **Step 1: Test Homepage** (30 seconds)
1. Open: http://localhost:5174
2. Scroll through all sections
3. Check navbar, hero, how it works, use cases, technology, CTA, footer
4. ✅ All sections should display correctly

### **Step 2: Test Signup** (1 minute)
1. Click "Sign in" button in navbar
2. Switch to "Sign up" tab
3. Enter:
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `password123`
4. Click "Sign up"
5. ✅ Should redirect to gallery
6. ✅ Navbar should show: Gallery · 🪙 300 · Dashboard · Upload · Sign out
7. ✅ Balance should be 300 coins (200 default + 100 signup bonus)

### **Step 3: Test Dashboard** (30 seconds)
1. Click "Dashboard" in navbar
2. ✅ Should see balance: 300 coins
3. ✅ Should see 3 reward cards
4. ✅ Should see 1 activity: "Signup Bonus +100"
5. ✅ Click coin balance in navbar → should link to dashboard

### **Step 4: Test Model Upload** (1 minute)
1. Click "Upload" button (orange)
2. Enter:
   - Title: `Test Model`
   - Description: `My first 3D model`
3. Upload any .glb file (or skip if you don't have one)
4. Click "Upload Model (-25 Coins)"
5. ✅ Balance should decrease to 275 coins
6. ✅ Dashboard should show new activity: "Model Upload -25"

### **Step 5: Test Gallery** (30 seconds)
1. Click "Gallery" in navbar
2. ✅ Should see 3 tabs: All public, Curated, My models
3. Click "My models" tab
4. ✅ Should see your uploaded model(s)
5. Click any model card
6. ✅ Should go to model detail page

### **Step 6: Test 3D Viewer & QR Code** (1 minute)
1. On model detail page:
2. ✅ Should see 3D viewer (left side)
3. ✅ Should see QR code (right side)
4. ✅ QR code should be a real black & white pattern
5. Optional: Scan QR with phone
   - Opens model page on phone
   - Can view in AR on mobile

### **Step 7: Test Logout & Login** (1 minute)
1. Click "Sign out"
2. ✅ Should redirect to homepage
3. ✅ Navbar should show "Sign in" again
4. Click "Sign in"
5. Login with:
   - Email: `test@example.com`
   - Password: `password123`
6. ✅ Should get +10 coins daily bonus (first login today)
7. ✅ New balance: 285 coins (275 + 10)
8. ✅ Dashboard shows "Daily Login Bonus +10"

### **Step 8: Test Daily Bonus Prevention** (30 seconds)
1. Click "Sign out"
2. Login again immediately
3. ✅ Should NOT get another +10 coins
4. ✅ Balance stays at 285
5. ✅ No new activity logged

---

## ✅ CHECKLIST

**Homepage:**
- [ ] All sections visible
- [ ] Images load correctly
- [ ] Buttons work
- [ ] Footer displays

**Authentication:**
- [ ] Signup works
- [ ] Gets 100 coin bonus
- [ ] Login works
- [ ] Gets 10 coin daily bonus (once per day)
- [ ] Logout works
- [ ] Navbar updates correctly

**Dashboard:**
- [ ] Balance displays
- [ ] Reward cards show
- [ ] Activity list shows
- [ ] Icons correct (signup: orange, upload: red)

**Gallery:**
- [ ] 3 tabs when logged in
- [ ] 2 tabs when logged out
- [ ] Upload button only when logged in
- [ ] Model cards display
- [ ] Search works

**Upload:**
- [ ] Form displays
- [ ] File validation works
- [ ] Upload completes
- [ ] Coins deducted (-25)
- [ ] Activity logged

**Model Detail:**
- [ ] 3D viewer loads
- [ ] Model rotates/zooms
- [ ] QR code generates
- [ ] QR code is scannable
- [ ] Download buttons work

**Coin Economy:**
- [ ] Starts with 200 coins
- [ ] Signup bonus: +100
- [ ] Daily login: +10 (once per day)
- [ ] Upload cost: -25
- [ ] Balance updates everywhere

---

## 🐛 Common Issues & Solutions

### **Issue: Backend not running**
```bash
cd server
node index.js
```

### **Issue: Frontend not running**
```bash
npm run dev
```

### **Issue: Database connection error**
```bash
# Check MySQL is running
# Check server/.env has correct credentials
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=sack3d
```

### **Issue: "Cannot find module"**
```bash
# Reinstall dependencies
npm install
cd server && npm install
```

### **Issue: Port already in use**
```bash
# Frontend will auto-try next port (5174, 5175, etc)
# Backend: Change PORT in server/.env
```

### **Issue: No models showing**
```bash
# Upload a test model
# Or check server/uploads/models/ has .glb files
```

---

## 📊 Quick Test Results

**Test Run Date:** ___________
**Tester:** ___________

| Feature | Status | Notes |
|---------|--------|-------|
| Homepage | ☐ Pass ☐ Fail | |
| Signup | ☐ Pass ☐ Fail | |
| Login | ☐ Pass ☐ Fail | |
| Daily Bonus | ☐ Pass ☐ Fail | |
| Dashboard | ☐ Pass ☐ Fail | |
| Gallery | ☐ Pass ☐ Fail | |
| Upload | ☐ Pass ☐ Fail | |
| 3D Viewer | ☐ Pass ☐ Fail | |
| QR Code | ☐ Pass ☐ Fail | |
| Logout | ☐ Pass ☐ Fail | |

**Overall:** ☐ All Pass  ☐ Some Fail

---

## 🎉 You're Ready!

Everything is set up and running. Test the features above, and if all pass, your SACK3D project is **100% complete and functional**!

### **Next Steps:**
1. Complete the testing checklist above
2. Review `TESTING.md` for detailed test cases
3. Review `PROJECT_SUMMARY.md` for full documentation
4. Share your GitHub repo: https://github.com/nikhiljha647/SACK3D
5. Consider deployment to production

**Happy Testing! 🚀**
