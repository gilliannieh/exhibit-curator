import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import Navigation from './components/Navigation';
import MyExhibits from './pages/MyExhibits';

function Home() {
  const [allArtworks, setAllArtworks] = useState([]);
  const [displayedArtworks, setDisplayedArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
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
        const fallbackData = [
          { id: 1, title: "Title of Artwork", artist: "First Last", year: "XXXX", period: "Modern", tags: ["PERIOD", "POPULAR"], image_id: null },
          { id: 2, title: "Another Artwork", artist: "Artist Name", year: "YYYY", period: "Contemporary", tags: ["STYLE", "FEATURED"], image_id: null },
          { id: 3, title: "Third Piece", artist: "Famous Artist", year: "ZZZZ", period: "Classical", tags: ["HISTORIC", "RARE"], image_id: null }
        ];
        setAllArtworks(fallbackData);
        setAvailablePeriods(['Modern', 'Contemporary', 'Classical']);
      }
    }
  }, []);

  // Function to determine period based on date and style
  const determinePeriod = (dateStart, dateEnd, styleTitles) => {
    if (styleTitles && styleTitles.length > 0) {
      return styleTitles[0];
    }
    
    const year = dateStart || dateEnd;
    if (!year) return 'Unknown Period';
    
    if (year < 1400) return 'Medieval';
    if (year < 1600) return 'Renaissance';
    if (year < 1750) return 'Baroque';
    if (year < 1850) return 'Neoclassical';
    if (year < 1900) return 'Impressionist';
    if (year < 1945) return 'Modern';
    return 'Contemporary';
  };

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
      await fetchArtworks(1);
      setLoading(false);
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

  // Function to construct IIIF image URL
  const getImageUrl = (imageId) => {
    if (!imageId) return null;
    return `https://www.artic.edu/iiif/2/${imageId}/full/843,/0/default.jpg`;
  };

  if (loading) {
    return (
      <div className="App">
        <Navigation currentPage="home" />
        <main className="gallery">
          <div style={{ textAlign: 'center', padding: '2rem', gridColumn: '1 / -1' }}>
            Loading artworks...
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="App">
      <Navigation currentPage="home" />
      
      {/* Filter Controls */}
      <div className="filter-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by title, artist, or period..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="filter-select"
          >
            <option value="">All Periods</option>
            {availablePeriods.map((period, index) => (
              <option key={index} value={period}>{period}</option>
            ))}
          </select>
          
          {(searchTerm || selectedPeriod) && (
            <button onClick={clearFilters} className="clear-filters-btn">
              Clear Filters
            </button>
          )}
        </div>
      </div>
      
      {/* Results count */}
      <div className="results-info">
        Showing {displayedArtworks.length} artwork{displayedArtworks.length !== 1 ? 's' : ''}
      </div>

      <main className="gallery">
        {displayedArtworks.map((artwork) => (
          <div key={artwork.id} className="artwork-card">
            <div className="artwork-image">
              {artwork.image_id ? (
                <img 
                  src={getImageUrl(artwork.image_id)} 
                  alt={artwork.title}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="no-image">No Image Available</div>
              )}
              <button className="bookmark-btn">+</button>
            </div>
            <div className="artwork-info">
              <h3 className="artwork-title">{artwork.title}</h3>
              <p className="artwork-meta">{artwork.artist} • {artwork.year}</p>
              <div className="artwork-tags">
                {artwork.tags.map((tag, index) => (
                  <span key={index} className={`tag ${tag.toLowerCase().replace(/\s+/g, '-')}`}>
                    {tag.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </main>
      
      {/* Load More Button */}
      {hasMore && !searchTerm && !selectedPeriod && (
        <div className="load-more-container">
          <button 
            onClick={loadMore} 
            disabled={loadingMore}
            className="load-more-btn"
          >
            {loadingMore ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/my-exhibits" element={<MyExhibits />} />
      </Routes>
    </Router>
  );
}

export default App;
