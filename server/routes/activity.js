const express = require('express')
const router = express.Router()
const requireAuth = require('../middleware/auth')
const { getActivities } = require('../controllers/activityController')

router.get('/', requireAuth, getActivities)

module.exports = router
