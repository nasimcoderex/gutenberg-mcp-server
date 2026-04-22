# Changelog

All notable changes to the Gutenberg MCP Server will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-22

### Added
- Initial release of Gutenberg MCP Server
- Core MCP tools for WordPress page management
- `create_page` - Create new WordPress pages with Gutenberg blocks
- `update_page` - Update existing pages
- `get_page` - Retrieve page details and content
- `list_pages` - List and search pages
- `delete_page` - Delete or trash pages
- `analyze_reference_page` - Extract block structure from reference URLs
- `list_block_types` - List available Gutenberg blocks
- `render_blocks` - Preview block rendering
- WordPress plugin for custom REST API endpoints
- Support for WordPress block format content
- Comprehensive documentation and examples
- Design replication guide

### Features
- Full Gutenberg block support
- WordPress REST API integration
- Application Password authentication
- Block structure extraction from reference pages
- Proper WordPress block comment format
- Support for nested blocks and layouts
- Custom styling and attributes
- Multi-column layouts
- Full-width sections
- Responsive design support

### Documentation
- README.md - Setup and usage guide
- EXAMPLES.md - Practical usage examples
- DESIGN_REPLICATION_GUIDE.md - Guide for replicating designs
- .env.example - Environment variables template

### Security
- Application Password authentication
- No credentials in code
- Environment variable configuration
- WordPress REST API security

## [Unreleased]

### Planned
- Image upload support
- Media library integration
- Block templates
- Custom block support
- Bulk operations
- Page duplication
- Version history
- Preview generation
- SEO metadata support
- Custom post type support

## Version History

### Version 1.0.0 (Current)
- Initial stable release
- Core functionality complete
- Production ready
- Full documentation

---

## How to Update

To update to the latest version:

```bash
cd gutenberg-mcp-server
git pull origin main
npm install
```

Then restart your MCP client (Kiro, Claude Desktop, etc.)

## Breaking Changes

None yet - this is the initial release.

## Migration Guide

Not applicable for initial release.

## Support

For issues or questions:
- Check the [README.md](README.md) for setup instructions
- Review [EXAMPLES.md](EXAMPLES.md) for usage examples
- Read [DESIGN_REPLICATION_GUIDE.md](DESIGN_REPLICATION_GUIDE.md) for advanced features
- Open an issue on GitHub for bugs or feature requests

## Contributors

Thank you to all contributors who helped make this project possible!

## License

MIT License - See LICENSE file for details
