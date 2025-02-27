require("dotenv").config();
const knex = require("knex");

const db = knex({
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    charset: process.env.DB_CHARSET || "utf8mb4"
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
