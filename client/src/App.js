import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import Navigation from './components/Navigation';
import LoadingScreen from './components/LoadingScreen';
import ExhibitSelector from './components/ExhibitSelector';
import MyExhibits from './pages/MyExhibits';
import { ExhibitProvider } from './context/ExhibitContext';
import { determinePeriod, getImageUrl, delay, fallbackArtworkData, fallbackPeriods } from './scripts/utils';

function Home() {
  const [allArtworks, setAllArtworks] = useState([]);
  const [displayedArtworks, setDisplayedArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [availablePeriods, setAvailablePeriods] = useState([]);

  // Function to fetch artworks from API
  const fetchArtworks = useCallback(async (pageNum = 1, searchQuery = '', append = false) => {
    try {
      let url = `https://api.artic.edu/api/v1/artworks/search?query[term][is_public_domain]=true&limit=12&from=${(pageNum - 1) * 12}&fields=id,title,artist_display,date_display,image_id,style_titles,classification_titles,date_start,date_end`;
      
      // Add search query if provided
      if (searchQuery) {
        url += `&q=${encodeURIComponent(searchQuery)}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch artworks');
      }
      
      const data = await response.json();
      
      // Process the data
      const processedArtworks = data.data
        .filter(artwork => artwork.image_id) // Only include artworks with images
        .map(artwork => ({
          id: artwork.id,
          title: artwork.title || 'Untitled',
          artist: artwork.artist_display ? artwork.artist_display.split('\n')[0] : 'Unknown Artist',
          year: artwork.date_display || 'Unknown Date',
          period: determinePeriod(artwork.date_start, artwork.date_end, artwork.style_titles),
          image_id: artwork.image_id,
          tags: [
            ...(artwork.style_titles ? artwork.style_titles.slice(0, 1) : []),
            ...(artwork.classification_titles ? artwork.classification_titles.slice(0, 1) : [])
          ].filter(Boolean).slice(0, 2)
        }));

      if (append) {
        setAllArtworks(prev => [...prev, ...processedArtworks]);
      } else {
        setAllArtworks(processedArtworks);
        // Extract unique periods for filters
        const periods = [...new Set(processedArtworks.map(a => a.period))].filter(Boolean).sort();
        setAvailablePeriods(periods);
      }
      
      setHasMore(processedArtworks.length === 12);
      
    } catch (err) {
      console.error('API Error:', err);
      if (!append) {
        // Fallback to sample data only on initial load
        setAllArtworks(fallbackArtworkData);
        setAvailablePeriods(fallbackPeriods);
      }
    }
  }, []);

  // Filter artworks based on search and filters
  useEffect(() => {
    let filtered = allArtworks;

    if (searchTerm) {
      filtered = filtered.filter(artwork =>
        artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artwork.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artwork.period.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedPeriod) {
      filtered = filtered.filter(artwork => artwork.period === selectedPeriod);
    }

    setDisplayedArtworks(filtered);
  }, [allArtworks, searchTerm, selectedPeriod]);

  // Initial load
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      
      // Record start time for minimum loading duration
      const startTime = Date.now();
      const minimumLoadingTime = 4000; // 4 seconds
      
      try {
        // Fetch the artworks
        await fetchArtworks(1);
        
        // Calculate how much time has passed
        const elapsedTime = Date.now() - startTime;
        const remainingTime = minimumLoadingTime - elapsedTime;
        
        // If we need to wait longer to reach minimum time, do so
        if (remainingTime > 0) {
          await delay(remainingTime);
        }
        
      } catch (error) {
        console.error('Error loading artworks:', error);
        // Even on error, wait the minimum time for consistent UX
        const elapsedTime = Date.now() - startTime;
        const remainingTime = minimumLoadingTime - elapsedTime;
        if (remainingTime > 0) {
          await delay(remainingTime);
        }
      } finally {
        setLoading(false);
      }
    };
    
    loadInitialData();
  }, [fetchArtworks]);

  // Load more function
  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    const nextPage = page + 1;
    await fetchArtworks(nextPage, searchTerm, true);
    setPage(nextPage);
    setLoadingMore(false);
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedPeriod('');
  };

  return (
    <div className="App">
      <Navigation currentPage="home" />
      
      {/* Filter Controls */}
      <section className="filter-controls" aria-label="Search and filter artworks">
        <div className="search-bar">
          <label htmlFor="artwork-search" className="visually-hidden">
            Search artworks by title, artist, or period
          </label>
          <input
            id="artwork-search"
            type="text"
            placeholder="Search by title, artist, or period..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            aria-describedby="search-help"
          />
          <div id="search-help" className="visually-hidden">
            Enter keywords to search through artwork titles, artists, and time periods
          </div>
          
          <label htmlFor="period-filter" className="visually-hidden">
            Filter by time period
          </label>
          <select
            id="period-filter"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="filter-select"
            aria-describedby="period-help"
          >
            <option value="">All Periods</option>
            {availablePeriods.map((period, index) => (
              <option key={index} value={period}>{period}</option>
            ))}
          </select>
          <div id="period-help" className="visually-hidden">
            Choose a specific time period to filter artworks
          </div>
          
          {(searchTerm || selectedPeriod) && (
            <button 
              onClick={clearFilters} 
              className="clear-filters-btn"
              aria-label="Clear all search filters and show all artworks"
            >
              Clear Filters
            </button>
          )}
        </div>
      </section>
      
      {loading ? (
        <LoadingScreen />
      ) : (
        <>
          {/* Results count */}
          <div className="results-info" role="status" aria-live="polite">
            Showing {displayedArtworks.length} artwork{displayedArtworks.length !== 1 ? 's' : ''}
          </div>

          <main className="gallery" role="main" aria-label="Artwork gallery">
        {displayedArtworks.map((artwork) => (
          <article key={artwork.id} className="artwork-card">
            <div className="artwork-image">
              {artwork.image_id ? (
                <img 
                  src={getImageUrl(artwork.image_id)} 
                  alt={`${artwork.title} by ${artwork.artist}, ${artwork.year}`}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
              ) : (
                <div className="no-image" role="img" aria-label="No image available">
                  No Image Available
                </div>
              )}
              <div className="bookmark-container">
                <button 
                  className="bookmark-btn"
                  onClick={() => setSelectedArtwork(selectedArtwork?.id === artwork.id ? null : artwork)}
                  aria-label={`Add ${artwork.title} to my exhibits`}
                  title="Add to My Exhibits"
                >
                  +
                </button>
              </div>
            </div>
            <div className="artwork-info">
              <h3 className="artwork-title">{artwork.title}</h3>
              <p className="artwork-meta">{artwork.artist} • {artwork.year}</p>
              <div className="artwork-tags" aria-label="Artwork categories">
                {artwork.tags.map((tag, index) => (
                  <span key={index} className={`tag ${tag.toLowerCase().replace(/\s+/g, '-')}`}>
                    {tag.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </main>
      
      {/* Render ExhibitSelector as a modal overlay at the top level */}
      {selectedArtwork && (
        <ExhibitSelector 
          artwork={selectedArtwork}
          onClose={() => setSelectedArtwork(null)}
        />
      )}
      
      {/* Load More Button */}
      {hasMore && !searchTerm && !selectedPeriod && (
        <div className="load-more-container">
          <button 
            onClick={loadMore} 
            disabled={loadingMore}
            className="load-more-btn"
            aria-label={loadingMore ? 'Loading more artworks' : 'Load more artworks'}
            aria-describedby="load-more-help"
          >
            {loadingMore ? 'Loading...' : 'Load More'}
          </button>
          <div id="load-more-help" className="visually-hidden">
            Click to load 12 additional artworks from the Art Institute of Chicago collection
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
}

function App() {
  return (
    <ExhibitProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/my-exhibits" element={<MyExhibits />} />
        </Routes>
      </Router>
    </ExhibitProvider>
  );
}

export default App;
