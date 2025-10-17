import db from "../config/db.js";

export const profile = async (req, res) => {
const [rows] = await db.query(
  `SELECT u.firstname,u.lastname,u.mobile,u.email,u.status, u.remark,r.role_name,u.id
   FROM users as u
   LEFT JOIN roles as r ON r.id = u.roll_id
   WHERE u.id = ?`,
  [req.user.id]
);

const [students] = await db.query(
  `SELECT p.occuption,p.relation,p.relation_det,p.img_src,p.parent_id,c.class_name as class,se.section_name as section,s.*,us.firstname,us.lastname,se.room_no
   FROM users as u
   LEFT JOIN parents_info as p ON p.parent_id = u.id
   LEFT JOIN students as s ON s.stu_id = p.user_id
   LEFT JOIN users as us ON us.id = s.stu_id
   LEFT JOIN classes AS c ON c.id = s.class_id
   LEFT JOIN sections AS se ON se.id = s.section_id
   WHERE u.id = ?`,
  [req.user.id]
);

//    LEFT JOIN students as s ON s.stu_id = p.user_id
//    LEFT JOIN users as u ON u.id = s.stu_id
//    LEFT JOIN classes AS c ON c.id = s.class_id
//    LEFT JOIN sections AS se ON se.id = s.section_id

console.log(students);
console.log('rows');
// console.log(rows);
 res.json({
      success: true,
      profile: rows[0],
      students: students,
    });
};

export const attendance = async (req, res) => {
   
const [userRows] = await db.query(
  `SELECT 
      users.id, s.rollnum
   FROM users
   LEFT JOIN students as s ON s.stu_id = users.id
   WHERE users.id = ?`,
  [req.user.id]
);

console.log(userRows)
let rollnum=userRows[0].rollnum;
console.log(rollnum);
  const [rows] = await db.query(`SELECT attendance as status,student_rollnum,class,section,notes, DATE_FORMAT(attendance_date_info, '%b %d') AS date,attendance_info.id FROM attendance_info WHERE attendance_info.student_rollnum=?`, [rollnum]);
   const [monthly] = await db.query(`
      SELECT 
        DATE_FORMAT(attendance_date_info, '%b') AS month,
        ROUND(
          (SUM(CASE WHEN attendance = 'Present' THEN 1 ELSE 0 END) / COUNT(*)) * 100
        ) AS percent
      FROM attendance_info
        WHERE 
    student_rollnum = ? 
      GROUP BY MONTH(attendance_date_info)
      ORDER BY MONTH(attendance_date_info)
    `,[rollnum]);

const [currentMonth] = await db.query(`
  SELECT 
    DATE_FORMAT(attendance_date_info, '%b') AS month,
    SUM(CASE WHEN attendance = 'Present' THEN 1 ELSE 0 END) AS present,
    SUM(CASE WHEN attendance = 'Absent' THEN 1 ELSE 0 END) AS absent,
    SUM(CASE WHEN attendance = 'Late' THEN 1 ELSE 0 END) AS late,
    COUNT(*) AS total,
    ROUND(
      (SUM(CASE WHEN attendance = 'Present' THEN 1 ELSE 0 END) / COUNT(*)) * 100
    ) AS percent
  FROM attendance_info
  WHERE 
    student_rollnum = ? 
    AND MONTH(attendance_date_info) = MONTH(CURRENT_DATE())
    AND YEAR(attendance_date_info) = YEAR(CURRENT_DATE())
  GROUP BY MONTH(attendance_date_info)
`, [rollnum]);


 res.json({
      success: true,
      attendance: rows,
      monthlySummary: monthly,
      currentMonth:currentMonth[0]
    });

};

export const timetable = async (req, res) => { 
  try {


const [userRows] = await db.query(
  `SELECT u.firstname, u.lastname, u.mobile, u.email, u.status, u.remark, r.role_name, u.id
   FROM users AS u
   JOIN roles AS r ON r.id = u.roll_id
   WHERE u.id = ?`,
  [req.user.id]
);

const parentUser = userRows[0];

const [parentLinks] = await db.query(
  `SELECT user_id FROM parents_info WHERE parent_id = ?`,
  [parentUser.id]
);


const studentsData = [];

for (const link of parentLinks) {

  const [studentRows] = await db.query(
    `SELECT s.stu_id, s.class_id, s.section_id, s.rollnum, u.firstname, u.lastname, u.email, u.mobile
     FROM students AS s
     JOIN users AS u ON u.id = s.stu_id
     WHERE s.stu_id  = ?`,
    [link.user_id]
  );

  const student = studentRows[0];
  if (!student) continue;


  const [timetableRows] = await db.query(
    `SELECT * FROM timetable LEFT JOIN WHERE class = ? AND section = ?`,
    [student.class_id, student.section_id]
  );

  student.timetable = timetableRows;


  studentsData.push(student);
}

res.json({
  parent: parentUser,
  children: studentsData
});

  } catch (error) {
    console.error("Error fetching timetable:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch timetable",
      error: error.message,
    });
  }
};


export const assingments = async (req, res) => {
  try {
 
const [userRows] = await db.query(
  `SELECT 
      users.id, 
      s.class_id, 
      s.section_id
   FROM users
   LEFT JOIN students as s ON s.stu_id = users.id
   WHERE users.id = ?`,
  [req.user.id]
);

    if (!userRows || userRows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    const student = userRows[0];
 
    const studentClass = student.class_id;   
    const section = student.section_id;

 
    const [home_work] = await db.query(
      `SELECT hw.id,c.class_name,s.section_name,hw.subject,hw.teacherId,hw.homeworkDate,hw.submissionDate,hw.attachements,hw.description,cs.name as subject FROM home_work as hw
        LEFT JOIN classes AS c ON c.id = hw.class_id
       LEFT JOIN sections AS s ON s.id = hw.section_id
       LEFT JOIN class_subject AS cs On cs.id = hw.subject
       WHERE hw.class_id = ? AND hw.section_id = ?`,
      [studentClass, section]
    );
// console.log(home_work);
    return res.json({
      success: true,
      data: home_work,
    });
  } catch (error) {
    console.error("Error fetching timetable:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch timetable",
      error: error.message,
    });
  }
};

export const notifications = async (req, res) => {
  const [rows] = await db.query("SELECT * FROM notifications");
  res.json(rows);
};
export const FreesPayment = async (req, res) => {
  const [rows] = await db.query("SELECT * FROM notifications");
  res.json(rows);
};



 