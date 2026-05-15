export const siteConfig = {
  url: 'https://thiqqah.live',
  email: 'info@thiqqah.live',
  phone: '+966567566616',
  phoneDisplay: '+966 56 756 6616',
  cr: '4030506321',
  city: 'جدة',
  region: 'منطقة مكة المكرمة',
  country: 'المملكة العربية السعودية',
  founded: '2012'
} as const;

export type ServiceCategory = 'all' | 'popular' | 'business' | 'authority' | 'finance' | 'social' | 'travel';

export interface ServiceItem {
  id: string;
  title: string;
  titleEn: string;
  desc: string;
  descEn: string;
  category: ServiceCategory[];
  icon: string;
  features: string[];
  featuresEn: string[];
}

export const services: ServiceItem[] = [
  {
    id: 'formation',
    title: 'تأسيس الشركات',
    titleEn: 'Company Formation',
    desc: 'إرشاد واختيار الشكل النظامي المناسب وإكمال إجراءات التأسيس والتعديل.',
    descEn: 'Guidance on selecting the appropriate legal structure and completing formation and amendment procedures.',
    category: ['all', 'popular', 'business'],
    icon: 'Building2',
    features: [
      'شركات ذات مسؤولية محدودة',
      'شركة مساهمة مقفلة ومبسطة',
      'مؤسسات فردية وفروع',
      'فروع الشركات الأجنبية',
      'تعديل عقود وبيانات الشركاء',
      'إضافة وتعديل الأنشطة',
      'حجز الاسم التجاري',
      'السجل والغرفة والعنوان الوطني'
    ],
    featuresEn: [
      'Limited Liability Companies',
      'Closed & Simplified JSC',
      'Sole Proprietorships & Branches',
      'Foreign Company Branches',
      'Partner data & contract amendments',
      'Adding and modifying activities',
      'Trade name reservation',
      'CR, Chamber & National Address'
    ]
  },
  {
    id: 'licenses',
    title: 'التراخيص والبلدية',
    titleEn: 'Licenses & Municipal',
    desc: 'متابعة التراخيص والتصاريح للأنشطة التجارية والصناعية والسياحية والعقارية.',
    descEn: 'Follow-up on licenses and permits for commercial, industrial, tourism, and real estate activities.',
    category: ['all', 'popular', 'business'],
    icon: 'FileCheck',
    features: [
      'تراخيص البناء والهدم',
      'إضافة الأدوار والملاحق',
      'تراخيص البيئة',
      'فتح النشاط التجاري',
      'التراخيص الصناعية والسياحية',
      'تراخيص محطات الوقود',
      'تجديد وتعديل الرخص',
      'متابعة الاشتراطات والملاحظات'
    ],
    featuresEn: [
      'Construction & demolition permits',
      'Floor additions & annexes',
      'Environmental licenses',
      'Commercial activity opening',
      'Industrial & tourism licenses',
      'Gas station permits',
      'License renewal & amendment',
      'Requirements & remarks follow-up'
    ]
  },
  {
    id: 'gov-liaison',
    title: 'الخدمات العامة',
    titleEn: 'Government Liaison',
    desc: 'متابعة وتمثيل نظامي أمام الجهات ذات العلاقة نيابة عن الغير.',
    descEn: 'Systematic follow-up and representation before relevant authorities on behalf of clients.',
    category: ['all', 'popular', 'authority'],
    icon: 'Landmark',
    features: [
      'التنسيق مع البنوك وشركات التمويل',
      'الصناديق الصناعية والسياحية والزراعية',
      'وزارة الاستثمار والمركز السعودي للأعمال',
      'المحاكم وكتابات العدل',
      'الجوازات ووزارة العمل',
      'وزارة الإسكان والجهات الحكومية'
    ],
    featuresEn: [
      'Bank & financing company coordination',
      'Industrial, tourism & agricultural funds',
      'Ministry of Investment & Saudi Business Center',
      'Courts & notaries',
      'Passports & Ministry of Labor',
      'Ministry of Housing & government entities'
    ]
  },
  {
    id: 'post-formation',
    title: 'خدمات ما بعد التأسيس',
    titleEn: 'Post-Formation Services',
    desc: 'تجهيز المنشأة للتشغيل واستمرار الامتثال بعد إصدار السجل والرخص.',
    descEn: 'Preparing the entity for operation and maintaining compliance after CR and license issuance.',
    category: ['all', 'business'],
    icon: 'Settings',
    features: ['تحديث البيانات', 'إضافة الأنشطة', 'فتح ومتابعة الملفات', 'تنظيم متطلبات التشغيل'],
    featuresEn: ['Data updates', 'Adding activities', 'Opening & following up files', 'Organizing operational requirements']
  },
  {
    id: 'foreign-investor',
    title: 'الشركات الأجنبية والمستثمرون',
    titleEn: 'Foreign Companies & Investors',
    desc: 'مساندة المستثمرين والشركات الأجنبية في فهم المتطلبات وتنظيم الملفات والمسارات النظامية داخل السعودية.',
    descEn: 'Supporting foreign investors and companies in understanding requirements, organizing files and regulatory pathways inside Saudi Arabia.',
    category: ['all', 'popular', 'business'],
    icon: 'Globe',
    features: ['تحليل المتطلبات وتحديد الكيان', 'تجهيز المستندات الأساسية', 'التنسيق مع الجهات المختصة', 'متابعة ملفات الاستثمار'],
    featuresEn: ['Requirements analysis & entity selection', 'Core document preparation', 'Coordinating with competent authorities', 'Following investment files']
  },
  {
    id: 'compliance',
    title: 'خدمات الامتثال',
    titleEn: 'Compliance Services',
    desc: 'تدقيق أولي للبيانات والالتزامات لتقليل التعثر أثناء الإجراءات.',
    descEn: 'Initial audit of data and obligations to reduce friction during procedures.',
    category: ['all', 'business'],
    icon: 'ShieldCheck',
    features: ['قوائم تحقق مخصصة', 'توصيات تشغيلية', 'تقرير مختصر'],
    featuresEn: ['Custom checklists', 'Operational recommendations', 'Brief report']
  },
  {
    id: 'business-dev',
    title: 'تطوير ومتابعة الأعمال',
    titleEn: 'Business Development',
    desc: 'تطوير ومتابعة الأعمال للشركات والمؤسسات لضمان وضوح المسار التشغيلي والإداري.',
    descEn: 'Developing and following up business operations to ensure clarity of operational and administrative paths.',
    category: ['all', 'authority'],
    icon: 'TrendingUp',
    features: ['تحسين إجراءات العمل', 'متابعة مؤشرات التنفيذ', 'تنظيم الملفات والتقارير', 'دعم خطط التوسع'],
    featuresEn: ['Improving operating procedures', 'Monitoring execution indicators', 'Organizing files & reports', 'Supporting expansion plans']
  },
  {
    id: 'property',
    title: 'إدارة الأملاك',
    titleEn: 'Property Management',
    desc: 'تنظيم ومتابعة الأملاك العقارية بما يحفظ بياناتها ويجعل تشغيلها ومتابعة عقودها أوضح.',
    descEn: 'Organizing and following up real estate properties to preserve data and clarify contract management.',
    category: ['all', 'finance'],
    icon: 'Home',
    features: ['تنظيم بيانات العقارات والمستأجرين', 'متابعة العقود والمستحقات', 'تنسيق الصيانة والتشغيل', 'تقارير متابعة دورية'],
    featuresEn: ['Organizing property & tenant data', 'Following contracts & dues', 'Coordinating maintenance & operations', 'Periodic follow-up reports']
  },
  {
    id: 'project-mgmt',
    title: 'إدارة المشاريع',
    titleEn: 'Project Management',
    desc: 'متابعة المشاريع من التخطيط حتى التنفيذ عبر تنظيم المهام والجهات والمواعيد والتقارير.',
    descEn: 'Project follow-up from planning to execution through organizing tasks, authorities, deadlines, and reports.',
    category: ['all', 'authority'],
    icon: 'ClipboardList',
    features: ['إعداد خطة متابعة المشروع', 'تنسيق الموردين والجهات', 'متابعة الإنجاز والملاحظات', 'تقارير حالة مختصرة'],
    featuresEn: ['Project follow-up plan', 'Supplier & authority coordination', 'Progress & remarks follow-up', 'Concise status reports']
  },
  {
    id: 'hr',
    title: 'خدمات الموارد البشرية',
    titleEn: 'HR Services',
    desc: 'خدمات الموارد البشرية للشركات والمؤسسات بما يساعد على تنظيم فرق العمل والاحتياج الوظيفي.',
    descEn: 'HR services for companies and establishments to organize teams and staffing needs.',
    category: ['all', 'social'],
    icon: 'Users',
    features: ['تصميم الهيكل الوظيفي', 'وصف المهام والمسؤوليات', 'تنظيم ملفات الموظفين', 'دعم إجراءات العمل والامتثال'],
    featuresEn: ['Organizational structure design', 'Job descriptions & responsibilities', 'Organizing employee files', 'Supporting workflow & compliance']
  },
  {
    id: 'individuals',
    title: 'خدمات الأفراد',
    titleEn: 'Individual Services',
    desc: 'جميع الخدمات المناسبة للأفراد ومتابعة الجهات التي تتطلب تنظيم معاملات.',
    descEn: 'All suitable services for individuals and authority follow-ups requiring transaction organization.',
    category: ['all', 'popular', 'social'],
    icon: 'User',
    features: ['متابعة الجهات الحكومية', 'المعاملات العدلية والإدارية', 'متابعة الطلبات الشخصية', 'تنسيق المستندات والمتطلبات'],
    featuresEn: ['Government authority follow-up', 'Notarial & administrative transactions', 'Personal request follow-up', 'Document & requirement coordination']
  },
  {
    id: 'monthly',
    title: 'متابعة شهرية للمنشآت',
    titleEn: 'Monthly Follow-up',
    desc: 'خدمة متابعة دورية للمنشآت القائمة لتنظيم الطلبات وتحديث الملفات وتقليل التعثر.',
    descEn: 'Periodic follow-up for existing entities to organize requests, update files, and reduce friction.',
    category: ['all', 'authority'],
    icon: 'CalendarClock',
    features: ['متابعة الرخص والتجديدات', 'تنسيق طلبات الجهات', 'تقرير متابعة مختصر', 'تنبيه بالمواعيد المهمة'],
    featuresEn: ['License & renewal follow-up', 'Authority request coordination', 'Brief follow-up report', 'Important deadline alerts']
  },
  {
    id: 'file-mgmt',
    title: 'إدارة ملفات المنشأة',
    titleEn: 'Entity File Management',
    desc: 'تنظيم ملفات المنشأة التشغيلية والإدارية حتى تكون جاهزة للتدقيق والمتابعة.',
    descEn: 'Organizing operational and administrative entity files for review and follow-up.',
    category: ['all', 'authority'],
    icon: 'FolderOpen',
    features: ['أرشفة المستندات', 'ترتيب بيانات الرخص والسجلات', 'قوائم تحقق للمتطلبات', 'متابعة النواقص والملاحظات'],
    featuresEn: ['Document archiving', 'Organizing license & registry data', 'Requirement checklists', 'Following gaps & remarks']
  },
  {
    id: 'suppliers',
    title: 'إدارة علاقات الموردين',
    titleEn: 'Supplier Relations',
    desc: 'تنسيق ومتابعة التعاملات مع الموردين بما يخدم احتياج المنشأة ويقلل التعثر التشغيلي.',
    descEn: 'Coordinating and following supplier dealings to meet entity needs and reduce operational friction.',
    category: ['all', 'finance'],
    icon: 'Truck',
    features: ['التنسيق مع الموردين', 'متابعة عروض الأسعار', 'تنظيم المخاطبات', 'توثيق حالة الطلبات'],
    featuresEn: ['Supplier coordination', 'Quotation follow-up', 'Correspondence organization', 'Documenting request status']
  },
  {
    id: 'claims',
    title: 'متابعة المطالبات المالية',
    titleEn: 'Financial Claims',
    desc: 'متابعة المطالبات والمدفوعات والمخاطبات المالية مع الجهات ذات العلاقة.',
    descEn: 'Following claims, payments, and financial correspondence with relevant entities.',
    category: ['all', 'finance'],
    icon: 'Scale',
    features: ['وزارة المالية', 'شركات التمويل والتأمين', 'البنك المركزي', 'الفواتير ومتابعة المستخلصات'],
    featuresEn: ['Ministry of Finance', 'Financing & insurance companies', 'Central Bank', 'Invoices & payment certificates']
  },
  {
    id: 'utilities',
    title: 'خدمات المرافق والتشغيل',
    titleEn: 'Utilities & Operations',
    desc: 'متابعة الجهات الخدمية والتشغيلية التي تحتاجها المنشآت والأفراد لاستمرار الخدمة.',
    descEn: 'Following utility and operational entities needed by businesses and individuals to maintain services.',
    category: ['all', 'authority'],
    icon: 'Zap',
    features: ['شركة الكهرباء', 'مصلحة المياه', 'شركات الاتصالات', 'الأمانات والبلديات الفرعية'],
    featuresEn: ['Electricity company', 'Water authority', 'Telecom companies', 'Principal & sub-municipalities']
  },
  {
    id: 'legal',
    title: 'القضايا والتنفيذ التجاري',
    titleEn: 'Legal & Enforcement',
    desc: 'متابعة المسارات العدلية والتجارية ذات العلاقة بالأعمال والمطالبات والتنفيذ.',
    descEn: 'Following judicial and commercial paths related to business, claims, and enforcement.',
    category: ['all', 'authority'],
    icon: 'Scale',
    features: ['المحكمة التجارية', 'محكمة التنفيذ', 'كتابات العدل', 'متابعة المواعيد والمتطلبات'],
    featuresEn: ['Commercial Court', 'Enforcement Court', 'Notaries', 'Deadline & requirement follow-up']
  },
  {
    id: 'health-hajj',
    title: 'خدمات القطاعات الصحية والحج',
    titleEn: 'Health & Hajj Services',
    desc: 'ترتيب المتطلبات المرتبطة بقطاعات الصحة والحج والجهات ذات العلاقة.',
    descEn: 'Organizing requirements related to health, Hajj, and relevant authorities.',
    category: ['all', 'social'],
    icon: 'HeartPulse',
    features: ['وزارة الصحة', 'وزارة الحج', 'الاشتراطات والتصاريح', 'تنسيق المتطلبات'],
    featuresEn: ['Ministry of Health', 'Ministry of Hajj', 'Requirements & permits', 'Requirement coordination']
  },
  {
    id: 'trademarks',
    title: 'العلامات التجارية والتسويق',
    titleEn: 'Trademarks & Marketing',
    desc: 'متابعة ملفات العلامات التجارية وخدمات التسويق للغير بما يخدم نشاط المنشأة.',
    descEn: 'Following trademark files and third-party marketing services that support the entity\'s activity.',
    category: ['all', 'business'],
    icon: 'Tag',
    features: ['متابعة ملفات العلامات التجارية', 'تأسيس العلامات التجارية', 'التسويق للغير', 'تنسيق المتطلبات والمخاطبات'],
    featuresEn: ['Trademark file follow-up', 'Trademark establishment', 'Third-party marketing', 'Requirement & correspondence coordination']
  },
  {
    id: 'customs',
    title: 'الجمارك والزكاة والضريبة',
    titleEn: 'Customs, Zakat & Tax',
    desc: 'متابعة الجهات المرتبطة بالمنافذ والالتزامات المالية والتنظيمية للمنشآت.',
    descEn: 'Following entities related to ports and entities\' financial and regulatory obligations.',
    category: ['all', 'finance'],
    icon: 'ShieldCheck',
    features: ['الميناء والمنافذ', 'الجمارك', 'هيئة الزكاة والضريبة والجمارك', 'متابعة النواقص والملاحظات'],
    featuresEn: ['Ports & border crossings', 'Customs', 'Zakat, Tax and Customs Authority', 'Following gaps & remarks']
  },
  {
    id: 'transport',
    title: 'النقل والمواصلات',
    titleEn: 'Transport & Logistics',
    desc: 'متابعة الجهات المرتبطة بالنقل والمواصلات والتصاريح التشغيلية ذات العلاقة.',
    descEn: 'Following entities related to transport, mobility, and relevant operating permits.',
    category: ['all', 'authority'],
    icon: 'Ship',
    features: ['وزارة النقل والخدمات اللوجستية', 'وزارة المواصلات', 'التصاريح والتحديثات', 'تنسيق المتطلبات التشغيلية'],
    featuresEn: ['Ministry of Transport & Logistics', 'Ministry of Transport', 'Permits & updates', 'Operational requirement coordination']
  },
  {
    id: 'media-events',
    title: 'الإعلام والترفيه والفعاليات',
    titleEn: 'Media, Entertainment & Events',
    desc: 'متابعة الجهات المرتبطة بالإعلام والترفيه وتنظيم الفعاليات والمعارض.',
    descEn: 'Following entities related to media, entertainment, and organizing events and exhibitions.',
    category: ['all', 'social'],
    icon: 'Monitor',
    features: ['وزارة الإعلام', 'هيئة الترفيه', 'تصاريح الفعاليات والمعارض', 'تنسيق المتطلبات والموافقات'],
    featuresEn: ['Ministry of Media', 'General Entertainment Authority', 'Events & exhibition permits', 'Requirement & approval coordination']
  },
  {
    id: 'industry-mining',
    title: 'الصناعة والثروة المعدنية',
    titleEn: 'Industry & Mining',
    desc: 'متابعة الطلبات المرتبطة بالأنشطة الصناعية والثروة المعدنية والتراخيص ذات العلاقة.',
    descEn: 'Following requests related to industrial activity, mineral wealth, and relevant licenses.',
    category: ['all', 'business'],
    icon: 'Factory',
    features: ['وزارة الصناعة والثروة المعدنية', 'متابعة مدن الصناعية', 'الأنشطة الصناعية', 'التراخيص والتحديثات', 'تنسيق المتطلبات التشغيلية'],
    featuresEn: ['Ministry of Industry & Mineral Resources', 'MODON industrial cities follow-up', 'Industrial activities', 'Licenses & updates', 'Operational requirement coordination']
  },
  {
    id: 'productive-families',
    title: 'خدمات الأسر المنتجة',
    titleEn: 'Productive Family Services',
    desc: 'تنسيق ومتابعة طلبات الأسر المنتجة مع الجهات الداعمة ومقدمي الخدمات.',
    descEn: 'Coordinating and following productive family requests with supporting entities and providers.',
    category: ['all', 'social'],
    icon: 'Home',
    features: ['متابعة التسجيل والمتطلبات', 'التنسيق مع الجهات الداعمة', 'ترتيب الطلبات والمستندات', 'دعم التسويق والتواصل عند الحاجة'],
    featuresEn: ['Registration & requirement follow-up', 'Coordination with supporting entities', 'Organizing requests & documents', 'Marketing & outreach support']
  },
  {
    id: 'special-needs',
    title: 'خدمات ذوي الاحتياجات الخاصة',
    titleEn: 'Special Needs Services',
    desc: 'متابعة وتنسيق الطلبات والخدمات المساندة لذوي الاحتياجات الخاصة باحترام ووضوح.',
    descEn: 'Following and coordinating requests and support services for people with disabilities—with clarity and respect.',
    category: ['all', 'social'],
    icon: 'Heart',
    features: ['التنسيق مع الجهات ذات العلاقة', 'التنسيق مع مقدمي الخدمات', 'متابعة الطلبات والمتطلبات', 'تنظيم المستندات والمواعيد'],
    featuresEn: ['Coordination with relevant authorities', 'Coordination with service providers', 'Following requests & requirements', 'Organizing documents & appointments']
  },
  {
    id: 'seniors',
    title: 'خدمات كبار السن',
    titleEn: 'Senior Citizens Services',
    desc: 'مساندة كبار السن في متابعة المعاملات والتنسيق مع مقدمي الخدمات والرعاية.',
    descEn: 'Supporting seniors in following transactions and coordinating with care and service providers.',
    category: ['all', 'social'],
    icon: 'UserCheck',
    features: ['متابعة المعاملات الشخصية', 'التنسيق مع مقدمي الرعاية والخدمات', 'متابعة الجهات عند الحاجة', 'تنظيم الطلبات والمواعيد'],
    featuresEn: ['Following personal transactions', 'Coordination with care & service providers', 'Authority follow-up when needed', 'Organizing requests & appointments']
  },
  {
    id: 'associations',
    title: 'خدمات الجمعيات',
    titleEn: 'Association Services',
    desc: 'متابعة وتنظيم الطلبات المرتبطة بالجمعيات التعاونية والخيرية والجهات الداعمة.',
    descEn: 'Following and organizing requests related to cooperatives, charities, and supporting entities.',
    category: ['all', 'social'],
    icon: 'Users',
    features: ['خدمات الجمعيات التعاونية', 'خدمات الجمعيات الخيرية', 'تنسيق المتطلبات', 'متابعة المخاطبات'],
    featuresEn: ['Cooperative association services', 'Charity association services', 'Requirement coordination', 'Correspondence follow-up']
  },
  {
    id: 'barter',
    title: 'المقايضات والتسويات التجارية',
    titleEn: 'Barter & Settlements',
    desc: 'السعي في المقايضات التجارية والتسويات بما يساعد الأطراف على ترتيب الحلول الودية.',
    descEn: 'Supporting commercial barter and settlements to help parties reach amicable solutions.',
    category: ['all', 'finance'],
    icon: 'ArrowLeftRight',
    features: ['المقايضات التجارية', 'التسويات الودية', 'تنسيق الأطراف', 'متابعة الاتفاقات والمخاطبات'],
    featuresEn: ['Commercial barter', 'Amicable settlements', 'Coordinating parties', 'Following agreements & correspondence']
  },
  {
    id: 'education-abroad',
    title: 'خدمات التعليم في الخارج',
    titleEn: 'Education Abroad',
    desc: 'مساندة الطلاب وأولياء الأمور في تنسيق متطلبات الدراسة والتعليم خارج المملكة.',
    descEn: 'Supporting students and guardians in coordinating study requirements abroad.',
    category: ['all', 'travel'],
    icon: 'GraduationCap',
    features: ['تنسيق متطلبات القبول', 'متابعة المراسلات التعليمية', 'ترتيب المستندات المطلوبة', 'التنسيق مع مقدمي الخدمات التعليمية'],
    featuresEn: ['Coordinating admissions requirements', 'Following education correspondence', 'Organizing required documents', 'Coordination with education providers']
  },
  {
    id: 'travel-visas',
    title: 'تأشيرات السفر للخارج',
    titleEn: 'Travel Visas',
    desc: 'متابعة متطلبات استخراج تأشيرات السفر للخارج حسب الجهة والدولة المطلوبة.',
    descEn: 'Following outbound visa requirements based on the authority and destination country.',
    category: ['all', 'travel'],
    icon: 'BookOpen',
    features: ['تجهيز متطلبات التأشيرة', 'متابعة السفارات والقنصليات', 'متابعة المواعيد والنماذج', 'تنسيق المستندات', 'متابعة حالة الطلب'],
    featuresEn: ['Preparing visa requirements', 'Following embassies & consulates', 'Following deadlines & forms', 'Document coordination', 'Request status follow-up']
  }
];
