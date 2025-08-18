import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [artworks, setArtworks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadArtworks() {
      try {
        const response = await fetch(
          'https://api.artic.edu/api/v1/artworks?fields=id,title,artist_title&limit=5'
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const json = await response.json();
        setArtworks(json.data);
      } catch (err) {
        setError(err.message);
      }
    }

    loadArtworks();
  }, []);

  return (
    <div className="App">
      <h1>Art Institute of Chicago</h1>
      {error && <p role="alert">Error: {error}</p>}
      <ul>
        {artworks.map((art) => (
          <li key={art.id}>
            {art.title}
            {art.artist_title ? ` by ${art.artist_title}` : ''}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
