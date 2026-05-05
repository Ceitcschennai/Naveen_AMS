import React, { useEffect, useState } from "react";
import axios from "axios";

import "../styles/Myprofile.css";
import EmpHeader from "../components/EmpHeader";
import EmpSidebar from "../components/EmpSidebar";
import { useNavigate } from "react-router-dom";
import { usePopup } from "../PopupNotification";


const EmployeeCard = () => {

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { showPopup } = usePopup();



  useEffect(() => {

    const fetchProfile = async () => {

      const token = localStorage.getItem("token");

      if (!token) {
        showPopup("Session expired.");
        navigate("/login");
        return;
      }

      try {

        const response = await axios.get(
          "http://localhost:5000/api/auth/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setEmployee(response.data);

      } catch (error) {

        console.error("Failed to fetch profile:", error);

        localStorage.removeItem("token");

        navigate("/login");

      } finally {

        setLoading(false);

      }

    };

    fetchProfile();

  }, [navigate]); // eslint-disable-line react-hooks/exhaustive-deps




  if (loading) return <p>Loading...</p>;

  if (!employee) return <p>No profile data.</p>;


  const profilePicUrl = employee.image
    ? `http://localhost:5000/uploads/${employee.image}`
    : "/default-profile.png";


  return (

    <div className="EmpMyprofile-container">

      <EmpSidebar />

      <div className="EmpMyprofile-content">

        <EmpHeader />

        <div className="profile-card-container">

          <div className="profile-card">

            <div className="profile-image">

              <img
                src={profilePicUrl}
                alt="Employee"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/default-profile.png";
                }}
              />

            </div>

            <div className="details">

              <h2>My Profile</h2>

              <p><strong>Name:</strong> {employee.name}</p>

              <p><strong>Employee ID:</strong> {employee.empId}</p>

              <p><strong>Email:</strong> {employee.email}</p>

              <p><strong>Gender:</strong> {employee.gender}</p>

              <p><strong>Department:</strong> {employee.department}</p>

              <p><strong>Role:</strong> {employee.role}</p>

              <p><strong>Place:</strong> {employee.place}</p>

              <p><strong>Country:</strong> {employee.country}</p>



            </div>

          </div>

        </div>

      </div>



    </div>

  );

};

export default EmployeeCard;
