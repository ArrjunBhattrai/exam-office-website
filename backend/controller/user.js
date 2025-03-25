const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db/db");

const JWT_SECRET = process.env.JWT_SECRET;

// Register Exam Officer
const register = async (req, res) => {
  try {
    const { officer_name, email, password, user_type } = req.body;
    console.log(officer_name, email, password, user_type);

    if (!officer_name || !email || !password || !user_type) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Using transaction to ensure atomicity
    const data = await db.transaction(async (trx) => {
      // Insert into user table
      const [officerId] = await trx("user").insert({
        officer_name,
        email,
        password: hashedPassword,
        user_type,
      });
      console.log(officerId);
      // If user is HOD, insert into hod table
      if (user_type === "HOD") {
        await trx("hod").insert({
          officer_id: officerId, // Reference to user table
          hod_name: officer_name,
          email,
          password: hashedPassword,
        });
      }
    });

    res
      .status(201)
      .json({ data: { data }, message: "Officer registered successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error registering officer", error });
  }
};

// Login Exam Officer
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);

    const officer = await db("user").where({ email }).first();
    console.log(email, password);
    const check = await bcrypt.compare(password, officer.password);
    console.log(check);

    if (!officer || !check) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { officer_id: officer.officer_id, user_type: officer.user_type },
      JWT_SECRET,
      {
        expiresIn: "3h",
      }
    );
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

// Get Exam Officer Profile
const findUser = async (req, res) => {
  try {
    console.log("=======");
    console.log("=======");
    const { id } = req.params;
    console.log("=======", id);
    // console.log(req);
    const { user_type } = req.user;
    console.log("=======", id);
    console.log("=======");

    // // only admins can access this route
    if (user_type !== "ADMIN") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }
    console.log("=======");

    const officer = await db("user").where({ officer_id: id }).first();
    console.log("=======");
    if (!officer) return res.status(404).json({ message: "Officer not found" });
    const { password, ...responseData } = officer;
    res.status(200).json({ data: { officer: responseData } });
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile", error });
  }
};

const getUser = async (req, res) => {
  try {
    console.log("=======");
    // console.log(req);
    const { officer_id } = req.user;
    console.log("=======");

    const officer = await db("user").where({ officer_id }).first();
    console.log("=======");
    if (!officer) return res.status(404).json({ message: "Officer not found" });
    const { password, ...responseData } = officer;
    res.status(200).json({ data: { officer: responseData } });
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile", error });
  }
};

const updateProfile = async () => {};

module.exports = { register, login, getUser, updateProfile, findUser };
