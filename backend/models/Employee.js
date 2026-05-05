const { sql } = require("../config/db");

// CREATE EMPLOYEE
exports.create = async (emp) => {

  await sql.query`
    INSERT INTO employees
    (emp_id, name, email, gender, department, place, country, type, role, image)
    VALUES
    (
      ${emp.employeeId},
      ${emp.name},
      ${emp.email},
      ${emp.gender},
      ${emp.department},
      ${emp.place},
      ${emp.country},
      ${emp.type},
      ${emp.role},
      ${emp.image}
    )
  `;

};


// GET ALL
exports.getAll = async () => {

  const result = await sql.query`
    SELECT * FROM employees
    ORDER BY id DESC
  `;

  return result.recordset;

};


// FILTER BY TYPE
exports.getByType = async (type) => {

  const result = await sql.query`
    SELECT * FROM employees
    WHERE type LIKE ${"%" + type + "%"}
  `;

  return result.recordset;

};


// UPDATE
exports.updateById = async (id, emp) => {

  await sql.query`
    UPDATE employees SET
      emp_id=${emp.employeeId},
      name=${emp.name},
      email=${emp.email},
      gender=${emp.gender},
      department=${emp.department},
      place=${emp.place},
      country=${emp.country},
      type=${emp.type},
      role=${emp.role},
      image=${emp.image}
    WHERE id=${id}
  `;

};


// DELETE
exports.deleteByEmployeeId = async (employeeId) => {

  await sql.query`
    DELETE FROM employees
    WHERE emp_id=${employeeId}
  `;

};
