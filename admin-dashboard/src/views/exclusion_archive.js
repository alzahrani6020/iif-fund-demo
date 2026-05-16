export function render() {
  return `<div class="dashboard-letters" id="dashboard-exclusion-archive" data-dashboard-zone="admin">
          <h3 class="dashboard-letters__title lang-en">Exclusion &amp; rejection archive</h3>
          <h3 class="dashboard-letters__title lang-ar">أرشيف الاستبعادات والرفض</h3>
          <p class="dashboard-letters__intro lang-en">Permanent log for oversight: paid members excluded, registered
            users excluded or rejected, and membership form applications rejected. Snapshots are trimmed (e.g. large
            images) but retain identity and context. Stored in this browser only.</p>
          <p class="dashboard-letters__intro lang-ar">سجل دائم للاطلاع: استبعاد أعضاء مدفوعين، استبعاد أو رفض مسجّلين،
            ورفض طلبات العضوية من النموذج. تُختصر الصور الكبيرة مع الإبقاء على الهوية والسياق. التخزين في هذا المتصفح
            فقط.</p>
          <p id="dashboard-exclusion-archive-stats" class="dashboard-archive-stats" aria-live="polite"></p>
          <div class="dashboard-archive-tabs" id="dashboard-exclusion-archive-tabs" role="tablist"
            aria-label="Archive segments">
            <button type="button" class="btn btn--ghost dashboard-excl-tab is-active" data-excl-tab="all" role="tab"
              aria-selected="true"><span class="lang-en">All</span><span class="lang-ar">الكل</span></button>
            <button type="button" class="btn btn--ghost dashboard-excl-tab" data-excl-tab="fund" role="tab"
              aria-selected="false"><span class="lang-en">Paid members</span><span class="lang-ar">أعضاء
                مدفوعون</span></button>
            <button type="button" class="btn btn--ghost dashboard-excl-tab" data-excl-tab="site" role="tab"
              aria-selected="false"><span class="lang-en">Registered users</span><span
                class="lang-ar">مسجّلون</span></button>
            <button type="button" class="btn btn--ghost dashboard-excl-tab" data-excl-tab="apps" role="tab"
              aria-selected="false"><span class="lang-en">Form applications</span><span class="lang-ar">طلبات
                النموذج</span></button>
          </div>`;
}
