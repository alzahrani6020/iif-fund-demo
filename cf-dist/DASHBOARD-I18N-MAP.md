# خريطة اللوحة و i18n (D1)

مرجع للمطورين: أين يظهر النص في **لوحة التحكم** (`#dashboard-overlay`) وكيف يُترجم.

---

## قواعد عامة

| القاعدة | التفاصيل |
|---------|-----------|
| **مفاتيح واجهة اللوحة** | أغلبها بادئة `dash*` في `i18n.js` (مثل `dashHeroTitle`, `dashTocProjects`). |
| **مشتركة مع الصفحة العامة** | بعض التسميات تعيد استخدام مفاتيح مثل `authLabelEmail`, `btnCancel`, `btnSearch`. |
| **نصوص ديناميكية** | عناصر فارغة في HTML تُملأ بـ JavaScript (`#dashboard-role-welcome-text`, قوائم `ul#dashboard-list`, إلخ) — يجب أن تمر عبر `iifT` / `iifMessage` عند الإنشاء وليس نصاً صلباً. |
| **لا تضع نصوص مستخدم في CSS** | `content:` للزينة فقط؛ العناوين والأزرار عبر `data-i18n` أو JS. |

---

## هيكل DOM (مختصر)

```
#dashboard-overlay
  #dashboard-page-shell
    header.dashboard-header-bar
      #dashboard-overlay-title
      #dashboard-searx-link (محلي فقط)
      #dashboard-close
    main.dashboard-main
      .dashboard-hero … #dashboard-btn-new-member
      #dashboard-local-statusbar
      #dashboard-toc-nav
      #dashboard-section-overview
        #dashboard-role-welcome → #dashboard-role-welcome-text
        #dashboard-user-profile … (حقول dash-profile-*)
        #dashboard-my-content …
        #dashboard-visitor-counter
      #dashboard-section-data
        #dashboard-card-geo, #dashboard-card-db-backup
      #dashboard-section-projects
        #dashboard-form, #dashboard-list
      #dashboard-letterhead-sheet
      #dashboard-letters
      #dashboard-team …
      #dashboard-uploads …
      #dashboard-permissions …
      #dashboard-user-registry …
      #dashboard-exclusion-archive …
      #dashboard-submissions …
      #dashboard-suggestions …
      #dashboard-staff-roles …
      #dashboard-fund-members …
      #dashboard-membership-reminders …
      #dashboard-accept-representatives …
      #dashboard-add-members-direct …
      #dashboard-staff-evaluation …
      #dashboard-gov-directory …
      #dashboard-business-systems …
      #dashboard-project-analysis …
```

---

## جدول المحتوى (TOC) ↔ الأقسام

| مرساة `#` | معرف تقريبي | مفتاح TOC (مثال) |
|-----------|-------------|-------------------|
| `#dashboard-my-content` | محتوى المستخدم | `dashTocMyContent` |
| `#dashboard-user-profile` | الملف الشخصي | `dashTocMyProfile` |
| `#dashboard-role-welcome` | نظرة عامة | `dashTocOverview` |
| `#dashboard-section-projects` | مشاريع | `dashTocProjects` |
| `#dashboard-letterhead-sheet` | ترويسة | `dashTocLetterhead` |
| `#dashboard-letters` | رسائل وQR | `dashTocLettersQr` |
| `#dashboard-team` | فريق | `dashTocTeam` |
| `#dashboard-uploads` | رفع | `dashTocUploads` |
| `#dashboard-gov-directory` | دليل حكومي | `dashTocGovDirectory` |
| `#dashboard-business-systems` | أعمال | `dashTocBusiness` |
| `#dashboard-project-analysis` | تحليل | `dashTocAnalysis` |
| `#dashboard-staff-roles` | أدوار | `dashTocStaffRoles` |
| `#dashboard-staff-evaluation` | تقييم | `dashTocEvaluations` |
| `#dashboard-fund-members` | أعضاء الصندوق | `dashTocFundMembers` |
| `#dashboard-accept-representatives` | ممثلون | `dashTocRepresentatives` |
| `#dashboard-add-members-direct` | إضافة أعضاء | `dashTocAddMembers` |
| `#dashboard-membership-reminders` | تذكيرات | `dashTocReminders` |
| `#dashboard-section-data` | بيانات | `dashTocDataBackup` |
| `#dashboard-permissions` | صلاحيات | `dashTocPermissions` |
| `#dashboard-user-registry` | مستخدمون | `dashTocUsersMembership` |
| `#dashboard-exclusion-archive` | أرشيف | `dashTocExclusionArchive` |
| `#dashboard-submissions` | طلبات | `dashTocSubmissions` |
| `#dashboard-suggestions` | اقتراحات | `dashTocSuggestions` |

مناطق التسمية: `data-toc-zone="ops" | "hr" | "admin"` على `.dashboard-toc__zone`.

---

## أنماط CSS حرجة

- **`iif-dashboard-fullpage-critical-head`** في `<head>` وقفل لاحق في `body` — **لا تُنقل** إلى ملفات خارجية دون اختبار فتح/إغلاق اللوحة وملء الشاشة.
- بقية أنماط `.dashboard-*` في `<style>` المضمّن — أي استخراج تدريجي يتطلب عدم تغيير `z-index` / `position` للطبقة العليا.

---

## عند إضافة قسم جديد

1. أضف مرساة `id="dashboard-…"` فريدة.
2. أضف رابطاً في `#dashboard-toc-nav` مع `data-i18n` للتسمية.
3. أضف المفاتيح في `i18n.js` (على الأقل `en` / `ar` / `fr` للمنطقة dash|cert|videoCall حسب سياسة المشروع).
4. شغّل `node scripts/check-i18n-keys.js --strict`.

---

*مرتبط بـ: `DESIGN-REFRESH-PLAN.md` — المرحلة D.*
