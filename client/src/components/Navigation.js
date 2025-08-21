import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

function Navigation({ currentPage }) {
  return (
    <nav className="header" role="navigation" aria-label="Main navigation">
      <div className="nav-left">
        <a 
          href="https://www.artic.edu" 
          target="_blank" 
          rel="noopener noreferrer"
          className="nav-item external-link"
          aria-label="Visit Art Institute of Chicago website (opens in new tab)"
        >
          ART INSTITUTE OF CHICAGO
        </a>
      </div>
      
      <div className="nav-center">
        <Link 
          to="/" 
          className={`nav-item title ${currentPage === 'home' ? 'active' : ''}`}
          aria-current={currentPage === 'home' ? 'page' : undefined}
          aria-label="Exhibit Curator - Home page"
        >
          EXHIBIT CURATOR
        </Link>
      </div>
      
      <div className="nav-right">
        <Link 
          to="/my-exhibits" 
          className={`nav-item ${currentPage === 'my-exhibits' ? 'active' : ''}`}
          aria-current={currentPage === 'my-exhibits' ? 'page' : undefined}
          aria-label="My Exhibits page"
        >
          MY EXHIBITS
        </Link>
      </div>
    </nav>
  );
}

export default Navigation;
