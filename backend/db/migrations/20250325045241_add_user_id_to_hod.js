/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable("hod", (table) => {
    table
      .integer("officer_id")
      .unsigned() // Ensure this matches the type in the user table
      .notNullable()
      .references("officer_id")
      .inTable("user");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable("hod", (table) => {
    table.dropForeign("hod_user_id"); // More explicit foreign key removal
    table.dropColumn("hod_user_id");
  });
};
