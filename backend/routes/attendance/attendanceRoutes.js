const express = require('express')
const attendanaceController = require('../../Controller/attendance/attendanceCntroller')




const router = express.Router()

router.post('/markstuattendance' , attendanaceController.markStudentAttendance)
router.get('/getstuattendance/:rollno' , attendanaceController.getStudentAttendanceData)

// staff attendance
router.post('/markstaffattendance' , attendanaceController.markStaffAttendance)
router.get('/getstaffattendance/:staffid' , attendanaceController.getStaffAttendanceData)

// teacher attendance
router.get('/getteacherattendance/:teacher_id' , attendanaceController.getTeacherAttendanceData)

module.exports = router