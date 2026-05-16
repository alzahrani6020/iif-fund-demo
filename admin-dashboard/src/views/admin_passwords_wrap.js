export function render() {
  return `<div id="dashboard-admin-passwords-wrap">
            <h4 class="lang-en dashboard-subheading dashboard-subheading--minor dashboard-subheading--minor-flush">Admin
              — account passwords (this browser only)</h4>
            <h4 class="lang-ar dashboard-subheading dashboard-subheading--minor dashboard-subheading--minor-flush">
              للإدارة — كلمات مرور الحسابات (هذا المتصفح فقط)</h4>
            <p class="lang-en" style="font-size:0.8rem; color:var(--color-text-muted); margin-bottom: var(--space-2);">
              View and change passwords for any email that has signed in or been registered. For demo/local use; do not
              use for production.</p>
            <p class="lang-ar" style="font-size:0.8rem; color:var(--color-text-muted); margin-bottom: var(--space-2);">
              عرض وتعديل كلمات المرور لكل بريد مسجّل. للتجربة والتخزين المحلي فقط.</p>
            <ul class="dashboard-list" id="dashboard-admin-passwords-list"></ul>
          </div>`;
}
