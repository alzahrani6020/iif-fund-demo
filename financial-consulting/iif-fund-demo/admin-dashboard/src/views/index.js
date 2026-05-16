import { render as render_section_overview } from './section_overview.js';
import { render as render_section_projects } from './section_projects.js';
import { render as render_letters } from './letters.js';
import { render as render_letterhead_sheet } from './letterhead_sheet.js';
import { render as render_my_content } from './my_content.js';
import { render as render_team } from './team.js';
import { render as render_uploads } from './uploads.js';
import { render as render_gov_directory } from './gov_directory.js';
import { render as render_business_systems } from './business_systems.js';
import { render as render_project_analysis } from './project_analysis.js';
import { render as render_permissions } from './permissions.js';
import { render as render_fund_members } from './fund_members.js';
import { render as render_exclusion_archive } from './exclusion_archive.js';
import { render as render_membership_reminders } from './membership_reminders.js';
import { render as render_add_members_direct } from './add_members_direct.js';
import { render as render_accept_representatives } from './accept_representatives.js';
import { render as render_admin_passwords_wrap } from './admin_passwords_wrap.js';

export const views = {
  'section_overview': render_section_overview,
  'section_projects': render_section_projects,
  'letters': render_letters,
  'letterhead_sheet': render_letterhead_sheet,
  'my_content': render_my_content,
  'team': render_team,
  'uploads': render_uploads,
  'gov_directory': render_gov_directory,
  'business_systems': render_business_systems,
  'project_analysis': render_project_analysis,
  'permissions': render_permissions,
  'fund_members': render_fund_members,
  'exclusion_archive': render_exclusion_archive,
  'membership_reminders': render_membership_reminders,
  'add_members_direct': render_add_members_direct,
  'accept_representatives': render_accept_representatives,
  'admin_passwords_wrap': render_admin_passwords_wrap,
};
