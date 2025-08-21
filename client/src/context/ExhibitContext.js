import React, { createContext, useContext, useState, useEffect } from 'react';

const ExhibitContext = createContext();

export const useExhibit = () => {
  const context = useContext(ExhibitContext);
  if (!context) {
    throw new Error('useExhibit must be used within an ExhibitProvider');
  }
  return context;
};

export const ExhibitProvider = ({ children }) => {
  const [exhibits, setExhibits] = useState([]);
  const [currentExhibit, setCurrentExhibit] = useState(null);

  // Load exhibits from localStorage on component mount
  useEffect(() => {
    const savedExhibits = localStorage.getItem('exhibitCurator-exhibits');
    if (savedExhibits) {
      try {
        setExhibits(JSON.parse(savedExhibits));
      } catch (error) {
        console.error('Error loading exhibits from localStorage:', error);
      }
    }
  }, []);

  // Save exhibits to localStorage whenever exhibits change
  useEffect(() => {
    localStorage.setItem('exhibitCurator-exhibits', JSON.stringify(exhibits));
  }, [exhibits]);

  const createExhibit = (name, description = '') => {
    const newExhibit = {
      id: Date.now().toString(),
      name,
      description,
      artworks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setExhibits(prev => [...prev, newExhibit]);
    return newExhibit;
  };

  const updateExhibit = (exhibitId, updates) => {
    setExhibits(prev => prev.map(exhibit => 
      exhibit.id === exhibitId 
        ? { ...exhibit, ...updates, updatedAt: new Date().toISOString() }
        : exhibit
    ));
  };

  const deleteExhibit = (exhibitId) => {
    setExhibits(prev => prev.filter(exhibit => exhibit.id !== exhibitId));
    if (currentExhibit?.id === exhibitId) {
      setCurrentExhibit(null);
    }
  };

  const addArtworkToExhibit = (exhibitId, artwork) => {
    setExhibits(prev => prev.map(exhibit => {
      if (exhibit.id === exhibitId) {
        // Check if artwork is already in the exhibit
        const isAlreadyAdded = exhibit.artworks.some(art => art.id === artwork.id);
        if (isAlreadyAdded) {
          return exhibit;
        }
        
        return {
          ...exhibit,
          artworks: [...exhibit.artworks, artwork],
          updatedAt: new Date().toISOString()
        };
      }
      return exhibit;
    }));
  };

  const removeArtworkFromExhibit = (exhibitId, artworkId) => {
    setExhibits(prev => prev.map(exhibit => 
      exhibit.id === exhibitId 
        ? { 
            ...exhibit, 
            artworks: exhibit.artworks.filter(art => art.id !== artworkId),
            updatedAt: new Date().toISOString()
          }
        : exhibit
    ));
  };

  const getExhibitById = (exhibitId) => {
    return exhibits.find(exhibit => exhibit.id === exhibitId);
  };

  const isArtworkInExhibit = (exhibitId, artworkId) => {
    const exhibit = getExhibitById(exhibitId);
    return exhibit?.artworks.some(art => art.id === artworkId) || false;
  };

  const value = {
    exhibits,
    currentExhibit,
    setCurrentExhibit,
    createExhibit,
    updateExhibit,
    deleteExhibit,
    addArtworkToExhibit,
    removeArtworkFromExhibit,
    getExhibitById,
    isArtworkInExhibit
  };

  return (
    <ExhibitContext.Provider value={value}>
      {children}
    </ExhibitContext.Provider>
  );
};

export default ExhibitContext;
