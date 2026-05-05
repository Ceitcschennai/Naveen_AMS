const { sql } = require("../config/db");


// ================= LEAVE STATS =================
exports.getLeaveStats = async (req, res) => {
  try {

    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    const result = await sql.query`
      SELECT total_leaves, leaves_taken
      FROM users
      WHERE id = ${userId}
    `;

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result.recordset[0];

    const totalLeaves = user.total_leaves || 0;
    const leavesTaken = user.leaves_taken || 0;
    const remaining = totalLeaves - leavesTaken;

    res.json({
      totalLeaves,
      leavesTaken,
      remainingLeaves: remaining < 0 ? 0 : remaining,
    });

  } catch (err) {
    console.error("Leave stats error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// ================= LAST LOGIN =================
exports.getLastLogin = async (req, res) => {
  try {

    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    const result = await sql.query`
      SELECT last_login
      FROM users
      WHERE id = ${userId}
    `;

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      lastLogin: result.recordset[0].last_login || null
    });

  } catch (err) {
    console.error("Last login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
