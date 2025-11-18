const db = require('../../config/db');

// ✅ Get all messages in a conversation
exports.getMessages = async (req, res) => {

  const { conversationId, userId } = req.params;
  console.log(userId)
  try {
    const [rows] = await db.query(
      `
      SELECT 
        m.id,
        m.conversation_id,
        m.sender_id,
        m.message_text,
        m.file_url,
        m.message_type,
        m.created_at,
        m.isStar,
        m.isReported,
        m.reply_to,

        -- Reply Details
        reply.id AS reply_id,
        reply.message_text AS reply_message_text,
        reply.file_url AS reply_file_url,
        reply.message_type AS reply_message_type,

        -- Reactions
        COALESCE(r.reaction, '[]') AS reaction,

        -- Sender Info
        CONCAT(u.firstname, " ", u.lastname) AS name,
        CASE 
          WHEN rl.role_name = 'student' THEN s.stu_img
          WHEN rl.role_name = 'teacher' THEN t.img_src
          WHEN u.remark = 'staff' THEN st.img_src
          ELSE NULL
        END AS user_img

      FROM messages m
      LEFT JOIN messages reply ON reply.id = m.reply_to

      LEFT JOIN (
        SELECT 
          mr.message_id,
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'userId', mr.user_id,
              'emoji', mr.emoji,   
              'img',
              CASE 
                WHEN rl.role_name = 'student' THEN s.stu_img
                WHEN rl.role_name = 'teacher' THEN t.img_src
                WHEN u.remark = 'staff' THEN st.img_src
                ELSE NULL
              END
            )
          ) AS reaction
        FROM message_reactions mr
        LEFT JOIN users u ON mr.user_id = u.id
        LEFT JOIN roles rl ON u.roll_id = rl.id
        LEFT JOIN students s ON s.stu_id = u.id
        LEFT JOIN teachers t ON t.user_id = u.id
        LEFT JOIN staffs st ON st.user_id = u.id
        GROUP BY mr.message_id
      ) r ON r.message_id = m.id

      LEFT JOIN users u ON m.sender_id = u.id
      LEFT JOIN roles rl ON u.roll_id = rl.id
      LEFT JOIN students s ON s.stu_id = u.id
      LEFT JOIN teachers t ON t.user_id = u.id
      LEFT JOIN staffs st ON st.user_id = u.id

      WHERE m.conversation_id = ?
      ORDER BY m.created_at ASC
      `,
      [conversationId]
    );

    // Map clean JSON
    const finalMessages = rows.map((msg) => ({
      id: msg.id,
      conversation_id: msg.conversation_id,
      sender_id: msg.sender_id,
      message_text: msg.message_text,
      message_type: msg.message_type,
      file_url: msg.file_url,
      created_at: msg.created_at,
      isStar: msg.isStar,
      isReported: msg.isReported,

      // ⭐ CLEAN REPLY BLOCK
      reply: msg.reply_id
        ? {
          id: msg.reply_id,
          message_text: msg.reply_message_text,
          message_type: msg.reply_message_type,
          file_url: msg.reply_file_url,
        }
        : null,

      // ⭐ Clean reaction array
      reaction:
        typeof msg.reaction === "string"
          ? JSON.parse(msg.reaction)
          : msg.reaction,

      // user info
      name: msg.name,
      user_img: msg.user_img,
    }));

    // User info
    const [userData] = await db.query(
      `
      SELECT 
        CONCAT(firstname, " ", lastname) AS name,
        last_seen,
        is_online,
        mobile,
        email,
        CASE 
          WHEN rl.role_name = 'student' THEN s.stu_img
          WHEN rl.role_name = 'teacher' THEN t.img_src
          WHEN u.remark = 'staff' THEN st.img_src
          ELSE NULL
        END AS user_img
      FROM users u
      LEFT JOIN roles rl ON u.roll_id = rl.id
      LEFT JOIN students s ON s.stu_id = u.id
      LEFT JOIN teachers t ON t.user_id = u.id
      LEFT JOIN staffs st ON st.user_id = u.id
      WHERE u.id = ?
      `,
      [userId]
    );

    return res.json({
      success: true,
      message: "Messages fetched successfully.",
      data: finalMessages,
      userData: userData[0],
    });

  } catch (err) {
    console.error("getMessages Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching messages.",
      error: err.message,
    });
  }
};



// ✅ Send a text / image / voice message
exports.sendMessage = async (req, res) => {
  try {
    const { conversation_id, sender_id, message_text, message_type = 'text', file_url = null, reply_to } = req.body;
    if (!conversation_id || !sender_id)
      return res.status(400).json({ success: false, message: 'conversation_id and sender_id required' });

    const [result] = await db.query(
      `INSERT INTO messages (conversation_id, sender_id, message_text, message_type, file_url , reply_to)
       VALUES (?, ?, ?, ?, ? , ?)`,
      [conversation_id, sender_id, message_text, message_type, file_url, reply_to ?? null]
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
                WHEN u.remark = 'staff' THEN st.img_src
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

// toggle star message
exports.toggleStarMessage = async (req, res) => {
  const { messageId } = req.params;
  const { isStar } = req.body;

  try {
    const [result] = await db.query(
      "UPDATE messages SET isStar = ? WHERE id = ?",
      [isStar, messageId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Message not found!"
      });
    }

    res.status(200).json({
      success: true,
      message: isStar == 1 ? "Message Starred!" : "Message Unstarred!",

    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong!"
    });
  }
};

// report message
exports.toggleReportMessage = async (req, res) => {
  const { messageId } = req.params;
  const { isReported } = req.body;   // 0 or 1

  try {
    await db.query(
      `UPDATE messages SET isReported = ? WHERE id = ?`,
      [isReported, messageId]
    );

    return res.status(200).json({
      success: true,
      message: isReported ? "Message reported" : "Message unreported",

    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Operation failed"
    });
  }
};

exports.toggleOneToOneReaction = async (req, res) => {
  const { messageId } = req.params;
  const { userId, emoji } = req.body;

  try {
    const [rows] = await db.query(
      "SELECT * FROM message_reactions WHERE message_id = ? AND user_id = ?",
      [messageId, userId]
    );

    let userReaction = null;

    if (rows.length > 0) {
      const current = rows[0];

      // Same emoji → DELETE
      if (current.emoji === emoji) {
        await db.query("DELETE FROM message_reactions WHERE id = ?", [
          current.id,
        ]);
      } else {
        // Reaction exists → UPDATE
        await db.query(
          "UPDATE message_reactions SET emoji = ? WHERE id = ?",
          [emoji, current.id]
        );
        userReaction = emoji;
      }
    } else {
      // First time reaction → INSERT
      await db.query(
        "INSERT INTO message_reactions (message_id, user_id, emoji) VALUES (?, ?, ?)",
        [messageId, userId, emoji]
      );
      userReaction = emoji;
    }

    // Fetch ALL updated reactions for this message
    const [allReactions] = await db.query(
      "SELECT user_id, emoji FROM message_reactions WHERE message_id = ?",
      [messageId]
    );

    return res.json({
      success: true,
      message: "Reaction updated",
      reactionList: allReactions,
      userReaction: userReaction,
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};









