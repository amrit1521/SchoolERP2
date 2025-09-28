const db = require('../../config/db');


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

    if (!className || !section || !subject || !homeworkDate || !submissionDate || !description) {
      return res.status(400).json({ message: "All required fields must be provided", success: false });
    }

    const sql = `
      INSERT INTO home_work 
      (className, section, subject, homeworkDate, submissionDate, attachements, description, status, teacherId, created_at, updated_at) 
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
      message: `Homework added successfully to class ${className}`,
      homeworkId: result.insertId,
      success: true
    });
  } catch (error) {
    console.error("Error adding homework:", error);
    return res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

exports.allHomework = async (req, res) => {
  try {
    const sql = `
      SELECT 
        hw.id,
        hw.className,
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
        se.section
      FROM home_work hw
      LEFT JOIN teachers t ON hw.teacherId = t.teacher_id
      LEFT JOIN users u ON t.user_id = u.id
      LEFT JOIN class_subject su ON hw.subject = su.id
      LEFT JOIN  classSection se ON hw.section = se.id
      ORDER BY hw.created_at DESC
    `;
    const [rows] = await db.query(sql);
    return res.status(200).json({ message: 'Fetched all homework successfully!', success: true, data: rows });
  } catch (error) {
    console.error("Error fetching homework:", error);
    return res.status(500).json({ message: 'Error while fetching homework!', success: false });
  }
};


exports.getHomeworkById = async (req, res) => {
  try {
    const { id } = req.params;

    const sql = `
      SELECT 
       * FROM
      home_work
      WHERE id = ?
    `;

    const [rows] = await db.query(sql, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Homework not found", success: false });
    }

    return res.status(200).json({ message: "Homework fetched successfully", success: true, data: rows[0] });
  } catch (error) {
    console.error("Error fetching homework by ID:", error);
    return res.status(500).json({ message: "Internal Server Error", success: false });
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
      SET className = ?, section = ?, subject = ?, homeworkDate = ?, submissionDate = ?, attachements = ?, 
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
      return res.status(404).json({ message: "Homework not found", success: false });
    }

    return res.status(200).json({ message: "Homework updated successfully", success: true });
  } catch (error) {
    console.error("Error updating homework:", error);
    return res.status(500).json({ message: "Internal Server Error", success: false });
  }
};


exports.deleteHomework = async (req, res) => {
  try {
    const { id } = req.params;

    const sql = `DELETE FROM home_work WHERE id = ?`;
    const [result] = await db.query(sql, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Homework not found", success: false });
    }

    return res.status(200).json({ message: "Homework deleted successfully", success: true });
  } catch (error) {
    console.error("Error deleting homework:", error);
    return res.status(500).json({ message: "Internal Server Error", success: false });
  }
};
