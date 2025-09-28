const db = require('../../config/db')


exports.markAttendance = async (req, res) => {
  const data = req.body;

  if (!Array.isArray(data) || data.length === 0) {
    return res.status(400).json({
      message: "Attendance data is required!",
      success: false,
    });
  }

  try {
    const today = new Date().toISOString().split("T")[0]; 


    for (let item of data) {
      const checkSql = `
        SELECT * FROM attendance_info 
        WHERE student_rollnum = ? AND class = ? AND section = ? 
        AND DATE(attendance_date_info) = ?
      `;
      const [existing] = await db.query(checkSql, [
        item.rollNo,
        item.class,
        item.section,
        today,
      ]);

      if (existing.length > 0) {
        return res.status(400).json({
          message: `Attendance for student ${item.rollNo} in class ${item.class}-${item.section} is already marked today.`,
          success: false,
        });
      }
    }

    
    const insertSql = `
      INSERT INTO attendance_info 
      (attendance, student_rollnum, class, section, notes, attendance_date_info) 
      VALUES ?
    `;

    const values = data.map((item) => [
      item.attendance,
      item.rollNo,
      item.class,
      item.section,
      item.notes,
      new Date(), 
    ]);

    await db.query(insertSql, [values]);

    return res.status(200).json({
      message: "Attendance marked successfully!",
      success: true,
    });
  } catch (error) {
    console.error("Error marking attendance:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

exports.getStudentAttendanceData = async (req, res) => {
  try {
    const rollno = parseInt(req.params.rollno);


    const summarySql = `
      SELECT 
        SUM(CASE WHEN attendance = 'Present' THEN 1 ELSE 0 END) AS Present,
        SUM(CASE WHEN attendance = 'Absent' THEN 1 ELSE 0 END) AS Absent,
        SUM(CASE WHEN attendance = 'Holiday' THEN 1 ELSE 0 END) AS Holiday,
        SUM(CASE WHEN attendance = 'Halfday' THEN 1 ELSE 0 END) AS Halfday,
        SUM(CASE WHEN attendance = 'Late' THEN 1 ELSE 0 END) AS Late
      FROM attendance_info
      WHERE student_rollnum = ?
    `;

    const [summary] = await db.query(summarySql, [rollno]);


    const detailSql = `
      SELECT id, attendance, attendance_date_info
      FROM attendance_info
      WHERE student_rollnum = ?
      ORDER BY attendance_date_info ASC
    `;

    const [details] = await db.query(detailSql, [rollno]);

    return res.status(200).json({
      success: true,
      summary: summary[0],
      details: details
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
