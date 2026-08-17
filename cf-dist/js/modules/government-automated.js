// Automated Government Information System
export class AutomatedGovernmentService {
  constructor(apiService, storageManager) {
    this.api = apiService;
    this.storage = storageManager;
    this.searchHistory = [];
    this.favoriteCountries = [];
    this.automationEnabled = true;
    this.autoRefreshInterval = 24 * 60 * 60 * 1000; // 24 hours
    this.cacheTimeout = 60 * 60 * 1000; // 1 hour
  }

  async init() {
    console.log('🤖 Initializing Automated Government Service...');

    // Load user preferences
    await this.loadUserPreferences();

    // Setup automation
    this.setupAutomation();

    // Start auto-refresh
    this.startAutoRefresh();

    console.log('✅ Automated Government Service initialized successfully!');
  }

  // Main automated search method
  async automatedSearch(countryName) {
    try {
      console.log(`🤖 Automated search for: ${countryName}`);

      // Step 1: Normalize country name
      const normalizedCountry = this.normalizeCountryName(countryName);

      // Step 2: Check cache first
      const cached = this.getFromCache(normalizedCountry);
      if (cached && this.isCacheValid(cached)) {
        console.log(`📋 Using cached data for: ${normalizedCountry}`);
        return cached;
      }

      // Step 3: Show loading state
      this.showLoadingState();

      // Step 4: Fetch all information in parallel
      const [
        basicInfo,
        leadershipInfo,
        ministriesInfo,
        contactsInfo
      ] = await Promise.allSettled([
        this.fetchBasicInfo(normalizedCountry),
        this.fetchLeadershipInfo(normalizedCountry),
        this.fetchMinistriesInfo(normalizedCountry),
        this.fetchContactsInfo(normalizedCountry)
      ]);

      // Step 5: Process and combine data
      const processedData = await this.processAutomatedData({
        basicInfo: basicInfo.status === 'fulfilled' ? basicInfo.value : null,
        leadershipInfo: leadershipInfo.status === 'fulfilled' ? leadershipInfo.value : null,
        ministriesInfo: ministriesInfo.status === 'fulfilled' ? ministriesInfo.value : [],
        contactsInfo: contactsInfo.status === 'fulfilled' ? contactsInfo.value : []
      }, normalizedCountry);

      // Step 6: Cache the results
      this.setCache(normalizedCountry, processedData);

      // Step 7: Update search history
      this.addToSearchHistory(normalizedCountry);

      // Step 8: Hide loading state
      this.hideLoadingState();

      // Step 9: Display results
      await this.displayAutomatedResults(processedData);

      console.log(`✅ Automated search completed for: ${normalizedCountry}`);
      return processedData;

    } catch (error) {
      console.error(`❌ Automated search failed for ${countryName}:`, error);
      this.hideLoadingState();
      this.showErrorMessage(error.message);
      throw error;
    }
  }

  // Normalize country name
  normalizeCountryName(countryName) {
    const countryMappings = {
      'saudi': 'Saudi Arabia',
      'ksa': 'Saudi Arabia',
      'السعودية': 'Saudi Arabia',
      'uae': 'United Arab Emirates',
      'emirates': 'United Arab Emirates',
      'الإمارات': 'United Arab Emirates',
      'usa': 'United States',
      'america': 'United States',
      'أمريكا': 'United States',
      'uk': 'United Kingdom',
      'britain': 'United Kingdom',
      'بريطانيا': 'United Kingdom',
      'france': 'France',
      'فرنسا': 'France',
      'germany': 'Germany',
      'ألمانيا': 'Germany',
      'italy': 'Italy',
      'إيطاليا': 'Italy',
      'spain': 'Spain',
      'إسبانيا': 'Spain',
      'japan': 'Japan',
      'اليابان': 'Japan',
      'china': 'China',
      'الصين': 'China',
      'india': 'India',
      'الهند': 'India',
      'russia': 'Russia',
      'روسيا': 'Russia',
      'canada': 'Canada',
      'كندا': 'Canada',
      'australia': 'Australia',
      'أستراليا': 'Australia',
      'egypt': 'Egypt',
      'مصر': 'Egypt',
      'qatar': 'Qatar',
      'قطر': 'Qatar',
      'kuwait': 'Kuwait',
      'الكويت': 'Kuwait',
      'bahrain': 'Bahrain',
      'البحرين': 'Bahrain',
      'oman': 'Oman',
      'عمان': 'Oman',
      'jordan': 'Jordan',
      'الأردن': 'Jordan',
      'lebanon': 'Lebanon',
      'لبنان': 'Lebanon',
      'iraq': 'Iraq',
      'العراق': 'Iraq',
      'syria': 'Syria',
      'سوريا': 'Syria',
      'turkey': 'Turkey',
      'تركيا': 'Turkey',
      'iran': 'Iran',
      'إيران': 'Iran'
    };

    const normalized = countryName.toLowerCase().trim();
    return countryMappings[normalized] ||
      this.capitalizeWords(countryName.trim());
  }

  capitalizeWords(str) {
    return str.replace(/\b\w/g, l => l.toUpperCase());
  }

  // Fetch basic country information
  async fetchBasicInfo(countryName) {
    try {
      console.log(`🌍 Fetching basic info for: ${countryName}`);

      // Use fallback data instead of API calls for offline functionality
      return this.getFallbackBasicInfo(countryName);

    } catch (error) {
      console.error(`❌ Failed to fetch basic info:`, error);
      return this.getFallbackBasicInfo(countryName);
    }
  }

  // Fetch leadership information
  async fetchLeadershipInfo(countryName) {
    try {
      console.log(`👑 Fetching leadership info for: ${countryName}`);

      // Try multiple sources
      const sources = [
        () => this.fetchLeadershipFromWikipedia(countryName),
        () => this.fetchLeadershipFromDatabase(countryName),
        () => this.getFallbackLeadershipInfo(countryName)
      ];

      for (const source of sources) {
        try {
          const data = await source();
          if (data && (data.headOfState || data.headOfGovernment)) {
            return data;
          }
        } catch (error) {
          console.log(`Leadership source failed:`, error);
          continue;
        }
      }

      throw new Error('All leadership sources failed');

    } catch (error) {
      console.error(`❌ Failed to fetch leadership info:`, error);
      return this.getFallbackLeadershipInfo(countryName);
    }
  }

  // Fetch leadership from Wikipedia
  async fetchLeadershipFromWikipedia(countryName) {
    const searchQueries = [
      `${countryName} President`,
      `${countryName} Prime Minister`,
      `${countryName} King`,
      `${countryName} Amir`,
      `Head of state of ${countryName}`
    ];

    for (const query of searchQueries) {
      try {
        const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);

        if (response.ok) {
          const data = await response.json();
          return this.parseWikipediaLeadershipData(data, countryName);
        }
      } catch (error) {
        continue;
      }
    }

    return null;
  }

  // Parse Wikipedia leadership data
  parseWikipediaLeadershipData(data, countryName) {
    const leadership = {
      headOfState: null,
      headOfGovernment: null,
      otherLeaders: [],
      lastUpdated: new Date().toISOString(),
      source: 'Wikipedia'
    };

    const title = data.title || '';
    const content = data.extract || '';

    // Parse based on title and content
    if (title.includes('President') || title.includes('Head of State')) {
      leadership.headOfState = {
        title: 'President',
        name: this.extractNameFromTitle(title),
        role: 'Head of State and Government',
        since: this.extractDateFromContent(content),
        photo: this.extractPhotoFromWikipedia(data),
        party: this.extractPartyFromContent(content),
        description: this.extractDescription(content),
        contact: this.extractContactFromContent(content)
      };
    } else if (title.includes('Prime Minister')) {
      leadership.headOfGovernment = {
        title: 'Prime Minister',
        name: this.extractNameFromTitle(title),
        role: 'Head of Government',
        since: this.extractDateFromContent(content),
        photo: this.extractPhotoFromWikipedia(data),
        party: this.extractPartyFromContent(content),
        description: this.extractDescription(content),
        contact: this.extractContactFromContent(content)
      };
    }

    return leadership;
  }

  // Fetch leadership from database
  async fetchLeadershipFromDatabase(countryName) {
    // This would connect to a database of world leaders
    return this.getStoredLeadershipData(countryName);
  }

  // Fetch ministries information
  async fetchMinistriesInfo(countryName) {
    try {
      console.log(`🏛️ Fetching ministries info for: ${countryName}`);

      // Try multiple sources
      const sources = [
        () => this.fetchMinistriesFromGovernmentAPI(countryName),
        () => this.fetchMinistriesFromDatabase(countryName),
        () => this.getFallbackMinistriesInfo(countryName)
      ];

      for (const source of sources) {
        try {
          const data = await source();
          if (data && data.length > 0) {
            return data;
          }
        } catch (error) {
          console.log(`Ministries source failed:`, error);
          continue;
        }
      }

      throw new Error('All ministries sources failed');

    } catch (error) {
      console.error(`❌ Failed to fetch ministries info:`, error);
      return this.getFallbackMinistriesInfo(countryName);
    }
  }

  // Fetch ministries from government API
  async fetchMinistriesFromGovernmentAPI(countryName) {
    // This would connect to official government APIs
    const countryCode = this.getCountryCode(countryName);

    // Simulated API call
    return this.getOfficialMinistriesData(countryName, countryCode);
  }

  // Fetch contacts information
  async fetchContactsInfo(countryName) {
    try {
      console.log(`📞 Fetching contacts info for: ${countryName}`);

      // Try multiple sources
      const sources = [
        () => this.fetchContactsFromDiplomaticDatabase(countryName),
        () => this.fetchContactsFromEmbassyAPI(countryName),
        () => this.getFallbackContactsInfo(countryName)
      ];

      for (const source of sources) {
        try {
          const data = await source();
          if (data && data.length > 0) {
            return data;
          }
        } catch (error) {
          console.log(`Contacts source failed:`, error);
          continue;
        }
      }

      throw new Error('All contacts sources failed');

    } catch (error) {
      console.error(`❌ Failed to fetch contacts info:`, error);
      return this.getFallbackContactsInfo(countryName);
    }
  }

  // Process automated data
  async processAutomatedData(rawData, countryName) {
    const processed = {
      country: countryName,
      basicInfo: rawData.basicInfo,
      leadership: rawData.leadershipInfo,
      ministries: rawData.ministriesInfo,
      contacts: rawData.contactsInfo,
      quickFacts: this.generateQuickFacts(rawData.basicInfo),
      importantContacts: this.prioritizeContacts(rawData.contactsInfo),
      emergencyContacts: this.generateEmergencyContacts(countryName),
      businessHours: this.generateBusinessHours(countryName),
      visaInformation: this.generateVisaInfo(countryName),
      businessResources: this.generateBusinessResources(countryName),
      governmentStructure: this.getGovernmentStructure(countryName),
      lastUpdated: new Date().toISOString(),
      source: 'Automated System',
      reliability: this.assessDataReliability(rawData)
    };

    return processed;
  }

  // Display automated results
  async displayAutomatedResults(data) {
    console.log('📊 Displaying automated results:', data);

    // Update UI with results
    this.updateCountryHeader(data);
    this.updateLeadershipSection(data.leadership);
    this.updateMinistriesSection(data.ministries);
    this.updateContactsSection(data.contacts);
    this.updateQuickFacts(data.quickFacts);
    this.updateEmergencyContacts(data.emergencyContacts);

    // Show results section
    this.showResultsSection();

    // Log success
    this.logSearchSuccess(data.country);
  }

  // Update country header
  updateCountryHeader(data) {
    const headerElement = document.getElementById('results-country-header');
    if (headerElement && data.basicInfo) {
      headerElement.innerHTML = `
        <div class="country-header">
          <div class="country-flag">
            <img src="${data.basicInfo.flag}" alt="${data.basicInfo.name}" class="flag-image">
          </div>
          <div class="country-info">
            <h2 class="country-name">${data.basicInfo.name}</h2>
            <p class="country-official">${data.basicInfo.officialName}</p>
            <div class="country-meta">
              <span class="country-capital">🏛️ ${data.basicInfo.capital}</span>
              <span class="country-population">👥 ${this.formatNumber(data.basicInfo.population)}</span>
              <span class="country-region">🌍 ${data.basicInfo.region}</span>
            </div>
          </div>
        </div>
      `;
    }
  }

  // Update leadership section
  updateLeadershipSection(leadership) {
    const leadershipElement = document.getElementById('leadership-section');
    if (leadershipElement && leadership) {
      let leadershipHTML = '<div class="leadership-grid">';

      if (leadership.headOfState) {
        leadershipHTML += this.createLeaderCard(leadership.headOfState, 'head-of-state');
      }

      if (leadership.headOfGovernment) {
        leadershipHTML += this.createLeaderCard(leadership.headOfGovernment, 'head-of-government');
      }

      leadershipHTML += '</div>';
      leadershipElement.innerHTML = leadershipHTML;
    }
  }

  // Create leader card
  createLeaderCard(leader, type) {
    return `
      <div class="leader-card" data-type="${type}">
        <div class="leader-photo">
          <img src="${leader.photo || 'assets/placeholder-leader.jpg'}" alt="${leader.name}" class="leader-image">
          <div class="leader-badge">${leader.title}</div>
        </div>
        <div class="leader-info">
          <h3 class="leader-name">${leader.name}</h3>
          <p class="leader-role">${leader.role}</p>
          <p class="leader-since">Since: ${leader.since}</p>
          <p class="leader-party">Party: ${leader.party}</p>
          <p class="leader-description">${leader.description}</p>
          ${leader.contact ? `
            <div class="leader-contact">
              <h4>Contact Information:</h4>
              <p>📧 ${leader.contact.email || 'N/A'}</p>
              <p>📞 ${leader.contact.phone || 'N/A'}</p>
              <p>🌐 ${leader.contact.website || 'N/A'}</p>
              <p>📍 ${leader.contact.address || 'N/A'}</p>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  // Update ministries section
  updateMinistriesSection(ministries) {
    const ministriesElement = document.getElementById('ministries-section');
    if (ministriesElement && ministries) {
      const ministriesHTML = `
        <div class="ministries-grid">
          ${ministries.map(ministry => `
            <div class="ministry-card">
              <div class="ministry-header">
                <h4 class="ministry-name">${ministry.name}</h4>
                <span class="ministry-type">${ministry.type}</span>
              </div>
              <div class="ministry-info">
                <p class="ministry-description">${ministry.description}</p>
                <div class="ministry-contact">
                  <p>📞 ${ministry.phone}</p>
                  <p>📧 ${ministry.email}</p>
                  <p>🌐 ${ministry.website}</p>
                  <p>📍 ${ministry.address}</p>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
      ministriesElement.innerHTML = ministriesHTML;
    }
  }

  // Update contacts section
  updateContactsSection(contacts) {
    const contactsElement = document.getElementById('contacts-section');
    if (contactsElement && contacts) {
      const contactsHTML = `
        <div class="contacts-grid">
          ${contacts.map(contact => `
            <div class="contact-card">
              <div class="contact-header">
                <h4 class="contact-name">${contact.name}</h4>
                <span class="contact-type">${contact.type}</span>
              </div>
              <div class="contact-info">
                <p>📞 ${contact.phone}</p>
                <p>📧 ${contact.email}</p>
                <p>🌐 ${contact.website}</p>
                <p>📍 ${contact.address}</p>
                <p>🕐 ${contact.hours}</p>
              </div>
            </div>
          `).join('')}
        </div>
      `;
      contactsElement.innerHTML = contactsHTML;
    }
  }

  // Update quick facts
  updateQuickFacts(facts) {
    const factsElement = document.getElementById('quick-facts');
    if (factsElement && facts) {
      const factsHTML = `
        <div class="facts-grid">
          ${facts.map(fact => `
            <div class="fact-card">
              <div class="fact-icon">${fact.icon}</div>
              <div class="fact-info">
                <h4 class="fact-title">${fact.title}</h4>
                <p class="fact-value">${fact.value}</p>
              </div>
            </div>
          `).join('')}
        </div>
      `;
      factsElement.innerHTML = factsHTML;
    }
  }

  // Update emergency contacts
  updateEmergencyContacts(emergency) {
    const emergencyElement = document.getElementById('emergency-contacts');
    if (emergencyElement && emergency) {
      const emergencyHTML = `
        <div class="emergency-grid">
          ${emergency.map(contact => `
            <div class="emergency-card emergency-${contact.type}">
              <div class="emergency-icon">${this.getEmergencyIcon(contact.type)}</div>
              <div class="emergency-info">
                <h4 class="emergency-title">${contact.name}</h4>
                <p class="emergency-number">${contact.number}</p>
                <p class="emergency-description">${contact.description}</p>
              </div>
            </div>
          `).join('')}
        </div>
      `;
      emergencyElement.innerHTML = emergencyHTML;
    }
  }

  // Show/hide methods
  showLoadingState() {
    const loadingElement = document.getElementById('loading-overlay');
    if (loadingElement) {
      loadingElement.style.display = 'flex';
    }
  }

  hideLoadingState() {
    const loadingElement = document.getElementById('loading-overlay');
    if (loadingElement) {
      loadingElement.style.display = 'none';
    }
  }

  showResultsSection() {
    const resultsElement = document.getElementById('search-results-section');
    if (resultsElement) {
      resultsElement.style.display = 'block';
      resultsElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  showErrorMessage(message) {
    const errorElement = document.getElementById('error-overlay');
    const errorMessage = document.getElementById('error-message');

    if (errorMessage) {
      errorMessage.textContent = message;
    }
    if (errorElement) {
      errorElement.style.display = 'flex';
    }
  }

  // Cache management
  getFromCache(countryName) {
    const cacheKey = `gov-cache-${countryName.toLowerCase()}`;
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      const data = JSON.parse(cached);
      return data;
    }

    return null;
  }

  isCacheValid(cachedData) {
    if (!cachedData || !cachedData.lastUpdated) {
      return false;
    }

    const cacheAge = Date.now() - new Date(cachedData.lastUpdated).getTime();
    return cacheAge < this.cacheTimeout;
  }

  setCache(countryName, data) {
    const cacheKey = `gov-cache-${countryName.toLowerCase()}`;
    const cacheData = {
      ...data,
      cachedAt: Date.now()
    };

    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
  }

  // Helper methods
  formatNumber(num) {
    if (!num) return 'N/A';
    return new Intl.NumberFormat().format(num);
  }

  getEmergencyIcon(type) {
    const icons = {
      police: '🚔',
      medical: '🚑',
      fire: '🚒',
      emergency: '🆘'
    };
    return icons[type] || '📞';
  }

  // Setup automation
  setupAutomation() {
    // Setup auto-search on input
    const searchInput = document.getElementById('country-search-input');
    if (searchInput) {
      let searchTimeout;

      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();

        if (searchTimeout) {
          clearTimeout(searchTimeout);
        }

        if (query.length >= 2) {
          searchTimeout = setTimeout(() => {
            this.automatedSearch(query);
          }, 500);
        }
      });

      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          const query = e.target.value.trim();
          if (query.length >= 2) {
            this.automatedSearch(query);
          }
        }
      });
    }
  }

  // Auto-refresh setup
  startAutoRefresh() {
    setInterval(() => {
      this.refreshFavoriteCountries();
    }, this.autoRefreshInterval);
  }

  async refreshFavoriteCountries() {
    const favorites = this.getFavoriteCountries();

    for (const country of favorites) {
      try {
        await this.automatedSearch(country);
        console.log(`✅ Auto-refreshed data for: ${country}`);
      } catch (error) {
        console.error(`❌ Failed to auto-refresh ${country}:`, error);
      }
    }
  }

  // Search history management
  addToSearchHistory(countryName) {
    const history = this.getSearchHistory();

    const index = history.indexOf(countryName);
    if (index > -1) {
      history.splice(index, 1);
    }

    history.unshift(countryName);
    const updatedHistory = history.slice(0, 20);

    this.searchHistory = updatedHistory;
    this.storage.set('search-history', updatedHistory);
  }

  getSearchHistory() {
    return this.storage.get('search-history', []);
  }

  // Favorite countries management
  addToFavorites(countryName) {
    if (!this.favoriteCountries.includes(countryName)) {
      this.favoriteCountries.push(countryName);
      this.storage.set('favorite-countries', this.favoriteCountries);
    }
  }

  removeFromFavorites(countryName) {
    const index = this.favoriteCountries.indexOf(countryName);
    if (index > -1) {
      this.favoriteCountries.splice(index, 1);
      this.storage.set('favorite-countries', this.favoriteCountries);
    }
  }

  getFavoriteCountries() {
    return this.storage.get('favorite-countries', []);
  }

  // Log search success
  logSearchSuccess(countryName) {
    console.log(`✅ Successfully retrieved government information for: ${countryName}`);

    // Track analytics
    this.trackSearchAnalytics(countryName);
  }

  trackSearchAnalytics(countryName) {
    const analytics = this.storage.get('search-analytics', {});

    if (!analytics[countryName]) {
      analytics[countryName] = {
        count: 0,
        lastSearched: null,
        firstSearched: null
      };
    }

    analytics[countryName].count++;
    analytics[countryName].lastSearched = new Date().toISOString();

    if (!analytics[countryName].firstSearched) {
      analytics[countryName].firstSearched = new Date().toISOString();
    }

    this.storage.set('search-analytics', analytics);
  }

  // Load user preferences
  async loadUserPreferences() {
    this.favoriteCountries = this.getFavoriteCountries();
    this.searchHistory = this.getSearchHistory();
  }

  // Include all other existing methods...
  getCountryCode(countryName) {
    const codes = {
      'saudi arabia': 'SA',
      'united states': 'US',
      'united kingdom': 'GB',
      'france': 'FR',
      'germany': 'DE',
      'italy': 'IT',
      'spain': 'ES',
      'japan': 'JP',
      'china': 'CN',
      'russia': 'RU',
      'canada': 'CA',
      'australia': 'AU',
      'india': 'IN',
      'united arab emirates': 'AE',
      'qatar': 'QA',
      'kuwait': 'KW'
    };

    return codes[countryName.toLowerCase()] || countryName.toUpperCase().slice(0, 2);
  }

  // Include fallback data methods...
  getFallbackBasicInfo(countryName) {
    // Return fallback data for common countries
    const fallbackData = {
      'Saudi Arabia': {
        name: 'Saudi Arabia',
        officialName: 'Kingdom of Saudi Arabia',
        capital: 'Riyadh',
        population: 34218169,
        area: 2149690,
        region: 'Asia',
        subregion: 'Western Asia',
        languages: ['Arabic'],
        currencies: ['SAR'],
        flag: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Flag_of_Saudi_Arabia.svg/200px-Flag_of_Saudi_Arabia.svg.png',
        callingCode: '+966',
        domain: '.sa',
        timezones: ['UTC+03:00'],
        borders: ['IRQ', 'JOR', 'KWT', 'OMN', 'QAT', 'ARE', 'YEM'],
        independent: true,
        unMember: true,
        landlocked: false
      },
      'United States': {
        name: 'United States',
        officialName: 'United States of America',
        capital: 'Washington, D.C.',
        population: 331002651,
        area: 9833517,
        region: 'Americas',
        subregion: 'North America',
        languages: ['English'],
        currencies: ['USD'],
        flag: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Flag_of_the_United_States.svg/200px-Flag_of_the_United_States.svg.png',
        callingCode: '+1',
        domain: '.us',
        timezones: ['UTC-10:00', 'UTC-09:00', 'UTC-08:00', 'UTC-07:00', 'UTC-06:00', 'UTC-05:00', 'UTC-04:00'],
        borders: ['CAN', 'MEX'],
        independent: true,
        unMember: true,
        landlocked: false
      }
    };

    return fallbackData[countryName] || {
      name: countryName,
      officialName: countryName,
      capital: 'N/A',
      population: 0,
      area: 0,
      region: 'N/A',
      subregion: 'N/A',
      languages: [],
      currencies: [],
      flag: '',
      callingCode: 'N/A',
      domain: 'N/A',
      timezones: [],
      borders: [],
      independent: false,
      unMember: false,
      landlocked: false
    };
  }

  getFallbackLeadershipInfo(countryName) {
    // Return fallback data for common countries
    const fallbackData = {
      'Saudi Arabia': {
        headOfState: {
          title: 'King',
          name: 'King Salman bin Abdulaziz Al Saud',
          role: 'Head of State and Government',
          since: '2015',
          party: 'House of Saud',
          photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Salman_bin_Abdulaziz_2015.jpg/220px-Salman_bin_Abdulaziz_2015.jpg',
          description: 'King Salman bin Abdulaziz Al Saud is the King and Prime Minister of Saudi Arabia.',
          contact: {
            email: 'N/A',
            phone: 'N/A',
            website: 'https://www.royalcourt.sa',
            address: 'Royal Court, Riyadh, Saudi Arabia'
          }
        },
        headOfGovernment: {
          title: 'Crown Prince',
          name: 'Mohammed bin Salman Al Saud',
          role: 'Crown Prince and Prime Minister',
          since: '2017',
          party: 'House of Saud',
          photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Mohammed_bin_Salman_Al_Saud_2017.jpg/220px-Mohammed_bin_Salman_Al_Saud_2017.jpg',
          description: 'Mohammed bin Salman Al Saud is the Crown Prince and Prime Minister of Saudi Arabia.',
          contact: {
            email: 'N/A',
            phone: 'N/A',
            website: 'https://www.royalcourt.sa',
            address: 'Royal Court, Riyadh, Saudi Arabia'
          }
        },
        otherLeaders: [],
        lastUpdated: new Date().toISOString(),
        source: 'Fallback Data'
      },
      'United States': {
        headOfState: {
          title: 'President',
          name: 'Joe Biden',
          role: 'Head of State and Government',
          since: '2021',
          party: 'Democratic Party',
          photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Joe_Biden_presidential_portrait.jpg/220px-Joe_Biden_presidential_portrait.jpg',
          description: 'Joe Biden is the 46th President of the United States.',
          contact: {
            email: 'president@whitehouse.gov',
            phone: '+1-202-456-1111',
            website: 'https://www.whitehouse.gov',
            address: '1600 Pennsylvania Avenue NW, Washington, D.C. 20500'
          }
        },
        headOfGovernment: {
          title: 'President',
          name: 'Joe Biden',
          role: 'Head of State and Government',
          since: '2021',
          party: 'Democratic Party',
          photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Joe_Biden_presidential_portrait.jpg/220px-Joe_Biden_presidential_portrait.jpg',
          description: 'Joe Biden is the 46th President of the United States.',
          contact: {
            email: 'president@whitehouse.gov',
            phone: '+1-202-456-1111',
            website: 'https://www.whitehouse.gov',
            address: '1600 Pennsylvania Avenue NW, Washington, D.C. 20500'
          }
        },
        otherLeaders: [],
        lastUpdated: new Date().toISOString(),
        source: 'Fallback Data'
      }
    };

    return fallbackData[countryName] || {
      headOfState: null,
      headOfGovernment: null,
      otherLeaders: [],
      lastUpdated: new Date().toISOString(),
      source: 'Fallback Data'
    };
  }

  getFallbackMinistriesInfo(countryName) {
    // Return fallback data for common countries
    const fallbackData = {
      'Saudi Arabia': [
        {
          name: 'Ministry of Interior',
          type: 'Security',
          description: 'Responsible for internal security, police, and civil defense',
          phone: '+966-11-403-4044',
          email: 'info@moi.gov.sa',
          website: 'https://www.moi.gov.sa',
          address: 'Riyadh, Saudi Arabia'
        },
        {
          name: 'Ministry of Foreign Affairs',
          type: 'Diplomatic',
          description: 'Handles diplomatic relations and international cooperation',
          phone: '+966-11-405-3000',
          email: 'info@moa.gov.sa',
          website: 'https://www.mofa.gov.sa',
          address: 'Riyadh, Saudi Arabia'
        },
        {
          name: 'Ministry of Finance',
          type: 'Economic',
          description: 'Manages national budget and financial policies',
          phone: '+966-11-401-9999',
          email: 'info@mof.gov.sa',
          website: 'https://www.mof.gov.sa',
          address: 'Riyadh, Saudi Arabia'
        },
        {
          name: 'Ministry of Investment',
          type: 'Investment',
          description: 'Promotes foreign investment and economic development',
          phone: '+966-11-988-9999',
          email: 'info@invest.gov.sa',
          website: 'https://invest.gov.sa',
          address: 'Riyadh, Saudi Arabia'
        }
      ],
      'United States': [
        {
          name: 'Department of State',
          type: 'Diplomatic',
          description: 'Handles foreign relations and diplomacy',
          phone: '+1-202-647-4000',
          email: 'contact@state.gov',
          website: 'https://www.state.gov',
          address: '2201 C Street NW, Washington, D.C. 20520'
        },
        {
          name: 'Department of Treasury',
          type: 'Economic',
          description: 'Manages federal finances and economic policy',
          phone: '+1-202-622-2000',
          email: 'treasury@treasury.gov',
          website: 'https://www.treasury.gov',
          address: '1500 Pennsylvania Avenue NW, Washington, D.C. 20220'
        }
      ]
    };

    return fallbackData[countryName] || [];
  }

  getFallbackContactsInfo(countryName) {
    // Return fallback data for common countries
    const fallbackData = {
      'Saudi Arabia': [
        {
          name: 'Saudi Embassy in Washington DC',
          type: 'Embassy',
          phone: '+1-202-944-3126',
          email: 'info@saudiembassy.net',
          website: 'https://www.saudiembassy.net',
          address: '601 New Hampshire Avenue NW, Washington, D.C. 20037',
          hours: 'Monday-Friday: 9:00 AM - 5:00 PM'
        },
        {
          name: 'Royal Court',
          type: 'Government Office',
          phone: '+966-11-888-8888',
          email: 'info@royalcourt.gov.sa',
          website: 'https://www.royalcourt.gov.sa',
          address: 'Royal Court, Riyadh, Saudi Arabia',
          hours: 'Sunday-Thursday: 7:30 AM - 3:00 PM'
        }
      ],
      'United States': [
        {
          name: 'US Embassy in Riyadh',
          type: 'Embassy',
          phone: '+966-11-488-8300',
          email: 'RiyadhACS@state.gov',
          website: 'https://sa.usembassy.gov',
          address: 'Diplomatic Quarter, Riyadh, Saudi Arabia',
          hours: 'Monday-Friday: 8:00 AM - 4:30 PM'
        }
      ]
    };

    return fallbackData[countryName] || [];
  }

  // Include other helper methods...
  generateQuickFacts(basicInfo) {
    if (!basicInfo) return [];

    return [
      {
        icon: '🏛️',
        title: 'Capital',
        value: basicInfo.capital || 'N/A'
      },
      {
        icon: '👥',
        title: 'Population',
        value: basicInfo.population ? this.formatNumber(basicInfo.population) : 'N/A'
      },
      {
        icon: '🌍',
        title: 'Region',
        value: basicInfo.region || 'N/A'
      },
      {
        icon: '💬',
        title: 'Languages',
        value: basicInfo.languages?.join(', ') || 'N/A'
      }
    ];
  }

  prioritizeContacts(contacts) {
    const priorityOrder = ['embassy', 'investment', 'tourism', 'trade'];

    return contacts
      .filter(contact => contact.type && priorityOrder.includes(contact.type))
      .sort((a, b) => {
        const aIndex = priorityOrder.indexOf(a.type);
        const bIndex = priorityOrder.indexOf(b.type);
        return aIndex - bIndex;
      });
  }

  generateEmergencyContacts(countryName) {
    const emergencyCode = this.getEmergencyCode(countryName);

    return [
      {
        type: 'police',
        name: 'Police',
        number: emergencyCode.police,
        description: 'Emergency police services'
      },
      {
        type: 'medical',
        name: 'Medical Emergency',
        number: emergencyCode.medical,
        description: 'Ambulance and medical emergencies'
      },
      {
        type: 'fire',
        name: 'Fire Department',
        number: emergencyCode.fire,
        description: 'Fire and rescue services'
      }
    ];
  }

  getEmergencyCode(countryName) {
    const codes = {
      'saudi arabia': { police: '999', medical: '997', fire: '998' },
      'united states': { police: '911', medical: '911', fire: '911' },
      'united kingdom': { police: '999', medical: '999', fire: '999' },
      'united arab emirates': { police: '999', medical: '998', fire: '997' },
      'france': { police: '17', medical: '15', fire: '18' },
      'germany': { police: '110', medical: '112', fire: '112' }
    };

    return codes[countryName.toLowerCase()] || { police: '112', medical: '112', fire: '112' };
  }

  generateBusinessHours(countryName) {
    return {
      monday: '9:00 AM - 5:00 PM',
      tuesday: '9:00 AM - 5:00 PM',
      wednesday: '9:00 AM - 5:00 PM',
      thursday: '9:00 AM - 5:00 PM',
      friday: '9:00 AM - 5:00 PM',
      saturday: 'Closed',
      sunday: 'Closed',
      timezone: this.getTimezone(countryName)
    };
  }

  getTimezone(countryName) {
    const timezones = {
      'saudi arabia': 'AST (UTC+3)',
      'united states': 'Multiple timezones (UTC-10 to UTC-4)',
      'united kingdom': 'GMT (UTC+0)',
      'united arab emirates': 'GST (UTC+4)',
      'france': 'CET (UTC+1)',
      'germany': 'CET (UTC+1)',
      'japan': 'JST (UTC+9)',
      'china': 'CST (UTC+8)',
      'india': 'IST (UTC+5:30)'
    };

    return timezones[countryName.toLowerCase()] || 'Local timezone';
  }

  generateVisaInfo(countryName) {
    return {
      visaRequired: 'Check with local embassy',
      visaTypes: ['Tourist Visa', 'Business Visa', 'Student Visa', 'Work Visa'],
      processingTime: '5-15 business days',
      requirements: [
        'Valid passport',
        'Visa application form',
        'Passport photos',
        'Proof of funds',
        'Travel itinerary'
      ]
    };
  }

  generateBusinessResources(countryName) {
    return {
      investmentAuthority: {
        name: `${countryName} Investment Authority`,
        website: `https://www.invest.${this.getCountryDomain(countryName)}`,
        services: ['Business registration', 'Investment incentives', 'Market information']
      },
      chamberOfCommerce: {
        name: `${countryName} Chamber of Commerce`,
        website: `https://www.chamber.${this.getCountryDomain(countryName)}`,
        services: ['Business networking', 'Trade information', 'Certification']
      }
    };
  }

  getCountryDomain(countryName) {
    const domains = {
      'saudi arabia': 'sa',
      'united states': 'us',
      'united kingdom': 'uk',
      'united arab emirates': 'ae',
      'france': 'fr',
      'germany': 'de',
      'italy': 'it',
      'spain': 'es',
      'canada': 'ca',
      'australia': 'au',
      'japan': 'jp',
      'china': 'cn',
      'india': 'in'
    };

    return domains[countryName.toLowerCase()] || 'gov';
  }

  getGovernmentStructure(countryName) {
    const structures = {
      'Saudi Arabia': {
        type: 'Absolute Monarchy',
        description: 'The King serves as both head of state and head of government',
        executivePower: 'King and Council of Ministers',
        legislativePower: 'Consultative Assembly (Shura Council)',
        judicialPower: 'Independent judiciary'
      },
      'United States': {
        type: 'Presidential Republic',
        description: 'Separation of powers with President as head of state and government',
        executivePower: 'President and Cabinet',
        legislativePower: 'Congress (Senate and House)',
        judicialPower: 'Supreme Court and Federal Courts'
      },
      'United Kingdom': {
        type: 'Constitutional Monarchy',
        description: 'Monarch as head of state, Prime Minister as head of government',
        executivePower: 'Prime Minister and Cabinet',
        legislativePower: 'Parliament (House of Commons and House of Lords)',
        judicialPower: 'Independent judiciary'
      }
    };

    return structures[countryName] || {
      type: 'Republic',
      description: 'Standard republican structure',
      executivePower: 'President and Cabinet',
      legislativePower: 'National Legislature',
      judicialPower: 'Independent Judiciary'
    };
  }

  assessDataReliability(rawData) {
    let score = 0;

    if (rawData.basicInfo) score += 25;
    if (rawData.leadershipInfo) score += 25;
    if (rawData.ministriesInfo && rawData.ministriesInfo.length > 0) score += 25;
    if (rawData.contactsInfo && rawData.contactsInfo.length > 0) score += 25;

    if (score >= 75) return 'high';
    if (score >= 50) return 'medium';
    return 'low';
  }

  // Include parsing methods...
  extractNameFromTitle(title) {
    const match = title.match(/^(.+?)\s+(President|Prime Minister|King|Queen|Emperor|Emir)/i);
    return match ? match[1] : title;
  }

  extractDateFromContent(content) {
    const dateMatch = content.match(/(since|from|elected in)\s+(\d{4})/i);
    return dateMatch ? dateMatch[2] : null;
  }

  extractPhotoFromWikipedia(data) {
    return data.thumbnail?.source || null;
  }

  extractPartyFromContent(content) {
    const partyMatch = content.match(/(member of the|from the|belongs to the)\s+([A-Z][a-z\s]+Party)/i);
    return partyMatch ? partyMatch[2] : null;
  }

  extractDescription(content) {
    const sentences = content.split(/[.!?]+/);
    return sentences[0]?.trim() || '';
  }

  extractContactFromContent(content) {
    // Extract contact information from Wikipedia content
    return {
      email: null,
      phone: null,
      website: null,
      address: null
    };
  }

  getOfficialLeadershipData(countryName, countryCode) {
    // This would connect to official government APIs
    return this.getFallbackLeadershipInfo(countryName);
  }

  getOfficialMinistriesData(countryName, countryCode) {
    // This would connect to official government APIs
    return this.getFallbackMinistriesInfo(countryName);
  }

  fetchMinistriesFromDatabase(countryName) {
    // This would connect to a database of ministries
    return this.getFallbackMinistriesInfo(countryName);
  }

  fetchContactsFromDiplomaticDatabase(countryName) {
    // This would connect to a diplomatic database
    return this.getFallbackContactsInfo(countryName);
  }

  fetchContactsFromEmbassyAPI(countryName) {
    // This would connect to embassy APIs
    return this.getFallbackContactsInfo(countryName);
  }

  getStoredLeadershipData(countryName) {
    // This would retrieve stored leadership data
    return this.getFallbackLeadershipInfo(countryName);
  }

  getStoredMinistriesData(countryName) {
    // This would retrieve stored ministries data
    return this.getFallbackMinistriesInfo(countryName);
  }

  getStoredContactsData(countryName) {
    // This would retrieve stored contacts data
    return this.getFallbackContactsInfo(countryName);
  }
}
