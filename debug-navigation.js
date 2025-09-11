// Navigation Test Script
// Paste this into the browser console to test navigation manually

console.log('=== Navigation Debug Test ===');

// Test 1: Check if sections exist
const sections = document.querySelectorAll('main > section[id$="-section"]');
console.log(`Found ${sections.length} main sections:`);
sections.forEach(section => {
    console.log(`- ${section.id}: ${section.style.display || 'visible'}`);
});

// Test 2: Check if navigation tabs exist
const navTabs = document.querySelectorAll('.nav-tab');
console.log(`Found ${navTabs.length} navigation tabs:`);
navTabs.forEach(tab => {
    console.log(`- ${tab.textContent.trim()}: data-section="${tab.getAttribute('data-section')}"`);
});

// Test 3: Check if navigation component is initialized
console.log(`Navigation component initialized: ${window.NavigationComponent?.initialized || false}`);

// Test 4: Manual section switch
function testSectionSwitch(sectionName) {
    console.log(`Testing switch to: ${sectionName}`);
    
    // Hide all sections
    sections.forEach(sec => sec.style.display = 'none');
    
    // Show target section
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
        targetSection.style.display = 'block';
        console.log(`✓ Successfully switched to ${sectionName} section`);
    } else {
        console.log(`✗ Section not found: ${sectionName}-section`);
    }
}

// Run tests for each section
['management', 'integration', 'infrastructure', 'company', 'sales'].forEach(testSectionSwitch);

console.log('=== Test Complete ===');
console.log('Try clicking the navigation tabs now to see if they work!');
