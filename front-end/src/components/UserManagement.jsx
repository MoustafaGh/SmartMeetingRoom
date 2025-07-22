import React, { useState } from "react";
import "./UserManagement.css";

function UserManagement() {
  const rolesList = ["Admin", "Programmer", "Designer", "IT"];
  const [mode, setMode] = useState("create");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    roles: [],
  });

  const handleRoleChange = (role) => {
    setFormData((prev) => {
      const roles = prev.roles.includes(role)
        ? prev.roles.filter((r) => r !== role)
        : [...prev.roles, role];
      return { ...prev, roles };
    });
  };

  return (
    <div className="user-management">
      <div className="mode-toggle">
        <button
          className={mode === "create" ? "active" : ""}
          onClick={() => setMode("create")}
        >
          Create User
        </button>
        <button
          className={mode === "edit" ? "active" : ""}
          onClick={() => setMode("edit")}
        >
          Edit User
        </button>
      </div>

      {mode === "create" ? (
        <form className="user-form">
          <div className="field-row">
            <div className="field-half">
              <label>First Name</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
              />
            </div>
            <div className="field-half">
              <label>Last Name</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
              />
            </div>
          </div>
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div className="field">
            <label>Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>
          <div className="field roles">
            {rolesList.map((role) => (
              <label key={role}>
                <input
                  type="checkbox"
                  checked={formData.roles.includes(role)}
                  onChange={() => handleRoleChange(role)}
                />
                {role}
              </label>
            ))}
          </div>
          <button type="button" className="primary-btn">
            Create User
          </button>
        </form>
      ) : (
        <div className="edit-section">
          <div className="search-bar">
            <input type="text" placeholder="Search by username" />
            <button className="search-btn">Search</button>
          </div>
          <ul className="results-list">
            <li>
              <span>Example (Example@example.com)</span>
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

export default UserManagement;
