/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("users", function (table) {
    table.increments("user_id").primary();
    table.string("username", 255).unique().notNullable();
    table.string("password_hash", 255).notNullable();
    table.string("role", 255).notNullable(); // 'Exam Officer', 'HOD', 'Faculty'
    table
      .integer("department_id")
      .unsigned()
      .references("department_id")
      .inTable("departments")
      .nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("users");
};
