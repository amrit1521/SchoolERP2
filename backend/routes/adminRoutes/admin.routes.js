const express = require('express')
const adminDashboardController = require('../../Controller/adminDashboard/adminDashboardController')




const router = express.Router();

router.get('/getrolecountforrole',adminDashboardController.getRoleCountForRole);
router.get('/gettotalsubjectcounts',adminDashboardController.getTotalSubjectCount);
router.get('/gettoday-student-attendancecount',adminDashboardController.getTodayStudentAttendanceCount);
router.get('/gettoday-teacher-attendancecount',adminDashboardController.getTodayTeacherAttendanceCount);
router.get('/gettoday-staff-attendancecount',adminDashboardController.getTodayStaffAttendanceCount);
router.get('/getleaverequest',adminDashboardController.getLeaveRequest);
router.patch('/actionleaverequest/:id',adminDashboardController.ActionOnLeaveRequest);

module.exports = router;