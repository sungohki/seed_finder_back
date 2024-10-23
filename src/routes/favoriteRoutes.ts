import express from 'express';
import * as FC from '../controller/favoriteController';

const router = express.Router();
router.use(express.json());

// Create user-business like relation
router.post('/add/:businessId', FC.FavoriteAddHandler);
// Delete user-business favorite relation
router.delete('/delete/:businessId', FC.FavoriteDeleteHandler);
// Read personal user-business entities
router.get('/list', FC.FavoritePersonalListHandler);

export const favoriteRouter = router;
