import { views } from './views/index.js';
import { Header } from './components/Header.js';
import { Nav } from './components/Nav.js';

const DEFAULT_ROUTE = '#/overview';

const routeMap = {
  '#/overview': 'section_overview',
  '#/projects': 'section_projects',
  '#/letters': 'letters',
  '#/letterhead': 'letterhead_sheet',
  '#/my-content': 'my_content',
  '#/team': 'team',
  '#/uploads': 'uploads',
  '#/gov-directory': 'gov_directory',
  '#/business': 'business_systems',
  '#/analysis': 'project_analysis',
  '#/permissions': 'permissions',
  '#/fund-members': 'fund_members',
  '#/exclusion-archive': 'exclusion_archive',
  '#/membership-reminders': 'membership_reminders',
  '#/add-members': 'add_members_direct',
  '#/representatives': 'accept_representatives',
  '#/admin-passwords': 'admin_passwords_wrap',
};

const NAV_TITLES = {
  section_overview: 'نظرة عامة',
  section_projects: 'المشاريع',
  letters: 'الرسائل',
  letterhead_sheet: 'الترويسة الرسمية',
  my_content: 'محتواي',
  team: 'الفريق',
  uploads: 'الملفات',
  gov_directory: 'الفهرس الحكومي',
  business_systems: 'الأنظمة التجارية',
  project_analysis: 'تحليل المشاريع',
  permissions: 'الصلاحيات',
  fund_members: 'أعضاء الصندوق',
  exclusion_archive: 'أرشيف الاستبعاد',
  membership_reminders: 'تذكيرات العضوية',
  add_members_direct: 'إضافة أعضاء',
  accept_representatives: 'قبول الممثلين',
  admin_passwords_wrap: 'كلمات مرور الإدارة',
};

export function router(container, hash) {
  const activeHash = routeMap[hash] ? hash : DEFAULT_ROUTE;
  const viewKey = routeMap[activeHash];
  const renderFn = views[viewKey];
  const content = renderFn
    ? renderFn()
    : `<div class="dashboard-view"><h1>404</h1><p>View not found: ${hash}</p></div>`;
  container.innerHTML = `
    ${Header(NAV_TITLES[viewKey] || 'لوحة التحكم')}
    ${Nav(activeHash)}
    <main class="dashboard-view" id="dashboard-view">${content}</main>
  `;
  const close = document.getElementById('dashboard-close');
  if (close) {
    close.addEventListener('click', () => {
      window.location.href = '/';
    });
  }
}
