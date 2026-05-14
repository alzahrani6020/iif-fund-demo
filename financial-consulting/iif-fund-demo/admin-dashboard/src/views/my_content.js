export function render() {
  return `<div id="dashboard-my-content" class="card">
            <h3 class="dashboard-letters__title lang-en">My content — save profile &amp; images</h3>
            <h3 class="dashboard-letters__title lang-ar">محتواي — حفظ المعلومات والصور</h3>
            <p class="dashboard-letters__intro lang-en">Edit your public membership display name, bio, text shown on your
              digital membership card, and photos. Saved to this browser and to your fund member card (if your email is listed).</p>
            <p class="dashboard-letters__intro lang-ar">عدّل اسم العرض، النبذة، النص الظاهر على بطاقة العضوية الرقمية، والصور.
              يُحفظ في المتصفح وفي بطاقة عضو الصندوق إن وُجد بريدك.</p>
            <div class="form-row dashboard-form-row">
              <div class="form-group">
                <label><span class="lang-en">Display name (EN)</span><span class="lang-ar">الاسم المعروض
                    (إنجليزي)</span></label>
                <input type="text" id="dash-my-name-en" maxlength="120" class="dashboard-form input" />
              </div>`;
}
