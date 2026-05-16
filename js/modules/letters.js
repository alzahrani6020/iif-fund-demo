// Letters Manager - Handles all letters and correspondence functionality
export class LettersManager {
  constructor(storageManager, authManager) {
    this.storage = storageManager;
    this.auth = authManager;
    this.letters = {
      inbox: [],
      outbox: [],
      archive: []
    };
    this.currentLetter = null;
    this.saderCounter = {};
  }

  async init() {
    try {
      console.log('📧 Initializing Letters Manager...');
      
      // Load letters data
      await this.loadLettersData();
      
      // Setup event listeners
      this.setupEventListeners();
      
      // Initialize Sader counter
      this.initializeSaderCounter();
      
      console.log('✅ Letters Manager initialized successfully!');
      
    } catch (error) {
      console.error('❌ Failed to initialize Letters Manager:', error);
      throw error;
    }
  }

  async loadLettersData() {
    // Load letters from storage
    this.letters.inbox = this.storage.get('letters-inbox', []);
    this.letters.outbox = this.storage.get('letters-outbox', []);
    this.letters.archive = this.storage.get('letters-archive', []);
    
    // Load sample data if empty
    if (this.letters.outbox.length === 0) {
      this.loadSampleData();
    }
  }

  loadSampleData() {
    const currentYear = new Date().getFullYear();
    
    this.letters.outbox = [
      {
        id: 'S' + Date.now(),
        saderNumber: `${currentYear}-001`,
        subject: 'Investment Proposal - Tech Sector',
        date: new Date().toISOString().split('T')[0],
        toPerson: 'John Smith',
        toEmail: 'john.smith@company.com',
        country: 'United States',
        body: 'Dear John,\n\nWe are pleased to present our investment proposal for the technology sector...',
        source: 'letter',
        status: 'sent'
      },
      {
        id: 'S' + (Date.now() - 1000),
        saderNumber: `${currentYear}-002`,
        subject: 'Partnership Agreement',
        date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        toPerson: 'Sarah Johnson',
        toEmail: 'sarah.j@business.com',
        country: 'United Kingdom',
        body: 'Dear Sarah,\n\nFollowing our recent discussion, we would like to formalize our partnership...',
        source: 'letter',
        status: 'sent'
      }
    ];
    
    this.saveLettersData();
  }

  setupEventListeners() {
    // Letter form submission
    document.addEventListener('submit', (e) => {
      if (e.target.id === 'letter-form') {
        e.preventDefault();
        this.handleLetterSubmission(e.target);
      }
    });

    // Archive button clicks
    document.addEventListener('click', (e) => {
      if (e.target.id === 'archive-selected-btn') {
        this.archiveSelectedLetters();
      }
    });

    // Letter selection
    document.addEventListener('change', (e) => {
      if (e.target.matches('.letter-checkbox')) {
        this.updateArchiveButton();
      }
    });

    // Search functionality
    document.addEventListener('input', (e) => {
      if (e.target.id === 'archive-search-input') {
        this.handleArchiveSearch(e.target.value);
      }
    });

    // Date filter changes
    document.addEventListener('change', (e) => {
      if (e.target.id === 'archive-date-from' || e.target.id === 'archive-date-to') {
        this.handleDateFilter();
      }
    });
  }

  initializeSaderCounter() {
    const currentYear = new Date().getFullYear();
    this.saderCounter[currentYear] = this.storage.get(`sader-counter-${currentYear}`, 2);
  }

  getNextSaderNumber() {
    const currentYear = new Date().getFullYear();
    this.saderCounter[currentYear] = (this.saderCounter[currentYear] || 0) + 1;
    
    // Save counter
    this.storage.set(`sader-counter-${currentYear}`, this.saderCounter[currentYear]);
    
    // Format: YYYY-NNN
    return `${currentYear}-${this.saderCounter[currentYear].toString().padStart(3, '0')}`;
  }

  handleLetterSubmission(form) {
    console.log('📧 Handling letter submission...');
    
    // Get form data
    const formData = new FormData(form);
    const letterData = {
      id: 'S' + Date.now(),
      saderNumber: this.getNextSaderNumber(),
      subject: formData.get('subject') || '',
      date: formData.get('date') || new Date().toISOString().split('T')[0],
      toPerson: formData.get('toPerson') || '',
      toEmail: formData.get('toEmail') || '',
      country: formData.get('country') || '',
      body: formData.get('body') || '',
      source: 'letter',
      status: 'draft'
    };

    // Validate letter data
    if (!this.validateLetterData(letterData)) {
      this.showNotification('error', 'Please fill in all required fields');
      return;
    }

    // Add to outbox
    this.letters.outbox.unshift(letterData);
    
    // Save to storage
    this.saveLettersData();
    
    // Update UI
    this.updateSaderDisplay(letterData.saderNumber);
    this.renderOutboxList();
    
    // Show success message
    this.showNotification('success', 'Letter created successfully');
    
    // Reset form
    form.reset();
  }

  validateLetterData(letterData) {
    return letterData.subject.trim() !== '' && 
           letterData.body.trim() !== '' &&
           letterData.toPerson.trim() !== '';
  }

  updateSaderDisplay(saderNumber) {
    const saderDisplay = document.getElementById('letter-sader-display');
    if (saderDisplay) {
      saderDisplay.value = saderNumber;
    }
  }

  archiveSelectedLetters() {
    console.log('📁 Archiving selected letters...');
    
    // Get selected letters
    const selectedCheckboxes = document.querySelectorAll('.letter-checkbox:checked');
    const selectedIds = Array.from(selectedCheckboxes).map(cb => cb.getAttribute('data-id'));
    
    if (selectedIds.length === 0) {
      this.showNotification('warning', 'Please select letters to archive');
      return;
    }

    // Move letters to archive
    selectedIds.forEach(id => {
      const letterIndex = this.letters.outbox.findIndex(letter => letter.id === id);
      if (letterIndex !== -1) {
        const letter = this.letters.outbox[letterIndex];
        letter.archivedDate = new Date().toISOString();
        this.letters.archive.unshift(letter);
        this.letters.outbox.splice(letterIndex, 1);
      }
    });

    // Save to storage
    this.saveLettersData();
    
    // Update UI
    this.renderOutboxList();
    this.renderArchiveList();
    
    // Show success message
    this.showNotification('success', `${selectedIds.length} letter(s) archived successfully`);
  }

  updateArchiveButton() {
    const archiveBtn = document.getElementById('archive-selected-btn');
    const selectedCount = document.querySelectorAll('.letter-checkbox:checked').length;
    
    if (archiveBtn) {
      archiveBtn.disabled = selectedCount === 0;
      archiveBtn.textContent = selectedCount > 0 ? 
        `Archive Selected (${selectedCount})` : 'Archive Selected';
    }
  }

  handleArchiveSearch(query) {
    console.log('🔍 Searching archive:', query);
    
    this.renderArchiveList(query);
  }

  handleDateFilter() {
    console.log('📅 Filtering by date...');
    
    const fromDate = document.getElementById('archive-date-from')?.value;
    const toDate = document.getElementById('archive-date-to')?.value;
    
    this.renderArchiveList('', fromDate, toDate);
  }

  renderOutboxList() {
    const container = document.getElementById('outbox-list');
    if (!container) return;

    const lettersHTML = this.letters.outbox.slice(0, 30).map(letter => `
      <li class="letter-item">
        <div class="letter-content">
          <input type="checkbox" class="letter-checkbox" data-id="${letter.id}" 
                 style="margin: 0.25rem 0.5rem 0 0;">
          <div style="flex: 1;">
            <strong><span style="color: #c9a227;">${letter.saderNumber}</span></strong> 
            ${this.escapeHtml(letter.subject)}
            <br><small>${letter.date} | ${this.escapeHtml(letter.toPerson)} | ${this.escapeHtml(letter.country)}</small>
          </div>
        </div>
      </li>
    `).join('');

    container.innerHTML = lettersHTML;
  }

  renderArchiveList(searchQuery = '', fromDate = '', toDate = '') {
    const container = document.getElementById('archive-list');
    if (!container) return;

    let filteredLetters = this.letters.archive;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filteredLetters = filteredLetters.filter(letter => 
        letter.saderNumber.toLowerCase().includes(query) ||
        letter.subject.toLowerCase().includes(query) ||
        letter.toPerson.toLowerCase().includes(query) ||
        letter.country.toLowerCase().includes(query) ||
        letter.body.toLowerCase().includes(query)
      );
    }

    // Apply date filter
    if (fromDate || toDate) {
      filteredLetters = filteredLetters.filter(letter => {
        const letterDate = new Date(letter.date);
        const from = fromDate ? new Date(fromDate) : new Date('1900-01-01');
        const to = toDate ? new Date(toDate) : new Date('2100-12-31');
        return letterDate >= from && letterDate <= to;
      });
    }

    const lettersHTML = filteredLetters.map(letter => `
      <li class="letter-item">
        <div class="letter-content">
          <strong><span style="color: #c9a227;">${letter.saderNumber}</span></strong> 
          ${this.escapeHtml(letter.subject)}
          <br><small>${letter.date} | ${this.escapeHtml(letter.toPerson)} | ${this.escapeHtml(letter.country)}</small>
          ${letter.archivedDate ? `<br><small style="color: #666;">Archived: ${new Date(letter.archivedDate).toLocaleDateString()}</small>` : ''}
        </div>
      </li>
    `).join('');

    container.innerHTML = lettersHTML || '<li class="letter-item"><div class="letter-content">No letters found</div></li>';
  }

  saveLettersData() {
    this.storage.set('letters-inbox', this.letters.inbox);
    this.storage.set('letters-outbox', this.letters.outbox);
    this.storage.set('letters-archive', this.letters.archive);
  }

  // Letter creation methods
  createLetter(letterData) {
    const letter = {
      id: 'S' + Date.now(),
      saderNumber: this.getNextSaderNumber(),
      ...letterData,
      createdAt: new Date().toISOString(),
      status: 'draft'
    };

    this.letters.outbox.unshift(letter);
    this.saveLettersData();
    
    return letter;
  }

  updateLetter(letterId, updates) {
    const letterIndex = this.letters.outbox.findIndex(letter => letter.id === letterId);
    if (letterIndex !== -1) {
      this.letters.outbox[letterIndex] = { ...this.letters.outbox[letterIndex], ...updates };
      this.saveLettersData();
      return this.letters.outbox[letterIndex];
    }
    return null;
  }

  deleteLetter(letterId) {
    const letterIndex = this.letters.outbox.findIndex(letter => letter.id === letterId);
    if (letterIndex !== -1) {
      const deletedLetter = this.letters.outbox.splice(letterIndex, 1)[0];
      this.saveLettersData();
      return deletedLetter;
    }
    return null;
  }

  sendLetter(letterId) {
    const letter = this.updateLetter(letterId, { 
      status: 'sent', 
      sentAt: new Date().toISOString() 
    });
    
    if (letter) {
      // In a real application, this would send the letter via email/API
      console.log('📧 Letter sent:', letter);
      this.showNotification('success', 'Letter sent successfully');
    }
    
    return letter;
  }

  // Search and filter methods
  searchLetters(query, type = 'all') {
    let letters = [];
    
    switch (type) {
      case 'inbox':
        letters = this.letters.inbox;
        break;
      case 'outbox':
        letters = this.letters.outbox;
        break;
      case 'archive':
        letters = this.letters.archive;
        break;
      default:
        letters = [...this.letters.inbox, ...this.letters.outbox, ...this.letters.archive];
    }

    if (!query.trim()) {
      return letters;
    }

    const searchTerm = query.toLowerCase();
    return letters.filter(letter => 
      letter.saderNumber.toLowerCase().includes(searchTerm) ||
      letter.subject.toLowerCase().includes(searchTerm) ||
      letter.toPerson.toLowerCase().includes(searchTerm) ||
      letter.country.toLowerCase().includes(searchTerm) ||
      letter.body.toLowerCase().includes(searchTerm)
    );
  }

  // Statistics
  getLetterStats() {
    return {
      total: this.letters.inbox.length + this.letters.outbox.length + this.letters.archive.length,
      inbox: this.letters.inbox.length,
      outbox: this.letters.outbox.length,
      archive: this.letters.archive.length,
      sent: this.letters.outbox.filter(letter => letter.status === 'sent').length,
      draft: this.letters.outbox.filter(letter => letter.status === 'draft').length
    };
  }

  // Export methods
  exportLetters(type = 'all', format = 'json') {
    let letters = [];
    
    switch (type) {
      case 'inbox':
        letters = this.letters.inbox;
        break;
      case 'outbox':
        letters = this.letters.outbox;
        break;
      case 'archive':
        letters = this.letters.archive;
        break;
      default:
        letters = [...this.letters.inbox, ...this.letters.outbox, ...this.letters.archive];
    }

    if (format === 'csv') {
      return this.convertToCSV(letters);
    }
    
    return JSON.stringify(letters, null, 2);
  }

  convertToCSV(letters) {
    const headers = ['ID', 'Sader Number', 'Subject', 'Date', 'To Person', 'Country', 'Status'];
    const csvContent = [
      headers.join(','),
      ...letters.map(letter => [
        letter.id,
        letter.saderNumber,
        `"${letter.subject.replace(/"/g, '""')}"`,
        letter.date,
        `"${letter.toPerson.replace(/"/g, '""')}"`,
        letter.country,
        letter.status
      ].join(','))
    ].join('\n');

    return csvContent;
  }

  // Utility methods
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  showNotification(type, message) {
    const notification = document.createElement('div');
    notification.className = `alert alert--${type}`;
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

  // Get methods
  getLetter(letterId) {
    return this.letters.outbox.find(letter => letter.id === letterId) ||
           this.letters.inbox.find(letter => letter.id === letterId) ||
           this.letters.archive.find(letter => letter.id === letterId);
  }

  getLetters(type = 'all') {
    switch (type) {
      case 'inbox':
        return this.letters.inbox;
      case 'outbox':
        return this.letters.outbox;
      case 'archive':
        return this.letters.archive;
      default:
        return [...this.letters.inbox, ...this.letters.outbox, ...this.letters.archive];
    }
  }
}
