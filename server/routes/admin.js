const express      = require('express')
const router       = express.Router()
const requireAuth  = require('../middleware/auth')
const requireAdmin = require('../middleware/admin')
const path         = require('path')
const fs           = require('fs')

// Use PostgreSQL for production, MySQL for local
const dbFile = process.env.NODE_ENV === 'production' ? '../db-postgres.js' : '../db.js'
const pool = require(dbFile)
const isPostgres = process.env.NODE_ENV === 'production'

// All routes require authentication & admin role
router.use(requireAuth, requireAdmin)

// ── GET /api/admin/stats ──────────────────────────────────────────────────────
router.get('/stats', async (req, res) => {
  try {
    let usersCount, modelsCount, totalDownloads = 0, totalViews = 0, totalCoins = 0

    if (isPostgres) {
      const uCountRes = await pool.query('SELECT COUNT(*) FROM users')
      usersCount = parseInt(uCountRes.rows[0].count)

      const statsRes = await pool.query('SELECT SUM(downloads) as d, SUM(views) as v FROM models')
      totalDownloads = parseInt(statsRes.rows[0].d || 0)
      totalViews = parseInt(statsRes.rows[0].v || 0)

      const countRes = await pool.query('SELECT COUNT(*) FROM models')
      modelsCount = parseInt(countRes.rows[0].count)

      const coinsRes = await pool.query('SELECT SUM(coins) FROM users')
      totalCoins = parseInt(coinsRes.rows[0].sum || 0)
    } else {
      const [[uCountRow]] = await pool.query('SELECT COUNT(*) as count FROM users')
      usersCount = uCountRow.count

      const [[statsRow]] = await pool.query('SELECT COUNT(*) as count, SUM(downloads) as d, SUM(views) as v FROM models')
      modelsCount = statsRow.count
      totalDownloads = statsRow.d || 0
      totalViews = statsRow.v || 0

      const [[coinsRow]] = await pool.query('SELECT SUM(coins) as sum FROM users')
      totalCoins = coinsRow.sum || 0
    }

    res.json({
      success: true,
      data: {
        usersCount,
        modelsCount,
        totalDownloads,
        totalViews,
        totalCoins
      }
    })
  } catch (err) {
    console.error('Admin stats error:', err)
    res.status(500).json({ success: false, message: 'Server error fetching admin stats' })
  }
})

// ── GET /api/admin/users ──────────────────────────────────────────────────────
router.get('/users', async (req, res) => {
  try {
    let users
    if (isPostgres) {
      const result = await pool.query('SELECT id, name, email, coins, role, created_at FROM users ORDER BY created_at DESC')
      users = result.rows
    } else {
      [users] = await pool.query('SELECT id, name, email, coins, role, created_at FROM users ORDER BY created_at DESC')
    }
    res.json({ success: true, data: users })
  } catch (err) {
    console.error('Admin list users error:', err)
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

// ── PUT /api/admin/users/:id/coins ────────────────────────────────────────────
router.put('/users/:id/coins', async (req, res) => {
  const { id } = req.params
  const { coins } = req.body

  if (coins === undefined || isNaN(parseInt(coins))) {
    return res.status(400).json({ success: false, message: 'Invalid coins amount' })
  }

  try {
    if (isPostgres) {
      const userCheck = await pool.query('SELECT id, coins FROM users WHERE id = $1', [id])
      if (userCheck.rows.length === 0) return res.status(404).json({ success: false, message: 'User not found' })

      const diff = parseInt(coins) - userCheck.rows[0].coins

      // Log adjustment activity and update users table atomically in createActivityHelper
      const { createActivityHelper } = require('../controllers/activityController')
      await createActivityHelper(id, 'admin_adjust', `Coins adjusted by Admin`, diff, `Admin override`)
    } else {
      const [userRows] = await pool.query('SELECT id, coins FROM users WHERE id = ?', [id])
      if (userRows.length === 0) return res.status(404).json({ success: false, message: 'User not found' })

      const diff = parseInt(coins) - userRows[0].coins

      // Log adjustment activity and update users table atomically in createActivityHelper
      const { createActivityHelper } = require('../controllers/activityController')
      await createActivityHelper(id, 'admin_adjust', `Coins adjusted by Admin`, diff, `Admin override`)
    }

    res.json({ success: true, message: 'Coins balance updated successfully' })
  } catch (err) {
    console.error('Admin adjust coins error:', err)
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

// ── DELETE /api/admin/users/:id ───────────────────────────────────────────────
router.delete('/users/:id', async (req, res) => {
  const { id } = req.params

  try {
    let rows
    if (isPostgres) {
      const checkRes = await pool.query('SELECT role FROM users WHERE id = $1', [id])
      rows = checkRes.rows
    } else {
      [rows] = await pool.query('SELECT role FROM users WHERE id = ?', [id])
    }

    if (rows.length === 0) return res.status(404).json({ success: false, message: 'User not found' })
    if (rows[0].role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot delete admin users' })
    }

    // Delete user models files from disk first
    let userModels
    if (isPostgres) {
      const modelsRes = await pool.query('SELECT model_file, thumbnail FROM models WHERE uploaded_by = $1', [id])
      userModels = modelsRes.rows
    } else {
      [userModels] = await pool.query('SELECT model_file, thumbnail FROM models WHERE uploaded_by = ?', [id])
    }

    const deleteFile = (filePath) => {
      if (!filePath) return
      const abs = path.join(__dirname, '..', filePath)
      if (fs.existsSync(abs)) fs.unlinkSync(abs)
    }

    for (const m of userModels) {
      deleteFile(m.model_file)
      deleteFile(m.thumbnail)
    }

    if (isPostgres) {
      await pool.query('DELETE FROM users WHERE id = $1', [id])
    } else {
      await pool.query('DELETE FROM users WHERE id = ?', [id])
    }

    res.json({ success: true, message: 'User and all associated assets deleted successfully' })
  } catch (err) {
    console.error('Admin delete user error:', err)
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

// ── GET /api/admin/models ─────────────────────────────────────────────────────
router.get('/models', async (req, res) => {
  try {
    let models
    if (isPostgres) {
      const result = await pool.query(`
        SELECT m.*, u.name as uploader_name, u.email as uploader_email
        FROM models m
        JOIN users u ON m.uploaded_by = u.id
        ORDER BY m.created_at DESC
      `)
      models = result.rows
    } else {
      [models] = await pool.query(`
        SELECT m.*, u.name as uploader_name, u.email as uploader_email
        FROM models m
        JOIN users u ON m.uploaded_by = u.id
        ORDER BY m.created_at DESC
      `)
    }
    res.json({ success: true, data: models })
  } catch (err) {
    console.error('Admin list models error:', err)
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

// ── DELETE /api/admin/models/:id ──────────────────────────────────────────────
router.delete('/models/:id', async (req, res) => {
  const { id } = req.params

  try {
    let rows
    if (isPostgres) {
      const result = await pool.query('SELECT * FROM models WHERE id = $1', [id])
      rows = result.rows
    } else {
      [rows] = await pool.query('SELECT * FROM models WHERE id = ?', [id])
    }

    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Model not found' })
    const model = rows[0]

    // Delete files
    const deleteFile = (filePath) => {
      if (!filePath) return
      const abs = path.join(__dirname, '..', filePath)
      if (fs.existsSync(abs)) fs.unlinkSync(abs)
    }
    deleteFile(model.model_file)
    deleteFile(model.thumbnail)

    // Delete DB record
    if (isPostgres) {
      await pool.query('DELETE FROM models WHERE id = $1', [id])
    } else {
      await pool.query('DELETE FROM models WHERE id = ?', [id])
    }

    res.json({ success: true, message: 'Model deleted successfully by Administrator' })
  } catch (err) {
    console.error('Admin delete model error:', err)
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

// ── PUT /api/admin/models/:id/curate ──────────────────────────────────────────
router.put('/models/:id/curate', async (req, res) => {
  const { id } = req.params
  const { isCurated } = req.body

  if (isCurated === undefined) {
    return res.status(400).json({ success: false, message: 'isCurated state is required' })
  }

  try {
    const val = isCurated ? 1 : 0
    
    // Check model exists
    let rows
    if (isPostgres) {
      const checkRes = await pool.query('SELECT id FROM models WHERE id = $1', [id])
      rows = checkRes.rows
    } else {
      [rows] = await pool.query('SELECT id FROM models WHERE id = ?', [id])
    }

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Model not found' })
    }

    if (isPostgres) {
      await pool.query('UPDATE models SET is_curated = $1 WHERE id = $2', [isCurated, id])
    } else {
      await pool.query('UPDATE models SET is_curated = ? WHERE id = ?', [val, id])
    }

    res.json({ 
      success: true, 
      message: `Model curation state successfully updated to: ${isCurated ? 'Featured' : 'Not Featured'}` 
    })
  } catch (err) {
    console.error('Admin curate model error:', err)
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

module.exports = router
