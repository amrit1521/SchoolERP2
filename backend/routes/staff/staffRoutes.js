
const express = require('express')
const fileController = require('../../Controller/file/fileController')
const staffController = require('../../Controller/staff/staffController')
const upload = require('../../multer/multer')
const router = express.Router()


router.post('/addstaff' , staffController.addStaff)
router.get('/spedetailsforallstaff' , staffController.fetchSpeDetailsAllStaff)
router.get('/spestaffdetails/:staffid' , staffController.fetchSpecficStaffDeatils)
router.get('/staffforedit/:staffid' , staffController.fetchStaffDataForEditById)
router.put('/editstaff/:staffid' , staffController.updateStaff)
router.delete('/deletestaff/:staffid' , staffController.deleteStaff)
router.post('/filterstaff' , staffController.filterSpeDetailsAllStaff)
router.get('/staffleavereport' , staffController.staffLeaveReport)

// leave
router.get('/leavedata/:staffid', staffController.getStaffLeaveData)


// upload files
router.post('/upload', upload.single('stafffile'), fileController.uploadFile);
router.delete('/deletefile/:id', fileController.deleteFile)


module.exports = router