const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const Team = require('../models/Team')
const auth = require('../middleware/auth')

const storage = multer.memoryStorage()

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true)
    else cb(new Error('Only images allowed'), false)
  },
})

// ─── PUBLIC ───────────────────────────────────────────────────────────────────

/** GET /api/team - Get all team members */
router.get('/', async (req, res) => {
  try {
    const team = await Team.find().sort({ order: 1 })
    res.json(team)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── PROTECTED ────────────────────────────────────────────────────────────────

/** POST /api/team - Add team member (with optional photo) */
router.post('/', auth, upload.single('photo'), async (req, res) => {
  try {
    const data = { ...req.body }
    if (req.file) {
      const b64 = req.file.buffer.toString('base64');
      data.photo = `data:${req.file.mimetype};base64,${b64}`;
    }
    const member = new Team(data)
    await member.save()
    res.status(201).json(member)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

/** PUT /api/team/:id - Update team member */
router.put('/:id', auth, upload.single('photo'), async (req, res) => {
  try {
    const data = { ...req.body }
    if (req.file) {
      const b64 = req.file.buffer.toString('base64');
      data.photo = `data:${req.file.mimetype};base64,${b64}`;
    }
    const member = await Team.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true })
    if (!member) return res.status(404).json({ error: 'Team member not found' })
    res.json(member)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

/** DELETE /api/team/:id - Delete team member */
router.delete('/:id', auth, async (req, res) => {
  try {
    const member = await Team.findByIdAndDelete(req.params.id)
    if (!member) return res.status(404).json({ error: 'Team member not found' })
    // Base64 string doesn't need file deletion
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
