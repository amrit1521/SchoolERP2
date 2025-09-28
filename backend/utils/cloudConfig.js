
const {CloudinaryStorage} = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = "uploads";

    if (file.mimetype === "application/pdf") {
      folder = "uploads/documents";
    } else if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      folder = "uploads/images";
    }

    return {
      folder: folder,
      allowed_formats: ["png", "jpg", "jpeg", "pdf"], 
      public_id: file.fieldname + "-" + Date.now(),   // optional custom name
    };
  },
});

export { cloudinary, storage };