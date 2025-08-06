# Claude Development Guide - Anti-Inflammatory Supplements Stack Builder

## Project Context
This is a Shopify-integrated web application for building personalized anti-inflammatory supplement protocols. The tool helps users discover and combine evidence-based supplements with detailed information about their effectiveness, dosing, and interactions.

## Project Structure
```
D:\OneDrive\CONTESTRA\Microapps\inflammation-supplements\
├── supplement-stack-builder.html    # Standalone version
├── supplement-stack-builder.js      # Core functionality
├── supplement-stack-builder-data.js # Supplement database
├── supplement-stack-builder.css     # Styling
├── page.supplements.liquid          # Shopify template
├── lucide.js                        # Icon library
├── README.md                        # User documentation
└── CLAUDE.md                        # This file
```

## Important Context for Development

### Current Implementation Status
✅ **Completed Features:**
- Full supplement database with 30+ entries
- Search, filter, and sort functionality
- Stack building with cost calculation
- Interaction checking system
- Shopify integration via custom template
- Responsive design for mobile/desktop
- Local storage for persistence

### Shopify Integration Details
**Live URL**: https://corhealth.com/pages/anti-inflammatory-supplements

**Theme Files Location**:
- Templates: `page.supplements.liquid`
- Assets: All JS/CSS files

**Known Issues**:
- Development theme by "Nitesh" may show different content when logged in as admin
- Use incognito mode to test live customer view
- Page access was initially blocked by a banner in development theme

### Key Technical Decisions

#### Why Vanilla JavaScript?
- Shopify compatibility without build process
- Minimal dependencies for easier maintenance
- Fast loading without framework overhead
- Direct integration with Shopify's Liquid templates

#### Data Structure Design
```javascript
// Each supplement has this structure:
{
  id: 'unique_id',
  name: 'Display Name',
  category: 'Category',
  antiInflammatoryPotential: 9.0,  // 1-10 scale, primary sort
  evidence: { score: 92, studies: 156 },
  recommendedDose: 'Dosage string',
  timing: 'When to take',
  costPerDay: 0.75,
  // ... additional fields
}
```

#### Interaction System
- Stored in `interactionDatabase` array
- Types: 'caution', 'timing', 'absorption', 'synergy'
- Severity levels affect stack score calculation

## Common Development Tasks

### Adding New Supplements
1. Edit `supplement-stack-builder-data.js`
2. Add to `supplements` array with all required fields
3. Ensure `antiInflammatoryPotential` is set (used for default sort)
4. Add any interactions to `interactionDatabase`

### Modifying Styling
- Primary color: `rgb(4, 61, 85)` (COR Health brand)
- Font: DM Sans
- Keep responsive breakpoints: 768px, 990px
- Test with Shopify theme header/footer

### Updating Shopify Files
```bash
# Files to update in Shopify Admin:
1. Online Store → Themes → Edit code → Assets
   - Upload: supplement-stack-builder.js
   - Upload: supplement-stack-builder-data.js
   - Upload: supplement-stack-builder.css
   
2. Online Store → Themes → Edit code → Templates
   - Update: page.supplements.liquid
```

## Testing Checklist
- [ ] Test in incognito mode (live view)
- [ ] Check all three tabs work (Browse, Templates, My Stack)
- [ ] Verify sort dropdown shows "Sort by:" prefix
- [ ] Confirm supplements sort by Anti-Inflammatory Score by default
- [ ] Test search functionality
- [ ] Verify category filters
- [ ] Add/remove supplements from stack
- [ ] Check cost calculation updates
- [ ] Test interaction warnings
- [ ] Verify local storage persistence
- [ ] Check responsive design on mobile

## Common Issues & Solutions

### "Secured Access" Page
**Issue**: Page shows login prompt
**Solution**: This was development theme interference. Use incognito or check theme status.

### Icons Not Showing
**Issue**: Lucide icons missing
**Solution**: Ensure lucide.js is uploaded to Assets and script loads after DOM

### Sort Not Working
**Issue**: Supplements don't sort properly
**Solution**: Check `antiInflammatoryPotential` field exists in data and JS file is updated

### Duplicate Headings
**Issue**: Two H1 tags showing
**Solution**: Template uses Shopify's page title, removed hardcoded H1 from app header

## Performance Considerations
- Total bundle size: ~50KB (excluding icons)
- No external API calls
- LocalStorage for state persistence
- Lazy loading for modal content
- CSS animations use transform/opacity for GPU acceleration

## Security Notes
- No server-side processing
- No user data collection
- Input sanitization for search
- XSS protection through textContent (not innerHTML)
- No external dependencies except Lucide icons

## Future Development Notes

### Potential Enhancements
1. **Product Integration**: Link supplements to actual Shopify products
2. **User Accounts**: Save multiple stacks per user
3. **Email Export**: Send stack details via email
4. **Timing Calendar**: Visual schedule for supplement timing
5. **Research Links**: Direct PubMed/study links in details

### React Migration Path
If converting to React:
```javascript
// Component structure:
- App.jsx
  - Header.jsx
  - TabNavigation.jsx
  - BrowseTab.jsx
    - SearchBar.jsx
    - CategoryFilter.jsx
    - SupplementGrid.jsx
  - TemplatesTab.jsx
  - MyStackTab.jsx
    - StackItem.jsx
    - InteractionPanel.jsx
    - StackSummary.jsx
  - SupplementModal.jsx
```

### API Integration Considerations
- Could pull supplement data from external API
- Real-time pricing from supplement vendors
- User reviews/ratings system
- Professional recommendations engine

## Deployment Commands

### Local Testing
```bash
# Open standalone version
open supplement-stack-builder.html

# Start local server if needed
python -m http.server 8000
```

### Shopify Deployment
1. Always test in development theme first
2. Use theme preview before publishing
3. Clear cache after updates
4. Monitor browser console for errors

## Contact & Support
- **Project**: COR Health Anti-Inflammatory Supplements
- **Platform**: Shopify
- **Related Project**: inflammation-foods (React app in same parent directory)

## Important File Paths
- **Correct Local Path**: `D:\OneDrive\CONTESTRA\Microapps\inflammation-supplements\`
- **NOT**: `inflammation-foods\anti-inflammatory-supplements\` (wrong subdirectory)
- **Shopify URL**: https://corhealth.com/pages/anti-inflammatory-supplements

## Version History
- **v1.0**: Initial implementation with core features
- **v1.1**: Fixed sort dropdown, removed duplicate heading, added footer padding
- **v1.2**: Updated sort to use Anti-Inflammatory Score as default

## Notes for Claude (AI Assistant)

When working on this project:
1. Always use the correct directory path (inflammation-supplements, not inflammation-foods)
2. Remember Shopify template constraints (no external scripts from CDNs)
3. Test changes affect both standalone HTML and Shopify template
4. Default sort is by antiInflammatoryPotential, not evidence score
5. The page title comes from Shopify, don't add another H1
6. Use incognito mode to test live site without development theme interference
7. Coordinate with team member "Nitesh" if working on development theme

## Quick Commands for Updates

```bash
# Copy files to Shopify (conceptual - actual upload via Admin UI)
# Assets: *.js, *.css
# Templates: page.supplements.liquid

# Test locally
open supplement-stack-builder.html

# Check which files changed
git status

# View live site
open https://corhealth.com/pages/anti-inflammatory-supplements
```

---

*Last Updated: 2024*
*Tool Purpose: Educational information about anti-inflammatory supplements*
*Medical Disclaimer: Not medical advice - users should consult healthcare providers*