export function render() {
  return `<div class="dashboard-letters" id="dashboard-business-systems">
          <h3 class="dashboard-letters__title lang-en">Business systems &amp; requirements by country</h3>
          <h3 class="dashboard-letters__title lang-ar">أنظمة الأعمال والاشتراطات حسب الدولة</h3>
          <p class="dashboard-letters__intro lang-en">Add or edit business regulations and requirements per country.
            Shown
            in the public "Business systems" section.</p>
          <p class="dashboard-letters__intro lang-ar">إضافة أو تعديل أنظمة الأعمال والاشتراطات لكل دولة. تظهر في القسم
            العام «أنظمة الأعمال».</p>
          <div class="form-row">
            <div class="form-group">
              <label><span class="lang-en">Country</span><span class="lang-ar">الدولة</span></label>
              <input type="text" id="business-country" placeholder="e.g. France" maxlength="80" />
            </div>`;
}
