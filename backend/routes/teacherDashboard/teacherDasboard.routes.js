const express = require("express");
const router = express.Router();
const teacherDashboardController = require("../../Controller/teacherDashboard/teacherDashboardController");

router.get('/getspecteacher-attendance/:id',teacherDashboardController.getSpecTeacherAttendance);



module.exports = router;