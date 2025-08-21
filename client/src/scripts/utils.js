/**
 * Utility functions for the Exhibit Curator app
 */

/**
 * Function to determine period based on date and style
 * @param {number} dateStart - Start date of the artwork
 * @param {number} dateEnd - End date of the artwork  
 * @param {Array} styleTitles - Array of style titles from the API
 * @returns {string} The determined period
 */
export const determinePeriod = (dateStart, dateEnd, styleTitles) => {
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

/**
 * Function to construct IIIF image URL from Art Institute of Chicago
 * @param {string} imageId - The image ID from the API
 * @returns {string|null} The constructed image URL or null if no imageId
 */
export const getImageUrl = (imageId) => {
  if (!imageId) return null;
  return `https://www.artic.edu/iiif/2/${imageId}/full/843,/0/default.jpg`;
};

/**
 * Async delay utility function
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise} Promise that resolves after the delay
 */
export const delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Fallback artwork data when API is unavailable
 */
export const fallbackArtworkData = [
  { 
    id: 1, 
    title: "Title of Artwork", 
    artist: "First Last", 
    year: "XXXX", 
    period: "Modern", 
    tags: ["PERIOD", "POPULAR"], 
    image_id: null 
  },
  { 
    id: 2, 
    title: "Another Artwork", 
    artist: "Artist Name", 
    year: "YYYY", 
    period: "Contemporary", 
    tags: ["STYLE", "FEATURED"], 
    image_id: null 
  },
  { 
    id: 3, 
    title: "Third Piece", 
    artist: "Famous Artist", 
    year: "ZZZZ", 
    period: "Classical", 
    tags: ["HISTORIC", "RARE"], 
    image_id: null 
  }
];

/**
 * Default periods for fallback data
 */
export const fallbackPeriods = ['Modern', 'Contemporary', 'Classical'];
