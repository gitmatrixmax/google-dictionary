require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Simple in-memory cache for images (for speed)
const imageCache = new Map();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

// Simple health
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Dictionary lookup endpoint - returns definitions, pronunciations, examples (TEXT ONLY)
app.post('/api/dictionary', async (req, res) => {
  try {
    const { word } = req.body;
    if (!word) return res.status(400).json({ error: 'Missing word in body' });
    
    const dictionaryResult = await lookupWord(word);
    return res.json(dictionaryResult);
  } catch (err) {
    console.error('Dictionary lookup error:', err.message);
    return res.status(500).json({ error: 'Dictionary lookup failed', details: err.message });
  }
});

// Image lookup endpoint - returns images for a word
app.post('/api/images', async (req, res) => {
  try {
    const { word } = req.body;
    if (!word) return res.status(400).json({ error: 'Missing word in body' });
    
    const images = await getWordImages(word);
    return res.json({ images });
  } catch (err) {
    console.error('Image lookup error:', err.message);
    return res.status(500).json({ error: 'Image lookup failed', details: err.message });
  }
});

// Dictionary lookup function using Free Dictionary API
async function lookupWord(word) {
  try {
    // Try Free Dictionary API first (no key required)
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`;
    const response = await axios.get(url);
    
    if (response.data && response.data.length > 0) {
      const entry = response.data[0];
      
      // Format response like Google Chrome search
      return {
        word: entry.word,
        phonetic: entry.phonetic || entry.phonetics?.[0]?.text || '',
        audioUrl: entry.phonetics?.find(p => p.audio)?.audio || '',
        meanings: entry.meanings?.map(meaning => ({
          partOfSpeech: meaning.partOfSpeech,
          definitions: meaning.definitions?.slice(0, 3).map(def => ({
            definition: def.definition,
            example: def.example || '',
            synonyms: def.synonyms?.slice(0, 5) || []
          })) || []
        })) || [],
        sourceUrls: entry.sourceUrls || []
      };
    }
    
    // Fallback - return empty result
    return {
      word,
      phonetic: '',
      audioUrl: '',
      meanings: [],
      sourceUrls: [],
      error: 'No definition found'
    };
    
  } catch (err) {
    // If API fails, try WordsAPI as fallback (requires RapidAPI key)
    const rapidApiKey = process.env.RAPIDAPI_KEY;
    if (rapidApiKey) {
      try {
        const wordsApiUrl = `https://wordsapiv1.p.rapidapi.com/words/${encodeURIComponent(word)}`;
        const wordsResponse = await axios.get(wordsApiUrl, {
          headers: {
            'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com',
            'X-RapidAPI-Key': rapidApiKey
          }
        });
        
        if (wordsResponse.data) {
          const data = wordsResponse.data;
          return {
            word: data.word,
            phonetic: data.pronunciation?.all || '',
            audioUrl: '',
            meanings: data.results?.slice(0, 3).map(result => ({
              partOfSpeech: result.partOfSpeech || 'unknown',
              definitions: [{
                definition: result.definition,
                example: result.examples?.[0] || '',
                synonyms: result.synonyms?.slice(0, 5) || []
              }]
            })) || [],
            sourceUrls: []
          };
        }
      } catch (wordsErr) {
        console.log('WordsAPI also failed:', wordsErr.message);
      }
    }
    
    throw new Error(`Dictionary lookup failed: ${err.message}`);
  }
}

// Get illustrative images for a word - prioritize Google Images for speed and relevance
async function getWordImages(word) {
  // Check cache first for speed
  const cacheKey = word.toLowerCase();
  const cached = imageCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  try {
    // 1. Try Google Images first (fastest, most relevant)
    const googleApiKey = process.env.GOOGLE_API_KEY;
    const googleCxId = process.env.GOOGLE_CX_ID;
    if (googleApiKey && googleCxId) {
      const images = await getGoogleImages(word, googleApiKey, googleCxId);
      if (images.length > 0) {
        imageCache.set(cacheKey, { data: images, timestamp: Date.now() });
        return images;
      }
    }

    // 2. Fallback to Unsplash (high quality)
    const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;
    if (unsplashKey) {
      const images = await getUnsplashImages(word, unsplashKey);
      if (images.length > 0) {
        imageCache.set(cacheKey, { data: images, timestamp: Date.now() });
        return images;
      }
    }

    // 3. Fallback to Pixabay (reliable)
    const pixabayKey = process.env.PIXABAY_API_KEY;
    if (pixabayKey) {
      const images = await getPixabayImages(word);
      if (images.length > 0) {
        imageCache.set(cacheKey, { data: images, timestamp: Date.now() });
        return images;
      }
    }

    // 4. Fast placeholders as final fallback
    const placeholders = generatePlaceholderImages(word);
    imageCache.set(cacheKey, { data: placeholders, timestamp: Date.now() });
    return placeholders;
    
  } catch (err) {
    console.log('Image search failed:', err.message);
    
    // Fast fallback to placeholders
    const placeholders = generatePlaceholderImages(word);
    imageCache.set(cacheKey, { data: placeholders, timestamp: Date.now() });
    return placeholders;
  }
}

// Google Programmable Search Engine API - fastest and most relevant
async function getGoogleImages(word, apiKey, cxId) {
  try {
    const searchUrl = 'https://www.googleapis.com/customsearch/v1';
    const response = await axios.get(searchUrl, {
      params: {
        key: apiKey,
        cx: cxId,
        q: word,
        searchType: 'image',
        num: 3, // Fetch only 3 images
        safe: 'active',
        imgSize: 'medium',
        imgType: 'photo'
      },
      timeout: 3000 // 3 second timeout for speed
    });
    
    if (response.data?.items) {
      return response.data.items.map((item, index) => ({
        id: `google_${index}`,
        url: item.link,
        fullUrl: item.link,
        alt: item.title || word,
        photographer: item.image?.contextLink ? new URL(item.image.contextLink).hostname : 'Google',
        source: 'Google',
        thumbnail: item.image?.thumbnailLink || item.link
      }));
    }
    return [];
  } catch (err) {
    console.log('Google Images search failed:', err.message);
    return []; // Return empty on failure to allow fallback
  }
}

// Unsplash API - fast and high quality
async function getUnsplashImages(word, accessKey) {
  try {
    const unsplashUrl = 'https://api.unsplash.com/search/photos';
    const response = await axios.get(unsplashUrl, {
      params: {
        query: word,
        per_page: 3, // Fetch only 3 images
        orientation: 'landscape',
        content_filter: 'high'
      },
      headers: {
        'Authorization': `Client-ID ${accessKey}`
      },
      timeout: 3000 // 3 second timeout for speed
    });
    
    if (response.data?.results) {
      return response.data.results.map(photo => ({
        id: photo.id,
        url: photo.urls.small,
        fullUrl: photo.urls.regular,
        alt: photo.alt_description || word,
        photographer: photo.user.name,
        source: 'Unsplash',
        thumbnail: photo.urls.thumb
      }));
    }
    
    return [];
  } catch (err) {
    console.log('Unsplash search failed:', err.message);
    return [];
  }
}

// Generate fast placeholder images
function generatePlaceholderImages(word) {
  const colors = ['4285f4', '34a853', 'ea4335', 'fbbc04', '9aa0a6', '5f6368'];
  return Array.from({ length: 3 }, (_, i) => ({
    id: `placeholder_${i}`,
    url: `https://via.placeholder.com/300x200/${colors[i % colors.length]}/ffffff?text=${encodeURIComponent(word)}`,
    fullUrl: `https://via.placeholder.com/600x400/${colors[i % colors.length]}/ffffff?text=${encodeURIComponent(word)}`,
    alt: word,
    photographer: 'Placeholder',
    source: 'Placeholder',
    thumbnail: `https://via.placeholder.com/150x100/${colors[i % colors.length]}/ffffff?text=${encodeURIComponent(word)}`
  }));
}

// Fallback image search using Pixabay API (free)
async function getPixabayImages(word) {
  try {
    const pixabayKey = process.env.PIXABAY_API_KEY;
    
    if (!pixabayKey) {
      return generatePlaceholderImages(word);
    }
    
    const pixabayUrl = 'https://pixabay.com/api/';
    const response = await axios.get(pixabayUrl, {
      params: {
        key: pixabayKey,
        q: word,
        image_type: 'photo',
        per_page: 3, // Fetch only 3 images
        safesearch: 'true',
        min_width: 300
      },
      timeout: 5000
    });
    
    if (response.data?.hits) {
      return response.data.hits.map(hit => ({
        id: hit.id.toString(),
        url: hit.webformatURL,
        fullUrl: hit.largeImageURL,
        alt: hit.tags || word,
        photographer: hit.user,
        source: 'Pixabay',
        thumbnail: hit.previewURL
      }));
    }
    
    return generatePlaceholderImages(word);
  } catch (err) {
    console.log('Pixabay image search failed:', err.message);
    return generatePlaceholderImages(word);
  }
}

// Serve client in production
const staticPath = process.env.STATIC_PATH 
  ? path.join(process.env.STATIC_PATH, 'client', 'dist')
  : path.join(__dirname, '..', 'client', 'dist');

app.use(express.static(staticPath));
app.get('*', (req, res) => {
  const indexPath = process.env.STATIC_PATH
    ? path.join(process.env.STATIC_PATH, 'client', 'dist', 'index.html')
    : path.join(__dirname, '..', 'client', 'dist', 'index.html');
  res.sendFile(indexPath);
});

module.exports = app;
