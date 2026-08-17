// Enhanced Government Service with Leadership Information
export class GovernmentService {
  constructor(apiService, storageManager) {
    this.api = apiService;
    this.storage = storageManager;
    this.searchHistory = [];
    this.favoriteCountries = [];
  }

  async init() {
    console.log('🏛️ Initializing Government Service...');

    // Load user preferences
    await this.loadUserPreferences();

    // Setup auto-refresh
    this.setupAutoRefresh();

    console.log('✅ Government Service initialized successfully!');
  }

  // Main search method
  async searchGovernmentInfo(countryName) {
    try {
      console.log(`🔍 Searching government info for: ${countryName}`);

      // Add to search history
      this.addToSearchHistory(countryName);

      // Get government information
      const info = await this.api.getGovernmentInfo(countryName);

      // Process and enhance the data
      const enhancedInfo = await this.enhanceGovernmentInfo(info);

      // Save to storage
      this.saveGovernmentData(countryName, enhancedInfo);

      return enhancedInfo;

    } catch (error) {
      console.error(`❌ Failed to search government info for ${countryName}:`, error);
      throw error;
    }
  }

  // Enhanced government information
  async enhanceGovernmentInfo(info) {
    const enhanced = { ...info };

    // Add additional useful information
    enhanced.quickFacts = this.generateQuickFacts(info);
    enhanced.importantContacts = this.prioritizeContacts(info.contacts);
    enhanced.businessHours = this.generateBusinessHours(info.country);
    enhanced.emergencyContacts = this.generateEmergencyContacts(info.country);
    enhanced.visaInformation = this.generateVisaInfo(info.country);
    enhanced.businessResources = this.generateBusinessResources(info.country);

    // NEW: Add leadership information
    enhanced.leadership = await this.getLeadershipInfo(info.country);

    return enhanced;
  }

  // NEW: Get leadership information for a country
  async getLeadershipInfo(countryName) {
    try {
      console.log(`👑 Fetching leadership info for: ${countryName}`);

      // Check cache first
      const cacheKey = `leadership-${countryName.toLowerCase()}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        console.log(`📋 Using cached leadership data for: ${countryName}`);
        return cached;
      }

      // Get leadership data
      const leadershipData = await this.fetchLeadershipData(countryName);

      // Cache the result
      this.setCache(cacheKey, leadershipData);

      return leadershipData;

    } catch (error) {
      console.error(`❌ Failed to fetch leadership info for ${countryName}:`, error);
      return this.getFallbackLeadershipData(countryName);
    }
  }

  // Fetch leadership data from APIs or database
  async fetchLeadershipData(countryName) {
    const countryCode = this.getCountryCode(countryName);

    // Try multiple sources for leadership information
    const sources = [
      () => this.fetchFromWikipedia(countryName, countryCode),
      () => this.fetchFromGovernmentAPI(countryName, countryCode),
      () => this.fetchFromDatabase(countryName, countryCode)
    ];

    for (const source of sources) {
      try {
        const data = await source();
        if (data && data.headOfState && data.headOfGovernment) {
          return this.processLeadershipData(data, countryName);
        }
      } catch (error) {
        console.log(`Source failed for ${countryName}:`, error);
        continue;
      }
    }

    throw new Error('All leadership sources failed');
  }

  // Fetch from Wikipedia API
  async fetchFromWikipedia(countryName, countryCode) {
    const searchQueries = [
      `${countryName} President`,
      `${countryName} Prime Minister`,
      `${countryName} King`,
      `${countryName} Amir`,
      `List of leaders of ${countryName}`
    ];

    for (const query of searchQueries) {
      try {
        const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
        if (response.ok) {
          const data = await response.json();
          return this.parseWikipediaData(data, countryName);
        }
      } catch (error) {
        continue;
      }
    }

    return null;
  }

  // Parse Wikipedia data for leadership information
  parseWikipediaData(data, countryName) {
    const leadership = {
      headOfState: null,
      headOfGovernment: null,
      otherLeaders: [],
      lastUpdated: new Date().toISOString(),
      source: 'Wikipedia'
    };

    const content = data.extract || '';
    const title = data.title || '';

    // Parse based on title and content
    if (title.includes('President') || title.includes('Head of State')) {
      leadership.headOfState = {
        title: 'President',
        name: this.extractNameFromTitle(title),
        role: 'Head of State and Government',
        since: this.extractDateFromContent(content),
        photo: this.extractPhotoFromWikipedia(data),
        party: this.extractPartyFromContent(content),
        description: this.extractDescription(content)
      };
    } else if (title.includes('Prime Minister')) {
      leadership.headOfGovernment = {
        title: 'Prime Minister',
        name: this.extractNameFromTitle(title),
        role: 'Head of Government',
        since: this.extractDateFromContent(content),
        photo: this.extractPhotoFromWikipedia(data),
        party: this.extractPartyFromContent(content),
        description: this.extractDescription(content)
      };
    }

    return leadership;
  }

  // Fetch from government API
  async fetchFromGovernmentAPI(countryName, countryCode) {
    // This would connect to official government APIs
    // For demo purposes, return structured data
    return this.getOfficialLeadershipData(countryName, countryCode);
  }

  // Fetch from database
  async fetchFromDatabase(countryName, countryCode) {
    // This would connect to a database of world leaders
    return this.getStoredLeadershipData(countryName, countryCode);
  }

  // Process leadership data
  processLeadershipData(data, countryName) {
    const processed = {
      country: countryName,
      headOfState: data.headOfState || this.getDefaultHeadOfState(countryName),
      headOfGovernment: data.headOfGovernment || this.getDefaultHeadOfGovernment(countryName),
      otherLeaders: data.otherLeaders || [],
      governmentStructure: this.getGovernmentStructure(countryName),
      cabinetMembers: data.cabinetMembers || [],
      lastUpdated: data.lastUpdated || new Date().toISOString(),
      source: data.source || 'Database',
      reliability: this.assessReliability(data)
    };

    return processed;
  }

  // Get default head of state for common countries
  getDefaultHeadOfState(countryName) {
    const defaults = {
      'Saudi Arabia': {
        title: 'King',
        name: 'King Salman bin Abdulaziz Al Saud',
        role: 'Head of State',
        since: '2015',
        photo: 'assets/leaders/saudi-king.jpg',
        party: 'House of Saud',
        description: 'King and Prime Minister of Saudi Arabia'
      },
      'United States': {
        title: 'President',
        name: 'Joe Biden',
        role: 'Head of State and Government',
        since: '2021',
        photo: 'assets/leaders/us-president.jpg',
        party: 'Democratic Party',
        description: '46th President of the United States'
      },
      'United Kingdom': {
        title: 'King',
        name: 'King Charles III',
        role: 'Head of State',
        since: '2022',
        photo: 'assets/leaders/uk-king.jpg',
        party: 'Monarchy',
        description: 'King of the United Kingdom'
      },
      'France': {
        title: 'President',
        name: 'Emmanuel Macron',
        role: 'Head of State',
        since: '2017',
        photo: 'assets/leaders/france-president.jpg',
        party: 'La République En Marche!',
        description: 'President of the French Republic'
      },
      'Germany': {
        title: 'President',
        name: 'Frank-Walter Steinmeier',
        role: 'Head of State',
        since: '2017',
        photo: 'assets/leaders/germany-president.jpg',
        party: 'Social Democratic Party',
        description: 'President of Germany'
      },
      'Japan': {
        title: 'Emperor',
        name: 'Emperor Naruhito',
        role: 'Head of State',
        since: '2019',
        photo: 'assets/leaders/japan-emperor.jpg',
        party: 'Imperial House',
        description: 'Emperor of Japan'
      },
      'China': {
        title: 'President',
        name: 'Xi Jinping',
        role: 'Head of State and Party',
        since: '2013',
        photo: 'assets/leaders/china-president.jpg',
        party: 'Communist Party',
        description: 'President of the People\'s Republic of China'
      },
      'Russia': {
        title: 'President',
        name: 'Vladimir Putin',
        role: 'Head of State',
        since: '2012',
        photo: 'assets/leaders/russia-president.jpg',
        party: 'United Russia',
        description: 'President of the Russian Federation'
      },
      'United Arab Emirates': {
        title: 'President',
        name: 'Sheikh Khalifa bin Zayed Al Nahyan',
        role: 'Head of State',
        since: '2004',
        photo: 'assets/leaders/uae-president.jpg',
        party: 'Al Nahyan Family',
        description: 'President of the United Arab Emirates'
      },
      'Qatar': {
        title: 'Emir',
        name: 'Sheikh Tamim bin Hamad Al Thani',
        role: 'Head of State',
        since: '2013',
        photo: 'assets/leaders/qatar-emir.jpg',
        party: 'Al Thani Family',
        description: 'Emir of the State of Qatar'
      }
    };

    return defaults[countryName] || null;
  }

  // Get default head of government
  getDefaultHeadOfGovernment(countryName) {
    const defaults = {
      'United Kingdom': {
        title: 'Prime Minister',
        name: 'Rishi Sunak',
        role: 'Head of Government',
        since: '2022',
        photo: 'assets/leaders/uk-pm.jpg',
        party: 'Conservative Party',
        description: 'Prime Minister of the United Kingdom'
      },
      'Germany': {
        title: 'Chancellor',
        name: 'Olaf Scholz',
        role: 'Head of Government',
        since: '2021',
        photo: 'assets/leaders/germany-chancellor.jpg',
        party: 'Social Democratic Party',
        description: 'Chancellor of Germany'
      },
      'Japan': {
        title: 'Prime Minister',
        name: 'Fumio Kishida',
        role: 'Head of Government',
        since: '2021',
        photo: 'assets/leaders/japan-pm.jpg',
        party: 'Liberal Democratic Party',
        description: 'Prime Minister of Japan'
      },
      'France': {
        title: 'Prime Minister',
        name: 'Élisabeth Borne',
        role: 'Head of Government',
        since: '2022',
        photo: 'assets/leaders/france-pm.jpg',
        party: 'La République En Marche!',
        description: 'Prime Minister of France'
      },
      'Italy': {
        title: 'Prime Minister',
        name: 'Giorgia Meloni',
        role: 'Head of Government',
        since: '2022',
        photo: 'assets/leaders/italy-pm.jpg',
        party: 'Brothers of Italy',
        description: 'Prime Minister of Italy'
      },
      'Canada': {
        title: 'Prime Minister',
        name: 'Justin Trudeau',
        role: 'Head of Government',
        since: '2015',
        photo: 'assets/leaders/canada-pm.jpg',
        party: 'Liberal Party',
        description: 'Prime Minister of Canada'
      },
      'Australia': {
        title: 'Prime Minister',
        name: 'Anthony Albanese',
        role: 'Head of Government',
        since: '2022',
        photo: 'assets/leaders/australia-pm.jpg',
        party: 'Australian Labor Party',
        description: 'Prime Minister of Australia'
      },
      'India': {
        title: 'Prime Minister',
        name: 'Narendra Modi',
        role: 'Head of Government',
        since: '2014',
        photo: 'assets/leaders/india-pm.jpg',
        party: 'Bharatiya Janata Party',
        description: 'Prime Minister of India'
      }
    };

    return defaults[countryName] || null;
  }

  // Get government structure
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
      },
      'France': {
        type: 'Semi-Presidential Republic',
        description: 'President as head of state, Prime Minister as head of government',
        executivePower: 'President and Prime Minister',
        legislativePower: 'Parliament (National Assembly and Senate)',
        judicialPower: 'Independent judiciary'
      },
      'Germany': {
        type: 'Federal Parliamentary Republic',
        description: 'President as head of state, Chancellor as head of government',
        executivePower: 'Chancellor and Cabinet',
        legislativePower: 'Bundestag and Bundesrat',
        judicialPower: 'Federal Constitutional Court'
      },
      'China': {
        type: 'Single-Party Socialist Republic',
        description: 'President as head of state, Premier as head of government',
        executivePower: 'President and State Council',
        legislativePower: 'National People\'s Congress',
        judicialPower: 'Supreme People\'s Court'
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

  // Fallback leadership data
  getFallbackLeadershipData(countryName) {
    return {
      country: countryName,
      headOfState: this.getDefaultHeadOfState(countryName),
      headOfGovernment: this.getDefaultHeadOfGovernment(countryName),
      otherLeaders: [],
      governmentStructure: this.getGovernmentStructure(countryName),
      cabinetMembers: [],
      lastUpdated: new Date().toISOString(),
      source: 'Fallback Data',
      reliability: 'medium'
    };
  }

  // Helper methods for parsing
  extractNameFromTitle(title) {
    // Extract name from Wikipedia title
    const match = title.match(/^(.+?)\s+(President|Prime Minister|King|Queen|Emperor|Emir)/i);
    return match ? match[1] : title;
  }

  extractDateFromContent(content) {
    // Extract date from content
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
    // Get first sentence from content
    const sentences = content.split(/[.!?]+/);
    return sentences[0]?.trim() || '';
  }

  assessReliability(data) {
    if (data.source === 'Wikipedia') return 'medium';
    if (data.source === 'Government API') return 'high';
    if (data.source === 'Database') return 'high';
    return 'low';
  }

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

  // Cache management
  getFromCache(key) {
    const cached = localStorage.getItem(`leadership-cache-${key}`);
    if (cached) {
      const data = JSON.parse(cached);
      // Check if cache is still valid (24 hours)
      if (Date.now() - data.timestamp < 24 * 60 * 60 * 1000) {
        return data.data;
      }
    }
    return null;
  }

  setCache(key, data) {
    const cacheData = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(`leadership-cache-${key}`, JSON.stringify(cacheData));
  }

  // Rest of the existing methods...
  generateQuickFacts(info) {
    const facts = [];

    if (info.basicInfo) {
      facts.push({
        icon: '🏛️',
        title: 'Capital',
        value: info.basicInfo.capital || 'N/A'
      });

      facts.push({
        icon: '👥',
        title: 'Population',
        value: info.basicInfo.population ? this.formatNumber(info.basicInfo.population) : 'N/A'
      });

      facts.push({
        icon: '🌍',
        title: 'Region',
        value: info.basicInfo.region || 'N/A'
      });

      facts.push({
        icon: '💬',
        title: 'Languages',
        value: info.basicInfo.languages?.join(', ') || 'N/A'
      });
    }

    if (info.structure) {
      facts.push({
        icon: '🏛️',
        title: 'Government Type',
        value: info.structure.governmentType || 'N/A'
      });
    }

    return facts;
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

  generateBusinessHours(countryName) {
    const businessHours = {
      monday: '9:00 AM - 5:00 PM',
      tuesday: '9:00 AM - 5:00 PM',
      wednesday: '9:00 AM - 5:00 PM',
      thursday: '9:00 AM - 5:00 PM',
      friday: '9:00 AM - 5:00 PM',
      saturday: 'Closed',
      sunday: 'Closed',
      timezone: this.getTimezone(countryName),
      holidays: this.getNationalHolidays(countryName)
    };

    if (this.isMiddleEastern(countryName)) {
      businessHours.friday = 'Closed';
      businessHours.saturday = 'Closed';
      businessHours.sunday = '9:00 AM - 5:00 PM';
    }

    return businessHours;
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

  generateVisaInfo(countryName) {
    return {
      visaRequired: this.checkVisaRequirement(countryName),
      visaTypes: this.getVisaTypes(countryName),
      processingTime: this.getVisaProcessingTime(countryName),
      requirements: this.getVisaRequirements(countryName),
      embassyWebsite: this.getEmbassyWebsite(countryName)
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
      },
      taxAuthority: {
        name: `${countryName} Tax Authority`,
        website: `https://www.tax.${this.getCountryDomain(countryName)}`,
        services: ['Tax registration', 'Tax filing', 'Tax consultation']
      }
    };
  }

  formatNumber(num) {
    if (!num) return 'N/A';
    return new Intl.NumberFormat().format(num);
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

  getNationalHolidays(countryName) {
    const holidays = {
      'saudi arabia': ['Eid Al-Fitr', 'Eid Al-Adha', 'Saudi National Day'],
      'united states': ['New Year\'s Day', 'Independence Day', 'Thanksgiving', 'Christmas'],
      'united kingdom': ['New Year\'s Day', 'Christmas Day', 'Boxing Day'],
      'france': ['New Year\'s Day', 'Bastille Day', 'Christmas Day'],
      'germany': ['New Year\'s Day', 'German Unity Day', 'Christmas Day']
    };

    return holidays[countryName.toLowerCase()] || ['National Holidays'];
  }

  isMiddleEastern(countryName) {
    const middleEasternCountries = [
      'saudi arabia', 'united arab emirates', 'qatar', 'kuwait', 'bahrain', 'oman',
      'iraq', 'iran', 'syria', 'jordan', 'lebanon', 'palestine', 'yemen', 'egypt'
    ];

    return middleEasternCountries.includes(countryName.toLowerCase());
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

  checkVisaRequirement(countryName) {
    return 'Check with local embassy';
  }

  getVisaTypes(countryName) {
    return ['Tourist Visa', 'Business Visa', 'Student Visa', 'Work Visa'];
  }

  getVisaProcessingTime(countryName) {
    return '5-15 business days';
  }

  getVisaRequirements(countryName) {
    return [
      'Valid passport',
      'Visa application form',
      'Passport photos',
      'Proof of funds',
      'Travel itinerary'
    ];
  }

  getEmbassyWebsite(countryName) {
    return `https://www.embassy.${this.getCountryDomain(countryName)}`;
  }

  // Load user preferences
  async loadUserPreferences() {
    this.favoriteCountries = this.getFavoriteCountries();
    this.searchHistory = this.getSearchHistory();
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

  clearSearchHistory() {
    this.searchHistory = [];
    this.storage.delete('search-history');
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

  // Data management
  saveGovernmentData(countryName, data) {
    const key = `gov-data-${countryName.toLowerCase()}`;
    this.storage.set(key, data);
  }

  getGovernmentData(countryName) {
    const key = `gov-data-${countryName.toLowerCase()}`;
    return this.storage.get(key);
  }

  // Auto-refresh setup
  setupAutoRefresh() {
    setInterval(() => {
      this.refreshFavoriteData();
    }, 24 * 60 * 60 * 1000);
  }

  async refreshFavoriteData() {
    console.log('🔄 Refreshing favorite countries data...');

    const favorites = this.getFavoriteCountries();

    for (const country of favorites) {
      try {
        await this.searchGovernmentInfo(country);
        console.log(`✅ Refreshed data for: ${country}`);
      } catch (error) {
        console.error(`❌ Failed to refresh data for ${country}:`, error);
      }
    }
  }

  // Export data
  exportData() {
    return {
      searchHistory: this.searchHistory,
      favoriteCountries: this.favoriteCountries,
      trendingCountries: this.getTrendingCountries()
    };
  }

  // Import data
  importData(data) {
    if (data.searchHistory) {
      this.searchHistory = data.searchHistory;
      this.storage.set('search-history', data.searchHistory);
    }

    if (data.favoriteCountries) {
      this.favoriteCountries = data.favoriteCountries;
      this.storage.set('favorite-countries', data.favoriteCountries);
    }
  }

  getTrendingCountries() {
    return this.storage.get('trending-countries', []);
  }
}
