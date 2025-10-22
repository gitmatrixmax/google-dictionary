import React, { useState, useRef } from 'react'
import axios from 'axios'

export default function App() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState(null)
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [imagesLoading, setImagesLoading] = useState(false)
  const audioRef = useRef(null)

  async function searchWord(e) {
    e && e.preventDefault()
    const word = query.trim()
    if (!word) return
    
    setLoading(true)
    setResult(null)
    setImages([])
    setImagesLoading(true)

    try {
      // Fetch definitions first
      const res = await axios.post('/api/dictionary', { word })
      setResult(res.data)
      
      // Then fetch images in the background
      axios.post('/api/images', { word })
        .then(imgRes => setImages(imgRes.data.images))
        .catch(err => console.error('Image fetch error:', err))
        .finally(() => setImagesLoading(false));

    } catch (err) {
      setResult({ error: err?.response?.data?.error || err.message })
      setImagesLoading(false)
    } finally {
      setLoading(false)
    }
  }

  function playPronunciation() {
    if (result?.audioUrl && audioRef.current) {
      audioRef.current.src = result.audioUrl
      audioRef.current.play().catch(e => console.log('Audio play failed:', e))
    }
  }

  return (
    <div className="container">
      {/* Search header */}
      <div className="search-header">
        <h1>Dictionary</h1>
        <form onSubmit={searchWord} className="search-form">
          <div className="search-box">
            <input 
              value={query} 
              onChange={e => setQuery(e.target.value)} 
              placeholder="Search for a word..."
              autoFocus
            />
            <button type="submit" disabled={loading}>
              {loading ? '⏳' : '🔍'}
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      <div className="results">
        {result && result.error && (
          <div className="error">
            <p>❌ {result.error}</p>
          </div>
        )}

        {result && !result.error && (
          <div className="word-card">
            {/* Word header */}
            <div className="word-header">
              <h2>{result.word}</h2>
              {result.phonetic && (
                <div className="phonetic">
                  <span>{result.phonetic}</span>
                  {result.audioUrl && (
                    <button className="audio-btn" onClick={playPronunciation}>
                      🔊
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Meanings */}
            {result.meanings?.map((meaning, idx) => (
              <div key={idx} className="meaning">
                <div className="part-of-speech">{meaning.partOfSpeech}</div>
                {meaning.definitions?.map((def, defIdx) => (
                  <div key={defIdx} className="definition">
                    <div className="def-text">
                      <span className="def-number">{defIdx + 1}.</span>
                      {def.definition}
                    </div>
                    {def.example && (
                      <div className="example">
                        <em>"{def.example}"</em>
                      </div>
                    )}
                    {def.synonyms?.length > 0 && (
                      <div className="synonyms">
                        <strong>Similar:</strong> {def.synonyms.join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}

            {result.meanings?.length === 0 && (
              <p className="no-results">No definitions found for "{result.word}"</p>
            )}

            {/* Images section - moved to the bottom */}
            {imagesLoading && (
              <div className="images-section">
                <h3>Visual Examples</h3>
                <div className="image-loader">Loading images...</div>
              </div>
            )}
            {images && images.length > 0 && (
              <div className="images-section">
                <h3>Visual Examples</h3>
                <div className="images-grid">
                  {images.slice(0, 3).map((image) => (
                    <div key={image.id} className="image-item">
                      <img 
                        src={image.thumbnail || image.url} 
                        alt={image.alt}
                        loading="lazy"
                        onError={(e) => {
                          // Fallback to main URL if thumbnail fails
                          if (e.target.src !== image.url) {
                            e.target.src = image.url;
                          }
                        }}
                        onClick={() => window.open(image.fullUrl, '_blank')}
                      />
                      <div className="image-credit">
                        by {image.photographer} ({image.source})
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!result && (
          <div className="welcome">
            <p>Enter a word above to see its definition, pronunciation, and examples.</p>
          </div>
        )}
      </div>

      <audio ref={audioRef} preload="none" />
    </div>
  )
}