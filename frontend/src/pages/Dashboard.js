import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FaUsers,
  FaFileAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarTimes
} from "react-icons/fa";

import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import '../styles/Dashboard.css';

const Dashboard = () => {

  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState({
    totalEmployees: 0,
    totalRoles: 0,
    leaveApplied: 0,
    leaveApproved: 0,
    leaveRejected: 0,
    leavePending: 0,
    statistics: {
      today: 0,
      thisWeek: 0,
      thisMonth: 0,
      remaining: 0,
    },
  });

  const [leaveCount, setLeaveCount] = useState(0);
  const [todayPercentage, setTodayPercentage] = useState(0);
  const [weekPercentage, setWeekPercentage] = useState(0);
  const [monthPercentage, setMonthPercentage] = useState(0);

  useEffect(() => {

    const fetchData = async () => {

      try {

        // Dashboard overview data
        const res = await axios.get("http://localhost:5000/api/dashboard/overview");
        const data = res.data;

        setDashboardData(data);

        // Fetch NEW leaves (leaves applied after admin last viewed)
        // This uses timestamp-based comparison instead of count-based
        const newLeavesRes = await axios.get("http://localhost:5000/api/dashboard/leave/pending-count");
        const count = newLeavesRes.data.count || 0;
        setLeaveCount(count);

        // Calculate statistics %
        setTodayPercentage(((data.statistics.today / 9) * 100).toFixed(0));
        setWeekPercentage(((data.statistics.thisWeek / 45) * 100).toFixed(0));
        setMonthPercentage(((data.statistics.thisMonth / 180) * 100).toFixed(0));

      } catch (err) {

        console.error("Error fetching dashboard data:", err);

      }

    };

    fetchData();

  }, []);

  return (

    <div className="dashboard-container">

      <Sidebar />

      <div className="dashboard-content">

        <Header />

        <div className="dashboard">

          {/* ================= TIMESHEET + STATS ================= */}

          <div className="stats-section">

            {/* Timesheet */}
            <div className="timesheet-card">

              <h3>Timesheet</h3>

              <p><strong>Punch In at:</strong> Today 9:00 AM</p>

              <div className="progress-circle">

                <svg>

                  <circle cx="40" cy="40" r="35" />

                  <circle
                    cx="40"
                    cy="40"
                    r="35"
                    style={{
                      strokeDashoffset: `${220 - (220 * todayPercentage / 100)}`
                    }}
                  />

                </svg>

                <div className="circle-text">
                  {dashboardData.statistics.today} hrs
                </div>

              </div>

              <button className="punch-btn">Punch Out</button>

              <div className="info">
                <span><strong>BREAK:</strong> 1hr</span>
              </div>

            </div>


            {/* Statistics */}
            <div className="statistics-card">

              <h3>Statistics</h3>

              <div className="bar-row">
                <span>Today</span>
                <div className="bar">
                  <div
                    style={{ width: `${todayPercentage}%` }}
                    className="fill green"
                  ></div>
                </div>
                <span>{dashboardData.statistics.today} / 9 hrs</span>
              </div>


              <div className="bar-row">
                <span>This Week</span>
                <div className="bar">
                  <div
                    style={{ width: `${weekPercentage}%` }}
                    className="fill orange"
                  ></div>
                </div>
                <span>{dashboardData.statistics.thisWeek} / 45 hrs</span>
              </div>


              <div className="bar-row">
                <span>This Month</span>
                <div className="bar">
                  <div
                    style={{ width: `${monthPercentage}%` }}
                    className="fill red"
                  ></div>
                </div>
                <span>{dashboardData.statistics.thisMonth} / 180 hrs</span>
              </div>


              <div className="bar-row">
                <span>Remaining</span>
                <div className="bar">
                  <div
                    style={{ width: `${100 - todayPercentage}%` }}
                    className="fill blue"
                  ></div>
                </div>
                <span>{dashboardData.statistics.remaining} hrs</span>
              </div>

            </div>

          </div>


          {/* ================= DASHBOARD OVERVIEW ================= */}

          <h2>Dashboard Overview</h2>

          <div className="overview">

            <div
              className="card-1"
              onClick={() => navigate("/Employees")}
              style={{ cursor: "pointer" }}
            >

              <FaUsers size={24} className="icon" />

              <div>
                <p>Total Employees</p>
                <h3>{dashboardData.totalEmployees}</h3>
              </div>

            </div>

          </div>


          {/* ================= LEAVE DETAILS ================= */}

          <h2>Leave Details</h2>

          <div className="leave-details">

            {/* Leave Applied */}
            <div
              className="card-4"
              onClick={() => navigate("/Leaves")}
              style={{ cursor: "pointer", position: "relative" }}
            >

              <FaFileAlt size={24} className="icon" />

              {leaveCount > 0 && (
                 <span className="notification-badge">{leaveCount}</span>
              )}

              <div>
                <p>Leave Applied</p>
                <h3>{dashboardData.leaveApplied}</h3>
              </div>

            </div>


            {/* Leave Approved */}
            <div
              className="card-5"
              onClick={() => navigate("/Leaves?status=Approved")}
              style={{ cursor: "pointer" }}
            >

              <FaCheckCircle size={24} className="icon" />

              <div>
                <p>Leave Approved</p>
                <h3>{dashboardData.leaveApproved}</h3>
              </div>

            </div>


            {/* Leave Rejected */}
            <div
              className="card-6"
              onClick={() => navigate("/Leaves?status=Rejected")}
              style={{ cursor: "pointer" }}
            >

              <FaTimesCircle size={24} className="icon" />

              <div>
                <p>Leave Rejected</p>
                <h3>{dashboardData.leaveRejected}</h3>
              </div>

            </div>


            {/* Leave Pending */}
            <div
              className="card-7"
              onClick={() => navigate("/Leaves?status=Pending")}
              style={{ cursor: "pointer" }}
            >

              <FaCalendarTimes size={24} className="icon" />

              <div>
                <p>Leave Pending</p>
                <h3>{dashboardData.leavePending}</h3>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

};

export default Dashboard;

