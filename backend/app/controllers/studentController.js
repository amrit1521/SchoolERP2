import db from "../config/db.js";

export const profile = async (req, res) => {
  const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [req.user.id]);
  res.json(rows[0]);
};

export const attendance = async (req, res) => {
  const [rows] = await db.query("SELECT date, status FROM attendance WHERE student_id = ?", [req.user.id]);
  res.json(rows);
};
