
const db = require('../../config/db')
const bcrypt = require('bcryptjs');
const transporter = require('../../utils/sendEmail')
const dayjs = require('dayjs')


function generateRandomPassword(length = 12) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$!&";
  return Array.from({ length }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join("");
}

function safeJSON(value) {
  if (Array.isArray(value)) return JSON.stringify(value);
  return value || null;
}

exports.addStudent = async (req, res) => {
  const data = req.body;
  let connection;

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();


    const [existingUser] = await connection.query(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [data.email]
    );
    if (existingUser.length > 0) {
      await connection.rollback();
      return res.status(400).json({ success: false, message: "Email already exists" });
    }


    const genPassword = generateRandomPassword();
    const hashPassword = await bcrypt.hash(genPassword, 10);

    const [userRes] = await connection.query(
      `INSERT INTO users (firstname, lastname, mobile, email, password, type_id, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [data.firstname, data.lastname, data.primarycont, data.email, hashPassword, 3, data.status]
    );
    const userId = userRes.insertId;


    await connection.query(
      `INSERT INTO students (
        stu_id, academicyear, admissionnum, admissiondate, rollnum, class, section,
        gender, dob, bloodgp, house, religion, category, caste, motherton, lanknown,
        stu_img, curr_address, perm_address, prev_school, prev_school_address,
        medicalcert, transfercert, stu_condition, allergies, medications
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        data.academicyear,
        data.admissionnum,
        dayjs(data.admissiondate).format('YYYY-MM-DD'),
        data.rollnum,
        data.class,
        data.section,
        data.gender,
        dayjs(data.dob).format('YYYY-MM-DD'),
        data.bloodgp,
        data.house,
        data.religion,
        data.category,
        data.caste,
        data.motherton,
        safeJSON(data.lanknown),
        data.stuimg,
        data.curr_address,
        data.perm_address,
        data.prev_school,
        data.prev_school_address,
        data.medicalcert || null,
        data.transfercert || null,
        data.condition,
        safeJSON(data.allergies),
        safeJSON(data.medications),
      ]
    );


    const imageFiles = [data.stuimg, data.fatimg, data.motimg, data.guaimg, data.medicalcert, data.transfercert];
    await Promise.all(
      imageFiles.filter(Boolean).map(file =>
        connection.query("UPDATE files SET status=1 WHERE filename=?", [file])
      )
    );


    const parentsData = [
      { relation: "Father", name: data.fat_name, email: data.fat_email, phone_num: data.fat_phone, occuption: data.fat_occu, img_src: data.fatimg },
      { relation: "Mother", name: data.mot_name, email: data.mot_email, phone_num: data.mot_phone, occuption: data.mot_occu, img_src: data.motimg },
      { relation: "Guardian", name: data.gua_name, email: data.gua_email, phone_num: data.gua_phone, occuption: data.gua_occu, relation_det: data.gua_relation || "", address: data.gua_address || "", img_src: data.guaimg, guardian_Is: data.guardianIs || "" }
    ];

    await Promise.all(
      parentsData.filter(p => p.name).map(parent =>
        connection.query(
          `INSERT INTO parents_info (
            user_id, name, email, phone_num, occuption, relation, relation_det, address, img_src, guardian_Is
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            userId,
            parent.name,
            parent.email || null,
            parent.phone_num || null,
            parent.occuption || null,
            parent.relation,
            parent.relation_det || "",
            parent.address || "",
            parent.img_src || null,
            parent.guardian_Is || "",
          ]
        )
      )
    );


    await Promise.all([
      (data.hostel || data.room_num) &&
      connection.query(
        `INSERT INTO hostel_info (user_id, hostel, room_num) VALUES (?, ?, ?)`,
        [userId, data.hostel || null, data.room_num || null]
      ),
      (data.route || data.vehicle_num || data.picup_point) &&
      connection.query(
        `INSERT INTO transport_info (user_id, route, vehicle_num, pickup_point) VALUES (?, ?, ?, ?)`,
        [userId, data.route || null, data.vehicle_num || null, data.picup_point || null]
      ),
      (data.bank_name || data.ifsc_num || data.other_det) &&
      connection.query(
        `INSERT INTO other_info (user_id, bank_name, branch, ifsc_num, other_det) VALUES (?, ?, ?, ?, ?)`,
        [userId, data.bank_name || null, data.branch || null, data.ifsc_num || null, data.other_det || null]
      )
    ]);


    await connection.commit();


    transporter.sendMail({
      from: process.env.SMTP_USER,
      to: data.email,
      subject: "Your student account has been created",
      text: `Hello ${data.firstname},\n\nYour student account has been created.\nEmail: ${data.email}\nPassword: ${genPassword}`
    }).catch(err => console.error("Email error:", err));

    return res.status(201).json({
      success: true,
      message: "Student added successfully",
      generatedPassword: genPassword
    });

  } catch (error) {
    if (connection) {
      try { await connection.rollback(); }
      catch (rollbackErr) { console.error("Rollback failed:", rollbackErr); }
    }
    console.error("Add student error:", error);
    return res.status(500).json({ success: false, message: "Internal server error!" });
  } finally {
    if (connection) connection.release();
  }
};




exports.allStudents = async (req, res) => {
  try {
    const sql = `
            SELECT 
                u.id AS user_id,
                u.firstname,
                u.lastname,
                u.mobile,
                u.email,
                u.type_id,
                u.status,
                s.id AS student_id,
                s.stu_id,
                s.academicyear,
                s.admissionnum,
                s.admissiondate,
                s.rollnum,
                s.class,
                s.section,
                s.gender,
                s.dob,
                s.bloodgp,
                s.house,
                s.religion,
                s.category,
                s.caste,
                s.motherton,
                s.lanknown,
                s.stu_img
            FROM users u
            RIGHT JOIN students s
                ON u.id = s.stu_id
                WHERE u.type_id=3
        `;

    const [students] = await db.query(sql);

    res.status(200).json({
      message: "Students fetched successfully",
      success: true,
      students
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error!', success: false });
  }
};


exports.filterStudents = async (req, res) => {

  const data = req.body;
  try {
    const sql = `
            SELECT 
                u.id AS user_id,
                u.firstname,
                u.lastname,
                u.mobile,
                u.email,
                u.type_id,
                u.status,
                s.id AS student_id,
                s.stu_id,
                s.academicyear,
                s.admissionnum,
                s.admissiondate,
                s.rollnum,
                s.class,
                s.section,
                s.gender,
                s.dob,
                s.bloodgp,
                s.house,
                s.religion,
                s.category,
                s.caste,
                s.motherton,
                s.lanknown,
                s.stu_img
            FROM users u
            RIGHT JOIN students s
                ON u.id = s.stu_id
                WHERE u.type_id=3 AND class=? AND section=?
        `;

    const [students] = await db.query(sql, [data.class, data.section]);

    res.status(200).json({
      message: "Students fetched successfully",
      success: true,
      students
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error!', success: false });
  }
};

exports.disableStudent = async (req, res) => {
  const { id } = req.params;


  try {
    const [result] = await db.query(
      "UPDATE users SET status=? WHERE id=?",
      ["0", id]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({ success: false, message: "Failed to disable student" });
    }

    return res.status(200).json({ success: true, message: "Student disabled successfully" });

  } catch (error) {
    console.error("Error disabling student:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


exports.enableStudent = async (req, res) => {
  const { id } = req.params;


  try {
    const [result] = await db.query(
      "UPDATE users SET status=? WHERE id=?",
      ["1", id]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({ success: false, message: "Failed to enable student" });
    }

    return res.status(200).json({ success: true, message: "Student enabled successfully" });

  } catch (error) {
    console.error("Error enabling student:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};



exports.getStudentByIdForEdit = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ success: false, message: "Student ID is required" });
  }

  try {
    const sql = `
      SELECT 
        u.id AS user_id, u.firstname, u.lastname, u.status, u.mobile, u.email,
        s.id AS student_id, s.academicyear, s.admissionnum, s.admissiondate, s.rollnum, 
        s.class, s.section, s.gender, s.dob, s.bloodgp, s.religion, s.caste, s.house, 
        s.stu_img, s.category, s.motherton, s.lanknown, s.curr_address, s.perm_address, 
        s.allergies, s.medications, s.prev_school, s.prev_school_address,s.stu_condition, s.medicalcert, 
        s.transfercert,
        h.hostel, h.room_num,
        t.route, t.vehicle_num, t.pickup_point,
        o.bank_name, o.branch, o.ifsc_num, o.other_det,
        p.id AS parent_id, p.name AS parent_name, p.email AS parent_email, 
        p.phone_num AS parent_phone, p.occuption, p.relation, p.relation_det, 
        p.address AS parent_address, p.img_src AS parent_img, p.guardian_Is
      FROM users u
      LEFT JOIN students s ON u.id = s.stu_id
      LEFT JOIN hostel_info h ON s.stu_id = h.user_id
      LEFT JOIN transport_info t ON s.stu_id = t.user_id
      LEFT JOIN other_info o ON s.stu_id = o.user_id
      LEFT JOIN parents_info p ON u.id = p.user_id
      WHERE u.id = ?;
    `;

    const [rows] = await db.query(sql, [id]);

    return res.status(200).json({
      success: true,
      message: "Student details fetched successfully",
      student: rows.length > 0 ? rows[0] : null,
      parents: rows.map(r => ({
        id: r.parent_id,
        name: r.parent_name,
        email: r.parent_email,
        phone_num: r.parent_phone,
        occuption: r.occuption,
        relation: r.relation,
        relation_det: r.relation_det,
        address: r.parent_address,
        img_src: r.parent_img,
        guardian_Is: r.guardian_Is,
      })).filter(p => p.id !== null)
    });

  } catch (error) {
    console.error("getStudentById error:", error.message);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};


exports.updateStudent = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  let connection;

  if (!id) {
    return res.status(400).json({ success: false, message: "Student ID is required" });
  }

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    // --- 1️⃣ Update users table ---
    await connection.query(
      `UPDATE users SET firstname=?, lastname=?, mobile=?, email=?, status=? WHERE id=?`,
      [data.firstname, data.lastname, data.primarycont, data.email, data.status, id]
    );

    // --- 2️⃣ Update students table ---
    await connection.query(
      `UPDATE students 
       SET academicyear=?, admissionnum=?, admissiondate=?, rollnum=?, class=?, section=?, 
           gender=?, dob=?, bloodgp=?, religion=?, caste=?, house=?, stu_img=?, category=?, 
           motherton=?, lanknown=?, curr_address=?, perm_address=?, allergies=?, medications=?, 
           prev_school=?, prev_school_address=?, medicalcert=?, transfercert=? 
       WHERE stu_id=?`,
      [
        data.academicyear,
        data.admissionnum,
        dayjs(data.admissiondate).format('YYYY-MM-DD'),
        data.rollnum,
        data.class,
        data.section,
        data.gender,
        dayjs(data.dob).format('YYYY-MM-DD'),
        data.bloodgp,
        data.religion,
        data.caste,
        data.house,
        data.stuimg,
        data.category,
        data.motherton,
        safeJSON(data.lanknown),
        data.curr_address,
        data.perm_address,
        safeJSON(data.allergies),
        safeJSON(data.medications),
        data.prev_school,
        data.prev_school_address,
        data.medicalcert,
        data.transfercert,
        id,
      ]
    );

    // --- 3️⃣ Prepare parents data ---
    const parentsData = [
      {
        relation: "Father",
        name: data.fat_name,
        email: data.fat_email,
        phone_num: data.fat_phone,
        occuption: data.fat_occu,
        img_src: data.fatimg,
      },
      {
        relation: "Mother",
        name: data.mot_name,
        email: data.mot_email,
        phone_num: data.mot_phone,
        occuption: data.mot_occu,
        img_src: data.motimg,
      },
      {
        relation: "Guardian",
        name: data.gua_name,
        email: data.gua_email,
        phone_num: data.gua_phone,
        occuption: data.gua_occu,
        relation_det: data.gua_relation || "",
        address: data.gua_address || "",
        img_src: data.guaimg,
        guardian_Is: data.guardianIs || "",
      },
    ].filter(p => p.name);

    // --- Parents insert/update using Promise.all ---
    await Promise.all(parentsData.map(async parent => {
      const [existingParent] = await connection.query(
        `SELECT id FROM parents_info WHERE user_id = ? AND relation = ? LIMIT 1`,
        [id, parent.relation]
      );

      if (existingParent.length > 0) {
        return connection.query(
          `UPDATE parents_info 
           SET name=?, email=?, phone_num=?, occuption=?, relation_det=?, address=?, img_src=?, guardian_Is=?
           WHERE id=?`,
          [
            parent.name,
            parent.email || null,
            parent.phone_num || null,
            parent.occuption || null,
            parent.relation_det || "",
            parent.address || "",
            parent.img_src || null,
            parent.guardian_Is || "",
            existingParent[0].id,
          ]
        );
      } else {
        return connection.query(
          `INSERT INTO parents_info (user_id, name, email, phone_num, occuption, relation, relation_det, address, img_src, guardian_Is)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            id,
            parent.name,
            parent.email || null,
            parent.phone_num || null,
            parent.occuption || null,
            parent.relation,
            parent.relation_det || "",
            parent.address || "",
            parent.img_src || null,
            parent.guardian_Is || "",
          ]
        );
      }
    }));

    // --- 5️⃣ Hostel, Transport, Other info using Promise.all ---
    const otherInfoQueries = [];

    if (data.hostel || data.room_num) {
      otherInfoQueries.push(
        connection.query(
          `INSERT INTO hostel_info (user_id, hostel, room_num) 
           VALUES (?, ?, ?) 
           ON DUPLICATE KEY UPDATE hostel=VALUES(hostel), room_num=VALUES(room_num)`,
          [id, data.hostel || null, data.room_num || null]
        )
      );
    }

    if (data.route || data.vehicle_num || data.picup_point) {
      otherInfoQueries.push(
        connection.query(
          `INSERT INTO transport_info (user_id, route, vehicle_num, pickup_point) 
           VALUES (?, ?, ?, ?) 
           ON DUPLICATE KEY UPDATE route=VALUES(route), vehicle_num=VALUES(vehicle_num), pickup_point=VALUES(pickup_point)`,
          [id, data.route || null, data.vehicle_num || null, data.picup_point || null]
        )
      );
    }

    if (data.bank_name || data.branch || data.ifsc_num || data.other_det) {
      otherInfoQueries.push(
        connection.query(
          `INSERT INTO other_info (user_id, bank_name, branch, ifsc_num, other_det) 
           VALUES (?, ?, ?, ?, ?) 
           ON DUPLICATE KEY UPDATE bank_name=VALUES(bank_name), branch=VALUES(branch), ifsc_num=VALUES(ifsc_num), other_det=VALUES(other_det)`,
          [id, data.bank_name || null, data.branch || null, data.ifsc_num || null, data.other_det || null]
        )
      );
    }

    await Promise.all(otherInfoQueries);

    // --- 6️⃣ Commit transaction ---
    await connection.commit();

    return res.status(200).json({ success: true, message: "Student updated successfully" });

  } catch (error) {
    if (connection) await connection.rollback();
    console.error("updateStudent error:", error.message);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  } finally {
    if (connection) connection.release();
  }
};

exports.specificDetailsStu = async (req, res) => {
  const id = req.params.id;
  try {

    const sql = `
      SELECT 
        u.id AS user_id,
        u.firstname,
        u.lastname,
        u.status,
        u.mobile,
        u.email,
        s.id AS student_id,
        s.academicyear,
        s.admissionnum,
        s.admissiondate,
        s.rollnum,
        s.class,
        s.section,
        s.gender,
        s.dob,
        s.bloodgp,
        s.religion,
        s.caste,
        s.house,
        s.stu_img,
        s.category,
        s.motherton,
        s.lanknown,
        s.curr_address,
        s.perm_address,
        s.allergies,
        s.medications,
        s.prev_school,
        s.prev_school_address,
        s.medicalcert,
        s.transfercert,
        h.hostel,
        h.room_num,
        t.route,
        t.vehicle_num,
        t.pickup_point,
        o.bank_name,
        o.branch,
        o.ifsc_num,
        o.other_det
      FROM users u
      LEFT JOIN students s ON u.id = s.stu_id
      LEFT JOIN hostel_info h ON s.stu_id = h.user_id
      LEFT JOIN transport_info t ON s.stu_id = t.user_id
      LEFT JOIN other_info o ON s.stu_id=o.user_id
      WHERE u.id = ?;
    `;
    const sql2 = `SELECT id,name,email,phone_num , relation ,img_src,guardian_is FROM parents_info WHERE user_id=?`

    const [student] = await db.query(sql, [id]);
    const [parents] = await db.query(sql2, [id])

    return res.status(200).json({
      message: 'Student fetched successfully!',
      success: true,
      student: student[0] || null,
      parents: parents || []
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Internal server error!',
      success: false,
    });
  }
};


exports.deleteStudent = async (req, res) => {
  const { id } = req.params;

  try {
    const sql = `DELETE FROM users WHERE id = ?`;
    const [result] = await db.query(sql, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Student not found', success: false });
    }

    return res.json({ message: 'Student deleted successfully', success: true });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error!', success: false });
  }
};


// student time table --------------------
exports.getTimeTable = async (req, res) => {
  const { id } = req.params;

  try {

    const [studentRows] = await db.query(
      `SELECT class, section FROM students WHERE stu_id = ?`,
      [id]
    );

    if (studentRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const student = studentRows[0];


    const [timetableRows] = await db.query(
      `SELECT * FROM timetable WHERE class = ? AND section = ? ORDER BY day, timefrom`,
      [student.class, student.section]
    );

    if (timetableRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No timetable found for this student",
      });
    }


    return res.status(200).json({
      success: true,
      // student: {
      //   id,
      //   class: student.class,
      //   section: student.section,
      // },
      timetable: timetableRows,
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
// leave for students ----------------------
exports.addStudentLeave = async (req, res) => {
  const data = req.body;

  try {

    const sql = `
      INSERT INTO leave_application 
      (student_rollnum, leave_type_id, from_date, to_date, leave_day_type, no_of_days, reason, leave_date) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [leaveres] = await db.query(sql, [
      data.student_rollnum,
      data.leave_type_id,
      data.from_date,
      data.to_date,
      data.leave_day_type,
      data.no_of_days,
      data.reason,
      data.leave_date,
    ]);

    return res.status(201).json({
      message: "Leave applied successfully!",
      success: true,
      insertId: leaveres.insertId,
    });
  } catch (error) {
    console.error("Error in addStudentLeave:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

// get leave name  , total , used and avilable

exports.getStuLeaveData = async (req, res) => {
  const { rollnum } = req.params;
  try {

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
        AND la.student_rollnum = ?
        AND la.status = "1"
      GROUP BY lt.id
      ORDER BY lt.id ASC
    `;

    const [leave_inform] = await db.query(sql, rollnum);


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
  WHERE la.student_rollnum = ?
  ORDER BY la.applied_on DESC
`;

    const [stuAllLeave] = await db.query(sql2, rollnum)

    return res.status(200).json({
      message: 'Leave information fetched successFully!',
      success: true,
      leave_inform,
      stuAllLeave
    });

  } catch (error) {

    console.error(error);
    return res.status(500).json({
      message: "Something went wrong!",
      success: false,
      error: error.message
    });
  }
}


exports.studentLeaveReport = async (req, res) => {
  console.log("fhdghdgfdh")
  try {
    const sql = `
      SELECT 
        st.admissionnum AS admissionNo,
        st.rollnum AS rollNo,
        st.stu_img,
        st.stu_id,
        u.firstname,
        u.lastname,
        lt.name AS leaveType,
        lt.total_allowed,
        IFNULL(SUM(la.no_of_days), 0) AS used,
        (lt.total_allowed - IFNULL(SUM(la.no_of_days), 0)) AS available
      FROM students st
      INNER JOIN users u ON st.stu_id = u.id
      CROSS JOIN leaves_type lt
      LEFT JOIN leave_application la 
        ON la.leave_type_id = lt.id 
        AND la.student_rollnum = st.rollnum 
        AND la.status = "1"
      GROUP BY st.admissionnum, st.rollnum,st.stu_img, u.firstname, u.lastname, lt.id
      ORDER BY st.admissionnum, lt.id;
    `;

    const [rows] = await db.query(sql);


    // Transform rows into student-wise structure
    const studentMap = {};

    rows.forEach((row) => {
      if (!studentMap[row.admissionNo]) {
        studentMap[row.admissionNo] = {
          admissionNo: row.admissionNo,
          rollNo: row.rollNo,
          studentName: row.firstname + " " + row.lastname,
          stu_img: row.stu_img,
          stu_id: row.stu_id,
          leaves: {},
        };
      }

      studentMap[row.admissionNo].leaves[row.leaveType] = {
        used: row.used,
        available: row.available,
        total: row.total_allowed,
      };
    });

    const result = Object.values(studentMap);

    return res.status(200).json({
      message: "Leave report fetched successfully!",
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

exports.studentReport = async (req, res) => {

  try {
    const sql = `
           SELECT 
    s.id AS student_id,
    s.stu_id,     
    s.admissiondate ,     
    s.admissionnum ,
    s.rollnum ,
    s.class ,
    s.section,
    s.gender,
    s.dob,
    s.stu_img ,   
    u.firstname,
    u.lastname,     
    u.status,
    father.name AS father_name,
    father.img_src AS father_img 
FROM students s
LEFT JOIN users u 
    ON s.stu_id = u.id 
LEFT JOIN parents_info father 
    ON s.stu_id = father.user_id AND father.relation = 'Father'
WHERE u.type_id = 3

        `;

    const [rows] = await db.query(sql)
    return res.status(200).json({ message: "All students for report data", data: rows , success:true })


  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Internal server error !", success: false })
  }
}


















