import React, { useEffect, useState } from "react";
import {
  FaTachometerAlt,
  FaCalendarTimes,
  FaRegCalendarAlt,
  FaBriefcase,
  FaUser,
} from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi"; // Hamburger icon
import "../styles/EmpSidebar.css";
import { useNavigate, useLocation } from "react-router-dom";

const EmpSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);

  const formatDate = (date) => {
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    const suffix = (day) => {
      if (day > 3 && day < 21) return "th";
      switch (day % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
      }
    };
    return `${day}${suffix(day)} ${month} ${year}`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const dateFormatted = formatDate(currentDateTime);
  const timeFormatted = currentDateTime.toLocaleTimeString();
  const dayOfWeek = currentDateTime.toLocaleString("default", { weekday: "short" });

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Toggle button */}
      <button className="sidebar-toggle-btn" onClick={handleToggle}>
        <GiHamburgerMenu />
      </button>

      <aside className={`empsidebar ${isOpen ? "open" : ""}`}>
        <div className="empsidebar-header">
          <h1 className="empsidebar-title">CeiTCS</h1>
          <p className="empsidebar-subtitle">Employee Profile</p>
        </div>

        <nav>
          <ul>
            <li
              className={location.pathname === "/empdashboard" ? "active" : ""}
              onClick={() => {
                navigate("/empdashboard");
                setIsOpen(false);
              }}
            >
              <FaTachometerAlt size={20} /> Dashboard
            </li>
            <li
              className={location.pathname === "/empleaves" ? "active" : ""}
              onClick={() => {
                navigate("/empleaves");
                setIsOpen(false);
              }}
            >
              <FaCalendarTimes size={20} /> Leaves
            </li>
            <li
              className={location.pathname === "/empholidays" ? "active" : ""}
              onClick={() => {
                navigate("/empholidays");
                setIsOpen(false);
              }}
            >
              <FaRegCalendarAlt size={20} /> Holidays
            </li>
            <li
              className={location.pathname === "/empworkingdays" ? "active" : ""}
              onClick={() => {
                navigate("/empworkingdays");
                setIsOpen(false);
              }}
            >
              <FaBriefcase size={20} /> Working Days
            </li>
            <li
              className={location.pathname === "/myprofile" ? "active" : ""}
              onClick={() => {
                navigate("/myprofile");
                setIsOpen(false);
              }}
            >
              <FaUser size={20} /> My Profile
            </li>
          </ul>
        </nav>

        <div className="empsidebar-footer">
          <div className="empdate-time">
            <span className="empday-date-time">{dayOfWeek}, {dateFormatted}</span>
            <span className="emptime">{timeFormatted}</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default EmpSidebar;
