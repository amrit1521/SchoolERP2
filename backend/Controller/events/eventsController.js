const { success } = require("zod");
const db = require("../../config/db");
const dayjs = require("dayjs");


// ADD EVENT
exports.addEvent = async (req, res) => {
  try {
    let { title, start, end, className } = req.body;
    if (!title || !start || !end || !className) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!"
      });
    }

    if (title.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: "Title must be at least 5 characters!"
      });
    }
    const startDate = dayjs(start).format("YYYY-MM-DD");
    const endDate = dayjs(end).format("YYYY-MM-DD");


    if (dayjs(endDate).isBefore(startDate)) {
      return res.status(400).json({
        success: false,
        message: "End date should be after start date!"
      });
    }

    const [exist] = await db.query(
      `SELECT id FROM events 
             WHERE LOWER(title) = LOWER(?) 
             AND start = ?`,
      [title, startDate]
    );

    if (exist.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Event with same title already exists on same date!"
      });
    }

    await db.query(
      `INSERT INTO events (title, start, end, className) 
             VALUES (?, ?, ?, ?)`,
      [title, startDate, endDate, className]
    );

    return res.status(201).json({
      success: true,
      message: "Event added successfully!"
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


exports.getEvents = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id ,title,start,end,className FROM events ORDER BY id DESC");

    return res.status(200).json({
      success: true,
      data: rows,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query("SELECT * FROM events WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: rows[0]
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    let { title, start, end, className } = req.body;

    // ---------- Required Fields Check ----------
    if (!title || !start || !end || !className) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!"
      });
    }

    if (title.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: "Title must be at least 5 characters!"
      });
    }

    const startDate = dayjs(start).format("YYYY-MM-DD");
    const endDate = dayjs(end).format("YYYY-MM-DD");

    if (dayjs(endDate).isBefore(startDate)) {
      return res.status(400).json({
        success: false,
        message: "End date should be after start date!"
      });
    }


    const [eventCheck] = await db.query(`SELECT id FROM events WHERE id = ?`, [id]);

    if (eventCheck.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Event not found!"
      });
    }


    const [duplicate] = await db.query(
      `SELECT id FROM events 
             WHERE LOWER(title) = LOWER(?) 
             AND start = ?
             AND id != ?`,
      [title, startDate, id]
    );

    if (duplicate.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Another event with same title & date already exists!"
      });
    }

    // ---------- Update ----------
    await db.query(
      `UPDATE events SET title=?, start=?, end=?, className=? WHERE id=?`,
      [title, startDate, endDate, className, id]
    );

    return res.status(200).json({
      success: true,
      message: "Event updated successfully!"
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


exports.deleteEvent = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      message: "Event Id is not provided!",
      success: false,
    });
  }

  try {
    const [row] = await db.query("DELETE FROM events WHERE id=?", [id]);

    if (row.affectedRows === 0) {
      return res.status(400).json({
        message: "Event not found!",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Event deleted successfully!",
      success: true,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal server error!",
      success: false,
      error: error.message,
    });
  }
};
