import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AddLeaves.css";
import EmpHeader from "../components/EmpHeader";
import EmpSidebar from "../components/EmpSidebar";
import { usePopup } from "../PopupNotification";

const AddLeave = () => {

  const navigate = useNavigate();
  const { showPopup, showSuccess } = usePopup();

  const [user, setUser] = useState({
    empId: "",
    name: "",
    email: ""
  });

  const [formData, setFormData] = useState({
    type: "",
    from: "",
    to: "",
    durationType: "Full Day",
    hours: "",
    duration: 0
  });

  // 🔐 Load logged user
  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {
      showPopup("Please login again.");
      navigate("/login");
      return;
    }

    fetch("http://localhost:5000/api/auth/profile", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setUser({
          empId: data.empId,
          name: data.name,
          email: data.email
        });
      })
      .catch(() => {
        showPopup("Session expired. Please login again.");
        navigate("/login");
      });

  }, [navigate]); // eslint-disable-line react-hooks/exhaustive-deps


  // 📅 Calculate duration
  useEffect(() => {

    if (formData.durationType === "Hourly") {

      setFormData(prev => ({
        ...prev,
        duration: parseFloat(formData.hours) || 0
      }));

      return;
    }

    if (formData.from && formData.to) {

      const fromDate = new Date(formData.from);
      const toDate = new Date(formData.to);

      const diff =
        Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1;

      let duration = diff > 0 ? diff : 0;

      if (formData.durationType === "Half Day") {
        duration = duration * 0.5;
      }

      setFormData(prev => ({
        ...prev,
        duration
      }));

    }

  }, [formData.from, formData.to, formData.durationType, formData.hours]);


  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

  };


  // 🚀 Submit leave
  const handleSubmit = async (e) => {

    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!user.empId) {
      showPopup("Employee ID missing. Please login again.");
      return;
    }

    if (!formData.type || !formData.from || !formData.to) {
      showPopup("Please fill all required fields.");
      return;
    }

    const payload = {
      type: formData.type,
      from: formData.from,
      to: formData.to,
      durationType: formData.durationType,
      duration: formData.duration,
      hours: formData.hours || 0
    };

    try {

      const response = await fetch("http://localhost:5000/api/leaves", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      showSuccess("Leave request submitted successfully");

      navigate("/empleaves");

    } catch (error) {

      console.error(error);

      showPopup("Server Error: " + error.message);

    }

  };


  return (
    <div className="AddLeaves-container">

      <EmpSidebar />

      <div className="AddLeaves-content">

        <EmpHeader />

        <div className="add-leave-container">

          <h2>Request for Leave</h2>

          <form onSubmit={handleSubmit} className="add-leave-form">

            <div className="leave-form-group">
              <label>Leave Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Annual Leave">Annual Leave</option>
                <option value="Casual Leave">Casual Leave</option>
                <option value="Maternity Leave">Maternity Leave</option>
                <option value="Paternity Leave">Paternity Leave</option>
              </select>
            </div>


            <div className="leave-form-group">
              <label>Leave Duration Type</label>
              <select
                name="durationType"
                value={formData.durationType}
                onChange={handleChange}
              >
                <option value="Full Day">Full Day</option>
                <option value="Half Day">Half Day</option>
                <option value="Hourly">Hourly</option>
              </select>
            </div>


            {formData.durationType === "Hourly" && (
              <div className="leave-form-group">
                <label>Number of Hours</label>
                <input
                  type="number"
                  name="hours"
                  min="1"
                  max="8"
                  value={formData.hours}
                  onChange={handleChange}
                />
              </div>
            )}


            <div className="leave-date-row">

              <div className="leave-form-group">
                <label>From Date</label>
                <input
                  type="date"
                  name="from"
                  value={formData.from}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="leave-form-group">
                <label>To Date</label>
                <input
                  type="date"
                  name="to"
                  value={formData.to}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>


            <div className="leave-form-group">
              <label>Calculated Duration</label>
              <input
                type="text"
                value={formData.duration}
                readOnly
              />
            </div>


            <button type="submit">
              Submit Request
            </button>

          </form>

        </div>

      </div>

    </div>
  );

};

export default AddLeave;