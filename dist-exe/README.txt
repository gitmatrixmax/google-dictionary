# Dictionary App - Windows Executable

## Quick Start

1. **Double-click `run-dictionary.bat`** to start the application
2. **Open your browser** and go to: http://localhost:4000
3. **Start searching for words!**

## Files Included

- `dictionary-app.exe` - The main application executable
- `run-dictionary.bat` - Easy startup script (recommended)
- `.env` - Configuration file with your API keys
- `client/dist/` - Frontend files (automatically served)

## API Keys Setup

The application works without API keys (using placeholder images), but for the best experience with real images, you can edit the `.env` file:

```
GOOGLE_API_KEY=your_google_api_key
GOOGLE_CX_ID=your_search_engine_id
RAPIDAPI_KEY=your_rapidapi_key
```

## Manual Start

If you prefer to run the executable directly:

```
dictionary-app.exe
```

Then open http://localhost:4000 in your browser.

## Troubleshooting

### Port Already in Use
If you get a "port already in use" error, either:
- Close any other application using port 4000
- Or modify the `.env` file to add: `PORT=3000` (or any other available port)

### Windows Security Warning
If Windows shows a security warning:
- Click "More info"
- Then click "Run anyway"
- This is normal for unsigned executables

### Firewall Warning
If Windows Firewall asks for permission:
- Click "Allow access" to let the app serve web pages

## Features

- ✅ **Offline Ready**: No internet required for basic functionality
- ✅ **Fast Startup**: Starts in seconds
- ✅ **Google-like Interface**: Clean, familiar design
- ✅ **Multiple Image Sources**: Google Images, Unsplash, Pixabay
- ✅ **Audio Pronunciation**: Click the speaker icon
- ✅ **Comprehensive Definitions**: Multiple meanings, examples, synonyms

## System Requirements

- Windows 10/11 (64-bit)
- No Node.js installation required
- Internet connection (for API calls)

---

**Version**: 1.0  
**Size**: ~50MB  
**License**: Free for personal use