
const db = require('../../config/db')
const dayjs = require('dayjs')

exports.applySalary = async (req, res) => {
  try {
    const { id } = req.params;
    const { apply_date, salary_month, type , notes } = req.body;
    console.log(type)

    if (!id) {
      return res.status(400).json({ message: "Employee ID is required!", success: false });
    }

    if (!apply_date || !salary_month) {
      return res.status(400).json({ message: "Apply date & Salary month are required!", success: false });
    }

    const formattedMonth = dayjs(salary_month).format("YYYY-MM-DD");

 
    const checkSql = `
      SELECT id FROM payment_salary 
      WHERE employee_id = ? AND salary_month = ?
    `;
    const [exists] = await db.query(checkSql, [id, formattedMonth]);

    if (exists.length > 0) {
      return res.status(400).json({
        message: "Salary for this month has already been applied by this employee.",
        success: false,
      });
    }

  
    let employeeData = null;

    if (type === "staff") {
      const sql = `
        SELECT 
          s.id AS employee_id,
          u.firstname,
          u.lastname,
          u.mobile AS phone,
          u.roll_id AS role_id,
          r.role_name,
          dp.name AS department,
          de.name AS designation,
          p.basic_salary AS gross_salary
        FROM staffs s
        LEFT JOIN users u ON s.user_id = u.id
        LEFT JOIN roles r ON u.roll_id = r.id
        LEFT JOIN department dp ON s.department = dp.id
        LEFT JOIN designation de ON s.designation = de.id
        LEFT JOIN payroll_info p ON s.user_id = p.user_id
        WHERE s.id = ?
      `;
      const [rows] = await db.query(sql, [id]);

      if (rows.length === 0) {
        return res.status(404).json({ message: "Staff not found", success: false });
      }

      employeeData = rows[0];
    }

    else if (type === "teacher") {
      const sql = `
        SELECT 
          t.teacher_id AS employee_id,
          u.firstname,
          u.lastname,
          u.mobile AS phone,
          u.roll_id AS role_id,
          r.role_name,
          dp.name AS department,
          de.name AS designation,
          p.basic_salary AS gross_salary
        FROM teachers t
        LEFT JOIN users u ON t.user_id = u.id
        LEFT JOIN roles r ON u.roll_id = r.id
        LEFT JOIN department dp ON t.department = dp.id
        LEFT JOIN designation de ON t.designation = de.id
        LEFT JOIN payroll_info p ON t.user_id = p.user_id
        WHERE t.teacher_id = ?
      `;
      const [rows] = await db.query(sql, [id]);

      if (rows.length === 0) {
        return res.status(404).json({ message: "Teacher not found", success: false });
      }

      employeeData = {
        ...rows[0],
        department: rows[0].department || "Academic",
        designation: rows[0].designation || "Teacher",
      };
    }

    else {
      return res.status(400).json({ message: "Invalid employee type!", success: false });
    }

    
    const {
      employee_id,
      role_id,
      firstname,
      lastname,
      phone,
      department,
      designation,
      gross_salary,
    } = employeeData;

    const fullName = `${firstname} ${lastname}`;
    const formattedApplyDate = dayjs(apply_date).format("YYYY-MM-DD");

    const insertSql = `
      INSERT INTO payment_salary 
      (employee_id, role_id, name, department, designation, phone, salary_month, apply_date, status, gross_salary, total_earnings, total_deductions, net_salary , notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
    `;

    const insertValues = [
      employee_id,
      role_id,
      fullName,
      department,
      designation,
      phone,
      formattedMonth,
      formattedApplyDate,
      "0", 
      gross_salary || 0,
      0,
      0,
      gross_salary || 0,
      notes||null
    ];

    await db.query(insertSql, insertValues);

    return res.status(201).json({
      message: "Salary application submitted successfully! Pending admin approval.",
      success: true,
    });

  } catch (error) {
    console.error("Error while applying salary:", error);
    return res.status(500).json({ message: "Internal server error!", success: false });
  }
};

exports.getAllApplySalaryDetails = async(req,res)=>{

 
    try {

        const sql = `SELECT id ,employee_id , name , department , designation , phone , status , salary_month , gross_salary AS amount FROM payment_salary `

        const [rows] = await db.query(sql)

        return res.status(200).json({message:"All applied details for details !" , success:true , data:rows})

        
    } catch (error) {
         console.log(error)
         return res.status(500).json({message:"Internal server error !" , success:false})
    }
}




