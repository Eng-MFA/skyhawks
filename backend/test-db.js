require('dotenv').config()
const mongoose = require('mongoose')

const uri = process.env.MONGODB_URI
console.log('🔍 Testing connection to MongoDB...')
console.log('📍 URI (masked):', uri.replace(/:([^@]+)@/, ':****@'))

mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 })
  .then(() => {
    console.log('✅ SUCCESS! MongoDB connected.')
    console.log('📊 DB Name:', mongoose.connection.db.databaseName)
    process.exit(0)
  })
  .catch(err => {
    console.error('❌ FAILED:', err.message)
    console.log('\n📋 Troubleshooting steps:')
    console.log('1. Go to: https://cloud.mongodb.com')
    console.log('2. Network Access → Add IP: 0.0.0.0/0')
    console.log('3. Database Access → Check username & password')
    console.log('4. Edit backend/.env with correct credentials')
    process.exit(1)
  })
