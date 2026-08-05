// Middleware: requires the authenticated user to have the 'admin' role
module.exports = function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access denied: Admin only' })
  }
  next()
}
