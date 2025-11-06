
const db = require('../../config/db')
const bcrypt = require('bcryptjs');
const transporter = require('../../utils/sendEmail')
const dayjs = require('dayjs');
const { promise } = require('zod');


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

async function getUserId(rollnum) {

  const [stu] = await db.query(`SELECT stu_id FROM students WHERE rollnum =?`, [rollnum])
  return stu[0].stu_id

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
      `INSERT INTO users (firstname, lastname, mobile, email, password, roll_id, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [data.firstname, data.lastname, data.primarycont, data.email, hashPassword, 3, data.status]
    );
    const userId = userRes.insertId;


    await connection.query(
      `INSERT INTO students (
        stu_id, academicyear, admissionnum, admissiondate, rollnum, class_id, section_id,
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

    //  const [userResForParent] = await connection.query(
    //   `INSERT INTO users (firstname, lastname, mobile, email, password, roll_id, status)
    //    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    //   [data.firstname, data.lastname, data.primarycont, data.email, hashPassword, 3, data.status]
    // );
    // const parentId = userResForParent.insertId;


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
          LEFT JOIN parents_info p ON s.stu_id = p.user_id AND relation = "Father"
          JOIN roles r on r.id=u.roll_id
          
                WHERE u.roll_id=3
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
                u.roll_id,
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
                s.motherton,
                s.lanknown,
                s.stu_img
            FROM users u
            RIGHT JOIN students s
                ON u.id = s.stu_id
                  RIGHT JOIN classes  c ON c.id =  s.class_id
          RIGHT JOIN sections se ON se.id = s.section_id
                WHERE u.roll_id=3 AND s.class_id=? AND s.section_id=?
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


exports.filterStudentsForOption = async (req, res) => {

  const data = req.body;
  try {
    const sql = `
          SELECT 
            u.firstname,
            u.lastname,
            s.rollnum
            FROM users u
            RIGHT JOIN students s
            ON u.id = s.stu_id
            WHERE u.roll_id = 3 
            AND s.class_id = ? 
            AND s.section_id = ?;

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
  const { rollnum } = req.params;
  const id = await getUserId(rollnum)


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
  const { rollnum } = req.params;
  const id = await getUserId(rollnum)


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


exports.getStudentByRollnumForEdit = async (req, res) => {
  const { rollnum } = req.params;

  if (!rollnum) {
    return res.status(400).json({ success: false, message: "Student Roll Number is required" });
  }
  const id = await getUserId(rollnum)
  try {
    const sql = `
      SELECT 
        u.id AS user_id, u.firstname, u.lastname, u.status, u.mobile, u.email,
        s.id AS student_id, s.academicyear, s.admissionnum, s.admissiondate, s.rollnum, 
         s.class_id AS class, s.section_id AS section, s.gender, s.dob, s.bloodgp, s.religion, s.caste, s.house, 
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
      JOIN classes cl ON cl.id = s.class_id
      JOIN sections se ON se.id = s.section_id
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
  const { rollnum } = req.params;
  const data = req.body;
  let connection;
  if (!rollnum) {
    return res.status(400).json({ success: false, message: "Student RollNumber is required" });
  }

  const id = await getUserId(rollnum)



  try {
    connection = await db.getConnection();
    await connection.beginTransaction();


    await connection.query(
      `UPDATE users SET firstname=?, lastname=?, mobile=?, email=?, status=? WHERE id=?`,
      [data.firstname, data.lastname, data.primarycont, data.email, data.status, id]
    );


    await connection.query(
      `UPDATE students 
       SET academicyear=?, admissionnum=?, admissiondate=?, rollnum=?, class_id=?, section_id=?, 
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
  const { rollnum } = req.params;
  const id = await getUserId(rollnum)

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
        c.class_name as class,
        s.class_id,
        se.section_name as section,
        s.section_id,
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
        hs.name as hostel_name,
        hsr.room_num as hostel_room_number,
        t.route,
        t.vehicle_num,
        t.pickup_point,
        tr.routeName as route_name,
        tp.pickPointName as pickup_pointName,
        vi.vehicle_no as vehical_number,
        o.bank_name,
        o.branch,
        o.ifsc_num,
        o.other_det,
         p.name,
        p.phone_num
      FROM users u
      LEFT JOIN students s ON u.id = s.stu_id
      LEFT JOIN hostel_info h ON s.stu_id = h.user_id
      LEFT JOIN hostel hs ON hs.id = h.hostel
      LEFT JOIN hostel_room hsr ON hsr.id = h.room_num
      LEFT JOIN transport_info t ON s.stu_id = t.user_id
      LEFT JOIN transport_routes tr ON tr.id = t.route
      LEFT JOIN transport_pickupPoints tp ON tp.id = t.pickup_point
      LEFT JOIN  vehicle_info vi ON vi.id = t.vehicle_num
      LEFT JOIN other_info o ON s.stu_id=o.user_id
      LEFT JOIN parents_info p ON s.stu_id = p.user_id AND relation = "Father"
      LEFT JOIN classes c ON s.class_id = c.id
      LEFT JOIN sections se ON s.section_id = se.id
      WHERE s.rollnum = ?;
    `;
    const sql2 = `SELECT id,name,email,phone_num , relation ,img_src,guardian_is FROM parents_info WHERE user_id=?`

    const [student] = await db.query(sql, [rollnum]);
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
  const { rollnum } = req.params;
  const id = await getUserId(rollnum)

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
  const { rollnum } = req.params;
  const id = await getUserId(rollnum)

  try {

    const [studentRows] = await db.query(
      `SELECT class_id, section_id FROM students WHERE stu_id = ?`,
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
      `SELECT * FROM timetable WHERE class = ? AND section= ? ORDER BY day, timefrom`,
      [student.class_id, student.section_id]
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

// get leave name , total , used and avilable

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
        AND la.id_or_rollnum = ?
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
  WHERE la.id_or_rollnum = ?
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
        AND la.id_or_rollnum = st.rollnum 
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
    c.class_name as class,
    s.class_id,
    UPPER(se.section_name) as section,
    s.section_id,
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
    LEFT JOIN classes c ON s.class_id = c.id
    LEFT JOIN sections se ON s.section_id = se.id
WHERE u.roll_id = 3

        `;

    const [rows] = await db.query(sql)
    return res.status(200).json({ message: "All students for report data", data: rows, success: true })


  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Internal server error !", success: false })
  }
}


// for student dashboard data
exports.getStuByToken = async (req, res) => {
  const { userId } = req.params;
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
        UPPER(c.class_name) as class,
        s.class_id,
        UPPER( se.section_name) as section,
        s.section_id,
        s.stu_img
      FROM users u
      LEFT JOIN students s ON u.id = s.stu_id
       LEFT JOIN classes c ON s.class_id = c.id
    LEFT JOIN sections se ON s.section_id = se.id
      WHERE u.id = ?;
    `;
    const [student] = await db.query(sql, [userId]);

    return res.status(200).json({
      message: 'Student fetched successfully!',
      success: true,
      student: student[0],

    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Internal server error!',
      success: false,
    });
  }
};

// student for option
exports.studentForOption = async (req, res) => {
  try {

    const sql = `
      SELECT 
      st.id,
      st.rollnum,
      u.id AS userId,
      u.firstname,
      u.lastname,
      UPPER(c.class_name) AS class,
      UPPER(se.section_name) AS section
      FROM students st
      LEFT JOIN users u ON st.stu_id = u.id AND roll_id=3
      LEFT JOIN classes c ON st.class_id = c.id
      LEFT JOIN sections se ON st.section_id = se.id
    `

    const [rows] = await db.query(sql)
    return res.status(200).json({ message: "Students for option fetched successfully!", success: true, data: rows })

  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Internal server error !", success: false })
  }
}

exports.studentForOption2 = async (req, res) => {
  try {

    const sql = `
      SELECT 
      st.id,
      st.rollnum,
      u.id AS userId,
      u.firstname,
      u.lastname
      FROM students st
      LEFT JOIN users u ON st.stu_id = u.id AND roll_id=3
    `

    const [rows] = await db.query(sql)
    return res.status(200).json({ message: "Students for option fetched successfully!", success: true, data: rows })

  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Internal server error !", success: false })
  }
}

exports.filterStudentsForParmotion = async (req, res) => {

  const data = req.body;

  try {
    const sql = `
      SELECT 
        s.id AS student_id,
        s.rollnum,
        s.admissionnum,
        u.firstname, 
        u.lastname,
        s.class_id,
        s.section_id,
        s.stu_img,
        UPPER(c.class_name) as class,
        UPPER( se.section_name) as section,
        en.examName,
        er.mark_obtained,
        er.max_mark
      FROM exam_result er
      JOIN examName en ON er.exam_name_id = en.id
      JOIN students s ON er.roll_num = s.rollnum
      JOIN users u ON u.id = s.stu_id
      JOIN classes  c ON c.id =  s.class_id
      JOIN sections se ON se.id = s.section_id
      WHERE s.class_id = ? 
        AND s.section_id = ?
        AND (en.examName = 'Semester1' OR en.examName = 'Semester2')
      ORDER BY s.rollnum;
    `;

    const [rows] = await db.query(sql, [data.class, data.section]);

    if (!rows.length) {
      return res.status(200).json({
        success: false,
        message: "No student results found!",
      });
    }

    
    const studentMap = {};
    rows.forEach((row) => {
      if (!studentMap[row.student_id]) {
        studentMap[row.student_id] = {
          rollnum: row.rollnum,
          admissionnum: row.admissionnum,
          firstname: row.firstname,
          student_id: row.student_id,
          class: row.class,
          section: row.section,
          stu_img: row.stu_img,
          lastname: row.lastname,
          semester1: { obtained: 0, max: 0 },
          semester2: { obtained: 0, max: 0 },
        };
      }

      if (row.examName === "Semester1") {
        studentMap[row.student_id].semester1.obtained += row.mark_obtained || 0;
        studentMap[row.student_id].semester1.max += row.max_mark || 0;
      } else if (row.examName === "Semester2") {
        studentMap[row.student_id].semester2.obtained += row.mark_obtained || 0;
        studentMap[row.student_id].semester2.max += row.max_mark || 0;
      }
    });

    
    const finalResult = Object.values(studentMap).map((stu) => {
      const totalObtained = stu.semester1.obtained + stu.semester2.obtained;
      const totalMax = stu.semester1.max + stu.semester2.max;

      const percent = totalMax > 0 ? Number(((totalObtained / totalMax) * 100).toFixed(2)) : 0;

      const result = percent >= 33 ? "Pass" : "Fail";

      return {
        student_id: stu.student_id,
        rollnum: stu.rollnum,
        admissionnum: stu.admissionnum,
        firstname: stu.firstname,
        lastname: stu.lastname,
        class: stu.class,
        section: stu.section,
        stu_img: stu.stu_img,
        result,
        percent,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Student fetched  successfully fro promotion!",
      students: finalResult,
    });
  } catch (error) {
    console.error("❌ Error in getFinalResultByClassSection:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error!",
    });
  }
};

exports.promoteStudents = async (req, res) => {
  let connection;
  try {
    const { studentIds, toAcademicYear, toClassId, toSectionId } = req.body;

    if (
      !studentIds ||
      !Array.isArray(studentIds) ||
      studentIds.length === 0 ||
      !toAcademicYear ||
      !toClassId ||
      !toSectionId
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields for promotion",
      });
    }


    connection = await db.getConnection();
    await connection.beginTransaction();

    const [existingStudents] = await connection.query(
      "SELECT id, class_id, section_id, academicyear FROM students WHERE id IN (?)",
      [studentIds]
    );

    if (existingStudents.length === 0) {
      await connection.rollback();
      return res
        .status(404)
        .json({ success: false, message: "No students found with given IDs" });
    }

    const [updateResult] = await connection.query(
      `UPDATE students 
       SET class_id = ?, section_id = ?, academicyear = ?
       WHERE id IN (?)`,
      [toClassId, toSectionId, toAcademicYear, studentIds]
    );

    await Promise.all(
      existingStudents.map((stu) =>
        connection.query(
          `INSERT INTO promotion_history (student_id, from_class, to_class, from_section, to_section, from_year, to_year, promoted_on)
           VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
          [
            stu.id,
            stu.class_id,
            toClassId,
            stu.section_id,
            toSectionId,
            stu.academicyear,
            toAcademicYear,
          ]
        )
      )
    );

    await connection.commit();
    return res.status(200).json({
      success: true,
      message: "Students promoted successfully!",
      promotedCount: updateResult.affectedRows,
    });
  } catch (error) {
    console.error("Promotion error:", error);
    if (connection) await connection.rollback();
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  } finally {
    if (connection) connection.release();
  }
};




















