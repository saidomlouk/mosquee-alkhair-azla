# لوحة مشروع بناء مسجد الخير أزلا V7

## الجديد
- تصحيح تضمين فيديوهات Facebook بالكود الذي زودتني به.
- إضافة QR Code لمجموعة WhatsApp.
- إضافة صفحة admin.html.
- إضافة firebase-config.js للربط مع Firebase.
- الزوار لا يمكنهم التعديل إذا تم الربط بـ Firebase.
- المدير يضيف/يعدل/يحذف من admin.html.

## ملفات مهمة
- index.html: الموقع العمومي
- admin.html: لوحة الإدارة
- firebase-config.js: ضع إعدادات Firebase هنا
- admin.js: كود الإدارة
- assets: الصور والوثائق

## لتحديث GitHub Pages
ارفع الملفات الجديدة كلها إلى نفس Repository ثم Commit changes.

## Firebase
1. أنشئ Project في Firebase.
2. فعّل Authentication > Email/Password.
3. أنشئ مستخدم المدير.
4. فعّل Firestore Database.
5. في Project settings أنشئ Web App وانسخ firebaseConfig.
6. افتح firebase-config.js وضع القيم وغيّر configured إلى true.
