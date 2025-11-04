// routes/chat/message.routes.js
const express = require('express');
const router = express.Router();
const messageController = require('../../Controller/chat/messageController');
const upload = require('../../multer/multer');


// get messages of a conversation
router.get('/specoversation/:conversationId', messageController.getMessages);
router.get('/allcoversation/:userId', messageController.getLastMessageAllConverationForSpecficUser);
router.post('/send', messageController.sendMessage);
// endpoint for file upload + message send
router.post('/send-file', upload.single('chatfile'), messageController.sendFileMessage);

module.exports = router;
