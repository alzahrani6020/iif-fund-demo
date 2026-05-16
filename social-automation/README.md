# 🚀 Social Auto - نظام أتمتة السوشيال ميديا

نظام متكامل لأتمتة إدارة حسابات فيسبوك - 24 منشور يومياً!

## ✨ المميزات

- 📊 **لوحة تحكم شاملة** - مراقبة كل شيء من مكان واحد
- ⏰ **جدولة 24 ساعة** - منشور كل ساعة تلقائياً
- 🤖 **توليد محتوى ذكي** - محتوى متنوع بالذكاء الاصطناعي
- 📱 **إدارة حسابين** - النشر على حسابين بالتناوب
- 📈 **إحصائيات وتقارير** - متابعة الأداء والتحليلات
- 🔄 **سهولة التخصيص** - تعديل الجدول والمحتوى بسهولة

## 📁 هيكل المشروع

```
social-automation/
├── index.html              # الصفحة الرئيسية
├── js/
│   ├── scheduler.js        # محرك الجدولة
│   ├── facebook-api.js      # ربط Facebook API
│   └── content-generator.js # مولد المحتوى
└── README.md               # هذا الملف
```

## 🎯 الاستخدام السريع

### 1️⃣ فتح لوحة التحكم

افتح ملف `index.html` في المتصفح:

```bash
# على Windows
start index.html

# أو اسحب الملف إلى المتصفح مباشرة
```

### 2️⃣ إعداد الحسابات

1. اضغط على "إضافة حساب"
2. أدخل اسم الصفحة ورابطها
3. الصق Page Access Token

### 3️⃣ توليد المحتوى

1. اختر نوع المحتوى من المولد
2. اضغط "توليد 24 منشور الآن"
3. راجع المحتوى وقم بتعديله عند الحاجة

### 4️⃣ بدء الأتمتة

1. اضغط "تشغيل" في لوحة التحكم
2. سيبدأ النظام بنشر محتوى كل ساعة
3. تابع الإحصائيات في الوقت الحقيقي

## 📋 Meta API Setup

### الحصول على Access Token

1. اذهب إلى [Meta for Developers](https://developers.facebook.com)
2. أنشئ تطبيق جديد (App Type: Business)
3. أضف منتج "Facebook Graph API"
4. اذهب إلى "Graph API Explorer"
5. اختر تطبيقك
6. اطلب الصلاحيات:
   - `pages_manage_posts`
   - `pages_read_engagement`
   - `publish_to_groups` (اختياري)
7. اختر الصفحة المطلوبة
8. اضغط "Generate Access Token"
9. وافق على الصلاحيات

### تجديد Token طويل الأمد

Page Access Tokens تنتهي عادةً بعد ساعة. لجعلها طويلة الأمد:

```
GET /oauth/access_token?
    grant_type=fb_exchange_token&
    client_id={app-id}&
    client_secret={app-secret}&
    fb_exchange_token={short-lived-token}
```

### الصلاحيات المطلوبة

| الصلاحية | الوصف |
|---------|-------|
| `pages_manage_posts` | نشر المحتوى على الصفحة |
| `pages_read_engagement` | قراءة إحصائيات الصفحة |
| `pages_manage_metadata` | إدارة إعدادات الصفحة |

## 🔧 التخصيص

### تعديل أوقات النشر

```javascript
// في scheduler.js
this.schedule[hour].enabled = true; // تفعيل ساعة معينة
this.schedule[hour].enabled = false; // تعطيل ساعة معينة
```

### إضافة موضوعات جديدة

```javascript
// في content-generator.js
this.topics.yourTopic = {
    name: 'اسم الموضوع',
    templates: [
        'قالب 1',
        'قالب 2'
    ]
};
```

### تغيير نوع المحتوى

```javascript
// توليد محتوى من موضوع معين
contentGenerator.generate('business', {
    length: 'medium',
    style: 'engaging',
    includeHashtag: true,
    includeCTA: true
});
```

## 📊 الجدول الزمني الافتراضي

| الوقت | نوع المحتوى | الحساب |
|-------|------------|--------|
| 08:00 - 10:00 | نصائح قصيرة | حساب 1 |
| 10:00 - 12:00 | استطلاعات | حساب 2 |
| 12:00 - 14:00 | محتوى تعليمي | حساب 1 |
| 14:00 - 16:00 | اقتباسات | حساب 2 |
| 16:00 - 18:00 | قصص نجاح | حساب 1 |
| 18:00 - 20:00 | تفاعل | حساب 2 |
| 20:00 - 22:00 | محتوى طويل | حساب 1 |

## ⚙️ الإعدادات المتقدمة

### تفعيل الإشعارات

```javascript
// طلب إذن الإشعارات
if ('Notification' in window) {
    Notification.requestPermission();
}
```

### تصدير واستيراد الجدول

```javascript
// تصدير
scheduler.exportSchedule();

// استيراد
const file = document.querySelector('input[type=file]').files[0];
scheduler.importSchedule(file);
```

## 🛡️ الأمان

⚠️ **هام:**
- لا تشارك Access Token علناً
- احفظه في مكان آمن
- جدّد الـ Token كل 60 يوم
- استخدم HTTPS دائماً

## 📝 ملاحظات مهمة

1. **الحدود:**
   - فيسبوك يسمح بـ 50 منشور/يوم/صفحة
   - Rate Limit: انتظر 1 ثانية بين كل منشور

2. **أفضل الممارسات:**
   - لا تنشر نفس المحتوى على الحسابين
   - تفاعل مع التعليقات
   - راقب الأداء وعدّل الاستراتيجية

3. **حل المشاكل:**
   - Token منتهي → جدده من Graph API Explorer
   - خطأ في النشر → تحقق من صلاحيات التطبيق
   - لا يعمل → فرّغ الكاش وجرب مرة أخرى

## 📞 الدعم

للأسئلة أو المشاكل:
- افتح Issue على GitHub
- تواصل معنا مباشرة

---

**Made with ❤️ for Social Media Managers**

*تم تطوير هذا النظام لمساعدتك على توفير الوقت وتحسين حضورك على السوشيال ميديا*
