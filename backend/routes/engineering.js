const express = require('express')
const router = express.Router()
const { Spec, Stat } = require('../models/Engineering')
const auth = require('../middleware/auth')

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

module.exports = router
