// Utils Module
export class Utils {
    constructor() {
        this.data = {};
        this.init();
    }

    init() {
        this.setupErrorHandling();
        this.setupPerformanceOptimization();
        this.setupAnalytics();
    }

    // Data Management
    setData(key, value) {
        this.data[key] = value;
    }

    getData(key) {
        return this.data[key] || null;
    }

    removeData(key) {
        delete this.data[key];
    }

    // Local Storage Management
    setLocalStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }

    getLocalStorage(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    }

    removeLocalStorage(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing from localStorage:', error);
        }
    }

    // Session Storage Management
    setSessionStorage(key, value) {
        try {
            sessionStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Error saving to sessionStorage:', error);
        }
    }

    getSessionStorage(key) {
        try {
            const item = sessionStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error reading from sessionStorage:', error);
            return null;
        }
    }

    // API Utilities
    async fetchAPI(url, options = {}) {
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };

        const finalOptions = { ...defaultOptions, ...options };

        try {
            const response = await fetch(url, finalOptions);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API fetch error:', error);
            throw error;
        }
    }

    // Form Utilities
    serializeForm(form) {
        const formData = new FormData(form);
        return Object.fromEntries(formData);
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    validatePhone(phone) {
        const phoneRegex = /^05[0-9]{8}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }

    validateArabicText(text) {
        const arabicRegex = /^[\u0600-\u06FF\s]+$/;
        return arabicRegex.test(text);
    }

    // String Utilities
    sanitizeHTML(str) {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    }

    truncateText(text, maxLength, suffix = '...') {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength - suffix.length) + suffix;
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    slugify(text) {
        return text
            .toLowerCase()
            .replace(/[\s\W-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    // Date Utilities
    formatDate(date, options = {}) {
        const defaultOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
        };

        return date.toLocaleDateString('ar-SA', { ...defaultOptions, ...options });
    }

    formatTime(date) {
        return date.toLocaleTimeString('ar-SA', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    formatDateTime(date) {
        return `${this.formatDate(date)} ${this.formatTime(date)}`;
    }

    timeAgo(date) {
        const seconds = Math.floor((new Date() - date) / 1000);

        const intervals = {
            سنة: 31536000,
            شهر: 2592000,
            أسبوع: 604800,
            يوم: 86400,
            ساعة: 3600,
            دقيقة: 60
        };

        for (const [unit, secondsInUnit] of Object.entries(intervals)) {
            const interval = Math.floor(seconds / secondsInUnit);
            if (interval >= 1) {
                return `منذ ${interval} ${unit}`;
            }
        }

        return 'منذ لحظات';
    }

    // Number Utilities
    formatNumber(num) {
        return new Intl.NumberFormat('ar-SA').format(num);
    }

    formatCurrency(amount, currency = 'SAR') {
        return new Intl.NumberFormat('ar-SA', {
            style: 'currency',
            currency: currency
        }).format(amount);
    }

    randomBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Array Utilities
    shuffle(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    unique(array) {
        return [...new Set(array)];
    }

    groupBy(array, key) {
        return array.reduce((groups, item) => {
            const group = item[key];
            groups[group] = groups[group] || [];
            groups[group].push(item);
            return groups;
        }, {});
    }

    // DOM Utilities
    createElement(tag, className = '', innerHTML = '') {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (innerHTML) element.innerHTML = innerHTML;
        return element;
    }

    findParent(element, selector) {
        let parent = element.parentElement;
        while (parent) {
            if (parent.matches(selector)) return parent;
            parent = parent.parentElement;
        }
        return null;
    }

    scrollToElement(element, offset = 0) {
        const elementPosition = element.offsetTop - offset;
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    }

    // Animation Utilities
    animate(element, keyframes, options = {}) {
        return element.animate(keyframes, {
            duration: 300,
            easing: 'ease-in-out',
            fill: 'forwards',
            ...options
        });
    }

    fadeIn(element, duration = 300) {
        return this.animate(element, [
            { opacity: 0 },
            { opacity: 1 }
        ], { duration });
    }

    fadeOut(element, duration = 300) {
        return this.animate(element, [
            { opacity: 1 },
            { opacity: 0 }
        ], { duration });
    }

    slideIn(element, direction = 'right', duration = 300) {
        const startTransform = direction === 'right' ? 'translateX(100%)' : 'translateX(-100%)';
        return this.animate(element, [
            { transform: startTransform },
            { transform: 'translateX(0)' }
        ], { duration });
    }

    // Debounce and Throttle
    debounce(func, wait) {
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

    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Performance
    setupPerformanceOptimization() {
        // Lazy loading for images
        this.setupLazyLoading();

        // Intersection Observer for animations
        this.setupIntersectionObserver();

        // Resize observer
        this.setupResizeObserver();
    }

    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    setupIntersectionObserver() {
        // This is used by other modules for scroll animations
        if (!window.intersectionObserverInstance) {
            window.intersectionObserverInstance = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, {
                threshold: 0.1
            });
        }
    }

    setupResizeObserver() {
        if (!window.resizeObserverInstance && 'ResizeObserver' in window) {
            window.resizeObserverInstance = new ResizeObserver((entries) => {
                entries.forEach(entry => {
                    // Handle resize events
                    if (entry.target.onResize) {
                        entry.target.onResize(entry);
                    }
                });
            });
        }
    }

    // Error Handling
    setupErrorHandling() {
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            this.logError(event.error);
        });

        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.logError(event.reason);
        });
    }

    logError(error) {
        // In production, this would send errors to a logging service
        const errorData = {
            message: error.message,
            stack: error.stack,
            url: window.location.href,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
        };

        console.error('Error logged:', errorData);
    }

    // Analytics
    setupAnalytics() {
        // Track page views
        this.trackPageView();

        // Track user interactions
        this.setupInteractionTracking();
    }

    trackPageView() {
        // In production, this would send data to analytics service
        console.log('Page view tracked:', {
            page: window.location.pathname,
            title: document.title,
            timestamp: new Date().toISOString()
        });
    }

    setupInteractionTracking() {
        // Track button clicks
        document.addEventListener('click', (event) => {
            const target = event.target.closest('button, a, .clickable');
            if (target) {
                this.trackInteraction('click', target);
            }
        });

        // Track form submissions
        document.addEventListener('submit', (event) => {
            const form = event.target;
            if (form.tagName === 'FORM') {
                this.trackInteraction('form_submit', form);
            }
        });
    }

    trackInteraction(type, element) {
        // In production, this would send data to analytics service
        console.log('Interaction tracked:', {
            type,
            element: element.tagName,
            className: element.className,
            id: element.id,
            text: element.textContent?.trim(),
            timestamp: new Date().toISOString()
        });
    }

    // Device Detection
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    isTablet() {
        return /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent);
    }

    isDesktop() {
        return !this.isMobile() && !this.isTablet();
    }

    isIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent);
    }

    isAndroid() {
        return /Android/.test(navigator.userAgent);
    }

    // Browser Detection
    getBrowser() {
        const userAgent = navigator.userAgent;
        
        if (userAgent.indexOf('Chrome') > -1) return 'Chrome';
        if (userAgent.indexOf('Safari') > -1) return 'Safari';
        if (userAgent.indexOf('Firefox') > -1) return 'Firefox';
        if (userAgent.indexOf('Edge') > -1) return 'Edge';
        if (userAgent.indexOf('MSIE') > -1) return 'Internet Explorer';
        
        return 'Unknown';
    }

    // URL Utilities
    getURLParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    setURLParameter(name, value) {
        const url = new URL(window.location);
        url.searchParams.set(name, value);
        window.history.replaceState({}, '', url);
    }

    removeURLParameter(name) {
        const url = new URL(window.location);
        url.searchParams.delete(name);
        window.history.replaceState({}, '', url);
    }

    // Copy to Clipboard
    async copyToClipboard(text) {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
                return true;
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
                
                const successful = document.execCommand('copy');
                document.body.removeChild(textArea);
                
                return successful;
            }
        } catch (error) {
            console.error('Copy to clipboard failed:', error);
            return false;
        }
    }

    // Download File
    downloadFile(content, filename, type = 'text/plain') {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
    }

    // Generate ID
    generateId(prefix = '') {
        return prefix + Math.random().toString(36).substr(2, 9);
    }

    // Public utility methods
    showNotification(message, type = 'info', duration = 3000) {
        const notification = this.createElement('div', 'notification show', message);
        
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
        }, duration);
    }

    // Cleanup
    cleanup() {
        // Clean up any global references
        if (window.intersectionObserverInstance) {
            window.intersectionObserverInstance.disconnect();
        }
        
        if (window.resizeObserverInstance) {
            window.resizeObserverInstance.disconnect();
        }
    }
}

// Create global instance
window.utils = new Utils();
