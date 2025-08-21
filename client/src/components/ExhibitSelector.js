import React, { useState, useRef, useEffect } from 'react';
import { useExhibit } from '../context/ExhibitContext';
import ExhibitModal from './ExhibitModal';
import './ExhibitSelector.css';

function ExhibitSelector({ artwork, onClose }) {
  const { exhibits, createExhibit, addArtworkToExhibit, isArtworkInExhibit } = useExhibit();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    document.addEventListener('mousedown', handleClickOutside);
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    
    // Auto-close after 2 seconds
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const handleAddToExhibit = (exhibitId, exhibitName) => {
    addArtworkToExhibit(exhibitId, artwork);
    showSuccessMessage(`Added "${artwork.title}" to "${exhibitName}"`);
  };

  const handleCreateExhibit = (exhibitData) => {
    const newExhibit = createExhibit(exhibitData.name, exhibitData.description);
    addArtworkToExhibit(newExhibit.id, artwork);
    setIsModalOpen(false);
    showSuccessMessage(`Created "${exhibitData.name}" and added "${artwork.title}"`);
  };

  return (
    <>
      <div className="exhibit-selector-overlay">
        <div className="exhibit-selector-modal" ref={modalRef}>
          <div className="exhibit-selector-header">
            <h3>Add to Exhibit</h3>
            <button 
              className="close-btn"
              onClick={onClose}
              aria-label="Close exhibit selector"
            >
              ×
            </button>
          </div>
          
          <div className="exhibit-list">
            {exhibits.length > 0 ? (
              exhibits.map(exhibit => {
                const isAdded = isArtworkInExhibit(exhibit.id, artwork.id);
                return (
                  <button
                    key={exhibit.id}
                    className={`exhibit-item ${isAdded ? 'added' : ''}`}
                    onClick={() => !isAdded && handleAddToExhibit(exhibit.id)}
                    disabled={isAdded}
                  >
                    <div className="exhibit-info">
                      <span className="exhibit-name">{exhibit.name}</span>
                      <span className="artwork-count">
                        {exhibit.artworks.length} artwork{exhibit.artworks.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    {isAdded ? (
                      <span className="added-indicator">✓ Added</span>
                    ) : (
                      <span className="add-indicator">+</span>
                    )}
                  </button>
                );
              })
            ) : (
              <div className="no-exhibits">
                <p>No exhibits yet</p>
              </div>
            )}
          </div>
          
          <div className="exhibit-selector-footer">
            <button 
              className="create-exhibit-btn"
              onClick={() => setIsModalOpen(true)}
            >
              + Create New Exhibit
            </button>
          </div>
        </div>
      </div>
      
      <ExhibitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreateExhibit}
        mode="create"
      />
    </>
  );
}

export default ExhibitSelector;
