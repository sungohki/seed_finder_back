import express from 'express';
import {} from '../controller/likeController';

const router = express.Router();
router.use(express.json());

// Create user-business like relation
router.post('/add/:businessId');
// Delete user-business like relation
router.delete('/delete/:businessId');
// Read personal user-business entities
router.get('/list');

export const likeRouter = router;
