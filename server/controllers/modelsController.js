// Controller: handles 3D model upload, listing, detail, and deletion
// Use PostgreSQL for production, MySQL for local
const dbFile = process.env.NODE_ENV === 'production' ? '../db-postgres.js' : '../db.js'
const pool = require(dbFile)

const isPostgres = process.env.NODE_ENV === 'production'
const { UPLOAD_COST }   = require('../middleware/upload')
const path              = require('path')
const fs                = require('fs')

// ── POST /api/models/upload ───────────────────────────────────────────────────
// Authenticated. Deducts coins, saves files, inserts model record.
exports.uploadModel = async (req, res) => {
  const { title, description } = req.body
  const userId = req.user.id

  // Validate title
  if (!title || !title.trim()) {
    return res.status(400).json({ success: false, message: 'Title is required' })
  }

  // Model file is required
  if (!req.files || !req.files.modelFile) {
    return res.status(400).json({ success: false, message: '3D model file is required' })
  }

  const modelFile    = req.files.modelFile[0]
  const thumbnailFile = req.files.thumbnail ? req.files.thumbnail[0] : null

  try {
    // Check user has enough coins
    let rows
    if (isPostgres) {
      const result = await pool.query('SELECT coins FROM users WHERE id = $1', [userId])
      rows = result.rows
    } else {
      [rows] = await pool.query('SELECT coins FROM users WHERE id = ?', [userId])
    }
    
    if (!rows.length) return res.status(404).json({ success: false, message: 'User not found' })

    const { coins } = rows[0]
    if (coins < UPLOAD_COST) {
      return res.status(402).json({
        success: false,
        message: `Insufficient coins. You need ${UPLOAD_COST} coins to upload.`,
      })
    }

    // Build file paths (relative URLs served statically)
    const modelPath     = `/uploads/models/${modelFile.filename}`
    const thumbnailPath = thumbnailFile ? `/uploads/thumbnails/${thumbnailFile.filename}` : null

    // Insert model record
    const isPrivate = req.body.isPrivate === 'true' || req.body.isPrivate === true
    const dbPrivateVal = isPrivate ? 1 : 0
    const crypto = require('crypto')
    const shareToken = crypto.randomBytes(16).toString('hex')

    let result
    if (isPostgres) {
      result = await pool.query(
        `INSERT INTO models (title, description, model_file, thumbnail, uploaded_by, is_private, share_token)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
        [title.trim(), description?.trim() || null, modelPath, thumbnailPath, userId, isPrivate, shareToken]
      )
    } else {
      [result] = await pool.query(
        `INSERT INTO models (title, description, model_file, thumbnail, uploaded_by, is_private, share_token)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [title.trim(), description?.trim() || null, modelPath, thumbnailPath, userId, dbPrivateVal, shareToken]
      )
    }

    const modelId = isPostgres ? result.rows[0].id : result.insertId

    // Deduct coins
    if (isPostgres) {
      await pool.query('UPDATE users SET coins = coins - $1 WHERE id = $2', [UPLOAD_COST, userId])
    } else {
      await pool.query('UPDATE users SET coins = coins - ? WHERE id = ?', [UPLOAD_COST, userId])
    }

    // Fetch updated balance
    let updated
    if (isPostgres) {
      const updateResult = await pool.query('SELECT coins FROM users WHERE id = $1', [userId])
      updated = updateResult.rows
    } else {
      [updated] = await pool.query('SELECT coins FROM users WHERE id = ?', [userId])
    }

    res.status(201).json({
      success: true,
      message: 'Model uploaded successfully',
      data: {
        modelId,
        title: title.trim(),
        modelFile: modelPath,
        thumbnail: thumbnailPath,
        coinsDeducted: UPLOAD_COST,
        newBalance: updated[0].coins,
      },
    })
  } catch (err) {
    console.error('Upload error:', err)
    res.status(500).json({ success: false, message: 'Server error during upload' })
  }
}

// ── GET /api/models ───────────────────────────────────────────────────────────
// Public or filtered. Returns all models or user's models based on query param.
exports.getModels = async (req, res) => {
  try {
    const { filter } = req.query
    
    // If filter=my-models, require authentication and return only user's models
    if (filter === 'my-models') {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ success: false, message: 'Authentication required' })
      }
      
      let models
      if (isPostgres) {
        const result = await pool.query(
          `SELECT m.*, u.name AS uploader_name
           FROM models m
           JOIN users u ON m.uploaded_by = u.id
           WHERE m.uploaded_by = $1
           ORDER BY m.created_at DESC`,
          [req.user.id]
        )
        models = result.rows
      } else {
        [models] = await pool.query(
          `SELECT m.*, u.name AS uploader_name
           FROM models m
           JOIN users u ON m.uploaded_by = u.id
           WHERE m.uploaded_by = ?
           ORDER BY m.created_at DESC`,
          [req.user.id]
        )
      }
      return res.json({ success: true, data: models })
    }
    
    // Default: return all models or only curated models based on auth/filter
    const isCuratedOnly = !req.user || filter === 'curated'

    let models
    if (isCuratedOnly) {
      if (isPostgres) {
        const result = await pool.query(
          `SELECT m.*, u.name AS uploader_name
           FROM models m
           JOIN users u ON m.uploaded_by = u.id
           WHERE m.is_curated = TRUE AND m.is_private = FALSE
           ORDER BY m.created_at DESC`
        )
        models = result.rows
      } else {
        [models] = await pool.query(
          `SELECT m.*, u.name AS uploader_name
           FROM models m
           JOIN users u ON m.uploaded_by = u.id
           WHERE m.is_curated = 1 AND m.is_private = 0
           ORDER BY m.created_at DESC`
        )
      }
    } else {
      if (isPostgres) {
        const result = await pool.query(
          `SELECT m.*, u.name AS uploader_name
           FROM models m
           JOIN users u ON m.uploaded_by = u.id
           WHERE m.is_private = FALSE
           ORDER BY m.created_at DESC`
        )
        models = result.rows
      } else {
        [models] = await pool.query(
          `SELECT m.*, u.name AS uploader_name
           FROM models m
           JOIN users u ON m.uploaded_by = u.id
           WHERE m.is_private = 0
           ORDER BY m.created_at DESC`
        )
      }
    }
    res.json({ success: true, data: models })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// ── GET /api/models/:shareToken ───────────────────────────────────────────────
// Public. Returns a single model and increments view count.
exports.getModel = async (req, res) => {
  const { shareToken } = req.params
  try {
    // Increment view count
    if (isPostgres) {
      await pool.query('UPDATE models SET views = views + 1 WHERE share_token = $1', [shareToken])
    } else {
      await pool.query('UPDATE models SET views = views + 1 WHERE share_token = ?', [shareToken])
    }
    
    // Fetch model
    let rows
    if (isPostgres) {
      const result = await pool.query(
        `SELECT m.*, u.name AS uploader_name
         FROM models m
         JOIN users u ON m.uploaded_by = u.id
         WHERE m.share_token = $1`,
        [shareToken]
      )
      rows = result.rows
    } else {
      [rows] = await pool.query(
        `SELECT m.*, u.name AS uploader_name
         FROM models m
         JOIN users u ON m.uploaded_by = u.id
         WHERE m.share_token = ?`,
        [shareToken]
      )
    }
    
    if (!rows.length) return res.status(404).json({ success: false, message: 'Model not found' })
    res.json({ success: true, data: rows[0] })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// ── DELETE /api/models/:shareToken ────────────────────────────────────────────
// Authenticated. Only the uploader can delete their model.
exports.deleteModel = async (req, res) => {
  const { shareToken } = req.params
  const userId = req.user.id

  try {
    let rows
    if (isPostgres) {
      const result = await pool.query('SELECT * FROM models WHERE share_token = $1', [shareToken])
      rows = result.rows
    } else {
      [rows] = await pool.query('SELECT * FROM models WHERE share_token = ?', [shareToken])
    }
    
    if (!rows.length) return res.status(404).json({ success: false, message: 'Model not found' })

    const model = rows[0]
    if (model.uploaded_by !== userId) {
      return res.status(403).json({ success: false, message: 'Not authorised to delete this model' })
    }

    // Remove files from disk
    const deleteFile = (filePath) => {
      if (!filePath) return
      const abs = path.join(__dirname, '..', filePath)
      if (fs.existsSync(abs)) fs.unlinkSync(abs)
    }
    deleteFile(model.model_file)
    deleteFile(model.thumbnail)

    if (isPostgres) {
      await pool.query('DELETE FROM models WHERE share_token = $1', [shareToken])
    } else {
      await pool.query('DELETE FROM models WHERE share_token = ?', [shareToken])
    }
    
    res.json({ success: true, message: 'Model deleted' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// ── POST /api/models/:shareToken/download ─────────────────────────────────────
// Authenticated. Deducts 10 coins (waived if owner). Logs activity and increments download count.
exports.downloadModel = async (req, res) => {
  const { shareToken } = req.params
  const userId = req.user.id

  try {
    // 1. Fetch the model
    let rows
    if (isPostgres) {
      const result = await pool.query('SELECT * FROM models WHERE share_token = $1', [shareToken])
      rows = result.rows
    } else {
      [rows] = await pool.query('SELECT * FROM models WHERE share_token = ?', [shareToken])
    }

    if (!rows.length) return res.status(404).json({ success: false, message: 'Model not found' })
    const model = rows[0]

    // 2. Determine cost: 10 coins, waived (0) if owner
    const isOwner = Number(model.uploaded_by) === Number(userId)
    const cost = isOwner ? 0 : 10

    // 3. If cost > 0, check user's coin balance
    let userCoins = 0
    if (cost > 0) {
      let uRows
      if (isPostgres) {
        const uResult = await pool.query('SELECT coins FROM users WHERE id = $1', [userId])
        uRows = uResult.rows
      } else {
        [uRows] = await pool.query('SELECT coins FROM users WHERE id = ?', [userId])
      }
      
      if (!uRows.length) return res.status(404).json({ success: false, message: 'User not found' })
      userCoins = uRows[0].coins

      if (userCoins < cost) {
        return res.status(402).json({
          success: false,
          message: `Insufficient coins. You need ${cost} coins to download this model.`,
        })
      }
    }

    // 4. Deduct coins and log activity (using transactional helper if cost > 0)
    let newBalance = userCoins
    if (cost > 0) {
      const { createActivityHelper } = require('./activityController')
      newBalance = await createActivityHelper(
        userId,
        'download',
        `Downloaded model: ${model.title}`,
        -cost,
        `Model ID: ${model.id}`
      )
    }

    // 5. Increment model downloads counter
    if (isPostgres) {
      await pool.query('UPDATE models SET downloads = downloads + 1 WHERE share_token = $1', [shareToken])
    } else {
      await pool.query('UPDATE models SET downloads = downloads + 1 WHERE share_token = ?', [shareToken])
    }

    return res.json({
      success: true,
      message: 'Download authorized successfully',
      data: {
        newBalance,
        cost,
        fileUrl: model.model_file
      }
    })
  } catch (err) {
    console.error('Download model error:', err)
    return res.status(500).json({ success: false, message: 'Server error' })
  }
}

// ── POST /api/models/:shareToken/download-qr ──────────────────────────────────
// Authenticated. Deducts 5 coins (waived if owner). Logs activity and increments download count.
exports.downloadQR = async (req, res) => {
  const { shareToken } = req.params
  const userId = req.user.id

  try {
    // 1. Fetch the model
    let rows
    if (isPostgres) {
      const result = await pool.query('SELECT * FROM models WHERE share_token = $1', [shareToken])
      rows = result.rows
    } else {
      [rows] = await pool.query('SELECT * FROM models WHERE share_token = ?', [shareToken])
    }

    if (!rows.length) return res.status(404).json({ success: false, message: 'Model not found' })
    const model = rows[0]

    // 2. Determine cost: 5 coins, waived (0) if owner
    const isOwner = Number(model.uploaded_by) === Number(userId)
    const cost = isOwner ? 0 : 5

    // 3. If cost > 0, check user's coin balance
    let userCoins = 0
    if (cost > 0) {
      let uRows
      if (isPostgres) {
        const uResult = await pool.query('SELECT coins FROM users WHERE id = $1', [userId])
        uRows = uResult.rows
      } else {
        [uRows] = await pool.query('SELECT coins FROM users WHERE id = ?', [userId])
      }
      
      if (!uRows.length) return res.status(404).json({ success: false, message: 'User not found' })
      userCoins = uRows[0].coins

      if (userCoins < cost) {
        return res.status(402).json({
          success: false,
          message: `Insufficient coins. You need ${cost} coins to download this QR code.`,
        })
      }
    }

    // 4. Deduct coins and log activity (using transactional helper if cost > 0)
    let newBalance = userCoins
    if (cost > 0) {
      const { createActivityHelper } = require('./activityController')
      newBalance = await createActivityHelper(
        userId,
        'download_qr',
        `Downloaded QR: ${model.title}`,
        -cost,
        `Model ID: ${model.id}`
      )
    }

    return res.json({
      success: true,
      message: 'QR Download authorized successfully',
      data: {
        newBalance,
        cost
      }
    })
  } catch (err) {
    console.error('Download QR error:', err)
    return res.status(500).json({ success: false, message: 'Server error' })
  }
}

// ── PUT /api/models/:shareToken/visibility ──────────────────────────────────
// Protected. Allows the owner of the model to toggle its privacy/visibility.
exports.toggleVisibility = async (req, res) => {
  const { shareToken } = req.params
  const { isPrivate } = req.body
  const userId = req.user.id

  if (isPrivate === undefined) {
    return res.status(400).json({ success: false, message: 'isPrivate state is required' })
  }

  try {
    const val = isPrivate ? 1 : 0
    
    // Check if model exists and is owned by the user
    let rows
    if (isPostgres) {
      const checkRes = await pool.query('SELECT uploaded_by FROM models WHERE share_token = $1', [shareToken])
      rows = checkRes.rows
    } else {
      [rows] = await pool.query('SELECT uploaded_by FROM models WHERE share_token = ?', [shareToken])
    }

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Model not found' })
    }

    const model = rows[0]
    if (model.uploaded_by !== userId) {
      return res.status(403).json({ success: false, message: 'Access denied: You do not own this model' })
    }

    // Update visibility
    if (isPostgres) {
      await pool.query('UPDATE models SET is_private = $1 WHERE share_token = $2', [isPrivate, shareToken])
    } else {
      await pool.query('UPDATE models SET is_private = ? WHERE share_token = ?', [val, shareToken])
    }

    res.json({
      success: true,
      message: `Model visibility successfully updated to: ${isPrivate ? 'Link-only' : 'Public'}`
    })
  } catch (err) {
    console.error('Toggle visibility error:', err)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}
