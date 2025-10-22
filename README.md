# Dictionary App

A clean dictionary application that shows word definitions, pronunciations, and examples - similar to Google Chrome's search results when you look up a word.

## Features

- **Word Lookup**: Search for any English word
- **Definitions**: Multiple definitions with part of speech
- **Pronunciations**: Phonetic transcription and audio playback
- **Visual Examples**: Illustrative images that show the word's meaning
- **Examples**: Usage examples in sentences
- **Synonyms**: Related words and alternatives
- **Clean UI**: Google-inspired design

## Setup

### Prerequisites
- Node.js 18+ 
- npm

### Installation

1. **Clone and install dependencies:**
```powershell
cd f:\dictionary
npm install
cd client
npm install
```

2. **Create environment file (optional):**
Create `.env` in the project root for faster images:
```
# For fast, high-quality images (choose one)
UNSPLASH_ACCESS_KEY=your_unsplash_access_key
PIXABAY_API_KEY=your_pixabay_api_key

# Legacy (Google CSE is deprecated)
# GOOGLE_API_KEY=your_google_api_key
# GOOGLE_CX_ID=your_custom_search_engine_id

# Dictionary fallback API
RAPIDAPI_KEY=your_rapidapi_key_here
```

**🚀 Speed optimization**: For fastest image loading, choose one of these options:

**Option 1: Instant (No setup required)**
- Uses fast, colorful placeholder images
- Zero configuration needed

**Option 2: Google Images (Advanced)**
Google CSE is deprecated. Alternative: Use Unsplash for high-quality, fast images:
1. Go to [Unsplash Developers](https://unsplash.com/developers)
2. Create a free account and get an access key
3. Add to `.env`: `UNSPLASH_ACCESS_KEY=your_key`

**Option 3: Pixabay (Free)**
1. Go to [Pixabay API](https://pixabay.com/api/docs/)
2. Create free account, get API key
3. Add to `.env`: `PIXABAY_API_KEY=your_key` 

*Note: The app works without API keys - shows fast placeholder images.*

### Development

**Start both servers:**
```powershell
cd f:\dictionary
npm run dev
```

This runs:
- Backend server: http://localhost:4000
- Frontend dev server: http://localhost:5173

Open http://localhost:5173 in your browser.

### Production

**Build and start:**
```powershell
npm run build
npm start
```

## Deployment (Vercel)

This project is configured for easy deployment to [Vercel](https://vercel.com).

### Setup on Vercel

1.  **Create a Vercel Account**: Sign up for a free account at [vercel.com](https://vercel.com).
2.  **New Project**: Create a new project and connect it to your Git repository (GitHub, GitLab, etc.).
3.  **Configure Project**: Vercel will automatically detect the monorepo structure.
    *   **Framework Preset**: Select `Other`.
    *   **Build Command**: `npm run vercel-build`
    *   **Output Directory**: `client/dist`
    *   **Install Command**: `npm install`
4.  **Add Environment Variables**: In the project settings on Vercel, add the same environment variables from your local `.env` file (e.g., `GOOGLE_API_KEY`, `GOOGLE_CX_ID`, etc.). This is crucial for the dictionary and image search to work.
5.  **Deploy**: Click "Deploy". Vercel will build and deploy your application.

The `vercel.json` file in the root of the project handles the routing for the monorepo, ensuring that API requests are sent to the backend and all other requests are served by the React frontend.

## API Usage

The backend provides two main endpoints:

**POST /api/dictionary**
Fetches text-based dictionary data (definitions, phonetics, etc.).
```json
{
  "word": "example"
}
```

**POST /api/images**
Fetches illustrative images for a given word.
```json
{
  "word": "example"
}
```

**Response (`/api/dictionary`):**
```json
{
  "word": "example",
  "phonetic": "/ɪɡˈzɑːm.pəl/",
  "audioUrl": "https://api.dictionaryapi.dev/media/pronunciations/en/example-us.mp3",
  "meanings": [
    {
      "partOfSpeech": "noun",
      "definitions": [
        {
          "definition": "A thing characteristic of its kind or illustrating a general rule.",
          "example": "it's a good example of how European action can produce results",
          "synonyms": ["specimen", "sample", "exemplar"]
        }
      ]
    }
  ]
}
```

**Response (`/api/images`):**
```json
{
  "images": [
    {
      "id": "abc123",
      "url": "https://images.unsplash.com/photo-123...",
      "fullUrl": "https://images.unsplash.com/photo-123...",
      "alt": "example illustration",
      "photographer": "John Doe",
      "source": "Unsplash"
    }
  ]
}
```

## Data Sources

- **Primary**: [Free Dictionary API](https://dictionaryapi.dev/) - No API key required
- **Images**: [Unsplash API](https://unsplash.com/developers) (fast, high-quality) or [Pixabay API](https://pixabay.com/api/) (free alternative)
- **Definition Fallback**: [WordsAPI](https://www.wordsapi.com/) - Requires RapidAPI key (optional)
- **No API Keys**: Fast placeholder images (Google-colored)

## Technologies

- **Backend**: Node.js, Express, Axios, In-memory caching
- **Frontend**: React 18, Vite (fast dev server)  
- **APIs**: Free Dictionary API, Google Custom Search (images)
- **Styling**: CSS (Google-inspired design)
- **Performance**: Image caching, lazy loading, 3s timeouts

## 🚀 Speed & Image Quality

This app prioritizes speed. For the best experience, set up API keys for image searching.

### 📊 **Image API Performance**

| Method | Speed | Quality | Setup | Status |
|--------|-------|---------|-------|--------|
| **Google Images** | ⚡ Fastest | 🌟 Excellent | Free API key | ✅ **Recommended** |
| **Unsplash** | ⚡ Very Fast | 🌟 Excellent | Free API key | ✅ Fallback 1 |
| **Pixabay** | ⚡ Fast | ⭐ Good | Free API key | ✅ Fallback 2 |
| **Placeholders** | ⚡ Instant | ⭐ Basic | No setup | ✅ Default |

### 🛠️ **Setup for Google Images (Recommended)**

Google's Programmable Search Engine is the fastest way to get relevant images.

1. **Enable the API**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/apis/library/customsearch.googleapis.com)
   - Enable the "Custom Search API" for your project.
   - Get your API key from the [Credentials page](https://console.cloud.google.com/apis/credentials).

2. **Create a Search Engine**:
   - Go to the [Programmable Search Engine](https://programmablesearchengine.google.com/controlpanel/all) page.
   - Click "Add" to create a new search engine.
   - In the setup, choose to search the **entire web** and enable **Image search**.
   - Copy the **Search engine ID** from the control panel.

3. **Update `.env` file**:
   Create a `.env` file in the project root and add your keys:
   ```
   # For Google Images (fastest, most relevant)
   GOOGLE_API_KEY=your_google_api_key
   GOOGLE_CX_ID=your_search_engine_id
   ```

### ⚙️ **Alternative APIs**

If you prefer not to use Google, you can use Unsplash or Pixabay by adding their keys to the `.env` file. The app will automatically fall back if the primary API fails.

```
# Alternative high-quality images
UNSPLASH_ACCESS_KEY=your_unsplash_key
PIXABAY_API_KEY=your_pixabay_key
```

**Note**: The app works perfectly without any API keys, showing fast placeholder images.