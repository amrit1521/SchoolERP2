const db = require("../../config/db");

// --------------------------------------
// Add Event
// --------------------------------------
exports.addEvent = async (req, res) => {
  try {
    let {
      title,
      description,
      start,
      end,
      all_day = 0,
      category_id = null,
      meta = null,
    } = req.body;

    if (!title || !start) {
      return res.status(400).json({
        success: false,
        message: "Title and start date are required!",
      });
    }

    const [result] = await db.query(
      `INSERT INTO events (title, description, start, end, all_day, category_id, meta) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        description || null,
        start,
        end || null,
        all_day ? 1 : 0,
        category_id || null,
        meta ? JSON.stringify(meta) : null,
      ]
    );

    const [[newEvent]] = await db.query(
      `SELECT * FROM events WHERE id = ?`,
      [result.insertId]
    );

    return res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: newEvent,
    });
  } catch (error) {
    console.error("Error in addEvent:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// --------------------------------------
// Get All Events
// --------------------------------------
exports.getEvents = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT e.*, c.name AS category_name, c.color, c.class_name
       FROM events e
       LEFT JOIN categories c ON e.category_id = c.id
       ORDER BY e.start ASC`
    );

    return res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Error in getEvents:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// --------------------------------------
// Get Single Event
// --------------------------------------
exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const [[eventRow]] = await db.query(
      `SELECT * FROM events WHERE id = ?`,
      [id]
    );

    if (!eventRow) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: eventRow,
    });
  } catch (error) {
    console.error("Error in getEventById:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// --------------------------------------
// Update Event
// --------------------------------------
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      start,
      end,
      all_day = 0,
      category_id = null,
      meta = null,
    } = req.body;

    if (!title || !start) {
      return res.status(400).json({
        success: false,
        message: "Title and start date are required!",
      });
    }

    await db.query(
      `UPDATE events 
       SET title=?, description=?, start=?, end=?, all_day=?, category_id=?, meta=? 
       WHERE id=?`,
      [
        title,
        description || null,
        start,
        end,
        all_day ? 1 : 0,
        category_id || null,
        meta ? JSON.stringify(meta) : null,
        id,
      ]
    );

    const [[updated]] = await db.query(
      `SELECT * FROM events WHERE id = ?`,
      [id]
    );

    return res.status(200).json({
      success: true,
      message: "Event updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Error in updateEvent:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// --------------------------------------
// Delete Event
// --------------------------------------
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      `DELETE FROM events WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteEvent:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// --------------------------------------
// Get All Categories
// --------------------------------------
exports.getCategories = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT * FROM categories ORDER BY name ASC`
    );

    return res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Error in getCategories:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// --------------------------------------
// Add Category
// --------------------------------------
exports.addCategory = async (req, res) => {
  try {
    const { name, color, class_name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required!",
      });
    }

    const [result] = await db.query(
      `INSERT INTO categories (name, color, class_name) VALUES (?, ?, ?)`,
      [name, color || null, class_name || null]
    );

    return res.status(201).json({
      success: true,
      message: "Category added successfully",
      id: result.insertId,
    });
  } catch (error) {
    console.error("Error in addCategory:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
