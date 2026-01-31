const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

/**
 * Fetch data from Google Sheets and update agenda.json
 * 
 * Setup:
 * 1. Place your service account JSON file in the root as 'google-credentials.json'
 * 2. Set your SHEET_ID below
 * 3. Run: node scripts/fetch-from-sheets.js
 */

// Configuration
const SHEET_ID = '1aXeCCiZ8OFqPq26e4dt5ikpkvtuw_sjX02SsdxB0hwE'; // Replace with your Google Sheet ID
const CREDENTIALS_PATH = path.join(__dirname, '../google-credentials.json');
const OUTPUT_PATH = path.join(__dirname, '../data/agenda.json');
const ABOUT_OUTPUT_PATH = path.join(__dirname, '../data/about.json');

// Sheet ranges - adjust these to match your Google Sheet structure
const RANGES = {
  myopiaDay: 'MyopiaDay!A2:H200',    // Adjust sheet name and range
  innovationDay: 'InnovationDay !A2:H200', // Adjust sheet name and range (note the space)
  about: 'About!A2:B100'             // Card | Content
};

async function fetchSheetData() {
  try {
    // Load credentials
    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
    
    // Authorize with service account
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // First, get the sheet metadata to see available tabs
    console.log('Fetching sheet metadata...');
    const metadata = await sheets.spreadsheets.get({
      spreadsheetId: SHEET_ID,
    });

    console.log('Available tabs:');
    metadata.data.sheets.forEach(sheet => {
      console.log(`  - "${sheet.properties.title}"`);
    });

    // Fetch data from both sheets
    const myopiaResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: RANGES.myopiaDay,
    });

    const innovationResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: RANGES.innovationDay,
    });

    const aboutResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: RANGES.about,
    });

    // Parse the data
    let myopiaSessions = parseSheetData(myopiaResponse.data.values, 'Myopia Day', 'Feb 3, 2026');
    let innovationSessions = parseSheetData(innovationResponse.data.values, 'Innovation Day', 'Feb 4, 2026');
    const aboutData = parseAboutData(aboutResponse.data.values);

    // Apply manual patches to fix data consistency issues
    const patchSession = (session) => {
      // Helper to fix names in a list
      const fixNames = (list) => {
        if (!list) return [];
        return list.map(name => {
          if (name.includes('Chris LEUNG') && name.includes('Hong Kong')) {
            return name.replace('Chris LEUNG', 'Christopher LEUNG');
          }
          if (name.includes('Ashvin AGARWAL') && name.includes('India')) {
            return name.replace('Ashvin AGARWAL', 'Ashwin AGARWAL');
          }
          if (name.includes('Olivia WOO') && name.includes('Australia')) {
            return name.replace('Olivia WOO', 'Oliver WOO');
          }
          return name;
        });
      };

      session.speakers = fixNames(session.speakers);
      session.moderators = fixNames(session.moderators);
      session.panelists = fixNames(session.panelists);
      session.chairs = fixNames(session.chairs);
      return session;
    };

    myopiaSessions = myopiaSessions.map(patchSession);
    innovationSessions = innovationSessions.map(patchSession);

    // Remove incorrect sessions
    innovationSessions = innovationSessions.filter(session => {
      const isBadAnandSession = 
        session.theme.includes('Session 3: AI') && 
        session.speakers.some(s => s.includes('Anand SIVARAMAN'));
      
      if (isBadAnandSession) {
        console.log('   Removed incorrect Anand Sivaraman session from Session 3');
        return false;
      }
      return true;
    });

    // Create agenda structure
    const agendaData = {
      myopia_day: {
        title: 'Myopia Day',
        date: 'Feb 3, 2026',
        sessions: myopiaSessions
      },
      innovation_day: {
        title: 'Innovation Day',
        date: 'Feb 4, 2026',
        sessions: innovationSessions
      }
    };

    // Write to file
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(agendaData, null, 2));
    fs.writeFileSync(ABOUT_OUTPUT_PATH, JSON.stringify(aboutData, null, 2));
    console.log('✅ Successfully updated agenda.json from Google Sheets!');
    console.log('✅ Successfully updated about.json from Google Sheets!');
    console.log(`   Myopia Day: ${myopiaSessions.length} sessions`);
    console.log(`   Innovation Day: ${innovationSessions.length} sessions`);
    console.log(`   About Page: ${aboutData.length} cards`);

  } catch (error) {
    console.error('❌ Error fetching from Google Sheets:', error.message);
    process.exit(1);
  }
}

/**
 * Parse About sheet data
 * Columns: Card | Content
 */
function parseAboutData(rows) {
  if (!rows || rows.length === 0) return [];
  
  const cards = [];
  let currentCard = null;
  
  rows.forEach(row => {
    // row[0] is Card (e.g. "1"), row[1] is Content
    const cardIdRaw = row[0] ? row[0].toString().trim() : null;
    const content = row[1] ? row[1].trim() : '';
    
    // Skip empty lines
    if (!content && !cardIdRaw) return;
    
    // If we have a new card ID (and it's different from the current one's ID), simple logic:
    // This assumes rows are grouped by card ID somewhat, or we just merge into existing if found.
    
    // If cardId is present, we look up or create
    if (cardIdRaw) {
      let existing = cards.find(c => c.id === cardIdRaw);
      if (!existing) {
        existing = { id: cardIdRaw, title: '', content: [] };
        cards.push(existing);
      }
      currentCard = existing;
    }
    
    // If we have a current card (either from this row or carried over), add content
    if (currentCard && content) {
      // Optional: Check if content looks like a title? 
      // For now, treat all as paragraphs.
      // If the user meant "First row is title", we'd need more logic. 
      // But the request says "provide a new pargraph for each cell".
      currentCard.content.push(content);
    }
  });
  
  return cards;
}

/**
 * Parse speakers field, handling special formats for Panel Discussions
 */
function parseSpeakers(speakerText) {
  if (!speakerText) return { speakers: [], moderators: [], panelists: [] };

  // Check if it's a Panel Discussion format with Moderators and Panelists
  if (speakerText.includes('Moderators:') || speakerText.includes('Panelists:')) {
    const moderators = [];
    const panelists = [];

    // Extract moderators
    const moderatorMatch = speakerText.match(/Moderators?:\s*([^\n]+?)(?=\n|Panelists?:|$)/i);
    if (moderatorMatch) {
      const modText = moderatorMatch[1].trim();
      moderators.push(...modText.split(/[&,]/).map(s => s.trim()).filter(Boolean));
    }

    // Extract panelists
    const panelistMatch = speakerText.match(/Panelists?:\s*([^\n]+?)$/i);
    if (panelistMatch) {
      const panText = panelistMatch[1].trim();
      // Split by comma, but filter out general phrases
      panelists.push(...panText.split(',')
        .map(s => s.trim())
        .filter(s => s && !s.match(/all\s+(chairs?|speakers?)/i))
      );
    }

    return { speakers: [], moderators, panelists };
  }

  // Regular speakers format - split by &, /, and comma
  return {
    speakers: speakerText
      .split(/[&\/,]/)
      .map(s => s.trim())
      .filter(Boolean),
    moderators: [],
    panelists: []
  };
}

/**
 * Parse sheet data into session objects
 * Expected columns: Time | Theme | Title | Location | Speakers | Description | Block | Chairs
 */
function parseSheetData(rows, dayTitle, date) {
  if (!rows || rows.length === 0) {
    console.log(`No data found for ${dayTitle}`);
    return [];
  }

  let lastTime = '';
  let lastTheme = '';

  return rows
    .filter(row => row[2]) // Must have title
    .map(row => {
      // If row has a time, update lastTime
      if (row[0]) {
        lastTime = row[0];
      }
      // If row has a theme, update lastTheme
      if (row[1]) {
        lastTheme = row[1];
      }

      const speakerData = parseSpeakers(row[4]);
      
      // Parse chairs - split by comma or &
      const chairs = row[7] 
        ? row[7].split(/[&,]/).map(s => s.trim()).filter(Boolean)
        : [];

      return {
        time: row[0] || lastTime, // Use current time or last seen time
        theme: row[1] || lastTheme, // Use current theme or last seen theme
        title: row[2] || '',
        location: row[3] || 'TBD',
        speakers: speakerData.speakers,
        moderators: speakerData.moderators,
        panelists: speakerData.panelists,
        chairs: chairs,
        description: row[5] || '',
        block: row[6] || ''
      };
    });
}

// Run the script
fetchSheetData();
