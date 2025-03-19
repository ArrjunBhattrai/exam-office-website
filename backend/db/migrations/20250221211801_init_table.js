exports.up = function (knex) {
  return knex.schema
    .createTable("college", (table) => {
      table.increments("college_id").primary();
      table.string("college_name").unique().notNullable();
    })
    .createTable("course", (table) => {
      table.increments("course_id").primary();
      table.string("course_name").notNullable();
      table.integer("year_of_pursuing").notNullable();
      table
        .integer("college_id")
        .unsigned()
        .notNullable()
        .references("college_id")
        .inTable("college")
        .onDelete("CASCADE");
    })
    .createTable("hod", (table) => {
      table.increments("hod_id").primary();
      table.string("hod_name").notNullable();
      table.string("email").unique().notNullable();
      table.string("password").notNullable();
    })
    .createTable("branch", (table) => {
      table.increments("branch_id").primary();
      table.string("branch_name").notNullable();
      table
        .integer("course_id")
        .unsigned()
        .notNullable()
        .references("course_id")
        .inTable("course")
        .onDelete("CASCADE");
      table
        .integer("hod_id")
        .unsigned()
        .unique()
        .references("hod_id")
        .inTable("hod")
        .onDelete("SET NULL");
    })
    .createTable("subject", (table) => {
      table.increments("subject_id").primary();
      table.string("subject_name").notNullable();
      table.string("year_semester").notNullable();
      table
        .integer("branch_id")
        .unsigned()
        .notNullable()
        .references("branch_id")
        .inTable("branch")
        .onDelete("CASCADE");
    })
    .createTable("faculty", (table) => {
      table.increments("faculty_id").primary();
      table.string("faculty_name").notNullable();
      table.string("email").unique().notNullable();
      table.string("password").notNullable();
      table
        .integer("branch_id")
        .unsigned()
        .notNullable()
        .references("branch_id")
        .inTable("branch")
        .onDelete("CASCADE");
    })
    .createTable("faculty_subject", (table) => {
      table.increments("faculty_subject_id").primary();
      table
        .integer("faculty_id")
        .unsigned()
        .notNullable()
        .references("faculty_id")
        .inTable("faculty")
        .onDelete("CASCADE");
      table
        .integer("subject_id")
        .unsigned()
        .notNullable()
        .references("subject_id")
        .inTable("subject")
        .onDelete("CASCADE");

      table.unique(["faculty_id", "subject_id"]);
    })
    .createTable("student", (table) => {
      table.increments("student_id").primary();
      table.string("student_name").notNullable();
      table.string("enrollment_number").unique().notNullable();
      table
        .integer("branch_id")
        .unsigned()
        .notNullable()
        .references("branch_id")
        .inTable("branch")
        .onDelete("CASCADE");
    })
    .createTable("student_subject", (table) => {
      table.increments("student_subject_id").primary();
      table
        .integer("student_id")
        .unsigned()
        .notNullable()
        .references("student_id")
        .inTable("student")
        .onDelete("CASCADE");
      table
        .integer("subject_id")
        .unsigned()
        .notNullable()
        .references("subject_id")
        .inTable("subject")
        .onDelete("CASCADE");
    })
    .createTable("course_outcome", (table) => {
      table.increments("co_id").primary();
      table.string("co_name").notNullable();
      table
        .integer("subject_id")
        .unsigned()
        .notNullable()
        .references("subject_id")
        .inTable("subject")
        .onDelete("CASCADE");
    })
    .createTable("marks_temp", (table) => {
      table.increments("marks_id").primary();
      table.enu("component_name", ["CW", "SW", "TH", "PR"]).notNullable();
      //sub_component_name should be mst1 mst2..etc for cw and for th it can be th only as there is no other division in that
      table.string("sub_component_name").notNullable(); 
      table
        .integer("student_id")
        .unsigned()
        .notNullable()
        .references("student_id")
        .inTable("student")
        .onDelete("CASCADE");
      table
        .integer("co_id")
        .unsigned()
        .notNullable()
        .references("co_id")
        .inTable("course_outcome")
        .onDelete("CASCADE");
      table
        .integer("subject_id")
        .unsigned()
        .notNullable()
        .references("subject_id")
        .inTable("subject")
        .onDelete("CASCADE");
    })
    .createTable("user", (table) => {
      table.increments("officer_id").primary();
      table.string("officer_name").notNullable();
      table.string("email").unique().notNullable();
      table.enu("user_type", ["ADMIN", "HOD", "FACULTY"]).notNullable();
      table.string("password").notNullable();
    })
    .createTable("marks_update_request", (table) => {
      table.increments("request_id").primary();
      table
        .integer("student_id")
        .unsigned()
        .notNullable()
        .references("student_id")
        .inTable("student")
        .onDelete("CASCADE");
      table
        .integer("subject_id")
        .unsigned()
        .notNullable()
        .references("subject_id")
        .inTable("subject")
        .onDelete("CASCADE");
      table
        .integer("requested_by")
        .unsigned()
        .notNullable()
        .references("faculty_id")
        .inTable("faculty")
        .onDelete("CASCADE");
      table
        .enu("status", ["Pending", "Approved", "Rejected"])
        .defaultTo("Pending");
    })
    .createTable("update_logs", (table) => {
      table.increments("log_id").primary();
      table.string("action").notNullable();
      table.string("performed_by").notNullable();
      table.timestamp("timestamp").defaultTo(knex.fn.now());
      table.text("reason");
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("update_logs")
    .dropTableIfExists("marks_update_request")
    .dropTableIfExists("user")
    .dropTableIfExists("marks_temp")
    .dropTableIfExists("student_subject")
    .dropTableIfExists("student")
    .dropTableIfExists("faculty_subject")
    .dropTableIfExists("faculty")
    .dropTableIfExists("subject")
    .dropTableIfExists("branch")
    .dropTableIfExists("hod")
    .dropTableIfExists("course")
    .dropTableIfExists("college");
};
