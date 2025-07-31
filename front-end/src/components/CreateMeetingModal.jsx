import React, { useState, useEffect } from "react";
import api from "../api";
import "./CreateMeetingModal.css";

function CreateMeetingModal({ onClose, onCreate }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    roomName: "",
  });

  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRoomsAndUsers = async () => {
      try {
        const [roomRes, userRes] = await Promise.all([
          api.get("/Room"),
          api.get("/User")
        ]);
        setRooms(roomRes.data);
        setUsers(userRes.data);
      } catch {
        setError("Failed to load rooms or users");
      } finally {
        setLoadingRooms(false);
      }
    };
    fetchRoomsAndUsers();
  }, []);

  const handleCreate = async () => {
  const { title, description, startTime, endTime, roomName } = formData;

  if (!title || !startTime || !endTime || !roomName) {
    setError("Title, Start Time, End Time, and Room are required");
    return;
  }

  try {
    // Combine date part of startTime with just time from endTime
    const startDate = new Date(startTime);
    const endDate = new Date(`${startTime.split("T")[0]}T${endTime}`);

    if (endDate <= startDate) {
      setError("End time must be after start time");
      return;
    }

    // Format as ISO string **without** converting to UTC
    const formattedStart = `${startTime}:00`; // e.g. "2025-07-29T14:30:00"
    const formattedEnd = `${startTime.split("T")[0]}T${endTime}:00`; // e.g. "2025-07-29T15:30:00"

    const res = await api.post("/ScheduledMeeting", {
      title,
      description,
      startTime: formattedStart,
      endTime: formattedEnd,
      roomName,
      userId: parseInt(localStorage.getItem("userId")),
    });

    const meetingId = res.data.id;

    await Promise.all(
      selectedUsers.map(user =>
        api.post("/MeetingAttendee", {
          scheduledMeetingId: meetingId,
          userId: user.id
        })
      )
    );

    onCreate();
  } catch (err) {
    console.error("Error creating meeting:", err);
    if (err.response?.data?.error) {
      setError(err.response.data.error);
    } else if (err.response?.data) {
      setError(JSON.stringify(err.response.data));
    } else {
      setError("Failed to create meeting");
    }
  }
};



  const filteredSuggestions =
    search.trim() === ""
      ? []
      : users.filter(u =>
          (u.firstName + " " + u.lastName)
            .toLowerCase()
            .includes(search.toLowerCase()) &&
          !selectedUsers.find(s => s.id === u.id)
        ).slice(0, 5);

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
              value={formData.roomName}
              onChange={(e) => setFormData({ ...formData, roomName: e.target.value })}
            >
              <option value="">Select a Room</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.name}>
                  {room.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label>Invite Users</label>
          <input
            type="text"
            placeholder="Start typing a name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {filteredSuggestions.length > 0 && (
            <div className="user-suggestion-list">
              {filteredSuggestions.map(user => (
                <div
                  key={user.id}
                  className="user-suggestion-item"
                  onClick={() => setSelectedUsers([...selectedUsers, user])}
                >
                  {user.firstName} {user.lastName} — {user.role}
                </div>
              ))}
            </div>
          )}
          {selectedUsers.length > 0 && (
            <div className="selected-users">
              {selectedUsers.map(u => (
                <span key={u.id} className="selected-user">
                  {u.firstName} {u.lastName}
                  <button onClick={() => setSelectedUsers(selectedUsers.filter(s => s.id !== u.id))}>✕</button>
                </span>
              ))}
            </div>
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
