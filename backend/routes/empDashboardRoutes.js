const express = require("express");
const router = express.Router();

const {
  getLeaveStats,
  getLastLogin,
} = require("../controllers/leaveDashboardController");

const leaveController = require("../controllers/leaveController");

const authMiddleware = require("../middleware/authMiddleware");


// ================= EMPLOYEE DASHBOARD ROUTES =================

// Get leave statistics
router.get("/leave-stats", authMiddleware, getLeaveStats);

// Get last login
router.get("/last-login", authMiddleware, getLastLogin);

// Update leave status (Admin/HR)
router.put("/:id/status", authMiddleware, leaveController.updateLeaveStatus);

module.exports = router;