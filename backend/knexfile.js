const { configDotenv } = require("dotenv");

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
require("dotenv").config();

module.exports = {
  development: {
    client: "mysql2",
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./db/migrations",
    },
    seeds: {
      directory: "./db/seeds",
    },
  },

  staging: {
    client: "mysql2",
    connection: {
      host: "staging-db-host",
      user: "staging_user",
      password: "staging_password",
      database: "staging_db",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: { directory: "./db/migrations", tableName: "knex_migrations" },
    seeds: {
      directory: "./db/seeds",
    },
  },

  production: {
    client: "mysql2",
    connection: {
      host: "prod-db-host",
      user: "prod_user",
      password: "prod_password",
      database: "prod_db",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: { directory: "./db/migrations", tableName: "knex_migrations" },
    seeds: {
      directory: "./db/seeds",
    },
  },
};
