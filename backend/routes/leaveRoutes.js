const express = require("express");
const router = express.Router();

const { sql } = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");


// ================= APPLY LEAVE =================
router.post("/", authMiddleware, async (req, res) => {
  try {

    const { type, from, to, durationType, hours = 0, duration } = req.body;

    if (!type || !from || !to || !durationType || !duration) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Get employee using logged-in user email
    const empResult = await sql.query`
      SELECT * FROM employees WHERE email = ${req.user.email}
    `;

    if (empResult.recordset.length === 0) {
      return res.status(404).json({ message: "Employee not found." });
    }

    const employee = empResult.recordset[0];

    await sql.query`
      INSERT INTO employee_leaves
      (
        emp_id,
        name,
        email,
        status,
        type,
        from_date,
        to_date,
        duration_type,
        hours,
        duration,
        applied_date
      )
      VALUES
      (
        ${employee.emp_id},
        ${employee.name},
        ${req.user.email},
        'Pending',
        ${type},
        ${from},
        ${to},
        ${durationType},
        ${Number(hours)},
        ${Number(duration)},
        GETDATE()
      )
    `;

    res.status(201).json({ message: "Leave request submitted successfully." });

  } catch (err) {
    console.error("Leave submission error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// ================= GET ALL LEAVES (ADMIN) =================
router.get("/", authMiddleware, async (req, res) => {
  try {

    const result = await sql.query`
      SELECT
        id,
        emp_id,
        name,
        email,
        status,
        type,
        from_date AS [from],
        to_date AS [to],
        duration_type,
        hours,
        duration,
        applied_date
      FROM employee_leaves
      ORDER BY applied_date DESC
    `;

    res.status(200).json(result.recordset);

  } catch (err) {
    console.error("Fetch leave error:", err);
    res.status(500).json({ message: "Error fetching leave requests" });
  }
});


// ================= UPDATE STATUS =================
router.put("/:id/status", authMiddleware, async (req, res) => {
  try {

    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required." });
    }

    // Check if leave exists and if it's completed (to_date has passed)
    const leaveCheck = await sql.query`
      SELECT to_date FROM employee_leaves WHERE id = ${req.params.id}
    `;

    if (leaveCheck.recordset.length === 0) {
      return res.status(404).json({ message: "Leave not found." });
    }

    const toDate = leaveCheck.recordset[0].to_date;
    
    // Check if the leave is completed (to_date is in the past)
    if (toDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const leaveToDate = new Date(toDate);
      leaveToDate.setHours(0, 0, 0, 0);
      
      if (today > leaveToDate) {
        return res.status(403).json({ message: "Cannot update status. Leave period has ended." });
      }
    }

    const result = await sql.query`
      UPDATE employee_leaves
      SET status = ${status}
      WHERE id = ${req.params.id}
    `;

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "Leave not found." });
    }

    res.status(200).json({ message: "Leave status updated successfully." });

  } catch (err) {
    console.error("Update status error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// ================= GET LOGGED-IN EMPLOYEE LEAVES =================
router.get("/employee", authMiddleware, async (req, res) => {
  try {

    const empResult = await sql.query`
      SELECT * FROM employees WHERE email = ${req.user.email}
    `;

    if (empResult.recordset.length === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const employee = empResult.recordset[0];

    const leaveResult = await sql.query`
      SELECT
        id,
        emp_id,
        name,
        email,
        status,
        type,
        from_date AS [from],
        to_date AS [to],
        duration_type,
        hours,
        duration,
        applied_date
      FROM employee_leaves
      WHERE emp_id = ${employee.emp_id}
      ORDER BY applied_date DESC
    `;

    res.status(200).json(leaveResult.recordset);

  } catch (err) {
    console.error("Employee leaves error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// ================= GET NEW LEAVES (Applied after last seen) =================
router.get("/new", authMiddleware, async (req, res) => {
  try {
    // Get the admin's last leave seen time from users table
    const userResult = await sql.query`
      SELECT last_leave_seen_at FROM users WHERE email = ${req.user.email}
    `;

    if (userResult.recordset.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const lastLeaveSeenAt = userResult.recordset[0].last_leave_seen_at;

    // If never seen before (NULL), return all pending leaves
    // Otherwise, return only leaves where applied_date > last_leave_seen_at
    let result;

    if (!lastLeaveSeenAt) {
      // First time - show all pending leaves as new
      result = await sql.query`
        SELECT
          id,
          emp_id,
          name,
          email,
          status,
          type,
          from_date AS [from],
          to_date AS [to],
          duration_type,
          hours,
          duration,
          applied_date
        FROM employee_leaves
        WHERE status = 'Pending'
        ORDER BY applied_date DESC
      `;
    } else {
      // Return leaves applied after last seen time
      result = await sql.query`
        SELECT
          id,
          emp_id,
          name,
          email,
          status,
          type,
          from_date AS [from],
          to_date AS [to],
          duration_type,
          hours,
          duration,
          applied_date
        FROM employee_leaves
        WHERE status = 'Pending'
          AND applied_date > ${lastLeaveSeenAt}
        ORDER BY applied_date DESC
      `;
    }

    res.status(200).json({
      count: result.recordset.length,
      leaves: result.recordset,
      lastLeaveSeenAt: lastLeaveSeenAt
    });

  } catch (err) {
    console.error("Fetch new leaves error:", err);
    res.status(500).json({ message: "Error fetching new leaves" });
  }
});


// ================= UPDATE LAST SEEN (Mark leaves as seen) =================
router.put("/update-last-seen", authMiddleware, async (req, res) => {
  try {
    // Update the admin's last leave seen time to current time
    await sql.query`
      UPDATE users
      SET last_leave_seen_at = GETDATE()
      WHERE email = ${req.user.email}
    `;

    res.status(200).json({ 
      message: "Last seen time updated successfully",
      lastLeaveSeenAt: new Date()
    });

  } catch (err) {
    console.error("Update last seen error:", err);
    res.status(500).json({ message: "Error updating last seen time" });
  }
});


module.exports = router;
