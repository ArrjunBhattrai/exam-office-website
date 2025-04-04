exports.up = function (knex) {
  return knex.schema
    .createTable("admin", (table) => {
      table.string("admin_id").primary();
      table.string("admin_name").notNullable();
      table.string("admin_email").unique().notNullable();
      table.string("password").notNullable();
    })
    .createTable("course", (table) => {
      table.string("course_id").primary();
      table.string("course_name").notNullable();
      table.integer("course_year").notNullable();
    })
    .createTable("branch", (table) => {
      table.string("branch_id").primary();
      table.string("branch_name").notNullable();
      table
        .string("course_id")
        .notNullable()
        .references("course_id")
        .inTable("course")
        .onDelete("CASCADE");
    })
    .createTable("faculty", (table) => {
      table.string("faculty_id").primary();
      table.string("faculty_name").notNullable();
      table.string("faculty_email").unique().notNullable();
      table.string("password").notNullable();
      table
        .string("branch_id")
        .notNullable()
        .references("branch_id")
        .inTable("branch")
        .onDelete("CASCADE");
    })
    .createTable("hod", (table) => {
      table
        .string("hod_id")
        .references("faculty_id")
        .inTable("faculty")
        .onDelete("CASCADE");
      table
        .string("branch_id")
        .primary()
        .notNullable()
        .references("branch_id")
        .inTable("branch")
        .onDelete("CASCADE");
    })
    .createTable("subject", (table) => {
      table.string("subject_id").notNullable();
      table.string("subject_name").notNullable();
      table.integer("semester").notNullable();
      table.enu("subject_type", ["T", "P"]).notNullable();
      table
        .string("branch_id")
        .notNullable()
        .references("branch_id")
        .inTable("branch")
        .onDelete("CASCADE");
      table.primary(["subject_id", "subject_type"]);
 
    })
    .createTable("faculty_subject", (table) => {
      table
        .string("faculty_id")
        .notNullable()
        .references("faculty_id")
        .inTable("faculty")
        .onDelete("CASCADE");
      table
        .string("subject_id")
        .notNullable()
        .references("subject_id")
        .inTable("subject")
        .onDelete("CASCADE");
      table
        .enu("subject_type", ["T", "P"])
        .notNullable();
      table.primary(["faculty_id", "subject_id", "subject_type"]);
    })
    .createTable("student", (table) => {
      table.string("enrollment_no").primary();
      table.string("student_name").notNullable();
      table
        .string("branch_id")
        .notNullable()
        .references("branch_id")
        .inTable("branch")
        .onDelete("CASCADE");
    })
    .createTable("student_subject", (table) => {
      table
        .string("enrollment_no")
        .notNullable()
        .references("enrollment_no")
        .inTable("student")
        .onDelete("CASCADE");
      table
        .string("subject_id")
        .notNullable()
        .references("subject_id")
        .inTable("subject")
        .onDelete("CASCADE");
        table
        .enu("subject_type", ["T", "P"])
        .notNullable();
      table.primary(["enrollment_no", "subject_id", "subject_type"]);
    })
    .createTable("course_outcome", (table) => {
      table.string("co_name").notNullable();
      table
        .string("subject_id")
        .notNullable()
        .references("subject_id")
        .inTable("subject")
        .onDelete("CASCADE");
      table
        .enu("subject_type", ["T", "P"])
        .notNullable();
      table.primary(["co_name", "subject_id", "subject_type"]);

    })
    .createTable("marks_temp", (table) => {
      table
        .string("enrollment_no")
        .notNullable()
        .references("enrollment_no")
        .inTable("student")
        .onDelete("CASCADE");
      table
        .string("subject_id")
        .notNullable()
        .references("subject_id")
        .inTable("subject")
        .onDelete("CASCADE");
      table
        .enu("subject_type", ["T", "P"])
        .notNullable();   
      table.enu("component_name", ["CW", "SW", "TH", "PR"]).notNullable();
      table.string("sub_component_name").notNullable();
      table
        .string("co_name")
        .notNullable()
        .references("co_name")
        .inTable("course_outcome")
        .onDelete("CASCADE");
      table.integer("marks").notNullable();
    })
    .createTable("marks_update_request", (table) => {
      table.increments("request_id").primary();
      table
        .string("faculty_id")
        .notNullable()
        .references("faculty_id")
        .inTable("faculty")
        .onDelete("CASCADE");
      table
        .string("subject_id")
        .notNullable()
        .references("subject_id")
        .inTable("subject")
        .onDelete("CASCADE");
      table
        .enu("subject_type", ["T", "P"])
        .notNullable();
      table
        .enu("status", ["Pending", "Approved", "Rejected"])
        .defaultTo("Pending");
    })
    .createTable("update_logs", (table) => {
      table.increments("log_id").primary();
      table.timestamp("timestamp").defaultTo(knex.fn.now());
      table.text("reason");
      table
        .integer("request_id")
        .unsigned()
        .notNullable()
        .references("request_id")
        .inTable("marks_update_request")
        .onDelete("CASCADE");
    });
};

exports.down = async function (knex) {
  // Drop foreign keys before dropping tables
  await knex.schema.alterTable("marks_temp", (table) => {
    table.dropForeign("enrollment_no");
    table.dropForeign(["subject_id", "subject_type"]);
    table.dropForeign("co_name");
  });

  await knex.schema.alterTable("course_outcome", (table) => {
    table.dropForeign(["subject_id", "subject_type"]);
  });

  await knex.schema.alterTable("student_subject", (table) => {
    table.dropForeign("enrollment_no");
    table.dropForeign(["subject_id", "subject_type"]);
  });

  await knex.schema.alterTable("student", (table) => {
    table.dropForeign("branch_id");
  });

  await knex.schema.alterTable("faculty_subject", (table) => {
    table.dropForeign("faculty_id");
    table.dropForeign(["subject_id", "subject_type"]);
  });

  await knex.schema.alterTable("faculty", (table) => {
    table.dropForeign("branch_id");
  });

  await knex.schema.alterTable("subject", (table) => {
    table.dropForeign("branch_id");
  });

  await knex.schema.alterTable("branch", (table) => {
    table.dropForeign("course_id");
  });

  await knex.schema.alterTable("hod", (table) => {
    table.dropForeign("hod_id");
    table.dropForeign("branch_id");
  });

  await knex.schema.alterTable("marks_update_request", (table) => {
    table.dropForeign("faculty_id");
    table.dropForeign(["subject_id", "subject_type"]);
  });

  await knex.schema.alterTable("update_logs", (table) => {
    table.dropForeign("request_id");
  });

  // Drop tables in reverse order
  await knex.schema
    .dropTableIfExists("update_logs")
    .dropTableIfExists("marks_update_request")
    .dropTableIfExists("marks_temp")
    .dropTableIfExists("course_outcome")
    .dropTableIfExists("student_subject")
    .dropTableIfExists("student")
    .dropTableIfExists("faculty_subject")
    .dropTableIfExists("faculty")
    .dropTableIfExists("subject")
    .dropTableIfExists("hod")
    .dropTableIfExists("branch")
    .dropTableIfExists("course")
    .dropTableIfExists("admin");
};