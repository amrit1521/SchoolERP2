import { success } from "zod";
import db from "../../config/db.js";

export const addNotice = (req, res) => {
  const { title, message, attachement, messageTo } = req.body;
  try {
    for (let id of messageTo) {
      const sql =
        "Insert into notifications title,message,attachement,role_id VALUES (?,?,?,?)";
      const [rows] = db.execute(sql, [title, message, attachement, id]);
      if (!rows) {
        return res.status(200).json({
          message: "No data found",
          success: false,
        });
      }
      return res.status(201).json({
          message: "Notice created successfully.",
          success: true,
          result:rows
        });
    }
  } catch (error) {
    console.error("Error adding notice:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
