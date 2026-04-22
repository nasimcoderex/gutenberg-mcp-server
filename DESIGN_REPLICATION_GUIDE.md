# Design Replication Guide

This guide explains how to use the Gutenberg MCP Server to accurately replicate WordPress page designs from reference URLs.

## The Problem

When creating pages manually, you might miss:
- Exact color values and CSS classes
- Spacing and padding settings
- Column layouts and responsive breakpoints
- Typography styles and font sizes
- Background colors and gradients
- Image dimensions and alignment
- Custom block attributes

## The Solution

The `analyze_reference_page` tool extracts the complete block structure with all styling information, enabling pixel-perfect replication.

## Step-by-Step Workflow

### 1. Analyze the Reference Page

First, analyze the reference URL to extract its structure:

**Prompt:**
```
Analyze this reference page: https://rek433bjmg-staging.onrocket.site/ugc-for-woocommerce/
```

**What Happens:**
- The MCP server fetches the page HTML
- Extracts the main content area
- Parses all Gutenberg blocks with attributes
- Captures CSS classes, colors, alignment, and styles
- Returns structured block data

**Output Example:**
```json
{
  "title": "UGC for WooCommerce",
  "blocks": [
    {
      "blockName": "core/heading",
      "attrs": {
        "level": 1,
        "textAlign": "center",
        "className": "has-primary-color"
      },
      "innerContent": "<h1>User Generated Content</h1>"
    },
    {
      "blockName": "core/columns",
      "attrs": {
        "className": "has-2-columns"
      },
      "innerContent": "..."
    }
  ]
}
```

### 2. Review the Extracted Blocks

Check what was extracted:

**Prompt:**
```
Show me the block structure from the analysis
```

This helps you understand:
- How many blocks were found
- What block types are used
- What attributes are set
- If any content needs adjustment

### 3. Create the New Page

Use the extracted blocks to create your page:

**Prompt:**
```
Create a new page titled "UGC for WooCommerce" using the blocks from the reference analysis
```

**What Happens:**
- The MCP server sends all blocks to WordPress
- WordPress renders them with the same styling
- The page is created as a draft for review

### 4. Compare and Refine

**Prompt:**
```
Compare http://wpfunnels.local/ugc-for-woocommerce/ with the reference https://rek433bjmg-staging.onrocket.site/ugc-for-woocommerce/
```

If there are differences, you can:
- Update specific blocks
- Adjust attributes
- Add missing elements
- Fine-tune spacing

## Common Design Elements

### Colors

The analyzer extracts color classes:
```json
{
  "attrs": {
    "textColor": "primary",
    "backgroundColor": "light-gray",
    "className": "has-primary-color has-light-gray-background-color"
  }
}
```

### Alignment

Text and block alignment is preserved:
```json
{
  "attrs": {
    "align": "center",
    "textAlign": "center"
  }
}
```

### Layouts (Columns)

Multi-column layouts are detected:
```json
{
  "blockName": "core/columns",
  "attrs": {
    "className": "has-2-columns"
  },
  "innerBlocks": [
    {
      "blockName": "core/column",
      "attrs": { "width": "50%" }
    },
    {
      "blockName": "core/column",
      "attrs": { "width": "50%" }
    }
  ]
}
```

### Images

Images with all attributes:
```json
{
  "blockName": "core/image",
  "attrs": {
    "url": "https://example.com/image.jpg",
    "alt": "Product screenshot",
    "width": 1200,
    "height": 800,
    "align": "center",
    "className": "is-style-rounded"
  }
}
```

### Spacing and Padding

Custom spacing is captured in classes:
```json
{
  "attrs": {
    "className": "has-large-padding has-medium-margin"
  }
}
```

## Best Practices

### 1. Always Analyze First

Don't try to manually recreate complex designs. Always start with:
```
Analyze the reference page: [URL]
```

### 2. Check Block Types

Ensure your WordPress site has the same blocks:
```
List available block types on my site
```

If the reference uses custom blocks you don't have, you'll need to:
- Install the required plugins
- Use alternative core blocks
- Create custom HTML blocks

### 3. Handle Images Properly

Images from reference sites need to be:
- Downloaded and uploaded to your media library, OR
- Replaced with your own images, OR
- Kept as external URLs (if licensing allows)

**Prompt:**
```
Create the page but replace all images with placeholders from https://placehold.co/
```

### 4. Review Before Publishing

Always create as draft first:
```
Create the page with status "draft"
```

Then review in WordPress editor before publishing.

### 5. Preserve Theme Styles

The analyzer captures theme-specific classes like:
- `has-primary-color`
- `has-large-font-size`
- `is-style-rounded`

These ensure the page matches your theme's design system.

## Troubleshooting Design Differences

### Colors Don't Match

**Problem:** Colors look different on your site.

**Solution:**
- Check if your theme defines the same color palette
- The reference might use custom colors not in your theme
- You may need to add custom CSS or update theme settings

### Layout Breaks

**Problem:** Columns or spacing looks wrong.

**Solution:**
- Verify your theme supports the same layout blocks
- Check responsive breakpoints in your theme
- Some themes override default block styles

### Fonts Look Different

**Problem:** Typography doesn't match.

**Solution:**
- Font families are theme-specific
- Check if your theme uses the same fonts
- You may need to install the same font or adjust theme settings

### Missing Elements

**Problem:** Some content didn't get extracted.

**Solution:**
- The reference might use custom JavaScript elements
- Some content might be loaded dynamically
- Try viewing the page source to see if content is in HTML

### Custom Blocks Not Working

**Problem:** Reference uses blocks you don't have.

**Solution:**
```
List block types on my site
```

Then either:
- Install the required plugin
- Use core blocks as alternatives
- Create custom HTML blocks

## Advanced Techniques

### Batch Replication

Replicate multiple pages at once:

```
Analyze and replicate these pages:
1. https://example.com/page1 → "New Page 1"
2. https://example.com/page2 → "New Page 2"
3. https://example.com/page3 → "New Page 3"
```

### Selective Replication

Copy only specific sections:

```
Analyze https://example.com/reference
Then create a page using only the hero section and footer
```

### Merge Designs

Combine elements from multiple references:

```
Create a page with:
- Hero section from https://example.com/page1
- Features section from https://example.com/page2
- Contact form from https://example.com/page3
```

### Update Existing Pages

Apply a reference design to an existing page:

```
Analyze https://example.com/reference
Then update page ID 42 with the same design but keep the existing title
```

## Example: Complete Workflow

Here's a complete example of replicating a design:

**Step 1: Analyze**
```
Analyze this reference: https://rek433bjmg-staging.onrocket.site/ugc-for-woocommerce/
```

**Step 2: Review**
```
How many blocks were found? What types?
```

**Step 3: Create**
```
Create a new page titled "UGC for WooCommerce" with status "draft" using all the blocks from the analysis
```

**Step 4: Verify**
```
Get the page we just created and show me its URL
```

**Step 5: Compare**
```
Open http://wpfunnels.local/ugc-for-woocommerce/ and compare with the reference
```

**Step 6: Refine (if needed)**
```
Update the page to adjust the hero section background color to match exactly
```

**Step 7: Publish**
```
Update the page status to "publish"
```

## Tips for Perfect Replication

1. **Use the same theme** - If possible, use the same WordPress theme as the reference
2. **Install required plugins** - Some designs need specific plugins for custom blocks
3. **Check responsive design** - View on mobile and tablet to ensure it works everywhere
4. **Preserve accessibility** - Keep alt text, ARIA labels, and semantic HTML
5. **Optimize images** - Compress images before uploading to your site
6. **Test functionality** - Ensure forms, buttons, and links work correctly
7. **Review SEO** - Add meta descriptions, titles, and structured data

## Limitations

The analyzer works best with:
- ✅ Standard WordPress sites using Gutenberg
- ✅ Pages with semantic HTML structure
- ✅ Core Gutenberg blocks
- ✅ Common page builders that output clean HTML

It may struggle with:
- ❌ Sites using heavy JavaScript frameworks (React, Vue)
- ❌ Content loaded via AJAX after page load
- ❌ Sites that block automated requests
- ❌ Non-WordPress sites (though basic HTML extraction still works)

## Getting Help

If replication isn't working:

1. **Check the raw content**
   ```
   Show me the raw_content from the analysis
   ```

2. **Verify block types**
   ```
   List block types available on my WordPress site
   ```

3. **Test with a simple page first**
   Start with a basic page to ensure the system works

4. **Review WordPress logs**
   Check for errors in WordPress debug log

5. **Inspect the reference page**
   View source to see if content is in HTML or loaded dynamically

## Conclusion

With the `analyze_reference_page` tool, you can replicate WordPress page designs accurately and efficiently. The key is to:

1. Always analyze first
2. Review the extracted structure
3. Create as draft
4. Compare and refine
5. Publish when perfect

This workflow ensures you capture all design elements and create pages that match your reference exactly.
