// Theme Module
export class Theme {
    constructor() {
        this.themeToggle = document.querySelector('.theme-toggle');
        this.body = document.body;
        this.currentTheme = 'light';
        
        this.init();
    }

    init() {
        this.loadSavedTheme();
        this.setupThemeToggle();
        this.setupSystemThemeDetection();
    }

    loadSavedTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            this.setTheme(savedTheme);
        } else {
            // Check system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.setTheme(prefersDark ? 'dark' : 'light');
        }
    }

    setupThemeToggle() {
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    }

    setupSystemThemeDetection() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        mediaQuery.addEventListener('change', (e) => {
            // Only change theme if user hasn't manually set a preference
            if (!localStorage.getItem('theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        this.saveTheme(newTheme);
    }

    setTheme(theme) {
        this.currentTheme = theme;
        
        // Update body class
        this.body.classList.toggle('dark-theme', theme === 'dark');
        
        // Update icon
        this.updateThemeIcon(theme);
        
        // Update CSS variables if needed
        this.updateCSSVariables(theme);
        
        // Emit custom event
        this.emitThemeChange(theme);
    }

    saveTheme(theme) {
        localStorage.setItem('theme', theme);
    }

    updateThemeIcon(theme) {
        if (this.themeToggle) {
            const icon = this.themeToggle.querySelector('i');
            if (icon) {
                icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
        }
    }

    updateCSSVariables(theme) {
        const root = document.documentElement;
        
        if (theme === 'dark') {
            root.style.setProperty('--bg-light', '#1A0F08');
            root.style.setProperty('--bg-dark', '#FFF8F0');
            root.style.setProperty('--text-light', '#2C1810');
            root.style.setProperty('--text-dark', '#F5E6D3');
            root.style.setProperty('--card-shadow', '0 4px 6px rgba(0, 0, 0, 0.3)');
            root.style.setProperty('--hover-shadow', '0 8px 15px rgba(0, 0, 0, 0.4)');
        } else {
            root.style.setProperty('--bg-light', '#FFF8F0');
            root.style.setProperty('--bg-dark', '#1A0F08');
            root.style.setProperty('--text-light', '#F5E6D3');
            root.style.setProperty('--text-dark', '#2C1810');
            root.style.setProperty('--card-shadow', '0 4px 6px rgba(139, 69, 19, 0.1)');
            root.style.setProperty('--hover-shadow', '0 8px 15px rgba(139, 69, 19, 0.2)');
        }
    }

    emitThemeChange(theme) {
        const event = new CustomEvent('themeChange', {
            detail: { theme }
        });
        document.dispatchEvent(event);
    }

    // Public methods
    getTheme() {
        return this.currentTheme;
    }

    isDarkTheme() {
        return this.currentTheme === 'dark';
    }

    resetTheme() {
        localStorage.removeItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.setTheme(prefersDark ? 'dark' : 'light');
    }
}
