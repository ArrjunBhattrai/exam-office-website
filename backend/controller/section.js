const db = require("../db/db");

const createSection = async (req, res) => {
  const { branch_id, course_id, specialization } = req.body;

  if (!branch_id || !course_id || !specialization) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const existing = await db("section")
      .where({ branch_id, course_id, specialization })
      .orderBy("section");

    const existingSections = existing.map(row => row.section);
    const sectionSet = new Set(existingSections);
    const startCharCode = "A".charCodeAt(0);

    const newSections = [];

    if (existingSections.length === 0) {
      // No sections yet — add 'A' and 'B'
      newSections.push(
        { branch_id, course_id, specialization, section: "A" },
        { branch_id, course_id, specialization, section: "B" }
      );
    } else {
      // Get last section, e.g., 'C', 'D'
      const lastSection = existingSections[existingSections.length - 1];
      const nextCharCode = lastSection.charCodeAt(0) + 1;

      if (nextCharCode > "Z".charCodeAt(0)) {
        return res.status(400).json({ error: "Section limit reached (Z)" });
      }

      const nextSection = String.fromCharCode(nextCharCode);
      newSections.push({
        branch_id,
        course_id,
        specialization,
        section: nextSection
      });
    }

    await db("section").insert(newSections);
    return res.status(201).json({ message: "Sections added", sections: newSections });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
    createSection
}
