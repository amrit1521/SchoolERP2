const db = require('../../config/db');


exports.allSection = async (req, res) => {
  try {

    const sql = `
    SELECT 
    s.id,
    s.section_name AS section,
    s.status,
    c.class_name,
    r.room_no
    FROM sections s 
    LEFT JOIN classes c ON s.class_id = c.id
    LEFT JOIN class_room r ON s.room_no = r.id
    ORDER BY s.section_name ASC
       
    `


    const [rows] = await db.query(sql);
    return res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Error in allSection:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch sections",
      error: error.message,
    });
  }
};


exports.addSection = async (req, res) => {
  try {
    const { class_id, room_no, section, status } = req.body;


    if (!class_id || !room_no || !section) {
      return res.status(400).json({
        success: false,
        message: "All fields (class_id, room_no, section, status) are required!",
      });
    }

    const sectionName = section.trim().toLowerCase();


    const [roomExists] = await db.query(
      `SELECT id FROM sections WHERE room_no = ? AND class_id != ?`,
      [room_no, class_id]
    );

    if (roomExists.length > 0) {
      return res.status(409).json({
        success: false,
        message: `Room No. '${room_no}' is already assigned to another class.`,
      });
    }


    const [sectionExists] = await db.query(
      `SELECT id FROM sections WHERE LOWER(section_name) = ? AND class_id = ?`,
      [sectionName, class_id]
    );

    if (sectionExists.length > 0) {
      return res.status(409).json({
        success: false,
        message: `Section '${section}' already exists in this class.`,
      });
    }


    const [result] = await db.query(
      `INSERT INTO sections (class_id, section_name, room_no, status)
       VALUES (?, ?, ?, ?)`,
      [class_id, sectionName, room_no, status.trim()]
    );

    return res.status(201).json({
      success: true,
      message: "Section added successfully!",
      insertId: result.insertId,
    });

  } catch (error) {
    console.error("Error in addSection:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add section",
      error: error.message,
    });
  }
};



exports.editSpecificSection = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { class_id, room_no, section, status } = req.body;
    console.log(id)
    console.log(class_id, room_no, section, status)

    if (!id || !class_id || !room_no || !section) {
      return res.status(400).json({
        success: false,
        message: "All fields must be required!",
      });
    }

    const sectionName = section.trim().toLowerCase();


    const [existing] = await db.query(
      `SELECT id FROM sections WHERE LOWER(section_name) = ? AND id != ?`,
      [sectionName, id]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: `Section '${section}' already exists`,
      });
    }

    const [result] = await db.query(
      `UPDATE sections SET class_id =? , section_name = ?,room_no =?, status = ? WHERE id = ?`,
      [class_id, sectionName, room_no, status.trim(), id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Section updated successfully",
    });
  } catch (error) {
    console.error("Error in editSpecificSection:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update section",
      error: error.message,
    });
  }
};


exports.deleteSection = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid section ID",
      });
    }

    const [result] = await db.query(`DELETE FROM sections WHERE id = ?`, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Section deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteSection:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete section",
      error: error.message,
    });
  }
};


exports.getSectionById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid section ID",
      });
    }

    const [rows] = await db.query(`SELECT id,class_id , section_name AS section ,room_no, status FROM sections WHERE id = ?`, [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    console.error("Error in getSectionById:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch section",
      error: error.message,
    });
  }
};
