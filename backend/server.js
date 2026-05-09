/**
 * server.js - Skyhawks Backend
 *
 * يشتغل في 3 بيئات:
 *  1. Local Dev  → node server.js  (يقرأ من .env)
 *  2. Vercel     → يُعبَّر عنه كـ module.exports = app  (يقرأ من Vercel Env Vars)
 *  3. nodemon    → nodemon server.js
 */

if (process.env.NODE_ENV !== 'production') {
  try {
    require('dotenv').config()
  } catch (err) {
    console.log('dotenv not found, skipping')
  }
}

const express  = require('express')
const cors     = require('cors')
const path     = require('path')
const mongoose = require('mongoose')
const connectDB = require('./db')

const app  = express()
const PORT = process.env.PORT || 5000

// ─── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  'https://skyhawks.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://localhost:5000',   // للـ Admin Panel على نفس الـ port
  process.env.FRONTEND_URL,
].filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true)          // curl / Postman / mobile
    if (allowedOrigins.includes(origin)) return callback(null, true)
    callback(new Error(`CORS blocked: ${origin}`))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

// ─── BODY PARSERS ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// ─── STATIC FILES ─────────────────────────────────────────────────────────────
// ملاحظة: على Vercel الـ uploads مش بتتحفظ (serverless filesystem مؤقت)
// عشان الـ uploads تشتغل على Vercel لازم تستخدم Cloudinary أو S3
// على Local بتشتغل عادي
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use('/admin',   express.static(path.join(__dirname, 'admin')))

// ─── DB MIDDLEWARE ─────────────────────────────────────────────────────────────
// بيضمن إن الاتصال بـ MongoDB موجود قبل ما أي route يشتغل
app.use(async (req, res, next) => {
  try {
    await connectDB()
    next()
  } catch (err) {
    console.error('[DB] Connection error:', err.message)
    res.status(503).json({
      error: 'Database unavailable',
      detail: err.message,
    })
  }
})

// ─── ROUTES ───────────────────────────────────────────────────────────────────
app.use('/api/auth',        require('./routes/auth'))
app.use('/api/engineering', require('./routes/engineering'))
app.use('/api/team',        require('./routes/team'))
app.use('/api/achievements',require('./routes/achievements'))
app.use('/api/sponsors',    require('./routes/sponsors'))
app.use('/api/contact',     require('./routes/contact'))
app.use('/api/backup',      require('./routes/backup'))

// ─── HEALTH CHECK ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    env: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  })
})

// ─── 404 ──────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` })
})

// ─── GLOBAL ERROR ─────────────────────────────────────────────────────────────
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error('[ERROR]', err.message)
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' })
})

// ─── START (Local only) ───────────────────────────────────────────────────────
// على Vercel، بيستخدم module.exports = app بدل app.listen
if (process.env.NODE_ENV !== 'production' || process.env.LOCAL_SERVER === 'true') {
  connectDB()
    .then(async () => {
      console.log('✅ Connected to MongoDB Atlas')

      // Auto-seed لو DB فاضية
      const { Spec } = require('./models/Engineering')
      const count = await Spec.countDocuments()
      if (count === 0) {
        console.log('🌱 Seeding initial data...')
        await require('./seed')()
        console.log('✅ Initial data seeded')
      }

      app.listen(PORT, () => {
        console.log(`\n🚀 Backend running → http://localhost:${PORT}`)
        console.log(`🎛️  Admin Panel    → http://localhost:${PORT}/admin`)
        console.log(`🏥 Health Check   → http://localhost:${PORT}/api/health\n`)
      })
    })
    .catch(err => {
      console.error('❌ Startup failed:', err.message)
      console.error('\n📋 تحقق من:')
      console.error('   1. ملف backend/.env موجود ومحتوى MONGODB_URI صح')
      console.error('   2. MongoDB Atlas → Network Access: أضف 0.0.0.0/0')
      console.error('   3. MongoDB Atlas → Database Access: username & password صح')
      process.exit(1)
    })
}

// ─── EXPORT للـ Vercel Serverless ─────────────────────────────────────────────
module.exports = app
