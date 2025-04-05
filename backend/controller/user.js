const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db/db");
const router = express.Router();

// Register a user
const registerUser = async(req, res) => {
  const { id, name, email, password, role, branch_id } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    //Register the admin
    if (role === "admin") {
      await db("admin").insert({
        admin_id: id,
        admin_name: name,
        admin_email: email,
        password: hashedPassword,
      });
      return res.status(201).json({ message: "Admin registered successfully!" });
    }
    
    //Register the HOD
    else if (role === "hod") {
      if (!branch_id) {
        return res.status(400).json({ error: "HOD registration requires a branch_id." });
      }

      const branchExists = await db("branch").where({ branch_id }).first();
      if (!branchExists) {
        return res.status(400).json({ error: "Branch ID does not exist." });
      }

      await db("hod").insert({
        branch_id,
        hod_id: id,
        hod_email: email,
        password: hashedPassword,
      });

      return res.status(201).json({ message: "HOD registered successfully!" });
    }
 
    //Register the faculty
    else if (role === "faculty") {

      if (!branch_id) {
        return res.status(400).json({ error: "Faculty registration requires a branch_id." });
      }

      const branchExists = await db("branch").where({ branch_id }).first();
      if (!branchExists) {
        return res.status(400).json({ error: "Branch ID does not exist." });
      }

      await db("faculty_registration_request").insert({
        faculty_id: id,
        faculty_name: name,
        faculty_email: email,
        password: hashedPassword,
        branch_id,
      });

      return res.status(201).json({ message: "Registration request sent successfully!" });
    }
    
    else {
      return res.status(400).json({ error: "Invalid role" });
    }
   
  } catch (error) {
    res.status(500).json({ error: "Error registering user" });
  }
};


//Login a user
const loginUser = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    let user;

    if (role === "admin") {
      user = await db("admin").where({ admin_email: email }).first();
      if (!user) return res.status(400).json({ error: "Invalid email" });

    } 
    else if (role === "hod") {
      user = await db("hod").where({ hod_email: email }).first();
      if (!user) return res.status(400).json({ error: "Invalid email" });
    }
    else if (role === "faculty") {
      user = await db("faculty").where({ faculty_email: email }).first();
      if (!user) return res.status(400).json({ error: "Invalid email" });

    } else {
      return res.status(400).json({ error: "Invalid role" });
    }

    // Validate password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: "Invalid credentials" });

    // Generate JWT token with correct ID based on role
    const userId =
    role === "admin" ? user.admin_id :
    role === "faculty" ? user.faculty_id :
    user.hod_id;
    
    const token = jwt.sign(
      { userId, role },
      process.env.JWT_SECRET,
      { expiresIn: "5h" }
    );

    res.json({ token, role, userId });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
};

//Verify Token of the user
const verifyToken = (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({ message: "Token valid", user: decoded });
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};


module.exports = {
  registerUser,
  loginUser,
  verifyToken
};
