// ✅ Final Working Version for Employee Leave View (React + Backend Filter)

// --- FRONTEND (EmpLeaves.js) ---
import React, { useState, useEffect } from "react";
import "../styles/EmpLeaves.css";
import EmpHeader from "../components/EmpHeader";
import EmpSidebar from "../components/EmpSidebar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { usePopup } from "../PopupNotification";


const EmpManageLeaves = () => {
  const navigate = useNavigate();
  const { showPopup } = usePopup();
  const [searchStatus, setSearchStatus] = useState("");
  const [leaves, setLeaves] = useState([]);

   useEffect(() => {
    const fetchEmployeeLeaves = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        showPopup("Please login again.");
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/api/leaves/employee", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLeaves(res.data);
      } catch (err) {
        console.error("Fetch error:", err);
        showPopup("Error fetching leaves");
      }
    };

     fetchEmployeeLeaves();
  }, [navigate, showPopup]);

  const handleSearchChange = (event) => {
    setSearchStatus(event.target.value);
  };

  const filteredLeaves = leaves.filter((leave) =>
    leave.status.toLowerCase().includes(searchStatus.toLowerCase())
  );

  const formatDate = (dateValue) => {
    if (!dateValue) return "No Date";
    const date = new Date(dateValue);
    if (isNaN(date)) return "Invalid Date";

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const formatDuration = (leave) => {
    if (!leave) return "-";
    const { duration, duration_type, hours } = leave;

    if (duration_type === "Hourly") {
      return `${hours ?? Math.round((duration || 0) * 24)} Hour(s)`;
    }
    if (duration_type === "Half Day" || duration === 0.5) {
      return "Half Day";
    }
    if (!duration && duration !== 0) return "-";
    if (Number.isInteger(duration)) return `${duration} Day(s)`;

    const fullDays = Math.floor(duration);
    const hourPart = Math.round((duration - fullDays) * 24);
    return `${fullDays} Day(s) ${hourPart} Hour(s)`;
  };

  return (
    <div className="EmpLeaves-container">
      <EmpSidebar />
      <div className="EmpLeaves-content">
        <EmpHeader />
        <div className="empmanageleaves-container">
          <h1>My Leave Requests</h1>
          <div className="empmanageleaves-header-bar">
            <input
              type="text"
              placeholder="Search By Status"
              className="empmanageleaves-search-input"
              value={searchStatus}
              onChange={handleSearchChange}
            />
            <button
              className="empmanageleaves-add-button"
              onClick={() => navigate("/AddLeaves")}
            >
              Add Leave
            </button>
          </div>
          <table className="empmanageleaves-table">
            <thead>
              <tr>
                <th>SNO</th>
                <th>LEAVE TYPE</th>
                <th>FROM</th>
                <th>TO</th>
                <th>DURATION</th>
                <th>APPLIED DATE</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeaves.map((leave, index) => (
                <tr key={leave._id}>
                  <td>{index + 1}</td>
                  <td>{leave.type}</td>
                  <td>{formatDate(leave.from)}</td>
                  <td>{formatDate(leave.to)}</td>
                  <td>{formatDuration(leave)}</td>
                  <td>{formatDate(leave.applied_date)}</td>
                  <td className={`empmanageleaves-status ${leave.status.toLowerCase()}`}>
                    {leave.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmpManageLeaves;
