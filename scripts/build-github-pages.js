#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function buildGitHubPages() {
    console.log('🚀 Building GitHub Pages version...');
    
    try {
        // Read the main index.html
        const indexPath = path.join(__dirname, '..', 'index.html');
        let indexContent = fs.readFileSync(indexPath, 'utf8');
        
        // Read CSS file
        const cssPath = path.join(__dirname, '..', 'styles', 'main.css');
        const cssContent = fs.readFileSync(cssPath, 'utf8');
        
        // Read all component files
        const componentsDir = path.join(__dirname, '..', 'components');
        const components = {};
        
        function readComponentsRecursively(dir, prefix = '') {
            const items = fs.readdirSync(dir);
            
            for (const item of items) {
                const itemPath = path.join(dir, item);
                const stat = fs.statSync(itemPath);
                
                if (stat.isDirectory()) {
                    readComponentsRecursively(itemPath, prefix + item + '/');
                } else if (item.endsWith('.html')) {
                    const componentName = prefix + item.replace('.html', '');
                    const componentContent = fs.readFileSync(itemPath, 'utf8');
                    components[componentName] = componentContent;
                }
            }
        }
        
        readComponentsRecursively(componentsDir);
        
        // Replace CSS link with inline styles
        indexContent = indexContent.replace(
            '<link rel="stylesheet" href="./styles/main.css">',
            `<style>\n${cssContent}\n</style>`
        );
        
        // Remove the module script and replace with inline components
        indexContent = indexContent.replace(
            /<script type="module">[\s\S]*?<\/script>/,
            generateInlineHTML(components)
        );
        
        // Write the built file
        const outputPath = path.join(__dirname, '..', 'dist', 'index.html');
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        fs.writeFileSync(outputPath, indexContent);
        
        console.log('✅ GitHub Pages version built successfully!');
        console.log(`📁 Output: ${outputPath}`);
        
    } catch (error) {
        console.error('❌ Build failed:', error);
        process.exit(1);
    }
}

function generateInlineHTML(components) {
    return `
    <!-- All components embedded inline for GitHub Pages -->
    <script>
        // Navigation component
        document.getElementById('navbar-container').innerHTML = \`${escapeTemplate(components['navigation/navbar'] || '<div>Navigation loading...</div>')}\`;
        
        // Operations/Management components
        document.getElementById('hero-container').innerHTML = \`${escapeTemplate(components['management/hero'] || '<div>Hero loading...</div>')}\`;
        document.getElementById('features-container').innerHTML = \`${escapeTemplate(components['management/features'] || '<div>Features loading...</div>')}\`;
        document.getElementById('solutions-container').innerHTML = \`${escapeTemplate(components['management/solutions'] || '<div>Solutions loading...</div>')}\`;
        
        // Section components
        document.getElementById('success-stories-container').innerHTML = \`${escapeTemplate(components['sections/success-stories'] || '<div>Success stories loading...</div>')}\`;
        document.getElementById('pricing-container').innerHTML = \`${escapeTemplate(components['sections/pricing'] || '<div>Pricing loading...</div>')}\`;
        document.getElementById('contact-container').innerHTML = \`${escapeTemplate(components['sections/contact'] || '<div>Contact loading...</div>')}\`;
        
        // Integration components
        document.getElementById('partner-connectors-container').innerHTML = \`${escapeTemplate(components['integration/partner-connectors'] || '<div>Partner connectors loading...</div>')}\`;
        document.getElementById('bi-solutions-container').innerHTML = \`${escapeTemplate(components['integration/bi-solutions'] || '<div>BI solutions loading...</div>')}\`;
        document.getElementById('erp-integration-container').innerHTML = \`${escapeTemplate(components['integration/erp-integration'] || '<div>ERP integration loading...</div>')}\`;
        document.getElementById('contact-container-integration').innerHTML = \`${escapeTemplate(components['sections/contact'] || '<div>Contact loading...</div>')}\`;
        
        // Infrastructure components
        document.getElementById('bluecontrol-models-container').innerHTML = \`${escapeTemplate(components['infrastructure/bluecontrol-models'] || '<div>BlueControl models loading...</div>')}\`;
        document.getElementById('global-infrastructure-container').innerHTML = \`${escapeTemplate(components['infrastructure/global-infrastructure'] || '<div>Global infrastructure loading...</div>')}\`;
        document.getElementById('data-security-container').innerHTML = \`${escapeTemplate(components['infrastructure/data-security'] || '<div>Data security loading...</div>')}\`;
        document.getElementById('infrastructure-container').innerHTML = \`${escapeTemplate(components['infrastructure/infrastructure'] || '<div>Infrastructure loading...</div>')}\`;
        document.getElementById('contact-container-infrastructure').innerHTML = \`${escapeTemplate(components['sections/contact'] || '<div>Contact loading...</div>')}\`;
        
        // Applications components
        document.getElementById('mobile-app-container').innerHTML = \`${escapeTemplate(components['applications/mobile-app'] || '<div>Mobile app loading...</div>')}\`;
        document.getElementById('survey-webapp-container').innerHTML = \`${escapeTemplate(components['applications/survey-webapp'] || '<div>Survey webapp loading...</div>')}\`;
        document.getElementById('boards-webapp-container').innerHTML = \`${escapeTemplate(components['applications/boards-webapp'] || '<div>Boards webapp loading...</div>')}\`;
        document.getElementById('silo-webapp-container').innerHTML = \`${escapeTemplate(components['applications/silo-webapp'] || '<div>Silo webapp loading...</div>')}\`;
        document.getElementById('reference-webapp-container').innerHTML = \`${escapeTemplate(components['applications/reference-webapp'] || '<div>Reference webapp loading...</div>')}\`;
        document.getElementById('alarm-webapp-container').innerHTML = \`${escapeTemplate(components['applications/alarm-webapp'] || '<div>Alarm webapp loading...</div>')}\`;
        document.getElementById('analytics-webapp-container').innerHTML = \`${escapeTemplate(components['applications/analytics-webapp'] || '<div>Analytics webapp loading...</div>')}\`;
        document.getElementById('contact-container-applications').innerHTML = \`${escapeTemplate(components['sections/contact'] || '<div>Contact loading...</div>')}\`;
        
        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        console.log('🎉 All components loaded inline for GitHub Pages!');
    </script>`;
}

function escapeTemplate(html) {
    return html
        .replace(/\\/g, '\\\\')
        .replace(/`/g, '\\`')
        .replace(/\${/g, '\\${');
}

// Run the build
buildGitHubPages();
