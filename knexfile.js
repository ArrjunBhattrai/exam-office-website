/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: "mysql2",
    connection: {
      host: "127.0.0.1", // Change this if MySQL is running on a different host
      user: "root", // Your MySQL username
      password: "1234", // Your MySQL password
      database: "exam_office", // Your database name
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
