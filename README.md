# Gutenberg MCP Server

A professional Model Context Protocol (MCP) server for creating and managing WordPress pages with Gutenberg blocks. This server enables AI assistants to create, update, and replicate WordPress page designs programmatically.

## Features

- ✅ **Create Pages** - Build WordPress pages with Gutenberg blocks via AI
- ✅ **Update Pages** - Modify existing pages with new content and blocks
- ✅ **List & Get Pages** - Browse and retrieve page information
- ✅ **Analyze Reference Pages** - Extract complete block structure from any WordPress page URL
- ✅ **Block Management** - Work with all registered Gutenberg block types
- ✅ **Design Replication** - Copy designs including colors, spacing, alignment, and layout

## Installation

### Prerequisites

- Node.js 18+ with npm
- WordPress site with REST API enabled
- WordPress Application Password for authentication

### 1. Install the WordPress Plugin

Copy the `gutenberg-mcp` folder to your WordPress plugins directory:

```bash
cp -r gutenberg-mcp /path/to/wordpress/wp-content/plugins/
```

Then activate the plugin in WordPress admin.

### 2. Create WordPress Application Password

1. Go to WordPress Admin → Users → Profile
2. Scroll to "Application Passwords"
3. Enter a name (e.g., "MCP Server") and click "Add New Application Password"
4. Copy the generated password (format: `xxxx xxxx xxxx xxxx xxxx xxxx`)

### 3. Install MCP Server Dependencies

```bash
cd gutenberg-mcp-server
npm install
```

### 4. Configure MCP Client

Add to your MCP client configuration:

**For Kiro** (`.kiro/settings/mcp.json`):
```json
{
  "mcpServers": {
    "gutenberg": {
      "command": "node",
      "args": ["./index.js"],
      "env": {
        "WP_BASE_URL": "http://your-site.local",
        "WP_USER": "your-username",
        "WP_APP_PASSWORD": "your-app-password"
      },
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

**For Claude Desktop** (`~/Library/Application Support/Claude/claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "gutenberg": {
      "command": "node",
      "args": ["/absolute/path/to/gutenberg-mcp-server/index.js"],
      "env": {
        "WP_BASE_URL": "http://your-site.local",
        "WP_USER": "your-username",
        "WP_APP_PASSWORD": "your-app-password"
      }
    }
  }
}
```

## Usage

### Create a Page from Scratch

```
Create a WordPress page titled "About Us" with:
- A heading "Welcome to Our Company"
- A paragraph with company description
- A two-column layout with team info
```

### Replicate a Page Design

```
Analyze this reference page: https://example.com/reference-page
Then create a new page with the same design and content
```

### Update an Existing Page

```
Update page ID 42:
- Change the title to "New Title"
- Add a call-to-action button at the end
```

### List Pages

```
Show me all draft pages
```

## Available MCP Tools

### `create_page`
Create a new WordPress page with Gutenberg blocks.

**Parameters:**
- `title` (string, required) - Page title
- `status` (string) - Page status: "draft", "publish", "pending", "private" (default: "draft")
- `blocks` (array) - Array of block descriptors (optional, can use content instead)
- `content` (string) - WordPress block format content (optional, alternative to blocks)

**Example:**
```json
{
  "title": "My New Page",
  "status": "draft",
  "content": "<!-- wp:paragraph -->\n<p>Hello World</p>\n<!-- /wp:paragraph -->"
}
```

### `update_page`
Update an existing page.

**Parameters:**
- `id` (number, required) - Page ID
- `title` (string) - New title
- `status` (string) - New status
- `content` (string) - New content in WordPress block format

### `get_page`
Get a page by ID with all blocks.

**Parameters:**
- `id` (number, required) - Page ID

### `list_pages`
List all pages with filtering.

**Parameters:**
- `per_page` (number) - Results per page (default: 50)
- `page` (number) - Page number (default: 1)
- `search` (string) - Search term

### `delete_page`
Delete or trash a page.

**Parameters:**
- `id` (number, required) - Page ID
- `force` (boolean) - Permanently delete (true) or move to trash (false, default)

### `analyze_reference_page`
Extract complete block structure from a WordPress page URL.

**Parameters:**
- `url` (string, required) - Full URL of the reference page

**Returns:**
- `title` - Extracted page title
- `blocks` - Array of parsed Gutenberg blocks with all attributes
- `block_count` - Number of blocks found
- `raw_content` - Raw block content

### `list_block_types`
List all registered Gutenberg block types available on your WordPress site.

### `render_blocks`
Preview how blocks will render as HTML before saving.

**Parameters:**
- `blocks` (array, required) - Array of block descriptors to render

## WordPress Block Format

WordPress uses a special comment format for blocks:

```html
<!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center">This is centered text</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":2} -->
<h2>This is a heading</h2>
<!-- /wp:heading -->

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

## Common Block Examples

### Heading
```html
<!-- wp:heading {"level":2,"textAlign":"center"} -->
<h2 class="has-text-align-center">My Heading</h2>
<!-- /wp:heading -->
```

### Paragraph
```html
<!-- wp:paragraph {"style":{"color":{"text":"#ff0000"}}} -->
<p class="has-text-color" style="color:#ff0000">Red text</p>
<!-- /wp:paragraph -->
```

### Button
```html
<!-- wp:button {"backgroundColor":"primary"} -->
<div class="wp-block-button">
  <a class="wp-block-button__link has-primary-background-color">Click Me</a>
</div>
<!-- /wp:button -->
```

### Columns
```html
<!-- wp:columns -->
<div class="wp-block-columns">
  <!-- wp:column -->
  <div class="wp-block-column">
    <!-- wp:paragraph -->
    <p>Column 1 content</p>
    <!-- /wp:paragraph -->
  </div>
  <!-- /wp:column -->
  
  <!-- wp:column -->
  <div class="wp-block-column">
    <!-- wp:paragraph -->
    <p>Column 2 content</p>
    <!-- /wp:paragraph -->
  </div>
  <!-- /wp:column -->
</div>
<!-- /wp:columns -->
```

### Group (Container)
```html
<!-- wp:group {"style":{"spacing":{"padding":{"top":"40px","bottom":"40px"}},"color":{"background":"#f0f0f0"}}} -->
<div class="wp-block-group has-background" style="background-color:#f0f0f0;padding-top:40px;padding-bottom:40px">
  <!-- Inner blocks go here -->
</div>
<!-- /wp:group -->
```

## Troubleshooting

### Authentication Errors
- Verify your Application Password is correct
- Check that the WordPress user has `edit_pages` capability
- Ensure REST API is enabled on your WordPress site

### Blocks Not Rendering Correctly
- Use `list_block_types` to see available blocks on your site
- Some custom blocks may require specific plugins
- Check block attributes match the expected schema

### Connection Issues
- Verify `WP_BASE_URL` is accessible from your machine
- For local development, ensure WordPress is running
- Check firewall settings if using remote WordPress

## Security Notes

- Application Passwords are more secure than regular passwords
- They can be revoked individually without changing your main password
- Never commit credentials to version control
- Use environment variables for sensitive data

## Project Structure

```
gutenberg-mcp-server/
├── index.js                    # Main MCP server
├── package.json                # Dependencies
├── .env.example                # Environment variables template
├── README.md                   # This file
├── EXAMPLES.md                 # Usage examples
├── DESIGN_REPLICATION_GUIDE.md # Guide for replicating designs
└── CHANGELOG.md                # Version history

gutenberg-mcp/
└── gutenberg-mcp.php           # WordPress plugin
```

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - Feel free to use and modify for your projects.

## Support

For issues or questions:
- Check WordPress REST API is working: `http://your-site.com/wp-json/`
- Verify plugin is activated in WordPress admin
- Test authentication with a REST API client like Postman
- Check WordPress error logs for detailed error messages

## Version

Current version: 1.0.0

See [CHANGELOG.md](CHANGELOG.md) for version history.
