import express from 'express';
import {
  LikeAddHandler,
  LikeDeleteHandler,
  LikePersonalListHandler,
} from '../controller/likeController';

const router = express.Router();
router.use(express.json());

// Create user-business like relation
router.post('/add/:businessId', LikeAddHandler);
// Delete user-business like relation
router.delete('/delete/:businessId', LikeDeleteHandler);
// Read personal user-business entities
router.get('/list', LikePersonalListHandler);

export const likeRouter = router;
