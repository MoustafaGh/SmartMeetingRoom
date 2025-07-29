import React, { useState, useEffect } from "react";
import api from "../api";
import "./CreateMeetingModal.css";

function CreateMeetingModal({ onClose, onCreate }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "", // only time
    roomId: "",
  });

  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await api.get("/Room");
        setRooms(res.data);
      } catch {
        setError("Failed to load rooms");
      } finally {
        setLoadingRooms(false);
      }
    };
    fetchRooms();
  }, []);

  const handleCreate = async () => {
    if (!formData.title || !formData.startTime || !formData.endTime || !formData.roomId) {
      setError("Title, Start Time, End Time, and Room are required");
      return;
    }

    try {
      const start = new Date(formData.startTime);
      const [endHour, endMinute] = formData.endTime.split(":");
      const end = new Date(start);
      end.setHours(endHour, endMinute);

      if (end <= start) {
        setError("End time must be after start time");
        return;
      }

      await api.post("/ScheduledMeeting", {
        title: formData.title,
        description: formData.description,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        roomId: parseInt(formData.roomId),
        userId: parseInt(localStorage.getItem("userId")),
      });

      onCreate();
    } catch {
      setError("Failed to create meeting");
    }
  };

  return (
    <div className="create-meeting-overlay">
      <div className="create-meeting-modal">
        {error && <div className="error-box">{error}</div>}

        <div>
          <label>Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        <div>
          <label>Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div>
          <label>Start Date & Time</label>
          <input
            type="datetime-local"
            value={formData.startTime}
            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
          />
        </div>

        <div>
          <label>End Time</label>
          <input
            type="time"
            value={formData.endTime}
            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
          />
        </div>

        <div>
          <label>Room</label>
          {loadingRooms ? (
            <p>Loading rooms...</p>
          ) : (
            <select
              value={formData.roomId}
              onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
            >
              <option value="">Select a Room</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="modal-actions">
          <button onClick={handleCreate}>Create Meeting</button>
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateMeetingModal;
