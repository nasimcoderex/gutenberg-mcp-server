#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the WordPress block content with CSS classes
const content = fs.readFileSync(path.join(__dirname, 'cartflows-page-with-classes.html'), 'utf8');

// WordPress REST API configuration
const WP_BASE_URL = process.env.WP_BASE_URL || 'http://wpfunnels.local/';
const WP_USER = process.env.WP_USER || 'admin';
const WP_APP_PASSWORD = process.env.WP_APP_PASSWORD || 'VS29 m0Bv lFrD Wqv0 XXU8 2OLP';

// Update the existing page (ID 388) or create new
async function createOrUpdatePage() {
  const pageId = 388;
  const url = `${WP_BASE_URL.replace(/\/$/, '')}/wp-json/wp/v2/pages/${pageId}`;
  
  const auth = Buffer.from(`${WP_USER}:${WP_APP_PASSWORD}`).toString('base64');
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: 'Sales Funnel Builder - Landing Page',
      content: content,
      status: 'draft'
    })
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to update page: ${response.status} ${error}`);
  }
  
  const data = await response.json();
  
  console.log('✅ Page created/updated successfully with CSS classes!');
  console.log(`📄 Page ID: ${data.id}`);
  console.log(`🔗 Edit URL: ${WP_BASE_URL.replace(/\/$/, '')}/wp-admin/post.php?post=${data.id}&action=edit`);
  console.log(`👁️  Preview URL: ${data.link}`);
  console.log('\n📋 NEXT STEPS:');
  console.log('   1. Go to Appearance → Customize → Additional CSS');
  console.log('   2. Copy content from custom-styles.css');
  console.log('   3. Paste into Additional CSS box');
  console.log('   4. Click Publish');
  console.log('   5. View your beautifully styled page!');
  console.log('\n💡 TIP: See STYLING_SOLUTION.md for detailed instructions');
  
  return data;
}

createOrUpdatePage().catch(error => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
