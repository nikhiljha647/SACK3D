// Use PostgreSQL for production, MySQL for local
const dbFile = process.env.NODE_ENV === 'production' ? '../db-postgres.js' : '../db.js'
const pool = require(dbFile)

const isPostgres = process.env.NODE_ENV === 'production'

// Helper: insert an activity record and update user coins atomically
async function createActivity(userId, type, title, amount, description = '') {
  if (isPostgres) {
    // PostgreSQL transaction
    const client = await pool.connect()
    try {
      await client.query('BEGIN')
      await client.query(
        'UPDATE users SET coins = coins + $1 WHERE id = $2',
        [amount, userId]
      )
      await client.query(
        'INSERT INTO activities (user_id, type, title, amount, description) VALUES ($1, $2, $3, $4, $5)',
        [userId, type, title, amount, description || '']
      )
      await client.query('COMMIT')
      const result = await client.query('SELECT coins FROM users WHERE id = $1', [userId])
      return result.rows[0].coins
    } catch (e) {
      await client.query('ROLLBACK')
      throw e
    } finally {
      client.release()
    }
  } else {
    // MySQL transaction
    const conn = await pool.getConnection()
    try {
      await conn.beginTransaction()
      await conn.query(
        'UPDATE users SET coins = coins + ? WHERE id = ?',
        [amount, userId]
      )
      await conn.query(
        'INSERT INTO activities (user_id, type, title, amount, description) VALUES (?, ?, ?, ?, ?)',
        [userId, type, title, amount, description || '']
      )
      await conn.commit()
      const [[user]] = await conn.query('SELECT coins FROM users WHERE id = ?', [userId])
      return user.coins
    } catch (e) {
      await conn.rollback()
      throw e
    } finally {
      conn.release()
    }
  }
}

// GET /api/dashboard — returns balance, reward info, recent activities
exports.getDashboard = async (req, res) => {
  const userId = req.user.id
  try {
    let user, activities
    
    if (isPostgres) {
      const userResult = await pool.query('SELECT id, name, email, coins, last_login_date FROM users WHERE id = $1', [userId])
      user = userResult.rows[0]
      if (!user) return res.status(404).json({ success: false, message: 'User not found' })
      
      const activitiesResult = await pool.query(
        'SELECT * FROM activities WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50',
        [userId]
      )
      activities = activitiesResult.rows
    } else {
      const [userRows] = await pool.query('SELECT id, name, email, coins, last_login_date FROM users WHERE id = ?', [userId])
      user = userRows[0]
      if (!user) return res.status(404).json({ success: false, message: 'User not found' })
      
      [activities] = await pool.query(
        'SELECT * FROM activities WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
        [userId]
      )
    }

    res.json({
      success: true,
      data: {
        balance: user.coins,
        rewards: [
          { title: 'Signup bonus', amount: 100, type: 'signup' },
          { title: 'Daily login', amount: 10, type: 'daily_login' },
          { title: 'Per upload', amount: -25, type: 'upload' },
        ],
        recentActivities: activities,
      }
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// GET /api/activity — all activities for user
exports.getActivities = async (req, res) => {
  const userId = req.user.id
  try {
    let activities
    
    if (isPostgres) {
      const result = await pool.query(
        'SELECT * FROM activities WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
      )
      activities = result.rows
    } else {
      [activities] = await pool.query(
        'SELECT * FROM activities WHERE user_id = ? ORDER BY created_at DESC',
        [userId]
      )
    }
    
    res.json({ success: true, data: activities })
  } catch (e) {
    console.error(e)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

module.exports.createActivityHelper = createActivity
