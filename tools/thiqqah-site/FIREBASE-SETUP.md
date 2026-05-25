# 🔥 دليل إعداد Firebase — نظام المراسلات

## الخطوة 1: إنشاء المشروع (تم)
- اسم المشروع: `thiqqah-letterhead`
- Plan: Spark (مجاني)

## الخطوة 2: تفعيل Firestore
1. اذهب إلى **Build → Firestore Database**
2. اضغط **Create database**
3. اختر **Start in test mode** (مؤقتًا)
4. المنطقة: `eur3 (europe-west)`
5. اضغط **Enable**

## الخطوة 3: الحصول على API Keys
1. اذهب إلى **Project Settings** (⚙️ أعلى اليسار)
2. تبويب **General**
3. اسفل **Your apps** → اضغط **</> (Web)**
4. سجل اسم التطبيق: `thiqqah-web`
5. **Register app**
6. انسخ الـ `firebaseConfig` كاملاً
7. افتح الملف `lib/firebase-config.js` واستبدل القيم

## الخطوة 4: Security Rules
1. اذهب إلى **Firestore Database → Rules**
2. انسخ محتوى `lib/firebase-rules.txt`
3. اضغط **Publish**

## الخطوة 5: Authentication (Anonymous مؤقتًا)
1. اذهب إلى **Build → Authentication**
2. اضغط **Get started**
3. فعّل **Anonymous** (للتجربة السريعة)
4. أو فعّل **Email/Password** للإنتاج

## الخطوة 6: إضافة أدوار المستخدمين
1. في **Firestore Database → Data**
2. أنشئ collection `roles`
3. أضف مستند: Document ID = `anonymous` (أو UID الحقيقي)
4. الحقل: `role` = `"admin"` أو `"staff"`

## الخطوة 7: اختبار
1. افتح `letterhead-staff.html`
2. اكتب مستند → اضغط **📨 إرسال للمدير**
3. افتح `letterhead-new.html` (المدير)
4. اضغط **📥 وارد المراسلات** → يجب أن يظهر المستند
5. أضف ختم + توقيع → اضغط **📤 إرجاع للموظف**

---

## ⚠️ تنبيهات أمنية للإنتاج

1. **لا تترك Test mode** — عدل Rules لاستخدام `request.auth`
2. استخدم **Firebase Authentication** حقيقي (Email/Google)
3. أضف **Cloud Functions** للإشعارات (اختياري)
4. فعّل **App Check** لحماية API Keys

## 📁 الملفات المعدلة

| الملف | الدور |
|-------|-------|
| `letterhead-staff.html` | إرسال مستند → Firestore |
| `letterhead-a4-print.html` | استلام + ختم + إرجاع |
| `lib/firebase-config.js` | إعدادات SDK |
| `lib/firebase-rules.txt` | قواعد الأمان |
