const { sql } = require("../config/db");

// ================= LEAVE STATS =================
exports.getLeaveStats = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized user" });
    const userResult = await sql.query`
      SELECT total_leaves, emp_id FROM users WHERE id = ${userId}
    `;
    if (userResult.recordset.length === 0) return res.status(404).json({ message: "User not found" });
    const totalLeaves = userResult.recordset[0].total_leaves || 0;
    const empId = userResult.recordset[0].emp_id;
    const leavesResult = await sql.query`
      SELECT ISNULL(SUM(
        CASE
          WHEN duration_type = 'Half Day' THEN 0.5
          WHEN duration_type = 'Hourly' THEN ISNULL(hours, 0) / 8.0
          ELSE ISNULL(duration, 0)
        END
      ), 0) AS leaves_taken
      FROM employee_leaves
      WHERE emp_id = ${empId}
      AND status = 'Approved'
    `;
    const leavesTaken = leavesResult.recordset[0].leaves_taken || 0;
    res.json({ totalLeaves, leavesTaken, remainingLeaves: Math.max(0, totalLeaves - leavesTaken) });
  } catch (err) {
    console.error("Leave stats error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= LAST LOGIN =================
exports.getLastLogin = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized user" });
    const result = await sql.query`
      SELECT last_login FROM users WHERE id = ${userId}
    `;
    if (result.recordset.length === 0) return res.status(404).json({ message: "User not found" });
    res.json({ lastLogin: result.recordset[0].last_login || null });
  } catch (err) {
    console.error("Last login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
