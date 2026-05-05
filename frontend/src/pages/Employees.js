import React from 'react';
import { useNavigate } from "react-router-dom";
import { FaUserPlus, FaUserMinus } from "react-icons/fa";
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import '../styles/Employees.css';

function Dashboard() {
  const navigate = useNavigate();
  return (
    <div className="Emp-dashboard-container">
      {/* Import and use the Header component */}
      <Header />

      <div className="Emp-dashboard-content">
        {/* Import and use the Sidebar component */}
        <Sidebar />

        <div className='Emp-container'>
          <div className="container-emp">
            <div className="box" onClick={() => navigate("/PermanentEmp")} style={{ cursor: "pointer" }}>Permanent Employee</div>
            <div className="box" onClick={() => navigate("/ContractEmp")} style={{ cursor: "pointer" }}>Contract Employee</div>
            <div className="box"onClick={() => navigate("/InternshipEmp")} style={{ cursor: "pointer" }}>Internship Employee </div>
          </div>

          <div className="bottom-right-container">
            <div className="bottom-right-box" onClick={() => navigate("/NewEmp")} style={{ cursor: "pointer" }}>
              <FaUserPlus size={18} style={{ marginRight: "5px", color: "green" }} />New Emp </div>
            <div className="bottom-right-box" onClick={() => navigate("/RemoveEmp")} style={{ cursor: "pointer" }}>
              <FaUserMinus size={18} style={{ marginRight: "5px", color: "green" }} />Remove Emp</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
