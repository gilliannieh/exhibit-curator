import React, { useState, useEffect } from 'react';
import './ExhibitModal.css';

function ExhibitModal({ isOpen, onClose, onSave, exhibit = null, mode = 'create' }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (exhibit && mode === 'edit') {
      setName(exhibit.name);
      setDescription(exhibit.description || '');
    } else {
      setName('');
      setDescription('');
    }
    setErrors({});
  }, [exhibit, mode, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!name.trim()) {
      newErrors.name = 'Exhibit name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Exhibit name must be at least 2 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const exhibitData = {
      name: name.trim(),
      description: description.trim()
    };

    onSave(exhibitData);
    handleClose();
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setErrors({});
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose} onKeyDown={handleKeyDown}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{mode === 'create' ? 'Create New Exhibit' : 'Edit Exhibit'}</h2>
          <button 
            className="modal-close-btn"
            onClick={handleClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="exhibit-form">
          <div className="form-group">
            <label htmlFor="exhibit-name">
              Exhibit Name *
            </label>
            <input
              id="exhibit-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={errors.name ? 'error' : ''}
              placeholder="Enter exhibit name..."
              maxLength={100}
              autoFocus
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="exhibit-description">
              Description
            </label>
            <textarea
              id="exhibit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter exhibit description (optional)..."
              rows={4}
              maxLength={500}
            />
            <div className="char-count">
              {description.length}/500 characters
            </div>
          </div>
          
          <div className="modal-actions">
            <button 
              type="button" 
              className="btn-secondary"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary"
            >
              {mode === 'create' ? 'Create Exhibit' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ExhibitModal;
