// Application Configuration
export class AppConfig {
  constructor() {
    this.config = {
      // Application info
      name: 'International Investment Fund',
      version: '2.0.0',
      description: 'Financing for Global Prosperity',
      
      // API endpoints
      api: {
        baseUrl: window.location.origin,
        endpoints: {
          auth: '/api/auth',
          users: '/api/users',
          letters: '/api/letters',
          team: '/api/team',
          dashboard: '/api/dashboard'
        }
      },
      
      // Storage keys
      storage: {
        prefix: 'iif-',
        keys: {
          user: 'user',
          token: 'token',
          language: 'language',
          theme: 'theme',
          letters: 'letters',
          team: 'team',
          settings: 'settings'
        }
      },
      
      // Languages
      languages: {
        default: 'en',
        supported: ['en', 'ar', 'fr', 'es'],
        rtl: ['ar']
      },
      
      // Theme
      theme: {
        default: 'dark',
        supported: ['light', 'dark', 'auto']
      },
      
      // UI settings
      ui: {
        loadingTimeout: 5000,
        animationDuration: 300,
        debounceDelay: 300,
        toastDuration: 5000
      },
      
      // Features
      features: {
        auth: true,
        dashboard: true,
        letters: true,
        team: true,
        settings: true,
        admin: true
      },
      
      // Pagination
      pagination: {
        default: 10,
        max: 100
      },
      
      // File upload
      upload: {
        maxSize: 10 * 1024 * 1024, // 10MB
        allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
        maxFiles: 5
      },
      
      // Validation
      validation: {
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        phone: /^[\+]?[1-9][\d]{0,15}$/,
        password: {
          minLength: 8,
          requireUppercase: true,
          requireLowercase: true,
          requireNumbers: true,
          requireSpecialChars: true
        }
      },
      
      // Cache settings
      cache: {
        ttl: 5 * 60 * 1000, // 5 minutes
        maxSize: 100 // items
      }
    };
  }

  get(key) {
    return this.getNestedValue(this.config, key);
  }

  set(key, value) {
    this.setNestedValue(this.config, key, value);
  }

  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  setNestedValue(obj, path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((current, key) => {
      if (!current[key]) current[key] = {};
      return current[key];
    }, obj);
    target[lastKey] = value;
  }

  // Get storage key with prefix
  getStorageKey(key) {
    return `${this.config.storage.prefix}${key}`;
  }

  // Check if feature is enabled
  isFeatureEnabled(feature) {
    return this.config.features[feature] === true;
  }

  // Get API URL
  getApiUrl(endpoint) {
    const baseUrl = this.config.api.baseUrl;
    const endpointPath = this.config.api.endpoints[endpoint];
    return `${baseUrl}${endpointPath}`;
  }

  // Get validation rules
  getValidationRules(type) {
    return this.config.validation[type] || {};
  }

  // Check if language is supported
  isLanguageSupported(language) {
    return this.config.languages.supported.includes(language);
  }

  // Check if language is RTL
  isLanguageRTL(language) {
    return this.config.languages.rtl.includes(language);
  }

  // Get default language
  getDefaultLanguage() {
    return this.config.languages.default;
  }

  // Get supported languages
  getSupportedLanguages() {
    return this.config.languages.supported;
  }

  // Get pagination settings
  getPaginationSettings() {
    return this.config.pagination;
  }

  // Get upload settings
  getUploadSettings() {
    return this.config.upload;
  }

  // Get cache settings
  getCacheSettings() {
    return this.config.cache;
  }

  // Get UI settings
  getUISettings() {
    return this.config.ui;
  }

  // Get theme settings
  getThemeSettings() {
    return this.config.theme;
  }

  // Validate configuration
  validate() {
    const errors = [];
    
    // Check required fields
    if (!this.config.name) errors.push('App name is required');
    if (!this.config.version) errors.push('App version is required');
    if (!this.config.api.baseUrl) errors.push('API base URL is required');
    
    // Check languages
    if (!this.config.languages.supported.includes(this.config.languages.default)) {
      errors.push('Default language must be in supported languages');
    }
    
    // Check storage keys
    const requiredKeys = ['user', 'token', 'language'];
    requiredKeys.forEach(key => {
      if (!this.config.storage.keys[key]) {
        errors.push(`Storage key '${key}' is required`);
      }
    });
    
    return errors;
  }

  // Export configuration
  export() {
    return JSON.stringify(this.config, null, 2);
  }

  // Import configuration
  import(configString) {
    try {
      const newConfig = JSON.parse(configString);
      this.config = { ...this.config, ...newConfig };
      
      const errors = this.validate();
      if (errors.length > 0) {
        throw new Error(`Configuration validation failed: ${errors.join(', ')}`);
      }
      
      return true;
    } catch (error) {
      console.error('Failed to import configuration:', error);
      return false;
    }
  }

  // Reset to defaults
  reset() {
    this.constructor();
  }
}

// Create global instance
export const appConfig = new AppConfig();
