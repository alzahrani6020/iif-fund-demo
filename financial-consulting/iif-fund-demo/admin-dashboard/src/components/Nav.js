const ROUTES = [
  { hash: '#/overview', label: 'نظرة عامة', icon: '📊' },
  { hash: '#/projects', label: 'المشاريع', icon: '📁' },
  { hash: '#/letters', label: 'الرسائل', icon: '✉️' },
  { hash: '#/team', label: 'الفريق', icon: '👥' },
  { hash: '#/uploads', label: 'الملفات', icon: '📎' },
  { hash: '#/permissions', label: 'الصلاحيات', icon: '🔐' },
  { hash: '#/fund-members', label: 'أعضاء الصندوق', icon: '🏅' },
  { hash: '#/analysis', label: 'التحليل', icon: '📈' },
];

export function Nav(activeHash = '#/overview') {
  const links = ROUTES.map(r => {
    const isActive = r.hash === activeHash ? 'is-active' : '';
    return `<a href="${r.hash}" class="dashboard-nav__link ${isActive}"><span class="dashboard-nav__icon">${r.icon}</span><span class="dashboard-nav__label">${r.label}</span></a>`;
  }).join('');

  return `
<nav class="dashboard-nav" aria-label="التنقل الرئيسي">
  <div class="dashboard-nav__inner">
    ${links}
  </div>
</nav>
  `.trim();
}
