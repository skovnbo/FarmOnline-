// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {

// Initialize Lucide Icons
if (typeof lucide !== 'undefined') {
    lucide.createIcons();
}

// Dynamic Navigation System
const navTabs = document.querySelectorAll('.nav-tab');
const submenuItems = document.querySelectorAll('.submenu-items');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

// Handle main navigation tab switching
navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const section = tab.getAttribute('data-section');
        
        // Update active tab
        navTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Update active submenu
        submenuItems.forEach(submenu => {
            submenu.classList.remove('active');
            if (submenu.getAttribute('data-submenu') === section) {
                submenu.classList.add('active');
            }
        });
    });
});

// Mobile Navigation Toggle
if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        
        // Prevent body scroll when mobile menu is open
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
            mobileMenu.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Close mobile menu when clicking on a link
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links .submenu-link');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 120; // Account for fixed navbar with submenu
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Active Navigation Link Highlighting
function updateActiveNavLink() {
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
}

// Update active link on scroll
window.addEventListener('scroll', updateActiveNavLink);

// Update active link on page load
document.addEventListener('DOMContentLoaded', updateActiveNavLink);

// Solutions Tabs Functionality
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetTab = button.getAttribute('data-tab');
        
        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked button and corresponding content
        button.classList.add('active');
        const targetContent = document.getElementById(targetTab);
        if (targetContent) {
            targetContent.classList.add('active');
        }
    });
});

// Pricing Toggle (Monthly/Annual)
const pricingToggle = document.getElementById('pricing-annual');
const monthlyAmounts = document.querySelectorAll('.amount.monthly');
const annualAmounts = document.querySelectorAll('.amount.annual');

if (pricingToggle) {
    pricingToggle.addEventListener('change', () => {
        if (pricingToggle.checked) {
            // Show annual pricing
            monthlyAmounts.forEach(amount => amount.style.display = 'none');
            annualAmounts.forEach(amount => amount.style.display = 'inline');
        } else {
            // Show monthly pricing
            monthlyAmounts.forEach(amount => amount.style.display = 'inline');
            annualAmounts.forEach(amount => amount.style.display = 'none');
        }
    });
}

// Scroll Reveal Animation
function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('revealed');
        }
    });
}

window.addEventListener('scroll', revealOnScroll);

// Add reveal class to elements that should animate on scroll
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll(
        '.feature-card, .testimonial-card, .pricing-card, .benefit-card'
    );
    
    animateElements.forEach(element => {
        element.classList.add('reveal');
    });
    
    // Initial check for elements already in view
    revealOnScroll();
});

// Form Handling
const demoForm = document.querySelector('.demo-form');

if (demoForm) {
    demoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Add loading state
        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.classList.add('loading');
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            // Remove loading state
            submitButton.classList.remove('loading');
            submitButton.textContent = 'Demo Requested!';
            submitButton.style.background = 'var(--secondary-green)';
            
            // Show success message
            showNotification('Demo request sent successfully! We\'ll contact you soon.', 'success');
            
            // Reset form after delay
            setTimeout(() => {
                this.reset();
                submitButton.textContent = originalText;
                submitButton.style.background = '';
                submitButton.disabled = false;
            }, 3000);
        }, 2000);
    });
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i data-lucide="${type === 'success' ? 'check-circle' : 'info'}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i data-lucide="x"></i>
            </button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'var(--secondary-green)' : 'var(--primary-blue)'};
        color: white;
        padding: var(--space-lg);
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform var(--transition-normal);
        max-width: 400px;
    `;
    
    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        gap: var(--space-md);
    `;
    
    notification.querySelector('.notification-close').style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: var(--space-xs);
        margin-left: auto;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Initialize icons for notification
    lucide.createIcons();
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Dashboard Animation
function animateDashboard() {
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
}

// Chart Animation
function animateCharts() {
    const bars = document.querySelectorAll('.bar');
    
    bars.forEach((bar, index) => {
        const originalHeight = bar.style.height;
        bar.style.height = '0%';
        
        setTimeout(() => {
            bar.style.transition = 'height 0.8s ease-out';
            bar.style.height = originalHeight;
        }, index * 200);
    });
}

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
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const dashboardPreview = document.querySelector('.dashboard-preview');
    const chartPlaceholder = document.querySelector('.chart-placeholder');
    
    if (dashboardPreview) observer.observe(dashboardPreview);
    if (chartPlaceholder) observer.observe(chartPlaceholder);
});

// Navbar Scroll Effect
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
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
});

// Ecosystem Animation
function animateEcosystem() {
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
}

// Add ecosystem to observer
document.addEventListener('DOMContentLoaded', () => {
    const ecosystemVisual = document.querySelector('.ecosystem-visual');
    if (ecosystemVisual) {
        const ecosystemObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateEcosystem();
                    ecosystemObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        ecosystemObserver.observe(ecosystemVisual);
    }
});

// Performance Optimization
function throttle(func, limit) {
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

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(updateActiveNavLink, 100));
window.addEventListener('scroll', throttle(revealOnScroll, 100));

// Lazy loading for images
function lazyLoadImages() {
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
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Error Handling
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
    // Could implement error reporting here
});

// Resize handler for responsive updates
window.addEventListener('resize', throttle(() => {
    // Update any size-dependent calculations
    updateActiveNavLink();
}, 250));

console.log('FarmOnline+ Marketing Website - JavaScript Loaded Successfully!');

}); // End of DOMContentLoaded
