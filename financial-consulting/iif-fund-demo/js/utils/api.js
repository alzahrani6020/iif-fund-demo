// API Service Manager - Handles external API calls and data fetching
export class APIService {
  constructor(storageManager) {
    this.storage = storageManager;
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    this.apiKeys = {
      restcountries: 'YOUR_RESTCOUNTRIES_API_KEY',
      worldbank: 'YOUR_WORLDBANK_API_KEY',
      government: 'YOUR_GOVERNMENT_API_KEY'
    };
  }

  async init() {
    console.log('🌐 Initializing API Service...');
    
    // Load cached data
    await this.loadCachedData();
    
    console.log('✅ API Service initialized successfully!');
  }

  // Main method to get government information for any country
  async getGovernmentInfo(countryName) {
    try {
      console.log(`🏛️ Fetching government info for: ${countryName}`);
      
      // Normalize country name
      const normalizedCountry = this.normalizeCountryName(countryName);
      
      // Check cache first
      const cacheKey = `gov-info-${normalizedCountry}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        console.log(`📋 Using cached data for: ${normalizedCountry}`);
        return cached;
      }

      // Fetch from multiple sources
      const [
        countryInfo,
        governmentData,
        ministries,
        contactInfo
      ] = await Promise.allSettled([
        this.getCountryInfo(normalizedCountry),
        this.getGovernmentStructure(normalizedCountry),
        this.getMinistries(normalizedCountry),
        this.getContactInfo(normalizedCountry)
      ]);

      // Combine all data
      const governmentInfo = {
        country: normalizedCountry,
        basicInfo: countryInfo.status === 'fulfilled' ? countryInfo.value : null,
        structure: governmentData.status === 'fulfilled' ? governmentData.value : null,
        ministries: ministries.status === 'fulfilled' ? ministries.value : [],
        contacts: contactInfo.status === 'fulfilled' ? contactInfo.value : [],
        lastUpdated: new Date().toISOString()
      };

      // Cache the result
      this.setCache(cacheKey, governmentInfo);
      
      console.log(`✅ Government info fetched for: ${normalizedCountry}`);
      return governmentInfo;

    } catch (error) {
      console.error(`❌ Failed to fetch government info for ${countryName}:`, error);
      return this.getFallbackData(countryName);
    }
  }

  // Get basic country information
  async getCountryInfo(countryName) {
    try {
      // Using REST Countries API
      const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=false`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const country = data[0];
      
      return {
        name: country.name.common,
        officialName: country.name.official,
        capital: country.capital?.[0],
        region: country.region,
        subregion: country.subregion,
        population: country.population,
        area: country.area,
        languages: Object.values(country.languages || {}),
        currencies: Object.values(country.currencies || {}).map(c => c.name),
        timezones: country.timezones,
        callingCode: country.callingCodes?.[0],
        domain: country.tld,
        flag: country.flags?.svg,
        coordinates: {
          lat: country.latlng?.[0],
          lng: country.latlng?.[1]
        }
      };

    } catch (error) {
      console.error('Failed to fetch country info:', error);
      throw error;
    }
  }

  // Get government structure
  async getGovernmentStructure(countryName) {
    try {
      // Using World Bank API for government data
      const countryCode = await this.getCountryCode(countryName);
      
      if (!countryCode) {
        throw new Error('Country code not found');
      }

      const response = await fetch(`https://api.worldbank.org/v2/country/${countryCode}?format=json`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const countryData = data[1]?.[0];
      
      return {
        governmentType: this.inferGovernmentType(countryData),
        capitalCity: countryData?.capitalCity,
        longitude: countryData?.longitude,
        latitude: countryData?.latitude,
        incomeLevel: countryData?.incomeLevel?.value,
        lendingType: countryData?.lendingType?.value,
        region: countryData?.region?.value
      };

    } catch (error) {
      console.error('Failed to fetch government structure:', error);
      throw error;
    }
  }

  // Get ministries and government departments
  async getMinistries(countryName) {
    try {
      // This would typically use a specialized government API
      // For demo purposes, we'll return common ministries based on country type
      const ministries = this.generateCommonMinistries(countryName);
      
      return ministries.map((ministry, index) => ({
        id: `ministry-${index + 1}`,
        name: ministry.name,
        type: ministry.type,
        website: ministry.website,
        email: ministry.email,
        phone: ministry.phone,
        address: ministry.address,
        description: ministry.description
      }));

    } catch (error) {
      console.error('Failed to fetch ministries:', error);
      throw error;
    }
  }

  // Get contact information
  async getContactInfo(countryName) {
    try {
      const contacts = [
        {
          type: 'embassy',
          name: `${countryName} Embassy`,
          phone: this.generatePhoneNumber(countryName),
          email: `embassy@${this.getCountryDomain(countryName)}`,
          website: `https://www.embassy.${this.getCountryDomain(countryName)}`,
          address: this.generateEmbassyAddress(countryName)
        },
        {
          type: 'tourism',
          name: `${countryName} Tourism Board`,
          phone: this.generatePhoneNumber(countryName),
          email: `tourism@${this.getCountryDomain(countryName)}`,
          website: `https://www.tourism.${this.getCountryDomain(countryName)}`,
          address: this.generateTourismAddress(countryName)
        },
        {
          type: 'investment',
          name: `${countryName} Investment Authority`,
          phone: this.generatePhoneNumber(countryName),
          email: `investment@${this.getCountryDomain(countryName)}`,
          website: `https://www.invest.${this.getCountryDomain(countryName)}`,
          address: this.generateInvestmentAddress(countryName)
        }
      ];

      return contacts;

    } catch (error) {
      console.error('Failed to fetch contact info:', error);
      throw error;
    }
  }

  // Search for countries
  async searchCountries(query) {
    try {
      const response = await fetch(`https://restcountries.com/v3.1/name/${query}?fullText=false`);
      
      if (!response.ok) {
        return [];
      }
      
      const data = await response.json();
      
      return data.map(country => ({
        name: country.name.common,
        officialName: country.name.official,
        flag: country.flags?.svg,
        capital: country.capital?.[0],
        region: country.region,
        subregion: country.subregion
      }));

    } catch (error) {
      console.error('Failed to search countries:', error);
      return [];
    }
  }

  // Get country code from name
  async getCountryCode(countryName) {
    try {
      const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=false`);
      
      if (!response.ok) {
        return null;
      }
      
      const data = await response.json();
      return data[0]?.cca2?.toLowerCase();

    } catch (error) {
      console.error('Failed to get country code:', error);
      return null;
    }
  }

  // Helper methods
  normalizeCountryName(name) {
    return name.trim().toLowerCase();
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
      'india': 'in',
      'brazil': 'br',
      'russia': 'ru',
      'mexico': 'mx',
      'south korea': 'kr'
    };
    
    return domains[countryName.toLowerCase()] || 'gov';
  }

  inferGovernmentType(countryData) {
    // Simple inference based on income level and region
    if (countryData?.incomeLevel?.value?.includes('High')) {
      return 'Democratic Republic';
    } else if (countryData?.incomeLevel?.value?.includes('Low')) {
      return 'Developing Nation';
    } else {
      return 'Republic';
    }
  }

  generateCommonMinistries(countryName) {
    const baseMinistries = [
      { name: 'Ministry of Foreign Affairs', type: 'diplomatic', website: 'foreign.gov', email: 'foreign@gov', phone: '+1-555-0100', address: 'Capital City', description: 'Handles international relations' },
      { name: 'Ministry of Finance', type: 'financial', website: 'finance.gov', email: 'finance@gov', phone: '+1-555-0200', address: 'Capital City', description: 'Manages national finances' },
      { name: 'Ministry of Interior', type: 'security', website: 'interior.gov', email: 'interior@gov', phone: '+1-555-0300', address: 'Capital City', description: 'Internal security and administration' },
      { name: 'Ministry of Education', type: 'education', website: 'education.gov', email: 'education@gov', phone: '+1-555-0400', address: 'Capital City', description: 'National education system' },
      { name: 'Ministry of Health', type: 'health', website: 'health.gov', email: 'health@gov', phone: '+1-555-0500', address: 'Capital City', description: 'Public health services' },
      { name: 'Ministry of Trade', type: 'economic', website: 'trade.gov', email: 'trade@gov', phone: '+1-555-0600', address: 'Capital City', description: 'Trade and commerce' }
    ];

    // Add country-specific ministries
    if (countryName.toLowerCase().includes('saudi')) {
      baseMinistries.push(
        { name: 'Ministry of Investment', type: 'economic', website: 'invest.gov.sa', email: 'invest@invest.gov.sa', phone: '+966-920-008-888', address: 'Riyadh', description: 'Investment promotion' }
      );
    }

    return baseMinistries;
  }

  generatePhoneNumber(countryName) {
    const phoneCodes = {
      'saudi arabia': '+966',
      'united states': '+1',
      'united kingdom': '+44',
      'united arab emirates': '+971',
      'france': '+33',
      'germany': '+49',
      'italy': '+39',
      'spain': '+34',
      'canada': '+1',
      'australia': '+61',
      'japan': '+81',
      'china': '+86',
      'india': '+91',
      'brazil': '+55',
      'russia': '+7',
      'mexico': '+52',
      'south korea': '+82'
    };
    
    const code = phoneCodes[countryName.toLowerCase()] || '+1';
    const randomNumber = Math.floor(Math.random() * 900000000) + 100000000;
    return `${code}-${randomNumber}`;
  }

  generateEmbassyAddress(countryName) {
    return `Diplomatic Quarter, ${countryName}`;
  }

  generateTourismAddress(countryName) {
    return `Tourism Center, Capital City, ${countryName}`;
  }

  generateInvestmentAddress(countryName) {
    return `Investment Authority, Capital City, ${countryName}`;
  }

  // Cache management
  getFromCache(key) {
    const cached = this.cache.get(key);
    if (cached && (Date.now() - cached.timestamp) < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  clearCache() {
    this.cache.clear();
  }

  // Fallback data when APIs fail
  getFallbackData(countryName) {
    return {
      country: countryName,
      basicInfo: {
        name: countryName,
        officialName: countryName,
        capital: 'Capital City',
        region: 'Unknown',
        population: 0,
        languages: ['Official Language']
      },
      structure: {
        governmentType: 'Republic',
        capitalCity: 'Capital City'
      },
      ministries: this.generateCommonMinistries(countryName),
      contacts: [
        {
          type: 'general',
          name: `${countryName} Government`,
          phone: this.generatePhoneNumber(countryName),
          email: `info@${this.getCountryDomain(countryName)}`,
          website: `https://www.gov.${this.getCountryDomain(countryName)}`,
          address: `Capital City, ${countryName}`
        }
      ],
      lastUpdated: new Date().toISOString(),
      isFallback: true
    };
  }

  // Load cached data from storage
  async loadCachedData() {
    try {
      const cachedData = this.storage.get('api-cache', {});
      Object.entries(cachedData).forEach(([key, value]) => {
        if ((Date.now() - value.timestamp) < this.cacheTimeout) {
          this.cache.set(key, value);
        }
      });
    } catch (error) {
      console.error('Failed to load cached data:', error);
    }
  }

  // Save cached data to storage
  async saveCachedData() {
    try {
      const cacheObject = {};
      this.cache.forEach((value, key) => {
        cacheObject[key] = value;
      });
      this.storage.set('api-cache', cacheObject);
    } catch (error) {
      console.error('Failed to save cached data:', error);
    }
  }

  // Auto-update data
  async autoUpdateData() {
    console.log('🔄 Auto-updating government data...');
    
    // Get all cached keys
    const keysToUpdate = Array.from(this.cache.keys()).filter(key => 
      key.startsWith('gov-info-')
    );
    
    // Update each country's data
    for (const key of keysToUpdate) {
      const countryName = key.replace('gov-info-', '');
      try {
        await this.getGovernmentInfo(countryName);
        console.log(`✅ Updated data for: ${countryName}`);
      } catch (error) {
        console.error(`❌ Failed to update data for ${countryName}:`, error);
      }
    }
    
    // Save updated cache
    await this.saveCachedData();
    
    console.log('✅ Auto-update completed');
  }

  // Get statistics
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      totalMemory: JSON.stringify(Object.fromEntries(this.cache)).length
    };
  }
}
