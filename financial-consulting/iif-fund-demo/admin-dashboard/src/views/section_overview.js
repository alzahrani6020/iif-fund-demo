export function render() {
  return `<div class="dashboard-section" id="dashboard-section-overview">
          <!-- ترحيب حسب دور المستخدم (مسجّل / عضو / موظف) — يُدار من applyDashboardAccessRules -->
          <div id="dashboard-role-welcome" class="card">
            <p id="dashboard-role-welcome-text"></p>
          </div>`;
}
