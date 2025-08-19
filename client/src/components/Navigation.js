import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

function Navigation({ currentPage }) {
  return (
    <header className="header">
      <div className="nav-left">
        <a 
          href="https://www.artic.edu" 
          target="_blank" 
          rel="noopener noreferrer"
          className="nav-item"
        >
          ART INSTITUTE OF CHICAGO
        </a>
      </div>
      
      <div className="nav-center">
        <Link 
          to="/" 
          className={`nav-item title ${currentPage === 'home' ? 'active' : ''}`}
        >
          EXHIBIT CURATOR
        </Link>
      </div>
      
      <div className="nav-right">
        <Link 
          to="/my-exhibits" 
          className={`nav-item ${currentPage === 'my-exhibits' ? 'active' : ''}`}
        >
          MY EXHIBITS
        </Link>
      </div>
    </header>
  );
}

export default Navigation;
