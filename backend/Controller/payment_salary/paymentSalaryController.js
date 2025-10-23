
const db = require('../../config/db')
const dayjs = require('dayjs')

exports.applySalary = async (req, res) => {
  try {
    const { id } = req.params;
    const { apply_date, salary_month, type, notes } = req.body;


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
      notes || null
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

exports.getAllApplySalaryDetails = async (req, res) => {


  try {

    const sql = `SELECT id ,employee_id , name , department , designation , phone , status , salary_month , gross_salary AS amount FROM payment_salary `

    const [rows] = await db.query(sql)

    return res.status(200).json({ message: "All applied details for details !", success: true, data: rows })


  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Internal server error !", success: false })
  }
}





exports.paySalary = async (req, res) => {
  const { id } = req.params;
  const { payment_method } = req.body;

  if (!id) {
    return res.status(400).json({
      message: "Salary ID is required!",
      success: false,
    });
  }

  if (!payment_method) {
    return res.status(400).json({
      message: "Payment method is required!",
      success: false,
    });
  }

  try {

    const paidDate = dayjs().format("YYYY-MM-DD HH:mm:ss");


    const [result] = await db.query(
      `UPDATE payment_salary 
       SET status = ?, paid_date = ?, payment_method = ? 
       WHERE id = ?`,
      ["1", paidDate, payment_method, id]
    );


    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "No salary record found with this ID!",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Salary has been successfully paid!",
      success: true,
    });
  } catch (error) {
    console.error("Error while paying salary:", error);
    return res.status(500).json({
      message: "Internal server error!",
      success: false,
    });
  }
};



exports.getSalaryById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Salary ID is required!", success: false });
  }

  try {
    const sql = `
      SELECT 
        ps.id,
        ps.employee_id,
        ps.name,
        ps.salary_month,
        ps.status,
        ps.payment_method,
        ps.paid_date,
        ps.apply_date,
        ps.net_salary,
        ps.notes,
        CASE 
          WHEN ps.status = '1' THEN 'Paid'
          ELSE 'Generated'
        END AS status_label,
        r.role_name
      FROM payment_salary ps
      LEFT JOIN roles r ON ps.role_id = r.id
      WHERE ps.id = ?
    `;

    const [rows] = await db.query(sql, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Salary record not found!", success: false });
    }

    return res.status(200).json({
      message: "Salary details fetched successfully!",
      success: true,
      data: rows[0],
    });
  } catch (error) {
    console.log("Error fetching salary details:", error);
    return res.status(500).json({ message: "Internal server error!", success: false });
  }
};

exports.getSalaryDetailsByTeacherStaffId = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      message: "Staff/Teacher ID is required!",
      success: false,
    });
  }

  try {
  
    const salarySql = `
      SELECT 
        id,
        salary_month,
        payment_method,
        paid_date,
        gross_salary,
        total_earnings,
        total_deductions,
        net_salary
      FROM payment_salary
      WHERE employee_id = ? AND status = '1'
      ORDER BY salary_month DESC
    `;
    const [salaryRows] = await db.query(salarySql, [id]);

   
    if (salaryRows.length === 0) {
      return res.status(200).json({
        message: "No paid salary records found for this employee.",
        success: true,
        data: [],
        totals: {
          total_gross_salary: 0,
          total_net_salary: 0,
          total_deductions: 0,
          total_earnings: 0,
        },
      });
    }

   
    const totalSql = `
      SELECT 
        COALESCE(SUM(gross_salary), 0) AS total_gross_salary,
        COALESCE(SUM(net_salary), 0) AS total_net_salary,
        COALESCE(SUM(total_deductions), 0) AS total_deductions,
        COALESCE(SUM(total_earnings), 0) AS total_earnings
      FROM payment_salary
      WHERE employee_id = ? AND status = '1'
    `;
    const [totalRows] = await db.query(totalSql, [id]);

    const totals = totalRows[0];

  
    return res.status(200).json({
      message: "Salary details fetched successfully!",
      success: true,
      data: salaryRows,
      totals,
    });
  } catch (error) {
    console.error("Error fetching salary details:", error);
    return res.status(500).json({
      message: "Internal server error!",
      success: false,
    });
  }
};







