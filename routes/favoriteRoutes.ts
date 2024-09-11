import express from 'express';
import {
  FavoriteAddHandler,
  FavoriteDeleteHandler,
  FavoritePersonalListHandler,
} from '../controller/favoriteController';

const router = express.Router();
router.use(express.json());

// Create user-business like relation
router.post('/add/:businessId', FavoriteAddHandler);
// Delete user-business favorite relation
router.delete('/delete/:businessId', FavoriteDeleteHandler);
// Read personal user-business entities
router.get('/list', FavoritePersonalListHandler);

export const favoriteRouter = router;
