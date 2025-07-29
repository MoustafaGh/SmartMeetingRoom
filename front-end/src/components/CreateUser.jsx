import React, { useState } from "react";
import api from "../api";
import "./CreateUser.css";
import ConfirmationModal from "./ConfirmationModal";

function CreateUser({ onUserCreated }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const passwordRules = [
    "At least 8 characters",
    "One uppercase letter",
    "One lowercase letter",
    "One number",
    "One special character (!@#$%^&*)"
  ];

  const passwordsMatch =
    formData.password === formData.confirmPassword || formData.confirmPassword === "";

  const handleCreateUser = async () => {
    if (formData.password && !passwordsMatch) {
      setErrorMessage("Passwords do not match!");
      setShowConfirm(false);
      return;
    }

    try {
      const roleFormatted =
        formData.role.charAt(0).toUpperCase() + formData.role.slice(1).toLowerCase();
      const firstNameFormatted =
        formData.firstName.charAt(0).toUpperCase() + formData.firstName.slice(1).toLowerCase();
      const lastNameFormatted =
        formData.lastName.charAt(0).toUpperCase() + formData.lastName.slice(1).toLowerCase();

      await api.post("/User/create", {
        ...formData,
        role: roleFormatted,
        firstName: firstNameFormatted,
        lastName: lastNameFormatted,
      });

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
      });
      setErrorMessage("");
      setShowConfirm(false);
      onUserCreated();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setErrorMessage(err.response.data.error);
      } else {
        setErrorMessage("Failed to create user.");
      }
      setShowConfirm(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  return (
    <>
      <form className="create-user-form" onSubmit={handleSubmit}>
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <div className="create-user-field-row">
          <div className="create-user-field-half">
            <label>First Name</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
            />
          </div>
          <div className="create-user-field-half">
            <label>Last Name</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="create-user-field">
          <label>Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>

        <div className="create-user-field">
          <label>Password</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <div className="password-rules-box">
            <strong>Password must contain:</strong>
            <ul>
              {passwordRules.map((rule, index) => (
                <li key={index}>{rule}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="create-user-field">
          <label>Confirm Password</label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            style={{ borderColor: passwordsMatch ? "#ccc" : "red" }}
            required
          />
          {!passwordsMatch && (
            <small className="password-error">Passwords do not match</small>
          )}
        </div>

        <div className="create-user-field">
          <label>Role</label>
          <input
            type="text"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            required
          />
        </div>

        <button type="submit" className="create-user-primary-btn">
          Create User
        </button>
      </form>

      {showConfirm && (
        <ConfirmationModal
          message="Are you sure you want to create this user?"
          onConfirm={handleCreateUser}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}

export default CreateUser;
