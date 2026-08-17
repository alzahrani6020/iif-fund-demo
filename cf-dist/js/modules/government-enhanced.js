// Enhanced Government Search with Country Dropdown
export class GovernmentSearchUI {
  constructor(governmentService, apiService) {
    this.govService = governmentService;
    this.apiService = apiService;
    this.currentResults = null;
    this.searchTimeout = null;
    this.isSearching = false;
    this.countries = [];
    this.useDropdown = false; // Can be toggled based on user preference
  }

  async init() {
    console.log('🔍 Initializing Government Search UI...');
    
    // Load countries data
    await this.loadCountriesData();
    
    // Load search component
    await this.loadSearchComponent();
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Load initial data
    await this.loadInitialData();
    
    console.log('✅ Government Search UI initialized successfully!');
  }

  async loadCountriesData() {
    try {
      // Load comprehensive countries list
      const response = await fetch('data/countries.json');
      if (response.ok) {
        this.countries = await response.json();
      } else {
        // Fallback to essential countries
        this.countries = this.getEssentialCountries();
      }
    } catch (error) {
      console.log('Using fallback countries data');
      this.countries = this.getEssentialCountries();
    }
  }

  getEssentialCountries() {
    return [
      { code: 'SA', name: 'Saudi Arabia', nameAr: 'المملكة العربية السعودية', region: 'Middle East', flag: '🇸🇦' },
      { code: 'AE', name: 'United Arab Emirates', nameAr: 'الإمارات العربية المتحدة', region: 'Middle East', flag: '🇦🇪' },
      { code: 'QA', name: 'Qatar', nameAr: 'قطر', region: 'Middle East', flag: '🇶🇦' },
      { code: 'KW', name: 'Kuwait', nameAr: 'الكويت', region: 'Middle East', flag: '🇰🇼' },
      { code: 'BH', name: 'Bahrain', nameAr: 'البحرين', region: 'Middle East', flag: '🇧🇭' },
      { code: 'OM', name: 'Oman', nameAr: 'عمان', region: 'Middle East', flag: '🇴🇲' },
      { code: 'EG', name: 'Egypt', nameAr: 'مصر', region: 'Middle East', flag: '🇪🇬' },
      { code: 'JO', name: 'Jordan', nameAr: 'الأردن', region: 'Middle East', flag: '🇯🇴' },
      { code: 'LB', name: 'Lebanon', nameAr: 'لبنان', region: 'Middle East', flag: '🇱🇧' },
      { code: 'IQ', name: 'Iraq', nameAr: 'العراق', region: 'Middle East', flag: '🇮🇶' },
      { code: 'US', name: 'United States', nameAr: 'الولايات المتحدة', region: 'Americas', flag: '🇺🇸' },
      { code: 'GB', name: 'United Kingdom', nameAr: 'المملكة المتحدة', region: 'Europe', flag: '🇬🇧' },
      { code: 'FR', name: 'France', nameAr: 'فرنسا', region: 'Europe', flag: '🇫🇷' },
      { code: 'DE', name: 'Germany', nameAr: 'ألمانيا', region: 'Europe', flag: '🇩🇪' },
      { code: 'IT', name: 'Italy', nameAr: 'إيطاليا', region: 'Europe', flag: '🇮🇹' },
      { code: 'ES', name: 'Spain', nameAr: 'إسبانيا', region: 'Europe', flag: '🇪🇸' },
      { code: 'NL', name: 'Netherlands', nameAr: 'هولندا', region: 'Europe', flag: '🇳🇱' },
      { code: 'CH', name: 'Switzerland', nameAr: 'سويسرا', region: 'Europe', flag: '🇨🇭' },
      { code: 'CN', name: 'China', nameAr: 'الصين', region: 'Asia', flag: '🇨🇳' },
      { code: 'JP', name: 'Japan', nameAr: 'اليابان', region: 'Asia', flag: '🇯🇵' },
      { code: 'IN', name: 'India', nameAr: 'الهند', region: 'Asia', flag: '🇮🇳' },
      { code: 'KR', name: 'South Korea', nameAr: 'كوريا الجنوبية', region: 'Asia', flag: '🇰🇷' },
      { code: 'SG', name: 'Singapore', nameAr: 'سنغافورة', region: 'Asia', flag: '🇸🇬' },
      { code: 'MY', name: 'Malaysia', nameAr: 'ماليزيا', region: 'Asia', flag: '🇲🇾' },
      { code: 'TH', name: 'Thailand', nameAr: 'تايلاند', region: 'Asia', flag: '🇹🇭' },
      { code: 'ID', name: 'Indonesia', nameAr: 'إندونيسيا', region: 'Asia', flag: '🇮🇩' },
      { code: 'PH', name: 'Philippines', nameAr: 'الفلبين', region: 'Asia', flag: '🇵🇭' },
      { code: 'PK', name: 'Pakistan', nameAr: 'باكستان', region: 'Asia', flag: '🇵🇰' },
      { code: 'BD', name: 'Bangladesh', nameAr: 'بنغلاديش', region: 'Asia', flag: '🇧🇩' },
      { code: 'CA', name: 'Canada', nameAr: 'كندا', region: 'Americas', flag: '🇨🇦' },
      { code: 'MX', name: 'Mexico', nameAr: 'المكسيك', region: 'Americas', flag: '🇲🇽' },
      { code: 'BR', name: 'Brazil', nameAr: 'البرازيل', region: 'Americas', flag: '🇧🇷' },
      { code: 'AR', name: 'Argentina', nameAr: 'الأرجنتين', region: 'Americas', flag: '🇦🇷' },
      { code: 'CL', name: 'Chile', nameAr: 'تشيلي', region: 'Americas', flag: '🇨🇱' },
      { code: 'CO', name: 'Colombia', nameAr: 'كولومبيا', region: 'Americas', flag: '🇨🇴' },
      { code: 'PE', name: 'Peru', nameAr: 'بيرو', region: 'Americas', flag: '🇵🇪' },
      { code: 'AU', name: 'Australia', nameAr: 'أستراليا', region: 'Oceania', flag: '🇦🇺' },
      { code: 'NZ', name: 'New Zealand', nameAr: 'نيوزيلندا', region: 'Oceania', flag: '🇳🇿' },
      { code: 'ZA', name: 'South Africa', nameAr: 'جنوب أفريقيا', region: 'Africa', flag: '🇿🇦' },
      { code: 'NG', name: 'Nigeria', nameAr: 'نيجيريا', region: 'Africa', flag: '🇳🇬' },
      { code: 'KE', name: 'Kenya', nameAr: 'كينيا', region: 'Africa', flag: '🇰🇪' },
      { code: 'EG', name: 'Egypt', nameAr: 'مصر', region: 'Africa', flag: '🇪🇬' },
      { code: 'MA', name: 'Morocco', nameAr: 'المغرب', region: 'Africa', flag: '🇲🇦' },
      { code: 'TN', name: 'Tunisia', nameAr: 'تونس', region: 'Africa', flag: '🇹🇳' },
      { code: 'DZ', name: 'Algeria', nameAr: 'الجزائر', region: 'Africa', flag: '🇩🇿' },
      { code: 'RU', name: 'Russia', nameAr: 'روسيا', region: 'Europe/Asia', flag: '🇷🇺' },
      { code: 'TR', name: 'Turkey', nameAr: 'تركيا', region: 'Middle East', flag: '🇹🇷' },
      { code: 'IR', name: 'Iran', nameAr: 'إيران', region: 'Middle East', flag: '🇮🇷' },
      { code: 'AF', name: 'Afghanistan', nameAr: 'أفغانستان', region: 'Asia', flag: '🇦🇫' }
    ];
  }

  async loadSearchComponent() {
    try {
      // Load the enhanced government search HTML
      const response = await fetch('components/government-search-enhanced.html');
      const html = await response.text();
      
      // Insert into main content
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.innerHTML = html;
      }
      
      // Initialize country dropdown or search input
      await this.initializeCountrySelector();
      
      console.log('✅ Enhanced government search component loaded');
    } catch (error) {
      console.error('❌ Failed to load government search component:', error);
      // Fallback to basic component
      await this.loadBasicSearchComponent();
    }
  }

  async initializeCountrySelector() {
    if (this.useDropdown) {
      await this.initializeDropdown();
    } else {
      await this.initializeSearchInput();
    }
  }

  async initializeDropdown() {
    const dropdownContainer = document.getElementById('country-dropdown-container');
    if (!dropdownContainer) return;

    // Group countries by region
    const countriesByRegion = this.groupCountriesByRegion();
    
    const dropdownHTML = `
      <div class="country-selector">
        <label class="selector-label" data-i18n="selectCountry">Select Country</label>
        <div class="dropdown-wrapper">
          <select id="country-select" class="country-select">
            <option value="" data-i18n="chooseCountry">Choose a country...</option>
            ${Object.entries(countriesByRegion).map(([region, countries]) => `
              <optgroup label="${region}">
                ${countries.map(country => `
                  <option value="${country.code}" data-name="${country.name}" data-flag="${country.flag}">
                    ${country.flag} ${country.name}
                  </option>
                `).join('')}
              </optgroup>
            `).join('')}
          </select>
          <div class="dropdown-arrow">▼</div>
        </div>
        <button type="submit" class="btn btn--primary btn--large search-btn">
          <span class="search-btn-icon">🔍</span>
          <span data-i18n="search">Search</span>
        </button>
      </div>
    `;
    
    dropdownContainer.innerHTML = dropdownHTML;
    
    // Add custom dropdown styling
    this.styleCustomDropdown();
  }

  async initializeSearchInput() {
    // Use existing search input with enhanced auto-complete
    const searchInput = document.getElementById('country-search-input');
    if (searchInput) {
      // Add enhanced auto-complete functionality
      this.setupEnhancedAutoComplete(searchInput);
    }
  }

  groupCountriesByRegion() {
    const regions = {};
    
    this.countries.forEach(country => {
      if (!regions[country.region]) {
        regions[country.region] = [];
      }
      regions[country.region].push(country);
    });
    
    // Sort countries within each region
    Object.keys(regions).forEach(region => {
      regions[region].sort((a, b) => a.name.localeCompare(b.name));
    });
    
    return regions;
  }

  setupEnhancedAutoComplete(input) {
    let currentFocus = -1;
    
    // Enhanced input event
    input.addEventListener('input', (e) => {
      const query = e.target.value.trim();
      const suggestionsContainer = document.getElementById('search-suggestions');
      
      if (!query) {
        this.hideSuggestions();
        return;
      }
      
      // Filter countries based on query
      const matches = this.countries.filter(country => 
        country.name.toLowerCase().includes(query.toLowerCase()) ||
        country.nameAr.includes(query) ||
        country.code.toLowerCase().includes(query.toLowerCase())
      );
      
      if (matches.length === 0) {
        this.hideSuggestions();
        return;
      }
      
      // Display suggestions
      this.displayEnhancedSuggestions(matches, query);
    });
    
    // Keyboard navigation
    input.addEventListener('keydown', (e) => {
      const suggestionsContainer = document.getElementById('search-suggestions');
      const items = suggestionsContainer?.querySelectorAll('.suggestion-item');
      
      if (!items) return;
      
      if (e.key === 'ArrowDown') {
        currentFocus++;
        this.addActive(items);
      } else if (e.key === 'ArrowUp') {
        currentFocus--;
        this.addActive(items);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (currentFocus > -1 && items[currentFocus]) {
          items[currentFocus].click();
        }
      } else if (e.key === 'Escape') {
        this.hideSuggestions();
      }
    });
  }

  displayEnhancedSuggestions(countries, query) {
    const suggestionsContainer = document.getElementById('search-suggestions');
    if (!suggestionsContainer) return;
    
    // Highlight matching text
    const highlightText = (text, query) => {
      const regex = new RegExp(`(${query})`, 'gi');
      return text.replace(regex, '<mark>$1</mark>');
    };
    
    const suggestionsHTML = countries.slice(0, 10).map(country => `
      <div class="suggestion-item enhanced" data-country="${country.name}" data-code="${country.code}">
        <div class="suggestion-flag">${country.flag}</div>
        <div class="suggestion-content">
          <div class="suggestion-name">${highlightText(country.name, query)}</div>
          <div class="suggestion-name-ar">${highlightText(country.nameAr, query)}</div>
          <div class="suggestion-meta">
            <span class="suggestion-code">${country.code}</span>
            <span class="suggestion-region">${country.region}</span>
          </div>
        </div>
        <div class="suggestion-actions">
          <button class="suggestion-quick-search" data-country="${country.name}">
            <span>🔍</span>
          </button>
        </div>
      </div>
    `).join('');
    
    suggestionsContainer.innerHTML = suggestionsHTML;
    suggestionsContainer.style.display = 'block';
  }

  addActive(items) {
    if (!items) return;
    
    // Remove active class from all items
    this.removeActive(items);
    
    if (currentFocus >= items.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = items.length - 1;
    
    items[currentFocus].classList.add('suggestion-active');
  }

  removeActive(items) {
    items.forEach(item => item.classList.remove('suggestion-active'));
  }

  hideSuggestions() {
    const suggestionsContainer = document.getElementById('search-suggestions');
    if (suggestionsContainer) {
      suggestionsContainer.style.display = 'none';
    }
  }

  styleCustomDropdown() {
    // Add custom styles for the dropdown
    const style = document.createElement('style');
    style.textContent = `
      .country-selector {
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
        max-width: 600px;
        margin: 0 auto;
      }
      
      .selector-label {
        font-size: var(--font-size-lg);
        font-weight: 600;
        color: var(--color-primary);
        margin-bottom: var(--space-2);
      }
      
      .dropdown-wrapper {
        position: relative;
      }
      
      .country-select {
        width: 100%;
        padding: var(--space-4) var(--space-6);
        padding-right: 3rem;
        border: 3px solid var(--color-border);
        border-radius: var(--radius-xl);
        background: var(--color-surface-elevated);
        color: var(--color-text-main);
        font-size: var(--font-size-lg);
        font-weight: 500;
        appearance: none;
        cursor: pointer;
        transition: all var(--transition-normal);
      }
      
      .country-select:focus {
        outline: none;
        border-color: var(--color-primary);
        box-shadow: 0 0 0 4px rgba(201, 162, 39, 0.2);
      }
      
      .dropdown-arrow {
        position: absolute;
        right: var(--space-4);
        top: 50%;
        transform: translateY(-50%);
        pointer-events: none;
        color: var(--color-primary);
        font-size: var(--font-size-sm);
        transition: transform var(--transition-normal);
      }
      
      .country-select:focus + .dropdown-arrow {
        transform: translateY(-50%) rotate(180deg);
      }
      
      optgroup {
        font-weight: 600;
        color: var(--color-primary);
        background: var(--color-surface);
      }
      
      option {
        padding: var(--space-2);
        font-weight: 400;
      }
    `;
    
    document.head.appendChild(style);
  }

  setupEventListeners() {
    // Enhanced search form submission
    document.addEventListener('submit', (e) => {
      if (e.target.id === 'enhanced-search-form') {
        e.preventDefault();
        this.handleEnhancedSearchSubmit(e.target);
      }
    });

    // Country dropdown change
    document.addEventListener('change', (e) => {
      if (e.target.id === 'country-select') {
        this.handleCountrySelection(e.target);
      }
    });

    // Suggestion item clicks
    document.addEventListener('click', (e) => {
      if (e.target.closest('.suggestion-item')) {
        const item = e.target.closest('.suggestion-item');
        const country = item.getAttribute('data-country');
        this.selectCountry(country);
      }
      
      if (e.target.closest('.suggestion-quick-search')) {
        e.stopPropagation();
        const btn = e.target.closest('.suggestion-quick-search');
        const country = btn.getAttribute('data-country');
        this.selectCountry(country);
      }
    });

    // Toggle between dropdown and search input
    document.addEventListener('click', (e) => {
      if (e.target.id === 'toggle-search-mode') {
        this.toggleSearchMode();
      }
    });

    // Region filter buttons
    document.addEventListener('click', (e) => {
      if (e.target.closest('.filter-btn')) {
        const btn = e.target.closest('.filter-btn');
        const region = btn.getAttribute('data-region');
        this.filterByRegion(region, btn);
      }
    });
  }

  handleEnhancedSearchSubmit(form) {
    if (this.useDropdown) {
      const select = form.querySelector('#country-select');
      const selectedOption = select.options[select.selectedIndex];
      const country = selectedOption.getAttribute('data-name');
      
      if (country) {
        this.performSearch(country);
      } else {
        this.showError('Please select a country');
      }
    } else {
      const input = form.querySelector('#country-search-input');
      const country = input.value.trim();
      
      if (country) {
        this.performSearch(country);
      } else {
        this.showError('Please enter a country name');
      }
    }
  }

  handleCountrySelection(select) {
    const selectedOption = select.options[select.selectedIndex];
    const country = selectedOption.getAttribute('data-name');
    const flag = selectedOption.getAttribute('data-flag');
    
    if (country) {
      // Update UI to show selection
      this.updateSelectedCountryUI(country, flag);
    }
  }

  updateSelectedCountryUI(country, flag) {
    const selectedDisplay = document.getElementById('selected-country-display');
    if (selectedDisplay) {
      selectedDisplay.innerHTML = `
        <div class="selected-country">
          <span class="selected-flag">${flag}</span>
          <span class="selected-name">${country}</span>
        </div>
      `;
    }
  }

  toggleSearchMode() {
    this.useDropdown = !this.useDropdown;
    
    // Update UI
    const toggleBtn = document.getElementById('toggle-search-mode');
    if (toggleBtn) {
      toggleBtn.textContent = this.useDropdown ? 'Use Search Input' : 'Use Dropdown';
    }
    
    // Reinitialize selector
    this.initializeCountrySelector();
    
    // Save preference
    localStorage.setItem('gov-search-use-dropdown', this.useDropdown.toString());
  }

  filterByRegion(region, button) {
    // Update active state
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    button.classList.add('active');
    
    // Filter countries
    const filteredCountries = this.countries.filter(country => 
      country.region.toLowerCase() === region.toLowerCase()
    );
    
    // Update suggestions or dropdown
    if (this.useDropdown) {
      this.updateDropdownWithFiltered(filteredCountries);
    } else {
      this.updateSuggestionsWithFiltered(filteredCountries);
    }
  }

  updateDropdownWithFiltered(countries) {
    const select = document.getElementById('country-select');
    if (!select) return;
    
    const currentValue = select.value;
    
    // Clear existing options
    select.innerHTML = '<option value="">Choose a country...</option>';
    
    // Add filtered countries
    countries.forEach(country => {
      const option = document.createElement('option');
      option.value = country.code;
      option.setAttribute('data-name', country.name);
      option.setAttribute('data-flag', country.flag);
      option.textContent = `${country.flag} ${country.name}`;
      select.appendChild(option);
    });
    
    // Restore selection if possible
    if (currentValue) {
      select.value = currentValue;
    }
  }

  updateSuggestionsWithFiltered(countries) {
    // Update the countries array for auto-complete
    this.countries = countries;
  }

  // Load user preference
  loadUserPreference() {
    const saved = localStorage.getItem('gov-search-use-dropdown');
    if (saved !== null) {
      this.useDropdown = saved === 'true';
    }
  }

  // Save user preference
  saveUserPreference() {
    localStorage.setItem('gov-search-use-dropdown', this.useDropdown.toString());
  }

  // Rest of the existing methods remain the same...
  async performSearch(country) {
    if (this.isSearching) return;
    
    this.isSearching = true;
    this.showLoading();
    
    try {
      console.log(`🔍 Searching for: ${country}`);
      
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

  // Include all other existing methods...
  showLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) loadingOverlay.style.display = 'flex';
  }

  hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) loadingOverlay.style.display = 'none';
  }

  showError(message) {
    const errorOverlay = document.getElementById('error-overlay');
    const errorMessage = document.getElementById('error-message');
    
    if (errorMessage) errorMessage.textContent = message;
    if (errorOverlay) errorOverlay.style.display = 'flex';
  }

  displayResults(results) {
    // Implementation for displaying results
    console.log('Displaying results:', results);
  }

  selectCountry(country) {
    const input = document.getElementById('country-search-input');
    if (input) {
      input.value = country;
    }
    this.hideSuggestions();
    this.performSearch(country);
  }

  async loadInitialData() {
    // Load search history, trending, etc.
    this.loadUserPreference();
  }
}
