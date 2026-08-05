# SACK3D API Documentation

**Base URL:** `http://localhost:4000/api`

**Version:** 1.0.0

---

## 📋 Table of Contents

1. [Authentication APIs](#authentication-apis)
2. [Models APIs](#models-apis)
3. [Dashboard APIs](#dashboard-apis)
4. [Activity APIs](#activity-apis)
5. [Health Check](#health-check)
6. [Error Responses](#error-responses)
7. [Authentication](#authentication)

---

## 🔐 Authentication APIs

### 1. Register User (Signup)

Creates a new user account with initial coin balance and signup bonus.

**Endpoint:** `POST /api/auth/signup`

**Authentication:** Not required

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Validation:**
- `name`: Required, string
- `email`: Required, valid email format, unique
- `password`: Required, minimum 8 characters

**Success Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "coins": 200
  }
}
```

**Business Logic:**
- User receives 200 coins by default
- Signup bonus of 100 coins is added (via activity system)
- Total initial balance: 300 coins
- Activity log created: "Signup Bonus +100"

**Status Codes:**
- `201 Created` - User created successfully
- `400 Bad Request` - Validation error
- `409 Conflict` - Email already exists
- `500 Internal Server Error` - Server error

---

### 2. Login User

Authenticates user and returns JWT token. Grants daily login bonus if first login of the day.

**Endpoint:** `POST /api/auth/login`

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "coins": 310
  }
}
```

**Business Logic:**
- Checks if last login was on a different day
- If yes: Grants +10 coins daily bonus
- Updates `last_login_date` to current date
- Creates activity log: "Daily Login Bonus +10"
- **Protection:** Only one bonus per calendar day

**Status Codes:**
- `200 OK` - Login successful
- `400 Bad Request` - Missing email or password
- `401 Unauthorized` - Invalid credentials
- `500 Internal Server Error` - Server error

---

### 3. Get Current User

Retrieves current authenticated user's information.

**Endpoint:** `GET /api/auth/me`

**Authentication:** Required (Bearer token)

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response:**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "coins": 310
  }
}
```

**Status Codes:**
- `200 OK` - User retrieved successfully
- `401 Unauthorized` - Invalid or missing token
- `404 Not Found` - User not found
- `500 Internal Server Error` - Server error

---

## 📦 Models APIs

### 4. Upload Model

Uploads a 3D model with optional thumbnail. Deducts 25 coins from user's balance.

**Endpoint:** `POST /api/models/upload`

**Authentication:** Required (Bearer token)

**Content-Type:** `multipart/form-data`

**Form Fields:**
- `title` (required) - Model title
- `description` (optional) - Model description
- `modelFile` (required) - .glb or .gltf file (max 50MB)
- `thumbnail` (optional) - Image file (jpg, png, webp)

**Example Request (using FormData):**
```javascript
const formData = new FormData()
formData.append('title', 'Industrial Robot Arm')
formData.append('description', '6-axis robotic arm for manufacturing')
formData.append('modelFile', glbFile) // File object
formData.append('thumbnail', thumbnailFile) // File object

fetch('http://localhost:4000/api/models/upload', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token
  },
  body: formData
})
```

**Success Response:**
```json
{
  "success": true,
  "message": "Model uploaded successfully",
  "data": {
    "modelId": 5,
    "title": "Industrial Robot Arm",
    "modelFile": "/uploads/models/uuid-here.glb",
    "thumbnail": "/uploads/thumbnails/uuid-here.jpg",
    "coinsDeducted": 25,
    "newBalance": 285
  }
}
```

**Business Logic:**
- Validates user has at least 25 coins
- Saves files with UUID filenames
- Deducts 25 coins from balance
- Creates activity log: "Model Upload -25"
- Updates balance atomically (in transaction)

**Status Codes:**
- `201 Created` - Model uploaded successfully
- `400 Bad Request` - Validation error (missing title/file)
- `401 Unauthorized` - Not authenticated
- `402 Payment Required` - Insufficient coins
- `500 Internal Server Error` - Server error

**File Validation:**
- Model file: Required, .glb or .gltf only, max 50MB
- Thumbnail: Optional, jpg/png/webp, max 10MB

---

### 5. Get All Models

Retrieves all public models or user's models (with filter).

**Endpoint:** `GET /api/models`

**Authentication:** Optional (required for `filter=my-models`)

**Query Parameters:**
- `filter` (optional) - Values: `my-models`

**Examples:**

**Get all public models:**
```
GET /api/models
```

**Get current user's models:**
```
GET /api/models?filter=my-models
Headers: Authorization: Bearer <token>
```

**Success Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "CMM Machine",
      "description": "Coordinate measuring machine",
      "model_file": "/uploads/models/uuid-1.glb",
      "thumbnail": "/uploads/thumbnails/uuid-1.jpg",
      "uploaded_by": 1,
      "uploader_name": "John Doe",
      "downloads": 45,
      "views": 234,
      "created_at": "2026-07-24T12:00:00.000Z"
    },
    {
      "id": 2,
      "title": "Hydraulic Press",
      "description": "Heavy duty press unit",
      "model_file": "/uploads/models/uuid-2.glb",
      "thumbnail": null,
      "uploaded_by": 2,
      "uploader_name": "Jane Smith",
      "downloads": 12,
      "views": 89,
      "created_at": "2026-07-23T10:30:00.000Z"
    }
  ]
}
```

**Status Codes:**
- `200 OK` - Models retrieved successfully
- `401 Unauthorized` - Invalid token (only for `filter=my-models`)
- `500 Internal Server Error` - Server error

---

### 6. Get Single Model

Retrieves details of a specific model and increments view count.

**Endpoint:** `GET /api/models/:id`

**Authentication:** Not required

**URL Parameters:**
- `id` - Model ID (integer)

**Example:**
```
GET /api/models/5
```

**Success Response:**
```json
{
  "success": true,
  "data": {
    "id": 5,
    "title": "Industrial Robot Arm",
    "description": "6-axis robotic arm for manufacturing",
    "model_file": "/uploads/models/uuid-5.glb",
    "thumbnail": "/uploads/thumbnails/uuid-5.jpg",
    "uploaded_by": 1,
    "uploader_name": "John Doe",
    "downloads": 10,
    "views": 51,
    "created_at": "2026-07-24T12:00:00.000Z"
  }
}
```

**Business Logic:**
- Automatically increments `views` count by 1
- Joins with users table to get uploader name

**Status Codes:**
- `200 OK` - Model retrieved successfully
- `404 Not Found` - Model not found
- `500 Internal Server Error` - Server error

---

### 7. Delete Model

Deletes a model (owner only). Removes files from server.

**Endpoint:** `DELETE /api/models/:id`

**Authentication:** Required (Bearer token)

**URL Parameters:**
- `id` - Model ID (integer)

**Example:**
```
DELETE /api/models/5
Headers: Authorization: Bearer <token>
```

**Success Response:**
```json
{
  "success": true,
  "message": "Model deleted"
}
```

**Business Logic:**
- Verifies user is the model owner
- Deletes model file from disk
- Deletes thumbnail file from disk
- Removes database record

**Status Codes:**
- `200 OK` - Model deleted successfully
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - User is not the owner
- `404 Not Found` - Model not found
- `500 Internal Server Error` - Server error

---

## 📊 Dashboard APIs

### 8. Get Dashboard Data

Retrieves user's coin balance, rewards info, and recent activities.

**Endpoint:** `GET /api/dashboard`

**Authentication:** Required (Bearer token)

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response:**
```json
{
  "success": true,
  "data": {
    "balance": 285,
    "rewards": [
      {
        "title": "Signup Bonus",
        "amount": 100,
        "type": "signup"
      },
      {
        "title": "Daily Login",
        "amount": 10,
        "type": "daily_login"
      },
      {
        "title": "Per Upload",
        "amount": -25,
        "type": "upload"
      }
    ],
    "recentActivities": [
      {
        "id": 3,
        "type": "upload",
        "title": "Model Upload",
        "amount": -25,
        "description": "Uploaded: Industrial Robot Arm",
        "created_at": "2026-07-24T12:00:00.000Z"
      },
      {
        "id": 2,
        "type": "daily_login",
        "title": "Daily Login Bonus",
        "amount": 10,
        "description": "Daily login reward",
        "created_at": "2026-07-24T08:00:00.000Z"
      },
      {
        "id": 1,
        "type": "signup",
        "title": "Signup Bonus",
        "amount": 100,
        "description": "Welcome to SACK3D!",
        "created_at": "2026-07-23T15:30:00.000Z"
      }
    ]
  }
}
```

**Response Fields:**
- `balance` - Current coin balance
- `rewards` - Array of reward types and amounts
- `recentActivities` - Last 10 activities, newest first

**Status Codes:**
- `200 OK` - Dashboard data retrieved successfully
- `401 Unauthorized` - Invalid token
- `500 Internal Server Error` - Server error

---

## 📝 Activity APIs

### 9. Get User Activities

Retrieves all activities for the current user.

**Endpoint:** `GET /api/activity`

**Authentication:** Required (Bearer token)

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 3,
      "user_id": 1,
      "type": "upload",
      "title": "Model Upload",
      "amount": -25,
      "description": "Uploaded: Industrial Robot Arm",
      "created_at": "2026-07-24T12:00:00.000Z"
    },
    {
      "id": 2,
      "user_id": 1,
      "type": "daily_login",
      "title": "Daily Login Bonus",
      "amount": 10,
      "description": "Daily login reward",
      "created_at": "2026-07-24T08:00:00.000Z"
    }
  ]
}
```

**Activity Types:**
- `signup` - Signup bonus (+100 coins)
- `daily_login` - Daily login bonus (+10 coins)
- `upload` - Model upload (-25 coins)

**Status Codes:**
- `200 OK` - Activities retrieved successfully
- `401 Unauthorized` - Invalid token
- `500 Internal Server Error` - Server error

---

## ❤️ Health Check

### 10. Server Health Check

Checks if the API server is running.

**Endpoint:** `GET /api/health`

**Authentication:** Not required

**Example:**
```
GET /api/health
```

**Success Response:**
```json
{
  "success": true,
  "status": "ok"
}
```

**Status Codes:**
- `200 OK` - Server is healthy

---

## ⚠️ Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description here"
}
```

Or with additional error field:

```json
{
  "error": "Error description here"
}
```

### Common Error Codes:

| Code | Meaning | Example |
|------|---------|---------|
| 400 | Bad Request | Missing required field, invalid format |
| 401 | Unauthorized | Invalid or missing token |
| 402 | Payment Required | Insufficient coins |
| 403 | Forbidden | Not authorized (e.g., deleting other's model) |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Email already exists |
| 500 | Internal Server Error | Database error, server crash |

---

## 🔐 Authentication

### JWT Token

All protected endpoints require a JWT token in the Authorization header.

**Header Format:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Token Payload:**
```json
{
  "id": 1,
  "email": "john@example.com",
  "name": "John Doe",
  "coins": 310,
  "iat": 1721817600,
  "exp": 1722422400
}
```

**Token Expiration:** 7 days (default)

**How to Get Token:**
1. Use `/api/auth/signup` or `/api/auth/login`
2. Extract `token` from response
3. Store in localStorage or cookie
4. Include in all subsequent requests

---

## 📡 Example Usage

### JavaScript/Axios Example:

```javascript
import axios from 'axios'

const API = 'http://localhost:4000/api'

// 1. Signup
const signup = async (name, email, password) => {
  const response = await axios.post(`${API}/auth/signup`, {
    name, email, password
  })
  const { token, user } = response.data
  localStorage.setItem('token', token)
  return user
}

// 2. Get all models
const getModels = async () => {
  const response = await axios.get(`${API}/models`)
  return response.data.data
}

// 3. Upload model (authenticated)
const uploadModel = async (formData) => {
  const token = localStorage.getItem('token')
  const response = await axios.post(
    `${API}/models/upload`,
    formData,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    }
  )
  return response.data
}

// 4. Get dashboard
const getDashboard = async () => {
  const token = localStorage.getItem('token')
  const response = await axios.get(`${API}/dashboard`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return response.data.data
}
```

### Fetch API Example:

```javascript
// Login
const login = async (email, password) => {
  const response = await fetch('http://localhost:4000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  const data = await response.json()
  return data
}

// Get model by ID
const getModel = async (id) => {
  const response = await fetch(`http://localhost:4000/api/models/${id}`)
  const data = await response.json()
  return data.data
}
```

---

## 🔄 Request/Response Flow

### Typical User Flow:

```
1. User Signup
   POST /api/auth/signup
   → Receives 300 coins (200 + 100 bonus)
   → Gets JWT token

2. User Login (next day)
   POST /api/auth/login
   → Receives +10 daily bonus
   → Gets fresh JWT token

3. View Dashboard
   GET /api/dashboard
   → Shows balance: 310 coins
   → Shows activities

4. Browse Gallery
   GET /api/models
   → Shows all models

5. Upload Model
   POST /api/models/upload
   → Deducts 25 coins
   → Balance: 285 coins

6. View Model Detail
   GET /api/models/5
   → Shows 3D viewer
   → Increments view count

7. Check Dashboard
   GET /api/dashboard
   → Shows updated balance: 285
   → Shows upload activity
```

---

## 🛡️ Security Features

1. **JWT Authentication** - Secure token-based auth
2. **bcrypt Password Hashing** - 12 rounds
3. **Rate Limiting** - 100 requests per 15 minutes
4. **CORS Protection** - Configured origins
5. **Helmet Security Headers** - XSS, CSRF protection
6. **Input Validation** - All inputs validated
7. **SQL Injection Prevention** - Parameterized queries
8. **File Type Validation** - Only allowed formats
9. **File Size Limits** - Max 50MB for models

---

## 📚 Database Tables Used

### users
- Stores user accounts
- Tracks coin balance
- Records last login date

### models
- Stores 3D model metadata
- Links to uploaded files
- Tracks downloads/views

### activities
- Logs all coin transactions
- References user_id
- Stores activity type and amount

---

## 🚀 Production Considerations

When deploying to production:

1. **Environment Variables:**
   - Use `.env` for sensitive data
   - Change `JWT_SECRET` to strong random string
   - Update `DB_*` credentials

2. **CORS:**
   - Update allowed origins in `server/index.js`
   - Set production domain

3. **File Storage:**
   - Consider using S3 or CDN for uploads
   - Implement file cleanup for deleted models

4. **Rate Limiting:**
   - Adjust based on expected traffic
   - Consider Redis for distributed rate limiting

5. **Database:**
   - Use connection pooling
   - Add indexes for performance
   - Regular backups

---

**API Version:** 1.0.0  
**Last Updated:** July 24, 2026  
**Maintainer:** nikhiljha647  
**Repository:** https://github.com/nikhiljha647/SACK3D

---

**End of API Documentation**
