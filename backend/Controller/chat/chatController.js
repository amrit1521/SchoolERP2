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

exports.createGroupConversationViaPermission = async (req, res) => {
  const { name, created_by, members = [] } = req.body;

  try {

    const [user] = await db.query(
      `SELECT 
        r.role_name AS role
       FROM users u
       JOIN roles r ON r.id = u.roll_id
       WHERE u.id = ?`,
      [created_by]
    );

    if (!user.length) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const role = user[0].role.toLowerCase();


    if (role === "student") {
      return res.status(403).json({
        success: false,
        message: "Students are not allowed to create groups",
      });
    }


    if (role === "teacher") {
      const [memberRoles] = await db.query(
        `SELECT r.role_name AS role
         FROM users u
         JOIN roles r ON r.id = u.roll_id
         WHERE u.id IN (?)`,
        [members]
      );

      const invalidMembers = memberRoles.filter(
        (m) => m.role.toLowerCase() !== "student"
      );

      if (invalidMembers.length > 0) {
        return res.status(403).json({
          success: false,
          message: "Teachers can create groups only with students",
        });
      }
    }


    const [result] = await db.query(
      `INSERT INTO conversations (name, type, created_by)
       VALUES (?, 'group', ?)`,
      [name, created_by]
    );

    const convId = result.insertId;
    const values = members.map((m) => [convId, m, created_by]);

    if (values.length > 0) {
      await db.query(
        `INSERT INTO conversation_members (conversation_id, user_id, added_by)
         VALUES ?`,
        [values]
      );
    }

    const [check] = await db.query(
      `SELECT 1
         FROM conversation_members 
         WHERE conversation_id = ? AND user_id = ?`,
      [convId, created_by]
    );

    if (!check.length) {
      await db.query(
        `INSERT INTO conversation_members (conversation_id, user_id, added_by)
         VALUES (?, ?, ?)`,
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

exports.addMemberToGroup = async (req, res) => {
  const { conversationId } = req.params;
  const { members = [], added_by } = req.body; // members = array of userIds

  try {
    // --------------------------------------------
    // 1️⃣ Validate members array
    // --------------------------------------------
    if (!Array.isArray(members) || members.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Members must be a non-empty array",
      });
    }

    // --------------------------------------------
    // 2️⃣ Check if conversation exists + get creator
    // --------------------------------------------
    const [conv] = await db.query(
      `SELECT created_by FROM conversations WHERE id = ?`,
      [conversationId]
    );

    if (!conv.length) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    const creatorId = conv[0].created_by;

    // --------------------------------------------
    // 3️⃣ Check permission (Only creator or admin)
    // --------------------------------------------
    const [roleRes] = await db.query(
      `SELECT r.role_name AS role
       FROM users u 
       JOIN roles r ON r.id = u.roll_id
       WHERE u.id = ?`,
      [added_by]
    );

    if (!roleRes.length) {
      return res.status(404).json({
        success: false,
        message: "Adding user not found",
      });
    }

    const isAdmin = roleRes[0].role.toLowerCase() === "admin";
    const isCreator = added_by === creatorId;

    if (!isAdmin && !isCreator) {
      return res.status(403).json({
        success: false,
        message: "Only group creator or admin can add members",
      });
    }

    // --------------------------------------------
    // 4️⃣ Filter: Remove already added members
    // --------------------------------------------
    const [existing] = await db.query(
      `SELECT user_id FROM conversation_members WHERE conversation_id = ?`,
      [conversationId]
    );

    const existingIds = new Set(existing.map((m) => m.user_id));

    const newMembers = members.filter((id) => !existingIds.has(id));

    if (newMembers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "All provided members are already in the group",
      });
    }

    // --------------------------------------------
    // 5️⃣ Prepare data for bulk insert
    // --------------------------------------------
    const insertValues = newMembers.map((id) => [
      conversationId,
      id,
      added_by,
    ]);

    // --------------------------------------------
    // 6️⃣ Insert multiple users
    // --------------------------------------------
    await db.query(
      `INSERT INTO conversation_members (conversation_id, user_id, added_by)
       VALUES ?`,
      [insertValues]
    );

    return res.json({
      success: true,
      message: "Members added successfully",
      added_members: newMembers,
      conversation_id: conversationId,
    });

  } catch (err) {
    console.error("addMemberToConversation Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while adding members",
      error: err.message,
    });
  }
};


exports.getConversationMembers = async (req, res) => {
  const { conversationId } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT u.id AS user_id, CONCAT(u.firstname,' ' ,u.lastname) AS name, r.role_name,
      CASE 
                WHEN r.role_name = 'student' THEN s.stu_img
                WHEN r.role_name = 'teacher' THEN t.img_src
                WHEN u.remark = 'staff' THEN st.img_src
                ELSE NULL
                END AS user_img
       FROM conversation_members cm 
       JOIN users u ON cm.user_id = u.id 
       JOIN roles r ON r.id = u.roll_id
       LEFT JOIN students s ON s.stu_id = u.id
       LEFT JOIN teachers t ON t.user_id = u.id
       LEFT JOIN staffs st ON st.user_id = u.id
       WHERE cm.conversation_id = ?`,
      [conversationId]
    );

    const [roomRes] = await db.query('SELECT id , name FROM conversations WHERE id=? ' , [conversationId])

    return res.json({
      success: true,
      message: 'Conversation members fetched successfully.',
      data: rows,
      group:roomRes[0]
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

exports.removeMemberFromGroup = async (req, res) => {
  const { conversationId } = req.params;
  const { memberId, removedBy } = req.body;
  

  try {

    const [rows] = await db.query(
      `SELECT 
         (SELECT created_by FROM conversations WHERE id = ?) AS creatorId,
         (SELECT r.role_name 
            FROM users u JOIN roles r ON r.id = u.roll_id 
            WHERE u.id = ?) AS removerRole`,
      [conversationId, removedBy]
    );

    if (!rows.length || !rows[0].creatorId) {
      return res.status(404).json({ success: false, message: "Conversation not found" });
    }

    const { creatorId, removerRole } = rows[0];

    if (removedBy !== creatorId && removerRole?.toLowerCase() !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only group creator or admin can remove members",
      });
    }

    if (memberId === creatorId) {
      return res.status(403).json({
        success: false,
        message: "Creator cannot remove himself",
      });
    }

    const [exists] = await db.query(
      `SELECT 1 FROM conversation_members WHERE conversation_id = ? AND user_id = ?`,
      [conversationId, memberId]
    );

    if (!exists.length) {
      return res.status(400).json({
        success: false,
        message: "This user is not a member of the group",
      });
    }

  
    await db.query(
      `DELETE FROM conversation_members WHERE conversation_id = ? AND user_id = ?`,
      [conversationId, memberId]
    );

    return res.json({
      success: true,
      message: "Member removed successfully",
      data: { conversation_id: conversationId, removed_member: memberId },
    });

  } catch (err) {
    console.error("removeMember Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while removing member",
      error: err.message,
    });
  }
};


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


exports.deleteRoom = async (req, res) => {
  const { conversationId } = req.params;

  if (!conversationId) {
    return res.status(400).json({
      success: false,
      message: "Room ID is required!",
    });
  }

  try {
    // Delete conversation
    const [row] = await db.query(
      `DELETE FROM conversations WHERE id = ?`,
      [conversationId]
    );

    if (row.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Room chat not found!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Chat deleted successfully!",
    });

  } catch (error) {
    console.log("deleteRoom Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
      error: error.message,
    });
  }
};

exports.clearRoomChat = async (req, res) => {
  const { conversationId } = req.params;

  if (!conversationId) {
    return res.status(400).json({
      success: false,
      message: "Conversation ID is required!"
    });
  }

  try {
    // Start Transaction
    await db.query("START TRANSACTION");

    // 🔥 Delete reactions first (else FK error)
    await db.query(
      `DELETE FROM message_reactions 
       WHERE message_id IN (SELECT id FROM messages WHERE conversation_id = ?)`,
      [conversationId]
    );

    // 🔥 Delete messages
    const [delMsg] = await db.query(
      `DELETE FROM messages WHERE conversation_id = ?`,
      [conversationId]
    );

    await db.query("COMMIT");

    return res.status(200).json({
      success: true,
      message: "Chat cleared successfully!",
      deletedMessages: delMsg.affectedRows
    });

  } catch (error) {
    await db.query("ROLLBACK");
    console.log("clearRoomChat Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error while clearing chat!",
      error: error.message
    });
  }
};


