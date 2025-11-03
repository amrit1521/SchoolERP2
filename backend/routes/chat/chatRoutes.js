// routes/chat/chat.routes.js
const express = require('express');
const router = express.Router();
const chatControllers = require('../../Controller/chat/chatController');

router.post('/create-private', chatControllers.createPrivateConversation);
router.post('/create-group', chatControllers.createGroupConversation);
router.post('/:conversationId/add-member', chatControllers.addMemberToConversation);
router.get('/:conversationId/members', chatControllers.getConversationMembers);
// router.get('/:userId', chatControllers.getUserConversations); 

module.exports = router;
