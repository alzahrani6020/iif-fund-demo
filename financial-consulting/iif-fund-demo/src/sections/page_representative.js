export function render(container, lang = "ar") {
  container.innerHTML = `<section id="page-representative" class="section" style="max-width:720px; margin:0 auto;"><h2 class="section__title"><span class="lang-ar">كن ممثلاً للصندوق في بلدك</span><span class="lang-en"></span></h2><p class="lang-ar" style="color:var(--color-text-muted); margin-bottom: var(--space-4);">هذا القسم يستقطب وكلاء في
جميع أنحاء العالم — متاح لأعلى فئة عضوية فقط.</p><p class="lang-en" style="color:var(--color-text-muted); margin-bottom: var(--space-4);"></p><div id="rep-register-box" class="representative-register-box"
style="margin-bottom: var(--space-5); padding: var(--space-4); background: rgba(30, 58, 95, 0.12); border: 1px solid var(--color-accent-blue); border-radius: var(--radius-md);"><h3 style="margin: 0 0 var(--space-3); font-size: 1.1rem;"><span class="lang-ar">تسجيل الممثل</span><span
class="lang-en"></span></h3><p class="lang-ar" style="margin: 0 0 var(--space-2); font-size: 0.95rem; color: var(--color-text-muted);">
لتقديم طلب كممثل: سجّل الدخول أو أنشئ حساباً (عضو بريميوم 4143) ثم املأ النموذج أدناه.</p><p class="lang-en" style="margin: 0 0 var(--space-2); font-size: 0.95rem; color: var(--color-text-muted);"></p><button type="button" class="btn btn--primary btn-sm" id="rep-open-auth" aria-label="Sign in / Register"><span class="lang-ar">تسجيل الدخول / إنشاء حساب</span><span class="lang-en"></span></button></div><div id="rep-not-eligible" class="lang-ar lang-en"
style="padding: var(--space-4); background: rgba(198,40,40,0.15); border: 1px solid #c62828; border-radius: var(--radius-sm); margin-bottom: var(--space-4);"><span class="lang-ar">لا يحق لأي شخص استخدام هذا القسم ماعدا أعلى فئة العضويات. يرجى الترقية إلى العضوية الأعلى
(بريميوم 4143) للتقديم كممثل.</span><span class="lang-en"></span></div><div id="rep-form-block" style="display:none;"><p class="lang-ar" style="font-weight:600; margin-bottom: var(--space-3);">نموذج تسجيل طلب التمثيل — يُربط طلبك
ببريد إدارة الصندوق للمتابعة</p><p class="lang-en" style="font-weight:600; margin-bottom: var(--space-3);"></p><form id="representative-form"><div class="form-group"><label><span class="lang-ar">الاسم الكامل</span><span class="lang-en"></span></label><input type="text" id="rep-name" name="rep_name" required maxlength="200" /></div><div class="form-group"><label><span class="lang-ar">البلد</span><span
class="lang-en"></span></label><input type="text" id="rep-country" name="rep_country" required
maxlength="100" /></div><div class="form-group"><label><span class="lang-ar">البريد الإلكتروني</span><span
class="lang-en"></span></label><input type="email" id="rep-email" name="rep_email" required
maxlength="254" /></div><div class="form-group"><label><span class="lang-ar">الهاتف</span><span
class="lang-en"></span></label><input type="tel" id="rep-phone" name="rep_phone" maxlength="30" /></div><div class="form-group"><label><span class="lang-ar">رابط LinkedIn (اختياري)</span><span
class="lang-en"></span></label><input type="url" id="rep-linkedin"
name="rep_linkedin" maxlength="500" placeholder="https://" /></div><div class="form-group"><label><span class="lang-ar">نبذة مختصرة عنك</span><span class="lang-en"></span></label><textarea id="rep-bio" name="rep_bio" maxlength="2000" rows="4"></textarea></div><div class="rep-kyc-block"
style="margin-top: var(--space-5); padding: var(--space-4); background: rgba(255,255,255,0.04); border: 1px solid var(--color-border-subtle); border-radius: var(--radius-md);"><h4 style="margin: 0 0 var(--space-4); font-size: 1.05rem;"><span class="lang-ar">استبيان اعرف عميلك
(KYC)</span><span class="lang-en"></span></h4><p class="lang-ar"
style="font-size: 0.9rem; color: var(--color-text-muted); margin-bottom: var(--space-4);">يوضح إمكانيتك
المالية، عمرك، علاقاتك في بلدك، المناصب التي مررت بها، وقدرتك على إدارة وتحمل مصاريف صرح مثل الصندوق.
الطلب يُربط ببريد إدارة الصندوق للمتابعة.</p><p class="lang-en"
style="font-size: 0.9rem; color: var(--color-text-muted); margin-bottom: var(--space-4);"></p><div class="form-group"><label><span class="lang-ar">تاريخ الميلاد (اليوم، الشهر، السنة)</span><span
class="lang-en"></span></label><input type="date" id="rep-kyc-dob"
name="kyc_dob" required /></div><div class="form-group"><label><span class="lang-ar">الإمكانية المالية (نطاق الدخل أو حجم
الأصول)</span><span class="lang-en"></span></label><select id="kyc-income" name="kyc_income"><option value="">—</option><option value="under_50k">Under \$50k / أقل من 50 ألف</option><option value="50k_200k">\$50k – \$200k</option><option value="200k_500k">\$200k – \$500k</option><option value="500k_1m">\$500k – \$1M</option><option value="over_1m">Over \$1M / أكثر من مليون</option></select></div><div class="form-group"><label><span class="lang-ar">العمر</span><span
class="lang-en"></span></label><input type="number" id="kyc-age" name="kyc_age" min="18" max="120"
placeholder="e.g. 35" /></div><div class="form-group"><label><span class="lang-ar">مدى علاقاتك في بلدك (قطاع عام، خاص، بنوك، مستثمرون،
جمعيات)</span><span class="lang-en"></span></label><textarea id="kyc-relationships"
name="kyc_relationships" maxlength="1500" rows="3" placeholder=""></textarea></div><div class="form-group"><label><span class="lang-ar">المناصب التي مررت بها (الحالية والسابقة — الجهة
والمدة)</span><span class="lang-en"></span></label><textarea id="kyc-positions" name="kyc_positions" maxlength="2000"
rows="3"></textarea></div><div class="form-group"><label><span class="lang-ar">إمكانيتك لإدارة وتحمل مصاريف صرح مثل صندوق الاستثمار
الدولي (خبرة، موارد، التزام)</span><span class="lang-en"></span></label><textarea id="kyc-management-capacity" name="kyc_management_capacity"
maxlength="2000" rows="4"></textarea></div></div><p class="lang-ar" style="margin-top: var(--space-4); font-size: 0.9rem; color: var(--color-text-muted);">
سيُربط طلبك بجميع بريديات إدارة الصندوق للمراجعة والمتابعة.</p><p class="lang-en" style="margin-top: var(--space-4); font-size: 0.9rem; color: var(--color-text-muted);"></p><p style="margin-top:var(--space-4);"><label style="display:flex;align-items:flex-start;gap:0.5rem;"><input
type="checkbox" id="rep-accept-terms" name="accept_terms" required /><span class="lang-ar">أوافق على
الشروط والأحكام الخاصة بتمثيل الصندوق.</span><span class="lang-en"></span></label></p><button type="submit" class="btn btn--primary"><span class="lang-ar">إرسال الطلب</span><span
class="lang-en"></span></button></form></div></section>`;
}
