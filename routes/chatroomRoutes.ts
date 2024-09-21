import express from 'express';
// import {} from '../controller/';

const router = express.Router();
router.use(express.json());

// Read list of chatrooms
router.get('/all');
// Read one of chatrooms
router.get('/:businessId');
// Create new chatroom
router.post('/create');

export const chatroomRouter = router;
