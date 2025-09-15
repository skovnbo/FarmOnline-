/*
╔══════════════════════════════════════════════════════════════════════════════════════════════╗
║                           FARMONLINE+ COMPONENT LOADER                                      ║
╠══════════════════════════════════════════════════════════════════════════════════════════════╣
║                                                                                              ║
║  PURPOSE: Development-time dynamic component loading system                                  ║
║                                                                                              ║
║  FUNCTIONALITY:                                                                              ║
║  • Loads HTML components dynamically via fetch() API                                        ║
║  • Replaces comment placeholders with actual component content                              ║
║  • Enables hot-reload development without build process                                      ║
║  • Used only in development (index-dev.html)                                                ║
║                                                                                              ║
║  COMPONENT MAPPING:                                                                          ║
║  Placeholder Comment → Component File Path                                                   ║
║  • <!-- NAV_COMPONENT --> → components/navigation/nav.html                                  ║
║  • <!-- MANAGEMENT_*_COMPONENT --> → components/management/*.html                           ║
║  • <!-- INTEGRATION_SECTIONS_COMPONENT --> → components/integration/sections.html          ║
║  • <!-- INFRASTRUCTURE_SECTIONS_COMPONENT --> → components/infrastructure/sections.html    ║
║  • <!-- APPLICATIONS_SECTIONS_COMPONENT --> → components/applications/sections.html        ║
║  • <!-- PRICING_COMPONENT --> → components/sections/pricing.html                           ║
║  • <!-- CONTACT_COMPONENT --> → components/sections/contact.html                           ║
║  • <!-- FOOTER_COMPONENT --> → components/footer.html                                      ║
║                                                                                              ║
║  LOAD PROCESS:                                                                               ║
║  1. DOM Content Loaded → Scan for comment placeholders                                      ║
║  2. Fetch component HTML files                                                              ║
║  3. Replace placeholders with loaded content                                                ║
║  4. Initialize navigation and icons                                                         ║
║                                                                                              ║
║  ERROR HANDLING:                                                                             ║
║  • 404 errors logged but don't break loading process                                        ║
║  • Failed components show placeholder retention                                             ║
║                                                                                              ║
║  RELATIONSHIP TO HOCs:                                                                       ║
║  • Each component file is a Higher-Order Component (HOC)                                    ║
║  • Components are self-contained and composable                                             ║
║  • Can be combined in different ways without modification                                   ║
║                                                                                              ║
║  PRODUCTION NOTE:                                                                            ║
║  • Not used in production (index.html)                                                      ║
║  • Production uses pre-built components via deploy script                                   ║
║                                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════════════════════╝
*/

// Immediate debug statement
console.log('🚀 COMPONENT LOADER SCRIPT LOADED');

// Component Loader for Development
document.addEventListener('DOMContentLoaded', async function() {
    console.log('=== COMPONENT LOADER STARTING ===');
    console.log('DOM Content Loaded - Component Loader Activated');
    
    // Add visible indicator that component loader is running
    const loadingIndicator = document.getElementById('loading');
    if (loadingIndicator) {
        loadingIndicator.innerHTML = '<h2 style="color: #0066cc;">🔧 Component Loader Active - Loading Components...</h2>';
    }

    const components = {
        '<!-- NAV_COMPONENT -->': 'components/navigation/nav.html',
        '<!-- FOOTER_COMPONENT -->': 'components/footer.html',
        '<!-- MANAGEMENT_HERO_COMPONENT -->': 'components/management/hero.html',
        '<!-- MANAGEMENT_OVERVIEW_COMPONENT -->': 'components/management/overview.html',
        '<!-- MANAGEMENT_FEATURES_COMPONENT -->': 'components/management/features.html',
        '<!-- MANAGEMENT_SOLUTIONS_COMPONENT -->': 'components/management/solutions.html',
        '<!-- MANAGEMENT_BENEFITS_COMPONENT -->': 'components/management/benefits.html',
        '<!-- MANAGEMENT_PRICING_COMPONENT -->': 'components/management/pricing.html',
        '<!-- MANAGEMENT_CONTACT_COMPONENT -->': 'components/management/contact.html',
        '<!-- INTEGRATION_SECTIONS_COMPONENT -->': 'components/integration/sections.html',
        '<!-- INTEGRATION_PRICING_COMPONENT -->': 'components/integration/pricing.html',
        '<!-- INTEGRATION_CONTACT_COMPONENT -->': 'components/integration/contact.html',
        '<!-- INFRASTRUCTURE_SECTIONS_COMPONENT -->': 'components/infrastructure/sections.html',
        '<!-- INFRASTRUCTURE_PRICING_COMPONENT -->': 'components/infrastructure/pricing.html',
        '<!-- INFRASTRUCTURE_CONTACT_COMPONENT -->': 'components/infrastructure/contact.html',
        '<!-- APPLICATIONS_SECTIONS_COMPONENT -->': 'components/applications/sections.html',
        '<!-- APPLICATIONS_PRICING_COMPONENT -->': 'components/applications/pricing.html',
        '<!-- APPLICATIONS_CONTACT_COMPONENT -->': 'components/applications/contact.html'
    };

    // Function to load a component
    async function loadComponent(placeholder, componentPath) {
        try {
            console.log(`Attempting to load: ${componentPath}`);
            const response = await fetch(componentPath);
            if (response.ok) {
                const html = await response.text();
                console.log(`Loaded content length: ${html.length} characters`);
                document.body.innerHTML = document.body.innerHTML.replace(placeholder, html);
                console.log(`✓ Successfully loaded and replaced: ${componentPath}`);
                return true;
            } else {
                console.warn(`⚠ Component not found (${response.status}): ${componentPath}`);
                return false;
            }
        } catch (error) {
            console.warn(`⚠ Failed to load: ${componentPath}`, error);
            return false;
        }
    }

    // Load all components
    let loadedCount = 0;
    let totalComponents = 0;
    
    console.log('=== COMPONENT LOADER DEBUG ===');
    console.log('Available components:', Object.keys(components));
    
    for (const [placeholder, componentPath] of Object.entries(components)) {
        if (document.body.innerHTML.includes(placeholder)) {
            console.log(`Found placeholder: ${placeholder} → ${componentPath}`);
            totalComponents++;
            const loaded = await loadComponent(placeholder, componentPath);
            if (loaded) loadedCount++;
        } else {
            console.log(`Placeholder not found: ${placeholder}`);
        }
    }

    console.log(`Components loaded: ${loadedCount}/${totalComponents}`);

    // Hide loading indicator
    const loadingDiv = document.getElementById('loading');
    if (loadingDiv) {
        loadingDiv.style.display = 'none';
    }

    // Show error if no components loaded
    if (loadedCount === 0 && totalComponents > 0) {
        document.body.innerHTML = `
            <div style="padding: 20px; text-align: center; background: #fee; color: #c33;">
                <h2>Component Loading Error</h2>
                <p>Failed to load components. Check console for details.</p>
                <p>Components expected: ${totalComponents}</p>
            </div>
        ` + document.body.innerHTML;
    }

    // Dispatch event to notify that components are loaded
    console.log('🎯 DISPATCHING COMPONENTS LOADED EVENT');
    const event = new CustomEvent('componentsLoaded', {
        detail: { loadedCount, totalComponents }
    });
    document.dispatchEvent(event);

    // Initialize any JavaScript that depends on loaded components
    if (window.initializeComponents) {
        window.initializeComponents();
    }
});
