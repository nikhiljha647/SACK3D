// Middleware: Multer configuration for 3D model and thumbnail uploads
const multer = require('multer')
const path   = require('path')
const { v4: uuidv4 } = require('uuid')

const UPLOAD_COST = 25          // coins deducted per upload
const MAX_SIZE_MB  = 50

// Storage: save files with uuid filenames to preserve originals
const storage = multer.diskStorage({
  destination(req, file, cb) {
    if (file.fieldname === 'modelFile') {
      cb(null, path.join(__dirname, '../uploads/models'))
    } else {
      cb(null, path.join(__dirname, '../uploads/thumbnails'))
    }
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase()
    cb(null, uuidv4() + ext)
  },
})

// File filter: only allow whitelisted extensions
function fileFilter(req, file, cb) {
  const modelExts      = ['.glb', '.gltf']
  const thumbnailExts  = ['.jpg', '.jpeg', '.png', '.webp']
  const ext = path.extname(file.originalname).toLowerCase()

  if (file.fieldname === 'modelFile' && !modelExts.includes(ext)) {
    return cb(new Error('Only .glb and .gltf files are allowed for the 3D model'))
  }
  if (file.fieldname === 'thumbnail' && !thumbnailExts.includes(ext)) {
    return cb(new Error('Only jpg, jpeg, png, webp are allowed for thumbnails'))
  }
  cb(null, true)
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_SIZE_MB * 1024 * 1024 },
})

module.exports = { upload, UPLOAD_COST }
