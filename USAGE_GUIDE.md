# Gutenberg MCP Server - Usage Guide

This guide explains how to use the Gutenberg MCP Server properly with AI assistants. **No need to create separate JavaScript files** - the MCP tools handle everything!

## Core Concept

The Gutenberg MCP Server provides **tools** that AI assistants can call directly. You don't need to write scripts or code - just tell the AI what you want, and it uses the appropriate tools.

## How It Works

```
You (User) → AI Assistant → MCP Tools → WordPress → Result
```

1. You describe what you want in natural language
2. AI assistant chooses the right MCP tool
3. MCP tool communicates with WordPress
4. WordPress creates/updates the page
5. You get the result (page URL, ID, etc.)

## The Right Way vs The Wrong Way

### ❌ Wrong Way (Don't Do This)
```
"Create a JavaScript file that creates a page"
"Write a script to update page 42"
"Make a Node.js file for this task"
```

**Why it's wrong:**
- Creates unnecessary files
- Clutters your repository
- Harder to maintain
- Defeats the purpose of MCP

### ✅ Right Way (Do This)
```
"Create a WordPress page titled 'About Us' with..."
"Update page 42 to change the title to..."
"Show me all draft pages"
```

**Why it's right:**
- Uses MCP tools directly
- No extra files created
- Clean and maintainable
- Exactly what MCP is designed for

## Common Tasks

### 1. Create a New Page

**What you say:**
```
Create a WordPress page titled "Contact Us" with:
- A heading "Get in Touch"
- A paragraph with contact information
- A button linking to email
```

**What AI does:**
1. Calls `create_page` tool
2. Generates proper WordPress block format
3. Sends to WordPress
4. Returns page ID and URL

**What you get:**
```
✅ Page created successfully!
Page ID: 123
URL: http://your-site.com/contact-us
Edit: http://your-site.com/wp-admin/post.php?post=123&action=edit
```

### 2. Update an Existing Page

**What you say:**
```
Update page 123:
- Change the title to "Contact"
- Add a new paragraph at the end saying "We're here to help"
```

**What AI does:**
1. Calls `get_page` to fetch current content
2. Modifies the content
3. Calls `update_page` with changes
4. Returns confirmation

### 3. Replicate a Design

**What you say:**
```
Analyze this page: https://example.com/landing
Then create a new page with the same design
```

**What AI does:**
1. Calls `analyze_reference_page` with URL
2. Extracts all blocks and styling
3. Calls `create_page` with extracted content
4. Returns new page URL

### 4. List and Search Pages

**What you say:**
```
Show me all pages with "product" in the title
```

**What AI does:**
1. Calls `list_pages` with search parameter
2. Returns list of matching pages

### 5. Delete a Page

**What you say:**
```
Move page 123 to trash
```

**What AI does:**
1. Calls `delete_page` with ID
2. Returns confirmation

## WordPress Block Format

When creating pages, content should be in WordPress block format:

```html
<!-- wp:heading {"level":2} -->
<h2>My Heading</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>My paragraph text</p>
<!-- /wp:paragraph -->

<!-- wp:button -->
<div class="wp-block-button">
  <a class="wp-block-button__link">Click Me</a>
</div>
<!-- /wp:button -->
```

**You don't need to write this yourself!** Just describe what you want, and the AI generates the proper format.

## Best Practices

### 1. Be Descriptive
```
✅ "Create a landing page with a dark hero section, 3 feature columns, and a pricing table"
❌ "Create a page"
```

### 2. Specify Styling
```
✅ "Use dark background (#0a0a0a) for the hero section"
❌ "Make it dark"
```

### 3. Use Reference URLs
```
✅ "Analyze https://example.com/page and create similar layout"
❌ "Make it look like that site I showed you"
```

### 4. Create as Draft First
```
✅ "Create the page as draft so I can review it"
❌ "Publish immediately"
```

### 5. Iterate and Refine
```
1. "Create a page with X, Y, Z"
2. Review the result
3. "Update the page to change A to B"
4. Review again
5. "Publish the page"
```

## Example Workflows

### Workflow 1: Simple Page
```
You: Create a page titled "Privacy Policy" with our privacy policy text
AI: [Creates page using create_page tool]
AI: ✅ Page created! ID: 456, URL: http://site.com/privacy-policy
You: Great, publish it
AI: [Updates status to publish]
AI: ✅ Page published!
```

### Workflow 2: Complex Landing Page
```
You: Create a product landing page for "SuperWidget" with:
     - Hero section with product name and CTA
     - Features section with 3 columns
     - Pricing section
     - FAQ section
AI: [Creates page with all sections using create_page tool]
AI: ✅ Page created as draft! Review at: http://site.com/?page_id=789
You: The hero section needs a darker background
AI: [Updates page using update_page tool]
AI: ✅ Updated! Hero section now has #0a0a0a background
You: Perfect, publish it
AI: [Updates status to publish]
AI: ✅ Page published!
```

### Workflow 3: Design Replication
```
You: Analyze https://competitor.com/landing and create similar page
AI: [Calls analyze_reference_page]
AI: Found 15 blocks including hero, features, testimonials, CTA
AI: [Calls create_page with extracted structure]
AI: ✅ Page created! ID: 999, URL: http://site.com/new-landing
You: Replace their company name with ours
AI: [Updates content]
AI: ✅ Updated with your company name
You: Publish it
AI: ✅ Published!
```

## Troubleshooting

### "I need to create multiple pages"
**Solution:** Just ask for each page separately, or ask for all at once:
```
Create 3 pages:
1. "About Us" with company info
2. "Services" with service list
3. "Contact" with contact form
```

### "The page doesn't look right"
**Solution:** Ask AI to update specific parts:
```
Update page 123:
- Make the heading larger
- Change the button color to blue
- Add more spacing between sections
```

### "I want to use a template"
**Solution:** Provide a reference URL or describe the template:
```
Create a page using the same layout as https://example.com/template
```

### "Can I preview before publishing?"
**Solution:** Always create as draft first:
```
Create the page as draft (default behavior)
Review in WordPress editor
Ask AI to make changes if needed
Then publish
```

## Advanced Usage

### Custom Styling
```
Create a page with:
- Full-width hero section, background #0a0a0a, padding 80px top/bottom
- 3-column feature grid, each column with icon, heading, description
- CTA section, background #2563eb, white text, centered
```

### Nested Layouts
```
Create a page with:
- Container group with white background and shadow
- Inside: 2-column layout
- Left column: image
- Right column: heading, paragraph, button
```

### Responsive Design
```
Create a page with:
- 4 columns on desktop
- 2 columns on tablet
- 1 column on mobile
(AI will use appropriate Gutenberg responsive settings)
```

## Tips for Success

1. **Start Simple** - Create basic pages first, then add complexity
2. **Use Drafts** - Always review before publishing
3. **Iterate** - Make changes incrementally
4. **Reference Examples** - Use analyze_reference_page for complex designs
5. **Be Specific** - Describe exactly what you want
6. **Check Results** - Review pages in WordPress editor
7. **Learn Patterns** - Notice what works well and reuse those patterns

## What NOT to Do

❌ Don't ask for JavaScript files to be created
❌ Don't ask for scripts to be written
❌ Don't try to bypass the MCP tools
❌ Don't commit credentials to git
❌ Don't publish without reviewing first
❌ Don't use vague descriptions

## What TO Do

✅ Use natural language to describe pages
✅ Let AI use the MCP tools directly
✅ Review pages before publishing
✅ Iterate and refine
✅ Use reference URLs for complex designs
✅ Be specific about styling and layout
✅ Keep credentials in environment variables

## Summary

The Gutenberg MCP Server is designed to be used **directly by AI assistants**. You don't need to create scripts or files - just describe what you want, and the AI uses the appropriate MCP tools to make it happen.

**Remember:**
- Describe what you want in natural language
- AI uses MCP tools automatically
- No need for separate JavaScript files
- Clean, maintainable, professional workflow

## Next Steps

- Read [EXAMPLES.md](EXAMPLES.md) for more usage examples
- Check [DESIGN_REPLICATION_GUIDE.md](DESIGN_REPLICATION_GUIDE.md) for advanced design replication
- Review [README.md](README.md) for setup and configuration
- Start creating pages with natural language prompts!
