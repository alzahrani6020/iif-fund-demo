export function render(container, lang = "ar") {
  container.innerHTML = `<section id="about" class="section"><h2 class="section__title" data-i18n="sectionAbout">About the Fund</h2><p class="lang-en"></p><p class="lang-ar">
صندوق الاستثمار الدولي (FII) — <em>Le fond international d'investissement</em> — شركة فرنسية ذات مسؤولية محدودة
(SARL) مسجّلة في الغيكيه الموحد للمؤسسات (الرسمية J00029775095، 08/08/2023)، و<strong>مسجّل في سجل الشفافية
التابع للاتحاد الأوروبي</strong>، ويعمل بموجب القانون الفرنسي بتراخيص واعتمادات في فرنسا والولايات المتحدة.
يعمل بشكل شامل، دون تمييز أو استبعاد إلا حيث يقتضي القانون الدولي ذلك، ويقدّم حزمة خدمات متكاملة للحكومات
والكيانات السيادية والمؤسسات المالية والشركات وصناديق الاستثمار ومكاتب العائلات والمنظمات غير الحكومية.
<strong>حقوق الملكية الفكرية</strong> على جميع المحتويات والأسماء والمواد المتعلقة بالصندوق محفوظة.
</p><div class="about-team"><h3 class="about-team__title lang-en">Our Team</h3><h3 class="about-team__title lang-ar">فريقنا</h3><ul class="about-team-list" id="about-team-list" aria-live="polite"></ul></div><section id="members" class="section members-section"><h2 class="section__title"><span class="lang-en"></span><span class="lang-ar">الأعضاء</span></h2><p class="members-section__intro lang-en">Fund members — with photo, short bio, and membership QR code for
verification.</p><p class="members-section__intro lang-ar">أعضاء الصندوق — مع الصورة ونبذة مختصرة وكيو آر كود العضوية للتحقق.</p><ul class="members-list" id="members-list" aria-live="polite"></ul></section>`;
}
