const express = require('express')
const studentController = require('../../Controller/student/studentController')
const fileController = require('../../Controller/file/fileController')
const upload = require('../../multer/multer')


const router = express.Router()

router.post('/add', studentController.addStudent);
router.get('/', studentController.allStudents)
router.get('/spedetails/:id', studentController.specificDetailsStu)
router.get('/studataforedit/:id', studentController.getStudentByIdForEdit)
router.put('/editstu/:id', studentController.updateStudent)
router.delete(`/deletestu/:id`, studentController.deleteStudent)
// filter students
router.post('/filterstudents', studentController.filterStudents)

// disable student 
router.put('/disable/:id', studentController.disableStudent)
// enable student
router.put('/enable/:id', studentController.enableStudent)
// student report
router.get('/stureport', studentController.studentReport)
// students leave report
router.get('/stuleavereport', studentController.studentLeaveReport)

// timetable
router.get('/timetable/:id', studentController.getTimeTable)

// leave
router.post('/addleave', studentController.addStudentLeave)
router.get('/leavedata/:rollnum', studentController.getStuLeaveData)



// file upload and delete
router.post('/upload', upload.single('stufile'), fileController.uploadFile);
router.delete('/deletefile/:id', fileController.deleteFile)

module.exports = router