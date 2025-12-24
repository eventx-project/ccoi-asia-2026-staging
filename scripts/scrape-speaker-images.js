const https = require('https');
const fs = require('fs');
const path = require('path');

/**
 * Scrape speaker images from CCOI website
 * This script will:
 * 1. Fetch the speakers page HTML
 * 2. Parse speaker names and image URLs
 * 3. Download images to public/images/speakers/
 * 4. Create a mapping file for reference
 */

const SPEAKERS_URL = 'https://ccoi.asia/speakers/';
const OUTPUT_DIR = path.join(__dirname, '../public/images/speakers');
const MAPPING_FILE = path.join(__dirname, '../data/speaker-images.json');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const fileStream = fs.createWriteStream(filepath);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
    }).on('error', reject);
  });
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/\s*\([^)]+\)\s*$/g, '') // Remove country
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'speaker';
}

async function scrapeSpeakers() {
  try {
    console.log('Fetching speakers page...');
    const html = await fetchHTML(SPEAKERS_URL);
    
    // Save raw HTML for reference
    const dataDir = path.join(__dirname, '../data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(path.join(dataDir, 'speakers-page.html'), html);
    
    console.log('Parsing speaker data...\n');
    
    // Find all <img> tags with class="circular-headshot"
    const imgRegex = /<img[^>]*class="circular-headshot"[^>]*>/g;
    
    let imgMatch;
    const speakers = {};
    let count = 0;
    
    while ((imgMatch = imgRegex.exec(html)) !== null) {
      const imgTag = imgMatch[0];
      const startPos = imgMatch.index + imgTag.length;
      
      // Extract src from the img tag
      const srcMatch = imgTag.match(/src="([^"]+)"/);
      
      // Look ahead for the <a> tag with the name
      const after = html.substring(startPos, startPos + 200);
      const nameMatch = after.match(/<a[^>]*>([^<]+)<\/a>/);
      
      if (srcMatch && nameMatch) {
        const imageUrl = srcMatch[1];
        const speakerName = nameMatch[1].trim();
        const slug = slugify(speakerName);
        
        // Skip duplicates
        if (speakers[slug]) continue;
        
        const extension = path.extname(new URL(imageUrl).pathname) || '.jpg';
        const filename = `${slug}${extension}`;
        const filepath = path.join(OUTPUT_DIR, filename);
        
        console.log(`Downloading: ${speakerName} -> ${filename}`);
        
        try {
          await downloadImage(imageUrl, filepath);
          speakers[slug] = `/images/speakers/${filename}`;
          count++;
        } catch (err) {
          console.error(`  ✗ Failed: ${err.message}`);
        }
      }
    }
    
    // Save mapping
    fs.writeFileSync(MAPPING_FILE, JSON.stringify(speakers, null, 2));
    
    console.log(`\n✅ Successfully downloaded ${count} speaker images`);
    console.log(`📝 Mapping saved to ${MAPPING_FILE}`);
    
  } catch (error) {
    console.error('❌ Error scraping speakers:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

scrapeSpeakers();
