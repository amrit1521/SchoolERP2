const db = require('../../config/db');

// ✅ Get all messages in a conversation
exports.getMessages = async (req, res) => {
  const { conversationId, userId } = req.params;

  try {
    const [rows] = await db.query(
      `
      SELECT 
        m.*, 
        CONCAT(u.firstname, " ", u.lastname) AS name,
        CASE 
          WHEN r.role_name = 'student' THEN s.stu_img
          WHEN r.role_name = 'teacher' THEN t.img_src
          WHEN u.remark = 'staff' THEN st.img_src
          ELSE NULL
        END AS user_img
      FROM messages m
      LEFT JOIN users u ON m.sender_id = u.id
      LEFT JOIN roles r ON u.roll_id = r.id
      LEFT JOIN students s ON s.stu_id = u.id
      LEFT JOIN teachers t ON t.user_id = u.id
      LEFT JOIN staffs st ON st.user_id = u.id
      WHERE m.conversation_id = ?
      ORDER BY m.created_at ASC
      `,
      [conversationId]
    );

    const [userData] = await db.query(
      `
      SELECT 
        CONCAT(firstname, " ", lastname) AS name,
        last_seen,
        is_online,
        CASE 
          WHEN r.role_name = 'student' THEN s.stu_img
          WHEN r.role_name = 'teacher' THEN t.img_src
          WHEN u.remark = 'staff' THEN st.img_src
          ELSE NULL
        END AS user_img
      FROM users u
      LEFT JOIN roles r ON u.roll_id = r.id
      LEFT JOIN students s ON s.stu_id = u.id
      LEFT JOIN teachers t ON t.user_id = u.id
      LEFT JOIN staffs st ON st.user_id = u.id
      WHERE u.id = ?
      `,
      [userId]
    );

    return res.json({
      success: true,
      message: 'Messages fetched successfully.',
      data: rows,
      userData: userData[0],
    });
  } catch (err) {
    console.error('getMessages Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching messages.',
      error: err.message,
    });
  }
};

// ✅ Send a text / image / voice message
exports.sendMessage = async (req, res) => {
  try {
    const { conversation_id, sender_id, message_text, message_type = 'text', file_url = null } = req.body;
    if (!conversation_id || !sender_id)
      return res.status(400).json({ success: false, message: 'conversation_id and sender_id required' });

    const [result] = await db.query(
      `INSERT INTO messages (conversation_id, sender_id, message_text, message_type, file_url)
       VALUES (?, ?, ?, ?, ?)`,
      [conversation_id, sender_id, message_text, message_type, file_url]
    );

    const [rows] = await db.query(
      `SELECT m.*, u.firstname, u.lastname 
       FROM messages m 
       JOIN users u ON m.sender_id = u.id 
       WHERE m.id = ?`,
      [result.insertId]
    );

    const messageRow = rows[0];
    const io = req.app.get('io');
    if (io) io.to(`conversation_${conversation_id}`).emit('new_message', messageRow);

    res.json({ success: true, message: 'Message sent successfully.', data: messageRow });
  } catch (err) {
    console.error('sendMessage Error:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// ✅ Send message with file (image, video, pdf, etc.)
exports.sendFileMessage = async (req, res) => {
  try {
    const { conversation_id, sender_id } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "File is required.",
      });
    }

    // 🧩 Determine folder and message_type dynamically
    let folder = "others";
    let message_type = "file"; // default

    if (file.mimetype.startsWith("image/")) {
      folder = "image";
      message_type = "image";
    } else if (file.mimetype.startsWith("video/")) {
      folder = "video";
      message_type = "video";
    } else if (file.mimetype.startsWith("audio/")) {
      folder = "audio";
      message_type = "audio";
    } else if (
      file.mimetype === "application/pdf" ||
      file.mimetype.includes("document")
    ) {
      folder = "document";
      message_type = "document";
    }

    // ✅ Construct public file URL
    const fileUrl = `${file.filename}`;

    // 🧠 Save message in DB
    const [result] = await db.query(
      `INSERT INTO messages 
        (conversation_id, sender_id, message_text, message_type, file_url) 
       VALUES (?, ?, ?, ?, ?)`,
      [conversation_id, sender_id, file.originalname, message_type, fileUrl]
    );

    // 🔍 Fetch full message with sender info
    const [rows] = await db.query(
      `SELECT 
          m.*, 
          u.firstname, 
          u.lastname 
       FROM messages m 
       JOIN users u ON m.sender_id = u.id 
       WHERE m.id = ?`,
      [result.insertId]
    );

    const messageRow = rows[0];

    // 🚀 Real-time broadcast using Socket.io
    const io = req.app.get("io");
    if (io) {
      io.to(`conversation_${conversation_id}`).emit("new_message", messageRow);
    }

    // ✅ Send response
    return res.json({
      success: true,
      message: "File message sent successfully.",
      data: messageRow,
    });
  } catch (err) {
    console.error("sendFileMessage Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while sending file message.",
      error: err.message,
    });
  }
};

exports.getLastMessageAllConverationForSpecficUser = async (req, res) => {
  const { userId } = req.params;

  const sql = `
    SELECT 
      c.id AS conversation_id,
      c.type,

      -- 🧍 Other user ID (for private chat)
      CASE 
        WHEN c.type = 'private' THEN 
          (
            SELECT u.id
            FROM users u
            JOIN conversation_members cm2 ON cm2.user_id = u.id
            WHERE cm2.conversation_id = c.id AND u.id != ?
            LIMIT 1
          )
        ELSE NULL
      END AS other_user_id,

      -- 🧍 Other user name or group name
      CASE 
        WHEN c.type = 'private' THEN 
          (
            SELECT CONCAT(u.firstname, ' ', u.lastname)
            FROM users u
            JOIN conversation_members cm2 ON cm2.user_id = u.id
            WHERE cm2.conversation_id = c.id AND u.id != ?
            LIMIT 1
          )
        ELSE c.name
      END AS name,

      -- 🖼️ Other user image
      CASE 
        WHEN c.type = 'private' THEN 
          (
            SELECT 
              CASE 
                WHEN r.role_name = 'student' THEN s.stu_img
                WHEN r.role_name = 'teacher' THEN t.img_src
                WHEN r.role_name = 'staff' THEN st.img_src
                ELSE NULL
              END
            FROM users u
            LEFT JOIN roles r ON u.roll_id = r.id
            LEFT JOIN students s ON s.stu_id = u.id
            LEFT JOIN teachers t ON t.user_id = u.id
            LEFT JOIN staffs st ON st.user_id = u.id
            JOIN conversation_members cm2 ON cm2.user_id = u.id
            WHERE cm2.conversation_id = c.id AND u.id != ?
            LIMIT 1
          )
        ELSE NULL
      END AS user_img,

      -- 💡 Other user online status
      CASE 
        WHEN c.type = 'private' THEN 
          (
            SELECT u.is_online
            FROM users u
            JOIN conversation_members cm2 ON cm2.user_id = u.id
            WHERE cm2.conversation_id = c.id AND u.id != ?
            LIMIT 1
          )
        ELSE NULL
      END AS is_online,

      -- 💬 Last message text
      (
        SELECT m.message_text 
        FROM messages m
        WHERE m.conversation_id = c.id 
        ORDER BY m.created_at DESC 
        LIMIT 1
      ) AS last_message,

      -- 📎 Last message type (text, image, etc.)
      (
        SELECT m.message_type 
        FROM messages m
        WHERE m.conversation_id = c.id 
        ORDER BY m.created_at DESC 
        LIMIT 1
      ) AS last_message_type,

      -- 🕓 Last message time
      (
        SELECT m.created_at 
        FROM messages m 
        WHERE m.conversation_id = c.id 
        ORDER BY m.created_at DESC 
        LIMIT 1
      ) AS last_message_time

    FROM conversations c
    JOIN conversation_members cm ON cm.conversation_id = c.id
    WHERE cm.user_id = ?
    ORDER BY last_message_time DESC;
  `;

  try {
    // userId used 5 times → pass 5 copies
    const [rows] = await db.query(sql, [userId, userId, userId, userId, userId]);

    return res.status(200).json({
      success: true,
      message: "All conversations with last message fetched successfully.",
      data: rows,
    });
  } catch (error) {
    console.error("getLastMessageAllConverationForSpecficUser Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching conversations.",
      error: error.message,
    });
  }
};

// ✅ Delete a message
exports.deleteMessage = async (req, res) => {
  const { messageId } = req.params;

  try {
    const [message] = await db.query(`SELECT * FROM messages WHERE id = ?`, [messageId]);
    if (message.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Message not found.',
      });
    }
    const messageData = message[0];
    await db.query(`DELETE FROM messages WHERE id = ?`, [messageId]);

    const io = req.app.get('io');
    if (io) {
      io.to(`conversation_${messageData.conversation_id}`).emit('message_deleted', {
        messageId: messageId,
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Message deleted successfully.',
      deletedMessageId: messageId,
    });
  } catch (err) {
    console.error('deleteMessage Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting message.',
      error: err.message,
    });
  }
};




