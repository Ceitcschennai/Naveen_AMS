// server.js

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const { connectDB } = require("./config/db");

// ================= IMPORT ROUTES =================
const authRoutes = require("./routes/authRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const leaveRoutes = require("./routes/leaveRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const empDashboardRoutes = require("./routes/empDashboardRoutes");
const holidayRoutes = require("./routes/holidayRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");

// Load env variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// ================= DATABASE =================
connectDB();


// ================= API ROUTES =================

// Auth Routes
app.use("/api/auth", authRoutes);

// Employee Routes
app.use("/api/employees", employeeRoutes);

// Leave Routes
app.use("/api/leaves", leaveRoutes);

// Admin Dashboard
app.use("/api/dashboard", dashboardRoutes);

// Employee Dashboard
app.use("/api/emp-dashboard", empDashboardRoutes);

// Holiday Routes
app.use("/api/holidays", holidayRoutes);

// Attendance Routes
app.use("/api/attendance", attendanceRoutes);


// ================= TEST ROUTE =================
app.get("/", (req, res) => {
  res.send("Attendance API is running...");
});


// ================= START SERVER =================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});