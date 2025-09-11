// Navigation Component JavaScript
class NavigationComponent {
    constructor() {
        this.navTabs = null;
        this.submenuItems = null;
        this.hamburger = null;
        this.mobileMenu = null;
        this.initialized = false;
    }

    init() {
        if (this.initialized) {
            console.log('Navigation already initialized');
            return;
        }
        
        console.log('Initializing navigation component...');
        
        this.navTabs = document.querySelectorAll('.nav-tab');
        this.submenuItems = document.querySelectorAll('.submenu-items');
        this.hamburger = document.getElementById('hamburger');
        this.mobileMenu = document.getElementById('mobileMenu');

        console.log(`Found ${this.navTabs.length} nav tabs`);
        console.log(`Found ${this.submenuItems.length} submenu items`);

        if (this.navTabs.length === 0) {
            console.error('No navigation tabs found! Navigation HTML may not be loaded yet.');
            return;
        }

        this.bindEvents();
        this.loadAppVersion();
        this.initialized = true;
        console.log('Navigation component initialized successfully');
    }

    bindEvents() {
        // Handle main navigation tab switching
        this.navTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const section = tab.getAttribute('data-section');
                this.switchTab(section, tab);
            });
        });

        // Handle submenu link clicks
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('submenu-link')) {
                e.preventDefault();
                this.handleSubmenuClick(e.target);
            }
        });

        // Mobile Navigation Toggle
        if (this.hamburger && this.mobileMenu) {
            this.hamburger.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
            
            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!this.hamburger.contains(e.target) && !this.mobileMenu.contains(e.target)) {
                    this.closeMobileMenu();
                }
            });
            
            // Close mobile menu when clicking on a link
            const mobileNavLinks = document.querySelectorAll('.mobile-nav-links .submenu-link');
            mobileNavLinks.forEach(link => {
                link.addEventListener('click', () => {
                    this.closeMobileMenu();
                });
            });
        }
    }

    handleSubmenuClick(link) {
        // Remove active class from all submenu links
        const allSubmenuLinks = document.querySelectorAll('.submenu-link');
        allSubmenuLinks.forEach(l => l.classList.remove('active'));
        
        // Add active class to clicked link
        link.classList.add('active');
        
        // Get the target section from href
        const href = link.getAttribute('href');
        if (href.startsWith('#')) {
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId) || document.getElementById(targetId + '-container');
            
            if (targetElement) {
                targetElement.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    }

    switchTab(section, activeTab) {
        console.log(`Switching to section: ${section}`);
        
        // Update active tab
        this.navTabs.forEach(t => t.classList.remove('active'));
        activeTab.classList.add('active');
        
        // Hide all main sections
        const allSections = document.querySelectorAll('main > section[id$="-section"]');
        console.log(`Found ${allSections.length} sections to hide`);
        allSections.forEach(sec => {
            sec.style.display = 'none';
            console.log(`Hiding section: ${sec.id}`);
        });
        
        // Show the selected section
        const targetSection = document.getElementById(`${section}-section`);
        if (targetSection) {
            targetSection.style.display = 'block';
            console.log(`Showing section: ${targetSection.id}`);
        } else {
            console.error(`Target section not found: ${section}-section`);
        }
        
        // Update active submenu
        this.submenuItems.forEach(submenu => {
            submenu.classList.remove('active');
            if (submenu.getAttribute('data-submenu') === section) {
                submenu.classList.add('active');
                
                // Auto-select the first submenu item when switching tabs
                const firstSubmenuLink = submenu.querySelector('.submenu-link');
                if (firstSubmenuLink) {
                    // Clear all active submenu links
                    const allSubmenuLinks = document.querySelectorAll('.submenu-link');
                    allSubmenuLinks.forEach(link => link.classList.remove('active'));
                    
                    // Set the first link as active
                    firstSubmenuLink.classList.add('active');
                    
                    // Navigate to the first submenu item's content for each section
                    setTimeout(() => {
                        this.navigateToFirstSubmenuItem(section, firstSubmenuLink);
                    }, 100); // Small delay to ensure DOM is updated
                }
            }
        });
        
        // Additional logic specifically for Integration tab
        if (section === 'integration') {
            // Ensure we're showing the analytics overview by default
            console.log('Switching to Integration section - showing Analytics Overview');
        }
    }

    navigateToFirstSubmenuItem(section, firstSubmenuLink) {
        // Get the target from the first submenu link
        const href = firstSubmenuLink.getAttribute('href');
        
        // Define section-specific first content mapping based on actual href values
        const sectionContentMap = {
            'operations': 'hero-container',           // href="#hero" 
            'integration': 'partner-connectors-container', // href="#partner-connectors"
            'infrastructure': 'bluecontrol-models-container', // href="#bluecontrol-models"
            'applications': 'mobile-app-container'    // href="#mobile-app"
        };
        
        // Define href to container mapping
        const hrefToContainerMap = {
            '#hero': 'hero-container',
            '#features': 'features-container', 
            '#solutions': 'solutions-container',
            '#partner-connectors': 'partner-connectors-container',
            '#bi-solutions': 'bi-solutions-container',
            '#erp-integration': 'erp-integration-container',
            '#bluecontrol-models': 'bluecontrol-models-container',
            '#global-infrastructure': 'global-infrastructure-container',
            '#data-security': 'data-security-container', 
            '#infrastructure': 'infrastructure-container',
            '#ecosystem': 'ecosystem-container',
            '#success-stories': 'success-stories-container',
            '#pricing': 'pricing-container',
            '#mobile-app': 'mobile-app-container',
            '#survey-webapp': 'survey-webapp-container',
            '#boards-webapp': 'boards-webapp-container',
            '#silo-webapp': 'silo-webapp-container',
            '#reference-webapp': 'reference-webapp-container',
            '#alarm-webapp': 'alarm-webapp-container',
            '#analytics-webapp': 'analytics-webapp-container'
        };
        
        // Get the target container for this section
        let targetElement = null;
        
        if (href && href.startsWith('#')) {
            // Special handling for contact links - map to section-specific contact containers
            if (href === '#contact') {
                const contactContainerMap = {
                    'operations': 'contact-container',
                    'integration': 'contact-container-integration',
                    'infrastructure': 'contact-container-infrastructure',
                    'applications': 'contact-container-applications'
                };
                const contactContainerId = contactContainerMap[section];
                if (contactContainerId) {
                    targetElement = document.getElementById(contactContainerId);
                }
            } else {
                // Try to find element by href mapping first
                const targetContainerId = hrefToContainerMap[href];
                if (targetContainerId) {
                    targetElement = document.getElementById(targetContainerId);
                }
            }
            
            // Fallback: try direct href match
            if (!targetElement) {
                const targetId = href.substring(1);
                targetElement = document.getElementById(targetId) || document.getElementById(targetId + '-container');
            }
        }
        
        // Final fallback to section's default first container
        if (!targetElement) {
            const defaultContainerId = sectionContentMap[section];
            if (defaultContainerId) {
                targetElement = document.getElementById(defaultContainerId);
            }
        }
        
        // Scroll to the target element
        if (targetElement) {
            targetElement.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
            console.log(`Navigated to ${section} section, container: ${targetElement.id}`);
        } else {
            // If no specific container found, scroll to the section itself
            const sectionElement = document.getElementById(`${section}-section`);
            if (sectionElement) {
                sectionElement.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
                console.log(`Navigated to ${section} section (fallback to section)`);
            }
        }
    }

    toggleMobileMenu() {
        this.mobileMenu.classList.toggle('active');
        this.hamburger.classList.toggle('active');
        
        // Prevent body scroll when mobile menu is open
        document.body.style.overflow = this.mobileMenu.classList.contains('active') ? 'hidden' : '';
    }

    closeMobileMenu() {
        this.mobileMenu.classList.remove('active');
        this.hamburger.classList.remove('active');
        document.body.style.overflow = '';
    }

    async loadAppVersion() {
        try {
            // Fetch package.json from the root of the project
            const response = await fetch('./package.json');
            const packageData = await response.json();
            
            // Update the version in the navigation
            const versionElement = document.getElementById('app-version');
            if (versionElement && packageData.version) {
                versionElement.textContent = packageData.version;
                console.log(`App version loaded: ${packageData.version}`);
            }
        } catch (error) {
            console.warn('Could not load app version from package.json:', error);
            // Keep the default version (1.0.0) if loading fails
        }
    }

    destroy() {
        // Clean up event listeners if needed
        this.initialized = false;
    }
}

// Create global navigation instance
window.NavigationComponent = new NavigationComponent();

// Auto-initialize when navigation is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Try to initialize immediately if navigation already exists
    if (document.querySelector('.navbar')) {
        setTimeout(() => {
            window.NavigationComponent.init();
        }, 100);
    }
});

// Also listen for component loaded events on the navbar container
document.addEventListener('DOMContentLoaded', () => {
    const navbarContainer = document.getElementById('navbar-container');
    if (navbarContainer) {
        navbarContainer.addEventListener('componentLoaded', (e) => {
            if (e.detail.componentPath === 'navigation/navbar.html') {
                setTimeout(() => {
                    window.NavigationComponent.init();
                }, 100);
            }
        });
    }
});

// Fallback: Listen for global component loaded events
document.addEventListener('componentLoaded', (e) => {
    if (e.detail.componentPath === 'navigation/navbar.html') {
        setTimeout(() => {
            window.NavigationComponent.init();
        }, 100);
    }
});
