// Dictionary Module
export class Dictionary {
    constructor() {
        this.dictionarySearch = document.querySelector('.dictionary-search input');
        this.searchBtn = document.querySelector('.search-btn');
        this.dictionaryCards = document.querySelectorAll('.dictionary-card');
        this.dictionaryData = [];
        
        this.init();
    }

    init() {
        this.setupSearch();
        this.setupAudioButtons();
        this.loadDictionaryData();
        this.setupAdvancedSearch();
    }

    setupSearch() {
        if (this.searchBtn && this.dictionarySearch) {
            this.searchBtn.addEventListener('click', () => {
                this.performSearch();
            });
        }

        if (this.dictionarySearch) {
            // Real-time search
            let searchTimeout;
            this.dictionarySearch.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.performSearch();
                }, 300);
            });

            // Search on Enter
            this.dictionarySearch.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch();
                }
            });
        }
    }

    setupAudioButtons() {
        const audioButtons = document.querySelectorAll('.btn-audio-pronunciation');
        audioButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.playPronunciation(button);
            });
        });
    }

    async loadDictionaryData() {
        try {
            // Try to load from data file
            const response = await fetch('data/dictionary.json');
            if (response.ok) {
                this.dictionaryData = await response.json();
            } else {
                // Use sample data if file doesn't exist
                this.dictionaryData = this.getSampleData();
            }
        } catch (error) {
            console.error('Error loading dictionary data:', error);
            this.dictionaryData = this.getSampleData();
        }
    }

    setupAdvancedSearch() {
        const searchInput = this.dictionarySearch;
        if (!searchInput) return;

        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const query = e.target.value.trim();
            
            if (query.length > 0) {
                searchTimeout = setTimeout(() => {
                    this.performAdvancedSearch(query);
                    this.showSuggestions(query);
                }, 300);
            } else {
                this.clearSuggestions();
                this.filterDictionary('');
            }
        });

        // Setup suggestions container
        this.setupSuggestionsContainer();
    }

    setupSuggestionsContainer() {
        const suggestionsHTML = `
            <div class="search-suggestions" id="searchSuggestions">
                <div class="suggestions-list" id="suggestionsList"></div>
            </div>
        `;
        
        // Insert suggestions container after search input
        const searchContainer = document.querySelector('.dictionary-search');
        if (searchContainer && !document.getElementById('searchSuggestions')) {
            searchContainer.insertAdjacentHTML('beforeend', suggestionsHTML);
        }
    }

    showSuggestions(query) {
        const suggestionsList = document.getElementById('suggestionsList');
        if (!suggestionsList) return;

        const suggestions = this.getSuggestions(query);
        
        if (suggestions.length === 0) {
            this.clearSuggestions();
            return;
        }

        const suggestionsHTML = suggestions.map(word => `
            <div class="suggestion-item" data-word="${word.word}">
                <div class="suggestion-word">${word.word}</div>
                <div class="suggestion-meaning">${word.meaning.substring(0, 50)}...</div>
                <div class="suggestion-type">${word.type}</div>
            </div>
        `).join('');

        suggestionsList.innerHTML = suggestionsHTML;
        
        // Add click handlers to suggestions
        suggestionsList.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
                const word = item.dataset.word;
                this.selectWord(word);
            });
        });
    }

    clearSuggestions() {
        const suggestionsList = document.getElementById('suggestionsList');
        if (suggestionsList) {
            suggestionsList.innerHTML = '';
        }
    }

    getSuggestions(query) {
        if (!query || query.length < 2) return [];
        
        return this.dictionaryData
            .filter(word => 
                word.word.toLowerCase().includes(query.toLowerCase()) ||
                word.meaning.toLowerCase().includes(query.toLowerCase())
            )
            .slice(0, 5); // Limit to 5 suggestions
    }

    selectWord(word) {
        if (this.dictionarySearch) {
            this.dictionarySearch.value = word;
        }
        this.clearSuggestions();
        this.filterDictionary(word);
        this.highlightWord(word);
    }

    highlightWord(word) {
        // Remove previous highlights
        document.querySelectorAll('.dictionary-card').forEach(card => {
            card.classList.remove('highlighted');
        });

        // Add highlight to selected word
        const cards = document.querySelectorAll('.dictionary-card');
        cards.forEach(card => {
            const wordElement = card.querySelector('.arabic-word');
            if (wordElement && wordElement.textContent === word) {
                card.classList.add('highlighted');
                card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    }

    performAdvancedSearch(query) {
        const results = this.searchDictionary(query);
        this.displaySearchResults(results, query);
    }

    searchDictionary(query) {
        if (!query) return [];
        
        const lowercaseQuery = query.toLowerCase();
        
        return this.dictionaryData.filter(word => {
            return word.word.toLowerCase().includes(lowercaseQuery) ||
                   word.meaning.toLowerCase().includes(lowercaseQuery) ||
                   (word.examples && word.examples.some(example => 
                       example.toLowerCase().includes(lowercaseQuery)
                   ));
        });
    }

    displaySearchResults(results, query) {
        const cards = document.querySelectorAll('.dictionary-card');
        let foundCount = 0;
        
        cards.forEach(card => {
            const word = card.querySelector('.arabic-word')?.textContent;
            const meaning = card.querySelector('.word-meaning')?.textContent;
            
            const matches = results.some(result => 
                result.word === word || result.meaning === meaning
            );
            
            if (matches) {
                card.style.display = 'block';
                card.classList.add('fade-in', 'search-result');
                foundCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // Show search summary
        this.showSearchSummary(foundCount, query);
    }

    showSearchSummary(count, query) {
        let summaryElement = document.getElementById('searchSummary');
        
        if (!summaryElement) {
            summaryElement = document.createElement('div');
            summaryElement.id = 'searchSummary';
            summaryElement.className = 'search-summary';
            
            const searchContainer = document.querySelector('.dictionary-search');
            if (searchContainer) {
                searchContainer.appendChild(summaryElement);
            }
        }
        
        if (query) {
            summaryElement.innerHTML = `
                <div class="summary-content">
                    <i class="fas fa-search"></i>
                    <span>تم العثور على ${count} نتيجة لـ "${query}"</span>
                    <button class="clear-search" onclick="document.querySelector('.dictionary-search input').value = ''; document.querySelector('.dictionary-search input').dispatchEvent(new Event('input'));">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            summaryElement.style.display = 'block';
        } else {
            summaryElement.style.display = 'none';
        }
    }

    getSimilarWords(word) {
        if (!word) return [];
        
        const currentWord = this.getWordData(word);
        if (!currentWord) return [];
        
        // Find words with same type
        const sameType = this.dictionaryData.filter(w => 
            w.type === currentWord.type && w.word !== word
        );
        
        // Find words with similar meaning
        const similarMeaning = this.dictionaryData.filter(w => 
            w.meaning.toLowerCase().includes(currentWord.meaning.toLowerCase().substring(0, 20)) &&
            w.word !== word
        );
        
        // Combine and remove duplicates
        const similar = [...sameType, ...similarMeaning];
        return this.uniqueArray(similar).slice(0, 3);
    }

    uniqueArray(array) {
        return array.filter((item, index) => 
            array.findIndex(i => i.word === item.word) === index
        );
    }

    showSimilarWords(word) {
        const similar = this.getSimilarWords(word);
        if (similar.length === 0) return;
        
        const card = this.findWordCard(word);
        if (!card) return;
        
        let similarContainer = card.querySelector('.similar-words');
        if (!similarContainer) {
            similarContainer = document.createElement('div');
            similarContainer.className = 'similar-words';
            card.appendChild(similarContainer);
        }
        
        similarContainer.innerHTML = `
            <h4><i class="fas fa-lightbulb"></i> كلمات مشابهة</h4>
            <div class="similar-words-list">
                ${similar.map(similarWord => `
                    <div class="similar-word-item" onclick="window.dictionaryModule.selectWord('${similarWord.word}')">
                        <span class="similar-word">${similarWord.word}</span>
                        <span class="similar-type">${similarWord.type}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    getSampleData() {
        return [
            {
                id: 1,
                word: 'زهراني',
                meaning: 'نسبة إلى منطقة زهران في جنوب السعودية، وتشمل قبائل زهران العريقة',
                type: 'اسم',
                pronunciation: 'zah-ra-ni',
                examples: ['قال الشاعر الزهراني', 'لهجة زهرانية أصيلة']
            },
            {
                id: 2,
                word: 'شَعَار',
                meaning: 'المعيب أو العيب، ويستخدم للدلالة على الشيء غير المقبول اجتماعياً',
                type: 'اسم',
                pronunciation: 'sha-aar',
                examples: ['هذا العمل شَعَار', 'لا تفعل شيئاً شَعَاراً']
            },
            {
                id: 3,
                word: 'حَبَّار',
                meaning: 'الشجاع أو الشجاعة، ويستخدم لوصف الشخص المقدام',
                type: 'صفة',
                pronunciation: 'hab-baar',
                examples: ['رجل حَبَّار', 'كان حَبَّاراً في المعركة']
            },
            {
                id: 4,
                word: 'غَنَّاء',
                meaning: 'الخصب والكثرة، ويستخدم لوصف المكان المزدهر',
                type: 'صفة',
                pronunciation: 'ghan-naa',
                examples: ['أرض غَنَّاء', 'حياة غَنَّاء بالخير']
            },
            {
                id: 5,
                word: 'سَمَار',
                meaning: 'السمر أو الجلوس ليلاً للحديث والسمر',
                type: 'اسم',
                pronunciation: 'sa-maar',
                examples: ['جلسنا في سَمَار لطيف', 'أحب السَمَار مع الأصدقاء']
            }
        ];
    }

    performSearch() {
        const searchTerm = this.dictionarySearch ? this.dictionarySearch.value.trim().toLowerCase() : '';
        this.filterDictionary(searchTerm);
    }

    filterDictionary(searchTerm) {
        const cards = document.querySelectorAll('.dictionary-card');
        
        cards.forEach(card => {
            const word = card.querySelector('.arabic-word')?.textContent.toLowerCase();
            const meaning = card.querySelector('.word-meaning')?.textContent.toLowerCase();
            
            const shouldShow = searchTerm === '' || 
                             (word && word.includes(searchTerm)) || 
                             (meaning && meaning.includes(searchTerm));
            
            if (shouldShow) {
                card.style.display = 'block';
                card.classList.add('fade-in');
            } else {
                card.style.display = 'none';
            }
        });

        // Show no results message if needed
        this.showNoResultsMessage(searchTerm, cards);
    }

    showNoResultsMessage(searchTerm, cards) {
        const visibleCards = Array.from(cards).filter(card => card.style.display !== 'none');
        const dictionarySection = document.querySelector('.dictionary');
        let noResultsMsg = dictionarySection.querySelector('.no-results-message');

        if (searchTerm && visibleCards.length === 0) {
            if (!noResultsMsg) {
                noResultsMsg = document.createElement('div');
                noResultsMsg.className = 'no-results-message';
                noResultsMsg.innerHTML = `
                    <div class="no-results-content">
                        <i class="fas fa-search"></i>
                        <h3>لم يتم العثور على نتائج</h3>
                        <p>لم نجد كلمات تطابق "${searchTerm}"</p>
                        <button class="btn btn-outline" onclick="document.querySelector('.dictionary-search input').value = ''; document.querySelector('.dictionary-search input').dispatchEvent(new Event('input'));">
                            <i class="fas fa-times"></i>
                            مسح البحث
                        </button>
                    </div>
                `;
                dictionarySection.appendChild(noResultsMsg);
            }
        } else if (noResultsMsg) {
            noResultsMsg.remove();
        }
    }

    playPronunciation(button) {
        const card = button.closest('.dictionary-card');
        const word = card ? card.querySelector('.arabic-word')?.textContent : '';
        
        if (!word) return;

        // Show loading state
        const originalIcon = button.querySelector('i').className;
        button.querySelector('i').className = 'fas fa-spinner fa-spin';
        button.disabled = true;

        // Try to use speech synthesis with enhanced settings
        if ('speechSynthesis' in window) {
            // Get available voices
            const voices = speechSynthesis.getVoices();
            const arabicVoice = voices.find(voice => 
                voice.lang.startsWith('ar') || 
                voice.name.includes('Arabic') ||
                voice.name.includes('Saudi')
            ) || voices[0]; // Fallback to first voice

            const utterance = new SpeechSynthesisUtterance(word);
            utterance.voice = arabicVoice;
            utterance.lang = 'ar-SA';
            utterance.rate = 0.7; // Slightly slower for clarity
            utterance.pitch = 1.0;
            utterance.volume = 1.0;
            
            utterance.onstart = () => {
                button.classList.add('playing');
            };
            
            utterance.onend = () => {
                button.querySelector('i').className = originalIcon;
                button.disabled = false;
                button.classList.remove('playing');
                
                // Show similar words after pronunciation
                this.showSimilarWords(word);
            };
            
            utterance.onerror = (error) => {
                console.error('Speech synthesis error:', error);
                this.fallbackToAudio(word, button, originalIcon);
            };
            
            // Cancel any previous speech
            speechSynthesis.cancel();
            speechSynthesis.speak(utterance);
        } else {
            this.fallbackToAudio(word, button, originalIcon);
        }
    }

    fallbackToAudio(word, button, originalIcon) {
        // Try to load audio file
        const audio = new Audio(`assets/audio/pronunciations/${word}.mp3`);
        
        audio.onended = () => {
            button.querySelector('i').className = originalIcon;
            button.disabled = false;
        };
        
        audio.onerror = () => {
            button.querySelector('i').className = originalIcon;
            button.disabled = false;
            this.showNotification(`لا يتوفر نطق صوتي لكلمة "${word}"`, 'warning');
        };
        
        audio.play().catch(error => {
            button.querySelector('i').className = originalIcon;
            button.disabled = false;
            this.showNotification(`لا يتوفر نطق صوتي لكلمة "${word}"`, 'warning');
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = 'notification show';
        notification.textContent = message;
        
        if (type === 'error') {
            notification.style.background = '#e74c3c';
        } else if (type === 'warning') {
            notification.style.background = '#f39c12';
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
    searchWord(word) {
        if (this.dictionarySearch) {
            this.dictionarySearch.value = word;
            this.performSearch();
        }
    }

    getWordData(word) {
        return this.dictionaryData.find(item => 
            item.word.toLowerCase() === word.toLowerCase()
        );
    }

    getRandomWord() {
        if (this.dictionaryData.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * this.dictionaryData.length);
        return this.dictionaryData[randomIndex];
    }

    addWord(wordData) {
        const newWord = {
            id: Date.now(),
            ...wordData
        };
        this.dictionaryData.push(newWord);
        return newWord;
    }

    getWordsByType(type) {
        return this.dictionaryData.filter(item => item.type === type);
    }

    getWordsByLetter(letter) {
        return this.dictionaryData.filter(item => 
            item.word.startsWith(letter)
        );
    }
}
