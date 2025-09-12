#
# ╔══════════════════════════════════════════════════════════════════════════════════════════════╗
# ║                          FARMONLINE+ GITHUB PAGES DEPLOYMENT SCRIPT                         ║
# ╠══════════════════════════════════════════════════════════════════════════════════════════════╣
# ║                                                                                              ║
# ║  PURPOSE: Component embedding and production build system for GitHub Pages deployment       ║
# ║                                                                                              ║
# ║  PROCESS:                                                                                    ║
# ║  1. Read index-dev.html as base template with component placeholders                        ║
# ║  2. Load all component HTML files from components/ directory                                ║
# ║  3. Replace comment placeholders with actual component content                              ║
# ║  4. Generate optimized index.html for GitHub Pages                                          ║
# ║  5. Commit and push to GitHub repository                                                    ║
# ║                                                                                              ║
# ║  COMPONENT EMBEDDING MAPPING:                                                                ║
# ║  <!-- NAV_COMPONENT --> → components/navigation/nav.html                                    ║
# ║  <!-- MANAGEMENT_*_COMPONENT --> → components/management/*.html                             ║
# ║  <!-- INTEGRATION_SECTIONS_COMPONENT --> → components/integration/sections.html            ║
# ║  <!-- INFRASTRUCTURE_SECTIONS_COMPONENT --> → components/infrastructure/sections.html      ║
# ║  <!-- APPLICATIONS_SECTIONS_COMPONENT --> → components/applications/sections.html          ║
# ║  <!-- PRICING_COMPONENT --> → components/sections/pricing.html                             ║
# ║  <!-- CONTACT_COMPONENT --> → components/sections/contact.html                             ║
# ║  <!-- FOOTER_COMPONENT --> → components/footer.html                                        ║
# ║                                                                                              ║
# ║  ADVANTAGES:                                                                                 ║
# ║  • Single file deployment (GitHub Pages compatible)                                         ║
# ║  • No runtime component loading overhead                                                    ║
# ║  • All components pre-embedded for faster loading                                           ║
# ║  • Maintains development modularity with production optimization                            ║
# ║                                                                                              ║
# ║  ERROR HANDLING:                                                                             ║
# ║  • Missing components logged but don't break build                                          ║
# ║  • Preserves placeholders for missing files                                                 ║
# ║  • Git operations have error checking                                                       ║
# ║                                                                                              ║
# ║  HOC RELATIONSHIP:                                                                           ║
# ║  • Each component file is a self-contained HOC                                              ║
# ║  • Build process composes HOCs into final application                                       ║
# ║  • Maintains component boundaries in final output                                           ║
# ║                                                                                              ║
# ║  USAGE:                                                                                      ║
# ║  .\deploy-github-pages.ps1                                                                  ║
# ║                                                                                              ║
# ║  ⚠️  WARNING: This overwrites index.html - never edit index.html directly!                  ║
# ║                                                                                              ║
# ╚══════════════════════════════════════════════════════════════════════════════════════════════╝
#

# GitHub Pages Deployment Script
# This script creates a single-file version for GitHub Pages deployment

Write-Host "Starting GitHub Pages deployment..." -ForegroundColor Green

# Check if components directory exists
if (!(Test-Path "components")) {
    Write-Host "Error: components directory not found!" -ForegroundColor Red
    exit 1
}

# Read the base template
$baseContent = Get-Content "index-dev.html" -Raw

# Read all component files and replace placeholders
$componentFiles = @{
    "components/hero.html" = "<!-- HERO_COMPONENT -->"
    "components/navigation/nav.html" = "<!-- NAV_COMPONENT -->"
    "components/sections/about.html" = "<!-- ABOUT_COMPONENT -->"
    "components/sections/services.html" = "<!-- SERVICES_COMPONENT -->"
    "components/sections/team.html" = "<!-- TEAM_COMPONENT -->"
    "components/sections/pricing.html" = "<!-- PRICING_COMPONENT -->"
    "components/sections/contact.html" = "<!-- CONTACT_COMPONENT -->"
    "components/footer.html" = "<!-- FOOTER_COMPONENT -->"
    "components/management/hero.html" = "<!-- MANAGEMENT_HERO_COMPONENT -->"
    "components/management/overview.html" = "<!-- MANAGEMENT_OVERVIEW_COMPONENT -->"
    "components/management/features.html" = "<!-- MANAGEMENT_FEATURES_COMPONENT -->"
    "components/management/benefits.html" = "<!-- MANAGEMENT_BENEFITS_COMPONENT -->"
    "components/integration/sections.html" = "<!-- INTEGRATION_SECTIONS_COMPONENT -->"
    "components/infrastructure/sections.html" = "<!-- INFRASTRUCTURE_SECTIONS_COMPONENT -->"
    "components/applications/sections.html" = "<!-- APPLICATIONS_SECTIONS_COMPONENT -->"
    "components/analytics/hero.html" = "<!-- ANALYTICS_HERO_COMPONENT -->"
    "components/analytics/overview.html" = "<!-- ANALYTICS_OVERVIEW_COMPONENT -->"
    "components/analytics/features.html" = "<!-- ANALYTICS_FEATURES_COMPONENT -->"
    "components/analytics/benefits.html" = "<!-- ANALYTICS_BENEFITS_COMPONENT -->"
}

foreach ($componentFile in $componentFiles.Keys) {
    if (Test-Path $componentFile) {
        $componentContent = Get-Content $componentFile -Raw
        $placeholder = $componentFiles[$componentFile]
        $baseContent = $baseContent -replace [regex]::Escape($placeholder), $componentContent
        Write-Host "Embedded $componentFile" -ForegroundColor Cyan
    } else {
        Write-Host "Component not found: $componentFile" -ForegroundColor Yellow
    }
}

# Remove component loading script since we're embedding everything
$baseContent = $baseContent -replace '<script src="scripts/component-loader\.js"></script>', ''

# Remove the loading indicator since we're embedding everything
$baseContent = $baseContent -replace '    <!-- Loading Indicator -->\s*<div id="loading"[^>]*>.*?</div>\s*', ''

# Remove content section divs since we're creating a single page
$baseContent = $baseContent -replace '<div class="content-section"[^>]*>', ''
$baseContent = $baseContent -replace '</div>\s*<!-- Integration Sections -->', '<!-- Integration Sections -->'
$baseContent = $baseContent -replace '</div>\s*<!-- Shared Sections -->', '<!-- Shared Sections -->'

# Ensure Lucide icons are included for navigation functionality
if (-not ($baseContent -like "*lucide*")) {
    $baseContent = $baseContent -replace '</head>', '    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
</head>'
}

# Save as index.html for GitHub Pages
$baseContent | Out-File -FilePath "index.html" -Encoding UTF8

Write-Host "Created index.html for GitHub Pages" -ForegroundColor Green

# Add, commit, and push to GitHub
Write-Host "Committing changes to GitHub..." -ForegroundColor Green

git add index.html
$commitMessage = "Deploy: Updated hero content - Results-Driven Intelligence"
git commit -m $commitMessage

if ($LASTEXITCODE -eq 0) {
    Write-Host "Changes committed" -ForegroundColor Green
    
    Write-Host "Pushing to GitHub..." -ForegroundColor Green
    git push origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Successfully deployed to GitHub Pages!" -ForegroundColor Green
    } else {
        Write-Host "Failed to push to GitHub" -ForegroundColor Red
    }
} else {
    Write-Host "No changes to commit" -ForegroundColor Yellow
}

Write-Host "Deployment script completed." -ForegroundColor Green
