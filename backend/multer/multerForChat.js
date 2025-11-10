// middlewares/upload.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "uploads/others"; 
    
    if (file.mimetype.startsWith("image/")) {
      folder = "uploads/image";
    } else if (file.mimetype.startsWith("video/")) {
      folder = "uploads/video";
    } else if (file.mimetype.startsWith("audio/")) {
      folder = "uploads/audio";
    } else if (
      file.mimetype === "application/pdf" ||
      file.mimetype.includes("word") ||
      file.mimetype.includes("officedocument")
    ) {
      folder = "uploads/document";
    }

    // Create folder if missing
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }

    cb(null, folder);
  },

  filename: (req, file, cb) => {
    const suffix = Date.now() + path.extname(file.originalname);
    cb(null, file.fieldname + "-" + suffix);
  }
});

const fileFilter = (req, file, cb) => {
  // console.log(file.mimetype)
  const allowedTypes = [
    "image/jpeg", "image/png", "image/jpg",
    "video/mp4", "video/mkv", "video/webm",
    "audio/mpeg", "audio/wav", "audio/ogg","audio/webm",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Allowed: images, videos, audios, documents."), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }
});

module.exports = upload;
