const db = require('../../config/db');


exports.createPrivateConversation = async (req, res) => {
  const { sender_id, receiver_id } = req.body;
  try {
    // Check if private conversation already exists between users
    const [existing] = await db.query(
      `SELECT c.id FROM conversations c
       JOIN conversation_members m1 ON m1.conversation_id = c.id AND m1.user_id = ?
       JOIN conversation_members m2 ON m2.conversation_id = c.id AND m2.user_id = ?
       WHERE c.type = 'private'`,
      [sender_id, receiver_id]
    );

    if (existing.length > 0) {
      return res.json({
        success: true,
        message: 'Existing private conversation found.',
        data: { conversation_id: existing[0].id },
      });
    }

    // Create new private conversation
    const [result] = await db.query(
      `INSERT INTO conversations (type, created_by) VALUES ('private', ?)`,
      [sender_id]
    );
    const convId = result.insertId;

    // Insert both members
    await db.query(
      `INSERT INTO conversation_members (conversation_id, user_id, added_by) VALUES (?, ?, ?), (?, ?, ?)`,
      [convId, sender_id, sender_id, convId, receiver_id, sender_id]
    );
    return res.json({
      success: true,
      message: 'Private conversation created successfully.',
      data: { conversation_id: convId },
    });
  } catch (err) {
    console.error('createPrivateConversation Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error while creating private conversation.',
      error: err.message,
    });
  }
};

// ✅ Create Group Conversation
exports.createGroupConversation = async (req, res) => {
  const { name, created_by, members = [] } = req.body;
  try {
    const [result] = await db.query(
      `INSERT INTO conversations (name, type, created_by) VALUES (?, 'group', ?)`,
      [name, created_by]
    );
    const convId = result.insertId;

    // Add group members
    const values = members.map(m => [convId, m, created_by]);
    if (values.length) {
      await db.query(
        `INSERT INTO conversation_members (conversation_id, user_id, added_by) VALUES ?`,
        [values]
      );
    }

    // Ensure creator is also a member
    const [check] = await db.query(
      `SELECT 1 FROM conversation_members WHERE conversation_id = ? AND user_id = ?`,
      [convId, created_by]
    );


    if (check.length === 0) {
      await db.query(
        `INSERT INTO conversation_members (conversation_id, user_id, added_by) VALUES (?, ?, ?)`,
        [convId, created_by, created_by]
      );
    }

    return res.json({
      success: true,
      message: 'Group conversation created successfully.',
      data: { conversation_id: convId },
    });
  } catch (err) {
    console.error('createGroupConversation Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error while creating group conversation.',
      error: err.message,
    });
  }
};

// ✅ Add Member to Existing Conversation
exports.addMemberToConversation = async (req, res) => {
  const { conversationId } = req.params;
  const { user_id, added_by } = req.body;
  try {
    await db.query(
      `INSERT INTO conversation_members (conversation_id, user_id, added_by) VALUES (?, ?, ?)`,
      [conversationId, user_id, added_by]
    );

    return res.json({
      success: true,
      message: 'Member added to conversation successfully.',
      data: { conversation_id: conversationId, added_member: user_id },
    });
  } catch (err) {
    console.error('addMemberToConversation Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error while adding member.',
      error: err.message,
    });
  }
};

// ✅ Get Conversation Members
exports.getConversationMembers = async (req, res) => {
  const { conversationId } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT u.id, u.firstname, u.lastname, u.role 
       FROM conversation_members cm 
       JOIN users u ON cm.user_id = u.id 
       WHERE cm.conversation_id = ?`,
      [conversationId]
    );

    return res.json({
      success: true,
      message: 'Conversation members fetched successfully.',
      data: rows,
    });
  } catch (err) {
    console.error('getConversationMembers Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching conversation members.',
      error: err.message,
    });
  }
};

// ✅ Get All Conversations for a User
exports.getUserConversations = async (req, res) => {
  const { userId } = req.params;
  
  try {
    const [rows] = await db.query(
      `SELECT c.* FROM conversations c
       JOIN conversation_members cm ON cm.conversation_id = c.id
       WHERE cm.user_id = ?
       ORDER BY c.created_at DESC`,
      [userId]
    );

    return res.json({
      success: true,
      message: 'User conversations fetched successfully.',
      data: rows,
    });
  } catch (err) {
    console.error('getUserConversations Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching user conversations.',
      error: err.message,
    });
  }
};

exports.createGroupConversationViaPermission = async (req, res) => {
  const { name, created_by, members = [] } = req.body;

  try {
    // Get role of creator
    const [user] = await db.query(
      `SELECT role_id FROM users WHERE id = ?`,
      [created_by]
    );

    if (user.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const role = user[0].role_id;

    // Student cannot create groups
    if (role === 3) {
      return res.status(403).json({
        success: false,
        message: "Students are not allowed to create groups"
      });
    }

    // Teacher can only create student groups
    if (role === 2) {
      const [memberRoles] = await db.query(
        `SELECT role_id FROM users WHERE id IN (?)`,
        [members]
      );
      
      const invalid = memberRoles.filter(m => m.role_id !== 3);

      if (invalid.length > 0) {
        return res.status(403).json({
          success: false,
          message: "Teachers can create groups only with students"
        });
      }
    }

    // Create group
    const [result] = await db.query(
      `INSERT INTO conversations (name, type, created_by)
       VALUES (?, 'group', ?)`,
      [name, created_by]
    );

    const convId = result.insertId;

    // Add members
    const values = members.map(m => [convId, m, created_by]);
    if (values.length) {
      await db.query(
        `INSERT INTO conversation_members (conversation_id, user_id, added_by) VALUES ?`,
        [values]
      );
    }

    // Add creator as member if not included
    const [check] = await db.query(
      `SELECT 1 FROM conversation_members WHERE conversation_id = ? AND user_id = ?`,
      [convId, created_by]
    );

    if (!check.length) {
      await db.query(
        `INSERT INTO conversation_members (conversation_id, user_id, added_by) VALUES (?, ?, ?)`,
        [convId, created_by, created_by]
      );
    }

    return res.json({
      success: true,
      message: "Group conversation created successfully",
      data: { conversation_id: convId },
    });

  } catch (err) {
    console.error("createGroupConversation Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while creating group conversation",
      error: err.message,
    });
  }
};

