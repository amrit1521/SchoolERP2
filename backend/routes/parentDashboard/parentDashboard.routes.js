const express = require('express')
const parentDashboardController = require('../../Controller/parentDashboard/parentDashboardController');

const router = express.Router()

router.get('/getparentdatabyparendid/:userId',parentDashboardController.getParentDataByParentId);
router.get('/gettotalavailableleaves/:userId',parentDashboardController.getAvailableLeave);
router.get('/getallchildrenofparent/:userId',parentDashboardController.getAllStudentsOfParents);
router.get('/getallmychildhomework/:userId',parentDashboardController.getAllMyChildrenHomeWork);
router.get('/getallmychildattendance/:userId',parentDashboardController.getAllChildAttendance);
router.get('/getallmychildfeereminder/:userId',parentDashboardController.getAllChildrenFeeReminder);
router.get('/getallchildleavedata/:userId',parentDashboardController.getAllChildLeaveData);
router.get('/getallchildtimetable/:userId',parentDashboardController.getTimeTableForAllChild);
router.get('/getallchildfeedetails/:userId',parentDashboardController.getFeesDeatilsOfAllChild);
router.get('/getexamresultofallchild/:userId',parentDashboardController.getExamResultOfAllChild);

module.exports = router;