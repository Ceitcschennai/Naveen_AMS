const { sql } = require("../config/db");

exports.getDashboardData = async (req, res) => {

  try {

    // Total Employees
    const empResult = await sql.query`
      SELECT COUNT(*) AS totalEmployees FROM employees
    `;

    // Total Roles
    const roleResult = await sql.query`
      SELECT COUNT(*) AS totalRoles FROM roles
    `;

    // Leave Counts (from employee_leaves table)
    const leaveAppliedResult = await sql.query`
      SELECT COUNT(*) AS leaveApplied FROM employee_leaves
    `;

    const leaveApprovedResult = await sql.query`
      SELECT COUNT(*) AS leaveApproved
      FROM employee_leaves
      WHERE status = 'Approved'
    `;

    const leaveRejectedResult = await sql.query`
      SELECT COUNT(*) AS leaveRejected
      FROM employee_leaves
      WHERE status = 'Rejected'
    `;

    const leavePendingResult = await sql.query`
      SELECT COUNT(*) AS leavePending
      FROM employee_leaves
      WHERE status = 'Pending'
    `;

    res.json({
      totalEmployees: empResult.recordset[0].totalEmployees,
      totalRoles: roleResult.recordset[0].totalRoles,
      leaveApplied: leaveAppliedResult.recordset[0].leaveApplied,
      leaveApproved: leaveApprovedResult.recordset[0].leaveApproved,
      leaveRejected: leaveRejectedResult.recordset[0].leaveRejected,
      leavePending: leavePendingResult.recordset[0].leavePending,
      statistics: {
        today: 0,
        thisWeek: 0,
        thisMonth: 0,
        remaining: 0
      }
    });

  } catch (error) {

    console.error("Dashboard Error:", error);

    res.status(500).json({
      message: "Failed to load dashboard data"
    });

  }

};
