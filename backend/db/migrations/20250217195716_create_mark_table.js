/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("marks", function (table) {
    table.increments("mark_id").primary();
    table
      .integer("student_id")
      .unsigned()
      .references("student_id")
      .inTable("students")
      .onDelete("CASCADE");
    table
      .integer("subject_id")
      .unsigned()
      .references("subject_id")
      .inTable("subjects")
      .onDelete("CASCADE");
    table.float("theory_marks").nullable();
    table.float("practical_marks").nullable();
    table.float("internal_marks").nullable();
    table.float("external_marks").nullable();
    table.float("total_marks").notNullable();
    table.string("grade", 10);
    table.boolean("is_validated").defaultTo(false);
    table
      .integer("validated_by")
      .unsigned()
      .nullable()
      .references("user_id")
      .inTable("users");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("marks");
};
