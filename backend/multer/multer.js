const multer = require("multer");
const path = require("path");

// Storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      
        if (file.mimetype === "application/pdf") {
            cb(null, "uploads/document");
        } else if (
            file.mimetype === "image/jpg" ||
            file.mimetype === "image/png" ||
            file.mimetype === "image/jpeg"
        ) {
            cb(null, "uploads/image");
        } else {
            cb(new Error("Unsupported file type"), false);
        }
    },

    filename: (req, file, cb) => {
        const suffix = Date.now() + path.extname(file.originalname);
        cb(null, file.fieldname + "-" + suffix);
    }
});

// File filter to allow PDF & image formats
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        "image/jpg",
        "image/jpeg",
        "image/png",
        "application/pdf"
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only .jpg, .jpeg, .png, and .pdf formats are allowed"), false);
    }
};

// Multer instance
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 4 * 1024 * 1024 }
});

module.exports = upload;
