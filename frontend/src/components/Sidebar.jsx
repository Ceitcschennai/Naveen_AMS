import React, { useEffect, useState } from "react";
import {
  FaTachometerAlt,
  FaUsers,
  FaCalendarCheck,
  FaCalendarTimes,
  FaRegCalendarAlt,
  FaBriefcase,
  FaFileAlt,
  FaChartBar,
  FaUserCheck,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname.toLowerCase();

  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);
  const [reportDropdownOpen, setReportDropdownOpen] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // Adjust sidebar visibility on screen resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Open dropdown if on specific report pages
  useEffect(() => {
    setReportDropdownOpen(
      path === "/attendancereport" || path === "/individualreport"
    );
  }, [path]);

  // Live time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleNavigate = (route) => {
    navigate(route);
    // Close sidebar on mobile/tablet
    if (window.innerWidth <= 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        className="sidebar-toggle-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? "✖" : "☰"}
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <h1 className="sidebar-title">CeiTCS</h1>
          <p className="sidebar-subtitle">Attendance Management System</p>
        </div>

        <ul className="nav-list">
          <li
            className={path === "/dashboard" ? "active" : ""}
            onClick={() => handleNavigate("/Dashboard")}
          >
            <FaTachometerAlt /> Dashboard
          </li>
          <li
            className={path.startsWith("/employees") ? "active" : ""}
            onClick={() => handleNavigate("/Employees")}
          >
            <FaUsers /> Employees
          </li>
          <li
            className={path === "/attendance" ? "active" : ""}
            onClick={() => handleNavigate("/Attendance")}
          >
            <FaCalendarCheck /> Attendance
          </li>
          <li
            className={path === "/leaves" ? "active" : ""}
            onClick={() => handleNavigate("/Leaves")}
          >
            <FaCalendarTimes /> Leaves
          </li>
          <li
            className={path === "/holidays" ? "active" : ""}
            onClick={() => handleNavigate("/Holidays")}
          >
            <FaRegCalendarAlt /> Holidays
          </li>
          <li
            className={path === "/workingdays" ? "active" : ""}
            onClick={() => handleNavigate("/WorkingDays")}
          >
            <FaBriefcase /> Working Days
          </li>

          {/* Dropdown Section */}
          <li
            className="dropdown-toggle"
            onClick={() => setReportDropdownOpen(!reportDropdownOpen)}
          >
            <div>
              <FaFileAlt /> Attendance Report
            </div>
            <div>{reportDropdownOpen ? <FaChevronUp /> : <FaChevronDown />}</div>
          </li>

          {reportDropdownOpen && (
            <>
              <li
                className={`dropdown-item ${
                  path === "/attendancereport" ? "active" : ""
                }`}
                onClick={() => handleNavigate("/AttendanceReport")}
              >
                <FaChartBar size={10} /> &nbsp;Report Overview
              </li>
              <li
                className={`dropdown-item ${
                  path === "/individualreport" ? "active" : ""
                }`}
                onClick={() => handleNavigate("/IndividualReport")}
              >
                <FaUserCheck size={10} /> &nbsp;Individual Report
              </li>
            </>
          )}
        </ul>

        <div className="sidebar-footer">
          <span className="day-date-time">
            {currentDateTime.toLocaleDateString("en-GB", {
              weekday: "short",
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
          <span className="time">
            {currentDateTime.toLocaleTimeString("en-GB")}
          </span>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
