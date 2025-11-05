
const db = require('../../config/db');

exports.getSpecStuAttendance = async (req, res) => {
    const {rollNo} = req.params;
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
      WHERE a.student_rollnum = ?
    `;

    const [rows] = await db.query(sql,[rollNo]);

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


exports.getStudentHomework = async (req, res) => {
  const {classId,sectionId} = req.params;
  try {
    const sql = `
      SELECT 
        hw.id, 
        hw.homeworkDate,
        hw.submissionDate,
        hw.attachements,
        hw.description,
        hw.status,
        hw.created_at,
        hw.updated_at,
        t.img_src,
        t.user_id,
        u.firstname,
        u.lastname,
        su.name AS subject,
        se.section_name AS section,
        c.class_name  AS className
      FROM home_work hw
      LEFT JOIN teachers t ON hw.teacherId = t.user_id
      LEFT JOIN users u ON t.user_id = u.id
      LEFT JOIN class_subject su ON hw.subject = su.id
      LEFT JOIN  sections se ON hw.section_id = se.id
      LEFT JOIN classes c ON hw.class_id = c.id
      where hw.class_id = ? AND section_id = ?
      ORDER BY hw.created_at DESC;
    `;
    const [rows] = await db.query(sql,[classId,sectionId]);
    return res.status(200).json({ message: 'Fetched student homework successfully!', success: true, data: rows });
  } catch (error) {
    console.error("Error fetching homework:", error);
    return res.status(500).json({ message: 'Error while fetching homework!', success: false });
  }
};


exports.getStudentFeeReminder = (req,res) =>{
  const sql = `
  SELECT fa.AmountPay, fa.collectionDate, ft.name as fee_type FROM fees_assign fa
		LEFT JOIN  fees_type ft ON ft.id = fa.fees_typeId
        WHERE fa.student_rollnum = ?
  `;
}