const bcrypt = require('bcryptjs');
const db = require('../../config/db');
const transporter = require('../../utils/sendEmail');
const dayjs = require('dayjs');

async function getUserId(staffid) {

  const [staff] = await db.query(`SELECT user_id FROM staffs WHERE id =?`, [staffid])
  return staff[0].user_id

}

function safeJSON(value) {
  if (Array.isArray(value)) return JSON.stringify(value);
  return value || null;
}

exports.addStaff = async (req, res) => {
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


    const genPassword = data.password;
    const hashPassword = await bcrypt.hash(genPassword, 10);

    let cardNo;
    let isUnique = false;
    while (!isUnique) {
      const randomNum = Math.floor(10000000 + Math.random() * 90000000); // 8-digit number
      cardNo = `STF${randomNum}`;
      const [existingCard] = await connection.query(
        "SELECT id FROM staffs WHERE cardNo = ? LIMIT 1",
        [cardNo]
      );
      if (existingCard.length === 0) {
        isUnique = true;
      }
    }

   
    const [userRes] = await connection.query(
      `INSERT INTO users (
        firstname, lastname, mobile, email, password, roll_id, status, remark, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.firstname,
        data.lastname,
        data.primarycont,
        data.email,
        hashPassword,
        data.role,
        data.status || '1',
        "staff",
        new Date(),
        new Date()
      ]
    );
    const userId = userRes.insertId;

    // 🔹 Insert into staffs
    const staffCols = [
      'user_id', 'role','cardNo','driveLic', 'department', 'designation', 'gender', 'blood_gp', 'marital_status',
      'fat_name', 'mot_name', 'dob', 'date_of_join', 'lan_known', 'qualification', 'work_exp',
      'note', 'address', 'perm_address', 'fac_link', 'twi_link', 'link_link', 'inst_link',
      'img_src', 'resume_src', 'letter_src', 'created_at', 'updated_at'
    ];

    const staffVals = [
      userId,
      data.role,
      cardNo,
      data.driveLic||null,
      data.department,
      data.desgination,
      data.gender || null,
      data.blood_gp || null,
      data.marital_status || "single",
      data.fat_name,
      data.mot_name,
      data.dob ? dayjs(data.dob).format('YYYY-MM-DD') : null,
      data.date_of_join ? dayjs(data.date_of_join).format('YYYY-MM-DD') : null,
      safeJSON(data.lan_known || []),
      data.qualification || null,
      data.work_exp || null,
      data.note || null,
      data.address,
      data.perm_address,
      data.fac_link || null,
      data.twi_link || null,
      data.link_link || null,
      data.inst_link || null,
      data.img_src,
      data.resume_src,
      data.letter_src,
      new Date(),
      new Date()
    ];

    await connection.query(
      `INSERT INTO staffs (${staffCols.join(',')}) VALUES (${staffCols.map(() => '?').join(',')})`,
      staffVals
    );


    const filesToUpdate = [data.img_src, data.resume_src, data.letter_src];
    await Promise.all(
      filesToUpdate.filter(Boolean).map(file =>
        connection.query("UPDATE files SET status=1 WHERE filename=?", [file])
      )
    );

    // 🔹 Payroll info
    await connection.query(
      `INSERT INTO payroll_info (
        user_id, epf_no, basic_salary, contract_type, work_sift, work_location, date_of_leave
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        data.epf_no || null,
        data.basic_salary || null,
        data.contract_type || null,
        data.work_sift || null,
        data.work_location || null,
        data.date_of_leave || null
      ]
    );

    // 🔹 Leaves info
    await connection.query(
      `INSERT INTO leaves_info (
        user_id, medical_leaves, casual_leaves, maternity_leaves, sick_leaves
      ) VALUES (?, ?, ?, ?, ?)`,
      [
        userId,
        data.medical_leaves || 0,
        data.casual_leaves || 0,
        data.maternity_leaves || 0,
        data.sick_leaves || 0
      ]
    );

    // 🔹 Bank info
    await connection.query(
      `INSERT INTO bank_info (
        user_id, account_name, account_num, bank_name, ifsc_code, branch_name
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        userId,
        data.account_name,
        data.account_num,
        data.bank_name,
        data.ifsc_code,
        data.branch_name
      ]
    );



    await connection.query(
      `INSERT INTO transport_info (user_id, route, vehicle_num, pickup_point)
         VALUES (?, ?, ?, ?)`,
      [userId, data.route || null, data.vehicle_num || null, data.pickup_point || null]
    );


    await connection.query(
      `INSERT INTO hostel_info (user_id, hostel, room_num)
         VALUES (?, ?, ?)`,
      [userId, data.hostel || null, data.room_num || null]
    );

    await connection.commit();


    transporter.sendMail({
      from: process.env.SMTP_USER,
      to: data.email,
      subject: "Your staff account has been created",
      text: `Hello ${data.firstname} ${data.lastname},\n\nYour staff account has been created.\nEmail: ${data.email}\nPassword: ${genPassword}`
    }).catch(err => console.error("Email error:", err));

    return res.status(201).json({
      success: true,
      message: "Staff added successfully",
      generatedPassword: genPassword
    });

  } catch (error) {
    if (connection) {
      try { await connection.rollback(); } catch (rollbackErr) { console.error("Rollback failed:", rollbackErr); }
    }
    console.error("Add staff error:", error);
    return res.status(500).json({ success: false, message: "Internal server error!", error: error.message });
  } finally {
    if (connection) connection.release();
  }
};



exports.fetchSpeDetailsAllStaff = async (req, res) => {
  try {
    const sql = `
      SELECT 
        sf.id AS staff_id,
        sf.img_src,
        dep.name AS department_name,
        des.name AS designation_name,
        sf.date_of_join,
        u.id AS user_id,
        u.firstname,
        u.lastname,
        u.mobile,
        u.email
      FROM staffs sf
      LEFT JOIN department dep ON sf.department = dep.id
      LEFT JOIN designation des ON sf.designation = des.id
      LEFT JOIN users u ON sf.user_id = u.id AND u.remark = 'staff'
    `;

    const [rows] = await db.query(sql);

    return res.status(200).json({
      message: "All staff fetched successfully!",
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching staff details:", error);
    return res.status(500).json({
      message: "Internal server error!",
      success: false,
    });
  }
};

exports.filterSpeDetailsAllStaff = async (req, res) => {

  const { department, designation } = req.body

  try {
    const sql = `
      SELECT 
        sf.id AS staff_id,
        sf.img_src,
        dep.name AS department_name,
        des.name AS designation_name,
        u.firstname,
        u.lastname  
      FROM staffs sf
      LEFT JOIN department dep ON sf.department = dep.id
      LEFT JOIN designation des ON sf.designation = des.id
      LEFT JOIN users u ON sf.user_id = u.id AND u.remark = "staff"
      WHERE sf.department =? AND sf.designation=?
    `;

    const [rows] = await db.query(sql, [department, designation]);

    return res.status(200).json({
      message: "Filter staff fetched successfully!",
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Error filtering staff :", error);
    return res.status(500).json({
      message: "Internal server error!",
      success: false,
    });
  }
};

exports.deleteStaff = async (req, res) => {
  const { staffid } = req.params;
  const user_id = await getUserId(staffid)

  try {
    const sql = `DELETE FROM users WHERE id = ?`;
    const [result] = await db.query(sql, [user_id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Staff not found', success: false });
    }

    return res.json({ message: 'Staff deleted successfully', success: true });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error!', success: false });
  }
};

exports.fetchSpecficStaffDeatils = async (req, res) => {
  const { staffid } = req.params;


  try {
    const sql = `
      SELECT 
        sf.id AS staff_id,
        sf.img_src,
        sf.date_of_join,
        sf.gender,
        sf.dob,
        sf.blood_gp,
        sf.lan_known,
        sf.address,
        sf.perm_address,
        sf.resume_src,
        sf.letter_src,
        sf.note,
        b.account_name,
        b.account_num,
        b.bank_name,
        b.ifsc_code,
        b.branch_name,
        dep.name AS department_name,
        des.name AS designation_name,
        u.id AS user_id,
        u.firstname,
        u.lastname,
        u.mobile,
        u.email,
        u.status
      FROM staffs sf
      LEFT JOIN department dep ON sf.department = dep.id
      LEFT JOIN designation des ON sf.designation = des.id
      LEFT JOIN users u ON sf.user_id = u.id AND u.remark = 'staff'
      LEFT JOIN bank_info b ON sf.user_id = b.user_id
      WHERE sf.id = ?
    `;

    const [rows] = await db.query(sql, [staffid]);

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Staff not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Staff data fetched successfully!",
      success: true,
      data: rows[0],
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error!",
      success: false,
    });
  }
};


// Fetch detailed staff data for editing by ID
exports.fetchStaffDataForEditById = async (req, res) => {
  const { staffid } = req.params;

  if (!staffid) {
    return res.status(400).json({
      message: "Staff ID is required",
      success: false,
    });
  }

  try {
    const sql = `
      SELECT 
        sf.id AS staff_id,
        sf.role,
        sf.driveLic,
        sf.department,
        sf.designation,
        sf.gender,
        sf.blood_gp,
        sf.marital_status,
        sf.fat_name,
        sf.mot_name,
        sf.dob,
        sf.date_of_join,
        sf.lan_known,
        sf.qualification,
        sf.work_exp,
        sf.note,
        sf.address,
        sf.fac_link,
        sf.twi_link,
        sf.link_link,
        sf.inst_link,
        sf.perm_address,
        sf.img_src,
        sf.resume_src,
        sf.letter_src,
        py.epf_no,
        py.basic_salary,
        py.contract_type,
        py.work_sift,
        py.work_location,
        py.date_of_leave,
        le.medical_leaves,
        le.casual_leaves,
        le.maternity_leaves,
        le.sick_leaves,
        hs.hostel,
        hs.room_num,
        tp.route,
        tp.vehicle_num,
        tp.pickup_point,
        b.account_name,
        b.account_num,
        b.bank_name,
        b.ifsc_code,
        b.branch_name,
        u.id AS user_id,
        u.firstname,
        u.lastname,
        u.mobile,
        u.email,
        u.status
      FROM staffs sf
      LEFT JOIN payroll_info py ON sf.user_id = py.user_id
      LEFT JOIN leaves_info le ON sf.user_id = le.user_id
      LEFT JOIN hostel_info hs ON sf.user_id = hs.user_id
      LEFT JOIN transport_info tp ON sf.user_id = tp.user_id 
      LEFT JOIN users u ON sf.user_id = u.id AND u.remark="staff"
      LEFT JOIN bank_info b ON sf.user_id = b.user_id
      WHERE sf.id = ? AND u.remark = 'staff'
      LIMIT 1
    `;

    const [rows] = await db.query(sql, [staffid]);

    if (!rows || rows.length === 0) {
      return res.status(404).json({
        message: "Staff not found",
        success: false,
      });
    }

    // Send the first record since IDs are unique
    return res.status(200).json({
      message: "Staff data fetched successfully",
      success: true,
      data: rows[0],
    });

  } catch (error) {
    console.error("Error fetching staff data:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};


exports.updateStaff = async (req, res) => {
  const { staffid } = req.params;
  const data = req.body;

  if (!staffid) return res.status(400).json({ success: false, message: "Staff ID is required" });

  let connection;
  try {
    const userId = await getUserId(staffid);
    if (!userId) return res.status(404).json({ success: false, message: "Staff not found" });

    connection = await db.getConnection();
    await connection.beginTransaction();

    // 🔹 Update users table
    await connection.query(
      `UPDATE users SET firstname=?, lastname=?, mobile=?,roll_id=?, email=?, status=? WHERE id=?`,
      [data.firstname, data.lastname, data.primarycont,data.role, data.email, data.status, userId]
    );


    const staffValues = [
      data.role,
      data.department,
      data.desgination,
      data.driveLic||null,
      data.gender || null,
      data.blood_gp || null,
      data.marital_status || "single",
      data.fat_name,
      data.mot_name,
      data.dob ? dayjs(data.dob).format('YYYY-MM-DD') : null,
      data.date_of_join ? dayjs(data.date_of_join).format('YYYY-MM-DD') : null,
      safeJSON(data.lan_known || []),
      data.qualification || null,
      data.work_exp || null,
      data.note || null,
      data.address,
      data.perm_address,
      data.fac_link || null,
      data.twi_link || null,
      data.link_link || null,
      data.inst_link || null,
      data.img_src,
      data.resume_src,
      data.letter_src,
      staffid
    ];

    await connection.query(
      `UPDATE staffs SET 
        role=?, department=?, designation=?,driveLic=?, gender=?, blood_gp=?, marital_status=?,
        fat_name=?, mot_name=?, dob=?, date_of_join=?, lan_known=?, qualification=?,
        work_exp=?, note=?, address=?, perm_address=?, fac_link=?, twi_link=?, link_link=?, inst_link=?,
        img_src=?, resume_src=?, letter_src=? 
        WHERE id=?`,
      staffValues
    );


    await connection.query(
      `INSERT INTO payroll_info
        (user_id, epf_no, basic_salary, contract_type, work_sift, work_location, date_of_leave)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          epf_no=VALUES(epf_no),
          basic_salary=VALUES(basic_salary),
          contract_type=VALUES(contract_type),
          work_sift=VALUES(work_sift),
          work_location=VALUES(work_location),
          date_of_leave=VALUES(date_of_leave)`,
      [
        userId,
        data.epf_no || null,
        data.basic_salary || null,
        data.contract_type || null,
        data.work_sift || null,
        data.work_location || null,
        data.date_of_leave || null
      ]
    );


    await connection.query(
      `INSERT INTO leaves_info
        (user_id, medical_leaves, casual_leaves, maternity_leaves, sick_leaves)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          medical_leaves=VALUES(medical_leaves),
          casual_leaves=VALUES(casual_leaves),
          maternity_leaves=VALUES(maternity_leaves),
          sick_leaves=VALUES(sick_leaves)`,
      [
        userId,
        data.medical_leaves || 0,
        data.casual_leaves || 0,
        data.maternity_leaves || 0,
        data.sick_leaves || 0
      ]
    );


    await connection.query(
      `INSERT INTO bank_info
        (user_id, account_name, account_num, bank_name, ifsc_code, branch_name)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          account_name=VALUES(account_name),
          account_num=VALUES(account_num),
          bank_name=VALUES(bank_name),
          ifsc_code=VALUES(ifsc_code),
          branch_name=VALUES(branch_name)`,
      [
        userId,
        data.account_name || null,
        data.account_num || null,
        data.bank_name || null,
        data.ifsc_code || null,
        data.branch_name || null
      ]
    );


    await connection.query(
      `INSERT INTO transport_info
        (user_id, route, vehicle_num, pickup_point)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          route=VALUES(route),
          vehicle_num=VALUES(vehicle_num),
          pickup_point=VALUES(pickup_point)`,
      [
        userId,
        data.route || null,
        data.vehicle_num || null,
        data.pickup_point || null
      ]
    );


    await connection.query(
      `INSERT INTO hostel_info
        (user_id, hostel, room_num)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE
          hostel=VALUES(hostel),
          room_num=VALUES(room_num)`,
      [
        userId,
        data.hostel || null,
        data.room_num || null
      ]
    );

    await connection.commit();

    return res.status(200).json({ success: true, message: "Staff updated successfully" });

  } catch (error) {
    if (connection) await connection.rollback();
    console.error("updateStaff error:", error.message);
    return res.status(500).json({ success: false, message: "Internal server error" });
  } finally {
    if (connection) connection.release();
  }
};

// get staff leave data
exports.getStaffLeaveData = async (req, res) => {
  const { staffid } = req.params;
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

    const [leave_inform] = await db.query(sql, staffid);


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

    const [staffAllLeave] = await db.query(sql2, staffid)

    return res.status(200).json({
      message: 'Leave information fetched successFully!',
      success: true,
      leave_inform,
      staffAllLeave
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


exports.staffLeaveReport = async (req, res) => {

  try {
    const sql = `
      SELECT 
        st.id AS staffId,
        st.img_src,
        st.user_id,
        u.firstname,
        u.lastname,
        lt.name AS leaveType,
        lt.total_allowed,
        IFNULL(SUM(la.no_of_days), 0) AS used,
        (lt.total_allowed - IFNULL(SUM(la.no_of_days), 0)) AS available
      FROM staffs st
      INNER JOIN users u ON st.user_id = u.id
      CROSS JOIN leaves_type lt
      LEFT JOIN leave_application la 
        ON la.leave_type_id = lt.id 
        AND la.id_or_rollnum = st.id 
        AND la.status = "1"
      GROUP BY st.id, st.img_src, u.firstname, u.lastname, lt.id
      ORDER BY st.id, lt.id;
    `;

    const [rows] = await db.query(sql);
    
    // Transform rows into student-wise structure
    const staffMap = {};

    rows.forEach((row) => {
      if (!staffMap[row.staffId]) {
         staffMap[row.staffId] = {
          staffId: `${row.staffId}`,
          staffName: row.firstname + " " + row.lastname,
          img: row.img_src,
          userId: row.user_id,
          leaves: {},
        };
      }

      staffMap[row.staffId].leaves[row.leaveType] = {
        used: row.used,
        available: row.available,
        total: row.total_allowed,
      };
    });

    const result = Object.values(staffMap);

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



