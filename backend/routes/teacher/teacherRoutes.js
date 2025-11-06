const express = require('express')
const teacherController = require('../../Controller/Teacher/teacherController')
const fileController = require('../../Controller/file/fileController')
const upload = require('../../multer/multer')
const router = express.Router()




router.get('/allteacherforattendance',teacherController.allTeachersForAttendance)

router.post('/addteacher', teacherController.addTeacher)
router.get('/allteacher', teacherController.allTeachers)
router.get('/teachersforoption', teacherController.allTeachersForOption)
router.get('/speteacher/:teacher_id', teacherController.speTeacher)
router.get('/teacherdataforedit/:teacher_id' , teacherController.teacherDataForEdit)
router.put('/editteacher/:teacher_id', teacherController.updateTeacher)
router.delete('/deleteteacher/:teacher_id', teacherController.deleteTeacher)
router.get(`/getteacbytoken/:userId` , teacherController.getTeacherByToken)
router.get('/teacherleavereport' , teacherController.teacherLeaveReport)

router.put('/disable/:teacher_id', teacherController.disableTeacher)
router.put('/enable/:teacher_id', teacherController.enableTeacher)

// leave information
router.get('/leavedata/:teacher_id', teacherController.getTeacherLeaveData)
// upload file and delete
router.post('/upload', upload.single('teacherfile'), fileController.uploadFile);
router.delete('/deletefile/:id', fileController.deleteFile)

module.exports = router