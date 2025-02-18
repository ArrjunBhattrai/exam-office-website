/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("subjects", function (table) {
    table.increments("subject_id").primary();
    table.string("subject_name", 255).notNullable();
    table.string("subject_code", 255).unique().notNullable();
    table
      .integer("semester_id")
      .unsigned()
      .references("semester_id")
      .inTable("semesters")
      .onDelete("CASCADE");
    table.json("marking_system").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("subjects");
};
