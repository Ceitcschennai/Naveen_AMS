const express = require("express");
const router = express.Router();
const { sql } = require("../config/db");

// ✅ Get today attendance
router.get("/", async (req, res) => {
  try {
    const result = await sql.query`
      SELECT * FROM attendance
      WHERE date = CAST(GETDATE() AS DATE)
      ORDER BY id DESC
    `;
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ message: "Error fetching attendance" });
  }
});

// ✅ Scan / Insert / Update
router.post("/scan", async (req, res) => {
  try {
    const { employeeId } = req.body;

    const today = new Date();
    const dateStr = today.toISOString().split("T")[0];
    const timeStr = today.toTimeString().split(" ")[0].slice(0, 5);

    // Check if already exists today
    const existing = await sql.query`
      SELECT * FROM attendance
      WHERE employee_id = ${employeeId}
      AND date = ${dateStr}
    `;

    if (existing.recordset.length > 0) {
      // Update outTime
      await sql.query`
        UPDATE attendance
        SET out_time = ${timeStr}
        WHERE employee_id = ${employeeId}
        AND date = ${dateStr}
      `;
    } else {
      // Get employee details
      const emp = await sql.query`
        SELECT name, type FROM employees
        WHERE emp_id = ${employeeId}
      `;

      if (emp.recordset.length === 0) {
        return res.status(404).json({ message: "Employee not found" });
      }

      await sql.query`
        INSERT INTO attendance
        (employee_id, name, employee_type, date, in_time)
        VALUES
        (${employeeId},
         ${emp.recordset[0].name},
         ${emp.recordset[0].type},
         ${dateStr},
         ${timeStr})
      `;
    }

    res.json({ message: "Attendance updated" });

  } catch (err) {
    res.status(500).json({ message: "Scan error" });
  }
});

module.exports = router;
