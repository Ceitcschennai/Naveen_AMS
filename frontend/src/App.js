// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "../src/Layout/Layout";
import { PopupProvider, PopupNotification } from "./PopupNotification";

import LoginPage from "./pages/LoginPage";
import AdminLoginpage from "./pages/AdminLoginpage";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import NewEmp from "./pages/NewEmp";
import RemoveEmp from "./pages/RemoveEmp";
import PermanentEmp from "./pages/PermanentEmp";
import ContractEmp from "./pages/ContractEmp";
import InternshipEmp from "./pages/InternshipEmp";
import Leaves from "./pages/Leaves";
import Attendance from "./pages/Attendance";
import AttendanceReport from "./pages/ReportOverview";
import Holidays from "./pages/Holidays";
import Workingdays from "./pages/Workingdays";
import IndividualReport from "./pages/IndividualReport";
import EmpDashboard from "./pages/EmpDashboard";
import Myprofile from "./pages/Myprofile";
import EmpWorkingdays from "./pages/EmpWorkingdays";
import EmpHolidays from "./pages/EmpHolidays";
import EmpLeaves from "./pages/EmpLeaves";
import AddLeaves from "./pages/AddLeaves";

const App = () => {
  return (
    <PopupProvider>
      <PopupNotification />
      <Router>
        <Routes>
          {/* Login pages without layout */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/AdminLoginpage" element={<AdminLoginpage />} />

          {/* All other routes inside layout */}
          <Route
            path="/*"
            element={
              <Layout>
                <Routes>
                  <Route path="/Dashboard" element={<Dashboard />} />
                  <Route path="/Employees" element={<Employees />} />
                  <Route path="/NewEmp" element={<NewEmp />} />
                  <Route path="/RemoveEmp" element={<RemoveEmp />} />
                  <Route path="/PermanentEmp" element={<PermanentEmp />} />
                  <Route path="/ContractEmp" element={<ContractEmp />} />
                  <Route path="/InternshipEmp" element={<InternshipEmp />} />
                  <Route path="/Leaves" element={<Leaves />} />
                  <Route path="/Attendance" element={<Attendance />} />
                  <Route path="/AttendanceReport" element={<AttendanceReport />} />
                  <Route path="/Holidays" element={<Holidays />} />
                  <Route path="/Workingdays" element={<Workingdays />} />
                  <Route path="/IndividualReport" element={<IndividualReport />} />
                  <Route path="/EmpDashboard" element={<EmpDashboard />} />
                  <Route path="/Myprofile" element={<Myprofile />} />
                  <Route path="/EmpWorkingdays" element={<EmpWorkingdays />} />
                  <Route path="/EmpHolidays" element={<EmpHolidays />} />
                  <Route path="/EmpLeaves" element={<EmpLeaves />} />
                  <Route path="/AddLeaves" element={<AddLeaves />} />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </Router>
    </PopupProvider>
  );
};

export default App;
