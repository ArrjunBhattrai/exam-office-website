module.exports = function (app) {
  console.log("============");
  app.use("/api/user", require("../routes/user.routes"));
  app.use("/api/course", require("../routes/course.routes"));
  app.use("/api/department/branch", require("../routes/branch.routes"));
  app.use("/api/department/hod", require("../routes/hod.routes"));
  app.use("/api/faculty", require("../routes/faculty.routes"));
  app.use((_req, _res, next) => {
    const error = new Error();
    error.status = 404;
    error.message = "404 NOT FOUND";
    next(error);
  });
};
