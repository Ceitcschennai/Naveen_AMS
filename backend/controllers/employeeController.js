const { sql } = require("../config/db");


// ================= GET ALL =================
exports.getEmployees = async (req, res) => {
  try {

    const result = await sql.query`
      SELECT
        id,
        emp_id,
        name,
        email,
        gender,
        department,
        place,
        country,
        type,
        role,
        image
      FROM employees
      ORDER BY id DESC
    `;

    res.json(result.recordset);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};


// ================= GET ONE =================
exports.getEmployee = async (req, res) => {
  try {

    const result = await sql.query`
      SELECT
        id,
        emp_id,
        name,
        email,
        gender,
        department,
        place,
        country,
        type,
        role,
        image
      FROM employees
      WHERE id = ${req.params.id}
    `;

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(result.recordset[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};


// ================= CREATE =================
exports.createEmployee = async (req, res) => {
  try {

    const {
      empId,
      name,
      email,
      gender,
      department,
      place,
      country,
      type,
      role,
      image,
    } = req.body;

    await sql.query`
      INSERT INTO employees
      (emp_id, name, email, gender, department, place, country, type, role, image)
      VALUES
      (${empId}, ${name}, ${email}, ${gender}, ${department},
       ${place}, ${country}, ${type}, ${role}, ${image})
    `;

    res.json({ message: "Employee Added Successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};


// ================= UPDATE =================
exports.updateEmployee = async (req, res) => {
  try {

    const {
      empId,
      name,
      email,
      gender,
      department,
      place,
      country,
      type,
      role,
      image,
    } = req.body;

    await sql.query`
      UPDATE employees SET
        emp_id = ${empId},
        name = ${name},
        email = ${email},
        gender = ${gender},
        department = ${department},
        place = ${place},
        country = ${country},
        type = ${type},
        role = ${role},
        image = ${image}
      WHERE id = ${req.params.id}
    `;

    res.json({ message: "Employee Updated Successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};


// ================= DELETE =================
exports.deleteEmployee = async (req, res) => {
  try {

    await sql.query`
      DELETE FROM employees WHERE id = ${req.params.id}
    `;

    res.json({ message: "Employee Deleted Successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
