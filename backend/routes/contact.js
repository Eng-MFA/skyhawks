const express = require('express')
const router = express.Router()
const { ContactInfo, Message } = require('../models/Contact')
const auth = require('../middleware/auth')

// ─── PUBLIC ───────────────────────────────────────────────────────────────────

/** GET /api/contact/info - Get contact info */
router.get('/info', async (req, res) => {
  try {
    let info = await ContactInfo.findOne()
    if (!info) {
      info = await ContactInfo.create({})
    }
    res.json(info)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

/** POST /api/contact/message - Submit a message from the website */
router.post('/message', async (req, res) => {
  try {
    const { name, email, message } = req.body
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' })
    }
    const msg = new Message({ name, email, message })
    await msg.save()
    res.status(201).json({ success: true, message: 'Message sent successfully!' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── PROTECTED ────────────────────────────────────────────────────────────────

/** PUT /api/contact/info - Update contact info */
router.put('/info', auth, async (req, res) => {
  try {
    let info = await ContactInfo.findOne()
    if (!info) {
      info = new ContactInfo(req.body)
    } else {
      Object.assign(info, req.body)
    }
    await info.save()
    res.json(info)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

/** GET /api/contact/messages - Get all messages (admin) */
router.get('/messages', auth, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 })
    res.json(messages)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

/** PUT /api/contact/messages/:id/read - Mark message as read */
router.put('/messages/:id/read', auth, async (req, res) => {
  try {
    const msg = await Message.findByIdAndUpdate(req.params.id, { read: true }, { new: true })
    if (!msg) return res.status(404).json({ error: 'Message not found' })
    res.json(msg)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

/** DELETE /api/contact/messages/:id - Delete message */
router.delete('/messages/:id', auth, async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
