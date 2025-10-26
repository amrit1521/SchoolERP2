const express = require("express");
const router = express.Router();
const notificationController = require("../../Controller/Notification/notificationController");
const fileController = require("../../Controller/file/fileController");
const upload = require("../../multer/multer");

router.post("/create-notice", notificationController.addNotice);
router.post("/upload", upload.single("noticefile"), fileController.uploadFile);
router.get("/all-notice", notificationController.getAllNotice);

module.exports = router;
