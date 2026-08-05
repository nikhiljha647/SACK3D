const express  = require('express')
const bcrypt   = require('bcryptjs')
const jwt      = require('jsonwebtoken')

// Use PostgreSQL for production, MySQL for local
const dbFile = process.env.NODE_ENV === 'production' ? '../db-postgres.js' : '../db.js'
const pool = require(dbFile)

const router = express.Router()

// ── helpers ──────────────────────────────────────────────────────────────────

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name, coins: user.coins ?? 0, role: user.role || 'user' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )
}

// ── POST /api/auth/signup ─────────────────────────────────────────────────────

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password)
    return res.status(400).json({ error: 'name, email and password are required' })

  if (password.length < 8)
    return res.status(400).json({ error: 'Password must be at least 8 characters' })

  try {
    const isPostgres = process.env.NODE_ENV === 'production'
    
    let rows
    if (isPostgres) {
      const result = await pool.query('SELECT id FROM users WHERE email = $1', [email])
      rows = result.rows
    } else {
      [rows] = await pool.query('SELECT id FROM users WHERE email = ?', [email])
    }
    
    if (rows.length > 0)
      return res.status(409).json({ error: 'Email already registered' })

    const hash = await bcrypt.hash(password, 12)
    
    let result
    if (isPostgres) {
      result = await pool.query(
        'INSERT INTO users (name, email, password, coins) VALUES ($1, $2, $3, 100) RETURNING id',
        [name.trim(), email.toLowerCase().trim(), hash]
      )
    } else {
      [result] = await pool.query(
        'INSERT INTO users (name, email, password, coins) VALUES (?, ?, ?, 100)',
        [name.trim(), email.toLowerCase().trim(), hash]
      )
    }

    const userId = isPostgres ? result.rows[0].id : result.insertId

    // Grant signup bonus
    try {
      const { createActivityHelper } = require('../controllers/activityController')
      await createActivityHelper(userId, 'signup', 'Signup Bonus', 100, 'Welcome to SACK3D!')
    } catch(e) { console.error('Activity error:', e.message) }

    const user = { id: userId, email, name, role: 'user' }
    return res.status(201).json({
      token: signToken(user),
      user:  { id: user.id, name, email, coins: 100, role: 'user' },
    })
  } catch (err) {
    console.error('Signup error:', err)
    return res.status(500).json({ error: 'Server error' })
  }
})

// ── POST /api/auth/login ──────────────────────────────────────────────────────

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password)
    return res.status(400).json({ error: 'email and password are required' })

  try {
    const isPostgres = process.env.NODE_ENV === 'production'
    
    let rows
    if (isPostgres) {
      const result = await pool.query(
        'SELECT id, name, email, password, coins, role, last_login_date FROM users WHERE email = $1',
        [email.toLowerCase().trim()]
      )
      rows = result.rows
    } else {
      [rows] = await pool.query(
        'SELECT id, name, email, password, coins, role, last_login_date FROM users WHERE email = ?',
        [email.toLowerCase().trim()]
      )
    }
    
    if (rows.length === 0)
      return res.status(401).json({ error: 'Invalid email or password' })

    const user  = rows[0]
    const match = await bcrypt.compare(password, user.password)
    if (!match)
      return res.status(401).json({ error: 'Invalid email or password' })

    // Daily login bonus
    const today = new Date().toISOString().slice(0, 10)
    let lastLogin = null
    
    if (user.last_login_date) {
      const lastDate = new Date(user.last_login_date)
      lastLogin = lastDate.toISOString().slice(0, 10)
    }
    
    if (lastLogin !== today) {
      try {
        let existingBonus
        if (isPostgres) {
          const result = await pool.query(
            `SELECT id FROM activities 
             WHERE user_id = $1 AND type = 'daily_login' 
             AND DATE(created_at) = CURRENT_DATE
             LIMIT 1`,
            [user.id]
          )
          existingBonus = result.rows
        } else {
          [existingBonus] = await pool.query(
            `SELECT id FROM activities 
             WHERE user_id = ? AND type = 'daily_login' 
             AND DATE(created_at) = CURDATE()
             LIMIT 1`,
            [user.id]
          )
        }
        
        if (existingBonus.length === 0) {
          if (isPostgres) {
            await pool.query('UPDATE users SET last_login_date = NOW() WHERE id = $1', [user.id])
          } else {
            await pool.query('UPDATE users SET last_login_date = NOW() WHERE id = ?', [user.id])
          }
          
          const { createActivityHelper } = require('../controllers/activityController')
          await createActivityHelper(user.id, 'daily_login', 'Daily Login Bonus', 10, 'Daily login reward')
          user.coins = (user.coins || 0) + 10
        }
      } catch(e) { 
        console.error('Daily login activity error:', e.message) 
      }
    }

    return res.json({
      token: signToken(user),
      user:  { id: user.id, name: user.name, email: user.email, coins: user.coins, role: user.role },
    })
  } catch (err) {
    console.error('Login error:', err)
    return res.status(500).json({ error: 'Server error' })
  }
})

// ── GET /api/auth/me (protected) ─────────────────────────────────────────────

router.get('/me', async (req, res) => {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer '))
    return res.status(401).json({ error: 'No token provided' })

  const token = authHeader.split(' ')[1]
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)

    const isPostgres = process.env.NODE_ENV === 'production'
    
    let rows
    if (isPostgres) {
      const result = await pool.query(
        'SELECT id, name, email, coins, role FROM users WHERE id = $1',
        [payload.id]
      )
      rows = result.rows
    } else {
      [rows] = await pool.query(
        'SELECT id, name, email, coins, role FROM users WHERE id = ?',
        [payload.id]
      )
    }
    
    if (rows.length === 0)
      return res.status(404).json({ error: 'User not found' })

    const user = rows[0]
    return res.json({ user: { id: user.id, name: user.name, email: user.email, coins: user.coins, role: user.role } })
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
})

// ── POST /api/auth/forgot-password ───────────────────────────────────────────
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body
  if (!email) return res.status(400).json({ error: 'Email is required' })

  try {
    const isPostgres = process.env.NODE_ENV === 'production'
    
    let rows
    if (isPostgres) {
      const result = await pool.query('SELECT id, name FROM users WHERE email = $1', [email.toLowerCase().trim()])
      rows = result.rows
    } else {
      [rows] = await pool.query('SELECT id, name FROM users WHERE email = ?', [email.toLowerCase().trim()])
    }

    if (rows.length === 0) {
      return res.json({ 
        success: true, 
        message: 'If an account exists with that email, a password reset link has been generated.' 
      })
    }

    const user = rows[0]
    const crypto = require('crypto')
    const token = crypto.randomBytes(20).toString('hex')
    const tokenExpires = new Date(Date.now() + 3600000)

    if (isPostgres) {
      await pool.query(
        'UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE id = $3',
        [token, tokenExpires, user.id]
      )
    } else {
      await pool.query(
        'UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?',
        [token, tokenExpires, user.id]
      )
    }

    const resetLink = `http://localhost:5173/reset-password?token=${token}`
    console.log(`\n🔑 PASSWORD RESET FOR ${email}: ${resetLink}\n`)

    return res.json({ 
      success: true, 
      message: 'If an account exists with that email, a password reset link has been generated.',
      resetLink: process.env.NODE_ENV !== 'production' ? resetLink : undefined
    })
  } catch (err) {
    console.error('Forgot password error:', err)
    return res.status(500).json({ error: 'Server error' })
  }
})

// ── POST /api/auth/reset-password ────────────────────────────────────────────
router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body
  if (!token || !password) {
    return res.status(400).json({ error: 'Token and new password are required' })
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' })
  }

  try {
    const isPostgres = process.env.NODE_ENV === 'production'
    
    let rows
    if (isPostgres) {
      const result = await pool.query(
        'SELECT id FROM users WHERE reset_token = $1 AND reset_token_expires > NOW()',
        [token]
      )
      rows = result.rows
    } else {
      [rows] = await pool.query(
        'SELECT id FROM users WHERE reset_token = ? AND reset_token_expires > NOW()',
        [token]
      )
    }

    if (rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired password reset token' })
    }

    const user = rows[0]
    const hash = await bcrypt.hash(password, 12)

    if (isPostgres) {
      await pool.query(
        'UPDATE users SET password = $1, reset_token = NULL, reset_token_expires = NULL WHERE id = $2',
        [hash, user.id]
      )
    } else {
      await pool.query(
        'UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?',
        [hash, user.id]
      )
    }

    return res.json({ success: true, message: 'Your password has been reset successfully.' })
  } catch (err) {
    console.error('Reset password error:', err)
    return res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
