// Service Manager - Handles all service-specific functionality
export class ServiceManager {
  constructor(storageManager, authManager, router) {
    this.storage = storageManager;
    this.auth = authManager;
    this.router = router;
    this.services = {
      investment: {
        name: 'Investment Management',
        icon: '💰',
        description: 'Manage investment portfolios and opportunities',
        features: ['portfolio-management', 'market-analysis', 'risk-assessment', 'performance-tracking']
      },
      letters: {
        name: 'Letters & Correspondence',
        icon: '📧',
        description: 'Official letters and document management',
        features: ['letter-creation', 'outbox-management', 'archive-search', 'qr-authentication']
      },
      team: {
        name: 'Team Management',
        icon: '👥',
        description: 'Manage team members and permissions',
        features: ['member-management', 'role-assignment', 'performance-evaluation', 'collaboration-tools']
      },
      reports: {
        name: 'Reports & Analytics',
        icon: '📊',
        description: 'Generate reports and analyze data',
        features: ['financial-reports', 'performance-metrics', 'trend-analysis', 'custom-reports']
      },
      client: {
        name: 'Client Portal',
        icon: '🔐',
        description: 'Secure client access and communication',
        features: ['client-dashboard', 'secure-messaging', 'document-sharing', 'account-management']
      },
      settings: {
        name: 'Settings & Configuration',
        icon: '⚙️',
        description: 'System settings and preferences',
        features: ['user-preferences', 'system-configuration', 'security-settings', 'data-management']
      }
    };
  }

  async init() {
    console.log('🔧 Initializing Service Manager...');
    
    // Setup service event listeners
    this.setupServiceListeners();
    
    // Initialize all services
    await this.initializeServices();
    
    console.log('✅ Service Manager initialized successfully!');
  }

  setupServiceListeners() {
    // Listen for service button clicks
    document.addEventListener('click', (e) => {
      if (e.target.matches('.quick-action-btn')) {
        const action = e.target.getAttribute('data-action');
        this.handleServiceAction(action, e.target);
      }
      
      if (e.target.matches('.service-card')) {
        const service = e.target.getAttribute('data-service');
        this.handleServiceClick(service, e.target);
      }
      
      if (e.target.matches('.feature-btn')) {
        const feature = e.target.getAttribute('data-feature');
        this.handleFeatureClick(feature, e.target);
      }
    });

    // Listen for navigation service clicks
    document.addEventListener('click', (e) => {
      if (e.target.matches('.site-nav__link')) {
        const page = e.target.getAttribute('data-page');
        this.handleNavigationService(page, e.target);
      }
    });

    // Listen for hero CTA clicks
    document.addEventListener('click', (e) => {
      if (e.target.id === 'hero-cta-primary') {
        this.handleHeroCTA('primary', e.target);
      } else if (e.target.id === 'hero-cta-secondary') {
        this.handleHeroCTA('secondary', e.target);
      }
    });

    // Listen for feature card clicks
    document.addEventListener('click', (e) => {
      if (e.target.closest('.feature-card')) {
        const card = e.target.closest('.feature-card');
        const featureIndex = Array.from(card.parentElement.children).indexOf(card);
        this.handleFeatureCardClick(featureIndex, card);
      }
    });
  }

  async initializeServices() {
    // Initialize each service
    for (const [serviceKey, service] of Object.entries(this.services)) {
      try {
        await this.initializeService(serviceKey, service);
        console.log(`✅ Service initialized: ${service.name}`);
      } catch (error) {
        console.error(`❌ Failed to initialize service: ${service.name}`, error);
      }
    }
  }

  async initializeService(serviceKey, service) {
    // Load service-specific data
    const serviceData = this.storage.get(`service-${serviceKey}`, {});
    
    // Initialize service state
    service.state = {
      isActive: false,
      data: serviceData,
      lastAccessed: null,
      userPermissions: this.getServicePermissions(serviceKey)
    };
    
    // Setup service-specific event listeners
    this.setupServiceSpecificListeners(serviceKey, service);
  }

  handleServiceAction(action, buttonElement) {
    console.log(`🎯 Service action triggered: ${action}`);
    
    const actionMap = {
      'new-investment': () => this.openInvestmentService(),
      'send-letter': () => this.openLettersService(),
      'view-reports': () => this.openReportsService(),
      'team-management': () => this.openTeamService(),
      'client-portal': () => this.openClientService(),
      'settings': () => this.openSettingsService()
    };

    const actionHandler = actionMap[action];
    if (actionHandler) {
      // Show loading state
      this.showButtonLoading(buttonElement);
      
      // Execute action
      setTimeout(() => {
        actionHandler();
        this.hideButtonLoading(buttonElement);
      }, 500);
    } else {
      console.warn(`Unknown service action: ${action}`);
      this.showNotification('warning', `Service action "${action}" not found`);
    }
  }

  handleServiceClick(service, element) {
    console.log(`🔧 Service clicked: ${service}`);
    
    const serviceData = this.services[service];
    if (!serviceData) {
      console.error(`Service not found: ${service}`);
      return;
    }

    // Check permissions
    if (!this.hasServicePermission(service)) {
      this.showNotification('error', 'You do not have permission to access this service');
      return;
    }

    // Open service
    this.openService(service);
  }

  handleFeatureClick(feature, element) {
    console.log(`⚡ Feature clicked: ${feature}`);
    
    // Find which service this feature belongs to
    const serviceKey = this.findServiceForFeature(feature);
    if (!serviceKey) {
      console.error(`Feature not found in any service: ${feature}`);
      return;
    }

    // Execute feature
    this.executeFeature(serviceKey, feature);
  }

  handleNavigationService(page, element) {
    console.log(`🧭 Navigation service: ${page}`);
    
    const serviceMap = {
      'home': () => this.openHomePage(),
      'about': () => this.openAboutPage(),
      'services': () => this.openServicesPage(),
      'sectors': () => this.openSectorsPage(),
      'contact': () => this.openContactPage()
    };

    const serviceHandler = serviceMap[page];
    if (serviceHandler) {
      serviceHandler();
    } else {
      console.warn(`Unknown navigation service: ${page}`);
    }
  }

  handleHeroCTA(ctaType, element) {
    console.log(`🚀 Hero CTA clicked: ${ctaType}`);
    
    if (ctaType === 'primary') {
      // Primary CTA - Get Started
      this.openInvestmentService();
    } else if (ctaType === 'secondary') {
      // Secondary CTA - Learn More
      this.openAboutPage();
    }
  }

  handleFeatureCardClick(index, card) {
    console.log(`🎯 Feature card clicked: ${index}`);
    
    const features = [
      () => this.openInvestmentService(),
      () => this.openAboutPage(),
      () => this.openServicesPage(),
      () => this.openContactPage(),
      () => this.openTeamService(),
      () => this.openReportsService()
    ];

    const featureHandler = features[index];
    if (featureHandler) {
      featureHandler();
    }
  }

  // Service-specific handlers
  openInvestmentService() {
    console.log('💰 Opening Investment Service...');
    this.router.navigate('/investment');
    this.showNotification('success', 'Investment service opened');
  }

  openLettersService() {
    console.log('📧 Opening Letters Service...');
    this.router.navigate('/letters');
    this.showNotification('success', 'Letters service opened');
  }

  openReportsService() {
    console.log('📊 Opening Reports Service...');
    this.router.navigate('/reports');
    this.showNotification('success', 'Reports service opened');
  }

  openTeamService() {
    console.log('👥 Opening Team Service...');
    this.router.navigate('/team');
    this.showNotification('success', 'Team service opened');
  }

  openClientService() {
    console.log('🔐 Opening Client Portal...');
    this.router.navigate('/client-portal');
    this.showNotification('success', 'Client portal opened');
  }

  openSettingsService() {
    console.log('⚙️ Opening Settings Service...');
    this.router.navigate('/settings');
    this.showNotification('success', 'Settings opened');
  }

  // Navigation handlers
  openHomePage() {
    console.log('🏠 Opening Home Page...');
    this.router.navigate('/');
  }

  openAboutPage() {
    console.log('📖 Opening About Page...');
    this.router.navigate('/about');
  }

  openServicesPage() {
    console.log('🔧 Opening Services Page...');
    this.router.navigate('/services');
  }

  openSectorsPage() {
    console.log('🏭 Opening Sectors Page...');
    this.router.navigate('/sectors');
  }

  openContactPage() {
    console.log('📞 Opening Contact Page...');
    this.router.navigate('/contact');
  }

  // Service utilities
  openService(serviceKey) {
    const service = this.services[serviceKey];
    if (!service) return;

    // Update service state
    service.state.isActive = true;
    service.state.lastAccessed = new Date().toISOString();

    // Save to storage
    this.storage.set(`service-${serviceKey}`, service.state);

    // Navigate to service
    this.router.navigate(`/${serviceKey}`);

    // Show notification
    this.showNotification('info', `${service.name} opened`);
  }

  executeFeature(serviceKey, feature) {
    const service = this.services[serviceKey];
    if (!service) return;

    console.log(`⚡ Executing feature: ${feature} in service: ${service.name}`);

    // Execute feature-specific logic
    switch (feature) {
      case 'portfolio-management':
        this.openPortfolioManagement();
        break;
      case 'letter-creation':
        this.openLetterCreation();
        break;
      case 'member-management':
        this.openMemberManagement();
        break;
      case 'financial-reports':
        this.openFinancialReports();
        break;
      case 'client-dashboard':
        this.openClientDashboard();
        break;
      case 'user-preferences':
        this.openUserPreferences();
        break;
      default:
        console.log(`Feature execution not implemented: ${feature}`);
        this.showNotification('info', `Feature "${feature}" clicked`);
    }
  }

  findServiceForFeature(feature) {
    for (const [serviceKey, service] of Object.entries(this.services)) {
      if (service.features.includes(feature)) {
        return serviceKey;
      }
    }
    return null;
  }

  hasServicePermission(serviceKey) {
    const service = this.services[serviceKey];
    if (!service) return false;

    // Check if user is authenticated
    if (!this.auth.isLoggedIn()) {
      return false;
    }

    // Check user role permissions
    const user = this.auth.getCurrentUser();
    if (!user) return false;

    // Admin has access to all services
    if (user.role === 'admin') return true;

    // Staff has access to most services
    if (user.role === 'staff') {
      const restrictedServices = ['settings'];
      return !restrictedServices.includes(serviceKey);
    }

    // Regular users have limited access
    if (user.role === 'user') {
      const allowedServices = ['client', 'reports'];
      return allowedServices.includes(serviceKey);
    }

    return false;
  }

  getServicePermissions(serviceKey) {
    const user = this.auth.getCurrentUser();
    if (!user) return [];

    const permissions = {
      admin: ['read', 'write', 'delete', 'admin'],
      staff: ['read', 'write'],
      user: ['read']
    };

    return permissions[user.role] || [];
  }

  setupServiceSpecificListeners(serviceKey, service) {
    // Setup service-specific event listeners
    document.addEventListener(`service-${serviceKey}-action`, (e) => {
      this.handleServiceSpecificAction(serviceKey, e.detail);
    });
  }

  handleServiceSpecificAction(serviceKey, action) {
    console.log(`🔧 Service-specific action: ${serviceKey} - ${action.type}`);
    
    switch (serviceKey) {
      case 'investment':
        this.handleInvestmentAction(action);
        break;
      case 'letters':
        this.handleLettersAction(action);
        break;
      case 'team':
        this.handleTeamAction(action);
        break;
      default:
        console.log(`No specific handler for service: ${serviceKey}`);
    }
  }

  handleInvestmentAction(action) {
    // Handle investment-specific actions
    console.log('💰 Investment action:', action);
  }

  handleLettersAction(action) {
    // Handle letters-specific actions
    console.log('📧 Letters action:', action);
  }

  handleTeamAction(action) {
    // Handle team-specific actions
    console.log('👥 Team action:', action);
  }

  // UI utilities
  showButtonLoading(button) {
    button.disabled = true;
    button.classList.add('loading');
    button.innerHTML = '<span class="spinner"></span> Loading...';
  }

  hideButtonLoading(button) {
    button.disabled = false;
    button.classList.remove('loading');
    // Restore original content
    const icon = button.querySelector('.quick-action-icon')?.textContent || '';
    const label = button.querySelector('.quick-action-label')?.textContent || '';
    button.innerHTML = `<span class="quick-action-icon">${icon}</span><span class="quick-action-label">${label}</span>`;
  }

  showNotification(type, message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert--${type}`;
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '9999';
    notification.style.minWidth = '300px';
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  }

  // Feature-specific implementations
  openPortfolioManagement() {
    console.log('💼 Opening Portfolio Management...');
    this.router.navigate('/investment/portfolio');
  }

  openLetterCreation() {
    console.log('📝 Opening Letter Creation...');
    this.router.navigate('/letters/create');
  }

  openMemberManagement() {
    console.log('👥 Opening Member Management...');
    this.router.navigate('/team/members');
  }

  openFinancialReports() {
    console.log('📈 Opening Financial Reports...');
    this.router.navigate('/reports/financial');
  }

  openClientDashboard() {
    console.log('👤 Opening Client Dashboard...');
    this.router.navigate('/client/dashboard');
  }

  openUserPreferences() {
    console.log('⚙️ Opening User Preferences...');
    this.router.navigate('/settings/preferences');
  }

  // Get service information
  getService(serviceKey) {
    return this.services[serviceKey];
  }

  getAllServices() {
    return this.services;
  }

  getActiveServices() {
    return Object.entries(this.services)
      .filter(([key, service]) => service.state.isActive)
      .map(([key, service]) => ({ key, ...service }));
  }

  // Service analytics
  getServiceAnalytics() {
    const analytics = {};
    
    for (const [serviceKey, service] of Object.entries(this.services)) {
      analytics[serviceKey] = {
        name: service.name,
        isActive: service.state.isActive,
        lastAccessed: service.state.lastAccessed,
        features: service.features.length,
        hasPermission: this.hasServicePermission(serviceKey)
      };
    }
    
    return analytics;
  }
}
