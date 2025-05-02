import sql from "mssql";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

// const config = {
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   server: process.env.DB_SERVER,
//   database: process.env.DB_NAME,
//   port: parseInt(process.env.DB_PORT, 10),
//   options: {
//     encrypt: false, // Set to true if using Azure SQL
//     trustServerCertificate: true, // Required for self-signed SSL
//   },
// };

const config = {
  user: "azadmin",
  password: "Powerband$intent2025",
  server: "powerband.database.windows.net",
  database: "IntegrationDB",
  port: parseInt("1433", 10),
  options: {
    encrypt: true, // Set to true if using Azure SQL
    trustServerCertificate: true, // Required for self-signed SSL
  },
};

let pool;

export async function connectDB() {
  try {
    if (!pool) {
      pool = await sql.connect(config);
      console.log("✅ Connected to MSSQL Database");
    }
    return pool;
  } catch (error) {
    console.error("❌ Database Connection Error:", error);
    throw error;
  }
}

export { sql };