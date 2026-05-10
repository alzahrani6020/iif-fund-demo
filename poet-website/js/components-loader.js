// Components Loader - Dynamically loads HTML components
export class ComponentsLoader {
    constructor() {
        this.components = {
            header: 'components/header.html',
            hero: 'components/hero.html',
            quickAccess: 'components/quick-access.html',
            footer: 'components/footer.html'
        };
        this.loadedComponents = new Map();
    }

    async loadComponent(componentName) {
        // Check if component is already loaded
        if (this.loadedComponents.has(componentName)) {
            return this.loadedComponents.get(componentName);
        }

        const componentPath = this.components[componentName];
        if (!componentPath) {
            console.error(`Component "${componentName}" not found`);
            return '';
        }

        try {
            const response = await fetch(componentPath);
            if (!response.ok) {
                throw new Error(`Failed to load component: ${componentName}`);
            }
            
            const html = await response.text();
            this.loadedComponents.set(componentName, html);
            return html;
        } catch (error) {
            console.error(`Error loading component "${componentName}":`, error);
            return '';
        }
    }

    async loadAllComponents() {
        const componentPromises = Object.keys(this.components).map(name => 
            this.loadComponent(name).then(html => ({ name, html }))
        );

        const results = await Promise.all(componentPromises);
        const componentsMap = {};
        
        results.forEach(({ name, html }) => {
            componentsMap[name] = html;
        });

        return componentsMap;
    }

    async injectComponent(componentName, targetElementId) {
        const targetElement = document.getElementById(targetElementId);
        if (!targetElement) {
            console.error(`Target element "${targetElementId}" not found`);
            return;
        }

        const html = await this.loadComponent(componentName);
        if (html) {
            targetElement.innerHTML = html;
            return true;
        }
        
        return false;
    }

    async injectAllComponents() {
        const components = await this.loadAllComponents();
        
        // Inject header
        const headerElement = document.getElementById('header-component');
        if (headerElement && components.header) {
            headerElement.innerHTML = components.header;
        }

        // Inject hero
        const heroElement = document.getElementById('hero-component');
        if (heroElement && components.hero) {
            heroElement.innerHTML = components.hero;
        }

        // Inject quick access
        const quickAccessElement = document.getElementById('quick-access-component');
        if (quickAccessElement && components.quickAccess) {
            quickAccessElement.innerHTML = components.quickAccess;
        }

        // Inject footer
        const footerElement = document.getElementById('footer-component');
        if (footerElement && components.footer) {
            footerElement.innerHTML = components.footer;
        }

        return components;
    }

    // Method to reload a specific component
    async reloadComponent(componentName) {
        this.loadedComponents.delete(componentName);
        return await this.loadComponent(componentName);
    }

    // Method to get component HTML without loading
    getComponent(componentName) {
        return this.loadedComponents.get(componentName) || '';
    }

    // Clear all loaded components from cache
    clearCache() {
        this.loadedComponents.clear();
    }

    // Get cache status
    getCacheStatus() {
        return {
            totalComponents: Object.keys(this.components).length,
            loadedComponents: this.loadedComponents.size,
            loadedComponentNames: Array.from(this.loadedComponents.keys())
        };
    }
}

// Create global instance
window.componentsLoader = new ComponentsLoader();
