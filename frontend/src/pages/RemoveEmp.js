import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // <-- Import useNavigate
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import "../styles/RemoveEmp.css";

export default function RemoveEmployee() {
  const [employeeId, setEmployeeId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate(); // <-- Create navigate instance

  const handleRemove = async (e) => {
    e.preventDefault();

    if (!employeeId) {
      setError("Employee ID is required");
      setSuccess("");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/employees/by-employee-id/${employeeId}`, {
        method: "DELETE",
      });
      

      if (response.ok) {
        setError("");
        setSuccess(`Employee with ID ${employeeId} removed successfully!`);
        setEmployeeId("");

        // Wait a second to show the success message, then navigate
        setTimeout(() => {
          navigate("/Employees"); // <-- Replace with your actual path
        }, 1000); // 1 second delay
      } else if (response.status === 404) {
        setSuccess("");
        setError("Employee not found");
      } else {
        setSuccess("");
        setError("Failed to remove employee");
      }
    } catch (err) {
      console.error("Error removing employee:", err);
      setSuccess("");
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div className="RemoveEmp-container">
      <Sidebar />
      <div className="RemoveEmp-content">
        <Header />
        <div className="remove-container">
          <form onSubmit={handleRemove} className="remove-form">
            <h2>Remove Employee</h2>

            {error && <p className="error-text">{error}</p>}
            {success && <p className="success-text">{success}</p>}

            <div className="form-group">
              <input
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="Enter Employee ID"
              />
            </div>

            <button type="submit" className="remove-btn">Remove Employee</button>
          </form>
        </div>
      </div>
    </div>
  );
}
