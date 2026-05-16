// Navigation Module
export class Navigation {
    constructor() {
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.header = document.querySelector('.header');
        this.scrollIndicator = document.querySelector('.scroll-indicator');
        
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.setupActiveLinkHighlighting();
        this.setupScrollEffects();
        this.setupSmoothScrolling();
    }

    setupMobileMenu() {
        if (this.hamburger && this.navMenu) {
            this.hamburger.addEventListener('click', () => {
                this.toggleMobileMenu();
            });

            // Close mobile menu when clicking on a link
            this.navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    this.closeMobileMenu();
                });
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!this.hamburger.contains(e.target) && !this.navMenu.contains(e.target)) {
                    this.closeMobileMenu();
                }
            });
        }
    }

    toggleMobileMenu() {
        this.navMenu.classList.toggle('active');
        this.hamburger.classList.toggle('active');
    }

    closeMobileMenu() {
        this.navMenu.classList.remove('active');
        this.hamburger.classList.remove('active');
    }

    setupActiveLinkHighlighting() {
        const sections = document.querySelectorAll('section[id]');
        
        const updateActiveLink = () => {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (window.scrollY >= (sectionTop - 200)) {
                    current = section.getAttribute('id');
                }
            });
            
            this.navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        };

        // Update on scroll
        window.addEventListener('scroll', updateActiveLink);
        
        // Initial update
        updateActiveLink();
    }

    setupScrollEffects() {
        if (!this.header) return;

        const handleScroll = () => {
            if (window.scrollY > 100) {
                this.header.style.background = 'rgba(255, 248, 240, 0.98)';
                this.header.style.backdropFilter = 'blur(20px)';
            } else {
                this.header.style.background = 'rgba(255, 248, 240, 0.95)';
                this.header.style.backdropFilter = 'blur(10px)';
            }

            // Hide scroll indicator after scrolling
            if (this.scrollIndicator && window.scrollY > 300) {
                this.scrollIndicator.style.opacity = '0';
            } else if (this.scrollIndicator) {
                this.scrollIndicator.style.opacity = '1';
            }
        };

        window.addEventListener('scroll', handleScroll);
    }

    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                
                if (target) {
                    const headerHeight = this.header ? this.header.offsetHeight : 0;
                    const targetPosition = target.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Public methods
    scrollToSection(sectionId) {
        const target = document.querySelector(`#${sectionId}`);
        if (target) {
            const headerHeight = this.header ? this.header.offsetHeight : 0;
            const targetPosition = target.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    setActiveLink(sectionId) {
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });
    }
}
