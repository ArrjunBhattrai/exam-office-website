module.exports = function (app) {
  console.log("============");

  app.use("/api/user", require("../routes/user.routes"));
  app.use("/api/branch", require("../routes/branch.routes"));
  app.use("/api/course", require("../routes/course.routes"));
  app.use("/api/section", require("../routes/section.routes"));
  app.use("/api/student", require("../routes/student.routes"));
  app.use("/api/subject", require("../routes/subject.routes"));
  app.use("/api/elective", require("../routes/electives.routes"));
  app.use("/api/faculty", require("../routes/faculty.routes"));
  app.use("/api/assesment", require("../routes/assesment.routes"));
  app.use("/api/semester", require("../routes/semester.routes"));
  app.use("/api/atkt", require("../routes/atkt.routes"));

  app.use((_req, _res, next) => {
    const error = new Error();
    error.status = 404;
    error.message = "404 NOT FOUND";
    next(error);
  });
};
