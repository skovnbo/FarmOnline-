// Test script to verify no overlap issues across all sections
console.log('🧪 Testing section overlap fixes...');

// Function to check if sections are properly positioned
function checkSectionPositioning() {
    const sections = ['operations-section', 'integration-section', 'infrastructure-section', 'sales-section'];
    
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            const rect = section.getBoundingClientRect();
            const navbar = document.querySelector('.navbar');
            const navbarHeight = navbar ? navbar.offsetHeight : 0;
            const submenu = document.querySelector('.nav-submenu');
            const submenuHeight = submenu ? submenu.offsetHeight : 0;
            const totalNavHeight = navbarHeight + submenuHeight;
            
            console.log(`Section ${sectionId}:`);
            console.log(`  - Top position: ${rect.top}px`);
            console.log(`  - Total nav height: ${totalNavHeight}px`);
            console.log(`  - Overlap check: ${rect.top >= 0 ? '✅ No overlap' : '❌ Overlapping'}`);
        }
    });
}

// Test navigation between sections to verify positioning
if (window.NavigationComponent && window.NavigationComponent.switchTab) {
    setTimeout(() => {
        console.log('🔄 Testing Integration section...');
        window.NavigationComponent.switchTab('integration');
        setTimeout(() => checkSectionPositioning(), 500);
    }, 1000);
    
    setTimeout(() => {
        console.log('🔄 Testing Infrastructure section...');
        window.NavigationComponent.switchTab('infrastructure');
        setTimeout(() => checkSectionPositioning(), 500);
    }, 2000);
    
    setTimeout(() => {
        console.log('🔄 Testing back to Operations...');
        window.NavigationComponent.switchTab('operations');
        setTimeout(() => checkSectionPositioning(), 500);
    }, 3000);
} else {
    console.log('❌ NavigationComponent not found - running static check');
    setTimeout(() => checkSectionPositioning(), 1000);
}
