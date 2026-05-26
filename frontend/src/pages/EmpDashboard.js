import React, { useEffect, useState } from "react";
import "../styles/EmpDashboard.css";
import EmpHeader from "../components/EmpHeader";
import EmpSidebar from "../components/EmpSidebar";
import {
  FaUsers,
  FaCalendarCheck,
  FaCalendarTimes,
  FaCalendarDay,
} from "react-icons/fa";
import axios from "axios";

const WORKING_HOURS_PER_DAY = 8;
const HALF_DAY_HOURS = 4;

const EmpDashboard = () => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [lastLogin, setLastLogin] = useState("");

  const [leaveStats, setLeaveStats] = useState({
    totalLeaves: 20,
    leavesTaken: "0 days",
    remainingLeaves: "0 days",
  });

  const formatLeaveDays = (hours) => {
    const days = Math.floor(hours / WORKING_HOURS_PER_DAY);
    const remainingHours = hours % WORKING_HOURS_PER_DAY;

    if (days > 0 && remainingHours > 0) {
      return `${days} day${days > 1 ? "s" : ""} ${remainingHours} hr${remainingHours > 1 ? "s" : ""}`;
    } else if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""}`;
    } else {
      return `${remainingHours} hr${remainingHours > 1 ? "s" : ""}`;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const profileRes = await axios.get(
          "http://localhost:5000/api/auth/profile",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setName(profileRes.data.name);
      } catch (error) {
        console.error("Profile error:", error.message);
      }

      try {
        const leavesRes = await axios.get(
          "http://localhost:5000/api/leaves/employee",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const approvedLeaves = leavesRes.data.filter(
          (leave) => leave.status === "Approved"
        );

        let totalHoursTaken = 0;

        approvedLeaves.forEach((leave) => {
         if (leave.duration_type === "Full Day") {
           totalHoursTaken += (leave.duration || 1) * WORKING_HOURS_PER_DAY;
         } 
            else if (leave.duration_type === "Half Day") {
               totalHoursTaken += HALF_DAY_HOURS;
               } 
             else if (leave.duration_type === "Hourly") {
               let hoursTaken = 0;

                 if (leave.hours) {
                   hoursTaken = leave.hours;
           } else if (leave.from && leave.to) {
              const start = new Date(leave.from);
             const end = new Date(leave.to);
             const diffMs = end - start;
             hoursTaken = diffMs / (1000 * 60 * 60);
           }

          totalHoursTaken += hoursTaken;
       }
    });

        const totalLeaveHoursAllowed = 20 * WORKING_HOURS_PER_DAY;
        let remainingHours = totalLeaveHoursAllowed - totalHoursTaken;
        if (remainingHours < 0) remainingHours = 0;

        setLeaveStats({
          totalLeaves: "20 days",
          leavesTaken: formatLeaveDays(totalHoursTaken),
          remainingLeaves: formatLeaveDays(remainingHours),
        });
      } catch (error) {
        console.error("Leave stats error:", error.message);
      }

      // ✅ Fix: Show last login from previousLogin
      const prevLogin = localStorage.getItem("previousLogin");
      if (prevLogin) {
        const formatted = new Date(prevLogin).toLocaleString();
        setLastLogin(formatted);
      } else {
        setLastLogin("Not available");
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="emp-dashboard-wrapper">
      <EmpSidebar />
      <div className="emp-dashboard-content">
        <EmpHeader />
        <div className="emp-dashboard-main">
          <div className="emp-dashboard-left">
            <div className="welcome-card animated-slide">
              <div className="emp-icon default">
                <FaUsers size={20} />
              </div>
              <div className="emp-text">
                <p className="emp-label">Welcome Back</p>
                <p className="emp-name">
                  {loading ? "Loading..." : name || "No name found"}
                </p>
              </div>
            </div>
          </div>

          <div className="emp-dashboard-right">
            <div className="leave-info-column">
              <div className="leave-info-box">
                <FaCalendarCheck className="leave-box-icon green" />
                <div className="leave-box-text">
                  <p className="leave-title">Total Annual Leaves</p>
                  <p className="leave-value">{leaveStats.totalLeaves}</p>
                </div>
              </div>
              <div className="leave-info-box">
                <FaCalendarTimes className="leave-box-icon red" />
                <div className="leave-box-text">
                  <p className="leave-title">Leaves Taken</p>
                  <p className="leave-value">{leaveStats.leavesTaken}</p>
                </div>
              </div>
              <div className="leave-info-box">
                <FaCalendarDay className="leave-box-icon blue" />
                <div className="leave-box-text">
                  <p className="leave-title">Remaining Leaves</p>
                  <p className="leave-value">{leaveStats.remainingLeaves}</p>
                </div>
              </div>
            </div>

            <div className="last-login-line">
              Last login: {lastLogin || "Loading..."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmpDashboard;
