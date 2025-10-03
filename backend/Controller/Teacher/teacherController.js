const db = require('../../config/db')
const bcrypt = require('bcryptjs')


// utility for safe JSON stringify
function safeJSON(value) {
  if (Array.isArray(value)) return JSON.stringify(value);
  return value || null;
}

exports.addTeacher = async (req, res) => {
  const data = req.body;
  const connection = await db.getConnection()

  try {
    await connection.beginTransaction()
    const [existingUser] = await connection.query(
      `SELECT id FROM users WHERE email = ? LIMIT 1`,
      [data.email]
    );

    if (existingUser.length > 0) {
      await connection.release()
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const sql1 = `
      INSERT INTO users (firstname, lastname, mobile, email, password, type_id, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const hashPassword = await bcrypt.hash(data.password, 10);

    const [userRes] = await connection.query(sql1, [
      data.first_name,
      data.last_name,
      data.primarycont,
      data.email,
      hashPassword,
      2,
      data.status
    ]);
    const userId = userRes.insertId;

    const sql2 = `
      INSERT INTO teachers (
        user_id, teacher_id,fromclass,toclass,section, class, subject, gender, blood_gp, date_of_join, 
        fat_name, mot_name, dob, mari_status, lan_known, qualification, 
        work_exp, prev_school, prev_school_addr, prev_school_num, address, 
        perm_address, pan_or_id, other_info ,facebook_link ,instagram_link,linked_link,twitter_link , 
        img_src , resume_src , letter_src
      ) VALUES (?,?, ?, ?, ?, ?, ?,?,?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,?,?,?,?,?,?,?)
    `;
    await connection.query(sql2, [
      userId,
      data.teacher_id,
      data.fromclass,
      data.toclass,
      data.section,
      data.class,
      data.subject,
      data.gender,
      data.blood_gp,
      data.date_of_join,
      data.fat_name,
      data.mot_name,
      data.dob,
      data.mari_status,
      safeJSON(data.lan_known),
      data.qualification,
      data.work_exp,
      data.prev_school,
      data.prev_school_addr,
      data.prev_school_num,
      data.address,
      data.perm_address,
      data.pan_or_id,
      data.other_info,
      data.facebook_link,
      data.instagram_link,
      data.linked_link,
      data.twitter_link,
      data.img_src,
      data.resume_src,
      data.letter_src
    ]);

    const sql3 = `
      INSERT INTO teacher_payroll_info 
      (user_id ,epf_no , basic_salary , contract_type , work_sift , work_location , date_of_leave)   
      VALUES (?,?,?,?,?,?,?)
    `;
    await connection.query(sql3, [
      userId, data.epf_no, data.basic_salary, data.contract_type,
      data.work_sift, data.work_location, data.date_of_leave
    ]);

    const sql4 = `
      INSERT INTO teacher_leaves 
      (user_id, medical_leaves, casual_leaves, maternity_leaves, sick_leaves) 
      VALUES (?, ?, ?, ?, ?)
    `;
    await connection.query(sql4, [
      userId,
      data.medical_leaves,
      data.casual_leaves,
      data.maternity_leaves,
      data.sick_leaves
    ]);

    // bank details
    const sqlb = `
      INSERT INTO teacher_bank_info 
      (user_id , account_name,account_num,bank_name,ifsc_code,branch_name) 
      VALUES (?,?,?,?,?,?)
    `;
    await connection.query(sqlb, [
      userId, data.account_name, data.account_num, data.bank_name, data.ifsc_code, data.branch_name
    ]);

    // transport data
    const sql5 = `
      INSERT INTO transport_info 
      (user_id , route , vehicle_num ,pickup_point) 
      VALUES(?,?,?,?)
    `;
    await connection.query(sql5, [
      userId, data.route, data.vehicle_num, data.pickup_point
    ]);

    // hostel data
    const sql6 = `
      INSERT INTO hostel_info 
      (user_id , hostel , room_num) 
      VALUES(?,?,?)
    `;
    await connection.query(sql6, [
      userId, data.hostel, data.room_num
    ]);

    await connection.commit()
    await connection.release()

    return res.status(201).json({
      message: "Teacher added successfully",
      success: true
    });

  } catch (error) {
    await connection.rollback()
    await connection.release()

    console.error("Error adding teacher:", error);
    return res.status(500).json({
      message: "Internal server error!",
      success: false
    });
  }
};


exports.allTeachers = async (req, res) => {
  try {
    const sql = `
      SELECT  
        t.id,
        t.user_id,
        t.teacher_id,
        t.fromclass,
        t.toclass,
        t.section,
        t.class,
        t.subject,
        t.date_of_join,
        t.img_src, 
        u.firstname,
        u.lastname,
        u.status,
        u.mobile,
        u.email
      FROM teachers t
      LEFT JOIN users u ON t.user_id = u.id 
    `;

    const [rows] = await db.query(sql);
    return res.status(200).json({
      success: true,
      message: "All teachers fetched successfully",
      data: rows,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error fetching teachers",
      error: error.message,
    });
  }
};


exports.speTeacher = async (req, res) => {
  const { userId } = req.params;
  try {
    const sql = `
      SELECT  
        t.id,
        t.user_id,
        t.teacher_id,
        t.fromclass,
        t.toclass,
        t.section,
        t.class,
        t.subject,
        t.gender,
        t.blood_gp,
        t.date_of_join,
        t.fat_name,
        t.mot_name,
        t.dob,
        t.mari_status,
        t.lan_known,
        t.qualification,
        t.work_exp,
        t.prev_school,
        t.prev_school_addr,
        t.prev_school_num,
        t.address,
        t.perm_address,
        t.pan_or_id,
        t.other_info,
        t.facebook_link,
        t.instagram_link,
        t.linked_link,
        t.twitter_link,
        t.img_src,
        t.resume_src,
        t.letter_src,
        u.firstname,
        u.lastname,
        u.status,
        u.mobile,
        u.email,
        b.account_name,
        b.account_num,
        b.bank_name,
        b.ifsc_code,
        b.branch_name,
        h.hostel,
        h.room_num,
        tp.route,
        tp.vehicle_num,
        tp.pickup_point,
        pi.epf_no,
        pi.basic_salary,
        pi.contract_type,
        pi.work_sift,
        pi.work_location,
        pi.date_of_leave
      FROM teachers t
      LEFT JOIN users u ON t.user_id = u.id
      LEFT JOIN teacher_bank_info b ON t.user_id =b.user_id
      LEFT JOIN hostel_info h ON t.user_id = h.user_id
      LEFT JOIN transport_info tp ON t.user_id =tp.user_id  
      LEFT JOIN teacher_payroll_info pi ON t.user_id = pi.user_id
      WHERE t.user_id=?
    `;

    const [rows] = await db.query(sql, [userId]);
    return res.status(200).json({
      success: true,
      message: "All teachers fetched successfully",
      data: rows[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error fetching teachers",
      error: error.message,
    });
  }
};


exports.updateTeacher = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  let connection;

  if (!id) return res.status(400).json({ success: false, message: "Teacher ID is required" });

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    await connection.query(
      `UPDATE users SET firstname=?, lastname=?, mobile=?, email=?, status=? WHERE id=?`,
      [data.first_name, data.last_name, data.primarycont, data.email, data.status, id]
    );


    const teacherValues = [
      data.teacher_id,
      data.fromclass,
      data.toclass,
      data.section,
      data.class,
      data.subject,
      data.gender,
      data.blood_gp,
      data.date_of_join,
      data.fat_name,
      data.mot_name,
      data.dob,
      data.mari_status,
      safeJSON(data.lan_known),
      data.qualification,
      data.work_exp,
      data.prev_school,
      data.prev_school_addr,
      data.prev_school_num,
      data.address,
      data.perm_address,
      data.pan_or_id,
      data.other_info,
      data.facebook_link,
      data.instagram_link,
      data.linked_link,
      data.twitter_link,
      data.img_src,
      data.resume_src,
      data.letter_src,
      id
    ];

    await connection.query(
      `UPDATE teachers SET 
        teacher_id=?, fromclass=?, toclass=?, section=?, class=?, subject=?, gender=?, blood_gp=?, date_of_join=?, 
        fat_name=?, mot_name=?, dob=?, mari_status=?, lan_known=?, qualification=?, work_exp=?, prev_school=?, prev_school_addr=?, prev_school_num=?, 
        address=?, perm_address=?, pan_or_id=?, other_info=?, facebook_link=?, instagram_link=?, linked_link=?, twitter_link=?, 
        img_src=?, resume_src=?, letter_src=? 
        WHERE user_id=?`,
      teacherValues
    );


    await connection.query(
      `INSERT INTO teacher_payroll_info 
        (user_id, epf_no, basic_salary, contract_type, work_sift, work_location, date_of_leave) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
        epf_no=VALUES(epf_no), basic_salary=VALUES(basic_salary), contract_type=VALUES(contract_type),
        work_sift=VALUES(work_sift), work_location=VALUES(work_location), date_of_leave=VALUES(date_of_leave)`,
      [
        id,
        data.epf_no,
        data.basic_salary,
        data.contract_type,
        data.work_sift,
        data.work_location,
        data.date_of_leave
      ]
    );




    await connection.query(
      `INSERT INTO teacher_bank_info 
        (user_id, account_name, account_num, bank_name, ifsc_code, branch_name)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        account_name=VALUES(account_name), account_num=VALUES(account_num),
        bank_name=VALUES(bank_name), ifsc_code=VALUES(ifsc_code), branch_name=VALUES(branch_name)`,
      [
        id,
        data.account_name,
        data.account_num,
        data.bank_name,
        data.ifsc_code,
        data.branch_name
      ]
    );


    await connection.query(
      `INSERT INTO transport_info 
        (user_id, route, vehicle_num, pickup_point)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        route=VALUES(route), vehicle_num=VALUES(vehicle_num), pickup_point=VALUES(pickup_point)`,
      [
        id,
        data.route,
        data.vehicle_num,
        data.pickup_point
      ]
    );


    await connection.query(
      `INSERT INTO hostel_info 
        (user_id, hostel, room_num)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE
        hostel=VALUES(hostel), room_num=VALUES(room_num)`,
      [
        id,
        data.hostel,
        data.room_num
      ]
    );


    await connection.commit();
    return res.status(200).json({ success: true, message: "Teacher updated successfully" });

  } catch (error) {
    if (connection) await connection.rollback();
    console.error("updateTeacher error:", error.message);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  } finally {
    if (connection) connection.release();
  }
};


exports.disableTeacher = async (req, res) => {
  const { id } = req.params;


  try {
    const [result] = await db.query(
      "UPDATE users SET status=? WHERE id=?",
      ["0", id]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({ success: false, message: "Failed to disable teacher" });
    }

    return res.status(200).json({ success: true, message: "Teacher disabled successfully" });

  } catch (error) {
    console.error("Error disabling teacher:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.enaableTeacher = async (req, res) => {
  const { id } = req.params;


  try {
    const [result] = await db.query(
      "UPDATE users SET status=? WHERE id=?",
      ["1", id]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({ success: false, message: "Failed to enable teacher" });
    }

    return res.status(200).json({ success: true, message: "Teacher enabled successfully" });

  } catch (error) {
    console.error("Error enabling teacher:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


exports.deleteTeacher = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Id not provided!", success: false });
  }

  try {
    const [result] = await db.query(`DELETE FROM users WHERE id=?`, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Teacher not found!', success: false });
    }

    return res.status(200).json({ message: "Teacher deleted successfully!", success: true });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error!", success: false });
  }
};



exports.allTeachersForOption = async (req, res) => {
  try {
    const sql = `
      SELECT      
        t.user_id AS id,
        t.teacher_id,
        u.firstname,
        u.lastname
      FROM teachers t
      LEFT JOIN users u ON t.user_id = u.id
    `;

    const [rows] = await db.query(sql);
    return res.status(200).json({
      success: true,
      message: "All teachers fetched successfully For option",
      data: rows,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error fetching teachers",
      error: error.message,
    });
  }
};
