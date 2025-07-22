import React, { useState } from "react";
import "./EMS.css";
import UserManagement from "./UserManagement";
import RoomManagement from "./RoomManagement";

function EMS() {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div className="ems-container">
      <h2>Employee Management System</h2>
      <div className="ems-tabs">
        <button
          className={activeTab === "users" ? "active" : ""}
          onClick={() => setActiveTab("users")}
        >
          Users
        </button>
        <button
          className={activeTab === "rooms" ? "active" : ""}
          onClick={() => setActiveTab("rooms")}
        >
          Rooms
        </button>
      </div>

      <div className="ems-content">
        {activeTab === "users" ? <UserManagement /> : <RoomManagement />}
      </div>
    </div>
  );
}

export default EMS;
