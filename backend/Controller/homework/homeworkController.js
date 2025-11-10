const db = require("../../config/db");

exports.addHomework = async (req, res) => {
  try {
    const {
      className,
      section,
      subject,
      homeworkDate,
      submissionDate,
      attachments,
      description,
      status,
      teacherId,
    } = req.body;

    if (
      !className ||
      !section ||
      !subject ||
      !homeworkDate ||
      !submissionDate ||
      !description
    ) {
      return res.status(400).json({
        message: "All required fields must be provided",
        success: false,
      });
    }

    const sql = `
      INSERT INTO home_work 
      (class_id, section_id, subject, homeworkDate, submissionDate, attachements, description, status, teacherId, created_at, updated_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;

    const values = [
      className,
      section,
      subject,
      homeworkDate,
      submissionDate,
      attachments || null,
      description,
      status || "1",
      teacherId,
    ];

    const [result] = await db.query(sql, values);

    return res.status(201).json({
      message: `Homework added successfully !`,
      homeworkId: result.insertId,
      success: true,
    });
  } catch (error) {
    console.error("Error adding homework:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

exports.allHomework = async (req, res) => {
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
      ORDER BY hw.created_at DESC
    `;
    const [rows] = await db.query(sql);
    return res.status(200).json({
      message: "Fetched all homework successfully!",
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

exports.getHomeworkById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).json({ message: "Home work id is required !" });
    }

    const sql = `
      SELECT id ,class_id AS className , section_id AS section ,subject , homeWorkDate , submissionDate , teacherId , status , attachements , description
        FROM
      home_work
      WHERE id = ?
    `;

    const [rows] = await db.query(sql, [id]);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Homework not found", success: false });
    }

    return res.status(200).json({
      message: "Homework fetched successfully",
      success: true,
      data: rows[0],
    });
  } catch (error) {
    console.error("Error fetching homework by ID:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

exports.updateHomework = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      className,
      section,
      subject,
      homeworkDate,
      submissionDate,
      attachments,
      description,
      status,
      teacherId,
    } = req.body;

    const sql = `
      UPDATE home_work 
      SET class_id = ?, section_id = ?, subject = ?, homeworkDate = ?, submissionDate = ?, attachements = ?, 
          description = ?, status = ?, teacherId = ?, updated_at = NOW()
      WHERE id = ?
    `;

    const values = [
      className,
      section,
      subject,
      homeworkDate,
      submissionDate,
      attachments || null,
      description,
      status || "1",
      teacherId,
      id,
    ];

    const [result] = await db.query(sql, values);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Homework not found", success: false });
    }

    return res
      .status(200)
      .json({ message: "Homework updated successfully", success: true });
  } catch (error) {
    console.error("Error updating homework:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

exports.deleteHomework = async (req, res) => {
  try {
    const { id } = req.params;

    const sql = `DELETE FROM home_work WHERE id = ?`;
    const [result] = await db.query(sql, [id]);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Homework not found", success: false });
    }

    return res
      .status(200)
      .json({ message: "Homework deleted successfully", success: true });
  } catch (error) {
    console.error("Error deleting homework:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

exports.getAllStudentHomeWork = async (req, res) => {
  const { userId } = req.params;
  try {
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
    const studentClass = student.class_id;
    const section = student.section_id;

    const [home_work] = await db.query(
      `SELECT hw.id,c.class_name AS className,
        s.section_name AS section,
        hw.subject AS subject_id,
        t.img_src,
        hw.status,
        hw.teacherId,
        hw.homeworkDate,
        hw.submissionDate,
        hw.attachements,
        hw.description,
        t.user_id,
        cs.name as subject,
        u.firstname,u.lastname 
        FROM home_work as hw
        LEFT JOIN classes AS c ON c.id = hw.class_id
        LEFT JOIN sections AS s ON s.id = hw.section_id
        LEFT JOIN class_subject AS cs On cs.id = hw.subject
        LEFT JOIN users AS u ON u.id = hw.teacherId
        LEFT JOIN teachers t ON hw.teacherId = t.user_id
        WHERE hw.class_id = ? AND hw.section_id = ?`,
      [studentClass, section]
    );
    console.log(home_work);
    return res.status(200).json({
      message: "Fetched all homework successfully!",
      success: true,
      data: home_work,
    });
  } catch (error) {
    console.error("Error fetching student homework:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

exports.getAllTeacherHomeWork = async (req, res) => {
  try {
    const { userId } = req.params;
    const [userRows] = await db.query(
      `SELECT
          users.id,
          t.class,
          t.section,
          t.teacher_id
      FROM users
      LEFT JOIN teachers as t ON t.user_id = users.id
      WHERE users.id = ?`,
      [userId]
    );
    if (!userRows || userRows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }
    const teacher = userRows[0];
    const studentClass = teacher.class;
    const section = teacher.section;

    const [home_work] = await db.query(
      `SELECT hw.id,c.class_name AS className,
        s.section_name AS section,
        hw.subject AS subject_id,
        t.img_src,
        hw.status,
        hw.teacherId,
        hw.homeworkDate,
        hw.submissionDate,
        hw.attachements,
        hw.description,
        t.user_id,
        cs.name as subject,
        u.firstname,u.lastname 
        FROM home_work as hw
        LEFT JOIN classes AS c ON c.id = hw.class_id
        LEFT JOIN sections AS s ON s.id = hw.section_id
        LEFT JOIN class_subject AS cs On cs.id = hw.subject
        LEFT JOIN users AS u ON u.id = hw.teacherId
        LEFT JOIN teachers t ON hw.teacherId = t.user_id
        WHERE hw.class_id = ? AND hw.section_id = ?`,
      [studentClass, section]
    );
    console.log(home_work);
    return res.status(200).json({
      message: "Fetched all homework successfully!",
      success: true,
      data: home_work,
    });
  } catch (error) {
    console.error("Error fetching student homework:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

// export const assingments = async (req, res) => {
//   try {

// const [userRows] = await db.query(
//   `SELECT
//       users.id,
//       s.class_id,
//       s.section_id
//    FROM users
//    LEFT JOIN students as s ON s.stu_id = users.id
//    WHERE users.id = ?`,
//   [req.user.id]
// );

//     if (!userRows || userRows.length === 0) {
//       return res.status(404).json({ message: "Student not found" });
//     }

//     const student = userRows[0];

//     const studentClass = student.class_id;
//     const section = student.section_id;

//     const [home_work] = await db.query(
//       `SELECT hw.id,c.class_name,s.section_name,hw.subject,hw.teacherId,hw.homeworkDate,hw.submissionDate,hw.attachements,hw.description,cs.name as subject,u.firstname,u.lastname FROM home_work as hw
//         LEFT JOIN classes AS c ON c.id = hw.class_id
//        LEFT JOIN sections AS s ON s.id = hw.section_id
//        LEFT JOIN class_subject AS cs On cs.id = hw.subject
//           LEFT JOIN users AS u ON u.id = hw.teacherId
//        WHERE hw.class_id = ? AND hw.section_id = ?`,
//       [studentClass, section]
//     );
// // console.log(home_work);
//     return res.json({
//       success: true,
//       data: home_work,
//     });
//   } catch (error) {
//     console.error("Error fetching timetable:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch timetable",
//       error: error.message,
//     });
//   }
// };
