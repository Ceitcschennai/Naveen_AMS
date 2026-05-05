// src/components/Header.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaCog, FaSignOutAlt } from "react-icons/fa";
import "../styles/Header.css";

const Header = () => {

  const navigate = useNavigate();

  // Admin uses default login so email/password update not required
  // const [currentEmail, setCurrentEmail] = useState("");
  // const [showDropdown, setShowDropdown] = useState(false);
  // const [showPasswordCard, setShowPasswordCard] = useState(false);
  // const [newEmail, setNewEmail] = useState("");
  // const [passwordData, setPasswordData] = useState({
  //   currentPassword: "",
  //   newPassword: "",
  //   confirmPassword: "",
  // });

  // const handleToggle = () => {
  //   setShowDropdown(!showDropdown);
  // };

  // const handleSettingsToggle = () => {
  //   setShowPasswordCard(!showPasswordCard);
  // };

  // const handleLogin = () => {
  //   // Not used for admin
  // };

  // const handlePasswordChange = () => {
  //   // Not used for admin
  // };

  const handleLogout = () => {

    localStorage.clear();

    navigate("/");

  };

  return (

    <header className="header">

      <div className="welcome-text">
        Welcome Admin
      </div>

      <div className="header-right">

        <div className="icon-section">

          {/* Settings disabled for admin */}
          <FaCog
            className="settings-icon"
            title="Settings disabled"
          />

          {/* Account disabled */}
          <FaUserCircle
            className="user-icon"
            title="Admin account"
          />

          <FaSignOutAlt
            className="logout-icon"
            title="Logout"
            onClick={handleLogout}
          />

        </div>

      </div>

    </header>

  );

};

export default Header;