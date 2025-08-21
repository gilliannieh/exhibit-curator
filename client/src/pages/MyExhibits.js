import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import ExhibitModal from '../components/ExhibitModal';
import { useExhibit } from '../context/ExhibitContext';
import { getImageUrl } from '../scripts/utils';
import './MyExhibits.css';

function MyExhibits() {
  const { exhibits, createExhibit, updateExhibit } = useExhibit();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExhibit, setEditingExhibit] = useState(null);

  const handleCreateExhibit = (exhibitData) => {
    createExhibit(exhibitData.name, exhibitData.description);
    setIsModalOpen(false);
  };

  const handleEditExhibit = (exhibitData) => {
    updateExhibit(editingExhibit.id, exhibitData);
    setEditingExhibit(null);
    setIsModalOpen(false);
  };

  const openEditModal = (exhibit) => {
    setEditingExhibit(exhibit);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingExhibit(null);
  };

  return (
    <div className="my-exhibits">
      <Navigation currentPage="my-exhibits" />
      
      <main className="exhibits-container" role="main">
        <header className="exhibits-header">
          <h1>My Exhibits</h1>
          
        </header>
        <button 
            className="create-exhibit-btn primary"
            onClick={() => setIsModalOpen(true)}
          >
            + Create New Exhibit
          </button>
        
        <section className="exhibits-content" aria-label="Exhibits content">
          {exhibits.length > 0 ? (
            <div className="exhibits-grid">
              {exhibits.map((exhibit) => (
                <article key={exhibit.id} className="exhibit-card">
                  <div className="exhibit-card-header">
                    <h2 className="exhibit-title">{exhibit.name}</h2>
                    <button 
                      className="edit-icon-btn"
                      onClick={() => openEditModal(exhibit)}
                      aria-label={`Edit ${exhibit.name}`}
                      title="Edit exhibit"
                    >
                      <span className="edit-icon">✏️</span>
                    </button>
                  </div>
                  
                  <div className="artwork-preview-area">
                    {exhibit.artworks && exhibit.artworks.length > 0 ? (
                      <div className="artworks-list">
                        {exhibit.artworks.map((artwork) => (
                          <div key={artwork.id} className="artwork-thumbnail">
                            {artwork.image_id ? (
                              <img 
                                src={getImageUrl(artwork.image_id)} 
                                alt={artwork.title}
                                className="artwork-image"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextElementSibling?.style && (e.target.nextElementSibling.style.display = 'flex');
                                }}
                              />
                            ) : (
                              <div className="no-image artwork-image" role="img" aria-label="No image available">
                                No Image Available
                              </div>
                            )}
                            <div className="artwork-info">
                              <h4 className="artwork-title">{artwork.title}</h4>
                              <p className="artwork-artist">{artwork.artist}</p>
                            </div>
                          </div>
                        ))}
                        <Link 
                          to="/"
                          className="add-artwork-btn"
                          aria-label={`Add artwork to ${exhibit.name}`}
                          title="Add artwork to this exhibit"
                        >
                          <div className="add-artwork-icon">+</div>
                        </Link>
                      </div>
                    ) : (
                      <Link 
                        to="/"
                        className="add-artwork-btn empty"
                        aria-label={`Add artwork to ${exhibit.name}`}
                        title="Add artwork to this exhibit"
                      >
                        <div className="add-artwork-icon">+</div>
                        <span className="add-artwork-text">Add Artwork</span>
                      </Link>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🎨</div>
              <h2>No exhibits yet</h2>
              <p>Start curating your first exhibit by creating a collection and adding artworks.</p>
            </div>
          )}
        </section>
      </main>
      
      <ExhibitModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={editingExhibit ? handleEditExhibit : handleCreateExhibit}
        exhibit={editingExhibit}
        mode={editingExhibit ? 'edit' : 'create'}
      />
    </div>
  );
}

export default MyExhibits;
