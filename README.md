# CCOI Asia-Pacific Innovation Forum 2026

Conference PWA for CCOI Asia 2026 with Google Sheets integration.

## Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/claudiatsoi/ccoi-asia-2026.git
   cd ccoi-asia-2026
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Google Sheets API credentials**
   - Copy `.env.local.example` to `.env.local`
   - Fill in your Google Service Account credentials:
     ```
     GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project-id.iam.gserviceaccount.com
     GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
     ```
   - Share your Google Sheet with the service account email

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   npm run export
   ```

## Security Note

**Never commit** `google-credentials.json` or `.env.local` to the repository. These files contain sensitive credentials and are already in `.gitignore`.

## Features

- 📅 Dynamic agenda from Google Sheets
- 👥 Speaker profiles with photos
- 🎨 Modern glassmorphism design
- 📱 Progressive Web App (PWA)
- 🌐 Static site generation for GitHub Pages

## Data Update

To fetch latest data from Google Sheets:
```bash
node scripts/fetch-from-sheets.js
```

Powered by [EventX](https://eventx.io)
