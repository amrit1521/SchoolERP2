const bcrypt = require('bcrypt');
const db = require('../../config/db');

exports.addStaff = async (req, res) => {
  const data = req.body;
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // 🔹 Check if user already exists
    const [existingUser] = await connection.query(
      `SELECT id FROM users WHERE email = ? LIMIT 1`,
      [data.email]
    );

    if (existingUser.length > 0) {
      await connection.release();
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // 🔹 Insert into users
    const sql1 = `
      INSERT INTO users (firstname, lastname, mobile, email, password, type_id, status, remark)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const hashPassword = await bcrypt.hash(data.password || "123456", 10);

    const [userRes] = await connection.query(sql1, [
      data.first_name,
      data.last_name,
      data.primarycont,
      data.email,
      hashPassword,
      4,
      data.status || 'active',
      "staff",
    ]);

    const userId = userRes.insertId;

   
    const sql2 = `
      INSERT INTO staff (
        user_id, role, department, designation, gender, blood_gp, marital_status,
        fat_name, mot_name, dob, date_of_join, lan_known, qualification, work_exp,
        note, address, perm_address, fac_link, twi_link, link_link, inst_link,
        img_src, resume_src, letter_src, created_at, updated_at
      )
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `;

    await connection.query(sql2, [
      userId,
      data.role,
      data.department,
      data.designation,
      data.gender,
      data.blood_gp,
      data.marital_status,
      data.fat_name,
      data.mot_name,
      data.dob,
      data.date_of_join,
      data.lan_known,
      data.qualification,
      data.work_exp,
      data.note,
      data.address,
      data.perm_address,
      data.fac_link,
      data.twi_link,
      data.link_link,
      data.inst_link,
      data.img_src,
      data.resume_src,
      data.letter_src,
      new Date(),
      new Date(),
    ]);

 
    const sql3 = `
      INSERT INTO patroll_info (user_id, epf_no, basic_salary, contract_type, work_shift, work_location)
      VALUES (?,?,?,?,?,?)
    `;
    await connection.query(sql3, [
      userId,
      data.epf_no,
      data.basic_salary,
      data.contract_type,
      data.work_shift,
      data.work_location,
    ]);


    const sql6 = `
      INSERT INTO leaves_info (user_id, medical_leaves, casual_leaves, maternity_leaves, sick_leaves)
      VALUES (?,?,?,?,?)
    `;
    await connection.query(sql6, [
      userId,
      data.medical_leaves || 0,
      data.casual_leaves || 0,
      data.maternity_leaves || 0,
      data.sick_leaves || 0,
    ]);

  
    const sql4 = `
      INSERT INTO bank_info (user_id, account_name, account_num, bank_name, ifsc_code, branch_name)
      VALUES (?,?,?,?,?,?)
    `;
    await connection.query(sql4, [
      userId,
      data.account_name,
      data.account_num,
      data.bank_name,
      data.ifsc_code,
      data.branch_name,
    ]);

  
    const sql5 = `
      INSERT INTO transport_info (user_id, route, vehicle_num, pickup_point)
      VALUES (?,?,?,?)
    `;
    await connection.query(sql5, [
      userId,
      data.route,
      data.vehicle_num,
      data.pickup_point,
    ]);

 
    const sql7 = `
      INSERT INTO hostel_info (user_id, hostel, room_num)
      VALUES (?,?,?)
    `;
    await connection.query(sql7, [
      userId,
      data.hostel,
      data.room_num,
    ]);

    await connection.commit();
    await connection.release();

    return res.status(200).json({
      success: true,
      message: "Staff added successfully!",
    });

  } catch (error) {
    await connection.rollback();
    await connection.release();
    console.error("Error adding staff:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
      error: error.message,
    });
  }
};
