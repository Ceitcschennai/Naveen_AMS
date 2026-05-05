import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import "../styles/NewEmp.css";
import { usePopup } from "../PopupNotification";

export default function AddEmployee() {
  const navigate = useNavigate();
  const { showPopup, showSuccess } = usePopup();

  const [formData, setFormData] = useState({
    empId: "",
    name: "",
    email: "",
    dob: "",
    gender: "",
    maritalStatus: "",
    department: "",
    role: "",
    place: "",
    country: "",
    type: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setFormData({
        ...formData,
        [name]: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      const response = await fetch("http://localhost:5000/api/employees", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        showSuccess("Employee Added Successfully!");
        navigate("/Employees");
      } else {
        showPopup(data.message || "Failed to add employee.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      showPopup("Server error while adding employee.");
    }
  };

  return (
    <div className="NewEmp-container">
      <Sidebar />

      <div className="NewEmp-content">
        <Header />

        <div className="form-container">
          <form onSubmit={handleSubmit} className="employee-form">

            <div className="form-row">
              <div className="form-group">
                <label>Employee ID</label>
                <input
                  type="text"
                  name="empId"
                  placeholder="Employee ID"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Insert Name"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>


            <div className="form-row">
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Insert Email"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  onChange={handleChange}
                />
              </div>
            </div>


            <div className="form-row">
              <div className="form-group">
                <label>Gender</label>
                <select name="gender" onChange={handleChange}>
                  <option value="">Select Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Marital Status</label>
                <select name="maritalStatus" onChange={handleChange}>
                  <option value="">Select Status</option>
                  <option>Single</option>
                  <option>Married</option>
                </select>
              </div>
            </div>


            <div className="form-row">
              <div className="form-group">
                <label>Role</label>
                <input
                  type="text"
                  name="role"
                  placeholder="Role"
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Department</label>
                <select name="department" onChange={handleChange}>
                  <option value="">Select Department</option>
                  <option>React Developer</option>
                  <option>Manager</option>
                  <option>Frontend Developer</option>
                </select>
              </div>
            </div>


            <div className="form-row">
              <div className="form-group">
                <label>Employee Type</label>
                <select name="type" onChange={handleChange}>
                  <option value="">Select Employee</option>
                  <option>Permanent</option>
                  <option>Contract</option>
                  <option>Internship</option>
                </select>
              </div>

              <div className="form-group">
                <label>Upload Image</label>
                <input
                  type="file"
                  name="image"
                  onChange={handleChange}
                />
              </div>
            </div>


            <div className="form-row">
              <div className="form-group">
                <label>Place</label>
                <input
                  type="text"
                  name="place"
                  placeholder="Place"
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Country</label>
                <input
                  type="text"
                  name="country"
                  placeholder="Country"
                  onChange={handleChange}
                />
              </div>
            </div>

            <button type="submit" className="submit-btn">
              Add Employee
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}