const https = require('https');
const fs = require('fs');
const path = require('path');

/**
 * ALTERNATIVE: Manual speaker image mapping
 * 
 * If automatic scraping doesn't work well, you can:
 * 1. Manually inspect https://ccoi.asia/speakers/ in your browser
 * 2. Right-click on speaker images and copy image URLs
 * 3. Add them to the speakerImages object below
 * 4. Run: node scripts/download-speaker-images.js
 */

const OUTPUT_DIR = path.join(__dirname, '../public/images/speakers');
const MAPPING_FILE = path.join(__dirname, '../data/speaker-images.json');

// Ensure directories exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// TODO: Fill this object with speaker image URLs from the website
// Format: "speaker-slug": "image-url"
const speakerImages = {
  // Example:
  // "malvina-eydelman": "https://ccoi.asia/wp-content/uploads/2024/...",
  // "daniel-ting": "https://ccoi.asia/wp-content/uploads/2024/...",
  // Add more speakers here...
};

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/\s*\([^)]+\)\s*$/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'speaker';
}

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : require('http');
    client.get(url, (res) => {
      if (res.statusCode === 302 || res.statusCode === 301) {
        // Follow redirect
        return downloadImage(res.headers.location, filepath).then(resolve).catch(reject);
      }
      const fileStream = fs.createWriteStream(filepath);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
    }).on('error', reject);
  });
}

async function downloadImages() {
  const mapping = {};
  let count = 0;
  
  for (const [slug, imageUrl] of Object.entries(speakerImages)) {
    try {
      const extension = path.extname(new URL(imageUrl).pathname) || '.jpg';
      const filename = `${slug}${extension}`;
      const filepath = path.join(OUTPUT_DIR, filename);
      
      console.log(`Downloading: ${slug} -> ${filename}`);
      await downloadImage(imageUrl, filepath);
      
      mapping[slug] = `/images/speakers/${filename}`;
      count++;
    } catch (err) {
      console.error(`Failed to download ${slug}:`, err.message);
    }
  }
  
  // Save mapping
  fs.writeFileSync(MAPPING_FILE, JSON.stringify(mapping, null, 2));
  
  console.log(`✅ Downloaded ${count} images`);
  console.log(`📝 Mapping saved to ${MAPPING_FILE}`);
}

// If speakerImages is empty, show instructions
if (Object.keys(speakerImages).length === 0) {
  console.log(`
📋 INSTRUCTIONS:
1. Visit https://ccoi.asia/speakers/ in your browser
2. Right-click on each speaker's image and select "Copy Image Address"
3. Edit this file (scripts/download-speaker-images.js)
4. Add entries to the speakerImages object like:
   "malvina-eydelman": "https://ccoi.asia/wp-content/uploads/.../image.jpg",
5. Run this script again: node scripts/download-speaker-images.js

Alternatively, you can manually download images and place them in:
public/images/speakers/ with filenames like: malvina-eydelman.jpg
  `);
} else {
  downloadImages();
}
