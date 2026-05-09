const mongoose = require('mongoose')

const TeamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  roleClass: { type: String, default: 'role-mechanical' },
  initials: { type: String, required: true },
  description: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  photo: { type: String, default: '' }, // URL or GridFS id
  order: { type: Number, default: 0 },
}, { timestamps: true })

module.exports = mongoose.model('Team', TeamSchema)
