const db = require("../../config/db");
const moment = require('moment/moment.js');

exports.getRoleCountForRole = async (req, res) => {
  try {
    const sql = `SELECT 
                    CASE 
                        WHEN u.remark = 'staff' THEN 'staff'
                        ELSE r.role_name
                    END AS role,
                    COUNT(u.id) AS user_count,  
                    COUNT(CASE WHEN u.status = '1' THEN u.id END) AS active_count,  
                    COUNT(CASE WHEN u.status = '0' THEN u.id END) AS inactive_count  
                FROM users u
                JOIN roles r ON u.roll_id = r.id
                GROUP BY 
                    CASE 
                        WHEN u.remark = 'staff' THEN 'staff'
                        ELSE r.role_name
                    END;
            `;
    const [rows] = await db.execute(sql);
    if (rows.length < 0) {
      return res.status(200).json({
        message: "No total Count for each role found.",
        success: false,
        result: rows,
      });
    }
    return res.status(200).json({
      message: "total Count for each role fetched successfully",
      success: true,
      result: rows.filter((row) => row.role != "admin" && row.role != "parent"),
    });
  } catch (error) {
    console.error("Error fetching count:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getTotalSubjectCount = async (req, res) => {
  try {
    const sql = `SELECT 
        COUNT(id) AS total_count, 
        COUNT(CASE WHEN status = '1' THEN 1 END) AS active_count, 
        COUNT(CASE WHEN status = '0' THEN 1 END) AS inactive_count
        FROM class_subject;
            `;
    const [rows] = await db.execute(sql);
    if (rows.length < 0) {
      return res.status(200).json({
        message: "No total subjects counts found.",
        success: false,
        result: rows,
      });
    }
    return res.status(200).json({
      message: "total subjects counts fetched successfully",
      success: true,
      result: rows[0],
    });
  } catch (error) {
    console.error("Error fetching count:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getTodayStudentAttendanceCount = async (req, res) => {
  const currentDate = moment().format("YYYY-MM-DD");
  console.log("curentDate: ", currentDate);
  try {
    const sql = `SELECT 
                    COUNT(CASE WHEN ai.attendance = 'Present' THEN 1 END) as present_count, 
                    COUNT(CASE WHEN ai.attendance = 'Absent' THEN 1 END) as absent_count,
                    COUNT(CASE WHEN ai.attendance = 'HalfDay' THEN 1 END) as halfday_count,
                    COUNT(CASE WHEN ai.attendance = 'Late' THEN 1 END) as late_count,
                    COUNT(ai.id) as total_student
                FROM attendance_info ai
                WHERE DATE(ai.attendance_date_info) = ?;
            `;
    const [rows] = await db.execute(sql, [currentDate]);
    console.log('rows: ',rows);
    rows[0]['present_count'] += rows[0].late_count + rows[0].halfday_count;
    if (rows.length < 0) {
      return res.status(200).json({
        message: "No attendance data found.",
        success: false,
        result: rows[0],
      });
    }
    return res.status(200).json({
      message: "student attendance fetched successfully",
      success: true,
      result: rows[0],
    });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getTodayTeacherAttendanceCount = async (req, res) => {
  const currentDate = moment().format("YYYY-MM-DD");
  console.log("curentDate: ", currentDate);
  try {
    const sql = `SELECT 
                COUNT(CASE WHEN tai.attendance = 'Present' THEN 1 END) as present_count, 
                COUNT(CASE WHEN tai.attendance = 'Absent' THEN 1 END) as absent_count,
                COUNT(CASE WHEN tai.attendance = 'HalfDay' THEN 1 END) as halfday_count,
                COUNT(CASE WHEN tai.attendance = 'Late' THEN 1 END) as late_count,
                COUNT(tai.id) as total_teacher
            FROM teacher_attendance_info tai
            WHERE DATE(tai.attendance_date_info) = ?;
            `;
    const [rows] = await db.execute(sql, [currentDate]);
    console.log('rows: ',rows);
    rows[0]['present_count'] += rows[0].late_count + rows[0].halfday_count;
    if (rows.length < 0) {
      return res.status(200).json({
        message: "No attendance data found.",
        success: false,
        result: rows[0],
      });
    }
    return res.status(200).json({
      message: "teacher attendance fetched successfully",
      success: true,
      result: rows[0],
    });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getTodayStaffAttendanceCount = async (req, res) => {
  const currentDate = moment().format("YYYY-MM-DD");
  console.log("curentDate: ", currentDate);
  try {
    const sql = `SELECT 
                    COUNT(CASE WHEN sai.attendance = 'Present' THEN 1 END) as present_count, 
                    COUNT(CASE WHEN sai.attendance = 'Absent' THEN 1 END) as absent_count,
                    COUNT(CASE WHEN sai.attendance = 'HalfDay' THEN 1 END) as halfday_count,
                    COUNT(CASE WHEN sai.attendance = 'Late' THEN 1 END) as late_count,
                    COUNT(sai.id) as total_staff
                FROM staff_attendance_info sai
                WHERE DATE(sai.attendance_date_info) = ?;
            `;
    const [rows] = await db.execute(sql, [currentDate]);
    console.log('rows: ',rows);
    rows[0]['present_count'] += rows[0].late_count + rows[0].halfday_count;
    if (rows.length < 0) {
      return res.status(200).json({
        message: "No attendance data found.",
        success: false,
        result: rows[0],
      });
    }
    return res.status(200).json({
      message: "staff attendance fetched successfully",
      success: true,
      result: rows[0],
    });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.getLeaveRequest = (req,res) =>{
  const sql = `SELECT la.id,la.id_or_rollnum as user_id,la.from_date,la.to_date,la.applied_on,la.role_id,lt.name
   from leave_application la
   JOIN leaves_type lt
 WHERE role_id in(2,3);`;
}