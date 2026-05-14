export function render(container, lang = "ar") {
  container.innerHTML = `<section id="activities" class="section"><h2 class="section__title"><span class="lang-en"></span><span class="lang-ar">ساهم مع
الصندوق</span></h2><p class="lang-en" style="margin-bottom: var(--space-8);"></p><p class="lang-ar" style="margin-bottom: var(--space-8);">فرص استثمارية ومشاريع يديرها الصندوق. يمكن الإضافة أو
التعديل من لوحة التحكم بعد تسجيل الدخول.</p><div class="grid-3" id="activities-grid"></div></section>`;
}
