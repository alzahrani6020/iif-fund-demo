export function render() {
  return `<div class="dashboard-letters" id="dashboard-add-members-direct">
          <h3 class="dashboard-letters__title lang-en">Add members directly</h3>
          <h3 class="dashboard-letters__title lang-ar">إضافة أعضاء مباشرة</h3>
          <p class="dashboard-letters__intro lang-en">Enter member email and choose membership type; a digital membership card is
            issued after adding.</p>
          <p class="dashboard-letters__intro lang-ar">أدخل بريد العضو واختر نوع العضوية؛ تُصدَر بطاقة العضوية الرقمية بعد الإضافة.</p>
          <div class="form-row">
            <div class="form-group">
              <label><span class="lang-en">Email</span><span class="lang-ar">البريد الإلكتروني</span></label>
              <input type="email" id="direct-member-email" placeholder="member@example.com" maxlength="254" />
            </div>`;
}
