/**
 * db.js - MongoDB Connection Helper
 *
 * Pattern مناسب لـ:
 * - Local Development: اتصال واحد يعيش طول عمر التطبيق
 * - Vercel Serverless: نعيد استخدام نفس الاتصال بين الـ invocations
 *   (Vercel بيبقّي الـ process حي في "warm state"، فـ caching بيمنع
 *    فتح آلاف connections جديدة مع كل request)
 */

const mongoose = require('mongoose')

// ─── Cache the connection at module level ────────────────────────────────────
// لما Vercel يشغّل نفس الـ function تاني مرة (warm start)،
// المتغير ده بيفضل موجود في الـ memory فمش بنفتح connection جديد.
let cached = global._mongoConnection

if (!cached) {
  cached = global._mongoConnection = { conn: null, promise: null }
}

async function connectDB() {
  // لو الاتصال موجود وشغّال → رجّع نفسه على طول
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn
  }

  // لو في promise جاري (اتصال بيحصل دلوقتي) → استنّاه
  if (!cached.promise) {
    const opts = {
      // ─── Serverless-friendly options ──────────────────────────────────
      bufferCommands: false,          // لا تحتفظ بـ queries لو الاتصال فشل
      maxPoolSize: 10,                // حد أقصى للـ connections في الـ pool
      serverSelectionTimeoutMS: 10000,// وقت انتظار قبل ما يفشل
      socketTimeoutMS: 45000,         // وقت الـ socket
      family: 4,                      // IPv4 فقط (بيتجنب مشاكل IPv6 على بعض hosts)
    }

    const uri = process.env.MONGODB_URI

    if (!uri) {
      throw new Error(
        '❌ MONGODB_URI غير موجود!\n' +
        '   تأكد إن ملف .env موجود في مجلد backend/ وفيه MONGODB_URI'
      )
    }

    cached.promise = mongoose.connect(uri, opts).then(m => m)
  }

  try {
    cached.conn = await cached.promise
  } catch (err) {
    cached.promise = null  // لو فشل، امسح الـ promise عشان يحاول تاني
    throw err
  }

  return cached.conn
}

module.exports = connectDB
