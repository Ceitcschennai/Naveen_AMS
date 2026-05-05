import React from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const PasswordInput = ({
  value,
  onChange,
  placeholder = "Password",
  className = "",
}) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const inputStyle = {
    paddingRight: "40px",
    width: "100%",
    boxSizing: "border-box",
  };

  return (
    <div className="password-input-wrapper" style={{ position: "relative", width: "100%" }}>
      <input
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        className={className}
        value={value}
        onChange={onChange}
        autoComplete="new-password"
        style={inputStyle}
      />
      <span
        className="password-toggle-icon"
        onClick={togglePassword}
        style={{
          position: "absolute",
          right: "12px",
          top: "50%",
          transform: "translateY(-50%)",
          cursor: "pointer",
          color: "#ffffff",
          fontSize: "18px",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        title={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? <FaEyeSlash /> : <FaEye />}
      </span>
    </div>
  );
};

export default PasswordInput;