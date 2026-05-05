const { sql } = require("../config/db");

const UserModel = {

  // ================= CREATE =================
  async create(empId, name, email, password) {
    await sql.query`
      INSERT INTO users (emp_id, name, email, password)
      VALUES (${empId}, ${name}, ${email}, ${password})
    `;
  },


  // ================= GET BY ID =================
  async getById(id) {
    const result = await sql.query`
      SELECT * FROM users WHERE id = ${id}leaves 
    `;
    return result.recordset[0];
  },


  // ================= GET BY EMAIL =================
  async getByEmail(email) {
    const result = await sql.query`
      SELECT * FROM users WHERE email = ${email}
    `;
    return result.recordset[0];
  },


  // ================= UPDATE LAST LOGIN =================
  async updateLastLogin(id) {
    await sql.query`
      UPDATE users
      SET last_login = GETDATE()
      WHERE id = ${id}
    `;
  },


  // ================= UPDATE LEAVES =================
  async updateLeaves(id, daysTaken) {
    await sql.query`
      UPDATE users
      SET leaves_taken = ISNULL(leaves_taken,0) + ${daysTaken}
      WHERE id = ${id}
    `;
  },


  // ================= GET ALL USERS =================
  async getAll() {
    const result = await sql.query`
      SELECT
        id,
        emp_id,
        name,
        email,
        total_leaves,
        leaves_taken,
        last_login
      FROM users
      ORDER BY id DESC
    `;
    return result.recordset;
  },


  // ================= UPDATE LAST LEAVE SEEN TIME =================
  // This is used to track when the admin last viewed the leaves page
  // Only leaves applied after this time will be considered "new"
  async updateLastLeaveSeen(id) {
    await sql.query`
      UPDATE users
      SET last_leave_seen_at = GETDATE()
      WHERE id = ${id}
    `;
  },


  // ================= GET LAST LEAVE SEEN TIME =================
  async getLastLeaveSeen(id) {
    const result = await sql.query`
      SELECT last_leave_seen_at FROM users WHERE id = ${id}
    `;
    return result.recordset[0]?.last_leave_seen_at || null;
  }

};

module.exports = UserModel;
