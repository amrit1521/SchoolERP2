
const db = require('../../config/db');


exports.getSpecTeacherAttendance = async (req, res) => {
    const {id} = req.params;
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
      Where ta.teacher_id = ?
      `;

    const [rows] = await db.query(sql,[id]);

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