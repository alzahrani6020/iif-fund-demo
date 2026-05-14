export function render(container, lang = "ar") {
  container.innerHTML = `<section id="members" class="section members-section"><h2 class="section__title"><span class="lang-en"></span><span class="lang-ar">الأعضاء</span></h2><p class="members-section__intro lang-en">Fund members — with photo, short bio, and membership QR code for
verification.</p><p class="members-section__intro lang-ar">أعضاء الصندوق — مع الصورة ونبذة مختصرة وكيو آر كود العضوية للتحقق.</p><ul class="members-list" id="members-list" aria-live="polite"></ul></section>`;
}
