const mongoose = require('mongoose')

const UAVSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  image: { type: String, default: '' },          // main photo path
  gallery: [{ type: String }],                   // additional photos
  competition: { type: String, default: '' },
  competitionDate: { type: String, default: '' },
  achievements: { type: String, default: '' },
  status: {
    type: String,
    enum: ['Active', 'Retired', 'Under Development'],
    default: 'Active',
  },
  order: { type: Number, default: 0 },
}, { timestamps: true })

module.exports = mongoose.model('UAV', UAVSchema)
