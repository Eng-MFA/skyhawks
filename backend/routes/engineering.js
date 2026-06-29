const express = require('express')
const router = express.Router()
const multer = require('multer')
const { Spec, Stat } = require('../models/Engineering')
const UAV = require('../models/UAV')
const auth = require('../middleware/auth')

// ─── MULTER (memory, base64 storage) ─────────────────────────────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true)
    else cb(new Error('Only images allowed'), false)
  },
})


// ─── PUBLIC ───────────────────────────────────────────────────────────────────

/** GET /api/engineering/specs - Get all spec cards */
router.get('/specs', async (req, res) => {
  try {
    const specs = await Spec.find().sort({ order: 1 })
    res.json(specs)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

/** GET /api/engineering/stats - Get overall stats */
router.get('/stats', async (req, res) => {
  try {
    const stats = await Stat.find().sort({ order: 1 })
    res.json(stats)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── PROTECTED ────────────────────────────────────────────────────────────────

/** POST /api/engineering/specs - Add new spec card */
router.post('/specs', auth, async (req, res) => {
  try {
    const spec = new Spec(req.body)
    await spec.save()
    res.status(201).json(spec)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

/** PUT /api/engineering/specs/:id - Update spec card */
router.put('/specs/:id', auth, async (req, res) => {
  try {
    const spec = await Spec.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!spec) return res.status(404).json({ error: 'Spec not found' })
    res.json(spec)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

/** DELETE /api/engineering/specs/:id - Delete spec card */
router.delete('/specs/:id', auth, async (req, res) => {
  try {
    const spec = await Spec.findByIdAndDelete(req.params.id)
    if (!spec) return res.status(404).json({ error: 'Spec not found' })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

/** POST /api/engineering/stats - Add stat */
router.post('/stats', auth, async (req, res) => {
  try {
    const stat = new Stat(req.body)
    await stat.save()
    res.status(201).json(stat)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

/** PUT /api/engineering/stats/:id - Update stat */
router.put('/stats/:id', auth, async (req, res) => {
  try {
    const stat = await Stat.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!stat) return res.status(404).json({ error: 'Stat not found' })
    res.json(stat)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

/** DELETE /api/engineering/stats/:id - Delete stat */
router.delete('/stats/:id', auth, async (req, res) => {
  try {
    await Stat.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── UAVs ─────────────────────────────────────────────────────────────────────

/** GET /api/engineering/uavs - Get all UAVs (public) */
router.get('/uavs', async (req, res) => {
  try {
    const uavs = await UAV.find().sort({ order: 1 })
    res.json(uavs)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

/** POST /api/engineering/uavs - Add new UAV (with optional main image) */
router.post('/uavs', auth, upload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body }
    if (req.file) {
      data.image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`
    }
    const uav = new UAV(data)
    await uav.save()
    res.status(201).json(uav)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

/** PUT /api/engineering/uavs/:id - Update UAV */
router.put('/uavs/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body }
    if (req.file) {
      data.image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`
    }
    const uav = await UAV.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true })
    if (!uav) return res.status(404).json({ error: 'UAV not found' })
    res.json(uav)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

/** DELETE /api/engineering/uavs/:id - Delete UAV */
router.delete('/uavs/:id', auth, async (req, res) => {
  try {
    const uav = await UAV.findByIdAndDelete(req.params.id)
    if (!uav) return res.status(404).json({ error: 'UAV not found' })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

/** POST /api/engineering/uavs/:id/gallery - Upload gallery images */
router.post('/uavs/:id/gallery', auth, upload.array('gallery', 20), async (req, res) => {
  try {
    const uav = await UAV.findById(req.params.id)
    if (!uav) return res.status(404).json({ error: 'UAV not found' })
    const newImages = (req.files || []).map(f =>
      `data:${f.mimetype};base64,${f.buffer.toString('base64')}`
    )
    uav.gallery.push(...newImages)
    await uav.save()
    res.json({ gallery: uav.gallery })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

/** DELETE /api/engineering/uavs/:id/gallery - Remove a gallery image by index */
router.delete('/uavs/:id/gallery', auth, async (req, res) => {
  try {
    const { imageIndex } = req.body
    const uav = await UAV.findById(req.params.id)
    if (!uav) return res.status(404).json({ error: 'UAV not found' })
    uav.gallery.splice(Number(imageIndex), 1)
    await uav.save()
    res.json({ gallery: uav.gallery })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router

