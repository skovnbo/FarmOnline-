// Solutions Component JavaScript
class SolutionsComponent {
    constructor() {
        this.tabButtons = null;
        this.tabContents = null;
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        
        this.tabButtons = document.querySelectorAll('.tab-btn');
        this.tabContents = document.querySelectorAll('.tab-content');

        this.bindEvents();
        this.initialized = true;
        console.log('Solutions component initialized');
    }

    bindEvents() {
        this.tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');
                this.switchTab(targetTab, button);
            });
        });
    }

    switchTab(targetTab, activeButton) {
        // Remove active class from all buttons and contents
        this.tabButtons.forEach(btn => btn.classList.remove('active'));
        this.tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked button and corresponding content
        activeButton.classList.add('active');
        const targetContent = document.getElementById(targetTab);
        if (targetContent) {
            targetContent.classList.add('active');
        }
    }

    destroy() {
        this.initialized = false;
    }
}

// Create global solutions instance
window.SolutionsComponent = new SolutionsComponent();

// Auto-initialize when solutions component is loaded
document.addEventListener('componentLoaded', (e) => {
    if (e.detail.componentPath === 'sections/solutions.html') {
        setTimeout(() => {
            window.SolutionsComponent.init();
        }, 0);
    }
});
