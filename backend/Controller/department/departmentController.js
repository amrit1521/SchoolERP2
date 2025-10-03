const db = require('../../config/db');

// ---------------- Add Department ----------------
exports.addDepartment = async (req, res) => {
  try {
    let { name, status } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Department name is required!", success: false });
    }

    name = name.trim().toLowerCase();


    const [existing] = await db.query(
      "SELECT id FROM department WHERE LOWER(name) = ?",
      [name]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        message: "Department already exists!",
        success: false,
      });
    }

    // Insert
    const [result] = await db.query(
      "INSERT INTO department (name, status) VALUES (?, ?)",
      [name, status]
    );

    return res.status(201).json({
      message: "Department added successfully",
      success: true,
      id: result.insertId,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

// ---------------- Get All Departments ----------------
exports.getDepartments = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, name, status FROM department ORDER BY id ASC");
    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

// ---------------- Get Department by ID ----------------
exports.getDepartmentById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query("SELECT name, status FROM department WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Department not found", success: false });
    }
    return res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

// ---------------- Update Department ----------------
exports.updateDepartment = async (req, res) => {
  const { id } = req.params;
  let { name, status } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Department name is required!", success: false });
  }

  try {
    name = name.trim().toLowerCase();

 
    const [duplicate] = await db.query(
      "SELECT id FROM department WHERE LOWER(name) = ? AND id != ?",
      [name, id]
    );

    if (duplicate.length > 0) {
      return res.status(400).json({
        message: "Another department with the same name already exists!",
        success: false,
      });
    }

    const [result] = await db.query(
      "UPDATE department SET name = ?, status = ? WHERE id = ?",
      [name, status, id]
    );

    return res.status(200).json({ message: "Department updated successfully", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};


// ---------------- Delete Department ----------------
exports.deleteDepartment = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query("DELETE FROM department WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Department not found", success: false });
    }

    return res.status(200).json({ message: "Department deleted successfully", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};
