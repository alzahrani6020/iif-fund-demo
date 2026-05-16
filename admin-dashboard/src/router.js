import { views } from './views/index.js';

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

export function router(container, hash) {
  const viewKey = routeMap[hash] || routeMap[DEFAULT_ROUTE];
  const renderFn = views[viewKey];
  if (renderFn) {
    container.innerHTML = renderFn();
  } else {
    container.innerHTML = `<div class="dashboard-view"><h1>404</h1><p>View not found: ${hash}</p></div>`;
  }
}
