const db = require('../../config/db');
const fs = require('fs');
const path = require('path');
const dayjs = require("dayjs");


exports.addLibraryMember = async (req, res) => {
  try {
    const data = req.body;

    if (!req.file) {
      return res.status(400).json({
        message: "Library Member Image is required!",
        success: false
      });
    }

    const [existMember] = await db.query(`SELECT * FROM librarymember WHERE email=?`, [data.email])

    if (existMember.length > 0) {
      return res.status(400).json({
        message: "User Already Exists!",
        success: false
      });
    }

    const uploadfile = req.file.filename;
    const folder = req.file.mimetype.includes("image") ? "image" : "document";

    const sql = `INSERT INTO librarymember (img_src, folder, name, cardno, email, date_of_join, phone_no) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;

    await db.query(sql, [
      uploadfile,
      folder,
      data.name,
      data.cardno,
      data.email,
      dayjs(data.date_of_join, "DD MMM YYYY").format("YYYY-MM-DD"),

      data.phone_no
    ]);

    return res.status(201).json({
      message: "Library member added successfully!",
      success: true
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Internal server error!',
      success: false
    });
  }
};

exports.allLibraryMember = async (req, res) => {
    try {
    const sql = `
      SELECT 
        sf.id AS staff_id,
        sf.img_src,
        sf.date_of_join,
        sf.cardNo,
        u.id AS user_id,
        u.firstname,
        u.lastname,
        u.mobile,
        u.email
      FROM staffs sf
      JOIN users u ON sf.user_id = u.id AND u.roll_id = 4
    `;

    const [rows] = await db.query(sql);

    return res.status(200).json({
      message: "All librarien fetched successfully!",
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching librarien details:", error);
    return res.status(500).json({
      message: "Internal server error!",
      success: false,
    });
  }
};




exports.deleteLibraryMember = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Member ID is required!",
        success: false
      });
    }

    const [rows] = await db.query(`SELECT img_src FROM librarymember WHERE id = ?`, [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Member not found!",
        success: false
      });
    }

    const imageFile = rows[0].img_src;




    if (imageFile) {
      const filePath = path.join(__dirname, "../uploads", imageFile);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting file:", err);

        }
      });
    }

    const [result] = await db.query(`DELETE FROM librarymember WHERE id = ?`, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Member not found in DB!",
        success: false
      });
    }

    return res.status(200).json({
      message: "Library Member deleted successfully!",
      success: true
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error!",
      success: false
    });
  }
};

// library book ------------------------------------------

exports.addBook = async (req, res) => {
  try {
    const {
      bookName,
      bookNo,
      rackNo,
      publisher,
      author,
      subject,
      qty,
      available,
      price,
      postDate,
      bookImg,
    } = req.body;


    if (
      !bookName ||
      !bookNo ||
      !rackNo ||
      !publisher ||
      !author ||
      !subject ||
      !qty ||
      !available ||
      !price ||
      !postDate ||
      !bookImg
    ) {
      return res.status(400).json({
        message: "All fields are required!",
        success: false,
      });
    }

    const [result] = await db.execute(
      `INSERT INTO library_book_info 
      (bookImg, bookNo, bookName, rackNo, publisher, author, subject, qty, available, price, postDate)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        bookImg,
        bookNo,
        bookName,
        rackNo,
        publisher,
        author,
        subject,
        qty,
        available,
        price,
        dayjs(postDate).format("YYYY-MM-DD"),
      ]
    );

    return res.status(201).json({
      message: "Book added successfully!",
      success: true,
      bookId: result.insertId,
    });
  } catch (error) {
    console.error("AddBook Error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error!", success: false });
  }
};

exports.getAllBooks = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT id, bookImg, bookNo, bookName, rackNo, publisher, author, subject, qty, available, price, postDate 
       FROM library_book_info 
       ORDER BY id DESC`
    );

    return res.status(200).json({
      success: true,
      count: rows.length,
      data: rows,
    });
  } catch (error) {
    console.error("GetAllBooks Error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error!", success: false });
  }
};

exports.getBookById = async (req, res) => {
  const { id } = req.params;

  if (!id)
    return res
      .status(400)
      .json({ message: "Book ID not provided!", success: false });

  try {
    const [rows] = await db.execute(
      "SELECT * FROM library_book_info WHERE id = ?",
      [id]
    );

    if (rows.length === 0)
      return res
        .status(404)
        .json({ message: "Book not found!", success: false });

    return res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error("GetBookById Error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error!", success: false });
  }
};

exports.updateBook = async (req, res) => {
  const { id } = req.params;

  if (!id)
    return res
      .status(400)
      .json({ message: "Book ID is required!", success: false });

  try {
    const {
      bookName,
      bookNo,
      rackNo,
      publisher,
      author,
      subject,
      qty,
      available,
      price,
      postDate,
      bookImg, // ✅ directly path string
    } = req.body;

    const [rows] = await db.execute(
      "SELECT * FROM library_book_info WHERE id = ?",
      [id]
    );

    if (rows.length === 0)
      return res
        .status(404)
        .json({ message: "Book not found!", success: false });

    await db.execute(
      `UPDATE library_book_info 
       SET bookNo=?, bookName=?, rackNo=?, publisher=?, author=?, subject=?, qty=?, available=?, price=?, postDate=?, bookImg=? 
       WHERE id=?`,
      [
        bookNo,
        bookName,
        rackNo,
        publisher,
        author,
        subject,
        qty,
        available,
        price,
        dayjs(postDate).format("YYYY-MM-DD"),
        bookImg, // ✅ simple path update
        id,
      ]
    );

    return res
      .status(200)
      .json({ message: "Book updated successfully!", success: true });
  } catch (error) {
    console.error("UpdateBook Error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error!", success: false });
  }
};
exports.deleteBook = async (req, res) => {
  const { id } = req.params;

  if (!id)
    return res
      .status(400)
      .json({ message: "Book ID not provided!", success: false });

  try {
    const [rows] = await db.execute(
      "SELECT * FROM library_book_info WHERE id = ?",
      [id]
    );

    if (rows.length === 0)
      return res
        .status(404)
        .json({ message: "Book not found!", success: false });

    await db.execute("DELETE FROM library_book_info WHERE id = ?", [id]);

    return res
      .status(200)
      .json({ message: "Book deleted successfully!", success: true });
  } catch (error) {
    console.error("DeleteBook Error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error!", success: false });
  }
};




// issued book ---------------------------------------------
exports.stuDataForIssueBook = async (req, res) => {

  try {

    const sql1 = `SELECT 
                 st.rollnum,
                 u.firstname,
                 u.lastname
                 FROM students st
                 JOIN users u ON st.stu_id=u.id              
    `
    const [rows] = await db.query(sql1)
    return res.status(200).json({ message: 'Student data for isssue book fetched successfully ! ', success: true, data: rows })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Internal server error !', success: false })
  }
}

exports.bookDataForIssueBook = async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT id , bookName FROM library_book_info`)
    return res.status(200).json({ message: 'Book data for isssue book fetched successfully ! ', success: true, data: rows })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Internal server error !', success: false })
  }
}

exports.getAllStuIssueBook = async (req, res) => {
  try {
    const sql = `
      SELECT 
        st.stu_id,
        st.admissionnum,
        u.firstname,
        u.lastname,
        st.stu_img, 
        st.rollnum,
         c.class_name AS class,
        s.section_name AS section,
        COUNT(ib.id) AS issuedBook,
        SUM(CASE WHEN ib.status = 'Returned' THEN 1 ELSE 0 END) AS BookReturned,
        
        MAX(ib.takenOn) AS lastIssuedDate,   -- latest issue date
        MAX(ib.last_date) AS lastReturnDate, -- latest expected return
        GROUP_CONCAT(ib.remark SEPARATOR '; ') AS remarks -- combine remarks
      FROM libraryIssueBooks ib
      LEFT JOIN students st ON ib.rollnum = st.rollnum
      LEFT JOIN users u ON st.stu_id = u.id
      LEFT JOIN classes c ON st.class_id = c.id
      LEFT JOIN sections s ON st.section_id = s.id
      GROUP BY st.rollnum, u.firstname, u.lastname, st.stu_img, st.class_id, st.section_id
      ORDER BY st.rollnum ASC
    `;

    const [rows] = await db.query(sql);

    return res.status(200).json({
      message: "All issued book records fetched successfully!",
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error!", success: false });
  }
};

exports.getSpeStuIssueBookData = async (req, res) => {

  const { rollnum } = req.params
  if (!rollnum) {
    return res.status(403).json({ message: 'please provide valid creditinal  !', success: true })
  }

  try {

    const sql = `SELECT 

              ib.id,
              ib.takenOn,
              ib.last_date,
              ib.bookId,
              ib.status,
              b.bookImg,
              b.bookName
              FROM libraryIssueBooks ib
              LEFT JOIN library_book_info b ON ib.bookid=b.id
              WHERE ib.rollnum=?

    `

    const [rows] = await db.query(sql, [rollnum])
    return res.status(200).json({ message: 'All book fetched by student rollnumber !', success: true, data: rows })

  } catch (error) {
    console.error("Error issuing book:", error);
    return res.status(500).json({ message: "Internal server error!", success: false })
  }
}

exports.issueBook = async (req, res) => {
  try {
    const { studentRollNo, bookId, issueDate, lastDate, issuRemark, status } = req.body;

    if (!studentRollNo || !bookId || !issueDate || !lastDate) {
      return res.status(400).json({ message: "All fields are required", success: false });
    }

    if (!Array.isArray(bookId) || bookId.length === 0) {
      return res.status(400).json({ message: "At least one book must be selected", success: false });
    }

    const insertedIds = [];

    for (let i = 0; i < bookId.length; i++) {
      const currentBookId = bookId[i];

      // Check if the student already has this book issued
      const [existBook] = await db.query(
        `SELECT id 
         FROM libraryIssueBooks 
         WHERE rollnum = ? 
           AND bookid = ? 
           AND status = "Taken" 
         LIMIT 1`,
        [studentRollNo, currentBookId]
      );

      if (existBook.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Book ID ${currentBookId} is already issued and not returned!`,
        });
      }

      // Insert row for each book
      const sql = `
        INSERT INTO libraryIssueBooks 
          (rollnum, bookid, takenOn, last_date, remark, status) 
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      const FormatIssueDate = dayjs(issueDate).format('YYYY-MM-DD')
      const FormatLastDate = dayjs(lastDate).format('YYYY-MM-DD')

      const [result] = await db.query(sql, [
        studentRollNo,
        currentBookId,
        FormatIssueDate,
        FormatLastDate,
        issuRemark || "",
        status || "Taken",
      ]);

      insertedIds.push(result.insertId);
    }

    return res.status(201).json({
      message: `Books issued successfully to student rollNumber ${studentRollNo}`,
      success: true,
      issuedIds: insertedIds,
    });

  } catch (error) {
    console.error("Error issuing book:", error);
    return res.status(500).json({ message: "Internal server error!", success: false });
  }
};

exports.bookTakenByStuAndNotReturn = async (req, res) => {
  const { rollnum } = req.params;
  if (!rollnum) {
    return res.status(403).json({ message: 'Please provide rollNumber', success: false });
  }

  try {

    const sql = `
      SELECT 
          b.id AS bookId,
          b.bookName,
          MAX(lb.takenOn) AS lastIssuedDate
      FROM libraryIssueBooks lb
      LEFT JOIN library_book_info b ON lb.bookid = b.id
      WHERE lb.rollnum = ? AND lb.status = "Taken"
      GROUP BY b.id, b.bookName
      ORDER BY lastIssuedDate DESC
    `;


    const sql2 = `
      SELECT 
          MAX(ib.takenOn) AS lastIssuedDate,
          MAX(ib.last_date) AS lastReturnDate,
          st.rollnum,
          u.firstname,
          u.lastname
      FROM libraryIssueBooks ib
      LEFT JOIN students st ON ib.rollnum = st.rollnum
      LEFT JOIN users u ON st.stu_id = u.id
      WHERE ib.rollnum = ?
      GROUP BY st.rollnum
    `;

    const [rows] = await db.query(sql, [rollnum]);
    const [result] = await db.query(sql2, [rollnum]);

    return res.status(200).json({
      message: 'Not returned books fetched successfully by Rollnum',
      success: true,
      data: rows,
      summary: result[0] || null
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error!', success: false });
  }
};

exports.returnBook = async (req, res) => {
  const { studentRollNo, bookId } = req.body;

  if (!studentRollNo || !bookId || bookId.length === 0) {
    return res.status(403).json({ message: "Provide required fields" });
  }

  try {
    const sql = `
      UPDATE libraryIssueBooks
      SET status = 'Returned',
          remark = 'Book Returned',
          return_date = CURDATE(),
          updated_at = NOW()
      WHERE rollnum = ?
        AND bookid IN (?)
        AND status = 'Taken'
    `;

    // mysql2 promise query
    const [result] = await db.query(sql, [studentRollNo, bookId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "No matching books found to return",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Books returned successfully",
      success: true,
      data: result,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error!",
      success: false,
    });
  }
};







