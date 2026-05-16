// Internationalization Manager
export class I18nManager {
  constructor() {
    this.currentLanguage = 'en';
    this.translations = {
      en: {
        // Navigation
        logoTitle: 'International Investment Fund',
        logoSubtitle: 'Financing for Global Prosperity · All Nations Globally',
        navHome: 'Home',
        navAbout: 'About',
        navServices: 'Services',
        navSectors: 'Sectors',
        navContact: 'Contact',
        searchPlaceholder: 'Search site…',
        
        // Header
        signIn: 'Sign in',
        createAccount: 'Create account',
        dashboard: 'Dashboard',
        myProfile: 'My Profile',
        signOut: 'Sign out',
        
        // Hero
        heroTitle: 'International Investment Fund',
        heroSubtitle: 'Financing for Global Prosperity · Empowering Investments Worldwide',
        heroPrimaryAction: 'Get Started',
        heroSecondaryAction: 'Learn More',
        
        // Features
        featuresTitle: 'Why Choose IIF?',
        featuresSubtitle: 'Global expertise, local knowledge, and commitment to sustainable growth',
        feature1Title: 'Global Reach',
        feature1Description: 'Investment opportunities across continents with local market expertise',
        feature2Title: 'Professional Management',
        feature2Description: 'Experienced team with proven track record in international finance',
        feature3Title: 'Secure Investments',
        feature3Description: 'Robust risk management and compliance with international standards',
        feature4Title: 'Growth Focused',
        feature4Description: 'Strategic investments designed for long-term sustainable growth',
        feature5Title: 'Partnership Approach',
        feature5Description: 'Working closely with clients to achieve their investment objectives',
        feature6Title: 'Sustainable Future',
        feature6Description: 'Committed to environmental, social, and governance principles',
        
        // Footer
        footerAboutTitle: 'About IIF',
        footerAboutDescription: 'International Investment Fund is a leading global investment firm dedicated to providing exceptional financial services and investment opportunities worldwide.',
        footerQuickLinksTitle: 'Quick Links',
        footerServicesTitle: 'Services',
        footerContactTitle: 'Contact Info',
        footerLegalTitle: 'Legal',
        footerAddress: '13B AV DE LA MOTTE PICQUET 75007 PARIS 7',
        footerEmail: 'info@iiffund.com',
        footerPhone: '+966 56 756 6616',
        footerWebsite: 'www.iiffund.com',
        footerCopyright: '© 2024 International Investment Fund. All rights reserved.',
        footerSiret: 'SIRET 923 563 688 00012',
        footerLanguageLabel: 'Language:',
        
        // Links
        footerLinkAbout: 'About Us',
        footerLinkServices: 'Services',
        footerLinkSectors: 'Sectors',
        footerLinkTeam: 'Our Team',
        footerLinkContact: 'Contact',
        footerLinkCareers: 'Careers',
        footerServiceInvestment: 'Investment Management',
        footerServiceAdvisory: 'Financial Advisory',
        footerServiceResearch: 'Market Research',
        footerServiceCompliance: 'Compliance & Risk',
        footerServiceTraining: 'Training & Development',
        footerLinkPrivacy: 'Privacy Policy',
        footerLinkTerms: 'Terms of Service',
        footerLinkCookies: 'Cookie Policy',
        footerLinkCompliance: 'Compliance',
        footerLinkDisclaimer: 'Disclaimer',
        
        // Auth
        signInTitle: 'Sign In',
        signInSubtitle: 'Welcome back to IIF',
        createAccountTitle: 'Create Account',
        createAccountSubtitle: 'Join IIF today',
        emailLabel: 'Email',
        passwordLabel: 'Password',
        confirmPasswordLabel: 'Confirm Password',
        fullNameLabel: 'Full Name',
        nameLabel: 'Name',
        subjectLabel: 'Subject',
        messageLabel: 'Message',
        sendMessage: 'Send Message',
        signIn: 'Sign In',
        createAccount: 'Create Account',
        noAccount: "Don't have an account?",
        haveAccount: 'Already have an account?',
        
        // Dashboard
        dashboardTitle: 'Dashboard',
        dashboardSubtitle: 'Welcome to your investment management center',
        statInvestments: 'Total Investments',
        statClients: 'Active Clients',
        statReturns: 'Returns',
        statCountries: 'Countries',
        statChangePositive: '+12.5%',
        statChangeNeutral: '0%',
        recentActivities: 'Recent Activities',
        recentActivitiesSubtitle: 'Latest updates and actions',
        portfolioOverview: 'Portfolio Overview',
        portfolioOverviewSubtitle: 'Your investment distribution',
        quickActions: 'Quick Actions',
        quickActionsSubtitle: 'Common tasks and tools',
        notifications: 'Notifications',
        notificationsSubtitle: 'Important updates and alerts',
        marketOverview: 'Market Overview',
        marketOverviewSubtitle: 'Global market trends',
        recentDocuments: 'Recent Documents',
        recentDocumentsSubtitle: 'Latest files and reports',
        viewAll: 'View All',
        viewDetails: 'View Details',
        newInvestment: 'New Investment',
        sendLetter: 'Send Letter',
        viewReports: 'View Reports',
        teamManagement: 'Team Management',
        clientPortal: 'Client Portal',
        settings: 'Settings',
        
        // Pages
        aboutTitle: 'About International Investment Fund',
        aboutSubtitle: 'Leading the way in global investment solutions',
        ourMission: 'Our Mission',
        ourMissionText: 'To provide exceptional investment opportunities and financial services worldwide...',
        ourVision: 'Our Vision',
        ourVisionText: 'To be the global leader in sustainable investment and wealth creation...',
        contactTitle: 'Contact Us',
        contactSubtitle: 'Get in touch with our team',
        
        // Admin
        adminTitle: 'Admin Panel',
        adminSubtitle: 'System administration',
        userManagement: 'User Management',
        userManagementText: 'Manage system users and permissions',
        systemSettings: 'System Settings',
        systemSettingsText: 'Configure system parameters',
        
        // Error
        pageNotFound: 'Page Not Found',
        pageNotFoundMessage: "The page you're looking for doesn't exist.",
        goHome: 'Go Home',
        contactUs: 'Contact Us',
        
        // Ticker
        globalMarkets: 'Global Markets'
      },
      ar: {
        // Navigation
        logoTitle: 'صندوق الاستثمار الدولي',
        logoSubtitle: 'التمويل من أجل الرخاء العالمي · جميع الأمم عالمياً',
        navHome: 'الرئيسية',
        navAbout: 'من نحن',
        navServices: 'الخدمات',
        navSectors: 'القطاعات',
        navContact: 'اتصل بنا',
        searchPlaceholder: 'ابحث في الموقع…',
        
        // Header
        signIn: 'دخول',
        createAccount: 'إنشاء حساب',
        dashboard: 'لوحة التحكم',
        myProfile: 'ملفي الشخصي',
        signOut: 'تسجيل الخروج',
        
        // Hero
        heroTitle: 'صندوق الاستثمار الدولي',
        heroSubtitle: 'التمويل من أجل الرخاء العالمي · تمكين الاستثمارات في جميع أنحاء العالم',
        heroPrimaryAction: 'ابدأ الآن',
        heroSecondaryAction: 'اعرف المزيد',
        
        // Features
        featuresTitle: 'لماذا تختار IIF؟',
        featuresSubtitle: 'خبرة عالمية، معرفة محلية، والالتزام بالنمو المستدام',
        feature1Title: 'وصول عالمي',
        feature1Description: 'فرص استثمارية عبر القارات مع خبرة السوق المحلية',
        feature2Title: 'إدارة احترافية',
        feature2Description: 'فريق ذو خبرة مثبتة في التمويل الدولي',
        feature3Title: 'استثمارات آمنة',
        feature3Description: 'إدارة مخاطر قوية والامتثال للمعايير الدولية',
        feature4Title: 'مركز على النمو',
        feature4Description: 'استثمارات استراتيجية مصممة للنمو المستدام طويل الأجل',
        feature5Title: 'نهج الشراكة',
        feature5Description: 'العمل بشكل وثيق مع العملاء لتحقيق أهدافهم الاستثمارية',
        feature6Title: 'مستقبل مستدام',
        feature6Description: 'ملتزم بمبادئ البيئة والمجتمع والحوكمة',
        
        // Footer
        footerAboutTitle: 'عن IIF',
        footerAboutDescription: 'صندوق الاستثمار الدولي هو شركة استثمارية عالمية رائدة مكرسة لتقديم خدمات مالية استثنائية وفرص استثمارية في جميع أنحاء العالم.',
        footerQuickLinksTitle: 'روابط سريعة',
        footerServicesTitle: 'الخدمات',
        footerContactTitle: 'معلومات الاتصال',
        footerLegalTitle: 'قانوني',
        footerAddress: '13B AV DE LA MOTTE PICQUET 75007 PARIS 7',
        footerEmail: 'info@iiffund.com',
        footerPhone: '+966 56 756 6616',
        footerWebsite: 'www.iiffund.com',
        footerCopyright: '© 2024 صندوق الاستثمار الدولي. جميع الحقوق محفوظة.',
        footerSiret: 'SIRET 923 563 688 00012',
        footerLanguageLabel: 'اللغة:',
        
        // Links
        footerLinkAbout: 'من نحن',
        footerLinkServices: 'الخدمات',
        footerLinkSectors: 'القطاعات',
        footerLinkTeam: 'فريقنا',
        footerLinkContact: 'اتصل بنا',
        footerLinkCareers: 'الوظائف',
        footerServiceInvestment: 'إدارة الاستثمار',
        footerServiceAdvisory: 'استشارات مالية',
        footerServiceResearch: 'أبحاث السوق',
        footerServiceCompliance: 'الامتثال والمخاطر',
        footerServiceTraining: 'التدريب والتطوير',
        footerLinkPrivacy: 'سياسة الخصوصية',
        footerLinkTerms: 'شروط الخدمة',
        footerLinkCookies: 'سياسة ملفات تعريف الارتباط',
        footerLinkCompliance: 'الامتثال',
        footerLinkDisclaimer: 'إخلاء المسؤولية',
        
        // Auth
        signInTitle: 'تسجيل الدخول',
        signInSubtitle: 'مرحباً بعودتك إلى IIF',
        createAccountTitle: 'إنشاء حساب',
        createAccountSubtitle: 'انضم إلى IIF اليوم',
        emailLabel: 'البريد الإلكتروني',
        passwordLabel: 'كلمة المرور',
        confirmPasswordLabel: 'تأكيد كلمة المرور',
        fullNameLabel: 'الاسم الكامل',
        nameLabel: 'الاسم',
        subjectLabel: 'الموضوع',
        messageLabel: 'الرسالة',
        sendMessage: 'إرسال الرسالة',
        signIn: 'دخول',
        createAccount: 'إنشاء حساب',
        noAccount: 'ليس لديك حساب؟',
        haveAccount: 'لديك حساب بالفعل؟',
        
        // Dashboard
        dashboardTitle: 'لوحة التحكم',
        dashboardSubtitle: 'مرحباً بك في مركز إدارة الاستثمار',
        statInvestments: 'إجمالي الاستثمارات',
        statClients: 'العملاء النشطون',
        statReturns: 'العوائد',
        statCountries: 'الدول',
        statChangePositive: '+12.5%',
        statChangeNeutral: '0%',
        recentActivities: 'الأنشطة الأخيرة',
        recentActivitiesSubtitle: 'أحدث التحديثات والإجراءات',
        portfolioOverview: 'نظرة عامة على المحفظة',
        portfolioOverviewSubtitle: 'توزيع استثماراتك',
        quickActions: 'إجراءات سريعة',
        quickActionsSubtitle: 'مهام وأدوات شائعة',
        notifications: 'الإشعارات',
        notificationsSubtitle: 'تحديثات وتنبيهات مهمة',
        marketOverview: 'نظرة عامة على السوق',
        marketOverviewSubtitle: 'اتجاهات السوق العالمية',
        recentDocuments: 'المستندات الأخيرة',
        recentDocumentsSubtitle: 'أحدث الملفات والتقارير',
        viewAll: 'عرض الكل',
        viewDetails: 'عرض التفاصيل',
        newInvestment: 'استثمار جديد',
        sendLetter: 'إرسال خطاب',
        viewReports: 'عرض التقارير',
        teamManagement: 'إدارة الفريق',
        clientPortal: 'بوابة العميل',
        settings: 'الإعدادات',
        
        // Pages
        aboutTitle: 'عن صندوق الاستثمار الدولي',
        aboutSubtitle: 'قيادة الطريق في حلول الاستثمار العالمية',
        ourMission: 'مهمتنا',
        ourMissionText: 'توفير فرص استثمارية استثنائية وخدمات مالية في جميع أنحاء العالم...',
        ourVision: 'رؤيتنا',
        ourVisionText: 'أن نكون القائد العالمي في الاستثمار المستدام وخلق الثروة...',
        contactTitle: 'اتصل بنا',
        contactSubtitle: 'تواصل مع فريقنا',
        
        // Admin
        adminTitle: 'لوحة الإدارة',
        adminSubtitle: 'إدارة النظام',
        userManagement: 'إدارة المستخدمين',
        userManagementText: 'إدارة مستخدمي النظام والصلاحيات',
        systemSettings: 'إعدادات النظام',
        systemSettingsText: 'تكوين معلمات النظام',
        
        // Error
        pageNotFound: 'الصفحة غير موجودة',
        pageNotFoundMessage: 'الصفحة التي تبحث عنها غير موجودة.',
        goHome: 'الذهاب للرئيسية',
        contactUs: 'اتصل بنا',
        
        // Ticker
        globalMarkets: 'الأسواق العالمية'
      }
    };
  }

  async init() {
    // Detect browser language
    const browserLang = navigator.language.split('-')[0];
    const savedLang = localStorage.getItem('iif-language');
    
    // Use saved language or browser language or default
    this.currentLanguage = savedLang || (this.isLanguageSupported(browserLang) ? browserLang : 'en');
    
    // Apply language
    this.applyLanguage();
    
    console.log(`🌐 I18n initialized with language: ${this.currentLanguage}`);
  }

  t(key, language = null) {
    const lang = language || this.currentLanguage;
    return this.translations[lang]?.[key] || key;
  }

  setLanguage(language) {
    if (!this.isLanguageSupported(language)) {
      console.warn(`Language ${language} is not supported`);
      return false;
    }
    
    this.currentLanguage = language;
    this.applyLanguage();
    localStorage.setItem('iif-language', language);
    
    return true;
  }

  getCurrentLanguage() {
    return this.currentLanguage;
  }

  getSupportedLanguages() {
    return Object.keys(this.translations);
  }

  isLanguageSupported(language) {
    return this.getSupportedLanguages().includes(language);
  }

  isRTL(language = null) {
    const lang = language || this.currentLanguage;
    return ['ar', 'he', 'fa', 'ur'].includes(lang);
  }

  applyLanguage() {
    // Update HTML attributes
    document.documentElement.setAttribute('lang', this.currentLanguage);
    document.documentElement.setAttribute('data-lang', this.currentLanguage);
    document.documentElement.setAttribute('dir', this.isRTL() ? 'rtl' : 'ltr');
    
    // Update language selectors
    const selectors = ['language-selector', 'footer-language-selector', 'iif-lang-picker'];
    selectors.forEach(id => {
      const selector = document.getElementById(id);
      if (selector) {
        selector.value = this.currentLanguage;
      }
    });
    
    // Update all i18n elements
    this.updateElements();
  }

  updateElements() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.t(key);
      
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        if (element.type === 'submit' || element.type === 'button') {
          element.value = translation;
        } else {
          element.placeholder = translation;
        }
      } else {
        element.textContent = translation;
      }
    });

    // Show/hide language-specific elements
    document.querySelectorAll('.lang-en, .lang-ar, .lang-fr, .lang-es').forEach(element => {
      const elementLang = element.className.match(/lang-(\w+)/)?.[1];
      element.style.display = elementLang === this.currentLanguage ? '' : 'none';
    });
  }

  addTranslations(language, translations) {
    if (!this.translations[language]) {
      this.translations[language] = {};
    }
    
    Object.assign(this.translations[language], translations);
  }

  getTranslations(language = null) {
    const lang = language || this.currentLanguage;
    return this.translations[lang] || {};
  }

  formatNumber(number, options = {}) {
    const locale = this.getNumberLocale();
    return new Intl.NumberFormat(locale, options).format(number);
  }

  formatCurrency(amount, currency = 'USD', options = {}) {
    const locale = this.getNumberLocale();
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      ...options
    }).format(amount);
  }

  formatDate(date, options = {}) {
    const locale = this.getDateLocale();
    return new Intl.DateTimeFormat(locale, options).format(date);
  }

  formatTime(date, options = {}) {
    const locale = this.getDateLocale();
    return new Intl.DateTimeFormat(locale, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      ...options
    }).format(date);
  }

  getNumberLocale() {
    const localeMap = {
      en: 'en-US',
      ar: 'ar-SA',
      fr: 'fr-FR',
      es: 'es-ES'
    };
    return localeMap[this.currentLanguage] || 'en-US';
  }

  getDateLocale() {
    const localeMap = {
      en: 'en-US',
      ar: 'ar-SA',
      fr: 'fr-FR',
      es: 'es-ES'
    };
    return localeMap[this.currentLanguage] || 'en-US';
  }

  getDirection() {
    return this.isRTL() ? 'rtl' : 'ltr';
  }

  // Pluralization helper
  pluralize(count, singular, plural = null) {
    if (count === 1) {
      return singular;
    }
    return plural || (singular + 's');
  }

  // Interpolation helper
  interpolate(text, values = {}) {
    return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return values[key] !== undefined ? values[key] : match;
    });
  }
}
