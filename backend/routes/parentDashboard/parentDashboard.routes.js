const express = require('express')
const parentDashboardController = require('../../Controller/parentDashboard/parentDashboardController');

const router = express.Router()

router.get('/getparentdatabyparendid/:userId',parentDashboardController.getParentDataByParentId);
router.get('/gettotalavailableleaves/:userId',parentDashboardController.getAvailableLeave);
router.get('/getallchildrenofparent/:userId',parentDashboardController.getAllStudentsOfParents);

module.exports = router;