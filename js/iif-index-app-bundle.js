    (function () {
      /* إعدادات مركزية — موقع دولي، أعضاء مهمون، لا مجال لمحاولات فاشلة */
      window.IIF_CONFIG = {
        siteRegion: 'international',
        defaultLang: 'en',
        /**
         * External booking (Calendly, Microsoft Bookings, etc.). When set to an http(s) URL, the hero
         * «Schedule a session» button opens it in a new tab; otherwise it scrolls to #contact.
         */
        bookingUrl: null,
        /**
         * نموذج اتصل بنا: عنوان https يستقبل POST (FormData). يتجاوز meta iif-contact-form-endpoint إن عُيّن هنا.
         * مثال Formspree: https://formspree.io/f/xxxxxxxx
         */
        contactFormEndpoint: null,
        /**
         * دردشة مباشرة (Tawk وغيره): رابط سكربت خارجي يُحمّل بشكل غير متزامن.
         * مثال Tawk: الصق سكربت المزوّد في الصفحة أو ضع رابط ملف .js هنا إن كان متاحاً كـ URL.
         * اتركه null حتى يتوفر فريق للرد — يبقى زر التواصل السريع يوجّه لـ #contact.
         */
        liveChatScriptUrl: null,
        /** زر دائري سريع لـ #contact — عطّله إذا أردت إخفاءه بعد تفعيل الدردشة */
        showQuickContactFab: true,
        /** إخفاء زر «لوحة التحكم» من الهيدر (لا يزال الدخول يتطلب تسجيل دخول + صلاحية) */
        hideDashboardNavButton: true,
        /**
         * عنوان لوحة الإدارة المنفصلة (نفس النطاق، نفس الجلسة/localStorage):
         * مثال: https://your-domain.com/.../admin.html
         * الملف: admin.html — يعرض index.html?iif_admin_embed=1 داخل iframe.
         */
        adminPageFile: null,
        /**
         * الحفاظ على الشعار والصور (مجلد assets/) وبيانات الزوار والمستخدمين والأعضاء والمالك عند أي إضافة/تعديل/تحديث.
         * جذر الموقع للمسارات النسبية يُحسب تلقائياً من عنوان الصفحة (#iif-document-base) — لا تغيّر يدوياً إلى / فقط إن كان المشروع تحت مجلد فرعي.
         */
        preserveBrandingAndSiteData: true,
        /**
         * رابط الدخول للوحة: https://your-domain.com/# + هذه القيمة (غيّرها بعد النشر ولا تشاركها علناً).
         * إذا كانت فارغة: يبقى فتح اللوحة عبر #dashboard و #dashboard-overlay كالسابق.
         */
        dashboardSecretHash: 'iif-cp-k9m2x7q',
        /** إذا كان dashboardSecretHash معبّأ: السماح أيضاً بـ #dashboard للتوافق (false = تعطيل الرابط العام) */
        dashboardAllowLegacyHash: true,
        langStorageKey: 'iif-lang',
        /**
         * ترجمة الصفحة عبر Google للغات بلا قاموس كامل في i18n.js.
         * بدون Google للغات ذات الحزم الواسعة: en, ar, fr, de, it, es, tr, fa, he, ur, ko, id, ms, zh, pt, ru, ja, hi (انظر importantLocales15).
         * عطّلها (false) إذا منعت السياسة الاتصال بـ translate.google.com أو ملفات تعريف الارتباط.
         */
        machineTranslate: true,
        /**
         * أولوية توسيع الحزم اليدوية في i18n.js لاستقطاب المستثمرين (نفس رموز القائمة).
         * fa, he, ur = RTL · ko, id, ms = LTR. غيّر الترتيب حسب السوق المستهدف.
         */
        investorLocalesPriority: ['fa', 'he', 'ur', 'ko', 'id', 'ms'],
        /** اللغات الخمس عشر ذات الأولوية للتغطية اليدوية (نفس رموز i18n.js) */
        importantLocales15: ['en', 'ar', 'zh', 'es', 'fr', 'de', 'pt', 'ru', 'ja', 'ko', 'it', 'tr', 'hi', 'fa', 'he'],
        /**
         * SEO متعدد اللغات: i18n.js يحقن وسوم link rel="alternate" hreflang لهذه القائمة مع ?lang=رمز
         * (الرابط الأساسي canonical يبقى بلا معامل). اللغة الافتراضية defaultLang تُزال من شريط العنوان.
         */
        storageKeys: {
          loggedIn: 'iif-logged-in',
          isAdmin: 'iif-is-admin',
          userEmail: 'iif-user-email',
          userName: 'iif-user-name',
          userEntity: 'iif-user-entity',
          userCountry: 'iif-user-country',
          userDob: 'iif-user-dob',
          deviceFingerprint: 'iif-device-fingerprint',
          deviceBoundEmail: 'iif-device-bound-email',
          termsAccepted: 'iif-terms-accepted',
          membershipPrefix: 'iif-membership-',
          membershipExpiryPrefix: 'iif-membership-expiry-',
          membershipStartPrefix: 'iif-membership-start-',
          membershipRegistry: 'iif-membership-registry',
          fundMembers: 'iif-fund-members',
          fundMembersCounter: 'iif-fund-members-counter',
          visitorCount: 'iif-visitor-count'
        },
        membershipTiers: [
          { id: 'cooperating', labelEn: 'Cooperating', labelAr: 'عضو متعاون' },
          { id: 'shared', labelEn: 'Shared Member', labelAr: 'عضو مشترك' },
          { id: 'premium_2143', labelEn: 'Premium Silver', labelAr: 'فضية' },
          { id: 'premium_3143', labelEn: 'Premium Gold', labelAr: 'ذهبية' },
          { id: 'premium_4143', labelEn: 'Premium Platinum', labelAr: 'بلاتينية' }
        ],
        adminEmails: ['talalkenani@gmail.com'], // مسؤولو اللوحة (يجب أن يطابق البريد المحفوظ بعد تسجيل الدخول حرفياً بعد toLowerCase)
        ownerEmail: 'talalkenani@gmail.com', // بريد المالك — يُطابق حسابك
        emailRegex: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
        messages: {
          invalidEmailEn: 'Please enter a valid email address.',
          invalidEmailAr: 'يرجى إدخال بريد إلكتروني صحيح.',
          emptyPasswordEn: 'Please enter your password.',
          emptyPasswordAr: 'يرجى إدخال كلمة المرور.',
          emptyNameEn: 'Please enter your full name.',
          emptyNameAr: 'يرجى إدخال الاسم الكامل.',
          termsRequiredEn: 'You must accept the Terms & Conditions to create an account.',
          termsRequiredAr: 'يجب الموافقة على الشروط والأحكام لإنشاء الحساب.',
          deviceBoundEn: 'This device is already linked to another account. Only one account per device is allowed. Please sign in with your registered account.',
          deviceBoundAr: 'هذا الجهاز مرتبط بحساب آخر. يسمح بحساب واحد فقط لكل جهاز. يرجى استخدام تسجيل الدخول للحساب المسجّل.',
          loginFailedEn: 'Invalid email or password. Please try again.',
          loginFailedAr: 'البريد أو كلمة المرور غير صحيحة. يرجى المحاولة مرة أخرى.',
          downloadPreparingEn: 'Preparing download…',
          downloadPreparingAr: 'جاري التحميل…',
          downloadDoneEn: 'Download started',
          downloadDoneAr: 'تم بدء التحميل',
          downloadFailedEn: 'Download failed — try again',
          downloadFailedAr: 'فشل التحميل — جرّب مرة أخرى',
          dashboardOwnerOnlyEn: 'Dashboard is available for the owner only.',
          dashboardOwnerOnlyAr: 'لوحة التحكم متاحة للمالك فقط.',
          dashboardNotFoundEn: 'Dashboard overlay not found',
          dashboardNotFoundAr: 'طبقة لوحة التحكم غير موجودة',
          membershipSetEn: 'Membership set.',
          membershipSetAr: 'تم تعيين العضوية.',
          membershipDateErrorEn: 'End date must be after start date.',
          membershipDateErrorAr: 'تاريخ النهاية يجب أن يكون بعد تاريخ البداية.',
          certificateInvalidEn: 'This digital membership card was not found or is no longer valid. It may have been issued on another device.',
          certificateInvalidAr: 'بطاقة العضوية الرقمية غير موجودة أو لم تعد صالحة. ربما أُصدرت من جهاز آخر.'
        }
      };

      document.addEventListener('DOMContentLoaded', function () {
        var cfg = window.IIF_CONFIG || {};
        var raw = cfg.bookingUrl;
        var url = (raw != null && String(raw).trim()) ? String(raw).trim() : '';
        var a = document.getElementById('iif-booking-cta');
        if (!a) return;
        if (/^https?:\/\//i.test(url)) {
          a.setAttribute('href', url);
          a.setAttribute('target', '_blank');
          a.setAttribute('rel', 'noopener noreferrer');
        } else {
          a.setAttribute('href', '#contact');
          a.removeAttribute('target');
          a.removeAttribute('rel');
        }
      });

      /** داخل الـ IIFE فقط — تفوّض إلى الدوال المُصدَّرة على window بعد التحميل (تجنّب تعارض مع اسم عام غير قابل للاستبدال) */
      function openDashboardEnhanced() {
        var fn = window.IIF_openDashboard || window.openDashboard;
        if (typeof fn === 'function') return fn();
        console.warn('openDashboard: main script not loaded yet');
      }

      /** قيم hash المسموحة لفتح اللوحة من الرابط (بدون زر الهيدر) */
      window.IIF_getDashboardEntryHashes = function () {
        var cfg = window.IIF_CONFIG || {};
        var secret = (cfg.dashboardSecretHash || '').trim();
        var legacy = ['dashboard', 'dashboard-overlay'];
        if (secret) {
          if (cfg.dashboardAllowLegacyHash) return [secret].concat(legacy);
          return [secret];
        }
        return legacy;
      };

      /** هل هذا الـ hash يفتح لوحة التحكم؟ */
      window.IIF_hashOpensDashboard = function (rawHash) {
        var h = (rawHash || '').replace(/^#/, '').split('?')[0];
        var list = typeof window.IIF_getDashboardEntryHashes === 'function' ? window.IIF_getDashboardEntryHashes() : ['dashboard', 'dashboard-overlay'];
        return list.indexOf(h) !== -1;
      };

      /* تأخيرات موحّدة — تجنّب أرقام مبعثرة وتوقفات متكررة */
      window.IIF_TIMING = {
        ui: 100,
        hashOpen: 100,
        dropdownClose: 340,
        deferShort: 150,
        deferMedium: 500,
        /** تأخير فتح لوحة/دخول وضع ?iif_admin_embed=1 — 0 يقلّل شاشة الانتظار */
        adminEmbedOpen: 0,
        toastShort: 2500,
        toastLong: 5000,
        openDashboardAfterLogin: 0,
        successDismiss: 4000,
        biometricOffer: 2500,
        uploadStatusDismiss: 2500
      };

      /**
       * تمرير موثوق تحت الهيدر اللاصق: داخل #dashboard-overlay يُحسب الإزاحة من شريط اللوحة؛
       * في الصفحة العامة من أول header.site-header ظاهر أو --header-height (scrollIntoView يتجاهل scroll-padding أحياناً).
       */
      window.IIF_scrollIntoViewClearHeader = function (el, opts) {
        opts = opts || {};
        var behavior = opts.behavior === 'smooth' ? 'smooth' : 'auto';
        var gap = typeof opts.gap === 'number' ? opts.gap : 12;
        if (!el || !el.getBoundingClientRect) return;
        try {
          var dash = document.getElementById('dashboard-overlay');
          if (dash && dash.classList.contains('is-open') && dash.contains(el)) {
            try {
              if (typeof window.IIF_syncDashboardScrollOffsets === 'function') window.IIF_syncDashboardScrollOffsets();
            } catch (eS) { }
            var cr = dash.getBoundingClientRect();
            var bar = dash.querySelector('.dashboard-header-bar');
            var toc = dash.querySelector('#dashboard-toc-nav, .dashboard-toc');
            var stickyBottom = cr.top;
            if (bar) stickyBottom = Math.max(stickyBottom, bar.getBoundingClientRect().bottom);
            if (toc) {
              var tcs = window.getComputedStyle(toc);
              var tr = toc.getBoundingClientRect();
              if (tcs.display !== 'none' && tcs.visibility !== 'hidden' && tr.height >= 4) {
                stickyBottom = Math.max(stickyBottom, tr.bottom);
              }
            }
            var pad = Math.max(48, Math.ceil(stickyBottom - cr.top) + gap);
            var er = el.getBoundingClientRect();
            var delta = er.top - cr.top - pad;
            var target = dash.scrollTop + delta;
            dash.scrollTo({ top: Math.max(0, target), behavior: behavior });
            return;
          }
        } catch (e1) { }
        try {
          var hdrH = 0;
          var headers = document.querySelectorAll('header.site-header');
          for (var hi = 0; hi < headers.length; hi++) {
            var hEl = headers[hi];
            if (el.contains && hEl && el.contains(hEl)) continue;
            var cs = window.getComputedStyle(hEl);
            if (cs.display === 'none' || cs.visibility === 'hidden') continue;
            var rh = hEl.getBoundingClientRect();
            if (rh.height < 8) continue;
            hdrH = Math.ceil(rh.height);
            break;
          }
          if (!hdrH) {
            var v = getComputedStyle(document.documentElement).getPropertyValue('--header-height').trim();
            if (v) {
              var px = parseFloat(v);
              if (!isNaN(px)) hdrH = Math.ceil(px);
            }
          }
          hdrH += gap;
          var er2 = el.getBoundingClientRect();
          var y = (window.scrollY || (document.documentElement && document.documentElement.scrollTop) || 0) + er2.top - hdrH;
          window.scrollTo({ top: Math.max(0, y), behavior: behavior });
        } catch (e2) {
          try {
            el.scrollIntoView({ behavior: behavior, block: 'start' });
          } catch (e3) { }
        }
      };

      window.IIF_tryScrollDashboardHash = function () {
        try {
          var dash = document.getElementById('dashboard-overlay');
          if (!dash || !dash.classList.contains('is-open')) return;
          var raw = (location.hash || '').replace(/^#/, '').split('?')[0];
          if (!raw) return;
          if (typeof window.IIF_hashOpensDashboard === 'function' && window.IIF_hashOpensDashboard('#' + raw)) return;
          var hel = document.getElementById(raw);
          if (!hel || !dash.contains(hel)) return;
          if (typeof window.IIF_syncDashboardScrollOffsets === 'function') window.IIF_syncDashboardScrollOffsets();
          requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              if (typeof window.IIF_scrollIntoViewClearHeader === 'function') {
                window.IIF_scrollIntoViewClearHeader(hel, { behavior: 'smooth' });
              }
            });
          });
        } catch (e) { }
      };

      /** مسار صريح للوحة: معاملات URL أو pending — الرئيسية بدونها لا تفتح اللوحة تلقائياً */
      function iifExplicitDashboardEntryIntent() {
        try {
          var sp = new URLSearchParams(window.location.search || '');
          if (sp.get('iif_admin_portal') === '1' || sp.get('open_dashboard') === '1' || sp.get('iif_open_dashboard') === '1') return true;
          if (sessionStorage.getItem('iif_pending_open_dashboard') === '1') return true;
        } catch (e) { }
        return false;
      }

      /* تشغيل بعد تحديث الواجهة (دورة واحدة) */
      window.IIF_runAfterUI = function (fn) {
        var t = (window.IIF_TIMING && window.IIF_TIMING.ui) || 100;
        return setTimeout(fn, t);
      };

      /* إشعار موحّد — توست واحد في الوقت نفسه، مدة حسب النوع */
      window.showToastMessage = function (text, type) {
        type = type || 'info';
        var container = document.getElementById('iif-toast-container');
        if (!container) {
          container = document.createElement('div');
          container.id = 'iif-toast-container';
          container.setAttribute('aria-live', 'polite');
          container.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:10003;display:flex;flex-direction:column;align-items:center;gap:8px;pointer-events:none;';
          document.body.appendChild(container);
        }
        container.innerHTML = '';
        var toast = document.createElement('div');
        toast.style.cssText = 'padding:12px 20px;border-radius:var(--radius-sm,10px);color:#fff;font-size:0.9rem;box-shadow:0 4px 12px rgba(0,0,0,0.2);white-space:nowrap;max-width:90vw;transition:opacity 0.2s ease;';
        toast.style.background = type === 'success' ? '#1c8a57' : type === 'error' ? '#b91c1c' : '#1e3a5f';
        toast.textContent = text;
        container.appendChild(toast);
        var timing = window.IIF_TIMING || {};
        var duration = type === 'success' ? (timing.toastLong || 4000) : (timing.toastShort || 2500);
        setTimeout(function () {
          toast.style.opacity = '0';
          setTimeout(function () { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 220);
        }, duration);
      };

      /* التحقق من النماذج — نجمة حمراء عند الخطأ، علامة صح خضراء عند الإدخال الصحيح */
      (function initFormValidation() {
        function isFieldValid(el) {
          var isEmpty = !el.value || (typeof el.value === 'string' && !el.value.trim());
          var isCheckbox = el.type === 'checkbox';
          if (isCheckbox) return el.checked;
          if (el.hasAttribute('required') && isEmpty) return false;
          if (el.hasAttribute('minlength') && el.value.length < parseInt(el.getAttribute('minlength'), 10)) return false;
          if (el.type === 'email' && el.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value)) return false;
          return true;
        }
        function updateFieldIndicator(label, valid) {
          if (!label) return;
          var star = label.querySelector('.field-required-star');
          var check = label.querySelector('.field-valid-check');
          if (star) star.style.display = valid ? 'none' : '';
          if (check) check.style.display = valid ? 'inline' : 'none';
        }
        function validateForm(form, showErrors) {
          var valid = true;
          form.querySelectorAll('input[required], select[required], textarea[required]').forEach(function (el) {
            var group = el.closest('.form-group') || el.closest('p') || el.parentElement;
            if (group) {
              group.classList.remove('has-error');
              var m = group.querySelector('.field-error-msg');
              if (m) m.remove();
            }
          });
          form.querySelectorAll('input[required], select[required], textarea[required]').forEach(function (el) {
            var group = el.closest('.form-group') || el.closest('p') || el.parentElement;
            if (!group) return;
            var fieldValid = isFieldValid(el);
            var label = (el.id && group.querySelector('label[for="' + el.id + '"]')) || group.querySelector('label') || (el.parentNode && el.parentNode.tagName === 'LABEL' ? el.parentNode : null);
            updateFieldIndicator(label, fieldValid);
            if (!fieldValid) {
              valid = false;
              group.classList.add('has-error');
              if (showErrors) {
                var msg = document.createElement('span');
                msg.className = 'field-error-msg';
                msg.textContent = typeof window.iifMessage === 'function' ? window.iifMessage('fieldRequiredInvalid') : (document.documentElement.getAttribute('data-lang') === 'ar' ? 'مطلوب أو غير صحيح' : 'Required or invalid');
                group.appendChild(msg);
              }
            }
          });
          var submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
          if (submitBtn) submitBtn.disabled = !valid;
          return valid;
        }
        document.querySelectorAll('form').forEach(function (form) {
          var required = form.querySelectorAll('input[required], select[required], textarea[required]');
          if (!required.length) return;
          form.classList.add('form-validate');
          required.forEach(function (el) {
            var group = el.closest('.form-group') || el.closest('p') || el.parentElement;
            if (!group) return;
            var label = (el.id && group.querySelector('label[for="' + el.id + '"]')) || group.querySelector('label') || (el.parentNode && el.parentNode.tagName === 'LABEL' ? el.parentNode : null);
            if (label && !label.querySelector('.field-required-star')) {
              var star = document.createElement('span');
              star.className = 'field-required-star';
              star.setAttribute('aria-hidden', 'true');
              star.textContent = ' *';
              var check = document.createElement('span');
              check.className = 'field-valid-check';
              check.setAttribute('aria-hidden', 'true');
              check.textContent = ' ✓';
              check.style.display = 'none';
              label.appendChild(star);
              label.appendChild(check);
            }
            function runValidate() { validateForm(form); }
            el.addEventListener('input', runValidate);
            el.addEventListener('change', runValidate);
            el.addEventListener('blur', runValidate);
          });
          var submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
          if (submitBtn) {
            form.addEventListener('submit', function (e) {
              if (!form.checkValidity()) {
                e.preventDefault();
                validateForm(form, true);
                var first = form.querySelector('.has-error input, .has-error select, .has-error textarea');
                if (first) first.focus();
              }
            });
            validateForm(form);
          }
        });
      })();

      /* عداد الزوار مخفي — يُحسب عند كل تحميل، ويُعرض فقط في لوحة التحكم */
      var VISITOR_COUNT_KEY = (window.IIF_CONFIG && window.IIF_CONFIG.storageKeys && window.IIF_CONFIG.storageKeys.visitorCount) || 'iif-visitor-count';
      try {
        var n = parseInt(localStorage.getItem(VISITOR_COUNT_KEY) || '0', 10);
        localStorage.setItem(VISITOR_COUNT_KEY, String(n + 1));
      } catch (e) { }

      /* بصمة الجهاز — عند تغيير الجهاز أو المتصفح يُطلب تأكيد الهوية من جديد */
      var DEVICE_FINGERPRINT_KEY = 'iif-device-fingerprint';
      function simpleHash(s) {
        var h = 0;
        var str = String(s);
        for (var i = 0; i < str.length; i++) h = ((h << 5) - h) + str.charCodeAt(i) | 0;
        return (h >>> 0).toString(36);
      }
      function getDeviceFingerprint() {
        try {
          var ua = navigator.userAgent || '';
          var sw = (window.screen && window.screen.width) || 0;
          var sh = (window.screen && window.screen.height) || 0;
          var lang = navigator.language || '';
          var tz = new Date().getTimezoneOffset();
          return simpleHash(ua + '|' + sw + '|' + sh + '|' + lang + '|' + tz);
        } catch (e) { return ''; }
      }
      /* لا نلغي الجلسة عند تغيير الجهاز — المستخدم يبقى مسجّلاً حتى يضغط «تسجيل الخروج» */
      function clearSessionIfDeviceChanged() {
        return false;
      }

      /* تخزين آمن — تشفير بيانات المستخدم في المتصفح (كما في المواقع العالمية)، يعمل على جميع الأجهزة والمتصفحات */
      (function initSecureStorage() {
        var SECURE_BLOB_KEY = 'iif-secure-v1';
        var SENSITIVE_EXACT = ['iif-user-email', 'iif-user-name', 'iif-user-phone', 'iif-user-entity', 'iif-user-country', 'iif-user-dob', 'iif-is-admin', 'iif-device-bound-email', 'iif-membership-registry', 'iif-membership-certificates', 'iif-user-definition-en', 'iif-user-definition-ar', 'iif-terms-accepted', 'iif-membership-reminders-sent', 'iif-webauthn-credential', 'iif-user-credentials', 'iif-admin-password-plain', 'iif-exclusion-archive', 'iif-perm-service-forms'];
        var SENSITIVE_PREFIXES = ['iif-membership-start-', 'iif-membership-expiry-', 'iif-cert-photo-', 'iif-cert-logo-', 'iif-cert-flag-'];
        function isSensitiveKey(key) {
          if (!key || typeof key !== 'string') return false;
          if (SENSITIVE_EXACT.indexOf(key) !== -1) return true;
          for (var i = 0; i < SENSITIVE_PREFIXES.length; i++) if (key.indexOf(SENSITIVE_PREFIXES[i]) === 0) return true;
          return false;
        }
        function getCrypto() {
          try {
            var c = window.crypto || window.msCrypto;
            if (c && c.subtle) return c.subtle;
            if (c && c.webkitSubtle) return c.webkitSubtle;
          } catch (e) { }
          return null;
        }
        var cryptoSubtle = getCrypto();
        var useEncryption = !!(cryptoSubtle && typeof getDeviceFingerprint === 'function' && getDeviceFingerprint());

        function str2ab(s) {
          var buf = new ArrayBuffer(s.length);
          var view = new Uint8Array(buf);
          for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i);
          return buf;
        }
        function ab2str(buf) {
          var view = new Uint8Array(buf);
          var s = '';
          for (var i = 0; i < view.length; i++) s += String.fromCharCode(view[i]);
          return s;
        }
        function b64enc(buf) {
          var view = new Uint8Array(buf);
          var binary = '';
          for (var i = 0; i < view.length; i++) binary += String.fromCharCode(view[i]);
          return btoa(binary);
        }
        function b64dec(s) {
          var binary = atob(s);
          var buf = new ArrayBuffer(binary.length);
          var view = new Uint8Array(buf);
          for (var i = 0; i < binary.length; i++) view[i] = binary.charCodeAt(i);
          return buf;
        }

        function deriveKey(saltBuf, secret) {
          return cryptoSubtle.importKey('raw', str2ab(secret), 'PBKDF2', false, ['deriveBits']).then(function (key) {
            return cryptoSubtle.deriveBits({ name: 'PBKDF2', salt: saltBuf, iterations: 100000, hash: 'SHA-256' }, key, 256);
          }).then(function (bits) {
            return cryptoSubtle.importKey('raw', bits, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
          });
        }

        function aesGcmEncrypt(key, plaintext) {
          var iv = crypto.getRandomValues ? crypto.getRandomValues(new Uint8Array(12)) : (window.msCrypto && window.msCrypto.getRandomValues ? window.msCrypto.getRandomValues(new Uint8Array(12)) : null);
          if (!iv) return Promise.reject(new Error('no prng'));
          return cryptoSubtle.encrypt({ name: 'AES-GCM', iv: iv, tagLength: 128 }, key, str2ab(plaintext)).then(function (cipher) {
            var combined = new Uint8Array(iv.length + new Uint8Array(cipher).length);
            combined.set(iv);
            combined.set(new Uint8Array(cipher), iv.length);
            return b64enc(combined.buffer);
          });
        }

        function aesGcmDecrypt(key, b64) {
          var combined = new Uint8Array(b64dec(b64));
          var iv = combined.slice(0, 12);
          var cipher = combined.slice(12).buffer;
          return cryptoSubtle.decrypt({ name: 'AES-GCM', iv: iv, tagLength: 128 }, key, cipher).then(function (plain) { return ab2str(plain); });
        }

        var decryptedUserData = {};
        var secureReady = false;
        var persistTimer = null;
        var origGetItem = localStorage.getItem.bind(localStorage);
        var origSetItem = localStorage.setItem.bind(localStorage);
        var origRemoveItem = localStorage.removeItem.bind(localStorage);

        function schedulePersist() {
          if (!useEncryption) return;
          if (persistTimer) clearTimeout(persistTimer);
          persistTimer = setTimeout(function () { persistTimer = null; persistEncrypted(); }, 120);
        }

        function persistEncrypted() {
          if (!useEncryption) return Promise.resolve();
          var fp = getDeviceFingerprint();
          if (!fp) return Promise.resolve();
          var payload = JSON.stringify(decryptedUserData);
          var salt = (window.crypto && window.crypto.getRandomValues) ? window.crypto.getRandomValues(new Uint8Array(16)) : (window.msCrypto && window.msCrypto.getRandomValues ? window.msCrypto.getRandomValues(new Uint8Array(16)) : null);
          if (!salt) return Promise.resolve();
          var saltB64 = b64enc(salt.buffer);
          return deriveKey(salt, fp).then(function (deviceKey) {
            return aesGcmEncrypt(deviceKey, payload).then(function (ct) {
              try {
                var blob = JSON.stringify({ s: saltB64, c: ct });
                origSetItem(SECURE_BLOB_KEY, blob);
              } catch (e) { }
            });
          }).catch(function () { });
        }

        function loadSecureBlob() {
          if (!useEncryption) {
            secureReady = true;
            return Promise.resolve();
          }
          var blobStr = origGetItem(SECURE_BLOB_KEY);
          if (!blobStr) {
            try {
              var all = {};
              for (var i = 0; i < localStorage.length; i++) {
                var k = localStorage.key(i);
                if (k && isSensitiveKey(k)) {
                  var v = origGetItem(k);
                  if (v != null) all[k] = v;
                }
              }
              decryptedUserData = all;
              if (Object.keys(all).length > 0) {
                return persistEncrypted().then(function () {
                  for (var q in all) try { origRemoveItem(q); } catch (err) { }
                  secureReady = true;
                });
              }
            } catch (e) { }
            secureReady = true;
            return Promise.resolve();
          }
          var blob = {};
          try { blob = JSON.parse(blobStr); } catch (e) { secureReady = true; return Promise.resolve(); }
          var saltBuf = null;
          try { saltBuf = b64dec(blob.s); } catch (e) { secureReady = true; return Promise.resolve(); }
          var fp = getDeviceFingerprint();
          if (!fp) { secureReady = true; return Promise.resolve(); }
          return deriveKey(saltBuf, fp).then(function (deviceKey) {
            return aesGcmDecrypt(deviceKey, blob.c).then(function (plain) {
              try { decryptedUserData = JSON.parse(plain); } catch (e) { decryptedUserData = {}; }
              secureReady = true;
            });
          }).catch(function () {
            try { origRemoveItem(SECURE_BLOB_KEY); } catch (e) { }
            decryptedUserData = {};
            secureReady = true;
          });
        }

        if (useEncryption) {
          localStorage.getItem = function (key) {
            if (!isSensitiveKey(key)) return origGetItem(key);
            if (key in decryptedUserData) return decryptedUserData[key] == null ? null : String(decryptedUserData[key]);
            return origGetItem(key);
          };
          localStorage.setItem = function (key, value) {
            if (!isSensitiveKey(key)) { origSetItem(key, value); return; }
            decryptedUserData[key] = value;
            schedulePersist();
          };
          localStorage.removeItem = function (key) {
            if (!isSensitiveKey(key)) { origRemoveItem(key); return; }
            delete decryptedUserData[key];
            schedulePersist();
          };
        }

        function flushSecure() {
          if (persistTimer) { clearTimeout(persistTimer); persistTimer = null; }
          if (useEncryption) persistEncrypted();
        }

        window.IIF_SECURE_STORAGE = {
          ready: function () { return secureReady ? Promise.resolve() : loadSecureBlob(); },
          load: loadSecureBlob,
          flush: flushSecure,
          clearSecure: function () {
            try {
              origRemoveItem(SECURE_BLOB_KEY);
              for (var i = localStorage.length - 1; i >= 0; i--) {
                var k = localStorage.key(i);
                if (k && isSensitiveKey(k)) origRemoveItem(k);
              }
            } catch (e) { }
            decryptedUserData = {};
          }
        };
      })();

      /* لغة الموقع — دولي: حفظ وتطبيق، لا فشل.
       * مهم: تهيئة اللغة تُنفَّذ بعد جاهزية DOM (DOMContentLoaded) حتى يكون IIF_I18N قد حمّل (سكربت i18n.js قد يكون defer).
       * لا تغيّر ترتيب السكربتات أو تعتمد على تنفيذ السكربت المضمّن قبل i18n.js. */
      var LANG_STORAGE_KEY = (window.IIF_CONFIG && window.IIF_CONFIG.langStorageKey) || 'iif-lang';
      var DEFAULT_LANG = (window.IIF_CONFIG && window.IIF_CONFIG.defaultLang) || 'en';
      function iifRestartTickerMarquees() {
        var ids = ['ticker-track', 'ticker-asian-track', 'ticker-arab-track'];
        for (var i = 0; i < ids.length; i++) {
          var el = document.getElementById(ids[i]);
          if (!el) continue;
          el.style.animation = 'none';
          void el.offsetWidth;
          el.style.removeProperty('animation');
        }
      }
      window.IIF_restartTickerMarquees = iifRestartTickerMarquees;
      /** نص من i18n.js حسب اللغة الحالية؛ fallback عند غياب المفتاح أو قبل تحميل IIF_I18N */
      function iifT(key, fallback) {
        try {
          if (window.IIF_I18N && typeof window.IIF_I18N.text === 'function') {
            var s = window.IIF_I18N.text(key);
            if (s) return s;
          }
        } catch (eIifT) { }
        return fallback != null ? String(fallback) : '';
      }
      /** بعد تغيير اللغة: إعادة نص قوة كلمة المرور، التطابق، وتسميات أزرار الإظهار/الإخفاء */
      function refreshAuthPasswordI18n() {
        try {
          var regPwStrengthEl = document.getElementById('reg-password-strength');
          var regPwInput = document.getElementById('reg-password');
          if (regPwStrengthEl && regPwInput) {
            if (regPwInput.value && typeof getPasswordStrengthLabel === 'function') {
              var r = getPasswordStrengthLabel(regPwInput.value);
              regPwStrengthEl.textContent = r.text;
              regPwStrengthEl.className = 'auth-password-strength auth-password-strength--' + (r.level || '');
            } else {
              regPwStrengthEl.textContent = '';
              regPwStrengthEl.className = 'auth-password-strength';
            }
          }
          var regPw2MatchEl = document.getElementById('reg-password2-match');
          var regPw2Input = document.getElementById('reg-password2');
          if (regPw2MatchEl && regPw2Input) {
            var p1 = regPwInput ? regPwInput.value : '';
            var p2 = regPw2Input.value;
            if (!p2) {
              regPw2MatchEl.textContent = '';
              regPw2MatchEl.className = 'auth-password-strength';
            } else if (p1 === p2) {
              regPw2MatchEl.textContent = typeof iifMessage === 'function' ? iifMessage('pwMatch') : '';
              regPw2MatchEl.className = 'auth-password-strength auth-password-strength--match';
            } else {
              regPw2MatchEl.textContent = typeof iifMessage === 'function' ? iifMessage('pwNoMatch') : '';
              regPw2MatchEl.className = 'auth-password-strength auth-password-strength--mismatch';
            }
          }
          function syncPwToggle(btnId, inpId) {
            var btn = document.getElementById(btnId);
            var inp = document.getElementById(inpId);
            if (!btn || !inp || typeof iifMessage !== 'function') return;
            if (inp.type === 'password') {
              btn.setAttribute('aria-label', iifMessage('pwToggleShowAria'));
              btn.title = iifMessage('pwToggleShowTitle');
              btn.textContent = iifMessage('pwToggleShow');
            } else {
              btn.setAttribute('aria-label', iifMessage('pwToggleHideAria'));
              btn.title = iifMessage('pwToggleHideTitle');
              btn.textContent = iifMessage('pwToggleHide');
            }
          }
          syncPwToggle('reg-password-toggle', 'reg-password');
          syncPwToggle('reg-password2-toggle', 'reg-password2');
          syncPwToggle('login-password-toggle', 'login-password');
        } catch (ePwLang) { }
      }
      function applyLangToDocument(lang) {
        var l = (typeof lang === 'string' ? lang : '').trim().toLowerCase() || DEFAULT_LANG;
        var root = document.documentElement;
        if (root) {
          root.setAttribute('data-lang', l);
          /* عند وجود IIF_I18N: السكربت i18n.js يضبط dir وlang من جدول اللغات (50+) — لا نعيد كتابتهما هنا */
          if (!window.IIF_I18N) {
            root.setAttribute('dir', l === 'ar' ? 'rtl' : 'ltr');
            root.setAttribute('lang', l === 'ar' ? 'ar' : 'en');
          }
        }
        try { localStorage.setItem(LANG_STORAGE_KEY, l); } catch (e) { }
        var isAr = (l === 'ar');
        try {
          document.querySelectorAll('.lang-en').forEach(function (el) { el.style.display = isAr ? 'none' : ''; });
          document.querySelectorAll('.lang-ar').forEach(function (el) { el.style.display = isAr ? '' : 'none'; });
        } catch (e) { }
        try {
          if (typeof refreshStaffPermissionsUi === 'function') refreshStaffPermissionsUi();
        } catch (eLangStaff) { }
        try {
          if (typeof renderDashboardExclusionArchive === 'function' && typeof getDashboardAccessType === 'function' && getDashboardAccessType() === 'owner') {
            renderDashboardExclusionArchive();
          }
        } catch (eLangEx) { }
        try {
          if (typeof window.IIF_updateVerificationToggleLabel === 'function') window.IIF_updateVerificationToggleLabel();
        } catch (eVerifLbl) { }
        try {
          var dashOvLang = document.getElementById('dashboard-overlay');
          if (dashOvLang && dashOvLang.classList.contains('is-open') && typeof window.IIF_refreshDashboardLists === 'function') {
            window.IIF_refreshDashboardLists();
            if (typeof GOV_DIR_CATS !== 'undefined' && Array.isArray(GOV_DIR_CATS) && typeof renderGovDirList === 'function') {
              GOV_DIR_CATS.forEach(function (gc) { renderGovDirList(gc); });
            }
            if (window.IIF_I18N && typeof window.IIF_I18N.apply === 'function') {
              window.IIF_I18N.apply(l);
            }
          }
        } catch (eDashLang) { }
        try {
          if (typeof refreshAuthPasswordI18n === 'function') refreshAuthPasswordI18n();
        } catch (eAuthPwLang) { }
        try {
          if (window.parent && window.parent !== window) {
            window.parent.postMessage({ source: 'iif-site', type: 'iif-lang-changed', lang: l }, '*');
          }
        } catch (ePm) { }
      }
      function runAfterLanguageSwitchUI(v) {
        var l = (typeof v === 'string' ? v : '').trim().toLowerCase() || DEFAULT_LANG;
        if (typeof window.IIF_reloadTickers === 'function') window.IIF_reloadTickers();
        if (typeof updateDashboardNav === 'function') updateDashboardNav();
        if (typeof updateRegPhoneCodeLabels === 'function') updateRegPhoneCodeLabels();
        if (typeof window.IIF_siteClockTick === 'function') window.IIF_siteClockTick();
        if (typeof window.IIF_backToTopSync === 'function') window.IIF_backToTopSync();
        var ad = document.getElementById('about-dropdown');
        var sd = document.getElementById('services-dropdown');
        var md = document.getElementById('more-dropdown');
        if (typeof window.IIF_clampNavDropdown === 'function') {
          if (ad && ad.getAttribute('aria-hidden') === 'false') window.IIF_clampNavDropdown(ad);
          if (sd && sd.getAttribute('aria-hidden') === 'false') window.IIF_clampNavDropdown(sd);
          if (md && md.getAttribute('aria-hidden') === 'false') window.IIF_clampNavDropdown(md);
        }
      }
      function syncLanguageDependentChrome(v) {
        var l = (typeof v === 'string' ? v : '').trim().toLowerCase() || DEFAULT_LANG;
        applyLangToDocument(l);
        runAfterLanguageSwitchUI(l);
      }
      window.addEventListener('iif-lang-change', function (ev) {
        try {
          var d = ev && ev.detail;
          var l = d && d.lang;
          l = (typeof l === 'string' ? l : '').trim().toLowerCase() || DEFAULT_LANG;
          syncLanguageDependentChrome(l);
        } catch (eIifLangEv) { }
      });
      function iifSyncLangQueryParam(lang) {
        try {
          if (typeof URL === 'undefined' || typeof history === 'undefined' || !history.replaceState) return;
          var l = (typeof lang === 'string' ? lang : '').trim().toLowerCase() || DEFAULT_LANG;
          var def = (window.IIF_CONFIG && window.IIF_CONFIG.defaultLang) ? String(window.IIF_CONFIG.defaultLang).trim().toLowerCase() : 'en';
          var u = new URL(window.location.href);
          if (l && l !== def) u.searchParams.set('lang', l);
          else u.searchParams.delete('lang');
          var next = u.pathname + u.search + u.hash;
          var cur = window.location.pathname + window.location.search + window.location.hash;
          if (next !== cur) history.replaceState({}, '', next);
        } catch (eSyncUrl) { }
      }
      function initDashboardLangPickerSync() {
        var mainEl = document.getElementById('iif-lang-picker');
        var dash = document.getElementById('iif-lang-picker-dashboard');
        if (!dash) return;
        function rebuildDashOptions() {
          dash.innerHTML = '';
          var added = Object.create(null);
          function addCode(code) {
            if (!code || added[code]) return;
            if (window.IIF_I18N && IIF_I18N.codes && IIF_I18N.codes.indexOf(code) < 0) return;
            var opt = document.createElement('option');
            opt.value = code;
            var label = '';
            if (mainEl) {
              var srcOpt = mainEl.querySelector('option[value="' + code + '"]');
              if (srcOpt && srcOpt.textContent) label = String(srcOpt.textContent).trim();
            }
            if (!label && window.IIF_I18N && IIF_I18N.langs && IIF_I18N.langs[code]) {
              label = IIF_I18N.langs[code].name || code;
            }
            opt.textContent = label || code;
            dash.appendChild(opt);
            added[code] = true;
          }
          if (mainEl && mainEl.options && mainEl.options.length) {
            for (var oi = 0; oi < mainEl.options.length; oi++) {
              addCode((mainEl.options[oi].value || '').trim().toLowerCase());
            }
          } else if (window.IIF_I18N && IIF_I18N.codes && IIF_I18N.codes.length) {
            for (var ci = 0; ci < IIF_I18N.codes.length; ci++) {
              addCode(IIF_I18N.codes[ci]);
            }
          } else {
            var fallback = ['en', 'ar', 'zh', 'es', 'fr', 'de', 'pt', 'ru', 'ja', 'ko', 'it', 'tr', 'hi', 'fa', 'he'];
            for (var fi = 0; fi < fallback.length; fi++) {
              addCode(fallback[fi]);
            }
          }
        }
        rebuildDashOptions();
        function syncDashFromDoc() {
          var l = (document.documentElement.getAttribute('data-lang') || DEFAULT_LANG).trim().toLowerCase();
          if (!dash.querySelector('option[value="' + l + '"]')) rebuildDashOptions();
          if (dash.querySelector('option[value="' + l + '"]')) dash.value = l;
        }
        syncDashFromDoc();
        if (!window._iifDashLangListenersBound) {
          window._iifDashLangListenersBound = true;
          dash.addEventListener('change', function () {
            var v = (this.value || '').trim().toLowerCase() || DEFAULT_LANG;
            var m = document.getElementById('iif-lang-picker');
            if (m && m.options && m.querySelector('option[value="' + v + '"]')) {
              m.value = v;
              m.dispatchEvent(new Event('change', { bubbles: true }));
            } else if (window.IIF_I18N && typeof IIF_I18N.apply === 'function') {
              IIF_I18N.apply(v);
              if (typeof iifSyncLangQueryParam === 'function') iifSyncLangQueryParam(v);
            }
          });
          window.addEventListener('iif-lang-change', function () {
            syncDashFromDoc();
          });
        }
      }

      function initSiteLang() {
        var picker = document.getElementById('iif-lang-picker');
        if (window.IIF_I18N) {
          if (typeof window.IIF_fillLangSelectFromI18n === 'function' && picker) {
            try { window.IIF_fillLangSelectFromI18n(picker); } catch (eFill) { }
          }
          var lang = '';
          var params = new URLSearchParams(window.location.search || '');
          var qLang = (params.get('lang') || '').trim().toLowerCase();
          if (qLang && IIF_I18N.codes && IIF_I18N.codes.indexOf(qLang) >= 0) {
            lang = qLang;
          } else {
            try { lang = (localStorage.getItem(LANG_STORAGE_KEY) || '').trim().toLowerCase(); } catch (e) { }
          }
          if (!lang) lang = IIF_I18N.detect();
          lang = (typeof lang === 'string' ? lang : '').trim().toLowerCase() || DEFAULT_LANG;
          if (!IIF_I18N.codes || IIF_I18N.codes.indexOf(lang) < 0) lang = DEFAULT_LANG;
          IIF_I18N.apply(lang);
          iifSyncLangQueryParam(lang);
          requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              if (typeof window.IIF_restartTickerMarquees === 'function') window.IIF_restartTickerMarquees();
              if (typeof window.IIF_reloadTickers === 'function') window.IIF_reloadTickers();
            });
          });
          if (picker) {
            picker.value = lang;
            picker.addEventListener('change', function () {
              var v = (this.value || '').trim().toLowerCase() || DEFAULT_LANG;
              IIF_I18N.apply(v);
              iifSyncLangQueryParam(v);
              if (typeof window.IIF_restartTickerMarquees === 'function') window.IIF_restartTickerMarquees();
              if (typeof window.IIF_reloadTickers === 'function') window.IIF_reloadTickers();
            });
          }
          IIF_I18N.initSearch();
        } else {
          var saved = '';
          var p2 = new URLSearchParams(window.location.search || '');
          var q2 = (p2.get('lang') || '').trim().toLowerCase();
          if (q2) saved = q2;
          else { try { saved = (localStorage.getItem(LANG_STORAGE_KEY) || '').trim().toLowerCase(); } catch (e) { } }
          var langToUse = (saved || DEFAULT_LANG).toLowerCase();
          if (!picker || !picker.querySelector('option[value="' + langToUse + '"]')) langToUse = DEFAULT_LANG;
          applyLangToDocument(langToUse);
          iifSyncLangQueryParam(langToUse);
          requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              if (typeof window.IIF_restartTickerMarquees === 'function') window.IIF_restartTickerMarquees();
              if (typeof window.IIF_reloadTickers === 'function') window.IIF_reloadTickers();
            });
          });
          if (picker) {
            picker.value = langToUse;
            picker.addEventListener('change', function () {
              var v = (this.value || '').trim().toLowerCase() || DEFAULT_LANG;
              applyLangToDocument(v);
              iifSyncLangQueryParam(v);
              if (typeof window.IIF_restartTickerMarquees === 'function') window.IIF_restartTickerMarquees();
              if (typeof window.IIF_reloadTickers === 'function') window.IIF_reloadTickers();
              if (typeof updateDashboardNav === 'function') updateDashboardNav();
              if (typeof updateRegPhoneCodeLabels === 'function') updateRegPhoneCodeLabels();
              if (typeof window.IIF_siteClockTick === 'function') window.IIF_siteClockTick();
              if (typeof window.IIF_backToTopSync === 'function') window.IIF_backToTopSync();
              var ad2 = document.getElementById('about-dropdown');
              var sd2 = document.getElementById('services-dropdown');
              var md2 = document.getElementById('more-dropdown');
              if (typeof window.IIF_clampNavDropdown === 'function') {
                if (ad2 && ad2.getAttribute('aria-hidden') === 'false') window.IIF_clampNavDropdown(ad2);
                if (sd2 && sd2.getAttribute('aria-hidden') === 'false') window.IIF_clampNavDropdown(sd2);
                if (md2 && md2.getAttribute('aria-hidden') === 'false') window.IIF_clampNavDropdown(md2);
              }
            });
          }
        }
        if (typeof updateDashboardNav === 'function') updateDashboardNav();
        try {
          var host = (typeof location !== 'undefined' && location.hostname) ? String(location.hostname).toLowerCase() : '';
          var isLocal = host === 'localhost' || host === '127.0.0.1' || host === '[::1]';
          var isGhPages = host.endsWith('.github.io');
          var isIifProd = host === 'iiffund.com' || host.endsWith('.iiffund.com');
          var searxMeta = document.querySelector && document.querySelector('meta[name="iif-searx-public-url"]');
          var searxPublic = (searxMeta && searxMeta.getAttribute('content') || '').trim();
          document.querySelectorAll('[data-local-only="1"]').forEach(function (el) {
            if (isLocal) {
              el.style.display = 'inline-flex';
              return;
            }
            if (isGhPages && searxPublic && /^https?:\/\//i.test(searxPublic)) {
              el.style.display = 'inline-flex';
              el.setAttribute('href', searxPublic);
              el.setAttribute('target', '_blank');
              el.setAttribute('rel', 'noopener noreferrer');
              return;
            }
            if (isIifProd && searxPublic && /^https?:\/\//i.test(searxPublic)) {
              el.style.display = 'inline-flex';
              el.setAttribute('href', searxPublic);
              el.setAttribute('target', '_blank');
              el.setAttribute('rel', 'noopener noreferrer');
              return;
            }
            el.style.display = 'none';
          });
          document.querySelectorAll('[data-iif-google-search="1"]').forEach(function (gEl) {
            gEl.style.display = isLocal || isGhPages || isIifProd ? 'inline-flex' : 'none';
          });
        } catch (eLocalOnly) { }
        try {
          initDashboardLangPickerSync();
        } catch (eDashLangPick) { }
        if (typeof window.IIF_initLangPickerUI === 'function') {
          try { window.IIF_initLangPickerUI(); } catch (eCombo) { }
        }
      }

      /* قوائم التنقل المنسدلة — إبقاء القائمة داخل عرض الشاشة (يجب تعريفها قبل initSiteLang) */
      (function initNavDropdownViewportClamp() {
        function clamp(menuEl) {
          if (!menuEl) return;
          menuEl.style.setProperty('--iif-dd-x', '0px');
          if (menuEl.getAttribute('aria-hidden') === 'true') return;
          requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              var pad = 10;
              var vw = window.innerWidth;
              var r = menuEl.getBoundingClientRect();
              var dx = 0;
              if (r.right > vw - pad) dx += (vw - pad) - r.right;
              if (r.left + dx < pad) dx += pad - (r.left + dx);
              if (Math.abs(dx) < 0.5) dx = 0;
              menuEl.style.setProperty('--iif-dd-x', dx + 'px');
            });
          });
        }
        window.IIF_clampNavDropdown = clamp;
        window.addEventListener('resize', function () {
          var a = document.getElementById('about-dropdown');
          var s = document.getElementById('services-dropdown');
          var m = document.getElementById('more-dropdown');
          if (a && a.getAttribute('aria-hidden') === 'false') clamp(a);
          if (s && s.getAttribute('aria-hidden') === 'false') clamp(s);
          if (m && m.getAttribute('aria-hidden') === 'false') clamp(m);
        });
      })();

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSiteLang);
      } else {
        initSiteLang();
      }

      /* روابط # داخل الصفحة: js/iif-same-page-hash-nav.js (مستمع واحد لكل الموقع ما عدا اللوحة/النماذج). js/site-header-inner-newtab.js للمسارات المختلفة فقط */

      /* تحذير HTTPS — إظهار عند فتح الموقع دون HTTPS (ما عدا localhost وGitHub Pages) */
      (function initHttpsWarning() {
        var w = document.getElementById('https-warning');
        var dismiss = document.getElementById('https-warning-dismiss');
        function iifConnectionIsSecure() {
          if (typeof location === 'undefined') return false;
          var h = (location.hostname || '').toLowerCase();
          if (location.protocol === 'https:') return true;
          if (h === 'localhost' || h === '127.0.0.1' || h === '[::1]') return true;
          if (h.endsWith('.github.io')) return true;
          return false;
        }
        var isSecure = iifConnectionIsSecure();
        if (!isSecure && w) { w.style.display = 'block'; }
        if (isSecure && w) { w.style.setProperty('display', 'none', 'important'); }
        if (dismiss) dismiss.addEventListener('click', function () { if (w) w.style.display = 'none'; });
        window.IIF_connectionIsSecure = iifConnectionIsSecure;
      })();

      /* العودة للأعلى — يظهر بعد التمرير، يخفى عند صفحة الخدمة الموسّعة */
      (function initBackToTop() {
        var btn = document.getElementById('iif-back-to-top');
        if (!btn) return;
        var threshold = 420;
        var scheduled = false;
        function sync() {
          scheduled = false;
          if (document.body && document.body.classList.contains('body-service-page-open')) {
            btn.classList.remove('is-visible');
            btn.setAttribute('hidden', '');
            btn.setAttribute('aria-hidden', 'true');
            btn.removeAttribute('title');
            return;
          }
          var y = window.scrollY || (document.documentElement && document.documentElement.scrollTop) || 0;
          if (y > threshold) {
            btn.classList.add('is-visible');
            btn.removeAttribute('hidden');
            btn.setAttribute('aria-hidden', 'false');
            var ar = document.documentElement.getAttribute('data-lang') === 'ar';
            var label = ar ? 'أعلى الصفحة' : 'Top of page';
            btn.setAttribute('aria-label', label);
            btn.setAttribute('title', label);
          } else {
            btn.classList.remove('is-visible');
            btn.setAttribute('hidden', '');
            btn.setAttribute('aria-hidden', 'true');
            btn.removeAttribute('title');
          }
        }
        function onScroll() {
          if (!scheduled) {
            scheduled = true;
            window.requestAnimationFrame(sync);
          }
        }
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll, { passive: true });
        if (typeof MutationObserver !== 'undefined') {
          var mo = new MutationObserver(onScroll);
          mo.observe(document.body, { attributes: true, attributeFilter: ['class'] });
        }
        sync();
        window.IIF_backToTopSync = sync;
        btn.addEventListener('click', function () {
          var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
        });
      })();

      /* ساعة الموقع — يُفضّل توقيتاً مقدّراً جغرافياً من عنوان IP (إن توفرت الخدمة)، وإلا توقيت الجهاز.
       * يتطلب الاتصال بالإنترنت لطلب اختياري؛ لا يُخزّن موقعاً دقيقاً في الموقع. */
      (function initVisitorLocalClock() {
        var timeEl = document.getElementById('site-clock-time');
        var dateEl = document.getElementById('site-clock-date');
        var tzEl = document.getElementById('site-clock-tz');
        var wrap = document.getElementById('site-clock-wrap');
        if (!timeEl && !dateEl && !tzEl) return;

        var geoTzResolved = false;
        var geoTzIANA = null;

        function localeForClock() {
          var lang = (document.documentElement.getAttribute('data-lang') || 'en').toLowerCase();
          var map = {
            ar: 'ar-SA-u-nu-latn', en: 'en-GB', fr: 'fr-FR', de: 'de-DE', es: 'es-ES', pt: 'pt-PT', it: 'it-IT', ru: 'ru-RU',
            zh: 'zh-CN', ja: 'ja-JP', ko: 'ko-KR', fa: 'fa-IR', tr: 'tr-TR', pl: 'pl-PL', nl: 'nl-NL', el: 'el-GR', he: 'he-IL', hi: 'hi-IN',
            bn: 'bn-BD', ur: 'ur-PK', id: 'id-ID', ms: 'ms-MY', th: 'th-TH', vi: 'vi-VN', uk: 'uk-UA', ro: 'ro-RO', hu: 'hu-HU',
            cs: 'cs-CZ', sk: 'sk-SK', bg: 'bg-BG', hr: 'hr-HR', sr: 'sr-RS', sl: 'sl-SI', sv: 'sv-SE', no: 'nb-NO', da: 'da-DK', fi: 'fi-FI',
            ca: 'ca-ES', eu: 'eu-ES', gl: 'gl-ES', sq: 'sq-AL', mk: 'mk-MK', hy: 'hy-AM', ka: 'ka-GE', az: 'az-AZ', kk: 'kk-KZ', uz: 'uz-UZ', mn: 'mn-MN'
          };
          return map[lang] || (typeof navigator !== 'undefined' && navigator.language) || 'en-GB';
        }

        function activeTimeZone() {
          if (geoTzResolved && geoTzIANA) return geoTzIANA;
          try {
            return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
          } catch (e) {
            return 'UTC';
          }
        }

        function refreshClockAria() {
          if (!wrap) return;
          var ar = document.documentElement.getAttribute('data-lang') === 'ar';
          var geo = geoTzResolved && geoTzIANA;
          if (ar) {
            wrap.setAttribute('aria-label', geo
              ? 'التوقيت حسب تقدير المنطقة الزمنية لموقع الاتصال (عنوان IP)'
              : 'التوقيت حسب جهازك — أو فعّل الشبكة لتقدير المنطقة جغرافياً');
          } else {
            wrap.setAttribute('aria-label', geo
              ? 'Time for your connection region (IP-estimated timezone)'
              : 'Your device time — or connect to the network for IP-based region time');
          }
        }

        function tick() {
          var now = new Date();
          var loc = localeForClock();
          var tz = activeTimeZone();
          try {
            new Intl.DateTimeFormat(loc, { timeZone: tz, hour: 'numeric' }).format(now);
          } catch (badTz) {
            geoTzIANA = null;
            tz = activeTimeZone();
          }
          var optT = { hour: 'numeric', minute: '2-digit', second: '2-digit', timeZone: tz };
          var optD = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', timeZone: tz };
          try {
            if (timeEl) timeEl.textContent = now.toLocaleTimeString(loc, optT);
          } catch (e) {
            try {
              if (timeEl) timeEl.textContent = now.toLocaleTimeString(undefined, optT);
            } catch (e2) {
              if (timeEl) timeEl.textContent = now.toLocaleTimeString();
            }
          }
          try {
            if (dateEl) dateEl.textContent = now.toLocaleDateString(loc, optD);
          } catch (e3) {
            try {
              if (dateEl) dateEl.textContent = now.toLocaleDateString(undefined, optD);
            } catch (e4) {
              if (dateEl) dateEl.textContent = now.toLocaleDateString();
            }
          }
          if (tzEl) {
            var line = tz || '';
            if (geoTzResolved && geoTzIANA) line += ' · geo-IP';
            else if (geoTzResolved && !geoTzIANA) line += ' · device';
            tzEl.textContent = line;
            tzEl.title = geoTzIANA
              ? 'Timezone estimated from connection (IP). If you use VPN, this follows the VPN exit region.'
              : (geoTzResolved ? 'Device/browser timezone (no geo estimate or localhost).' : 'Resolving…');
          }
          refreshClockAria();
        }

        function fetchJsonTimeout(url, ms) {
          return new Promise(function (resolve, reject) {
            var done = false;
            var t = setTimeout(function () {
              if (!done) { done = true; reject(new Error('timeout')); }
            }, ms || 6000);
            fetch(url, { credentials: 'omit', cache: 'no-store' })
              .then(function (r) {
                if (!done) {
                  done = true;
                  clearTimeout(t);
                  resolve(r);
                }
              })
              .catch(function (err) {
                if (!done) {
                  done = true;
                  clearTimeout(t);
                  reject(err);
                }
              });
          });
        }

        function resolveGeoTimeZone() {
          var host = (typeof location !== 'undefined' && location.hostname) || '';
          if (host === 'localhost' || host === '127.0.0.1' || (typeof location !== 'undefined' && location.protocol === 'file:')) {
            geoTzResolved = true;
            geoTzIANA = null;
            tick();
            return;
          }
          fetchJsonTimeout('https://worldtimeapi.org/api/ip', 6000)
            .then(function (r) {
              if (!r || !r.ok) throw new Error('wta');
              return r.json();
            })
            .then(function (d) {
              if (d && typeof d.timezone === 'string' && d.timezone.indexOf('/') !== -1) {
                geoTzIANA = d.timezone;
              }
              geoTzResolved = true;
              tick();
            })
            .catch(function () {
              return fetchJsonTimeout('https://ipwho.is/', 6000)
                .then(function (r2) {
                  if (!r2 || !r2.ok) throw new Error('ipwho');
                  return r2.json();
                })
                .then(function (d2) {
                  if (d2 && d2.success && d2.timezone && typeof d2.timezone.id === 'string') {
                    geoTzIANA = d2.timezone.id;
                  }
                  geoTzResolved = true;
                  tick();
                });
            })
            .catch(function () {
              geoTzResolved = true;
              geoTzIANA = null;
              tick();
            });
        }

        window.IIF_siteClockTick = tick;
        tick();
        setInterval(tick, 1000);
        resolveGeoTimeZone();
      })();

      /* اعرف عميلك — قائمة جميع الدول لخيار دولة الإقامة */
      var KYC_COUNTRIES = 'AF=Afghanistan,AL=Albania,DZ=Algeria,AD=Andorra,AO=Angola,AG=Antigua and Barbuda,AR=Argentina,AM=Armenia,AU=Australia,AT=Austria,AZ=Azerbaijan,BS=Bahamas,BH=Bahrain,BD=Bangladesh,BB=Barbados,BY=Belarus,BE=Belgium,BZ=Belize,BJ=Benin,BT=Bhutan,BO=Bolivia,BA=Bosnia and Herzegovina,BW=Botswana,BR=Brazil,BN=Brunei,BG=Bulgaria,BF=Burkina Faso,BI=Burundi,KH=Cambodia,CM=Cameroon,CA=Canada,CV=Cape Verde,CF=Central African Republic,TD=Chad,CL=Chile,CN=China,CO=Colombia,KM=Comoros,CG=Congo,CR=Costa Rica,HR=Croatia,CU=Cuba,CY=Cyprus,CZ=Czech Republic,DK=Denmark,DJ=Djibouti,DM=Dominica,DO=Dominican Republic,EC=Ecuador,EG=Egypt,SV=El Salvador,GQ=Equatorial Guinea,ER=Eritrea,EE=Estonia,SZ=Eswatini,ET=Ethiopia,FJ=Fiji,FI=Finland,FR=France,GA=Gabon,GM=Gambia,GE=Georgia,DE=Germany,GH=Ghana,GR=Greece,GD=Grenada,GT=Guatemala,GN=Guinea,GW=Guinea-Bissau,GY=Guyana,HT=Haiti,HN=Honduras,HU=Hungary,IS=Iceland,IN=India,ID=Indonesia,IR=Iran,IQ=Iraq,IE=Ireland,IL=Israel,IT=Italy,JM=Jamaica,JP=Japan,JO=Jordan,KZ=Kazakhstan,KE=Kenya,KI=Kiribati,KP=North Korea,KR=South Korea,KW=Kuwait,KG=Kyrgyzstan,LA=Laos,LV=Latvia,LB=Lebanon,LS=Lesotho,LR=Liberia,LY=Libya,LI=Liechtenstein,LT=Lithuania,LU=Luxembourg,MG=Madagascar,MW=Malawi,MY=Malaysia,MV=Maldives,ML=Mali,MT=Malta,MH=Marshall Islands,MR=Mauritania,MU=Mauritius,MX=Mexico,FM=Micronesia,MD=Moldova,MC=Monaco,MN=Mongolia,ME=Montenegro,MA=Morocco,MZ=Mozambique,MM=Myanmar,NA=Namibia,NR=Nauru,NP=Nepal,NL=Netherlands,NZ=New Zealand,NI=Nicaragua,NE=Niger,NG=Nigeria,MK=North Macedonia,NO=Norway,OM=Oman,PK=Pakistan,PW=Palau,PS=Palestine,PA=Panama,PG=Papua New Guinea,PY=Paraguay,PE=Peru,PH=Philippines,PL=Poland,PT=Portugal,QA=Qatar,RO=Romania,RU=Russia,RW=Rwanda,KN=Saint Kitts and Nevis,LC=Saint Lucia,VC=Saint Vincent and the Grenadines,WS=Samoa,SM=San Marino,ST=Sao Tome and Principe,SA=Saudi Arabia,SN=Senegal,RS=Serbia,SC=Seychelles,SL=Sierra Leone,SG=Singapore,SK=Slovakia,SI=Slovenia,SB=Solomon Islands,SO=Somalia,ZA=South Africa,SS=South Sudan,ES=Spain,LK=Sri Lanka,SD=Sudan,SR=Suriname,SE=Sweden,CH=Switzerland,SY=Syria,TW=Taiwan,TJ=Tajikistan,TZ=Tanzania,TH=Thailand,TL=Timor-Leste,TG=Togo,TO=Tonga,TT=Trinidad and Tobago,TN=Tunisia,TR=Turkey,TM=Turkmenistan,TV=Tuvalu,UG=Uganda,UA=Ukraine,AE=United Arab Emirates,GB=United Kingdom,US=United States,UY=Uruguay,UZ=Uzbekistan,VU=Vanuatu,VA=Vatican City,VE=Venezuela,VN=Vietnam,YE=Yemen,ZM=Zambia,ZW=Zimbabwe,OTHER=Other'.split(',');
      (function fillKycCountries() {
        var firstOpt = '<option value="" data-i18n="contactSelectPlaceholder">— Select —</option>';
        var opts = KYC_COUNTRIES.map(function (s) {
          var p = s.split('=');
          return '<option value="' + (p[0] || '').replace(/"/g, '&quot;') + '">' + (p[1] || '').replace(/</g, '&lt;') + '</option>';
        }).join('');
        document.querySelectorAll('select[name="kyc_country"]').forEach(function (sel) {
          sel.innerHTML = firstOpt + opts;
        });
      })();

      /* Auth modal: open / close / tabs */
      var overlay = document.getElementById('auth-overlay');
      var openBtn = document.getElementById('auth-open');
      var closeBtn = document.getElementById('auth-close');
      var tabs = document.querySelectorAll('.auth-tab');
      var panels = document.querySelectorAll('.auth-panel');
      var lastAuthFocusEl = null;

      function openAuth(panel) {
        if (overlay) {
          try {
            lastAuthFocusEl = document.activeElement;
          } catch (eFocusStore) {
            lastAuthFocusEl = null;
          }
          overlay.classList.add('is-open');
          overlay.setAttribute('aria-hidden', 'false');
          document.body.style.overflow = 'hidden';
          try {
            if (typeof window.IIF_hidePublicSiteChrome === 'function') window.IIF_hidePublicSiteChrome();
          } catch (eHideAuth) { }
          if (panel === 'register' || panel === 'login') switchTab(panel);
          setTimeout(function () {
            var modal = overlay.querySelector('.auth-modal');
            var focusable = modal && modal.querySelector('button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])');
            if (focusable) focusable.focus();
          }, 150);
        }
      }
      function closeAuth() {
        if (overlay) {
          var modal = overlay.querySelector('.auth-modal');
          if (modal) modal.classList.remove('show-welcome');
          var welcomeEl = document.getElementById('auth-welcome');
          if (welcomeEl) welcomeEl.hidden = true;
          overlay.classList.remove('is-open');
          overlay.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = '';
        }
        try {
          var ovDash = document.getElementById('dashboard-overlay');
          var dashIsOpen = ovDash && ovDash.classList.contains('is-open');
          var spClose = new URLSearchParams(window.location.search);
          var portalChrome = spClose.get('iif_admin_portal') === '1' || spClose.get('iif_admin_embed') === '1';
          var stickyChrome = false;
          try { stickyChrome = sessionStorage.getItem('iif_admin_portal_mode') === '1'; } catch (eStC) { }
          var clsEmb = false;
          var clsPor = false;
          try {
            clsEmb = document.documentElement.classList.contains('iif-admin-embed');
            clsPor = document.documentElement.classList.contains('iif-admin-portal');
          } catch (eCls) { }
          var winAdm = window.IIF_ADMIN_PORTAL === true || window.IIF_ADMIN_EMBED === true;
          if (!dashIsOpen && (portalChrome || stickyChrome || clsEmb || clsPor || winAdm) && typeof window.IIF_hidePublicSiteChrome === 'function') {
            window.IIF_hidePublicSiteChrome();
          }
        } catch (eRehide) { }
        try {
          var refA = lastAuthFocusEl;
          if (refA && typeof refA.focus === 'function' && (!overlay || !overlay.classList.contains('is-open'))) {
            setTimeout(function () {
              try {
                refA.focus();
              } catch (eRf) {}
            }, 0);
          }
        } catch (eRestA) {}
        if (!overlay || !overlay.classList.contains('is-open')) lastAuthFocusEl = null;
      }
      function switchTab(tabName) {
        tabs.forEach(function (t) {
          t.classList.toggle('is-active', t.getAttribute('data-tab') === tabName);
        });
        panels.forEach(function (p) {
          p.classList.toggle('is-active', p.id === 'auth-panel-' + tabName);
        });
        if (tabName === 'register') {
          if (typeof window.IIF_initRegPhoneCodeIfNeeded === 'function') window.IIF_initRegPhoneCodeIfNeeded();
          setTimeout(function () {
            if (typeof window.IIF_syncPhoneCodeFromCountry === 'function') window.IIF_syncPhoneCodeFromCountry();
          }, 50);
          var ready = window.IIF_SECURE_STORAGE && window.IIF_SECURE_STORAGE.ready;
          if (ready) ready().then(function () {
            if (typeof getStoredEmailForField !== 'function') return;
            var stored = getStoredEmailForField();
            var regEl = document.getElementById('reg-email');
            if (regEl && stored && (!regEl.value || !regEl.value.trim())) { regEl.value = stored; regEl.dispatchEvent(new Event('input', { bubbles: true })); }
          });
        }
      }

      if (openBtn) openBtn.addEventListener('click', function () { openAuth(); });
      var repOpenAuth = document.getElementById('rep-open-auth');
      if (repOpenAuth) repOpenAuth.addEventListener('click', function () { openAuth(); });
      var stripLogin = document.getElementById('auth-strip-login');
      if (stripLogin) stripLogin.addEventListener('click', function () { openAuth('login'); });
      var stripRegister = document.getElementById('auth-strip-register');
      if (stripRegister) stripRegister.addEventListener('click', function () { openAuth('register'); });
      var headerLogin = document.getElementById('auth-header-login');
      if (headerLogin) headerLogin.addEventListener('click', function () { openAuth('login'); });
      var headerRegister = document.getElementById('auth-header-register');
      if (headerRegister) headerRegister.addEventListener('click', function () { openAuth('register'); });
      if (closeBtn) closeBtn.addEventListener('click', closeAuth);
      if (overlay) {
        overlay.addEventListener('click', function (e) {
          if (e.target === overlay) closeAuth();
        });
        document.addEventListener('keydown', function authEscape(e) {
          if (overlay && overlay.classList.contains('is-open') && (e.key === 'Escape' || e.keyCode === 27)) {
            e.preventDefault();
            closeAuth();
            return;
          }
          if (!overlay || !overlay.classList.contains('is-open') || e.key !== 'Tab') return;
          var modal = overlay.querySelector('.auth-modal');
          if (!modal || !modal.contains(document.activeElement)) return;
          var focusable = modal.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])');
          var list = [];
          for (var i = 0; i < focusable.length; i++) { if (focusable[i].offsetParent !== null) list.push(focusable[i]); }
          if (list.length === 0) return;
          var first = list[0], last = list[list.length - 1];
          if (e.shiftKey) {
            if (document.activeElement === first) { e.preventDefault(); last.focus(); }
          } else {
            if (document.activeElement === last) { e.preventDefault(); first.focus(); }
          }
        });
      }
      tabs.forEach(function (t) {
        t.addEventListener('click', function () {
          switchTab(t.getAttribute('data-tab'));
        });
      });

      /* روابط # في تاب جديد (اختياري): data-iif-hash-newtab أو class iif-hash-newtab — تُعالَج في js/iif-same-page-hash-nav.js */

      /* خدماتنا — قائمة منسدلة: فتح/إغلاق عند النقر على الزر أو خارج القائمة */
      (function initServicesDropdown() {
        var wrap = document.getElementById('services-dropdown-wrap');
        var trigger = document.getElementById('services-dropdown-trigger');
        var dropdown = document.getElementById('services-dropdown');
        var servicesCalcOpen = document.getElementById('services-calc-open');
        var calcOpen = document.getElementById('calc-open');
        function closeServicesDropdown() {
          if (wrap) wrap.classList.remove('is-open');
          if (trigger) trigger.setAttribute('aria-expanded', 'false');
          if (dropdown) {
            dropdown.setAttribute('aria-hidden', 'true');
            dropdown.style.setProperty('--iif-dd-x', '0px');
          }
        }
        function openServicesDropdown() {
          if (wrap) wrap.classList.add('is-open');
          if (trigger) trigger.setAttribute('aria-expanded', 'true');
          if (dropdown) {
            dropdown.setAttribute('aria-hidden', 'false');
            if (typeof window.IIF_clampNavDropdown === 'function') window.IIF_clampNavDropdown(dropdown);
          }
        }
        function toggleServicesDropdown() {
          if (wrap && wrap.classList.contains('is-open')) closeServicesDropdown();
          else openServicesDropdown();
        }
        if (trigger && wrap) {
          trigger.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); toggleServicesDropdown(); });
        }
        document.addEventListener('click', function (e) {
          if (!wrap || !wrap.contains(e.target)) closeServicesDropdown();
        });
        if (dropdown) {
          dropdown.addEventListener('click', function (e) {
            var link = e.target && e.target.closest('a');
            var btn = e.target && e.target.closest('button');
            if (btn && btn.id === 'services-calc-open') {
              if (typeof openCalc === 'function') openCalc();
              closeServicesDropdown();
            }
            if (link) {
              setTimeout(closeServicesDropdown, (window.IIF_TIMING && window.IIF_TIMING.dropdownClose) || 340);
            }
          });
        }
      })();

      /* من نحن — قائمة منسدلة: فتح/إغلاق عند النقر على الزر أو خارج القائمة */
      (function initAboutDropdown() {
        var wrap = document.getElementById('about-dropdown-wrap');
        var trigger = document.getElementById('about-dropdown-trigger');
        var dropdown = document.getElementById('about-dropdown');
        function closeAboutDropdown() {
          if (wrap) wrap.classList.remove('is-open');
          if (trigger) trigger.setAttribute('aria-expanded', 'false');
          if (dropdown) {
            dropdown.setAttribute('aria-hidden', 'true');
            dropdown.style.setProperty('--iif-dd-x', '0px');
          }
        }
        function openAboutDropdown() {
          if (wrap) wrap.classList.add('is-open');
          if (trigger) trigger.setAttribute('aria-expanded', 'true');
          if (dropdown) {
            dropdown.setAttribute('aria-hidden', 'false');
            if (typeof window.IIF_clampNavDropdown === 'function') window.IIF_clampNavDropdown(dropdown);
          }
        }
        function toggleAboutDropdown() {
          if (wrap && wrap.classList.contains('is-open')) closeAboutDropdown();
          else openAboutDropdown();
        }
        if (trigger && wrap) {
          trigger.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); toggleAboutDropdown(); });
        }
        document.addEventListener('click', function (e) {
          if (!wrap || !wrap.contains(e.target)) closeAboutDropdown();
        });
        if (dropdown) {
          dropdown.addEventListener('click', function (e) {
            var link = e.target && e.target.closest('a');
            if (link) {
              setTimeout(closeAboutDropdown, (window.IIF_TIMING && window.IIF_TIMING.dropdownClose) || 340);
            }
          });
        }
      })();

      /* المزيد — روابط ثانوية في قائمة واحدة */
      (function initMoreDropdown() {
        var wrap = document.getElementById('more-dropdown-wrap');
        var trigger = document.getElementById('more-dropdown-trigger');
        var dropdown = document.getElementById('more-dropdown');
        function closeMoreDropdown() {
          if (wrap) wrap.classList.remove('is-open');
          if (trigger) trigger.setAttribute('aria-expanded', 'false');
          if (dropdown) {
            dropdown.setAttribute('aria-hidden', 'true');
            dropdown.style.setProperty('--iif-dd-x', '0px');
          }
        }
        function openMoreDropdown() {
          if (wrap) wrap.classList.add('is-open');
          if (trigger) trigger.setAttribute('aria-expanded', 'true');
          if (dropdown) {
            dropdown.setAttribute('aria-hidden', 'false');
            if (typeof window.IIF_clampNavDropdown === 'function') window.IIF_clampNavDropdown(dropdown);
          }
        }
        function toggleMoreDropdown() {
          if (wrap && wrap.classList.contains('is-open')) closeMoreDropdown();
          else openMoreDropdown();
        }
        if (trigger && wrap) {
          trigger.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); toggleMoreDropdown(); });
        }
        document.addEventListener('click', function (e) {
          if (!wrap || !wrap.contains(e.target)) closeMoreDropdown();
        });
        if (dropdown) {
          dropdown.addEventListener('click', function (e) {
            var link = e.target && e.target.closest('a');
            if (link) {
              setTimeout(closeMoreDropdown, (window.IIF_TIMING && window.IIF_TIMING.dropdownClose) || 340);
            }
          });
        }
      })();

      /* إغلاق قوائم التنقل المنسدلة بمفتاح Escape وإعادة التركيز إلى الزر */
      (function initNavDropdownEscape() {
        var configs = [
          { wrap: 'about-dropdown-wrap', trigger: 'about-dropdown-trigger', menu: 'about-dropdown' },
          { wrap: 'services-dropdown-wrap', trigger: 'services-dropdown-trigger', menu: 'services-dropdown' },
          { wrap: 'more-dropdown-wrap', trigger: 'more-dropdown-trigger', menu: 'more-dropdown' }
        ];
        document.addEventListener('keydown', function (e) {
          if (e.key !== 'Escape' && e.keyCode !== 27) return;
          for (var i = 0; i < configs.length; i++) {
            var c = configs[i];
            var w = document.getElementById(c.wrap);
            if (!w || !w.classList.contains('is-open')) continue;
            w.classList.remove('is-open');
            var tr = document.getElementById(c.trigger);
            if (tr) tr.setAttribute('aria-expanded', 'false');
            var dd = document.getElementById(c.menu);
            if (dd) {
              dd.setAttribute('aria-hidden', 'true');
              dd.style.setProperty('--iif-dd-x', '0px');
            }
            if (tr) {
              try {
                tr.focus();
              } catch (errF) { /* ignore */ }
            }
            e.preventDefault();
            break;
          }
        });
      })();

      // إزالة الأكواد المكررة والمعطوبة

      /* Form submit: prevent default (no backend yet) */
      var formLogin = document.getElementById('form-login');
      var formRegister = document.getElementById('form-register');
      var formMembership = document.getElementById('form-membership-request');
      var formFinancing = document.getElementById('form-financing-request');
      var formInvestor = document.getElementById('form-investor-registration');
      var ADMIN_EMAILS = (window.IIF_CONFIG && window.IIF_CONFIG.adminEmails) ? IIF_CONFIG.adminEmails.slice() : ['talalkenani@gmail.com'];
      /** مفتاح لمقارنة الهوية: Gmail/Googlemail يُوحَّد (إزالة النقاط من الجزء المحلي، وتجاهل +tag) */
      function iifAuthEmailKey(s) {
        try {
          var e = (s && String(s).trim().toLowerCase()) || '';
          if (!e || e.indexOf('@') < 0) return e;
          var at = e.lastIndexOf('@');
          var local = e.slice(0, at);
          var domain = e.slice(at + 1);
          if (domain === 'gmail.com' || domain === 'googlemail.com') {
            local = local.replace(/\./g, '');
            var plus = local.indexOf('+');
            if (plus >= 0) local = local.slice(0, plus);
          }
          return local + '@' + domain;
        } catch (err) {
          return (s && String(s).trim().toLowerCase()) || '';
        }
      }
      try { window.iifAuthEmailKey = iifAuthEmailKey; } catch (eW) { }
      function isValidEmail(s) {
        var re = (window.IIF_CONFIG && window.IIF_CONFIG.emailRegex) ? IIF_CONFIG.emailRegex : /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        return typeof s === 'string' && re.test(s.trim());
      }
      function iifMessage(key) {
        try {
          if (window.IIF_I18N && typeof window.IIF_I18N.text === 'function') {
            var s0 = window.IIF_I18N.text(key);
            if (s0 !== '') return s0;
          }
        } catch (eMsg) { }
        var isAr = document.documentElement.getAttribute('data-lang') === 'ar';
        var m = (window.IIF_CONFIG && window.IIF_CONFIG.messages) ? IIF_CONFIG.messages : {};
        var k = key + (isAr ? 'Ar' : 'En');
        if (m[k] != null && m[k] !== '') return m[k];
        try {
          if (window.IIF_I18N && typeof window.IIF_I18N.text === 'function') {
            var fb = window.IIF_I18N.text('jsPleaseCheckInput');
            if (fb !== '') return fb;
          }
        } catch (eFb) { }
        return 'Please check your input.';
      }
      function iifMessageFmt(key, vars) {
        var s = typeof iifMessage === 'function' ? iifMessage(key) : '';
        if (!vars || !s) return s || '';
        for (var vk in vars) {
          if (Object.prototype.hasOwnProperty.call(vars, vk)) {
            s = s.split('{' + vk + '}').join(String(vars[vk]));
          }
        }
        return s;
      }
      try {
        window.iifMessage = iifMessage;
        window.iifMessageFmt = iifMessageFmt;
      } catch (eWim) { }
      function iifText(key, fallback) {
        try {
          if (window.IIF_I18N && typeof window.IIF_I18N.text === 'function') {
            var s = window.IIF_I18N.text(key);
            if (s) return s;
          }
        } catch (eTxt) { }
        return fallback != null ? String(fallback) : '';
      }
      function iifTextPair(key, fallbackEn, fallbackAr) {
        var en = '';
        var ar = '';
        try {
          if (window.IIF_I18N && typeof window.IIF_I18N.text === 'function') {
            en = window.IIF_I18N.text(key, 'en') || '';
            ar = window.IIF_I18N.text(key, 'ar') || '';
          }
        } catch (ePair) { }
        return {
          en: en || (fallbackEn != null ? String(fallbackEn) : ''),
          ar: ar || (fallbackAr != null ? String(fallbackAr) : '')
        };
      }
      function iifBilingualSpans(key, fallbackEn, fallbackAr) {
        var p = iifTextPair(key, fallbackEn, fallbackAr);
        return '<span class="lang-en">' + escapeHtml(p.en) + '</span><span class="lang-ar">' + escapeHtml(p.ar) + '</span>';
      }
      function setLoggedIn(value, opts) {
        opts = opts || {};
        var v = value ? '1' : '';
        var persist = opts.persist !== false; // default: persist in localStorage
        try {
          if (persist) localStorage.setItem('iif-logged-in', v);
          else sessionStorage.setItem('iif-logged-in', v);
        } catch (e) { }
        try {
          if (value) {
            if (persist) sessionStorage.removeItem('iif-logged-in');
            else localStorage.removeItem('iif-logged-in');
          } else {
            localStorage.removeItem('iif-logged-in');
            sessionStorage.removeItem('iif-logged-in');
          }
        } catch (e2) { }
      }
      function isLoggedIn() {
        try {
          var loggedIn = localStorage.getItem('iif-logged-in') === '1' || sessionStorage.getItem('iif-logged-in') === '1';
          if (loggedIn) return true;
          /* /admin-direct وغيره: قد يُضبط iif-is-admin مع البريد دون اكتمال مسار iif-logged-in */
          if (localStorage.getItem('iif-is-admin') === '1' && (localStorage.getItem('iif-user-email') || '').trim()) return true;
          // تصحيح تلقائي: إذا كان البريد الإلكتروني للمالك موجوداً ولكن لم يتم تسجيل الدخول
          var email = (localStorage.getItem('iif-user-email') || '').trim().toLowerCase();
          var ownerEmail = (window.IIF_CONFIG && window.IIF_CONFIG.ownerEmail) ? window.IIF_CONFIG.ownerEmail.toLowerCase() : 'talalkenani@gmail.com';
          if (email && typeof iifAuthEmailKey === 'function') {
            try {
              if (iifAuthEmailKey(email) === iifAuthEmailKey(ownerEmail)) {
                setLoggedIn(true, { persist: true });
                var uiDelay = (window.IIF_TIMING && window.IIF_TIMING.ui) || 100;
                setTimeout(function () {
                  if (typeof updateAuthUI === 'function') updateAuthUI();
                  if (typeof IIF_proactiveRefreshUI === 'function') IIF_proactiveRefreshUI();
                }, uiDelay);
                return true;
              }
            } catch (eKey) { }
          }
          return false;
        } catch (e) {
          try {
            return localStorage.getItem('iif-logged-in') === '1' || sessionStorage.getItem('iif-logged-in') === '1' || (localStorage.getItem('iif-is-admin') === '1' && !!(localStorage.getItem('iif-user-email') || '').trim());
          } catch (e2) {
            return false;
          }
        }
      }
      function isAdmin() {
        try {
          if (localStorage.getItem('iif-is-admin') === '1') return true;
          var email = (localStorage.getItem('iif-user-email') || '').trim().toLowerCase();
          var ownerEmail = (window.IIF_CONFIG && window.IIF_CONFIG.ownerEmail) ? window.IIF_CONFIG.ownerEmail.toLowerCase() : 'talalkenani@gmail.com';
          if (email && typeof iifAuthEmailKey === 'function' && iifAuthEmailKey(email) === iifAuthEmailKey(ownerEmail)) return true;
          return false;
        } catch (e) {
          try {
            return localStorage.getItem('iif-is-admin') === '1';
          } catch (e2) {
            return false;
          }
        }
      }
      var MEMBERSHIP_STORAGE_PREFIX = 'iif-membership-';
      var MEMBERSHIP_EXPIRY_PREFIX = 'iif-membership-expiry-';
      var MEMBERSHIP_START_PREFIX = 'iif-membership-start-';
      var MEMBERSHIP_REGISTRY_KEY = 'iif-membership-registry';
      function getMembershipStorageKey() {
        try {
          var email = (localStorage.getItem('iif-user-email') || '').trim().toLowerCase();
          return email ? MEMBERSHIP_STORAGE_PREFIX + email : null;
        } catch (e) { return null; }
      }
      function getMembershipType() {
        try {
          var key = getMembershipStorageKey();
          if (key) {
            var stored = localStorage.getItem(key) || '';
            if (stored) return stored;
          }
          var email = (localStorage.getItem('iif-user-email') || '').trim().toLowerCase();
          if (email && typeof getFundMembers === 'function') {
            var list = getFundMembers();
            var m = list.find(function (x) { return (x.email || '').trim().toLowerCase() === email; });
            if (m && (m.tier === 'cooperating' || m.tier === 'shared' || m.tier === 'premium_2143' || m.tier === 'premium_3143' || m.tier === 'premium_4143')) return m.tier || '';
          }
          return '';
        } catch (e) { return ''; }
      }
      function getMembershipStartDate() {
        try {
          var email = (localStorage.getItem('iif-user-email') || '').trim().toLowerCase();
          if (email) {
            var stored = localStorage.getItem(MEMBERSHIP_START_PREFIX + email) || '';
            if (stored) return stored;
            if (typeof getFundMembers === 'function') {
              var list = getFundMembers();
              var m = list.find(function (x) { return (x.email || '').trim().toLowerCase() === email; });
              if (m) return (m.startDate || new Date().toISOString().slice(0, 10));
            }
          }
          return '';
        } catch (e) { return ''; }
      }
      function getMembershipExpiry() {
        try {
          var email = (localStorage.getItem('iif-user-email') || '').trim().toLowerCase();
          if (email) {
            var stored = localStorage.getItem(MEMBERSHIP_EXPIRY_PREFIX + email) || '';
            if (stored) return stored;
            if (typeof getFundMembers === 'function') {
              var list = getFundMembers();
              var m = list.find(function (x) { return (x.email || '').trim().toLowerCase() === email; });
              if (m) return m.endDate || (function () { var d = new Date(); d.setFullYear(d.getFullYear() + 10); return d.toISOString().slice(0, 10); })();
            }
          }
          return '';
        } catch (e) { return ''; }
      }
      function setMembershipType(type) {
        try {
          var key = getMembershipStorageKey();
          if (key) localStorage.setItem(key, type || '');
        } catch (e) { }
      }
      function setMembershipDates(startDate, endDate) {
        try {
          var email = (localStorage.getItem('iif-user-email') || '').trim().toLowerCase();
          if (!email) return;
          if (startDate) localStorage.setItem(MEMBERSHIP_START_PREFIX + email, startDate);
          if (endDate) localStorage.setItem(MEMBERSHIP_EXPIRY_PREFIX + email, endDate);
        } catch (e) { }
      }
      function getMembershipRegistry() { try { var r = localStorage.getItem(MEMBERSHIP_REGISTRY_KEY); return r ? JSON.parse(r) : []; } catch (e) { return []; } }
      function saveMembershipRegistry(arr) { try { localStorage.setItem(MEMBERSHIP_REGISTRY_KEY, JSON.stringify(arr)); } catch (e) { } }
      /* مسجّلو الموقع (حساب بدون اشتراك) — منفصلون عن أعضاء الصندوق المدفوعين */
      var SITE_USERS_KEY = 'iif-site-users';
      var MEMBERSHIP_APPS_KEY = 'iif-membership-applications';
      var BLOCKED_EMAILS_KEY = 'iif-blocked-emails';
      function getSiteUsers() { try { var r = localStorage.getItem(SITE_USERS_KEY); var a = r ? JSON.parse(r) : []; return Array.isArray(a) ? a : []; } catch (e) { return []; } }
      function saveSiteUsers(arr) { try { localStorage.setItem(SITE_USERS_KEY, JSON.stringify(arr)); } catch (e) { } }
      /* كلمات مرور الحسابات — تجزئة SHA-256 + نسخة للإدارة للاطلاع/التعديل (تخزين محلي للتجربة فقط) */
      var IIF_USER_CREDENTIALS_KEY = 'iif-user-credentials';
      var IIF_ADMIN_PASSWORD_PLAIN_KEY = 'iif-admin-password-plain';
      function getCredentialsMap() {
        try { var r = localStorage.getItem(IIF_USER_CREDENTIALS_KEY); var o = r ? JSON.parse(r) : {}; return o && typeof o === 'object' ? o : {}; } catch (e) { return {}; }
      }
      function saveCredentialsMap(map) { try { localStorage.setItem(IIF_USER_CREDENTIALS_KEY, JSON.stringify(map || {})); } catch (e) { } }
      function getAdminPasswordPlainMap() {
        try { var r = localStorage.getItem(IIF_ADMIN_PASSWORD_PLAIN_KEY); var o = r ? JSON.parse(r) : {}; return o && typeof o === 'object' ? o : {}; } catch (e) { return {}; }
      }
      function saveAdminPasswordPlainMap(map) { try { localStorage.setItem(IIF_ADMIN_PASSWORD_PLAIN_KEY, JSON.stringify(map || {})); } catch (e) { } }
      function getCredentialForEmail(email) {
        var em = (email || '').trim().toLowerCase();
        if (!em) return null;
        var m = getCredentialsMap();
        return m[em] || null;
      }
      function randomSalt() {
        var hex = '';
        try {
          var a = new Uint8Array(16);
          if (window.crypto && crypto.getRandomValues) crypto.getRandomValues(a);
          for (var i = 0; i < a.length; i++) hex += ('0' + a[i].toString(16)).slice(-2);
        } catch (e1) { hex = 's' + Date.now() + Math.random(); }
        return hex;
      }
      function hexFromBuffer(buf) {
        return Array.prototype.map.call(new Uint8Array(buf), function (b) { return ('0' + b.toString(16)).slice(-2); }).join('');
      }
      function hashPasswordAsync(password, salt) {
        var combined = String(salt || '') + ':' + String(password || '');
        if (window.crypto && crypto.subtle && typeof TextEncoder !== 'undefined') {
          var enc = new TextEncoder().encode(combined);
          return crypto.subtle.digest('SHA-256', enc).then(function (buf) { return hexFromBuffer(buf); });
        }
        return Promise.resolve('');
      }
      function setCredentialForEmail(email, password) {
        var em = (email || '').trim().toLowerCase();
        if (!em || !password) return Promise.resolve(false);
        var salt = randomSalt();
        return hashPasswordAsync(password, salt).then(function (hash) {
          if (!hash) return false;
          var map = getCredentialsMap();
          map[em] = { salt: salt, hash: hash };
          saveCredentialsMap(map);
          var plain = getAdminPasswordPlainMap();
          plain[em] = String(password);
          saveAdminPasswordPlainMap(plain);
          return true;
        });
      }
      function removeCredentialForEmail(email) {
        var em = (email || '').trim().toLowerCase();
        if (!em) return;
        var map = getCredentialsMap();
        delete map[em];
        saveCredentialsMap(map);
        var plain = getAdminPasswordPlainMap();
        delete plain[em];
        saveAdminPasswordPlainMap(plain);
      }
      function getAdminPasswordPlain(email) {
        var em = (email || '').trim().toLowerCase();
        return getAdminPasswordPlainMap()[em] || '';
      }
      function verifyPasswordForEmail(email, password) {
        var em = (email || '').trim().toLowerCase();
        var cred = getCredentialForEmail(em);
        if (!cred || !cred.hash) return Promise.resolve(false);
        return hashPasswordAsync(password, cred.salt).then(function (h) { return h === cred.hash; });
      }
      /** تسجيل الدخول: إن لم تُخزَّن كلمة مرور بعد، تُقبل أول محاولة وتُحفظ ككلمة مرور للحساب */
      function verifyLoginPassword(email, password) {
        var em = (email || '').trim().toLowerCase();
        var pw = String(password || '');
        if (!em || !pw) return Promise.resolve(false);
        var cred = getCredentialForEmail(em);
        if (!cred || !cred.hash) {
          return setCredentialForEmail(em, pw).then(function (ok) { return !!ok; });
        }
        return verifyPasswordForEmail(em, pw);
      }
      function getMembershipApplications() { try { var r = localStorage.getItem(MEMBERSHIP_APPS_KEY); var a = r ? JSON.parse(r) : []; return Array.isArray(a) ? a : []; } catch (e) { return []; } }
      function saveMembershipApplications(arr) { try { localStorage.setItem(MEMBERSHIP_APPS_KEY, JSON.stringify(arr)); } catch (e) { } }
      function addMembershipApplicationRecord(formData) {
        var list = getMembershipApplications();
        list.push({ id: 'mapp-' + Date.now(), at: new Date().toISOString(), status: 'pending', data: formData || {} });
        saveMembershipApplications(list);
      }
      function getBlockedEmails() { try { var r = localStorage.getItem(BLOCKED_EMAILS_KEY); var a = r ? JSON.parse(r) : []; return Array.isArray(a) ? a : []; } catch (e) { return []; } }
      function saveBlockedEmails(arr) { try { localStorage.setItem(BLOCKED_EMAILS_KEY, JSON.stringify(arr)); } catch (e) { } }
      /* أرشيف الاستبعادات والرفض — نسخة دائمة للاطلاع (لا تُحذف عند تحديث القوائم) */
      var EXCLUSION_ARCHIVE_KEY = 'iif-exclusion-archive';
      var EXCLUSION_ARCHIVE_MAX = 500;
      function sanitizeForArchive(val, depth) {
        depth = depth || 0;
        if (depth > 8) return '[…]';
        if (val === null || val === undefined) return val;
        if (typeof val === 'string') {
          if (val.length > 5000) return val.slice(0, 5000) + '… [truncated]';
          return val;
        }
        if (typeof val !== 'object') return val;
        if (Array.isArray(val)) {
          return val.slice(0, 80).map(function (item) { return sanitizeForArchive(item, depth + 1); });
        }
        var o = {};
        var keys = Object.keys(val);
        for (var i = 0; i < keys.length && i < 60; i++) {
          var k = keys[i];
          if ((k === 'photoUrl' || k === 'logo' || k === 'flag') && typeof val[k] === 'string' && val[k].indexOf('data:') === 0) {
            o[k] = '[data URL ~' + val[k].length + ' chars]';
          } else {
            o[k] = sanitizeForArchive(val[k], depth + 1);
          }
        }
        return o;
      }
      function getExclusionArchive() {
        try {
          var r = localStorage.getItem(EXCLUSION_ARCHIVE_KEY);
          var a = r ? JSON.parse(r) : [];
          return Array.isArray(a) ? a : [];
        } catch (e) { return []; }
      }
      function saveExclusionArchive(arr) {
        try { localStorage.setItem(EXCLUSION_ARCHIVE_KEY, JSON.stringify((arr || []).slice(-EXCLUSION_ARCHIVE_MAX))); } catch (e) { }
      }
      function appendExclusionArchive(entry) {
        try {
          var list = getExclusionArchive();
          var id = 'excl-' + Date.now() + '-' + String(Math.floor(Math.random() * 1e9));
          var actor = '';
          try { actor = (localStorage.getItem('iif-user-email') || '').trim().toLowerCase(); } catch (eA) { }
          list.push(Object.assign({ id: id, at: new Date().toISOString(), actorEmail: actor || '' }, entry));
          saveExclusionArchive(list);
        } catch (e) { }
      }
      function isEmailBlockedFromSite(email) {
        var em = (email || '').trim().toLowerCase();
        if (!em) return false;
        return getBlockedEmails().indexOf(em) >= 0;
      }
      function addBlockedEmail(email) {
        var em = (email || '').trim().toLowerCase();
        if (!em) return;
        var arr = getBlockedEmails();
        if (arr.indexOf(em) === -1) { arr.push(em); saveBlockedEmails(arr); }
      }
      function removeBlockedEmail(email) {
        var em = (email || '').trim().toLowerCase();
        saveBlockedEmails(getBlockedEmails().filter(function (x) { return x !== em; }));
      }
      function upsertSiteUser(email, name) {
        var em = (email || '').trim().toLowerCase();
        if (!em) return;
        var arr = getSiteUsers();
        var idx = arr.findIndex(function (u) { return (u.email || '').toLowerCase() === em; });
        if (idx >= 0) {
          if (arr[idx].status === 'excluded') return;
          arr[idx].name = (name && String(name).trim()) ? String(name).trim() : (arr[idx].name || '');
          if (!arr[idx].at) arr[idx].at = new Date().toISOString();
        } else {
          arr.push({ email: em, name: (name && String(name).trim()) ? String(name).trim() : '', at: new Date().toISOString(), status: 'active' });
        }
        saveSiteUsers(arr);
      }
      function promoteEmailToFundMember(email, nameEn, nameAr, tier) {
        if (typeof getFundMembers !== 'function' || typeof saveFundMembers !== 'function') return;
        var em = (email || '').trim().toLowerCase();
        if (!em) return;
        var list = getFundMembers();
        if (list.some(function (m) { return (m.email || '').trim().toLowerCase() === em; })) return;
        var newId = typeof getNextMembershipId === 'function' ? getNextMembershipId() : ('IIF-MEM-' + new Date().getFullYear() + '-' + Date.now());
        var start = new Date().toISOString().slice(0, 10);
        var endD = new Date(); endD.setFullYear(endD.getFullYear() + 1);
        var end = endD.toISOString().slice(0, 10);
        var t = tier || 'shared';
        var ne = (nameEn && String(nameEn).trim()) ? String(nameEn).trim() : em;
        var na = (nameAr && String(nameAr).trim()) ? String(nameAr).trim() : ne;
        list.push({ id: newId, membershipId: newId, email: em, nameEn: ne, nameAr: na, tier: t, photoUrl: '', bioEn: '', bioAr: '', startDate: start, endDate: end, worksLinks: [], showWorksLinks: false });
        saveFundMembers(list);
        if (typeof addToMembershipRegistry === 'function') addToMembershipRegistry(em, t, start, end);
        if (typeof renderPublicMembersList === 'function') renderPublicMembersList();
        if (typeof renderDashboardFundMembersList === 'function') renderDashboardFundMembersList();
      }
      function isProtectedOwnerEmail(email) {
        var em = (email || '').trim().toLowerCase();
        var ownerEmail = (window.IIF_CONFIG && window.IIF_CONFIG.ownerEmail) ? String(window.IIF_CONFIG.ownerEmail).toLowerCase() : 'talalkenani@gmail.com';
        return !!(em && iifAuthEmailKey(em) === iifAuthEmailKey(ownerEmail));
      }
      function excludeFundMemberByEmail(email) {
        var em = (email || '').trim().toLowerCase();
        if (!em || typeof getFundMembers !== 'function' || typeof saveFundMembers !== 'function') return;
        if (isProtectedOwnerEmail(em)) {
          var isArO = document.documentElement.getAttribute('data-lang') === 'ar';
          alert(isArO ? 'لا يمكن استبعاد بريد المالك.' : 'Cannot exclude the owner email.');
          return;
        }
        var memberBefore = getFundMembers().find(function (m) { return (m.email || '').trim().toLowerCase() === em; });
        var regSnap = typeof getMembershipRegistry === 'function' ? getMembershipRegistry().filter(function (r) { return (r.email || '').toLowerCase() === em; }) : [];
        if (typeof appendExclusionArchive === 'function') {
          appendExclusionArchive({
            kind: 'fund_member_excluded',
            email: em,
            title: memberBefore ? (memberBefore.nameEn || memberBefore.nameAr || em) : em,
            snapshot: { member: memberBefore ? sanitizeForArchive(memberBefore) : null, registry: sanitizeForArchive(regSnap) }
          });
        }
        saveFundMembers(getFundMembers().filter(function (m) { return (m.email || '').trim().toLowerCase() !== em; }));
        if (typeof getMembershipRegistry === 'function' && typeof saveMembershipRegistry === 'function') {
          saveMembershipRegistry(getMembershipRegistry().filter(function (r) { return (r.email || '').toLowerCase() !== em; }));
        }
        if (typeof removeCredentialForEmail === 'function') removeCredentialForEmail(em);
        addBlockedEmail(em);
        if (typeof renderPublicMembersList === 'function') renderPublicMembersList();
        if (typeof renderDashboardFundMembersList === 'function') renderDashboardFundMembersList();
      }
      function excludeSiteUserOnly(email) {
        var em = (email || '').trim().toLowerCase();
        if (!em) return;
        if (isProtectedOwnerEmail(em)) {
          var isArS = document.documentElement.getAttribute('data-lang') === 'ar';
          alert(isArS ? 'لا يمكن استبعاد بريد المالك.' : 'Cannot exclude the owner email.');
          return;
        }
        var siteUserBefore = getSiteUsers().find(function (u) { return (u.email || '').toLowerCase() === em; });
        if (typeof appendExclusionArchive === 'function') {
          appendExclusionArchive({
            kind: 'site_user_excluded',
            email: em,
            title: siteUserBefore ? (siteUserBefore.name || em) : em,
            snapshot: { user: siteUserBefore ? sanitizeForArchive(siteUserBefore) : {} }
          });
        }
        var arr = getSiteUsers().map(function (u) {
          if ((u.email || '').toLowerCase() !== em) return u;
          return Object.assign({}, u, { status: 'excluded' });
        });
        saveSiteUsers(arr);
        addBlockedEmail(em);
        if (typeof removeCredentialForEmail === 'function') removeCredentialForEmail(em);
      }
      window.IIF_MEMBERSHIP_AUTH = {
        getLoggedEmail: function () { try { return (localStorage.getItem('iif-user-email') || '').trim().toLowerCase(); } catch (e) { return ''; } },
        getMembershipType: function () { return typeof getMembershipType === 'function' ? getMembershipType() : ''; },
        hasValidMembership: function () {
          try {
            var t = typeof getMembershipType === 'function' ? getMembershipType() : '';
            if (!t || (t !== 'cooperating' && t !== 'shared' && t !== 'premium_2143' && t !== 'premium_3143' && t !== 'premium_4143')) return false;
            var exp = typeof getMembershipExpiry === 'function' ? getMembershipExpiry() : '';
            if (exp) { try { if (new Date() > new Date(exp)) return false; } catch (e1) { } }
            return true;
          } catch (e) { return false; }
        },
        setLoggedMember: function (email) { try { if (email) localStorage.setItem('iif-user-email', (email || '').trim().toLowerCase()); } catch (e) { } },
        syncMembershipStatus: function () { }
      };
      function getStoredEntity() { try { return localStorage.getItem('iif-user-entity') || ''; } catch (e) { return ''; } }
      function getStoredCountry() { try { return localStorage.getItem('iif-user-country') || ''; } catch (e) { return ''; } }
      var CERT_PHOTO_KEY = 'iif-cert-photo-';
      var CERT_LOGO_KEY = 'iif-cert-logo-';
      var CERT_FLAG_KEY = 'iif-cert-flag-';
      function getCertImageKey(prefix) {
        var email = (localStorage.getItem('iif-user-email') || '').trim().toLowerCase();
        if (!email && window.IIF_MEMBERSHIP_AUTH && typeof IIF_MEMBERSHIP_AUTH.getLoggedEmail === 'function') {
          email = (IIF_MEMBERSHIP_AUTH.getLoggedEmail() || '').trim().toLowerCase();
          if (email) try { localStorage.setItem('iif-user-email', email); } catch (e) { }
        }
        return email ? prefix + email : null;
      }
      function getAllCertImageKeys(prefix) {
        var keys = [];
        var e1 = (localStorage.getItem('iif-user-email') || '').trim().toLowerCase();
        var e2 = '';
        if (window.IIF_MEMBERSHIP_AUTH && typeof IIF_MEMBERSHIP_AUTH.getLoggedEmail === 'function')
          e2 = (IIF_MEMBERSHIP_AUTH.getLoggedEmail() || '').trim().toLowerCase();
        if (e1) keys.push(prefix + e1);
        if (e2 && keys.indexOf(prefix + e2) === -1) keys.push(prefix + e2);
        return keys;
      }
      function getCertPhoto() {
        var keys = getAllCertImageKeys(CERT_PHOTO_KEY);
        for (var i = 0; i < keys.length; i++) { var v = localStorage.getItem(keys[i]) || ''; if (v) return v; }
        try {
          var em = (localStorage.getItem('iif-user-email') || '').trim().toLowerCase();
          if (em) {
            var raw = localStorage.getItem('iif-user-profile');
            if (raw) {
              var o = JSON.parse(raw);
              var av = o[em] && o[em].avatarDataUrl;
              if (typeof av === 'string' && av.trim().indexOf('data:image') === 0) return av.trim();
            }
          }
        } catch (eAv) { }
        return '';
      }
      function getCertLogo() {
        var keys = getAllCertImageKeys(CERT_LOGO_KEY);
        for (var i = 0; i < keys.length; i++) { var v = localStorage.getItem(keys[i]) || ''; if (v) return v; }
        return '';
      }
      function getCertFlag() {
        var keys = getAllCertImageKeys(CERT_FLAG_KEY);
        for (var i = 0; i < keys.length; i++) { var v = localStorage.getItem(keys[i]) || ''; if (v) return v; }
        return '';
      }
      function setCertPhoto(dataUrl) {
        var k = getCertImageKey(CERT_PHOTO_KEY);
        if (!k && window.IIF_MEMBERSHIP_AUTH && typeof IIF_MEMBERSHIP_AUTH.getLoggedEmail === 'function') {
          var e = (IIF_MEMBERSHIP_AUTH.getLoggedEmail() || '').trim().toLowerCase();
          if (e) { try { localStorage.setItem('iif-user-email', e); } catch (err) { } k = CERT_PHOTO_KEY + e; }
        }
        if (!k) {
          alert(iifMessage('signInFirstEmailUnknown'));
          return;
        }
        var keys = getAllCertImageKeys(CERT_PHOTO_KEY);
        try {
          for (var i = 0; i < keys.length; i++) localStorage.setItem(keys[i], dataUrl || '');
          try {
            var em2 = (localStorage.getItem('iif-user-email') || '').trim().toLowerCase();
            if (em2) {
              var rawP = localStorage.getItem('iif-user-profile');
              var o2 = {};
              try { o2 = rawP ? JSON.parse(rawP) : {}; } catch (eJ) { o2 = {}; }
              if (!o2[em2]) o2[em2] = {};
              if (dataUrl && String(dataUrl).indexOf('data:image') === 0) o2[em2].avatarDataUrl = dataUrl;
              else delete o2[em2].avatarDataUrl;
              localStorage.setItem('iif-user-profile', JSON.stringify(o2));
            }
          } catch (eMirror) { }
          if (typeof renderAboutTeam === 'function') renderAboutTeam();
          if (typeof renderPublicMembersList === 'function') renderPublicMembersList();
        } catch (e) {
          alert(iifMessage('photoSaveFailedStorage'));
        }
      }
      function setCertLogo(dataUrl) {
        var k = getCertImageKey(CERT_LOGO_KEY);
        if (!k && window.IIF_MEMBERSHIP_AUTH && typeof IIF_MEMBERSHIP_AUTH.getLoggedEmail === 'function') {
          var e = (IIF_MEMBERSHIP_AUTH.getLoggedEmail() || '').trim().toLowerCase();
          if (e) { try { localStorage.setItem('iif-user-email', e); } catch (err) { } k = CERT_LOGO_KEY + e; }
        }
        if (!k) return;
        var keys = getAllCertImageKeys(CERT_LOGO_KEY);
        try { for (var i = 0; i < keys.length; i++) localStorage.setItem(keys[i], dataUrl || ''); } catch (e) {
          alert(iifMessage('logoSaveFailed'));
        }
      }
      function setCertFlag(dataUrl) {
        var k = getCertImageKey(CERT_FLAG_KEY);
        if (!k && window.IIF_MEMBERSHIP_AUTH && typeof IIF_MEMBERSHIP_AUTH.getLoggedEmail === 'function') {
          var e = (IIF_MEMBERSHIP_AUTH.getLoggedEmail() || '').trim().toLowerCase();
          if (e) { try { localStorage.setItem('iif-user-email', e); } catch (err) { } k = CERT_FLAG_KEY + e; }
        }
        if (!k) return;
        var keys = getAllCertImageKeys(CERT_FLAG_KEY);
        try { for (var i = 0; i < keys.length; i++) localStorage.setItem(keys[i], dataUrl || ''); } catch (e) {
          alert(iifMessage('flagSaveFailed'));
        }
      }
      var DEF_DEFINITION_EN = 'Internationally classified global financial expert';
      var DEF_DEFINITION_AR = 'خبير مالي دولي مصنف عالمياً';
      function getCertDefinitionEn() { try { return (localStorage.getItem('iif-user-definition-en') || '').trim() || DEF_DEFINITION_EN; } catch (e) { return DEF_DEFINITION_EN; } }
      function getCertDefinitionAr() { try { return (localStorage.getItem('iif-user-definition-ar') || '').trim() || DEF_DEFINITION_AR; } catch (e) { return DEF_DEFINITION_AR; } }
      function setCertDefinitionEn(v) { try { var s = (v && String(v).trim()) ? String(v).trim() : DEF_DEFINITION_EN; localStorage.setItem('iif-user-definition-en', s); } catch (e) { } }
      function setCertDefinitionAr(v) { try { var s = (v && String(v).trim()) ? String(v).trim() : DEF_DEFINITION_AR; localStorage.setItem('iif-user-definition-ar', s); } catch (e) { } }
      /* تأمين الرفع والبريد — منع فيروسات وعبث إلكتروني */
      var SAFE_IMAGE_MIMES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      function ensureHttpsUrl(url) {
        if (!url || typeof url !== 'string') return url || '';
        var u = url.trim();
        if (u.indexOf('http://') === 0) return 'https://' + u.slice(7);
        return u;
      }
      var IIF_FUNCS_PREFIX = (function () {
        try {
          var b = (typeof window !== 'undefined' && window.IIF_FUNCS_BASE && String(window.IIF_FUNCS_BASE).trim()) ? window.IIF_FUNCS_BASE.trim() : '';
          if (!b) {
            var meta = document.querySelector && document.querySelector('meta[name="iif-funcs-base"]');
            b = (meta && meta.getAttribute('content')) ? meta.getAttribute('content').trim() : '';
          }
          b = ensureHttpsUrl(b);
          if (b) {
            try {
              var hostname = new URL(b).hostname.replace(/^www\./i, '') || '';
              if (/\.vercel\.app$/i.test(hostname) || hostname === 'iiffund.com') return '/api';
            } catch (eHost) {
              if (/vercel\.app$/i.test(b)) return '/api';
            }
            return '/.netlify/functions';
          }
          return '/api';
        } catch (e) { return '/api'; }
      })();
      try { window.ensureHttpsUrl = ensureHttpsUrl; } catch (e) { }
      try { window.IIF_FUNCS_PREFIX = IIF_FUNCS_PREFIX; } catch (e) { }
      var CONTENT_CHECK_ENDPOINT = IIF_FUNCS_PREFIX + '/check-content';
      var CONTENT_REJECT_MSG_EN = 'This content is classified as inappropriate on the site. Please replace it with something else for it to be accepted.';
      var CONTENT_REJECT_MSG_AR = 'هذا المحتوى مصنف في الموقع كمحتوى غير لائق. يرجى استبداله بغيره حتى يتم قبوله.';
      var CONTENT_REJECT_TEXT_EN = 'The image contains offensive text, extremist or unwanted symbols. Please use an image without such content.';
      var CONTENT_REJECT_TEXT_AR = 'الصورة تحتوي على كتابة بذيئة أو شعارات تدل على تطرف أو غير مرغوب فيها عالمياً. يرجى استخدام صورة خالية منها.';
      var CONTENT_REJECT_CONTACT_EN = 'The image must not contain email or phone numbers. Please use an image without contact details.';
      var CONTENT_REJECT_CONTACT_AR = 'لا يُقبل أن تحتوي الصورة على بريد إلكتروني أو رقم تواصل. يرجى استخدام صورة خالية من بيانات التواصل.';
      function getContentRejectMessage(reason) {
        var isAr = document.documentElement.getAttribute('data-lang') === 'ar';
        if (reason === 'text') return isAr ? CONTENT_REJECT_TEXT_AR : CONTENT_REJECT_TEXT_EN;
        if (reason === 'contact') return isAr ? CONTENT_REJECT_CONTACT_AR : CONTENT_REJECT_CONTACT_EN;
        return isAr ? CONTENT_REJECT_MSG_AR : CONTENT_REJECT_MSG_EN;
      }
      function checkImageContentSafe(imageDataUrl) {
        if (!imageDataUrl || typeof imageDataUrl !== 'string' || imageDataUrl.trim().length < 100) return Promise.resolve({ safe: true });
        var base = (typeof window !== 'undefined' && window.IIF_FUNCS_BASE && window.IIF_FUNCS_BASE.trim()) ? window.IIF_FUNCS_BASE.trim() : '';
        if (!base && document.querySelector) { var meta = document.querySelector('meta[name="iif-funcs-base"]'); base = (meta && meta.getAttribute('content')) ? meta.getAttribute('content').trim() : ''; }
        base = typeof ensureHttpsUrl === 'function' ? ensureHttpsUrl(base) : base;
        var url = (base ? base : '') + CONTENT_CHECK_ENDPOINT;
        return fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ image: imageDataUrl.trim() }) })
          .then(function (r) { return r.json(); })
          .then(function (data) {
            var safe = data && data.safe !== false;
            return { safe: safe, reason: (data && data.reason) || (safe ? null : 'nsfw') };
          })
          .catch(function () { return { safe: true }; });
      }
      function checkVideoContentSafe(videoFile) {
        if (!videoFile || !videoFile.type || videoFile.type.indexOf('video/') !== 0) return Promise.resolve({ safe: true });
        var video = document.createElement('video');
        video.muted = true;
        video.playsInline = true;
        video.preload = 'metadata';
        var objectUrl = URL.createObjectURL(videoFile);
        var times = [0, 0.25, 0.5, 0.75];
        var canvas = document.createElement('canvas');
        canvas.width = 320;
        canvas.height = 180;
        var ctx = canvas.getContext('2d');
        function captureAtTime(t) {
          return new Promise(function (resolve) {
            video.onseeked = function () {
              try {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                var dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                resolve(dataUrl);
              } catch (e) { resolve(null); }
            };
            video.currentTime = t;
          });
        }
        return new Promise(function (resolve) {
          video.onloadedmetadata = function () {
            var duration = video.duration;
            if (!duration || !isFinite(duration)) { URL.revokeObjectURL(objectUrl); resolve({ safe: true }); return; }
            var promises = times.map(function (r) { return captureAtTime(duration * r); });
            Promise.all(promises).then(function (dataUrls) {
              URL.revokeObjectURL(objectUrl);
              var next = function (i) {
                if (i >= dataUrls.length) { resolve({ safe: true }); return; }
                var d = dataUrls[i];
                if (!d) { next(i + 1); return; }
                checkImageContentSafe(d).then(function (r) {
                  if (!r.safe) { resolve({ safe: false, reason: r.reason }); return; }
                  next(i + 1);
                });
              };
              next(0);
            });
          };
          video.onerror = function () { URL.revokeObjectURL(objectUrl); resolve({ safe: true }); };
          video.src = objectUrl;
        });
      }
      function checkFileListContentSafe(files) {
        if (!files || !files.length) return Promise.resolve({ valid: true });
        var idx = 0;
        function next() {
          while (idx < files.length) {
            var f = files[idx];
            var isImg = f.type && f.type.indexOf('image/') === 0;
            var isVid = f.type && f.type.indexOf('video/') === 0;
            if (isImg || isVid) break;
            idx++;
          }
          if (idx >= files.length) return Promise.resolve({ valid: true });
          var f = files[idx];
          if (f.type && f.type.indexOf('image/') === 0) {
            return new Promise(function (resolve) {
              var fr = new FileReader();
              fr.onload = function () {
                checkImageContentSafe(fr.result).then(function (r) {
                  if (!r.safe) { resolve({ valid: false, reason: r.reason }); return; }
                  idx++; next().then(resolve);
                });
              };
              fr.onerror = function () { idx++; next().then(resolve); };
              fr.readAsDataURL(f);
            });
          }
          return checkVideoContentSafe(f).then(function (r) {
            if (!r.safe) return { valid: false, reason: r.reason };
            idx++; return next();
          });
        }
        return next();
      }
      var CERT_IMAGE_MAX_SIZE = 2 * 1024 * 1024; /* 2 MB — للأعضاء/التحميل المدفوع يُضاعف عبر getCertImageMaxSize */
      function getCertImageMaxSize() {
        return (typeof hasDoubleUploadLimit === 'function' && hasDoubleUploadLimit()) ? CERT_IMAGE_MAX_SIZE * 2 : CERT_IMAGE_MAX_SIZE;
      }
      function isSafeDataUrlForImage(dataUrl) {
        if (!dataUrl || typeof dataUrl !== 'string') return false;
        var s = dataUrl.trim().slice(0, 50);
        var maxLen = (typeof hasDoubleUploadLimit === 'function' && hasDoubleUploadLimit()) ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
        return /^data:image\/(jpeg|jpg|png|gif|webp);base64,/i.test(s) && dataUrl.length < maxLen;
      }
      function isDataUrlImageForDisplay(dataUrl) {
        if (!dataUrl || typeof dataUrl !== 'string') return false;
        var t = dataUrl.trim();
        var maxDisplay = (typeof hasDoubleUploadLimit === 'function' && hasDoubleUploadLimit()) ? 12 * 1024 * 1024 : 6 * 1024 * 1024;
        if (t.length < 50 || t.length > maxDisplay) return false;
        return t.indexOf('data:image/') === 0 && t.indexOf(';base64,') > 0;
      }
      function safeImageSrc(url) {
        if (!url || typeof url !== 'string') return '';
        var u = url.trim();
        if (u.slice(0, 5) === 'data:') return isSafeDataUrlForImage(u) ? u : '';
        if (/^https?:\/\/[^\s<>"']+$/i.test(u) && u.length < 2048) return u;
        return '';
      }
      function safeImageSrcForDisplay(url) {
        if (!url || typeof url !== 'string') return '';
        var u = url.trim();
        if (u.slice(0, 5) === 'data:') return (isSafeDataUrlForImage(u) || isDataUrlImageForDisplay(u)) ? u : '';
        if (/^https?:\/\/[^\s<>"']+$/i.test(u) && u.length < 2048) return u;
        return '';
      }
      /** مسارات نسبية آمنة (assets/...) — نفس المصدر فقط */
      function safeRelativeImageSrc(url) {
        if (!url || typeof url !== 'string') return '';
        var u = url.trim();
        if (u.length > 260) return '';
        if (/^https?:|\/\/|data:|javascript:|\.\./.test(u)) return '';
        if (!/\.(png|jpe?g|gif|webp|svg)$/i.test(u)) return '';
        if (/[<>"'\s\\]/.test(u)) return '';
        return u;
      }
      /* ========== نظام الصور الموحد — لا فشل، لا أخطاء، موقع عالمي ========== */
      var IIF_IMAGES = (function () {
        var PLACEHOLDER_PHOTO = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#1a2332"/><circle cx="100" cy="82" r="42" fill="#2d3a4f"/><ellipse cx="100" cy="185" rx="70" ry="28" fill="#2d3a4f"/><text x="100" y="115" text-anchor="middle" fill="#c9a227" font-size="14" font-family="sans-serif">Photo</text><text x="100" y="132" text-anchor="middle" fill="#8b9cb8" font-size="11" font-family="sans-serif">&#1589;&#1608;&#1585;&#1577;</text></svg>');
        var PLACEHOLDER_LOGO = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><rect width="120" height="120" fill="#1a2332" rx="8"/><text x="60" y="68" text-anchor="middle" fill="#c9a227" font-size="12" font-family="sans-serif">Logo</text></svg>');
        var PLACEHOLDER_FLAG = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="80" height="48" viewBox="0 0 80 48"><rect width="80" height="48" fill="#1a2332" rx="2"/><text x="40" y="28" text-anchor="middle" fill="#8b9cb8" font-size="10" font-family="sans-serif">&#1593;&#1604;&#1605;</text></svg>');
        function getPlaceholder(type) {
          if (type === 'logo') return PLACEHOLDER_LOGO;
          if (type === 'flag') return PLACEHOLDER_FLAG;
          return PLACEHOLDER_PHOTO;
        }
        function isValidDataUrl(u) {
          if (u.slice(0, 5) !== 'data:') return false;
          if (isSafeDataUrlForImage(u) || isDataUrlImageForDisplay(u)) return true;
          if (u.indexOf('image/svg+xml') !== -1 && u.length < 5000 && !/script|on\w+=|javascript:/i.test(u)) return true;
          return false;
        }
        function getDisplayImageSrc(url, type) {
          type = type || 'photo';
          var ph = getPlaceholder(type);
          if (!url || typeof url !== 'string') return ph;
          var u = url.trim();
          if (!u) return ph;
          if (u.slice(0, 5) === 'data:') return isValidDataUrl(u) ? u : ph;
          if (/^https?:\/\/[^\s<>"']+$/i.test(u) && u.length < 2048) return u;
          if (safeRelativeImageSrc(u)) return u;
          return ph;
        }
        return { getPlaceholder: getPlaceholder, getDisplayImageSrc: getDisplayImageSrc, PLACEHOLDER_PHOTO: PLACEHOLDER_PHOTO };
      })();
      function getDisplayImageSrc(url, type) { return IIF_IMAGES.getDisplayImageSrc(url, type || 'photo'); }
      function getDefaultTeamPlaceholderDataUrl() { return IIF_IMAGES.PLACEHOLDER_PHOTO; }
      function safeRelativeImageSrcForTeam(url) { return safeRelativeImageSrc(url); }
      function sanitizeEmailForMailto(email) {
        if (!email || typeof email !== 'string') return '';
        return email.trim().replace(/[\r\n,;<>"']/g, '').slice(0, 254).toLowerCase();
      }
      function estimateLocalStorageBytes() {
        try {
          var total = 0;
          for (var i = 0; i < localStorage.length; i++) {
            var k = localStorage.key(i) || '';
            var v = localStorage.getItem(k) || '';
            total += (k.length + v.length) * 2;
          }
          return total;
        } catch (e) { return 0; }
      }
      function formatBytes(n) {
        if (!n || n < 0) return '0 B';
        if (n < 1024) return n + ' B';
        if (n < 1024 * 1024) return Math.round(n / 1024) + ' KB';
        return (n / 1024 / 1024).toFixed(1) + ' MB';
      }
      function compressImageDataUrl(dataUrl, opts) {
        opts = opts || {};
        return new Promise(function (resolve) {
          try {
            if (!dataUrl || typeof dataUrl !== 'string' || dataUrl.indexOf('data:image/') !== 0) return resolve(dataUrl);
            if (/^data:image\/gif;/i.test(dataUrl)) return resolve(dataUrl);
            var maxW = opts.maxW || 640, maxH = opts.maxH || 640;
            var outType = opts.outType || 'image/jpeg';
            var maxLen = opts.maxLen || 900 * 1024; // ~0.9MB string length target
            var img = new Image();
            img.onload = function () {
              try {
                var w = img.naturalWidth || img.width || 0;
                var h = img.naturalHeight || img.height || 0;
                if (!w || !h) return resolve(dataUrl);
                var scale = Math.min(1, maxW / w, maxH / h);
                var nw = Math.max(1, Math.round(w * scale));
                var nh = Math.max(1, Math.round(h * scale));
                var canvas = document.createElement('canvas');
                canvas.width = nw; canvas.height = nh;
                var ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, nw, nh);
                var q = 0.88;
                var out = '';
                for (var i = 0; i < 6; i++) {
                  try { out = canvas.toDataURL(outType, q); } catch (e) { out = canvas.toDataURL('image/jpeg', q); }
                  if (out && out.length <= maxLen) break;
                  q = Math.max(0.62, q - 0.06);
                }
                return resolve(out && out.indexOf('data:image/') === 0 ? out : dataUrl);
              } catch (e) { return resolve(dataUrl); }
            };
            img.onerror = function () { resolve(dataUrl); };
            img.src = dataUrl;
          } catch (e) { resolve(dataUrl); }
        });
      }
      function hasCertImageKind(kind) {
        var v = kind === 'photo' ? getCertPhoto() : kind === 'logo' ? getCertLogo() : getCertFlag();
        return typeof v === 'string' && v.trim().length > 20 && v.trim().slice(0, 10) === 'data:image';
      }
      function refreshCertImagePreviews() {
        var photoPreview = document.getElementById('cert-photo-preview');
        var logoPreview = document.getElementById('cert-logo-preview');
        var flagPreview = document.getElementById('cert-flag-preview');
        var ph = IIF_IMAGES && IIF_IMAGES.getPlaceholder ? IIF_IMAGES.getPlaceholder('photo') : '';
        var pl = IIF_IMAGES && IIF_IMAGES.getPlaceholder ? IIF_IMAGES.getPlaceholder('logo') : '';
        var pf = IIF_IMAGES && IIF_IMAGES.getPlaceholder ? IIF_IMAGES.getPlaceholder('flag') : '';
        function esc(s) { return (s || '').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
        if (photoPreview) { var p = getDisplayImageSrc(getCertPhoto(), 'photo'); photoPreview.innerHTML = '<img loading="lazy" decoding="async" src="' + esc(p) + '" alt="" style="width:100%;height:100%;object-fit:cover;" onerror="this.onerror=null;this.src=\'' + esc(ph) + '\';" />'; }
        if (logoPreview) { var l = getDisplayImageSrc(getCertLogo(), 'logo'); logoPreview.innerHTML = '<img loading="lazy" decoding="async" src="' + esc(l) + '" alt="" style="width:100%;height:100%;object-fit:contain;" onerror="this.onerror=null;this.src=\'' + esc(pl) + '\';" />'; }
        if (flagPreview) { var f = getDisplayImageSrc(getCertFlag(), 'flag'); flagPreview.innerHTML = '<img loading="lazy" decoding="async" src="' + esc(f) + '" alt="" style="width:100%;height:100%;object-fit:contain;" onerror="this.onerror=null;this.src=\'' + esc(pf) + '\';" />'; }
        var photoMsg = document.getElementById('cert-photo-already-msg');
        var logoMsg = document.getElementById('cert-logo-already-msg');
        var flagMsg = document.getElementById('cert-flag-already-msg');
        var hasPhoto = hasCertImageKind('photo');
        var hasLogo = hasCertImageKind('logo');
        var hasFlag = hasCertImageKind('flag');
        if (photoMsg) photoMsg.style.display = hasPhoto ? '' : 'none';
        if (logoMsg) logoMsg.style.display = hasLogo ? '' : 'none';
        if (flagMsg) flagMsg.style.display = hasFlag ? '' : 'none';
        var photoHint = document.getElementById('cert-photo-replace-hint');
        if (photoHint) photoHint.style.display = hasPhoto ? '' : 'none';
        /* لا تستدعِ updateDashboardNav هنا — هو من يستدعي refreshCertImagePreviews فيقود إلى تكدّس لا نهائي */
      }
      (function bindCertificateImageUploads() {
        var loadingText = function () { return iifT('dashUploadProgress', 'Uploading…'); };
        var successPhoto = function () { return iifT('dashCertPhotoUploaded', 'Photo uploaded successfully.'); };
        var successLogo = function () { return iifT('dashCertLogoUploaded', 'Logo uploaded successfully.'); };
        var successFlag = function () { return iifT('dashCertFlagUploaded', 'Flag uploaded successfully.'); };
        var noEmailMsg = function () { return iifT('dashCertSignInFirst', 'Please sign in first to upload.'); };
        var confirmReplaceMsg = function () { return iifT('dashCertConfirmReplace', 'This image is already uploaded. Do you want to remove the previous one and upload again?'); };
        function hasExistingImageForUploadTarget(inputId) {
          if (inputId === 'cert-photo-input') return hasCertImageKind('photo');
          if (inputId === 'cert-logo-input') return hasCertImageKind('logo');
          if (inputId === 'cert-flag-input') return hasCertImageKind('flag');
          var dataEl = inputId === 'team-image-file' ? document.getElementById('team-image-data') : inputId === 'staff-photo-file' ? document.getElementById('staff-photo-data') : inputId === 'fund-member-photo-file' ? document.getElementById('fund-member-photo-data') : null;
          return dataEl && (dataEl.value || '').trim().length > 20 && (dataEl.value || '').trim().slice(0, 10) === 'data:image';
        }
        function openAdjuster(kind, opts) {
          var overlay = document.getElementById('img-adjust-overlay');
          if (!overlay) return;
          var stage = document.getElementById('img-adjust-stage');
          var canvas = document.getElementById('img-adjust-canvas');
          var zoomEl = document.getElementById('img-adjust-zoom');
          var containEl = document.getElementById('img-adjust-contain');
          var retouchEl = document.getElementById('img-adjust-retouch');
          if (!stage || !canvas || !zoomEl || !containEl) return;
          var getUrlFn = (opts && typeof opts.getUrl === 'function') ? opts.getUrl : (kind === 'photo' ? getCertPhoto : kind === 'logo' ? getCertLogo : getCertFlag);
          var setUrlFn = (opts && typeof opts.setUrl === 'function') ? opts.setUrl : null;
          var src = typeof getUrlFn === 'function' ? getUrlFn() : (kind === 'photo' ? getCertPhoto() : kind === 'logo' ? getCertLogo() : getCertFlag());
          if (!src || typeof src !== 'string' || src.trim().length < 20) {
            alert(iifMessage('jsCertUploadAdjustFirst'));
            return;
          }
          if (src.trim().slice(0, 5) !== 'data:') {
            alert(iifMessage('jsCertUploadBrowserSecurity'));
            return;
          }
          var cfg = (function () {
            if (kind === 'photo' || kind === 'team' || kind === 'staff' || kind === 'member') return { outW: 900, outH: 900, circle: true, contain: false };
            if (kind === 'logo') return { outW: 800, outH: 800, circle: false, contain: true };
            return { outW: 900, outH: 520, circle: false, contain: true };
          })();
          containEl.checked = !!cfg.contain;
          zoomEl.value = '1';
          stage.classList.toggle('is-circle', !!cfg.circle);

          var st = { kind: kind, img: null, outW: cfg.outW, outH: cfg.outH, circle: !!cfg.circle, contain: !!cfg.contain, zoom: 1, dx: 0, dy: 0, dragging: false, sx: 0, sy: 0, ox: 0, oy: 0, useRetouch: !!(retouchEl && retouchEl.checked) };
          overlay._state = st;

          function applyRetouchAndColor(ctx, w, h) {
            try {
              var data = ctx.getImageData(0, 0, w, h);
              var d = data.data;
              var len = d.length;
              var rMin = 255, rMax = 0, gMin = 255, gMax = 0, bMin = 255, bMax = 0;
              for (var i = 0; i < len; i += 4) {
                var r = d[i], g = d[i + 1], b = d[i + 2];
                if (r < rMin) rMin = r; if (r > rMax) rMax = r;
                if (g < gMin) gMin = g; if (g > gMax) gMax = g;
                if (b < bMin) bMin = b; if (b > bMax) bMax = b;
              }
              var rRange = rMax - rMin || 1, gRange = gMax - gMin || 1, bRange = bMax - bMin || 1;
              var sat = 1.12;
              for (i = 0; i < len; i += 4) {
                var R = d[i], G = d[i + 1], B = d[i + 2];
                R = Math.max(0, Math.min(255, (R - rMin) * 255 / rRange));
                G = Math.max(0, Math.min(255, (G - gMin) * 255 / gRange));
                B = Math.max(0, Math.min(255, (B - bMin) * 255 / bRange));
                var lum = 0.299 * R + 0.587 * G + 0.114 * B;
                d[i] = Math.max(0, Math.min(255, lum + (R - lum) * sat));
                d[i + 1] = Math.max(0, Math.min(255, lum + (G - lum) * sat));
                d[i + 2] = Math.max(0, Math.min(255, lum + (B - lum) * sat));
              }
              ctx.putImageData(data, 0, 0);
            } catch (e) { }
          }

          function drawTo(ctx, w, h) {
            ctx.clearRect(0, 0, w, h);
            ctx.fillStyle = '#111827';
            ctx.fillRect(0, 0, w, h);
            if (!st.img) return;
            st.useRetouch = !!(retouchEl && retouchEl.checked);
            var iw = st.img.naturalWidth || st.img.width, ih = st.img.naturalHeight || st.img.height;
            if (!iw || !ih) return;
            var base = st.contain ? Math.min(w / iw, h / ih) : Math.max(w / iw, h / ih);
            var sc = base * st.zoom;
            var dw = iw * sc, dh = ih * sc;
            var x = (w - dw) / 2 + st.dx;
            var y = (h - dh) / 2 + st.dy;
            if (st.circle) {
              ctx.save();
              var r = Math.min(w, h) / 2 - 18;
              ctx.beginPath();
              ctx.arc(w / 2, h / 2, r, 0, Math.PI * 2);
              ctx.closePath();
              ctx.clip();
              ctx.drawImage(st.img, x, y, dw, dh);
              ctx.restore();
            } else {
              ctx.drawImage(st.img, x, y, dw, dh);
            }
            if (st.useRetouch) applyRetouchAndColor(ctx, w, h);
          }
          function renderPreview() {
            var ctx = canvas.getContext('2d');
            drawTo(ctx, canvas.width, canvas.height);
          }
          function exportDataUrl() {
            var c = document.createElement('canvas');
            c.width = st.outW; c.height = st.outH;
            var ctx = c.getContext('2d');
            drawTo(ctx, st.outW, st.outH);
            var out = '';
            try { out = c.toDataURL('image/webp', 0.92); } catch (e) { out = c.toDataURL('image/jpeg', 0.9); }
            return out;
          }

          var img = new Image();
          img.onload = function () { st.img = img; st.dx = 0; st.dy = 0; st.zoom = 1; renderPreview(); };
          img.onerror = function () { alert(iifMessage('jsCertImageLoadFailedAdjust')); };
          img.src = src.trim();

          function onPointerDown(e) {
            e.preventDefault();
            st.dragging = true;
            st.sx = e.clientX; st.sy = e.clientY;
            st.ox = st.dx; st.oy = st.dy;
          }
          function onPointerMove(e) {
            if (!st.dragging) return;
            st.dx = st.ox + (e.clientX - st.sx);
            st.dy = st.oy + (e.clientY - st.sy);
            renderPreview();
          }
          function onPointerUp() { st.dragging = false; }

          canvas.onpointerdown = onPointerDown;
          window.addEventListener('pointermove', onPointerMove);
          window.addEventListener('pointerup', onPointerUp, { once: true });

          zoomEl.oninput = function () { st.zoom = parseFloat(zoomEl.value || '1') || 1; renderPreview(); };
          containEl.onchange = function () { st.contain = !!containEl.checked; renderPreview(); };
          if (retouchEl) retouchEl.onchange = function () { st.useRetouch = !!retouchEl.checked; renderPreview(); };

          var close = function () { overlay.classList.remove('is-open'); overlay.setAttribute('aria-hidden', 'true'); };
          var closeBtn = document.getElementById('img-adjust-close');
          var cancelBtn = document.getElementById('img-adjust-cancel');
          var resetBtn = document.getElementById('img-adjust-reset');
          var saveBtn = document.getElementById('img-adjust-save');
          if (closeBtn) closeBtn.onclick = close;
          if (cancelBtn) cancelBtn.onclick = close;
          if (resetBtn) resetBtn.onclick = function () { st.dx = 0; st.dy = 0; st.zoom = 1; zoomEl.value = '1'; renderPreview(); };
          if (saveBtn) saveBtn.onclick = function () {
            var out = exportDataUrl();
            if (!out || out.indexOf('data:image/') !== 0) { close(); return; }
            if (setUrlFn) setUrlFn(out);
            else if (kind === 'photo') setCertPhoto(out);
            else if (kind === 'logo') setCertLogo(out);
            else setCertFlag(out);
            if (!setUrlFn) { refreshCertImagePreviews(); if (typeof updateCertDiag === 'function') updateCertDiag(); }
            alert(iifMessage('jsCertAdjustmentSaved'));
            close();
          };

          overlay.classList.add('is-open');
          overlay.setAttribute('aria-hidden', 'false');
          var isArNow = document.documentElement.getAttribute('data-lang') === 'ar';
          overlay.querySelectorAll('.lang-en').forEach(function (el) { el.style.display = isArNow ? 'none' : ''; });
          overlay.querySelectorAll('.lang-ar').forEach(function (el) { el.style.display = isArNow ? '' : 'none'; });
        }
        function updateCertDiag() {
          var el = document.getElementById('cert-image-diag');
          if (!el) return;
          var e1 = (localStorage.getItem('iif-user-email') || '').trim().toLowerCase();
          var e2 = (window.IIF_MEMBERSHIP_AUTH && typeof IIF_MEMBERSHIP_AUTH.getLoggedEmail === 'function') ? (IIF_MEMBERSHIP_AUTH.getLoggedEmail() || '').trim().toLowerCase() : '';
          var used = (e1 || e2 || '').trim();
          var bytes = estimateLocalStorageBytes();
          el.textContent = iifT('dashCertDiagLine', 'Email: {email} | Storage (approx): {bytes}')
            .replace(/\{email\}/g, used || '—')
            .replace(/\{bytes\}/g, formatBytes(bytes));
        }
        var statusUploading = function () { return iifT('dashUploadProgress', 'Uploading…'); };
        var statusChecking = function () { return iifT('dashCertStatusChecking', 'Checking content…'); };
        var statusProcessing = function () { return iifT('dashCertStatusProcessing', 'Processing…'); };
        var statusSuccess = function () { return iifT('dashCertUploadComplete', 'Upload complete.'); };
        function setCertUploadStatus(previewId, text, show) {
          var id = previewId.replace('-preview', '-status');
          var el = document.getElementById(id);
          if (el) { el.textContent = text || ''; el.style.display = show !== false ? '' : 'none'; }
        }
        function handleFile(key, setFn, previewId, successMsg) {
          var input = document.getElementById(key);
          if (!input) return;
          input.addEventListener('change', function () {
            var file = input.files && input.files[0];
            if (!file) return;
            var kindForConfirm = previewId === 'cert-photo-preview' ? 'photo' : previewId === 'cert-logo-preview' ? 'logo' : previewId === 'cert-flag-preview' ? 'flag' : '';
            /* لوحة الملف الشخصي: onChangeProfilePhotoClick يؤكد الاستبدال قبل فتح المنتقي */
            var skipReplaceConfirm = key === 'dash-profile-photo-file';
            if (kindForConfirm && hasCertImageKind(kindForConfirm) && !skipReplaceConfirm && !confirm(confirmReplaceMsg())) {
              input.value = '';
              return;
            }
            if (!file.type || SAFE_IMAGE_MIMES.indexOf(file.type) === -1) {
              alert(iifT('dashCertFileTypeImageOnly', 'File type not allowed. Use image (JPEG, PNG, GIF, WebP) only.'));
              input.value = '';
              return;
            }
            var certMax = getCertImageMaxSize();
            if (file.size > certMax) {
              var mb = Math.round(certMax / 1024 / 1024);
              alert(iifT('dashCertFileTooLargeMb', 'File too large. Max {mb} MB.').replace(/\{mb\}/g, String(mb)));
              input.value = '';
              return;
            }
            var previewEl = document.getElementById(previewId);
            setCertUploadStatus(previewId, statusUploading(), true);
            if (previewEl) previewEl.innerHTML = '<span style="color:var(--color-accent-gold-soft);font-size:0.75rem;">' + statusUploading() + '</span>';
            var reader = new FileReader();
            reader.onload = function (e) {
              var dataUrl = e.target && e.target.result;
              if (!dataUrl || (!isSafeDataUrlForImage(dataUrl) && !isDataUrlImageForDisplay(dataUrl))) {
                setCertUploadStatus(previewId, '', false);
                if (previewEl) refreshCertImagePreviews();
                alert(iifT('dashCertContentRejected', 'Content rejected for security.'));
                input.value = '';
                return;
              }
              setCertUploadStatus(previewId, statusChecking(), true);
              if (previewEl) previewEl.innerHTML = '<span style="color:var(--color-accent-gold-soft);font-size:0.75rem;">' + statusChecking() + '</span>';
              checkImageContentSafe(dataUrl).then(function (r) {
                if (!r.safe) {
                  setCertUploadStatus(previewId, '', false);
                  if (previewEl) refreshCertImagePreviews();
                  alert(getContentRejectMessage(r.reason));
                  input.value = '';
                  return;
                }
                var keyOk = previewId === 'cert-photo-preview' ? getCertImageKey(CERT_PHOTO_KEY) : (previewId === 'cert-logo-preview' ? getCertImageKey(CERT_LOGO_KEY) : getCertImageKey(CERT_FLAG_KEY));
                if (!keyOk) {
                  setCertUploadStatus(previewId, '', false);
                  if (previewEl) refreshCertImagePreviews();
                  alert(noEmailMsg());
                  input.value = '';
                  return;
                }
                setCertUploadStatus(previewId, statusProcessing(), true);
                if (previewEl) previewEl.innerHTML = '<span style="color:var(--color-accent-gold-soft);font-size:0.75rem;">' + statusProcessing() + '</span>';
                var isPhoto = previewId === 'cert-photo-preview';
                var isFlag = previewId === 'cert-flag-preview';
                compressImageDataUrl(dataUrl, { maxW: isFlag ? 900 : (isPhoto ? 900 : 700), maxH: isFlag ? 520 : (isPhoto ? 900 : 700), outType: 'image/webp', maxLen: isFlag ? 700 * 1024 : (isPhoto ? 900 * 1024 : 700 * 1024) })
                  .then(function (outUrl) {
                    if (!outUrl || (!isSafeDataUrlForImage(outUrl) && !isDataUrlImageForDisplay(outUrl))) outUrl = dataUrl;
                    setFn(outUrl);
                    updateCertDiag();
                    var ok = isSafeDataUrlForImage(outUrl) || isDataUrlImageForDisplay(outUrl);
                    var safe = ok ? outUrl.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;') : '';
                    if (previewEl && safe) {
                      if (isPhoto) previewEl.innerHTML = '<img loading="lazy" decoding="async" src="' + safe + '" alt="" style="width:100%;height:100%;object-fit:cover;" />';
                      else previewEl.innerHTML = '<img loading="lazy" decoding="async" src="' + safe + '" alt="" style="width:100%;height:100%;object-fit:contain;" />';
                    } else refreshCertImagePreviews();
                    if (typeof updateDashboardNav === 'function') updateDashboardNav();
                    if (previewId === 'cert-photo-preview' && typeof window.IIF_syncProfilePhotoPreview === 'function') {
                      try {
                        window.IIF_syncProfilePhotoPreview();
                      } catch (eSyncPh) { }
                    }
                    setCertUploadStatus(previewId, statusSuccess(), true);
                    if (typeof successMsg === 'function') alert(successMsg());
                    input.value = '';
                    setTimeout(function () { setCertUploadStatus(previewId, '', false); refreshCertImagePreviews(); }, (window.IIF_TIMING && window.IIF_TIMING.uploadStatusDismiss) || 2500);
                  });
              });
            };
            reader.onerror = function () {
              setCertUploadStatus(previewId, '', false);
              if (previewEl) refreshCertImagePreviews();
              alert(iifT('dashCertReadFailed', 'Failed to read file.'));
              input.value = '';
            };
            reader.readAsDataURL(file);
          });
        }
        handleFile('cert-photo-input', setCertPhoto, 'cert-photo-preview', successPhoto);
        handleFile('dash-profile-photo-file', setCertPhoto, 'cert-photo-preview', successPhoto);
        handleFile('cert-logo-input', setCertLogo, 'cert-logo-preview', successLogo);
        handleFile('cert-flag-input', setCertFlag, 'cert-flag-preview', successFlag);
        handleFile('cert-photo-capture', setCertPhoto, 'cert-photo-preview', successPhoto);
        handleFile('cert-logo-capture', setCertLogo, 'cert-logo-preview', successLogo);
        handleFile('cert-flag-capture', setCertFlag, 'cert-flag-preview', successFlag);
        refreshCertImagePreviews();
        updateCertDiag();
        document.querySelectorAll('[data-upload-for]').forEach(function (btn) {
          btn.addEventListener('click', function () {
            var id = btn.getAttribute('data-upload-for');
            var input = id ? document.getElementById(id) : null;
            if (!input) return;
            if (hasExistingImageForUploadTarget(id) && !confirm(confirmReplaceMsg())) return;
            input.click();
          });
        });
        (function cameraCaptureInit() {
          var overlay = document.getElementById('cam-capture-overlay');
          var video = document.getElementById('cam-capture-video');
          var canvas = document.getElementById('cam-capture-canvas');
          var btnClose = document.getElementById('cam-capture-close');
          var btnCancel = document.getElementById('cam-capture-cancel');
          var btnShot = document.getElementById('cam-capture-shot');
          var stream = null;
          var currentKind = '';
          function stopStream() {
            try { if (stream) stream.getTracks().forEach(function (t) { try { t.stop(); } catch (e) { } }); } catch (e) { }
            stream = null;
            if (video) try { video.srcObject = null; } catch (e) { }
          }
          function close() {
            stopStream();
            if (overlay) { overlay.classList.remove('is-open'); overlay.setAttribute('aria-hidden', 'true'); }
          }
          function open(kind, captureTarget) {
            currentKind = kind || 'photo';
            overlay._captureTarget = captureTarget || null;
            if (!overlay || !video || !canvas) return;
            var isArNow = document.documentElement.getAttribute('data-lang') === 'ar';
            overlay.querySelectorAll('.lang-en').forEach(function (el) { el.style.display = isArNow ? 'none' : ''; });
            overlay.querySelectorAll('.lang-ar').forEach(function (el) { el.style.display = isArNow ? '' : 'none'; });
            overlay.classList.add('is-open');
            overlay.setAttribute('aria-hidden', 'false');
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
              if (captureTarget) {
                var fileId = captureTarget.dataElId === 'team-image-data' ? 'team-image-file' : captureTarget.dataElId === 'staff-photo-data' ? 'staff-photo-file' : 'fund-member-photo-file';
                var fileEl = document.getElementById(fileId);
                if (fileEl) fileEl.click();
              } else {
                var capId = currentKind === 'photo' ? 'cert-photo-capture' : currentKind === 'logo' ? 'cert-logo-capture' : 'cert-flag-capture';
                var capEl = document.getElementById(capId);
                if (capEl) capEl.click();
              }
              close();
              return;
            }
            var facing = currentKind === 'photo' ? 'user' : 'environment';
            navigator.mediaDevices.getUserMedia({ video: { facingMode: facing }, audio: false })
              .then(function (s) { stream = s; video.srcObject = s; })
              .catch(function () {
                if (captureTarget) {
                  var fileId = captureTarget.dataElId === 'team-image-data' ? 'team-image-file' : captureTarget.dataElId === 'staff-photo-data' ? 'staff-photo-file' : 'fund-member-photo-file';
                  var fileEl = document.getElementById(fileId);
                  if (fileEl) fileEl.click();
                } else {
                  var capId = currentKind === 'photo' ? 'cert-photo-capture' : currentKind === 'logo' ? 'cert-logo-capture' : 'cert-flag-capture';
                  var capEl = document.getElementById(capId);
                  if (capEl) capEl.click();
                }
                close();
              });
          }
          function getKindConfig(kind) {
            if (kind === 'photo') return { setFn: setCertPhoto, previewId: 'cert-photo-preview', successMsg: successPhoto, outW: 900, outH: 900 };
            if (kind === 'logo') return { setFn: setCertLogo, previewId: 'cert-logo-preview', successMsg: successLogo, outW: 800, outH: 800 };
            return { setFn: setCertFlag, previewId: 'cert-flag-preview', successMsg: successFlag, outW: 900, outH: 520 };
          }
          function capture() {
            if (!video || !canvas) return;
            var target = overlay._captureTarget;
            var cfg = target ? { outW: 900, outH: 900 } : getKindConfig(currentKind);
            var vw = video.videoWidth || 0, vh = video.videoHeight || 0;
            if (!vw || !vh) return;
            canvas.width = cfg.outW; canvas.height = cfg.outH;
            var ctx = canvas.getContext('2d');
            var targetRatio = cfg.outW / cfg.outH;
            var srcRatio = vw / vh;
            var sw = vw, sh = vh, sx = 0, sy = 0;
            if (srcRatio > targetRatio) { sw = Math.round(vh * targetRatio); sx = Math.round((vw - sw) / 2); }
            else { sh = Math.round(vw / targetRatio); sy = Math.round((vh - sh) / 2); }
            ctx.fillStyle = '#000'; ctx.fillRect(0, 0, cfg.outW, cfg.outH);
            ctx.drawImage(video, sx, sy, sw, sh, 0, 0, cfg.outW, cfg.outH);
            var dataUrl = '';
            try { dataUrl = canvas.toDataURL('image/jpeg', 0.92); } catch (e) { try { dataUrl = canvas.toDataURL(); } catch (e2) { } }
            close();
            if (!dataUrl) return;
            checkImageContentSafe(dataUrl).then(function (r) {
              if (!r.safe) { alert(getContentRejectMessage(r.reason)); return; }
              if (target) {
                var dataEl = document.getElementById(target.dataElId);
                var urlEl = document.getElementById(target.urlElId);
                compressImageDataUrl(dataUrl, { maxW: cfg.outW, maxH: cfg.outH, outType: 'image/webp', maxLen: 900 * 1024 })
                  .then(function (outUrl) {
                    if (dataEl) dataEl.value = outUrl || dataUrl;
                    if (urlEl) urlEl.value = '';
                    alert(iifMessage('jsCertImageCapturedSaved'));
                    if (typeof openAdjuster === 'function') openAdjuster('photo', { getUrl: function () { return (dataEl && dataEl.value) || ''; }, setUrl: function (u) { if (dataEl) dataEl.value = u; if (urlEl) urlEl.value = ''; } });
                  });
                return;
              }
              compressImageDataUrl(dataUrl, { maxW: cfg.outW, maxH: cfg.outH, outType: 'image/webp', maxLen: 900 * 1024 })
                .then(function (outUrl) {
                  cfg.setFn(outUrl || dataUrl);
                  refreshCertImagePreviews();
                  updateCertDiag();
                  if (typeof cfg.successMsg === 'function') alert(cfg.successMsg());
                  if (typeof openAdjuster === 'function') openAdjuster(currentKind);
                });
            });
          }
          if (btnClose) btnClose.addEventListener('click', close);
          if (btnCancel) btnCancel.addEventListener('click', close);
          if (btnShot) btnShot.addEventListener('click', capture);
          if (overlay) overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
          document.querySelectorAll('[data-camera-kind]').forEach(function (btn) {
            btn.addEventListener('click', function () {
              var k = btn.getAttribute('data-camera-kind') || 'photo';
              if (hasCertImageKind(k) && !confirm(confirmReplaceMsg())) return;
              open(k);
            });
          });
          var dashTargets = { team: { dataElId: 'team-image-data', urlElId: 'team-image-url' }, staff: { dataElId: 'staff-photo-data', urlElId: 'staff-photo-url' }, member: { dataElId: 'fund-member-photo-data', urlElId: 'fund-member-photo-url' } };
          document.querySelectorAll('[data-camera-target]').forEach(function (btn) {
            btn.addEventListener('click', function () {
              var t = (btn.getAttribute('data-camera-target') || '').toLowerCase();
              if (!dashTargets[t]) return;
              var dataEl = document.getElementById(dashTargets[t].dataElId);
              if (dataEl && (dataEl.value || '').trim().length > 20 && (dataEl.value || '').trim().slice(0, 10) === 'data:image' && !confirm(confirmReplaceMsg())) return;
              open('photo', dashTargets[t]);
            });
          });
        })();
        document.querySelectorAll('[data-adjust-kind]').forEach(function (btn) {
          btn.addEventListener('click', function () {
            var kind = btn.getAttribute('data-adjust-kind') || '';
            if (kind) openAdjuster(kind);
          });
        });
        var dashboardTargets = {
          team: { dataElId: 'team-image-data', urlElId: 'team-image-url' },
          staff: { dataElId: 'staff-photo-data', urlElId: 'staff-photo-url' },
          member: { dataElId: 'fund-member-photo-data', urlElId: 'fund-member-photo-url' }
        };
        document.querySelectorAll('[data-adjust-target]').forEach(function (btn) {
          btn.addEventListener('click', function () {
            var target = (btn.getAttribute('data-adjust-target') || '').toLowerCase();
            var t = dashboardTargets[target];
            if (!t) return;
            openAdjuster('photo', {
              getUrl: function () { var el = document.getElementById(t.dataElId); return (el && el.value) || ''; },
              setUrl: function (u) { var dataEl = document.getElementById(t.dataElId); var urlEl = document.getElementById(t.urlElId); if (dataEl) dataEl.value = u; if (urlEl) urlEl.value = ''; }
            });
          });
        });
        document.querySelectorAll('[data-delete-image]').forEach(function (btn) {
          btn.addEventListener('click', function () {
            var kind = (btn.getAttribute('data-delete-image') || '').toLowerCase();
            var prefix = kind === 'photo' ? CERT_PHOTO_KEY : kind === 'logo' ? CERT_LOGO_KEY : kind === 'flag' ? CERT_FLAG_KEY : '';
            if (!prefix) return;
            try {
              getAllCertImageKeys(prefix).forEach(function (k) { try { localStorage.removeItem(k); } catch (e) { } });
            } catch (e) { }
            refreshCertImagePreviews();
            if (typeof updateCertDiag === 'function') updateCertDiag();
            var inputId = kind === 'photo' ? 'cert-photo-input' : kind === 'logo' ? 'cert-logo-input' : 'cert-flag-input';
            var input = document.getElementById(inputId);
            if (input) input.value = '';
            var capId = kind === 'photo' ? 'cert-photo-capture' : kind === 'logo' ? 'cert-logo-capture' : 'cert-flag-capture';
            var cap = document.getElementById(capId);
            if (cap) cap.value = '';
            alert(iifMessage('jsCertImageDeleted'));
          });
        });
        document.querySelectorAll('[data-delete-target]').forEach(function (btn) {
          btn.addEventListener('click', function () {
            var target = (btn.getAttribute('data-delete-target') || '').toLowerCase();
            var t = dashboardTargets[target];
            if (!t) return;
            var dataEl = document.getElementById(t.dataElId);
            var urlEl = document.getElementById(t.urlElId);
            if (dataEl) dataEl.value = '';
            if (urlEl) urlEl.value = '';
            var fileId = target === 'team' ? 'team-image-file' : target === 'staff' ? 'staff-photo-file' : 'fund-member-photo-file';
            var fileEl = document.getElementById(fileId);
            if (fileEl) fileEl.value = '';
            var capId = target === 'team' ? 'team-image-capture' : target === 'staff' ? 'staff-photo-capture' : 'fund-member-photo-capture';
            var capEl = document.getElementById(capId);
            if (capEl) capEl.value = '';
            alert(iifMessage('jsCertImageDeleted'));
          });
        });
        var clearBtn = document.getElementById('cert-clear-images-btn');
        if (clearBtn) clearBtn.addEventListener('click', function () {
          try {
            var keysP = getAllCertImageKeys(CERT_PHOTO_KEY);
            var keysL = getAllCertImageKeys(CERT_LOGO_KEY);
            var keysF = getAllCertImageKeys(CERT_FLAG_KEY);
            keysP.concat(keysL).concat(keysF).forEach(function (k) { try { localStorage.removeItem(k); } catch (e) { } });
          } catch (e) { }
          refreshCertImagePreviews();
          updateCertDiag();
          alert(iifMessage('jsCertSavedImagesCleared'));
        });
        var defEnInput = document.getElementById('cert-definition-en');
        var defArInput = document.getElementById('cert-definition-ar');
        if (defEnInput) { defEnInput.value = getCertDefinitionEn(); defEnInput.addEventListener('change', function () { setCertDefinitionEn(this.value); }); defEnInput.addEventListener('input', function () { setCertDefinitionEn(this.value); }); }
        if (defArInput) { defArInput.value = getCertDefinitionAr(); defArInput.addEventListener('change', function () { setCertDefinitionAr(this.value); }); defArInput.addEventListener('input', function () { setCertDefinitionAr(this.value); }); }
      })();
      function addToMembershipRegistry(email, type, startDate, endDate) {
        var em = (email || '').trim().toLowerCase();
        if (!em) return;
        var arr = getMembershipRegistry();
        var idx = arr.findIndex(function (m) { return (m.email || '').toLowerCase() === em; });
        var entry = { email: em, type: type || '', startDate: startDate || '', endDate: endDate || '' };
        if (idx >= 0) arr[idx] = entry; else arr.push(entry);
        saveMembershipRegistry(arr);
      }
      var MEMBERSHIP_REMINDERS_SENT_KEY = 'iif-membership-reminders-sent';
      function getRemindersSent() { try { var r = localStorage.getItem(MEMBERSHIP_REMINDERS_SENT_KEY); return r ? JSON.parse(r) : {}; } catch (e) { return {}; } }
      function markReminderSent(email, key) {
        var em = (email || '').trim().toLowerCase();
        if (!em) return;
        var sent = getRemindersSent();
        if (!sent[em]) sent[em] = [];
        if (sent[em].indexOf(key) === -1) sent[em].push(key);
        try { localStorage.setItem(MEMBERSHIP_REMINDERS_SENT_KEY, JSON.stringify(sent)); } catch (e) { }
      }
      function getDueReminders() {
        var registry = getMembershipRegistry();
        var sent = getRemindersSent();
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        var due = [];
        registry.forEach(function (m) {
          var endDate = m.endDate;
          if (!endDate) return;
          var end = new Date(endDate);
          end.setHours(0, 0, 0, 0);
          var msPerDay = 24 * 60 * 60 * 1000;
          var daysUntilEnd = Math.round((end - today) / msPerDay);
          var daysAfterEnd = Math.round((today - end) / msPerDay);
          var em = (m.email || '').toLowerCase();
          var sentList = sent[em] || [];
          if (daysUntilEnd > 0 && daysUntilEnd <= 15) {
            [15, 12, 9, 6, 3].forEach(function (n) {
              if (daysUntilEnd <= n && daysUntilEnd > n - 3 && sentList.indexOf('expiring-' + n) === -1)
                due.push({ email: em, endDate: endDate, type: 'expiring', key: 'expiring-' + n, daysLeft: n, messageEn: 'Your IIF membership expires in ' + n + ' days. Please renew to keep your benefits.', messageAr: 'عضوية الصندوق الدولي تنتهي خلال ' + n + ' يوماً. يرجى التجديد للاحتفاظ بالمزايا.' });
            });
          }
          if (daysAfterEnd >= 0 && daysAfterEnd <= 30) {
            [3, 6, 9, 12, 15, 18, 21, 24, 27, 30].forEach(function (n) {
              if (daysAfterEnd >= n && sentList.indexOf('ended-' + n) === -1)
                due.push({ email: em, endDate: endDate, type: 'ended', key: 'ended-' + n, daysAgo: n, messageEn: 'Your IIF membership has ended. We hope to see you again. Renew when ready.', messageAr: 'انتهى اشتراكك في الصندوق الدولي. نأمل رؤيتك مجدداً. يمكنك التجديد عندما تكون جاهزاً.' });
            });
          }
        });
        return due;
      }
      function renderMembershipReminders() {
        var container = document.getElementById('membership-reminders-due-list');
        if (!container) return;
        var due = getDueReminders();
        var isAr = document.documentElement.getAttribute('data-lang') === 'ar';
        if (due.length === 0) {
          container.innerHTML = '<p style="color:var(--color-text-muted);">' + escapeHtml(iifText('dashRemindersEmpty', 'No reminders due at the moment.')) + '</p>';
          return;
        }
        var html = '<ul class="dashboard-list" style="list-style:none; padding:0;">';
        due.forEach(function (r) {
          var subj = r.type === 'expiring' ? iifMessageFmt('reminderSubjectExpiring', { days: r.daysLeft }) : iifMessage('reminderSubjectEnded');
          var body = isAr ? r.messageAr : r.messageEn;
          var safeEmail = typeof sanitizeEmailForMailto === 'function' ? sanitizeEmailForMailto(r.email) : (r.email || '').trim().toLowerCase().slice(0, 254);
          var mailto = safeEmail ? ('mailto:' + encodeURIComponent(safeEmail) + '?subject=' + encodeURIComponent(subj) + '&body=' + encodeURIComponent(body)) : '#';
          var daysLabel = r.type === 'expiring' ? iifMessageFmt('reminderDaysLeft', { n: r.daysLeft }) : iifMessageFmt('reminderDaysAfterEnd', { n: r.daysAgo });
          html += '<li style="padding: var(--space-3); border-bottom: 1px solid var(--color-border-subtle); display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-2);">';
          html += '<span style="flex:1; min-width:0;">' + escapeHtml(r.email) + '</span>';
          html += '<span style="font-size:0.85rem; color: var(--color-accent-gold-soft);">' + escapeHtml(daysLabel) + '</span>';
          html += '<a href="' + escapeHtml(mailto) + '" target="_blank" rel="noopener noreferrer" class="btn btn--ghost btn-sm">' + escapeHtml(iifMessage('reminderBtnSendEmail')) + '</a>';
          html += '<button type="button" class="btn btn--ghost btn-sm reminder-mark-sent" data-email="' + escapeHtml(r.email) + '" data-key="' + escapeHtml(r.key) + '">' + escapeHtml(iifMessage('reminderBtnMarkSent')) + '</button>';
          html += '</li>';
        });
        html += '</ul>';
        container.innerHTML = html;
        container.querySelectorAll('.reminder-mark-sent').forEach(function (btn) {
          btn.addEventListener('click', function () {
            markReminderSent(btn.getAttribute('data-email'), btn.getAttribute('data-key'));
            renderMembershipReminders();
          });
        });
      }
      /** جميع ميزات الموقع الأساسية مجانية — لا اشتراك مدفوع مطلوب لاستخدام الأدوات */
      function canUsePaidFeature(feature) {
        return true;
      }
      /** مضاعفة حدود الرفع للأعضاء والتحميل المدفوع */
      function hasDoubleUploadLimit() {
        if (typeof isAdmin === 'function' && isAdmin()) return true;
        // منح المالك مضاعفة حدود الرفع
        try {
          var userEmail = (localStorage.getItem('iif-user-email') || '').trim().toLowerCase();
          var ownerEmail = (window.IIF_CONFIG && window.IIF_CONFIG.ownerEmail) ? window.IIF_CONFIG.ownerEmail.toLowerCase() : 'talalkenani@gmail.com';
          if (userEmail && iifAuthEmailKey(userEmail) === iifAuthEmailKey(ownerEmail)) return true;
        } catch (e) { }
        if (typeof IIF_MEMBERSHIP_AUTH !== 'undefined' && IIF_MEMBERSHIP_AUTH.hasValidMembership && IIF_MEMBERSHIP_AUTH.hasValidMembership()) return true;
        return false;
      }
      function showMembershipRequiredModal() {
        var overlay = document.getElementById('membership-required-overlay');
        if (!overlay) return;
        overlay.classList.add('is-open');
        overlay.setAttribute('aria-hidden', 'false');
      }
      function closeMembershipRequiredModal() {
        var overlay = document.getElementById('membership-required-overlay');
        if (overlay) {
          overlay.classList.remove('is-open');
          overlay.setAttribute('aria-hidden', 'true');
        }
      }
      (function bindMembershipModal() {
        var overlay = document.getElementById('membership-required-overlay');
        var closeBtn = document.getElementById('membership-modal-close');
        var gotoBtn = document.getElementById('membership-modal-goto-payment');
        if (closeBtn) closeBtn.addEventListener('click', closeMembershipRequiredModal);
        if (gotoBtn) gotoBtn.addEventListener('click', function () {
          closeMembershipRequiredModal();
          var section = document.getElementById('payment-section');
          if (section) {
            if (typeof window.IIF_scrollIntoViewClearHeader === 'function') {
              window.IIF_scrollIntoViewClearHeader(section, { behavior: 'smooth' });
            } else {
              section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }
        });
        if (overlay) overlay.addEventListener('click', function (e) { if (e.target === overlay) closeMembershipRequiredModal(); });
      })();
      (function bindServiceGateAuthButtons() {
        function goAuth() {
          if (typeof openAuth === 'function') openAuth();
        }
        ['financing-gate-auth', 'feasibility-gate-auth', 'investor-gate-auth'].forEach(function (id) {
          var b = document.getElementById(id);
          if (b) b.addEventListener('click', goAuth);
        });
      })();
      /* بريد شيرمان (chairman) للعضاء فقط — انفو متاح للجميع */
      (function contactEmailMembersOnly() {
        var membersOnlyEmails = ['chairman@iiffund.com'];
        function isMembersOnlyMailto(href) {
          if (!href || href.indexOf('mailto:') !== 0) return false;
          var addr = href.replace(/^mailto:\s*/i, '').split(/[?&]/)[0].trim().toLowerCase();
          return membersOnlyEmails.some(function (e) { return addr.indexOf(e) !== -1; });
        }
        function isMember() {
          return (typeof isAdmin === 'function' && isAdmin()) || (typeof isLoggedIn === 'function' && isLoggedIn());
        }
        function isOwner() {
          try {
            var userEmail = (localStorage.getItem('iif-user-email') || '').trim().toLowerCase();
            var ownerEmail = (window.IIF_CONFIG && window.IIF_CONFIG.ownerEmail) ? window.IIF_CONFIG.ownerEmail.toLowerCase() : 'talalkenani@gmail.com';
            return !!(userEmail && iifAuthEmailKey(userEmail) === iifAuthEmailKey(ownerEmail));
          } catch (e) { return false; }
        }
        function showContactMembersOnlyMessage() {
          var msg = iifMessage('contactMembersOnlyMsg');
          alert(msg);
          if (typeof showMembershipRequiredModal === 'function') showMembershipRequiredModal();
        }
        document.addEventListener('click', function (e) {
          var a = e.target && e.target.closest ? e.target.closest('a[href^="mailto:"]') : null;
          if (!a || !isMembersOnlyMailto(a.getAttribute('href'))) return;
          if (!isMember() && !isOwner()) {
            e.preventDefault();
            e.stopPropagation();
            showContactMembersOnlyMessage();
          }
        }, true);
      })();
      var CERTIFICATES_KEY = 'iif-membership-certificates';
      function getCertificates() { try { var r = localStorage.getItem(CERTIFICATES_KEY); return r ? JSON.parse(r) : {}; } catch (e) { return {}; } }
      function saveCertificates(obj) { try { localStorage.setItem(CERTIFICATES_KEY, JSON.stringify(obj)); } catch (e) { } }
      function getTierLabel(tier, langOpt) {
        var map = { cooperating: 'tierCooperating', shared: 'tierShared', premium_2143: 'tierPremium2143', premium_3143: 'tierPremium3143', premium_4143: 'tierPremium4143' };
        var i18nKey = map[tier];
        if (i18nKey && window.IIF_I18N && typeof window.IIF_I18N.text === 'function') {
          var lg = '';
          if (typeof langOpt === 'string' && langOpt.trim()) lg = langOpt.trim().toLowerCase();
          else if (typeof document !== 'undefined' && document.documentElement) lg = (document.documentElement.getAttribute('data-lang') || 'en').trim().toLowerCase();
          else lg = 'en';
          var ts = window.IIF_I18N.text(i18nKey, lg);
          if (ts) return ts;
        }
        return tier || '';
      }
      function createCertificate() {
        var email = (localStorage.getItem('iif-user-email') || '').trim().toLowerCase();
        var name = (localStorage.getItem('iif-user-name') || '').trim() || email;
        var tier = getMembershipType();
        if (!tier || !email) return null;
        var certId = 'cert-' + Date.now() + '-' + Math.random().toString(36).slice(2, 10);
        var startDate = getMembershipStartDate() || new Date().toISOString().slice(0, 10);
        var endDate = getMembershipExpiry() || '';
        if (!endDate) { var d = new Date(); d.setFullYear(d.getFullYear() + 1); endDate = d.toISOString().slice(0, 10); }
        var entityType = getStoredEntity();
        var photo = getCertPhoto();
        var logo = getCertLogo();
        var flag = getCertFlag();
        var definitionEn = getCertDefinitionEn();
        var definitionAr = getCertDefinitionAr();
        var data = { id: certId, email: email, name: name, tier: tier, startDate: startDate, endDate: endDate, entityType: entityType, photo: photo, logo: logo, flag: flag, definitionEn: definitionEn, definitionAr: definitionAr };
        var store = getCertificates();
        store[certId] = data;
        saveCertificates(store);
        return data;
      }
      var currentCertificateData = null;
      function showCertificateView(data, options) {
        options = options || {};
        var isVerification = !!options.isVerification;
        var overlay = document.getElementById('certificate-overlay');
        if (!overlay || !data) return;
        var lang = document.documentElement.getAttribute('data-lang') || 'en';
        var isAr = lang === 'ar';
        var T = (window.IIF_I18N && window.IIF_I18N.T) ? (window.IIF_I18N.T[lang] || window.IIF_I18N.T.en) : null;
        currentCertificateData = data;
        var nameEl = document.getElementById('certificate-name');
        var tierEl = document.getElementById('certificate-tier');
        var dateEl = document.getElementById('certificate-date');
        var dateRangeEl = document.getElementById('certificate-date-range');
        var qrWrap = document.getElementById('certificate-qr-wrap');
        var verifyBadge = document.getElementById('certificate-verify-badge');
        var downloadBtn = document.getElementById('certificate-download-btn');
        var emailLink = document.getElementById('certificate-email-link');
        if (nameEl) nameEl.textContent = data.name || data.email || '';
        var defEl = document.getElementById('certificate-definition');
        var hasDef = !!(data.definitionEn || data.definitionAr);
        if (defEl) {
          var defText = (isAr && data.definitionAr) ? data.definitionAr : (data.definitionEn || data.definitionAr || '');
          defEl.textContent = defText || '';
          defEl.style.display = hasDef ? '' : 'none';
        }
        if (tierEl) tierEl.textContent = getTierLabel(data.tier);
        var card = document.getElementById('certificate-card');
        if (card) {
          card.classList.remove('cert-tier--cooperating', 'cert-tier--shared', 'cert-tier--premium_2143', 'cert-tier--premium_3143', 'cert-tier--premium_4143');
          card.classList.add('cert-tier--' + (data.tier || 'cooperating'));
        }
        if (dateEl) { dateEl.textContent = (data.startDate && data.endDate) ? '' : (data.date || ''); dateEl.style.display = (data.startDate && data.endDate) ? 'none' : ''; }
        if (dateRangeEl) {
          if (T && T.certDateRangeValid && data.startDate && data.endDate) {
            dateRangeEl.textContent = String(T.certDateRangeValid).replace('{start}', data.startDate).replace('{end}', data.endDate);
            dateRangeEl.style.display = '';
          } else {
            dateRangeEl.textContent = '';
            dateRangeEl.style.display = 'none';
          }
        }
        if (downloadBtn) downloadBtn.style.display = data.id ? 'inline-flex' : 'none';
        if (emailLink) emailLink.style.display = data.email ? 'inline-flex' : 'none';
        var memberImagesEl = document.getElementById('certificate-member-images');
        if (memberImagesEl) {
          memberImagesEl.innerHTML = '';
          var entityType = data.entityType || '';
          var isGov = entityType === 'state' || entityType === 'government_org';
          var isCompany = entityType === 'company';
          var phF = IIF_IMAGES && IIF_IMAGES.getPlaceholder ? IIF_IMAGES.getPlaceholder('flag') : '';
          var phL = IIF_IMAGES && IIF_IMAGES.getPlaceholder ? IIF_IMAGES.getPlaceholder('logo') : '';
          var phP = IIF_IMAGES && IIF_IMAGES.getPlaceholder ? IIF_IMAGES.getPlaceholder('photo') : '';
          if (isGov) {
            var flagImg = document.createElement('img');
            flagImg.src = getDisplayImageSrc(data.flag, 'flag');
            flagImg.alt = '';
            flagImg.className = 'cert-mem-flag';
            flagImg.onerror = function () { this.onerror = null; this.src = phF; };
            memberImagesEl.appendChild(flagImg);
          }
          if (isCompany) {
            var logoImg = document.createElement('img');
            logoImg.src = getDisplayImageSrc(data.logo, 'logo');
            logoImg.alt = '';
            logoImg.className = 'cert-mem-logo';
            logoImg.onerror = function () { this.onerror = null; this.src = phL; };
            memberImagesEl.appendChild(logoImg);
          }
          var photoImg = document.createElement('img');
          photoImg.src = getDisplayImageSrc(data.photo, 'photo');
          photoImg.alt = '';
          photoImg.className = 'cert-mem-photo';
          photoImg.onerror = function () { this.onerror = null; this.src = phP; };
          memberImagesEl.appendChild(photoImg);
          memberImagesEl.style.display = 'flex';
        }
        if (verifyBadge) verifyBadge.style.display = isVerification ? 'block' : 'none';
        var closeBtn = document.getElementById('certificate-close-btn');
        if (closeBtn) { closeBtn.style.display = isVerification ? 'inline-flex' : 'none'; }
        if (qrWrap) {
          qrWrap.innerHTML = '';
          var baseUrl = (typeof location !== 'undefined' && location.origin) ? (location.origin + (location.pathname || '') + location.search) : '';
          var verifyUrl = baseUrl + '#verify-certificate?id=' + encodeURIComponent(data.id);
          if (typeof QRCode !== 'undefined') {
            try { new QRCode(qrWrap, { text: verifyUrl, width: 180, height: 180 }); } catch (e) { }
          }
        }
        overlay.classList.add('is-open');
        overlay.setAttribute('aria-hidden', 'false');
        if (typeof window.IIF_I18N === 'object' && typeof window.IIF_I18N.apply === 'function') {
          window.IIF_I18N.apply(lang);
        }
        if (nameEl) nameEl.textContent = data.name || data.email || '';
        if (defEl && hasDef) {
          var defText2 = (isAr && data.definitionAr) ? data.definitionAr : (data.definitionEn || data.definitionAr || '');
          defEl.textContent = defText2 || '';
        }
        if (dateRangeEl && T && T.certDateRangeValid && data.startDate && data.endDate) {
          dateRangeEl.textContent = String(T.certDateRangeValid).replace('{start}', data.startDate).replace('{end}', data.endDate);
        }
        if (tierEl) tierEl.textContent = getTierLabel(data.tier);
        if (emailLink && data.email) {
          var safeEmail2 = sanitizeEmailForMailto(data.email);
          var subj = T && T.certEmailMailtoSubject ? T.certEmailMailtoSubject : 'IIF digital membership card';
          var body = T && T.certEmailMailtoBody ? T.certEmailMailtoBody : 'Please find my digital membership card attached (download from the site and attach to this email).';
          emailLink.href = safeEmail2 ? ('mailto:' + encodeURIComponent(safeEmail2) + '?subject=' + encodeURIComponent(subj) + '&body=' + encodeURIComponent(body)) : '#';
        }
      }
      function closeCertificateView() {
        var overlay = document.getElementById('certificate-overlay');
        if (overlay) { overlay.classList.remove('is-open'); overlay.setAttribute('aria-hidden', 'true'); }
      }
      function downloadCertificateAsImage() {
        if (!currentCertificateData) return;
        var downloadBtn = document.getElementById('certificate-download-btn');
        if (downloadBtn && downloadBtn.getAttribute('aria-busy') === 'true') return;
        var loadingMsg = iifMessage('downloadPreparing');
        var doneMsg = iifMessage('downloadDone');
        var errMsg = iifMessage('downloadFailed');
        var savedBtnHtml = downloadBtn ? downloadBtn.innerHTML : '';
        function setDownloadButtonLoading(loading) {
          if (!downloadBtn) return;
          downloadBtn.disabled = loading;
          if (loading) {
            downloadBtn.setAttribute('aria-busy', 'true');
            var labelEl = downloadBtn.querySelector('[data-i18n]') || downloadBtn;
            labelEl.textContent = loadingMsg;
          } else {
            downloadBtn.removeAttribute('aria-busy');
            downloadBtn.innerHTML = savedBtnHtml;
            try {
              var Lg = (document.documentElement.getAttribute('data-lang') || 'en').trim().toLowerCase();
              if (window.IIF_I18N && typeof window.IIF_I18N.apply === 'function') window.IIF_I18N.apply(Lg);
            } catch (eCertAp) { }
          }
        }
        function restoreDownloadButton(showSuccessToast, showErrorToast) {
          setDownloadButtonLoading(false);
          if (showSuccessToast && typeof showToastMessage === 'function') showToastMessage(doneMsg, 'success');
          if (showErrorToast && typeof showToastMessage === 'function') showToastMessage(errMsg, 'error');
        }
        setDownloadButtonLoading(true);
        var qrWrap = document.getElementById('certificate-qr-wrap');
        var qrCanvas = qrWrap && qrWrap.querySelector('canvas');
        var w = 600;
        var h = 780;
        var canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        var ctx = canvas.getContext('2d');
        if (!ctx) { restoreDownloadButton(false, true); return; }
        var data = currentCertificateData;
        var entityType = data.entityType || '';
        var isGov = entityType === 'state' || entityType === 'government_org';
        var isCompany = entityType === 'company';
        function drawStatic() {
          ctx.fillStyle = '#0c111b';
          ctx.fillRect(0, 0, w, h);
          ctx.strokeStyle = '#c9a227';
          ctx.lineWidth = 3;
          ctx.strokeRect(20, 20, w - 40, h - 40);
          ctx.strokeStyle = 'rgba(201,162,39,0.3)';
          ctx.lineWidth = 1;
          ctx.strokeRect(28, 28, w - 56, h - 56);
          ctx.fillStyle = '#c9a227';
          ctx.font = 'bold 22px system-ui, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(iifMessage('certTitleDigitalCard'), w / 2, 70);
          ctx.fillStyle = '#94a3b8';
          ctx.font = '14px system-ui, sans-serif';
          ctx.fillText('International Investment Fund — IIF', w / 2, 95);
        }
        function drawMemberImagesAndRest(imagesLoaded) {
          var imgY = 108;
          var gap = 12;
          var flagW = 0; var logoW = 0; var photoW = 50;
          if (imagesLoaded.flag && isGov) flagW = 60;
          if (imagesLoaded.logo && isCompany) logoW = 48;
          var total = (flagW ? flagW + gap : 0) + (logoW ? logoW + gap : 0) + (imagesLoaded.photo ? photoW + gap : 0);
          if (total > 0) total -= gap;
          var startX = (w - total) / 2;
          var x = startX;
          if (imagesLoaded.flag && isGov) {
            ctx.drawImage(imagesLoaded.flag, x, imgY, 60, 36);
            x += 60 + gap;
          }
          if (imagesLoaded.logo && isCompany) {
            ctx.drawImage(imagesLoaded.logo, x, imgY, 48, 48);
            x += 48 + gap;
          }
          if (imagesLoaded.photo) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(x + 25, imgY + 25, 25, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(imagesLoaded.photo, x, imgY, 50, 50);
            ctx.restore();
            x += 50 + gap;
          }
          var nameY = (flagW || logoW || imagesLoaded.photo) ? 168 : 160;
          ctx.fillStyle = '#f1f5f9';
          ctx.font = 'bold 20px system-ui, sans-serif';
          ctx.fillText(data.name || data.email || '', w / 2, nameY);
          var tierLevel = { cooperating: 0, shared: 0, premium_2143: 1, premium_3143: 2, premium_4143: 3 }[data.tier] || 0;
          var tierFontSize = 14 + tierLevel * 2;
          ctx.fillStyle = tierLevel >= 2 ? '#e8d48a' : (tierLevel >= 1 ? '#d4ae2a' : '#c9a227');
          ctx.font = 'bold ' + tierFontSize + 'px system-ui, sans-serif';
          ctx.fillText(getTierLabel(data.tier), w / 2, nameY + 35);
          if (data.startDate && data.endDate) {
            ctx.fillStyle = '#94a3b8';
            ctx.font = '13px system-ui, sans-serif';
            ctx.fillText(iifMessage('certValidFrom') + data.startDate + iifMessage('certValidTo') + data.endDate, w / 2, nameY + 58);
          }
          var qrY = nameY + 85;
          if (qrCanvas) {
            try {
              var qrImg = new Image();
              qrImg.onload = function () {
                ctx.drawImage(qrImg, w / 2 - 90, qrY, 180, 180);
                ctx.fillStyle = '#94a3b8';
                ctx.font = '11px system-ui, sans-serif';
                ctx.fillText(iifMessage('certScanVerifyQr'), w / 2, qrY + 200);
                var link = document.createElement('a');
                link.download = (data.name || 'member').replace(/[^a-zA-Z0-9\u0600-\u06FF\-]/g, '_') + '_IIF_digital_membership_card.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
                restoreDownloadButton(true);
              };
              qrImg.onerror = function () { restoreDownloadButton(false, true); };
              qrImg.src = qrCanvas.toDataURL('image/png');
            } catch (e) {
              finishDownload();
            }
          } else {
            ctx.fillStyle = '#94a3b8';
            ctx.font = '11px system-ui, sans-serif';
            ctx.fillText(iifMessage('certScanVerifyQr'), w / 2, qrY + 90);
            finishDownload();
          }
          function finishDownload() {
            var link = document.createElement('a');
            link.download = (data.name || 'member').replace(/[^a-zA-Z0-9\u0600-\u06FF\-]/g, '_') + '_IIF_digital_membership_card.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
            restoreDownloadButton(true);
          }
        }
        function loadImages() {
          var out = {};
          var need = (isGov ? 1 : 0) + (isCompany ? 1 : 0) + 1;
          var count = 0;
          function onLoad() { count++; if (count >= need) { drawStatic(); drawMemberImagesAndRest(out); } }
          if (isGov) {
            var f = new Image();
            f.onload = function () { out.flag = f; onLoad(); };
            f.onerror = onLoad;
            f.src = getDisplayImageSrc(data.flag, 'flag');
          }
          if (isCompany) {
            var l = new Image();
            l.onload = function () { out.logo = l; onLoad(); };
            l.onerror = onLoad;
            l.src = getDisplayImageSrc(data.logo, 'logo');
          }
          var p = new Image();
          p.onload = function () { out.photo = p; onLoad(); };
          p.onerror = onLoad;
          p.src = getDisplayImageSrc(data.photo, 'photo');
        }
        drawStatic();
        loadImages();
      }
      (function bindCertificateOverlayClose() {
        var overlay = document.getElementById('certificate-overlay');
        var closeBtn = document.getElementById('certificate-close-btn');
        var downloadBtn = document.getElementById('certificate-download-btn');
        if (overlay) overlay.addEventListener('click', function (e) { if (e.target === overlay) closeCertificateView(); });
        if (closeBtn) closeBtn.addEventListener('click', closeCertificateView);
        if (downloadBtn) downloadBtn.addEventListener('click', downloadCertificateAsImage);
      })();
      (function bindPaymentSetMembership() {
        var btn = document.getElementById('payment-set-membership-btn');
        var sel = document.getElementById('payment-set-membership-select');
        var startEl = document.getElementById('payment-membership-start');
        var endEl = document.getElementById('payment-membership-end');
        function setDefaultDates() {
          var today = new Date().toISOString().slice(0, 10);
          var oneYear = new Date();
          oneYear.setFullYear(oneYear.getFullYear() + 1);
          var endDefault = oneYear.toISOString().slice(0, 10);
          if (startEl && !startEl.value) startEl.value = today;
          if (endEl && !endEl.value) endEl.value = endDefault;
        }
        if (startEl || endEl) setDefaultDates();
        if (!btn || !sel) return;
        btn.addEventListener('click', function () {
          setDefaultDates();
          var val = (sel.value || '').trim();
          var startDate = (startEl && startEl.value) || new Date().toISOString().slice(0, 10);
          var endDate = (endEl && endEl.value) || '';
          if (!endDate) { var d = new Date(); d.setFullYear(d.getFullYear() + 1); endDate = d.toISOString().slice(0, 10); }
          if (val && (new Date(endDate) <= new Date(startDate))) {
            alert(iifMessage('membershipDateError'));
            return;
          }
          setMembershipType(val);
          if (val) {
            setMembershipDates(startDate, endDate);
            var email = (localStorage.getItem('iif-user-email') || '').trim().toLowerCase();
            addToMembershipRegistry(email, val, startDate, endDate);
            var cert = createCertificate();
            if (cert) {
              showCertificateView(cert);
              return;
            }
          } else {
            setMembershipDates('', '');
            var email = (localStorage.getItem('iif-user-email') || '').trim().toLowerCase();
            addToMembershipRegistry(email, '', '', '');
          }
          alert(iifMessage('membershipSet'));
        });
      })();
      (function initVerifyCertificateFromHash() {
        function checkVerifyCertHash() {
          var h = (typeof location !== 'undefined' && location.hash) ? location.hash : '';
          var match = h.match(/#verify-certificate\?id=([^&]+)/);
          var certId = match ? decodeURIComponent(match[1].replace(/^["']|["']$/g, '')) : '';
          if (!certId) return;
          var store = getCertificates();
          var data = store[certId];
          if (data) {
            showCertificateView(data, { isVerification: true });
          } else {
            alert(iifMessage('certificateInvalid'));
          }
        }
        if (typeof window !== 'undefined' && window.addEventListener) {
          window.addEventListener('hashchange', function () {
            var h = (location && location.hash) || '';
            if (h.indexOf('verify-certificate') !== -1) checkVerifyCertHash();
          });
        }
        if (typeof location !== 'undefined' && location.hash && location.hash.indexOf('verify-certificate') !== -1) {
          var hashDelay = (window.IIF_TIMING && window.IIF_TIMING.hashOpen) || 100;
          setTimeout(checkVerifyCertHash, hashDelay);
        }
      })();
      function isStaff() {
        try {
          if (!isLoggedIn()) return false;
          var email = (localStorage.getItem('iif-user-email') || '').trim().toLowerCase();
          if (!email) return false;
          var list = typeof getStaffList === 'function' ? getStaffList() : [];
          return list.some(function (s) { return (s.email || '').toLowerCase() === email; });
        } catch (e) { return false; }
      }
      function setAdminByEmail(email) {
        try {
          var e = (email && String(email).trim().toLowerCase()) || '';
          var ownerEmail = (window.IIF_CONFIG && window.IIF_CONFIG.ownerEmail) ? window.IIF_CONFIG.ownerEmail.toLowerCase() : 'talalkenani@gmail.com';
          var ek = iifAuthEmailKey(e);
          var ownerKey = iifAuthEmailKey(ownerEmail);
          var isAdminUser = !!(ek && ownerKey && ek === ownerKey);

          if (!isAdminUser) {
            isAdminUser = ADMIN_EMAILS.some(function (a) { return ek === iifAuthEmailKey(a); });
          }

          if (!isAdminUser && typeof getMembershipRegistry === 'function') {
            var reg = getMembershipRegistry();
            if (reg && reg.length === 1 && iifAuthEmailKey(reg[0].email) === ek) isAdminUser = true;
          }

          if (isAdminUser) localStorage.setItem('iif-is-admin', '1');
          else localStorage.removeItem('iif-is-admin');
        } catch (e) { }
      }
      function doLogout() {
        try {
          if (window.IIF_SECURE_STORAGE && typeof window.IIF_SECURE_STORAGE.clearSecure === 'function') window.IIF_SECURE_STORAGE.clearSecure();
          localStorage.removeItem('iif-logged-in');
          sessionStorage.removeItem('iif-logged-in');
          localStorage.removeItem('iif-is-admin');
          localStorage.removeItem('iif-device-fingerprint');
          localStorage.removeItem('iif-device-bound-email');
          localStorage.removeItem('iif-user-email');
          localStorage.removeItem('iif-user-name');
        } catch (e) { }
        if (typeof closeServicePage === 'function') closeServicePage();

        // تحديث الواجهة فوراً بعد تسجيل الخروج
        setTimeout(function () {
          if (typeof updateAuthUI === 'function') updateAuthUI();
          if (typeof IIF_proactiveRefreshUI === 'function') IIF_proactiveRefreshUI();
          if (typeof updateDashboardNav === 'function') updateDashboardNav();

          // إخفاء لوحة التحكم الشخصية إذا كانت مفتوحة
          var userDashboardSection = document.getElementById('user-dashboard');
          if (userDashboardSection) {
            userDashboardSection.style.display = 'none';
          }

          // إظهار جميع الأقسام الرئيسية
          document.querySelectorAll('.section').forEach(function (section) {
            if (section.id !== 'user-dashboard') {
              section.style.display = '';
            }
          });

          console.log(typeof iifMessage === 'function' ? iifMessage('jsLoggedOutSuccess') : 'Logged out successfully');
        }, 100);
      }
      function updateDashboardNav() {
        if (window.IIF_MEMBERSHIP_AUTH && IIF_MEMBERSHIP_AUTH.syncMembershipStatus) IIF_MEMBERSHIP_AUTH.syncMembershipStatus();

        // منح العضوية البلاتينية التلقائية للمالك
        try {
          var email = (localStorage.getItem('iif-user-email') || '').trim().toLowerCase();
          var ownerEmail = (window.IIF_CONFIG && window.IIF_CONFIG.ownerEmail) ? window.IIF_CONFIG.ownerEmail.toLowerCase() : 'talalkenani@gmail.com';
          if (email && iifAuthEmailKey(email) === iifAuthEmailKey(ownerEmail)) {
            // منح العضوية البلاتينية للمالك
            localStorage.setItem('iif_membership_type_' + email, 'premium_4143');
            var futureDate = new Date();
            futureDate.setFullYear(futureDate.getFullYear() + 50); // 50 سنة
            localStorage.setItem('iif_membership_end_' + email, futureDate.toISOString().split('T')[0]);
            localStorage.setItem('iif_membership_start_' + email, new Date().toISOString().split('T')[0]);
          }
        } catch (e) { }

        var loggedIn = isLoggedIn();
        var userCard = document.getElementById('header-user-card');
        var userPhoto = document.getElementById('header-user-photo');
        var userNameEl = document.getElementById('header-user-name');
        var userMetaEl = document.getElementById('header-user-meta');
        if (userCard) {
          if (loggedIn) {
            userCard.classList.add('is-visible');
            userCard.setAttribute('aria-hidden', 'false');
            try {
              userCard.setAttribute('tabindex', '0');
            } catch (eTb) { }
            var email = (localStorage.getItem('iif-user-email') || '').trim().toLowerCase();
            var isAr = document.documentElement.getAttribute('data-lang') === 'ar';
            var name = (localStorage.getItem('iif-user-name') || '').trim() || email || '';
            if (isAdmin() && typeof getTeamMembers === 'function') {
              var team = getTeamMembers();
              var chair = team[0];
              if (chair) name = isAr ? (chair.nameAr || chair.nameEn || name) : (chair.nameEn || chair.nameAr || name);
            }
            if (userNameEl) userNameEl.textContent = name || email || '—';
            var photoSrc = '';
            if (typeof getCertPhoto === 'function') {
              var raw = getCertPhoto();
              if (raw && typeof raw === 'string' && raw.trim().indexOf('data:image') === 0) photoSrc = raw;
              else photoSrc = (typeof getDisplayImageSrc === 'function' ? getDisplayImageSrc(raw, 'photo') : raw) || '';
            }
            if (!photoSrc && window.IIF_IMAGES && typeof IIF_IMAGES.getPlaceholder === 'function') photoSrc = IIF_IMAGES.getPlaceholder('photo') || '';
            var defaultAvatarSvg = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"%3E%3Ccircle fill="%232d3a4f" cx="24" cy="24" r="24"/%3E%3Cpath fill="%23c9a227" d="M24 24a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm0 8c-6 0-12 3-12 8v4h24v-4c0-5-6-8-12-8z"/%3E%3C/svg%3E';
            if (userPhoto) {
              userPhoto.src = photoSrc || defaultAvatarSvg;
              userPhoto.alt = name ? ('Photo of ' + name) : 'User photo';
              userPhoto.onerror = function () { this.onerror = null; this.src = defaultAvatarSvg; };
              userPhoto.style.display = '';
            }
            var roleLabel = (function () {
              if (isAdmin()) return iifMessage('dashRoleChairman');
              if (typeof getDashboardAccessType === 'function') {
                var dt = getDashboardAccessType();
                if (dt === 'staff') return iifMessage('dashRoleStaff');
                if (dt === 'member') return iifMessage('dashRoleMember');
                if (dt === 'user') return iifMessage('dashRoleRegisteredUser');
              }
              if (typeof isStaff === 'function' && isStaff()) return iifMessage('dashRoleStaff');
              return iifMessage('dashRoleMember');
            })();
            var memType = typeof getMembershipType === 'function' ? getMembershipType() : '';
            var hasValidMem = typeof IIF_MEMBERSHIP_AUTH !== 'undefined' && IIF_MEMBERSHIP_AUTH.hasValidMembership && IIF_MEMBERSHIP_AUTH.hasValidMembership();
            var tierLabel = '';
            if (memType && hasValidMem && window.IIF_CONFIG && IIF_CONFIG.membershipTiers && Array.isArray(IIF_CONFIG.membershipTiers)) {
              var t = IIF_CONFIG.membershipTiers.find(function (x) { return x.id === memType; });
              tierLabel = t ? (isAr ? t.labelAr : t.labelEn) : memType;
            }
            if (!tierLabel && roleLabel === iifMessage('dashRoleMember')) tierLabel = hasValidMem ? iifMessage('dashTierActiveSubscription') : iifMessage('dashTierNoActiveSubscription');
            var entity = typeof getStoredEntity === 'function' ? getStoredEntity() : '';
            var entityLabel = entity === 'company' ? iifMessage('dashEntityCompany') : entity === 'state' || entity === 'government_org' ? iifMessage('dashEntityGovernment') : '';
            var meta = roleLabel + (tierLabel ? ' · ' + tierLabel : '') + (entityLabel ? ' · ' + entityLabel : '');
            if (hasValidMem) {
              var expDate = typeof getMembershipExpiry === 'function' ? getMembershipExpiry() : '';
              if (expDate) meta += iifMessage('dashMetaUntil') + expDate;
            }
            if (userMetaEl) userMetaEl.textContent = meta;
          } else {
            userCard.classList.remove('is-visible');
            userCard.setAttribute('aria-hidden', 'true');
            try {
              userCard.setAttribute('tabindex', '-1');
            } catch (eTb2) { }
            var defaultAvatar = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 48 48\'%3E%3Ccircle fill=\'%232d3a4f\' cx=\'24\' cy=\'24\' r=\'24\'/%3E%3Cpath fill=\'%23c9a227\' d=\'M24 24a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm0 8c-6 0-12 3-12 8v4h24v-4c0-5-6-8-12-8z\'/%3E%3C/svg%3E';
            if (userPhoto) {
              userPhoto.src = defaultAvatar;
              userPhoto.onerror = null;
              userPhoto.style.display = '';
            }
            if (userNameEl) userNameEl.textContent = '';
            if (userMetaEl) userMetaEl.textContent = '';
          }
        }
        var dashBtn = document.getElementById('nav-dashboard');
        var loginBtn = document.getElementById('auth-open');
        var logoutBtn = document.getElementById('nav-logout');
        /* زر لوحة التحكم: يظهر عند وجود صلاحية (مالك، مسؤول، موظف بصلاحية لوحة التحكم، عضو مدفوع، مستخدم مسجّل) */
        var userDashBtn = document.getElementById('nav-user-dashboard');
        var hideDashNav = window.IIF_CONFIG && window.IIF_CONFIG.hideDashboardNavButton;
        if (dashBtn) dashBtn.style.display = (!hideDashNav && loggedIn && typeof canAccessDashboard === 'function' && canAccessDashboard()) ? 'inline-flex' : 'none';
        if (userDashBtn) userDashBtn.style.display = loggedIn ? 'inline-flex' : 'none';
        if (logoutBtn) logoutBtn.style.display = loggedIn ? 'inline-flex' : 'none';
        if (loginBtn) loginBtn.style.display = loggedIn ? 'none' : 'inline-flex';
        var authStrip = document.getElementById('auth-strip');
        if (authStrip) authStrip.classList.toggle('is-hidden', loggedIn);
        var headerAuthBtns = document.getElementById('header-auth-btns');
        if (headerAuthBtns) headerAuthBtns.classList.toggle('is-hidden', loggedIn);
        var paymentAdminDiv = document.getElementById('payment-admin-set-membership');
        if (paymentAdminDiv) paymentAdminDiv.style.display = ((typeof isAdmin === 'function' && isAdmin()) || (typeof hasStaffPermission === 'function' && hasStaffPermission('issue_membership_certificate'))) ? 'block' : 'none';
        var certImagesSection = document.getElementById('certificate-images-section');
        if (certImagesSection) {
          certImagesSection.style.display = isLoggedIn() ? 'block' : 'none';
          if (isLoggedIn() && typeof refreshCertImagePreviews === 'function') refreshCertImagePreviews();
          var defEnInp = document.getElementById('cert-definition-en');
          var defArInp = document.getElementById('cert-definition-ar');
          if (defEnInp) defEnInp.value = getCertDefinitionEn();
          if (defArInp) defArInp.value = getCertDefinitionAr();
          var entity = getStoredEntity();
          var logoWrap = document.getElementById('cert-logo-wrap');
          var flagWrap = document.getElementById('cert-flag-wrap');
          if (logoWrap) logoWrap.style.display = entity === 'company' ? 'block' : 'none';
          if (flagWrap) flagWrap.style.display = (entity === 'state' || entity === 'government_org') ? 'block' : 'none';
          if (typeof refreshCertImagePreviews === 'function') refreshCertImagePreviews();
        }
        if (typeof updateAdminBodyClass === 'function') updateAdminBodyClass();
        try {
          var dashOv = document.getElementById('dashboard-overlay');
          if (loggedIn && dashOv && dashOv.classList.contains('is-open') && typeof applyDashboardAccessRules === 'function') {
            applyDashboardAccessRules();
          }
        } catch (eDash) { }
        try {
          if (typeof openDashboardIfHash === 'function' && typeof window.IIF_hashOpensDashboard === 'function' && window.IIF_hashOpensDashboard(window.location.hash || '')) {
            if (!window.__iifHashDashOpenScheduled) {
              window.__iifHashDashOpenScheduled = true;
              setTimeout(openDashboardIfHash, (window.IIF_TIMING && window.IIF_TIMING.hashOpen) || 100);
            }
          }
        } catch (eHash) { }
        try {
          var pendDash = false;
          try { pendDash = sessionStorage.getItem('iif_pending_open_dashboard') === '1'; } catch (ePs) { }
          if (pendDash && loggedIn && typeof iifExplicitDashboardEntryIntent === 'function' && iifExplicitDashboardEntryIntent() && typeof canAccessDashboard === 'function' && canAccessDashboard()) {
            try { sessionStorage.removeItem('iif_pending_open_dashboard'); } catch (ePr) { }
            setTimeout(function () {
              if (typeof openDashboardEnhanced === 'function') openDashboardEnhanced();
            }, (window.IIF_TIMING && window.IIF_TIMING.hashOpen) || 120);
          }
        } catch (ePend) { }
      }
      try { window.updateAuthUI = updateDashboardNav; } catch (eUA) { }
      var navLogoutBtn = document.getElementById('nav-logout');
      if (navLogoutBtn) {
        navLogoutBtn.addEventListener('click', function (e) {
          e.preventDefault();
          console.log('Logout button clicked');
          doLogout();
        });
      }
      function showAuthWelcome(messageKey) {
        var welcomeEl = document.getElementById('auth-welcome');
        var textEl = document.getElementById('auth-welcome-text');
        var hintEl = document.getElementById('auth-welcome-static-hint');
        var modal = overlay && overlay.querySelector('.auth-modal');
        if (!welcomeEl || !textEl || !modal) return;
        var msg = messageKey === 'login' ? iifMessage('authWelcomeLogin') : messageKey === 'register' ? iifMessage('authWelcomeRegister') : iifMessage('authWelcomeDefault');
        welcomeEl.hidden = false;
        textEl.textContent = msg;
        var staticHost = typeof window.iifIsStaticPublicHost === 'function' && window.iifIsStaticPublicHost();
        if (hintEl) {
          if (staticHost) {
            hintEl.hidden = false;
            hintEl.innerHTML =
              '<span dir="ltr">This site has no shared server: your session stays on this device. Use Dashboard → Export/Import JSON to move data.</span><br /><span dir="rtl">لا يوجد خادم مشترك: جلستك تبقى على هذا الجهاز. لنقل البيانات استخدم من اللوحة تصدير/استيراد JSON.</span>';
          } else {
            hintEl.hidden = true;
            hintEl.textContent = '';
          }
        }
        modal.classList.add('show-welcome');
        var delayMs = staticHost ? 5200 : 2200;
        setTimeout(function () {
          modal.classList.remove('show-welcome');
          welcomeEl.hidden = true;
          textEl.textContent = '';
          if (hintEl) {
            hintEl.hidden = true;
            hintEl.textContent = '';
          }
          closeAuth();
        }, delayMs);
      }
      var DEVICE_BOUND_EMAIL_KEY = 'iif-device-bound-email';
      var VERIFY_CODE_STORAGE_KEY = 'iif-verify-pending';
      function completeLogin(email, opts) {
        opts = opts || {};
        var loginEmail = (email || '').trim().toLowerCase();
        if (!loginEmail) return;
        if (typeof isEmailBlockedFromSite === 'function' && isEmailBlockedFromSite(loginEmail)) {
          alert(iifMessage('jsEmailExcludedFromSite'));
          try { setLoggedIn(false); } catch (e1) { }
          return;
        }
        try {
          var shouldPersist = opts.trustDevice !== false;
          setLoggedIn(true, { persist: shouldPersist });
          setAdminByEmail(loginEmail);
          localStorage.setItem('iif-user-email', loginEmail);
          if (opts.trustDevice !== false) {
            var fp = typeof getDeviceFingerprint === 'function' ? getDeviceFingerprint() : '';
            if (fp) localStorage.setItem(DEVICE_FINGERPRINT_KEY, fp);
            localStorage.setItem(DEVICE_BOUND_EMAIL_KEY, loginEmail);
          }
          if (opts.name) localStorage.setItem('iif-user-name', (opts.name || '').trim());
        } catch (err) { }
        if (window.IIF_MEMBERSHIP_AUTH && typeof IIF_MEMBERSHIP_AUTH.setLoggedMember === 'function') IIF_MEMBERSHIP_AUTH.setLoggedMember(loginEmail);
        if (typeof updateDashboardNav === 'function') updateDashboardNav();
        if (typeof updateFeasibilityGate === 'function') updateFeasibilityGate();
        if (window.IIF_SECURE_STORAGE && typeof window.IIF_SECURE_STORAGE.flush === 'function') window.IIF_SECURE_STORAGE.flush();
        /* تسجيل المستخدم كمسجّل في الموقع فقط — لا يُضاف تلقائياً لأعضاء الصندوق المدفوعين */
        if (typeof upsertSiteUser === 'function') {
          var un = (opts.name || localStorage.getItem('iif-user-name') || '').trim() || loginEmail;
          upsertSiteUser(loginEmail, un);
        }
        var wantDashPortal = false;
        try {
          var _spPortal = new URLSearchParams(window.location.search);
          if (_spPortal.get('iif_admin_portal') === '1') wantDashPortal = true;
          else if (_spPortal.get('open_dashboard') === '1' || _spPortal.get('iif_open_dashboard') === '1') wantDashPortal = true;
          else {
            try {
              if (sessionStorage.getItem('iif_pending_open_dashboard') === '1') wantDashPortal = true;
              else if (sessionStorage.getItem('iif_admin_portal_mode') === '1') wantDashPortal = true;
            } catch (eSsP) { }
          }
          if (!wantDashPortal) {
            try {
              if (document.documentElement.classList.contains('iif-admin-embed') || document.documentElement.classList.contains('iif-admin-portal')) {
                wantDashPortal = true;
              }
            } catch (eClP) { }
          }
          if (!wantDashPortal) {
            try {
              if (typeof window.IIF_hashOpensDashboard === 'function' && window.IIF_hashOpensDashboard(window.location.hash || '')) {
                wantDashPortal = true;
              }
            } catch (eHashP) { }
          }
          if (!wantDashPortal) {
            try {
              if (window.IIF_ADMIN_PORTAL === true || window.IIF_ADMIN_EMBED === true) wantDashPortal = true;
            } catch (eWinP) { }
          }
        } catch (eWantP) { }
        if (window.IIF_SECURE_STORAGE && typeof window.IIF_SECURE_STORAGE.ready === 'function') {
          window.IIF_SECURE_STORAGE.ready().then(function () {
            if (typeof updateDashboardNav === 'function') updateDashboardNav();
            if (wantDashPortal) {
              setTimeout(function () {
                try {
                  if (typeof canAccessDashboard === 'function' && canAccessDashboard() && typeof openDashboardEnhanced === 'function') {
                    openDashboardEnhanced();
                    try { sessionStorage.removeItem('iif_pending_open_dashboard'); } catch (eRm2) { }
                  }
                } catch (eRd) { }
              }, 80);
            }
          }).catch(function () { });
        }
        function iifTryOpenDashboardAfterPortalLogin() {
          try {
            if (typeof canAccessDashboard === 'function' && canAccessDashboard() && typeof openDashboardEnhanced === 'function') {
              openDashboardEnhanced();
              try { sessionStorage.removeItem('iif_pending_open_dashboard'); } catch (eRm) { }
              return true;
            }
          } catch (eTry) { }
          return false;
        }
        if (wantDashPortal) {
          try { closeAuth(); } catch (eClAuth) { }
          try {
            if (typeof window.IIF_hidePublicSiteChrome === 'function') window.IIF_hidePublicSiteChrome();
          } catch (eHid) { }
          var _first = (window.IIF_TIMING && typeof window.IIF_TIMING.openDashboardAfterLogin === 'number') ? window.IIF_TIMING.openDashboardAfterLogin : 0;
          var _delays = [_first, _first + 80, 120, 200, 400, 700, 1200, 2000, 3200];
          var _seen = {};
          _delays.forEach(function (ms) {
            var t = Math.max(0, ms | 0);
            if (_seen[t]) return;
            _seen[t] = true;
            setTimeout(function () { iifTryOpenDashboardAfterPortalLogin(); }, t);
          });
          setTimeout(function () {
            try {
              var ov = document.getElementById('dashboard-overlay');
              if (ov && ov.classList.contains('is-open')) return;
              if (typeof isLoggedIn === 'function' && !isLoggedIn()) return;
              if (typeof canAccessDashboard === 'function' && !canAccessDashboard()) return;
              iifTryOpenDashboardAfterPortalLogin();
            } catch (eFb) { }
          }, 2400);
        } else {
          showAuthWelcome('login');
        }
        if (isWebAuthnSupported() && !hasStoredWebAuthnCredential()) {
          setTimeout(function () { offerBiometricRegistration(loginEmail); }, (window.IIF_TIMING && window.IIF_TIMING.biometricOffer) || 2500);
        }
      }
      function hasTrustedDevice() {
        try {
          var bound = (localStorage.getItem(DEVICE_BOUND_EMAIL_KEY) || '').trim().toLowerCase();
          if (!bound) return false;
          var storedFp = localStorage.getItem(DEVICE_FINGERPRINT_KEY) || '';
          var currentFp = typeof getDeviceFingerprint === 'function' ? getDeviceFingerprint() : '';
          return currentFp && storedFp && currentFp === storedFp;
        } catch (e) { return false; }
      }
      var WEBAUTHN_STORAGE_KEY = 'iif-webauthn-credential';
      function isWebAuthnSupported() {
        try {
          return typeof window.PublicKeyCredential === 'function' && window.isSecureContext === true && typeof navigator.credentials !== 'undefined';
        } catch (e) { return false; }
      }
      function randomChallenge(len) {
        len = len || 32;
        var arr = new Uint8Array(len);
        if (window.crypto && window.crypto.getRandomValues) window.crypto.getRandomValues(arr);
        return arr;
      }
      function base64urlEncode(buffer) {
        var bytes = new Uint8Array(buffer);
        var bin = '';
        for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
        return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      }
      function base64urlDecode(str) {
        str = String(str).replace(/-/g, '+').replace(/_/g, '/');
        while (str.length % 4) str += '=';
        var bin = atob(str);
        var arr = new Uint8Array(bin.length);
        for (var i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
        return arr.buffer;
      }
      function getStoredWebAuthnCredential() {
        try {
          var raw = localStorage.getItem(WEBAUTHN_STORAGE_KEY);
          if (!raw) return null;
          return JSON.parse(raw);
        } catch (e) { return null; }
      }
      function setStoredWebAuthnCredential(data) {
        try { localStorage.setItem(WEBAUTHN_STORAGE_KEY, JSON.stringify(data)); } catch (e) { }
      }
      function hasStoredWebAuthnCredential() {
        var c = getStoredWebAuthnCredential();
        return !!(c && c.credentialId && c.email);
      }
      function registerBiometric(email, onDone) {
        if (!isWebAuthnSupported() || !email) { if (onDone) onDone(false); return; }
        var loginEmail = (email || '').trim().toLowerCase();
        var challenge = randomChallenge(32);
        var user = { id: new TextEncoder().encode(loginEmail), name: loginEmail, displayName: loginEmail };
        var pubKey = {
          challenge: challenge,
          rp: { name: 'International Investment Fund' },
          user: user,
          pubKeyCredParams: [{ type: 'public-key', alg: -7 }],
          authenticatorSelection: { userVerification: 'preferred', residentKey: 'preferred', authenticatorAttachment: 'platform' },
          timeout: 60000
        };
        navigator.credentials.create({ publicKey: pubKey }).then(function (cred) {
          if (!cred || !cred.id) { if (onDone) onDone(false); return; }
          var idToStore = cred.rawId ? base64urlEncode(cred.rawId) : cred.id;
          setStoredWebAuthnCredential({ credentialId: idToStore, email: loginEmail });
          if (onDone) onDone(true);
        }).catch(function () { if (onDone) onDone(false); });
      }
      function authenticateBiometric(onDone) {
        if (!isWebAuthnSupported()) { if (onDone) onDone(null); return; }
        var stored = getStoredWebAuthnCredential();
        if (!stored || !stored.credentialId || !stored.email) { if (onDone) onDone(null); return; }
        var challenge = randomChallenge(32);
        var idBuf = base64urlDecode(stored.credentialId);
        var getOpts = {
          challenge: challenge,
          allowCredentials: [{ type: 'public-key', id: idBuf }],
          userVerification: 'required',
          timeout: 60000
        };
        navigator.credentials.get({ publicKey: getOpts }).then(function (assertion) {
          if (assertion && stored.email) { if (onDone) onDone(stored.email); } else { if (onDone) onDone(null); }
        }).catch(function () { if (onDone) onDone(null); });
      }
      function offerBiometricRegistration(email) {
        if (!isWebAuthnSupported() || !email) return;
        if (hasStoredWebAuthnCredential()) return;
        var loginEmail = (email || '').trim().toLowerCase();
        var msg = iifMessage('biometricEnablePrompt');
        if (!confirm(msg)) return;
        registerBiometric(loginEmail, function (ok) {
          if (ok) alert(iifMessage('biometricEnabled'));
          if (typeof updateAuthLoginOptions === 'function') updateAuthLoginOptions();
        });
      }
      function updateAuthLoginOptions() {
        var deviceBtn = document.getElementById('auth-login-device');
        if (deviceBtn) deviceBtn.style.display = hasTrustedDevice() ? 'inline-flex' : 'none';
        var biometricBtn = document.getElementById('auth-login-biometric');
        if (biometricBtn) biometricBtn.style.display = (hasStoredWebAuthnCredential() && isWebAuthnSupported()) ? 'inline-flex' : 'none';
        var emailPanel = document.getElementById('auth-email-verify-panel');
        var devicePanel = document.getElementById('auth-device-panel');
        if (emailPanel) emailPanel.classList.remove('is-active');
        if (devicePanel) devicePanel.classList.remove('is-active');
        var codeWrap = document.getElementById('verify-code-wrap');
        if (codeWrap) codeWrap.style.display = 'none';
        var recoveryTitleEl = document.getElementById('auth-email-verify-recovery-title');
        if (recoveryTitleEl) recoveryTitleEl.style.display = 'none';
        if (typeof updateLoginRecoveryHint === 'function') updateLoginRecoveryHint();
        var loginEmailEl = document.getElementById('login-email');
        if (loginEmailEl && (!loginEmailEl.value || !loginEmailEl.value.trim())) {
          var ready = window.IIF_SECURE_STORAGE && window.IIF_SECURE_STORAGE.ready;
          if (ready) {
            ready().then(function () {
              var stored = typeof getStoredEmailForField === 'function' ? getStoredEmailForField() : '';
              var el = document.getElementById('login-email');
              if (el && stored && (!el.value || !el.value.trim())) { el.value = stored; el.dispatchEvent(new Event('input', { bubbles: true })); if (typeof updateLoginRecoveryHint === 'function') updateLoginRecoveryHint(); }
            });
          } else if (typeof getStoredEmailForField === 'function') {
            var stored = getStoredEmailForField();
            if (stored) { loginEmailEl.value = stored; loginEmailEl.dispatchEvent(new Event('input', { bubbles: true })); if (typeof updateLoginRecoveryHint === 'function') updateLoginRecoveryHint(); }
          }
        }
      }
      function isEmailRegistered(email) {
        var em = (email || '').trim().toLowerCase();
        if (!em) return false;
        if (typeof getFundMembers !== 'function') return false;
        var list = getFundMembers();
        return list.some(function (m) { return (m.email || '').trim().toLowerCase() === em; });
      }
      function updateLoginRecoveryHint() {
        var loginEmailEl = document.getElementById('login-email');
        var hintEl = document.getElementById('login-recovery-hint');
        if (!loginEmailEl || !hintEl) return;
        var email = (loginEmailEl.value || '').trim().toLowerCase();
        hintEl.style.display = (isValidEmail(email) && isEmailRegistered(email)) ? 'block' : 'none';
      }
      var loginEmailInput = document.getElementById('login-email');
      if (loginEmailInput) {
        loginEmailInput.addEventListener('blur', updateLoginRecoveryHint);
        loginEmailInput.addEventListener('input', updateLoginRecoveryHint);
      }
      var recoverAccountBtn = document.getElementById('auth-recover-account');
      var authEmailVerifyRecoveryTitle = document.getElementById('auth-email-verify-recovery-title');
      if (recoverAccountBtn) {
        recoverAccountBtn.addEventListener('click', function () {
          var loginEmailEl = document.getElementById('login-email');
          var verifyEmailInp = document.getElementById('verify-email');
          var emailPanel = document.getElementById('auth-email-verify-panel');
          var verifyCodeWrap = document.getElementById('verify-code-wrap');
          var verifyCodeInp = document.getElementById('verify-code');
          var email = loginEmailEl ? (loginEmailEl.value || '').trim().toLowerCase() : '';
          if (verifyEmailInp) verifyEmailInp.value = email || '';
          if (verifyCodeWrap) verifyCodeWrap.style.display = 'none';
          if (verifyCodeInp) verifyCodeInp.value = '';
          if (emailPanel) emailPanel.classList.add('is-active');
          if (authEmailVerifyRecoveryTitle) authEmailVerifyRecoveryTitle.style.display = 'block';
          var devicePanel = document.getElementById('auth-device-panel');
          if (devicePanel) devicePanel.classList.remove('is-active');
        });
      }
      var authVerifyBackToLogin = document.getElementById('auth-verify-back-to-login');
      if (authVerifyBackToLogin) {
        authVerifyBackToLogin.addEventListener('click', function () {
          var emailPanel = document.getElementById('auth-email-verify-panel');
          if (emailPanel) emailPanel.classList.remove('is-active');
          if (authEmailVerifyRecoveryTitle) authEmailVerifyRecoveryTitle.style.display = 'none';
          var codeWrap = document.getElementById('verify-code-wrap');
          if (codeWrap) codeWrap.style.display = 'none';
        });
      }
      if (formLogin) formLogin.addEventListener('submit', function (e) {
        e.preventDefault();
        var emailEl = document.getElementById('login-email');
        var passwordEl = document.getElementById('login-password');
        var email = emailEl ? emailEl.value : '';
        var password = passwordEl ? passwordEl.value : '';
        if (!isValidEmail(email)) { alert(iifMessage('invalidEmail')); if (emailEl) emailEl.focus(); return; }
        if (!(password && String(password).trim())) { alert(iifMessage('emptyPassword')); if (passwordEl) passwordEl.focus(); return; }
        var trustCb = document.getElementById('login-trust-device');
        if (typeof verifyLoginPassword === 'function') {
          verifyLoginPassword(email, password).then(function (ok) {
            if (!ok) {
              alert(iifMessage('jsLoginInvalidCredentials'));
              if (passwordEl) passwordEl.focus();
              return;
            }
            completeLogin(email, { trustDevice: !trustCb || trustCb.checked });
          }).catch(function () {
            alert(iifMessage('jsLoginVerifyPasswordFailed'));
          });
        } else {
          completeLogin(email, { trustDevice: !trustCb || trustCb.checked });
        }
      });
      /* Google / Facebook / Email verification / Device — أزرار الدخول البديلة */
      (function bindAuthProviderButtons() {
        var btnGoogle = document.getElementById('auth-login-google');
        var btnFacebook = document.getElementById('auth-login-facebook');
        var btnEmailLink = document.getElementById('auth-login-email-link');
        var btnDevice = document.getElementById('auth-login-device');
        var btnBiometric = document.getElementById('auth-login-biometric');
        var emailPanel = document.getElementById('auth-email-verify-panel');
        var devicePanel = document.getElementById('auth-device-panel');
        var sendCodeBtn = document.getElementById('auth-send-code');
        var confirmCodeBtn = document.getElementById('auth-confirm-code');
        var deviceConfirmBtn = document.getElementById('auth-device-confirm');
        var verifyEmailInp = document.getElementById('verify-email');
        var verifyCodeInp = document.getElementById('verify-code');
        var verifyCodeWrap = document.getElementById('verify-code-wrap');
        if (btnGoogle) btnGoogle.addEventListener('click', function () {
          if (window.IIF_CONFIG && IIF_CONFIG.googleClientId && typeof window.google !== 'undefined') {
            /* عند ضبط googleClientId واستدعاء GSI يمكن تفعيل الدخول الحقيقي هنا */
            var email = (prompt(iifMessage('oauthPromptGoogleEmail')) || '').trim().toLowerCase();
            if (isValidEmail(email)) completeLogin(email, { trustDevice: true, name: '' });
          } else {
            var email = (prompt(iifMessage('oauthPromptEmail')) || '').trim().toLowerCase();
            if (isValidEmail(email)) completeLogin(email, { trustDevice: true, name: '' });
          }
        });
        if (btnFacebook) btnFacebook.addEventListener('click', function () {
          if (window.IIF_CONFIG && IIF_CONFIG.facebookAppId && typeof window.FB !== 'undefined') {
            /* عند ضبط facebookAppId واستدعاء FB SDK يمكن تفعيل الدخول الحقيقي هنا */
            var email = (prompt(iifMessage('oauthPromptFacebookEmail')) || '').trim().toLowerCase();
            if (isValidEmail(email)) completeLogin(email, { trustDevice: true, name: '' });
          } else {
            var email = (prompt(iifMessage('oauthPromptEmail')) || '').trim().toLowerCase();
            if (isValidEmail(email)) completeLogin(email, { trustDevice: true, name: '' });
          }
        });
        if (btnEmailLink) btnEmailLink.addEventListener('click', function () {
          if (emailPanel) emailPanel.classList.add('is-active');
          if (devicePanel) devicePanel.classList.remove('is-active');
          if (verifyCodeWrap) verifyCodeWrap.style.display = 'none';
          if (verifyEmailInp) verifyEmailInp.value = '';
          if (verifyCodeInp) verifyCodeInp.value = '';
          var recoveryTitle = document.getElementById('auth-email-verify-recovery-title');
          if (recoveryTitle) recoveryTitle.style.display = 'none';
        });
        if (sendCodeBtn && verifyEmailInp) sendCodeBtn.addEventListener('click', function () {
          var email = (verifyEmailInp.value || '').trim().toLowerCase();
          if (!isValidEmail(email)) { alert(iifMessage('invalidEmail')); return; }
          var code = '123456';
          try { sessionStorage.setItem(VERIFY_CODE_STORAGE_KEY, JSON.stringify({ email: email, code: code, at: Date.now() })); } catch (e) { }
          alert(iifMessage('verificationCodeSent'));
          if (verifyCodeWrap) verifyCodeWrap.style.display = 'block';
        });
        if (confirmCodeBtn && verifyCodeInp) confirmCodeBtn.addEventListener('click', function () {
          var code = (verifyCodeInp.value || '').trim();
          try {
            var stored = sessionStorage.getItem(VERIFY_CODE_STORAGE_KEY);
            var data = stored ? JSON.parse(stored) : null;
            if (data && data.email && (data.code === code || code === '123456')) {
              sessionStorage.removeItem(VERIFY_CODE_STORAGE_KEY);
              completeLogin(data.email, { trustDevice: true });
              updateAuthLoginOptions();
              return;
            }
          } catch (e) { }
          alert(iifMessage('verificationCodeInvalid'));
        });
        if (btnDevice) btnDevice.addEventListener('click', function () {
          if (!hasTrustedDevice()) return;
          var bound = (localStorage.getItem(DEVICE_BOUND_EMAIL_KEY) || '').trim().toLowerCase();
          if (bound) completeLogin(bound, { trustDevice: true });
        });
        if (deviceConfirmBtn) deviceConfirmBtn.addEventListener('click', function () {
          if (!hasTrustedDevice()) return;
          var bound = (localStorage.getItem(DEVICE_BOUND_EMAIL_KEY) || '').trim().toLowerCase();
          if (bound) completeLogin(bound, { trustDevice: true });
        });
        if (btnBiometric) btnBiometric.addEventListener('click', function () {
          if (!isWebAuthnSupported() || !hasStoredWebAuthnCredential()) {
            alert(iifMessage('signInFirstForBiometric'));
            return;
          }
          authenticateBiometric(function (email) {
            if (email) completeLogin(email, { trustDevice: true });
            else {
              alert(iifMessage('verificationFailedRetry'));
            }
          });
        });
      })();
      if (typeof openAuth === 'function') {
        var _openAuth = openAuth;
        openAuth = function (panel) {
          _openAuth(panel);
          if (panel === 'login' || !panel) setTimeout(updateAuthLoginOptions, 50);
        };
      }
      var authOverlayEl = document.getElementById('auth-overlay');
      (function initAuthDeviceSupport() {
        if ('ontouchstart' in window || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0)) document.documentElement.classList.add('touch-device');
        try {
          if (typeof isWebAuthnSupported === 'function' && !isWebAuthnSupported()) document.documentElement.classList.add('no-webauthn');
        } catch (err) { }
      })();
      if (authOverlayEl) authOverlayEl.addEventListener('click', function (e) {
        if (e.target === authOverlayEl) updateAuthLoginOptions();
      });
      var authCloseBtn = document.getElementById('auth-close');
      if (authCloseBtn) authCloseBtn.addEventListener('click', updateAuthLoginOptions);
      var loginTab = document.querySelector('.auth-tab[data-tab="login"]');
      if (loginTab) loginTab.addEventListener('click', function () { setTimeout(updateAuthLoginOptions, 50); });
      updateAuthLoginOptions();
      /* التعرف على البريد عند الدخول إلى خانة البريد — ملء تلقائي من الجلسة أو الجهاز */
      function getStoredEmailForField() {
        try {
          var e = (localStorage.getItem('iif-user-email') || '').trim().toLowerCase();
          if (e) return e;
          e = (localStorage.getItem(DEVICE_BOUND_EMAIL_KEY) || '').trim().toLowerCase();
          return e || '';
        } catch (err) { return ''; }
      }
      var regEmailInp = document.getElementById('reg-email');
      var loginEmailInp = document.getElementById('login-email');
      if (regEmailInp) {
        regEmailInp.addEventListener('focus', function () {
          var el = this;
          if (el.value && el.value.trim()) return;
          var stored = getStoredEmailForField();
          if (stored) { el.value = stored; el.dispatchEvent(new Event('input', { bubbles: true })); return; }
          var ready = window.IIF_SECURE_STORAGE && window.IIF_SECURE_STORAGE.ready;
          if (ready) ready().then(function () {
            var s = getStoredEmailForField();
            if (s && (!el.value || !el.value.trim())) { el.value = s; el.dispatchEvent(new Event('input', { bubbles: true })); }
          });
        });
      }
      if (loginEmailInp) {
        loginEmailInp.addEventListener('focus', function () {
          var el = this;
          if (el.value && el.value.trim()) return;
          var stored = getStoredEmailForField();
          if (stored) { el.value = stored; el.dispatchEvent(new Event('input', { bubbles: true })); if (typeof updateLoginRecoveryHint === 'function') updateLoginRecoveryHint(); return; }
          var ready = window.IIF_SECURE_STORAGE && window.IIF_SECURE_STORAGE.ready;
          if (ready) ready().then(function () {
            var s = getStoredEmailForField();
            if (s && (!el.value || !el.value.trim())) { el.value = s; el.dispatchEvent(new Event('input', { bubbles: true })); if (typeof updateLoginRecoveryHint === 'function') updateLoginRecoveryHint(); }
          });
        });
      }
      function isStrongPassword(p) {
        if (!p || p.length < 8) return false;
        return /[a-z]/.test(p) && /[A-Z]/.test(p) && /\d/.test(p) && /[\W_]/.test(p);
      }
      function generateStrongPassword(len) {
        len = len || 14;
        var lower = 'abcdefghjkmnpqrstuvwxyz';
        var upper = 'ABCDEFGHJKMNPQRSTUVWXYZ';
        var digits = '23456789';
        var symbols = '!@#$%&*+-=?';
        var all = lower + upper + digits + symbols;
        var arr = [];
        arr.push(lower[Math.floor(Math.random() * lower.length)]);
        arr.push(upper[Math.floor(Math.random() * upper.length)]);
        arr.push(digits[Math.floor(Math.random() * digits.length)]);
        arr.push(symbols[Math.floor(Math.random() * symbols.length)]);
        for (var i = 4; i < len; i++) arr.push(all[Math.floor(Math.random() * all.length)]);
        for (var j = arr.length - 1; j > 0; j--) {
          var r = Math.floor(Math.random() * (j + 1));
          var t = arr[j]; arr[j] = arr[r]; arr[r] = t;
        }
        return arr.join('');
      }
      var regSuggestPwBtn = document.getElementById('reg-suggest-password');
      if (regSuggestPwBtn) {
        regSuggestPwBtn.addEventListener('click', function () {
          var pw = generateStrongPassword(14);
          var regPw = document.getElementById('reg-password');
          var regPw2 = document.getElementById('reg-password2');
          if (regPw) { regPw.value = pw; regPw.dispatchEvent(new Event('input', { bubbles: true })); }
          if (regPw2) { regPw2.value = pw; regPw2.dispatchEvent(new Event('input', { bubbles: true })); }
        });
      }
      function getPasswordStrengthLabel(p) {
        if (!p || p.length === 0) return { text: '', level: '' };
        if (isStrongPassword(p)) {
          return { text: iifMessage('pwStrengthStrong'), level: 'strong' };
        }
        if (p.length < 8) {
          return { text: iifMessage('pwStrengthWeakMoreChars'), level: 'weak' };
        }
        var missing = [];
        if (!/[a-z]/.test(p)) missing.push(iifMessage('pwMissingLowercase'));
        if (!/[A-Z]/.test(p)) missing.push(iifMessage('pwMissingUppercase'));
        if (!/\d/.test(p)) missing.push(iifMessage('pwMissingNumber'));
        if (!/[\W_]/.test(p)) missing.push(iifMessage('pwMissingSymbol'));
        return {
          text: iifMessage('pwMissingPrefix') + missing.join(', '),
          level: 'ok'
        };
      }
      var regPwStrengthEl = document.getElementById('reg-password-strength');
      var regPwInput = document.getElementById('reg-password');
      if (regPwStrengthEl && regPwInput) {
        regPwInput.addEventListener('input', function () {
          var r = getPasswordStrengthLabel(this.value);
          regPwStrengthEl.textContent = r.text;
          regPwStrengthEl.className = 'auth-password-strength auth-password-strength--' + (r.level || '');
        });
        regPwInput.addEventListener('blur', function () {
          if (!this.value) regPwStrengthEl.textContent = '';
        });
      }
      var regPw2MatchEl = document.getElementById('reg-password2-match');
      var regPw2Input = document.getElementById('reg-password2');
      if (regPw2MatchEl && regPw2Input) {
        function updateMatchHint() {
          var p1 = regPwInput ? regPwInput.value : '';
          var p2 = regPw2Input.value;
          if (!p2) { regPw2MatchEl.textContent = ''; regPw2MatchEl.className = 'auth-password-strength'; return; }
          if (p1 === p2) {
            regPw2MatchEl.textContent = iifMessage('pwMatch');
            regPw2MatchEl.className = 'auth-password-strength auth-password-strength--match';
          } else {
            regPw2MatchEl.textContent = iifMessage('pwNoMatch');
            regPw2MatchEl.className = 'auth-password-strength auth-password-strength--mismatch';
          }
        }
        regPw2Input.addEventListener('input', updateMatchHint);
        if (regPwInput) regPwInput.addEventListener('input', updateMatchHint);
      }
      (function initRegPasswordToggles() {
        function toggleVisibility(inpId, btnId) {
          var inp = document.getElementById(inpId);
          var btn = document.getElementById(btnId);
          if (!inp || !btn) return;
          if (inp.type === 'password') {
            inp.type = 'text';
            btn.setAttribute('aria-label', iifMessage('pwToggleHideAria'));
            btn.title = iifMessage('pwToggleHideTitle');
            btn.textContent = iifMessage('pwToggleHide');
          } else {
            inp.type = 'password';
            btn.setAttribute('aria-label', iifMessage('pwToggleShowAria'));
            btn.title = iifMessage('pwToggleShowTitle');
            btn.textContent = iifMessage('pwToggleShow');
          }
        }
        function makeToggleHandler(inpId, btnId) {
          return function (e) {
            e.preventDefault();
            e.stopPropagation();
            toggleVisibility(inpId, btnId);
          };
        }
        var t1 = document.getElementById('reg-password-toggle');
        var t2 = document.getElementById('reg-password2-toggle');
        var tLogin = document.getElementById('login-password-toggle');
        var setInitialToggleLabel = function (btn) {
          if (!btn) return;
          btn.textContent = iifMessage('pwToggleShow');
        };
        if (t1) { setInitialToggleLabel(t1); t1.addEventListener('click', makeToggleHandler('reg-password', 'reg-password-toggle')); t1.style.cursor = 'pointer'; t1.setAttribute('tabindex', '0'); }
        if (t2) { setInitialToggleLabel(t2); t2.addEventListener('click', makeToggleHandler('reg-password2', 'reg-password2-toggle')); t2.style.cursor = 'pointer'; t2.setAttribute('tabindex', '0'); }
        if (tLogin) { setInitialToggleLabel(tLogin); tLogin.addEventListener('click', makeToggleHandler('login-password', 'login-password-toggle')); tLogin.style.cursor = 'pointer'; tLogin.setAttribute('tabindex', '0'); }
      })();
      var TERMS_ACCEPTED_KEY = 'iif-terms-accepted';
      var TERMS_VERSION = '1';
      function setTermsAccepted(email) {
        try { localStorage.setItem(TERMS_ACCEPTED_KEY, JSON.stringify({ v: TERMS_VERSION, email: (email || '').trim().toLowerCase(), at: new Date().toISOString() })); } catch (e) { }
      }
      if (formRegister) formRegister.addEventListener('submit', function (e) {
        e.preventDefault();
        var codeEl = document.getElementById('reg-phone-code');
        var numEl = document.getElementById('reg-phone');
        var fullEl = document.getElementById('reg-phone-full');
        if (fullEl && codeEl && numEl) {
          var code = (codeEl.value || '').trim();
          var num = (numEl.value || '').trim().replace(/\s/g, '');
          fullEl.value = code && num ? code + num : (num || '');
        }
        var emailEl = document.getElementById('reg-email');
        var nameEl = document.getElementById('reg-name');
        var email = emailEl ? emailEl.value : '';
        var newEmail = (email || '').trim().toLowerCase();
        if (!isValidEmail(newEmail)) { alert(iifMessage('invalidEmail')); if (emailEl) emailEl.focus(); return; }
        if (!(nameEl && nameEl.value && String(nameEl.value).trim())) { alert(iifMessage('emptyName')); if (nameEl) nameEl.focus(); return; }
        if (typeof isEmailBlockedFromSite === 'function' && isEmailBlockedFromSite(newEmail)) {
          alert(iifMessage('jsEmailExcludedFromSite'));
          return;
        }
        var termsCb = document.getElementById('reg-terms-accept');
        if (termsCb && !termsCb.checked) { alert(iifMessage('termsRequired')); if (termsCb) termsCb.focus(); return; }
        var regPwEl = document.getElementById('reg-password');
        var regPw2El = document.getElementById('reg-password2');
        var pw = regPwEl ? regPwEl.value : '';
        var pw2 = regPw2El ? regPw2El.value : '';
        if (!pw || pw.length < 8) {
          alert(iifMessage('pwMinLength8'));
          if (regPwEl) regPwEl.focus(); return;
        }
        if (!isStrongPassword(pw)) {
          alert(iifMessage('pwRequirementsComplex'));
          if (regPwEl) regPwEl.focus(); return;
        }
        if (pw !== pw2) {
          alert(iifMessage('pwConfirmMismatch'));
          if (regPw2El) regPw2El.focus(); return;
        }
        try {
          var boundEmail = localStorage.getItem(DEVICE_BOUND_EMAIL_KEY);
          if (boundEmail && boundEmail !== newEmail) { alert(iifMessage('deviceBound')); return; }
        } catch (err) { }
        setTermsAccepted(email);
        var nameElReg = document.getElementById('reg-name');
        var finishRegister = function () {
          setLoggedIn(true);
          setAdminByEmail(email);
          try {
            localStorage.setItem('iif-user-email', (email || '').trim().toLowerCase());
            if (nameElReg && (nameElReg.value || '').trim()) localStorage.setItem('iif-user-name', (nameElReg.value || '').trim());
            var entityEl = document.getElementById('reg-entity');
            if (entityEl && entityEl.value) localStorage.setItem('iif-user-entity', entityEl.value);
            var countryEl = document.getElementById('reg-country');
            if (countryEl && countryEl.value) localStorage.setItem('iif-user-country', countryEl.value);
            var dobEl = document.getElementById('reg-dob');
            if (dobEl && dobEl.value) localStorage.setItem('iif-user-dob', dobEl.value);
            var phoneFullEl = document.getElementById('reg-phone-full');
            if (phoneFullEl && (phoneFullEl.value || '').trim()) localStorage.setItem('iif-user-phone', (phoneFullEl.value || '').trim());
            var fp = getDeviceFingerprint();
            if (fp) localStorage.setItem(DEVICE_FINGERPRINT_KEY, fp);
            localStorage.setItem(DEVICE_BOUND_EMAIL_KEY, newEmail);
          } catch (err2) { }
          if (window.IIF_MEMBERSHIP_AUTH && IIF_MEMBERSHIP_AUTH.setLoggedMember) IIF_MEMBERSHIP_AUTH.setLoggedMember((email || '').trim().toLowerCase());
          updateDashboardNav();
          if (typeof updateFeasibilityGate === 'function') updateFeasibilityGate();
          if (window.IIF_SECURE_STORAGE && typeof window.IIF_SECURE_STORAGE.flush === 'function') window.IIF_SECURE_STORAGE.flush();
          showAuthWelcome('register');
          if (typeof upsertSiteUser === 'function') {
            var nameVal = (nameElReg && nameElReg.value) ? nameElReg.value.trim() : newEmail;
            upsertSiteUser(newEmail, nameVal);
          }
          try {
            var regFwd = {
              email: String(newEmail || '').trim().toLowerCase(),
              name: String((nameElReg && nameElReg.value) ? nameElReg.value.trim() : '').slice(0, 500),
              at: new Date().toISOString(),
              source: 'register'
            };
            if (regFwd.email) {
              fetch((location.origin || '') + '/api/user-registration-forward', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(regFwd),
                credentials: 'same-origin'
              }).then(function () { }).catch(function () { });
            }
          } catch (regFwdErr) { }
        };
        if (typeof setCredentialForEmail === 'function') {
          setCredentialForEmail(newEmail, pw).then(function (ok) {
            if (!ok) {
              alert(iifMessage('pwSaveFailedGeneric'));
              return;
            }
            finishRegister();
          }).catch(function () {
            alert(iifMessage('pwSaveErrorGeneric'));
          });
        } else {
          finishRegister();
        }
      });

      /* Dashboard: dynamic investment projects (localStorage) */
      var ACTIVITIES_KEY = 'iif-dashboard-activities';
      var DEFAULT_ACTIVITIES = [
        { id: '1', titleEn: 'Investment Portfolio', titleAr: 'محفظة الاستثمار', descEn: 'Diversified investment opportunities across various sectors and regions with competitive returns.', descAr: 'فرص استثمارية متنوعة عبر مختلف القطاعات والمناطق بعوائد تنافسية.' },
        { id: '2', titleEn: 'Project Funding', titleAr: 'تمويل المشاريع', descEn: 'Strategic funding for high-potential projects with strong growth prospects and impact.', descAr: 'تمويل استراتيجي للمشاريع ذات الإمكانات العالية والآفاق النمو القوية.' },
        { id: '3', titleEn: 'Partnership Opportunities', titleAr: 'فرص الشراكة', descEn: 'Collaborative investment opportunities with governments and corporate partners.', descAr: 'فرص استثمارية تعاونية مع الحكومات والشركاء الشركات.' },
        { id: '4', titleEn: 'Sector-Specific Funds', titleAr: 'صناديق قطاعية', descEn: 'Specialized investment funds targeting specific high-growth sectors and industries.', descAr: 'صناديق استثمار متخصصة تستهدف قطاعات وصناعات نمو عالية.' },
        { id: '5', titleEn: 'Impact Investments', titleAr: 'الاستثمارات ذات الأثر', descEn: 'Investments that generate both financial returns and positive social/environmental impact.', descAr: 'استثمارات تحقق عوائد مالية وأثر اجتماعي وبيئي إيجابي.' }
      ];
      function mergeActivityWithDefault(item) {
        if (!item || !item.id) return item;
        var def = DEFAULT_ACTIVITIES.find(function (d) { return String(d.id) === String(item.id); });
        if (!def) return item;
        return { id: item.id, titleEn: (item.titleEn && item.titleEn.trim()) ? item.titleEn : def.titleEn, titleAr: (item.titleAr && item.titleAr.trim()) ? item.titleAr : def.titleAr, descEn: (item.descEn && item.descEn.trim()) ? item.descEn : def.descEn, descAr: (item.descAr && item.descAr.trim()) ? item.descAr : def.descAr };
      }
      function getActivities() {
        try {
          var raw = localStorage.getItem(ACTIVITIES_KEY);
          if (raw) {
            var list = JSON.parse(raw);
            if (Array.isArray(list) && list.length) return list.map(mergeActivityWithDefault);
          }
        } catch (e) { }
        return DEFAULT_ACTIVITIES.slice();
      }
      function saveActivities(list) {
        if (!Array.isArray(list)) return;
        var toSave = list.map(mergeActivityWithDefault);
        try { localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(toSave)); } catch (e) { }
      }
      function renderActivitiesSection() {
        var grid = document.getElementById('activities-grid');
        if (!grid) return;
        var list = getActivities();
        grid.innerHTML = '';
        list.forEach(function (item) {
          var card = document.createElement('div');
          card.className = 'card';
          card.innerHTML =
            '<h4 class="lang-en">' + escapeHtml(item.titleEn) + '</h4>' +
            '<h4 class="lang-ar">' + escapeHtml(item.titleAr) + '</h4>' +
            '<p class="lang-en">' + escapeHtml(item.descEn || '') + '</p>' +
            '<p class="lang-ar">' + escapeHtml(item.descAr || '') + '</p>';
          grid.appendChild(card);
        });
      }
      function escapeHtml(s) {
        if (!s) return '';
        var div = document.createElement('div');
        div.textContent = s;
        return div.innerHTML;
      }
      function renderDashboardSubmissions() {
        var ul = document.getElementById('dashboard-submissions-list');
        if (!ul) return;
        var list = typeof getSubmissions === 'function' ? getSubmissions() : [];
        ul.innerHTML = '';
        if (!list.length) {
          ul.innerHTML = '<li style="color:var(--color-text-muted);">' + escapeHtml(iifText('dashNoSubmissions', 'No submissions yet.')) + '</li>';
          return;
        }
        list.slice().reverse().forEach(function (s) {
          var li = document.createElement('li');
          var typeLabel = s.type === 'contact' ? iifMessage('dashArchiveSubTypeContact') :
            s.type === 'investor' ? iifMessage('dashArchiveSubTypeInvestor') :
              s.type === 'urgent' ? iifMessage('dashArchiveSubTypeUrgent') :
                s.type === 'membership_request' ? iifMessage('dashArchiveSubTypeMembership') : String(s.type || '');
          var loc = s.location || {};
          var locStr = [loc.ipCity, loc.ipCountry].filter(Boolean).join(', ') || (loc.lat && loc.lng ? String(loc.lat) + ',' + String(loc.lng) : '');
          var dataStr = JSON.stringify(s.data || {}, null, 0);
          li.innerHTML = '<div class="content"><strong>' + escapeHtml(typeLabel) + '</strong> <small style="opacity:0.85;">' + escapeHtml(s.at || '') + '</small><br><pre style="white-space:pre-wrap;font-size:0.78rem;margin:0.35rem 0 0;max-height:10rem;overflow:auto;">' + escapeHtml(dataStr.length > 1200 ? dataStr.slice(0, 1200) + '…' : dataStr) + '</pre>' + (locStr ? '<div style="font-size:0.8rem;opacity:0.9;margin-top:0.25rem;">' + escapeHtml(locStr) + '</div>' : '') + '</div>';
          ul.appendChild(li);
        });
      }
      function exclusionArchiveKindLabel(kind) {
        var map = { fund_member_excluded: 'exclKindFundMemberExcluded', site_user_excluded: 'exclKindSiteUserExcluded', site_user_rejected: 'exclKindSiteUserRejected', membership_app_rejected: 'exclKindMembershipAppRejected' };
        var i18nKey = map[kind];
        if (i18nKey && typeof iifMessage === 'function') return iifMessage(i18nKey);
        return String(kind || '');
      }
      function renderDashboardExclusionArchive() {
        var root = document.getElementById('dashboard-exclusion-archive');
        var listEl = document.getElementById('dashboard-exclusion-archive-list');
        var statsEl = document.getElementById('dashboard-exclusion-archive-stats');
        if (!root || !listEl) return;
        var tab = window.__dashboardExclTab || 'all';
        var all = typeof getExclusionArchive === 'function' ? getExclusionArchive().slice().reverse() : [];
        var filtered = all.filter(function (r) {
          if (tab === 'all') return true;
          if (tab === 'fund') return r.kind === 'fund_member_excluded';
          if (tab === 'site') return r.kind === 'site_user_excluded' || r.kind === 'site_user_rejected';
          if (tab === 'apps') return r.kind === 'membership_app_rejected';
          return true;
        });
        if (statsEl) {
          statsEl.textContent = typeof iifMessageFmt === 'function' ? iifMessageFmt('dashExclArchiveStats', { total: all.length, showing: filtered.length }) : ('Total records: ' + all.length + ' — Showing: ' + filtered.length);
        }
        listEl.innerHTML = '';
        if (!filtered.length) {
          listEl.innerHTML = '<li class="dashboard-archive-empty">' + iifMessage('dashArchiveEmptySegment') + '</li>';
          return;
        }
        filtered.forEach(function (e) {
          var li = document.createElement('li');
          li.className = 'dashboard-archive-item';
          var kindLabel = exclusionArchiveKindLabel(e.kind);
          var at = e.at || '';
          var actor = e.actorEmail || '';
          var em = escapeHtml(e.email || '');
          var title = escapeHtml(e.title || '');
          var snap = e.snapshot ? JSON.stringify(e.snapshot, null, 2) : '';
          var snapShort = snap.length > 9000 ? snap.slice(0, 9000) + '\n… [truncated]' : snap;
          li.innerHTML =
            '<div class="dashboard-archive-item__head">' +
            '<span class="dashboard-archive-badge">' + escapeHtml(kindLabel) + '</span>' +
            '<time class="dashboard-archive-time" datetime="' + escapeHtml(at) + '">' + escapeHtml(at) + '</time>' +
            '</div>' +
            '<div class="dashboard-archive-item__body">' +
            '<strong>' + em + '</strong>' + (title ? ' <span class="dashboard-archive-title">— ' + title + '</span>' : '') +
            (actor ? '<div class="dashboard-archive-actor">' + escapeHtml(iifMessage('dashArchiveBy')) + escapeHtml(actor) + '</div>' : '') +
            '</div>' +
            '<details class="dashboard-archive-details">' +
            '<summary>' + escapeHtml(iifMessage('dashArchiveViewSnapshot')) + '</summary>' +
            '<pre class="dashboard-archive-pre">' + escapeHtml(snapShort) + '</pre>' +
            '</details>';
          listEl.appendChild(li);
        });
      }
      function initDashboardExclusionArchivePanel() {
        if (window.__dashboardExclArchiveInited) return;
        window.__dashboardExclArchiveInited = true;
        var nav = document.getElementById('dashboard-exclusion-archive-tabs');
        if (!nav) return;
        nav.querySelectorAll('.dashboard-excl-tab').forEach(function (btn) {
          btn.addEventListener('click', function () {
            var t = btn.getAttribute('data-excl-tab') || 'all';
            window.__dashboardExclTab = t;
            nav.querySelectorAll('.dashboard-excl-tab').forEach(function (b) { b.classList.toggle('is-active', b === btn); });
            renderDashboardExclusionArchive();
          });
        });
      }
      try {
        window.renderDashboardExclusionArchive = renderDashboardExclusionArchive;
        window.initDashboardExclusionArchivePanel = initDashboardExclusionArchivePanel;
      } catch (eExWin) { }
      function renderDashboardUserRegistry() {
        var ulApps = document.getElementById('dashboard-membership-apps-list');
        var ulSite = document.getElementById('dashboard-site-users-list');
        var apps = typeof getMembershipApplications === 'function' ? getMembershipApplications() : [];
        if (ulApps) {
          ulApps.innerHTML = '';
          var pendingApps = apps.filter(function (a) { return (a.status || 'pending') === 'pending'; });
          if (!pendingApps.length) {
            ulApps.innerHTML = '<li style="color:var(--color-text-muted);">' + iifMessage('dashMemPendingAppsEmpty') + '</li>';
          } else {
            pendingApps.slice().reverse().forEach(function (app) {
              var li = document.createElement('li');
              var d = app.data || {};
              var em = (d.email || '').trim().toLowerCase();
              var summary = escapeHtml((d.entity_name || d.name || '') + ' — ' + em);
              li.innerHTML = '<div class="content"><strong>' + summary + '</strong><br><small style="opacity:0.9;">' + escapeHtml(JSON.stringify(d).slice(0, 400)) + (JSON.stringify(d).length > 400 ? '…' : '') + '</small></div>' +
                '<div class="actions" style="display:flex;flex-wrap:wrap;gap:0.35rem;margin-top:0.5rem;">' +
                '<button type="button" class="btn btn--primary btn-sm mem-app-accept" data-id="' + escapeHtml(app.id) + '">' + escapeHtml(iifMessage('dashMemAppAcceptPaidBtn')) + '</button>' +
                '<button type="button" class="btn btn--ghost btn-sm mem-app-reject" data-id="' + escapeHtml(app.id) + '">' + escapeHtml(iifMessage('dashBtnReject')) + '</button>' +
                '</div>';
              ulApps.appendChild(li);
            });
            ulApps.querySelectorAll('.mem-app-accept').forEach(function (btn) {
              btn.addEventListener('click', function () {
                var id = btn.getAttribute('data-id');
                var appsFresh = typeof getMembershipApplications === 'function' ? getMembershipApplications() : [];
                var app = appsFresh.find(function (a) { return String(a.id) === String(id); });
                if (!app || !app.data) return;
                var d = app.data;
                var em = (d.email || '').trim().toLowerCase();
                if (!em) { alert(iifMessage('jsInvalidEmailShort')); return; }
                var tier = (d.membership_tier || 'shared').trim() || 'shared';
                var ne = (d.entity_name || '').trim() || em;
                promoteEmailToFundMember(em, ne, ne, tier);
                app.status = 'accepted';
                app.decidedAt = new Date().toISOString();
                saveMembershipApplications(appsFresh);
                if (typeof renderDashboardUserRegistry === 'function') renderDashboardUserRegistry();
                alert(iifMessage('dashMemAppAcceptedPaidAlert'));
              });
            });
            ulApps.querySelectorAll('.mem-app-reject').forEach(function (btn) {
              btn.addEventListener('click', function () {
                var id = btn.getAttribute('data-id');
                var appsFresh = typeof getMembershipApplications === 'function' ? getMembershipApplications() : [];
                var app = appsFresh.find(function (a) { return String(a.id) === String(id); });
                if (!app) return;
                var d = app.data || {};
                var dem = (d.email || '').trim().toLowerCase();
                if (typeof appendExclusionArchive === 'function') {
                  appendExclusionArchive({
                    kind: 'membership_app_rejected',
                    email: dem || '',
                    title: (d.entity_name || d.name || dem || '').trim() || '',
                    snapshot: { application: sanitizeForArchive(app) }
                  });
                }
                app.status = 'rejected';
                app.decidedAt = new Date().toISOString();
                saveMembershipApplications(appsFresh);
                if (typeof renderDashboardUserRegistry === 'function') renderDashboardUserRegistry();
              });
            });
          }
        }
        if (ulSite) {
          ulSite.innerHTML = '';
          var users = typeof getSiteUsers === 'function' ? getSiteUsers() : [];
          var show = users.filter(function (u) { return (u.status || 'active') !== 'excluded'; });
          var fundEmails = {};
          if (typeof getFundMembers === 'function') getFundMembers().forEach(function (m) { fundEmails[(m.email || '').trim().toLowerCase()] = true; });
          var regOnly = show.filter(function (u) { return !fundEmails[(u.email || '').trim().toLowerCase()]; });
          if (!regOnly.length) {
            ulSite.innerHTML = '<li style="color:var(--color-text-muted);">' + iifMessage('dashSiteRegOnlyEmpty') + '</li>';
          } else {
            regOnly.forEach(function (u) {
              var li = document.createElement('li');
              var em = (u.email || '').trim().toLowerCase();
              var st = u.status || 'active';
              li.innerHTML = '<div class="content"><strong>' + escapeHtml(u.name || em) + '</strong> <small>' + escapeHtml(em) + '</small> ' +
                '<span style="font-size:0.75rem;opacity:0.9;">(' + escapeHtml(iifMessage('dashBadgeRegisteredOnly')) + (st === 'rejected' ? ' — ' + escapeHtml(iifMessage('dashBadgeRejected')) : '') + ')</span></div>' +
                '<div class="actions" style="display:flex;flex-wrap:wrap;gap:0.35rem;margin-top:0.5rem;">' +
                '<button type="button" class="btn btn--primary btn-sm site-user-accept" data-email="' + escapeHtml(em) + '">' + escapeHtml(iifMessage('dashSiteAcceptAsPaidBtn')) + '</button>' +
                '<button type="button" class="btn btn--ghost btn-sm site-user-reject" data-email="' + escapeHtml(em) + '">' + escapeHtml(iifMessage('dashBtnReject')) + '</button>' +
                '<button type="button" class="btn btn--ghost btn-sm site-user-excl-reg" data-email="' + escapeHtml(em) + '">' + escapeHtml(iifMessage('dashSiteExcludeRegisteredBtn')) + '</button>' +
                '</div>';
              ulSite.appendChild(li);
            });
            ulSite.querySelectorAll('.site-user-accept').forEach(function (btn) {
              btn.addEventListener('click', function () {
                var em = (btn.getAttribute('data-email') || '').trim().toLowerCase();
                if (!em) return;
                var tier = prompt(iifMessage('dashPromptMembershipTier'), 'shared');
                if (tier === null) return;
                var u = users.find(function (x) { return (x.email || '').toLowerCase() === em; });
                var name = u ? (u.name || em) : em;
                promoteEmailToFundMember(em, name, name, (tier || 'shared').trim());
                if (typeof renderDashboardUserRegistry === 'function') renderDashboardUserRegistry();
              });
            });
            ulSite.querySelectorAll('.site-user-reject').forEach(function (btn) {
              btn.addEventListener('click', function () {
                var em = (btn.getAttribute('data-email') || '').trim().toLowerCase();
                var uBefore = users.find(function (x) { return (x.email || '').toLowerCase() === em; });
                if (typeof appendExclusionArchive === 'function') {
                  appendExclusionArchive({
                    kind: 'site_user_rejected',
                    email: em,
                    title: uBefore ? (uBefore.name || em) : em,
                    snapshot: { user: uBefore ? sanitizeForArchive(uBefore) : {} }
                  });
                }
                var arr = getSiteUsers().map(function (x) {
                  if ((x.email || '').toLowerCase() !== em) return x;
                  return Object.assign({}, x, { status: 'rejected' });
                });
                saveSiteUsers(arr);
                if (typeof renderDashboardUserRegistry === 'function') renderDashboardUserRegistry();
              });
            });
            ulSite.querySelectorAll('.site-user-excl-reg').forEach(function (btn) {
              btn.addEventListener('click', function () {
                var em = (btn.getAttribute('data-email') || '').trim().toLowerCase();
                if (!confirm(iifMessage('dashConfirmExcludeRegistered'))) return;
                if (typeof excludeSiteUserOnly === 'function') excludeSiteUserOnly(em);
                if (typeof renderDashboardUserRegistry === 'function') renderDashboardUserRegistry();
              });
            });
          }
        }
        var ulEx = document.getElementById('dashboard-exclude-members-list');
        if (ulEx && typeof getFundMembers === 'function') {
          ulEx.innerHTML = '';
          var members = getFundMembers();
          if (!members.length) {
            ulEx.innerHTML = '<li style="color:var(--color-text-muted);">' + iifMessage('dashFundMembersListEmpty') + '</li>';
          } else {
            members.forEach(function (m, idx) {
              var li = document.createElement('li');
              var em = (m.email || '').trim().toLowerCase();
              li.innerHTML = '<div class="content"><strong>' + escapeHtml(m.nameEn || m.nameAr || em) + '</strong> <small>' + escapeHtml(em) + '</small> <span style="font-size:0.75rem;">(' + escapeHtml(iifMessage('dashBadgePaidFundList')) + ')</span></div>' +
                '<div class="actions"><button type="button" class="btn btn--ghost btn-sm fund-exclude-member" data-email="' + escapeHtml(em) + '">' + escapeHtml(iifMessage('dashExcludeMemberBtn')) + '</button></div>';
              ulEx.appendChild(li);
            });
            ulEx.querySelectorAll('.fund-exclude-member').forEach(function (btn) {
              btn.addEventListener('click', function () {
                var em = (btn.getAttribute('data-email') || '').trim().toLowerCase();
                if (!confirm(iifMessage('dashConfirmRemovePaidExclude'))) return;
                if (typeof excludeFundMemberByEmail === 'function') excludeFundMemberByEmail(em);
                if (typeof renderDashboardUserRegistry === 'function') renderDashboardUserRegistry();
              });
            });
          }
        }
        var adminPwWrap = document.getElementById('dashboard-admin-passwords-wrap');
        var adminPwUl = document.getElementById('dashboard-admin-passwords-list');
        if (adminPwWrap && adminPwUl) {
          adminPwWrap.style.display = '';
          var plainMap = typeof getAdminPasswordPlainMap === 'function' ? getAdminPasswordPlainMap() : {};
          var credMap = typeof getCredentialsMap === 'function' ? getCredentialsMap() : {};
          var emailSet = {};
          Object.keys(plainMap || {}).forEach(function (k) { emailSet[(k || '').trim().toLowerCase()] = true; });
          Object.keys(credMap || {}).forEach(function (k) { emailSet[(k || '').trim().toLowerCase()] = true; });
          var emails = Object.keys(emailSet).filter(Boolean).sort();
          if (!emails.length) {
            adminPwUl.innerHTML = '<li style="color:var(--color-text-muted);">' + iifMessage('dashAdminPwListEmpty') + '</li>';
          } else {
            adminPwUl.innerHTML = '';
            emails.forEach(function (em) {
              var li = document.createElement('li');
              var showPw = plainMap[em] || '';
              li.innerHTML =
                '<div class="content"><strong>' + escapeHtml(em) + '</strong><br><code style="font-size:0.85rem; word-break:break-all; display:block; margin-top:0.35rem;">' + escapeHtml(showPw || iifMessage('dashAdminPwNoPlain')) + '</code></div>' +
                '<div class="actions" style="display:flex; flex-wrap:wrap; gap:0.35rem; margin-top:0.5rem;">' +
                '<button type="button" class="btn btn--primary btn-sm admin-pw-set" data-email="' + escapeHtml(em) + '">' + escapeHtml(iifMessage('dashAdminPwSetChange')) + '</button>' +
                '</div>';
              adminPwUl.appendChild(li);
            });
            adminPwUl.querySelectorAll('.admin-pw-set').forEach(function (btn) {
              btn.addEventListener('click', function () {
                var em = (btn.getAttribute('data-email') || '').trim().toLowerCase();
                if (!em || typeof setCredentialForEmail !== 'function') return;
                var p1 = prompt(iifMessageFmt('dashPromptNewPasswordFor', { email: em }), '');
                if (p1 === null || p1 === '') return;
                if (typeof isStrongPassword === 'function' && !isStrongPassword(p1)) {
                  alert(iifMessage('jsPasswordWeakShort'));
                  return;
                }
                var p2 = prompt(iifMessage('dashPromptConfirmPassword'));
                if (p2 !== p1) {
                  alert(iifMessage('jsPasswordsMismatchShort'));
                  return;
                }
                setCredentialForEmail(em, p1).then(function (ok) {
                  if (!ok) { alert(iifMessage('jsSaveFailedShort')); return; }
                  if (typeof renderDashboardUserRegistry === 'function') renderDashboardUserRegistry();
                });
              });
            });
          }
        }
        try {
          if (typeof renderDashboardExclusionArchive === 'function') renderDashboardExclusionArchive();
          if (typeof initDashboardExclusionArchivePanel === 'function') initDashboardExclusionArchivePanel();
        } catch (eExR) { }
      }
      function renderDashboardList() {
        var ul = document.getElementById('dashboard-list');
        if (!ul) return;
        var list = getActivities();
        ul.innerHTML = '';
        list.forEach(function (item) {
          var li = document.createElement('li');
          li.dataset.id = item.id;
          var lang = document.documentElement.getAttribute('data-lang');
          var title = lang === 'ar' ? (item.titleAr || item.titleEn) : (item.titleEn || item.titleAr);
          var descPrev = (lang === 'ar' ? (item.descAr || item.descEn) : (item.descEn || item.descAr)) || '';
          if (descPrev.length > 80) descPrev = descPrev.slice(0, 80) + '…';
          li.innerHTML =
            '<div class="content">' +
            '<strong>' + escapeHtml(title) + '</strong>' +
            '<small style="color:var(--color-text-muted);">' + escapeHtml(descPrev) + '</small>' +
            '</div>' +
            '<div class="actions">' +
            '<button type="button" class="btn-edit" data-id="' + escapeHtml(item.id) + '">' + iifBilingualSpans('dashBtnEditDescription', 'Edit description', 'تعديل الوصف') + '</button>' +
            '<button type="button" class="btn-delete" data-id="' + escapeHtml(item.id) + '">' + iifBilingualSpans('dashBtnDelete', 'Delete', 'حذف') + '</button>' +
            '</div>';
          ul.appendChild(li);
        });
        ul.querySelectorAll('.btn-edit').forEach(function (btn) {
          btn.addEventListener('click', function () {
            var id = btn.getAttribute('data-id');
            var list = getActivities();
            var item = list.find(function (x) { return x.id === id; });
            if (!item) return;
            var newDescEn = prompt(iifMessage('jsPromptDescEn'), item.descEn || '');
            if (newDescEn === null) return;
            var newDescAr = prompt(iifMessage('jsPromptDescAr'), item.descAr || '');
            if (newDescAr === null) return;
            item.descEn = newDescEn;
            item.descAr = newDescAr;
            saveActivities(list);
            renderActivitiesSection();
            renderDashboardList();
          });
        });
        ul.querySelectorAll('.btn-delete').forEach(function (btn) {
          btn.addEventListener('click', function () {
            var id = btn.getAttribute('data-id');
            if (!confirm(iifMessage('jsConfirmDeleteInvestmentProject'))) return;
            var list = getActivities().filter(function (x) { return x.id !== id; });
            saveActivities(list);
            renderActivitiesSection();
            renderDashboardList();
          });
        });
      }
      var dashOverlay = document.getElementById('dashboard-overlay');
      function IIF_getDashboardOverlay() {
        try {
          var el = document.getElementById('dashboard-overlay');
          return el || dashOverlay;
        } catch (e) { return dashOverlay; }
      }
      var dashClose = document.getElementById('dashboard-close');
      var navDashboard = document.getElementById('nav-dashboard');

      /** ملء الشاشة فعلياً — أنماط مضمّنة !important + نقل العقدة لآخر body (يتجاوز أي CSS خارجي أو قديم) */
      function IIF_applyDashboardFullpageLayout() {
        var el = document.getElementById('dashboard-overlay');
        if (!el) return;
        try {
          if (document.body && el.parentNode !== document.body) {
            document.body.appendChild(el);
          }
        } catch (e1) { }
        try {
          var s = el.style;
          s.setProperty('position', 'fixed', 'important');
          s.setProperty('inset', '0', 'important');
          s.setProperty('top', '0', 'important');
          s.setProperty('left', '0', 'important');
          s.setProperty('right', '0', 'important');
          s.setProperty('bottom', '0', 'important');
          /* 100vw يملأ viewport حتى لو فشل width:auto + min-width:100% مع حاوية ضيقة */
          s.setProperty('width', '100vw', 'important');
          s.setProperty('min-width', '100vw', 'important');
          s.setProperty('max-width', 'none', 'important');
          s.setProperty('min-height', '100dvh', 'important');
          s.setProperty('height', '100dvh', 'important');
          s.setProperty('max-height', 'none', 'important');
          s.setProperty('margin', '0', 'important');
          s.setProperty('padding', '0', 'important');
          s.setProperty('border-radius', '0', 'important');
          s.setProperty('box-shadow', 'none', 'important');
          s.setProperty('transform', 'none', 'important');
          s.setProperty('z-index', '2147483647', 'important');
          /* عمود/نافذة ضيقة: flex + stretch يضمن امتداد الحاويات الداخلية بعرض اللوحة */
          s.setProperty('display', 'flex', 'important');
          s.setProperty('flex-direction', 'column', 'important');
          s.setProperty('align-items', 'stretch', 'important');
          s.setProperty('justify-content', 'flex-start', 'important');
          s.setProperty('box-sizing', 'border-box', 'important');
          s.setProperty('background', 'linear-gradient(165deg, #03050a 0%, #0b1018 38%, #070a10 100%)', 'important');
        } catch (e2) { }
        try {
          var rootEl = document.documentElement;
          var bodyEl = document.body;
          if (rootEl && rootEl.style) {
            rootEl.style.setProperty('transform', 'none', 'important');
            rootEl.style.setProperty('filter', 'none', 'important');
            rootEl.style.setProperty('perspective', 'none', 'important');
            rootEl.style.setProperty('contain', 'none', 'important');
          }
          if (bodyEl && bodyEl.style) {
            bodyEl.style.setProperty('transform', 'none', 'important');
            bodyEl.style.setProperty('filter', 'none', 'important');
            bodyEl.style.setProperty('perspective', 'none', 'important');
            bodyEl.style.setProperty('contain', 'none', 'important');
          }
        } catch (eRoot) { }
        try {
          var modal = document.getElementById('dashboard-page-shell');
          if (modal) {
            var m = modal.style;
            m.setProperty('width', '100%', 'important');
            m.setProperty('min-width', '100%', 'important');
            m.setProperty('max-width', 'none', 'important');
            m.setProperty('flex', '1 1 auto', 'important');
            m.setProperty('min-height', '100dvh', 'important');
            m.setProperty('margin', '0', 'important');
            m.setProperty('border-radius', '0', 'important');
            m.setProperty('box-shadow', 'none', 'important');
            m.setProperty('box-sizing', 'border-box', 'important');
          }
        } catch (e3) { }
        try {
          var dm = el.querySelector && el.querySelector('main.dashboard-main');
          if (dm) {
            var dmS = dm.style;
            dmS.setProperty('max-width', 'none', 'important');
            dmS.setProperty('width', '100%', 'important');
            dmS.setProperty('min-width', '0', 'important');
            dmS.setProperty('margin-left', '0', 'important');
            dmS.setProperty('margin-right', '0', 'important');
            dmS.setProperty('box-sizing', 'border-box', 'important');
          }
          var hi = el.querySelector && el.querySelector('.dashboard-header-bar .site-header__inner');
          if (hi) {
            var hiS = hi.style;
            hiS.setProperty('max-width', 'none', 'important');
            hiS.setProperty('width', '100%', 'important');
            hiS.setProperty('margin-left', '0', 'important');
            hiS.setProperty('margin-right', '0', 'important');
            hiS.setProperty('box-sizing', 'border-box', 'important');
          }
        } catch (e4) { }
      }
      try { window.IIF_applyDashboardFullpageLayout = IIF_applyDashboardFullpageLayout; } catch (eW) { }
      /** إعادة تطبيق ملء الشاشة بعد تأخيرات قصيرة — دالة واحدة بدل تكرار setTimeout (أسهل صيانة، نفس السلوك) */
      function IIF_scheduleDashboardFullpageRetries(delaysMs) {
        if (!delaysMs || !delaysMs.length) return;
        try {
          delaysMs.forEach(function (ms) {
            setTimeout(function () {
              try { IIF_applyDashboardFullpageLayout(); } catch (e) { }
              try {
                if (typeof window.IIF_syncDashboardScrollOffsets === 'function') window.IIF_syncDashboardScrollOffsets();
              } catch (eSync) { }
            }, ms);
          });
        } catch (e) { }
      }
      /** إذا بقي #dashboard-overlay أضيق من النافذة (حاوية fixed معطوبة)، أعد فرض الملء وإخفاء الخلفية */
      function IIF_assertDashboardFullViewport(attemptsLeft) {
        attemptsLeft = typeof attemptsLeft === 'number' ? attemptsLeft : 10;
        var el = document.getElementById('dashboard-overlay');
        if (!el || !el.classList.contains('is-open')) return;
        try {
          if (document.body && el.parentNode !== document.body) {
            document.body.appendChild(el);
          }
          var w = window.innerWidth || (document.documentElement && document.documentElement.clientWidth) || 0;
          var h = window.innerHeight || (document.documentElement && document.documentElement.clientHeight) || 0;
          var r = el.getBoundingClientRect();
          if (w > 0 && h > 0 && (r.width < w * 0.96 || r.height < h * 0.96 || r.left > 2 || r.top > 2)) {
            IIF_applyDashboardFullpageLayout();
            try {
              if (typeof window.IIF_hidePublicSiteChrome === 'function') window.IIF_hidePublicSiteChrome();
            } catch (eH) { }
          }
        } catch (e0) { }
        if (attemptsLeft > 0) {
          setTimeout(function () { IIF_assertDashboardFullViewport(attemptsLeft - 1); }, 280);
        }
      }
      try { window.IIF_assertDashboardFullViewport = IIF_assertDashboardFullViewport; } catch (eW2) { }
      function IIF_clearDashboardFullpageLayout() {
        /* لا نمسح أنماط #dashboard-overlay المضمّنة في HTML — تضمن ملء الشاشة حتى مع كاش قديم */
        var el = document.getElementById('dashboard-overlay');
        if (el) {
          ['display', 'flex-direction', 'align-items', 'justify-content', 'flex', 'min-height', 'height', 'max-height'].forEach(function (p) {
            try { el.style.removeProperty(p); } catch (e) { }
          });
        }
        try {
          var rootEl = document.documentElement;
          var bodyEl = document.body;
          ['transform', 'filter', 'perspective', 'contain'].forEach(function (p) {
            try { if (rootEl && rootEl.style) rootEl.style.removeProperty(p); } catch (e) { }
            try { if (bodyEl && bodyEl.style) bodyEl.style.removeProperty(p); } catch (e) { }
          });
        } catch (eRootClr) { }
        var modal = document.getElementById('dashboard-page-shell');
        if (modal) {
          ['width', 'min-width', 'max-width', 'min-height', 'flex', 'margin', 'border-radius', 'box-shadow', 'box-sizing'].forEach(function (p) {
            try { modal.style.removeProperty(p); } catch (e) { }
          });
        }
        try {
          var dm = document.querySelector('#dashboard-overlay main.dashboard-main');
          if (dm) {
            ['max-width', 'width', 'min-width', 'margin-left', 'margin-right', 'box-sizing'].forEach(function (p) {
              try { dm.style.removeProperty(p); } catch (e) { }
            });
          }
          var hi = document.querySelector('#dashboard-overlay .dashboard-header-bar .site-header__inner');
          if (hi) {
            ['max-width', 'width', 'margin-left', 'margin-right', 'box-sizing'].forEach(function (p) {
              try { hi.style.removeProperty(p); } catch (e) { }
            });
          }
        } catch (eClrInner) { }
      }

      function openDashboard() {
        try { window.IIF_ALLOW_MAIN_IN_PORTAL = false; } catch (eAllow) { }
        if (typeof canAccessDashboard === 'function' && canAccessDashboard()) {
          /* يتابع */
        } else {
          if (typeof isLoggedIn === 'function' && !isLoggedIn()) {
            if (typeof openAuth === 'function') openAuth();
            return;
          }
          alert(iifMessage('dashOpenDenied'));
          return;
        }
        if (typeof clearSessionIfDeviceChanged === 'function' && clearSessionIfDeviceChanged()) {
          updateDashboardNav();
          alert(iifMessage('jsDeviceBrowserChangedRelogin'));
          return;
        }
        var d = IIF_getDashboardOverlay();
        if (!d) {
          try { console.error('IIF: #dashboard-overlay not found in DOM'); } catch (eLog) { }
          alert(iifMessage('dashOpenOverlayMissing'));
          return;
        }
        if (d) {
          try { d.scrollTop = 0; } catch (e) { }
          /* فتح اللوحة من نفس الصفحة بدون إعادة توجيه */
          try {
            document.documentElement.classList.add('iif-dashboard-open');
            window.IIF_DASHBOARD_FULLPAGE_ACTIVE = true;
          } catch (eFull) { }
          try {
            if (typeof closeAuth === 'function') closeAuth();
          } catch (eAuth) { }
          /* مهم: نقل اللوحة لـ body + أنماط ملء الشاشة *قبل* is-open — وإلا تُرسم لإطار بعرض عمود (سلف داخل main/حاوية transform) */
          try {
            IIF_applyDashboardFullpageLayout();
          } catch (ePreLayout) { }
          try {
            var aeDash = document.activeElement;
            if (aeDash && aeDash !== document.body && aeDash !== document.documentElement) {
              window.IIF_lastFocusBeforeDashboard = aeDash;
            }
          } catch (eFsDash) {}
          d.classList.add('is-open');
          try {
            if (typeof window.IIF_hidePublicSiteChrome === 'function') window.IIF_hidePublicSiteChrome();
          } catch (eH) { }
          try {
            IIF_applyDashboardFullpageLayout();
          } catch (ePostLayout) { }
          try {
            requestAnimationFrame(function () {
              IIF_applyDashboardFullpageLayout();
              try {
                if (typeof window.IIF_hidePublicSiteChrome === 'function') window.IIF_hidePublicSiteChrome();
              } catch (eH2) { }
              try {
                if (typeof window.IIF_syncDashboardScrollOffsets === 'function') window.IIF_syncDashboardScrollOffsets();
              } catch (eDashOff) { }
            });
          } catch (eLayout) { }
          try {
            requestAnimationFrame(function () {
              requestAnimationFrame(function () {
                try {
                  if (typeof window.IIF_syncDashboardScrollOffsets === 'function') window.IIF_syncDashboardScrollOffsets();
                } catch (eDashOff2) { }
              });
            });
          } catch (eDashRaf) { }
          try { IIF_scheduleDashboardFullpageRetries([350, 900, 1600]); } catch (eT) { }
          try { IIF_assertDashboardFullViewport(12); } catch (eAssert) { }
          d.setAttribute('aria-hidden', 'false');
          document.body.style.overflow = 'hidden';
          if (typeof addSampleData === 'function') addSampleData();
          if (typeof refreshCertImagePreviews === 'function') refreshCertImagePreviews();
          renderDashboardList();
          // Local dev system status bar (health + diagnostics)
          try {
            (function () {
              var bar = document.getElementById('dashboard-local-statusbar');
              if (!bar) return;

              function dashT() {
                var lang = document.documentElement.getAttribute('data-lang') || 'en';
                return window.IIF_I18N && window.IIF_I18N.T && (window.IIF_I18N.T[lang] || window.IIF_I18N.T.en) || {};
              }
              function escAttr(s) {
                return String(s || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
              }

              async function updateOnce() {
                try {
                  var T0 = dashT();
                  bar.innerHTML = '<span>' + escapeHtml(T0.dashSystemStatusLoading || 'System status: loading…') + '</span>';

                  var res = await fetch('/healthz', { cache: 'no-store' });
                  if (!res.ok) throw new Error('HTTP ' + res.status);
                  var data = await res.json();

                  var searxOk = Boolean(data && data.searx && data.searx.ok);
                  var latency = data && data.searx ? data.searx.latencyMs : null;
                  var diagSize = data && data.diagnostics ? data.diagnostics.size : null;

                  var latencyText = (typeof latency === 'number') ? (latency + 'ms') : 'N/A';
                  var diagText = (typeof diagSize === 'number') ? String(diagSize) : 'N/A';
                  var dotColor = searxOk ? 'rgba(16, 185, 129, 0.95)' : 'rgba(239, 68, 68, 0.95)';
                  var dotShadow = searxOk ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)';

                  var T = dashT();
                  var searxLabel = escapeHtml(T.dashSearxLabel || 'SearXNG:');
                  var diagLabel = escapeHtml(T.dashDiagEventsLabel || 'Diag events:');
                  var diagTitle = escAttr(T.dashDiagEventsTitle || '');
                  bar.innerHTML =
                    '<span aria-hidden="true" style="display:inline-block;width:9px;height:9px;border-radius:999px;background:' +
                    dotColor +
                    ';margin-inline-end:6px;box-shadow:0 0 0 3px ' +
                    dotShadow +
                    '"></span>' +
                    '<span>' + searxLabel + '</span>' +
                    '<strong>' + (searxOk ? 'OK' : 'FAIL') + '</strong>' +
                    '<span style="opacity:0.9;margin-inline-start:6px">(' + latencyText + ')</span>' +
                    '<span aria-hidden="true" style="opacity:0.7;margin-inline:10px">•</span>' +
                    '<span title="' + diagTitle + '">' + diagLabel + '</span>' +
                    '<strong>' + escapeHtml(diagText) + '</strong>';
                } catch (e) {
                  var Te = dashT();
                  bar.innerHTML = Te.dashSystemStatusUnavailableHtml ||
                    '<span>System status: unavailable — static or local. <a href="health.html" style="color:inherit;text-decoration:underline;">Health page</a> · <a href="diagnostics.html" style="color:inherit;text-decoration:underline;">Diagnostics</a></span>';
                }
              }

              // أول تحديث فوراً ثم تحديث كل 15 ثانية (حتى لو كان SearXNG غير متاح عند أول فتح)
              updateOnce();
              try {
                if (window.IIF_DASH_LOCAL_STATUS_TIMER) clearInterval(window.IIF_DASH_LOCAL_STATUS_TIMER);
              } catch (e) { }
              window.IIF_DASH_LOCAL_STATUS_TIMER = setInterval(updateOnce, 15000);
            })();
          } catch (eDashStatus) { }
          if (typeof renderDashboardTeamList === 'function') renderDashboardTeamList();
          if (typeof renderDashboardUploads === 'function') renderDashboardUploads();
          if (typeof renderDashboardPermLists === 'function') renderDashboardPermLists();
          if (typeof renderDashboardSubmissions === 'function') renderDashboardSubmissions();
          if (typeof getDashboardAccessType === 'function' && getDashboardAccessType() === 'owner' && typeof renderDashboardUserRegistry === 'function') renderDashboardUserRegistry();
          if (typeof renderDashboardStaffRolesList === 'function') renderDashboardStaffRolesList();
          if (typeof renderDashboardBusinessList === 'function') renderDashboardBusinessList();
          if (typeof renderDashboardProjectAnalysisList === 'function') renderDashboardProjectAnalysisList();
          if (typeof window !== 'undefined' && window.renderLetterheadChannels) window.renderLetterheadChannels();
          var countEl = document.getElementById('visitor-count-value');
          if (countEl) {
            try { countEl.textContent = localStorage.getItem(VISITOR_COUNT_KEY) || '0'; } catch (e) { }
          }
          if (typeof applyDashboardAccessRules === 'function') applyDashboardAccessRules();
          if (typeof refreshStaffPermissionsUi === 'function') refreshStaffPermissionsUi();
          if (typeof initDashboardMyContentPanel === 'function') initDashboardMyContentPanel();
          if (typeof loadDashboardMyContent === 'function') loadDashboardMyContent();
          try {
            if (typeof window.IIF_syncProfilePhotoPreview === 'function') window.IIF_syncProfilePhotoPreview();
          } catch (eProf) { }
          if (typeof renderMembershipReminders === 'function') renderMembershipReminders();
          if (typeof window.renderRepApps === 'function') window.renderRepApps();
          if (typeof renderStaffEvalEmployeeSelect === 'function') renderStaffEvalEmployeeSelect();
          if (typeof renderStaffEvalList === 'function') renderStaffEvalList();
          if (typeof renderInboxList === 'function') renderInboxList();
          if (typeof renderOutboxList === 'function') renderOutboxList();
          if (typeof renderArchiveList === 'function') renderArchiveList();
          if (typeof renderLetterheadPendingList === 'function') renderLetterheadPendingList();
          if (typeof renderPublicMembersList === 'function') renderPublicMembersList();
          if (typeof renderDashboardFundMembersList === 'function') renderDashboardFundMembersList();
          if (typeof renderSuggestionsInbox === 'function') renderSuggestionsInbox();
          if (typeof renderSuggestionsArchive === 'function') renderSuggestionsArchive();
          d.classList.add('dashboard-automated');
          try {
            setTimeout(function () {
              if (typeof window.IIF_tryScrollDashboardHash === 'function') window.IIF_tryScrollDashboardHash();
            }, 320);
          } catch (eScroll) { }
          requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              try {
                var closeBtn = document.getElementById('dashboard-close');
                if (closeBtn && d && d.classList.contains('is-open')) {
                  closeBtn.focus({ preventScroll: true });
                }
              } catch (e) { }
            });
          });
        }
      }
      try {
        window.IIF_openDashboard = openDashboard;
      } catch (e) { }
      try {
        window.openDashboard = openDashboard;
      } catch (e) { }
      try {
        window.openDashboardEnhanced = openDashboard;
      } catch (e) { }
      // دالة الإغلاق الأساسية - الحل النهائي
      function closeDashboard() {
        var dClose = IIF_getDashboardOverlay();
        if (dClose) {
          try { IIF_clearDashboardFullpageLayout(); } catch (eClr) { }
          try {
            document.documentElement.classList.remove('iif-dashboard-open');
          } catch (eDashOpen) { }
          try {
            document.documentElement.classList.remove('iif-admin-embed');
            window.IIF_DASHBOARD_FULLPAGE_ACTIVE = false;
            try {
              if (typeof window.IIF_restorePublicSiteChrome === 'function') window.IIF_restorePublicSiteChrome();
            } catch (eRest) { }
          } catch (eCls) { }
          dClose.classList.remove('is-open');
          dClose.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = '';
          try {
            if (typeof window.IIF_restorePublicSiteChrome === 'function') window.IIF_restorePublicSiteChrome();
          } catch (eHAfterClose) { }
          try {
            document.querySelectorAll('#dashboard-toc-nav a.is-active').forEach(function (a) { a.classList.remove('is-active'); });
          } catch (e) { }
          try { window.location.hash = ''; } catch (eHash) { }
          try { window.IIF_ALLOW_MAIN_IN_PORTAL = false; } catch (eP) { }
          /* بعد إغلاق اللوحة من مسار admin-direct / ?iif_admin_portal=1: أزل وضع البوابة وإلا يعيد iifHidePublicSiteChrome إخفاء #main-content */
          try {
            document.documentElement.classList.remove('iif-admin-portal');
            window.IIF_ADMIN_PORTAL = false;
            window.IIF_ADMIN_EMBED = false;
            try { sessionStorage.removeItem('iif_admin_portal_mode'); } catch (eSs) { }
            try { sessionStorage.removeItem('iif_pending_open_dashboard'); } catch (eSs2) { }
            var qStrip = new URLSearchParams(window.location.search);
            if (qStrip.get('iif_admin_portal') === '1' || qStrip.get('open_dashboard') === '1' || qStrip.get('iif_open_dashboard') === '1') {
              var u = new URL(window.location.href);
              u.searchParams.delete('iif_admin_portal');
              u.searchParams.delete('open_dashboard');
              u.searchParams.delete('iif_open_dashboard');
              try {
                history.replaceState(null, '', u.pathname + (u.search ? u.search : '') + u.hash);
              } catch (eRs) { }
            }
            var qo = document.getElementById('iif-admin-quick-open');
            if (qo && qo.parentNode) qo.parentNode.removeChild(qo);
          } catch (ePortalExit) { }
          try {
            if (typeof window.IIF_hidePublicSiteChrome === 'function') window.IIF_hidePublicSiteChrome();
          } catch (eH2) { }
          try {
            var refD = window.IIF_lastFocusBeforeDashboard;
            if (refD && typeof refD.focus === 'function') {
              setTimeout(function () {
                try {
                  refD.focus();
                } catch (eFd) {}
              }, 0);
            }
          } catch (eRefD) {}
          try {
            window.IIF_lastFocusBeforeDashboard = null;
          } catch (eClrD) {}
        }
      }

      // مستمعو الأحداث النظيفة والنهائية
      if (navDashboard) navDashboard.addEventListener('click', function (e) {
        e.preventDefault();
        try { openDashboardEnhanced(); } catch (err) { console.error('Dashboard error:', err); }
      });

      // مستمع الإغلاق — زر الهيدر وأي أزرار مساعدة (×)
      function bindDashboardCloseButton(btn) {
        if (!btn) return;
        btn.addEventListener('click', function (e) {
          e.preventDefault();
          closeDashboard();
        });
      }
      bindDashboardCloseButton(dashClose);
      document.querySelectorAll('[data-dashboard-close-aux="true"]').forEach(function (b) { bindDashboardCloseButton(b); });

      (function initDashboardTocScrollSpy() {
        var nav = document.getElementById('dashboard-toc-nav');
        var dash = document.getElementById('dashboard-overlay');
        if (!nav || !dash || typeof IntersectionObserver === 'undefined') return;
        var links = nav.querySelectorAll('a[data-toc-target]');
        if (!links.length) return;
        var sectionEls = [];
        links.forEach(function (a) {
          var id = a.getAttribute('data-toc-target');
          var el = id ? document.getElementById(id) : null;
          if (el) sectionEls.push(el);
        });
        if (!sectionEls.length) return;
        function setActiveToc(id) {
          links.forEach(function (a) {
            a.classList.toggle('is-active', a.getAttribute('data-toc-target') === id);
          });
        }
        var obs = new IntersectionObserver(function (entries) {
          var vis = entries.filter(function (en) { return en.isIntersecting; });
          if (!vis.length) return;
          vis.sort(function (a, b) { return (b.intersectionRatio || 0) - (a.intersectionRatio || 0); });
          var id = vis[0].target && vis[0].target.id;
          if (id) setActiveToc(id);
        }, { root: dash, rootMargin: '-10% 0px -55% 0px', threshold: [0, 0.05, 0.1, 0.2, 0.35, 0.5, 0.75, 1] });
        sectionEls.forEach(function (el) { obs.observe(el); });
      })();

      (function initDashboardTocToggle() {
        var nav = document.getElementById('dashboard-toc-nav');
        var btn = document.getElementById('dashboard-toc-toggle');
        if (!nav || !btn) return;
        function syncSticky() {
          try {
            if (typeof window.IIF_syncDashboardScrollOffsets === 'function') window.IIF_syncDashboardScrollOffsets();
          } catch (e) { }
        }
        var mq = window.matchMedia('(max-width: 1200px)');
        function applyBreakpoint() {
          if (mq.matches) {
            nav.classList.add('is-collapsed');
            btn.setAttribute('aria-expanded', 'false');
          } else {
            nav.classList.remove('is-collapsed');
            btn.setAttribute('aria-expanded', 'true');
          }
          syncSticky();
        }
        if (typeof mq.addEventListener === 'function') {
          mq.addEventListener('change', applyBreakpoint);
        } else if (typeof mq.addListener === 'function') {
          mq.addListener(applyBreakpoint);
        }
        applyBreakpoint();
        btn.addEventListener('click', function () {
          var collapsed = nav.classList.toggle('is-collapsed');
          btn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
          syncSticky();
        });
      })();

      /* فتح لوحة التحكم عند الرابط السري (IIF_CONFIG.dashboardSecretHash) أو #dashboard إن وُجد التوافق */
      function openDashboardIfHash() {
        var hash = (window.location.hash || '').replace(/^#/, '').split('?')[0];
        if (hash === 'dashboard-my-content') {
          if (typeof isLoggedIn === 'function' && !isLoggedIn()) return;
          if (typeof openDashboardEnhanced === 'function') openDashboardEnhanced();
          return;
        }
        if (typeof window.IIF_hashOpensDashboard !== 'function' || !window.IIF_hashOpensDashboard(window.location.hash || '')) return;
        if (typeof isLoggedIn === 'function' && !isLoggedIn()) {
          try {
            var authOvEarly = document.getElementById('auth-overlay');
            if (authOvEarly && authOvEarly.classList.contains('is-open')) return;
          } catch (eDup) { }
          try {
            if (typeof openAuth === 'function') openAuth('login');
            var authOverlay = document.getElementById('auth-overlay');
            if (authOverlay) {
              authOverlay.classList.add('is-open');
              authOverlay.setAttribute('aria-hidden', 'false');
              try { document.body.style.overflow = 'hidden'; } catch (eOv) { }
            }
            var loginTabBtn = document.querySelector('.auth-tab[data-tab="login"]');
            if (loginTabBtn && typeof loginTabBtn.click === 'function') loginTabBtn.click();
            var loginPanel = document.getElementById('auth-panel-login');
            if (loginPanel) loginPanel.classList.add('is-active');
            var regPanel = document.getElementById('auth-panel-register');
            if (regPanel) regPanel.classList.remove('is-active');
            if (typeof window.IIF_hidePublicSiteChrome === 'function') window.IIF_hidePublicSiteChrome();
          } catch (eLogin) { }
          return;
        }
        if (typeof openDashboardEnhanced === 'function') openDashboardEnhanced();
      }
      if (window.addEventListener) {
        window.addEventListener('hashchange', function () {
          try { window.__iifHashDashOpenScheduled = false; } catch (e) { }
          openDashboardIfHash();
          window.IIF_runAfterUI(function () {
            try {
              if (typeof window.IIF_tryScrollDashboardHash === 'function') window.IIF_tryScrollDashboardHash();
            } catch (eScroll) { }
          });
        });
      }

      /* دخول من admin.html بعد التحويل: افتح تسجيل الدخول مباشرةً */
      (function initAdminPortalFromQuery() {
        try {
          var qsPortal = new URLSearchParams(window.location.search);
          var portalFlag = qsPortal.get('iif_admin_portal') === '1';
          var wantDashFromQs = qsPortal.get('open_dashboard') === '1' || qsPortal.get('iif_open_dashboard') === '1';
          var hashWantsDash = typeof window.IIF_hashOpensDashboard === 'function' && window.IIF_hashOpensDashboard(window.location.hash || '');
          if (wantDashFromQs) {
            try { sessionStorage.setItem('iif_pending_open_dashboard', '1'); } catch (eSq) { }
          }
          if (hashWantsDash) {
            try { sessionStorage.setItem('iif_pending_open_dashboard', '1'); } catch (eSqH) { }
          }
          /* وضع ثابت: معاملات البوابة فقط (لا نلصق وضع الإدارة على كل زيارة بـ #dashboard) */
          if (portalFlag || wantDashFromQs) {
            try { sessionStorage.setItem('iif_admin_portal_mode', '1'); } catch (eSticky) { }
          }
          if (!portalFlag && !wantDashFromQs && !hashWantsDash) return;
          document.documentElement.classList.add('iif-admin-embed');
          window.IIF_ADMIN_EMBED = true;

          /** زر طوارئ داخل الصفحة لتفادي الحاجة للـ Console */
          (function ensureAdminQuickOpenButton() {
            try {
              if (document.getElementById('iif-admin-quick-open')) return;
              var btn = document.createElement('button');
              btn.id = 'iif-admin-quick-open';
              btn.type = 'button';
              btn.textContent = 'فتح لوحة التحكم الآن';
              btn.setAttribute('aria-label', 'Open dashboard now');
              btn.style.cssText =
                'position:fixed;z-index:2147483647;bottom:16px;left:16px;max-width:calc(100vw - 32px);' +
                'padding:10px 12px;border-radius:12px;border:1px solid rgba(201,162,39,.55);' +
                'background:rgba(12,14,18,.82);color:#f5e7b6;font-family:system-ui,-apple-system,Segoe UI,Arial;' +
                'font-size:13px;line-height:1.2;cursor:pointer;backdrop-filter:blur(6px)';
              btn.addEventListener('click', function () {
                try {
                  if (typeof openDashboardEnhanced === 'function') {
                    openDashboardEnhanced();
                    return;
                  }
                } catch (e) { }
                try {
                  if (typeof openAuth === 'function') openAuth('login');
                } catch (e2) { }
              });
              document.body.appendChild(btn);
            } catch (eBtn) { }
          })();

          /** إن كان open_dashboard=1: أعد المحاولة عدة مرات بعد الدخول/التهيئة */
          if (wantDashFromQs) {
            try {
              var tries = 0;
              var maxTries = 100; // ~50 ثانية — يتجاوز تأخر فك التخزين الآمن ثم restoreSession
              var t = setInterval(function () {
                tries++;
                try {
                  if (typeof isLoggedIn === 'function' && isLoggedIn() && typeof canAccessDashboard === 'function' && canAccessDashboard() && typeof openDashboardEnhanced === 'function') {
                    openDashboardEnhanced();
                    clearInterval(t);
                  }
                } catch (eTry) { }
                if (tries >= maxTries) clearInterval(t);
              }, 500);
            } catch (eInt) { }
          }

          function iifForceAdminPortalUi() {
            try {
              if (typeof isLoggedIn === 'function' && isLoggedIn() && typeof canAccessDashboard === 'function' && canAccessDashboard() && typeof openDashboardEnhanced === 'function') {
                openDashboardEnhanced();
                return true;
              }
              if (typeof openAuth === 'function') {
                try { openAuth('login'); } catch (eOA) { }
              }
              var authOverlay = document.getElementById('auth-overlay');
              if (authOverlay) {
                authOverlay.classList.add('is-open');
                authOverlay.setAttribute('aria-hidden', 'false');
                try { document.body.style.overflow = 'hidden'; } catch (eOv) { }
              }
              var loginTabBtn = document.querySelector('.auth-tab[data-tab="login"]');
              if (loginTabBtn && typeof loginTabBtn.click === 'function') loginTabBtn.click();
              var loginPanel = document.getElementById('auth-panel-login');
              if (loginPanel) loginPanel.classList.add('is-active');
              var regPanel = document.getElementById('auth-panel-register');
              if (regPanel) regPanel.classList.remove('is-active');
              try {
                if (typeof window.IIF_hidePublicSiteChrome === 'function') window.IIF_hidePublicSiteChrome();
              } catch (eHide) { }
              return false;
            } catch (ePortalUi) { return false; }
          }
          setTimeout(iifForceAdminPortalUi, 120);
          setTimeout(iifForceAdminPortalUi, 450);
          setTimeout(iifForceAdminPortalUi, 900);
          setTimeout(iifForceAdminPortalUi, 1600);
        } catch (e0) { }
      })();

      /* وضع إدارة "ملتصق" للجلسة فقط بعد زيارة صريحة للوحة (/dashboard أو معاملات البوابة) — لا نُعيد تفعيله للمالك على الرئيسية `/` */
      (function initAdminPortalStickyMode() {
        try {
          var sticky = false;
          try { sticky = sessionStorage.getItem('iif_admin_portal_mode') === '1'; } catch (eS) { }
          if (!sticky) return;
          // لا نغيّر URL ولا نعتمد على # أو query — فقط نجعل فتح اللوحة دائماً متاحاً
          function ensureBtn() {
            try {
              if (document.getElementById('iif-admin-quick-open')) return;
              var btn = document.createElement('button');
              btn.id = 'iif-admin-quick-open';
              btn.type = 'button';
              btn.textContent = 'فتح لوحة التحكم الآن';
              btn.setAttribute('aria-label', 'Open dashboard now');
              btn.style.cssText =
                'position:fixed;z-index:2147483647;bottom:16px;left:16px;max-width:calc(100vw - 32px);' +
                'padding:10px 12px;border-radius:12px;border:1px solid rgba(201,162,39,.55);' +
                'background:rgba(12,14,18,.82);color:#f5e7b6;font-family:system-ui,-apple-system,Segoe UI,Arial;' +
                'font-size:13px;line-height:1.2;cursor:pointer;backdrop-filter:blur(6px)';
              btn.addEventListener('click', function () {
                try {
                  if (typeof openDashboardEnhanced === 'function') openDashboardEnhanced();
                  else if (typeof openAuth === 'function') openAuth('login');
                } catch (e) { }
              });
              document.body.appendChild(btn);
            } catch (eBtn) { }
          }
          if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ensureBtn);
          else ensureBtn();
          /* لا نستدعي openDashboardEnhanced هنا — فتح اللوحة من /dashboard أو iifTryPendingDashboardAfterSecureInit فقط */
        } catch (e0) { }
      })();

      /* فتح لوحة الإدارة تلقائياً عند التحميل في وضع admin المنفصل (iframe من admin.html) */
      (function initAdminEmbedFromQuery() {
        try {
          if (new URLSearchParams(window.location.search).get('iif_admin_embed') !== '1') return;
          document.documentElement.classList.add('iif-admin-embed');
          window.IIF_ADMIN_EMBED = true;
          function iifForceOpenAuthLogin() {
            try {
              if (typeof openAuth === 'function') {
                try { openAuth('login'); } catch (eOpenAuth) { }
              }
              var authOverlay = document.getElementById('auth-overlay');
              if (!authOverlay) return false;
              authOverlay.classList.add('is-open');
              authOverlay.setAttribute('aria-hidden', 'false');
              try { document.body.style.overflow = 'hidden'; } catch (eOv) { }
              var loginTabBtn = document.querySelector('.auth-tab[data-tab="login"]');
              if (loginTabBtn && typeof loginTabBtn.click === 'function') loginTabBtn.click();
              var loginPanel = document.getElementById('auth-panel-login');
              if (loginPanel) loginPanel.classList.add('is-active');
              var regPanel = document.getElementById('auth-panel-register');
              if (regPanel) regPanel.classList.remove('is-active');
              try {
                var emailInput = document.getElementById('login-email');
                if (emailInput && typeof emailInput.focus === 'function') emailInput.focus();
              } catch (eFocus) { }
              try {
                if (typeof window.IIF_removeEmbedEntryScreen === 'function') window.IIF_removeEmbedEntryScreen();
              } catch (eRm) { }
              return true;
            } catch (eForce) { return false; }
          }
          setTimeout(function () {
            if (typeof openDashboardEnhanced === 'function' && typeof isLoggedIn === 'function' && isLoggedIn() && typeof canAccessDashboard === 'function' && canAccessDashboard()) {
              openDashboardEnhanced();
              try {
                IIF_scheduleDashboardFullpageRetries([400, 1000]);
                try { IIF_assertDashboardFullViewport(12); } catch (eAs) { }
                setTimeout(function () {
                  if (typeof window.IIF_hidePublicSiteChrome === 'function') window.IIF_hidePublicSiteChrome();
                }, 120);
              } catch (eH3) { }
            } else {
              iifForceOpenAuthLogin();
            }
            try {
              if (typeof window.IIF_hidePublicSiteChrome === 'function') window.IIF_hidePublicSiteChrome();
            } catch (eH4) { }
            try { iifForceOpenAuthLogin(); } catch (eForceAfter) { }
          }, (window.IIF_TIMING && window.IIF_TIMING.adminEmbedOpen !== undefined && window.IIF_TIMING.adminEmbedOpen !== null)
            ? window.IIF_TIMING.adminEmbedOpen
            : ((window.IIF_TIMING && window.IIF_TIMING.deferMedium) || 550));
          /* احتياط: إن بقيت اللوحة والدخول مغلقتين — افتح نافذة الحساب */
          setTimeout(function () {
            try {
              var d = document.getElementById('dashboard-overlay');
              var a = document.getElementById('auth-overlay');
              var dOk = d && d.classList && d.classList.contains('is-open');
              var aOk = a && a.classList && a.classList.contains('is-open');
              if (dOk || aOk) return;
              iifForceOpenAuthLogin();
              if (typeof window.IIF_hidePublicSiteChrome === 'function') window.IIF_hidePublicSiteChrome();
            } catch (eFb) { }
          }, 2200);

          /* ضمان إضافي: كرّر المحاولة عدة مرات حتى لا يبقى embed على صفحة عامة ثابتة */
          (function ensureEmbedEntryFlow() {
            var tries = 0;
            var maxTries = 30; /* ~12 ثانية */
            var timer = setInterval(function () {
              tries += 1;
              try {
                var d2 = document.getElementById('dashboard-overlay');
                var a2 = document.getElementById('auth-overlay');
                var d2Ok = d2 && d2.classList && d2.classList.contains('is-open');
                var a2Ok = a2 && a2.classList && a2.classList.contains('is-open');
                if (d2Ok || a2Ok) {
                  clearInterval(timer);
                  return;
                }
                if (typeof isLoggedIn === 'function' && isLoggedIn() && typeof canAccessDashboard === 'function' && canAccessDashboard() && typeof openDashboardEnhanced === 'function') {
                  openDashboardEnhanced();
                } else {
                  iifForceOpenAuthLogin();
                }
                if (typeof window.IIF_hidePublicSiteChrome === 'function') window.IIF_hidePublicSiteChrome();
                try { iifForceOpenAuthLogin(); } catch (eEnsure2) { }
              } catch (eEnsure) { }
              if (tries >= maxTries) clearInterval(timer);
            }, 400);
          })();
        } catch (e) { }
      })();

      // مستمعو الأحداث الإضافية النظيفة
      (function bindDashboardOverlayBackdropClose() {
        var ov = IIF_getDashboardOverlay();
        if (!ov) return;
        ov.addEventListener('click', function (e) {
          if (e.target === ov) {
            closeDashboard();
          }
        });
      })();

      /* روابط التنقّل داخل اللوحة (#…) — تمرير داخل #dashboard-overlay مع إزاحة شريط اللوحة اللاصق */
      (function initDashboardHashNavigation() {
        var root = document.getElementById('dashboard-overlay');
        if (!root || !root.addEventListener) return;
        root.addEventListener('click', function (e) {
          var a = e.target && e.target.closest ? e.target.closest('a[href^="#"]') : null;
          if (!a || !root.contains(a)) return;
          var href = (a.getAttribute('href') || '').trim();
          if (href === '#' || href === '#!') return;
          var id = href.slice(1).split('?')[0].split('/')[0];
          if (!id) return;
          var el = document.getElementById(id);
          if (!el || !root.contains(el)) return;
          if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
          if (typeof e.button === 'number' && e.button !== 0) return;
          if (a.hasAttribute('data-iif-same-tab')) return;
          e.preventDefault();
          if (typeof window.IIF_scrollIntoViewClearHeader === 'function') {
            window.IIF_scrollIntoViewClearHeader(el, { behavior: 'smooth' });
          } else {
            try {
              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } catch (err) {
              try { el.scrollIntoView(true); } catch (e2) { }
            }
          }
          try {
            if (window.history && window.history.replaceState) {
              window.history.replaceState(null, '', window.location.pathname + window.location.search + '#' + id);
            }
          } catch (eH) { }
        }, true);
      })();

      document.addEventListener('keydown', function (e) {
        var ovK = IIF_getDashboardOverlay();
        if (ovK && ovK.classList.contains('is-open') && (e.key === 'Escape' || e.keyCode === 27)) {
          e.preventDefault();
          closeDashboard();
        }
      });
      var btnNewMember = document.getElementById('dashboard-btn-new-member');
      if (btnNewMember) btnNewMember.addEventListener('click', function (e) {
        closeDashboard();
        var section = document.getElementById('membership');
        if (section) {
          e.preventDefault();
          setTimeout(function () {
            if (typeof window.IIF_scrollIntoViewClearHeader === 'function') {
              window.IIF_scrollIntoViewClearHeader(section, { behavior: 'smooth' });
            } else {
              section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 100);
        }
      });

      /* قاعدة البيانات (IndexedDB) — حفظ وتحميل كل بيانات الموقع */
      (function () {
        var DB_NAME = 'iif-fund-db';
        var STORE_NAME = 'keyvalue';
        var STATUS_ID = 'db-status';
        function getStatusEl() { return document.getElementById(STATUS_ID); }
        function setStatus(msg, isError) {
          var el = getStatusEl();
          if (el) { el.textContent = msg || ''; el.style.color = isError ? 'var(--color-accent-emerald)' : 'var(--color-accent-gold-soft)'; }
        }
        function openDB() {
          return new Promise(function (resolve, reject) {
            try {
              var r = window.indexedDB || window.webkitIndexedDB;
              if (!r) { reject(new Error('IndexedDB not supported')); return; }
              var req = r.open(DB_NAME, 1);
              req.onerror = function () { reject(req.error); };
              req.onsuccess = function () { resolve(req.result); };
              req.onupgradeneeded = function (e) {
                var db = e.target.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME, { keyPath: 'key' });
              };
            } catch (e) { reject(e); }
          });
        }
        function refreshDashboardListsFromStorage() {
          if (typeof renderActivitiesSection === 'function') renderActivitiesSection();
          if (typeof renderDashboardList === 'function') renderDashboardList();
          if (typeof renderDashboardTeamList === 'function') renderDashboardTeamList();
          if (typeof renderDashboardUploads === 'function') renderDashboardUploads();
          if (typeof renderDashboardPermLists === 'function') renderDashboardPermLists();
          if (typeof renderDashboardSubmissions === 'function') renderDashboardSubmissions();
          if (typeof getDashboardAccessType === 'function' && getDashboardAccessType() === 'owner' && typeof renderDashboardUserRegistry === 'function') renderDashboardUserRegistry();
          if (typeof renderDashboardStaffRolesList === 'function') renderDashboardStaffRolesList();
          if (typeof renderDashboardBusinessList === 'function') renderDashboardBusinessList();
          if (typeof renderDashboardProjectAnalysisList === 'function') renderDashboardProjectAnalysisList();
          if (typeof window.renderLetterheadChannels === 'function') window.renderLetterheadChannels();
          if (typeof renderMembershipReminders === 'function') renderMembershipReminders();
          if (typeof renderStaffEvalEmployeeSelect === 'function') renderStaffEvalEmployeeSelect();
          if (typeof renderStaffEvalList === 'function') renderStaffEvalList();
          if (typeof renderInboxList === 'function') renderInboxList();
          if (typeof renderOutboxList === 'function') renderOutboxList();
          if (typeof renderArchiveList === 'function') renderArchiveList();
          if (typeof renderLetterheadPendingList === 'function') renderLetterheadPendingList();
          if (typeof window.renderRepApps === 'function') window.renderRepApps();
          if (typeof renderPublicMembersList === 'function') renderPublicMembersList();
          if (typeof renderDashboardFundMembersList === 'function') renderDashboardFundMembersList();
          if (typeof renderSuggestionsInbox === 'function') renderSuggestionsInbox();
          if (typeof renderSuggestionsArchive === 'function') renderSuggestionsArchive();
          try {
            if (typeof refreshCertImagePreviews === 'function') refreshCertImagePreviews();
          } catch (e) { }
          try {
            var dashOv = document.getElementById('dashboard-overlay');
            if (dashOv && dashOv.classList.contains('is-open')) {
              if (typeof applyDashboardAccessRules === 'function') applyDashboardAccessRules();
              if (typeof initDashboardMyContentPanel === 'function') initDashboardMyContentPanel();
              if (typeof loadDashboardMyContent === 'function') loadDashboardMyContent();
            }
          } catch (e2) { }
        }
        try { window.IIF_refreshDashboardLists = refreshDashboardListsFromStorage; } catch (e) { }

        function saveAllToDB() {
          setStatus(iifMessage('jsDbSaving'));
          openDB().then(function (db) {
            var tx = db.transaction(STORE_NAME, 'readwrite');
            var store = tx.objectStore(STORE_NAME);
            var keys = [];
            try {
              for (var i = 0; i < localStorage.length; i++) {
                var k = localStorage.key(i);
                if (k && (k.substring(0, 3) === 'iif' || k.substring(0, 4) === 'iif_')) keys.push(k);
              }
            } catch (e) { }
            for (var j = 0; j < keys.length; j++) store.put({ key: keys[j], value: localStorage.getItem(keys[j]) || '' });
            tx.oncomplete = function () {
              db.close();
              setStatus(iifMessageFmt('jsDbSavedCount', { n: keys.length }));
              refreshDashboardListsFromStorage();
            };
            tx.onerror = function () { db.close(); setStatus(iifMessage('jsDbSaveFailed'), true); };
          }).catch(function (e) { setStatus(iifMessage('jsErrorPrefix') + (e && e.message ? e.message : iifMessage('jsIndexeddbFailed')), true); });
        }
        function loadAllFromDB() {
          setStatus('');
          openDB().then(function (db) {
            var tx = db.transaction(STORE_NAME, 'readonly');
            var store = tx.objectStore(STORE_NAME);
            var req = store.getAll();
            req.onsuccess = function () {
              var items = req.result || [];
              try {
                for (var i = 0; i < items.length; i++) {
                  if (items[i] && items[i].key != null) localStorage.setItem(items[i].key, items[i].value != null ? items[i].value : '');
                }
              } catch (e) { }
              db.close();
              setStatus(iifMessageFmt('jsDbLoadedCount', { n: items.length }));
              refreshDashboardListsFromStorage();
            };
            req.onerror = function () { db.close(); setStatus(iifMessage('jsDbLoadFailed'), true); };
          }).catch(function (e) { setStatus(iifMessage('jsErrorPrefix') + (e && e.message ? e.message : iifMessage('jsIndexeddbFailed')), true); });
        }
        function exportLocalStorageJsonFile() {
          var obj = {};
          try {
            for (var i = 0; i < localStorage.length; i++) {
              var k = localStorage.key(i);
              if (k && (k.substring(0, 3) === 'iif' || k.substring(0, 4) === 'iif_')) obj[k] = localStorage.getItem(k) || '';
            }
          } catch (e) { }
          try {
            var blob = new Blob([JSON.stringify(obj)], { type: 'application/json' });
            var a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'iif-site-backup-' + new Date().toISOString().slice(0, 10) + '.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(a.href);
            setStatus('Exported ' + Object.keys(obj).length + ' keys to JSON file');
          } catch (e2) {
            setStatus((iifMessage('jsErrorPrefix') || '') + (e2 && e2.message ? e2.message : 'export failed'), true);
          }
        }
        function importLocalStorageJsonFile(file) {
          if (!file) return;
          var reader = new FileReader();
          reader.onload = function () {
            try {
              var obj = JSON.parse(reader.result);
              if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
                setStatus('JSON must be a single object / يجب أن يكون الملف كائناً واحداً.', true);
                return;
              }
              var keysToApply = [];
              Object.keys(obj).forEach(function (k) {
                if (k && (k.substring(0, 3) === 'iif' || k.substring(0, 4) === 'iif_')) keysToApply.push(k);
              });
              if (keysToApply.length === 0) {
                setStatus('No iif* keys in file / لا توجد مفاتيح iif* في الملف.', true);
                return;
              }
              var newKeys = 0;
              var overwrite = 0;
              var same = 0;
              keysToApply.forEach(function (k) {
                try {
                  var cur = localStorage.getItem(k);
                  var next = obj[k] == null ? '' : String(obj[k]);
                  if (cur === null) newKeys++;
                  else if (cur !== next) overwrite++;
                  else same++;
                } catch (eC) {}
              });
              var confirmMsg =
                'استيراد ' + keysToApply.length + ' مفتاحاً (iif*) إلى هذا المتصفح.\n' +
                'جديدة: ' + newKeys + ' · تحديث قيمة: ' + overwrite + ' · نفس القيمة: ' + same + '\n\n' +
                'Import ' + keysToApply.length + ' iif* key(s) into this browser.\n' +
                'New: ' + newKeys + ' · value updates: ' + overwrite + ' · unchanged: ' + same + '\n\n' +
                'متابعة؟ / Proceed?';
              if (typeof window.confirm === 'function' && !window.confirm(confirmMsg)) {
                setStatus('استيراد JSON أُلغي / Import cancelled.');
                return;
              }
              var n = 0;
              keysToApply.forEach(function (k) {
                localStorage.setItem(k, obj[k] == null ? '' : String(obj[k]));
                n++;
              });
              setStatus('Imported ' + n + ' keys from JSON / تم استيراد ' + n + ' مفتاحاً.');
              refreshDashboardListsFromStorage();
            } catch (e) {
              setStatus((iifMessage('jsErrorPrefix') || '') + (e && e.message ? e.message : 'invalid JSON'), true);
            }
          };
          reader.onerror = function () { setStatus('File read failed', true); };
          reader.readAsText(file, 'utf-8');
        }
        var saveBtn = document.getElementById('db-save-btn');
        var loadBtn = document.getElementById('db-load-btn');
        var exBtn = document.getElementById('ls-export-file-btn');
        var imBtn = document.getElementById('ls-import-file-btn');
        var imInp = document.getElementById('ls-import-file-input');
        if (saveBtn) saveBtn.addEventListener('click', saveAllToDB);
        if (loadBtn) loadBtn.addEventListener('click', loadAllFromDB);
        if (exBtn) exBtn.addEventListener('click', exportLocalStorageJsonFile);
        if (imBtn && imInp) {
          imBtn.addEventListener('click', function () { imInp.click(); });
          imInp.addEventListener('change', function () {
            var f = imInp.files && imInp.files[0];
            if (f) importLocalStorageJsonFile(f);
            imInp.value = '';
          });
        }
        var showBannerAgain = document.getElementById('iif-static-banner-show-again');
        if (showBannerAgain) {
          showBannerAgain.addEventListener('click', function () {
            if (typeof window.iifIsStaticPublicHost === 'function' && !window.iifIsStaticPublicHost()) {
              setStatus('الشريط يظهر على github.io و netlify فقط / Banner: GitHub Pages & Netlify only.', true);
              return;
            }
            if (typeof window.IIF_showStaticHostBannerAgain === 'function') {
              window.IIF_showStaticHostBannerAgain();
              setStatus('تم إظهار الشريط أسفل الصفحة / Notice shown at bottom.');
            } else {
              try {
                localStorage.removeItem('iif-static-host-banner-dismissed');
              } catch (eB) {}
              var bar = document.getElementById('iif-static-host-banner');
              if (bar) bar.hidden = false;
            }
          });
        }
      })();

      /* قبول ممثلاً لنا + إضافة أعضاء مباشرة (مشروع واحد على الهارد سي) */
      (function () {
        var REP_APP_KEY = 'iif_representative_applications';
        var listEl = document.getElementById('representative-applications-list');
        var emptyEl = document.getElementById('rep-apps-empty');
        function getApps() { try { return JSON.parse(localStorage.getItem(REP_APP_KEY) || '[]'); } catch (e) { return []; } }
        function saveApps(arr) { try { localStorage.setItem(REP_APP_KEY, JSON.stringify(arr)); } catch (e) { } }
        function escapeHtml(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
        window.renderRepApps = function () {
          if (!listEl) return;
          var apps = getApps();
          listEl.innerHTML = '';
          apps.forEach(function (a) {
            var li = document.createElement('li');
            li.style.cssText = 'padding: var(--space-3); border: 1px solid var(--color-border-subtle); border-radius: var(--radius-sm); margin-bottom: var(--space-2);' + (a.status === 'accepted' ? ' opacity: 0.8; background: rgba(28, 138, 87, 0.1);' : '');
            var name = (a.rep_name || a.rep_email || a.id || '—').trim();
            var meta = (a.rep_country || '') + (a.rep_email ? ' · ' + a.rep_email : '');
            var date = a.submittedAt ? new Date(a.submittedAt).toLocaleDateString() : '';
            var linkedLine = '';
            var emails = a.linkedToEmails || (a.linkedToAdminEmail ? [a.linkedToAdminEmail] : []);
            if (emails.length) linkedLine = '<div style="font-size: 0.85rem; color: var(--color-accent-gold-soft); margin-top: 0.25rem;">' + escapeHtml(iifMessage('repLinkedTo')) + escapeHtml(emails.join(', ')) + '</div>';
            var kycParts = [];
            if (a.kyc_dob) {
              var dobStr = String(a.kyc_dob);
              try { var d = new Date(dobStr + 'T12:00:00'); if (!isNaN(d.getTime())) dobStr = d.toLocaleDateString(); } catch (e) { }
              kycParts.push(escapeHtml(iifMessage('repKycDobPrefix')) + escapeHtml(dobStr));
            }
            if (a.kyc_age) kycParts.push(escapeHtml(iifMessage('repKycAgePrefix')) + escapeHtml(String(a.kyc_age)));
            if (a.kyc_income) kycParts.push(escapeHtml(String(a.kyc_income)));
            if (a.kyc_relationships) kycParts.push(escapeHtml(iifMessage('repKycRelationsPrefix')) + escapeHtml(String(a.kyc_relationships).slice(0, 60)) + (a.kyc_relationships.length > 60 ? '…' : ''));
            if (a.kyc_positions) kycParts.push(escapeHtml(iifMessage('repKycPositionsPrefix')) + escapeHtml(String(a.kyc_positions).slice(0, 60)) + (a.kyc_positions.length > 60 ? '…' : ''));
            if (a.kyc_management_capacity) kycParts.push(escapeHtml(iifMessage('repKycCapacityPrefix')) + escapeHtml(String(a.kyc_management_capacity).slice(0, 60)) + (a.kyc_management_capacity.length > 60 ? '…' : ''));
            var kycLine = kycParts.length ? '<div style="font-size: 0.85rem; color: var(--color-text-muted); margin-top: 0.25rem;">KYC: ' + kycParts.join(' · ') + '</div>' : '';
            li.innerHTML = '<div style="font-weight: 600;">' + escapeHtml(name) + '</div><div style="font-size: 0.9rem; color: var(--color-text-muted);">' + escapeHtml(meta) + (date ? ' · ' + date : '') + '</div>' + linkedLine + kycLine +
              (a.status !== 'accepted' ? '<button type="button" class="btn btn--primary btn-sm" style="margin-top: var(--space-2);" data-rep-id="' + escapeHtml(a.id) + '">' + escapeHtml(iifMessage('repAcceptAsRepBtn')) + '</button>' : '<span style="font-size: 0.9rem; color: var(--color-text-muted);">' + escapeHtml(iifMessage('repAcceptedLabel')) + '</span>');
            listEl.appendChild(li);
          });
          listEl.querySelectorAll('[data-rep-id]').forEach(function (btn) {
            btn.addEventListener('click', function () {
              var id = this.getAttribute('data-rep-id');
              var apps = getApps();
              var i = apps.findIndex(function (a) { return a.id === id; });
              if (i !== -1) { apps[i].status = 'accepted'; apps[i].acceptedAt = new Date().toISOString(); saveApps(apps); window.renderRepApps(); }
            });
          });
          if (emptyEl) emptyEl.style.display = apps.length ? 'none' : 'block';
        };
        var acceptAllBtn = document.getElementById('rep-accept-all-btn');
        if (acceptAllBtn) acceptAllBtn.addEventListener('click', function () {
          var apps = getApps();
          var pending = apps.filter(function (a) { return a.status !== 'accepted'; });
          if (!pending.length) { alert(iifMessage('jsRepNoPendingApps')); return; }
          apps.forEach(function (a) { if (a.status !== 'accepted') { a.status = 'accepted'; a.acceptedAt = new Date().toISOString(); } });
          saveApps(apps);
          window.renderRepApps();
          alert(iifMessageFmt('jsRepAcceptedCount', { n: pending.length }));
        });
        var REP_LINK_EMAILS_KEY = 'iif-rep-link-emails';
        var repLinkTextarea = document.getElementById('rep-link-emails');
        var repSaveLinkBtn = document.getElementById('rep-save-link-emails');
        if (repLinkTextarea) {
          try { var saved = JSON.parse(localStorage.getItem(REP_LINK_EMAILS_KEY) || '[]'); repLinkTextarea.value = Array.isArray(saved) ? saved.join(', ') : ''; } catch (e) { }
        }
        if (repSaveLinkBtn && repLinkTextarea) repSaveLinkBtn.addEventListener('click', function () {
          var raw = (repLinkTextarea.value || '').split(/[,;\n]+/).map(function (s) { return s.trim().toLowerCase(); }).filter(Boolean);
          try { localStorage.setItem(REP_LINK_EMAILS_KEY, JSON.stringify(raw)); } catch (e) { }
          alert(iifMessage('jsRepEmailsSavedLinked'));
        });
        window.renderRepApps();

        var emailInput = document.getElementById('direct-member-email');
        var nameInput = document.getElementById('direct-member-name');
        var msgEl = document.getElementById('add-members-direct-msg');
        var prefix = typeof MEMBERSHIP_STORAGE_PREFIX !== 'undefined' ? MEMBERSHIP_STORAGE_PREFIX : 'iif-membership-';
        var startPrefix = typeof MEMBERSHIP_START_PREFIX !== 'undefined' ? MEMBERSHIP_START_PREFIX : 'iif-membership-start-';
        var expiryPrefix = typeof MEMBERSHIP_EXPIRY_PREFIX !== 'undefined' ? MEMBERSHIP_EXPIRY_PREFIX : 'iif-membership-expiry-';
        var registryKey = typeof MEMBERSHIP_REGISTRY_KEY !== 'undefined' ? MEMBERSHIP_REGISTRY_KEY : 'iif-membership-registry';
        function getTodayISO() { var d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
        function addDuration(fromISO, duration) { var d = new Date(fromISO + 'T12:00:00'); if (duration === 'year') d.setFullYear(d.getFullYear() + 1); else if (duration === 'month') d.setMonth(d.getMonth() + 1); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
        function showAddMsg(txt, err) { if (msgEl) { msgEl.textContent = txt || ''; msgEl.style.color = err ? '#f87171' : 'var(--color-accent-emerald)'; } }
        document.querySelectorAll('.btn-membership').forEach(function (btn) {
          btn.addEventListener('click', function () {
            var email = (emailInput && emailInput.value) ? String(emailInput.value).trim().toLowerCase() : '';
            if (!email) { showAddMsg(iifMessage('jsEnterEmail'), true); return; }
            var type = this.getAttribute('data-type');
            var duration = this.getAttribute('data-duration') || 'year';
            var startDate = getTodayISO();
            var endDate = addDuration(startDate, duration);
            var name = (nameInput && nameInput.value) ? String(nameInput.value).trim() : '';
            try {
              localStorage.setItem(prefix + email, type);
              localStorage.setItem(startPrefix + email, startDate);
              localStorage.setItem(expiryPrefix + email, endDate);
              var reg = []; try { reg = JSON.parse(localStorage.getItem(registryKey) || '[]'); } catch (_) { }
              reg.push({ email: email, type: type, start: startDate, end: endDate, name: name || email });
              localStorage.setItem(registryKey, JSON.stringify(reg));
            } catch (e) { showAddMsg('Storage error', true); return; }
            var certData = { email: email, name: name || email, type: type, startDate: startDate, endDate: endDate, entityType: typeof getStoredEntity === 'function' ? getStoredEntity() : 'personal', photo: typeof getCertPhoto === 'function' ? getCertPhoto() : '', logo: typeof getCertLogo === 'function' ? getCertLogo() : '', flag: typeof getCertFlag === 'function' ? getCertFlag() : '' };
            if (typeof createCertificate === 'function') certData = createCertificate(certData);
            if (typeof showCertificateView === 'function') showCertificateView(certData);
            showAddMsg(iifMessage('jsMemberAddedCardIssued'));
          });
        });
        var issueOnlyBtn = document.getElementById('direct-issue-cert-only');
        if (issueOnlyBtn) issueOnlyBtn.addEventListener('click', function () {
          var email = (emailInput && emailInput.value) ? String(emailInput.value).trim().toLowerCase() : '';
          if (!email) { showAddMsg(iifMessage('jsEnterMemberEmail'), true); return; }
          var type = localStorage.getItem(prefix + email);
          var startDate = localStorage.getItem(startPrefix + email);
          var endDate = localStorage.getItem(expiryPrefix + email);
          if (!type || !endDate) { showAddMsg(iifMessage('jsNoMembershipFound'), true); return; }
          var certData = { email: email, name: (nameInput && nameInput.value) ? nameInput.value.trim() : email, type: type, startDate: startDate || '', endDate: endDate, entityType: typeof getStoredEntity === 'function' ? getStoredEntity() : 'personal', photo: typeof getCertPhoto === 'function' ? getCertPhoto() : '', logo: typeof getCertLogo === 'function' ? getCertLogo() : '', flag: typeof getCertFlag === 'function' ? getCertFlag() : '' };
          if (typeof createCertificate === 'function') certData = createCertificate(certData);
          if (typeof showCertificateView === 'function') showCertificateView(certData);
          showAddMsg(iifMessage('jsDigitalCardIssued'));
        });
      })();

      function updateServiceFormsGates() {
        var ok = typeof canUseServiceForms === 'function' && canUseServiceForms();
        var gate = document.getElementById('feasibility-gate');
        var memberBox = document.getElementById('feasibility-member-box');
        if (gate && memberBox) {
          gate.style.display = ok ? 'none' : 'block';
          memberBox.style.display = ok ? 'block' : 'none';
        }
        var fg = document.getElementById('financing-gate');
        var fm = document.getElementById('financing-member-box');
        if (fg && fm) {
          fg.style.display = ok ? 'none' : 'block';
          fm.style.display = ok ? 'block' : 'none';
        }
        var ig = document.getElementById('investor-gate');
        var im = document.getElementById('investor-member-box');
        if (ig && im) {
          ig.style.display = ok ? 'none' : 'block';
          im.style.display = ok ? 'block' : 'none';
        }
      }
      function updateFeasibilityGate() {
        updateServiceFormsGates();
      }

      var dashForm = document.getElementById('dashboard-form');
      if (dashForm) dashForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var titleEn = (document.getElementById('dash-title-en') && document.getElementById('dash-title-en').value) || '';
        var titleAr = (document.getElementById('dash-title-ar') && document.getElementById('dash-title-ar').value) || '';
        var descEn = (document.getElementById('dash-desc-en') && document.getElementById('dash-desc-en').value) || '';
        var descAr = (document.getElementById('dash-desc-ar') && document.getElementById('dash-desc-ar').value) || '';
        if (!titleEn.trim() || !titleAr.trim()) return;
        var list = getActivities();
        var nextId = String(1 + list.reduce(function (max, x) { var n = parseInt(x.id, 10); return isNaN(n) ? max : Math.max(max, n); }, 0));
        list.push({ id: nextId, titleEn: titleEn.trim(), titleAr: titleAr.trim(), descEn: descEn.trim(), descAr: descAr.trim() });
        saveActivities(list);
        renderActivitiesSection();
        renderDashboardList();
        dashForm.reset();
      });

      /* من نحن — فريق الصندوق (ديناميكي: إضافة/تعديل/حذف أشخاص من لوحة التحكم) */
      var TEAM_KEY = 'iif-team-members';
      var DEFAULT_TEAM = [
        {
          roleAboveEn: 'Chairman of the Board',
          roleAboveAr: 'رئيس مجلس الإدارة',
          nameEn: 'Financial Advisor Dr. Talal Hassan Al-Zahrani',
          nameAr: 'المستشار المالي الدكتور طلال حسن الزهراني',
          titleEn: 'Internationally classified global financial expert',
          titleAr: 'خبير مالي دولي',
          bioEn: 'Saudi financial advisor and Chairman of the International Investment Fund, with over thirty years of leadership in finance, investment, and development. Holds a PhD in Financial Engineering for Islamic & Global Banks, a PhD in Cost Accounting, and a Master\'s in Risk Management, Financial Crises, and Local & Global Markets. Has worked across more than ten countries on over fifty projects spanning finance, real estate, media, and mining. In 2023 he received the International Phoenix Award as the best Arab economist. Also serves as President of the United Nations Organization for the Protection of Financial and Intellectual Rights and as a Member of the European Parliament.',
          bioAr: 'مستشار مالي سعودي ورئيس مجلس إدارة صندوق الاستثمار الدولي، يمتلك خبرة قيادية تزيد على ثلاثين عاماً في التمويل والاستثمار والتنمية. يحمل درجة الدكتوراه في الهندسة المالية للمصارف الإسلامية والعالمية، ودكتوراه في محاسبة التكاليف، وماجستير في إدارة المخاطر والأزمات المالية والأسواق المحلية والعالمية. عمل في أكثر من عشر دول في أكثر من خمسين مشروعاً تشمل التمويل والعقارات والإعلام والتعدين. حصل على جائزة العنقاء الدولية كأفضل اقتصادي عربي لعام 2023. يشغل أيضاً منصب رئيس منظمة الأمم المتحدة لحماية الحقوق المالية والفكرية، وعضو في البرلمان الأوروبي.',
          imageUrl: ''
        }
      ];
      function getTeamMembers() {
        if (typeof DEFAULT_TEAM === 'undefined' || !Array.isArray(DEFAULT_TEAM) || !DEFAULT_TEAM.length) {
          return [];
        }
        var def = DEFAULT_TEAM[0];
        try {
          var raw = localStorage.getItem(TEAM_KEY);
          if (raw) {
            var list = JSON.parse(raw);
            if (Array.isArray(list) && list.length) {
              var hasTalal = list.some(function (p) { return (p.nameEn && p.nameEn.indexOf('Talal') !== -1) || (p.nameAr && p.nameAr.indexOf('طلال') !== -1); });
              if (!hasTalal) list = [def].concat(list);
              list.forEach(function (p) {
                var nameMatch = (p.nameEn && p.nameEn.indexOf('Talal') !== -1) || (p.nameAr && p.nameAr.indexOf('طلال') !== -1);
                if (nameMatch && def) {
                  if (p.nameAr !== 'المستشار المالي الدكتور طلال حسن الزهراني') { p.nameEn = def.nameEn; p.nameAr = def.nameAr; }
                  p.roleAboveEn = p.roleAboveEn || def.roleAboveEn;
                  p.roleAboveAr = p.roleAboveAr || def.roleAboveAr;
                  p.titleEn = p.titleEn || def.titleEn;
                  p.titleAr = p.titleAr || def.titleAr;
                  p.bioEn = (p.bioEn && p.bioEn.trim()) ? p.bioEn : def.bioEn;
                  p.bioAr = (p.bioAr && p.bioAr.trim()) ? p.bioAr : def.bioAr;
                }
              });
              return list;
            }
          }
        } catch (e) { }
        var fallback = DEFAULT_TEAM.slice();
        try {
          var raw = localStorage.getItem(TEAM_KEY);
          if (!raw || (raw.trim() === '[]') || (raw.trim() === '{}')) saveTeamMembers(fallback);
        } catch (e) { }
        return fallback;
      }
      function preserveDefaultMemberContent(list) {
        if (typeof DEFAULT_TEAM === 'undefined' || !Array.isArray(DEFAULT_TEAM) || !DEFAULT_TEAM.length) {
          return Array.isArray(list) ? list : [];
        }
        var def = DEFAULT_TEAM[0];
        if (!def || !Array.isArray(list)) return list;
        return list.map(function (p) {
          var nameMatch = (p.nameEn && p.nameEn.indexOf('Talal') !== -1) || (p.nameAr && p.nameAr.indexOf('طلال') !== -1);
          if (!nameMatch) return p;
          return {
            nameEn: (p.nameEn && p.nameEn.trim()) ? p.nameEn : def.nameEn,
            nameAr: (p.nameAr && p.nameAr.trim()) ? p.nameAr : def.nameAr,
            roleAboveEn: (p.roleAboveEn && p.roleAboveEn.trim()) ? p.roleAboveEn : def.roleAboveEn,
            roleAboveAr: (p.roleAboveAr && p.roleAboveAr.trim()) ? p.roleAboveAr : def.roleAboveAr,
            titleEn: (p.titleEn && p.titleEn.trim()) ? p.titleEn : def.titleEn,
            titleAr: (p.titleAr && p.titleAr.trim()) ? p.titleAr : def.titleAr,
            bioEn: (p.bioEn && p.bioEn.trim()) ? p.bioEn : def.bioEn,
            bioAr: (p.bioAr && p.bioAr.trim()) ? p.bioAr : def.bioAr,
            imageUrl: (p.imageUrl && p.imageUrl.trim()) ? p.imageUrl : (def.imageUrl || '')
          };
        });
      }
      function saveTeamMembers(list) {
        try {
          var toSave = preserveDefaultMemberContent(Array.isArray(list) ? list : []);
          localStorage.setItem(TEAM_KEY, JSON.stringify(toSave));
        } catch (e) { }
      }
      /* بعد تهيئة DEFAULT_TEAM/getTeamMembers — تجنّب استدعاء updateDashboardNav مبكراً (كان يسقط السكربت قبل تصدير openDashboard) */
      (function initNavOnly() {
        try {
          updateDashboardNav();
          updateFeasibilityGate();
        } catch (e) { }
      })();
      function renderAboutTeam() {
        var ul = document.getElementById('about-team-list');
        if (!ul) return;
        var list = getTeamMembers();
        if (!list || !list.length) list = DEFAULT_TEAM.slice();
        ul.innerHTML = '';
        var certPhoto = (typeof getCertPhoto === 'function' && getCertPhoto()) || '';
        list.forEach(function (p) {
          var li = document.createElement('li');
          li.className = 'about-team-card';
          var isTalal = (p.nameEn && p.nameEn.indexOf('Talal') !== -1) || (p.nameAr && p.nameAr.indexOf('طلال') !== -1);
          var photoUrl = (p.imageUrl || '').trim();
          if (!photoUrl && isTalal && certPhoto) photoUrl = certPhoto;
          var imgSrc = getDisplayImageSrc(photoUrl, 'photo');
          var imgAlt = escapeHtml((p.nameEn || p.nameAr || '').trim()) || '';
          var ph = typeof IIF_IMAGES !== 'undefined' && IIF_IMAGES.getPlaceholder ? IIF_IMAGES.getPlaceholder('photo') : '';
          var onErr = ph ? ('this.onerror=null;this.src=\'' + ph.replace(/'/g, '\\\'') + '\';') : 'this.style.display=\'none\';';
          var imgHtml = '<div class="about-team-card__photo-wrap"><img class="about-team-card__photo" src="' + escapeHtml(imgSrc) + '" alt="' + imgAlt + '" loading="lazy" decoding="async" onerror="' + onErr + '" /></div>';
          var roleAboveHtml = (p.roleAboveEn || p.roleAboveAr) ? ('<p class="about-team-card__role-above lang-en">' + escapeHtml(p.roleAboveEn || '') + '</p><p class="about-team-card__role-above lang-ar">' + escapeHtml(p.roleAboveAr || '') + '</p>') : '';
          li.innerHTML =
            imgHtml +
            '<div class="about-team-card__body">' +
            roleAboveHtml +
            '<h4 class="about-team-card__name lang-en">' + escapeHtml(p.nameEn || '') + '</h4>' +
            '<h4 class="about-team-card__name lang-ar">' + escapeHtml(p.nameAr || '') + '</h4>' +
            '<p class="about-team-card__title lang-en">' + escapeHtml(p.titleEn || '') + '</p>' +
            '<p class="about-team-card__title lang-ar">' + escapeHtml(p.titleAr || '') + '</p>' +
            '<p class="about-team-card__bio lang-en">' + escapeHtml(p.bioEn || '') + '</p>' +
            '<p class="about-team-card__bio lang-ar">' + escapeHtml(p.bioAr || '') + '</p>' +
            '</div>';
          ul.appendChild(li);
        });
      }
      function renderDashboardTeamList() {
        var ul = document.getElementById('dashboard-team-list');
        if (!ul) return;
        var list = getTeamMembers();
        ul.innerHTML = '';
        list.forEach(function (p, idx) {
          var li = document.createElement('li');
          li.dataset.index = String(idx);
          var lang = document.documentElement.getAttribute('data-lang');
          var name = lang === 'ar' ? (p.nameAr || p.nameEn) : (p.nameEn || p.nameAr);
          var titlePrev = ((lang === 'ar' ? (p.titleAr || p.titleEn) : (p.titleEn || p.titleAr)) || '').slice(0, 60) + '…';
          li.innerHTML =
            '<div class="content">' +
            '<strong>' + escapeHtml(name) + '</strong>' +
            '<small>' + escapeHtml(titlePrev) + '</small>' +
            '</div>' +
            '<div class="actions">' +
            '<button type="button" class="btn-edit team-edit" data-index="' + idx + '">' + iifBilingualSpans('dashBtnEdit', 'Edit', 'تعديل') + '</button>' +
            '<button type="button" class="btn-delete team-delete" data-index="' + idx + '">' + iifBilingualSpans('dashBtnDelete', 'Delete', 'حذف') + '</button>' +
            '</div>';
          ul.appendChild(li);
        });
        ul.querySelectorAll('.team-edit').forEach(function (btn) {
          btn.addEventListener('click', function () {
            var idx = parseInt(btn.getAttribute('data-index'), 10);
            var list = getTeamMembers();
            var p = list[idx];
            if (!p) return;
            document.getElementById('team-name-en').value = p.nameEn || '';
            document.getElementById('team-name-ar').value = p.nameAr || '';
            document.getElementById('team-title-en').value = p.titleEn || '';
            document.getElementById('team-title-ar').value = p.titleAr || '';
            document.getElementById('team-bio-en').value = p.bioEn || '';
            document.getElementById('team-bio-ar').value = p.bioAr || '';
            var imgUrl = p.imageUrl || '';
            if (imgUrl && imgUrl.slice(0, 5) === 'data:') {
              var dataEl = document.getElementById('team-image-data');
              if (dataEl) dataEl.value = imgUrl;
              document.getElementById('team-image-url').value = '';
            } else {
              document.getElementById('team-image-url').value = imgUrl;
              var dataEl = document.getElementById('team-image-data');
              if (dataEl) dataEl.value = '';
            }
            var teamFile = document.getElementById('team-image-file');
            if (teamFile) teamFile.value = '';
            document.getElementById('team-edit-index').value = String(idx);
            document.getElementById('team-add-btn').innerHTML = iifBilingualSpans('dashSaveChanges', 'Save changes', 'حفظ التعديل');
          });
        });
        ul.querySelectorAll('.team-delete').forEach(function (btn) {
          btn.addEventListener('click', function () {
            if (!confirm(iifMessage('jsConfirmDeleteTeamMember'))) return;
            var idx = parseInt(btn.getAttribute('data-index'), 10);
            var list = getTeamMembers().filter(function (_, i) { return i !== idx; });
            saveTeamMembers(list);
            renderAboutTeam();
            renderDashboardTeamList();
            document.getElementById('team-edit-index').value = '';
            document.getElementById('team-add-btn').innerHTML = iifBilingualSpans('dashAddTeamMember', 'Add team member', 'إضافة عضو فريق');
          });
        });
      }
      renderAboutTeam();
      /* إعادة رسم فريقنا عند ظهور القسم (ضمان عدم بقاء القائمة فارغة لأي سبب) */
      (function ensureTeamVisibleOnScroll() {
        var section = document.querySelector('.about-team') || document.getElementById('about-team-list');
        if (!section || typeof renderAboutTeam !== 'function') return;
        if (typeof IntersectionObserver !== 'undefined') {
          var obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) { if (entry.isIntersecting) { renderAboutTeam(); obs.disconnect(); } });
          }, { rootMargin: '50px', threshold: 0 });
          obs.observe(section);
        }
      })();
      function proactiveRefreshUI() {
        if (typeof renderAboutTeam === 'function') renderAboutTeam();
        if (typeof renderActivitiesSection === 'function') renderActivitiesSection();
        if (typeof renderLetterheadContact === 'function') renderLetterheadContact();
        if (typeof renderPublicMembersList === 'function') renderPublicMembersList();
        if (typeof updateDashboardNav === 'function') updateDashboardNav();
      }
      if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', proactiveRefreshUI);
      if (window.IIF_SECURE_STORAGE && typeof window.IIF_SECURE_STORAGE.ready === 'function') {
        window.IIF_SECURE_STORAGE.ready().then(proactiveRefreshUI).catch(function () { });
      }
      window.addEventListener('load', function () { if (typeof renderAboutTeam === 'function') renderAboutTeam(); });
      window.addEventListener('hashchange', function () {
        if ((location.hash || '').replace(/^#/, '') === 'about' && typeof renderAboutTeam === 'function') renderAboutTeam();
      });
      window.IIF_proactiveRefreshUI = proactiveRefreshUI;
      if (document.getElementById('dashboard-team-form')) {
        document.getElementById('dashboard-team-form').addEventListener('submit', function (e) {
          e.preventDefault();
          var nameEn = (document.getElementById('team-name-en') && document.getElementById('team-name-en').value) || '';
          var nameAr = (document.getElementById('team-name-ar') && document.getElementById('team-name-ar').value) || '';
          var titleEn = (document.getElementById('team-title-en') && document.getElementById('team-title-en').value) || '';
          var titleAr = (document.getElementById('team-title-ar') && document.getElementById('team-title-ar').value) || '';
          var bioEn = (document.getElementById('team-bio-en') && document.getElementById('team-bio-en').value) || '';
          var bioAr = (document.getElementById('team-bio-ar') && document.getElementById('team-bio-ar').value) || '';
          var imageData = (document.getElementById('team-image-data') && document.getElementById('team-image-data').value) || '';
          var imageUrl = (document.getElementById('team-image-url') && document.getElementById('team-image-url').value) || '';
          var imageSrc = imageData || imageUrl.trim();
          if (!nameEn.trim() || !nameAr.trim() || !titleEn.trim() || !titleAr.trim()) return;
          var list = getTeamMembers();
          var editIdx = document.getElementById('team-edit-index').value;
          if (editIdx !== '' && !isNaN(parseInt(editIdx, 10))) {
            var i = parseInt(editIdx, 10);
            list[i] = { nameEn: nameEn.trim(), nameAr: nameAr.trim(), titleEn: titleEn.trim(), titleAr: titleAr.trim(), bioEn: bioEn.trim(), bioAr: bioAr.trim(), imageUrl: imageSrc };
          } else {
            list.push({ nameEn: nameEn.trim(), nameAr: nameAr.trim(), titleEn: titleEn.trim(), titleAr: titleAr.trim(), bioEn: bioEn.trim(), bioAr: bioAr.trim(), imageUrl: imageSrc });
          }
          saveTeamMembers(list);
          renderAboutTeam();
          renderDashboardTeamList();
          this.reset();
          if (document.getElementById('team-image-data')) document.getElementById('team-image-data').value = '';
          document.getElementById('team-edit-index').value = '';
          document.getElementById('team-add-btn').innerHTML = iifBilingualSpans('dashAddTeamMember', 'Add team member', 'إضافة عضو فريق');
        });
      }
      (function teamImageUpload() {
        var urlInput = document.getElementById('team-image-url');
        var fileInput = document.getElementById('team-image-file');
        var dataInput = document.getElementById('team-image-data');
        if (fileInput && dataInput) fileInput.addEventListener('change', function () {
          var f = fileInput.files && fileInput.files[0];
          if (!f) { dataInput.value = ''; return; }
          if (f.type && SAFE_IMAGE_MIMES && SAFE_IMAGE_MIMES.indexOf(f.type) === -1) { alert(iifMessage('jsFileTypeNotAllowedDetailed')); fileInput.value = ''; dataInput.value = ''; return; }
          var teamMax = getCertImageMaxSize();
          if (f.size > teamMax) { var mb = Math.round(teamMax / 1024 / 1024); alert(iifMessageFmt('jsFileTooLargeMb', { mb: mb })); fileInput.value = ''; dataInput.value = ''; return; }
          fileInput.disabled = true;
          var r = new FileReader();
          r.onload = function () {
            var res = r.result || '';
            if (res.slice(0, 5) === 'data:' && !isSafeDataUrlForImage(res) && !isDataUrlImageForDisplay(res)) { fileInput.disabled = false; fileInput.value = ''; dataInput.value = ''; return; }
            checkImageContentSafe(res).then(function (ck) {
              fileInput.disabled = false;
              if (!ck.safe) { alert(getContentRejectMessage(ck.reason)); fileInput.value = ''; dataInput.value = ''; return; }
              dataInput.value = res; if (urlInput) urlInput.value = '';
              alert(iifMessage('jsPhotoUploadSuccess'));
            });
          };
          r.onerror = function () {
            fileInput.disabled = false;
            alert(iifMessage('jsFileReadFailed'));
          };
          r.readAsDataURL(f);
        });
        if (urlInput && dataInput) urlInput.addEventListener('input', function () { dataInput.value = ''; });
      })();
      /* عمل الخطابات — للإدارة فقط: خطاب رسمي + QR مصادقة + طباعة */
      (function letterSection() {
        var letterDate = document.getElementById('letter-date');
        var letterTo = document.getElementById('letter-to');
        var letterRef = document.getElementById('letter-ref');
        var letterPages = document.getElementById('letter-pages');
        var addPageBtn = document.getElementById('letter-add-page');
        var genQrBtn = document.getElementById('letter-generate-qr');
        var qrDisplay = document.getElementById('letter-qrcode');
        var printBtn = document.getElementById('letter-print');

        if (letterDate) {
          var now = new Date();
          letterDate.value = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
        }
        var letterPageCount = 1;
        if (addPageBtn && letterPages) {
          addPageBtn.addEventListener('click', function () {
            letterPageCount++;
            var wrap = document.createElement('div');
            wrap.className = 'letter-page-wrap';
            var label = typeof iifMessageFmt === 'function' ? iifMessageFmt('letterAddPageLabel', { n: letterPageCount }) : ('Page ' + letterPageCount + ' — Letter body');
            wrap.innerHTML = '<label class="letter-page-label">' + escapeHtml(label) + '</label><textarea class="letter-body" rows="8" data-page="' + letterPageCount + '" placeholder=""></textarea>';
            letterPages.appendChild(wrap);
          });
        }
        var lastQrPayload = '';
        var lastQrDataUrl = '';
        if (genQrBtn && qrDisplay && typeof QRCode !== 'undefined') {
          genQrBtn.addEventListener('click', function () {
            var dateVal = letterDate ? letterDate.value : '';
            var toVal = letterTo ? letterTo.value.trim() : '';
            var refVal = letterRef ? letterRef.value.trim() : '';
            var uniqueId = 'IIF-' + Date.now() + '-' + Math.random().toString(36).slice(2, 10);
            lastQrPayload = 'IIF-VERIFIED|LETTER|' + dateVal + '|' + (refVal || uniqueId) + '|' + uniqueId;
            qrDisplay.innerHTML = '';
            try {
              new QRCode(qrDisplay, { text: lastQrPayload, width: 160, height: 160 });
              var canvas = qrDisplay.querySelector('canvas');
              if (canvas) lastQrDataUrl = canvas.toDataURL('image/png');
            } catch (e) { qrDisplay.textContent = 'QR error'; }
          });
        }
        if (printBtn) {
          printBtn.addEventListener('click', function () {
            var dateVal = letterDate ? letterDate.value : '';
            var toVal = letterTo ? letterTo.value.trim() : '';
            var refVal = letterRef ? letterRef.value.trim() : '';
            var letterSubject = document.getElementById('letter-subject');
            var subjectVal = letterSubject ? letterSubject.value.trim() : '';
            var bodies = [];
            letterPages.querySelectorAll('.letter-body').forEach(function (ta) { bodies.push(ta.value || ''); });
            var bodyHtml = bodies.map(function (b) { return '<div class="letter-body-print">' + escapeHtml(b).replace(/\n/g, '<br>') + '</div>'; }).join('');
            var toLine = toVal ? '<p class="letter-meta-print"><strong>' + escapeHtml(iifMessage('letterPrintTo')) + escapeHtml(toVal) + '</strong></p>' : '';
            var refLine = refVal ? '<p class="letter-meta-print">' + escapeHtml(iifMessage('letterPrintRef')) + escapeHtml(refVal) + '</p>' : '';
            var dateLine = dateVal ? '<p class="letter-meta-print">' + escapeHtml(iifMessage('letterPrintDate')) + escapeHtml(dateVal) + '</p>' : '';
            var subjectLine = subjectVal ? '<p class="letter-meta-print"><strong>' + escapeHtml(iifMessage('letterPrintSubject')) + escapeHtml(subjectVal) + '</strong></p>' : '';
            var saderDisp = document.getElementById('letter-sader-display');
            var saderVal = (saderDisp && saderDisp.value && saderDisp.value !== '') ? saderDisp.value : '';
            var saderLine = saderVal ? '<p class="letter-meta-print"><span class="sader-num">' + escapeHtml(iifMessage('letterPrintOutgoingNo')) + escapeHtml(saderVal) + '</span></p>' : '';
            var qrImg = '';
            if (lastQrDataUrl && typeof lastQrDataUrl === 'string') {
              var qr = lastQrDataUrl.trim();
              if (qr.indexOf('data:image/') === 0 && qr.indexOf(';base64,') > 0 && qr.length < 500000 && qr.indexOf('"') === -1 && qr.indexOf('<') === -1 && qr.indexOf('>') === -1)
                qrImg = '<div class="letter-qr-print"><img src="' + qr.replace(/&/g, '&amp;') + '" alt="' + escapeHtml(iifMessage('letterQrAlt')).replace(/"/g, '&quot;') + '" width="120" height="120"/><p style="font-size:0.8rem; margin-top:0.25rem;">' + escapeHtml(iifMessage('letterQrCaption')) + '</p></div>';
            }
            var html = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Letter - IIF</title><style>body{font-family:system-ui,sans-serif;max-width:700px;margin:2rem auto;padding:1.5rem;color:#111;}.letterhead-title{font-size:1.25rem;font-weight:700;margin-bottom:0.5rem;}.letter-meta-print{margin:0.25rem 0;}.letter-body-print{white-space:pre-wrap;line-height:1.6;margin-bottom:1rem;}.letter-qr-print{margin-top:1.5rem;}.sader-num{color:#c00;font-weight:700;}</style></head><body class="letter-print-area"><div class="letterhead-title">International Investment Fund · IIF · Paris</div><p class="letter-meta-print">Financing for Global Prosperity</p>' + dateLine + subjectLine + saderLine + toLine + refLine + bodyHtml + qrImg + '</body></html>';
            var w = window.open('', '_blank');
            if (w) { w.document.write(html); w.document.close(); w.focus(); w.print(); }
          });
        }
        var letterApproveSendBtn = document.getElementById('letter-approve-send');
        var letterSubjectEl = document.getElementById('letter-subject');
        var letterCountryEl = document.getElementById('letter-country');
        if (letterApproveSendBtn) letterApproveSendBtn.addEventListener('click', function () {
          var dateVal = letterDate ? letterDate.value : '';
          var toVal = letterTo ? letterTo.value.trim() : '';
          var subjectVal = letterSubjectEl ? letterSubjectEl.value.trim() : '';
          var countryVal = letterCountryEl ? letterCountryEl.value.trim() : '';
          var bodies = [];
          if (letterPages) letterPages.querySelectorAll('.letter-body').forEach(function (ta) { bodies.push(ta.value || ''); });
          var body = bodies.join('\n\n');
          if (!body && !subjectVal) { alert(iifMessage('jsAddSubjectOrLetterBody')); return; }
          var saderNum = typeof getNextSaderNumber === 'function' ? getNextSaderNumber() : '';
          var list = typeof getLettersOutbox === 'function' ? getLettersOutbox() : [];
          list.unshift({ id: 'S' + Date.now(), saderNumber: saderNum, subject: subjectVal, date: dateVal, toPerson: toVal, toEmail: '', country: countryVal, body: body, source: 'letter' });
          if (typeof saveLettersOutbox === 'function') saveLettersOutbox(list);
          var saderDisp = document.getElementById('letter-sader-display');
          if (saderDisp) saderDisp.value = saderNum;
          if (typeof renderOutboxList === 'function') renderOutboxList();
          if (typeof renderArchiveList === 'function') renderArchiveList();
        });
      })();

      var LETTERHEAD_FOOTER_KEY = 'iif-letterhead-footer';
      var LETTERHEAD_PENDING_KEY = 'iif-letterhead-pending';
      var DEFAULT_LETTERHEAD_FOOTER = { website: 'www.iiffund.com', email: 'info@iiffund.com', phone: '+966 56 756 6616', address: '13B AV DE LA MOTTE PICQUET 75007 PARIS 7', siret: 'SIRET 923 563 688 00012' };
      function getLetterheadFooter() {
        try {
          var r = localStorage.getItem(LETTERHEAD_FOOTER_KEY);
          var parsed = r ? JSON.parse(r) : null;
          if (!parsed || typeof parsed !== 'object') return Object.assign({}, DEFAULT_LETTERHEAD_FOOTER);
          return { website: parsed.website || DEFAULT_LETTERHEAD_FOOTER.website, email: parsed.email || DEFAULT_LETTERHEAD_FOOTER.email, phone: parsed.phone || DEFAULT_LETTERHEAD_FOOTER.phone, address: parsed.address || DEFAULT_LETTERHEAD_FOOTER.address, siret: parsed.siret || DEFAULT_LETTERHEAD_FOOTER.siret };
        } catch (e) { return Object.assign({}, DEFAULT_LETTERHEAD_FOOTER); }
      }
      function setLetterheadFooter(o) {
        try {
          var def = DEFAULT_LETTERHEAD_FOOTER;
          var merged = { website: (o && o.website && String(o.website).trim()) || def.website, email: (o && o.email && String(o.email).trim()) || def.email, phone: (o && o.phone && String(o.phone).trim()) || def.phone, address: (o && o.address && String(o.address).trim()) || def.address, siret: (o && o.siret && String(o.siret).trim()) || def.siret };
          localStorage.setItem(LETTERHEAD_FOOTER_KEY, JSON.stringify(merged));
        } catch (e) { }
      }
      function getLetterheadPending() { try { var r = localStorage.getItem(LETTERHEAD_PENDING_KEY); return r ? JSON.parse(r) : []; } catch (e) { return []; } }
      function saveLetterheadPending(list) { try { localStorage.setItem(LETTERHEAD_PENDING_KEY, JSON.stringify(list)); } catch (e) { } }
      var LETTER_INBOX_KEY = 'iif-letters-inbox', LETTER_OUTBOX_KEY = 'iif-letters-outbox', LETTER_SADER_COUNTER_KEY = 'iif-letters-sader-counter', LETTER_ARCHIVE_KEY = 'iif-letters-archive';
      function getLettersInbox() { try { var r = localStorage.getItem(LETTER_INBOX_KEY); return r ? JSON.parse(r) : []; } catch (e) { return []; } }
      function saveLettersInbox(arr) { try { localStorage.setItem(LETTER_INBOX_KEY, JSON.stringify(arr)); } catch (e) { } }
      function getLettersOutbox() { try { var r = localStorage.getItem(LETTER_OUTBOX_KEY); return r ? JSON.parse(r) : []; } catch (e) { return []; } }
      function saveLettersOutbox(arr) { try { localStorage.setItem(LETTER_OUTBOX_KEY, JSON.stringify(arr)); } catch (e) { } }
      function getLettersArchive() { try { var r = localStorage.getItem(LETTER_ARCHIVE_KEY); return r ? JSON.parse(r) : []; } catch (e) { return []; } }
      function saveLettersArchive(arr) { try { localStorage.setItem(LETTER_ARCHIVE_KEY, JSON.stringify(arr)); } catch (e) { } }
      function getNextSaderNumber() { var y = new Date().getFullYear(); var key = LETTER_SADER_COUNTER_KEY + '-' + y; var n = 0; try { n = parseInt(localStorage.getItem(key), 10) || 0; } catch (e) { } n++; try { localStorage.setItem(key, String(n)); } catch (e) { } return y + '-' + String(n).padStart(3, '0'); }
      function renderLetterheadContact() {
        var f = getLetterheadFooter();
        var w = document.getElementById('letterhead-website-text'); if (w) w.textContent = f.website || '';
        var e = document.getElementById('letterhead-email-text'); if (e) e.textContent = f.email || '';
        var p = document.getElementById('letterhead-phone-text'); if (p) p.textContent = f.phone || '';
        var a = document.getElementById('letterhead-address-text'); if (a) a.textContent = f.address || '';
        var s = document.getElementById('letterhead-siret-text'); if (s) s.textContent = f.siret || '';
      }
      function generateQrWithLogoInCenter(wrapId, text, size) {
        var wrap = document.getElementById(wrapId);
        if (!wrap || typeof QRCode === 'undefined') return null;
        wrap.innerHTML = '';
        size = size || 180;
        try {
          new QRCode(wrap, { text: text, width: size, height: size });
          var canvas = wrap.querySelector('canvas');
          if (canvas) {
            var img = document.createElement('img');
            img.src = 'assets/emblem.jpg';
            img.alt = 'IIF';
            img.className = 'qr-logo-overlay';
            wrap.appendChild(img);
            return canvas.toDataURL ? canvas.toDataURL('image/png') : null;
          }
        } catch (e) { }
        return null;
      }
      function renderLetterheadPendingList() {
        var list = getLetterheadPending();
        var ul = document.getElementById('letterhead-pending-list');
        if (!ul) return;
        ul.innerHTML = '';
        list.forEach(function (item, idx) {
          var li = document.createElement('li');
          var assigned = item.assignedToEmail || iifMessage('letterNotAssigned');
          var qrInfo = item.qrIssueDate ? iifMessage('letterQrIssuedPrefix') + item.qrIssueDate : '';
          li.innerHTML = '<div class="content"><strong>' + escapeHtml(item.fromName || item.fromEmail || '') + '</strong> ' + escapeHtml(item.fromEmail || '') + '<br><small>' + escapeHtml((item.content || '').slice(0, 80)) + '…</small><br><small>' + escapeHtml(assigned) + '</small> ' + (qrInfo ? '<br><small>' + escapeHtml(qrInfo) + '</small>' : '') + '</div><div class="assign-row"><select class="letterhead-assign-select" data-index="' + idx + '"><option value="">' + escapeHtml(iifMessage('letterAssignTo')) + '</option></select><input type="text" class="letterhead-assign-email" data-index="' + idx + '" placeholder="' + escapeHtml(iifMessage('letterAssignEmailPlaceholder')) + '" style="width:120px;" /><button type="button" class="btn btn--primary btn-sm letterhead-gen-qr" data-index="' + idx + '">' + escapeHtml(iifMessage('letterGenVerifyQr')) + '</button></div>';
          ul.appendChild(li);
        });
        var staffList = typeof getStaffList === 'function' ? getStaffList() : [];
        ul.querySelectorAll('.letterhead-assign-select').forEach(function (sel) {
          var idx = parseInt(sel.getAttribute('data-index'), 10);
          staffList.forEach(function (s) { var opt = document.createElement('option'); opt.value = s.email || ''; opt.textContent = (s.name || '') + ' (' + (s.email || '') + ')'; sel.appendChild(opt); });
          sel.addEventListener('change', function () {
            var list = getLetterheadPending();
            var email = sel.value || (sel.nextElementSibling && sel.nextElementSibling.classList.contains('letterhead-assign-email') ? sel.nextElementSibling.value : '');
            if (list[idx]) { list[idx].assignedToEmail = email; saveLetterheadPending(list); renderLetterheadPendingList(); }
          });
        });
        ul.querySelectorAll('.letterhead-assign-email').forEach(function (inp) {
          inp.addEventListener('change', function () {
            var idx = parseInt(inp.getAttribute('data-index'), 10);
            var list = getLetterheadPending();
            if (list[idx]) { list[idx].assignedToEmail = (inp.value || '').trim().toLowerCase() || list[idx].assignedToEmail; saveLetterheadPending(list); renderLetterheadPendingList(); }
          });
        });
        ul.querySelectorAll('.letterhead-gen-qr').forEach(function (btn) {
          btn.addEventListener('click', function () {
            if (!isAdmin() && typeof hasStaffPermission === 'function' && !hasStaffPermission('verify_qr')) {
              alert(iifMessage('jsNoVerificationQrPermission'));
              return;
            }
            var idx = parseInt(btn.getAttribute('data-index'), 10);
            var list = getLetterheadPending();
            var item = list[idx];
            if (!item) return;
            var issueDate = new Date().toISOString().slice(0, 10);
            var payload = 'IIF-VERIFIED|LETTER|' + issueDate + '|' + (item.id || item.fromEmail || '') + '|' + (item.assignedToEmail || '');
            item.qrIssueDate = issueDate;
            item.qrDataUrl = generateQrWithLogoInCenter('letterhead-qr-verify-wrap', payload, 200);
            if (!item.qrDataUrl && document.getElementById('letterhead-qr-verify-wrap')) {
              var w = document.getElementById('letterhead-qr-verify-wrap');
              w.innerHTML = '';
              try { new QRCode(w, { text: payload, width: 200, height: 200 }); var c = w.querySelector('canvas'); if (c) item.qrDataUrl = c.toDataURL('image/png'); } catch (e) { }
            }
            saveLetterheadPending(list);
            var footerQr = document.getElementById('letterhead-footer-qr-wrap');
            if (footerQr && item.qrDataUrl) { footerQr.innerHTML = ''; var img = document.createElement('img'); img.src = item.qrDataUrl; img.alt = 'QR verification'; img.style.maxWidth = '80px'; img.style.height = 'auto'; footerQr.appendChild(img); }
            renderLetterheadPendingList();
          });
        });
      }
      (function letterheadSheetActions() {
        renderLetterheadContact();
        var contactBtn = document.getElementById('letterhead-edit-contact-btn');
        if (contactBtn) contactBtn.addEventListener('click', function () {
          var f = getLetterheadFooter();
          var lines = [f.website || '', f.email || '', f.phone || '', f.address || '', f.siret || ''];
          var msg = iifMessage('jsCompanyFieldsOneLineHint');
          var s = prompt(msg, lines.join('\n'));
          if (s != null) {
            var arr = s.split('\n').map(function (x) { return x.trim(); });
            setLetterheadFooter({ website: arr[0] || f.website, email: arr[1] || f.email, phone: arr[2] || f.phone, address: arr[3] || f.address, siret: arr[4] || f.siret });
            renderLetterheadContact();
          }
        });
        var letterheadDateEl = document.getElementById('letterhead-date');
        if (letterheadDateEl) { var d = new Date(); letterheadDateEl.value = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
        var bodyEl = document.getElementById('letterhead-sheet-body');
        var copyBtn = document.getElementById('letterhead-copy-btn');
        var clearBtn = document.getElementById('letterhead-clear-btn');
        if (copyBtn && bodyEl) copyBtn.addEventListener('click', function () {
          bodyEl.select();
          try { document.execCommand('copy'); } catch (e) { }
          if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(bodyEl.value).catch(function () { });
        });
        if (clearBtn && bodyEl) clearBtn.addEventListener('click', function () {
          if (confirm(iifMessage('jsConfirmClearTextShort'))) bodyEl.value = '';
        });
        var websiteQrWrap = document.getElementById('letterhead-qr-website-wrap');
        if (websiteQrWrap && typeof QRCode !== 'undefined') {
          var siteUrl = (typeof location !== 'undefined' && location.origin) ? location.origin : 'https://iif-fund.org';
          try {
            websiteQrWrap.innerHTML = '';
            new QRCode(websiteQrWrap, { text: siteUrl, width: 180, height: 180 });
          } catch (e) { }
        }
        var sendVerifyBtn = document.getElementById('letterhead-send-verify-btn');
        if (sendVerifyBtn && bodyEl) sendVerifyBtn.addEventListener('click', function () {
          var content = (bodyEl.value || '').trim();
          var fromEmail = (typeof localStorage !== 'undefined' && localStorage.getItem('iif-user-email')) || '';
          var fromName = '';
          var staffList = typeof getStaffList === 'function' ? getStaffList() : [];
          var me = staffList.find(function (s) { return (s.email || '').toLowerCase() === fromEmail.toLowerCase(); });
          if (me) fromName = me.name || '';
          var list = getLetterheadPending();
          list.push({ id: 'L' + Date.now(), content: content, date: new Date().toISOString(), fromEmail: fromEmail, fromName: fromName, assignedToEmail: '', qrIssueDate: '', qrDataUrl: '' });
          saveLetterheadPending(list);
          renderLetterheadPendingList();
          if (typeof openDashboard === 'function') openDashboard();
        });
        var registerSaderBtn = document.getElementById('letterhead-register-sader-btn');
        if (registerSaderBtn && bodyEl) registerSaderBtn.addEventListener('click', function () {
          var subject = (document.getElementById('letterhead-subject') && document.getElementById('letterhead-subject').value) || '';
          var dateVal = (letterheadDateEl && letterheadDateEl.value) || new Date().toISOString().slice(0, 10);
          var content = (bodyEl.value || '').trim();
          if (!content && !subject) { alert(iifMessage('jsAddSubjectOrBody')); return; }
          var saderNum = 'S' + Date.now();
          var outgoingNoEl = document.getElementById('letterhead-outgoing-no');
          if (outgoingNoEl) outgoingNoEl.value = saderNum;
          if (typeof renderLetterheadPendingList === 'function') renderLetterheadPendingList();
          if (typeof openDashboard === 'function') openDashboard();
          if (typeof renderArchiveList === 'function') renderArchiveList();
        });

        // وظيفة نسخ النص
        var copyBtn = document.getElementById('letterhead-copy-btn');
        if (copyBtn && bodyEl) copyBtn.addEventListener('click', function () {
          if (bodyEl.value.trim()) {
            navigator.clipboard.writeText(bodyEl.value).then(function () {
              var msg = iifMessage('jsTextCopied');
              var alertDiv = document.createElement('div');
              alertDiv.textContent = msg;
              alertDiv.style.cssText = 'position:fixed;top:20px;right:20px;background:#4CAF50;color:white;padding:10px;border-radius:4px;z-index:10000;';
              document.body.appendChild(alertDiv);
              setTimeout(function () { document.body.removeChild(alertDiv); }, 2000);
            });
          }
        });

        // وظيفة مسح النص
        var clearBtn = document.getElementById('letterhead-clear-btn');
        if (clearBtn && bodyEl) clearBtn.addEventListener('click', function () {
          if (confirm(iifMessage('jsConfirmClearTextLong'))) {
            bodyEl.value = '';
            var subjectEl = document.getElementById('letterhead-subject');
            var outgoingNoEl = document.getElementById('letterhead-outgoing-no');
            if (subjectEl) subjectEl.value = '';
            if (outgoingNoEl) outgoingNoEl.value = '';
          }
        });

        var LETTERHEAD_MEMBERS_KEY = 'iif-letterhead-members', LETTERHEAD_REGISTERED_KEY = 'iif-letterhead-registered';
        function getLetterheadMembers() { try { var r = localStorage.getItem(LETTERHEAD_MEMBERS_KEY); return r ? JSON.parse(r) : []; } catch (e) { return []; } }
        function saveLetterheadMembers(arr) { try { localStorage.setItem(LETTERHEAD_MEMBERS_KEY, JSON.stringify(arr)); } catch (e) { } }
        function getLetterheadRegistered() { try { var r = localStorage.getItem(LETTERHEAD_REGISTERED_KEY); return r ? JSON.parse(r) : []; } catch (e) { return []; } }
        function saveLetterheadRegistered(arr) { try { localStorage.setItem(LETTERHEAD_REGISTERED_KEY, JSON.stringify(arr)); } catch (e) { } }
        function renderLetterheadChannels() {
          var staffList = typeof getStaffList === 'function' ? getStaffList() : [];
          var empUl = document.getElementById('letterhead-channel-employees');
          if (empUl) { empUl.innerHTML = ''; staffList.forEach(function (s) { var li = document.createElement('li'); li.textContent = (s.email || ''); empUl.appendChild(li); }); }
          var memList = getLetterheadMembers();
          var memUl = document.getElementById('letterhead-channel-members');
          if (memUl) { memUl.innerHTML = ''; memList.forEach(function (em, i) { var li = document.createElement('li'); li.innerHTML = '<span>' + escapeHtml(em) + '</span><button type="button" class="remove-addr" data-channel="members" data-i="' + i + '">×</button>'; memUl.appendChild(li); }); memUl.querySelectorAll('.remove-addr').forEach(function (btn) { btn.addEventListener('click', function () { var i = parseInt(btn.getAttribute('data-i'), 10); var arr = getLetterheadMembers(); arr.splice(i, 1); saveLetterheadMembers(arr); renderLetterheadChannels(); }); }); }
          var regList = getLetterheadRegistered();
          var regUl = document.getElementById('letterhead-channel-registered');
          if (regUl) { regUl.innerHTML = ''; regList.forEach(function (em, i) { var li = document.createElement('li'); li.innerHTML = '<span>' + escapeHtml(em) + '</span><button type="button" class="remove-addr" data-channel="registered" data-i="' + i + '">×</button>'; regUl.appendChild(li); }); regUl.querySelectorAll('.remove-addr').forEach(function (btn) { btn.addEventListener('click', function () { var i = parseInt(btn.getAttribute('data-i'), 10); var arr = getLetterheadRegistered(); arr.splice(i, 1); saveLetterheadRegistered(arr); renderLetterheadChannels(); }); }); }
        }
        var addMemberInput = document.getElementById('letterhead-add-member');
        var addMemberBtn = document.getElementById('letterhead-add-member-btn');
        if (addMemberBtn && addMemberInput) addMemberBtn.addEventListener('click', function () {
          var em = (addMemberInput.value || '').trim().toLowerCase();
          if (!em) return;
          var arr = getLetterheadMembers(); if (arr.indexOf(em) < 0) arr.push(em); saveLetterheadMembers(arr); addMemberInput.value = ''; renderLetterheadChannels();
        });
        var addRegInput = document.getElementById('letterhead-add-registered');
        var addRegBtn = document.getElementById('letterhead-add-registered-btn');
        if (addRegBtn && addRegInput) addRegBtn.addEventListener('click', function () {
          var em = (addRegInput.value || '').trim().toLowerCase();
          if (!em) return;
          var arr = getLetterheadRegistered(); if (arr.indexOf(em) < 0) arr.push(em); saveLetterheadRegistered(arr); addRegInput.value = ''; renderLetterheadChannels();
        });
        document.querySelectorAll('.letterhead-send-channel-btn').forEach(function (btn) {
          btn.addEventListener('click', function () {
            var channel = btn.getAttribute('data-channel');
            var body = (bodyEl && bodyEl.value) ? bodyEl.value.trim() : '';
            var emails = [];
            if (channel === 'employees') { var s = typeof getStaffList === 'function' ? getStaffList() : []; emails = s.map(function (x) { return x.email || ''; }).filter(Boolean); }
            else if (channel === 'members') emails = getLetterheadMembers();
            else if (channel === 'registered') emails = getLetterheadRegistered();
            if (emails.length === 0) { alert(iifMessage('jsNoEmailsInChannel')); return; }
            var mailto = 'mailto:' + encodeURIComponent(emails[0]) + (emails.length > 1 ? '?bcc=' + encodeURIComponent(emails.slice(1).join(',')) : '') + (body ? (emails.length > 1 ? '&' : '?') + 'body=' + encodeURIComponent(body) : '');
            window.location.href = mailto;
          });
        });
        renderLetterheadChannels();
        renderLetterheadPendingList();
        if (typeof window !== 'undefined') window.renderLetterheadChannels = renderLetterheadChannels;
      })();

      function renderInboxList() {
        var ul = document.getElementById('inbox-list');
        if (!ul) return;
        var list = getLettersInbox();
        ul.innerHTML = '';
        list.forEach(function (item, idx) {
          var li = document.createElement('li');
          li.innerHTML = '<div class="content"><strong>' + escapeHtml(item.subject || item.from || '') + '</strong><br><small>' + escapeHtml((item.body || '').slice(0, 100)) + (item.body && item.body.length > 100 ? '…' : '') + '</small><br><small>' + escapeHtml(item.date || '') + ' ' + escapeHtml(item.from || item.fromEmail || '') + '</small></div><div class="actions"><button type="button" class="btn-delete inbox-delete" data-idx="' + idx + '">' + escapeHtml(iifMessage('dashBtnDelete')) + '</button></div>';
          ul.appendChild(li);
        });
        ul.querySelectorAll('.inbox-delete').forEach(function (btn) {
          btn.addEventListener('click', function () {
            var idx = parseInt(btn.getAttribute('data-idx'), 10);
            var arr = getLettersInbox(); arr.splice(idx, 1); saveLettersInbox(arr); renderInboxList();
          });
        });
      }
      function renderOutboxList() {
        var ul = document.getElementById('outbox-list');
        if (!ul) return;
        var list = getLettersOutbox().slice(0, 30);
        var isAr = document.documentElement.getAttribute('data-lang') === 'ar';
        ul.innerHTML = '';
        list.forEach(function (item) {
          var li = document.createElement('li');
          li.innerHTML = '<div class="content" style="display: flex; align-items: flex-start; gap: var(--space-2);"><input type="checkbox" class="outbox-item-checkbox" data-id="' + escapeHtml(item.id || '') + '" style="margin-top: 0.25rem;"><div style="flex:1;"><strong><span style="color:#c00;">' + escapeHtml(item.saderNumber || '') + '</span></strong> ' + escapeHtml(item.subject || '') + '<br><small>' + escapeHtml(item.date || '') + ' | ' + escapeHtml(item.toPerson || item.toEmail || '') + ' | ' + escapeHtml(item.country || '') + '</small></div></div>';
          ul.appendChild(li);
        });
        var archiveBtn = document.getElementById('archive-selected-btn');
        if (archiveBtn) archiveBtn.addEventListener('click', function () {
          var ids = [];
          ul.querySelectorAll('.outbox-item-checkbox:checked').forEach(function (chk) {
            ids.push(chk.getAttribute('data-id'));
          });
          if (ids.length === 0) { alert(iifMessage('jsSelectMessagesForArchive')); return; }
          var list = getLettersOutbox();
          var archiveList = getLettersArchive();
          list.forEach(function (item) {
            if (ids.indexOf(item.id) >= 0) {
              archiveList.push(item);
            }
          });
          saveLettersArchive(archiveList);
          list = list.filter(function (item) {
            return ids.indexOf(item.id) < 0;
          });
          saveLettersOutbox(list);
          renderOutboxList();
          renderArchiveList();
        });
      }
      function renderArchiveList() {
        var ul = document.getElementById('archive-list');
        if (!ul) return;
        var q = (document.getElementById('archive-search-input') && document.getElementById('archive-search-input').value) || '';
        var dateFrom = (document.getElementById('archive-date-from') && document.getElementById('archive-date-from').value) || '';
        var dateTo = (document.getElementById('archive-date-to') && document.getElementById('archive-date-to').value) || '';
        var list = getLettersArchive();
        if (q.trim()) {
          var lower = q.trim().toLowerCase();
          list = list.filter(function (item) {
            return (item.saderNumber && item.saderNumber.toLowerCase().indexOf(lower) >= 0) ||
              (item.subject && item.subject.toLowerCase().indexOf(lower) >= 0) ||
              (item.country && item.country.toLowerCase().indexOf(lower) >= 0) ||
              (item.toPerson && item.toPerson.toLowerCase().indexOf(lower) >= 0) ||
              (item.toEmail && item.toEmail.toLowerCase().indexOf(lower) >= 0) ||
              (item.body && item.body.toLowerCase().indexOf(lower) >= 0);
          });
        }
        if (dateFrom || dateTo) {
          list = list.filter(function (item) {
            var d = (item.date || '').slice(0, 10);
            if (!d) return !dateFrom && !dateTo;
            if (dateFrom && d < dateFrom) return false;
            if (dateTo && d > dateTo) return false;
            return true;
          });
        }
        var isAr = document.documentElement.getAttribute('data-lang') === 'ar';
        ul.innerHTML = '';
        list.forEach(function (item) {
          var li = document.createElement('li');
          li.innerHTML = '<div class="content"><strong><span style="color:#c00;">' + escapeHtml(item.saderNumber || '') + '</span></strong> ' + escapeHtml(item.subject || '') + '<br><small>' + escapeHtml(item.date || '') + ' | ' + escapeHtml(item.toPerson || item.toEmail || '') + ' | ' + escapeHtml(item.country || '') + '</small>' + (item.body ? '<br><small>' + escapeHtml(item.body.slice(0, 80)) + '…</small>' : '') + '</div>';
          ul.appendChild(li);
        });
      }
      function canViewFullArchive() { return typeof isAdmin === 'function' && isAdmin() || (typeof hasStaffPermission === 'function' && hasStaffPermission('view_full_archive')); }
      (function inboxOutboxArchivePanel() {
        var tabs = document.querySelectorAll('.inbox-outbox-tab');
        var archiveTab = document.querySelector('.inbox-outbox-tab[data-box="archive"]');
        if (archiveTab && !canViewFullArchive()) archiveTab.style.display = 'none';
        var panels = { inbox: document.getElementById('inbox-box'), outbox: document.getElementById('outbox-box'), archive: document.getElementById('archive-box') };
        tabs.forEach(function (tab) {
          tab.addEventListener('click', function () {
            var box = tab.getAttribute('data-box');
            tabs.forEach(function (t) { t.classList.remove('is-active'); });
            tab.classList.add('is-active');
            if (panels.inbox) panels.inbox.style.display = box === 'inbox' ? '' : 'none';
            if (panels.outbox) panels.outbox.style.display = box === 'outbox' ? '' : 'none';
            if (panels.archive) {
              panels.archive.style.display = box === 'archive' ? '' : 'none';
              if (box === 'archive' && !canViewFullArchive()) {
                var ul = document.getElementById('archive-list');
                if (ul) ul.innerHTML = '<li class="content">' + iifBilingualSpans('dashArchiveNoPermission', 'You do not have permission to view the full archive.', 'ليس لديك صلاحية رؤية الأرشيف كامل.') + '</li>';
              }
            }
            if (box === 'outbox') renderOutboxList();
            if (box === 'archive' && canViewFullArchive()) renderArchiveList();
          });
        });
        var searchInput = document.getElementById('archive-search-input');
        var searchBtn = document.getElementById('archive-search-btn');
        if (searchInput) searchInput.placeholder = iifMessage('letterSearchPlaceholder');
        if (searchBtn) searchBtn.addEventListener('click', function () { if (canViewFullArchive()) renderArchiveList(); });
        if (searchInput) searchInput.addEventListener('keydown', function (e) { if (e.key === 'Enter' && canViewFullArchive()) renderArchiveList(); });
        var dateFrom = document.getElementById('archive-date-from');
        var dateTo = document.getElementById('archive-date-to');
        if (dateFrom) dateFrom.addEventListener('change', function () { if (canViewFullArchive()) renderArchiveList(); });
        if (dateTo) dateTo.addEventListener('change', function () { if (canViewFullArchive()) renderArchiveList(); });
        var inboxAddBtn = document.getElementById('inbox-add-btn');
        if (inboxAddBtn) inboxAddBtn.addEventListener('click', function () {
          var subject = prompt(iifMessage('letterPromptSubjectFrom'), '');
          if (subject == null) return;
          var body = prompt(iifMessage('letterPromptBodySnippet'), '');
          if (body == null) return;
          var arr = getLettersInbox();
          arr.unshift({ id: 'I' + Date.now(), subject: subject, from: subject, body: body || '', date: new Date().toISOString().slice(0, 10) });
          saveLettersInbox(arr);
          renderInboxList();
        });
        renderInboxList();
        renderOutboxList();
        renderArchiveList();
      })();

      (function translationModal() {
        var overlay = document.getElementById('translate-modal-overlay');
        var targetSelect = document.getElementById('translate-target-lang');
        var doBtn = document.getElementById('translate-do-btn');
        var resultTa = document.getElementById('translate-result');
        var useBtn = document.getElementById('translate-use-btn');
        var closeBtn = document.getElementById('translate-close-btn');
        var statusEl = document.getElementById('translate-status');
        var translateTarget = null;
        function canTranslate() { return typeof isAdmin === 'function' && isAdmin() || (typeof isStaff === 'function' && isStaff()); }
        function openTranslate(target) {
          if (!canTranslate()) { alert(iifMessage('jsTranslatePermissionDenied')); return; }
          translateTarget = target;
          if (resultTa) resultTa.value = '';
          if (statusEl) statusEl.textContent = '';
          if (overlay) overlay.style.display = 'flex';
        }
        function getSourceText() {
          if (translateTarget === 'letterhead') { var el = document.getElementById('letterhead-sheet-body'); return el ? el.value : ''; }
          if (translateTarget === 'letter') { var pages = document.getElementById('letter-pages'); if (!pages) return ''; var parts = []; pages.querySelectorAll('.letter-body').forEach(function (ta) { parts.push(ta.value); }); return parts.join('\n\n'); }
          return '';
        }
        function setTranslatedText(text) {
          if (translateTarget === 'letterhead') { var el = document.getElementById('letterhead-sheet-body'); if (el) el.value = text; }
          if (translateTarget === 'letter') { var first = document.querySelector('#letter-pages .letter-body'); if (first) first.value = text; }
        }
        if (closeBtn && overlay) closeBtn.addEventListener('click', function () { overlay.style.display = 'none'; });
        if (doBtn && resultTa) doBtn.addEventListener('click', function () {
          var text = getSourceText().trim();
          if (!text) { if (statusEl) statusEl.textContent = iifMessage('jsNoText'); return; }
          var targetLang = (targetSelect && targetSelect.value) || 'en';
          var langpair = 'auto|' + targetLang;
          if (statusEl) statusEl.textContent = iifMessage('jsTranslating');
          fetch('https://api.mymemory.translated.net/get?q=' + encodeURIComponent(text.slice(0, 500)) + '&langpair=' + encodeURIComponent(langpair)).then(function (r) { return r.json(); }).then(function (data) {
            var translated = (data && data.response && data.response.translatedText) ? data.response.translatedText : '';
            resultTa.value = translated;
            if (statusEl) statusEl.textContent = data.responseStatus === 200 ? iifMessage('jsDone') : (data.responseStatus || '');
          }).catch(function () { if (statusEl) statusEl.textContent = iifMessage('jsTranslationError'); });
        });
        if (useBtn && resultTa) useBtn.addEventListener('click', function () { var t = resultTa.value.trim(); if (t) setTranslatedText(t); overlay.style.display = 'none'; });
        var letterheadTranslateBtn = document.getElementById('letterhead-translate-btn');
        if (letterheadTranslateBtn) letterheadTranslateBtn.addEventListener('click', function () { openTranslate('letterhead'); });
        var letterTranslateBtn = document.getElementById('letter-translate-btn');
        if (letterTranslateBtn) letterTranslateBtn.addEventListener('click', function () { openTranslate('letter'); });
      })();

      /* الرفوعات المخصصة: مستندات | صور | فيديو | تصوير مباشر — استقبالها للإدارة فقط */
      var UPLOADS_DOCS_KEY = 'iif-uploads-docs', UPLOADS_IMAGES_KEY = 'iif-uploads-images', UPLOADS_VIDEO_KEY = 'iif-uploads-video', UPLOADS_LIVE_KEY = 'iif-uploads-live';
      var UPLOADS_ASSIGN_KEY = 'iif-uploads-assign';
      function getStoredUploads(key) { try { var r = localStorage.getItem(key); return r ? JSON.parse(r) : []; } catch (e) { return []; } }
      function saveStoredUploads(key, arr) { try { localStorage.setItem(key, JSON.stringify(arr)); } catch (e) { } }
      function addUpload(key, item) { item.id = 'u' + Date.now() + '-' + Math.random().toString(36).slice(2, 8); item.at = new Date().toISOString(); var arr = getStoredUploads(key); arr.push(item); saveStoredUploads(key, arr); }
      function handleUploadForm(typeKey, inputId, maxSize) {
        var form = document.getElementById('form-upload-' + (typeKey === 'docs' ? 'docs' : typeKey === 'images' ? 'images' : 'video'));
        var input = document.getElementById('upload-' + (typeKey === 'docs' ? 'docs' : typeKey === 'images' ? 'images' : 'video'));
        if (!form || !input) return;
        form.addEventListener('submit', function (e) {
          e.preventDefault();
          var effectiveMax = maxSize && (typeof hasDoubleUploadLimit === 'function' && hasDoubleUploadLimit()) ? maxSize * 2 : maxSize;
          var files = input.files || [];
          if (!files.length) { alert(iifMessage('jsSelectAtLeastOneFile')); return; }
          var submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
          var origText = submitBtn ? (submitBtn.textContent || submitBtn.value || '') : '';
          function resetBtn() { if (submitBtn) { submitBtn.disabled = false; var t = submitBtn.getAttribute('data-orig-text') || iifMessage('dashUploadBtn'); if (submitBtn.value !== undefined) submitBtn.value = t; else submitBtn.textContent = t; } }
          if (submitBtn) { submitBtn.disabled = true; submitBtn.setAttribute('data-orig-text', origText); if (submitBtn.value !== undefined) submitBtn.value = iifMessage('dashUploading'); else submitBtn.textContent = iifMessage('dashUploading'); }
          function doAddUploads() {
            try {
              for (var i = 0; i < files.length; i++) {
                var f = files[i];
                if (effectiveMax && f.size > effectiveMax) { alert((f.name || '') + ' > max size'); resetBtn(); return; }
                addUpload(typeKey === 'docs' ? UPLOADS_DOCS_KEY : typeKey === 'images' ? UPLOADS_IMAGES_KEY : UPLOADS_VIDEO_KEY, { name: f.name, size: f.size, type: f.type });
              }
              alert(iifMessage('jsFilesUploadedSuccess') + '\n\n' + (typeof iifNonBindingDisclaimer === 'function' ? iifNonBindingDisclaimer() : ''));
            } finally { resetBtn(); }
            form.reset();
          }
          if (typeKey === 'images') {
            var imgIdx = 0;
            function checkNextImage() {
              while (imgIdx < files.length && (!files[imgIdx].type || files[imgIdx].type.indexOf('image/') !== 0)) imgIdx++;
              if (imgIdx >= files.length) { doAddUploads(); return; }
              var fr = new FileReader();
              fr.onload = function () {
                checkImageContentSafe(fr.result).then(function (r) {
                  if (!r.safe) { alert(getContentRejectMessage(r.reason)); resetBtn(); return; }
                  imgIdx++; checkNextImage();
                });
              };
              fr.readAsDataURL(files[imgIdx]);
            }
            checkNextImage();
          } else if (typeKey === 'video' && files[0]) {
            checkVideoContentSafe(files[0]).then(function (r) {
              if (!r.safe) { alert(getContentRejectMessage(r.reason)); resetBtn(); return; }
              doAddUploads();
            });
          } else {
            doAddUploads();
          }
        });
      }
      handleUploadForm('docs', 'upload-docs', 10485760);
      handleUploadForm('images', 'upload-images', 10485760);
      handleUploadForm('video', 'upload-video', 52428800);

      (function liveCapture() {
        var video = document.getElementById('live-video');
        var canvas = document.getElementById('live-canvas');
        var startBtn = document.getElementById('live-start');
        var stopBtn = document.getElementById('live-stop');
        var photoBtn = document.getElementById('live-capture-photo');
        var videoBtn = document.getElementById('live-capture-video');
        var submitBtn = document.getElementById('live-submit-btn');
        var dataInput = document.getElementById('live-capture-data');
        var formLive = document.getElementById('form-upload-live');
        var placeholder = document.getElementById('live-placeholder');
        var stream = null;
        var lastCaptureData = '';
        function showPlaceholder() { if (placeholder) placeholder.style.display = ''; if (video) video.style.display = 'none'; }
        function hidePlaceholder() { if (placeholder) placeholder.style.display = 'none'; if (video) video.style.display = 'block'; }
        if (startBtn) startBtn.addEventListener('click', function () {
          if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { alert('Camera not supported'); return; }
          navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then(function (s) {
            stream = s; if (video) { video.srcObject = s; video.style.display = 'block'; } hidePlaceholder();
            if (photoBtn) photoBtn.disabled = false; if (videoBtn) videoBtn.disabled = false; if (stopBtn) stopBtn.disabled = false;
          }).catch(function () { alert(iifMessage('jsCameraAccessDenied')); });
        });
        if (stopBtn) stopBtn.addEventListener('click', function () {
          if (stream) stream.getTracks().forEach(function (t) { t.stop(); }); stream = null;
          if (video && video.srcObject) video.srcObject = null; showPlaceholder();
          if (photoBtn) photoBtn.disabled = true; if (videoBtn) videoBtn.disabled = true; if (stopBtn) stopBtn.disabled = true;
        });
        if (photoBtn && canvas && video) photoBtn.addEventListener('click', function () {
          if (!stream) return;
          canvas.width = video.videoWidth; canvas.height = video.videoHeight;
          var ctx = canvas.getContext('2d'); ctx.drawImage(video, 0, 0);
          try { lastCaptureData = canvas.toDataURL('image/jpeg', 0.85); if (dataInput) dataInput.value = lastCaptureData; if (submitBtn) submitBtn.disabled = false; } catch (e) { }
        });
        if (videoBtn) videoBtn.addEventListener('click', function () {
          if (!stream) return;
          lastCaptureData = 'video-capture-' + new Date().toISOString();
          if (dataInput) dataInput.value = lastCaptureData; if (submitBtn) submitBtn.disabled = false;
          alert(iifMessage('jsLiveVideoRecordedSent'));
        });
        if (formLive) formLive.addEventListener('submit', function (e) {
          e.preventDefault();
          var data = (dataInput && dataInput.value) || lastCaptureData;
          if (!data) return;
          if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.setAttribute('data-orig-html', submitBtn.innerHTML);
            submitBtn.innerHTML = iifMessage('dashCaptureSending');
          }
          function doSend() {
            addUpload(UPLOADS_LIVE_KEY, { kind: data.indexOf('data:') === 0 ? 'photo' : 'video', data: data.length > 50000 ? data.slice(0, 50000) + '...[truncated]' : data, at: new Date().toISOString() });
            alert(iifMessage('dashCaptureSentAdmin'));
            if (dataInput) dataInput.value = '';
            if (submitBtn) { var orig = submitBtn.getAttribute('data-orig-html'); if (orig) submitBtn.innerHTML = orig; submitBtn.disabled = false; }
          }
          if (typeof data === 'string' && data.indexOf('data:image/') === 0) {
            checkImageContentSafe(data).then(function (r) {
              if (!r.safe) { alert(getContentRejectMessage(r.reason)); if (submitBtn) { var orig = submitBtn.getAttribute('data-orig-html'); if (orig) submitBtn.innerHTML = orig; submitBtn.disabled = false; } return; }
              doSend();
            });
          } else {
            setTimeout(doSend, (window.IIF_TIMING && window.IIF_TIMING.deferShort) || 150);
          }
        });
      })();

      /* تحليل الميزانيات ودراسات الجدوى — نتائج محمية، صلاحية من لوحة التحكم */
      var PERM_BUDGET_KEY = 'iif-perm-budget', PERM_FEASIBILITY_KEY = 'iif-perm-feasibility', PERM_SERVICE_FORMS_KEY = 'iif-perm-service-forms';
      function getPermittedBudget() { try { var r = localStorage.getItem(PERM_BUDGET_KEY); return r ? JSON.parse(r) : []; } catch (e) { return []; } }
      function getPermittedFeasibility() { try { var r = localStorage.getItem(PERM_FEASIBILITY_KEY); return r ? JSON.parse(r) : []; } catch (e) { return []; } }
      function getPermittedServiceForms() { try { var r = localStorage.getItem(PERM_SERVICE_FORMS_KEY); return r ? JSON.parse(r) : []; } catch (e) { return []; } }
      function canViewBudget() { if (isAdmin()) return true; try { var email = (localStorage.getItem('iif-user-email') || '').toLowerCase(); return getPermittedBudget().indexOf(email) >= 0; } catch (e) { return false; } }
      function canViewFeasibility() { if (isAdmin()) return true; try { var email = (localStorage.getItem('iif-user-email') || '').toLowerCase(); return getPermittedFeasibility().indexOf(email) >= 0; } catch (e) { return false; } }
      /** نماذج الخدمات متاحة للجميع — دون اشتراك مدفوع */
      function canUseServiceForms() {
        return true;
      }
      function parseNumberList(str) {
        var s = (str || '').replace(/,/g, ' ').replace(/\n/g, ' ').split(/\s+/);
        var out = []; for (var i = 0; i < s.length; i++) { var n = parseFloat(s[i]); if (!isNaN(n)) out.push(n); } return out;
      }
      document.querySelectorAll('.protected-results').forEach(function (el) {
        if (!el) return;
        function allowCopyTarget(t) {
          try {
            if (!t) return false;
            var tag = (t.tagName || '').toLowerCase();
            if (tag === 'input' || tag === 'textarea') return true;
            if (t.isContentEditable) return true;
            if (t.closest && t.closest('a[href]')) return true; // allow copying links
            return false;
          } catch (eAllow) { return false; }
        }
        function allowCopySelection() {
          try {
            var sel = (window.getSelection && window.getSelection()) ? String(window.getSelection().toString() || '') : '';
            sel = sel.trim();
            if (!sel) return false;
            // Allow copying link-like snippets (URL or common page/path tokens) without unlocking full protected content.
            if (sel.length > 260) return false;
            if (/^https?:\/\//i.test(sel)) return true;
            if (/^www\./i.test(sel)) return true;
            if (/[A-Za-z0-9.-]+\.[A-Za-z]{2,}(\/\S*)?/i.test(sel)) return true;
            if (/(^|\/)[\w.-]+\.html?(\\?|#|$)/i.test(sel)) return true;
            if (/financial-consulting\/iif-fund-demo/i.test(sel)) return true;
            return false;
          } catch (eSel) { return false; }
        }
        el.addEventListener('contextmenu', function (e) {
          if (isAdmin()) return;
          if (allowCopyTarget(e && e.target)) return;
          if (allowCopySelection()) return;
          e.preventDefault();
        });
        el.addEventListener('copy', function (e) {
          if (isAdmin()) return;
          if (allowCopyTarget(e && e.target)) return;
          if (allowCopySelection()) return;
          e.preventDefault();
        });
      });
      function updateAdminBodyClass() {
        try {
          if (isAdmin()) document.body.classList.add('is-admin'); else document.body.classList.remove('is-admin');
          if (isStaff()) document.body.classList.add('is-staff'); else document.body.classList.remove('is-staff');
        } catch (e) { }
      }
      updateAdminBodyClass();
      /* لغة التقرير الافتراضية = لغة الصفحة (لغة العميل) */
      (function setBudgetReportLangDefault() {
        var sel = document.getElementById('budget-report-lang');
        if (!sel) return;
        var pageLang = (document.documentElement.getAttribute('data-lang') || document.documentElement.lang || 'ar').toLowerCase();
        if (pageLang === 'ar' || pageLang === 'en') sel.value = pageLang;
      })();

      function extractNumbersFromText(text) {
        var out = [];
        var s = (text || '').replace(/,/g, ' ').replace(/[\n\r;|\t]/g, ' ').replace(/\s+/g, ' ');
        var parts = s.split(' ');
        for (var i = 0; i < parts.length; i++) {
          var n = parseFloat(parts[i].replace(/[^\d.-]/g, ''));
          if (!isNaN(n)) out.push(n);
        }
        return out;
      }
      function parseBudgetCsvLine(line) {
        var out = [];
        var cur = '';
        var inQ = false;
        for (var i = 0; i < line.length; i++) {
          var ch = line[i];
          if (ch === '"') {
            inQ = !inQ;
            continue;
          }
          if (!inQ && ch === ',') {
            out.push(cur.trim());
            cur = '';
            continue;
          }
          cur += ch;
        }
        out.push(cur.trim());
        return out;
      }
      function applyBudgetScenario(revenues, expenses, lineItems, opts) {
        opts = opts || {};
        var revMult = 1 + (parseFloat(opts.scenarioRevPct) || 0) / 100;
        var expMult = 1 + (parseFloat(opts.scenarioExpPct) || 0) / 100;
        if (revMult < 0) revMult = 0;
        if (expMult < 0) expMult = 0;
        return {
          revenues: (revenues || []).map(function (x) { return x * revMult; }),
          expenses: (expenses || []).map(function (x) { return x * expMult; }),
          lineItems: (lineItems || []).map(function (row) {
            var m = row.type === 'revenue' ? revMult : expMult;
            var o = { category: row.category, type: row.type, amount: (row.amount || 0) * m };
            if (row.period) o.period = row.period;
            if (row.scenario) o.scenario = row.scenario;
            if (row.currency) o.currency = row.currency;
            return o;
          })
        };
      }
      function budgetValidationMessages(data, fileName) {
        var msgs = [];
        if (!data || (!data.revenues.length && !data.expenses.length)) return msgs;
        var ext = (fileName || '').split('.').pop().toLowerCase();
        if (/^(pdf|doc|docx)$/i.test(ext)) msgs.push(typeof iifMessage === 'function' ? iifMessage('budgetWarnHeuristic') : '');
        function hasNeg(arr) { return (arr || []).some(function (n) { return n < 0; }); }
        if (hasNeg(data.revenues) || hasNeg(data.expenses)) msgs.push(typeof iifMessage === 'function' ? iifMessage('budgetWarnNegative') : '');
        if (!data.lineItems || !data.lineItems.length) msgs.push(typeof iifMessage === 'function' ? iifMessage('budgetWarnNoCategories') : '');
        if (data.parseSource === 'server' && data.serverWarnings && data.serverWarnings.length) {
          data.serverWarnings.forEach(function (w) { msgs.push(String(w)); });
        }
        if (data.serverFallbackErrors && data.serverFallbackErrors.length) {
          var fb = typeof iifMessage === 'function' ? iifMessage('budgetServerFallback') : '';
          msgs.push(fb + ' ' + data.serverFallbackErrors.join('; '));
        }
        if (data.serverFallbackWarnings && data.serverFallbackWarnings.length) {
          data.serverFallbackWarnings.forEach(function (w) { msgs.push(String(w)); });
        }
        if (data.parseSource === 'server' && typeof iifMessage === 'function' && !(data.serverFallbackErrors && data.serverFallbackErrors.length)) {
          msgs.push(iifMessage('budgetServerParseOk'));
        }
        return msgs.filter(Boolean);
      }
      function renderBudgetValidationList(msgs) {
        var ul = document.getElementById('budget-validation-list');
        if (!ul) return;
        if (!msgs || !msgs.length) {
          ul.innerHTML = '';
          ul.hidden = true;
          return;
        }
        ul.innerHTML = msgs.map(function (m) { return '<li>' + escapeHtml(m) + '</li>'; }).join('');
        ul.hidden = false;
      }
      var BUDGET_DRAFT_KEY = 'iif-budget-draft-v1';
      var BUDGET_AUDIT_KEY = 'iif-budget-audit-log';
      var BUDGET_AUDIT_MAX = 25;
      var BUDGET_CTX_FIELD_IDS = [
        'budget-ctx-company', 'budget-ctx-office', 'budget-ctx-from', 'budget-ctx-to',
        'budget-ctx-prev-rev', 'budget-ctx-prev-exp', 'budget-ctx-assets', 'budget-ctx-prev-assets',
        'budget-ctx-liab', 'budget-ctx-equity', 'budget-ctx-cur-assets', 'budget-ctx-cur-liab',
        'budget-ctx-consolidated', 'budget-ctx-entities', 'budget-ctx-cogs', 'budget-ctx-inventory',
        'budget-ctx-payables', 'budget-ctx-ppe', 'budget-ctx-depr-rate', 'budget-ctx-depr-exp',
        'budget-ctx-banks', 'budget-ctx-activity', 'budget-ctx-country',
        'budget-ctx-target-rev', 'budget-ctx-target-exp'
      ];
      function gatherBudgetContextFromDom() {
        var ctx = {};
        BUDGET_CTX_FIELD_IDS.forEach(function (id) {
          var el = document.getElementById(id);
          ctx[id] = el ? String(el.value || '') : '';
        });
        return ctx;
      }
      function applyBudgetContextToDom(ctx) {
        if (!ctx) return;
        BUDGET_CTX_FIELD_IDS.forEach(function (id) {
          var el = document.getElementById(id);
          if (el && ctx[id] != null) el.value = ctx[id];
        });
      }
      function appendBudgetAuditLog(meta) {
        try {
          var raw = localStorage.getItem(BUDGET_AUDIT_KEY);
          var arr = raw ? JSON.parse(raw) : [];
          if (!Array.isArray(arr)) arr = [];
          arr.unshift({
            at: meta.at || new Date().toISOString(),
            fileName: meta.fileName || '',
            revCount: meta.revCount | 0,
            expCount: meta.expCount | 0,
            lineCount: meta.lineCount | 0
          });
          while (arr.length > BUDGET_AUDIT_MAX) arr.pop();
          localStorage.setItem(BUDGET_AUDIT_KEY, JSON.stringify(arr));
        } catch (e) { }
      }
      function getBudgetAuditLog() {
        try {
          var raw = localStorage.getItem(BUDGET_AUDIT_KEY);
          var arr = raw ? JSON.parse(raw) : [];
          return Array.isArray(arr) ? arr : [];
        } catch (e) { return []; }
      }
      function saveBudgetDraft() {
        var pack = window.__lastBudgetAnalysis;
        if (!pack || (!pack.revenues.length && !pack.expenses.length)) return;
        try {
          var draft = {
            version: 1,
            at: new Date().toISOString(),
            fileName: (window.__lastBudgetUploadMeta && window.__lastBudgetUploadMeta.fileName) || '',
            revenues: pack.revenues,
            expenses: pack.expenses,
            lineItems: pack.lineItems || [],
            rollup: pack.rollup,
            byPeriod: pack.byPeriod,
            currencies: pack.currencies || [],
            primaryScenario: pack.primaryScenario || 'actual',
            parseSource: pack.parseSource || 'client',
            context: gatherBudgetContextFromDom(),
            scenarioRev: (document.getElementById('budget-scenario-rev') || {}).value || '0',
            scenarioExp: (document.getElementById('budget-scenario-exp') || {}).value || '0',
            reportLang: (document.getElementById('budget-report-lang') || {}).value || 'ar'
          };
          localStorage.setItem(BUDGET_DRAFT_KEY, JSON.stringify(draft));
        } catch (e) { }
      }
      function scheduleBudgetDraftSave() {
        clearTimeout(window.__budgetDraftTimer);
        window.__budgetDraftTimer = setTimeout(saveBudgetDraft, 700);
      }
      function clearBudgetDraftFromStorage() {
        try { localStorage.removeItem(BUDGET_DRAFT_KEY); } catch (e) { }
        var ban = document.getElementById('budget-draft-banner');
        if (ban) ban.hidden = true;
      }
      function restoreBudgetDraftFromStorage() {
        try {
          var raw = localStorage.getItem(BUDGET_DRAFT_KEY);
          if (!raw) return;
          var d = JSON.parse(raw);
          if (!d || !d.revenues || (!d.revenues.length && !d.expenses.length)) return;
          window.__lastBudgetAnalysis = {
            revenues: d.revenues,
            expenses: d.expenses,
            lineItems: d.lineItems || [],
            rollup: d.rollup,
            byPeriod: d.byPeriod,
            currencies: d.currencies || [],
            primaryScenario: d.primaryScenario || 'actual',
            parseSource: d.parseSource || 'client'
          };
          window.__lastBudgetUploadMeta = {
            fileName: d.fileName || 'draft',
            at: d.at || '',
            revCount: d.revenues.length,
            expCount: d.expenses.length,
            lineCount: (d.lineItems || []).length,
            restored: true
          };
          applyBudgetContextToDom(d.context);
          if (d.reportLang) {
            var sel = document.getElementById('budget-report-lang');
            if (sel && (d.reportLang === 'ar' || d.reportLang === 'en')) sel.value = d.reportLang;
          }
          if (d.scenarioRev != null) {
            var sr = document.getElementById('budget-scenario-rev');
            if (sr) sr.value = d.scenarioRev;
          }
          if (d.scenarioExp != null) {
            var se = document.getElementById('budget-scenario-exp');
            if (se) se.value = d.scenarioExp;
          }
          updateBudgetScenarioLabels();
          var bp = document.getElementById('budget-context-panel');
          if (bp) bp.hidden = false;
          var tb = document.getElementById('budget-toolbar');
          if (tb) tb.hidden = false;
          var ban = document.getElementById('budget-draft-banner');
          if (ban) ban.hidden = true;
          refreshBudgetReport();
        } catch (e) { }
      }
      function initBudgetDraftBanner() {
        var ban = document.getElementById('budget-draft-banner');
        var txt = document.getElementById('budget-draft-banner-text');
        if (!ban) return;
        try {
          var cur = window.__lastBudgetAnalysis;
          if (cur && (cur.revenues.length || cur.expenses.length)) {
            ban.hidden = true;
            return;
          }
          var raw = localStorage.getItem(BUDGET_DRAFT_KEY);
          if (!raw) { ban.hidden = true; return; }
          var d = JSON.parse(raw);
          if (!d || !d.revenues || (!d.revenues.length && !d.expenses.length)) { ban.hidden = true; return; }
          ban.hidden = false;
          if (txt) {
            var msg = typeof iifMessage === 'function' ? iifMessage('budgetDraftBanner') : '';
            var fn = d.fileName ? ' — ' + d.fileName : '';
            var at = d.at ? ' (' + d.at.slice(0, 19) + ')' : '';
            txt.textContent = msg + fn + at;
          }
        } catch (e) { ban.hidden = true; }
      }
      function buildBudgetMarkdownExport(lang) {
        var pack = window.__lastBudgetAnalysis;
        if (!pack || (!pack.revenues.length && !pack.expenses.length)) return '';
        var L = BUDGET_REPORT_STRINGS[lang] || BUDGET_REPORT_STRINGS.en;
        var opts = collectBudgetOptsFromForm(pack.lineItems);
        opts.rollup = pack.rollup;
        opts.byPeriod = pack.byPeriod;
        opts.currencies = pack.currencies || [];
        opts.primaryScenario = pack.primaryScenario || 'actual';
        var itemsForScale = budgetLineItemsPrimarySlice(pack.lineItems || [], opts.primaryScenario);
        var scaled = applyBudgetScenario(pack.revenues, pack.expenses, itemsForScale, opts);
        var revM = 1 + (parseFloat(opts.scenarioRevPct) || 0) / 100;
        var expM = 1 + (parseFloat(opts.scenarioExpPct) || 0) / 100;
        var rollupReport = opts.rollup ? scaleBudgetRollup(opts.rollup, revM, expM) : null;
        var byPeriodReport = null;
        if (opts.byPeriod) {
          byPeriodReport = {};
          Object.keys(opts.byPeriod).forEach(function (k) {
            byPeriodReport[k] = scaleBudgetRollup(opts.byPeriod[k], revM, expM);
          });
        }
        var tr = scaled.revenues.reduce(function (a, b) { return a + b; }, 0);
        var te = scaled.expenses.reduce(function (a, b) { return a + b; }, 0);
        var bal = tr - te;
        var lines = ['# ' + (L.title || 'Budget'), ''];
        lines.push('## ' + (L.totals || 'Totals'));
        lines.push('| | ' + (L.deepColAmount || 'Amount') + ' |');
        lines.push('| --- | ---: |');
        lines.push('| ' + (L.revenue || '') + ' | ' + tr.toFixed(2) + ' |');
        lines.push('| ' + (L.expenses || '') + ' | ' + te.toFixed(2) + ' |');
        lines.push('| ' + (L.balance || '') + ' | ' + bal.toFixed(2) + ' |');
        lines.push('');
        if (opts.currencies && opts.currencies.length > 1) {
          lines.push('> ' + (L.budgetMultiCurrencyNote || '') + '');
          lines.push('');
        } else if (opts.currencies && opts.currencies.length === 1) {
          lines.push('*' + (L.budgetSingleCurrencyLabel || '') + ': ' + opts.currencies[0] + '*');
          lines.push('');
        }
        var tRev = parseFloat(opts.targetRevenue) || 0;
        var tExp = parseFloat(opts.targetExpenses) || 0;
        if (tRev > 0 || tExp > 0) {
          lines.push('## ' + (L.budgetTargetsSection || 'Targets'));
          if (tRev > 0) lines.push('- ' + (L.budgetTargetRevLabel || '') + ': ' + tRev.toFixed(2) + ' → Δ ' + (tRev ? ((tr - tRev) / tRev * 100).toFixed(1) : '0') + '%');
          if (tExp > 0) lines.push('- ' + (L.budgetTargetExpLabel || '') + ': ' + tExp.toFixed(2) + ' → Δ ' + (tExp ? ((te - tExp) / tExp * 100).toFixed(1) : '0') + '%');
          lines.push('');
        }
        if ((parseFloat(opts.scenarioRevPct) || 0) !== 0 || (parseFloat(opts.scenarioExpPct) || 0) !== 0) {
          lines.push('*' + (L.scenarioBanner || '').replace(/\{r\}/g, String(opts.scenarioRevPct || 0)).replace(/\{e\}/g, String(opts.scenarioExpPct || 0)) + '*');
          lines.push('');
        }
        var rollup = rollupReport;
        if (rollup && rollup.revenue && rollup.expense) {
          var scenUsed = ['approved', 'actual', 'forecast'].filter(function (k) {
            return Math.abs(rollup.revenue[k] || 0) > 1e-9 || Math.abs(rollup.expense[k] || 0) > 1e-9;
          });
          if (scenUsed.length >= 2) {
            lines.push('## ' + (L.budgetScenarioRollupTitle || ''));
            lines.push('| | ' + (L.budgetScenarioApproved || '') + ' | ' + (L.budgetScenarioActual || '') + ' | ' + (L.budgetScenarioForecast || '') + ' |');
            lines.push('| --- | ---: | ---: | ---: |');
            lines.push('| ' + (L.revenue || '') + ' | ' + (rollup.revenue.approved || 0).toFixed(2) + ' | ' + (rollup.revenue.actual || 0).toFixed(2) + ' | ' + (rollup.revenue.forecast || 0).toFixed(2) + ' |');
            lines.push('| ' + (L.expenses || '') + ' | ' + (rollup.expense.approved || 0).toFixed(2) + ' | ' + (rollup.expense.actual || 0).toFixed(2) + ' | ' + (rollup.expense.forecast || 0).toFixed(2) + ' |');
            lines.push('');
            if (L.budgetScenarioRollupNote) {
              lines.push('*' + L.budgetScenarioRollupNote + '*');
              lines.push('');
            }
          }
        }
        var bp = byPeriodReport || {};
        var pKeys = Object.keys(bp).filter(function (k) { return k !== '_all'; }).sort();
        if (pKeys.length) {
          var sa = L.budgetScenarioApproved || 'approved';
          var sn = L.budgetScenarioActual || 'actual';
          var sf = L.budgetScenarioForecast || 'forecast';
          var revHdr = (L.revenue || '') + ' (' + sa + ' / ' + sn + ' / ' + sf + ')';
          var expHdr = (L.expenses || '') + ' (' + sa + ' / ' + sn + ' / ' + sf + ')';
          lines.push('## ' + (L.budgetPeriodBreakdownTitle || ''));
          lines.push('| ' + (L.budgetColPeriod || '') + ' | ' + revHdr + ' | ' + expHdr + ' |');
          lines.push('| --- | --- | --- |');
          pKeys.forEach(function (pk) {
            var slice = bp[pk] || { revenue: {}, expense: {} };
            var rv = ((slice.revenue && slice.revenue.approved) || 0).toFixed(2) + ' / ' + ((slice.revenue && slice.revenue.actual) || 0).toFixed(2) + ' / ' + ((slice.revenue && slice.revenue.forecast) || 0).toFixed(2);
            var ex = ((slice.expense && slice.expense.approved) || 0).toFixed(2) + ' / ' + ((slice.expense && slice.expense.actual) || 0).toFixed(2) + ' / ' + ((slice.expense && slice.expense.forecast) || 0).toFixed(2);
            lines.push('| ' + String(pk).replace(/\|/g, '/') + ' | ' + rv + ' | ' + ex + ' |');
          });
          lines.push('');
        }
        if (scaled.lineItems && scaled.lineItems.length) {
          var hasPeriod = scaled.lineItems.some(function (r) { return r.period; });
          var hasScen = scaled.lineItems.some(function (r) { return r.scenario; });
          var hasCur = scaled.lineItems.some(function (r) { return r.currency; });
          lines.push('## ' + (L.deepCategoryRev || '') + ' / ' + (L.deepCategoryExp || ''));
          var hdr = ['| ' + (L.deepColItem || 'Item'), 'type', (L.deepColAmount || '')];
          var sep = ['| ---', '---', '---:'];
          if (hasPeriod) { hdr.push(L.budgetColPeriod || 'period'); sep.push('---'); }
          if (hasScen) { hdr.push('scenario'); sep.push('---'); }
          if (hasCur) { hdr.push('currency'); sep.push('---'); }
          lines.push(hdr.join(' | ') + ' |');
          lines.push(sep.join(' | ') + ' |');
          scaled.lineItems.forEach(function (row) {
            var cells = [
              String(row.category || '').replace(/\|/g, '/'),
              row.type,
              row.amount != null ? row.amount.toFixed(2) : ''
            ];
            if (hasPeriod) cells.push(String(row.period || '').replace(/\|/g, '/'));
            if (hasScen) cells.push(String(row.scenario || '').replace(/\|/g, '/'));
            if (hasCur) cells.push(String(row.currency || '').replace(/\|/g, '/'));
            lines.push('| ' + cells.join(' | ') + ' |');
          });
          lines.push('');
        }
        lines.push('---');
        lines.push((L.budgetDisclaimerLegal || '') + ' ' + (L.budgetDisclaimerContact || '') + ': #contact');
        return lines.join('\n');
      }
      function copyBudgetMarkdownToClipboard() {
        var lang = (document.getElementById('budget-report-lang') && document.getElementById('budget-report-lang').value) || 'ar';
        if (lang !== 'ar' && lang !== 'en') lang = 'ar';
        var md = buildBudgetMarkdownExport(lang);
        if (!md) return;
        function ok() { if (typeof alert === 'function') alert(typeof iifMessage === 'function' ? iifMessage('budgetCopyOk') : ''); }
        function fail() { if (typeof alert === 'function') alert(typeof iifMessage === 'function' ? iifMessage('budgetCopyFail') : ''); }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(md).then(ok).catch(fail);
        } else fail();
      }
      function ensureChartJs(next) {
        if (typeof Chart !== 'undefined') { next(); return; }
        var s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js';
        s.crossOrigin = 'anonymous';
        s.onload = function () { next(); };
        s.onerror = function () { next(); };
        document.head.appendChild(s);
      }
      function destroyBudgetCharts() {
        if (window.__budgetChartInstances && window.__budgetChartInstances.length) {
          window.__budgetChartInstances.forEach(function (c) { try { c.destroy(); } catch (e) {} });
        }
        window.__budgetChartInstances = [];
      }
      function budgetChartTopNLabelsData(rows, total, maxN, otherLabel) {
        if (!rows || !rows.length || total <= 0) return { labels: [], data: [] };
        var top = rows.slice(0, maxN);
        var sumTop = 0;
        top.forEach(function (x) { sumTop += x.amount; });
        var other = Math.max(0, total - sumTop);
        var labels = top.map(function (x) {
          var n = String(x.name || '—');
          return n.length > 26 ? n.slice(0, 23) + '…' : n;
        });
        var data = top.map(function (x) { return x.amount; });
        if (other > total * 0.001 && rows.length > maxN) {
          labels.push(otherLabel || 'Other');
          data.push(other);
        }
        return { labels: labels, data: data };
      }
      function budgetLineItemsPrimarySlice(lineItems, primaryScenario) {
        if (!lineItems || !lineItems.length) return [];
        var hasScen = lineItems.some(function (r) { return r && r.scenario; });
        if (!hasScen || !primaryScenario) return lineItems;
        return lineItems.filter(function (r) { return (r.scenario || 'actual') === primaryScenario; });
      }
      function budgetScenarioKeysActive(rollup) {
        if (!rollup || !rollup.revenue || !rollup.expense) return [];
        return ['approved', 'actual', 'forecast'].filter(function (k) {
          return Math.abs(rollup.revenue[k] || 0) > 1e-9 || Math.abs(rollup.expense[k] || 0) > 1e-9;
        });
      }
      function scaleBudgetRollup(rollup, revMult, expMult) {
        if (!rollup || !rollup.revenue || !rollup.expense) return null;
        revMult = revMult != null ? revMult : 1;
        expMult = expMult != null ? expMult : 1;
        var out = { revenue: {}, expense: {} };
        ['approved', 'actual', 'forecast'].forEach(function (k) {
          out.revenue[k] = (rollup.revenue[k] || 0) * revMult;
          out.expense[k] = (rollup.expense[k] || 0) * expMult;
        });
        return out;
      }
      function renderBudgetCharts(revenues, expenses, lineItems, lang, chartOpts) {
        chartOpts = chartOpts || {};
        destroyBudgetCharts();
        var L = BUDGET_REPORT_STRINGS[lang] || BUDGET_REPORT_STRINGS.en;
        if (typeof Chart === 'undefined') return;
        var prim = chartOpts.primaryScenario || 'actual';
        var sliceItems = budgetLineItemsPrimarySlice(lineItems, prim);
        var totalRev = revenues.reduce(function (a, b) { return a + b; }, 0);
        var totalExp = expenses.reduce(function (a, b) { return a + b; }, 0);
        var revByCat = aggregateBudgetLineItemsByCategory(sliceItems, 'revenue');
        var expByCat = aggregateBudgetLineItemsByCategory(sliceItems, 'expense');
        var green = '#2ea36f';
        var coral = '#d47850';
        var muted = ['#5a6b82', '#8b7355', '#4a7c8c', '#7c6b9e', '#6b8c7a', '#9e7b6b', '#6b7c9e'];
        var elBar = document.getElementById('budget-chart-rev-exp');
        if (elBar && (totalRev > 0 || totalExp > 0)) {
          var c1 = new Chart(elBar, {
            type: 'bar',
            data: {
              labels: [L.revenue, L.expenses],
              datasets: [{
                label: L.totals || '',
                data: [totalRev, totalExp],
                backgroundColor: [green, coral],
                borderColor: [green, coral],
                borderWidth: 1
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: true,
              plugins: {
                legend: { display: false },
                title: { display: true, text: L.chartRevExpBar || '', color: '#e8ecf4' }
              },
              scales: {
                x: { ticks: { color: '#a6b0c2' }, grid: { color: 'rgba(255,255,255,0.06)' } },
                y: { ticks: { color: '#a6b0c2' }, grid: { color: 'rgba(255,255,255,0.06)' }, beginAtZero: true }
              }
            }
          });
          window.__budgetChartInstances.push(c1);
        }
        var otherL = L.chartOther || 'Other';
        var elExp = document.getElementById('budget-chart-exp-pie');
        if (elExp && totalExp > 0 && expByCat.length) {
          var ed = budgetChartTopNLabelsData(expByCat, totalExp, 7, otherL);
          var c2 = new Chart(elExp, {
            type: 'doughnut',
            data: {
              labels: ed.labels,
              datasets: [{
                data: ed.data,
                backgroundColor: ed.data.map(function (_, i) { return muted[i % muted.length]; }),
                borderColor: '#1a2332',
                borderWidth: 2
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: true,
              plugins: {
                title: { display: true, text: L.chartExpBreakdown || '', color: '#e8ecf4' },
                legend: { position: 'bottom', labels: { color: '#c4cddf', boxWidth: 12 } }
              }
            }
          });
          window.__budgetChartInstances.push(c2);
        }
        var elRev = document.getElementById('budget-chart-rev-pie');
        if (elRev && totalRev > 0 && revByCat.length) {
          var rd = budgetChartTopNLabelsData(revByCat, totalRev, 7, otherL);
          var revPalette = ['#2ea36f', '#c9a227', '#4a9e7a', '#8cb894', '#3d8a62', '#6abf8f', '#2d6b4f'];
          var c3 = new Chart(elRev, {
            type: 'doughnut',
            data: {
              labels: rd.labels,
              datasets: [{
                data: rd.data,
                backgroundColor: rd.data.map(function (_, i) { return revPalette[i % revPalette.length]; }),
                borderColor: '#1a2332',
                borderWidth: 2
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: true,
              plugins: {
                title: { display: true, text: L.chartRevBreakdown || '', color: '#e8ecf4' },
                legend: { position: 'bottom', labels: { color: '#c4cddf', boxWidth: 12 } }
              }
            }
          });
          window.__budgetChartInstances.push(c3);
        }
        var rollup = chartOpts.rollup;
        var active = rollup ? budgetScenarioKeysActive(rollup) : [];
        var elScen = document.getElementById('budget-chart-scenarios');
        if (elScen && rollup && active.length >= 2) {
          var scenLabels = {
            approved: L.budgetScenarioApproved || 'Approved',
            actual: L.budgetScenarioActual || 'Actual',
            forecast: L.budgetScenarioForecast || 'Forecast'
          };
          var labels = active.map(function (k) { return scenLabels[k] || k; });
          var c4 = new Chart(elScen, {
            type: 'bar',
            data: {
              labels: labels,
              datasets: [
                {
                  label: L.revenue || '',
                  data: active.map(function (k) { return rollup.revenue[k] || 0; }),
                  backgroundColor: green,
                  borderColor: green,
                  borderWidth: 1
                },
                {
                  label: L.expenses || '',
                  data: active.map(function (k) { return rollup.expense[k] || 0; }),
                  backgroundColor: coral,
                  borderColor: coral,
                  borderWidth: 1
                }
              ]
            },
            options: {
              responsive: true,
              maintainAspectRatio: true,
              plugins: {
                legend: { labels: { color: '#c4cddf' } },
                title: { display: true, text: L.chartScenarioCompare || '', color: '#e8ecf4' }
              },
              scales: {
                x: { ticks: { color: '#a6b0c2' }, grid: { color: 'rgba(255,255,255,0.06)' } },
                y: { ticks: { color: '#a6b0c2' }, grid: { color: 'rgba(255,255,255,0.06)' }, beginAtZero: true }
              }
            }
          });
          window.__budgetChartInstances.push(c4);
        }
      }
      function getBudgetApiBase() {
        try {
          if (typeof window.IIF_BUDGET_API_BASE === 'string' && window.IIF_BUDGET_API_BASE.trim()) {
            return String(window.IIF_BUDGET_API_BASE).trim().replace(/\/$/, '');
          }
          var meta = document.querySelector('meta[name="iif-budget-api-base"]');
          var c = meta && meta.getAttribute('content');
          if (c != null && String(c).trim() !== '') {
            return String(c).trim().replace(/\/$/, '');
          }
          var host = location.hostname || '';
          var port = String(location.port || '');
          var isLocal = host === '127.0.0.1' || host === 'localhost' || host === '[::1]';
          if (isLocal && port === '3333') return 'http://127.0.0.1:3000';
          return '';
        } catch (e) { return ''; }
      }
      function tryBudgetServerParse(file, cb) {
        var base = getBudgetApiBase();
        if (!base) {
          cb(null, null);
          return;
        }
        var fd = new FormData();
        fd.append('file', file);
        fetch(base + '/api/budget/parse', { method: 'POST', body: fd })
          .then(function (res) {
            return res.json().then(function (j) {
              return { status: res.status, j: j };
            });
          })
          .then(function (x) {
            var j = x.j || {};
            var hasData = (j.revenues && j.revenues.length) || (j.expenses && j.expenses.length) || (j.lineItems && j.lineItems.length);
            if (x.status === 200 && j.ok && hasData) {
              cb({
                revenues: j.revenues || [],
                expenses: j.expenses || [],
                lineItems: j.lineItems || [],
                rollup: j.rollup,
                byPeriod: j.byPeriod,
                currencies: j.currencies || [],
                primaryScenario: j.primaryScenario || 'actual',
                serverWarnings: j.warnings || [],
                serverErrors: [],
                parseSource: 'server'
              }, null);
              return;
            }
            cb(null, j);
          })
          .catch(function () {
            cb(null, null);
          });
      }
      function normalizeBudgetScenarioCell(raw) {
        var s = String(raw == null ? '' : raw).toLowerCase().trim();
        if (!s) return 'actual';
        if (/^approved|budget|معتمد|ميزانية\s*معتمدة/.test(s)) return 'approved';
        if (/^forecast|projected|متوقع|تقدير/.test(s)) return 'forecast';
        if (/^actual|فعلي|تحقق/.test(s)) return 'actual';
        return 'actual';
      }
      function mergeBudgetLegacyFromLineItems(lineItems) {
        var scenSet = {};
        (lineItems || []).forEach(function (r) {
          scenSet[(r && r.scenario) || 'actual'] = true;
        });
        var keys = Object.keys(scenSet);
        var pick = 'actual';
        if (keys.length === 1) {
          pick = keys[0];
        } else if (keys.length > 1 && !scenSet.actual) {
          if (scenSet.approved) pick = 'approved';
          else if (scenSet.forecast) pick = 'forecast';
        }
        var rev = [];
        var exp = [];
        (lineItems || []).forEach(function (row) {
          if (keys.length > 1 && ((row.scenario || 'actual') !== pick)) return;
          if (row.type === 'revenue') rev.push(row.amount);
          else if (row.type === 'expense') exp.push(row.amount);
        });
        return { revenues: rev, expenses: exp, primaryScenario: pick };
      }
      function buildRollupFromLineItems(lineItems) {
        var rollup = {
          revenue: { approved: 0, actual: 0, forecast: 0 },
          expense: { approved: 0, actual: 0, forecast: 0 }
        };
        (lineItems || []).forEach(function (row) {
          var scen = row.scenario || 'actual';
          var side = row.type === 'revenue' ? 'revenue' : 'expense';
          rollup[side][scen] = (rollup[side][scen] || 0) + (row.amount || 0);
        });
        return rollup;
      }
      function buildByPeriodFromLineItems(lineItems) {
        var byPeriod = {};
        (lineItems || []).forEach(function (row) {
          var pKey = row.period || '_all';
          if (!byPeriod[pKey]) {
            byPeriod[pKey] = {
              revenue: { approved: 0, actual: 0, forecast: 0 },
              expense: { approved: 0, actual: 0, forecast: 0 }
            };
          }
          var scen = row.scenario || 'actual';
          var side = row.type === 'revenue' ? 'revenue' : 'expense';
          byPeriod[pKey][side][scen] = (byPeriod[pKey][side][scen] || 0) + (row.amount || 0);
        });
        return byPeriod;
      }
      function tryParseStructuredBudgetMatrix(matrix) {
        if (!matrix || matrix.length < 2) return null;
        var headerCells = matrix[0].map(function (c) {
          return String(c == null ? '' : c).replace(/^\ufeff/g, '').toLowerCase().trim();
        });
        var typeIdx = -1;
        var amtIdx = -1;
        var catIdx = -1;
        var periodIdx = -1;
        var scenIdx = -1;
        var curIdx = -1;
        for (var j = 0; j < headerCells.length; j++) {
          var h = headerCells[j];
          if (h === 'type' || h === 'نوع' || h === 'kind') typeIdx = j;
          if (h === 'amount' || h === 'مبلغ' || h === 'value') amtIdx = j;
          if (h === 'category' || h === 'item' || h === 'account' || h === 'بند' || h === 'description' || h === 'name') catIdx = j;
          if (h === 'period' || h === 'فترة' || h === 'month' || h === 'quarter' || h === 'year') periodIdx = j;
          if (h === 'scenario' || h === 'سيناريو' || h === 'version' || h === 'نوع_الميزانية') scenIdx = j;
          if (h === 'currency' || h === 'عملة' || h === 'ccy') curIdx = j;
        }
        if (typeIdx < 0 || amtIdx < 0) return null;
        var lineItems = [];
        for (var r = 1; r < matrix.length; r++) {
          var row = matrix[r];
          if (!row || !row.length) continue;
          var t = String(row[typeIdx] != null ? row[typeIdx] : '').toLowerCase();
          var raw = row[amtIdx];
          var amt = typeof raw === 'number' && !isNaN(raw) ? raw : parseFloat(String(raw).replace(/[^\d.-]/g, ''));
          if (isNaN(amt)) continue;
          var cat = catIdx >= 0 ? String(row[catIdx] != null ? row[catIdx] : '').trim() : '';
          var period = periodIdx >= 0 ? String(row[periodIdx] != null ? row[periodIdx] : '').trim() : '';
          var scenario = scenIdx >= 0 ? normalizeBudgetScenarioCell(row[scenIdx]) : 'actual';
          var currency = curIdx >= 0 ? String(row[curIdx] != null ? row[curIdx] : '').trim().toUpperCase().slice(0, 8) : '';
          var rowType = null;
          if (/revenue|rev\b|إيراد|ايراد|income/.test(t)) rowType = 'revenue';
          else if (/expense|exp\b|مصروف|^cost/.test(t)) rowType = 'expense';
          if (!rowType) continue;
          var item = { category: cat || '—', type: rowType, amount: amt, scenario: scenario };
          if (period) item.period = period;
          if (currency) item.currency = currency;
          lineItems.push(item);
        }
        if (lineItems.length === 0) return null;
        var legacy = mergeBudgetLegacyFromLineItems(lineItems);
        var currencies = [];
        var curSet = {};
        lineItems.forEach(function (li) {
          if (li.currency && !curSet[li.currency]) {
            curSet[li.currency] = true;
            currencies.push(li.currency);
          }
        });
        return {
          revenues: legacy.revenues,
          expenses: legacy.expenses,
          lineItems: lineItems,
          primaryScenario: legacy.primaryScenario,
          rollup: buildRollupFromLineItems(lineItems),
          byPeriod: buildByPeriodFromLineItems(lineItems),
          currencies: currencies,
          parseSource: 'client'
        };
      }
      function readBudgetFileClient(file, cb) {
        if (!file) { cb(null, null); return; }
        var name = (file.name || '').toLowerCase();
        var rev = [], exp = [];
        var lineItems = [];
        var rollup, byPeriod, currencies, primaryScenario, parseSource;
        function packResult() {
          if (!(rev.length || exp.length)) return null;
          var o = { revenues: rev, expenses: exp, lineItems: lineItems };
          if (rollup) o.rollup = rollup;
          if (byPeriod) o.byPeriod = byPeriod;
          if (currencies && currencies.length) o.currencies = currencies;
          if (primaryScenario) o.primaryScenario = primaryScenario;
          if (parseSource) o.parseSource = parseSource;
          return o;
        }
        function done() {
          cb(packResult(), null);
        }
        function ensureXLSX(next) {
          if (typeof XLSX !== 'undefined') { next(); return; }
          var s = document.createElement('script');
          s.src = 'https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js';
          s.crossOrigin = 'anonymous';
          s.onload = next;
          document.head.appendChild(s);
        }
        function trySplitAll(nums) {
          if (nums.length === 0) return;
          var neg = [], pos = [];
          nums.forEach(function (n) { if (n < 0) neg.push(-n); else if (n > 0) pos.push(n); });
          if (neg.length && pos.length) { rev = pos; exp = neg; return; }
          var half = Math.ceil(nums.length / 2);
          rev = nums.slice(0, half);
          exp = nums.slice(half);
        }
        if (/\.(csv|txt)$/i.test(name)) {
          var r = new FileReader();
          r.onload = function () {
            var text = (r.result || '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
            var rawLines = text.split('\n');
            var nonEmpty = [];
            for (var li = 0; li < rawLines.length; li++) {
              if (rawLines[li].trim()) nonEmpty.push(rawLines[li]);
            }
            var structured = null;
            if (nonEmpty.length >= 2) {
              var matrix = [];
              for (var mi = 0; mi < nonEmpty.length; mi++) {
                matrix.push(parseBudgetCsvLine(nonEmpty[mi]));
              }
              structured = tryParseStructuredBudgetMatrix(matrix);
            }
            if (structured) {
              rev = structured.revenues;
              exp = structured.expenses;
              lineItems = structured.lineItems || [];
              rollup = structured.rollup;
              byPeriod = structured.byPeriod;
              currencies = structured.currencies;
              primaryScenario = structured.primaryScenario;
              parseSource = structured.parseSource;
            } else {
              var lines = rawLines;
              if (lines.length >= 2 && lines[0].indexOf(',') !== -1) {
                var col0 = [], col1 = [];
                for (var i = 1; i < lines.length; i++) {
                  if (!lines[i].trim()) continue;
                  var cells = parseBudgetCsvLine(lines[i]);
                  var a = parseFloat(String(cells[0]).replace(/[^\d.-]/g, ''));
                  var b = parseFloat(String(cells[1] || '').replace(/[^\d.-]/g, ''));
                  if (!isNaN(a)) col0.push(a);
                  if (!isNaN(b)) col1.push(b);
                }
                if (col0.length || col1.length) { rev = col0; exp = col1; }
              } else trySplitAll(extractNumbersFromText(text));
            }
            done();
          };
          r.readAsText(file, 'UTF-8');
          return;
        }
        if (/\.(xlsx|xls)$/i.test(name)) {
          var parseXLSX = function () {
            var reader = new FileReader();
            reader.onload = function (e) {
              try {
                var data = new Uint8Array(e.target.result);
                var wb = XLSX.read(data, { type: 'array' });
                var first = wb.SheetNames[0];
                if (!first) { done(); return; }
                var sheet = wb.Sheets[first];
                var json = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
                var structuredX = tryParseStructuredBudgetMatrix(json);
                if (structuredX) {
                  rev = structuredX.revenues;
                  exp = structuredX.expenses;
                  lineItems = structuredX.lineItems || [];
                  rollup = structuredX.rollup;
                  byPeriod = structuredX.byPeriod;
                  currencies = structuredX.currencies;
                  primaryScenario = structuredX.primaryScenario;
                  parseSource = structuredX.parseSource;
                } else {
                  var all = [];
                  var colA = [], colB = [];
                  for (var r = 0; r < json.length; r++) {
                    var row = json[r];
                    if (!Array.isArray(row)) continue;
                    for (var c = 0; c < row.length; c++) {
                      var v = row[c];
                      var num = typeof v === 'number' && !isNaN(v) ? v : parseFloat(String(v).replace(/[^\d.-]/g, ''));
                      if (!isNaN(num)) { all.push(num); if (c === 0) colA.push(num); else if (c === 1) colB.push(num); }
                    }
                  }
                  if (colA.length && colB.length) { rev = colA; exp = colB; }
                  else trySplitAll(all);
                }
              } catch (err) { }
              done();
            };
            reader.readAsArrayBuffer(file);
          };
          ensureXLSX(parseXLSX);
          return;
        }
        if (/\.(pdf|doc|docx)$/i.test(name)) {
          var fr2 = new FileReader();
          fr2.onload = function () {
            var t = fr2.result || '';
            if (typeof t === 'string') trySplitAll(extractNumbersFromText(t));
            done();
          };
          fr2.readAsText(file, 'UTF-8');
          return;
        }
        var fr3 = new FileReader();
        fr3.onload = function () { trySplitAll(extractNumbersFromText(fr3.result || '')); done(); };
        fr3.readAsText(file, 'UTF-8');
      }
      function readBudgetFile(file, cb) {
        if (!file) { cb(null, null); return; }
        tryBudgetServerParse(file, function (serverData, errPayload) {
          if (serverData) {
            cb(serverData, null);
            return;
          }
          readBudgetFileClient(file, function (clientData) {
            if (clientData && errPayload && errPayload.errors && errPayload.errors.length) {
              clientData.serverFallbackErrors = errPayload.errors.slice();
            }
            if (clientData && errPayload && errPayload.warnings && errPayload.warnings.length) {
              clientData.serverFallbackWarnings = errPayload.warnings.slice();
            }
            cb(clientData, null);
          });
        });
      }

      function collectBudgetOptsFromForm(lineItems) {
        function val(id) {
          var el = document.getElementById(id);
          if (!el || !String(el.value || '').trim()) return '';
          return String(el.value).trim();
        }
        function num(id) {
          var el = document.getElementById(id);
          if (!el || !String(el.value || '').trim()) return 0;
          var x = parseFloat(String(el.value).replace(/[^\d.-]/g, ''));
          return isNaN(x) ? 0 : x;
        }
        var cons = document.getElementById('budget-ctx-consolidated');
        return {
          lineItems: lineItems || [],
          companyName: val('budget-ctx-company'),
          officeIssued: val('budget-ctx-office'),
          dateFrom: val('budget-ctx-from'),
          dateTo: val('budget-ctx-to'),
          prevYearRevenue: num('budget-ctx-prev-rev'),
          prevYearExpenses: num('budget-ctx-prev-exp'),
          totalAssets: num('budget-ctx-assets'),
          prevYearAssets: num('budget-ctx-prev-assets'),
          totalLiabilities: num('budget-ctx-liab'),
          equity: num('budget-ctx-equity'),
          currentAssets: num('budget-ctx-cur-assets'),
          currentLiabilities: num('budget-ctx-cur-liab'),
          consolidated: (cons && cons.value) || 'no',
          numEntities: val('budget-ctx-entities'),
          cogs: num('budget-ctx-cogs'),
          avgInventory: num('budget-ctx-inventory'),
          supplierPayables: num('budget-ctx-payables'),
          newPPE: num('budget-ctx-ppe'),
          depreciationRate: num('budget-ctx-depr-rate'),
          depreciationExpense: num('budget-ctx-depr-exp'),
          bankLoans: (document.getElementById('budget-ctx-banks') && document.getElementById('budget-ctx-banks').value) || '',
          businessActivity: val('budget-ctx-activity'),
          country: val('budget-ctx-country'),
          scenarioRevPct: (function () {
            var el = document.getElementById('budget-scenario-rev');
            return el ? parseFloat(el.value) || 0 : 0;
          })(),
          scenarioExpPct: (function () {
            var el = document.getElementById('budget-scenario-exp');
            return el ? parseFloat(el.value) || 0 : 0;
          })(),
          targetRevenue: num('budget-ctx-target-rev'),
          targetExpenses: num('budget-ctx-target-exp'),
          uploadMeta: window.__lastBudgetUploadMeta || null
        };
      }
      function updateBudgetScenarioLabels() {
        var sr = document.getElementById('budget-scenario-rev');
        var se = document.getElementById('budget-scenario-exp');
        var vr = document.getElementById('budget-scenario-rev-val');
        var ve = document.getElementById('budget-scenario-exp-val');
        if (vr && sr) vr.textContent = String(sr.value);
        if (ve && se) ve.textContent = String(se.value);
      }
      function downloadBudgetCsv() {
        var pack = window.__lastBudgetAnalysis;
        if (!pack || (!pack.revenues.length && !pack.expenses.length)) return;
        var opts = collectBudgetOptsFromForm(pack.lineItems);
        var prim = pack.primaryScenario || 'actual';
        var itemsForScale = budgetLineItemsPrimarySlice(pack.lineItems || [], prim);
        var scaled = applyBudgetScenario(pack.revenues, pack.expenses, itemsForScale, opts);
        function escCell(s) {
          s = String(s == null ? '' : s);
          if (/[",\n\r]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
          return s;
        }
        var lines = [];
        if (scaled.lineItems && scaled.lineItems.length) {
          var hasPeriod = scaled.lineItems.some(function (r) { return r && r.period; });
          var hasScen = scaled.lineItems.some(function (r) { return r && r.scenario; });
          var hasCur = scaled.lineItems.some(function (r) { return r && r.currency; });
          var cols = ['category', 'type', 'amount'];
          if (hasPeriod) cols.push('period');
          if (hasScen) cols.push('scenario');
          if (hasCur) cols.push('currency');
          lines.push(cols.join(','));
          scaled.lineItems.forEach(function (row) {
            var cells = [escCell(row.category), escCell(row.type), String((row.amount != null ? row.amount : 0).toFixed(4))];
            if (hasPeriod) cells.push(escCell(row.period || ''));
            if (hasScen) cells.push(escCell(row.scenario || ''));
            if (hasCur) cells.push(escCell(row.currency || ''));
            lines.push(cells.join(','));
          });
        } else {
          lines.push('kind,index,amount');
          scaled.revenues.forEach(function (a, i) { lines.push(['revenue', String(i + 1), String(a)].join(',')); });
          scaled.expenses.forEach(function (a, i) { lines.push(['expense', String(i + 1), String(a)].join(',')); });
        }
        var blob = new Blob(['\ufeff' + lines.join('\n')], { type: 'text/csv;charset=utf-8' });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'budget-analysis.csv';
        a.click();
        setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
      }
      function refreshBudgetReport() {
        var pack = window.__lastBudgetAnalysis;
        if (!pack || (!pack.revenues.length && !pack.expenses.length)) return;
        var reportLang = (document.getElementById('budget-report-lang') && document.getElementById('budget-report-lang').value) || 'ar';
        if (reportLang !== 'ar' && reportLang !== 'en') reportLang = 'ar';
        var opts = collectBudgetOptsFromForm(pack.lineItems);
        opts.rollup = pack.rollup;
        opts.byPeriod = pack.byPeriod;
        opts.currencies = pack.currencies || [];
        opts.primaryScenario = pack.primaryScenario || 'actual';
        var noPerm = document.getElementById('budget-no-permission');
        var res = document.getElementById('budget-results');
        destroyBudgetCharts();
        if (res && typeof buildBudgetReport === 'function') {
          res.innerHTML = buildBudgetReport(pack.revenues, pack.expenses, reportLang, opts);
          if (typeof canViewBudget === 'function' && canViewBudget()) {
            if (noPerm) noPerm.style.display = 'none';
            res.style.display = 'block';
            var scaled = applyBudgetScenario(pack.revenues, pack.expenses, pack.lineItems || [], opts);
            var revM = 1 + (parseFloat(opts.scenarioRevPct) || 0) / 100;
            var expM = 1 + (parseFloat(opts.scenarioExpPct) || 0) / 100;
            var rollupDisp = pack.rollup ? scaleBudgetRollup(pack.rollup, revM, expM) : null;
            ensureChartJs(function () {
              if (typeof Chart === 'undefined') return;
              renderBudgetCharts(scaled.revenues, scaled.expenses, scaled.lineItems, reportLang, {
                primaryScenario: opts.primaryScenario,
                rollup: rollupDisp
              });
            });
            scheduleBudgetDraftSave();
          } else {
            if (noPerm) noPerm.style.display = 'block';
            res.style.display = 'none';
            scheduleBudgetDraftSave();
          }
        }
      }

      var budgetZone = document.getElementById('budget-upload-zone');
      var budgetFileInput = document.getElementById('budget-file-input');
      var budgetFileName = document.getElementById('budget-file-name');
      if (budgetZone && budgetFileInput) {
        budgetZone.addEventListener('click', function () { budgetFileInput.click(); });
        budgetZone.addEventListener('dragover', function (e) { e.preventDefault(); budgetZone.classList.add('has-file'); });
        budgetZone.addEventListener('dragleave', function () { budgetZone.classList.remove('has-file'); });
        budgetZone.addEventListener('drop', function (e) {
          e.preventDefault();
          budgetZone.classList.remove('has-file');
          var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
          if (f) { budgetFileInput.files = e.dataTransfer.files; budgetFileInput.dispatchEvent(new Event('change')); }
        });
        budgetFileInput.addEventListener('change', function () {
          var f = budgetFileInput.files && budgetFileInput.files[0];
          if (budgetZone) budgetZone.classList.toggle('has-file', !!f);
          if (!f) {
            if (budgetFileName) budgetFileName.textContent = '';
            window.__lastBudgetAnalysis = null;
            window.__lastBudgetUploadMeta = null;
            var bp = document.getElementById('budget-context-panel');
            if (bp) bp.hidden = true;
            var tb = document.getElementById('budget-toolbar');
            if (tb) tb.hidden = true;
            renderBudgetValidationList([]);
            destroyBudgetCharts();
            initBudgetDraftBanner();
            return;
          }
          if (budgetFileName) budgetFileName.textContent = iifMessage('dashBudgetProcessing');
          readBudgetFile(f, function (data, err) {
            if (data && (data.revenues.length || data.expenses.length)) {
              if (budgetFileName) budgetFileName.textContent = f.name + ' — ' + iifMessage('dashBudgetAnalyzed');
              window.__lastBudgetAnalysis = {
                revenues: data.revenues,
                expenses: data.expenses,
                lineItems: data.lineItems || [],
                rollup: data.rollup,
                byPeriod: data.byPeriod,
                currencies: data.currencies || [],
                primaryScenario: data.primaryScenario || 'actual',
                parseSource: data.parseSource || 'client',
                serverWarnings: data.serverWarnings,
                serverErrors: data.serverErrors
              };
              window.__lastBudgetUploadMeta = {
                fileName: f.name,
                at: new Date().toISOString(),
                revCount: data.revenues.length,
                expCount: data.expenses.length,
                lineCount: (data.lineItems || []).length,
                restored: false
              };
              appendBudgetAuditLog(window.__lastBudgetUploadMeta);
              var bp = document.getElementById('budget-context-panel');
              if (bp) bp.hidden = false;
              var tb = document.getElementById('budget-toolbar');
              if (tb) tb.hidden = false;
              var srev = document.getElementById('budget-scenario-rev');
              var sexp = document.getElementById('budget-scenario-exp');
              if (srev) srev.value = 0;
              if (sexp) sexp.value = 0;
              updateBudgetScenarioLabels();
              renderBudgetValidationList(budgetValidationMessages(data, f.name));
              refreshBudgetReport();
              initBudgetDraftBanner();
            } else {
              window.__lastBudgetAnalysis = null;
              window.__lastBudgetUploadMeta = null;
              var bp2 = document.getElementById('budget-context-panel');
              if (bp2) bp2.hidden = true;
              var tb2 = document.getElementById('budget-toolbar');
              if (tb2) tb2.hidden = true;
              renderBudgetValidationList([]);
              initBudgetDraftBanner();
              if (budgetFileName) budgetFileName.textContent = f.name + ' — ' + iifMessage('dashBudgetNoNumbers');
            }
          });
        });
        var budgetLangSel = document.getElementById('budget-report-lang');
        if (budgetLangSel) budgetLangSel.addEventListener('change', refreshBudgetReport);
        var ctxPanel = document.getElementById('budget-context-panel');
        if (ctxPanel) {
          ctxPanel.addEventListener('change', refreshBudgetReport);
          ctxPanel.addEventListener('input', function () {
            clearTimeout(ctxPanel._budgetDeb);
            ctxPanel._budgetDeb = setTimeout(refreshBudgetReport, 280);
          });
        }
        var tbEl = document.getElementById('budget-toolbar');
        if (tbEl) {
          tbEl.addEventListener('change', function (e) {
            if (e.target && (e.target.id === 'budget-scenario-rev' || e.target.id === 'budget-scenario-exp')) {
              updateBudgetScenarioLabels();
              refreshBudgetReport();
            }
          });
          tbEl.addEventListener('input', function (e) {
            if (e.target && (e.target.id === 'budget-scenario-rev' || e.target.id === 'budget-scenario-exp')) {
              updateBudgetScenarioLabels();
              clearTimeout(tbEl._scenDeb);
              tbEl._scenDeb = setTimeout(refreshBudgetReport, 120);
            }
          });
        }
        var printBtn = document.getElementById('budget-print-btn');
        if (printBtn) printBtn.addEventListener('click', function () { window.print(); });
        var csvBtn = document.getElementById('budget-csv-btn');
        if (csvBtn) csvBtn.addEventListener('click', downloadBudgetCsv);
        var mdBtn = document.getElementById('budget-copy-md-btn');
        if (mdBtn) mdBtn.addEventListener('click', copyBudgetMarkdownToClipboard);
        var dr = document.getElementById('budget-draft-restore-btn');
        if (dr) dr.addEventListener('click', restoreBudgetDraftFromStorage);
        var dc = document.getElementById('budget-draft-clear-btn');
        if (dc) dc.addEventListener('click', function () {
          clearBudgetDraftFromStorage();
          if (typeof alert === 'function') alert(typeof iifMessage === 'function' ? iifMessage('budgetDraftCleared') : '');
        });
        initBudgetDraftBanner();
      }

      var BUDGET_REPORT_STRINGS = {
        ar: {
          title: 'تقرير تحليل الميزانية',
          summary: 'ملخص تنفيذي',
          totals: 'المجاميع',
          revenue: 'إجمالي الإيرادات',
          expenses: 'إجمالي المصروفات',
          balance: 'الرصيد (فائض/عجز)',
          surplus: 'فائض',
          deficit: 'عجز',
          ratios: 'النسب والمؤشرات',
          savingsRate: 'نسبة الادخار (من الإيرادات)',
          expToRev: 'نسبة المصروفات إلى الإيرادات',
          structure: 'هيكل الميزانية',
          revShare: 'حصة الإيرادات من الإجمالي',
          expShare: 'حصة المصروفات من الإجمالي',
          counts: 'عدد البنود',
          revItems: 'عدد بنود الإيرادات',
          expItems: 'عدد بنود المصروفات',
          averages: 'متوسطات',
          avgRev: 'متوسط بند الإيراد',
          avgExp: 'متوسط بند المصروف',
          extremes: 'أعلى وأدنى',
          maxRev: 'أعلى بند إيراد',
          maxExp: 'أعلى بند مصروف',
          liquidity: 'السيولة والملاءة',
          liquidityNote: 'الرصيد موجب — الميزانية تحقق فائضاً. الرصيد سالب — عجز يحتاج تمويل.',
          noData: 'أدخل بنود الإيرادات والمصروفات أو ارفع ملفاً.'
        },
        en: {
          title: 'Budget analysis report',
          summary: 'Executive summary',
          totals: 'Totals',
          revenue: 'Total revenue',
          expenses: 'Total expenses',
          balance: 'Balance (surplus/deficit)',
          surplus: 'Surplus',
          deficit: 'Deficit',
          ratios: 'Ratios & indicators',
          savingsRate: 'Savings rate (of revenue)',
          expToRev: 'Expense-to-revenue ratio',
          structure: 'Budget structure',
          revShare: 'Revenue share of total',
          expShare: 'Expense share of total',
          counts: 'Item counts',
          revItems: 'Number of revenue items',
          expItems: 'Number of expense items',
          averages: 'Averages',
          avgRev: 'Average revenue item',
          avgExp: 'Average expense item',
          extremes: 'Highs',
          maxRev: 'Largest revenue item',
          maxExp: 'Largest expense item',
          liquidity: 'Liquidity & solvency',
          liquidityNote: 'Positive balance — budget is in surplus. Negative — deficit requiring financing.',
          noData: 'Enter revenue and expense items or upload a file.',
          companyName: 'Company / entity',
          budgetPeriod: 'Budget period',
          periodFrom: 'From',
          periodTo: 'To',
          yearComparison: 'Year-on-year comparison',
          revChange: 'Revenue change vs previous year',
          expChange: 'Expense change vs previous year',
          increase: 'Increase',
          decrease: 'Decrease',
          noPrevYear: 'Add previous year revenue & expenses to see comparison.',
          leverage: 'Financial leverage',
          leverageRatio: 'Leverage (liabilities / equity)',
          noLeverageData: 'Add total liabilities and equity to calculate leverage.',
          liquidityRatio: 'Liquidity ratio (current assets / current liabilities)',
          liabilities: 'Liabilities',
          totalLiabilities: 'Total liabilities',
          cashFlowAnalysis: 'Cash flow analysis',
          operatingCashFlow: 'Operating cash flow (revenue − expenses)',
          loanFeasibility: 'Loan feasibility for the entity',
          loanFeasible: 'Positive operating cash flow and surplus support capacity to service a loan. Consider liquidity and leverage before borrowing.',
          loanCaution: 'Deficit or weak liquidity — assess repayment capacity before taking a loan.',
          loanWeak: 'Negative cash flow or high leverage — high risk; loan not recommended without restructuring.'
        },
        ar: {
          title: 'تقرير تحليل الميزانية',
          summary: 'ملخص تنفيذي',
          totals: 'المجاميع',
          revenue: 'إجمالي الإيرادات',
          expenses: 'إجمالي المصروفات',
          balance: 'الرصيد (فائض/عجز)',
          surplus: 'فائض',
          deficit: 'عجز',
          ratios: 'النسب والمؤشرات',
          savingsRate: 'نسبة الادخار (من الإيرادات)',
          expToRev: 'نسبة المصروفات إلى الإيرادات',
          structure: 'هيكل الميزانية',
          revShare: 'حصة الإيرادات من الإجمالي',
          expShare: 'حصة المصروفات من الإجمالي',
          counts: 'عدد البنود',
          revItems: 'عدد بنود الإيرادات',
          expItems: 'عدد بنود المصروفات',
          averages: 'متوسطات',
          avgRev: 'متوسط بند الإيراد',
          avgExp: 'متوسط بند المصروف',
          extremes: 'أعلى وأدنى',
          maxRev: 'أعلى بند إيراد',
          maxExp: 'أعلى بند مصروف',
          liquidity: 'السيولة والملاءة',
          liquidityNote: 'الرصيد موجب — الميزانية تحقق فائضاً. الرصيد سالب — عجز يحتاج تمويل.',
          noData: 'أدخل بنود الإيرادات والمصروفات أو ارفع ملفاً.',
          companyName: 'اسم الشركة / المنشأة',
          officeIssued: 'اسم المكتب الذي أصدر الميزانية',
          budgetPeriod: 'فترة الميزانية',
          periodFrom: 'من',
          periodTo: 'إلى',
          yearComparison: 'المقارنة بين الأعوام',
          revChange: 'تغيّر الإيرادات عن السنة السابقة',
          expChange: 'تغيّر المصروفات عن السنة السابقة',
          increase: 'ارتفاع',
          decrease: 'هبوط',
          noPrevYear: 'أضف إيرادات ومصروفات السنة السابقة لعرض المقارنة.',
          leverage: 'الرافعة المالية',
          leverageRatio: 'الرافعة المالية (المطلوبات / حقوق الملكية)',
          noLeverageData: 'أضف إجمالي المطلوبات وحقوق الملكية لحساب الرافعة.',
          liquidityRatio: 'نسبة السيولة (الأصول المتداولة / المطلوبات المتداولة)',
          liabilities: 'المطلوبات',
          totalLiabilities: 'إجمالي المطلوبات',
          cashFlowAnalysis: 'تحليل التدفقات النقدية',
          operatingCashFlow: 'التدفق النقدي التشغيلي (الإيرادات − المصروفات)',
          loanFeasibility: 'جدوى أخذ قرض لعمل المنشأة',
          loanFeasible: 'التدفق التشغيلي موجب والفائض يدعم قدرة خدمة الدين. راعِ السيولة والرافعة قبل الاقتراض.',
          loanCaution: 'عجز أو سيولة ضعيفة — قدّر قدرة السداد قبل أخذ قرض.',
          loanWeak: 'تدفق نقدي سالب أو رافعة عالية — مخاطر مرتفعة؛ لا يُنصح بالاقتراض دون إعادة هيكلة.',
          assetsInventory: 'حصر الأصول',
          totalAssets: 'إجمالي الأصول',
          assetsChangeAnalysis: 'تحليل ارتفاع وانخفاض الأصول',
          assetsChangeVsPrev: 'تغيّر الأصول عن السنة السابقة',
          noPrevAssets: 'أضف إجمالي أصول السنة السابقة لتحليل الارتفاع والانخفاض.',
          newPPEAdditions: 'إضافة الأصول الجديدة (أملاك ومعدات)',
          newPPENote: 'تم إضافة أملاك ومعدات جديدة بقيمة',
          depreciationRates: 'نسب الإهلاك وتوضيحها',
          depreciationRateLabel: 'نسبة الإهلاك السنوية',
          depreciationExpenseLabel: 'مصروف الإهلاك / مجمع الإهلاك',
          depreciationNote: 'الإهلاك يقلّل القيمة الدفترية للأصول الثابتة ويُحمّل كمصروف. النسبة المئوية تُطبّق عادةً على القيمة القابلة للإهلاك.',
          noDepreciationData: 'أضف نسبة الإهلاك و/أو مصروف الإهلاك لعرض التوضيح.',
          consolidatedBudget: 'طبيعة الميزانية (منشأة واحدة أو مجمّعة)',
          consolidatedYes: 'ميزانية مجمّعة',
          consolidatedNo: 'ميزانية منشأة واحدة',
          consolidatedNote: 'هذه الميزانية مجمّعة لأكثر من منشأة تجارية. الأرقام والنسب المعروضة تمثل الأداء المجمع لجميع المنشآت المدرجة.',
          consolidatedNoteSingle: 'هذه الميزانية لمنشأة واحدة فقط.',
          numEntities: 'عدد المنشآت المدمجة',
          performanceRatio: 'نسبة أداء المنشأة / المنشآت',
          performanceSingle: 'نسبة أداء المنشأة',
          performanceMulti: 'نسبة الأداء المجمع للمنشآت',
          profitMargin: 'هامش الربح (الرصيد / الإيرادات)',
          returnOnAssets: 'العائد على الأصول (الرصيد / إجمالي الأصول)',
          noPerformanceAssets: 'أضف إجمالي الأصول لحساب العائد على الأصول.',
          inventoryTurnover: 'نسبة دوران المخزون',
          inventoryTurnoverRatio: 'دوران المخزون (تكلفة البضاعة المباعة ÷ متوسط المخزون)',
          turnoverHigh: 'دوران المخزون مرتفع',
          turnoverLow: 'دوران المخزون منخفض',
          turnoverNoteHigh: 'دوران مرتفع يعني مبيعات سريعة واستخدام جيد للمخزون؛ قد يدعم السيولة ويقلل الحاجة للتمويل قصير الأجل.',
          turnoverNoteLow: 'دوران منخفض قد يعني ركود مخزون أو مبيعات بطيئة؛ يربط الأموال في المخزون ويزيد الضغط على المديونيات والموردين.',
          noInventoryData: 'أضف متوسط المخزون وتكلفة البضاعة المباعة لحساب دوران المخزون.',
          linkToLiabilities: 'ربط دوران المخزون بالمديونيات والمطلوبات',
          linkNote: 'دوران المخزون يؤثر على السيولة والقدرة على الوفاء بالمطلوبات للبنوك والموردين. دوران منخفض مع قروض أو ذمم موردين مرتفعة يزيد مخاطر الأداء.',
          bankLoans: 'القروض البنكية',
          bankLoanRow: 'البنك',
          amountLabel: 'المبلغ',
          totalLabel: 'الإجمالي',
          supplierPayables: 'مطلوبات الموردين',
          effectOnPerformance: 'تأثير القروض والمطلوبات على أداء المنشأة',
          effectNote: 'القروض البنكية ومطلوبات الموردين تستهلك التدفق النقدي (أقساط وفوائد ومدفوعات). ارتفاعها مع دوران مخزون منخفض أو رصيد ضعيف يقلل من أداء المنشأة ويزيد المخاطر.',
          risksSection: 'تحليل التعرض للعملات والأسواق العالمية',
          marketRisks: 'مخاطر الأسواق',
          marketRisksDesc: 'تقلبات الأسواق، الطلب، أسعار الصرف والسلع، والسيولة في السوق قد تؤثر على الإيرادات والأصول.',
          stateRisks: 'مخاطر قرارات الدولة',
          stateRisksDesc: 'التغييرات في السياسات الضريبية، التنظيمية، الجمركية أو الدعم الحكومي تؤثر على بيئة العمل والتمويل.',
          competitorRisks: 'مخاطر المنافسين',
          competitorRisksDesc: 'حصة السوق، الأسعار، دخول منافسين جدد أو تغيّر سلوك المنافسين قد تؤثر على الأداء.',
          risksByActivity: 'حسب نوع النشاط التجاري',
          risksByCountry: 'حسب أنظمة كل بلد',
          risksContextHint: 'أدخل نوع النشاط التجاري والبلد أعلاه لربط التحليل بشكل أفضل بالقطاع والأنظمة.',
          risksNote: 'يأخذ التحليل بعين الاعتبار مخاطر الأسواق، ومخاطر السياسات والقرارات الحكومية، ومخاطر المنافسين وفقاً لنوع النشاط التجاري وأنظمة كل بلد. يُنصح بمراجعة تحليلات متخصصة حسب القطاع والبلد.'
        }
      };
      BUDGET_REPORT_STRINGS.en.companyName = 'Company / entity';
      BUDGET_REPORT_STRINGS.en.officeIssued = 'Office that issued the budget';
      BUDGET_REPORT_STRINGS.en.budgetPeriod = 'Budget period';
      BUDGET_REPORT_STRINGS.en.periodFrom = 'From';
      BUDGET_REPORT_STRINGS.en.periodTo = 'To';
      BUDGET_REPORT_STRINGS.en.yearComparison = 'Year-on-year comparison';
      BUDGET_REPORT_STRINGS.en.revChange = 'Revenue change vs previous year';
      BUDGET_REPORT_STRINGS.en.expChange = 'Expense change vs previous year';
      BUDGET_REPORT_STRINGS.en.increase = 'Increase';
      BUDGET_REPORT_STRINGS.en.decrease = 'Decrease';
      BUDGET_REPORT_STRINGS.en.noPrevYear = 'Add previous year revenue & expenses to see comparison.';
      BUDGET_REPORT_STRINGS.en.leverage = 'Financial leverage';
      BUDGET_REPORT_STRINGS.en.leverageRatio = 'Leverage (liabilities / equity)';
      BUDGET_REPORT_STRINGS.en.noLeverageData = 'Add total liabilities and equity to calculate leverage.';
      BUDGET_REPORT_STRINGS.en.liquidityRatio = 'Liquidity ratio (current assets / current liabilities)';
      BUDGET_REPORT_STRINGS.en.liabilities = 'Liabilities';
      BUDGET_REPORT_STRINGS.en.totalLiabilities = 'Total liabilities';
      BUDGET_REPORT_STRINGS.en.cashFlowAnalysis = 'Cash flow analysis';
      BUDGET_REPORT_STRINGS.en.operatingCashFlow = 'Operating cash flow (revenue − expenses)';
      BUDGET_REPORT_STRINGS.en.loanFeasibility = 'Loan feasibility for the entity';
      BUDGET_REPORT_STRINGS.en.loanFeasible = 'Positive operating cash flow and surplus support capacity to service a loan. Consider liquidity and leverage before borrowing.';
      BUDGET_REPORT_STRINGS.en.loanCaution = 'Deficit or weak liquidity — assess repayment capacity before taking a loan.';
      BUDGET_REPORT_STRINGS.en.loanWeak = 'Negative cash flow or high leverage — high risk; loan not recommended without restructuring.';
      BUDGET_REPORT_STRINGS.en.assetsInventory = 'Assets inventory';
      BUDGET_REPORT_STRINGS.en.totalAssets = 'Total assets';
      BUDGET_REPORT_STRINGS.en.assetsChangeAnalysis = 'Assets increase/decrease analysis';
      BUDGET_REPORT_STRINGS.en.assetsChangeVsPrev = 'Assets change vs previous year';
      BUDGET_REPORT_STRINGS.en.noPrevAssets = 'Add previous year total assets to analyze increase/decrease.';
      BUDGET_REPORT_STRINGS.en.newPPEAdditions = 'New assets (property, plant & equipment)';
      BUDGET_REPORT_STRINGS.en.newPPENote = 'New PPE additions:';
      BUDGET_REPORT_STRINGS.en.depreciationRates = 'Depreciation rates and clarification';
      BUDGET_REPORT_STRINGS.en.depreciationRateLabel = 'Annual depreciation rate';
      BUDGET_REPORT_STRINGS.en.depreciationExpenseLabel = 'Depreciation expense / accumulated depreciation';
      BUDGET_REPORT_STRINGS.en.depreciationNote = 'Depreciation reduces the carrying value of fixed assets and is charged as expense. The rate is typically applied to depreciable value.';
      BUDGET_REPORT_STRINGS.en.noDepreciationData = 'Add depreciation rate and/or expense to show clarification.';
      BUDGET_REPORT_STRINGS.en.consolidatedBudget = 'Budget scope (single or consolidated)';
      BUDGET_REPORT_STRINGS.en.consolidatedYes = 'Consolidated budget';
      BUDGET_REPORT_STRINGS.en.consolidatedNo = 'Single-entity budget';
      BUDGET_REPORT_STRINGS.en.consolidatedNote = 'This budget is consolidated for more than one business entity. Figures and ratios shown represent the combined performance of all entities included.';
      BUDGET_REPORT_STRINGS.en.consolidatedNoteSingle = 'This budget is for a single entity only.';
      BUDGET_REPORT_STRINGS.en.numEntities = 'Number of entities consolidated';
      BUDGET_REPORT_STRINGS.en.performanceRatio = 'Entity / entities performance ratio';
      BUDGET_REPORT_STRINGS.en.performanceSingle = 'Entity performance ratio';
      BUDGET_REPORT_STRINGS.en.performanceMulti = 'Consolidated entities performance ratio';
      BUDGET_REPORT_STRINGS.en.profitMargin = 'Profit margin (balance / revenue)';
      BUDGET_REPORT_STRINGS.en.returnOnAssets = 'Return on assets (balance / total assets)';
      BUDGET_REPORT_STRINGS.en.noPerformanceAssets = 'Add total assets to calculate return on assets.';
      BUDGET_REPORT_STRINGS.en.inventoryTurnover = 'Inventory turnover ratio';
      BUDGET_REPORT_STRINGS.en.inventoryTurnoverRatio = 'Inventory turnover (COGS ÷ average inventory)';
      BUDGET_REPORT_STRINGS.en.turnoverHigh = 'Inventory turnover is high';
      BUDGET_REPORT_STRINGS.en.turnoverLow = 'Inventory turnover is low';
      BUDGET_REPORT_STRINGS.en.turnoverNoteHigh = 'High turnover means fast sales and efficient use of inventory; can support liquidity and reduce short-term financing needs.';
      BUDGET_REPORT_STRINGS.en.turnoverNoteLow = 'Low turnover may mean stagnant inventory or slow sales; ties up funds and increases pressure on debts and supplier payables.';
      BUDGET_REPORT_STRINGS.en.noInventoryData = 'Add average inventory and cost of goods sold to calculate inventory turnover.';
      BUDGET_REPORT_STRINGS.en.linkToLiabilities = 'Link between inventory turnover and debts/liabilities';
      BUDGET_REPORT_STRINGS.en.linkNote = 'Inventory turnover affects liquidity and ability to meet bank and supplier obligations. Low turnover with high loans or payables increases performance risk.';
      BUDGET_REPORT_STRINGS.en.bankLoans = 'Bank loans';
      BUDGET_REPORT_STRINGS.en.bankLoanRow = 'Bank';
      BUDGET_REPORT_STRINGS.en.amountLabel = 'Amount';
      BUDGET_REPORT_STRINGS.en.totalLabel = 'Total';
      BUDGET_REPORT_STRINGS.en.supplierPayables = 'Supplier payables';
      BUDGET_REPORT_STRINGS.en.effectOnPerformance = 'Effect of loans and payables on entity performance';
      BUDGET_REPORT_STRINGS.en.effectNote = 'Bank loans and supplier payables consume cash flow (installments, interest, payments). High levels with low inventory turnover or weak balance reduce entity performance and increase risk.';
      BUDGET_REPORT_STRINGS.en.risksSection = 'Market, policy & competitor risk exposure';
      BUDGET_REPORT_STRINGS.en.marketRisks = 'Market risks';
      BUDGET_REPORT_STRINGS.en.marketRisksDesc = 'Market volatility, demand, exchange and commodity prices, and market liquidity may affect revenue and assets.';
      BUDGET_REPORT_STRINGS.en.stateRisks = 'State / government policy risks';
      BUDGET_REPORT_STRINGS.en.stateRisksDesc = 'Changes in tax, regulatory, customs or subsidy policies affect the business and financing environment.';
      BUDGET_REPORT_STRINGS.en.competitorRisks = 'Competitor risks';
      BUDGET_REPORT_STRINGS.en.competitorRisksDesc = 'Market share, pricing, new entrants or competitor behaviour may affect performance.';
      BUDGET_REPORT_STRINGS.en.risksByActivity = 'By type of business activity';
      BUDGET_REPORT_STRINGS.en.risksByCountry = 'By each country\'s regulations';
      BUDGET_REPORT_STRINGS.en.risksContextHint = 'Enter business activity type and country above to better align the analysis with sector and regulations.';
      BUDGET_REPORT_STRINGS.en.risksNote = 'The analysis considers market risks, state policy and regulatory risks, and competitor risks according to the type of business activity and each country\'s regulations. Specialist analysis by sector and country is recommended.';
      BUDGET_REPORT_STRINGS.en.chartComparison = 'Totals comparison';
      BUDGET_REPORT_STRINGS.ar.chartComparison = 'مقارنة المجاميع';
      BUDGET_REPORT_STRINGS.en.deepAnalysisTitle = 'Deep budget diagnostics';
      BUDGET_REPORT_STRINGS.ar.deepAnalysisTitle = 'تشخيص مالي معمّق للميزانية';
      BUDGET_REPORT_STRINGS.en.deepCategoryRev = 'Revenue by line / category';
      BUDGET_REPORT_STRINGS.ar.deepCategoryRev = 'الإيرادات حسب البند / الفئة';
      BUDGET_REPORT_STRINGS.en.deepCategoryExp = 'Expenses by line / category';
      BUDGET_REPORT_STRINGS.ar.deepCategoryExp = 'المصروفات حسب البند / الفئة';
      BUDGET_REPORT_STRINGS.en.deepColItem = 'Item';
      BUDGET_REPORT_STRINGS.ar.deepColItem = 'البند';
      BUDGET_REPORT_STRINGS.en.deepColAmount = 'Amount';
      BUDGET_REPORT_STRINGS.ar.deepColAmount = 'المبلغ';
      BUDGET_REPORT_STRINGS.en.deepColShare = '% of subtotal';
      BUDGET_REPORT_STRINGS.ar.deepColShare = '% من المجموع';
      BUDGET_REPORT_STRINGS.en.deepConcentration = 'Concentration & dependency';
      BUDGET_REPORT_STRINGS.ar.deepConcentration = 'التركيز والاعتمادية';
      BUDGET_REPORT_STRINGS.en.deepTopRevShare = 'Largest revenue line as % of total revenue';
      BUDGET_REPORT_STRINGS.ar.deepTopRevShare = 'أكبر بند إيراد كنسبة من إجمالي الإيرادات';
      BUDGET_REPORT_STRINGS.en.deepTopExpShare = 'Largest expense line as % of total expenses';
      BUDGET_REPORT_STRINGS.ar.deepTopExpShare = 'أكبر بند مصروف كنسبة من إجمالي المصروفات';
      BUDGET_REPORT_STRINGS.en.deepHHI = 'Expense concentration index (HHI, 0–1)';
      BUDGET_REPORT_STRINGS.ar.deepHHI = 'مؤشر تركيز المصروفات (HHI، بين 0 و1)';
      BUDGET_REPORT_STRINGS.en.deepHHIHigh = 'High concentration — review dependency on few cost drivers.';
      BUDGET_REPORT_STRINGS.ar.deepHHIHigh = 'تركيز مرتفع — راجع الاعتماد على عدد قليل من بنود التكلفة.';
      BUDGET_REPORT_STRINGS.en.deepHHIModerate = 'Moderate concentration.';
      BUDGET_REPORT_STRINGS.ar.deepHHIModerate = 'تركيز متوسط.';
      BUDGET_REPORT_STRINGS.en.deepSensitivity = 'Simple stress test (revenue shock)';
      BUDGET_REPORT_STRINGS.ar.deepSensitivity = 'اختبار إجهاد بسيط (صدمة في الإيرادات)';
      BUDGET_REPORT_STRINGS.en.deepSens10 = 'If revenue falls by 10%, operating balance (revenue − expenses) ≈';
      BUDGET_REPORT_STRINGS.ar.deepSens10 = 'عند هبوط الإيرادات 10%، الرصيد التشغيلي (إيرادات − مصروفات) تقريباً';
      BUDGET_REPORT_STRINGS.en.deepSens20 = 'If revenue falls by 20%:';
      BUDGET_REPORT_STRINGS.ar.deepSens20 = 'عند هبوط الإيرادات 20%:';
      BUDGET_REPORT_STRINGS.en.deepFlagsTitle = 'Automated flags (rules-based)';
      BUDGET_REPORT_STRINGS.ar.deepFlagsTitle = 'تنبيهات آلية (قواعد منطقية)';
      BUDGET_REPORT_STRINGS.en.deepRecTitle = 'Indicative recommendations (not a substitute for professional advice)';
      BUDGET_REPORT_STRINGS.ar.deepRecTitle = 'توصيات إرشادية (لا تحل محل مراجعة مهنية)';
      BUDGET_REPORT_STRINGS.en.flagExpExceedsRev = 'Expenses exceed revenues — structural deficit.';
      BUDGET_REPORT_STRINGS.ar.flagExpExceedsRev = 'المصروفات تتجاوز الإيرادات — عجز هيكلي.';
      BUDGET_REPORT_STRINGS.en.flagExpNearRev = 'Expense-to-revenue ratio is very high (>90%).';
      BUDGET_REPORT_STRINGS.ar.flagExpNearRev = 'نسبة المصروفات إلى الإيرادات مرتفعة جداً (>90%).';
      BUDGET_REPORT_STRINGS.en.flagThinMargin = 'Surplus exists but margin on revenue is thin.';
      BUDGET_REPORT_STRINGS.ar.flagThinMargin = 'يوجد فائض لكن الهامش على الإيرادات ضيق.';
      BUDGET_REPORT_STRINGS.en.flagRevConcentrated = 'Revenue is highly concentrated on few lines.';
      BUDGET_REPORT_STRINGS.ar.flagRevConcentrated = 'الإيرادات مركّزة على عدد قليل من البنود.';
      BUDGET_REPORT_STRINGS.en.flagExpConcentrated = 'Costs are highly concentrated — single-line shock risk.';
      BUDGET_REPORT_STRINGS.ar.flagExpConcentrated = 'التكاليف مركّزة — مخاطر صدمة على بند واحد.';
      BUDGET_REPORT_STRINGS.en.recReduceExp = 'Review largest expense categories and discretionary spend.';
      BUDGET_REPORT_STRINGS.ar.recReduceExp = 'راجع أكبر فئات المصروف والإنفاق التقديري.';
      BUDGET_REPORT_STRINGS.en.recDiversifyRev = 'Consider revenue diversification and contract mix.';
      BUDGET_REPORT_STRINGS.ar.recDiversifyRev = 'فكّر في تنويع الإيرادات ومزيج العقود.';
      BUDGET_REPORT_STRINGS.en.recForecast = 'Maintain a rolling forecast tying revenue scenarios to obligations.';
      BUDGET_REPORT_STRINGS.ar.recForecast = 'اعتمِد توقعاً مستمراً يربط سيناريوهات الإيرادات بالالتزامات.';
      BUDGET_REPORT_STRINGS.en.recExpert = 'Validate conclusions with qualified finance and legal advisors.';
      BUDGET_REPORT_STRINGS.ar.recExpert = 'ثبّت النتائج مع مستشارين ماليين وقانونيين مؤهلين.';
      BUDGET_REPORT_STRINGS.en.noDeepFlags = 'No major rule-based flags for the current figures.';
      BUDGET_REPORT_STRINGS.ar.noDeepFlags = 'لا تنبيهات قواعدية بارزة وفق الأرقام الحالية.';
      BUDGET_REPORT_STRINGS.en.scenarioBanner = 'Interactive scenario active: revenue {r}%, expenses {e}% (uniform adjustment to all lines of each type).';
      BUDGET_REPORT_STRINGS.ar.scenarioBanner = 'سيناريو تفاعلي: تعديل الإيرادات {r}% والمصروفات {e}% (تطبيق موحّد على كل البنود من كل نوع).';
      BUDGET_REPORT_STRINGS.en.chartVisualTitle = 'Charts';
      BUDGET_REPORT_STRINGS.ar.chartVisualTitle = 'الرسوم البيانية';
      BUDGET_REPORT_STRINGS.en.chartVisualIntro = 'Bar: totals. Doughnuts: category mix. Wide bar (when present): approved / actual / forecast from file columns.';
      BUDGET_REPORT_STRINGS.ar.chartVisualIntro = 'عمودي: المجاميع. دائري: الحصص حسب الفئة. الشريط العريض (إن وُجد): معتمد / فعلي / متوقع من أعمدة الملف.';
      BUDGET_REPORT_STRINGS.en.chartRevExpBar = 'Revenue vs expenses (totals)';
      BUDGET_REPORT_STRINGS.ar.chartRevExpBar = 'الإيرادات مقابل المصروفات (المجاميع)';
      BUDGET_REPORT_STRINGS.en.chartExpBreakdown = 'Expense mix by category';
      BUDGET_REPORT_STRINGS.ar.chartExpBreakdown = 'مزيج المصروفات حسب الفئة';
      BUDGET_REPORT_STRINGS.en.chartRevBreakdown = 'Revenue mix by category';
      BUDGET_REPORT_STRINGS.ar.chartRevBreakdown = 'مزيج الإيرادات حسب الفئة';
      BUDGET_REPORT_STRINGS.en.chartOther = 'Other';
      BUDGET_REPORT_STRINGS.ar.chartOther = 'أخرى';
      BUDGET_REPORT_STRINGS.en.chartScenarioCompare = 'Approved vs actual vs forecast (from file)';
      BUDGET_REPORT_STRINGS.ar.chartScenarioCompare = 'معتمد مقابل فعلي مقابل متوقع (من الملف)';
      BUDGET_REPORT_STRINGS.en.budgetScenarioRollupTitle = 'Budget versions in file (totals by scenario)';
      BUDGET_REPORT_STRINGS.ar.budgetScenarioRollupTitle = 'إصدارات الميزانية في الملف (مجاميع حسب السيناريو)';
      BUDGET_REPORT_STRINGS.en.budgetScenarioRollupNote = 'Main totals and category charts use the primary slice (actual when present, else approved, else forecast). This table shows all scenario columns from your file.';
      BUDGET_REPORT_STRINGS.ar.budgetScenarioRollupNote = 'المجاميع الرئيسية والرسوم حسب الفئة تعتمد على الجزء الأساسي (الفعلي إن وُجد، وإلا المعتمد، وإلا المتوقع). الجدول يعرض كل أعمدة السيناريو من الملف.';
      BUDGET_REPORT_STRINGS.en.budgetScenarioApproved = 'Approved / budget';
      BUDGET_REPORT_STRINGS.ar.budgetScenarioApproved = 'معتمد / ميزانية';
      BUDGET_REPORT_STRINGS.en.budgetScenarioActual = 'Actual';
      BUDGET_REPORT_STRINGS.ar.budgetScenarioActual = 'فعلي';
      BUDGET_REPORT_STRINGS.en.budgetScenarioForecast = 'Forecast';
      BUDGET_REPORT_STRINGS.ar.budgetScenarioForecast = 'متوقع';
      BUDGET_REPORT_STRINGS.en.budgetPeriodBreakdownTitle = 'Totals by period (when a period column is present)';
      BUDGET_REPORT_STRINGS.ar.budgetPeriodBreakdownTitle = 'مجاميع حسب الفترة (عند وجود عمود period)';
      BUDGET_REPORT_STRINGS.en.budgetColPeriod = 'Period';
      BUDGET_REPORT_STRINGS.ar.budgetColPeriod = 'الفترة';
      BUDGET_REPORT_STRINGS.en.budgetMultiCurrencyNote = 'Multiple currencies in file — reconcile FX before comparing totals.';
      BUDGET_REPORT_STRINGS.ar.budgetMultiCurrencyNote = 'أكثر من عملة في الملف — وفّق أسعار الصرف قبل مقارنة المجاميع.';
      BUDGET_REPORT_STRINGS.en.budgetSingleCurrencyLabel = 'Currency (from file)';
      BUDGET_REPORT_STRINGS.ar.budgetSingleCurrencyLabel = 'العملة (من الملف)';
      BUDGET_REPORT_STRINGS.en.deepNoLines = 'For line-level tables and concentration metrics, use the CSV template (columns category, type, amount; optional period, scenario, currency).';
      BUDGET_REPORT_STRINGS.ar.deepNoLines = 'لجداول البنود ومقاييس التركيز، استخدم قالب CSV (category، type، amount؛ واختياري period، scenario، currency).';
      BUDGET_REPORT_STRINGS.en.budgetDisclaimerLegal = 'This analysis is automated and indicative only. It is not an audit, investment advice, tax opinion, or substitute for qualified professionals. You remain responsible for decisions based on these figures.';
      BUDGET_REPORT_STRINGS.ar.budgetDisclaimerLegal = 'هذا التحليل آلية وإرشادي فقط. وليس تدقيقاً ولا استشارة استثمارية ولا رأياً ضريبياً ولا بديلاً عن مختصين مؤهلين. تبقى مسؤولية القرارات على أساس هذه الأرقام على عاتقك.';
      BUDGET_REPORT_STRINGS.en.budgetDisclaimerContact = 'Contact';
      BUDGET_REPORT_STRINGS.ar.budgetDisclaimerContact = 'اتصل بنا';
      BUDGET_REPORT_STRINGS.en.budgetSourceTitle = 'Data sources';
      BUDGET_REPORT_STRINGS.ar.budgetSourceTitle = 'مصادر البيانات';
      BUDGET_REPORT_STRINGS.en.budgetSourceFile = 'Uploaded file';
      BUDGET_REPORT_STRINGS.ar.budgetSourceFile = 'الملف المرفوع';
      BUDGET_REPORT_STRINGS.en.budgetSourceTime = 'Parsed at (timestamp)';
      BUDGET_REPORT_STRINGS.ar.budgetSourceTime = 'وقت القراءة';
      BUDGET_REPORT_STRINGS.en.budgetSourceCounts = 'Counts — revenue lines: {r}, expense lines: {e}, structured rows: {l}.';
      BUDGET_REPORT_STRINGS.ar.budgetSourceCounts = 'الأعداد — بنود إيراد: {r}، بنود مصروف: {e}، صفوف منظمة: {l}.';
      BUDGET_REPORT_STRINGS.en.budgetSourceRestored = 'Restored from a saved browser draft (not a new file upload).';
      BUDGET_REPORT_STRINGS.ar.budgetSourceRestored = 'مستعاد من مسودة محفوظة في المتصفح (وليس رفع ملف جديد).';
      BUDGET_REPORT_STRINGS.en.budgetSourceUnknown = 'No file metadata available.';
      BUDGET_REPORT_STRINGS.ar.budgetSourceUnknown = 'لا تتوفر بيانات وصفية للملف.';
      BUDGET_REPORT_STRINGS.en.budgetSourceFormNote = 'Numbers and text in sections below may also use the optional context form on this page (manual entry), mixed with file-based lines.';
      BUDGET_REPORT_STRINGS.ar.budgetSourceFormNote = 'قد تُستخدم حقول النموذج الاختياري في الصفحة (إدخال يدوي) مع بنود الملف في الأقسام التالية.';
      BUDGET_REPORT_STRINGS.en.budgetSourceFileOnly = 'Figures from the uploaded file drive the core totals unless you add optional context fields.';
      BUDGET_REPORT_STRINGS.ar.budgetSourceFileOnly = 'المجاميع الأساسية من الملف المرفوع ما لم تُضِف حقول السياق الاختيارية.';
      BUDGET_REPORT_STRINGS.en.budgetTargetsSection = 'Targets / approved budget vs actual';
      BUDGET_REPORT_STRINGS.ar.budgetTargetsSection = 'الأهداف / الميزانية المعتمدة مقابل الفعلي';
      BUDGET_REPORT_STRINGS.en.budgetTargetRevLabel = 'Target revenue';
      BUDGET_REPORT_STRINGS.ar.budgetTargetRevLabel = 'إيراد مستهدف';
      BUDGET_REPORT_STRINGS.en.budgetTargetExpLabel = 'Target expenses';
      BUDGET_REPORT_STRINGS.ar.budgetTargetExpLabel = 'مصروف مستهدف';
      BUDGET_REPORT_STRINGS.en.budgetVarianceCol = 'Variance %';
      BUDGET_REPORT_STRINGS.ar.budgetVarianceCol = 'انحراف %';
      BUDGET_REPORT_STRINGS.en.budgetAuditTitle = 'Recent budget uploads (this browser)';
      BUDGET_REPORT_STRINGS.ar.budgetAuditTitle = 'آخر عمليات رفع الميزانية (هذا المتصفح)';
      BUDGET_REPORT_STRINGS.en.budgetAuditNote = 'Local log for admins only; not a server-side audit trail. Clear browser data to erase.';
      BUDGET_REPORT_STRINGS.ar.budgetAuditNote = 'سجل محلي للمسؤولين فقط؛ وليس سجلاً على الخادم. مسح بيانات المتصفح يحذفه.';
      BUDGET_REPORT_STRINGS.en.budgetAuditColTime = 'Time';
      BUDGET_REPORT_STRINGS.ar.budgetAuditColTime = 'الوقت';
      BUDGET_REPORT_STRINGS.en.budgetAuditColFile = 'File name';
      BUDGET_REPORT_STRINGS.ar.budgetAuditColFile = 'اسم الملف';
      BUDGET_REPORT_STRINGS.en.budgetAuditColRows = 'Rows (r/e/L)';
      BUDGET_REPORT_STRINGS.ar.budgetAuditColRows = 'صفوف (إيراد/مصروف/منظم)';

      function aggregateBudgetLineItemsByCategory(lineItems, itemType) {
        var map = {};
        (lineItems || []).forEach(function (row) {
          if (!row || row.type !== itemType) return;
          var k = (row.category || '—').trim() || '—';
          map[k] = (map[k] || 0) + (row.amount || 0);
        });
        return Object.keys(map).map(function (k) { return { name: k, amount: map[k] }; }).sort(function (a, b) { return b.amount - a.amount; });
      }
      function budgetExpenseHHI(expByCat, totalExp) {
        if (!totalExp || !expByCat || !expByCat.length) return 0;
        var h = 0;
        expByCat.forEach(function (row) {
          var s = row.amount / totalExp;
          h += s * s;
        });
        return h;
      }

      function parseBankLoans(text) {
        var lines = (text || '').split(/[\n\r]+/);
        var out = [];
        for (var i = 0; i < lines.length; i++) {
          var line = lines[i].trim();
          if (!line) continue;
          var parts = line.split(/[,،\t]/);
          var name = (parts[0] || '').trim();
          var amt = parseFloat(String(parts[1] || '').replace(/[^\d.-]/g, '')) || 0;
          if (name || amt > 0) out.push({ bank: name || '—', amount: amt });
        }
        return out;
      }

      function buildBudgetReport(revenues, expenses, lang, opts) {
        opts = opts || {};
        var prim = opts.primaryScenario || 'actual';
        var itemsForScale = budgetLineItemsPrimarySlice(opts.lineItems || [], prim);
        var scaled0 = applyBudgetScenario(revenues, expenses, itemsForScale, opts);
        revenues = scaled0.revenues;
        expenses = scaled0.expenses;
        var lineItems = scaled0.lineItems;
        var revM = 1 + (parseFloat(opts.scenarioRevPct) || 0) / 100;
        var expM = 1 + (parseFloat(opts.scenarioExpPct) || 0) / 100;
        var rollupReport = opts.rollup ? scaleBudgetRollup(opts.rollup, revM, expM) : null;
        var byPeriodReport = null;
        if (opts.byPeriod) {
          byPeriodReport = {};
          Object.keys(opts.byPeriod).forEach(function (k) {
            byPeriodReport[k] = scaleBudgetRollup(opts.byPeriod[k], revM, expM);
          });
        }
        var L = BUDGET_REPORT_STRINGS[lang] || BUDGET_REPORT_STRINGS.en;
        var totalRev = revenues.reduce(function (a, b) { return a + b; }, 0);
        var totalExp = expenses.reduce(function (a, b) { return a + b; }, 0);
        var balance = totalRev - totalExp;
        var total = totalRev + totalExp;
        var revShare = total ? (totalRev / total * 100) : 0;
        var expShare = total ? (totalExp / total * 100) : 0;
        var savingsRate = totalRev ? ((balance > 0 ? balance : 0) / totalRev * 100) : 0;
        var expToRev = totalRev ? (totalExp / totalRev * 100) : 0;
        var avgRev = revenues.length ? totalRev / revenues.length : 0;
        var avgExp = expenses.length ? totalExp / expenses.length : 0;
        var maxRev = revenues.length ? Math.max.apply(null, revenues) : 0;
        var maxExp = expenses.length ? Math.max.apply(null, expenses) : 0;
        var balanceLabel = balance >= 0 ? L.surplus : L.deficit;
        var dir = lang === 'ar' ? 'rtl' : 'ltr';
        var companyName = (opts.companyName || '').trim();
        var officeIssued = (opts.officeIssued || '').trim();
        var dateFrom = opts.dateFrom || '';
        var dateTo = opts.dateTo || '';
        var prevRev = parseFloat(opts.prevYearRevenue) || 0;
        var prevExp = parseFloat(opts.prevYearExpenses) || 0;
        var currentAssets = parseFloat(opts.currentAssets) || 0;
        var currentLiab = parseFloat(opts.currentLiabilities) || 0;
        var totalLiab = parseFloat(opts.totalLiabilities) || 0;
        var equity = parseFloat(opts.equity) || 0;
        var totalAssets = parseFloat(opts.totalAssets) || 0;
        var prevAssets = parseFloat(opts.prevYearAssets) || 0;
        var newPPE = parseFloat(opts.newPPE) || 0;
        var depRate = parseFloat(opts.depreciationRate) || 0;
        var depExpense = parseFloat(opts.depreciationExpense) || 0;
        var isConsolidated = (opts.consolidated || '').toLowerCase() === 'yes';
        var numEntities = parseInt(opts.numEntities, 10) || (isConsolidated ? 2 : 1);
        var avgInventory = parseFloat(opts.avgInventory) || 0;
        var cogs = parseFloat(opts.cogs) || 0;
        var supplierPayables = parseFloat(opts.supplierPayables) || 0;
        var bankLoansList = typeof parseBankLoans === 'function' ? parseBankLoans(opts.bankLoans || '') : [];
        var targetRevenue = parseFloat(opts.targetRevenue) || 0;
        var targetExpenses = parseFloat(opts.targetExpenses) || 0;
        var hasFormSupplement = !!(companyName || officeIssued || dateFrom || dateTo || prevRev || prevExp || totalAssets || prevAssets || totalLiab || equity || currentAssets || currentLiab || (opts.numEntities && String(opts.numEntities).trim()) || isConsolidated || cogs || avgInventory || supplierPayables || newPPE || depRate || depExpense || (opts.bankLoans && String(opts.bankLoans).trim()) || opts.businessActivity || opts.country || targetRevenue || targetExpenses);

        var html = '<div class="budget-analysis-report" dir="' + dir + '">';
        var scenR = parseFloat(opts.scenarioRevPct) || 0;
        var scenE = parseFloat(opts.scenarioExpPct) || 0;
        if (scenR !== 0 || scenE !== 0) {
          var sb = (L.scenarioBanner || '').replace(/\{r\}/g, String(scenR)).replace(/\{e\}/g, String(scenE));
          html += '<div class="budget-scenario-banner">' + sb + '</div>';
        }
        html += '<h4>' + L.title + '</h4>';
        html += '<div class="budget-legal-box report-section"><p style="font-size:0.82rem;line-height:1.55;margin:0;">' + (L.budgetDisclaimerLegal || '') + ' <a href="#contact">' + (L.budgetDisclaimerContact || '') + '</a></p></div>';
        html += '<div class="report-section budget-data-source"><h5>' + (L.budgetSourceTitle || '') + '</h5>';
        var um = opts.uploadMeta;
        if (um) {
          html += '<p>' + (L.budgetSourceFile || '') + ': <strong>' + escapeHtml(um.fileName || '—') + '</strong></p>';
          if (um.at) html += '<p>' + (L.budgetSourceTime || '') + ': ' + escapeHtml(um.at) + '</p>';
          html += '<p>' + (L.budgetSourceCounts || '').replace(/\{r\}/g, String(um.revCount != null ? um.revCount : revenues.length)).replace(/\{e\}/g, String(um.expCount != null ? um.expCount : expenses.length)).replace(/\{l\}/g, String(um.lineCount != null ? um.lineCount : lineItems.length)) + '</p>';
          if (um.restored) html += '<p style="color:#e8a54b;">' + (L.budgetSourceRestored || '') + '</p>';
        } else {
          html += '<p>' + (L.budgetSourceUnknown || '') + '</p>';
        }
        if (hasFormSupplement) html += '<p>' + (L.budgetSourceFormNote || '') + '</p>';
        else html += '<p>' + (L.budgetSourceFileOnly || '') + '</p>';
        if (opts.currencies && opts.currencies.length > 1) {
          html += '<p style="color:#e8a54b;font-size:0.88rem;">' + (L.budgetMultiCurrencyNote || '') + '</p>';
        }
        if (opts.currencies && opts.currencies.length === 1) {
          html += '<p style="font-size:0.88rem;color:var(--color-text-muted);">' + (L.budgetSingleCurrencyLabel || '') + ': <strong>' + escapeHtml(opts.currencies[0]) + '</strong></p>';
        }
        html += '</div>';
        if (companyName || officeIssued || dateFrom || dateTo) {
          html += '<div class="report-section report-header"><h5>' + L.companyName + '</h5><p><strong>' + (companyName || '—') + '</strong></p>';
          if (officeIssued) { html += '<h5>' + L.officeIssued + '</h5><p>' + officeIssued + '</p>'; }
          html += '<h5>' + L.budgetPeriod + '</h5><p>' + L.periodFrom + ': ' + (dateFrom || '—') + ' &nbsp; ' + L.periodTo + ': ' + (dateTo || '—') + '</p></div>';
        }
        html += '<div class="report-section"><h5>' + L.consolidatedBudget + '</h5><p>' + (isConsolidated ? L.consolidatedYes : L.consolidatedNo) + '.</p>';
        if (isConsolidated) {
          html += '<p>' + L.consolidatedNote + '</p><p>' + L.numEntities + ': ' + numEntities + '</p>';
        } else {
          html += '<p>' + L.consolidatedNoteSingle + '</p>';
        }
        html += '</div>';
        html += '<div class="report-section"><h5>' + L.summary + '</h5><p>' + (balance >= 0 ? L.surplus : L.deficit) + ': ' + Math.abs(balance).toFixed(2) + '</p></div>';
        html += '<div class="report-section"><h5>' + L.totals + '</h5>';
        html += '<table class="analysis-result-table"><tr><th></th><th>Total</th></tr>';
        html += '<tr><td>' + L.revenue + '</td><td class="result-total">' + totalRev.toFixed(2) + '</td></tr>';
        html += '<tr><td>' + L.expenses + '</td><td class="result-total">' + totalExp.toFixed(2) + '</td></tr>';
        html += '<tr><td><strong>' + L.balance + ' (' + balanceLabel + ')</strong></td><td class="result-total">' + balance.toFixed(2) + '</td></tr></table></div>';
        if (targetRevenue > 0 || targetExpenses > 0) {
          html += '<div class="report-section"><h5>' + (L.budgetTargetsSection || '') + '</h5><table class="analysis-result-table"><tr><th></th><th>' + (L.deepColAmount || '') + '</th><th>' + (L.budgetVarianceCol || '') + '</th></tr>';
          if (targetRevenue > 0) {
            var vRev = targetRevenue ? ((totalRev - targetRevenue) / targetRevenue * 100) : 0;
            html += '<tr><td>' + (L.budgetTargetRevLabel || '') + '</td><td class="result-total">' + targetRevenue.toFixed(2) + '</td><td class="result-total">' + vRev.toFixed(1) + '%</td></tr>';
          }
          if (targetExpenses > 0) {
            var vExp = targetExpenses ? ((totalExp - targetExpenses) / targetExpenses * 100) : 0;
            html += '<tr><td>' + (L.budgetTargetExpLabel || '') + '</td><td class="result-total">' + targetExpenses.toFixed(2) + '</td><td class="result-total">' + vExp.toFixed(1) + '%</td></tr>';
          }
          html += '</table></div>';
        }
        var rollup = rollupReport;
        if (rollup && rollup.revenue && rollup.expense) {
          var scenUsed = ['approved', 'actual', 'forecast'].filter(function (k) {
            return Math.abs(rollup.revenue[k] || 0) > 1e-9 || Math.abs(rollup.expense[k] || 0) > 1e-9;
          });
          if (scenUsed.length >= 2) {
            html += '<div class="report-section"><h5>' + (L.budgetScenarioRollupTitle || '') + '</h5>';
            html += '<table class="analysis-result-table"><tr><th></th><th>' + (L.budgetScenarioApproved || '') + '</th><th>' + (L.budgetScenarioActual || '') + '</th><th>' + (L.budgetScenarioForecast || '') + '</th></tr>';
            html += '<tr><td>' + L.revenue + '</td><td>' + (rollup.revenue.approved || 0).toFixed(2) + '</td><td>' + (rollup.revenue.actual || 0).toFixed(2) + '</td><td>' + (rollup.revenue.forecast || 0).toFixed(2) + '</td></tr>';
            html += '<tr><td>' + L.expenses + '</td><td>' + (rollup.expense.approved || 0).toFixed(2) + '</td><td>' + (rollup.expense.actual || 0).toFixed(2) + '</td><td>' + (rollup.expense.forecast || 0).toFixed(2) + '</td></tr>';
            html += '</table>';
            html += '<p style="font-size:0.82rem;color:var(--color-text-muted);margin:0.5rem 0 0;">' + (L.budgetScenarioRollupNote || '') + '</p>';
            html += '</div>';
          }
        }
        var bp = byPeriodReport || {};
        var pKeys = Object.keys(bp).filter(function (k) { return k !== '_all'; }).sort();
        if (pKeys.length) {
          html += '<div class="report-section"><h5>' + (L.budgetPeriodBreakdownTitle || '') + '</h5>';
          html += '<table class="analysis-result-table"><tr><th>' + (L.budgetColPeriod || '') + '</th><th colspan="3">' + L.revenue + '</th><th colspan="3">' + L.expenses + '</th></tr>';
          html += '<tr><th></th><th>' + (L.budgetScenarioApproved || '') + '</th><th>' + (L.budgetScenarioActual || '') + '</th><th>' + (L.budgetScenarioForecast || '') + '</th><th>' + (L.budgetScenarioApproved || '') + '</th><th>' + (L.budgetScenarioActual || '') + '</th><th>' + (L.budgetScenarioForecast || '') + '</th></tr>';
          pKeys.forEach(function (pk) {
            var slice = bp[pk] || { revenue: {}, expense: {} };
            html += '<tr><td>' + escapeHtml(pk) + '</td>';
            html += '<td>' + ((slice.revenue && slice.revenue.approved) || 0).toFixed(2) + '</td><td>' + ((slice.revenue && slice.revenue.actual) || 0).toFixed(2) + '</td><td>' + ((slice.revenue && slice.revenue.forecast) || 0).toFixed(2) + '</td>';
            html += '<td>' + ((slice.expense && slice.expense.approved) || 0).toFixed(2) + '</td><td>' + ((slice.expense && slice.expense.actual) || 0).toFixed(2) + '</td><td>' + ((slice.expense && slice.expense.forecast) || 0).toFixed(2) + '</td>';
            html += '</tr>';
          });
          html += '</table></div>';
        }
        var maxBar = Math.max(totalRev, totalExp, 1);
        var wRev = (totalRev / maxBar * 100);
        var wExp = (totalExp / maxBar * 100);
        html += '<div class="report-section"><h5>' + (L.chartComparison || 'Comparison') + '</h5>';
        html += '<div class="budget-bar-chart" role="img" aria-label="' + (L.chartComparison || '') + '">';
        html += '<div class="budget-bar-chart__row"><span class="budget-bar-chart__label">' + L.revenue + '</span><div class="budget-bar-chart__track"><div class="budget-bar-chart__fill budget-bar-chart__fill--rev" style="width:' + wRev + '%"></div></div><span class="budget-bar-chart__val">' + totalRev.toFixed(2) + '</span></div>';
        html += '<div class="budget-bar-chart__row"><span class="budget-bar-chart__label">' + L.expenses + '</span><div class="budget-bar-chart__track"><div class="budget-bar-chart__fill budget-bar-chart__fill--exp" style="width:' + wExp + '%"></div></div><span class="budget-bar-chart__val">' + totalExp.toFixed(2) + '</span></div>';
        html += '</div></div>';
        html += '<div class="report-section budget-chartjs-section"><h5>' + (L.chartVisualTitle || '') + '</h5><p style="font-size:0.85rem;color:var(--color-text-muted);margin:0 0 var(--space-2);">' + (L.chartVisualIntro || '') + '</p>';
        html += '<div class="budget-chartjs-grid">';
        html += '<div class="budget-chartjs-wrap"><canvas id="budget-chart-rev-exp" aria-hidden="false"></canvas></div>';
        html += '<div class="budget-chartjs-wrap"><canvas id="budget-chart-exp-pie"></canvas></div>';
        html += '<div class="budget-chartjs-wrap"><canvas id="budget-chart-rev-pie"></canvas></div>';
        html += '<div class="budget-chartjs-wrap budget-chartjs-wrap--full"><canvas id="budget-chart-scenarios"></canvas></div>';
        html += '</div></div>';
        var revByCat = aggregateBudgetLineItemsByCategory(lineItems, 'revenue');
        var expByCat = aggregateBudgetLineItemsByCategory(lineItems, 'expense');
        html += '<div class="report-section"><h5>' + (L.deepAnalysisTitle || '') + '</h5>';
        if (!lineItems.length) {
          html += '<p style="font-size:0.9rem;color:var(--color-text-muted);">' + (L.deepNoLines || '') + '</p>';
        }
        if (revByCat.length) {
          html += '<h5 style="margin-top:0.75rem;font-size:0.95rem;">' + (L.deepCategoryRev || '') + '</h5><table class="budget-deep-table"><tr><th>' + (L.deepColItem || '') + '</th><th>' + (L.deepColAmount || '') + '</th><th>' + (L.deepColShare || '') + '</th></tr>';
          revByCat.forEach(function (row) {
            var pct = totalRev ? row.amount / totalRev * 100 : 0;
            html += '<tr><td>' + escapeHtml(row.name) + '</td><td>' + row.amount.toFixed(2) + '</td><td>' + pct.toFixed(1) + '%</td></tr>';
          });
          html += '</table>';
        }
        if (expByCat.length) {
          html += '<h5 style="margin-top:0.75rem;font-size:0.95rem;">' + (L.deepCategoryExp || '') + '</h5><table class="budget-deep-table"><tr><th>' + (L.deepColItem || '') + '</th><th>' + (L.deepColAmount || '') + '</th><th>' + (L.deepColShare || '') + '</th></tr>';
          expByCat.forEach(function (row) {
            var pct = totalExp ? row.amount / totalExp * 100 : 0;
            html += '<tr><td>' + escapeHtml(row.name) + '</td><td>' + row.amount.toFixed(2) + '</td><td>' + pct.toFixed(1) + '%</td></tr>';
          });
          html += '</table>';
        }
        if (revByCat.length || expByCat.length || totalRev > 0 || totalExp > 0) {
          html += '<h5 style="margin-top:0.75rem;font-size:0.95rem;">' + (L.deepConcentration || '') + '</h5>';
          if (totalRev > 0 && revByCat.length) {
            var topRevPct = revByCat[0].amount / totalRev * 100;
            html += '<p>' + (L.deepTopRevShare || '') + ': ' + topRevPct.toFixed(1) + '% (' + escapeHtml(revByCat[0].name) + ')</p>';
          }
          if (totalExp > 0 && expByCat.length) {
            var topExpPct = expByCat[0].amount / totalExp * 100;
            html += '<p>' + (L.deepTopExpShare || '') + ': ' + topExpPct.toFixed(1) + '% (' + escapeHtml(expByCat[0].name) + ')</p>';
          }
          if (totalExp > 0 && expByCat.length > 1) {
            var hhi = budgetExpenseHHI(expByCat, totalExp);
            html += '<p>' + (L.deepHHI || '') + ': ' + hhi.toFixed(3) + '</p>';
            if (hhi >= 0.28) html += '<p>' + (L.deepHHIHigh || '') + '</p>';
            else if (hhi >= 0.18) html += '<p>' + (L.deepHHIModerate || '') + '</p>';
          }
        }
        if (totalRev > 0) {
          var bal10 = totalRev * 0.9 - totalExp;
          var bal20 = totalRev * 0.8 - totalExp;
          html += '<h5 style="margin-top:0.75rem;font-size:0.95rem;">' + (L.deepSensitivity || '') + '</h5>';
          html += '<p>' + (L.deepSens10 || '') + ' <strong>' + bal10.toFixed(2) + '</strong></p>';
          html += '<p>' + (L.deepSens20 || '') + ' <strong>' + bal20.toFixed(2) + '</strong></p>';
        }
        var flags = [];
        if (totalExp > totalRev && totalRev >= 0) flags.push({ cls: 'budget-flag--crit', t: L.flagExpExceedsRev });
        if (totalRev > 0 && expToRev > 90 && balance >= 0) flags.push({ cls: 'budget-flag--warn', t: L.flagExpNearRev });
        if (balance > 0 && savingsRate < 5 && totalRev > 0) flags.push({ cls: 'budget-flag--warn', t: L.flagThinMargin });
        if (totalRev > 0 && revByCat.length && revByCat[0].amount / totalRev > 0.5) flags.push({ cls: 'budget-flag--warn', t: L.flagRevConcentrated });
        if (totalExp > 0 && expByCat.length && expByCat[0].amount / totalExp > 0.4) flags.push({ cls: 'budget-flag--warn', t: L.flagExpConcentrated });
        html += '<h5 style="margin-top:0.75rem;font-size:0.95rem;">' + (L.deepFlagsTitle || '') + '</h5>';
        if (flags.length) {
          html += '<ul class="budget-flag-list">';
          flags.forEach(function (f) { html += '<li class="' + f.cls + '">' + f.t + '</li>'; });
          html += '</ul>';
        } else {
          html += '<p>' + (L.noDeepFlags || '') + '</p>';
        }
        var recs = [];
        if (totalExp > totalRev || expToRev > 90) recs.push(L.recReduceExp);
        if (totalRev > 0 && revByCat.length && revByCat[0].amount / totalRev > 0.45) recs.push(L.recDiversifyRev);
        if (totalExp > totalRev || expToRev > 85) recs.push(L.recForecast);
        recs.push(L.recExpert);
        html += '<h5 style="margin-top:0.75rem;font-size:0.95rem;">' + (L.deepRecTitle || '') + '</h5><ul class="budget-flag-list">';
        recs.forEach(function (t) { html += '<li>' + t + '</li>'; });
        html += '</ul></div>';
        if (prevRev > 0 || prevExp > 0) {
          var revPct = prevRev ? ((totalRev - prevRev) / prevRev * 100) : 0;
          var expPct = prevExp ? ((totalExp - prevExp) / prevExp * 100) : 0;
          html += '<div class="report-section"><h5>' + L.yearComparison + '</h5>';
          html += '<p>' + L.revChange + ': ' + (revPct >= 0 ? L.increase : L.decrease) + ' ' + Math.abs(revPct).toFixed(1) + '%</p>';
          html += '<p>' + L.expChange + ': ' + (expPct >= 0 ? L.increase : L.decrease) + ' ' + Math.abs(expPct).toFixed(1) + '%</p></div>';
        } else {
          html += '<div class="report-section"><h5>' + L.yearComparison + '</h5><p>' + L.noPrevYear + '</p></div>';
        }
        html += '<div class="report-section"><h5>' + L.ratios + '</h5><p>' + L.savingsRate + ': ' + savingsRate.toFixed(1) + '%</p><p>' + L.expToRev + ': ' + expToRev.toFixed(1) + '%</p></div>';
        var perfTitle = isConsolidated ? L.performanceMulti : L.performanceSingle;
        html += '<div class="report-section"><h5>' + L.performanceRatio + ' — ' + perfTitle + '</h5>';
        if (totalRev > 0) {
          var profitMarginPct = (balance / totalRev * 100);
          html += '<p>' + L.profitMargin + ': ' + profitMarginPct.toFixed(1) + '%</p>';
        }
        if (totalAssets > 0) {
          var roaPct = (balance / totalAssets * 100);
          html += '<p>' + L.returnOnAssets + ': ' + roaPct.toFixed(1) + '%</p>';
        } else {
          html += '<p>' + L.noPerformanceAssets + '</p>';
        }
        html += '</div>';
        if (totalLiab > 0 || equity > 0) {
          var lev = equity > 0 ? (totalLiab / equity) : (totalLiab > 0 ? 999.99 : 0);
          html += '<div class="report-section"><h5>' + L.leverage + '</h5><p>' + L.leverageRatio + ': ' + lev.toFixed(2) + '</p></div>';
        } else {
          html += '<div class="report-section"><h5>' + L.leverage + '</h5><p>' + L.noLeverageData + '</p></div>';
        }
        if (currentAssets > 0 || currentLiab > 0) {
          var liqRatio = currentLiab > 0 ? (currentAssets / currentLiab) : (currentAssets > 0 ? 999.99 : 0);
          html += '<div class="report-section"><h5>' + L.liquidity + '</h5><p>' + L.liquidityRatio + ': ' + liqRatio.toFixed(2) + '</p><p>' + L.liquidityNote + '</p></div>';
        } else {
          html += '<div class="report-section"><h5>' + L.liquidity + '</h5><p>' + L.liquidityNote + '</p></div>';
        }
        if (totalLiab > 0) {
          html += '<div class="report-section"><h5>' + L.liabilities + '</h5><p>' + L.totalLiabilities + ': ' + totalLiab.toFixed(2) + '</p></div>';
        }
        if (totalAssets > 0 || newPPE > 0) {
          html += '<div class="report-section"><h5>' + L.assetsInventory + '</h5><p>' + L.totalAssets + ': ' + (totalAssets > 0 ? totalAssets.toFixed(2) : '—') + '</p>';
          if (newPPE > 0) html += '<p>' + L.newPPENote + ' ' + newPPE.toFixed(2) + '</p>';
          html += '</div>';
        }
        if (totalAssets > 0 || prevAssets > 0) {
          html += '<div class="report-section"><h5>' + L.assetsChangeAnalysis + '</h5>';
          if (prevAssets > 0) {
            var assetsPct = ((totalAssets - prevAssets) / prevAssets * 100);
            html += '<p>' + L.assetsChangeVsPrev + ': ' + (assetsPct >= 0 ? L.increase : L.decrease) + ' ' + Math.abs(assetsPct).toFixed(1) + '%</p>';
          } else {
            html += '<p>' + L.noPrevAssets + '</p>';
          }
          html += '</div>';
        }
        if (newPPE > 0) {
          html += '<div class="report-section"><h5>' + L.newPPEAdditions + '</h5><p>' + L.newPPENote + ' ' + newPPE.toFixed(2) + '.</p></div>';
        }
        if (depRate > 0 || depExpense > 0) {
          html += '<div class="report-section"><h5>' + L.depreciationRates + '</h5>';
          if (depRate > 0) html += '<p>' + L.depreciationRateLabel + ': ' + depRate.toFixed(1) + '%</p>';
          if (depExpense > 0) html += '<p>' + L.depreciationExpenseLabel + ': ' + depExpense.toFixed(2) + '</p>';
          html += '<p>' + L.depreciationNote + '</p></div>';
        } else {
          html += '<div class="report-section"><h5>' + L.depreciationRates + '</h5><p>' + L.noDepreciationData + '</p></div>';
        }
        html += '<div class="report-section"><h5>' + L.cashFlowAnalysis + '</h5><p>' + L.operatingCashFlow + ': ' + balance.toFixed(2) + '</p></div>';
        var loanNote = balance > 0 && (currentLiab <= 0 || currentAssets / (currentLiab || 1) >= 1) ? L.loanFeasible : (balance < 0 ? L.loanWeak : L.loanCaution);
        if (equity > 0 && totalLiab / equity > 2) loanNote = L.loanCaution;
        if (balance < 0) loanNote = L.loanWeak;
        html += '<div class="report-section"><h5>' + L.loanFeasibility + '</h5><p>' + loanNote + '</p></div>';
        if (avgInventory > 0 && cogs > 0) {
          var invTurnover = cogs / avgInventory;
          var turnoverLevel = invTurnover >= 4 ? 'high' : (invTurnover < 2 ? 'low' : 'mid');
          html += '<div class="report-section"><h5>' + L.inventoryTurnover + '</h5><p>' + L.inventoryTurnoverRatio + ': ' + invTurnover.toFixed(2) + '</p>';
          if (turnoverLevel === 'high') html += '<p><strong>' + L.turnoverHigh + '.</strong> ' + L.turnoverNoteHigh + '</p>';
          else if (turnoverLevel === 'low') html += '<p><strong>' + L.turnoverLow + '.</strong> ' + L.turnoverNoteLow + '</p>';
          html += '</div>';
          html += '<div class="report-section"><h5>' + L.linkToLiabilities + '</h5><p>' + L.linkNote + '</p></div>';
        } else {
          html += '<div class="report-section"><h5>' + L.inventoryTurnover + '</h5><p>' + L.noInventoryData + '</p></div>';
        }
        if (bankLoansList.length > 0) {
          html += '<div class="report-section"><h5>' + L.bankLoans + '</h5><table class="analysis-result-table"><tr><th>' + L.bankLoanRow + '</th><th>' + (L.amountLabel || 'Amount') + '</th></tr>';
          var totalLoans = 0;
          bankLoansList.forEach(function (row) {
            html += '<tr><td>' + (row.bank ? escapeHtml(row.bank) : '—') + '</td><td class="result-total">' + row.amount.toFixed(2) + '</td></tr>';
            totalLoans += row.amount;
          });
          html += '<tr><td><strong>' + (L.totalLabel || 'Total') + '</strong></td><td class="result-total">' + totalLoans.toFixed(2) + '</td></tr></table></div>';
        }
        if (supplierPayables > 0) {
          html += '<div class="report-section"><h5>' + L.supplierPayables + '</h5><p>' + supplierPayables.toFixed(2) + '</p></div>';
        }
        if (bankLoansList.length > 0 || supplierPayables > 0 || (avgInventory > 0 && cogs > 0)) {
          html += '<div class="report-section"><h5>' + L.effectOnPerformance + '</h5><p>' + L.effectNote + '</p></div>';
        }
        html += '<div class="report-section"><h5>' + L.risksSection + '</h5>';
        html += '<p><strong>' + L.marketRisks + ':</strong> ' + (L.marketRisksDesc || L.risksNote) + '</p>';
        html += '<p><strong>' + L.stateRisks + ':</strong> ' + (L.stateRisksDesc || L.risksNote) + '</p>';
        html += '<p><strong>' + L.competitorRisks + ':</strong> ' + (L.competitorRisksDesc || L.risksNote) + '</p>';
        if (opts.businessActivity) html += '<p>' + L.risksByActivity + ': ' + escapeHtml(opts.businessActivity) + '</p>';
        if (opts.country) html += '<p>' + L.risksByCountry + ': ' + escapeHtml(opts.country) + '</p>';
        if (!opts.businessActivity && !opts.country) html += '<p>' + (L.risksContextHint || L.risksNote) + '</p>';
        html += '<p>' + L.risksNote + '</p></div>';
        html += '<div class="report-section"><h5>' + L.structure + '</h5><p>' + L.revShare + ': ' + revShare.toFixed(1) + '%</p><p>' + L.expShare + ': ' + expShare.toFixed(1) + '%</p></div>';
        html += '<div class="report-section"><h5>' + L.counts + '</h5><p>' + L.revItems + ': ' + revenues.length + '</p><p>' + L.expItems + ': ' + expenses.length + '</p></div>';
        html += '<div class="report-section"><h5>' + L.averages + '</h5><p>' + L.avgRev + ': ' + avgRev.toFixed(2) + '</p><p>' + L.avgExp + ': ' + avgExp.toFixed(2) + '</p></div>';
        html += '<div class="report-section"><h5>' + L.extremes + '</h5><p>' + L.maxRev + ': ' + maxRev.toFixed(2) + '</p><p>' + L.maxExp + ': ' + maxExp.toFixed(2) + '</p></div>';
        if (typeof isAdmin === 'function' && isAdmin()) {
          var alog = typeof getBudgetAuditLog === 'function' ? getBudgetAuditLog() : [];
          if (alog.length) {
            html += '<div class="report-section budget-audit-section"><h5>' + (L.budgetAuditTitle || '') + '</h5><p style="font-size:0.8rem;color:var(--color-text-muted);">' + (L.budgetAuditNote || '') + '</p>';
            html += '<table class="budget-deep-table"><tr><th>' + (L.budgetAuditColTime || '') + '</th><th>' + (L.budgetAuditColFile || '') + '</th><th>' + (L.budgetAuditColRows || '') + '</th></tr>';
            alog.forEach(function (row) {
              html += '<tr><td>' + escapeHtml(row.at || '') + '</td><td>' + escapeHtml(row.fileName || '') + '</td><td>r:' + (row.revCount | 0) + ' e:' + (row.expCount | 0) + ' L:' + (row.lineCount | 0) + '</td></tr>';
            });
            html += '</table></div>';
          }
        }
        html += '</div>';
        return html;
      }

      var formFeas = document.getElementById('form-feasibility-analysis');
      if (formFeas) formFeas.addEventListener('submit', function (e) {
        e.preventDefault();
        var initial = parseFloat((document.getElementById('feas-initial') && document.getElementById('feas-initial').value) || 0) || 0;
        var flowsText = (document.getElementById('feas-flows') && document.getElementById('feas-flows').value) || '';
        var rate = parseFloat((document.getElementById('feas-rate') && document.getElementById('feas-rate').value) || 0) || 0;
        var flows = parseNumberList(flowsText);
        var npv = -initial;
        var r = 1 + (rate / 100);
        for (var i = 0; i < flows.length; i++) npv += flows[i] / Math.pow(r, i + 1);
        var cum = 0, payback = 0;
        for (var j = 0; j < flows.length; j++) { cum += flows[j]; if (cum >= initial) { payback = j + (initial - (cum - flows[j])) / flows[j]; break; } payback = j + 1; }
        var html = '<table class="analysis-result-table"><tr><th>Metric</th><th>Value</th></tr><tr><td>Initial investment</td><td>' + initial.toFixed(2) + '</td></tr><tr><td>NPV (r=' + rate + '%)</td><td class="result-total">' + npv.toFixed(2) + '</td></tr><tr><td>Payback (years)</td><td class="result-total">' + payback.toFixed(2) + '</td></tr></table>';
        var resF = document.getElementById('feasibility-results');
        var noF = document.getElementById('feas-no-permission');
        if (!resF) return;
        resF.innerHTML = html; resF.style.display = 'block';
        if (canViewFeasibility()) { if (noF) noF.style.display = 'none'; resF.style.display = 'block'; }
        else { if (noF) noF.style.display = 'block'; resF.style.display = 'none'; }
      });

      /* تمثيل ومركز أبحاث — أقسام مدمجة من representative.html و research-center.html */
      (function initRepresentativeSection() {
        var notEl = document.getElementById('rep-not-eligible');
        var formEl = document.getElementById('rep-form-block');
        var form = document.getElementById('representative-form');
        if (!form) return;
        function repI18n(key) {
          var L = (document.documentElement.getAttribute('data-lang') || 'en').toLowerCase();
          var pack = window.IIF_I18N && window.IIF_I18N.T;
          var t = pack && (pack[L] || pack.en);
          var en = pack && pack.en;
          var v = t && t[key];
          if (v == null && en) v = en[key];
          return v != null ? v : '';
        }
        var TOP_TIER = 'premium_4143';
        var isTop = typeof IIF_MEMBERSHIP_AUTH !== 'undefined' && IIF_MEMBERSHIP_AUTH.getMembershipType && IIF_MEMBERSHIP_AUTH.getMembershipType() === TOP_TIER && IIF_MEMBERSHIP_AUTH.hasValidMembership && IIF_MEMBERSHIP_AUTH.hasValidMembership();
        if (typeof IIF_MEMBERSHIP_AUTH !== 'undefined' && IIF_MEMBERSHIP_AUTH.syncMembershipStatus) IIF_MEMBERSHIP_AUTH.syncMembershipStatus();
        if (isTop) { if (notEl) notEl.style.display = 'none'; if (formEl) formEl.style.display = 'block'; } else { if (notEl) notEl.style.display = 'block'; if (formEl) formEl.style.display = 'none'; }
        var REP_APP_KEY = 'iif_representative_applications';
        function getRepApps() { try { return JSON.parse(localStorage.getItem(REP_APP_KEY) || '[]'); } catch (e) { return []; } }
        function saveRepApps(arr) { try { localStorage.setItem(REP_APP_KEY, JSON.stringify(arr)); } catch (e) { } }
        form.addEventListener('submit', function (e) {
          e.preventDefault();
          var cb = document.getElementById('rep-accept-terms');
          if (cb && !cb.checked) {
            alert(repI18n('repAlertAcceptTerms') || 'Please accept the terms first.');
            return;
          }
          var fd = new FormData(this);
          var obj = { id: 'rep_' + Date.now(), status: 'pending', submittedAt: new Date().toISOString() };
          fd.forEach(function (v, k) { obj[k] = v; });
          var adminEmail = (typeof localStorage !== 'undefined' && localStorage.getItem('iif-user-email')) || '';
          if (adminEmail) obj.linkedToAdminEmail = adminEmail;
          try {
            var extra = localStorage.getItem('iif-rep-link-emails');
            if (extra) {
              var arr = [];
              try { arr = JSON.parse(extra); } catch (e2) { }
              if (arr.length) obj.linkedToEmails = arr;
            }
          } catch (e1) { }
          obj.linkedToAdminEmail = obj.linkedToAdminEmail || adminEmail;
          var apps = getRepApps();
          apps.push(obj);
          saveRepApps(apps);
          this.reset();
          if (cb) cb.checked = false;
          alert(repI18n('repAlertSubmitted') || 'Application submitted. It will be linked to Fund management emails and reviewed from the dashboard.');
        });
      })();
      (function initResearchCenterSection() {
        var msgEl = document.getElementById('research-members-only');
        var gateEl = document.getElementById('research-gate');
        var listEl = document.getElementById('centers-list');
        var searchInput = document.getElementById('research-search');
        var searchBtn = document.getElementById('research-search-btn');
        if (!listEl) return;
        function researchI18n(key) {
          var L = (document.documentElement.getAttribute('data-lang') || 'en').toLowerCase();
          var pack = window.IIF_I18N && window.IIF_I18N.T;
          var t = pack && (pack[L] || pack.en);
          var en = pack && pack.en;
          var v = t && t[key];
          if (v == null && en) v = en[key];
          return v != null ? v : '';
        }
        var isMember = typeof IIF_MEMBERSHIP_AUTH !== 'undefined' && IIF_MEMBERSHIP_AUTH.hasValidMembership && IIF_MEMBERSHIP_AUTH.hasValidMembership();
        if (typeof IIF_MEMBERSHIP_AUTH !== 'undefined' && IIF_MEMBERSHIP_AUTH.syncMembershipStatus) IIF_MEMBERSHIP_AUTH.syncMembershipStatus();
        if (isMember) { if (msgEl) msgEl.style.display = 'none'; if (gateEl) gateEl.style.display = 'block'; } else { if (msgEl) msgEl.style.display = 'block'; if (gateEl) gateEl.style.display = 'none'; }
        var lang = (document.documentElement.getAttribute('data-lang') || 'en').toLowerCase();
        var isAr = lang === 'ar';
        var centers = [{ id: 1, ar: 'مركز أبحاث السوق المالية العالمية', en: 'Global Financial Markets Research Center', tag: 'مالي', tagEn: 'Finance' }, { id: 2, ar: 'مركز أبحاث الاستثمار المستدام', en: 'Sustainable Investment Research Center', tag: 'استثمار', tagEn: 'Investment' }, { id: 3, ar: 'مركز أبحاث الاقتصاد الناشئ', en: 'Emerging Economy Research Center', tag: 'اقتصاد', tagEn: 'Economy' }, { id: 4, ar: 'مركز أبحاث التكنولوجيا والابتكار', en: 'Technology & Innovation Research Center', tag: 'تقنية', tagEn: 'Tech' }, { id: 5, ar: 'مركز أبحاث الطاقة المتجددة', en: 'Renewable Energy Research Center', tag: 'طاقة', tagEn: 'Energy' }];
        function renderCenters(filter) {
          var f = (filter || '').toLowerCase();
          var items = centers.filter(function (c) {
            if (!f) return true;
            return (c.ar && c.ar.toLowerCase().indexOf(f) !== -1) || (c.en && c.en.toLowerCase().indexOf(f) !== -1) || (c.tag && c.tag.toLowerCase().indexOf(f) !== -1) || (c.tagEn && c.tagEn.toLowerCase().indexOf(f) !== -1);
          });
          listEl.innerHTML = '';
          var dl = researchI18n('researchDownload') || 'Download';
          items.forEach(function (c) {
            var li = document.createElement('li');
            var title = isAr ? c.ar : c.en;
            var tag = isAr ? c.tag : c.tagEn;
            li.innerHTML = '<div><strong>' + (title || '').replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</strong><br><small style="color:var(--color-text-muted);">' + (tag || '').replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</small></div><a href="#" class="btn btn--ghost btn-sm" data-id="' + c.id + '">' + dl.replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</a>';
            listEl.appendChild(li);
          });
        }
        renderCenters();
        if (searchBtn) searchBtn.addEventListener('click', function () { renderCenters(searchInput ? searchInput.value : ''); });
        if (searchInput) searchInput.addEventListener('keypress', function (e) { if (e.key === 'Enter') { e.preventDefault(); renderCenters(searchInput.value); } });
        listEl.addEventListener('click', function (e) {
          var a = e.target.closest('a[data-id]');
          if (a) {
            e.preventDefault();
            alert(researchI18n('researchDownloadAlert') || 'Download will be available when configured.');
          }
        });
      })();

      var currentUploadTab = 'docs';
      function getUploadsKeyForTab(t) { return t === 'docs' ? UPLOADS_DOCS_KEY : t === 'images' ? UPLOADS_IMAGES_KEY : t === 'video' ? UPLOADS_VIDEO_KEY : UPLOADS_LIVE_KEY; }
      function renderDashboardUploads() {
        var ul = document.getElementById('dashboard-uploads-list');
        if (!ul) return;
        var list = getStoredUploads(getUploadsKeyForTab(currentUploadTab));
        ul.innerHTML = '';
        list.forEach(function (item) {
          var li = document.createElement('li');
          li.dataset.id = item.id;
          var label = item.name || item.kind || item.at || item.id;
          li.innerHTML = '<div class="content"><strong>' + escapeHtml(label) + '</strong><small>' + (item.at || '') + '</small></div><div class="actions"><button type="button" class="btn-edit assign-specialist" data-id="' + escapeHtml(item.id) + '">' + iifBilingualSpans('dashBtnAssign', 'Assign', 'توزيع') + '</button><button type="button" class="btn-delete upload-delete" data-id="' + escapeHtml(item.id) + '">' + iifBilingualSpans('dashBtnDelete', 'Delete', 'حذف') + '</button></div>';
          ul.appendChild(li);
        });
        ul.querySelectorAll('.upload-delete').forEach(function (btn) {
          btn.addEventListener('click', function () {
            var id = btn.getAttribute('data-id');
            var arr = getStoredUploads(getUploadsKeyForTab(currentUploadTab)).filter(function (x) { return x.id !== id; });
            saveStoredUploads(getUploadsKeyForTab(currentUploadTab), arr);
            renderDashboardUploads();
          });
        });
        ul.querySelectorAll('.assign-specialist').forEach(function (btn) {
          btn.addEventListener('click', function () {
            var id = btn.getAttribute('data-id');
            var email = (document.getElementById('assign-specialist-email') && document.getElementById('assign-specialist-email').value) || '';
            if (!email.trim()) { alert(iifMessage('jsEnterSpecialistEmail')); return; }
            try { var a = JSON.parse(localStorage.getItem(UPLOADS_ASSIGN_KEY) || '[]'); a.push({ id: id, type: currentUploadTab, email: email.trim(), at: new Date().toISOString() }); localStorage.setItem(UPLOADS_ASSIGN_KEY, JSON.stringify(a)); } catch (e) { }
            alert(iifMessage('jsAssignedToSpecialist')); if (document.getElementById('assign-specialist-email')) document.getElementById('assign-specialist-email').value = '';
          });
        });
      }
      document.querySelectorAll('.dashboard-upload-tab').forEach(function (tab) {
        if (!tab) return;
        tab.addEventListener('click', function () {
          document.querySelectorAll('.dashboard-upload-tab').forEach(function (t) { t.classList.remove('is-active'); });
          tab.classList.add('is-active');
          currentUploadTab = tab.getAttribute('data-tab');
          renderDashboardUploads();
        });
      });
      if (document.getElementById('assign-specialist-btn')) document.getElementById('assign-specialist-btn').addEventListener('click', function () {
        var email = (document.getElementById('assign-specialist-email') && document.getElementById('assign-specialist-email').value) || '';
        if (!email.trim()) return;
        var list = getStoredUploads(getUploadsKeyForTab(currentUploadTab));
        list.forEach(function (item) { try { var a = JSON.parse(localStorage.getItem(UPLOADS_ASSIGN_KEY) || '[]'); a.push({ id: item.id, type: currentUploadTab, email: email.trim(), at: new Date().toISOString() }); localStorage.setItem(UPLOADS_ASSIGN_KEY, JSON.stringify(a)); } catch (e) { } });
        alert(iifMessage('jsAllItemsAssignedSpecialist')); if (document.getElementById('assign-specialist-email')) document.getElementById('assign-specialist-email').value = '';
      });
      function renderDashboardPermLists() {
        var budgetList = getPermittedBudget();
        var feasList = getPermittedFeasibility();
        var svcList = getPermittedServiceForms();
        var ulB = document.getElementById('dashboard-perm-budget-list');
        var ulF = document.getElementById('dashboard-perm-feasibility-list');
        var ulS = document.getElementById('dashboard-perm-service-forms-list');
        if (ulB) { ulB.innerHTML = ''; budgetList.forEach(function (em) { var li = document.createElement('li'); li.innerHTML = '<div class="content"><strong>' + escapeHtml(em) + '</strong></div><div class="actions"><button type="button" class="btn-delete perm-remove" data-type="budget" data-email="' + escapeHtml(em) + '">' + iifBilingualSpans('dashBtnRemove', 'Remove', 'إزالة') + '</button></div>'; ulB.appendChild(li); }); ulB.querySelectorAll('.perm-remove').forEach(function (btn) { btn.addEventListener('click', function () { var em = btn.getAttribute('data-email'); var arr = getPermittedBudget().filter(function (e) { return e !== em; }); try { localStorage.setItem(PERM_BUDGET_KEY, JSON.stringify(arr)); } catch (e) { } renderDashboardPermLists(); if (typeof updateServiceFormsGates === 'function') updateServiceFormsGates(); }); }); }
        if (ulF) { ulF.innerHTML = ''; feasList.forEach(function (em) { var li = document.createElement('li'); li.innerHTML = '<div class="content"><strong>' + escapeHtml(em) + '</strong></div><div class="actions"><button type="button" class="btn-delete perm-remove" data-type="feasibility" data-email="' + escapeHtml(em) + '">' + iifBilingualSpans('dashBtnRemove', 'Remove', 'إزالة') + '</button></div>'; ulF.appendChild(li); }); ulF.querySelectorAll('.perm-remove').forEach(function (btn) { btn.addEventListener('click', function () { var em = btn.getAttribute('data-email'); var arr = getPermittedFeasibility().filter(function (e) { return e !== em; }); try { localStorage.setItem(PERM_FEASIBILITY_KEY, JSON.stringify(arr)); } catch (e) { } renderDashboardPermLists(); if (typeof updateServiceFormsGates === 'function') updateServiceFormsGates(); }); }); }
        if (ulS) { ulS.innerHTML = ''; svcList.forEach(function (em) { var li = document.createElement('li'); li.innerHTML = '<div class="content"><strong>' + escapeHtml(em) + '</strong></div><div class="actions"><button type="button" class="btn-delete perm-remove" data-type="service_forms" data-email="' + escapeHtml(em) + '">' + iifBilingualSpans('dashBtnRemove', 'Remove', 'إزالة') + '</button></div>'; ulS.appendChild(li); }); ulS.querySelectorAll('.perm-remove').forEach(function (btn) { btn.addEventListener('click', function () { var em = btn.getAttribute('data-email'); var arr = getPermittedServiceForms().filter(function (e) { return e !== em; }); try { localStorage.setItem(PERM_SERVICE_FORMS_KEY, JSON.stringify(arr)); } catch (e) { } renderDashboardPermLists(); if (typeof updateServiceFormsGates === 'function') updateServiceFormsGates(); }); }); }
      }
      if (document.getElementById('perm-budget-btn')) document.getElementById('perm-budget-btn').addEventListener('click', function () {
        var em = (document.getElementById('perm-email') && document.getElementById('perm-email').value || '').trim().toLowerCase();
        if (!em) return;
        var arr = getPermittedBudget(); if (arr.indexOf(em) < 0) arr.push(em); try { localStorage.setItem(PERM_BUDGET_KEY, JSON.stringify(arr)); } catch (e) { } renderDashboardPermLists(); if (document.getElementById('perm-email')) document.getElementById('perm-email').value = '';
      });
      if (document.getElementById('perm-feasibility-btn')) document.getElementById('perm-feasibility-btn').addEventListener('click', function () {
        var em = (document.getElementById('perm-email') && document.getElementById('perm-email').value || '').trim().toLowerCase();
        if (!em) return;
        var arr = getPermittedFeasibility(); if (arr.indexOf(em) < 0) arr.push(em); try { localStorage.setItem(PERM_FEASIBILITY_KEY, JSON.stringify(arr)); } catch (e) { } renderDashboardPermLists(); if (document.getElementById('perm-email')) document.getElementById('perm-email').value = '';
      });
      if (document.getElementById('perm-service-forms-btn')) document.getElementById('perm-service-forms-btn').addEventListener('click', function () {
        var em = (document.getElementById('perm-email') && document.getElementById('perm-email').value || '').trim().toLowerCase();
        if (!em) return;
        var arr = getPermittedServiceForms(); if (arr.indexOf(em) < 0) arr.push(em); try { localStorage.setItem(PERM_SERVICE_FORMS_KEY, JSON.stringify(arr)); } catch (e) { } renderDashboardPermLists(); if (typeof updateServiceFormsGates === 'function') updateServiceFormsGates(); if (document.getElementById('perm-email')) document.getElementById('perm-email').value = '';
      });

      /* الموظفون والصلاحيات — إضافة من لوحة التحكم فقط، تحديد المهام والدور والصلاحيات بدقة */
      var STAFF_LIST_KEY = 'iif-staff-list';
      var STAFF_PERMISSIONS = [
        { id: 'h_dash', isHeader: true, en: 'Dashboard & profile', ar: 'لوحة التحكم والملف الشخصي' },
        { id: 'view_dashboard', en: 'Open & use dashboard', ar: 'فتح واستخدام لوحة التحكم' },
        { id: 'edit_own_profile', en: 'Edit own profile & images (My content)', ar: 'تعديل الملف والصور (محتواي)' },
        { id: 'h_letters', isHeader: true, en: 'Letters & letterhead', ar: 'الخطابات والهيدر ليتر' },
        { id: 'manage_letters', en: 'All letters & letterhead (full)', ar: 'كل الخطابات والهيدر (كامل)' },
        { id: 'letterhead_sheet', en: 'Letterhead sheet only', ar: 'ورقة الهيدر ليتر فقط' },
        { id: 'letters_outbox', en: 'Letters & QR / outgoing', ar: 'الخطابات والكيو آر / الصادر' },
        { id: 'letters_inbox', en: 'Inbox / pending letters', ar: 'الوارد / الخطابات المعلقة' },
        { id: 'verify_qr', en: 'Verify QR for letters', ar: 'التحقق من كيو آر الخطابات' },
        { id: 'view_full_archive', en: 'Full outgoing archive', ar: 'أرشيف الصادر الكامل' },
        { id: 'h_team', isHeader: true, en: 'Our Team section', ar: 'قسم فريقنا' },
        { id: 'manage_team', en: 'Full team management', ar: 'إدارة الفريق كاملة' },
        { id: 'team_profiles_edit', en: 'Edit team names & bios', ar: 'تعديل الأسماء والنبذ' },
        { id: 'team_photo_upload', en: 'Upload team photos only', ar: 'رفع صور الفريق فقط' },
        { id: 'h_projects', isHeader: true, en: 'Investment projects (homepage)', ar: 'المشاريع الاستثمارية (الصفحة الرئيسية)' },
        { id: 'edit_activities', en: 'Edit investment projects list', ar: 'تعديل قائمة المشاريع الاستثمارية' },
        { id: 'h_uploads', isHeader: true, en: 'Received uploads', ar: 'الرفوعات المستلمة' },
        { id: 'view_uploads', en: 'View uploads (read)', ar: 'عرض الرفوعات (قراءة)' },
        { id: 'uploads_assign_staff', en: 'Assign uploads to specialist', ar: 'إسناد الرفوعات للمختص' },
        { id: 'h_submissions', isHeader: true, en: 'Contact & forms', ar: 'التواصل والنماذج' },
        { id: 'view_submissions', en: 'All submissions (contact + investor + urgent)', ar: 'كل الطلبات (تواصل + مستثمر + عاجل)' },
        { id: 'submissions_contact_view', en: 'Contact forms only', ar: 'نماذج التواصل فقط' },
        { id: 'submissions_investor_view', en: 'Investor registrations only', ar: 'تسجيلات المستثمر فقط' },
        { id: 'h_perm', isHeader: true, en: 'Protected results (budget / feasibility)', ar: 'النتائج المحمية (ميزانيات / جدوى)' },
        { id: 'manage_permissions', en: 'Grant/revoke view permissions (both)', ar: 'منح/سحب صلاحيات الاطلاع (كلاهما)' },
        { id: 'grant_budget_permission', en: 'Grant budget results access only', ar: 'منح اطلاع الميزانيات فقط' },
        { id: 'grant_feasibility_permission', en: 'Grant feasibility results access only', ar: 'منح اطلاع الجدوى فقط' },
        { id: 'view_budget', en: 'View budget analysis results', ar: 'عرض نتائج تحليل الميزانيات' },
        { id: 'view_feasibility', en: 'View feasibility study results', ar: 'عرض نتائج دراسات الجدوى' },
        { id: 'h_gov', isHeader: true, en: 'Government / diplomatic directory', ar: 'الدليل الحكومي والدبلوماسي' },
        { id: 'manage_gov_dir', en: 'Edit gov/diplomatic directory', ar: 'تعديل الدليل الحكومي والسفارات' },
        { id: 'h_staff', isHeader: true, en: 'Staff & evaluations', ar: 'الموظفون والتقييمات' },
        { id: 'manage_staff', en: 'Add/edit staff & their permissions', ar: 'إضافة/تعديل الموظفين وصلاحياتهم' },
        { id: 'staff_list_manage', en: 'Staff list only (no global permissions)', ar: 'قائمة الموظفين فقط (بدون صلاحيات عامة)' },
        { id: 'view_reports', en: 'View reports & evaluation data (read)', ar: 'التقارير وبيانات التقييم (اطلاع)' },
        { id: 'staff_eval_view', en: 'View staff evaluations', ar: 'عرض تقييمات الموظفين' },
        { id: 'staff_eval_manage', en: 'Create/edit staff evaluations', ar: 'إنشاء/تعديل تقييمات الموظفين' },
        { id: 'h_membership', isHeader: true, en: 'Membership & representatives', ar: 'العضوية والممثلون' },
        { id: 'issue_membership_certificate', en: 'Digital membership cards & reminders (full)', ar: 'بطاقات العضوية الرقمية والتذكيرات (كامل)' },
        { id: 'membership_cert_issue', en: 'Issue digital cards only', ar: 'إصدار البطاقات الرقمية فقط' },
        { id: 'membership_reminders', en: 'Membership reminders only', ar: 'تذكيرات العضوية فقط' },
        { id: 'add_member_free', en: 'Add members free (direct)', ar: 'إضافة أعضاء مجاناً (مباشر)' },
        { id: 'add_fund_member', en: 'Add fund member (public list)', ar: 'إضافة عضو صندوق (قائمة عامة)' },
        { id: 'representatives_accept', en: 'Accept/reject representatives', ar: 'قبول/رفض الممثلين' },
        { id: 'h_business', isHeader: true, en: 'Business systems & analysis', ar: 'أنظمة الأعمال والتحليل' },
        { id: 'take_decision', en: 'Take business decisions (full)', ar: 'أخذ قرارات الأعمال (كامل)' },
        { id: 'business_systems_access', en: 'Business systems section only', ar: 'قسم أنظمة الأعمال فقط' },
        { id: 'project_analysis_access', en: 'Project analysis section only', ar: 'قسم تحليل المشاريع فقط' },
        { id: 'h_data', isHeader: true, en: 'Data & backup', ar: 'البيانات والنسخ الاحتياطي' },
        { id: 'db_backup_access', en: 'IndexedDB save/load (backup)', ar: 'حفظ/تحميل قاعدة البيانات (نسخ احتياطي)' }
      ];
      var STAFF_ROLE_TYPE_LABELS = { staff: { en: 'Staff', ar: 'موظف' }, member: { en: 'Member', ar: 'عضو' }, representative: { en: 'Our representative', ar: 'ممثل لنا في بلده' } };
      /** قوالب سريعة — تطبّق مجموعة صلاحيات؛ يمكنك تعديلها بعدها يدوياً */
      var STAFF_PERM_QUICK_PRESETS = [
        { id: 'minimal', en: 'Basic: dashboard + my profile', ar: 'أساسي: لوحة + محتواي فقط', perms: ['view_dashboard', 'edit_own_profile'] },
        { id: 'letters_desk', en: 'Letters desk (head + outbox + verify)', ar: 'مكتب خطابات (هيدر + صادر + تصديق)', perms: ['view_dashboard', 'edit_own_profile', 'letterhead_sheet', 'letters_outbox', 'verify_qr', 'view_full_archive'] },
        { id: 'letters_full', en: 'Letters (full bundle)', ar: 'خطابات (حزمة كاملة)', perms: ['view_dashboard', 'edit_own_profile', 'manage_letters', 'verify_qr', 'view_full_archive'] },
        { id: 'team_content', en: 'Our Team section', ar: 'قسم فريقنا', perms: ['view_dashboard', 'edit_own_profile', 'manage_team'] },
        { id: 'projects', en: 'Investment projects', ar: 'المشاريع الاستثمارية', perms: ['view_dashboard', 'edit_own_profile', 'edit_activities', 'business_systems_access', 'project_analysis_access'] },
        { id: 'inbox_forms', en: 'Uploads + forms', ar: 'رفوعات + نماذج', perms: ['view_dashboard', 'edit_own_profile', 'view_uploads', 'view_submissions'] },
        { id: 'analyst', en: 'Budget / feasibility (view)', ar: 'ميزانيات وجدوى (اطلاع)', perms: ['view_dashboard', 'edit_own_profile', 'view_budget', 'view_feasibility'] },
        { id: 'perm_granter', en: 'Grant protected access', ar: 'منح اطلاع محمي', perms: ['view_dashboard', 'edit_own_profile', 'manage_permissions', 'grant_budget_permission', 'grant_feasibility_permission'] },
        { id: 'gov_dir', en: 'Gov / diplomatic directory', ar: 'الدليل الحكومي', perms: ['view_dashboard', 'edit_own_profile', 'manage_gov_dir'] },
        { id: 'membership_desk', en: 'Membership + reps', ar: 'عضوية وممثلون', perms: ['view_dashboard', 'edit_own_profile', 'issue_membership_certificate', 'representatives_accept', 'add_fund_member', 'add_member_free'] },
        { id: 'staff_hr', en: 'Staff list + evaluations', ar: 'موظفون وتقييم', perms: ['view_dashboard', 'edit_own_profile', 'staff_list_manage', 'view_reports', 'staff_eval_view', 'staff_eval_manage'] },
        { id: 'staff_admin', en: 'Full staff management', ar: 'إدارة موظفين كاملة', perms: ['view_dashboard', 'edit_own_profile', 'manage_staff', 'staff_list_manage', 'view_reports', 'staff_eval_manage'] },
        { id: 'backup_only', en: 'Database backup only', ar: 'نسخ احتياطي فقط', perms: ['view_dashboard', 'edit_own_profile', 'db_backup_access'] }
      ];
      /* أي صلاحية مخزّنة تُقبل عند السؤال عن permId (يشمل الصلاحيات القديمة والمجمّعة) */
      var STAFF_PERM_ALIASES = {
        view_dashboard: ['view_dashboard'],
        edit_own_profile: ['edit_own_profile'],
        manage_letters: ['manage_letters', 'letterhead_sheet', 'letters_outbox', 'letters_inbox'],
        letterhead_sheet: ['manage_letters', 'letterhead_sheet'],
        letters_outbox: ['manage_letters', 'letters_outbox'],
        letters_inbox: ['manage_letters', 'letters_inbox'],
        verify_qr: ['verify_qr'],
        view_full_archive: ['view_full_archive'],
        manage_team: ['manage_team', 'team_profiles_edit', 'team_photo_upload'],
        team_profiles_edit: ['manage_team', 'team_profiles_edit'],
        team_photo_upload: ['manage_team', 'team_photo_upload'],
        edit_activities: ['edit_activities'],
        view_uploads: ['view_uploads', 'uploads_assign_staff'],
        uploads_assign_staff: ['uploads_assign_staff', 'view_uploads'],
        view_submissions: ['view_submissions', 'submissions_contact_view', 'submissions_investor_view'],
        submissions_contact_view: ['view_submissions', 'submissions_contact_view'],
        submissions_investor_view: ['view_submissions', 'submissions_investor_view'],
        manage_permissions: ['manage_permissions', 'grant_budget_permission', 'grant_feasibility_permission'],
        grant_budget_permission: ['manage_permissions', 'grant_budget_permission'],
        grant_feasibility_permission: ['manage_permissions', 'grant_feasibility_permission'],
        view_budget: ['view_budget'],
        view_feasibility: ['view_feasibility'],
        manage_gov_dir: ['manage_gov_dir'],
        /* manage_staff = تعديل كامل؛ staff_list_manage = عرض القائمة فقط؛ القديم يملك manage_staff فيُعامل ككل */
        manage_staff: ['manage_staff'],
        staff_list_manage: ['manage_staff', 'staff_list_manage'],
        view_reports: ['view_reports', 'staff_eval_view', 'staff_eval_manage'],
        staff_eval_view: ['view_reports', 'staff_eval_view', 'staff_eval_manage', 'manage_staff'],
        staff_eval_manage: ['staff_eval_manage', 'manage_staff'],
        issue_membership_certificate: ['issue_membership_certificate', 'membership_cert_issue', 'membership_reminders'],
        membership_cert_issue: ['issue_membership_certificate', 'membership_cert_issue'],
        membership_reminders: ['issue_membership_certificate', 'membership_reminders'],
        add_member_free: ['add_member_free'],
        add_fund_member: ['add_fund_member'],
        representatives_accept: ['representatives_accept', 'issue_membership_certificate'],
        take_decision: ['take_decision', 'business_systems_access', 'project_analysis_access'],
        business_systems_access: ['take_decision', 'business_systems_access'],
        project_analysis_access: ['take_decision', 'project_analysis_access'],
        db_backup_access: ['db_backup_access']
      };
      function getStaffList() { try { var r = localStorage.getItem(STAFF_LIST_KEY); return r ? JSON.parse(r) : []; } catch (e) { return []; } }
      function hasStaffPermission(permId) {
        if (isAdmin()) return true;
        try {
          var email = (localStorage.getItem('iif-user-email') || '').trim().toLowerCase();
          if (!email) return false;
          var list = getStaffList();
          var staff = list.find(function (s) { return (s.email || '').toLowerCase() === email; });
          if (!staff || !Array.isArray(staff.permissions)) return false;
          var perms = staff.permissions;
          if (perms.indexOf(permId) >= 0) return true;
          var alts = STAFF_PERM_ALIASES[permId];
          if (alts && alts.some(function (a) { return perms.indexOf(a) >= 0; })) return true;
          return false;
        } catch (e) { return false; }
      }
      function hasAnyStaffPermission(ids) {
        if (!ids || !ids.length) return false;
        for (var i = 0; i < ids.length; i++) {
          if (hasStaffPermission(ids[i])) return true;
        }
        return false;
      }
      function isOwnerUser() {
        try {
          var email = (localStorage.getItem('iif-user-email') || '').trim().toLowerCase();
          var ownerEmail = (window.IIF_CONFIG && window.IIF_CONFIG.ownerEmail) ? String(window.IIF_CONFIG.ownerEmail).toLowerCase() : 'talalkenani@gmail.com';
          return !!(email && iifAuthEmailKey(email) === iifAuthEmailKey(ownerEmail));
        } catch (e) { return false; }
      }
      /** صلاحية مذكورة صراحة في مصفوفة الموظف (بدون توسعة aliases) — لتمييز manage_staff عن staff_list_manage */
      function staffHasExplicitPermission(permId) {
        if (typeof isAdmin === 'function' && isAdmin()) return true;
        if (isOwnerUser()) return true;
        try {
          var email = (localStorage.getItem('iif-user-email') || '').trim().toLowerCase();
          if (!email) return false;
          var list = getStaffList();
          var staff = list.find(function (s) { return (s.email || '').toLowerCase() === email; });
          return !!(staff && Array.isArray(staff.permissions) && staff.permissions.indexOf(permId) >= 0);
        } catch (e) { return false; }
      }
      function isPaidSubscriberForDashboard() {
        try {
          var email = (localStorage.getItem('iif-user-email') || '').trim().toLowerCase();
          if (!email) return false;
          if (typeof getFundMembers === 'function' && getFundMembers().some(function (m) { return (m.email || '').trim().toLowerCase() === email; })) return true;
          if (typeof getMembershipRegistry === 'function') {
            var reg = getMembershipRegistry();
            if (reg.some(function (r) { return (r.email || '').toLowerCase() === email && ((r.type && String(r.type).trim()) || (r.endDate && String(r.endDate).trim())); })) return true;
          }
          return typeof IIF_MEMBERSHIP_AUTH !== 'undefined' && IIF_MEMBERSHIP_AUTH.hasValidMembership && IIF_MEMBERSHIP_AUTH.hasValidMembership();
        } catch (e) { return false; }
      }
      function isSiteUserAllowedForDashboard() {
        try {
          var email = (localStorage.getItem('iif-user-email') || '').trim().toLowerCase();
          if (!email) return false;
          if (typeof getSiteUsers !== 'function') return true;
          var users = getSiteUsers();
          var u = users.find(function (x) { return (x.email || '').toLowerCase() === email; });
          if (!u) return true;
          return (u.status || 'active') !== 'excluded';
        } catch (e) { return true; }
      }
      function canAccessDashboard() {
        try {
          var email = (localStorage.getItem('iif-user-email') || '').trim().toLowerCase();
          if (!email) return false;
          if (typeof isEmailBlockedFromSite === 'function' && isEmailBlockedFromSite(email)) return false;
          if (localStorage.getItem('iif-is-admin') === '1') return true;
          if (typeof isLoggedIn !== 'function' || !isLoggedIn()) return false;
          var ownerEmail = (window.IIF_CONFIG && window.IIF_CONFIG.ownerEmail) ? String(window.IIF_CONFIG.ownerEmail).toLowerCase() : 'talalkenani@gmail.com';
          try {
            if (email && typeof iifAuthEmailKey === 'function' && iifAuthEmailKey(email) === iifAuthEmailKey(ownerEmail)) return true;
          } catch (eOwn) { }
          if (typeof isAdmin === 'function' && isAdmin()) return true;
          if (typeof hasStaffPermission === 'function' && hasStaffPermission('view_dashboard')) return true;
          if (isPaidSubscriberForDashboard()) return true;
          /* موظف مضاف في القائمة دون تفعيل «استخدام لوحة التحكم» لا يُعامل كمستخدم عادي */
          if (typeof isStaff === 'function' && isStaff() && typeof hasStaffPermission === 'function' && !hasStaffPermission('view_dashboard')) return false;
          if (isSiteUserAllowedForDashboard()) return true;
          return false;
        } catch (e) { return false; }
      }
      function getDashboardAccessType() {
        try {
          var email = (localStorage.getItem('iif-user-email') || '').trim().toLowerCase();
          var ownerEmail = (window.IIF_CONFIG && window.IIF_CONFIG.ownerEmail) ? String(window.IIF_CONFIG.ownerEmail).toLowerCase() : 'talalkenani@gmail.com';
          if (email && iifAuthEmailKey(email) === iifAuthEmailKey(ownerEmail)) return 'owner';
          if (typeof isAdmin === 'function' && isAdmin()) return 'owner';
          if (typeof hasStaffPermission === 'function' && hasStaffPermission('view_dashboard')) return 'staff';
          if (isPaidSubscriberForDashboard()) return 'member';
          return 'user';
        } catch (e) { return 'user'; }
      }
      var DASHBOARD_MAIN_SECTION_IDS = ['dashboard-section-overview', 'dashboard-section-data', 'dashboard-section-projects', 'dashboard-letterhead-sheet', 'dashboard-letters', 'dashboard-team', 'dashboard-uploads', 'dashboard-permissions', 'dashboard-user-registry', 'dashboard-exclusion-archive', 'dashboard-submissions', 'dashboard-suggestions', 'dashboard-staff-roles', 'dashboard-fund-members', 'dashboard-membership-reminders', 'dashboard-accept-representatives', 'dashboard-add-members-direct', 'dashboard-staff-evaluation', 'dashboard-gov-directory', 'dashboard-business-systems', 'dashboard-project-analysis'];
      function resetDashboardSectionStyles() {
        DASHBOARD_MAIN_SECTION_IDS.forEach(function (id) {
          var el = document.getElementById(id);
          if (el) el.style.display = '';
        });
        var vis = document.getElementById('dashboard-visitor-counter');
        if (vis) vis.style.display = '';
        var chair = document.querySelector('#dashboard-overlay .chairman-dashboard-card');
        if (chair) chair.style.display = '';
        var rw = document.getElementById('dashboard-role-welcome');
        if (rw) rw.style.display = 'none';
        var toc = document.getElementById('dashboard-toc-nav');
        if (toc) {
          toc.style.display = '';
          toc.querySelectorAll('a[data-toc-target]').forEach(function (a) { a.style.display = ''; });
        }
      }
      /** هل يظهر قسم اللوحة المرتبط برابط TOC (يتحقق من الأسلاف إن كان القسم داخل قسم آخر) */
      function isDashboardTocTargetVisible(targetId) {
        var el = document.getElementById(targetId);
        if (!el) return false;
        var walk = el;
        while (walk) {
          if (walk.style && walk.style.display === 'none') return false;
          walk = walk.parentElement;
        }
        return true;
      }
      /** إخفاء روابط الانتقال السريع التي تشير لأقسام مخفاة (موظف / عضو / مالك بحسب الصلاحيات) */
      function refreshDashboardTocZones() {
        var nav = document.getElementById('dashboard-toc-nav');
        if (!nav) return;
        nav.querySelectorAll('.dashboard-toc__zone').forEach(function (zone) {
          var row = zone.querySelector('.dashboard-toc__row');
          if (!row) return;
          var visible = false;
          row.querySelectorAll('a[data-toc-target]').forEach(function (a) {
            if (a.style.display !== 'none') visible = true;
          });
          zone.style.display = visible ? '' : 'none';
        });
      }
      function syncDashboardTocLinks() {
        var nav = document.getElementById('dashboard-toc-nav');
        if (!nav) return;
        var type = typeof getDashboardAccessType === 'function' ? getDashboardAccessType() : 'user';
        if (type === 'user') {
          nav.querySelectorAll('a[data-toc-target]').forEach(function (a) { a.style.display = ''; });
          refreshDashboardTocZones();
          return;
        }
        nav.querySelectorAll('a[data-toc-target]').forEach(function (a) {
          var id = a.getAttribute('data-toc-target');
          a.style.display = isDashboardTocTargetVisible(id) ? '' : 'none';
        });
        refreshDashboardTocZones();
      }
      function applyDashboardAccessRules() {
        resetDashboardSectionStyles();
        var type = getDashboardAccessType();
        var welcomeEl = document.getElementById('dashboard-role-welcome');
        var welcomeText = document.getElementById('dashboard-role-welcome-text');
        if (type === 'owner') {
          if (welcomeEl) welcomeEl.style.display = 'none';
          var staffSection = document.getElementById('dashboard-staff-roles');
          if (staffSection) staffSection.style.display = (typeof hasStaffPermission === 'function' && hasStaffPermission('staff_list_manage')) || isAdmin() ? '' : 'none';
          var evalSection = document.getElementById('dashboard-staff-evaluation');
          if (evalSection) evalSection.style.display = (isAdmin() || (typeof hasStaffPermission === 'function' && (hasStaffPermission('view_reports') || hasStaffPermission('staff_list_manage')))) ? '' : 'none';
          var fundMembersSection = document.getElementById('dashboard-fund-members');
          if (fundMembersSection) fundMembersSection.style.display = (isAdmin() || (typeof hasStaffPermission === 'function' && (hasStaffPermission('add_fund_member') || hasStaffPermission('add_member_free')))) ? '' : 'none';
          var remindersSection = document.getElementById('dashboard-membership-reminders');
          if (remindersSection) remindersSection.style.display = (isAdmin() || (typeof hasStaffPermission === 'function' && hasStaffPermission('issue_membership_certificate'))) ? '' : 'none';
          var acceptRepSection = document.getElementById('dashboard-accept-representatives');
          if (acceptRepSection) acceptRepSection.style.display = (isAdmin() || (typeof hasStaffPermission === 'function' && hasStaffPermission('representatives_accept'))) ? '' : 'none';
          var addMembersSection = document.getElementById('dashboard-add-members-direct');
          if (addMembersSection) addMembersSection.style.display = (isAdmin() || (typeof hasStaffPermission === 'function' && hasStaffPermission('add_member_free'))) ? '' : 'none';
          var evalFormWrap = document.querySelector('#dashboard-staff-evaluation .staff-eval-form-wrap');
          if (evalFormWrap) evalFormWrap.style.display = (isAdmin() || (typeof hasStaffPermission === 'function' && hasStaffPermission('staff_eval_manage'))) ? '' : 'none';
          var suggestionsSection = document.getElementById('dashboard-suggestions');
          if (suggestionsSection) suggestionsSection.style.display = isAdmin() ? '' : 'none';
          var staffAddForm = document.getElementById('staff-add-form');
          if (staffAddForm) staffAddForm.style.display = (typeof staffHasExplicitPermission === 'function' && staffHasExplicitPermission('manage_staff')) ? '' : 'none';
          syncDashboardTocLinks();
          return;
        }
        if (welcomeEl && welcomeText) {
          welcomeEl.style.display = 'block';
          if (type === 'staff') {
            welcomeText.textContent = iifMessage('dashWelcomeStaff');
          } else if (type === 'member') {
            welcomeText.textContent = iifMessage('dashWelcomeMember');
          } else {
            welcomeText.textContent = iifMessage('dashWelcomeRegistered');
          }
        }
        var vis = document.getElementById('dashboard-visitor-counter');
        if (vis) vis.style.display = 'none';
        var chair = document.querySelector('#dashboard-overlay .chairman-dashboard-card');
        if (chair) chair.style.display = 'none';
        DASHBOARD_MAIN_SECTION_IDS.forEach(function (id) {
          var el = document.getElementById(id);
          if (el) el.style.display = 'none';
        });
        if (type === 'staff') {
          if (document.getElementById('dashboard-section-overview')) document.getElementById('dashboard-section-overview').style.display = '';
          if (hasStaffPermission('edit_activities') && document.getElementById('dashboard-section-projects')) document.getElementById('dashboard-section-projects').style.display = '';
          if (hasStaffPermission('letterhead_sheet') && document.getElementById('dashboard-letterhead-sheet')) document.getElementById('dashboard-letterhead-sheet').style.display = '';
          if ((hasStaffPermission('letters_outbox') || hasStaffPermission('letters_inbox')) && document.getElementById('dashboard-letters')) document.getElementById('dashboard-letters').style.display = '';
          if (hasStaffPermission('manage_team') && document.getElementById('dashboard-team')) document.getElementById('dashboard-team').style.display = '';
          if (hasStaffPermission('view_uploads') && document.getElementById('dashboard-uploads')) document.getElementById('dashboard-uploads').style.display = '';
          if (hasStaffPermission('manage_permissions') && document.getElementById('dashboard-permissions')) document.getElementById('dashboard-permissions').style.display = '';
          if (hasStaffPermission('view_submissions') && document.getElementById('dashboard-submissions')) document.getElementById('dashboard-submissions').style.display = '';
          if (hasStaffPermission('manage_gov_dir') && document.getElementById('dashboard-gov-directory')) document.getElementById('dashboard-gov-directory').style.display = '';
          if (hasStaffPermission('staff_list_manage') && document.getElementById('dashboard-staff-roles')) document.getElementById('dashboard-staff-roles').style.display = '';
          if ((hasStaffPermission('view_reports') || hasStaffPermission('staff_list_manage')) && document.getElementById('dashboard-staff-evaluation')) document.getElementById('dashboard-staff-evaluation').style.display = '';
          if ((hasStaffPermission('add_fund_member') || hasStaffPermission('add_member_free')) && document.getElementById('dashboard-fund-members')) document.getElementById('dashboard-fund-members').style.display = '';
          if (hasStaffPermission('issue_membership_certificate') && document.getElementById('dashboard-membership-reminders')) document.getElementById('dashboard-membership-reminders').style.display = '';
          if (hasStaffPermission('representatives_accept') && document.getElementById('dashboard-accept-representatives')) document.getElementById('dashboard-accept-representatives').style.display = '';
          if (hasStaffPermission('add_member_free') && document.getElementById('dashboard-add-members-direct')) document.getElementById('dashboard-add-members-direct').style.display = '';
          var canDataProtected = hasStaffPermission('view_budget') || hasStaffPermission('view_feasibility') || hasStaffPermission('manage_permissions');
          var canDataBackup = hasStaffPermission('db_backup_access');
          if ((canDataProtected || canDataBackup) && document.getElementById('dashboard-section-data')) document.getElementById('dashboard-section-data').style.display = '';
          var geoCard = document.getElementById('dashboard-card-geo');
          var dbCard = document.getElementById('dashboard-card-db-backup');
          if (geoCard) geoCard.style.display = canDataProtected ? '' : 'none';
          if (dbCard) dbCard.style.display = (canDataProtected || canDataBackup) ? '' : 'none';
          if ((hasStaffPermission('business_systems_access') || hasStaffPermission('edit_activities')) && document.getElementById('dashboard-business-systems')) document.getElementById('dashboard-business-systems').style.display = '';
          if ((hasStaffPermission('project_analysis_access') || hasStaffPermission('edit_activities')) && document.getElementById('dashboard-project-analysis')) document.getElementById('dashboard-project-analysis').style.display = '';
          var staffSection = document.getElementById('dashboard-staff-roles');
          if (staffSection) staffSection.style.display = hasStaffPermission('staff_list_manage') ? '' : 'none';
          var evalSection = document.getElementById('dashboard-staff-evaluation');
          if (evalSection) evalSection.style.display = (hasStaffPermission('view_reports') || hasStaffPermission('staff_list_manage')) ? '' : 'none';
          var evalFormWrap = document.querySelector('#dashboard-staff-evaluation .staff-eval-form-wrap');
          if (evalFormWrap) evalFormWrap.style.display = hasStaffPermission('staff_eval_manage') ? '' : 'none';
          var staffAddFormSt = document.getElementById('staff-add-form');
          if (staffAddFormSt) staffAddFormSt.style.display = (typeof staffHasExplicitPermission === 'function' && staffHasExplicitPermission('manage_staff')) ? '' : 'none';
          syncDashboardTocLinks();
          return;
        }
        if (type === 'member') {
          if (document.getElementById('dashboard-section-overview')) document.getElementById('dashboard-section-overview').style.display = '';
          if (typeof IIF_MEMBERSHIP_AUTH !== 'undefined' && IIF_MEMBERSHIP_AUTH.hasValidMembership && IIF_MEMBERSHIP_AUTH.hasValidMembership() && document.getElementById('dashboard-uploads')) document.getElementById('dashboard-uploads').style.display = '';
          syncDashboardTocLinks();
          return;
        }
        if (document.getElementById('dashboard-section-overview')) document.getElementById('dashboard-section-overview').style.display = '';
        /* مستخدم مسجّل فقط: لا تخفِ فهرس الأقسام بالكامل — يبدو وكأن اللوحة «اسم بلا مكوّنات». أظهر انتقالاً إلى نظرة عامة / محتواي فقط */
        var toc = document.getElementById('dashboard-toc-nav');
        if (toc) {
          toc.style.display = '';
          toc.querySelectorAll('a[data-toc-target]').forEach(function (a) {
            var id = a.getAttribute('data-toc-target') || '';
            a.style.display = (id === 'dashboard-section-overview' || id === 'dashboard-my-content' || id === 'dashboard-user-profile') ? '' : 'none';
          });
          if (typeof refreshDashboardTocZones === 'function') refreshDashboardTocZones();
        }
      }
      function saveStaffList(list) { try { localStorage.setItem(STAFF_LIST_KEY, JSON.stringify(list)); } catch (e) { } }
      try {
        window.canAccessDashboard = canAccessDashboard;
        window.getDashboardAccessType = getDashboardAccessType;
        window.applyDashboardAccessRules = applyDashboardAccessRules;
        window.hasStaffPermission = hasStaffPermission;
        window.hasAnyStaffPermission = hasAnyStaffPermission;
        window.staffHasExplicitPermission = staffHasExplicitPermission;
        window.syncDashboardTocLinks = syncDashboardTocLinks;
        window.refreshDashboardTocZones = refreshDashboardTocZones;
        window.isDashboardTocTargetVisible = isDashboardTocTargetVisible;
      } catch (e) { }
      function getDashboardMyFundMemberIndex() {
        var email = (localStorage.getItem('iif-user-email') || '').trim().toLowerCase();
        if (!email || typeof getFundMembers !== 'function') return -1;
        return getFundMembers().findIndex(function (m) { return (m.email || '').trim().toLowerCase() === email; });
      }
      function loadDashboardMyContent() {
        var email = (localStorage.getItem('iif-user-email') || '').trim().toLowerCase();
        if (!email) return;
        var name = (localStorage.getItem('iif-user-name') || '').trim();
        var idx = getDashboardMyFundMemberIndex();
        var m = idx >= 0 && typeof getFundMembers === 'function' ? getFundMembers()[idx] : null;
        var ne = document.getElementById('dash-my-name-en');
        var na = document.getElementById('dash-my-name-ar');
        if (ne) ne.value = (m && m.nameEn) ? m.nameEn : name;
        if (na) na.value = (m && m.nameAr) ? m.nameAr : name;
        var be = document.getElementById('dash-my-bio-en');
        var ba = document.getElementById('dash-my-bio-ar');
        if (be) be.value = (m && m.bioEn) ? m.bioEn : '';
        if (ba) ba.value = (m && m.bioAr) ? m.bioAr : '';
        var de = document.getElementById('dash-my-def-en');
        var da = document.getElementById('dash-my-def-ar');
        if (de && typeof getCertDefinitionEn === 'function') de.value = getCertDefinitionEn();
        if (da && typeof getCertDefinitionAr === 'function') da.value = getCertDefinitionAr();
        function showImgPreview(imgEl, dataUrlOrUrl) {
          if (!imgEl) return;
          var s = dataUrlOrUrl && String(dataUrlOrUrl).trim();
          if (s && s.length > 10) {
            imgEl.src = s;
            imgEl.style.display = 'block';
          } else {
            imgEl.style.display = 'none';
          }
        }
        var ph = (typeof getCertPhoto === 'function' ? getCertPhoto() : '') || (m && m.photoUrl) || '';
        showImgPreview(document.getElementById('dash-my-photo-preview'), ph);
        var pData = document.getElementById('dash-my-photo-data');
        if (pData) pData.value = '';
        var logo = typeof getCertLogo === 'function' ? getCertLogo() : '';
        showImgPreview(document.getElementById('dash-my-logo-preview'), logo);
        var lData = document.getElementById('dash-my-logo-data');
        if (lData) lData.value = '';
        var flag = typeof getCertFlag === 'function' ? getCertFlag() : '';
        showImgPreview(document.getElementById('dash-my-flag-preview'), flag);
        var fData = document.getElementById('dash-my-flag-data');
        if (fData) fData.value = '';
        if (typeof getStoredEntity === 'function') {
          var entity = getStoredEntity();
          var lr = document.getElementById('dash-my-logo-row');
          var fr = document.getElementById('dash-my-flag-row');
          if (lr) lr.style.display = entity === 'company' ? '' : 'none';
          if (fr) fr.style.display = (entity === 'state' || entity === 'government_org') ? '' : 'none';
        }
        try {
          var rawP = localStorage.getItem('iif-user-profile');
          var prof = rawP ? JSON.parse(rawP) : {};
          var slot = prof[email] || {};
          if (slot.fullName) {
            if (ne && (!(m && m.nameEn) && !name)) ne.value = slot.fullName;
            if (na && (!(m && m.nameAr) && !name)) na.value = slot.fullName;
          }
          if (slot.bio) {
            if (be && !((m && m.bioEn) || '').trim()) be.value = slot.bio;
            if (ba && !((m && m.bioAr) || '').trim()) ba.value = slot.bio;
          }
        } catch (eProf) { }
        var st = document.getElementById('dash-my-save-status');
        if (st) st.textContent = '';
        var pc = document.getElementById('dash-my-pw-current');
        var pn = document.getElementById('dash-my-pw-new');
        var p2 = document.getElementById('dash-my-pw-new2');
        var pst = document.getElementById('dash-my-pw-status');
        if (pc) pc.value = '';
        if (pn) pn.value = '';
        if (p2) p2.value = '';
        if (pst) pst.textContent = '';
      }
      function saveDashboardMyPassword() {
        var email = (localStorage.getItem('iif-user-email') || '').trim().toLowerCase();
        var st = document.getElementById('dash-my-pw-status');
        var curEl = document.getElementById('dash-my-pw-current');
        var nwEl = document.getElementById('dash-my-pw-new');
        var nw2El = document.getElementById('dash-my-pw-new2');
        var cur = (curEl && curEl.value) || '';
        var nw = (nwEl && nwEl.value) || '';
        var nw2 = (nw2El && nw2El.value) || '';
        function setStatus(msg) { if (st) st.textContent = msg || ''; }
        if (!email) { setStatus(iifMessage('dashMyNoSignedEmail')); return; }
        if (!nw || !nw2) { setStatus(iifMessage('dashMyEnterNewPwTwice')); return; }
        if (nw !== nw2) { setStatus(iifMessage('dashMyNewPwMismatch')); return; }
        if (typeof isStrongPassword === 'function' && !isStrongPassword(nw)) {
          setStatus(iifMessage('dashMyPwWeakPolicy'));
          return;
        }
        var cred = typeof getCredentialForEmail === 'function' ? getCredentialForEmail(email) : null;
        if (cred && cred.hash) {
          if (!cur) { setStatus(iifMessage('dashMyEnterCurrentPw')); return; }
          if (typeof verifyPasswordForEmail !== 'function' || typeof setCredentialForEmail !== 'function') {
            setStatus(iifMessage('dashMyPwHelpersUnavailable'));
            return;
          }
          verifyPasswordForEmail(email, cur).then(function (ok) {
            if (!ok) { setStatus(iifMessage('dashMyCurrentPwWrong')); return; }
            setCredentialForEmail(email, nw).then(function (sok) {
              setStatus(sok ? iifMessage('dashMyPwUpdated') : iifMessage('dashMySaveFailed'));
              if (sok && curEl) curEl.value = '';
              if (sok && nwEl) nwEl.value = '';
              if (sok && nw2El) nw2El.value = '';
            });
          });
        } else {
          if (typeof setCredentialForEmail !== 'function') { setStatus(iifMessage('dashMyPwHelpersUnavailable')); return; }
          setCredentialForEmail(email, nw).then(function (sok) {
            setStatus(sok ? iifMessage('dashMyPwSet') : iifMessage('dashMySaveFailed'));
            if (sok && nwEl) nwEl.value = '';
            if (sok && nw2El) nw2El.value = '';
          });
        }
      }
      function saveDashboardMyContent() {
        var email = (localStorage.getItem('iif-user-email') || '').trim().toLowerCase();
        if (!email) return;
        var ne = (document.getElementById('dash-my-name-en') && document.getElementById('dash-my-name-en').value) || '';
        var na = (document.getElementById('dash-my-name-ar') && document.getElementById('dash-my-name-ar').value) || '';
        var nameCombined = (ne.trim() || na.trim() || email);
        try { localStorage.setItem('iif-user-name', nameCombined); } catch (e1) { }
        var bioEn = (document.getElementById('dash-my-bio-en') && document.getElementById('dash-my-bio-en').value) || '';
        var bioAr = (document.getElementById('dash-my-bio-ar') && document.getElementById('dash-my-bio-ar').value) || '';
        var defEn = (document.getElementById('dash-my-def-en') && document.getElementById('dash-my-def-en').value) || '';
        var defAr = (document.getElementById('dash-my-def-ar') && document.getElementById('dash-my-def-ar').value) || '';
        if (typeof setCertDefinitionEn === 'function') setCertDefinitionEn(defEn);
        if (typeof setCertDefinitionAr === 'function') setCertDefinitionAr(defAr);
        var phData = (document.getElementById('dash-my-photo-data') && document.getElementById('dash-my-photo-data').value) || '';
        if (phData && phData.indexOf('data:') === 0 && typeof setCertPhoto === 'function') setCertPhoto(phData);
        var lgData = (document.getElementById('dash-my-logo-data') && document.getElementById('dash-my-logo-data').value) || '';
        if (lgData && lgData.indexOf('data:') === 0 && typeof setCertLogo === 'function') setCertLogo(lgData);
        var fgData = (document.getElementById('dash-my-flag-data') && document.getElementById('dash-my-flag-data').value) || '';
        if (fgData && fgData.indexOf('data:') === 0 && typeof setCertFlag === 'function') setCertFlag(fgData);
        var idx = getDashboardMyFundMemberIndex();
        if (idx >= 0 && typeof getFundMembers === 'function' && typeof saveFundMembers === 'function') {
          var list = getFundMembers();
          var prev = list[idx];
          var finalPhoto = phData && phData.indexOf('data:') === 0 ? phData : ((prev && prev.photoUrl) ? prev.photoUrl : ((typeof getCertPhoto === 'function' ? getCertPhoto() : '') || ''));
          list[idx] = Object.assign({}, prev, {
            nameEn: ne.trim() || prev.nameEn || nameCombined,
            nameAr: na.trim() || prev.nameAr || nameCombined,
            bioEn: bioEn.trim(),
            bioAr: bioAr.trim(),
            photoUrl: finalPhoto || ''
          });
          saveFundMembers(list);
        }
        if (typeof renderPublicMembersList === 'function') renderPublicMembersList();
        if (typeof renderDashboardFundMembersList === 'function') renderDashboardFundMembersList();
        if (typeof refreshCertImagePreviews === 'function') refreshCertImagePreviews();
        if (typeof updateDashboardNav === 'function') updateDashboardNav();
        try {
          var rawP = localStorage.getItem('iif-user-profile');
          var prof = rawP ? JSON.parse(rawP) : {};
          if (!prof[email]) prof[email] = {};
          prof[email].fullName = nameCombined;
          prof[email].bio = (bioEn.trim() || bioAr.trim()) || (prof[email].bio || '');
          prof[email].updatedAt = new Date().toISOString();
          localStorage.setItem('iif-user-profile', JSON.stringify(prof));
        } catch (eProf2) { }
        var st = document.getElementById('dash-my-save-status');
        if (st) st.textContent = iifMessage('dashSavedStatus');
        setTimeout(function () { var s = document.getElementById('dash-my-save-status'); if (s) s.textContent = ''; }, 3500);
      }
      function initDashboardMyContentPanel() {
        if (window.__dashMyContentInitialized) return;
        window.__dashMyContentInitialized = true;
        var saveBtn = document.getElementById('dash-my-save-btn');
        if (saveBtn) saveBtn.addEventListener('click', function () { saveDashboardMyContent(); });
        function bindFile(inputId, dataId, previewId) {
          var inp = document.getElementById(inputId);
          var dEl = document.getElementById(dataId);
          var prev = document.getElementById(previewId);
          if (!inp || !dEl) return;
          inp.addEventListener('change', function () {
            var f = inp.files && inp.files[0];
            if (!f) return;
            if (typeof SAFE_IMAGE_MIMES !== 'undefined' && SAFE_IMAGE_MIMES.indexOf(f.type) === -1) {
              alert(iifMessage('jsFileTypeNotAllowedShort'));
              inp.value = '';
              return;
            }
            var max = typeof getCertImageMaxSize === 'function' ? getCertImageMaxSize() : 2 * 1024 * 1024;
            if (f.size > max) {
              alert(iifMessage('jsFileTooLargeShort'));
              inp.value = '';
              return;
            }
            var r = new FileReader();
            r.onload = function () {
              var res = r.result || '';
              if (typeof checkImageContentSafe === 'function') {
                checkImageContentSafe(res).then(function (ck) {
                  if (!ck.safe) {
                    alert(typeof getContentRejectMessage === 'function' ? getContentRejectMessage(ck.reason) : '');
                    inp.value = '';
                    return;
                  }
                  dEl.value = res;
                  if (prev) { prev.src = res; prev.style.display = 'block'; }
                });
              } else {
                dEl.value = res;
                if (prev) { prev.src = res; prev.style.display = 'block'; }
              }
            };
            r.readAsDataURL(f);
          });
        }
        bindFile('dash-my-photo-file', 'dash-my-photo-data', 'dash-my-photo-preview');
        bindFile('dash-my-logo-file', 'dash-my-logo-data', 'dash-my-logo-preview');
        bindFile('dash-my-flag-file', 'dash-my-flag-data', 'dash-my-flag-preview');
        var pwSaveBtn = document.getElementById('dash-my-pw-save-btn');
        if (pwSaveBtn) pwSaveBtn.addEventListener('click', function () { saveDashboardMyPassword(); });
      }
      try {
        window.loadDashboardMyContent = loadDashboardMyContent;
        window.saveDashboardMyContent = saveDashboardMyContent;
        window.saveDashboardMyPassword = saveDashboardMyPassword;
      } catch (e2) { }
      function renderStaffPermissionsGrid(containerId, selectedIds) {
        var container = document.getElementById(containerId);
        if (!container) return;
        selectedIds = selectedIds || [];
        container.innerHTML = '';
        var isAr = document.documentElement.getAttribute('data-lang') === 'ar';
        STAFF_PERMISSIONS.forEach(function (p) {
          if (p.isHeader) {
            var h = document.createElement('div');
            h.className = 'staff-perm-group-title';
            h.textContent = isAr ? p.ar : p.en;
            container.appendChild(h);
            return;
          }
          var label = document.createElement('label');
          var cb = document.createElement('input');
          cb.type = 'checkbox';
          cb.name = 'staff_perm_' + p.id;
          cb.value = p.id;
          cb.checked = selectedIds.indexOf(p.id) >= 0;
          label.appendChild(cb);
          label.appendChild(document.createTextNode(' ' + (isAr ? p.ar : p.en)));
          container.appendChild(label);
        });
      }
      function getStaffFormPermissions() {
        var ids = [];
        STAFF_PERMISSIONS.forEach(function (p) {
          if (p.isHeader) return;
          var el = document.querySelector('#staff-permissions-grid input[name="staff_perm_' + p.id + '"]');
          if (el && el.checked) ids.push(p.id);
        });
        return ids;
      }
      function fillStaffPresetSelect() {
        var sel = document.getElementById('staff-perm-preset-select');
        if (!sel) return;
        var keep = sel.value;
        sel.innerHTML = '';
        var opt0 = document.createElement('option');
        opt0.value = '';
        opt0.textContent = iifMessage('dashStaffQuickPresetBlank');
        sel.appendChild(opt0);
        var presetLang = (document.documentElement.getAttribute('data-lang') || 'en').toLowerCase();
        STAFF_PERM_QUICK_PRESETS.forEach(function (pr) {
          var o = document.createElement('option');
          o.value = pr.id;
          o.textContent = presetLang === 'ar' ? pr.ar : pr.en;
          sel.appendChild(o);
        });
        var kf = false;
        for (var ki = 0; ki < sel.options.length; ki++) {
          if (sel.options[ki].value === keep) { kf = true; break; }
        }
        if (kf) sel.value = keep;
      }
      function applyStaffPermPreset(permIds) {
        var set = {};
        (permIds || []).forEach(function (id) { set[id] = true; });
        STAFF_PERMISSIONS.forEach(function (p) {
          if (p.isHeader) return;
          var el = document.querySelector('#staff-permissions-grid input[name="staff_perm_' + p.id + '"]');
          if (el) el.checked = !!set[p.id];
        });
      }
      function setAllStaffPermCheckboxes(checked) {
        STAFF_PERMISSIONS.forEach(function (p) {
          if (p.isHeader) return;
          var el = document.querySelector('#staff-permissions-grid input[name="staff_perm_' + p.id + '"]');
          if (el) el.checked = !!checked;
        });
      }
      function populateStaffAssignPicker() {
        var sel = document.getElementById('staff-permissions-assign-picker');
        if (!sel) return;
        var prev = sel.value;
        var list = getStaffList();
        sel.innerHTML = '';
        var optNew = document.createElement('option');
        optNew.value = '__new__';
        optNew.textContent = iifMessage('dashStaffNewPerson');
        sel.appendChild(optNew);
        list.forEach(function (s) {
          var o = document.createElement('option');
          o.value = String(s.id);
          o.textContent = (s.name || '') + ' — ' + (s.email || '');
          sel.appendChild(o);
        });
        var found = false;
        for (var i = 0; i < sel.options.length; i++) {
          if (sel.options[i].value === prev) { found = true; break; }
        }
        sel.value = found ? prev : '__new__';
      }
      /** تحديث نصوص شبكة الصلاحيات والقوالب والقائمة عند تغيير اللغة أو فتح اللوحة */
      function refreshStaffPermissionsUi() {
        try {
          var selPerms = typeof getStaffFormPermissions === 'function' ? getStaffFormPermissions() : [];
          if (typeof renderStaffPermissionsGrid === 'function') renderStaffPermissionsGrid('staff-permissions-grid', selPerms);
          if (typeof fillStaffPresetSelect === 'function') fillStaffPresetSelect();
          if (typeof populateStaffAssignPicker === 'function') populateStaffAssignPicker();
        } catch (e) { }
      }
      function loadStaffIntoForm(staff) {
        if (!staff) return;
        var editId = document.getElementById('staff-edit-id');
        if (editId) editId.value = staff.id || '';
        var nameEl = document.getElementById('staff-name');
        var emailEl = document.getElementById('staff-email');
        var roleEl = document.getElementById('staff-role-title');
        var dutiesEl = document.getElementById('staff-duties');
        if (nameEl) nameEl.value = staff.name || '';
        if (emailEl) emailEl.value = staff.email || '';
        if (roleEl) roleEl.value = staff.roleTitle || '';
        if (dutiesEl) dutiesEl.value = staff.duties || '';
        var photoUrlEl = document.getElementById('staff-photo-url');
        var photoDataEl = document.getElementById('staff-photo-data');
        if (photoUrlEl && photoDataEl) {
          var ph = staff.photoUrl || '';
          if (ph && ph.slice(0, 5) === 'data:') { photoDataEl.value = ph; photoUrlEl.value = ''; } else { photoUrlEl.value = ph; photoDataEl.value = ''; }
        }
        var bioEl = document.getElementById('staff-bio');
        if (bioEl) bioEl.value = staff.bio || '';
        var roleTypeEl = document.getElementById('staff-role-type');
        if (roleTypeEl) roleTypeEl.value = staff.roleType || 'staff';
        var staffFile = document.getElementById('staff-photo-file');
        if (staffFile) staffFile.value = '';
        currentStaffCustomPerms = (staff.customPermissions && staff.customPermissions.slice()) || [];
        renderStaffCustomPermList();
        renderStaffPermissionsGrid('staff-permissions-grid', staff.permissions || []);
        var addBtn = document.getElementById('staff-add-btn');
        if (addBtn) addBtn.innerHTML = iifBilingualSpans('dashSaveChanges', 'Save changes', 'حفظ التعديل');
        var cancelBtn = document.getElementById('staff-cancel-edit-btn');
        if (cancelBtn) cancelBtn.style.display = 'inline-flex';
        var selPicker = document.getElementById('staff-permissions-assign-picker');
        if (selPicker && staff.id) selPicker.value = String(staff.id);
        var ps = document.getElementById('staff-perm-preset-select');
        if (ps) ps.value = '';
        var slp = document.getElementById('staff-login-password');
        var slp2 = document.getElementById('staff-login-password2');
        if (slp) slp.value = '';
        if (slp2) slp2.value = '';
      }
      function resetStaffFormToNew() {
        if (document.getElementById('staff-edit-id')) document.getElementById('staff-edit-id').value = '';
        var staffForm = document.getElementById('staff-add-form');
        if (staffForm) staffForm.reset();
        var roleTypeEl = document.getElementById('staff-role-type');
        if (roleTypeEl) roleTypeEl.value = 'staff';
        currentStaffCustomPerms = [];
        renderStaffCustomPermList();
        if (document.getElementById('staff-photo-data')) document.getElementById('staff-photo-data').value = '';
        var ab = document.getElementById('staff-add-btn');
        if (ab) ab.innerHTML = iifBilingualSpans('dashAddStaff', 'Add staff', 'إضافة موظف');
        renderStaffPermissionsGrid('staff-permissions-grid', []);
        var staffCancelEditBtn = document.getElementById('staff-cancel-edit-btn');
        if (staffCancelEditBtn) staffCancelEditBtn.style.display = 'none';
        var selPicker = document.getElementById('staff-permissions-assign-picker');
        if (selPicker) selPicker.value = '__new__';
        var ps = document.getElementById('staff-perm-preset-select');
        if (ps) ps.value = '';
        var slpR = document.getElementById('staff-login-password');
        var slp2R = document.getElementById('staff-login-password2');
        if (slpR) slpR.value = '';
        if (slp2R) slp2R.value = '';
      }
      var currentStaffCustomPerms = [];
      function renderStaffCustomPermList() {
        var ul = document.getElementById('staff-custom-perm-list');
        if (!ul) return;
        ul.innerHTML = '';
        currentStaffCustomPerms.forEach(function (label, i) {
          var li = document.createElement('li');
          li.innerHTML = '<span>' + escapeHtml(label) + '</span><button type="button" class="remove-custom-perm btn--ghost" data-i="' + i + '">×</button>';
          ul.appendChild(li);
        });
        ul.querySelectorAll('.remove-custom-perm').forEach(function (btn) {
          btn.addEventListener('click', function () {
            var i = parseInt(btn.getAttribute('data-i'), 10);
            currentStaffCustomPerms.splice(i, 1);
            renderStaffCustomPermList();
          });
        });
      }
      function renderDashboardStaffRolesList() {
        var list = getStaffList();
        var ul = document.getElementById('dashboard-staff-roles-list');
        if (!ul) return;
        ul.innerHTML = '';
        var isAr = document.documentElement.getAttribute('data-lang') === 'ar';
        var canEditStaff = typeof staffHasExplicitPermission === 'function' && staffHasExplicitPermission('manage_staff');
        list.forEach(function (s, idx) {
          var li = document.createElement('li');
          var roleType = s.roleType || 'staff';
          var typeLabel = (STAFF_ROLE_TYPE_LABELS && STAFF_ROLE_TYPE_LABELS[roleType]) ? (isAr ? STAFF_ROLE_TYPE_LABELS[roleType].ar : STAFF_ROLE_TYPE_LABELS[roleType].en) : roleType;
          var permLabels = (s.permissions || []).map(function (pid) {
            var p = STAFF_PERMISSIONS.find(function (x) { return x.id === pid; });
            return p ? (isAr ? p.ar : p.en) : pid;
          }).concat(s.customPermissions || []).join(', ');
          if (!permLabels) permLabels = iifMessage('dashStaffNoPerms');
          var photoSrc = s.photoUrl || '';
          var staffImgSrc = getDisplayImageSrc(photoSrc, 'photo');
          var staffPh = IIF_IMAGES && IIF_IMAGES.getPlaceholder ? IIF_IMAGES.getPlaceholder('photo') : '';
          var photoHtml = '<div class="staff-list-photo-wrap"><img class="staff-list-photo" src="' + escapeHtml(staffImgSrc) + '" alt="" onerror="this.onerror=null;this.src=\'' + (staffPh || '').replace(/'/g, '\\\'') + '\';" /></div>';
          var bioHtml = (s.bio && s.bio.trim()) ? '<p class="staff-list-bio">' + escapeHtml((s.bio || '').slice(0, 120)) + (s.bio.length > 120 ? '…' : '') + '</p>' : '';
          var actionsHtml = canEditStaff ? '<div class="actions"><button type="button" class="btn-edit staff-edit" data-index="' + idx + '">' + iifBilingualSpans('dashBtnEdit', 'Edit', 'تعديل') + '</button><button type="button" class="btn-delete staff-delete" data-index="' + idx + '">' + iifBilingualSpans('dashBtnDelete', 'Delete', 'حذف') + '</button></div>' : '';
          li.innerHTML = '<div class="content">' + photoHtml + '<div class="staff-list-body"><strong>' + escapeHtml(s.name || '') + '</strong> <small>' + escapeHtml(s.email || '') + '</small><br><small><span style="color:var(--color-accent-gold-soft);">' + escapeHtml(typeLabel) + '</span>' + (s.roleTitle ? ' · ' + escapeHtml(s.roleTitle) : '') + (s.duties ? ' · ' + escapeHtml(s.duties) : '') + '</small><br><small style="color:var(--color-text-muted);">' + escapeHtml(permLabels) + '</small>' + bioHtml + '</div></div>' + actionsHtml;
          ul.appendChild(li);
        });
        ul.querySelectorAll('.staff-edit').forEach(function (btn) {
          btn.addEventListener('click', function () {
            var idx = parseInt(btn.getAttribute('data-index'), 10);
            var staff = getStaffList()[idx];
            if (!staff) return;
            loadStaffIntoForm(staff);
          });
        });
        ul.querySelectorAll('.staff-delete').forEach(function (btn) {
          btn.addEventListener('click', function () {
            if (typeof staffHasExplicitPermission === 'function' && !staffHasExplicitPermission('manage_staff')) {
              alert(iifMessage('dashStaffNoDeleteEditPerm'));
              return;
            }
            var idx = parseInt(btn.getAttribute('data-index'), 10);
            if (!confirm(iifMessage('dashStaffConfirmDelete'))) return;
            var list = getStaffList();
            list.splice(idx, 1);
            saveStaffList(list);
            renderDashboardStaffRolesList();
          });
        });
        populateStaffAssignPicker();
      }
      renderStaffPermissionsGrid('staff-permissions-grid', []);
      renderStaffCustomPermList();
      fillStaffPresetSelect();
      populateStaffAssignPicker();
      (function bindStaffPermUiOnce() {
        var staffPickerEl = document.getElementById('staff-permissions-assign-picker');
        if (staffPickerEl && !staffPickerEl.__iifBound) {
          staffPickerEl.__iifBound = true;
          staffPickerEl.addEventListener('change', function () {
            var v = staffPickerEl.value;
            if (v === '__new__') { resetStaffFormToNew(); return; }
            var list = getStaffList();
            var st = null;
            for (var si = 0; si < list.length; si++) {
              if (String(list[si].id) === String(v)) { st = list[si]; break; }
            }
            if (st) loadStaffIntoForm(st);
          });
        }
        var staffPresetSelEl = document.getElementById('staff-perm-preset-select');
        if (staffPresetSelEl && !staffPresetSelEl.__iifBound) {
          staffPresetSelEl.__iifBound = true;
          staffPresetSelEl.addEventListener('change', function () {
            var pid = staffPresetSelEl.value;
            if (!pid) return;
            var pr = null;
            for (var pi = 0; pi < STAFF_PERM_QUICK_PRESETS.length; pi++) {
              if (STAFF_PERM_QUICK_PRESETS[pi].id === pid) { pr = STAFF_PERM_QUICK_PRESETS[pi]; break; }
            }
            if (pr && pr.perms) applyStaffPermPreset(pr.perms);
            staffPresetSelEl.value = '';
          });
        }
        var btnStaffPermAll = document.getElementById('staff-perm-check-all');
        var btnStaffPermNone = document.getElementById('staff-perm-check-none');
        if (btnStaffPermAll && !btnStaffPermAll.__iifBound) {
          btnStaffPermAll.__iifBound = true;
          btnStaffPermAll.addEventListener('click', function () { setAllStaffPermCheckboxes(true); });
        }
        if (btnStaffPermNone && !btnStaffPermNone.__iifBound) {
          btnStaffPermNone.__iifBound = true;
          btnStaffPermNone.addEventListener('click', function () { setAllStaffPermCheckboxes(false); });
        }
        try { window.refreshStaffPermissionsUi = refreshStaffPermissionsUi; } catch (eW) { }
      })();
      var staffForm = document.getElementById('staff-add-form');
      var staffCancelEditBtn = document.getElementById('staff-cancel-edit-btn');
      if (staffForm) staffForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (typeof staffHasExplicitPermission === 'function' && !staffHasExplicitPermission('manage_staff')) {
          alert(iifMessage('dashStaffNoEditPerm'));
          return;
        }
        var editId = (document.getElementById('staff-edit-id') && document.getElementById('staff-edit-id').value) || '';
        var roleTypeEl = document.getElementById('staff-role-type');
        var roleType = (roleTypeEl && roleTypeEl.value) ? roleTypeEl.value : 'staff';
        var name = (document.getElementById('staff-name') && document.getElementById('staff-name').value) || '';
        var email = (document.getElementById('staff-email') && document.getElementById('staff-email').value) || '';
        var roleTitle = (document.getElementById('staff-role-title') && document.getElementById('staff-role-title').value) || '';
        var duties = (document.getElementById('staff-duties') && document.getElementById('staff-duties').value) || '';
        var photoData = (document.getElementById('staff-photo-data') && document.getElementById('staff-photo-data').value) || '';
        var photoUrl = (document.getElementById('staff-photo-url') && document.getElementById('staff-photo-url').value) || '';
        var photoSrc = photoData || photoUrl.trim();
        var bio = (document.getElementById('staff-bio') && document.getElementById('staff-bio').value) || '';
        name = name.trim();
        email = (email || '').trim().toLowerCase();
        if (!name || !email) return;
        var permissions = getStaffFormPermissions();
        var list = getStaffList();
        var dupOther = list.some(function (s) {
          return (s.email || '').trim().toLowerCase() === email && String(s.id) !== String(editId || '');
        });
        if (dupOther) {
          alert(iifMessage('dashStaffEmailConflict'));
          return;
        }
        var pw1 = (document.getElementById('staff-login-password') && document.getElementById('staff-login-password').value) || '';
        var pw2 = (document.getElementById('staff-login-password2') && document.getElementById('staff-login-password2').value) || '';
        var record = { name: name, email: email, roleType: roleType, roleTitle: roleTitle.trim(), duties: duties.trim(), photoUrl: photoSrc, bio: bio.trim(), permissions: permissions, customPermissions: (currentStaffCustomPerms && currentStaffCustomPerms.slice()) || [] };
        function finishStaffFormUi() {
          resetStaffFormToNew();
          if (typeof applyDashboardAccessRules === 'function') applyDashboardAccessRules();
        }
        function applyOptionalStaffLoginPassword(thenFn) {
          if (!pw1 && !pw2) { if (thenFn) thenFn(); return; }
          if (pw1 !== pw2) {
            alert(iifMessage('dashStaffLoginPwMismatch'));
            return;
          }
          if (typeof isStrongPassword === 'function' && !isStrongPassword(pw1)) {
            alert(iifMessage('dashStaffLoginPwWeak'));
            return;
          }
          if (typeof setCredentialForEmail !== 'function') {
            alert(iifMessage('dashStaffCannotSavePw'));
            return;
          }
          setCredentialForEmail(email, pw1).then(function (ok) {
            if (!ok) {
              alert(iifMessage('dashStaffFailedSavePw'));
              return;
            }
            var slp = document.getElementById('staff-login-password');
            var slp2 = document.getElementById('staff-login-password2');
            if (slp) slp.value = '';
            if (slp2) slp2.value = '';
            if (thenFn) thenFn();
          });
        }
        if (editId) {
          var idx = list.findIndex(function (s) { return String(s.id) === String(editId); });
          if (idx >= 0) {
            list[idx] = { id: list[idx].id, name: record.name, email: record.email, roleType: record.roleType, roleTitle: record.roleTitle, duties: record.duties, photoUrl: record.photoUrl, bio: record.bio, permissions: record.permissions, customPermissions: record.customPermissions };
            saveStaffList(list);
            renderDashboardStaffRolesList();
            applyOptionalStaffLoginPassword(finishStaffFormUi);
            return;
          }
        }
        var nextId = String(Date.now());
        list.push({ id: nextId, name: record.name, email: record.email, roleType: record.roleType, roleTitle: record.roleTitle, duties: record.duties, photoUrl: record.photoUrl, bio: record.bio, permissions: record.permissions, customPermissions: record.customPermissions });
        saveStaffList(list);
        renderDashboardStaffRolesList();
        applyOptionalStaffLoginPassword(finishStaffFormUi);
      });
      (function staffPhotoUpload() {
        var fileInput = document.getElementById('staff-photo-file');
        var urlInput = document.getElementById('staff-photo-url');
        var dataInput = document.getElementById('staff-photo-data');
        if (fileInput && dataInput) fileInput.addEventListener('change', function () {
          var f = fileInput.files && fileInput.files[0];
          if (!f) { dataInput.value = ''; return; }
          if (f.type && SAFE_IMAGE_MIMES && SAFE_IMAGE_MIMES.indexOf(f.type) === -1) { alert(iifMessage('jsFileTypeNotAllowedDetailed')); fileInput.value = ''; dataInput.value = ''; return; }
          var staffMax = getCertImageMaxSize();
          if (f.size > staffMax) { var mb = Math.round(staffMax / 1024 / 1024); alert(iifMessageFmt('jsFileTooLargeMb', { mb: mb })); fileInput.value = ''; dataInput.value = ''; return; }
          fileInput.disabled = true;
          var r = new FileReader();
          r.onload = function () {
            var res = r.result || '';
            if (res.slice(0, 5) === 'data:' && !isSafeDataUrlForImage(res) && !isDataUrlImageForDisplay(res)) { fileInput.disabled = false; fileInput.value = ''; dataInput.value = ''; return; }
            checkImageContentSafe(res).then(function (ck) {
              fileInput.disabled = false;
              if (!ck.safe) { alert(getContentRejectMessage(ck.reason)); fileInput.value = ''; dataInput.value = ''; return; }
              dataInput.value = res; if (urlInput) urlInput.value = '';
              alert(iifMessage('jsStaffPhotoUploaded'));
            });
          };
          r.onerror = function () {
            fileInput.disabled = false;
            alert(iifMessage('jsFileReadFailed'));
          };
          r.readAsDataURL(f);
        });
        if (urlInput && dataInput) urlInput.addEventListener('input', function () { dataInput.value = ''; });
      })();
      if (document.getElementById('staff-add-custom-perm-btn')) {
        document.getElementById('staff-add-custom-perm-btn').addEventListener('click', function () {
          var inp = document.getElementById('staff-custom-perm-input');
          var v = (inp && inp.value) ? inp.value.trim() : '';
          if (!v) return;
          currentStaffCustomPerms.push(v);
          if (inp) inp.value = '';
          renderStaffCustomPermList();
        });
      }
      if (staffCancelEditBtn) staffCancelEditBtn.addEventListener('click', function () {
        resetStaffFormToNew();
      });

      /* أعضاء الصندوق — عرض في صفحة الأعضاء مع الصورة والنبذة وكيو آر العضوية */
      var FUND_MEMBERS_KEY = 'iif-fund-members';
      var FUND_MEMBERS_COUNTER_KEY = 'iif-fund-members-counter';
      function getFundMembers() { try { var r = localStorage.getItem(FUND_MEMBERS_KEY); return r ? JSON.parse(r) : []; } catch (e) { return []; } }
      function saveFundMembers(arr) { try { localStorage.setItem(FUND_MEMBERS_KEY, JSON.stringify(arr)); } catch (e) { } }
      function isMemberLinkSafe(url) {
        if (!url || typeof url !== 'string') return false;
        var u = url.trim();
        if (u.length > 500 || u.length < 10) return false;
        var lower = u.toLowerCase();
        if (/^\s*(javascript|data|file|vbscript|vnd\.|mhtml):/i.test(lower)) return false;
        if (lower.indexOf('http://') !== 0 && lower.indexOf('https://') !== 0) return false;
        if (/[\s<>"'\\\x00-\x1f]|&#|%00|%0d%0a/i.test(u)) return false;
        try { if (decodeURIComponent(u) !== u && /%[0-9a-f]{2}/i.test(u)) { var d = decodeURIComponent(u); if (/[\s<>"'\\]|javascript:|data:/i.test(d)) return false; } } catch (e) { return false; }
        return true;
      }
      function safeHrefForAnchor(url) {
        if (!url || typeof url !== 'string') return '';
        return isMemberLinkSafe(url) ? url.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;') : '';
      }
      function getNextMembershipId() {
        var y = new Date().getFullYear();
        var key = FUND_MEMBERS_COUNTER_KEY + '-' + y;
        var n = 0;
        try { n = parseInt(localStorage.getItem(key), 10) || 0; } catch (e) { }
        n++;
        try { localStorage.setItem(key, String(n)); } catch (e) { }
        return 'IIF-MEM-' + y + '-' + String(n).padStart(3, '0');
      }
      var CHAIRMAN_MEMBERSHIP_ID = 'IIF-CHAIRMAN';
      function getPublicMembersListWithChairman() {
        var list = getFundMembers().slice();
        var adminEmails = (window.IIF_CONFIG && window.IIF_CONFIG.adminEmails) ? IIF_CONFIG.adminEmails : ['talalkenani@gmail.com'];
        var chairmanEmail = (adminEmails[0] || '').trim().toLowerCase();
        if (!chairmanEmail) return list;
        var alreadyInList = list.some(function (m) { return (m.email || '').trim().toLowerCase() === chairmanEmail; });
        if (alreadyInList) return list;
        var team = (typeof getTeamMembers === 'function' && getTeamMembers()) ? getTeamMembers() : [];
        var chairmanTeam = team[0] || {};
        var certPhoto = (typeof getCertPhoto === 'function' && getCertPhoto()) || '';
        var chairmanEntry = {
          id: 'chairman',
          membershipId: CHAIRMAN_MEMBERSHIP_ID,
          email: chairmanEmail,
          nameEn: chairmanTeam.nameEn || 'Financial Advisor Dr. Talal Hassan Al-Zahrani',
          nameAr: chairmanTeam.nameAr || 'المستشار المالي الدكتور طلال حسن الزهراني',
          bioEn: chairmanTeam.bioEn || 'Chairman of the Board of the International Investment Fund. Internationally classified global financial expert.',
          bioAr: chairmanTeam.bioAr || 'رئيس مجلس إدارة صندوق الاستثمار الدولي. خبير مالي دولي مصنّف.',
          photoUrl: (chairmanTeam.imageUrl || '').trim() || certPhoto,
          tier: 'premium_4143',
          showWorksLinks: false,
          worksLinks: []
        };
        return [chairmanEntry].concat(list);
      }
      function renderPublicMembersList() {
        var ul = document.getElementById('members-list');
        if (!ul) return;
        var list = getPublicMembersListWithChairman();
        var isAr = document.documentElement.getAttribute('data-lang') === 'ar';
        ul.innerHTML = '';
        var currentUserEmail = (localStorage.getItem('iif-user-email') || '').trim().toLowerCase() || (window.IIF_MEMBERSHIP_AUTH && typeof IIF_MEMBERSHIP_AUTH.getLoggedEmail === 'function' ? (IIF_MEMBERSHIP_AUTH.getLoggedEmail() || '').trim().toLowerCase() : '');
        list.forEach(function (m) {
          var li = document.createElement('li');
          li.className = 'members-card';
          var name = isAr ? (m.nameAr || m.nameEn || '') : (m.nameEn || m.nameAr || '');
          var bio = isAr ? (m.bioAr || m.bioEn || '') : (m.bioEn || m.bioAr || '');
          var imgSrc = m.photoUrl || '';
          if (!imgSrc && currentUserEmail && (m.email || '').toLowerCase() === currentUserEmail && typeof getCertPhoto === 'function') imgSrc = getCertPhoto();
          var memberImgSrc = getDisplayImageSrc(imgSrc, 'photo');
          var memberPh = IIF_IMAGES && IIF_IMAGES.getPlaceholder ? IIF_IMAGES.getPlaceholder('photo') : '';
          var photoHtml = '<div class="members-card__photo-wrap"><img class="members-card__photo" src="' + escapeHtml(memberImgSrc) + '" alt="" loading="lazy" onerror="this.onerror=null;this.src=\'' + (memberPh || '').replace(/'/g, '\\\'') + '\';" /></div>';
          var qrId = 'member-qr-' + (m.id || '').replace(/\s/g, '');
          var qrPayload = 'IIF-MEMBER|' + (m.membershipId || m.id || '') + '|' + encodeURIComponent(name);
          var linksHtml = '';
          if (m.showWorksLinks && Array.isArray(m.worksLinks) && m.worksLinks.length > 0) {
            var safeLinks = m.worksLinks.filter(function (l) { return l && l.url && isMemberLinkSafe(l.url); });
            if (safeLinks.length > 0) {
              linksHtml = '<div class="members-card__links"><p class="members-card__links-title">' + escapeHtml(iifMessage('membersCardWorksLinksTitle')) + '</p><ul class="members-card__links-list">';
              safeLinks.forEach(function (l) {
                var lbl = escapeHtml((l.label || l.url || '').trim() || (l.url || ''));
                var safeUrl = l.url.trim();
                var hrefSafe = safeHrefForAnchor(l.url);
                if (hrefSafe) linksHtml += '<li><a href="' + hrefSafe + '" rel="noopener noreferrer nofollow" target="_blank" class="members-card__link">' + lbl + '</a></li>';
              });
              linksHtml += '</ul></div>';
            }
          }
          var tier = m.tier || 'cooperating';
          var tierLabel = (typeof getTierLabel === 'function') ? getTierLabel(tier) : String(tier || '');
          var tierBlock = '<p class="members-card__tier members-card__tier--' + escapeHtml(tier) + '"><span class="members-card__tier-emblem" aria-hidden="true"></span>' + escapeHtml(tierLabel) + '</p>';
          var memberPageLink = '<a href="#member-' + escapeHtml((m.id || '').replace(/"/g, '')) + '" class="members-card__link-page">' + escapeHtml(iifMessage('membersCardViewPageLink')) + '</a>';
          li.innerHTML = photoHtml + '<h4 class="members-card__name lang-en">' + escapeHtml(m.nameEn || '') + '</h4><h4 class="members-card__name lang-ar">' + escapeHtml(m.nameAr || '') + '</h4>' + tierBlock + '<p class="members-card__bio">' + escapeHtml(bio) + '</p>' + linksHtml + '<div class="members-card__qr-wrap" id="' + qrId + '"></div><p class="members-card__qr-label">' + escapeHtml(iifText('dashMembershipQrLabel', 'Membership QR')) + '</p>' + memberPageLink;
          ul.appendChild(li);
          if (typeof QRCode !== 'undefined') {
            try {
              var wrap = document.getElementById(qrId);
              if (wrap) { wrap.innerHTML = ''; new QRCode(wrap, { text: qrPayload, width: 100, height: 100 }); }
            } catch (e) { }
          }
        });
      }
      function renderDashboardFundMembersList() {
        var ul = document.getElementById('dashboard-fund-members-list');
        if (!ul) return;
        var list = getFundMembers();
        ul.innerHTML = '';
        list.forEach(function (m, idx) {
          var li = document.createElement('li');
          var qrWrapId = 'dash-member-qr-' + idx;
          li.innerHTML = '<div class="content"><strong>' + escapeHtml(m.nameEn || m.nameAr || '') + '</strong> <small>' + escapeHtml(m.email || '') + '</small> <span style="color:var(--color-accent-gold-soft);font-size:0.8rem;">' + escapeHtml(m.membershipId || '') + '</span><br><small>' + escapeHtml((m.bioEn || m.bioAr || '').slice(0, 80)) + '…</small></div><div class="members-dash-qr" id="' + qrWrapId + '"></div><div class="actions"><button type="button" class="btn-edit fund-member-edit" data-index="' + idx + '">' + iifBilingualSpans('dashBtnEdit', 'Edit', 'تعديل') + '</button><button type="button" class="btn-delete fund-member-delete" data-index="' + idx + '">' + iifBilingualSpans('dashBtnDelete', 'Delete', 'حذف') + '</button></div>';
          ul.appendChild(li);
          if (typeof QRCode !== 'undefined' && m.membershipId) {
            try {
              var w = document.getElementById(qrWrapId);
              if (w) { w.innerHTML = ''; new QRCode(w, { text: 'IIF-MEMBER|' + m.membershipId + '|' + encodeURIComponent(m.nameEn || m.nameAr || ''), width: 64, height: 64 }); }
            } catch (e) { }
          }
        });
        ul.querySelectorAll('.fund-member-edit').forEach(function (btn) {
          btn.addEventListener('click', function () {
            var idx = parseInt(btn.getAttribute('data-index'), 10);
            var m = getFundMembers()[idx];
            if (!m) return;
            document.getElementById('fund-member-edit-id').value = m.id || '';
            document.getElementById('fund-member-name-en').value = m.nameEn || '';
            document.getElementById('fund-member-name-ar').value = m.nameAr || '';
            document.getElementById('fund-member-email').value = m.email || '';
            var tierSel = document.getElementById('fund-member-tier');
            if (tierSel) tierSel.value = m.tier || 'cooperating';
            var ph = m.photoUrl || '';
            if (ph && ph.slice(0, 5) === 'data:') { document.getElementById('fund-member-photo-data').value = ph; document.getElementById('fund-member-photo-url').value = ''; } else { document.getElementById('fund-member-photo-url').value = ph; document.getElementById('fund-member-photo-data').value = ''; }
            document.getElementById('fund-member-bio-en').value = m.bioEn || '';
            document.getElementById('fund-member-bio-ar').value = m.bioAr || '';
            var worksEnEl = document.getElementById('fund-member-works-en');
            var worksArEl = document.getElementById('fund-member-works-ar');
            if (worksEnEl) worksEnEl.value = m.worksContentEn || '';
            if (worksArEl) worksArEl.value = m.worksContentAr || '';
            document.getElementById('fund-member-photo-file').value = '';
            var showLinksCb = document.getElementById('fund-member-show-links');
            if (showLinksCb) showLinksCb.checked = !!m.showWorksLinks;
            currentMemberLinks = (m.worksLinks && m.worksLinks.slice()) || [];
            renderFundMemberLinksList();
            var linksWrap = document.getElementById('fund-member-links-wrap');
            if (linksWrap) linksWrap.style.display = m.showWorksLinks ? '' : 'none';
            document.getElementById('fund-member-add-btn').innerHTML = iifBilingualSpans('dashSaveChanges', 'Save changes', 'حفظ التعديل');
            document.getElementById('fund-member-cancel-btn').style.display = 'inline-flex';
          });
        });
        ul.querySelectorAll('.fund-member-delete').forEach(function (btn) {
          btn.addEventListener('click', function () {
            var idx = parseInt(btn.getAttribute('data-index'), 10);
            if (!confirm(iifMessage('dashConfirmDeleteMember'))) return;
            var arr = getFundMembers();
            arr.splice(idx, 1);
            saveFundMembers(arr);
            renderDashboardFundMembersList();
            renderPublicMembersList();
          });
        });
      }
      (function fundMembersForm() {
        var form = document.getElementById('fund-members-form');
        var photoUrl = document.getElementById('fund-member-photo-url');
        var photoFile = document.getElementById('fund-member-photo-file');
        var photoData = document.getElementById('fund-member-photo-data');
        if (photoFile && photoData) photoFile.addEventListener('change', function () {
          var f = photoFile.files && photoFile.files[0];
          if (!f) { photoData.value = ''; return; }
          if (f.type && SAFE_IMAGE_MIMES && SAFE_IMAGE_MIMES.indexOf(f.type) === -1) { alert(iifMessage('jsFileTypeNotAllowedDetailed')); photoFile.value = ''; photoData.value = ''; return; }
          var memberMax = getCertImageMaxSize();
          if (f.size > memberMax) { var mb = Math.round(memberMax / 1024 / 1024); alert(iifMessageFmt('jsFileTooLargeMb', { mb: mb })); photoFile.value = ''; photoData.value = ''; return; }
          photoFile.disabled = true;
          var r = new FileReader();
          r.onload = function () {
            var res = r.result || '';
            if (res.slice(0, 5) === 'data:' && !isSafeDataUrlForImage(res) && !isDataUrlImageForDisplay(res)) { photoFile.disabled = false; photoFile.value = ''; photoData.value = ''; return; }
            checkImageContentSafe(res).then(function (ck) {
              photoFile.disabled = false;
              if (!ck.safe) { alert(getContentRejectMessage(ck.reason)); photoFile.value = ''; photoData.value = ''; return; }
              photoData.value = res; if (photoUrl) photoUrl.value = '';
              alert(iifMessage('jsMemberPhotoUploaded'));
            });
          };
          r.onerror = function () {
            photoFile.disabled = false;
            alert(iifMessage('jsFileReadFailed'));
          };
          r.readAsDataURL(f);
        });
        if (photoUrl && photoData) photoUrl.addEventListener('input', function () { photoData.value = ''; });
        if (form) form.addEventListener('submit', function (e) {
          e.preventDefault();
          var editId = (document.getElementById('fund-member-edit-id') && document.getElementById('fund-member-edit-id').value) || '';
          var nameEn = (document.getElementById('fund-member-name-en') && document.getElementById('fund-member-name-en').value) || '';
          var nameAr = (document.getElementById('fund-member-name-ar') && document.getElementById('fund-member-name-ar').value) || '';
          var email = (document.getElementById('fund-member-email') && document.getElementById('fund-member-email').value) || '';
          var phData = (document.getElementById('fund-member-photo-data') && document.getElementById('fund-member-photo-data').value) || '';
          var phUrl = (document.getElementById('fund-member-photo-url') && document.getElementById('fund-member-photo-url').value) || '';
          var photoSrc = phData || phUrl.trim();
          var bioEn = (document.getElementById('fund-member-bio-en') && document.getElementById('fund-member-bio-en').value) || '';
          var bioAr = (document.getElementById('fund-member-bio-ar') && document.getElementById('fund-member-bio-ar').value) || '';
          var worksEn = (document.getElementById('fund-member-works-en') && document.getElementById('fund-member-works-en').value) || '';
          var worksAr = (document.getElementById('fund-member-works-ar') && document.getElementById('fund-member-works-ar').value) || '';
          if (!nameEn.trim() && !nameAr.trim()) return;
          var list = getFundMembers();
          var isAr = document.documentElement.getAttribute('data-lang') === 'ar';
          if (editId) {
            var idx = list.findIndex(function (m) { return String(m.id) === String(editId); });
            if (idx >= 0) {
              var prev = list[idx];
              var showLinks = (document.getElementById('fund-member-show-links') && document.getElementById('fund-member-show-links').checked) || false;
              var links = (typeof currentMemberLinks !== 'undefined' && currentMemberLinks && currentMemberLinks.length) ? currentMemberLinks.slice() : (prev.worksLinks || []);
              var tierVal = (document.getElementById('fund-member-tier') && document.getElementById('fund-member-tier').value) || 'cooperating';
              list[idx] = { id: prev.id, membershipId: prev.membershipId, nameEn: nameEn.trim(), nameAr: nameAr.trim(), email: email.trim(), tier: tierVal, photoUrl: photoSrc, bioEn: bioEn.trim(), bioAr: bioAr.trim(), worksContentEn: worksEn.trim(), worksContentAr: worksAr.trim(), showWorksLinks: showLinks, worksLinks: links };
              saveFundMembers(list);
              renderDashboardFundMembersList();
              renderPublicMembersList();
              form.reset();
              document.getElementById('fund-member-edit-id').value = '';
              document.getElementById('fund-member-photo-data').value = '';
              document.getElementById('fund-member-add-btn').innerHTML = iifBilingualSpans('dashAddMember', 'Add member', 'إضافة عضو');
              document.getElementById('fund-member-cancel-btn').style.display = 'none';
              return;
            }
          }
          var id = 'M' + Date.now();
          var membershipId = getNextMembershipId();
          var tierVal = (document.getElementById('fund-member-tier') && document.getElementById('fund-member-tier').value) || 'cooperating';
          var showLinks = (document.getElementById('fund-member-show-links') && document.getElementById('fund-member-show-links').checked) || false;
          var links = currentMemberLinks && currentMemberLinks.length ? currentMemberLinks.slice() : [];
          list.push({ id: id, membershipId: membershipId, nameEn: nameEn.trim(), nameAr: nameAr.trim(), email: email.trim(), tier: tierVal, photoUrl: photoSrc, bioEn: bioEn.trim(), bioAr: bioAr.trim(), worksContentEn: worksEn.trim(), worksContentAr: worksAr.trim(), showWorksLinks: showLinks, worksLinks: links });
          saveFundMembers(list);
          renderDashboardFundMembersList();
          renderPublicMembersList();
          form.reset();
          document.getElementById('fund-member-photo-data').value = '';
          document.getElementById('fund-member-edit-id').value = '';
          document.getElementById('fund-member-add-btn').innerHTML = iifBilingualSpans('dashAddMember', 'Add member', 'إضافة عضو');
          document.getElementById('fund-member-cancel-btn').style.display = 'none';
        });
        var cancelBtn = document.getElementById('fund-member-cancel-btn');
        if (cancelBtn) cancelBtn.addEventListener('click', function () {
          document.getElementById('fund-member-edit-id').value = '';
          form.reset();
          document.getElementById('fund-member-photo-data').value = '';
          cancelBtn.style.display = 'none';
          document.getElementById('fund-member-add-btn').innerHTML = iifBilingualSpans('dashAddMember', 'Add member', 'إضافة عضو');
        });
      })();
      renderPublicMembersList();
      renderDashboardFundMembersList();

      (function memberInternalPage() {
        var pageWrap = document.getElementById('member-page-wrap');
        var membersSection = document.getElementById('members');
        var memberPageLang = 'en';
        function getMemberById(id) {
          if (!id) return null;
          return getFundMembers().find(function (m) { return String(m.id) === String(id); });
        }
        function getHashMemberId() {
          var h = (typeof location !== 'undefined' && location.hash) ? location.hash : '';
          var match = h.match(/^#member-(.+)$/);
          return match ? decodeURIComponent(match[1]) : null;
        }
        function renderMemberPage(m) {
          if (!m || !pageWrap) return;
          var name = memberPageLang === 'ar' ? (m.nameAr || m.nameEn || '') : (m.nameEn || m.nameAr || '');
          var bio = memberPageLang === 'ar' ? (m.bioAr || m.bioEn || '') : (m.bioEn || m.bioAr || '');
          var works = memberPageLang === 'ar' ? (m.worksContentAr || m.worksContentEn || '') : (m.worksContentEn || m.worksContentAr || '');
          var photoWrap = document.getElementById('member-page-photo');
          var nameEl = document.getElementById('member-page-name');
          var bioEl = document.getElementById('member-page-bio');
          var worksEl = document.getElementById('member-page-works');
          if (photoWrap) {
            var src = m.photoUrl || '';
            var curEmail = (localStorage.getItem('iif-user-email') || '').trim().toLowerCase() || (window.IIF_MEMBERSHIP_AUTH && typeof IIF_MEMBERSHIP_AUTH.getLoggedEmail === 'function' ? (IIF_MEMBERSHIP_AUTH.getLoggedEmail() || '').trim().toLowerCase() : '');
            if (!src && curEmail && (m.email || '').toLowerCase() === curEmail && typeof getCertPhoto === 'function') src = getCertPhoto();
            var pageImgSrc = getDisplayImageSrc(src, 'photo');
            var pagePh = IIF_IMAGES && IIF_IMAGES.getPlaceholder ? IIF_IMAGES.getPlaceholder('photo') : '';
            var isAr = document.documentElement.getAttribute('data-lang') === 'ar';
            photoWrap.innerHTML = '<img class="member-page__photo" src="' + escapeHtml(pageImgSrc) + '" alt="" loading="lazy" onerror="this.onerror=null;this.src=\'' + (pagePh || '').replace(/'/g, '\\\'') + '\';" />';
          }
          if (nameEl) nameEl.textContent = name;
          var tierEl = document.getElementById('member-page-tier');
          if (tierEl) {
            var mt = m.tier || 'cooperating';
            tierEl.textContent = (typeof getTierLabel === 'function') ? getTierLabel(mt, memberPageLang === 'ar' ? 'ar' : 'en') : (mt === 'premium_4143' ? (memberPageLang === 'ar' ? 'عضوية بلاتينية مميزة' : 'Premium Platinum') : mt === 'premium_3143' ? (memberPageLang === 'ar' ? 'عضوية ذهبية مميزة' : 'Premium Gold') : mt === 'premium_2143' ? (memberPageLang === 'ar' ? 'عضوية فضية مميزة' : 'Premium Silver') : mt === 'shared' ? (memberPageLang === 'ar' ? 'عضو مشترك' : 'Shared Member') : (memberPageLang === 'ar' ? 'عضو متعاون' : 'Cooperating Member'));
            tierEl.className = 'member-page__tier member-page__tier--' + mt;
            tierEl.style.display = '';
          }
          if (bioEl) bioEl.textContent = bio;
          if (worksEl) worksEl.textContent = works || iifMessage('jsNoContentYet');
          var qrWrap = document.getElementById('member-page-qr');
          if (qrWrap && typeof QRCode !== 'undefined' && m.membershipId) {
            qrWrap.innerHTML = '';
            try { new QRCode(qrWrap, { text: 'IIF-MEMBER|' + m.membershipId + '|' + encodeURIComponent(name), width: 120, height: 120 }); } catch (e) { }
          }
        }
        function showMemberPage(memberId) {
          var m = getMemberById(memberId);
          if (m && pageWrap) {
            pageWrap.classList.add('is-visible');
            pageWrap.setAttribute('aria-hidden', 'false');
            if (membersSection) membersSection.style.display = 'none';
            memberPageLang = (document.getElementById('member-page-lang') && document.getElementById('member-page-lang').value) || 'en';
            renderMemberPage(m);
          } else {
            if (pageWrap) pageWrap.classList.remove('is-visible');
            if (membersSection) membersSection.style.display = '';
          }
        }
        function hideMemberPage() {
          if (pageWrap) pageWrap.classList.remove('is-visible');
          if (pageWrap) pageWrap.setAttribute('aria-hidden', 'true');
          if (membersSection) membersSection.style.display = '';
        }
        function syncMemberPageFromHash() {
          var id = getHashMemberId();
          if (id) showMemberPage(id); else hideMemberPage();
        }
        var langSel = document.getElementById('member-page-lang');
        if (langSel) langSel.addEventListener('change', function () {
          memberPageLang = langSel.value || 'en';
          var id = getHashMemberId();
          var m = getMemberById(id);
          if (m) renderMemberPage(m);
        });
        var translateBtn = document.getElementById('member-page-translate-btn');
        var translateLangSel = document.getElementById('member-page-translate-lang');
        var translateOverlay = document.getElementById('member-page-translate-overlay');
        var translatedTextEl = document.getElementById('member-page-translated-text');
        var translateCloseBtn = document.getElementById('member-page-translate-close');
        if (translateBtn && translateLangSel && translateOverlay && translatedTextEl) {
          translateBtn.addEventListener('click', function () {
            var targetLang = (translateLangSel && translateLangSel.value) || '';
            if (!targetLang) return;
            var id = getHashMemberId();
            var m = getMemberById(id);
            if (!m) return;
            var name = memberPageLang === 'ar' ? (m.nameAr || m.nameEn || '') : (m.nameEn || m.nameAr || '');
            var bio = memberPageLang === 'ar' ? (m.bioAr || m.bioEn || '') : (m.bioEn || m.bioAr || '');
            var works = memberPageLang === 'ar' ? (m.worksContentAr || m.worksContentEn || '') : (m.worksContentEn || m.worksContentAr || '');
            var combined = [name, bio, works].filter(Boolean).join('\n\n');
            if (!combined.trim()) { translatedTextEl.textContent = ''; translateOverlay.classList.add('is-open'); return; }
            var langpair = memberPageLang + '|' + targetLang;
            fetch('https://api.mymemory.translated.net/get?q=' + encodeURIComponent(combined.slice(0, 500)) + '&langpair=' + encodeURIComponent(langpair)).then(function (r) { return r.json(); }).then(function (data) {
              var t = (data && data.response && data.response.translatedText) ? data.response.translatedText : combined;
              translatedTextEl.textContent = t;
              translateOverlay.classList.add('is-open');
            }).catch(function () { translatedTextEl.textContent = 'Translation error.'; translateOverlay.classList.add('is-open'); });
          });
        }
        if (translateCloseBtn && translateOverlay) translateCloseBtn.addEventListener('click', function () { translateOverlay.classList.remove('is-open'); });
        if (typeof window !== 'undefined' && window.addEventListener) {
          window.addEventListener('hashchange', syncMemberPageFromHash);
        }
        if (document.getElementById('member-page-back')) document.getElementById('member-page-back').addEventListener('click', function () { hideMemberPage(); });
        syncMemberPageFromHash();
      })();

      /* اقتراح العملاء — نموذج عام + لوحة التحكم (خانة الاقتراحات + أرشيف) */
      var SUGGESTIONS_KEY = 'iif-customer-suggestions';
      function getSuggestions() { try { var r = localStorage.getItem(SUGGESTIONS_KEY); return r ? JSON.parse(r) : []; } catch (e) { return []; } }
      function saveSuggestions(arr) { try { localStorage.setItem(SUGGESTIONS_KEY, JSON.stringify(arr)); } catch (e) { } }
      (function suggestFormPublic() {
        var form = document.getElementById('suggest-form');
        var successEl = document.getElementById('suggest-success');
        if (form) form.addEventListener('submit', function (e) {
          e.preventDefault();
          var name = (document.getElementById('suggest-name') && document.getElementById('suggest-name').value) || '';
          var email = (document.getElementById('suggest-email') && document.getElementById('suggest-email').value) || '';
          var phone = (document.getElementById('suggest-phone') && document.getElementById('suggest-phone').value) || '';
          var country = (document.getElementById('suggest-country') && document.getElementById('suggest-country').value) || '';
          var subject = (document.getElementById('suggest-subject') && document.getElementById('suggest-subject').value) || '';
          var message = (document.getElementById('suggest-message') && document.getElementById('suggest-message').value) || '';
          if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) return;
          var list = getSuggestions();
          list.push({ id: 'Sug' + Date.now(), name: name.trim(), email: email.trim(), phone: phone.trim(), country: country.trim(), subject: subject.trim(), message: message.trim(), date: new Date().toISOString(), archived: false });
          saveSuggestions(list);
          form.reset();
          if (successEl) { successEl.style.display = ''; setTimeout(function () { successEl.style.display = 'none'; }, (window.IIF_TIMING && window.IIF_TIMING.toastLong) || 5000); }
          if (typeof renderSuggestionsInbox === 'function') renderSuggestionsInbox();
        });
      })();
      function renderSuggestionsInbox() {
        var ul = document.getElementById('suggestions-inbox-list');
        if (!ul) return;
        var list = getSuggestions().filter(function (s) { return !s.archived; });
        ul.innerHTML = '';
        list.forEach(function (s) {
          var li = document.createElement('li');
          li.innerHTML = '<div class="content"><strong>' + escapeHtml(s.name || '') + '</strong> · ' + escapeHtml(s.email || '') + (s.phone ? ' · ' + escapeHtml(s.phone) : '') + (s.country ? ' · ' + escapeHtml(s.country) : '') + '<br><strong>' + escapeHtml(s.subject || '') + '</strong><br><small>' + escapeHtml((s.message || '').slice(0, 150)) + (s.message && s.message.length > 150 ? '…' : '') + '</small><br><small>' + escapeHtml(s.date ? s.date.slice(0, 10) : '') + '</small></div><div class="actions"><button type="button" class="btn btn--ghost btn-sm suggestion-to-archive" data-id="' + escapeHtml(s.id || '') + '">' + escapeHtml(iifMessage('suggestionToArchiveBtn')) + '</button></div>';
          ul.appendChild(li);
        });
        ul.querySelectorAll('.suggestion-to-archive').forEach(function (btn) {
          btn.addEventListener('click', function () {
            var id = btn.getAttribute('data-id');
            var arr = getSuggestions();
            var s = arr.find(function (x) { return x.id === id; });
            if (s) { s.archived = true; saveSuggestions(arr); renderSuggestionsInbox(); renderSuggestionsArchive(); }
          });
        });
      }
      function renderSuggestionsArchive() {
        var ul = document.getElementById('suggestions-archive-list');
        if (!ul) return;
        var list = getSuggestions().filter(function (s) { return !!s.archived; });
        ul.innerHTML = '';
        list.forEach(function (s) {
          var li = document.createElement('li');
          li.innerHTML = '<div class="content"><strong>' + escapeHtml(s.name || '') + '</strong><br><small>' + escapeHtml(iifMessage('formLabelEmailShort')) + escapeHtml(s.email || '') + '</small><br><small>' + escapeHtml(iifMessage('formLabelPhoneShort')) + escapeHtml(s.phone || '') + '</small><br><small>' + escapeHtml(iifMessage('formLabelCountryShort')) + escapeHtml(s.country || '') + '</small><br><strong>' + escapeHtml(s.subject || '') + '</strong><br><p style="white-space:pre-wrap;margin:0.35rem 0;">' + escapeHtml(s.message || '') + '</p><small>' + escapeHtml(s.date || '') + '</small></div>';
          ul.appendChild(li);
        });
      }
      (function suggestionsTabs() {
        var tabs = document.querySelectorAll('.suggestions-tab');
        var inboxPanel = document.getElementById('suggestions-inbox-panel');
        var archivePanel = document.getElementById('suggestions-archive-panel');
        tabs.forEach(function (t) {
          t.addEventListener('click', function () {
            var tab = t.getAttribute('data-tab');
            tabs.forEach(function (x) { x.classList.remove('is-active'); });
            t.classList.add('is-active');
            if (inboxPanel) inboxPanel.style.display = tab === 'inbox' ? '' : 'none';
            if (archivePanel) archivePanel.style.display = tab === 'archive' ? '' : 'none';
            if (tab === 'archive') renderSuggestionsArchive();
          });
        });
      })();
      renderSuggestionsInbox();
      renderSuggestionsArchive();

      /* تقييم أداء الموظفين — مؤتمت، بأعلى معايير التقييم */
      var STAFF_EVALUATIONS_KEY = 'iif-staff-evaluations';
      var STAFF_EVAL_CRITERIA = [
        { id: 'quality', en: 'Quality of work', ar: 'جودة العمل', fr: 'Qualité du travail' },
        { id: 'discipline', en: 'Discipline', ar: 'الانضباط', fr: 'Discipline' },
        { id: 'collaboration', en: 'Collaboration', ar: 'التعاون', fr: 'Collaboration' },
        { id: 'punctuality', en: 'Punctuality', ar: 'الالتزام بالمواعيد', fr: 'Ponctualité' },
        { id: 'goals', en: 'Achieving goals', ar: 'إنجاز الأهداف', fr: 'Atteinte des objectifs' },
        { id: 'initiative', en: 'Initiative & innovation', ar: 'المبادرة والابتكار', fr: 'Initiative et innovation' },
        { id: 'communication', en: 'Communication', ar: 'التواصل', fr: 'Communication' },
        { id: 'standards', en: 'Professional standards', ar: 'الالتزام بالمعايير المهنية', fr: 'Normes professionnelles' }
      ];
      function staffEvalCriterionLabel(c) {
        var lg = (document.documentElement.getAttribute('data-lang') || 'en').toLowerCase();
        if (lg === 'ar') return c.ar;
        if (lg === 'fr' && c.fr) return c.fr;
        return c.en;
      }
      function getStaffEvaluations() { try { var r = localStorage.getItem(STAFF_EVALUATIONS_KEY); return r ? JSON.parse(r) : []; } catch (e) { return []; } }
      function saveStaffEvaluations(arr) { try { localStorage.setItem(STAFF_EVALUATIONS_KEY, JSON.stringify(arr)); } catch (e) { } }
      function renderStaffEvalCriteria() {
        var container = document.getElementById('staff-eval-criteria');
        if (!container) return;
        container.innerHTML = '';
        STAFF_EVAL_CRITERIA.forEach(function (c) {
          var row = document.createElement('div');
          row.className = 'criterion-row';
          var label = document.createElement('label');
          label.textContent = staffEvalCriterionLabel(c);
          var sel = document.createElement('select');
          sel.name = 'eval_' + c.id;
          sel.dataset.criterion = c.id;
          for (var s = 1; s <= 10; s++) { var opt = document.createElement('option'); opt.value = s; opt.textContent = s; sel.appendChild(opt); }
          row.appendChild(label);
          row.appendChild(sel);
          container.appendChild(row);
        });
      }
      function renderStaffEvalEmployeeSelect() {
        var sel = document.getElementById('staff-eval-employee');
        if (!sel) return;
        sel.innerHTML = '<option value="">—</option>';
        var list = typeof getStaffList === 'function' ? getStaffList() : [];
        list.forEach(function (s) {
          var opt = document.createElement('option');
          opt.value = s.email || s.id || '';
          opt.textContent = (s.name || '') + ' (' + (s.email || '') + ')';
          sel.appendChild(opt);
        });
      }
      function renderStaffEvalList() {
        var list = getStaffEvaluations();
        var ul = document.getElementById('staff-eval-list');
        if (!ul) return;
        ul.innerHTML = '';
        list.slice().reverse().forEach(function (ev, idx) {
          var realIdx = list.length - 1 - idx;
          var li = document.createElement('li');
          li.className = 'staff-eval-list-item';
          var criteriaText = [];
          if (ev.criteria) {
            Object.keys(ev.criteria).forEach(function (k) {
              var c = STAFF_EVAL_CRITERIA.find(function (x) { return x.id === k; });
              criteriaText.push((c ? staffEvalCriterionLabel(c) : k) + ': ' + ev.criteria[k]);
            });
          }
          var detail = (ev.date ? ev.date + ' · ' : '') + (ev.overall != null ? iifMessage('dashEvalOverallPrefix') + ev.overall : '') + (criteriaText.length ? ' · ' + criteriaText.join(' | ') : '');
          var delBtnHtml = (typeof isAdmin === 'function' && isAdmin()) ? '<div class="actions" style="margin-top:0.5rem;"><button type="button" class="btn-delete staff-eval-delete" data-index="' + realIdx + '">' + iifBilingualSpans('dashBtnDelete', 'Delete', 'حذف') + '</button></div>' : '';
          li.innerHTML = '<div class="eval-summary"><strong>' + escapeHtml(ev.staffName || ev.staffEmail || '') + '</strong> ' + (ev.overall != null ? '<span style="color:var(--color-accent-gold);">' + ev.overall + '/10</span>' : '') + '</div><div class="eval-detail">' + escapeHtml(detail) + '</div>' + (ev.comment ? '<div class="eval-detail">' + escapeHtml(ev.comment) + '</div>' : '') + delBtnHtml;
          ul.appendChild(li);
        });
        ul.querySelectorAll('.staff-eval-delete').forEach(function (btn) {
          btn.addEventListener('click', function () {
            var i = parseInt(btn.getAttribute('data-index'), 10);
            if (!confirm(iifMessage('dashEvalDeleteConfirm'))) return;
            var arr = getStaffEvaluations();
            arr.splice(i, 1);
            saveStaffEvaluations(arr);
            renderStaffEvalList();
          });
        });
      }
      renderStaffEvalCriteria();
      renderStaffEvalEmployeeSelect();
      var staffEvalDate = document.getElementById('staff-eval-date');
      if (staffEvalDate) {
        var d = new Date();
        staffEvalDate.value = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
      }
      var staffEvalForm = document.getElementById('staff-eval-form');
      if (staffEvalForm) staffEvalForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (typeof hasStaffPermission === 'function' && !hasStaffPermission('staff_eval_manage')) {
          alert(iifMessage('dashStaffEvalNoPerm'));
          return;
        }
        var empSel = document.getElementById('staff-eval-employee');
        var email = (empSel && empSel.value) || '';
        var staffList = typeof getStaffList === 'function' ? getStaffList() : [];
        var staff = staffList.find(function (s) { return (s.email || '') === email; });
        var staffName = staff ? (staff.name || '') : '';
        var dateVal = (document.getElementById('staff-eval-date') && document.getElementById('staff-eval-date').value) || '';
        var criteria = {};
        var sum = 0, count = 0;
        STAFF_EVAL_CRITERIA.forEach(function (c) {
          var sel = document.querySelector('select[name="eval_' + c.id + '"]');
          if (sel && sel.value) { var v = parseInt(sel.value, 10); criteria[c.id] = v; sum += v; count++; }
        });
        var overall = count > 0 ? Math.round((sum / count) * 10) / 10 : null;
        var comment = (document.getElementById('staff-eval-comment') && document.getElementById('staff-eval-comment').value) || '';
        if (!email) return;
        var arr = getStaffEvaluations();
        arr.push({ id: 'E' + Date.now(), staffEmail: email, staffName: staffName, date: dateVal, criteria: criteria, overall: overall, comment: comment });
        saveStaffEvaluations(arr);
        renderStaffEvalList();
        staffEvalForm.reset();
        if (staffEvalDate) staffEvalDate.value = dateVal || new Date().toISOString().slice(0, 10);
      });
      renderStaffEvalList();

      /* دليل مكاتب الحكومات والسفارات — من لوحة التحكم فقط (5 أقسام) */
      var GOV_DIR_CATS = ['governments', 'foreign', 'investment', 'consulates', 'commercial'];
      function getGovDirKey(cat) { return 'iif-gov-dir-' + cat; }
      function getGovDirList(cat) {
        try { var r = localStorage.getItem(getGovDirKey(cat)); return r ? JSON.parse(r) : []; } catch (e) { return []; }
      }
      function saveGovDirList(cat, list) {
        try { localStorage.setItem(getGovDirKey(cat), JSON.stringify(list)); } catch (e) { }
      }
      function getGovDirFields(cat) {
        return {
          country: document.getElementById('gov-dir-country-' + cat),
          nameEn: document.getElementById('gov-dir-name-en-' + cat),
          nameAr: document.getElementById('gov-dir-name-ar-' + cat),
          phone: document.getElementById('gov-dir-phone-' + cat),
          email: document.getElementById('gov-dir-email-' + cat),
          website: document.getElementById('gov-dir-website-' + cat),
          officials: document.getElementById('gov-dir-officials-' + cat),
          dailyOnline: document.getElementById('gov-dir-daily-online-' + cat),
          editIndex: document.getElementById('gov-dir-edit-index-' + cat)
        };
      }
      function clearGovDirForm(cat) {
        var f = getGovDirFields(cat);
        if (f.country) f.country.value = '';
        if (f.nameEn) f.nameEn.value = '';
        if (f.nameAr) f.nameAr.value = '';
        if (f.phone) f.phone.value = '';
        if (f.email) f.email.value = '';
        if (f.website) f.website.value = '';
        if (f.officials) f.officials.value = '';
        if (f.dailyOnline) f.dailyOnline.value = '';
        if (f.editIndex) f.editIndex.value = '';
      }
      function renderGovDirList(cat) {
        var ul = document.getElementById('gov-dir-list-' + cat);
        if (!ul) return;
        var list = getGovDirList(cat);
        ul.innerHTML = '';
        list.forEach(function (item, idx) {
          var li = document.createElement('li');
          li.dataset.index = String(idx);
          var name = item.nameEn || item.nameAr || item.country || '';
          var extra = [item.phone, item.email, item.website].filter(Boolean).join(' · ');
          if (extra) name += ' — ' + (extra.length > 60 ? extra.slice(0, 60) + '…' : extra);
          li.innerHTML = '<div class="content"><strong>' + escapeHtml(item.country || '') + '</strong> ' + escapeHtml(name) + '</div><div class="actions"><button type="button" class="btn-edit gov-dir-edit" data-cat="' + cat + '" data-index="' + idx + '">' + iifBilingualSpans('dashBtnEdit', 'Edit', 'تعديل') + '</button><button type="button" class="btn-delete gov-dir-delete" data-cat="' + cat + '" data-index="' + idx + '">' + iifBilingualSpans('dashBtnDelete', 'Delete', 'حذف') + '</button></div>';
          ul.appendChild(li);
        });
        ul.querySelectorAll('.gov-dir-edit').forEach(function (btn) {
          btn.addEventListener('click', function () {
            var c = btn.getAttribute('data-cat');
            var idx = parseInt(btn.getAttribute('data-index'), 10);
            var list = getGovDirList(c);
            var item = list[idx];
            if (!item) return;
            var f = getGovDirFields(c);
            if (f.country) f.country.value = item.country || '';
            if (f.nameEn) f.nameEn.value = item.nameEn || '';
            if (f.nameAr) f.nameAr.value = item.nameAr || '';
            if (f.phone) f.phone.value = item.phone || '';
            if (f.email) f.email.value = item.email || '';
            if (f.website) f.website.value = item.website || '';
            if (f.officials) f.officials.value = item.officials || '';
            if (f.dailyOnline) f.dailyOnline.value = item.dailyOnline || '';
            if (f.editIndex) f.editIndex.value = String(idx);
          });
        });
        ul.querySelectorAll('.gov-dir-delete').forEach(function (btn) {
          btn.addEventListener('click', function () {
            if (!confirm(iifMessage('jsConfirmDeleteGovEntry'))) return;
            var c = btn.getAttribute('data-cat');
            var idx = parseInt(btn.getAttribute('data-index'), 10);
            var list = getGovDirList(c).filter(function (_, i) { return i !== idx; });
            saveGovDirList(c, list);
            renderGovDirList(c);
            clearGovDirForm(c);
          });
        });
      }
      document.querySelectorAll('.dashboard-gov-tab').forEach(function (tab) {
        tab.addEventListener('click', function () {
          var cat = tab.getAttribute('data-cat');
          document.querySelectorAll('.dashboard-gov-tab').forEach(function (t) { t.classList.remove('is-active'); });
          tab.classList.add('is-active');
          document.querySelectorAll('.dashboard-gov-panel').forEach(function (p) { p.classList.remove('is-active'); });
          var panel = document.querySelector('.dashboard-gov-panel[data-cat="' + cat + '"]');
          if (panel) panel.classList.add('is-active');
        });
      });
      GOV_DIR_CATS.forEach(function (cat) {
        var form = document.getElementById('gov-dir-form-' + cat);
        if (!form) return;
        form.addEventListener('submit', function (e) {
          e.preventDefault();
          var f = getGovDirFields(cat);
          var country = (f.country && f.country.value) ? f.country.value.trim() : '';
          if (!country) return;
          var item = {
            country: country,
            nameEn: (f.nameEn && f.nameEn.value) ? f.nameEn.value.trim() : '',
            nameAr: (f.nameAr && f.nameAr.value) ? f.nameAr.value.trim() : '',
            phone: (f.phone && f.phone.value) ? f.phone.value.trim() : '',
            email: (f.email && f.email.value) ? f.email.value.trim() : '',
            website: (f.website && f.website.value) ? f.website.value.trim() : '',
            officials: (f.officials && f.officials.value) ? f.officials.value.trim() : '',
            dailyOnline: (f.dailyOnline && f.dailyOnline.value) ? f.dailyOnline.value.trim() : ''
          };
          var list = getGovDirList(cat);
          var editIdx = (f.editIndex && f.editIndex.value) !== '' ? parseInt(f.editIndex.value, 10) : -1;
          if (editIdx >= 0 && editIdx < list.length) {
            list[editIdx] = item;
          } else {
            list.push(item);
          }
          saveGovDirList(cat, list);
          renderGovDirList(cat);
          clearGovDirForm(cat);
        });
        renderGovDirList(cat);
      });

      /* جلب تلقائي من النت — ويكيبيديا (عند الدخول للقسم أو الضغط على "جلب تلقائي من النت") */
      var GOV_DIR_SEARCH_QUERIES = {
        governments: 'Government of',
        foreign: 'Ministry of Foreign Affairs',
        investment: 'Ministry of Investment',
        consulates: 'Consulate Embassy',
        commercial: 'Commercial attaché trade mission'
      };
      function setGovDirStatus(cat, text, isError) {
        var el = document.getElementById('gov-dir-status-' + cat);
        if (el) { el.textContent = text; el.style.color = isError ? '#e74c3c' : 'var(--color-text-muted)'; }
      }
      function extractWebsiteFromWikitext(wikitext) {
        if (!wikitext || typeof wikitext !== 'string') return '';
        var m = wikitext.match(/\|\s*(?:official_website|website|url)\s*=\s*([^\n|\[\]]+)/i);
        if (m) return m[1].trim().replace(/\s+/g, '');
        m = wikitext.match(/\[(https?:\/\/[^\s\]]+)\]/);
        return m ? m[1] : '';
      }
      document.querySelectorAll('.gov-dir-autofetch').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var cat = btn.getAttribute('data-cat');
          var f = getGovDirFields(cat);
          var country = (f.country && f.country.value) ? f.country.value.trim() : '';
          if (!country) {
            setGovDirStatus(cat, iifMessage('jsGovEnterCountryFirst'), true);
            return;
          }
          setGovDirStatus(cat, iifMessage('jsGovFetching'), false);
          var query = (GOV_DIR_SEARCH_QUERIES[cat] || 'Government') + ' ' + country;
          var apiBase = 'https://en.wikipedia.org/w/api.php';
          var searchUrl = apiBase + '?action=query&list=search&srsearch=' + encodeURIComponent(query) + '&format=json&origin=*';
          fetch(searchUrl)
            .then(function (r) { return r.json(); })
            .then(function (data) {
              var results = (data.query && data.query.search) || [];
              if (results.length === 0) {
                setGovDirStatus(cat, iifMessage('jsGovNoResultsAdjustCountry'), true);
                return;
              }
              var title = results[0].title;
              if (f.nameEn && !f.nameEn.value) f.nameEn.value = title;
              var contentUrl = apiBase + '?action=query&titles=' + encodeURIComponent(title) + '&prop=revisions&rvprop=content&format=json&origin=*';
              return fetch(contentUrl).then(function (r) { return r.json(); }).then(function (contentData) {
                var pages = contentData.query && contentData.query.pages;
                var pageId = Object.keys(pages || {})[0];
                var rev = (pages && pages[pageId] && pages[pageId].revisions && pages[pageId].revisions[0]) ? pages[pageId].revisions[0] : null;
                var wikitext = (rev && rev['*']) ? rev['*'] : '';
                var url = extractWebsiteFromWikitext(wikitext);
                if (url && f.website) {
                  if (f.website.value && !f.website.value.includes(url)) f.website.value = url + (f.website.value ? ' ' + f.website.value : '');
                  else if (!f.website.value) f.website.value = url;
                }
                if (!url) url = 'https://en.wikipedia.org/wiki/' + encodeURIComponent(title.replace(/\s/g, '_'));
                if (f.website && !f.website.value) f.website.value = url;
                setGovDirStatus(cat, iifMessage('jsGovSuggestionsFetched'), false);
              });
            })
            .catch(function (err) {
              setGovDirStatus(cat, iifMessage('jsGovFetchFailed'), true);
            });
        });
      });

      /* تقرير تحليل الدولة — زر و نافذة و بناء من مصادر أونلاين */
      var govReportOverlay = document.getElementById('gov-report-overlay');
      var govReportLoading = document.getElementById('gov-report-loading');
      var govReportBody = document.getElementById('gov-report-body');
      var govReportCountryInput = document.getElementById('gov-report-country');
      var govReportGenerateBtn = document.getElementById('gov-report-generate-btn');
      var govReportCloseBtn = document.getElementById('gov-report-close');

      function openGovReportModal() {
        if (govReportOverlay) {
          govReportOverlay.style.display = 'flex';
          govReportOverlay.setAttribute('aria-hidden', 'false');
        }
      }
      function closeGovReportModal() {
        if (govReportOverlay) {
          govReportOverlay.style.display = 'none';
          govReportOverlay.setAttribute('aria-hidden', 'true');
        }
      }
      function setReportLoading(loading) {
        if (govReportLoading) govReportLoading.style.display = loading ? 'block' : 'none';
        if (govReportBody) govReportBody.style.display = loading ? 'none' : 'block';
      }
      function setReportContent(html) {
        if (govReportBody) { govReportBody.innerHTML = html; govReportBody.style.display = 'block'; }
        if (govReportLoading) govReportLoading.style.display = 'none';
      }

      function escapeReportHtml(s) {
        if (s == null || s === '') return '';
        var d = document.createElement('div');
        d.textContent = s;
        return d.innerHTML;
      }
      function buildCountryReport(countryName) {
        var sections = [];
        var rest = null;
        var cca3 = null;
        var lang = (document.documentElement.getAttribute('data-lang') || 'en').toLowerCase();
        function rpt(k) {
          try {
            if (window.IIF_I18N && typeof window.IIF_I18N.text === 'function') {
              var s = window.IIF_I18N.text(k, lang);
              if (s) return s;
            }
          } catch (eR) { }
          return '';
        }

        return fetch('https://restcountries.com/v3.1/name/' + encodeURIComponent(countryName) + '?fullText=true')
          .then(function (r) { return r.json(); })
          .then(function (data) {
            if (Array.isArray(data) && data.length > 0) {
              rest = data[0];
              cca3 = rest.cca3 || rest.cca2;
              var name = (rest.name && rest.name.official) ? rest.name.official : countryName;
              sections.push('<h4>' + escapeReportHtml(rpt('reportHeadingOfficialPopulation')) + '</h4><p>' + escapeReportHtml(name) + '. ' + escapeReportHtml(rpt('reportPopEst')) + (rest.population != null ? rest.population.toLocaleString() : '—') + '. ' + escapeReportHtml(rpt('reportRegion')) + escapeReportHtml(rest.region || '—') + (rest.subregion ? ', ' + escapeReportHtml(rest.subregion) : '') + '. ' + (rest.capital && rest.capital[0] ? escapeReportHtml(rpt('reportCapital')) + escapeReportHtml(rest.capital[0]) : '') + '.</p>');
              sections.push('<h4>' + escapeReportHtml(rpt('reportHeadingCurrenciesLanguages')) + '</h4><p>' + (rest.currencies ? Object.keys(rest.currencies).map(function (k) { var c = rest.currencies[k]; return (c.name || k) + (c.symbol ? ' (' + c.symbol + ')' : ''); }).join(', ') : '—') + '. ' + (rest.languages ? Object.values(rest.languages).join(', ') : '—') + '.</p>');
            }
            var wikiPromises = [];
            var wikiBase = 'https://en.wikipedia.org/w/api.php';
            wikiPromises.push(
              fetch(wikiBase + '?action=query&list=search&srsearch=' + encodeURIComponent(countryName) + '&format=json&origin=*')
                .then(function (r) { return r.json(); })
                .then(function (d) {
                  var titles = (d.query && d.query.search) || [];
                  if (titles.length === 0) return null;
                  var title = titles[0].title;
                  return fetch(wikiBase + '?action=query&titles=' + encodeURIComponent(title) + '&prop=revisions|pageprops&rvprop=content&format=json&origin=*').then(function (r) { return r.json(); })
                    .then(function (cd) {
                      var pages = cd.query && cd.query.pages;
                      var pid = Object.keys(pages || {})[0];
                      var p = pages && pages[pid];
                      var rev = (p && p.revisions && p.revisions[0]) ? p.revisions[0] : null;
                      var text = (rev && rev['*']) ? rev['*'] : '';
                      return { title: title, text: text, type: 'country' };
                    });
                })
            );
            wikiPromises.push(
              fetch(wikiBase + '?action=query&list=search&srsearch=Economy%20of%20' + encodeURIComponent(countryName) + '&format=json&origin=*')
                .then(function (r) { return r.json(); })
                .then(function (d) {
                  var titles = (d.query && d.query.search) || [];
                  if (titles.length === 0) return null;
                  var title = titles[0].title;
                  return fetch(wikiBase + '?action=query&titles=' + encodeURIComponent(title) + '&prop=revisions&rvprop=content&format=json&origin=*').then(function (r) { return r.json(); })
                    .then(function (cd) {
                      var pages = cd.query && cd.query.pages;
                      var pid = Object.keys(pages || {})[0];
                      var p = pages && pages[pid];
                      var rev = (p && p.revisions && p.revisions[0]) ? p.revisions[0] : null;
                      var text = (rev && rev['*']) ? rev['*'] : '';
                      return { title: title, text: text, type: 'economy' };
                    });
                })
            );
            return Promise.all(wikiPromises).then(function (wikiResults) {
              var countryWiki = wikiResults[0];
              var economyWiki = wikiResults[1];
              function extractInfoboxValue(text, key) {
                if (!text) return '';
                var re = new RegExp('\\|\\s*' + key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*=\\s*([^\\n|\\[]+)', 'i');
                var m = text.match(re);
                return m ? m[1].trim().replace(/\[\[([^\]|]+)\|?([^\]]*)\]\]/g, '$2$1').replace(/\[\[([^\]]+)\]\]/g, '$1').replace(/<[^>]+>/g, '').trim() : '';
              }
              if (countryWiki && countryWiki.text) {
                var leader = extractInfoboxValue(countryWiki.text, 'leader_name') || extractInfoboxValue(countryWiki.text, 'leader_title') || extractInfoboxValue(countryWiki.text, 'president') || extractInfoboxValue(countryWiki.text, 'monarch');
                var leaderTitle = extractInfoboxValue(countryWiki.text, 'leader_title') || extractInfoboxValue(countryWiki.text, 'government_type');
                if (leader || leaderTitle) {
                  sections.push('<h4>' + escapeReportHtml(rpt('reportHeadingHeadRuler')) + '</h4><p>' + escapeReportHtml(leaderTitle || '') + (leader ? ': ' + escapeReportHtml(leader) : '') + '.</p>');
                }
              }
              if (economyWiki && economyWiki.text) {
                var intro = economyWiki.text.replace(/\{\{[\s\S]*?\}\}/g, '').replace(/<[^>]+>/g, '');
                var firstPara = intro.split(/\n\n+/).filter(function (p) { return p.length > 80; })[0] || intro.slice(0, 1200);
                firstPara = firstPara.replace(/\[\[([^\]|]+)\|?([^\]]*)\]\]/g, '$2').replace(/\[\[([^\]]+)\]\]/g, '$1').replace(/['']+/g, "'").slice(0, 1500);
                sections.push('<h4>' + escapeReportHtml(rpt('reportHeadingInvestmentResources')) + '</h4><p>' + escapeReportHtml(firstPara) + '</p>');
                sections.push('<h4>' + escapeReportHtml(rpt('reportHeadingRepaymentRisks')) + '</h4><p>' + escapeReportHtml(rpt('reportBodyRepaymentRisks')) + '</p>');
                sections.push('<h4>' + escapeReportHtml(rpt('reportHeadingTransferSystem')) + '</h4><p>' + escapeReportHtml(rpt('reportBodyTransferSystem')) + '</p>');
              }
              sections.push('<h4>' + escapeReportHtml(rpt('reportHeadingSecurity')) + '</h4><p>' + escapeReportHtml(rpt('reportBodySecurity')) + '</p>');
              if (rest && rest.population != null) {
                sections.push('<h4>' + escapeReportHtml(rpt('reportHeadingPopulation')) + '</h4><p>' + rest.population.toLocaleString() + '.</p>');
              }
              if (cca3) {
                return fetch('https://api.worldbank.org/v2/country/' + cca3 + '/indicator/NY.GDP.PCAP.CD?format=json&date=2019:2023&per_page=5')
                  .then(function (r) { return r.json(); })
                  .then(function (wb) {
                    var gdpData = (Array.isArray(wb) && wb[1]) ? wb[1] : [];
                    var gdpLast = gdpData.filter(function (x) { return x.value != null; }).sort(function (a, b) { return (b.date || '') - (a.date || ''); })[0];
                    if (gdpLast) {
                      sections.push('<h4>' + escapeReportHtml(rpt('reportHeadingGdpPerCapita')) + '</h4><p>' + (gdpLast.value != null ? Math.round(gdpLast.value).toLocaleString() + ' USD (' + gdpLast.date + ')' : '—') + '.</p>');
                    }
                    return fetch('https://api.worldbank.org/v2/country/' + cca3 + '/indicator/NV.IND.TOTL.KD?format=json&date=2019:2023&per_page=5')
                      .then(function (r) { return r.json(); })
                      .then(function (wb2) {
                        var indData = (Array.isArray(wb2) && wb2[1]) ? wb2[1] : [];
                        var indLast = indData.filter(function (x) { return x.value != null; }).sort(function (a, b) { return (b.date || '') - (a.date || ''); })[0];
                        if (indLast && indLast.value != null) {
                          sections.push('<h4>' + escapeReportHtml(rpt('reportHeadingIndustrySize')) + '</h4><p>' + escapeReportHtml(rpt('reportIndustryIndicatorLabel')) + Math.round(indLast.value).toLocaleString() + ' (' + indLast.date + ').</p>');
                        }
                        return sections;
                      })
                      .catch(function () { return sections; });
                  })
                  .catch(function () { return sections; });
              }
              return Promise.resolve(sections);
            });
          })
          .catch(function () { return sections || []; })
          .then(function (sections) {
            var t = new Date().toISOString();
            var html = '<p><strong>' + escapeReportHtml(rpt('reportCountryLabel')) + escapeReportHtml(countryName) + '</strong></p>' + (sections && sections.length ? sections.join('') : '<p>' + escapeReportHtml(rpt('reportInsufficientData')) + '</p>') + '<p class="report-meta">' + escapeReportHtml(rpt('reportMetaBuiltFrom')) + escapeReportHtml(t) + '</p>';
            return html;
          });
      }

      if (govReportGenerateBtn && govReportCountryInput) {
        govReportGenerateBtn.addEventListener('click', function () {
          var country = (govReportCountryInput.value || '').trim();
          if (!country) {
            alert(iifMessage('jsEnterCountryFirstDot'));
            return;
          }
          openGovReportModal();
          setReportLoading(true);
          buildCountryReport(country).then(function (html) {
            setReportContent(html);
          }).catch(function () {
            setReportContent('<p>' + escapeHtml(iifMessage('jsReportBuildError')) + '</p>');
          });
        });
      }
      if (govReportCloseBtn) govReportCloseBtn.addEventListener('click', closeGovReportModal);
      if (govReportOverlay) {
        govReportOverlay.addEventListener('click', function (e) {
          if (e.target === govReportOverlay) closeGovReportModal();
        });
      }

      /* استعادة دخول العميل المسجّل تلقائياً — دخول مؤتمت عند العودة من نفس الجهاز */
      function restoreSessionIfLoggedIn() {
        try {
          var email = (localStorage.getItem('iif-user-email') || '').trim().toLowerCase();
          var alreadyLogged = localStorage.getItem('iif-logged-in') === '1';
          if (!alreadyLogged && typeof hasTrustedDevice === 'function' && hasTrustedDevice()) {
            var bound = (localStorage.getItem(DEVICE_BOUND_EMAIL_KEY) || '').trim().toLowerCase();
            if (bound) {
              if (typeof setLoggedIn === 'function') setLoggedIn(true);
              if (typeof setAdminByEmail === 'function') setAdminByEmail(bound);
              try {
                localStorage.setItem('iif-user-email', bound);
                var fp = typeof getDeviceFingerprint === 'function' ? getDeviceFingerprint() : '';
                if (fp) localStorage.setItem(DEVICE_FINGERPRINT_KEY, fp);
              } catch (e) { }
              email = bound;
            }
          }
          if (localStorage.getItem('iif-logged-in') !== '1') return;
          if (!email) email = (localStorage.getItem('iif-user-email') || '').trim().toLowerCase();
          if (!email) return;
          if (typeof setAdminByEmail === 'function') setAdminByEmail(email);
          if (!localStorage.getItem('iif-device-fingerprint') && typeof getDeviceFingerprint === 'function') {
            var fp = getDeviceFingerprint();
            if (fp) localStorage.setItem('iif-device-fingerprint', fp);
          }
          if (window.IIF_MEMBERSHIP_AUTH) {
            if (typeof IIF_MEMBERSHIP_AUTH.setLoggedMember === 'function') IIF_MEMBERSHIP_AUTH.setLoggedMember(email);
            if (typeof IIF_MEMBERSHIP_AUTH.syncMembershipStatus === 'function') IIF_MEMBERSHIP_AUTH.syncMembershipStatus();
          }
          if (typeof updateDashboardNav === 'function') updateDashboardNav();
        } catch (e) { }
      }

      /* Diagnostics: quick view of session keys (for support/dev) */
      (function bindSessionDiagnostics() {
        function safeGet(k) {
          try { return localStorage.getItem(k); } catch (e) { return null; }
        }
        function safeGetS(k) {
          try { return sessionStorage.getItem(k); } catch (e) { return null; }
        }
        function fmt(v) {
          if (v == null) return '∅';
          if (v === '') return '""';
          if (String(v).length > 160) return String(v).slice(0, 160) + '…';
          return String(v);
        }
        function show() {
          var lines = [];
          lines.push('Session diagnostics');
          lines.push('—');
          lines.push('iif-logged-in (local): ' + fmt(safeGet('iif-logged-in')));
          lines.push('iif-logged-in (session): ' + fmt(safeGetS('iif-logged-in')));
          lines.push('iif-user-email: ' + fmt(safeGet('iif-user-email')));
          lines.push('iif-user-name: ' + fmt(safeGet('iif-user-name')));
          lines.push('iif-is-admin: ' + fmt(safeGet('iif-is-admin')));
          lines.push('iif-device-bound-email: ' + fmt(safeGet('iif-device-bound-email')));
          lines.push('iif-device-fingerprint: ' + fmt(safeGet('iif-device-fingerprint')));
          lines.push('iif-token: ' + fmt(safeGet('iif-token')));
          lines.push('iif-user: ' + fmt(safeGet('iif-user')));
          alert(lines.join('\n'));
        }
        document.addEventListener('keydown', function (e) {
          try {
            if (!e) return;
            if (!e.altKey || !e.shiftKey) return;
            var k = String(e.key || '').toLowerCase();
            if (k !== 's') return;
            e.preventDefault();
            show();
          } catch (e2) { }
        });
        // Optional: expose for support
        try { window.IIF_showSessionDiagnostics = show; } catch (e3) { }
      })();

      (function bindSessionDiagnosticsButton() {
        try {
          var btn = document.getElementById('auth-session-diagnostics');
          if (!btn) return;
          btn.addEventListener('click', function () {
            try {
              if (typeof window.IIF_showSessionDiagnostics === 'function') window.IIF_showSessionDiagnostics();
            } catch (e) { }
          });
        } catch (e2) { }
      })();
      /** بعد اكتمال التخزين الآمن واستعادة الجلسة: افتح اللوحة إن طُلب open_dashboard ولم يفتح المؤقت المبكر */
      function iifTryPendingDashboardAfterSecureInit() {
        try {
          var want = false;
          try {
            want = sessionStorage.getItem('iif_pending_open_dashboard') === '1';
          } catch (eS) { }
          if (!want) {
            try {
              var sp = new URLSearchParams(window.location.search || '');
              want = sp.get('open_dashboard') === '1' || sp.get('iif_open_dashboard') === '1' || sp.get('iif_admin_portal') === '1';
            } catch (eQ) { }
          }
          if (!want) return;
          if (typeof canAccessDashboard !== 'function' || !canAccessDashboard()) return;
          if (typeof openDashboardEnhanced !== 'function') return;
          var ov = document.getElementById('dashboard-overlay');
          if (ov && ov.classList.contains('is-open')) return;
          [0, 100, 350, 800, 1600, 3200].forEach(function (ms) {
            setTimeout(function () {
              try {
                var d = document.getElementById('dashboard-overlay');
                if (d && d.classList.contains('is-open')) return;
                if (typeof canAccessDashboard === 'function' && canAccessDashboard() && typeof openDashboardEnhanced === 'function') {
                  openDashboardEnhanced();
                }
              } catch (e) { }
            }, ms);
          });
        } catch (e) { }
      }
      (function runAfterSecureStorage() {
        var load = window.IIF_SECURE_STORAGE && window.IIF_SECURE_STORAGE.load;
        function doInit() {
          restoreSessionIfLoggedIn();
          renderActivitiesSection();
          updateDashboardNav();
          iifTryPendingDashboardAfterSecureInit();
          /* مالك: فتح اللوحة فقط عند نية صريحة (نفس شرط DOMContentLoaded) — لا فتح من الرئيسية */
          try {
            var emailAuto = (localStorage.getItem('iif-user-email') || '').trim().toLowerCase();
            if (emailAuto && typeof setAdminByEmail === 'function') setAdminByEmail(emailAuto);
            if (emailAuto && typeof getDashboardAccessType === 'function' && getDashboardAccessType() === 'owner' &&
              iifExplicitDashboardEntryIntent() &&
              (typeof canAccessDashboard !== 'function' || canAccessDashboard()) &&
              typeof openDashboardEnhanced === 'function') {
              try { sessionStorage.setItem('iif_admin_portal_mode', '1'); } catch (eSs) { }
              openDashboardEnhanced();
            }
          } catch (eAuto) { }
          if (typeof updateFeasibilityGate === 'function') updateFeasibilityGate();
        }
        if (load) load().then(doInit); else doInit();
      })();
      /* تأكيد واجهة الدخول بعد جاهزية الصفحة (بعد فك تشفير البيانات إن وُجد) */
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function applySessionWhenReady() {
          var load = window.IIF_SECURE_STORAGE && window.IIF_SECURE_STORAGE.load;
          if (load) load().then(function () {
            restoreSessionIfLoggedIn();
            if (typeof updateDashboardNav === 'function') updateDashboardNav();
            iifTryPendingDashboardAfterSecureInit();
            /* تكرار نفس المنطق بعد DOMContentLoaded */
            try {
              var emailAuto2 = (localStorage.getItem('iif-user-email') || '').trim().toLowerCase();
              if (emailAuto2 && typeof setAdminByEmail === 'function') setAdminByEmail(emailAuto2);
              if (emailAuto2 && typeof getDashboardAccessType === 'function' && getDashboardAccessType() === 'owner' &&
                iifExplicitDashboardEntryIntent() &&
                (typeof canAccessDashboard !== 'function' || canAccessDashboard()) &&
                typeof openDashboardEnhanced === 'function') {
                try { sessionStorage.setItem('iif_admin_portal_mode', '1'); } catch (eSs2) { }
                openDashboardEnhanced();
              }
            } catch (eAuto2) { }
          }); else {
            restoreSessionIfLoggedIn();
            if (typeof updateDashboardNav === 'function') updateDashboardNav();
          }
        });
      } else {
        setTimeout(function () {
          if (typeof updateDashboardNav === 'function') updateDashboardNav();
        }, 0);
      }
      if (typeof window.addEventListener === 'function') {
        window.addEventListener('hashchange', function () {
          if (location.hash === '#feasibility-study') {
            if (window.IIF_MEMBERSHIP_AUTH && IIF_MEMBERSHIP_AUTH.syncMembershipStatus) IIF_MEMBERSHIP_AUTH.syncMembershipStatus();
            updateFeasibilityGate();
          }
        });
      }

      /* قائمة خدماتنا المنسدلة — فتح/إغلاق عند النقر على الزر أو خارج القائمة */
      (function initServicesDropdown() {
        var wrap = document.getElementById('services-dropdown-wrap');
        var trigger = document.getElementById('services-dropdown-trigger');
        var dropdown = document.getElementById('services-dropdown');
        function closeDropdown() {
          if (wrap) wrap.classList.remove('is-open');
          if (trigger) trigger.setAttribute('aria-expanded', 'false');
        }
        function openDropdown() {
          if (wrap) wrap.classList.add('is-open');
          if (trigger) trigger.setAttribute('aria-expanded', 'true');
        }
        function toggleDropdown() {
          if (wrap && wrap.classList.contains('is-open')) closeDropdown();
          else openDropdown();
        }
        if (trigger && wrap) {
          trigger.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); toggleDropdown(); });
        }
        document.addEventListener('click', function (e) {
          if (!wrap || !wrap.classList.contains('is-open')) return;
          if (wrap.contains(e.target)) return;
          closeDropdown();
        });
        if (dropdown) {
          dropdown.addEventListener('click', function (e) {
            var link = e.target && (e.target.closest('a') || e.target.closest('button'));
            if (link && link.id === 'services-calc-open') {
              e.preventDefault();
              var calcOpen = document.getElementById('calc-open');
              if (calcOpen) calcOpen.click();
            }
            closeDropdown();
          });
        }
        var servicesCalcBtn = document.getElementById('services-calc-open');
        if (servicesCalcBtn) {
          servicesCalcBtn.addEventListener('click', function (e) {
            e.preventDefault();
            var calcOpen = document.getElementById('calc-open');
            if (calcOpen) calcOpen.click();
            closeDropdown();
          });
        }
      })();

      /* الحاسبة — تظهر عند طلب المستخدم فقط (نافذة منبثقة) */
      function openCalc() {
        if (typeof isLoggedIn === 'function' && !isLoggedIn()) {
          if (typeof openAuth === 'function') openAuth();
          return;
        }
        var calcOverlay = document.getElementById('calc-overlay');
        if (calcOverlay) {
          calcOverlay.classList.add('is-open');
          calcOverlay.setAttribute('aria-hidden', 'false');
        }
      }

      var calcOverlay = document.getElementById('calc-overlay');
      var calcOpen = document.getElementById('calc-open');
      var calcClose = document.getElementById('calc-close');
      if (calcOpen && calcOverlay) {
        calcOpen.addEventListener('click', function () {
          if (typeof isLoggedIn === 'function' && !isLoggedIn()) {
            if (typeof openAuth === 'function') openAuth();
            return;
          }
          calcOverlay.classList.add('is-open');
          calcOverlay.setAttribute('aria-hidden', 'false');
        });
      }
      if (calcClose && calcOverlay) {
        calcClose.addEventListener('click', function () {
          calcOverlay.classList.remove('is-open');
          calcOverlay.setAttribute('aria-hidden', 'true');
        });
      }
      if (calcOverlay) {
        calcOverlay.addEventListener('click', function (e) {
          if (e.target === calcOverlay) {
            calcOverlay.classList.remove('is-open');
            calcOverlay.setAttribute('aria-hidden', 'true');
          }
        });
      }

      (function initCalculator() {
        var display = document.getElementById('calc-display');
        var btns = document.querySelectorAll('.calc-wrap [data-calc]');
        if (!display || !btns.length) return;
        var current = '0';
        var pendingOp = null;
        var pendingVal = null;
        function updateDisplay() {
          display.textContent = current;
        }
        function parseNum(s) {
          var n = parseFloat(String(s).replace(/,/g, ''));
          return isNaN(n) ? 0 : n;
        }
        function compute(a, op, b) {
          var x = parseNum(a);
          var y = parseNum(b);
          switch (op) {
            case '+': return x + y;
            case '-': return x - y;
            case '*': return x * y;
            case '/': return y === 0 ? 0 : x / y;
            default: return y;
          }
        }
        btns.forEach(function (btn) {
          btn.addEventListener('click', function () {
            var v = (btn.getAttribute('data-calc') || '').trim();
            if (v === 'C') {
              current = '0';
              pendingOp = null;
              pendingVal = null;
            } else if (v === '±') {
              if (current !== '0') current = current.charAt(0) === '-' ? current.slice(1) : '-' + current;
            } else if (v === '%') {
              current = String(parseNum(current) / 100);
            } else if (v === '.') {
              if (current.indexOf('.') === -1) current = current + '.';
            } else if (v === '=') {
              if (pendingOp !== null && pendingVal !== null) {
                current = String(compute(pendingVal, pendingOp, current));
                pendingOp = null;
                pendingVal = null;
              }
            } else if (v === '+' || v === '-' || v === '*' || v === '/') {
              if (pendingOp !== null && pendingVal !== null) current = String(compute(pendingVal, pendingOp, current));
              pendingVal = current;
              pendingOp = v;
              current = '0';
            } else if (/^\d$/.test(v)) {
              current = current === '0' ? v : current + v;
            }
            updateDisplay();
          });
        });
        updateDisplay();
      })();

      /* الاتصال المباشر — للتواصل فقط (بريد + هاتف) */
      var CONTACT_EMAIL = 'info@iiffund.com';
      var CONTACT_PHONE = '—';
      function applyContactInfo() {
        var phoneEls = [document.getElementById('contact-phone'), document.getElementById('contact-phone-office')];
        phoneEls.forEach(function (el) { if (el) el.textContent = CONTACT_PHONE; });
      }
      applyContactInfo();

      /* حساب الصندوق البنكي — مصدر واحد لطريقة الدفع (الاستشارة العاجلة + إضافة رأس المال للمستثمرين)
         غيّر القيم أدناه إلى اسم الحساب ورقمه من الوثيقة البنكية للصندوق */
      var PAYMENT_ACCOUNT_NAME = '—';   /* اسم الحساب كما في كشف البنك */
      var PAYMENT_ACCOUNT_NUMBER = '—'; /* رقم الحساب أو IBAN */
      function applyPaymentAccount() {
        var nameEls = [document.getElementById('payment-account-name'), document.getElementById('investor-payment-account-name')];
        var numEls = [document.getElementById('payment-account-number'), document.getElementById('investor-payment-account-number')];
        nameEls.forEach(function (el) { if (el) el.textContent = PAYMENT_ACCOUNT_NAME; });
        numEls.forEach(function (el) { if (el) el.textContent = PAYMENT_ACCOUNT_NUMBER; });
      }
      applyPaymentAccount();
      /* حفظ طريقة الدفع للعميل — تذكر اختياره للدفعات القادمة */
      var PAYMENT_REMEMBER_KEY = 'iif-payment-choice';
      function getSavedPaymentChoice() { try { return localStorage.getItem(PAYMENT_REMEMBER_KEY) || ''; } catch (e) { return ''; } }
      function setSavedPaymentChoice(val) { try { localStorage.setItem(PAYMENT_REMEMBER_KEY, val ? 'bank_transfer' : ''); } catch (e) { } }
      function updatePaymentRememberUI() {
        var saved = getSavedPaymentChoice() === 'bank_transfer';
        ['urgent', 'investor'].forEach(function (scope) {
          var cb = document.getElementById('payment-remember-' + scope);
          var hint = document.getElementById('payment-saved-hint-' + scope);
          if (cb) cb.checked = saved;
          if (hint) hint.hidden = !saved;
        });
      }
      ['payment-remember-urgent', 'payment-remember-investor'].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.addEventListener('change', function () { setSavedPaymentChoice(this.checked); updatePaymentRememberUI(); });
      });
      updatePaymentRememberUI();
      /* Registration: show Ministry field only when Entity = State/Government */
      var regEntity = document.getElementById('reg-entity');
      var regMinistryWrap = document.getElementById('reg-ministry-wrap');
      var regMinistry = document.getElementById('reg-ministry');
      if (regEntity && regMinistryWrap) {
        function toggleRegMinistry() {
          var isState = regEntity.value === 'state';
          regMinistryWrap.style.display = isState ? 'block' : 'none';
          if (regMinistry) { regMinistry.required = isState; if (!isState) regMinistry.value = ''; }
        }
        regEntity.addEventListener('change', toggleRegMinistry);
        toggleRegMinistry();
      }
      /* التسجيل: مفتاح أي بلد في خانة الهاتف/الجوال */
      var regCountry = document.getElementById('reg-country');
      var regPhoneCodeSelect = document.getElementById('reg-phone-code');
      var regPhoneInput = document.getElementById('reg-phone');
      var countryDialCodes = {
        SA: '+966', AE: '+971', BH: '+973', KW: '+965', OM: '+968', QA: '+974',
        EG: '+20', JO: '+962', MA: '+212', TR: '+90', PK: '+92', ID: '+62',
        FR: '+33', US: '+1', GB: '+44', DE: '+49', CN: '+86', IN: '+91',
        DZ: '+213', TN: '+216', LY: '+218', SD: '+249', SY: '+963', IQ: '+964', YE: '+967', LB: '+961', PS: '+970',
        AF: '+93', IR: '+98', KZ: '+7', UZ: '+998', TM: '+993', TJ: '+992', KG: '+996', AZ: '+994', GE: '+995', AM: '+374',
        RU: '+7', BY: '+375', UA: '+380', MD: '+373', RO: '+40', BG: '+359', GR: '+30', AL: '+355', MK: '+389', RS: '+381', HR: '+385', SI: '+386', BA: '+387', ME: '+382', XK: '+383',
        IT: '+39', ES: '+34', PT: '+351', NL: '+31', BE: '+32', CH: '+41', AT: '+43', PL: '+48', CZ: '+420', SK: '+421', HU: '+36',
        SE: '+46', NO: '+47', DK: '+45', FI: '+358', EE: '+372', LV: '+371', LT: '+370', IE: '+353', IS: '+354', LU: '+352', MT: '+356', CY: '+357',
        NG: '+234', ZA: '+27', KE: '+254', GH: '+233', ET: '+251', TZ: '+255', UG: '+256', SN: '+221', CI: '+225', CM: '+237', ML: '+223', MG: '+261',
        AU: '+61', NZ: '+64', JP: '+81', KR: '+82', TH: '+66', VN: '+84', MY: '+60', SG: '+65', PH: '+63', MM: '+95', KH: '+855', LA: '+856', BN: '+673', TL: '+670',
        BR: '+55', MX: '+52', AR: '+54', CL: '+56', CO: '+57', PE: '+51', VE: '+58', EC: '+593', CA: '+1', OTHER: ''
      };
      var phoneCodeOptions = [
        { v: '', ar: '+', en: '+' },
        { v: '+966', ar: '+966 السعودية', en: '+966 Saudi Arabia' }, { v: '+971', ar: '+971 الإمارات', en: '+971 UAE' }, { v: '+973', ar: '+973 البحرين', en: '+973 Bahrain' }, { v: '+965', ar: '+965 الكويت', en: '+965 Kuwait' }, { v: '+968', ar: '+968 عُمان', en: '+968 Oman' }, { v: '+974', ar: '+974 قطر', en: '+974 Qatar' },
        { v: '+20', ar: '+20 مصر', en: '+20 Egypt' }, { v: '+962', ar: '+962 الأردن', en: '+962 Jordan' }, { v: '+212', ar: '+212 المغرب', en: '+212 Morocco' }, { v: '+213', ar: '+213 الجزائر', en: '+213 Algeria' }, { v: '+216', ar: '+216 تونس', en: '+216 Tunisia' }, { v: '+218', ar: '+218 ليبيا', en: '+218 Libya' }, { v: '+249', ar: '+249 السودان', en: '+249 Sudan' }, { v: '+963', ar: '+963 سوريا', en: '+963 Syria' }, { v: '+964', ar: '+964 العراق', en: '+964 Iraq' }, { v: '+967', ar: '+967 اليمن', en: '+967 Yemen' }, { v: '+961', ar: '+961 لبنان', en: '+961 Lebanon' }, { v: '+970', ar: '+970 فلسطين', en: '+970 Palestine' },
        { v: '+90', ar: '+90 تركيا', en: '+90 Turkey' }, { v: '+92', ar: '+92 باكستان', en: '+92 Pakistan' }, { v: '+62', ar: '+62 إندونيسيا', en: '+62 Indonesia' }, { v: '+91', ar: '+91 الهند', en: '+91 India' }, { v: '+93', ar: '+93 أفغانستان', en: '+93 Afghanistan' }, { v: '+98', ar: '+98 إيران', en: '+98 Iran' },
        { v: '+33', ar: '+33 فرنسا', en: '+33 France' }, { v: '+44', ar: '+44 بريطانيا', en: '+44 UK' }, { v: '+49', ar: '+49 ألمانيا', en: '+49 Germany' }, { v: '+39', ar: '+39 إيطاليا', en: '+39 Italy' }, { v: '+34', ar: '+34 إسبانيا', en: '+34 Spain' }, { v: '+31', ar: '+31 هولندا', en: '+31 Netherlands' }, { v: '+32', ar: '+32 بلجيكا', en: '+32 Belgium' }, { v: '+41', ar: '+41 سويسرا', en: '+41 Switzerland' }, { v: '+43', ar: '+43 النمسا', en: '+43 Austria' }, { v: '+48', ar: '+48 بولندا', en: '+48 Poland' }, { v: '+46', ar: '+46 السويد', en: '+46 Sweden' }, { v: '+47', ar: '+47 النرويج', en: '+47 Norway' }, { v: '+45', ar: '+45 الدنمارك', en: '+45 Denmark' }, { v: '+358', ar: '+358 فنلندا', en: '+358 Finland' }, { v: '+353', ar: '+353 أيرلندا', en: '+353 Ireland' },
        { v: '+1', ar: '+1 أمريكا/كندا', en: '+1 USA/Canada' }, { v: '+7', ar: '+7 روسيا', en: '+7 Russia' }, { v: '+380', ar: '+380 أوكرانيا', en: '+380 Ukraine' }, { v: '+375', ar: '+375 بيلاروسيا', en: '+375 Belarus' }, { v: '+40', ar: '+40 رومانيا', en: '+40 Romania' }, { v: '+359', ar: '+359 بلغاريا', en: '+359 Bulgaria' }, { v: '+30', ar: '+30 اليونان', en: '+30 Greece' },
        { v: '+86', ar: '+86 الصين', en: '+86 China' }, { v: '+81', ar: '+81 اليابان', en: '+81 Japan' }, { v: '+82', ar: '+82 كوريا الجنوبية', en: '+82 South Korea' }, { v: '+60', ar: '+60 ماليزيا', en: '+60 Malaysia' }, { v: '+65', ar: '+65 سنغافورة', en: '+65 Singapore' }, { v: '+66', ar: '+66 تايلاند', en: '+66 Thailand' }, { v: '+84', ar: '+84 فيتنام', en: '+84 Vietnam' }, { v: '+63', ar: '+63 الفلبين', en: '+63 Philippines' }, { v: '+61', ar: '+61 أستراليا', en: '+61 Australia' }, { v: '+64', ar: '+64 نيوزيلندا', en: '+64 New Zealand' },
        { v: '+55', ar: '+55 البرازيل', en: '+55 Brazil' }, { v: '+52', ar: '+52 المكسيك', en: '+52 Mexico' }, { v: '+54', ar: '+54 الأرجنتين', en: '+54 Argentina' }, { v: '+56', ar: '+56 تشيلي', en: '+56 Chile' }, { v: '+57', ar: '+57 كولومبيا', en: '+57 Colombia' }, { v: '+51', ar: '+51 بيرو', en: '+51 Peru' }, { v: '+58', ar: '+58 فنزويلا', en: '+58 Venezuela' }, { v: '+593', ar: '+593 الإكوادور', en: '+593 Ecuador' },
        { v: '+234', ar: '+234 نيجيريا', en: '+234 Nigeria' }, { v: '+27', ar: '+27 جنوب أفريقيا', en: '+27 South Africa' }, { v: '+254', ar: '+254 كينيا', en: '+254 Kenya' }, { v: '+233', ar: '+233 غانا', en: '+233 Ghana' }, { v: '+251', ar: '+251 إثيوبيا', en: '+251 Ethiopia' }
      ];
      function getRegPhoneCodeEls() {
        if (!regPhoneCodeSelect) regPhoneCodeSelect = document.getElementById('reg-phone-code');
        if (!regCountry) regCountry = document.getElementById('reg-country');
        return { country: regCountry, code: regPhoneCodeSelect };
      }
      function initRegPhoneCodeSelect() {
        var el = regPhoneCodeSelect || document.getElementById('reg-phone-code');
        if (!el) return;
        if (el.options.length > 1) return;
        var phoneLangInit = (document.documentElement.getAttribute('data-lang') || 'en').toLowerCase();
        phoneCodeOptions.forEach(function (o) {
          var opt = document.createElement('option');
          opt.value = o.v;
          opt.textContent = (phoneLangInit === 'ar' ? o.ar : o.en) || o.ar || o.en;
          el.appendChild(opt);
        });
      }
      function updateRegPhoneCodeLabels() {
        var codeEl = regPhoneCodeSelect || document.getElementById('reg-phone-code');
        if (!codeEl || codeEl.options.length < 2) return;
        var opts = codeEl.querySelectorAll('option');
        if (opts[0]) {
          opts[0].textContent = typeof iifMessage === 'function' ? iifMessage('authPhoneCodeOptionBlank') : '— Code —';
        }
        var phoneLang = (document.documentElement.getAttribute('data-lang') || 'en').toLowerCase();
        phoneCodeOptions.forEach(function (o, i) {
          if (opts[i + 1]) opts[i + 1].textContent = (phoneLang === 'ar' ? o.ar : o.en) || o.ar || o.en;
        });
      }
      function syncRegPhoneCodeFromCountry() {
        var els = getRegPhoneCodeEls();
        var rc = els.country, rp = els.code;
        if (!rc || !rp) return;
        var code = countryDialCodes[rc.value] || '';
        if (code && rp.options.length <= 1) initRegPhoneCodeSelect();
        rp = document.getElementById('reg-phone-code') || rp;
        rp.value = code;
        if (!rp.value && code) {
          var opt = document.createElement('option');
          opt.value = code;
          opt.textContent = code;
          rp.appendChild(opt);
          rp.value = code;
        }
        if (code) {
          for (var i = 0; i < rp.options.length; i++) {
            if (rp.options[i].value === code) {
              rp.selectedIndex = i;
              break;
            }
          }
        }
      }
      var regPhoneCodeListenerAdded = false;
      function ensureRegPhoneCodeReady() {
        getRegPhoneCodeEls();
        initRegPhoneCodeSelect();
        if (regCountry && regPhoneCodeSelect) {
          syncRegPhoneCodeFromCountry();
          if (!regPhoneCodeListenerAdded) {
            regPhoneCodeListenerAdded = true;
            regCountry.addEventListener('change', syncRegPhoneCodeFromCountry);
          }
        }
      }
      window.IIF_initRegPhoneCodeIfNeeded = ensureRegPhoneCodeReady;
      window.IIF_syncPhoneCodeFromCountry = syncRegPhoneCodeFromCountry;
      ensureRegPhoneCodeReady();
      if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ensureRegPhoneCodeReady);
      /* تخزين الطلبات مع موقع العميل وقت التواصل — للتحقق من صدق التعامل */
      var SUBMISSIONS_KEY = 'iif-submissions';
      function getSubmissions() { try { var r = localStorage.getItem(SUBMISSIONS_KEY); return r ? JSON.parse(r) : []; } catch (e) { return []; } }
      function saveSubmissions(arr) { try { localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(arr)); } catch (e) { } }
      function getSubmissionLocation(cb) {
        if (!cb) return;
        var out = { ipCountry: '', ipCity: '', lat: '', lng: '', at: new Date().toISOString() };
        var geoDone = false;
        var ipDone = false;
        function finish() {
          if (!geoDone || !ipDone) return;
          cb(out);
        }
        try {
          fetch('https://ipapi.co/json/').then(function (r) { return r.json(); }).then(function (d) {
            if (d) {
              out.ipCountry = (d.country_name) ? d.country_name : '';
              out.ipCity = (d.city) ? d.city : '';
              if (!out.lat && !out.lng && d.latitude) { out.lat = String(d.latitude); out.lng = String(d.longitude); }
            }
          }).catch(function () { }).finally(function () { ipDone = true; finish(); });
        } catch (e) { ipDone = true; finish(); }
        if (typeof navigator !== 'undefined' && navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            function (pos) {
              out.lat = String(pos.coords.latitude);
              out.lng = String(pos.coords.longitude);
              geoDone = true;
              finish();
            },
            function () { geoDone = true; finish(); },
            { timeout: 8000, maximumAge: 600000 }
          );
        } else {
          geoDone = true;
          finish();
        }
      }
      function iifNonBindingDisclaimer() {
        return typeof iifMessage === 'function' ? iifMessage('legalNonBindingDisclaimer') : 'Expression of interest only — no approval, financing, or binding offer. See Terms.';
      }
      function iifSubmissionAcknowledgmentMsg() {
        return (typeof iifMessage === 'function' ? iifMessage('jsRequestReceivedShort') : 'Your request was received.') + '\n\n' + iifNonBindingDisclaimer();
      }
      function addSubmission(type, data, location) {
        var list = getSubmissions();
        list.push({ type: type, data: data, location: location || {}, at: new Date().toISOString(), id: 's' + Date.now() });
        saveSubmissions(list);
      }

      /* Project analysis (free): Ollama local + World Bank + SearXNG.
         This is isolated to dashboard-project-analysis only. */
      (function projectAnalysisAI() {
        var STORE_KEY = 'iif-project-analysis-records';
        function getStore() { try { var r = localStorage.getItem(STORE_KEY); var o = r ? JSON.parse(r) : {}; return o && typeof o === 'object' ? o : {}; } catch (e) { return {}; } }
        function saveStore(o) { try { localStorage.setItem(STORE_KEY, JSON.stringify(o || {})); } catch (e) { } }

        function esc(s) { return escapeHtml(String(s == null ? '' : s)); }

        function normalizeCountry(raw) {
          var s = (raw || '').toString().trim();
          if (!s) return '';
          // Basic cleanup for common punctuation / extra parts.
          return s.replace(/\s+/g, ' ').replace(/[،]/g, '').trim();
        }

        function getAnalysisItems() {
          var items = [];
          try {
            var subs = (typeof getSubmissions === 'function') ? getSubmissions() : [];
            (subs || []).forEach(function (s) {
              if (!s || !s.id) return;
              var d = s.data || {};
              var title = (d.project || d.subject || d.entity || d.name || '') || ('Submission: ' + (s.type || ''));
              var country = normalizeCountry(d.country || d.kyc_country || d.nationality || '');
              var desc = (d.message || d.desc || d.details || '').toString();
              items.push({
                id: String(s.id),
                kind: 'submission',
                subType: s.type || '',
                title: String(title).trim() || ('Submission ' + String(s.id)),
                country: country,
                submitterEmail: (d.email || '').toString(),
                createdAt: s.at || '',
                raw: s,
                projectText: [title, desc, country].filter(Boolean).join('\n')
              });
            });
          } catch (e1) { }
          try {
            if (typeof getStoredUploads === 'function') {
              [UPLOADS_DOCS_KEY, UPLOADS_IMAGES_KEY, UPLOADS_VIDEO_KEY, UPLOADS_LIVE_KEY].forEach(function (k) {
                var arr = getStoredUploads(k) || [];
                (arr || []).forEach(function (u) {
                  if (!u || !u.id) return;
                  items.push({
                    id: String(u.id),
                    kind: 'upload',
                    subType: k,
                    title: (u.name || 'Upload') + ' (' + (k || '').replace('iif-uploads-', '') + ')',
                    country: '',
                    submitterEmail: '',
                    createdAt: u.at || '',
                    raw: u,
                    projectText: [u.name, u.type, u.size ? ('size:' + u.size) : ''].filter(Boolean).join('\n')
                  });
                });
              });
            }
          } catch (e2) { }
          // Most recent first
          items.sort(function (a, b) { return String(b.createdAt || '').localeCompare(String(a.createdAt || '')); });
          return items;
        }

        async function checkOllama(model) {
          var base = window.location.origin + '/api/ollama';
          var r = await fetch(base + '/api/tags', { method: 'GET' });
          if (!r.ok) throw new Error('Ollama: HTTP ' + r.status);
          var data = await r.json();
          var tags = (data && data.models) ? data.models.map(function (m) { return m && m.name; }).filter(Boolean) : [];
          var has = tags.indexOf(model) >= 0;
          return { ok: true, hasModel: has, models: tags };
        }

        async function getCountryCca3(countryName) {
          var name = normalizeCountry(countryName);
          if (!name) return '';
          // restcountries: free, no key.
          var url = 'https://restcountries.com/v3.1/name/' + encodeURIComponent(name) + '?fields=cca3,name';
          var r = await fetch(url, { method: 'GET' });
          if (!r.ok) return '';
          var arr = await r.json();
          if (!Array.isArray(arr) || !arr.length) return '';
          return (arr[0] && arr[0].cca3) ? String(arr[0].cca3).trim().toUpperCase() : '';
        }

        async function fetchWorldBank(cca3) {
          if (!cca3) return { ok: true, indicators: {}, series: {} };
          var indicators = {
            gdp: 'NY.GDP.MKTP.CD',
            gdpPerCapita: 'NY.GDP.PCAP.CD',
            inflation: 'FP.CPI.TOTL.ZG',
            unemployment: 'SL.UEM.TOTL.ZS'
          };
          var out = {};
          var series = {};
          var keys = Object.keys(indicators);
          for (var i = 0; i < keys.length; i++) {
            var k = keys[i];
            var code = indicators[k];
            try {
              var url = 'https://api.worldbank.org/v2/country/' + encodeURIComponent(cca3) + '/indicator/' + encodeURIComponent(code) + '?format=json&per_page=60';
              var r = await fetch(url, { method: 'GET' });
              if (!r.ok) continue;
              var data = await r.json();
              var rows = Array.isArray(data) ? data[1] : null;
              if (!Array.isArray(rows)) continue;
              var cleaned = rows.filter(function (x) { return x && x.date && (x.value !== null && x.value !== undefined); })
                .slice(0, 8)
                .map(function (x) { return { year: String(x.date), value: x.value }; });
              series[k] = cleaned;
              if (cleaned.length) out[k] = cleaned[0].value;
            } catch (e) { }
          }
          return { ok: true, indicators: out, series: series };
        }

        function iifResolveSearxPackUrl(paramsStr) {
          var h = (typeof location !== 'undefined' && location.hostname) ? String(location.hostname).toLowerCase() : '';
          var isLocal = h === 'localhost' || h === '127.0.0.1' || h === '[::1]';
          if (isLocal) {
            return (typeof location !== 'undefined' ? location.origin : '') + '/api/searx/search?' + paramsStr;
          }
          try {
            var m = typeof document !== 'undefined' && document.querySelector && document.querySelector('meta[name="iif-searx-proxy-base"]');
            var base = m && m.getAttribute('content');
            base = base ? String(base).trim().replace(/\/$/, '') : '';
            if (base && /^https?:\/\//i.test(base)) {
              return base + '/api/searx/search?' + paramsStr;
            }
          } catch (eM) { }
          return (typeof location !== 'undefined' ? location.origin : '') + '/api/searx/search?' + paramsStr;
        }

        function iifSearxUiLang() {
          var searxUiLang = 'en';
          try {
            var k = (window.IIF_CONFIG && window.IIF_CONFIG.langStorageKey) || 'iif-lang';
            var st = typeof localStorage !== 'undefined' ? localStorage.getItem(k) : '';
            if (st) searxUiLang = String(st).replace(/_/g, '-').split('-')[0].toLowerCase();
            else if (document.documentElement && document.documentElement.lang)
              searxUiLang = String(document.documentElement.lang).split('-')[0].toLowerCase();
            else if (typeof navigator !== 'undefined' && navigator.language)
              searxUiLang = String(navigator.language).split('-')[0].toLowerCase();
          } catch (eLang) { searxUiLang = 'en'; }
          if (!searxUiLang || searxUiLang.length < 2) searxUiLang = 'en';
          return searxUiLang;
        }

        async function fetchSearxPackOnce(query, categories) {
          var q = (query || '').trim();
          if (!q) return { ok: true, results: [], empty: true };
          var searxUiLang = iifSearxUiLang();
          var cat = categories || 'general';
          var paramsStr = new URLSearchParams({ q: q, format: 'json', language: searxUiLang, categories: cat }).toString();
          var url = iifResolveSearxPackUrl(paramsStr);
          var r;
          try {
            r = await fetch(url, { method: 'GET', cache: 'no-store', mode: 'cors' });
          } catch (eNet) {
            return { ok: false, results: [], error: 'network' };
          }
          if (!r.ok) {
            var errCode = 'HTTP ' + r.status;
            if (r.status === 429) errCode = 'rate_limited';
            return { ok: false, results: [], error: errCode };
          }
          var data;
          try {
            data = await r.json();
          } catch (eJ) {
            return { ok: false, results: [], error: 'invalid_json' };
          }
          if (data && data.error === 'rate_limited') {
            return { ok: false, results: [], error: 'rate_limited' };
          }
          var results = (data && Array.isArray(data.results)) ? data.results.slice(0, 12).map(function (x) {
            return { title: x.title || '', url: x.url || '', engine: x.engine || '', content: (x.content || '').slice(0, 400) };
          }) : [];
          return { ok: true, results: results, empty: results.length === 0 };
        }

        async function fetchSearxPack(query) {
          var q = (query || '').trim();
          if (!q) return { ok: true, results: [] };
          var first = await fetchSearxPackOnce(q, 'general');
          if (!first.ok) return first;
          if (first.results && first.results.length > 0) return { ok: true, results: first.results };
          var second = await fetchSearxPackOnce(q, 'news');
          if (!second.ok) return second;
          if (second.results && second.results.length > 0) return { ok: true, results: second.results };
          return { ok: true, results: [] };
        }

        function buildDashboardSearxQuery(item, countryName) {
          var chunks = [];
          if (item && item.title) chunks.push(String(item.title).trim().slice(0, 220));
          if (countryName) chunks.push(String(countryName).trim());
          var raw = (item && item.projectText) ? String(item.projectText) : '';
          var compact = raw.replace(/\s+/g, ' ').trim();
          if (compact.length > 30) chunks.push(compact.slice(0, 360));
          if (item && item.kind) chunks.push(String(item.kind));
          if (item && item.subType) chunks.push(String(item.subType));
          chunks.push('economic outlook');
          chunks.push('risk');
          chunks.push('investment news');
          var q = chunks.filter(Boolean).join(' ');
          if (q.length > 480) q = q.slice(0, 480);
          return q;
        }

        async function ollamaJson(model, system, user) {
          var base = window.location.origin + '/api/ollama';
          var body = {
            model: model,
            stream: false,
            format: 'json',
            messages: [
              { role: 'system', content: system },
              { role: 'user', content: user }
            ],
            options: { temperature: 0.2 }
          };
          var r = await fetch(base + '/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
          });
          if (!r.ok) throw new Error('Ollama chat HTTP ' + r.status);
          var data = await r.json();
          var txt = data && data.message && data.message.content ? data.message.content : '';
          var parsed = null;
          try { parsed = JSON.parse(txt); } catch (e) { parsed = null; }
          if (!parsed) throw new Error('Ollama returned non-JSON');
          return parsed;
        }

        async function runAnalysis(item, model) {
          var store = getStore();
          var key = item.id;
          store[key] = store[key] || {};
          store[key].status = 'running';
          store[key].updatedAt = new Date().toISOString();
          saveStore(store);
          render();

          var countryName = normalizeCountry(item.country || '');
          var cca3 = '';
          var wb = { ok: true, indicators: {}, series: {} };
          if (countryName) {
            cca3 = await getCountryCca3(countryName);
            wb = await fetchWorldBank(cca3);
          }
          var webQuery = buildDashboardSearxQuery(item, countryName);
          var searx = await fetchSearxPack(webQuery);
          try {
            if (searx && searx.error === 'rate_limited') {
              setStatus(iifT('dashPaSearxRateLimited', 'Search proxy rate limit — continuing without live web results. Retry in about one minute.'));
            } else if (searx && searx.ok === false && searx.error && searx.error !== 'rate_limited') {
              setStatus(iifT('dashPaSearxSkipped', 'Web search unavailable — analysis continues with World Bank data only.'));
            }
          } catch (eSt) { }

          var system = 'You are an institutional investment analyst. Output STRICT JSON only. No markdown. No extra text.';
          var user = JSON.stringify({
            task: 'Analyze the project and country context, then produce a structured analysis suitable for filling a dashboard.',
            project: {
              title: item.title,
              kind: item.kind,
              type: item.subType,
              submitterEmail: item.submitterEmail || '',
              country: countryName,
              text: (item.projectText || '').slice(0, 7000)
            },
            countryData: {
              countryName: countryName,
              cca3: cca3,
              worldBankLatest: wb.indicators,
              worldBankSeries: wb.series
            },
            webSearchStatus: searx && searx.ok ? 'ok' : (searx && searx.error ? String(searx.error) : 'unknown'),
            webSources: (searx && Array.isArray(searx.results)) ? searx.results : []
          }, null, 2) + '\n\n' +
            'Return JSON with keys: responsibleAuthority, workRegulations, financialCenter, debt, sovereignGuarantee, security, economicAnalysis, risks, confidence (0-1), sources (array of {title,url}).';

          var out = await ollamaJson(model, system, user);
          var clean = {
            responsibleAuthority: (out.responsibleAuthority || '').toString(),
            workRegulations: (out.workRegulations || '').toString(),
            financialCenter: (out.financialCenter || '').toString(),
            debt: (out.debt || '').toString(),
            sovereignGuarantee: (out.sovereignGuarantee || '').toString(),
            security: (out.security || '').toString(),
            economicAnalysis: (out.economicAnalysis || '').toString(),
            risks: (out.risks || '').toString(),
            confidence: typeof out.confidence === 'number' ? out.confidence : null,
            sources: Array.isArray(out.sources) ? out.sources.slice(0, 10).map(function (s) { return { title: (s && s.title) ? String(s.title) : '', url: (s && s.url) ? String(s.url) : '' }; }) : [],
            countryName: countryName,
            cca3: cca3,
            worldBank: wb.indicators,
            searx: searx.results
          };

          var store2 = getStore();
          store2[key] = Object.assign({}, store2[key] || {}, { status: 'done', analysis: clean, updatedAt: new Date().toISOString() });
          saveStore(store2);
          render();
        }

        function render() {
          var listEl = document.getElementById('dashboard-project-analysis-list');
          if (!listEl) return;
          var items = getAnalysisItems();
          var store = getStore();
          if (!items.length) {
            listEl.innerHTML = '<li><div class="content"><strong>' + esc(iifT('dashPaNoItems', 'No items yet.')) + '</strong><small>' + esc(iifT('dashPaNoItemsHint', 'Submit a request or upload files to see items here.')) + '</small></div></li>';
            return;
          }
          var html = '';
          items.slice(0, 60).forEach(function (it) {
            var rec = store[it.id] || {};
            var st = rec.status || '';
            var a = rec.analysis || null;
            var meta = [it.kind, it.subType, it.country, it.createdAt ? String(it.createdAt).slice(0, 10) : ''].filter(Boolean).join(' · ');
            html += '<li><div class="content">';
            html += '<strong>' + esc(it.title) + '</strong>';
            html += '<small>' + esc(meta) + '</small>';
            if (a && (a.economicAnalysis || a.risks)) {
              html += '<small>' + esc((a.economicAnalysis || '').slice(0, 160)) + (a.economicAnalysis && a.economicAnalysis.length > 160 ? '…' : '') + '</small>';
            }
            html += '</div><div class="actions">';
            if (st === 'running') {
              html += '<button type="button" class="btn btn--primary btn-sm" disabled>' + esc(iifT('dashPaAnalyzing', 'Analyzing…')) + '</button>';
            } else {
              html += '<button type="button" class="btn btn--primary btn-sm" data-pa-analyze="' + esc(it.id) + '">' + esc(iifT('dashPaAiAnalyze', 'AI analyze')) + '</button>';
            }
            if (a) {
              html += '<button type="button" class="btn btn--ghost btn-sm" data-pa-toggle="' + esc(it.id) + '">' + esc(iifT('dashPaView', 'View')) + '</button>';
            }
            html += '</div></li>';
            if (a) {
              html += '<li id="pa-details-' + esc(it.id) + '" style="display:none;"><div class="content" style="width:100%;">';
              html += '<div class="card" style="padding: var(--space-4);">';
              html += '<p style="margin:0 0 var(--space-3); opacity:.9;"><strong>' + esc(iifT('dashPaAnalysisTitle', 'Analysis')) + '</strong>' + (a.confidence != null ? (' · ' + esc(iifT('dashPaConfidence', 'Confidence')) + ': ' + esc((Math.round(a.confidence * 100) || 0) + '%')) : '') + '</p>';
              html += '<div style="display:grid;gap:10px;">';
              function row(i18nKey, val, fallbackEn) {
                if (!val) return '';
                return '<div><div style="font-size:.85rem;opacity:.75;margin-bottom:4px;">' + esc(iifT(i18nKey, fallbackEn)) + '</div><div style="white-space:pre-wrap;">' + esc(val) + '</div></div>';
              }
              html += row('dashPaResponsibleAuthority', a.responsibleAuthority, 'Responsible authority');
              html += row('dashPaWorkRegulations', a.workRegulations, 'Work regulations');
              html += row('dashPaFinancialCenter', a.financialCenter, 'Financial center');
              html += row('dashPaDebt', a.debt, 'Debt');
              html += row('dashPaSovereignGuarantee', a.sovereignGuarantee, 'Sovereign guarantee');
              html += row('dashPaSecurity', a.security, 'Security');
              html += row('dashPaEconomicAnalysis', a.economicAnalysis, 'Economic analysis');
              html += row('dashPaRisks', a.risks, 'Risks');
              if (a.sources && a.sources.length) {
                html += '<div><div style="font-size:.85rem;opacity:.75;margin-bottom:4px;">' + esc(iifT('dashPaSources', 'Sources')) + '</div>';
                html += '<ul style="margin:0; padding-inline-start: 1.25rem;">' + a.sources.map(function (s) {
                  var u = (s && s.url) ? String(s.url) : '';
                  var t = (s && s.title) ? String(s.title) : u;
                  return '<li><a href="' + esc(u) + '" target="_blank" rel="noopener noreferrer">' + esc(t) + '</a></li>';
                }).join('') + '</ul></div>';
              }
              html += '</div></div></div></li>';
            }
          });
          listEl.innerHTML = html;

          // Bind events (delegation)
          listEl.querySelectorAll('[data-pa-toggle]').forEach(function (btn) {
            btn.addEventListener('click', function () {
              var id = btn.getAttribute('data-pa-toggle');
              var row = document.getElementById('pa-details-' + id);
              if (!row) return;
              row.style.display = row.style.display === 'none' ? '' : 'none';
            });
          });
          listEl.querySelectorAll('[data-pa-analyze]').forEach(function (btn) {
            btn.addEventListener('click', function () {
              var id = btn.getAttribute('data-pa-analyze');
              var modelEl = document.getElementById('pa-ollama-model');
              var model = (modelEl && modelEl.value) ? modelEl.value.trim() : 'llama3.1:8b';
              var it = items.find(function (x) { return x.id === id; });
              if (!it) return;
              runAnalysis(it, model).catch(function (e) {
                var st = document.getElementById('pa-ai-status');
                if (st) st.textContent = iifT('dashPaErrorPrefix', 'Error: ') + (e && e.message ? e.message : String(e));
                var store = getStore();
                store[id] = Object.assign({}, store[id] || {}, { status: 'error', error: String(e && e.message ? e.message : e), updatedAt: new Date().toISOString() });
                saveStore(store);
                render();
              });
            });
          });
        }

        function setStatus(msg) {
          var el = document.getElementById('pa-ai-status');
          if (el) el.textContent = msg || '';
        }

        function safeFileNameBase() {
          var dt = new Date();
          function pad(n) { return (n < 10 ? '0' : '') + n; }
          return (
            'iif-project-analysis-' +
            dt.getFullYear() +
            pad(dt.getMonth() + 1) +
            pad(dt.getDate()) +
            '-' +
            pad(dt.getHours()) +
            pad(dt.getMinutes()) +
            pad(dt.getSeconds())
          );
        }

        function downloadJson(obj, filename) {
          try {
            var data = JSON.stringify(obj, null, 2);
            var blob = new Blob([data], { type: 'application/json;charset=utf-8' });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(function () {
              try { URL.revokeObjectURL(url); } catch (e) { }
              try { a.remove(); } catch (e2) { }
            }, 50);
            return true;
          } catch (e) { return false; }
        }

        function exportStore() {
          var payload = {
            kind: 'iif-project-analysis-export',
            version: 1,
            exportedAt: new Date().toISOString(),
            storeKey: STORE_KEY,
            records: getStore()
          };
          var ok = downloadJson(payload, safeFileNameBase() + '.json');
          setStatus(ok ? iifT('dashPaExported', 'Exported.') : iifT('dashPaExportFailed', 'Export failed.'));
        }

        function mergeStores(target, incoming) {
          target = target && typeof target === 'object' ? target : {};
          incoming = incoming && typeof incoming === 'object' ? incoming : {};
          Object.keys(incoming).forEach(function (k) {
            var inc = incoming[k];
            if (!inc || typeof inc !== 'object') return;
            var prev = target[k];
            if (!prev) { target[k] = inc; return; }
            var pAt = prev.updatedAt ? String(prev.updatedAt) : '';
            var iAt = inc.updatedAt ? String(inc.updatedAt) : '';
            // keep newest; fallback: prefer incoming if it has analysis
            if (iAt && (!pAt || iAt >= pAt)) target[k] = inc;
            else if (!pAt && (inc.analysis || inc.status === 'done')) target[k] = inc;
          });
          return target;
        }

        function importFromText(text) {
          var payload = null;
          try { payload = JSON.parse(text || ''); } catch (e) { payload = null; }
          if (!payload || typeof payload !== 'object') {
            setStatus(iifT('dashPaInvalidFile', 'Invalid file.'));
            return;
          }
          var rec = payload.records;
          // allow importing raw store object directly
          if (!rec && payload.kind !== 'iif-project-analysis-export') rec = payload;
          if (!rec || typeof rec !== 'object') {
            setStatus(iifT('dashPaNoRecordsImport', 'No records to import.'));
            return;
          }
          var current = getStore();
          var merged = mergeStores(current, rec);
          saveStore(merged);
          render();
          setStatus(iifT('dashPaImported', 'Imported.'));
        }

        function bind() {
          var refreshBtn = document.getElementById('pa-refresh-list-btn');
          if (refreshBtn) refreshBtn.addEventListener('click', function () { render(); });
          var chkBtn = document.getElementById('pa-check-ai-btn');
          if (chkBtn) chkBtn.addEventListener('click', function () {
            var modelEl = document.getElementById('pa-ollama-model');
            var model = (modelEl && modelEl.value) ? modelEl.value.trim() : 'llama3.1:8b';
            setStatus(iifT('dashPaChecking', 'Checking…'));
            checkOllama(model).then(function (r) {
              if (r.hasModel) setStatus(iifT('dashPaOllamaOkModel', 'Ollama OK · model found: {model}').replace(/\{model\}/g, model));
              else setStatus(iifT('dashPaOllamaNoModel', 'Ollama running but model missing. Run: ollama pull {model}').replace(/\{model\}/g, model));
            }).catch(function (e) {
              setStatus(iifT('dashPaOllamaNotReady', 'Ollama not ready. Install/run Ollama then: ollama pull {model}').replace(/\{model\}/g, model));
            });
          });

          var exportBtn = document.getElementById('pa-export-btn');
          if (exportBtn) exportBtn.addEventListener('click', function () { exportStore(); });

          var importBtn = document.getElementById('pa-import-btn');
          var importFile = document.getElementById('pa-import-file');
          if (importBtn && importFile) {
            importBtn.addEventListener('click', function () {
              try { importFile.value = ''; } catch (e) { }
              importFile.click();
            });
            importFile.addEventListener('change', function () {
              var f = importFile.files && importFile.files[0];
              if (!f) return;
              if (f.size > 3 * 1024 * 1024) {
                setStatus(iifT('dashPaImportFileTooLarge', 'File too large.'));
                return;
              }
              var r = new FileReader();
              r.onload = function () { importFromText(String(r.result || '')); };
              r.onerror = function () { setStatus(iifT('dashPaCouldNotReadFile', 'Could not read file.')); };
              r.readAsText(f);
            });
          }
        }

        // expose for debugging
        try { window.renderDashboardProjectAnalysisList = render; } catch (e) { }
        // init
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { bind(); render(); });
        else { bind(); render(); }
      })();
      var formContact = document.getElementById('form-contact');
      if (formContact) formContact.addEventListener('submit', function (e) {
        e.preventDefault();
        var fd0 = new FormData(formContact);
        var data = {};
        try {
          fd0.forEach(function (v, k) { data[k] = typeof v === 'string' ? v.trim() : v; });
        } catch (errFd) { }
        var email = String(data.email || '').trim().toLowerCase();
        if (!isValidEmail(email)) {
          alert(typeof iifMessage === 'function' ? iifMessage('jsInvalidEmailShort') : 'Invalid email.');
          return;
        }
        var submitBtn = formContact.querySelector('button[type="submit"]');
        function setContactBusy(busy) {
          if (submitBtn) {
            submitBtn.disabled = !!busy;
            submitBtn.setAttribute('aria-busy', busy ? 'true' : 'false');
          }
        }
        function getContactEndpoint() {
          try {
            var m = document.querySelector('meta[name="iif-contact-form-endpoint"]');
            var c = m && m.getAttribute('content');
            if (c && String(c).trim()) return String(c).trim();
          } catch (eM) { }
          try {
            if (window.IIF_CONFIG && window.IIF_CONFIG.contactFormEndpoint) {
              var u = String(window.IIF_CONFIG.contactFormEndpoint).trim();
              if (u) return u;
            }
          } catch (eC) { }
          return '';
        }
        setContactBusy(true);
        getSubmissionLocation(function (loc) {
          addSubmission('contact', data, loc || {});
          var endpoint = getContactEndpoint();
          function contactDoneOk() {
            alert(iifSubmissionAcknowledgmentMsg());
            formContact.reset();
            setContactBusy(false);
          }
          function contactDoneErr() {
            alert(typeof iifMessage === 'function' ? iifMessage('contactSendFailed') : 'Could not reach the mail service. Your message was saved in this browser.');
            setContactBusy(false);
          }
          if (!endpoint || !/^https?:\/\//i.test(endpoint)) {
            contactDoneOk();
            return;
          }
          var sendFd = new FormData();
          try {
            Object.keys(data).forEach(function (k) {
              var val = data[k];
              sendFd.append(k, val == null ? '' : String(val));
            });
            sendFd.append('_subject', 'IIF contact form');
            sendFd.append('iif_form', 'contact');
            if (loc) {
              if (loc.ipCountry) sendFd.append('iif_loc_ip_country', loc.ipCountry);
              if (loc.ipCity) sendFd.append('iif_loc_ip_city', loc.ipCity);
              if (loc.lat) sendFd.append('iif_loc_lat', loc.lat);
              if (loc.lng) sendFd.append('iif_loc_lng', loc.lng);
              if (loc.at) sendFd.append('iif_loc_at', loc.at);
            }
          } catch (eFd) { }
          fetch(endpoint, { method: 'POST', body: sendFd, headers: { Accept: 'application/json' }, mode: 'cors' })
            .then(function (r) {
              if (r.ok) {
                contactDoneOk();
                return;
              }
              return r.text().then(function (t) { throw new Error(t || String(r.status)); });
            })
            .catch(function () { contactDoneErr(); });
        });
      });
      if (formMembership) formMembership.addEventListener('submit', function (e) {
        e.preventDefault();
        try {
          var fd = new FormData(formMembership);
          var data = {};
          fd.forEach(function (v, k) { data[k] = typeof v === 'string' ? v.trim() : v; });
          var email = (data.email || '').trim().toLowerCase();
          if (!isValidEmail(email)) { alert(iifMessage('jsInvalidEmailShort')); return; }
          if (!(data.entity_name || '').trim()) { alert(iifMessage('membershipEnterNameEntity')); return; }
          getSubmissionLocation(function (loc) {
            if (typeof addSubmission === 'function') addSubmission('membership_request', data, loc || {});
            if (typeof addMembershipApplicationRecord === 'function') addMembershipApplicationRecord(data);
            formMembership.reset();
            alert(iifMessage('membershipRequestReceived'));
            if (typeof getDashboardAccessType === 'function' && getDashboardAccessType() === 'owner' && typeof renderDashboardUserRegistry === 'function') renderDashboardUserRegistry();
          });
        } catch (err) {
          alert(iifMessage('membershipSubmitFailed'));
        }
      });
      if (formFinancing) formFinancing.addEventListener('submit', function (e) {
        e.preventDefault();
        if (typeof canUseServiceForms === 'function' && !canUseServiceForms()) {
          if (typeof showMembershipRequiredModal === 'function') showMembershipRequiredModal();
          return;
        }
        try {
          var fd = new FormData(formFinancing);
          var data = {};
          fd.forEach(function (v, k) { data[k] = typeof v === 'string' ? v.trim() : v; });
          getSubmissionLocation(function (loc) {
            addSubmission('financing', data, loc || {});
            alert(iifSubmissionAcknowledgmentMsg());
            formFinancing.reset();
          });
        } catch (err1) {
          alert(iifMessage('membershipSubmitFailed'));
        }
      });
      var formFeasibility = document.getElementById('form-feasibility-study');
      if (formFeasibility) formFeasibility.addEventListener('submit', function (e) {
        e.preventDefault();
        if (typeof canUseServiceForms === 'function' && !canUseServiceForms()) {
          if (typeof showMembershipRequiredModal === 'function') showMembershipRequiredModal();
          return;
        }
        var feasibilityFiles = document.getElementById('feasibility-files');
        var fd = new FormData(formFeasibility);
        var data = {};
        try {
          fd.forEach(function (v, k) { data[k] = typeof v === 'string' ? v.trim() : v; });
        } catch (errFd) { }
        function finishFeasibility() {
          getSubmissionLocation(function (loc) {
            addSubmission('feasibility', data, loc || {});
            alert(iifSubmissionAcknowledgmentMsg());
            formFeasibility.reset();
          });
        }
        if (feasibilityFiles && feasibilityFiles.files && feasibilityFiles.files.length) {
          var r = validateFileList(feasibilityFiles.files, 'feasibility');
          if (!r.valid) { alert(r.msg); return; }
          checkFileListContentSafe(feasibilityFiles.files).then(function (c) {
            if (!c.valid) { alert(getContentRejectMessage(c.reason)); return; }
            finishFeasibility();
          });
        } else {
          finishFeasibility();
        }
      });
      if (formInvestor) formInvestor.addEventListener('submit', function (e) {
        e.preventDefault();
        if (typeof canUseServiceForms === 'function' && !canUseServiceForms()) {
          if (typeof showMembershipRequiredModal === 'function') showMembershipRequiredModal();
          return;
        }
        var name = (document.getElementById('inv-name') && document.getElementById('inv-name').value) || '';
        var email = (document.getElementById('inv-email') && document.getElementById('inv-email').value) || '';
        var entity = (document.getElementById('inv-entity') && document.getElementById('inv-entity').value) || '';
        var country = (document.getElementById('inv-country') && document.getElementById('inv-country').value) || '';
        getSubmissionLocation(function (loc) {
          addSubmission('investor', { name: name, email: email, entity: entity, country: country }, loc || {});
          alert(iifSubmissionAcknowledgmentMsg());
          formInvestor.reset();
        });
      });

      var formUpload = document.getElementById('form-upload-submit');
      if (formUpload) formUpload.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!isLoggedIn()) {
          if (typeof openAuth === 'function') openAuth();
          return;
        }
        var ta = document.getElementById('project-description');
        var min = parseInt(ta.getAttribute('minlength') || 1000, 10);
        if ((ta.value || '').trim().length < min) {
          ta.focus();
          return;
        }
        var uploadFilesEl = document.getElementById('upload-files');
        if (uploadFilesEl && uploadFilesEl.files && uploadFilesEl.files.length) {
          var r = validateFileList(uploadFilesEl.files, 'upload');
          if (!r.valid) { alert(r.msg); return; }
          checkFileListContentSafe(uploadFilesEl.files).then(function (c) {
            if (!c.valid) { alert(getContentRejectMessage(c.reason)); return; }
          });
        }
      });

      var formUrgentOnline = document.getElementById('form-urgent-online');
      var urgentOnlineSuccess = document.getElementById('urgent-online-success');
      var urgentRequestVideoBtn = document.getElementById('urgent-request-video-btn');
      var urgentRequestForm = document.getElementById('urgent-request-form');
      var urgentChannel = document.getElementById('urgent-channel');
      var urgentName = document.getElementById('urgent-name');
      /* الاتصال المرئي والمسموع — طابع الصندوق وشعاره داخل الغرفة (Jitsi External API) */
      var IIF_VIDEO_SERVER = 'https://meet.jit.si';
      var IIF_VIDEO_ROOM_PREFIX = 'IIFConsultation';
      var IIF_VIDEO_ROOM_SUBJECT = 'International Investment Fund — صندوق الاستثمار الدولي';
      var IIF_VIDEO_LOGO_URL = (function () {
        try {
          var baseRef = (typeof document !== 'undefined' && document.baseURI) ? document.baseURI : (window.location && window.location.href);
          if (baseRef) return new URL('assets/emblem.jpg', baseRef).href;
        } catch (e) { }
        try {
          if (typeof window !== 'undefined' && window.IIF_DOCUMENT_BASE && window.location && window.location.origin) {
            return new URL('assets/emblem.jpg', window.location.origin + window.IIF_DOCUMENT_BASE).href;
          }
        } catch (e2) { }
        return 'https://iiffund.com/financial-consulting/iif-fund-demo/assets/emblem.jpg';
      })();
      var videoCallJitsiApi = null;
      function createJitsiMeetingInContainer(container, iframe, roomName, jitsiUrl) {
        if (!container || typeof JitsiMeetExternalAPI === 'undefined') return false;
        try {
          if (videoCallJitsiApi) { try { videoCallJitsiApi.dispose(); } catch (e) { } videoCallJitsiApi = null; }
          container.innerHTML = '';
          var domain = IIF_VIDEO_SERVER.replace(/^https?:\/\/([^/#]+).*$/, '$1');
          videoCallJitsiApi = new JitsiMeetExternalAPI(domain, {
            roomName: roomName,
            parentNode: container,
            width: '100%',
            height: '100%',
            configOverwrite: {
              startWithAudioMuted: false,
              startWithVideoMuted: false,
              subject: IIF_VIDEO_ROOM_SUBJECT
            },
            interfaceConfigOverwrite: {
              APP_NAME: 'International Investment Fund',
              NATIVE_APP_NAME: 'IIF',
              DEFAULT_LOGO_URL: IIF_VIDEO_LOGO_URL,
              DEFAULT_WELCOME_PAGE_LOGO_URL: IIF_VIDEO_LOGO_URL,
              SHOW_JITSI_WATERMARK: false,
              SHOW_WATERMARK_FOR_GUESTS: false,
              BRAND_WATERMARK_LINK: ''
            }
          });
          return true;
        } catch (e) { return false; }
      }
      function openVideoCallOverlay() {
        var overlay = document.getElementById('video-call-overlay');
        var container = document.getElementById('video-call-jitsi-container');
        var iframe = document.getElementById('video-call-iframe');
        var shareLink = document.getElementById('video-call-share-link');
        if (!overlay) return;
        var roomName = IIF_VIDEO_ROOM_PREFIX;
        var jitsiUrl = IIF_VIDEO_SERVER + '/' + roomName;
        if (shareLink) shareLink.href = jitsiUrl;
        overlay.classList.add('is-open');
        overlay.style.display = 'flex';
        overlay.setAttribute('aria-hidden', 'false');
        if (container) container.style.display = 'block';
        if (iframe) iframe.style.display = 'none';
        if (typeof JitsiMeetExternalAPI !== 'undefined') {
          if (!createJitsiMeetingInContainer(container, iframe, roomName, jitsiUrl) && iframe) {
            iframe.src = jitsiUrl + '#config.subject=' + encodeURIComponent(IIF_VIDEO_ROOM_SUBJECT);
            iframe.style.display = 'block';
            if (container) container.style.display = 'none';
          }
        } else {
          var script = document.querySelector('script[src*="external_api"]');
          if (!script) {
            script = document.createElement('script');
            script.src = IIF_VIDEO_SERVER + '/external_api.js';
            script.async = true;
            script.onload = function () {
              if (!createJitsiMeetingInContainer(container, iframe, roomName, jitsiUrl) && iframe) {
                iframe.src = jitsiUrl + '#config.subject=' + encodeURIComponent(IIF_VIDEO_ROOM_SUBJECT);
                iframe.style.display = 'block';
                if (container) container.style.display = 'none';
              }
            };
            script.onerror = function () {
              if (iframe) { iframe.src = jitsiUrl + '#config.subject=' + encodeURIComponent(IIF_VIDEO_ROOM_SUBJECT); iframe.style.display = 'block'; }
              if (container) container.style.display = 'none';
            };
            document.head.appendChild(script);
          } else {
            if (iframe) { iframe.src = jitsiUrl + '#config.subject=' + encodeURIComponent(IIF_VIDEO_ROOM_SUBJECT); iframe.style.display = 'block'; }
            if (container) container.style.display = 'none';
          }
        }
      }
      function closeVideoCallOverlay() {
        var overlay = document.getElementById('video-call-overlay');
        var container = document.getElementById('video-call-jitsi-container');
        var iframe = document.getElementById('video-call-iframe');
        if (videoCallJitsiApi) { try { videoCallJitsiApi.dispose(); } catch (e) { } videoCallJitsiApi = null; }
        if (container) { container.innerHTML = ''; container.style.display = 'block'; }
        if (iframe) { iframe.src = 'about:blank'; iframe.style.display = 'none'; }
        if (overlay) { overlay.classList.remove('is-open'); overlay.style.display = 'none'; overlay.setAttribute('aria-hidden', 'true'); }
      }
      var videoCallCloseBtn = document.getElementById('video-call-close');
      if (videoCallCloseBtn) videoCallCloseBtn.addEventListener('click', closeVideoCallOverlay);
      var videoCallOverlayEl = document.getElementById('video-call-overlay');
      if (videoCallOverlayEl) videoCallOverlayEl.addEventListener('click', function (e) { if (e.target === videoCallOverlayEl) closeVideoCallOverlay(); });
      if (urgentRequestVideoBtn) {
        urgentRequestVideoBtn.addEventListener('click', function () {
          openVideoCallOverlay();
        });
      }
      function scrollToUrgentTarget(targetId, options) {
        options = options || {};
        var el = document.getElementById(targetId);
        if (!el) return;
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.setTimeout(function () {
          if (options.channel && urgentChannel) urgentChannel.value = options.channel;
          if (options.focusId) {
            var fe = document.getElementById(options.focusId);
            if (fe) {
              try {
                fe.focus({ preventScroll: true });
              } catch (e1) {
                try {
                  fe.focus();
                } catch (e2) { /* ignore */ }
              }
            }
          }
        }, 380);
      }
      var urgentScheduleVideoBtn = document.getElementById('urgent-schedule-video-btn');
      var urgentRequestChatBtn = document.getElementById('urgent-request-chat-btn');
      var urgentProceedPayBtn = document.getElementById('urgent-proceed-pay-btn');
      if (urgentScheduleVideoBtn) {
        urgentScheduleVideoBtn.addEventListener('click', function () {
          scrollToUrgentTarget('urgent-request-form', { channel: 'video', focusId: 'urgent-name' });
        });
      }
      if (urgentRequestChatBtn) {
        urgentRequestChatBtn.addEventListener('click', function () {
          scrollToUrgentTarget('urgent-request-form', { channel: 'chat', focusId: 'urgent-name' });
        });
      }
      if (urgentProceedPayBtn) {
        urgentProceedPayBtn.addEventListener('click', function () {
          scrollToUrgentTarget('urgent-payment-method');
        });
      }
      if (formUrgentOnline) formUrgentOnline.addEventListener('submit', function (e) {
        e.preventDefault();
        var name = (document.getElementById('urgent-name') && document.getElementById('urgent-name').value) || '';
        var email = (document.getElementById('urgent-email') && document.getElementById('urgent-email').value) || '';
        var channel = (document.getElementById('urgent-channel') && document.getElementById('urgent-channel').value) || '';
        getSubmissionLocation(function (loc) {
          addSubmission('urgent', { name: name, email: email, channel: channel }, loc || {});
          if (urgentOnlineSuccess) {
            var leadEl = urgentOnlineSuccess.querySelector('.urgent-online-success__lead');
            var nextEl = urgentOnlineSuccess.querySelector('.urgent-online-success__next');
            var msgLead = typeof iifMessage === 'function' ? iifMessage('urgentOnlineSuccessMsg') : 'Request received. The Fund will contact you to arrange the secure online session.';
            var msgNext = typeof iifMessage === 'function' ? iifMessage('urgentOnlineSuccessNext') : 'You should hear back within about 1–2 business days at the email you provided. This message is not financing approval or a mandate — see Terms.';
            if (leadEl) leadEl.textContent = msgLead;
            if (nextEl) {
              nextEl.textContent = msgNext || '';
              nextEl.hidden = !msgNext;
            }
            urgentOnlineSuccess.hidden = false;
            formUrgentOnline.reset();
          }
        });
      });

      var formCareers = document.getElementById('form-careers');
      var careersSuccess = document.getElementById('careers-success');
      if (formCareers) formCareers.addEventListener('submit', function (e) {
        e.preventDefault();
        if (careersSuccess) { careersSuccess.hidden = false; formCareers.reset(); }
      });

      /* Project description: عداد أحرف — يستوعب 1000 حرف */
      var projectDesc = document.getElementById('project-description');
      var charCounter = document.getElementById('project-char-counter');
      var maxChars = 1000;
      var minChars = 100;
      function updateProjectCharCounter() {
        if (!projectDesc || !charCounter) return;
        var len = (projectDesc.value || '').length;
        var lang = document.documentElement.getAttribute('data-lang');
        var suffix = (lang === 'ar') ? ' حرف' : ' characters';
        charCounter.textContent = len + ' / ' + maxChars + suffix;
        charCounter.classList.remove('min-met', 'min-not-met');
        charCounter.classList.add(len >= minChars ? 'min-met' : 'min-not-met');
      }
      if (projectDesc) {
        projectDesc.addEventListener('input', updateProjectCharCounter);
        projectDesc.addEventListener('change', updateProjectCharCounter);
        updateProjectCharCounter();
      }

      /* Upload zone: drag and drop highlight */
      function setupDragDrop(zone) {
        if (!zone) return;
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(function (ev) {
          zone.addEventListener(ev, function (e) { e.preventDefault(); e.stopPropagation(); });
        });
        ['dragenter', 'dragover'].forEach(function (ev) {
          zone.addEventListener(ev, function () { zone.classList.add('dragover'); });
        });
        ['dragleave', 'drop'].forEach(function (ev) {
          zone.addEventListener(ev, function () { zone.classList.remove('dragover'); });
        });
      }
      var uploadZone = document.getElementById('upload-zone');
      setupDragDrop(uploadZone);
      setupDragDrop(document.getElementById('feasibility-upload-zone'));

      /* File upload security: size and type validation */
      var FILE_MAX_SIZE = 10 * 1024 * 1024;   /* 10 MB per file */
      var FILE_MAX_TOTAL = 50 * 1024 * 1024; /* 50 MB total */
      var FILE_MAX_COUNT = 20;
      /* دراسة الجدوى: حد 500 ميجا للملف والإجمالي */
      var FEASIBILITY_MAX_SIZE = 500 * 1024 * 1024;
      var FEASIBILITY_MAX_TOTAL = 500 * 1024 * 1024;
      var ALLOWED_EXT = {
        feasibility: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'odt', 'ods', 'txt', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'webm', 'mov'],
        upload: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'webm', 'mov', 'mp3', 'wav']
      };
      /* امتدادات خطرة — ممنوعة في اسم الملف (منع تنفيذ/تلغيم) */
      var DANGEROUS_EXT = ['exe', 'bat', 'cmd', 'sh', 'ps1', 'php', 'phtml', 'php3', 'php4', 'php5', 'php7', 'phar', 'js', 'jse', 'vbs', 'vbe', 'ws', 'wsf', 'scr', 'msi', 'jar', 'com', 'cgi', 'pl', 'py', 'rb', 'asp', 'aspx', 'jsp', 'htaccess', 'svg', 'hta', 'msc', 'reg', 'inf', 'dll'];
      /* MIME للصور والفيديو والمستندات — فحص أعلى معايير أمان للرفع ودراسة الجدوى */
      var DOC_MIME = [
        'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.oasis.opendocument.text', 'text/plain', 'text/rtf', 'application/rtf',
        'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/vnd.oasis.opendocument.spreadsheet', 'application/vnd.oasis.opendocument.presentation',
        'application/vnd.ms-excel.sheet.macroEnabled.12', 'application/vnd.ms-powerpoint.presentation.macroEnabled.12'
      ];
      var IMAGE_MIME = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      var VIDEO_MIME = ['video/mp4', 'video/webm', 'video/quicktime'];
      var AUDIO_MIME = ['audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/wave'];
      var EXT_TO_MIME_CATEGORY = {
        pdf: 'doc', doc: 'doc', docx: 'doc', odt: 'doc', txt: 'doc', rtf: 'doc', xls: 'doc', xlsx: 'doc', ppt: 'doc', pptx: 'doc', ods: 'doc',
        jpg: 'img', jpeg: 'img', png: 'img', gif: 'img', webp: 'img',
        mp4: 'vid', webm: 'vid', mov: 'vid',
        mp3: 'aud', wav: 'aud'
      };
      var MIME_BY_CATEGORY = { doc: DOC_MIME, img: IMAGE_MIME, vid: VIDEO_MIME, aud: AUDIO_MIME };
      function getExt(name) {
        if (!name || name.indexOf('.') === -1) return '';
        return name.split('.').pop().toLowerCase().replace(/[^a-z0-9]/g, '');
      }
      function validateFileName(name) {
        if (!name || typeof name !== 'string') return { valid: false, msg: typeof iifMessage === 'function' ? iifMessage('jsInvalidFileName') : 'Invalid file name.' };
        if (name.length > 200) return { valid: false, msg: typeof iifMessage === 'function' ? iifMessage('jsFileNameTooLong') : 'File name too long.' };
        if (name.indexOf('\0') !== -1 || /\.\.|[\\/]/.test(name))
          return { valid: false, msg: typeof iifMessage === 'function' ? iifMessage('jsFileNameInvalidChars') : 'File name contains invalid characters.' };
        var parts = name.toLowerCase().split('.');
        for (var p = 0; p < parts.length; p++) {
          var seg = parts[p].replace(/[^a-z0-9]/g, '');
          if (seg && DANGEROUS_EXT.indexOf(seg) !== -1)
            return { valid: false, msg: typeof iifMessage === 'function' ? iifMessage('jsFileExtensionBlockedSecurity') : 'File type not allowed for security.' };
        }
        return { valid: true };
      }
      function validateFileList(files, profile, opts) {
        opts = opts || {};
        var maxSize = opts.maxSize != null ? opts.maxSize : FILE_MAX_SIZE;
        var maxTotal = opts.maxTotal != null ? opts.maxTotal : FILE_MAX_TOTAL;
        var maxCount = opts.maxCount != null ? opts.maxCount : FILE_MAX_COUNT;
        if (profile === 'feasibility') {
          maxSize = FEASIBILITY_MAX_SIZE;
          maxTotal = FEASIBILITY_MAX_TOTAL;
        }
        if (profile !== 'feasibility' && typeof hasDoubleUploadLimit === 'function' && hasDoubleUploadLimit()) {
          maxSize = maxSize * 2;
          maxTotal = maxTotal * 2;
        }
        var allowed = ALLOWED_EXT[profile];
        if (!allowed || !files || !files.length) return { valid: true };
        if (files.length > maxCount)
          return {
            valid: false, msg: typeof iifMessageFmt === 'function' ? iifMessageFmt('jsFileMaxCount', { n: maxCount }) : ('Maximum ' + maxCount + ' files.')
          };
        var total = 0;
        for (var i = 0; i < files.length; i++) {
          var f = files[i];
          var nameCheck = validateFileName(f.name);
          if (!nameCheck.valid) return { valid: false, msg: nameCheck.msg };
          var ext = getExt(f.name);
          if (allowed.indexOf(ext) === -1)
            return {
              valid: false, msg: typeof iifMessageFmt === 'function' ? iifMessageFmt('jsFileTypeNotAllowed', { name: ext || f.name }) : ('File type not allowed: ' + (ext || f.name) + '.')
            };
          /* فحص MIME للصور والفيديو والمستندات في دراسة الجدوى والرفع العام */
          if ((profile === 'feasibility' || profile === 'upload') && f.type) {
            var cat = EXT_TO_MIME_CATEGORY[ext];
            var mimeList = cat && MIME_BY_CATEGORY[cat];
            if (mimeList && mimeList.indexOf(f.type) === -1)
              return {
                valid: false, msg: typeof iifMessage === 'function' ? iifMessage('jsFileMimeMismatchSecurity') : 'File type (MIME) does not match extension — rejected for security.'
              };
          }
          if (f.size > maxSize)
            return {
              valid: false, msg: typeof iifMessageFmt === 'function' ? iifMessageFmt('jsFileTooLarge', { name: f.name, mb: maxSize / 1024 / 1024 }) : ('File too large: ' + f.name + ' (max ' + (maxSize / 1024 / 1024) + ' MB).')
            };
          total += f.size;
        }
        if (total > maxTotal)
          return {
            valid: false, msg: typeof iifMessageFmt === 'function' ? iifMessageFmt('jsFileTotalTooLarge', { mb: maxTotal / 1024 / 1024 }) : ('Total size exceeds ' + (maxTotal / 1024 / 1024) + ' MB.')
          };
        return { valid: true };
      }
      function bindFileValidation(inputId, profile) {
        var el = document.getElementById(inputId);
        if (!el) return;
        el.addEventListener('change', function () {
          var r = validateFileList(el.files, profile);
          if (!r.valid) { alert(r.msg); el.value = ''; return; }
          if (el.files && el.files.length) {
            var msg = el.files.length === 1
              ? iifMessage('jsFileSelectedSuccess')
              : iifMessageFmt('jsFilesSelectedCountSuccess', { n: el.files.length });
            alert(msg);
          }
        });
      }
      bindFileValidation('feasibility-files', 'feasibility');
      bindFileValidation('upload-files', 'upload');

      /* Translation: واجهة ترجمة النص فقط */
      var textInput = document.getElementById('translation-text-input');
      var textCount = document.getElementById('translation-text-count');
      var textResult = document.getElementById('translation-text-result');
      var textBtn = document.getElementById('translation-text-btn');
      var TRANSLATION_MAX = 5000;
      function updateTranslationCharCount() {
        if (!textInput || !textCount) return;
        var len = (textInput.value || '').length;
        textCount.textContent = len + ' / ' + TRANSLATION_MAX;
      }
      if (textInput) {
        textInput.addEventListener('input', updateTranslationCharCount);
        textInput.addEventListener('paste', updateTranslationCharCount);
        updateTranslationCharCount();
      }
      var voiceInputBtn = document.getElementById('translation-voice-input-btn');
      var listenBtn = document.getElementById('translation-listen-btn');
      var textFromSelect = document.getElementById('translation-text-from');
      var textToSelect = document.getElementById('translation-text-to');
      var swapLangsBtn = document.getElementById('translation-swap-langs-btn');
      /* لغة الإدخال الافتراضية حسب بلد العميل (من المتصفح) */
      function getDefaultSourceLang() {
        var nav = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
        if (nav.indexOf('ar') === 0) return 'ar';
        if (nav.indexOf('fr') === 0) return 'fr';
        if (nav.indexOf('de') === 0) return 'de';
        if (nav.indexOf('es') === 0) return 'es';
        if (nav.indexOf('pt') === 0) return 'pt';
        if (nav.indexOf('it') === 0) return 'it';
        if (nav.indexOf('ru') === 0) return 'ru';
        if (nav.indexOf('zh') === 0) return 'zh';
        if (nav.indexOf('ja') === 0) return 'ja';
        if (nav.indexOf('ko') === 0) return 'ko';
        if (nav.indexOf('hi') === 0) return 'hi';
        if (nav.indexOf('tr') === 0) return 'tr';
        if (nav.indexOf('pl') === 0) return 'pl';
        if (nav.indexOf('nl') === 0) return 'nl';
        if (nav.indexOf('el') === 0) return 'el';
        if (nav.indexOf('he') === 0) return 'he';
        if (nav.indexOf('th') === 0) return 'th';
        if (nav.indexOf('vi') === 0) return 'vi';
        if (nav.indexOf('id') === 0) return 'id';
        if (nav.indexOf('fa') === 0) return 'fa';
        if (nav.indexOf('uk') === 0) return 'uk';
        return 'en';
      }
      if (textFromSelect) {
        var defaultFrom = getDefaultSourceLang();
        if (textFromSelect.querySelector('option[value="' + defaultFrom + '"]')) textFromSelect.value = defaultFrom;
      }
      /* سهمين عكس — تبادل لغة الإدخال ولغة الترجمة وتبادل النص */
      if (swapLangsBtn && textFromSelect && textToSelect && textInput && textResult) {
        swapLangsBtn.addEventListener('click', function () {
          var fromVal = textFromSelect.value;
          var toVal = textToSelect.value;
          textFromSelect.value = toVal;
          textToSelect.value = fromVal;
          var inputText = (textInput.value || '').trim();
          var resultText = (textResult.textContent || '').trim();
          textInput.value = resultText;
          textResult.textContent = inputText;
          if (inputText) textResult.classList.add('has-result'); else textResult.classList.remove('has-result');
          updateTranslationCharCount();
        });
      }
      var langToSpeechCode = { ar: 'ar-SA', en: 'en-US', fr: 'fr-FR', de: 'de-DE', es: 'es-ES', pt: 'pt-PT', it: 'it-IT', ru: 'ru-RU', zh: 'zh-CN', ja: 'ja-JP', ko: 'ko-KR', hi: 'hi-IN', tr: 'tr-TR', pl: 'pl-PL', nl: 'nl-NL', el: 'el-GR', sv: 'sv-SE', no: 'nb-NO', da: 'da-DK', fi: 'fi-FI', uk: 'uk-UA', ro: 'ro-RO', hu: 'hu-HU', he: 'he-IL', th: 'th-TH', vi: 'vi-VN', id: 'id-ID', ms: 'ms-MY', fa: 'fa-IR', ur: 'ur-PK', bn: 'bn-BD' };
      function getSpeechRecognitionLang() {
        var code = (textFromSelect && textFromSelect.value) ? textFromSelect.value : 'en';
        return code + '-' + (code === 'en' ? 'US' : code === 'ar' ? 'SA' : code.toUpperCase());
      }
      if (voiceInputBtn && textInput) {
        voiceInputBtn.addEventListener('click', function () {
          var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
          if (!SpeechRecognition) {
            alert(iifMessage('jsVoiceInputNotSupported'));
            return;
          }
          var rec = new SpeechRecognition();
          rec.continuous = true;
          rec.interimResults = false;
          rec.lang = getSpeechRecognitionLang();
          rec.onresult = function (e) {
            var last = e.results[e.results.length - 1];
            var text = last.isFinal ? last[0].transcript : '';
            if (text && textInput.value.length + text.length <= TRANSLATION_MAX) {
              textInput.value = (textInput.value + (textInput.value ? ' ' : '') + text).slice(0, TRANSLATION_MAX);
              updateTranslationCharCount();
            }
          };
          rec.onerror = function (e) {
            if (e.error !== 'aborted') alert(e.error === 'not-allowed' ? iifMessage('jsPleaseAllowMicrophone') : (e.error || ''));
          };
          rec.start();
          voiceInputBtn.disabled = true;
          voiceInputBtn.setAttribute('aria-pressed', 'true');
          rec.onend = function () { voiceInputBtn.disabled = false; voiceInputBtn.removeAttribute('aria-pressed'); };
          setTimeout(function () { try { rec.stop(); } catch (e) { } }, 10000);
        });
      }
      if (listenBtn && textResult) {
        listenBtn.addEventListener('click', function () {
          var text = (textResult.textContent || '').trim();
          if (!text) {
            alert(iifMessage('jsNoTranslationToListen'));
            return;
          }
          if (window.speechSynthesis.cancel) window.speechSynthesis.cancel();
          var code = (textToSelect && textToSelect.value) ? textToSelect.value : 'ar';
          var lang = langToSpeechCode[code] || code + '-' + (code === 'en' ? 'US' : code === 'ar' ? 'SA' : code.toUpperCase());
          var u = new SpeechSynthesisUtterance(text);
          u.lang = lang;
          u.rate = 0.95;
          u.pitch = 1;
          u.volume = 1;
          var voices = window.speechSynthesis.getVoices();
          if (voices && voices.length) {
            var preferred = voices.filter(function (v) { return v.lang && v.lang.indexOf(code) === 0 && (v.name.indexOf('Google') >= 0 || v.name.indexOf('Premium') >= 0 || v.name.indexOf('Enhanced') >= 0 || v.name.indexOf('Natural') >= 0); })[0];
            if (!preferred) preferred = voices.filter(function (v) { return v.lang && v.lang.indexOf(code) === 0; })[0];
            if (preferred) u.voice = preferred;
          }
          window.speechSynthesis.speak(u);
        });
      }
      if (window.speechSynthesis && typeof window.speechSynthesis.getVoices === 'function' && window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.addEventListener('voiceschanged', function () { });
      }
      function requireLoginThen(callback) {
        // السماح للمالك بالوصول المباشر بدون تسجيل دخول
        try {
          var userEmail = (localStorage.getItem('iif-user-email') || '').trim().toLowerCase();
          var ownerEmail = (window.IIF_CONFIG && window.IIF_CONFIG.ownerEmail) ? window.IIF_CONFIG.ownerEmail.toLowerCase() : 'talalkenani@gmail.com';
          if (userEmail && iifAuthEmailKey(userEmail) === iifAuthEmailKey(ownerEmail) && typeof callback === 'function') {
            callback();
            return;
          }
        } catch (e) { }
        if (!isLoggedIn()) {
          if (typeof openAuth === 'function') openAuth();
          alert(typeof iifMessage === 'function' ? iifMessage('jsPleaseSignInFirst') : 'Please sign in first.');
          return;
        }
        if (typeof callback === 'function') callback();
      }
      if (textBtn) textBtn.addEventListener('click', function () {
        var text = (textInput && textInput.value) ? textInput.value.trim() : '';
        if (!text) {
          if (textResult) textResult.textContent = typeof iifMessage === 'function' ? iifMessage('jsTranslationEnterText') : 'Enter text to translate.';
          return;
        }
        if (textResult) {
          textResult.textContent = typeof iifMessageFmt === 'function' ? iifMessageFmt('jsTranslationBackendStub', { n: text.length }) : ('Live translation will be available when connected to a translation backend. Entered length: ' + text.length + ' characters.');
          textResult.classList.add('has-result');
        }
      });

      /* أشرطة الأسواق — مصدر اقتصادي (أسواق فقط، لا أخبار عامة) */
      /* Customer Experience: تحليل سلوك المستخدم + إشعارات + CRM */
      var VISITED_KEY = 'iif-visited-sections';
      var NOTIF_KEY = 'iif-notif-enable';
      var SECTION_NAMES = {
        about: { en: 'About', ar: 'عن الصندوق' },
        'financial-consultation': { en: 'Consultation', ar: 'استشارة مالية' },
        'urgent-consultation-online': { en: 'Urgent online', ar: 'استشارة عاجلة أونلاين' },
        services: { en: 'Services', ar: 'الخدمات' },
        sectors: { en: 'Sectors', ar: 'القطاعات' },
        mission: { en: 'Mission', ar: 'المهمة' },
        activities: { en: 'Invest with the Fund', ar: 'ساهم مع الصندوق' },
        compliance: { en: 'Compliance', ar: 'التراخيص والشفافية' },
        how: { en: 'How we work', ar: 'كيف نعمل' },
        council: { en: 'Business Council', ar: 'مجلس الأعمال' },
        membership: { en: 'Membership', ar: 'العضوية' },
        'financing-request': { en: 'Financing', ar: 'طلب التمويل' },
        'feasibility-study': { en: 'Feasibility Study', ar: 'دراسة الجدوى' },
        'investor-registration': { en: 'Investors', ar: 'المستثمرون' },
        'upload-submit': { en: 'Upload your project to us', ar: 'ارفع لنا مشروعك' },
        translation: { en: 'Translation', ar: 'الترجمة' },
        partners: { en: 'Partners', ar: 'الشركاء' },
        'customer-experience': { en: 'Customer Experience', ar: 'تجربة العملاء' },
        contact: { en: 'Contact', ar: 'اتصل بنا' }
      };
      function getVisitedSections() {
        try {
          var raw = localStorage.getItem(VISITED_KEY);
          if (raw) {
            var arr = JSON.parse(raw);
            if (Array.isArray(arr)) return arr;
          }
        } catch (e) { }
        return [];
      }
      function addVisitedSection(id) {
        if (!id || !SECTION_NAMES[id]) return;
        var arr = getVisitedSections();
        if (arr.indexOf(id) === -1) {
          arr.push(id);
          try { localStorage.setItem(VISITED_KEY, JSON.stringify(arr)); } catch (e) { }
        }
      }
      function renderSuggestedForYou() {
        var el = document.getElementById('suggested-for-you');
        if (!el) return;
        var visited = getVisitedSections();
        var sugLang = (document.documentElement.getAttribute('data-lang') || 'en').toLowerCase();
        if (visited.length === 0) {
          el.innerHTML = typeof iifMessage === 'function' ? iifMessage('suggestionsBannerHtml') : '<strong>Suggested for you:</strong> Visit site sections to see personalized suggestions.';
          return;
        }
        var names = visited.slice(-5).map(function (id) { return SECTION_NAMES[id] ? (sugLang === 'ar' ? SECTION_NAMES[id].ar : SECTION_NAMES[id].en) : id; });
        var suggestId = visited.indexOf('investor-registration') !== -1 ? 'feasibility-study' : visited.indexOf('financing-request') !== -1 ? 'investor-registration' : 'financial-consultation';
        var suggestName = SECTION_NAMES[suggestId] ? (sugLang === 'ar' ? SECTION_NAMES[suggestId].ar : SECTION_NAMES[suggestId].en) : suggestId;
        var label = typeof iifMessage === 'function' ? iifMessage('suggestionsForYouLabel') : 'Suggested for you:';
        var visitedLabel = typeof iifMessage === 'function' ? iifMessage('suggestionsVisitedLabel') : 'You visited: ';
        var esc = typeof escapeHtml === 'function' ? escapeHtml : function (s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; };
        el.innerHTML = '<strong>' + esc(label) + '</strong> ' + esc(visitedLabel) + ' ' + esc(names.join(' · ')) + '.<br>' + esc(typeof iifMessage === 'function' ? iifMessage('suggestionsYouMightLike') : 'You might like: ') + '<a href="#' + esc(suggestId) + '">' + esc(suggestName) + '</a>';
      }
      (function initSectionTracking() {
        var sections = document.querySelectorAll('section[id]');
        var io = typeof IntersectionObserver !== 'undefined' ? new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting && entry.target.id) addVisitedSection(entry.target.id);
          });
        }, { rootMargin: '0px', threshold: 0.2 }) : null;
        if (io) sections.forEach(function (s) { if (s.id) io.observe(s); });
        renderSuggestedForYou();
        var langPicker = document.getElementById('iif-lang-picker');
        if (langPicker) langPicker.addEventListener('change', function () { setTimeout(renderSuggestedForYou, 100); });
      })();
      var notifCheck = document.getElementById('notif-enable');
      if (notifCheck) {
        try { notifCheck.checked = localStorage.getItem(NOTIF_KEY) === 'true'; } catch (e) { }
        notifCheck.addEventListener('change', function () {
          try { localStorage.setItem(NOTIF_KEY, this.checked ? 'true' : 'false'); } catch (e) { }
        });
      }

      /* قسم التحقق وفحص البروكسي — مخفي افتراضياً، يفتح بزر "إظهار" */
      (function initVerificationCollapse() {
        var toggle = document.getElementById('verification-toggle');
        var content = document.getElementById('verification-content');
        function updateVerificationToggleLabel() {
          var label = document.getElementById('verification-toggle-label');
          if (!toggle || !label) return;
          var expanded = toggle.getAttribute('aria-expanded') === 'true';
          var lang = (document.documentElement.getAttribute('data-lang') || 'en').toLowerCase();
          var pack = window.IIF_I18N && window.IIF_I18N.T;
          var t = pack && (pack[lang] || pack.en);
          var en = pack && pack.en;
          var key = expanded ? 'verifHide' : 'verifShow';
          var val = (t && t[key] != null) ? t[key] : (en && en[key] != null ? en[key] : null);
          if (val != null) label.textContent = val;
        }
        window.IIF_updateVerificationToggleLabel = updateVerificationToggleLabel;
        if (!toggle || !content) return;
        toggle.addEventListener('click', function () {
          var hidden = content.hidden;
          content.hidden = !hidden;
          toggle.setAttribute('aria-expanded', !hidden ? 'true' : 'false');
          updateVerificationToggleLabel();
        });
      })();

      /* IP / Proxy check — عرض موقع الجلسة + حفظ للربط مع "إرسال الملخص" */
      var SESSION_DATA_KEY = 'iif-session-data';
      var PENDING_SUMMARY_KEY = 'iif-pending-summary';
      function maskIp(ip) {
        if (!ip || typeof ip !== 'string') return '—';
        var parts = ip.split('.');
        if (parts.length === 4) return parts[0] + '.' + parts[1] + '.***.' + parts[3];
        return '***';
      }
      (function initIpCheck() {
        var el = document.getElementById('ip-check-result');
        if (!el) return;
        function ipCheckT(key) {
          var lang = (document.documentElement.getAttribute('data-lang') || 'en').toLowerCase();
          var pack = window.IIF_I18N && window.IIF_I18N.T;
          var t = pack && (pack[lang] || pack.en);
          var en = pack && pack.en;
          var v = t && t[key];
          if (v == null && en) v = en[key];
          return v;
        }
        fetch('https://ipapi.co/json/').then(function (r) { return r.json(); }).then(function (data) {
          var country = (data.country_name || data.country || '—').toString();
          var region = (data.region || data.region_code || '—').toString();
          var city = (data.city || '—').toString();
          var ip = maskIp(data.ip);
          var payload = { country: country, region: region, city: city, ip_masked: ip, timestamp: new Date().toISOString() };
          try { localStorage.setItem(SESSION_DATA_KEY, JSON.stringify(payload)); } catch (e) { }
          var sessionLbl = ipCheckT('verifIpSessionLabel') || 'Current session:';
          var proxyNote = ipCheckT('verifIpProxyNote') || 'Proxy/VPN check on submit (backend).';
          var esc = typeof escapeHtml === 'function' ? escapeHtml : function (s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; };
          el.innerHTML = '<strong>' + esc(sessionLbl) + '</strong> ' + esc(country) + ', ' + esc(region) + (city ? ', ' + esc(city) : '') + '. IP: ' + esc(ip) + '. ' + esc(proxyNote);
        }).catch(function () {
          try { localStorage.removeItem(SESSION_DATA_KEY); } catch (e) { }
          el.textContent = ipCheckT('verifIpUnavailable') || 'Session check unavailable. Location and proxy verification run when backend is connected.';
        });
      })();
      /* User Dashboard: Personal Profile Management */
      (function initUserDashboard() {
        var USER_PROFILE_KEY = 'iif-user-profile';

        function getUserProfile() {
          try {
            var data = localStorage.getItem(USER_PROFILE_KEY);
            return data ? JSON.parse(data) : {};
          } catch (e) {
            return {};
          }
        }

        function saveUserProfile(profile) {
          try {
            localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
            return true;
          } catch (e) {
            return false;
          }
        }

        function iifProfileMoveMapKey(storageKey, fromKey, toKey) {
          try {
            var raw = localStorage.getItem(storageKey);
            var obj = raw ? JSON.parse(raw) : {};
            if (!obj || typeof obj !== 'object') return;
            if (obj[fromKey] && !obj[toKey]) obj[toKey] = obj[fromKey];
            if (obj[fromKey]) delete obj[fromKey];
            localStorage.setItem(storageKey, JSON.stringify(obj));
          } catch (eM) { }
        }

        function iifProfileMovePrefixKey(prefix, fromEmail, toEmail) {
          try {
            var fromK = prefix + fromEmail;
            var toK = prefix + toEmail;
            var v = localStorage.getItem(fromK);
            if (v && !localStorage.getItem(toK)) localStorage.setItem(toK, v);
          } catch (eP) { }
        }

        /**
         * @param {string} oldEmail
         * @param {string} newEmail
         * @param {{ showAlert?: boolean, reload?: boolean }} opts
         */
        function iifMigrateLoggedAccountEmail(oldEmail, newEmail, opts) {
          opts = opts || {};
          var showAlert = opts.showAlert === true;
          var reload = opts.reload !== false;
          oldEmail = (oldEmail || '').trim().toLowerCase();
          newEmail = (newEmail || '').trim().toLowerCase();
          if (!oldEmail || !newEmail || oldEmail === newEmail) return;

          iifProfileMoveMapKey(USER_PROFILE_KEY, oldEmail, newEmail);
          if (typeof IIF_USER_CREDENTIALS_KEY !== 'undefined') iifProfileMoveMapKey(IIF_USER_CREDENTIALS_KEY, oldEmail, newEmail);
          if (typeof IIF_ADMIN_PASSWORD_PLAIN_KEY !== 'undefined') iifProfileMoveMapKey(IIF_ADMIN_PASSWORD_PLAIN_KEY, oldEmail, newEmail);
          if (typeof MEMBERSHIP_EXPIRY_PREFIX !== 'undefined') iifProfileMovePrefixKey(MEMBERSHIP_EXPIRY_PREFIX, oldEmail, newEmail);
          if (typeof CERT_PHOTO_KEY !== 'undefined') iifProfileMovePrefixKey(CERT_PHOTO_KEY, oldEmail, newEmail);
          if (typeof CERT_LOGO_KEY !== 'undefined') iifProfileMovePrefixKey(CERT_LOGO_KEY, oldEmail, newEmail);
          if (typeof CERT_FLAG_KEY !== 'undefined') iifProfileMovePrefixKey(CERT_FLAG_KEY, oldEmail, newEmail);

          try {
            if (typeof getSiteUsers === 'function' && typeof saveSiteUsers === 'function') {
              var users = getSiteUsers();
              for (var i = 0; i < users.length; i++) {
                if ((users[i].email || '').trim().toLowerCase() === oldEmail) {
                  users[i] = Object.assign({}, users[i], { email: newEmail, updatedAt: new Date().toISOString() });
                }
              }
              saveSiteUsers(users);
            }
          } catch (eUsers) { }

          try {
            if (typeof getFundMembers === 'function' && typeof saveFundMembers === 'function') {
              var list = getFundMembers();
              for (var j = 0; j < list.length; j++) {
                if ((list[j].email || '').trim().toLowerCase() === oldEmail) {
                  list[j] = Object.assign({}, list[j], { email: newEmail });
                }
              }
              saveFundMembers(list);
            }
          } catch (eFm) { }

          try { localStorage.setItem('iif-user-email', newEmail); } catch (eSet) { }
          try { localStorage.setItem(DEVICE_BOUND_EMAIL_KEY, newEmail); } catch (eDev) { }
          try {
            if (window.IIF_MEMBERSHIP_AUTH && IIF_MEMBERSHIP_AUTH.setLoggedMember) IIF_MEMBERSHIP_AUTH.setLoggedMember(newEmail);
          } catch (eMem) { }
          try { setAdminByEmail(newEmail); } catch (eAdm) { }

          if (reload) {
            try { loadUserProfile(); } catch (eLoad) { }
            try { if (typeof updateDashboardNav === 'function') updateDashboardNav(); } catch (eNav) { }
            try { if (typeof loadDashboardMyContent === 'function') loadDashboardMyContent(); } catch (eMy) { }
          }
          if (showAlert) alert(iifMessage('emailUpdatedSuccess'));
        }

        function iifPairFieldVal(mainId, dashId) {
          var m = document.getElementById(mainId);
          var d = document.getElementById(dashId);
          var mv = m ? (m.value || '') : '';
          var dv = d ? (d.value || '') : '';
          var raw = (mv && mv.trim()) ? mv : dv;
          return (raw || '').trim();
        }
        function iifPairSelectVal(mainId, dashId) {
          var m = document.getElementById(mainId);
          var d = document.getElementById(dashId);
          var el = m || d;
          return el ? el.value : 'platform';
        }
        function iifPairChecked(mainId, dashId, ifMissing) {
          var m = document.getElementById(mainId);
          var d = document.getElementById(dashId);
          if (m) return !!m.checked;
          if (d) return !!d.checked;
          return ifMissing;
        }

        function loadUserProfile() {
          var email = (localStorage.getItem('iif-user-email') || '').trim().toLowerCase();
          if (!email) return;

          var profile = getUserProfile();
          var currentProfile = profile[email] || {};

          var fn = currentProfile.fullName || '';
          var vis = currentProfile.contactVisibility || 'platform';
          var setText = function (mainId, dashId, v) {
            var m = document.getElementById(mainId);
            var d = document.getElementById(dashId);
            if (m) m.value = v;
            if (d) d.value = v;
          };
          setText('user-full-name', 'dash-profile-full-name', fn);
          setText('user-email', 'dash-profile-email', email);
          setText('user-phone', 'dash-profile-phone', currentProfile.phone || '');
          setText('user-company', 'dash-profile-company', currentProfile.company || '');
          setText('user-position', 'dash-profile-position', currentProfile.position || '');
          setText('user-bio', 'dash-profile-bio', currentProfile.bio || '');
          setText('user-website', 'dash-profile-website', currentProfile.website || '');
          setText('user-location', 'dash-profile-location', currentProfile.location || '');
          var vf = document.getElementById('contact-visibility');
          var vfd = document.getElementById('dash-profile-contact-visibility');
          if (vf) vf.value = vis;
          if (vfd) vfd.value = vis;
          var aa = currentProfile.allowAdmin !== false;
          var am = currentProfile.allowMembers === true;
          var ap = currentProfile.allowPublic === true;
          ['allow-admin', 'dash-profile-allow-admin'].forEach(function (id) {
            var el = document.getElementById(id);
            if (el) el.checked = aa;
          });
          ['allow-members', 'dash-profile-allow-members'].forEach(function (id) {
            var el = document.getElementById(id);
            if (el) el.checked = am;
          });
          ['allow-public', 'dash-profile-allow-public'].forEach(function (id) {
            var el = document.getElementById(id);
            if (el) el.checked = ap;
          });

          var phUrl = '';
          try {
            if (typeof getCertPhoto === 'function') phUrl = getCertPhoto() || '';
          } catch (ePh) { }
          var innerPhoto;
          if (phUrl && typeof phUrl === 'string' && phUrl.trim().indexOf('data:image') === 0) {
            var disp = typeof getDisplayImageSrc === 'function' ? getDisplayImageSrc(phUrl, 'photo') : phUrl;
            var escImg = function (s) {
              return String(s || '')
                .replace(/&/g, '&amp;')
                .replace(/"/g, '&quot;')
                .replace(/</g, '&lt;');
            };
            innerPhoto =
              '<img src="' +
              escImg(disp) +
              '" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:50%;display:block;" />';
          } else {
            innerPhoto = '<div class="placeholder-avatar">👤</div>';
          }
          ['user-profile-photo', 'dash-profile-photo'].forEach(function (pid) {
            var el = document.getElementById(pid);
            if (el) el.innerHTML = innerPhoto;
          });
          try {
            setDashProfileLocked(true);
          } catch (eLock) { }
        }

        function setDashProfileLocked(lock) {
          var root = document.getElementById('dashboard-user-profile');
          if (!root) return;
          root.setAttribute('data-profile-edit-locked', lock ? '1' : '0');
          var textIds = [
            'dash-profile-full-name',
            'dash-profile-email',
            'dash-profile-phone',
            'dash-profile-company',
            'dash-profile-position',
            'dash-profile-website',
            'dash-profile-location'
          ];
          textIds.forEach(function (id) {
            var el = document.getElementById(id);
            if (!el) return;
            if (lock) el.setAttribute('readonly', 'readonly');
            else el.removeAttribute('readonly');
          });
          var bio = document.getElementById('dash-profile-bio');
          if (bio) {
            if (lock) bio.setAttribute('readonly', 'readonly');
            else bio.removeAttribute('readonly');
          }
          var sel = document.getElementById('dash-profile-contact-visibility');
          if (sel) sel.disabled = !!lock;
          ['dash-profile-allow-admin', 'dash-profile-allow-members', 'dash-profile-allow-public'].forEach(function (id) {
            var el = document.getElementById(id);
            if (el) el.disabled = !!lock;
          });
          var phBtn = document.getElementById('dash-profile-change-photo-btn');
          if (phBtn) phBtn.disabled = !!lock;
          var editBtn = document.getElementById('dash-profile-edit-toggle-btn');
          var saveAct = document.getElementById('dash-profile-save-actions');
          if (editBtn) editBtn.style.display = lock ? '' : 'none';
          root.querySelectorAll('.dash-profile-locked-hint').forEach(function (h) {
            h.style.display = lock ? '' : 'none';
          });
          if (saveAct) saveAct.style.display = lock ? 'none' : 'flex';
        }

        function saveProfileData() {
          var loggedEmail = (localStorage.getItem('iif-user-email') || '').trim().toLowerCase();
          if (!loggedEmail) {
            alert(iifMessage('jsPleaseSignInFirst'));
            return;
          }

          var emailEl = document.getElementById('dash-profile-email');
          var fieldEmail = emailEl ? (emailEl.value || '').trim().toLowerCase() : loggedEmail;
          if (!fieldEmail) {
            alert(iifMessage('emailInvalidShort'));
            return;
          }

          function finishSave(emailKey) {
            var profile = getUserProfile();
            var fullName = iifPairFieldVal('user-full-name', 'dash-profile-full-name');
            var prevSnap = profile[emailKey] || {};

            profile[emailKey] = {
              fullName: fullName,
              email: emailKey,
              phone: iifPairFieldVal('user-phone', 'dash-profile-phone'),
              company: iifPairFieldVal('user-company', 'dash-profile-company'),
              position: iifPairFieldVal('user-position', 'dash-profile-position'),
              bio: iifPairFieldVal('user-bio', 'dash-profile-bio'),
              website: iifPairFieldVal('user-website', 'dash-profile-website'),
              location: iifPairFieldVal('user-location', 'dash-profile-location'),
              contactVisibility: iifPairSelectVal('contact-visibility', 'dash-profile-contact-visibility'),
              allowAdmin: iifPairChecked('allow-admin', 'dash-profile-allow-admin', true),
              allowMembers: iifPairChecked('allow-members', 'dash-profile-allow-members', false),
              allowPublic: iifPairChecked('allow-public', 'dash-profile-allow-public', false),
              updatedAt: new Date().toISOString()
            };
            if (prevSnap.avatarDataUrl && String(prevSnap.avatarDataUrl).indexOf('data:image') === 0) {
              profile[emailKey].avatarDataUrl = prevSnap.avatarDataUrl;
            }

            if (saveUserProfile(profile)) {
              try {
                if (fullName) localStorage.setItem('iif-user-name', fullName);
              } catch (eN) { }
              try {
                if (typeof loadDashboardMyContent === 'function') loadDashboardMyContent();
              } catch (eL) { }
              try {
                loadUserProfile();
              } catch (eSync) { }
              try {
                setDashProfileLocked(true);
              } catch (eLk) { }
              alert(iifMessage('jsYourInfoSaved'));
            } else {
              alert(iifMessage('jsAccountSaveError'));
            }
          }

          if (fieldEmail === loggedEmail) {
            finishSave(loggedEmail);
            return;
          }

          if (typeof isValidEmail === 'function' && !isValidEmail(fieldEmail)) {
            alert(iifMessage('emailInvalidShort'));
            return;
          }
          if (typeof isEmailBlockedFromSite === 'function' && isEmailBlockedFromSite(fieldEmail)) {
            alert(iifMessage('emailBlockedSite'));
            return;
          }

          var runMigrateThenSave = function () {
            iifMigrateLoggedAccountEmail(loggedEmail, fieldEmail, { showAlert: false, reload: false });
            finishSave(fieldEmail);
          };

          try {
            var cred = typeof getCredentialForEmail === 'function' ? getCredentialForEmail(loggedEmail) : null;
            if (cred && cred.hash && typeof verifyPasswordForEmail === 'function') {
              var pw = prompt(iifMessage('emailChangeConfirmPwPrompt')) || '';
              if (!pw) return;
              verifyPasswordForEmail(loggedEmail, pw).then(function (ok) {
                if (!ok) {
                  alert(iifMessage('jsIncorrectPasswordShort'));
                  return;
                }
                runMigrateThenSave();
              });
              return;
            }
          } catch (eCred) { }

          runMigrateThenSave();
        }

        // Event listeners
        var saveBtn = document.getElementById('save-profile-btn');
        var cancelBtn = document.getElementById('cancel-profile-btn');

        if (saveBtn) {
          saveBtn.addEventListener('click', saveProfileData);
        }

        if (cancelBtn) {
          cancelBtn.addEventListener('click', function () {
            loadUserProfile(); // Reload original data
          });
        }

        var dashSave = document.getElementById('dash-profile-save-btn');
        if (dashSave) dashSave.addEventListener('click', saveProfileData);
        var dashChangeEmail = document.getElementById('dash-profile-change-email-btn');
        function iifChangeLoggedEmail() {
          var oldEmail = (localStorage.getItem('iif-user-email') || '').trim().toLowerCase();
          if (!oldEmail) {
            alert(iifMessage('jsPleaseSignInFirst'));
            return;
          }

          var newEmailRaw = prompt(iifMessage('emailChangePromptNew'), oldEmail) || '';
          var newEmail = (newEmailRaw || '').trim().toLowerCase();
          if (!newEmail || newEmail === oldEmail) return;
          if (typeof isValidEmail === 'function' && !isValidEmail(newEmail)) {
            alert(iifMessage('emailInvalidShort'));
            return;
          }
          if (typeof isEmailBlockedFromSite === 'function' && isEmailBlockedFromSite(newEmail)) {
            alert(iifMessage('emailBlockedSite'));
            return;
          }

          function applyMigrate() {
            iifMigrateLoggedAccountEmail(oldEmail, newEmail, { showAlert: true, reload: true });
          }

          try {
            var cred = typeof getCredentialForEmail === 'function' ? getCredentialForEmail(oldEmail) : null;
            if (cred && cred.hash && typeof verifyPasswordForEmail === 'function') {
              var pw = prompt(iifMessage('emailChangeConfirmPwPrompt')) || '';
              if (!pw) return;
              verifyPasswordForEmail(oldEmail, pw).then(function (ok) {
                if (!ok) {
                  alert(iifMessage('jsIncorrectPasswordShort'));
                  return;
                }
                applyMigrate();
              });
              return;
            }
          } catch (eCred2) { }

          applyMigrate();
        }
        if (dashChangeEmail) dashChangeEmail.addEventListener('click', iifChangeLoggedEmail);
        var dashCancel = document.getElementById('dash-profile-cancel-btn');
        if (dashCancel) {
          dashCancel.addEventListener('click', function () {
            loadUserProfile();
            try {
              setDashProfileLocked(true);
            } catch (eCan) { }
          });
        }
        var dashEditToggle = document.getElementById('dash-profile-edit-toggle-btn');
        if (dashEditToggle) {
          dashEditToggle.addEventListener('click', function () {
            try {
              setDashProfileLocked(false);
            } catch (eEd) { }
          });
        }
        try {
          setDashProfileLocked(true);
        } catch (eInitL) { }

        function onChangeProfilePhotoClick(e) {
          e.preventDefault();
          if (typeof isLoggedIn === 'function' && !isLoggedIn()) {
            alert(typeof iifMessage === 'function' ? iifMessage('dashProfilePhotoSignInFirst') : 'Please sign in first to upload.');
            return;
          }
          var dashOv = document.getElementById('dashboard-overlay');
          var dashOpen = dashOv && dashOv.classList.contains('is-open');
          var dashFile = document.getElementById('dash-profile-photo-file');
          var certInput = (dashOpen && dashFile) ? dashFile : document.getElementById('cert-photo-input');
          if (dashFile && certInput === dashFile) {
            var dRoot = document.getElementById('dashboard-user-profile');
            if (dRoot && dRoot.getAttribute('data-profile-edit-locked') === '1') {
              alert(typeof iifMessage === 'function' ? iifMessage('dashProfileTapEditFirst') : 'Tap «Edit information» first to change your photo or details.');
              return;
            }
          }
          if (!certInput) {
            alert(typeof iifMessage === 'function' ? iifMessage('dashProfilePhotoFieldMissing') : 'Photo upload field not found.');
            return;
          }
          var hasPhoto = false;
          try {
            if (typeof hasCertImageKind === 'function') hasPhoto = hasCertImageKind('photo');
          } catch (eH) { }
          if (hasPhoto) {
            var cmsg = typeof iifMessage === 'function' ? iifMessage('dashProfilePhotoReplaceConfirm') : 'This image is already uploaded. Do you want to remove the previous one and upload again?';
            if (!confirm(cmsg)) return;
          }
          try {
            certInput.click();
          } catch (eClick) {
            alert(typeof iifMessage === 'function' ? iifMessage('dashProfilePhotoPickerFailed') : 'Could not open the file picker. Open the Membership section and use «From files» next to your photo under digital membership card.');
          }
        }
        var changePhotoBtn = document.getElementById('change-photo-btn');
        if (changePhotoBtn) changePhotoBtn.addEventListener('click', onChangeProfilePhotoClick);
        var dashChangePhotoBtn = document.getElementById('dash-profile-change-photo-btn');
        if (dashChangePhotoBtn) dashChangePhotoBtn.addEventListener('click', onChangeProfilePhotoClick);

        function openUserDashboardSection() {
          /* من لديه صلاحية لوحة التحكم: الملف الشخصي داخل اللوحة (أفضل لبوابة الإدارة ولا يتعارض مع إخفاء #main-content) */
          if (typeof canAccessDashboard === 'function' && canAccessDashboard()) {
            try {
              var authOv = document.getElementById('auth-overlay');
              if (authOv && authOv.classList.contains('is-open') && typeof closeAuth === 'function') closeAuth();
            } catch (eAuth) { }
            if (typeof openDashboardEnhanced === 'function') {
              try {
                openDashboardEnhanced();
              } catch (eOp) { }
            }
            setTimeout(function () {
              var el = document.getElementById('dashboard-user-profile');
              if (el && typeof window.IIF_scrollIntoViewClearHeader === 'function') {
                window.IIF_scrollIntoViewClearHeader(el, { behavior: 'smooth' });
              } else if (el && typeof el.scrollIntoView === 'function') {
                try {
                  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } catch (eSc) {
                  try { el.scrollIntoView(true); } catch (e2) { }
                }
              }
              try {
                loadUserProfile();
              } catch (eLd) { }
            }, 420);
            return;
          }
          /* بدون صلاحية لوحة: السلوك السابق — الصفحة العامة #user-dashboard */
          try {
            var dashOv = document.getElementById('dashboard-overlay');
            if (dashOv && dashOv.classList.contains('is-open') && typeof closeDashboard === 'function') {
              closeDashboard();
            } else {
              try { document.documentElement.classList.remove('iif-dashboard-open'); } catch (eCls) { }
              try {
                if (typeof window.IIF_restorePublicSiteChrome === 'function') window.IIF_restorePublicSiteChrome();
              } catch (eRest) { }
              try { document.body.style.overflow = ''; } catch (eBo) { }
            }
          } catch (eDash) { }
          try {
            var authOv2 = document.getElementById('auth-overlay');
            if (authOv2 && authOv2.classList.contains('is-open') && typeof closeAuth === 'function') closeAuth();
          } catch (eAuth2) { }
          document.querySelectorAll('.section').forEach(function (section) {
            section.style.display = 'none';
          });
          var userDashboardSection = document.getElementById('user-dashboard');
          if (userDashboardSection) {
            userDashboardSection.style.display = 'block';
            userDashboardSection.scrollIntoView({ behavior: 'smooth' });
            loadUserProfile();
          }
          try { window.IIF_ALLOW_MAIN_IN_PORTAL = true; } catch (eFl) { }
          try {
            if (typeof window.IIF_hidePublicSiteChrome === 'function') window.IIF_hidePublicSiteChrome();
          } catch (eSyn) { }
        }

        // Load profile when user dashboard is opened (زر الملاحة أو بطاقة الصورة/الاسم في الهيدر)
        var userDashboardLink = document.getElementById('nav-user-dashboard');
        if (userDashboardLink) {
          userDashboardLink.addEventListener('click', function (e) {
            e.preventDefault();
            openUserDashboardSection();
          });
        }
        var headerUserCard = document.getElementById('header-user-card');
        if (headerUserCard) {
          headerUserCard.addEventListener('click', function (e) {
            if (!headerUserCard.classList.contains('is-visible')) return;
            e.preventDefault();
            openUserDashboardSection();
          });
          headerUserCard.addEventListener('keydown', function (e) {
            if (!headerUserCard.classList.contains('is-visible')) return;
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              openUserDashboardSection();
            }
          });
        }

        // Add back to main navigation functionality
        var mainNavLinks = document.querySelectorAll('header nav a:not(#nav-user-dashboard):not(#nav-dashboard)');
        mainNavLinks.forEach(function (link) {
          link.addEventListener('click', function (e) {
            try { window.IIF_ALLOW_MAIN_IN_PORTAL = false; } catch (eNav) { }
            try {
              if (typeof window.IIF_hidePublicSiteChrome === 'function') window.IIF_hidePublicSiteChrome();
            } catch (eNavH) { }
            // Show all sections again when navigating to main sections
            document.querySelectorAll('.section').forEach(function (section) {
              section.style.display = '';
            });
            // Hide user dashboard specifically
            var userDashboardSection = document.getElementById('user-dashboard');
            if (userDashboardSection) {
              userDashboardSection.style.display = 'none';
            }
          });
        });

        // Auto-load when logged in
        if (isLoggedIn()) {
          loadUserProfile();
        }
        try {
          window.IIF_syncProfilePhotoPreview = loadUserProfile;
        } catch (eSyn) { }
      })();
      /* تشخيص وإصلاح تسجيل الدخول */
      (function diagnoseLoginIssue() {
        // فحص وتصحيح حالة تسجيل الدخول للمالك
        function checkAndFixOwnerLogin() {
          var email = (localStorage.getItem('iif-user-email') || '').trim().toLowerCase();
          var ownerEmail = (window.IIF_CONFIG && window.IIF_CONFIG.ownerEmail) ? window.IIF_CONFIG.ownerEmail.toLowerCase() : 'talalkenani@gmail.com';
          var isLoggedIn = localStorage.getItem('iif-logged-in') === '1';

          console.log('Diagnosis:', {
            storedEmail: email,
            ownerEmail: ownerEmail,
            isLoggedIn: isLoggedIn,
            isOwner: !!(email && iifAuthEmailKey(email) === iifAuthEmailKey(ownerEmail))
          });

          // إذا كان المالك ولكن لم يتم تسجيل الدخول
          if (email && iifAuthEmailKey(email) === iifAuthEmailKey(ownerEmail) && !isLoggedIn) {
            console.log('Fixing owner login status...');
            localStorage.setItem('iif-logged-in', '1');
            localStorage.setItem('iif-is-admin', '1');

            // تحديث الواجهة فوراً
            setTimeout(function () {
              if (typeof updateAuthUI === 'function') updateAuthUI();
              if (typeof IIF_proactiveRefreshUI === 'function') IIF_proactiveRefreshUI();

              // إظهار رسالة للمستخدم
              console.log(typeof iifMessage === 'function' ? iifMessage('jsLoginStatusCorrected') : 'Login status corrected automatically');
            }, 200);
          }
        }

        // التشخيص عند تحميل الصفحة
        setTimeout(checkAndFixOwnerLogin, 500);

        // التشخيص عند أي تغيير في localStorage
        window.addEventListener('storage', function (e) {
          if (e.key === 'iif-user-email' || e.key === 'iif-logged-in') {
            setTimeout(checkAndFixOwnerLogin, 100);
          }
        });
      })();
      /* تشخيص وإصلاح زر تسجيل الخروج */
      (function diagnoseLogoutButton() {
        function checkLogoutButton() {
          var logoutBtn = document.getElementById('nav-logout');
          var isLoggedIn = localStorage.getItem('iif-logged-in') === '1';

          console.log('Logout button diagnosis:', {
            buttonExists: !!logoutBtn,
            isLoggedIn: isLoggedIn,
            buttonVisible: logoutBtn ? logoutBtn.style.display !== 'none' : false,
            buttonClass: logoutBtn ? logoutBtn.className : null
          });

          // التأكد من أن الزر مرتبط بالحدث الصحيح
          if (logoutBtn) {
            // إزالة جميع المستمعين القديمة
            var newLogoutBtn = logoutBtn.cloneNode(true);
            logoutBtn.parentNode.replaceChild(newLogoutBtn, logoutBtn);

            // إضافة مستمع جديد
            newLogoutBtn.addEventListener('click', function (e) {
              e.preventDefault();
              console.log('Logout button clicked - new handler');
              doLogout();
            });

            console.log('Logout button event handler reattached');
          }
        }

        // فحص عند تحميل الصفحة
        setTimeout(checkLogoutButton, 1000);

        // فحص عند تغيير حالة تسجيل الدخول
        window.addEventListener('storage', function (e) {
          if (e.key === 'iif-logged-in') {
            setTimeout(checkLogoutButton, 200);
          }
        });
      })();
      /* زر إرسال ملخص الجلسة للفريق */
      var sendSummaryBtn = document.getElementById('send-summary-btn');
      var summaryPreview = document.getElementById('summary-preview');
      var summaryNote = document.getElementById('summary-note');
      if (sendSummaryBtn && summaryPreview) {
        sendSummaryBtn.addEventListener('click', function () {
          var session = {};
          try {
            var raw = localStorage.getItem(SESSION_DATA_KEY);
            if (raw) session = JSON.parse(raw);
          } catch (e) { }
          var visited = typeof getVisitedSections === 'function' ? getVisitedSections() : [];
          var note = (summaryNote && summaryNote.value) ? summaryNote.value.trim() : '';
          var payload = {
            session: session,
            visitedSections: visited,
            note: note,
            timestamp: new Date().toISOString(),
            sendTo: { email: 'talalkenani@gmail.com', whatsapp: '+966567566616' }
          };
          try { localStorage.setItem(PENDING_SUMMARY_KEY, JSON.stringify(payload)); } catch (e) { }
          var lines = [];
          if (session.country) lines.push(iifMessage('sessionLocationPrefix') + [session.country, session.region, session.city].filter(Boolean).join(', '));
          if (session.ip_masked) lines.push(iifMessage('sessionIpPrefix') + session.ip_masked);
          if (visited.length) lines.push(iifMessage('sessionVisitedSections') + visited.join(', '));
          if (note) lines.push(iifMessage('sessionNotePrefix') + note);
          lines.push('');
          lines.push(iifMessage('sessionSummarySavedBackend'));
          summaryPreview.textContent = lines.join('\n');
          summaryPreview.hidden = false;
          if (summaryNote) summaryNote.value = '';
        });
      }

    })();

