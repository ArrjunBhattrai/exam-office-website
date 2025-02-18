/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("branches", function (table) {
    table.increments("branch_id").primary();
    table.string("branch_name", 255).notNullable();
    table
      .integer("course_id")
      .unsigned()
      .references("course_id")
      .inTable("courses")
      .onDelete("CASCADE");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("branches");
};
