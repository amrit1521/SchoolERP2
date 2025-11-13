const express = require("express");
const router = express.Router();
const teacherDashboardController = require("../../Controller/teacherDashboard/teacherDashboardController");

router.get('/getspecteacher-attendance/:id',teacherDashboardController.getSpecTeacherAttendance);
router.get('/getspecteacher-detail/:userId',teacherDashboardController.getSpeTeacherDetails);



module.exports = router;