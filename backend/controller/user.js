const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db/db");

const JWT_SECRET = process.env.JWT_SECRET;

// Register Exam Officer
const register = async (req, res) => {
  try {
    const { officer_name, email, password, user_type } = req.body;
    console.log(officer_name, email, password);

    if (!officer_name || !email || !password || user_type) {
      return res.status(400).json({ message: "All fields are required" });
    }
    console.log("================ 1");

    const hashedPassword = await bcrypt.hash(password, 10);
    const [officer] = await db("user")
      .insert({
        officer_name,
        email,
        password: hashedPassword,
        user_type,
      })
      .returning("*");
    console.log("================ 1");
    res.status(201).json({ datat: { officer } });
  } catch (error) {
    res.status(500).json({ message: "Error registering officer", error });
  }
};

// Login Exam Officer
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const officer = await db("user").where({ email }).first();

    if (!officer || !(await bcrypt.compare(password, officer.password))) {
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
const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_type } = req.user;

    // only admins can access this route
    if (user_type !== "ADMIN") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }
    const officer = await db("user").where({ officer_id: id }).first();
    if (!officer) return res.status(404).json({ message: "Officer not found" });
    res.status(200).json({ data: { officer } });
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile", error });
  }
};

const updateProfile = async () => {};

module.exports = { register, login, getUser, updateProfile };
