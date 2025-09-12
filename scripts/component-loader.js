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

// Component Loader for Development
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Loading components...');

    const components = {
        '<!-- NAV_COMPONENT -->': 'components/navigation/nav.html',
        '<!-- HERO_COMPONENT -->': 'components/hero.html',
        '<!-- ABOUT_COMPONENT -->': 'components/sections/about.html',
        '<!-- SERVICES_COMPONENT -->': 'components/sections/services.html',
        '<!-- TEAM_COMPONENT -->': 'components/sections/team.html',
        '<!-- PRICING_COMPONENT -->': 'components/sections/pricing.html',
        '<!-- CONTACT_COMPONENT -->': 'components/sections/contact.html',
        '<!-- FOOTER_COMPONENT -->': 'components/footer.html',
        '<!-- MANAGEMENT_HERO_COMPONENT -->': 'components/management/hero.html',
        '<!-- MANAGEMENT_OVERVIEW_COMPONENT -->': 'components/management/overview.html',
        '<!-- MANAGEMENT_FEATURES_COMPONENT -->': 'components/management/features.html',
        '<!-- MANAGEMENT_BENEFITS_COMPONENT -->': 'components/management/benefits.html',
        '<!-- INTEGRATION_SECTIONS_COMPONENT -->': 'components/integration/sections.html',
        '<!-- INFRASTRUCTURE_SECTIONS_COMPONENT -->': 'components/infrastructure/sections.html',
        '<!-- APPLICATIONS_SECTIONS_COMPONENT -->': 'components/applications/sections.html',
        '<!-- ANALYTICS_HERO_COMPONENT -->': 'components/analytics/hero.html',
        '<!-- ANALYTICS_OVERVIEW_COMPONENT -->': 'components/analytics/overview.html',
        '<!-- ANALYTICS_FEATURES_COMPONENT -->': 'components/analytics/features.html',
        '<!-- ANALYTICS_BENEFITS_COMPONENT -->': 'components/analytics/benefits.html'
    };

    // Function to load a component
    async function loadComponent(placeholder, componentPath) {
        try {
            const response = await fetch(componentPath);
            if (response.ok) {
                const html = await response.text();
                document.body.innerHTML = document.body.innerHTML.replace(placeholder, html);
                console.log(`✓ Loaded: ${componentPath}`);
                return true;
            } else {
                console.warn(`⚠ Component not found: ${componentPath}`);
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
    
    for (const [placeholder, componentPath] of Object.entries(components)) {
        if (document.body.innerHTML.includes(placeholder)) {
            totalComponents++;
            const loaded = await loadComponent(placeholder, componentPath);
            if (loaded) loadedCount++;
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

    // Initialize any JavaScript that depends on loaded components
    if (window.initializeComponents) {
        window.initializeComponents();
    }
});
