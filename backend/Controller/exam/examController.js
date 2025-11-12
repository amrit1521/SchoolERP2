const { success } = require("zod");
const db = require("../../config/db");
const dayjs = require("dayjs");

// Add Exam Name Controller===========================================
exports.addExamName = async (req, res) => {
  try {
    const { examName, examDate, startTime, endTime } = req.body;

    if (!examName || !examDate || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message:
          "All fields (examName, examDate, startTime, endTime) are required.",
      });
    }

    const sql = `
      INSERT INTO examName (examName, examDate, startTime, endTime)
      VALUES (?, ?, ?, ?)
    `;
    const formattedDate = dayjs(examDate).format("YYYY-MM-DD");

    const [result] = await db.query(sql, [
      examName,
      formattedDate,
      startTime,
      endTime,
    ]);

    return res.status(201).json({
      success: true,
      message: "Exam created successfully.",
    });
  } catch (error) {
    console.error("Error adding exam:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

exports.allExamData = async (req, res) => {
  try {
    const sql = `SELECT * FROM examName ORDER BY examDate DESC`;
    const [rows] = await db.query(sql);

    return res.status(200).json({
      success: true,
      message: "All exams fetched successfully.",
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching exams:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

exports.deleteExam = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Exam ID is required.",
      });
    }

    const sql = `DELETE FROM examName WHERE id = ?`;
    const [result] = await db.query(sql, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Exam not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Exam deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting exam:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

exports.editExam = async (req, res) => {
  try {
    const { id } = req.params;
    const { examName, examDate, startTime, endTime } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Exam ID is required.",
      });
    }

    if (!examName || !examDate || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const sql = `
      UPDATE examName 
      SET examName = ?, examDate = ?, startTime = ?, endTime = ?
      WHERE id = ?
    `;

    const [result] = await db.query(sql, [
      examName,
      examDate,
      startTime,
      endTime,
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Exam not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Exam updated successfully.",
    });
  } catch (error) {
    console.error("Error updating exam:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

exports.getExamById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Exam ID is required.",
      });
    }

    const sql = `SELECT * FROM examName WHERE id = ? LIMIT 1`;
    const [rows] = await db.query(sql, [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Exam not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Exam fetched successfully.",
      data: rows[0],
    });
  } catch (error) {
    console.error("Error fetching exam by id:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// exam schedule===========================================================
exports.addExamSchedule = async (req, res) => {
  try {
    const {
      className,
      section,
      examName,
      startTime,
      endTime,
      duration,
      examDate,
      subject,
      roomNo,
      maxMarks,
      minMarks,
    } = req.body;

    // ✅ Validation
    if (
      !className ||
      !section ||
      !examName ||
      !startTime ||
      !endTime ||
      !duration ||
      !examDate ||
      !subject ||
      !roomNo ||
      !maxMarks ||
      !minMarks
    ) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    const sql = `
      INSERT INTO examSchedule 
      (className, section, examName, startTime, endTime, duration, examDate, subject, roomNo, maxMarks, minMarks) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      className,
      section,
      examName,
      startTime,
      endTime,
      duration,
      examDate,
      subject,
      roomNo,
      maxMarks,
      minMarks,
    ];

    const [result] = await db.query(sql, values);

    return res.status(201).json({
      message: "Exam Schedule created successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

exports.getAllExamSchedules = async (req, res) => {
  try {
    const sql = `
      SELECT 
      es.id,
        es.subject,
        es.duration,
        es.roomNo,
        es.maxMarks,
        es.minMarks,
        ed.examDate,
        et.endTime,
        st.startTime,
        sub.name AS subject,
        ro.room_no AS roomNo
      FROM examSchedule es
      LEFT JOIN examName ed ON es.examDate = ed.id
      LEFT JOIN examName et ON es.endTime = et.id
      LEFT JOIN examName st ON es.startTime = st.id
      LEFT JOIN class_subject sub ON es.subject = sub.id
      LEFT JOIN class_room ro ON es.roomNo = ro.id
    `;

    const [rows] = await db.query(sql);
    return res.status(200).json({
      message: "All exam schedule fetched successfully !",
      success: true,
      data: rows,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error!", success: false });
  }
};

exports.deleteExamSchedule = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res
      .status(403)
      .json({ message: "Id is required !", success: false });
  }

  try {
    const [result] = await db.query(`DELETE FROM examSchedule WHERE id=?`, [
      id,
    ]);
    if (result.affectedRows === 0) {
      return res
        .status(400)
        .json({ message: "ExamShedule not found !", success: false });
    }
    return res
      .status(200)
      .json({ message: "ExamSchedule deleted successfully !", success: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error!", success: false });
  }
};

exports.getSheduleById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res
      .status(403)
      .json({ message: "Id is required !", success: false });
  }

  try {
    const [rows] = await db.query(
      `SELECT * FROM examSchedule WHERE id=? LIMIT 1`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Exam Schedule not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Exam Schedule fetched successfully.",
      data: rows[0],
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error!", success: false });
  }
};

exports.updateExamSchedule = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ success: false, message: "Id is required!" });
  }

  const {
    className,
    section,
    examName,
    startTime,
    endTime,
    duration,
    examDate,
    subject,
    roomNo,
    maxMarks,
    minMarks,
  } = req.body;

  // ✅ Validation
  if (
    !className ||
    !section ||
    !examName ||
    !startTime ||
    !endTime ||
    !duration ||
    !examDate ||
    !subject ||
    !roomNo ||
    !maxMarks ||
    !minMarks
  ) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    const sql = `
      UPDATE examSchedule
      SET className = ?, section = ?, examName = ?, startTime = ?, endTime = ?, 
          duration = ?, examDate = ?, subject = ?, roomNo = ?, maxMarks = ?, minMarks = ?
      WHERE id = ?
    `;

    const values = [
      className,
      section,
      examName,
      startTime,
      endTime,
      duration,
      examDate,
      subject,
      roomNo,
      maxMarks,
      minMarks,
      id,
    ];

    const [result] = await db.query(sql, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Exam Schedule not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Exam Schedule updated successfully.",
    });
  } catch (error) {
    console.error("updateExamSchedule error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};

exports.filterExamNameForOption = async (req, res) => {
  const data = req.body;
  try {
    const sql = `
      SELECT 
      e.id,
      e.examName
      FROM examSchedule es
      LEFT JOIN examName e ON es.examName = e.id
      WHERE className=? AND section=?
      GROUP BY id
    `;

    const [rows] = await db.query(sql, [data.class, data.section]);

    return res.status(200).json({
      message: "All exam fetched successfully for specific class !",
      success: true,
      data: rows,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error!", success: false });
  }
};

exports.filterExamSubjectForOption = async (req, res) => {
  const data = req.body;

  try {
    const sql = `
      SELECT 
        es.maxMarks,
        es.minMarks,
        s.id,
        s.name,
        s.code
      FROM examSchedule es
      LEFT JOIN class_subject s ON es.subject = s.id
      WHERE es.className = ? AND es.section = ? AND es.examName = ?
    `;

    const [rows] = await db.query(sql, [
      data.class,
      data.section,
      data.exam_name_id,
    ]);

    return res.status(200).json({
      message: "All exam subjects fetched successfully for specific class!",
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error!",
      success: false,
    });
  }
};

// exam grade===============================================================

exports.addExamGrade = async (req, res) => {
  try {
    const { grade, marksFrom, marksUpto, gradePoints, status, description } =
      req.body;

    if (!grade || !marksFrom || !marksUpto || !gradePoints) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided!",
      });
    }

    const sql = `
      INSERT INTO examGrade
      (grade, marksFrom, marksUpto, gradePoints, status, description) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [
      grade,
      marksFrom,
      marksUpto,
      gradePoints,
      status,
      description,
    ];

    const [result] = await db.query(sql, values);

    return res.status(201).json({
      success: true,
      message: "Grade added successfully!",
    });
  } catch (error) {
    console.error("Error inserting grade:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error!",
    });
  }
};

exports.allGrades = async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM examGrade ORDER BY id ASC`);
    return res.status(200).json({
      message: "All grade fetched successgully !",
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

exports.getGradeById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(`SELECT * FROM examGrade WHERE id = ?`, [id]);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Grade not found" });
    }

    return res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

exports.updateGrade = async (req, res) => {
  try {
    const { id } = req.params;
    const { grade, marksFrom, marksUpto, gradePoints, status, description } =
      req.body;

    const sql = `UPDATE examGrade SET 
      grade = ?, marksFrom = ?, marksUpto = ?, gradePoints = ?, status = ?, description = ? 
      WHERE id = ?`;

    const [result] = await db.query(sql, [
      grade,
      marksFrom,
      marksUpto,
      gradePoints,
      status,
      description,
      id,
    ]);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Grade not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Grade updated successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

exports.deleteGrade = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(`DELETE FROM examGrade WHERE id = ?`, [id]);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Grade not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Grade deleted successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// add exam result
const calculateResult = (mark_obtained, max_mark, min_mark) => {
  const percent = (mark_obtained / max_mark) * 100;
  let grade = "F";

  if (percent >= 90) grade = "A+";
  else if (percent >= 80) grade = "A";
  else if (percent >= 70) grade = "B+";
  else if (percent >= 60) grade = "B";
  else if (percent >= 50) grade = "C";
  else if (percent >= 33) grade = "D";

  const result = mark_obtained >= min_mark ? "Pass" : "Fail";
  return { grade, result };
};

const calculateGradeResult = (grade) => {
  if (grade === "A") return "Pass";
  if (grade === "B") return "Pass";
  if (grade === "C") return "Pass";
  if (grade === "D") return "Pass with Grace";
  if (grade === "E") return "Fail";
  if (grade === "F") return "Fail";
};

const calculateObtainedMarksForGrades = (grade) => {
  if (grade === "A") return 90;
  if (grade === "B") return 80;
  if (grade === "C") return 70;
  if (grade === "D") return 60;
  if (grade === "E") return 50;
  if (grade === "F") return 30;
};

exports.addExamResult = async (req, res) => {
  try {
    const grade = null,
      result = null;
    const {
      roll_num,
      exam_name_id,
      subject_id,
      max_mark,
      min_mark,
      mark_obtained,
      marks_type,
      grade_marks,
    } = req.body;

    if (marks_type === "marks") {
      if (
        !roll_num ||
        !exam_name_id ||
        !subject_id ||
        max_mark == null ||
        min_mark == null ||
        mark_obtained == null
      ) {
        return res
          .status(400)
          .json({ success: false, message: "All fields are required." });
      }

      if (min_mark > max_mark) {
        return res.status(400).json({
          success: false,
          message: "Minimum marks cannot be greater than maximum marks.",
        });
      }

      if (mark_obtained > max_mark) {
        return res.status(400).json({
          success: false,
          message: "Marks obtained cannot exceed maximum marks.",
        });
      }
    }

    const [existingResult] = await db.execute(
      `SELECT id FROM exam_result WHERE roll_num = ? AND exam_name_id = ? AND subject_id = ?`,
      [roll_num, exam_name_id, subject_id]
    );

    if (existingResult.length > 0) {
      return res.status(409).json({
        success: false,
        message:
          "Result for this exam and subject already exists for this student.",
      });
    }

    if (marks_type === "marks") {
      const { grade, result } = calculateResult(
        mark_obtained,
        max_mark,
        min_mark
      );
      grade = grade;
      result = result;
      await db.execute(
        `INSERT INTO exam_result (roll_num, exam_name_id, subject_id, max_mark, min_mark, mark_obtained, grade, result)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          roll_num,
          exam_name_id,
          subject_id,
          max_mark,
          min_mark,
          mark_obtained,
          grade,
          result,
        ]
      );
      return res.status(201).json({
        success: true,
        message: "Exam result added successfully.",
        data: {
          roll_num,
          exam_name_id,
          subject_id,
          max_mark,
          min_mark,
          mark_obtained,
          grade,
          result,
        },
      });
    }

    if (marks_type === "grade") {
      const result = calculateGradeResult(grade_marks);
      const ans = await db.execute(
        `INSERT INTO exam_result (roll_num, exam_name_id, subject_id, grade_marks,grade,result)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [roll_num, exam_name_id, subject_id, grade_marks, grade_marks, result]
      );
      return res.status(201).json({
        success: true,
        message: "Exam result added successfully with grade.",
        data: {
          roll_num,
          exam_name_id,
          subject_id,
          grade_marks,
          grade,
          result,
        },
      });
    }
  } catch (error) {
    console.error("❌ Error adding exam result:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

exports.addExamResult2 = async (req, res) => {
  try {
    const { exam_name_id, marksDataList } = req.body;

    if (!exam_name_id || !Array.isArray(marksDataList)) {
      return res.status(400).json({
        success: false,
        message: "exam_name_id and a valid marksDataList array are required.",
      });
    }

    let totalInserted = 0;
    let totalUpdated = 0;

    for (const student of marksDataList) {
      const { admissionNum, rollNum, marks } = student;

      if (!rollNum || !Array.isArray(marks)) {
        return res.status(400).json({
          success: false,
          message: `Invalid or missing marks data for student ${admissionNum || rollNum}`,
        });
      }

      for (const subject of marks) {
        const { subject_id, mark, minMarks, maxMarks } = subject;

        if (!subject_id) {
          return res.status(400).json({
            success: false,
            message: `Missing subject_id for roll number ${rollNum}`,
          });
        }

        const [existingRows] = await db.execute(
          `SELECT mark_obtained FROM exam_result 
           WHERE roll_num = ? AND exam_name_id = ? AND subject_id = ?`,
          [rollNum, exam_name_id, subject_id]
        );

        const existingResult = existingRows[0];

        const { grade, result } = calculateResult(
          parseFloat(mark),
          parseFloat(maxMarks),
          parseFloat(minMarks)
        );

      //  console.log(grade  ,result)

        if (existingResult) {
          if (existingResult.mark_obtained !== mark) {
            await db.execute(
              `UPDATE exam_result 
               SET mark_obtained = ?, grade = ?, result = ?
               WHERE exam_name_id = ? AND roll_num = ? AND subject_id = ?`,
              [mark, grade, result, exam_name_id, rollNum, subject_id]
            );
            totalUpdated++;
          } else {
            continue;
          }
        } else {
          await db.execute(
            `INSERT INTO exam_result 
              (roll_num, exam_name_id, subject_id, max_mark, min_mark, mark_obtained, grade, result)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              rollNum,
              exam_name_id,
              subject_id,
              maxMarks,
              minMarks,
              mark,
              grade,
              result,
            ]
          );
          totalInserted++;
        }
      }
    }

    return res.status(201).json({
      success: true,
      message: "Exam results processed successfully.",
      totalInserted,
      totalUpdated,
    });
  } catch (error) {
    console.error("Error adding exam results:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

exports.examNameForStudentResults = async (req, res) => {
  const { rollNum } = req.params;
  try {
    const sql = `
    SELECT er.exam_name_id, er.roll_num, en.examName
    FROM exam_result er
    JOIN examName en ON er.exam_name_id = en.id
    WHERE er.roll_num = ?
    GROUP BY er.exam_name_id, er.roll_num;
    `;
    const [rows] = await db.query(sql, [rollNum]);
    if (!rows.length) {
      return res
        .status(404)
        .json({ success: false, message: "No results found!" });
    }
    return res.status(200).json({
      success: true,
      message: "Exam Name fetched successfully!",
      data: rows,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error!", success: false });
  }
};

exports.getExamResultSpeStudents = async (req, res) => {
  const { rollnum } = req.params;
  try {
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
        s.section_id,
        s.class_id,
        s.stu_img,
        s.perm_address,
        s.dob,
        s.academicyear,
        cl.class_name,
        se.section_name,
        s.admissionnum,
        p.name,
        p.phone_num,
        u.firstname,
        u.lastname
      FROM exam_result er
      LEFT JOIN examName en ON er.exam_name_id = en.id
      LEFT JOIN class_subject cs ON er.subject_id = cs.id
      LEFT JOIN students s ON er.roll_num = s.rollnum
      JOIN classes cl ON cl.id = s.class_id
      JOIN sections se ON se.id = s.section_id
      LEFT JOIN parents_info p ON p.user_id = s.stu_id AND relation="Father"
      LEFT JOIN users u ON s.stu_id = u.id
      WHERE er.roll_num = ?
      ORDER BY en.examName, cs.name
    `;

    const [rows] = await db.query(sql, [rollnum]);

    if (!rows.length) {
      return res
        .status(404)
        .json({ success: false, message: "No results found!" });
    }

    // Group data by student
    const studentsMap = {};

    rows.forEach((row) => {
      const studentKey = row.rollnum;

      if (!studentsMap[studentKey]) {
        studentsMap[studentKey] = {
          rollnum: row.rollnum,
          firstname: row.firstname,
          lastname: row.lastname,
          class: row.class_name,
          section: row.section_name,
          fat_name: row.name,
          phone_num: row.phone_num,
          student_image: row.stu_img,
          stud_admNo: row.admissionnum,
          stud_dob: row.dob,
          stud_address: row.perm_address,
          stud_academicYear: row.academicyear,
          exams: {},
        };
      }

      const student = studentsMap[studentKey];

      if (!student.exams[row.examName]) {
        student.exams[row.examName] = {
          exam_name: row.examName,
          subjects: [],
        };
      }

      student.exams[row.examName].subjects.push({
        subject_name: `${row.subject_name}(${row.code})`,
        max_mark: row.max_mark,
        min_mark: row.min_mark,
        mark_obtained: row.mark_obtained,
        grade: row.grade,
        result: row.result,
      });
    });

    // Convert exams object to array for each student
    const students = Object.values(studentsMap).map((student) => ({
      ...student,
      exams: Object.values(student.exams),
    }));

    return res.status(200).json({
      success: true,
      message: "Results fetched successfully!",
      data: students,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error!", success: false });
  }
};

exports.getExamResultAllStudents = async (req, res) => {
  try {
    const sql = `
      SELECT 
        er.id,
        er.mark_obtained,
        er.max_mark,
        er.grade_marks,
        en.examName,
        cs.name AS subject_name,
        cs.code,
        s.admissionnum,
        s.rollnum,
        s.section_id,
        s.class_id,
        cl.class_name,
        se.section_name,
        s.stu_img,
        p.name AS father_name,
        p.phone_num,
        u.firstname,
        u.lastname
      FROM exam_result er
      LEFT JOIN examName en ON er.exam_name_id = en.id
      LEFT JOIN class_subject cs ON er.subject_id = cs.id
      LEFT JOIN students s ON er.roll_num = s.rollnum
      JOIN classes cl ON cl.id = s.class_id
      JOIN sections se ON se.id = s.section_id
      LEFT JOIN parents_info p ON p.user_id = s.stu_id AND p.relation = "Father"
      LEFT JOIN users u ON s.stu_id = u.id
      ORDER BY s.rollnum, en.examName, cs.name
    `;

    const [rows] = await db.query(sql);

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "No results found!",
      });
    }
    // Group data per student per exam
    const studentsMap = {};

    rows.forEach((row) => {
      const key = `${row.rollnum}_${row.examName}`; // unique key per student per exam
      // console.log(key);
      if (!studentsMap[key]) {
        studentsMap[key] = {
          key: row.id,
          rollnum: row.rollnum,
          admissionNo: row.admissionnum,
          studentName: `${row.firstname} ${row.lastname}`,
          class_id: row.class_id,
          section_id: row.section_id,
          class: row.class_name,
          section: row.section_name,
          img: row.stu_img || "assets/img/students/default.jpg",
          examName: row.examName,
          subjects: {},
          totalMaxMarks: 0, // <-- add max marks sum
        };
      }

      const subjKey = `${row.subject_name} (${row.code})`;
      if (!row.grade_marks) {
        studentsMap[key].subjects[subjKey] = {
          id: row.id,
          mark_obtained: row.mark_obtained || 0,
          max_mark: row.max_mark || 0,
        };
      } else {
        studentsMap[key].subjects[subjKey] = {
          id: row.id,
          grade_marks: row.grade_marks || "",
        };
      }

      // Increment total max marks for this exam
      studentsMap[key].totalMaxMarks += row.max_mark || 0;
    });

    // Calculate total, percent, grade, and result per exam
    const students = Object.values(studentsMap).map((student) => {
      let totalObtained = 0;

      Object.values(student.subjects).forEach((subj) => {
        if (subj.mark_obtained) {
          totalObtained += subj.mark_obtained;
        } else if (subj.grade_marks) {
          totalObtained += calculateObtainedMarksForGrades(subj.grade_marks);
        }
      });

      const percent =
        student.totalMaxMarks > 0
          ? Number(((totalObtained / student.totalMaxMarks) * 100).toFixed(2))
          : 0;

      let overallGrade = "F";

      if (percent >= 90) overallGrade = "A+";
      else if (percent >= 80) overallGrade = "A";
      else if (percent >= 70) overallGrade = "B+";
      else if (percent >= 60) overallGrade = "B";
      else if (percent >= 50) overallGrade = "C";
      else if (percent >= 33) overallGrade = "D";

      const overallResult = percent < 33 ? "Fail" : "Pass";
      // console.log(student);
      // console.log(student);
      return {
        ...student,
        total: totalObtained,
        totalMaxMarks: student.totalMaxMarks,
        percent,
        grade: overallGrade,
        result: overallResult,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Results fetched successfully!",
      data: students,
    });
  } catch (error) {
    console.error("❌ Error in getExamResultAllStudents:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};

exports.getExamResultAllStudentsOfAClass = async (req, res) => {
  const { classId } = req.params;
  try {
    const sql = `
      SELECT 
        er.id,
        er.mark_obtained,
        er.max_mark,
        er.grade_marks,
        er.grade,
        en.examName,
        cs.name AS subject_name,
        cs.code,
        s.admissionnum,
        s.rollnum,
        s.section_id,
        s.class_id,
        cl.class_name,
        se.section_name,
        s.perm_address,
        s.dob,
        s.academicyear,
        s.stu_img,
        p.name AS father_name,
        p.phone_num,
        u.firstname,
        u.lastname
      FROM exam_result er
      LEFT JOIN examName en ON er.exam_name_id = en.id
      LEFT JOIN class_subject cs ON er.subject_id = cs.id
      LEFT JOIN students s ON er.roll_num = s.rollnum
      JOIN classes cl ON cl.id = s.class_id
      JOIN sections se ON se.id = s.section_id
      LEFT JOIN parents_info p ON p.user_id = s.stu_id AND p.relation = "Father"
      LEFT JOIN users u ON s.stu_id = u.id
      Where s.class_id = ?
      ORDER BY s.rollnum, en.examName, cs.name
    `;

    const [rows] = await db.query(sql, [classId]);

    if (!rows.length) {
      return res.status(200).json({
        success: false,
        message: "No results found!",
      });
    }
    const studentsMap = {};

    rows.forEach((row) => {
      const key = `${row.rollnum}_${row.examName}`; 
      if (!studentsMap[key]) {
        studentsMap[key] = {
          key: row.id,
          rollnum: row.rollnum,
          admissionNo: row.admissionnum,
          studentName: `${row.firstname} ${row.lastname}`,
          class_id: row.class_id,
          section_id: row.section_id,
          class: row.class_name,
          section: row.section_name,
          father_name: row.father_name,
          date_of_birth: row.dob,
          address: row.perm_address,
          academic_year: row.academicyear,
          phone_num: row.phone_num,
          student_image: row.stu_img || "assets/img/students/default.jpg",
          examName: row.examName,
          subjects: {},
          totalMaxMarks: 0,
        };
      }

      const subjKey = `${row.subject_name} (${row.code})`;
      studentsMap[key].subjects[subjKey] = {
        id: row.id,
        mark_obtained: row.mark_obtained || 0,
        max_mark: row.max_mark || 0,
        grade_marks: row.grade,
      };
      //  else {
      //   studentsMap[key].subjects[subjKey] = {
      //     id: row.id,
      //     grade_marks: row.grade || "",
      //   };
      // }

      // Increment total max marks for this exam
      studentsMap[key].totalMaxMarks += row.max_mark || 0;
    });

    // Calculate total, percent, grade, and result per exam
    const students = Object.values(studentsMap).map((student) => {
      let totalObtained = 0;

      Object.values(student.subjects).forEach((subj) => {
        if (subj.mark_obtained) {
          totalObtained += subj.mark_obtained;
        }
        //  else if (subj.grade_marks) {
        //   totalObtained += calculateObtainedMarksForGrades(subj.grade_marks);
        // }
      });

      const percent =
        student.totalMaxMarks > 0
          ? Number(((totalObtained / student.totalMaxMarks) * 100).toFixed(2))
          : 0;

      let overallGrade = "F";

      if (percent >= 90) overallGrade = "A+";
      else if (percent >= 80) overallGrade = "A";
      else if (percent >= 70) overallGrade = "B+";
      else if (percent >= 60) overallGrade = "B";
      else if (percent >= 50) overallGrade = "C";
      else if (percent >= 33) overallGrade = "D";

      const overallResult = percent < 33 ? "Fail" : "Pass";

      return {
        ...student,
        total: totalObtained,
        totalMaxMarks: student.totalMaxMarks,
        percent,
        grade: overallGrade,
        result: overallResult,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Results fetched successfully!",
      data: students,
    });
  } catch (error) {
    console.error("❌ Error in getExamResultAllStudents:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};

exports.getExamResultUpdateList = async (req, res) => {
  try {
    const { className, section, examName } = req.body;
    console.log(className, section, examName);
    if (!className || !section || !examName) {
      return res.status(400).json({
        success: false,
        message: "className, section, and examName are required",
      });
    }

    const scheduleSql = `
      SELECT
        es.examName,
        es.minMarks,
        es.maxMarks,
        cs.id AS subject_id,
        cs.name AS subject_name,
        cs.code,
        s.admissionnum,
        s.rollnum,
        s.section_id,
        s.class_id,
        s.stu_img,
        cl.class_name as class,
        se.section_name as section,
        u.firstname,
        u.lastname
      FROM examSchedule es
      RIGHT JOIN students s ON es.className = s.class_id AND es.section = s.section_id
      JOIN classes cl ON cl.id = s.class_id
      JOIN sections se ON se.id = s.section_id
      LEFT JOIN class_subject cs ON es.subject = cs.id
      LEFT JOIN users u ON s.stu_id = u.id
      WHERE es.className = ? AND es.section = ? AND es.examName = ?
      ORDER BY s.rollnum, cs.name;
    `;

    const [scheduleRows] = await db.query(scheduleSql, [
      className,
      section,
      examName,
    ]);
    console.log("object: ", scheduleRows);
    if (!scheduleRows.length) {
      return res.status(200).json({
        success: false,
        message: "No student found for the selected class and section",
      });
    }

    const resultSql = `
      SELECT
        er.roll_num,
        er.exam_name_id,
        er.subject_id,
        er.mark_obtained,
        en.examName AS examNameStr
      FROM exam_result er
      LEFT JOIN examName en ON er.exam_name_id = en.id
      WHERE en.id = ?;
    `;

    const [resultRows] = await db.query(resultSql, [examName]);

    const resultMap = {};
    resultRows.forEach((res) => {
      const key = `${res.roll_num}_${res.subject_id}`;
      resultMap[key] = {
        mark_obtained: res.mark_obtained,
      };
    });

    const groupedData = {};

    scheduleRows.forEach((row) => {
      const key = row.admissionnum;

      if (!groupedData[key]) {
        groupedData[key] = {
          name: `${row.firstname} ${row.lastname}`,
          class: row.class,
          section: row.section,
          class_id: row.class_id,
          section_id: row.section_id,
          admissionNum: row.admissionnum,
          rollNum: row.rollnum,
          img:row.stu_img,
          subject: [],
          totalObtained: 0,
          totalMax: 0,
        };
      }

      if (row.subject_id !== null) {
        const resultKey = `${row.rollnum}_${row.subject_id}`;
        const result = resultMap[resultKey];

        const markObtained = result?.mark_obtained ?? null;

        if (markObtained !== null) {
          groupedData[key].totalObtained += markObtained;
          groupedData[key].totalMax += parseInt(row.maxMarks);
        }

        groupedData[key].subject.push({
          subject_id: row.subject_id,
          subject_name: row.subject_name,
          code: row.code,
          minMarks: row.minMarks,
          maxMarks: row.maxMarks,
          mark_obtained: markObtained,
        });
      }
    });

    // Finalize result with grade + overall result
    const finalResult = Object.values(groupedData).map((student) => {
      let percentage = 0;
      let grade = null;
      let resultStatus = null;

      if (student.totalMax > 0) {
        percentage = (student.totalObtained / student.totalMax) * 100;

        // Grade calculation
        if (percentage >= 90) grade = "A+";
        else if (percentage >= 80) grade = "A";
        else if (percentage >= 70) grade = "B+";
        else if (percentage >= 60) grade = "B";
        else if (percentage >= 50) grade = "C";
        else if (percentage >= 33) grade = "D";
        else grade = "F";

        resultStatus = percentage < 33 ? "Fail" : "Pass";
      }

      return {
        ...student,
        percentage: student.totalMax > 0 ? percentage.toFixed(2) : null,
        grade,
        result: resultStatus,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Student subject and exam results fetched successfully",
      data: finalResult,
    });
  } catch (error) {
    console.error("Error in getExamResultUpdateList:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getSpeExamResult = async (req, res) => {
  const { className, section, examName } = req.body;

  try {
    const sql = `
      SELECT 
        er.id,
        er.mark_obtained,
        er.max_mark,
        en.examName,
        cs.name AS subject_name,
        cs.code,
        s.admissionnum,
        s.rollnum,
        s.section,
        s.class,
        s.stu_img,
        p.name AS father_name,
        p.phone_num,
        u.firstname,
        u.lastname
      FROM exam_result er
      LEFT JOIN examName en ON er.exam_name_id = en.id
      LEFT JOIN class_subject cs ON er.subject_id = cs.id
      LEFT JOIN students s ON er.roll_num = s.rollnum
      LEFT JOIN parents_info p ON p.user_id = s.stu_id AND p.relation = "Father"
      LEFT JOIN users u ON s.stu_id = u.id
      WHERE LOWER(s.class) = LOWER(?)
      AND LOWER(s.section) = LOWER(?)
      AND er.exam_name_id = ?
      ORDER BY s.rollnum, en.examName, cs.name
    `;

    const [rows] = await db.query(sql, [className, section, examName]);

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "No results found!",
      });
    }

    const studentsMap = {};

    rows.forEach((row) => {
      const key = `${row.rollnum}_${row.examName}`;

      if (!studentsMap[key]) {
        studentsMap[key] = {
          key: row.id,
          rollnum: row.rollnum,
          admissionNo: row.admissionnum,
          studentName: `${row.firstname} ${row.lastname}`,
          class: row.class,
          section: row.section,
          img: row.stu_img || "assets/img/students/default.jpg",
          examName: row.examName,
          subjects: {},
          totalMaxMarks: 0,
        };
      }

      const subjKey = `${row.subject_name} (${row.code})`;
      studentsMap[key].subjects[subjKey] = {
        id: row.id,
        mark_obtained: row.mark_obtained || 0,
        max_mark: row.max_mark || 0,
      };

      studentsMap[key].totalMaxMarks += row.max_mark || 0;
    });

    const students = Object.values(studentsMap).map((student) => {
      let totalObtained = 0;

      Object.values(student.subjects).forEach((subj) => {
        totalObtained += subj.mark_obtained;
      });

      const percent =
        student.totalMaxMarks > 0
          ? Number(((totalObtained / student.totalMaxMarks) * 100).toFixed(2))
          : 0;

      let overallGrade = "F";
      if (percent >= 90) overallGrade = "O";
      else if (percent >= 80) overallGrade = "A+";
      else if (percent >= 70) overallGrade = "A";
      else if (percent >= 60) overallGrade = "B+";
      else if (percent >= 50) overallGrade = "B";
      else if (percent >= 40) overallGrade = "C";

      const overallResult = percent < 33 ? "Fail" : "Pass";

      return {
        ...student,
        total: totalObtained,
        totalMaxMarks: student.totalMaxMarks,
        percent,
        grade: overallGrade,
        result: overallResult,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Results fetched successfully!",
      data: students,
    });
  } catch (error) {
    console.error("❌ Error in getExamResultAllStudents:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};

exports.speMarkForEdit = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Id not provided", success: false });
  }

  try {
    const [rows] = await db.query(
      `SELECT max_mark, mark_obtained FROM exam_result WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Data not found!", success: false });
    }

    // Return the fetched data
    return res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error("❌ Error in markEdit:", error);
    return res
      .status(500)
      .json({ message: "Internal server error!", success: false });
  }
};

exports.editMark = async (req, res) => {
  const { id } = req.params;
  const { mark_obtained } = req.body;

  if (!id || mark_obtained === undefined) {
    return res.status(400).json({
      message: "Id and mark_obtained are required",
      success: false,
    });
  }

  try {
    await db.query(`UPDATE exam_result SET mark_obtained = ? WHERE id = ?`, [
      mark_obtained,
      id,
    ]);

    return res.status(200).json({
      message: "Mark updated successfully",
      success: true,
    });
  } catch (error) {
    console.error("❌ Error in editMark:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

exports.getClassSectionToppers = async (req, res) => {
  try {
    const sql = `
      SELECT 
        er.id,
        er.mark_obtained,
        er.max_mark,
        en.examName,
        s.rollnum,
        s.admissionnum,
        s.section_id,
        s.class_id,
        s.stu_img,
        cl.class_name,
        se.section_name,
        u.firstname,
        u.lastname
      FROM exam_result er
      LEFT JOIN examName en ON er.exam_name_id = en.id
      LEFT JOIN students s ON er.roll_num = s.rollnum
      JOIN classes cl ON cl.id = s.class_id
      JOIN sections se ON se.id = s.section_id
      LEFT JOIN users u ON s.stu_id = u.id
      WHERE en.examName IN ('Semester1', 'Semester2')
      ORDER BY s.class_id, s.section_id, s.rollnum, en.examName
    `;

    const [rows] = await db.query(sql);

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "No semester results found!"
      });
    }

    // Step 1: Structure data by class, section, student, and semester
    const dataMap = {};

    rows.forEach(row => {
      const { class_id, section_id, rollnum, examName } = row;
      const semester = examName.trim();

      if (!dataMap[class_id]) dataMap[class_id] = {};
      if (!dataMap[class_id][section_id]) dataMap[class_id][section_id] = {};
      if (!dataMap[class_id][section_id][rollnum])
        dataMap[class_id][section_id][rollnum] = {
          studentName: `${row.firstname} ${row.lastname}`,
          class_id,
          class_name: row.class_name,
          section_id,
          section_name: row.section_name,
          rollnum,
          admissionnum: row.admissionnum,
          semesters: {},
          img:row.stu_img,
        };

      const student = dataMap[class_id][section_id][rollnum];

      if (!student.semesters[semester])
        student.semesters[semester] = { totalObtained: 0, totalMax: 0 };

      student.semesters[semester].totalObtained += row.mark_obtained || 0;
      student.semesters[semester].totalMax += row.max_mark || 0;
    });

    //Step 2: Calculate percentage and combine semester totals
    const toppers = [];

    for (const classId in dataMap) {
      for (const sectionId in dataMap[classId]) {
        const students = Object.values(dataMap[classId][sectionId]).map(stu => {
          const sem1 = stu.semesters["Semester1"] || { totalObtained: 0, totalMax: 0 };
          const sem2 = stu.semesters["Semester2"] || { totalObtained: 0, totalMax: 0 };

          const sem1Percent = sem1.totalMax ? (sem1.totalObtained / sem1.totalMax) * 100 : 0;
          const sem2Percent = sem2.totalMax ? (sem2.totalObtained / sem2.totalMax) * 100 : 0;

          let combinedTotal = 0;
          let combinedMax = 0;

          // If both semesters exist → combine; else take existing one
          if (sem1.totalMax > 0 && sem2.totalMax > 0) {
            combinedTotal = sem1.totalObtained + sem2.totalObtained;
            combinedMax = sem1.totalMax + sem2.totalMax;
          } else if (sem1.totalMax > 0) {
            combinedTotal = sem1.totalObtained;
            combinedMax = sem1.totalMax;
          } else if (sem2.totalMax > 0) {
            combinedTotal = sem2.totalObtained;
            combinedMax = sem2.totalMax;
          }

          const overallPercent = combinedMax ? (combinedTotal / combinedMax) * 100 : 0;

          return {
            ...stu,
            semester1: { ...sem1, percent: Number(sem1Percent.toFixed(2)) },
            semester2: { ...sem2, percent: Number(sem2Percent.toFixed(2)) },
            combined: {
              totalObtained: combinedTotal,
              totalMax: combinedMax,
              percent: Number(overallPercent.toFixed(2)),
            },
          };
        });

        // Step 3: Find topper in this class-section
        const topper = students.sort(
          (a, b) => b.combined.percent - a.combined.percent
        )[0];

        if (topper) {
          toppers.push({
            class_id: topper.class_id,
            class_name: topper.class_name,
            section_id: topper.section_id,
            section_name: topper.section_name,
            rollnum: topper.rollnum,
            studentName: topper.studentName,
            admissionnum: topper.admissionnum,
            semester1: topper.semester1,
            semester2: topper.semester2,
            overall: topper.combined,
            image:topper.img,
            rank: 1,
          });
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: "Class-section toppers fetched successfully!",
      data: toppers,
    });

  } catch (error) {
    console.error("Error in getClassSectionToppers:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};

exports.getPerformanceCategoryCountPerClass = async (req, res) => {
  try {
    const sql = `
      SELECT 
        s.class_id,
        s.section_id,
        cl.class_name,
        se.section_name,
        en.examName,
        s.rollnum,
        s.admissionnum,
        u.firstname,
        u.lastname,
        er.mark_obtained,
        er.max_mark
      FROM exam_result er
      LEFT JOIN examName en ON er.exam_name_id = en.id
      LEFT JOIN students s ON er.roll_num = s.rollnum
      JOIN classes cl ON cl.id = s.class_id
      JOIN sections se ON se.id = s.section_id
      LEFT JOIN users u ON s.stu_id = u.id
      WHERE en.examName IN ('Semester1', 'Semester2')
      ORDER BY s.class_id, s.section_id, s.rollnum, en.examName
    `;

    const [rows] = await db.query(sql);

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "No results found!"
      });
    }

    const classMap = {};

    rows.forEach(row => {
      const { class_id, section_id, rollnum } = row;

      if (!classMap[class_id]) {
        classMap[class_id] = {
          class_id,
          class_name: row.class_name,
          sections: {},
        };
      }

      if (!classMap[class_id].sections[section_id]) {
        classMap[class_id].sections[section_id] = {
          section_id,
          section_name: row.section_name,
          students: {},
        };
      }

      const studentKey = rollnum;

      if (!classMap[class_id].sections[section_id].students[studentKey]) {
        classMap[class_id].sections[section_id].students[studentKey] = {
          rollnum,
          studentName: `${row.firstname} ${row.lastname}`,
          totalObtained: 0,
          totalMax: 0,
        };
      }

      const stu = classMap[class_id].sections[section_id].students[studentKey];
      stu.totalObtained += row.mark_obtained || 0;
      stu.totalMax += row.max_mark || 0;
    });

    const classPerformance = [];

    Object.values(classMap).forEach(cls => {
      let top = 0, average = 0, below = 0;

      Object.values(cls.sections).forEach(sec => {
        Object.values(sec.students).forEach(stu => {
          const percent = stu.totalMax ? (stu.totalObtained / stu.totalMax) * 100 : 0;

          if (percent >= 75) top++;
          else if (percent >= 40) average++;
          else below++;
        });
      });

      classPerformance.push({
        class_id: cls.class_id,
        class_name: cls.class_name,
        top,
        average,
        below_avg: below,
      });
    });

    return res.status(200).json({
      success: true,
      message: "Performance categories fetched successfully!",
      data: classPerformance,
    });

  } catch (error) {
    console.error("Error in getPerformanceCategoryCountPerClass:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};

exports.getTopThreeRankers = async (req, res) => {
  try {
    const { class_id, section_id } = req.params;

    if (!class_id || !section_id) {
      return res.status(400).json({
        success: false,
        message: "class_id and section_id are required parameters!",
      });
    }

    const sql = `
      SELECT 
        er.id,
        er.mark_obtained,
        er.max_mark,
        en.examName,
        s.rollnum,
        s.admissionnum,
        s.section_id,
        s.class_id,
        s.stu_img,
        cl.class_name,
        se.section_name,
        u.firstname,
        u.lastname
      FROM exam_result er
      LEFT JOIN examName en ON er.exam_name_id = en.id
      LEFT JOIN students s ON er.roll_num = s.rollnum
      JOIN classes cl ON cl.id = s.class_id
      JOIN sections se ON se.id = s.section_id
      LEFT JOIN users u ON s.stu_id = u.id
      WHERE en.examName IN ('Semester1', 'Semester2')
        AND s.class_id = ?
        AND s.section_id = ?
      ORDER BY s.rollnum, en.examName
    `;

    const [rows] = await db.query(sql, [class_id, section_id]);

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "No results found for this class and section!",
      });
    }

    const studentMap = {};

    rows.forEach(row => {
      const { rollnum, examName } = row;
      const semester = examName.trim();

      if (!studentMap[rollnum]) {
        studentMap[rollnum] = {
          studentName: `${row.firstname} ${row.lastname}`,
          class_id: row.class_id,
          class_name: row.class_name,
          section_id: row.section_id,
          section_name: row.section_name,
          rollnum: row.rollnum,
          admissionnum: row.admissionnum,
          img: row.stu_img,
          semesters: {},
        };
      }

      const student = studentMap[rollnum];

      if (!student.semesters[semester])
        student.semesters[semester] = { totalObtained: 0, totalMax: 0 };

      student.semesters[semester].totalObtained += row.mark_obtained || 0;
      student.semesters[semester].totalMax += row.max_mark || 0;
    });

    const students = Object.values(studentMap).map(stu => {
      const sem1 = stu.semesters["Semester1"] || { totalObtained: 0, totalMax: 0 };
      const sem2 = stu.semesters["Semester2"] || { totalObtained: 0, totalMax: 0 };

      const sem1Percent = sem1.totalMax ? (sem1.totalObtained / sem1.totalMax) * 100 : 0;
      const sem2Percent = sem2.totalMax ? (sem2.totalObtained / sem2.totalMax) * 100 : 0;

      const combinedTotal = sem1.totalObtained + sem2.totalObtained;
      const combinedMax = sem1.totalMax + sem2.totalMax;
      const combinedPercent = combinedMax ? (combinedTotal / combinedMax) * 100 : 0;

      return {
        ...stu,
        semester1: { ...sem1, percent: Number(sem1Percent.toFixed(2)) },
        semester2: { ...sem2, percent: Number(sem2Percent.toFixed(2)) },
        overall: {
          totalObtained: combinedTotal,
          totalMax: combinedMax,
          percent: Number(combinedPercent.toFixed(2)),
        },
      };
    });

    const sortedStudents = students.sort(
      (a, b) => b.overall.percent - a.overall.percent
    );

    const top3 = sortedStudents.slice(0, 3).map((stu, index) => ({
      class_id: stu.class_id,
      class_name: stu.class_name,
      section_id: stu.section_id,
      section_name: stu.section_name,
      rollnum: stu.rollnum,
      studentName: stu.studentName,
      admissionnum: stu.admissionnum,
      semester1: stu.semester1,
      semester2: stu.semester2,
      overall: stu.overall,
      image: stu.img,
      rank: index + 1,
    }));

    if (!top3.length) {
      return res.status(404).json({
        success: false,
        message: "No results found for this class and section!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Top 3 rankers fetched successfully!",
      data: top3,
    });

  } catch (error) {
    console.error("Error in getTopThreeRankers:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};


exports.getExamResultSpeStudentsbyUserId = async (req, res) => {
  const userId = req.params?.userId;
  
  if(!userId){
    return res.status(404).json({
    success: false,
    message:"user not found."
  });
  }

  const [userRows] = await db.query(
    `SELECT
        users.id,
        s.class_id,
        s.section_id,
        s.rollnum
    FROM users
    LEFT JOIN students as s ON s.stu_id = users.id
    WHERE users.id = ?`,
    [userId]
  );
  if (!userRows || userRows.length === 0) {
    return res.status(404).json({ message: "Student not found" });
  }
  const student = userRows[0];
  const rollnum = student.rollnum;

  try {
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
        s.section_id,
        s.class_id,
        s.stu_img,
        s.perm_address,
        s.dob,
        s.academicyear,
        cl.class_name,
        se.section_name,
        s.admissionnum,
        p.name,
        p.phone_num,
        u.firstname,
        u.lastname
      FROM exam_result er
      LEFT JOIN examName en ON er.exam_name_id = en.id
      LEFT JOIN class_subject cs ON er.subject_id = cs.id
      LEFT JOIN students s ON er.roll_num = s.rollnum
      JOIN classes cl ON cl.id = s.class_id
      JOIN sections se ON se.id = s.section_id
      LEFT JOIN parents_info p ON p.user_id = s.stu_id AND relation="Father"
      LEFT JOIN users u ON s.stu_id = u.id
      WHERE er.roll_num = ?
      ORDER BY en.examName, cs.name
    `;

    const [rows] = await db.query(sql, [rollnum]);

    if (!rows.length) {
      return res
        .status(404)
        .json({ success: false, message: "No results found!" });
    }

    // Group data by student
    const studentsMap = {};

    rows.forEach((row) => {
      const studentKey = row.rollnum;

      if (!studentsMap[studentKey]) {
        studentsMap[studentKey] = {
          rollnum: row.rollnum,
          firstname: row.firstname,
          lastname: row.lastname,
          class: row.class_name,
          section: row.section_name,
          fat_name: row.name,
          phone_num: row.phone_num,
          student_image: row.stu_img,
          stud_admNo: row.admissionnum,
          stud_dob: row.dob,
          stud_address: row.perm_address,
          stud_academicYear: row.academicyear,
          exams: {},
        };
      }

      const student = studentsMap[studentKey];

      if (!student.exams[row.examName]) {
        student.exams[row.examName] = {
          exam_name: row.examName,
          subjects: [],
        };
      }

      student.exams[row.examName].subjects.push({
        subject_name: `${row.subject_name}(${row.code})`,
        max_mark: row.max_mark,
        min_mark: row.min_mark,
        mark_obtained: row.mark_obtained,
        grade: row.grade,
        result: row.result,
      });
    });

    // Convert exams object to array for each student
    const students = Object.values(studentsMap).map((student) => ({
      ...student,
      exams: Object.values(student.exams),
    }));

    return res.status(200).json({
      success: true,
      message: "Results fetched successfully!",
      data: students,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error!", success: false });
  }
};

exports.examNameForStudentResultsbyUserId = async (req, res) => {
  const userId = req.params?.userId;
  
  if(!userId){
    return res.status(404).json({
    success: false,
    message:"user not found."
  });
  }

  const [userRows] = await db.query(
    `SELECT
        users.id,
        s.class_id,
        s.section_id,
        s.rollnum
    FROM users
    LEFT JOIN students as s ON s.stu_id = users.id
    WHERE users.id = ?`,
    [userId]
  );
  if (!userRows || userRows.length === 0) {
    return res.status(404).json({ message: "Student not found" });
  }
  const student = userRows[0];
  const rollnum = student.rollnum;

  try {
    const sql = `
    SELECT er.exam_name_id, er.roll_num, en.examName
    FROM exam_result er
    JOIN examName en ON er.exam_name_id = en.id
    WHERE er.roll_num = ?
    GROUP BY er.exam_name_id, er.roll_num;
    `;
    const [rows] = await db.query(sql, [rollnum]);
    if (!rows.length) {
      return res
        .status(404)
        .json({ success: false, message: "No results found!" });
    }
    return res.status(200).json({
      success: true,
      message: "Exam Name fetched successfully!",
      data: rows,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error!", success: false });
  }
};