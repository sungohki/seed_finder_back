import express from 'express';
import * as CRC from '../controller/chatroomController';

const router = express.Router();
router.use(express.json());

// Read list of chatrooms
router.get('/all', CRC.chatroomGetAllHandler);
// Read the chatroom
router.get('/:chatroomId', CRC.chatroomGetOneHandler);
// Create new chatroom
router.post('/create', CRC.chatroomCreateOneHandler);

export const chatroomRouter = router;
