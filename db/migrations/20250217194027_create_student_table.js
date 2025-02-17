/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("students", function (table) {
    table.increments("student_id").primary();
    table.string("first_name", 255).notNullable();
    table.string("last_name", 255).notNullable();
    table.string("roll_number", 255).unique().notNullable();
    table
      .integer("section_id")
      .unsigned()
      .references("section_id")
      .inTable("sections")
      .onDelete("CASCADE");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("students");
};
