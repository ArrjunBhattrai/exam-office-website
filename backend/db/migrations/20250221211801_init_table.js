exports.up = function (knex) {
  return knex.schema
    .createTable("admin", (table) => {
      table.string("admin_id").primary();
      table.string("admin_name").notNullable();
      table.string("admin_email").unique().notNullable();
      table.string("password").notNullable();
    })
    .createTable("branch", (table) => {
      table.string("branch_id").primary();
      table.string("branch_name").notNullable();
    })
    .createTable("course", (table) => {
      table.string("course_id").notNullable();
      table.string("course_name").notNullable();
      table.string("specialization").notNullable();
      table.string("branch_id").notNullable();

      table
        .foreign("branch_id")
        .references("branch_id")
        .inTable("branch")
        .onDelete("CASCADE");

      table.primary(["branch_id", "course_id", "specialization"]);
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
    .createTable("session", (table) => {
      table.increments("session_id").primary();
      table.integer("start_month").notNullable();
      table.integer("start_year").notNullable();
      table.integer("end_month").notNullable();
      table.integer("end_year").notNullable();
    })
    .createTable("subject", (table) => {
      table.string("subject_id").notNullable();
      table.string("subject_type").notNullable();
      table.string("subject_name").notNullable();
      table.integer("semester").notNullable();
      table.string("branch_id").notNullable();
      table.string("course_id").notNullable();
      table.string("specialization").notNullable();
      table.string("section").notNullable();
      table.integer("session_id").unsigned().notNullable();

      table
        .foreign(["branch_id", "course_id", "specialization"])
        .references(["branch_id", "course_id", "specialization"])
        .inTable("course")
        .onDelete("CASCADE");

      table
        .foreign("session_id")
        .references("session_id")
        .inTable("session")
        .onDelete("CASCADE");

      table.primary(["subject_id", "subject_type"]);
    })
    .createTable("faculty_subject", (table) => {
      table.string("faculty_id").notNullable();
      table.string("subject_id").notNullable();
      table.string("subject_type").notNullable();
      table.integer("session_id").unsigned().notNullable();
      table.enu("assignment_type", ["primary", "secondary"]).notNullable();

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

      table
        .foreign("session_id")
        .references("session_id")
        .inTable("session")
        .onDelete("CASCADE");
    })
    .createTable("student", (table) => {
      table.string("enrollment_no").primary();
      table.string("student_name").notNullable();
      table.string("branch_id").notNullable();
      table.string("course_id").notNullable();
      table.string("specialization").notNullable();
      table.integer("semester").notNullable();
      table.integer("session_id").unsigned().notNullable();
      table.enu("status", ["regular", "sem-back", "year-back"]).notNullable();

      table
        .foreign(["branch_id", "course_id", "specialization"])
        .references(["branch_id", "course_id", "specialization"])
        .inTable("course")
        .onDelete("CASCADE");

      table
        .foreign("session_id")
        .references("session_id")
        .inTable("session")
        .onDelete("CASCADE");
    })
    .createTable("elective_data", (table) => {
      table.string("enrollment_no").primary();
      table.string("subject_id").notNullable();
      table.string("subject_type").notNullable();
      table.integer("session_id").unsigned().notNullable();

      table
        .foreign(["subject_id", "subject_type"])
        .references(["subject_id", "subject_type"])
        .inTable("subject")
        .onDelete("CASCADE");

      table
        .foreign("session_id")
        .references("session_id")
        .inTable("session")
        .onDelete("CASCADE");
    })
    .createTable("atkt_students", (table) => {
      table.string("enrollment_no").notNullable();
      table.string("student_name").notNullable();
      table.string("branch_id").notNullable();
      table.string("course_id").notNullable();
      table.string("specialization").notNullable();
      table.string("subject_id").notNullable();
      table.string("subject_type").notNullable();
      table.integer("session_id").unsigned().notNullable();

      table
        .foreign(["subject_id", "subject_type"])
        .references(["subject_id", "subject_type"])
        .inTable("subject")
        .onDelete("CASCADE");

      table
        .foreign(["branch_id", "course_id", "specialization"])
        .references(["branch_id", "course_id", "specialization"])
        .inTable("course")
        .onDelete("CASCADE");

      table
        .foreign("session_id")
        .references("session_id")
        .inTable("session")
        .onDelete("CASCADE");

      table.primary(["enrollment_no", "subject_id", "subject_type"]);
    })
    .createTable("course_outcome", (table) => {
      table.string("subject_id").notNullable();
      table.string("subject_type").notNullable();
      table.string("co_name").notNullable();
      table.integer("session_id").unsigned().notNullable();

      table
        .foreign(["subject_id", "subject_type"])
        .references(["subject_id", "subject_type"])
        .inTable("subject")
        .onDelete("CASCADE");

      table
        .foreign("session_id")
        .references("session_id")
        .inTable("session")
        .onDelete("CASCADE");

      table.primary(["subject_id", "subject_type", "co_name"]);
    })
    .createTable("test_details", (table) => {
      table.string("subject_id").notNullable();
      table.string("subject_type").notNullable();
      table.string("component_name").notNullable();
      table.string("sub_component_name").notNullable();
      table.string("co_name").notNullable();
      table.integer("max_marks").notNullable();
      table.integer("session_id").unsigned().notNullable();

      table
        .foreign(["subject_id", "subject_type", "co_name"])
        .references(["subject_id", "subject_type", "co_name"])
        .inTable("course_outcome")
        .onDelete("CASCADE");

      table
        .foreign("session_id")
        .references("session_id")
        .inTable("session")
        .onDelete("CASCADE");
    })
    .createTable("atkt_test_details", (table) => {
      table.string("subject_id").notNullable();
      table.string("subject_type").notNullable();
      table.string("co_name").notNullable();
      table.integer("max_marks").notNullable();
      table.integer("session_id").unsigned().notNullable();

      table
        .foreign(["subject_id", "subject_type", "co_name"])
        .references(["subject_id", "subject_type", "co_name"])
        .inTable("course_outcome")
        .onDelete("CASCADE");

      table
        .foreign("session_id")
        .references("session_id")
        .inTable("session")
        .onDelete("CASCADE");
    })
    .createTable("marks", (table) => {
      table.string("enrollment_no").notNullable();
      table.string("subject_id").notNullable();
      table.string("subject_type").notNullable();
      table.string("component_name").notNullable();
      table.string("sub_component_name").notNullable();
      table.string("co_name").notNullable();
      table.integer("marks_obtained").notNullable();
      table
        .enu("status", ["saved", "submitted", "resaved", "resubmitted"])
        .notNullable()
        .defaultTo("saved");
      table.integer("session_id").unsigned().notNullable();

      table
        .foreign("enrollment_no")
        .references("enrollment_no")
        .inTable("student")
        .onDelete("CASCADE");

      table
        .foreign(["subject_id", "subject_type", "co_name"])
        .references(["subject_id", "subject_type", "co_name"])
        .inTable("course_outcome")
        .onDelete("CASCADE");

      table
        .foreign("session_id")
        .references("session_id")
        .inTable("session")
        .onDelete("CASCADE");
    })
    .createTable("atkt_marks", (table) => {
      table.string("enrollment_no").notNullable();
      table.string("subject_id").notNullable();
      table.string("subject_type").notNullable();
      table.string("co_name").notNullable();
      table.integer("marks_obtained").notNullable();
      table
        .enu("status", ["saved", "submitted", "resaved", "resubmitted"])
        .notNullable()
        .defaultTo("saved");
      table.integer("session_id").unsigned().notNullable();

      table
        .foreign(["enrollment_no", "subject_id", "subject_type"])
        .references(["enrollment_no", "subject_id", "subject_type"])
        .inTable("atkt_students")
        .onDelete("CASCADE");

      table
        .foreign(["subject_id", "subject_type", "co_name"])
        .references(["subject_id", "subject_type", "co_name"])
        .inTable("course_outcome")
        .onDelete("CASCADE");

      table
        .foreign("session_id")
        .references("session_id")
        .inTable("session")
        .onDelete("CASCADE");
    })
    .createTable("marks_update_request", (table) => {
      table.increments("request_id").primary();
      table.string("faculty_id").notNullable();
      table.string("subject_id").notNullable();
      table.string("subject_type").notNullable();
      table.string("component_name").notNullable();
      table.string("sub_component_name").notNullable();
      table.text("reason");
      table
        .enu("status", ["Pending", "Approved", "Rejected"])
        .defaultTo("Pending");
      table.integer("session_id").unsigned().notNullable();

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

      table
        .foreign("session_id")
        .references("session_id")
        .inTable("session")
        .onDelete("CASCADE");
    })
    .createTable("update_logs", (table) => {
      table.integer("request_id").unsigned().primary();
      table.timestamp("timestamp").defaultTo(knex.fn.now());
      table.integer("session_id").unsigned().notNullable();

      table
        .foreign("request_id")
        .references("request_id")
        .inTable("marks_update_request")
        .onDelete("CASCADE");

      table
        .foreign("session_id")
        .references("session_id")
        .inTable("session")
        .onDelete("CASCADE");
    });
};

exports.down = async function (knex) {
  await knex.schema.alterTable("update_logs", (table) => {
    table.dropForeign("request_id");
    table.dropForeign("session_id");
  });

  await knex.schema.alterTable("marks_update_request", (table) => {
    table.dropForeign("faculty_id");
    table.dropForeign(["subject_id", "subject_type"]);
    table.dropForeign("session_id");
  });

  await knex.schema.alterTable("atkt_marks", (table) => {
    table.dropForeign(["enrollment_no", "subject_id", "subject_type"]);
    table.dropForeign(["subject_id", "subject_type", "co_name"]);
    table.dropForeign("session_id");
  });

  await knex.schema.alterTable("marks", (table) => {
    table.dropForeign("enrollment_no");
    table.dropForeign(["subject_id", "subject_type", "co_name"]);
    table.dropForeign("session_id");
  });

  await knex.schema.alterTable("atkt_test_details", (table) => {
    table.dropForeign(["subject_id", "subject_type", "co_name"]);
    table.dropForeign("session_id");
  });

  await knex.schema.alterTable("test_details", (table) => {
    table.dropForeign(["subject_id", "subject_type", "co_name"]);
    table.dropForeign("session_id");
  });

  await knex.schema.alterTable("course_outcome", (table) => {
    table.dropForeign(["subject_id", "subject_type"]);
    table.dropForeign("session_id");
  });

  await knex.schema.alterTable("atkt_students", (table) => {
    table.dropForeign(["subject_id", "subject_type"]);
    table.dropForeign(["branch_id", "course_id", "specialization"]);
    table.dropForeign("session_id");
  });

  await knex.schema.alterTable("elective_data", (table) => {
    table.dropForeign(["subject_id", "subject_type"]);
    table.dropForeign("session_id");
  });

  await knex.schema.alterTable("student", (table) => {
    table.dropForeign(["branch_id", "course_id", "specialization"]);
    table.dropForeign("session_id");
  });

  await knex.schema.alterTable("faculty_subject", (table) => {
    table.dropForeign("faculty_id");
    table.dropForeign(["subject_id", "subject_type"]);
    table.dropForeign("session_id");
  });

  await knex.schema.alterTable("subject", (table) => {
    table.dropForeign(["branch_id", "course_id", "specialization"]);
    table.dropForeign("session_id");
  });

  await knex.schema.alterTable("faculty", (table) => {
    table.dropForeign("branch_id");
  });

  await knex.schema.alterTable("faculty_registration_request", (table) => {
    table.dropForeign("branch_id");
  });

  await knex.schema.alterTable("hod", (table) => {
    table.dropForeign("branch_id");
  });

  await knex.schema.alterTable("course", (table) => {
    table.dropForeign("branch_id");
  });

  // Drop tables in reverse creation order
  await knex.schema
    .dropTableIfExists("update_logs")
    .dropTableIfExists("marks_update_request")
    .dropTableIfExists("atkt_marks")
    .dropTableIfExists("marks")
    .dropTableIfExists("atkt_test_details")
    .dropTableIfExists("test_details")
    .dropTableIfExists("course_outcome")
    .dropTableIfExists("atkt_students")
    .dropTableIfExists("elective_data")
    .dropTableIfExists("student")
    .dropTableIfExists("faculty_subject")
    .dropTableIfExists("subject")
    .dropTableIfExists("session")
    .dropTableIfExists("faculty")
    .dropTableIfExists("faculty_registration_request")
    .dropTableIfExists("hod")
    .dropTableIfExists("course")
    .dropTableIfExists("branch")
    .dropTableIfExists("admin");
};
