// Storage Management Utility
export class StorageManager {
  constructor() {
    this.prefix = 'iif-';
    this.cache = new Map();
    this.cacheExpiry = new Map();
    this.defaultTTL = 5 * 60 * 1000; // 5 minutes
  }

  // Initialize storage manager
  async init() {
    // Check localStorage availability
    if (!this.isLocalStorageAvailable()) {
      console.warn('localStorage is not available, using memory storage');
      return;
    }
    
    // Clean expired items
    this.cleanExpiredItems();
    
    // Setup storage event listener
    window.addEventListener('storage', (e) => {
      this.handleStorageEvent(e);
    });
    
    console.log('Storage manager initialized');
  }

  // Check if localStorage is available
  isLocalStorageAvailable() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  // Get full key with prefix
  getFullKey(key) {
    return `${this.prefix}${key}`;
  }

  // Set item in storage
  set(key, value, options = {}) {
    const { ttl = this.defaultTTL, encrypt = false } = options;
    const fullKey = this.getFullKey(key);
    
    try {
      const item = {
        value: encrypt ? this.encrypt(JSON.stringify(value)) : JSON.stringify(value),
        timestamp: Date.now(),
        ttl: ttl,
        encrypted: encrypt
      };
      
      localStorage.setItem(fullKey, JSON.stringify(item));
      
      // Update cache
      this.cache.set(key, value);
      if (ttl > 0) {
        this.cacheExpiry.set(key, Date.now() + ttl);
      }
      
      // Emit change event
      this.emitChangeEvent(key, value, 'set');
      
      return true;
    } catch (error) {
      console.error('Failed to set storage item:', error);
      return false;
    }
  }

  // Get item from storage
  get(key, defaultValue = null) {
    const fullKey = this.getFullKey(key);
    
    // Check cache first
    if (this.cache.has(key)) {
      const expiry = this.cacheExpiry.get(key);
      if (!expiry || expiry > Date.now()) {
        return this.cache.get(key);
      } else {
        this.cache.delete(key);
        this.cacheExpiry.delete(key);
      }
    }
    
    try {
      const itemStr = localStorage.getItem(fullKey);
      if (!itemStr) {
        return defaultValue;
      }
      
      const item = JSON.parse(itemStr);
      
      // Check if item is expired
      if (item.ttl > 0 && (Date.now() - item.timestamp) > item.ttl) {
        this.delete(key);
        return defaultValue;
      }
      
      // Decrypt if needed
      let value = item.value;
      if (item.encrypted) {
        value = this.decrypt(value);
      }
      
      const parsedValue = JSON.parse(value);
      
      // Update cache
      this.cache.set(key, parsedValue);
      if (item.ttl > 0) {
        this.cacheExpiry.set(key, item.timestamp + item.ttl);
      }
      
      return parsedValue;
    } catch (error) {
      console.error('Failed to get storage item:', error);
      return defaultValue;
    }
  }

  // Delete item from storage
  delete(key) {
    const fullKey = this.getFullKey(key);
    
    try {
      localStorage.removeItem(fullKey);
      
      // Update cache
      this.cache.delete(key);
      this.cacheExpiry.delete(key);
      
      // Emit change event
      this.emitChangeEvent(key, null, 'delete');
      
      return true;
    } catch (error) {
      console.error('Failed to delete storage item:', error);
      return false;
    }
  }

  // Clear all items with prefix
  clear() {
    try {
      const keys = this.getKeys();
      keys.forEach(key => this.delete(key));
      
      // Clear cache
      this.cache.clear();
      this.cacheExpiry.clear();
      
      console.log('Storage cleared');
      return true;
    } catch (error) {
      console.error('Failed to clear storage:', error);
      return false;
    }
  }

  // Get all keys with prefix
  getKeys() {
    const keys = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.prefix)) {
        keys.push(key.substring(this.prefix.length));
      }
    }
    
    return keys;
  }

  // Get storage size
  getSize() {
    let size = 0;
    
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key) && key.startsWith(this.prefix)) {
        size += localStorage[key].length + key.length;
      }
    }
    
    return size;
  }

  // Check if key exists
  has(key) {
    const fullKey = this.getFullKey(key);
    return localStorage.getItem(fullKey) !== null;
  }

  // Get item metadata
  getMetadata(key) {
    const fullKey = this.getFullKey(key);
    
    try {
      const itemStr = localStorage.getItem(fullKey);
      if (!itemStr) {
        return null;
      }
      
      const item = JSON.parse(itemStr);
      
      return {
        timestamp: item.timestamp,
        ttl: item.ttl,
        encrypted: item.encrypted,
        size: itemStr.length,
        expired: item.ttl > 0 && (Date.now() - item.timestamp) > item.ttl
      };
    } catch (error) {
      console.error('Failed to get storage metadata:', error);
      return null;
    }
  }

  // Clean expired items
  cleanExpiredItems() {
    const keys = this.getKeys();
    let cleaned = 0;
    
    keys.forEach(key => {
      const metadata = this.getMetadata(key);
      if (metadata && metadata.expired) {
        this.delete(key);
        cleaned++;
      }
    });
    
    if (cleaned > 0) {
      console.log(`Cleaned ${cleaned} expired storage items`);
    }
    
    return cleaned;
  }

  // Export all data
  export() {
    const data = {};
    const keys = this.getKeys();
    
    keys.forEach(key => {
      data[key] = this.get(key);
    });
    
    return {
      version: '1.0',
      timestamp: Date.now(),
      data
    };
  }

  // Import data
  async import(exportedData) {
    try {
      if (!exportedData || !exportedData.data) {
        throw new Error('Invalid export data');
      }
      
      const { data } = exportedData;
      let imported = 0;
      
      for (const [key, value] of Object.entries(data)) {
        if (this.set(key, value)) {
          imported++;
        }
      }
      
      console.log(`Imported ${imported} storage items`);
      return imported;
    } catch (error) {
      console.error('Failed to import storage data:', error);
      return 0;
    }
  }

  // Simple encryption (for demo purposes - use proper encryption in production)
  encrypt(text) {
    // This is a simple XOR cipher - replace with proper encryption
    const key = 'iif-encryption-key';
    let result = '';
    
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    
    return btoa(result);
  }

  // Simple decryption (for demo purposes - use proper decryption in production)
  decrypt(text) {
    // This is a simple XOR cipher - replace with proper decryption
    const key = 'iif-encryption-key';
    const decoded = atob(text);
    let result = '';
    
    for (let i = 0; i < decoded.length; i++) {
      result += String.fromCharCode(decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    
    return result;
  }

  // Handle storage events
  handleStorageEvent(event) {
    if (!event.key || !event.key.startsWith(this.prefix)) {
      return;
    }
    
    const key = event.key.substring(this.prefix.length);
    
    // Update cache
    if (event.newValue === null) {
      this.cache.delete(key);
      this.cacheExpiry.delete(key);
    } else {
      try {
        const item = JSON.parse(event.newValue);
        let value = item.value;
        if (item.encrypted) {
          value = this.decrypt(value);
        }
        const parsedValue = JSON.parse(value);
        
        this.cache.set(key, parsedValue);
        if (item.ttl > 0) {
          this.cacheExpiry.set(key, item.timestamp + item.ttl);
        }
      } catch (error) {
        console.error('Failed to update cache from storage event:', error);
      }
    }
    
    // Emit change event
    this.emitChangeEvent(key, event.newValue ? this.get(key) : null, 'storage');
  }

  // Emit change event
  emitChangeEvent(key, value, action) {
    document.dispatchEvent(new CustomEvent('storage-changed', {
      detail: { key, value, action }
    }));
  }

  // Get cache statistics
  getCacheStats() {
    return {
      size: this.cache.size,
      expirySize: this.cacheExpiry.size,
      keys: Array.from(this.cache.keys()),
      expiryKeys: Array.from(this.cacheExpiry.keys())
    };
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
    this.cacheExpiry.clear();
  }

  // Set cache TTL
  setCacheTTL(ttl) {
    this.defaultTTL = ttl;
  }

  // Get cache TTL
  getCacheTTL() {
    return this.defaultTTL;
  }
}

// Create global instance
export const storageManager = new StorageManager();
