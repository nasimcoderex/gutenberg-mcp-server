# Gutenberg MCP Server

A Model Context Protocol (MCP) server for creating and managing WordPress pages with Gutenberg blocks. This server enables AI assistants to replicate page designs from reference URLs with accurate styling and content.

## Features

- ✅ **Analyze Reference Pages** - Extract complete block structure from any WordPress page URL
- ✅ **Create Pages** - Build new WordPress pages with Gutenberg blocks
- ✅ **Update Pages** - Modify existing pages with new content and blocks
- ✅ **List & Get Pages** - Browse and retrieve page information
- ✅ **Block Management** - Work with all registered Gutenberg block types
- ✅ **Design Replication** - Accurately copy designs including colors, spacing, alignment, and layout

## Installation

### Prerequisites

- Node.js 18+ with npm
- WordPress site with REST API enabled
- WordPress Application Password for authentication

### Setup

1. **Install the WordPress Plugin**

   Copy the `gutenberg-mcp` folder to your WordPress plugins directory:
   ```bash
   cp -r gutenberg-mcp /path/to/wordpress/wp-content/plugins/
   ```

   Then activate the plugin in WordPress admin.

2. **Create WordPress Application Password**

   - Go to WordPress Admin → Users → Profile
   - Scroll to "Application Passwords"
   - Enter a name (e.g., "MCP Server") and click "Add New Application Password"
   - Copy the generated password (you won't see it again!)

3. **Install MCP Server Dependencies**

   ```bash
   cd gutenberg-mcp-server
   npm install
   ```

4. **Configure Environment Variables**

   Create a `.env` file or set environment variables:
   ```bash
   export WP_BASE_URL="http://wpfunnels.local"
   export WP_USER="your-username"
   export WP_APP_PASSWORD="your-app-password"
   ```

5. **Configure MCP Client**

   Add to your MCP client configuration (e.g., Claude Desktop, Kiro, VSCode):

   **For Claude Desktop** (`~/Library/Application Support/Claude/claude_desktop_config.json`):
   ```json
   {
     "mcpServers": {
       "gutenberg": {
         "command": "node",
         "args": ["/path/to/gutenberg-mcp-server/index.js"],
         "env": {
           "WP_BASE_URL": "http://wpfunnels.local",
           "WP_USER": "your-username",
           "WP_APP_PASSWORD": "your-app-password"
         }
       }
     }
   }
   ```

   **For Kiro** (`.kiro/settings/mcp.json`):
   ```json
   {
     "mcpServers": {
       "gutenberg": {
         "command": "node",
         "args": ["./gutenberg-mcp-server/index.js"],
         "env": {
           "WP_BASE_URL": "http://wpfunnels.local",
           "WP_USER": "your-username",
           "WP_APP_PASSWORD": "your-app-password"
         }
       }
     }
   }
   ```

## Usage

### Replicate a Page Design

The most powerful feature - analyze a reference page and create an exact copy:

```
Analyze this reference page: https://example.com/reference-page
Then create a new page with the same design and content
```

The AI will:
1. Use `analyze_reference_page` to extract all blocks with styling
2. Use `create_page` to build the new page with identical structure
3. Preserve colors, spacing, alignment, images, and layout

### Create a Custom Page

```
Create a new WordPress page titled "About Us" with:
- A heading "Welcome to Our Company"
- A paragraph with company description
- An image from https://example.com/logo.png
- A two-column layout with team info
```

### Update Existing Pages

```
Update page ID 42:
- Change the title to "New Title"
- Add a call-to-action button at the end
```

### List and Search Pages

```
Show me all draft pages
```

```
Find pages containing "product"
```

## Available Tools

### `analyze_reference_page`
Extract complete block structure from a WordPress page URL.

**Input:**
- `url` (string, required) - Full URL of the reference page

**Output:**
- `title` - Extracted page title
- `blocks` - Array of parsed Gutenberg blocks with all attributes
- `block_count` - Number of blocks found
- `raw_content` - Raw block content

**Example:**
```json
{
  "url": "https://example.com/reference"
}
```

### `create_page`
Create a new WordPress page with Gutenberg blocks.

**Input:**
- `title` (string, required) - Page title
- `status` (string) - Page status: "draft", "publish", "pending", "private" (default: "draft")
- `blocks` (array) - Array of block descriptors

**Block Structure:**
```json
{
  "blockName": "core/paragraph",
  "attrs": {
    "align": "center",
    "textColor": "primary",
    "className": "custom-class"
  },
  "innerContent": "<p>Your content here</p>"
}
```

### `update_page`
Update an existing page.

**Input:**
- `id` (number, required) - Page ID
- `title` (string) - New title
- `status` (string) - New status
- `blocks` (array) - Replacement blocks

### `get_page`
Get a page by ID with all blocks.

**Input:**
- `id` (number, required) - Page ID

### `list_pages`
List all pages with filtering.

**Input:**
- `per_page` (number) - Results per page (default: 50)
- `page` (number) - Page number (default: 1)
- `search` (string) - Search term

### `list_block_types`
List all registered Gutenberg block types available on your WordPress site.

### `render_blocks`
Preview how blocks will render as HTML before saving.

**Input:**
- `blocks` (array, required) - Array of block descriptors

## Common Block Types

### Headings
```json
{
  "blockName": "core/heading",
  "attrs": { "level": 2, "textAlign": "center" },
  "innerContent": "<h2>My Heading</h2>"
}
```

### Paragraphs
```json
{
  "blockName": "core/paragraph",
  "attrs": { "align": "left", "textColor": "primary" },
  "innerContent": "<p>My paragraph text</p>"
}
```

### Images
```json
{
  "blockName": "core/image",
  "attrs": {
    "url": "https://example.com/image.jpg",
    "alt": "Description",
    "width": 800,
    "height": 600
  },
  "innerContent": "<figure><img src=\"...\"/></figure>"
}
```

### Columns Layout
```json
{
  "blockName": "core/columns",
  "attrs": {},
  "innerContent": "<!-- Column blocks go here -->"
}
```

### Groups (Containers)
```json
{
  "blockName": "core/group",
  "attrs": {
    "backgroundColor": "light-gray",
    "className": "custom-container"
  },
  "innerContent": "<div><!-- Inner blocks --></div>"
}
```

## Troubleshooting

### Authentication Errors
- Verify your Application Password is correct
- Check that the WordPress user has `edit_pages` capability
- Ensure REST API is enabled on your WordPress site

### Content Not Extracted
- The reference page might not be a WordPress site
- Try accessing the page directly in a browser to verify it loads
- Check if the site blocks automated requests

### Blocks Not Rendering Correctly
- Use `list_block_types` to see available blocks on your site
- Some custom blocks may require specific plugins
- Check block attributes match the expected schema

### Connection Issues
- Verify `WP_BASE_URL` is accessible from your machine
- For local development, ensure WordPress is running
- Check firewall settings if using remote WordPress

## Advanced Usage

### Working with Custom Blocks

If your WordPress site has custom blocks (from plugins or themes), they'll appear in `list_block_types`. Use them like core blocks:

```json
{
  "blockName": "acf/testimonial",
  "attrs": {
    "name": "John Doe",
    "rating": 5
  },
  "innerContent": "<div>...</div>"
}
```

### Batch Operations

Create multiple pages efficiently:

```
Analyze these 3 reference pages and create copies:
1. https://example.com/page1
2. https://example.com/page2
3. https://example.com/page3
```

### Preserving Styles

The `analyze_reference_page` tool extracts:
- CSS classes (including theme-specific classes)
- Inline styles
- Color schemes (text and background)
- Alignment and spacing
- Typography settings
- Layout structures (columns, groups, containers)

## Security Notes

- Application Passwords are more secure than regular passwords
- They can be revoked individually without changing your main password
- Never commit credentials to version control
- Use environment variables for sensitive data

## Contributing

To improve the MCP server:

1. **Add New Tools** - Edit `index.js` to add new capabilities
2. **Enhance Block Parsing** - Improve `gmcp_html_to_blocks()` in the plugin
3. **Support More Block Types** - Extend `gmcp_node_to_block()` mapping

## License

MIT License - Feel free to use and modify for your projects.

## Support

For issues or questions:
- Check WordPress REST API is working: `http://your-site.com/wp-json/`
- Verify plugin is activated in WordPress admin
- Test authentication with a REST API client like Postman
- Check WordPress error logs for detailed error messages
