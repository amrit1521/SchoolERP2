// routes/chat/message.routes.js
const express = require('express');
const router = express.Router();
const messageController = require('../../Controller/chat/messageController');
const upload = require('../../multer/multerForChat');


// get messages of a conversation
router.get('/specoversation/:conversationId/:userId', messageController.getMessages);
router.get('/allcoversation/:userId', messageController.getLastMessageAllConverationForSpecficUser);
router.post('/send', messageController.sendMessage);
// router.post('/send-file', upload.single('chatfile'), messageController.sendFileMessage);
router.post('/send-file', upload.array('chatfile', 5), messageController.sendFileMessage);
router.delete('/delmessage/:messageId', messageController.deleteMessage)
router.put("/star/:messageId", messageController.toggleStarMessage);
router.put("/report/:messageId", messageController.toggleReportMessage);
router.post("/react/:messageId", messageController.toggleOneToOneReaction);




module.exports = router;
