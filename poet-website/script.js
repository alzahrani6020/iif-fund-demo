// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all functionality
    initializeNavigation();
    initializeScrollEffects();
    initializeAnimations();
    initializeThemeToggle();
    initializeSearch();
    initializePoemFilters();
    initializeAudioPlayer();
    initializeVideoPlayer();
    initializeContactForm();
    initializeNewsletter();
    initializeModals();
    initializeLoadingScreen();
    initializeDictionary();
    initializeEvents();
    initializeQuotes();
    initializeStats();
    
});

// Navigation functionality
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
    
    // Active link highlighting based on scroll position
    window.addEventListener('scroll', function() {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

// Scroll effects
function initializeScrollEffects() {
    const header = document.querySelector('.header');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    window.addEventListener('scroll', function() {
        // Header background on scroll
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 248, 240, 0.98)';
            header.style.backdropFilter = 'blur(20px)';
        } else {
            header.style.background = 'rgba(255, 248, 240, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        }
        
        // Hide scroll indicator after scrolling
        if (scrollIndicator && window.scrollY > 300) {
            scrollIndicator.style.opacity = '0';
        } else if (scrollIndicator) {
            scrollIndicator.style.opacity = '1';
        }
    });
}

// Animations on scroll
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe all sections and cards
    const animatedElements = document.querySelectorAll('section, .poem-card, .video-card, .dictionary-card, .event-card, .quote-card, .quick-card');
    animatedElements.forEach(el => observer.observe(el));
}

// Theme toggle (light/dark mode)
function initializeThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.classList.toggle('dark-theme', savedTheme === 'dark');
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            body.classList.toggle('dark-theme');
            const currentTheme = body.classList.contains('dark-theme') ? 'dark' : 'light';
            localStorage.setItem('theme', currentTheme);
            
            // Update icon
            const icon = this.querySelector('i');
            if (icon) {
                icon.className = currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
        });
    }
}

// Search functionality
function initializeSearch() {
    const searchToggle = document.querySelector('.search-toggle');
    const searchOverlay = document.querySelector('.search-overlay');
    const searchClose = document.querySelector('.search-close');
    const searchInput = document.querySelector('.search-input');
    const searchForm = document.querySelector('.search-form');
    
    if (searchToggle && searchOverlay) {
        searchToggle.addEventListener('click', function() {
            searchOverlay.classList.add('active');
            if (searchInput) searchInput.focus();
        });
    }
    
    if (searchClose && searchOverlay) {
        searchClose.addEventListener('click', function() {
            searchOverlay.classList.remove('active');
        });
    }
    
    // Close search on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && searchOverlay) {
            searchOverlay.classList.remove('active');
        }
    });
    
    // Search form submission
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const query = searchInput ? searchInput.value.trim() : '';
            if (query) {
                performSearch(query);
            }
        });
    }
}

// Perform search function
function performSearch(query) {
    const filters = {
        poems: document.getElementById('filter-poems')?.checked || false,
        videos: document.getElementById('filter-videos')?.checked || false,
        audio: document.getElementById('filter-audio')?.checked || false,
        dictionary: document.getElementById('filter-dictionary')?.checked || false,
        quotes: document.getElementById('filter-quotes')?.checked || false
    };
    
    // If no filters selected, search all
    const searchAll = !Object.values(filters).some(Boolean);
    
    console.log('Searching for:', query, 'Filters:', filters);
    
    // Show notification
    showNotification('جاري البحث... يرجى الانتظار');
    
    // Simulate search delay
    setTimeout(() => {
        const resultsCount = Math.floor(Math.random() * 20) + 1;
        showNotification(`تم العثور على ${resultsCount} نتيجة لـ "${query}"`);
        // Here you would typically update the search results
    }, 1500);
}

// Poem filters
function initializePoemFilters() {
    const filterButtons = document.querySelectorAll('.tab-btn');
    const poemCards = document.querySelectorAll('.poem-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            poemCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                    setTimeout(() => card.classList.add('fade-in'), 10);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Audio player functionality
function initializeAudioPlayer() {
    const playPauseBtn = document.querySelector('.play-pause');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const progressBar = document.querySelector('.progress-bar');
    const progress = document.querySelector('.progress');
    const playlistItems = document.querySelectorAll('.playlist-item');
    const currentTimeEl = document.querySelector('.current-time');
    const totalTimeEl = document.querySelector('.total-time');
    
    let isPlaying = false;
    let currentTrack = 0;
    let currentTime = 0;
    let duration = 180; // 3 minutes default
    
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', function() {
            isPlaying = !isPlaying;
            const icon = this.querySelector('i');
            if (icon) {
                icon.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
            }
            
            if (isPlaying) {
                simulatePlayback();
            }
        });
    }
    
    if (progressBar) {
        progressBar.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            currentTime = duration * percent;
            if (progress) progress.style.width = (percent * 100) + '%';
            updateTimeDisplay();
        });
    }
    
    // Playlist functionality
    playlistItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            playlistItems.forEach(i => i.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
            currentTrack = index;
            currentTime = 0;
            
            // Auto play if not playing
            if (!isPlaying && playPauseBtn) {
                playPauseBtn.click();
            }
        });
    });
    
    function simulatePlayback() {
        if (isPlaying && currentTime < duration) {
            currentTime += 0.1;
            const percent = (currentTime / duration) * 100;
            if (progress) progress.style.width = percent + '%';
            updateTimeDisplay();
            
            requestAnimationFrame(simulatePlayback);
        } else if (currentTime >= duration) {
            // Auto play next track
            if (nextBtn) nextBtn.click();
        }
    }
    
    function updateTimeDisplay() {
        if (currentTimeEl) currentTimeEl.textContent = formatTime(currentTime);
        if (totalTimeEl) totalTimeEl.textContent = formatTime(duration);
    }
    
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    // Initialize time display
    updateTimeDisplay();
}

// Video player functionality
function initializeVideoPlayer() {
    const playButtons = document.querySelectorAll('.play-button');
    
    playButtons.forEach(button => {
        button.addEventListener('click', function() {
            const videoCard = this.closest('.video-card');
            const videoTitle = videoCard.querySelector('.video-title')?.textContent;
            
            // Show notification
            showNotification(`جاري تشغيل الفيديو: ${videoTitle}`);
            
            // Here you would typically open a video modal or navigate to video page
        });
    });
}

// Dictionary functionality
function initializeDictionary() {
    const dictionarySearch = document.querySelector('.dictionary-search input');
    const searchBtn = document.querySelector('.search-btn');
    const dictionaryCards = document.querySelectorAll('.dictionary-card');
    
    if (searchBtn && dictionarySearch) {
        searchBtn.addEventListener('click', function() {
            const searchTerm = dictionarySearch.value.trim().toLowerCase();
            filterDictionary(searchTerm);
        });
    }
    
    if (dictionarySearch) {
        dictionarySearch.addEventListener('input', function() {
            const searchTerm = this.value.trim().toLowerCase();
            filterDictionary(searchTerm);
        });
    }
    
    function filterDictionary(searchTerm) {
        dictionaryCards.forEach(card => {
            const word = card.querySelector('.arabic-word')?.textContent.toLowerCase();
            const meaning = card.querySelector('.word-meaning')?.textContent.toLowerCase();
            
            if (searchTerm === '' || word.includes(searchTerm) || meaning.includes(searchTerm)) {
                card.style.display = 'block';
                card.classList.add('fade-in');
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    // Audio pronunciation buttons
    const audioButtons = document.querySelectorAll('.btn-audio-pronunciation');
    audioButtons.forEach(button => {
        button.addEventListener('click', function() {
            const word = this.closest('.dictionary-card').querySelector('.arabic-word')?.textContent;
            showNotification(`جاري تشغيل نطق كلمة "${word}"`);
        });
    });
}

// Events functionality
function initializeEvents() {
    const bookButtons = document.querySelectorAll('.btn-book-event');
    
    bookButtons.forEach(button => {
        button.addEventListener('click', function() {
            const eventCard = this.closest('.event-card');
            const eventTitle = eventCard.querySelector('.event-title')?.textContent;
            
            showNotification(`تم حجز مقعدك في "${eventTitle}" بنجاح!`);
        });
    });
}

// Quotes functionality
function initializeQuotes() {
    const shareButtons = document.querySelectorAll('.btn-share-quote');
    const copyButtons = document.querySelectorAll('.btn-copy-quote');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', function() {
            const quoteCard = this.closest('.quote-card');
            const quote = quoteCard.querySelector('blockquote')?.textContent;
            
            if (navigator.share) {
                navigator.share({
                    title: 'اقتباس من محمد عيضة الزهراني',
                    text: quote
                });
            } else {
                // Fallback: copy to clipboard
                copyToClipboard(quote);
                showNotification('تم نسخ الاقتباس إلى الحافظة');
            }
        });
    });
    
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const quoteCard = this.closest('.quote-card');
            const quote = quoteCard.querySelector('blockquote')?.textContent;
            
            copyToClipboard(quote);
            showNotification('تم نسخ الاقتباس إلى الحافظة');
        });
    });
}

// Stats animation
function initializeStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = parseInt(target.textContent);
                animateNumber(target, 0, finalValue, 2000);
                observer.unobserve(target);
            }
        });
    });
    
    statNumbers.forEach(stat => observer.observe(stat));
}

function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const currentValue = Math.floor(start + (end - start) * progress);
        element.textContent = currentValue;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// Contact form
function initializeContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Basic validation
            if (!data.name || !data.email || !data.message) {
                showNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
                return;
            }
            
            if (!isValidEmail(data.email)) {
                showNotification('يرجى إدخال بريد إلكتروني صحيح', 'error');
                return;
            }
            
            // Show success message
            showNotification('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.');
            this.reset();
        });
    }
}

// Newsletter subscription
function initializeNewsletter() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput ? emailInput.value.trim() : '';
            
            if (!email) {
                showNotification('يرجى إدخال البريد الإلكتروني', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('يرجى إدخال بريد إلكتروني صحيح', 'error');
                return;
            }
            
            // Show success message
            showNotification('تم الاشتراك في النشرة البريدية بنجاح!');
            this.reset();
        });
    }
}

// Modal functionality
function initializeModals() {
    const modal = document.querySelector('.modal');
    const modalClose = document.querySelector('.modal-close');
    const readMoreButtons = document.querySelectorAll('.btn-read-more');
    
    // Open modal for poem details
    readMoreButtons.forEach(button => {
        button.addEventListener('click', function() {
            const poemCard = this.closest('.poem-card');
            const poemTitle = poemCard.querySelector('.poem-meta h3')?.textContent;
            const poemContent = poemCard.querySelector('.poem-excerpt')?.textContent;
            
            if (modal) {
                const modalTitle = modal.querySelector('.modal-header h2');
                const modalBody = modal.querySelector('.poem-full-content');
                
                if (modalTitle) modalTitle.textContent = poemTitle;
                if (modalBody) modalBody.textContent = poemContent;
                
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    // Close modal
    if (modalClose) {
        modalClose.addEventListener('click', function() {
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Close modal on outside click
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Close modal on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Loading screen
function initializeLoadingScreen() {
    const loadingScreen = document.querySelector('.loading-screen');
    const loadingBar = document.querySelector('.loading-bar::after');
    
    // Hide loading screen after page loads
    setTimeout(() => {
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
    }, 2500);
}

// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    }
}

function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => {
        if (notif.parentNode) {
            notif.parentNode.removeChild(notif);
        }
    });
    
    const notification = document.createElement('div');
    notification.className = 'notification show';
    notification.textContent = message;
    
    // Add different styles for different types
    if (type === 'error') {
        notification.style.background = '#e74c3c';
    } else if (type === 'warning') {
        notification.style.background = '#f39c12';
    } else {
        notification.style.background = 'var(--primary-color)';
    }
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
            const targetPosition = target.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Lazy loading for images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
initializeLazyLoading();

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll events
const debouncedScroll = debounce(function() {
    // Scroll-based animations and effects
}, 10);

window.addEventListener('scroll', debouncedScroll);

// Error handling for media elements
document.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="%23ddd"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999">صورة غير متوفرة</text></svg>';
    }
}, true);

// Service Worker registration for PWA functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('SW registered: ', registration);
            })
            .catch(function(registrationError) {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
