import React, { useEffect, useState } from "react";
import api from "../api";
import "./RoomManagement.css";
import EditRoomModal from "./EditRoomModal";
import CreateRoom from "./CreateRoom";
import ConfirmationModal from "./ConfirmationModal";

function RoomManagement() {
  const [rooms, setRooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreate, setShowCreate] = useState(true);
  const [editRoom, setEditRoom] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const fetchRooms = async () => {
    try {
      const res = await api.get("/Room");
      setRooms(res.data);
    } catch {
      alert("Failed to load rooms.");
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleDeleteRoom = async (id) => {
    try {
      await api.delete(`/Room/${id}`);
      fetchRooms();
      setConfirmDeleteId(null);
    } catch {
      alert("Failed to delete room.");
    }
  };

  const filteredRooms = rooms.filter((r) =>
    r.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="room-management">
      <div className="mode-toggle">
        <button
          className={showCreate ? "active" : ""}
          onClick={() => setShowCreate(true)}
        >
          Create Room
        </button>
        <button
          className={!showCreate ? "active" : ""}
          onClick={() => setShowCreate(false)}
        >
          Manage Rooms
        </button>
      </div>

      {showCreate ? (
        <CreateRoom
          onRoomCreated={() => {
            fetchRooms();
            setShowCreate(false);
          }}
        />
      ) : (
        <>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by room name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <ul className="results-list">
            {filteredRooms.map((room) => (
              <li key={room.id}>
                <span>
                  {room.name} (Capacity: {room.capacity})
                </span>
                <div className="actions">
                  <button
                    className="edit-btn"
                    onClick={() => setEditRoom(room)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => setConfirmDeleteId(room.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {editRoom && (
        <EditRoomModal
          room={editRoom}
          onClose={() => setEditRoom(null)}
          onSave={() => {
            fetchRooms();
            setEditRoom(null);
          }}
        />
      )}

      {confirmDeleteId && (
        <ConfirmationModal
          message="Are you sure you want to delete this room?"
          onConfirm={() => handleDeleteRoom(confirmDeleteId)}
          onCancel={() => setConfirmDeleteId(null)}
        />
      )}
    </div>
  );
}

export default RoomManagement;
