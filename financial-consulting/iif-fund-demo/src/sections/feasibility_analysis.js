export function render(container, lang = "ar") {
  container.innerHTML = `<section id="feasibility-analysis" class="section"><h2 class="section__title"><span class="lang-en"></span><span class="lang-ar">تحليل
دراسات الجدوى والمشاريع</span></h2><p class="lang-en" style="margin-bottom: var(--space-6);"></p><p class="lang-ar" style="margin-bottom: var(--space-6);">أدخل البيانات المالية للمشروع لتحليل الجدوى (الاستثمار
الأولي، التدفقات النقدية السنوية). النتائج محمية ولا يُطّلع عليها إلا الإدارة أو من لديهم صلاحية من لوحة التحكم.
</p><div class="feasibility-analysis-box"><form id="form-feasibility-analysis"><div class="form-row"><div class="form-group"><label class="lang-en"></label><label class="lang-ar">الاستثمار الأولي (المبلغ)</label><input type="number" id="feas-initial" step="0.01" min="0" placeholder="e.g. 1000000" required /></div><div class="form-group"><label class="lang-en"></label><label class="lang-ar">التدفقات النقدية السنوية (مفصولة بفاصلة أو سطر)</label><textarea id="feas-flows" rows="3" placeholder="e.g. 200000, 250000, 300000, 350000"></textarea></div></div><div class="form-group"><label class="lang-en"></label><label class="lang-ar">معدل الخصم % (اختياري)</label><input type="number" id="feas-rate" step="0.01" min="0" max="100" placeholder="e.g. 10" /></div><button type="submit" class="btn btn--primary"><span class="lang-en"></span><span
class="lang-ar">تحليل المشروع</span></button></form><div id="feasibility-results-wrap" class="protected-results" style="margin-top: var(--space-6);"
data-protected="feasibility"><div class="no-permission lang-en" id="feas-no-permission">View results after analysis. Access restricted to
administration or permitted users.</div><div class="no-permission lang-ar" id="feas-no-permission-ar">عرض النتائج بعد التحليل. الوصول للإدارة أو من
لديهم صلاحية فقط.</div><div id="feasibility-results" style="display:none;"></div></div></div></section>`;
}
