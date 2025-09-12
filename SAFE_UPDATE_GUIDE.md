# FarmOnline+ Safe Update Guide

## 🎯 **Quick Reference for Safe Updates**

### **✅ ALWAYS SAFE Operations:**

#### **Content Updates:**
```bash
# Edit any component file directly
components/management/hero.html          # Operations hero content
components/integration/sections.html    # Integration content  
components/infrastructure/sections.html # Infrastructure content
components/applications/sections.html   # Applications content
components/sections/pricing.html        # Shared pricing content
components/sections/contact.html        # Shared contact content
```

#### **Safe Workflow:**
```bash
1. Edit component files in components/ directory
2. Test: npm run dev
3. Deploy: .\deploy-github-pages.ps1  
4. Verify: https://skovnbo.github.io/FarmOnline-/
```

### **⚠️ REQUIRES CAREFUL ATTENTION:**

#### **Navigation Updates:**
When adding new sections or changing section IDs:

1. **Update component file** with new section
2. **Update navigation links** in `components/navigation/nav.html`
3. **Test navigation** thoroughly before deploying

#### **Section ID Changes:**
```html
<!-- If changing this: -->
<section id="hero" class="hero">

<!-- Update these navigation links: -->
<a href="#hero" class="submenu-link">Farm Overview</a>
```

### **❌ NEVER DO:**

- ❌ Edit `index.html` directly (gets overwritten by deploy script)
- ❌ Remove content-section divs from `index-dev.html`
- ❌ Change data-section attributes without updating navigation
- ❌ Modify main.js navigation logic without understanding the flow

### **🔍 Content Section Mapping:**

```
Operations (data-section="operations"):
├── #hero → components/management/hero.html
├── #overview → components/management/overview.html  
├── #features → components/management/features.html
└── #benefits → components/management/benefits.html

Integration (data-section="integration"):
├── #partner-connectors → components/integration/sections.html
├── #bi-solutions → components/integration/sections.html
└── #erp-integration → components/integration/sections.html

Infrastructure (data-section="infrastructure"):  
├── #bluecontrol-models → components/infrastructure/sections.html
├── #global-infrastructure → components/infrastructure/sections.html
└── #data-security → components/infrastructure/sections.html

Applications (data-section="applications"):
├── #mobile-app → components/applications/sections.html
├── #survey-webapp → components/applications/sections.html  
├── #boards-webapp → components/applications/sections.html
└── #analytics-webapp → components/applications/sections.html

Shared (always visible):
├── #pricing → components/sections/pricing.html
└── #contact → components/sections/contact.html
```

### **🚨 Emergency Recovery:**

If navigation breaks:
1. Check browser console for JavaScript errors
2. Verify data-section attributes match between navigation and content
3. Ensure all referenced section IDs actually exist
4. Revert to last working commit if needed

### **📋 Pre-Update Checklist:**

Before making changes:
- [ ] Identify which content section the change affects
- [ ] Locate the correct component file
- [ ] Check if navigation links need updating
- [ ] Plan testing strategy

After making changes:
- [ ] Test locally with `npm run dev`
- [ ] Verify all navigation works
- [ ] Check responsive design
- [ ] Deploy and verify production site

### **🎓 Understanding the Architecture:**

**HOC Pattern:** Each component file is a Higher-Order Component
- Self-contained HTML with specific functionality
- Can be developed and tested independently  
- Composable with other components
- Maintains consistent structure and styling

**Hierarchical Navigation:** 
- Main tabs control content section visibility
- Submenu items scroll within active content section
- Shared sections always visible across all tabs

**Build Process:**
- Development: Dynamic component loading
- Production: Pre-built component embedding
- Single source of truth in component files
