const db = require('../../config/db');


exports.addSubject = async (req, res) => {
  const { name, code, type, status } = req.body;

  try {

    const [existing] = await db.query(
      `SELECT id FROM class_subject WHERE name = ? AND code = ? AND type = ?`,
      [name, code, type]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        message: "This subject already exists!",
        success: false,
      });
    }


    const [subject_res] = await db.query(
      `INSERT INTO class_subject (name, code, type, status) VALUES (?,?,?,?)`,
      [name, code, type, status]
    );

    return res.status(201).json({
      message: "Subject added successfully!",
      success: true,
      subjectId: subject_res.insertId,
    });
  } catch (error) {
    console.error("Error in addSubject:", error);
    return res.status(500).json({
      message: "Internal server error!",
      success: false,
    });
  }
};


exports.allSubject = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, name, code, type, status FROM class_subject ORDER BY id DESC`
    );

    return res.status(200).json({
      message: "All subjects fetched successfully!",
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Error in allSubject:", error);
    return res.status(500).json({
      message: "Internal server error!",
      success: false,
    });
  }
};


exports.getSubjectById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      message: "Subject ID is required!",
      success: false,
    });
  }

  try {
    const [rows] = await db.query(
      `SELECT  name, code, type, status FROM class_subject WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Subject not found!",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Subject fetched successfully!",
      success: true,
      data: rows[0], 
    });
  } catch (error) {
    console.error("Error in getSubjectById:", error);
    return res.status(500).json({
      message: "Internal server error!",
      success: false,
    });
  }
};



exports.updateSubject = async (req, res) => {
  const { id } = req.params;
  const { name, code, type, status } = req.body;

  if (!id) {
    return res.status(400).json({
      message: "Subject ID is required!",
      success: false,
    });
  }

  try {

    const [existing] = await db.query(
      `SELECT id FROM class_subject WHERE name = ? AND code = ? AND type = ? AND id != ?`,
      [name, code, type, id]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        message: "This subject already exists!",
        success: false,
      });
    }

    const [result] = await db.query(
      `UPDATE class_subject SET name=?, code=?, type=?, status=? WHERE id=?`,
      [name, code, type, status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Subject not found!",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Subject updated successfully!",
      success: true,
    });
  } catch (error) {
    console.error("Error in updateSubject:", error);
    return res.status(500).json({
      message: "Internal server error!",
      success: false,
    });
  }
};

// ✅ Delete Subject (fixed query)
exports.deleteSubject = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      message: "Subject ID is required!",
      success: false,
    });
  }

  try {
    const [result] = await db.query(`DELETE FROM class_subject WHERE id=?`, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Subject not found!",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Subject deleted successfully!",
      success: true,
    });
  } catch (error) {
    console.error("Error in deleteSubject:", error);
    return res.status(500).json({
      message: "Internal server error!",
      success: false,
    });
  }
};
