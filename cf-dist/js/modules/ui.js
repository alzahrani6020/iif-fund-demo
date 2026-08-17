// UI Components Manager
export class UIComponents {
  constructor(i18nManager) {
    this.i18n = i18nManager;
    this.components = new Map();
    this.isInitialized = false;
  }

  async init() {
    try {
      console.log('🎨 Initializing UI Components...');

      // Load core components
      await this.loadHeader();
      await this.loadNavigation();
      await this.loadHero();
      await this.loadFooter();

      // Setup event listeners
      this.setupEventListeners();

      // Local-only helpers
      this.setupLocalOnlyLinks();

      // Initialize language
      this.updateLanguage();

      // Initialize clock
      this.initClock();

      // Initialize search
      this.initSearch();

      // Initialize ticker
      this.initTicker();

      this.isInitialized = true;
      console.log('✅ UI Components initialized successfully!');

    } catch (error) {
      console.error('❌ Failed to initialize UI Components:', error);
      throw error;
    }
  }

  setupLocalOnlyLinks() {
    try {
      const host = String((typeof location !== 'undefined' && location.hostname) || '').toLowerCase();
      const isLocal = host === 'localhost' || host === '127.0.0.1' || host === '[::1]';
      const isGhPages = host.endsWith('.github.io');
      const isIifProd = host === 'iiffund.com' || host.endsWith('.iiffund.com');
      const searxMeta = document.querySelector('meta[name="iif-searx-public-url"]');
      const searxPublic = (searxMeta && searxMeta.getAttribute('content') || '').trim();
      document.querySelectorAll('[data-local-only="1"]').forEach((el) => {
        if (isLocal) {
          el.style.display = 'inline-flex';
          return;
        }
        if (isGhPages && searxPublic && /^https?:\/\//i.test(searxPublic)) {
          el.style.display = 'inline-flex';
          el.setAttribute('href', searxPublic);
          el.setAttribute('target', '_blank');
          el.setAttribute('rel', 'noopener noreferrer');
          return;
        }
        if (isIifProd && searxPublic && /^https?:\/\//i.test(searxPublic)) {
          el.style.display = 'inline-flex';
          el.setAttribute('href', searxPublic);
          el.setAttribute('target', '_blank');
          el.setAttribute('rel', 'noopener noreferrer');
          return;
        }
        el.style.display = 'none';
      });
      document.querySelectorAll('[data-iif-google-search="1"]').forEach((el) => {
        el.style.display = isLocal || isGhPages || isIifProd ? 'inline-flex' : 'none';
      });
    } catch (e) {
      // ignore
    }
  }

  async loadHeader() {
    try {
      const bust = 'v=' + Date.now();
      const response = await fetch('components/header.html?' + bust, { cache: 'no-store' });
      const html = await response.text();
      const headerElement = document.getElementById('site-header');
      if (headerElement) {
        headerElement.innerHTML = html;
        this.setupLocalOnlyLinks();
        console.log('✅ Header loaded successfully');
      }
    } catch (error) {
      console.error('❌ Failed to load header:', error);
    }
  }

  async loadNavigation() {
    try {
      const bust = 'v=' + Date.now();
      const response = await fetch('components/navigation.html?' + bust, { cache: 'no-store' });
      const html = await response.text();
      const navElement = document.getElementById('site-nav');
      if (navElement) {
        navElement.innerHTML = html;
        console.log('✅ Navigation loaded successfully');
      }
    } catch (error) {
      console.error('❌ Failed to load navigation:', error);
    }
  }

  async loadHero() {
    try {
      const bust = 'v=' + Date.now();
      const response = await fetch('components/hero.html?' + bust, { cache: 'no-store' });
      const html = await response.text();
      const heroElement = document.getElementById('hero');
      if (heroElement) {
        heroElement.innerHTML = html;
        console.log('✅ Hero section loaded successfully');
      }
    } catch (error) {
      console.error('❌ Failed to load hero section:', error);
    }
  }

  async loadFooter() {
    try {
      const bust = 'v=' + Date.now();
      const response = await fetch('components/footer.html?' + bust, { cache: 'no-store' });
      const html = await response.text();
      const footerElement = document.getElementById('site-footer');
      if (footerElement) {
        footerElement.innerHTML = html;
        console.log('✅ Footer loaded successfully');
      }
    } catch (error) {
      console.error('❌ Failed to load footer:', error);
    }
  }

  async loadPage(pageName) {
    try {
      console.log(`📄 Loading page: ${pageName}`);

      const mainContent = document.getElementById('main-content');
      if (!mainContent) {
        throw new Error('Main content element not found');
      }

      let content = '';

      switch (pageName) {
        case 'home':
          await this.loadHero();
          content = '<div class="home-content"><!-- Home page content --></div>';
          break;
        case 'about':
          content = '<div class="about-page"><h1>About IIF</h1><p>Learn about our mission and values.</p></div>';
          break;
        case 'dashboard':
          const dashboardResponse = await fetch('components/dashboard.html');
          content = await dashboardResponse.text();
          break;
        case 'letters':
          content = '<div class="letters-page"><h1>Letters Management</h1><p>Manage your correspondence.</p></div>';
          break;
        case 'team':
          content = '<div class="team-page"><h1>Team Management</h1><p>Manage your team members.</p></div>';
          break;
        case 'settings':
          content = '<div class="settings-page"><h1>Settings</h1><p>Configure your preferences.</p></div>';
          break;
        case 'auth':
          content = '<div class="auth-page"><div class="auth-card"><h1>Sign In</h1><form id="login-form"><div class="form-group"><label>Email</label><input type="email" required></div><div class="form-group"><label>Password</label><input type="password" required></div><button type="submit" class="btn btn--primary btn--full">Sign In</button></form></div></div>';
          break;
        default:
          content = '<div class="error-page"><h1>Page Not Found</h1><p>The requested page could not be found.</p></div>';
      }

      mainContent.innerHTML = content;

      // Update navigation active state
      this.updateNavigationActive(pageName);

      // Update language for new content
      this.updateLanguage();

      console.log(`✅ Page ${pageName} loaded successfully`);

    } catch (error) {
      console.error(`❌ Failed to load page ${pageName}:`, error);
      throw error;
    }
  }

  setupEventListeners() {
    // Language selector
    document.addEventListener('change', (e) => {
      if (e.target.id === 'language-selector' || e.target.id === 'footer-language-selector' || e.target.id === 'iif-lang-picker') {
        this.handleLanguageChange(e.target.value);
      }
    });

    // Navigation links
    document.addEventListener('click', (e) => {
      if (e.target.matches('.site-nav__link')) {
        e.preventDefault();
        const page = e.target.getAttribute('data-page');
        if (page) {
          window.location.hash = page;
        }
      }
    });

    // Auth buttons
    document.addEventListener('click', (e) => {
      if (e.target.id === 'auth-header-login') {
        window.location.hash = 'login';
      } else if (e.target.id === 'auth-header-register') {
        window.location.hash = 'register';
      }
    });

    // Dashboard "back to site" / close buttons
    document.addEventListener('click', (e) => {
      const t = e.target;
      const closeBtn = t && (t.id === 'dashboard-close' ? t : t.closest && t.closest('#dashboard-close'));
      const auxClose = t && t.closest && t.closest('[data-dashboard-close-aux="true"]');
      if (!closeBtn && !auxClose) return;

      e.preventDefault();
      try {
        // Prefer SPA router if available
        if (window.app && window.app.router && typeof window.app.router.navigate === 'function') {
          window.app.router.navigate('/', { replace: false });
          return;
        }
      } catch (err) { /* ignore */ }

      // Fallback: hard navigation
      try { window.location.href = '/'; } catch (e2) { }
    });

    // Search functionality
    document.addEventListener('input', (e) => {
      if (e.target.id === 'iif-search') {
        this.handleSearch(e.target.value);
      }
    });

    // Automated search events
    document.addEventListener('automated-search', (e) => {
      this.handleAutomatedSearch(e.detail.countryName);
    });

    // Mobile menu toggle (if needed)
    document.addEventListener('click', (e) => {
      if (e.target.matches('.mobile-menu-toggle')) {
        this.toggleMobileMenu();
      }
    });
  }

  handleAutomatedSearch(countryName) {
    console.log(`🤖 Automated search triggered for: ${countryName}`);

    // Show loading state
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
      loadingOverlay.style.display = 'flex';
    }

    // Hide results section initially
    const resultsSection = document.getElementById('search-results-section');
    if (resultsSection) {
      resultsSection.style.display = 'none';
    }

    // Trigger the automated search service
    if (window.app && window.app.automatedGov) {
      window.app.automatedGov.automatedSearch(countryName)
        .then(results => {
          console.log('✅ Automated search completed:', results);

          // Hide loading
          if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
          }

          // Show success notification
          this.showSuccessNotification('Search completed successfully!');
        })
        .catch(error => {
          console.error('❌ Automated search failed:', error);

          // Hide loading
          if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
          }

          // Show error notification
          this.showErrorNotification(error.message || 'Search failed. Please try again.');
        });
    }
  }

  handleLanguageChange(language) {
    const lang = (language || 'en').toString().trim().toLowerCase();

    // Update language attribute
    document.documentElement.setAttribute('data-lang', lang);
    document.documentElement.setAttribute('lang', lang);

    // Update direction
    const isRTL = typeof this.i18n.isRTL === 'function' ? this.i18n.isRTL(lang) : (lang === 'ar');
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');

    // Save preference
    try { localStorage.setItem('iif-language', lang); } catch (e) {}

    // Emit event for App/app.js listener
    document.dispatchEvent(new CustomEvent('languagechange', {
      detail: { language: lang }
    }));

    // Update UI now
    this.updateLanguage();
  }

  showSuccessNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--color-success);
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 9999;
      font-weight: 600;
      animation: slideInRight 0.3s ease-out;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  }

  showErrorNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'error-notification';
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--color-error);
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 9999;
      font-weight: 600;
      animation: slideInRight 0.3s ease-out;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 5000);
  }

    // Update language attribute
    document.documentElement.setAttribute('data-lang', language);
    document.documentElement.setAttribute('lang', language);

  // Update direction
  const isRTL = this.i18n.isLanguageRTL(language);
    document.documentElement.setAttribute('dir', isRTL? 'rtl' : 'ltr');

    // Update all i18n elements
    this.updateLanguage();

// Save preference
localStorage.setItem('iif-language', language);

// Emit event
document.dispatchEvent(new CustomEvent('languagechange', {
  detail: { language }
}));
  }

updateLanguage() {
  const currentLang = document.documentElement.getAttribute('data-lang') || 'en';

  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    const translation = this.i18n.t(key, currentLang);

    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
      element.placeholder = translation;
    } else {
      element.textContent = translation;
    }
  });

  // Show/hide language-specific elements
  document.querySelectorAll('.lang-en, .lang-ar, .lang-fr, .lang-es').forEach(element => {
    const elementLang = element.className.match(/lang-(\w+)/)?.[1];
    element.style.display = elementLang === currentLang ? '' : 'none';
  });
}

initClock() {
  if (typeof window !== 'undefined' && typeof window.IIF_siteClockTick === 'function') {
    return;
  }
  const updateClock = () => {
    const now = new Date();
    const timeElement = document.getElementById('site-clock-time');
    const dateElement = document.getElementById('site-clock-date');
    const tzElement = document.getElementById('site-clock-tz');
    const lang = (document.documentElement && document.documentElement.getAttribute('data-lang')) || 'en';
    const localeMap = { ar: 'ar-SA-u-nu-latn', en: 'en-GB', fr: 'fr-FR', de: 'de-DE', es: 'es-ES' };
    const loc = localeMap[lang] || (typeof navigator !== 'undefined' && navigator.language) || 'en-GB';

    if (timeElement) {
      try {
        timeElement.textContent = now.toLocaleTimeString(loc, { hour: 'numeric', minute: '2-digit', second: '2-digit' });
      } catch (e) {
        timeElement.textContent = now.toLocaleTimeString();
      }
    }

    if (dateElement) {
      try {
        dateElement.textContent = now.toLocaleDateString(loc, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
      } catch (e) {
        dateElement.textContent = now.toLocaleDateString();
      }
    }

    if (tzElement) {
      try {
        tzElement.textContent = Intl.DateTimeFormat().resolvedOptions().timeZone;
      } catch (e2) {
        tzElement.textContent = '';
      }
    }
  };

  updateClock();
  setInterval(updateClock, 1000);
}

initSearch() {
  const searchInput = document.getElementById('iif-search');
  const searchResults = document.getElementById('iif-search-wrap');

  if (!searchInput || !searchResults) return;

  searchInput.addEventListener('focus', () => {
    if (searchInput.value.trim()) {
      searchResults.classList.add('has-results');
    }
  });

  searchInput.addEventListener('blur', () => {
    setTimeout(() => {
      searchResults.classList.remove('has-results');
    }, 200);
  });
}

handleSearch(query) {
  const searchResults = document.getElementById('iif-search-wrap');

  if (!query.trim()) {
    searchResults.classList.remove('has-results');
    searchResults.innerHTML = '';
    return;
  }

  // Simulate search results
  const results = [
    { title: 'Home', url: '#home' },
    { title: 'About', url: '#about' },
    { title: 'Services', url: '#services' },
    { title: 'Contact', url: '#contact' }
  ].filter(item =>
    item.title.toLowerCase().includes(query.toLowerCase())
  );

  if (results.length > 0) {
    searchResults.innerHTML = results.map(result =>
      `<a href="${result.url}" class="iif-search-result">${result.title}</a>`
    ).join('');
    searchResults.classList.add('has-results');
  } else {
    searchResults.innerHTML = '<div class="iif-search-result">No results found</div>';
    searchResults.classList.add('has-results');
  }
}

initTicker() {
  const tickerData = [
    { name: 'Reuters Markets', url: 'https://www.reuters.com/markets/' },
    { name: 'Bloomberg', url: 'https://www.bloomberg.com/markets' },
    { name: 'Financial Times', url: 'https://www.ft.com/markets' },
    { name: 'CNBC World', url: 'https://www.cnbc.com/world/?region=world' }
  ];

  const tickerCopy = document.getElementById('ticker-copy-1');
  const tickerCopy2 = document.getElementById('ticker-copy-2');

  if (tickerCopy && tickerCopy2) {
    const tickerHTML = tickerData.map(item =>
      `<a href="${item.url}" target="_blank" rel="noopener" class="ticker-item">${item.name}</a>`
    ).join('');

    tickerCopy.innerHTML = tickerHTML;
    tickerCopy2.innerHTML = tickerHTML;
  }
}

updateNavigationActive(pageName) {
  document.querySelectorAll('.site-nav__link').forEach(link => {
    link.classList.remove('is-active');
    if (link.getAttribute('data-page') === pageName) {
      link.classList.add('is-active');
    }
  });
}

toggleMobileMenu() {
  const nav = document.querySelector('.site-nav');
  if (nav) {
    nav.classList.toggle('mobile-menu-open');
  }
}

showHero() {
  const heroSection = document.getElementById('hero');
  if (heroSection) {
    heroSection.style.display = 'block';
  }
}

showFeatures() {
  // Features are included in hero component
}

showNewsTicker() {
  const ticker = document.querySelector('.site-header__tickers');
  if (ticker) {
    ticker.style.display = 'block';
  }
}

showAboutContent() {
  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    mainContent.innerHTML = `
        <div class="about-page">
          <div class="page-header">
            <h1 data-i18n="aboutTitle">About International Investment Fund</h1>
            <p data-i18n="aboutSubtitle">Leading the way in global investment solutions</p>
          </div>
          <div class="about-content">
            <div class="about-section">
              <h2 data-i18n="ourMission">Our Mission</h2>
              <p data-i18n="ourMissionText">To provide exceptional investment opportunities and financial services worldwide...</p>
            </div>
            <div class="about-section">
              <h2 data-i18n="ourVision">Our Vision</h2>
              <p data-i18n="ourVisionText">To be the global leader in sustainable investment and wealth creation...</p>
            </div>
          </div>
        </div>
      `;
  }
}

showContactForm() {
  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    mainContent.innerHTML = `
        <div class="contact-page">
          <div class="page-header">
            <h1 data-i18n="contactTitle">Contact Us</h1>
            <p data-i18n="contactSubtitle">Get in touch with our team</p>
          </div>
          <div class="contact-form">
            <form id="contact-form">
              <div class="form-row">
                <div class="form-group">
                  <label data-i18n="nameLabel">Name</label>
                  <input type="text" required>
                </div>
                <div class="form-group">
                  <label data-i18n="emailLabel">Email</label>
                  <input type="email" required>
                </div>
              </div>
              <div class="form-group">
                <label data-i18n="subjectLabel">Subject</label>
                <input type="text" required>
              </div>
              <div class="form-group">
                <label data-i18n="messageLabel">Message</label>
                <textarea required></textarea>
              </div>
              <button type="submit" class="btn btn--primary" data-i18n="sendMessage">Send Message</button>
            </form>
          </div>
        </div>
      `;
  }
}

showLoginForm() {
  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    mainContent.innerHTML = `
        <div class="auth-page">
          <div class="auth-card">
            <div class="auth__header">
              <h1 data-i18n="signInTitle">Sign In</h1>
              <p data-i18n="signInSubtitle">Welcome back to IIF</p>
            </div>
            <form id="login-form" class="auth__form">
              <div class="form-group">
                <label data-i18n="emailLabel">Email</label>
                <input type="email" id="login-email" required>
              </div>
              <div class="form-group">
                <label data-i18n="passwordLabel">Password</label>
                <input type="password" id="login-password" required>
              </div>
              <div class="auth__actions">
                <button type="submit" class="btn btn--primary btn--full" data-i18n="signIn">Sign In</button>
              </div>
            </form>
            <div class="auth__footer">
              <p data-i18n="noAccount">Don't have an account?</p>
              <a href="#register" data-i18n="createAccount">Create account</a>
            </div>
          </div>
        </div>
      `;
  }
}

showRegisterForm() {
  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    mainContent.innerHTML = `
        <div class="auth-page">
          <div class="auth-card">
            <div class="auth__header">
              <h1 data-i18n="createAccountTitle">Create Account</h1>
              <p data-i18n="createAccountSubtitle">Join IIF today</p>
            </div>
            <form id="register-form" class="auth__form">
              <div class="form-group">
                <label data-i18n="fullNameLabel">Full Name</label>
                <input type="text" id="register-name" required>
              </div>
              <div class="form-group">
                <label data-i18n="emailLabel">Email</label>
                <input type="email" id="register-email" required>
              </div>
              <div class="form-group">
                <label data-i18n="passwordLabel">Password</label>
                <input type="password" id="register-password" required>
              </div>
              <div class="form-group">
                <label data-i18n="confirmPasswordLabel">Confirm Password</label>
                <input type="password" id="register-confirm" required>
              </div>
              <div class="auth__actions">
                <button type="submit" class="btn btn--primary btn--full" data-i18n="createAccount">Create Account</button>
              </div>
            </form>
            <div class="auth__footer">
              <p data-i18n="haveAccount">Already have an account?</p>
              <a href="#login" data-i18n="signIn">Sign In</a>
            </div>
          </div>
        </div>
      `;
  }
}

showGovernmentSearchContent() {
  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    mainContent.innerHTML = `
        <div class="government-automated-page">
          <!-- Hero Section -->
          <section class="automated-hero">
            <div class="automated-hero__content">
              <h1 class="automated-hero__title" data-i18n="automatedSearchTitle">
                Automated Government Information System
              </h1>
              <p class="automated-hero__subtitle" data-i18n="automatedSearchSubtitle">
                Just type a country name and get instant access to complete government information
              </p>

              <!-- Automated Search Input -->
              <div class="automated-search-container">
                <div class="search-input-group">
                  <div class="search-input-wrapper">
                    <input
                      type="text"
                      id="country-search-input"
                      class="automated-search-input"
                      placeholder="Type any country name (e.g., Saudi Arabia, USA, France)..."
                      data-i18n="automatedSearchPlaceholder"
                      autocomplete="off"
                      autofocus
                    >
                    <div class="search-icon">🤖</div>
                    <div class="search-status" id="search-status">
                      <span class="status-text">Ready to search</span>
                      <div class="status-indicator"></div>
                    </div>
                  </div>
                  <button type="button" class="btn btn--primary btn--large automated-search-btn" id="automated-search-btn">
                    <span class="search-btn-icon">🤖</span>
                    <span data-i18n="automatedSearch">Auto Search</span>
                  </button>
                </div>

                <!-- Search Suggestions -->
                <div class="automated-suggestions" id="automated-suggestions">
                  <div class="suggestions-header">
                    <span class="suggestions-title">Popular Searches:</span>
                  </div>
                  <div class="suggestions-list">
                    <button class="suggestion-item" data-country="Saudi Arabia">
                      <span class="suggestion-flag">🇸🇦</span>
                      <span class="suggestion-name">Saudi Arabia</span>
                    </button>
                    <button class="suggestion-item" data-country="United States">
                      <span class="suggestion-flag">🇺🇸</span>
                      <span class="suggestion-name">United States</span>
                    </button>
                    <button class="suggestion-item" data-country="United Kingdom">
                      <span class="suggestion-flag">🇬🇧</span>
                      <span class="suggestion-name">United Kingdom</span>
                    </button>
                    <button class="suggestion-item" data-country="France">
                      <span class="suggestion-flag">🇫🇷</span>
                      <span class="suggestion-name">France</span>
                    </button>
                    <button class="suggestion-item" data-country="Germany">
                      <span class="suggestion-flag">🇩🇪</span>
                      <span class="suggestion-name">Germany</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Search Results Section -->
          <section class="automated-results-section" id="search-results-section" style="display: none;">
            <div class="results-container">
              <!-- Country Header -->
              <div class="country-header" id="results-country-header">
                <!-- Will be populated by JavaScript -->
              </div>

              <!-- Quick Facts -->
              <div class="quick-facts-section">
                <h2 class="section-title">Quick Facts</h2>
                <div class="facts-grid" id="quick-facts">
                  <!-- Will be populated by JavaScript -->
                </div>
              </div>

              <!-- Leadership Section -->
              <div class="leadership-section">
                <h2 class="section-title">Government Leadership</h2>
                <div class="leadership-grid" id="leadership-section">
                  <!-- Will be populated by JavaScript -->
                </div>
              </div>

              <!-- Ministries Section -->
              <div class="ministries-section">
                <h2 class="section-title">Government Ministries</h2>
                <div class="ministries-grid" id="ministries-section">
                  <!-- Will be populated by JavaScript -->
                </div>
              </div>

              <!-- Important Contacts -->
              <div class="contacts-section">
                <h2 class="section-title">Important Contacts</h2>
                <div class="contacts-grid" id="contacts-section">
                  <!-- Will be populated by JavaScript -->
                </div>
              </div>

              <!-- Emergency Contacts -->
              <div class="emergency-section">
                <h2 class="section-title">Emergency Contacts</h2>
                <div class="emergency-grid" id="emergency-contacts">
                  <!-- Will be populated by JavaScript -->
                </div>
              </div>
            </div>
          </section>

          <!-- Loading State -->
          <div class="automated-loading" id="loading-overlay" style="display: none;">
            <div class="loading-content">
              <div class="loading-animation">
                <div class="loading-robot">🤖</div>
                <div class="loading-dots">
                  <span class="dot"></span>
                  <span class="dot"></span>
                  <span class="dot"></span>
                </div>
              </div>
              <p class="loading-text">Automated search in progress...</p>
              <p class="loading-subtitle">Fetching government information from multiple sources</p>
            </div>
          </div>
        </div>
      `;

    // Initialize automated search functionality
    this.initAutomatedSearch();
  }
}

initAutomatedSearch() {
  const searchInput = document.getElementById('country-search-input');
  const searchBtn = document.getElementById('automated-search-btn');
  const suggestions = document.querySelectorAll('.suggestion-item');

  if (searchInput) {
    let searchTimeout;

    // Auto-search on input
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim();

      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }

      if (query.length >= 2) {
        searchTimeout = setTimeout(() => {
          this.performAutomatedSearch(query);
        }, 500);
      }
    });

    // Search on Enter
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const query = e.target.value.trim();
        if (query.length >= 2) {
          this.performAutomatedSearch(query);
        }
      }
    });
  }

  // Search button click
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      const query = searchInput.value.trim();
      if (query.length >= 2) {
        this.performAutomatedSearch(query);
      }
    });
  }

  // Suggestion clicks
  suggestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const country = btn.getAttribute('data-country');
      if (searchInput) {
        searchInput.value = country;
      }
      this.performAutomatedSearch(country);
    });
  });
}

  async performAutomatedSearch(countryName) {
  // Trigger automated search event
  const event = new CustomEvent('automated-search', {
    detail: { countryName }
  });
  document.dispatchEvent(event);
}

showDashboardContent() {
  // Dashboard is loaded via loadPage method
}

showLettersContent() {
  // Letters page is loaded via loadPage method
}

showTeamContent() {
  // Team page is loaded via loadPage method
}

showSettingsContent() {
  // Settings page is loaded via loadPage method
}

showAdminContent() {
  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    mainContent.innerHTML = `
        <div class="admin-page">
          <div class="page-header">
            <h1 data-i18n="adminTitle">Admin Panel</h1>
            <p data-i18n="adminSubtitle">System administration</p>
          </div>
          <div class="admin-sections">
            <div class="admin-section">
              <h2 data-i18n="userManagement">User Management</h2>
              <p data-i18n="userManagementText">Manage system users and permissions</p>
            </div>
            <div class="admin-section">
              <h2 data-i18n="systemSettings">System Settings</h2>
              <p data-i18n="systemSettingsText">Configure system parameters</p>
            </div>
          </div>
        </div>
      `;
  }
}

showNotFoundError() {
  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    mainContent.innerHTML = `
        <div class="error-page">
          <div class="error__content">
            <h1 class="error__code">404</h1>
            <h2 class="error__title" data-i18n="pageNotFound">Page Not Found</h2>
            <p class="error__message" data-i18n="pageNotFoundMessage">The page you're looking for doesn't exist.</p>
            <div class="error__actions">
              <a href="#home" class="btn btn--primary" data-i18n="goHome">Go Home</a>
              <a href="#contact" class="btn btn--ghost" data-i18n="contactUs">Contact Us</a>
            </div>
          </div>
        </div>
      `;
  }
}

updateUserInterface(user) {
  const authBtns = document.getElementById('header-auth-btns');
  const userCard = document.getElementById('header-user-card');
  const userNav = document.getElementById('site-nav-user');
  const navDashboard = document.getElementById('nav-dashboard');
  const navUserDashboard = document.getElementById('nav-user-dashboard');
  const navLogout = document.getElementById('nav-logout');

  if (user) {
    // Show user card, hide auth buttons
    if (authBtns) authBtns.style.display = 'none';
    if (userCard) {
      userCard.style.display = 'flex';
      const userName = document.getElementById('header-user-name');
      const userMeta = document.getElementById('header-user-meta');
      if (userName) userName.textContent = user.name || user.email;
      if (userMeta) userMeta.textContent = user.role || 'Member';
    }
    if (userNav) userNav.style.display = 'block';

    // Make dashboard/profile/logout visible and point to SPA routes.
    if (navDashboard) {
      navDashboard.style.display = 'inline-flex';
      navDashboard.setAttribute('href', '/dashboard');
    }
    if (navUserDashboard) {
      navUserDashboard.style.display = 'inline-flex';
      navUserDashboard.setAttribute('href', '/dashboard');
    }
    if (navLogout) {
      navLogout.style.display = 'inline-flex';
      // Ensure logout works even if the host page is legacy.
      navLogout.onclick = (e) => {
        e.preventDefault();
        try {
          if (window.app && window.app.auth && typeof window.app.auth.logout === 'function') {
            window.app.auth.logout();
          } else {
            document.dispatchEvent(new CustomEvent('logout'));
          }
        } catch (err) {
          document.dispatchEvent(new CustomEvent('logout'));
        }
      };
    }
  } else {
    // Show auth buttons, hide user card
    if (authBtns) authBtns.style.display = 'flex';
    if (userCard) userCard.style.display = 'none';
    if (userNav) userNav.style.display = 'none';

    if (navDashboard) navDashboard.style.display = 'none';
    if (navUserDashboard) navUserDashboard.style.display = 'none';
    if (navLogout) navLogout.style.display = 'none';
  }
}

showAlert(type, message) {
  // Create alert element
  const alert = document.createElement('div');
  alert.className = `alert alert--${type}`;
  alert.textContent = message;

  // Add to page
  document.body.appendChild(alert);

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (alert.parentNode) {
      alert.parentNode.removeChild(alert);
    }
  }, 5000);
}

updateDependentComponents(key, value) {
  // Update components that depend on storage changes
  switch (key) {
    case 'user':
      this.updateUserInterface(value);
      break;
    case 'language':
      this.handleLanguageChange(value);
      break;
    default:
      // Generic update
      break;
  }
}
}
