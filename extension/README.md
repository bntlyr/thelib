# TheLib Browser Extension

A browser extension that allows you to quickly add manga and content to your TheLib library from any website.

## Features

- 🔗 **One-click adding**: Add manga from any manga reading site
- 🎯 **Smart extraction**: Automatically detects manga title, chapter, author, and cover image
- 🌐 **Universal compatibility**: Works on popular manga sites like MangaDex, Mangakakalot, Webtoons, and more
- 🔄 **Seamless sync**: Instantly syncs with your TheLib app
- 🎨 **Clean interface**: Beautiful popup with form editing capabilities

## Supported Sites

- MangaDex
- Mangakakalot
- Manganato
- Webtoons
- MangaPlus (Shueisha)
- VIZ Media
- And many more (with generic extraction)

## Installation

### Development Installation

1. **Download the extension**:
   - Copy the entire `extension` folder from your TheLib project

2. **Load in Chrome**:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right)
   - Click "Load unpacked"
   - Select the `extension` folder

3. **Load in Firefox**:
   - Open Firefox and go to `about:debugging`
   - Click "This Firefox"
   - Click "Load Temporary Add-on"
   - Select the `manifest.json` file in the extension folder

4. **Load in Edge**:
   - Open Edge and go to `edge://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `extension` folder

## Setup

1. **Start your TheLib app**:
   ```bash
   npm run dev
   ```

2. **First time setup**:
   - Click the TheLib extension icon in your browser
   - Enter your TheLib server URL (default: `http://localhost:3000`)
   - Click "Open TheLib to Login"
   - Sign in to your TheLib account
   - Return to the extension popup

3. **You're ready!** The extension will now work on any manga site.

## Usage

### Method 1: Extension Icon
1. Visit any manga page
2. Click the TheLib extension icon
3. Review/edit the extracted information
4. Click "Add to Library"

### Method 2: Context Menu
1. Right-click anywhere on a manga page
2. Select "Add to TheLib"
3. The extension will extract data and show a floating button
4. Click the floating button to add

### Method 3: Floating Button
1. The extension automatically detects manga pages
2. A floating "Add to TheLib" button appears
3. Click it to add the manga

## Smart Data Extraction

The extension automatically extracts:

- **Title**: Manga/manhwa title
- **Current Chapter**: From URL or page content
- **Author**: Creator information
- **Description**: Story synopsis
- **Cover Image**: High-quality cover art
- **Genres**: Category tags
- **Status**: Ongoing, completed, etc.
- **Source**: Website name

## Privacy & Security

- ✅ Only sends data to your own TheLib instance
- ✅ No data collection or tracking
- ✅ Works entirely locally with your server
- ✅ Secure JWT token authentication

## Troubleshooting

### Extension not working?
1. Make sure your TheLib app is running
2. Check that you're logged in to TheLib
3. Verify the server URL in extension settings
4. Try refreshing the page and clicking the extension icon

### Data not extracting correctly?
1. Some sites may not be supported yet
2. You can manually edit the information in the popup
3. Report issues with specific sites for future updates

### Authentication issues?
1. Click the extension icon and re-authenticate
2. Make sure you're signed in to TheLib
3. Clear extension storage and set up again

## Development

### Adding new site support

1. Edit `content.js`
2. Add a new method to `siteHandlers`:
   ```javascript
   'newsite.com': this.extractNewSite.bind(this)
   ```
3. Implement the extraction method:
   ```javascript
   extractNewSite() {
     return {
       title: document.querySelector('.title')?.textContent?.trim(),
       // ... other fields
     };
   }
   ```

### Testing

1. Load the extension in developer mode
2. Visit test sites
3. Check console for errors
4. Test data extraction accuracy

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add new site extractors or improve existing ones
4. Test thoroughly
5. Submit a pull request

## License

Same license as TheLib project.
