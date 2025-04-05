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
      table.string("course_id").notNullable();

      table
        .foreign("course_id")
        .references("course_id")
        .inTable("course")
        .onDelete("CASCADE");
    })
    .createTable("hod", (table) => {
      table.string("branch_id").primary().notNullable();
      table.string("hod_id").notNullable();
      table.string("hod_email").notNullable();
      table.string("password").notNullable();

      table
        .foreign("branch_id")
        .references("branch_id")
        .inTable("branch")
        .onDelete("CASCADE");
    })
    .createTable("faculty_registration_request", (table) => {
      table.string("faculty_id").primary();
      table.string("faculty_name").notNullable();
      table.string("faculty_email").unique().notNullable();
      table.string("password").notNullable();
      table.string("branch_id").notNullable();

      table
        .foreign("branch_id")
        .references("branch_id")
        .inTable("branch")
        .onDelete("CASCADE");
    })
    .createTable("faculty", (table) => {
      table.string("faculty_id").primary();
      table.string("faculty_name").notNullable();
      table.string("faculty_email").unique().notNullable();
      table.string("password").notNullable();
      table.string("branch_id").notNullable();

      table
        .foreign("branch_id")
        .references("branch_id")
        .inTable("branch")
        .onDelete("CASCADE");
    })
    .createTable("subject", (table) => {
      table.string("subject_id").notNullable();
      table.string("subject_type").notNullable();
      table.string("subject_name").notNullable();
      table.integer("semester").notNullable();
      table.string("branch_id").notNullable();

      table
        .foreign("branch_id")
        .references("branch_id")
        .inTable("branch")
        .onDelete("CASCADE");

      table.primary(["subject_id", "subject_type"]);
    })
    .createTable("faculty_subject", (table) => {
      table.string("faculty_id").notNullable();
      table.string("subject_id").notNullable();
      table.string("subject_type").notNullable();

      table
        .foreign("faculty_id")
        .references("faculty_id")
        .inTable("faculty")
        .onDelete("CASCADE");
    
      table
        .foreign(["subject_id", "subject_type"])
        .references(["subject_id", "subject_type"])
        .inTable("subject")
        .onDelete("CASCADE");

      table.primary(["faculty_id", "subject_id", "subject_type"]);
    })    
    .createTable("student", (table) => {
      table.string("enrollment_no").primary();
      table.string("student_name").notNullable();
      table.string("branch_id").notNullable();

      table
        .foreign("branch_id")
        .references("branch_id")
        .inTable("branch")
        .onDelete("CASCADE");
    })
    .createTable("student_subject", (table) => {
      table.string("enrollment_no").notNullable();
      table.string("subject_id").notNullable();
      table.string("subject_type").notNullable();

      table
        .foreign("enrollment_no")
        .references("enrollment_no")
        .inTable("student")
        .onDelete("CASCADE");
      table
        .foreign(["subject_id", "subject_type"])
        .references(["subject_id", "subject_type"])
        .inTable("subject")
        .onDelete("CASCADE");

      table.primary(["enrollment_no", "subject_id", "subject_type"]);
    })
    .createTable("course_outcome", (table) => {
      table.string("co_name").notNullable();
      table.string("subject_id").notNullable();
      table.string("subject_type").notNullable();

      table
        .foreign(["subject_id", "subject_type"])
        .references(["subject_id", "subject_type"])
        .inTable("subject")
        .onDelete("CASCADE");

      table.primary(["co_name", "subject_id", "subject_type"]);
    })
    .createTable("marks_temp", (table) => {
      table.string("enrollment_no").notNullable();
      table.string("subject_id").notNullable();
      table.string("subject_type").notNullable();
      table.enu("component_name", ["CW", "SW", "TH", "PR"]).notNullable();
      table.string("sub_component_name").notNullable();
      table.string("co_name").notNullable();
      table.integer("marks").notNullable();

      table
        .foreign("enrollment_no")
        .references("enrollment_no")
        .inTable("student")
        .onDelete("CASCADE");
      table
        .foreign(["co_name", "subject_id", "subject_type"])
        .references(["co_name", "subject_id", "subject_type"])
        .inTable("course_outcome")
        .onDelete("CASCADE");
    })
    .createTable("marks_update_request", (table) => {
      table.increments("request_id").primary();
      table.string("faculty_id").notNullable();
      table.string("subject_id").notNullable();
      table.string("subject_type").notNullable();
      table
        .enu("status", ["Pending", "Approved", "Rejected"])
        .defaultTo("Pending");

      table
        .foreign("faculty_id")
        .references("faculty_id")
        .inTable("faculty")
        .onDelete("CASCADE");
      table
        .foreign(["subject_id", "subject_type"])
        .references(["subject_id", "subject_type"])
        .inTable("subject")
        .onDelete("CASCADE");
    })
    .createTable("update_logs", (table) => {
      table.increments("log_id").primary();
      table.timestamp("timestamp").defaultTo(knex.fn.now());
      table.text("reason");
      table.integer("request_id").unsigned().notNullable();
      table
        .foreign("request_id")
        .references("request_id")
        .inTable("marks_update_request")
        .onDelete("CASCADE");
    });
};

exports.down = async function (knex) {
  // Drop foreign keys before dropping tables
  await knex.schema.alterTable("update_logs", (table) => {
    table.dropForeign("request_id");
  });

  await knex.schema.alterTable("marks_update_request", (table) => {
    table.dropForeign("faculty_id");
    table.dropForeign(["subject_id", "subject_type"]);
  });

  await knex.schema.alterTable("marks_temp", (table) => {
    table.dropForeign("enrollment_no");
    table.dropForeign(["co_name", "subject_id", "subject_type"]);
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

  await knex.schema.alterTable("faculty_registration_request", (table) => {
    table.dropForeign("branch_id");
  });

  await knex.schema.alterTable("subject", (table) => {
    table.dropForeign("branch_id");
  });

  await knex.schema.alterTable("hod", (table) => {
    table.dropForeign("branch_id");
  });

  await knex.schema.alterTable("branch", (table) => {
    table.dropForeign("course_id");
  });

  // Drop tables in reverse creation order
  await knex.schema
    .dropTableIfExists("update_logs")
    .dropTableIfExists("marks_update_request")
    .dropTableIfExists("marks_temp")
    .dropTableIfExists("course_outcome")
    .dropTableIfExists("student_subject")
    .dropTableIfExists("student")
    .dropTableIfExists("faculty_subject")
    .dropTableIfExists("faculty")
    .dropTableIfExists("faculty_registration_request")
    .dropTableIfExists("subject")
    .dropTableIfExists("hod")
    .dropTableIfExists("branch")
    .dropTableIfExists("course")
    .dropTableIfExists("admin");
};
