import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminLoginpage.css";
import logo from "../assets/images/logo.jpg";
import PasswordInput from "../components/PasswordInput";

const AdminLoginPage = () => {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const defaultAdmin = {
    email: "admin@gmail.com",
    password: "p123"
  };

  useEffect(() => {
    setEmail("");
    setPassword("");
    setError("");
  }, []);

  const handleLoginSubmit = (e) => {

    e.preventDefault();

    if (email === defaultAdmin.email && password === defaultAdmin.password) {

      localStorage.setItem("role", "admin");
      localStorage.setItem("email", email);

      setEmail("");
      setPassword("");

      navigate("/Dashboard");

    } else {
      setError("Invalid admin credentials.");
    }

  };

  return (

    <div className="add-admin-login-container">

      <div className="add-admin-image-section">
        <img src={logo} alt="Company Logo" />
      </div>

      <div className="add-admin-form-section">

        <div className="add-admin-login-wrapper">

          <h2>Welcome</h2>
          <p>Admin Login</p>

          {error && <p className="add-admin-error-message">{error}</p>}

          <form
            className="add-admin-login-form"
            onSubmit={handleLoginSubmit}
            autoComplete="off"
          >

            <input
              type="email"
              autoComplete="off"
              placeholder="Email"
              className="add-admin-input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="add-admin-input-field"
            />

            <button type="submit" className="add-admin-login-button add-admin-signup-button">
              Login
            </button>

          </form>

        </div>

      </div>

    </div>

  );

};

export default AdminLoginPage;