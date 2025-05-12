module.exports = function (app) {
  console.log("============");
  
  app.use("/api/user", require("../routes/user.routes"));
  app.use("/api/admin", require("../routes/admin.routes"));
  app.use("/api/hod", require("../routes/hod.routes"));
  app.use("/api/faculty", require("../routes/faculty.routes"));

  
  app.use((_req, _res, next) => {
    const error = new Error();
    error.status = 404;
    error.message = "404 NOT FOUND";
    next(error);
  });
};
