const db = require("../../config/db");

// ====================== ADD HOSTEL ======================
exports.addHostel = async (req, res) => {
  try {
    let { hostelName, hostelType, intake, address, description } = req.body;

    if (!hostelName || !hostelType || !intake || !address || !description) {
      return res.status(400).json({
        message: "All fields are required!",
        success: false,
      });
    }

    hostelName = hostelName.trim();

    const [existing] = await db.query(
      "SELECT id FROM hostel WHERE LOWER(name) = ?",
      [hostelName.toLowerCase()]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        message: "Hostel with this name already exists!",
        success: false,
      });
    }

    const [result] = await db.query(
      "INSERT INTO hostel (name, type, intake, address, description) VALUES (?, ?, ?, ?, ?)",
      [hostelName, hostelType, intake, address, description]
    );

    return res.status(201).json({
      message: "Hostel added successfully",
      success: true,
      id: result.insertId,
    });
  } catch (error) {
    console.error("Error adding hostel:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

// ====================== GET ALL HOSTELS ======================
exports.getHostels = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, name as hostelName, type as hostelType, intake, address, description FROM hostel ORDER BY id ASC"
    );
    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error("Error fetching hostels:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

// ====================== GET HOSTEL BY ID ======================
exports.getHostelById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT id, name as hostelName, type as hostelType, intake, address, description FROM hostel WHERE id = ?",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Hostel not found", success: false });
    }
    return res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error("Error fetching hostel by ID:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

// ====================== UPDATE HOSTEL ======================
exports.updateHostel = async (req, res) => {
  const { id } = req.params;
  let { hostelName, hostelType, intake, address, description } = req.body;

  if (!hostelName || !hostelType || !intake || !address || !description) {
    return res.status(400).json({
      message: "All fields are required!",
      success: false,
    });
  }

  try {
    hostelName = hostelName.trim();

    const [duplicate] = await db.query(
      "SELECT id FROM hostel WHERE LOWER(name) = ? AND id != ?",
      [hostelName.toLowerCase(), id]
    );

    if (duplicate.length > 0) {
      return res.status(400).json({
        message: "Another hostel with the same name already exists!",
        success: false,
      });
    }

    await db.query(
      "UPDATE hostel SET name = ?, type = ?, intake = ?, address = ?, description = ? WHERE id = ?",
      [hostelName, hostelType, intake, address, description, id]
    );

    return res.status(200).json({
      message: "Hostel updated successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error updating hostel:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

// ====================== DELETE HOSTEL ======================
exports.deleteHostel = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query("DELETE FROM hostel WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Hostel not found", success: false });
    }

    return res.status(200).json({
      message: "Hostel deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error deleting hostel:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

// ====================== HOSTELS FOR OPTION LIST ======================
exports.hostelForOption = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, name FROM hostel ORDER BY name ASC"
    );

    return res.status(200).json({
      message: "Hostels fetched successfully",
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching hostel options:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};
