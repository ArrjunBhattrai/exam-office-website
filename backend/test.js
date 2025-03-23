require("dotenv").config();
const knex = require("knex");
const mysql = require("mysql2/promise"); // Import MySQL for initial connection

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT, DB_CHARSET } = process.env;

// Function to check if the database exists and create it if not
async function ensureDatabaseExists() {
  try {
    // Connect to MySQL server (without selecting a database)
    const connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      port: DB_PORT || 3306,
    });

    // Check if database exists
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    console.log(`✅ Database '${DB_NAME}' is ready.`);
    
    // Close the connection
    await connection.end();
  } catch (error) {
    console.error("❌ Error ensuring database exists:", error);
    process.exit(1);
  }
}

// Initialize Knex connection after ensuring the database exists
async function initializeDatabase() {
  await ensureDatabaseExists();

  const db = knex({
    client: "mysql2",
    connection: {
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      port: DB_PORT || 3306,
      charset: DB_CHARSET || "utf8mb4",
    },
  });

  db.raw("SELECT 1")
    .then(() => {
      console.log("✅ Database connection successful!");
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Database connection failed:", err);
      process.exit(1);
    });

  return db;
}

// Run the database initialization
initializeDatabase();
