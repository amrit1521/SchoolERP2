const db = require("../../config/db");

exports.getParentDataByParentId = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "user Not found!", success: false });
  }

  try {
    const sql = `
            SELECT 
                p.id,
                p.name,
                p.email,
                p.phone_num,
                p.img_src,
                p.created_at AS Parent_Add,
                p.relation
            FROM parents_info p   
            WHERE p.parent_id = ? and relation="Father"`;
    const sql2 = `SELECT
                       s.stu_id,
                        s.admissionnum,
                        s.rollnum,
                        s.stu_img,
                        s.gender,
                        s.class_id,
                        s.section_id,
                        UPPER(c.class_name) AS class,
                        UPPER( se.section_name) AS section,
                        CONCAT(u.firstname,' ',u.lastname) as name,
                        s.created_at AS Student_Add,
                        s.admissiondate
                     from students s
                     LEFT JOIN users u ON u.id = s.stu_id
                     LEFT JOIN classes c ON s.class_id = c.id
                     LEFT JOIN sections se ON s.section_id = se.id
                     where s.parent_id=?`;

    console.log("userId: ", userId);
    const [parent] = await db.query(sql, [userId]);
    const [students] = await db.query(sql2, [userId]);

    if (parent.length === 0) {
      return res
        .status(404)
        .json({ message: "Parent not found!", success: false });
    }

    const result = {
      ...parent[0],
      child: students,
    };

    return res.status(200).json({
      message: "Parent fetched successfully!",
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("getParentDataByParentId Error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error!", success: false });
  }
};

exports.getAvailableLeave = async (req, res) => {
  try {
    const {userId} = req.params;
    if (!userId) {
      return res
        .status(400)
        .json({ message: "user Not found!", success: false });
    }
    const sql = `SELECT li.medical_leaves, li.casual_leaves from leaves_info li where li.user_id = ?`;
    const [rows] = await db.query(sql, [userId]);
    console.log('rows : ',rows);
    if (rows.length == 0) {
      return res
        .status(200)
        .json({ message: "total leaves not found!", success: false });
    }
    return res.status(200).json({
      message: "total leaves available fetched successfully!",
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("getAvailableLeave Error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error!", success: false });
  }
};



exports.getAllStudentsOfParents = async (req, res) => {
  try {
    const {userId} = req.params;
    if (!userId) {
         return res.status(400).json({ message: "user Not found!", success: false });
    }
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
            WHERE s.parent_id=?
        `;

    const [students] = await db.query(sql,[userId]);

    res.status(200).json({
      message: "Students fetched successfully",
      success: true,
      students,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error!", success: false });
  }
};