import express from 'express';
import * as CC from '../controller/chatController';

const router = express.Router();
router.use(express.json());

// Create a message of user
router.post('/:chatroomId', CC.chatSendMessageHandler);

export const chatRouter = router;
