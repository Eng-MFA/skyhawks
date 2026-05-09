const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

// Admin credentials from env
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'skyhawks2026'

/**
 * POST /api/auth/login
 * Login with admin credentials, returns JWT token
 */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' })
    }

    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { username, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      success: true,
      token,
      user: { username, role: 'admin' },
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

/**
 * POST /api/auth/verify
 * Verify JWT token validity
 */
router.post('/verify', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ valid: false })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    res.json({ valid: true, user: decoded })
  } catch {
    res.status(401).json({ valid: false })
  }
})

module.exports = router
