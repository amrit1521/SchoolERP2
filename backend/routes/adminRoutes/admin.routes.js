const express = require('express')
const adminDashboardController = require('../../Controller/adminDashboard/adminDashboardController')




const router = express.Router();

router.get('/getrolecountforrole',adminDashboardController.getRoleCountForRole);
router.get('/gettotalsubjectcounts',adminDashboardController.getTotalSubjectCount);
router.get('/gettoday-student-attendancecount',adminDashboardController.getTodayStudentAttendanceCount);
router.get('/gettoday-teacher-attendancecount',adminDashboardController.getTodayTeacherAttendanceCount);
router.get('/gettoday-staff-attendancecount',adminDashboardController.getTodayStaffAttendanceCount);


module.exports = router;