const router = require('express').Router()
const leaveController = require('../../Controller/leave/leaveTypeController')

router.get('/allleavetype', leaveController.getAllLeaveTypes)
router.post('/addleavetype', leaveController.addLeaveType)
router.delete('/deleteleavetype/:id', leaveController.deleteLeaveType)
router.get('/speleavetype/:id', leaveController.getLeaveTypeById)
router.put('/editleavetype/:id', leaveController.updateLeaveType)


// add leave by student ,staff , teachert 
router.post('/addleave', leaveController.addLeave)
router.get('/getallleave', leaveController.getLeaveData)
router.get('/speleavedata/:id', leaveController.getSpeLeaveData)
router.delete('/delleave/:id', leaveController.deleteLeave)
router.put('/updatestatus/:id', leaveController.updateLeaveStatus)

module.exports = router