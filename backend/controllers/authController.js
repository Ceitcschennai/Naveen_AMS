const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sql } = require("../config/db");

// Password validation regex:
// - 8-16 characters long
// - At least one uppercase letter (A-Z)
// - At least one lowercase letter (a-z)
// - At least one number (0-9)
// - At least one special character (!@#$%^&*)
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;

/**
 * Validates password against security requirements
 * @param {string} password - The password to validate
 * @returns {boolean} - True if valid, false otherwise
 */
const validatePassword = (password) => {
  if (!password) return false;
  return PASSWORD_REGEX.test(password);
};


// ================= SIGNUP =================
exports.signup = async (req, res) => {

  const { name, email, password } = req.body;

  // Validate password strength
  if (!validatePassword(password)) {
    return res.status(400).json({
      message: "Password must be 8-16 characters: include uppercase (A-Z), lowercase (a-z), number (0-9), and special character (@$!%*?&)."
    });
  }

  try {

    // 🔎 Check employee using email
    const empCheck = await sql.query`
      SELECT emp_id, name, email
      FROM employees
      WHERE LOWER(email) = LOWER(${email})
    `;

    // If email not found, check by name
    if (empCheck.recordset.length === 0) {
      const nameCheck = await sql.query`
        SELECT emp_id, name, email
        FROM employees
        WHERE LOWER(LTRIM(RTRIM(name))) = LOWER(LTRIM(RTRIM(${name})))
      `;

      if (nameCheck.recordset.length > 0) {
        return res.status(400).json({
          message: `Email not found. Your employee email is: ${nameCheck.recordset[0].email}`
        });
      }

      return res.status(400).json({
        message: "Employee not found. Contact admin to add you in employee records."
      });
    }

    const employee = empCheck.recordset[0];

    // 🔴 Check if name matches employees table
    if (employee.name.trim().toLowerCase() !== name.trim().toLowerCase()) {
      return res.status(400).json({
        message: `Name does not match. Expected: "${employee.name}"`
      });
    }

    // 🔎 Check if user already registered
    const userCheck = await sql.query`
      SELECT * FROM users WHERE LOWER(email) = LOWER(${email})
    `;

    if (userCheck.recordset.length > 0) {
      return res.status(400).json({
        message: "User already registered"
      });
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Insert user using employee table name
    await sql.query`
      INSERT INTO users (emp_id, name, email, password)
      VALUES (${employee.emp_id}, ${employee.name}, ${employee.email}, ${hashedPassword})
    `;

    res.status(201).json({
      message: "Signup successful. Please login."
    });

  } catch (err) {

    console.error("Signup error:", err);

    res.status(500).json({
      message: "Signup failed"
    });

  }

};


// ================= LOGIN =================
exports.login = async (req, res) => {

  const { email, password } = req.body;

  try {

    // Admin login
    if (email === "admin@gmail.com" && password === "p123") {

      const token = jwt.sign(
        { id: 0, role: "admin", email: "admin@gmail.com" },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      return res.json({ token });

    }

    // STEP 1: Check if email exists in users OR employees table
    const userResult = await sql.query`
      SELECT id, emp_id, name, email, password
      FROM users
      WHERE LOWER(email) = LOWER(${email})
    `;

    const empResult = await sql.query`
      SELECT emp_id, name, email
      FROM employees
      WHERE LOWER(email) = LOWER(${email})
    `;

    const emailInUsers = userResult.recordset.length > 0;
    const emailInEmployees = empResult.recordset.length > 0;

    // CASE 3: Email NOT found in both tables (both wrong)
    if (!emailInUsers && !emailInEmployees) {
      return res.status(400).json({
        message: "Account not found. Please sign up first."
      });
    }

    // CASE 2: Email found in employees but NOT in users (not registered as user)
    if (!emailInUsers && emailInEmployees) {
      return res.status(400).json({
        message: "Invalid email. Please sign up first."
      });
    }

    // Email found in users - now check password
    const user = userResult.recordset[0];
    const isMatch = await bcrypt.compare(password, user.password);

    // CASE 1: Email exists but password is incorrect
    if (!isMatch) {
      return res.status(400).json({
        message: "Incorrect password"
      });
    }

    // CASE 4: Email and password both correct - Login success
    const token = jwt.sign(
      {
        id: user.id,
        empId: user.emp_id,
        name: user.name,
        email: user.email,
        role: "employee"
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({ token });

  } catch (err) {

    console.error("Login error:", err);

    res.status(500).json({
      message: "Server error"
    });

  }

};


// ================= PROFILE =================
exports.getProfile = async (req, res) => {

  try {

    // Admin profile
    if (req.user.id === 0) {
      return res.json({
        id: 0,
        empId: "ADMIN",
        name: "Admin",
        email: "admin@gmail.com"
      });
    }

    const result = await sql.query`
      SELECT
        U.id,
        U.emp_id,
        U.name,
        U.email,
        E.gender,
        E.department,
        E.role,
        E.place,
        E.country,
        E.image
      FROM users U
      LEFT JOIN employees E
      ON U.emp_id = E.emp_id
      WHERE U.id = ${req.user.id}
    `;

    if (result.recordset.length === 0) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const user = result.recordset[0];

    res.json({
      id: user.id,
      empId: user.emp_id,
      name: user.name,
      email: user.email,
      gender: user.gender,
      department: user.department,
      role: user.role,
      place: user.place,
      country: user.country,
      image: user.image
    });

  } catch (err) {

    console.error("Profile error:", err);

    res.status(500).json({
      message: "Server error"
    });

  }

};
// ================= UPDATE EMAIL =================
exports.updateEmail = async (req, res) => {

  const { email } = req.body;

  try {

    // update users table
    await sql.query`
      UPDATE users
      SET email = ${email}
      WHERE id = ${req.user.id}
    `;

    // update employees table
    await sql.query`
      UPDATE employees
      SET email = ${email}
      WHERE emp_id = ${req.user.empId}
    `;

    res.json({
      message: "Email updated successfully"
    });

  } catch (err) {

    console.error("Email update error:", err);

    res.status(500).json({
      message: "Failed to update email"
    });

  }

};



// ================= UPDATE PASSWORD =================
exports.updatePassword = async (req, res) => {

  const { currentPassword, newPassword } = req.body;

  // Validate new password strength
  if (!validatePassword(newPassword)) {
    return res.status(400).json({
      message: "Password must be 8-16 characters: include uppercase (A-Z), lowercase (a-z), number (0-9), and special character (@$!%*?&)."
    });
  }

  try {

    const result = await sql.query`
      SELECT password
      FROM users
      WHERE id = ${req.user.id}
    `;

    const user = result.recordset[0];

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {

      return res.status(400).json({
        message: "Current password incorrect"
      });

    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await sql.query`
      UPDATE users
      SET password = ${hashedPassword}
      WHERE id = ${req.user.id}
    `;

    res.json({
      message: "Password updated successfully"
    });

  } catch (err) {

    console.error("Password update error:", err);

    res.status(500).json({
      message: "Failed to update password"
    });

  }

};
