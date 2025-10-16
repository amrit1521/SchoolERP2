const db = require("../../config/db");

// hostel list
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


// hostel room type
exports.addHostelRoomType = async (req, res) => {
  try {
    let { roomType, description } = req.body;

    
    if (!roomType || !description) {
      return res.status(400).json({
        message: "Room Type and Description are required!",
        success: false,
      });
    }

    roomType = roomType.trim();
    description = description.trim();

    const [existing] = await db.query(
      "SELECT id FROM hostel_room_type WHERE LOWER(roomType) = ?",
      [roomType.toLowerCase()]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        message: "Room Type already exists!",
        success: false,
      });
    }

   
    const [result] = await db.query(
      "INSERT INTO hostel_room_type (roomType, description) VALUES (?, ?)",
      [roomType, description]
    );

    return res.status(201).json({
      message: "Hostel Room Type added successfully!",
      success: true,
      id: result.insertId,
    });
  } catch (error) {
    console.error("Error adding hostel room type:", error);
    return res.status(500).json({
      message: "Internal server error!",
      success: false,
    });
  }
};

exports.getHostelRoomTypes = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, roomType, description FROM hostel_room_type ORDER BY id ASC"
    );
    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error("Error fetching hostel room types:", error);
    return res.status(500).json({
      message: "Internal server error!",
      success: false,
    });
  }
};


exports.getHostelRoomTypeById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT id, roomType, description FROM hostel_room_type WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Hostel room type not found!",
        success: false,
      });
    }

    return res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error("Error fetching hostel room type by ID:", error);
    return res.status(500).json({
      message: "Internal server error!",
      success: false,
    });
  }
};

exports.updateHostelRoomType = async (req, res) => {
  const { id } = req.params;
  let { roomType, description } = req.body;

  if (!roomType || !description) {
    return res.status(400).json({
      message: "Room Type and Description are required!",
      success: false,
    });
  }

  try {
    roomType = roomType.trim();
    description = description.trim();

   
    const [duplicate] = await db.query(
      "SELECT id FROM hostel_room_type WHERE LOWER(roomType) = ? AND id != ?",
      [roomType.toLowerCase(), id]
    );

    if (duplicate.length > 0) {
      return res.status(400).json({
        message: "Another room type with same name already exists!",
        success: false,
      });
    }

   
    await db.query(
      "UPDATE hostel_room_type SET roomType = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [roomType, description, id]
    );

    return res.status(200).json({
      message: "Hostel room type updated successfully!",
      success: true,
    });
  } catch (error) {
    console.error("Error updating hostel room type:", error);
    return res.status(500).json({
      message: "Internal server error!",
      success: false,
    });
  }
};


exports.deleteHostelRoomType = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM hostel_room_type WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Hostel room type not found!",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Hostel room type deleted successfully!",
      success: true,
    });
  } catch (error) {
    console.error("Error deleting hostel room type:", error);
    return res.status(500).json({
      message: "Internal server error!",
      success: false,
    });
  }
};

exports.hostelRoomTypeForOption = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, roomType FROM hostel_room_type ORDER BY id ASC"
    );

    return res.status(200).json({
      message: "Hostels Room Type fetched successfully",
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching hostel room type options:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};


