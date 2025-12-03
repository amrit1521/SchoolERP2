// routes/chat/chat.routes.js
const express = require('express');
const router = express.Router();
const chatControllers = require('../../Controller/chat/chatController');

router.post('/create-private', chatControllers.createPrivateConversation);
router.post('/create-group', chatControllers.createGroupConversationViaPermission);
router.get('/:conversationId/members', chatControllers.getConversationMembers);
router.put('/removemem/:conversationId', chatControllers.removeMemberFromGroup)
router.post('/addmember/:conversationId', chatControllers.addMemberToGroup)
// router.get('/:userId', chatControllers.getUserConversations); 
router.delete('/delroom/:conversationId', chatControllers.deleteRoom)
router.delete('/clearroom/:conversationId', chatControllers.clearRoomChat)

module.exports = router;
