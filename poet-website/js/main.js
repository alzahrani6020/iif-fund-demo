// Main JavaScript Module
import { Navigation } from './modules/navigation.js';
import { Search } from './modules/search.js';
import { Theme } from './modules/theme.js';
import { AudioPlayer } from './modules/audioPlayer.js';
import { VideoPlayer } from './modules/videoPlayer.js';
import { Dictionary } from './modules/dictionary.js';
import { Events } from './modules/events.js';
import { Quotes } from './modules/quotes.js';
import { Contact } from './modules/contact.js';
import { Utils } from './modules/utils.js';

// Main Application Class
class PoetWebsite {
    constructor() {
        this.modules = {};
        this.init();
    }

    async init() {
        try {
            // Initialize modules
            this.modules.navigation = new Navigation();
            this.modules.search = new Search();
            this.modules.theme = new Theme();
            this.modules.audioPlayer = new AudioPlayer();
            this.modules.videoPlayer = new VideoPlayer();
            this.modules.dictionary = new Dictionary();
            this.modules.events = new Events();
            this.modules.quotes = new Quotes();
            this.modules.contact = new Contact();
            this.modules.utils = new Utils();

            // Load data
            await this.loadData();

            // Initialize animations
            this.initAnimations();

            // Initialize lazy loading
            this.initLazyLoading();

            // Initialize loading screen
            this.initLoadingScreen();

            console.log('Poet Website initialized successfully');
        } catch (error) {
            console.error('Error initializing website:', error);
        }
    }

    async loadData() {
        try {
            // Load poems data
            const poemsResponse = await fetch('data/poems.json');
            if (poemsResponse.ok) {
                const poems = await poemsResponse.json();
                this.modules.utils.setData('poems', poems);
            }

            // Load dictionary data
            const dictResponse = await fetch('data/dictionary.json');
            if (dictResponse.ok) {
                const dictionary = await dictResponse.json();
                this.modules.utils.setData('dictionary', dictionary);
            }

            // Load events data
            const eventsResponse = await fetch('data/events.json');
            if (eventsResponse.ok) {
                const events = await eventsResponse.json();
                this.modules.utils.setData('events', events);
            }

            // Load quotes data
            const quotesResponse = await fetch('data/quotes.json');
            if (quotesResponse.ok) {
                const quotes = await quotesResponse.json();
                this.modules.utils.setData('quotes', quotes);
            }

        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    initAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, observerOptions);

        // Observe elements
        const animatedElements = document.querySelectorAll(
            'section, .poem-card, .video-card, .dictionary-card, .event-card, .quote-card, .quick-card'
        );
        animatedElements.forEach(el => observer.observe(el));
    }

    initLazyLoading() {
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

    initLoadingScreen() {
        const loadingScreen = document.querySelector('.loading-screen');
        
        setTimeout(() => {
            if (loadingScreen) {
                loadingScreen.classList.add('hidden');
            }
        }, 2500);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PoetWebsite();
});

// Export for potential external use
window.PoetWebsite = PoetWebsite;
