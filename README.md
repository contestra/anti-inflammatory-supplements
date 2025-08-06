# Anti-Inflammatory Supplements Stack Builder

## Overview
An interactive web application for building personalized anti-inflammatory supplement protocols. This tool helps users discover, research, and combine evidence-based supplements with detailed information about their anti-inflammatory potential, dosing, and interactions.

## Features

### 🔍 Browse Supplements
- **Comprehensive Database**: Curated collection of anti-inflammatory supplements with evidence scores
- **Smart Search**: Search by name, description, or key compounds
- **Category Filters**: Filter by Omega-3, Polyphenols, Vitamins, Minerals, Herbs, Enzymes, Amino Acids
- **Sorting Options**: 
  - Sort by Anti-Inflammatory Score (default)
  - Sort by Name A-Z
- **View Modes**: Toggle between grid and list views

### 📊 Evidence-Based Information
Each supplement includes:
- **Anti-Inflammatory Score** (1-10 scale)
- **Evidence Score** with study count
- **Recommended Dosage** and timing
- **Cost per Day** estimate
- **Safety Rating**
- **Key Benefits** and mechanisms of action
- **Potential Side Effects**
- **Different Forms** available
- **Evidence Breakdown**: Meta-analyses, RCTs, clinical studies

### 🎯 Stack Templates
Pre-configured supplement combinations for specific goals:
- **Basic Anti-Inflammatory**: Foundation stack for beginners
- **Advanced Protocol**: Comprehensive inflammation support
- **Joint Support**: Targeted joint health
- **Cognitive Support**: Brain inflammation and neuroprotection
- **Cardiovascular**: Heart and vascular health
- **Gut Health**: Intestinal inflammation support

### 💼 My Stack Feature
- **Build Custom Stacks**: Add supplements to create personalized protocols
- **Dose Adjustment**: Modify doses with multiplier (0.5x to 5x)
- **Cost Calculator**: Real-time total daily cost calculation
- **Pill Counter**: Track total pills per day
- **Interaction Checker**: Identifies potential interactions and synergies
- **Export Function**: Save stack information
- **Local Storage**: Persists selections between sessions

### 🔬 Supplement Details Modal
Detailed view for each supplement showing:
- Full description and mechanism of action
- Evidence breakdown with study details
- Available forms and preparations
- Timing recommendations
- Drug interactions
- Safety considerations

## Technical Implementation

### Architecture
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Icons**: Lucide icon library
- **Storage**: Browser localStorage for persistence
- **Responsive**: Mobile-first responsive design
- **Platform**: Shopify integration ready

### File Structure
```
inflammation-supplements/
├── supplement-stack-builder.html    # Standalone HTML version
├── supplement-stack-builder.js      # Main application logic
├── supplement-stack-builder-data.js # Supplement database
├── supplement-stack-builder.css     # Styling
├── page.supplements.liquid          # Shopify template
├── lucide.js                        # Icon library
└── README.md                        # Documentation
```

### Key Components

#### JavaScript (`supplement-stack-builder.js`)
- **State Management**: Centralized app state object
- **Event Handlers**: Tab navigation, search, filters, sorting
- **Stack Management**: Add/remove supplements, calculate totals
- **Interaction Detection**: Checks for contraindications and synergies
- **Template System**: Dynamic HTML generation
- **Local Storage**: Save/load user stacks

#### Data Structure (`supplement-stack-builder-data.js`)
```javascript
{
  id: 'omega3',
  name: 'Fish Oil (EPA/DHA)',
  category: 'Omega-3',
  antiInflammatoryPotential: 9.0,
  evidence: { score: 92, studies: 156 },
  recommendedDose: '2-4g EPA/DHA daily',
  costPerDay: 0.75,
  // ... additional properties
}
```

#### Styling (`supplement-stack-builder.css`)
- **Design System**: COR Health brand colors (rgb(4, 61, 85))
- **Typography**: DM Sans font family
- **Layout**: Responsive grid system
- **Components**: Cards, buttons, modals, badges
- **Animations**: Smooth transitions and hover effects

## Shopify Integration

### Setup Steps
1. **Upload Assets**:
   - Upload JS, CSS, and data files to theme Assets folder
   - Upload lucide.js icon library

2. **Create Template**:
   - Create `page.supplements.liquid` in Templates folder
   - Template includes page layout with header/footer

3. **Create Page**:
   - Create new page in Shopify admin
   - Assign "supplements" template
   - Set visibility to public

### Template Structure
- Uses Shopify's Liquid templating
- Includes theme header/footer automatically
- References assets using `{{ 'filename' | asset_url }}`
- Custom styles for spacing and layout adjustments

## Supplement Database

### Current Supplements (Sample)
- **Omega-3**: Fish Oil, Krill Oil, Algae Oil
- **Polyphenols**: Curcumin, Resveratrol, Quercetin, EGCG
- **Vitamins**: Vitamin D3, Vitamin C
- **Minerals**: Magnesium, Zinc
- **Herbs**: Boswellia, Ginger, Ashwagandha
- **Enzymes**: Bromelain, Serrapeptase
- **Other**: Probiotics, NAD+ precursors, SPMs

### Interaction Database
Tracks both positive synergies and potential conflicts:
- **Synergies**: Combinations that enhance effectiveness
- **Timing Conflicts**: Supplements that shouldn't be taken together
- **Absorption Issues**: Minerals that compete for absorption
- **Safety Warnings**: Blood thinning combinations, etc.

## User Experience Flow

1. **Browse**: User explores supplements by category or search
2. **Research**: Click "Details" for in-depth information
3. **Select**: Add supplements to personal stack
4. **Customize**: Adjust doses based on needs
5. **Review**: Check interactions and total costs
6. **Export**: Save stack information for reference

## Future Enhancements

### Planned Features
- **User Accounts**: Save multiple stacks
- **Scheduling**: Time-of-day recommendations
- **Brands**: Specific product recommendations
- **Research Links**: Direct PubMed citations
- **Progress Tracking**: Monitor inflammation markers
- **AI Recommendations**: Personalized suggestions
- **Shopping Integration**: Add to cart functionality

### Technical Improvements
- **React Migration**: Convert to React for better state management
- **API Integration**: Dynamic data updates
- **Analytics**: Track popular combinations
- **A/B Testing**: Optimize user experience
- **PWA**: Offline functionality

## Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance
- Initial load: < 50KB (excluding icons)
- Time to interactive: < 1 second
- Lighthouse score: 95+
- No external dependencies (except icons)

## Accessibility
- Keyboard navigation support
- ARIA labels for screen readers
- Color contrast compliance
- Focus indicators
- Responsive text sizing

## Security Considerations
- No server-side processing
- No personal data collection
- LocalStorage only (client-side)
- XSS protection through proper escaping
- No external API calls

## Maintenance

### Updating Supplements
Edit `supplement-stack-builder-data.js`:
1. Add new supplement objects to array
2. Include all required properties
3. Update interaction database if needed

### Styling Changes
Edit `supplement-stack-builder.css`:
- Maintain brand consistency
- Test responsive breakpoints
- Verify Shopify theme compatibility

### Shopify Updates
1. Upload changed files to Assets
2. Clear theme cache if needed
3. Test in both logged-in and incognito modes

## Support
For issues or questions about implementation:
- Check browser console for errors
- Verify all files are uploaded to Shopify
- Ensure template is assigned to page
- Test in incognito mode to bypass cache

## License
Proprietary - COR Health
© 2024 COR Health. All rights reserved.

## Credits
- **Developer**: CONTESTRA
- **Platform**: Shopify
- **Icons**: Lucide Icons
- **Font**: DM Sans (Google Fonts)

---

*This tool provides educational information about supplements and is not medical advice. Users should consult healthcare providers before starting any supplement regimen.*