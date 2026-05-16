export function render() {
  return `<div class="dashboard-letters" id="dashboard-accept-representatives"
          style="border: 2px solid var(--color-accent-blue); background: rgba(30, 58, 95, 0.15);">
          <h3 class="dashboard-letters__title lang-en">Accept as our representative</h3>
          <h3 class="dashboard-letters__title lang-ar">قبول ممثلاً لنا</h3>
          <p class="dashboard-letters__intro lang-en">Applications after terms acceptance — click «Accept as our
            representative» below each or «Accept all». Each request is linked to the emails below for follow-up.</p>
          <p class="dashboard-letters__intro lang-ar">طلبات التمثيل بعد استيفاء الشروط — اختر «قبول ممثلاً لنا» أسفل كل
            طلب أو «قبول الكل». كل طلب يُربط بجميع البريديات أدناه للمتابعة.</p>
          <div class="form-group" style="margin: var(--space-3) 0; max-width: 480px;">
            <label><span class="lang-ar">بريديات ربط طلبات التمثيل (فاصلة بين كل بريد)</span><span
                class="lang-en">Emails
                to link representative requests to (comma-separated)</span></label>
            <textarea id="rep-link-emails" rows="2" placeholder="admin@fund.com, info@fund.com"
              style="width:100%; padding: 0.5rem; border-radius: var(--radius-sm); border: 1px solid var(--color-border-subtle); background: var(--color-surface); color: var(--color-text-main);"></textarea>
            <button type="button" class="btn btn--ghost btn-sm" id="rep-save-link-emails"
              style="margin-top: 0.5rem;"><span class="lang-ar">حفظ البريديات</span><span class="lang-en">Save
                emails</span></button>
          </div>`;
}
