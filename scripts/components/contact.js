// Contact Component JavaScript
class ContactComponent {
    constructor() {
        this.demoForm = null;
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        
        this.demoForm = document.querySelector('.demo-form');

        this.bindEvents();
        this.initialized = true;
        console.log('Contact component initialized');
    }

    bindEvents() {
        if (this.demoForm) {
            this.demoForm.addEventListener('submit', (e) => {
                this.handleFormSubmit(e);
            });
        }
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this.demoForm);
        const data = Object.fromEntries(formData);
        
        // Add loading state
        const submitButton = this.demoForm.querySelector('button[type="submit"]');
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
            this.showNotification('Demo request sent successfully! We\'ll contact you soon.', 'success');
            
            // Reset form after delay
            setTimeout(() => {
                this.demoForm.reset();
                submitButton.textContent = originalText;
                submitButton.style.background = '';
                submitButton.disabled = false;
            }, 3000);
        }, 2000);
    }

    showNotification(message, type = 'info') {
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
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
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

    destroy() {
        this.initialized = false;
    }
}

// Create global contact instance
window.ContactComponent = new ContactComponent();

// Auto-initialize when contact component is loaded
document.addEventListener('componentLoaded', (e) => {
    if (e.detail.componentPath === 'sections/contact.html') {
        setTimeout(() => {
            window.ContactComponent.init();
        }, 0);
    }
});
