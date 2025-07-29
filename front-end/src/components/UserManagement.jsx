import React, { useEffect, useState } from "react";
import api from "../api";
import "./UserManagement.css";
import EditUserModal from "./EditUserModal";
import CreateUser from "./CreateUser";
import ConfirmationModal from "./ConfirmationModal";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreate, setShowCreate] = useState(true);
  const [editUser, setEditUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/User");
      setUsers(res.data);
    } catch {
      alert("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      await api.delete(`/User/${userToDelete}`);
      fetchUsers();
    } catch {
      alert("Failed to delete user.");
    } finally {
      setShowConfirm(false);
      setUserToDelete(null);
    }
  };

  const filteredUsers = users.filter((u) =>
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="user-management">
      <div className="mode-toggle">
        <button className={showCreate ? "active" : ""} onClick={() => setShowCreate(true)}>
          Create User
        </button>
        <button className={!showCreate ? "active" : ""} onClick={() => setShowCreate(false)}>
          Manage Users
        </button>
      </div>

      {showCreate ? (
        <CreateUser
          onUserCreated={() => {
            fetchUsers();
            setShowCreate(false);
          }}
        />
      ) : (
        <>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by name or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {loading ? (
            <p>Loading users...</p>
          ) : filteredUsers.length === 0 ? (
            <p>No users found.</p>
          ) : (
            <ul className="results-list">
              {filteredUsers.map((user) => (
                <li key={user.id}>
                  <span>
                    {user.firstName} {user.lastName} ({user.email})
                  </span>
                  <div className="actions">
                    <button className="edit-btn" onClick={() => setEditUser(user)}>
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => {
                        setUserToDelete(user.id);
                        setShowConfirm(true);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {editUser && (
        <EditUserModal
          user={editUser}
          onClose={() => setEditUser(null)}
          onSave={() => {
            fetchUsers();
            setEditUser(null);
          }}
        />
      )}

      {showConfirm && (
        <ConfirmationModal
          message="Are you sure you want to delete this user?"
          onConfirm={handleDeleteUser}
          onCancel={() => {
            setShowConfirm(false);
            setUserToDelete(null);
          }}
        />
      )}
    </div>
  );
}

export default UserManagement;
