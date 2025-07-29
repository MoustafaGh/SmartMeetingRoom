import React from "react";
import "./ConfirmationModal.css";

function ConfirmationModal({ message, onConfirm, onCancel }) {
  return (
    <div className="confirmation-overlay">
      <div className="confirmation-box">
        <p>{message}</p>
        <div className="confirmation-actions">
          <button className="confirm-btn" onClick={onConfirm}>
            Confirm
          </button>
          <button className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;
