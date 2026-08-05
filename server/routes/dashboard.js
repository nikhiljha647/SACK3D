const express = require('express')
const router = express.Router()
const requireAuth = require('../middleware/auth')
const { getDashboard } = require('../controllers/activityController')

// GET /api/dashboard — protected
router.get('/', requireAuth, getDashboard)

module.exports = router
