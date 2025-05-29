const express = require("express");
const router = express.Router();
const db = require("../db/db");

const getSemesters = async (req, res) => {
    try {
        const semesters = await db('subject')
        .distinct('semester')
        .orderBy('semester', 'asc');

        const result = semesters.map(row => row.semester);
        res.status(200).json(result);
    } catch (err) {
        console.error("Error fetching semesters:", err);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = {
    getSemesters
};