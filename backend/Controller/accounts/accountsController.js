const db = require('../../config/db');
const pdf = require('html-pdf-node');
const dayjs = require("dayjs");


// Expense Category Controller
exports.addExpenseCategory = async (req, res) => {
    try {
        let { category, description } = req.body;

        if (!category) {
            return res.status(400).json({ message: "Category name is required!", success: false });
        }

        category = category.trim();


        const [existing] = await db.query(
            "SELECT id FROM expense_category WHERE LOWER(category) = ?",
            [category.toLowerCase()]
        );

        if (existing.length > 0) {
            return res.status(400).json({
                message: "Category already exists!",
                success: false,
            });
        }


        const [result] = await db.query(
            "INSERT INTO expense_category (category, description) VALUES (?, ?)",
            [category, description || null]
        );

        return res.status(201).json({
            message: "Expense Category added successfully",
            success: true,
            id: result.insertId,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to add Expense Category!",
            success: false,
            error: error.message,
        });
    }
};


exports.getExpenseCategories = async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT id, category, description FROM expense_category ORDER BY id ASC"
        );
        return res.status(200).json({ success: true, data: rows });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to fetch Expense Categories!",
            success: false,
            error: error.message,
        });
    }
};


exports.getExpenseCategoryById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query(
            "SELECT category, description FROM expense_category WHERE id = ?",
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Expense Category not found", success: false });
        }

        return res.status(200).json({ success: true, data: rows[0] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to fetch Expense Category!",
            success: false,
            error: error.message,
        });
    }
};


exports.updateExpenseCategory = async (req, res) => {
    const { id } = req.params;
    let { category, description } = req.body;

    if (!category) {
        return res.status(400).json({ message: "Category name is required!", success: false });
    }

    try {
        category = category.trim();


        const [duplicate] = await db.query(
            "SELECT id FROM expense_category WHERE LOWER(category) = ? AND id != ?",
            [category.toLowerCase(), id]
        );

        if (duplicate.length > 0) {
            return res.status(400).json({
                message: "Another category with the same name already exists!",
                success: false,
            });
        }

        const [result] = await db.query(
            "UPDATE expense_category SET category = ?, description = ? WHERE id = ?",
            [category, description || null, id]
        );

        return res.status(200).json({ message: "Expense Category updated successfully", success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to update Expense Category!",
            success: false,
            error: error.message,
        });
    }
};


exports.deleteExpenseCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query(
            "DELETE FROM expense_category WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Expense Category not found", success: false });
        }

        return res.status(200).json({ message: "Expense Category deleted successfully", success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to delete Expense Category!",
            success: false,
            error: error.message,
        });
    }
};

exports.expCatForOption = async (req, res) => {

    try {

        const sql = `
        SELECT 
        id,
        category
        FROM 
        expense_category
        `
        const [rows] = await db.query(sql)

        return res.status(200).json({
            message: "Expense categories fetched successfully for option!",
            success: true,
            data: rows,
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "internal server error ", success: false, error: error.message })
    }
}


// expense
exports.addExpense = async (req, res) => {
    try {
        let { name, mobile, email, expenseName, category, date, amount, invoiceNo, paymentMethod, description, status } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({ message: "Name is required!", success: false });
        } else if (name.trim().length < 3) {
            return res.status(400).json({ message: "Name must be at least 3 characters!", success: false });
        }
        const mobileRegex = /^(?:\+91|91|0)?[6-9]\d{9}$/;
        if (!mobile || !mobile.trim()) {
            return res.status(400).json({ message: "Mobile number is required!", success: false });
        } else if (!mobileRegex.test(mobile)) {
            return res.status(400).json({ message: "Enter a valid 10-digit mobile number!", success: false });
        }
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (email && !emailRegex.test(email)) {
            return res.status(400).json({ message: "Enter a valid email address!", success: false });
        }


        if (!expenseName || !expenseName.trim()) {
            return res.status(400).json({ message: "Expense Name is required!", success: false });
        }


        if (!category) {
            return res.status(400).json({ message: "Category is required!", success: false });
        }


        if (!date) {
            return res.status(400).json({ message: "Date is required!", success: false });
        }


        if (!amount || amount <= 0) {
            return res.status(400).json({ message: "Amount must be greater than 0!", success: false });
        }


        if (!invoiceNo || invoiceNo <= 0) {
            return res.status(400).json({ message: "Invoice No must be greater than 0!", success: false });
        }

        if (!paymentMethod || !paymentMethod.trim()) {
            return res.status(400).json({ message: "Payment Method is required!", success: false });
        }

        const newDate = dayjs(date).format("YYYY-MM-DD");

        const [result] = await db.query(
            `INSERT INTO expense 
      (name, mobile, email, exp_name, category_id, date, amount, invoice_no, payment_method, description, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name.trim(), mobile.trim(), email || null, expenseName.trim(), category, newDate, amount, invoiceNo, paymentMethod.trim(), description || "", status ?? "1"]
        );

        return res.status(201).json({
            message: "Expense added successfully",
            success: true,
            id: result.insertId,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};


exports.getExpenses = async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT 
        e.id,
        e.name,
        e.mobile,
        e.email,
        e.exp_name AS expenseName,
        e.date,
        e.amount,
        e.invoice_no AS invoiceNo,
        e.payment_method AS paymentMethod,
        e.description,
        ec.category
       FROM expense e 
       LEFT JOIN expense_category ec ON e.category_id = ec.id
       ORDER BY e.id DESC`
        );

        return res.status(200).json({ success: true, data: rows });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

exports.getExpenseById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query(
            `SELECT id, name, mobile, email, exp_name, category_id, date, amount, invoice_no, payment_method, description, status
       FROM expense WHERE id = ?`,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Expense not found", success: false });
        }

        return res.status(200).json({ success: true, data: rows[0] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};


exports.updateExpense = async (req, res) => {
    const { id } = req.params;
    let { name, mobile, email, expenseName, category, date, amount, invoiceNo, paymentMethod, description, status } = req.body;


    if (!name || !name.trim()) {
        return res.status(400).json({ message: "Name is required!", success: false });
    } else if (name.trim().length < 3) {
        return res.status(400).json({ message: "Name must be at least 3 characters!", success: false });
    }

    const mobileRegex = /^(?:\+91|91|0)?[6-9]\d{9}$/;
    if (!mobile || !mobile.trim()) {
        return res.status(400).json({ message: "Mobile number is required!", success: false });
    } else if (!mobileRegex.test(mobile)) {
        return res.status(400).json({ message: "Enter a valid 10-digit mobile number!", success: false });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (email && !emailRegex.test(email)) {
        return res.status(400).json({ message: "Enter a valid email address!", success: false });
    }

    if (!expenseName || !expenseName.trim()) {
        return res.status(400).json({ message: "Expense Name is required!", success: false });
    }
    if (!category) {
        return res.status(400).json({ message: "Category is required!", success: false });
    }
    if (!date) {
        return res.status(400).json({ message: "Date is required!", success: false });
    }
    if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Amount must be greater than 0!", success: false });
    }
    if (!invoiceNo || invoiceNo <= 0) {
        return res.status(400).json({ message: "Invoice No must be greater than 0!", success: false });
    }
    if (!paymentMethod || !paymentMethod.trim()) {
        return res.status(400).json({ message: "Payment Method is required!", success: false });
    }

    try {
        const newDate = dayjs(date).format("YYYY-MM-DD");

        const [result] = await db.query(
            `UPDATE expense SET 
        name = ?, 
        mobile = ?, 
        email = ?, 
        exp_name = ?, 
        category_id = ?, 
        date = ?, 
        amount = ?, 
        invoice_no = ?, 
        payment_method = ?, 
        description = ?, 
        status = ?
      WHERE id = ?`,
            [name.trim(), mobile.trim(), email || null, expenseName.trim(), category, newDate, amount, invoiceNo, paymentMethod.trim(), description || "", status ?? "1", id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Expense not found", success: false });
        }

        return res.status(200).json({ message: "Expense updated successfully", success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};


exports.deleteExpense = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query("DELETE FROM expense WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Expense not found", success: false });
        }

        return res.status(200).json({ message: "Expense deleted successfully", success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};


function buildExpenseInvoiceHTML(expense) {
    const formattedDate = dayjs(expense.date).format("DD MMM YYYY");
    const generatedOn = dayjs().format("DD MMM YYYY HH:mm");
    const discount = expense.discount || 0;
    const tax = expense.tax || 0;
    const subtotal = Number(expense.amount);
    const total = subtotal - discount + tax;

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Invoice ${expense.invoiceNo}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Arial', sans-serif; background: #f6f6f6; color: #333; font-size: 12px; }
    .container { position: relative; width: 700px; margin: 20px auto; background: #fff; padding: 25px; border: 1px solid #ddd; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .header .logo { height: 50px; }
    .header .school-info { font-size: 14px; }
    .header .school-info strong { font-size: 16px; }
    .invoice-title { text-align: right; }
    .invoice-title h1 { font-size: 20px; color: #1a73e8; margin-bottom: 5px; }
    .status { font-weight: bold; color: ${expense.status === "1" ? "#28a745" : "#dc3545"}; }
    .bill-to { margin-top: 10px; margin-bottom: 20px; font-size: 13px;  padding: 10px; border-radius: 5px; }
    .bill-to strong { color: #1a73e8; }
    table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 12px; }
    table th, table td { border: 1px solid #ccc; padding: 8px; text-align: left; }
    table th { background: #f2f2f2; }
    .totals { margin-top: 10px; width: 100%; }
    .totals table { width: 40%; float: right; border: none; }
    .totals td { border: none; padding: 5px; }
    .totals .total-row td { font-weight: bold; border-top: 1px solid #333; font-size: 14px; }
    .notes { margin-top: 30px; font-size: 11px; color: #555; line-height: 1.4; }
     /* signatures - single row, left/right */
    .signatures { margin-top: 45px; display: flex; justify-content: space-between; gap: 16px; align-items: flex-end; width:100%}
    .sign-box { width: 48%; text-align: left; }
    
    .sign-caption { margin-top: 6px; font-size: 12px; color: #333; }

    .footer { margin-top: 25px; font-size: 11px; color: #777; text-align: center; border-top: 1px solid #ddd; padding-top: 10px; }
  </style>
</head>
<body>
  <div class="container">
    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT67H4dzxyvYcZKpFSLzX5eZNotkQcZw7noNg&s"
         style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%);
                width:400px; height:400px; opacity:0.07; filter:blur(1px); z-index:0;" />
    <div class="content" style="position:relative; z-index:1;">
      <!-- Header -->
      <div class="header">
        <div style="display:flex; align-items:center;">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT67H4dzxyvYcZKpFSLzX5eZNotkQcZw7noNg&s" alt="School Logo" class="logo"/>
          <div class="school-info" style="margin-left:10px;">
            <strong>Little Flower School , Gkp</strong><br/>
            123 Education Street, Springfield, State 123456<br/>
            Phone: +91 9876543210 | Email: contact@springfield.edu
          </div>
        </div>
        <div class="invoice-title">
          <h1>INVOICE</h1>
          <div>Invoice No: INV${expense.invoiceNo}</div>
          <div>Date: ${formattedDate}</div>
          <div class="status">${expense.status === "1" ? "Paid" : "Pending"}</div>
        </div>
      </div>

      <!-- Bill To Section -->
      <div class="bill-to">
        <strong>Bill To:</strong><br/>
        ${expense.name}<br/>
        Mobile: ${expense.mobile}<br/>
        ${expense.email ? `Email: ${expense.email}` : ""}
      </div>

      <!-- Expense Details -->
      <h2 style="font-size:14px; color:#1a73e8; margin-bottom:5px;">Expense Details</h2>
      <table>
        <tbody>
          <tr><td style="font-weight:600">Expense Name</td><td>${expense.expenseName}</td></tr>
          <tr><td style="font-weight:600">Category</td><td>${expense.category}</td></tr>
          <tr><td style="font-weight:600">Payment Method</td><td>${expense.paymentMethod}</td></tr>
          <tr><td style="font-weight:600">Description</td><td>${expense.description || "-"}</td></tr>
        </tbody>
      </table>

      <!-- Amount Table -->
      <h2 style="font-size:14px; color:#1a73e8; margin-bottom:5px;">Amount</h2>
      <table>
        <thead>
          <tr><td>Description</td><td>Amount (₹)</td></tr>
        </thead>
        <tbody>
          <tr>
            <td>${expense.description || expense.expenseName}</td>
            <td>${subtotal.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      <!-- Totals -->
      <div class="totals">
        <table>
          <tr><td>Subtotal:</td><td>₹${subtotal.toFixed(2)}</td></tr>
          <tr><td>Discount:</td><td>₹${discount.toFixed(2)}</td></tr>
          <tr><td>Tax:</td><td>₹${tax.toFixed(2)}</td></tr>
          <tr class="total-row"><td>Total:</td><td>₹${total.toFixed(2)}</td></tr>
        </table>
      </div>

      <!-- Notes -->
      <div class="notes">
        <strong>Notes:</strong><br/>
        1. This is an expense record for accounting purposes.<br/>
        2. Contact accounts@springfield.edu for any queries.
      </div>

     <!-- signatures row (left school, right receiver) -->
      <div class="signatures">
        <div class="sign-box">
          <span class="sign-line"></span>
          <div class="sign-caption"><strong>Authorized Signature</strong><br/><small>Little Flower School</small></div>
        </div>

        <div class="sign-box" style="text-align:right;">
          <span class="sign-line" style="margin-left:auto; display:inline-block; width:60%;"></span>
          <div class="sign-caption"><strong>Receiver's Signature</strong><br/><small>Received By</small></div>
        </div>
      </div>

      <div class="footer">
        Generated on ${generatedOn} | &copy; ${new Date().getFullYear()} Springfield Academy. All rights reserved.
        <p style="margin-top:5px">Thanks for your Business</p>
      </div>
    </div>
  </div>
</body>
</html>
`;
}


exports.generateExpenseInvoice = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await db.query(
            `SELECT 
        e.id,
        e.name,
        e.mobile,
        e.email,
        e.exp_name AS expenseName,
        e.date,
        e.amount,
        e.invoice_no AS invoiceNo,
        e.payment_method AS paymentMethod,
        e.description,
        e.status,
        ec.category
      FROM expense e
      LEFT JOIN expense_category ec ON e.category_id = ec.id
      WHERE e.id = ?`,
            [id]
        );

        if (!rows.length) return res.status(404).send("Expense not found");

        const expense = rows[0];
        const html = buildExpenseInvoiceHTML(expense);

        const options = {
            format: "A4",
            margin: { top: "20mm", bottom: "20mm", left: "15mm", right: "15mm" },
        };
        const file = { content: html };

        const pdfBuffer = await pdf.generatePdf(file, options);

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `inline; filename="expense-invoice-${expense.invoiceNo}.pdf"`
        );
        res.setHeader("Content-Length", pdfBuffer.length);

        return res.send(pdfBuffer);
    } catch (error) {
        console.error("Invoice generation error:", error);
        return res.status(500).send("Internal server error");
    }
};

// income
exports.addIncome = async (req, res) => {
    try {
        let { incomeName, source, date, amount, invoiceNo, paymentMethod, description, status } = req.body;
        if (!incomeName || !incomeName.trim()) {
            return res.status(400).json({ message: "Income Name is required!", success: false });
        }
        if (!source || !source.trim()) {
            return res.status(400).json({ message: "Source is required!", success: false });
        }
        if (!date) {
            return res.status(400).json({ message: "Date is required!", success: false });
        }
        if (!amount || amount <= 0) {
            return res.status(400).json({ message: "Amount must be greater than 0!", success: false });
        }
        if (!invoiceNo || invoiceNo <= 0) {
            return res.status(400).json({ message: "Invoice No must be greater than 0!", success: false });
        }
        if (!paymentMethod || !paymentMethod.trim()) {
            return res.status(400).json({ message: "Payment Method is required!", success: false });
        }

        incomeName = incomeName.trim();
        source = source.trim();
        const newDate = dayjs(date).format('YYYY-MM-DD');

        const [result] = await db.query(
            `INSERT INTO income 
            (inc_name, source, date, amount, invoice_no, payment_method, description, type , status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, 'income' ,?)`,
            [incomeName, source, newDate, amount, invoiceNo, paymentMethod, description || "", status ?? '1']
        );

        return res.status(201).json({
            message: "Income added successfully",
            success: true,
            id: result.insertId,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};


exports.getIncomes = async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT 
                id,
                inc_name AS incomeName,
                source,
                date,
                amount,
                invoice_no AS invoiceNo,
                payment_method AS paymentMethod,
                description
            FROM income
            WHERE type = 'income'
            ORDER BY id DESC`
        );
        return res.status(200).json({ success: true, data: rows });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};


exports.getIncomeById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query(
            `SELECT id, inc_name AS incomeName, source, date, amount, invoice_no AS invoiceNo, payment_method AS paymentMethod, description ,status
            FROM income 
            WHERE id = ?`,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Income not found", success: false });
        }
        return res.status(200).json({ success: true, data: rows[0] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};


exports.updateIncome = async (req, res) => {
    const { id } = req.params;
    let { incomeName, source, date, amount, invoiceNo, paymentMethod, description, status } = req.body;


    if (!incomeName || !incomeName.trim()) {
        return res.status(400).json({ message: "Income Name is required!", success: false });
    }
    if (!source || !source.trim()) {
        return res.status(400).json({ message: "Source is required!", success: false });
    }
    if (!date) {
        return res.status(400).json({ message: "Date is required!", success: false });
    }
    if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Amount must be greater than 0!", success: false });
    }
    if (!invoiceNo || invoiceNo <= 0) {
        return res.status(400).json({ message: "Invoice No must be greater than 0!", success: false });
    }
    if (!paymentMethod || !paymentMethod.trim()) {
        return res.status(400).json({ message: "Payment Method is required!", success: false });
    }

    try {
        incomeName = incomeName.trim();
        source = source.trim();
        const newDate = dayjs(date).format('YYYY-MM-DD');

        const [result] = await db.query(
            `UPDATE income SET 
                inc_name = ?, 
                source = ?, 
                date = ?, 
                amount = ?, 
                invoice_no = ?, 
                payment_method = ?, 
                description = ?, 
                status=?
            WHERE id = ?`,
            [incomeName, source, newDate, amount, invoiceNo, paymentMethod, description || "", status ?? "1", id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Income not found", success: false });
        }

        return res.status(200).json({ message: "Income updated successfully", success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};


exports.deleteIncome = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query("DELETE FROM income WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Income not found", success: false });
        }

        return res.status(200).json({ message: "Income deleted successfully", success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

function buildIncomeInvoiceHTML(income) {
    const formattedDate = dayjs(income.date).format("DD MMM YYYY");
    const generatedOn = dayjs().format("DD MMM YYYY HH:mm");
    const subtotal = Number(income.amount);
    const discount = income.discount || 0;
    const tax = income.tax || 0;
    const total = subtotal - discount + tax;

    return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Income Invoice ${income.invoiceNo}</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: 'Arial', sans-serif; background: #f6f6f6; color: #333; font-size: 12px; }
      .container { position: relative; width: 700px; margin: 20px auto; background: #fff; padding: 25px; border: 1px solid #ddd; }

      /* Tables & Header */
      .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
      .header .logo { height: 50px; }
      .header .school-info { font-size: 14px; }
      .header .school-info strong { font-size: 16px; }
      .invoice-title { text-align: right; }
      .invoice-title h1 { font-size: 20px; color: #28a745; margin-bottom: 5px; }
      .status { font-weight: bold; color: ${income.status === "1" ? "#28a745" : "#dc3545"}; }
      table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 12px; }
      table th, table td { border: 1px solid #ccc; padding: 8px; text-align: left; }
      table th { background: #f2f2f2; }
      .totals { margin-top: 10px; width: 100%; }
      .totals table { width: 40%; float: right; border: none; }
      .totals td { border: none; padding: 5px; }
      .totals .total-row td { font-weight: bold; border-top: 1px solid #333; font-size: 14px; }
      .notes { margin-top: 30px; font-size: 11px; color: #555; line-height: 1.4; }
      .signature { margin-top: 40px; display: flex; justify-content: space-between; }
      .signature div { width: 45%; text-align: center; border-top: 1px solid #aaa; padding-top: 5px; font-size: 11px; }
      .footer { margin-top: 25px; font-size: 11px; color: #777; text-align: center; border-top: 1px solid #ddd; padding-top: 10px; }
    </style>
  </head>
  <body>
    <div class="container">
      <!-- Background Logo as Watermark -->
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT67H4dzxyvYcZKpFSLzX5eZNotkQcZw7noNg&s"
           style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%);
                  width:400px; height:400px; opacity:0.07; filter:blur(1px); z-index:0;" />

      <!-- All actual content above background -->
      <div class="content" style="position:relative; z-index:1;">
        <div class="header">
          <div style="display:flex; align-items:center;">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT67H4dzxyvYcZKpFSLzX5eZNotkQcZw7noNg&s" alt="Logo" class="logo"/>
            <div class="school-info" style="margin-left:10px;">
              <strong>Little Flower School , Gkp</strong><br/>
              123 Education Street, Springfield, State 123456<br/>
              Phone: +91 9876543210 | Email: accounts@springfield.edu
            </div>
          </div>
          <div class="invoice-title">
            <h1>INCOME</h1>
            <div>Invoice No: INV${income.invoiceNo}</div>
            <div>Date: ${formattedDate}</div>
            <div class="status">${income.status === "1" ? "Received" : "Pending"}</div>
          </div>
        </div>

        <h2 style="font-size:14px; color:#28a745; margin-bottom:5px;">Income Details</h2>
        <table>
          <tbody>
            <tr><td style="font-weight:600">ID</td><td>${income.id}</td></tr>
            <tr><td style="font-weight:600">Income Name</td><td>${income.incomeName}</td></tr>
            <tr><td style="font-weight:600">Source</td><td>${income.source}</td></tr>
            <tr><td style="font-weight:600">Payment Method</td><td>${income.paymentMethod}</td></tr>
            <tr><td style="font-weight:600">Description</td><td>${income.description || "-"}</td></tr>
          </tbody>
        </table>

        <h2 style="font-size:14px; color:#28a745; margin-bottom:5px;">Amount</h2>
        <table>
          <thead>
            <tr><th>Description</th><th>Amount (₹)</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>${income.description || income.incomeName}</td>
              <td>${subtotal.toFixed(2)}</td>
               
            </tr>
          </tbody>
        </table>

        <div class="totals">
          <table>
            <tr class="total-row"><td>Subtotal:</td><td>₹${subtotal.toFixed(2)}</td></tr>
            <tr><td>Discount:</td><td>₹${discount.toFixed(2)}</td></tr>
            <tr><td>Tax:</td><td>₹${tax.toFixed(2)}</td></tr>
            <tr class="total-row"><td>Total:</td><td>₹${total.toFixed(2)}</td></tr>
          
          </table>
        </div>

        <div class="notes">
          <strong>Notes:</strong><br/>
          1. This is an income record for accounting purposes.<br/>
          2. Payment received is confirmed and recorded.<br/>
          3. Contact accounts@springfield.edu for any queries.
        </div>

        <div class="signature">
          <div>Authorized Signature</div>
          <div>Receiver Signature</div>
        </div>

        <div class="footer">
          Generated on ${generatedOn} | &copy; ${new Date().getFullYear()} Springfield Academy. All rights reserved.
           <p>Thanks for your Business</p>
        </div>
      </div>
    </div>
  </body>
</html>
  `;
}


exports.generateIncomeInvoice = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await db.query(
            `SELECT 
                i.id,
                i.inc_name AS incomeName,
                i.source,
                i.date,
                i.amount,
                i.invoice_no AS invoiceNo,
                i.payment_method AS paymentMethod,
                i.description,
                i.status
            FROM income i
            WHERE i.id = ?`,
            [id]
        );

        if (!rows.length) return res.status(404).send("Income not found");

        const income = rows[0];
        const html = buildIncomeInvoiceHTML(income);

        const options = { format: 'A4', margin: { top: "20mm", bottom: "20mm", left: "15mm", right: "15mm" } };
        const file = { content: html };

        const pdfBuffer = await pdf.generatePdf(file, options);

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `inline; filename="income-invoice-${income.invoiceNo}.pdf"`
        );
        res.setHeader("Content-Length", pdfBuffer.length);

        return res.send(pdfBuffer);

    } catch (error) {
        console.error("Income invoice generation error:", error);
        return res.status(500).send("Internal server error");
    }
};


// TRANSCTION CONTROLLER
exports.transactionsData = async (req, res) => {
    try {
        const sql = `
      SELECT 
      id,
        exp_name AS source,
        date,
        amount,
        payment_method AS method,
        type,
        status
      FROM expense
      UNION ALL
      SELECT 
      id,
        inc_name AS source,
        date,
        amount,
        payment_method AS method,
        type,
        status
      FROM income
      ORDER BY date DESC
    `;

        const [rows] = await db.query(sql);
        return res.status(200).json({
            message: "All transaction data!",
            data: rows,
            success: true,
        });

    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ message: "Internal server error", success: false });
    }
};



