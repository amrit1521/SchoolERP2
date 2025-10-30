const db = require("../../config/db");

exports.markTeacherAttendance = async (req, res) => {
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
        SELECT * FROM teacher_attendance_info 
        WHERE teacher_id = ? AND class = ? AND section = ? 
        AND DATE(attendance_date_info) = ?;
      `;
      const [existing] = await db.query(checkSql, [
        item.id,
        item.class,
        item.section,
        today,
      ]);

      if (existing.length > 0) {
        return res.status(400).json({
          message: `Attendance for teacher ${item.id} in class ${item.class}-${item.section} is already marked today.`,
          success: false,
        });
      }
    }

    const insertSql = `
      INSERT INTO teacher_attendance_info 
      (attendance, teacher_id, class, section, notes, attendance_date_info) 
      VALUES ?;
    `;

    const values = data.map((item) => [
      item.attendance,
      item.id,
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

// staff attendance Module.
exports.markStaffAttendance = async (req, res) => {
  const data = req.body;


  if (!Array.isArray(data) || data.length === 0) {
    return res.status(400).json({
      message: "Attendance data is required!",
      success: false,
    });
  }

  try {
    const today = new Date().toISOString().split("T")[0]; // yyyy-mm-dd

    // Check if attendance is already marked for each staff today
    for (let item of data) {
      const checkSql = `
        SELECT * FROM staff_attendance_info 
        WHERE staff_id = ? AND DATE(attendance_date_info) = ?
      `;
      const [existing] = await db.query(checkSql, [item.staffId, today]);

      if (existing.length > 0) {
        return res.status(400).json({
          message: `Attendance for staff ${item.name} (ID: ${item.staffId}) is already marked today.`,
          success: false,
        });
      }
    }

    // Prepare data for bulk insert
    const insertSql = `
      INSERT INTO staff_attendance_info 
      (staff_id, department, attendance, notes, attendance_date_info) 
      VALUES ?
    `;

    const values = data.map((item) => [
      item.staffId,
      item.department,
      item.attendance,
      item.notes || "",
      today,
    ]);

    await db.query(insertSql, [values]);

    return res.status(200).json({
      message: "Staff attendance marked successfully!",
      success: true,
    });
  } catch (error) {
    console.error("Error marking staff attendance:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};


exports.getStaffAttendanceData = async (req, res) => {
  try {
    const staffId = parseInt(req.params.staffid);


    const summarySql = `
      SELECT 
        SUM(CASE WHEN attendance = 'Present' THEN 1 ELSE 0 END) AS Present,
        SUM(CASE WHEN attendance = 'Absent' THEN 1 ELSE 0 END) AS Absent,
        SUM(CASE WHEN attendance = 'Holiday' THEN 1 ELSE 0 END) AS Holiday,
        SUM(CASE WHEN attendance = 'Halfday' THEN 1 ELSE 0 END) AS Halfday,
        SUM(CASE WHEN attendance = 'Late' THEN 1 ELSE 0 END) AS Late
      FROM staff_attendance_info
      WHERE staff_id = ?
    `;
    const [summary] = await db.query(summarySql, [staffId]);


    const detailSql = `
      SELECT id, attendance, attendance_date_info
      FROM staff_attendance_info
      WHERE staff_id = ?
      ORDER BY attendance_date_info ASC
    `;
    const [details] = await db.query(detailSql, [staffId]);

    return res.status(200).json({
      success: true,
      summary: summary[0],
      details: details,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getDailyStafftAttendanceReport = async (req,res) =>{
  try {
    const date = new Date(req.query.date || Date.now()).toISOString().slice(0, 10);
    console.log('date: ',date,req.query.date);
    const sql = `
      SELECT 
      sta.staff_id,
      sta.department,
        sta.attendance,
        CONCAT(u.firstname, ' ', u.lastname) AS name,
        sf.role,
        sf.img_src
    FROM staff_attendance_info sta
    RIGHT JOIN staffs sf ON sf.id = sta.staff_id
    RIGHT JOIN users u ON u.id = sf.user_id
    WHERE DATE(sta.attendance_date_info) = ?;
    `;

    const [rows] = await db.query(sql, [date]);

    res.status(200).json({
      success: true,
      date: date,
      data: rows
    });

  } catch (error) {
    console.error("Error fetching daily attendance report:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch daily attendance report",
      error: error.message
    });
  }
}


exports.getStaffAttendanceReport = async (req, res) => {
  try {
    
    const sql = `
      SELECT  
        sai.staff_id, 
        st.img_src,
        u.firstname,
        u.lastname,
        SUM(CASE WHEN sai.attendance = 'Present' THEN 1 ELSE 0 END) AS Present,
        SUM(CASE WHEN sai.attendance = 'Late' THEN 1 ELSE 0 END) AS Late,
        SUM(CASE WHEN sai.attendance = 'Absent' THEN 1 ELSE 0 END) AS Absent,
        SUM(CASE WHEN sai.attendance = 'Halfday' THEN 1 ELSE 0 END) AS Halfday,
        SUM(CASE WHEN sai.attendance = 'Holiday' THEN 1 ELSE 0 END) AS Holiday,
        COUNT(sai.id) AS TotalDays
      FROM staff_attendance_info sai
      JOIN staffs st ON sai.staff_id = st.id
      JOIN users u ON u.id = st.user_id
      GROUP BY sai.staff_id
      `;

    const [rows] = await db.query(sql);

    const report = rows.map((r) => {
      const Present = Number(r.Present) || 0;
      const Late = Number(r.Late) || 0;
      const Absent = Number(r.Absent) || 0;
      const Halfday = Number(r.Halfday) || 0;
      const Holiday = Number(r.Holiday) || 0;
      const TotalDays = Number(r.TotalDays) || 0; 
      const totalWorkingDays = TotalDays - Holiday;
      const totalPresentDays = Present + Late  + (Halfday * 0.5);
      const percentage =
        totalWorkingDays > 0
          ? ((totalPresentDays / totalWorkingDays) * 100).toFixed(1)
          : "0.0";
      return {
        rollNo: r.roll_no,
        name: `${r.firstname} ${r.lastname} `,
        img:r.img_src,
        p:Present,
        l:Late,
        a:Absent,
        h:Halfday,
        f:Holiday,
        TotalDays,
        totalWorkingDays,
        totalPresentDays: totalPresentDays.toFixed(1),
        percentage,
      };
    });

    return res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error("Error generating attendance report:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};



exports.getTeacherAttendanceData = async (req, res) => {
  try {
    const { teacher_id } = req.params;


    const summarySql = `
      SELECT
        SUM(CASE WHEN attendance = 'Present' THEN 1 ELSE 0 END) AS Present,
        SUM(CASE WHEN attendance = 'Absent' THEN 1 ELSE 0 END) AS Absent,
        SUM(CASE WHEN attendance = 'Holiday' THEN 1 ELSE 0 END) AS Holiday,
        SUM(CASE WHEN attendance = 'Halfday' THEN 1 ELSE 0 END) AS Halfday,
        SUM(CASE WHEN attendance = 'Late' THEN 1 ELSE 0 END) AS Late
      FROM teacher_attendance_info
      WHERE teacher_id = ?
    `;
    const [summary] = await db.query(summarySql, [teacher_id]);


    const detailSql = `
      SELECT id, attendance, attendance_date_info
      FROM teacher_attendance_info
      WHERE teacher_id = ?
      ORDER BY attendance_date_info ASC
    `;
    const [details] = await db.query(detailSql, [teacher_id]);

    return res.status(200).json({
      success: true,
      summary: summary[0],
      details: details,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getDailyTeacherAttendanceReport = async (req,res) =>{
  try {
    const date = new Date(req.query.date || Date.now()).toISOString().slice(0, 10);
    console.log('date: ',date,req.query.date);
    const sql = `
    SELECT 
      tai.teacher_id,
      tai.attendance,
      CONCAT(u.firstname, ' ', u.lastname) AS name,
      t.img_src,
      t.subject
    FROM teacher_attendance_info tai
    RIGHT JOIN teachers t ON t.teacher_id = tai.teacher_id
    RIGHT JOIN users u ON u.id = t.user_id
    WHERE DATE(tai.attendance_date_info) = ?;
    `;

    const [rows] = await db.query(sql, [date]);

    res.status(200).json({
      success: true,
      date: date,
      data: rows
    });

  } catch (error) {
    console.error("Error fetching daily attendance report:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch daily attendance report",
      error: error.message
    });
  }
}

exports.getTeacherAttendanceReport = async (req, res) => {
  try {


    const sql = `
      SELECT  
        t.teacher_id, 
        t.img_src,
        u.firstname,
        u.lastname,
        SUM(CASE WHEN ta.attendance = 'Present' THEN 1 ELSE 0 END) AS Present,
        SUM(CASE WHEN ta.attendance = 'Late' THEN 1 ELSE 0 END) AS Late,
        SUM(CASE WHEN ta.attendance = 'Absent' THEN 1 ELSE 0 END) AS Absent,
        SUM(CASE WHEN ta.attendance = 'Halfday' THEN 1 ELSE 0 END) AS Halfday,
        SUM(CASE WHEN ta.attendance = 'Holiday' THEN 1 ELSE 0 END) AS Holiday,
        COUNT(ta.id) AS TotalDays
      FROM teacher_attendance_info ta
      JOIN teachers t ON ta.teacher_id = t.teacher_id
      JOIN users u ON u.id = t.user_id
      GROUP BY ta.teacher_id
      `;
      // ORDER BY s.rollnum ASC

    const [rows] = await db.query(sql);

    const report = rows.map((r) => {
      const Present = Number(r.Present) || 0;
      const Late = Number(r.Late) || 0;
      const Absent = Number(r.Absent) || 0;
      const Halfday = Number(r.Halfday) || 0;
      const Holiday = Number(r.Holiday) || 0;
      const TotalDays = Number(r.TotalDays) || 0; 
      const totalWorkingDays = TotalDays - Holiday;
      const totalPresentDays = Present + Late  + (Halfday * 0.5);
      const percentage =
        totalWorkingDays > 0
          ? ((totalPresentDays / totalWorkingDays) * 100).toFixed(1)
          : "0.0";
      return {
        rollNo: r.roll_no,
        name: `${r.firstname} ${r.lastname} `,
        img:r.img_src,
        p:Present,
        l:Late,
        a:Absent,
        h:Halfday,
        f:Holiday,
        TotalDays,
        totalWorkingDays,
        totalPresentDays: totalPresentDays.toFixed(1),
        percentage,
      };
    });

    return res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error("Error generating attendance report:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};



exports.markStudentAttendance = async (req, res) => {
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
      details: details,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


exports.getStuAttendanceReport = async (req, res) => {
  try {


    const sql = `
      SELECT  
        s.rollnum AS roll_no, 
        s.stu_img,
        u.firstname,
        u.lastname,
        SUM(CASE WHEN a.attendance = 'Present' THEN 1 ELSE 0 END) AS Present,
        SUM(CASE WHEN a.attendance = 'Late' THEN 1 ELSE 0 END) AS Late,
        SUM(CASE WHEN a.attendance = 'Absent' THEN 1 ELSE 0 END) AS Absent,
        SUM(CASE WHEN a.attendance = 'Halfday' THEN 1 ELSE 0 END) AS Halfday,
        SUM(CASE WHEN a.attendance = 'Holiday' THEN 1 ELSE 0 END) AS Holiday,
        COUNT(a.id) AS TotalDays
      FROM attendance_info a
      JOIN students s ON a.student_rollnum = s.rollnum
      JOIN users u ON u.id = s.stu_id
      GROUP BY a.student_rollnum
      ORDER BY s.rollnum ASC
    `;

    const [rows] = await db.query(sql);

    const report = rows.map((r) => {
      const Present = Number(r.Present) || 0;
      const Late = Number(r.Late) || 0;
      const Absent = Number(r.Absent) || 0;
      const Halfday = Number(r.Halfday) || 0;
      const Holiday = Number(r.Holiday) || 0;
      const TotalDays = Number(r.TotalDays) || 0; 
      const totalWorkingDays = TotalDays - Holiday;
      const totalPresentDays = Present + Late  + (Halfday * 0.5);
      const percentage =
        totalWorkingDays > 0
          ? ((totalPresentDays / totalWorkingDays) * 100).toFixed(1)
          : "0.0";
      return {
        rollNo: r.roll_no,
        name: `${r.firstname} ${r.lastname} `,
        img:r.stu_img,
        p:Present,
        l:Late,
        a:Absent,
        h:Halfday,
        f:Holiday,
        TotalDays,
        totalWorkingDays,
        totalPresentDays: totalPresentDays.toFixed(1),
        percentage,
      };
    });

    return res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error("Error generating attendance report:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};


// exports.getStuAttendanceReport = async (req, res) => {
//   try {
//     const { startDate, endDate } = req.query;

//     if (!startDate || !endDate) {
//       return res.status(400).json({
//         success: false,
//         message: "Please provide startDate and endDate (YYYY-MM-DD).",
//       });
//     }

//     const sql = `
//       SELECT  
//         s.rollnum AS roll_no, 
//         s.stu_img,
//         u.firstname,
//         u.lastname,
//         SUM(CASE WHEN a.attendance = 'Present' THEN 1 ELSE 0 END) AS Present,
//         SUM(CASE WHEN a.attendance = 'Late' THEN 1 ELSE 0 END) AS Late,
//         SUM(CASE WHEN a.attendance = 'Absent' THEN 1 ELSE 0 END) AS Absent,
//         SUM(CASE WHEN a.attendance = 'Halfday' THEN 1 ELSE 0 END) AS Halfday,
//         SUM(CASE WHEN a.attendance = 'Holiday' THEN 1 ELSE 0 END) AS Holiday,
//         COUNT(a.id) AS TotalDays
//       FROM attendance_info a
//       JOIN students s ON a.student_rollnum = s.rollnum
//       JOIN users u ON u.id = s.stu_id
//       WHERE DATE(a.attendance_date_info) BETWEEN ? AND ?
//       GROUP BY a.student_rollnum
//       ORDER BY s.rollnum ASC
//     `;

//     const [rows] = await db.query(sql, [startDate.trim(), endDate.trim()]);

//     const report = rows.map((r) => {
//       const Present = Number(r.Present) || 0;
//       const Late = Number(r.Late) || 0;
//       const Absent = Number(r.Absent) || 0;
//       const Halfday = Number(r.Halfday) || 0;
//       const Holiday = Number(r.Holiday) || 0;
//       const TotalDays = Number(r.TotalDays) || 0; 
//       const totalWorkingDays = TotalDays - Holiday;
//       const totalPresentDays = Present + Late  + (Halfday * 0.5);
//       const percentage =
//         totalWorkingDays > 0
//           ? ((totalPresentDays / totalWorkingDays) * 100).toFixed(1)
//           : "0.0";
//       return {
//         rollNo: r.roll_no,
//         studentName: `${r.firstname} ${r.lastname} `,
//         img:r.stu_img,
//         Present,
//         Late,
//         Absent,
//         Halfday,
//         Holiday,
//         TotalDays,
//         totalWorkingDays,
//         totalPresentDays: totalPresentDays.toFixed(1),
//         percentage,
//       };
//     });

//     return res.status(200).json({
//       success: true,
//       startDate,
//       endDate,
//       data: report,
//     });
//   } catch (error) {
//     console.error("Error generating attendance report:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error.",
//     });
//   }
// };



exports.getDailyClassAttendanceReport = async (req, res) => {
  try {
    const date = new Date(req.query.date || Date.now()).toISOString().slice(0, 10);
    console.log('date: ',date,req.query.date);
    const sql = `
      SELECT 
      ai.class AS class,
      ai.section AS section,
      se.noOfStudents,
      SUM(ai.attendance = 'Present') AS total_present,
      SUM(ai.attendance = 'Absent') AS total_absent,
      ROUND(
        (SUM(ai.attendance = 'Present') / 
          NULLIF(SUM(ai.attendance = 'Present') + SUM(ai.attendance = 'Absent'), 0)
        ) * 100, 
        2
      ) AS present_percent,
      ROUND(
        (SUM(ai.attendance = 'Absent') / 
          NULLIF(SUM(ai.attendance = 'Present') + SUM(ai.attendance = 'Absent'), 0)
        ) * 100, 
        2
      ) AS absent_percent
    FROM attendance_info ai
    RIGHT JOIN classes c 
      ON c.class_name = ai.class
    RIGHT JOIN sections se 
      ON se.section_name = ai.section 
      AND c.id = se.class_id
    WHERE DATE(ai.attendance_date_info) = ?
    GROUP BY ai.class, ai.section, se.noOfStudents
    `;

    const [rows] = await db.query(sql, [date]);

    res.status(200).json({
      success: true,
      date: date,
      data: rows
    });

  } catch (error) {
    console.error("Error fetching daily attendance report:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch daily attendance report",
      error: error.message
    });
  }
};
exports.getDailyStudentAttendanceReport = async (req, res) => {
  try {
    const date = new Date(req.query.date || Date.now()).toISOString().slice(0, 10);
    console.log('date: ',date,req.query.date);
    const sql = `
      SELECT 
      ai.attendance,
      ai.student_rollnum,
      s.admissionnum,
      s.stu_img,
      CONCAT(u.firstname, ' ', u.lastname) AS name
    FROM attendance_info ai
    RIGHT JOIN students s 
      ON s.rollnum = ai.student_rollnum
    RIGHT JOIN users u 
      ON u.id = s.stu_id
    WHERE DATE(ai.attendance_date_info) = ?
    `;

    const [rows] = await db.query(sql, [date]);

    res.status(200).json({
      success: true,
      date: date,
      data: rows
    });

  } catch (error) {
    console.error("Error fetching daily attendance report:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch daily attendance report",
      error: error.message
    });
  }
};


