import express from 'express';
import * as UC from '../controller/userController';

const router = express.Router();
router.use(express.json());

// Create user login token
router.post('/login', UC.userLoginHandler);
// Create user account
router.post('/join', UC.userJoinHandler);
// Create user info
router.post('/info', UC.userSurveyInfoHandler);
// Read servey options
router.get('/option', UC.userSurveyOptionHandler);
// Read servey check
router.get('/check', UC.userSurveyCheckHandler);

export const userRouter = router;
