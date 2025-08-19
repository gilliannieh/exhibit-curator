import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import MyExhibits from './pages/MyExhibits';

function Home() {
  // Sample artwork data
  const artworks = [
    { id: 1, title: "Title of Artwork", artist: "First Last", year: "XXXX", tags: ["PERIOD", "POPULAR"] },
    { id: 2, title: "Title of Artwork", artist: "First Last", year: "XXXX", tags: ["PERIOD", "POPULAR"] },
    { id: 3, title: "Title of Artwork", artist: "First Last", year: "XXXX", tags: ["PERIOD", "POPULAR"] },
    { id: 4, title: "Title of Artwork", artist: "First Last", year: "XXXX", tags: ["PERIOD", "POPULAR"] },
    { id: 5, title: "Title of Artwork", artist: "First Last", year: "XXXX", tags: ["PERIOD", "POPULAR"] },
    { id: 6, title: "Title of Artwork", artist: "First Last", year: "XXXX", tags: ["PERIOD", "POPULAR"] },
    { id: 7, title: "Title of Artwork", artist: "First Last", year: "XXXX", tags: ["PERIOD", "POPULAR"] },
    { id: 8, title: "Title of Artwork", artist: "First Last", year: "XXXX", tags: ["PERIOD", "POPULAR"] },
    { id: 9, title: "Title of Artwork", artist: "First Last", year: "XXXX", tags: ["PERIOD", "POPULAR"] },
    { id: 10, title: "Title of Artwork", artist: "First Last", year: "XXXX", tags: ["PERIOD", "POPULAR"] },
    { id: 11, title: "Title of Artwork", artist: "First Last", year: "XXXX", tags: ["PERIOD", "POPULAR"] },
    { id: 12, title: "Title of Artwork", artist: "First Last", year: "XXXX", tags: ["PERIOD", "POPULAR"] },
    { id: 13, title: "Title of Artwork", artist: "First Last", year: "XXXX", tags: ["PERIOD", "POPULAR"] },
    { id: 14, title: "Title of Artwork", artist: "First Last", year: "XXXX", tags: ["PERIOD", "POPULAR"] },
    { id: 15, title: "Title of Artwork", artist: "First Last", year: "XXXX", tags: ["PERIOD", "POPULAR"] }
  ];

  return (
    <div className="App">
      <Navigation currentPage="home" />
      
      <main className="gallery">
        {artworks.map((artwork) => (
          <div key={artwork.id} className="artwork-card">
            <div className="artwork-image">
              <button className="bookmark-btn">+</button>
            </div>
            <div className="artwork-info">
              <h3 className="artwork-title">{artwork.title}</h3>
              <p className="artwork-meta">{artwork.artist} • {artwork.year}</p>
              <div className="artwork-tags">
                {artwork.tags.map((tag, index) => (
                  <span key={index} className={`tag ${tag.toLowerCase()}`}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </main>
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
