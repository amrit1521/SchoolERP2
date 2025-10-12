
const db = require('../../config/db')

exports.addDesignation = async (req, res) => {
  try {
    let { designation, status } = req.body;

    if (!designation) {
      return res.status(400).json({ message: "Designation name is required!", success: false });
    }

    designation = designation.trim().toLowerCase();


    const [existing] = await db.query(
      "SELECT id FROM designation WHERE LOWER(name) = ?",
      [designation]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        message: "Designation already exists!",
        success: false,
      });
    }

    const [result] = await db.query(
      "INSERT INTO designation (name, status) VALUES (?, ?)",
      [designation, status]
    );

    return res.status(201).json({
      message: "Designation added successfully",
      success: true,
      id: result.insertId,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};


exports.getDesignations = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, name as designation, status FROM designation ORDER BY id ASC");
    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

exports.getDesignationById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query("SELECT id, name as designation, status FROM designation WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Designation not found", success: false });
    }
    return res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};


exports.updateDesignation = async (req, res) => {
  const { id } = req.params;
  let { designation, status } = req.body;

  if (!designation) {
    return res.status(400).json({ message: "Designation name is required!", success: false });
  }

  try {
    designation = designation.trim().toLowerCase();

    const [duplicate] = await db.query(
      "SELECT id FROM designation WHERE LOWER(name) = ? AND id != ?",
      [designation, id]
    );

    if (duplicate.length > 0) {
      return res.status(400).json({
        message: "Another designation with the same name already exists!",
        success: false,
      });
    }

    const [result] = await db.query(
      "UPDATE designation SET name = ?, status = ? WHERE id = ?",
      [designation, status, id]
    );

    return res.status(200).json({ message: "Designation updated successfully", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};


exports.deleteDesignation = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query("DELETE FROM designation WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Designation not found", success: false });
    }

    return res.status(200).json({ message: "Designation deleted successfully", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

exports.desginationForOption = async (req, res) => {

  try {
    const [rows] = await db.query(
      "SELECT id, name FROM designation WHERE status = '1' ORDER BY name ASC"
    );


    return res.status(200).json({
      message: "designation fetched successfully!",
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching designation for options:", error);
    return res.status(500).json({
      message: "Internal server error!",
      success: false,
    });
  }
};
