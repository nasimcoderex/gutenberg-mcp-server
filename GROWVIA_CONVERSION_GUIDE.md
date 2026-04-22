# Growvia Landing Page - WordPress Gutenberg Conversion Guide

This guide explains how to convert the Growvia Analytics landing page (HTML/CSS) into a WordPress page using Gutenberg blocks via the MCP server.

## Overview

The original landing page has been analyzed and converted into Gutenberg block structure. The conversion maintains the design system including:

- **Colors**: Primary green (#22d3a8), accent violet (#6c5cff), backgrounds, text colors
- **Typography**: Space Grotesk for headings, Inter for body text
- **Spacing**: Consistent padding and margins
- **Layout**: Full-width sections, constrained content areas, multi-column grids
- **Components**: Hero, features, pricing, FAQ, CTA sections

## Page Structure

### 1. Hero Section
- Full-width group with gradient background
- Eyebrow label (WordPress Plugin · WooCommerce)
- Large heading
- Description paragraph
- CTA buttons (primary gradient + outline)
- Trust indicators (ratings, active stores, reports)

### 2. Logo Trust Bar
- Full-width section with border top/bottom
- Centered text
- Logo grid (company names)

### 3. Features Section
- Full-width with light background (#f6f8fb)
- Section header (centered, constrained width)
- 3-column grid of feature cards
- Each card: emoji icon, heading, description
- White cards with border and hover effects

### 4. How It Works Section
- 3-column layout
- Step numbers with styling
- Headings and descriptions

### 5. Testimonial Section
- Centered quote
- Author attribution

### 6. Pricing Section
- 3-column grid
- Pricing cards with different tiers
- Featured card with gradient border
- Badge for "Most popular"
- Feature lists with checkmarks

### 7. FAQ Section
- Accordion-style (details/summary)
- Questions and answers
- Expandable sections

### 8. CTA Band
- Dark background with gradient overlay
- Centered content
- Large heading and CTA button

### 9. Footer
- Dark background
- Multi-column layout
- Logo, links, legal info

## Using the MCP Server

### Method 1: Using the JSON File

The `growvia-page-blocks.json` file contains a partial conversion. To use it:

```javascript
// Read the JSON file
const pageData = require('./growvia-page-blocks.json');

// Use with MCP server
// The MCP server will handle the conversion to WordPress block format
```

### Method 2: Direct MCP Tool Call

You can use the MCP server's `create_page` tool directly:

```
Create a WordPress page for "Growvia Analytics" with:
- Hero section with gradient background, heading "Every metric your WooCommerce store has been hiding", description about WooCommerce analytics, and two CTA buttons
- Trust bar showing "Trusted by WooCommerce stores"
- Features section with 3 columns: Revenue Intelligence, Customer Insights, Product Performance
- Each feature has an emoji icon, heading, and description
- Use colors: primary #22d3a8, accent #6c5cff, light background #f6f8fb
```

### Method 3: Section-by-Section Creation

Create the page in stages:

**Step 1: Create base page**
```
Create a draft page titled "Growvia Analytics - WooCommerce Analytics Plugin"
```

**Step 2: Add hero section**
```
Update page [ID] to add a hero section with:
- Full-width group, white background, 80px top padding, 60px bottom padding
- Eyebrow text "WordPress Plugin · WooCommerce" in violet (#6c5cff) with rounded background
- H1 heading "Every metric your WooCommerce store has been hiding"
- Paragraph describing the analytics features
- Two buttons: "Install Growvia" (gradient background) and "See it in action" (outline style)
```

**Step 3: Add features section**
```
Add a features section with:
- Full-width group, light gray background (#f6f8fb), 90px padding top/bottom
- Centered heading "In-depth analytics, built specifically for WooCommerce"
- 3-column layout with feature cards
- Card 1: 📈 Revenue Intelligence
- Card 2: 👥 Customer Insights  
- Card 3: 🛍️ Product Performance
- Each card has white background, border, rounded corners, padding
```

**Step 4: Continue adding sections**
Repeat for pricing, FAQ, CTA, and footer sections.

## Block Structure Reference

### Full-Width Section Pattern
```json
{
  "blockName": "core/group",
  "attrs": {
    "align": "full",
    "style": {
      "spacing": {
        "padding": {
          "top": "90px",
          "bottom": "90px"
        }
      },
      "color": {
        "background": "#f6f8fb"
      }
    }
  },
  "innerBlocks": [...]
}
```

### Constrained Content Pattern
```json
{
  "blockName": "core/group",
  "attrs": {
    "layout": {
      "type": "constrained",
      "contentSize": "1180px"
    }
  },
  "innerBlocks": [...]
}
```

### Feature Card Pattern
```json
{
  "blockName": "core/group",
  "attrs": {
    "style": {
      "spacing": {
        "padding": {
          "top": "26px",
          "bottom": "26px",
          "left": "26px",
          "right": "26px"
        }
      },
      "color": {
        "background": "#ffffff"
      },
      "border": {
        "radius": "14px",
        "width": "1px",
        "color": "#e6eaf2"
      }
    }
  },
  "innerBlocks": [
    {
      "blockName": "core/paragraph",
      "innerContent": "📈"
    },
    {
      "blockName": "core/heading",
      "attrs": { "level": 3 },
      "innerContent": "Feature Title"
    },
    {
      "blockName": "core/paragraph",
      "innerContent": "Feature description..."
    }
  ]
}
```

### Button Group Pattern
```json
{
  "blockName": "core/buttons",
  "innerBlocks": [
    {
      "blockName": "core/button",
      "attrs": {
        "style": {
          "color": {
            "background": "linear-gradient(135deg, #22d3a8 0%, #6c5cff 100%)"
          }
        }
      },
      "innerContent": "Primary Button"
    },
    {
      "blockName": "core/button",
      "attrs": {
        "className": "is-style-outline"
      },
      "innerContent": "Secondary Button"
    }
  ]
}
```

## Design Tokens

Use these values consistently throughout the page:

```css
/* Colors */
--primary: #22d3a8 (growth green)
--accent: #6c5cff (violet)
--bg: #0b1020 (dark background)
--bg-2: #0f1530 (darker background)
--surface: #ffffff (white)
--surface-alt: #f6f8fb (light gray)
--ink: #0b1020 (primary text)
--ink-2: #2a3147 (secondary text)
--muted: #5b6478 (muted text)
--line: #e6eaf2 (borders)

/* Spacing */
--radius: 14px (border radius)
Section padding: 90px top/bottom
Card padding: 26px all sides
Button padding: 14px vertical, 22px horizontal

/* Typography */
Headings: Space Grotesk, bold
Body: Inter, regular
H1: clamp(2.2rem, 4.6vw, 3.6rem)
H2: clamp(1.8rem, 3.2vw, 2.6rem)
H3: 1.18rem
Body: 1rem (16px base)
Small: 0.95rem
Tiny: 0.78rem
```

## Custom CSS Requirements

Some design elements require custom CSS that should be added to your WordPress theme:

### 1. Gradient Backgrounds
```css
.has-gradient-background {
  background: linear-gradient(135deg, #22d3a8 0%, #6c5cff 100%);
}
```

### 2. Button Hover Effects
```css
.wp-block-button__link:hover {
  transform: translateY(-1px);
  box-shadow: 0 16px 40px -12px rgba(34,211,168,.7);
}
```

### 3. Card Hover Effects
```css
.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 40px -12px rgba(15,21,48,.18);
}
```

### 4. Backdrop Blur for Nav
```css
.nav {
  backdrop-filter: saturate(160%) blur(12px);
}
```

## Limitations & Workarounds

### 1. Complex Gradients
**Issue**: Gutenberg doesn't natively support complex gradient backgrounds.
**Workaround**: Use custom CSS classes or inline styles in group blocks.

### 2. Mock Dashboard
**Issue**: The hero mock dashboard with charts is complex HTML/CSS.
**Workaround**: Create as an image or use a custom HTML block.

### 3. Floating Cards
**Issue**: Absolutely positioned floating cards aren't easily done in Gutenberg.
**Workaround**: Use image mockups or custom HTML blocks.

### 4. Logo Grid
**Issue**: Custom logo styling with letter-spacing.
**Workaround**: Use paragraph blocks with custom CSS classes.

### 5. Pricing Card Badges
**Issue**: Absolutely positioned badges on cards.
**Workaround**: Use custom HTML or position with negative margins.

## Complete Conversion Prompt

Use this comprehensive prompt with the MCP server:

```
Create a WordPress page titled "Growvia Analytics - WooCommerce Analytics Plugin" with the following structure:

HERO SECTION:
- Full-width group, white background, 80px top / 60px bottom padding
- Constrained content (1180px max-width)
- Eyebrow label: "WordPress Plugin · WooCommerce" (violet #6c5cff, small caps, rounded background)
- H1: "Every metric your WooCommerce store has been hiding."
- Paragraph: "Growvia Analytics turns your WooCommerce data into clear, in-depth dashboards — sales, customers, products, funnels and growth — all inside your WordPress admin."
- Two buttons: "Install Growvia" (gradient background #22d3a8 to #6c5cff) and "See it in action →" (outline style)

TRUST BAR:
- Full-width, white background, border top and bottom (#e6eaf2)
- Centered text: "Trusted by WooCommerce stores from solo founders to 8-figure brands"

FEATURES SECTION:
- Full-width, light gray background (#f6f8fb), 90px padding
- Section header (centered, max 720px):
  - Eyebrow: "Features"
  - H2: "In-depth analytics, built specifically for WooCommerce."
  - Paragraph: "Stop stitching together spreadsheets. Growvia surfaces the metrics that actually move revenue."
- 3-column grid of feature cards (white background, border, rounded corners, padding):
  1. 📈 Revenue Intelligence - "Real-time revenue, AOV, refunds, taxes and net profit — sliced by day, channel or product."
  2. 👥 Customer Insights - "Cohorts, LTV, repeat-purchase rate and churn signals. Know who your best customers really are."
  3. 🛍️ Product Performance - "Bestsellers, dead stock, variant-level conversion and margin per SKU — all in one view."
  4. 🧭 Funnel & Checkout - "See where shoppers drop off — from product page to thank-you page — and recover lost revenue."
  5. 🌍 Geo & Channel Reports - "Break down sales by country, city, coupon, referrer and UTM. Spend smarter on marketing."
  6. ⏱️ Live Store Pulse - "A live feed of orders, carts and visitors — perfect for launches, sales and Black Friday."

HOW IT WORKS:
- Full-width, white background, 90px padding
- Section header: "How it works" / "From plugin to dashboards in under 2 minutes."
- 3-column grid:
  1. "01 Install & activate" - "Upload the plugin in WordPress, click activate. No developer required."
  2. "02 Auto-sync WooCommerce" - "Growvia connects to your store data securely — historical orders included."
  3. "03 Explore your growth" - "Open the Growvia dashboard and start making decisions backed by real data."

TESTIMONIAL:
- Centered quote section
- Quote: "Growvia replaced three tools we were paying for. The cohort and LTV reports alone helped us 2× our repeat-purchase rate in one quarter."
- Attribution: "— Maya R., Founder at Lumen & Co."

PRICING:
- Full-width, light gray background, 90px padding
- Section header: "Pricing" / "Simple pricing. One plugin. Unlimited insights."
- 3-column grid:
  1. Starter - $0/mo - Up to 200 orders/month - Core features
  2. Growth - $19/mo - Unlimited orders - All features (FEATURED with badge)
  3. Scale - $49/mo - Multi-store & teams - Enterprise features

FAQ:
- Centered section, max 780px width
- Section header: "FAQ" / "Questions, answered."
- 4 Q&A pairs:
  1. "Does Growvia slow down my WooCommerce store?" - "No. Growvia processes data in the background..."
  2. "Will it import my historical orders?" - "Yes — on activation, Growvia syncs your full WooCommerce order history..."
  3. "Where is my data stored?" - "All data stays inside your own WordPress database..."
  4. "Do you offer refunds?" - "Yes — every paid plan comes with a 14-day money-back guarantee."

CTA BAND:
- Full-width, dark background (#0b1020), 80px padding
- Centered content:
  - H2: "Grow what you can finally measure." (white text)
  - Paragraph: "Install Growvia Analytics and unlock the full picture of your WooCommerce store today."
  - Button: "Get Growvia Analytics" (gradient background)

Use consistent styling:
- Primary color: #22d3a8
- Accent color: #6c5cff
- Light background: #f6f8fb
- Dark background: #0b1020
- Border color: #e6eaf2
- Border radius: 14px
- Section padding: 90px top/bottom
- Card padding: 26px
```

## Next Steps

1. **Test the conversion**: Create the page as a draft first
2. **Review in WordPress editor**: Check block structure and styling
3. **Add custom CSS**: Include any custom styles needed for gradients, hover effects, etc.
4. **Add images**: Replace emoji icons with actual images if needed
5. **Optimize for mobile**: Test responsive behavior
6. **Add navigation**: Create menu items linking to sections
7. **Publish**: Once satisfied, change status to "publish"

## Additional Resources

- [Gutenberg Block Reference](https://developer.wordpress.org/block-editor/reference-guides/core-blocks/)
- [Block Styles Documentation](https://developer.wordpress.org/block-editor/how-to-guides/themes/theme-json/)
- [MCP Server README](./README.md)
- [Design Replication Guide](./DESIGN_REPLICATION_GUIDE.md)

## Support

If you encounter issues:
1. Check that the WordPress plugin is activated
2. Verify MCP server connection
3. Test with simpler sections first
4. Review block structure in WordPress editor
5. Check browser console for errors
