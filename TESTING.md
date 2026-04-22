# Testing Guide

Verify your Gutenberg MCP Server is working correctly.

## Pre-Flight Checklist

Before testing, ensure:

- ✅ WordPress plugin is activated
- ✅ Application Password is created
- ✅ MCP server dependencies are installed (`npm install`)
- ✅ MCP client is configured with correct credentials
- ✅ WordPress site is accessible

## Quick Health Check

### Test 1: Connection Test

**Command:**
```
List all WordPress pages
```

**Expected Result:**
- Returns a list of pages (or empty array if no pages exist)
- No authentication errors
- Response includes page titles, IDs, and block counts

**If it fails:**
- Check `WP_BASE_URL` is correct
- Verify Application Password has no spaces or typos
- Ensure WordPress is running (for local sites)

---

### Test 2: Block Types Test

**Command:**
```
List all block types available on my WordPress site
```

**Expected Result:**
- Returns array of block types
- Should include core blocks like `core/paragraph`, `core/heading`, `core/image`
- May include custom blocks from plugins

**If it fails:**
- Check WordPress REST API is accessible: `http://your-site.com/wp-json/`
- Verify plugin is activated

---

### Test 3: Create Simple Page

**Command:**
```
Create a new page titled "Test Page" with:
- A heading "Hello World"
- A paragraph "This is a test"
- Status: draft
```

**Expected Result:**
- Page is created successfully
- Returns page ID and URL
- Page appears in WordPress admin under Pages

**If it fails:**
- Check user has `edit_pages` permission
- Verify Application Password is correct
- Check WordPress error logs

---

### Test 4: Get Page Test

**Command:**
```
Get page ID [use ID from Test 3]
```

**Expected Result:**
- Returns complete page data
- Includes title, status, blocks array
- Block count matches what you created

**If it fails:**
- Verify the page ID exists
- Check page wasn't deleted

---

### Test 5: Update Page Test

**Command:**
```
Update page ID [use ID from Test 3] to change the title to "Updated Test Page"
```

**Expected Result:**
- Page title is updated
- Returns updated page data
- Change is visible in WordPress admin

**If it fails:**
- Check user has edit permissions
- Verify page ID is correct

---

### Test 6: Analyze Reference Page

**Command:**
```
Analyze this reference page: https://wordpress.org/about/
```

**Expected Result:**
- Returns extracted blocks
- Includes title, block count, and block array
- No fetch errors

**If it fails:**
- Check internet connection
- Try a different URL
- Some sites may block automated requests

---

### Test 7: Delete Page Test

**Command:**
```
Delete page ID [use ID from Test 3] (move to trash, don't force delete)
```

**Expected Result:**
- Page is moved to trash
- Returns `deleted: true`
- Page appears in Trash in WordPress admin

**If it fails:**
- Check user has delete permissions
- Verify page ID exists

---

## Detailed Testing

### Test Suite 1: Block Creation

Test creating pages with different block types:

#### Test 1.1: Headings
```
Create a page titled "Heading Test" with:
- H1: "Heading 1"
- H2: "Heading 2"
- H3: "Heading 3"
Status: draft
```

#### Test 1.2: Paragraphs with Styling
```
Create a page titled "Paragraph Test" with:
- A centered paragraph with text "Centered text"
- A left-aligned paragraph with text "Left aligned"
Status: draft
```

#### Test 1.3: Images
```
Create a page titled "Image Test" with:
- An image from https://placehold.co/800x600
- Alt text: "Test image"
- Centered alignment
Status: draft
```

#### Test 1.4: Lists
```
Create a page titled "List Test" with:
- An unordered list with 3 items
- An ordered list with 3 items
Status: draft
```

#### Test 1.5: Columns
```
Create a page titled "Column Test" with:
- A two-column layout
- Left column: heading and paragraph
- Right column: heading and paragraph
Status: draft
```

---

### Test Suite 2: Page Management

#### Test 2.1: Search Pages
```
Search for pages containing "test"
```

**Expected:** Returns all test pages created above

#### Test 2.2: Pagination
```
List pages with per_page=2 and page=1
```

**Expected:** Returns first 2 pages

#### Test 2.3: Status Filter
```
List all draft pages
```

**Expected:** Returns only draft pages

---

### Test Suite 3: Design Replication

#### Test 3.1: Analyze WordPress.org Page
```
Analyze https://wordpress.org/about/
```

**Expected:**
- Extracts multiple blocks
- Includes headings, paragraphs, images
- Block attributes are captured

#### Test 3.2: Create from Analysis
```
Create a new page titled "WordPress About Copy" using the blocks from the previous analysis
Status: draft
```

**Expected:**
- Page is created with similar structure
- Blocks are properly formatted
- Styling is preserved

#### Test 3.3: Compare Designs
```
Get the page we just created
Compare its block structure with the original analysis
```

**Expected:**
- Block types match
- Content is similar
- Attributes are preserved

---

### Test Suite 4: Error Handling

#### Test 4.1: Invalid Page ID
```
Get page ID 999999
```

**Expected:** Returns "Page not found" error

#### Test 4.2: Invalid URL
```
Analyze this page: https://invalid-url-that-does-not-exist.com
```

**Expected:** Returns fetch error

#### Test 4.3: Missing Required Fields
```
Create a page without a title
```

**Expected:** Returns validation error

#### Test 4.4: Invalid Block Type
```
Create a page with a block named "core/nonexistent"
```

**Expected:** WordPress may accept it but won't render properly

---

### Test Suite 5: Advanced Features

#### Test 5.1: Nested Blocks
```
Create a page titled "Nested Blocks Test" with:
- A group block containing:
  - A heading
  - A paragraph
  - An image
Status: draft
```

#### Test 5.2: Block Attributes
```
Create a page titled "Attributes Test" with:
- A heading with level 2, centered alignment, and primary color
- A paragraph with custom background color
Status: draft
```

#### Test 5.3: Render Preview
```
Render these blocks to HTML:
- Heading: "Preview Test"
- Paragraph: "This is a preview"
```

**Expected:** Returns rendered HTML

---

## Performance Testing

### Test P1: Large Page
```
Create a page with 50 paragraphs of lorem ipsum text
```

**Expected:** Completes within 5 seconds

### Test P2: Multiple Pages
```
Create 10 pages with simple content
```

**Expected:** All pages created successfully

### Test P3: Large Analysis
```
Analyze a page with 100+ blocks
```

**Expected:** Completes within 30 seconds

---

## Integration Testing

### Test I1: With Kiro
1. Configure MCP in Kiro
2. Restart Kiro
3. Run: "List my WordPress pages"
4. Verify response

### Test I2: With Claude Desktop
1. Configure MCP in Claude Desktop
2. Restart Claude Desktop
3. Run: "List my WordPress pages"
4. Verify response

### Test I3: With VSCode
1. Configure MCP in VSCode
2. Reload window
3. Run: "List my WordPress pages"
4. Verify response

---

## Regression Testing

After making changes to the code, run this quick regression test:

```
1. List pages
2. Create a test page
3. Get the page by ID
4. Update the page title
5. Analyze a reference URL
6. Create a page from analysis
7. Delete the test pages
```

All operations should complete successfully.

---

## Troubleshooting Tests

### Debug Test 1: Check WordPress REST API
```bash
curl http://wpfunnels.local/wp-json/
```

**Expected:** Returns JSON with API information

### Debug Test 2: Test Authentication
```bash
curl -u "username:app-password" http://wpfunnels.local/wp-json/wp/v2/pages
```

**Expected:** Returns list of pages

### Debug Test 3: Test Plugin Endpoint
```bash
curl -u "username:app-password" http://wpfunnels.local/wp-json/gutenberg-mcp/v1/pages
```

**Expected:** Returns pages with block data

### Debug Test 4: Check Node.js Version
```bash
node --version
```

**Expected:** v18.0.0 or higher

### Debug Test 5: Check Dependencies
```bash
cd gutenberg-mcp-server
npm list
```

**Expected:** All dependencies installed without errors

---

## Automated Testing Script

Create a file `test.sh` for automated testing:

```bash
#!/bin/bash

echo "Testing Gutenberg MCP Server..."

# Test 1: List pages
echo "Test 1: List pages"
# Run your MCP client command here

# Test 2: Create page
echo "Test 2: Create page"
# Run your MCP client command here

# Test 3: Get page
echo "Test 3: Get page"
# Run your MCP client command here

# Test 4: Update page
echo "Test 4: Update page"
# Run your MCP client command here

# Test 5: Delete page
echo "Test 5: Delete page"
# Run your MCP client command here

echo "All tests completed!"
```

---

## Test Results Checklist

After running all tests, verify:

- [ ] Can list pages
- [ ] Can create pages with various block types
- [ ] Can get individual pages
- [ ] Can update pages
- [ ] Can delete pages
- [ ] Can analyze reference URLs
- [ ] Can create pages from analysis
- [ ] Block attributes are preserved
- [ ] Styling is maintained
- [ ] Images are handled correctly
- [ ] Nested blocks work
- [ ] Error handling works
- [ ] Performance is acceptable

---

## Reporting Issues

If tests fail, collect this information:

1. **Error message** - Exact error text
2. **Command used** - What you tried to do
3. **Expected result** - What should happen
4. **Actual result** - What actually happened
5. **Environment**:
   - WordPress version
   - Node.js version
   - MCP client (Kiro, Claude, etc.)
   - Operating system
6. **Logs**:
   - WordPress debug log
   - MCP server output
   - Browser console errors

---

## Success Criteria

Your MCP server is working correctly if:

✅ All basic operations (list, create, get, update, delete) work
✅ Can analyze reference pages and extract blocks
✅ Can create pages with accurate designs
✅ Block attributes and styling are preserved
✅ Error handling provides clear messages
✅ Performance is acceptable for typical use cases

---

## Next Steps

Once all tests pass:

1. ✅ Start using the MCP for real projects
2. ✅ Create your own page templates
3. ✅ Build a library of reusable designs
4. ✅ Automate repetitive page creation tasks
5. ✅ Share your success with the community!

Happy testing! 🚀
