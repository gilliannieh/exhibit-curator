import React from 'react';
import { Link } from 'react-router-dom';
import './MyExhibits.css';

function MyExhibits() {
  return (
    <div className="my-exhibits">
      <header className="header">
        <a 
          href="https://www.artic.edu" 
          target="_blank" 
          rel="noopener noreferrer"
          className="nav-item"
        >
          ART INSTITUTE OF CHICAGO
        </a>
        <Link to="/" className="nav-item title">EXHIBIT CURATOR</Link>
        <div className="nav-item active">MY EXHIBITS</div>
      </header>
      
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
