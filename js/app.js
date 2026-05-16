// Main Application Entry Point
import { AppConfig } from './config/app.js';
import { AuthManager } from './modules/auth.js';
import { DashboardManager } from './modules/dashboard.js';
import { AutomatedGovernmentService } from './modules/government-automated.js';
import { GovernmentService } from './modules/government.js';
import { LettersManager } from './modules/letters.js';
import { ServiceManager } from './modules/services.js';
import { TeamManager } from './modules/team.js';
import { UIComponents } from './modules/ui.js';
import { APIService } from './utils/api.js';
import { I18nManager } from './utils/i18n.js';
import { Router } from './utils/router.js';
import { StorageManager } from './utils/storage.js';

class App {
  constructor() {
    this.config = new AppConfig();
    this.router = new Router();
    this.storage = new StorageManager();
    this.i18n = new I18nManager();
    this.auth = new AuthManager(this.storage);
    this.ui = new UIComponents(this.i18n);
    this.dashboard = new DashboardManager(this.storage, this.auth);
    this.letters = new LettersManager(this.storage, this.auth);
    this.team = new TeamManager(this.storage, this.auth);
    this.services = new ServiceManager(this.storage, this.auth, this.router);
    this.api = new APIService(this.storage);
    this.government = new GovernmentService(this.api, this.storage);
    this.automatedGov = new AutomatedGovernmentService(this.api, this.storage);
    this.govUI = new GovernmentSearchUI(this.government, this.api);

    this.init();
  }

  async init() {
    try {
      console.log('🚀 Initializing IIF Application...');

      // Initialize core services
      await this.storage.init();
      await this.i18n.init();
      await this.auth.init();

      // Initialize automated government service
      await this.automatedGov.init();

      // Setup router
      this.setupRoutes();

      // Initialize UI components
      await this.ui.init();

      // Setup government search
      this.setupGovernmentSearch();

      // Initialize service managers
      await this.api.init();
      await this.government.init();
      await this.automatedGov.init();
      await this.govUI.init();
      await this.services.init();
      await this.dashboard.init();
      await this.letters.init();
      await this.team.init();

      // Setup event listeners
      this.setupEventListeners();

      // Start router
      this.router.start();

      // Show loading complete
      this.hideLoading();

      console.log('✅ Application initialized successfully!');
    } catch (error) {
      console.error('❌ Failed to initialize application:', error);
      this.showError(error);
    }
  }

  setupRoutes() {
    // Public routes
    this.router.addRoute('/', () => this.showHomePage());
    this.router.addRoute('/about', () => this.showAboutPage());
    this.router.addRoute('/contact', () => this.showContactPage());
    this.router.addRoute('/login', () => this.showLoginPage());
    this.router.addRoute('/register', () => this.showRegisterPage());
    this.router.addRoute('/government', () => this.showGovernmentPage());

    // Protected routes
    this.router.addRoute('/dashboard', () => this.showDashboardPage(), { auth: true });
    this.router.addRoute('/letters', () => this.showLettersPage(), { auth: true });
    this.router.addRoute('/team', () => this.showTeamPage(), { auth: true });
    this.router.addRoute('/settings', () => this.showSettingsPage(), { auth: true });

    // Admin routes
    this.router.addRoute('/admin', () => this.showAdminPage(), { auth: true, admin: true });

    // 404 handler
    this.router.addRoute('*', () => this.showNotFoundPage());
  }

  setupEventListeners() {
    // Language switcher
    document.addEventListener('languagechange', (e) => {
      this.i18n.setLanguage(e.detail.language);
      this.updateUILanguage();
    });

    // Auth events
    document.addEventListener('login', (e) => {
      this.handleLogin(e.detail.user);
    });

    document.addEventListener('logout', (e) => {
      this.handleLogout();
    });

    // Navigation events
    document.addEventListener('navigation', (e) => {
      this.router.navigate(e.detail.path);
    });

    // Storage events
    document.addEventListener('storage-changed', (e) => {
      this.handleStorageChange(e.detail);
    });

    // Error handling
    window.addEventListener('error', (e) => {
      console.error('Global error:', e.error);
      this.showError(e.error);
    });

    window.addEventListener('unhandledrejection', (e) => {
      console.error('Unhandled promise rejection:', e.reason);
      this.showError(e.reason);
    });
  }

  // Page handlers
  async showHomePage() {
    await this.ui.loadPage('home');
    this.ui.showHero();
    this.ui.showFeatures();
    this.ui.showNewsTicker();
  }

  async showAboutPage() {
    await this.ui.loadPage('about');
    this.ui.showAboutContent();
  }

  async showContactPage() {
    await this.ui.loadPage('contact');
    this.ui.showContactForm();
  }

  async showGovernmentPage() {
    await this.ui.loadPage('government-automated');
    await this.automatedGov.init();
    this.ui.showGovernmentSearchContent();
  }

  async showLoginPage() {
    if (this.auth.isAuthenticated()) {
      this.router.navigate('/dashboard');
      return;
    }
    await this.ui.loadPage('auth');
    this.ui.showLoginForm();
  }

  async showRegisterPage() {
    if (this.auth.isAuthenticated()) {
      this.router.navigate('/dashboard');
      return;
    }
    await this.ui.loadPage('auth');
    this.ui.showRegisterForm();
  }

  async showDashboardPage() {
    await this.ui.loadPage('dashboard');
    await this.dashboard.init();
    this.ui.showDashboardContent();
  }

  async showLettersPage() {
    await this.ui.loadPage('letters');
    await this.letters.init();
    this.ui.showLettersContent();
  }

  async showTeamPage() {
    await this.ui.loadPage('team');
    await this.team.init();
    this.ui.showTeamContent();
  }

  async showSettingsPage() {
    await this.ui.loadPage('settings');
    this.ui.showSettingsContent();
  }

  async showAdminPage() {
    await this.ui.loadPage('admin');
    this.ui.showAdminContent();
  }

  async showNotFoundPage() {
    await this.ui.loadPage('error');
    this.ui.showNotFoundError();
  }

  // Event handlers
  handleLogin(user) {
    console.log('User logged in:', user);
    this.ui.updateUserInterface(user);
    this.router.navigate('/dashboard');
  }

  handleLogout() {
    console.log('User logged out');
    this.ui.updateUserInterface(null);
    this.router.navigate('/');
  }

  handleStorageChange(change) {
    console.log('Storage changed:', change);
    // Update UI components that depend on this data
    this.ui.updateDependentComponents(change.key, change.value);
  }

  updateUILanguage() {
    // Update all UI text based on current language
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      element.textContent = this.i18n.t(key);
    });

    // Update language direction
    document.documentElement.dir = this.i18n.isRTL() ? 'rtl' : 'ltr';
    document.documentElement.lang = this.i18n.getCurrentLanguage();
  }

  // Government Search Setup
  setupGovernmentSearch() {
    console.log('🔍 Setting up government search...');

    // Get search elements
    const searchInput = document.getElementById('country-search');
    const searchInputAr = document.getElementById('country-search-ar');
    const searchBtn = document.getElementById('search-btn');
    const searchBtnAr = document.getElementById('search-btn-ar');
    const suggestions = document.querySelectorAll('.suggestion-btn');

    // Setup search functionality
    const performSearch = async (query) => {
      if (!query.trim()) return;

      console.log(`🔍 Searching for: ${query}`);

      // Show loading
      document.getElementById('loading-state').style.display = 'block';
      document.getElementById('search-results').innerHTML = '';

      try {
        // Perform automated search
        const results = await this.automatedGov.automatedSearch(query);

        // Display results
        this.displayGovernmentResults(results);

      } catch (error) {
        console.error('❌ Search error:', error);
        document.getElementById('search-results').innerHTML = `
          <div class="error-message">
            <p class="lang-en">Error searching for government information. Please try again.</p>
            <p class="lang-ar">خطأ في البحث عن معلومات حكومية. يرجى المحاولة مرة أخرى.</p>
          </div>
        `;
      } finally {
        // Hide loading
        document.getElementById('loading-state').style.display = 'none';
      }
    };

    // Setup event listeners
    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        performSearch(searchInput.value);
      });
    }

    if (searchBtnAr) {
      searchBtnAr.addEventListener('click', () => {
        performSearch(searchInputAr.value);
      });
    }

    if (searchInput) {
      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          performSearch(searchInput.value);
        }
      });
    }

    if (searchInputAr) {
      searchInputAr.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          performSearch(searchInputAr.value);
        }
      });
    }

    // Setup suggestion buttons
    suggestions.forEach(btn => {
      btn.addEventListener('click', () => {
        const country = btn.getAttribute('data-country');
        if (searchInput) searchInput.value = country;
        if (searchInputAr) searchInputAr.value = country;
        performSearch(country);
      });
    });

    console.log('✅ Government search setup complete');
  }

  // Display government search results
  displayGovernmentResults(results) {
    const resultsContainer = document.getElementById('search-results');

    if (!results || !results.basicInfo) {
      resultsContainer.innerHTML = `
        <div class="no-results">
          <p class="lang-en">No government information found for this country.</p>
          <p class="lang-ar">لم يتم العثور على معلومات حكومية لهذه الدولة.</p>
        </div>
      `;
      return;
    }

    const { basicInfo, leadershipInfo, ministriesInfo, contactsInfo } = results;

    resultsContainer.innerHTML = `
      <div class="country-results">
        <!-- Country Header -->
        <div class="country-header">
          <h3>${basicInfo.name || 'Unknown'}</h3>
          <p>${basicInfo.capital || ''} - ${basicInfo.region || ''}</p>
        </div>

        <!-- Quick Facts -->
        <div class="quick-facts">
          <h4 class="lang-en">Quick Facts</h4>
          <h4 class="lang-ar">حقائق سريعة</h4>
          <ul>
            <li><strong class="lang-en">Population:</strong> <span class="lang-ar">السكان:</span> ${basicInfo.population || 'N/A'}</li>
            <li><strong class="lang-en">Currency:</strong> <span class="lang-ar">العملة:</span> ${basicInfo.currency || 'N/A'}</li>
            <li><strong class="lang-en">Language:</strong> <span class="lang-ar">اللغة:</span> ${basicInfo.language || 'N/A'}</li>
          </ul>
        </div>

        <!-- Leadership -->
        ${leadershipInfo && leadershipInfo.length > 0 ? `
          <div class="leadership-section">
            <h4 class="lang-en">Leadership</h4>
            <h4 class="lang-ar">القيادة</h4>
            <div class="leadership-cards">
              ${leadershipInfo.map(leader => `
                <div class="leader-card">
                  <h5>${leader.title || 'Unknown'}</h5>
                  <p>${leader.name || 'Unknown'}</p>
                  ${leader.term ? `<p class="term">${leader.term}</p>` : ''}
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Ministries -->
        ${ministriesInfo && ministriesInfo.length > 0 ? `
          <div class="ministries-section">
            <h4 class="lang-en">Ministries</h4>
            <h4 class="lang-ar">الوزارات</h4>
            <div class="ministries-list">
              ${ministriesInfo.map(ministry => `
                <div class="ministry-item">
                  <h5>${ministry.name || 'Unknown'}</h5>
                  <p>${ministry.responsibility || ''}</p>
                  ${minister.contact ? `<p class="contact">${minister.contact}</p>` : ''}
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Contacts -->
        ${contactsInfo && contactsInfo.length > 0 ? `
          <div class="contacts-section">
            <h4 class="lang-en">Important Contacts</h4>
            <h4 class="lang-ar">جهات الاتصال المهمة</h4>
            <div class="contacts-list">
              ${contactsInfo.map(contact => `
                <div class="contact-item">
                  <h5>${contact.type || 'Unknown'}</h5>
                  <p>${contact.name || ''}</p>
                  ${contact.phone ? `<p class="phone">${contact.phone}</p>` : ''}
                  ${contact.email ? `<p class="email">${contact.email}</p>` : ''}
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  // UI helpers
  hideLoading() {
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
      loadingElement.style.display = 'none';
    }
  }

  showError(error) {
    const errorMessage = error?.message || 'An unexpected error occurred';
    this.ui.showAlert('error', errorMessage);
    console.error('Application error:', error);
  }

  showSuccess(message) {
    this.ui.showAlert('success', message);
    console.log('Success:', message);
  }

  showWarning(message) {
    this.ui.showAlert('warning', message);
    console.warn('Warning:', message);
  }

  showInfo(message) {
    this.ui.showAlert('info', message);
    console.info('Info:', message);
  }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});

// Export for global access
window.App = App;
