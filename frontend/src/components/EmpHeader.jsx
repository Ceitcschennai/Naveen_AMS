// src/components/EmpHeader.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaCog, FaSignOutAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/EmpHeader.css";

const EmpHeader = () => {

  const navigate = useNavigate();

  const [currentEmail, setCurrentEmail] = useState("employee@ceitcs.com");

  const [showDropdown, setShowDropdown] = useState(false);

  const [showPasswordCard, setShowPasswordCard] = useState(false);

  const [newEmail, setNewEmail] = useState("");

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  useEffect(() => {

    const storedEmail = localStorage.getItem("email");

    if (storedEmail) setCurrentEmail(storedEmail);

  }, []);


  const handleToggle = () => {

    setShowDropdown(!showDropdown);

    setShowPasswordCard(false);

  };


  const handleSettingsToggle = () => {

    setShowPasswordCard(!showPasswordCard);

    setShowDropdown(false);

  };


  // ================= UPDATE EMAIL =================
  const handleLogin = async () => {

    if (!newEmail.trim()) return;

    try {

      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/api/auth/update-email",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            email: newEmail
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      localStorage.setItem("email", newEmail);

      setCurrentEmail(newEmail);

      setNewEmail("");

      setShowDropdown(false);

      alert("Email updated successfully");

    } catch (error) {

      console.error(error);

      alert("Failed to update email");

    }

  };


  // ================= UPDATE PASSWORD =================
  const handlePasswordChange = async () => {

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {

      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/api/auth/update-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("Password updated successfully");

      setShowPasswordCard(false);

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

    } catch (error) {

      console.error(error);

      alert("Password update failed");

    }

  };


  // ================= LOGOUT =================
  const handleLogout = () => {

    localStorage.clear();

    navigate("/");

  };


  return (

    <header className="emp-header">

      <div className="emp-welcome-text">
        Welcome Employee
      </div>


      <div className="header-right">

        <div className="emp-icon-section">

          <FaCog
            className="settings-icon-e"
            onClick={handleSettingsToggle}
            title="Settings"
          />

          <FaUserCircle
            className="user-icon-e"
            onClick={handleToggle}
            title="Account"
          />

          <FaSignOutAlt
            className="logout-icon-e"
            title="Logout"
            onClick={handleLogout}
          />

        </div>


        {(showDropdown || showPasswordCard) && (

          <div
            className="employeheader-modal-overlay"
            onClick={() => {
              setShowDropdown(false);
              setShowPasswordCard(false);
            }}
          />

        )}


        {showDropdown && (

          <div className="email-dropdown modal-card">

            <p><strong>Logged in as:</strong></p>

            <p className="current-email">
              {currentEmail}
            </p>

            <input
              type="email"
              placeholder="Enter new email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />

            <button
              className="login-btn"
              onClick={handleLogin}
            >
              Update Email
            </button>

          </div>

        )}


        {showPasswordCard && (

          <div className="password-card modal-card">

            <h3>Change Password</h3>

            <div style={{ position: "relative" }}>
              <input
                type={showCurrentPassword ? "text" : "password"}
                placeholder="Current Password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value
                  })
                }
                style={{ paddingRight: "40px", width: "100%", boxSizing: "border-box" }}
              />
              <span
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "#666",
                  fontSize: "16px",
                }}
              >
                {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div style={{ position: "relative" }}>
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="New Password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value
                  })
                }
                style={{ paddingRight: "40px", width: "100%", boxSizing: "border-box" }}
              />
              <span
                onClick={() => setShowNewPassword(!showNewPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "#666",
                  fontSize: "16px",
                }}
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div style={{ position: "relative" }}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm New Password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value
                  })
                }
                style={{ paddingRight: "40px", width: "100%", boxSizing: "border-box" }}
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "#666",
                  fontSize: "16px",
                }}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button
              className="change-btn"
              onClick={handlePasswordChange}
            >
              Change Password
            </button>

          </div>

        )}

      </div>

    </header>

  );

};

export default EmpHeader;