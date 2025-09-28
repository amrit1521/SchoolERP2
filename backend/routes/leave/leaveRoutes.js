const router = require('express').Router()
const leaveController = require('../../Controller/leave/leaveTypeController')

router.get('/allleavetype' ,leaveController.getAllLeaveTypes)
router.post('/addleavetype' , leaveController.addLeaveType)
router.delete('/deleteleavetype/:id'  ,leaveController.deleteLeaveType)
router.get('/speleavetype/:id' , leaveController.getLeaveTypeById)
router.put('/editleavetype/:id' , leaveController.updateLeaveType)

module.exports = router