export function render() {
  return `<div class="dashboard-letters" id="dashboard-team">
          <h3 class="dashboard-letters__title lang-en">Our Team — Add / edit team members</h3>
          <h3 class="dashboard-letters__title lang-ar">من نحن — إضافة أو تعديل أعضاء الفريق</h3>
          <p class="dashboard-letters__intro lang-en">Add new people with name, title, bio (EN/AR) and photo. They
            appear
            in the "About — Our Team" section.</p>
          <p class="dashboard-letters__intro lang-ar">أضف أشخاصاً جدداً بالاسم والمسمى والنبذة (عربي/إنجليزي) والصورة.
            يظهرون في قسم «من نحن — فريقنا».</p>
          <form id="dashboard-team-form" class="dashboard-form">
            <div class="form-row">
              <div class="form-group">
                <label><span class="lang-en">Name (EN)</span><span class="lang-ar">الاسم (إنجليزي)</span></label>
                <input type="text" id="team-name-en" required maxlength="120"
                  placeholder="e.g. Dr. Talal Hassan Al-Zahrani" />
              </div>`;
}
