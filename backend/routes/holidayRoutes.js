const express = require("express");
const router = express.Router();

const { getHolidays } = require("../controllers/holidayController");
const authMiddleware = require("../middleware/authMiddleware");

// Get Holidays (Protected)
router.get("/", getHolidays);

module.exports = router;