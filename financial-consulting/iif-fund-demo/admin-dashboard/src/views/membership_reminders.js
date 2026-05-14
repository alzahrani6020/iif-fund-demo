export function render() {
  return `<div class="dashboard-letters" id="dashboard-membership-reminders">
          <h3 class="dashboard-letters__title lang-en">Membership reminders — expiring &amp; ended</h3>
          <h3 class="dashboard-letters__title lang-ar">تذكيرات العضوية — اقتراب الانتهاء وبعد الانتهاء</h3>
          <p class="dashboard-letters__intro lang-en">Automated schedule: 15, 12, 9, 6, 3 days before end (renewal
            reminder); then every 3 days for 1 month after end (subscription ended). Use mailto to send; mark as sent so
            it repeats every 3 days only.</p>
          <p class="dashboard-letters__intro lang-ar">جدول مؤتمت: قبل 15، 12، 9، 6، 3 أيام من النهاية (تذكير بالتجديد)؛
            ثم
            كل 3 أيام لمدة شهر بعد الانتهاء (انتهاء الاشتراك). استخدم الرابط لإرسال البريد ثم علّم كمُرسَل.</p>
          <div id="membership-reminders-due-list"></div>`;
}
