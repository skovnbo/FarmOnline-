// Main Application JavaScript - Modular Version
// Initialize Lucide Icons
if (typeof lucide !== 'undefined') {
    lucide.createIcons();
}

// Main App Controller
class FarmOnlineApp {
    constructor() {
        this.initialized = false;
        this.components = {
            navigation: null,
            solutions: null,
            pricing: null,
            contact: null
        };
    }

    async init() {
        if (this.initialized) return;

        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
            return;
        }

        // Initialize core functionality
        this.initializeCoreFeatures();
        this.bindGlobalEvents();
        
        this.initialized = true;
        console.log('FarmOnline+ App initialized');
    }

    initializeCoreFeatures() {
        // Smooth Scrolling for Navigation Links
        this.initSmoothScrolling();
        
        // Active Navigation Link Highlighting
        this.initActiveNavTracking();
        
        // Scroll Reveal Animation
        this.initScrollReveal();
        
        // Dashboard and Chart Animations
        this.initAnimations();
        
        // Navbar Scroll Effect
        this.initNavbarScrollEffect();
        
        // Performance Optimizations
        this.initPerformanceOptimizations();
        
        // Lazy Loading
        this.initLazyLoading();
    }

    initSmoothScrolling() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (link) {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 120; // Account for fixed navbar with submenu
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    }

    initActiveNavTracking() {
        const updateActiveNavLink = () => {
            const sections = document.querySelectorAll('section[id]');
            const submenuLinks = document.querySelectorAll('.submenu-link');
            
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 150; // Account for navbar height
                if (window.pageYOffset >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });
            
            submenuLinks.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                if (href === `#${current}` || (current === '' && href === '#hero')) {
                    link.classList.add('active');
                }
            });
        };

        // Throttled scroll handler
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateActiveNavLink();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll);
        updateActiveNavLink(); // Initial call
    }

    initScrollReveal() {
        const revealOnScroll = () => {
            const reveals = document.querySelectorAll('.reveal');
            
            reveals.forEach(element => {
                const windowHeight = window.innerHeight;
                const elementTop = element.getBoundingClientRect().top;
                const elementVisible = 150;
                
                if (elementTop < windowHeight - elementVisible) {
                    element.classList.add('revealed');
                }
            });
        };

        window.addEventListener('scroll', this.throttle(revealOnScroll, 100));

        // Add reveal class to elements that should animate on scroll
        const addRevealClasses = () => {
            const animateElements = document.querySelectorAll(
                '.feature-card, .testimonial-card, .pricing-card, .benefit-card'
            );
            
            animateElements.forEach(element => {
                element.classList.add('reveal');
            });
            
            // Initial check for elements already in view
            revealOnScroll();
        };

        // Add reveal classes when components are loaded
        document.addEventListener('componentLoaded', addRevealClasses);
        addRevealClasses(); // Initial call
    }

    initAnimations() {
        // Dashboard Animation
        const animateDashboard = () => {
            const dashboardPreview = document.querySelector('.dashboard-preview');
            if (!dashboardPreview) return;
            
            const metrics = dashboardPreview.querySelectorAll('.metric-card');
            
            metrics.forEach((metric, index) => {
                setTimeout(() => {
                    metric.style.transform = 'scale(1.05)';
                    setTimeout(() => {
                        metric.style.transform = 'scale(1)';
                    }, 200);
                }, index * 300);
            });
        };

        // Chart Animation
        const animateCharts = () => {
            const bars = document.querySelectorAll('.bar');
            
            bars.forEach((bar, index) => {
                const originalHeight = bar.style.height;
                bar.style.height = '0%';
                
                setTimeout(() => {
                    bar.style.transition = 'height 0.8s ease-out';
                    bar.style.height = originalHeight;
                }, index * 200);
            });
        };

        // Ecosystem Animation
        const animateEcosystem = () => {
            const rings = document.querySelectorAll('.ring');
            const ringItems = document.querySelectorAll('.ring-item');
            
            rings.forEach((ring, index) => {
                ring.style.opacity = '0';
                ring.style.transform = 'translate(-50%, -50%) scale(0.8)';
                
                setTimeout(() => {
                    ring.style.transition = 'all 0.8s ease-out';
                    ring.style.opacity = '1';
                    ring.style.transform = 'translate(-50%, -50%) scale(1)';
                }, index * 300);
            });
            
            ringItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        item.style.transform = 'scale(1)';
                    }, 200);
                }, 800 + index * 100);
            });
        };

        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (entry.target.classList.contains('dashboard-preview')) {
                        animateDashboard();
                    }
                    if (entry.target.classList.contains('chart-placeholder')) {
                        animateCharts();
                    }
                    if (entry.target.classList.contains('ecosystem-visual')) {
                        animateEcosystem();
                        observer.unobserve(entry.target);
                    }
                }
            });
        }, observerOptions);

        // Observe elements when components are loaded
        const observeAnimationElements = () => {
            const dashboardPreview = document.querySelector('.dashboard-preview');
            const chartPlaceholder = document.querySelector('.chart-placeholder');
            const ecosystemVisual = document.querySelector('.ecosystem-visual');
            
            if (dashboardPreview) observer.observe(dashboardPreview);
            if (chartPlaceholder) observer.observe(chartPlaceholder);
            if (ecosystemVisual) observer.observe(ecosystemVisual);
        };

        document.addEventListener('componentLoaded', observeAnimationElements);
        observeAnimationElements(); // Initial call
    }

    initNavbarScrollEffect() {
        let lastScrollTop = 0;
        
        const handleNavbarScroll = () => {
            const navbar = document.querySelector('.navbar');
            if (!navbar) return;

            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                // Scrolling down
                navbar.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                navbar.style.transform = 'translateY(0)';
            }
            
            // Add background when scrolled
            if (scrollTop > 50) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.boxShadow = 'var(--shadow-md)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = 'none';
            }
            
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        };

        window.addEventListener('scroll', this.throttle(handleNavbarScroll, 100));
    }

    initPerformanceOptimizations() {
        // Error Handling
        window.addEventListener('error', (e) => {
            console.error('JavaScript error:', e.error);
            // Could implement error reporting here
        });

        // Resize handler for responsive updates
        window.addEventListener('resize', this.throttle(() => {
            // Update any size-dependent calculations
            // Re-run active nav tracking
        }, 250));
    }

    initLazyLoading() {
        const lazyLoadImages = () => {
            const images = document.querySelectorAll('img[data-src]');
            
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        };

        document.addEventListener('componentLoaded', lazyLoadImages);
        lazyLoadImages(); // Initial call
    }

    bindGlobalEvents() {
        // Re-initialize Lucide icons when components are loaded
        document.addEventListener('componentLoaded', () => {
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        });
    }

    // Utility function for throttling
    throttle(func, limit) {
        let lastFunc;
        let lastRan;
        return function() {
            const context = this;
            const args = arguments;
            if (!lastRan) {
                func.apply(context, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(function() {
                    if ((Date.now() - lastRan) >= limit) {
                        func.apply(context, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        }
    }
}

// Initialize the main app
const app = new FarmOnlineApp();

// Global function for component loader to call
window.initializeMainApp = () => {
    app.init();
};

// Auto-initialize if not using component loader
if (!window.ComponentLoader) {
    app.init();
}

console.log('FarmOnline+ Marketing Website - Modular JavaScript Loaded Successfully!');
