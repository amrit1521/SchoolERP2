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

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }

    cb(null, folder);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + unique + ext);
  }
});

const allowedTypes = [
  "image/jpeg", "image/png", "image/jpg",
  "video/mp4", "video/mkv", "video/webm",
  "audio/mpeg", "audio/wav", "audio/ogg", "audio/webm",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];

const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Allowed: images, videos, audios, documents."), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1*1024 * 1024 * 1024, files: 5 }
});

module.exports = upload;
