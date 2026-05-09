const mongoose = require('mongoose')

const SponsorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tier: { type: String, enum: ['Platinum', 'Gold', 'Silver', 'Bronze', 'Partner'], default: 'Silver' },
  color: { type: String, default: '#9CA3AF' },
  icon: { type: String, default: '🏢' },
  logo: { type: String, default: '' }, // image URL
  website: { type: String, default: '' },
  order: { type: Number, default: 0 },
}, { timestamps: true })

module.exports = mongoose.model('Sponsor', SponsorSchema)
