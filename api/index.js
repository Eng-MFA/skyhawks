// ─── VERCEL SERVERLESS ENTRY POINT ──────────────────────────────────────────
// Vercel يبحث تلقائياً عن ملفات داخل مجلد /api لتشغيلها كـ Serverless Functions
// هذا الملف يستدعي سيرفر Express الموجود في مجلد backend
// وبذلك يعمل المشروع كاملاً على Vercel كـ Function واحدة بدون تكسير هيكل المشروع.

const app = require('../backend/server.js');

module.exports = app;
