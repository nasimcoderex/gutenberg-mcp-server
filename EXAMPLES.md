# Gutenberg MCP Server - Usage Examples

This document provides practical examples of using the Gutenberg MCP Server with AI assistants.

## Table of Contents

- [Basic Page Creation](#basic-page-creation)
- [Design Replication](#design-replication)
- [Page Management](#page-management)
- [Advanced Layouts](#advanced-layouts)
- [Real-World Examples](#real-world-examples)

## Basic Page Creation

### Simple Page with Text

**Prompt:**
```
Create a WordPress page titled "Welcome" with a heading "Hello World" and a paragraph saying "This is my first page created with MCP."
```

**What happens:**
- AI uses `create_page` tool
- Creates proper WordPress block format
- Returns page ID and URL

### Page with Multiple Sections

**Prompt:**
```
Create a page titled "Services" with:
- A centered heading "Our Services"
- Three columns with service descriptions
- A call-to-action button at the bottom
```

**Result:**
- Heading block with center alignment
- Columns block with 3 columns
- Button block with styling

## Design Replication

### Replicate from Reference URL

**Prompt:**
```
Analyze this page: https://example.com/landing-page
Then create a new page with the same design
```

**Process:**
1. AI calls `analyze_reference_page` with the URL
2. Extracts all blocks, styling, and structure
3. Calls `create_page` with extracted blocks
4. Returns new page URL

### Replicate with Modifications

**Prompt:**
```
Analyze https://example.com/about
Create a similar page but:
- Change the title to "About Our Company"
- Replace images with placeholders
- Update the contact email
```

**Process:**
- Analyzes reference page
- Modifies extracted content
- Creates new page with changes

## Page Management

### List All Pages

**Prompt:**
```
Show me all pages on my WordPress site
```

**AI Action:**
```json
{
  "tool": "list_pages",
  "arguments": {
    "per_page": 50
  }
}
```

### Search for Specific Pages

**Prompt:**
```
Find all pages with "product" in the title
```

**AI Action:**
```json
{
  "tool": "list_pages",
  "arguments": {
    "search": "product"
  }
}
```

### Get Page Details

**Prompt:**
```
Show me the content of page ID 42
```

**AI Action:**
```json
{
  "tool": "get_page",
  "arguments": {
    "id": 42
  }
}
```

### Update Existing Page

**Prompt:**
```
Update page 42:
- Change title to "New Title"
- Add a paragraph at the end saying "Updated on 2024"
```

**AI Action:**
- Gets current page content
- Modifies the content
- Calls `update_page` with new content

### Delete Page

**Prompt:**
```
Move page 42 to trash
```

**AI Action:**
```json
{
  "tool": "delete_page",
  "arguments": {
    "id": 42,
    "force": false
  }
}
```

## Advanced Layouts

### Multi-Column Layout

**Prompt:**
```
Create a page with a 3-column layout:
- Column 1: Icon and "Fast" heading
- Column 2: Icon and "Secure" heading  
- Column 3: Icon and "Reliable" heading
Each with a description paragraph
```

**Generated Content:**
```html
<!-- wp:columns -->
<div class="wp-block-columns">
  <!-- wp:column -->
  <div class="wp-block-column">
    <!-- wp:paragraph -->
    <p style="font-size:2rem">⚡</p>
    <!-- /wp:paragraph -->
    
    <!-- wp:heading {"level":3} -->
    <h3>Fast</h3>
    <!-- /wp:heading -->
    
    <!-- wp:paragraph -->
    <p>Lightning-fast performance for your users.</p>
    <!-- /wp:paragraph -->
  </div>
  <!-- /wp:column -->
  
  <!-- Similar for other columns -->
</div>
<!-- /wp:columns -->
```

### Full-Width Sections with Background Colors

**Prompt:**
```
Create a landing page with:
- Full-width hero section with dark background
- Full-width features section with light gray background
- Full-width CTA section with blue background
```

**Generated Content:**
```html
<!-- wp:group {"align":"full","style":{"color":{"background":"#0a0a0a"}}} -->
<div class="wp-block-group alignfull has-background" style="background-color:#0a0a0a">
  <!-- Hero content -->
</div>
<!-- /wp:group -->

<!-- wp:group {"align":"full","style":{"color":{"background":"#f9fafb"}}} -->
<div class="wp-block-group alignfull has-background" style="background-color:#f9fafb">
  <!-- Features content -->
</div>
<!-- /wp:group -->
```

### Nested Groups and Containers

**Prompt:**
```
Create a page with a card layout:
- Container with padding and border
- Inside: heading, paragraph, and button
- White background with shadow
```

**Generated Content:**
```html
<!-- wp:group {"style":{"spacing":{"padding":{"top":"24px","bottom":"24px","left":"24px","right":"24px"}},"color":{"background":"#ffffff"},"border":{"radius":"8px"}}} -->
<div class="wp-block-group has-background" style="background-color:#ffffff;border-radius:8px;padding:24px">
  <!-- wp:heading {"level":3} -->
  <h3>Card Title</h3>
  <!-- /wp:heading -->
  
  <!-- wp:paragraph -->
  <p>Card description text goes here.</p>
  <!-- /wp:paragraph -->
  
  <!-- wp:button -->
  <div class="wp-block-button">
    <a class="wp-block-button__link">Learn More</a>
  </div>
  <!-- /wp:button -->
</div>
<!-- /wp:group -->
```

## Real-World Examples

### Example 1: Product Landing Page

**Prompt:**
```
Create a product landing page for "SuperWidget Pro" with:
- Hero section: product name, tagline, CTA button
- Features section: 3 columns with icons
- Pricing section: price and buy button
- FAQ section: 5 common questions
```

**AI Process:**
1. Creates hero with group block (dark background)
2. Creates features with columns block
3. Creates pricing with centered content
4. Creates FAQ with heading and paragraph blocks
5. Returns draft page for review

### Example 2: Blog Post Template

**Prompt:**
```
Create a blog post page titled "10 Tips for Better Productivity" with:
- Featured image placeholder
- Introduction paragraph
- 10 numbered sections with headings and content
- Author bio at the end
```

**AI Process:**
1. Creates image block
2. Creates intro paragraph
3. Creates 10 heading + paragraph combinations
4. Creates author bio section with group block
5. Returns formatted page

### Example 3: Contact Page

**Prompt:**
```
Create a contact page with:
- Heading "Get in Touch"
- Two columns: contact info on left, form placeholder on right
- Office address, phone, email
- Map placeholder
```

**AI Process:**
1. Creates centered heading
2. Creates 2-column layout
3. Left column: contact details with icons
4. Right column: form placeholder
5. Adds map placeholder below
6. Returns page with proper structure

### Example 4: Analytics Dashboard

**Prompt:**
```
Create an analytics dashboard page with:
- Header with date range and CTA button
- 5 metric cards showing revenue, orders, etc.
- Performance comparison cards
- Data table with top products
```

**AI Process:**
1. Creates header with flex layout
2. Creates 5-column layout for metrics
3. Creates 3-column layout for comparisons
4. Creates table block with data
5. Applies proper styling and spacing
6. Returns professional dashboard page

### Example 5: Team Page

**Prompt:**
```
Create a team page with:
- Heading "Meet Our Team"
- Grid of team members (4 columns)
- Each member: photo, name, title, bio
```

**AI Process:**
1. Creates centered heading
2. Creates columns block (4 columns)
3. Each column: image, heading, paragraph
4. Applies consistent styling
5. Returns team page layout

## Tips for Best Results

### Be Specific
❌ "Create a page"
✅ "Create a page titled 'About Us' with a heading, 3 paragraphs, and a contact button"

### Describe Layout Clearly
❌ "Make it look nice"
✅ "Use a 2-column layout with image on left and text on right"

### Specify Colors and Styling
❌ "Add some color"
✅ "Use dark background (#0a0a0a) for hero section and light gray (#f9fafb) for features"

### Reference Examples
❌ "Make it like other sites"
✅ "Analyze https://example.com/page and create similar layout"

### Iterate and Refine
1. Create initial page as draft
2. Review in WordPress editor
3. Ask AI to update specific sections
4. Publish when satisfied

## Common Patterns

### Hero Section Pattern
```
Full-width group with:
- Dark background
- Centered heading (large)
- Centered paragraph (medium)
- Centered button
- Padding top and bottom
```

### Feature Grid Pattern
```
Columns block (3 or 4 columns) with:
- Icon/emoji in each column
- Heading
- Description paragraph
- Consistent padding
```

### CTA Section Pattern
```
Full-width group with:
- Colored background
- Centered heading
- Centered paragraph
- Centered button
- Large padding
```

### Testimonial Pattern
```
Group with:
- Border and padding
- Quote paragraph
- Author name (bold)
- Author title (gray)
```

## Workflow Examples

### Workflow 1: Quick Page Creation
1. "Create a page titled X with Y content"
2. AI creates page as draft
3. Review and publish

### Workflow 2: Design Replication
1. "Analyze this page: [URL]"
2. AI extracts structure
3. "Create a new page with this design"
4. AI creates page
5. "Update the title and first paragraph"
6. AI updates page
7. Publish

### Workflow 3: Iterative Development
1. "Create a landing page for Product X"
2. AI creates basic structure
3. "Add a pricing section with 3 tiers"
4. AI adds pricing
5. "Make the hero section background darker"
6. AI updates styling
7. "Add testimonials section"
8. AI adds testimonials
9. Publish

## Next Steps

- Read [DESIGN_REPLICATION_GUIDE.md](DESIGN_REPLICATION_GUIDE.md) for advanced design replication
- Check [README.md](README.md) for setup and configuration
- Experiment with different prompts and layouts
- Share your examples and improvements

## Support

If you have questions or need help:
- Check the main [README.md](README.md)
- Review the [DESIGN_REPLICATION_GUIDE.md](DESIGN_REPLICATION_GUIDE.md)
- Test with simple pages first
- Iterate and refine your prompts
