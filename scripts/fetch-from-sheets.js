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

// Sheet ranges - adjust these to match your Google Sheet structure
const RANGES = {
  myopiaDay: 'MyopiaDay!A2:G100',    // Adjust sheet name and range
  innovationDay: 'InnovationDay !A2:G100' // Adjust sheet name and range (note the space)
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

    // Parse the data
    const myopiaSessions = parseSheetData(myopiaResponse.data.values, 'Myopia Day', 'Feb 3, 2026');
    const innovationSessions = parseSheetData(innovationResponse.data.values, 'Innovation Day', 'Feb 4, 2026');

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
    console.log('✅ Successfully updated agenda.json from Google Sheets!');
    console.log(`   Myopia Day: ${myopiaSessions.length} sessions`);
    console.log(`   Innovation Day: ${innovationSessions.length} sessions`);

  } catch (error) {
    console.error('❌ Error fetching from Google Sheets:', error.message);
    process.exit(1);
  }
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

  // Regular speakers format - split by both & and /
  return {
    speakers: speakerText
      .split(/[&\/]/)
      .map(s => s.trim())
      .filter(Boolean),
    moderators: [],
    panelists: []
  };
}

/**
 * Parse sheet data into session objects
 * Expected columns: Time | Theme | Title | Location | Speakers | Description | Block
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

      return {
        time: row[0] || lastTime, // Use current time or last seen time
        theme: row[1] || lastTheme, // Use current theme or last seen theme
        title: row[2] || '',
        location: row[3] || 'TBD',
        speakers: speakerData.speakers,
        moderators: speakerData.moderators,
        panelists: speakerData.panelists,
        description: row[5] || '',
        block: row[6] || ''
      };
    });
}

// Run the script
fetchSheetData();
