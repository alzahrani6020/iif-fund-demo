export function render() {
  return `<div class="dashboard-letters letters-area" id="dashboard-letters">
          <h3 class="dashboard-letters__title lang-en">Official letters (letterhead + QR authentication)</h3>
          <h3 class="dashboard-letters__title lang-ar">عمل الخطابات — خطاب رسمي مصادق</h3>
          <p class="dashboard-letters__intro lang-en">Create letters on Fund letterhead. Generate a QR code to
            authenticate the document so the recipient can verify it is from the Fund.</p>
          <p class="dashboard-letters__intro lang-ar">إنشاء خطابات على ورق الصندوق الرسمي. إنشاء رمز QR لمصادقة المستند
            حتى يتأكد المتلقي أنه صادر من الصندوق.</p>
          <div class="letter-editor">
            <div class="letter-meta">
              <div class="form-group letter-sader-display">
                <span class="letterhead-meta-label"><span class="lang-en">Outgoing no.</span><span class="lang-ar">الرقم
                    (صادر)</span></span>
                <input type="text" id="letter-sader-display" class="letterhead-input-luxury"
                  placeholder="الرقم الصادر / Outgoing No." readonly />
              </div>`;
}
