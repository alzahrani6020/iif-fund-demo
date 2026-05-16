export function render() {
  return `<div class="dashboard-letters" id="dashboard-project-analysis">
          <h3 class="dashboard-letters__title lang-en">Project analysis — received submissions</h3>
          <h3 class="dashboard-letters__title lang-ar">تحليل المشاريع المستلمة</h3>
          <p class="dashboard-letters__intro lang-en">For each received project (contact, investor, financing, upload):
            view submitter info, country, and fill analysis (responsible authority, work regulations, financial center,
            debt, sovereign guarantee, security, economic analysis, risks). Generate report and email.</p>
          <p class="dashboard-letters__intro lang-ar">لكل مشروع مستلم (تواصل، مستثمر، تمويل، رفع): عرض معلومات مقدم
            الطلب
            والدولة وتعبئة التحليل (الجهة المسؤولة، أنظمة العمل، المركز المالي، المديونيات، ضمان سيادي، الوضع الأمني،
            التحليل الاقتصادي، المخاطر). إنشاء تقرير وإرسال بالبريد.</p>
          <ul class="dashboard-list" id="dashboard-project-analysis-list"></ul>
        </div>`;
}
