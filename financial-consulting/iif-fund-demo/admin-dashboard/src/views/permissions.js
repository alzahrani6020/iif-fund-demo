export function render() {
  return `<div class="dashboard-letters" id="dashboard-permissions">
          <h3 class="dashboard-letters__title lang-en">View permissions — Budget & feasibility results</h3>
          <h3 class="dashboard-letters__title lang-ar">صلاحيات الاطلاع — نتائج الميزانيات ودراسات الجدوى</h3>
          <p class="dashboard-letters__intro lang-en">Grant or revoke permission for users (by email) to view protected
            budget and feasibility analysis results.</p>
          <p class="dashboard-letters__intro lang-ar">منح أو إلغاء صلاحية المستخدمين (بالبريد) لعرض نتائج تحليل
            الميزانيات
            ودراسات الجدوى المحمية.</p>
          <div class="form-row">
            <div class="form-group">
              <label><span class="lang-en">Email to grant access</span><span class="lang-ar">البريد لمنح
                  الوصول</span></label>
              <input type="email" id="perm-email" placeholder="user@example.com" />
            </div>`;
}
