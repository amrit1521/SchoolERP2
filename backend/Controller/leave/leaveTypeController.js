const db = require('../../config/db');
const dayjs = require('dayjs')

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

    const [sameDayLeave] = await db.query(
      `SELECT id FROM leave_application
       WHERE id_or_rollnum = ?
       AND leave_date = ?
       AND status IN ("0", "1")`,
      [data.idOrRollNum, dayjs(data.leave_date).format("YYYY-MM-DD")]
    );

    if (sameDayLeave.length > 0) {
      return res.status(400).json({
        message: "You can apply leave only once per day!",
        success: false,
      });
    }

    const [leaveType] = await db.query(
      `SELECT total_allowed FROM leaves_type WHERE id = ? LIMIT 1`,
      [data.leave_type_id]
    );

    if (leaveType.length === 0) {
      return res.status(400).json({
        message: "Invalid leave type!",
        success: false,
      });
    }

    const maxAllowed = parseInt(leaveType[0].total_allowed);

    const [usedLeaves] = await db.query(
      `SELECT COALESCE(SUM(no_of_days), 0) AS used
       FROM leave_application
       WHERE id_or_rollnum = ?
       AND leave_type_id = ?
       AND status IN ("0", "1")`,
      [data.idOrRollNum, data.leave_type_id]
    );

    const alreadyUsed = usedLeaves[0].used;

    const totalAfterApply = parseInt(alreadyUsed) + parseInt(data.no_of_days);
    if (totalAfterApply > maxAllowed) {
      return res.status(400).json({
        message: `You already used ${alreadyUsed}/${maxAllowed} days. You cannot apply ${data.no_of_days} more days.`,
        success: false,
      });
    }



    const sql = `
      INSERT INTO leave_application 
      (id_or_rollnum, leave_type_id, from_date, to_date, leave_day_type, no_of_days, reason, leave_date, role_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [
      data.idOrRollNum,
      data.leave_type_id,
      dayjs(data.from_date).format("YYYY-MM-DD"),
      dayjs(data.to_date).format("YYYY-MM-DD"),
      data.leave_day_type,
      data.no_of_days,
      data.reason,
      dayjs(data.leave_date).format("YYYY-MM-DD"),
      data.role_id||null,
    ]);

    return res.status(201).json({
      message: "Leave applied successfully!",
      success: true,
      insertId: result.insertId,
    });

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      message: "Server error!",
      success: false,
    });
  }
};




exports.getLeaveData = async (req, res) => {
  try {
    const sql = `
      SELECT 
        la.id,
        la.id_or_rollnum AS user_id,
        la.from_date,
        la.to_date,
        la.no_of_days,
        la.applied_on,
        la.role_id,
        lt.name AS leave_type,
        la.status,
        r.role_name,

        -- Name (teacher / student / staff)
        CASE 
          WHEN r.role_name = 'teacher' 
            THEN CONCAT(u1.firstname, ' ', u1.lastname)

          WHEN r.role_name = 'student' 
            THEN CONCAT(u2.firstname, ' ', u2.lastname)

          WHEN u3.remark = 'staff'
            THEN CONCAT(u3.firstname, ' ', u3.lastname)

          ELSE NULL
        END AS user_name,

        -- Image (teacher / student / staff)
        CASE 
          WHEN r.role_name = 'teacher' 
            THEN t.img_src

          WHEN r.role_name = 'student' 
            THEN s.stu_img

          WHEN u3.remark = 'staff'
            THEN st.img_src

          ELSE NULL
        END AS img

      FROM leave_application la

      LEFT JOIN leaves_type lt 
        ON lt.id = la.leave_type_id

      LEFT JOIN roles r 
        ON r.id = la.role_id


      -- ★ Teacher
      LEFT JOIN teachers t 
        ON t.teacher_id = la.id_or_rollnum
      LEFT JOIN users u1 
        ON u1.id = t.user_id


      -- ★ Student
      LEFT JOIN students s 
        ON s.rollnum = la.id_or_rollnum
      LEFT JOIN users u2 
        ON u2.id = s.stu_id


      -- ★ Staff (remark = staff)
      LEFT JOIN staffs st 
        ON st.id = la.id_or_rollnum
      LEFT JOIN users u3 
        ON u3.id = st.user_id

      ORDER BY la.id DESC
    `;

    const [results] = await db.execute(sql);

    return res.status(200).json({
      message: "Leave requests fetched successfully.",
      success: true,
      data: results,
    });

  } catch (error) {
    console.error("Error fetching leave requests:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getSpeLeaveData = async (req, res) => {
  try {
    const { id } = req.params;

    const sql = `
      SELECT 
        la.id,
        la.id_or_rollnum AS user_id,
        la.from_date,
        la.to_date,
        la.no_of_days,
        la.applied_on,
        la.role_id,
        lt.name AS leave_type,
        la.status,
        la.note,
        la.reason,
        r.role_name,

        -- Name (teacher / student / staff)
        CASE 
          WHEN r.role_name = 'teacher' 
            THEN CONCAT(u1.firstname, ' ', u1.lastname)

          WHEN r.role_name = 'student' 
            THEN CONCAT(u2.firstname, ' ', u2.lastname)

          WHEN u3.remark = 'staff'
            THEN CONCAT(u3.firstname, ' ', u3.lastname)

          ELSE NULL
        END AS user_name,

        -- Image (teacher / student / staff)
        CASE 
          WHEN r.role_name = 'teacher' 
            THEN t.img_src

          WHEN r.role_name = 'student' 
            THEN s.stu_img

          WHEN u3.remark = 'staff'
            THEN st.img_src

          ELSE NULL
        END AS img

      FROM leave_application la

      LEFT JOIN leaves_type lt 
        ON lt.id = la.leave_type_id

      LEFT JOIN roles r 
        ON r.id = la.role_id

      -- ★ Teacher
      LEFT JOIN teachers t 
        ON t.teacher_id = la.id_or_rollnum
      LEFT JOIN users u1 
        ON u1.id = t.user_id

      -- ★ Student
      LEFT JOIN students s 
        ON s.rollnum = la.id_or_rollnum
      LEFT JOIN users u2 
        ON u2.id = s.stu_id

      -- ★ Staff (remark = staff)
      LEFT JOIN staffs st 
        ON st.id = la.id_or_rollnum
      LEFT JOIN users u3 
        ON u3.id = st.user_id

      WHERE la.id = ?
      LIMIT 1
    `;

    const [results] = await db.execute(sql, [id]);

    if (results.length === 0) {
      return res.status(404).json({
        message: "Leave record not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Leave data fetched successfully",
      success: true,
      data: results[0],
    });

  } catch (error) {
    console.error("Error fetching leave data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteLeave = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if leave exists
    const checkSql = `SELECT id FROM leave_application WHERE id = ?`;
    const [check] = await db.execute(checkSql, [id]);

    if (check.length === 0) {
      return res.status(404).json({
        message: "Leave record not found.",
        success: false,
      });
    }

    // Delete record
    const deleteSql = `DELETE FROM leave_application WHERE id = ?`;
    await db.execute(deleteSql, [id]);

    return res.status(200).json({
      message: "Leave deleted successfully.",
      success: true,
    });

  } catch (error) {
    console.error("Error deleting leave:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

exports.updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    if (![0, 1, 2].includes(status)) {
      return res.status(400).json({
        message: "Invalid status value.",
        success: false,
      });
    }

    const sql = `
      UPDATE leave_application
      SET status = ?, note = ?
      WHERE id = ?
    `;

    await db.execute(sql, [String(status), note, id]);

    return res.status(200).json({
      message: "Leave status updated successfully",
      success: true
    });

  } catch (error) {
    console.error("Error updating leave status:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};



