// Government Information Service
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

    return enhanced;
  }

  // Generate quick facts
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

  // Prioritize important contacts
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

  // Generate business hours
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

    // Adjust for Middle Eastern countries (Friday/Saturday weekend)
    if (this.isMiddleEastern(countryName)) {
      businessHours.friday = 'Closed';
      businessHours.saturday = 'Closed';
      businessHours.sunday = '9:00 AM - 5:00 PM';
    }

    return businessHours;
  }

  // Generate emergency contacts
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

  // Generate visa information
  generateVisaInfo(countryName) {
    return {
      visaRequired: this.checkVisaRequirement(countryName),
      visaTypes: this.getVisaTypes(countryName),
      processingTime: this.getVisaProcessingTime(countryName),
      requirements: this.getVisaRequirements(countryName),
      embassyWebsite: this.getEmbassyWebsite(countryName)
    };
  }

  // Generate business resources
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

  // Auto-detect country from user input
  async autoDetectCountry(input) {
    try {
      // Search for countries matching the input
      const countries = await this.api.searchCountries(input);
      
      if (countries.length === 0) {
        return null;
      }

      if (countries.length === 1) {
        return countries[0].name;
      }

      // If multiple matches, return the most relevant one
      return countries[0].name;

    } catch (error) {
      console.error('Failed to auto-detect country:', error);
      return null;
    }
  }

  // Batch search for multiple countries
  async batchSearch(countryNames) {
    console.log(`🔍 Batch searching for ${countryNames.length} countries`);
    
    const results = await Promise.allSettled(
      countryNames.map(country => this.searchGovernmentInfo(country))
    );

    return results.map((result, index) => ({
      country: countryNames[index],
      success: result.status === 'fulfilled',
      data: result.status === 'fulfilled' ? result.value : null,
      error: result.status === 'rejected' ? result.reason : null
    }));
  }

  // Get trending countries
  getTrendingCountries() {
    const trending = this.storage.get('trending-countries', []);
    return trending.slice(0, 10);
  }

  // Add to trending
  addToTrending(countryName) {
    const trending = this.getTrendingCountries();
    
    // Remove if already exists
    const index = trending.indexOf(countryName);
    if (index > -1) {
      trending.splice(index, 1);
    }
    
    // Add to beginning
    trending.unshift(countryName);
    
    // Keep only top 10
    const updatedTrending = trending.slice(0, 10);
    
    this.storage.set('trending-countries', updatedTrending);
  }

  // Search history management
  addToSearchHistory(countryName) {
    const history = this.getSearchHistory();
    
    // Remove if already exists
    const index = history.indexOf(countryName);
    if (index > -1) {
      history.splice(index, 1);
    }
    
    // Add to beginning
    history.unshift(countryName);
    
    // Keep only last 20 searches
    const updatedHistory = history.slice(0, 20);
    
    this.searchHistory = updatedHistory;
    this.storage.set('search-history', updatedHistory);
    
    // Add to trending
    this.addToTrending(countryName);
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
    // Refresh data every 24 hours
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

  // Helper methods
  formatNumber(num) {
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
    // This would typically check based on user's nationality
    // For demo purposes, returning general information
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
}
