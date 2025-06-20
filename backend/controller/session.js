const db = require("../db/db");

const createSession = async (req, res) => {
  const { start_month, start_year, end_month, end_year } = req.body;

  // Validate input
  if (!start_month || !start_year || !end_month || !end_year) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const existing = await db("session")
      .where({
        start_month,
        start_year,
        end_month,
        end_year,
      })
      .first();

    if (existing) {
      return res.status(409).json({ error: "Session already exists." });
    }

    const result = await db("session").insert({
      start_month,
      start_year,
      end_month,
      end_year,
    });

    const session_id = result[0];

    const newSession = await db("session").where({ session_id }).first();

    res.status(201).json({ session: newSession });
  } catch (err) {
    console.error("Error creating session:", err);
    res.status(500).json({ error: "Server error." });
  }
};

const getLatestSession = async (req, res) => {
    try {
    const latestSession = await db("session")
      .orderBy("start_year", "desc")
      .orderBy("start_month", "desc")
      .first();

    if (!latestSession) {
      return res.status(404).json({ error: "No sessions found" });
    }

    res.json({ session: latestSession });
  } catch (err) {
    console.error("Error fetching latest session:", err);
    res.status(500).json({ error: "Failed to fetch latest session" });
  }
}

module.exports = {
  createSession,
  getLatestSession
};
