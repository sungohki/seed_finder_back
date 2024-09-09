import express from 'express';
import {
  userLoginHandler,
  userJoinHandler,
  userSurveyInfoHandler,
  userSurveyOptionHandler,
  userSurveyCheckHandler,
} from '../controller/userController';
import { userTestToken } from '../services/user';

const router = express.Router();
router.use(express.json());

// Create user login token
router.post('/login', userLoginHandler);
// Create user account
router.post('/join', userJoinHandler);
// Create user info
router.post('/info', userSurveyInfoHandler);
// Read servey options
router.get('/option', userSurveyOptionHandler);

// Read servey check
router.get('/check', userSurveyCheckHandler);

// test
router.get('/test', userTestToken);

export const userRouter = router;
