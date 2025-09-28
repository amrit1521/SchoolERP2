const dayjs = require("dayjs");
const db = require("../../config/db");

// ✅ Add Holiday
exports.addHoliday = async (req, res) => {
  let { title, date, description, status } = req.body;

  try {
 
    if (!title || !date || !status) {
      return res.status(400).json({
        success: false,
        message: "Title, Date, and Status are required!",
      });
    }
    const cleanTitle = title.trim().toLowerCase();

   
    const formattedDate = dayjs(date, "DD MMM YYYY").format("YYYY-MM-DD");

   
    const [existing] = await db.query(
      "SELECT * FROM school_holiday WHERE LOWER(TRIM(title)) = ?",
      [cleanTitle]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Holiday with this title already exists!",
      });
    }


    const [result] = await db.query(
      "INSERT INTO school_holiday (title, date, description, status) VALUES (?, ?, ?, ?)",
      [title.trim(), formattedDate, description?.trim() || "", status]
    );

    return res.status(201).json({
      success: true,
      message: "Holiday added successfully",
      holidayId: result.insertId,
    });
  } catch (error) {
    console.error("AddHoliday Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ✅ Get All Holidays
exports.getAllHolidays = async (req, res) => {
  try {
    const [holidays] = await db.query(
      "SELECT id,title,date,description,status FROM school_holiday ORDER BY date DESC"
    );
    return res.status(200).json({
      success: true,
      count: holidays.length,
      holidays,
    });
  } catch (error) {
    console.error("GetAllHolidays Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch holidays",
    });
  }
};

// ✅ Get Single Holiday by ID
exports.getHolidayById = async (req, res) => {
  const { id } = req.params;

  try {
    const [holiday] = await db.query(
      "SELECT * FROM school_holiday WHERE id = ?",
      [id]
    );

    if (holiday.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Holiday not found",
      });
    }

    return res.status(200).json({
      success: true,
      holiday: holiday[0],
    });
  } catch (error) {
    console.error("GetHolidayById Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch holiday",
    });
  }
};

// ✅ Update Holiday
exports.updateHoliday = async (req, res) => {
  const { id } = req.params;
  let { title, date, description, status } = req.body;

  try {
    const [existing] = await db.query(
      "SELECT * FROM school_holiday WHERE id = ?",
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Holiday not found",
      });
    }

    const cleanTitle = title?.trim() || existing[0].title;
    const formattedDate = date
      ? dayjs(date, "DD MMM YYYY").format("YYYY-MM-DD")
      : existing[0].date;

    await db.query(
      "UPDATE school_holiday SET title=?, date=?, description=?, status=? WHERE id=?",
      [cleanTitle, formattedDate, description?.trim() || "", status, id]
    );

    return res.status(200).json({
      success: true,
      message: "Holiday updated successfully",
    });
  } catch (error) {
    console.error("UpdateHoliday Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update holiday",
    });
  }
};

// ✅ Delete Holiday
exports.deleteHoliday = async (req, res) => {
  const { id } = req.params;
  try {
    const [existing] = await db.query(
      "SELECT * FROM school_holiday WHERE id = ?",
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Holiday not found",
      });
    }

    await db.query("DELETE FROM school_holiday WHERE id = ?", [id]);

    return res.status(200).json({
      success: true,
      message: "Holiday deleted successfully",
    });
  } catch (error) {
    console.error("DeleteHoliday Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete holiday",
    });
  }
};
