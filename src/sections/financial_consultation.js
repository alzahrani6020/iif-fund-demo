export function render(container, lang = "ar") {
  container.innerHTML = `<section id="financial-consultation" class="section"><h2 class="section__title"><span class="lang-en"></span><span class="lang-ar">استشارة
مالية</span></h2><p class="lang-en" style="margin-bottom: var(--space-8);"></p><p class="lang-ar" style="margin-bottom: var(--space-8);">استشارات مالية متخصصة للمؤسسات والحكومات والشركات. اطلب
استشارة عادية أو استشارة عاجلة عندما يكون التوقيت حاسماً.</p><div class="grid-2"><div class="card consultation-card"><h3 class="lang-en"></h3><h3 class="lang-ar">استشارة مالية</h3><p class="lang-en"></p><p class="lang-ar">استشارات منظمة في تخطيط رأس المال وإعادة الهيكلة والتقييمات والتمويل الاستراتيجي. نحدد
المواعيد وفقاً لاحتياجاتك.</p><a href="#contact" class="btn btn--primary" style="margin-top: var(--space-4);"><span class="lang-en"></span><span class="lang-ar">طلب استشارة</span></a></div><div class="card consultation-card consultation-card--urgent"><span class="consultation-badge lang-en">Urgent</span><span class="consultation-badge lang-ar">عاجل</span><h3 class="lang-en"></h3><h3 class="lang-ar">استشارة مالية عاجلة</h3><p class="lang-en"></p><p class="lang-ar">القرارات ذات التوقيت الحساس تحتاج إلى رأي خبراء سريع. اطلب استشارة مالية عاجلة للحصول على
موعد بأولوية ورد سريع.</p><a href="#urgent-consultation-online" class="btn btn--primary" style="margin-top: var(--space-4);"><span
class="lang-en"></span><span class="lang-ar">طلب استشارة عاجلة</span></a></div></div></section>`;
}
