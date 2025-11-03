const db = require('../../config/db');


// ✅ Get all messages in a conversation
exports.getMessages = async (req, res) => {
  const { conversationId } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT 
        m.*, 
        u.firstname, 
        u.lastname 
       FROM messages m 
       LEFT JOIN users u ON m.sender_id = u.id 
       WHERE m.conversation_id = ? 
       ORDER BY m.created_at ASC`,
      [conversationId]
    );

    return res.json({
      success: true,
      message: 'Messages fetched successfully.',
      data: rows,
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
    const {
      conversation_id,
      sender_id,
      message_text,
      message_type = 'text',
      file_url = null,
    } = req.body;

    // Insert new message
    const [result] = await db.query(
      `INSERT INTO messages 
        (conversation_id, sender_id, message_text, message_type, file_url)
       VALUES (?, ?, ?, ?, ?)`,
      [conversation_id, sender_id, message_text, message_type, file_url]
    );

    const messageId = result.insertId;

    // Fetch complete message details with user info
    const [rows] = await db.query(
      `SELECT 
        m.*, 
        u.firstname, 
        u.lastname 
       FROM messages m 
       JOIN users u ON m.sender_id = u.id 
       WHERE m.id = ?`,
      [messageId]
    );

    const messageRow = rows[0];

    // Emit the message via Socket.IO
    const io = req.app.get('io');
    if (io) {
      const room = `conversation_${conversation_id}`;
      io.to(room).emit('new_message', messageRow);
    }

    return res.json({
      success: true,
      message: 'Message sent successfully.',
      data: messageRow,
    });
  } catch (err) {
    console.error('sendMessage Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error while sending message.',
      error: err.message,
    });
  }
};

// ✅ Send message with file (image, video, pdf, etc.)
exports.sendFileMessage = async (req, res) => {
  try {
    const { conversation_id, sender_id, message_type = 'file' } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'File is required.',
      });
    }

    // Generate file URL (adjust this path based on your project)
    const fileUrl = `/api/stu/uploads/image/${file.filename}`;

    // Insert message record
    const [result] = await db.query(
      `INSERT INTO messages 
        (conversation_id, sender_id, message_text, message_type, file_url) 
       VALUES (?, ?, ?, ?, ?)`,
      [conversation_id, sender_id, file.originalname, message_type, fileUrl]
    );

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

    // Emit file message through Socket.IO
    const io = req.app.get('io');
    if (io) {
      io.to(`conversation_${conversation_id}`).emit('new_message', messageRow);
    }

    return res.json({
      success: true,
      message: 'File message sent successfully.',
      data: messageRow,
    });
  } catch (err) {
    console.error('sendFileMessage Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error while sending file message.',
      error: err.message,
    });
  }
};


exports.getLastMessageAllConverationForSpecficUser  =async(req,res)=>{

    const {id} = req.params;
    const sql = `
    SELECT 
  c.id AS conversation_id,
  c.type,
  CASE 
    WHEN c.type = 'private' THEN 
      (SELECT CONCAT(u.firstname, ' ', u.lastname) 
       FROM users u 
       JOIN conversation_members cm2 ON cm2.user_id = u.id 
       WHERE cm2.conversation_id = c.id AND u.id != :userId LIMIT 1)
    ELSE c.name 
  END AS conversation_name,
  (SELECT message_text FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) AS last_message,
  (SELECT created_at FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) AS last_message_time
FROM conversations c
JOIN conversation_members cm ON cm.conversation_id = c.id
WHERE cm.user_id = :userId
ORDER BY last_message_time DESC;
`

    try {

        const [rows] = await db.query(sql , userId)
        
    } catch (error) {
        
    }
}

