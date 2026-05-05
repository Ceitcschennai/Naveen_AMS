const { sql } = require("../config/db");


// ================= PENDING LEAVE COUNT =================
exports.getPendingLeaveCount = async (req, res) => {
  try {
    const result = await sql.query`
      SELECT COUNT(*) AS count
      FROM employee_leaves
      WHERE status = 'Pending'
    `;

    res.json({
      count: result.recordset[0].count || 0
    });
  } catch (err) {
    console.error("Pending leave count error:", err);
    res.status(500).json({
      message: "Failed to fetch pending leave count"
    });
  }
};


// ================= UPDATE LEAVE STATUS =================


exports.updateLeaveStatus = async (req, res) => {
  try {

    const id = Number(req.params.id);
    const { status } = req.body;

    // Validate ID
    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid leave ID" });
    }

    // Validate status
    const validStatus = ["Approved", "Rejected", "Pending"];
    if (!status || !validStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // Get leave
    const leaveResult = await sql.query`
      SELECT * FROM employee_leaves WHERE id = ${id}
    `;

    if (leaveResult.recordset.length === 0) {
      return res.status(404).json({ message: "Leave not found" });
    }

    const leave = leaveResult.recordset[0];

    // Prevent duplicate approval
    if (leave.status === "Approved" && status === "Approved") {
      return res.status(400).json({ message: "Leave already approved" });
    }

    // Update leave status
    await sql.query`
      UPDATE employee_leaves
      SET status = ${status}
      WHERE id = ${id}
    `;

    // If approved → update leave balance
    if (status === "Approved") {

      const userResult = await sql.query`
        SELECT id, leaves_taken FROM users WHERE emp_id = ${leave.emp_id}
      `;

      if (userResult.recordset.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const user = userResult.recordset[0];

      let daysTaken = 0;

      if (leave.duration_type === "Half Day") {
        daysTaken = 0.5;
      }
      else if (leave.duration_type === "Hourly") {
        daysTaken = (leave.hours || 0) / 8;
      }
      else {
        daysTaken = leave.duration || 0;
      }

      await sql.query`
        UPDATE users
        SET leaves_taken = leaves_taken + ${daysTaken}
        WHERE id = ${user.id}
      `;
    }

    res.status(200).json({
      message: "Leave status updated successfully",
      leaveId: id,
      status: status
    });

  } catch (error) {
    console.error("Leave update error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
