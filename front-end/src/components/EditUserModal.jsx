import React, { useState } from "react";
import api from "../api";
import "./EditUserModal.css";
import ConfirmationModal from "./ConfirmationModal";

function EditUserModal({ user, onClose, onSave }) {
  const [formData, setFormData] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
    password: "",
    confirmPassword: "",
    role: user.role || "",
    isActive: user.isActive,
  });

  const [showConfirm, setShowConfirm] = useState(false);
  const [showPasswordConditions, setShowPasswordConditions] = useState(false);
  const [backendError, setBackendError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordsMatch =
    formData.password === formData.confirmPassword || formData.confirmPassword === "";

  const saveChanges = async () => {
    if (formData.password && !passwordsMatch) {
      setShowConfirm(false);
      return;
    }

    try {
      const roleFormatted =
        formData.role.charAt(0).toUpperCase() + formData.role.slice(1).toLowerCase();

      await api.put(`/User/${user.id}`, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password || undefined,
        role: roleFormatted,
        isActive: formData.isActive,
      });

      setBackendError("");
      setShowConfirm(false);
      onSave();
      onClose();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setBackendError(err.response.data.error);
      } else {
        setBackendError("Failed to update user.");
      }
      setShowConfirm(false);
    }
  };

  return (
    <>
      <div className="edit-user-modal-overlay">
        <div className="edit-user-modal-content">
          <h3>Edit User</h3>
          {backendError && <div className="backend-error-box">{backendError}</div>}

          <div className="edit-user-form">
            <div className="edit-user-field-row">
              <div className="edit-user-field-half">
                <label>First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>
              <div className="edit-user-field-half">
                <label>Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
            </div>

            <div className="edit-user-field">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="edit-user-field password-container">
              <label>Password</label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Leave blank to keep current"
                value={formData.password}
                onFocus={() => setShowPasswordConditions(true)}
                onBlur={() => setShowPasswordConditions(false)}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <i className="bi bi-eye-slash"></i>
                ) : (
                  <i className="bi bi-eye-fill"></i>
                )}
              </span>
            </div>

            {showPasswordConditions && (
              <div className="password-conditions-box">
                <p>Password must contain:</p>
                <ul>
                  <li>At least 8 characters</li>
                  <li>One uppercase letter</li>
                  <li>One lowercase letter</li>
                  <li>One number</li>
                  <li>One special character (!@#$%)</li>
                </ul>
              </div>
            )}

            <div className="edit-user-field password-container">
              <label>Confirm Password</label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                style={{ borderColor: passwordsMatch ? "#ccc" : "red" }}
              />
              <span
                className="eye-icon"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <i className="bi bi-eye-slash"></i>
                ) : (
                  <i className="bi bi-eye-fill"></i>
                )}
              </span>
              {!passwordsMatch && (
                <small className="password-error">Passwords do not match</small>
              )}
            </div>

            <div className="edit-user-field">
              <label>Role</label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              />
            </div>

            <div className="edit-user-checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
                Active
              </label>
            </div>

            <div className="edit-user-modal-actions">
              <button
                className="edit-user-save-btn"
                onClick={() => setShowConfirm(true)}
                disabled={formData.password && !passwordsMatch}
              >
                Save
              </button>
              <button className="edit-user-cancel-btn" onClick={onClose}>
                Cancel
              </button>
            </div>
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

export default EditUserModal;
