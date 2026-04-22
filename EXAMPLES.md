# Usage Examples

Real-world examples of using the Gutenberg MCP Server.

## Example 1: Replicate a Complete Page Design

**Goal:** Copy the design from a reference site to your WordPress site.

**Prompt:**
```
Analyze this reference page: https://rek433bjmg-staging.onrocket.site/ugc-for-woocommerce/
```

**Response:** The AI extracts all blocks with complete styling information.

**Next Prompt:**
```
Create a new page titled "UGC for WooCommerce" using all the blocks from the analysis. Set status to draft.
```

**Result:** A new draft page is created with the same design, layout, colors, and structure.

**Verify:**
```
Get the page we just created and show me its URL
```

**Compare:**
Visit both URLs side-by-side to verify the design matches.

---

## Example 2: Create a Landing Page from Scratch

**Prompt:**
```
Create a new WordPress page titled "Product Launch" with:

1. A centered hero heading "Introducing Our New Product"
2. A centered paragraph with description
3. A full-width image from https://placehold.co/1200x600
4. A two-column layout with:
   - Left column: "Feature 1" heading and description
   - Right column: "Feature 2" heading and description
5. A centered call-to-action paragraph with a link
6. Set status to draft
```

**Result:** A structured landing page with all requested elements.

---

## Example 3: Update an Existing Page

**Prompt:**
```
Get page ID 42 and show me its current content
```

**Review the content, then:**
```
Update page ID 42:
- Change the title to "Updated Product Page"
- Keep all existing blocks but add a new paragraph at the end: "Contact us for more information"
```

---

## Example 4: Batch Create Multiple Pages

**Prompt:**
```
Create 3 new pages:

1. "Services" page with:
   - Heading "Our Services"
   - Paragraph describing services
   - Status: draft

2. "Portfolio" page with:
   - Heading "Our Work"
   - Paragraph about portfolio
   - Status: draft

3. "Contact" page with:
   - Heading "Get In Touch"
   - Paragraph with contact info
   - Status: draft
```

---

## Example 5: Clone and Customize

**Prompt:**
```
Analyze https://example.com/reference-page
Then create a new page with the same structure but:
- Change the title to "My Custom Page"
- Replace all images with placeholders from https://placehold.co/
- Change the hero heading text to "Welcome to My Site"
```

---

## Example 6: Extract and Reuse Sections

**Prompt:**
```
Analyze https://example.com/homepage
Show me just the hero section blocks
```

**Then:**
```
Create a new page titled "New Landing Page" using only the hero section blocks from the analysis
```

---

## Example 7: Compare Two Designs

**Prompt:**
```
Analyze these two pages:
1. https://example.com/page1
2. https://example.com/page2

Tell me the differences in their block structure and styling
```

---

## Example 8: Preview Before Creating

**Prompt:**
```
I want to create a page with these blocks:
- Heading level 1: "Welcome"
- Paragraph: "This is my site"
- Image from https://placehold.co/800x400

First, render these blocks to show me the HTML preview
```

**After reviewing:**
```
Looks good! Now create the page with title "Welcome Page" and status "publish"
```

---

## Example 9: Work with Custom Blocks

**Prompt:**
```
List all block types available on my WordPress site
```

**Review the list, then:**
```
Create a page using the "acf/testimonial" block with:
- name: "John Doe"
- rating: 5
- text: "Great product!"
```

---

## Example 10: Fix a Broken Design

**Prompt:**
```
I created a page at http://wpfunnels.local/my-page/ but the design doesn't match the reference at https://example.com/reference

Analyze both pages and tell me what's different
```

**After analysis:**
```
Update my page to match the reference design exactly
```

---

## Example 11: Responsive Layout

**Prompt:**
```
Create a page titled "Responsive Grid" with a 3-column layout:
- Each column should have a heading and paragraph
- Add appropriate spacing and alignment
- Make it mobile-friendly
```

---

## Example 12: Style Variations

**Prompt:**
```
Create a page titled "Style Test" with:
- A heading with primary color and center alignment
- A paragraph with light gray background
- An image with rounded corners
- A quote block with custom styling
```

---

## Example 13: Search and Update

**Prompt:**
```
Find all pages containing "product" in the title
```

**Review results:**
```
Update page ID 15 to add a new section at the end with latest product updates
```

---

## Example 14: Duplicate a Page

**Prompt:**
```
Get page ID 42 with all its blocks
```

**Then:**
```
Create a new page titled "Copy of [Original Title]" with the exact same blocks
```

---

## Example 15: Merge Multiple Designs

**Prompt:**
```
Create a new page titled "Combined Design" with:
- Hero section from https://example.com/page1
- Features section from https://example.com/page2  
- Footer from https://example.com/page3

Analyze each page first, then combine the sections
```

---

## Advanced Example: Complete Workflow

**Step 1: Research**
```
List all my draft pages
```

**Step 2: Analyze Reference**
```
Analyze https://rek433bjmg-staging.onrocket.site/ugc-for-woocommerce/
How many blocks were found? What types?
```

**Step 3: Check Compatibility**
```
List block types on my site
Do I have all the blocks needed for the reference page?
```

**Step 4: Create**
```
Create a new page titled "UGC for WooCommerce" with all blocks from the analysis
Set status to draft
```

**Step 5: Review**
```
Get the page we just created
Show me its URL and block count
```

**Step 6: Compare**
```
Open both URLs:
- Reference: https://rek433bjmg-staging.onrocket.site/ugc-for-woocommerce/
- New page: http://wpfunnels.local/ugc-for-woocommerce/

Do they look the same?
```

**Step 7: Refine (if needed)**
```
The hero section background color looks different
Update the page to match the reference exactly
```

**Step 8: Publish**
```
Update the page status to "publish"
```

**Step 9: Verify**
```
Get page ID [X] to confirm it's published
```

---

## Tips for Effective Prompts

### ✅ Good Prompts

- "Analyze this page: [URL]"
- "Create a page with these specific blocks..."
- "Update page ID 42 to change the title"
- "Show me all draft pages"
- "List available block types"

### ❌ Avoid Vague Prompts

- "Make it look nice" (be specific about what you want)
- "Fix the page" (explain what's wrong)
- "Add some content" (specify what content)

### 💡 Pro Tips

1. **Always analyze before replicating** - Don't guess the structure
2. **Create as draft first** - Review before publishing
3. **Be specific with styling** - Mention colors, alignment, spacing
4. **Use block names correctly** - Check available blocks first
5. **Test incrementally** - Start simple, then add complexity

---

## Troubleshooting Examples

### Problem: Design Doesn't Match

**Prompt:**
```
Analyze both pages:
1. Reference: https://example.com/reference
2. My page: http://wpfunnels.local/my-page

Show me the differences in block structure and attributes
```

### Problem: Missing Blocks

**Prompt:**
```
The reference page uses blocks I don't have
List block types on my site
What alternatives can I use?
```

### Problem: Images Not Loading

**Prompt:**
```
Get page ID 42
Replace all external image URLs with placeholders from https://placehold.co/
```

### Problem: Colors Wrong

**Prompt:**
```
Update page ID 42
Change all primary color references to match my theme's primary color
```

---

## Integration Examples

### With Kiro

In Kiro, you can create hooks to automate page creation:

```
Create a hook that analyzes a reference URL whenever I create a new page
```

### With Claude Desktop

Use the MCP directly in conversations:

```
I need to create 5 landing pages for different products
Let's start by analyzing this reference design: [URL]
Then we'll customize it for each product
```

### With VSCode

Use the MCP while coding:

```
While I'm working on the theme, create test pages with different block combinations
```

---

## Real-World Scenarios

### Scenario 1: Agency Workflow

**Goal:** Create 10 client pages based on approved designs

```
Analyze the approved design: [URL]
Create 10 pages with this structure:
1. "About Us" - customize heading and content
2. "Services" - customize heading and content
[...continue for all 10]
```

### Scenario 2: A/B Testing

**Goal:** Create variations of a landing page

```
Get page ID 42 (original landing page)
Create 3 variations:
- Variation A: Different hero heading
- Variation B: Different CTA button text  
- Variation C: Different image
```

### Scenario 3: Content Migration

**Goal:** Move pages from old site to new site

```
Analyze these pages from the old site:
1. [URL1]
2. [URL2]
3. [URL3]

Create equivalent pages on the new site with the same content and structure
```

### Scenario 4: Template Library

**Goal:** Build reusable page templates

```
Create template pages:
1. "Template: Product Page" - standard product layout
2. "Template: Service Page" - standard service layout
3. "Template: Landing Page" - standard landing layout

Set all to private status so they're not public but can be duplicated
```

---

## Conclusion

The key to success with the Gutenberg MCP Server is:

1. **Analyze first** - Always use `analyze_reference_page` for complex designs
2. **Be specific** - Clearly describe what you want
3. **Iterate** - Create, review, refine, publish
4. **Use drafts** - Never publish without reviewing
5. **Leverage automation** - Let the AI handle repetitive tasks

With these examples as a guide, you can efficiently create and manage WordPress pages with accurate designs and consistent quality.
