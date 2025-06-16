import React from 'react';
import '../style/ConfirmModal.css';

const ErrorModal = ({ isOpen, title, message, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="confirm-modal-overlay">
      <div className="confirm-modal">
        <div className="confirm-modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="close-btn" onClick={onClose} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="confirm-modal-body">
          <div className="confirm-modal-icon">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="20" fill="#fff" />
              <circle cx="20" cy="20" r="16" fill="#E74C3C" />
              <text x="20" y="27" textAnchor="middle" fontSize="28" fontWeight="bold" fill="#fff">×</text>
            </svg>
          </div>
          <p className="modal-message">{message}</p>
        </div>
        <div className="modal-actions" style={{ justifyContent: 'center' }}>
          <button className="modal-btn confirm" onClick={onClose}>
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;