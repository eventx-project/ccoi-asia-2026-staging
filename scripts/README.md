# Google Sheets Integration Setup

## Prerequisites
- Google Cloud project with Sheets API enabled
- Service account JSON credentials file
- Google Sheet shared with service account email

## Setup Steps

### 1. Add your credentials file
Place your service account JSON file in the root directory as:
```
google-credentials.json
```

### 2. Configure the script
Edit `scripts/fetch-from-sheets.js`:
- Replace `YOUR_SHEET_ID_HERE` with your Google Sheet ID
- Adjust sheet names and ranges to match your structure

### 3. Google Sheet Format
Your sheet should have these columns (in order):
```
Time | Theme | Title | Location | Speakers | Description | Block
```

Example row:
```
8:00-8:05 | Opening | Welcome Remarks | Grand Ballroom | John Doe, Jane Smith | Opening session | Session 1
```

**Speaker column format:** Separate multiple speakers with commas

### 4. Run the script
```bash
node scripts/fetch-from-sheets.js
```

This will:
- Fetch data from your Google Sheets
- Parse and format the data
- Update `data/agenda.json`
- Show summary of sessions fetched

### 5. Build and deploy
```bash
npm run build
```

Then deploy the updated `out/` folder to GitHub Pages.

## Automation
You can automate this by:
1. Running the script before each build
2. Setting up a GitHub Action to fetch data periodically
3. Creating a webhook to trigger updates when sheet changes

## Troubleshooting

**"Error: google-credentials.json not found"**
- Make sure you've downloaded the service account JSON and placed it in the root

**"Error: The caller does not have permission"**
- Make sure you've shared the Google Sheet with your service account email
- Give it at least "Viewer" access

**"No data found"**
- Check that your sheet names match the configuration
- Verify the range includes your data
- Make sure first row has headers (data starts from row 2)
