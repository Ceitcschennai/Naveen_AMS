const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/authMiddleware");
const { sql } = require("../config/db");


// ================= ADD EMPLOYEE =================
router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
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
      } = req.body;

      const image = req.file ? req.file.filename : null;

      await sql.query`
        INSERT INTO employees
        (emp_id, name, email, gender, department, place, country, type, role, image)
        VALUES
        (${empId}, ${name}, ${email}, ${gender}, ${department},
         ${place}, ${country}, ${type}, ${role}, ${image})
      `;

      res.status(201).json({ message: "Employee added successfully" });

    } catch (error) {

      if (error.number === 2627) {
        return res.status(400).json({ message: "Employee ID must be unique" });
      }

      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  }
);


// ================= GET ALL =================
router.get("/", authMiddleware, async (req, res) => {
  try {

    const result = await sql.query`
      SELECT * FROM employees
    `;

    res.json(result.recordset);

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});


// ================= FILTER =================
router.get("/permanent", authMiddleware, async (req, res) => {
  try {

    const result = await sql.query`
      SELECT * FROM employees WHERE type = 'Permanent'
    `;

    res.json(result.recordset);

  } catch {
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/contract", authMiddleware, async (req, res) => {
  try {

    const result = await sql.query`
      SELECT * FROM employees WHERE type = 'Contract'
    `;

    res.json(result.recordset);

  } catch {
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/internship", authMiddleware, async (req, res) => {
  try {

    const result = await sql.query`
      SELECT * FROM employees WHERE type = 'Internship'
    `;

    res.json(result.recordset);

  } catch {
    res.status(500).json({ message: "Server Error" });
  }
});


// ================= UPDATE =================
router.put(
  "/:id",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
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
      } = req.body;

      const image = req.file ? req.file.filename : null;

      // If new image uploaded
      if (image) {

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

      } 
      else {

        // Update without changing image
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
            role = ${role}
          WHERE id = ${req.params.id}
        `;

      }

      res.json({ message: "Employee updated successfully" });

    } catch (error) {

      console.error(error);
      res.status(500).json({ message: "Server Error" });

    }
  }
);


// ================= DELETE =================
router.delete(
  "/by-employee-id/:empId",
  authMiddleware,
  async (req, res) => {
    try {

      const empId = req.params.empId;

      // Check employee exists
      const result = await sql.query`
        SELECT * FROM employees WHERE emp_id = ${empId}
      `;

      if (result.recordset.length === 0) {
        return res.status(404).json({
          message: "Employee not found"
        });
      }

      const employee = result.recordset[0];

      // Delete employee
      await sql.query`
        DELETE FROM employees WHERE emp_id = ${empId}
      `;

      // Delete user login also
      await sql.query`
        DELETE FROM users WHERE email = ${employee.email}
      `;

      res.json({
        message: "Employee removed successfully"
      });

    } catch (error) {

      console.error(error);
      res.status(500).json({ message: "Server Error" });

    }
  }
);

module.exports = router;
