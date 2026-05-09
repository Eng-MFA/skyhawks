const mongoose = require('mongoose')

const DetailSchema = new mongoose.Schema({
  label: { type: String, required: true },
  value: { type: String, required: true },
})

const SpecSchema = new mongoose.Schema({
  part: { type: String, required: true },
  icon: { type: String, default: '🔧' },
  title: { type: String, required: true },
  description: { type: String, required: true },
  details: [DetailSchema],
  order: { type: Number, default: 0 },
}, { timestamps: true })

const StatSchema = new mongoose.Schema({
  value: { type: String, required: true },
  label: { type: String, required: true },
  color: { type: String, default: '#C9A87C' },
  order: { type: Number, default: 0 },
}, { timestamps: true })

module.exports = {
  Spec: mongoose.model('Spec', SpecSchema),
  Stat: mongoose.model('Stat', StatSchema),
}
