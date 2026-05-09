const mongoose = require('mongoose')

const AchievementSchema = new mongoose.Schema({
  year: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  award: { type: String, required: true },
  color: { type: String, default: '#C9A87C' },
  images: [{ type: String }], // Array of image URLs / GridFS ids
  order: { type: Number, default: 0 },
}, { timestamps: true })

module.exports = mongoose.model('Achievement', AchievementSchema)
