import React from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import EmpSidebar from "../components/EmpSidebar";
import "../styles/Layout.css";

const Layout = ({ children }) => {
  const location = useLocation();

  const isAdmin = location.pathname.startsWith("/admin");
  const isEmployee = location.pathname.startsWith("/employee");

  return (
    <div className="layout-container">
      <Header />
      <div className="layout-main">
        {isAdmin && <Sidebar />}
        {isEmployee && <EmpSidebar />}
        <div className="layout-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
