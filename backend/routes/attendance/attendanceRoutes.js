const express = require('express')
const attendanaceController = require('../../Controller/attendance/attendanceCntroller')




const router = express.Router()

router.post('/markattendance' , attendanaceController.markAttendance)

router.get('/getattendancedetail/:rollno' , attendanaceController.getStudentAttendanceData)

module.exports = router