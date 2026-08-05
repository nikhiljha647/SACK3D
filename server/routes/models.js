// Routes: /api/models
const express    = require('express')
const router     = express.Router()
const requireAuth = require('../middleware/auth')
const { upload } = require('../middleware/upload')
const ctrl       = require('../controllers/modelsController')

// Middleware to optionally attach user if token exists
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return next()
  }
  requireAuth(req, res, next)
}

// Upload a model — protected, accepts modelFile + optional thumbnail
router.post(
  '/upload',
  requireAuth,
  upload.fields([
    { name: 'modelFile', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 },
  ]),
  ctrl.uploadModel
)

// List all models — public, but can filter with auth
router.get('/', optionalAuth, ctrl.getModels)

// Get single model — public
router.get('/:shareToken', ctrl.getModel)

// Delete model — protected
router.delete('/:shareToken', requireAuth, ctrl.deleteModel)

// Download model — protected
router.post('/:shareToken/download', requireAuth, ctrl.downloadModel)

// Download QR code — protected
router.post('/:shareToken/download-qr', requireAuth, ctrl.downloadQR)

// Toggle model visibility — protected
router.put('/:shareToken/visibility', requireAuth, ctrl.toggleVisibility)

module.exports = router
