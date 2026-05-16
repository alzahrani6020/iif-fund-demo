// Government Search UI Controller
export class GovernmentSearchUI {
  constructor(governmentService, apiService) {
    this.govService = governmentService;
    this.apiService = apiService;
    this.currentResults = null;
    this.searchTimeout = null;
    this.isSearching = false;
  }

  async init() {
    console.log('🔍 Initializing Government Search UI...');

    // Load search component
    await this.loadSearchComponent();

    // Setup event listeners
    this.setupEventListeners();

    // Load initial data
    await this.loadInitialData();

    console.log('✅ Government Search UI initialized successfully!');
  }

  async loadSearchComponent() {
    try {
      // Load the enhanced government search HTML
      const response = await fetch('components/government-search-page.html');
      const html = await response.text();

      // Insert into main content
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.innerHTML = html;
      }

      console.log('✅ Enhanced government search component loaded');
    } catch (error) {
      console.error('❌ Failed to load government search component:', error);
      // Fallback to basic component
      await this.loadBasicSearchComponent();
    }
  }

  async loadBasicSearchComponent() {
    try {
      const response = await fetch('components/government-search.html');
      const html = await response.text();

      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.innerHTML = html;
      }

      console.log('✅ Basic government search component loaded');
    } catch (error) {
      console.error('❌ Failed to load basic search component:', error);
    }
  }

  setupEventListeners() {
    // Enhanced search form submission
    document.addEventListener('submit', (e) => {
      if (e.target.id === 'enhanced-search-form' || e.target.id === 'gov-search-form') {
        e.preventDefault();
        this.handleSearchSubmit(e.target);
      }
    });

    // Search input with auto-complete
    document.addEventListener('input', (e) => {
      if (e.target.id === 'country-search-input') {
        this.handleSearchInput(e.target.value);
      }
    });

    // Search input focus
    document.addEventListener('focus', (e) => {
      if (e.target.id === 'country-search-input') {
        this.showSearchSuggestions();
      }
    });

    // Document click to close suggestions
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-input-wrapper')) {
        this.hideSearchSuggestions();
      }
    });

    // Suggestion item clicks
    document.addEventListener('click', (e) => {
      if (e.target.matches('.suggestion-item')) {
        const country = e.target.getAttribute('data-country');
        this.selectCountry(country);
      }
    });

    // History item clicks
    document.addEventListener('click', (e) => {
      if (e.target.matches('.history-item')) {
        const country = e.target.getAttribute('data-country');
        this.selectCountry(country);
      }
    });

    // Trending item clicks
    document.addEventListener('click', (e) => {
      if (e.target.closest('.trending-item')) {
        const item = e.target.closest('.trending-item');
        const country = item.getAttribute('data-country');
        this.selectCountry(country);
      }
    });

    // Clear history
    document.addEventListener('click', (e) => {
      if (e.target.id === 'clear-history') {
        this.clearSearchHistory();
      }
    });

    // Retry search
    document.addEventListener('click', (e) => {
      if (e.target.id === 'retry-search') {
        this.retryLastSearch();
      }
    });

    // Favorite button
    document.addEventListener('click', (e) => {
      if (e.target.closest('.favorite-btn')) {
        const btn = e.target.closest('.favorite-btn');
        const country = btn.getAttribute('data-country');
        this.toggleFavorite(country, btn);
      }
    });

    // Share button
    document.addEventListener('click', (e) => {
      if (e.target.closest('.share-btn')) {
        const btn = e.target.closest('.share-btn');
        const country = btn.getAttribute('data-country');
        this.shareResults(country);
      }
    });
  }

  async loadInitialData() {
    // Show search history
    this.displaySearchHistory();

    // Show trending countries
    this.displayTrendingCountries();
  }

  handleSearchSubmit(form) {
    const input = form.querySelector('#country-search-input');
    const country = input.value.trim();

    if (!country) {
      this.showError('Please enter a country name');
      return;
    }

    this.performSearch(country);
  }

  handleSearchInput(query) {
    // Clear previous timeout
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    // Hide suggestions if query is empty
    if (!query.trim()) {
      this.hideSearchSuggestions();
      return;
    }

    // Debounce search suggestions
    this.searchTimeout = setTimeout(async () => {
      await this.fetchSearchSuggestions(query);
    }, 300);
  }

  async fetchSearchSuggestions(query) {
    try {
      const countries = await this.apiService.searchCountries(query);
      this.displaySearchSuggestions(countries);
    } catch (error) {
      console.error('Failed to fetch search suggestions:', error);
      this.hideSearchSuggestions();
    }
  }

  displaySearchSuggestions(countries) {
    const suggestionsContainer = document.getElementById('search-suggestions');
    if (!suggestionsContainer || countries.length === 0) {
      this.hideSearchSuggestions();
      return;
    }

    const suggestionsHTML = countries.map(country => `
      <div class="suggestion-item" data-country="${country.name}">
        <img src="${country.flag}" alt="${country.name}" class="suggestion-flag">
        <div class="suggestion-content">
          <div class="suggestion-name">${country.name}</div>
          <div class="suggestion-region">${country.region}</div>
        </div>
      </div>
    `).join('');

    suggestionsContainer.innerHTML = suggestionsHTML;
    suggestionsContainer.style.display = 'block';
  }

  showSearchSuggestions() {
    const suggestionsContainer = document.getElementById('search-suggestions');
    if (suggestionsContainer && suggestionsContainer.innerHTML.trim()) {
      suggestionsContainer.style.display = 'block';
    }
  }

  hideSearchSuggestions() {
    const suggestionsContainer = document.getElementById('search-suggestions');
    if (suggestionsContainer) {
      suggestionsContainer.style.display = 'none';
    }
  }

  selectCountry(country) {
    const input = document.getElementById('country-search-input');
    input.value = country;
    this.hideSearchSuggestions();
    this.performSearch(country);
  }

  async performSearch(country) {
    if (this.isSearching) {
      return;
    }

    this.isSearching = true;
    this.showLoading();

    try {
      console.log(`🔍 Searching for: ${country}`);

      // Get government information
      const results = await this.govService.searchGovernmentInfo(country);

      this.currentResults = results;
      this.displayResults(results);
      this.hideLoading();

      console.log(`✅ Search completed for: ${country}`);

    } catch (error) {
      console.error(`❌ Search failed for ${country}:`, error);
      this.showError(`Failed to fetch information for ${country}. Please try again.`);
      this.hideLoading();
    } finally {
      this.isSearching = false;
    }
  }

  displayResults(results) {
    const resultsContainer = document.getElementById('search-results');
    const template = document.getElementById('gov-info-template');

    if (!resultsContainer || !template) {
      return;
    }

    // Use a simple template replacement (in real app, use a template engine)
    const resultsHTML = this.renderGovernmentInfo(results);

    resultsContainer.innerHTML = resultsHTML;
    resultsContainer.style.display = 'block';

    // Hide other sections
    this.hideOtherSections();

    // Update language
    this.updateLanguage();
  }

  renderGovernmentInfo(info) {
    return `
      <div class="government-info">
        <!-- Country Header -->
        <div class="country-header">
          <div class="country-flag">
            <img src="${info.basicInfo?.flag || 'assets/default-flag.png'}" alt="${info.country} flag">
          </div>
          <div class="country-info">
            <h2 class="country-name">${info.country}</h2>
            <p class="country-official-name">${info.basicInfo?.officialName || info.country}</p>
            <div class="country-meta">
              <span class="country-capital">🏛️ ${info.basicInfo?.capital || 'N/A'}</span>
              <span class="country-region">🌍 ${info.basicInfo?.region || 'N/A'}</span>
              <span class="country-population">👥 ${this.formatNumber(info.basicInfo?.population) || 'N/A'}</span>
            </div>
          </div>
          <div class="country-actions">
            <button class="btn btn--ghost btn-sm favorite-btn" data-country="${info.country}">
              <span class="favorite-icon">❤️</span>
              <span class="favorite-text">Add to Favorites</span>
            </button>
            <button class="btn btn--ghost btn-sm share-btn" data-country="${info.country}">
              <span class="share-icon">📤</span>
              <span>Share</span>
            </button>
          </div>
        </div>

        <!-- Quick Facts -->
        <div class="quick-facts">
          <h3>Quick Facts</h3>
          <div class="facts-grid">
            ${info.quickFacts?.map(fact => `
              <div class="fact-item">
                <span class="fact-icon">${fact.icon}</span>
                <div class="fact-content">
                  <h4 class="fact-title">${fact.title}</h4>
                  <p class="fact-value">${fact.value}</p>
                </div>
              </div>
            `).join('') || '<p>No quick facts available</p>'}
          </div>
        </div>

        <!-- Important Contacts -->
        <div class="important-contacts">
          <h3>Important Contacts</h3>
          <div class="contacts-grid">
            ${info.importantContacts?.map(contact => `
              <div class="contact-card">
                <div class="contact-header">
                  <span class="contact-type-icon">${this.getContactIcon(contact.type)}</span>
                  <h4 class="contact-name">${contact.name}</h4>
                  <span class="contact-type">${contact.type}</span>
                </div>
                <div class="contact-details">
                  <div class="contact-item">
                    <span class="contact-label">📞</span>
                    <a href="tel:${contact.phone}" class="contact-value">${contact.phone}</a>
                  </div>
                  <div class="contact-item">
                    <span class="contact-label">📧</span>
                    <a href="mailto:${contact.email}" class="contact-value">${contact.email}</a>
                  </div>
                  <div class="contact-item">
                    <span class="contact-label">🌐</span>
                    <a href="${contact.website}" target="_blank" class="contact-value">${contact.website}</a>
                  </div>
                  <div class="contact-item">
                    <span class="contact-label">📍</span>
                    <span class="contact-value">${contact.address}</span>
                  </div>
                </div>
              </div>
            `).join('') || '<p>No important contacts available</p>'}
          </div>
        </div>

        <!-- Ministries -->
        <div class="ministries">
          <h3>Government Ministries</h3>
          <div class="ministries-grid">
            ${info.ministries?.slice(0, 6).map(ministry => `
              <div class="ministry-card">
                <h4 class="ministry-name">${ministry.name}</h4>
                <p class="ministry-type">${ministry.type}</p>
                <p class="ministry-description">${ministry.description}</p>
                <div class="ministry-contacts">
                  <a href="tel:${ministry.phone}" class="ministry-phone">📞 ${ministry.phone}</a>
                  <a href="mailto:${ministry.email}" class="ministry-email">📧 ${ministry.email}</a>
                  <a href="${ministry.website}" target="_blank" class="ministry-website">🌐 Website</a>
                </div>
              </div>
            `).join('') || '<p>No ministries information available</p>'}
          </div>
        </div>

        <!-- Emergency Contacts -->
        <div class="emergency-contacts">
          <h3>Emergency Contacts</h3>
          <div class="emergency-grid">
            ${info.emergencyContacts?.map(contact => `
              <div class="emergency-card emergency-${contact.type}">
                <span class="emergency-icon">${this.getEmergencyIcon(contact.type)}</span>
                <div class="emergency-info">
                  <h4 class="emergency-name">${contact.name}</h4>
                  <a href="tel:${contact.number}" class="emergency-number">${contact.number}</a>
                  <p class="emergency-description">${contact.description}</p>
                </div>
              </div>
            `).join('') || '<p>No emergency contacts available</p>'}
          </div>
        </div>

        <!-- Last Updated -->
        <div class="last-updated">
          <p>Last updated:</p>
          <span class="update-time">${new Date(info.lastUpdated).toLocaleString()}</span>
        </div>
      </div>
    `;
  }

  displaySearchHistory() {
    const historyContainer = document.getElementById('history-list');
    const historySection = document.getElementById('search-history');

    if (!historyContainer) return;

    const history = this.govService.getSearchHistory();

    if (history.length === 0) {
      if (historySection) historySection.style.display = 'none';
      return;
    }

    const historyHTML = history.slice(0, 10).map(country => `
      <button class="history-item" data-country="${country}">
        ${country}
      </button>
    `).join('');

    historyContainer.innerHTML = historyHTML;
    if (historySection) historySection.style.display = 'block';
  }

  displayTrendingCountries() {
    const trendingContainer = document.getElementById('trending-grid');

    if (!trendingContainer) return;

    const trending = this.govService.getTrendingCountries();

    if (trending.length === 0) {
      // Show default trending countries
      const defaultTrending = [
        { name: 'Saudi Arabia', flag: 'assets/flags/sa.svg', region: 'Asia' },
        { name: 'United States', flag: 'assets/flags/us.svg', region: 'Americas' },
        { name: 'United Kingdom', flag: 'assets/flags/uk.svg', region: 'Europe' },
        { name: 'United Arab Emirates', flag: 'assets/flags/ae.svg', region: 'Asia' }
      ];

      const trendingHTML = defaultTrending.map(country => `
        <div class="trending-item" data-country="${country.name}">
          <img src="${country.flag}" alt="${country.name}" class="trending-flag">
          <div class="trending-name">${country.name}</div>
          <div class="trending-region">${country.region}</div>
        </div>
      `).join('');

      trendingContainer.innerHTML = trendingHTML;
      return;
    }

    const trendingHTML = trending.map(country => `
      <div class="trending-item" data-country="${country}">
        <div class="trending-name">${country}</div>
      </div>
    `).join('');

    trendingContainer.innerHTML = trendingHTML;
  }

  clearSearchHistory() {
    this.govService.clearSearchHistory();
    this.displaySearchHistory();
  }

  async retryLastSearch() {
    const input = document.getElementById('country-search-input');
    const lastSearch = input.value.trim();

    if (lastSearch) {
      await this.performSearch(lastSearch);
    }
  }

  toggleFavorite(country, button) {
    const favorites = this.govService.getFavoriteCountries();
    const isFavorite = favorites.includes(country);

    if (isFavorite) {
      this.govService.removeFromFavorites(country);
      button.classList.remove('is-favorite');
      button.querySelector('.favorite-text').textContent = 'Add to Favorites';
    } else {
      this.govService.addToFavorites(country);
      button.classList.add('is-favorite');
      button.querySelector('.favorite-text').textContent = 'Remove from Favorites';
    }
  }

  shareResults(country) {
    // Create shareable URL
    const shareUrl = `${window.location.origin}${window.location.pathname}#government/${country}`;

    // Use Web Share API if available
    if (navigator.share) {
      navigator.share({
        title: `Government Information - ${country}`,
        text: `View government contact information for ${country}`,
        url: shareUrl
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareUrl).then(() => {
        this.showNotification('Link copied to clipboard!');
      });
    }
  }

  showLoading() {
    const loadingState = document.getElementById('loading-state');
    const resultsContainer = document.getElementById('search-results');
    const errorState = document.getElementById('error-state');

    if (loadingState) loadingState.style.display = 'block';
    if (resultsContainer) resultsContainer.style.display = 'none';
    if (errorState) errorState.style.display = 'none';
  }

  hideLoading() {
    const loadingState = document.getElementById('loading-state');
    if (loadingState) loadingState.style.display = 'none';
  }

  showError(message) {
    const errorState = document.getElementById('error-state');
    const errorMessage = document.getElementById('error-message');
    const resultsContainer = document.getElementById('search-results');
    const loadingState = document.getElementById('loading-state');

    if (errorMessage) errorMessage.textContent = message;
    if (errorState) errorState.style.display = 'block';
    if (resultsContainer) resultsContainer.style.display = 'none';
    if (loadingState) loadingState.style.display = 'none';
  }

  hideOtherSections() {
    const historySection = document.getElementById('search-history');
    const trendingSection = document.querySelector('.trending-countries');

    if (historySection) historySection.style.display = 'none';
    if (trendingSection) trendingSection.style.display = 'none';
  }

  showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'alert alert--success';
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '9999';
    notification.style.minWidth = '300px';

    document.body.appendChild(notification);

    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  }

  updateLanguage() {
    // Update all i18n elements
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      // In real app, use i18n service
      // element.textContent = this.i18n.t(key);
    });
  }

  // Helper methods
  formatNumber(num) {
    if (!num) return 'N/A';
    return new Intl.NumberFormat().format(num);
  }

  getContactIcon(type) {
    const icons = {
      embassy: '🏛️',
      investment: '💰',
      tourism: '✈️',
      trade: '📊'
    };
    return icons[type] || '🏢';
  }

  getEmergencyIcon(type) {
    const icons = {
      police: '🚔',
      medical: '🚑',
      fire: '🚒'
    };
    return icons[type] || '🚨';
  }
}
