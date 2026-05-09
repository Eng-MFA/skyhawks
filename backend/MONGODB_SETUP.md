## كيفية إصلاح اتصال MongoDB Atlas

### المشكلة
اتصال MongoDB فشل بسبب Authentication Failed.

### الحل - خطوة بخطوة

1. **افتح** https://cloud.mongodb.com وسجل دخولك

2. **تحقق من Network Access:**
   - اضغط على "Network Access" من القائمة الجانبية
   - اضغط "Add IP Address"
   - اختر "Allow Access from Anywhere" (`0.0.0.0/0`)
   - اضغط Confirm

3. **تحقق من Database Access:**
   - اضغط "Database Access"
   - تأكد من وجود مستخدم `skyhawks` بباسورد `skyhawks2025`
   - إذا لم يكن موجود: Add New Database User
     - Username: `skyhawks`
     - Password: `skyhawks2025`
     - Role: Atlas Admin

4. **بعد ذلك شغّل السيرفر:**
   ```
   cd d:\skyhawks\backend
   node server.js
   ```

### لو نجح الاتصال ستشوف:
```
✅ Connected to MongoDB Atlas
🌱 Seeding initial data...
✅ Initial data seeded
🚀 Skyhawks Backend running on http://localhost:5000
```

### Admin Panel URL:
http://localhost:5000/admin
