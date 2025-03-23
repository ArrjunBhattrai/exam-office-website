const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const app = express();
const branchRoutes = require("./routes/branch.routes");
require("dotenv").config();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const cors = require("cors");

app.use(cors());

require("./loaders/routes")(app);

app.listen({ port: process.env.PORT || 8080 }, () => {
  console.log(`Listening On ${process.env.PORT}`);
});

module.exports = app;
