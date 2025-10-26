import { success } from "zod";
import db from "../../config/db.js";

export const addNotice = async (req, res) => {
  const { title, message, attachement, messageTo, docsId } = req.body;

  try {
    if (!messageTo || !Array.isArray(messageTo) || messageTo.length === 0) {
      return res.status(400).json({
        message: "messageTo must be a non-empty array",
        success: false,
      });
    }

    const insertSql = `
      INSERT INTO notifications (title, message, attachment, roll_id,type)
      VALUES (?, ?, ?, ?)
    `;

    const insertPromises = messageTo.map((id) =>
      db.execute(insertSql, [title, message, attachement, id, "notice"])
    );

    const results = await Promise.all(insertPromises);

    if (docsId) {
      const updateSql = "UPDATE files SET status = 1 WHERE id = ?";
      await db.execute(updateSql, [docsId]);
    }

    return res.status(201).json({
      message: "Notice(s) created successfully.",
      success: true,
      result: results.map(([rows]) => rows),
    });
  } catch (error) {
    console.error("Error adding notice:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getAllNotice = async (req, res) => {
  try {
    const sql = `
      SELECT 
        JSON_ARRAYAGG(n.id) AS id,
        n.title,
        n.message,
        n.attachment,
        n.created_at,
        JSON_ARRAYAGG(n.roll_id) AS role_id
      FROM notifications n
      WHERE n.type = 'notice'
      GROUP BY n.title, n.message, n.attachment, n.created_at
      ORDER BY n.created_at DESC
    `;

    const [rows] = await db.execute(sql);

    if (!rows || rows.length === 0) {
      return res.status(200).json({
        message: "No notices found",
        success: false,
        result: [],
      });
    }

    return res.status(200).json({
      message: "Notices fetched successfully",
      success: true,
      result: rows,
    });
  } catch (error) {
    console.error("Error fetching notices:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
