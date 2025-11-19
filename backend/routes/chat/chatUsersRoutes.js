
const express = require('express');
const router = express.Router();
const chatControllers = require('../../Controller/chat/chatUsersController');

router.get('/allusers' , chatControllers.allUsers)
router.get('/onlineusers' , chatControllers.onlineUsers)
router.post('/reportuser' , chatControllers.reportUser)
router.get('/getusersreportdetails' , chatControllers.getUserReports)

module.exports = router