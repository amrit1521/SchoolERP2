
const { success } = require('zod');
const db = require('../../config/db')

exports.allUsers = async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT 
                u.id AS user_id,
                CONCAT(u.firstname, " ", u.lastname) AS name,
                u.email,
                u.roll_id,
                r.role_name,
                u.created_at AS dateOfJoined,
                CASE 
                    WHEN r.role_name = 'student' THEN s.stu_img
                    WHEN r.role_name = 'teacher' THEN t.img_src
                    WHEN u.remark = 'staff' THEN st.img_src
                    ELSE NULL
                END AS user_img
            FROM users u
            JOIN roles r ON u.roll_id = r.id
            LEFT JOIN students s ON s.stu_id = u.id
            LEFT JOIN teachers t ON t.user_id = u.id
            LEFT JOIN staffs st ON st.user_id = u.id
            WHERE u.status = '1' AND u.roll_id !=6
            ORDER BY u.roll_id ASC, u.firstname ASC
        `);

        if (rows.length === 0) {
            return res.status(200).json({
                message: "No users found.",
                success: false,
                data: [],
            });
        }

        const filteredUsers = rows.filter(
            (row) => row.role_name.toLowerCase() !== "admin"
        );

        return res.status(200).json({
            message: "Users fetched successfully",
            success: true,
            data: filteredUsers,
        });

    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({
            message: "Internal server error!",
            success: false,
            error: error.message,
        });
    }
};

exports.onlineUsers = async (req, res) => {
    try {
        const [rows] = await db.execute(`
      SELECT 
          u.id AS user_id,
          CONCAT(u.firstname, " ", u.lastname) AS name,
          CASE 
              WHEN r.role_name = 'student' THEN s.stu_img
              WHEN r.role_name = 'teacher' THEN t.img_src
              WHEN u.remark = 'staff' THEN st.img_src
              ELSE NULL
          END AS user_img
      FROM users u
      JOIN roles r ON u.roll_id = r.id
      LEFT JOIN students s ON s.stu_id = u.id
      LEFT JOIN teachers t ON t.user_id = u.id
      LEFT JOIN staffs st ON st.user_id = u.id
      WHERE u.status = '1' AND u.is_online = 1
      ORDER BY u.firstname ASC
    `);

        if (rows.length === 0) {
            return res.status(200).json({
                message: "No online users found.",
                success: false,
                data: [],
            });
        }

        return res.status(200).json({
            message: "Online users fetched successfully.",
            success: true,
            data: rows,
        });
    } catch (error) {
        console.error("Error fetching online users:", error);
        return res.status(500).json({
            message: "Internal server error!",
            success: false,
            error: error.message,
        });
    }
};

exports.offlineUsers =async(req,res)=>{


    try {

        const sql = `
         SELECT 
         u.id AS user_id,
         CONCAT(u.firstname , "" , u.lastname) AS name,
         CASE 
         WHEN  r.role_name = 'student' THEN s.stu_img
         WHEN r.role_name = "teacher" THEN t.img_src
         WHEN u.remark = 'staff' THEN st.img_src
         ELSE NULL
         END AS user_img
         FROM users u
         JOIN roles r 
        `


        
    } catch (error) {
        console.error("Error fetchng offline users " , error) 
        return res.status(500).json({
            message:"Internal server error ",
            success:false,
            error:error.message
        })
    }
}

exports.reportUser = async (req, res) => {
  const { reportedUserId, reportedBy, reason, conversationId } = req.body;

  if (!reportedUserId || !reportedBy) {
    return res.status(400).json({ success: false, message: "Missing data" });
  }

  try {
    // Check if already reported
    const [existing] = await db.query(
      "SELECT * FROM user_reports WHERE reported_user_id = ? AND reported_by = ?",
      [reportedUserId, reportedBy]
    );

    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: "You have already reported this user" });
    }

    await db.query(
      "INSERT INTO user_reports (reported_user_id, reported_by, reason, conversation_id) VALUES (?, ?, ?, ?)",
      [reportedUserId, reportedBy, reason || null, conversationId || null]
    );

    return res.json({ success: true, message: "User reported successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


