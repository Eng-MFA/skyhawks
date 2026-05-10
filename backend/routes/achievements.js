const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const Achievement = require('../models/Achievement')
const auth = require('../middleware/auth')

const storage = multer.memoryStorage()

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true)
    else cb(new Error('Only images allowed'), false)
  },
})

// ─── PUBLIC ───────────────────────────────────────────────────────────────────

/** GET /api/achievements - Get all achievements */
router.get('/', async (req, res) => {
  try {
    const achievements = await Achievement.find().sort({ order: 1, year: -1 })
    res.json(achievements)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

/** GET /api/achievements/:id - Get single achievement */
router.get('/:id', async (req, res) => {
  try {
    const ach = await Achievement.findById(req.params.id)
    if (!ach) return res.status(404).json({ error: 'Achievement not found' })
    res.json(ach)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── PROTECTED ────────────────────────────────────────────────────────────────

/** POST /api/achievements - Add achievement */
router.post('/', auth, async (req, res) => {
  try {
    const ach = new Achievement(req.body)
    await ach.save()
    res.status(201).json(ach)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

/** PUT /api/achievements/:id - Update achievement */
router.put('/:id', auth, async (req, res) => {
  try {
    const ach = await Achievement.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!ach) return res.status(404).json({ error: 'Achievement not found' })
    res.json(ach)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

/** DELETE /api/achievements/:id - Delete achievement */
router.delete('/:id', auth, async (req, res) => {
  try {
    const ach = await Achievement.findByIdAndDelete(req.params.id)
    if (!ach) return res.status(404).json({ error: 'Achievement not found' })
    // Clean up images (Base64 strings don't need fs deletion)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

/** POST /api/achievements/:id/images - Upload images for an achievement */
router.post('/:id/images', auth, upload.array('images', 20), async (req, res) => {
  try {
    const ach = await Achievement.findById(req.params.id)
    if (!ach) return res.status(404).json({ error: 'Achievement not found' })

    const newImages = req.files.map(f => {
      const b64 = f.buffer.toString('base64');
      return `data:${f.mimetype};base64,${b64}`;
    });
    ach.images = [...(ach.images || []), ...newImages]
    await ach.save()

    res.json({ success: true, images: ach.images })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

/** DELETE /api/achievements/:id/images - Remove specific image from achievement */
router.delete('/:id/images', auth, async (req, res) => {
  try {
    const { imagePath, imageIndex } = req.body
    const ach = await Achievement.findById(req.params.id)
    if (!ach) return res.status(404).json({ error: 'Achievement not found' })

    if (imageIndex !== undefined) {
      ach.images.splice(imageIndex, 1)
    } else {
      ach.images = ach.images.filter(img => img !== imagePath)
    }
    await ach.save()

    // Delete file (Base64 strings don't need fs deletion)

    res.json({ success: true, images: ach.images })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
