const express = require('express')
const router = express.Router()
const archiver = require('archiver')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const extract = require('extract-zip')
const mongoose = require('mongoose')
const auth = require('../middleware/auth')

const { Spec, Stat } = require('../models/Engineering')
const Team = require('../models/Team')
const Achievement = require('../models/Achievement')
const Sponsor = require('../models/Sponsor')
const { ContactInfo, Message } = require('../models/Contact')

const backupUploadDir = path.join(__dirname, '..', 'uploads', 'backups')
if (!fs.existsSync(backupUploadDir)) fs.mkdirSync(backupUploadDir, { recursive: true })

const upload = multer({ dest: backupUploadDir })

/**
 * GET /api/backup/export
 * Creates a ZIP containing all DB data (JSON) + all uploaded images
 */
router.get('/export', auth, async (req, res) => {
  try {
    res.setHeader('Content-Type', 'application/zip')
    res.setHeader('Content-Disposition', `attachment; filename="skyhawks-backup-${Date.now()}.zip"`)

    const archive = archiver('zip', { zlib: { level: 9 } })
    archive.pipe(res)

    // Collect all data
    const [specs, stats, team, achievements, sponsors, contactInfo, messages] = await Promise.all([
      Spec.find().lean(),
      Stat.find().lean(),
      Team.find().lean(),
      Achievement.find().lean(),
      Sponsor.find().lean(),
      ContactInfo.findOne().lean(),
      Message.find().lean(),
    ])

    const dbData = { specs, stats, team, achievements, sponsors, contactInfo, messages }
    archive.append(JSON.stringify(dbData, null, 2), { name: 'db-data.json' })

    // Add uploads folder
    const uploadsDir = path.join(__dirname, '..', 'uploads')
    if (fs.existsSync(uploadsDir)) {
      archive.directory(uploadsDir, 'uploads')
    }

    archive.finalize()
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

/**
 * POST /api/backup/import
 * Upload a ZIP backup and restore all data + images
 */
router.post('/import', auth, upload.single('backup'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No backup file uploaded' })

  const zipPath = req.file.path
  const extractDir = path.join(backupUploadDir, 'restore-' + Date.now())

  try {
    await extract(zipPath, { dir: extractDir })

    const dbFile = path.join(extractDir, 'db-data.json')
    if (!fs.existsSync(dbFile)) {
      return res.status(400).json({ error: 'Invalid backup: db-data.json not found' })
    }

    const data = JSON.parse(fs.readFileSync(dbFile, 'utf-8'))

    // Clear & restore each collection
    if (data.specs) {
      await Spec.deleteMany({})
      if (data.specs.length > 0) await Spec.insertMany(data.specs)
    }
    if (data.stats) {
      await Stat.deleteMany({})
      if (data.stats.length > 0) await Stat.insertMany(data.stats)
    }
    if (data.team) {
      await Team.deleteMany({})
      if (data.team.length > 0) await Team.insertMany(data.team)
    }
    if (data.achievements) {
      await Achievement.deleteMany({})
      if (data.achievements.length > 0) await Achievement.insertMany(data.achievements)
    }
    if (data.sponsors) {
      await Sponsor.deleteMany({})
      if (data.sponsors.length > 0) await Sponsor.insertMany(data.sponsors)
    }
    if (data.contactInfo) {
      await ContactInfo.deleteMany({})
      await ContactInfo.create(data.contactInfo)
    }
    if (data.messages) {
      await Message.deleteMany({})
      if (data.messages.length > 0) await Message.insertMany(data.messages)
    }

    // Restore uploads
    const extractedUploads = path.join(extractDir, 'uploads')
    if (fs.existsSync(extractedUploads)) {
      const destUploads = path.join(__dirname, '..', 'uploads')
      fs.cpSync(extractedUploads, destUploads, { recursive: true })
    }

    // Cleanup
    fs.rmSync(extractDir, { recursive: true, force: true })
    fs.unlinkSync(zipPath)

    res.json({ success: true, message: 'Backup restored successfully!' })
  } catch (err) {
    // Cleanup on error
    try {
      if (fs.existsSync(extractDir)) fs.rmSync(extractDir, { recursive: true, force: true })
      if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath)
    } catch {}
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
