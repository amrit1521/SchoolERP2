const express = require('express')
const studentController = require('../../Controller/student/studentController')
const fileController = require('../../Controller/file/fileController')
const upload = require('../../multer/multer')


const router = express.Router()

router.post('/add', studentController.addStudent);
router.get('/', studentController.allStudents)
router.get('/spedetails/:rollnum', studentController.specificDetailsStu)
router.get('/studataforedit/:rollnum', studentController.getStudentByRollnumForEdit)
router.put('/editstu/:rollnum', studentController.updateStudent)
router.delete(`/deletestu/:rollnum`, studentController.deleteStudent)
router.get('/getstubytoken/:userId' , studentController.getStuByToken)
// filter students
router.post('/filterstudents', studentController.filterStudents)
router.post('/filterstudentsforoption', studentController.filterStudentsForOption)
router.post('/filterstudentsforparmotion' , studentController.filterStudentsForParmotion)
router.post('/parmotestudents' , studentController.promoteStudents)

// disable student 
router.put('/disable/:rollnum', studentController.disableStudent)
// enable student
router.put('/enable/:rollnum', studentController.enableStudent)
// student report
router.get('/stureport', studentController.studentReport)
// students leave report
router.get('/stuleavereport', studentController.studentLeaveReport)

// timetable
router.get('/timetable/:rollnum', studentController.getTimeTable)
// leave
router.get('/leavedata/:rollnum', studentController.getStuLeaveData)

// for option
router.get('/stuforoption'  ,studentController.studentForOption)
router.get('/stuforoption2'  ,studentController.studentForOption2)

// file upload and delete
router.post('/upload', upload.single('stufile'), fileController.uploadFile);
router.delete('/deletefile/:id', fileController.deleteFile)

module.exports = router