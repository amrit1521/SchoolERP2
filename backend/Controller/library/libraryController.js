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

    const baseUrl = `${req.protocol}://${req.get("host")}/api/stu/uploads`;

    const sql = `SELECT id, img_src, folder, name, cardno, email, date_of_join, phone_no 
                 FROM librarymember 
                 ORDER BY created_at DESC`;

    const [rows] = await db.query(sql);


    const members = rows.map(member => ({
      ...member,
      image_url: `${baseUrl}/${member.folder}/${member.img_src}`
    }));

    return res.status(200).json({
      success: true,
      message: "All library members fetched successfully!",
      data: members
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error!"
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
      message: "Member and image deleted successfully!",
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

  if (!req.file) {
    return res.status(400).json({
      message: "Book Image is required!",
      success: false
    });
  }
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
    } = req.body;

    const uploadfile = req.file.filename;
    const folder = req.file.mimetype.includes("image") ? "image" : "document";

    // validate required fields
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
      !postDate
    ) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    // insert query
    const [result] = await db.execute(
      `INSERT INTO library_book_info 
        (img_src , folder,bookNo, bookName, rackNo, publisher, author, subject, qty, available, price, postdate) 
       VALUES (?,?,?, ?, ?, ?, ?, ?, ?, ?,?, ?)`,
      [uploadfile, folder, bookNo, bookName, rackNo, publisher, author, subject, qty, available, price, postDate]
    );

    return res.status(201).json({
      message: "Book added successfully",
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
      "SELECT id,bookNo, bookName, rackNo, publisher, author, subject, qty, available, price, postDate FROM library_book_info ORDER BY id ASC"
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
        st.class,
        st.section,
        st.rollnum,
        
        COUNT(ib.id) AS issuedBook,
        SUM(CASE WHEN ib.status = 'Returned' THEN 1 ELSE 0 END) AS BookReturned,
        
        MAX(ib.takenOn) AS lastIssuedDate,   -- latest issue date
        MAX(ib.last_date) AS lastReturnDate, -- latest expected return
        GROUP_CONCAT(ib.remark SEPARATOR '; ') AS remarks -- combine remarks
      FROM libraryIssueBooks ib
      LEFT JOIN students st ON ib.rollnum = st.rollnum
      LEFT JOIN users u ON st.stu_id = u.id
      GROUP BY st.rollnum, u.firstname, u.lastname, st.stu_img, st.class, st.section
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
              b.img_src,
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
      const [result] = await db.query(sql, [
        studentRollNo,
        currentBookId,
        issueDate,
        lastDate,
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







