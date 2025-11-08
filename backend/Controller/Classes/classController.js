const db = require("../../config/db");


// Add Class
exports.addClass = async (req, res) => {
  const { className, status } = req.body;

  try {
    if (!className) {
      return res
        .status(403)
        .json({ message: "Class name is required!", success: false });
    }

    const finalStatus = status ?? 1;

    const sql = `INSERT INTO classes (class_name, status) VALUES (?, ?)`;
    await db.query(sql, [className, finalStatus]);

    return res
      .status(201)
      .json({ message: "Class added successfully!", success: true });
  } catch (error) {
    console.error("Error adding class:", error);
    return res
      .status(500)
      .json({ message: "Error while adding class!", success: false });
  }
};
exports.getClasses = async (req, res) => {
  try {
    const sql = `SELECT id, class_name AS className, status FROM classes ORDER BY id ASC`;
    const [rows] = await db.query(sql);

    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error("Error fetching classes:", error);
    return res
      .status(500)
      .json({ message: "Error while fetching classes!", success: false });
  }
};

exports.getClassById = async (req, res) => {
  const { id } = req.params;

  try {
    const sql = `SELECT id, class_name AS className, status FROM classes WHERE id = ?`;
    const [rows] = await db.query(sql, [id]);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Class not found!", success: false });
    }

    return res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error("Error fetching class:", error);
    return res
      .status(500)
      .json({ message: "Error while fetching class!", success: false });
  }
};

exports.updateClass = async (req, res) => {
  const { id } = req.params;
  const { className, status } = req.body;

  try {
    const finalStatus = status ?? 1;

    const sql = `UPDATE classes SET class_name = ?, status = ? WHERE id = ?`;
    const [result] = await db.query(sql, [className, finalStatus, id]);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Class not found!", success: false });
    }

    return res
      .status(200)
      .json({ message: "Class updated successfully!", success: true });
  } catch (error) {
    console.error("Error updating class:", error);
    return res
      .status(500)
      .json({ message: "Error while updating class!", success: false });
  }
};

exports.deleteClass = async (req, res) => {
  const { id } = req.params;

  try {
    const sql = `DELETE FROM classes WHERE id = ?`;
    const [result] = await db.query(sql, [id]);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Class not found!", success: false });
    }

    return res
      .status(200)
      .json({ message: "Class deleted successfully!", success: true });
  } catch (error) {
    console.error("Error deleting class:", error);
    return res
      .status(500)
      .json({ message: "Error while deleting class!", success: false });
  }
};

// class room-------------------------------------------------

exports.addClassRoom = async (req, res) => {
  try {
    const { room_no, capacity, status } = req.body;

    // Validation
    if (!room_no || !capacity) {
      return res.status(400).json({ success: false, message: "Room No and Capacity are required" });
    }

    if (capacity > 40) {
      return res.status(400).json({ success: false, message: "Maximum capacity is 40 students" });
    }

    // Check duplicate room
    const [existing] = await db.query("SELECT * FROM class_room WHERE room_no = ?", [room_no]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: "Room No already exists" });
    }

    // Insert new classroom
    await db.query(
      "INSERT INTO class_room (room_no, capacity, status) VALUES (?, ?, ?)",
      [room_no, capacity, status || "1"]
    );

    return res.status(201).json({ success: true, message: "Classroom added successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getAllClassRooms = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM class_room ORDER BY id DESC");
    return res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getClassRoomById = async (req, res) => {
  try {
    const { id } = req.params;

    // Query
    const [rows] = await db.query("SELECT * FROM class_room WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Classroom not found" });
    }

    return res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.updateClassRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { room_no, capacity, status } = req.body;

    if (capacity && capacity > 40) {
      return res.status(400).json({ success: false, message: "Maximum capacity is 40 students" });
    }

    if (room_no) {
      const [existing] = await db.query("SELECT * FROM class_room WHERE room_no = ? AND id != ?", [room_no, id]);
      if (existing.length > 0) {
        return res.status(400).json({ success: false, message: "Room No already exists" });
      }
    }

    await db.query(
      "UPDATE class_room SET room_no = ?, capacity = ?, status = ? WHERE id = ?",
      [room_no, capacity, status, id]
    );

    return res.json({ success: true, message: "Classroom updated successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.deleteClassRoom = async (req, res) => {
  try {
    const { id } = req.params;


    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        message: "Invalid classroom ID",
      });
    }


    const [rows] = await db.query("SELECT * FROM class_room WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Classroom not found",
      });
    }


    await db.query("DELETE FROM class_room WHERE id = ?", [id]);

    return res.status(200).json({
      success: true,
      message: `Classroom with ID ${id} deleted successfully`,
    });
  } catch (err) {
    console.error("Error deleting classroom:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// class routine ---------------------------------------------------------------------------------------------------------

async function hasOverlap(classRoom, day, startTime, endTime, excludeId = null) {
  let query = `
    SELECT * FROM class_routine 
    WHERE classRoom = ? 
      AND day = ?
      AND (
        (startTime < ? AND endTime > ?) OR
        (startTime < ? AND endTime > ?) OR
        (startTime >= ? AND endTime <= ?)
      )
  `;

  let params = [classRoom, day, endTime, endTime, startTime, startTime, startTime, endTime];

  if (excludeId) {
    query += " AND id != ?";
    params.push(excludeId);
  }

  const [rows] = await db.query(query, params);
  return rows.length > 0;
}

exports.addClassRoutine = async (req, res) => {
  try {
    const { teacher, className, classRoom, day, startTime, endTime, section, status } = req.body;

    if (!teacher || !className || !classRoom || !day || !startTime || !endTime || !section) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (await hasOverlap(classRoom, day, startTime, endTime)) {
      return res.status(409).json({ success: false, message: "This time slot is already occupied. Choose another time." });
    }

    const [result] = await db.query(
      `INSERT INTO class_routine (teacher, className, classRoom, day, startTime, endTime, section, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [teacher, className, classRoom, day, startTime, endTime, section, status || "1"]
    );

    return res.status(201).json({ success: true, message: "Class routine created", id: result.insertId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getAllClassRoutines = async (req, res) => {
  try {

    const sql = `
      SELECT 
        cr.id,
        cr.section,
        cr.day,
        cr.startTime,
        cr.endTime,
        cr.className,
        crm.room_no,
        t.subject,
        u.firstname,
        u.lastname,
        UPPER(c.class_name) AS className,
       UPPER( se.section_name) AS section
      FROM class_routine cr
      LEFT JOIN class_room crm ON cr.classRoom = crm.id
      LEFT JOIN teachers t ON cr.teacher = t.teacher_id
      LEFT JOIN users u ON t.user_id = u.id
      LEFT JOIN classes c ON cr.className = c.id
      LEFT JOIN sections se ON cr.section = se.id
      ORDER BY cr.day, cr.startTime
    `;

    const [rows] = await db.query(sql);
    return res.status(200).json({ success: true, data: rows });
  } catch (err) {
    console.error("Error fetching class routines:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getClassRoutineById = async (req, res) => {
  const { id } = req.params

  if (!id) {
    return res.status(400).json({ success: false, message: "Id not provided !" });
  }
  try {

    const sql = `
      SELECT 
      *
      FROM class_routine 
       WHERE id=?
     
    `;


    const [rows] = await db.query(sql, [id]);
    console.log(id)
    if (!rows.length) return res.status(404).json({ success: false, message: "Class routine not found" });
    return res.status(200).json({ success: true, data: rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.updateClassRoutine = async (req, res) => {
  try {
    const { teacher, className, classRoom, day, startTime, endTime, section, status } = req.body;
    const { id } = req.params

    if (!id) {
      return res.status(400).json({ success: false, message: "Id not provided !" });
    }

    if (!teacher || !className || !classRoom || !day || !startTime || !endTime || !section) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (await hasOverlap(classRoom, day, startTime, endTime, id)) {
      return res.status(409).json({ success: false, message: "This time slot is already occupied. Choose another time." });
    }

    const [result] = await db.query(
      `UPDATE class_routine 
       SET teacher=?, className=?, classRoom=?, day=?, startTime=?, endTime=?, section=?, status=?, updated_at=NOW() 
       WHERE id=?`,
      [teacher, className, classRoom, day, startTime, endTime, section, status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Class routine not found" });
    }

    return res.status(200).json({ success: true, message: "Class routine updated" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.deleteClassRoutine = async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM class_routine WHERE id=?", [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Class routine not found" });
    }
    return res.status(200).json({ success: true, message: "Class routine deleted" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

//class schedule----------------------------
function toMinutes(timeStr) {
  const [time, meridian] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  if (meridian === "PM" && hours !== 12) hours += 12;
  if (meridian === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
}
exports.addSchedule = async (req, res) => {
  const { className, startTime, endTime, status } = req.body;

  try {
    const [existing] = await db.query(
      "SELECT * FROM class_schedule WHERE className=?",
      [className]
    );

    const newStart = toMinutes(startTime);
    const newEnd = toMinutes(endTime);

    const conflict = existing.some((s) => {
      const sStart = toMinutes(s.startTime);
      const sEnd = toMinutes(s.endTime);
      return newStart < sEnd && newEnd > sStart;
    });

    if (conflict) {
      return res.status(400).json({
        success: false,
        message: "Schedule conflict: overlapping time for this class",
      });
    }

    const [result] = await db.query(
      "INSERT INTO class_schedule (className, startTime, endTime, status) VALUES (?, ?, ?, ?)",
      [className, startTime, endTime, status ?? 1]
    );

    res.status(201).json({
      success: true,
      message: "Schedule created successfully",
      id: result.insertId,
    });
  } catch (err) {
    console.error("Create Schedule Error:", err);
    res.status(500).json({ success: false, message: "Something went wrong !" });
  }
};

exports.getSchedules = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM class_schedule ORDER BY created_at DESC");
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("Get Schedules Error:", err);
    res.status(500).json({ success: false, message: "Something went wrong !" });
  }
};

exports.getScheduleById = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM class_schedule WHERE id=?", [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Schedule not found" });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error("Get Schedule Error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.updateSchedule = async (req, res) => {
  const { id } = req.params;
  const { className, startTime, endTime, status } = req.body;

  try {
    // check if exists
    const [schedule] = await db.query("SELECT * FROM class_schedule WHERE id=?", [id]);
    if (schedule.length === 0) {
      return res.status(404).json({ success: false, message: "Schedule not found" });
    }

    // check conflict (excluding self)
    const [existing] = await db.query(
      "SELECT * FROM class_schedule WHERE className=? AND id<>? AND status='1'",
      [className, id]
    );

    const newStart = toMinutes(startTime);
    const newEnd = toMinutes(endTime);

    const conflict = existing.some((s) => {
      const sStart = toMinutes(s.startTime);
      const sEnd = toMinutes(s.endTime);
      return newStart < sEnd && newEnd > sStart;
    });

    if (conflict) {
      return res.status(400).json({
        success: false,
        message: "Schedule conflict: overlapping time for this class",
      });
    }

    await db.query(
      "UPDATE class_schedule SET className=?, startTime=?, endTime=?, status=?, updated_at=NOW() WHERE id=?",
      [className, startTime, endTime, status, id]
    );

    res.json({ success: true, message: "Schedule updated successfully" });
  } catch (err) {
    console.error("Update Schedule Error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.deleteSchedule = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query("DELETE FROM class_schedule WHERE id=?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Schedule not found" });
    }
    res.json({ success: true, message: "Schedule deleted successfully" });
  } catch (err) {
    console.error("Delete Schedule Error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


// class syllabus
exports.addClassSyllabus = async (req, res) => {
  try {
    const { classId, subjectIds } = req.body;
    const file = req.file;


    if (!classId || !subjectIds || !file) {
      return res.status(400).json({
        success: false,
        message: "Class, subjects, or syllabus file missing!",
      });
    }


    const allowedTypes = ["application/pdf"];
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: "Only PDF files are allowed for syllabus upload!",
      });
    }


    let parsedSubjectIds;
    try {
      parsedSubjectIds = JSON.parse(subjectIds);
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid subjects format! Must be a valid JSON array.",
      });
    }

    if (!Array.isArray(parsedSubjectIds) || parsedSubjectIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one subject must be selected!",
      });
    }


    const [classExists] = await db.query(
      `SELECT id FROM classes WHERE id = ?`,
      [classId]
    );
    if (classExists.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid class ID! Class does not exist.",
      });
    }

    const [duplicateCheck] = await db.query(
      `SELECT id FROM class_syllabus WHERE class_id = ?`,
      [classId]
    );
    if (duplicateCheck.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Syllabus already assigned for this class!",
      });
    }

    const [validSubjects] = await db.query(
      `SELECT id FROM class_subject WHERE id IN (?)`,
      [parsedSubjectIds]
    );
    if (validSubjects.length !== parsedSubjectIds.length) {
      return res.status(400).json({
        success: false,
        message: "One or more subjects are invalid!",
      });
    }


    const filePath = file.filename;
    const values = parsedSubjectIds.map((subjectId) => [
      classId,
      subjectId,
      filePath,
    ]);

    await db.query(
      `INSERT INTO class_syllabus (class_id, subject_id, file_src) VALUES ?`,
      [values]
    );

    return res.status(200).json({
      success: true,
      message: `Syllabus uploaded successfully for ${parsedSubjectIds.length} subjects!`,
    });
  } catch (error) {
    console.error("Error in addClassSyllabus:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error!",
    });
  }
};


exports.getAllSyllabus = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        cs.id,
        cs.class_id, 
        c.class_name,
        cs.subject_id, 
        s.name AS subject_name,
        cs.file_src,
          cs.created_at
      FROM class_syllabus cs
      LEFT JOIN classes c ON cs.class_id = c.id
      LEFT JOIN class_subject s ON cs.subject_id = s.id
      ORDER BY cs.class_id DESC
    `);

    // ✅ Group data by class
    const groupedData = {};

    rows.forEach(row => {
      if (!groupedData[row.class_id]) {
        groupedData[row.class_id] = {
          class_id: row.class_id,
          class_name: row.class_name,
          file_src: row.file_src,
          created_at: row.created_at,
          subjects: []
        };
      }

      // Add subjects under that class
      groupedData[row.class_id].subjects.push({
        id: row.id,
        subject_id: row.subject_id,
        name: row.subject_name
      });
    });

    const result = Object.values(groupedData);

    return res.status(200).json({
      success: true,
      message: "Syllabus list fetched successfully!",
      data: result,
    });

  } catch (error) {
    console.error("Error in getAllSyllabus:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error!",
    });
  }
};


exports.updateClassSyllabus = async (req, res) => {
  try {
    const { id } = req.params;
    const { classId, subjectId } = req.body;
    const file = req.file;

    if (!id) {
      return res.status(400).json({ success: false, message: "Missing syllabus ID!" });
    }

    const [existing] = await db.query(`SELECT * FROM class_syllabus WHERE id = ?`, [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: "Syllabus not found!" });
    }


    const [duplicateCheck] = await db.query(
      `SELECT id FROM class_syllabus WHERE class_id = ? AND id != ?`,
      [classId, id]
    );
    if (duplicateCheck.length > 0) {
      return res.status(409).json({
        success: false,
        message: "This class already has a syllabus assigned!",
      });
    }


    const filePath = file ? file.filename : existing[0].file_src;

    await db.query(
      `UPDATE class_syllabus 
       SET class_id = ?, subject_id = ?, file_src = ?, updated_at = NOW()
       WHERE id = ?`,
      [classId, subjectId, filePath, id]
    );

    return res.status(200).json({
      success: true,
      message: "Syllabus updated successfully!",
    });
  } catch (error) {
    console.error("Error in updateClassSyllabus:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error!",
    });
  }
};

exports.updatePdfFile = async (req, res) => {
  try {
    const { classId } = req.body;
    const file = req.file;


    if (!classId || !file) {
      return res.status(400).json({
        success: false,
        message: "Class ID or syllabus file is missing!",
      });
    }


    const allowedTypes = ["application/pdf"];
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: "Only PDF files are allowed!",
      });
    }


    const [classExists] = await db.query(
      `SELECT id FROM classes WHERE id = ?`,
      [classId]
    );
    if (classExists.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Invalid class ID — class not found!",
      });
    }

    const filePath = file.filename;

    await db.query(
      `UPDATE class_syllabus SET file_src = ?, updated_at = NOW() WHERE class_id = ?`,
      [filePath, classId]
    );

    return res.status(200).json({
      success: true,
      message: "Syllabus PDF updated successfully!",
      newFile: filePath,
    });
  } catch (error) {
    console.error("Error in updatePdfFile:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error!",
      error: error.message,
    });
  }
};

exports.speDataForAClass = async (req, res) => {
  try {
    const { classId } = req.params;

    // 🧩 Validate input
    if (!classId) {
      return res.status(400).json({
        success: false,
        message: "Class ID not provided!",
      });
    }

    // 🧩 Check if class exists
    const [classCheck] = await db.query(
      `SELECT id FROM classes WHERE id = ?`,
      [classId]
    );

    if (classCheck.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Class not found!",
      });
    }

    // 🧩 Fetch subject IDs for the class
    const [subjects] = await db.query(
      `SELECT subject_id FROM class_syllabus WHERE class_id = ?`,
      [classId]
    );

    // 🧩 Extract subject IDs into an array
    const subjectIds = subjects.map((s) => s.subject_id);

    // ✅ Final response
    return res.status(200).json({
      success: true,
      message: "Fetched syllabus data successfully for this class!",
      data: {
        class_id: Number(classId),
        subjects: subjectIds,
      },
    });

  } catch (error) {
    console.error("Error in speDataForAClass:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error!",
      error: error.message,
    });
  }
};

exports.addSubjectInAClass = async (req, res) => {
  try {

    const { classId, subIds } = req.body;


    if (!classId || !subIds) {
      return res.status(400).json({
        success: false,
        message: "Please provide both class ID and subject IDs!",
      });
    }


    const [classExists] = await db.query(
      `SELECT id FROM classes WHERE id = ?`,
      [classId]
    );
    if (classExists.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Class not found!",
      });
    }


    let parsedSubjectIds;
    try {
      parsedSubjectIds = JSON.parse(subIds);
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid subjects format! Must be a valid JSON array.",
      });
    }

    if (!Array.isArray(parsedSubjectIds) || parsedSubjectIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one subject must be selected!",
      });
    }


    const [validSubjects] = await db.query(
      `SELECT id FROM class_subject WHERE id IN (?)`,
      [parsedSubjectIds]
    );
    if (validSubjects.length !== parsedSubjectIds.length) {
      return res.status(400).json({
        success: false,
        message: "One or more subject IDs are invalid!",
      });
    }


    const [existingSyllabus] = await db.query(
      `SELECT file_src FROM class_syllabus WHERE class_id = ? LIMIT 1`,
      [classId]
    );
    if (existingSyllabus.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Syllabus not found for this class! Please upload syllabus first.",
      });
    }

    const filePath = existingSyllabus[0].file_src;


    const [existingSubjects] = await db.query(
      `SELECT subject_id FROM class_syllabus WHERE class_id = ?`,
      [classId]
    );
    const alreadyAdded = existingSubjects.map((row) => row.subject_id);


    const newSubjects = parsedSubjectIds.filter(
      (id) => !alreadyAdded.includes(id)
    );

    if (newSubjects.length === 0) {
      return res.status(409).json({
        success: false,
        message: "All selected subjects already exist for this class!",
      });
    }


    const values = newSubjects.map((subjectId) => [
      classId,
      subjectId,
      filePath,
    ]);

    await db.query(
      `INSERT INTO class_syllabus (class_id, subject_id, file_src) VALUES ?`,
      [values]
    );

    return res.status(200).json({
      success: true,
      message: `Added ${newSubjects.length} new subject(s) successfully to class ID ${classId}.`,
      addedSubjects: newSubjects,
    });
  } catch (error) {
    console.error("Error in addSubjectInAClass:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error!",
      error: error.message,
    });
  }
};


exports.deleteClassSyllabus = async (req, res) => {
  try {
    const { classId } = req.params;

    if (!classId) {
      return res.status(400).json({
        success: false,
        message: "Missing class ID!",
      });
    }

    const [existing] = await db.query(
      `SELECT * FROM class_syllabus WHERE class_id = ?`,
      [classId]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No syllabus found for this class!",
      });
    }

    await db.query(`DELETE FROM class_syllabus WHERE class_id = ?`, [classId]);

    return res.status(200).json({
      success: true,
      message: `All syllabus records deleted successfully for this class !`,
    });
  } catch (error) {
    console.error("Error in deleteClassSyllabusByClass:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error!",
    });
  }
};


exports.deleteSubjectFromSyllabus = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ success: false, message: "Missing syllabus ID!" });
    }

    const [existing] = await db.query(`SELECT id FROM class_syllabus WHERE id = ?`, [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: "Subject not found for this class!" });
    }

    await db.query(`DELETE FROM class_syllabus WHERE id = ?`, [id]);

    return res.status(200).json({
      success: true,
      message: "Subject deleted successfully from this class !",
    });

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "Internal Server Error!",
    });
  }
}


// class for option master
exports.getAllClassForOption = async (req, res) => {
  try {
    const sql = `SELECT id , class_name FROM classes`
    const [rows] = await db.query(sql)

    return res.status(200).json({ message: "All classes fetched successfully !", success: true, data: rows })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Internal server error !", success: false })
  }
}


