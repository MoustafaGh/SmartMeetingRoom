import React, { useState } from "react";
import "./RoomManagement.css";

function RoomManagement() {
  const [mode, setMode] = useState("create");

  return (
    <div className="room-management">
      <div className="mode-toggle">
        <button
          className={mode === "create" ? "active" : ""}
          onClick={() => setMode("create")}
        >
          Create Room
        </button>
        <button
          className={mode === "edit" ? "active" : ""}
          onClick={() => setMode("edit")}
        >
          Edit Room
        </button>
      </div>

      {mode === "create" ? (
        <form className="room-form">
          <div className="field">
            <label>Floor</label>
            <input type="text" placeholder="Enter floor" />
          </div>
          <div className="field">
            <label>Room Number</label>
            <input type="text" placeholder="Enter room number" />
          </div>
          <button type="button" className="primary-btn">
            Create Room
          </button>
        </form>
      ) : (
        <div className="edit-section">
          <div className="search-bar">
            <input type="text" placeholder="Search by room number" />
            <button className="search-btn">Search</button>
          </div>
          <ul className="results-list">
            <li>
              <span>Room 101 (Floor 1)</span>
              <div className="actions">
                <button className="edit-btn">Edit</button>
                <button className="delete-btn">Delete</button>
              </div>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default RoomManagement;
