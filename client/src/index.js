import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/dm-sans';
import '@fontsource/ibm-plex-mono';
import './index.css';
import App from './App';
import reportWebVitals from './scripts/reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
