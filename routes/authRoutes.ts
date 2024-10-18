import express from 'express';
import * as AC from '../controller/authController';

const router = express.Router();
router.use(express.json());

// Create user's new data or token with kakao account
router.post('/kakao', AC.authKaKaoLoginHandler);
// Create user's new data or token with google account
router.post('/google', AC.authGoogleLoginHandler);
// Create user's accessToken with refreshToken
router.post('/refresh', AC.authRefreshTokenHandler);

export const authRouter = router;
