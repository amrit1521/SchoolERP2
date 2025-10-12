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
  if (grade === "B") return 90;
  if (grade === "C") return 90;
  if (grade === "D") return 90;
  if (grade === "E") return 90;
  if (grade === "F") return 90;
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
        s.section,
        s.class,
        p.name,
        p.phone_num,
        u.firstname,
        u.lastname
      FROM exam_result er
      LEFT JOIN examName en ON er.exam_name_id = en.id
      LEFT JOIN class_subject cs ON er.subject_id = cs.id
      LEFT JOIN students s ON er.roll_num = s.rollnum
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
          class: row.class,
          section: row.section,
          fat_name: row.name,
          phone_num: row.phone_num,
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
      return {
        ...student,
        total: totalObtained,
        totalMaxMarks: student.totalMaxMarks, // <-- send this in response
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
        s.section,
        s.class,
        u.firstname,
        u.lastname
      FROM examSchedule es
      RIGHT JOIN students s ON es.className = s.class AND es.section = s.section
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
    if (!scheduleRows.length) {
      return res.status(404).json({
        success: false,
        message: "No data found for the given parameters",
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
          admissionNum: row.admissionnum,
          rollNum: row.rollnum,
          subject: [],
          totalObtained: 0,
          totalMax: 0,
        };
      }

      if (row.subject_id !== null) {
        const resultKey = `${row.rollnum}_${row.subject_id}`;
        const result = resultMap[resultKey];

        const markObtained = result?.mark_obtained ?? null;

        // If marks are added, add to totals
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
