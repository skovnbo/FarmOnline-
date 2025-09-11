// Pricing Component JavaScript
class PricingComponent {
    constructor() {
        this.pricingToggle = null;
        this.monthlyAmounts = null;
        this.annualAmounts = null;
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        
        this.pricingToggle = document.getElementById('pricing-annual');
        this.monthlyAmounts = document.querySelectorAll('.amount.monthly');
        this.annualAmounts = document.querySelectorAll('.amount.annual');

        this.bindEvents();
        this.initialized = true;
        console.log('Pricing component initialized');
    }

    bindEvents() {
        if (this.pricingToggle) {
            this.pricingToggle.addEventListener('change', () => {
                this.togglePricing();
            });
        }
    }

    togglePricing() {
        if (this.pricingToggle.checked) {
            // Show annual pricing
            this.monthlyAmounts.forEach(amount => amount.style.display = 'none');
            this.annualAmounts.forEach(amount => amount.style.display = 'inline');
        } else {
            // Show monthly pricing
            this.monthlyAmounts.forEach(amount => amount.style.display = 'inline');
            this.annualAmounts.forEach(amount => amount.style.display = 'none');
        }
    }

    destroy() {
        this.initialized = false;
    }
}

// Create global pricing instance
window.PricingComponent = new PricingComponent();

// Auto-initialize when pricing component is loaded
document.addEventListener('componentLoaded', (e) => {
    if (e.detail.componentPath === 'sections/pricing.html') {
        setTimeout(() => {
            window.PricingComponent.init();
        }, 0);
    }
});
