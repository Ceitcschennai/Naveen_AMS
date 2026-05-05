const jwt = require("jsonwebtoken");
const { sql } = require("../config/db");

const authMiddleware = async (req, res, next) => {

  const authHeader = req.headers.authorization;

  // 🔥 If no token → Allow default admin access
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    req.user = {
      id: 0,
      name: "Admin",
      email: "admin@gmail.com",
      totalLeaves: 0,
      leavesTaken: 0
    };
    return next();
  }

  try {
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const result = await sql.query`
      SELECT id, name, email, total_leaves, leaves_taken
      FROM users
      WHERE id = ${decoded.id}
    `;

    if (result.recordset.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = result.recordset[0];

    next();

  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(403).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
