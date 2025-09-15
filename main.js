/*
╔══════════════════════════════════════════════════════════════════════════════════════════════╗
║                             FARMONLINE+ NAVIGATION SYSTEM                                   ║
╠══════════════════════════════════════════════════════════════════════════════════════════════╣
║                                                                                              ║
║  PURPOSE: Single-page application navigation and interaction management                     ║
║                                                                                              ║
║  FUNCTIONALITY:                                                                              ║
║  • Main tab navigation (Operations, Integration, Infrastructure, Applications)             ║
║  • Submenu management for each main section                                                 ║
║  • Mobile menu toggle functionality                                                         ║
║  • Smooth section transitions and content switching                                         ║
║  • URL hash navigation support                                                              ║
║  • Responsive navigation behavior                                                           ║
║                                                                                              ║
║  NAVIGATION STRUCTURE:                                                                       ║
║  ┌─ Main Tabs (.nav-tab)                                                                    ║
║  │  ├─ Operations (data-section="operations")                                              ║
║  │  ├─ Integration (data-section="integration")                                            ║
║  │  ├─ Infrastructure (data-section="infrastructure")                                      ║
║  │  └─ Applications (data-section="applications")                                          ║
║  │                                                                                          ║
║  ├─ Submenus (.submenu-items)                                                              ║
║  │  ├─ Each main tab has corresponding submenu                                             ║
║  │  └─ Shows/hides based on active main tab                                                ║
║  │                                                                                          ║
║  └─ Content Sections (.content-section)                                                    ║
║     ├─ Each section contains multiple subsections                                          ║
║     └─ Only active section is visible                                                      ║
║                                                                                              ║
║  INTERACTION PATTERNS:                                                                       ║
║  • Click main tab → Switch content section + submenu                                       ║
║  • Click submenu link → Scroll to subsection within active content                        ║
║  • Mobile hamburger → Toggle mobile menu overlay                                           ║
║  • Hash navigation → Direct link to specific subsections                                   ║
║                                                                                              ║
║  MOBILE BEHAVIOR:                                                                            ║
║  • Hamburger menu for small screens                                                         ║
║  • Full-screen overlay menu                                                                 ║
║  • Touch-friendly navigation elements                                                       ║
║                                                                                              ║
║  EVENT HANDLING:                                                                             ║
║  • DOMContentLoaded initialization                                                          ║
║  • Click event delegation for performance                                                   ║
║  • Window resize handling for responsive behavior                                           ║
║  • Hash change detection for direct navigation                                              ║
║                                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════════════════════╝
*/

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Navigation elements
    const navTabs = document.querySelectorAll('.nav-tab');
    const contentSections = document.querySelectorAll('.content-section');
    const submenuItems = document.querySelectorAll('.submenu-items');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const submenuLinks = document.querySelectorAll('.submenu-link');
    const pricingToggle = document.getElementById('pricing-annual');

    // Main tab navigation
    function switchSection(sectionName) {
        // Update active tab
        navTabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.section === sectionName);
        });

        // Update active content section
        contentSections.forEach(section => {
            section.classList.toggle('active', section.dataset.section === sectionName);
        });

        // Update active submenu
        submenuItems.forEach(submenu => {
            submenu.classList.toggle('active', submenu.dataset.submenu === sectionName);
        });

        // Update mobile menu sections
        const mobileSections = document.querySelectorAll('.mobile-section');
        mobileSections.forEach(section => {
            section.style.display = section.dataset.section === sectionName ? 'block' : 'none';
        });

        // Reset submenu active states
        const activeSubmenu = document.querySelector(`.submenu-items[data-submenu="${sectionName}"]`);
        if (activeSubmenu) {
            const firstLink = activeSubmenu.querySelector('.submenu-link');
            if (firstLink) {
                activeSubmenu.querySelectorAll('.submenu-link').forEach(link => {
                    link.classList.remove('active');
                });
                firstLink.classList.add('active');
            }
        }

        // Close mobile menu
        if (mobileMenu) {
            mobileMenu.classList.remove('active');
            hamburger?.classList.remove('active');
        }
    }

    // Tab click handlers
    navTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const sectionName = this.dataset.section;
            switchSection(sectionName);
            
            // Update URL hash
            window.location.hash = sectionName;
        });
    });

    // Submenu link handlers with smart scrolling
    submenuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active submenu link
            const parentSubmenu = this.closest('.submenu-items');
            if (parentSubmenu) {
                parentSubmenu.querySelectorAll('.submenu-link').forEach(l => {
                    l.classList.remove('active');
                });
                this.classList.add('active');
            }

            // Scroll to target section with smart offset
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                scrollToSection(href.slice(1));
            }

            // Close mobile menu
            if (mobileMenu) {
                mobileMenu.classList.remove('active');
                hamburger?.classList.remove('active');
            }
        });
    });

    // Smart scrolling function
    function scrollToSection(sectionId) {
        const targetElement = document.getElementById(sectionId);
        if (targetElement) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const submenuHeight = document.querySelector('.nav-submenu').offsetHeight;
            const totalOffset = navbarHeight + submenuHeight + 20; // 20px extra padding
            
            const elementPosition = targetElement.offsetTop;
            const offsetPosition = elementPosition - totalOffset;

            window.scrollTo({
                top: Math.max(0, offsetPosition),
                behavior: 'smooth'
            });
        }
    }

    // Smart scroll tracking and active link highlighting
    function updateActiveLinksOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        const submenuHeight = document.querySelector('.nav-submenu').offsetHeight;
        const scrollOffset = navbarHeight + submenuHeight + 50;
        
        let currentActiveSection = null;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - scrollOffset;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
                currentActiveSection = section.id;
            }
        });
        
        // Update active submenu link based on scroll position
        if (currentActiveSection) {
            const activeSubmenu = document.querySelector('.submenu-items.active');
            if (activeSubmenu) {
                activeSubmenu.querySelectorAll('.submenu-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${currentActiveSection}`) {
                        link.classList.add('active');
                    }
                });
            }
        }
    }

    // Throttled scroll handler for performance
    let scrollTimer = null;
    let lastScrollY = 0;
    let scrollDirection = 'up';
    
    function handleScroll() {
        if (scrollTimer) {
            clearTimeout(scrollTimer);
        }
        scrollTimer = setTimeout(() => {
            updateActiveLinksOnScroll();
            updateNavbarOnScroll();
            handleNavbarAutoHide();
        }, 10);
    }

    // Navbar scroll effects
    function updateNavbarOnScroll() {
        const navbar = document.querySelector('.navbar');
        const scrolled = window.scrollY > 50;
        
        if (scrolled) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // Auto-hide navbar functionality
    function handleNavbarAutoHide() {
        const currentScrollY = window.scrollY;
        const navbar = document.querySelector('.navbar');
        
        // Determine scroll direction
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            // Scrolling down and past initial scroll point
            scrollDirection = 'down';
            navbar.classList.add('hidden');
        } else if (currentScrollY < lastScrollY) {
            // Scrolling up
            scrollDirection = 'up';
            navbar.classList.remove('hidden');
        }
        
        // Always show navbar at the top
        if (currentScrollY <= 10) {
            navbar.classList.remove('hidden');
        }
        
        lastScrollY = currentScrollY;
    }

    // Add mouse events for navbar reveal
    function setupNavbarMouseEvents() {
        const navbar = document.querySelector('.navbar');
        
        // Show navbar when mouse is near the top of the page
        document.addEventListener('mousemove', (e) => {
            if (e.clientY <= 100) { // When mouse is within 100px of top
                navbar.classList.remove('hidden');
            }
        });
        
        // Keep navbar visible when hovering over it
        navbar.addEventListener('mouseenter', () => {
            navbar.classList.remove('hidden');
        });
    }

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Mobile menu toggle
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking outside
        mobileMenu.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    }

    // Pricing toggle functionality
    if (pricingToggle) {
        pricingToggle.addEventListener('change', function() {
            const monthlyPrices = document.querySelectorAll('.amount.monthly');
            const annualPrices = document.querySelectorAll('.amount.annual');
            
            if (this.checked) {
                // Show annual prices
                monthlyPrices.forEach(price => price.style.display = 'none');
                annualPrices.forEach(price => price.style.display = 'inline');
            } else {
                // Show monthly prices
                monthlyPrices.forEach(price => price.style.display = 'inline');
                annualPrices.forEach(price => price.style.display = 'none');
            }
        });
    }

    // Handle direct hash navigation with smart scrolling
    function handleHashNavigation() {
        const hash = window.location.hash.slice(1);
        if (hash) {
            // Check if hash matches a main section
            const validSections = ['operations', 'integration', 'infrastructure', 'applications'];
            if (validSections.includes(hash)) {
                switchSection(hash);
            } else {
                // Check if hash matches a subsection
                const targetElement = document.getElementById(hash);
                if (targetElement) {
                    // Find which main section contains this subsection
                    const parentSection = targetElement.closest('.content-section');
                    if (parentSection) {
                        const sectionName = parentSection.dataset.section;
                        switchSection(sectionName);
                        
                        // Use smart scrolling to the specific subsection
                        setTimeout(() => {
                            scrollToSection(hash);
                        }, 100);
                    }
                }
            }
        }
    }

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashNavigation);

    // Handle initial hash on page load
    handleHashNavigation();

    // Smart smooth scrolling for all internal links
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a[href^="#"]');
        if (link) {
            e.preventDefault();
            const href = link.getAttribute('href');
            const sectionId = href.slice(1);
            
            if (sectionId) {
                // Update URL hash
                history.pushState(null, null, href);
                
                // Use smart scrolling
                scrollToSection(sectionId);
                
                // Update active submenu link
                const activeSubmenu = document.querySelector('.submenu-items.active');
                if (activeSubmenu) {
                    activeSubmenu.querySelectorAll('.submenu-link').forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === href) {
                            link.classList.add('active');
                        }
                    });
                }
            }
        }
    });

    // Solution tabs functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            
            // Update active tab button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update active tab content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabId) {
                    content.classList.add('active');
                }
            });
        });
    });

    // Initialize on load
    if (!window.location.hash) {
        switchSection('operations');
    } else {
        // Handle hash navigation on page load
        setTimeout(() => {
            const targetId = window.location.hash.substring(1);
            scrollToSection(targetId);
        }, 100);
    }
    
    // Set initial active states
    updateActiveLinksOnScroll();
    
    // Setup mouse events for navbar
    setupNavbarMouseEvents();
    
    // Setup contact form handling
    setupContactForms();

    console.log('FarmOnline+ Navigation System Initialized');
});

// Contact form functionality
function setupContactForms() {
    const contactForms = document.querySelectorAll('.contact-form');
    
    contactForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleContactFormSubmission(this);
        });
    });
}

function handleContactFormSubmission(form) {
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Collect form data
    const formData = new FormData(form);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        company: formData.get('company'),
        phone: formData.get('phone'),
        message: formData.get('message'),
        section: getSectionFromForm(form),
        timestamp: new Date().toISOString()
    };
    
    // Add section-specific fields
    const sectionFields = getSectionSpecificFields(formData);
    Object.assign(data, sectionFields);
    
    // Simulate form submission (replace with actual endpoint)
    setTimeout(() => {
        console.log('Contact form submitted:', data);
        
        // Show success message
        showFormSuccessMessage(form);
        
        // Reset form
        form.reset();
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

function getSectionFromForm(form) {
    const formIds = {
        'ops-name': 'Operations',
        'int-name': 'Integration', 
        'inf-name': 'Infrastructure',
        'app-name': 'Applications'
    };
    
    const nameInput = form.querySelector('input[name="name"]');
    return formIds[nameInput.id] || 'General';
}

function getSectionSpecificFields(formData) {
    const fields = {};
    
    // Add all form fields that aren't basic contact info
    for (let [key, value] of formData.entries()) {
        if (!['name', 'email', 'company', 'phone', 'message'].includes(key)) {
            fields[key] = value;
        }
    }
    
    return fields;
}

function showFormSuccessMessage(form) {
    const existingMessage = form.querySelector('.success-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = `
        <div style="
            background: rgba(34, 197, 94, 0.1);
            border: 1px solid rgba(34, 197, 94, 0.3);
            color: white;
            padding: 1rem;
            border-radius: 8px;
            margin-top: 1rem;
            text-align: center;
        ">
            <i data-lucide="check-circle" style="margin-right: 0.5rem;"></i>
            Thank you! We'll get back to you within 24 hours.
        </div>
    `;
    
    form.appendChild(successMessage);
    
    // Re-initialize Lucide icons for the new icon
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Remove message after 5 seconds
    setTimeout(() => {
        successMessage.remove();
    }, 5000);
}
