const express = require("express");
const router = express.Router();

const { getDashboardData } = require("../controllers/dashboardController");

const {
  getLeaveStats,
  getLastLogin
} = require("../controllers/leaveDashboardController");

const leaveController = require("../controllers/leaveController");

const authMiddleware = require("../middleware/authMiddleware");


// ================= ADMIN DASHBOARD =================

// Dashboard overview (Total employees, leaves etc)
router.get("/overview", getDashboardData);

// Pending leave count for notification badge
router.get("/leave/pending-count", leaveController.getPendingLeaveCount);


// ================= EMPLOYEE DASHBOARD =================

// Get leave statistics
router.get("/leave-stats", authMiddleware, getLeaveStats);

// Get last login
router.get("/last-login", authMiddleware, getLastLogin);


// ================= ADMIN ACTION =================

// Update leave status
router.put("/:id/status", authMiddleware, leaveController.updateLeaveStatus);


module.exports = router;
