import React, { useState } from "react";
import api from "../api";
import "./EditRoomModal.css";
import ConfirmationModal from "./ConfirmationModal";

function EditRoomModal({ room, onClose, onSave }) {
  const [formData, setFormData] = useState({
    floor: room.floor || "",
    roomNumber: room.roomNumber || "",
    capacity: room.capacity || "",
  });

  const [showConfirm, setShowConfirm] = useState(false);

  const saveChanges = async () => {
    try {
      const floorLetter = String.fromCharCode(64 + parseInt(formData.floor));
      const name = `${floorLetter}${formData.roomNumber}`;

      await api.put(`/Room/${room.id}`, {
        name,
        floor: parseInt(formData.floor),
        roomNumber: parseInt(formData.roomNumber),
        capacity: parseInt(formData.capacity),
      });

      onSave();
    } catch {
      alert("Failed to update room.");
    } finally {
      setShowConfirm(false);
    }
  };

  return (
    <>
      <div className="edit-room-modal-overlay">
        <div className="edit-room-modal-content">
          <h3>Edit Room</h3>
          <div className="edit-room-field">
            <label>Floor</label>
            <input
              type="number"
              value={formData.floor}
              onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
            />
          </div>
          <div className="edit-room-field">
            <label>Room Number</label>
            <input
              type="number"
              value={formData.roomNumber}
              onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
            />
          </div>
          <div className="edit-room-field">
            <label>Capacity</label>
            <input
              type="number"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
            />
          </div>
          <div className="edit-room-modal-actions">
            <button className="edit-room-save-btn" onClick={() => setShowConfirm(true)}>
              Save
            </button>
            <button className="edit-room-cancel-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>

      {showConfirm && (
        <ConfirmationModal
          message="Are you sure you want to save these changes?"
          onConfirm={saveChanges}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}

export default EditRoomModal;
