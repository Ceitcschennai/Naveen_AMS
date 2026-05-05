const { sql } = require("../config/db");

const LeaveModel = {

  // ================= CREATE =================
  async create(leave) {

    const {
      empId,
      name,
      email,
      type,
      from,
      to,
      durationType,
      hours,
      duration
    } = leave;

    await sql.query`
      INSERT INTO employee_leaves
      (emp_id, name, email, type, from_date, to_date, duration_type, hours, duration)
      VALUES
      (
        ${empId},
        ${name},
        ${email},
        ${type},
        ${from},
        ${to},
        ${durationType},
        ${hours || 0},
        ${duration}
      )
    `;
  },


  // ================= GET ALL =================
  async getAll() {
    const result = await sql.query`
      SELECT * FROM employee_leaves ORDER BY applied_date DESC
    `;
    return result.recordset;
  },


  // ================= GET BY ID =================
  async getById(id) {
    const result = await sql.query`
      SELECT * FROM employee_leaves WHERE id = ${id}
    `;
    return result.recordset[0];
  },


  // ================= UPDATE STATUS =================
  async updateStatus(id, status) {
    await sql.query`
      UPDATE employee_leaves
      SET status = ${status}
      WHERE id = ${id}
    `;
  },


  // ================= GET BY EMAIL =================
  async getByEmail(email) {
    const result = await sql.query`
      SELECT * FROM employee_leaves WHERE email = ${email}
      ORDER BY applied_date DESC
    `;
    return result.recordset;
  }

};

module.exports = LeaveModel;
