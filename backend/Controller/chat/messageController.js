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
        m.file_original_name,
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
      file_original_name: msg.file_original_name,

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
        u.id,
        CONCAT(firstname, " ", lastname) AS name,
        u.last_seen,
        u.is_online,
        u.mobile,
        u.email,
        CASE 
          WHEN rl.role_name = 'student' THEN s.stu_img
          WHEN rl.role_name = 'teacher' THEN t.img_src
          WHEN u.remark = 'staff' THEN st.img_src
          ELSE NULL
        END AS user_img,
         CASE 
         WHEN ur.id IS NULL  THEN 0
         ELSE 1
         END AS is_reported
      FROM users u
      LEFT JOIN roles rl ON u.roll_id = rl.id
      LEFT JOIN students s ON s.stu_id = u.id
      LEFT JOIN teachers t ON t.user_id = u.id
      LEFT JOIN staffs st ON st.user_id = u.id 
      LEFT JOIN user_reports ur ON ur.reported_user_id=u.id AND ur.conversation_id=?
      WHERE u.id = ?
      `,
      [conversationId, userId]
    );

    const [converRes] =await db.query('SELECT type , name AS roomname, created_at FROM conversations WHERE id=?' ,[conversationId])

    // ⭐ Get star count
    const [starCountResult] = await db.query(
      `
  SELECT COUNT(*) AS starCount 
  FROM messages 
  WHERE sender_id = ? AND conversation_id = ? AND isStar = 1
  `,
      [userId, conversationId]
    );

    const starCount = starCountResult[0].starCount;


    return res.json({
      success: true,
      message: "Messages fetched successfully.",
      data: finalMessages,
      userData: {
        ...userData[0],
        starCount: starCount,
        ...converRes[0]
      }
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

exports.sendMessage = async (req, res) => {
  try {
    const {
      conversation_id,
      sender_id,
      message_text,
      message_type = "text",
      file_url = null,
      reply_to = null,
    } = req.body;

    if (!conversation_id || !sender_id) {
      return res.status(400).json({
        success: false,
        message: "conversation_id and sender_id required",
      });
    }

    // Insert message
    const [result] = await db.query(
      `INSERT INTO messages 
       (conversation_id, sender_id, message_text, message_type, file_url, reply_to)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [conversation_id, sender_id, message_text, message_type, file_url, reply_to]
    );

    const insertedId = result.insertId;

    // ⭐ Select full formatted message (same as getMessages)
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
        m.file_original_name,
        m.reply_to,

        -- Reply data
        reply.id AS reply_id,
        reply.message_text AS reply_message_text,
        reply.file_url AS reply_file_url,
        reply.message_type AS reply_message_type,

        -- Empty reaction array (new message = no reaction)
        '[]' AS reaction,

        -- User info
        CONCAT(u.firstname, " ", u.lastname) AS name,
        CASE 
          WHEN rl.role_name = 'student' THEN s.stu_img
          WHEN rl.role_name = 'teacher' THEN t.img_src
          WHEN u.remark = 'staff' THEN st.img_src
          ELSE NULL
        END AS user_img

      FROM messages m
      LEFT JOIN messages reply ON reply.id = m.reply_to
      LEFT JOIN users u ON m.sender_id = u.id
      LEFT JOIN roles rl ON u.roll_id = rl.id
      LEFT JOIN students s ON s.stu_id = u.id
      LEFT JOIN teachers t ON t.user_id = u.id
      LEFT JOIN staffs st ON st.user_id = u.id
      WHERE m.id = ?
      `,
      [insertedId]
    );

    let msg = rows[0];

    // ⭐ final cleaned JSON same as getMessages
    const finalMessage = {
      id: msg.id,
      conversation_id: msg.conversation_id,
      sender_id: msg.sender_id,
      message_text: msg.message_text,
      message_type: msg.message_type,
      file_url: msg.file_url,
      created_at: msg.created_at,
      isStar: msg.isStar,
      isReported: msg.isReported,
      file_original_name: msg.file_original_name,

      reply: msg.reply_id
        ? {
          id: msg.reply_id,
          message_text: msg.reply_message_text,
          message_type: msg.reply_message_type,
          file_url: msg.reply_file_url,
        }
        : null,

      reaction: [],

      name: msg.name,
      user_img: msg.user_img,
    };

    // Emit
    const io = req.app.get("io");
    if (io) {
      io.to(`conversation_${conversation_id}`).emit("new_message", finalMessage);
    }

    res.json({
      success: true,
      message: "Message sent successfully.",
      data: finalMessage,
    });
  } catch (err) {
    console.error("sendMessage Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};


exports.sendFileMessage = async (req, res) => {
  try {
    let { conversation_id, sender_id, reply_to } = req.body;
    reply_to = reply_to === "null" || reply_to === "" ? null : reply_to;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least 1 file is required."
      });
    }

    let savedMessages = [];

    for (const file of files) {
      let message_type = "file";
      if (file.mimetype.startsWith("image/")) message_type = "image";
      else if (file.mimetype.startsWith("video/")) message_type = "video";
      else if (file.mimetype.startsWith("audio/")) message_type = "audio";
      else if (
        file.mimetype === "application/pdf" ||
        file.mimetype.includes("document")
      ) message_type = "document";
      const [result] = await db.query(
        `INSERT INTO messages 
           (conversation_id, sender_id, message_text, message_type, file_url, file_original_name, reply_to)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          conversation_id,
          sender_id,
          file.originalname,
          message_type,
          file.filename,
          file.originalname,
          reply_to
        ]
      );

      const insertedId = result.insertId;
      const [rows] = await db.query(
        `
        SELECT 
          m.id,
          m.conversation_id,
          m.sender_id,
          m.message_text,
          m.message_type,
          m.file_url,
          m.created_at,
          m.isStar,
          m.isReported,
          m.file_original_name,
          m.reply_to,

          -- reply info
          r.id AS reply_id,
          r.message_text AS reply_message_text,
          r.file_url AS reply_file_url,
          r.message_type AS reply_message_type,

          -- no reaction for new files
          '[]' AS reaction,

          -- user info
          CONCAT(u.firstname, " ", u.lastname) AS name,
          CASE 
            WHEN rl.role_name = 'student' THEN s.stu_img
            WHEN rl.role_name = 'teacher' THEN t.img_src
            WHEN u.remark = 'staff' THEN st.img_src
            ELSE NULL
          END AS user_img

        FROM messages m
        LEFT JOIN messages r ON r.id = m.reply_to
        LEFT JOIN users u ON m.sender_id = u.id
        LEFT JOIN roles rl ON u.roll_id = rl.id
        LEFT JOIN students s ON s.stu_id = u.id
        LEFT JOIN teachers t ON t.user_id = u.id
        LEFT JOIN staffs st ON st.user_id = u.id
        WHERE m.id = ?
        `,
        [insertedId]
      );

      let msg = rows[0];


      savedMessages.push({
        id: msg.id,
        conversation_id: msg.conversation_id,
        sender_id: msg.sender_id,
        message_text: msg.message_text,
        message_type: msg.message_type,
        file_url: msg.file_url,
        created_at: msg.created_at,
        isStar: msg.isStar,
        isReported: msg.isReported,
        file_original_name: msg.file_original_name,

        reply: msg.reply_id
          ? {
            id: msg.reply_id,
            message_text: msg.reply_message_text,
            message_type: msg.reply_message_type,
            file_url: msg.reply_file_url
          }
          : null,

        reaction: [],

        name: msg.name,
        user_img: msg.user_img
      });
    }

    // 🔥 Emit each file message real-time
    const io = req.app.get("io");
    if (io) {
      savedMessages.forEach((msg) => {
        io.to(`conversation_${conversation_id}`).emit("new_message", msg);
      });
    }

    console.log(savedMessages)

    return res.json({
      success: true,
      message: "Files sent successfully.",
      data: savedMessages
    });

  } catch (err) {
    console.error("sendFileMessage Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message
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
    console.log(messageData.conversation_id)
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
    const [msg] = await db.query(`SELECT conversation_id FROM messages WHERE id = ?`, [messageId]);
    if (msg.length === 0) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    await db.query(
      "UPDATE messages SET isStar = ? WHERE id = ?",
      [isStar, messageId]
    );

    // 👉 REAL-TIME EMIT
    const io = req.app.get("io");
    if (io) {
      io.to(`conversation_${msg[0].conversation_id}`).emit("star_updated", {
        messageId,
        isStar
      });
    }
    console.log(msg[0].conversation_id)

    res.json({
      success: true,
      message: isStar ? "Message Starred" : "Message Unstarred"
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};


// report message
exports.toggleReportMessage = async (req, res) => {
  const { messageId } = req.params;
  const { isReported } = req.body;

  try {
    const [msg] = await db.query(`SELECT conversation_id FROM messages WHERE id = ?`, [messageId]);
    if (msg.length === 0) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    await db.query(
      `UPDATE messages SET isReported = ? WHERE id = ?`,
      [isReported, messageId]
    );

    // 👉 REAL-TIME EMIT
    const io = req.app.get("io");
    if (io) {
      io.to(`conversation_${msg[0].conversation_id}`).emit("report_updated", {
        messageId,
        isReported
      });
    }

    res.json({
      success: true,
      message: isReported ? "Message reported" : "Message unreported",
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Operation failed"
    });
  }
};


exports.toggleOneToOneReaction = async (req, res) => {
  const { messageId } = req.params;
  const { userId, emoji } = req.body;

  try {
    const [msg] = await db.query(`SELECT conversation_id FROM messages WHERE id = ?`, [messageId]);
    if (msg.length === 0) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    const conversation_id = msg[0].conversation_id;

    const [rows] = await db.query(
      "SELECT * FROM message_reactions WHERE message_id = ? AND user_id = ?",
      [messageId, userId]
    );

    let userReaction = null;

    if (rows.length > 0) {
      const current = rows[0];

      if (current.emoji === emoji) {
        await db.query("DELETE FROM message_reactions WHERE id = ?", [current.id]);
      } else {
        await db.query("UPDATE message_reactions SET emoji = ? WHERE id = ?", [
          emoji,
          current.id,
        ]);
        userReaction = emoji;
      }
    } else {
      await db.query(
        "INSERT INTO message_reactions (message_id, user_id, emoji) VALUES (?, ?, ?)",
        [messageId, userId, emoji]
      );
      userReaction = emoji;
    }

    const [allReactions] = await db.query(
      "SELECT user_id, emoji FROM message_reactions WHERE message_id = ?",
      [messageId]
    );

    // 👉 REAL-TIME EMIT
    const io = req.app.get("io");
    if (io) {
      io.to(`conversation_${conversation_id}`).emit("reaction_updated", {
        messageId,
        reactions: allReactions
      });
    }

    res.json({
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










