const express = require('express')
const attendanaceController = require('../../Controller/attendance/attendanceCntroller')




const router = express.Router()

router.post('/markstuattendance' , attendanaceController.markStudentAttendance)
router.get('/getstuattendance/:rollno' , attendanaceController.getStudentAttendanceData)
router.get('/getstuattendancereport' , attendanaceController.getStuAttendanceReport)
router.get('/getdailyclassattendancereport',attendanaceController.getDailyClassAttendanceReport)
router.get('/getdailystudentattendancereport',attendanaceController.getDailyStudentAttendanceReport)

// staff attendance
router.post('/markstaffattendance' , attendanaceController.markStaffAttendance)
router.get('/getstaffattendance/:staffid' , attendanaceController.getStaffAttendanceData)
router.get('/getdailystaffattendancereport' , attendanaceController.getDailyStafftAttendanceReport)
router.get('/getstaffattendancereport' , attendanaceController.getStaffAttendanceReport)

// teacher attendance
router.get('/getteacherattendance/:teacher_id' , attendanaceController.getTeacherAttendanceData)
router.post('/markteacherattendance' , attendanaceController.markTeacherAttendance)
router.get('/getdailyteacherattendancereport' , attendanaceController.getDailyTeacherAttendanceReport)
router.get('/getteacherattendancereport' , attendanaceController.getTeacherAttendanceReport)

//student role:
router.get('/getstuattendances/:userId' , attendanaceController.getStuAttendance)


module.exports = router