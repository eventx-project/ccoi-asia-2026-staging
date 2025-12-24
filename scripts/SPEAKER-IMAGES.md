# Speaker Images Setup

The app supports displaying speaker profile photos. Here are three ways to add them:

## Option 1: Automatic Scraping (Experimental)

Use `scrape-speaker-images.js` to automatically extract images from the CCOI website:

```bash
node scripts/scrape-speaker-images.js
```

This will attempt to parse the HTML and download all speaker images.

## Option 2: Manual URL Collection (Recommended)

Use `download-speaker-images.js` for more control:

### Steps:
1. Visit https://ccoi.asia/speakers/ in your browser
2. Right-click on each speaker image → "Copy Image Address"
3. Edit `scripts/download-speaker-images.js`
4. Add image URLs to the `speakerImages` object:
   ```javascript
   const speakerImages = {
     "malvina-eydelman": "https://ccoi.asia/wp-content/uploads/.../speaker1.jpg",
     "daniel-ting": "https://ccoi.asia/wp-content/uploads/.../speaker2.jpg",
     "mark-blumenkranz": "https://ccoi.asia/wp-content/uploads/.../speaker3.jpg",
     // ... add more
   };
   ```
5. Run the script:
   ```bash
   node scripts/download-speaker-images.js
   ```

### Finding Speaker Slugs
Speaker slugs are normalized names (lowercase, no country, hyphenated):
- "Michael REPKA (U.S.)" → `michael-repka`
- "Malvina EYDELMAN" → `malvina-eydelman`
- "Daniel TING" → `daniel-ting`

## Option 3: Manual File Placement

Download images manually and place them directly:

1. Create directory: `public/images/speakers/`
2. Save images with slug filenames:
   - `malvina-eydelman.jpg`
   - `daniel-ting.jpg`
   - etc.
3. Create `data/speaker-images.json`:
   ```json
   {
     "malvina-eydelman": "/images/speakers/malvina-eydelman.jpg",
     "daniel-ting": "/images/speakers/daniel-ting.jpg",
     "michael-repka": "/images/speakers/michael-repka.jpg"
   }
   ```

## How It Works

- If a speaker has an image in the mapping, it will be displayed
- If no image is found, initials are shown in a colored circle
- Images are automatically used in:
  - Speaker list
  - Speaker detail modal
  - Responsive to different screen sizes

## After Adding Images

Rebuild the site:
```bash
npm run build
npm run export
```

The images will be included in the static export.
