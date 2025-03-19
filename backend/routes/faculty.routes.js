const express = require("express");
const router = express.Router();
const{
    facultyLogin,
    subjectByFaculty,
    assignCO,
    studentBySubject,
    saveMarksTheoretical,
    saveMarksPractical
} = require("../controller/faculty.");