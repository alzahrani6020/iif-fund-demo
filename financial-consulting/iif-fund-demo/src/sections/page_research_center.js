export function render(container, lang = "ar") {
  container.innerHTML = `<section id="page-research-center" class="section" style="max-width:800px; margin:0 auto;"><h2 class="section__title"><span class="lang-ar">مركز أبحاث صندوق الاستثمار الدولي</span><span
class="lang-en"></span></h2><p class="lang-ar" style="color:var(--color-text-muted); margin-bottom: var(--space-4);">مراكز الأبحاث حول العالم
— البحث وتنزيل المطلوب للعميل.</p><p class="lang-en" style="color:var(--color-text-muted); margin-bottom: var(--space-4);"></p><div id="research-members-only" class="lang-ar lang-en"
style="padding: var(--space-4); background: rgba(255,193,7,0.15); border: 1px solid #ffc107; border-radius: var(--radius-sm); margin-bottom: var(--space-4);"><span class="lang-ar">هذا القسم متاح للأعضاء فقط. يرجى تسجيل الدخول بحساب عضو صالح.</span><span class="lang-en"></span></div><div id="research-gate" style="display:none;"><div class="form-group" style="margin-bottom: var(--space-3);"><input type="search" id="research-search" placeholder="" style="max-width:400px; padding: 0.5rem 0.75rem;"
aria-label="Search" /><button type="button" id="research-search-btn" class="btn btn--primary" style="margin-top:0.5rem;"><span
class="lang-ar">بحث</span><span class="lang-en"></span></button></div><ul id="centers-list" style="list-style:none; padding:0; margin:0;"></ul></div></section>`;
}
