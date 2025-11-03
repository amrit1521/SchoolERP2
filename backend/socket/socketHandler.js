// socket/socketHandler.js
const pool = require('../config/db');

module.exports = (io) => {
  // onlineUsers maps userId -> socketId
  const onlineUsers = new Map();

  io.on('connection', (socket) => {
    console.log('🔵 Socket connected:', socket.id);

    // client should emit 'user_connected' with userId after auth/login
    socket.on('user_connected', async (userId) => {
      try {
        onlineUsers.set(String(userId), socket.id);
        console.log('User online:', userId, 'socket:', socket.id);

        // update DB user status optional:
        await pool.query('UPDATE users SET is_online = 1 WHERE id = ?', [userId]);
        // (You can broadcast user's online change)
        io.emit('user_status_change', { userId, is_online: 1 });
      } catch (err) {
        console.error('socket user_connected error', err);
      }
    });

    // join conversation room (client will call this when opening chat)
    socket.on('join_conversation', (conversationId) => {
      const room = `conversation_${conversationId}`;
      socket.join(room);
      console.log(`Socket ${socket.id} joined room ${room}`);
    });

    // leave conversation
    socket.on('leave_conversation', (conversationId) => {
      const room = `conversation_${conversationId}`;
      socket.leave(room);
      console.log(`Socket ${socket.id} left room ${room}`);
    });

    // private message (client can directly call API or socket)
    socket.on('send_message', async (data) => {
      // data should contain: conversation_id, sender_id, message_text, message_type, file_url(optional)
      try {
        const { conversation_id, sender_id, message_text, message_type = 'text', file_url = null } = data;

        // Save to DB
        const [result] = await pool.query(
          `INSERT INTO messages (conversation_id, sender_id, message_text, message_type, file_url)
           VALUES (?, ?, ?, ?, ?)`,
          [conversation_id, sender_id, message_text, message_type, file_url]
        );

        const messageId = result.insertId;

        // fetch the inserted message row to emit (optional)
        const [rows] = await pool.query(`SELECT m.*, u.firstname, u.lastname FROM messages m JOIN users u ON m.sender_id = u.id WHERE m.id = ?`, [messageId]);
        const messageRow = rows[0];

        // Emit to all sockets in conversation room (group & private)
        const room = `conversation_${conversation_id}`;
        io.to(room).emit('new_message', messageRow);

        // Optionally emit to individual online users (if you store members list)
        // e.g., you can query conversation_members and notify specific user sockets
        const [members] = await pool.query('SELECT user_id FROM conversation_members WHERE conversation_id = ?', [conversation_id]);
        for (const m of members) {
          const sockId = onlineUsers.get(String(m.user_id));
          if (sockId) {
            io.to(sockId).emit('conversation_activity', { conversation_id, message: messageRow });
          }
        }
      } catch (err) {
        console.error('Error in send_message socket handler', err);
      }
    });

    // handle disconnect
    socket.on('disconnect', async () => {
      try {
        // find userId by socket id and remove
        for (const [userId, sId] of onlineUsers.entries()) {
          if (sId === socket.id) {
            onlineUsers.delete(userId);
            await pool.query('UPDATE users SET is_online = 0 WHERE id = ?', [userId]);
            io.emit('user_status_change', { userId, is_online: 0 });
            break;
          }
        }
      } catch (err) {
        console.error('disconnect error', err);
      }
      console.log('🔴 Socket disconnected:', socket.id);
    });
  });
};
