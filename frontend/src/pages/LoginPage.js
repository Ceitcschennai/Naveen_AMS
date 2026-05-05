import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/LoginPage.css";
import logo from "../assets/images/logo.jpg";
import { FaUserCircle } from "react-icons/fa";
import { validatePassword, PASSWORD_ERROR_MESSAGE } from "../utils/auth";
import { usePopup } from "../PopupNotification";
import PasswordInput from "../components/PasswordInput";

const LoginPage = () => {

  const navigate = useNavigate();
  const { showPopup } = usePopup();

  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const API = "http://localhost:5000/api/auth";

  // Clear fields when page loads
  useEffect(() => {
    setName("");
    setEmail("");
    setPassword("");
  }, []);

  const handleSignupClick = () => {
    setIsSignup(true);
  };

  const handleBackToLogin = () => {
    setIsSignup(false);
    setName("");
    setEmail("");
    setPassword("");
  };

  // ================= LOGIN =================
  const handleLoginSubmit = async (e) => {

    e.preventDefault();

    if (!email || !password) {
      showPopup("Please enter both email and password.");
      return;
    }

    try {

      const response = await axios.post(`${API}/login`, {
        email,
        password,
      });

      if (response.data.token) {

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("email", email);
        localStorage.setItem("role", "employee");

        setEmail("");
        setPassword("");

        navigate("/EmpDashboard");

      }

    } catch (err) {

      showPopup(err.response?.data?.message || "Login failed. Please check credentials.");

    }

  };

  // ================= SIGNUP =================
  const handleSignupSubmit = async (e) => {

    e.preventDefault();

    if (!name || !email || !password) {
      showPopup("Please fill all fields.");
      return;
    }

    // Validate password strength
    if (!validatePassword(password)) {
      showPopup(PASSWORD_ERROR_MESSAGE);
      return;
    }

    try {

      await axios.post(`${API}/signup`, {
        name,
        email,
        password
      });

      showPopup("Signup successful! Please login.");

      setIsSignup(false);
      setName("");
      setEmail("");
      setPassword("");

    } catch (err) {

      showPopup(err.response?.data?.message || "Signup failed.");

    }

  };

  const goToAdminLogin = () => {
    navigate("/AdminLoginpage");
  };

  return (
    <>
      <div
        className="top-right-icon"
        title="Admin Login"
        onClick={goToAdminLogin}
      >
        <FaUserCircle size={40} color="#6d47c8" />
      </div>

      <div className="login-container">

        <div className="image-section">
          <img src={logo} alt="Company Logo" />
        </div>

        <div className="form-section">

          {!isSignup ? (

            <div className="login-wrapper">

              <h2>Welcome</h2>
              <p>Employee Login</p>

              <form
                className="login-form"
                onSubmit={handleLoginSubmit}
                autoComplete="off"
              >

                <input
                  type="email"
                  autoComplete="off"
                  placeholder="Email"
                  className="input-field"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <PasswordInput
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="input-field"
                />

                <button type="submit" className="login-button signup-button">
                  Login
                </button>

              </form>

              <div className="login-actions">
                <button
                  type="button"
                  className="signup-link"
                  onClick={handleSignupClick}
                >
                  Signup?
                </button>
              </div>

            </div>

          ) : (

            <div className="signup-wrapper">

              <h2>Sign Up</h2>

              <form
                className="signup-form"
                onSubmit={handleSignupSubmit}
                autoComplete="off"
              >

                <input
                  type="text"
                  autoComplete="off"
                  placeholder="Full Name"
                  className="input-field"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <input
                  type="email"
                  autoComplete="off"
                  placeholder="Email"
                  className="input-field"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <PasswordInput
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="input-field"
                />


                <button type="submit" className="login-button signup-button">
                  Register
                </button>

              </form>

              <button
                className="back-to-login"
                onClick={handleBackToLogin}
              >
                Back to Login
              </button>

            </div>

          )}

        </div>

      </div>
    </>
  );
};

export default LoginPage;