const { sql } = require("../config/db");

const RoleModel = {

  // ================= CREATE =================
  async create(name) {
    await sql.query`
      INSERT INTO roles (name)
      VALUES (${name})
    `;
  },


  // ================= GET ALL =================
  async getAll() {
    const result = await sql.query`
      SELECT * FROM roles ORDER BY id DESC
    `;
    return result.recordset;
  },


  // ================= GET BY ID =================
  async getById(id) {
    const result = await sql.query`
      SELECT * FROM roles WHERE id = ${id}
    `;
    return result.recordset[0];
  },


  // ================= UPDATE =================
  async update(id, name) {
    await sql.query`
      UPDATE roles
      SET name = ${name}
      WHERE id = ${id}
    `;
  },


  // ================= DELETE =================
  async remove(id) {
    await sql.query`
      DELETE FROM roles WHERE id = ${id}
    `;
  }

};

module.exports = RoleModel;
