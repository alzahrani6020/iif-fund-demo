export function render(container, lang = "ar") {
  container.innerHTML = `<section id="budget-analysis" class="section"><h2 class="section__title"><span class="lang-en"></span><span class="lang-ar">رفع
الميزانية وتحليلها من جميع الجوانب</span></h2><p class="lang-en" style="margin-bottom: var(--space-4);"></p><p class="lang-ar" style="margin-bottom: var(--space-4);">ارفع ملف الميزانية (Excel، PDF، CSV، Word أو نص). الموقع
يقرأه ويحلّله من جميع الجوانب. التقرير بلغة العميل مع خيار اختيار لغات أخرى.</p><div class="budget-analysis-box"><div class="budget-upload-zone" id="budget-upload-zone"><p class="lang-en" style="margin-bottom: var(--space-2);"></p><p class="lang-ar" style="margin-bottom: var(--space-2);">اسحب ملف الميزانية هنا أو انقر للاختيار — أي نسق
(XLS، XLSX، CSV، PDF، TXT، DOC، DOCX)</p><input type="file" id="budget-file-input"
accept=".xls,.xlsx,.csv,.pdf,.txt,.doc,.docx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/pdf,text/plain,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" /><p id="budget-file-name" style="font-size:0.9rem; color:var(--color-text-muted); margin-top:var(--space-2);"></p></div><div class="budget-report-lang" style="margin-top: var(--space-4);"><label for="budget-report-lang"><span class="lang-en"></span><span class="lang-ar">لغة
التقرير</span></label><select id="budget-report-lang"><option value="ar">العربية</option><option value="en">English</option></select></div><div id="budget-results-wrap" class="protected-results budget-results-inline"
style="margin-top: var(--space-6);" data-protected="budget"><div class="no-permission lang-en" id="budget-no-permission">View results after analysis. Access restricted to
administration or permitted users.</div><div class="no-permission lang-ar" id="budget-no-permission-ar">عرض النتائج بعد التحليل. الوصول للإدارة أو من
لديهم صلاحية فقط.</div><div id="budget-results" style="display:none;"></div></div></div></section>`;
}
