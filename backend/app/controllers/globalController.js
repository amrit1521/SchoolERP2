import db from "../config/db.js";

export const notifications = async (req, res) => {
  try {
 
    const [userRows] = await db.query(
      `SELECT u.roll_id
       FROM users AS u
       WHERE u.id = ?`,
      [req.user.id]
    );

    if (!userRows.length) {
      return res.status(404).json({ message: "User not found" });
    }

    const rollId = userRows[0].roll_id;

  
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;

     
    const [countRows] = await db.query(
      "SELECT COUNT(*) as total FROM notifications WHERE roll_id = ?",
      [rollId]
    );
    const total = countRows[0].total;
    const totalPages = Math.ceil(total / limit);

    // Get paginated data
    const [rows] = await db.query(
      `SELECT * FROM notifications 
       WHERE roll_id = ? 
       ORDER BY created_at DESC 
       LIMIT ? OFFSET ?`,
      [rollId, limit, offset]
    );

 
    res.json({
      data: rows,
      pagination: {
        current_page: page,
        total_pages: totalPages,
        total_records: total,
      },
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Server error" });
  }
};
