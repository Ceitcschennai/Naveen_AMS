const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  getProfile,
  updateEmail,
  updatePassword
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/signup", signup);
router.post("/login", login);

router.get("/profile", authMiddleware, getProfile);

// NEW ROUTES
router.put("/update-email", authMiddleware, updateEmail);
router.put("/update-password", authMiddleware, updatePassword);

module.exports = router;