// Search Module
export class Search {
    constructor() {
        this.searchToggle = document.querySelector('.search-toggle');
        this.searchOverlay = document.querySelector('.search-overlay');
        this.searchClose = document.querySelector('.search-close');
        this.searchInput = document.querySelector('.search-input');
        this.searchForm = document.querySelector('.search-form');
        this.searchResults = document.querySelector('#searchResults');
        
        this.init();
    }

    init() {
        this.setupSearchToggle();
        this.setupSearchClose();
        this.setupSearchForm();
        this.setupKeyboardShortcuts();
    }

    setupSearchToggle() {
        if (this.searchToggle && this.searchOverlay) {
            this.searchToggle.addEventListener('click', () => {
                this.openSearch();
            });
        }
    }

    setupSearchForm() {
        if (this.searchForm && this.searchInput) {
            // Real-time search with debouncing
            let searchTimeout;
            this.searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                const query = e.target.value.trim();
                
                if (query.length > 0) {
                    searchTimeout = setTimeout(() => {
                        this.performCulturalSearch(query);
                    }, 300);
                } else {
                    this.clearResults();
                    this.showPopularSearches();
                }
            });

            // Form submission
            this.searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const query = this.searchInput.value.trim();
                if (query) {
                    this.performCulturalSearch(query);
                    this.addToSearchHistory(query);
                }
            });

            // Auto-suggestions
            this.searchInput.addEventListener('focus', () => {
                if (this.searchInput.value.trim() === '') {
                    this.showPopularSearches();
                }
            });

            this.searchInput.addEventListener('blur', () => {
                setTimeout(() => {
                    this.hideSuggestions();
                }, 200);
            });
        }
    }

    setupCulturalFilters() {
        // Create cultural filter UI
        const filterHTML = `
            <div class="cultural-search-filters">
                <h4><i class="fas fa-filter"></i> فلترة البحث الثقافي</h4>
                <div class="filter-grid">
                    <label class="cultural-filter">
                        <input type="checkbox" id="filter-nabati" checked>
                        <span class="filter-icon">🌵</span>
                        <span class="filter-text">الشعر النبطي</span>
                    </label>
                    <label class="cultural-filter">
                        <input type="checkbox" id="filter-folk" checked>
                        <span class="filter-icon">🎭</span>
                        <span class="filter-text">الشعر الشعبي</span>
                    </label>
                    <label class="cultural-filter">
                        <input type="checkbox" id="filter-zahran" checked>
                        <span class="filter-icon">🏔</span>
                        <span class="filter-text">اللهجة الزهرانية</span>
                    </label>
                    <label class="cultural-filter">
                        <input type="checkbox" id="filter-southern" checked>
                        <span class="filter-icon">🏜</span>
                        <span class="filter-text">التراث الجنوبي</span>
                    </label>
                    <label class="cultural-filter">
                        <input type="checkbox" id="filter-saudi" checked>
                        <span class="filter-icon">🇸🇦</span>
                        <span class="filter-text">اللهجات السعودية</span>
                    </label>
                </div>
            </div>
        `;

        // Insert filters in search overlay
        const searchContainer = this.searchOverlay?.querySelector('.search-container');
        if (searchContainer && !searchContainer.querySelector('.cultural-search-filters')) {
            searchContainer.insertAdjacentHTML('beforeend', filterHTML);
            this.setupFilterEvents();
        }
    }

    setupFilterEvents() {
        const filters = [
            { id: 'filter-nabati', key: 'nabatiPoetry' },
            { id: 'filter-folk', key: 'folkPoetry' },
            { id: 'filter-zahran', key: 'zahranDialect' },
            { id: 'filter-southern', key: 'southernHeritage' },
            { id: 'filter-saudi', key: 'saudiDialects' }
        ];

        filters.forEach(filter => {
            const checkbox = document.getElementById(filter.id);
            if (checkbox) {
                checkbox.addEventListener('change', (e) => {
                    this.culturalFilters[filter.key] = e.target.checked;
                    
                    // Re-run search if there's a query
                    const query = this.searchInput?.value.trim();
                    if (query) {
                        this.performCulturalSearch(query);
                    }
                });
            }
        });
    }

    async performCulturalSearch(query) {
        if (!query) return;

        this.showLoading();
        
        try {
            const results = await this.searchCulturalContent(query);
            this.displayCulturalResults(results, query);
        } catch (error) {
            console.error('Search error:', error);
            this.showError('حدث خطأ في البحث');
        } finally {
            this.hideLoading();
        }
    }

    async searchCulturalContent(query) {
        const lowercaseQuery = query.toLowerCase();
        const results = [];

        // Search in poems (Nabati and Folk)
        if (this.culturalFilters.nabatiPoetry || this.culturalFilters.folkPoetry) {
            const poems = await this.searchInPoems(lowercaseQuery);
            results.push(...poems.map(poem => ({
                ...poem,
                type: this.isNabatiPoem(poem) ? 'nabati' : 'folk',
                category: 'poem'
            })));
        }

        // Search in dictionary (Zahran dialect and Saudi dialects)
        if (this.culturalFilters.zahranDialect || this.culturalFilters.saudiDialects) {
            const dictionary = await this.searchInDictionary(lowercaseQuery);
            results.push(...dictionary.map(word => ({
                ...word,
                type: this.isZahranWord(word) ? 'zahran' : 'saudi',
                category: 'word'
            })));
        }

        // Search in videos (Southern heritage)
        if (this.culturalFilters.southernHeritage) {
            const videos = await this.searchInVideos(lowercaseQuery);
            results.push(...videos.map(video => ({
                ...video,
                type: 'heritage',
                category: 'video'
            })));
        }

        // Search in quotes
        const quotes = await this.searchInQuotes(lowercaseQuery);
        results.push(...quotes.map(quote => ({
            ...quote,
            type: 'cultural',
            category: 'quote'
        })));

        // Sort results by relevance
        return this.sortResultsByRelevance(results, query);
    }

    async searchInPoems(query) {
        try {
            const response = await fetch('data/poems.json');
            if (!response.ok) return [];
            
            const data = await response.json();
            const poems = data.poems || [];
            
            return poems.filter(poem => 
                poem.title.toLowerCase().includes(query) ||
                poem.content.toLowerCase().includes(query) ||
                poem.category.toLowerCase().includes(query) ||
                (poem.excerpt && poem.excerpt.toLowerCase().includes(query))
            ).slice(0, 5);
        } catch (error) {
            console.error('Error searching poems:', error);
            return [];
        }
    }

    async searchInDictionary(query) {
        try {
            const response = await fetch('data/dictionary.json');
            if (!response.ok) return [];
            
            const data = await response.json();
            const words = data.words || [];
            
            return words.filter(word => 
                word.word.toLowerCase().includes(query) ||
                word.meaning.toLowerCase().includes(query) ||
                (word.examples && word.examples.some(example => 
                    example.toLowerCase().includes(query)
                ))
            ).slice(0, 5);
        } catch (error) {
            console.error('Error searching dictionary:', error);
            return [];
        }
    }

    async searchInVideos(query) {
        try {
            const response = await fetch('data/videos.json');
            if (!response.ok) return [];
            
            const data = await response.json();
            const videos = data.videos || [];
            
            return videos.filter(video => 
                video.title.toLowerCase().includes(query) ||
                video.description.toLowerCase().includes(query) ||
                video.tags.some(tag => tag.toLowerCase().includes(query))
            ).slice(0, 3);
        } catch (error) {
            console.error('Error searching videos:', error);
            return [];
        }
    }

    async searchInQuotes(query) {
        try {
            const response = await fetch('data/quotes.json');
            if (!response.ok) return [];
            
            const data = await response.json();
            const quotes = data.quotes || [];
            
            return quotes.filter(quote => 
                quote.quote.toLowerCase().includes(query) ||
                quote.category.toLowerCase().includes(query)
            ).slice(0, 3);
        } catch (error) {
            console.error('Error searching quotes:', error);
            return [];
        }
    }

    isNabatiPoem(poem) {
        const nabatiKeywords = ['نبطي', 'صحراء', 'بدوي', 'تراثي', 'زهران'];
        const text = `${poem.title} ${poem.content} ${poem.category}`.toLowerCase();
        return nabatiKeywords.some(keyword => text.includes(keyword));
    }

    isZahranWord(word) {
        const zahranKeywords = ['زهراني', 'زهران', 'جنوبي'];
        const text = `${word.word} ${word.meaning}`.toLowerCase();
        return zahranKeywords.some(keyword => text.includes(keyword));
    }

    sortResultsByRelevance(results, query) {
        return results.sort((a, b) => {
            const aScore = this.calculateRelevanceScore(a, query);
            const bScore = this.calculateRelevanceScore(b, query);
            return bScore - aScore;
        });
    }

    calculateRelevanceScore(item, query) {
        let score = 0;
        const lowercaseQuery = query.toLowerCase();
        
        // Title/exact match gets highest score
        if (item.title && item.title.toLowerCase().includes(lowercaseQuery)) {
            score += 10;
        }
        
        // Content/description gets medium score
        if (item.content && item.content.toLowerCase().includes(lowercaseQuery)) {
            score += 7;
        } else if (item.description && item.description.toLowerCase().includes(lowercaseQuery)) {
            score += 7;
        }
        
        // Category match gets lower score
        if (item.category && item.category.toLowerCase().includes(lowercaseQuery)) {
            score += 5;
        }
        
        // Type-specific scoring
        if (item.type === 'nabati' && lowercaseQuery.includes('نبطي')) score += 15;
        if (item.type === 'zahran' && lowercaseQuery.includes('زهران')) score += 15;
        if (item.type === 'heritage' && lowercaseQuery.includes('تراث')) score += 15;
        
        return score;
    }

    displayCulturalResults(results, query) {
        if (!this.searchResults) return;

        if (results.length === 0) {
            this.showNoResults(query);
            return;
        }

        // Group results by type
        const groupedResults = this.groupResultsByType(results);
        
        const resultsHTML = Object.entries(groupedResults).map(([type, items]) => `
            <div class="search-category-section">
                <h4 class="search-category-title">
                    <i class="fas ${this.getCategoryIcon(type)}"></i>
                    ${this.getCategoryTitle(type)}
                </h4>
                <div class="search-category-results">
                    ${items.map(item => this.createResultItem(item)).join('')}
                </div>
            </div>
        `).join('');

        this.searchResults.innerHTML = resultsHTML;
        this.addResultEventListeners();
    }

    groupResultsByType(results) {
        const grouped = {};
        
        results.forEach(item => {
            if (!grouped[item.type]) {
                grouped[item.type] = [];
            }
            grouped[item.type].push(item);
        });
        
        return grouped;
    }

    getCategoryIcon(type) {
        const icons = {
            nabati: 'fa-feather-alt',
            folk: 'fa-music',
            zahran: 'fa-language',
            saudi: 'fa-comments',
            heritage: 'fa-landmark',
            cultural: 'fa-quote-right'
        };
        return icons[type] || 'fa-search';
    }

    getCategoryTitle(type) {
        const titles = {
            nabati: 'الشعر النبطي',
            folk: 'الشعر الشعبي',
            zahran: 'اللهجة الزهرانية',
            saudi: 'اللهجات السعودية',
            heritage: 'التراث الجنوبي',
            cultural: 'الثقافة العامة'
        };
        return titles[type] || 'نتائج البحث';
    }

    createResultItem(item) {
        switch (item.category) {
            case 'poem':
                return `
                    <div class="search-result-item poem-result" data-id="${item.id}">
                        <div class="result-icon">
                            <i class="fas fa-feather-alt"></i>
                        </div>
                        <div class="result-content">
                            <h5 class="result-title">${item.title}</h5>
                            <p class="result-excerpt">${item.excerpt || item.content.substring(0, 100)}...</p>
                            <span class="result-category">${item.type === 'nabati' ? 'نبطي' : 'شعبي'}</span>
                        </div>
                    </div>
                `;
            
            case 'word':
                return `
                    <div class="search-result-item word-result" data-id="${item.id}">
                        <div class="result-icon">
                            <i class="fas fa-language"></i>
                        </div>
                        <div class="result-content">
                            <h5 class="result-title">${item.word}</h5>
                            <p class="result-meaning">${item.meaning}</p>
                            <span class="result-category">${item.type === 'zahran' ? 'زهراني' : 'سعودي'}</span>
                        </div>
                    </div>
                `;
            
            case 'video':
                return `
                    <div class="search-result" data-type="${result.type}" data-id="${result.id}">
                        <div class="result-icon">
                            <i class="fas ${typeIcons[result.type]}"></i>
                        </div>
                        <div class="result-content">
                            <h4>${result.title}</h4>
                            <p>${result.description}</p>
                            <div class="result-meta">
                                <span class="result-type">${typeLabels[result.type]}</span>
                                <span class="result-duration">${result.duration}</span>
                            </div>
                        </div>
                    </div>
                `;
            
            case 'quote':
                return `
                    <div class="search-result" data-type="${result.type}" data-id="${result.id}">
                        <div class="result-icon">
                            <i class="fas ${typeIcons[result.type]}"></i>
                        </div>
                        <div class="result-content">
                            <h4>"${result.quote}"</h4>
                            <p>${result.context}</p>
                            <div class="result-meta">
                                <span class="result-type">${typeLabels[result.type]}</span>
                            </div>
                        </div>
                    </div>
                `;
            
            default:
                return '';
        }
    }

    setupResultHandlers() {
        const resultElements = this.searchResults.querySelectorAll('.search-result');
        
        resultElements.forEach(element => {
            element.addEventListener('click', () => {
                const type = element.dataset.type;
                const id = element.dataset.id;
                
                // Navigate to the appropriate section
                this.navigateToResult(type, id);
                
                // Close search
                this.closeSearch();
            });
        });
    }

    navigateToResult(type, id) {
        const sectionMap = {
            poem: '#diwan',
            dictionary: '#dictionary',
            video: '#videos',
            quote: '#quotes'
        };

        const targetSection = sectionMap[type];
        if (targetSection) {
            // Scroll to section
            const target = document.querySelector(targetSection);
            if (target) {
                const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    }
}
