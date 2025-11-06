
const express = require('express');
const router = express.Router();
const chatControllers = require('../../Controller/chat/chatUsersController');

router.get('/allusers' , chatControllers.allUsers)

module.exports = router