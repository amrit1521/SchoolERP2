
const db = require('../../config/db')
const path = require('path')
const fs = require('fs')

exports.uploadFile= async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "File is required!",
        success: false
      });
    }

    const uploadfile = req.file.filename;
    const folder = req.file.mimetype.includes("image") ? "image" : "document"; 


    const sql = `INSERT INTO files (filename, folder) VALUES (?, ?)`;
    const [result] = await db.query(sql, [uploadfile, folder]);

    res.status(200).json({
      message: "File uploaded successfully!",
      file: uploadfile,
      success: true,
      insertId: result.insertId
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Something went wrong while uploading the file",
      error: error.message,
      success: false
    });
  }
};

// DELETE FILE
exports.deleteFile = async (req, res) => {
  const id = req.params.id;
  try {
   
    const [rows] = await db.query(`SELECT filename, folder FROM files WHERE id = ?`, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "File not found in database", success: false });
    }

    const filename = rows[0].filename;
    const folder = rows[0].folder; 
    const filePath = path.join(__dirname, `../uploads/${folder}`, filename);

   
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

   
    await db.query(`DELETE FROM files WHERE id = ?`, [id]);

    res.status(200).json({
      message: "File deleted successfully",
      success: true
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error deleting file",
      error: error.message,
      success: false
    });
  }
};