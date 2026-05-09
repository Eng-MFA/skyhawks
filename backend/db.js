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
      serverSelectionTimeoutMS: 5000,// وقت انتظار قبل ما يفشل
      socketTimeoutMS: 45000,         // وقت الـ socket
      family: 4,                      // IPv4 فقط (بيتجنب مشاكل IPv6 على بعض hosts)
    }

    let uri = process.env.MONGODB_URI

    if (!uri) {
      throw new Error(
        '❌ MONGODB_URI غير موجود!\n' +
        '   تأكد إن ملف .env موجود في مجلد backend/ وفيه MONGODB_URI'
      )
    }

    // تأمين وتشفير الباسورد تلقائياً لو فيه حروف خاصة مثل @
    if (uri.startsWith('mongodb')) {
      const match = uri.match(/:\/\/(.*?):(.*?)@/);
      if (match) {
        const username = match[1];
        const rawPassword = match[2];
        try {
          // نفك التشفير الأول (عشان لو كان متأمن جاهز) وبعدين نشفره تاني بشكل سليم
          const decodedPassword = decodeURIComponent(rawPassword);
          const encodedPassword = encodeURIComponent(decodedPassword);
          uri = uri.replace(`://${username}:${rawPassword}@`, `://${username}:${encodedPassword}@`);
        } catch (e) {
          console.error("Failed to parse URI password");
        }
      }
    }

    console.log("Connecting to DB...")
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
