export function Header(title = 'لوحة التحكم') {
  return `
<header class="dashboard-header-bar">
  <div class="dashboard-header-bar__inner">
    <h1 class="dashboard-header-bar__title">${title}</h1>
    <div class="dashboard-header-bar__actions">
      <button type="button" id="dashboard-close" class="btn btn--sm btn--ghost" aria-label="إغلاق">
        ✕
      </button>
    </div>
  </div>
</header>
  `.trim();
}
