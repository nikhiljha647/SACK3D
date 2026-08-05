# SACK3D - Complete Testing Checklist

**Test Date:** July 24, 2026
**Frontend URL:** http://localhost:5174
**Backend URL:** http://localhost:4000

---

## ✅ COMPLETED FEATURES

### 1. HOMEPAGE DESIGN
**URL:** `http://localhost:5174/`

#### Test Cases:
- [ ] **Navbar**
  - Logo displays (orange 3D box icon with "SACK 3D" text)
  - Fixed at top with light gray background (#dce2e8)
  - Shows "Gallery" link
  - Shows "Sign in" button when logged out
  - Responsive hamburger menu on mobile

- [ ] **Hero Section**
  - Left-aligned layout
  - Dark gradient overlay on background image
  - Orange accent text "#e8edf2" light background
  - Heading: "Industrial 3D Models, Live on the Shop Floor"
  - CTA buttons visible

- [ ] **How It Works Section**
  - Two-column layout (video left, steps right)
  - Light background #e8edf2
  - 3 numbered steps with icons
  - Embedded video placeholder

- [ ] **Use Cases Section**
  - Light background
  - 3 white cards in grid
  - First card has orange border
  - Icons and descriptions visible

- [ ] **Technology Section**
  - Dark background
  - AR feature image on right
  - Bullet points with features

- [ ] **CTA Section**
  - Dark tech background image
  - Centered orange button
  - "Get Started" call-to-action

- [ ] **Footer**
  - Dark background (#0f1419)
  - Same logo as navbar (orange 3D box)
  - 4 columns: Brand, Product, Company, Resources
  - Social media icons
  - Copyright notice

---

### 2. AUTHENTICATION SYSTEM
**URLs:** 
- Auth: `http://localhost:5174/auth`
- Dashboard: `http://localhost:5174/dashboard`

#### Test Cases:
- [ ] **Signup**
  - Navigate to /auth
  - Switch to "Sign up" tab
  - Enter: Name, Email, Password (min 8 chars)
  - Click "Sign up"
  - Should receive 200 coins (default) + 100 bonus = 300 total
  - Activity log should show "Signup Bonus +100"
  - Redirects to /gallery

- [ ] **Login**
  - Navigate to /auth
  - Enter valid email/password
  - Click "Sign in"
  - First login of the day grants +10 coins bonus
  - Activity log shows "Daily Login Bonus +10"
  - Redirects to /gallery
  - **Test Daily Bonus:** Login again same day → NO bonus
  - **Test Daily Bonus:** Login next day → SHOULD get +10 bonus

- [ ] **Navbar When Logged In**
  - Shows: Gallery · 🪙 [balance] · Dashboard · Upload (orange) · Sign out
  - Coin balance is clickable → links to dashboard
  - Balance updates in real-time after transactions

- [ ] **Logout**
  - Click "Sign out"
  - Redirects to homepage
  - Navbar shows "Sign in" button again

---

### 3. DASHBOARD PAGE
**URL:** `http://localhost:5174/dashboard`

#### Test Cases:
- [ ] **Balance Card**
  - Shows "CURRENT BALANCE"
  - Large coin icon and number
  - "Upload model (25)" button visible
  - Clicking button → navigates to /upload

- [ ] **Reward Info Cards** (3 cards in grid)
  - Card 1: "Signup Bonus +100 coins"
  - Card 2: "Daily Login +10 coins"
  - Card 3: "Per Upload -25 coins"

- [ ] **Recent Activity List**
  - Shows all user activities
  - Each item has: Icon, Title, Date/Time, Amount
  - Positive amounts in orange/green
  - Negative amounts in red
  - Newest first
  - Empty state if no activities

- [ ] **Activity Types**
  - Signup Bonus (orange icon)
  - Daily Login Bonus (orange icon)
  - Model Upload (red icon with -25)

---

### 4. GALLERY PAGE
**URL:** `http://localhost:5174/gallery`

#### Test Cases:
- [ ] **Page Layout**
  - Title: "Gallery"
  - Subtitle: "Browse 3D models — tap any to view in AR."
  - 3 tab pills visible

- [ ] **Tab Pills**
  - **Logged Out:** Shows 2 tabs only (All public, Curated)
  - **Logged In:** Shows 3 tabs (All public, Curated, My models)
  - Active tab has white background with shadow
  - Inactive tabs are transparent with gray text

- [ ] **Upload Button**
  - ONLY shows when logged in
  - Located top-right corner
  - Orange button with upload icon
  - Click → navigates to /upload

- [ ] **Model Cards**
  - 4-5 column grid layout
  - Each card shows thumbnail or placeholder icon
  - Model title and description
  - Hover effect: shadow and slight lift
  - Click card → navigates to model detail page

- [ ] **Search Functionality**
  - Search input in top-right
  - Filters models by title/description
  - Shows "No models found" if no matches

- [ ] **Loading State**
  - Shows skeleton cards while loading
  - 8 skeleton cards in grid

- [ ] **Empty State**
  - Shows when no models exist
  - "No models yet" message
  - Prompt to upload if logged in

---

### 5. MODEL UPLOAD
**URL:** `http://localhost:5174/upload`

#### Test Cases:
- [ ] **Authentication Check**
  - Accessing /upload while logged out → redirects to /auth
  - Must be logged in to see page

- [ ] **Upload Form**
  - Title field (required)
  - Description field (optional)
  - 3D Model file upload (.glb/.gltf max 50MB)
  - Thumbnail upload (jpg/png/webp)
  - Drag & drop zones
  - File picker button

- [ ] **Validation**
  - Title required → shows error if empty
  - Model file required → shows error if missing
  - File type check → only .glb/.gltf accepted
  - File size check → max 50MB
  - Balance check → must have 25+ coins

- [ ] **Upload Process**
  - Click "Upload Model (-25 Coins)"
  - Shows progress bar
  - Deducts 25 coins from balance
  - Creates activity log entry
  - Success toast notification
  - Redirects to gallery or my models

- [ ] **Error Handling**
  - Insufficient coins → shows error toast
  - Network error → shows error toast
  - Invalid file type → shows error toast

---

### 6. MODEL DETAIL PAGE
**URL:** `http://localhost:5174/model/:id`

#### Test Cases:
- [ ] **Page Layout**
  - Back button "Back to gallery"
  - Two-column grid (3D viewer left, info right)
  - Model title and description at top

- [ ] **3D Model Viewer (Left)**
  - Light gray background
  - Loads .glb file from server
  - Interactive controls (rotate, zoom, pan)
  - Auto-rotation enabled
  - Loading spinner while model loads
  - Google model-viewer component

- [ ] **Model Info Card (Right)**
  - Model title (large, bold)
  - Description text
  - View in AR section

- [ ] **View in AR Card**
  - AR icon with heading
  - "Scan with your phone to launch AR viewer"
  - **REAL QR CODE** (scannable)
  - QR code generated with qrcode.react
  - QR code points to: http://localhost:5174/model/:id
  - Balance display: "Balance: 190" with coin icon

- [ ] **Download Buttons** (2 buttons)
  - "QR (-5)" → downloads QR code as SVG
  - "Model (-10)" → downloads .glb file
  - Gray background, hover effect

- [ ] **Open AR Button**
  - Orange button below downloads
  - Click → opens AR modal
  - Full width

- [ ] **AR Modal**
  - Shows larger QR code
  - Balance display
  - Same download buttons
  - Orange "Open AR" button
  - Full model URL at bottom
  - Close button (X) in top-right

- [ ] **Delete Model Button**
  - Red button at bottom
  - "Delete model" with trash icon
  - Only visible to model owner

- [ ] **QR Code Functionality**
  - Scan QR with phone camera
  - Opens model page on phone
  - On phone: AR button shows native AR viewer
  - iOS: Uses AR Quick Look
  - Android: Uses Scene Viewer (ARCore)

---

### 7. MY MODELS TAB
**URL:** `http://localhost:5174/gallery` (My models tab)

#### Test Cases:
- [ ] **Tab Visibility**
  - Tab ONLY shows when logged in
  - Hidden when logged out

- [ ] **Functionality**
  - Click "My models" tab
  - Shows only models uploaded by current user
  - Same card layout as "All public" tab
  - Empty state if user has no uploads

- [ ] **Filter Verification**
  - Backend endpoint: GET /api/models?filter=my-models
  - Requires authentication token
  - Returns only user's models

---

### 8. COIN ECONOMY SYSTEM

#### Test Cases:
- [ ] **Initial Balance**
  - New user: 200 coins (default)
  - After signup bonus: 300 coins (200 + 100)

- [ ] **Daily Login Bonus**
  - First login each day: +10 coins
  - Same day login: no bonus
  - Next day login: +10 coins
  - Activity log updated

- [ ] **Upload Cost**
  - Each upload: -25 coins
  - Balance updated immediately
  - Activity log shows negative amount
  - Cannot upload with <25 coins

- [ ] **Balance Display**
  - Navbar shows current balance with coin icon
  - Dashboard shows large balance display
  - Balance updates across all pages (real-time)

---

### 9. BACKEND API ENDPOINTS

#### Test with Postman or curl:

**Health Check:**
```bash
GET http://localhost:4000/api/health
Response: {"success": true, "status": "ok"}
```

**Authentication:**
```bash
POST http://localhost:4000/api/auth/signup
Body: {"name": "Test", "email": "test@test.com", "password": "12345678"}

POST http://localhost:4000/api/auth/login
Body: {"email": "test@test.com", "password": "12345678"}

GET http://localhost:4000/api/auth/me
Headers: Authorization: Bearer <token>
```

**Models:**
```bash
GET http://localhost:4000/api/models
GET http://localhost:4000/api/models?filter=my-models (requires auth)
GET http://localhost:4000/api/models/:id
POST http://localhost:4000/api/models/upload (requires auth, multipart/form-data)
DELETE http://localhost:4000/api/models/:id (requires auth)
```

**Dashboard:**
```bash
GET http://localhost:4000/api/dashboard
Headers: Authorization: Bearer <token>
Response: {balance, rewards, recentActivities}
```

**Activities:**
```bash
GET http://localhost:4000/api/activity
Headers: Authorization: Bearer <token>
```

---

### 10. DATABASE TABLES

#### Verify MySQL tables exist:
```sql
-- Users table
SELECT * FROM users;
Columns: id, name, email, password, coins, last_login_date, created_at

-- Models table
SELECT * FROM models;
Columns: id, title, description, model_file, thumbnail, uploaded_by, downloads, views, created_at

-- Activities table
SELECT * FROM activities;
Columns: id, user_id, type, title, amount, description, created_at
```

---

### 11. FILE UPLOADS

#### Test Cases:
- [ ] **Model Files**
  - Stored in: `server/uploads/models/`
  - Named with UUID: `{uuid}.glb`
  - Served statically at: `/uploads/models/{uuid}.glb`

- [ ] **Thumbnails**
  - Stored in: `server/uploads/thumbnails/`
  - Named with UUID: `{uuid}.jpg`
  - Served statically at: `/uploads/thumbnails/{uuid}.jpg`

- [ ] **Static File Serving**
  - Access: `http://localhost:4000/uploads/models/{filename}`
  - Access: `http://localhost:4000/uploads/thumbnails/{filename}`
  - CORS enabled
  - Files downloadable

---

### 12. RESPONSIVE DESIGN

#### Test on different screen sizes:
- [ ] **Desktop (1920x1080)**
  - All sections full width
  - Multi-column layouts work
  - Navbar expanded

- [ ] **Tablet (768x1024)**
  - Columns stack appropriately
  - Touch-friendly buttons
  - Responsive grid

- [ ] **Mobile (375x667)**
  - Hamburger menu shows
  - Single column layout
  - Cards stack vertically
  - Text readable
  - Buttons easily tappable

---

### 13. SECURITY FEATURES

#### Test Cases:
- [ ] **JWT Authentication**
  - Token expires after 7 days (default)
  - Invalid token → 401 error
  - No token on protected routes → 401 error

- [ ] **Password Hashing**
  - Passwords stored with bcrypt (12 rounds)
  - Plain passwords not visible in database

- [ ] **Protected Routes**
  - /upload requires auth
  - /dashboard requires auth
  - /my-models requires auth
  - Model delete requires ownership

- [ ] **Input Validation**
  - Email format check
  - Password minimum 8 characters
  - File type validation
  - File size validation
  - SQL injection prevention (parameterized queries)

- [ ] **Rate Limiting**
  - 100 requests per 15 minutes per IP
  - Prevents brute force attacks

---

### 14. GIT REPOSITORY

#### Verify GitHub:
- [ ] **Repository URL:** https://github.com/nikhiljha647/SACK3D
- [ ] **Branch:** main
- [ ] **Commits:** 2 commits
- [ ] **Files:** 112 files, ~45MB
- [ ] **README.md:** Present
- [ ] **.gitignore:** Present (node_modules, .env, dist)

---

## 🎯 CRITICAL USER FLOWS

### Flow 1: New User Complete Journey
1. Visit homepage → See hero and features
2. Click "Sign in" → Go to /auth
3. Switch to "Sign up" tab
4. Enter details → Submit
5. Receive 300 coins (200 + 100 bonus)
6. Redirect to /gallery
7. See empty gallery or sample models
8. Click "Upload" button
9. Upload a 3D model → Balance: 275 coins
10. See model in "My models" tab
11. Click model card → View detail page
12. See 3D viewer and QR code
13. Scan QR with phone → View in AR
14. Click "Dashboard" in navbar
15. See balance and activity history

### Flow 2: Returning User
1. Visit /auth
2. Login with credentials
3. **IF first login today:** Get +10 coins bonus
4. **IF already logged in today:** No bonus
5. See updated balance in navbar
6. View dashboard → See all activities
7. Go to gallery → See "My models" tab
8. View own uploaded models

### Flow 3: AR Viewing
1. Open model detail page on desktop
2. QR code automatically generated
3. Scan QR with phone camera
4. Phone opens model page
5. Click AR button on phone
6. 3D model appears in camera view (AR)
7. Move phone to place model in real world
8. Walk around to view from all angles

---

## ✅ TESTING COMPLETED

**Date:** _____________
**Tester:** _____________
**Results:** _____________

### Issues Found:
1. _____________
2. _____________
3. _____________

### All Tests Passed: ☐ YES  ☐ NO

---

## 📊 PERFORMANCE METRICS

- [ ] Page load time < 2 seconds
- [ ] 3D model loads within 5 seconds
- [ ] API response time < 500ms
- [ ] File upload completes without errors
- [ ] No console errors
- [ ] No memory leaks
- [ ] Smooth animations (60fps)

---

**End of Testing Checklist**
