const sql = require("mssql");
require("dotenv").config();

const config = {
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,

  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,

  options: {
    instanceName: process.env.DB_INSTANCE,
    trustServerCertificate: true,
  },
};

const connectDB = async () => {
  try {
    await sql.connect(config);
    console.log("✅ SQL Server Connected Successfully");
  } catch (err) {
    console.error("❌ SQL Error:", err.message);
  }
};

module.exports = { sql, connectDB };