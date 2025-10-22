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

## Deployment

This project is configured as a **single Express server** that serves both the API and the built frontend files. This makes deployment simpler and more cost-effective.

### Local Production Build

To test the production build locally:

```powershell
# Build the frontend
npm run build

# Start the server (serves both API and frontend)
npm start
```

The server will run on http://localhost:4000 and serve:
- Frontend: `http://localhost:4000` (React app)
- API: `http://localhost:4000/api/*` (Express endpoints)

### Deploy to Any Platform

Since this is a standard Express.js application, you can deploy it to any platform that supports Node.js:

#### **Option 1: Railway (Recommended - Free)**
1. Push your code to GitHub
2. Go to [Railway](https://railway.app) and sign up
3. Create new project from GitHub repo
4. Railway will automatically detect it's a Node.js app
5. Add environment variables in Railway dashboard
6. Deploy automatically happens on push to main

#### **Option 2: Render (Free)**
1. Push code to GitHub  
2. Go to [Render](https://render.com) and create account
3. Create new "Web Service" from GitHub repo
4. Set:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
5. Add environment variables in Render dashboard

#### **Option 3: Heroku**
1. Install Heroku CLI
2. ```bash
   heroku create your-dictionary-app
   heroku config:set GOOGLE_API_KEY=your_key
   heroku config:set GOOGLE_CX_ID=your_cx_id
   # Add other environment variables
   git push heroku main
   ```

#### **Option 4: Docker (Any Cloud Provider)**

The project includes a `Dockerfile` and `docker-compose.yml` for containerized deployment.

**Local Docker Build:**
```bash
# Build the image
docker build -t dictionary-app .

# Run with environment variables
docker run -p 4000:4000 \
  -e GOOGLE_API_KEY=your_key \
  -e GOOGLE_CX_ID=your_cx_id \
  dictionary-app
```

**Using Docker Compose (Recommended):**
```bash
# Create .env file with your API keys
cp .env.example .env

# Start the application
docker-compose up -d

# View logs
docker-compose logs -f
```

**Deploy to Cloud Platforms:**
- **Google Cloud Run**: `gcloud run deploy`
- **AWS ECS/Fargate**: Push to ECR and deploy
- **DigitalOcean App Platform**: Connect to container registry
- **Railway**: `railway up` (auto-detects Dockerfile)
- **Render**: Connect GitHub repo (auto-builds from Dockerfile)

#### **Option 5: DigitalOcean App Platform**
1. Push to GitHub
2. Create new app on DigitalOcean
3. Connect GitHub repo
4. Platform auto-detects Node.js
5. Add environment variables
6. Deploy

### Environment Variables for Production

Make sure to set these environment variables on your hosting platform:

```
# For Google Images (recommended)
GOOGLE_API_KEY=your_google_api_key
GOOGLE_CX_ID=your_search_engine_id

# Alternative image APIs
UNSPLASH_ACCESS_KEY=your_unsplash_key
PIXABAY_API_KEY=your_pixabay_key

# Optional dictionary fallback
RAPIDAPI_KEY=your_rapidapi_key

# Port (usually set automatically by hosting platform)
PORT=4000
```

**Note**: The app works without any API keys using placeholder images.

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