const db = require("../../config/db");

exports.getSpecStuAttendance = async (req, res) => {
  const { rollNo } = req.params;
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

    const [rows] = await db.query(sql, [rollNo]);

    const report = rows.map((r) => {
      const Present = Number(r.Present) || 0;
      const Late = Number(r.Late) || 0;
      const Absent = Number(r.Absent) || 0;
      const Halfday = Number(r.Halfday) || 0;
      const Holiday = Number(r.Holiday) || 0;
      const TotalDays = Number(r.TotalDays) || 0;
      const totalWorkingDays = TotalDays - Holiday;
      const totalPresentDays = Present + Late + Halfday * 0.5;
      const percentage =
        totalWorkingDays > 0
          ? ((totalPresentDays / totalWorkingDays) * 100).toFixed(1)
          : "0.0";
      return {
        rollNo: r.roll_no,
        name: `${r.firstname} ${r.lastname} `,
        img: r.stu_img,
        p: Present,
        l: Late,
        a: Absent,
        h: Halfday,
        f: Holiday,
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
  const { classId, sectionId } = req.params;
  try {
    const sql = `
      SELECT 
        hw.id, 
        hw.homeworkDate,
        hw.submissionDate,
        hw.attachements,
        hw.description,
        hw.title,
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
    const [rows] = await db.query(sql, [classId, sectionId]);
    return res.status(200).json({
      message: "Fetched student homework successfully!",
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching homework:", error);
    return res
      .status(500)
      .json({ message: "Error while fetching homework!", success: false });
  }
};

exports.getStudentFeeReminder = async (req, res) => {
  try {
    const { rollNum } = req.params;
    const sql = `SELECT
       fm.totalAmount AS AmountPay,
       fm.dueDate AS collectionDate, 
       ft.name as fee_type
       FROM fees_assign fa
       LEFT JOIN fees_master fm ON fm.id = fa.fees_masterId
    LEFT JOIN  fees_type ft ON ft.id = fm.feesType
    WHERE fa.student_rollnum = ? AND fa.status='0'`;

    const [rows] = await db.execute(sql, [rollNum]);
    if (rows.length <= 0) {
      return res.status(400).json({
        success: false,
        data: rows,
      });
    }
    return res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching fee reminder:", error);
    return res
      .status(500)
      .json({ message: "Error while fetching fee reminder!", success: false });
  }
};


exports.getTeacherListOfStudentClass = async (req, res) => {
  try {
    const { classId, sectionId } = req.query;
    const sql = `SELECT t.teacher_id,t.subject,u.firstname,u.lastname,t.img_src
                  from teachers t
                  LEFT JOIN users u ON u.id = t.user_id
                  WHERE class = ? and section = ?
    ;`
    const [rows] = await db.execute(sql, [classId, sectionId]);
    if (rows.length <= 0) {
      return res.status(200).json({
        success: false,
        data: rows,
      });
    }
    return res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching teachers of student class:", error);
    return res
      .status(500)
      .json({ message: "Error while fetching teachers of student class!", success: false });
  }
}

exports.getSpeStuIssueBookData = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res
      .status(403)
      .json({ message: "please provide valid creditinal  !", success: true });
  }


  try {
    const sql = `SELECT 

              ib.id,
              ib.takenOn,
              ib.last_date,
              ib.bookId,
              ib.return_date,
              ib.status,
              b.bookImg,
              b.bookName
              FROM libraryIssueBooks ib
              LEFT JOIN library_book_info b ON ib.bookid=b.id
              WHERE ib.user_id=?

    `;

    const [rows] = await db.query(sql, [userId]);
    return res
      .status(200)
      .json({
        message: "All book fetched by student rollnumber !",
        success: true,
        data: rows,
      });
  } catch (error) {
    console.error("Error issuing book:", error);
    return res
      .status(500)
      .json({ message: "Internal server error!", success: false });
  }
};

