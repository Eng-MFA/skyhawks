const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const Sponsor = require('../models/Sponsor')
const auth = require('../middleware/auth')

const os = require('os')
// استخدم /tmp كفولدر مؤقت لأن Vercel لا يسمح بإنشاء فولدرات في بيئة Serverless
const uploadDir = os.tmpdir()

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, 'sponsor-' + unique + path.extname(file.originalname))
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true)
    else cb(new Error('Only images allowed'), false)
  },
})

// ─── PUBLIC ───────────────────────────────────────────────────────────────────

/** GET /api/sponsors */
router.get('/', async (req, res) => {
  try {
    const sponsors = await Sponsor.find().sort({ order: 1 })
    res.json(sponsors)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── PROTECTED ────────────────────────────────────────────────────────────────

/** POST /api/sponsors */
router.post('/', auth, upload.single('logo'), async (req, res) => {
  try {
    const data = { ...req.body }
    if (req.file) data.logo = `/uploads/sponsors/${req.file.filename}`
    const sponsor = new Sponsor(data)
    await sponsor.save()
    res.status(201).json(sponsor)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

/** PUT /api/sponsors/:id */
router.put('/:id', auth, upload.single('logo'), async (req, res) => {
  try {
    const data = { ...req.body }
    if (req.file) data.logo = `/uploads/sponsors/${req.file.filename}`
    const sponsor = await Sponsor.findByIdAndUpdate(req.params.id, data, { new: true })
    if (!sponsor) return res.status(404).json({ error: 'Sponsor not found' })
    res.json(sponsor)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

/** DELETE /api/sponsors/:id */
router.delete('/:id', auth, async (req, res) => {
  try {
    const sponsor = await Sponsor.findByIdAndDelete(req.params.id)
    if (!sponsor) return res.status(404).json({ error: 'Sponsor not found' })
    if (sponsor.logo && sponsor.logo.startsWith('/uploads/')) {
      const fp = path.join(__dirname, '..', sponsor.logo)
      if (fs.existsSync(fp)) fs.unlinkSync(fp)
    }
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
