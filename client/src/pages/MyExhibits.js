import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import './MyExhibits.css';

function MyExhibits() {
  return (
    <div className="my-exhibits">
      <Navigation currentPage="my-exhibits" />
      
      <main className="exhibits-container">
        <div className="exhibits-header">
          <h1>My Exhibits</h1>
          <p>Your curated collections and saved artworks</p>
        </div>
        
        <div className="exhibits-content">
          <div className="empty-state">
            <div className="empty-icon">🎨</div>
            <h2>No exhibits yet</h2>
            <p>Start curating your first exhibit by browsing and bookmarking artworks.</p>
            <Link to="/" className="cta-button">Browse Artworks</Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default MyExhibits;
