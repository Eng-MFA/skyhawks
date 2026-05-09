const mongoose = require('mongoose')

const ContactInfoSchema = new mongoose.Schema({
  email: { type: String, default: 'team@skyhawks.edu' },
  phone: { type: String, default: '+1 (555) 0123-4567' },
  location: { type: String, default: 'Engineering Building, Room 405' },
  instagram: { type: String, default: '' },
  twitter: { type: String, default: '' },
  youtube: { type: String, default: '' },
  linkedin: { type: String, default: '' },
}, { timestamps: true })

const MessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
}, { timestamps: true })

module.exports = {
  ContactInfo: mongoose.model('ContactInfo', ContactInfoSchema),
  Message: mongoose.model('Message', MessageSchema),
}
