const db = require('../../config/db');


exports.allSection = async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT id, section, status FROM classSection ORDER BY section ASC`);
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
    const { section, status } = req.body;

    if (!section || !status) {
      return res.status(400).json({
        success: false,
        message: "All fields must be required!",
      });
    }

    const sectionName = section.trim().toLowerCase();

   
    const [existing] = await db.query(
      `SELECT id FROM classSection WHERE LOWER(section) = ?`,
      [sectionName]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: `Section '${section}' already exists`,
      });
    }

    const [result] = await db.query(
      `INSERT INTO classSection (section, status) VALUES (?, ?)`,
      [sectionName, status.trim()]
    );

    return res.status(201).json({
      success: true,
      message: "Section added successfully",
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
    const { section, status } = req.body;

    if (!id || !section || !status) {
      return res.status(400).json({
        success: false,
        message: "All fields must be required!",
      });
    }

    const sectionName = section.trim().toLowerCase();

    
    const [existing] = await db.query(
      `SELECT id FROM classSection WHERE LOWER(section) = ? AND id != ?`,
      [sectionName, id]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: `Section '${section}' already exists`,
      });
    }

    const [result] = await db.query(
      `UPDATE classSection SET section = ?, status = ? WHERE id = ?`,
      [sectionName, status.trim(), id]
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

    const [result] = await db.query(`DELETE FROM classSection WHERE id = ?`, [id]);

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

    const [rows] = await db.query(`SELECT id, section, status FROM classSection WHERE id = ?`, [id]);

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
