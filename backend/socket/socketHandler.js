// socket/socketHandler.js
const pool = require('../config/db');

module.exports = (io) => {
  const userSockets = {}; 

  io.on('connection', (socket) => {
    console.log("🔵 Socket connected:", socket.id);

    // =====================================================
    // 🟢 USER CONNECTED EVENT
    // =====================================================
    socket.on("user_connected", async (userId) => {
      try {
        if (!userId) return;

        if (!userSockets[userId]) userSockets[userId] = new Set();
        userSockets[userId].add(socket.id);

        console.log(`✅ User ${userId} connected with socket ${socket.id}`);

        // Only update DB when first device connects
        if (userSockets[userId].size === 1) {
          await pool.query(
            "UPDATE users SET is_online = 1 WHERE id = ?",
            [userId]
          );

          // Notify all users that user came online
          io.emit("user_status_change", {
            userId,
            is_online: 1,
          });
        }
      } catch (err) {
        console.error("socket user_connected error:", err);
      }
    });

    // =====================================================
    // 🟢 JOIN ROOM
    // =====================================================
    socket.on("join_conversation", (conversationId) => {
      if (!conversationId) return;

      const room = `conversation_${conversationId}`;
      socket.join(room);

      console.log(`🟢 Socket ${socket.id} joined room ${room}`);
    });

    // =====================================================
    // 🔵 LEAVE ROOM
    // =====================================================
    socket.on("leave_conversation", (conversationId) => {
      if (!conversationId) return;

      const room = `conversation_${conversationId}`;
      socket.leave(room);

      console.log(`🔵 Socket ${socket.id} left room ${room}`);
    });

    // =====================================================
    // 📩 SEND MESSAGE (text / file / audio)
    // =====================================================
    socket.on("send_message", async (data) => {
      try {
        const {
          conversation_id,
          sender_id,
          message_text,
          message_type = "text",
          file_url = null,
        } = data;

        if (!conversation_id || !sender_id) return;

        // 1️⃣ SAVE MESSAGE IN DB
        const [result] = await pool.query(
          `INSERT INTO messages 
           (conversation_id, sender_id, message_text, message_type, file_url)
           VALUES (?, ?, ?, ?, ?)`,
          [conversation_id, sender_id, message_text, message_type, file_url]
        );

        const messageId = result.insertId;

        // 2️⃣ GET MESSAGE + SENDER DATA
        const [rows] = await pool.query(
          `SELECT m.*, u.firstname, u.lastname
           FROM messages m
           JOIN users u ON m.sender_id = u.id
           WHERE m.id = ?`,
          [messageId]
        );

        const messageRow = rows[0];
        const room = `conversation_${conversation_id}`;

        // 3️⃣ SEND MESSAGE TO ROOM (REALTIME CHAT)
        io.to(room).emit("new_message", messageRow);

        // 4️⃣ SEND TO SIDEBAR PREVIEW (all members)
        const [members] = await pool.query(
          `SELECT user_id FROM conversation_members 
           WHERE conversation_id = ?`,
          [conversation_id]
        );

        members.forEach((m) => {
          const sockets = userSockets[m.user_id];
          if (sockets) {
            sockets.forEach((sid) => {
              io.to(sid).emit("conversation_activity", {
                conversation_id,
                message: messageRow,
              });
            });
          }
        });

      } catch (err) {
        console.error("Error in send_message:", err);
      }
    });

    // =====================================================
    // 🗑 DELETE MESSAGE
    // =====================================================
    socket.on("delete_message", async ({ messageId, userId }) => {
      try {
        if (!messageId || !userId) return;

        const [msg] = await pool.query(
          `SELECT * FROM messages WHERE id = ?`,
          [messageId]
        );

        if (msg.length === 0) return;

        const messageData = msg[0];

        // Optional: only sender can delete
        if (messageData.sender_id !== userId) {
          console.log(
            `⚠️ User ${userId} tried to delete message ${messageId} (not owner)`
          );
          return;
        }

        // Delete
        await pool.query(`DELETE FROM messages WHERE id = ?`, [messageId]);

        const room = `conversation_${messageData.conversation_id}`;

        // Emit to room
        io.to(room).emit("message_deleted", { messageId });

        console.log(`🗑 Message ${messageId} deleted by user ${userId}`);
      } catch (err) {
        console.error("delete_message error:", err);
      }
    });

    // =====================================================
    // 🔴 DISCONNECT EVENT
    // =====================================================
    socket.on("disconnect", async () => {
      try {
        console.log(`🔴 Socket disconnected: ${socket.id}`);

        for (const [userId, sockets] of Object.entries(userSockets)) {
          if (sockets.has(socket.id)) {
            sockets.delete(socket.id);

            // If all devices of the user are disconnected
            if (sockets.size === 0) {
              delete userSockets[userId];

              await pool.query(
                `UPDATE users 
                 SET is_online = 0, last_seen = NOW() 
                 WHERE id = ?`,
                [userId]
              );

              io.emit("user_status_change", {
                userId,
                is_online: 0,
              });

              console.log(`🔴 User ${userId} is now offline`);
            }
            break;
          }
        }
      } catch (err) {
        console.error("disconnect error:", err);
      }
    });
  });
};
