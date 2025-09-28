const db = require('../../config/db');


exports.addReason = async (req, res) => {
  try {
    const { reasonName, role, status } = req.body;

    if (!reasonName || !role) {
      return res.status(400).json({ 
        success: false, 
        message: "All fields are required" 
      });
    }

    const sql = `INSERT INTO academicReason (reasonName, role, status) VALUES (?, ?, ?)`; 
    const [result] = await db.query(sql, [reasonName, role, status]);

    return res.status(201).json({
      success: true,
      message: "Reason inserted successfully",
    });
  } catch (err) {
    console.error("Insert Error:", err);
    res.status(500).json({ 
      success: false,
      message: "Database error", 
      error: err 
    });
  }
};


exports.allReason = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM academicReason ORDER BY id DESC");
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ 
      success: false,
      message: "Database error", 
      error: err 
    });
  }
};


exports.getReasonById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query("SELECT reasonName,role,status FROM academicReason WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: "Reason not found" 
      });
    }

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error("Fetch By ID Error:", err);
    res.status(500).json({ 
      success: false,
      message: "Database error", 
      error: err 
    });
  }
};

exports.updateReason = async (req, res) => {
  try {
    const { id } = req.params;
    const { reasonName, role, status } = req.body;

    const sql = `UPDATE academicReason SET reasonName=?, role=?, status=?, updated_at=NOW() WHERE id=?`;
    const [result] = await db.query(sql, [reasonName, role, status, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false,
        message: "Reason not found" 
      });
    }

    res.json({ success: true, message: "Reason updated successfully" });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ 
      success: false,
      message: "Database error", 
      error: err 
    });
  }
};


exports.deleteReason = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `DELETE FROM academicReason WHERE id=?`;
    const [result] = await db.query(sql, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false,
        message: "Reason not found" 
      });
    }

   return res.json({ success: true, message: "Reason deleted successfully" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ 
      success: false,
      message: "Database error", 
      error: err 
    });
  }
};
