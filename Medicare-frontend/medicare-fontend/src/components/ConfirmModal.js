import React from 'react';
import '../style/ConfirmModal.css';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, iconType }) => {
  if (!isOpen) return null;

  return (
    <div className="confirm-modal-overlay">
      <div className="confirm-modal">
        <div className="confirm-modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="close-btn" onClick={onCancel} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="confirm-modal-body">
          {iconType === 'warning' && (
            <div className="confirm-modal-icon">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="20" fill="#fff3cd" />
                <path d="M20 10L34 34H6L20 10Z" fill="#f39c12" />
                <text x="20" y="30" textAnchor="middle" fontSize="22" fontWeight="bold" fill="#fff">!</text>
              </svg>
            </div>
          )}
          <p className="modal-message">{message}</p>
        </div>
        <div className="modal-actions">
          <button className="modal-btn confirm" onClick={onConfirm}>
            Xác nhận
          </button>
          <button className="modal-btn cancel" onClick={onCancel}>
            Hủy bỏ
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
