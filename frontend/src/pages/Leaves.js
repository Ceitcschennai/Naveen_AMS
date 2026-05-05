import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Leaves.css";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useLocation } from "react-router-dom";
import { usePopup } from "../PopupNotification";

const calculateDuration = (leave) => {
  if (!leave?.from || !leave?.to) return "-";

  if (leave.duration_type === "Hourly") {
    return `${leave.hours} hour(s)`;
  } else if (leave.duration_type === "Half Day") {
    return "Half Day";
  } else {
    const fromDate = new Date(leave.from);
    const toDate = new Date(leave.to);
    const timeDiff = Math.abs(toDate - fromDate);
    return `${Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1} day(s)`;
  }
};

// Check if leave is completed (To Date has passed)
const isLeaveCompleted = (leave) => {
  if (!leave?.to) return false;
  const toDate = new Date(leave.to);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  toDate.setHours(0, 0, 0, 0);
  return today > toDate;
};

// Check if leave has already started (From Date has passed)
// This means the employee has already taken the leave
// eslint-disable-next-line no-unused-vars
const isLeaveStarted = (leave) => {
  if (!leave?.from) return false;
  const fromDate = new Date(leave.from);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  fromDate.setHours(0, 0, 0, 0);
  return today > fromDate;
};

// Check if leave status is final (Approved or Rejected)
const isFinalStatus = (leave) => {
  return leave.status === "Approved" || leave.status === "Rejected";
};

// Determine display status for a leave
const getDisplayStatus = (leave) => {
  // If status is Approved or Rejected, show the actual status
  if (isFinalStatus(leave)) {
    return leave.status;
  }
  // If leave is completed (toDate passed), show as Completed
  if (isLeaveCompleted(leave)) {
    return "Completed";
  }
  // Otherwise show actual status
  return leave.status;
};

// Check if action buttons should be shown
// Allow action if: Status is Pending AND leave hasn't ended (toDate not passed)
const canShowActionButtons = (leave) => {
  return !isLeaveCompleted(leave) && !isFinalStatus(leave) && leave.status === "Pending";
};

const ManageLeaves = () => {
  const location = useLocation();
  const { showPopup, showSuccess } = usePopup();
  const queryParams = new URLSearchParams(location.search);
  const statusFromURL = queryParams.get("status");

  const [leaves, setLeaves] = useState([]);
  const [filter, setFilter] = useState(
    statusFromURL ? capitalize(statusFromURL) : "All"
  );
  const [search, setSearch] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const fetchLeaves = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/leaves");

      let leaveList = Array.isArray(response.data)
        ? response.data
        : response.data.leaves || [];

      setLeaves(leaveList);
    } catch (error) {
      console.error("Error fetching leave data:", error);
      showPopup("Error fetching leave data. Please check backend/API.");
    }
  };

  useEffect(() => {
    fetchLeaves();

    // When admin visits Leaves page, update their last seen time to current timestamp
    // This marks all current leaves as "seen" - only new leaves will show in notification
    // WhatsApp-style behavior: opening the page resets the notification count
    axios
      .put("http://localhost:5000/api/leaves/update-last-seen")
      .then(() => {
        // Notify Dashboard to update notification badge (set count to 0)
        window.dispatchEvent(new Event("leave-seen"));
      })
      .catch((err) => console.error("Error updating last seen time:", err));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (statusFromURL) {
      const section = document.getElementById("leave-table");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [statusFromURL]);

  const handleView = (leave) => {
    setSelectedEmployee(leave);
  };

  const handleStatusChange = async (status) => {
    if (!selectedEmployee) return;

    try {
      await axios.put(
        `http://localhost:5000/api/leaves/${selectedEmployee.id}/status`,
        { status }
      );

      showSuccess(`Leave marked as ${status}`);
      setSelectedEmployee(null);
      fetchLeaves();
    } catch (error) {
      console.error("Failed to update leave status:", error);
    }
  };

  const filteredLeaves = leaves.filter((leave) => {
    const statusMatch =
      filter === "All" ||
      leave.status?.toLowerCase() === filter.toLowerCase();

    const empMatch = leave.emp_id
      ?.toLowerCase()
      .includes(search.trim().toLowerCase());

    return statusMatch && empMatch;
  });

  function capitalize(str) {
    return str?.charAt(0).toUpperCase() + str?.slice(1).toLowerCase();
  }

  return (
    <div className="Leaves-container">
      <Sidebar />

      <div className="Leaves-content">
        <Header />

        <div className="manage-leaves-container">
          <h2>Manage Leaves</h2>

          <div className="leaves-top-bar">
            <input
              type="text"
              placeholder="Search By Emp ID"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <div className="buttons">
              {["Pending", "Approved", "Rejected", "All"].map((status) => (
                <button
                  key={status}
                  className={filter === status ? "active" : ""}
                  onClick={() => setFilter(status)}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="leaves-table-container" id="leave-table">
            <table className="leaves-table">
              <thead>
                <tr>
                  <th>S No</th>
                  <th>Emp ID</th>
                  <th>Name</th>
                  <th>Leave Type</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Duration</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredLeaves.length > 0 ? (
                  filteredLeaves.map((leave, index) => (
                    <tr key={leave.id} className={isLeaveCompleted(leave) ? "completed-row" : ""}>
                      <td>{index + 1}</td>
                      <td>{leave.emp_id}</td>
                      <td>{leave.name}</td>
                      <td>{leave.type}</td>
                      <td>{leave.from?.slice(0, 10)}</td>
                      <td>{leave.to?.slice(0, 10)}</td>
                      <td>{calculateDuration(leave)}</td>

                      <td>
                        <span className={`status ${getDisplayStatus(leave)?.toLowerCase()}`}>
                          {getDisplayStatus(leave)}
                        </span>
                      </td>

                      <td>
                        <button
                          className="action-btn"
                          onClick={() => handleView(leave)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="no-data">
                      No leaves found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {selectedEmployee && (
            <div className="employee-details-modal">
              <h3>Leave Details</h3>

              <p>
                <strong>Emp ID:</strong> {selectedEmployee.emp_id}
              </p>

              <p>
                <strong>Name:</strong> {selectedEmployee.name}
              </p>

              <p>
                <strong>Leave Type:</strong> {selectedEmployee.type}
              </p>

              <p>
                <strong>From:</strong>{" "}
                {selectedEmployee.from?.slice(0, 10)}
              </p>

              <p>
                <strong>To:</strong> {selectedEmployee.to?.slice(0, 10)}
              </p>

              <p>
                <strong>Duration:</strong>{" "}
                {calculateDuration(selectedEmployee)}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`status ${getDisplayStatus(selectedEmployee)?.toLowerCase()}`}
                >
                  {getDisplayStatus(selectedEmployee)}
                </span>
              </p>

              <div className="modal-buttons">
                {canShowActionButtons(selectedEmployee) ? (
                  <>
                    <button
                      className="approve-btn"
                      onClick={() => handleStatusChange("Approved")}
                    >
                      Approve
                    </button>

                    <button
                      className="reject-btn"
                      onClick={() => handleStatusChange("Rejected")}
                    >
                      Reject
                    </button>

                    <button
                      className="close-btn"
                      onClick={() => setSelectedEmployee(null)}
                    >
                      Close
                    </button>
                  </>
                ) : (
                  <div className="completed-badge">
                    <span className="locked-label">
                      {isFinalStatus(selectedEmployee) 
                        ? `Leave ${selectedEmployee.status}` 
                        : isLeaveCompleted(selectedEmployee) 
                          ? "Completed" 
                          : "Action Locked"}
                    </span>
                    <button
                      className="close-btn"
                      onClick={() => setSelectedEmployee(null)}
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageLeaves;