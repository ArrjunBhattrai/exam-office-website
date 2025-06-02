const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db/db");
const nodemailer = require("nodemailer");

// Register a user
const registerUser = async (req, res) => {
  const { id, name, email, password, role, branch_id } = req.body;

  // Basic required fields check
  if (!id || !name || !email || !password || !role) {
    return res.status(400).json({ error: "Please fill all the fields." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    if (role === "admin") {
      await db("admin").insert({
        admin_id: id,
        admin_name: name,
        admin_email: email,
        password: hashedPassword,
      });
      return res
        .status(201)
        .json({ message: "Admin registered successfully!" });
    } else if (role === "hod") {
      if (!branch_id) {
        return res
          .status(400)
          .json({ error: "HOD registration requires a branch_id." });
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
    } else if (role === "faculty") {
      if (!branch_id) {
        return res
          .status(400)
          .json({ error: "Faculty registration requires a branch_id." });
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

      return res
        .status(201)
        .json({ message: "Registration request sent successfully!" });
    } else {
      return res.status(400).json({ error: "Invalid role" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error registering user" });
  }
};

//Login a user
const loginUser = async (req, res) => {
  const { email, password, role } = req.body;

  // Check if all fields are provided
  if (!email || !password || !role) {
    return res.status(400).json({ error: "Please fill all the fields." });
  }

  try {
    let user;

    if (role === "admin") {
      user = await db("admin").where({ admin_email: email }).first();
      if (!user) return res.status(400).json({ error: "Invalid email" });
    } else if (role === "hod") {
      user = await db("hod").where({ hod_email: email }).first();
      if (!user) return res.status(400).json({ error: "Invalid email" });
    } else if (role === "faculty") {
      user = await db("faculty").where({ faculty_email: email }).first();
      if (!user) return res.status(400).json({ error: "Invalid email" });
    } else {
      return res.status(400).json({ error: "Invalid role" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).json({ error: "Invalid credentials" });

    const userId =
      role === "admin"
        ? user.admin_id
        : role === "faculty"
        ? user.faculty_id
        : user.hod_id;

    const branchId =
      role === "admin"
        ? null
        : role === "faculty"
        ? user.branch_id
        : user.branch_id;

    const token = jwt.sign({ userId, role, branchId }, process.env.JWT_SECRET, {
      expiresIn: "5h",
    });

    res.status(200).json({ token, role, userId, branchId });
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

const forgotPassword = async (req, res) => {
  const { email, role } = req.body;

  try {
    let user;
    let userId;

    if (role === "admin") {
      const [rows] = await db.query("SELECT * FROM admin WHERE admin_email = ?", [email]);
      user = rows[0];
      if (user) userId = user.admin_id;
    } else if (role === "hod") {
      const [rows] = await db.query("SELECT * FROM hod WHERE hod_email = ?", [email]);
      user = rows[0];
      if (user) userId = user.hod_id;
    } else if (role === "faculty") {
      const [rows] = await db.query("SELECT * FROM faculty WHERE faculty_email = ?", [email]);
      user = rows[0];
      if (user) userId = user.faculty_id;
    } else {
      return res.status(400).json({ error: "Invalid role" });
    }

    if (!user) {
      return res.status(404).json({ error: "No user found with that email and role" });
    }

    const token = jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: "15m" });

    const resetLink = `http://localhost:5137/reset-password/${token}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Password Reset",
      text: `Click the link to reset your password: ${resetLink}`,
    });

    res.json({ message: "Reset link sent to your email" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};


const resetPassword = async (req, res) => {
  const { token } = req.params;
  const {newPassword} = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { userId, role } = decoded;

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    if(role === "admin") {
       await db("admin").where({ admin_id: userId }).update({ password: hashedPassword });
    } else if (role === "hod") {
       await db("hod").where({ hod_id: userId }).update({ password: hashedPassword });
    } else if (role === "faculty") {
      await db("faculty").where({ faculty_id: userId }).update({ password: hashedPassword });
    } else {
      return res.status(400).json({ error: "Invalid role" });
    }

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Invalid or expired token" });
  }
};


module.exports = {
  registerUser,
  loginUser,
  verifyToken,
  verifyToken,
  forgotPassword, 
  resetPassword
};
