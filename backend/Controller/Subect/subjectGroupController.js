const db = require("../../config/db");


exports.addSubjectGroup = async (req, res) => {
  let { className, section, subjectGroup, status } = req.body;

  try {

    if (!className || !section || !subjectGroup || !status) {
      return res.status(400).json({
        success: false,
        message: "Class, Section, Subject Group, and Status are required!",
      });
    }

    const cleanSubjectGroup = subjectGroup.trim();

    const [existing] = await db.query(
      "SELECT * FROM subject_group WHERE className=? AND section=? AND subjectGroup=?",
      [className, section, cleanSubjectGroup]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "This subject group already exists for the selected class and section!",
      });
    }
 
    const [result] = await db.query(
      "INSERT INTO subject_group (className, section, subjectGroup, status) VALUES (?, ?, ?, ?)",
      [className, section, cleanSubjectGroup, status]
    );

    return res.status(201).json({
      success: true,
      message: "Subject Group added successfully",
      subjectGroupId: result.insertId,
    });
  } catch (error) {
    console.error("AddSubjectGroup Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


exports.getAllSubjectGroups = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM subject_group ORDER BY created_at DESC");
    return res.status(200).json({
      success: true,
      count: rows.length,
      data: rows,
    });
  } catch (error) {
    console.error("GetAllSubjectGroups Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch subject groups",
    });
  }
};


exports.getSubjectGroupById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query("SELECT * FROM subject_group WHERE id=?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Subject Group not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    console.error("GetSubjectGroupById Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch subject group",
    });
  }
};


exports.updateSubjectGroup = async (req, res) => {
  const { id } = req.params;
  let { className, section, subjectGroup, status } = req.body;

  try {
    const [existing] = await db.query("SELECT * FROM subject_group WHERE id=?", [id]);

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Subject Group not found",
      });
    }

    const cleanSubjectGroup = subjectGroup?.trim() || existing[0].subjectGroup;

    await db.query(
      "UPDATE subject_group SET className=?, section=?, subjectGroup=?, status=?, updated_at=CURRENT_TIMESTAMP WHERE id=?",
      [className || existing[0].className, section || existing[0].section, cleanSubjectGroup, status || existing[0].status, id]
    );

    return res.status(200).json({
      success: true,
      message: "Subject Group updated successfully",
    });
  } catch (error) {
    console.error("UpdateSubjectGroup Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update subject group",
    });
  }
};


exports.deleteSubjectGroup = async (req, res) => {
  const { id } = req.params;

  try {
    const [existing] = await db.query("SELECT * FROM subject_group WHERE id=?", [id]);

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Subject Group not found",
      });
    }

    await db.query("DELETE FROM subject_group WHERE id=?", [id]);

    return res.status(200).json({
      success: true,
      message: "Subject Group deleted successfully",
    });
  } catch (error) {
    console.error("DeleteSubjectGroup Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete subject group",
    });
  }
};
