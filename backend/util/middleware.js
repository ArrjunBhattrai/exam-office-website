const jwt = require("jsonwebtoken");
const knex = require("../db/db"); // Adjust based on your Knex config

const authenticate = async (req, res, next) => {
  console.log(req.headers);
  const token = req.header("authorization");
  console.log(token);
  if (!token) return res.status(401).json({ message: "Access denied" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    console.log("============", verified);
    // const officer = await knex("officers") // Replace "officers" with your actual table name
    //   .where({ officer_id: verified.officer_id })
    //   .first();
    // console.log(officer);
    // if (!officer) {
    //   return res.status(404).json({ message: "User not found" });
    // }
    // console.log(officer);

    req.user = verified; // Store user details in req.user
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
};

module.exports = {
  authenticate,
};
