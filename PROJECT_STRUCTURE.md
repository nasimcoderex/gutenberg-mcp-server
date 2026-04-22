# Gutenberg MCP Server - Project Structure

## Overview

This is a professional MCP (Model Context Protocol) server for creating and managing WordPress pages with Gutenberg blocks. The project is clean, well-documented, and production-ready.

## Directory Structure

```
gutenberg-mcp-server/
├── index.js                      # Main MCP server (core functionality)
├── package.json                  # Node.js dependencies
├── package-lock.json             # Locked dependency versions
├── .env.example                  # Environment variables template
├── .gitignore                    # Git ignore rules
├── README.md                     # Main documentation
├── USAGE_GUIDE.md                # How to use the MCP properly
├── EXAMPLES.md                   # Practical usage examples
├── DESIGN_REPLICATION_GUIDE.md   # Advanced design replication
├── CHANGELOG.md                  # Version history
└── .kiro/
    └── settings/
        └── mcp.json              # Kiro MCP configuration

gutenberg-mcp/
└── gutenberg-mcp.php             # WordPress plugin
```

## Core Files

### index.js
The main MCP server that provides tools for WordPress page management:
- `create_page` - Create new pages
- `update_page` - Update existing pages
- `get_page` - Retrieve page details
- `list_pages` - List and search pages
- `delete_page` - Delete or trash pages
- `analyze_reference_page` - Extract block structure from URLs
- `list_block_types` - List available blocks
- `render_blocks` - Preview block rendering

### gutenberg-mcp.php
WordPress plugin that provides custom REST API endpoints for the MCP server.

## Documentation Files

### README.md
- Installation instructions
- Configuration guide
- Tool reference
- Block format examples
- Troubleshooting

### USAGE_GUIDE.md
- How to use MCP properly (no script files!)
- Best practices
- Common workflows
- Do's and don'ts

### EXAMPLES.md
- Practical usage examples
- Real-world scenarios
- Common patterns
- Tips for success

### DESIGN_REPLICATION_GUIDE.md
- How to replicate designs from reference URLs
- Step-by-step workflows
- Advanced techniques
- Troubleshooting design differences

### CHANGELOG.md
- Version history
- Feature additions
- Breaking changes
- Migration guides

## Configuration Files

### .env.example
Template for environment variables:
```bash
WP_BASE_URL=http://your-site.local
WP_USER=your-username
WP_APP_PASSWORD=your-app-password
```

### .kiro/settings/mcp.json
Kiro MCP client configuration:
```json
{
  "mcpServers": {
    "gutenberg": {
      "command": "node",
      "args": ["./index.js"],
      "env": {
        "WP_BASE_URL": "http://wpfunnels.local/",
        "WP_USER": "admin",
        "WP_APP_PASSWORD": "your-password"
      }
    }
  }
}
```

### .gitignore
Ignores:
- node_modules/
- .env files
- OS files (.DS_Store)
- IDE files (.vscode, .idea)
- Logs and temporary files

## What Was Removed

The following files were removed to keep the repository clean and professional:

### Removed Test Scripts
- test-mcp.js
- test-auth.js

### Removed Example Scripts
- create-ugc-for-wc.js
- create-ugc-page.js
- create-ugc-wp-api.js
- create-page-direct.js
- create-analytics-dashboard.js
- create-analytics-dashboard-v2.js
- create-analytics-dashboard-v3.js
- replicate-ugc-page.js
- update-page.js
- list-and-cleanup.js

### Removed Redundant Documentation
- QUICK_START.md
- SETUP_INSTRUCTIONS.md
- TESTING.md
- KIRO_SETUP.md
- CREATE_UGC_PAGE_GUIDE.md
- IMPROVEMENTS.md
- replicate-design.md

### Removed Content Files
- UGC_PAGE_CONTENT.txt

### Removed System Files
- .DS_Store

## Why This Structure?

### Professional
- Clean and organized
- No clutter or temporary files
- Clear separation of concerns
- Production-ready

### Maintainable
- Single source of truth (index.js)
- Comprehensive documentation
- Version controlled
- Easy to update

### Efficient
- No redundant files
- No script files for each task
- Uses MCP tools directly
- Lightweight repository

### User-Friendly
- Clear documentation
- Practical examples
- Step-by-step guides
- Best practices included

## How to Use

### For Users
1. Read README.md for setup
2. Read USAGE_GUIDE.md to understand proper usage
3. Check EXAMPLES.md for practical examples
4. Use natural language with AI assistant
5. AI uses MCP tools automatically

### For Developers
1. Review index.js for tool implementations
2. Check gutenberg-mcp.php for WordPress integration
3. Read CHANGELOG.md for version history
4. Follow best practices in documentation
5. Contribute improvements via pull requests

## Key Principles

### 1. No Script Files
- Don't create separate JS files for each task
- Use MCP tools directly via AI assistant
- Keep repository clean

### 2. Natural Language
- Describe what you want in plain English
- AI chooses appropriate tools
- No coding required

### 3. Iterate and Refine
- Create as draft first
- Review in WordPress
- Make incremental changes
- Publish when ready

### 4. Documentation First
- Comprehensive guides
- Practical examples
- Clear explanations
- Easy to follow

## Version

Current version: 1.0.0

See CHANGELOG.md for version history.

## License

MIT License - See LICENSE file for details.

## Support

For questions or issues:
- Check README.md for setup
- Review USAGE_GUIDE.md for proper usage
- Read EXAMPLES.md for practical examples
- Check DESIGN_REPLICATION_GUIDE.md for advanced features
