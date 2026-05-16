export function render() {
  return `<div class="dashboard-letters" id="dashboard-gov-directory">
          <h3 class="dashboard-letters__title lang-en">Government &amp; Diplomatic Directory — worldwide</h3>
          <h3 class="dashboard-letters__title lang-ar">دليل مكاتب الحكومات والسفارات — عالمياً</h3>
          <p class="dashboard-letters__intro lang-en">Manage links to governments, foreign affairs, investment
            ministries,
            consulates, and commercial attachés. Add phones, emails, websites, officials, and who speaks daily online.
            Dashboard only.</p>
          <p class="dashboard-letters__intro lang-ar">إدارة روابط الحكومات ووزارات الخارجية والاستثمار والقنصليات
            والملحقات التجارية. أرقام مباشرة، إيميلات، مواقع، أسماء المسؤولين، ومن يتحدث يومياً أونلاين. من لوحة التحكم
            فقط.</p>
          <div class="dashboard-gov-report-wrap"
            style="margin-bottom: var(--space-6); padding: var(--space-4); background: var(--color-glass); border-radius: var(--radius-md); border: 1px solid var(--color-border-subtle);">
            <label class="lang-en" style="display:block; margin-bottom: var(--space-2); font-weight: 600;">Country for
              full analysis report</label>
            <label class="lang-ar" style="display:block; margin-bottom: var(--space-2); font-weight: 600;">الدولة لتقرير
              التحليل المفصل</label>
            <div style="display: flex; gap: var(--space-2); flex-wrap: wrap; align-items: center;">
              <input type="text" id="gov-report-country" placeholder="e.g. Saudi Arabia" maxlength="100"
                style="flex: 1; min-width: 200px; padding: 0.5rem 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--color-border-subtle); background: var(--color-surface); color: var(--color-text-main);" />
              <button type="button" class="btn btn--primary" id="gov-report-generate-btn">
                <span class="lang-en">Generate country analysis report</span>
                <span class="lang-ar">تقرير تحليل الدولة (مفصل أونلاين)</span>
              </button>
            </div>`;
}
