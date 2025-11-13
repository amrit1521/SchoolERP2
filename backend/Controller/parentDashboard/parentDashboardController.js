const db = require("../../config/db");

exports.getParentDataByParentId = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "user Not found!", success: false });
  }

  try {
    const sql = `
            SELECT 
                p.id,
                p.name,
                p.email,
                p.phone_num,
                p.img_src,
                p.created_at AS Parent_Add,
                p.relation,
                p.parent_id
            FROM parents_info p   
            WHERE p.parent_user_id = ?`;
    const sql2 = `SELECT
                       s.stu_id,
                        s.admissionnum,
                        s.rollnum,
                        s.stu_img,
                        s.gender,
                        s.class_id,
                        s.section_id,
                        UPPER(c.class_name) AS class,
                        UPPER( se.section_name) AS section,
                        CONCAT(u.firstname,' ',u.lastname) as name,
                        s.created_at AS Student_Add,
                        s.admissiondate
                     from students s
                     LEFT JOIN users u ON u.id = s.stu_id
                     LEFT JOIN classes c ON s.class_id = c.id
                     LEFT JOIN sections se ON s.section_id = se.id
                     where s.parent_id=?`;

    const [parent] = await db.query(sql, [userId]);
    const [students] = await db.query(sql2, [parent[0].parent_id]);
    if (parent.length === 0) {
      return res
        .status(404)
        .json({ message: "Parent not found!", success: false });
    }

    const result = {
      ...parent[0],
      child: students,
    };

    return res.status(200).json({
      message: "Parent fetched successfully!",
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("getParentDataByParentId Error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error!", success: false });
  }
};

exports.getAvailableLeave = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res
        .status(400)
        .json({ message: "user Not found!", success: false });
    }
    const sql = `SELECT li.medical_leaves, li.casual_leaves from leaves_info li where li.user_id = ?`;
    const [rows] = await db.query(sql, [userId]);
    if (rows.length == 0) {
      return res
        .status(200)
        .json({ message: "total leaves not found!", success: false });
    }
    return res.status(200).json({
      message: "total leaves available fetched successfully!",
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("getAvailableLeave Error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error!", success: false });
  }
};

exports.getAllStudentsOfParents = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res
        .status(400)
        .json({ message: "user Not found!", success: false });
    }

    const [parentData] = await db.execute(
      `SELECT p.parent_id
            FROM parents_info p   
            WHERE p.parent_user_id = ?`,
      [userId]
    );

    const sql = `
            SELECT 
                u.id AS user_id,
                u.firstname,
                u.lastname,
                u.mobile,
                u.email,
                u.roll_id,
                r.role_name,
                u.status,
                s.id AS student_id,
                s.stu_id,
                s.academicyear,
                s.admissionnum,
                s.admissiondate,
                s.rollnum,
                UPPER(c.class_name) as class,
                s.class_id,
               UPPER( se.section_name) as section,
                s.section_id,
                s.gender,
                s.dob,
                s.bloodgp,
                s.house,
                s.religion,
                s.category,
                s.caste,
                p.name,
                s.motherton,
                s.lanknown,
                s.stu_img
            FROM users u
            RIGHT JOIN students s
                ON u.id = s.stu_id
            RIGHT JOIN classes  c ON c.id =  s.class_id
            RIGHT JOIN sections se ON se.id = s.section_id
            LEFT JOIN parents_info p ON s.parent_id = p.parent_id AND relation = "Father"
            JOIN roles r on r.id=u.roll_id
            WHERE s.parent_id=?
        `;

    const [students] = await db.query(sql, [parentData[0]?.parent_id]);

    res.status(200).json({
      message: "Students fetched successfully",
      success: true,
      students,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error!", success: false });
  }
};

exports.getAllMyChildrenHomeWork = async (req, res) => {
  const { userId } = req.params;
  try {
    const [parentData] = await db.execute(
      `SELECT p.parent_id
            FROM parents_info p   
            WHERE p.parent_user_id = ?`,
      [userId]
    );

    const [userRows] = await db.query(
      `SELECT
        s.stu_id,
        s.class_id,
        CONCAT(u.firstname,' ',u.lastname) as name,
        s.section_id,
        s.rollnum
        FROM students s
      LEFT JOIN users u ON u.id = s.stu_id
      WHERE s.parent_id = ?`,
      [parentData[0]?.parent_id]
    );
    if (!userRows || userRows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    const sql = `SELECT hw.id,c.class_name AS className,
        s.section_name AS section,
        hw.subject AS subject_id,
        t.img_src,
        hw.status,
        hw.teacherId,
        hw.homeworkDate,
        hw.submissionDate,
        hw.attachements,
        hw.description,
        hw.title,
        t.user_id,
        cs.name as subject,
        c.id as class_id,
        s.id as section_id,
        u.firstname,u.lastname 
        FROM home_work as hw
        LEFT JOIN classes AS c ON c.id = hw.class_id
        LEFT JOIN sections AS s ON s.id = hw.section_id
        LEFT JOIN class_subject AS cs On cs.id = hw.subject
        LEFT JOIN users AS u ON u.id = hw.teacherId
        LEFT JOIN teachers t ON hw.teacherId = t.user_id
        WHERE hw.class_id = ? AND hw.section_id = ?`;

    const result = [];
    for (student of userRows) {
      const [home_work] = await db.query(sql, [
        student?.class_id,
        student?.section_id,
      ]);
      result.push({
        student_id: student.stu_id,
        student_name: student.name,
        home_work: home_work,
      });
    }
    return res.status(200).json({
      message: "Fetched all homework successfully!",
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching student homework:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

exports.getAllChildAttendance = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(404).json({
        success: false,
        message: "user not found.",
      });
    }

    const [parentData] = await db.execute(
      `SELECT p.parent_id
            FROM parents_info p   
            WHERE p.parent_user_id = ?`,
      [userId]
    );

    const [userRows] = await db.query(
      `SELECT
        s.stu_id,
        s.class_id,
        CONCAT(u.firstname,' ',u.lastname) as name,
        s.section_id,
        s.rollnum
        FROM students s
      LEFT JOIN users u ON u.id = s.stu_id
      WHERE s.parent_id = ?`,
      [parentData[0]?.parent_id]
    );
    if (!userRows || userRows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    let str = userRows.reduce((prev, _) => prev + "?,", "");
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
      WHERE a.student_rollnum IN (${str.slice(0, str.length - 1)})
      GROUP BY s.rollnum, s.stu_img, u.firstname, u.lastname
      ORDER BY s.rollnum ASC
    `;

    const [rows] = await db.query(
      sql,
      userRows.map((item) => item.rollnum)
    );

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

exports.getAllChildrenFeeReminder = async (req, res) => {
  try {
    const userId = req.params?.userId;

    if (!userId) {
      return res.status(404).json({
        success: false,
        message: "user not found.",
      });
    }

    const [parentData] = await db.execute(
      `SELECT p.parent_id
            FROM parents_info p   
            WHERE p.parent_user_id = ?`,
      [userId]
    );

    const [userRows] = await db.query(
      `SELECT
        s.stu_id,
        s.class_id,
        CONCAT(u.firstname,' ',u.lastname) as name,
        s.section_id,
        s.rollnum
        FROM students s
      LEFT JOIN users u ON u.id = s.stu_id
      WHERE s.parent_id = ?`,
      [parentData[0]?.parent_id]
    );
    if (!userRows || userRows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    const sql = `SELECT 
                  fa.id as fee_assign_id,
                    fa.AmountPay, 
                    fa.collectionDate, 
                    ft.name AS fee_type,
                    fg.id AS fees_group_id,
                    fg.feesGroup,
                    st.gender,
                    c.class_name,
                    se.section_name 
                FROM fees_assign fa
                LEFT JOIN fees_type ft ON ft.id = fa.fees_typeId
                LEFT JOIN fees_group fg ON fg.id = fa.fees_groupId
                LEFT JOIN students st ON st.rollnum = fa.student_rollnum
                LEFT JOIN classes c ON st.class_id = c.id
                LEFT JOIN sections se ON st.section_id = se.id
                WHERE fa.student_rollnum = ?`;

    const result = [];
    for (user of userRows) {
      const [rows] = await db.execute(sql, [user.rollnum]);
      result.push({
        student_id: user.stu_id,
        student_name: user.name,
        fees: rows,
      });
    }

    if (result.length <= 0) {
      return res.status(200).json({
        success: false,
        data: result,
      });
    }
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching fee reminder:", error);
    return res
      .status(500)
      .json({ message: "Error while fetching fee reminder!", success: false });
  }
};

exports.getAllChildLeaveData = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(404).json({
        success: false,
        message: "user not found.",
      });
    }

    const [parentData] = await db.execute(
      `SELECT p.parent_id
            FROM parents_info p   
            WHERE p.parent_user_id = ?`,
      [userId]
    );

    const [userRows] = await db.query(
      `SELECT
        s.stu_id,
        s.class_id,
        CONCAT(u.firstname,' ',u.lastname) as name,
        s.section_id,
        s.rollnum
        FROM students s
      LEFT JOIN users u ON u.id = s.stu_id
      WHERE s.parent_id = ?`,
      [parentData[0]?.parent_id]
    );
    if (!userRows || userRows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }
    const sql = `
              SELECT 
              lt.id,
              lt.name, 
              lt.total_allowed,
              IFNULL(SUM(la.no_of_days), 0) AS used,
              (lt.total_allowed - IFNULL(SUM(la.no_of_days), 0)) AS avilable
              FROM leaves_type lt
              LEFT JOIN leave_application la
              ON la.leave_type_id = lt.id
              AND la.id_or_rollnum = ?
              AND la.status = "1"
              GROUP BY lt.id
              ORDER BY lt.id ASC
              `;
    const sql2 = `
            SELECT 
            la.id,
            la.no_of_days,
            la.from_date,
            la.to_date,
            la.applied_on,
            la.status,
            lt.name AS leave_type
            FROM leave_application la 
            LEFT JOIN leaves_type lt
            ON la.leave_type_id = lt.id
            WHERE la.id_or_rollnum = ?
            ORDER BY la.applied_on DESC
            `;
    const result = [];
    for (user of userRows) {
      const [leave_inform] = await db.query(sql, user.rollnum);
      const [stuAllLeave] = await db.query(sql2, user.rollnum);
      result.push({
        student_id: user.stu_id,
        student_name: user.name,
        leave_inform: leave_inform,
        stuAllLeave: stuAllLeave,
      });
    }

    return res.status(200).json({
      message: "Leave information fetched successFully!",
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong!",
      success: false,
      error: error.message,
    });
  }
};

exports.getTimeTableForAllChild = async (req, res) => {
  try {
    const userId = req.params?.userId;

    if (!userId) {
      return res.status(404).json({
        success: false,
        message: "user not found.",
      });
    }
    const [parentData] = await db.execute(
      `SELECT p.parent_id
            FROM parents_info p   
            WHERE p.parent_user_id = ?`,
      [userId]
    );

    const [userRows] = await db.query(
      `SELECT
        s.stu_id,
        s.class_id,
        CONCAT(u.firstname,' ',u.lastname) as name,
        s.section_id,
        s.rollnum
        FROM students s
      LEFT JOIN users u ON u.id = s.stu_id
      WHERE s.parent_id = ?`,
      [parentData[0]?.parent_id]
    );
    if (!userRows || userRows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }
    const result = [];
    for (timetable of userRows) {
      const [timetableRows] = await db.query(
        `SELECT 
          tt.id,
          c.class_name as class,
          se.section_name as section, 
          cs.name as subject,
          tt.teacher as teacher_id,
          tt.timefrom,
          tt.timeto,
          tt.day,
          CONCAT(u.firstname,' ',u.lastname) as teacher
          FROM timetable tt
          LEFT JOIN users u ON u.id = tt.teacher
          LEFT JOIN classes c ON tt.class = c.id
          LEFT JOIN sections se ON tt.section = se.id
          LEFT JOIN class_subject cs ON cs.id = tt.subject
          WHERE class=? and section=?
         ORDER BY day, timefrom`,
        [timetable?.class_id, timetable?.section_id]
      );
      result.push(
        {
            student_id: timetable.stu_id,
            student_name: timetable.name,
            timetable: timetableRows,
          }
      );
    }

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching timetable:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.getFeesDeatilsOfAllChild = async (req, res) => {
  try {
    const userId = req.params?.userId;

    if (!userId) {
      return res.status(404).json({
        success: false,
        message: "user not found.",
      });
    }

    const [parentData] = await db.execute(
      `SELECT p.parent_id
            FROM parents_info p   
            WHERE p.parent_user_id = ?`,
      [userId]
    );

    const [userRows] = await db.query(
      `SELECT
        s.stu_id,
        s.class_id,
        CONCAT(u.firstname,' ',u.lastname) as name,
        s.section_id,
        s.rollnum
        FROM students s
      LEFT JOIN users u ON u.id = s.stu_id
      WHERE s.parent_id = ?`,
      [parentData[0]?.parent_id]
    );
    if (!userRows || userRows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    const sql = `
      SELECT 
        sfa.id,
        sfa.assigned_date,
        sfa.AmountPay,
        sfa.collectionDate,
        sfa.PayementType AS mode,
        sfa.paymentRefno,
        sfa.status,
        sfa.discount,
        fm.fineAmount AS fine,
        fm.dueDate,
        fm.totalAmount,
        fg.feesGroup,
        ft.name AS feesType,
        st.class_id,
        st.section_id,
        UPPER(c.class_name) AS class,
        UPPER(se.section_name) AS section
        FROM fees_assign sfa
        LEFT JOIN fees_master fm ON fm.id = sfa.fees_masterId
        LEFT JOIN fees_group fg ON fm.feesGroup = fg.id
        LEFT JOIN fees_type ft ON fm.feesType = ft.id
        LEFT JOIN students st ON sfa.student_rollnum = st.rollnum    
        LEFT JOIN classes c ON st.class_id = c.id
        LEFT JOIN sections se ON st.section_id = se.id
        WHERE sfa.student_rollnum = ?
       
    `;
    const result = [];
    for (user of userRows) {
      const [rows] = await db.query(sql, [user.rollnum]);
      result.push({
        student_id: user.stu_id,
        student_name: user.name,
        feesdata: rows,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Fee details fetched successfully",
      feesdata: result,
    });
  } catch (error) {
    console.error("❌ Error fetching fee details:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getExamResultOfAllChild = async (req, res) => {
  const userId = req.params?.userId;

  if (!userId) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }
  try {

    const [userRows] = await db.query(
      `SELECT
        s.stu_id,
        s.class_id,
        CONCAT(u.firstname, ' ', u.lastname) AS name,
        s.section_id,
        s.rollnum
      FROM students s
      LEFT JOIN users u ON u.id = s.stu_id
      WHERE s.parent_id = ?`,
      [userId]
    );

    if (!userRows || userRows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found." });
    }

    const sql = `
      SELECT 
        er.max_mark,
        er.min_mark,
        er.mark_obtained,
        er.grade,
        er.result,
        en.examName,
        cs.name AS subject_name,
        cs.code,
        s.rollnum,
        s.stu_img,
        s.section_id,
        s.class_id,
        cl.class_name,
        se.section_name,
        CONCAT(u.firstname, ' ', u.lastname) AS student_name
      FROM exam_result er
      LEFT JOIN examName en ON er.exam_name_id = en.id
      LEFT JOIN class_subject cs ON er.subject_id = cs.id
      LEFT JOIN students s ON er.roll_num = s.rollnum
      JOIN classes cl ON cl.id = s.class_id
      JOIN sections se ON se.id = s.section_id
      LEFT JOIN users u ON s.stu_id = u.id
      WHERE er.roll_num = ?
      ORDER BY en.examName, cs.name
    `;

    const finalResults = [];

    for (const user of userRows) {
      const [rows] = await db.query(sql, [user.rollnum]);
      if (!rows.length) continue;

      const examsMap = {};

      for (const row of rows) {
        if (!examsMap[row.examName]) {
          examsMap[row.examName] = {
            rollNum: row.rollnum,
            student_name: row.student_name,
            class: row.class_name,
            section: row.section_name,
            exam_name: row.examName,
            img: row.stu_img,
            totalMax: 0,
            totalObtained: 0,
            subjects: [],
          };
        }

        examsMap[row.examName].subjects.push({
          subject_name: row.subject_name,
          max_mark: row.max_mark,
          mark_obtained: row.mark_obtained,
          result: row.result,
        });

        examsMap[row.examName].totalMax += row.max_mark || 0;
        examsMap[row.examName].totalObtained += row.mark_obtained || 0;
      }
      for (const exam of Object.values(examsMap)) {
        const allPassed = exam.subjects.every(
          (s) => s.result.toLowerCase() === "pass"
        );
        const overallPercentage = exam.totalMax
          ? (exam.totalObtained / exam.totalMax) * 100
          : 0;

        finalResults.push({
          rollNum: exam.rollNum,
          student_name: exam.student_name,
          class: exam.class,
          section: exam.section,
          exam_name: exam.exam_name,
          img: exam.img,
          marks: Number(overallPercentage.toFixed(2)),
          result_status: allPassed ? "Pass" : "Fail",
        });
      }
    }

    if (!finalResults.length) {
      return res
        .status(404)
        .json({ success: false, message: "No results found!" });
    }

    return res.status(200).json({
      success: true,
      message: "Results fetched successfully!",
      data: finalResults,
    });
  } catch (error) {
    console.error("Error fetching exam results:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
};


// import {
//   getExamNameForStudent,
//   getExamResultForStudent,
//   getSpecStudentProfileDetails,
// } from "../service/studentapi";