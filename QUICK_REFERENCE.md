# Gutenberg MCP Server - Quick Reference

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure MCP (see .kiro/settings/mcp.json)
# 3. Start using with AI assistant - no scripts needed!
```

## 🛠️ Available Tools

| Tool | Purpose | Example |
|------|---------|---------|
| `create_page` | Create new page | "Create a page titled 'About Us' with..." |
| `update_page` | Update existing page | "Update page 42 to change the title..." |
| `get_page` | Get page details | "Show me page 42" |
| `list_pages` | List/search pages | "Show all draft pages" |
| `delete_page` | Delete/trash page | "Move page 42 to trash" |
| `analyze_reference_page` | Extract design from URL | "Analyze https://example.com/page" |
| `list_block_types` | List available blocks | "What blocks are available?" |
| `render_blocks` | Preview blocks | "Preview these blocks..." |

## 💬 Common Prompts

### Create a Simple Page
```
Create a WordPress page titled "Contact" with:
- A heading "Get in Touch"
- A paragraph with contact info
- A button
```

### Create a Landing Page
```
Create a landing page for "Product X" with:
- Hero section (dark background)
- Features section (3 columns)
- Pricing section
- CTA section
```

### Replicate a Design
```
Analyze https://example.com/landing
Then create a new page with the same design
```

### Update a Page
```
Update page 123:
- Change title to "New Title"
- Add a paragraph at the end
```

### List Pages
```
Show me all pages with "product" in the title
```

## 📝 WordPress Block Format

```html
<!-- wp:heading {"level":2} -->
<h2>My Heading</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>My paragraph</p>
<!-- /wp:paragraph -->

<!-- wp:button -->
<div class="wp-block-button">
  <a class="wp-block-button__link">Click Me</a>
</div>
<!-- /wp:button -->

<!-- wp:columns -->
<div class="wp-block-columns">
  <!-- wp:column -->
  <div class="wp-block-column">Column 1</div>
  <!-- /wp:column -->
  
  <!-- wp:column -->
  <div class="wp-block-column">Column 2</div>
  <!-- /wp:column -->
</div>
<!-- /wp:columns -->
```

## ✅ Best Practices

### Do's
- ✅ Use natural language prompts
- ✅ Create as draft first
- ✅ Be specific about styling
- ✅ Use reference URLs for complex designs
- ✅ Iterate and refine
- ✅ Review before publishing

### Don'ts
- ❌ Don't create separate JS files
- ❌ Don't write scripts manually
- ❌ Don't publish without reviewing
- ❌ Don't use vague descriptions
- ❌ Don't commit credentials

## 🎨 Common Patterns

### Hero Section
```
Full-width group with:
- Dark background (#0a0a0a)
- Centered heading (large)
- Centered paragraph
- Centered button
- Padding 80px top/bottom
```

### Feature Grid
```
3-column layout with:
- Icon in each column
- Heading
- Description paragraph
```

### CTA Section
```
Full-width group with:
- Colored background
- Centered content
- Button
- Large padding
```

## 🔧 Configuration

### Environment Variables
```bash
WP_BASE_URL=http://your-site.local
WP_USER=your-username
WP_APP_PASSWORD=your-app-password
```

### MCP Configuration
```json
{
  "mcpServers": {
    "gutenberg": {
      "command": "node",
      "args": ["./index.js"],
      "env": {
        "WP_BASE_URL": "http://your-site.local",
        "WP_USER": "admin",
        "WP_APP_PASSWORD": "xxxx xxxx xxxx xxxx"
      }
    }
  }
}
```

## 📚 Documentation

| File | Purpose |
|------|---------|
| [README.md](README.md) | Setup and configuration |
| [USAGE_GUIDE.md](USAGE_GUIDE.md) | How to use properly |
| [EXAMPLES.md](EXAMPLES.md) | Practical examples |
| [DESIGN_REPLICATION_GUIDE.md](DESIGN_REPLICATION_GUIDE.md) | Advanced design replication |
| [CHANGELOG.md](CHANGELOG.md) | Version history |
| [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) | Project organization |

## 🆘 Troubleshooting

### Authentication Error
- Check Application Password is correct
- Verify user has `edit_pages` capability
- Ensure REST API is enabled

### Blocks Not Rendering
- Use `list_block_types` to see available blocks
- Check block format is correct
- Review in WordPress editor

### Connection Issues
- Verify `WP_BASE_URL` is accessible
- Check WordPress is running
- Test with browser first

## 📞 Support

1. Check [README.md](README.md) for setup
2. Read [USAGE_GUIDE.md](USAGE_GUIDE.md) for proper usage
3. Review [EXAMPLES.md](EXAMPLES.md) for examples
4. Check WordPress error logs

## 🎯 Remember

**The key principle:** Use natural language with AI assistant. No need to create scripts or files. The MCP tools handle everything!

```
You → AI → MCP Tools → WordPress → Result
```

Simple, clean, professional! 🚀
