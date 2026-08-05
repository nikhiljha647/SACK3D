const path         = require('path')
require('dotenv').config({ path: path.join(__dirname, '.env') })

const express      = require('express')
const cors         = require('cors')
const helmet       = require('helmet')
const rateLimit    = require('express-rate-limit')
const compression  = require('compression')

// Use PostgreSQL for production (Render), MySQL for local development
const dbFile = process.env.NODE_ENV === 'production' ? './db-postgres.js' : './db.js'
console.log(`🗄️  Using database: ${dbFile}`)

const authRoutes   = require('./routes/auth')
const modelRoutes  = require('./routes/models')

const app  = express()
const PORT = process.env.PORT || 4000

// ── Compression ───────────────────────────────────────────────────────────────
app.use(compression())

// ── Security headers ──────────────────────────────────────────────────────────
app.use(helmet({ 
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  crossOriginEmbedderPolicy: false
}))

// ── Rate limiting — 100 requests per 15 min per IP ────────────────────────────
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }))

// ── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'https://sack3d-frontend.onrender.com',
  'https://sack3d.onrender.com'
]

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, curl, etc.)
    if (!origin) return callback(null, true)
    
    // In development, allow all localhost origins
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true)
    }
    
    // In production, check allowed origins
    if (allowedOrigins.includes(origin)) {
      return callback(null, true)
    }
    
    console.log(`❌ CORS blocked: ${origin}`)
    return callback(new Error('Not allowed by CORS'))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// ── Body parsing ──────────────────────────────────────────────────────────────
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ── Static file serving for uploaded assets ───────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

const dashboardRoutes = require('./routes/dashboard')
const activityRoutes  = require('./routes/activity')
const adminRoutes     = require('./routes/admin')

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth',      authRoutes)
app.use('/api/models',    modelRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/activity',  activityRoutes)
app.use('/api/admin',     adminRoutes)

app.get('/api/health', (_req, res) => res.json({ success: true, status: 'ok' }))

// ── Root route ────────────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({ 
    success: true, 
    message: 'SACK3D API is running', 
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      models: '/api/models',
      dashboard: '/api/dashboard',
      activity: '/api/activity'
    }
  })
})

// ── Centralised error handler ─────────────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error(err)
  const status  = err.status || 500
  const message = err.message || 'Internal server error'
  res.status(status).json({ success: false, message })
})

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀  SACK3D API running on http://localhost:${PORT}`)
})
