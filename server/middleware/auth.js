// Middleware: verifies the JWT token on protected routes
const jwt = require('jsonwebtoken')

module.exports = function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization

  // Expect: Authorization: Bearer <token>
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token provided' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.user = payload   // attach decoded payload to request
    next()
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' })
  }
}
