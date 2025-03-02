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
      table.enu("subject_type", ["Theory", "Practical"]).notNullable();
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
    .createTable("assessment_component", (table) => {
      table.increments("component_id").primary();
      table.enu("component_name", ["CW", "SW", "TH", "PR"]).notNullable();
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
    .createTable("cw_components", (table) => {
      table.increments("cw_component_id").primary();
      table.enu("component_name", ["MST1", "MST2", "Assignment1", "Assignment2", "Quiz1", "Quiz2", "Attendance"]).notNullable();
      table.boolean("is_co_wise").defaultTo(true);
      table
        .integer("component_id")
        .unsigned()
        .notNullable()
        .references("component_id")
        .inTable("assessment_component")
        .onDelete("CASCADE");
    })
    .createTable("sw_components", (table) => {
      table.increments("sw_component_id").primary();
      table.enu("component_name", ["Internal Submissions", "Internal Viva 1", "Internal Viva 2", "Attendance"]).notNullable();
      table.boolean("is_co_wise").defaultTo(true);
      
      table.boolean("is_co_wise").defaultTo(true);
      table
        .integer("component_id")
        .unsigned()
        .notNullable()
        .references("component_id")
        .inTable("assessment_component")
        .onDelete("CASCADE");
      })
    .createTable("co_marks_temp", (table) => {
      table.increments("temp_marks_id").primary();
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
        .integer("component_id")
        .unsigned()
        .notNullable()
        .references("component_id")
        .inTable("assessment_component")
        .onDelete("CASCADE");
      table
        .integer("sub_component_id")
        .unsigned()
        .nullable();
      table
        .enu("sub_component_type", ["CW", "SW"])
        .notNullable();
      table.integer("obtained_marks").notNullable();
      table.integer("total_marks").notNullable();
      table
        .integer("faculty_id")
        .unsigned()
        .notNullable()
        .references("faculty_id")
        .inTable("faculty")
        .onDelete("CASCADE");
      table.enu("status", ["Pending", "Verified"]).defaultTo("Pending");
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
      table.enu("status", ["Pending", "Approved", "Rejected"]).defaultTo("Pending");
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
    .dropTableIfExists("co_marks_temp")
    .dropTableIfExists("sw_components")
    .dropTableIfExists("cw_components")
    .dropTableIfExists("assessment_component")
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
