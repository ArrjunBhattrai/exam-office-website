/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable(
    "faculty_subject_assignments",
    function (table) {
      table.increments("assignment_id").primary();
      table
        .integer("faculty_id")
        .unsigned()
        .references("user_id")
        .inTable("users")
        .onDelete("CASCADE");
      table
        .integer("subject_id")
        .unsigned()
        .references("subject_id")
        .inTable("subjects")
        .onDelete("CASCADE");
      table.timestamp("created_at").defaultTo(knex.fn.now());
    }
  );
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("faculty_subject_assignments");
};
