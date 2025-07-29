import React, { useState } from "react";
import api from "../api";
import "./CreateRoom.css";
import ConfirmationModal from "./ConfirmationModal";

function CreateRoom({ onRoomCreated }) {
  const [formData, setFormData] = useState({
    floor: "",
    roomNumber: "",
    capacity: "",
  });

  const [showConfirm, setShowConfirm] = useState(false);

  const createRoom = async () => {
    try {
      const floorLetter = String.fromCharCode(64 + parseInt(formData.floor));
      const name = `${floorLetter}${formData.roomNumber}`;

      await api.post("/Room", {
        name,
        floor: parseInt(formData.floor),
        roomNumber: parseInt(formData.roomNumber),
        capacity: parseInt(formData.capacity),
      });

      setFormData({ floor: "", roomNumber: "", capacity: "" });
      onRoomCreated();
    } catch {
      alert("Failed to create room.");
    } finally {
      setShowConfirm(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  return (
    <>
      <form className="create-room-form" onSubmit={handleSubmit}>
        <div className="create-room-field">
          <label>Floor</label>
          <input
            type="number"
            value={formData.floor}
            onChange={(e) =>
              setFormData({ ...formData, floor: e.target.value })
            }
            required
          />
        </div>
        <div className="create-room-field">
          <label>Room Number</label>
          <input
            type="number"
            value={formData.roomNumber}
            onChange={(e) =>
              setFormData({ ...formData, roomNumber: e.target.value })
            }
            required
          />
        </div>
        <div className="create-room-field">
          <label>Capacity</label>
          <input
            type="number"
            value={formData.capacity}
            onChange={(e) =>
              setFormData({ ...formData, capacity: e.target.value })
            }
            required
          />
        </div>
        <button type="submit" className="create-room-primary-btn">
          Create Room
        </button>
      </form>

      {showConfirm && (
        <ConfirmationModal
          message="Are you sure you want to create this room?"
          onConfirm={createRoom}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}

export default CreateRoom;
