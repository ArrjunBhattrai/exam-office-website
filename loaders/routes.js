module.exports = function (app) {
  app.use("/api/departments", require("./routes/departments")(db));
  app.use("/api/courses", require("./routes/courses")(db));
  app.use("/api/branches", require("./routes/branches")(db));
  app.use("/api/semesters", require("./routes/semesters")(db));
  app.use("/api/sections", require("./routes/sections")(db));
  app.use("/api/subjects", require("./routes/subjects")(db));
  app.use("/api/students", require("./routes/students")(db));
  app.use(
    "/api/faculty_subject_assignments",
    require("./routes/faculty_subject_assignments")(db)
  );
  app.use("/api/marks", require("./routes/marks")(db));
  app.use(
    "/api/hod_department_assignments",
    require("./routes/hod_department_assignments")(db)
  );
  app.use("/api/users", require("./routes/users")(db));
  app.use((_req, _res, next) => {
    const error = new Error();
    error.status = 404;
    error.message = "404 NOT FOUND";
    next(error);
  });
};
