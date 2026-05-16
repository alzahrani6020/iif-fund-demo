# -*- coding: utf-8 -*-
"""Merge remaining page-wide Arabic→English pairs into thiqqah-site/index.html translations."""
from pathlib import Path

REST_I18N = {
    "أرسل طلبك": "Submit your request",
    "أرسل لنا فكرة نشاطك ونجهز لك المسار المناسب.": "Send us your activity idea and we will prepare the right path for you.",
    "أي رخصة أو سجل سابق إن وجد": "Any prior license or register, if applicable",
    "إرشاد لما بعد اكتمال التأسيس": "Guidance after incorporation is complete",
    "ابدأ المتابعة": "Start follow-up",
    "ابدأ بثقة": "Start with confidence",
    "اختيار الشكل النظامي": "Choosing the legal form",
    "استخدمنا صور المباني والمشاريع فقط لإظهار الجدية والارتباط ببيئة الأعمال والتطوير، مع حذف الصور الشخصية من الصفحة.": "We used building and project images only to convey seriousness and alignment with business and development—personal photos were removed from the page.",
    "اطلب الباقة": "Order the package",
    "الأمانات، البلديات الفرعية، مصلحة المياه، شركة الكهرباء، وشركات الاتصالات.": "Principal municipalities, sub-municipalities, water authority, electricity company, and telecom operators.",
    "الإعلام والترفيه": "Media and entertainment",
    "الباقات تساعد الزائر على فهم نطاق الخدمة بسرعة، ثم إرسال طلب واضح عبر واتساب لاستكمال التفاصيل.": "Packages help visitors grasp the scope quickly, then send a clear request via WhatsApp to finalize details.",
    "البريد:": "Email:",
    "البلديات والمرافق": "Municipalities and utilities",
    "البنك المركزي، البنوك، شركات التمويل، شركات التأمين، والصناديق التنموية والتمويلية.": "Central Bank, banks, finance companies, insurers, and development and funding funds.",
    "التجارة والمطاعم": "Trade and restaurants",
    "التعليم والتأشيرات": "Education and visas",
    "التنسيق مع الموردين، متابعة عروض الأسعار، وتنظيم المخاطبات التشغيلية.": "Supplier coordination, quotation follow-up, and organizing operational correspondence.",
    "الجمعيات التعاونية والخيرية، الأسر المنتجة، خدمات كبار السن، وذوو الاحتياجات الخاصة.": "Cooperatives and charities, productive households, senior services, and people with disabilities.",
    "الجمعيات والفئات الخاصة": "Associations and special categories",
    "الجهات الاجتماعية والمدنية": "Social and civil entities",
    "الجوال:": "Mobile:",
    "الدومين: thiqqah.live": "Domain: thiqqah.live",
    "الزكاة والضريبة والجمارك": "Zakat, tax, and customs",
    "السياحة والضيافة": "Tourism and hospitality",
    "الصحة والحج والضيافة": "Health, Hajj, and hospitality",
    "الصناعة والطاقة": "Industry and energy",
    "العقار والمقاولات": "Real estate and contracting",
    "العلامات التجارية، تأسيس العلامات، التسويق للغير، والمتطلبات المرتبطة بها.": "Trademarks, trademark establishment, third-party marketing, and related requirements.",
    "الغرفة والعنوان الوطني": "Chamber and national address",
    "القضاء والتنفيذ": "Judiciary and enforcement",
    "القطاع المالي والتمويلي": "Financial sector",
    "المحكمة التجارية، محكمة التنفيذ، المحاكم العامة، وكتابات العدل.": "Commercial Court, Enforcement Court, general courts, and notary offices.",
    "المركز السعودي للأعمال، بلدي، السجلات والأنشطة، وتعديل بيانات المنشأة.": "Saudi Business Center, Balady, registers and activities, and establishment data amendments.",
    "الموردون والتشغيل": "Suppliers and operations",
    "النقل والخدمات اللوجستية": "Transport and logistics",
    "النموذج يجهز رسالة واضحة المصدر للواتساب أو البريد، حتى لا تضيع تفاصيل الطلب.": "The form prepares a clear, attributable message for WhatsApp or email so request details are not lost.",
    "الوزارات والجهات الحكومية": "Ministries and government entities",
    "بكالوريوس محاسبة، ماجستير في إدارة المخاطر والأزمات، ودكتوراه في محاسبة التكاليف والهندسة والتخطيط المالي.": "Bachelor of Accounting, Master's in Risk and Crisis Management, and PhD in Cost Accounting Engineering and Financial Planning.",
    "بيئة أعمال حديثة تناسب خدمات تأسيس الشركات والتوسع التجاري.": "A modern business environment suited to company formation and commercial expansion.",
    "بيانات المالك أو الشركاء": "Owner or partner details",
    "تأسيس وتطوير الأعمال": "Formation and business development",
    "تجربة عربية بالكامل": "Fully Arabic experience",
    "تجهيز الملف": "Preparing the file",
    "تجهيز مستندات": "Preparing documents",
    "تحديثات وتجديدات": "Updates and renewals",
    "تحليل النشاط": "Activity analysis",
    "تراخيص بناء، إضافة أدوار، ملاحق، هدم وإزالة، ومتابعة اشتراطات.": "Building permits, floor additions, annexes, demolition and removal, and regulatory follow-up.",
    "تراخيص سياحية، تنسيق متطلبات، ومراجعة الجهات ذات العلاقة.": "Tourism licenses, requirement coordination, and liaison with relevant authorities.",
    "تراخيص صناعية، محطات وقود، صناديق تمويل، وملفات تشغيل.": "Industrial licenses, fuel stations, funding schemes, and operating files.",
    "تسليم وتشغيل": "Handover and operations",
    "تقرير حالة مختصر": "Brief status report",
    "تنفيذ أي خدمة يعتمد على اكتمال المتطلبات وقبول الجهة الرسمية المختصة. لا يعد عرض الخدمة ضمانا للموافقة النهائية من الجهات.": "Delivering any service depends on completing requirements and acceptance by the competent authority. Listing a service is not a guarantee of final approval.",
    "تنفيذ ومتابعة": "Execution and follow-up",
    "تولى رئاسة وقيادة شركات في الخدمات المالية، المباني الذكية، الإعلام، الخدمات البترولية، والصناعات التحويلية.": "Led companies in financial services, smart buildings, media, petroleum services, and manufacturing.",
    "ثقة الذهبية للخدمات العامة": "Thiqah Golden Public Services",
    "حجز الاسم والسجل": "Name and register reservation",
    "حضور حضري وتجاري يعكس طموح النمو والتوسع.": "Urban and commercial presence that reflects growth ambition.",
    "خبرة في تأسيس كيانات أعمال وتطوير مشاريع في قطاعات متنوعة تشمل الاستثمار، التجارة، الصناعة، والإنتاج الإعلامي.": "Experience forming business entities and developing projects across investment, trade, industry, and media production.",
    "خدمات التعليم في الخارج، تنسيق القبول، مراجعة السفارات والقنصليات، ومتطلبات تأشيرات السفر للخارج.": "Study-abroad services, admissions coordination, embassy and consulate liaison, and outbound visa requirements.",
    "خدمات تأسيس الشركات، التراخيص، والمتابعة الحكومية في السعودية.": "Company formation, licensing, and government follow-up in Saudi Arabia.",
    "خدمات تناسب قطاعات الأعمال الأكثر طلبا.": "Services aligned with the most requested business sectors.",
    "خدمات مالية واسعة": "Broad financial services",
    "خطة إجراءات مختصرة": "A concise action plan",
    "رئاسة صندوق الاستثمار الدولي": "Chairmanship of the International Investment Fund",
    "رئيس مجلس إدارة صندوق الاستثمار الدولي منذ مايو 2023، مع نشاط في إدارة الاستثمارات وبناء الشراكات والصفقات الدولية.": "Chairman of the International Investment Fund since May 2023, active in investment management and building partnerships and international deals.",
    "رفعنا تجربة الموقع لتكون أقرب لطريقة عمل مكتب خدمات محترف: وضوح في الخيارات، مسار متابعة مختصر، ورسائل واتساب جاهزة المصدر.": "We elevated the site experience to resemble a professional services office: clear options, a short follow-up path, and WhatsApp-ready messages.",
    "سواء كنت تؤسس شركة جديدة أو تحتاج متابعة ملفات منشأة قائمة، سنحول المتطلبات إلى خطوات واضحة قابلة للتنفيذ.": "Whether you are forming a new company or following up an existing establishment, we turn requirements into clear, actionable steps.",
    "علاقات وصفقات دولية": "International relations and deals",
    "فتح النشاط التجاري، رخص بلدية، سجلات، وتعديل الأنشطة.": "Opening commercial activity, municipal licenses, registers, and activity amendments.",
    "قائمة مستندات واضحة": "A clear document checklist",
    "قدم خدمات مالية لجهات وشركات عديدة، مع خبرة معلنة في إدارة المخاطر والأزمات والأسواق المحلية والعالمية.": "Provided financial services to many entities and companies, with documented experience in risk and crisis management and local and global markets.",
    "قيادة شركات متعددة": "Led multiple companies",
    "لا تضع مستندات أو بيانات حساسة داخل النموذج. سنطلب المتطلبات الرسمية بعد التواصل.": "Do not put sensitive documents or data in the form. We will request official requirements after contact.",
    "لا يتم طلب مستندات حساسة داخل الشات بوت، ويمكن استكمال التفاصيل عبر واتساب أو البريد الرسمي.": "Sensitive documents are not requested in the chatbot; details can be completed via WhatsApp or official email.",
    "للخدمات الشخصية والمعاملات الإدارية والعدلية ومراجعات الجهات.": "For personal services, administrative and notarial transactions, and authority reviews.",
    "للشركات والمؤسسات الجديدة، وتشمل تحديد الكيان وتجهيز المتطلبات الأساسية.": "For new companies and establishments—including defining the entity and preparing core requirements.",
    "للمنشآت القائمة التي تحتاج متابعة ملفاتها ورخصها ومراجعات الجهات.": "For existing establishments needing follow-up on files, licenses, and authority reviews.",
    "مؤهلات مالية وإدارية": "Financial and managerial qualifications",
    "ما الذي تحصل عليه؟": "What do you get?",
    "ماذا نحتاج منك؟": "What do we need from you?",
    "متابعة الجهات": "Authority follow-up",
    "متابعة حالة الطلبات": "Following request status",
    "متابعة خطوة بخطوة": "Step-by-step follow-up",
    "متابعة طلبات شخصية": "Following personal requests",
    "متطلبات أولية": "Initial requirements",
    "متطلبات وزارة الصحة، وزارة الحج، الأنشطة الصحية، والسياحة والضيافة.": "Requirements spanning Ministry of Health, Ministry of Hajj, health activities, and tourism and hospitality.",
    "مخرجات منظمة وقابلة للمتابعة": "Organized, trackable deliverables",
    "مدينة العمل والفرع المطلوب": "City of operation and branch required",
    "مراجعات حكومية": "Government reviews",
    "مشاريع تطوير وإنشاءات ضمن قطاعات الأعمال الممكن خدمتها.": "Development and construction projects within sectors we can support.",
    "مصلحة التقاعد، الضمان الاجتماعي، الأحوال المدنية، الجوازات، والمرور.": "Pension authority, social insurance, civil affairs, passports, and traffic.",
    "معاملات عدلية": "Notarial transactions",
    "منصات الأعمال والتراخيص": "Business platforms and licenses",
    "نبدأ بفهم النشاط ثم نرتب المتطلبات وننفذ الإجراءات وفق خطة مختصرة قابلة للمتابعة.": "We start by understanding the activity, then organize requirements and execute steps under a concise, trackable plan.",
    "نتابع الإجراءات ونرسل تحديثات حالة مختصرة وواضحة.": "We follow procedures and send brief, clear status updates.",
    "نتعامل مع بيانات الطلبات بقدر الحاجة للخدمة.": "We handle request data only as needed for the service.",
    "نتعامل مع بيانات العملاء ومستنداتهم بعناية ونطلب فقط ما يخدم مسار الخدمة.": "We handle client data and documents carefully and ask only what the service path requires.",
    "نحدد المستندات والبيانات المطلوبة قبل بدء الطلبات.": "We identify required documents and data before starting requests.",
    "نراجع نوع النشاط والمدينة والشكل النظامي المناسب.": "We review activity type, city, and suitable legal form.",
    "نرتب الخدمة حسب طبيعة النشاط والجهة المطلوبة حتى تكون الرسالة أوضح من أول تواصل.": "We sequence the service by activity and target authority so messaging is clear from first contact.",
    "نرتب الطلبات حسب الخدمة والمدينة والجهة المطلوبة لتسهيل التواصل والتنفيذ.": "We organize requests by service, city, and authority to ease communication and execution.",
    "نسلم المستندات ونوضح الخطوات التالية بعد التأسيس.": "We deliver documents and clarify next steps after incorporation.",
    "نعمل كحلقة وصل منظمة بين العميل والجهات ذات العلاقة. هدفنا أن يعرف صاحب المشروع ماذا يحتاج، لماذا يحتاجه، ومتى يكتمل، بدون تشتيت بين المتطلبات والمنصات المختلفة.": "We act as an organized link between clients and authorities—so owners know what they need, why, and when it completes, without scattering across platforms.",
    "نوضح للعميل المعلومات الأساسية قبل بدء الطلب حتى تقل المراجعات غير المكتملة.": "We clarify basics before starting requests to reduce incomplete rounds.",
    "نوضح مسار المراجعة ونجهز المعلومات الأساسية قبل التواصل مع الجهات المطلوبة.": "We explain the review path and prepare basics before contacting authorities.",
    "نوع النشاط أو وصف مختصر للمشروع": "Activity type or short project description",
    "هيئة الزكاة والضريبة والجمارك، الجمارك، الميناء، والمنافذ ذات العلاقة.": "Zakat, Tax and Customs Authority, customs, ports, and related checkpoints.",
    "وزارة الإعلام، هيئة الترفيه، تصاريح الفعاليات والمعارض، والمتطلبات المرتبطة بها.": "Ministry of Media, Entertainment Authority, event and exhibition permits, and related requirements.",
    "وزارة المالية، وزارة الصحة، وزارة التجارة، وزارة الحج، وزارة الاستثمار، وزارة الإعلام، ووزارة العمل.": "Ministry of Finance, Health, Commerce, Hajj, Investment, Media, and Labor.",
    "وزارة النقل والخدمات اللوجستية، وزارة المواصلات، والتصاريح التشغيلية.": "Ministry of Transport and Logistics, Ministry of Transport, and operating permits.",
    "وضوح قبل التنفيذ": "Clarity before execution",
    "يطلب الموقع معلومات مختصرة مثل نوع الخدمة والمدينة وبيانات التواصل لغرض ترتيب الطلب فقط.": "The site asks for brief information—service type, city, and contact details—only to organize the request.",
    "يعرض الملف خبرة في إدارة العلاقات الدولية وإغلاق الصفقات، مع إجادة عدة لغات ومهارات في صناعة الأسواق.": "The profile highlights international relations and deal-making, multilingual ability, and market-building skills.",
    "يعرض هذا القسم نبذة مختصرة عن خبرة د. طلال بن حسن الزهراني، مع التركيز على الاستثمار، الإدارة المالية، تطوير الأعمال، وعلاقات الأعمال الدولية.": "This section summarizes Dr. Talal bin Hassan Al-Zahrani’s experience—investment, financial management, business development, and international business relations.",
    "يمكن إضافة خدمات وباقات جديدة بسرعة مع المحافظة على تجربة استخدام بسيطة.": "New services and packages can be added quickly while keeping the experience simple.",
    "يمكن تعديل الصياغة أو إضافة إنجازات محددة حسب ما تريد إبرازه في الموقع.": "Wording can be adjusted or achievements added as you wish to highlight on the site.",
}


def esc_js(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')


def main() -> None:
    base = Path(__file__).resolve().parents[1]
    html_path = base / "thiqqah-site/index.html"
    html = html_path.read_text(encoding="utf-8")

    anchor = """      "وصف المهام والمسؤوليات": "Job descriptions and responsibilities",
    };"""

    lines = [f'      "{esc_js(k)}": "{esc_js(v)}",' for k, v in REST_I18N.items()]
    insertion = "\n".join(lines)
    new_block = f"""      "وصف المهام والمسؤوليات": "Job descriptions and responsibilities",
{insertion}
    }};"""

    if anchor not in html:
        raise SystemExit("anchor not found in index.html")

    if len(REST_I18N) != 117:
        raise SystemExit(f"expected 117 entries, got {len(REST_I18N)}")

    html_path.write_text(html.replace(anchor, new_block), encoding="utf-8")
    print("Merged", len(REST_I18N), "rest-of-page translation entries.")


if __name__ == "__main__":
    main()
