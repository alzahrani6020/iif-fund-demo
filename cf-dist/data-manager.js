// Professional Data Management System
class GovernmentDataManager {
    constructor() {
        this.countries = new Map();
        this.initializeData();
    }

    initializeData() {
        // Unified country data structure
        const countriesData = {
            'saudi-arabia': {
                names: { ar: 'المملكة العربية السعودية', en: 'Saudi Arabia' },
                flags: { ar: '🇸🇦', en: '🇸🇦' },
                codes: ['SA', 'SAU', 'السعودية', 'Saudi Arabia', 'KSA'],
                basicInfo: {
                    capital: { ar: 'الرياض', en: 'Riyadh' },
                    region: { ar: 'الشرق الأوسط', en: 'Middle East' },
                    population: { ar: '34.8 مليون نسمة', en: '34.8 million' },
                    currency: { ar: 'ريال سعودي', en: 'Saudi Riyal' },
                    language: { ar: 'العربية', en: 'Arabic' },
                    gdp: { ar: '1.1 تريليون دولار', en: '$1.1 trillion' },
                    gdpPerCapita: { ar: '31,300 دولار', en: '$31,300' }
                },
                leadership: [
                    {
                        title: { ar: 'الملك', en: 'King' },
                        name: { ar: 'سلمان بن عبدالعزيز آل سعود', en: 'Salman bin Abdulaziz Al Saud' },
                        position: { ar: 'ملك المملكة العربية السعودية', en: 'King of Saudi Arabia' },
                        term: { ar: 'منذ 2015', en: 'Since 2015' },
                        phone: '+966-1-4055555',
                        email: 'royalcourt@royalcourt.gov.sa',
                        photo: 'https://example.com/king-salman.jpg'
                    },
                    {
                        title: { ar: 'ولي العهد', en: 'Crown Prince' },
                        name: { ar: 'محمد بن سلمان', en: 'Mohammed bin Salman' },
                        position: { ar: 'ولي العهد ورئيس مجلس الوزراء', en: 'Crown Prince and Prime Minister' },
                        term: { ar: 'منذ 2017', en: 'Since 2017' },
                        phone: '+966-1-4055555',
                        email: 'crownprince@royalcourt.gov.sa',
                        photo: 'https://example.com/mbs.jpg'
                    }
                ],
                ministries: [
                    {
                        name: { ar: 'وزارة الخارجية', en: 'Ministry of Foreign Affairs' },
                        minister: { ar: 'الأمير فيصل بن فرحان آل سعود', en: 'Prince Faisal bin Farhan Al Saud' },
                        responsibility: { ar: 'العلاقات الدبلوماسية', en: 'Diplomatic Relations' },
                        phone: '+966-12-6788888',
                        email: 'info@mofa.gov.sa',
                        website: 'https://www.mofa.gov.sa',
                        address: { ar: 'الرياض', en: 'Riyadh' }
                    },
                    {
                        name: { ar: 'وزارة المالية', en: 'Ministry of Finance' },
                        minister: { ar: 'محمد الجدعان', en: 'Mohammed Al-Jadaan' },
                        responsibility: { ar: 'الإدارة الاقتصادية', en: 'Economic Management' },
                        phone: '+966-11-4055555',
                        email: 'info@mof.gov.sa',
                        website: 'https://www.mof.gov.sa',
                        address: { ar: 'الرياض', en: 'Riyadh' }
                    },
                    {
                        name: { ar: 'وزارة الاستثمار', en: 'Ministry of Investment' },
                        minister: { ar: 'خالد الفالح', en: 'Khalid Al-Falih' },
                        responsibility: { ar: 'ترويج الاستثمار', en: 'Investment Promotion' },
                        phone: '+966-12-6588888',
                        email: 'info@invest.gov.sa',
                        website: 'https://invest.gov.sa',
                        address: { ar: 'الرياض', en: 'Riyadh' }
                    },
                    {
                        name: { ar: 'وزارة الزراعة', en: 'Ministry of Agriculture' },
                        minister: { ar: 'عبدالرحمن الفضلي', en: 'Abdulrahman Al-Fadhli' },
                        responsibility: { ar: 'تنمية القطاع الزراعي', en: 'Agricultural Sector Development' },
                        phone: '+966-11-4055555',
                        email: 'info@moa.gov.sa',
                        website: 'https://www.moa.gov.sa',
                        address: { ar: 'الرياض', en: 'Riyadh' }
                    },
                    {
                        name: { ar: 'وزارة الطاقة', en: 'Ministry of Energy' },
                        minister: { ar: 'الأمير عبدالعزيز بن سلمان', en: 'Prince Abdulaziz bin Salman' },
                        responsibility: { ar: 'قطاع الطاقة والمعادن', en: 'Energy and Mining Sector' },
                        phone: '+966-11-4055555',
                        email: 'info@moenergy.gov.sa',
                        website: 'https://www.moenergy.gov.sa',
                        address: { ar: 'الرياض', en: 'Riyadh' }
                    },
                    {
                        name: { ar: 'وزارة الصناعة', en: 'Ministry of Industry' },
                        minister: { ar: 'بندر الخريف', en: 'Bandar Al-Khorayef' },
                        responsibility: { ar: 'تنمية القطاع الصناعي', en: 'Industrial Sector Development' },
                        phone: '+966-11-4055555',
                        email: 'info@moi.gov.sa',
                        website: 'https://www.moi.gov.sa',
                        address: { ar: 'الرياض', en: 'Riyadh' }
                    },
                    {
                        name: { ar: 'وزارة التجارة', en: 'Ministry of Commerce' },
                        minister: { ar: 'مجيد القصبي', en: 'Majid Al-Qasabi' },
                        responsibility: { ar: 'تنظيم التجارة الداخلية والخارجية', en: 'Internal and External Trade Regulation' },
                        phone: '+966-11-4055555',
                        email: 'info@commerce.gov.sa',
                        website: 'https://www.commerce.gov.sa',
                        address: { ar: 'الرياض', en: 'Riyadh' }
                    },
                    {
                        name: { ar: 'وزارة النقل', en: 'Ministry of Transport' },
                        minister: { ar: 'صالح الجاسر', en: 'Saleh Al-Jasser' },
                        responsibility: { ar: 'قطاع النقل والخدمات اللوجستية', en: 'Transport and Logistics Sector' },
                        phone: '+966-11-4055555',
                        email: 'info@mot.gov.sa',
                        website: 'https://www.mot.gov.sa',
                        address: { ar: 'الرياض', en: 'Riyadh' }
                    },
                    {
                        name: { ar: 'وزارة الاتصالات', en: 'Ministry of Communications' },
                        minister: { ar: 'عبدالله السواحة', en: 'Abdullah Al-Swaha' },
                        responsibility: { ar: 'قطاع الاتصالات وتقنية المعلومات', en: 'Communications and IT Sector' },
                        phone: '+966-11-4055555',
                        email: 'info@mcit.gov.sa',
                        website: 'https://www.mcit.gov.sa',
                        address: { ar: 'الرياض', en: 'Riyadh' }
                    },
                    {
                        name: { ar: 'وزارة العمل', en: 'Ministry of Labor' },
                        minister: { ar: 'أحمد الراجحي', en: 'Ahmed Al-Rajhi' },
                        responsibility: { ar: 'سوق العمل والتوظيف', en: 'Labor Market and Employment' },
                        phone: '+966-11-4055555',
                        email: 'info@mlsd.gov.sa',
                        website: 'https://www.mlsd.gov.sa',
                        address: { ar: 'الرياض', en: 'Riyadh' }
                    },
                    {
                        name: { ar: 'وزارة التعليم', en: 'Ministry of Education' },
                        minister: { ar: 'يوسف البنيان', en: 'Youssef Al-Benyan' },
                        responsibility: { ar: 'قطاع التعليم والتدريب', en: 'Education and Training Sector' },
                        phone: '+966-11-4055555',
                        email: 'info@moe.gov.sa',
                        website: 'https://www.moe.gov.sa',
                        address: { ar: 'الرياض', en: 'Riyadh' }
                    },
                    {
                        name: { ar: 'وزارة الصحة', en: 'Ministry of Health' },
                        minister: { ar: 'فهد الجلاجل', en: 'Fahad Al-Jalajel' },
                        responsibility: { ar: 'قطاع الرعاية الصحية', en: 'Healthcare Sector' },
                        phone: '+966-11-4055555',
                        email: 'info@moh.gov.sa',
                        website: 'https://www.moh.gov.sa',
                        address: { ar: 'الرياض', en: 'Riyadh' }
                    },
                    {
                        name: { ar: 'وزارة الإسكان', en: 'Ministry of Housing' },
                        minister: { ar: 'مجيد الحقيل', en: 'Majid Al-Hogail' },
                        responsibility: { ar: 'قطاع الإسكان والتعمير', en: 'Housing and Construction Sector' },
                        phone: '+966-11-4055555',
                        email: 'info@moh.gov.sa',
                        website: 'https://www.moh.gov.sa',
                        address: { ar: 'الرياض', en: 'Riyadh' }
                    },
                    {
                        name: { ar: 'وزارة السياحة', en: 'Ministry of Tourism' },
                        minister: { ar: 'أحمد الخطيب', en: 'Ahmed Al-Khateeb' },
                        responsibility: { ar: 'قطاع السياحة والتراث', en: 'Tourism and Heritage Sector' },
                        phone: '+966-11-4055555',
                        email: 'info@tourism.gov.sa',
                        website: 'https://www.tourism.gov.sa',
                        address: { ar: 'الرياض', en: 'Riyadh' }
                    },
                    {
                        name: { ar: 'وزارة البيئة', en: 'Ministry of Environment' },
                        minister: { ar: 'عبدالرحمن الفضلي', en: 'Abdulrahman Al-Fadhli' },
                        responsibility: { ar: 'حماية البيئة والموارد الطبيعية', en: 'Environmental Protection and Natural Resources' },
                        phone: '+966-11-4055555',
                        email: 'environment@moea.gov.sa',
                        website: 'https://www.moea.gov.sa',
                        address: { ar: 'الرياض', en: 'Riyadh' }
                    },
                    {
                        name: { ar: 'وزارة الرياضة', en: 'Ministry of Sports' },
                        minister: { ar: 'عبدالعزيز بن تركي', en: 'Abdulaziz bin Turki' },
                        responsibility: { ar: 'قطاع الرياضة والشباب', en: 'Sports and Youth Sector' },
                        phone: '+966-11-4055555',
                        email: 'info@mosd.gov.sa',
                        website: 'https://www.mosd.gov.sa',
                        address: { ar: 'الرياض', en: 'Riyadh' }
                    },
                    {
                        name: { ar: 'وزارة الثقافة', en: 'Ministry of Culture' },
                        minister: { ar: 'بدر بن عبدالله بن فرحان', en: 'Bader bin Abdullah bin Farhan' },
                        responsibility: { ar: 'قطاع الثقافة والفنون', en: 'Culture and Arts Sector' },
                        phone: '+966-11-4055555',
                        email: 'info@moc.gov.sa',
                        website: 'https://www.moc.gov.sa',
                        address: { ar: 'الرياض', en: 'Riyadh' }
                    },
                    {
                        name: { ar: 'وزارة الإعلام', en: 'Ministry of Media' },
                        minister: { ar: 'مجيد القصبي', en: 'Majid Al-Qasabi' },
                        responsibility: { ar: 'قطاع الإعلام والنشر', en: 'Media and Publishing Sector' },
                        phone: '+966-11-4055555',
                        email: 'info@moi.gov.sa',
                        website: 'https://www.moi.gov.sa',
                        address: { ar: 'الرياض', en: 'Riyadh' }
                    },
                    {
                        name: { ar: 'وزارة الاقتصاد', en: 'Ministry of Economy' },
                        minister: { ar: 'فيصل بن فهد', en: 'Faisal bin Fahd' },
                        responsibility: { ar: 'التخطيط الاقتصادي', en: 'Economic Planning' },
                        phone: '+966-11-4055555',
                        email: 'info@moec.gov.sa',
                        website: 'https://www.moec.gov.sa',
                        address: { ar: 'الرياض', en: 'Riyadh' }
                    },
                    {
                        name: { ar: 'وزارة الشؤون الإسلامية', en: 'Ministry of Islamic Affairs' },
                        minister: { ar: 'عبداللطيف بن عبدالعزيز', en: 'Abdullatif bin Abdulaziz' },
                        responsibility: { ar: 'الشؤون الإسلامية والأوقاف', en: 'Islamic Affairs and Endowments' },
                        phone: '+966-11-4055555',
                        email: 'info@moia.gov.sa',
                        website: 'https://www.moia.gov.sa',
                        address: { ar: 'الرياض', en: 'Riyadh' }
                    },
                    {
                        name: { ar: 'وزارة الحج والعمرة', en: 'Ministry of Hajj and Umrah' },
                        minister: { ar: 'توفيق الرابوع', en: 'Tawfiq Al-Rabiah' },
                        responsibility: { ar: 'تنظيم الحج والعمرة', en: 'Hajj and Umrah Organization' },
                        phone: '+966-11-4055555',
                        email: 'info@haj.gov.sa',
                        website: 'https://www.haj.gov.sa',
                        address: { ar: 'الرياض', en: 'Riyadh' }
                    },
                    {
                        name: { ar: 'وزارة الشؤون البلدية', en: 'Ministry of Municipal Affairs' },
                        minister: { ar: 'مجيد الحقيل', en: 'Majid Al-Hogail' },
                        responsibility: { ar: 'الشؤون البلدية والقروية', en: 'Municipal and Rural Affairs' },
                        phone: '+966-11-4055555',
                        email: 'info@momra.gov.sa',
                        website: 'https://www.momra.gov.sa',
                        address: { ar: 'الرياض', en: 'Riyadh' }
                    },
                    {
                        name: { ar: 'وزارة الموارد البشرية', en: 'Ministry of Human Resources' },
                        minister: { ar: 'أحمد الراجحي', en: 'Ahmed Al-Rajhi' },
                        responsibility: { ar: 'الخدمة المدنية', en: 'Civil Service' },
                        phone: '+966-11-4055555',
                        email: 'info@hrsd.gov.sa',
                        website: 'https://www.hrsd.gov.sa',
                        address: { ar: 'الرياض', en: 'Riyadh' }
                    }
                ],
                executiveAgencies: [
                    {
                        name: { ar: 'هيئة تطوير الرياض', en: 'Royal Commission for Riyadh City' },
                        responsibility: { ar: 'تطوير مدينة الرياض', en: 'Development of Riyadh City' },
                        director: { ar: 'الأمير محمد بن عبدالرحمن', en: 'Prince Mohammed bin Abdulrahman' },
                        phone: '+966-1-4055555',
                        email: 'info@rcrc.gov.sa',
                        website: 'https://www.rcrc.gov.sa',
                        established: { ar: '1974', en: '1974' }
                    },
                    {
                        name: { ar: 'هيئة تطوير مكة المكرمة', en: 'Royal Commission for Makkah and Holy Sites' },
                        responsibility: { ar: 'تطوير مكة المكرمة والمشاعر المقدسة', en: 'Development of Makkah and Holy Sites' },
                        director: { ar: 'الأمير خالد الفيصل', en: 'Prince Khalid Al-Faisal' },
                        phone: '+966-12-5400000',
                        email: 'info@rcmoh.gov.sa',
                        website: 'https://www.rcmoh.gov.sa',
                        established: { ar: '2019', en: '2019' }
                    },
                    {
                        name: { ar: 'هيئة تطوير المنطقة الشرقية', en: 'Royal Commission for Eastern Province' },
                        responsibility: { ar: 'تطوير المنطقة الشرقية', en: 'Development of Eastern Province' },
                        director: { ar: 'الأمير سعود بن نايف', en: 'Prince Saud bin Naif' },
                        phone: '+966-13-8580000',
                        email: 'info@rcep.gov.sa',
                        website: 'https://www.rcep.gov.sa',
                        established: { ar: '2021', en: '2021' }
                    },
                    {
                        name: { ar: 'هيئة تطوير العلا', en: 'Royal Commission for Al-Ula' },
                        responsibility: { ar: 'تطوير محافظة العلا', en: 'Development of Al-Ula Governorate' },
                        director: { ar: 'الأمير بدر بن عبدالله بن فرحان', en: 'Prince Badr bin Abdullah bin Farhan' },
                        phone: '+966-14-4240000',
                        email: 'info@rcu.gov.sa',
                        website: 'https://www.rcu.gov.sa',
                        established: { ar: '2017', en: '2017' }
                    },
                    {
                        name: { ar: 'الهيئة السعودية للسياحة', en: 'Saudi Tourism Authority' },
                        responsibility: { ar: 'تنمية قطاع السياحة', en: 'Tourism Sector Development' },
                        director: { ar: 'فهد بن حماد', en: 'Fahad Hamad' },
                        phone: '+966-920000890',
                        email: 'info@tourism.sa',
                        website: 'https://www.tourism.sa',
                        established: { ar: '2020', en: '2020' }
                    },
                    {
                        name: { ar: 'الهيئة العامة للمنافسة', en: 'General Authority for Competition' },
                        responsibility: { ar: 'حماية وتعزيز المنافسة', en: 'Protecting and Promoting Competition' },
                        director: { ar: 'الدكتور ماجد القصبي', en: 'Dr. Majed Al-Qasabi' },
                        phone: '+966-11-4604444',
                        email: 'info@gac.gov.sa',
                        website: 'https://www.gac.gov.sa',
                        established: { ar: '2019', en: '2019' }
                    },
                    {
                        name: { ar: 'هيئة الزكاة والضريبة والجمارك', en: 'Zakat, Tax and Customs Authority' },
                        responsibility: { ar: 'جمع الزكاة والضرائب والجمارك', en: 'Collection of Zakat, Taxes and Customs' },
                        director: { ar: 'سهيد بن عبدالله الحربي', en: 'Suhail bin Abdullah Al-Harbi' },
                        phone: '+966-11-4195555',
                        email: 'info@zatca.gov.sa',
                        website: 'https://www.zatca.gov.sa',
                        established: { ar: '2004', en: '2004' }
                    },
                    {
                        name: { ar: 'الهيئة السعودية للبيانات والذكاء الاصطناعي', en: 'Saudi Data and AI Authority' },
                        responsibility: { ar: 'تنظيم قطاع البيانات والذكاء الاصطناعي', en: 'Regulation of Data and AI Sector' },
                        director: { ar: 'الدكتور عبدالله بن شرف', en: 'Dr. Abdullah bin Sharaf' },
                        phone: '+966-11-4660000',
                        email: 'info@sdaia.gov.sa',
                        website: 'https://www.sdaia.gov.sa',
                        established: { ar: '2019', en: '2019' }
                    },
                    {
                        name: { ar: 'هيئة المحامين', en: 'Saudi Authority for Lawyers' },
                        responsibility: { ar: 'تنظيم مهنة المحاماة', en: 'Regulation of Legal Profession' },
                        director: { ar: 'الدكتور ضيف الله بن محمد', en: 'Dr. Dhaif Allah bin Mohammed' },
                        phone: '+966-11-4555555',
                        email: 'info@saa.gov.sa',
                        website: 'https://www.saa.gov.sa',
                        established: { ar: '2020', en: '2020' }
                    },
                    {
                        name: { ar: 'الهيئة السعودية للمقيمين المعتمدين', en: 'Saudi Accredited Residents Program' },
                        responsibility: { ar: 'تنظيم إقامة المقيمين المعتمدين', en: 'Regulation of Accredited Residents' },
                        director: { ar: 'الدكتور عبدالعزيز السحيباني', en: 'Dr. Abdulaziz Al-Suhaibani' },
                        phone: '+966-11-4604444',
                        email: 'info@saudiresident.gov.sa',
                        website: 'https://www.saudiresident.gov.sa',
                        established: { ar: '2019', en: '2019' }
                    },
                    {
                        name: { ar: 'هيئة السوق المالية', en: 'Capital Market Authority' },
                        responsibility: { ar: 'تنظيم سوق المال', en: 'Regulation of Capital Market' },
                        director: { ar: 'محمد بن عبدالله القويز', en: 'Mohammed bin Abdullah Al-Kuwaiz' },
                        phone: '+966-11-4600000',
                        email: 'info@cma.org.sa',
                        website: 'https://www.cma.org.sa',
                        established: { ar: '2003', en: '2003' }
                    },
                    {
                        name: { ar: 'هيئة السوق المالية', en: 'Capital Market Authority' },
                        responsibility: { ar: 'تنظيم سوق المال', en: 'Regulation of Capital Market' },
                        director: { ar: 'محمد بن عبدالله القويز', en: 'Mohammed bin Abdullah Al-Kuwaiz' },
                        phone: '+966-11-4600000',
                        email: 'info@cma.org.sa',
                        website: 'https://www.cma.org.sa',
                        established: { ar: '2003', en: '2003' }
                    },
                    {
                        name: { ar: 'الهيئة السعودية للمهندسين', en: 'Saudi Engineering Authority' },
                        responsibility: { ar: 'تنظيم مهنة الهندسة', en: 'Regulation of Engineering Profession' },
                        director: { ar: 'الدكتور سعد بن عبدالله', en: 'Dr. Saad bin Abdullah' },
                        phone: '+966-11-4555555',
                        email: 'info@sea.gov.sa',
                        website: 'https://www.sea.gov.sa',
                        established: { ar: '2019', en: '2019' }
                    },
                    {
                        name: { ar: 'الهيئة السعودية للمحاسبين', en: 'Saudi Organization for Certified Public Accountants' },
                        responsibility: { ar: 'تنظيم مهنة المحاسبة', en: 'Regulation of Accounting Profession' },
                        director: { ar: 'الدكتور أحمد بن عبدالعزيز', en: 'Dr. Ahmed bin Abdulaziz' },
                        phone: '+966-11-4555555',
                        email: 'info@soCPa.gov.sa',
                        website: 'https://www.socpa.gov.sa',
                        established: { ar: '1992', en: '1992' }
                    },
                    {
                        name: { ar: 'الهيئة العامة للطيران المدني', en: 'General Authority of Civil Aviation' },
                        responsibility: { ar: 'تنظيم قطاع الطيران المدني', en: 'Regulation of Civil Aviation Sector' },
                        director: { ar: 'الأمير عبدالله بن سعود', en: 'Prince Abdullah bin Saud' },
                        phone: '+966-11-2210000',
                        email: 'info@gaca.gov.sa',
                        website: 'https://www.gaca.gov.sa',
                        established: { ar: '1975', en: '1975' }
                    },
                    {
                        name: { ar: 'الهيئة العامة للمنشآت الصغيرة والمتوسطة', en: 'General Authority for Small and Medium Enterprises' },
                        responsibility: { ar: 'دعم المنشآت الصغيرة والمتوسطة', en: 'Support for Small and Medium Enterprises' },
                        director: { ar: 'صالح بن إبراهيم', en: 'Saleh bin Ibrahim' },
                        phone: '+966-11-4604444',
                        email: 'info@monshaat.gov.sa',
                        website: 'https://www.monshaat.gov.sa',
                        established: { ar: '2016', en: '2016' }
                    },
                    {
                        name: { ar: 'هيئة تنمية الصادرات', en: 'Saudi Export Development Authority' },
                        responsibility: { ar: 'تنمية وتطوير الصادرات السعودية', en: 'Development of Saudi Exports' },
                        director: { ar: 'صالح بن سليمان', en: 'Saleh bin Sulaiman' },
                        phone: '+966-11-4604444',
                        email: 'info@saudiexports.gov.sa',
                        website: 'https://www.saudiexports.gov.sa',
                        established: { ar: '2019', en: '2019' }
                    },
                    {
                        name: { ar: 'الهيئة السعودية للمواصفات والمقاييس', en: 'Saudi Standards, Metrology and Quality Organization' },
                        responsibility: { ar: 'وضع المواصفات والمقاييس', en: 'Setting Standards and Specifications' },
                        director: { ar: 'سعد بن عثمان', en: 'Saad bin Othman' },
                        phone: '+966-11-4555555',
                        email: 'info@saso.gov.sa',
                        website: 'https://www.saso.gov.sa',
                        established: { ar: '1972', en: '1972' }
                    },
                    {
                        name: { ar: 'هيئة حقوق الإنسان', en: 'Human Rights Commission' },
                        responsibility: { ar: 'حماية وتعزيز حقوق الإنسان', en: 'Protection and Promotion of Human Rights' },
                        director: { ar: 'الدكتور عوض بن عوض', en: 'Dr. Awad bin Awad' },
                        phone: '+966-11-4555555',
                        email: 'info@hrc.gov.sa',
                        website: 'https://www.hrc.gov.sa',
                        established: { ar: '2005', en: '2005' }
                    },
                    {
                        name: { ar: 'هيئة الرقابة على الإعلام المرئي والمسموع', en: 'General Commission for Audiovisual Media' },
                        responsibility: { ar: 'الرقابة على المحتوى الإعلامي', en: 'Regulation of Audiovisual Content' },
                        director: { ar: 'إسماعيل بن حسن', en: 'Ismail bin Hassan' },
                        phone: '+966-11-4555555',
                        email: 'info@gcam.gov.sa',
                        website: 'https://www.gcam.gov.sa',
                        established: { ar: '2012', en: '2012' }
                    },
                    {
                        name: { ar: 'هيئة الإذاعة والتلفزيون', en: 'Saudi Broadcasting Authority' },
                        responsibility: { ar: 'إدارة القنوات التلفزيونية والإذاعية', en: 'Management of TV and Radio Channels' },
                        director: { ar: 'محمد بن عبدالله', en: 'Mohammed bin Abdullah' },
                        phone: '+966-11-4600000',
                        email: 'info@sba.gov.sa',
                        website: 'https://www.sba.gov.sa',
                        established: { ar: '2014', en: '2014' }
                    }
                ],
                executiveOffices: [
                    {
                        name: { ar: 'مجلس الشؤون الاقتصادية', en: 'Council of Economic Affairs' },
                        responsibility: { ar: 'تنسيق السياسات الاقتصادية', en: 'Economic Policy Coordination' },
                        chief: { ar: 'الأمير محمد بن سلمان', en: 'Crown Prince Mohammed bin Salman' },
                        phone: '+966-1-4055555',
                        email: 'info@cea.gov.sa',
                        website: 'https://www.cea.gov.sa'
                    }
                ],
                embassies: [
                    {
                        name: { ar: 'سفارة المملكة العربية السعودية في واشنطن', en: 'Embassy of Saudi Arabia in Washington' },
                        ambassador: { ar: 'الأميرة ريما بنت بندر بن سلطان', en: 'Princess Reema bint Bandar bin Sultan' },
                        address: { ar: '601 New Hampshire Ave NW, Washington, DC 20037', en: '601 New Hampshire Ave NW, Washington, DC 20037' },
                        phone: '+1-202-944-3125',
                        email: 'info@saudiembassy.net',
                        website: 'https://www.saudiembassy.net',
                        country: { ar: 'الولايات المتحدة الأمريكية', en: 'United States' },
                        consulate: false
                    },
                    {
                        name: { ar: 'سفارة المملكة العربية السعودية في لندن', en: 'Embassy of Saudi Arabia in London' },
                        ambassador: { ar: 'الأمير خالد بن بندر بن عبدالعزيز', en: 'Prince Khalid bin Bandar bin Abdulaziz' },
                        address: { ar: '30 Charles Street, London W1J 5DG', en: '30 Charles Street, London W1J 5DG' },
                        phone: '+44-20-7917-3000',
                        email: 'info@saudiembassy.org.uk',
                        website: 'https://www.saudiembassy.org.uk',
                        country: { ar: 'المملكة المتحدة', en: 'United Kingdom' },
                        consulate: false
                    },
                    {
                        name: { ar: 'سفارة المملكة العربية السعودية في باريس', en: 'Embassy of Saudi Arabia in Paris' },
                        ambassador: { ar: 'فهد بن عبدالرحمن الرويس', en: 'Fahad bin Abdulrahman Alruwais' },
                        address: { ar: '1 Rue de la Faisanderie, 75116 Paris', en: '1 Rue de la Faisanderie, 75116 Paris' },
                        phone: '+33-1-53-93-15-00',
                        email: 'ambassade.paris@mofa.gov.sa',
                        website: 'https://www.mofa.gov.sa/sites/default/files/2021-01/embassy_paris_fr.pdf',
                        country: { ar: 'فرنسا', en: 'France' },
                        consulate: false
                    },
                    {
                        name: { ar: 'سفارة المملكة العربية السعودية في برلين', en: 'Embassy of Saudi Arabia in Berlin' },
                        ambassador: { ar: 'عبدالله بن فهد الخثلان', en: 'Abdullah bin Fahd Alkathran' },
                        address: { ar: 'Rauchstraße 87, 10787 Berlin', en: 'Rauchstraße 87, 10787 Berlin' },
                        phone: '+49-30-5015-0',
                        email: 'info@saudi-embassy.de',
                        website: 'https://www.saudi-embassy.de',
                        country: { ar: 'ألمانيا', en: 'Germany' },
                        consulate: false
                    },
                    {
                        name: { ar: 'سفارة المملكة العربية السعودية في بكين', en: 'Embassy of Saudi Arabia in Beijing' },
                        ambassador: { ar: 'عبدالرحمن الحواري', en: 'Abdulrahman Al-Hawari' },
                        address: { ar: 'No. 2, Xiushui Beijie, Beijing 100600', en: 'No. 2, Xiushui Beijie, Beijing 100600' },
                        phone: '+86-10-6532-4825',
                        email: 'saudiembassy.cn@mofa.gov.sa',
                        website: 'https://www.mofa.gov.sa/sites/default/files/2020-05/china.pdf',
                        country: { ar: 'الصين', en: 'China' },
                        consulate: false
                    },
                    {
                        name: { ar: 'سفارة المملكة العربية السعودية في طوكيو', en: 'Embassy of Saudi Arabia in Tokyo' },
                        ambassador: { ar: 'نايف بن فهد الفهيد', en: 'Naif bin Fahad Al-Fuhaid' },
                        address: { ar: '4-9-7, Moto-Azabu, Minato-ku, Tokyo 106-0046', en: '4-9-7, Moto-Azabu, Minato-ku, Tokyo 106-0046' },
                        phone: '+81-3-3583-0751',
                        email: 'saudiembassy.jp@mofa.gov.sa',
                        website: 'https://www.mofa.gov.sa/sites/default/files/2021-01/japan.pdf',
                        country: { ar: 'اليابان', en: 'Japan' },
                        consulate: false
                    }
                ],
                consulates: [
                    {
                        name: { ar: 'القنصلية العامة السعودية في نيويورك', en: 'Consulate General of Saudi Arabia in New York' },
                        consul: { ar: 'نايف بن فهد الفهيد', en: 'Naif bin Fahad Al-Fuhaid' },
                        address: { ar: '866 Second Avenue, New York, NY 10022', en: '866 Second Avenue, New York, NY 10022' },
                        phone: '+1-212-755-0940',
                        email: 'cgnyc@mofa.gov.sa',
                        website: 'https://www.mofa.gov.sa/sites/default/files/2021-01/new_york.pdf',
                        country: { ar: 'الولايات المتحدة الأمريكية', en: 'United States' },
                        city: { ar: 'نيويورك', en: 'New York' }
                    },
                    {
                        name: { ar: 'القنصلية العامة السعودية في لوس أنجلوس', en: 'Consulate General of Saudi Arabia in Los Angeles' },
                        consul: { ar: 'نايف بن فهد الفهيد', en: 'Naif bin Fahad Al-Fuhaid' },
                        address: { ar: '825 Wilshire Blvd., Suite 800, Los Angeles, CA 90017', en: '825 Wilshire Blvd., Suite 800, Los Angeles, CA 90017' },
                        phone: '+1-213-629-7777',
                        email: 'cgla@mofa.gov.sa',
                        website: 'https://www.mofa.gov.sa/sites/default/files/2021-01/los_angeles.pdf',
                        country: { ar: 'الولايات المتحدة الأمريكية', en: 'United States' },
                        city: { ar: 'لوس أنجلوس', en: 'Los Angeles' }
                    },
                    {
                        name: { ar: 'القنصلية العامة السعودية في هيوستن', en: 'Consulate General of Saudi Arabia in Houston' },
                        consul: { ar: 'نايف بن فهد الفهيد', en: 'Naif bin Fahad Al-Fuhaid' },
                        address: { ar: '5718 Hillcroft Street, Houston, TX 77036', en: '5718 Hillcroft Street, Houston, TX 77036' },
                        phone: '+1-713-782-6175',
                        email: 'cghou@mofa.gov.sa',
                        website: 'https://www.mofa.gov.sa/sites/default/files/2021-01/houston.pdf',
                        country: { ar: 'الولايات المتحدة الأمريكية', en: 'United States' },
                        city: { ar: 'هيوستن', en: 'Houston' }
                    }
                ],
                commercialOffices: [
                    {
                        name: { ar: 'الملحقية التجارية السعودية في واشنطن', en: 'Saudi Commercial Office in Washington' },
                        director: { ar: 'الدكتور عبدالله بن أحمد', en: 'Dr. Abdullah bin Ahmed' },
                        address: { ar: '601 New Hampshire Ave NW, Washington, DC 20037', en: '601 New Hampshire Ave NW, Washington, DC 20037' },
                        phone: '+1-202-944-3125',
                        email: 'commercial.washington@saudi-embassy.net',
                        website: 'https://www.saudi-embassy.net/commercial-office',
                        country: { ar: 'الولايات المتحدة الأمريكية', en: 'United States' },
                        services: { ar: 'دعم التجارة والاستثمار', en: 'Trade and Investment Support' }
                    },
                    {
                        name: { ar: 'الملحقية التجارية السعودية في لندن', en: 'Saudi Commercial Office in London' },
                        director: { ar: 'الدكتور خالد بن محمد', en: 'Dr. Khalid bin Mohammed' },
                        address: { ar: '30 Charles Street, London W1J 5DG', en: '30 Charles Street, London W1J 5DG' },
                        phone: '+44-20-7917-3000',
                        email: 'commercial.london@saudiembassy.org.uk',
                        website: 'https://www.saudiembassy.org.uk/commercial-office',
                        country: { ar: 'المملكة المتحدة', en: 'United Kingdom' },
                        services: { ar: 'دعم التجارة والاستثمار', en: 'Trade and Investment Support' }
                    },
                    {
                        name: { ar: 'الملحقية التجارية السعودية في بكين', en: 'Saudi Commercial Office in Beijing' },
                        director: { ar: 'الدكتور محمد بن عبدالله', en: 'Dr. Mohammed bin Abdullah' },
                        address: { ar: 'No. 2, Xiushui Beijie, Beijing 100600', en: 'No. 2, Xiushui Beijie, Beijing 100600' },
                        phone: '+86-10-6532-4825',
                        email: 'commercial.beijing@mofa.gov.sa',
                        website: 'https://www.mofa.gov.sa/commercial/beijing',
                        country: { ar: 'الصين', en: 'China' },
                        services: { ar: 'دعم التجارة والاستثمار', en: 'Trade and Investment Support' }
                    }
                ],
                economy: {
                    exports: [
                        { product: { ar: 'النفط الخام', en: 'Crude Oil' }, value: { ar: '182 مليار دولار', en: '$182 billion' }, percentage: '56.3%' },
                        { product: { ar: 'البترول المكرر', en: 'Refined Petroleum' }, value: { ar: '45 مليار دولار', en: '$45 billion' }, percentage: '13.9%' },
                        { product: { ar: 'المواد الكيميائية', en: 'Chemicals' }, value: { ar: '22 مليار دولار', en: '$22 billion' }, percentage: '6.8%' },
                        { product: { ar: 'البلاستيك', en: 'Plastics' }, value: { ar: '18 مليار دولار', en: '$18 billion' }, percentage: '5.6%' },
                        { product: { ar: 'الغاز الطبيعي', en: 'Natural Gas' }, value: { ar: '15 مليار دولار', en: '$15 billion' }, percentage: '4.6%' }
                    ],
                    imports: [
                        { product: { ar: 'الآلات', en: 'Machinery' }, value: { ar: '35 مليار دولار', en: '$35 billion' }, percentage: '22.4%' },
                        { product: { ar: 'المركبات', en: 'Vehicles' }, value: { ar: '28 مليار دولار', en: '$28 billion' }, percentage: '17.9%' },
                        { product: { ar: 'المعدات الكهربائية', en: 'Electrical Equipment' }, value: { ar: '22 مليار دولار', en: '$22 billion' }, percentage: '14.1%' },
                        { product: { ar: 'المعادن', en: 'Metals' }, value: { ar: '18 مليار دولار', en: '$18 billion' }, percentage: '11.5%' },
                        { product: { ar: 'المواد الغذائية', en: 'Food Products' }, value: { ar: '15 مليار دولار', en: '$15 billion' }, percentage: '9.6%' }
                    ]
                },
                statistics: {
                    area: { ar: '2.15 مليون كم²', en: '2.15 million km²' },
                    coastline: { ar: '2,640 كم', en: '2,640 km' },
                    climate: { ar: 'صحراوي حار', en: 'Desert hot' },
                    timezone: { ar: 'GMT+3', en: 'GMT+3' },
                    callingCode: '+966',
                    domain: '.sa',
                    currencyCode: 'SAR'
                }
            },
            'united-states': {
                names: { ar: 'الولايات المتحدة الأمريكية', en: 'United States' },
                flags: { ar: '🇺🇸', en: '🇺🇸' },
                codes: ['US', 'USA', 'أمريكا', 'United States', 'America'],
                basicInfo: {
                    capital: { ar: 'واشنطن العاصمة', en: 'Washington D.C.' },
                    region: { ar: 'أمريكا الشمالية', en: 'North America' },
                    population: { ar: '331 مليون نسمة', en: '331 million' },
                    currency: { ar: 'دولار أمريكي', en: 'US Dollar' },
                    language: { ar: 'الإنجليزية', en: 'English' },
                    gdp: { ar: '25.5 تريليون دولار', en: '$25.5 trillion' },
                    gdpPerCapita: { ar: '76,330 دولار', en: '$76,330' }
                },
                leadership: [
                    {
                        title: { ar: 'الرئيس', en: 'President' },
                        name: { ar: 'جو بايدن', en: 'Joe Biden' },
                        position: { ar: 'رئيس الولايات المتحدة', en: 'President of the United States' },
                        term: { ar: 'منذ 2021', en: 'Since 2021' },
                        phone: '+1-202-456-1111',
                        email: 'president@whitehouse.gov',
                        photo: 'https://example.com/biden.jpg'
                    },
                    {
                        title: { ar: 'نائب الرئيس', en: 'Vice President' },
                        name: { ar: 'كامالا هاريس', en: 'Kamala Harris' },
                        position: { ar: 'نائبة رئيس الولايات المتحدة', en: 'Vice President of the United States' },
                        term: { ar: 'منذ 2021', en: 'Since 2021' },
                        phone: '+1-202-456-1111',
                        email: 'vicepresident@whitehouse.gov',
                        photo: 'https://example.com/harris.jpg'
                    }
                ],
                ministries: [
                    {
                        name: { ar: 'وزارة الخارجية', en: 'Department of State' },
                        minister: { ar: 'أنتوني بلينكن', en: 'Antony Blinken' },
                        responsibility: { ar: 'العلاقات الخارجية', en: 'Foreign Relations' },
                        phone: '+1-202-647-7200',
                        email: 'contact@state.gov',
                        website: 'https://www.state.gov',
                        address: { ar: 'واشنطن العاصمة', en: 'Washington D.C.' }
                    },
                    {
                        name: { ar: 'وزارة الخزانة', en: 'Department of Treasury' },
                        minister: { ar: 'جانيت يلين', en: 'Janet Yellen' },
                        responsibility: { ar: 'السياسة المالية', en: 'Financial Policy' },
                        phone: '+1-202-622-2000',
                        email: 'treasury@treasury.gov',
                        website: 'https://www.treasury.gov',
                        address: { ar: 'واشنطن العاصمة', en: 'Washington D.C.' }
                    }
                ],
                executiveAgencies: [
                    {
                        name: { ar: 'وكالة المخابرات المركزية', en: 'Central Intelligence Agency' },
                        responsibility: { ar: 'جمع المعلومات الاستخباراتية', en: 'Intelligence Gathering' },
                        director: { ar: 'ويليام بيرنز', en: 'William Burns' },
                        phone: '+1-703-613-1300',
                        email: 'info@cia.gov',
                        website: 'https://www.cia.gov',
                        established: { ar: '1947', en: '1947' }
                    }
                ],
                executiveOffices: [
                    {
                        name: { ar: 'مكتب البيت الأبيض', en: 'White House Office' },
                        responsibility: { ar: 'دعم الرئيس', en: 'Presidential Support' },
                        chief: { ar: 'رون كلاين', en: 'Ron Klain' },
                        phone: '+1-202-456-1414',
                        email: 'whitehouse@whitehouse.gov',
                        website: 'https://www.whitehouse.gov'
                    }
                ],
                economy: {
                    exports: [
                        { product: { ar: 'الطائرات', en: 'Aircraft' }, value: { ar: '130 مليار دولار', en: '$130 billion' }, percentage: '8.5%' },
                        { product: { ar: 'السيارات', en: 'Vehicles' }, value: { ar: '125 مليار دولار', en: '$125 billion' }, percentage: '8.2%' },
                        { product: { ar: 'المعدات الطبية', en: 'Medical Equipment' }, value: { ar: '85 مليار دولار', en: '$85 billion' }, percentage: '5.6%' },
                        { product: { ar: 'المنتجات التكنولوجية', en: 'Technology Products' }, value: { ar: '75 مليار دولار', en: '$75 billion' }, percentage: '4.9%' },
                        { product: { ar: 'الأسلحة', en: 'Weapons' }, value: { ar: '70 مليار دولار', en: '$70 billion' }, percentage: '4.6%' }
                    ],
                    imports: [
                        { product: { ar: 'السيارات', en: 'Vehicles' }, value: { ar: '140 مليار دولار', en: '$140 billion' }, percentage: '12.3%' },
                        { product: { ar: 'الإلكترونيات', en: 'Electronics' }, value: { ar: '120 مليار دولار', en: '$120 billion' }, percentage: '10.5%' },
                        { product: { ar: 'الأدوية', en: 'Pharmaceuticals' }, value: { ar: '95 مليار دولار', en: '$95 billion' }, percentage: '8.3%' },
                        { product: { ar: 'الملابس', en: 'Clothing' }, value: { ar: '85 مليار دولار', en: '$85 billion' }, percentage: '7.5%' },
                        { product: { ar: 'الأثاث', en: 'Furniture' }, value: { ar: '65 مليار دولار', en: '$65 billion' }, percentage: '5.7%' }
                    ]
                },
                statistics: {
                    area: { ar: '9.8 مليون كم²', en: '9.8 million km²' },
                    coastline: { ar: '19,924 كم', en: '19,924 km' },
                    climate: { ar: 'متنوع', en: 'Diverse' },
                    timezone: { ar: 'GMT-5 إلى GMT-10', en: 'GMT-5 to GMT-10' },
                    callingCode: '+1',
                    domain: '.us',
                    currencyCode: 'USD'
                }
            },
            'china': {
                names: { ar: 'جمهورية الصين الشعبية', en: 'People\'s Republic of China' },
                flags: { ar: '🇨🇳', en: '🇨🇳' },
                codes: ['CN', 'CHN', 'China', 'الصين'],
                basicInfo: {
                    capital: { ar: 'بكين', en: 'Beijing' },
                    region: { ar: 'شرق آسيا', en: 'East Asia' },
                    population: { ar: '1.4 مليار نسمة', en: '1.4 billion' },
                    currency: { ar: 'يوان صيني', en: 'Chinese Yuan' },
                    language: { ar: 'الصينية', en: 'Chinese' },
                    gdp: { ar: '17.7 تريليون دولار', en: '$17.7 trillion' },
                    gdpPerCapita: { ar: '12,560 دولار', en: '$12,560' }
                },
                leadership: [
                    {
                        title: { ar: 'الرئيس', en: 'President' },
                        name: { ar: 'شي جين بينغ', en: 'Xi Jinping' },
                        position: { ar: 'رئيس جمهورية الصين الشعبية', en: 'President of the People\'s Republic of China' },
                        term: { ar: 'منذ 2013', en: 'Since 2013' },
                        phone: '+86-10-6309-1111',
                        email: 'president@gov.cn',
                        photo: 'https://example.com/xi.jpg'
                    }
                ],
                ministries: [
                    {
                        name: { ar: 'وزارة الخارجية', en: 'Ministry of Foreign Affairs' },
                        minister: { ar: 'وانغ يي', en: 'Wang Yi' },
                        responsibility: { ar: 'العلاقات الخارجية', en: 'Foreign Relations' },
                        phone: '+86-10-6596-1111',
                        email: 'webmaster@fmprc.gov.cn',
                        website: 'https://www.fmprc.gov.cn',
                        address: { ar: 'بكين', en: 'Beijing' }
                    }
                ],
                executiveAgencies: [
                    {
                        name: { ar: 'وكالة استخبارات الدولة', en: 'Ministry of State Security' },
                        responsibility: { ar: 'الأمن القومي', en: 'National Security' },
                        director: { ar: 'تشانغ وانغ', en: 'Zhang Wang' },
                        phone: '+86-10-6524-1111',
                        email: 'info@mps.gov.cn',
                        website: 'https://www.mps.gov.cn',
                        established: { ar: '1983', en: '1983' }
                    }
                ],
                economy: {
                    exports: [
                        { product: { ar: 'الإلكترونيات', en: 'Electronics' }, value: { ar: '850 مليار دولار', en: '$850 billion' }, percentage: '28.5%' },
                        { product: { ar: 'الآلات', en: 'Machinery' }, value: { ar: '680 مليار دولار', en: '$680 billion' }, percentage: '22.8%' },
                        { product: { ar: 'المنسوجات', en: 'Textiles' }, value: { ar: '250 مليار دولار', en: '$250 billion' }, percentage: '8.4%' },
                        { product: { ar: 'المنتجات المعدنية', en: 'Metal Products' }, value: { ar: '220 مليار دولار', en: '$220 billion' }, percentage: '7.4%' },
                        { product: { ar: 'البلاستيك', en: 'Plastics' }, value: { ar: '180 مليار دولار', en: '$180 billion' }, percentage: '6.0%' }
                    ],
                    imports: [
                        { product: { ar: 'الإلكترونيات', en: 'Electronics' }, value: { ar: '520 مليار دولار', en: '$520 billion' }, percentage: '18.5%' },
                        { product: { ar: 'النفط', en: 'Crude Oil' }, value: { ar: '380 مليار دولار', en: '$380 billion' }, percentage: '13.5%' },
                        { product: { ar: 'الغاز الطبيعي', en: 'Natural Gas' }, value: { ar: '280 مليار دولار', en: '$280 billion' }, percentage: '10.0%' },
                        { product: { ar: 'الخامات', en: 'Ore' }, value: { ar: '220 مليار دولار', en: '$220 billion' }, percentage: '7.8%' },
                        { product: { ar: 'السيارات', en: 'Vehicles' }, value: { ar: '180 مليار دولار', en: '$180 billion' }, percentage: '6.4%' }
                    ]
                },
                statistics: {
                    area: { ar: '9.6 مليون كم²', en: '9.6 million km²' },
                    coastline: { ar: '14,500 كم', en: '14,500 km' },
                    climate: { ar: 'متنوع', en: 'Diverse' },
                    timezone: { ar: 'GMT+5 إلى GMT+8', en: 'GMT+5 to GMT+8' },
                    callingCode: '+86',
                    domain: '.cn',
                    currencyCode: 'CNY'
                }
            },
            'germany': {
                names: { ar: 'جمهورية ألمانيا الاتحادية', en: 'Federal Republic of Germany' },
                flags: { ar: '🇩🇪', en: '🇩🇪' },
                codes: ['DE', 'DEU', 'Germany', 'ألمانيا'],
                basicInfo: {
                    capital: { ar: 'برلين', en: 'Berlin' },
                    region: { ar: 'أوروبا الوسطى', en: 'Central Europe' },
                    population: { ar: '83 مليون نسمة', en: '83 million' },
                    currency: { ar: 'يورو', en: 'Euro' },
                    language: { ar: 'الألمانية', en: 'German' },
                    gdp: { ar: '4.3 تريليون دولار', en: '$4.3 trillion' },
                    gdpPerCapita: { ar: '51,200 دولار', en: '$51,200' }
                },
                leadership: [
                    {
                        title: { ar: 'المستشار', en: 'Chancellor' },
                        name: { ar: 'أولاف شولتس', en: 'Olaf Scholz' },
                        position: { ar: 'مستشار ألمانيا', en: 'Chancellor of Germany' },
                        term: { ar: 'منذ 2021', en: 'Since 2021' },
                        phone: '+49-30-2207-0',
                        email: 'bundeskanzler@bk.bund.de',
                        photo: 'https://example.com/scholz.jpg'
                    }
                ],
                ministries: [
                    {
                        name: { ar: 'وزارة الخارجية', en: 'Federal Foreign Office' },
                        minister: { ar: 'أنالينا بيربوك', en: 'Annalena Baerbock' },
                        responsibility: { ar: 'العلاقات الخارجية', en: 'Foreign Relations' },
                        phone: '+49-30-1817-0',
                        email: 'post@auswaertiges-amt.de',
                        website: 'https://www.auswaertiges-amt.de',
                        address: { ar: 'برلين', en: 'Berlin' }
                    }
                ],
                economy: {
                    exports: [
                        { product: { ar: 'السيارات', en: 'Automobiles' }, value: { ar: '280 مليار دولار', en: '$280 billion' }, percentage: '15.2%' },
                        { product: { ar: 'الآلات', en: 'Machinery' }, value: { ar: '250 مليار دولار', en: '$250 billion' }, percentage: '13.6%' },
                        { product: { ar: 'المنتجات الكيميائية', en: 'Chemical Products' }, value: { ar: '180 مليار دولار', en: '$180 billion' }, percentage: '9.8%' },
                        { product: { ar: 'الإلكترونيات', en: 'Electronics' }, value: { ar: '150 مليار دولار', en: '$150 billion' }, percentage: '8.2%' },
                        { product: { ar: 'المعدات الطبية', en: 'Medical Equipment' }, value: { ar: '120 مليار دولار', en: '$120 billion' }, percentage: '6.5%' }
                    ],
                    imports: [
                        { product: { ar: 'السيارات', en: 'Automobiles' }, value: { ar: '140 مليار دولار', en: '$140 billion' }, percentage: '12.8%' },
                        { product: { ar: 'الآلات', en: 'Machinery' }, value: { ar: '120 مليار دولار', en: '$120 billion' }, percentage: '11.0%' },
                        { product: { ar: 'النفط', en: 'Crude Oil' }, value: { ar: '95 مليار دولار', en: '$95 billion' }, percentage: '8.7%' },
                        { product: { ar: 'الإلكترونيات', en: 'Electronics' }, value: { ar: '85 مليار دولار', en: '$85 billion' }, percentage: '7.8%' },
                        { product: { ar: 'الأدوية', en: 'Pharmaceuticals' }, value: { ar: '75 مليار دولار', en: '$75 billion' }, percentage: '6.9%' }
                    ]
                },
                statistics: {
                    area: { ar: '357,022 كم²', en: '357,022 km²' },
                    coastline: { ar: '2,389 كم', en: '2,389 km' },
                    climate: { ar: 'معتدل', en: 'Temperate' },
                    timezone: { ar: 'GMT+1', en: 'GMT+1' },
                    callingCode: '+49',
                    domain: '.de',
                    currencyCode: 'EUR'
                }
            },
            'japan': {
                names: { ar: 'اليابان', en: 'Japan' },
                flags: { ar: '🇯🇵', en: '🇯🇵' },
                codes: ['JP', 'JPN', 'Japan', 'اليابان'],
                basicInfo: {
                    capital: { ar: 'طوكيو', en: 'Tokyo' },
                    region: { ar: 'شرق آسيا', en: 'East Asia' },
                    population: { ar: '125 مليون نسمة', en: '125 million' },
                    currency: { ar: 'ين ياباني', en: 'Japanese Yen' },
                    language: { ar: 'اليابانية', en: 'Japanese' },
                    gdp: { ar: '4.2 تريليون دولار', en: '$4.2 trillion' },
                    gdpPerCapita: { ar: '33,600 دولار', en: '$33,600' }
                },
                leadership: [
                    {
                        title: { ar: 'رئيس الوزراء', en: 'Prime Minister' },
                        name: { ar: 'فوميو كيشيدا', en: 'Fumio Kishida' },
                        position: { ar: 'رئيس وزراء اليابان', en: 'Prime Minister of Japan' },
                        term: { ar: 'منذ 2021', en: 'Since 2021' },
                        phone: '+81-3-5253-2111',
                        email: 'prime-minister@kantei.go.jp',
                        photo: 'https://example.com/kishida.jpg'
                    }
                ],
                ministries: [
                    {
                        name: { ar: 'وزارة الخارجية', en: 'Ministry of Foreign Affairs' },
                        minister: { ar: 'يوكو كاميكاوا', en: 'Yoko Kamikawa' },
                        responsibility: { ar: 'العلاقات الخارجية', en: 'Foreign Relations' },
                        phone: '+81-3-3581-3311',
                        email: 'mof-info@mofa.go.jp',
                        website: 'https://www.mofa.go.jp',
                        address: { ar: 'طوكيو', en: 'Tokyo' }
                    }
                ],
                economy: {
                    exports: [
                        { product: { ar: 'السيارات', en: 'Automobiles' }, value: { ar: '150 مليار دولار', en: '$150 billion' }, percentage: '18.5%' },
                        { product: { ar: 'الإلكترونيات', en: 'Electronics' }, value: { ar: '120 مليار دولار', en: '$120 billion' }, percentage: '14.8%' },
                        { product: { ar: 'الآلات', en: 'Machinery' }, value: { ar: '95 مليار دولار', en: '$95 billion' }, percentage: '11.7%' },
                        { product: { ar: 'الفولاذ', en: 'Steel' }, value: { ar: '45 مليار دولار', en: '$45 billion' }, percentage: '5.5%' },
                        { product: { ar: 'المنتجات الكيميائية', en: 'Chemical Products' }, value: { ar: '40 مليار دولار', en: '$40 billion' }, percentage: '4.9%' }
                    ],
                    imports: [
                        { product: { ar: 'النفط', en: 'Crude Oil' }, value: { ar: '110 مليار دولار', en: '$110 billion' }, percentage: '16.2%' },
                        { product: { ar: 'الغاز الطبيعي', en: 'Natural Gas' }, value: { ar: '85 مليار دولار', en: '$85 billion' }, percentage: '12.5%' },
                        { product: { ar: 'الإلكترونيات', en: 'Electronics' }, value: { ar: '75 مليار دولار', en: '$75 billion' }, percentage: '11.0%' },
                        { product: { ar: 'الفحم', en: 'Coal' }, value: { ar: '65 مليار دولار', en: '$65 billion' }, percentage: '9.6%' },
                        { product: { ar: 'الخامات', en: 'Ore' }, value: { ar: '55 مليار دولار', en: '$55 billion' }, percentage: '8.1%' }
                    ]
                },
                statistics: {
                    area: { ar: '377,975 كم²', en: '377,975 km²' },
                    coastline: { ar: '29,751 كم', en: '29,751 km' },
                    climate: { ar: 'معتدل', en: 'Temperate' },
                    timezone: { ar: 'GMT+9', en: 'GMT+9' },
                    callingCode: '+81',
                    domain: '.jp',
                    currencyCode: 'JPY'
                }
            },
            'france': {
                names: { ar: 'جمهورية فرنسا', en: 'French Republic' },
                flags: { ar: '🇫🇷', en: '🇫🇷' },
                codes: ['FR', 'FRA', 'France', 'فرنسا'],
                basicInfo: {
                    capital: { ar: 'باريس', en: 'Paris' },
                    region: { ar: 'أوروبا الغربية', en: 'Western Europe' },
                    population: { ar: '67 مليون نسمة', en: '67 million' },
                    currency: { ar: 'يورو', en: 'Euro' },
                    language: { ar: 'الفرنسية', en: 'French' },
                    gdp: { ar: '2.9 تريليون دولار', en: '$2.9 trillion' },
                    gdpPerCapita: { ar: '43,300 دولار', en: '$43,300' }
                },
                leadership: [
                    {
                        title: { ar: 'الرئيس', en: 'President' },
                        name: { ar: 'إيمانويل ماكرون', en: 'Emmanuel Macron' },
                        position: { ar: 'رئيس الجمهورية الفرنسية', en: 'President of the French Republic' },
                        term: { ar: 'منذ 2017', en: 'Since 2017' },
                        phone: '+33-1-42-92-81-00',
                        email: 'contact@elysee.fr',
                        photo: 'https://example.com/macron.jpg'
                    }
                ],
                ministries: [
                    {
                        name: { ar: 'وزارة الخارجية', en: 'Ministry of Foreign Affairs' },
                        minister: { ar: 'كاترين كولونا', en: 'Catherine Colonna' },
                        responsibility: { ar: 'العلاقات الخارجية', en: 'Foreign Relations' },
                        phone: '+33-1-43-17-53-35',
                        email: 'contact@diplomatie.gouv.fr',
                        website: 'https://www.diplomatie.gouv.fr',
                        address: { ar: 'باريس', en: 'Paris' }
                    }
                ],
                economy: {
                    exports: [
                        { product: { ar: 'الطائرات', en: 'Aircraft' }, value: { ar: '85 مليار دولار', en: '$85 billion' }, percentage: '12.8%' },
                        { product: { ar: 'الأدوية', en: 'Pharmaceuticals' }, value: { ar: '65 مليار دولار', en: '$65 billion' }, percentage: '9.8%' },
                        { product: { ar: 'السيارات', en: 'Automobiles' }, value: { ar: '55 مليار دولار', en: '$55 billion' }, percentage: '8.3%' },
                        { product: { ar: 'المنتجات الكيميائية', en: 'Chemical Products' }, value: { ar: '45 مليار دولار', en: '$45 billion' }, percentage: '6.8%' },
                        { product: { ar: 'الأغذية والمشروبات', en: 'Food & Beverages' }, value: { ar: '40 مليار دولار', en: '$40 billion' }, percentage: '6.0%' }
                    ],
                    imports: [
                        { product: { ar: 'السيارات', en: 'Automobiles' }, value: { ar: '60 مليار دولار', en: '$60 billion' }, percentage: '11.5%' },
                        { product: { ar: 'النفط', en: 'Crude Oil' }, value: { ar: '55 مليار دولار', en: '$55 billion' }, percentage: '10.5%' },
                        { product: { ar: 'الإلكترونيات', en: 'Electronics' }, value: { ar: '45 مليار دولار', en: '$45 billion' }, percentage: '8.6%' },
                        { product: { ar: 'الآلات', en: 'Machinery' }, value: { ar: '40 مليار دولار', en: '$40 billion' }, percentage: '7.6%' },
                        { product: { ar: 'الأدوية', en: 'Pharmaceuticals' }, value: { ar: '35 مليار دولار', en: '$35 billion' }, percentage: '6.7%' }
                    ]
                },
                statistics: {
                    area: { ar: '643,801 كم²', en: '643,801 km²' },
                    coastline: { ar: '4,853 كم', en: '4,853 km' },
                    climate: { ar: 'معتدل', en: 'Temperate' },
                    timezone: { ar: 'GMT+1', en: 'GMT+1' },
                    callingCode: '+33',
                    domain: '.fr',
                    currencyCode: 'EUR'
                }
            }
        };

        // Initialize countries map
        Object.keys(countriesData).forEach(key => {
            this.countries.set(key, countriesData[key]);
        });
    }

    searchCountry(query, language = 'ar') {
        const queryLower = query.toLowerCase().trim();

        // Search by country key
        if (this.countries.has(queryLower)) {
            return this.formatCountryData(this.countries.get(queryLower), language);
        }

        // Search by codes and names
        for (const [key, country] of this.countries) {
            if (country.codes.some(code => code.toLowerCase() === queryLower)) {
                return this.formatCountryData(country, language);
            }
        }

        return null;
    }

    formatCountryData(country, lang = 'ar') {
        return {
            names: country.names,
            flags: country.flags,
            codes: country.codes,
            basicInfo: {
                name: country.names[lang],
                capital: country.basicInfo.capital[lang],
                region: country.basicInfo.region[lang],
                population: country.basicInfo.population[lang],
                currency: country.basicInfo.currency[lang],
                language: country.basicInfo.language[lang],
                gdp: country.basicInfo.gdp[lang],
                gdpPerCapita: country.basicInfo.gdpPerCapita[lang]
            },
            leadership: country.leadership,
            ministries: country.ministries,
            executiveAgencies: country.executiveAgencies,
            executiveOffices: country.executiveOffices,
            embassies: country.embassies,
            consulates: country.consulates,
            commercialOffices: country.commercialOffices,
            economy: {
                exports: country.economy.exports.map(exportItem => ({
                    product: exportItem.product[lang],
                    value: exportItem.value[lang],
                    percentage: exportItem.percentage
                })),
                imports: country.economy.imports.map(importItem => ({
                    product: importItem.product[lang],
                    value: importItem.value[lang],
                    percentage: importItem.percentage
                }))
            },
            embassies: country.embassies,
            consulates: country.consulates,
            commercialOffices: country.commercialOffices,
            economy: {
                exports: country.economy.exports.map(exportItem => ({
                    product: exportItem.product[lang],
                    value: exportItem.value[lang],
                    percentage: exportItem.percentage
                })),
                imports: country.economy.imports.map(importItem => ({
                    product: importItem.product[lang],
                    value: importItem.value[lang],
                    percentage: importItem.percentage
                }))
            },
            statistics: country.statistics,
            flag: country.flags[lang]
        };
    }

    getAllCountries(language = 'ar') {
        const countries = [];
        for (const [key, country] of this.countries) {
            countries.push({
                key: key,
                name: country.names[language],
                flag: country.flags[language],
                codes: country.codes
            });
        }
        return countries.sort((a, b) => a.name.localeCompare(b.name, language === 'ar' ? 'ar' : 'en'));
    }

    getCountryCount() {
        return this.countries.size;
    }

    getAvailableCountries() {
        return Array.from(this.countries.keys());
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GovernmentDataManager;
} else {
    window.GovernmentDataManager = GovernmentDataManager;
}

// Debug: Make sure it's available
console.log('🔧 GovernmentDataManager exported:', typeof window.GovernmentDataManager);
