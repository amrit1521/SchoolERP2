const express = require("express");
const router = express.Router();
const notificationController = require("../../Controller/Notification/notificationController");
const fileController = require("../../Controller/file/fileController");
const upload = require("../../multer/multer");

// notice route
router.post("/create-notice", notificationController.addNotice);
router.post("/upload", upload.single("noticefile"), fileController.uploadFile);
router.get("/all-notice", notificationController.getAllNotice);
router.post('/delete-notice',notificationController.deleteNotice);
router.patch('/update-notice',notificationController.updateNotice);

//event route:
router.post('/create-event',notificationController.createEvent);
router.get('/all-event',notificationController.getAllEvents);
router.patch('/update-event',notificationController.updateEvent);
router.post('/delete-event',notificationController.deleteEvent);
router.post("/event/upload", upload.single("eventfile"), fileController.uploadFile);
router.get('/upcomming-events',notificationController.getUpcomingEvents);
router.get('/spec-upcomming-events/:rollId',notificationController.getUpcomingEventsForSpecRole);

module.exports = router;
