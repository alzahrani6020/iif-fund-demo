# مسارات الملفات ≠ بحث Google

## المشكلة الشائعة

كتابة شيء مثل:

`financial-consulting/iif-fund-demo/README.md`

في **شريط بحث Google** يعطي نتائج إعلانات ومواقع عشوائية — **لأن هذا ليس عنوان موقعاً (URL)**.

## ما هو هذا النص إذن؟

هو **مسار داخل مجلد المشروع** على جهازك أو داخل **مستودع GitHub** عند تصفح الملفات.

## ماذا تفعل؟

| تريد | الطريقة |
|------|---------|
| فتح الملف محلياً | Cursor / VS Code → شجرة المجلدات → تنقّل حتى `README.md` |
| من Windows | `المشروع\financial-consulting\iif-fund-demo\README.md` |
| من GitHub | ادخل المستودع → مجلدات → الملف (الرابط يبدأ بـ `https://github.com/.../blob/...`) |
| تشغيل الموقع | من جذر المشروع: `npm start` ثم افتح `http://127.0.0.1:3333/financial-consulting/iif-fund-demo/index.html` |

## روابط صحيحة للمعاينة (عناوين ويب)

بعد `npm start`:

- واجهة الصندوق: `http://127.0.0.1:3333/financial-consulting/iif-fund-demo/index.html`
- لوحة التحكم/الإدارة (المعتمد): `http://127.0.0.1:3333/financial-consulting/iif-fund-demo/index.html#dashboard`

---

راجع أيضاً: [financial-consulting/iif-fund-demo/README.md](./financial-consulting/iif-fund-demo/README.md) · [QA-PRE-RELEASE.md](./financial-consulting/iif-fund-demo/QA-PRE-RELEASE.md)
