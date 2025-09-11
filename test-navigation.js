// Navigation Test Script
// Open browser console and run this to test navigation functionality

console.log('🧪 Testing Navigation Functionality...');

// Test if main navigation buttons exist
const mainButtons = document.querySelectorAll('[data-tab]');
console.log(`Found ${mainButtons.length} main navigation buttons:`, Array.from(mainButtons).map(btn => btn.textContent));

// Test if sections exist
const sections = ['operations-section', 'integration-section', 'infrastructure-section', 'sales-section'];
sections.forEach(sectionId => {
    const section = document.getElementById(sectionId);
    console.log(`Section ${sectionId}:`, section ? '✅ Found' : '❌ Missing');
    
    // Test specific content for reorganized sections
    if (sectionId === 'operations-section') {
        const successStories = document.getElementById('success-stories-container');
        console.log(`  - Success Stories in Operations: ${successStories ? '✅ Found' : '❌ Missing'}`);
        const pricing = document.getElementById('pricing-container');
        console.log(`  - Pricing in Operations: ${pricing ? '✅ Found' : '❌ Missing'}`);
    }
    
    if (sectionId === 'integration-section') {
        const ecosystem = document.getElementById('ecosystem-container');
        console.log(`  - Ecosystem in Integration: ${ecosystem ? '✅ Found' : '❌ Missing'}`);
    }
});

// Test navigation function
if (window.NavigationComponent && window.NavigationComponent.switchTab) {
    console.log('🔄 Testing section switching...');
    
    // Test switching to Integration
    setTimeout(() => {
        console.log('Switching to Integration section...');
        window.NavigationComponent.switchTab('integration');
    }, 1000);
    
    // Test switching to Infrastructure  
    setTimeout(() => {
        console.log('Switching to Infrastructure section...');
        window.NavigationComponent.switchTab('infrastructure');
    }, 2000);
    
    // Switch back to Operations
    setTimeout(() => {
        console.log('Switching back to Operations section...');
        window.NavigationComponent.switchTab('operations');
    }, 3000);
} else {
    console.log('❌ NavigationComponent.switchTab not found');
}

// Test favicon loading
console.log('🎨 Checking favicon...');
const favicon = document.querySelector('link[rel="icon"]');
if (favicon) {
    console.log('✅ Favicon link found:', favicon.href);
    
    // Test if favicon actually loads
    const img = new Image();
    img.onload = () => console.log('✅ Favicon loaded successfully');
    img.onerror = () => console.log('❌ Favicon failed to load');
    img.src = favicon.href;
} else {
    console.log('❌ Favicon link not found');
}
