const express =require('express')
const teacherController = require('../../Controller/Teacher/teacherController')
const fileController = require('../../Controller/file/fileController')
const upload = require('../../multer/multer')
const router  = express.Router()


router.post('/addteacher' , teacherController.addTeacher)
router.get('/allteacher' , teacherController.allTeachers)
router.get('/teachersforoption' , teacherController.allTeachersForOption)
router.get('/speteacher/:userId' , teacherController.speTeacher)
router.put('/editteacher/:id' , teacherController.updateTeacher)
router.delete('/deleteteacher/:id' , teacherController.deleteTeacher)

router.put('/disable/:id' , teacherController.disableTeacher)
router.put('/enable/:id' , teacherController.enaableTeacher)
// upload file and delete
router.post('/upload', upload.single('teacherfile'), fileController.uploadFile);
router.delete('/deletefile/:id' , fileController.deleteFile)


module.exports = router