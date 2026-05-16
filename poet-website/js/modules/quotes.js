// Quotes Module
export class Quotes {
    constructor() {
        this.shareButtons = document.querySelectorAll('.btn-share-quote');
        this.copyButtons = document.querySelectorAll('.btn-copy-quote');
        this.quotesData = [];
        this.currentQuoteIndex = 0;
        
        this.init();
    }

    init() {
        this.setupShareButtons();
        this.setupCopyButtons();
        this.loadQuotesData();
        this.setupRandomQuote();
    }

    setupShareButtons() {
        this.shareButtons.forEach(button => {
            button.addEventListener('click', () => {
                const quoteCard = button.closest('.quote-card');
                if (quoteCard) {
                    this.shareQuote(quoteCard);
                }
            });
        });
    }

    setupCopyButtons() {
        this.copyButtons.forEach(button => {
            button.addEventListener('click', () => {
                const quoteCard = button.closest('.quote-card');
                if (quoteCard) {
                    this.copyQuote(quoteCard);
                }
            });
        });
    }

    setupRandomQuote() {
        const randomButton = document.querySelector('.btn-random-quote');
        if (randomButton) {
            randomButton.addEventListener('click', () => {
                this.showRandomQuote();
            });
        }
    }

    async loadQuotesData() {
        try {
            // Try to load from data file
            const response = await fetch('data/quotes.json');
            if (response.ok) {
                this.quotesData = await response.json();
            } else {
                // Use sample data if file doesn't exist
                this.quotesData = this.getSampleQuotes();
            }
        } catch (error) {
            console.error('Error loading quotes data:', error);
            this.quotesData = this.getSampleQuotes();
        }
    }

    getSampleQuotes() {
        return [
            {
                id: 1,
                quote: 'الشعر مرآة الروح، وكل بيت منه انعكاس لمشاعر صادقة',
                author: 'محمد عيضة الزهراني',
                category: 'شعر',
                context: 'عن أهمية الشعر في التعبير عن المشاعر',
                featured: true
            },
            {
                id: 2,
                quote: 'الكلمة الطيبة جواز مرور للقلوب، والكلمة السيئة جدار يعزل',
                author: 'محمد عيضة الزهراني',
                category: 'حكمة',
                context: 'عن تأثير الكلمات',
                featured: false
            },
            {
                id: 3,
                quote: 'التراث ليس ماضياً ننساه، بل هو جذورنا التي ننمو بها',
                author: 'محمد عيضة الزهراني',
                category: 'تراث',
                context: 'عن أهمية الحفاظ على التراث',
                featured: false
            },
            {
                id: 4,
                quote: 'الأماسي التي نعيشها هي التي تصقل أرواحنا وتجعلنا أقوى',
                author: 'محمد عيضة الزهراني',
                category: 'حياة',
                context: 'عن الصبر والتحدي',
                featured: true
            },
            {
                id: 5,
                quote: 'الحب ليس كلمات نقولها، بل مشاعر نعيشها ونبعثها للآخرين',
                author: 'محمد عيضة الزهراني',
                category: 'حب',
                context: 'عن معنى الحب الحقيقي',
                featured: false
            },
            {
                id: 6,
                quote: 'الوطن ليس مجرد أرض نسكنها، بل هو الهوية التي نحملها',
                author: 'محمد عيضة الزهراني',
                category: 'وطن',
                context: 'عن مفهوم الوطن',
                featured: false
            },
            {
                id: 7,
                quote: 'الشعراء هم رسل السماء إلى الأرض، يترجمون لغة القلوب',
                author: 'محمد عيضة الزهراني',
                category: 'شعر',
                context: 'عن دور الشاعر في المجتمع',
                featured: false
            },
            {
                id: 8,
                quote: 'الصبر مفتاح الفرج، والعزيمة سلاح المؤمن',
                author: 'محمد عيضة الزهراني',
                category: 'حكمة',
                context: 'عن قيمة الصبر والعزيمة',
                featured: false
            }
        ];
    }

    extractQuoteData(quoteCard) {
        const quote = quoteCard.querySelector('blockquote')?.textContent;
        const author = quoteCard.querySelector('cite')?.textContent;
        const category = quoteCard.dataset.category;
        const context = quoteCard.dataset.context;
        const featured = quoteCard.classList.contains('featured');

        return {
            quote: quote || '',
            author: author || 'محمد عيضة الزهراني',
            category: category || 'عامة',
            context: context || '',
            featured: featured || false
        };
    }

    async shareQuote(quoteCard) {
        const quoteData = this.extractQuoteData(quoteCard);
        
        const shareData = {
            title: 'اقتباس من محمد عيضة الزهراني',
            text: `"${quoteData.quote}"\n\n- ${quoteData.author}`,
            url: window.location.href
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
                this.showNotification('تم مشاركة الاقتباس بنجاح', 'success');
            } else {
                // Fallback: copy to clipboard
                await this.copyToClipboard(shareData.text);
                this.showNotification('تم نسخ الاقتباس إلى الحافظة', 'success');
            }
        } catch (error) {
            console.error('Share error:', error);
            this.showNotification('فشلت مشاركة الاقتباس', 'error');
        }
    }

    async copyQuote(quoteCard) {
        const quoteData = this.extractQuoteData(quoteCard);
        const textToCopy = `"${quoteData.quote}"\n\n- ${quoteData.author}`;

        try {
            await this.copyToClipboard(textToCopy);
            this.showNotification('تم نسخ الاقتباس إلى الحافظة', 'success');
        } catch (error) {
            console.error('Copy error:', error);
            this.showNotification('فشل نسخ الاقتباس', 'error');
        }
    }

    async copyToClipboard(text) {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            try {
                document.execCommand('copy');
            } catch (error) {
                console.error('Fallback copy failed:', error);
                throw error;
            } finally {
                document.body.removeChild(textArea);
            }
        }
    }

    showRandomQuote() {
        if (this.quotesData.length === 0) {
            this.showNotification('لا توجد اقتباسات متاحة', 'warning');
            return;
        }

        const randomIndex = Math.floor(Math.random() * this.quotesData.length);
        const randomQuote = this.quotesData[randomIndex];
        
        this.displayQuoteModal(randomQuote);
    }

    displayQuoteModal(quoteData) {
        // Create quote modal if it doesn't exist
        if (!document.querySelector('.quote-modal')) {
            this.createQuoteModal();
        }

        const modal = document.querySelector('.quote-modal');
        this.populateQuoteModal(modal, quoteData);
        this.showModal(modal);
    }

    createQuoteModal() {
        const modalHTML = `
            <div class="quote-modal" id="quoteModal">
                <div class="quote-modal-content">
                    <div class="quote-modal-header">
                        <h3>اقتباس عشوائي</h3>
                        <button class="quote-modal-close" id="quoteModalClose">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="quote-modal-body">
                        <div class="quote-content">
                            <blockquote id="modalQuoteText"></blockquote>
                            <cite id="modalQuoteAuthor"></cite>
                        </div>
                        <div class="quote-meta">
                            <span class="quote-category" id="modalQuoteCategory"></span>
                            <p class="quote-context" id="modalQuoteContext"></p>
                        </div>
                    </div>
                    <div class="quote-modal-footer">
                        <button class="btn btn-secondary" id="modalShareQuote">
                            <i class="fas fa-share"></i>
                            مشاركة
                        </button>
                        <button class="btn btn-outline" id="modalCopyQuote">
                            <i class="fas fa-copy"></i>
                            نسخ
                        </button>
                        <button class="btn btn-primary" id="modalAnotherQuote">
                            <i class="fas fa-random"></i>
                            اقتباس آخر
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.setupQuoteModalEvents();
    }

    setupQuoteModalEvents() {
        const modal = document.querySelector('.quote-modal');
        if (!modal) return;

        const closeBtn = modal.querySelector('#quoteModalClose');
        const shareBtn = modal.querySelector('#modalShareQuote');
        const copyBtn = modal.querySelector('#modalCopyQuote');
        const anotherBtn = modal.querySelector('#modalAnotherQuote');

        // Close modal
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hideModal(modal);
            });
        }

        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hideModal(modal);
            }
        });

        // Share quote
        if (shareBtn) {
            shareBtn.addEventListener('click', () => {
                this.shareModalQuote();
            });
        }

        // Copy quote
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                this.copyModalQuote();
            });
        }

        // Another quote
        if (anotherBtn) {
            anotherBtn.addEventListener('click', () => {
                this.showRandomQuote();
            });
        }

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                this.hideModal(modal);
            }
        });
    }

    populateQuoteModal(modal, quoteData) {
        const quoteText = modal.querySelector('#modalQuoteText');
        const quoteAuthor = modal.querySelector('#modalQuoteAuthor');
        const quoteCategory = modal.querySelector('#modalQuoteCategory');
        const quoteContext = modal.querySelector('#modalQuoteContext');

        if (quoteText) quoteText.textContent = quoteData.quote;
        if (quoteAuthor) quoteAuthor.textContent = `- ${quoteData.author}`;
        if (quoteCategory) {
            quoteCategory.textContent = quoteData.category;
            quoteCategory.className = `quote-category category-${quoteData.category}`;
        }
        if (quoteContext) quoteContext.textContent = quoteData.context;

        // Store current quote data for sharing/copying
        modal.currentQuote = quoteData;
    }

    showModal(modal) {
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    hideModal(modal) {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            modal.currentQuote = null;
        }
    }

    async shareModalQuote() {
        const modal = document.querySelector('.quote-modal');
        if (modal && modal.currentQuote) {
            await this.shareQuote(modal.currentQuote);
        }
    }

    async copyModalQuote() {
        const modal = document.querySelector('.quote-modal');
        if (modal && modal.currentQuote) {
            await this.copyQuote(modal.currentQuote);
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = 'notification show';
        notification.textContent = message;
        
        if (type === 'error') {
            notification.style.background = '#e74c3c';
        } else if (type === 'warning') {
            notification.style.background = '#f39c12';
        } else if (type === 'success') {
            notification.style.background = '#27ae60';
        }
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Public methods
    getRandomQuote() {
        if (this.quotesData.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * this.quotesData.length);
        return this.quotesData[randomIndex];
    }

    getQuotesByCategory(category) {
        return this.quotesData.filter(quote => quote.category === category);
    }

    getFeaturedQuotes() {
        return this.quotesData.filter(quote => quote.featured);
    }

    addQuote(quoteData) {
        const newQuote = {
            id: Date.now(),
            ...quoteData
        };
        this.quotesData.push(newQuote);
        return newQuote;
    }

    searchQuotes(query) {
        const lowercaseQuery = query.toLowerCase();
        return this.quotesData.filter(quote => 
            quote.quote.toLowerCase().includes(lowercaseQuery) ||
            quote.author.toLowerCase().includes(lowercaseQuery) ||
            quote.category.toLowerCase().includes(lowercaseQuery) ||
            quote.context.toLowerCase().includes(lowercaseQuery)
        );
    }
}
