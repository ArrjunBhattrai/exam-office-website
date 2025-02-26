const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db/db");

const JWT_SECRET = process.env.JWT_SECRET;

// Register Exam Officer
const registerExamOfficer = async (req, res) => {
  try {
    const { officer_name, email, password } = req.body;
    console.log(officer_name, email, password);

    if (!officer_name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    console.log("================ 1");

    const hashedPassword = await bcrypt.hash(password, 10);
    const [officer] = await db("exam_officer")
      .insert({
        officer_name,
        email,
        password: hashedPassword,
      })
      .returning("*");
    console.log("================ 1");
    res.status(201).json({ officer });
  } catch (error) {
    res.status(500).json({ message: "Error registering officer", error });
  }
};

// Login Exam Officer
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const officer = await db("exam_officer").where({ email }).first();

    if (!officer || !(await bcrypt.compare(password, officer.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ officer_id: officer.officer_id }, JWT_SECRET, {
      expiresIn: "3h",
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

// Get Exam Officer Profile
const getExamOfficer = async (req, res) => {
  try {
    const { id } = req.params;
    const officer = await db("exam_officer").where({ officer_id: id }).first();
    if (!officer) return res.status(404).json({ message: "Officer not found" });
    res.status(200).json({ data: officer });
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile", error });
  }
};

module.exports = { registerExamOfficer, login, getExamOfficer };
