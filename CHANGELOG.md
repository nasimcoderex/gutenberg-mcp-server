# Changelog

All notable changes to the Gutenberg MCP Server.

## [2.0.0] - 2026-04-22

### 🎉 Major Release - Design Replication

This release transforms the MCP from a basic page creator into a professional design replication tool.

### Added

#### New Tools
- **`analyze_reference_page`** - Extract complete block structure from any WordPress page URL
  - Fetches remote page content
  - Parses HTML and extracts main content area
  - Converts HTML to Gutenberg blocks with full attributes
  - Preserves styling, colors, alignment, and layout
  - Returns structured block data ready for replication

#### WordPress Plugin Enhancements
- New REST endpoint: `POST /analyze-reference`
- `gmcp_analyze_reference()` - Main analysis handler
- `gmcp_extract_wp_content()` - Intelligent content extraction with multiple selectors
- `gmcp_html_to_blocks()` - HTML to Gutenberg block conversion
- `gmcp_node_to_block()` - Element-to-block mapping with attribute extraction
- `gmcp_extract_title()` - Page title extraction from HTML
- `gmcp_get_inner_html()` - DOM node HTML extraction helper

#### Documentation
- **README.md** - Complete reference documentation (8.6KB)
- **QUICK_START.md** - 5-minute setup guide (6KB)
- **DESIGN_REPLICATION_GUIDE.md** - Comprehensive design replication workflow (9.5KB)
- **EXAMPLES.md** - 15+ real-world usage examples (9.7KB)
- **TESTING.md** - Complete test suite and verification guide (10KB)
- **IMPROVEMENTS.md** - Summary of enhancements (8KB)
- **CHANGELOG.md** - This file

#### Configuration Files
- `.env.example` - Environment variable template
- `.gitignore` - Protect credentials and sensitive files

### Enhanced

#### Block Attribute Extraction
- CSS class preservation
- Text and background color detection
- Alignment attributes (text-align, block align)
- Inline style preservation
- Custom class names

#### Block Type Mapping
- Headings (H1-H6) with level attributes
- Paragraphs with styling
- Images with URL, alt, dimensions
- Lists (ordered and unordered)
- Quotes and blockquotes
- Code blocks
- Columns and column layouts
- Groups (containers)
- Generic HTML fallback

#### Content Detection
- Multiple selector strategies for finding main content
- Support for various WordPress themes
- Handles custom page builders
- Fallback mechanisms for edge cases

### Improved

#### Error Handling
- Clear error messages for fetch failures
- Validation for missing URLs
- Graceful handling of non-WordPress sites
- Informative responses for empty content

#### Security
- Application Password authentication
- Secure credential handling
- Environment variable configuration
- .gitignore for sensitive files

#### Documentation
- Step-by-step installation guides
- Troubleshooting sections
- Real-world examples
- Best practices
- Testing procedures

### Technical Details

#### Dependencies
- No new dependencies added
- Uses built-in WordPress functions
- PHP DOMDocument for HTML parsing
- Node.js fetch for HTTP requests

#### Compatibility
- WordPress 5.0+ (Gutenberg required)
- PHP 7.4+
- Node.js 18+
- Works with any MCP client (Kiro, Claude Desktop, VSCode, etc.)

#### Performance
- Efficient HTML parsing
- Minimal memory footprint
- 30-second timeout for remote fetches
- Handles pages with 100+ blocks

## [1.0.0] - Initial Release

### Added
- Basic WordPress page management
- `list_pages` - List all pages
- `get_page` - Get page by ID
- `create_page` - Create new pages
- `update_page` - Update existing pages
- `delete_page` - Delete pages
- `list_block_types` - List available block types
- `render_blocks` - Preview block rendering
- WordPress REST API integration
- Application Password authentication

---

## Upgrade Guide

### From 1.0.0 to 2.0.0

1. **Update WordPress Plugin**
   - Replace the plugin files in `wp-content/plugins/gutenberg-mcp/`
   - No database changes required
   - No settings migration needed

2. **Update MCP Server**
   - Pull latest code
   - Run `npm install` (no new dependencies)
   - Restart your MCP client

3. **Test New Features**
   - Try: `Analyze this page: https://wordpress.org/about/`
   - Verify the analysis returns block data
   - Create a test page from the analysis

4. **Review Documentation**
   - Read QUICK_START.md for new workflows
   - Check DESIGN_REPLICATION_GUIDE.md for best practices
   - Explore EXAMPLES.md for usage patterns

### Breaking Changes
- None! All existing tools work exactly as before
- New `analyze_reference_page` tool is additive

---

## Future Roadmap

### Planned Features
- [ ] Support for reusable blocks
- [ ] Template part extraction
- [ ] Custom block attribute mapping
- [ ] Bulk page operations
- [ ] Media library integration
- [ ] SEO metadata extraction
- [ ] Multi-site support
- [ ] Page revision history
- [ ] Draft preview URLs
- [ ] Scheduled publishing

### Under Consideration
- [ ] Support for other page builders (Elementor, Divi)
- [ ] Non-WordPress site analysis
- [ ] AI-powered content enhancement
- [ ] A/B testing integration
- [ ] Analytics integration
- [ ] Accessibility checking
- [ ] Performance optimization suggestions

---

## Contributing

We welcome contributions! Areas where you can help:

1. **Improve HTML Parsing** - Better detection of content areas
2. **Add Block Types** - Support for more custom blocks
3. **Enhance Attribute Extraction** - Capture more styling details
4. **Write Tests** - Automated testing suite
5. **Documentation** - More examples and guides
6. **Bug Fixes** - Report and fix issues

---

## Support

- **Documentation**: See README.md and guides
- **Issues**: Check TESTING.md for troubleshooting
- **Examples**: See EXAMPLES.md for usage patterns
- **Quick Help**: See QUICK_START.md for setup

---

## License

MIT License - See LICENSE file for details

---

## Acknowledgments

- WordPress Gutenberg team for the block editor
- Model Context Protocol (MCP) specification
- All contributors and testers

---

**Note**: This MCP server is designed to work with WordPress sites using the Gutenberg block editor. For best results, use with WordPress 5.0 or later.
