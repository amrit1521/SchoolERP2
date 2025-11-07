const db = require('../../config/db')

exports.addTimeTable = async (req, res) => {
  const connection = await db.getConnection()

  try {
    await connection.beginTransaction()
    const data = req.body;

    const sql = `INSERT INTO timetable (day,class, section, subject, teacher, timefrom, timeto) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`

    const [result] = await connection.query(sql, [
      data.day,
      data.class,
      data.section,
      data.subject,
      data.teacher,
      data.timefrom,
      data.timeto,

    ])


    await connection.commit()

    return res.status(201).json({
      message: "Timetable entry added successfully",
      success: true,
      timetableId: result.insertId
    })

  } catch (error) {
    await connection.rollback()
    return res.status(500).json({ message: "Internal server error", success: false, error: error.message })
  } finally {
    connection.release()
  }
}

exports.getTimeTable = async (req, res) => {
  try {

    // aage future me esi ka use akrenge jab espe kam akrenge tb
    //  const sql = `SELECT 
    //              tt.id,
    //              tt.day,
    //              tt.teacher,
    //              tt.class,
    //              tt.section,
    //              tt.subject,
    //              tt.timeto,
    //              tt.timefrom,
    //              t.img_src,
    //              u.firstname,
    //              u.lastname
    //              FROM timetable tt
    //              LEFT JOIN teachers t ON tt.teacher = t.user_id
    //              LEFT JOIN users u ON tt.teacher =u.id

    //      `

    // 2️⃣ Get timetable for that class + section
    // const [timetableRows] = await db.query(`SELECT * FROM timetable ORDER BY day, timefrom`);
    const [timetableRows] = await db.query(`SELECT * FROM timetable ORDER BY day, timefrom`);


    return res.status(200).json({
      success: true,
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

exports.getTimeTableSpecClass = async (req, res) => {
  try {
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
    const studentClass = student.class_id;
    const section = student.section_id;
    
    const [timetableRows] = await db.query(`SELECT * FROM timetable WHERE class=? and section=? ORDER BY day, timefrom`,[studentClass,section]);

    return res.status(200).json({
      success: true,
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

exports.filterTimeTable = async (req, res) => {
  const data = req.body;


  if (!data.class || !data.section) {
    return res.status(400).json({
      success: false,
      message: "Both class and section are required",
    });
  }

  try {
    const sql = `
      SELECT *
      FROM timetable
      WHERE \`class\` = ? AND section = ?
      ORDER BY day, timefrom
    `;

    const [rows] = await db.query(sql, [data.class, data.section]);

    return res.status(200).json({
      success: true,
      message: "Filtered timetable fetched successfully",
      data: rows,
    });
  } catch (error) {
    console.error("Error filtering timetable:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

