const express = require("express");
const router = express.Router();

router.post("/admin", createAdmin);

module.exports = router;
