export function render() {
  return `<div class="dashboard-section" id="dashboard-section-projects">
          <form id="dashboard-form" class="dashboard-form">
            <div class="form-row">
              <div class="form-group">
                <label><span class="lang-en">Project Title (EN)</span><span class="lang-ar">عنوان المشروع
                    (إنجليزي)</span></label>
                <input type="text" id="dash-title-en" required maxlength="120" placeholder="e.g. Mandate" />
              </div>`;
}
