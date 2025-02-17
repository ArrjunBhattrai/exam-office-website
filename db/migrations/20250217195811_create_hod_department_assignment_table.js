/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable(
    "hod_department_assignments",
    function (table) {
      table
        .integer("hod_id")
        .unsigned()
        .references("user_id")
        .inTable("users")
        .onDelete("CASCADE");
      table
        .integer("department_id")
        .unsigned()
        .references("department_id")
        .inTable("departments")
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
  return knex.schema.dropTableIfExists("hod_department_assignments");
};
