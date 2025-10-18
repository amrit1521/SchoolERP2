import db from "../config/db.js";
 
export const notifications = async (req, res) => {
    const [user] = await db.query(
  `SELECT u.roll_id
   FROM users as u
   WHERE u.id = ?`,
  [req.user.id]
);

  const [rows] = await db.query("SELECT * FROM notifications WHERE roll_id=?",[user[0].roll_id]);
  res.json(rows);
};
 

 