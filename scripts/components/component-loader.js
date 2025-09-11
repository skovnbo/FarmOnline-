// Component Loader System
class ComponentLoader {
    constructor() {
        this.componentCache = new Map();
        this.loadingPromises = new Map();
    }

    // Load a component from the components directory
    async loadComponent(componentPath) {
        // Check cache first
        if (this.componentCache.has(componentPath)) {
            return this.componentCache.get(componentPath);
        }

        // Check if already loading
        if (this.loadingPromises.has(componentPath)) {
            return this.loadingPromises.get(componentPath);
        }

        // Create loading promise
        const loadPromise = this.fetchComponent(componentPath);
        this.loadingPromises.set(componentPath, loadPromise);

        try {
            const content = await loadPromise;
            this.componentCache.set(componentPath, content);
            this.loadingPromises.delete(componentPath);
            return content;
        } catch (error) {
            this.loadingPromises.delete(componentPath);
            throw error;
        }
    }

    // Fetch component content
    async fetchComponent(componentPath) {
        try {
            const response = await fetch(`./components/${componentPath}`);
            if (!response.ok) {
                throw new Error(`Failed to load component: ${componentPath}`);
            }
            return await response.text();
        } catch (error) {
            console.error(`Error loading component ${componentPath}:`, error);
            return `<div class="error">Error loading component: ${componentPath}</div>`;
        }
    }

    // Insert component into DOM element
    async insertComponent(elementSelector, componentPath) {
        try {
            const element = document.querySelector(elementSelector);
            if (!element) {
                console.error(`Element not found: ${elementSelector}`);
                return;
            }

            // Show loading state
            element.innerHTML = '<div class="component-loading">Loading...</div>';

            const content = await this.loadComponent(componentPath);
            element.innerHTML = content;

            // Re-initialize Lucide icons after component load
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }

            // Trigger component loaded event
            element.dispatchEvent(new CustomEvent('componentLoaded', {
                detail: { componentPath, element }
            }));

        } catch (error) {
            console.error(`Error inserting component ${componentPath}:`, error);
            const element = document.querySelector(elementSelector);
            if (element) {
                element.innerHTML = `<div class="error">Failed to load component</div>`;
            }
        }
    }

    // Load multiple components
    async loadComponents(components) {
        const promises = components.map(({ selector, path }) => 
            this.insertComponent(selector, path)
        );
        
        try {
            await Promise.all(promises);
            console.log('All components loaded successfully');
        } catch (error) {
            console.error('Error loading some components:', error);
        }
    }

    // Clear cache
    clearCache() {
        this.componentCache.clear();
        this.loadingPromises.clear();
    }

    // Preload components
    async preloadComponents(componentPaths) {
        const promises = componentPaths.map(path => this.loadComponent(path));
        try {
            await Promise.all(promises);
            console.log('Components preloaded successfully');
        } catch (error) {
            console.error('Error preloading components:', error);
        }
    }
}

// Global component loader instance
window.ComponentLoader = new ComponentLoader();

// Helper function to load page components
window.loadPageComponents = async function() {
    const components = [
        { selector: '#navbar-container', path: 'navigation/navbar.html' },
        { selector: '#hero-container', path: 'sections/hero.html' },
        { selector: '#features-container', path: 'sections/features.html' },
        { selector: '#solutions-container', path: 'sections/solutions.html' },
        { selector: '#infrastructure-container', path: 'sections/infrastructure.html' },
        { selector: '#success-stories-container', path: 'sections/success-stories.html' },
        { selector: '#ecosystem-container', path: 'sections/ecosystem.html' },
        { selector: '#pricing-container', path: 'sections/pricing.html' },
        { selector: '#contact-container', path: 'sections/contact.html' },
        { selector: '#footer-container', path: 'navigation/footer.html' }
    ];

    await window.ComponentLoader.loadComponents(components);
    
    // Re-initialize main app functionality after all components are loaded
    if (typeof initializeMainApp === 'function') {
        initializeMainApp();
    }
};

// Auto-load components when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Only load if page has component containers
    if (document.querySelector('#navbar-container')) {
        window.loadPageComponents();
    }
});

console.log('Component Loader System initialized');
