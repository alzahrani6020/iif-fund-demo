export function render() {
  return `<div class="dashboard-letters" id="dashboard-fund-members">
          <h3 class="dashboard-letters__title lang-en">Fund members — display on Members page with photo, bio &amp;
            membership QR</h3>
          <h3 class="dashboard-letters__title lang-ar">إدارة الأعضاء — عرض في صفحة الأعضاء مع الصورة والنبذة وكيو آر
            العضوية</h3>
          <p class="dashboard-letters__intro lang-en">Add members. They appear in the public "Members" section with
            photo,
            bio, and a unique QR code for their membership in the Fund.</p>
          <p class="dashboard-letters__intro lang-ar">إضافة أعضاء. يظهرون في قسم «الأعضاء» مع الصورة والنبذة وكيو آر كود
            عضوية فريد في الصندوق.</p>
          <form id="fund-members-form" class="dashboard-form">
            <input type="hidden" id="fund-member-edit-id" value="" />
            <div class="form-row">
              <div class="form-group">
                <label><span class="lang-en">Name (EN)</span><span class="lang-ar">الاسم (إنجليزي)</span></label>
                <input type="text" id="fund-member-name-en" maxlength="120" placeholder="e.g. John Smith" />
              </div>`;
}
