/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("courses", function (table) {
    table.increments("course_id").primary();
    table.string("course_name", 255).notNullable();
    table.string("course_code", 255).unique().notNullable();
    table.integer("duration_years").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("courses");
};
