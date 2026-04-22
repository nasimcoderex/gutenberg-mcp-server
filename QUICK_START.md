# Quick Start Guide

Get your Gutenberg MCP Server running in 5 minutes.

## Prerequisites

- ✅ WordPress site (local or remote)
- ✅ Node.js 18+ installed
- ✅ WordPress user with admin/editor permissions

## Setup Steps

### 1. Install WordPress Plugin (2 minutes)

```bash
# Copy plugin to WordPress
cp -r gutenberg-mcp /path/to/wordpress/wp-content/plugins/

# Or if using Local by Flywheel:
cp -r gutenberg-mcp ~/Local\ Sites/your-site/app/public/wp-content/plugins/
```

Then activate in WordPress:
- Go to **Plugins** → **Installed Plugins**
- Find "Gutenberg MCP"
- Click **Activate**

### 2. Create Application Password (1 minute)

In WordPress admin:
1. Go to **Users** → **Profile**
2. Scroll to **Application Passwords**
3. Name it "MCP Server"
4. Click **Add New Application Password**
5. **Copy the password** (you won't see it again!)

### 3. Install MCP Server (1 minute)

```bash
cd gutenberg-mcp-server
npm install
```

### 4. Configure Your MCP Client (1 minute)

#### For Kiro

Create or edit `.kiro/settings/mcp.json` in your workspace:

```json
{
  "mcpServers": {
    "gutenberg": {
      "command": "node",
      "args": ["./gutenberg-mcp-server/index.js"],
      "env": {
        "WP_BASE_URL": "http://wpfunnels.local",
        "WP_USER": "admin",
        "WP_APP_PASSWORD": "paste-your-app-password-here"
      }
    }
  }
}
```

#### For Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "gutenberg": {
      "command": "node",
      "args": ["/full/path/to/gutenberg-mcp-server/index.js"],
      "env": {
        "WP_BASE_URL": "http://wpfunnels.local",
        "WP_USER": "admin",
        "WP_APP_PASSWORD": "paste-your-app-password-here"
      }
    }
  }
}
```

#### For VSCode with MCP Extension

Add to your VSCode settings or workspace `.vscode/settings.json`:

```json
{
  "mcp.servers": {
    "gutenberg": {
      "command": "node",
      "args": ["./gutenberg-mcp-server/index.js"],
      "env": {
        "WP_BASE_URL": "http://wpfunnels.local",
        "WP_USER": "admin",
        "WP_APP_PASSWORD": "paste-your-app-password-here"
      }
    }
  }
}
```

**Important:** Replace these values:
- `WP_BASE_URL`: Your WordPress site URL (no trailing slash)
- `WP_USER`: Your WordPress username
- `WP_APP_PASSWORD`: The application password you created

### 5. Test It! (30 seconds)

Restart your MCP client (Kiro, Claude Desktop, etc.), then try:

```
List all WordPress pages on my site
```

If you see a list of pages, **you're ready!** 🎉

## Your First Design Replication

Now let's replicate a page design:

```
Analyze this reference page: https://rek433bjmg-staging.onrocket.site/ugc-for-woocommerce/

Then create a new page with the same design and content
```

The AI will:
1. ✅ Fetch and analyze the reference page
2. ✅ Extract all blocks with styling
3. ✅ Create a new page on your WordPress site
4. ✅ Give you the URL to review

## Common Commands

### List Pages
```
Show me all draft pages
```

### Get a Specific Page
```
Get page ID 42 and show me its blocks
```

### Create a Simple Page
```
Create a new page titled "About Us" with:
- A heading "Welcome"
- A paragraph "We are a great company"
- Status: draft
```

### Update a Page
```
Update page ID 42 to change the title to "New Title"
```

### Analyze Any WordPress Page
```
Analyze this page: https://example.com/any-wordpress-page
```

### See Available Blocks
```
List all block types available on my WordPress site
```

## Troubleshooting

### "Authentication failed"
- Double-check your Application Password (no spaces)
- Verify your username is correct
- Make sure the WordPress user has edit_pages permission

### "Connection refused"
- Is WordPress running? (for local sites)
- Check WP_BASE_URL is correct
- Try accessing `http://your-site.com/wp-json/` in a browser

### "Plugin not found"
- Make sure you activated the plugin in WordPress admin
- Check the plugin folder is in `wp-content/plugins/gutenberg-mcp/`

### MCP Server Not Showing Up
- Restart your MCP client completely
- Check the JSON configuration has no syntax errors
- Look for error messages in the client's console/logs

### "Could not extract content"
- The URL might not be a WordPress site
- The site might block automated requests
- Try a different reference URL

## Next Steps

- 📖 Read [README.md](./README.md) for complete documentation
- 🎨 Check [DESIGN_REPLICATION_GUIDE.md](./DESIGN_REPLICATION_GUIDE.md) for advanced techniques
- 🔧 Explore all available tools and their parameters

## Tips

1. **Always create as draft first** - Review before publishing
2. **Start with simple pages** - Test with basic content before complex designs
3. **Use analyze_reference_page** - Don't manually recreate designs
4. **Check your theme** - Some designs need specific themes or plugins
5. **Keep credentials secure** - Never commit passwords to git

## Support

If you're stuck:
1. Check WordPress is accessible: `http://your-site.com/wp-json/`
2. Verify plugin is active in WordPress admin
3. Test authentication with a REST client like Postman
4. Check WordPress debug logs for errors

## Example Session

Here's a complete example workflow:

**You:** List my WordPress pages

**AI:** *Shows list of pages*

**You:** Analyze https://rek433bjmg-staging.onrocket.site/ugc-for-woocommerce/

**AI:** *Extracts 15 blocks including headings, paragraphs, images, and columns*

**You:** Create a new page with that design, title it "UGC for WooCommerce"

**AI:** *Creates page as draft*

**You:** What's the URL?

**AI:** http://wpfunnels.local/ugc-for-woocommerce/

**You:** Perfect! Publish it.

**AI:** *Updates status to publish*

Done! 🚀

## Security Note

Application Passwords are safer than regular passwords because:
- They can be revoked individually
- They don't change your main password
- They're specific to one application
- You can create multiple for different tools

Always keep them secure and never commit them to version control!
