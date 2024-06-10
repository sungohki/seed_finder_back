import express from 'express';

const router = express.Router();
router.use(express.json());

router.post('/join', () => {});
router.post('/login', () => {});
router.post('/info', () => {});
router.put('/info', () => {});

export default router;
