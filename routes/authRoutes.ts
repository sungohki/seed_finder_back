import express from 'express';
import * as AC from '../controller/authController';

const router = express.Router();
router.use(express.json());

// Create
router.post('/kakao', AC.authKaKaoLoginHandler);
//
router.post('/google',AC.authGoogleLoginHandler);
//
router.post('/refresh');

export const authRouter = router;
