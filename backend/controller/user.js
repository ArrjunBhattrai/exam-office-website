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
    
    if (role === "admin") {
      // Register Admin (No branch_id required)
      await db("admin").insert({
        admin_id: id,
        admin_name: name,
        admin_email: email,
        password: hashedPassword,
      });
      return res.status(201).json({ message: "Admin registered successfully!" });
    }
    
    else if (role === "faculty") {
      // Validate branch_id presence
      if (!branch_id) {
        return res.status(400).json({ error: "Faculty registration requires a branch_id." });
      }
      //check if branch exists
      const branchExists = await db("branch").where({ branch_id }).first();
      if (!branchExists) {
        return res.status(400).json({ error: "Branch ID does not exist." });
      }

      // Register Faculty
      await db("faculty").insert({
        faculty_id: id,
        faculty_name: name,
        faculty_email: email,
        password: hashedPassword,
        branch_id,
      });

      return res.status(201).json({ message: "Faculty registered successfully!" });
    }
    
    else if (role === "hod") {
      // Validate branch_id presence
      if (!branch_id) {
        return res.status(400).json({ error: "HOD registration requires a branch_id." });
      }

      // Check if the given HOD ID exists in the Faculty table
      const facultyExists = await db("faculty").where({ faculty_id: id }).first();

      if (!facultyExists) {
        return res.status(400).json({ error: "Faculty ID not found. HOD must be a faculty first." });
      }

      // Register HOD
      await db("hod").insert({
        hod_id: id,
        branch_id,
      });
      return res.status(201).json({ message: "HOD registered successfully!" });
    } 
    
    else {
      return res.status(400).json({ error: "Invalid role" });
    }
   
  } catch (error) {
    res.status(500).json({ error: "Error registering user" });
  }
};


//login a user
const loginUser = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    let user;

    if (role === "admin") {
      user = await db("admin").where({ admin_email: email }).first();
      if (!user) return res.status(400).json({ error: "Invalid email" });

    } else if (role === "faculty") {
      user = await db("faculty").where({ faculty_email: email }).first();
      if (!user) return res.status(400).json({ error: "Invalid email" });

    } else if (role === "hod") {
      // First, check if the email exists in the faculty table
      user = await db("faculty").where({ faculty_email: email }).first();
      if (!user) return res.status(400).json({ error: "Invalid email" });

      // Now, check if this faculty ID exists in the HOD table
      const isHod = await db("hod").where({ hod_id: user.faculty_id }).first();
      if (!isHod) return res.status(400).json({ error: "User is not an HOD" });

    } else {
      return res.status(400).json({ error: "Invalid role" });
    }

    // Validate password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: "Invalid credentials" });

    // Generate JWT token with correct ID based on role
    const userId = role === "admin" ? user.admin_id : user.faculty_id;
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


module.exports = {
  registerUser,
  loginUser,
};
