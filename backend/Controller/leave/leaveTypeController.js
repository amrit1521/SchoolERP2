const db = require('../../config/db');
const dayjs  = require('dayjs')

// ✅ CREATE - Add Leave Type
exports.addLeaveType = async (req, res) => {
  const { name, total_allowed, status } = req.body;

  if (!name || !total_allowed) {
    return res.status(400).json({
      message: 'Required fields must be provided!',
      success: false,
    });
  }

  try {
    const normalizedName = name.toLowerCase().replace(/\s+/g, '');

    const [existLeaveType] = await db.query(
      `SELECT id FROM leaves_type 
       WHERE REPLACE(LOWER(name), ' ', '') = ? LIMIT 1`,
      [normalizedName]
    );

    if (existLeaveType.length > 0) {
      return res.status(400).json({
        message: 'Leave type already exists (case/space insensitive check)!',
        success: false,
      });
    }

    await db.query(
      `INSERT INTO leaves_type (name, total_allowed, status) VALUES (?, ?, ?)`,
      [name, total_allowed, status || 1]
    );

    return res.status(201).json({
      message: 'Leave type added successfully!',
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Error while adding Leave type!',
      success: false,
      error: error.message,
    });
  }
};

// ✅ READ - Get All Leave Types
exports.getAllLeaveTypes = async (req, res) => {
  try {
    const [leaveTypes] = await db.query(
      `SELECT id, name, total_allowed, status 
       FROM leaves_type`
    );

    return res.status(200).json({
      success: true,
      data: leaveTypes,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error while fetching leave types!",
      error: error.message,
    });
  }
};

// ✅ READ - Get Leave Type By ID
exports.getLeaveTypeById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: 'Id is required!', success: false });
  }

  try {
    const [leaveType] = await db.query(
      `SELECT id, name, total_allowed, status 
       FROM leaves_type WHERE id = ? LIMIT 1`,
      [id]
    );

    if (leaveType.length === 0) {
      return res.status(404).json({
        message: 'Leave type not found!',
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      data: leaveType[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error while fetching leave type!",
      error: error.message,
    });
  }
};

// ✅ UPDATE - Update Leave Type
exports.updateLeaveType = async (req, res) => {
  const { id } = req.params;
  const { name, total_allowed, status } = req.body;

  if (!id) {
    return res.status(400).json({ message: 'Id is required!', success: false });
  }

  try {
    const [existLeaveType] = await db.query(
      `SELECT id FROM leaves_type WHERE id = ? LIMIT 1`,
      [id]
    );

    if (existLeaveType.length === 0) {
      return res.status(404).json({
        message: 'Leave type not found!',
        success: false,
      });
    }

    await db.query(
      `UPDATE leaves_type 
       SET name = COALESCE(?, name), 
           total_allowed = COALESCE(?, total_allowed), 
           status = COALESCE(?, status) 
       WHERE id = ?`,
      [name, total_allowed, status, id]
    );

    return res.status(200).json({
      message: 'Leave type updated successfully!',
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error while updating leave type!",
      error: error.message,
    });
  }
};

// ✅ DELETE - Delete Leave Type
exports.deleteLeaveType = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: 'Id is required!', success: false });
  }

  try {
    const [result] = await db.query(
      `DELETE FROM leaves_type WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'Leave type not found!',
        success: false,
      });
    }

    return res.status(200).json({
      message: 'Leave type deleted successfully!',
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong!',
      error: error.message,
    });
  }
};


// add leave ----------------------
exports.addLeave = async (req, res) => {
  const data = req.body;

  try {

    const sql = `
      INSERT INTO leave_application 
      (id_or_rollnum, leave_type_id, from_date, to_date, leave_day_type, no_of_days, reason, leave_date) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [leaveres] = await db.query(sql, [
      data.idOrRollNum,
      data.leave_type_id,
      dayjs(data.from_date).format('YYYY-MM-DD'),
      dayjs(data.to_date).format('YYYY-MM-DD'),
      data.leave_day_type,
      data.no_of_days,
      data.reason,
      dayjs(data.leave_date).format('YYYY-MM-DD')
    ]);

    return res.status(201).json({
      message: "Leave applied successfully!",
      success: true,
      insertId: leaveres.insertId,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};
